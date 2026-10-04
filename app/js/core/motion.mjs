/* motion — the durations, and whether the founder asked for less of it.
 *
 * REDUCED IS LIVE, AND IN THE PROTOTYPE IT WAS NOT. There it is read once at
 * parse time and never updated, so turning reduced motion on mid-session moved
 * the CSS and left the JavaScript behind: closeRecord still waited out a
 * transition that would never run, and dcOpen stopped setting data-done
 * synchronously -- which is the documented blank-region failure
 * (design-language.md §6) arriving by the back door. A `change` listener costs
 * three lines and removes the whole class of bug.
 *
 * READ IT THROUGH reduced(), NEVER BY CACHING IT IN A MODULE-LEVEL CONST at
 * the call site. A cached copy is the same bug one level down.
 *
 * REDUCED DOES NOT SHORTEN OR SKIP A BEAT. design-language.md §6's open item
 * was closed on exactly this point: a wait the system is genuinely having is
 * information, and a founder who asked for less movement did not ask to be
 * told an engine call was instant. What reduced motion changes is that the
 * indicator stills -- which the media query does on its own -- and that every
 * end state is declared outright rather than transitioned to.
 */

const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
let _reduced = mq.matches;
const watchers = new Set();

mq.addEventListener('change', e => {
  _reduced = e.matches;
  for (const fn of watchers) fn(_reduced);
});

export const reduced = () => _reduced;

/** Run `fn` now and whenever the preference changes. Returns an unsubscribe. */
export function onMotionChange(fn) {
  watchers.add(fn);
  fn(_reduced);
  return () => watchers.delete(fn);
}

/* The four transition durations, matching --dur-1..--dur-4. They are here as
 * well as in CSS because JavaScript has to know when a transition has finished
 * in order to hide a node after it -- and a JS constant that has drifted from
 * its token hides the node mid-flight. If one moves, both move.
 *
 * A HIDE WAITS ITS DURATION PLUS 20ms, never a number typed at the call site.
 * The slack is one frame and a margin; a literal 240 beside a 200ms exit is how
 * the router and its own stylesheet comment came to disagree. */
export const DUR1 = 120;
export const DUR2 = 200;
export const DUR3 = 320;
export const DUR4 = 520;

/* THE STAGGER, design-language.md §6 "Lists and records". Rows that a request
 * brought into existence arrive 30ms apart, and only the first eight do -- the
 * ninth row is below the fold on every supported window, and a stagger that
 * kept counting would make the last visible row wait on rows nobody can see. */
export const STAGGER = 30;
export const STAGGER_MAX = 8;


/* ══ ENTER · rows a request brought into existence ════════════════════════
 * design-language.md §6 "Lists and records". Each node starts at
 * [data-enter] — opacity 0 and 6px low, transitions off — and is released on
 * the next frame with a delay of k × STAGGER, so the first eight arrive in
 * order and the rest arrive with the eighth.
 *
 * THE START STATE IS COMMITTED BEFORE IT IS RELEASED, which is §6's first
 * trap: setting the attribute and removing it in one style pass animates
 * towards the start state instead of from it. The forced read is the commit;
 * the frame is the release.
 *
 * THE DELAY IS CLEARED AFTERWARDS, or every later transition on the row —
 * the open surface, a hover — inherits up to 210ms of it. */
export function enter(nodes) {
  const list = Array.from(nodes || []);
  if (!list.length || _reduced) return;
  list.forEach(el => el.setAttribute('data-enter', ''));
  void list[0].offsetWidth;
  requestAnimationFrame(() => {
    list.forEach((el, k) => {
      el.style.transitionDelay = Math.min(k, STAGGER_MAX - 1) * STAGGER + 'ms';
      el.removeAttribute('data-enter');
    });
    setTimeout(() => list.forEach(el => { el.style.transitionDelay = ''; }),
      DUR3 + STAGGER_MAX * STAGGER + 20);
  });
}

/* ══ FLIP · the same nodes, somewhere else ═════════════════════════════════
 * Measure every node's y, run `mutate` (which moves or replaces them), then
 * play each surviving node from where it was to where it is. Nodes are
 * matched by `key` rather than identity, because a sort re-renders the rows
 * and the row for US123 afterwards is a new element standing for the same
 * patent.
 *
 * ONLY WHAT CAN BE SEEN MOVES. A row travelling 4,000px from outside the
 * scrollport to outside it again is a blur across the list, so a node moves
 * only if its old or new position meets `view`; the rest land where they
 * land. Rows that are new — no old position — take enter() instead.
 *
 * transform and nothing else, §6: no top, no margin, no height. */
export function flip(root, selector, key, mutate, view) {
  if (_reduced || !root) { mutate(); return; }
  const box = (view || root).getBoundingClientRect();
  const seen = r => r.bottom > box.top && r.top < box.bottom;
  const before = new Map();
  root.querySelectorAll(selector).forEach(el => {
    before.set(key(el), el.getBoundingClientRect());
  });
  mutate();
  const moved = [], fresh = [];
  root.querySelectorAll(selector).forEach(el => {
    const was = before.get(key(el));
    const now = el.getBoundingClientRect();
    if (!was) { if (seen(now)) fresh.push(el); return; }
    const dy = was.top - now.top;
    if (Math.abs(dy) < 1 || !(seen(was) || seen(now))) return;
    el.style.transition = 'none';
    el.style.transform = 'translateY(' + dy + 'px)';
    moved.push(el);
  });
  if (moved.length) {
    void root.offsetWidth;
    requestAnimationFrame(() => moved.forEach(el => {
      el.style.transition = '';
      el.style.transform = '';
    }));
  }
  enter(fresh);
}
