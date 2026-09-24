/* surfaces/list — the patent list. platform.md §6.3.
 *
 * ═══ FOUR FIELDS PER ROW AND NO MORE ═══════════════════════════════════════
 * The skim, the holder, the year, the status. The score sits WITH THE TITLE
 * rather than in the field row, and that is not a loophole: it says nothing
 * about the patent, only about where the engine put it.
 *
 * ═══ AND UP TO FOUR DRAWINGS, WHICH ARE NOT A FIFTH FIELD ══════════════════
 * The rule is about how many FACTS a row asserts, and it still asserts four. A
 * field is a value read off the patent — who holds it, when, what status. A
 * drawing is the patent. The left column is the glancing surface and it was
 * the only place in the product with no pictures at all.
 *
 * THEY ARE CONTROLS, AND THEY SIT OUTSIDE THE ROW'S OWN BUTTON. Each tile
 * opens the record at that drawing, so nesting them inside the row would be
 * invalid markup — and a drag-to-scroll begun inside a <button> ends as a
 * click on it, which would have opened a record on every sideways scroll.
 * ONE TAB STOP FOR THE STRIP, arrows inside: twenty rows of twelve is 240 tab
 * stops otherwise. The row's own aria-label is unchanged — it names the
 * patent, and a drawing count is not a fact about it.
 *
 * ═══ ALL THREE OF SORT, FILTER AND PAGE ARE REQUESTS ═══════════════════════
 * Twenty rows arrive at a time, so the client never holds the whole set — and
 * sorting what it has would sort A PAGE rather than a result. Each of them
 * waits, each can fail, and none of them spends points. A client-side sort
 * would be faster and would be lying about what it sorted.
 *
 * ═══ THE YEAR IS AN EXCEPTION, AND IT IS ARGUED ════════════════════════════
 * design-language.md §8's third named exception: a date sort over a column of
 * grey bars is an order the founder cannot check. The control is the argument,
 * not the row — so the year is always on, not only under a date sort.
 */
import { $, esc } from '../core/dom.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { say } from '../core/live-region.mjs';
import { onActivate } from '../core/delegate.mjs';
import { wait as pause } from '../core/timers.mjs';
import { bar, statusHTML, statusWord } from '../core/primitives.mjs';
import { bump, stale } from '../core/generation.mjs';
import { push, drop } from '../core/esc-stack.mjs';
import { focusQuietly } from '../core/focus.mjs';
import { btnWait, btnRest } from '../core/button-wait.mjs';
import * as Starred from '../core/starred.mjs';
import { rovingIn } from '../core/roving.mjs';

let ENGINE = null;
let MATCHED = 0;

/* WHAT THE PORT SAID ABOUT EACH ROW, kept so a star can hand the whole row to
   the set rather than an id. The starred view and the export both need fields
   the DOM renders as bars, and scraping them back out of the markup would mean
   parsing a skeleton. Rebuilt on every render, which is also every point the
   rows could have changed. */
const ROW_BY_ID = new Map();
let loaded = false;
const FLOOR = 240;

/* ── the star ─────────────────────────────────────────────────────────────
   platform.md §6.3. A star is an ANCHOR, not a bookmark: it says "this one is
   close to what I meant", and it does TWO things — platform.md §7.1. It adds
   the patent to the founder's starred set, which is theirs and has a surface of
   its own; and it makes `Find similar` available, which re-orders the whole
   result set by nearness to what was starred. NO PATENT ENTERS OR LEAVES the
   set — what changes is which of them the founder is shown first.

   The engine is told the anchors only when the founder presses Find similar,
   because starring is a thought and re-ordering is a request.

   THE SET ITSELF LIVES IN core/starred.mjs. It outlives this surface: the
   starred view renders it and the export writes it, and a Set private to the
   renderer would have made both of those reach into a renderer for state. */
const STARRED = Starred;

function syncStarUI() {
  const chip = $('#setStarChip');
  if (chip) {
    chip.hidden = STARRED.size() === 0;
    /* ONE FORM, NOT A TERNARY RETURNING THE SAME STRING TWICE. "starred" does
       not inflect, so the branch that stood here computed nothing while reading
       as though it handled a case it did not. */
    chip.textContent = STARRED.size() + ' starred';
  }
  /* HIDDEN, NOT DISABLED, exactly as the markup's own note says: a disabled
     button loitering in a 345px bar is clutter, and [hidden] takes it out of
     the tab order too. */
  const rebase = $('#setRebase');
  if (rebase) rebase.hidden = STARRED.size() === 0;
}

