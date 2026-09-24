/* core/peek — a glance at one drawing, from a result row. platform.md §4.3.
 *
 * ═══ THE DIVISION IS CURIOSITY VERSUS COMMITMENT ═══════════════════════════
 * Hovering or keyboard-focusing a tile in the list raises it large enough to
 * read and puts it back when you leave. CLICKING opens the record at that
 * figure, and the full viewer — zoom, rotate, paging, a scrim, a focus trap —
 * lives only inside the record. Somebody who wants more than a glance has
 * already told us so by opening the record.
 *
 * ═══ ONE NODE, AND IT BELONGS TO THE COLUMN ════════════════════════════════
 * Twenty rows of thirteen tiles is 260 nodes for a thing that exists once.
 * #setPeek is a child of .listcol — which is position:relative and is NOT the
 * scroller — so it escapes .listcol-scroll's clip on all four sides and holds
 * still while the list moves under it. NO SECOND position:fixed NODE: the
 * enlarged drawing is the one, and this must not leave the column.
 *
 * ═══ IT REUSES THE TILE'S OWN BYTES ════════════════════════════════════════
 * The tile has already fetched and decoded its thumbnail, so the peek paints
 * on the frame it opens. Fetching a full plate would show an empty white card
 * for 100-300ms ON A HOVER, which is worse than no peek at all. The cost is
 * stated rather than hidden: at 176px the median corpus rendition is scaled
 * 1.68x, and 34-list.css carries the distribution that chose the size.
 *
 * ═══ THE HOVER GATE IS pointerType, NOT A MEDIA QUERY ══════════════════════
 * A hybrid laptop gets a peek from its trackpad and none from its touchscreen,
 * in the same session, which @media (hover:hover) cannot express. Nothing is
 * lost on touch: a tap already does the strictly more useful thing.
 */
import { $ } from './dom.mjs';
import { on } from './delegate.mjs';
import { reduced } from './motion.mjs';

/* 160ms IS AN INTENT FILTER, NOT A DURATION OF MOTION, which is why it is a
   constant here rather than a token. The strip's tile pitch is 108px, so a
   pointer crossing it laterally at a typical ~600px/s is over one tile for
   about 120ms: a 120ms dwell fires on pass-through and 160 does not.
   IT SURVIVES REDUCED MOTION. A delay is not movement, and removing it would
   fire the peek on every sweep across the strip — MORE on screen, not less. */
const DWELL = 160;
const GAP = 8;    /* --s-8 between the tile and the card */
const EDGE = 12;  /* --s-12 from the card to the column's own edge */
const W = 176, H = 220;

let el = null, col = null, img = null, num = null;
let anchor = null, timer = null, hideTimer = null, suppressed = false;

const cancel = () => { clearTimeout(timer); timer = null; };

/* A TILE IS ELIGIBLE IF IT HAS A PICTURE. The +N tile is a control about the
   record and carries no image; a withheld drawing renders .set-thumb-sk and no
   image either, which is exactly right — a peek at a bar is not a glance. */
const eligible = t => Boolean(t && t.querySelector('.set-thumb-img'));

function place(t) {
  /* THE LIST REBUILDS ON EVERY SORT, FILTER, RE-RANK AND PAGE, and the tile
     this is anchored to goes with it. There is no render event to listen for,
     so the check rides along with every reposition — the same isConnected
     test focus.mjs uses for a trigger that went away. */
  if (!t.isConnected) return false;
  const c = col.getBoundingClientRect();
  const r = t.getBoundingClientRect();
  /* THE FLOOR. Below this the column cannot hold the card with its margins,
     and a 220px card jammed into a 200px column is worse than no card. It
     binds under about a 530px window, where .listcol is max-height:46vh. */
  if (c.height < H + EDGE * 2) return false;

  let x = r.left + r.width / 2 - c.left - W / 2;
  x = Math.max(EDGE, Math.min(x, c.width - W - EDGE));

  let y = r.top - c.top - H - GAP;
  let below = false;
  if (y < EDGE) { y = r.bottom - c.top + GAP; below = true; }
  y = Math.max(EDGE, Math.min(y, c.height - H - EDGE));

  /* CUSTOM PROPERTIES AND NOT left/top, because they compose with --peek-dy
     and --peek-s in ONE transform the stylesheet owns — the same idiom
     40-figure.css uses for --fig-x/--fig-y. §6 forbids animating a layout
     property and there are no exceptions. */
  el.style.setProperty('--peek-x', Math.round(x) + 'px');
  el.style.setProperty('--peek-y', Math.round(y) + 'px');
  if (below) el.setAttribute('data-below', '');
  else el.removeAttribute('data-below');
  return true;
}

