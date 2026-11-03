/* R3-19 · Patent record (phone): drag the sheet down to close it
 *
 * Current: only the 24px corner × or the browser's back closes the record.
 * Wanted:  a finger drag down closes it. A drag starts on the grab handle or
 * the head row, or anywhere in the record while it is scrolled to the top;
 * the sheet follows the finger, and on release it closes past 96px or on a
 * quick flick (over 0.5px/ms), otherwise it springs back. Closing goes
 * through their own Close details button, so the URL, focus return and
 * analytics are theirs.
 * Viewport: phone, below sm (40rem), re-evaluated on change.
 *
 * Measured: a 300px touch drag down from the head (CDP synthesizeScrollGesture,
 * gestureSourceType touch) closes the record; a 40px drag springs back.
 *
 * In the component this is the dialog's own drag state, not listeners laid
 * over it. */
(() => {
  if (window.__terrainR3_19) return;
  window.__terrainR3_19 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const SEL = '[role="dialog"][data-result-detail]';
  let drag = null;

  const reset = d => {
    d.removeAttribute('data-terrain-dragging');
    d.style.removeProperty('--terrain-sheet-drag');
  };

  document.addEventListener('touchstart', e => {
    if (!phone.matches || e.touches.length !== 1) return;
    const d = e.target.closest?.(SEL);
    if (!d) return;
    const scroller = d.querySelector(':scope > [class*="overflow-y-auto"]');
    const foot = d.querySelector('.record-foot');
    if (foot?.contains(e.target)) return;
    const inBody = scroller?.contains(e.target);
    if (inBody && scroller.scrollTop > 0) return;
    const t = e.touches[0];
    drag = { d, scroller, inBody, y0: t.clientY, y: t.clientY, t0: performance.now(), on: false };
  }, { passive: true, capture: true });

  document.addEventListener('touchmove', e => {
    if (!drag) return;
    const t = e.touches[0];
    const dy = t.clientY - drag.y0;
    drag.y = t.clientY;
    if (!drag.on) {
      if (dy < -4 || (drag.inBody && drag.scroller.scrollTop > 0)) { drag = null; return; }
      if (dy < 8) return;
      drag.on = true;
      drag.d.setAttribute('data-terrain-dragging', '');
    }
    e.preventDefault();
    drag.d.style.setProperty('--terrain-sheet-drag', `${Math.max(0, dy)}px`);
  }, { passive: false, capture: true });

  const end = () => {
    if (!drag) return;
    const { d, on, y0, y, t0 } = drag;
    drag = null;
    if (!on) return;
    const dy = y - y0;
    const v = dy / Math.max(1, performance.now() - t0);
    const close = d.querySelector('button[aria-label="Close details"]');
    if ((dy > 96 || v > 0.5) && close) {
      /* Keep the offset: their leave animation starts from where the finger
         let go. */
      d.removeAttribute('data-terrain-dragging');
      close.click();
    } else reset(d);
  };
  document.addEventListener('touchend', end, { capture: true });
  document.addEventListener('touchcancel', end, { capture: true });

  phone.addEventListener('change', () => document.querySelectorAll(SEL).forEach(reset));
})();
