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
import { push, drop } from '../core/esc-stack.mjs';
import { focusQuietly } from '../core/focus.mjs';

let ENGINE = null;
let MATCHED = 0;
let loaded = false;
const FLOOR = 240;

/* ── the star ─────────────────────────────────────────────────────────────
   platform.md §6.3. A star is an ANCHOR, not a bookmark: it says "this one is
   close to what I meant", and Re-rank orders the rest by how near they are to
   it. NO PATENT ENTERS OR LEAVES — only the sequence changes, which is why the
   count beside it is a count of the founder's own acts rather than of results.

   It is client state and stays that way. The engine is told the anchors only
   when the founder presses Re-rank, because starring is a thought and
   re-ranking is a request. */
const STARRED = new Set();

function syncStarUI() {
  const chip = $('#setStarChip');
  if (chip) {
    chip.hidden = STARRED.size === 0;
    chip.textContent = STARRED.size + (STARRED.size === 1 ? ' starred' : ' starred');
  }
  /* HIDDEN, NOT DISABLED, exactly as the markup's own note says: a disabled
     button loitering in a 345px bar is clutter, and [hidden] takes it out of
     the tab order too. */
  const rebase = $('#setRebase');
  if (rebase) rebase.hidden = STARRED.size === 0;
}

function toggleStar(id, btn) {
  const on = !STARRED.has(id);
  on ? STARRED.add(id) : STARRED.delete(id);
  btn.setAttribute('aria-pressed', String(on));
  const row = btn.closest('.set-row');
  if (row) on ? row.setAttribute('data-starred', '') : row.removeAttribute('data-starred');
  syncStarUI();
  say('list', on ? 'Starred. Re-rank is available.' : 'Unstarred.');
}

/* ── one row ──────────────────────────────────────────────────────────────
   `skim` and `holder` are `string|null`, and null means render the bar. No
   branch here asks whether the data is real — a real engine returning real
   names changes nothing but the presence of a value. */
function rowHTML(rec, i) {
  const real = rec.skim != null;
  return '<div class="set-row" data-i="' + i + '" data-id="' + esc(rec.id) + '"'
    + (STARRED.has(rec.id) ? ' data-starred' : '') + '>'
    /* THE STAR IS THE FIRST GRID COLUMN. .set-row has been
       `grid-template-columns:auto 1fr` since the row was designed; nothing ever
       filled the first track. */
    + '<button class="set-ctl set-star" type="button" aria-pressed="'
    + (STARRED.has(rec.id) ? 'true' : 'false') + '" data-star="' + esc(rec.id) + '"'
    + ' aria-label="Star this patent as the one closest to your idea">'
    + '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.33l-5.81 3.05'
    + ' 1.11-6.47-4.7-4.58 6.5-.95z"/></svg></button>'
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

/* ── the two bar menus ────────────────────────────────────────────────────
   NOT THE MASTHEAD'S menu() HELPER, and the difference is the mechanism rather
   than a preference. That one toggles [hidden]; .lm-menu animates opacity and
   transform under .lm.is-open, so hiding it outright would skip the transition
   the stylesheet already specifies.

   Escape closes the most recent, through the same stack — which is what makes
   a second overlay safe. An outside click closes too, and the trigger toggles.
   FOCUS MOVES INTO THE MENU on open, because a menu a keyboard cannot reach is
   a menu that is not there. */
function lmMenu(wrapId, btnId, panelId) {
  const wrap = $('#' + wrapId), btn = $('#' + btnId), panel = $('#' + panelId);
  if (!wrap || !btn || !panel) return;

  const close = () => {
    if (!wrap.classList.contains('is-open')) return;
    wrap.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    drop(panelId);
  };
  const open = () => {
    wrap.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    push(panelId, close);
    const first = panel.querySelector('[role="menuitemradio"]');
    if (first) focusQuietly(first);
  };

  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    wrap.classList.contains('is-open') ? close() : open();
  });
  document.addEventListener('click', e => {
    if (!wrap.classList.contains('is-open')) return;
    if (!panel.contains(e.target) && !btn.contains(e.target)) close();
  });
  /* a chosen option closes the menu it was chosen from */
  panel.addEventListener('click', () => close());
  return close;
}

/* one checked item per group, and the tick is the only thing that moves */
function check(panel, el) {
  panel.querySelectorAll('[role="menuitemradio"]').forEach(b =>
    b.setAttribute('aria-checked', String(b === el)));
}

