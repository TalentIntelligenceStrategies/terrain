/* figure-viewer — one patent drawing, large, with the controls to actually
 * read it.
 *
 * ═══ IT IS NOT A LIGHTBOX AND IT CANNOT BE ONE ═════════════════════════════
 * Three rules in this repository decide the shape of this thing before any
 * design question is asked:
 *
 *   · There is no scrim (design-language.md §3.2). Nothing in the product dims
 *     the page. The deleted scrim is on record twice, with its token.
 *   · There is no `position:fixed` anywhere in app/, and no full-viewport node.
 *   · There is no modal and no focus trap (13-inline-confirm.css, focus.mjs).
 *
 * So it opens over the RECORD COLUMN — absolute inside `.panecol`, which is
 * already positioned — rather than over the window. The list on the left stays
 * live and readable throughout, which is the same arrangement the record
 * itself uses and for the same reason: the founder is comparing, not leaving.
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
import { focusQuietly, captureFocus } from './focus.mjs';
import { say } from './live-region.mjs';
import { reduced } from './motion.mjs';

/* THE LADDER IS DISCRETE, not a continuous multiplier. A founder pressing zoom
   four times should land somewhere they can predict and get back from, and a
   `scale *= 1.25` loop lands on 2.4414… with no way to return to 1 except a
   reset button. Six stops, 1 among them. */
const STOPS = [0.5, 0.75, 1, 1.5, 2, 3, 4];

let FIGS = [];
let at = 0;
let zoom = 2;      /* index into STOPS; 2 === 1x */
let rot = 0;
let panX = 0, panY = 0;
let restoreFocus = null;
let dragging = null;

const el = {};

function q() {
  el.root = $('#figView');
  el.img = $('#figImg');
  el.stage = $('#figStage');
  el.cap = $('#figCap');
  el.strip = $('#figStrip');
  el.out = $('#figOut');
  el.in = $('#figIn');
  return Boolean(el.root && el.img);
}

/* ONE WRITE PER FRAME-WORTH OF STATE. Every control funnels through here, so
   there is exactly one place that knows how zoom, rotation and pan compose —
   and the CSS owns the order, reading them in a single transform. */
function apply() {
  if (!el.img) return;
  const s = STOPS[zoom];
  el.img.style.setProperty('--fig-scale', String(s));
  el.img.style.setProperty('--fig-rot', rot + 'deg');
  el.img.style.setProperty('--fig-x', panX + 'px');
  el.img.style.setProperty('--fig-y', panY + 'px');
  /* PANNING IS ONLY OFFERED WHEN THERE IS SOMEWHERE TO PAN. A grab cursor over
     an image that fills less than its frame promises a drag that does nothing. */
  el.stage.classList.toggle('can-pan', s > 1);
  if (el.out) el.out.disabled = zoom === 0;
  if (el.in) el.in.disabled = zoom === STOPS.length - 1;
}

