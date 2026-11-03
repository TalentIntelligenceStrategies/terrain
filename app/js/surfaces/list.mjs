/* surfaces/list — the patent list. platform.md §4.3.
 *
 * ═══ THE ROW ANSWERS THE GLANCE ═════════════════════════════════════════════
 * Three bands — identity, party and date, what it claims — and the drawings,
 * which are not a band: a field is a value read off the patent, and a drawing
 * is the patent. platform.md §4.3 carries why the row holds what it holds.
 * The score sits WITH THE NUMBER rather than in the field rows, and that is
 * not a loophole: it says nothing about the patent, only about where the
 * engine put it. The left column is the glancing surface; the record beside
 * it is the reading one.
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
import { enter, flip } from '../core/motion.mjs';
import { say } from '../core/live-region.mjs';
import { onActivate } from '../core/delegate.mjs';
import { wait as pause } from '../core/timers.mjs';
import { bar, langAttr } from '../core/primitives.mjs';
import { where, holderText, noAssignee } from '../core/format.mjs';
import { read as readSettings } from './settings.mjs';
import { bump, stale } from '../core/generation.mjs';
import { push, drop } from '../core/esc-stack.mjs';
import { clampIntoView } from '../core/popover.mjs';
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
   platform.md §5.1. A star COLLECTS: it adds the patent to the founder's
   starred set, which is theirs, has a surface of its own, and is what leaves
   the product. It does not re-order anything. Find similar is the open
   record's, and it takes that one patent as its anchor.

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
}

/* EVERY CONTROL THAT CARRIES THIS ID, NOT THE ONE THAT WAS PRESSED. The star
   has three hosts now — the row, the record's closing block and the starred
   view — and painting only the presser left the other two asserting the
   opposite of what the set holds. The row's own [data-starred] rail still
   goes on the closest .set-row, because the record has no rail. */
function paintStars(id, on) {
  document.querySelectorAll('[data-star="' + id + '"]').forEach(b => {
    b.setAttribute('aria-pressed', String(on));
    const el = b.closest('.set-row');
    if (el) on ? el.setAttribute('data-starred', '') : el.removeAttribute('data-starred');
  });
}

function toggleStar(id, btn) {
  const row = ROW_BY_ID.get(id) || { id };
  const on = STARRED.toggle(id, row);
  paintStars(id, on);
  syncStarUI();
  /* THE CONFIRMATION NAMES THE SET, not just the act. "Starred." says a
     button was pressed; the founder needs to know a collection exists, how big
     it is, and that it is the thing they can take out. */
  say('list', on
    ? 'Starred. ' + STARRED.size() + (STARRED.size() === 1 ? ' patent' : ' patents')
      + ' in your starred set.'
    : 'Unstarred. ' + (STARRED.size()
        ? STARRED.size() + (STARRED.size() === 1 ? ' patent' : ' patents') + ' left.'
        : 'Nothing starred.'));
}

/* the sentence a screen reader reads for one row.

   THE NAME DOES NOT GROW WITH THE ROW. The row draws eight more fields than it
   did, and putting all of them here would make a screen reader read a
   paragraph per result before reaching the next one. What a name has to carry
   is what tells this row from the one under it — the title, who holds it and
   when. The rest is in the record, one press away, which is the same
   place a sighted founder goes for it. */
function rowName(rec, i) {
  const bits = [rec.skim != null ? rec.skim : 'Patent ' + (i + 1)];
  if (rec.holder != null) bits.push(holderText(rec.holder));
  if (rec.year != null) bits.push(String(rec.year));
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
  firm: '<path d="M10 12h4"/>'
      + '<path d="M10 8h4"/>'
      + '<path d="M14 21v-3a2 2 0 0 0-4 0v3"/>'
      + '<path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/>'
      + '<path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
  when: '<path d="M8 2v3"/>'
      + '<path d="M16 2v3"/>'
      + '<rect x="3" y="3" width="18" height="18" rx="2"/>'
      + '<path d="M3 9h18"/>',
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
  /* NO ROLE CLASS ON THE VALUE: it is a meta line, 13/400, and 34-list.css
     spells that size the way §4 says a meta line does. The cell names its
     kind so the holder can lead its three neighbours by colour alone. */
  return '<span class="dm dm-' + k + '">' + glyph(k)
    + '<span class="dm-v">' + inner + '</span></span>';
}

/* THE INVENTOR LINE PRINTS ONE NAME AND COUNTS THE REST. A patent with six
   inventors is the ordinary case in this corpus, not the exception, and six
   names is wider than the column and longer than the title. The record prints
   the set; the row prints who to think of it as. */
