/* surfaces/list — the patent list. platform.md §6.3.
 *
 * ═══ FOUR FIELDS PER ROW AND NO MORE ═══════════════════════════════════════
 * The skim, the holder, the year, the status. The score sits WITH THE TITLE
 * rather than in the field row, and that is not a loophole: it says nothing
 * about the patent, only about where the engine put it.
 *
 * ═══ ALL THREE OF SORT, FILTER AND PAGE ARE REQUESTS ═══════════════════════
 * Twenty rows arrive at a time, so the client never holds the whole set — and
 * sorting what it has would sort A PAGE rather than a result. Each of them
 * waits, each can fail, and none of them spends points. A client-side sort
 * would be faster and would be lying about what it sorted.
 *
 * ═══ THE YEAR IS AN EXCEPTION, AND IT IS ARGUED ════════════════════════════
 * design-language.md §8's third named exception: a date sort over a column of
 * grey bars is an order the founder cannot check. The control is the argument,
 * not the row — so the year is always on, not only under a date sort.
 */
import { $, esc } from '../core/dom.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { say } from '../core/live-region.mjs';
import { onActivate } from '../core/delegate.mjs';
import { wait as pause } from '../core/timers.mjs';
import { bar, statusHTML } from '../core/primitives.mjs';
import { bump, stale } from '../core/generation.mjs';

let ENGINE = null;
let MATCHED = 0;
let loaded = false;
const FLOOR = 240;

/* ── one row ──────────────────────────────────────────────────────────────
   `skim` and `holder` are `string|null`, and null means render the bar. No
   branch here asks whether the data is real — a real engine returning real
   names changes nothing but the presence of a value. */
function rowHTML(rec, i) {
  const real = rec.skim != null;
  return '<div class="set-row" data-i="' + i + '" data-id="' + esc(rec.id) + '">'
    + '<div class="drill-row">'
    + '<button class="drill-toggle" type="button" data-pn="' + esc(rec.id) + '"'
    + ' aria-current="false">'
    + '<span class="drill-head">'
    + '<span class="drill-title">'
    + (real
      ? '<span class="drill-name">' + esc(rec.skim) + '</span>'
      : '<span class="sk sk-h-body w-full" style="margin-bottom:6px"></span>'
        + '<span class="sk sk-h-body" style="width:74%"></span>')
    + '</span>'
    /* THE SAME WORD AS THE RECORD. It read "Relevance" in one place and printed
       a bare figure in the other, which is one number with two names and no
       name. Four decimals, because that is what the engine returns. */
    + '<span class="drill-score" title="How close the engine put this to what you described">'
    + '<span class="t-micro drill-score-k">Score</span>'
    + '<span class="fig fig-s">' + (rec.score == null ? '' : rec.score.toFixed(4)) + '</span>'
    + '</span>'
    + '</span>'
    + '<span class="drill-meta">'
    + (rec.status ? statusHTML(rec.status) : '')
    + (rec.holder != null
      ? '<span class="drill-holder">' + esc(rec.holder) + '</span>'
      : '<span class="sk sk-h-micro w-md"></span>')
    + '<span class="fig fig-s">' + (rec.year == null ? '' : rec.year) + '</span>'
    + '<span class="drill-chev"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"'
    + ' stroke="currentColor" stroke-width="1.5" stroke-linecap="round"'
    + ' stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span>'
    + '</span>'
    + '</button>'
    + '</div></div>';
}

function render(data) {
  const list = $('#setList');
  if (!list) return;
  MATCHED = data.matched;
  landIn(list, data.patents.map(rowHTML).join(''));
  list.setAttribute('aria-busy', 'false');

  const n = $('#setMoreN');
  const left = Math.max(0, data.matched - data.patents.length);
  if (n) n.textContent = String(left);
  const more = $('#setMoreWrap');
  if (more) more.hidden = left === 0;

  const title = $('#setTitle');
  /* `matched` and `patents.length` differ by what was binned, and printing the
     wrong one beneath the standing chip is a recorded regression. */
  if (title) title.textContent =
    `${data.matched} patents matched, ${data.patents.length} shown`;
}

async function request(port, arg, sayWhat) {
  const list = $('#setList');
  if (!list) return;
  const token = bump('list');
  list.setAttribute('aria-busy', 'true');
  waitOn(list, 320);
  const [res] = await Promise.all([ENGINE[port](arg), pause(FLOOR)]);
  /* THE THIRD LINE PEOPLE FORGET. A response that arrives after the founder
     has already asked for something else must not paint — two requests in
     flight is the ordinary case, not the exceptional one. */
  if (stale('list', token)) return;
  if (res.ok) { render(res.data); return res.data; }
  failWith(list, sayWhat, res.retryable
    ? () => request(port, arg, sayWhat) : null);
  say('list', sayWhat);
  return null;
}

export function init(ctx) {
  ENGINE = ctx.engine;

  ctx.onRoute(view => {
    if (view !== 'work' || loaded) return;
    loaded = true;
    request('patents', undefined, 'The list did not load.');
  });

  onActivate(document, '#setMore', () =>
    request('patentsPage', undefined, 'The next page did not load.'));

  onActivate(document, '#sortMenu [data-sort]', el =>
    request('sort', { sort: el.getAttribute('data-sort') },
      'The list could not be re-sorted. It is unchanged.'));

  onActivate(document, '#filtMenu [data-facet]', el =>
    request('facets', { facets: { [el.getAttribute('data-facet')]: el.getAttribute('data-val') } },
      'The list could not be filtered. It is unchanged.'));
}

export const matched = () => MATCHED;
