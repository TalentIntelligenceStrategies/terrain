/* popover — one floating panel, one trigger, and the four things every one of
 * them has to get right.
 *
 * ═══ WHY THIS IS A CORE MODULE AND NOT A THIRD COPY ════════════════════════
 * There were two, written independently, each private to the surface that
 * needed it: masthead.mjs's `menu()` and list.mjs's `lmMenu()`. They differed
 * in the one thing that does not matter — which element carries the open class
 * — and agreed on the four that do: set aria-expanded, register with the
 * escape stack, close on an outside click, move focus in. A third copy was the
 * point at which one of them would start drifting from the others in a way
 * nobody would notice, because a popover that forgets ONE of those four still
 * opens and closes correctly under a mouse.
 *
 * ═══ THERE IS NO MODAL HERE AND THIS IS NOT ONE ════════════════════════════
 * 13-inline-confirm.css states the rule: no modal, no <dialog>, no slide-over.
 * So this deliberately does NOT trap focus, does NOT dim the page, and does
 * NOT mark anything behind it inert. It is a disclosure anchored to a control.
 * The page stays live behind it and Escape closes the most recent one, which
 * is what esc-stack exists to make safe.
 *
 * ═══ THE OUTSIDE CLICK IS A DOCUMENT LISTENER, NOT A BACKDROP ══════════════
 * A full-viewport node to catch a click is how the deleted scrim justified
 * itself for a month after nothing referenced it — and a dead node at a high
 * z-index is one visibility flip away from covering the product. The document
 * hears the click for itself.
 */
import { push, drop } from './esc-stack.mjs';
import { focusQuietly } from './focus.mjs';

/* Exclusive groups. Two panels anchored to the same 48px bar overlap whatever
   is in them, so a group name means "only one of us at a time". Panels with no
   group do not close each other — a settings panel on the composer and a sort
   menu in a bar three hundred pixels away are not competing for the same air. */
const GROUPS = new Map();

/* The default is deliberately wide: whatever the panel's first focusable thing
   is, that is where the keyboard should land. A panel a keyboard cannot reach
   is a panel that is not there. */
const FIRST =
  '[role="menuitem"],[role="menuitemradio"],[role="menuitemcheckbox"],' +
  'button:not([disabled]),a[href],input:not([disabled]),select,textarea';

/**
 * popover({btn, panel, key, ...}) → {open, close, isOpen}
 *
 * `key` is the escape-stack key and must be unique in the document.
 * `host` is what carries `openClass` — the panel's parent by default, `#app`
 * for the masthead pair, because their CSS is written against an ancestor.
 */
/* ══ KEEPING THE PANEL ON SCREEN, AND WHY IT IS HERE AND NOT IN CSS ════════
 * Every panel in the product is positioned by CSS from its own trigger —
 * `.pop-down{top:calc(100% + var(--s-8))}` and a `left:0` or `right:0` — and
 * that is right until the trigger is close enough to an edge that the panel
 * hangs off it. Measured before this existed: the grouping panel ran 139px
 * past the right edge at 320px, and the account menu 52px past the LEADING
 * edge at 768px, where the masthead wraps and the profile button starts a new
 * row. `.view-work{overflow:hidden}` and `.app{overflow:hidden}` mean no
 * scrollbar appears to say so — the content is simply gone.
 *
 * NO MEDIA QUERY CAN DO THIS. The breakpoint would have to encode where each
 * trigger happens to sit, and the masthead's wrap moves three of them; the
 * clipping measured at 640, 700, 719, 740, 768, 820 and 860 but NOT at 480,
 * 560 or 390, because which row the button lands on decides it. A width cap
 * is necessary and was applied to `.pop` — it is the POSITION that is left.
 *
 * IT MEASURES LAYOUT, NOT THE TRANSFORM. The open animation starts at
 * `translateY(-4px) scale(.97)`, so getBoundingClientRect() on the panel
 * during the first frame returns a box 3% narrow and mid-flight.
 * offsetLeft/offsetWidth are layout values and ignore transforms; the
 * offsetParent's own rect turns them back into viewport coordinates.
 *
 * PHYSICAL left/right AND NOT THE LOGICAL PAIR, deliberately: a viewport edge
 * is physical, and so is the overflow being corrected. */
const EDGE = 12;

/* EXPORTED, because two panels in the product do not come through popover().
   masthead.mjs's menu() and list.mjs's lmMenu() are the two independent copies
   this module's header says it was written to replace, and that consolidation
   was never finished — they are the two that measured worst. Sharing the
   clamp is not the migration; it is the one line of it that could not wait. */
