/* starred — the founder's own shortlist, and the only thing in the product
 * they curate by hand.
 *
 * ═══ WHY IT IS A CORE MODULE AND NOT A Set IN list.mjs ═════════════════════
 * It was one, and that was correct while starring did exactly one thing:
 * hand anchors to `Find similar`. It now has a surface of its own and is what
 * leaves the product, so three modules read it — the list, the starred view,
 * and the export. A Set private to one surface would have meant the other two
 * reaching into a renderer for state, which is the direction dependencies are
 * not allowed to run.
 *
 * ═══ IT HOLDS ROWS, NOT IDS ════════════════════════════════════════════════
 * An id is enough to re-order a list and not enough to render a collection or
 * write a CSV. The client holds one page of a result set at a time, so an id
 * starred on page one is an id nothing on screen can resolve after page three
 * replaces it — the set has to keep what it was told when it was told.
 *
 * ═══ IT SURVIVES A NEW SEARCH ══════════════════════════════════════════════
 * platform.md §7.1. Clearing it on the next query would delete the founder's
 * work to save them a click, and it is the one thing here they cannot get back
 * by pressing something again. It is session state and nothing more: there is
 * no persistence port yet, so a reload still empties it — platform.md §12
 * item 2 is where that is tracked.
 */

/* Map rather than Set, keyed by id, because insertion order IS the order the
   founder starred them in and that is the order the collection reads in. */
const ROWS = new Map();
const LISTENERS = [];

function announce() {
  const rows = list();
  LISTENERS.forEach(fn => { try { fn(rows); } catch (e) { console.error(e); } });
}

/** every starred row, in the order they were starred */
export function list() { return [...ROWS.values()]; }

export function size() { return ROWS.size; }

export function ids() { return [...ROWS.keys()]; }

export function has(id) { return ROWS.has(id); }

/**
 * Add or remove, and say which it did.
 *
 * `row` is the list row as the port returned it. On an un-star it is ignored,
 * which is what lets a caller pass whatever it has to hand.
 */
export function toggle(id, row) {
  const on = !ROWS.has(id);
  if (on) ROWS.set(id, { ...row, id });
  else ROWS.delete(id);
  announce();
  return on;
}

export function clear() {
  if (!ROWS.size) return;
  ROWS.clear();
  announce();
}

/** subscribe. Called immediately with the current set, so a surface that
 *  mounts after a star has already happened paints the right thing without
 *  every caller having to remember to paint once itself. */
export function onChange(fn) {
  LISTENERS.push(fn);
  fn(list());
}
