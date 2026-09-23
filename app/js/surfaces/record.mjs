/* surfaces/record — the patent record, over the right pane. platform.md §6.6.
 *
 * ═══ THE PEEK IS THE SPEC, NOT A MARGIN ════════════════════════════════════
 * The record leaves ~200px of the views showing behind it. That is what keeps
 * it legible as "this came from there" rather than as "this replaced that",
 * which is why `.rec` is positioned against `.panecol` and ships inside
 * surface.html rather than in a host of its own.
 *
 * ═══ NOTHING ARRIVES INTERPRETED ═══════════════════════════════════════════
 * The abstract and the claim set are AS PUBLISHED. No highlight offsets, no
 * plain-English decode, no summary. `claims` is an ARRAY, one entry per claim,
 * never one blob: a patent numbers its claims and counsel is pointed at claim 4
 * by number.
 *
 * ═══ WHICH FIELDS ARE FIGURES ══════════════════════════════════════════════
 * A number and a classification symbol are read character by character and
 * retyped into somebody else's field; a name and a jurisdiction are read as
 * words. Inconsolata for the first, the text face for the second — and the
 * class goes on the <dd>, so a mono field carries it whether it holds real
 * English or a bar, and there is no second code path to keep in step.
 */
import { $, esc } from '../core/dom.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { say } from '../core/live-region.mjs';
import { onActivate } from '../core/delegate.mjs';
import { push, drop } from '../core/esc-stack.mjs';
import { focusQuietly, captureFocus } from '../core/focus.mjs';
import { wait as pause } from '../core/timers.mjs';
import { bar, bars, statusHTML } from '../core/primitives.mjs';
import { bump, stale } from '../core/generation.mjs';
import { reduced } from '../core/motion.mjs';
import * as Viewer from '../core/figure-viewer.mjs';

let ENGINE = null;
let restore = null;
/* THE OPEN RECORD'S DRAWINGS, held so a thumbnail press hands the viewer the
   whole set rather than one src. Paging inside the viewer needs the others,
   and re-reading them out of the DOM would mean parsing <img> tags back into
   the shape the port already gave us. */
let FIGURES = [];
/* WHICH PATENT IS OPEN, so the step controls know where they are. The list is
   hidden while the record is up (platform.md §4.5), so this is the only thing
   that knows the founder's place in it. */
let OPEN_ID = null;
const FLOOR = 240;

const MONO = { number: 1, appno: 1, ipcMain: 1, ipc: 1 };
const FIELDS = [
  ['number', 'Number'], ['appno', 'Application'], ['kind', 'Kind'],
  ['status', 'Status'], ['filed', 'Filed'], ['published', 'Published'],
  ['where', 'Where'], ['holder', 'Holder'], ['inventors', 'Inventors'],
  ['ipcMain', 'Main class'], ['ipc', 'Classes'],
];

function valueHTML(rec, key) {
  const v = rec[key];
  if (key === 'status') return v ? statusHTML(v) : bar('w-sm');
  if (v == null) {
    /* null is "this value exists and we decline to print it". The bar count
       for a list field is a shape, not a claim about how many there are. */
    if (key === 'ipc') return bars(3, ['w-sm', 'w-xs', 'w-sm']);
    if (key === 'inventors') return bars(3, ['w-sm', 'w-sm', 'w-xs']);
    return bar(key === 'holder' ? 'w-lg' : 'w-md');
  }
  if (Array.isArray(v)) return v.map(x => '<span>' + esc(x) + '</span>').join('');
  return esc(v);
}

/* ── the drawings · platform.md §6.6 ───────────────────────────────────────
   A FIGURE *IS* THE RECORD, which is why this is the one visual thing in the
   pane that is not a reading of the patent. The identifiers, the abstract and
   the claims are the published text; these are the published drawings.

   NO BARS HERE, AND THAT IS THE POINT. §8's skeleton contract is for values
   that exist and are being withheld — a grey rectangle where a drawing goes
   would claim a drawing is being withheld rather than that the record has
   none. An empty array gets a sentence instead.

   THE NUMBER IS THE PATENT'S, NOT THE INDEX. Claims refer to figures by
   number, so `n` is carried through the contract rather than counted here: a
   record whose first drawing is FIG. 2 is an ordinary record, and renumbering
   it would make the claims point at the wrong picture.

   IT IS ALWAYS VISIBLE, not only on hover. The founder asked for the number on
   hover and that is what the raised state does — but a caption that exists
   only under a pointer is a caption that does not exist on a touch screen or
   to a keyboard, so it sits there quietly and hover brings it up. */
