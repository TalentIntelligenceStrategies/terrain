/* corpus/engine.mjs — the same 33 methods demo/engine.mjs implements, over ten
 * real patents captured from Google Patents.
 *
 * WHY 33 AND NOT 32. ports.mjs declares 32 and app/js/surfaces/views.mjs:274
 * calls a 33rd, `legal`, which is absent from the PORTS array. assertEngine
 * cannot catch what is not declared, so an engine built from PORTS alone throws
 * on the first render of the Market views. demo/engine.mjs carries it for the
 * same reason.
 *
 * WHAT THIS ENGINE DELIBERATELY DOES NOT DO. It does not clean the data. Null
 * classification descriptions, a 264-character column label, CJK inventor
 * names, a 5,250-character claim, an empty citation matrix and a `shown` that
 * exceeds `total` all travel exactly as captured. Every one of them is an
 * answer to the question the corpus was built to ask, and smoothing any of them
 * here would be forging the result.
 *
 * HOLDER NAMES ARE PRINTED. ports.mjs types the map's rows as {label:null} and
 * says a holder name is "a field nothing may print". That is the decision this
 * run is testing, so `label` carries the real assignee. The typedef and this
 * engine disagree on purpose and the disagreement is the experiment.
 */
import { ok, err, CODE, PORTS } from '../app/js/ports.mjs';
import * as D from './data.mjs';

const qs = new URLSearchParams(location.search);
const FAILING = new Set((qs.get('fail') || '').split(',').filter(Boolean));
const FAIL_ALL = FAILING.has('all');
const SLOW = Number(qs.get('slow') || 1) || 1;

const PERMANENT = new Set(['record', 'revert', 'saveAccount']);
const wait = ms => new Promise(r => setTimeout(r, ms * SLOW));

/* Same unequal delays as the demo, for the same reason: a grid where every card
   resolves on one frame cannot demonstrate partial success. */
const DELAY = {
  read: 900, narrow: 650, approve: 500,
  axes: 300, map: 700, mapRising: 760, rivals: 520, filings: 460,
  lineage: 880, sharePie: 400, holderBars: 560, shareBars: 430,
  citeMatrix: 940, lifeCycle: 820, momentum: 640, legal: 600,
  fields: 180, coverage: 340, search: 900, export: 500,
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
      `corpus: ${port} armed to fail by ?fail=`);
  }
  return ok(data);
}

/* ── the list ───────────────────────────────────────────────────────────────
   Held here rather than client-side, exactly as the demo holds it, because sort
   and facets are REQUESTS. At n=10 the page size of 20 is never reached, so
   `patentsPage` cannot be exercised by this corpus — a limit of the set, not of
   the component. */
