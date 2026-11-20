/* surfaces/home — the home surface: the technology fields and the coverage.
 *
 * The composer on this page is the search panel, and surfaces/search.mjs owns
 * it, as it owns the one on the results surface. This module paints the two
 * things only the home surface has.
 */
import { $, esc } from '../core/dom.mjs';
import * as Field from '../core/field.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { codeOf } from '../core/format.mjs';

let ENGINE = null;

const ICON = {
  cpu:     '<path d="M12 20v2"/><path d="M12 2v2"/><path d="M17 20v2"/><path d="M17 2v2"/><path d="M2 12h2"/><path d="M2 17h2"/><path d="M2 7h2"/><path d="M20 12h2"/><path d="M20 17h2"/><path d="M20 7h2"/><path d="M7 20v2"/><path d="M7 2v2"/><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
  network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  battery: '<path d="m11 7-3 5h4l-3 5"/><path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"/><path d="M22 14v-4"/><path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"/>',
  stetho:  '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
};
const BAR = w => `<span class="sk sk-h-body ${w}" aria-hidden="true"></span>`;

/* a field that is not ready is aria-disabled rather than disabled, so it keeps
   its tab stop and can say why it is not available */
function fieldHTML(f) {
  const ready = f.ready === true;
  return `<button class="field" type="button" data-field="${esc(f.id)}"${ready ? ` aria-pressed="${String(f.id === Field.get())}"` : ' aria-disabled="true"'}>`
    + `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICON[f.icon] || ICON.cpu}</svg>`
    + `<span class="field-text"><span class="field-name">${f.label == null ? BAR('w-md') : esc(f.label)}</span>`
    + (ready ? '' : '<span class="field-soon">Coming soon</span>') + '</span></button>';
}

function paintPressed() {
  document.querySelectorAll('#fields .field[aria-pressed]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.getAttribute('data-field') === Field.get())));
}

async function paintFields() {
  const host = $('#fields');
  if (!host) return;
  waitOn(host, 132);
  const res = await ENGINE.fields();
  if (!res.ok) { failWith(host, 'The technology fields did not load.', res.retryable ? paintFields : null); return; }
  const list = res.data.fields || [];
  Field.setList(list);
  /* the first ready field is chosen on arrival, unless one already is: a
     search restored from the address arrives before this list does */
  const chosen = list.find(f => f.id === Field.get() && f.ready === true);
  const first = list.find(f => f.ready === true);
  if (!chosen && first) Field.set(first.id);
  landIn(host, list.map(fieldHTML).join(''));
}

async function paintCoverage() {
  const body = $('#coverBody');
  if (!body) return;
  const html = body.innerHTML;
  waitOn(body, 160);
  const res = await ENGINE.coverage();
  if (!res.ok) { failWith(body, 'The coverage table did not load.', res.retryable ? () => { body.innerHTML = html; paintCoverage(); } : null); return; }
  landIn(body, html);
  $('#coverScope').textContent = res.data.scope || '';
  /* one row per source, two dates; a source the corpus does not include is an
     en dash: an absence, not a withheld value */
  const day = d => `<td class="num"><span class="mono">${d ? esc(d) : '—'}</span></td>`;
  $('#coverRows').innerHTML = (res.data.sources || []).map(s =>
    `<tr><td>${s.source == null ? BAR('w-md') : esc(codeOf(s.source))}</td>${day(s.grant)}${day(s.application)}</tr>`).join('');
}

export function init(ctx) {
  ENGINE = ctx.engine;
  Field.onChange(paintPressed);
  $('#fields').addEventListener('click', e => {
    const b = e.target.closest('.field');
    if (!b || b.getAttribute('aria-disabled') === 'true') return;
    Field.set(b.dataset.field);
  });
  paintFields();
  paintCoverage();
  ctx.onRoute(view => { if (view === 'home') requestAnimationFrame(() => $('#homeSearch textarea')?.focus({ preventScroll: true })); });
}
