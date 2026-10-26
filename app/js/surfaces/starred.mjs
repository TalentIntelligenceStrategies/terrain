/* surfaces/starred — the founder's shortlist, and the two files it leaves as.
 *
 * ═══ THE EXPORT IS A NARROWED LOCK, NOT A LIFTED ONE ═══════════════════════
 * brief.md §1 declined a downloadable file, and the pivot to search+export
 * replaced that test rather than deleting it. The line is no longer "is there
 * a file" — it is what the file is permitted to SAY. These two carry the
 * fields already on screen and nothing else: no cover page, no summary, no
 * conclusion. The test, stated once so it can be applied to the next format
 * somebody proposes: does the file state anything the interface did not? If it
 * does, Terrain has written a report.
 *
 * That is why there is no PDF here, and why adding one is an argument rather
 * than a feature.
 *
 * ═══ THE FILE IS BUILT HERE, NOT FETCHED ═══════════════════════════════════
 * Every field in it is already in the client — core/starred.mjs holds the rows
 * the port returned. A round trip would add a wait, a failure path and a
 * second place the columns are decided, to produce bytes we are already
 * holding. Nothing about taking the set out reaches the engine at all.
 */
import { $ } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { say } from '../core/live-region.mjs';
import { esc } from '../core/dom.mjs';
import * as Starred from '../core/starred.mjs';
import * as Pro from '../core/pro.mjs';
import { btnDone } from '../core/button-wait.mjs';
/* THE CROSS-SURFACE IMPORTS, and they run the right direction: this surface
   is what the list's rows leave through (rowFor), and it draws them with the
   list's own row (rowHTML) and orders them with the list's own menu. */
import { rowFor, rowHTML, lmMenu, check } from './list.mjs';
import { where, holderText } from '../core/format.mjs';

/* THE COLUMNS ARE DECLARED ONCE and both formats read them, so a spreadsheet
   and a Markdown list cannot drift into carrying different things. The `get`
   is what turns a row into a cell, and it is also where "we decline to print
   this" becomes an empty cell rather than the string "null". */
const COLUMNS = [
  { key: 'number', head: 'Number',  get: r => r.number },
  { key: 'skim',   head: 'Title',   get: r => r.skim },
  { key: 'holder', head: 'Holder',  get: r => holderText(r.holder) },
  { key: 'where',  head: 'Where',   get: r => where(r) },
  { key: 'year',   head: 'Year',    get: r => r.year },
  { key: 'score',  head: 'Score',   get: r => r.score == null ? null : r.score.toFixed(4) },
  /* THE SEARCH IT WAS STARRED UNDER, added 2026-09-26 with the grouping.
     The page now shows which search each patent came from, and a file that
     dropped it would lose the one piece of structure the founder can see on
     screen — brief.md §1's test is about a file saying MORE than the
     interface, never less. It is the founder's own sentence printed back,
     which is the safest thing a file here can carry. */
  { key: 'starredUnder', head: 'Search', get: r => r.starredUnder || null },
];

/* A WITHHELD VALUE IS AN EMPTY CELL. `null` means "this exists and we decline
   to print it" everywhere else in the product, and a spreadsheet has exactly
   one way to say that. Writing "null" into a cell would put a word into the
   founder's data that came from our type system. */
const cell = v => (v == null ? '' : String(v));

/* ── the spreadsheet ────────────────────────────────────────────────────────
   RFC 4180 quoting, and it is not pedantry: a patent title with a comma in it
   is the ordinary case, and a title with a quotation mark in it is not rare.
   Quote every field rather than only the ones that need it — a conditional
   quote is a branch that gets the edge case wrong once and corrupts a column
   silently, which the founder finds out about in their own spreadsheet.

   \r\n because that is what the spec says and what Excel expects. */
