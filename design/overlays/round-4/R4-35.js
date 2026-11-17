/* R4-35 (restores R3-19) · Patent record (phone): a drag down on its head closes it
 *
 * Current: a touch drag down on the record's head does nothing (measured at
 * 390×844: 140px slow, 60px, and 95px in 170ms each leave it open,
 * transform none). ×, Back and a pointer click on the scrim close it.
 * Wanted:  a finger drag down that starts on the card's head (the sticky
 * [data-detail-head]: the actions, the number and the title) closes it.
 * The card follows the finger once it has moved 8px down; on release it
 * closes once it has travelled past 120px or a quarter of the card's
 * height, whichever is less, or on a flick: more than 24px at over
 * 0.5px/ms. Otherwise it springs back. A drag that starts in the record's
 * body scrolls the record, as before. Closing goes through the head's own
 * Close details, so the URL, the focus return to the row (R4-40) and
 * analytics are yours. A press that does not move is still a tap on the
 * head's controls.
 * Viewport: phone, below sm (40rem) and taller than 480px, re-evaluated on
 * change.
 *
 * Measured at 390×844 with R4-35 and R4-42 (touch events on the head's
 * number line; the card is 828px tall, so the threshold is 120px):
 * - a slow drag of 140px (600ms) closes; 100px springs back; 40px springs back
 * - a flick of 95px in 150ms (0.63px/ms) closes
 * - a flick of 60px in 171ms (0.35px/ms) springs back
 * - a 150px drag that starts in the body does not close it
 * - after a close, the hash drops rec= (no history entry is added) and focus
 *   is on the row's title button
 *
 * In the component this is the dialog's own drag state (offset, release
 * velocity), closing through the same path as ×, not listeners laid over
 * it. */
(() => {
  if (window.__r4_35) return;
  window.__r4_35 = true;
  const phone = matchMedia('(max-width: 39.99rem) and (min-height: 480.01px)');
  const SEL = '[role="dialog"][data-result-detail]';
  const HEAD = `${SEL} [data-detail-head]`;
  let drag = null;

  const reset = d => {
    d.removeAttribute('data-r4-dragging');
    d.style.removeProperty('--r4-sheet-drag');
  };
  /* The dialog keeps your sm-up head row too, hidden below sm: press the
     Close details that is drawn. */
  const closer = d => [...d.querySelectorAll('button[aria-label="Close details"]')]
    .find(b => b.getClientRects().length);

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
      drag.d.setAttribute('data-r4-dragging', '');
    }
    e.preventDefault();
    drag.d.style.setProperty('--r4-sheet-drag', `${Math.max(0, dy)}px`);
  }, { passive: false, capture: true });

  const end = () => {
    if (!drag) return;
    const { d, on, y0, y, t0 } = drag;
    drag = null;
    if (!on) return;
    const dy = y - y0;
    const v = dy / Math.max(1, performance.now() - t0);
    const close = closer(d);
    const far = Math.min(120, d.getBoundingClientRect().height / 4);
    if ((dy > far || (dy > 24 && v > 0.5)) && close) {
      /* Keep the offset: the leave animation starts where the finger let go. */
      d.removeAttribute('data-r4-dragging');
      close.click();
    } else reset(d);
  };
  document.addEventListener('touchend', end, { capture: true });
  document.addEventListener('touchcancel', end, { capture: true });

  phone.addEventListener('change', () => document.querySelectorAll(SEL).forEach(reset));
})();
