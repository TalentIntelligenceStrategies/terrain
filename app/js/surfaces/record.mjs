/* surfaces/record — the patent record, over the right pane. platform.md §4.5.
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
import { bar, bars, statusHTML, statusWord } from '../core/primitives.mjs';
import { bump, stale } from '../core/generation.mjs';
import { reduced } from '../core/motion.mjs';
import * as Starred from '../core/starred.mjs';
import * as Viewer from '../core/figure-viewer.mjs';

let ENGINE = null;
let restore = null;
/* THE OPEN RECORD'S DRAWINGS, held so a thumbnail press hands the viewer the
   whole set rather than one src. Paging inside the viewer needs the others,
   and re-reading them out of the DOM would mean parsing <img> tags back into
   the shape the port already gave us. */
let FIGURES = [];
/* THE OPEN RECORD, kept for the closing block's citation. The <dl> above is
   rendered HTML by then, and scraping five values back out of markup that
   renders half of them as skeleton bars is parsing a skeleton. */
let REC = null;
/* WHICH PATENT IS OPEN, so the step controls know where they are. The list is
   hidden while the record is up (platform.md §4.5), so this is the only thing
   that knows the founder's place in it. */
let OPEN_ID = null;
const FLOOR = 240;
/* how many thumbnails the strip shows before the control. See figuresHTML. */
const CAP = 12;

const MONO = { number: 1, appno: 1, ipcMain: 1, ipc: 1 };
/* platform.md §4.5's five-field handoff, and the only place it exists. It was
   specified, claimed as built, and never built: 35-record.css said "the
   five-field handoff is now a SUBSET VIEW of this same record through the
   same field function", and FIELDS has exactly one caller rendering all
   eleven. That renderer was deleted and the comment outlived it.

   A PROJECTION, NOT A SECOND FIELD LIST. Printing five of the eleven again at
   the foot of a record that has just printed all eleven is the repetition the
   Classes rule already refuses — "a reader who sees it twice looks for the
   difference". Its stated purpose is "for the founder taking this to
   counsel", which is something that LEAVES, so it is the clipboard's payload
   rather than a block on screen.

   THE TITLE IS THE SIXTH AND THE CONTROL IS WHY. A citation without a title
   is a handoff line, not a citation. .rec-end-note names all six where the
   founder is standing when they press it. */
const HANDOFF = ['number', 'title', 'holder', 'where', 'status', 'ipcMain'];

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
  /* CLASSES DOES NOT REPEAT MAIN CLASS. Real classification lists lead with
     the main symbol, so the two rows printed the same code one above the
     other — a reader sees a repetition and looks for the difference. The
     payload is unchanged and still carries the full list (`components.md`
     §1); this is the renderer declining to say the same thing twice. */
  if (key === 'ipc' && Array.isArray(v) && rec.ipcMain) {
    const rest = v.filter(c => c !== rec.ipcMain);
    if (!rest.length) return '<span class="pn-only">Only the main class</span>';
    v.length = 0; v.push(...rest);
  }
  if (Array.isArray(v)) return v.map(x => '<span>' + esc(x) + '</span>').join('');
  return esc(v);
}

/* CLAIM TEXT ARRIVES CARRYING ITS OWN NUMBER — "1. A method of…" — and the
   gutter adds one, so every claim printed its number twice. Stripping it
   blindly would be worse: a claim set that does not start at 1, or one whose
   numbering has been preserved through a reissue, is telling you something.
   So the leading number comes off ONLY when it agrees with the position the
   gutter is about to print. Where they disagree, both stay and the disagreement
   is visible, which is the useful outcome. */
/* A WITHHELD FIELD CONTRIBUTES NOTHING — not the string "null", not an empty
   separator. Same rule the export's own cell() follows one surface over. */
function citation(rec) {
  return HANDOFF
    .map(k => (k === 'status' ? statusWord(rec.status) : rec[k]))
    .filter(v => v != null && v !== '')
    .join(' · ');
}