function toCSV(rows) {
  const q = s => '"' + String(s).replace(/"/g, '""') + '"';
  /* NO SCORE COLUMN WHEN NO ROW HAS ONE, because the page does not show one
     either and a file may not carry a column its page did not */
  const cols = rows.some(r => r.score != null) ? COLUMNS : COLUMNS.filter(c => c.key !== 'score');
  const head = cols.map(c => q(c.head)).join(',');
  const body = rows.map(r => cols.map(c => q(cell(c.get(r)))).join(','));
  return [head, ...body].join('\r\n') + '\r\n';
}

/* ── the Markdown list ──────────────────────────────────────────────────────
   A LIST, NOT A TABLE. The founder is pasting this into something they are
   already writing, and a seven-column pipe table is unreadable in a source
   file and wraps badly in every editor. One patent per bullet, its number
   bolded because that is the field they will search their own document for.

   THE HEADING IS THE QUERY, NOT A TITLE WE WROTE. "Patents I starred" would be
   Terrain narrating; the sentence the founder typed is theirs.

   AND IT IS GROUPED THE WAY THE PAGE IS · 2026-09-26. The CSV carries the
   search as a column; a Markdown list has no columns, so it carries it as the
   structure — a heading per search, in the same order the page shows them,
   which is also what makes the two files say the same things. A flat list
   would have been the third shape this set is read in, and .star-note
   promises the founder there are two.

   ONE SEARCH, ONE HEADING, AND NO SUBHEADINGS WHEN THERE IS ONLY ONE. A
   founder who has starred from a single search gets what they got before:
   their sentence at the top and a list under it. */
function toMarkdown(rows, query) {
  const lines = [];
  const groups = groupBySearch(rows);
  if (groups.length > 1) {
    lines.push('# Starred patents');
    lines.push('');
    groups.forEach(([q, rs]) => {
      lines.push('## ' + (q || 'Starred without a search'));
      lines.push('');
      bullets(rs, lines);
    });
    return lines.join('\n');
  }
  lines.push('# ' + ((groups.length && groups[0][0]) || query || 'Starred patents'));
  lines.push('');
  bullets(rows, lines);
  return lines.join('\n');
}

function bullets(rows, lines) {
  rows.forEach(r => {
    const bits = [];
    if (r.holder != null) bits.push(holderText(r.holder));
    if (where(r) != null) bits.push(where(r));
    if (r.year != null) bits.push(String(r.year));
    if (r.score != null) bits.push('score ' + r.score.toFixed(4));
    /* THE BULLET LEADS WITH WHATEVER IDENTIFIES THE PATENT. A withheld number
       must not leave `- **** —` in the founder's document, so the title takes
       the bold when there is no number, and a row with neither says so rather
       than rendering an empty bullet nobody can act on. */
    const lead = r.number != null ? '**' + r.number + '**'
               : r.skim   != null ? '**' + r.skim + '**'
               : '*(number withheld)*';
    const tail = r.number != null && r.skim != null ? ' — ' + r.skim : '';
    lines.push('- ' + lead + tail);
    if (bits.length) lines.push('  ' + bits.join(' · '));
  });
  lines.push('');
}

/* ── handing the file over ──────────────────────────────────────────────────
   revokeObjectURL IS NOT OPTIONAL. A blob URL pins its blob in memory for the
   life of the document, so a founder who exports six times has six result sets
   held by nothing but a string. Revoking on the next frame rather than
   immediately, because Safari has not always started the download by the time
   the click handler returns. */
function download(name, mime, text) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  requestAnimationFrame(() => URL.revokeObjectURL(url));
}

/* a filename the founder can find again. The date is the only thing we add,
   and it is the one fact that makes two exports of the same set distinct.
   ONE RECORD IS NAMED FOR ITS PATENT, because a folder of five
   terrain-starred files that each hold one row is five files nobody can tell
   apart. The number is compacted to what a filename can carry. */
function filename(ext, stem = 'starred') {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `terrain-${stem}-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.${ext}`;
}
const patents = n => n + (n === 1 ? ' patent' : ' patents');

/* ── the surface ──────────────────────────────────────────────────────────── */

/* WHAT THE REPORT HOLDS, said plainly. The question is report.mjs's, word for
   word, so the panel and the report it opens ask the same thing. Each item
   names a real section of the report (platform.md §5.3) — the counted ones
   under Ready now, the ones Pro writes under Pro — so the panel promises
   nothing the report does not contain. THE PRO LIST IS THE ENGINE'S: it comes
   with the quote (core/pro.mjs), and is bars until the quote lands. */
const REPORT = {
  ask: 'How close are these patents to the idea, and who holds them?',
  ready: ['The set at a glance, on one page', 'Who holds the patents near the idea',
    'When and where they were filed', 'How many are granted, how many pending', 'Where filings cluster'],
};
let ENGINE = null;
let PRO = null;

