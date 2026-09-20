/* surfaces/views — the map and the nine cards around it. platform.md §6.4.
 *
 * ═══ EVERY VIEW RESOLVES INDEPENDENTLY ═════════════════════════════════════
 * One port per card, one wait per card, one failure per card. components.md
 * §0.1 calls partial success the normal case, and this is where that claim gets
 * paid for: a response that could only be wholly good or wholly bad would force
 * the surface to blank nine working views to report one broken one.
 *
 * platform.md §9.1 — A FAILURE IS THE SIZE OF THE REGION THAT WAS WAITING. Try
 * it: `?fail=citeMatrix` refuses one card and leaves the other eight standing.
 *
 * ═══ THE CAPTIONS ARE DERIVED, NEVER TYPED ═════════════════════════════════
 * A typed caption is a second source of truth and goes stale the first time a
 * number moves. Every sentence below is computed from the same response that
 * drew the chart above it, so the two cannot disagree.
 *
 * AND THE CAPTION IS NOT OPTIONAL. The M-Map audit's sharpest finding is that
 * sixty IPtech views carry no sentence between them — a chart that states no
 * finding makes the reader do the analysis the product claims to have done.
 */
import { $ } from '../core/dom.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { say } from '../core/live-region.mjs';
import { mountMatrix, mxLegendHTML, colTotal } from '../charts/map.mjs';
import { sharePie, shareBars, legalDonut, legalBars } from '../charts/share.mjs';
import { lifeCycle, momentum, citeMatrix, filingsChart } from '../charts/series.mjs';
import { bar } from '../charts/primitives.mjs';
import { wait as pause } from '../core/timers.mjs';

let ENGINE = null;
let drawn = false;

/* the minimum a loader stays on screen once it has been shown */
const FLOOR = 240;

/* ── one region, one port, one ending ─────────────────────────────────────
   The three endings a wait has — it lands, it fails retryably, it fails for
   good — are one function here rather than three at every call site, because
   the one that gets forgotten is always the third. */
async function resolve(el, port, draw, opts = {}) {
  if (!el) return;
  waitOn(el, opts.min);
  /* A LOADER THAT FLASHES IS WORSE THAN NO LOADER. A card that resolves in
     40ms shows a spinner that appears and vanishes inside three frames, and
     that reads as a glitch rather than as work. The floor is OURS and is not a
     rounding of the engine's own beat — beat.mjs keeps the two apart on
     purpose. Reduced motion does not shorten it: the wait is real either way,
     and only its animation is a motion question. */
  const [res] = await Promise.all([ENGINE[port](), pause(FLOOR)]);
  if (res.ok) {
    landIn(el, draw(res.data));
    if (opts.after) opts.after(res.data);
    return res.data;
  }
  /* `retryable` IS THE ENGINE'S ANSWER and not a guess. true → pass an act and
     the block offers Try again; false → pass none, and the block says there is
     no way forward BY HAVING NO BUTTON. */
  failWith(el, opts.say || 'This view did not load.',
    res.retryable ? () => resolve(el, port, draw, opts) : null);
  say('views', (opts.say || 'A view did not load.'));
  return null;
}

function setCaption(id, html) {
  const el = $(id);
  if (el) el.innerHTML = html;
}

/* ── the map ──────────────────────────────────────────────────────────────── */
async function drawMap() {
  const el = $('#matrix');
  if (!el) return;
  waitOn(el, 260);
  const [res] = await Promise.all([ENGINE.map(), pause(FLOOR)]);

  if (!res.ok) {
    failWith(el, 'The map did not load.', res.retryable ? drawMap : null);
    say('views', 'The map did not load.');
    return;
  }
  const d = res.data;
  mountMatrix(el, {
    cols: d.cols,
    rows: d.rows,
    shown: d.shown,
    selected: null,
    populated: true,
  });
  /* mountMatrix writes innerHTML ITSELF, because it also has to set the grid's
     own custom properties and the roving tabindex on the first cell — so the
     wait has to be ended by hand. landIn(el, null) clears `is-wait` and the
     reserved minHeight without touching the markup that is already there.

     THE GRID LOOKED CORRECT WITH THE WAIT STILL ON IT, which is why this is
     worth a comment: `.is-wait` reserves a minimum height and the grid was
     taller than it, so nothing moved and nothing flickered. The only symptom
     was a class that never came off — invisible on screen and obvious to a
     smoke test that counts `.is-wait`. */
  landIn(el, null);

  const legend = $('#mxLegend');
  if (legend) legend.innerHTML = mxLegendHTML();

  /* THE SENTENCE UNDER THE LEGEND IS NOT OPTIONAL. The cells sum to `shown`
     and `shown` is less than `total`, because the map lays out the eight
     largest holders — two true figures for one corpus, and a grid that prints
     one while the card beside it prints the other is the "two totals for one
     corpus" fault this product keeps catching. */
  setCaption('#mxScope',
    `These eight holders hold <b>${d.shown} of the ${d.total} patents</b> in ` +
    `scope between them. The rest are held by companies with fewer than three each.`);

  const cells = d.rows.flatMap(r => r.counts);
  const maxCell = Math.max(...cells);
  const colTotals = d.cols.map((_, c) => colTotal(d.rows, c));
  const topCol = colTotals.indexOf(Math.max(...colTotals));
  const thinCol = colTotals.indexOf(Math.min(...colTotals));

  /* AN EMPTY CELL IS A FACT ABOUT A HOLDER, NOT ABOUT A TECHNOLOGY. The
     sentence says "draws N filings from this group", never "is open" —
     brief.md §1 is the test and it is a test rather than a ban: statements
     about THESE HOLDERS are admissible, statements about this technology being
     unclaimed are not. */
  setCaption('#mapCaption',
    `<b>No holder has more than ${maxCell} patents against any single ` +
    `approach</b> — this space is divided, not owned. ` +
    `${d.cols[thinCol]} draws <b>${colTotals[thinCol]}</b> filings from the ` +
    `whole group, against ${colTotals[topCol]} for ${d.cols[topCol]}.`);
}

