/* R3-12 · Search settings: parallel document types; Rerank says what it does
 *
 * Current: What to include reads "Granted patents" beside the singular
 * "Application". Rerank results reads Off / On and nothing says what it
 * changes, so nobody has a reason to pick either.
 * Wanted:  the two chips read "Grants" and "Applications". Under Rerank, one
 * muted line: "Re-scores the top 200 against your text. Text mode only."
 *
 * What Rerank does, read from their bundle (D8xliVdY.js), not from a
 * response: with Rerank on and a text query, the search asks for 400 hits
 * (gc = 400), keeps the top 200 (yc = 200; grant/application pairs merged
 * first where both kinds are searched), posts those 200 and the query text
 * to /Search/GetPatentRerank, re-sorts them by the scores it returns and
 * keeps the first "How many to bring back". If the call fails it falls back
 * to the original order. In patent-number mode it does nothing (the rerank
 * call requires a text query). What model scores the 200 is not in the client; the hint
 * says only what the client shows.
 * Viewport: both.
 *
 * In the component: change search.kinds (or the chip labels) to "Grants" /
 * "Applications", and add the hint as a string under search.rerank. The
 * patch rewrites the chip text nodes and inserts the hint, both after
 * render. */
(() => {
  if (window.__r3_12) return;
  window.__r3_12 = true;
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
    if (seg && !seg.parentElement.querySelector('[data-r312]')) {
      const p = document.createElement('p');
      p.dataset.r312 = '';
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
