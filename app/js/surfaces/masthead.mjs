/* surfaces/masthead — the 48px bar. platform.md §6.1.
 *
 * The brand, the project switcher, the points meter, the profile menu. It sits
 * OUTSIDE the stage and persists across every view swap — platform.md §2:
 * moments 1-3 and 4-5 are two surfaces, not five screens, and a bar that
 * reloaded between them would say otherwise.
 */
import { $, $$, esc } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { push, drop } from '../core/esc-stack.mjs';
import { bar } from '../core/primitives.mjs';
import { focusQuietly } from '../core/focus.mjs';

let ENGINE = null;

/* ── a menu that closes on Escape, on outside click, and on a second press ──
   IT TOGGLES A CLASS ON #app, NOT [hidden] ON THE PANEL, and that was a real
   defect rather than a style choice. .mast-menu ships opacity:0 and
   visibility:hidden, and 14-menu.css reveals it through `.proj-open #projMenu`
   and `.menu-open #acctMenu` — an ancestor class. Clearing [hidden] removes
   display:none and leaves both dropdowns invisible, which is exactly what they
   were. The prototype always did it this way; the extraction did not.

   ONLY ONE MAY BE OPEN. 14-menu.css says so and the project switcher nests a
   version block, so two open menus would overlap. Opening one closes the other.

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

  ENGINE.versions().then(res => {
    const h = $('#histList');
    if (!h) return;
    if (!res.ok) { h.innerHTML = ''; return; }
    const vs = res.data.versions || [];
    h.innerHTML = vs.map(v =>
      '<button class="side-item side-item-sub' + (v.current ? ' is-current' : '') +
      '" type="button" role="menuitem" data-ver="' + esc(v.id) + '">' +
      (v.label ? '<span>' + esc(v.label) + '</span>' : bar('w-sm')) +
      '</button>').join('');
  });

  /* ── the meter · what is left ───────────────────────────────────────────
     A FIGURE AND A WORD, never a colour alone. The meter narrows as the
     balance falls and the number beside it says what it is; a bar that only
     changed length would be encoding the one thing a founder acts on in a
     channel they cannot read precisely. */
  ENGINE.points().then(res => {
    if (!res.ok) return;
    const { balance, allowance } = res.data;
    const n = $('#meterN');
    if (n) n.textContent = String(balance);
    const m = $('#meter');
    if (m) m.style.setProperty('--meter-fill', (balance / allowance * 100).toFixed(1) + '%');
  });

  /* ── navigation out of the bar ──────────────────────────────────────── */
  onActivate(document, '[data-goto]', el => {
    const h = el.getAttribute('data-goto');
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
