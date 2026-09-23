/* surfaces/settings — the search settings panel, and the state it holds.
 *
 * ═══ ONE PANEL, TWO ANCHORS, ONE SET OF VALUES ═════════════════════════════
 * #cmpSettings on the conversation and #resSettings on the results bar open
 * the same node, moved between the two wraps rather than duplicated — the
 * pattern the confirm card already uses. Two copies of these controls would be
 * two readings of one value, and the first thing that goes wrong with those is
 * that they disagree while both look right.
 *
 * ═══ THE VALUES ARE THE SEARCH'S, NOT THE PANEL'S ══════════════════════════
 * `read()` is what the composer calls on its way into ENGINE.search(). The
 * panel is a view of that object and nothing else holds it, so closing the
 * panel, switching surfaces or re-rendering a toolbar cannot lose a setting.
 *
 * ═══ NOTHING HERE IS A MODAL ═══════════════════════════════════════════════
 * core/popover.mjs carries the rule and the reasons. This module only decides
 * which side the panel opens toward, which is a fact about where the trigger
 * sits rather than a preference.
 */
import { $ } from '../core/dom.mjs';
import { popover } from '../core/popover.mjs';
import { onActivate } from '../core/delegate.mjs';
import { say } from '../core/live-region.mjs';

/* THE DEFAULTS ARE THE COVERAGE TABLE. Every jurisdiction the home screen says
   Terrain covers is on, and both kinds are on, because a search that silently
   excluded something the coverage table promised would be the interface
   disagreeing with itself two hundred pixels apart. */
const DEFAULTS = {
  sources: ['us', 'cn', 'tw', 'ep', 'kr', 'jp'],
  kinds: ['granted', 'applications'],
  count: 50,
  basis: 'filed',
  from: '',
  to: '',
};

let STATE = clone(DEFAULTS);
let panelFor = null;   /* which trigger the panel is currently parked under */

function clone(o) {
  return { ...o, sources: [...o.sources], kinds: [...o.kinds] };
}

/** what the composer sends with the search. A copy, so nothing downstream can
 *  reach back into the panel's state by holding onto the object. */
export function read() { return clone(STATE); }

/* ── the panel's controls, both directions ───────────────────────────────── */

