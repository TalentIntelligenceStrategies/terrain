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
import { btnWait, btnRest } from '../core/button-wait.mjs';
import * as Starred from '../core/starred.mjs';

let ENGINE = null;
let MATCHED = 0;

/* WHAT THE PORT SAID ABOUT EACH ROW, kept so a star can hand the whole row to
   the set rather than an id. The starred view and the export both need fields
   the DOM renders as bars, and scraping them back out of the markup would mean
   parsing a skeleton. Rebuilt on every render, which is also every point the
   rows could have changed. */
const ROW_BY_ID = new Map();
let loaded = false;
const FLOOR = 240;

/* ── the star ─────────────────────────────────────────────────────────────
   platform.md §6.3. A star is an ANCHOR, not a bookmark: it says "this one is
   close to what I meant", and it does TWO things — platform.md §7.1. It adds
   the patent to the founder's starred set, which is theirs and has a surface of
   its own; and it makes `Find similar` available, which re-orders the whole
   result set by nearness to what was starred. NO PATENT ENTERS OR LEAVES the
   set — what changes is which of them the founder is shown first.

   The engine is told the anchors only when the founder presses Find similar,
   because starring is a thought and re-ordering is a request.

   THE SET ITSELF LIVES IN core/starred.mjs. It outlives this surface: the
   starred view renders it and the export writes it, and a Set private to the
   renderer would have made both of those reach into a renderer for state. */
const STARRED = Starred;

function syncStarUI() {
  const chip = $('#setStarChip');
  if (chip) {
    chip.hidden = STARRED.size() === 0;
    /* ONE FORM, NOT A TERNARY RETURNING THE SAME STRING TWICE. "starred" does
       not inflect, so the branch that stood here computed nothing while reading
       as though it handled a case it did not. */
    chip.textContent = STARRED.size() + ' starred';
  }
  /* HIDDEN, NOT DISABLED, exactly as the markup's own note says: a disabled
     button loitering in a 345px bar is clutter, and [hidden] takes it out of
     the tab order too. */
  const rebase = $('#setRebase');
  if (rebase) rebase.hidden = STARRED.size() === 0;
}

function toggleStar(id, btn) {
  const row = ROW_BY_ID.get(id) || { id };
  const on = STARRED.toggle(id, row);
  btn.setAttribute('aria-pressed', String(on));
  const el = btn.closest('.set-row');
  if (el) on ? el.setAttribute('data-starred', '') : el.removeAttribute('data-starred');
  syncStarUI();
  /* THE CONFIRMATION NAMES THE SET, not just the act. "Starred." says a
     button was pressed; the founder needs to know a collection exists, how big
     it is, and that it is the thing they can take out. */
  say('list', on
    ? 'Starred. ' + STARRED.size() + (STARRED.size() === 1 ? ' patent' : ' patents')
      + ' in your starred set. Find similar is available.'
    : 'Unstarred. ' + (STARRED.size()
        ? STARRED.size() + (STARRED.size() === 1 ? ' patent' : ' patents') + ' left.'
        : 'Nothing starred.'));
}

