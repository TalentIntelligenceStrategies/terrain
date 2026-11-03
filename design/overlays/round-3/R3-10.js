/* R3-10 · Patent record: a claim preamble is a lead-in, not claim 1
 *
 * For every claim list in a record, marks a leading preamble (ends in ":",
 * six words or fewer) as data-terrain-claim-lead, renumbers the index-
 * numbered claims after it, and lowers the Claims count by one. The number
 * their build rendered is kept in data-terrain-orig, and a number Vue has
 * since changed is read fresh, so the pass is idempotent across re-renders
 * (their <li> are keyed by index and reused from record to record). */
(() => {
  if (window.__terrainR3_10) return;
  window.__terrainR3_10 = true;
  const isLead = t => /:\s*$/.test(t) && t.trim().split(/\s+/).length <= 6;
  /* What their build rendered, whether or not this pass has already changed it. */
  const orig = el => (el.hasAttribute('data-terrain-orig') && el.getAttribute('data-terrain-shown') === el.textContent)
    ? el.getAttribute('data-terrain-orig') : el.textContent;
  const show = (el, text, original) => {
    if (el.textContent !== text) el.textContent = text;
    el.setAttribute('data-terrain-orig', original);
    el.setAttribute('data-terrain-shown', text);
  };
  const run = () => {
    for (const ol of document.querySelectorAll('[data-result-detail] section > ol')) {
      const rows = [...ol.children].filter(li => li.tagName === 'LI');
      if (!rows.length) continue;
      const first = rows[0].querySelector(':scope > p');
      const lead = !!first && isLead(first.textContent);
      rows.forEach((li, i) => {
        const span = li.querySelector(':scope > span');
        if (i === 0) li.toggleAttribute('data-terrain-claim-lead', lead);
        else li.removeAttribute('data-terrain-claim-lead');
        if (!span) return;
        const o = orig(span);
        const own = span.classList.contains('text-foreground/80');
        const n = parseInt(o, 10);
        const want = lead && i > 0 && !own && Number.isFinite(n) ? `${n - 1}.` : o;
        show(span, want, o);
      });
      const count = ol.parentElement.querySelector(':scope > h4 > span');
      if (count) {
        const o = orig(count);
        const n = parseInt(o.replace(/\D/g, ''), 10);
        show(count, lead && Number.isFinite(n) ? String(n - 1) : o, o);
      }
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  run();
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
