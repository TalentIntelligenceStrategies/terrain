/* R3-34 · Results header, phone: the count, the view and Sort on one line
 *
 * Writes [data-r3-count] after their count heading: "50 results" when every
 * match is shown, "50 of 120" when fewer are (shown of matched), read from
 * the heading's two numbers. Their heading stays as the accessible name
 * (R3-34.css hides it visually below sm); ours is aria-hidden.
 *
 * Writes [data-r3-view], a two-button group "Results view" (Details and
 * drawings, Drawings only), icon-only with their own icons, as the first
 * control of the results header's right group, before Sort. Each button
 * clicks theirs in the composer's "View mode" group (hidden below sm by
 * R3-13) and mirrors its aria-pressed, so the view stays their state.
 * Re-ensured on every change, as Vue re-renders the header. Idempotent.
 *
 * In the component: on phones the view toggle renders in the results header,
 * beside Sort, not in the composer. */
(() => {
  if (window.__r3_34) return;
  window.__r3_34 = true;
  const theirs = () => [...document.querySelectorAll('[role="group"][aria-label="View mode"] > button')];
  const count = () => {
    const h2 = document.querySelector('section.shell-swap header h2');
    if (!h2) return;
    const [m, sh] = [...h2.querySelectorAll('span.font-mono')].map(x => x.textContent.trim());
    if (!m || !sh) return;
    let el = h2.parentElement.querySelector(':scope > [data-r3-count]');
    if (!el) {
      el = document.createElement('p');
      el.setAttribute('data-r3-count', '');
      el.setAttribute('aria-hidden', 'true');
      h2.after(el);
    }
    const html = m === sh
      ? `<span>${sh}</span> ${sh === '1' ? 'result' : 'results'}`
      : `<span>${sh}</span> of <span>${m}</span>`;
    if (el.innerHTML !== html) el.innerHTML = html;
  };
  const run = () => {
    count();
    const sort = document.querySelector('button[aria-label="Sort the list"]');
    const right = sort?.parentElement;
    const from = theirs();
    if (!right || from.length < 2) return;
    let group = right.querySelector(':scope > [data-r3-view]');
    if (!group) {
      group = document.createElement('div');
      group.setAttribute('data-r3-view', '');
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'Results view');
      from.forEach((b, i) => {
        const m = document.createElement('button');
        m.type = 'button';
        const name = b.getAttribute('title') || b.textContent.trim();
        m.setAttribute('aria-label', name);
        m.title = name;
        const svg = b.querySelector('svg');
        if (svg) m.append(svg.cloneNode(true));
        m.addEventListener('click', () => { const t = theirs()[i]; if (t && t.getAttribute('aria-pressed') !== 'true') t.click(); });
        group.append(m);
      });
      right.prepend(group);
    }
    [...group.children].forEach((m, i) => {
      const p = from[i]?.getAttribute('aria-pressed') === 'true' ? 'true' : 'false';
      if (m.getAttribute('aria-pressed') !== p) m.setAttribute('aria-pressed', p);
    });
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-pressed'] });
  run();
})();
