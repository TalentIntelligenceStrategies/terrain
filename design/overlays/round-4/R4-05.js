/* R4-05 (restores R3-52) · Shell: the page declares English; Chinese records declare theirs
 *
 * Current: the served index.html opens a bare <html>; lang="en" arrives
 * only after boot, from app.head htmlAttrs. Until then the document has no
 * language, which is what a crawler or a reader that does not run the
 * script sees. CN and TW records carry no lang of their own: "zh-Hans" and
 * "zh-Hant" occur nowhere in the bundle, so a screen reader reads their
 * titles, holders and abstracts with the English voice (WCAG 3.1.1, 3.1.2).
 * Wanted:  lang="en" on <html> in the served file, from the first byte;
 * and on each record's title, holder and abstract, the language of its
 * office: lang="zh-Hans" for CN, lang="zh-Hant" for TW. Only those three
 * texts: the labels around them ("Published", "Holder", "Abstract") stay
 * English. A text is marked only when it is written in Chinese (it
 * contains CJK characters), since a CN record can carry an English title.
 * Viewport: both.
 *
 * The patch cannot do the first half: it runs after boot, when your own
 * lang="en" is already there; it only sets it if it is missing. It does the
 * second half. Where it reads the office: on a list row, the number link's
 * title ("Open CN 109891482 B in IPTECH"); in the record, its "Where"
 * field, or failing that the number link's title.
 *
 * Measured: the recorded search has US and EP records only, so the patch
 * was checked by rewriting, in the page, the first row's and the open
 * record's office to CN and their title, holder and abstract to Chinese:
 * the row's title button, holder and abstract, and the record's h3, holder
 * and abstract paragraphs take lang="zh-Hans"; with TW, "zh-Hant"; an
 * English holder on the same record and every other row get none; the
 * labels get none; <html lang="en">. To check it on real records, open
 * CN109891482B and TWI610284B (your own accepted-form examples) by number.
 *
 * In the component: lang="en" on the html element in the served template
 * (not only in htmlAttrs), and a lang binding on the three elements from
 * the record's country. */
(() => {
  if (window.__r4_05) return;
  window.__r4_05 = true;
  const LANG = { CN: 'zh-Hans', TW: 'zh-Hant' };
  const CJK = /[㐀-鿿豈-﫿]/;
  if (!document.documentElement.getAttribute('lang')) document.documentElement.setAttribute('lang', 'en');

  const mark = (el, office) => {
    if (!el) return;
    const want = LANG[office] && CJK.test(el.textContent || '') ? LANG[office] : null;
    const has = el.getAttribute('lang');
    if (want && has !== want) el.setAttribute('lang', want);
    else if (!want && has && el.dataset.r405) el.removeAttribute('lang');
    if (want) el.dataset.r405 = ''; else delete el.dataset.r405;
  };

  /* "Open CN 109891482 B in IPTECH" → CN */
  const officeOf = a => ((a && a.getAttribute('title')) || '').match(/^Open ([A-Z]{2}) .* in IPTECH$/i)?.[1].toUpperCase() || '';

  function sync() {
    /* list rows */
    for (const card of document.querySelectorAll('[data-result-card]')) {
      const office = officeOf(card.querySelector('a[title^="Open "]'));
      mark(card.querySelector('[data-card-primary]'), office);
      /* the holder is the first meta cell, the one with the building icon,
         whose title is the full name */
      mark(card.querySelector('[data-card-primary]')?.closest('div')?.nextElementSibling?.querySelector('div[title] > span.truncate'), office);
      mark(card.querySelector('p.line-clamp-3'), office);
    }
    /* the record, in the side pane or the phone dialog */
    for (const rec of document.querySelectorAll('.detail-stack')) {
      const where = [...rec.querySelectorAll('.record-fields dt')].find(dt => dt.textContent.trim() === 'Where');
      const office = (where?.nextElementSibling?.textContent.trim().match(/^[A-Z]{2}$/) || [])[0]
        || officeOf(rec.querySelector('a[title^="Open "]'));
      mark(rec.querySelector('h3'), office);
      for (const dt of rec.querySelectorAll('.record-fields dt')) {
        if (dt.textContent.trim() === 'Holder') for (const s of dt.nextElementSibling?.querySelectorAll('span') || []) mark(s, office);
      }
      for (const h of rec.querySelectorAll('h4')) {
        if (h.textContent.trim() === 'Abstract') for (const p of h.parentElement.querySelectorAll('p')) mark(p, office);
      }
    }
  }
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; sync(); });
  }).observe(document.body, { subtree: true, childList: true, characterData: true });
  sync();
})();
