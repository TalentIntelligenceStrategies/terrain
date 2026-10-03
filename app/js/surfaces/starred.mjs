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
 * holding. The `export` port exists for the LEDGER (a run costs points) and
 * not for the content.
 */
import { $ } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { say } from '../core/live-region.mjs';
import { statusHTML, statusWord } from '../core/primitives.mjs';
import { esc } from '../core/dom.mjs';
import * as Starred from '../core/starred.mjs';
import { reduced, flip, DUR2 } from '../core/motion.mjs';
import { wait as pause } from '../core/timers.mjs';
/* THE ONE CROSS-SURFACE IMPORT IN THIS FILE, and it is the right direction:
   this surface is what the list's rows leave through. See rowFor()'s note. */
import { rowFor } from './list.mjs';

/* THE COLUMNS ARE DECLARED ONCE and both formats read them, so a spreadsheet
   and a Markdown list cannot drift into carrying different things. The `get`
   is what turns a row into a cell, and it is also where "we decline to print
   this" becomes an empty cell rather than the string "null". */
const COLUMNS = [
  { key: 'number', head: 'Number',  get: r => r.number },
  { key: 'skim',   head: 'Title',   get: r => r.skim },
  { key: 'holder', head: 'Holder',  get: r => r.holder },
  { key: 'where',  head: 'Where',   get: r => r.where },
  /* THE WORD COMES FROM core/primitives.mjs, not from a ternary here. This
     read `live ? Live : expired ? Expired : r.status`, which wrote the raw
     string `abandoned` into a spreadsheet and could never learn a fifth
     value. */
  { key: 'status', head: 'Status',  get: r => statusWord(r.status) || null },
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
  const head = COLUMNS.map(c => q(c.head)).join(',');
  const body = rows.map(r => COLUMNS.map(c => q(cell(c.get(r)))).join(','));
  return [head, ...body].join('\r\n') + '\r\n';
}

/* ── the Markdown list ──────────────────────────────────────────────────────
   A LIST, NOT A TABLE. The founder is pasting this into something they are
   already writing, and an eight-column pipe table is unreadable in a source
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
    if (r.holder != null) bits.push(r.holder);
    if (r.where != null) bits.push(r.where);
    if (r.year != null) bits.push(String(r.year));
    if (statusWord(r.status)) bits.push(statusWord(r.status));
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
   and it is the one fact that makes two exports of the same set distinct. */
function filename(ext) {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `terrain-starred-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.${ext}`;
}

/* ── the surface ──────────────────────────────────────────────────────────── */

let ENGINE = null;