function toggleStar(id, btn) {
  const row = ROW_BY_ID.get(id) || { id };
  const on = STARRED.toggle(id, row);
  btn.setAttribute('aria-pressed', String(on));
  const el = btn.closest('.set-row');
  if (el) on ? el.setAttribute('data-starred', '') : el.removeAttribute('data-starred');
  syncStarUI();
  /* THE CONFIRMATION NAMES THE SET, not just the act. "Starred." says a
     button was pressed; the founder needs to know a collection exists, how big
     it is, and that it is the thing they can take out. */
  say('list', on
    ? 'Starred. ' + STARRED.size() + (STARRED.size() === 1 ? ' patent' : ' patents')
      + ' in your starred set. Find similar is available.'
    : 'Unstarred. ' + (STARRED.size()
        ? STARRED.size() + (STARRED.size() === 1 ? ' patent' : ' patents') + ' left.'
        : 'Nothing starred.'));
}

/* the sentence a screen reader reads for one row.

   IT READS THE SAME MAP THE CHIP DOES, and it did not until 2026-09-24. This
   line was `rec.status === 'live' ? 'Live' : 'Expired'` — a surviving ternary
   of exactly the kind primitives.mjs was built to delete — so the chip said
   *Abandoned* and the accessible name said *Expired* about the same patent.
   That is the identical false statement the export was fixed for, in the one
   place nothing on screen can contradict it. One map, three readers now.

   statusWord() RETURNS '' FOR AN UNKNOWN KIND, so the `if` guard stays right
   and a null status still contributes nothing to the sentence.

   THE NAME DOES NOT GROW WITH THE ROW. The row draws eight more fields than it
   did, and putting all of them here would make a screen reader read a
   paragraph per result before reaching the next one. What a name has to carry
   is what tells this row from the one under it — the title, who holds it, when,
   and its status. The rest is in the record, one press away, which is the same
   place a sighted founder goes for it. */
function rowName(rec, i) {
  const bits = [rec.skim != null ? rec.skim : 'Patent ' + (i + 1)];
  if (rec.holder != null) bits.push(rec.holder);
  if (rec.year != null) bits.push(String(rec.year));
  if (rec.status) bits.push(statusWord(rec.status));
  if (rec.score != null) bits.push('score ' + rec.score.toFixed(4));
  return bits.join(', ') + '. Open the record.';
}

/* WHAT THE STRIP HOLDS. ports.mjs carries the argument for the number, and
   record.mjs's own CAP is the same 12 — the row and the record agree about
   how many drawings is enough to judge a patent by. */
const THUMBS = 12;

/* ── the meta icons ───────────────────────────────────────────────────────
   LUCIDE, 14px, AND aria-hidden ON EVERY ONE. They are 14 rather than the 16
   §9 gives a control because none of them is one — a control is a hit target
   and these sit inside the row's own button, marking which fact is which so
   four values in a 2x2 grid do not read as four unlabelled strings. The word
   beside each is the label; the glyph is the shape that lets the eye find the
   same fact on the next row without reading it. */
const ICON = {
  who:  '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  firm: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>'
      + '<path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>'
      + '<path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>'
      + '<path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  when: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/>'
      + '<path d="M3 10h18"/>',
  what: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414'
      + 'l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/>'
      + '<circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
};
function glyph(k) {
  return '<svg class="dm-i" width="14" height="14" viewBox="0 0 24 24" fill="none"'
    + ' stroke="currentColor" stroke-width="1.5" stroke-linecap="round"'
    + ' stroke-linejoin="round" aria-hidden="true">' + ICON[k] + '</svg>';
}
/* one cell of the meta grid. `inner` is already-escaped HTML, because half the
   callers pass a bar and half pass text. */
function cell(k, inner) {
  return '<span class="dm">' + glyph(k) + '<span class="dm-v">' + inner + '</span></span>';
}

