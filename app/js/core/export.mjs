/* core/export — a set of rows, or one record, leaving as a file.
 *
 * THE COLUMNS ARE DECLARED ONCE and both formats read them, so a spreadsheet
 * and a Markdown list cannot drift into carrying different things. `get` turns
 * a row into a cell, and it is also where "we decline to print this" becomes an
 * empty cell rather than the string "null".
 *
 * A FILE STATES NOTHING ITS PAGE DID NOT (brief.md §1). Every column is a field
 * the row prints, or the search the founder typed. There is no Score column
 * when no row carries a score, because the page shows no chip either.
 *
 * THERE IS NO EXPORT PORT. Every value here is already in the client.
 */
import { holderText, where } from './format.mjs';

const COLUMNS = [
  { key: 'rank',      head: 'Rank',      get: r => r.rank },
  { key: 'number',    head: 'Number',    get: r => r.number },
  { key: 'title',     head: 'Title',     get: r => r.skim ?? r.title },
  { key: 'holder',    head: 'Holder',    get: r => r.holder == null ? null : holderText(r.holder) },
  { key: 'inventors', head: 'Inventors', get: r => Array.isArray(r.inventors) ? r.inventors.join('; ') : null },
  { key: 'where',     head: 'Where',     get: r => where(r) },
  { key: 'published', head: 'Published', get: r => r.published },
  { key: 'class',     head: 'Class',     get: r => r.ipcMain },
  { key: 'score',     head: 'Relevance score', get: r => r.score == null ? null : Number(r.score).toFixed(4) },
  { key: 'url',       head: 'Source',    get: r => r.url },
];

const cell = v => (v == null ? '' : String(v));
const colsFor = rows => COLUMNS.filter(c =>
  (c.key !== 'score' || rows.some(r => r.score != null)) &&
  (c.key !== 'rank' || rows.some(r => r.rank != null)));

export function toCSV(rows) {
  const q = s => '"' + String(s).replace(/"/g, '""') + '"';
  const cols = colsFor(rows);
  const head = cols.map(c => q(c.head)).join(',');
  const body = rows.map(r => cols.map(c => q(cell(c.get(r)))).join(','));
  return [head, ...body].join('\r\n') + '\r\n';
}

/* A LIST, NOT A TABLE. The founder is pasting this into something they are
   already writing; one patent per bullet, its number bolded. THE HEADING IS
   THE QUERY, the founder's own sentence printed back. */
export function toMarkdown(rows, query) {
  const lines = [];
  lines.push('# ' + (query ? String(query).replace(/\s+/g, ' ').trim() : 'Patents'));
  lines.push('');
  const cols = colsFor(rows).filter(c => !['rank', 'number', 'title'].includes(c.key));
  rows.forEach(r => {
    const title = cell(r.skim ?? r.title) || 'Untitled';
    lines.push(`- **${cell(r.number) || r.id}** ${title}`);
    cols.forEach(c => {
      const v = cell(c.get(r));
      if (v) lines.push(`  - ${c.head}: ${v}`);
    });
  });
  return lines.join('\n') + '\n';
}

export function download(name, mime, text) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  requestAnimationFrame(() => URL.revokeObjectURL(url));
}

/* a filename the founder can find again; the date is the one fact we add */
export function filename(ext, stem = 'results') {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `terrain-${stem}-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.${ext}`;
}

/** rows out as `ext` ('csv' | 'md'); returns the file's name */
export function save(rows, ext, { query = '', stem = 'results' } = {}) {
  const name = filename(ext === 'csv' ? 'csv' : 'md', stem);
  if (ext === 'csv') download(name, 'text/csv;charset=utf-8', toCSV(rows));
  else download(name, 'text/markdown;charset=utf-8', toMarkdown(rows, query));
  return name;
}
