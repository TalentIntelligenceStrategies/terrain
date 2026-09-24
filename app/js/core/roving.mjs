/* roving — one tab stop for a group, arrows to move inside it.
 *
 * WHY A GROUP GETS ONE TAB STOP. The map is up to 64 cells. Tabbing through 64
 * cells to reach the control after it is not navigation, it is an obstacle,
 * and the pattern that fixes it is the one every grid and toolbar uses: the
 * group is ONE stop, and the arrows move within it.
 *
 * tabindex="0" ON EXACTLY ONE MEMBER AT A TIME, and it moves with focus so
 * that leaving and returning lands back where the founder was rather than at
 * the start. That last part is the reason this is a module and not four lines
 * at each host: the re-entry behaviour is what gets dropped when it is
 * reimplemented.
 *
 * TWO EXPORTS, AND THE SECOND IS NOT A CONVENIENCE. roving() binds to ONE
 * container, which is right for the map and wrong for the result list: the
 * list holds twenty strips and rebuilds every one of them on every sort,
 * filter, re-rank and page. An instance per row is twenty constructions and
 * twenty teardowns a render, and the teardown that is forgotten leaks two
 * listeners a row without saying so. rovingIn() binds once, high up, and
 * resolves the group from the event's own target.
 */
import { focusQuietly } from './focus.mjs';
import { reduced } from './motion.mjs';

/**
 * @param container the element holding the items
 * @param itemSelector which descendants are the items
 * @param opts.orientation 'horizontal' | 'vertical' | 'grid'
 * @param opts.columns     required for 'grid' — how many per row
 */
export function roving(container, itemSelector, opts = {}) {
  if (!container) return { refresh() {}, destroy() {} };
  const { orientation = 'horizontal', columns = 1 } = opts;
  const items = () => Array.from(container.querySelectorAll(itemSelector));

  function refresh(focusIndex) {
    const list = items();
    if (!list.length) return;
    const at = Math.max(0, Math.min(focusIndex ?? list.findIndex(n => n.tabIndex === 0), list.length - 1));
    const idx = at < 0 ? 0 : at;
    list.forEach((n, i) => { n.tabIndex = i === idx ? 0 : -1; });
    return list[idx];
  }

  function onKeydown(e) {
    const list = items();
    const at = list.indexOf(document.activeElement);
    if (at < 0) return;
    const horizontal = orientation !== 'vertical';
    const vertical   = orientation !== 'horizontal';
    let next = at;
    if (horizontal && e.key === 'ArrowRight') next = at + 1;
    else if (horizontal && e.key === 'ArrowLeft') next = at - 1;
    else if (vertical && e.key === 'ArrowDown') next = orientation === 'grid' ? at + columns : at + 1;
    else if (vertical && e.key === 'ArrowUp')   next = orientation === 'grid' ? at - columns : at - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End')  next = list.length - 1;
    else return;
    /* CLAMPED, NOT WRAPPED. A grid that wraps from the end of one row to the
     * start of the next reads as the cursor jumping; a map is a shape and the
     * arrow keys should describe that shape. */
    next = Math.max(0, Math.min(next, list.length - 1));
    if (next === at) { e.preventDefault(); return; }
    e.preventDefault();
    list[at].tabIndex = -1;
    list[next].tabIndex = 0;
    list[next].focus();
  }

  /* Focus moving into a member by any route -- a click, a screen reader -- must
   * move the tab stop with it, or the next Tab out and back lands elsewhere. */
  function onFocusIn(e) {
    const list = items();
    const at = list.indexOf(e.target);
    if (at >= 0) refresh(at);
  }

  container.addEventListener('keydown', onKeydown);
  container.addEventListener('focusin', onFocusIn);
  refresh(0);

  return {
    refresh,
    destroy() {
      container.removeEventListener('keydown', onKeydown);
      container.removeEventListener('focusin', onFocusIn);
    },
  };
}


/* ── the same behaviour, for N groups that come and go ────────────────────
 * Bound ONCE at a stable ancestor. Everything about the key handling is
 * roving()'s above, including the clamp: a strip is a shape, and the arrows
 * should describe that shape rather than cycle through it.
 *
 * focusQuietly AND NOT .focus(). The group is a horizontal scroller inside a
 * column that is itself overflow:hidden; a plain focus() scrolls every
 * ancestor to reveal the item and yanks the whole column sideways. The scroll
 * is then asked for explicitly and on both axes, which is the idiom
 * figure-viewer.mjs already uses for a strip following its figure.
 *
 * ArrowUp AND ArrowDown ARE DELIBERATELY NOT CLAIMED. They scroll the list,
 * which is what a founder halfway down a column expects them to do; a strip
 * that swallowed them would trap the reader inside one row's drawings.
 *
 * @param host       a stable ancestor — document is fine, it is one listener
 * @param groupSel   which ancestor is the group
 * @param itemSel    which descendants are the items
 */
export function rovingIn(host, groupSel, itemSel) {
  const root = host || document;

  function group(e) {
    const item = e.target instanceof Element ? e.target.closest(itemSel) : null;
    return item && item.closest(groupSel) ? item : null;
  }

  function onKeydown(e) {
    if (e.defaultPrevented) return;
    const item = group(e);
    if (!item) return;
    const list = Array.from(item.closest(groupSel).querySelectorAll(itemSel));
    const at = list.indexOf(item);
    if (at < 0) return;
    let next = at;
    if (e.key === 'ArrowRight') next = at + 1;
    else if (e.key === 'ArrowLeft') next = at - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = list.length - 1;
    else return;
    e.preventDefault();
    next = Math.max(0, Math.min(next, list.length - 1));
    if (next === at) return;
    list[at].tabIndex = -1;
    list[next].tabIndex = 0;
    focusQuietly(list[next]);
    list[next].scrollIntoView({ block: 'nearest', inline: 'nearest',
                               behavior: reduced() ? 'auto' : 'smooth' });
  }

  /* focus arriving by any other route moves the stop with it, or the next Tab
   * out and back lands somewhere else in the strip. */
  function onFocusIn(e) {
    const item = group(e);
    if (!item) return;
    item.closest(groupSel).querySelectorAll(itemSel)
      .forEach(n => { n.tabIndex = n === item ? 0 : -1; });
  }

  root.addEventListener('keydown', onKeydown);
  root.addEventListener('focusin', onFocusIn);
  return () => {
    root.removeEventListener('keydown', onKeydown);
    root.removeEventListener('focusin', onFocusIn);
  };
}