/* THE INVENTOR LINE PRINTS ONE NAME AND COUNTS THE REST. A patent with six
   inventors is the ordinary case in this corpus, not the exception, and six
   names is wider than the column and longer than the title. The record prints
   the set; the row prints who to think of it as. */
function inventorHTML(list) {
  if (!Array.isArray(list) || !list.length) return bar('w-md', 'micro');
  const rest = list.length - 1;
  return esc(list[0]) + (rest > 0
    ? '<span class="dm-more"> +' + rest + '</span>' : '');
}

/* ── one row ──────────────────────────────────────────────────────────────
   EVERY null IS A BAR AND NO BRANCH HERE ASKS WHETHER THE DATA IS REAL. A real
   engine returning real names changes nothing but the presence of a value.

   THE ROW IS THREE BANDS NOW — head, meta, abstract — and it was two. What
   drove it is that four fields could not answer the glance: a founder could not
   tell a TSMC filing from a university one, or a dither-matrix patent from a
   motor-control one, without opening the record, so the record was opened on
   every row. The bands are ordered by what settles the question soonest:
   identity, then party and date, then what it actually claims.

   THE STRIP IS NO LONGER INSIDE THE BUTTON, and that is a correctness fix
   rather than a layout one. It scrolls horizontally now, and a drag inside a
   <button> ends in a click — so scrolling the drawings opened a record every
   time. It is a sibling under .drill-row, and each drawing is its own button. */
function rowHTML(rec, i) {
  const real = rec.skim != null;
  const pn = esc(rec.id);
  return '<div class="set-row" data-i="' + i + '" data-id="' + pn + '"'
    + (STARRED.has(rec.id) ? ' data-starred' : '') + '>'
    /* THE STAR IS THE FIRST GRID COLUMN. .set-row has been
       `grid-template-columns:auto 1fr` since the row was designed. */
    + '<button class="set-ctl set-star" type="button" aria-pressed="'
    + (STARRED.has(rec.id) ? 'true' : 'false') + '" data-star="' + pn + '"'
    + ' aria-label="Star this patent as the one closest to your idea">'
    + '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.11 6.47L12 17.33l-5.81 3.05'
    + ' 1.11-6.47-4.7-4.58 6.5-.95z"/></svg></button>'
    + '<div class="drill-row">'
    /* THE ROW'S OWN NAME, because the one it composed from its children was
       "Score0.6620Live2020" — every span concatenated with no separators, and
       nothing at all where the title is a bar. aria-label wins over the
       contents, so the visible layout is free to stay a grid of fragments
       while the name stays a sentence. */
    + '<button class="drill-toggle" type="button" data-pn="' + pn + '"'
    + ' aria-label="' + esc(rowName(rec, i)) + '"'
    + ' aria-current="false">'

    /* ── band 1 · what this document IS ── */
    + '<span class="drill-head">'
    + '<span class="drill-no fig fig-s">'
    + (rec.number != null ? esc(rec.number) : bar('w-sm', 'micro')) + '</span>'
    + '<span class="drill-title">'
    + (real
      ? '<span class="drill-name t-title-s">' + esc(rec.skim) + '</span>'
      : '<span class="sk sk-h-body w-full" style="margin-bottom:6px"></span>'
        + '<span class="sk sk-h-body" style="width:74%"></span>')
    + '</span>'
    /* THE RANK IS THE POSITION IN THE ORDER THE FOUNDER IS LOOKING AT, which
       is true under relevance, newest and oldest alike — it is not a claim
       about relevance, and it does not become one when the sort changes. */
    + '<span class="drill-rank fig fig-s">#' + (i + 1) + '</span>'
    /* THE LABEL GOES WITH THE VALUE. Printing one without the other was a real
       defect against real data: every corpus record has `score: null`, so every
       row printed the word SCORE over an empty space. The whole block is
       omitted rather than barred, because a bar would claim the engine produced
       a score and we declined to print it. It did not produce one. */
    + (rec.score == null ? '' :
       '<span class="drill-score" title="How close the engine put this to what you described">'
       + '<span class="t-micro drill-score-k">Score</span>'
       + '<span class="fig fig-s">' + rec.score.toFixed(4) + '</span>'
       + '</span>')
    + '</span>'

    /* ── band 2 · who and when · a 2x2 grid ── */
    + '<span class="drill-meta">'
    + cell('who', inventorHTML(rec.inventors))
    + cell('firm', rec.holder != null
        /* THE FULL NAME IS ON THE ELEMENT even though the row shows one line of
           it. `title` is not the accessible name — rowName already carries the
           holder in full — it is for the pointer user who can see the name is
           cut and wants the rest without opening the record. */
        ? '<span title="' + esc(rec.holder) + '">' + esc(rec.holder) + '</span>'
        : bar('w-md', 'micro'))
    + cell('when', rec.published != null
        ? 'Pub. <span class="fig fig-s">' + esc(rec.published) + '</span>'
        : (rec.year != null
            ? 'Pub. <span class="fig fig-s">' + rec.year + '</span>'
            : bar('w-sm', 'micro')))
    + cell('what', (rec.status ? statusHTML(rec.status) : '')
        + (rec.where != null ? '<span class="dm-where">' + esc(rec.where) + '</span>' : '')
        + (rec.ipcMain != null
            ? '<span class="fig fig-s">' + esc(rec.ipcMain) + '</span>' : ''))
    + '</span>'

    /* ── band 3 · what it claims · CLAMPED TO THREE LINES ──────────────────
       THE CLAMP IS THE ROW'S AND NOT THE ENGINE'S. Corpus abstracts run a
       median of 831 characters, which is about nine lines in this column — at
       twenty rows that is a column nobody scrolls to the bottom of. Three lines
       is what reaches past the boilerplate preamble most patent abstracts open
       with and into the clause that separates this one from the next.

       IT IS A BAR WHEN NULL, not an omission, because an abstract we hold and
       decline to print is exactly what a bar means. A patent with no abstract
       at all is one row in this corpus and renders nothing. */
    + (rec.abstract != null
        ? '<span class="drill-abs">' + esc(rec.abstract) + '</span>'
        : '<span class="drill-abs drill-abs-sk">'
          + bar('w-full') + bar('w-full') + bar('w-md') + '</span>')
    + '</button>'
    + thumbsHTML(rec, i)
    + '</div></div>';
}

