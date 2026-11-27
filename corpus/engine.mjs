/* corpus/engine.mjs — every port in app/js/ports.mjs, over 100 real patents
 * captured from Google Patents.
 *
 * WHAT THIS ENGINE DELIBERATELY DOES NOT DO. It does not clean the data. CJK
 * inventor names, a 5,250-character claim, a 46-character holder name and
 * classes with no CPC words travel exactly as captured: the corpus exists to
 * put real shapes through components written against well-behaved ones.
 *
 * ═══ THE RELEVANCE SCORES ARE STAND-INS ══════════════════════════════════
 * A capture from Google Patents carries no relevance score, and the row prints
 * one. So this engine gives each row a descending stand-in, 0.8862 down by
 * 0.0021 a place, in the order it ranks them — the same stand-ins the V8 lab
 * drew. They are illustrative, like every figure in demo/; a real engine
 * returns its own score and the row prints that instead. Nothing in app/
 * computes a score.
 *
 * ═══ FIND SIMILAR IS GOOGLE'S OWN NEARNESS ═══════════════════════════════
 * Every captured patent carries Google Patents' `similar` list, the same links
 * the corpus was assembled by following. Find similar orders the set by its
 * position in the anchor's list, the anchor first, and the rest after in the
 * search's order. Nothing here is invented.
 *
 * HOLDER NAMES ARE PRINTED. This is real captured data, excluded from main and
 * published only on gh-pages (CLAUDE.md, "What is published").
 */
import { ok, err, CODE, PORTS } from '../app/js/ports.mjs';
import * as D from './data.mjs';

const qs = new URLSearchParams(location.search);
const FAILING = new Set((qs.get('fail') || '').split(',').filter(Boolean));
const FAIL_ALL = FAILING.has('all');

/* `?empty` MAKES EVERY SEARCH COME BACK WITH NOTHING, which is how the empty
   state is reached against an engine that cannot judge relevance. */
const EMPTY = qs.has('empty');
const SLOW = Number(qs.get('slow') || 1) || 1;

const PERMANENT = new Set(['record']);
const wait = ms => new Promise(r => setTimeout(r, ms * SLOW));
/* THE CORPUS IS IN THE PAGE, so its answers arrive almost at once, and these
   are only long enough that every port still answers asynchronously, as a
   real engine does. The interface shows no loader and holds nothing back
   (design-language.md §6); `?slow=N` multiplies these to see a wait. */
const DELAY = { fields: 40, coverage: 60, search: 160, sort: 80, similar: 160, record: 120 };

async function respond(port, data) {
  await wait(DELAY[port] ?? 400);
  if (FAIL_ALL || FAILING.has(port)) {
    const retryable = !PERMANENT.has(port);
    return err(retryable ? CODE.UNAVAILABLE : CODE.NOT_FOUND, retryable,
      `corpus: ${port} armed to fail by ?fail=`);
  }
  return ok(data);
}

const byId = new Map(D.ROWS.map(r => [r.id, r]));
const kindCode = r => (String(r.number || '').match(/[A-Z]\d?$/) || [null])[0];
const version = r => (kindCode(r) || '').startsWith('A') ? 'application' : 'grant';
const office = r => String(r.number || '').slice(0, 2);
/* "Active, expires 2036-12-04" → {word:'Active', expires:'2036-12-04'} */
const status = r => {
  if (!r.statusRaw) return null;
  const m = String(r.statusRaw).match(/^(.*?),\s*expires\s+(\d{4}-\d{2}-\d{2})$/);
  return m ? { word: m[1], expires: m[2] } : { word: r.statusRaw, expires: null };
};

/* THE RANKING THIS FIXTURE USES, and it is the V8 lab's. No relevance score
   exists in the capture, so the order is built from Google Patents' own links:
   US 12107086 B2, one of the ten seeds the corpus grew from, then the patents
   on its `similar` list, then every other record that has drawings, then the
   rest. It does not read the query; a real engine does. */
const LEAD = byId.has('US12107086B2') ? 'US12107086B2' : D.ROWS[0].id;
const RANKED = (() => {
  const seen = new Set([LEAD]), out = [LEAD];
  const add = id => { if (byId.has(id) && !seen.has(id)) { seen.add(id); out.push(id); } };
  (byId.get(LEAD).similar || []).forEach(add);
  D.ROWS.filter(r => (r.figures || []).length).forEach(r => add(r.id));
  D.ROWS.forEach(r => add(r.id));
  return out;
})();
const SCORE = new Map(RANKED.map((id, i) => [id, Number((0.8862 - i * 0.0021).toFixed(4))]));

/* the row, as the list draws it and the export writes it */
const ROW = new Map(D.ROWS.map(r => [r.id, {
  id: r.id, number: r.number, skim: r.skim || r.title, holder: r.holder, where: r.where,
  year: r.year, score: SCORE.get(r.id), inventors: r.inventors, abstract: r.abstract,
  ipcMain: r.ipcMain, ipcWords: r.ipcWords || {}, filed: r.filed, published: r.published,
  kind: r.kind, version: version(r), url: r.url || null,
  figs: Array.isArray(r.figures) ? r.figures.length : null,
  /* the smaller rendition for the strip; null for a figure not on disk, which
     is the contract's "we have this drawing and are not showing it" */
  thumbs: (r.figures || []).slice(0, 8).map(f => ({
    n: f.n, src: f.thumb ? '../corpus/' + f.thumb : f.local ? '../corpus/' + f.local : null, alt: null,
  })),
}]));

let SET = [];
let ORDER = [];

