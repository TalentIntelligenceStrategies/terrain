/* ports — the engine contract, as code.
 *
 * WHAT THIS FILE IS. design/components.md §1 is a table of what each component
 * needs from the engine. This is that table made executable: one named port
 * per data-bearing row, a typedef for each shape, and a NullEngine that
 * implements every one of them by refusing. It is the seam an engine team
 * builds against, and it is the reason app/js/** can hold no data.
 *
 * ═══ THE ONE ENVELOPE ═══════════════════════════════════════════════════════
 * Every port resolves to { ok:true, data } or { ok:false, code, retryable }.
 * That is components.md §0.1 made executable, and each clause of it is load
 * bearing:
 *
 *   A FAILURE IS A RESPONSE AND IS NOT THE SAME AS AN EMPTY ONE. "No patents
 *   matched" is an answer; "the search did not run" is not. A component that
 *   cannot tell them apart renders "nothing found" over an outage, which is
 *   the one wrong thing it can say. An empty array is not a failure signal.
 *
 *   PARTIAL SUCCESS IS THE NORMAL CASE. The views resolve independently and
 *   each arrives when its own data lands, so one view failing while the others
 *   succeed is ordinary. That is why every view is its own port rather than
 *   one call returning everything: a response that can only be wholly good or
 *   wholly bad forces the surface to blank nine working views to report one
 *   broken one.
 *
 *   THE REASON IS MACHINE-READABLE; THE SENTENCE IS OURS. `code` is for our
 *   logs and for choosing which sentence to print. NEVER return prose intended
 *   for display: our copy states the fix rather than the fault and does it in
 *   our own voice, and an engine cannot know either. A message we did not
 *   write is a message that cannot be made true of our interface.
 *
 *   `retryable` IS PART OF THE ANSWER, not a guess the client makes. It is
 *   exactly what core/wait.mjs's failHTML(say, act) consumes: retryable true
 *   means pass an `act` and the block offers `Try again`; false means pass
 *   none, and the block says there is no way forward BY HAVING NO BUTTON.
 *   Guessing wrong in either direction wastes the founder's time or hides
 *   their way out.
 *
 *   A RUN THAT DID NOT FINISH IS NOT A RUN THAT WAS CHARGED. The meter returns
 *   to where it was, so the ledger behind these has to distinguish an
 *   attempted run from a completed one.
 *
 * ═══ null MEANS RENDER THE SKELETON BAR ═════════════════════════════════════
 * AND IT IS THE ONLY THING THAT MEANS THAT. components.md already uses this
 * device once, for the map's holders; here it is a system rule. Four things
 * follow, and the fourth is the one that matters most:
 *
 *   · Width strings and label arrays leave the data entirely. Version history
 *     stops being three CSS width-class strings and becomes the contract's
 *     shape.
 *   · The skeleton contract becomes greppable: one rule, one meaning.
 *   · A real engine returning real names changes NOTHING but the presence of a
 *     value. No renderer branches on "is this demo data".
 *   · `null` and `'XXX'` stay distinct. They are two different refusals —
 *     "this value exists and we decline to print it" versus "nobody has chosen
 *     one yet" — and they render through two different code paths on purpose.
 *
 * ═══ AND THE FAKE ENGINE BENDS TOWARD THIS, NEVER THE REVERSE ═══════════════
 * Never bend a component toward the demo data's shape. demo/ is deletable by
 * construction and app/js/** is the contract; a component shaped around the
 * fake engine is a component that breaks against the real one.
 */

/** @typedef {{ok:true, data:any}} Ok */
/** @typedef {{ok:false, code:string, retryable:boolean, detail?:any}} Err */
/** @typedef {Ok|Err} Result */

export const ok  = data => ({ ok: true, data });
export const err = (code, retryable = false, detail) =>
  ({ ok: false, code, retryable, detail });

/* The codes the surface knows how to speak. An engine may return others; the
 * surface treats an unknown code as UNAVAILABLE and logs the original, because
 * a sentence we did not write is worse than a general one we did. */
export const CODE = {
  UNAVAILABLE:   'UNAVAILABLE',    // transient. retryable
  TIMEOUT:       'TIMEOUT',        // transient. retryable
  RATE_LIMITED:  'RATE_LIMITED',   // transient. retryable
  NO_CORPUS:     'NO_CORPUS',      // permanent for these criteria. NOT retryable
  NOT_FOUND:     'NOT_FOUND',      // permanent. NOT retryable
  UNSUPPORTED:   'UNSUPPORTED',    // permanent. NOT retryable
  INSUFFICIENT:  'INSUFFICIENT',   // not enough points. NOT retryable — a different route
};

/* ─────────────────────────────────────────────────────────────────────────
 * THE SHAPES. Field names are ours and illustrative; the SHAPE is the claim.
 * Each names the components.md row it comes from.
 * ───────────────────────────────────────────────────────────────────────── */

/** @typedef {{id:string, label:string|null}} Labelled — label null renders a bar */

/** The map's axes · `{approaches, holders}`. holders carry NO label, by decision:
 *  a holder name is a field nothing may print, so it is absent rather than nulled
 *  at every call site. */
/** @typedef {{approaches:Labelled[], holders:{id:string}[]}} Axes */

/** The map · one count per intersection, family-merged. `shown` is what the cells
 *  sum to and is always less than `total`, because the map lays out the eight
 *  largest holders. Density tone is derived CLIENT-SIDE relative to the view's own
 *  maximum, so no tone or threshold is ever sent. */