function inventorHTML(list) {
  if (!Array.isArray(list) || !list.length) return bar('w-md', 'micro');
  const rest = list.length - 1;
  /* fig-s, AND 34-list.css HAS CLAIMED THIS WAS A FIGURE ALL ALONG: "It is a
     count, so it is a figure." The markup carried no figure role at all, so
     every "+5" on the surface rendered in Urbanist without tabular-nums —
     the exact split-role failure 02-type.css's header was written to close.
     THE LITERAL LEADING SPACE WENT TOO: .dm-v is a flex row with gap --s-6,
     so the space and the gap were a double gap you could see. */
  return '<span class="dm-t">' + esc(list[0]) + '</span>' + (rest > 0
    ? '<span class="dm-more fig fig-s">+' + rest + '</span>' : '');
}

/* ── one row ──────────────────────────────────────────────────────────────
   EVERY null IS A BAR AND NO BRANCH HERE ASKS WHETHER THE DATA IS REAL. A real
   engine returning real names changes nothing but the presence of a value.

   THE ROW IS THREE BANDS NOW — head, meta, abstract — and it was two. What
   drove it is that four fields could not answer the glance: a founder could not
   tell a foundry's filing from a university's, or a printing patent from a
   motor-control one, without opening the record, so the record was opened on
   every row. The bands are ordered by what settles the question soonest:
   identity, then party and date, then what it actually claims.

   THE STRIP IS NO LONGER INSIDE THE BUTTON, and that is a correctness fix
   rather than a layout one. It scrolls horizontally now, and a drag inside a
   <button> ends in a click — so scrolling the drawings opened a record every
   time. It is a sibling under .drill-row, and each drawing is its own button. */
/* ── the versions of one patent · platform.md §4.3 ───────────────────────
   A PATENT IS OFTEN TWO DOCUMENTS, the application as published and the
   grant, and they carry different numbers and dates. `versions` lists them;
   the row shows one at a time and the founder chooses which. The choice is
   client state, per row, and it is written on the row as data-ver so the
   record opens the same version without reaching into this module.

   TWO VERSIONS ARE A SWITCH; ONE IS A WORD. A single filled segment reads as
   the pressed half of a switch whose other half is missing, so a patent with
   one version says which it is in plain text, inside the eyebrow. */
const VER = new Map();
const VER_WORD = { grant: 'Grant', application: 'Application' };
function versionOf(rec) {
  const vs = Array.isArray(rec.versions) ? rec.versions : [];
  const want = VER.get(rec.id);
  return vs.find(v => v.kind === want) || vs[0] || null;
}

/* THE STARRED PAGE DRAWS THIS SAME ROW (platform.md §5.2), from the stored
   copy, with `{ starred: true }`. Three things on it belong to the SEARCH and
   leave there: the rank, which is a position in a result order the starred
   set does not have; the version switch, whose state lives in VER and whose
   repaint finds its row in #setList; and the star's label, which asks a
   question the founder has already answered. The first version shows as the
   word, as a one-version patent's does. */
