/* R1-13 · Every surface: separators and jurisdictions
 *
 * Current: inventors and holders run together with a bare ";"
 * ("Given Family;Given Family"); the jurisdiction is a name or an
 * abbreviation that varies by surface ("U.S." on the card and record,
 * "U.S." / "China" / "Taiwan" in the coverage table).
 * Wanted:  lists separated by "; " (semicolon, space); jurisdictions as
 * two-letter codes on every data surface (US, CN, TW, EP, KR, JP). The
 * search settings keep the names, because there they label a choice.
 * Design-language §4 "Case" is the rule. Case itself (titles, holders,
 * inventors) is the engine's job, R1-06, and is not patched here.
 *
 * In the component this is a formatter on the field, not a text rewrite;
 * the patch rewrites rendered text so it can be seen on the live build. */
(() => {
  const CODES = { 'U.S.': 'US', 'United States': 'US', 'China': 'CN', 'Taiwan': 'TW',
    'Europe': 'EP', 'Korea': 'KR', 'Japan': 'JP' };
  const code = t => CODES[t.trim()] || t;

  const fix = () => {
    // Inventors and holder on the card
    for (const el of document.querySelectorAll('[title="Inventors"] .truncate, [title="Applicant"] .truncate')) {
      const t = el.textContent, n = t.replace(/\s*;\s*/g, '; ');
      if (n !== t) el.textContent = n;
    }
    // "U.S. Grant" on the card
    for (const el of document.querySelectorAll('main span.truncate')) {
      const m = el.textContent.match(/^(U\.S\.|China|Taiwan|Europe|Korea|Japan) (Grant|Application)$/);
      if (m) el.textContent = `${code(m[1])} · ${m[2]}`;
    }
    // "Where" in the record
    for (const dt of document.querySelectorAll('.record-fields dt')) {
      if (dt.textContent.trim() !== 'Where') continue;
      const dd = dt.nextElementSibling;
      if (dd && CODES[dd.textContent.trim()]) dd.textContent = code(dd.textContent);
    }
    // The coverage table's source column
    for (const td of document.querySelectorAll('table tbody tr > :first-child')) {
      if (CODES[td.textContent.trim()]) td.textContent = code(td.textContent);
    }
  };
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fix(); });
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  fix();
})();