export function clampIntoView(panel) {
  panel.style.left = '';
  panel.style.right = '';
  const parent = panel.offsetParent;
  if (!parent) return;

  const base = parent.getBoundingClientRect().left + panel.offsetLeft;
  const width = panel.offsetWidth;
  const room = document.documentElement.clientWidth;

  let shift = 0;
  if (base + width > room - EDGE) shift = (room - EDGE) - (base + width);
  /* the leading edge wins a fight with the trailing one: a panel too wide for
     the window is read from its start, not from its end. */
  if (base + shift < EDGE) shift = EDGE - base;
  if (!shift) return;

  const used = parseFloat(getComputedStyle(panel).left);
  if (Number.isNaN(used)) return;
  panel.style.left = (used + shift) + 'px';
  panel.style.right = 'auto';
}

export function popover(opts) {
  const { btn, panel, key } = opts || {};
  if (!btn || !panel || !key) return null;

  const host = opts.host || panel.parentElement;
  const openClass = opts.openClass || 'is-open';
  const firstFocus = opts.firstFocus || FIRST;
  const group = opts.group || null;

  if (!host) return null;

  const isOpen = () => host.classList.contains(openClass);

  const close = () => {
    if (!isOpen()) return false;
    host.classList.remove(openClass);
    btn.setAttribute('aria-expanded', 'false');
    /* cleared rather than kept: the window may be a different size next time,
       and a stale inline left would survive the resize that invalidated it. */
    panel.style.left = '';
    panel.style.right = '';
    drop(key);
    if (typeof opts.onClose === 'function') opts.onClose();
    return true;
  };

  const open = () => {
    if (isOpen()) return;
    if (group) {
      const peers = GROUPS.get(group);
      if (peers) peers.forEach(c => { if (c !== api) c.close(); });
    }
    host.classList.add(openClass);
    btn.setAttribute('aria-expanded', 'true');
    push(key, close);
    if (typeof opts.onOpen === 'function') opts.onOpen();
    /* AFTER onOpen, not before: the grouping panel builds its branch list in
       that callback, and a panel measured while empty is a panel measured at
       the wrong width. */
    clampIntoView(panel);
    const el = panel.querySelector(firstFocus);
    if (el) focusQuietly(el);
  };

  const api = { open, close, isOpen };

  if (group) {
    if (!GROUPS.has(group)) GROUPS.set(group, new Set());
    GROUPS.get(group).add(api);
  }

  /* THE TRIGGER SAYS WHAT IT DOES BEFORE IT IS PRESSED. aria-expanded on a
     control with no aria-controls announces a disclosure whose target nothing
     names; both settings buttons shipped exactly that way, collapsed forever. */
  btn.setAttribute('aria-expanded', 'false');
  if (panel.id && !btn.hasAttribute('aria-controls')) {
    btn.setAttribute('aria-controls', panel.id);
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    isOpen() ? close() : open();
  });

  document.addEventListener('click', e => {
    if (!isOpen()) return;
    if (!panel.contains(e.target) && !btn.contains(e.target)) close();
  });

  /* A MENU CLOSES ON A PICK; A FORM DOES NOT. Choosing a sort order is the
     whole interaction and the panel has no reason to stay. Choosing a
     jurisdiction is one of six things the founder came here to set, and a
     panel that vanished on the first of them would have to be reopened five
     times. */
  if (opts.closeOnPick) panel.addEventListener('click', () => close());

  return api;
}

/* ══ THE INFO NOTE, AND IT HAD NO DRIVER AT ALL ════════════════════════════
 * `.info` shipped as markup and a stylesheet and nothing else: `.info.is-open
 * .info-pop` was the only rule that revealed the panel and no line in app/js
 * ever wrote `is-open`. The one instance in the product — the results
 * heading's (i), carrying what the relevance score means — has never opened
 * since the day it was added. It reads as a working control: it has a hover
 * state, an :active scale and an aria-expanded="false" hard-coded in the
 * partial, which is exactly what makes a dead disclosure hard to see.
 *
 * NOTHING ABOUT THE PATTERN NEEDED INVENTING — popover() already carries the
 * four things it has to get right, and `.info` is shaped for it: the panel's
 * parent is the host and `is-open` is the default open class. What was
 * missing was the call.
 *
 * IT WIRES EVERY .info IN A ROOT rather than taking ids, because these are
 * notes rather than named controls and a surface may hold several. The key
 * comes off the button's accessible name, which is what makes two notes on
 * one surface distinct on the escape stack.
 */
export function infoPopovers(root = document) {
  return [...root.querySelectorAll('.info')].map(host => {
    const btn = host.querySelector('.info-btn');
    const panel = host.querySelector('.info-pop');
    if (!btn || !panel) return null;
    const key = 'info:' + (btn.getAttribute('aria-label') || panel.id || 'note');
    return popover({ btn, panel, key, host });
  }).filter(Boolean);
}