/* THE VIEW IS KEPT IN THE BROWSER AS A CONVENIENCE. Losing it costs one press,
   so a storage that throws (Safari private mode) is a default, not an error. */
const VIEW_KEY = 'terrain:starred-view';
let VIEW = 'detail';
try { if (localStorage.getItem(VIEW_KEY) === 'list') VIEW = 'list'; } catch (e) { /* default */ }

/* THE SORT IS A VIEW. null is the order the founder starred in. It applies
   inside each search; the groups keep their order, and the files ignore it. */
let SORT = null;
const SORT_KEYS = {
  filed: r => r.filed || (r.year != null ? String(r.year) : ''),
  holder: r => (r.holder || '').toLowerCase(),
  title: r => (r.skim || '').toLowerCase(),
};
const SORT_SAYS = {
  'filed:-1': 'filing date, newest first', 'filed:1': 'filing date, oldest first',
  'holder:1': 'holder, A to Z', 'title:1': 'title, A to Z',
};
function sorted(rows) {
  if (!SORT) return rows;
  const f = SORT_KEYS[SORT.key], d = SORT.dir;
  /* a missing value sorts last whichever way, so a bar never leads a run */
  return [...rows].sort((a, b) => {
    const x = f(a), y = f(b);
    if (!x !== !y) return x ? -1 : 1;
    return (x > y ? 1 : x < y ? -1 : 0) * d;
  });
}

const STAR_SVG = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
  + ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';
const CHEV_SVG = '<svg class="star-rep-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
  + ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const RUN_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
  + ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>';

/* the day a group was started, as the founder would say it */
const DAY = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

/* ── one search, as a plain heading over its run ── */
/* ONE SEARCH NEEDS NO COUNT UNDER IT: the head chip already says how many,
   so a lone group keeps only Run again. */
function headHTML(q, rs, gi, solo) {
  const at = Math.min(...rs.map(r => r.starredAt || Infinity));
  const bits = solo ? [] : ['<span class="fig fig-s">' + rs.length + '</span> starred'];
  if (!solo && Number.isFinite(at)) bits.push(DAY.format(new Date(at)));
  /* RUN AGAIN IS THE SEARCH THAT RAN, through the composer, as history runs
     one (platform.md §5). Without a stamped search there is nothing to run. */
  const run = q && rs[0].starredSearch
    ? (bits.length ? '<span aria-hidden="true">·</span>' : '') + '<button class="star-run t-label" type="button" data-star-run="' + gi + '">'
      + RUN_SVG + '<span>Run again</span></button>'
    : '';
  return '<div class="star-gh">'
    + (q ? '<h3 class="star-gh-q">“' + esc(q) + '”</h3>'
         : '<h3 class="star-gh-q star-gh-none">Starred without a search</h3>')
    + (bits.length || run ? '<p class="star-gh-meta t-label">' + bits.join(' <span aria-hidden="true">·</span> ') + run + '</p>' : '')
    + '</div>';
}

/* ── the List view's row ── THE SAME SKELETON RULE AS THE LIST: `null` is a
   bar, inside its own cell, so a withheld value keeps the column's edge. */
function tableRowHTML(r, score) {
  const cellOr = (v, cls, sk) => v != null
    ? '<td class="' + cls + '">' + esc(String(v)) + '</td>'
    : '<td class="' + cls + '"><span class="sk sk-h-micro ' + sk + '"></span></td>';
  return '<tr class="starrow" data-id="' + esc(r.id) + '">'
    + cellOr(r.number, 'star-c-num fig fig-s', 'w-sm')
    + '<td class="star-c-t">' + (r.skim != null
        ? '<button class="star-open" type="button" data-pn="' + esc(r.id) + '"'
          + ' aria-label="' + esc(r.skim) + '. Open the record.">' + esc(r.skim) + '</button>'
        : '<button class="star-open" type="button" data-pn="' + esc(r.id) + '" aria-label="Open the record">'
          + '<span class="sk sk-h-micro w-full"></span></button>') + '</td>'
    + cellOr(holderText(r.holder), 'star-c-h', 'w-md')
    + cellOr(where(r), 'star-c-w', 'w-sm')
    + '<td class="star-c-y fig fig-s">' + (r.year == null ? '' : r.year) + '</td>'
    /* THE SCORE OBEYS THE LIST'S OMISSION RULE: null is an empty cell */
    + (score ? '<td class="star-c-sc fig fig-s">' + (r.score == null ? '' : r.score.toFixed(4)) + '</td>' : '')
    /* UNSTARRING IS THE LIST'S OWN STAR, data-star and all, so one handler
       (list.mjs) takes a patent out wherever it is pressed and the undo below
       hears every removal the same way. */
    + '<td class="star-c-x"><button class="set-ctl set-star" type="button" aria-pressed="true"'
    + ' data-star="' + esc(r.id) + '" aria-label="Remove this patent from your starred set">'
    + STAR_SVG + '</button></td>'
    + '</tr>';
}