export function rowHTML(rec, i, opts = {}) {
  const real = rec.skim != null;
  const pn = esc(rec.id);
  const vsAll = Array.isArray(rec.versions) ? rec.versions : [];
  const vs = opts.starred ? vsAll.slice(0, 1) : vsAll;
  const v = opts.starred ? (vs[0] || null) : versionOf(rec);
  /* the version shown supplies the number and the date; without versions the
     row's own fields stand */
  const number = v ? v.number : rec.number;
  const published = v ? v.published : rec.published;
  return '<div class="set-row" data-i="' + i + '" data-id="' + pn + '"'
    + (v ? ' data-ver="' + esc(v.kind) + '"' : '')
    + (vs.length > 1 ? ' data-vers' : '')
    + (STARRED.has(rec.id) ? ' data-starred' : '') + '>'
    /* THE STAR IS THE FIRST GRID COLUMN. .set-row has been
       `grid-template-columns:auto 1fr` since the row was designed. */
    + '<button class="set-ctl set-star" type="button" aria-pressed="'
    + (STARRED.has(rec.id) ? 'true' : 'false') + '" data-star="' + pn + '"'
    + ' aria-label="' + (opts.starred ? 'Remove this patent from your starred set'
        : 'Star this patent as the one closest to your idea') + '">'
    + '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg></button>'
    + '<div class="drill-row">'
    /* THE ROW'S OWN NAME, because the one it composed from its children was
       "Score0.6620Live2020" — every span concatenated with no separators, and
       nothing at all where the title is a bar. aria-label wins over the
       contents, so the visible layout is free to stay a grid of fragments
       while the name stays a sentence. */
    + '<button class="drill-toggle" type="button" data-pn="' + pn + '"'
    + ' aria-label="' + esc(rowName(rec, i)) + '"'
    + ' aria-current="false">'

    /* ── band 1 · an eyebrow, then the title on its own full-width line ────
       THE NUMBER WAS A FLEX SIBLING OF THE TITLE, so a title that ran to two
       lines began its second line at the TITLE's leading edge — indented past
       the number by the number's own width plus a gap. Nothing declared that
       indent and nothing could remove it while the two shared a line.

       THE EYEBROW ALSO PAID FOR THE TITLE'S SIZE STEP. Sharing line one with
       the number and the rank left the title ~381px of a ~518px column at
       1440 — about 53 characters, against a corpus whose median title is 66.
       Given the full width, the title wraps less at its own size than it did
       sharing a line at a smaller one.

       THE RANK AND THE SCORE TRAIL TOGETHER, and the eyebrow reads as two
       clusters rather than three positions. What the patent IS leads — its
       number, true of the document wherever it was found. What the SEARCH made of it trails — the position
       and the engine's figure, the two facts that exist only because this
       query ran and that change when the sort does.

       SPLITTING THEM PUT AN ORDINAL BESIDE THE IDENTIFIER, which reads as a
       second fact about the patent. It is not one. Grouped at the
       trailing edge the pair is legible as the search's own margin note, and
       the number regains the leading position it is scanned from. */
    + '<span class="drill-head">'
    + '<span class="drill-eyebrow">'
    /* w-md AND NOT w-sm/micro. The longest number in this corpus is 15
       characters — US20130146987A1, about 112px at fig-s — and a 52x9 bar is
       a skeleton the wrong size for the thing it withholds. */
    + '<span class="drill-no fig fig-s">'
    + (number != null ? esc(number) : bar('w-md')) + '</span>'
    + (vs.length === 1 && VER_WORD[v.kind]
        ? '<span class="drill-ver t-micro">' + VER_WORD[v.kind] + '</span>' : '')
    /* THE SEARCH'S OWN CLUSTER. It is one element so that the pair travels
       together when the eyebrow wraps: a rank at the end of one line and a
       score at the start of the next is the split this grouping undoes. */
    + '<span class="drill-sr">'
    /* THE RANK IS THE POSITION IN THE ORDER THE FOUNDER IS LOOKING AT, which
       is true under relevance, newest and oldest alike — it is not a claim
       about relevance, and it does not become one when the sort changes. It
       always renders: unlike the score, there is no engine to withhold it. */
    + (opts.starred ? '' : '<span class="drill-rank fig fig-s">#' + (i + 1) + '</span>')
    /* THE LABEL GOES WITH THE VALUE. Printing one without the other was a real
       defect against real data: every corpus record has `score: null`, so every
       row printed the word SCORE over an empty space. The whole block is
       omitted rather than barred, because a bar would claim the engine produced
       a score and we declined to print it. It did not produce one.

       THE title= WENT WITH THE MOVE. It was a tooltip nobody opens, and the
       results heading's info popover already carries that sentence verbatim. */
    + (rec.score == null ? '' :
       '<span class="drill-score">'
       + '<span class="t-micro drill-score-k">Score</span>'
       + '<span class="fig fig-s">' + rec.score.toFixed(4) + '</span>'
       + '</span>')
    + '</span>'
    + '</span>'
    + '<span class="drill-title">'
    + (real
      ? '<span class="drill-name t-title-s">' + esc(rec.skim) + '</span>'
      /* sk-h-title IS 16px, THE CARD TITLE'S SIZE, so two bars stand in for
         two lines of real title at the height they take.
         The two inline style= attributes went with them — they were the only
         ones on the row, and .drill-title-sk carries the gap and the second
         bar's width instead. */
      : '<span class="drill-title-sk">'
        + bar('w-full', 'title') + bar('w-full', 'title') + '</span>')
    + '</span>'
    + '</span>'

    /* ── band 2 · who and when · a 2x2 grid ── */
    + '<span class="drill-meta">'
    /* THE HOLDER LEADS (platform.md §13.4, R1-36): the title, the holder and
       one date carry the card, so the holder takes the first cell in the
       text colour and the inventors follow it, muted. */
    + cell('firm', rec.holder != null
        /* THE FULL NAME IS ON THE ELEMENT even though the row shows one line of
           it. `title` is not the accessible name — rowName already carries the
           holder in full — it is for the pointer user who can see the name is
           cut and wants the rest without opening the record. */
        ? (noAssignee(rec.holder)
            ? '<span class="dm-t dm-none">' + esc(holderText(rec.holder)) + '</span>'
            : '<span class="dm-t" title="' + esc(rec.holder) + '">' + esc(rec.holder) + '</span>')
        : bar('w-md', 'micro'))
    + cell('who', inventorHTML(rec.inventors))
    /* "Published" AND NOT "Pub.". The record's own field list has said
       Published since it was written (record.mjs FIELDS), so the row was the
       only surface abbreviating it — and `Pub. {date}` is, character for
       character, PI-VuePat's own pubDateLabel. The column is 2x1fr and the
       word fits. */
    + cell('when', published != null
        ? '<span class="dm-t">Published</span><span class="fig fig-s">' + esc(published) + '</span>'
        : (rec.year != null
            ? '<span class="dm-t">Published</span><span class="fig fig-s">' + rec.year + '</span>'
            : bar('w-sm', 'micro')))
    /* THE STATUS CHIP LEFT THIS CELL FOR THE EYEBROW. What is left is the
       jurisdiction and the main classification, which are both CODES — §4
       says Inconsolata for every code without exception, and `US` / `EP` /
       `WO` had been inheriting .dm-v and rendering in Urbanist. */
    + cell('what', (where(rec) != null
            ? '<span class="dm-where dm-t">' + esc(where(rec)) + '</span>' : '')
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
        /* META, NOT BODY. The abstract on the row is a preview: the title,
           the holder and the date carry the row (R1-36), and the record is
           where the abstract is read at body. 34-list.css spells 13/1.5. */
        ? '<span class="drill-abs"' + langAttr(rec.abstract, rec.number) + '>'
        + esc(rec.abstract) + '</span>'
        : '<span class="drill-abs drill-abs-sk">'
          + bar('w-full', 'label') + bar('w-full', 'label') + bar('w-md', 'label') + '</span>')
    + '</button>'
    /* THE SWITCH IS THE ROW'S BUTTON'S SIBLING, because a button may not hold
       a button. 34-list.css lays it over the eyebrow's trailing edge, where
       the eyebrow has reserved its width. */
    + (vs.length > 1
        ? '<div class="seg ver-switch" role="group" aria-label="Which version of this patent">'
          + vs.map(x => '<button class="seg-btn" type="button" data-ver-of="' + pn + '"'
            + ' data-ver-kind="' + esc(x.kind) + '" aria-pressed="' + String(x === v) + '">'
            + esc(VER_WORD[x.kind] || x.kind) + '</button>').join('')
          + '</div>'
        : '')
    + thumbsHTML(rec, i)
    + '</div></div>';
}

