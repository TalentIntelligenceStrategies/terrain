/* core/viewer — the enlarged drawing. From the V8 lab's viewer.mjs; its CSS
 * is 40-viewer.css.
 *
 * A panel over the one scrim; the head names the patent and "Drawing N of M";
 * square previous / next on the stage's edges; a floating tool bar (rotate
 * left, rotate right, reset rotation, zoom out, the zoom, zoom in, fill the
 * screen); and a strip of every drawing along the foot. Escape or a press on
 * the scrim closes it and returns focus; the page behind is inert while it is
 * open. It is the innermost thing, so it takes Escape, the arrows, + / - and
 * Tab before the page does.
 *
 * A DRAWING WE DECLINE TO SHOW (src null) OR ONE THAT FAILS TO LOAD says so on
 * the stage rather than leaving a blank sheet: a white rectangle reads as a
 * drawing with nothing on it.
 */
const I = {
  prev: '<path d="m15 18-6-6 6-6"/>', next: '<path d="m9 18 6-6-6-6"/>', close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  rl: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  rr: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  reset: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  zo: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/>',
  zi: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  fill: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>',
  unfill: '<path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/>',
};
const svg = (p) => `<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const escA = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let root, stage, img, failNote, state = null;
const v = { rot: 0, z: 1, fit: 1, tx: 0, ty: 0 };

function build() {
  root = document.createElement('div');
  root.className = 'dv'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-labelledby', 'dvTitle');
  root.innerHTML = `<div class="dv-scrim"></div>
    <div class="dv-panel">
      <div class="dv-head">
        <span class="dv-num"></span><span class="dv-title" id="dvTitle"></span>
        <span class="dv-count" aria-live="polite"></span>
        <button class="dv-b" type="button" data-a="close" aria-label="Close the drawing">${svg(I.close)}</button>
      </div>
      <div class="dv-stage">
        <img alt="" draggable="false">
        <p class="dv-fail" hidden></p>
        <button class="dv-b dv-nav prev" type="button" data-a="prev" aria-label="Previous drawing">${svg(I.prev)}</button>
        <button class="dv-b dv-nav next" type="button" data-a="next" aria-label="Next drawing">${svg(I.next)}</button>
        <div class="dv-tools" role="toolbar" aria-label="Drawing">
          <button class="dv-b" type="button" data-a="rl" aria-label="Rotate left">${svg(I.rl)}</button>
          <button class="dv-b" type="button" data-a="rr" aria-label="Rotate right">${svg(I.rr)}</button>
          <button class="dv-b" type="button" data-a="reset" aria-label="Reset rotation">${svg(I.reset)}</button>
          <span class="sep" aria-hidden="true"></span>
          <button class="dv-b" type="button" data-a="zo" aria-label="Zoom out">${svg(I.zo)}</button>
          <span class="dv-zoom" aria-live="polite"></span>
          <button class="dv-b" type="button" data-a="zi" aria-label="Zoom in">${svg(I.zi)}</button>
          <span class="sep f" aria-hidden="true"></span>
          <button class="dv-b dv-fill" type="button" data-a="fill" aria-label="Fill the screen" aria-pressed="false">${svg(I.fill)}</button>
        </div>
      </div>
      <div class="dv-strip" role="list" aria-label="All drawings"></div>
    </div>`;
  document.body.append(root);
  stage = root.querySelector('.dv-stage'); img = stage.querySelector(':scope > img');
  failNote = stage.querySelector('.dv-fail');
  new ResizeObserver(() => state && fit(true)).observe(stage);
  root.querySelector('.dv-scrim').addEventListener('click', () => closeViewer());
  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-a], [data-k]'); if (!t) return;
    if (t.dataset.k !== undefined) return show(+t.dataset.k);
    const a = t.dataset.a;
    if (a === 'prev') show(state.i - 1);
    if (a === 'next') show(state.i + 1);
    if (a === 'close') closeViewer();
    if (a === 'rl') { v.rot -= 90; fit(false); }
    if (a === 'rr') { v.rot += 90; fit(false); }
    if (a === 'reset') { v.rot = 0; fit(false); }
    if (a === 'zi') zoom(1.25);
    if (a === 'zo') zoom(1 / 1.25);
    if (a === 'fill') {
      const on = !root.hasAttribute('data-fill'); root.toggleAttribute('data-fill', on);
      t.setAttribute('aria-pressed', String(on)); t.setAttribute('aria-label', on ? 'Leave full screen' : 'Fill the screen'); t.innerHTML = svg(on ? I.unfill : I.fill);
    }
  });
  /* pan a zoomed drawing by dragging it */
  let drag = null;
  stage.addEventListener('pointerdown', (e) => {
    if (!stage.hasAttribute('data-pan') || e.target.closest('button, .dv-tools')) return;
    drag = { x: e.clientX - v.tx, y: e.clientY - v.ty }; stage.classList.add('drag'); stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', (e) => { if (!drag) return; v.tx = e.clientX - drag.x; v.ty = e.clientY - drag.y; paint(); });
  stage.addEventListener('pointerup', () => { drag = null; stage.classList.remove('drag'); });
  addEventListener('keydown', (e) => {
    if (!state) return;
    const stop = () => { e.preventDefault(); e.stopImmediatePropagation(); };
    if (e.key === 'Escape') { stop(); closeViewer(); }
    else if (e.key === 'ArrowLeft') { stop(); show(state.i - 1); }
    else if (e.key === 'ArrowRight') { stop(); show(state.i + 1); }
    else if (e.key === '+' || e.key === '=') { stop(); zoom(1.25); }
    else if (e.key === '-') { stop(); zoom(1 / 1.25); }
    else if (e.key === 'Tab') {
      const f = [...root.querySelectorAll('button:not(:disabled)')].filter((b) => b.offsetParent);
      const k = f.indexOf(document.activeElement);
      if (e.shiftKey && k <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && k === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  }, true);
}

/* fit: the drawing at the size the stage holds, given its rotation; the zoom reads natural size as 100% */
function fit(resetZoom) {
  if (!img.naturalWidth) return;
  const sw = stage.clientWidth - 112, sh = stage.clientHeight - 104;
  const turned = Math.abs(v.rot / 90) % 2 === 1;
  const w = turned ? img.naturalHeight : img.naturalWidth, h = turned ? img.naturalWidth : img.naturalHeight;
  const was = v.fit; v.fit = Math.min(sw / w, sh / h);
  if (resetZoom) { v.z = v.fit; v.tx = v.ty = 0; } else v.z = v.z * (v.fit / was);
  paint();
}
function zoom(k) { if (!img.naturalWidth) return; v.z = Math.max(v.fit * 0.5, Math.min(4, v.z * k)); if (v.z <= v.fit) { v.tx = v.ty = 0; } paint(); }
function paint() {
  img.style.width = img.naturalWidth + 'px'; img.style.height = img.naturalHeight + 'px';
  img.style.transform = `translate(-50%, -50%) translate(${v.tx}px, ${v.ty}px) rotate(${v.rot}deg) scale(${v.z})`;
  stage.toggleAttribute('data-pan', v.z > v.fit + 0.001);
  root.querySelector('.dv-zoom').textContent = Math.round(v.z * 100) + '%';
  root.querySelector('[data-a="reset"]').disabled = v.rot % 360 === 0;
}

function show(i) {
  const { figs } = state;
  state.i = Math.max(0, Math.min(figs.length - 1, i));
  const f = figs[state.i];
  v.rot = 0; img.classList.add('now'); img.style.opacity = '0';
  failNote.hidden = true;
  const failed = (say) => { img.removeAttribute('src'); failNote.textContent = say; failNote.hidden = false; root.querySelector('.dv-zoom').textContent = ''; };
  img.onload = () => { fit(true); img.style.opacity = '1'; requestAnimationFrame(() => img.classList.remove('now')); };
  img.onerror = () => failed(`Drawing ${f.n} did not load.`);
  if (f.src) { img.src = f.src; img.alt = `Drawing ${f.n} of ${figs.length}`; }
  else failed(`Drawing ${f.n} is not shown here.`);
  root.querySelector('.dv-count').textContent = `Drawing ${f.n} of ${figs.length}`;
  root.querySelector('[data-a="prev"]').disabled = state.i === 0;
  root.querySelector('[data-a="next"]').disabled = state.i === figs.length - 1;
  root.querySelectorAll('.dv-thumb').forEach((t, k) => t.setAttribute('aria-current', String(k === state.i)));
  root.querySelector(`.dv-thumb[data-k="${state.i}"]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

