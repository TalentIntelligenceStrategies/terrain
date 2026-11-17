/* R4-10 (restores R3-41) · Composer: an empty Search stays in the tab order and answers
 *
 * The build sets disabled on Search while the query cannot be submitted.
 * The patch takes that attribute off as soon as it is set and marks the
 * button aria-disabled="true" and data-r410-empty instead; emptiness is
 * read from the field (no text after trimming), which is what the build's
 * own submit check tracks. A press while empty (or Enter in the empty
 * field) is stopped before their handler, focuses the field and shows the
 * hint, whose text is the field's own aria-label; their handler would do
 * nothing anyway, since it makes the same check itself.
 *
 * Loading: their render sets aria-disabled while a search runs; the patch
 * leaves aria-disabled alone whenever the field has text. */
(() => {
  if (window.__r4_10) return;
  window.__r4_10 = true;
  const HINT_ID = 'r410-hint';
  const boxOf = el => el && el.closest('.search-box-morph');
  const fieldOf = box => box && box.querySelector('textarea');
  const searchOf = box => box && box.querySelector('button[aria-label="Search"]');
  const isEmpty = box => !(fieldOf(box)?.value || '').trim();

  function hide(box) {
    const w = box && box.parentElement;
    const h = w && w.querySelector(`:scope > #${HINT_ID}`);
    if (h) h.remove();
    const t = fieldOf(box);
    if (t && t.getAttribute('aria-describedby') === HINT_ID) t.removeAttribute('aria-describedby');
  }
  function show(box) {
    const t = fieldOf(box);
    if (!t) return;
    let h = box.parentElement.querySelector(`:scope > #${HINT_ID}`);
    if (!h) {
      h = document.createElement('p');
      h.id = HINT_ID;
      h.className = 'r410-hint';
      box.after(h);
    }
    h.textContent = t.getAttribute('aria-label') || t.getAttribute('placeholder') || '';
    t.setAttribute('aria-describedby', HINT_ID);
    t.focus();
  }

  function sync() {
    for (const box of document.querySelectorAll('.search-box-morph')) {
      const b = searchOf(box);
      if (!b) continue;
      const empty = isEmpty(box);
      if (b.hasAttribute('disabled')) b.removeAttribute('disabled');
      if (empty) {
        if (!b.hasAttribute('data-r410-empty')) b.setAttribute('data-r410-empty', '');
        if (b.getAttribute('aria-disabled') !== 'true') b.setAttribute('aria-disabled', 'true');
      } else if (b.hasAttribute('data-r410-empty')) {
        b.removeAttribute('data-r410-empty');
        b.removeAttribute('aria-disabled');
        hide(box);
      }
    }
  }

  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.search-box-morph button[aria-label="Search"]');
    const box = boxOf(b);
    if (!b || !isEmpty(box)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    show(box);
  }, true);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
    const t = e.target;
    const box = t && t.matches && t.matches('.search-box-morph textarea') ? boxOf(t) : null;
    if (box && isEmpty(box)) show(box);
  }, true);
  document.addEventListener('input', e => { if (boxOf(e.target)) sync(); }, true);
  new MutationObserver(sync).observe(document.body, {
    subtree: true, childList: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled'],
  });
  sync();
})();
