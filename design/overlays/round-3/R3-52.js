/* R3-52 · Shell: the page declares English; Chinese records declare theirs
 *
 * Current: <html lang="en"> is set at runtime (bundle/index.html opens a
 * bare <html>; Nuxt adds lang="en" after boot, measured on v1.0.35). CN
 * and TW records carry no lang of their own, so a screen reader reads
 * their titles, holders and abstracts with the English voice (WCAG 3.1.1,
 * 3.1.2).
 * Wanted:  lang="en" on <html> from the first byte, and on each record's
 * title, holder and abstract, the language of its office: lang="zh-Hans"
 * for CN, lang="zh-Hant" for TW. Only those three texts: the labels around
 * them ("Published", "Holder", "Abstract") stay English. A text is marked
 * only when it is written in Chinese (it contains CJK characters), since a
 * CN record can carry an English title.
 * Viewport: both.
 *
 * Where the patch reads the office: on a list row, the IPtech link's
 * docId (usb_…, cnb_…, twa_…); in the record, the number line ("Open CN …
 * in IPtech"). The recording this round replays is US records only, so the
 * patch was checked on a list row and a record whose office and text were
 * rewritten to CN and Chinese in the page: title and abstract
 * lang="zh-Hans", a Latin holder none, the record's h3 zh-Hans, the US
 * rows none, <html lang="en">.
 *
 * In the component: lang="en" in the html template (app.head.htmlAttrs),
 * and a lang binding on the three elements from the record's country. */
(() => {
  if (window.__r3_52) return;
  window.__r3_52 = true;
  const LANG = { CN: 'zh-Hans', TW: 'zh-Hant' };
  const CJK = /[㐀-鿿豈-﫿]/;
  if (!document.documentElement.getAttribute('lang')) document.documentElement.setAttribute('lang', 'en');

  const mark = (el, office) => {
    if (!el) return;
    const want = LANG[office] && CJK.test(el.textContent || '') ? LANG[office] : null;
    const has = el.getAttribute('lang');
    if (want && has !== want) el.setAttribute('lang', want);
    else if (!want && has && el.dataset.r352) el.removeAttribute('lang');
    if (want) el.dataset.r352 = ''; else delete el.dataset.r352;
  };

  function sync() {
    /* list rows */
    for (const card of document.querySelectorAll('[data-result-card]')) {
      const href = card.querySelector('a[href*="docId="]')?.getAttribute('href') || '';
      const m = href.match(/docId=([a-z]{2})[a-z]?_/i);
      const office = m ? m[1].toUpperCase() : '';
      mark(card.querySelector('[data-card-primary]'), office);
      /* the holder is the first meta cell, the one with the building icon,
         whose title is the full name */
      mark(card.querySelector('[data-card-primary]')?.closest('div')?.nextElementSibling?.querySelector('div[title] > span.truncate'), office);
      mark(card.querySelector('p.line-clamp-3'), office);
    }
    /* the record, in the side pane or the phone dialog */
    for (const rec of document.querySelectorAll('.detail-stack')) {
      const t = rec.querySelector('a[title^="Open "][title$=" in IPtech"]')?.getAttribute('title') || '';
      const m = t.match(/^Open ([A-Z]{2}) /);
      const office = m ? m[1] : '';
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
