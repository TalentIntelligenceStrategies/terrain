/* surfaces/work — the working surface's own chrome. platform.md §4.2.
 *
 * The head: the project's name and the scope chip. Everything INSIDE the
 * columns belongs to list.mjs and record.mjs; this is only what sits above
 * them.
 *
 * THE PROJECT'S NAME IS NOT NEW AND THAT IS THE WHOLE ARGUMENT. The working
 * screen's own title has printed it since the dashboard was built — the project
 * takes its name from what the founder described, so printing it here is not
 * inventing a name, it is showing them their own words back.
 *
 * WHAT LEFT ON 2026-09-23. Four handlers lived here and all four were the map's:
 * the Market/Technology page toggle, the cell click that filtered the list, its
 * clear control, and the column tracker. The analysis surfaces are gone and so
 * are they.
 *
 * The roving tab stop went with them and is COMING BACK, to the fishbone — one
 * tab stop for a group whose members are arrowed between is the same rule
 * whether the group is a grid of cells or a tree of nodes. core/roving.mjs is
 * untouched and currently has no caller.
 */
import { $ } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { btnWait, btnRest } from '../core/button-wait.mjs';
import { say } from '../core/live-region.mjs';
import { read as readSettings } from './settings.mjs';
import { popover, infoPopovers } from '../core/popover.mjs';

let ENGINE = null;

/* ── the toggles ──────────────────────────────────────────────────────────
   THE FISHBONE IS NOT A VIEW MODE, and that is the one structural fact worth
   getting right here. Their toolbar looks like three controls in a row and is
   not: the grouping opens and closes independently, and either list rendering
   can sit beside it. So it is its own control and the two renderings are one
   group — which is also what their message table says, viewMode having
   exactly two members.

   IT WAS A HALF OF THE SPLIT AND IS A POPOVER SINCE 2026-09-24. This function
   used to flip `hidden` on a column host and on the idle sentence beside it;
   the record took that column, so the panel is anchored to its own trigger
   now and core/popover.mjs owns everything this hand-rolled: aria-expanded,
   the escape stack, the outside click, and moving focus in. Four things, all
   of which a hand-rolled toggle still opens and closes correctly without.

   aria-EXPANDED, NOT aria-PRESSED. Pressed describes a control that stays
   down; expanded describes one that reveals something and names what. The
   markup changed with it. */
function fishPopover() {
  const btn = $('#fishToggle'), panel = $('#fishPop');
  if (!btn || !panel) return null;
  return popover({
    btn, panel, key: 'fishPop',
    /* THE PANEL ASKS FOR ITS OWN DATA THE FIRST TIME IT IS SHOWN, and this
       event is still how: a grouping nobody opened is an engine run nobody
       asked for, and work.mjs has no business knowing what fishbone.mjs
       needs. */
    onOpen: () => {
      window.dispatchEvent(new CustomEvent('terrain:grouping-shown'));
      say('work', 'Grouping open.');
    },
  });
}

/* ══ `data-mode` DRIVES THE LIST, AND IT USED TO DRIVE THE RECORD ══════════
   It drove NOTHING for the first week — written by this function and read by
   no rule and no module, so both buttons flipped an aria-pressed and changed
   the screen in no other way. Then it was pointed at the record, which made it
   real and left it mis-scoped: a control in the surface-wide search bar that
   governed one of two columns, and platform.md had to admit in writing that it
   "does nothing until a record is open".

   A CONTROL'S PLACEMENT ZONE IS PART OF ITS MEANING. This one sits in the bar
   over the whole surface and its group label reads "How much of each patent to
   show" — EACH PATENT, which is a list-wide phrase. So it governs the list:
   `Drawings only` strips every row to its drawings, `Details and drawings`
   puts the text back. The record always shows everything, because the record
   IS the detailed view and it has the lightbox for a drawing worth enlarging.

   IT REFUSES WHAT IT CANNOT DO, re-aimed. The gate was "does the open record
   have figures", asked of a control that is not the record's. It is now "does
   anything in this result set have a drawing" — a mode that emptied the list
   to show nothing would be the toggle reporting a fault in itself. Announced,
   because the button stays focused and there is no other signal. */
function setMode(which) {
  if (which === 'images' && !document.querySelector('#setList .set-thumbs')) {
    say('work', 'None of these results has drawings.');
    return;
  }
  [['modeText', 'text'], ['modeImages', 'images']].forEach(([id, key]) => {
    const b = $('#' + id);
    if (b) b.setAttribute('aria-pressed', String(key === which));
  });
  const split = $('#workSplit');
  if (split) split.setAttribute('data-mode', which);
  say('work', which === 'images'
    ? 'Showing the drawings only.'
    : 'Showing the details and the drawings.');
}

export function init(ctx) {
  ENGINE = ctx.engine;

  ctx.onRoute(view => {
    if (view !== 'work') return;

    ENGINE.projects().then(res => {
      if (!res.ok) return;
      const cur = (res.data.projects || []).find(p => p.current);
      const t = $('#dashTitle');
      if (t && cur && cur.label) t.textContent = cur.label;
    });
  });

  fishPopover();
  /* THE NOTES ON THIS SURFACE, both of them: the results heading's and the
     record's. They are wired here rather than in list.mjs and record.mjs
     because neither is a list row or a record field — they are chrome on the
     work surface, which is what this module owns. */
  infoPopovers($('.view-work'));
  onActivate(document, '#modeText', () => setMode('text'));
  onActivate(document, '#modeImages', () => setMode('images'));

  /* SEARCHING AGAIN FROM THE RESULTS. The bar is the same component as the
     home surface's and it charges the same way -- this is a run, not a filter,
     and platform.md §7.2's refund rule applies to it identically. */
  const field = $('#resQuery'), btn = $('#resSearch');
  if (field && btn) {
    field.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
      e.preventDefault();
      btn.click();
    });
  }
  onActivate(document, '#resSearch', async b => {
    const text = field && field.value.trim();
    if (!text) return;
    btnWait(b, true);
    const res = await ENGINE.search({ query: text, settings: readSettings() });
    btnRest(b);
    if (!res.ok) {
      say('work', 'The search did not run. Nothing was charged.');
      return;
    }
    const meta = $('#resMeta');
    if (meta && res.data.matched != null) {
      meta.textContent = res.data.matched + ' results'
        + (res.data.elapsedMs != null
            ? ' \u00b7 ' + (res.data.elapsedMs / 1000).toFixed(2) + ' s' : '');
    }
    /* the list owns its own rendering; tell it to reload rather than reaching
       across into its DOM from here. */
    window.dispatchEvent(new CustomEvent('terrain:searched'));
  });
}
