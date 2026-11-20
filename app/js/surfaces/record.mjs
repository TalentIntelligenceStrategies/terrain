/* surfaces/record — the patent record, from the V8 lab's v-v8.html.
 *
 * WHAT A FOUNDER NEEDS FIRST GOES FIRST: the number and the title, the holder,
 * the three actions, then the four facts in one ruled row (legal status, filed,
 * published, where), then the drawings — drawing 1 as the lead sheet and eight
 * beside it — then the abstract and claim 1, and the rest of the record in the
 * rail: the parties, the identifiers, the classes grouped by subclass in CPC's
 * own words. Every section that holds more ends in "Show all".
 *
 * NOTHING IS DROPPED AND NOTHING IS INVENTED. A field the record does not carry
 * prints an em dash in its place, so the layout says the field exists and the
 * source left it empty, rather than closing up as if there were no such field.
 *
 * On a wide window the record is the right panel and stays beside the list;
 * below 640px it slides in over the list, full screen, with Back, previous and
 * next in its head and the actions in a bar at its foot. Back closes it there.
 */
import { $, $$, esc } from '../core/dom.mjs';
import * as Url from '../core/url.mjs';
import * as Pop from '../core/pop.mjs';
import * as Export from '../core/export.mjs';
import * as List from './list.mjs';
import { openViewer, viewerOpen } from '../core/viewer.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { btnWait, btnRest } from '../core/button-wait.mjs';
import { say } from '../core/live-region.mjs';
import { toast } from '../core/toast.mjs';
import { holderText } from '../core/format.mjs';
import * as Search from './search.mjs';

let ENGINE = null;
let openId = null;
let REC = null;
let gen = 0;
let listY = 0;
const DASH = '—';
const IPTECH = 'https://iptech.cc/Member/Account/LogOn?ReturnUrl=%2F';
const phone = () => matchMedia('(max-width: 640px)').matches;

