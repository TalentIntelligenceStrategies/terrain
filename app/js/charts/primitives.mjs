/* charts/primitives — the shared drawing primitives.
 *
 * EXTRACTED from design/previews/terrain-prototype.html by brace matching, so
 * these are the prototype's own functions rather than a memory of them.
 *
 * WHAT IS HERE AND WHY IT IS ONE FILE: a skeleton bar, a density band and a
 * categorical mark are read by the map, by every chart, by the list and by the
 * record. Duplicating any of them is how a swatch, a slice and a bar come to
 * disagree — design-language.md §3.7 exists because that had already happened.
 */
import { esc } from '../core/dom.mjs';

/* ONE INK, ONE GREY, ONE TEXTURE, AND NO FOURTH. design-language.md §3.7.
   Everything past index 2 folds into --mark-2 rather than generating a colour;
   a list of eight categories must therefore pass `flat` to shareBars, or six
   identical swatches make the key a lie. */
export const MARK = ['var(--mark-1)', 'var(--mark-2)', 'url(#terrain-hatch)'];

/* THE PATTERN ID IS PREFIXED. In the prototype the hatch is injected into every
   SVG that needs it, so a page with four charts carries four id="hatch" and
   url(#terrain-hatch) resolves to the first in document order — correct BY ACCIDENT.
   app/index.html declares one #terrain-hatch in a document-level defs block and
   every chart references it, because these ids live in the host document's
   single id namespace and this is a component going into somebody else's page. */
export const HATCH = 'url(#terrain-hatch)';


/* count -> density band, RELATIVE TO THE ACTIVE VIEW'S OWN MAXIMUM rather than
   against absolute thresholds - platform.md §6.4, and the ramp it drives is
   design-language.md §3.4. It was absolute until 2026-09-10 and the comment on it
   already claimed otherwise; the axis switch is what made the discrepancy bite. The two
   views have very different ranges (14 against 5), so one fixed ramp renders the
   holder view uniformly pale and leaves "Crowded" in the legend unreachable.

   THE BREAKPOINTS ARE THE OLD ONES, EXPRESSED AS FRACTIONS OF THE OLD MAXIMUM,
   so the outcome view is byte-identical to what it rendered before: at max 14
   the three cuts land on exactly 2, 6 and 12. Nothing about the default view
   moved. */
export function band(n, max){
  if (n === 0) return 0;
  max = max || 14;
  return n <= max * 2 / 14 ? 1 : n <= max * 6 / 14 ? 2 : n <= max * 12 / 14 ? 3 : 4;
}

export function bandRow(n, max){ return n.map(function(v){ return band(v, max); }); }

export function maxOf(rows){
  return rows.reduce(function(m, r){
    return r.n ? Math.max(m, Math.max.apply(null, r.n)) : m;
  }, 0);
}

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

/* one call so a swatch, a slice and a bar can never disagree. Returns what
   goes in `fill` for SVG; barStyle() returns the CSS equivalent. */
export function markFill(i){ return MARK[i] || 'var(--mark-2)'; }

/* The third value is one value with two renderings, and which one it gets is a
   question of area, not of meaning. A 45deg hatch needs room: on an 8px bar at
   5% width, or a 9px key dot, the 6px pattern renders as a single diagonal
   line and reads as a rendering fault. So area marks — pie slices, stacked
   segments — take the pattern; line-scale marks take --mark-3-hatch, the same
   40% duty cycle at half the pitch. Texture either way, because with the hue
   gone it is the only thing separating the third value, and the ramp has no
   third solid to spare. */
export function barStyle(i){ return 'background:' + (i === 2 ? 'var(--mark-3-hatch)'
                                                      : markFill(i)); }
