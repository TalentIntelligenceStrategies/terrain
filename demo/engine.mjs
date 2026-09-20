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
const PERMANENT = new Set(['record', 'revert', 'saveAccount']);

const wait = ms => new Promise(r => setTimeout(r, ms * SLOW));

/* Different ports take visibly different times, and that is deliberate rather
   than decorative: the views resolve INDEPENDENTLY and each arrives when its
   own data lands. A grid where every card resolves on the same frame cannot
   demonstrate partial success, which components.md §0.1 calls the normal case. */
const DELAY = {
  read: 900, narrow: 650, approve: 500,
  axes: 300, map: 700, mapRising: 760, rivals: 520, filings: 460,
  lineage: 880, sharePie: 400, holderBars: 560, shareBars: 430,
  citeMatrix: 940, lifeCycle: 820, momentum: 640,
  patents: 700, patentsPage: 520, sort: 420, facets: 420, rerank: 1100,
  record: 600,
  projects: 240, versions: 240, revert: 700,
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

const byId = new Map(ALL.map(r => [r.id, r]));
const cmp = {
  relevance: (a, b) => byId.get(b).score - byId.get(a).score,
  newest:    (a, b) => byId.get(b).year - byId.get(a).year,
  oldest:    (a, b) => byId.get(a).year - byId.get(b).year,
};

export const DemoEngine = {
  /* ── the conversation and the gate ───────────────────────────────────── */
  read: async (text) => respond('read', {
    said: String(text || D.DEMO_IDEA),
    reading: {
      subject: 'Airframe and body structure',
      improving: 'Weight',
      stage: 'A working prototype',
      filed: 'Nothing yet',
      where: 'United States',
    },
  }),

  narrow: async () => respond('narrow', { round: D.ROUND }),

  /* CHARGED HERE, not at the end — platform.md §9.2. A run that did not finish
     is not a run that was charged, so the ledger has to distinguish an
     attempted run from a completed one; this returns the balance AFTER. */
  approve: async () => respond('approve', {
    charged: 40,
    balance: D.POINTS.balance - 40,
    project: { id: 'proj-1', label: D.DEMO_PROJECT },
  }),

  /* A STAGE STREAM, NOT A PERCENTAGE. platform.md §5: a percentage invents a
     denominator nobody measured, and a founder reads 80% as "nearly done". */
  buildProgress: async (_arg, onStage) => {
    for (let i = 0; i < D.BUILD_STAGES.length; i++) {
      await wait(420);
      if (typeof onStage === 'function') onStage(i, D.BUILD_STAGES[i]);
    }
    return respond('buildProgress', { stages: D.BUILD_STAGES, done: true });
  },

  /* ── the views ───────────────────────────────────────────────────────── */
  axes: async () => respond('axes', {
    approaches: D.APPROACHES.map((label, i) => ({ id: 'a' + i, label })),
    /* holders carry NO label field at all. Not a null one — absent. */
    holders: D.HOLDER_COUNTS.map((_, i) => ({ id: 'h' + i })),
  }),

  /* DENSITY TONE IS DERIVED CLIENT-SIDE relative to the view's own maximum, so
     no tone and no threshold is ever sent. An engine that sent a tone would be
     deciding what "dark" means for a grid it cannot see the size of. */
  map: async () => respond('map', {
    cols: D.APPROACHES,
    rows: D.HOLDER_COUNTS.map((counts, i) => ({
      label: null, counts, rising: D.HOLDER_RISING[i],
    })),
    total: D.TOTAL, shown: D.SHOWN,
  }),

  mapRising: async () => respond('mapRising', {
    cols: D.APPROACHES,
    rows: D.HOLDER_COUNTS.map((counts, i) => ({
      label: null, counts, rising: D.HOLDER_RISING[i],
    })),
    total: D.TOTAL, shown: D.SHOWN,
  }),

  rivals: async () => respond('rivals', {
    rows: D.RIVALS.map((p, i) => ({ id: 'h' + i, label: null, patents: p })),
    total: D.TOTAL,
  }),

  filings: async () => respond('filings', {
    series: D.FILINGS, lagYears: 1.5,
  }),

  lineage: async () => respond('lineage', { versions: D.VERSIONS }),

  sharePie: async () => respond('sharePie', {
    rows: D.JURISDICTION, total: D.TOTAL,
  }),

  holderBars: async () => respond('holderBars', {
    rows: D.RIVALS.map((p, i) => ({ id: 'h' + i, label: null, patents: p })),
    total: D.TOTAL,
  }),

  shareBars: async () => respond('shareBars', {
    rows: D.ORIGIN, total: D.TOTAL,
  }),

  citeMatrix: async () => respond('citeMatrix', {
    pairs: D.CITED_BY, n: D.RIVALS.length,
  }),

  lifeCycle: async () => respond('lifeCycle', {
    holders: D.LIFECYCLE, patents: D.FILINGS,
  }),

  momentum: async () => respond('momentum', {
    rows: D.PER_HOLDER.map((series, i) => ({ id: 'h' + i, label: null, series })),
  }),

  /* legal is carried on the map response's sibling in components.md; kept here
     so the donut has a port of its own to fail independently of the grid */
  legal: async () => respond('legal', D.LEGAL),

  /* ── the list ────────────────────────────────────────────────────────── */
  patents: async () => {
    shown = PAGE;
    ORDER = ALL.map(r => r.id);
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

  facets: async ({ facets = {} } = {}) => {
    /* THE FACETS ARE REAL VALUES ONLY. status and kind are English words
       already printed on the row; jurisdiction was considered and refused,
       because §8 keeps it a bar and filtering on it would mean inventing a
       facet the founder cannot check against what they can see. */
    let ids = ALL.filter(r => !facets.status || r.status === facets.status)
                 .map(r => r.id);
    ORDER = ids;
    shown = Math.min(PAGE, ids.length);
    const res = page(ORDER, shown);
    res.matched = ids.length;
    return respond('facets', res);
  },

  /* A RE-RANK RE-SEQUENCES A CORPUS ALREADY PAID FOR and adds no patent to it.
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

  record: async ({ id } = {}) => respond('record', D.recordFor(id)),

  /* ── projects and versions ───────────────────────────────────────────── */
  projects: async () => respond('projects', { projects: D.PROJECTS }),
  versions: async () => respond('versions', { versions: D.VERSIONS }),
  revert: async ({ id } = {}) => respond('revert', { current: id }),

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
