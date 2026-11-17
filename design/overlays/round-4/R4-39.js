/* R4-39 (restores R3-09) · Patent record (phone): Export is two buttons, and a download says its name
 *
 * Adds CSV and Markdown buttons (your .record-act style, Lucide download
 * icon) to the record's footer and a status line under them. A press opens
 * your export menu with Enter on its trigger, hidden, chooses the matching
 * item, reads the file name from your download anchor, and writes it to
 * the status line. Focus returns to the pressed button.
 * Viewport: phone, below sm (40rem), re-evaluated on change. Idempotent. */
(() => {
  if (window.__r4_39) return;
  window.__r4_39 = true;
  const phone = matchMedia('not all and (min-width: 40rem)');
  const ICON = '<svg class="record-act-i" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>';
  const wait = (fn, ms) => new Promise(res => {
    const t0 = performance.now();
    const tick = () => { const v = fn(); if (v || performance.now() - t0 > ms) res(v); else requestAnimationFrame(tick); };
    tick();
  });

  async function exportAs(label, btn) {
    const foot = btn.closest('.record-foot');
    const trigger = foot?.querySelector(':scope > button[aria-expanded]');
    const status = foot?.querySelector('[data-r4-export-status]');
    if (!trigger) return;
    const html = document.documentElement;
    html.setAttribute('data-r4-exporting', '');
    let name = null;
    const click = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () { if (this.download) name = this.download; return click.call(this); };
    try {
      if (trigger.getAttribute('aria-expanded') !== 'true') {
        trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
      }
      const item = await wait(() => [...document.querySelectorAll('.record-export-item')].find(i => i.textContent.trim() === label), 1500);
      item?.click();
      await wait(() => !document.querySelector('.record-export-menu'), 800);
    } finally {
      HTMLAnchorElement.prototype.click = click;
      html.removeAttribute('data-r4-exporting');
      btn.focus({ preventScroll: true });
    }
    if (status && name) {
      status.textContent = 'Downloaded ';
      const s = document.createElement('span');
      s.textContent = name;
      status.append(s);
    }
  }

  const run = () => {
    for (const foot of document.querySelectorAll('[role="dialog"][data-result-detail] .record-foot')) {
      const have = foot.querySelector(':scope > [data-r4-export]');
      if (!phone.matches) { have?.remove(); foot.querySelector(':scope > [data-r4-export-status]')?.remove(); continue; }
      /* A confirmation belongs to the record it was made from. */
      const pn = foot.closest('[role="dialog"]')?.querySelector('[class*="overflow-y-auto"] p.font-mono')?.textContent.trim() || '';
      const old = foot.querySelector(':scope > [data-r4-export-status]');
      if (old && old.getAttribute('data-r4-pn') !== pn) { old.setAttribute('data-r4-pn', pn); if (old.textContent) old.textContent = ''; }
      if (have && have === foot.lastElementChild?.previousElementSibling) continue;
      const wrap = have || document.createElement('div');
      if (!have) {
        wrap.setAttribute('data-r4-export', '');
        for (const [label, aria] of [['CSV', 'Download this record as CSV'], ['Markdown', 'Download this record as Markdown']]) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'record-act focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
          b.setAttribute('aria-label', aria);
          b.innerHTML = ICON + label;
          b.addEventListener('click', () => exportAs(label, b));
          wrap.append(b);
        }
      }
      const status = foot.querySelector(':scope > [data-r4-export-status]') || document.createElement('p');
      status.setAttribute('data-r4-export-status', '');
      status.setAttribute('role', 'status');
      foot.append(wrap, status);
    }
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; run(); }); } };
  run();
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
  phone.addEventListener('change', run);
})();
