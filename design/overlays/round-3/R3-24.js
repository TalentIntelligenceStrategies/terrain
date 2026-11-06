/* R3-24 · Patent record (dialog form): the head names the patent from the start
 *
 * Marks the head row and its name slot, and copies the publication number
 * from the record's own number line (the first p.font-mono in the body)
 * into data-terrain-pn, which R3-24.css draws from sm up.
 *
 * Below sm it also writes the head's name block, [data-r3-name]: the number
 * ([data-r3-meta]) and the title ([data-r3-title], cut only past four lines),
 * read from the body's heading. The
 * block sits after their slot, which Vue fills on scroll and which R3-24.css
 * hides below sm, so Vue's own children are never touched. Re-read on every
 * change, so Previous and Next update it. Idempotent. */
(() => {
  if (window.__terrainR3_24) return;
  window.__terrainR3_24 = true;
  const el = (tag, attr, text) => {
    const e = document.createElement(tag);
    e.setAttribute(attr, '');
    if (text != null) e.textContent = text;
    return e;
  };
  const run = () => {
    for (const d of document.querySelectorAll('[role="dialog"][data-result-detail]')) {
      const head = [...d.children].find(c => c.querySelector(':scope > button[aria-label="Find similar"]'));
      if (!head) continue;
      if (!head.hasAttribute('data-terrain-record-head')) head.setAttribute('data-terrain-record-head', '');
      const slot = head.querySelector(':scope > div:not([data-r3-name]):not([data-r3-version])');
      if (!slot) continue;
      if (!slot.hasAttribute('data-terrain-record-name')) slot.setAttribute('data-terrain-record-name', '');
      const body = d.querySelector('[class*="overflow-y-auto"]');
      /* While a version loads (or fails to), the body has no heading: the
         head keeps its shape, with the title and the number from the row
         (R3-21's data-r3-row-title and data-r3-row-pn), so switching Grant
         and Application moves nothing. */
      /* Their loading and failed states head the body with the bare number
         ("20130313698"): that is not a title, and not the full number. */
      const bodyPn = body?.querySelector('p.font-mono')?.textContent.trim() || '';
      const bodyTitle = body?.querySelector('p.font-mono + h3')?.textContent.trim() || '';
      const bare = t => !t || /^[\d\s/.-]+$/.test(t) || t === bodyPn;
      const rowPn = d.getAttribute('data-r3-row-pn') || '';
      const pn = /[A-Z]/.test(bodyPn) ? bodyPn : (rowPn || bodyPn);
      const desc = d.querySelector('[data-slot="dialog-description"]')?.textContent.trim() || '';
      const title = !bare(bodyTitle) ? bodyTitle
        : d.getAttribute('data-r3-row-title') || (!bare(desc) ? desc : '');
      if (slot.getAttribute('data-terrain-pn') !== pn) slot.setAttribute('data-terrain-pn', pn);

      let name = head.querySelector(':scope > [data-r3-name]');
      if (!name) {
        name = el('div', 'data-r3-name');
        const meta = el('div', 'data-r3-meta');
        meta.append(el('span', 'data-r3-pn'));
        name.append(meta, el('div', 'data-r3-title'));
        slot.after(name);
      }
      const num = name.querySelector('[data-r3-pn]'), t = name.querySelector('[data-r3-title]');
      if (num.textContent !== pn) num.textContent = pn;
      if (t.textContent !== title) t.textContent = title;

    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  run();
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
