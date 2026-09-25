/* surfaces/masthead — the 48px bar. platform.md §4.1.
 *
 * The brand, the project switcher, the points meter, the profile menu. It sits
 * OUTSIDE the stage and persists across every view swap — platform.md §2:
 * the four moments run over two surfaces on the path, not four screens, and a
 * bar that reloaded between them would say otherwise.
 */
import { $, $$, esc } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { push, drop } from '../core/esc-stack.mjs';
import { bar } from '../core/primitives.mjs';
import { focusQuietly } from '../core/focus.mjs';
import * as Starred from '../core/starred.mjs';

let ENGINE = null;

/* ── a menu that closes on Escape, on outside click, and on a second press ──
   IT TOGGLES A CLASS ON #app, NOT [hidden] ON THE PANEL, and that was a real
   defect rather than a style choice. .mast-menu ships opacity:0 and
   visibility:hidden, and 14-menu.css reveals it through `.proj-open #projMenu`
   and `.menu-open #acctMenu` — an ancestor class. Clearing [hidden] removes
   display:none and leaves both dropdowns invisible, which is exactly what they
   were. The prototype always did it this way; the extraction did not.

   ONLY ONE MAY BE OPEN. 14-menu.css says so, and two dropdowns anchored to the
   same 48px bar overlap whatever is in them. Opening one closes the other.

   The stack is what makes that safe: Escape closes the MOST RECENT, not
   whichever remembered to bind a handler. */
const MENU_CLASS = { projMenu: 'proj-open', acctMenu: 'menu-open' };

function menu(btn, panel, key) {
  if (!btn || !panel) return;
  const app = document.getElementById('app') || document.body;
  const cls = MENU_CLASS[key];

  const close = () => {
    if (!app.classList.contains(cls)) return;
    app.classList.remove(cls);
    btn.setAttribute('aria-expanded', 'false');
    drop(key);
  };
  const open = () => {
    /* close the sibling first — one open menu, and its own stack entry goes */
    Object.entries(MENU_CLASS).forEach(([k, c]) => {
      if (k !== key && app.classList.contains(c)) { app.classList.remove(c); drop(k); }
    });
    app.classList.add(cls);
    btn.setAttribute('aria-expanded', 'true');
    push(key, close);
    const first = panel.querySelector('[role="menuitem"], button, a');
    if (first) focusQuietly(first);
  };

  btn.setAttribute('aria-expanded', 'false');
  panel.hidden = false;                 /* visibility is the class's job now */
  btn.addEventListener('click', e => {
    e.stopPropagation();
    app.classList.contains(cls) ? close() : open();
  });
  document.addEventListener('click', e => {
    if (!app.classList.contains(cls)) return;
    if (!panel.contains(e.target) && !btn.contains(e.target)) close();
  });
  return { open, close };
}

