/* R1-33 · Find similar: say what the score is, and which card is the source
 *
 * Current: after Find similar the list is re-ordered by nearness to the open
 * patent, but every card still labels its score "Relevance", and the open
 * patent ranks first against itself at 1.0000 with nothing to say so.
 * Wanted:  while the list is in nearness order, the score label reads
 * "Nearness"; the source patent's card is marked "This patent" in place of
 * its score. The "Nearest to …" chip already names the source.
 *
 * Keyed on their own chip (span[role=status][title^="Nearest to"]), so it
 * applies exactly while their nearness order is on. In the component this is
 * the label choosing its string from the sort mode. */
(() => {
  const digits = s => (s.match(/\d{5,}/) || [''])[0].replace(/^0+/, '');
  const fix = () => {
    const chip = document.querySelector('span[role="status"][title^="Nearest to"]');
    const cards = document.querySelectorAll('main .group.cursor-pointer');
    for (const card of cards) {
      const label = [...card.querySelectorAll('span.text-xs')].find(s => /^(Relevance|Nearness)$/.test(s.textContent.trim()));
      if (!label) continue;
      const want = chip ? 'Nearness' : 'Relevance';
      if (label.textContent !== want) label.textContent = want;
      const score = label.nextElementSibling;
      const num = card.querySelector('a[title^="Open "] span.truncate');
      const isSource = chip && num && digits(num.textContent) === digits(chip.title);
      if (isSource && !card.querySelector('.terrain-this')) {
        const tag = document.createElement('span');
        tag.className = 'terrain-this';
        tag.textContent = 'This patent';
        label.parentElement.append(tag);
      }
      if (!isSource) card.querySelector('.terrain-this')?.remove();
      label.parentElement.classList.toggle('terrain-is-source', !!isSource);
      if (score) score.hidden = !!isSource;
      label.hidden = !!isSource;
    }
  };
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fix(); });
  }).observe(document.body, { childList: true, subtree: true });
  fix();
})();
