/* surfaces/work — the working surface's own chrome. platform.md §6.2.
 *
 * The head: the project's name, the version bar, the scope chip. Everything
 * INSIDE the columns belongs to list.mjs, fishbone.mjs and record.mjs; this is
 * only what sits above them.
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

let ENGINE = null;

/* ── the toggles ──────────────────────────────────────────────────────────
   THE FISHBONE IS NOT A VIEW MODE, and that is the one structural fact worth
   getting right here. Their toolbar looks like three controls in a row and is
   not: the grouping shows or hides independently, and either list rendering
   can sit beside it. So the fishbone is its own aria-pressed toggle and the
   two renderings are one group — which is also what their message table says,
   viewMode having exactly two members. */
function toggleFishbone(btn) {
  const on = btn.getAttribute('aria-pressed') !== 'true';
  btn.setAttribute('aria-pressed', String(on));
  btn.setAttribute('aria-label', on ? 'Hide the grouping' : 'Show the grouping');
  const wrap = $('#fishWrap'), idle = $('#paneIdle');
  if (wrap) wrap.hidden = !on;
  if (idle) idle.hidden = on;
  say('work', on ? 'Grouping shown.' : 'Grouping hidden.');
}

function setMode(which) {
  [['modeText', 'text'], ['modeImages', 'images']].forEach(([id, key]) => {
    const b = $('#' + id);
    if (b) b.setAttribute('aria-pressed', String(key === which));
  });
  const split = $('#workSplit');
  if (split) split.setAttribute('data-mode', which);
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

  onActivate(document, '#fishToggle', el => toggleFishbone(el));
  onActivate(document, '#modeText', () => setMode('text'));
  onActivate(document, '#modeImages', () => setMode('images'));

  /* SEARCHING AGAIN FROM THE RESULTS. The bar is the same component as the
     home surface's and it charges the same way -- this is a run, not a filter,
     and platform.md §9.2's refund rule applies to it identically. */
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
    btnWait(b);
    const res = await ENGINE.search({ query: text });
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
