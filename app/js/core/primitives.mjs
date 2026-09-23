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

export function statusHTML(kind){
  return kind === 'live'
    ? '<span class="status status-live"><span class="dot"></span>Live</span>'
    : '<span class="status status-expired"><span class="dot"></span>Expired</span>';
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

export function skStack(ws){
  return ws.map(function(w, i){
    return '<span class="sk sk-h-body" style="width:' + w + (i < ws.length - 1 ? ';margin-bottom:7px' : '') + '"></span>';
  }).join('');
}

export function pgCard(title, icon, body, head){
  return '<section class="card"><div class="card-head"><span class="card-icon">' + icon + '</span>'
       + '<h2 class="t-title">' + title + '</h2>' + (head || '') + '</div>'
       + '<div class="card-body">' + body + '</div></section>';
}

export function numCell(w){ return '<td class="num">' + sk(w) + '</td>'; }
