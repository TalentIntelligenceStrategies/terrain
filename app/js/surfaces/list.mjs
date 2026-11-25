/* surfaces/list — the results, from the V8 lab.
 *
 * EVERY ROW THE SEARCH RETURNED, AT ONCE. There is no paging: the set is at
 * most `settings.count` rows (200), and the list sorts, groups and exports
 * what it holds.
 *
 * THE RANK TRAVELS WITH THE ROW. It is the row's place in the search's own
 * order — the engine's relevance order — so re-sorting by date or by similarity
 * moves the card and keeps its number. The score beside it is the engine's
 * relevance score, printed as the engine returned it.
 *
 * GROUP BY TOPIC IS A VIEW OF THE ROWS. The topics are the rows' own CPC
 * subclasses, named in CPC's words, and every count can be checked against the
 * list: pick one and the list shows exactly that many.
 *
 * Opening a row is an event (terrain:open), so the record pane owns the record
 * and this module never imports it.
 */
import { $, $$, esc } from '../core/dom.mjs';
import * as Url from '../core/url.mjs';
import * as Pop from '../core/pop.mjs';
import * as Export from '../core/export.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { say } from '../core/live-region.mjs';
import { toast } from '../core/toast.mjs';
import { holderText } from '../core/format.mjs';

let ENGINE = null;
let BYID = new Map();
let BASE = [];          // the search's order: the rank
let VIEW = [];          // what the list is in now: sorted, or by similarity
let topic = '';
let sortBy = 'relevance';
let anchor = null;      // the record Find similar ordered by
let query = '';
let openId = null;

