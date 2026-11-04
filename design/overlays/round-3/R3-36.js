/* R3-36 · Every control, touch: the hit areas and the row tap. See R3-36.css.
 *
 * For each visible control under 44px on either side whose position is
 * static or relative and whose ::after is unused, writes data-r336 and the
 * reach on each side: (44 - size) / 2, cut to half the gap to the nearest
 * control on that side, so no two areas overlap. That cut is the patch's
 * stand-in: the component moves such controls apart instead (R3-36.css).
 * Recomputed on layout change; only under (pointer: coarse). */
(() => {
  if (window.__r3_36) return;
  window.__r3_36 = true;
  const mq = matchMedia('(pointer: coarse)');
  const SEL = 'button, a[href], [role="button"], [role="checkbox"], [role="radio"], [role="menuitem"], [role="tab"], summary, select';
  const visible = r => r.width > 1 && r.height > 1 && r.bottom > -200 && r.top < innerHeight + 200;
  let queued = false;
  const clear = () => {
    for (const e of document.querySelectorAll('[data-r336]')) {
      e.removeAttribute('data-r336');
      for (const k of ['t', 'r', 'b', 'l']) e.style.removeProperty(`--r336-${k}`);
    }
  };
  const run = () => {
    queued = false;
    clear();
    if (!mq.matches) return;
    const all = [...document.querySelectorAll(SEL)]
      .map(e => ({ e, r: e.getBoundingClientRect() }))
      .filter(({ e, r }) => visible(r) && getComputedStyle(e).visibility !== 'hidden');
    for (const { e, r } of all) {
      if (r.width >= 44 && r.height >= 44) continue;
      const cs = getComputedStyle(e);
      if (cs.position !== 'static' && cs.position !== 'relative') continue;
      if (getComputedStyle(e, '::after').content !== 'none') continue;
      const ex = Math.max(0, (44 - r.width) / 2), ey = Math.max(0, (44 - r.height) / 2);
      let t = ey, b = ey, l = ex, rr = ex;
      for (const o of all) {
        if (o.e === e || o.e.contains(e) || e.contains(o.e)) continue;
        const q = o.r;
        const vOverlap = q.top < r.bottom + ey && q.bottom > r.top - ey;
        const hOverlap = q.left < r.right + ex && q.right > r.left - ex;
        if (vOverlap && q.left >= r.right) rr = Math.min(rr, (q.left - r.right) / 2);
        if (vOverlap && q.right <= r.left) l = Math.min(l, (r.left - q.right) / 2);
        if (hOverlap && q.top >= r.bottom) b = Math.min(b, (q.top - r.bottom) / 2);
        if (hOverlap && q.bottom <= r.top) t = Math.min(t, (r.top - q.bottom) / 2);
      }
      e.setAttribute('data-r336', '');
      e.style.setProperty('--r336-t', `${t}px`);
      e.style.setProperty('--r336-r', `${rr}px`);
      e.style.setProperty('--r336-b', `${b}px`);
      e.style.setProperty('--r336-l', `${l}px`);
    }
    for (const c of document.querySelectorAll('[data-result-card]')) c.setAttribute('data-r336-card', '');
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(() => setTimeout(run, 60)); } };
  /* The row as one tap target: a press that starts on a control is the
     control's; anything else on the card opens its record. */
  document.addEventListener('click', ev => {
    if (!mq.matches) return;
    const card = ev.target.closest && ev.target.closest('[data-result-card]');
    if (!card || ev.target.closest(SEL + ', input, textarea, [contenteditable]')) return;
    if (getSelection && String(getSelection()).length) return;
    const primary = card.querySelector('button[data-card-primary]');
    if (primary) primary.click();
  });
  new MutationObserver(m => { if (m.some(x => !(x.type === 'attributes' && /^data-r336|^style$/.test(x.attributeName)))) queue(); })
    .observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-expanded', 'data-state'] });
  addEventListener('resize', queue);
  addEventListener('scroll', queue, { passive: true, capture: true });
  mq.addEventListener('change', queue);
  run();
})();
