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
