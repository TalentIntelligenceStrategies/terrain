/* R4-06 (restores R3-59) · Home: the lede does not open a line on a dash
 *
 * Below sm, the space before each em or en dash in the lede (the paragraph
 * after the hero heading) becomes a no-break space, so the dash stays at
 * the end of the line before rather than opening the next. The words are
 * theirs and unchanged. At sm and up the original text is put back.
 * Re-applied if their render replaces the text. Measurements in R4-06.css.
 *
 * In the component: write the no-break space into the lede string. */
(() => {
  if (window.__r4_06) return;
  window.__r4_06 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const NBSP = '\u00a0';

  const apply = () => {
    const p = document.querySelector('#main-content h1.text-4xl + p');
    if (!p) return;
    for (const n of [...p.childNodes].filter(n => n.nodeType === 3)) {
      if (phone.matches) {
        const t = n.data.replace(/ ([—–])/g, `${NBSP}$1`);
        if (t !== n.data) { n.__r359 = n.data; n.data = t; }
      } else if (n.__r359 !== undefined) {
        n.data = n.__r359;
        delete n.__r359;
      }
    }
  };
  phone.addEventListener('change', apply);
  new MutationObserver(apply).observe(document.body, { subtree: true, childList: true, characterData: true });
  apply();
})();
