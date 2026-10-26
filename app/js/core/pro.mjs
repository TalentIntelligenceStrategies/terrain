/* pro — the Pro part's quote and the searches behind a starred set, shared by
 * the starred page's report panel and the report. platform.md §5.2, §5.3.
 *
 * THE SECTIONS ARE THE ENGINE'S. Which sections Pro writes, in what order and
 * under what titles, comes back with the quote (components.md §1), so the
 * panel and the report name the same list and neither hard-codes one. A quote
 * is asked once per starred set and kept until the set changes. */

/* ══ the searches behind the stars ═══════════════════════════════════════
   One per distinct stamped search, most recent first. A star from before the
   whole search was stamped carries its sentence only, and is re-run with the
   engine's default settings — said in the report's basis line rather than
   hidden. */
export function searchesOf(rows) {
  const seen = new Map();
  for (const r of [...rows].reverse()) {
    const s = r.starredSearch || (r.starredUnder ? { query: r.starredUnder, field: null, settings: {}, mode: 'text' } : null);
    if (!s) continue;
    const k = JSON.stringify([s.query, s.field, s.settings, s.mode]);
    if (!seen.has(k)) seen.set(k, s);
  }
  return [...seen.values()];
}

let KEY = '';
let PENDING = null;

/* the request every Pro port takes: the set, the description it is read
   against, and the searches that made it. THE DESCRIPTION IS A SENTENCE,
   never a patent number: the most recent text search's, or null when every
   search was a number lookup. */
export function request(rows) {
  const searches = searchesOf(rows);
  const text = searches.find(x => x.mode !== 'number');
  return { starred: rows.map(r => r.id), description: text?.query ?? null, searches };
}

/* A FAILED QUOTE IS NOT KEPT, so the next look asks again rather than
   repeating a failure the engine may have recovered from. */
export function quote(engine, rows) {
  /* keyed on the whole request: the same patents under another search are
     another description */
  const key = JSON.stringify(request(rows));
  if (key === KEY && PENDING) return PENDING;
  KEY = key;
  PENDING = engine.proQuote(request(rows)).then(res => {
    if (!res.ok && KEY === key) { KEY = ''; PENDING = null; }
    return res;
  });
  return PENDING;
}