const I = (p, c = 'i') => `<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const EXT = '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>';
const X = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
const TICK = '<path d="M20 6 9 17l-5-5"/>';
const BAR = w => `<span class="sk sk-h-body ${w}" aria-hidden="true"></span>`;

/* ── formatting, shared with the record ──────────────────────────────────── */
/** "US12107086B2" → ["US", "12107086", "B2"] */
export const parts = n => String(n || '').replace(/\s+/g, '').match(/^([A-Z]{2})(\d+)([A-Z]\d?)$/)?.slice(1) || null;
/** the number as it reads on the patent, with its spaces */
export const numberText = (n, withKind = true) => {
  const p = parts(n);
  if (!p) return n || '';
  return withKind ? `${p[0]} ${p[1]} ${p[2]}` : `${p[0]} ${p[1]}`;
};
/** one class format on every surface: subclass, a space, the group */
export const cls = c => c ? String(c).replace(/\s+/g, '').replace(/^([A-Z]\d\d[A-Z])/, '$1 ') : '';
/** CPC's words in sentence case; a token with a digit is a class code and keeps its case */
export const sentence = w => w ? String(w).split(';')[0].trim().split(' ').map((t, k) => /\d/.test(t) ? t : k ? t.toLowerCase() : t.charAt(0) + t.slice(1).toLowerCase()).join(' ') : '';
/** "Invention · Grant": the kind and the document, without saying either twice */
export const kindLine = r => {
  const doc = r.version === 'application' ? 'Application' : r.version === 'grant' ? 'Grant' : null;
  return [r.kind, doc].filter((x, k, a) => x && a.indexOf(x) === k).join(' · ');
};
const subclass = r => (r.ipcMain || '').replace(/\s+/g, '').slice(0, 4);

/* ── what the record and the export read ─────────────────────────────────── */
export const rowById = id => BYID.get(id) || null;
export const rankOf = id => { const i = BASE.indexOf(id); return i < 0 ? null : i + 1; };
export const lastQuery = () => query;
/** the ids the list shows, in the order it shows them */
export function shown() { return VIEW.filter(id => !topic || subclass(BYID.get(id)) === topic); }
/** the id `d` places away from `id` in what the list shows */
export function neighbour(id, d) {
  const ids = shown(), k = ids.indexOf(id);
  if (k < 0) return null;
  return ids[k + d] || null;
}

/* ── rows ───────────────────────────────────────────────────────────────── */
function rowHTML(r) {
  const p = parts(r.number);
  const num = p ? `${p[0]} ${p[1]}` : r.number;
  const inv = Array.isArray(r.inventors) ? r.inventors : null;
  const thumbs = (r.thumbs || []).slice(0, 8);
  const total = r.figs ?? (r.thumbs || []).length;
  const figs = thumbs.map(f =>
    `<button class="tile" type="button" data-n="${esc(f.n)}" aria-label="Open drawing ${esc(f.n)} of ${esc(total)}">`
    + (f.src ? `<img alt="" loading="lazy" src="${esc(f.src)}">` : '<span class="sk-fig" aria-hidden="true"></span>')
    + `<span class="n">${esc(f.n)}</span></button>`).join('');
  const rank = rankOf(r.id);
  const sc = r.score == null ? null : Number(r.score).toFixed(4);
  const ident = `<span class="num mono">${num == null ? BAR('w-md') : esc(num)}</span><span>${esc(kindLine(r))}</span>`
    + (r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener" aria-label="Open ${esc(num || 'this patent')} on Google Patents" title="Open on Google Patents">${I(EXT)}</a>` : '');
  const chips = `<span class="chips-r">`
    + (rank ? `<span class="chip-r" aria-label="Rank ${rank}">#${rank}</span>` : '')
    + (sc ? `<span class="chip-r score" aria-label="Relevance score ${sc}"><span class="l" aria-hidden="true">Relevance score</span><span aria-hidden="true">${sc}</span></span>` : '')
    + `</span>`;
  const holder = r.holder == null ? BAR('w-lg') : esc(holderText(r.holder));
  const title = r.skim == null ? BAR('w-xl') : esc(r.skim);
  return `<article class="row" role="listitem" tabindex="0" data-id="${esc(r.id)}" aria-label="${esc(r.skim || num || 'Patent')}">
    <div class="row-top">${ident}${chips}</div>
    <h3${r.skim ? ` title="${esc(r.skim)}"` : ''}>${title}</h3>
    <dl class="facts">
      <div class="holder"><dt class="flabel">Holder</dt><dd>${holder}</dd></div>
      ${inv && inv.length ? `<div><dt class="flabel">Inventors</dt><dd>${esc(inv[0])}${inv.length > 1 ? ` <span class="more tnum">+${inv.length - 1}</span>` : ''}</dd></div>` : ''}
      ${r.published ? `<div><dt class="flabel">Published</dt><dd class="mono">${esc(r.published)}</dd></div>` : ''}
      ${r.ipcMain ? `<div><dt class="flabel">Class</dt><dd class="mono">${esc(cls(r.ipcMain))}</dd></div>` : ''}
    </dl>
    ${r.abstract ? `<p class="abs">${esc(r.abstract)}</p>` : ''}
    ${figs ? `<div class="strip">${figs}</div>` : ''}
  </article>`;
}

function tipText() {
  const n = BASE.length, s = shown().length;
  const how = anchor ? `Ordered by similarity to ${numberText(rowById(anchor)?.number) || 'the open patent'}, most similar first.`
    : sortBy === 'newest' ? 'Ordered by published date, newest first.'
    : sortBy === 'oldest' ? 'Ordered by published date, oldest first.'
    : 'Ordered by the engine’s relevance score, nearest to your description first.';
  const count = topic ? `<span class="tnum">${s}</span> of <span class="tnum">${n}</span> shown in ${esc(topic)}.`
    : `<span class="tnum">${n}</span> matched, all <span class="tnum">${n}</span> shown.`;
  return `${how} ${count}`;
}

function filterbar() {
  const bar = $('#filterbar');
  const bits = [];
  if (topic) bits.push(`Topic <span class="tag"><span class="mono">${esc(topic)}</span><button class="ib" type="button" data-clear="topic" aria-label="Clear the topic" title="Clear the topic">${I(X)}</button></span><span class="n">${shown().length} of ${BASE.length}</span>`);
  if (anchor) bits.push(`Similar to <span class="tag"><span class="mono">${esc(numberText(rowById(anchor)?.number) || anchor)}</span><button class="ib" type="button" data-clear="similar" aria-label="Restore the relevance order" title="Restore">${I(X)}</button></span>`);
  bar.innerHTML = bits.join('<span aria-hidden="true">·</span>');
  bar.hidden = !bits.length;
}

