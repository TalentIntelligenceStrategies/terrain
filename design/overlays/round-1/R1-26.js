/* R1-26 · Every control: a skip link past the masthead
 *
 * Wanted: the first Tab stop on every page is "Skip to content", app/'s
 * wording, visible only while it has focus. It moves focus past the masthead:
 * to the result list on the results, to the page's main region elsewhere.
 * Styled in R1-26.css. In the component this is one anchor at the top of the
 * layout and an id on the region it skips to. */
(() => {
  const a = document.createElement('a');
  a.className = 'terrain-skip';
  a.href = '#';
  a.textContent = 'Skip to content';
  a.addEventListener('click', e => {
    e.preventDefault();
    const list = document.querySelector('section.shell-swap [class*="overflow-y-auto"]') || document.querySelector('main');
    if (!list) return;
    list.setAttribute('tabindex', '-1');
    list.focus();
  });
  document.body.prepend(a);
})();