/** figs: [{ n, src, thumb? }]; i: the index to open at; opts: { title, number, returnFocus, byKey } */
export function openViewer(figs, i = 0, opts = {}) {
  if (!figs?.length) return;
  if (!root) build();
  state = { figs, i, returnFocus: opts.returnFocus || document.activeElement };
  root.querySelector('.dv-num').textContent = opts.number || '';
  root.querySelector('.dv-title').textContent = opts.title || 'Drawings';
  root.querySelector('.dv-strip').innerHTML = figs.map((f, k) =>
    `<button class="dv-thumb" type="button" role="listitem" data-k="${k}" aria-label="Drawing ${f.n} of ${figs.length}">`
    + ((f.thumb || f.src) ? `<img alt="" loading="lazy" src="${escA(f.thumb || f.src)}">` : '')
    + `<span class="n">${f.n}</span></button>`).join('');
  root.toggleAttribute('data-instant', !!opts.byKey);
  root.removeAttribute('data-fill');
  const fb = root.querySelector('.dv-fill'); fb.setAttribute('aria-pressed', 'false'); fb.setAttribute('aria-label', 'Fill the screen'); fb.innerHTML = svg(I.fill);
  for (const el of document.body.children) if (el !== root && el.tagName !== 'SCRIPT') el.inert = true;
  root.hidden = false;
  show(i);
  requestAnimationFrame(() => { root.setAttribute('data-open', ''); root.querySelector('[data-a="close"]').focus(); });
}

export function closeViewer() {
  if (!state) return;
  for (const el of document.body.children) el.inert = false;
  root.removeAttribute('data-open'); root.hidden = true;
  const back = state.returnFocus; state = null;
  back?.focus?.({ preventScroll: true });
}

export const viewerOpen = () => !!state;
