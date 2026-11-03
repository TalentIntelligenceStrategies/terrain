/* R3-16 · Patent record (phone): what it opens on
 *
 * Tags each dt/dd pair of the record's fields with data-terrain-field (its
 * label, lower case), adds a byline under the title (holder · Published
 * date, read from the same fields), and a "More details" toggle after the
 * fields that opens main class and classes. Both added elements are
 * removed at sm and above. Re-run on every change, idempotent.
 * Viewport: phone, below sm (40rem), re-evaluated on change. */
(() => {
  if (window.__terrainR3_16) return;
  window.__terrainR3_16 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const CHEVRON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  const clean = () => {
    document.querySelectorAll('[data-terrain-byline], [data-terrain-more-toggle]').forEach(e => e.remove());
  };
  const run = () => {
    if (!phone.matches) return clean();
    for (const d of document.querySelectorAll('[role="dialog"][data-result-detail]')) {
      const dl = d.querySelector('.detail-body > dl.record-fields');
      const h3 = d.querySelector('[class*="overflow-y-auto"] h3');
      if (!dl) continue;
      const value = {};
      for (const dt of dl.querySelectorAll(':scope > dt')) {
        const key = dt.textContent.trim().toLowerCase();
        const dd = dt.nextElementSibling;
        if (dt.getAttribute('data-terrain-field') !== key) dt.setAttribute('data-terrain-field', key);
        if (dd && dd.tagName === 'DD') {
          if (dd.getAttribute('data-terrain-field') !== key) dd.setAttribute('data-terrain-field', key);
          value[key] = [...dd.querySelectorAll('span')].map(s => s.textContent.trim()).filter(Boolean).join(', ') || dd.textContent.trim();
        }
      }
      /* Byline: holder · Published date, under the title. */
      if (h3) {
        const text = [value.holder, value.published && `Published ${value.published}`].filter(Boolean).join(' · ');
        let by = h3.parentElement.querySelector(':scope > [data-terrain-byline]');
        if (!by) { by = document.createElement('p'); by.setAttribute('data-terrain-byline', ''); }
        if (by.previousElementSibling !== h3) h3.after(by);
        if (by.textContent !== text) by.textContent = text;
      }
      /* More details: only when there is something behind it. */
      const hasMore = !!dl.querySelector(':scope > dt:is([data-terrain-field="main class"], [data-terrain-field="classes"])');
      let tog = dl.parentElement.querySelector(':scope > [data-terrain-more-toggle]');
      if (!hasMore) { tog?.remove(); continue; }
      if (!tog) {
        tog = document.createElement('button');
        tog.type = 'button';
        tog.setAttribute('data-terrain-more-toggle', '');
        tog.setAttribute('aria-expanded', 'false');
        tog.innerHTML = '<span>More details</span>' + CHEVRON;
        tog.addEventListener('click', () => {
          const f = tog.parentElement.querySelector(':scope > dl.record-fields');
          const open = tog.getAttribute('aria-expanded') !== 'true';
          tog.setAttribute('aria-expanded', String(open));
          tog.firstChild.textContent = open ? 'Fewer details' : 'More details';
          f?.setAttribute('data-terrain-more', open ? 'open' : 'closed');
        });
      }
      if (tog.previousElementSibling !== dl) dl.after(tog);
      const want = tog.getAttribute('aria-expanded') === 'true' ? 'open' : 'closed';
      if (dl.getAttribute('data-terrain-more') !== want) dl.setAttribute('data-terrain-more', want);
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  run();
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
  phone.addEventListener('change', run);
})();