function figuresHTML(figures) {
  const figs = Array.isArray(figures) ? figures : [];
  if (!figs.length) {
    return '<section class="pn-sec"><h4 class="t-micro pn-sec-h">Drawings</h4>'
      + '<p class="pn-nofig t-body">This record has no drawings.</p></section>';
  }
  return '<section class="pn-sec pn-figs-sec">'
    + '<h4 class="t-micro pn-sec-h">Drawings '
    + '<span class="fig fig-s">' + figs.length + '</span></h4>'
    + '<ol class="pn-figs" id="pnFigs">'
    + figs.map((f, i) =>
        '<li class="pn-fig">'
        /* THE WHOLE THUMBNAIL IS THE CONTROL. A separate "open" affordance
           beside a picture is two targets for one intention, and the picture
           is the bigger and more obvious of the two. */
        /* A WITHHELD FIGURE IS NOT A CONTROL THAT OPENS AN EMPTY VIEWER.
           `src === null` means the drawing exists and we decline to show it,
           so there is nothing larger to open — the button says why instead,
           the same way `Drawings only` refuses on a record with none.
           aria-disabled rather than disabled, so it keeps its tab stop and
           can carry the reason to a keyboard. */
        + '<button class="pn-fig-btn" type="button" data-fig="' + i + '"'
        + (f.src == null ? ' aria-disabled="true"' : '')
        + ' aria-label="Figure ' + f.n
        + (f.src == null ? ', not shown' : ', open it larger') + '">'
        /* `src === null` MEANS RENDER THE FRAME, and it is the only thing that
           means that. An <img> with a null src is a broken-image glyph and a
           console 404 per figure; the frame says the same thing the bar two
           fields up says, in the shape a drawing has. */
        + (f.src == null
          ? '<span class="pn-fig-sk sk" aria-hidden="true"></span>'
          : '<img class="pn-fig-img" src="' + esc(f.src) + '" alt="" loading="lazy"'
            + ' decoding="async">')
        + '<span class="pn-fig-n fig fig-s">' + f.n + '</span>'
        + '</button></li>').join('')
    + '</ol></section>';
}

function paneHTML(rec) {
  const claims = (rec.claims || []).map((c, k) =>
    '<li class="pn-claim"><span class="fig fig-s pn-cn">' + (k + 1) + '</span>'
    + '<span class="pn-prose">' + esc(c) + '</span></li>').join('');

  const claimCount = rec.claims ? rec.claims.length : 0;

  return '<div class="pn">'
    + '<div class="pn-head"><div class="pn-head-lines">'
    + '<div class="pn-name">'
    + (rec.title || rec.skim
      ? '<span class="pn-name-real">' + esc(rec.title || rec.skim) + '</span>'
      : bar('w-full', 'title') + bar('w-lg', 'title'))
    + '</div>'
    + '<div class="pn-meta">' + (rec.status ? statusHTML(rec.status) : '')
    + '<span class="fig fig-s pn-no">' + valueHTML(rec, 'number') + '</span>'
    + '</div></div></div>'
    + '<div class="pn-body">'
    + '<dl class="hf">' + FIELDS.map(([k, label]) =>
        '<dt class="t-micro">' + label + '</dt>'
        + '<dd' + (MONO[k] ? ' class="fig"' : '') + '>' + valueHTML(rec, k) + '</dd>'
      ).join('') + '</dl>'
    + figuresHTML(rec.figures)
    + '<section class="pn-sec"><h4 class="t-micro pn-sec-h">Abstract</h4>'
    + '<div class="pn-lines">'
    + (rec.abstract
      ? '<p class="pn-prose">' + esc(rec.abstract) + '</p>'
      : bars(4, ['w-full', 'w-full', 'w-full', 'w-lg']))
    + '</div></section>'
    + '<section class="pn-sec"><h4 class="t-micro pn-sec-h">Claims '
    + '<span class="fig fig-s">' + (claimCount || '') + '</span></h4>'
    + (claimCount
      ? '<ol class="pn-claims">' + claims + '</ol>'
      : '<ol class="pn-claims">' + Array.from({ length: 6 }, (_, k) =>
          '<li class="pn-claim"><span class="fig fig-s pn-cn">' + (k + 1) + '</span>'
          + '<span class="pn-lines">'
          + bars(k === 0 ? 4 : 2, ['w-full', 'w-full', 'w-lg', 'w-md'])
          + '</span></li>').join('') + '</ol>')
    + '</section>'
    + '</div></div>';
}

