/* R4-43 (restores R3-20) · Drawing viewer: the drawing at full width on a phone (see R4-43.css)
 *
 * Viewer.js fits a drawing to 90% of its stage (initialCoverage, default
 * 0.9, which your options leave as it is), so on a 390px full-bleed stage
 * the drawing is drawn 351 wide with 19.5px of paper either side. Below
 * 40rem the patch sets initialCoverage to 1 on each viewer as it becomes
 * ready (your viewer makes a new instance per figure), so the fitted
 * drawing spans the stage's width; a viewer already open when the patch
 * arrives is refitted in place and its zoom readout updated (zoomTo at
 * the new ratio fires your zoom handler). Zoom, pan, rotate and Fill screen
 * work from that fit as before. At 40rem and up the coverage stays 0.9.
 *
 * In the component: pass initialCoverage: 1 to Viewer.js below sm. */
(() => {
  if (window.__r4_43) return;
  window.__r4_43 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const want = () => (phone.matches ? 1 : 0.9);
  /* before the instance lays its first image out: no refit needed */
  document.addEventListener('ready', e => {
    const v = e.target && e.target.viewer;
    if (v && v.options && v.options.inline) v.options.initialCoverage = want();
  }, true);
  const refit = () => {
    for (const img of document.querySelectorAll('.figview-stage img')) {
      const v = img.viewer;
      if (!v || !v.options || !v.options.inline || v.options.initialCoverage === want()) continue;
      v.options.initialCoverage = want();
      if (!v.viewed) continue;
      v.resize();
      requestAnimationFrame(() => v.imageData && v.zoomTo(v.imageData.ratio));
    }
  };
  phone.addEventListener('change', refit);
  new MutationObserver(refit).observe(document.body, { subtree: true, childList: true });
  refit();
})();