/** @typedef {{cols:string[], rows:{label:null, counts:number[], rising?:number[]}[],
 *             total:number, shown:number}} MapData */

/** The list · FOUR FIELDS PER ROW AND NO MORE, plus the score and the id the client
 *  keys on. `order` is a first-class field and not an array index — rows are keyed
 *  by patent, and the FLIP, the rail, the focus return and the reversal all resolve
 *  through that key. `matched` and `patents.length` differ by what was binned, and
 *  printing the wrong one beneath the standing chip is a recorded regression. */
/** @typedef {{id:string, skim:string|null, holder:string|null, year:number|null,
 *             status:'live'|'expired'|'pending'|null, score:number|null}} PatentRow */
/** @typedef {{patents:PatentRow[], order:string[], matched:number}} PatentSet */

/** The record · the title, eleven identifiers, the abstract, and the claim set AS
 *  PUBLISHED. `claims` is an ARRAY, one entry per claim, never one blob: a patent
 *  numbers its claims and counsel is pointed at claim 4 by number. Nothing here may
 *  arrive INTERPRETED — no highlight offsets, no decode.
 *
 *  `title` WAS MISSING FROM THIS TYPEDEF AND THE RECORD PANE DRAWS IT. The list row
 *  carries `skim` and the pane carries `title`, and they are the same string for the
 *  same patent — but the pane receives a record and never an index, so it cannot
 *  reach the row's copy. Found by building app/: the pane rendered a skeleton where
 *  the prototype prints a title, and the only reason nothing looked broken is that a
 *  bar is what every OTHER record draws there.
 *
 *  It is `string|null` like every other identity-shaped field, and null means the
 *  bar — a patent whose title we decline to print is the ordinary case, not an
 *  error. */
/** @typedef {{title:string|null, number:string|null, appno:string|null, kind:string|null,
 *             ipcMain:string|null, ipc:string[]|null, holder:string|null,
 *             inventors:string[]|null, filed:string|null, published:string|null,
 *             where:string|null, status:string|null, abstract:string|null,
 *             claims:string[]|null}} Record */

/* ─────────────────────────────────────────────────────────────────────────
 * THE PORTS. One per data-bearing row of components.md §1, named after it.
 * Every one returns Promise<Result>.
 * ───────────────────────────────────────────────────────────────────────── */
export const PORTS = [
  /* the conversation and the gate */
  'read',            // a sentence, a number, a company or a code → a reading
  'narrow',          // the five questions' options for this reading
  'approve',         // the gate. CHARGED HERE, not at the end — §9.2

  /* the build */
  'buildProgress',   // a STAGE STREAM, not a percentage
  'axes',            // → Axes
  'map',             // → MapData
  'mapRising',       // the same grid over two time windows
  'rivals',
  'filings',
  'lineage',
  'sharePie',
  'holderBars',
  'shareBars',
  'citeMatrix',
  'lifeCycle',
  'momentum',

  /* the list. ALL THREE ARE REQUESTS — twenty rows arrive at a time, so the
     client never holds the whole set and sorting what it has would sort a page
     rather than a result. Both wait, both can fail, neither spends points. */
  'patents',         // → PatentSet
  'patentsPage',     // Show more
  'sort',            // {sort:'relevance'|'newest'|'oldest'} → PatentSet
  'facets',          // {facets:{status,kind}} → PatentSet
  'rerank',          // {anchors:[id]} → {order:[id]} over the SAME set

  /* the record */
  'record',          // → Record

  /* projects and versions */
  'projects',
  'versions',
  'revert',

  /* the destinations */
  'points',
  'runs',
  'account',
  'saveAccount',
  'billing',
  'invoices',
  'sendSupport',
];

/**
 * NullEngine — every port, implemented by refusing.
 *
 * NOT A STUB AND NOT A MOCK. It is what `app/` runs against when `demo/` is
 * deleted, and that is the point: deleting the demo has to leave a product
 * that says "this did not run" on every surface, rather than one that throws.
 * It is also the check that no component secretly requires data to render its
 * chrome — a surface that cannot draw itself against this is a surface that
 * cannot draw its own failure state either.
 *
 * `retryable:true` because UNAVAILABLE is transient by definition, so every
 * region shows its retry affordance and the whole failure vocabulary is
 * exercised by running with no engine at all.
 */
export const NullEngine = Object.freeze(
  Object.fromEntries(PORTS.map(name => [
    name,
    async () => err(CODE.UNAVAILABLE, true, `NullEngine: ${name} is not wired to anything`),
  ]))
);

/**
 * Refuse an engine that is missing a port, at mount rather than at first use.
 *
 * A MISSING PORT IS OTHERWISE A TypeError AT THE MOMENT A FOUNDER PRESSES
 * SOMETHING, several surfaces into the product, and it reads as that surface
 * being broken rather than as the engine being incomplete.
 */
export function assertEngine(engine) {
  const missing = PORTS.filter(p => typeof engine?.[p] !== 'function');
  if (missing.length) {
    throw new Error(
      `engine is missing ${missing.length} port(s): ${missing.join(', ')}. ` +
      `Every port in ports.mjs is named after a data-bearing row of ` +
      `design/components.md §1; an engine that cannot answer one has to say so ` +
      `with { ok:false, code, retryable } rather than by not being there.`);
  }
  return engine;
}