const ALL = D.ROWS.map(r => ({
  id: r.id, skim: r.skim, holder: r.holder,
  year: r.year, status: r.status, score: r.score,
  /* CARRIED, NOT DRAWN. The list renders four fields; the export writes seven,
     and it reads the row rather than the record — fifty starred patents are not
     fifty record calls to fill in two columns the row already had. */
  number: r.number, where: r.where,
  /* ══ THE EIGHT THE ROW DRAWS SINCE 2026-09-24 ══════════════════════════
     The row was four fields and a strip. It is the glance surface now, and a
     glance that cannot tell a TSMC filing from a university one is a glance
     that sends the founder into the record every time. These all sit on the
     capture already — nothing here is fetched, derived or invented.

     `inventors` IS THE ARRAY AND THE ROW PRINTS THE FIRST. A row has one line
     for it, and a patent with six inventors is the common case rather than the
     exception; the record prints the set. */
  inventors: r.inventors, abstract: r.abstract, ipcMain: r.ipcMain,
  filed: r.filed, published: r.published, kind: r.kind,
  /* ══ `figs` IS THE TOTAL, AND IT IS NOT thumbs.length ═══════════════════
     The strip carries twelve at most and the last tile has to say how many it
     is standing in for. Deriving that from the strip would print `+0` on a
     patent with four hundred drawings, because the strip is capped before the
     row ever sees it. `null` where we hold no figure list at all, which is the
     withheld case the tile must NOT claim a number for. */
  figs: Array.isArray(r.figures) ? r.figures.length : null,
  /* ══ THE ROW'S DRAWINGS, AND THEY POINT AT THE SMALL RENDITION ══════════
     `thumb` RATHER THAN `local`, and that is the whole reason the capture
     keeps both. Google serves every figure twice — a ~90x120 thumbnail and
     the ~2000x1800 drawing — and fetch.py used to keep the first url it saw,
     which was the thumbnail, so the lightbox spent a month upscaling a 4 KB
     image eleven times.

     It keeps both now, and the two ports want different ones: a 64px row
     thumbnail has no business decoding a 2082x1780 PNG four times a row and
     twenty rows a page, and the record's stage has no business showing a
     thumbnail. Same {n, src, alt} shape either way — nothing in ports.mjs
     says the two must be one file, and an engine choosing which rendition a
     caller gets is exactly an engine's job. components.md §4 question 4 asks
     Innovue for the same pair.

     TWELVE, AND THE ROW SHOWS ABOUT FIVE OF THEM. It was four — the number a
     fixed four-up grid could fit — and the strip scrolls now, so the cap is no
     longer the column's width. It is the DOM's: twenty rows on a page, and a
     patent in this corpus can carry 347 drawings, so an uncapped strip is
     ~7000 <img> on one screen. Twelve is the record's own cap (record.mjs
     CAP), which means the row and the record agree about how many drawings is
     enough to judge by, and `figs` carries the truth about the rest. */
  thumbs: (r.figures || []).slice(0, 12).map(f => ({
    n: f.n,
    /* `|| null` IS THE CONTRACT, NOT A GUARD. build.py sets these to null for
       a figure whose file is not on disk — 98 of them, refused 403 by Google
       every run — and null is what ports.mjs means by "we have this drawing
       and are not showing it". Concatenating onto null would produce the
       string "../corpus/null" and a broken image, which the contract has no
       word for. */
    src: f.thumb ? '../corpus/' + f.thumb
        : f.local ? '../corpus/' + f.local
        : null,
    alt: null,
  })),
}));
const byId = new Map(D.ROWS.map(r => [r.id, r]));
const PAGE = 20;
let ORDER = ALL.map(r => r.id);
let shown = PAGE;
/* leaf id -> patent ids. Held by the ENGINE because the client holds one page
   and never the whole set, so it cannot filter to a branch it can only partly
   see. Null until the grouping has been asked for. */
let GROUPS = null;

function page(order, n) {
  const by = new Map(ALL.map(r => [r.id, r]));
  return { patents: order.slice(0, n).map(id => by.get(id)),
           order, matched: D.TOTAL };
}

/* `score` is null for every row — real data has no relevance score and null is
   the contract's word for "render the bar". Relevance therefore cannot sort,
   and it falls back to the captured order rather than inventing a number. */
/* THIS CORPUS HAS NO RELEVANCE SCORE, so there is no relevance order to
   reproduce and `relevance` sorted by nothing — which left the set in build
   order, which is alphabetical by patent number, which put the ONE patent with
   no drawings at the top. A founder opening ?data=real clicked the first row
   and met "This record has no drawings", on the surface built to show them.

   SO IT ORDERS BY WHAT THIS FIXTURE IS FOR. corpus/ is a stress test: ten real
   patents whose job is to put real text and real drawings through components
   written against the demo's well-behaved shapes. The richest record is the one
   that tests hardest, so it leads. That is an honest ordering for a fixture in
   a way it would not be for a result set — a real engine returns a real score
   and this comparator reads it the moment one exists. */
const cmp = {
  relevance: (a, b) => {
    const A = byId.get(a), B = byId.get(b);
    if (A.score != null && B.score != null) return B.score - A.score;
    return (B.figures || []).length - (A.figures || []).length;
  },
  newest: (a, b) => (byId.get(b).year || 0) - (byId.get(a).year || 0),
  oldest: (a, b) => (byId.get(a).year || 0) - (byId.get(b).year || 0),
};

const holderRows = () => D.HOLDERS.map(h => ({
  id: h.id, label: h.name, patents: h.patents,
}));

const mapData = () => ({
  cols: D.APPROACHES.map(a => a.label || a.code),
  rows: D.GRID.map((counts, i) => ({
    label: D.HOLDERS[i].name, counts, rising: D.RISING[i],
  })),
  total: D.TOTAL, shown: D.SHOWN,
});

