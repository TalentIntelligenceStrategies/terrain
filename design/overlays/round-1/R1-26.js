/* R1-26 · Every control: a skip link to the results
 *
 * Wanted: the first Tab stop is "Skip to results", visible only while it has
 * focus, which moves focus to the result list. Styled in R1-26.css. In the
 * component this is one anchor at the top of the layout and an id on the
 * list. */
(() => {
  const a = document.createElement('a');
  a.className = 'terrain-skip';
  a.href = '#';
  a.textContent = 'Skip to results';
  a.addEventListener('click', e => {
    e.preventDefault();
    const list = document.querySelector('section.shell-swap [class*="overflow-y-auto"]') || document.querySelector('main');
    if (!list) return;
    list.setAttribute('tabindex', '-1');
    list.focus();
  });
  document.body.prepend(a);
})();