/* SWITCHING A VERSION REPAINTS ONLY WHAT IT CHANGES — the number and the date
   on this row — and tells the record, which reopens on that version if it is
   the one showing. Re-rendering the row would drop its strip's scroll and the
   focus the founder is holding on the switch. */
function setVersion(id, kind) {
  const rec = ROW_BY_ID.get(id);
  if (!rec) return;
  VER.set(id, kind);
  const v = versionOf(rec);
  const row = document.querySelector('#setList .set-row[data-id="' + CSS.escape(id) + '"]');
  if (!row || !v) return;
  row.setAttribute('data-ver', v.kind);
  const no = row.querySelector('.drill-no');
  if (no) no.innerHTML = v.number != null ? esc(v.number) : bar('w-md');
  const when = row.querySelector('.dm-when .fig');
  if (when && v.published != null) when.textContent = v.published;
  row.querySelectorAll('[data-ver-kind]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.getAttribute('data-ver-kind') === v.kind)));
  window.dispatchEvent(new CustomEvent('terrain:version', { detail: { id, kind: v.kind } }));
  say('list', 'Showing the ' + (VER_WORD[v.kind] || v.kind).toLowerCase() + '.');
}

/* ── the row's drawings ────────────────────────────────────────────────────
   TWELVE AT MOST, THREE TO SIX VISIBLE, AND IT SCROLLS. Measured at every 1px
   of window from 1080 to 1920 — 841 widths, against a row carrying the full
   twelve plus a +N tile, which is the case that has to scroll: 3 whole tiles
   at 1080, 4 at 1440, 6 at the top of the range, and 4.86 tiles of strip at
   1440 counting the cut one.

   A SINGLE NUMBER WAS WRONG HERE TWICE AND IS WORTH NOT PUTTING BACK. It read
   "about five", which was true at 1200 and nowhere else; then it read
   "four to nine visible", which was true of a 72px tile and is not of a 102px
   one. A count that depends on the window does not get a single number.

   AND SO WAS THE INVARIANT THAT REPLACED IT. It read "always exactly one cut
   at the trailing edge", which is the affordance doing its job — and it is
   false at a measurable share of widths. The tile pitch is 108px
   (102 + --s-6), so whenever the strip's own width lands near a multiple of
   it the tiles sit flush and NOTHING IS CUT. Measured against the strip's own
   width (W = 0.4403·window − 109.4, fitted on five sample points, max
   residual 0.33px): 44 of 841 widths, 5.2%.

   AND IT DEGRADES RATHER THAN SWITCHING OFF, which is the part a band count
   hides. The cut tile's visible width is continuous: at 5.2% of widths it is
   zero, and at 11.3% it is 8px or less of a 102px tile, in THREE bands —
   window 1216-1247, 1462-1493 and 1707-1738, 32px of window each. A 3px
   sliver is not a smaller affordance than a 40px one, it is the same absence
   with a rounding error in front of it. The honest figure for "no usable
   signal" is about one width in nine.

   THE BIGGER TILE HALVED THAT, WHICH IS WHY IT WAS RE-SWEPT RATHER THAN
   RESCALED. At the old 78px pitch the same sweep gives 8.8% flush and 18.9%
   at 8px or less, in FIVE bands — one width in five. A longer pitch lands the
   remainder inside a tile more often than in the 6px gap, so a change made
   for legibility improved the affordance as a side effect. It was not
   obvious in advance and it is not a reason to stop measuring.

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
   drawing. The strip is role="group" with a roving tabindex: Tab enters once,
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
/* `mode` SAYS WHAT THE REQUEST DID TO THE ROWS, and the motion follows from
   it rather than from which button was pressed — design-language.md §6
   "Lists and records":

     'arrive'  — the surface's first list. The view itself is still moving
                 in, so the rows land with it and do not stagger on top of it.
     'replace' — a new set: a search or the grouping. The region
                 emptied to a loader, and the rows arrive in a short stagger.
     'append'  — Show more. The rows above are untouched; the new tail fades
                 up under them.
     'reorder' — a sort or a restore: the same patents in another order. The
                 rows stood while the engine answered, and each moves from
                 where it was to where it is. */
/* ── when nothing came back · platform.md §7.2 ───────────────────────────
   NOT A FAILURE AND NOT DRAWN AS ONE. The engine was asked and answered: none
   of the index cleared its relevance floor for this sentence. The block says
   WHAT WAS SEARCHED — the sources, the kinds, the dates — and the way back,
   and it stops. Nothing here may say what the empty set means: no open
   ground, no whitespace, no how-close-it-came. brief.md §1 is the rule, and a
   founder who has just been told nothing matched is the reader most likely to
   read it as nobody being there.

   THE WORDS COME OFF THE SETTINGS PANEL'S OWN CONTROLS, so the sentence and the
   panel the founder would open to change it cannot disagree. */
function searchedWhat() {
  const s = readSettings();
  const names = sel => [...document.querySelectorAll('#setPop ' + sel)]
    .filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.textContent.trim());
  const join = xs => xs.length < 2 ? (xs[0] || '')
    : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
  const where = join(names('[data-src]'));
  const kinds = join(names('[data-kind]').map(k => k.toLowerCase()));
  const dates = (s.from || s.to)
    ? (s.basis === 'filed' ? 'filed ' : 'published ') + (s.from || '…') + '–' + (s.to || '…')
    : 'any date';
  return [where, kinds, dates].filter(Boolean).join(' · ');
}

