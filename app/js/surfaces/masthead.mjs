/* surfaces/masthead — the lockup, New, History, the appearance control and the
 * release notes, at Innovue's 28px recipe (design-language.md §7).
 *
 * HISTORY IS THE FOUNDER'S OWN and lives in this browser (core/history.mjs):
 * the menu lists the searches run here, newest first, and picking one runs it
 * again with the settings the scope row states now.
 */
import { $, $$, esc } from '../core/dom.mjs';
import * as History from '../core/history.mjs';
import * as Pop from '../core/pop.mjs';
import { run } from './search.mjs';

const NOTES_SEEN = 'terrain-notes-seen';
const ICONS = {
  light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  dark: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  system: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
};
const NAMES = { light: 'light', dark: 'dark', system: 'system' };

function theme() { return document.documentElement.getAttribute('data-theme') || 'system'; }

function paintTheme() {
  const t = theme();
  $$('[data-theme-set]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeSet === t)));
  const c = $('#themeCycle');
  if (c) {
    c.innerHTML = `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[t]}</svg>`;
    c.setAttribute('aria-label', `Appearance: ${NAMES[t]}. Change it.`);
  }
}

function paintHistory(list) {
  const pop = $('#histPop');
  if (!pop) return;
  if (!list.length) { pop.innerHTML = '<p class="glabel">Search history</p><p class="none">The searches you run here are listed here.</p>'; return; }
  pop.innerHTML = '<p class="glabel">Search history</p>'
    + list.map((e, i) => `<button type="button" role="menuitem" data-hist="${i}" title="${esc(e.query)}">`
      + `<span class="hq">${esc(e.query)}</span>${e.mode === 'number' ? '<span class="count">Number</span>' : ''}</button>`).join('')
    + '<hr><button type="button" role="menuitem" data-hist-clear>Clear history</button>';
}

export function init(ctx) {
  $('#mastBrand').addEventListener('click', () => { location.hash = '#home'; });
  $('#mastNew').addEventListener('click', () => {
    location.hash = '#home';
    const t = $('#homeSearch textarea');
    if (t) { t.value = ''; t.dispatchEvent(new Event('input')); requestAnimationFrame(() => t.focus()); }
  });

  History.onChange(paintHistory);
  Pop.wire($('#histBtn'), $('#histPop'));
  $('#histPop').addEventListener('click', e => {
    const clear = e.target.closest('[data-hist-clear]');
    if (clear) { History.clear(); Pop.close(true); return; }
    const b = e.target.closest('[data-hist]'); if (!b) return;
    const entry = History.entries()[Number(b.dataset.hist)];
    Pop.close();
    if (entry) run({ query: entry.query, mode: entry.mode, field: entry.field });
  });

  const ver = $('#verBtn');
  let seen = false;
  try { seen = localStorage.getItem(NOTES_SEEN) === ver.textContent.trim(); } catch (e) { /* private window */ }
  ver.toggleAttribute('data-unread', !seen);
  Pop.wire(ver, $('#verPop'), () => {
    ver.removeAttribute('data-unread');
    try { localStorage.setItem(NOTES_SEEN, ver.textContent.trim()); } catch (e) { /* private window */ }
  });

  $$('[data-theme-set]').forEach(b => b.addEventListener('click', () => { ctx.applyTheme(b.dataset.themeSet); paintTheme(); }));
  $('#themeCycle').addEventListener('click', () => {
    ctx.applyTheme({ light: 'dark', dark: 'system', system: 'light' }[theme()]);
    paintTheme();
  });
  paintTheme();
}
