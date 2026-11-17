/* R4-32 (restores R3-37) · Result row: Tab reaches the number link and the version switch
 *
 * Current: the row's IPtech link (US 08664729 B ↗) and its Grant /
 * Application segment both render tabindex="-1", so Tab goes "View details
 * of …" → the drawing strip → the next row, and a keyboard user can neither
 * open the patent in IPtech nor reach the other version (WCAG 2.1.1).
 * Wanted:  the link is a plain <a href> in the natural order, ahead of the
 * title, at every width. On desktop, where the row keeps its version switch
 * (R4-23), the switch's two buttons are ordinary buttons in the natural
 * order too, after the link. On a phone the switch is in the record's head
 * (R4-23) as ordinary buttons, so it is in the order there. Nothing on the
 * row needs a roving tabindex.
 * Viewport: both.
 *
 * Measured at 1440 with the patch, Tab from Sort: "Open US 09000581 B2 in
 * IPtech" → Grant → Application → the title button → the strip group →
 * the next row's link, every row. Before: the link and the segment were
 * skipped.
 *
 * In the component: drop tabindex="-1" from the card's <a> and from the
 * segment's buttons. The link's keydown.stop already keeps Enter from
 * opening the record as well. */
(() => {
  if (window.__r4_32) return;
  window.__r4_32 = true;
  const fix = () => {
    for (const a of document.querySelectorAll('[data-result-card] a[href][tabindex="-1"], [data-result-card] [role="group"][aria-label="Switch grant/application version"] button[tabindex="-1"]')) a.removeAttribute('tabindex');
  };
  new MutationObserver(fix).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['tabindex'] });
  fix();
})();
