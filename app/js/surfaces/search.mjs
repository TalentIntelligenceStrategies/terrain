/* surfaces/search — the sentence, the scope, and running a search.
 *
 * TWO COMPOSERS, ONE SEARCH. The home surface and the results surface each
 * carry the V8 lab's search panel (data-composer="home" | "work"). They share
 * the mode, the settings and the run, so a search started on either lands in
 * the same list. Each panel states its scope as chips; the Search settings
 * popover changes it.
 *
 * DRAFT AND APPLIED. The popover edits a draft; Done applies it to the scope
 * row; the next Search runs with what is applied. That is the lab's model, and
 * the note in the popover's foot says so: "Applies when you press Search".
 *
 * THE SEARCH IS IN THE ADDRESS (core/url.mjs): a run writes #set?q=…, so Back,
 * reload and a shared link bring the same search back.
 */
import { $, $$, esc } from '../core/dom.mjs';
import * as Url from '../core/url.mjs';
import * as History from '../core/history.mjs';
import * as Field from '../core/field.mjs';
import * as Pop from '../core/pop.mjs';
import { btnWait, btnRest } from '../core/button-wait.mjs';
import { say, sayFailure } from '../core/live-region.mjs';

const OFFICES = [['US', 'United States'], ['CN', 'China'], ['TW', 'Taiwan'], ['EP', 'Europe'], ['KR', 'Korea'], ['JP', 'Japan']];
const DOCS = [['granted', 'Granted patents'], ['applications', 'Applications']];
const COUNTS = [10, 20, 50, 100, 200];
const BASES = [['filed', 'Filed'], ['published', 'Published'], ['priority', 'Priority']];
const DEF = { sources: OFFICES.map(o => o[0]), kinds: ['granted', 'applications'], count: 50, rerank: false, basis: 'published', from: '', to: '' };
const clone = o => JSON.parse(JSON.stringify(o));

let ENGINE = null;
let applied = clone(DEF), draft = clone(DEF);
let mode = 'text';
let running = 0;

