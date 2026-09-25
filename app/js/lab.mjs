/* lab.mjs — the bench driver. Not part of the product; it exercises core/.
 *
 * EVERY CHECK RETURNS A VERDICT rather than printing a value, so the bench can
 * be run headlessly and the answer is the same answer a person reads on the
 * page. A bench that only renders is a bench somebody has to look at, and the
 * things core/ gets wrong are exactly the ones looking at it cannot catch --
 * an accessible name that vanished, a live region that did not re-announce.
 */
import { $, $$ } from './core/dom.mjs';
import { reduced, onMotionChange, DUR2 } from './core/motion.mjs';
import { loader } from './core/loader.mjs';
import { waitOn, landIn, failIn, failHTML } from './core/wait.mjs';
import { btnWait, btnRest } from './core/button-wait.mjs';
import { sayFailure } from './core/live-region.mjs';
import { bump, stale } from './core/generation.mjs';
import { timerScope } from './core/timers.mjs';
import * as esc from './core/esc-stack.mjs';
import * as armed from './core/armed.mjs';
import { BEAT } from './core/beat.mjs';
import { on } from './core/delegate.mjs';

const T = timerScope();
esc.bindEscape();

/* ── 1 & 2 · the reserve ── */
let reserved1 = 0;
const acts = {
  wait1() {
    const el = $('#h1');
    reserved1 = el.offsetHeight;
    waitOn(el, 48);
  },
  land1() { landIn($('#h1'), 'Content tall enough to measure.<br>A second line.<br>A third.'); },
  fail1() { failIn($('#h1'), failHTML('That did not run. Nothing was charged.', { label: 'Try again' })); },
  fail2() {
    const el = $('#h2');
    waitOn(el, 48);
    T.after(500, () => failIn(el, failHTML('That did not run. Nothing was charged.', { label: 'Try again' })));
  },

  /* ── 3 · the identical re-announce ── */
  say() {
    sayFailure('That did not run. Nothing was charged.');
    const n = (+$('#sayN').dataset.n || 0) + 1;
    $('#sayN').dataset.n = n;
    $('#sayN').textContent = `announced ${n} time${n === 1 ? '' : 's'}`;
  },

  /* ── 4 · the accessible name ── */
  btnwait() {
    const b = $('#b4');
    if (!btnWait(b)) return;                       // the re-press guard IS the return value
    $('#b4n').textContent =
      `waiting · accessible name "${b.getAttribute('aria-label')}" · aria-busy ${b.getAttribute('aria-busy')}`;
    T.after(BEAT.row, () => {
      btnRest(b);
      $('#b4n').textContent = `at rest · name "${(b.textContent || '').trim()}" · no aria-label`;
    });
  },

  /* ── 5 · the stale generation ── */
  gen() {
    const token = bump('bench');
    $('#genOut').textContent = `started #${token}…`;
    T.after(600, () => {
      if (stale('bench', token)) return;           // the line that has to be in every callback
      $('#genOut').textContent = `landed #${token} — and only this one wrote`;
    });
  },

  /* ── 6 · escape order ── */
  esc() {
    const closed = [];
    for (const k of ['first', 'second', 'third']) esc.push(k, () => closed.push(k));
    while (esc.closeTop());
    $('#escOut').textContent = `closed in order: ${closed.join(' → ')}`;
  },

  /* ── 10 · the registry ── */
  armed() {
    ['alpha', 'beta', 'gamma'].forEach(n => { if (!armed.registered().includes(n)) armed.register(n, 0); });
    armed.arm('alpha'); armed.arm('gamma');
    const before = armed.armedNow().join(', ');
    armed.disarmAll();
    $('#armOut').textContent =
      `registered ${armed.registered().length} · armed [${before}] · after disarmAll [${armed.armedNow().join(', ') || 'none'}]`;
  },
};
on(document, 'click', '[data-act]', hit => acts[hit.dataset.act]?.());

/* ── 7 · REDUCED is live ── */
onMotionChange(r => {
  $('#redOut').textContent =
    `reduced() is ${r} · it is read through a function, never cached · a beat is still ` +
    `${BEAT.card}ms because a wait the system is having is information`;
});

