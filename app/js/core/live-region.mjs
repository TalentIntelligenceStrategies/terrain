/* live-region — one assertive region, four polite ones, and the 60ms.
 *
 * THE REGIONS LIVE IN THE SHELL, NOT IN A PARTIAL. A live region inside markup
 * that gets replaced stops announcing: the browser watches a NODE, and a new
 * node carrying the same id is a different node with no history. That is the
 * bug app/index.html exists to make impossible, and it is the one thing the
 * file split would otherwise have introduced for free.
 *
 * THE ASSERTIVE ONE CARRIES FAILURE ALONE. An assertive region that also
 * carries routine confirmations trains the listener to ignore it, and then the
 * one message that had to interrupt does not. design-language.md §7.
 */
import { $ } from './dom.mjs';

const POLITE = {
  conversation: '#sayConversation',
  list:         '#sayList',
  views:        '#sayViews',
  destination:  '#sayDestination',
};

/* A LIVE REGION RE-SET TO THE STRING IT ALREADY HOLDS is a mutation several
 * screen readers do not announce. So a SECOND IDENTICAL failure would be
 * silent -- which is precisely the case that matters, because the founder has
 * just pressed the same button again and needs to know it failed again rather
 * than that nothing happened. Clearing first, then writing on the next tick,
 * makes the second one as audible as the first. */
const REANNOUNCE_MS = 60;

function write(node, text) {
  if (!node) return;
  const next = text || '';
  if (!next) { node.textContent = ''; return; }
  if (node.textContent === next) {
    node.textContent = '';
    setTimeout(() => { node.textContent = next; }, REANNOUNCE_MS);
    return;
  }
  node.textContent = next;
}

/** Announce a failure. Assertive, and the only thing that speaks assertively. */
export function sayFailure(text) {
  write($('#alertRegion'), text);
}

/**
 * Announce something routine in one of the four polite regions.
 *
 * UNHIDE BEFORE WRITING, ALWAYS. `[hidden]` keeps a node out of the
 * accessibility tree, so a write to a hidden region is a write nothing is
 * watching -- and unhiding afterwards announces nothing, because the mutation
 * already happened. The four shell regions are never hidden, so this is here
 * for any region a caller passes in.
 */
export function say(which, text) {
  const node = typeof which === 'string' ? $(POLITE[which] || which) : which;
  if (node && node.hidden) node.hidden = false;
  write(node, text);
}

/** Clear every region. Called on a state entry so nothing carries over. */
export function sayNothing() {
  sayFailure('');
  for (const sel of Object.values(POLITE)) write($(sel), '');
}