/* ── the row's drawings ────────────────────────────────────────────────────
   TWELVE AT MOST, FOUR TO NINE VISIBLE, AND IT SCROLLS. Measured at every
   1px of window from 1080 to 1920 — 841 widths, against a row carrying the
   full twelve plus a +N tile, which is the case that has to scroll: 4 whole
   tiles at 1080, 6 at 1440, 9 at the top of the range.

   A SINGLE NUMBER WAS WRONG HERE AND IS WORTH NOT PUTTING BACK. It read
   "about five", which is true at 1200 and nowhere else.

   AND SO WAS THE INVARIANT THAT REPLACED IT. It read "always exactly one cut
   at the trailing edge", which is the affordance doing its job — and it is
   false at about one width in eleven. The tile pitch is 78px (72 + --s-6), so
   whenever the strip's own width lands near a multiple of it the tiles sit
   flush and NOTHING IS CUT. Measured: 79 of 841 widths, 9.4%, in FIVE bands —
   window 1111-1126, 1288-1303, 1465-1480, 1643-1657 and 1820-1835, which is
   ~16px of window and ~6.6px of strip each, at strip widths of 388, 466, 544,
   622 and 700.

   AND IT DEGRADES RATHER THAN SWITCHING OFF, which is the part a band count
   hides. The cut tile's visible width is continuous: at 9.4% of widths it is
   zero, and at 19.6% it is 8px or less of a 72px tile. A 3px sliver is not
   a smaller affordance than a 40px one, it is the same absence with a
   rounding error in front of it. The honest figure for "no usable signal" is
   about one width in five, not one in eleven.

   WHAT THAT COSTS IS THE WHOLE AFFORDANCE. The strip still holds twelve
   drawings and a +N tile, still scrolls, and says so with nothing — there is
   no bar on macOS at rest, and a flush edge reads as the end of the set.

   IT IS LEFT AS A MEASURED GAP RATHER THAN PATCHED, because the honest fix
   reopens a rule: a fade has to appear only when there is somewhere to scroll,
   which means `animation-timeline: scroll()` and a fourth keyframe, and §6
   sets a high bar for one. That is a decision, not an oversight, and this note
   is here so the next reader inherits the measurement instead of the claim.

   IT WAS A FIXED FOUR-UP GRID, and four was the column's number rather than
   the patent's. That derivation is dead twice over: the strip scrolls, and the
   column it measured does not exist at the width it measured. Below 1080 the
   columns STACK (21-surface.css), so at the old 1024px floor the list is full
   width, not the ~374px the argument assumed. 374 is real, but it is the
   STRIP at 1080 rather than the column at 1024.

   A strip that wraps makes row height depend on the data, which is the one
   thing a scan target cannot have.

   SO THE STRIP SCROLLS INSTEAD OF WRAPPING. Row height stays fixed whatever
   the patent carries, and the cap stops being about width. It is about the DOM
   now: a patent in this corpus can carry 347 drawings and a page is twenty
   rows, so uncapped is ~7000 <img> on one screen. Twelve is the record's own
   CAP, so the row and the record agree about how many drawings is enough to
   judge by.

   THE LAST TILE CARRIES WHAT THE CAP HID. `figs` is the patent's real total and
   `thumbs.length` is what the strip holds; the remainder is printed rather than
   dropped, because a strip that silently stops at twelve tells a founder this
   patent has twelve drawings. It is a button to the record, which is where the
   rest of them are.

   `figs == null` PRINTS NO TILE. That is the withheld case, and `+0` or `+null`
   would both be claims we cannot support.

   THE SAME TWO ABSENCES AS THE RECORD. `[]` renders nothing at all, because a
   patent with no drawings should not leave a gap where the strip would go;
   `src === null` renders the frame, exactly as a withheld holder renders a bar.
   ports.mjs carries the contract.

   ONE TAB STOP PER ROW, NOT TWELVE. Twenty rows times twelve drawings is 240
   tab stops between the top of the list and the bottom, which would make the
   keyboard path through the results unusable to reach a control that is not a
   drawing. The strip is a toolbar with a roving tabindex: Tab enters it once,
   arrows move inside it. */