function rowHTML(r, n) {
  /* THE SAME SKELETON RULE AS THE LIST. `null` means render the bar and it is
     the only thing that means that; a collection that printed real names where
     the list it came from prints bars would be two contracts on one value.
     In a table the bar sits inside its own cell, so a withheld value keeps
     the column's edge instead of collapsing it. */
  const cellOr = (v, cls, sk) => v != null
    ? '<td class="' + cls + '">' + esc(String(v)) + '</td>'
    : '<td class="' + cls + '"><span class="sk sk-h-micro ' + sk + '"></span></td>';

  return '<tr class="starrow" data-id="' + esc(r.id) + '">'
    /* THE RANK IS THE FOUNDER'S OWN ORDER WITHIN THIS SEARCH, not a score
       position. It restarts at 1 in each group because the group is what it
       counts through, and #starOrder above says which order that is. */
    + '<td class="star-c-n fig fig-s">' + n + '</td>'
    + cellOr(r.number, 'star-c-num fig fig-s', 'w-sm')
    + cellOr(r.skim, 'star-c-t', 'w-full')
    + cellOr(r.holder, 'star-c-h', 'w-md')
    + cellOr(r.where, 'star-c-w', 'w-sm')
    + '<td class="star-c-st">' + (r.status ? statusHTML(r.status) : '') + '</td>'
    + '<td class="star-c-y fig fig-s">' + (r.year == null ? '' : r.year) + '</td>'
    /* THE SCORE OBEYS THE SAME OMISSION RULE AS THE LIST'S: null means the
       engine returned none, so the cell is empty rather than carrying a
       label over a gap — and the CSV writes an empty cell for the same
       reason. Against corpus/ that is every row. */
    + '<td class="star-c-sc fig fig-s">' + (r.score == null ? '' : r.score.toFixed(4)) + '</td>'
    /* UNSTARRING IS AVAILABLE WHERE THE SET IS READ. A collection you can only
       add to from somewhere else is a collection that only grows. */
    + '<td class="star-c-x">'
    + '<button class="set-ctl set-star" type="button" aria-pressed="true"'
    + ' data-unstar="' + esc(r.id) + '"'
    + ' aria-label="Remove this patent from your starred set">'
    + '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></button></td>'
    + '</tr>';
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

function groupHTML(rows) {
  return groupBySearch(rows).map(([q, rs]) =>
    '<tbody class="star-grp">'
    /* THE FLEX ROW IS A DIV INSIDE THE CELL, NOT THE CELL. A spanning <th>
       in a table-layout:fixed table has no width of its own to resolve
       against — the fixed algorithm sizes columns from the first row and a
       colspan cell is laid out into whatever that came to — so
       `display:flex` on the <th> gave its children a zero basis and the
       heading truncated to one character. Measured: "a folding drone arm…"
       rendered as "a…". A block-level child of the cell measures against the
       cell's resolved width, which is the whole table. */
    + '<tr class="star-grp-head" data-q="' + esc(q) + '"><th scope="colgroup" colspan="9">'
    + '<div class="star-grp-in">'
    + (q
        ? '<span class="star-grp-q">' + esc(q) + '</span>'
        : '<span class="star-grp-q star-grp-none">Starred without a search</span>')
    + '<span class="star-grp-n t-micro"><span class="fig fig-s">' + rs.length + '</span>'
    + (rs.length === 1 ? ' patent' : ' patents') + '</span>'
    + '</div></th></tr>'
    + rs.map((r, i) => rowHTML(r, i + 1)).join('')
    + '</tbody>').join('');
}

function paint(rows) {
  const list = $('#starList'), body = $('#starBody'), empty = $('#starEmpty');
  const count = $('#starCount');
  if (!list || !body || !empty) return;
  const n = rows.length;
  body.hidden = n === 0;
  empty.hidden = n !== 0;
  if (count) {
    count.hidden = n === 0;
    /* the count is a figure — see list.mjs's setTitle */
    count.innerHTML = '<span class="fig fig-s">' + n + '</span>'
      + (n === 1 ? ' patent' : ' patents');
  }
  /* THE HEADER ROW IS MARKUP AND THE BODY IS RENDERED, so the write targets
     the groups rather than the table: innerHTML on #starList would take
     <thead> with it and the columns would lose their names on the first
     star. */
  list.querySelectorAll('tbody').forEach(t => t.remove());
  list.insertAdjacentHTML('beforeend', groupHTML(rows));

  /* A SCROLL PORT HAS TO BE REACHABLE BY KEYBOARD, and only the DOM knows
     whether this one is scrolling. Below 860px the table keeps its columns
     and the wrapper scrolls sideways instead (39-starred.css); a region that
     scrolls but has no tab stop is content a keyboard cannot reach at all,
     and the attribute is wrong to ship unconditionally — a tab stop on an
     element with nothing to scroll is a stop that does nothing.

     Measured after the write, because the answer depends on what was just
     rendered. */
  const wrap = list.parentElement;
  if (wrap) {
    const scrolls = wrap.scrollWidth > wrap.clientWidth;
    if (scrolls) wrap.setAttribute('tabindex', '0');
    else wrap.removeAttribute('tabindex');
  }
}

export function init(ctx) {
  ENGINE = ctx.engine;

  Starred.onChange(paint);

  /* ══ A ROW LEAVES, AND THE ROWS BELOW CLOSE THE GAP · §6 ══════════════
     It used to vanish in the same frame as the press and every row under it
     jumped up one, so the founder lost the row they were about to read next
     and focus fell to <body> with the button that held it. Now the row fades
     out on --dur-2, the set changes, and flip() plays the rows below — and the
     group headings, keyed by their search — up into the space.

     FOCUS GOES TO THE NEXT ROW'S REMOVE BUTTON, or the previous one at the
     end of the table, or the heading once the set is empty: the place a
     founder clearing several rows in a row expects to press next.

     A row already leaving ignores a second press — two presses is one
     intention, and the second would toggle the patent back in. */
  const key = el => el.getAttribute('data-id') || 'q:' + el.getAttribute('data-q');
  onActivate(document, '#starList [data-unstar]', async el => {
    const id = el.getAttribute('data-unstar');
    const row = el.closest('.starrow');
    if (row && row.hasAttribute('data-leaving')) return;
    const rows = [...document.querySelectorAll('#starList .starrow')];
    const at = rows.indexOf(row);
    const near = rows[at + 1] || rows[at - 1];
    const nextId = near && near !== row ? near.getAttribute('data-id') : null;
    if (row && !reduced()) {
      row.setAttribute('data-leaving', '');
      await pause(DUR2);
    }
    const list = $('#starList');
    flip(list, '.starrow, .star-grp-head', key, () => Starred.toggle(id),
      list && list.parentElement);
    const target = (nextId && list
      && list.querySelector('[data-unstar="' + CSS.escape(nextId) + '"]'))
      || $('#starTitle');
    if (target) target.focus({ preventScroll: true });
    say('destination', 'Removed. ' + (Starred.size()
      ? Starred.size() + (Starred.size() === 1 ? ' patent' : ' patents') + ' left.'
      : 'Nothing starred.'));
  });

  const take = (ext, mime, build) => async () => {
    const rows = Starred.list();
    if (!rows.length) return;
    /* THE PORT IS TOLD, AND THE FILE DOES NOT WAIT ON IT. Exporting is a run
       and the ledger has to see it; the bytes are already here. A failed
       ledger call must not cost the founder their download, so the file is
       handed over either way and the balance is only updated if the engine
       answered. */
    /* THE HEADING IS THE SEARCH THAT RAN, NOT THE FIELD'S CONTENTS. This
       read #resQuery directly, which is the sentence CURRENTLY in the box —
       and the founder can edit it without pressing Search, so a file could be
       headed by a query that never ran against the set inside it. The store
       holds the ran query for exactly this reason (core/starred.mjs). */
    build(rows, Starred.search());
    let res = null;
    try { res = await ENGINE.export({ ids: Starred.ids(), format: ext }); } catch (e) { res = null; }
    if (res && res.ok && res.data && res.data.balance != null) {
      const meter = $('#meterN');
      if (meter) meter.textContent = String(res.data.balance);
    }
  };

  onActivate(document, '#starCsv', take('csv', 'text/csv;charset=utf-8',
    (rows) => {
      download(filename('csv'), 'text/csv;charset=utf-8', toCSV(rows));
      say('destination', rows.length + ' patents downloaded as a spreadsheet.');
    }));

  onActivate(document, '#starMd', take('md', 'text/markdown;charset=utf-8',
    (rows, query) => {
      download(filename('md'), 'text/markdown;charset=utf-8', toMarkdown(rows, query));
      say('destination', rows.length + ' patents downloaded as a Markdown list.');
    }));

  /* ── one record, through the same two builders ───────────────────────────
     THE RECORD'S CLOSING BLOCK OFFERS THIS AND THIS FILE ANSWERS IT, because
     COLUMNS is declared here and one record must not grow a third opinion
     about what a row contains. It reads the ROW rather than the record, for
     the reason rowFor() carries.

     THE INVERSION IS THE SET'S. platform.md §7.2: the file is built entirely
     in the client from a row the founder already has, so it is handed over
     first and the ledger is called after — a refused ledger call must not cost
     them their download, because the bytes were never the engine's to
     withhold. */
  onActivate(document, '[data-rec-export]', async el => {
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
    if (ext === 'csv') {
      download(filename('csv'), 'text/csv;charset=utf-8', toCSV([row]));
      say('destination', 'This record downloaded as a spreadsheet.');
    } else {
      download(filename('md'), 'text/markdown;charset=utf-8',
        toMarkdown([row], Starred.search()));
      say('destination', 'This record downloaded as a Markdown list.');
    }
    let res = null;
    try { res = await ENGINE.export({ ids: [id], format: ext }); } catch (e) { res = null; }
    if (res && res.ok && res.data && res.data.balance != null) {
      const meter = $('#meterN');
      if (meter) meter.textContent = String(res.data.balance);
    }
  });
}
