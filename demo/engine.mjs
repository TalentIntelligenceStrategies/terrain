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
   state is reached against an engine that cannot judge relevance. A real
   engine returns an empty set when nothing clears its relevance floor
   (platform.md §13, R1-30); this stands in for that floor. */
const EMPTY = qs.has('empty');
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
  patents: 700, patentsPage: 520, sort: 420, facets: 420, rerank: 1100, cluster: 1400,
  record: 600,
  account: 300, saveAccount: 800,
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
  return { patents: ids.map(id => by.get(id)), order, matched: order.length };
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

/* A NUMBER, NORMALISED THE WAY A FOUNDER PASTES ONE: case, spaces, commas,
   slashes and the zero padding between office code and digits all fall away,
   and the kind code is optional — US9000581 finds US 09000581 B2. The forms a
   real index accepts are the open question R1-48 in platform.md §13. */
const normNo = s => String(s || '').toUpperCase().replace(/[^0-9A-Z]/g, '')
  .replace(/^([A-Z]{2})0+/, '$1');
const byNumber = (rows, q) => {
  const want = normNo(q);
  if (!want) return null;
  return rows.find(r => r.number && (normNo(r.number) === want
    || normNo(r.number).replace(/[A-Z]\d?$/, '') === want)) || null;
};

export const DemoEngine = {
  /* ── the conversation and the gate ───────────────────────────────────── */
  /* ONE CALL, from the sentence to the set. */
  /* THE SETTINGS ARE HONOURED, NOT ACKNOWLEDGED. `count` is the one the
     founder can check against what is on screen — they picked 10 and ten rows
     came back — so the fake engine answers it rather than echoing it. The
     other four narrow a corpus this demo does not have: every row here is the
     same synthetic shape, so filtering by jurisdiction would return the same
     set with a smaller number on it, which is a lie with a number attached.
     They reach the engine and `corpus/` is where they mean something. */
  search: async ({ query = '', settings = {}, mode = 'text' } = {}) => {
    LIMIT = Number(settings.count) || PAGE;
    shown = Math.min(LIMIT, ALL.length);
    ORDER = EMPTY ? [] : ALL.map(r => r.id).sort(cmp.relevance);
    /* A NUMBER SEARCH LEADS WITH THAT PATENT and orders the rest after it, or
       refuses with NOT_FOUND, not retryable: the number is not in the index,
       and trying again cannot change that. */
    if (mode === 'number') {
      const hit = byNumber(ALL, query);
      if (!hit) { await wait(DELAY.search); return err(CODE.NOT_FOUND, false, 'demo: no patent ' + query); }
      ORDER = [hit.id, ...ORDER.filter(id => id !== hit.id)];
    }
    return respond('search', {
      ...page(ORDER, shown),
      elapsedMs: 240,
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
  /* THE CURRENT SET IN THE SEARCH'S OWN ORDER. It re-sorted by relevance on
     every call, which threw away the order a number search had set — the
     engine holds the result set between calls (components.md §1), and this
     is the first page of it. */
  patents: async () => {
    shown = Math.min(LIMIT, ALL.length);
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

  facets: async ({ groups = [] } = {}) => {
    let ids = ALL.map(r => r.id);
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
    /* ILLUSTRATIVE, like every figure here: a nearness that falls with
       position, and none for the anchor, which is compared with itself. */
    const nearness = Object.fromEntries(order.filter(id => !anchor.has(id))
      .map((id, i) => [id, Math.max(0.5, 0.962 - i * 0.0035)]));
    return respond('rerank', { order, nearness });
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

  /* AN UNKNOWN ID IS NOT_FOUND, never ok(null): the pane offers no retry for
     a record that does not exist, and it can only know that from the code. */
  record: async ({ id, version } = {}) => {
    if (!byId.has(id)) {
      await wait(DELAY.record);
      return err(CODE.NOT_FOUND, false, `demo: no record ${id}`);
    }
    return respond('record', D.recordFor(id, version));
  },

  /* ── the destinations ────────────────────────────────────────────────── */
  account: async () => respond('account', D.ACCOUNT),
  /* ONE FIELD PER CALL, KEYED BY THE CONTROL THAT EDITED IT — acctName or
     acctMail — and the answer is the account as it now stands. */
  saveAccount: async (patch = {}) => respond('saveAccount', {
    name:  'acctName' in patch ? patch.acctName : D.ACCOUNT.name,
    email: 'acctMail' in patch ? patch.acctMail : D.ACCOUNT.email,
  }),
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