function thumbsHTML(rec, i) {
  const all = Array.isArray(rec.thumbs) ? rec.thumbs : [];
  const t = all.slice(0, THUMBS);
  if (!t.length) return '';
  /* THE COUNT IS THE ENGINE'S OR THERE IS NO TILE. `thumbs.length` is what we
     were SENT; `figs` is what the patent HAS. Subtracting the first from
     itself would print `+0` on a patent with 347 drawings — a count of our own
     cap, stated as a fact about the document.

     AND A NEGATIVE DRAWS NOTHING. `figs < thumbs.length` is two ports
     disagreeing, and `+-3` is a worse answer than no tile. */
  const more = rec.figs == null ? 0 : rec.figs - t.length;
  const name = rec.skim != null ? rec.skim : 'Patent ' + (i + 1);
  return '<div class="set-thumbs" role="group" aria-label="'
    + esc('Drawings of ' + name) + '">'
    + t.map((f, k) => {
        /* THE JOIN IS THE PUBLISHED FIGURE NUMBER, NEVER THE INDEX. ports.mjs
           is explicit that `thumbs` and the record's `figures` are two
           renditions the engine chooses independently — nothing says thumbs[3]
           is figures[3], and a renumbered figure is a different document. `n`
           is the only value that means the same thing on both sides. */
        const n = (f && f.n != null) ? f.n : k + 1;
        const shown = Boolean(f && f.src != null);
        return '<button class="set-thumb" type="button" data-fig-n="' + n + '"'
          + ' tabindex="' + (k === 0 ? '0' : '-1') + '"'
          + (shown ? '' : ' aria-disabled="true"')
          + ' aria-label="Figure ' + n
          + (shown ? ', open the record at this drawing' : ', not shown') + '">'
          + (shown
            ? '<img class="set-thumb-img" src="' + esc(f.src) + '" alt=""'
              + ' loading="lazy" decoding="async">'
            : '<span class="set-thumb-sk sk" aria-hidden="true"></span>')
          + '</button>';
      }).join('')
    + (more > 0
      ? '<button class="set-thumb set-thumb-more" type="button" tabindex="-1"'
        + ' aria-label="' + more + ' more drawings, open the record">'
        + '<span class="fig fig-s" aria-hidden="true">+' + more + '</span>'
        + '<span class="t-micro" aria-hidden="true">more</span></button>'
      : '')
    + '</div>';
}

