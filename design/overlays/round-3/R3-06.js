/* R3-06 · Number search: the placeholder is a number the search covers
 *
 * Current: number mode's placeholder is "Enter a patent publication or
 * grant number, e.g. EP4047638A1 or US20230123456A1", and its accessible
 * name ends "e.g. EP4047638A1". Where to search lists the United States,
 * China and Taiwan only, so the first example is one the search cannot
 * find.
 * Wanted:  "e.g. US9000581B2 or US20230123456A1" in the placeholder and
 * "e.g. US9000581B2" in the name. US9000581B2 is a grant in their US index
 * (it is the first row of the round's stock search). The counter goes in
 * number mode (R3-06.css).
 * Viewport: both.
 *
 * In the component: change modes.placeholderByPatent and
 * modes.queryLabelByPatent in the English strings (the Traditional Chinese
 * strings carry the same EP example). The patch rewrites the two attributes
 * whenever Vue writes them. */
(() => {
  if (window.__r3_06) return;
  window.__r3_06 = true;
  const fix = () => {
    for (const t of document.querySelectorAll('.search-box-morph textarea')) {
      for (const a of ['placeholder', 'aria-label']) {
        const v = t.getAttribute(a);
        if (v && v.includes('EP4047638A1')) t.setAttribute(a, v.replace('EP4047638A1', 'US9000581B2'));
      }
    }
  };
  new MutationObserver(fix).observe(document.body, {
    subtree: true, childList: true, attributes: true, attributeFilter: ['placeholder', 'aria-label'],
  });
  fix();
})();
