/* charts/share — the share forms: the pie, the ranked bars, the donut.
 *
 * EXTRACTED from the prototype. Restyled from IPtech to the §3.7 palette.
 *
 * COLOUR ENCODES DIRECTION, NEVER DESIRABILITY. The donut is tonal — solid ink
 * for live, the hatch for expired — and NOT the state hues. Built with
 * --state-live / --state-expired first, it drew a saturated green ring with a
 * red bite out of it: "no green-means-good" at 140px. The status chip gets away
 * with the same pair because it is an 11px label reading the word Live, where
 * the colour is redundant to a word beside it. A donut is an AREA and the area
 * is the message.
 */
import { markFill, barStyle, HATCH } from './primitives.mjs';


/* Share · restyled from IPtech's T-Map > Company > Share.
   Two changes, and only one is aesthetic. IPtech's pie takes its denominator
   from the FIVE ROWS SELECTED, so a holder with 12 of 124 reads 30%. Ours is a
   share of the whole scope. That is a correctness fix, not a restyle. */
export function sharePie(rows, total, r){
  var cx = 90, cy = 90, R = r || 74, a = -Math.PI / 2, out = '';
  rows.forEach(function(row, i){
    var frac = row[1] / total, a2 = a + frac * Math.PI * 2;
    /* the 2px surface gap is drawn as a stroke in the surface colour, which
       also gives every slice its own readable edge on a white card */
    var large = frac > 0.5 ? 1 : 0;
    out += '<path d="M' + cx + ',' + cy
        +  ' L' + (cx + R * Math.cos(a)).toFixed(2) + ',' + (cy + R * Math.sin(a)).toFixed(2)
        +  ' A' + R + ',' + R + ' 0 ' + large + ' 1 '
        +  (cx + R * Math.cos(a2)).toFixed(2) + ',' + (cy + R * Math.sin(a2)).toFixed(2) + ' Z"'
        +  ' fill="' + markFill(i) + '" stroke="var(--surface)" stroke-width="2">'
        +  '<title>' + row[0] + ' — ' + row[1] + ' of ' + total + '</title></path>';
    a = a2;
  });
  /* the ink and mid-grey slices hold their own outer arcs now, but the hatch
     slice is mostly --surface and would dissolve into the card without an
     edge. One hairline on the circle — not on each slice — gives it one
     without ringing the two solids, which would have made every slice read as
     outlined rather than filled. Same line, narrower reason than the hue's. */
  return '<svg viewBox="0 0 180 180" width="180" height="180" role="img"'
       + ' aria-label="Share of filings by jurisdiction">' + out
       + '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none"'
       + ' stroke="var(--border-strong)" stroke-width="1"/></svg>';
}

/* `flat` suppresses the per-row mark, and it is a FIX rather than an option.
   barStyle() holds three marks and repeats --mark-2 past index 2, so a list of
   eight categories draws six identical swatches and the key becomes a lie. In a
   list ordered by size the LABEL carries identity and the BAR LENGTH carries
   magnitude, so a per-row hue is carrying nothing - CLAUDE.md: colour carries
   information, or it is not there. What survives is the one distinction worth
   drawing, the largest row against the rest, which is MARK's own "a tracked
   entity" pattern and is named in the caption rather than left to the eye. */
export function shareBars(rows, total, head, flat){
  return '<table class="tbl tbl-share">'
       + '<colgroup><col style="width:38%"><col style="width:88px"><col></colgroup>'
       + '<thead><tr><th class="t-micro">' + (head || 'Jurisdiction') + '</th>'
       + '<th class="t-micro num">Patents</th>'
       + '<th class="t-micro">Share of scope</th></tr></thead><tbody>'
       + rows.map(function(row, i){
           var pct = (row[1] / total * 100);
           var fill = flat ? 'background:var(--mark-' + (i === 0 ? '1' : '2') + ')'
                           : barStyle(i);
           return '<tr><td><span class="cellpair">'
                + (flat ? '' : '<span class="dot" style="' + barStyle(i) + '"></span>')
                + row[0] + '</span></td>'
                + '<td class="num"><span class="fig-m">' + row[1] + '</span></td>'
                + '<td class="share-cell"><span class="bar-t"><span class="bar-f" style="width:'
                + pct.toFixed(1) + '%;' + fill + '"></span></span>'
                + '<span class="bar-n">' + pct.toFixed(1) + '%</span></td></tr>';
         }).join('')
       + '</tbody></table>';
}

