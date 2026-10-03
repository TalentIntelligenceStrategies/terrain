/* figure-viewer — one patent drawing, large, with the controls to actually
 * read it.
 *
 * ═══ IT IS A LIGHTBOX SINCE 2026-09-24, AND IT DID NOT USED TO BE ══════════
 * Three rules in this repository decided the old shape before any design
 * question was asked, and this file argued at length that they were binding:
 *
 *   · There was no scrim (design-language.md §3.2). Nothing dimmed the page.
 *   · There was no `position:fixed` in app/, and no full-viewport node.
 *   · There was no modal and no focus trap (13-inline-confirm.css, focus.mjs).
 *
 * So it opened over the RECORD COLUMN — absolute inside `.panecol` — and the
 * list on the left stayed live throughout.
 *
 * ═══ WHAT CHANGED IS THE COLUMN ════════════════════════════════════════════
 * The record moved into the right column on the same day, which is where the
 * viewer was. Filling that column now means covering the text the drawing is
 * read against — the exact arrangement the old note existed to avoid. Taking
 * the LEFT column instead would give a technical drawing 44% of the window,
 * and reference numerals are the thing a founder enlarges a drawing FOR.
 *
 * So all three rules are NARROWED — one scrim, one fixed node, one trap, each
 * of them this — rather than repealed. design-language.md §3.2 anticipated
 * exactly this: "a dimming layer would arrive with whatever first needs one."
 *
 * ═══ THE PORTAL, AND WHY THERE HAS TO BE ONE ═══════════════════════════════
 * `inert` works downward. The viewer ships inside surface.html, which puts it
 * four levels inside `#app` — so inerting `#app` would inert the viewer with
 * it, and inerting everything-but would be a hand-kept list of regions that
 * goes stale the first time the surface gains one.
 *
 * At init the node is moved to <body>, beside `#app` rather than inside it.
 * Nothing about its rendering depends on where it lives, because it is
 * `position:fixed` — its containing block is the viewport either way. It stays
 * authored in surface.html because that is the surface it belongs to; a second
 * host in index.html would be markup with no owner.
 *
 * ═══ ZOOM IS A TRANSFORM, AND §6 SAYS "THERE ARE NO EXCEPTIONS" ════════════
 * No transition or animation on a layout property — width, height, margin,
 * padding, top, left. So zoom is `scale()`, rotation is `rotate()`, panning is
 * `translate()`, and all three compose into ONE transform on one element. They
 * are set as custom properties rather than as a composed string so the CSS
 * decides the order of operations once; a JS-built transform string is three
 * call sites that can disagree about whether rotation happens before scale.
 *
 * ═══ NO NEW KEYFRAMES ══════════════════════════════════════════════════════
 * §6 permits three and sets a high bar for a fourth. Everything here is a
 * transition, which is also what makes a rapidly-pressed zoom button behave:
 * transitions retarget from where they are, keyframes restart from zero.
 */
import { $, esc } from './dom.mjs';
import { push, drop } from './esc-stack.mjs';
import { focusQuietly, captureFocus, setInert, focusables } from './focus.mjs';
import { say } from './live-region.mjs';
import { reduced, DUR1 } from './motion.mjs';
import { loader } from './loader.mjs';
import { failHTML } from './wait.mjs';

/* ══ THE LADDER, AND WHAT IS ALLOWED BETWEEN ITS RUNGS ═════════════════════
   platform.md §4.5. The BUTTONS and the + − 0 keys step a fixed ladder: a
   founder pressing zoom four times should land somewhere they can predict and
   get back from, and a `scale *= 1.25` loop lands on 2.4414… with no way back
   to 1 but a reset. Seven stops, 1 among them.

   A GESTURE IS CONTINUOUS WITHIN THE SAME ENDS. A wheel notch, a trackpad
   pinch and two fingers on glass all say "this much, here", and snapping them
   to the ladder throws away both the amount and the place. So `scale` is a
   number between the ladder's first and last stop, the next button press
   lands on the next stop above or below it, and the readout on the bar prints
   the exact level so it can be returned to. */
const STOPS = [0.5, 0.75, 1, 1.5, 2, 3, 4];
const MIN = STOPS[0], MAX = STOPS[STOPS.length - 1];

let FIGS = [];
let CONTEXT = null;
let at = 0;
let scale = 1;
let rot = 0;
let panX = 0, panY = 0;
let restoreFocus = null;
let gestureEnd = 0;
let loadToken = 0;

const el = {};

