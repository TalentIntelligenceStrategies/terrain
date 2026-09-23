/* demo/data.mjs — the illustrative figures, in the contract's shapes.
 *
 * DELETABLE. This directory is a sibling of app/, not a part of it, and
 * app/js/** holds no data by construction. check-app.py fails the build if
 * anything but js/main.mjs imports from here, so deleting the directory leaves
 * ONE broken line rather than a search.
 *
 * ═══ EVERY FIGURE HERE IS ILLUSTRATIVE ═════════════════════════════════════
 * No number is a real filing count and no party is real. The figures are the
 * prototype's own, carried across rather than re-invented, because they satisfy
 * platform.md §13's invariants and re-deriving them would mean re-deriving the
 * arithmetic that makes the surface internally consistent:
 *
 *   cells sum to shown (51), shown < total (124), a sentence says why
 *   every per-holder series sums to that holder's count — 12 9 8 6 5
 *   origin sums to total; jurisdiction sums to total, derived not typed
 *   live + expired = total; each holder's split sits inside it
 *   colYears rows sum to their colPatents entry; colPatents sums to total
 *
 * tools/check-figures.mjs asserts all of that against the PROTOTYPE. If you
 * change a figure here, change it there, or the two demonstrations of one
 * product print two different corpora.
 *
 * ═══ null MEANS RENDER THE SKELETON BAR ════════════════════════════════════
 * And it is the only thing that means that — ports.mjs is the rule. Holder
 * names, patent numbers, application numbers, IPC symbols and inventors are
 * null here because design-language.md §8 makes them bars, NOT because nobody
 * has written them. A real engine returning real names changes nothing but the
 * presence of a value; no renderer branches on whether the data is real.
 *
 * THE ONE POPULATED RECORD is §8's fourth admissible exception: a record pane
 * of nothing but bars cannot demonstrate a record pane. Exactly one.
 */

export const FILINGS = [18, 22, 19, 28, 25, 34, 31, 44, 40, 52, 58, 55];

/* A JURISDICTION IS NOT A PARTY, so countries are named — §8 says so, and five
   grey wedges would read as nothing. Three rows: §3.7 allows three encoded
   values and barStyle() has exactly three marks, so a fourth would draw
   identically to the second and the legend would become a lie. */
export const JURISDICTION = [
  ['United States', 47], ['China', 66], ['Other, five countries', 11],
];

/* ── the one populated record · design-language.md §8's fourth exception ──── */
export const DEMO_TITLE =
  'Foldable quadrotor airframe with load-bearing arm hinges and an integrated ' +
  'motor mount';

export const DEMO_ABSTRACT =
  'An airframe for a rotary-wing unmanned aircraft has four arms joined to a ' +
  'central body by hinges that carry flight loads rather than passing them to a ' +
  'separate spar. Each arm folds against the body about an axis inclined to the ' +
  'rotor plane, stowing within the plan footprint of the body without removing ' +
  'the rotors. The motor mount is formed as part of the arm end, locating the ' +
  'stator directly on the load path.';

/* A REAL DEPENDENCY TREE — 1 independent, 2-9 dependent, two of them dependent
   on a dependent. A flat list of nine independent claims is not what a patent
   looks like, and what a patent looks like is the one thing a founder is on
   this surface to learn. */
