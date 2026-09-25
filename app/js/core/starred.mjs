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
 * ═══ IT SURVIVES A NEW SEARCH, AND NOW A RELOAD ════════════════════════════
 * platform.md §5.1. Clearing it on the next query would delete the founder's
 * work to save them a click, and it is the one thing here they cannot get back
 * by pressing something again. The same argument reaches one step further: a
 * refresh emptied it too, and a refresh is not a decision the founder made
 * about their shortlist. platform.md §10 item 2 called that "urgent rather
 * than tidy" and named the trigger as "any surface has to survive a reload".
 *
 * ═══ localStorage IS A FLOOR, NOT THE SESSION MODEL ════════════════════════
 * It is one browser on one machine and it is not an account. What it buys is
 * the one failure that actually loses work — a reload, a crash, a closed tab —
 * and it buys it without a port, a server or a login. When the session model
 * arrives it replaces read() and write() below and nothing else in this file
 * changes, because everything outside them speaks to the Map.
 *
 * EVERY ACCESS IS WRAPPED. Safari in private mode throws on setItem rather
 * than failing quietly, and a throw in here would take the store down with it
 * — the founder would lose the starring they were doing, to protect the
 * starring they had done.
 *
 * IT HOLDS ROWS AND ROWS CHANGE SHAPE, so the payload carries a version and a
 * mismatch drops the cache rather than rendering whatever it finds. A row read
 * back as a shape the list no longer emits is bars where there were names.
 */

/* Map rather than Set, keyed by id, because insertion order IS the order the
   founder starred them in and that is the order the collection reads in. */
const ROWS = new Map();
const LISTENERS = [];

const KEY = 'terrain:starred';
/* BUMP THIS WHEN THE ROW SHAPE CHANGES. components.md §1 names the fields a
   row carries; a stored row from before a rename is a row the list cannot
   draw. */
const VERSION = 1;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const box = JSON.parse(raw);
    if (!box || box.v !== VERSION || !Array.isArray(box.rows)) return;
    /* THE ID IS RE-DERIVED FROM THE KEY POSITION rather than trusted from the
       row, because toggle() is what guarantees `id` matches the key and a
       hand-edited localStorage has made no such promise. */
    box.rows.forEach(row => {
      if (row && typeof row.id === 'string') ROWS.set(row.id, row);
    });
  } catch (e) {
    /* A CORRUPT OR UNREADABLE STORE IS AN EMPTY ONE. Better an empty shortlist
       the founder can rebuild than a boot that fails on a JSON error. */
    console.warn('starred: could not read the stored set', e);
  }
}

function write() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, rows: list() }));
  } catch (e) {
    /* QUOTA OR PRIVATE MODE. The set still works for this session; it just
       will not outlive it, which is exactly where this started. */
    console.warn('starred: could not store the set', e);
  }
}

read();

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
  write();
  announce();
  return on;
}


/** subscribe. Called immediately with the current set, so a surface that
 *  mounts after a star has already happened paints the right thing without
 *  every caller having to remember to paint once itself. */
export function onChange(fn) {
  LISTENERS.push(fn);
  fn(list());
}