export function init(ctx) {
  ENGINE = ctx.engine;

  menu($('#projBtn'), $('#projMenu'), 'projMenu');
  menu($('#profileBtn'), $('#acctMenu'), 'acctMenu');

  /* ── the project switcher ───────────────────────────────────────────────
     AN EMPTY LIST IS NOT A LIST OF BARS. design-language.md §8: a bar says a
     value exists and is being withheld; a list with nothing in it has no
     values to withhold. Three grey rows where a founder has no projects would
     claim they have three projects whose names we decline to print. */
  ENGINE.projects().then(res => {
    const a = $('#projGroupA');
    if (!a) return;
    if (!res.ok) {
      a.innerHTML = '<p class="side-empty t-body">Your projects did not load.</p>';
      return;
    }
    const list = res.data.projects || [];
    if (!list.length) {
      a.innerHTML =
        '<p class="side-empty t-body">No projects yet. Describe what you are ' +
        'building and the first one is made for you.</p>';
      return;
    }
    a.innerHTML = list.map(p =>
      '<button class="side-item' + (p.current ? ' is-current' : '') +
      '" type="button" role="menuitem" data-proj="' + esc(p.id) + '">' +
      /* null means render the bar, and it is the only thing that means that */
      (p.label ? '<span>' + esc(p.label) + '</span>' : bar('w-md')) +
      '</button>').join('');

    /* THE ELEMENT IS THE BAR. `#projName` ships as `sk sk-h-label w-md`, so
       writing text into it leaves the skeleton's own background painted behind
       the words and the name reads as struck through. The skeleton classes come
       OFF when a value arrives — which is what "null means render the bar"
       means at the DOM level, and the only place in the tree where a renderer
       has to say so out loud. */
    const name = $('#projName');
    const cur = list.find(p => p.current);
    if (name && cur && cur.label) {
      name.classList.remove('sk', 'sk-h-label', 'w-md');
      name.textContent = cur.label;
    }
  });

  /* ── the meter · what is left ───────────────────────────────────────────
     A FIGURE AND A WORD, and here it is only the figure. This wrote a
     --meter-fill percentage that NO STYLESHEET READ, under a comment claiming
     the meter narrowed as the balance fell. It never narrowed: #meter is a
     button holding a glyph and a number, with no track and no fill.

     THE WRITE GOES RATHER THAN A READER ARRIVING. Adding one means adding a
     bar to the masthead, and the points page already draws that length —
     36-destination.css reasons at the plan-spent line that it is deliberately
     not a second meter. The number and its unit carry the balance here, which
     is a figure and a word and never a colour alone. */
  ENGINE.points().then(res => {
    if (!res.ok) return;
    const { balance, allowance } = res.data;
    const n = $('#meterN');
    if (n) n.textContent = String(balance);
  });

  /* ── the starred count · what the founder has built ─────────────────────
     onChange FIRES IMMEDIATELY ON SUBSCRIBE, which is the whole reason this is
     one call and not a call plus a paint. The masthead mounts before any
     surface does, and core/starred.mjs reads localStorage at module load, so
     the count is already right by the time this runs on a reload.

     THE LABEL IS REWRITTEN, NOT JUST THE NUMBER. A control announced as
     "Starred" says the same thing at nought and at forty, and the number
     beside it is not in the accessible name — .meter-n is a <span>, so a
     screen reader reads the label and nothing else. §7's rule that a count is
     a figure AND a word applies to what is heard as much as what is seen.

     IT IS NOT A LIVE REGION. The founder pressed a star and the row they
     pressed announces the change; a second announcement from the bar would be
     the same fact twice, which §7 refuses. */
  let painted = false;
  Starred.onChange(rows => {
    const n = $('#mastStarN'), btn = $('#mastStar');
    if (n) n.textContent = String(rows.length);
    /* THE ACKNOWLEDGEMENT, AND NOT ON THE FIRST CALL. onChange fires
       immediately on subscribe so a surface mounting late paints correctly;
       that first call is not a change and a bar that pulses at boot is
       reporting one that did not happen. On a reload with a stored set it
       would pulse for every one of them at once.

       TWO FRAMES, NOT ONE. Setting and clearing inside one frame is a style
       the browser never computes, so the transition has nothing to run from.
       The attribute goes on now and comes off after the next paint, which is
       what makes 20-shell.css's two durations fire in order. */
    if (btn && painted) {
      btn.setAttribute('data-bump', '');
      requestAnimationFrame(() =>
        requestAnimationFrame(() => btn.removeAttribute('data-bump')));
    }
    painted = true;
    if (btn) {
      btn.setAttribute('aria-label', rows.length === 0
        ? 'Nothing starred yet. Open your starred set.'
        : rows.length + (rows.length === 1 ? ' patent starred.' : ' patents starred.')
          + ' Open your starred set.');
      /* EMPTY IS A STATE THE CONTROL SHOWS, not a reason to hide. The
         stylesheet quietens it; it stays pressable, because the page explains
         what starring is for and that is exactly what an empty set needs. */
      btn.toggleAttribute('data-empty', rows.length === 0);
    }
  });

  /* ── navigation out of the bar ────────────────────────────────────────
     `data-go`, WHICH IS WHAT THE MARKUP SAYS. This listened for `data-goto`
     and nothing in the tree has ever carried that attribute, so all six
     navigation controls were inert: Account settings, Plan & billing, Help,
     the points meter, New search, and billing's link to the points page.

     Nothing failed. The delegated listener matched no element, so the click
     fell through to the document and the page sat exactly where it was — which
     looks identical to a route that resolved to the view you are already on.
     Two of the three account rows even carry a comment saying they stopped
     being inert, written against the attribute the markup uses. */
  onActivate(document, '[data-go]', el => {
    const h = el.getAttribute('data-go');
    if (h) location.hash = h;
  });

  /* the theme control lives in the profile menu · design-language.md §10.4 */
  onActivate(document, '[data-theme-set]', el => {
    ctx.applyTheme(el.getAttribute('data-theme-set'));
    $$('[data-theme-set]').forEach(b =>
      b.setAttribute('aria-pressed',
        String(b.getAttribute('data-theme-set') ===
          (document.documentElement.getAttribute('data-theme') || 'system'))));
  });
}
