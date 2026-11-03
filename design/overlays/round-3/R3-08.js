/* R3-08 · Search settings: the technology field can be changed from results
 *
 * Current: in phone portrait the field cannot be changed once a search has
 * run. The header's "Change search domain" select is rendered at every
 * width but is "hidden sm:flex", so it shows at 820 and in landscape only.
 * Search settings, which the phone reaches from results, has the field as
 * its first row, but as read-only text ("All technology fields").
 * Wanted:  below sm, the first row of Search settings is their own field
 * control: the same Reka select, with its label, its list and its
 * behaviour (choosing a field reruns the search in it, as it does from the
 * header). On home the row stays as it is, because the field tiles are on
 * the page and the header select is not rendered there.
 * Viewport: phone portrait (below sm). At sm and up the header has it.
 *
 * The patch moves their select's wrapper from the header into the row while
 * the panel is open below sm, and puts it back, at the same place, before
 * the panel leaves the page or the viewport widens. In the component, render
 * the header's field select (or a second instance bound to the same
 * setting) in the panel's first row below sm. Choosing a field closes the
 * panel, because their panel closes on any pointerdown outside it and the
 * select's list is portalled to <body>; that is the right ending here, since
 * the choice reruns the search, but it also drops any other change made in
 * the panel without Done. The component should apply the panel first, or
 * keep the field change for Done. */
(() => {
  if (window.__r3_08) return;
  window.__r3_08 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  let moved = null; // { node, parent, next }

  const putBack = () => {
    if (!moved) return;
    const { node, parent, next, row } = moved;
    if (parent.isConnected) parent.insertBefore(node, next && next.parentNode === parent ? next : null);
    node.removeAttribute('data-r308');
    if (row) {
      row.removeAttribute('data-r308-row');
      const p = row.querySelector(':scope > p');
      if (p) p.hidden = false;
    }
    moved = null;
  };

  const sync = () => {
    const pop = document.querySelector('.pop-set');
    const row = pop && pop.querySelector('.pop-body > .pop-sec:first-child');
    if (!phone.matches || !row) { putBack(); return; }
    if (moved && moved.row === row && row.contains(moved.node)) return;
    putBack();
    const trigger = document.querySelector('header [aria-label="Change search domain"]');
    if (!trigger) return;
    const node = trigger.parentElement;
    moved = { node, parent: node.parentNode, next: node.nextSibling, row };
    node.setAttribute('data-r308', '');
    row.setAttribute('data-r308-row', '');
    const p = row.querySelector(':scope > p');
    if (p) p.hidden = true;
    row.appendChild(node);
  };

  /* A removal is seen by the observer after the panel left the page, with
     the select still inside it; putting it back then is still before Vue
     next patches the header, so Vue finds its node where it left it. */
  new MutationObserver(sync).observe(document.body, { subtree: true, childList: true });
  phone.addEventListener('change', sync);
  sync();
})();
