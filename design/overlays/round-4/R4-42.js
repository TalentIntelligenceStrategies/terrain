/* R4-42 (restores R3-55) · Patent record: Escape closes it
 *
 * Current: Escape does nothing to the record. Measured at 1440: with focus
 * on the row, on Next patent or on the title, Escape leaves #…&rec=09000581
 * and the pane in place. At 390 the dialog stays open too, because your
 * DialogContent forwards keydown as a shortcut with .stop, so Reka's own
 * Escape listener on the document never hears it. With the drawing viewer
 * open, Escape closes only the viewer.
 * Wanted:  Escape closes the record, through its own Close details, after
 * anything above it has had the key: the drawing viewer (lightbox), an open
 * menu, listbox or popover (the Export menu, the sort menu), another
 * dialog, a fullscreen element. Escape inside a text field is the field's.
 * After a close from the desktop pane, focus goes to the row's title
 * button.
 * Viewport: both. Desktop is the item; the phone dialog takes the same fix
 * because the same .stop is what breaks it there.
 *
 * Measured with the patch:
 * - 1440: Escape (focus on the row, or on Next patent) drops rec= from the
 *   hash and closes the pane, and focus is on the title button of
 *   US 9000581 B2; after Next patent, Escape puts focus on the title button
 *   of US 9252068 B2; history.length is unchanged (3)
 * - 390: Escape closes the dialog and focus is on the row (R4-40)
 * - with the drawing viewer open (#…&fig=1), the first Escape closes only
 *   the viewer: fig= goes, rec= stays, focus returns to Open figure 1
 *
 * The open record is read from the hash (#s=…&rec=…) and the pane's
 * number; the patch adds no history entry.
 *
 * What was open is read in the capture phase on window, before any
 * handler (yours or Reka's) has closed it, and acted on after the event.
 * In the component: on the desktop pane, a keydown.esc handler that
 * checks the same overlay state your shortcut handler already reads
 * (the open-overlay flag); in the dialog, let Escape through the .stop. */
(() => {
  if (window.__r4_42) return;
  window.__r4_42 = true;
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
    /* The open record is named in the hash (#s=…&rec=09000581); the row's
       name prints it without the leading zero ("US 9000581 B2"). */
    const rec = (new URLSearchParams(location.hash.slice(1)).get('rec') || '').replace(/^0+/, '');
    const pn = close.closest('[data-result-detail]').querySelector('p.font-mono')?.textContent.trim() || '';
    setTimeout(() => {
      if (!close.isConnected) return;
      close.click();
      if (dialog || !(rec || pn)) return; /* the dialog's focus return is R4-40 */
      const hit = rec && new RegExp(`(^|\\D)${rec.replace(/\W/g, '')}(\\D|$)`);
      setTimeout(() => {
        const row = [...document.querySelectorAll('[data-card-primary][aria-label]')]
          .find(b => b.getClientRects().length && ((pn && b.getAttribute('aria-label').includes(pn)) || (hit && hit.test(b.getAttribute('aria-label')))));
        row?.focus({ preventScroll: true });
        row?.scrollIntoView({ block: 'nearest' });
      }, 60);
    }, 0);
  }, true);
})();