function q() {
  el.root = $('#figView');
  el.img = $('#figImg');
  el.stage = $('#figStage');
  el.cap = $('#figCap');
  el.strip = $('#figStrip');
  el.out = $('#figOut');
  el.in = $('#figIn');
  el.zoom = $('#figZoom');
  el.msg = $('#figMsg');
  return Boolean(el.root && el.img);
}

/* ONE WRITE PER FRAME-WORTH OF STATE. Every control funnels through here, so
   there is exactly one place that knows how zoom, rotation and pan compose —
   and the CSS owns the order, reading them in a single transform. */
function apply() {
  if (!el.img) return;
  clampPan();
  el.img.style.setProperty('--fig-scale', String(scale));
  el.img.style.setProperty('--fig-rot', rot + 'deg');
  el.img.style.setProperty('--fig-x', panX + 'px');
  el.img.style.setProperty('--fig-y', panY + 'px');
  /* PANNING IS ONLY OFFERED WHEN THERE IS SOMEWHERE TO PAN. A grab cursor over
     an image that fills less than its frame promises a drag that does nothing. */
  el.stage.classList.toggle('can-pan', scale > 1);
  if (el.out) el.out.disabled = scale <= MIN + 0.001;
  if (el.in) el.in.disabled = scale >= MAX - 0.001;
  if (el.zoom) el.zoom.textContent = Math.round(scale * 100) + '%';
}

/* ══ THE DRAWING STAYS ON THE STAGE ═══════════════════════════════════════
   Pan was unbounded, so a drag at 4x could throw the drawing off the stage
   entirely and leave the founder looking at white paper with no way to find
   it but Reset. The bound is the FITTED drawing at this scale — its edge may
   come in as far as the stage's edge plus the 24px gutter, and no further.
   A quarter turn swaps which side is which. Below 1x there is nothing to
   pan, so the drawing is held at the centre. */
function clampPan() {
  if (scale <= 1 || !el.img.naturalWidth) { panX = 0; panY = 0; return; }
  const sw = el.stage.clientWidth, sh = el.stage.clientHeight;
  const nw = el.img.naturalWidth, nh = el.img.naturalHeight;
  const fit = Math.min((sw - 48) / nw, (sh - 80) / nh);
  let w = nw * fit * scale, h = nh * fit * scale;
  if (rot % 180) [w, h] = [h, w];
  const mx = Math.max(0, (w - sw) / 2 + 24), my = Math.max(0, (h - sh) / 2 + 24);
  panX = Math.max(-mx, Math.min(mx, panX));
  panY = Math.max(-my, Math.min(my, panY));
}

/* ZOOM ABOUT A POINT. The point under the cursor (or between two fingers)
   stays under it: with m its offset from the stage centre and k the change in
   scale, the pan becomes m − k(m − p). Rotation cancels out of it, because the
   CSS applies translate, then rotate, then scale — the pan is in screen space
   and the scale is about the image's own centre. */
function zoomTo(next, cx, cy) {
  const to = Math.max(MIN, Math.min(MAX, next));
  if (to === scale) return;
  const r = el.stage.getBoundingClientRect();
  const mx = cx == null ? 0 : cx - (r.left + r.width / 2);
  const my = cy == null ? 0 : cy - (r.top + r.height / 2);
  const k = to / scale;
  panX = mx - k * (mx - panX);
  panY = my - k * (my - panY);
  scale = to;
  apply();
}

const stepUp = () => STOPS.find(v => v > scale + 0.001) || MAX;
const stepDown = () => [...STOPS].reverse().find(v => v < scale - 0.001) || MIN;

/* A GESTURE TURNS THE TRANSITION OFF FOR ITS LENGTH. A 200ms ease behind a
   finger or a wheel makes the drawing lag the hand, which reads as the
   interface being slow rather than as smoothing. The wheel has no end event,
   so the state lifts 160ms after the last notch. */
function gesture(on) {
  el.stage.classList.toggle('is-gesture', on);
}
function wheelGesture() {
  gesture(true);
  clearTimeout(gestureEnd);
  gestureEnd = setTimeout(() => gesture(false), 160);
}

/* ══ ONE DRAWING TO THE NEXT ══════════════════════════════════════════════
   The src used to swap in place: the old drawing vanished, the stage sat
   white for as long as the next took to arrive, and it popped in. Now the
   outgoing drawing is cloned over the stage and fades on --dur-1 while the
   incoming one fades up once it has loaded, and the two neighbours are
   fetched ahead so paging is usually a crossfade between two images already
   in memory. A drawing that is slow shows the loader after 160ms — sooner
   is a flash on every cached page — and one that fails says so on the
   stage. */
