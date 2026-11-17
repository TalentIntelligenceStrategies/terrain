/* R4-30 (restores R3-44) · Result row: the drawing strip is named for its patent
 *
 * Current: each row's strip is a scroll container with no role and no name,
 * so it is a tab stop announced by its contents, "1 2 3 4 5 6 7 8 9":
 * nothing says these are drawings, or of which patent. Each thumbnail is a
 * button named "Drawing 1 of US 9000581 B2", and the <img> beside it repeats
 * the same text as its alt.
 * Wanted:  the strip is role="group" with aria-label "Drawings of
 * {pn}, {n} figures" (their figureCount string), and "1 figure" for one:
 * that string needs a singular form added. Each thumbnail button is named
 * "Open figure {i} of {pn}", the record's string (their openFigure string),
 * and the image beside it is alt="" because the button names it. Badges stay
 * aria-hidden, as they ship.
 * Viewport: both.
 *
 * Measured with the patch, phone and desktop, row 1: the strip is a group
 * "Drawings of US 9000581 B2, 9 figures"; its first button "Open figure 1
 * of US 9000581 B2"; alt="".
 *
 * In the component: the attributes on the strip's root, openFigure for the
 * button, alt="" on the thumbnail's TiffImage. {pn} is the formatted number
 * the row prints. */
(() => {
  if (window.__r4_30) return;
  window.__r4_30 = true;
  const pnOf = card => card.querySelector('a[title^="Open "] span')?.textContent.trim() || '';
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
