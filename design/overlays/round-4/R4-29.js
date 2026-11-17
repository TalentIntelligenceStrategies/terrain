/* R4-29 (restores R3-11) · Record: the Number field reads as the row does
 *
 * Current: the row, its link title, every accessible name, the record's head
 * and the figure viewer all print the number one way, "US 9000581 B2". The
 * record's Number field (dl.record-fields, first row) still prints the
 * zero-padded document number alone, "09000581", so one screen shows the
 * same patent's number in two forms.
 * Wanted:  the Number field reads "US 9000581 B2", the form the row prints.
 * The unpadded form is kept everywhere it already is; nothing else changes.
 * The Kind field (B2) and the Where field stay as they are.
 * Viewport: both (desktop's side pane and the phone's record sheet).
 *
 * Measured with the patch, desktop and phone: the Number field reads
 * "US 9000581 B2", the same string as the record head's link and the row.
 *
 * The patch takes the string from the record's own IPtech link ("Open
 * US 9000581 B2 in IPTECH") and writes it only where the link's digits are
 * the field's digits without their leading zeros; a record whose link is
 * missing keeps its field as shipped.
 *
 * In the component: the Number field renders the same formatted number as
 * the row (the formatter that builds the row's number label), not the raw
 * document number. */
(() => {
  if (window.__r4_29) return;
  window.__r4_29 = true;
  const strip = s => (s || '').replace(/^0+/, '');
  const fix = () => {
    for (const dl of document.querySelectorAll('dl.record-fields')) {
      const dt = [...dl.querySelectorAll(':scope > dt')].find(x => x.textContent.trim() === 'Number');
      const span = dt?.nextElementSibling?.querySelector('span') || dt?.nextElementSibling;
      if (!span) continue;
      const shown = span.textContent.trim();
      if (!/^[0-9A-Z]+$/.test(shown)) continue; /* already formatted, or not a number */
      const scope = dl.closest('[role="dialog"], .detail-stack, [data-result-detail]') || dl.parentElement;
      const link = [...(scope?.querySelectorAll('a[title^="Open "][title$=" in IPTECH"]') || [])]
        .map(a => a.getAttribute('title').replace(/^Open /, '').replace(/ in IPTECH$/, ''))
        .find(pn => strip((pn.match(/^[A-Z]{2} ([0-9A-Z]+)\b/) || [])[1]) === strip(shown));
      if (!link) continue;
      const node = [...span.childNodes].find(n => n.nodeType === 3);
      if (node) node.nodeValue = link; else span.textContent = link;
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fix(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
  fix();
})();
