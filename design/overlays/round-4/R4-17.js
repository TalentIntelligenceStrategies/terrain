/* R4-17 (restores R3-33) · Search settings: a small label is three words at most
 *
 * Current: the settings labels are small tracked uppercase, which is the
 * product's rule for a field label (micro, three words at most), and one of
 * them runs to five: "HOW MANY TO BRING BACK", the longest uppercase run on
 * the surface and the one that stops reading as a label.
 * Wanted:  "Results to show". Every other uppercase label on home, settings
 * and the record is within the rule and stays as it is: "Patent technology
 * fields", "Coming soon", the record's field labels.
 * Viewport: both.
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
