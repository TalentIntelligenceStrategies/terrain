/* R4-15 (restores R3-28) · Search settings: the sheet's height, the popover's room, the scroll fade (see R4-15.css)
 *
 * As a sheet (your phone: variant): removes the inline max-height your
 * placement script wrote from the trigger's position, so the sheet takes
 * its content's height up to R4-15.css's 85dvh. As a popover opening
 * upward: caps the body (--r415-body) so the panel's top stays 16px below
 * the masthead. At both: marks the body data-r415-more while there is more
 * below, which R4-15.css fades. Rewrites the literal title to "Search
 * settings". Re-runs when the panel arrives, when your script rewrites its
 * style or flips it, when the body scrolls or resizes, on resize and when the
 * breakpoint changes. */
(() => {
  if (window.__r4_15) return;
  window.__r4_15 = true;
  const sheet = matchMedia('(not (min-width: 1024px)) and (max-height: 480px), not all and (min-width: 640px)');
  const watched = new WeakSet();

  const more = body => {
    const m = body.scrollHeight - body.scrollTop - body.clientHeight > 1;
    if (m !== body.hasAttribute('data-r415-more')) body.toggleAttribute('data-r415-more', m);
  };
  const setVar = (el, v) => {
    if (v == null) { if (el.style.getPropertyValue('--r415-body')) el.style.removeProperty('--r415-body'); return; }
    if (el.style.getPropertyValue('--r415-body') !== v) el.style.setProperty('--r415-body', v);
  };

  const fit = () => {
    const set = document.querySelector('.pop-set');
    if (!set) return;
    const body = set.querySelector('.pop-body');
    const title = set.querySelector('.pop-title');
    if (title && title.textContent === 'SEARCH SETTINGS') title.textContent = 'Search settings';
    if (!watched.has(set)) {
      watched.add(set);
      new MutationObserver(fit).observe(set, { attributes: true, attributeFilter: ['style'] });
      if (set.parentElement) new MutationObserver(fit).observe(set.parentElement, { attributes: true, attributeFilter: ['class', 'style'] });
      if (body) {
        body.addEventListener('scroll', () => more(body), { passive: true });
        new ResizeObserver(() => more(body)).observe(body);
      }
    }
    const wrap = set.parentElement;
    if (sheet.matches) {
      if (set.style.maxHeight) set.style.removeProperty('max-height');
      setVar(set, null);
    } else if (body && wrap && /bottom-\[/.test(wrap.className)) {
      const head = document.querySelector('#__nuxt > div > header');
      const edge = Math.max(head ? head.getBoundingClientRect().bottom : 0, 0) + 16;
      const room = wrap.parentElement.getBoundingClientRect().top - 8 - edge;
      const chrome = set.offsetHeight - body.offsetHeight;
      setVar(set, `${Math.max(Math.floor(room - chrome), 120)}px`);
    } else {
      setVar(set, null);
    }
    if (body) more(body);
  };

  new MutationObserver(fit).observe(document.body, { subtree: true, childList: true });
  sheet.addEventListener('change', fit);
  window.addEventListener('resize', fit);
  fit();
})();
