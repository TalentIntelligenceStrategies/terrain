/* R3-01 · Composer: Search stays in view above the soft keyboard
 *
 * Current: on a phone with the keyboard up, Search is below the visible
 * area on home (field 452–508, Search 540–576 in a 508px visible height,
 * empty or with four sentences typed), and the reopened folded box on
 * results has no Search at all (R3-01.css). The field is a textarea with no
 * enterkeyhint, so the key reads "return", although Enter submits.
 * Wanted:  the field carries enterkeyhint="search", so the key says Search.
 * While the field has focus on a phone, whenever the visual viewport
 * changes (the keyboard opens, rotates, or a line is typed), the page
 * scrolls just enough that the composer's last row, the one with Search,
 * rests on the visible bottom, 8px clear, without pushing the field's top
 * under the masthead. The reopened box is pinned already, so it needs only
 * Search back (R3-01.css).
 * Viewport: phone (below sm) for the scroll; enterkeyhint at every width.
 * Measured at 390 with the keyboard simulated (viewport shortened 336px,
 * as the audit did), visible height 508:
 *   home, before: field 452–508, Search 540–576 (out of view)
 *   home, after:  field 376–432, Search 464–500 (in view, 8px clear),
 *                 the same with four sentences typed; enterkeyhint=search
 *   results, reopened, with R3-13: Search 277–313 (was: none).
 *
 * In the component: enterkeyhint="search" on the textarea; on focus and on
 * visualViewport resize (which the settings panel already listens to),
 * bring the action row to the visual viewport's bottom. */
(() => {
  if (window.__r3_01) return;
  window.__r3_01 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const vv = window.visualViewport;

  const hint = () => {
    for (const t of document.querySelectorAll('.search-box-morph textarea')) {
      if (t.getAttribute('enterkeyhint') !== 'search') t.setAttribute('enterkeyhint', 'search');
    }
  };

  function keepInView() {
    const t = document.activeElement;
    if (!phone.matches || !t || !t.matches('.search-box-morph textarea')) return;
    const box = t.closest('.search-box-morph');
    const search = box.querySelector('button[aria-label="Search"]');
    const row = search && search.getClientRects().length ? search : box;
    const bottom = vv ? vv.offsetTop + vv.height : innerHeight;
    const head = document.querySelector('#__nuxt > div > header');
    const top = (head ? head.getBoundingClientRect().bottom : 0) + 8;
    const r = row.getBoundingClientRect();
    let dy = r.bottom + 8 - bottom;
    /* never so far that the field's own top goes under the masthead */
    dy = Math.min(dy, t.getBoundingClientRect().top - top);
    if (dy > 1) scrollBy({ top: dy, behavior: 'instant' });
  }
  let queued = false;
  const soon = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; keepInView(); }); } };

  (vv || window).addEventListener('resize', soon);
  document.addEventListener('focusin', e => { if (e.target.matches?.('.search-box-morph textarea')) setTimeout(soon, 50); });
  document.addEventListener('input', e => { if (e.target.matches?.('.search-box-morph textarea')) soon(); });
  new MutationObserver(hint).observe(document.body, {
    subtree: true, childList: true, attributes: true, attributeFilter: ['enterkeyhint'],
  });
  hint();
})();