function claimText(text, n) {
  const m = /^\s*(\d+)\s*[.)]\s+/.exec(text || '');
  return m && Number(m[1]) === n ? text.slice(m[0].length) : text;
}

/* ── the drawings · platform.md §4.5 ───────────────────────────────────────
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
  /* ══ TWO ROWS, AND THE REST BEHIND A CONTROL ════════════════════════════
     A REAL RECORD IN THE CORPUS HAS 347 FIGURES. Rendered whole, under the
     claims, that is a wall of thumbnails nobody scrolls to the end of and it
     buries whatever comes after it. Capping at CAP shows what a drawings
     strip is for — a glance at what this patent looks like — and the count in
     the heading already says how many there are, so the control is disclosure
     rather than a claim about the data.

     THE CAP IS A COUNT, NOT A HEIGHT. The track is auto-fill, so the number
     per row changes with the column; a max-height would show two rows at one
     width and one and a half at another. Twelve is two rows at the six-across
     this column gives and three at four-across, and both read as a strip.

     THE CAP IS CSS. Every thumbnail is in the DOM either way, so the control
     unhides rather than re-renders — and `Drawings only` mode lifts it with
     one rule, because a mode whose whole purpose is the drawings should not
     hide most of them. */
  const capped = figs.length > CAP;
  return '<section class="pn-sec pn-figs-sec">'
    + '<h4 class="t-micro pn-sec-h">Drawings '
    + '<span class="fig fig-s">' + figs.length + '</span></h4>'
    + '<ol class="pn-figs" id="pnFigs"' + (capped ? ' data-capped' : '') + '>'
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
    + '</ol>'
    + (capped
      ? '<button class="pn-figs-more" type="button" aria-expanded="false">'
        + '<span>Show all ' + figs.length + ' drawings</span></button>'
      : '')
    + '</section>';
}

