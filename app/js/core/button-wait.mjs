/* button-wait — the control that carries its own wait.
 *
 * THE BUTTON IS WHAT WAS PRESSED, so where a wait changes nothing on screen
 * except the thing the press asked for, the button holds it. `Show more`
 * argued this first -- the rows above are untouched, they arrived and they are
 * still here, so emptying the column would claim the whole list was being
 * re-fetched when only the next slice is -- and a message send is the same
 * shape: there is no region to empty, because nothing on screen is being
 * replaced.
 *
 * ***THE ACCESSIBLE NAME HAS TO BE CARRIED ACROSS, AND THAT IS A DEFECT THE
 * EXTRACTION FOUND.*** The CSS hides every child with display:none, and
 * display:none content is EXCLUDED FROM THE ACCESSIBLE NAME COMPUTATION -- so
 * for the length of the beat the button announced as a button with no name at
 * all. Nothing visual shows it and no render can catch it. The label is read
 * off the control before it goes and put back as aria-label, so the name is
 * the same name throughout, and aria-busy is what says it is working.
 *
 * NOT `disabled`, for the reason the gate is not: the founder's focus is on
 * this button -- they just pressed it -- and disabling a focused control drops
 * focus to <body>. The re-press guard is the RETURN VALUE.
 */
import { $ } from './dom.mjs';
import { loader } from './loader.mjs';

/**
 * Put a button into its waiting state. Returns false if it was already waiting,
 * which is the re-press guard: `if (!btnWait(b)) return;`
 *
 * `reserve` is OPT-IN because the reserve is a fact about the button's
 * NEIGHBOURS rather than about the button. `Show more` sits after a spacer at
 * the end of a flex row with nothing to its right, and a reserve there only
 * centred the loader inside an invisible box held off the edge it belongs on.
 * A send button with a sentence beside it would let that sentence slide.
 */
export function btnWait(btn, reserve) {
  if (!btn || btn.hasAttribute('data-waiting')) return false;
  /* MEASURED BEFORE THE LABEL GOES, or it measures the loader. */
  if (reserve) btn.style.minWidth = btn.offsetWidth + 'px';
  /* Only where there was no resting aria-label to overwrite -- a control whose
   * label is maintained by something else would be clobbered, and that is
   * worse than the gap. */
  const name = (btn.textContent || '').trim();
  if (name && !btn.hasAttribute('aria-label')) {
    btn.setAttribute('aria-label', name);
    btn.setAttribute('data-wait-named', '');
  }
  btn.setAttribute('data-waiting', '');
  btn.setAttribute('aria-busy', 'true');
  const slot = document.createElement('span');
  slot.className = 'btn-wait is-wait';
  slot.append(loader());
  btn.append(slot);
  return true;
}

/** Return a button to rest. Safe to call on a button that never waited. */
export function btnRest(btn) {
  if (!btn) return;
  btn.removeAttribute('data-waiting');
  btn.removeAttribute('aria-busy');
  if (btn.hasAttribute('data-wait-named')) {
    btn.removeAttribute('aria-label');
    btn.removeAttribute('data-wait-named');
  }
  btn.style.minWidth = '';
  const slot = $('.btn-wait', btn);
  if (slot) slot.remove();
}
