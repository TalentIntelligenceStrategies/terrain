/* R4-02 (restores R3-14) · Masthead: one appearance button on a narrow phone; the version in the footer
 *
 * Current: three buttons, Light, Dark and Match your system appearance, in
 * a group that does not fit the phone row; the version beside them.
 * Wanted:  below 420px, one button that shows the appearance in use and,
 * when pressed, moves to the next: light → dark → system → light. Its name
 * says the appearance in use ("Appearance: Dark"); each press is the same
 * as pressing the next of the three buttons, so the store, its persistence
 * and data-theme on <html> are untouched. Below sm the version is shown in
 * the footer, after "Powered by Innovue", in the footer's muted text.
 * Viewport: the button below 420px, the version below sm (R4-02.css). Both
 * are in the page at every width and shown only there.
 *
 * In the component: one button bound to the same setting, cycling it, with
 * the current appearance's icon (sun, moon, monitor). */
(() => {
  if (window.__r4_02) return;
  window.__r4_02 = true;
  const ORDER = ['Light appearance', 'Dark appearance', 'Match your system appearance'];
  const NAME = { 'Light appearance': 'Light', 'Dark appearance': 'Dark', 'Match your system appearance': 'System' };

  const sync = () => {
    const group = document.querySelector('#__nuxt header [role="group"][aria-label="Choose appearance"]');
    if (!group) return;
    let btn = group.parentElement.querySelector(':scope > .r3-appearance');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'r3-appearance';
      btn.addEventListener('click', () => {
        const g = document.querySelector('#__nuxt header [role="group"][aria-label="Choose appearance"]');
        if (!g) return;
        const cur = ORDER.findIndex(l => g.querySelector(`button[aria-label="${l}"]`)?.getAttribute('aria-pressed') === 'true');
        const next = g.querySelector(`button[aria-label="${ORDER[(cur + 1) % ORDER.length]}"]`);
        if (next) next.click();
      });
      group.after(btn);
    }
    const pressed = ORDER.find(l => group.querySelector(`button[aria-label="${l}"]`)?.getAttribute('aria-pressed') === 'true') || ORDER[2];
    /* the icon: their own, from the button for the appearance in use. With
       system chosen it is the monitor; otherwise the sun or the moon that
       matches what <html> is showing, which is what their control set. */
    const shown = pressed === ORDER[2] ? ORDER[2]
      : (document.documentElement.dataset.theme === 'dark' ? ORDER[1] : ORDER[0]);
    if (btn.dataset.shown !== shown || !btn.firstElementChild) {
      const svg = group.querySelector(`button[aria-label="${shown}"] svg`);
      btn.replaceChildren(...(svg ? [svg.cloneNode(true)] : []));
      btn.dataset.shown = shown;
    }
    const label = `Appearance: ${NAME[shown]}`;
    if (btn.getAttribute('aria-label') !== label) {
      btn.setAttribute('aria-label', label);
      btn.title = label;
    }
  };

  /* the version, copied into the footer once; shown below sm by the CSS */
  const version = () => {
    const v = document.querySelector('#__nuxt header [role="group"][aria-label="Choose appearance"] ~ button:not(.r3-appearance)');
    const foot = document.querySelector('#__nuxt > div > footer');
    if (!v || !foot) return;
    const text = v.textContent.trim();
    let s = foot.querySelector(':scope > .r3-version');
    if (!s) { s = document.createElement('span'); s.className = 'r3-version font-mono'; foot.append(s); }
    if (s.textContent !== '· ' + text) s.textContent = '· ' + text;
  };

  new MutationObserver(() => { sync(); version(); }).observe(document.documentElement, {
    subtree: true, childList: true, attributes: true, attributeFilter: ['aria-pressed', 'data-theme'],
  });
  sync();
  version();
})();