const cmp = {
  relevance: (a, b) => SCORE.get(b) - SCORE.get(a),
  newest: (a, b) => String(byId.get(b).published || '').localeCompare(String(byId.get(a).published || '')),
  oldest: (a, b) => String(byId.get(a).published || '').localeCompare(String(byId.get(b).published || '')),
};

/* A NUMBER, NORMALISED THE WAY A FOUNDER PASTES ONE; the kind code is optional */
const normNo = s => String(s || '').toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/^([A-Z]{2})0+/, '$1');
const byNumber = q => {
  const want = normNo(q);
  if (!want) return null;
  return D.ROWS.find(r => r.number && (normNo(r.number) === want
    || normNo(r.number).replace(/[A-Z]\d?$/, '') === want)) || null;
};

/* THE SETTINGS NARROW THIS SET FOR REAL where the capture can answer: the
   offices by the number's prefix, grants or applications by the kind code, and
   a date range on the filed or published date. The capture holds no priority
   dates, so a range on Priority narrows nothing, and Rerank has no second pass
   to run. */
function admit(r, s) {
  if (Array.isArray(s.sources) && s.sources.length && !s.sources.includes(office(r))) return false;
  if (Array.isArray(s.kinds) && s.kinds.length) {
    const want = version(r) === 'grant' ? 'granted' : 'applications';
    if (!s.kinds.includes(want)) return false;
  }
  if ((s.from || s.to) && (s.basis === 'filed' || s.basis === 'published')) {
    const d = String(r[s.basis] || '');
    if (!d) return false;
    const lo = s.from ? (s.from.length === 4 ? s.from + '-01-01' : s.from) : '';
    const hi = s.to ? (s.to.length === 4 ? s.to + '-12-31' : s.to) : '';
    if (lo && d < lo) return false;
    if (hi && d > hi) return false;
  }
  return true;
}

export const CorpusEngine = {
  fields: async () => respond('fields', {
    fields: [
      { id: 'all', label: 'All technology fields', icon: 'globe', ready: true },
      { id: 'semi', label: 'Semiconductor devices', icon: 'cpu', ready: true },
      { id: 'ict', label: 'Information & Communication Tech', icon: 'network', ready: true },
      { id: 'compute', label: 'Computing & data', icon: 'monitor', ready: false },
      { id: 'energy', label: 'Batteries & energy', icon: 'battery', ready: false },
      { id: 'medical', label: 'Medical diagnostics', icon: 'stetho', ready: false },
    ],
  }),

  /* THE COVERAGE IS THIS CORPUS'S OWN: 100 patents, US 66, CN 32, TW 1, AU 1 */
  coverage: async () => respond('coverage', {
    scope: 'This corpus is 100 patents captured from Google Patents.',
    sources: [
      { source: 'United States', grant: '2026-09-23', application: '2026-09-23' },
      { source: 'China',         grant: '2026-09-23', application: '2026-09-23' },
      { source: 'Taiwan',        grant: '2026-09-23', application: null },
      { source: 'Australia',     grant: null,         application: '2026-09-23' },
    ],
  }),

  search: async ({ query = '', settings = {}, mode = 'text' } = {}) => {
    let order = EMPTY ? [] : RANKED.filter(id => admit(byId.get(id), settings));
    if (mode === 'number') {
      const hit = byNumber(query);
      if (!hit) { await wait(DELAY.search); return err(CODE.NOT_FOUND, false, 'corpus: no patent ' + query); }
      order = [hit.id, ...order.filter(id => id !== hit.id)];
    }
    SET = order.slice(0, Number(settings.count) || order.length);
    ORDER = SET.slice();
    return respond('search', { patents: SET.map(id => ROW.get(id)), order: ORDER, matched: SET.length, elapsedMs: 640 });
  },

  sort: async ({ sort = 'relevance' } = {}) => {
    ORDER = [...SET].sort(cmp[sort] || cmp.relevance);
    return respond('sort', { order: ORDER });
  },

  similar: async ({ anchor } = {}) => {
    const near = (byId.get(anchor)?.similar) || [];
    const at = id => { if (id === anchor) return -1; const i = near.indexOf(id); return i < 0 ? 1e6 : i; };
    ORDER = [...SET].sort((a, b) => at(a) - at(b) || cmp.relevance(a, b));
    return respond('similar', { order: ORDER });
  },

  record: async ({ id } = {}) => {
    const r = byId.get(id);
    if (!r) { await wait(DELAY.record); return err(CODE.NOT_FOUND, false, `corpus: no record ${id}`); }
    return respond('record', {
      title: r.title, number: r.number, appno: r.appno, kind: r.kind, kindCode: kindCode(r), version: version(r),
      ipcMain: r.ipcMain, ipc: r.ipc, ipcWords: r.ipcWords || {}, holder: r.holder, inventors: r.inventors,
      filed: r.filed, published: r.published, priority: r.priority || null, where: r.where,
      status: status(r), abstract: r.abstract, claims: r.claims, url: r.url || null,
      /* `local` is the drawing on disk beside app/, never Google's CDN: a
         drawing fetched at read time is a request to a third party every time
         a founder opens a record */
      figures: (r.figures || []).map(f => ({
        n: f.n,
        src: f.local ? '../corpus/' + f.local : null,
        thumb: f.thumb ? '../corpus/' + f.thumb : null,
        alt: null,
      })),
    });
  },
};

const missing = PORTS.filter(p => typeof CorpusEngine[p] !== 'function');
if (missing.length) console.warn(`corpus/engine.mjs is missing ${missing.length} port(s): ${missing.join(', ')}.`);

export default CorpusEngine;
