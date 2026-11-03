/* R3-02 · Patent record (phone): Find similar lands on the reordered list
 *
 * Current: on a phone, Find similar reorders the list behind the record and
 * leaves the record on top, unchanged; the only trace is "#2 Nearness
 * 0.9899" under the card's lower edge. The "Nearest to …" chip, "This
 * patent" on the anchor and "Restore the original order" are all behind
 * the record.
 * Wanted:  on a phone, pressing Find similar in the record closes the
 * record once the list has changed and lands on the reordered list
 * scrolled to the top, with the "Nearest to …" chip and Restore in view,
 * and focus on the anchor row's View details (R3-40).
 * Viewport: phone, below sm (40rem). Desktop is unchanged (there the list
 * is beside the record).
 *
 * Measured at 390×844 with the patch: after the press, the record closes
 * once [role=status][title="Nearest to US 09000581 B2"] exists; scrollY 0;
 * the chip and Restore are both inside the viewport below the masthead.
 *
 * "The list has changed" is read from their own chip naming this record's
 * number, so the patch adds no state. In the component this is the
 * findSimilar handler closing the dialog (pnRaw = null) when the reorder
 * resolves, below sm, and scrolling the list to the top. If the chip does
 * not appear within 15s (a failed request), the record stays open. */
(() => {
  if (window.__terrainR3_02) return;
  window.__terrainR3_02 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const SEL = '[role="dialog"][data-result-detail]';

  document.addEventListener('click', e => {
    if (!phone.matches) return;
    const btn = e.target.closest?.(`${SEL} button[aria-label="Find similar"]`);
    if (!btn || btn.disabled) return;
    const d = btn.closest(SEL);
    const pn = d.querySelector('[class*="overflow-y-auto"] p.font-mono')?.textContent.trim();
    if (!pn) return;
    const t0 = performance.now();
    const tick = () => {
      if (!d.isConnected || performance.now() - t0 > 15000) return;
      const chip = [...document.querySelectorAll('[role="status"][title^="Nearest to "]')].find(c => c.title === `Nearest to ${pn}`);
      if (!chip || btn.getAttribute('aria-busy') === 'true') return void setTimeout(tick, 120);
      d.querySelector('button[aria-label="Close details"]')?.click();
      /* After the record has left and focus has gone back to the row. */
      const settle = () => {
        if (document.querySelector(SEL)) return void setTimeout(settle, 60);
        setTimeout(() => scrollTo({ top: 0 }), 120);
      };
      settle();
    };
    setTimeout(tick, 120);
  }, true);
})();
