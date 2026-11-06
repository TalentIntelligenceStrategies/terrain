/* R3-22 · Result row, phone: the date without its label
 *
 * Writes [data-r3-date] beside each row's "Published 2015-04-07", holding
 * the date alone; R3-22.css shows it below sm and hides theirs visually,
 * where it stays as the accessible text. Re-read on every change, as Vue
 * re-renders the list. Idempotent.
 *
 * In the component: below sm the date line renders the date without the
 * "Published" label (the row's hover title keeps Filed, Pub. and Priority). */
(() => {
  if (window.__r3_22) return;
  window.__r3_22 = true;
  const run = () => {
    for (const box of document.querySelectorAll('[data-result-card] div[title^="Filed"]')) {
      const theirs = box.querySelector(':scope > span.truncate');
      const date = (theirs?.textContent.match(/\d{4}-\d{2}-\d{2}/) || [])[0];
      if (!date) continue;
      let mine = box.querySelector(':scope > [data-r3-date]');
      if (!mine) {
        mine = document.createElement('span');
        mine.setAttribute('data-r3-date', '');
        mine.setAttribute('aria-hidden', 'true');
        box.append(mine);
      }
      if (mine.textContent !== date) mine.textContent = date;
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
  run();
})();