function paneHTML(rec) {
  const claims = (rec.claims || []).map((c, k) =>
    '<li class="pn-claim"><span class="fig fig-s pn-cn">' + (k + 1) + '</span>'
    + '<span class="pn-prose t-body">' + esc(claimText(c, k + 1)) + '</span></li>').join('');

  const claimCount = rec.claims ? rec.claims.length : 0;

  return '<div class="pn">'
    /* THE NUMBER LEADS, THE SAME WAY IT LEADS THE ROW. It was under the title
       beside the status chip, which made the record and the row disagree about
       what a patent is called first — the founder scans a number on the left,
       presses, and has to find it again somewhere else on the right. It is the
       one string they carry out of here into their own documents.

       THE STATUS STAYS UNDER THE TITLE. It is a fact ABOUT the patent rather
       than its name, and it is the one coloured thing in this head; putting it
       up on the identifier line would make the first thing read a hue. */
    + '<div class="pn-head"><div class="pn-head-lines">'
    + '<div class="pn-no-line">'
    + '<span class="fig fig-s pn-no">' + valueHTML(rec, 'number') + '</span>'
    + '</div>'
    + '<div class="pn-name">'
    + (rec.title || rec.skim
      ? '<span class="pn-name-real t-title">' + esc(rec.title || rec.skim) + '</span>'
      : bar('w-full', 'title') + bar('w-lg', 'title'))
    + '</div>'
    + '<div class="pn-meta">' + (rec.status ? statusHTML(rec.status) : '')
    + '</div></div></div>'
    + '<div class="pn-body">'
    + '<dl class="hf">' + FIELDS.map(([k, label]) =>
        '<dt class="t-micro">' + label + '</dt>'
        + '<dd' + (MONO[k] ? ' class="fig"' : '') + '>' + valueHTML(rec, k) + '</dd>'
      ).join('') + '</dl>'
    /* ══ THE DRAWINGS SIT UNDER THE FIELD PANEL ═══════════════════════════
       platform.md §4.5, and this is the third position they have had. They
       were here, then last — under the claims — on the reading that "under
       the text" meant under ALL of it.

       MEASURED, THAT PUT THEM 951px DOWN A 1300px SCROLLER. A founder who
       opens a patent to see what it looks like scrolled past five to forty
       claims of legal prose and mostly concluded the pictures were not there.
       Ordering by what a patent is published in lost to ordering by what the
       reader came for.

       UNDER THE PANEL AND NOT INSIDE IT. The <dl> above has its own ground —
       it is the identifiers, one block — and the drawings are the patent
       rather than a fact about it. They follow it, at the section rhythm
       everything else in this pane uses. */
    + figuresHTML(rec.figures)
    + '<section class="pn-sec"><h4 class="t-micro pn-sec-h">Abstract</h4>'
    + '<div class="pn-lines">'
    + (rec.abstract
      ? '<p class="pn-prose t-body">' + esc(rec.abstract) + '</p>'
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
  markOpen(null);
  /* `data-mode` IS NOT RESET HERE and no longer could be. It was a property of
     the record being read while the record owned the toggle; it is a property
     of how the LIST is drawn now, and the list outlives any one record. */
  const end = $('#recEnd');
  if (end) { end.hidden = true; end.removeAttribute('data-pn'); }
  REC = null;
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

/* ══ THE LIST SAYS WHICH ROW IS OPEN ═════════════════════════════════════
   Both layers specified this and neither was wired: list.mjs writes
   aria-current="false" on every toggle and nothing ever set it true, and
   34-list.css styles .set-row[data-open] and nothing ever wrote it. It was
   cosmetic while the record stood in the list's place, because the list was
   not on screen to mark. The list never leaves now, so the founder can see
   six rows and the record of one of them with nothing joining the two.

   ONE PLACE WRITES BOTH, so the visible mark and the announced state cannot
   drift. `id` of null clears. */
function markOpen(id) {
  document.querySelectorAll('#setList .drill-toggle').forEach(b => {
    const on = id != null && b.getAttribute('data-pn') === id;
    b.setAttribute('aria-current', String(on));
    const row = b.closest('.set-row');
    if (row) row.toggleAttribute('data-open', on);
  });
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

/* `opts` RATHER THAN A FOURTH POSITIONAL. `stepping` stays where it is
   because three call sites pass it; `figure` arrives from the row's drawings
   and nothing else, and open(id, el, false, 3) would have been unreadable at
   every one of them. */
async function open(id, trigger, stepping, opts = {}) {
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
  markOpen(id);
  syncSteps();
  pane.hidden = false;
  /* ONE FRAME, so `hidden=false` has been painted before the class lands.
     `.rec-instant` used to be toggled here for reduced motion and NOTHING
     EVER STYLED IT — it was the partner of a slide-over that became a
     display swap, and a class no stylesheet matches is a class the next
     reader has to disprove. The record does not animate in; there is
     nothing for reduced motion to shorten. */
  if (app) requestAnimationFrame(() => app.classList.add('rec-open'));
  push('record', close);

  /* THE COLUMN GOES BACK TO THE TOP, AND IT HAS TO BE SAID OUT LOUD NOW.
     Replacing #recBody's innerHTML used to reset the scroll for free, because
     #recBody WAS the scroller. .panescroll is the scroller since 2026-09-24
     and the head is constant content inside it, so stepping Next from claim
     30 would land on claim 30 of the next patent. focusQuietly cannot do it:
     it is focus({preventScroll:true}) by design, which is the fix for the
     record jumping on open.
     BEFORE waitOn, so the wait block is seen from the top rather than
     scrolled past. */
  const col = $('#paneScroll');
  if (col) col.scrollTop = 0;

  /* THE CLOSING BLOCK GOES BEFORE THE WAIT DOES. It lives outside #recBody, so
     waitOn() and failWith() cannot take it down — five controls offering to
     star, cite and export a record that has not arrived, or has just failed
     to. record.mjs owns it explicitly because the markup is static. */
  const end = $('#recEnd');
  if (end) end.hidden = true;
  REC = null;

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
  REC = res.data;
  landIn(body, paneHTML(res.data));
  if (end) {
    const star = $('#recStar'), sim = $('#recSimilar'),
          out = $('#recOut'), cite = $('#recCite');
    /* data-star IS THE WHOLE WIRING. list.mjs's delegated .set-star handler
       reads it, so the record's star is the row's star with a label on it —
       one treatment, one handler, one set. */
    if (star) {
      star.setAttribute('data-star', id);
      star.setAttribute('aria-pressed', String(Starred.has(id)));
    }
    if (sim) sim.setAttribute('data-pn', id);
    /* OMITTED, NOT DISABLED, and it is the score's rule applied to a control:
       there is no act here and no sentence to read, so a disabled button would
       be a promise the engine has not made. `sourceUrl` is not in the port
       yet — components.md §4 question 3 — so until it is, undefined means the
       placeholder stands and only an explicit null hides it. */
    if (out) out.hidden = res.data.sourceUrl === null;
    if (cite) cite.hidden = res.data.number == null && res.data.title == null;
    /* THE BLOCK CARRIES THE ID, so the export menu inside it does not have to
       ask another control which record it is looking at. */
    end.setAttribute('data-pn', id);
    end.hidden = false;
  }
  /* ══ THE MODE CONTROL IS NOT THE RECORD'S ANY MORE ══════════════════════
     This used to mark `Drawings only` aria-disabled from the open record's
     figure count, which was right while the toggle governed this pane. It
     governs the LIST now (work.mjs), so a record with no drawings says so in
     its own strip and has no business reaching up into the search bar to
     disable a control about twenty other patents. */
  /* ══ THE SECOND IDLE SENTENCE IS GONE, AND SO ARE ITS THREE STATES ═════
     The right column used to carry a sentence with three forms — no drawings,
     drawings we decline to show, or pick one — because the drawing opened
     HERE and this column was the empty thing being explained. The drawing is
     a lightbox over the viewport now and the record is in this column, so
     there is no second empty region and nothing to write in it.

     THE DISTINCTION IS NOT LOST, it moved to where it is asked. figuresHTML
     renders a withheld drawing as a frame that says so and refuses the press
     (aria-disabled), and a record with none prints "This record has no
     drawings" in the strip's own place — which is where a founder looking
     for drawings is looking. The column-idle copy was the same three facts
     one column away from the question. */
  syncSteps();
  /* ══ A ROW DRAWING OPENED TWO THINGS, AND THE ORDER IS THE STACK'S ══════
     The record was pushed first and the viewer goes second, so Escape closes
     the drawing and leaves the record standing — the order they were opened
     in. Nothing new is needed for that; it falls out of push('record') then
     push('figure').

     THE JOIN IS THE PUBLISHED FIGURE NUMBER AND NOT THE INDEX. ports.mjs is
     explicit that the row's `thumbs` and the record's `figures` are two
     renditions the engine chooses independently — nothing says thumbs[3] is
     figures[3], and a renumbered figure is a different document.

     AND IT WAITED FOR THE RECORD. Opening the viewer on the row's own
     thumbnail would have blown a ~4 KB, ~90px image up to the viewport, which
     is the failure components.md §4 question 4 records costing a month. */
  const want = opts.figure;
  const at = want == null ? -1 : FIGURES.findIndex(f => f && f.n === want);
  if (at >= 0) {
    /* NOT focusQuietly BELOW, and this is the trap. Viewer.open moves focus to
       its own close button and marks #app inert; focusing #recTitle after that
       puts the keyboard inside an inert subtree, which silently drops it on
       <body>. The viewer owns focus from here. */
    Viewer.open(FIGURES, at, trigger);
    return;
  }
  /* NO FALLBACK TO ZERO. A row thumbnail whose number is in none of the
     record's figures is two ports disagreeing, and opening a different drawing
     would hide that. The record is open, which is the half of the act that is
     certainly right. */
  /* focus moves to the heading, quietly — preventScroll is the fix for the
     record jumping the pane it opened over. NOT ON A STEP: the founder's hand
     is on the Next button and moving focus off it breaks the second press. */
  if (!stepping) focusQuietly($('#recTitle'));
  else say('list', 'Patent ' + (rowIds().indexOf(id) + 1) + ' of ' + rowIds().length + '.');
}

export function init(ctx) {
  ENGINE = ctx.engine;
  Viewer.init();

  /* ══ A DRAWING MAY NOT OUTLIVE THE SURFACE IT WAS OPENED ON ══════════════
     The viewer became position:fixed and moved to <body> on 2026-09-24, which
     took it out of `.view-work` and out of the router's reach — leaving the
     results surface with a drawing open would float it over the starred set,
     over billing, over everything, with `#app` still inert underneath and no
     control reachable. go() switches views by class and closes nothing, so
     the close has to be asked for here.

     THE RECORD GOES TOO, and for a plainer reason: it is the thing the
     drawing belongs to, and coming back to a surface mid-read is a state the
     founder did not leave in. */
  ctx.onRoute(() => { if (Viewer.isOpen()) Viewer.close(); close(); });

  onActivate(document, '.pn-fig-btn', el => {
    if (el.getAttribute('aria-disabled') === 'true') {
      say('list', 'This drawing is not shown.');
      return;
    }
    Viewer.open(FIGURES, Number(el.getAttribute('data-fig')) || 0, el);
  });
  /* THE CONTROL UNHIDES RATHER THAN RE-RENDERS, so the thumbnails already
     fetched are not fetched again and the founder's scroll position holds.
     It does not collapse back: a founder who asked for 347 drawings and got
     them does not then want a control offering to take 335 away, and the
     record's own close is the way out of a long strip. */
  onActivate(document, '.pn-figs-more', el => {
    const ol = $('#pnFigs');
    if (!ol) return;
    ol.removeAttribute('data-capped');
    el.setAttribute('aria-expanded', 'true');
    el.hidden = true;
    say('work', 'All drawings shown.');
  });
  onActivate(document, '.drill-toggle', el => open(el.getAttribute('data-pn'), el));
  /* ── a drawing on a ROW ──────────────────────────────────────────────
     It lives here rather than in list.mjs because it needs FIGURES, which is
     the record's, and because the act it performs IS opening a record. The
     strip is a sibling of .drill-toggle now, so this is the only handler that
     sees the press — nothing bubbles into the row's button any more. */
  onActivate(document, '.set-thumb', el => {
    const row = el.closest('.set-row');
    if (!row) return;
    const id = row.getAttribute('data-id');
    /* the +N tile is about the record, not about one drawing */
    if (el.classList.contains('set-thumb-more')) { open(id, el); return; }
    if (el.getAttribute('aria-disabled') === 'true') {
      say('list', 'This drawing is not shown.');
      return;
    }
    open(id, el, false, { figure: Number(el.getAttribute('data-fig-n')) });
  });
  onActivate(document, '#recClose', close);
  onActivate(document, '#recPrev', b =>
    b.getAttribute('aria-disabled') === 'true' || step(-1));
  onActivate(document, '#recNext', b =>
    b.getAttribute('aria-disabled') === 'true' || step(+1));

  /* ── copy citation ───────────────────────────────────────────────────────
     THE GLYPH CONFIRMS AND THE LABEL DOES NOT. Changing the label would change
     the accessible name and announce the same fact a second time, which §7's
     "live regions announce once; two regions, two moments, never the same
     fact" forbids. So the mark swaps to a tick, the words stay put, and the
     live region says it once.

     AND IT STATES THE FIX RATHER THAN THE FAULT when the clipboard refuses.
     navigator.clipboard is absent on an insecure origin and rejects without a
     user gesture in some browsers; either way the founder's next move is the
     same, and the record above them is where the fields are. */
  onActivate(document, '#recCite', async btn => {
    if (!REC) return;
    const text = citation(REC);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      say('list', 'This browser would not let Terrain copy. '
        + 'The citation is in the record above.');
      return;
    }
    btn.setAttribute('data-done', '');
    setTimeout(() => btn.removeAttribute('data-done'), 1600);
    say('list', 'Citation copied.');
  });
}
