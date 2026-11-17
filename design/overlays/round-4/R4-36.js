/* R4-36 (restores R3-24) · Patent record (dialog, 640 to 1023): the head names the patent from the start
 *
 * Marks the dialog's head row (data-terrain-record-head) and its name slot
 * (data-terrain-record-name), and copies the number and title from the
 * body's own head ([data-detail-head] p and h3) into data-terrain-pn and
 * data-terrain-title, which R4-36.css draws while the slot is empty, from
 * sm to lg. Vue's children are never touched. While a record loads (the
 * body heads with a bare number and no title) the last name is kept, so
 * Previous and Next do not blank the head. Re-read on every change.
 * Idempotent; adds nothing to the URL or the history. */
(() => {
  if (window.__terrainR4_36) return;
  window.__terrainR4_36 = true;
  const run = () => {
    for (const d of document.querySelectorAll('[role="dialog"][data-result-detail]')) {
      const head = [...d.children].find(c => c.querySelector(':scope > button[aria-label="Find similar"]'));
      if (!head) continue;
      if (!head.hasAttribute('data-terrain-record-head')) head.setAttribute('data-terrain-record-head', '');
      const slot = head.querySelector(':scope > div.min-w-0');
      if (!slot) continue;
      if (!slot.hasAttribute('data-terrain-record-name')) slot.setAttribute('data-terrain-record-name', '');
      const src = d.querySelector('[data-detail-head]') || d.querySelector('[class*="overflow-y-auto"]');
      const pn = src?.querySelector('p.font-mono')?.textContent.trim() || '';
      const title = src?.querySelector('h3')?.textContent.trim() || '';
      if (!/[A-Z]/.test(pn) || !title) continue;
      if (slot.getAttribute('data-terrain-pn') !== pn) slot.setAttribute('data-terrain-pn', pn);
      if (slot.getAttribute('data-terrain-title') !== title) slot.setAttribute('data-terrain-title', title);
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  run();
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
