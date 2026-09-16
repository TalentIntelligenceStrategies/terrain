/* dom — query, escape, build. Four functions and no framework.
 *
 * `esc` is the one that matters. The founder's own typed words reach innerHTML
 * in EXACTLY ONE PLACE in this product -- the exclusion chips at the gate --
 * and they go through here first. Everywhere else that renders what they typed
 * uses textContent and needs nothing. Keeping that true is cheaper than
 * sanitising defensively everywhere, and it is checkable: grep for innerHTML
 * and look at what reaches each one.
 */

export const $  = (sel, root) => (root || document).querySelector(sel);
export const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export function esc(t) {
  return String(t).replace(/[&<>"]/g, c => ENT[c]);
}

/** Create an element. `attrs` may carry `class`, `text`, `html`, or any attribute. */
export function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'text') n.textContent = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'class') n.className = v;
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids) if (kid != null) n.append(kid);
  return n;
}
