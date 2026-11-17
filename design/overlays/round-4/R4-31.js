/* R4-31 (restores R3-45) · Result row: the row's link is named by its title
 *
 * Current: the row's primary control, the title button, is named "View
 * details of US 9000581 B2", so the heading's accessible name is the number
 * too, and a screen reader's list of controls is fifty numbers with no
 * title, the one thing a user scans by (WCAG 2.4.4).
 * Wanted:  aria-label "{title}, {pn}", e.g. "Semiconductor package,
 * US 9000581 B2".
 * Viewport: both.
 *
 * Measured with the patch, phone and desktop: row 1's title button is
 * "Semiconductor package, US 9000581 B2".
 *
 * In the component: aria-label from the hit's title and the formatted number;
 * or drop the aria-label and let the visible title be the name, with the
 * number already read just before it from the link (R4-32). */
(() => {
  if (window.__r4_31) return;
  window.__r4_31 = true;
  const pnOf = card => card.querySelector('a[title^="Open "] span')?.textContent.trim() || '';
  const fix = () => {
    for (const card of document.querySelectorAll('[data-result-card]')) {
      const b = card.querySelector('button[data-card-primary]');
      if (!b) continue;
      const title = b.textContent.trim().replace(/\s+/g, ' ');
      const pn = pnOf(card);
      const v = pn ? `${title}, ${pn}` : title;
      if (title && b.getAttribute('aria-label') !== v) b.setAttribute('aria-label', v);
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fix(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'href'] });
  fix();
})();
