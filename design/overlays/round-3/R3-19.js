/* R3-19 · Patent record (phone): a drag down on its head closes it
 *
 * Current: the corner ×, a tap on the scrim and Back close the record; a
 * drag does nothing.
 * Wanted:  a finger drag down that starts on the card's head row closes it.
 * The card follows the finger; on release it closes past 96px or on a quick
 * flick (over 0.5px/ms), otherwise it springs back. A drag that starts in
 * the record's body scrolls the record, as before. Closing goes through
 * their own Close details button, so the URL, focus return (R3-40) and
 * analytics are theirs. A press that does not move is still a tap on the
 * head's controls.
 * Viewport: phone, below sm (40rem), re-evaluated on change.
 *
 * Measured at 390×844 with the patch injected before load (CDP
 * synthesizeScrollGesture, gestureSourceType touch, from the head): 40px
 * springs back; 120px and 300px close.
 *
 * In the component this is the dialog's own drag state, not listeners laid
 * over it. */
(() => {
  if (window.__terrainR3_19) return;
  window.__terrainR3_19 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const SEL = '[role="dialog"][data-result-detail]';
  const HEAD = `${SEL} > div:has(> button[aria-label="Find similar"])`;
  let drag = null;

  const reset = d => {
    d.removeAttribute('data-terrain-dragging');
    d.style.removeProperty('--terrain-sheet-drag');
  };

  document.addEventListener('touchstart', e => {
    if (!phone.matches || e.touches.length !== 1) return;
    const head = e.target.closest?.(HEAD);
    if (!head) return;
    const t = e.touches[0];
    drag = { d: head.closest(SEL), y0: t.clientY, y: t.clientY, t0: performance.now(), on: false };
  }, { passive: true, capture: true });

  document.addEventListener('touchmove', e => {
    if (!drag) return;
    const t = e.touches[0];
    const dy = t.clientY - drag.y0;
    drag.y = t.clientY;
    if (!drag.on) {
      if (dy < -4) { drag = null; return; }
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
      /* Keep the offset: their leave animation starts where the finger let go. */
      d.removeAttribute('data-terrain-dragging');
      close.click();
    } else reset(d);
  };
  document.addEventListener('touchend', end, { capture: true });
  document.addEventListener('touchcancel', end, { capture: true });

  phone.addEventListener('change', () => document.querySelectorAll(SEL).forEach(reset));
})();