/* `append` IS PAGING, and it is the whole difference between Show more and
   every other request on this surface.

   The port returns the CUMULATIVE page — twenty rows, then forty, then sixty —
   so re-rendering all of them was correct data and wrong behaviour: twenty rows
   the founder was reading were destroyed and rebuilt to add twenty below them.
   Focus inside the list went to <body>, the scroll position was whatever the
   new height made it, and anything mid-hover lost its state.

   So paging renders only the tail and leaves what is above it alone. `landIn`
   with a null body is doing the half of its job that still applies: clear
   `is-wait`/`is-fail` and the inline min-height, touch no content. */
function render(data, append) {
  const list = $('#setList');
  if (!list) return;
  MATCHED = data.matched;
  data.patents.forEach(r => ROW_BY_ID.set(r.id, r));
  if (append) {
    const have = list.querySelectorAll('.set-row').length;
    landIn(list, null);
    /* the offset keeps data-i and the "Patent N" fallback name global rather
       than per page — a second page starting over at 1 would name two rows
       the same thing to a screen reader. */
    const fresh = data.patents.slice(have)
      .map((rec, k) => rowHTML(rec, have + k)).join('');
    if (fresh) list.insertAdjacentHTML('beforeend', fresh);
  } else {
    landIn(list, data.patents.map(rowHTML).join(''));
  }
  list.setAttribute('aria-busy', 'false');

  const n = $('#setMoreN');
  const left = Math.max(0, data.matched - data.patents.length);
  if (n) n.textContent = String(left);
  const more = $('#setMoreWrap');
  if (more) more.hidden = left === 0;

  const title = $('#setTitle');
  /* `matched` and `patents.length` differ by what was binned, and printing the
     wrong one beneath the standing chip is a recorded regression.

     ONE TEMPLATED STRING PER PLURAL FORM, not a sentence assembled around two
     numbers. Word order moves between languages and "1 patents matched" is
     what fragment concatenation ships. It is also shorter now, because the
     old form wrapped to three lines in this column. */
  if (title) {
    const m = data.matched, n = data.patents.length;
    title.textContent = m === 1
      ? '1 patent matched'
      : (m === n ? `${m} patents matched` : `${m} patents matched · ${n} shown`);
  }
}

/* `into` NAMES WHERE THE WAIT IS SHOWN, and there are only two answers.

   A request that REPLACES the list waits in the list: the rows are about to
   stop being true, so they go and the region says it is working. A request
   that EXTENDS it waits in the button that asked — the twenty rows on screen
   are still true and blanking them to fetch twenty more tells the founder
   their list broke.

   This is the same rule the search button already follows, and the CSS for it
   was written for #setMore before anything set the attribute: 05-wait-fail.css
   styles `#setMore[data-waiting]` by name, strips the button's ground and
   hides its label and chevron together. It has been unreachable since. */
async function request(port, arg, sayWhat, into) {
  const list = $('#setList');
  if (!list) return;
  const btn = into && $(into);
  /* btnWait returns false when the button is already waiting, which is the
     re-press guard: two presses of Show more is one intention. */
  if (btn && !btnWait(btn)) return null;
  const token = bump('list');
  list.setAttribute('aria-busy', 'true');
  if (!btn) waitOn(list, 320);
  const [res] = await Promise.all([ENGINE[port](arg), pause(FLOOR)]);
  if (btn) btnRest(btn);
  /* THE THIRD LINE PEOPLE FORGET. A response that arrives after the founder
     has already asked for something else must not paint — two requests in
     flight is the ordinary case, not the exceptional one. */
  if (stale('list', token)) return;
  if (res.ok) { render(res.data, Boolean(btn)); return res.data; }
  /* A PAGE THAT DID NOT LOAD DOES NOT REPLACE THE PAGE THAT DID. The failure
     for an extending request is announced and offered in the foot; writing the
     fail block into #setList would throw away the rows that are still good to
     report that the next twenty are not. */
  if (btn) {
    say('list', sayWhat);
    list.setAttribute('aria-busy', 'false');
    return null;
  }
  failWith(list, sayWhat, res.retryable
    ? () => request(port, arg, sayWhat) : null);
  say('list', sayWhat);
  return null;
}