function crossfadeOut() {
  if (reduced() || el.img.hidden || !el.img.complete || !el.img.naturalWidth) return;
  const ghost = el.img.cloneNode();
  ghost.removeAttribute('id');
  ghost.classList.add('figview-ghost');
  ghost.setAttribute('aria-hidden', 'true');
  el.img.after(ghost);
  void ghost.offsetWidth;
  requestAnimationFrame(() => ghost.classList.add('is-gone'));
  setTimeout(() => ghost.remove(), DUR1 + 40);
}

function preload(i) {
  const f = FIGS[(i + FIGS.length) % FIGS.length];
  if (f && f.src != null) { const im = new Image(); im.decoding = 'async'; im.src = f.src; }
}

function showSrc(src) {
  const token = ++loadToken;
  const msg = el.msg;
  if (msg) { msg.hidden = true; msg.innerHTML = ''; }
  el.img.setAttribute('data-loading', '');
  const slow = setTimeout(() => {
    if (token !== loadToken || !msg) return;
    msg.innerHTML = '';
    msg.append(loader());
    msg.hidden = false;
  }, 160);
  el.img.onload = () => {
    if (token !== loadToken) return;
    clearTimeout(slow);
    if (msg) { msg.hidden = true; msg.innerHTML = ''; }
    el.img.removeAttribute('data-loading');
    apply();
  };
  el.img.onerror = () => {
    if (token !== loadToken) return;
    clearTimeout(slow);
    if (msg) { msg.innerHTML = failHTML('This drawing did not load.'); msg.hidden = false; }
  };
  el.img.src = src;
}

function setFig(i, announce) {
  if (!FIGS.length) return;
  const next = (i + FIGS.length) % FIGS.length;
  if (el.root.classList.contains('is-open') && next !== at) crossfadeOut();
  at = next;
  const f = FIGS[at];
  /* A WITHHELD DRAWING STILL OPENS. The viewer's job here is to show that the
     chrome works — paging, the bar, the strip — on a record whose images
     Terrain declines to print, so the stage carries the same frame the
     thumbnail did rather than a broken <img>. */
  const withheld = f.src == null;
  el.stage.classList.toggle('is-withheld', withheld);
  el.img.hidden = withheld;
  if (!withheld) showSrc(f.src);
  else {
    ++loadToken;
    el.img.removeAttribute('src');
    el.img.removeAttribute('data-loading');
    if (el.msg) { el.msg.hidden = true; el.msg.innerHTML = ''; }
  }
  /* THE ALT IS THE FIGURE NUMBER AND NOTHING ELSE. Nothing in this product can
     describe what a technical drawing shows, and an invented description would
     be a reading of the record — which §6.6 keeps out. The number is a fact. */
  el.img.alt = 'Figure ' + f.n;
  if (el.cap) el.cap.textContent = 'Figure ' + f.n + ' of ' + FIGS.length;
  /* A NEW FIGURE RESETS THE VIEW. Carrying a 4x zoom and a 90° rotation onto
     the next drawing shows the founder a corner of something they have not
     seen whole yet. */
  scale = 1; rot = 0; panX = 0; panY = 0;
  apply();
  preload(at + 1);
  preload(at - 1);
  if (el.strip) {
    [...el.strip.querySelectorAll('[data-go-fig]')].forEach((b, k) =>
      b.setAttribute('aria-current', String(k === at)));
    const cur = el.strip.querySelector('[aria-current="true"]');
    /* THE STRIP FOLLOWS THE FIGURE. Paging with the arrows past the visible
       thumbnails would otherwise leave the strip showing a selection that has
       scrolled out of it. `nearest` so it only moves when it has to. */
    if (cur) cur.scrollIntoView({ block: 'nearest', inline: 'nearest',
                                  behavior: reduced() ? 'auto' : 'smooth' });
  }
  if (announce) say('work', 'Figure ' + f.n + ' of ' + FIGS.length + '.');
}

function stripHTML() {
  return FIGS.map((f, i) =>
    '<button class="figstrip-btn" type="button" data-go-fig="' + i + '"'
    + ' aria-current="' + (i === at) + '"'
    + ' aria-label="Figure ' + f.n + '">'
    /* same rule as the record's strip: a null src is a frame, not an <img>
       with nothing in it. esc(null) would print the string "null" as a URL. */
    + (f.src == null
      ? '<span class="figstrip-sk sk" aria-hidden="true"></span>'
      : '<img src="' + esc(f.src) + '" alt="" loading="lazy" decoding="async">')
    + '<span class="figstrip-n fig fig-s">' + f.n + '</span>'
    + '</button>').join('');
}

