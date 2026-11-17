/* R4-14 (restores R3-08) · Search settings: the technology field can be changed from results
 *
 * Current: in phone portrait the field cannot be changed once a search has
 * run. The header's "Change search domain" select is rendered at every
 * width but is "hidden sm:flex" (0×0 at 390), so it shows at 820 and in
 * landscape only. Search settings, which the phone reaches from results,
 * has the field as its first row, but as read-only text: <h3
 * class="pop-lbl">Patent technology fields</h3><p>All technology
 * fields</p>, with no control in the panel.
 * Wanted:  below sm, the first row of Search settings is your own field
 * control: the same Reka select, with its label, its list and its
 * behaviour (choosing a field reruns the search in it, as it does from the
 * header). On home the row stays as it is, because the field tiles are on
 * the page and the header select is not rendered there.
 * Viewport: phone portrait (below sm). At sm and up the header has it.
 *
 * Measured with the patch, 390×844 on results: the row holds the select, its trigger
 * 342×28 inside a 44px bordered field in the R4-15 sheet (310×28 without it); the read-only text is
 * hidden. Choosing a field was not exercised here: it runs a new search.
 *
 * The patch moves your select's wrapper from the header into the row while
 * the panel is open below sm, and puts it back, at the same place, before
 * the panel leaves the page or the viewport widens. In the component, render
 * the header's field select (or a second instance bound to the same
 * setting) in the panel's first row below sm. Choosing a field reruns the
 * search in it at once, exactly as the header select does, and the panel
 * closes with it (your panel closes on a pointerdown outside it, and the
 * select's list is portalled to <body>). */
(() => {
  if (window.__r4_14) return;
  window.__r4_14 = true;
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
