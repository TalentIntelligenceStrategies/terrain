/* R4-02 (restores R3-14) · Masthead: one appearance button on a narrow phone; the version button in the footer
 *
 * Current: three buttons, Light, Dark and Match your system appearance, in
 * a group that does not fit the phone row; beside them the version, the
 * button "View release notes (v1.0.42)" with its unread dot.
 * Wanted:  below 420px, one button that shows the appearance in use and,
 * when pressed, moves to the next: light → dark → system → light. Its name
 * says the appearance in use ("Appearance: Dark"); each press is the same
 * as pressing the next of the three buttons, so the store, its persistence
 * and data-theme on <html> are untouched. Below sm the version is a button
 * in the footer, after "Powered by Innovue": the same name, title, text
 * and unread dot as the masthead's, kept in step with it (the dot goes
 * when the notes have been read), and a press on it is a press on theirs,
 * so the release notes open as they do now.
 * Viewport: the appearance button below 420px, the footer version below sm
 * (R4-02.css). Both are in the page at every width and shown only there.
 *
 * In the component: one appearance button bound to the same setting,
 * cycling it, with the current appearance's icon (sun, moon, monitor); and
 * the version button rendered in the footer below sm instead of the
 * masthead. */
(() => {
  if (window.__r4_02) return;
  window.__r4_02 = true;
  const ORDER = ['Light appearance', 'Dark appearance', 'Match your system appearance'];
  const NAME = { 'Light appearance': 'Light', 'Dark appearance': 'Dark', 'Match your system appearance': 'System' };
  const GROUP = '#__nuxt header [role="group"][aria-label="Choose appearance"]';
  const VERSION = `${GROUP} ~ button[aria-haspopup="dialog"]`;

  const appearance = () => {
    const group = document.querySelector(GROUP);
    if (!group) return;
    let btn = group.parentElement.querySelector(':scope > .r3-appearance');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'r3-appearance hit-target';
      btn.addEventListener('click', () => {
        const g = document.querySelector(GROUP);
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

  /* the footer's version button: a copy of theirs that presses theirs. Its
     contents are refreshed in place, so it keeps focus across an update. */
  const version = () => {
    const v = document.querySelector(VERSION);
    const foot = document.querySelector('#__nuxt > div > footer');
    if (!v || !foot) return;
    let wrap = foot.querySelector(':scope > .r3-version');
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'r3-version';
      const dot = document.createElement('span');
      dot.setAttribute('aria-hidden', 'true');
      dot.textContent = '·';
      const b = document.createElement('button');
      b.type = 'button';
      b.addEventListener('click', () => document.querySelector(VERSION)?.click());
      wrap.append(dot, b);
      foot.append(wrap);
    }
    const b = wrap.querySelector('button');
    for (const a of ['aria-label', 'title', 'aria-haspopup']) {
      const val = v.getAttribute(a);
      if (val == null) b.removeAttribute(a); else if (b.getAttribute(a) !== val) b.setAttribute(a, val);
    }
    /* their classes, less the margin that spaced it from the appearance group */
    const cls = [...v.classList].filter(c => c !== 'ml-1' && c !== 'coarse:ml-2').join(' ');
    if (b.className !== cls) b.className = cls;
    if (b.innerHTML !== v.innerHTML) b.innerHTML = v.innerHTML;
  };

  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; appearance(); version(); });
  }).observe(document.documentElement, {
    subtree: true, childList: true, characterData: true, attributes: true,
    attributeFilter: ['aria-pressed', 'data-theme', 'aria-label', 'class'],
  });
  appearance();
  version();
})();