/* ── THE PANE IS DRIVEN BY A CLASS ON #app, NOT BY `hidden` ALONE ──────────
   `.rec` is `visibility:hidden` and translated off until `.rec-open` lands on
   an ancestor, so unhiding the element alone leaves it invisible and the
   surface looks as if the row did nothing. `hidden` still does the a11y work —
   it is what keeps the pane out of the tab order while it is away — so both are
   needed and they are not redundant.

   ON CLOSE THE HIDE WAITS FOR THE TRANSITION. Hiding on the same frame as the
   class comes off removes the element mid-slide and the record vanishes rather
   than leaving. */
function close() {
  OPEN_ID = null;
  const pane = $('#recPane');
  const app = $('#app');
  if (!pane || pane.hidden) return;
  /* A DRAWING CANNOT OUTLIVE THE RECORD IT BELONGS TO. The viewer is absolute
     inside the same column, so closing the record underneath it would leave a
     figure floating over an empty pane with its own esc-stack entry still
     registered. */
  Viewer.close();
  if (app) app.classList.remove('rec-open');
  drop('record');
  /* `restore` IS A FUNCTION, NOT A NODE. captureFocus hands back the act of
     restoring rather than the thing to restore to, because it is the one that
     knows about the fallback and about isConnected — a row re-rendered while
     the record was open is the ordinary case, not the exception, and focusing
     a detached node silently drops focus to <body>.

     This read `restore.isConnected`, which is undefined on a function, so the
     guard was never true and closing the record left focus on <body>. It threw
     nothing and logged nothing: a keyboard user pressed Escape and landed at
     the top of the document. */
  if (restore) restore();
  restore = null;
  setTimeout(() => {
    if (!app || !app.classList.contains('rec-open')) pane.hidden = true;
  }, reduced() ? 0 : 220);
}

/* THE ORDER IS READ OFF THE DOM, not held as a second array. The list already
   holds the true sequence — Find similar MOVES rows rather than rebuilding
   them, so a cached copy would be the one that went stale. Reading it costs a
   querySelectorAll on a press a human made. */
function rowIds() {
  return [...document.querySelectorAll('#setList .drill-toggle')]
    .map(b => b.getAttribute('data-pn'));
}

/* Both controls are aria-disabled at the ends rather than hidden: a control
   that vanishes at the end of a list takes its own explanation with it, and
   the founder cannot tell whether they ran out or it broke. */
function syncSteps() {
  const ids = rowIds();
  const i = ids.indexOf(OPEN_ID);
  const set = (sel, off, word) => {
    const b = $(sel);
    if (!b) return;
    const to = i < 0 ? -1 : i + off;
    const none = to < 0 || to >= ids.length;
    b.setAttribute('aria-disabled', String(none));
    b.setAttribute('aria-label', none
      ? word + ' patent — you are at the ' + (off < 0 ? 'first' : 'last') + ' result'
      : word + ' patent in your results, ' + (to + 1) + ' of ' + ids.length);
  };
  set('#recPrev', -1, 'Previous');
  set('#recNext', +1, 'Next');
}

/* Stepping keeps focus where it is. The founder pressed Next and is still
   pressing Next; moving focus to the heading on every step would make the
   second press land on something else. */
function step(delta) {
  const ids = rowIds();
  const i = ids.indexOf(OPEN_ID);
  if (i < 0) return;
  const to = i + delta;
  if (to < 0 || to >= ids.length) return;
  open(ids[to], null, true);
}

