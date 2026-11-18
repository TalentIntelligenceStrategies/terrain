/* R4-20 (restores R3-27) · Grouping panel: the sheet's position, its Done, the scroll fade (see R4-20.css)
 *
 * At every width: marks the list data-r420-more while it has more below,
 * which R4-20.css fades. On a phone and in landscape (your phone: variant):
 * marks the panel as a sheet, offsets it by where Reka put its transformed
 * wrapper (so the fixed sheet lands on the viewport's bottom edge), and adds
 * Done, which closes the panel through its own trigger. Re-measures
 * whenever Reka rewrites the wrapper's style, on resize, and when the
 * breakpoint changes. The "Done" string is the one Search settings uses. */
(() => {
  if (window.__r4_20) return;
  window.__r4_20 = true;
  const phone = matchMedia('(not (min-width: 1024px)) and (max-height: 480px), not all and (min-width: 640px)');
  const watched = new WeakSet();
  const faded = new WeakSet();

  const more = list => {
    const m = list.scrollHeight - list.scrollTop - list.clientHeight > 1;
    if (m !== list.hasAttribute('data-r420-more')) list.toggleAttribute('data-r420-more', m);
  };

  const place = pop => {
    const w = pop.parentElement;
    const r = w.getBoundingClientRect();
    pop.style.setProperty('--r420-x', `${r.left}px`);
    pop.style.setProperty('--r420-y', `${r.bottom}px`);
    pop.style.setProperty('--r420-vh', `${window.innerHeight}px`);
    pop.style.setProperty('--r420-vw', `${document.documentElement.clientWidth}px`);
  };

  const sync = () => {
    for (const pop of document.querySelectorAll('.result-groups-popover')) {
      const list = pop.querySelector(':scope > .overflow-y-auto');
      if (list) {
        if (!faded.has(list)) {
          faded.add(list);
          list.addEventListener('scroll', () => more(list), { passive: true });
          new ResizeObserver(() => more(list)).observe(list);
        }
        more(list);
      }
      if (!phone.matches) {
        pop.removeAttribute('data-r420');
        continue;
      }
      pop.setAttribute('data-r420', '');
      place(pop);
      if (!watched.has(pop.parentElement)) {
        watched.add(pop.parentElement);
        new MutationObserver(() => place(pop)).observe(pop.parentElement, { attributes: true, attributeFilter: ['style'] });
      }
      if (!pop.querySelector(':scope > [data-r420-foot]')) {
        const foot = document.createElement('div');
        foot.setAttribute('data-r420-foot', '');
        const done = document.createElement('button');
        done.type = 'button';
        done.className = 'btn btn-secondary';
        done.textContent = 'Done';
        done.addEventListener('click', () => {
          const t = document.querySelector(`[aria-controls="${pop.id}"]`);
          if (t) t.click();
        });
        foot.appendChild(done);
        pop.appendChild(foot);
      }
    }
  };
  new MutationObserver(sync).observe(document.body, { subtree: true, childList: true });
  phone.addEventListener('change', sync);
  window.addEventListener('resize', sync);
  sync();
})();
