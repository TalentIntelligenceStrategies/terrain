/* history — the searches the founder has run, newest first. platform.md §5.
 *
 * ═══ IT REPLACES PROJECTS ═════════════════════════════════════════════════
 * A project was a saved object with a name, a set and a switcher, and nothing
 * the founder did ever made one: the switcher listed a roster the engine
 * invented. What a founder coming back actually wants is the search they ran
 * on Tuesday, run again. So the masthead keeps a list of searches, each one
 * press away from running, and the engine is not asked for any of it.
 *
 * ═══ IT IS starred.mjs's STORAGE, AND FOR ITS REASONS ══════════════════════
 * One browser on one machine, behind read() and write(), every access wrapped
 * because Safari in private mode throws on setItem, and a versioned payload so
 * a stored entry in a shape this file no longer writes is dropped rather than
 * drawn. When the session model arrives it replaces read() and write() and
 * nothing else changes. platform.md §10 item 2.
 *
 * ═══ THIRTY, AND THE SAME SEARCH ONCE ═════════════════════════════════════
 * Running the same sentence under the same field and mode again moves it to
 * the top rather than adding a second line: history is where you go back to,
 * and a list of one search ten times is a list with one thing in it. Thirty
 * is PI-VuePat's own cap, and a list longer than a menu holds is a page.
 */
const KEY = 'terrain:history';
const VERSION = 1;
const CAP = 30;

let ENTRIES = [];
const LISTENERS = [];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const box = JSON.parse(raw);
    if (!box || box.v !== VERSION || !Array.isArray(box.entries)) return;
    ENTRIES = box.entries.filter(e => e && typeof e.query === 'string' && e.query.trim());
  } catch (e) {
    console.warn('history: could not read the stored searches', e);
  }
}

function write() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, entries: ENTRIES }));
  } catch (e) {
    console.warn('history: could not store the searches', e);
  }
}

read();

function announce() {
  const list = entries();
  LISTENERS.forEach(fn => { try { fn(list); } catch (e) { console.error(e); } });
}

const same = (a, b) => a.query === b.query && a.field === b.field && a.mode === b.mode;

/** every stored search, newest first */
export function entries() { return ENTRIES.slice(); }

/** a search that ran. `fieldLabel` is stored with it, because the field list
 *  may not have loaded the next time the menu draws. */
export function add({ query, field = null, fieldLabel = null, mode = 'text' }) {
  const q = typeof query === 'string' ? query.trim() : '';
  if (!q) return;
  const entry = { query: q, field, fieldLabel, mode, at: new Date().toISOString() };
  ENTRIES = [entry, ...ENTRIES.filter(e => !same(e, entry))].slice(0, CAP);
  write();
  announce();
}

export function remove(i) {
  if (i < 0 || i >= ENTRIES.length) return;
  ENTRIES.splice(i, 1);
  write();
  announce();
}

export function clear() {
  ENTRIES = [];
  write();
  announce();
}

/** fires now, and on every change after */
export function onChange(fn) {
  LISTENERS.push(fn);
  fn(entries());
}