function show(t, viaKey) {
  const src = t.querySelector('.set-thumb-img');
  if (!src) return;
  clearTimeout(hideTimer);
  el.hidden = false;
  if (!place(t)) { el.hidden = true; return; }
  anchor = t;
  /* THE SWAP IS INSTANT AND THERE IS NO CROSSFADE. §6: contents do not move
     while their container is moving, and the bytes are a memory-cache hit
     because the tile beside us is displaying them. */
  if (img.getAttribute('src') !== src.getAttribute('src')) {
    img.setAttribute('src', src.getAttribute('src'));
  }
  num.textContent = 'Fig. ' + (t.getAttribute('data-fig-n') || '');
  if (viaKey) el.setAttribute('data-via', 'key');
  else el.removeAttribute('data-via');
  /* THE START STATE HAS TO BE COMMITTED BEFORE THE CLASS LANDS. §6's first
     named defeat: the same style change that applies the start state also
     applies the transition, so the element animates TOWARDS zero and gets
     retargeted from wherever it reached. One frame, the way figure-viewer
     and the record already do it. */
  if (el.hasAttribute('data-open')) return;
  requestAnimationFrame(() => {
    if (anchor === t) el.setAttribute('data-open', '');
  });
}

function hide() {
  cancel();
  if (!el || el.hidden) { anchor = null; return; }
  anchor = null;
  el.removeAttribute('data-open');
  /* reduced() IS READ LIVE, never cached — motion.mjs's header requires it,
     because the prototype read it once at parse time and left the JS behind
     when somebody turned reduced motion on mid-session. */
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (!el.hasAttribute('data-open')) el.hidden = true;
  }, reduced() ? 0 : 140);
}

export function init() {
  el = $('#setPeek');
  col = $('#listcol');
  img = $('#setPeekImg');
  num = $('#setPeekN');
  if (!el || !col || !img || !num) return;

  /* pointerover AND NOT pointerenter: enter does not bubble, so it cannot be
     delegated, and one listener has to serve every tile the list rebuilds. */
  on(document, 'pointerover', '.set-thumb', (t, e) => {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    if (!eligible(t) || suppressed) return;
    cancel();
    /* NO DWELL IF ONE IS ALREADY OPEN. Moving along the strip re-anchors
       immediately; re-arming the timer between adjacent tiles is the delay
       working against the thing it was protecting. */
    if (el.hasAttribute('data-open')) { show(t, false); return; }
    timer = setTimeout(() => show(t, false), DWELL);
  });

  on(document, 'pointerout', '.set-thumb', (t, e) => {
    if (e.relatedTarget && t.contains(e.relatedTarget)) return;
    /* MOVING TO THE NEXT TILE IS NOT LEAVING. pointerout on the tile being
       left fires BEFORE pointerover on the one being entered, so closing here
       unconditionally defeated the "already open, no dwell" path one handler
       down: the peek shut and the next tile re-armed the 160ms timer, which
       is the delay working against the thing it was protecting. Sliding along
       a strip is one continuous glance. */
    const next = e.relatedTarget instanceof Element
      ? e.relatedTarget.closest('.set-thumb') : null;
    if (next && next !== t && eligible(next)) return;
    /* AND THE ESCAPE SUPPRESSION ENDS HERE, not only on focusout. A pointer
       user who pressed Escape never focuses anything, so keying it off focus
       alone left the peek suppressed for the rest of the session — measured,
       and it is the kind of thing that looks like the feature simply not
       working. Leaving the tile is the pointer's equivalent of blurring it. */
    suppressed = false;
    cancel();
    if (anchor === t) hide();
  });

  /* THE BACKSTOP. Leaving the column entirely can skip a tile's own pointerout
     when the pointer exits fast. */
  col.addEventListener('pointerleave', () => { suppressed = false; hide(); });

  /* THE KEYBOARD PATH IS NOT GATED ON pointerType — a keyboard attached to a
     touch device is still a keyboard — and it has NO DWELL, because focus is
     already a deliberate act. roving.mjs needs no change for any of this: it
     calls focusQuietly, whose focus event bubbles as focusin to here. */
  on(document, 'focusin', '.set-thumb', t => {
    if (!eligible(t)) { hide(); return; }
    /* :focus-visible IS THE GATE, and it has to be. A TAP focuses the button
       too, so focusin alone let a touch device open a hover preview through
       the back door — the pointerType gate one handler up cannot see it,
       because no pointer event is involved. :focus-visible is the platform's
       own answer to "was this keyboard focus", and it is the same test the
       focus ring already uses, so the peek appears exactly when the ring
       does. Measured: a real touchStart/touchEnd on a tile used to open it. */
    if (!t.matches(':focus-visible')) return;
    suppressed = false;
    cancel();
    show(t, true);
  });
  on(document, 'focusout', '.set-thumb', t => { if (anchor === t) hide(); });

  /* ONE CAPTURING LISTENER, TWO JOBS. The list scrolling under an open peek
     breaks the pointer's relationship to the tile, so it closes — but
     roving.mjs calls scrollIntoView({behavior:'smooth'}) AFTER moving focus,
     which leaves the rect measured at focusin stale for ~300ms. If the anchor
     still holds focus, re-anchor instead of closing. */
  document.addEventListener('scroll', () => {
    if (!anchor) return;
    if (document.activeElement === anchor && anchor.isConnected) {
      if (!place(anchor)) hide();
    } else hide();
  }, true);

  window.addEventListener('resize', hide);

  /* ESCAPE CLOSES IT AND IT DOES NOT JOIN THE ESC-STACK. esc-stack is for
     things that OWN the key; a non-interactive preview must not sit above an
     open sort menu, because a founder pressing Escape with a menu open means
     the menu. So it listens itself, does NOT preventDefault, and suppresses
     itself until focus leaves the tile. */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !anchor) return;
    suppressed = true;
    hide();
  });
}
