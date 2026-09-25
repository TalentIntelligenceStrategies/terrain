/* core/primitives — the shared render primitives.
 *
 * EXTRACTED from design/previews/terrain-prototype.html by brace matching, so
 * these are the prototype's own functions rather than a memory of them.
 *
 * IT LIVED UNDER charts/ UNTIL 2026-09-23, AND THE PATH WAS ALWAYS WRONG. Half
 * that file drew charts; half of it drew the skeleton bar, the status chip and
 * the page card, which the list, the record, the masthead and all four
 * destinations read. The analysis surfaces are gone and the seven functions
 * only they used went with them — MARK, HATCH, band, bandRow, maxOf, markFill
 * and barStyle. What is left never belonged to a chart.
 *
 * It sits in core/ because that is what it is: dependency-free, benched by
 * lab.html, read by every surface.
 */

/* FOUR STATES, AND THE FOURTH IS WHY THIS IS A MAP RATHER THAN A TERNARY.
   This was `live ? Live : Expired` — everything that was not live printed the
   word *Expired*, which against real data is a different fact stated with full
   confidence. Ten pending applications and five abandoned ones all read as
   expired patents. For a US founder that is the most decision-relevant word on
   the row: an expired patent was granted and lapsed, an abandoned application
   was never granted, and a pending one might yet be.

   ABANDONED SHARES EXPIRED'S HUE AND NOT ITS WORD. §2 permits colour for a
   discrete state and requires every coloured element to carry a word as well —
   the hue here means *not enforceable*, which is true of both, and the word is
   what separates them. A fifth token for a fact the first one already carries
   would be colour doing a word's job.

   AN UNKNOWN STATUS IS NOT A STATUS. `null` renders nothing rather than
   guessing, which is what null means everywhere else in this product. */
const STATUS = {
  live:      ['live',    'Live'],
  expired:   ['expired', 'Expired'],
  abandoned: ['expired', 'Abandoned'],
  pending:   ['pending', 'Pending'],
};

export function statusHTML(kind){
  var s = STATUS[kind];
  if (!s) return '';
  /* THE ROLE IS ON THE EMITTED CLASS LIST, not spelled in 11-chip.css. The chip
     shipped font-size:11.5px, which appears nowhere in design-language.md §4's
     table -- a sixth role invented in the gap between `micro` and `label`, and
     spelled once for the three surfaces this function feeds. Adding the role
     here fixes the list row, the record and the starred view together.
     THE HUE STILL WINS: .t-micro sets --text-3 and .status-* sets the state
     colour at equal specificity, and 11 loads after 02. The number is the
     cascade. */
  return '<span class="status t-micro status-' + s[0] + '"><span class="dot"></span>'
       + s[1] + '</span>';
}

/* THE SAME WORD, FOR SOMEWHERE THAT IS NOT A CHIP. The export writes a status
   into the founder's spreadsheet, and it was deciding on its own what to call
   one — so it wrote the raw `abandoned` into a CSV and the word *Expired* into
   a Markdown list for a patent that was abandoned. That is the identical false
   statement the chip was just fixed for, in the one place nothing downstream
   can tell it is wrong. One map, two readers. */
export function statusWord(kind){
  var s = STATUS[kind];
  return s ? s[1] : '';
}

export function bar(w, h){ return '<span class="sk sk-h-' + (h || 'body') + ' ' + w + '"></span>'; }

export function bars(cnt, ws){
  var out = [], i;
  for (i = 0; i < cnt; i++) out.push(bar(ws[i % ws.length]));
  return out.join('');
}

export function sk(w, cls){
  return '<span class="sk sk-h-body ' + (cls || '') + '"'
       + (w ? ' style="width:' + w + '"' : '') + '></span>';
}


export function pgCard(title, icon, body, head){
  return '<section class="card"><div class="card-head"><span class="card-icon">' + icon + '</span>'
       + '<h2 class="t-title">' + title + '</h2>' + (head || '') + '</div>'
       + '<div class="card-body">' + body + '</div></section>';
}

export function numCell(w){ return '<td class="num">' + sk(w) + '</td>'; }
