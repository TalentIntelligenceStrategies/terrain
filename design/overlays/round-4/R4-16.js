/* R4-16 (restores R3-12) · Search settings: parallel document types; Rerank says what it does
 *
 * Current: What to include reads "Granted patents" (135×32) beside the
 * singular "Application" (105×32). Rerank results reads Off / On, and
 * nothing in the panel says what it changes.
 * Wanted:  the two chips read "Grants" and "Applications". Under Rerank,
 * one line in --muted-foreground at the panel's 13px, line height 1.4,
 * 8px under the segment (your section's own gap): "Re-scores the top 200
 * against your text. Text mode only." The segment's aria-describedby
 * names it.
 * Viewport: both.
 *
 * Measured with the patch, phone and desktop: the chips read "Grants" and
 * "Applications"; the hint sits 8px under the segment, 13px / 18.2px,
 * --muted-foreground (#5F666D in light, #9AA2AA in dark with the whole
 * patch), and the segment's aria-describedby names it.
 *
 * What Rerank does, read from your shipped client code, not from a
 * response: with Rerank on and a text query, the search asks for 400 hits,
 * keeps the top 200 (grant/application pairs merged first where both kinds
 * are searched), posts those 200 and the query text to
 * /Search/GetPatentRerank, re-sorts them by the scores it returns and keeps
 * the first "Results to show". If the call fails it falls back to the
 * original order. In patent-number mode it does nothing (the rerank call
 * requires a text query). What model scores the 200 is not in the client;
 * the hint says only what the client shows.
 *
 * In the component: change search.kinds (or the chip labels) to "Grants" /
 * "Applications", and add the hint as a string under search.rerank. The
 * patch rewrites the chip text nodes and inserts the hint, both after
 * render. */
(() => {
  if (window.__r4_16) return;
  window.__r4_16 = true;
  const KINDS = { 'Granted patents': 'Grants', Application: 'Applications' };
  const HINT = 'Re-scores the top 200 against your text. Text mode only.';
  const fix = () => {
    for (const chip of document.querySelectorAll('.pop-set .pop-chip')) {
      for (const n of chip.childNodes) {
        if (n.nodeType !== 3) continue;
        const k = n.nodeValue.trim();
        if (KINDS[k]) n.nodeValue = n.nodeValue.replace(k, KINDS[k]);
      }
    }
    const seg = document.querySelector('.pop-set [role="group"][aria-labelledby="popRerankLbl"]');
    if (seg && !seg.parentElement.querySelector('[data-r416]')) {
      const p = document.createElement('p');
      p.dataset.r416 = '';
      p.id = 'popRerankHint';
      p.className = 'pop-hint';
      p.textContent = HINT;
      seg.after(p);
      seg.setAttribute('aria-describedby', 'popRerankHint');
    }
  };
  new MutationObserver(fix).observe(document.body, { subtree: true, childList: true });
  fix();
})();
