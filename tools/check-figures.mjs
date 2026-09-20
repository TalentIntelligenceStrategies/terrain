/* ═══ THE ARITHMETIC GATE ═══════════════════════════════════════════════════
   READ-ONLY. Parses SETS.illustrative, JUR and PG_FILINGS out of the prototype
   and asserts platform.md §13's invariants.

   WHY THIS EXISTS
     §13's own header says "Nothing checks these automatically", and the
     prototype's comment at 6493 says the arithmetic was "checked by hand
     because the build that used to check it is gone." This brings it back. A
     pass that changes one figure has to carry the rest, and the failure mode is
     silent: every one of these numbers renders as a plausible integer whether
     or not it agrees with the four other places the same corpus is counted.

   WHAT IT READS
     The object literal, by brace matching, evaluated in an isolated VM context
     with no globals. It does not execute the prototype and it does not need a
     browser — which is what lets it run in CI beside check-app.py and
     sync-tokens.py --check.

   Usage:  node tools/check-figures.mjs [path]
   ───────────────────────────────────────────────────────────────────────── */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const file = process.argv[2] || join(root, 'design/previews/terrain-prototype.html');
const src = readFileSync(file, 'utf8');

/* ── extraction ────────────────────────────────────────────────────────────
   Balanced-delimiter scan from the assignment. String- and comment-aware,
   because the prototype's data carries both — a naive brace count walks off
   the end at the first `{` inside a comment. */