/* ── Live and expired · platform.md §6.4 ─────────────────────────────────
   IPtech draws this as a donut PLUS a grouped bar chart PLUS a rate table on
   one screen (M-Map > Legal Status > Company-Legal Status, screen 21). Terrain
   keeps the donut for the scope-level split and the stacked bar for the per-
   holder one, and drops the third: a rate table restates the bars as numbers.

   Tonal, NOT the state hues — solid ink for live, the hatch for expired. This
   was built with --state-live / --state-expired first, because §2 permits
   colour on discrete states and the status chip already uses that pair. What
   it drew was a saturated green ring with a red bite out of it: CLAUDE.md's
   "no green-means-good" prohibition at 140px. The chip gets away with the same
   hues because it is an 11px label reading the word Live, where the colour is
   redundant to a word right beside it. A donut is an AREA and the area is the
   message. A hue that is decoration on a chip becomes an argument on a chart.

   The hatch also happens to be the honest mark: it reads as lapsed rather than
   as bad, and it carries no direction. An expired patent is prior art rather
   than an obstacle, which for a founder is the EASIER of the two. */
export function legalDonut(live, expired){
  var total = live + expired, R = 52, SW = 16, C = 2 * Math.PI * R;
  var lf = live / total;
  /* a 2px gap at each join, drawn in the surface colour the way the pie's
     slice strokes are, so the two arcs read as two rather than as one ring */
  var gap = 2, seg = Math.max(0, lf * C - gap), rest = Math.max(0, C - seg - gap);
  return '<svg viewBox="0 0 140 140" width="140" height="140" role="img"'
    + ' aria-label="' + live + ' of ' + total + ' patents in scope are still live.">'
    
    + '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="url(#terrain-hatch)"'
    +   ' stroke-width="' + SW + '" stroke-dasharray="' + rest.toFixed(2) + ' ' + (seg + gap * 2).toFixed(2) + '"'
    +   ' stroke-dashoffset="' + (-(seg + gap)).toFixed(2) + '" transform="rotate(-90 70 70)"/>'
    + '<circle cx="70" cy="70" r="' + R + '" fill="none" stroke="var(--mark-1)"'
    +   ' stroke-width="' + SW + '" stroke-dasharray="' + seg.toFixed(2) + ' ' + (C - seg).toFixed(2) + '"'
    +   ' transform="rotate(-90 70 70)"/>'
    + '<text x="70" y="66" text-anchor="middle" class="fig-l" fill="var(--text-1)">' + live + '</text>'
    + '<text x="70" y="84" text-anchor="middle" class="dn-sub" fill="var(--text-3)">still live</text>'
    + '</svg>';
}

/* one stacked bar per holder. Holder names are skeleton bars — the prototype
   names no parties — so the row's information is the SPLIT and its width. */
export function legalBars(holders, rivals){
  return holders.map(function(h, i){
    var p = rivals[i].p, live = h.live, exp = p - live;
    return '<div class="lb-row">'
      + '<span class="sk sk-h-label ' + ['w-lg','w-md','w-xl','w-sm','w-md'][i] + '"></span>'
      + '<span class="bar-t bar-stack">'
      +   '<span class="bar-f" style="width:' + (live / p * 100).toFixed(1) + '%;background:var(--mark-1)"></span>'
      +   '<span class="bar-f bar-hatch" style="width:' + (exp / p * 100).toFixed(1) + '%"></span>'
      + '</span>'
      + '<span class="bar-n"><span class="fig-m">' + live + '</span>'
      +   '<span class="lb-of"> / ' + p + '</span></span>'
      + '</div>';
  }).join('');
}
