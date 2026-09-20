/* charts/series — the time forms: filings, life cycle, momentum, cross-reference.
 *
 * EXTRACTED from the prototype.
 *
 * NOTHING LABELS MORE THAN THE ENDPOINTS AND THE EXTREME. IPtech prints a
 * number on every point of every trend chart — forty labels on a forty-year
 * series — and the audit names that as the anti-pattern it is. The table and
 * the tooltip carry the rest, and every card states its finding in a sentence,
 * because the audit's sharpest finding is that sixty IPtech views carry none.
 */
import { band } from './primitives.mjs';
import { esc } from '../core/dom.mjs';


/* Life cycle · Patent Count > Patent Count - Life Cycle.
   IPtech draws ~50 labelled, self-crossing points and its own screen index
   calls the result near-unreadable; platform.md §11 read that and concluded
   the finding should be a SENTENCE and not a chart at all. This reverses that,
   and the reason is narrow: the objection was to fifty labels on a crossing
   trajectory, not to the form. Twelve points, three labelled, no crossings —
   because both series rise together — is a different object. The sentence stays
   too; it is the caption. */
export function lifeCycle(holders, patents){
  /* THE VIEWBOX IS THE RENDER WIDTH, and that is the whole reason for these
     numbers. At 520 wide the card scaled the svg ~2x and every 11px label came
     out at 21px — the chart read as a poster. A viewBox that matches the space
     it lands in makes svg units CSS pixels, so 11px text is 11px text. */
  var W = 1000, H = 300, L = 52, R = 20, T = 22, B = 46;
  var hx = Math.max.apply(null, holders), py = Math.max.apply(null, patents);
  var nx = Math.ceil(hx / 5) * 5, ny = Math.ceil(py / 10) * 10;
  var X = function(v){ return L + (v / nx) * (W - L - R); };
  var Y = function(v){ return H - B - (v / ny) * (H - T - B); };
  var pts = holders.map(function(h, i){ return [X(h), Y(patents[i])]; });

  var grid = '', i;
  for (i = 0; i <= 4; i++){
    var gy = T + (H - T - B) * i / 4;
    grid += '<line x1="' + L + '" y1="' + gy.toFixed(1) + '" x2="' + (W - R)
          + '" y2="' + gy.toFixed(1) + '"/>';
  }
  var ticks = '';
  for (i = 0; i <= 4; i++){
    var ty = T + (H - T - B) * i / 4, tv = Math.round(ny * (1 - i / 4));
    ticks += '<text x="' + (L - 10) + '" y="' + (ty + 4).toFixed(1)
           + '" text-anchor="end">' + tv + '</text>';
  }
  for (i = 0; i <= 4; i++){
    var tx = L + (W - L - R) * i / 4, xv = Math.round(nx * i / 4);
    ticks += '<text x="' + tx.toFixed(1) + '" y="' + (H - B + 18)
           + '" text-anchor="middle">' + xv + '</text>';
  }

  var path = pts.map(function(pt, j){
    return (j ? 'L' : 'M') + pt[0].toFixed(1) + ',' + pt[1].toFixed(1);
  }).join(' ');

  /* THREE LABELS, NOT TWELVE — first, last, and nothing else, because with a
     monotone trajectory the extreme IS the last point. */
  var last = pts.length - 1;
  var dots = pts.map(function(pt, j){
    var key = (j === 0 || j === last);
    return '<circle cx="' + pt[0].toFixed(1) + '" cy="' + pt[1].toFixed(1) + '" r="'
      + (key ? 5 : 3.5) + '" fill="' + (key ? 'var(--mark-1)' : 'var(--chart-series)')
      + '" stroke="var(--surface)" stroke-width="2"/>';
  }).join('');

  return '<svg class="chart lc" viewBox="0 0 ' + W + ' ' + H + '" role="img"'
    + ' aria-label="Distinct holders against patents filed, one point per year,'
    + ' joined in time order. Both rise together.">'
    + '<g stroke="var(--chart-grid)" stroke-dasharray="3 3" stroke-width="1">' + grid + '</g>'
    + '<g font-size="11" fill="var(--text-3)">' + ticks + '</g>'
    + '<path d="' + path + '" fill="none" stroke="var(--chart-series)" stroke-width="2"'
    +   ' stroke-linecap="round" stroke-linejoin="round"/>'
    + dots
    + '<text x="' + (pts[0][0] + 10).toFixed(1) + '" y="' + (pts[0][1] + 14).toFixed(1)
    +   '" font-size="11" fill="var(--text-2)">earliest</text>'
    + '<text x="' + (pts[last][0] - 8).toFixed(1) + '" y="' + (pts[last][1] - 12).toFixed(1)
    +   '" font-size="11" font-weight="600" text-anchor="end" fill="var(--text-1)">latest</text>'
    + '<text x="' + ((L + W - R) / 2) + '" y="' + (H - 4)
    +   '" font-size="11" text-anchor="middle" fill="var(--text-3)">Distinct holders filing</text>'
    + '</svg>';
}

