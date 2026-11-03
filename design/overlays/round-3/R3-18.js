/* R3-18 · Results: one pinned row on the phone (the offset)
 *
 * Measures the distance from the top of their sticky composer wrapper to
 * the top of its last row (the query line with R3-13, or their magnifier
 * row without it) and writes it to
 * --r3-pin-shift on <html>, where R3-18.css subtracts it from the sticky
 * top. Re-measured whenever the wrapper or the row changes size or the
 * viewport crosses sm; 0 at sm and up, and while the box is open.
 *
 * In the component this is not needed: render the toolbar outside the
 * pinned element on phones. */
(() => {
  if (window.__r3_18) return;
  window.__r3_18 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const root = document.documentElement;
  let observed = null;
  const ro = new ResizeObserver(() => soon());
  let queued = false;
  const soon = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; measure(); }); } };

  function measure() {
    const wrap = document.querySelector('#main-content > div.sticky');
    const line = wrap && wrap.querySelector('[data-search-line]');
    if (wrap !== observed) {
      ro.disconnect();
      observed = wrap;
      if (wrap) { ro.observe(wrap); const box = wrap.querySelector('.search-box-morph'); if (box) ro.observe(box); }
    }
    let shift = 0;
    if (phone.matches && line && !line.classList.contains('invisible')) {
      /* the rects are in the same coordinates whatever the scroll, so
         their difference is the distance inside the wrapper */
      const act = wrap.querySelector('.search-box-morph div:has(> button[aria-label="Search"])');
      const tops = [line, act].filter(e => e && e.getClientRects().length).map(e => e.getBoundingClientRect().top);
      if (tops.length) shift = Math.max(0, Math.round(Math.min(...tops) - wrap.getBoundingClientRect().top));
    }
    const v = `${shift}px`;
    if (root.style.getPropertyValue('--r3-pin-shift') !== v) root.style.setProperty('--r3-pin-shift', v);
  }

  phone.addEventListener('change', soon);
  new MutationObserver(soon).observe(document.body, {
    subtree: true, childList: true, attributes: true, attributeFilter: ['class'],
  });
  measure();
})();