function emptyHTML() {
  return '<div class="set-empty">'
    + '<p class="t-title-s set-empty-h">Nothing in the index you searched came back close to this.</p>'
    + '<p class="t-body set-empty-p">You searched ' + esc(searchedWhat()) + '. '
    + 'Change the sentence above or the search settings, then search again.</p>'
    + '<button class="btn btn-secondary" type="button" data-empty-settings>Open search settings</button>'
    + '</div>';
}

function render(data, mode = 'replace') {
  const list = $('#setList');
  if (!list) return;
  MATCHED = data.matched;
  data.patents.forEach(r => ROW_BY_ID.set(r.id, r));
  if (mode === 'append') {
    const have = list.querySelectorAll('.set-row').length;
    landIn(list, null);
    /* the offset keeps data-i and the "Patent N" fallback name global rather
       than per page — a second page starting over at 1 would name two rows
       the same thing to a screen reader. */
    const fresh = data.patents.slice(have)
      .map((rec, k) => rowHTML(rec, have + k)).join('');
    if (fresh) {
      list.insertAdjacentHTML('beforeend', fresh);
      enter([...list.querySelectorAll('.set-row')].slice(have));
    }
  } else if (mode === 'reorder') {
    flip(list, '.set-row', el => el.getAttribute('data-id'),
      () => landIn(list, data.patents.map(rowHTML).join('')),
      list.closest('.set-listcol'));
  } else {
    landIn(list, data.patents.map(rowHTML).join(''));
    if (mode === 'replace') enter(list.querySelectorAll('.set-row'));
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
     old form wrapped to three lines in this column.

     THE TWO-COUNT FORM DROPS ITS NOUN. "100 matched · 20 shown" is 70px
     narrower than the form with "patents" in it, and those 70px are what keep
     the bar to one row when the nearness chip and Restore are out — the noun
     is already the subject of every row underneath. The
     one-count forms keep it, because they have the room. */
  if (title) {
    const m = data.matched, n = data.patents.length;
    /* THE COUNTS ARE FIGURES AND THE WORDS ARE NOT. Whole-string textContent
       is what put them in Urbanist: §4 gives every count the figure face, and
       a heading that reads "100 patents matched · 20 shown" is two counts and
       three words. innerHTML rather than textContent is safe here because
       both values are numbers this module computed.

       .fig ALONE, WITHOUT A SIZE ROLE. fig-s is 13px and this heading is 20,
       so the pair would render the numbers visibly smaller than the words around
       them — a size role inside a line that already has one. .fig carries the
       family, tabular-nums and the figure weight and inherits the size, which
       is what an inline numeral in running text wants. */
    const fig = v => '<span class="fig">' + v + '</span>';
    title.innerHTML = m === 0 ? 'No patents matched'
      : m === 1 ? fig(1) + ' patent matched'
      : (m === n ? fig(m) + ' patents matched'
                 : fig(m) + ' matched · ' + fig(n) + ' shown');
  }
  /* A SEARCH THAT MATCHED NOTHING, and only a search: a grouping branch is
     cut from a set that had patents, so it can never be empty this way. The
     results bar is told, because it withholds Search until something
     changes. */
  if (data.matched === 0 && mode !== 'append') {
    landIn(list, emptyHTML());
    window.dispatchEvent(new CustomEvent('terrain:empty'));
  }
  /* Show more while the set is in nearness order: the new rows take the
     same labels as the ones above them. */
  if (mode === 'append') markNearness(list);
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
async function request(port, arg, sayWhat, into, mode) {
  const list = $('#setList');
  if (!list) return;
  const btn = into && $(into);
  /* btnWait returns false when the button is already waiting, which is the
     re-press guard: two presses of Show more is one intention. A reorder
     reserves the trigger's width, because Sort sits in a row of controls and
     a trigger shrinking to its loader slides its neighbour under the pointer. */
  if (btn && !btnWait(btn, mode === 'reorder')) return null;
  const token = bump('list');
  list.setAttribute('aria-busy', 'true');
  if (!btn) waitOn(list, 320);
  const [res] = await Promise.all([ENGINE[port](arg), pause(FLOOR)]);
  if (btn) btnRest(btn);
  /* THE THIRD LINE PEOPLE FORGET. A response that arrives after the founder
     has already asked for something else must not paint — two requests in
     flight is the ordinary case, not the exceptional one. */
  if (stale('list', token)) return;
  if (res.ok) { render(res.data, mode || (btn ? 'append' : 'replace')); return res.data; }
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
export function lmMenu(wrapId, btnId, panelId) {
  const wrap = $('#' + wrapId), btn = $('#' + btnId), panel = $('#' + panelId);
  if (!wrap || !btn || !panel) return;

  const close = () => {
    if (!wrap.classList.contains('is-open')) return;
    wrap.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    panel.style.left = '';
    panel.style.right = '';
    drop(panelId);
  };
  const open = () => {
    wrap.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    push(panelId, close);
    /* a menu far enough along .set-bar ran its left:0 off the right edge at
       320. */
    clampIntoView(panel);
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

/* one checked item per group, and the tick is the only thing that moves.
   The starred page's sort menu uses both, so they are exported. */
export function check(panel, el) {
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
/* IT TAKES THE SENTENCE, NOT A COUNT. The caller knows what it anchored on —
   the open record's number — and this does not. */
function settled(on, text) {
  if (!on) NEAR = null;
  const wrap = $('#setWrap');
  if (wrap) wrap.classList.toggle('is-ranked', on);
  const chip = $('#setRankChip');
  if (chip) {
    chip.hidden = !on;
    chip.textContent = on ? text : '';
  }
  const restore = $('#setRestore');
  if (restore) restore.hidden = !on;
}

/* `label` IS WHAT THE SET IS NOW ORDERED BY, as a noun phrase: the anchor's
   patent number. Both the chip and the announcement read it, so the two
   cannot disagree about what just happened.

   THE WAIT IS ON THE BUTTON THAT WAS PRESSED, reserved so the record's head
   does not reflow while the founder is looking at it, and btnWait's refusal
   is the re-press guard. The list says it is busy and the failure is said
   from the list, which is where the change would have happened. */
async function reorderTo(anchors, label, btn) {
  const list = $('#setList');
  if (!list) return;
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
     client is holding one page of it. THE SAME NODES MOVE, so flip() plays
     each from where it stood — the founder watches the nearest patents rise
     rather than reading a list that was silently replaced. */
  flip(list, '.set-row', el => el.getAttribute('data-id'), () => {
    (res.data.order || []).forEach(id => {
      const el = rows.get(id);
      if (el) list.append(el);
    });
  }, list.closest('.set-listcol'));
  NEAR = { anchor: anchors[0], scores: res.data.nearness || null };
  markNearness(list);
  settled(true, 'Nearest to ' + label);
  say('list', 'Ordered by nearness to ' + label + '.');
}

/* ── what the score means while the set is in nearness order (R1-33) ────
   THE ROWS MOVED, SO THEIR NUMBERS AND THEIR SCORES STOPPED BEING TRUE. The
   rank is the position in the order on screen, so it is renumbered. The
   score was the search's relevance, and relevance printed down a list ordered
   by nearness reads as the reason for the order; so the row prints the
   engine's `nearness` for it, labelled *Nearness*, and prints no score when
   the engine returned none. The anchor is the open patent compared with
   itself, and it is marked *This patent* rather than given a 1.0000 that
   reads as the best match. Restore re-requests the list, which redraws every
   row with its relevance again. */
let NEAR = null;   /* { anchor, scores } while the set is in nearness order */
function markNearness(list) {
  if (!NEAR || !list) return;
  [...list.querySelectorAll('.set-row')].forEach((row, i) => {
    const id = row.getAttribute('data-id');
    const rank = row.querySelector('.drill-rank');
    if (rank) rank.textContent = '#' + (i + 1);
    const sr = row.querySelector('.drill-sr');
    if (!sr) return;
    let sc = sr.querySelector('.drill-score');
    if (!sc) { sc = document.createElement('span'); sc.className = 'drill-score'; sr.append(sc); }
    const n = NEAR.scores ? NEAR.scores[id] : null;
    if (id === NEAR.anchor) sc.innerHTML = '<span class="t-micro drill-this">This patent</span>';
    else if (n != null) sc.innerHTML = '<span class="t-micro drill-score-k">Nearness</span>'
      + '<span class="fig fig-s">' + Number(n).toFixed(4) + '</span>';
    else sc.remove();
  });
}

/* THE ROW BEHIND AN ID, for the one reader outside this file that needs it.
   components.md §1 says the row carries `number` and `where` it does not draw
   "because the starred set leaves as a seven-column file and the export reads
   the row rather than the record" — so a single record leaving has to leave
   through a row too, or one file carries different fields from the set it
   came out of. The list is what holds rows; it hands one over rather than
   letting the export reach into its renderer. */
export function rowFor(id) {
  return ROW_BY_ID.get(id) || null;
}

/* ── the first record opens by itself (platform.md §4.5) ────────────────
   AFTER A SEARCH, AND ONLY THEN. A sort, a grouping branch or Show more is
   the founder working the set they have; a search is a new set and the right
   column would otherwise say "Pick a patent" over a list that already ranked
   one first. The record is told through an event, as the reload is, because
   no surface may depend on another having run.

   ONLY WHERE THE COLUMNS SIT SIDE BY SIDE. Below 1080 they stack, and a
   record opening by itself would push the list the founder just asked for
   below the fold. Focus stays where it is: the founder pressed Search, not
   the row. */
function openFirst(data) {
  if (!data || !data.patents || !data.patents.length) return;
  if (!matchMedia('(min-width:1080px)').matches) return;
  const first = $('#setList .drill-toggle');
  if (!first) return;
  window.dispatchEvent(new CustomEvent('terrain:open-first',
    { detail: { id: first.getAttribute('data-pn') } }));
}

export function init(ctx) {
  ENGINE = ctx.engine;

  /* ── the drawings are ONE tab stop per row ──────────────────────────────
     Twenty rows times twelve drawings is 240 tab stops between the top of the
     list and the bottom, which is not navigation, it is an obstacle — the
     argument roving.mjs opens with, for a group a third the size. rovingIn
     rather than roving because the list rebuilds all twenty strips on every
     sort, grouping, re-rank and page, and an instance per row is twenty
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
    request('patents', undefined, 'The list did not load.', null, 'arrive').then(openFirst);
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
    /* a search is a load, so the route's first-arrival load stands down */
    loaded = true;
    settled(false, '');
    syncStarUI();
    /* THE COUNT IS SAID ONCE THE ROWS ARE THERE (R1-09). The composer said
       *Searching…* when the search left; this is the answer to it, in the
       heading's own words, so a founder who cannot see the list hears what
       the search returned before the first record opens. */
    request('patents', undefined, 'The list did not load.').then(d => {
      if (d) {
        const m = d.matched, n = (d.patents || []).length;
        say('work', m === 0 ? 'No patents matched.' : m === 1 ? '1 patent matched.'
          : m === n ? m + ' patents matched.' : m + ' matched, ' + n + ' shown.');
      }
      return openFirst(d);
    });
  });

  /* THE GROUPING HANDS BACK A SET, NOT A DOM INSTRUCTION. fishbone.mjs asked
     `facets` for the branches the founder picked and this is the answer; the
     list renders it exactly as it renders a sort or a status facet, because it
     IS one. The panel never touches these rows.

     The ordering stands down for the same reason a new search stands it down:
     `Find similar` ordered a set this is no longer. */
  window.addEventListener('terrain:refiltered', e => {
    settled(false, '');
    render(e.detail);
  });

  /* [data-star] IN THE SELECTOR, NOT JUST THE CLASS. The starred page's
     remove buttons wear .set-star for its look and carry data-unstar, not
     data-star; matched on the class alone, every removal there also ran this
     handler with a null id, and the store filed a phantom row under "null"
     — a row with no patent that then rode out in the CSV. */
  onActivate(document, '.set-star[data-star]', el =>
    toggleStar(el.getAttribute('data-star'), el));

  /* ══ THE WHOLE ROW OPENS ITS RECORD · design-language.md §7, R3-36 ══════
     The row's button is its three bands; the star's column under the star,
     the gap above the strip and the padding round it were dead ground — on a
     phone, about a third of the row a thumb lands on. A press there is the
     row's press, handed to its button so there is one path and one return
     point for focus.

     NOT ON A CONTROL, NOT ON A SELECTION. A press that starts on the star,
     the version switch or a drawing is theirs, and one that ends a text
     selection is somebody copying a holder name. The button stays the one
     keyboard and assistive-technology target, so nothing here takes a tab
     stop or a role. */
  document.addEventListener('click', e => {
    const t = e.target instanceof Element ? e.target : null;
    const row = t && t.closest('#setList .set-row');
    if (!row || e.defaultPrevented || t.closest('button, a, input, select, textarea, [role="group"]')) return;
    const sel = window.getSelection && window.getSelection();
    if (sel && !sel.isCollapsed && row.contains(sel.anchorNode)) return;
    const btn = row.querySelector('.drill-toggle');
    if (btn) btn.click();
  });

  /* THE WAY BACK, from the empty state: the settings it names, opened. */
  onActivate(document, '[data-empty-settings]', () => {
    const btn = $('#resSettings');
    if (btn) btn.click();
  });

  onActivate(document, '.ver-switch [data-ver-kind]', el =>
    setVersion(el.getAttribute('data-ver-of'), el.getAttribute('data-ver-kind')));

  /* FIND SIMILAR IS THE OPEN RECORD'S, AND THE ACT BELONGS HERE rather than
     in record.mjs. Reordering the set is the list's business; the record's
     head only supplies the button. The anchor is that one patent, and this
     does NOT star it: a founder who wants more like this one has not
     necessarily decided it belongs in the set they are taking out
     (platform.md §5.1). The response is an ORDER over the same set. */
  onActivate(document, '#recSimilar', el => {
    const id = el.getAttribute('data-pn');
    if (!id) return;
    const row = ROW_BY_ID.get(id);
    /* THE ID IS NOT THE NUMBER (ports.mjs). A withheld number names the patent
       by what it is to the founder rather than by the engine's key. */
    reorderTo([id], (row && row.number) || 'the open patent', el);
  });

  onActivate(document, '#setRestore', () => {
    settled(false, '');
    /* THE WAIT GOES ON SORT, not on Restore: Restore has just hidden itself,
       and Sort is the control that names the order being returned to. */
    request('sort', { sort: 'relevance' },
      'The original order could not be restored.', '#sortBtn', 'reorder');
  });

  lmMenu('sortWrap', 'sortBtn', 'sortMenu');
  /* THE RECORD'S EXPORT MENU IS A .lm, so the file that owns .lm drives it.
     The markup is static in surface.html for exactly this reason — lmMenu
     binds by id at init and is not delegated, so a menu rebuilt on every
     record open would need a driver of its own. */
  lmMenu('recExpWrap', 'recExpBtn', 'recExpMenu');

  /* THE TRIGGER CARRIES THE CURRENT SORT, so the bar states the order without
     the menu being open. A control that says only "Sort" makes the founder
     open it to find out what they are looking at. */
  onActivate(document, '#sortMenu [data-sort]', el => {
    const val = el.getAttribute('data-sort');
    check($('#sortMenu'), el);
    const label = $('#sortLabel');
    if (label) label.textContent = el.querySelector('span:last-child').textContent;
    /* A SORT LEAVES THE ROWS STANDING, design-language.md §6 "What a wait
       looks like": the patents on screen are still the result, only their
       order is coming. It used to empty the list to a loader, which said the
       set was being re-fetched when it was not. */
    request('sort', { sort: val }, 'The list could not be re-sorted. It is unchanged.',
      '#sortBtn', 'reorder');
  });


}
