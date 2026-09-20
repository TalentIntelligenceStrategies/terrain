/* surfaces/work — the working surface's own chrome. platform.md §6.2.
 *
 * The head: the project's name, the version bar, the scope chip. Everything
 * INSIDE the two columns belongs to views.mjs, list.mjs and record.mjs; this is
 * only what sits above them.
 *
 * THE PROJECT'S NAME IS NOT NEW AND THAT IS THE WHOLE ARGUMENT. The working
 * screen's own title has printed it since the dashboard was built — the project
 * takes its name from what the founder described, so printing it here is not
 * inventing a name, it is showing them their own words back.
 */
import { $, esc } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { roving } from '../core/roving.mjs';

let ENGINE = null;

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

    /* ONE TAB STOP FOR THE GRID, and it moves with focus so leaving and
       returning lands where the founder was. Bound after the map has mounted;
       a grid with no cells yet is a no-op rather than an error. */
    const mx = $('#matrix');
    if (mx) roving(mx, '.mx-cell');
  });

  /* ── the Market / Technology toggle · platform.md §6.5 ───────────────────
     ONE SURFACE, TWO CUTS, not two pages. The cards are hidden with [hidden]
     rather than removed, so the map keeps its scroll position and its selected
     column across a switch — and so nothing has to be redrawn to come back.

     --i IS SET FROM THE VISIBLE INDEX AND NEVER COUNTED BY :nth-child. That is
     the whole reason it is a custom property: [hidden] cards are still children,
     so a positional CSS ladder staggers around gaps and the first visible card
     on the Technology tab would enter fourth. */
  function showPage(page) {
    const cards = Array.from(document.querySelectorAll('#grid > .card'));
    let visible = 0;
    cards.forEach(card => {
      const on = card.getAttribute('data-page') === page;
      card.hidden = !on;
      if (on) card.style.setProperty('--i', visible++);
    });
    document.querySelectorAll('.seg-page .seg-btn').forEach(b =>
      b.setAttribute('aria-selected', String(b.getAttribute('data-page') === page)));
  }

  onActivate(document, '.seg-page .seg-btn', el =>
    showPage(el.getAttribute('data-page')));

  /* ── the cell click · platform.md §6.5 ────────────────────────────────────
     A cell filters the list in place. It does NOT open a new screen: the map
     and the list are one surface, and a founder who clicked a cell wants to
     see which of these patents that cell is made of, beside the map they
     clicked it on. */
  onActivate(document, '.mx-cell', el => {
    const rc = el.getAttribute('data-rc');
    if (!rc) return;
    const chip = $('#setExcl');
    if (chip) {
      chip.hidden = false;
      /* THE CHIP SAYS WHAT THE CUT IS, and it is the only way out of it. A
         filtered list with nothing saying it is filtered is a list the founder
         reads as the whole result. */
      chip.innerHTML =
        '<button class="chip chip-x" type="button" data-clear-cell>'
        + 'One cell of the map <span class="filter-x-sep">×</span></button>';
    }
  });

  onActivate(document, '[data-clear-cell]', () => {
    const chip = $('#setExcl');
    if (chip) { chip.hidden = true; chip.innerHTML = ''; }
  });

  /* the column control follows a technology across every card below the map */
  onActivate(document, '.mx-col-btn', el => {
    const on = el.getAttribute('aria-pressed') === 'true';
    document.querySelectorAll('.mx-col-btn').forEach(b =>
      b.setAttribute('aria-pressed', 'false'));
    document.querySelectorAll('[data-mxsel]').forEach(n =>
      n.removeAttribute('data-mxsel'));
    if (on) return;
    el.setAttribute('aria-pressed', 'true');
    const c = el.getAttribute('data-mxc');
    document.querySelectorAll(`.mx-cell[data-rc$=",${c}"]`).forEach(n =>
      n.setAttribute('data-mxsel', ''));
    const col = el.closest('.mx-col');
    if (col) col.setAttribute('data-mxsel', '');
  });
}
