/* R3-45 · Result row: the row's link is named by its title
 *
 * Current: the row's primary control, the title button, is named "View
 * details of US 08664729 B", so a screen reader's list of controls is fifty
 * numbers with no title, the one thing a founder scans by (WCAG 2.4.4).
 * Wanted:  aria-label "{title}, {pn}", e.g. "Semiconductor package,
 * US 09000581 B2", with the full kind (R3-11).
 * Viewport: both.
 *
 * In the component: aria-label from the hit's title and the formatted number;
 * or drop the aria-label and let the visible title be the name, with the
 * number already read just before it from the link (R3-37). */
(() => {
  if (window.__r3_45) return;
  window.__r3_45 = true;
  const pnOf = card => {
    const shown = card.querySelector('a[title^="Open "] span')?.textContent.trim() || '';
    const u = card.querySelector('a[href*="docId="]')?.getAttribute('href') || card.querySelector('[data-idx] img')?.getAttribute('src') || '';
    const id = (u.match(/docId=([^&#]+)/) || u.match(/\/drw\/([^/?#]+)/) || [])[1] || '';
    const kind = (id.match(/_([A-Z][0-9]?)$/) || [])[1] || '';
    return shown.replace(/^([A-Z]{2} [0-9A-Z]{5,}) ([A-Z][0-9]?)$/, (m, pn, k) => (kind && kind[0] === k[0] ? `${pn} ${kind}` : m));
  };
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
