/* delegate — bind once at a stable ancestor, not per row.
 *
 * WHY EVERY LIST HANDLER IS DELEGATED. The list re-renders on every sort,
 * filter, re-rank and page. A handler bound to a row is a handler that has to
 * be rebound after each of those, and the one that is forgotten is silent --
 * the row simply stops responding, and nothing logs.
 *
 * IT ALSO FIXES AN ORDERING BUG THE PROTOTYPE HIT: a handler bound directly to
 * an element declared further down the file read `undefined`, so the bind went
 * to the document instead. Delegation makes that a non-question, because the
 * ancestor exists before any of its contents do.
 */

/**
 * Bind `type` on `root`, calling `fn(matchedElement, event)` when the event
 * originated inside something matching `sel`.
 *
 * `closest` AND NOT `matches`: the founder clicks the label inside the button,
 * not the button, and a `matches` test on the target misses every one of those.
 */
export function on(root, type, sel, fn, opts) {
  const host = root || document;
  const handler = e => {
    const hit = e.target instanceof Element ? e.target.closest(sel) : null;
    if (hit && host.contains(hit)) fn(hit, e);
  };
  host.addEventListener(type, handler, opts);
  return () => host.removeEventListener(type, handler, opts);
}

/**
 * The same, for keyboard activation of something that is not a <button>.
 *
 * Enter AND Space, because that is what a button does, and a role that says
 * button and answers only Enter is a control that half works.
 */
export function onActivate(root, sel, fn) {
  const offClick = on(root, 'click', sel, fn);
  const offKey = on(root, 'keydown', sel, (hit, e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    fn(hit, e);
  });
  return () => { offClick(); offKey(); };
}
