/* R3-05 · Number search: a malformed number is told apart from a missing one
 *
 * Current: "US12-345" and "US99999999B2" get the same answer: "Patent not
 * found · No patent matches US12-345. Check the office code and the number,
 * or search it as text." The first is not the shape of any patent number;
 * the second is a well-formed number that is not in the index. The bundle
 * ships "Accepted examples: {examples}" (errors.hint.acceptedExamples) and
 * never shows it.
 * Wanted:  a malformed number says it is not a form Terrain recognises and
 * shows the accepted examples; a well-formed missing number keeps their
 * wording. "Search this as text" stays in both.
 * Viewport: both.
 *
 * The shape test here is a stand-in, and the component must own it: spaces,
 * hyphens and a slash are separators; what is left is an optional office
 * code (two letters), an optional series letter (TW I or M), six to thirteen
 * digits, an optional ".n" check digit (CN applications) and an optional
 * kind code (one letter, one optional digit). It has to accept exactly what
 * their GetPatentByPatentNo parser accepts, so in the component it lives
 * beside that parser and runs BEFORE the request: a malformed number should
 * cost no search at all. The patch can only rewrite the answer after the
 * search has run, keyed on their not-found block. The examples are one per
 * office the search covers, set in Inconsolata so TWI reads as T-W-I;
 * US9000581B2 is in their index. The shape test was run on fifteen inputs:
 * US12-345, "hello world" and 12345 are malformed; US99999999B2,
 * US 09000581 B2, US 2023/0123456 A1, US-9000581-B2, CN202110123456.7,
 * TWI123456B, I123456 and 202212345 are well-formed. A well-formed missing
 * number keeps their wording; it was not shot, because US99999999B2 is not
 * in the round's API recording and the run would have spent a search. */
(() => {
  if (window.__r3_05) return;
  window.__r3_05 = true;
  const LEAD = 'No patent matches ';
  const EXAMPLES = 'US9000581B2, US20230123456A1, CN115000000A, TWI123456B';
  const wellFormed = raw => /^(?:[A-Z]{2})?[A-Z]?\d{6,13}(?:\.\d)?(?:[A-Z]\d?)?$/
    .test(raw.toUpperCase().replace(/[\s\-\/]/g, ''));

  const fix = () => {
    for (const button of document.querySelectorAll('button')) {
      if (button.textContent.trim() !== 'Search this as text') continue;
      const card = button.parentElement;
      const [title, hint] = card.querySelectorAll(':scope > p:not([data-r305])');
      if (!title || !hint || !hint.textContent.startsWith(LEAD)) continue;
      const number = hint.textContent.slice(LEAD.length).replace(/\. Check the office code[\s\S]*$/, '').trim();
      const ours = card.querySelectorAll(':scope > [data-r305]');
      const malformed = number && !wellFormed(number);
      if (malformed && card.dataset.r305 === number) continue;
      ours.forEach(e => e.remove());
      title.hidden = false;
      hint.hidden = false;
      delete card.dataset.r305;
      if (!malformed) continue;
      title.hidden = true;
      hint.hidden = true;
      const t = document.createElement('p');
      t.dataset.r305 = 'title';
      t.className = title.className;
      t.textContent = 'Number not recognised';
      const h = document.createElement('p');
      h.dataset.r305 = 'hint';
      h.className = hint.className;
      const code = document.createElement('span');
      code.className = 'font-mono text-foreground';
      code.textContent = number;
      const ex = document.createElement('span');
      ex.className = 'font-mono';
      ex.textContent = EXAMPLES;
      h.append(code, ' is not in a form Terrain recognises. ', 'Accepted examples: ', ex);
      card.insertBefore(t, title);
      card.insertBefore(h, button);
      card.dataset.r305 = number;
    }
  };
  new MutationObserver(fix).observe(document.body, { subtree: true, childList: true, characterData: true });
  fix();
})();
