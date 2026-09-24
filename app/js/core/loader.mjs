/* loader — one mark, one size, no variants, no region scaling.
 *
 * THIRD PARTY, AND THE LICENCE IS NOT INCIDENTAL. The motion is ported from
 * zzzzshawn/matrix at that library's own props and timings, under a Custom
 * Proprietary License that PERMITS use inside a product and FORBIDS
 * republishing it as a standalone reusable component. It may live here. It may
 * not be lifted into a component library of ours. app/README.md carries the
 * same note where somebody planning a library will read it.
 *
 * WHAT A WAIT LOOKS LIKE IS A LOADER, NOT A SKELETON. A bar is the refusal to
 * invent a value and is permanent; a loader is work in flight and goes when
 * the work does. design-language.md §8 is the skeleton contract that draws
 * that line.
 *
 * THERE WERE TWO FOR A DAY AND THAT WAS THE WRONG CALL. The first split was on
 * MEANING -- a travelling trail for "being built", a quiet pulse for "being
 * changed" -- and nobody reads two indicators as a vocabulary. They read them
 * as two things and then as an inconsistency, and the question a second loader
 * raises is "why is this one different", which is not a question about the
 * data. It also dragged in scaling: the smaller loader was lost in a 986px
 * card, so the span started following the region, and then no two waits on the
 * screen were the same object. A loader is a fixed mark meaning "working"; the
 * moment its size carries information it is a chart.
 *
 * A SECOND LOADER NOW NEEDS THE ARGUMENT THE FIRST ONE DID NOT HAVE TO MAKE,
 * and the test is design-language.md §6's: could a transition have done this?
 */
import { reduced } from './motion.mjs';

/* The five band values are precomputed. The library reaches them through
 * wave3PathOpacityFromNorm then remapOpacityToTriplet, and porting both to
 * recover five constants would be carrying its generality to produce a fixed
 * answer. Band 4 checks by hand: raw 0.88, between SOURCE_MID .34 and
 * SOURCE_PEAK .94, so .38 + .56 * ((.88-.34)/.60) = 0.884. */
const REST3 = [0.045, 0.2323, 0.4173, 0.6507, 0.884];

/**
 * The control loader: a 3x3 drift at 20px.
 *
 * THE SIZE RULE IS ABOUT FIT, NOT MEANING, which is why it raises none of the
 * questions the meaning-split did: a 36px grid does not go inside a 20px-tall
 * button, and forcing it made the list's foot grow by 16px every time somebody
 * asked for one more page. Fit is not a claim about the data.
 */
export function loader() {
  const N = 3, DOT = 6, PAD = 1, SPEED = 1.15;
  const span = DOT * N + PAD * (N - 1);                              /* 20 */
  const root = document.createElement('div');
  root.className = 'dmx-root dmx-matrix-3';
  root.setAttribute('aria-hidden', 'true');
  root.style.width = root.style.height = span + 'px';
  root.style.setProperty('--dmx-speed', String(1 / SPEED));
  root.style.setProperty('--dmx-opacity-base', '0.06');
  root.style.setProperty('--dmx-opacity-mid', '0.38');

  const grid = document.createElement('div');
  grid.className = 'dmx-grid';
  grid.style.gap = PAD + 'px';
  grid.style.gridTemplateColumns = `repeat(${N},minmax(0,1fr))`;
  grid.style.gridTemplateRows = `repeat(${N},minmax(0,1fr))`;

  for (let i = 0; i < N * N; i++) {
    const band = Math.floor(i / N) + (i % N);
    const dot = document.createElement('span');
    dot.className = 'dmx-dot dmx-path-3';
    dot.style.width = dot.style.height = DOT + 'px';
    dot.style.setProperty('--dmx-path', String(band / 4));
    /* SET PER DOT, AND THE CSS CARRIES A FALLBACK ANYWAY. Under reduced motion
     * the grid holds the positional ramp it would otherwise animate through,
     * rather than going to one flat tone -- so the loader is present, visible
     * and motionless. If this markup is ever shipped STATICALLY, with nothing
     * running this function, --rest is unset: `opacity` does not inherit, so
     * `opacity:var(--rest)` would then be invalid at computed-value time and
     * the property would take its INITIAL value of 1, rendering every dot at
     * full strength as a solid block. The fallback in 04-loader.css is what
     * makes the static case render flat instead, and that case is the handoff
     * case exactly. */
    dot.style.setProperty('--rest', String(REST3[band]));
    grid.append(dot);
  }
  root.append(grid);
  return root;
}

/** True when the loader will be still rather than moving. For tests and the bench. */
export const loaderIsStill = () => reduced();
