/* focus — where focus goes, and the flag that stops a pane jumping.
 *
 * `preventScroll` IS THE FIX FOR THE JUMP AND IT IS THE WHOLE OF IT. On open,
 * the record pane is still at its off-screen transform, entirely outside its
 * column's box -- and AN overflow:hidden BOX IS STILL PROGRAMMATICALLY
 * SCROLLABLE, so a focus that scrolls into view yanks the pane sideways in one
 * frame while the slide is starting. One call omitted the flag and that single
 * omission is what read as "the record jumps when it opens".
 *
 * THE RECORD IS NOT MODAL AND THERE IS NO FOCUS TRAP. The overlay leaves a
 * ~200px peek so the map behind stays READABLE, which is the whole point of
 * the peek, and the left list stays live throughout because the record never
 * covers it -- the founder can pick the next patent without closing this one.
 * What goes inert is the covered pane: 880px of controls a keyboard would tab
 * into and a pointer could never reach. A CONTROL YOU CAN FOCUS AND CANNOT SEE
 * IS WORSE THAN ONE YOU CANNOT FOCUS.
 */

/** Focus without scrolling anything into view. The default for anything mid-transition. */
export function focusQuietly(node) {
  if (node) node.focus({ preventScroll: true });
}

/**
 * Remember what had focus, and hand back a function that returns it.
 *
 * `isConnected` IS THE CHECK THAT MATTERS: the element focus came from may
 * have been re-rendered away while the overlay was open -- a list row after a
 * re-rank is the ordinary case -- and focusing a detached node silently drops
 * focus to <body> instead. The fallback keeps the keyboard somewhere sensible.
 */
export function captureFocus(fallback) {
  const from = document.activeElement;
  return function restore() {
    if (from && from.isConnected && from !== document.body) { from.focus(); return from; }
    const alt = typeof fallback === 'function' ? fallback() : fallback;
    if (alt && alt.isConnected) { alt.focus(); return alt; }
    return null;
  };
}

/**
 * Make a subtree unreachable while something covers it.
 *
 * `inert` AND NOT `aria-hidden`. aria-hidden removes it from the accessibility
 * tree and leaves it in the tab order, which is the worst of both: a sighted
 * keyboard user tabs into controls a screen reader says are not there.
 */
export function setInert(node, on) {
  if (!node) return;
  if (on) node.setAttribute('inert', '');
  else node.removeAttribute('inert');
}

/** The focusable descendants of a node, in tab order. */
const FOCUSABLE =
  'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),' +
  'textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';
export function focusables(root) {
  return Array.from((root || document).querySelectorAll(FOCUSABLE))
    .filter(n => !n.closest('[inert]') && n.offsetParent !== null);
}
