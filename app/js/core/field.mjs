/* core/field — the technology field the search runs in.
 *
 * Chosen on the home surface, from the field tiles. The results surface states
 * it in the scope row and does not change it there: one place picks, every
 * other place reads. A field that is not ready cannot be chosen.
 */
let FIELDS = [];
let current = null;
const LISTENERS = [];

export function get() { return current; }

export function label() {
  const f = FIELDS.find(x => x.id === current);
  return f && f.label != null ? f.label : null;
}

export function setList(list) {
  FIELDS = Array.isArray(list) ? list : [];
  announce();
}

export function set(id) {
  const f = FIELDS.find(x => x.id === id);
  if (FIELDS.length && (!f || f.ready !== true)) return;
  current = id;
  announce();
}

export function onChange(fn) { LISTENERS.push(fn); }
function announce() { LISTENERS.forEach(fn => { try { fn(current); } catch (e) { console.error(e); } }); }