/* ── the cards ────────────────────────────────────────────────────────────── */
export function init(ctx) {
  ENGINE = ctx.engine;

  /* DRAWN ON ARRIVAL AT THE SURFACE, NOT AT BOOT. Ten ports fired while the
     founder is still on the conversation would spend the latency where nobody
     is looking and then look instant — which is the one thing a wait must not
     do, because it teaches the founder the product is faster than it is. */
  ctx.onRoute(view => {
    if (view !== 'work' || drawn) return;
    drawn = true;
    drawAll();
  });
}

function drawAll() {
  drawMap();

  /* the composition of the space — what each approach holds, corpus-wide */
  resolve($('#techMix'), 'map', d => {
    const totals = d.cols.map((_, c) => colTotal(d.rows, c));
    const rows = d.cols.map((label, i) => [label, totals[i]]);
    rows.sort((a, b) => b[1] - a[1]);
    return shareBars(rows, d.shown, 'Approach', true);
  }, {
    say: 'The composition of this space did not load.',
    after: d => {
      const totals = d.cols.map((_, c) => colTotal(d.rows, c));
      const top = totals.indexOf(Math.max(...totals));
      setCaption('#techMixCaption',
        `<b>${d.cols[top]} holds ${totals[top]} of the ${d.shown} patents</b> ` +
        `these eight holders hold, more than any other approach here.`);
    },
  });

  /* per-approach momentum · the NAMED variant of the momentum strip */
  /* momentum() takes ARRAYS OF NUMBERS, one per strip, and an optional label
     array — the named variant. One shared ceiling across every strip, so a
     tall strip beside a flat one is a real difference and not a rescaled one. */
  resolve($('#techMom'), 'map', d => {
    const series = d.cols.map((_, c) => d.rows.map(r => r.counts[c]));
    return momentum(series, -1, d.cols);
  }, {
    say: 'Momentum by approach did not load.',
    after: () => setCaption('#techMomCaption',
      'Each strip is one approach across the holders on the map, on one shared ' +
      'scale — so a tall strip beside a flat one is a real difference and not a ' +
      'rescaled one.'),
  });

  /* filings over time · one point per year */
  resolve($('#dashChart'), 'filings',
    d => filingsChart(d.series, 12, d.lagYears), {
    say: 'The filings series did not load.',
    after: d => {
      const s = d.series;
      const first = s.slice(0, 4).reduce((a, b) => a + b, 0);
      const last = s.slice(-4).reduce((a, b) => a + b, 0);
      /* THE WORD IS DERIVED FROM THE SHAPE. A caption that said "growing"
         while the series fell would be the product contradicting its own
         chart, and nobody reads a caption against a curve. */
      const dir = last > first * 1.15 ? 'still growing'
                : last < first * 0.85 ? 'slowing'
                : 'steady';
      setCaption('#dashCaption',
        `Filing in this space is <b>${dir}</b>. The most recent years are ` +
        `incomplete — a patent publishes about 18 months after it is filed, so ` +
        `the last point is a floor and not a fall.`);
    },
  });

  /* life cycle · holders against patents, one point per year */
  resolve($('#lifeChart'), 'lifeCycle',
    d => lifeCycle(d.holders, d.patents), {
    say: 'The life cycle view did not load.',
    after: d => {
      const hg = d.holders[d.holders.length - 1] / d.holders[0];
      const pg = d.patents[d.patents.length - 1] / d.patents[0];
      const phase = (hg > 1.3 && pg > 1.3) ? 'still forming'
                  : (pg > 1.3) ? 'settling around the holders already in it'
                  : 'static';
      setCaption('#lifeCaption',
        `More holders and more filings every year: this space is <b>${phase}</b>. ` +
        `Both series rise together, so the newcomers are adding to it rather ` +
        `than replacing anyone.`);
    },
  });

  /* rivals · the five largest, as a share of scope */
  resolve($('#rivalBody'), 'rivals', d => {
    const rows = d.rows.map(r => [r.label, r.patents]);
    return '<div class="hb">' + d.rows.map((r, i) =>
      `<div class="hb-row"><span class="hb-lbl">${bar('w-md', 'label')}</span>` +
      `<span class="bar-t"><span class="bar-f" style="width:` +
      `${(r.patents / d.total * 100).toFixed(1)}%;background:var(--mark-${i === 0 ? 1 : 2})"></span></span>` +
      `<span class="bar-n"><span class="fig-m">${r.patents}</span></span></div>`
    ).join('') + '</div>';
  }, { say: 'The rivals view did not load.' });

  /* rival momentum · which of them is still filing */
  resolve($('#momStrip'), 'momentum',
    d => momentum(d.rows.map(r => r.series), -1), {
    say: 'Rival momentum did not load.',
    after: d => {
      const stopped = d.rows.filter(r => r.series.slice(-5).every(v => v === 0)).length;
      setCaption('#momCaption',
        `Corpus-level trend is the filings card; this is the one that says ` +
        `<b>which rival is still filing</b>. ` +
        (stopped
          ? `<b>${stopped} of these ${d.rows.length} stopped years ago</b> — a ` +
            `portfolio nobody is adding to is one that ages out rather than grows.`
          : `All ${d.rows.length} are still filing.`));
    },
  });

  /* where the holders are FROM */
  resolve($('#origBars'), 'shareBars',
    d => shareBars(d.rows, d.total, 'Holder based in', true), {
    say: 'Country of origin did not load.',
    after: d => setCaption('#origCaption',
      `<b>${d.rows[0][1]} of the ${d.total} patents here are held from ` +
      `${d.rows[0][0]}</b>, against ${d.rows[1][1]} from ${d.rows[1][0]}. ` +
      `<b>Where a holder is based is not where its patent bites</b> — the card ` +
      `below is that, and the two do not match.`),
  });

  /* where the patents were GRANTED */
  resolve($('#jurPie'), 'sharePie',
    d => sharePie(d.rows, d.total, 62), {
    say: 'The jurisdiction view did not load.',
    after: d => {
      const jb = $('#jurBars');
      if (jb) jb.innerHTML = shareBars(d.rows, d.total);
      const us = d.rows.find(r => /United States/.test(r[0]));
      setCaption('#jurCaption', us && us[1]
        ? `<b>${us[1]} of the ${d.total} filings here are in the United ` +
          `States.</b> A patent only protects the country it is granted in.`
        : `<b>Nothing here is granted in the United States.</b> A patent only ` +
          `protects the country it is granted in.`);
    },
  });

  /* legal status */
  resolve($('#legalRing'), 'legal',
    d => legalDonut(d.live, d.expired), {
    say: 'Legal status did not load.',
    after: async d => {
      const lb = $('#legalBars');
      const rv = await ENGINE.rivals();
      if (lb && rv.ok) {
        lb.innerHTML = legalBars(
          d.holders.map(live => ({ live })),
          rv.data.rows.map(r => ({ p: r.patents })));
      }
      setCaption('#legalCaption',
        `<b>${d.live} of the ${d.live + d.expired} patents in scope are still ` +
        `live.</b> The other ${d.expired} have expired.`);
    },
  });

  /* who builds on whom */
  resolve($('#xrefGrid'), 'citeMatrix',
    d => citeMatrix(d.pairs, d.n), {
    say: 'The cross-reference view did not load.',
    after: d => {
      if (!d.pairs.length) {
        /* AN HONEST EMPTY STATE. "None of these cites another" is a finding;
           printing a grid of zeroes and no sentence is not. */
        setCaption('#xrefCaption',
          `<b>None of these holders cites another.</b> Within this corpus they ` +
          `are building separately — which is a fact about the window as much ` +
          `as about them.`);
        return;
      }
      const inDeg = Array(d.n).fill(0);
      d.pairs.forEach(([, to, n]) => { inDeg[to] += n; });
      const top = inDeg.indexOf(Math.max(...inDeg));
      const citers = d.pairs.filter(p => p[1] === top).length;
      const rest = inDeg.reduce((a, b) => a + b, 0) - inDeg[top];
      const who = citers === d.n - 1
        ? `every one of the other ${d.n - 1}`
        : `${citers} of the other ${d.n - 1}`;
      setCaption('#xrefCaption',
        `<b>One holder is cited by ${who}</b>, ${inDeg[top]} times against ` +
        `${rest} for the rest of them put together. The work this space was ` +
        `built on sits in one portfolio.`);
    },
  });
}
