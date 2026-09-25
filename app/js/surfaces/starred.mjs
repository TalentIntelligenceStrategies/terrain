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
   already writing, and a seven-column pipe table is unreadable in a source
   file and wraps badly in every editor. One patent per bullet, its number
   bolded because that is the field they will search their own document for.

   THE HEADING IS THE QUERY, NOT A TITLE WE WROTE. "Patents I starred" would be
   Terrain narrating; the sentence the founder typed is theirs. */
function toMarkdown(rows, query) {
  const lines = [];
  lines.push('# ' + (query || 'Starred patents'));
  lines.push('');
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
  return lines.join('\n');
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

function rowHTML(r) {
  /* THE SAME SKELETON RULE AS THE LIST. `null` means render the bar and it is
     the only thing that means that; a collection that printed real names where
     the list it came from prints bars would be two contracts on one value. */
  const title = r.skim != null
    ? '<span class="starrow-name">' + esc(r.skim) + '</span>'
    : '<span class="sk sk-h-body w-full"></span>';
  const holder = r.holder != null
    ? '<span class="starrow-holder">' + esc(r.holder) + '</span>'
    : '<span class="sk sk-h-micro w-md"></span>';
  return '<li class="starrow" data-id="' + esc(r.id) + '">'
    + '<div class="starrow-main">'
    + (r.number != null
        ? '<span class="fig fig-s starrow-id">' + esc(r.number) + '</span>'
        : '<span class="sk sk-h-micro w-sm"></span>')
    + title
    + '</div>'
    /* EVERY COLUMN THE FILE CARRIES IS ON THE ROW, and that is a correctness
       rule rather than a completeness one. .star-note tells the founder the
       files carry "the same fields as the rows above" and then names seven;
       the row drew five. `where` and `score` left in the file without ever
       appearing on screen, which is the one thing brief.md §1's test is about
       — a file that states something the interface did not. Either the row
       shows them or the file stops carrying them, and the row is the cheaper
       half of that pair to fix.

       THE SCORE OBEYS THE SAME OMISSION RULE AS THE LIST'S. null means the
       engine returned none, so the whole block goes rather than printing a
       label over a gap — and the CSV writes an empty cell for the same
       reason. Against corpus/ that is every row. */
    + '<div class="starrow-meta">'
    + (r.status ? statusHTML(r.status) : '')
    + holder
    + (r.where != null ? '<span class="starrow-where">' + esc(r.where) + '</span>' : '')
    + '<span class="fig fig-s">' + (r.year == null ? '' : r.year) + '</span>'
    + (r.score == null ? ''
       : '<span class="starrow-score">'
         + '<span class="t-micro starrow-score-k">Score</span>'
         + '<span class="fig fig-s">' + r.score.toFixed(4) + '</span></span>')
    + '</div>'
    /* UNSTARRING IS AVAILABLE WHERE THE SET IS READ. A collection you can only
       add to from somewhere else is a collection that only grows. */
    + '<button class="set-ctl set-star" type="button" aria-pressed="true"'
    + ' data-unstar="' + esc(r.id) + '"'
    + ' aria-label="Remove this patent from your starred set">'
    + '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.33l-5.81 3.05'
    + ' 1.11-6.47-4.7-4.58 6.5-.95z"/></svg></button>'
    + '</li>';
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
    count.textContent = n + (n === 1 ? ' patent' : ' patents');
  }
  list.innerHTML = rows.map(rowHTML).join('');
}

export function init(ctx) {
  ENGINE = ctx.engine;

  Starred.onChange(paint);

  onActivate(document, '#starList [data-unstar]', el => {
    const id = el.getAttribute('data-unstar');
    Starred.toggle(id);
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
    const q = $('#resQuery');
    build(rows, q && q.value.trim());
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
    const row = id && rowFor(id);
    if (!row) return;
    const ext = el.getAttribute('data-rec-export');
    const q = $('#resQuery');
    if (ext === 'csv') {
      download(filename('csv'), 'text/csv;charset=utf-8', toCSV([row]));
      say('destination', 'This record downloaded as a spreadsheet.');
    } else {
      download(filename('md'), 'text/markdown;charset=utf-8',
        toMarkdown([row], q && q.value.trim()));
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