/* ── 8 · the loader ── */
$('#h8').append(loader(), loader(), loader());

/* ── 9 · with and without a way forward ── */
$('#h9').innerHTML =
  failHTML('That did not run. Nothing was charged.', { label: 'Try again' }) +
  failHTML('No corpus can be built from these criteria. Change the scope and search again.');

/* ══ the headless verdicts ══════════════════════════════════════════════════
   Each returns {name, pass, detail}. runAll() is what a person presses and
   what a script calls, so there is one definition of "did this pass". */
const sleep = ms => new Promise(r => setTimeout(r, ms));

const CHECKS = [
  async function reserveHoldsAndDoesNotJumpTwice() {
    const el = $('#h1');
    landIn(el, 'Content tall enough to measure.<br>A second line.<br>A third.');
    await sleep(30);
    const before = el.offsetHeight;
    waitOn(el, 48);
    await sleep(30);
    const waiting = el.offsetHeight;
    landIn(el, 'Content tall enough to measure.<br>A second line.<br>A third.');
    await sleep(30);
    const after = el.offsetHeight;
    return {
      pass: waiting >= before && before === after && waiting > 20,
      detail: `${before}px → ${waiting}px waiting → ${after}px. The loader is 20px; ` +
              `an unreserved region would collapse to it.`,
    };
  },

  async function failureKeepsTheReservedHeight() {
    const el = $('#h2');
    landIn(el, 'Four lines.<br>Of content.<br>To give it.<br>A height.');
    await sleep(30);
    const before = el.offsetHeight;
    waitOn(el, 48);
    await sleep(20);
    failIn(el, failHTML('That did not run.', { label: 'Try again' }));
    await sleep(30);
    const kept = el.style.minHeight;
    return {
      pass: kept !== '' && parseInt(kept, 10) >= before - 1,
      detail: `minHeight is "${kept}" after failIn, reserved from ${before}px. ` +
              `landIn clears it; failIn must not.`,
    };
  },

  async function identicalSecondFailureAnnouncesAgain() {
    const r = $('#alertRegion');
    const msg = 'That did not run. Nothing was charged.';
    sayFailure(msg);
    const first = r.textContent;
    sayFailure(msg);                       // the same string again
    const clearedImmediately = r.textContent === '';
    await sleep(120);
    const rewritten = r.textContent === msg;
    return {
      pass: first === msg && clearedImmediately && rewritten,
      detail: clearedImmediately
        ? 'cleared, then re-set after 60ms — a screen reader announces the second one'
        : 'NOT cleared: a second identical failure would be silent',
    };
  },

  async function buttonKeepsItsNameThroughAWait() {
    const b = $('#b4');
    btnRest(b);
    const resting = (b.textContent || '').trim();
    btnWait(b);
    const named = b.getAttribute('aria-label');
    const busy = b.getAttribute('aria-busy');
    const guarded = btnWait(b) === false;
    btnRest(b);
    const cleaned = !b.hasAttribute('aria-label') && !b.hasAttribute('aria-busy');
    return {
      pass: named === resting && busy === 'true' && guarded && cleaned,
      detail: `name "${resting}" → aria-label "${named}", aria-busy ${busy}, ` +
              `re-press guarded ${guarded}, cleaned up ${cleaned}`,
    };
  },

  async function staleGenerationNoOps() {
    const wrote = [];
    const a = bump('check');
    setTimeout(() => { if (!stale('check', a)) wrote.push('a'); }, 40);
    const b = bump('check');                        // a is now stale
    setTimeout(() => { if (!stale('check', b)) wrote.push('b'); }, 60);
    await sleep(140);
    return {
      pass: wrote.length === 1 && wrote[0] === 'b',
      detail: `wrote [${wrote.join(', ')}] — the superseded callback must no-op`,
    };
  },

  async function escapeUnwindsMostRecentFirst() {
    const closed = [];
    for (const k of ['one', 'two', 'three']) esc.push(k, () => closed.push(k));
    const top = esc.top();
    while (esc.closeTop());
    return {
      pass: top === 'three' && closed.join(',') === 'three,two,one',
      detail: `top was "${top}", closed ${closed.join(' → ')}`,
    };
  },

  async function loaderCarriesItsRampNotAFlatTone() {
    const l = loader();
    document.body.append(l);
    const dots = $$('.dmx-dot', l);
    const rests = dots.map(d => d.style.getPropertyValue('--rest'));
    const opacities = dots.map(d => +getComputedStyle(d).opacity);
    l.remove();
    const distinct = new Set(rests).size;
    return {
      pass: dots.length === 9 && distinct === 5 && opacities.every(o => o > 0 && o <= 1),
      detail: `9 dots, ${distinct} distinct --rest bands, opacity ${Math.min(...opacities).toFixed(2)}` +
              `–${Math.max(...opacities).toFixed(2)}. Unset --rest would render every dot at 1.`,
    };
  },

  async function failHTMLOmitsTheButtonWhenThereIsNoWayForward() {
    const withAct = failHTML('x', { label: 'Try again' });
    const without = failHTML('x');
    return {
      pass: withAct.includes('fail-act') && !without.includes('fail-act') && !without.includes('<button'),
      detail: 'a block with no way forward has no button, rather than a dead one',
    };
  },

  async function armedRegistryCannotMissAFlag() {
    ['p', 'q'].forEach(n => { if (!armed.registered().includes(n)) armed.register(n, 0); });
    armed.arm('p'); armed.arm('q');
    const armedBefore = armed.armedNow().length;
    armed.disarmAll();
    const armedAfter = armed.armedNow().length;
    let threw = false;
    try { armed.get('never-registered'); } catch { threw = true; }
    return {
      pass: armedBefore >= 2 && armedAfter === 0 && threw,
      detail: `${armedBefore} armed → ${armedAfter} after disarmAll; an unregistered flag throws ` +
              `rather than silently reading undefined`,
    };
  },

  async function consumeIsReadAndClearInOneStep() {
    armed.register('one-shot', 0);
    armed.arm('one-shot');
    const first = armed.consume('one-shot');
    const second = armed.consume('one-shot');
    return {
      pass: first === 1 && second === 0,
      detail: `first consume ${first}, second ${second} — a one-shot fires once`,
    };
  },

  async function timerScopeCancelsWhatItStarted() {
    const s = timerScope();
    let fired = 0;
    s.after(30, () => fired++); s.after(40, () => fired++); s.after(50, () => fired++);
    const started = s.size;
    s.cancelAll();
    await sleep(90);
    return {
      pass: started === 3 && fired === 0 && s.size === 0,
      detail: `${started} started, ${fired} fired after cancelAll`,
    };
  },

  async function reducedIsReadLiveNotCached() {
    let seen = null;
    const off = onMotionChange(r => { seen = r; });
    const ok = seen === reduced();
    off();
    return {
      pass: ok,
      detail: `reduced() is ${reduced()} and the subscriber agrees. The prototype read this once ` +
              `at parse time, so turning it on mid-session left the JavaScript behind.`,
    };
  },
];

async function runAll() {
  const out = [];
  for (const fn of CHECKS) {
    let r;
    try { r = await fn(); }
    catch (e) { r = { pass: false, detail: 'threw: ' + e.message }; }
    out.push({ name: fn.name, pass: r.pass, detail: r.detail });
  }
  return out;
}
window.runAll = runAll;                       // the headless entry point

$('#runAll').addEventListener('click', async () => {
  const out = await runAll();
  const bad = out.filter(r => !r.pass);
  $('#runOut').textContent = bad.length
    ? `${bad.length} of ${out.length} FAILED: ${bad.map(b => b.name).join(', ')}`
    : `all ${out.length} checks pass`;
  $('#runOut').className = bad.length ? 'bench-bad' : 'bench-ok';
  for (const r of out) console.log(r.pass ? 'PASS' : 'FAIL', r.name, '·', r.detail);
});
