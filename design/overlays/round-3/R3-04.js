/* R3-04 · Drawing viewer: Back closes only the viewer
 *
 * Current: the viewer pushes no history entry, and the record's &rec is a
 * replaceState, so one Back from the viewer goes from ?s=…&rec=… to ?s=…:
 * viewer and record close together, and the reader loses the record. On
 * Android the back gesture is how a full-screen viewer is closed.
 * Wanted:  opening the viewer pushes one entry, &fig=n, replaced (not pushed)
 * as the figure changes. Back with the viewer open closes the viewer only:
 * record open, results there, URL back to ?s=…&rec=…. Closing by × or
 * Escape pops that entry, so history never fills with dead entries and the
 * next Back leaves the record for the list, as it does today.
 * Viewport: all. Back matters most on a phone, but the entry is the same.
 *
 * The pop of our own entry is caught in the capture phase and stopped, so the
 * app's popstate handler (which reloads the search from the URL) and the
 * router never see it: nothing reloads when the viewer closes. Forward into
 * a dead &fig entry is stepped back over the same way.
 *
 * Measured (page.goBack, replayed API). Phone: open ?s=…&rec=09000581&fig=1,
 * Next -> &fig=2 (replaced, history.length unchanged at 5); Back -> viewer
 * closed, ?s=…&rec=09000581, record open, 50 results, no API call; Back
 * again -> ?s=…, record closed, results stay. × and Escape each return the
 * URL to ?s=…&rec=09000581 without adding an entry, and the next Back
 * leaves the record. Forward into the dead &fig entry steps back to the
 * record. Desktop: the same, except Back from the record lands on
 * ?s=…&rec=… again, because the app reopens the first record by itself
 * at that width (their behaviour, unchanged).
 *
 * In the component: push on open and listen for popstate in the viewer
 * itself (or put fig in the route the record already uses), close on pop,
 * and history.back() on a close that did not come from a pop. */
(() => {
  if (window.__terrainR3_04) return;
  window.__terrainR3_04 = true;
  const MARK = '__terrainFig';
  let pushed = false;     /* our entry is the current one */
  let skip = 0;           /* pops we caused ourselves */
  let wasOpen = false;

  const viewer = () => document.querySelector('.figview.is-open:not(.is-leaving)');
  const figNo = () => {
    const m = (document.querySelector('.figview-cap')?.textContent || '').match(/(\d+)\s+of/);
    return m ? m[1] : '1';
  };
  const urlWith = n => {
    const u = new URL(location.href);
    if (n == null) u.searchParams.delete('fig'); else u.searchParams.set('fig', n);
    return u.pathname + u.search + u.hash;
  };
  const state = () => Object.assign({}, history.state, { [MARK]: true });

  window.addEventListener('popstate', e => {
    const ours = !!(e.state && e.state[MARK]);
    if (skip) { skip--; e.stopImmediatePropagation(); return; }
    if (pushed && !ours) {
      /* Back out of our entry: close the viewer, and nothing else. */
      e.stopImmediatePropagation();
      pushed = false;
      const close = viewer()?.querySelector('button[aria-label="Close large image"]');
      if (close) close.click();
      return;
    }
    if (ours && !viewer()) {
      /* Forward into a dead entry: step back over it. */
      e.stopImmediatePropagation();
      skip++;
      history.back();
    }
  }, true);

  const check = () => {
    const v = viewer();
    if (v && !wasOpen) {
      wasOpen = true;
      if (!pushed) { history.pushState(state(), '', urlWith(figNo())); pushed = true; }
    } else if (v && pushed) {
      const n = figNo();
      if (new URL(location.href).searchParams.get('fig') !== n) history.replaceState(state(), '', urlWith(n));
    } else if (!v && wasOpen) {
      wasOpen = false;
      /* Closed by ×, Escape or the scrim: take our entry back off. */
      if (pushed) { pushed = false; skip++; history.back(); }
    }
  };
  new MutationObserver(check).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'], characterData: true });
  check();
})();
