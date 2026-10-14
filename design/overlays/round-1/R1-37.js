/* R1-37 · Record: the number and title stay named
 *
 * Current: the record's number and title scroll away with the abstract and
 * claims, so a founder deep in the claims cannot see which patent this is.
 * Wanted:  once the title leaves view, the record's head bar (Find similar,
 * previous, next, close) shows the number and the title, one line,
 * truncated, in the space it already leaves empty. It clears when the title
 * comes back.
 *
 * The bar's spacer (span.flex-1) is filled rather than a new bar added, so
 * the record loses no height. In the component this is an intersection
 * observer on the title and a slot in the head. */
(() => {
  let io = null, watched = null;
  const pane = () => document.getElementById('results-side-pane');
  const slot = () => pane()?.previousElementSibling?.querySelector(':scope > span.flex-1');
  const titleEl = () => pane()?.querySelector('.detail-stack .mb-4 > p');
  const numberEl = () => pane()?.querySelector('.detail-stack .mb-4 > a span.truncate');

  const show = on => {
    const s = slot();
    if (!s) return;
    s.classList.add('terrain-rec-name');
    if (!on) { s.replaceChildren(); s.removeAttribute('data-on'); return; }
    const n = document.createElement('span'); n.className = 'terrain-rec-no'; n.textContent = numberEl()?.textContent || '';
    const t = document.createElement('span'); t.className = 'terrain-rec-title'; t.textContent = titleEl()?.textContent || '';
    s.replaceChildren(n, t);
    s.setAttribute('data-on', '');
  };
  const watch = () => {
    const t = titleEl();
    if (!t || t === watched) return;
    io?.disconnect();
    watched = t;
    show(false);
    io = new IntersectionObserver(([e]) => show(!e.isIntersecting), { root: pane(), threshold: 0 });
    io.observe(t);
  };
  new MutationObserver(watch).observe(document.body, { childList: true, subtree: true });
  watch();
})();