function detailHTML(groups) {
  return groups.map(([q, rs], gi) =>
    '<section class="star-grp" data-q="' + esc(q) + '">'
    + headHTML(q, rs, gi, groups.length === 1)
    + '<div class="set-list star-cards">'
    + sorted(rs).map((r, i) => rowHTML(r, i, { starred: true })).join('')
    + '</div></section>').join('');
}

/* A COLUMN EVERY ROW LEAVES EMPTY IS NOT DRAWN. The corpus returns no score,
   and a Score header over blank cells reads as a value withheld. */
function listHTML(groups) {
  const score = groups.some(([, rs]) => rs.some(r => r.score != null));
  return '<div class="star-tblwrap"><table class="star-tbl">'
    + '<caption class="sr-only">Your starred patents, grouped by search</caption>'
    + '<thead><tr>'
    + '<th scope="col" class="t-micro star-c-num">Number</th>'
    + '<th scope="col" class="t-micro star-c-t">Title</th>'
    + '<th scope="col" class="t-micro star-c-h">Holder</th>'
    + '<th scope="col" class="t-micro star-c-w">Where</th>'
    + '<th scope="col" class="t-micro star-c-y">Year</th>'
    + (score ? '<th scope="col" class="t-micro star-c-sc">Score</th>' : '')
    + '<th scope="col" class="star-c-x"><span class="sr-only">Remove</span></th>'
    + '</tr></thead>'
    /* THE FLEX HEADING IS A DIV INSIDE THE CELL, NOT THE CELL: a spanning
       <th> in a fixed-layout table gives a flex child a zero basis. */
    + groups.map(([q, rs], gi) => '<tbody class="star-grp-rows">'
      + '<tr class="star-grp-head"><th scope="colgroup" colspan="' + (score ? 7 : 6) + '">' + headHTML(q, rs, gi, groups.length === 1) + '</th></tr>'
      + sorted(rs).map(r => tableRowHTML(r, score)).join('') + '</tbody>').join('')
    + '</table></div>';
}

/* the report panel's words */
function paintReport() {
  const says = $('#starRepSays');
  if (!says) return;
  const items = xs => '<ul class="star-bul">' + xs.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  const bars = '<ul class="star-bul">' + [64, 52, 58].map(w => '<li><span class="sk sk-h-label" style="width:' + w + '%"></span></li>').join('') + '</ul>';
  /* STACKED, THE LISTS FOLD. Above the set on a narrow screen they would push
     the shortlist below the fold, so the question and the button stay and
     the lists wait behind a toggle; wide, the toggle is not drawn. */
  says.innerHTML = '<p class="t-title star-rep-q">' + esc(REPORT.ask) + '</p>'
    + '<button class="star-run star-rep-tog t-label" id="starRepTog" type="button" aria-expanded="false" aria-controls="starRepLists">'
    + '<span>What’s in the report</span>' + CHEV_SVG + '</button>'
    + '<div class="star-rep-lists" id="starRepLists">'
    + '<div class="star-rg"><p class="star-rg-h t-micro">Ready now</p>' + items(REPORT.ready) + '</div>'
    + '<div class="star-rg"><p class="star-rg-h"><span class="pro-label">Pro</span>'
    + '<span class="t-micro">About 10 minutes</span></p>' + (PRO ? items(PRO) : bars) + '</div></div>';
}

