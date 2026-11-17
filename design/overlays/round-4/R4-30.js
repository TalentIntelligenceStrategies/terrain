/* R4-30 (restores R3-44) · Result row: the drawing strip is named for its patent
 *
 * Current: each row's strip is a scroll container, so it is a tab stop, and
 * it is announced by its contents, "1 2 3 4 5 6 7 8 9 10 11 12 13": nothing
 * says these are drawings, or of which patent. Each thumbnail is a button
 * named "Drawing 3 of US 09000581 B", and the <img> beside it repeats the
 * same text as its alt.
 * Wanted:  the strip is role="group" with aria-label "Drawings of
 * {pn}, {n} figures" (their figureCount string), and "1 figure" for one:
 * that string needs a singular form added. Each
 * thumbnail button is named "Open figure {i} of {pn}", the record's string
 * (their openFigure string), and the image beside it is alt="" because the button names
 * it. Badges stay aria-hidden, as they ship.
 * Viewport: both.
 *
 * In the component: the attributes on the strip's root, openFigure for the
 * button, alt="" on the thumbnail's TiffImage. {pn} is the formatted number
 * with its full kind (R4-29). */
(() => {
  if (window.__r4_30) return;
  window.__r4_30 = true;
  const kindOf = card => {
    const u = card.querySelector('a[href*="docId="]')?.getAttribute('href') || card.querySelector('[data-idx] img')?.getAttribute('src') || '';
    const id = (u.match(/docId=([^&#]+)/) || u.match(/\/drw\/([^/?#]+)/) || [])[1] || '';
    return (id.match(/_([A-Z][0-9]?)$/) || [])[1] || '';
  };
  const pnOf = card => {
    const shown = card.querySelector('a[title^="Open "] span')?.textContent.trim() || '';
    const kind = kindOf(card);
    return shown.replace(/^([A-Z]{2} [0-9A-Z]{5,}) ([A-Z][0-9]?)$/, (m, pn, k) => (kind && kind[0] === k[0] ? `${pn} ${kind}` : m));
  };
  const set = (el, name, v) => { if (el.getAttribute(name) !== v) el.setAttribute(name, v); };
  const fix = () => {
    for (const card of document.querySelectorAll('[data-result-card]')) {
      const tiles = card.querySelectorAll('[data-idx]');
      if (!tiles.length) continue;
      const strip = tiles[0].parentElement;
      const pn = pnOf(card);
      set(strip, 'role', 'group');
      set(strip, 'aria-label', `Drawings of ${pn}, ${tiles.length} ${tiles.length === 1 ? 'figure' : 'figures'}`);
      for (const t of tiles) {
        const i = t.getAttribute('data-idx');
        const b = t.querySelector(':scope > button');
        if (b) set(b, 'aria-label', `Open figure ${i} of ${pn}`);
        const img = t.querySelector('img');
        if (img) set(img, 'alt', '');
        t.querySelectorAll(':scope > span.font-mono').forEach(s => set(s, 'aria-hidden', 'true'));
      }
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fix(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'alt', 'href'] });
  fix();
})();
