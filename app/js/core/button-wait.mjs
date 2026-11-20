/* button-wait — the control that carries its own wait.
 *
 * THE BUTTON IS WHAT WAS PRESSED, so where a wait changes nothing on screen
 * except the thing the press asked for, the button holds it: Search, Find
 * similar, a sort.
 *
 * THE LABEL STAYS AND THE INK DROPS. There is no loader (design-language.md
 * §6): `data-waiting` reduces the control's ink in CSS, without motion, and
 * `aria-busy` says it is working to a screen reader. The accessible name is
 * the visible label throughout, because nothing hides it.
 *
 * NOT `disabled`: the founder's focus is on this button -- they just pressed
 * it -- and disabling a focused control drops focus to <body>. The re-press
 * guard is the RETURN VALUE.
 */

/**
 * Put a button into its waiting state. Returns false if it was already waiting,
 * which is the re-press guard: `if (!btnWait(b)) return;`
 */
export function btnWait(btn) {
  if (!btn || btn.hasAttribute('data-waiting')) return false;
  btn.setAttribute('data-waiting', '');
  btn.setAttribute('aria-busy', 'true');
  return true;
}

/** Return a button to rest. Safe to call on a button that never waited. */
export function btnRest(btn) {
  if (!btn) return;
  btn.removeAttribute('data-waiting');
  btn.removeAttribute('aria-busy');
}