/* ── the two bar menus ────────────────────────────────────────────────────
   NOT THE MASTHEAD'S menu() HELPER, and the difference is the mechanism rather
   than a preference. That one toggles [hidden]; .lm-menu animates opacity and
   transform under .lm.is-open, so hiding it outright would skip the transition
   the stylesheet already specifies.

   Escape closes the most recent, through the same stack — which is what makes
   a second overlay safe. An outside click closes too, and the trigger toggles.
   FOCUS MOVES INTO THE MENU on open, because a menu a keyboard cannot reach is
   a menu that is not there. */
function lmMenu(wrapId, btnId, panelId) {
  const wrap = $('#' + wrapId), btn = $('#' + btnId), panel = $('#' + panelId);
  if (!wrap || !btn || !panel) return;

  const close = () => {
    if (!wrap.classList.contains('is-open')) return;
    wrap.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    drop(panelId);
  };
  const open = () => {
    wrap.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    push(panelId, close);
    const first = panel.querySelector('[role="menuitemradio"]');
    if (first) focusQuietly(first);
  };

  btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    wrap.classList.contains('is-open') ? close() : open();
  });
  document.addEventListener('click', e => {
    if (!wrap.classList.contains('is-open')) return;
    if (!panel.contains(e.target) && !btn.contains(e.target)) close();
  });
  /* a chosen option closes the menu it was chosen from */
  panel.addEventListener('click', () => close());
  return close;
}

/* one checked item per group, and the tick is the only thing that moves */
function check(panel, el) {
  panel.querySelectorAll('[role="menuitemradio"]').forEach(b =>
    b.setAttribute('aria-checked', String(b === el)));
}

/* ── find similar ─────────────────────────────────────────────────────────
   IT RETURNS AN ORDER, NOT A SET, so this cannot go through render(): that
   reads data.patents and this call has none. The rows on screen are the rows
   that stay — the contract's whole claim about this call is that no patent
   enters or leaves — so the DOM nodes are MOVED rather than rebuilt.

   Moving them rather than re-rendering also keeps the star states, the open
   row and any focus inside the list intact, which a rebuild would drop.

   ═══ THE SETTLED STATE IS DECLARED HERE, NOT BY THE PRESS ══════════════════
   The chip, the band class and the Restore button used to be set by the click
   handler BEFORE this call answered, and the failure branch rolled back only
   the class. So a refused request left a chip reading "Nearest to 2 starred
   patents" and a Restore button offering to undo an order that never changed —
   the interface asserting an outcome the engine had just declined. Everything
   that says "this happened" now happens where it is known to have happened. */
function settled(on, n) {
  const wrap = $('#setWrap');
  if (wrap) wrap.classList.toggle('is-ranked', on);
  const chip = $('#setRankChip');
  if (chip) {
    chip.hidden = !on;
    chip.textContent = on
      ? 'Nearest to ' + n + (n === 1 ? ' starred patent' : ' starred patents')
      : '';
  }
  const restore = $('#setRestore');
  if (restore) restore.hidden = !on;
}

async function reorderTo(anchors) {
  const list = $('#setList');
  if (!list) return;
  const btn = $('#setRebase');
  /* RESERVED, because Restore sits beside it in the bar: without the reserve
     the fill coming off (05-wait-fail.css) shrinks Find similar to 48px and
     slides the control next to it while the founder is looking at it.
     #setMore, three functions down, is the opposite case and stays bare. */
  if (btn && !btnWait(btn, true)) return;
  const token = bump('list');
  list.setAttribute('aria-busy', 'true');

  const res = await ENGINE.rerank({ anchors });
  if (btn) btnRest(btn);
  if (stale('list', token)) return;
  list.setAttribute('aria-busy', 'false');

  if (!res.ok) {
    say('list', 'Similar patents could not be found. The order is unchanged.');
    return;
  }

  const rows = new Map([...list.querySelectorAll('.set-row')]
    .map(el => [el.getAttribute('data-id'), el]));
  /* only the ids we actually hold: the engine orders the whole set and the
     client is holding one page of it. */
  (res.data.order || []).forEach(id => {
    const el = rows.get(id);
    if (el) list.append(el);
  });
  settled(true, anchors.length);
  say('list', 'Ordered by nearness to ' + anchors.length
    + (anchors.length === 1 ? ' starred patent.' : ' starred patents.'));
}