/* the sentence a screen reader reads for one row */
function rowName(rec, i) {
  const bits = [rec.skim != null ? rec.skim : 'Patent ' + (i + 1)];
  if (rec.holder != null) bits.push(rec.holder);
  if (rec.year != null) bits.push(String(rec.year));
  if (rec.status) bits.push(rec.status === 'live' ? 'Live' : 'Expired');
  if (rec.score != null) bits.push('score ' + rec.score.toFixed(4));
  return bits.join(', ') + '. Open the record.';
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
    /* THE ROW'S OWN NAME, because the one it composed from its children was
       "Score0.6620Live2020" — every span concatenated with no separators, and
       nothing at all where the title is a bar. A screen-reader user picking a
       row from a list heard a number run into a status run into a year.

       aria-label wins over the contents, so the visible layout is free to stay
       a grid of fragments while the name stays a sentence. */
    + '<button class="drill-toggle" type="button" data-pn="' + esc(rec.id) + '"'
    + ' aria-label="' + esc(rowName(rec, i)) + '"'
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

/* `append` IS PAGING, and it is the whole difference between Show more and
   every other request on this surface.

   The port returns the CUMULATIVE page — twenty rows, then forty, then sixty —
   so re-rendering all of them was correct data and wrong behaviour: twenty rows
   the founder was reading were destroyed and rebuilt to add twenty below them.
   Focus inside the list went to <body>, the scroll position was whatever the
   new height made it, and anything mid-hover lost its state.

   So paging renders only the tail and leaves what is above it alone. `landIn`
   with a null body is doing the half of its job that still applies: clear
   `is-wait`/`is-fail` and the inline min-height, touch no content. */
function render(data, append) {
  const list = $('#setList');
  if (!list) return;
  MATCHED = data.matched;
  data.patents.forEach(r => ROW_BY_ID.set(r.id, r));
  if (append) {
    const have = list.querySelectorAll('.set-row').length;
    landIn(list, null);
    /* the offset keeps data-i and the "Patent N" fallback name global rather
       than per page — a second page starting over at 1 would name two rows
       the same thing to a screen reader. */
    const fresh = data.patents.slice(have)
      .map((rec, k) => rowHTML(rec, have + k)).join('');
    if (fresh) list.insertAdjacentHTML('beforeend', fresh);
  } else {
    landIn(list, data.patents.map(rowHTML).join(''));
  }
  list.setAttribute('aria-busy', 'false');

  const n = $('#setMoreN');
  const left = Math.max(0, data.matched - data.patents.length);
  if (n) n.textContent = String(left);
  const more = $('#setMoreWrap');
  if (more) more.hidden = left === 0;

  const title = $('#setTitle');
  /* `matched` and `patents.length` differ by what was binned, and printing the
     wrong one beneath the standing chip is a recorded regression.

     ONE TEMPLATED STRING PER PLURAL FORM, not a sentence assembled around two
     numbers. Word order moves between languages and "1 patents matched" is
     what fragment concatenation ships. It is also shorter now, because the
     old form wrapped to three lines in this column. */
  if (title) {
    const m = data.matched, n = data.patents.length;
    title.textContent = m === 1
      ? '1 patent matched'
      : (m === n ? `${m} patents matched` : `${m} patents matched · ${n} shown`);
  }
}

/* `into` NAMES WHERE THE WAIT IS SHOWN, and there are only two answers.

   A request that REPLACES the list waits in the list: the rows are about to
   stop being true, so they go and the region says it is working. A request
   that EXTENDS it waits in the button that asked — the twenty rows on screen
   are still true and blanking them to fetch twenty more tells the founder
   their list broke.

   This is the same rule the search button already follows, and the CSS for it
   was written for #setMore before anything set the attribute: 05-wait-fail.css
   styles `#setMore[data-waiting]` by name, strips the button's ground and
   hides its label and chevron together. It has been unreachable since. */
async function request(port, arg, sayWhat, into) {
  const list = $('#setList');
  if (!list) return;
  const btn = into && $(into);
  /* btnWait returns false when the button is already waiting, which is the
     re-press guard: two presses of Show more is one intention. */
  if (btn && !btnWait(btn)) return null;
  const token = bump('list');
  list.setAttribute('aria-busy', 'true');
  if (!btn) waitOn(list, 320);
  const [res] = await Promise.all([ENGINE[port](arg), pause(FLOOR)]);
  if (btn) btnRest(btn);
  /* THE THIRD LINE PEOPLE FORGET. A response that arrives after the founder
     has already asked for something else must not paint — two requests in
     flight is the ordinary case, not the exceptional one. */
  if (stale('list', token)) return;
  if (res.ok) { render(res.data, Boolean(btn)); return res.data; }
  /* A PAGE THAT DID NOT LOAD DOES NOT REPLACE THE PAGE THAT DID. The failure
     for an extending request is announced and offered in the foot; writing the
     fail block into #setList would throw away the rows that are still good to
     report that the next twenty are not. */
  if (btn) {
    say('list', sayWhat);
    list.setAttribute('aria-busy', 'false');
    return null;
  }
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

/* ── find similar ─────────────────────────────────────────────────────────
   IT RETURNS AN ORDER, NOT A SET, so this cannot go through render(): that
   reads data.patents and this call has none. The rows on screen are the rows
   that stay — the contract's whole claim about this call is that no patent
   enters or leaves — so the DOM nodes are MOVED rather than rebuilt.

   Moving them rather than re-rendering also keeps the star states, the open
   row and any focus inside the list intact, which a rebuild would drop.

   ═══ THE SETTLED STATE IS DECLARED HERE, NOT BY THE PRESS ══════════════════
   The chip, the band class and the Restore button used to be set by the click
   handler BEFORE this call answered, and the failure branch rolled back only
   the class. So a refused request left a chip reading "Nearest to 2 starred
   patents" and a Restore button offering to undo an order that never changed —
   the interface asserting an outcome the engine had just declined. Everything
   that says "this happened" now happens where it is known to have happened. */
function settled(on, n) {
  const wrap = $('#setWrap');
  if (wrap) wrap.classList.toggle('is-ranked', on);
  const chip = $('#setRankChip');
  if (chip) {
    chip.hidden = !on;
    chip.textContent = on
      ? 'Nearest to ' + n + (n === 1 ? ' starred patent' : ' starred patents')
      : '';
  }
  const restore = $('#setRestore');
  if (restore) restore.hidden = !on;
}

async function reorderTo(anchors) {
  const list = $('#setList');
  if (!list) return;
  const btn = $('#setRebase');
  if (btn && !btnWait(btn)) return;
  const token = bump('list');
  list.setAttribute('aria-busy', 'true');

  const res = await ENGINE.rerank({ anchors });
  if (btn) btnRest(btn);
  if (stale('list', token)) return;
  list.setAttribute('aria-busy', 'false');

  if (!res.ok) {
    say('list', 'Similar patents could not be found. The order is unchanged.');
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
  settled(true, anchors.length);
  say('list', 'Ordered by nearness to ' + anchors.length
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
    request('patentsPage', undefined,
      'The next page did not load. The patents already shown are unchanged.',
      '#setMore'));

  /* THE STARRED SET SURVIVES A NEW SEARCH, and this used to clear it.
     platform.md §7.1: the set is the founder's own shortlist and the thing
     they take out of Terrain, so emptying it because they ran another query
     deletes their work to save them a click. What DOES go is the ordering —
     `Find similar` ordered the previous result set and this is a different
     one — so the settled state is stood down and the list reloads. */
  window.addEventListener('terrain:searched', () => {
    settled(false, 0);
    syncStarUI();
    request('patents', undefined, 'The list did not load.');
  });

  /* THE GROUPING HANDS BACK A SET, NOT A DOM INSTRUCTION. fishbone.mjs asked
     `facets` for the branches the founder picked and this is the answer; the
     list renders it exactly as it renders a sort or a status facet, because it
     IS one. The panel never touches these rows.

     The ordering stands down for the same reason a new search stands it down:
     `Find similar` ordered a set this is no longer. */
  window.addEventListener('terrain:refiltered', e => {
    settled(false, 0);
    render(e.detail);
  });

  onActivate(document, '.set-star', el =>
    toggleStar(el.getAttribute('data-star'), el));

  /* FIND SIMILAR IS THE ONLY FILLED CONTROL ON THIS SURFACE and it sends the
     anchors the founder chose. The response is an ORDER over the same set. */
  onActivate(document, '#setRebase', () => {
    if (!STARRED.size()) return;
    reorderTo(STARRED.ids());
  });

  onActivate(document, '#setRestore', () => {
    settled(false, 0);
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
