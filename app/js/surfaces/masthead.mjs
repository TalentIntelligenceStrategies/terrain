/* surfaces/masthead — the 48px bar. platform.md §4.1.
 *
 * The brand, search history, the starred count, the profile menu. It sits
 * OUTSIDE the stage and persists across every view swap — platform.md §2:
 * the four moments run over two surfaces on the path, not four screens, and a
 * bar that reloaded between them would say otherwise.
 */
import { $, $$, esc } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { push, drop } from '../core/esc-stack.mjs';
import { clampIntoView } from '../core/popover.mjs';
import { focusQuietly } from '../core/focus.mjs';
import * as Starred from '../core/starred.mjs';
import * as History from '../core/history.mjs';


/* ── a menu that closes on Escape, on outside click, and on a second press ──
   IT TOGGLES A CLASS ON #app, NOT [hidden] ON THE PANEL, and that was a real
   defect rather than a style choice. .mast-menu ships opacity:0 and
   visibility:hidden, and 14-menu.css reveals it through `.hist-open #histMenu`
   and `.menu-open #acctMenu` — an ancestor class. Clearing [hidden] removes
   display:none and leaves both dropdowns invisible, which is exactly what they
   were. The prototype always did it this way; the extraction did not.

   ONLY ONE MAY BE OPEN. 14-menu.css says so, and two dropdowns anchored to the
   same 48px bar overlap whatever is in them. Opening one closes the other.

   The stack is what makes that safe: Escape closes the MOST RECENT, not
   whichever remembered to bind a handler. */
const MENU_CLASS = { histMenu: 'hist-open', acctMenu: 'menu-open' };

function menu(btn, panel, key) {
  if (!btn || !panel) return;
  const app = document.getElementById('app') || document.body;
  const cls = MENU_CLASS[key];

  const close = () => {
    if (!app.classList.contains(cls)) return;
    app.classList.remove(cls);
    btn.setAttribute('aria-expanded', 'false');
    panel.style.left = '';
    panel.style.right = '';
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
    /* #acctMenu is anchored right:0 to a wrapper that starts a NEW ROW once
       the bar wraps, which put it 52px past the leading edge at 768 and 146px
       at 860 — with .app{overflow:hidden} and nothing to scroll. */
    clampIntoView(panel);
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

  const hist = menu($('#histBtn'), $('#histMenu'), 'histMenu');
  menu($('#profileBtn'), $('#acctMenu'), 'acctMenu');

  /* ── search history · platform.md §5 ───────────────────────────────────
     AN EMPTY HISTORY SAYS WHAT FILLS IT, never a list of bars: a bar is a
     value withheld, and an empty history has no values. Each entry reads as
     its sentence over its date and field — the date first, because the line
     truncates and when is what tells two similar sentences apart; a number
     search says so, because re-running EP2214203A2 as a description would be
     a different search. */
  const when = iso => {
    const d = new Date(iso);
    return isNaN(d) ? '' : d.toISOString().slice(0, 10);
  };
  History.onChange(list => {
    const host = $('#histList');
    if (!host) return;
    if (!list.length) {
      host.innerHTML = '<p class="hist-empty t-body">No searches yet. Each one you run '
        + 'is kept here, in this browser, so you can run it again.</p>';
      return;
    }
    host.innerHTML = '<ul class="hist-list">' + list.map((e, i) =>
      '<li class="hist-row">'
      + '<button class="hist-run" type="button" data-hist-run="' + i + '">'
      + '<span class="hist-q">' + esc(e.query) + '</span>'
      + '<span class="hist-meta t-micro">'
      + ['<span class="fig">' + when(e.at) + '</span>',
         e.mode === 'number' ? 'Patent number' : '', e.fieldLabel ? esc(e.fieldLabel) : '']
         .filter(Boolean).join(' · ')
      + '</span></button>'
      + '<button class="hist-x" type="button" data-hist-x="' + i + '" aria-label="Remove '
      + esc(e.query).slice(0, 60) + ' from history">'
      + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
      + '</button></li>').join('') + '</ul>'
      + '<div class="hist-foot"><button class="btn btn-ghost hist-clear" type="button" data-hist-clear>Clear history</button></div>';
  });
  /* RUNNING ONE IS A SEARCH, and the home composer is what runs searches: the
     entry hands it the sentence, the field and the mode. */
  onActivate(document, '[data-hist-run]', el => {
    const e = History.entries()[Number(el.getAttribute('data-hist-run'))];
    if (!e) return;
    if (hist) hist.close();
    window.dispatchEvent(new CustomEvent('terrain:rerun', { detail: e }));
  });
  /* REMOVING ONE KEEPS THE PANEL OPEN and keeps focus in it, on the entry
     that moved up into the removed one's place — or Clear, past the end. */
  onActivate(document, '[data-hist-x]', el => {
    const i = Number(el.getAttribute('data-hist-x'));
    History.remove(i);
    const next = $('#histList [data-hist-run="' + i + '"]')
      || $('#histList [data-hist-run="' + (i - 1) + '"]') || $('#histBtn');
    if (next) focusQuietly(next);
  });
  onActivate(document, '[data-hist-clear]', () => {
    History.clear();
    if (hist) hist.close();
    focusQuietly($('#histBtn'));
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
     and nothing in the tree has ever carried that attribute, so every
     navigation control was inert: Account settings, Plan & billing, Help and
     New search among them.

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