function literalAfter(marker, open, close){
  const at = src.indexOf(marker);
  if (at < 0) throw new Error(`could not find ${JSON.stringify(marker)} in ${file}`);
  let i = src.indexOf(open, at);
  if (i < 0) throw new Error(`no ${open} after ${marker}`);
  const start = i;
  let depth = 0, inStr = null, inLine = false, inBlock = false;
  for (; i < src.length; i++){
    const c = src[i], n = src[i + 1];
    if (inLine){ if (c === '\n') inLine = false; continue; }
    if (inBlock){ if (c === '*' && n === '/'){ inBlock = false; i++; } continue; }
    if (inStr){
      if (c === '\\'){ i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '/' && n === '/'){ inLine = true; i++; continue; }
    if (c === '/' && n === '*'){ inBlock = true; i++; continue; }
    if (c === '"' || c === "'"){ inStr = c; continue; }
    if (c === open) depth++;
    else if (c === close){ depth--; if (!depth) return src.slice(start, i + 1); }
  }
  throw new Error(`unbalanced ${open}${close} after ${marker}`);
}

const ctx = vm.createContext(Object.create(null));
const evalLiteral = (text, what) => {
  try { return vm.runInContext('(' + text + ')', ctx, { timeout: 2000 }); }
  catch (e){ throw new Error(`could not evaluate ${what}: ${e.message}`); }
};

const D    = evalLiteral(literalAfter('SETS.illustrative = ', '{', '}'), 'SETS.illustrative');
const JUR  = evalLiteral(literalAfter('var JUR = DATA.populated', '[', ']'), 'JUR');
const PGF  = evalLiteral(literalAfter('var PG_FILINGS = ', '[', ']'), 'PG_FILINGS');

const sum = a => a.reduce((t, v) => t + v, 0);

let bad = 0, warn = 0;
function check(id, rule, ok, detail){
  if (ok){ console.log(`  ok   ${id.padEnd(5)} ${rule}${detail ? ' — ' + detail : ''}`); }
  else { bad++; console.log(`  FAIL ${id.padEnd(5)} ${rule}${detail ? ' — ' + detail : ''}`); }
}
function note(id, rule, detail){
  warn++; console.log(`  note ${id.padEnd(5)} ${rule}${detail ? ' — ' + detail : ''}`);
}

/* ── the ledger ────────────────────────────────────────────────────────────
   Every one of these is a sentence in platform.md §13 or a shape
   design/components.md §1 fixes. Nothing here is invented for the gate. */

const cells = D.holderRows.map(r => sum(r.n));
const shown = sum(cells);

check('I1', 'matrix cells sum to shown; shown < total; eight holder rows',
  shown === D.holderShown && D.holderShown < D.total && D.holderRows.length === 8,
  `cells ${shown}, shown ${D.holderShown}, total ${D.total}, rows ${D.holderRows.length}`);

/* §8 makes holder names bars, and components.md §1 gives the map's holders no
   label field at all — "a name would be a field nothing may print". */
check('I1b', 'no holder row carries a name',
  D.holderRows.every(r => r.t === null), 'every t is null');

check('I2', 'every per-holder series sums to that holder\'s patent count',
  D.rivals.every((rv, i) => sum(D.perHolder[i]) === rv.p && cells[i] === rv.p),
  D.rivals.map((rv, i) => `${cells[i]}/${sum(D.perHolder[i])}/${rv.p}`).join(' '));

/* §3.7 allows three encoded values and a fourth folds into Other; barStyle()
   has exactly three marks, so a fourth row draws identically to the second. */
check('I3', 'country of origin sums to total, exactly three rows',
  sum(D.origin.map(o => o[1])) === D.total && D.origin.length === 3,
  `${sum(D.origin.map(o => o[1]))} of ${D.total} in ${D.origin.length} rows`);

check('I4', 'live + expired equals the total; each holder\'s split sits inside it',
  D.legal.live + D.legal.expired === D.total &&
  D.legal.holders.every((h, i) => h.live <= D.rivals[i].p),
  `${D.legal.live} + ${D.legal.expired} = ${D.legal.live + D.legal.expired}`);

check('I5', 'jurisdiction sums to total, three rows, the tracked entity first',
  sum(JUR.map(j => j[1])) === D.total && JUR.length === 3 &&
  /United States/.test(JUR[0][0]),
  `${sum(JUR.map(j => j[1]))} of ${D.total}, first "${JUR[0][0]}"`);

/* the finding has to quote the true maximum cell on the grid it describes.
   Checked as a standalone integer rather than as an exact fragment, because
   how the sentence wraps the number is the writer's business and which number
   it is is not. */
const gridMax = Math.max(...D.holderRows.flatMap(r => r.n));
const colMax  = Math.max(...D.colPatents);
const mentions = (text, n) => new RegExp(`(^|[^\\d])${n}([^\\d]|$)`).test(text);
check('I6a', 'the holder finding quotes the true maximum cell',
  mentions(D.holderFinding, gridMax), `grid max ${gridMax}`);
check('I6b', 'the composition finding quotes the true maximum column',
  mentions(D.finding, colMax), `column max ${colMax}`);

check('C1', 'each colYears row sums to its colPatents entry',
  D.colYears.every((row, i) => sum(row) === D.colPatents[i]),
  D.colYears.map((r, i) => `${sum(r)}/${D.colPatents[i]}`).join(' '));

check('C1b', 'colPatents sums to the corpus total',
  sum(D.colPatents) === D.total, `${sum(D.colPatents)} of ${D.total}`);

check('C2', 'each holder column sits inside its technology\'s own total',
  D.colPatents.every((cp, c) => sum(D.holderRows.map(r => r.n[c])) <= cp),
  D.colPatents.map((cp, c) => `${sum(D.holderRows.map(r => r.n[c]))}<=${cp}`).join(' '));

check('C4', 'lifecycle is twelve long, so PG_FILINGS.slice() takes the whole array',
  D.lifecycle.length === 12 && PGF.length === 12,
  `lifecycle ${D.lifecycle.length}, filings ${PGF.length}`);

/* the outcome grid is retained and read by nothing, but its own arithmetic is
   written down in the comment above it, so it is checked rather than trusted */
if (D.outcomeRows){
  check('C5', 'the retained outcome grid still sums to the total',
    sum(D.outcomeRows.map(r => sum(r.n))) === D.total,
    `${sum(D.outcomeRows.map(r => sum(r.n)))} of ${D.total}`);
}

/* ── C6, AND WHY IT IS A NOTE AND NOT A GATE ───────────────────────────────
   It is tempting to assert sum(PG_FILINGS) === total. IT IS NOT AN INVARIANT
   OF THIS PROTOTYPE, and asserting it would break a publish over a decision
   rather than over a defect.

   design-language.md §8 names the filings series as one of the skeleton
   contract's two exceptions: the chart draws a curve so the three-layer
   grammar is visible at all, BOTH AXES STAY BARS, and no number is ever
   printed. The prototype says so itself at 8635. A series whose values are
   never printed as counts is a SHAPE, and requiring a shape to sum to the
   corpus is imposing an invariant the design deliberately avoids.

   It is still worth printing, because the two are read together on the life
   cycle card — holders per year against filings per year — and a reader taking
   that pair as corpus-scoped is reading one axis at a scale the other does not
   use. Reported, not enforced — the note is the finding, and the decision about
   whether the two cards should share a scale is a §-level one, not a gate's. */
if (sum(PGF) !== D.total){
  note('C6', 'the filings series does not sum to the corpus total',
    `${sum(PGF)} against ${D.total} — a shape, not counts (§8). Not a failure.`);
}

console.log('');
if (bad){
  console.log(`  ${bad} invariant(s) FAILED in ${file}`);
  console.log('  platform.md §13: a pass that changes one figure has to carry the rest.');
  process.exit(1);
}
console.log(`  all invariants hold${warn ? `, ${warn} note(s) above` : ''}`);