const I = (p, c = 'i') => `<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const TICK = I('<path d="M20 6 9 17l-5-5"/>');
const SLIDERS = '<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>';

/** the settings a search runs with: what the scope row states */
export function settings() { return clone(applied); }
export function currentMode() { return mode; }

/* ── the scope, stated ──────────────────────────────────────────────────── */
function paintScope() {
  const docs = applied.kinds.length === 2 ? 'Grants and applications' : applied.kinds[0] === 'granted' ? 'Grants only' : 'Applications only';
  const range = applied.from || applied.to ? `${applied.from || 'any'}–${applied.to || 'any'}` : 'any date';
  const basis = (BASES.find(b => b[0] === applied.basis) || BASES[1])[1];
  const text = {
    field: Field.label() || 'All technology fields',
    offices: applied.sources.join(' · '),
    docs,
    dates: `${basis} · ${range}`,
    n: String(applied.count),
  };
  $$('[data-scope]').forEach(dd => { dd.textContent = text[dd.dataset.scope] ?? ''; });
}

/* ── the settings popover, one per composer, one state ──────────────────── */
function settingsHTML(p) {
  return `<button class="ctl" type="button" id="${p}SetBtn" aria-haspopup="dialog" aria-expanded="false" aria-controls="${p}SetPop">${I(SLIDERS)}Search settings</button>
  <div class="pop end settings" id="${p}SetPop" role="dialog" aria-label="Search settings">
    <div class="set-grid">
      <fieldset><legend class="micro">Technology field</legend><span class="val" data-set-field></span></fieldset>
      <fieldset><legend class="micro">Results to show</legend>
        <div class="seg" role="group" aria-label="Results to show" data-set="count">${COUNTS.map(n => `<button type="button" data-v="${n}" aria-pressed="false">${n}</button>`).join('')}</div></fieldset>
      <fieldset><legend class="micro">Where to search</legend>
        <div class="chips" data-set-list="sources">${OFFICES.map(([k, n]) => `<button class="chip-t" type="button" data-v="${k}" aria-pressed="false">${TICK}${n}</button>`).join('')}</div></fieldset>
      <fieldset><legend class="micro">Rerank results</legend>
        <div class="seg" role="group" aria-label="Rerank results" data-set="rerank"><button type="button" data-v="false" aria-pressed="false">Off</button><button type="button" data-v="true" aria-pressed="false">On</button></div>
        <p class="help">On: the engine re-orders what it returns in a second pass.</p></fieldset>
      <fieldset><legend class="micro">What to include</legend>
        <div class="chips" data-set-list="kinds">${DOCS.map(([k, n]) => `<button class="chip-t" type="button" data-v="${k}" aria-pressed="false">${TICK}${n}</button>`).join('')}</div></fieldset>
      <fieldset><legend class="micro">Date range</legend>
        <div class="seg" role="group" aria-label="Date basis" data-set="basis">${BASES.map(([k, n]) => `<button type="button" data-v="${k}" aria-pressed="false">${n}</button>`).join('')}</div>
        <div class="dates">
          <label>From<input data-date="from" inputmode="numeric" placeholder="Year or date" autocomplete="off"></label>
          <label>To<input data-date="to" inputmode="numeric" placeholder="Year or date" autocomplete="off"></label>
        </div></fieldset>
    </div>
    <p class="set-warn" role="status" data-set-warn></p>
    <div class="set-foot">
      <button class="btn-quiet" type="button" data-set-reset>${I('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>')}Reset</button>
      <span class="note">Applies when you press Search</span>
      <button class="ctl" type="button" data-set-done>Done</button>
    </div>
  </div>`;
}

function paintDraft(pop) {
  pop.querySelectorAll('[data-set]').forEach(seg => {
    const key = seg.dataset.set;
    seg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === String(draft[key]))));
  });
  pop.querySelectorAll('[data-set-list]').forEach(list => {
    const key = list.dataset.setList;
    list.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(draft[key].includes(b.dataset.v))));
  });
  pop.querySelectorAll('[data-date]').forEach(inp => { inp.value = draft[inp.dataset.date]; });
  const f = pop.querySelector('[data-set-field]');
  if (f) f.textContent = Field.label() || 'All technology fields';
}

function armSettings(anchor, p) {
  anchor.innerHTML = settingsHTML(p);
  const btn = anchor.querySelector('.ctl'), pop = anchor.querySelector('.settings');
  const warn = pop.querySelector('[data-set-warn]');
  Pop.wire(btn, pop, () => { draft = clone(applied); warn.textContent = ''; paintDraft(pop); });
  pop.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const seg = b.closest('[data-set]'), list = b.closest('[data-set-list]');
    if (seg) {
      const key = seg.dataset.set, v = b.dataset.v;
      draft[key] = key === 'count' ? Number(v) : key === 'rerank' ? v === 'true' : v;
    } else if (list) {
      const key = list.dataset.setList, k = b.dataset.v, on = draft[key].includes(k);
      if (on && draft[key].length === 1) {
        warn.textContent = `Keep at least one ${key === 'sources' ? 'office' : 'document kind'} on, or the search has nothing to run over.`;
        return;
      }
      warn.textContent = '';
      draft[key] = on ? draft[key].filter(x => x !== k) : [...draft[key], k];
    } else if (b.hasAttribute('data-set-reset')) {
      draft = clone(DEF); warn.textContent = '';
    } else if (b.hasAttribute('data-set-done')) {
      applied = clone(draft); paintScope(); Pop.close(true); return;
    } else return;
    paintDraft(pop);
  });
  /* a bound is a year or a full date: digits only, the hyphens placed for you */
  pop.querySelectorAll('[data-date]').forEach(inp => inp.addEventListener('input', () => {
    const d = inp.value.replace(/\D/g, '').slice(0, 8);
    inp.value = d.length > 6 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}` : d.length > 4 ? `${d.slice(0, 4)}-${d.slice(4)}` : d;
    draft[inp.dataset.date] = inp.value;
  }));
}

/* ── the mode: Text or Patent number, one value for both composers ──────── */
function setMode(m) {
  mode = m === 'number' ? 'number' : 'text';
  $$('[data-composer] .seg[aria-label="Search by"] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  $$('[data-composer] textarea').forEach(t => {
    if (t.closest('[data-composer="home"]')) t.placeholder = mode === 'number' ? 'For example: US 12107086 B2' : 'For example: a folding drone arm that locks without a latch';
    else t.placeholder = mode === 'number' ? 'A patent number' : 'Describe what you are building';
  });
}

