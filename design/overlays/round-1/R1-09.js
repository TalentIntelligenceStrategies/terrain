/* R1-09 · Results surface: a running search says so
 *
 * Current: while a search runs, the previous results fade to half opacity
 * and the Search button greys; no word says a search is running, and nothing
 * is announced to a screen reader (the page has no live region at all).
 * Wanted:  the button keeps its name, Search, and says it is working with
 * aria-busy while the request is in flight; the pulse on the search box
 * (R1-09.css) is what a sighted founder sees. A label that changes mid-press
 * moves the button and reads as a different action. One polite status
 * region, present from load, announces "Searching…" and then the result
 * count. Copy citation, regrouping and find similar should write to the same
 * region; this patch wires the search only.
 *
 * Keyed on their own .progress-bar, which they render exactly while the
 * search runs, so the patch adds no state of its own. In the component this
 * is aria-busy bound to the request and an aria-live element, not an
 * observer. */
(() => {
  const status = document.createElement('div');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';
  document.body.appendChild(status);

  let running = false;
  const button = () => document.querySelector('button[aria-label="Search"]');
  const update = () => {
    const now = !!document.querySelector('main > div.sticky .progress-bar');
    if (now === running) return;
    running = now;
    const b = button();
    if (b) b.setAttribute('aria-busy', String(now));
    if (now) status.textContent = 'Searching…';
    else {
      const count = document.querySelector('section.shell-swap h2');
      status.textContent = count ? count.textContent.trim() : '';
    }
  };
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true });
  update();
})();