/* The destinations have no corpus behind them. Ten patents say nothing about a
   balance, a plan or an invoice, so these return what the demo returns: nulls
   and 'XXX', which are the two refusals the interface already knows how to
   draw. Nothing here is under test. */
const ACCOUNT = { name: null, email: null, org: null, twoFactor: false };
const BILLING = { plan: null, price: 'XXX', renews: null, seats: 1 };

export const CorpusEngine = {
  /* ── the conversation and the gate ───────────────────────────────────── */
  read: async (text) => respond('read', {
    said: String(text || 'A semiconductor device with a dummy isolation gate'),
    reading: {
      subject: 'Semiconductor device fabrication',
      improving: 'Isolation',
      stage: 'A working prototype',
      filed: 'Nothing yet',
      where: 'United States',
    },
  }),

  /* The first question's options are real CPC descriptions, up to 264
     characters. The demo's are two-word phrases. */
  narrow: async () => respond('narrow', { round: D.ROUND }),

  approve: async () => respond('approve', {
    charged: 40, balance: 140,
    project: { id: 'proj-1', label: 'TSMC semiconductor corpus' },
  }),

  buildProgress: async (_arg, onStage) => {
    const stages = ['Reading your criteria', 'Searching the corpus',
                    'Merging families', 'Classifying approaches',
                    'Counting holders', 'Drawing your map'];
    for (let i = 0; i < stages.length; i++) {
      await wait(420);
      if (typeof onStage === 'function') onStage(i, stages[i]);
    }
    return respond('buildProgress', { stages, done: true });
  },

  /* ── the views ───────────────────────────────────────────────────────── */
  axes: async () => respond('axes', {
    approaches: D.APPROACHES.map(a => ({ id: a.id, label: a.label || a.code })),
    holders: D.HOLDERS.map(h => ({ id: h.id, name: h.name })),
  }),

  map:       async () => respond('map', mapData()),
  mapRising: async () => respond('mapRising', mapData()),

  rivals:     async () => respond('rivals', { rows: holderRows(), total: D.TOTAL }),
  holderBars: async () => respond('holderBars', { rows: holderRows(), total: D.TOTAL }),

  filings:  async () => respond('filings', { series: D.FILINGS, lagYears: D.LAG_YEARS }),
  lineage:  async () => respond('lineage', { versions: [] }),

  sharePie:  async () => respond('sharePie',  { rows: D.JURISDICTION, total: D.TOTAL }),
  shareBars: async () => respond('shareBars', { rows: D.ORIGIN,       total: D.TOTAL }),

  /* No patent in this set cites another in it, so `pairs` is empty. An empty
     answer is not a failed one, and which of those the grid renders is exactly
     what components.md §0.1 says a component must not confuse. */
  citeMatrix: async () => respond('citeMatrix', {
    pairs: D.CITED_BY, n: D.HOLDERS.length,
  }),

  lifeCycle: async () => respond('lifeCycle', { holders: D.LIFE_H, patents: D.FILINGS }),

  momentum: async () => respond('momentum', { rows: D.MOMENTUM }),

  legal: async () => respond('legal', D.LEGAL),

  /* ── the front door ──────────────────────────────────────────────────────
     ADDED WITH THE PIVOT. The conversation's five-question narrowing was
     replaced by one field, a technology-field tile row and a coverage table,
     and this engine — which is untracked and so never travelled with the
     change — kept answering the old three ports and none of the new ones. It
     reported the gap correctly and refused to mount, which is assertEngine
     doing its job.

     THE FIELDS AND THE COVERAGE ARE THIS CORPUS'S OWN. Ten semiconductor
     patents captured from Google Patents, so the one covered field is
     semiconductors and the coverage line says what is actually in here rather
     than repeating the demo's six jurisdictions. */
  fields: async () => respond('fields', {
    fields: [
      { id: 'semi', label: 'Semiconductor devices', icon: 'cpu', ready: true },
      { id: 'comms', label: 'Digital communication', icon: 'network', ready: false },
      { id: 'compute', label: 'Computing & data', icon: 'monitor', ready: false },
      { id: 'energy', label: 'Batteries & energy', icon: 'battery', ready: false },
      { id: 'medical', label: 'Medical diagnostics', icon: 'stetho', ready: false },
    ],
  }),

  /* THE COVERAGE IS THIS CORPUS'S OWN, and it was wrong in three ways while
     saying ten. The set is 100 — US 66, CN 32, TW 1, AU 1 — so it omitted two
     jurisdictions outright, and 30 of the 100 are applications rather than
     grants, so `granted` alone described neither column honestly. A coverage
     line that overstates what was searched is the one sentence on this surface
     a founder has no way to check. */
  coverage: async () => respond('coverage', {
    scope: 'This corpus is 100 patents captured from Google Patents.',
    sources: [
      { source: 'United States · granted and applications', updated: '2026-09-23' },
      { source: 'China · granted and applications', updated: '2026-09-23' },
      { source: 'Taiwan · granted', updated: '2026-09-23' },
      { source: 'Australia · applications', updated: '2026-09-23' },
    ],
  }),

  /* `settings.count` IS HONOURED HERE TOO. At n=100 the ladder's lower stops
     (10, 20, 50) all bite and 500 is a ceiling nothing reaches — which is the
     point of running against this set: a component that assumes a full page is
     a component that breaks on a short one. */
  search: async ({ query = '', settings = {} } = {}) => {
    const want = Number(settings.count) || PAGE;
    shown = Math.min(want, ALL.length);
    ORDER = ALL.map(r => r.id).sort(cmp.relevance);
    return respond('search', {
      ...page(ORDER, shown),
      said: String(query || 'semiconductor isolation gate'),
      elapsedMs: 2620,
      balance: 138,
    });
  },

  /* ── the list ────────────────────────────────────────────────────────── */
  patents: async () => {
    shown = PAGE; ORDER = ALL.map(r => r.id).sort(cmp.relevance);
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
  /* ── the grouping, over REAL classification ───────────────────────────
     No invented taxonomy here and none needed: CPC already is one, and it is
     the closest thing to ground truth this corpus has. The SECTION letter is
     the spine (H — electricity, G — physics) and the four-character CLASS is
     the leaf (H01L, G06N). Two levels, which is what platform.md §4.4 caps
     it at.

     A PATENT SITS IN ONE LEAF, ITS MAIN CLASS, even though real CPC is
     many-to-many. Counting a patent under every class it carries would make
     the branch counts sum to more than the result set — the exact defect
     FINDINGS.md records as finding A against the old matrix, where `shown`
     exceeded `total` and reached the founder as a false number. */
  cluster: async () => {
    const SECTION = {
      A: 'Human necessities', B: 'Operations and transport', C: 'Chemistry and metallurgy',
      D: 'Textiles and paper', E: 'Fixed constructions', F: 'Mechanical engineering',
      G: 'Physics', H: 'Electricity',
    };
    if (ORDER.length < 12) {
      GROUPS = new Map();
      return respond('cluster', { head: 'this search', spines: [] });
    }
    /* THE LABEL IS WORDS, NOT THE CODE. A branch reading `H10D · 37` cannot
       navigate anybody who is not already a patent examiner, and this panel
       exists so a founder can walk a set of two hundred in pieces. CPC ships
       a description per node; it is ALL CAPS and runs to 149 characters, so
       it is cut at the first semicolon — CPC uses one to separate a class
       from its qualifications — and sentence-cased. The code stays as the
       leaf's id, which is what the filter travels on. */
    const WORDS = {};
    D.ROWS.forEach(r => Object.assign(WORDS, r.ipcWords || {}));
    /* SENTENCE CASE, EXCEPT FOR THE CODES INSIDE IT. CPC descriptions are ALL
       CAPS and contain classification codes — "DEVICES COVERED BY CLASS H10" —
       so lowercasing the lot turned a code into the word "h10". A token that
       looks like a code (capitals followed by digits) keeps its case; the rest
       is lowered and the first letter restored.

       A CODE WITH NO DESCRIPTION FALLS BACK TO ITSELF. H01L has none anywhere
       in this corpus — it was reorganised into H10D in the 2025 CPC revision —
       and a bare code is the honest label for a class nothing named. */
    const CODEISH = /^[A-Z]\d|^[A-Z]{1,2}\d{2}/;
    const nameOf = code => {
      const d = WORDS[code];
      if (!d) return code;
      const head = d.split(';')[0].trim();
      const words = head.split(/(\s+)/).map(w =>
        CODEISH.test(w) ? w : w.toLowerCase());
      const out = words.join('');
      return out.charAt(0).toUpperCase() + out.slice(1);
    };

    const byLeaf = new Map();
    ORDER.forEach(id => {
      const r = byId.get(id);
      const leaf = ((r && r.ipcMain) || '').slice(0, 4) || 'Unclassified';
      if (!byLeaf.has(leaf)) byLeaf.set(leaf, []);
      byLeaf.get(leaf).push(id);
    });
    GROUPS = byLeaf;
    const bySection = new Map();
    [...byLeaf.entries()].forEach(([leaf, members]) => {
      const label = SECTION[leaf[0]] || 'Other';
      if (!bySection.has(label)) bySection.set(label, []);
      bySection.get(label).push({ id: leaf, label: nameOf(leaf), n: members.length });
    });
    return respond('cluster', {
      head: 'this search',
      spines: [...bySection.entries()]
        .map(([label, leaves]) => ({ label, leaves: leaves.sort((a, b) => b.n - a.n) }))
        .sort((a, b) => b.leaves.length - a.leaves.length),
    });
  },

  facets: async ({ facets = {}, groups = [] } = {}) => {
    let ids = ALL.filter(r => !facets.status || r.status === facets.status)
                 .map(r => r.id);
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
  rerank: async ({ anchors = [] } = {}) => {
    const anchor = new Set(anchors);
    ORDER = [...ORDER].sort((a, b) =>
      (anchor.has(b) ? 1 : 0) - (anchor.has(a) ? 1 : 0));
    return respond('rerank', { order: ORDER });
  },

  record: async ({ id } = {}) => {
    const r = byId.get(id);
    if (!r) return respond('record', null);
    return respond('record', {
      title: r.title, number: r.number, appno: r.appno, kind: r.kind,
      ipcMain: r.ipcMain, ipc: r.ipc, holder: r.holder, inventors: r.inventors,
      filed: r.filed, published: r.published, where: r.where,
      status: r.status, abstract: r.abstract, claims: r.claims,
      /* THE DRAWINGS, mapped into the contract's shape. corpus/data.mjs has
         carried them since the capture and this whitelist never passed them
         through; ports.mjs wants {n, src, alt} and the capture holds
         {file, url, n, local}.

         `local` RATHER THAN `url`, and the path is relative to app/index.html
         — the page is served from /app/ and corpus/ sits beside it. The remote
         url is kept in the capture and never used: a drawing fetched from
         Google's CDN at read time is a request to a third party every time a
         founder opens a record.

         No alt. These are technical drawings whose content nothing here can
         describe, and an invented description would be worse than the figure
         number the caption already carries. */
      figures: (r.figures || []).map(f => ({
        n: f.n,
        /* null rather than a path to a file that is not there — see `thumbs`
           above and ports.mjs's figure contract. */
        src: f.local ? '../corpus/' + f.local : null,
        alt: null,
      })),
    });
  },

  export: async ({ ids = [] } = {}) =>
    respond('export', { balance: 132, exported: ids.length }),

  /* ── projects and destinations ────────────────────────────────── */
  projects: async () => respond('projects', {
    projects: [{ id: 'proj-1', label: 'TSMC semiconductor corpus', current: true }],
  }),

  points: async () => respond('points', {
    balance: 140, allowance: 400,
    runTypes: [
      { id: 'search',  label: 'New search', cost: 40 },
      { id: 'rebuild', label: 'Rebuild after a scope change', cost: 25 },
      { id: 'rerank',  label: 'Find similar', cost: 4 },
      { id: 'export',  label: 'Export', cost: 8 },
      { id: 'watch',   label: 'Watch', cost: 12 },
    ],
    daily: D.FILINGS,
  }),
  runs: async () => respond('runs', {
    runs: [{ id: 'r1', kind: 'New search', project: null,
             when: '2026-09-23', cost: 40 }],
  }),
  account:     async () => respond('account', ACCOUNT),
  saveAccount: async (patch) => respond('saveAccount', { ...ACCOUNT, ...patch }),
  billing:     async () => respond('billing', BILLING),
  invoices:    async () => respond('invoices', { invoices: [] }),
  sendSupport: async () => respond('sendSupport', { sent: true }),
};

const missing = PORTS.filter(p => typeof CorpusEngine[p] !== 'function');
if (missing.length) {
  console.warn(
    `corpus/engine.mjs is missing ${missing.length} port(s): ${missing.join(', ')}.`);
}

export default CorpusEngine;
