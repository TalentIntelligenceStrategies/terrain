/* R4-37 (restores R3-16) · Patent record (phone): the field panel in two columns; the drawings a strip
 *
 * Panel: where the record body is 420px or narrower, places each dt/dd of
 * the record's field panel on a two-column grid, label above value. The
 * short fields pair up in their own order; Holder, Inventors and Classes
 * (their .field-wide) take a full row each, after the pairs. The dl gets
 * data-terrain-pairs, which R4-37.css keys on; above 420px every inline
 * placement is cleared and their grid is untouched.
 * Strip: below sm, presses their "Show all {n} drawings" once per record,
 * so the sideways strip carries every drawing (it sends their
 * drawing_grid_expanded event, which the component would not).
 * Re-run on every change and on resize. Idempotent. */
(() => {
  if (window.__terrainR3_16) return;
  window.__terrainR3_16 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');

  const place = (el, row, col) => {
    const r = String(row), c = col;
    if (el.style.gridRow !== r) el.style.gridRow = r;
    if (el.style.gridColumn !== c) el.style.gridColumn = c;
  };
  const clear = dl => {
    dl.removeAttribute('data-terrain-pairs');
    for (const el of dl.children) { el.style.removeProperty('grid-row'); el.style.removeProperty('grid-column'); el.removeAttribute('data-terrain-first-row'); }
  };

  const panel = dl => {
    const body = dl.closest('.detail-body');
    if (!body || body.clientWidth > 420) return clear(dl);
    if (!dl.hasAttribute('data-terrain-pairs')) dl.setAttribute('data-terrain-pairs', '');
    const pairs = [];
    for (const dt of dl.querySelectorAll(':scope > dt')) {
      const dd = dt.nextElementSibling?.tagName === 'DD' ? dt.nextElementSibling : null;
      pairs.push({ dt, dd, wide: dt.classList.contains('field-wide') });
    }
    let row = 1, col = 0;
    for (const p of pairs.filter(p => !p.wide)) {
      const c = col === 0 ? '1' : '2';
      place(p.dt, row, c);
      if (p.dd) place(p.dd, row + 1, c);
      p.dt.toggleAttribute('data-terrain-first-row', row === 1);
      if (col === 1) { row += 2; col = 0; } else col = 1;
    }
    if (col === 1) row += 2;
    for (const p of pairs.filter(p => p.wide)) {
      place(p.dt, row, '1 / -1');
      if (p.dd) place(p.dd, row + 1, '1 / -1');
      p.dt.toggleAttribute('data-terrain-first-row', row === 1);
      row += 2;
    }
  };

  const strip = d => {
    if (!phone.matches) return;
    const btn = [...d.querySelectorAll('section[aria-label="Drawings"] button')].find(b => /^Show all \d+ drawings$/.test(b.textContent.trim()));
    if (!btn) return;
    btn.setAttribute('data-terrain-show-all', '');
    btn.click();
  };

  const run = () => {
    for (const dl of document.querySelectorAll('[role="dialog"][data-result-detail] dl.record-fields')) panel(dl);
    for (const d of document.querySelectorAll('[role="dialog"][data-result-detail]')) strip(d);
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  run();
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
  addEventListener('resize', later);
  phone.addEventListener('change', run);
})();