function paint() {
  const pop = $('#setPop');
  if (!pop) return;
  pop.querySelectorAll('[data-src]').forEach(b =>
    b.setAttribute('aria-pressed', String(STATE.sources.includes(b.dataset.src))));
  pop.querySelectorAll('[data-kind]').forEach(b =>
    b.setAttribute('aria-pressed', String(STATE.kinds.includes(b.dataset.kind))));
  pop.querySelectorAll('[data-count]').forEach(b =>
    b.setAttribute('aria-pressed', String(Number(b.dataset.count) === STATE.count)));
  pop.querySelectorAll('[data-basis]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.basis === STATE.basis)));
  const f = $('#popFrom'), t = $('#popTo');
  if (f) f.value = STATE.from;
  if (t) t.value = STATE.to;
  summarise();
}

/* THE TRIGGER SAYS WHETHER ANYTHING IS SET, because a panel is a place the
   founder cannot see from outside. Without this, a search narrowed to one
   jurisdiction looks exactly like a search over all six. The dot is a shape on
   the control, not a colour on it — §2. */
function summarise() {
  const changed =
    STATE.sources.length !== DEFAULTS.sources.length ||
    STATE.kinds.length !== DEFAULTS.kinds.length ||
    STATE.count !== DEFAULTS.count ||
    STATE.basis !== DEFAULTS.basis ||
    STATE.from !== '' || STATE.to !== '';
  ['#cmpSettings', '#resSettings'].forEach(sel => {
    const b = $(sel);
    if (!b) return;
    b.classList.toggle('has-set', changed);
    b.setAttribute('aria-label', changed
      ? 'Search settings, changed from the defaults'
      : 'Search settings');
  });
}

/* A SET THE FOUNDER CANNOT EMPTY. Turning off the last jurisdiction would ask
   the engine to search nowhere, and the honest answer to that is not an empty
   result — it is refusing the act. The chip stays on and says why. */
function toggleIn(list, value, what) {
  const i = list.indexOf(value);
  if (i < 0) { list.push(value); return true; }
  if (list.length === 1) {
    say('conversation', 'At least one ' + what + ' has to stay on.');
    return false;
  }
  list.splice(i, 1);
  return true;
}

/* ── moving the one panel between its two anchors ────────────────────────── */

function park(wrapId) {
  const wrap = $('#' + wrapId), pop = $('#setPop');
  if (!wrap || !pop || panelFor === wrapId) return;
  wrap.append(pop);
  panelFor = wrapId;
}

/* WHICH WAY IT OPENS IS MEASURED, NOT DECLARED, and the first attempt at this
   was a class per anchor that named a direction in the stylesheet. That is a
   guess about the viewport written where the viewport cannot be read: the home
   composer sits 470px down a 900px window, its panel is 464px tall, and both
   directions overflow. The stylesheet cannot know that and neither can a
   comment claiming one side has more room.

   So: take the side with more space, and cap the panel to what that side
   actually has. The cap is an inline max-height rather than a custom property
   because nothing else reads it and a property JS sets has to be declared in
   app/README.md's table to survive check-app.py's gate B — a row for a value
   with one writer and one reader is bookkeeping, not an interface.

   THE FLOOR MATTERS. Capping to a genuinely tiny gap would produce a 40px
   panel with a scrollbar, which is worse than one that overhangs. Below the
   floor it takes the bigger side and scrolls. */
const GAP = 8, EDGE = 16, FLOOR = 240;

function place() {
  const wrap = panelFor && $('#' + panelFor), pop = $('#setPop');
  if (!wrap || !pop) return;
  const r = wrap.getBoundingClientRect();
  const below = window.innerHeight - r.bottom - GAP - EDGE;
  const above = r.top - GAP - EDGE;
  const down = below >= above;
  const room = Math.max(down ? below : above, FLOOR);
  pop.classList.toggle('pop-down', down);
  pop.classList.toggle('pop-up', !down);
  pop.style.maxHeight = room + 'px';
}

export function init() {
  const pop = $('#setPop');
  if (!pop) return;

  /* THE PANEL IS OUT OF #parked THE MOMENT THIS RUNS. It ships inside a
     [hidden] container so it cannot flash during the partial fetch, and
     [hidden] on an ancestor is display:none — which no amount of opacity on
     the panel itself can escape. */
  park('cmpSetWrap');

  const make = (btnId, wrapId, key) => {
    const btn = $('#' + btnId);
    if (!btn) return null;
    return popover({
      btn, panel: pop, key,
      host: $('#' + wrapId),
      /* the panel moves and is measured BEFORE the open class lands — a panel
         that animates open in one wrap and then jumps to the other is the
         container moving while its contents do, which §6 bars outright. */
      onOpen: () => { park(wrapId); paint(); place(); },
    });
  };

  /* ONE OPEN AT A TIME, and here it is not a preference: there is literally
     one panel node, so opening the second while the first is open would move
     the node out from under an open class and leave a wrap marked open with
     nothing in it. */
  const cmp = make('cmpSettings', 'cmpSetWrap', 'setPopCmp');
  const res = make('resSettings', 'resSetWrap', 'setPopRes');
  const both = [cmp, res].filter(Boolean);
  const closeAll = () => both.forEach(c => c.close());

  /* paint() runs whether or not the toggle took: a refused change still has to
     put the chip back where it was, because the browser has already drawn the
     press. */
  onActivate(document, '#setPop [data-src]', el => {
    toggleIn(STATE.sources, el.dataset.src, 'place to search');
    paint();
  });
  onActivate(document, '#setPop [data-kind]', el => {
    toggleIn(STATE.kinds, el.dataset.kind, 'kind of filing');
    paint();
  });
  onActivate(document, '#setPop [data-count]', el => {
    STATE.count = Number(el.dataset.count);
    paint();
  });
  onActivate(document, '#setPop [data-basis]', el => {
    STATE.basis = el.dataset.basis;
    paint();
  });

  /* FOUR DIGITS OR NOTHING. The field is text with inputmode numeric rather
     than type=number, because a spinner on a year is a control nobody uses and
     Safari's number input accepts "1e5". Anything that is not four digits is
     not a year, and an empty field is a valid answer — it means "no bound". */
  ['#popFrom', '#popTo'].forEach(sel => {
    const el = $(sel);
    if (!el) return;
    el.addEventListener('input', () => {
      el.value = el.value.replace(/\D/g, '').slice(0, 4);
      STATE[sel === '#popFrom' ? 'from' : 'to'] = el.value;
      summarise();
    });
  });

  onActivate(document, '#popReset', () => {
    STATE = clone(DEFAULTS);
    paint();
    say('conversation', 'Search settings are back to the defaults.');
  });

  onActivate(document, '#popDone', () => {
    closeAll();
    const btn = $(panelFor === 'resSetWrap' ? '#resSettings' : '#cmpSettings');
    if (btn) btn.focus();
  });

  /* A RESIZE WHILE IT IS OPEN CHANGES BOTH ANSWERS. Rotating a tablet or
     dragging a window shorter can turn the side with more room into the side
     with less, and a panel that measured once is a panel hanging off the
     screen. Only while open — there is nothing to place otherwise. */
  window.addEventListener('resize', () => {
    if (both.some(c => c.isOpen())) place();
  });

  paint();
}