export const DEMO_CLAIMS = [
  'An airframe for a rotary-wing unmanned aircraft, comprising: a central body; ' +
  'four arms, each having a proximal end and a distal end; a hinge joining the ' +
  'proximal end of each arm to the central body and defining a fold axis ' +
  'inclined to the rotor plane; and a motor mount formed integrally with the ' +
  'distal end of each arm, wherein the hinge is arranged to carry flight loads ' +
  'between the arm and the central body.',
  'The airframe of claim 1, wherein each hinge is arranged to pass over centre ' +
  'as its arm reaches the deployed position, such that flight loads seat the joint.',
  'The airframe of claim 2, further comprising a detent retaining each arm in ' +
  'the deployed position until a release load is applied.',
  'The airframe of claim 1, wherein each arm folds against the central body ' +
  'within the plan footprint of the central body with its rotor attached.',
  'The airframe of claim 1, wherein the motor mount locates a stator of a drive ' +
  'motor on the load path between the rotor and the hinge.',
  'The airframe of claim 5, wherein the motor mount and the arm are formed as a ' +
  'single moulded composite part.',
  'The airframe of claim 6, wherein the composite part comprises a foam core ' +
  'enclosed by a fibre-reinforced skin.',
  'The airframe of claim 1, wherein the central body encloses a sealed ' +
  'electronics bay, and the hinge is outboard of the seal.',
  'The airframe of claim 1, wherein each arm carries a conductor between the ' +
  'central body and the motor mount, the conductor passing through the hinge on ' +
  'the fold axis.',
];

/* ACME IS THE ONE INVENTED NAME THAT CANNOT READ AS A LIVE EXAMPLE, and that is
   the whole argument. CLAUDE.md forbids naming a holder because "an invented
   one reads as a live example, and transliterating a real one is fabrication" —
   the harm named there is a reader mistaking the name for real data. ACME is
   the archetypal fictional company; being unmistakably fake is its entire
   cultural function, so it satisfies the rule's REASON while departing from its
   letter. A plausible-sounding invention would not, and must not be used. */
export const DEMO_HOLDER = 'ACME Group';

export const DEMO_RECORD = {
  number: 'US 12,984,117 B2',
  appno: 'US 18/992,410',
  /* the United States has no utility model, so once `Where` prints real English
     a seeded `Utility model` would contradict the field beside it */
  kind: 'Invention',
  ipcMain: 'B64U 10/13',
  ipc: ['B64U 10/13', 'B64U 30/293', 'B64U 50/19'],
  holder: DEMO_HOLDER,
  inventors: ['J. Doe', 'R. Roe', 'M. Poe'],
  where: 'United States',
};

export const DEMO_PROJECT = 'Drone airframe and body structure';
export const DEMO_IDEA = 'drone';

/* ── the list ────────────────────────────────────────────────────────────────
   SET_CEILING is the demo's own answer to the fifth narrowing question: 500
   asked, 162 matched, 124 recommended. */
export const MATCHED = 162;
export const SET_CEILING = 124;

/* a seeded pseudo-record, so the list is stable across reloads and a reorder
   can be compared against the order before it. Deterministic by construction:
   an unstable list makes every visual judgement unfalsifiable. */
function seeded(i) {
  const n = Math.abs((i * 37 + 5) | 0) % 997;
  return {
    n,
    status: (n % 7 === 3 || n % 11 === 6) ? 'expired' : 'live',
    /* Innovue's own relevance score, printed rather than re-derived. Four
       decimals, because that is what the engine returns; rounding it would be
       Terrain restating it. No word about quality may sit beside it. */
    score: Number((0.62 + (n % 361) / 1000).toFixed(4)),
    year: 2014 + (n % 12),
  };
}

export function patentRows(count = SET_CEILING) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const s = seeded(i);
    out.push({
      id: 'p' + i,
      /* EXACTLY ONE ROW CARRIES REAL ENGLISH — §8's fourth exception, and the
         record it opens is the same one. Everything else is a bar. */
      skim: i === 0 ? DEMO_TITLE : null,
      holder: i === 0 ? DEMO_HOLDER : null,
      year: s.year,
      status: s.status,
      /* AND IT SCORES HIGHEST, so relevance order puts it first. The seed gave
         it whatever the formula produced, which left the one row that can
         demonstrate a title, a holder and a record sitting at position 61 —
         reachable only by paging, on a surface whose whole job is to show what
         a result looks like.

         It is not a thumb on the scale. The demonstration row IS the patent
         closest to what the founder described; a set where the nearest match
         is the one we can say nothing about would be the odd arrangement. */
      score: i === 0 ? 0.9880 : s.score,
    });
  }
  return out;
}