export function isOpen() {
  return Boolean(el.root && el.root.classList.contains('is-open'));
}

/* `context` IS THE PATENT THE DRAWINGS BELONG TO — { number, title }, as the
   record printed them. Either may be null, and a null prints nothing rather
   than a bar: the record behind the scrim already carries the skeleton for a
   withheld identity, and the head is a caption, not a second record. */
export function open(figures, index, trigger, context) {
  if (!q() || !Array.isArray(figures) || !figures.length) return;
  FIGS = figures;
  CONTEXT = context || null;
  restoreFocus = captureFocus(trigger);
  const no = $('#figNo'), title = $('#figTitle'), pn = $('#figPn');
  if (no) no.textContent = (CONTEXT && CONTEXT.number) || '';
  if (title) title.textContent = (CONTEXT && CONTEXT.title) || '';
  if (pn) pn.hidden = !(CONTEXT && (CONTEXT.number || CONTEXT.title));

  if (el.strip) el.strip.innerHTML = stripHTML();
  el.root.hidden = false;
  setFig(index || 0, false);

  /* THE START STATE HAS TO BE COMMITTED BEFORE THE END STATE IS SET, or the
     browser coalesces both into one style recalculation and there is nothing
     to transition FROM. §6 records this as one of the two ways a correct
     motion spec gets defeated; record.mjs solves it the same way. */
  requestAnimationFrame(() => {
    el.root.classList.add('is-open');
  });

  /* ══ THE PAGE GOES INERT, WHICH IT NEVER DID BEFORE ═════════════════════
     This file used to carry the opposite note, and the argument it made was
     right for a viewer that was a column: there was nothing underneath, so
     every control the keyboard could reach was one the pointer could reach.

     A cover changes that. Something the pointer cannot get to and the tab key
     can is an interface lying about what is reachable — and `inert` rather
     than `aria-hidden`, because aria-hidden leaves the tab order intact and
     produces the worst version of the same lie: a sighted keyboard user tabs
     into controls a screen reader says are not there.

     `setInert` has been exported from focus.mjs with no caller since it was
     written. This is the caller. */
  setInert($('#app'), true);
  el.root.setAttribute('aria-modal', 'true');

  /* ABOVE THE RECORD ON THE STACK. Escape closes the viewer first and the
     record second, which is the order they were opened in and the order the
     founder expects. esc-stack's own header says it exists so that a second
     overlay is safe to add; this is the second overlay. */
  push('figure', close);
  const closeBtn = $('#figClose');
  if (closeBtn) focusQuietly(closeBtn);
  say('work', 'Figure ' + FIGS[at].n + ' of ' + FIGS.length + ' open.');
}

export function close() {
  if (!el.root || el.root.hidden) return;
  el.root.classList.remove('is-open');
  /* MAXIMISED IS NOT A PREFERENCE, so it does not survive the close. It is a
     state of THIS reading of THIS plate — the founder went full bleed for a
     dense schematic — and a viewer that reopened maximised would be answering
     a question the next drawing did not ask. It is cleared here rather than in
     open() so nothing is ever painted in the wrong state for a frame. */
  el.root.removeAttribute('data-full');
  const full = $('#figFull');
  if (full) full.setAttribute('aria-pressed', 'false');
  /* THE PAGE COMES BACK BEFORE FOCUS MOVES, not after. restoreFocus() aims at
     the thumbnail that opened this, which is inside the tree that is still
     inert on the line above — and focusing into an inert subtree silently
     does nothing, which would drop a keyboard user on <body>. */
  setInert($('#app'), false);
  el.root.removeAttribute('aria-modal');
  drop('figure');
  if (restoreFocus) restoreFocus();
  restoreFocus = null;
  /* the hide waits for the exit, or the node is removed mid-transition and the
     viewer vanishes rather than leaving. */
  setTimeout(() => {
    if (el.root && !el.root.classList.contains('is-open')) el.root.hidden = true;
  }, reduced() ? 0 : DUR1 + 20);
}

/* ── the controls ──────────────────────────────────────────────────────────
   Bound once, at init, against the document. The viewer's markup ships in
   surface.html and is never replaced, but delegation costs nothing and means
   this module holds no element references taken at parse time. */
