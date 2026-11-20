/* wait — the one pair that starts and ends every wait, and the other way one ends.
 *
 * THERE IS NO LOADER (design-language.md §6). A region that is waiting keeps
 * what it holds, dimmed, with aria-busy on it, until the answer replaces it;
 * a region that held nothing stays empty at its reserved height. Nothing
 * moves to say a request is in flight, and nothing holds the answer back.
 *
 * THIS MODULE IS HALF A CONTRACT. app/styles/05-wait-fail.css is the other
 * half: `.is-wait` and `.is-fail` and the `.fail` block.
 */
import { $, esc } from './dom.mjs';

/**
 * Put a region into its waiting state.
 *
 * THE HEIGHT IS RESERVED, so the arrival is one change rather than a collapse
 * and a second reflow. `min` is the floor for a region that has never been
 * filled and has no height of its own to keep.
 *
 * WHAT IS ON SCREEN STAYS, DIMMED, rather than being emptied: a blank panel
 * for the length of a request claims there is nothing, and the rows a
 * founder was just reading are still the truest thing to show until the new
 * ones land. A failure block left from the last request is cleared, because
 * it is about a request that is no longer the one in flight.
 */
export function waitOn(el, min) {
  if (!el) return;
  const h = Math.max(el.offsetHeight || 0, min || 0);
  if (h) el.style.minHeight = h + 'px';
  if (el.classList.contains('is-fail')) { el.classList.remove('is-fail'); el.innerHTML = ''; }
  el.classList.add('is-wait');
  el.setAttribute('aria-busy', 'true');
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
  el.removeAttribute('aria-busy');
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
  el.removeAttribute('aria-busy');
  el.classList.add('is-fail');
  if (html != null) el.innerHTML = html;
}

/* Lucide triangle-alert at the file's one stroke weight. Failure uses exactly
 * one glyph, so it is written once rather than per host. Icons come from
 * Lucide and nowhere else -- mixing sets is visible in the stroke weight. */
const FAIL_ICON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
  ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' +
  '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';

/**
 * The failure block.
 *
 * `act` IS OPTIONAL BY RULE, not by convenience. platform.md §7 requires the
 * surface to offer `try again` ONLY where trying again could work: a block
 * with no way forward says so by HAVING NO BUTTON, rather than by having a
 * dead one. This is where the engine contract and the interface meet -- a port
 * returns `{ok:false, code, retryable}`, and `retryable` is exactly what
 * decides whether `act` is passed.
 *
 * Built here rather than written into each host: a block that lives in nine
 * copies of the markup is one nobody can change in one place. Its button is
 * the standard control, `.ctl`, like every other on the page.
 */
export function failHTML(say, act) {
  return '<div class="fail">' +
    '<p class="fail-say">' + FAIL_ICON + '<span>' + esc(say) + '</span></p>' +
    (act
      ? '<div class="fail-act"><button class="ctl" type="button"' +
        (act.id ? ' id="' + esc(act.id) + '"' : '') +
        (act.attrs ? ' ' + act.attrs : '') +
        '>' + esc(act.label) + '</button></div>'
      : '') +
    '</div>';
}

/**
 * failWith(el, say, retry) — the whole third ending, in one call.
 *
 * WHY THIS EXISTS AND WHY IT IS HERE. failHTML builds MARKUP and wires
 * NOTHING; the caller has to find the button and bind it. Five surfaces did
 * that by hand, and every one of them passed a FUNCTION where failHTML wants
 * `{label}` — so `esc(act.label)` printed the string "undefined" on the
 * button, and the button did nothing when pressed. Both faults at once, in
 * every failure block in the product, and neither is visible until a port
 * actually refuses.
 *
 * `retry` IS THE WHOLE SWITCH, and it comes straight from the port's
 * `retryable`. Pass a function and the block offers `Try again` and calls it;
 * pass nothing and the block says there is no way forward BY HAVING NO BUTTON,
 * which is platform.md §7's rule rather than this function's convenience.
 *
 * `{ once: true }` because a retry that is pressed twice while the first is in
 * flight is two requests for one intention — and the block is replaced by the
 * next ending either way.
 */
export function failWith(el, say, retry) {
  if (!el) return;
  failIn(el, failHTML(say, retry ? { label: 'Try again' } : null));
  if (!retry) return;
  const btn = el.querySelector('.fail-act button');
  if (btn) btn.addEventListener('click', retry, { once: true });
}
