/* R4-49 (new) · The silver edge: Find similar is flat while its record is the anchor
 *
 * Marks Find similar with data-r4-anchor while the record it sits in is the
 * patent the list is already sorted by: the "Nearest to" chip
 * (the span titled "Nearest to <number>") names it, and the
 * record's number is the first number-shaped line above the button. The
 * stylesheet drops the edge on a marked button.
 *
 * In the component: Find similar knows the record's docId and the sort's
 * source; compare them, no text matching. */
(() => {
  if (window.__r4_49) return;
  window.__r4_49 = true;
  const NUM = /^[A-Z]{2} ?[A-Z]?\d[\d ]*[A-Z]\d?$/;
  const norm = s => (s || '').replace(/\s+/g, '').toUpperCase();
  const numberOf = btn => {
    for (let el = btn.parentElement; el && el !== document.body; el = el.parentElement) {
      const hit = [...el.querySelectorAll('p, span, h2, h3')].find(n => NUM.test(n.textContent.trim()));
      if (hit) return norm(hit.textContent);
    }
    return '';
  };
  const check = () => {
    const chip = document.querySelector('span[title^="Nearest to "]');
    const anchor = chip ? norm(chip.title.replace('Nearest to ', '')) : '';
    for (const btn of document.querySelectorAll('button[aria-label="Find similar"]')) {
      const on = !!anchor && numberOf(btn) === anchor;
      if (on !== btn.hasAttribute('data-r4-anchor')) btn.toggleAttribute('data-r4-anchor', on);
    }
  };
  check();
  new MutationObserver(check).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title'] });
})();
