/* R4-42 (restores R3-55) · Patent record: Escape closes it
 *
 * Current: Escape does nothing to the record. Measured on desktop: after
 * Escape the URL keeps &rec=09000581 and the pane stays. On the phone
 * dialog Escape does not close it either (measured: still open), because
 * their DialogContent forwards keydown as a shortcut with .stop, so Reka's
 * own Escape listener on the document never hears it.
 * Wanted:  Escape closes the record, through its own Close details, after
 * anything above it has had the key: the drawing viewer (lightbox), an open
 * menu, listbox or popover (the Export menu, the sort menu), another
 * dialog, a fullscreen element. Escape inside a text field is the field's.
 * After a close from the desktop pane, focus goes to the row's View
 * details.
 * Viewport: both. Desktop is the item; the phone dialog takes the same fix
 * because the same .stop is what breaks it there.
 *
 * Measured with the patch: desktop, Escape removes rec= and the pane;
 * focus on that row's link. With the lightbox open, the first
 * Escape closes only the lightbox and the record stays.
 *
 * What was open is read in the capture phase on window, before any
 * handler (theirs or Reka's) has closed it, and acted on after the event.
 * In the component: on the desktop pane, a keydown.esc handler that
 * checks the same overlay state their shortcut handler already reads
 * (the open-overlay flag); in the dialog, let Escape through the .stop. */
(() => {
  if (window.__terrainR3_55) return;
  window.__terrainR3_55 = true;
  const above = () => !!document.querySelector([
    '[role="dialog"]:not([data-result-detail])[data-state="open"]',
    '[role="dialog"]:not([data-result-detail]):not([data-state])',
    '[role="menu"][data-state="open"]',
    '[role="listbox"][data-state="open"]',
    '[data-reka-popper-content-wrapper]',
  ].join(',')) || !!document.fullscreenElement;

  window.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || e.isComposing || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
    if (e.target.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]')) return;
    if (above()) return;
    const close = [...document.querySelectorAll('[data-result-detail] button[aria-label="Close details"]')]
      .find(b => b.getClientRects().length);
    if (!close) return;
    const dialog = !!close.closest('[role="dialog"]');
    /* The open record is named in the URL (rec=09000581). */
    const digits = new URLSearchParams(location.search).get('rec') || '';
    setTimeout(() => {
      if (!close.isConnected) return;
      close.click();
      if (dialog || !digits) return; /* the dialog's focus return is R4-40 */
      setTimeout(() => {
        const row = [...document.querySelectorAll('[data-card-primary][aria-label]')]
          .find(b => b.getAttribute('aria-label').includes(digits));
        row?.focus({ preventScroll: false });
      }, 60);
    }, 0);
  }, true);
})();