const I = (p, c = 'i') => `<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const P = {
  back: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  prev: '<path d="m15 18-6-6 6-6"/>', next: '<path d="m9 18 6-6-6-6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  similar: '<path d="M10 12h11"/><path d="M10 18h11"/><path d="M10 6h11"/><path d="M4 10h2"/><path d="M4 6h1v4"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  zoom: '<path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/>',
  pm: '<path d="M5 12h14"/><path class="v" d="M12 5v14"/>',
};
const FIGS_FIRST = 9, CLAIMS_FIRST = 1;

/* ── the sheet ──────────────────────────────────────────────────────────── */
function factHTML(label, value, mono) {
  if (!value) return `<div><dt>${label}</dt><dd class="missing">${DASH}</dd></div>`;
  return `<div><dt>${label}</dt><dd${mono ? ' class="mono"' : ''}>${esc(value)}</dd></div>`;
}

/* the legal status as the source states it: the word, then its expiry with the
   date in mono, on the same line (components.md: status is {word, expires}) */
function statusHTML(st) {
  if (!st || !st.word) return `<div><dt>Legal status</dt><dd class="missing">${DASH}</dd></div>`;
  return `<div><dt>Legal status</dt><dd>${esc(st.word)}${st.expires ? ` <span class="sub">· expires <span class="mono">${esc(st.expires)}</span></span>` : ''}</dd></div>`;
}

function sheetHTML(r, id) {
  const num = List.numberText(r.number) || DASH;
  const kind = List.kindLine(r);
  const kc = r.kindCode || List.parts(r.number)?.[2] || '';
  const title = r.title || List.rowById(id)?.skim || '';
  const figs = Array.isArray(r.figures) ? r.figures : [];
  const claims = Array.isArray(r.claims) ? r.claims : [];
  const inv = Array.isArray(r.inventors) ? r.inventors : [];
  const iptech = r.sourceUrl === null ? null : (r.sourceUrl || IPTECH);
  const words = r.ipcWords || {};

  const figLis = figs.map((f, i) => {
    const src = i === 0 ? f.src : (f.thumb || f.src);
    return `<li${i === 0 ? ' class="lead"' : ''}${i >= FIGS_FIRST ? ' hidden' : ''}><button class="dfig" type="button" data-fig="${i}" aria-label="Open drawing ${esc(f.n)} of ${figs.length} in the viewer">`
      + (src ? `<img alt="" decoding="async"${i >= FIGS_FIRST ? ' loading="lazy"' : ''} src="${esc(src)}">` : '<span class="sk-fig" aria-hidden="true"></span>')
      + `<span class="n">${esc(f.n)}</span>${I(P.zoom, 'i zoom')}</button></li>`;
  }).join('');

  const claimLis = claims.map((c, i) => {
    const m = String(c).match(/^(\d+)\.\s*([\s\S]*)$/);
    const n = m ? m[1] : String(i + 1);
    return `<li aria-label="Claim ${esc(n)}"${i >= CLAIMS_FIRST ? ' hidden' : ''}><span class="cn">${esc(n)}</span><p>${esc(m ? m[2] : c)}</p></li>`;
  }).join('');

  const groups = new Map();
  (r.ipc || []).forEach(c => { const k = String(c).replace(/\s+/g, '').slice(0, 4); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(c); });
  const mainSub = String(r.ipcMain || '').replace(/\s+/g, '').slice(0, 4);
  const subs = [...groups.entries()].map(([sub, codes]) => {
    const w = List.sentence(words[sub]);
    return `<details class="csub"${sub === mainSub ? ' open' : ''}><summary aria-label="${esc(sub + (w ? ', ' + w.toLowerCase() : '') + ', ' + codes.length + ' classes')}">`
      + `<span class="code">${esc(sub)}</span><span class="words"${w ? ` title="${esc(w)}"` : ''}>${esc(w)}</span><span class="c">${codes.length}</span>${I(P.pm, 'i pm')}</summary>`
      + `<ul class="codes">${codes.map(c => `<li${c === r.ipcMain ? ' aria-current="true"' : ''}>${esc(c)}</li>`).join('')}</ul></details>`;
  }).join('');

  const ids = [['Number', r.number ? num : null, true], ['Application', r.appno, true],
    ['Kind', kind ? kind + (kc ? ` (${kc})` : '') : null, false], ['Priority', r.priority, true]]
    .map(([k, v, m]) => `<dt>${k}</dt><dd class="${v ? (m ? 'mono' : '') : 'missing'}">${v ? esc(v) : DASH}</dd>`).join('');

  const show = (what, n) => `${I(P.chev)}Show all ${n} ${what}`;
  return `<article class="doc" aria-labelledby="recTitle">
  <header class="rec-bar" id="recBar">
    <button class="ib back" type="button" aria-label="Back to results" data-act="close">${I(P.back)}</button>
    <div class="rb-id"><span class="rb-num mono">${esc(num)}</span><span class="rb-title" aria-hidden="true">${esc(title)}</span></div>
    <nav class="rb-tools" aria-label="Record">
      <button class="ib" type="button" aria-label="Previous record" data-act="prev"${List.neighbour(id, -1) ? '' : ' aria-disabled="true"'}>${I(P.prev)}</button>
      <button class="ib" type="button" aria-label="Next record" data-act="next"${List.neighbour(id, 1) ? '' : ' aria-disabled="true"'}>${I(P.next)}</button>
    </nav>
  </header>
  <button class="ib x-corner" type="button" aria-label="Close record" data-act="close">${I(P.x)}</button>

  <header class="hero">
    <div>
      <p class="eyebrow"><span class="num mono">${esc(num)}</span><span>${esc(kind)}</span></p>
      <h1 id="recTitle" tabindex="-1">${title ? esc(title) : '<span class="sk sk-h-title w-xl" aria-hidden="true"></span>'}</h1>
      ${r.holder != null ? `<p class="rc-holder">${esc(holderText(r.holder))}</p>` : ''}
      ${iptech ? `<a class="ghost iptech-m" href="${esc(iptech)}" target="_blank" rel="noopener">${I(P.ext)}Open in IPTECH</a>` : ''}
    </div>
    <div class="actions">
      <button class="edge" type="button" data-act="similar">Find similar <span class="well">${I(P.similar)}</span></button>
      <div class="export">
        <div class="anchor xmenu-a">
          <button class="edge plain-edge" type="button" id="recExpBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="recExpPop">Export this record <span class="well">${I(P.chev)}</span></button>
          <div class="pop menu xmenu" id="recExpPop" role="menu" aria-label="Export this record">
            <button type="button" role="menuitem" data-exp="csv">Spreadsheet <span class="ext">.csv</span></button>
            <button type="button" role="menuitem" data-exp="md">Markdown <span class="ext">.md</span></button>
          </div>
        </div>
        <div class="xsplit">
          <button class="edge" type="button" data-exp="csv" aria-label="Export this record as CSV">CSV</button>
          <button class="edge" type="button" data-exp="md" aria-label="Export this record as Markdown">Markdown</button>
        </div>
      </div>
      ${iptech ? `<a class="ghost" href="${esc(iptech)}" target="_blank" rel="noopener">${I(P.ext)}Open in IPTECH</a>` : ''}
    </div>
  </header>

  <dl class="facts">
    ${statusHTML(r.status)}${factHTML('Filed', r.filed, true)}${factHTML('Published', r.published, true)}${factHTML('Where', r.where, false)}
  </dl>

  <section class="band" aria-labelledby="recFigsH">
    <h2 id="recFigsH">Drawings <span class="count">${figs.length}</span></h2>
    ${figs.length ? `<ul class="figs" id="recFigs">${figLis}</ul>` : '<p class="no-figs">This record has no drawings.</p>'}
    ${figs.length > FIGS_FIRST ? `<button class="show-all" type="button" data-more="figs" aria-expanded="false" aria-controls="recFigs">${show('drawings', figs.length)}</button>` : ''}
  </section>

  <div class="rc-body">
    <div class="read">
      <section aria-labelledby="recAbsH">
        <h2 id="recAbsH">Abstract</h2>
        <p class="abstract">${r.abstract ? esc(r.abstract) : DASH}</p>
      </section>
      <section aria-labelledby="recClaimsH">
        <h2 id="recClaimsH">Claims <span class="count">${claims.length}</span></h2>
        ${claims.length ? `<ol class="claims" id="recClaims">${claimLis}</ol>` : `<p class="abstract">${DASH}</p>`}
        ${claims.length > CLAIMS_FIRST ? `<button class="show-all" type="button" data-more="claims" aria-expanded="false" aria-controls="recClaims">${show('claims', claims.length)}</button>` : ''}
      </section>
    </div>
    <aside class="rail" aria-labelledby="recRailH">
      <h2 id="recRailH" class="sr-only">Record</h2>
      <div class="rail-groups">
        <div class="rgroup">
          <h3 class="rlabel">Parties</h3>
          <dl class="kv"><dt id="recInvLbl">Inventors</dt><dd${inv.length ? '' : ' class="missing"'}>${inv.length ? `<ul class="people" aria-labelledby="recInvLbl">${inv.map(n => `<li title="${esc(n)}">${esc(n)}</li>`).join('')}</ul>` : DASH}</dd></dl>
        </div>
        <div class="rgroup">
          <h3 class="rlabel">Identifiers</h3>
          <dl class="kv">${ids}</dl>
        </div>
        <div class="rgroup classes">
          <h3 class="rlabel">Classification</h3>
          <div class="main-class"><span class="code">${r.ipcMain ? esc(List.cls(r.ipcMain)) : DASH}</span><span class="mc-tag">main class</span></div>
          ${subs}
        </div>
      </div>
      <p class="src">As published. Class words are CPC’s own, where the record carries them.</p>
    </aside>
  </div>
