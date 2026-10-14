/* surfaces/home — the home surface. platform.md §3.
 *
 * THE FOUNDER TYPES A SENTENCE AND PRESSES SEARCH, and the set comes back.
 * There is no step between the sentence and the result: no narrowing round,
 * no criteria to approve, no staged build. The commitment is the button.
 *
 * THE GLYPH MAP IS CHROME, NOT DATA. The engine returns an icon KEY per field;
 * which 24px path that key draws is ours, and Lucide's. An engine that sent
 * markup would be choosing our icon set for us.
 */
import { $, esc } from '../core/dom.mjs';
import * as Mode from '../core/search-mode.mjs';
import * as History from '../core/history.mjs';
import * as Field from '../core/field.mjs';
import * as Url from '../core/url.mjs';
import { waitOn, failWith } from '../core/wait.mjs';
import { btnWait, btnRest } from '../core/button-wait.mjs';
import { say } from '../core/live-region.mjs';
import { read as readSettings } from './settings.mjs';
import { onActivate } from '../core/delegate.mjs';
import { bar } from '../core/primitives.mjs';
import * as STARRED from '../core/starred.mjs';
import { landQuery } from './work.mjs';

let ENGINE = null;

const G = 'fill="none" stroke="currentColor" stroke-width="1.5" '
        + 'stroke-linecap="round" stroke-linejoin="round"';
const ICON = {
  cpu:     '<path d="M12 20v2"/><path d="M12 2v2"/><path d="M17 20v2"/><path d="M17 2v2"/><path d="M2 12h2"/><path d="M2 17h2"/><path d="M2 7h2"/><path d="M20 12h2"/><path d="M20 17h2"/><path d="M20 7h2"/><path d="M7 20v2"/><path d="M7 2v2"/><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
  network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  battery: '<path d="m11 7-3 5h4l-3 5"/><path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"/><path d="M22 14v-4"/><path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"/>',
  stetho:  '<path d="M11 2v2"/><path d="M5 2v2"/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
};

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
    /* THE NAME AND ITS BADGE ARE ONE GROUP, so they are one element. The badge
       used to be a third flex item pulled up under the name by a negative
       margin, which put it 4px from the name it qualifies and read as part of
       the field's title. A wrapper with its own gap is what §5's "inner gap
       at most half the outer" looks like when it is built rather than
       subtracted. */
    + '<span class="field-text">'
    + '<span class="field-name">' + (f.label == null ? bar('w-md', 'body') : esc(f.label)) + '</span>'
    + (ready ? '' : '<span class="field-soon">Coming soon</span>')
    + '</span>'
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
  Field.setList(list);
  if (typeof done === 'function') done();

  /* the first ready field is chosen on arrival, because a search cannot run
     without one and making the founder pick the only option is a step that
     asks nothing. */
  /* UNLESS ONE IS ALREADY CHOSEN — a search restored from the address on a
     reload arrives before this list does, and its field stands. */
  const chosen = list.find(f => f.id === Field.get() && f.ready === true);
  const first = list.find(f => f.ready === true);
  if (!chosen && first) selectField(first.id);
}

/* the chosen field lives in core/field.mjs, which the results bar's chip reads */
function selectField(id) { Field.set(id); }

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
  /* ONE ROW PER SOURCE, TWO DATES (platform.md §3.4). A source carried two
     rows, granted and applications, each with one date; the founder reading
     "when was this last taken in" read down a column of near-repeats. An
     index the corpus does not include is an en dash: that is an absence, not
     a withheld value, so it is not a bar. */
  const day = d => '<td class="num"><span class="fig-m">' + (d ? esc(d) : '—') + '</span></td>';
  rows.innerHTML = (res.data.sources || []).map(s =>
    '<tr><td>' + (s.source == null ? bar('w-md', 'body') : esc(s.source)) + '</td>'
    + day(s.grant) + day(s.application) + '</tr>'
  ).join('');
}

