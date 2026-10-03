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

