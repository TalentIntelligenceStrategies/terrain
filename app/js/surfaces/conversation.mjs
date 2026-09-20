/* surfaces/conversation — moments 1-3. platform.md §3, §4, §5.
 *
 * One field, five narrowing questions, and a gate. The gate and the build block
 * are PARKED components moved into the thread rather than duplicated, so the
 * card on the map is literally the same node as the one here.
 *
 * ═══ THE GATE IS WHERE THE CHARGE HAPPENS ══════════════════════════════════
 * platform.md §9.2, and it is the reason `approve` is its own port. A run that
 * did not finish is not a run that was charged — so the ledger has to
 * distinguish an attempted run from a completed one, and the surface has to
 * spend at the moment the founder commits rather than at the moment the result
 * arrives.
 *
 * ═══ A STAGE STREAM, NOT A PERCENTAGE ══════════════════════════════════════
 * platform.md §5. A percentage invents a denominator nobody measured, and a
 * founder reads 80% as "nearly done" and then waits as long again. Named stages
 * say what is happening and cannot imply a finishing time.
 */
import { $, esc } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { say } from '../core/live-region.mjs';
import { btnWait, btnRest } from '../core/button-wait.mjs';
import { failHTML, failWith } from '../core/wait.mjs';
import { wait as pause } from '../core/timers.mjs';
import { reduced } from '../core/motion.mjs';

let ENGINE = null;
let ROUND = [];
let asked = 0;
const answers = [];

function pushYou(text) {
  const thread = $('#thread');
  if (!thread) return;
  thread.insertAdjacentHTML('beforeend',
    '<div class="turn turn-you"><p class="t-body">' + esc(text) + '</p></div>');
}

/* A RETRY BUTTON THAT DOES NOTHING IS WORSE THAN NO BUTTON — platform.md §9
   makes that a rule rather than a preference, so a pushed failure block binds
   the button it just created or is passed no `retry` at all. */
function pushFail(say, retry) {
  const node = pushSystem(failHTML(say, retry ? { label: 'Try again' } : null));
  if (node && retry) {
    const b = node.querySelector('.fail-act button');
    if (b) b.addEventListener('click', retry, { once: true });
  }
  return node;
}

function pushSystem(html) {
  const thread = $('#thread');
  if (!thread) return null;
  const node = document.createElement('div');
  node.className = 'turn turn-sys';
  node.innerHTML = html;
  thread.append(node);
  return node;
}

/* ── the five questions ───────────────────────────────────────────────────
   One at a time, each with its options as chips. The founder may type instead
   of answering — platform.md §3.3 — and that is not a fallback, it is the
   correction point the whole flow is built around. */
function askNext() {
  if (asked >= ROUND.length) return gate();
  const q = ROUND[asked];
  pushSystem(
    '<div class="qa-item"><p class="qa-q t-body">' + esc(q.q) + '</p>'
    + '<div class="qa-opts">'
    + q.opts.map((o, i) =>
        '<button class="suggest chip" type="button" data-opt="' + i + '">'
        + esc(o) + '</button>').join('')
    + '</div></div>');
}

function answer(i) {
  const q = ROUND[asked];
  if (!q) return;
  answers.push(q.opts[i]);
  const item = $('.qa-item:not([data-said])');
  if (item) {
    item.setAttribute('data-said', '1');
    const opts = item.querySelector('.qa-opts');
    if (opts) opts.innerHTML =
      '<span class="chip chip-said">' + esc(q.opts[i]) + '</span>';
  }
  asked++;
  askNext();
}

/* ── the gate · platform.md §4 ────────────────────────────────────────────
   NOTHING IS SEARCHED UNTIL IT IS APPROVED. It states what it is gating, reads
   back what it understood, and offers exactly one primary action. */
