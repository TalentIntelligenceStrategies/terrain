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
 * platform.md §11's invariants and re-deriving them would mean re-deriving the
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

/* JURISDICTION WENT WITH sharePie. The demo's own split fed a chart that is
   not in the product; corpus/ keeps its copy because a dead port there still
   reads it. */

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
    /* ALL FOUR STATUS WORDS APPEAR IN THE DEMO, because a vocabulary the
       demo never renders is a vocabulary nobody looks at. Real data carries
       roughly half live, a quarter expired, a tenth pending and a handful
       abandoned; these proportions are that shape and are illustrative like
       every other figure here. */
    status: n % 13 === 4 ? 'pending'
          : n % 17 === 9 ? 'abandoned'
          : (n % 7 === 3 || n % 11 === 6) ? 'expired'
          : 'live',
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
         record it opens is the same one. Everything else is a bar.

         `number` AND `where` FOLLOW THE SAME RULE, and they are here because the
         export writes them. A withheld number is null and leaves an empty cell,
         which is what null means everywhere else; it is NOT the id wearing a
         different column heading. */
      skim: i === 0 ? DEMO_TITLE : null,
      holder: i === 0 ? DEMO_HOLDER : null,
      number: i === 0 ? DEMO_RECORD.number : null,
      where: i === 0 ? DEMO_RECORD.where : null,
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
      /* THE ROW'S DRAWINGS, AND THE SAME TWO ABSENCES THE RECORD USES. The
         demonstration row HAS drawings and Terrain declines to print them, so
         four withheld frames; every other row has none at all, so an empty
         array and no strip.

         SIX, AND IT MATCHES recordFor's SIX AGAIN. It was four, because the
         row drew a fixed four-up grid; the strip scrolls now and caps at
         twelve, so the row can carry everything this patent has. Six frames
         is also the only way to see the strip scroll at all in the demo,
         which is the state it exists to show.

         A DEMO DRAWING COULD NOT BE INVENTED HERE. The argument is written out
         at recordFor below and it holds identically on the row: .gitignore
         refuses a raster wholesale, so a demo drawing would have to be inline
         SVG somebody drew — an invented technical drawing presented as a
         patent's own. A frame invents nothing. */
      thumbs: i === 0
        ? [1, 2, 3, 4, 5, 6].map(n => ({ n, src: null, alt: null }))
        : [],
      /* ══ THE FIELDS THE ROW GAINED, AND ALL BUT ONE ARE BARS ═══════════
         §8 is unambiguous about every one of them: inventors are a party,
         IPC symbols are an identifier, and a party or an identifier we do
         not hold is a bar rather than a plausible string. Inventing
         "Dr. A. Chen" here would read as a live example; transliterating a
         real one would be fabrication. Both are worse than a bar.

         `abstract` IS A BAR FOR A DIFFERENT REASON and it is worth saying
         which. It is not a party — it is the patent's own prose, and there
         is no way to write three lines of plausible patent abstract that is
         not simply an invented patent. The record has barred it since it was
         built; the row follows the record.

         THE DATES AND THE COUNT ARE ILLUSTRATIVE, which is the third column
         of §8's table — they are figures, they are derived from the seed like
         `year` and `score` above, and no number here is a real filing date.

         `figs` AGREES WITH `thumbs` ON THE DEMONSTRATION ROW and is null
         everywhere else. Six withheld frames and `figs: 6` is a patent whose
         drawings we hold and decline to show; `figs: null` beside `thumbs: []`
         is a patent with no drawings at all. The two absences must not
         collapse, on the row exactly as in the record. */
      inventors: null,
      abstract: null,
      ipcMain: null,
      kind: i === 0 ? DEMO_RECORD.kind : null,
      /* SEEDED FROM THE ROW'S OWN YEAR, not read off DEMO_RECORD, which
         carries no dates — a `DEMO_RECORD.filed` would have been `undefined`
         rather than `null`, and undefined is not a value the skeleton contract
         has a word for. It renders neither prose nor a bar; it renders
         "undefined". Filed two years before publication, which is the ordinary
         shape and is illustrative like every other figure here. */
      filed: (s.year - 2) + '-03-12',
      published: s.year + '-05-10',
      figs: i === 0 ? 6 : null,
    });
  }
  return out;
}

