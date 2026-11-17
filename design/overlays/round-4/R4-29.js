/* R4-29 (restores R3-11) · Result row and figure viewer: one kind code everywhere
 *
 * Current: the row and the figure viewer print the kind's letter only,
 * "US 09000581 B", where the record prints "US 09000581 B2". The full code
 * is already on the page: it ends the docId in the row's IPtech link
 * (docId=usb_09000581_13896616_B2) and in every drawing URL
 * (/drw/usb_09000581_13896616_B2/0/1).
 * Wanted:  "US 09000581 B2" in the row's number, its link title, its
 * accessible names, and the viewer's heading. Holder names stay exactly as
 * published: no case change, in any surface. Since v1.0.36 a US record's
 * holder can read in Chinese (a standard name); the kind-code part of this
 * item stands either way, and holder names follow the answer to the
 * package's question Q1.
 * Viewport: both.
 *
 * In the component: one formatter (the one that builds the row's number
 * label) that appends the full kind code, used by the list, the record and the viewer alike. The
 * patch rewrites the formatted strings after render. */
(() => {
  if (window.__r4_29) return;
  window.__r4_29 = true;
  const docIdIn = u => (u && (u.match(/docId=([^&#]+)/) || u.match(/\/drw\/([^/?#]+)/) || [])[1]) || '';
  const kindOf = id => (id.match(/_([A-Z][0-9]?)$/) || [])[1] || '';
  /* "US 09000581 B" -> "US 09000581 B2" only where the printed letter is the
     first letter of the full kind; an already full code is left alone. */
  const full = (s, kind) => s && kind
    ? s.replace(/\b([A-Z]{2} [0-9A-Z]{5,}) ([A-Z])(?![0-9A-Za-z])/g, (m, pn, k) => (k === kind[0] ? `${pn} ${kind}` : m))
    : s;
  const text = (el, kind) => {
    for (const n of el.childNodes) if (n.nodeType === 3) {
      const v = full(n.nodeValue, kind);
      if (v !== n.nodeValue) n.nodeValue = v;
    }
  };
  const attr = (el, name, kind) => {
    const v = el.getAttribute(name);
    const w = full(v, kind);
    if (w !== v) el.setAttribute(name, w);
  };
  const fix = () => {
    for (const card of document.querySelectorAll('[data-result-card]')) {
      const link = card.querySelector('a[href*="docId="]');
      const img = card.querySelector('[data-idx] img');
      const kind = kindOf(docIdIn(link?.getAttribute('href')) || docIdIn(img?.getAttribute('src')));
      if (!kind) continue;
      if (link) { attr(link, 'title', kind); link.querySelectorAll('span').forEach(s => text(s, kind)); }
      card.querySelectorAll('[aria-label]').forEach(e => attr(e, 'aria-label', kind));
      card.querySelectorAll('img[alt]').forEach(e => attr(e, 'alt', kind));
    }
    for (const view of document.querySelectorAll('.figview')) {
      const kind = kindOf(docIdIn(view.querySelector('.figview-stage img')?.getAttribute('src')));
      if (!kind) continue;
      view.querySelectorAll('.figview-no').forEach(e => text(e, kind));
      view.querySelectorAll('[aria-label]').forEach(e => attr(e, 'aria-label', kind));
      view.querySelectorAll('img[alt]').forEach(e => attr(e, 'alt', kind));
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fix(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['href', 'src', 'aria-label', 'title', 'alt'] });
  fix();
})();
