/* R3-05 · Number search: a malformed number is told apart from a missing one
 *
 * Current: "US12-345" and "US99999999B2" get the same answer: "Patent not
 * found · No patent matches US12-345. Check the office code and the number,
 * or search it as text." The first is not the shape of any patent number;
 * the second is a well-formed number that is not in the index. Their English
 * strings already carry "Accepted examples: {examples}" and never show it.
 * Wanted:  a malformed number gets its own answer, in the not-found card's
 * two lines:
 *   title: "Number not recognised"
 *   line:  "US12-345 is not in a form Terrain recognises. Accepted
 *          examples: US9000581B2, CN115000000A, TWI123456B"
 * with the number and the examples in Inconsolata (so TWI reads as T-W-I).
 * One example per office the search covers: United States, China, Taiwan.
 * A well-formed number that is not in the index keeps their wording. "Search
 * this as text" stays in both.
 * Viewport: both.
 *
 * The shape test: spaces, hyphens and a slash are separators; what is left
 * is an optional two-letter office code, then an optional series letter
 * I or M (Taiwan's; accepted after TW or with no office code), then six to thirteen digits, an optional ".n" check
 * digit (CN applications) and an optional kind code (one letter, one
 * optional digit). Run on these inputs: US12-345, "hello world", 12345 and
 * USX1234567 are malformed; US99999999B2, US 09000581 B2,
 * US 2023/0123456 A1, US-9000581-B2, CN202110123456.7, TWI123456B,
 * TWM612345U, I123456 and 202212345 are well-formed.
 *
 * In the component: the test has to accept exactly what their patent-number
 * lookup accepts, so it lives beside that parser and runs before the
 * request: a malformed number should cost no search at all. The patch can
 * only rewrite the answer after the search has run, keyed on the not-found
 * card. A well-formed missing number keeps their wording; it was not shot,
 * because doing so would have spent a search on their service. */
(() => {
  if (window.__r3_05) return;
  window.__r3_05 = true;
  const LEAD = 'No patent matches ';
  const EXAMPLES = 'US9000581B2, CN115000000A, TWI123456B';
  /* a series letter is Taiwan's (I or M), after TW or on its own */
  const wellFormed = raw => /^(?:TW[IM]?|[IM]|[A-Z]{2})?\d{6,13}(?:\.\d)?(?:[A-Z]\d?)?$/
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
