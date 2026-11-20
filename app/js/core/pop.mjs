/* core/pop — the popovers: one open at a time, anchored to their button.
 *
 * From the V8 lab. A pointer opening fades and scales in from the button's
 * corner; a keyboard opening skips the motion and moves focus into the panel.
 * A press outside closes it; Escape closes it and returns focus to its button
 * (the page's key handler asks isOpen() first, so Escape closes the innermost
 * thing). Inside a menu, the arrow keys move between its items.
 */
let openPop = null, openBtn = null, onClose = null;

export const isOpen = () => !!openPop;
export const current = () => openPop;

export function close(refocus) {
  if (!openPop) return;
  openPop.removeAttribute('data-open');
  openBtn.setAttribute('aria-expanded', 'false');
  const btn = openBtn, after = onClose;
  openPop = openBtn = onClose = null;
  if (refocus) btn.focus();
  if (after) after();
}

export function open(btn, pop, byKey, closed) {
  close();
  pop.toggleAttribute('data-instant', !!byKey);
  pop.setAttribute('data-open', '');
  btn.setAttribute('aria-expanded', 'true');
  openPop = pop; openBtn = btn; onClose = closed || null;
  if (byKey) pop.querySelector('button:not([aria-disabled="true"]), input')?.focus();
}

/** btn toggles pop; onOpen runs before it opens, to fill or reset it */
export function wire(btn, pop, onOpen, closed) {
  if (!btn || !pop) return;
  btn.addEventListener('click', e => {
    if (openPop === pop) return close();
    onOpen?.();
    open(btn, pop, e.detail === 0, closed);
  });
}

document.addEventListener('click', e => {
  if (openPop && !openPop.contains(e.target) && !openBtn.contains(e.target)) close();
});

document.addEventListener('keydown', e => {
  if (!openPop) return;
  if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && openPop.matches('.menu')) {
    const items = [...openPop.querySelectorAll('button:not([aria-disabled="true"])')];
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement);
    const n = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
    items[n].focus();
  }
});
