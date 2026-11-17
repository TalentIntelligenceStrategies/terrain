/* R4-17 (restores R3-33) · Search settings: a small label is three words at most
 *
 * Current: the settings labels (.pop-lbl) are small tracked uppercase,
 * each two or three words, but one runs to five: "HOW MANY TO BRING
 * BACK", the longest uppercase run in the panel.
 * Wanted:  "Results to show", in the same style. Every other uppercase
 * label on home, settings and the record is three words or fewer and stays
 * as it is: "Patent technology fields", "Coming soon", the record's field
 * labels.
 * Viewport: both.
 *
 * Measured with the patch, phone and desktop: the labels read SEARCH
 * SETTINGS · PATENT TECHNOLOGY FIELDS · WHERE TO SEARCH · WHAT TO INCLUDE ·
 * RESULTS TO SHOW · RERANK RESULTS · DATE RANGE.
 *
 * In the component: the string itself; the patch rewrites the text node. */
(() => {
  if (window.__r4_17) return;
  window.__r4_17 = true;
  const fix = () => {
    for (const el of document.querySelectorAll('.pop-lbl')) {
      if (el.textContent.trim() === 'How many to bring back') el.textContent = 'Results to show';
    }
  };
  new MutationObserver(fix).observe(document.body, { childList: true, subtree: true });
  fix();
})();
