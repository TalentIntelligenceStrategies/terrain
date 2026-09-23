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
        + '<button class="pn-fig-btn" type="button" data-fig="' + i + '"'
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

async function open(id, trigger) {
  const pane = $('#recPane');
  const body = $('#recBody');
  if (!pane || !body) return;

  const app = $('#app');
  restore = captureFocus(trigger);
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
  const imgBtn = $('#modeImages');
  if (imgBtn) {
    const none = FIGURES.length === 0;
    imgBtn.setAttribute('aria-disabled', String(none));
    imgBtn.setAttribute('aria-label',
      none ? 'Drawings only — this record has none' : 'Drawings only');
  }
  /* focus moves to the heading, quietly — preventScroll is the fix for the
     record jumping the pane it opened over */
  focusQuietly($('#recTitle'));
}

export function init(ctx) {
  ENGINE = ctx.engine;
  Viewer.init();

  onActivate(document, '.pn-fig-btn', el =>
    Viewer.open(FIGURES, Number(el.getAttribute('data-fig')) || 0, el));
  onActivate(document, '.drill-toggle', el => open(el.getAttribute('data-pn'), el));
  onActivate(document, '#recClose', close);
}
