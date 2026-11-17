/* R4-12 (restores R3-07) · Number search: the keyboard does not correct a patent number
 *
 * Current: Patent number mode reuses the description textarea and sets no
 * autocapitalize, autocorrect or spellcheck on it (all three null, in Text
 * and in Patent number mode, at 390 and 1440); only enterkeyhint="search"
 * is there, in every mode. So iOS capitalises the first letter only,
 * offers to correct "US20230123456A1" and underlines it as a misspelling.
 * Wanted:  in Patent number mode the field carries
 * autocapitalize="characters", autocorrect="off" and spellcheck="false";
 * back in Text it drops all three. enterkeyhint="search" stays as it is.
 * Viewport: both. The item is filed for the phone, where the keyboard is
 * the fault, but the attributes are input semantics with no layout, and
 * desktop spellcheck underlines a patent number exactly as iOS does.
 *
 * Measured with the patch, at 390 and at 1440:
 *   Text:           the three absent; enterkeyhint search
 *   Patent number:  characters / off / false; enterkeyhint search
 *   Text again:     the three absent; enterkeyhint search
 * What the keyboard then does needs a device.
 *
 * In the component: bind autocapitalize, autocorrect and spellcheck to the
 * Patent number mode on the textarea. The patch follows their aria-pressed
 * on the Patent number segment. */
(() => {
  if (window.__r4_12) return;
  window.__r4_12 = true;
  const NUMBER = { autocapitalize: 'characters', autocorrect: 'off', spellcheck: 'false' };
  const sync = () => {
    for (const box of document.querySelectorAll('.search-box-morph')) {
      const t = box.querySelector('textarea');
      const n = box.querySelector('[role="group"][aria-label="Search mode"] > button[aria-label="Patent number"]');
      if (!t || !n) continue;
      const on = n.getAttribute('aria-pressed') === 'true';
      if (on && t.dataset.r412 !== 'number') {
        const saved = {};
        for (const a of Object.keys(NUMBER)) saved[a] = t.getAttribute(a);
        t.dataset.r412Saved = JSON.stringify(saved);
        for (const [a, v] of Object.entries(NUMBER)) t.setAttribute(a, v);
        t.dataset.r412 = 'number';
      } else if (!on && t.dataset.r412 === 'number') {
        const saved = JSON.parse(t.dataset.r412Saved || '{}');
        for (const a of Object.keys(NUMBER)) {
          if (saved[a] == null) t.removeAttribute(a); else t.setAttribute(a, saved[a]);
        }
        delete t.dataset.r412;
        delete t.dataset.r412Saved;
      }
    }
  };
  new MutationObserver(sync).observe(document.body, {
    subtree: true, childList: true, attributes: true, attributeFilter: ['aria-pressed'],
  });
  sync();
})();