export function recordFor(id) {
  const i = Number(String(id).replace(/^p/, '')) || 0;
  const s = seeded(i);
  if (i !== 0) {
    /* every other record is bars. null is not "missing" — it is "this value
       exists and we decline to print it", and it is the only thing that means
       render the skeleton. */
    return {
      title: null,
      number: null, appno: null, kind: 'Invention', ipcMain: null, ipc: null,
      holder: null, inventors: null,
      filed: String(s.year), published: String(s.year + 1), where: null,
      status: s.status, abstract: null, claims: null,
      /* EMPTY, NOT null, AND NOT A BAR. The skeleton contract covers values
         that exist and are being withheld; the demo corpus has no drawings at
         all, and a row of grey rectangles would claim it does. `?data=real`
         runs on corpus/, where they are real. */
      figures: [],
    };
  }
  return {
    ...DEMO_RECORD,
    title: DEMO_TITLE,
    filed: '2021', published: '2023',
    status: 'live', abstract: DEMO_ABSTRACT, claims: DEMO_CLAIMS,
    /* SIX DRAWINGS, EVERY ONE OF THEM WITHHELD — `src: null`, which is what
       null means in every other field here. This is §8's contract, not a fifth
       exception to it: the record HAS drawings and Terrain declines to print
       them, exactly as it declines to print the holder name two fields up.

       IT IS NOT A FABRICATION AND COULD NOT BE ONE. .gitignore refuses *.png
       wholesale and check-publish.py refuses a base64 data: URI, so a demo
       drawing would have to be inline SVG somebody drew — an invented
       technical drawing presented as a patent's own, which is the one thing
       §8's exceptions may never be used for. A frame invents nothing.

       AND IT IS WHY THE SURFACE IS REACHABLE AT ALL. With an empty array the
       viewer, the strip, the action bar and the Drawings-only mode were
       unreachable on the URL everybody opens — a feature demonstrable only
       behind a flag and a local directory absent from a fresh clone. */
    figures: [1, 2, 3, 4, 5, 6].map(n => ({ n, src: null, alt: null })),
  };
}

/* ── projects, points, account, billing ─────────────────────────────────── */
/* NOTHING IS INVENTED. Every other project is a bar — naming a roster would be
   inventing six projects a founder never made, which is a different act from
   printing the one the surface already shows. */
export const PROJECTS = [
  { id: 'proj-1', label: DEMO_PROJECT, current: true },
  { id: 'proj-2', label: null }, { id: 'proj-3', label: null },
  { id: 'proj-4', label: null }, { id: 'proj-5', label: null },
];

export const POINTS = { balance: 180, allowance: 400 };

export const RUN_TYPES = [
  { id: 'search', label: 'New search', cost: 40 },
  { id: 'rebuild', label: 'Rebuild after a scope change', cost: 25 },
  { id: 'rerank', label: 'Find similar', cost: 4 },
  { id: 'export', label: 'Export', cost: 8 },
  { id: 'watch', label: 'Watch', cost: 12 },
];

export const RUNS = [
  { id: 'r1', kind: 'New search', project: null, when: '2026-09-14', cost: 40 },
  { id: 'r2', kind: 'Find similar', project: null, when: '2026-09-14', cost: 4 },
  { id: 'r3', kind: 'Rebuild', project: null, when: '2026-09-12', cost: 25 },
  { id: 'r4', kind: 'New search', project: null, when: '2026-09-09', cost: 40 },
];

/* THE FOUNDER'S OWN NAME AND ADDRESS ARE BARS TOO. §8 does not bend for them:
   a settings page whose whole content is a name and an email is where that
   temptation is strongest. A password renders as a run of dots, which is what a
   password looks like everywhere and is chrome rather than an identity being
   withheld. */
export const ACCOUNT = { name: null, email: null, org: null, twoFactor: false };

/* 'XXX' IS NOT null, AND THE TWO RENDER THROUGH DIFFERENT PATHS ON PURPOSE.
   null is "this value exists and we decline to print it"; 'XXX' is "nobody has
   chosen one yet". Pricing is open — platform.md §14 — so the plan screen
   prints XXX and a bar rather than guessing a number into existence. */
