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

let ENGINE = null;
let restore = null;
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
  if (app) app.classList.remove('rec-open');
  drop('record');
  /* isConnected before restoring: a row re-rendered by a re-rank is the
     ordinary case, not the exception, and focusing a detached node silently
     drops focus to <body>. */
  if (restore && restore.isConnected) focusQuietly(restore);
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
  landIn(body, paneHTML(res.data));
  /* focus moves to the heading, quietly — preventScroll is the fix for the
     record jumping the pane it opened over */
  focusQuietly($('#recTitle'));
}

export function init(ctx) {
  ENGINE = ctx.engine;
  onActivate(document, '.drill-toggle', el => open(el.getAttribute('data-pn'), el));
  onActivate(document, '#recClose', close);
}
