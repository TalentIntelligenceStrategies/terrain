/* surfaces/destinations — account, plan & billing, help. platform.md §6.
 *
 * THREE PAGES, ONE FILE, because they are one KIND of surface: account-level,
 * reached from the chrome rather than from the flow, each with a Back control
 * that goes where the founder came from rather than to a fixed place.
 *
 * ═══ THE FOUNDER'S OWN NAME AND ADDRESS ARE BARS ═══════════════════════════
 * design-language.md §8 does not bend for them, and the settings page is
 * exactly where that temptation is strongest — a page whose entire content is a
 * name and an email. A password renders as a run of dots, which is what a
 * password looks like everywhere and is chrome rather than an identity being
 * withheld.
 *
 * ═══ 'XXX' IS NOT null ═════════════════════════════════════════════════════
 * They are two different refusals and they render through two different paths
 * on purpose. null is "this value exists and we decline to print it"; 'XXX' is
 * "nobody has chosen one yet". Pricing is open — platform.md §12 — so the plan
 * screen prints XXX rather than guessing a number into existence, and a bar
 * there would claim a price exists and is being kept from them.
 */
import { $, esc } from '../core/dom.mjs';
import { failWith } from '../core/wait.mjs';
import { say } from '../core/live-region.mjs';
import { onActivate } from '../core/delegate.mjs';
import { btnWait, btnRest } from '../core/button-wait.mjs';
import { popover } from '../core/popover.mjs';
import { reduced } from '../core/motion.mjs';
import { focusQuietly } from '../core/focus.mjs';
import { push, drop } from '../core/esc-stack.mjs';

let ENGINE = null;
const done = new Set();

/* ── account · platform.md §6.1 ─────────────────────────────────────────── */
function accountFill(d) {
  const set = (idBar, idSaid, value) => {
    const b = $(idBar), s = $(idSaid);
    if (value == null) { if (b) b.hidden = false; if (s) s.hidden = true; return; }
    if (b) b.hidden = true;
    if (s) { s.hidden = false; s.textContent = value; }
  };
  set('#acctNameBar', '#acctNameSaid', d.name);
  set('#acctMailBar', '#acctMailSaid', d.email);
}

/* ── billing · platform.md §6.2 ─────────────────────────────────────────── */
function billingFill(d, invoices) {
  /* 'XXX' IS A SENTINEL, NOT A STRING TO PRINT. ports.mjs holds it distinct
     from null deliberately, and that distinction is worth keeping — but the
     token is for the contract, not for the customer. Unset, the figure becomes
     a sentence and the "/ quarter" beside it goes with it, because a period
     qualifies a price and there is no price to qualify. */
  const price = $('#billPrice'), per = $('#billPer');
  if (price) {
    const unset = d.price === 'XXX';
    price.textContent = unset ? 'Not set yet' : d.price;
    price.className = unset ? 't-body' : 'fig fig-l';
    if (per) per.hidden = unset;
  }
  const inv = $('#billInv');
  if (!inv) return;
  if (!invoices || !invoices.length) {
    inv.innerHTML = '<p class="empty t-body">No invoices yet.</p>';
    return;
  }
  /* EVERY INVOICE AMOUNT IS THE PLAN PRICE — platform.md §11. A plan that
     renews at one figure cannot bill four. */
  inv.innerHTML = '<table class="tbl"><thead><tr>'
    + '<th class="t-micro">Date</th><th class="t-micro num">Amount</th>'
    + '<th class="t-micro">Status</th></tr></thead><tbody>'
    + invoices.map(i =>
        '<tr><td><span class="fig fig-s">' + esc(i.when) + '</span></td>'
        + '<td class="num"><span class="fig-m">' + esc(i.amount) + '</span></td>'
        + '<td>' + esc(i.status) + '</td></tr>').join('')
    + '</tbody></table>';
}

/* ── account · the delete disclosure · platform.md §6.1 ────────────────
   THE TOGGLE IS LIVE AND THE ACT IS NOT, and that split is §8's rather than a
   half-measure. What cannot run is deleting an account there is no model of,
   and #acctDelYes carries §8's treatment for exactly that. Opening a panel to
   READ the consequence is pure client state, which is what §8 says stays live.
   A control promising `aria-expanded` and then doing nothing is the press a
   founder blames themselves for — which is the failure §8 opens by naming.

   `data-done` TAKES THE CLIP OFF ONCE IT HAS LANDED. `.dc>div` is
   overflow:hidden, which clips a 2px ring at 2px of offset, so until it lands
   the two buttons inside have NO VISIBLE FOCUS STATE. With motion off there is
   no transitionend to hang it on, so reduced() sets it synchronously — read
   LIVE and never cached, because turning reduced motion on mid-session moves
   the CSS and would otherwise leave this behind.

   ESCAPE GOES THROUGH THE STACK, not a local keydown. One overlay closes at a
   time and the most recent wins; a private listener here would close this
   panel from under whatever opened over it. */
const DEL = 'acctDel';

