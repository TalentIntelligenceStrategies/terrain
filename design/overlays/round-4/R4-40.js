/* R4-40 (restores R3-40) · Patent record (dialog form): focus returns to the row on close
 *
 * Current: Reka returns focus on close to whatever had it when the dialog
 * opened. Measured at 390×844: after ×, and after a tap on the scrim,
 * focus is on the row's View details (right); after the browser's back
 * (which drops rec= from the URL) focus is on <body>, and it has been seen
 * on the masthead's theme switch.
 * Wanted:  however the record closes (×, Escape, the scrim, a drag, back),
 * focus lands on the link of the row whose record was open (named
 * "{title}, {pn}" by R4-31), and
 * that row is scrolled into view below the pinned masthead if it is not
 * already in view.
 * Viewport: the dialog form of the record (below lg).
 *
 * Measured with the patch: after back, activeElement is that row's link
 * (here without R4-29 and R4-31, so "View details of US 09000581 B"), its card's top below the masthead's bottom (57px).
 *
 * In the component: DialogContent @close-auto-focus.prevent, then focus
 * the row's [data-card-primary] for the closed pnRaw, and scroll it with
 * scroll-margin-top under the masthead. */
(() => {
  if (window.__terrainR3_40) return;
  window.__terrainR3_40 = true;
  const dialogForm = matchMedia('not all and (min-width: 64rem)');
  const SEL = '[role="dialog"][data-result-detail]';
  let open = null;
  let digits = '';

  const toRow = () => {
    if (!digits) return;
    const row = [...document.querySelectorAll('[data-card-primary][aria-label]')]
      .find(b => b.getAttribute('aria-label').includes(digits) && b.getClientRects().length);
    if (!row) return;
    row.focus({ preventScroll: true });
    const card = row.closest('[data-result-card]') || row;
    const top = Math.max(0, ...[...document.querySelectorAll('header')].filter(h => /sticky|fixed/.test(getComputedStyle(h).position)).map(h => h.getBoundingClientRect().bottom));
    const r = card.getBoundingClientRect();
    if (r.top < top + 8) scrollBy({ top: r.top - top - 8 });
    else if (r.top > innerHeight - 48) scrollBy({ top: r.top - top - 8 });
  };
  window.__terrainRecordFocusRow = toRow;

  const check = () => {
    const d = document.querySelector(SEL);
    if (d) {
      open = d;
      const pn = d.querySelector('[class*="overflow-y-auto"] p.font-mono')?.textContent || '';
      digits = (pn.match(/\d{5,}/) || [''])[0] || digits;
      return;
    }
    if (open && dialogForm.matches) {
      open = null;
      /* After Reka's own close-auto-focus and their leave animation. */
      setTimeout(toRow, 60);
    }
    open = null;
  };
  check();
  new MutationObserver(check).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
