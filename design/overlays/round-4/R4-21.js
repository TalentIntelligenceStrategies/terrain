/* R4-21 (restores R3-22) · Result row, phone: the date without its label
 *
 * Writes [data-r4-date] beside each row's "Published 2015-04-07", holding
 * the date alone; R4-21.css shows it below sm and hides yours visually,
 * where it stays as the accessible text. Re-read on every change, as Vue
 * re-renders the list. Idempotent.
 *
 * From sm up it also marks a holder whose name is wider than its column
 * ([data-r4-long] on the holder's block), so R4-21.css can give it the
 * line (see there).
 *
 * In the component: below sm the date line renders the date without the
 * "Published" label (the row's hover title keeps Filed, Pub. and Priority);
 * from sm up a holder wider than its column takes the meta's first line
 * (the card can measure it once per name, or always give the holder the
 * line and put the inventors under it). */
(() => {
  if (window.__r4_21) return;
  window.__r4_21 = true;
  /* From sm up: a holder longer than its column is marked [data-r4-long],
     and R4-21.css gives it the meta's whole first line. Its text width is
     read once while it is still one unwrapped line (a Range over the name
     measures it whole, past the ellipsis) and kept per name, so a resize
     re-decides without a re-read. */
  const wide = matchMedia('(min-width: 40rem)');
  const holders = () => {
    for (const meta of document.querySelectorAll('[data-result-card] div.flex-col.border-t')) {
      const box = meta.querySelector(':scope > div:first-child > div:first-child');
      const name = box?.querySelector(':scope > span.truncate');
      if (!name) continue;
      const text = name.textContent.trim();
      if (box.dataset.r4Name !== text) {
        if (box.hasAttribute('data-r4-long')) { box.removeAttribute('data-r4-long'); }
        box.dataset.r4Name = text;
        const r = document.createRange();
        r.selectNodeContents(name);
        box.dataset.r4W = String(Math.ceil(r.getBoundingClientRect().width));
      }
      /* the column: half the meta less your 16px gap; the name sits after a
         14px icon and a 6px gap */
      const col = (meta.clientWidth - 16) / 2 - 20;
      const long = wide.matches && +box.dataset.r4W > col + 0.5;
      if (box.hasAttribute('data-r4-long') !== long) box.toggleAttribute('data-r4-long', long);
    }
  };
  const run = () => {
    holders();
    for (const box of document.querySelectorAll('[data-result-card] div[title^="Filed"]')) {
      const shown = box.querySelector(':scope > span.truncate');
      const date = (shown?.textContent.match(/\d{4}-\d{2}-\d{2}/) || [])[0];
      if (!date) continue;
      let mine = box.querySelector(':scope > [data-r4-date]');
      if (!mine) {
        mine = document.createElement('span');
        mine.setAttribute('data-r4-date', '');
        mine.setAttribute('aria-hidden', 'true');
        box.append(mine);
      }
      if (mine.textContent !== date) mine.textContent = date;
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
  addEventListener('resize', later);
  run();
})();
