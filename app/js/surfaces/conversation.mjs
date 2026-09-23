/* surfaces/conversation — the home surface. platform.md §3.
 *
 * WHAT THIS WAS UNTIL 2026-09-23. One field, five narrowing questions, a
 * priced gate and a build that streamed stages while a map was drawn. All four
 * are gone. The founder types a sentence and presses Search; the set comes
 * back. There is no step between the sentence and the result.
 *
 * THE FILE IS STILL CALLED conversation. It is the home surface now and the
 * name is stale — the rename touches VIEWS, viewForHash, the partial, the
 * host in index.html and every data-view selector, so it is one deliberate
 * pass rather than a rider on this one.
 *
 * THE GLYPH MAP IS CHROME, NOT DATA. The engine returns an icon KEY per field;
 * which 24px path that key draws is ours, and Lucide's. An engine that sent
 * markup would be choosing our icon set for us.
 */
import { $, esc } from '../core/dom.mjs';
import { waitOn, failWith } from '../core/wait.mjs';
import { btnWait, btnRest } from '../core/button-wait.mjs';
import { say } from '../core/live-region.mjs';
import { onActivate } from '../core/delegate.mjs';
import { bar } from '../core/primitives.mjs';

let ENGINE = null;
let FIELD = null;          // the chosen technology field

const G = 'fill="none" stroke="currentColor" stroke-width="1.5" '
        + 'stroke-linecap="round" stroke-linejoin="round"';
const ICON = {
  cpu:     '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
  network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
  battery: '<path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/><path d="m11 7-3 5h4l-3 5"/><path d="M22 11v2"/>',
  stetho:  '<path d="M11 2v2M5 2v2M5 4v7a6 6 0 0 0 12 0V4"/><circle cx="20" cy="10" r="2"/><path d="M20 12v3a6 6 0 0 1-12 0v-1"/>',
};
const ZAP = '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>';

const svg = (p, n) => '<svg width="' + n + '" height="' + n + '" viewBox="0 0 24 24" '
                    + G + '>' + p + '</svg>';

/* ── the technology fields ───────────────────────────────────────────────
   A tile that is not ready is aria-disabled rather than disabled, so it keeps
   its tab stop and can say why it is not available. design-language.md §7. */
function fieldHTML(f) {
  const ready = f.ready === true;
  return '<button class="field" type="button" data-field="' + esc(f.id) + '"'
    + (ready ? ' aria-pressed="false"' : ' aria-disabled="true"') + '>'
    + '<span class="field-icon">' + svg(ICON[f.icon] || ICON.cpu, 24) + '</span>'
    + '<span class="field-name">' + (f.label == null ? bar('w-md', 'body') : esc(f.label)) + '</span>'
    + (ready ? '' : '<span class="field-soon">' + svg(ZAP, 11) + 'Coming soon</span>')
    + '</button>';
}

async function paintFields() {
  const host = $('#fields');
  if (!host) return;
  const done = waitOn(host);
  const res = await ENGINE.fields();
  if (!res.ok) {
    failWith(host, 'The technology fields did not load.',
      res.retryable ? paintFields : null);
    return;
  }
  const list = res.data.fields || [];
  host.innerHTML = list.map(fieldHTML).join('');
  if (typeof done === 'function') done();

  /* the first ready field is chosen on arrival, because a search cannot run
     without one and making the founder pick the only option is a step that
     asks nothing. */
  const first = list.find(f => f.ready === true);
  if (first) selectField(first.id);
}

function selectField(id) {
  FIELD = id;
  document.querySelectorAll('#fields .field[aria-pressed]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.getAttribute('data-field') === id)));
}

/* ── what is in the corpus ───────────────────────────────────────────────── */
async function paintCoverage() {
  const rows = $('#coverRows'), scope = $('#coverScope');
  if (!rows) return;
  const res = await ENGINE.coverage();
  if (!res.ok) {
    const card = $('#coverCard');
    if (card) failWith(card.querySelector('.card-body'),
      'The coverage table did not load.', res.retryable ? paintCoverage : null);
    return;
  }
  if (scope) scope.textContent = res.data.scope || '';
  rows.innerHTML = (res.data.sources || []).map(s =>
    '<tr><td>' + (s.source == null ? bar('w-md', 'body') : esc(s.source)) + '</td>'
    + '<td class="num"><span class="fig-m">' + esc(s.updated || '—') + '</span></td></tr>'
  ).join('');
}

/* ── the search ──────────────────────────────────────────────────────────── */
function armSearch() {
  const field = $('#cmpMain textarea'), btn = $('#cmpSearch');
  if (!field || !btn) return;
  const sync = () => { btn.disabled = !field.value.trim(); };
  field.addEventListener('input', sync);
  sync();
}

export function init(ctx) {
  ENGINE = ctx.engine;

  ctx.onRoute(view => {
    if (view !== 'conversation') return;
    paintFields();
    paintCoverage();
  });

  armSearch();

  onActivate(document, '#fields .field[aria-pressed]', el =>
    selectField(el.getAttribute('data-field')));

  /* THE SEARCH IS THE CHARGE. platform.md §9.2's rule is unchanged and its
     location is: the approval used to be the commitment and there is no
     approval now, so the commitment is this button. A run that did not finish
     is still not a run that was charged. */
  onActivate(document, '#cmpSearch', async btn => {
    const field = $('#cmpMain textarea');
    const text = field && field.value.trim();
    if (!text) return;

    btnWait(btn);
    const res = await ENGINE.search({ query: text, field: FIELD });
    btnRest(btn);

    if (!res.ok) {
      const status = $('#cmpStatus');
      if (status) {
        status.textContent = res.code === 'INSUFFICIENT'
          ? 'There are not enough points for this search. Nothing was charged.'
          : 'The search did not run. Nothing was charged.';
      }
      say('conversation', 'The search did not run. Nothing was charged.');
      return;
    }
    const meter = $('#meterN');
    if (meter && res.data.balance != null) meter.textContent = String(res.data.balance);
    location.hash = '#set';
  });
}
