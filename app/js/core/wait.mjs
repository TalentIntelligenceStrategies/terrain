/* wait — the one pair that starts and ends every wait, and the other way one ends.
 *
 * THIS MODULE IS HALF A CONTRACT. app/styles/05-wait-fail.css is the other
 * half: `.is-wait` and `.is-fail` and the `.fail` block. They live in one CSS
 * file rather than beside each component because `.card-body.is-wait` and
 * `.rec-body.is-wait` span two component families FOR THE SAME REASON -- they
 * share one contract, not one appearance.
 */
import { $, esc } from './dom.mjs';
import { loader } from './loader.mjs';

/**
 * Put a region into its waiting state.
 *
 * THE HEIGHT IS CAPTURED BEFORE THE REGION EMPTIES, and that ordering is the
 * whole function. Without it a card body collapses to the loader's 20px, the
 * grid reflows, and it reflows again when the data lands -- two layout jumps
 * to say one thing arrived. Reserving what was there means the only thing that
 * changes is what is inside it.
 *
 * `min` is the floor for first paint: a region that has never been filled has
 * no previous height to capture and still has to be tall enough to hold a
 * loader without clipping it.
 */
export function waitOn(el, min) {
  if (!el) return;
  const h = Math.max(el.offsetHeight || 0, min || 0);
  if (h) el.style.minHeight = h + 'px';
  el.classList.add('is-wait');
  el.innerHTML = '';
  el.append(loader());
}

/**
 * The region now holds real content.
 *
 * BOTH CLASSES COME OFF, and `is-fail` is the one a retry needs. A failed
 * region stops being failed the moment a retry lands; leaving the class on
 * kept the body a centred grid and kept its caption suppressed under a chart
 * that had just redrawn.
 */
export function landIn(el, html) {
  if (!el) return;
  el.classList.remove('is-wait', 'is-fail');
  el.style.minHeight = '';
  if (html != null) el.innerHTML = html;
}

/**
 * The other way a wait ends.
 *
 * THE ONE DIFFERENCE FROM landIn IS THE LINE THAT IS NOT HERE: failIn does NOT
 * clear the inline min-height. Real content sets its own height; a sentence
 * does not, and the region would collapse. Two layout jumps to say one thing
 * did NOT arrive is the exact fault waitOn's reserve exists to prevent, and
 * failure is where it bites hardest -- the founder is already re-reading the
 * screen to work out what happened. This is deliberate, not an omission.
 */
export function failIn(el, html) {
  if (!el) return;
  el.classList.remove('is-wait');
  el.classList.add('is-fail');
  if (html != null) el.innerHTML = html;
}

/* Lucide triangle-alert at the file's one stroke weight. Failure uses exactly
 * one glyph, so it is written once rather than per host. Icons come from
 * Lucide and nowhere else -- mixing sets is visible in the stroke weight. */
const FAIL_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
  ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>' +
  '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';

/**
 * The failure block.
 *
 * `act` IS OPTIONAL BY RULE, not by convenience. platform.md §9 requires the
 * surface to offer `try again` ONLY where trying again could work: a block
 * with no way forward says so by HAVING NO BUTTON, rather than by having a
 * dead one. This is where the engine contract and the interface meet -- a port
 * returns `{ok:false, code, retryable}`, and `retryable` is exactly what
 * decides whether `act` is passed.
 *
 * Built here rather than written into each host for the reason the loader is:
 * a block that lives in nine copies of the markup is one nobody can change in
 * one place.
 */
export function failHTML(say, act) {
  return '<div class="fail">' +
    '<p class="fail-say">' + FAIL_ICON + '<span>' + esc(say) + '</span></p>' +
    (act
      ? '<div class="fail-act"><button class="btn btn-secondary" type="button"' +
        (act.id ? ' id="' + esc(act.id) + '"' : '') +
        (act.attrs ? ' ' + act.attrs : '') +
        '>' + esc(act.label) + '</button></div>'
      : '') +
    '</div>';
}