function render() {
  const host = $('#rows');
  const ids = shown();
  landIn(host, ids.length ? ids.map(id => rowHTML(BYID.get(id))).join('')
    : `<p class="none">${BASE.length ? 'No results in this topic.' : 'No patents matched this search. Try describing it another way, or widen the search settings.'}</p>`);
  $('#infoTip').innerHTML = tipText();
  filterbar();
  mark();
}

/** the open row takes the ink edge; nothing else does */
export function mark(id = openId) {
  openId = id;
  $$('#rows .row').forEach(r => {
    if (r.dataset.id === openId) r.setAttribute('aria-current', 'true'); else r.removeAttribute('aria-current');
  });
}
export function scrollToOpen() { $('#rows .row[aria-current="true"]')?.scrollIntoView({ block: 'nearest' }); }

/* ── sort, similar, topic ───────────────────────────────────────────────── */
async function sort(by) {
  sortBy = by;
  anchor = null;
  $$('#sortPop [data-sort]').forEach(x => x.setAttribute('aria-checked', String(x.dataset.sort === by)));
  const label = $(`#sortPop [data-sort="${by}"]`)?.textContent.trim() || 'Relevance';
  $('#sortLbl').textContent = label;
  $('#sortBtn').setAttribute('aria-label', 'Sort: ' + label);
  if (by === 'relevance') { VIEW = BASE.slice(); render(); return; }
  const res = await ENGINE.sort({ sort: by });
  if (!res.ok) { toast('The list could not be re-ordered. Try again.'); return; }
  VIEW = (res.data.order || []).filter(id => BYID.has(id));
  render();
  say('list', `Sorted: ${label}.`);
}

/** Find similar: the same set, most similar to `id` first. Returns whether it ran.
 *
 * THE SORT STILL READS RELEVANCE. The order is still the engine's, and the
 * score on every row is still the engine's relevance score; what changed is
 * the anchor, and the tag above the list says that ("Similar to ...", with
 * Restore beside it). Choosing Relevance from the menu is Restore. */
export async function similar(id) {
  const res = await ENGINE.similar({ anchor: id });
  if (!res.ok) { toast('The list could not be re-ordered. Try again.'); return false; }
  anchor = id;
  sortBy = 'relevance';
  topic = '';
  $$('#sortPop [data-sort]').forEach(x => x.setAttribute('aria-checked', String(x.dataset.sort === 'relevance')));
  $('#sortLbl').textContent = 'Relevance';
  $('#sortBtn').setAttribute('aria-label', 'Sort: Relevance');
  VIEW = (res.data.order || []).filter(id2 => BYID.has(id2));
  render();
  $('#listScroll').scrollTop = 0;
  scrollToOpen();
  say('list', `Ordered by similarity to ${numberText(rowById(id)?.number) || 'this patent'}.`);
  return true;
}

function topics() {
  const m = new Map();
  BASE.forEach(id => {
    const r = BYID.get(id), k = subclass(r);
    if (!k) return;
    const t = m.get(k) || { k, n: 0, w: sentence(r.ipcWords?.[k]) };
    t.n++; if (!t.w) t.w = sentence(r.ipcWords?.[k]);
    m.set(k, t);
  });
  return [...m.values()].sort((a, b) => b.n - a.n || a.k.localeCompare(b.k));
}
function paintTopics() {
  const t = topics();
  $('#grpPop').innerHTML = `<p class="glabel">Topics in these results</p>
    <button type="button" role="menuitemradio" data-topic="" aria-checked="${!topic}">${I(TICK, 'i tick')}<span>All results</span><span class="count tnum">${BASE.length}</span></button><hr>`
    + (t.length ? t.map(x => `<button type="button" role="menuitemradio" data-topic="${esc(x.k)}" aria-checked="${topic === x.k}">${I(TICK, 'i tick')}<span><span class="mono">${esc(x.k)}</span>${x.w ? `<span class="w">${esc(x.w)}</span>` : ''}</span><span class="count tnum">${x.n}</span></button>`).join('')
      : '<p class="none">These results carry no classes to group by.</p>');
}
function setTopic(k) {
  topic = k;
  render();
  say('list', k ? `Showing ${shown().length} of ${BASE.length}, in ${k}.` : `Showing all ${BASE.length}.`);
}

