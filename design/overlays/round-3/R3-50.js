/* R3-50 · Find similar: one status region
 *
 * Current: two live regions speak about one task. While the similar search
 * runs, the list shows "Finding similar patents…" and the header's chip,
 * "Nearest to US 09000581 B2", is itself role="status"; the page's own
 * polite region (role="status", aria-atomic, the one that says "50 matched,
 * 50 shown.") is not told at all. On a phone the reader hears the chip and
 * the loading line side by side.
 * Wanted:  one region, the page's existing one. It says "Finding similar
 * patents…" when the similar search starts, and that text is replaced on
 * completion by "Nearest to US 09000581 B2. 50 matched, 50 shown." The chip
 * is plain text. The visible loading line is unchanged; their v-if already
 * removes it on completion.
 * Viewport: both (it was found on a phone).
 *
 * Measured on a phone, every live region's text logged on each mutation
 * after Find similar: start "50 matched, 50 shown." → +332ms "Finding
 * similar patents…" → "Nearest to US 09000581 B2. 50 matched, 50 shown.",
 * one region throughout.
 *
 * In the component: drop role="status" from the chip, and bind the page
 * region's text to similarLoading / nearestPatent as well as the count.
 * The patch writes into the region's own text node, so their next count
 * update still lands. */
(() => {
  if (window.__r3_50) return;
  window.__r3_50 = true;
  const LOADING = 'Finding similar patents…';
  let was = false;
  const region = () => document.querySelector('div[role="status"][aria-live="polite"][aria-atomic="true"]');
  const say = s => {
    const r = region();
    if (!r) return;
    const n = [...r.childNodes].find(c => c.nodeType === 3);
    if (n) { if (n.nodeValue !== s) n.nodeValue = s; } else r.textContent = s;
  };
  const fix = () => {
    for (const chip of document.querySelectorAll('span[role="status"][title^="Nearest to"]')) {
      chip.removeAttribute('role');
      chip.setAttribute('data-r3-chip', '');
    }
    const loading = [...document.querySelectorAll('main p')].some(p => p.textContent.trim() === LOADING);
    if (loading && !was) say(LOADING);
    if (!loading && was) {
      const chip = document.querySelector('[data-r3-chip]');
      const count = document.querySelector('section.shell-swap header h2')?.textContent.trim().replace(/\s+/g, ' ').replace(' · ', ', ');
      say([chip?.getAttribute('title'), count].filter(Boolean).join('. ') + '.');
    }
    was = loading;
  };
  new MutationObserver(fix).observe(document.body, { childList: true, subtree: true, characterData: true });
  fix();
})();
