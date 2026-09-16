/* esc-stack — Escape closes the thing opened most recently.
 *
 * ONE OVERLAY LEFT, AND THE STACK STAYS. The record was one of two -- a chat
 * panel over the left column was the other -- and Escape had to choose between
 * them. With the panel gone there is nothing to choose, but the stack is what
 * makes adding a second overlay SAFE again, and it costs almost nothing. A
 * single `if (recordOpen)` would be smaller and would have to be found and
 * rewritten by whoever adds the second one, which is how two overlays start
 * fighting over one key.
 */
const order = [];
const handlers = new Map();

/** Register an overlay as the most recent. Re-pushing an open one re-promotes it. */
export function push(key, close) {
  const at = order.indexOf(key);
  if (at >= 0) order.splice(at, 1);
  order.unshift(key);
  if (close) handlers.set(key, close);
}

/** Remove an overlay from the stack, whether or not it was the top. */
export function drop(key) {
  const at = order.indexOf(key);
  if (at >= 0) order.splice(at, 1);
  handlers.delete(key);
}

/** What Escape would close right now, or undefined. */
export const top = () => order[0];

/** Close the topmost overlay. Returns true if something was closed. */
export function closeTop() {
  const key = order[0];
  if (!key) return false;
  const fn = handlers.get(key);
  drop(key);
  if (fn) fn();
  return true;
}

let bound = false;
/** Bind Escape once, at the document. Safe to call more than once. */
export function bindEscape() {
  if (bound) return;
  bound = true;
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    if (closeTop()) e.preventDefault();
  });
}