/* the Pro list, asked once per starred set; an empty set asks nothing */
async function quotePro() {
  const rows = Starred.list();
  if (!ENGINE || !rows.length) return;
  const res = await Pro.quote(ENGINE, rows);
  const next = res.ok ? res.data.sections.map(x => x.title) : null;
  if (JSON.stringify(next) === JSON.stringify(PRO)) return;
  PRO = next;
  const open = $('#starRepTog')?.getAttribute('aria-expanded');
  paintReport();
  if (open) $('#starRepTog')?.setAttribute('aria-expanded', open);
}

function paintTools() {
  document.querySelectorAll('[data-star-view]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.getAttribute('data-star-view') === VIEW)));
  const key = SORT ? SORT.key + ':' + SORT.dir : '';
  const menu = $('#starSortMenu');
  const item = menu && menu.querySelector('[data-star-sort="' + key + '"]');
  if (item) check(menu, item);
  const label = $('#starSortLabel');
  if (label && item) label.textContent = item.textContent.trim();
  const note = $('#starSortNote'), says = $('#starSortSays');
  if (note) note.hidden = !SORT;
  if (says && SORT) says.textContent = 'Sorted by ' + SORT_SAYS[key]
    + ' within each search. Files keep the order you starred in.';
}

/* WHICH PATENT THE RECORD HAS OPEN, read off the marks record.mjs writes, so
   a repaint can put them back on the new rows. */
const openId = () => {
  const row = document.querySelector('#starList .set-row[data-open], #starList .starrow[data-open]');
  return row ? row.getAttribute('data-id') : null;
};
const openers = () => [...document.querySelectorAll('#starList .drill-toggle, #starList .star-open')];

function paint(rows) {
  const list = $('#starList'), body = $('#starBody'), empty = $('#starEmpty');
  const count = $('#starCount');
  if (!list || !body || !empty) return;
  const n = rows.length;
  body.hidden = n === 0;
  empty.hidden = n !== 0;
  const groups = groupBySearch(rows);
  if (count) {
    count.hidden = n === 0;
    count.innerHTML = '<span class="fig fig-s">' + n + '</span>' + (n === 1 ? ' patent' : ' patents')
      + ' · <span class="fig fig-s">' + groups.length + '</span>'
      + (groups.length === 1 ? ' search' : ' searches');
  }
  const was = openId();
  list.innerHTML = n ? (VIEW === 'list' ? listHTML(groups) : detailHTML(groups)) : '';
  /* THE OPEN MARK SURVIVES THE REPAINT, so the row being read stays marked */
  if (was) {
    openers().forEach(b => {
      const on = b.getAttribute('data-pn') === was;
      b.setAttribute('aria-current', String(on));
      const row = b.closest('.set-row, .starrow');
      if (row) row.toggleAttribute('data-open', on);
    });
  }
  /* THE NOTE NAMES WHAT THE SCREEN SHOWS, so a score nobody returned is not
     promised under the buttons. */
  const noteScore = $('#starNoteScore');
  if (noteScore) noteScore.hidden = !rows.some(r => r.score != null);
  /* A SCROLL PORT HAS TO BE REACHABLE BY KEYBOARD, and only the DOM knows
     whether the table is scrolling at this width. */
  const wrap = list.querySelector('.star-tblwrap');
  if (wrap) {
    if (wrap.scrollWidth > wrap.clientWidth) wrap.setAttribute('tabindex', '0');
    else wrap.removeAttribute('tabindex');
  }
  paintTools();
}

/* ── removed, and the way back ─────────────────────────────────────────────
   EVERY REMOVAL IS HEARD HERE, whichever star was pressed — a card's, a
   table row's or the open record's — because they all go through the store.
   The toast says which patent left and offers Undo for six seconds; undo puts
   it back where it was in the starred order. */
let TOAST_T = 0;
function toast(row, at) {
  const t = $('#starToast');
  if (!t) return;
  clearTimeout(TOAST_T);
  t.innerHTML = '<span>Removed <span class="fig fig-s">' + esc(row.number || row.skim || 'a patent')
    + '</span> from your starred set</span>'
    + '<button class="star-undo" type="button" data-star-undo>Undo</button>';
  t.hidden = false;
  void t.offsetWidth;
  t.setAttribute('data-in', '');
  UNDO = { row, at };
  TOAST_T = setTimeout(hideToast, 6000);
}
let UNDO = null;
function hideToast() {
  const t = $('#starToast');
  UNDO = null;
  if (!t) return;
  t.removeAttribute('data-in');
  setTimeout(() => { if (!t.hasAttribute('data-in')) t.hidden = true; }, 220);
}

let PREV = [];
function onSet(rows) {
  const ids = new Set(rows.map(r => r.id));
  const gone = PREV.filter(r => !ids.has(r.id));
  /* WHAT THE DOM SAID BEFORE THE REPAINT: the open patent, and its
     neighbours in the order on screen, so the drawer can move to the next. */
  const was = openId(), order = openers().map(b => b.getAttribute('data-pn'));
  const hadFocus = document.activeElement && document.activeElement.closest('#starList');
  paint(rows);
  if (gone.length === 1) {
    const row = gone[0];
    /* THE TOAST IS THIS SURFACE'S: a star cleared on the results is not news
       to bring along to the next page. */
    if (document.querySelector('.view-starred.is-active')) toast(row, PREV.findIndex(r => r.id === row.id));
    const i = order.indexOf(row.id);
    const next = order.slice(i + 1).find(id => ids.has(id)) || order.slice(0, i).reverse().find(id => ids.has(id));
    const nextBtn = next && document.querySelector('#starList [data-pn="' + CSS.escape(next) + '"]');
    /* THE DRAWER MOVES ON when the patent it was showing is the one removed,
       or closes when there is nothing left to show. */
    if (was === row.id) {
      if (nextBtn) nextBtn.click();
      else { const x = $('#recClose'); if (x) x.click(); }
    } else if (hadFocus && !document.activeElement.closest('#starList')) {
      /* FOCUS GOES TO THE NEXT PATENT, not to <body> with the button that
         held it — the place a founder clearing several expects to press. */
      (nextBtn || $('#starTitle')).focus({ preventScroll: true });
    }
  }
  PREV = rows;
}

/* ══ ONE GROUP PER SEARCH · platform.md §5.2 ═══════════════════════════════
   THE SET IS ONE THING WITH AN INTERNAL ORDER, so this is one <table> with a
   <tbody> per search rather than a table each: separate tables would say the
   groups are unrelated sets and would give each its own column widths, which
   is the opposite of the alignment the table was built for.

   MOST RECENT SEARCH FIRST, and the rows inside it oldest first. The set's
   own order is insertion — core/starred.mjs is a Map for exactly that — so
   reversing the GROUPS while keeping the rows in sequence is what puts the
   work the founder is doing now at the top without reordering the work
   itself. Ties are impossible: a group's position is its first star.

   A ROW STARRED BEFORE THE STORE KNEW ABOUT SEARCHES cannot happen — the
   version bump dropped those — but a row starred before any search ran can,
   through a link straight to a record. Those group under one heading that
   says so rather than under an empty sentence pretending to be a query. */
/* ONE GROUPING, READ BY THE PAGE AND BY THE MARKDOWN. Two implementations of
   "most recent search first" is two chances for the file and the screen to
   disagree about the order of the founder's own work — the same argument
   COLUMNS makes about the fields. */
function groupBySearch(rows) {
  const groups = new Map();
  rows.forEach(r => {
    const k = r.starredUnder || '';
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
  });
  return [...groups.entries()].reverse();
}

export function init(ctx) {
  ENGINE = ctx.engine;
  Starred.onChange(onSet);
  Starred.onChange(quotePro);
  paintReport();
  quotePro();
  lmMenu('starSortWrap', 'starSortBtn', 'starSortMenu');

  onActivate(document, '[data-star-view]', el => {
    VIEW = el.getAttribute('data-star-view') === 'list' ? 'list' : 'detail';
    try { localStorage.setItem(VIEW_KEY, VIEW); } catch (e) { /* a convenience */ }
    paint(Starred.list());
    say('destination', VIEW === 'list' ? 'Showing a table.' : 'Showing each patent in detail.');
  });

  onActivate(document, '[data-star-sort]', el => {
    const v = el.getAttribute('data-star-sort');
    const [key, dir] = v.split(':');
    SORT = key ? { key, dir: Number(dir) || 1 } : null;
    paint(Starred.list());
    say('destination', SORT ? 'Sorted by ' + SORT_SAYS[v] + '.' : 'Back in the order you starred them.');
    if (!key) { const b = $('#starSortBtn'); if (b) b.focus({ preventScroll: true }); }
  });

  onActivate(document, '#starRepTog', el => {
    const open = el.getAttribute('aria-expanded') !== 'true';
    el.setAttribute('aria-expanded', String(open));
    $('#starRepLists')?.toggleAttribute('data-open', open);
  });

  onActivate(document, '[data-star-run]', el => {
    const groups = groupBySearch(Starred.list());
    const g = groups[Number(el.getAttribute('data-star-run'))];
    const s = g && g[1][0] && g[1][0].starredSearch;
    if (!s) return;
    window.dispatchEvent(new CustomEvent('terrain:rerun',
      { detail: { query: s.query, field: s.field, settings: s.settings, mode: s.mode } }));
  });

  onActivate(document, '[data-star-undo]', () => {
    if (!UNDO) return;
    const { row, at } = UNDO;
    hideToast();
    Starred.restore(row, at);
    const back = document.querySelector('#starList [data-pn="' + CSS.escape(row.id) + '"]');
    if (back) back.focus({ preventScroll: true });
    say('destination', 'Put back.');
  });

  const take = (ext, mime, build) => () => {
    const rows = Starred.list();
    if (!rows.length) return;
    /* THE HEADING IS THE SEARCH THAT RAN, NOT THE FIELD'S CONTENTS. This
       read #resQuery directly, which is the sentence CURRENTLY in the box —
       and the founder can edit it without pressing Search, so a file could be
       headed by a query that never ran against the set inside it. The store
       holds the ran query for exactly this reason (core/starred.mjs). */
    build(rows, Starred.search());
  };

  onActivate(document, '#starCsv', take('csv', 'text/csv;charset=utf-8',
    (rows) => {
      download(filename('csv'), 'text/csv;charset=utf-8', toCSV(rows));
      btnDone($('#starCsv'), 'Downloaded');
      say('destination', patents(rows.length) + ' downloaded as a CSV file.');
    }));

  onActivate(document, '#starMd', take('md', 'text/markdown;charset=utf-8',
    (rows, query) => {
      download(filename('md'), 'text/markdown;charset=utf-8', toMarkdown(rows, query));
      btnDone($('#starMd'), 'Downloaded');
      say('destination', patents(rows.length) + ' downloaded as a Markdown list.');
    }));

  /* ── one record, through the same two builders ───────────────────────────
     THE RECORD'S CLOSING BLOCK OFFERS THIS AND THIS FILE ANSWERS IT, because
     COLUMNS is declared here and one record must not grow a third opinion
     about what a row contains. It reads the ROW rather than the record, for
     the reason rowFor() carries. */
  onActivate(document, '[data-rec-export]', el => {
    const end = el.closest('.rec-end');
    const id = end && end.getAttribute('data-pn');
    const base = id && rowFor(id);
    if (!base) return;
    /* A RECORD EXPORTED WITHOUT BEING STARRED HAS NO STAMP, because only
       toggle() writes one. The Search column would be an empty cell for a
       file the founder is downloading from inside the very search that found
       it — so the running search fills it here, and a row that IS starred
       keeps the search it was starred under rather than the current one. */
    const row = Starred.has(base.id)
      ? { ...base, ...(Starred.list().find(r => r.id === base.id) || {}) }
      : { ...base, starredUnder: Starred.search() };
    const ext = el.getAttribute('data-rec-export');
    /* the menu item closes with its menu, so the confirmation goes on the
       trigger the founder can still see. */
    btnDone($('#recExpBtn'), 'Downloaded');
    /* THE CONFIRMATION NAMES THE FILE (R1-28): an export that may or may
       not have happened is one the founder repeats, and the name is what
       they look for in their downloads. */
    const stem = String(row.number || row.id).replace(/[^A-Za-z0-9]+/g, '');
    const name = filename(ext === 'csv' ? 'csv' : 'md', stem);
    if (ext === 'csv') {
      download(name, 'text/csv;charset=utf-8', toCSV([row]));
    } else {
      download(name, 'text/markdown;charset=utf-8', toMarkdown([row], Starred.search()));
    }
    say('destination', 'Downloaded ' + name + '.');
  });
}
