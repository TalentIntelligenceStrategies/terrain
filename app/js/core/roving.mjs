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
 */

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