/* `labels` is optional and the default is unchanged: holder rows are skeleton
   bars BY DECISION, so the no-labels path is the one Rival momentum uses. The
   technology columns ARE named - they are generated words, not holder names -
   so this takes them rather than growing a second function.

   Same precedent as shareBars() gaining `head` on 2026-09-12, and the same
   reason. Note W below is five wide: without labels a sixth row would read
   W[5] === undefined and render a bar with no width class, which the sk()
   comment warns renders 0px tall and reads as a missing value. Passing labels
   removes that path rather than papering over it. */
export function momentum(rows, sel, labels){
  var max = rows.reduce(function(m, r){
    return Math.max(m, Math.max.apply(null, r));
  }, 0) || 1;
  var W = ['w-md', 'w-lg', 'w-sm', 'w-xs', 'w-md'];

  return '<div class="mo' + (labels ? ' mo-named' : '') + '">' + rows.map(function(r, i){
    var tot = r.reduce(function(a, b){ return a + b; }, 0);
    var half = r.length >> 1;
    var early = r.slice(0, half).reduce(function(a, b){ return a + b; }, 0);
    var late  = r.slice(half).reduce(function(a, b){ return a + b; }, 0);
    /* the word carries the reading; the strip carries the shape. Neither is
       load-bearing alone, which is the rule. */
    var word = late === 0 ? 'stopped'
             : late > early ? 'rising'
             : late < early ? 'slowing' : 'steady';
    var span = r.length;
    var cols = r.map(function(v, y){
      var h = v === 0 ? 1 : Math.max(3, Math.round(v / max * 26));
      var ago = span - 1 - y;
      /* a title is the cheapest hover there is and it is the one the pie
         already uses. The row total and the word are printed either way, so
         nothing here is readable ONLY on hover. */
      return '<span class="mo-col"' + (v === 0 ? ' data-z="1"' : '')
           + ' title="' + v + (v === 1 ? ' filing' : ' filings') + ', '
           + (ago === 0 ? 'this year' : ago + (ago === 1 ? ' year ago' : ' years ago'))
           + '" style="height:' + h + 'px"></span>';
    }).join('');
    return '<div class="mo-row"' + (i === sel ? ' data-tracked' : '') + '>'
      + '<span class="mo-lbl">'
      + (labels ? '<span class="mo-t">' + esc(labels[i]) + '</span>'
                : '<span class="sk sk-h-label ' + W[i] + '"></span>')
      + '</span>'
      + '<span class="mo-plot">' + cols + '</span>'
      + '<span class="mo-n">' + tot + '<span class="mo-word">' + word + '</span></span>'
      + '</div>';
  }).join('') + '</div>';
}

/* Who builds on whom · Company > Cross Reference.
   IPtech draws a ring PLUS an N×N table. The ring encodes nothing the table
   does not — mmap-audit.md finding 1 — so only the table survives, and
   design/components.md §2 had already specced this exact shape and this exact
   reasoning before anything was built. Direction is the information: rows cite,
   columns are cited. */
export function citeMatrix(pairs, n){
  var g = [], i, j;
  for (i = 0; i < n; i++){ g[i] = []; for (j = 0; j < n; j++) g[i][j] = 0; }
  pairs.forEach(function(p){ g[p[0]][p[1]] = p[2]; });
  var max = pairs.reduce(function(m, p){ return Math.max(m, p[2]); }, 0) || 1;
  var W = ['w-sm', 'w-md', 'w-xs', 'w-sm', 'w-xs'];

  var out = '<div class="xr" style="--xr-n:' + n + '" role="table"'
          + ' aria-label="Citations between holders. Rows cite, columns are cited.">'
          + '<span class="xr-h"></span>';
  for (j = 0; j < n; j++)
    out += '<span class="xr-h"><span class="sk sk-h-micro ' + W[j] + '"></span></span>';
  for (i = 0; i < n; i++){
    out += '<span class="xr-rh"><span class="sk sk-h-label ' + W[i] + '"></span></span>';
    for (j = 0; j < n; j++){
      if (i === j){ out += '<span class="xr-c" data-self>&mdash;</span>'; continue; }
      var v = g[i][j];
      out += '<span class="xr-c" data-d="' + band(v, max) + '"'
           + (v ? ' title="cited ' + v + (v === 1 ? ' time' : ' times') + '"' : '')
           + '>' + (v || '') + '</span>';
    }
  }
  return out + '</div>';
}

