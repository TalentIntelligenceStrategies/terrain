/* R4-40 (restores R3-40) · Patent record (dialog form): focus returns to the row of the record that was open
 *
 * Current: on close, Reka returns focus to whatever had it when the dialog
 * opened. Measured at 390×844: opened from row 1 and closed, focus is on
 * row 1's title button, which is right. After Next patent (the record now
 * shows US 9252068 B2), ×, Back and the scrim put focus on row 1's title
 * button, US 9000581 B2: a row the reader has already left. Escape and the
 * drag down do not close the record yet (R4-42, R4-35); with those applied
 * they do the same.
 * Wanted:  however the record closes (×, Escape, the scrim, the drag down,
 * Back), focus lands on the title button of the row whose record was
 * showing, and that row is scrolled into view, 8px below the pinned
 * masthead, if it is not already in view.
 * Viewport: the dialog form of the record (below lg).
 *
 * Measured with the patch at 390×844:
 * - Next, then ×: focus on the title button of US 9252068 B2
 * - Next, then Escape: the same
 * - Next, then a 160px drag on the head: the same
 * - opened and closed without Next, focus stays where yours puts it
 *
 * Reads the number from the record's head; touches no URL or history.
 *
 * In the component: DialogContent @close-auto-focus.prevent, then focus
 * the row's [data-card-primary] for the closed record's pnRaw, scrolled
 * with scroll-margin-top under the masthead. */
(() => {
  if (window.__r4_40) return;
  window.__r4_40 = true;
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
      /* After Reka's own close-auto-focus and your leave animation. */
      setTimeout(toRow, 60);
    }
    open = null;
  };
  check();
  new MutationObserver(check).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
