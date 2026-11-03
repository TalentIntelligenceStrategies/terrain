/* R3-03 · Drawing viewer: the record stays open under the viewer
 *
 * Current: once the viewer takes its own pointer events (R3-03.css), the
 * record's Reka dialog sees every press on the viewer as a press outside
 * itself and dismisses: one tap on Zoom out or Next figure closes the record
 * underneath, and the URL loses &rec. Before the CSS fix this did not show
 * only because no press ever reached the viewer.
 * Wanted:  a press on the viewer belongs to the viewer. The record closes
 * only from its own close, or from Back after the viewer is gone (R3-04).
 * Viewport: wherever the record is a modal dialog (below 1080px); a no-op
 * elsewhere, because no outside-press listener is registered there.
 *
 * Measured (phone, replayed API): with the CSS alone, a tap on Zoom out
 * closed the record (rec=09000581 -> gone); with this script the record and
 * &rec survive taps on Zoom out, Zoom in, Next and Previous.
 *
 * In the component: mount the viewer inside the record's dialog layer (or a
 * DismissableLayer branch), or handle the record's pointerDownOutside and
 * call preventDefault when the target is inside .figview. Stopping the event
 * at the viewer root, as here, is the patch's stand-in for that. */
(() => {
  if (window.__terrainR3_03) return;
  window.__terrainR3_03 = true;
  /* The viewer's own handlers are on .figview-stage and its buttons, below
     the root, so they run before the press stops here; the dialog's listener
     is on the document, above it. */
  const stop = e => { if (e.target instanceof Element && e.target.closest('.figview')) e.stopPropagation(); };
  const hook = () => {
    for (const v of document.querySelectorAll('.figview[role="dialog"]:not([data-terrain-r303])')) {
      v.setAttribute('data-terrain-r303', '');
      v.addEventListener('pointerdown', stop);
    }
  };
  new MutationObserver(hook).observe(document.body, { childList: true });
  hook();
})();