/* ── the results arrive ─────────────────────────────────────────────────── */
function onSearching(e) {
  query = e.detail.query;
  document.dispatchEvent(new CustomEvent('terrain:close-record'));
  waitOn($('#rows'), 320);
  $('#filterbar').hidden = true;
}

function onResults(e) {
  const d = e.detail;
  const host = $('#rows');
  if (!d.ok) {
    failWith(host, 'The search did not run.', d.res?.retryable ? d.retry : null);
    return;
  }
  const rows = d.data.patents || [];
  BYID = new Map(rows.map(r => [r.id, r]));
  BASE = (d.data.order || rows.map(r => r.id)).filter(id => BYID.has(id));
  VIEW = BASE.slice();
  topic = ''; anchor = null; sortBy = 'relevance'; openId = null;
  $$('#sortPop [data-sort]').forEach(x => x.setAttribute('aria-checked', String(x.dataset.sort === 'relevance')));
  $('#sortLbl').textContent = 'Relevance';
  $('#sortBtn').setAttribute('aria-label', 'Sort: Relevance');
  render();
  $('#listScroll').scrollTop = 0;
  if (!d.notFound) say('list', BASE.length ? `${BASE.length} patents matched.` : 'No patents matched this search.');
  /* a restored address names the record that was open */
  const want = Url.read();
  if (want && want.rec && BYID.has(want.rec)) open(want.rec);
}

function open(id, fig = null, el = null, byKey = false) {
  document.dispatchEvent(new CustomEvent('terrain:open', { detail: { id, fig, el, byKey } }));
}

export function init(ctx) {
  ENGINE = ctx.engine;
  document.addEventListener('terrain:searching', onSearching);
  document.addEventListener('terrain:results', onResults);

  const rowsEl = $('#rows');
  rowsEl.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    const row = e.target.closest('.row'); if (!row) return;
    const t = e.target.closest('.tile');
    open(row.dataset.id, t ? t.dataset.n : null, t || row, e.detail === 0);
  });
  rowsEl.addEventListener('keydown', e => {
    if (e.target.closest('button, a')) return;
    const row = e.target.closest('.row');
    if (row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(row.dataset.id, null, row, true); }
  });

  /* drawings only, or details and drawings */
  $$('[data-show]').forEach(b => b.addEventListener('click', () => {
    $('#split').setAttribute('data-mode', b.dataset.show);
    $$('[data-show]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));

  Pop.wire($('#sortBtn'), $('#sortPop'));
  $('#sortPop').addEventListener('click', e => {
    const b = e.target.closest('[data-sort]'); if (!b) return;
    Pop.close(true); sort(b.dataset.sort);
  });

  Pop.wire($('#grpBtn'), $('#grpPop'), paintTopics);
  $('#grpPop').addEventListener('click', e => {
    const b = e.target.closest('[data-topic]'); if (!b) return;
    Pop.close(true); setTopic(b.dataset.topic);
  });

  $('#filterbar').addEventListener('click', e => {
    const b = e.target.closest('[data-clear]'); if (!b) return;
    if (b.dataset.clear === 'topic') { setTopic(''); $('#grpBtn').focus(); }
    else { sort('relevance'); $('#sortBtn').focus(); }
  });

  /* Export sits at the end of the scope row; below 640px that row is hidden,
     so the list head carries the same menu as a glyph */
  Pop.wire($('#expBtn'), $('#expPop'));
  Pop.wire($('#expBtnP'), $('#expPopP'));
  const onExport = e => {
    const b = e.target.closest('[data-export-list]'); if (!b) return;
    Pop.close(true);
    const rows = shown().map(id => ({ ...BYID.get(id), rank: rankOf(id) }));
    if (!rows.length) { toast('There are no results to export.'); return; }
    const name = Export.save(rows, b.dataset.exportList, { query });
    toast(`Downloaded ${name}`);
  };
  $('#expPop').addEventListener('click', onExport);
  $('#expPopP').addEventListener('click', onExport);
}
