/* core/url — the search, in the address bar. platform.md §4.
 *
 * A SEARCH THE URL CANNOT HOLD IS A SEARCH BACK, RELOAD AND A LINK ALL LOSE.
 * The results surface was `#set` and nothing else, so a reload brought back a
 * list with an empty composer above it, and a link sent to a colleague opened
 * whatever the engine happened to hold. Now a search writes what ran —
 * `#set?q=…&field=…&mode=…` — and the open record adds `&rec=…`.
 *
 * A SEARCH IS A STEP AND A RECORD IS NOT. Each search assigns the hash, so
 * Back walks from this search to the last one; opening a record replaces the
 * entry, because five records read in a row are not five places the founder
 * wants Back to stop.
 *
 * The router (main.mjs) reads only the part before `?`, so every hash this
 * writes still resolves to the results surface.
 */
const KEYS = { query: 'q', field: 'field', mode: 'mode', rec: 'rec' };

/** what the current hash says ran, or null when it names no search */
export function read() {
  const h = location.hash.slice(1);
  const at = h.indexOf('?');
  if (!h.startsWith('set') || at < 0) return null;
  const p = new URLSearchParams(h.slice(at + 1));
  const query = p.get(KEYS.query);
  if (!query) return null;
  return { query, field: p.get(KEYS.field), mode: p.get(KEYS.mode) || 'text', rec: p.get(KEYS.rec) };
}

function hashFor(s) {
  const p = new URLSearchParams();
  p.set(KEYS.query, s.query);
  if (s.field) p.set(KEYS.field, s.field);
  if (s.mode && s.mode !== 'text') p.set(KEYS.mode, s.mode);
  if (s.rec) p.set(KEYS.rec, s.rec);
  return '#set?' + p.toString();
}

let RAN = null;

/** what last ran in this page, or null before any search */
export function ran() { return RAN; }

/** a search that ran: a new history entry, unless the hash already holds it —
 *  which is the case when the search WAS the hash, restored on a reload or a
 *  Back, and then the open record it names must survive too. */
export function searched(s) {
  RAN = { query: s.query, field: s.field || null, mode: s.mode || 'text' };
  if (holds(RAN)) return;
  location.hash = hashFor(RAN);
}

/** the open record, or null when it closes: the same entry, rewritten */
export function record(id) {
  const now = read();
  if (!now) return;
  const next = hashFor({ ...now, rec: id || null });
  if (location.hash !== next) history.replaceState(history.state, '', next);
}

/** is `s` the search the hash already holds? */
export function holds(s) {
  const now = read();
  return !!now && now.query === s.query && (now.field || null) === (s.field || null)
    && (now.mode || 'text') === (s.mode || 'text');
}

/* THE RECORD A RESTORE NAMES, held until the restored search has landed. A
   new search closes the open record, and closing writes rec away, so by the
   time the restored list arrives the address no longer says which patent was
   open. work.mjs pends it when it starts a restore; record.mjs takes it on
   the first-row open that follows the search. */
let PENDING = null;
export function pend(id) { PENDING = id || null; }
/** the pended record. It is released once a search has run in this page,
 *  because only the restored search's own list should consume it. */
export function pendingRecord() {
  const id = PENDING;
  if (RAN) PENDING = null;
  return id;
}