/* ── the grouping · platform.md §4.4 ──────────────────────────────────────
   TWO LEVELS, AND THE LEAVES PARTITION THE SET EXHAUSTIVELY. That is the
   contract the panel is built on: selecting a leaf filters the list to
   `ids`, so a patent in no leaf would be unreachable through the panel while
   still sitting in the list, and a patent in two would be counted twice by
   the chip above the results.

   The vocabulary is drone airframe engineering, which is this demo's own
   invented domain and nobody's client data. Real branches would come from the
   engine over the real set; these are the SHAPE, illustrative like every other
   figure here.

   THE LEAF OWNS THE MEMBERSHIP AND EMITS ONLY A COUNT. The client holds one
   page and never the whole set, so a leaf that listed its patents would list
   ones the list does not have. `leafIds` below is what the engine filters
   with; `n` is what the panel prints. */
const SPINES = [
  ['Airframe structure', [
    'Folding arm and hinge', 'Monocoque and shell', 'Boom and truss', 'Landing gear']],
  ['Propulsion and lift', [
    'Rotor and propeller', 'Motor mounting', 'Ducted and shrouded', 'Tilt and transition']],
  ['Power and thermal', [
    'Battery housing', 'Thermal path', 'Power distribution']],
  ['Control and sensing', [
    'Flight control', 'Obstacle sensing', 'Payload gimbal']],
];

export function clusterFor(ids) {
  /* Below a floor there is no structure to show, and the panel says so rather
     than drawing two branches and implying one. Three patents in fourteen
     leaves is noise wearing the shape of a taxonomy. */
  if (ids.length < 12) return { tree: { head: DEMO_IDEA, spines: [] }, members: new Map() };

  const leaves = [];
  SPINES.forEach(([spine, names], si) =>
    names.forEach((label, li) => leaves.push({ spine, si, label, id: 's' + si + 'l' + li, ids: [] })));

  /* DEALT ROUND ROBIN OFF A STABLE HASH so the same patent lands in the same
     leaf on every render, and every leaf that exists has at least one patent —
     an empty branch is a claim that a category was considered and came back
     with nothing, which is exactly the finding this panel does not state. */
  ids.forEach((id, i) => {
    const n = Number(String(id).replace(/\D/g, '')) || i;
    leaves[(n * 7 + (n % 5)) % leaves.length].ids.push(id);
  });

  return {
    tree: {
      head: DEMO_IDEA,
      spines: SPINES.map(([label], si) => ({
        label,
        leaves: leaves.filter(l => l.si === si && l.ids.length)
                      .map(({ id, label, ids }) => ({ id, label, n: ids.length })),
      })).filter(sp => sp.leaves.length),
    },
    /* the engine's own half: leaf id -> the patents in it */
    members: new Map(leaves.map(l => [l.id, l.ids])),
  };
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
         all, and a row of grey rectangles would claim it does. corpus/ is what
         runs by default when it is on disk, and there they are real. */
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

/* THREE RUN TYPES, BECAUSE THERE ARE THREE. platform.md §6.1 lists what
   exists; `Rebuild after a scope change` was the gate's re-run and `Watch` is
   filing alerts, which §10 item 1 says are not built. A price beside a run the
   product cannot perform is the same defect as a switch for a capability that
   does not exist — design-language.md §7 — and this one also lands on the page
   whose whole job is telling the founder what they are paying for.

   THE FIGURES ARE ILLUSTRATIVE and pricing is unsettled; §6.1 says so. */
export const RUN_TYPES = [
  { id: 'search', label: 'New search', cost: 40 },
  { id: 'rerank', label: 'Find similar', cost: 4 },
  { id: 'export', label: 'Export', cost: 8 },
];

export const RUNS = [
  { id: 'r1', kind: 'New search', project: null, when: '2026-09-14', cost: 40 },
  { id: 'r2', kind: 'Find similar', project: null, when: '2026-09-14', cost: 4 },
  { id: 'r3', kind: 'Export', project: null, when: '2026-09-12', cost: 8 },
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
   chosen one yet". Pricing is open — platform.md §12 — so the plan screen
   prints XXX and a bar rather than guessing a number into existence. */
export const BILLING = { plan: null, price: 'XXX', renews: null, seats: 1 };

export const INVOICES = [
  { id: 'i1', when: '2026-09-01', amount: 'XXX', status: 'paid' },
  { id: 'i2', when: '2026-08-01', amount: 'XXX', status: 'paid' },
  { id: 'i3', when: '2026-07-01', amount: 'XXX', status: 'paid' },
  { id: 'i4', when: '2026-06-01', amount: 'XXX', status: 'paid' },
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
