/* R4-24 (restores R3-34) · Results header, phone: the count reads "50 results"
 *
 * Writes [data-r4-count] after your count heading: "50 results" when every
 * match is shown ("1 result" for one), "50 of 120" when fewer are (shown of
 * matched), read from the heading's two numbers. Your heading stays as the
 * accessible text (R4-24.css hides it visually below sm); ours is
 * aria-hidden. The view toggle is yours, restyled in R4-24.css; this script
 * adds no control. Re-read on every change, as Vue re-renders the header.
 * Idempotent.
 *
 * Also, at every width, rewrites your "Restore the original order" link in
 * the similar state to "Restore order" and marks it [data-r4-restore] for
 * R4-24.css.
 *
 * In the component: render the count below sm as "N results" / "N of M";
 * the restore string is "Restore order". */
(() => {
  if (window.__r4_24) return;
  window.__r4_24 = true;
  const run = () => {
    /* "Restore the original order" reads "Restore order", at every width */
    for (const b of document.querySelectorAll('section.shell-swap header button:not([aria-label])')) {
      const t = [...b.childNodes].find(n => n.nodeType === 3 && /^\s*Restore the original order\s*$/.test(n.nodeValue));
      if (t) t.nodeValue = 'Restore order';
      if (/^\s*Restore (the original )?order\s*$/.test(b.textContent) && !b.hasAttribute('data-r4-restore')) b.setAttribute('data-r4-restore', '');
    }
    const h2 = document.querySelector('section.shell-swap header h2');
    if (!h2) return;
    const [m, sh] = [...h2.querySelectorAll('span.font-mono')].map(x => x.textContent.trim());
    if (!m || !sh) return;
    let el = h2.parentElement.querySelector(':scope > [data-r4-count]');
    if (!el) {
      el = document.createElement('p');
      el.setAttribute('data-r4-count', '');
      el.setAttribute('aria-hidden', 'true');
      h2.after(el);
    }
    const html = m === sh
      ? `<span>${sh}</span> ${sh === '1' ? 'result' : 'results'}`
      : `<span>${sh}</span> of <span>${m}</span>`;
    if (el.innerHTML !== html) el.innerHTML = html;
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
  run();
})();
