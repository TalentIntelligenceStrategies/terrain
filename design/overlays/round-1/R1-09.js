/* R1-09 · Results surface: a running search says so
 *
 * Current: while a search runs, the previous results fade to half opacity
 * and the Search button greys; no word says a search is running, and nothing
 * is announced to a screen reader (the page has no live region at all).
 * Wanted:  the button reads "Searching…" while the request is in flight; one
 * polite status region, present from load, announces "Searching…" and then
 * the result count. Copy citation, regrouping and find similar should write
 * to the same region (A-25); this patch wires the search only.
 *
 * Keyed on their own .progress-bar, which they render exactly while the
 * search runs, so the patch adds no state of its own. In the component this
 * is a computed label and an aria-live element, not an observer. */
(() => {
  const status = document.createElement('div');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';
  document.body.appendChild(status);

  let running = false;
  const label = () => document.querySelector('button[aria-label="Search"] span');
  const update = () => {
    const now = !!document.querySelector('main > div.sticky .progress-bar');
    if (now === running) return;
    running = now;
    const l = label();
    if (l) {
      if (now) { l.dataset.idle = l.textContent; l.textContent = 'Searching…'; }
      else if (l.dataset.idle) l.textContent = l.dataset.idle;
    }
    if (now) status.textContent = 'Searching…';
    else {
      const count = document.querySelector('section.shell-swap h2');
      status.textContent = count ? count.textContent.trim() : '';
    }
  };
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true });
  update();
})();
