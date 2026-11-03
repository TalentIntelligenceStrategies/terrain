/* R3-37 · Result row: Tab reaches the number link and the version switch
 *
 * Current: the row's IPtech link (US 08664729 B ↗) and its Grant /
 * Application segment both render tabindex="-1", so Tab goes "View details
 * of …" → the drawing strip → the next row, and a keyboard user can neither
 * open the patent in IPtech nor reach the other version (WCAG 2.1.1).
 * Wanted:  the link is a plain <a href> in the natural order, ahead of the
 * title. The version switch is in the record header (R3-21) as ordinary
 * buttons, so it is in the order there; nothing on the row needs a roving
 * tabindex any more.
 * Viewport: both.
 *
 * Measured (desktop, Tab from Sort): a "Open US 09000581 B2 in IPtech" →
 * title button → strip group → next row's link …, every row; in the
 * record, Shift+Tab from Close details: Next patent → Find similar →
 * Application → Grant (the R3-21 switch). Before: link and segment skipped.
 *
 * In the component: drop tabindex="-1" from the card's <a>. Its keydown.stop
 * already keeps Enter from opening the record as well. */
(() => {
  if (window.__r3_37) return;
  window.__r3_37 = true;
  const fix = () => {
    for (const a of document.querySelectorAll('[data-result-card] a[href][tabindex="-1"]')) a.removeAttribute('tabindex');
  };
  new MutationObserver(fix).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['tabindex'] });
  fix();
})();