</article>`;
}

/* ── open, close, step ──────────────────────────────────────────────────── */
async function open({ id, fig = null, el = null, byKey = false } = {}) {
  if (!id) return;
  const same = id === openId && REC;
  openId = id;
  List.mark(id);
  const split = $('#split'), pane = $('#pane'), host = $('#rec');
  split.removeAttribute('data-closed');
  if (phone()) {
    if (!pane.hasAttribute('data-open')) { listY = scrollY; pane.setAttribute('data-open', ''); }
    if (!Url.covered('record')) Url.cover('record', null);
  } else {
    Url.record(id);
    List.scrollToOpen();
  }
  if (same) { if (fig != null) showDrawing(fig, el, byKey); return; }

  const mine = ++gen;
  pane.scrollTop = 0;
  waitOn(host, 320);
  const res = await ENGINE.record({ id });
  if (mine !== gen) return;
  if (!res.ok) {
    REC = null;
    failWith(host, res.code === 'NOT_FOUND' ? 'This record is not in the index.' : 'The record did not load.',
      res.retryable ? () => { openId = null; open({ id, fig, el, byKey }); } : null);
    return;
  }
  REC = res.data;
  landIn(host, sheetHTML(REC, id));
  armSheet(host);
  if (byKey && fig == null) host.querySelector('#recTitle')?.focus({ preventScroll: true });
  if (fig != null) showDrawing(fig, el, byKey);
}

function close() {
  if (!openId && !$('#pane').hasAttribute('data-open')) return;
  const was = openId;
  openId = null; REC = null; gen++;
  const split = $('#split'), pane = $('#pane');
  if (phone() || pane.hasAttribute('data-open')) {
    pane.removeAttribute('data-open');
    if (Url.covered('record')) Url.uncover('record');
    scrollTo(0, listY);
  }
  split.setAttribute('data-closed', '');
  List.mark(null);
  Url.record(null);
  if (was) $(`#rows .row[data-id="${CSS.escape(was)}"]`)?.focus({ preventScroll: true });
}