function gate() {
  const card = $('#cfCard');
  const thread = $('#thread');
  if (!card || !thread) return;
  const text = $('#cfChangeText');
  if (text) text.textContent = answers.join(' · ');
  const said = $('#cfSaidText');
  if (said && answers.length) said.textContent = answers.join(' · ');
  thread.append(card);
  card.hidden = false;
}

/* ── the build · platform.md §5 ──────────────────────────────────────────── */
async function build() {
  const block = $('#bdBlock');
  const thread = $('#thread');
  if (!block || !thread) return;
  thread.append(block);
  block.hidden = false;

  const list = $('#stages');
  const bar = $('#progBar');
  if (list) list.innerHTML = '';

  const res = await ENGINE.buildProgress({}, (i, label) => {
    if (!list) return;
    list.insertAdjacentHTML('beforeend',
      '<li class="stage is-run" data-state="run" style="--stage-delay:0ms">'
      + '<span class="stage-t">' + esc(label) + '</span></li>');
    const prev = list.children[i - 1];
    if (prev) { prev.classList.remove('is-run'); prev.setAttribute('data-state', 'done'); }
    if (bar) bar.style.transform = 'scaleX(' + ((i + 1) / 6) + ')';
    say('conversation', label);
  });

  const lastStage = list && list.lastElementChild;
  if (lastStage) { lastStage.classList.remove('is-run'); lastStage.setAttribute('data-state', 'done'); }

  if (!res.ok) {
    const box = document.createElement('div');
    block.append(box);
    failWith(box, 'The build stopped before it finished. Nothing was charged.',
      res.retryable ? build : null);
    say('conversation', 'The build stopped before it finished.');
    return;
  }
  const done = $('#bdDone');
  if (done) done.hidden = false;
}

export function init(ctx) {
  ENGINE = ctx.engine;

  /* moment 1 · one field. The composer is the whole of the first screen. */
  onActivate(document, '#cmpMain [data-send], #cmpMain button[type="submit"]', async btn => {
    const field = $('#cmpMain textarea, #cmpMain input');
    const text = field && field.value.trim();
    if (!text) return;
    pushYou(text);
    if (field) field.value = '';

    btnWait(btn);
    const res = await ENGINE.read(text);
    btnRest(btn);

    if (!res.ok) {
      pushFail('We could not read that. Nothing has been searched and nothing charged.',
        res.retryable ? () => btn.click() : null);
      say('conversation', 'We could not read what you described.');
      return;
    }

    const nr = await ENGINE.narrow();
    if (!nr.ok) {
      pushFail('The questions did not load.', () => btn.click());
      return;
    }
    ROUND = nr.data.round || [];
    asked = 0;
    answers.length = 0;
    askNext();
  });

  onActivate(document, '.qa-opts .suggest', el =>
    answer(Number(el.getAttribute('data-opt')) || 0));

  /* THE APPROVAL IS THE CHARGE. §9.2 — and the button carries its own wait,
     because the founder has just committed and the next thing they see must
     not be a surface that looks idle. */
  onActivate(document, '#cfApprove', async btn => {
    btnWait(btn);
    const res = await ENGINE.approve({ answers });
    btnRest(btn);
    if (!res.ok) {
      const card = $('#cfCard');
      if (card) {
        const box = document.createElement('div');
        card.append(box);
        /* INSUFFICIENT is NOT retryable and the engine says so: pressing again
           cannot make the balance larger. The way forward is a different route
           — top up — not this button, so the block offers none. */
        failWith(box, res.code === 'INSUFFICIENT'
          ? 'There are not enough points for this run. Nothing was charged.'
          : 'The run did not start. Nothing was charged.',
          res.retryable ? () => btn.click() : null);
      }
      say('conversation', 'The run did not start. Nothing was charged.');
      return;
    }
    const card = $('#cfCard');
    if (card) card.hidden = true;
    const meter = $('#meterN');
    if (meter) meter.textContent = String(res.data.balance);
    build();
  });

  onActivate(document, '#bdOpen', () => { location.hash = '#set'; });
}