export const BILLING = { plan: null, price: 'XXX', renews: null, seats: 1 };

export const INVOICES = [
  { id: 'i1', when: '2026-09-01', amount: 'XXX', status: 'paid' },
  { id: 'i2', when: '2026-08-01', amount: 'XXX', status: 'paid' },
  { id: 'i3', when: '2026-07-01', amount: 'XXX', status: 'paid' },
  { id: 'i4', when: '2026-06-01', amount: 'XXX', status: 'paid' },
];

/* ── the narrowing round · platform.md §3.2 ──────────────────────────────────
   Five questions, and the five direction options at the narrowing step are
   OBSERVED OUTPUT from Innovue's own semantic surface, rendered as real words
   rather than bars. CLAUDE.md's scoped exception: observed is not invented, and
   they are nobody's client data. */
export const ROUND = [
  { q: 'Which part of a drone are you working on?',
    opts: ['Airframe and body structure', 'Flight control and avionics',
           'Propulsion and power', 'Payload and sensors', 'None of these'],
    pick: 0 },
  { q: 'What are you trying to improve about it?',
    opts: ['Weight', 'Cost to manufacture', 'Crash survivability',
           'Assembly time', 'Something else'],
    pick: 0 },
  { q: 'Is it flying already?',
    opts: ['A working prototype', 'A design on paper', 'Shipping to customers'],
    pick: 0 },
  { q: 'Have you filed anything?',
    opts: ['Nothing yet', 'A provisional', 'One or more granted'],
    pick: 0 },
  { q: 'Where does it need to be protected?',
    opts: ['United States', 'Taiwan', 'Both'],
    pick: 0 },
];

export const BUILD_STAGES = [
  'Reading your criteria',
  'Searching the Innovue database',
  'Merging duplicate filings across countries',
  'Grouping by technical approach',
  'Ranking against what you described',
  'Drawing your map',
];

/* ── the home surface ─────────────────────────────────────────────────────
   ILLUSTRATIVE, like every figure in this file. The dates are plausible and
   are nobody's published claim; what is real is the SHAPE — six jurisdictions
   by two document kinds is how the index is actually cut. */
export const FIELDS = [
  { id: 'semi',    label: 'Semiconductor devices',     icon: 'cpu',      ready: true  },
  { id: 'comms',   label: 'Digital communication',     icon: 'network',  ready: false },
  { id: 'compute', label: 'Computing & data',          icon: 'monitor',  ready: false },
  { id: 'energy',  label: 'Batteries & energy',        icon: 'battery',  ready: false },
  { id: 'medical', label: 'Medical diagnostics',       icon: 'stetho',   ready: false },
];

/* THE SENTENCE AND THE TABLE MUST AGREE, and on their surface they do not:
   the prose names four jurisdictions and the table lists six. Whichever is
   right, an interface that says both is telling the founder its own coverage
   is not known. Ours names what the table carries. */
export const COVERAGE_SCOPE =
  'Terrain currently covers semiconductor devices filed in the United States, '
  + 'China, Taiwan, Europe, Korea and Japan.';

export const COVERAGE = [
  { source: 'United States · granted',      updated: '2026-09-17' },
  { source: 'United States · applications', updated: '2026-09-17' },
  { source: 'China · granted',              updated: '2026-09-15' },
  { source: 'China · applications',         updated: '2026-09-15' },
  { source: 'Taiwan · granted',             updated: '2026-09-16' },
  { source: 'Taiwan · applications',        updated: '2026-09-16' },
  { source: 'Europe · granted',             updated: '2026-09-11' },
  { source: 'Europe · applications',        updated: '2026-09-11' },
  { source: 'Korea · granted',              updated: '2026-09-09' },
  { source: 'Korea · applications',         updated: '2026-09-09' },
  { source: 'Japan · granted',              updated: '2026-09-18' },
  { source: 'Japan · applications',         updated: '2026-09-18' },
];