export function init() {
  if (!q()) return;

  /* ══ THE PORTAL · see the header ═════════════════════════════════════════
     Once, at init, and never again — the surface partial is fetched once at
     boot and views are switched by class rather than re-injected, so there is
     no second node to catch. Guarded anyway, because an init called twice
     should not be a bug somebody has to reproduce. */
  if (el.root.parentElement !== document.body) document.body.appendChild(el.root);

  const on = (sel, fn) => {
    const b = $(sel);
    if (b) b.addEventListener('click', fn);
  };

  on('#figClose', close);
  on('#figIn', () => zoomTo(stepUp()));
  on('#figOut', () => zoomTo(stepDown()));
  on('#figRot', () => { rot = (rot + 90) % 360; panX = panY = 0; apply(); });
  on('#figReset', () => { scale = 1; rot = 0; panX = panY = 0; apply(); });

  /* ══ THE SCRIM CLOSES IT ═════════════════════════════════════════════════
     A press on the dimmed page around the panel is the most common way out of
     any lightbox, and here it did nothing. BOTH ENDS OF THE PRESS must land on
     the cover itself: a pan that starts on the drawing and is released past
     the panel's edge is a drag, not a request to leave, and closing on it
     would throw away the founder's zoom. */
  let downOnCover = false;
  el.root.addEventListener('pointerdown', e => { downOnCover = e.target === el.root; });
  el.root.addEventListener('click', e => {
    if (downOnCover && e.target === el.root) close();
    downOnCover = false;
  });
  on('#figPrev', () => setFig(at - 1, true));
  on('#figNext', () => setFig(at + 1, true));

  /* FILL THE SCREEN IS THIS PAGE'S, NOT THE BROWSER'S · 2026-09-26.
     It called requestFullscreen(), so a founder asking a drawing to get
     bigger got the whole BROWSER instead: the tab strip and the OS chrome
     went, and Escape left fullscreen rather than closing the drawing they
     were looking at. A control inside a lightbox cannot mean "change what
     application you appear to be running".

     THE ARGUMENT FOR IT WAS TRUE AND IS NOT ANY MORE. It read "the viewer was
     absolute inside a column and there was no position:fixed in the tree, so
     growing the element was not available" — .figview is position:fixed;
     inset:0 since it became a lightbox, so it already covers the viewport and
     the only thing between it and full bleed is 24px of padding and the
     panel's two maxima. That is a state on an element, not an API call.

     THE PANEL STILL OPENS AT 1100 x 82vh, sized to a portrait plate rather
     than to the screen, so there is a real second size for this to reach.
     40-figure.css's [data-full] rules are what drop the maxima.

     NO fullscreenchange LISTENER AND NO REJECTION TO HANDLE. The old one
     existed because Safari refuses the request in some contexts and returns a
     rejected promise, so the button could not assume it had worked. An
     attribute always applies. */
  on('#figFull', () => {
    const b = $('#figFull');
    const full = !el.root.hasAttribute('data-full');
    el.root.toggleAttribute('data-full', full);
    if (b) b.setAttribute('aria-pressed', String(full));
  });

  if (el.strip) {
    el.strip.addEventListener('click', e => {
      const b = e.target.closest('[data-go-fig]');
      if (b) setFig(Number(b.getAttribute('data-go-fig')), true);
    });
  }

  /* ══ THE STAGE'S GESTURES ═════════════════════════════════════════════
     POINTER EVENTS AND POINTER CAPTURE, not mouse or touch events. Capture is
     what keeps a drag alive when the pointer leaves the stage, which at 4x is
     most of the time, and one model covers mouse, pen and finger:

       · one pointer above 1x pans;
       · one finger at 1x or below swipes to the next or previous drawing —
         a horizontal travel of 48px, more across than down;
       · two fingers pinch, zooming about the point between them and panning
         with it;
       · a double click, or two taps within 300ms, toggles 1x and 2x about the
         point pressed;
       · the wheel zooms about the cursor — a trackpad pinch arrives as a
         wheel with ctrlKey and a finer delta, so it gets a finer rate.

     touch-action:none on the stage (40-figure.css) is what stops the browser
     taking the same fingers for its own page zoom. */
  if (el.stage) {
    const pts = new Map();
    let pan = null, pinch = null, swipe = null, lastTap = null;
    const mid = () => { const [a, b] = [...pts.values()];
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) }; };

    el.stage.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('button')) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      el.stage.setPointerCapture(e.pointerId);
      if (pts.size === 2) {
        const m = mid();
        pinch = { d: m.d || 1, s: scale, x: m.x, y: m.y };
        pan = swipe = null;
        gesture(true);
      } else if (pts.size === 1) {
        if (scale > 1) { pan = { x: e.clientX - panX, y: e.clientY - panY }; gesture(true); }
        else if (e.pointerType !== 'mouse') swipe = { x: e.clientX, y: e.clientY };
      }
      e.preventDefault();
    });
    el.stage.addEventListener('pointermove', e => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && pts.size === 2) {
        const m = mid();
        panX += m.x - pinch.x; panY += m.y - pinch.y;
        pinch.x = m.x; pinch.y = m.y;
        zoomTo(pinch.s * (m.d / pinch.d), m.x, m.y);
        apply();
      } else if (pan) {
        panX = e.clientX - pan.x;
        panY = e.clientY - pan.y;
        apply();
      }
    });
    const end = e => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (swipe && e.type === 'pointerup') {
        const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          setFig(at + (dx < 0 ? 1 : -1), true);
          lastTap = null;
        } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
          /* TWO TAPS ARE A DOUBLE TAP. dblclick does not fire for touch once
             touch-action is none, so the stage counts its own. */
          const now = e.timeStamp;
          if (lastTap && now - lastTap.t < 300 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 30) {
            zoomTo(scale > 1.001 ? 1 : 2, e.clientX, e.clientY);
            lastTap = null;
          } else lastTap = { t: now, x: e.clientX, y: e.clientY };
        }
      }
      if (pts.size < 2) pinch = null;
      if (pts.size === 0) { pan = null; swipe = null; gesture(false); }
    };
    el.stage.addEventListener('pointerup', end);
    el.stage.addEventListener('pointercancel', end);
    el.stage.addEventListener('dblclick', e => {
      if (e.target.closest('button')) return;
      zoomTo(scale > 1.001 ? 1 : 2, e.clientX, e.clientY);
    });
    el.stage.addEventListener('wheel', e => {
      e.preventDefault();
      wheelGesture();
      const rate = e.ctrlKey ? 0.01 : 0.002;
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      zoomTo(scale * Math.exp(-dy * rate), e.clientX, e.clientY);
    }, { passive: false });
  }

  /* ARROW KEYS PAGE THE FIGURES, and only while the viewer is open. It is not
     on the esc-stack's key because it is not a dismissal; it is the same
     movement the two chevrons make, offered to a keyboard. */
  document.addEventListener('keydown', e => {
    if (!isOpen() || e.defaultPrevented) return;
    if (e.key === 'ArrowRight') { setFig(at + 1, true); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { setFig(at - 1, true); e.preventDefault(); }
    /* + − 0 STEP THE LADDER AND RESET, the buttons' acts offered to a
       keyboard. `=` beside `+` because + is a shifted key on most layouts and
       nobody presses shift to zoom; modifiers are left alone so the browser's
       own Cmd/Ctrl zoom still works. */
    else if (!e.metaKey && !e.ctrlKey && !e.altKey && (e.key === '+' || e.key === '=')) {
      zoomTo(stepUp()); e.preventDefault();
    } else if (!e.metaKey && !e.ctrlKey && !e.altKey && (e.key === '-' || e.key === '_')) {
      zoomTo(stepDown()); e.preventDefault();
    } else if (!e.metaKey && !e.ctrlKey && !e.altKey && e.key === '0') {
      scale = 1; rot = 0; panX = panY = 0; apply(); e.preventDefault();
    }
    /* ══ THE TRAP, AND IT IS SIX LINES BECAUSE inert DID THE REST ══════════
       Everything outside this node is already unreachable — `#app` carries
       `inert` for the length of the open. What is left is the two ENDS: Tab
       off the last control and Shift+Tab off the first both land on the
       browser's own chrome, and the founder comes back to a page where
       nothing is focused.

       focusables() FILTERS BY offsetParent, so a control that is not drawn
       — the patent caption's empty spans, a hidden stage message — is not in
       the cycle. A trap that cycles through controls nobody can see is a trap
       that reads as broken. */
    else if (e.key === 'Tab') {
      const stops = focusables(el.root);
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const on = document.activeElement;
      if (e.shiftKey && (on === first || !el.root.contains(on))) {
        focusQuietly(last); e.preventDefault();
      } else if (!e.shiftKey && (on === last || !el.root.contains(on))) {
        focusQuietly(first); e.preventDefault();
      }
    }
  });
}
