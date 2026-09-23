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
 * more than a third of what app/js/core exists to do. platform.md §5's whole
 * argument is that a wait has a shape; an engine with no latency deletes it.
 *
 * ═══ FAILURE IS REACHABLE ON PURPOSE ═══════════════════════════════════════
 * `?fail=map,record` arms named ports to refuse, and `?fail=all` arms every
 * one. This is how the failure vocabulary gets exercised without editing code:
 * platform.md §9.1 says a failure is the size of the region that was waiting,
 * and that claim is only checkable if the regions can be made to fail one at a
 * time. `?slow=N` multiplies every delay.
 */
import { ok, err, CODE, PORTS } from '../app/js/ports.mjs';
import * as D from './data.mjs';

const qs = new URLSearchParams(location.search);

/* ?fail=map,record  ·  ?fail=all  ·  ?slow=3 */
const FAILING = new Set((qs.get('fail') || '').split(',').filter(Boolean));
const FAIL_ALL = FAILING.has('all');
const SLOW = Number(qs.get('slow') || 1) || 1;

/* WHICH FAILURES ARE RETRYABLE IS THE ENGINE'S ANSWER, not the client's guess.
   It is exactly what core/wait.mjs's failHTML(say, act) consumes: true means
   offer `Try again`, false means say there is no way forward BY HAVING NO
   BUTTON. Guessing wrong in either direction either wastes the founder's time
   or hides their way out. */
const PERMANENT = new Set(['record', 'saveAccount']);

const wait = ms => new Promise(r => setTimeout(r, ms * SLOW));

/* Different ports take visibly different times, and that is deliberate rather
   than decorative: the views resolve INDEPENDENTLY and each arrives when its
   own data lands. A grid where every card resolves on the same frame cannot
   demonstrate partial success, which components.md §0.1 calls the normal case. */
const DELAY = {
  fields: 180, coverage: 340, search: 900,
  read: 900, narrow: 650, approve: 500,
  patents: 700, patentsPage: 520, sort: 420, facets: 420, rerank: 1100, cluster: 1400,
  export: 500,
  record: 600,
  projects: 240,
  points: 300, runs: 380, account: 300, saveAccount: 800,
  billing: 340, invoices: 380, sendSupport: 900,
};

async function respond(port, data) {
  await wait(DELAY[port] ?? 400);
  if (FAIL_ALL || FAILING.has(port)) {
    const retryable = !PERMANENT.has(port);
    return err(retryable ? CODE.UNAVAILABLE : CODE.NOT_FOUND, retryable,
      `demo: ${port} armed to fail by ?fail=`);
  }
  return ok(data);
}

/* ── the list, held here because sorting is a REQUEST ───────────────────────
   All three of sort, facets and patentsPage are requests and not client-side
   array work. Twenty rows arrive at a time, so the client never holds the whole
   set — and sorting what it has would sort a page rather than a result. That is
   a contract claim, so the fake engine honours it: the whole set lives here and
   only a page of it is ever returned. */
const ALL = D.patentRows();
let ORDER = ALL.map(r => r.id);
const PAGE = 20;

function page(order, n) {
  const ids = order.slice(0, n);
  const by = new Map(ALL.map(r => [r.id, r]));
  return { patents: ids.map(id => by.get(id)), order, matched: D.MATCHED };
}

let shown = PAGE;
/* leaf id -> patent ids, held by the ENGINE because the client never has the
   whole set. Null until the grouping has been asked for. */
let GROUPS = null;

/* WHAT THE FOUNDER ASKED FOR, held across the reload. `patents` re-runs right
   after a search — the list reloads itself on terrain:searched — so a limit
   that lived only in `search` would be honoured for one frame and then reset
   to twenty by the very next call. */
let LIMIT = PAGE;

const byId = new Map(ALL.map(r => [r.id, r]));
const cmp = {
  relevance: (a, b) => byId.get(b).score - byId.get(a).score,
  newest:    (a, b) => byId.get(b).year - byId.get(a).year,
  oldest:    (a, b) => byId.get(a).year - byId.get(b).year,
};

