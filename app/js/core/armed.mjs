/* armed — a registry for the flags that arm a one-shot behaviour.
 *
 * WHAT AN ARMED FLAG IS. Something sets it; the NEXT press of one particular
 * control consumes it; then it is gone. The demo router uses them to compose a
 * failure state from the real handler rather than by posing one -- #build-failed
 * arms the search failure, and Approve then reaches its other exit for real.
 * Nothing about that is demo-only: the same shape is how a retry budget, a
 * one-time hint or a first-run nudge works.
 *
 * WHY A REGISTRY AND NOT A LIST OF VARIABLES. The prototype disarms nine of
 * these by hand at the top of the router, under a comment that says
 * "***EVERY ARMED FAILURE IS DISARMED HERE, and the list has to stay whole.***"
 * A list that has to stay whole, maintained by hand, in the one file that is
 * being deleted, is three problems:
 *
 *   1 · A flag that survives a route fires on a founder who came back through
 *       the state list and pressed something unrelated.
 *   2 · Adding a tenth flag means remembering to add it in a second place, and
 *       forgetting is SILENT -- everything works until the one path that reuses
 *       a stale flag.
 *   3 · It lives inside the demo router. Delete the router and the discipline
 *       goes with it, while the flags it was disarming remain.
 *
 * Registering is the only way to create one, so the list cannot be incomplete.
 *
 * disarmAll() HAS TWO REAL CALLERS AND ALWAYS DID. The router is one; NEW
 * SEARCH is the other, and it resets the same set through a different path. It
 * outlives the router by more than a technicality.
 */

const flags = new Map();

/**
 * Declare a flag. `initial` is what disarmAll() restores it to -- which is not
 * always falsy: a filtered list resets to its full starting set, not to
 * empty, so "disarmed" means "back to the resting value" rather than "off".
 */
export function register(name, initial = 0) {
  flags.set(name, { value: clone(initial), initial });
  return name;
}

function clone(v) {
  if (Array.isArray(v)) return v.slice();
  if (v && typeof v === 'object') return { ...v };
  return v;
}

function entry(name) {
  const f = flags.get(name);
  if (!f) throw new Error(`armed: ${name} was never registered. register() it beside the ` +
                          `behaviour it arms, or disarmAll() cannot know about it.`);
  return f;
}

export const get = name => entry(name).value;
export const set = (name, value) => { entry(name).value = value; return value; };
export const arm = name => set(name, 1);

/** Read and clear in one step. This is what a one-shot consumer should call. */
export function consume(name) {
  const f = entry(name);
  const v = f.value;
  f.value = clone(f.initial);
  return v;
}

/**
 * Every flag back to its resting value.
 *
 * Called on entering any state, and by New search. It cannot miss one, which
 * is the entire reason this module exists.
 */
export function disarmAll() {
  for (const f of flags.values()) f.value = clone(f.initial);
}

/** For the bench and for a test: what is armed right now. */
export function armedNow() {
  return [...flags.entries()]
    .filter(([, f]) => JSON.stringify(f.value) !== JSON.stringify(f.initial))
    .map(([name]) => name);
}

/** Every registered name, for a check that the registry and the docs agree. */
export const registered = () => [...flags.keys()];
