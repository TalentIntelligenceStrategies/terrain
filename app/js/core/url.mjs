/* core/url — the search, in the address bar. platform.md §4.
 *
 * A SEARCH THE URL CANNOT HOLD IS A SEARCH BACK, RELOAD AND A LINK ALL LOSE.
 * The results surface was `#set` and nothing else, so a reload brought back a
 * list with an empty composer above it, and a link sent to a colleague opened
 * whatever the engine happened to hold. Now a search writes what ran —
 * `#set?q=…&field=…&mode=…` — and the open record adds `&rec=…`.
 *
 * A SEARCH IS A STEP, AND SO IS WHATEVER COVERS IT (platform.md §4). Each
 * search assigns the hash, so Back walks from this search to the last one. An
 * enlarged drawing is one more step everywhere, and below 1080, where the
 * record is a card over the list, so is the record: Back closes the drawing
 * and leaves the record, then closes the record and leaves the list. Where
 * the record sits beside the list it covers nothing, so opening one rewrites
 * the entry — five records read in a row are not five places to stop.
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
  forget();
  location.hash = hashFor(RAN);
}

/** the open record, or null when it closes: the same entry, rewritten —
 *  or, with `cover`, a new entry over the list, which Back closes */
export function record(id, { cover: asCover = false } = {}) {
  const now = read();
  if (!now) return;
  const next = hashFor({ ...now, rec: id || null });
  if (asCover && id && !covered('record')) { cover('record', next); return; }
  if (location.hash !== next) history.replaceState(history.state, '', next);
}

/* ══ COVERS · what Back closes before it leaves the search ══════════════════
   A cover is an entry this page pushed for something laid over the surface —
   the record card, an enlarged drawing — and STACK is the ones still standing,
   oldest first. Closing one by its own control goes back over its entry, so
   the entry does not linger as a Back that reopens nothing; Back closing it is
   the same event the other way round, announced as `terrain:uncover` with the
   kinds it took, and the owner closes without going back a second time.

   THE STACK IS THIS PAGE'S, NOT THE BROWSER'S. An entry left by a reload or
   reached by Forward is not in it, so it is passed over rather than reopened:
   a cover is a state of the page, and a page that has just loaded has none. */
const STACK = [];
let SKIP = 0;
export function cover(kind, hash) {
  history.pushState({ ...(history.state || {}), cover: kind }, '', hash || location.hash);
  STACK.push(kind);
}
export const covered = kind => STACK.includes(kind);
/** close a cover by its own control: back over its entry and any above it */
export function uncover(kind) {
  const i = STACK.lastIndexOf(kind);
  if (i < 0) return false;
  const n = STACK.length - i;
  STACK.length = i;
  SKIP++;
  history.go(-n);
  return true;
}
/** a route away keeps whatever entries it passed, and stops counting them */
export function forget() { STACK.length = 0; }
/** the drawing in the address, rewritten while the viewer pages */
export function figure(n) {
  if (covered('figure')) history.replaceState(history.state, '', figureHash(n));
}
/** the address with the drawing named in it, for the viewer's own cover */
export function figureHash(n) {
  const h = (location.hash || '#').replace(/([?&])fig=[^&]*&?/, '$1').replace(/[?&]$/, '');
  return h + (h.includes('?') ? '&' : '?') + 'fig=' + n;
}
window.addEventListener('popstate', e => {
  if (SKIP) { SKIP--; return; }
  const at = e.state && e.state.cover;
  const keep = at ? STACK.lastIndexOf(at) + 1 : 0;
  if (keep >= STACK.length) return;
  const gone = STACK.splice(keep);
  window.dispatchEvent(new CustomEvent('terrain:uncover', { detail: { kinds: gone } }));
});

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