/* ── the search ──────────────────────────────────────────────────────────── */
function armSearch() {
  const field = $('#cmpMain textarea'), btn = $('#cmpSearch');
  if (!field || !btn) return;
  const sync = () => { btn.disabled = !field.value.trim(); };
  field.addEventListener('input', sync);
  sync();

  /* ENTER RUNS THE SEARCH; SHIFT+ENTER BREAKS THE LINE. The field is a
     multi-line textarea because a description can be a paragraph, and a
     textarea's own Enter is a newline — so a founder who types a sentence and
     presses Enter gets a blank second line and no search, which reads as the
     product ignoring them.

     NOT DURING COMPOSITION. An IME uses Enter to accept a candidate, and
     submitting there would swallow the keystroke that was choosing a word.
     isComposing is the flag for exactly this. */
  field.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
    e.preventDefault();
    if (!btn.disabled) btn.click();
  });
}

export function init(ctx) {
  ENGINE = ctx.engine;

  ctx.onRoute(view => {
    if (view !== 'home') return;
    paintFields();
    paintCoverage();
  });

  armSearch();

  onActivate(document, '#fields .field[aria-pressed]', el =>
    selectField(el.getAttribute('data-field')));

  /* A SEARCH FROM HISTORY RUNS THROUGH THIS COMPOSER, whichever surface the
     founder is on, so it charges the same path, lands the same way and is
     kept in history again — at the top, because it is the newest. The input
     event is what arms Search: a value written by script fires none. */
  window.addEventListener('terrain:rerun', e => {
    const h = e.detail || {};
    const field = $('#cmpMain textarea'), btn = $('#cmpSearch');
    if (!field || !btn) return;
    /* core/field refuses a field it knows is not ready, and holds one it does
       not know yet until the list arrives */
    if (h.field) selectField(h.field);
    Mode.set(h.mode || 'text');
    field.value = h.query || '';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    btn.click();
  });

  /* BOTH COMPOSERS' TOGGLES, one delegated handler: the value is shared. */
  onActivate(document, '[data-search-mode]', el => Mode.set(el.getAttribute('data-search-mode')));

  onActivate(document, '#cmpSearch', async btn => {
    const field = $('#cmpMain textarea');
    const text = field && field.value.trim();
    if (!text) return;

    btnWait(btn, true);
    const res = await ENGINE.search({ query: text, field: Field.get(), settings: readSettings(), mode: Mode.get() });
    btnRest(btn);

    /* THE SEARCH THE SET IS FILED UNDER, and this is where it is first known.
       Told after the engine answered rather than before it was asked: a query
       that failed produced no rows to star. work.mjs does the same at the
       re-search, and core/starred.mjs carries why the store holds this rather
       than the caller passing it in. */
    if (res.ok) STARRED.setSearch(text);

    if (!res.ok) {
      const status = $('#cmpStatus');
      if (status) {
        /* EACH SAYS WHAT TO DO NEXT, not only what happened. */
        status.textContent = Mode.notFound(res, text)
          || 'The search did not run. Press Search to try again.';
      }
      say('home', status ? status.textContent : 'The search did not run.');
      return;
    }

    /* THE RESULTS BAR KEEPS THE SENTENCE. Both partials are in the DOM from
       boot, so this is a write rather than a handoff — and the founder arriving
       at the results finds the words they searched with still in the field,
       which is what makes it the way to run the next one. work.mjs's
       landQuery writes the field, the folded line and the meta, and folds
       the bar. */
    landQuery(text, res.data);
    /* KEPT IN HISTORY ONCE IT HAS RUN, not when it was asked: a search that
       failed produced nothing to go back to. */
    History.add({ query: text, field: Field.get(), mode: Mode.get(), fieldLabel: Field.label() });
    /* THE LIST IS TOLD, EVERY TIME. It loaded itself on its first route and
       never again, so a second search from here showed the first search's
       rows under the second search's sentence. The same event the results
       bar sends, sent before the route so the list is already asking. */
    window.dispatchEvent(new CustomEvent('terrain:searched'));
    /* THE SEARCH GOES INTO THE ADDRESS, which is also the route to the results
       (core/url.mjs). */
    Url.searched({ query: text, field: Field.get(), mode: Mode.get() });
    if (!location.hash.startsWith('#set')) location.hash = '#set';
  });
}
