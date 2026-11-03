/* R3-07 · Number search: the keyboard does not correct a patent number
 *
 * Current: number mode reuses the description textarea and sets no
 * autocapitalize, autocorrect, spellcheck or enterkeyhint on it, so iOS
 * capitalises the first letter only, offers to correct "US20230123456A1"
 * and underlines it as a misspelling.
 * Wanted:  in number mode the field carries autocapitalize="characters",
 * autocorrect="off", spellcheck="false" and enterkeyhint="search"; back in
 * Text it carries what it carried before (none of the four, on their build).
 * Measured on the live page at 390 and 1440, with the patch:
 * Text: all four absent; Patent number: characters / off / false / search;
 * Text again: all four absent.
 * Viewport: both. The item is filed for the phone, where the keyboard is the
 * fault, but the attributes are input semantics with no layout, and desktop
 * spellcheck underlines a patent number exactly as iOS does.
 *
 * In the component: bind the four attributes to mode === 'by-patent' on the
 * textarea. The patch follows their aria-pressed on the Patent number
 * segment. */
(() => {
  if (window.__r3_07) return;
  window.__r3_07 = true;
  const NUMBER = { autocapitalize: 'characters', autocorrect: 'off', spellcheck: 'false', enterkeyhint: 'search' };
  const sync = () => {
    for (const box of document.querySelectorAll('.search-box-morph')) {
      const t = box.querySelector('textarea');
      const n = box.querySelector('[role="group"][aria-label="Search mode"] > button[aria-label="Patent number"]');
      if (!t || !n) continue;
      const on = n.getAttribute('aria-pressed') === 'true';
      if (on && t.dataset.r307 !== 'number') {
        const saved = {};
        for (const a of Object.keys(NUMBER)) saved[a] = t.getAttribute(a);
        t.dataset.r307Saved = JSON.stringify(saved);
        for (const [a, v] of Object.entries(NUMBER)) t.setAttribute(a, v);
        t.dataset.r307 = 'number';
      } else if (!on && t.dataset.r307 === 'number') {
        const saved = JSON.parse(t.dataset.r307Saved || '{}');
        for (const a of Object.keys(NUMBER)) {
          if (saved[a] == null) t.removeAttribute(a); else t.setAttribute(a, saved[a]);
        }
        delete t.dataset.r307;
        delete t.dataset.r307Saved;
      }
    }
  };
  new MutationObserver(sync).observe(document.body, {
    subtree: true, childList: true, attributes: true, attributeFilter: ['aria-pressed'],
  });
  sync();
})();