export const DemoEngine = {
  /* ── the conversation and the gate ───────────────────────────────────── */
  /* ONE CALL. The old flow charged at the gate; there is no gate, so this is
     where the ledger moves. A failed search returns the balance untouched. */
  /* THE SETTINGS ARE HONOURED, NOT ACKNOWLEDGED. `count` is the one the
     founder can check against what is on screen — they picked 10 and ten rows
     came back — so the fake engine answers it rather than echoing it. The
     other four narrow a corpus this demo does not have: every row here is the
     same synthetic shape, so filtering by jurisdiction would return the same
     set with a smaller number on it, which is a lie with a number attached.
     They reach the engine and `corpus/` is where they mean something. */
  search: async ({ query = '', settings = {} } = {}) => {
    LIMIT = Number(settings.count) || PAGE;
    shown = Math.min(LIMIT, ALL.length);
    ORDER = ALL.map(r => r.id).sort(cmp.relevance);
    return respond('search', {
      ...page(ORDER, shown),
      said: String(query || D.DEMO_IDEA),
      elapsedMs: 240,
      balance: D.POINTS.balance - 2,
    });
  },

  /* ── the home surface ──────────────────────────────────────────────── */
  fields:   async () => respond('fields',   { fields: D.FIELDS }),
  coverage: async () => respond('coverage', { scope: D.COVERAGE_SCOPE,
                                              sources: D.COVERAGE }),

  /* ── the list ────────────────────────────────────────────────────────── */
  /* SORTED, because the bar says Relevance from the first frame. This handed
     back generator order, and the generator ramps `score` upward by index — so
     the opening list ran 0.6250, 0.6620, 0.6990 downward, worst first, under a
     control that claimed it was ranked by relevance. The comparator below was
     right the whole time and simply never ran until somebody opened the menu.

     Whatever `cmp.relevance` does IS the default, rather than a copy of it. */
  patents: async () => {
    shown = Math.min(LIMIT, ALL.length);
    ORDER = ALL.map(r => r.id).sort(cmp.relevance);
    return respond('patents', page(ORDER, shown));
  },

  patentsPage: async () => {
    shown = Math.min(shown + PAGE, ALL.length);
    return respond('patentsPage', page(ORDER, shown));
  },

  sort: async ({ sort = 'relevance' } = {}) => {
    ORDER = ALL.map(r => r.id).sort(cmp[sort] || cmp.relevance);
    return respond('sort', page(ORDER, shown));
  },

  facets: async ({ facets = {}, groups = [] } = {}) => {
    /* THE FACETS ARE REAL VALUES ONLY. status and kind are English words
       already printed on the row; jurisdiction was considered and refused,
       because §8 keeps it a bar and filtering on it would mean inventing a
       facet the founder cannot check against what they can see. */
    let ids = ALL.filter(r => !facets.status || r.status === facets.status)
                 .map(r => r.id);
    /* A BRANCH SELECTION IS A FACET, and it lands here rather than in a port
       of its own because it does the same thing: it changes which patents the
       founder is looking at, over the set the search already returned.
       Several branches union rather than intersect — picking two branches asks
       for both, which is what the removable chips above the list read as. */
    if (groups.length && GROUPS) {
      const want = new Set(groups.flatMap(g => GROUPS.get(g) || []));
      ids = ids.filter(id => want.has(id));
    }
    ORDER = ids;
    shown = Math.min(PAGE, ids.length);
    const res = page(ORDER, shown);
    res.matched = ids.length;
    return respond('facets', res);
  },

  /* FIND SIMILAR RE-SEQUENCES A CORPUS ALREADY PAID FOR and adds no patent to it.
     It returns an ORDER over the SAME set — never a new set — which is what
     lets the client FLIP the rows it already has rather than redraw. */
  rerank: async ({ anchors = [] } = {}) => {
    const anchor = new Set(anchors);
    const order = [...ORDER].sort((a, b) => {
      const A = anchor.has(a) ? 1 : 0, B = anchor.has(b) ? 1 : 0;
      if (A !== B) return B - A;
      return byId.get(b).score - byId.get(a).score;
    });
    ORDER = order;
    return respond('rerank', { order });
  },

  /* THE GROUPING PARTITIONS THE SET IT WAS GIVEN, so it is built from ORDER
     and not from the whole corpus: a facet that removed half the results must
     remove them from the branches too, or the counts contradict the list
     directly above them. And it covers the whole ORDER rather than the loaded
     page — a branch count that grew as the founder pressed Show more would be
     reporting our paging rather than their results. */
  cluster: async () => {
    const { tree, members } = D.clusterFor(ORDER);
    GROUPS = members;
    return respond('cluster', tree);
  },

  record: async ({ id } = {}) => respond('record', D.recordFor(id)),

  /* THE LEDGER, and nothing else. It is handed the ids so a real engine can
     record WHAT left, and it answers with the balance. It never returns the
     rows: the client already has them, and a second copy of the columns here
     would be a second place the export's shape is decided. */
  export: async ({ ids = [] } = {}) =>
    respond('export', { balance: D.POINTS.balance - 8, exported: ids.length }),

  /* ── projects ────────────────────────────────────────────────────────── */
  projects: async () => respond('projects', { projects: D.PROJECTS }),

  /* ── the destinations ────────────────────────────────────────────────── */
  points: async () => respond('points', {
    balance: D.POINTS.balance, allowance: D.POINTS.allowance,
    runTypes: D.RUN_TYPES,
    daily: D.FILINGS.map(v => Math.round(v / 4)),
  }),
  runs: async () => respond('runs', { runs: D.RUNS }),
  account: async () => respond('account', D.ACCOUNT),
  saveAccount: async (patch) => respond('saveAccount', { ...D.ACCOUNT, ...patch }),
  billing: async () => respond('billing', D.BILLING),
  invoices: async () => respond('invoices', { invoices: D.INVOICES }),
  sendSupport: async () => respond('sendSupport', { sent: true }),
};

/* A port added to ports.mjs and forgotten here would otherwise be a TypeError
   at the moment a founder presses something, several surfaces in. assertEngine
   catches it at mount; this catches it at module load, which is earlier and
   names the file that is behind. */
const missing = PORTS.filter(p => typeof DemoEngine[p] !== 'function');
if (missing.length) {
  console.warn(
    `demo/engine.mjs is missing ${missing.length} port(s): ${missing.join(', ')}. ` +
    `app/ will refuse to mount. Add them here, or remove them from ports.mjs if ` +
    `design/components.md no longer has a row for them.`);
}

export default DemoEngine;
