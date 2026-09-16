/* beat — how long the system takes, and why there are two numbers.
 *
 * NONE OF THESE IS A MEASUREMENT AND NONE IS A CLAIM. platform.md §5 still
 * lists search latency as open, and the elapsed counter on the build remains
 * the only honest duration on any surface. What these buy is that THE WAIT IS
 * LEGIBLE AS A WAIT, which is what the founder is actually judging when they
 * decide whether the answer was worth asking for.
 *
 * TWO KINDS OF REQUEST, TWO NUMBERS, and the second is not a rounding of the
 * first. BEAT is the ENGINE's -- a search across 180M records and the things
 * that search returns. SAVE_MS is ours: writing a name onto an account or
 * posting a message to a support queue goes to our own service with one small
 * payload. Collapsing them would say those are the same kind of work.
 *
 * REDUCED MOTION DOES NOT SHORTEN OR SKIP A BEAT. design-language.md §6's open
 * item was closed on exactly that point: a wait the system is genuinely having
 * is information, and a founder who asked for less movement did not ask to be
 * told an engine call was instant. What stills is the indicator, and the media
 * query does that on its own. A separate flag -- not this one -- is what lets
 * a screenshot path resolve instantly.
 *
 * IF THE ENGINE TURNS OUT TO BE FAST, THESE COME DOWN rather than the
 * indicators coming out. A fast search is a feature, and pretending to be slow
 * would be the same error as pretending to be fast.
 */
export const BEAT = { page: 2340, card: 1610, row: 1350, rec: 1460 };
export const SAVE_MS = 760;

/* Note what the arithmetic does here, because it is easy to get wrong: a
 * column's wait and the views' resolve RUN CONCURRENTLY, so the total elapsed
 * is not the sum of the beats. */
export const totalIsNotTheSum = true;
