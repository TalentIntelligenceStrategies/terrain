/* R4-34 (restores R3-50) · Find similar: one status region
 *
 * Current: three live regions speak about one task. When Find similar
 * starts, the list's loading line "Finding similar patents…" is a
 * p[role=status], and 80ms later the header's chip "Nearest to US 9000581 B2"
 * arrives as a second span[role=status], while the page's own polite region
 * (div[role=status][aria-atomic], the one that says "50 matched, 50 shown.")
 * keeps its count and is not told. Measured on a phone: +0ms loading line,
 * +79ms chip, +380ms the loading line is removed and the chip's region stays.
 * Wanted:  one region, the page's existing one. It says "Finding similar
 * patents…" when the similar search starts, and that text is replaced on
 * completion by "Nearest to US 9000581 B2. 50 matched, 50 shown." The
 * loading line and the chip are plain text, still visible as shipped; their
 * v-if already removes the loading line on completion.
 * Viewport: both (it was found on a phone).
 *
 * Measured on a phone with the patch, every live region's text logged on each
 * mutation after Find similar: one region throughout, "50 matched, 50 shown."
 * → "Finding similar patents…" → "Nearest to US 9000581 B2. 50 matched, 50
 * shown."; no other element carries role=status with text.
 *
 * In the component: drop role="status" from the chip and from the list's
 * loading line, and bind the page region's text to similarLoading /
 * nearestPatent as well as the count. The patch writes into the region's own
 * text node, so their next count update still lands. */
(() => {
  if (window.__r4_34) return;
  window.__r4_34 = true;
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
    const lines = [...document.querySelectorAll('main p')].filter(p => p.textContent.trim() === LOADING);
    for (const p of lines) if (p.getAttribute('role') === 'status') { p.removeAttribute('role'); p.removeAttribute('aria-live'); }
    const loading = lines.length > 0;
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
