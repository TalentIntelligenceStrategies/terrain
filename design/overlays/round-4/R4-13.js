/* R4-13 (restores R3-18) · Results, phone: the search floats at the bottom (see R4-13.css)
 *
 * Writes two lengths on <html> for R4-13.css: --r4-dock-h, the floating box
 * with its inset, measured folded (so the list ends above it and does not
 * move while the box is open), and --r4-kb, how far the soft keyboard covers
 * the layout viewport (visualViewport), so the box rides on the keyboard
 * rather than under it; data-r4-kb is set while it is up. Re-measured on
 * every viewport, keyboard and layout change.
 *
 * Also writes .r4-scrim into #main-content, which R4-13.css shows while the
 * box is open; a tap on it closes the box through your own Escape on the
 * field (and a blur, which your box also folds on).
 *
 * In the component this is the dock's own position, padding and scrim. */
(() => {
  if (window.__r4_13) return;
  window.__r4_13 = true;
  const short = matchMedia('(max-width: 39.99rem), (max-height: 480px) and (max-width: 63.99rem)');
  const root = document.documentElement;
  const vv = window.visualViewport;
  const set = (k, v) => { if (root.style.getPropertyValue(k) !== v) root.style.setProperty(k, v); };

  const measure = () => {
    const dock = document.querySelector('#main-content > div.sticky');
    const on = short.matches && dock && dock.querySelector('[data-search-line]');
    const kb = on && vv ? Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop)) : 0;
    set('--r4-kb', `${kb}px`);
    root.toggleAttribute('data-r4-kb', kb > 80);
    /* measured folded only: the list's end must not move while the box is open */
    const folded = on && !dock.querySelector('.search-editor-track.grid-rows-\\[1fr\\]');
    if (folded) set('--r4-dock-h', `${Math.round(dock.firstElementChild.getBoundingClientRect().height)}px`);
  };

  const scrim = () => {
    const main = document.getElementById('main-content');
    if (!main || main.querySelector(':scope > .r4-scrim')) return;
    const el = document.createElement('div');
    el.className = 'r4-scrim';
    el.setAttribute('aria-hidden', 'true');
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      const t = document.querySelector('.search-box-morph textarea');
      t?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      if (document.querySelector('.search-box-morph [data-search-line].invisible')) t?.blur();
    });
    main.prepend(el);
  };

  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; scrim(); measure(); }); } };
  vv?.addEventListener('resize', later);
  vv?.addEventListener('scroll', later);
  addEventListener('resize', later);
  short.addEventListener('change', later);
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  later();
})();