async function open(id, trigger, stepping) {
  const pane = $('#recPane');
  const body = $('#recBody');
  if (!pane || !body) return;

  const app = $('#app');
  OPEN_ID = id;
  /* A STEP DOES NOT RE-CAPTURE THE RETURN POINT. Escape after five Next
     presses must land back on the row the founder actually opened, not on the
     one they stepped to — otherwise closing returns them somewhere they never
     chose to be. */
  if (!stepping) restore = captureFocus(trigger);
  syncSteps();
  pane.hidden = false;
  /* the class is set BEFORE .rec-open so it is already in force on the frame
     the transition would otherwise start on — reduced motion has to win the
     race, not undo the animation afterwards */
  if (app) {
    app.classList.toggle('rec-instant', reduced());
    /* one frame, so `hidden=false` has been painted and the transform has
       something to transition FROM. Setting both on one frame is how a
       slide-over comes out as a jump. */
    requestAnimationFrame(() => app.classList.add('rec-open'));
  }
  push('record', close);

  const token = bump('record');
  waitOn(body, 360);
  const [res] = await Promise.all([ENGINE.record({ id }), pause(FLOOR)]);
  if (stale('record', token)) return;

  if (!res.ok) {
    /* NOT retryable for a record — the engine says so, and the block then says
       there is no way forward BY HAVING NO BUTTON rather than by saying so. */
    failWith(body, 'This record could not be opened.',
      res.retryable ? () => open(id, trigger) : null);
    say('list', 'This record could not be opened.');
    return;
  }
  FIGURES = Array.isArray(res.data.figures) ? res.data.figures : [];
  landIn(body, paneHTML(res.data));
  /* THE MODE CONTROL FOLLOWS THE DATA. `Drawings only` cannot be pressed on a
     record that has none: a toggle that switches to an empty pane is a control
     reporting a fault in itself. aria-disabled rather than disabled, so it
     keeps its tab stop and can say why. */
  /* THREE STATES, NOT TWO, and collapsing them is the same error the figures
     contract warns about one level down. A record may have NO drawings; it may
     have drawings Terrain declines to show; or it may have drawings you can
     open. "Pick a drawing" over six withheld frames invites a press that
     cannot work, which is the one thing a control must never do. */
  const none = FIGURES.length === 0;
  const openable = FIGURES.some(f => f && f.src != null);

  const imgBtn = $('#modeImages');
  if (imgBtn) {
    imgBtn.setAttribute('aria-disabled', String(none));
    imgBtn.setAttribute('aria-label',
      none ? 'Drawings only — this record has none' : 'Drawings only');
  }
  /* AND THE RIGHT COLUMN SAYS WHICH NOTHING IT IS SHOWING. A blank half-screen
     reads as a region that failed to load. */
  const idle = $('#paneIdleRec');
  if (idle) idle.textContent =
      none     ? 'This patent has no drawings.'
    : !openable ? 'This patent has ' + FIGURES.length
                  + (FIGURES.length === 1 ? ' drawing, which is' : ' drawings, which are')
                  + ' not shown here.'
    :             'Pick a drawing to see it here.';
  syncSteps();
  /* focus moves to the heading, quietly — preventScroll is the fix for the
     record jumping the pane it opened over. NOT ON A STEP: the founder's hand
     is on the Next button and moving focus off it breaks the second press. */
  if (!stepping) focusQuietly($('#recTitle'));
  else say('list', 'Patent ' + (rowIds().indexOf(id) + 1) + ' of ' + rowIds().length + '.');
}

export function init(ctx) {
  ENGINE = ctx.engine;
  Viewer.init();

  onActivate(document, '.pn-fig-btn', el => {
    if (el.getAttribute('aria-disabled') === 'true') {
      say('list', 'This drawing is not shown.');
      return;
    }
    Viewer.open(FIGURES, Number(el.getAttribute('data-fig')) || 0, el);
  });
  onActivate(document, '.drill-toggle', el => open(el.getAttribute('data-pn'), el));
  onActivate(document, '#recClose', close);
  onActivate(document, '#recPrev', b =>
    b.getAttribute('aria-disabled') === 'true' || step(-1));
  onActivate(document, '#recNext', b =>
    b.getAttribute('aria-disabled') === 'true' || step(+1));
}
