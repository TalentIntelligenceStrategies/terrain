/* R4-24 (restores R3-34) · Results header, phone: the count reads "50 results"
 *
 * Writes [data-r4-count] after their count heading: "50 results" when every
 * match is shown ("1 result" for one), "50 of 120" when fewer are (shown of
 * matched), read from the heading's two numbers. Their heading stays as the
 * accessible text (R4-24.css hides it visually below sm); ours is
 * aria-hidden. The view toggle is theirs, restyled in R4-24.css; this script
 * adds no control. Re-read on every change, as Vue re-renders the header.
 * Idempotent.
 *
 * In the component: render the count below sm as "N results" / "N of M". */
(() => {
  if (window.__r4_24) return;
  window.__r4_24 = true;
  const run = () => {
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