function step(d) {
  if (!openId) return;
  const n = List.neighbour(openId, d);
  if (n) open({ id: n });
}

/* a drawing named by its published number (from a row) or its index (from the sheet) */
function showDrawing(which, back, byKey) {
  const figs = (REC?.figures || []).map(f => ({ n: f.n, src: f.src, thumb: f.thumb || f.src }));
  if (!figs.length) return;
  let k = typeof which === 'number' ? which : figs.findIndex(f => String(f.n) === String(which));
  if (k < 0) k = 0;
  openViewer(figs, k, { title: REC.title || '', number: List.numberText(REC.number), returnFocus: back, byKey });
}

function armSheet(host) {
  const bar = host.querySelector('#recBar'), title = host.querySelector('#recTitle');
  if (bar && title) new IntersectionObserver(([e]) => {
    bar.toggleAttribute('data-stuck', !e.isIntersecting && e.boundingClientRect.top < 60);
  }, { root: $('#pane'), rootMargin: '-60px 0px 0px 0px' }).observe(title);
  Pop.wire(host.querySelector('#recExpBtn'), host.querySelector('#recExpPop'));
}

async function findSimilar(btn) {
  if (!openId || btn.hasAttribute('data-waiting')) return;
  btnWait(btn, true);
  const ok = await List.similar(openId);
  btnRest(btn);
  if (ok) toast('Results re-ordered by nearness to this record.');
  if (ok && phone()) close();
}

function exportRecord(ext) {
  if (!REC || !openId) return;
  const row = { ...(List.rowById(openId) || {}), ...REC, skim: REC.title, rank: List.rankOf(openId),
                score: List.rowById(openId)?.score ?? null, url: REC.url ?? List.rowById(openId)?.url ?? null };
  const stem = String(REC.number || openId).replace(/[^A-Za-z0-9]+/g, '');
  const name = Export.save([row], ext, { query: List.lastQuery(), stem });
  toast(`Downloaded ${name}`);
}

export function init(ctx) {
  ENGINE = ctx.engine;
  document.addEventListener('terrain:open', e => open(e.detail));
  document.addEventListener('terrain:close-record', () => { if (openId || $('#pane').hasAttribute('data-open')) close(); });
  window.addEventListener('terrain:uncover', e => {
    if (!e.detail.kinds.includes('record')) return;
    openId = null; REC = null; gen++;
    $('#pane').removeAttribute('data-open');
    $('#split').setAttribute('data-closed', '');
    List.mark(null);
    scrollTo(0, listY);
  });

  const host = $('#rec');
  host.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (a) {
      if (a.getAttribute('aria-disabled') === 'true') return;
      const act = a.dataset.act;
      if (act === 'close') close();
      if (act === 'prev') step(-1);
      if (act === 'next') step(1);
      if (act === 'similar') findSimilar(a);
      return;
    }
    const x = e.target.closest('[data-exp]');
    if (x) { Pop.close(); exportRecord(x.dataset.exp); return; }
    const f = e.target.closest('[data-fig]');
    if (f) { showDrawing(Number(f.dataset.fig), f, e.detail === 0); return; }
    const more = e.target.closest('[data-more]');
    if (more) {
      const what = more.dataset.more, openNow = more.getAttribute('aria-expanded') !== 'true';
      const list = host.querySelector(what === 'figs' ? '#recFigs' : '#recClaims');
      const first = what === 'figs' ? FIGS_FIRST : CLAIMS_FIRST;
      [...list.children].forEach((li, i) => { if (i >= first) li.hidden = !openNow; });
      more.setAttribute('aria-expanded', String(openNow));
      const n = list.children.length;
      more.innerHTML = I(P.chev) + (openNow ? (what === 'figs' ? 'Show fewer drawings' : 'Show claim 1 only') : `Show all ${n} ${what === 'figs' ? 'drawings' : 'claims'}`);
    }
  });

  /* keys: Esc closes the innermost thing; ← → step the record; / edits the search */
  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented || viewerOpen() || Pop.isOpen()) return;
    if (document.documentElement.getAttribute('data-view') !== 'work') return;
    if (e.target.closest('input, textarea')) return;
    if (e.key === 'Escape' && openId) { e.preventDefault(); close(); return; }
    if (e.key === '/') { e.preventDefault(); Search.focusQuery(); return; }
    if (!openId || phone()) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });

  ctx.onRoute(view => { if (view !== 'work' && openId) close(); });
}