/* the sentence grows from one line to two, and Enter searches */
function fit(t) {
  if (matchMedia('(max-width: 640px)').matches && t.closest('[data-composer="work"]')) { t.style.height = ''; return; }
  t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px';
}

function note(form, text) { const n = form.querySelector('.q-note'); if (n) n.textContent = text || ''; }

/* ── the run ────────────────────────────────────────────────────────────── */
/** run a search: from a composer, from History, or from the address */
export async function run({ query, mode: m = mode, field = Field.get(), from = null } = {}) {
  const q = String(query || '').trim();
  const forms = $$('[data-composer]');
  if (!q) {
    forms.forEach(f => note(f, ''));
    if (from) note(from, m === 'number' ? 'Type a patent number first.' : 'Describe what you are building first.');
    return;
  }
  setMode(m);
  $$('[data-composer] textarea').forEach(t => { t.value = q; fit(t); });
  forms.forEach(f => note(f, ''));
  Url.searched({ query: q, field, mode: m });
  History.add({ query: q, field, fieldLabel: Field.label(), mode: m });

  const mine = ++running;
  const gos = $$('[data-composer] .go');
  gos.forEach(b => btnWait(b, true));
  document.dispatchEvent(new CustomEvent('terrain:searching', { detail: { query: q, mode: m } }));
  const t0 = performance.now();
  const res = await ENGINE.search({ query: q, field, settings: settings(), mode: m });
  if (mine !== running) return;
  gos.forEach(btnRest);

  if (!res.ok && res.code === 'NOT_FOUND' && m === 'number') {
    const say1 = `No patent numbered ${q} is in this index. Check the number, or search by text.`;
    forms.forEach(f => note(f, say1));
    say('work', say1);
    document.dispatchEvent(new CustomEvent('terrain:results', { detail: { ok: true, data: { patents: [], order: [], matched: 0 }, query: q, mode: m, notFound: true } }));
    return;
  }
  if (!res.ok) {
    sayFailure('The search did not run.');
    document.dispatchEvent(new CustomEvent('terrain:results', { detail: { ok: false, res, query: q, mode: m, retry: () => run({ query: q, mode: m, field }) } }));
    return;
  }
  const ms = res.data.elapsedMs != null ? res.data.elapsedMs : Math.round(performance.now() - t0);
  const took = $('#took');
  if (took) took.innerHTML = `<span class="tnum">${esc((ms / 1000).toFixed(2))}</span> s`;
  document.dispatchEvent(new CustomEvent('terrain:results', { detail: { ok: true, data: res.data, query: q, mode: m } }));
}

export function focusQuery() {
  const t = $('#workQuery');
  if (!t) return;
  t.focus();
  t.setSelectionRange(t.value.length, t.value.length);
}

export function init(ctx) {
  ENGINE = ctx.engine;
  $$('[data-composer]').forEach(form => {
    const p = form.dataset.composer;
    const anchor = form.querySelector('[data-settings-anchor]');
    if (anchor) armSettings(anchor, p);
    const t = form.querySelector('textarea');
    form.addEventListener('submit', e => { e.preventDefault(); run({ query: t.value, from: form }); });
    t.addEventListener('input', () => { fit(t); note(form, ''); });
    t.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
      if (e.key === 'Escape' && !Pop.isOpen()) { e.stopPropagation(); t.blur(); }
    });
    form.querySelectorAll('.seg[aria-label="Search by"] button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  });
  addEventListener('resize', () => $$('[data-composer] textarea').forEach(fit));
  Field.onChange(paintScope);
  setMode('text');
  paintScope();

  /* THE ADDRESS NAMES A SEARCH: run it once, on arrival or on Back to it */
  ctx.onRoute(view => {
    if (view !== 'work') return;
    const want = Url.read();
    const ran = Url.ran();
    if (want && !(ran && ran.query === want.query && ran.mode === want.mode && (ran.field || null) === (want.field || null))) {
      if (want.field) Field.set(want.field);
      run({ query: want.query, mode: want.mode, field: want.field || Field.get() });
    } else if (!want && !ran) {
      location.hash = '#home';
    }
    requestAnimationFrame(() => $$('[data-composer] textarea').forEach(fit));
  });
}