export function init(ctx) {
  ENGINE = ctx.engine;

  /* ── the drawings are ONE tab stop per row ──────────────────────────────
     Twenty rows times twelve drawings is 240 tab stops between the top of the
     list and the bottom, which is not navigation, it is an obstacle — the
     argument roving.mjs opens with, for a group a third the size. rovingIn
     rather than roving because the list rebuilds all twenty strips on every
     sort, filter, re-rank and page, and an instance per row is twenty
     teardowns a render with nothing watching that they happen.

     BOUND ONCE, AT init, AND NEVER TORN DOWN. It is delegated at the document,
     so it survives every re-render without knowing one happened, and the
     initial tab stop is written by the renderer — tabindex="0" on the first
     tile, -1 on the rest — so a fresh render resets the stop to the head of
     the strip, which is the correct fresh state. */
  rovingIn(document, '.set-thumbs', '.set-thumb');

  ctx.onRoute(view => {
    if (view !== 'work' || loaded) return;
    loaded = true;
    request('patents', undefined, 'The list did not load.');
  });

  onActivate(document, '#setMore', () =>
    request('patentsPage', undefined,
      'The next page did not load. The patents already shown are unchanged.',
      '#setMore'));

  /* THE STARRED SET SURVIVES A NEW SEARCH, and this used to clear it.
     platform.md §7.1: the set is the founder's own shortlist and the thing
     they take out of Terrain, so emptying it because they ran another query
     deletes their work to save them a click. What DOES go is the ordering —
     `Find similar` ordered the previous result set and this is a different
     one — so the settled state is stood down and the list reloads. */
  window.addEventListener('terrain:searched', () => {
    settled(false, 0);
    syncStarUI();
    request('patents', undefined, 'The list did not load.');
  });

  /* THE GROUPING HANDS BACK A SET, NOT A DOM INSTRUCTION. fishbone.mjs asked
     `facets` for the branches the founder picked and this is the answer; the
     list renders it exactly as it renders a sort or a status facet, because it
     IS one. The panel never touches these rows.

     The ordering stands down for the same reason a new search stands it down:
     `Find similar` ordered a set this is no longer. */
  window.addEventListener('terrain:refiltered', e => {
    settled(false, 0);
    render(e.detail);
  });

  onActivate(document, '.set-star', el =>
    toggleStar(el.getAttribute('data-star'), el));

  /* FIND SIMILAR IS THE ONLY FILLED CONTROL ON THIS SURFACE and it sends the
     anchors the founder chose. The response is an ORDER over the same set. */
  onActivate(document, '#setRebase', () => {
    if (!STARRED.size()) return;
    reorderTo(STARRED.ids());
  });

  onActivate(document, '#setRestore', () => {
    settled(false, 0);
    request('sort', { sort: 'relevance' },
      'The original order could not be restored.');
  });

  lmMenu('sortWrap', 'sortBtn', 'sortMenu');
  lmMenu('filtWrap', 'filtBtn', 'filtMenu');

  /* THE TRIGGER CARRIES THE CURRENT SORT, so the bar states the order without
     the menu being open. A control that says only "Sort" makes the founder
     open it to find out what they are looking at. */
  onActivate(document, '#sortMenu [data-sort]', el => {
    const val = el.getAttribute('data-sort');
    check($('#sortMenu'), el);
    const label = $('#sortLabel');
    if (label) label.textContent = el.querySelector('span:last-child').textContent;
    request('sort', { sort: val }, 'The list could not be re-sorted. It is unchanged.');
  });

  /* `all` CLEARS THE FACET rather than sending one. A filter whose only way off
     is reloading the page is a trap, and the count badge is what says one is on
     — hidden at zero, because a badge reading 0 is a filter that looks applied. */
  onActivate(document, '#filtMenu [data-facet]', el => {
    const val = el.getAttribute('data-facet');
    check($('#filtMenu'), el);
    const count = $('#filtCount');
    if (count) { count.hidden = val === 'all'; count.textContent = '1'; }
    request('facets', { facets: val === 'all' ? {} : { status: val } },
      'The list could not be filtered. It is unchanged.');
  });
}