/* THE SERIES IS A PARAMETER HERE AND WAS A GLOBAL IN THE PROTOTYPE. That is the
   one change made on the way across, and it is the whole reason app/js/** can
   hold no data: a chart that reads a module-level array cannot be drawn twice
   with two corpora, and it cannot be drawn at all against NullEngine. */
/* PG_LAG WAS A GLOBAL TOO. The lag is a property of the DATA — how long a
   patent takes to publish after it is filed — so it arrives with the series
   rather than being a constant the chart happens to know. */
export function filingsChart(series, years, lagYears){
  var d = series.slice(-(years || series.length)), n = d.length;
  var W = 1000, TOP = 16, BASE = 236, H = 260;
  var step = W / (n - 1);
  var max = Math.max.apply(null, d) || 1;
  /* zero baseline, scaled to the visible window. Cropping the axis must not
     also rescale the story — a fixed floor is what keeps a five-year view from
     looking like a different shape than the same years inside the twelve. */
  var yOf = function(v){ return BASE - (v / max) * (BASE - TOP); };
  var pts = d.map(function(v, i){ return [i * step, yOf(v)]; });
  var cut = W - (lagYears == null ? 1.5 : lagYears) * step;          /* where the unpublished window begins */

  var line = pts.map(function(pt, i){
    return (i ? 'L' : 'M') + pt[0].toFixed(1) + ',' + pt[1].toFixed(1);
  }).join(' ');
  var area = line + ' L' + W + ',' + BASE + ' L0,' + BASE + ' Z';

  /* the trend is fitted over the PUBLISHED points only. Letting the incomplete
     window pull the line would make the chart assert the decline platform.md §6.4 spends a
     paragraph telling the founder is not there. */
  var inc = pts.filter(function(pt){ return pt[0] <= cut; });
  var m = inc.length, sx = 0, sy = 0, sxy = 0, sxx = 0;
  inc.forEach(function(pt){ sx += pt[0]; sy += pt[1]; sxy += pt[0]*pt[1]; sxx += pt[0]*pt[0]; });
  var den = m * sxx - sx * sx;
  var slope = den ? (m * sxy - sx * sy) / den : 0;
  var icept = (sy - slope * sx) / (m || 1);

  var grid = [40, 100, 160, 220].map(function(gy){
    return '<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '"/>';
  }).join('');

  return '<svg class="chart chart-lg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none"'
    + ' role="img" aria-label="Filings per year. The final period is shaded and excluded as incomplete.">'
    + '<g stroke="var(--chart-grid)" stroke-dasharray="3 3" stroke-width="1">' + grid + '</g>'
    + '<path d="' + area + '" fill="var(--chart-series)" opacity=".08"/>'
    + '<path d="' + line + '" fill="none" stroke="var(--chart-series)" stroke-width="2"'
    +   ' stroke-linecap="round" stroke-linejoin="round"/>'
    + '<path d="M0,' + icept.toFixed(1) + ' L' + cut.toFixed(1) + ',' + (slope * cut + icept).toFixed(1) + '"'
    +   ' fill="none" stroke="var(--chart-trend)" stroke-width="1.5" stroke-dasharray="5 4" stroke-linecap="round"/>'
    + '<rect x="' + cut.toFixed(1) + '" y="0" width="' + (W - cut).toFixed(1) + '" height="' + BASE + '"'
    +   ' fill="var(--chart-unknown)"/>'
    + '<line x1="' + cut.toFixed(1) + '" y1="0" x2="' + cut.toFixed(1) + '" y2="' + BASE + '"'
    +   ' stroke="var(--border-strong)" stroke-width="1" stroke-dasharray="3 3"/>'
    + '</svg>';
}
