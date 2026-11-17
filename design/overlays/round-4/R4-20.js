/* R4-20 (restores R3-27) · Grouping panel: the sheet's position and its Done (see R4-20.css)
 *
 * Below sm: marks the panel as a sheet, offsets it by where Reka put its
 * transformed wrapper (so the fixed sheet lands on the viewport's bottom
 * edge), and adds Done, which closes the panel through its own trigger
 * ("Hide result groups"). Re-measures whenever Reka rewrites the wrapper's
 * style, on resize, and when the breakpoint changes. Their "Done" string is
 * the one settings uses. */
(() => {
  if (window.__r4_20) return;
  window.__r4_20 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const watched = new WeakSet();

  const place = pop => {
    const w = pop.parentElement;
    const r = w.getBoundingClientRect();
    pop.style.setProperty('--r327-x', `${r.left}px`);
    pop.style.setProperty('--r327-y', `${r.bottom}px`);
    pop.style.setProperty('--r327-vh', `${window.innerHeight}px`);
    pop.style.setProperty('--r327-vw', `${document.documentElement.clientWidth}px`);
  };

  const sync = () => {
    for (const pop of document.querySelectorAll('.result-groups-popover')) {
      if (!phone.matches) {
        pop.removeAttribute('data-r327');
        continue;
      }
      pop.setAttribute('data-r327', '');
      place(pop);
      if (!watched.has(pop.parentElement)) {
        watched.add(pop.parentElement);
        new MutationObserver(() => place(pop)).observe(pop.parentElement, { attributes: true, attributeFilter: ['style'] });
      }
      if (!pop.querySelector(':scope > [data-r327-foot]')) {
        const foot = document.createElement('div');
        foot.setAttribute('data-r327-foot', '');
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
