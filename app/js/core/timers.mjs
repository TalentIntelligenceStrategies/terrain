/* timers — a scope that can cancel everything it started.
 *
 * WHY THIS EXISTS RATHER THAN setTimeout. There are 66 timer calls in the
 * prototype and each one is cleared, or not, by hand. Every "or not" is a
 * callback that fires into a surface that has moved on -- a pane hidden after
 * a transition that was interrupted, a loader mounted in a body nobody is
 * looking at. The generation counters catch the ones that write; this catches
 * the ones that were never meant to run at all.
 *
 * ONE SCOPE PER SURFACE, cancelled in the surface's own teardown. A timer
 * started outside a scope is a timer nobody can cancel, which is fine when it
 * is genuinely fire-and-forget and is a bug the rest of the time.
 */
export function timerScope() {
  const live = new Set();

  const after = (ms, fn) => {
    const id = setTimeout(() => { live.delete(id); fn(); }, ms);
    live.add(id);
    return id;
  };

  const every = (ms, fn) => {
    const id = setInterval(fn, ms);
    live.add(id);
    return id;
  };

  const cancel = id => {
    if (!id) return;
    clearTimeout(id); clearInterval(id);
    live.delete(id);
  };

  /** Cancel everything this scope started. Idempotent. */
  const cancelAll = () => {
    for (const id of live) { clearTimeout(id); clearInterval(id); }
    live.clear();
  };

  return { after, every, cancel, cancelAll, get size() { return live.size; } };
}

/** A promise that resolves after `ms`. Use inside a scope where cancellation matters. */
export const wait = ms => new Promise(r => setTimeout(r, ms));
