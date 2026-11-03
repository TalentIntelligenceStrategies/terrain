/* R3-24 · Patent record (dialog form): the head names the patent from the start
 *
 * Marks the head row and its empty name slot, and copies the publication
 * number from the record's own number line (the first p.font-mono in the
 * body) into data-terrain-pn, which R3-24.css draws. Re-read on every
 * change, so a next/previous record updates it. Idempotent. */
(() => {
  if (window.__terrainR3_24) return;
  window.__terrainR3_24 = true;
  const run = () => {
    for (const d of document.querySelectorAll('[role="dialog"][data-result-detail]')) {
      const head = [...d.children].find(c => c.querySelector(':scope > button[aria-label="Find similar"]'));
      if (!head) continue;
      if (!head.hasAttribute('data-terrain-record-head')) head.setAttribute('data-terrain-record-head', '');
      const slot = head.querySelector(':scope > div');
      if (!slot) continue;
      if (!slot.hasAttribute('data-terrain-record-name')) slot.setAttribute('data-terrain-record-name', '');
      const pn = d.querySelector('[class*="overflow-y-auto"] p.font-mono')?.textContent.trim() || '';
      if (slot.getAttribute('data-terrain-pn') !== pn) slot.setAttribute('data-terrain-pn', pn);
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  run();
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