function setFig(i, announce) {
  if (!FIGS.length) return;
  at = (i + FIGS.length) % FIGS.length;
  const f = FIGS[at];
  /* A WITHHELD DRAWING STILL OPENS. The viewer's job here is to show that the
     chrome works — paging, the bar, the strip — on a record whose images
     Terrain declines to print, so the stage carries the same frame the
     thumbnail did rather than a broken <img>. */
  const withheld = f.src == null;
  el.stage.classList.toggle('is-withheld', withheld);
  el.img.hidden = withheld;
  if (!withheld) el.img.src = f.src;
  else el.img.removeAttribute('src');
  /* THE ALT IS THE FIGURE NUMBER AND NOTHING ELSE. Nothing in this product can
     describe what a technical drawing shows, and an invented description would
     be a reading of the record — which §6.6 keeps out. The number is a fact. */
  el.img.alt = 'Figure ' + f.n;
  if (el.cap) el.cap.textContent = 'Figure ' + f.n + ' of ' + FIGS.length;
  /* A NEW FIGURE RESETS THE VIEW. Carrying a 4x zoom and a 90° rotation onto
     the next drawing shows the founder a corner of something they have not
     seen whole yet. */
  zoom = 2; rot = 0; panX = 0; panY = 0;
  apply();
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
  if (announce) say('views', 'Figure ' + f.n + ' of ' + FIGS.length + '.');
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

export function open(figures, index, trigger) {
  if (!q() || !Array.isArray(figures) || !figures.length) return;
  FIGS = figures;
  restoreFocus = captureFocus(trigger);

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

  /* NOTHING GOES INERT, and that is the arrangement rather than an oversight.
     The viewer fills the RIGHT column and the record sits in the LEFT one, so
     there is no node underneath it — every control the keyboard can reach is
     also one the pointer can reach.

     This is the whole return on putting the drawing beside the record instead
     of over it: the founder picks the next figure from the strip without
     closing the one they are looking at, and compares a claim against the
     figure it names. An overlay had to make the record inert to stay honest
     about what was reachable; a column does not. */

  /* ABOVE THE RECORD ON THE STACK. Escape closes the viewer first and the
     record second, which is the order they were opened in and the order the
     founder expects. esc-stack's own header says it exists so that a second
     overlay is safe to add; this is the second overlay. */
  push('figure', close);
  const closeBtn = $('#figClose');
  if (closeBtn) focusQuietly(closeBtn);
  say('views', 'Figure ' + FIGS[at].n + ' of ' + FIGS.length + ' open.');
}

export function close() {
  if (!el.root || el.root.hidden) return;
  el.root.classList.remove('is-open');
  drop('figure');
  if (restoreFocus) restoreFocus();
  restoreFocus = null;
  /* the hide waits for the exit, or the node is removed mid-transition and the
     viewer vanishes rather than leaving. */
  setTimeout(() => {
    if (el.root && !el.root.classList.contains('is-open')) el.root.hidden = true;
  }, reduced() ? 0 : 140);
}

/* ── the controls ──────────────────────────────────────────────────────────
   Bound once, at init, against the document. The viewer's markup ships in
   surface.html and is never replaced, but delegation costs nothing and means
   this module holds no element references taken at parse time. */
export function init() {
  if (!q()) return;

  const on = (sel, fn) => {
    const b = $(sel);
    if (b) b.addEventListener('click', fn);
  };

  on('#figClose', close);
  on('#figIn', () => { zoom = Math.min(zoom + 1, STOPS.length - 1); apply(); });
  on('#figOut', () => { zoom = Math.max(zoom - 1, 0); apply(); });
  on('#figRot', () => { rot = (rot + 90) % 360; panX = panY = 0; apply(); });
  on('#figReset', () => { zoom = 2; rot = 0; panX = panY = 0; apply(); });
  on('#figPrev', () => setFig(at - 1, true));
  on('#figNext', () => setFig(at + 1, true));

  /* FULL SCREEN IS THE BROWSER'S, NOT A BIGGER DIV. The viewer is absolute
     inside the record column by rule — there is no position:fixed in this
     tree — so "fill the screen" cannot be done by growing the element. The
     Fullscreen API does it without one, and the button reports which state it
     is in rather than assuming the request succeeded: Safari refuses it in
     some contexts and returns a rejected promise. */
  on('#figFull', () => {
    const node = el.root;
    if (!document.fullscreenElement) {
      if (node.requestFullscreen) node.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  });
  document.addEventListener('fullscreenchange', () => {
    const b = $('#figFull');
    if (b) b.setAttribute('aria-pressed', String(Boolean(document.fullscreenElement)));
  });

  if (el.strip) {
    el.strip.addEventListener('click', e => {
      const b = e.target.closest('[data-go-fig]');
      if (b) setFig(Number(b.getAttribute('data-go-fig')), true);
    });
  }

  /* ── panning ──────────────────────────────────────────────────────────
     POINTER EVENTS AND POINTER CAPTURE, not mouse events. Capture is what
     keeps a drag alive when the pointer leaves the stage, which at 4x is most
     of the time; without it the drawing sticks to the edge mid-gesture. It
     also gives touch and pen for free. */
  if (el.stage) {
    el.stage.addEventListener('pointerdown', e => {
      if (STOPS[zoom] <= 1 || e.button !== 0) return;
      dragging = { id: e.pointerId, x: e.clientX - panX, y: e.clientY - panY };
      el.stage.setPointerCapture(e.pointerId);
      el.stage.classList.add('is-panning');
      e.preventDefault();
    });
    el.stage.addEventListener('pointermove', e => {
      if (!dragging || e.pointerId !== dragging.id) return;
      panX = e.clientX - dragging.x;
      panY = e.clientY - dragging.y;
      apply();
    });
    const end = e => {
      if (!dragging || e.pointerId !== dragging.id) return;
      dragging = null;
      el.stage.classList.remove('is-panning');
    };
    el.stage.addEventListener('pointerup', end);
    el.stage.addEventListener('pointercancel', end);
  }

  /* ARROW KEYS PAGE THE FIGURES, and only while the viewer is open. It is not
     on the esc-stack's key because it is not a dismissal; it is the same
     movement the two chevrons make, offered to a keyboard. */
  document.addEventListener('keydown', e => {
    if (!isOpen() || e.defaultPrevented) return;
    if (e.key === 'ArrowRight') { setFig(at + 1, true); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { setFig(at - 1, true); e.preventDefault(); }
  });
}
