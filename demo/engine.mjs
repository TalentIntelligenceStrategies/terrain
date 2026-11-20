/* demo/engine.mjs — the fake engine. Every port in ports.mjs, answered.
 *
 * DELETABLE, AND THE DELETION IS THE TEST. Remove this directory and app/ runs
 * against NullEngine, where every port refuses and every surface has to say
 * "this did not run" rather than throw. If a surface cannot draw itself against
 * NullEngine it cannot draw its own failure state either.
 *
 * ═══ THE FAKE ENGINE BENDS TOWARD THE CONTRACT, NEVER THE REVERSE ══════════
 * Never bend a component toward this file's shape. app/js/** is the contract
 * and this is one implementation of it; a component shaped around the fake
 * engine is a component that breaks against the real one. When this file is
 * awkward, that is information about the contract — take it to
 * design/components.md, not to the renderer.
 *
 * ═══ LATENCY IS PART OF THE DEMONSTRATION ══════════════════════════════════
 * Every port waits. A fake engine that resolves synchronously makes every
 * loader, every skeleton and every wait/fail path unreachable — and those are
 * more than a third of what app/js/core exists to do. platform.md §7's whole
 * argument is that every wait can end two ways; an engine with no latency
 * deletes the first ending and the second along with it.
 *
 * ═══ FAILURE IS REACHABLE ON PURPOSE ═══════════════════════════════════════
 * `?fail=search,record` arms named ports to refuse, and `?fail=all` arms every
 * one. This is how the failure vocabulary gets exercised without editing code:
 * platform.md §7.1 says a failure is the size of the region that was waiting,
 * and that claim is only checkable if the regions can be made to fail one at a
 * time. `?slow=N` multiplies every delay.
 */
import { ok, err, CODE, PORTS } from '../app/js/ports.mjs';
import * as D from './data.mjs';

const qs = new URLSearchParams(location.search);

/* ?fail=search,record  ·  ?fail=all  ·  ?slow=3 */
const FAILING = new Set((qs.get('fail') || '').split(',').filter(Boolean));
const FAIL_ALL = FAILING.has('all');

/* `?empty` MAKES EVERY SEARCH COME BACK WITH NOTHING, which is how the empty
   state is reached against an engine that cannot judge relevance. */
const EMPTY = qs.has('empty');
const SLOW = Number(qs.get('slow') || 1) || 1;

/* WHICH FAILURES ARE RETRYABLE IS THE ENGINE'S ANSWER, not the client's guess. */
const PERMANENT = new Set(['record']);

const wait = ms => new Promise(r => setTimeout(r, ms * SLOW));

/* Different ports take visibly different times, so every wait is reachable. */
const DELAY = { fields: 180, coverage: 340, search: 900, sort: 420, similar: 1100, record: 600 };

async function respond(port, data) {
  await wait(DELAY[port] ?? 400);
  if (FAIL_ALL || FAILING.has(port)) {
    const retryable = !PERMANENT.has(port);
    return err(retryable ? CODE.UNAVAILABLE : CODE.NOT_FOUND, retryable,
      `demo: ${port} armed to fail by ?fail=`);
  }
  return ok(data);
}

/* ── the set ────────────────────────────────────────────────────────────────
   The rows the row contract describes, built from data.mjs. Every field the
   demo does not hold stays null and renders a bar; `ipcWords` is {} because
   there are no classes to name; `url` is null, so no row offers a source. */
const ALL = D.patentRows().map(r => ({
  ...r,
  version: r.versions?.[0]?.kind ?? null,
  ipcWords: {},
  url: null,
  thumbs: (r.thumbs || []).slice(0, 8),
}));
const byId = new Map(ALL.map(r => [r.id, r]));

/* THE SET THE SEARCH RETURNED, capped at `settings.count`, and its order */
let SET = [];
let ORDER = [];

const pub = id => byId.get(id).published || '';
const cmp = {
  relevance: (a, b) => byId.get(b).score - byId.get(a).score,
  newest:    (a, b) => pub(b).localeCompare(pub(a)),
  oldest:    (a, b) => pub(a).localeCompare(pub(b)),
};

/* A NUMBER, NORMALISED THE WAY A FOUNDER PASTES ONE: case, spaces, commas,
   slashes and the zero padding fall away, and the kind code is optional. */
const normNo = s => String(s || '').toUpperCase().replace(/[^0-9A-Z]/g, '')
  .replace(/^([A-Z]{2})0+/, '$1');
const byNumber = (rows, q) => {
  const want = normNo(q);
  if (!want) return null;
  return rows.find(r => r.number && (normNo(r.number) === want
    || normNo(r.number).replace(/[A-Z]\d?$/, '') === want)) || null;
};

export const DemoEngine = {
  fields:   async () => respond('fields',   { fields: D.FIELDS }),
  coverage: async () => respond('coverage', { scope: D.COVERAGE_SCOPE, sources: D.COVERAGE }),

  /* ONE CALL, from the sentence to the set, and every row of it at once. The
     count is honoured; the other settings narrow a corpus this demo does not
     have, so they reach the engine and corpus/ is where they mean something. */
  search: async ({ query = '', settings = {}, mode = 'text' } = {}) => {
    let order = EMPTY ? [] : ALL.map(r => r.id).sort(cmp.relevance);
    if (mode === 'number') {
      const hit = byNumber(ALL, query);
      if (!hit) { await wait(DELAY.search); return err(CODE.NOT_FOUND, false, 'demo: no patent ' + query); }
      order = [hit.id, ...order.filter(id => id !== hit.id)];
    }
    SET = order.slice(0, Number(settings.count) || order.length);
    ORDER = SET.slice();
    return respond('search', { patents: SET.map(id => byId.get(id)), order: ORDER, matched: SET.length, elapsedMs: 240 });
  },

  /* both re-order the SAME set and add no patent to it */
  sort: async ({ sort = 'relevance' } = {}) => {
    ORDER = [...SET].sort(cmp[sort] || cmp.relevance);
    return respond('sort', { order: ORDER });
  },
  similar: async ({ anchor } = {}) => {
    ORDER = [...SET].sort((a, b) => (b === anchor) - (a === anchor) || cmp.relevance(a, b));
    return respond('similar', { order: ORDER });
  },

  /* AN UNKNOWN ID IS NOT_FOUND, never ok(null): the pane offers no retry for
     a record that does not exist, and it can only know that from the code. */
  record: async ({ id } = {}) => {
    if (!byId.has(id)) {
      await wait(DELAY.record);
      return err(CODE.NOT_FOUND, false, `demo: no record ${id}`);
    }
    const r = D.recordFor(id);
    return respond('record', {
      ...r,
      version: byId.get(id).version,
      kindCode: null, status: null, priority: null, ipcWords: {}, url: null,
    });
  },
};

const missing = PORTS.filter(p => typeof DemoEngine[p] !== 'function');
if (missing.length) console.warn(`demo/engine.mjs is missing ${missing.length} port(s): ${missing.join(', ')}.`);

export default DemoEngine;
