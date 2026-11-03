/* R3-41 · Composer: an empty Search stays in the tab order and answers
 *
 * Their render sets disabled on Search while !canSubmit. The patch takes
 * that attribute off as soon as it is set and marks the button
 * aria-disabled="true" and data-r341-empty instead; emptiness is read from
 * the field (no text after trimming), which is what canSubmit tracks on
 * this page. A press while empty (or Enter in the empty field) is stopped
 * before their handler, focuses the field and shows the hint; their
 * handler would do nothing anyway, since it checks canSubmit itself.
 *
 * Loading: their render sets aria-disabled while a search runs; the patch
 * leaves aria-disabled alone whenever the field has text. */
(() => {
  if (window.__r3_41) return;
  window.__r3_41 = true;
  const HINT_ID = 'r341-hint';
  const TEXT = {
    text: 'Describe what you are building, e.g. hinge structure for foldable displays',
    number: 'Patent publication or grant number, e.g. EP4047638A1',
  };
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
    const number = box.querySelector('[role="group"][aria-label="Search mode"] > button[aria-label="Patent number"]')?.getAttribute('aria-pressed') === 'true';
    let h = box.parentElement.querySelector(`:scope > #${HINT_ID}`);
    if (!h) {
      h = document.createElement('p');
      h.id = HINT_ID;
      h.className = 'r341-hint';
      box.after(h);
    }
    h.textContent = number ? TEXT.number : TEXT.text;
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
        if (!b.hasAttribute('data-r341-empty')) b.setAttribute('data-r341-empty', '');
        if (b.getAttribute('aria-disabled') !== 'true') b.setAttribute('aria-disabled', 'true');
      } else if (b.hasAttribute('data-r341-empty')) {
        b.removeAttribute('data-r341-empty');
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