/* ── the re-rank ──────────────────────────────────────────────────────────
   IT RETURNS AN ORDER, NOT A SET, so this cannot go through render(): that
   reads data.patents and a re-rank has none. The rows on screen are the rows
   that stay — the contract's whole claim about this call is that no patent
   enters or leaves — so the DOM nodes are MOVED rather than rebuilt.

   Moving them rather than re-rendering also keeps the star states, the open
   row and any focus inside the list intact, which a rebuild would drop. */
async function reorderTo(anchors) {
  const list = $('#setList');
  if (!list) return;
  const token = bump('list');
  list.setAttribute('aria-busy', 'true');

  const res = await ENGINE.rerank({ anchors });
  if (stale('list', token)) return;
  list.setAttribute('aria-busy', 'false');

  if (!res.ok) {
    say('list', 'The list could not be re-ranked. The order is unchanged.');
    const wrap = $('#setWrap');
    if (wrap) wrap.classList.remove('is-ranked');
    return;
  }

  const rows = new Map([...list.querySelectorAll('.set-row')]
    .map(el => [el.getAttribute('data-id'), el]));
  /* only the ids we actually hold: the engine orders the whole set and the
     client is holding one page of it. */
  (res.data.order || []).forEach(id => {
    const el = rows.get(id);
    if (el) list.append(el);
  });
  say('list', 'Re-ranked around ' + anchors.length
    + (anchors.length === 1 ? ' starred patent.' : ' starred patents.'));
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

  /* a new run replaces the set, so the star anchors go with it: they pointed
     at patents that may not be in this one. */
  window.addEventListener('terrain:searched', () => {
    STARRED.clear();
    syncStarUI();
    const wrap = $('#setWrap');
    if (wrap) wrap.classList.remove('is-ranked');
    request('patents', undefined, 'The list did not load.');
  });

  onActivate(document, '.set-star', el =>
    toggleStar(el.getAttribute('data-star'), el));

  /* THE RE-RANK IS THE ONLY FILLED CONTROL ON THIS SURFACE and it sends the
     anchors the founder chose. The response is an ORDER over the same set. */
  onActivate(document, '#setRebase', () => {
    if (!STARRED.size) return;
    const wrap = $('#setWrap');
    if (wrap) wrap.classList.add('is-ranked');
    const chip = $('#setRankChip');
    if (chip) {
      chip.hidden = false;
      chip.textContent = 'Ranked around ' + STARRED.size
        + (STARRED.size === 1 ? ' starred patent' : ' starred patents');
    }
    const restore = $('#setRestore');
    if (restore) restore.hidden = false;
    reorderTo([...STARRED]);
  });

  onActivate(document, '#setRestore', () => {
    const wrap = $('#setWrap');
    if (wrap) wrap.classList.remove('is-ranked');
    const chip = $('#setRankChip');
    if (chip) { chip.hidden = true; chip.textContent = ''; }
    const restore = $('#setRestore');
    if (restore) restore.hidden = true;
    request('sort', { sort: 'relevance' },
      'The original order could not be restored.');
  });

  lmMenu('sortWrap', 'sortBtn', 'sortMenu');
  lmMenu('filtWrap', 'filtBtn', 'filtMenu');

  /* THE TRIGGER CARRIES THE CURRENT SORT, so the bar states the order without
     the menu being open. A control that says only "Sort" makes the founder
     open it to find out what they are looking at. */
  onActivate(document, '#sortMenu [data-sort]', el => {
    const val = el.getAttribute('data-sort');
    check($('#sortMenu'), el);
    const label = $('#sortLabel');
    if (label) label.textContent = el.querySelector('span:last-child').textContent;
    request('sort', { sort: val }, 'The list could not be re-sorted. It is unchanged.');
  });

  /* `all` CLEARS THE FACET rather than sending one. A filter whose only way off
     is reloading the page is a trap, and the count badge is what says one is on
     — hidden at zero, because a badge reading 0 is a filter that looks applied. */
  onActivate(document, '#filtMenu [data-facet]', el => {
    const val = el.getAttribute('data-facet');
    check($('#filtMenu'), el);
    const count = $('#filtCount');
    if (count) { count.hidden = val === 'all'; count.textContent = '1'; }
    request('facets', { facets: val === 'all' ? {} : { status: val } },
      'The list could not be filtered. It is unchanged.');
  });
}

export const matched = () => MATCHED;
