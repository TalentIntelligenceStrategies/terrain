/* generation — request cancellation, for a client that cannot cancel requests.
 *
 * WHAT THIS STANDS IN FOR. A deferred callback that lands after the state it
 * belonged to has gone writes into a surface nobody is looking at: a sort
 * result arriving after New search repopulates a list that was cleared, a
 * label swap landing on a button that now says something else. The real fix is
 * an AbortController on the fetch. This is the half that still matters after
 * that lands, because aborting a request does not un-schedule a setTimeout
 * that has already been queued.
 *
 * THE PATTERN IS THREE LINES AND THE THIRD IS THE ONE PEOPLE FORGET:
 *
 *     const gen = bump('list');           // on entering the state
 *     …
 *     if (stale('list', gen)) return;     // in EVERY deferred callback
 *
 * A counter per channel rather than one global, because the list re-sorting
 * must not cancel a record fetch that is legitimately still in flight.
 */
const counters = new Map();

/** Invalidate everything outstanding on this channel and return the new token. */
export function bump(channel) {
  const n = (counters.get(channel) || 0) + 1;
  counters.set(channel, n);
  return n;
}

/** True if `token` is no longer the current generation for this channel. */
export function stale(channel, token) {
  return counters.get(channel) !== token;
}

/** The current token without bumping. For a caller that only wants to compare. */
export const current = channel => counters.get(channel) || 0;

/**
 * Wrap a callback so it no-ops when its generation is stale.
 *
 * Prefer this to an explicit `if (stale(…)) return;` where the callback is
 * passed somewhere else, because the check cannot then be forgotten at the
 * other end.
 */
export function guard(channel, fn) {
  const token = current(channel);
  return (...args) => { if (!stale(channel, token)) return fn(...args); };
}