function delOpen() {
  const el = $('#acctDel'), btn = $('#acctDelBtn');
  if (!el || !btn || el.hasAttribute('data-open')) return;
  el.setAttribute('data-open', '');
  btn.setAttribute('aria-expanded', 'true');
  if (reduced()) el.setAttribute('data-done', '');
  focusQuietly($('#acctDelIn'));
  push(DEL, delClose);
}

function delClose() {
  const el = $('#acctDel'), btn = $('#acctDelBtn');
  if (!el || !btn || !el.hasAttribute('data-open')) return;
  /* ONLY TAKE FOCUS BACK IF IT WAS INSIDE. A founder who clicked away and then
     pressed Escape is not asking to be sent to the trigger. */
  const was = el.contains(document.activeElement);
  el.removeAttribute('data-open');
  el.removeAttribute('data-done');
  btn.setAttribute('aria-expanded', 'false');
  drop(DEL);
  if (was) focusQuietly(btn);
}

export function init(ctx) {
  ENGINE = ctx.engine;

  /* the delete disclosure · §6.1 */
  onActivate(document, '#acctDelBtn', () => {
    const el = $('#acctDel');
    if (el && el.hasAttribute('data-open')) delClose(); else delOpen();
  });
  onActivate(document, '#acctDelNo', delClose);

  /* ── the switches · platform.md §8 ───────────────────────────────
     §8 NAMES THE SWITCHES AMONG WHAT IS LIVE, and the one that exists was not.
     It rendered checked, took focus, took a press and stayed checked — the
     same defect as the delete disclosure and the same sentence refuses it:
     a control that looks live and does nothing is worse than one that is
     absent, because the founder blames themselves for the press.

     NOTHING IS SAID ALOUD. `role="switch"` announces its own state change
     from aria-checked, so a live region here would say it twice. */
  onActivate(document, '[role="switch"]', el =>
    el.setAttribute('aria-checked',
      el.getAttribute('aria-checked') === 'true' ? 'false' : 'true'));
  const delEl = $('#acctDel');
  if (delEl) delEl.addEventListener('transitionend', e => {
    if (e.propertyName === 'grid-template-rows' && delEl.hasAttribute('data-open'))
      delEl.setAttribute('data-done', '');
  });

  ctx.onRoute(async view => {
    if (done.has(view)) return;

    if (view === 'account') {
      done.add(view);
      const res = await ENGINE.account();
      if (res.ok) accountFill(res.data);
      else say('destination', 'Your account details did not load.');
    }

    if (view === 'billing') {
      done.add(view);
      const [b, i] = await Promise.all([ENGINE.billing(), ENGINE.invoices()]);
      if (b.ok) billingFill(b.data, i.ok ? i.data.invoices : null);
      else say('destination', 'Your plan did not load.');
    }
  });

  /* ── the account edit · open, validate, save ───────────────────────────── */
  onActivate(document, '[data-edit]', el => {
    const key = el.getAttribute('data-edit');
    const row = $('#' + key + 'Edit'), rest = $('#' + key + 'Rest');
    if (row) row.hidden = false;
    if (rest) rest.hidden = true;
    const fld = $('#' + key + 'Fld');
    if (fld) fld.focus({ preventScroll: true });
  });

  onActivate(document, '[data-cancel]', el => {
    const key = el.getAttribute('data-cancel');
    const row = $('#' + key + 'Edit'), rest = $('#' + key + 'Rest');
    if (row) row.hidden = true;
    if (rest) rest.hidden = false;
    clearInvalid(key);
  });

  onActivate(document, '[data-save]', async btn => {
    const key = btn.getAttribute('data-save');
    const fld = $('#' + key + 'Fld');
    const v = fld && fld.value.trim();
    if (!v) return;

    /* ── THE ONE VALIDATED FIELD, AND IT STAYS SYNCHRONOUS ────────────────
       A refusal the client can make is not a round trip, and putting a beat
       in front of it would invent a wait in order to say something already
       known. The message says HOW TO FIX rather than what is wrong.

       WEIGHT, NOT COLOUR. design-language.md §2 has no hue to spend on an
       error that would not collide with "expired patent" — so the edge
       doubles in weight and a sentence carries the rest. aria-invalid is what
       12-field.css styles, and check-app.py refuses a styled state that no
       module writes: this is the writer. */
    if (key === 'acctMail' && v.indexOf('@') < 0) {
      fld.setAttribute('aria-invalid', 'true');
      const msg = $('#acctMailMsg');
      if (msg) msg.hidden = false;
      /* focus goes back to the field that was refused. Without it a keyboard
         user presses Save, hears nothing move, and has to find their way back
         to the input they were already in. */
      fld.focus({ preventScroll: true });
      say('destination', 'That address needs an @ in it.');
      return;
    }

    const fail = $('#' + key + 'Fail');
    if (fail) fail.hidden = true;
    btnWait(btn, true);
    fld.readOnly = true;
    const res = await ENGINE.saveAccount({ [key]: v });
    btnRest(btn);
    fld.readOnly = false;

    if (!res.ok) {
      if (fail) {
        fail.hidden = false;
        failWith(fail, 'That change was not saved. What you typed is still here.',
          res.retryable ? () => btn.click() : null);
      }
      say('destination', 'That change was not saved.');
      return;
    }
    const row = $('#' + key + 'Edit'), rest = $('#' + key + 'Rest');
    const said = $('#' + key + 'Said');
    if (row) row.hidden = true;
    if (rest) rest.hidden = false;
    if (said) { said.hidden = false; said.textContent = v; }
    const barEl = $('#' + key + 'Bar');
    if (barEl) barEl.hidden = true;
    say('destination', 'Saved.');
  });

  /* typing clears the refusal — a message that outlived the thing it described
     is a message the founder learns to ignore */
  function clearInvalid(key) {
    const fld = $('#' + key + 'Fld');
    if (!fld) return;
    fld.removeAttribute('aria-invalid');
    const msg = $('#acctMailMsg');
    if (msg) msg.hidden = true;
  }
  document.addEventListener('input', e => {
    const fld = e.target.closest && e.target.closest('.fld, .ta');
    if (!fld || !fld.id) return;
    if (fld.hasAttribute('aria-invalid')) clearInvalid(fld.id.replace(/Fld$/, ''));
  });

  /* ── help · the topic menu ─────────────────────────────────────────────
     A MENU AND NOT A SELECT: there is no <select> in this system. It uses
     core/popover.mjs rather than a private open/close pair, which is the whole
     reason that module exists — masthead.mjs and list.mjs each had one, and a
     third copy is the one that drifts.

     THE TOPICS ARE OURS AND SHIP IN THE PAGE. components.md records why the
     FAQ may never become a payload and the same argument holds here: a topic
     list fetched at runtime can disagree with the build that renders it. */
  const TOPICS = [
    'Something is not working',
    'My results look wrong',
    'A patent record is wrong',
    'Taking my starred patents out',
    'My account or plan',
    'Something else',
  ];
  const tmenu = $('#helpTopicMenu'), tbtn = $('#helpTopicBtn'), tlabel = $('#helpTopicLabel');
  if (tmenu && tbtn) {
    /* menuitemradio, because it is one of six rather than six switches */
    tmenu.innerHTML = TOPICS.map((t, i) =>
      '<button class="lm-item" type="button" role="menuitemradio" data-topic="' + esc(t) + '"'
      + ' aria-checked="' + (i === 0 ? 'true' : 'false') + '">' + esc(t) + '</button>').join('');
    const pop = popover({ btn: tbtn, panel: tmenu, key: 'helpTopic' });
    onActivate(document, '#helpTopicMenu [data-topic]', el => {
      const t = el.getAttribute('data-topic');
      if (tlabel) tlabel.textContent = t;
      tmenu.querySelectorAll('[data-topic]').forEach(b =>
        b.setAttribute('aria-checked', String(b === el)));
      if (pop) pop.close();
      say('destination', t + ' selected.');
    });
  }

  /* SEND IS INERT UNTIL THERE IS SOMETHING TO SEND, natively disabled, and
     that is correct here rather than a departure: design-language.md §7 says
     `disabled` when the reason is already on screen, and the reason is the
     empty box directly above the button. It shipped disabled with nothing
     enabling it, so the whole send path below — including its retry — could
     never fire. */
  const hmsg = $('#helpMsg'), hsend = $('#helpSend');
  if (hmsg && hsend) {
    const syncSend = () => { hsend.disabled = !hmsg.value.trim(); };
    hmsg.addEventListener('input', syncSend);
    syncSend();
  }

  /* THE SENT STATE REPLACES THE FORM, so coming back has to restore it —
     otherwise "Send another message" is a button that removes the only way to
     send another message. */
  onActivate(document, '#helpAgain', () => {
    const form = $('#helpForm'), sent = $('#helpSent'), fail = $('#helpFail');
    if (sent) sent.hidden = true;
    if (form) form.hidden = false;
    if (fail) fail.hidden = true;
    if (hmsg) { hmsg.value = ''; hmsg.focus(); }
    if (hsend) hsend.disabled = true;
  });

  /* ── help · the send is a REQUEST · platform.md §7.1 ───────────────────── */
  onActivate(document, '#helpSend', async btn => {
    const msg = $('#helpMsg');
    if (!msg || !msg.value.trim()) return;
    btnWait(btn, true);
    const topic = $('#helpTopicLabel');
    const res = await ENGINE.sendSupport({
      text: msg.value,
      topic: topic ? topic.textContent.trim() : null,
    });
    btnRest(btn);
    const fail = $('#helpFail'), sent = $('#helpSent'), form = $('#helpForm');
    if (res.ok) {
      if (form) form.hidden = true;
      if (sent) sent.hidden = false;
      say('destination', 'Your message was sent.');
      return;
    }
    if (fail) {
      fail.hidden = false;
      /* THE MESSAGE IS STILL IN THE BOX, and saying so is the point: a founder
         who has just typed six sentences needs to know they have not lost them
         before they need to know what went wrong. */
      failWith(fail, 'Your message was not sent. It is still in the box.',
        res.retryable ? () => btn.click() : null);
    }
    say('destination', 'Your message was not sent.');
  });
}
