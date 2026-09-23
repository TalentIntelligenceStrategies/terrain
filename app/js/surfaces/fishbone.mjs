/* fishbone — the grouping panel. platform.md §4.4.
 *
 * IT IS NAVIGATION, NOT ANALYSIS, and that is the whole of why it survived a
 * pivot that deleted twelve widgets. It states no finding, carries no caption
 * and draws no conclusion: it groups what came back so a set of two hundred
 * can be walked through in pieces, and selecting a branch filters the list.
 * The moment it gains a sentence saying what the shape MEANS it has become the
 * thing brief.md §1 puts outside the product.
 *
 * TWO LEVELS AND NO MORE. A third is a taxonomy — the authored artifact IPtech
 * wants before the first search and the thing a founder cannot produce.
 *
 * SELECTING A BRANCH IS A REQUEST. The client holds twenty rows and never the
 * whole set, so it cannot filter to a branch it can only partly see; `facets`
 * takes the leaf ids and hands back a fresh first page. That also means the
 * count on the badge and the count above the list come from the same place.
 */
import { $, esc } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { roving } from '../core/roving.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { bump, stale } from '../core/generation.mjs';
import { say } from '../core/live-region.mjs';

let ENGINE = null;
let LOADED = false;          /* asked for once per result set */
const PICKED = new Set();    /* leaf ids the founder has selected */
let rove = null;

/* ── rendering ───────────────────────────────────────────────────────────── */

/* THE SPINE IS A HEADING, NOT A CONTROL. Only leaves are selectable, because
   only leaves have a count the engine can filter by — a spine that filtered to
   the union of its leaves would be a third thing to explain for no new act. */
function treeHTML(tree) {
  if (!tree.spines || !tree.spines.length) {
    return '<p class="fb-thin t-body">There are too few results to group.</p>';
  }
  return '<div class="fb-head t-micro">Grouped by approach</div>'
    + '<ul class="fb-spines">'
    + tree.spines.map(sp =>
        '<li class="fb-spine">'
        + '<h4 class="fb-spine-h t-micro">' + esc(sp.label) + '</h4>'
        + '<ul class="fb-leaves">'
        + sp.leaves.map(lf =>
            '<li>'
            /* THE WHOLE LABEL IS ON THE CONTROL even though two lines of it
               show. aria-label carries the count with the name, because a
               screen reader announcing "Neural networks" without "ten" has
               dropped the only quantity on the control; `title` gives the
               pointer user the untruncated text without a round trip. */
            + '<button class="fb-leaf" type="button" role="checkbox"'
            + ' data-leaf="' + esc(lf.id) + '"'
            + ' title="' + esc(lf.label) + '"'
            + ' aria-label="' + esc(lf.label) + ', ' + lf.n
            + (lf.n === 1 ? ' patent' : ' patents') + '"'
            + ' aria-checked="' + (PICKED.has(lf.id) ? 'true' : 'false') + '">'
            /* THE COUNT IS PART OF THE NAME, not a decoration beside it: a
               screen reader announcing "Rotor and propeller" without "nine"
               has dropped the only quantity on the control. */
            + '<span class="fb-leaf-n fig fig-s" aria-hidden="true">' + lf.n + '</span>'
            + '<span class="fb-leaf-l" aria-hidden="true">' + esc(lf.label) + '</span>'
            + '</button></li>').join('')
        + '</ul></li>').join('')
    + '</ul>';
}

/* ONE TAB STOP FOR THE WHOLE PANEL. Fourteen leaves between the list and the
   attribution is not navigation, it is an obstacle — core/roving.mjs exists
   for exactly this and this is its caller. */
function armRoving() {
  const host = $('#fishWrap');
  if (!host) return;
  if (rove) rove.destroy();
  rove = roving(host, '.fb-leaf', { orientation: 'vertical' });
  rove.refresh(0);
}

/* ── the chips above the list ────────────────────────────────────────────── */

/* REMOVABLE, AND THEY LIVE ABOVE THE RESULTS rather than inside the panel.
   The panel can be hidden; the filter it applied cannot be, or the founder is
   looking at a shortened list with nothing on screen saying why. */
function paintChips(labels) {
  const wrap = $('#fbChips');
  if (!wrap) return;
  wrap.hidden = PICKED.size === 0;
  wrap.innerHTML = [...PICKED].map(id =>
    '<button class="fb-chip" type="button" data-unpick="' + esc(id) + '"'
    + ' aria-label="Stop showing only ' + esc(labels.get(id) || 'this branch') + '">'
    + '<span>' + esc(labels.get(id) || 'Branch') + '</span>'
    + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
    + ' stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
    + '</button>').join('');
}

const LABELS = new Map();

/* ── requests ────────────────────────────────────────────────────────────── */

async function load() {
  const host = $('#fishWrap');
  if (!host || LOADED) return;
  LOADED = true;
  const token = bump('cluster');
  waitOn(host, 200);
  const res = await ENGINE.cluster({});
  if (stale('cluster', token)) return;
  if (!res.ok) {
    LOADED = false;
    /* THE LIST IS UNTOUCHED AND STAYS USABLE. A grouping that did not arrive
       is a panel that failed, not a search that failed. */
    failWith(host, 'The grouping could not be built.',
      res.retryable ? () => { LOADED = false; load(); } : null);
    return;
  }
  LABELS.clear();
  (res.data.spines || []).forEach(sp => sp.leaves.forEach(lf => LABELS.set(lf.id, lf.label)));
  landIn(host, treeHTML(res.data));
  armRoving();
}

async function applyGroups() {
  const groups = [...PICKED];
  paintChips(LABELS);
  const res = await ENGINE.facets({ facets: {}, groups });
  if (!res.ok) {
    say('list', 'The results could not be filtered. Nothing changed.');
    return;
  }
  /* list.mjs owns the rows; it listens for this rather than being called, so
     the panel never reaches into the list's DOM. */
  window.dispatchEvent(new CustomEvent('terrain:refiltered', { detail: res.data }));
  say('list', groups.length
    ? res.data.matched + (res.data.matched === 1 ? ' patent in' : ' patents in')
      + (groups.length === 1 ? ' this branch.' : ' these branches.')
    : 'Showing every result again.');
}

/* ── wiring ──────────────────────────────────────────────────────────────── */

export function init(ctx) {
  ENGINE = ctx.engine;

  /* asked for the first time the panel is shown, not on every search — a
     grouping nobody opened is a run nobody asked for. */
  window.addEventListener('terrain:grouping-shown', load);

  /* A NEW SEARCH INVALIDATES BOTH the tree and the selection. A branch chip
     surviving into a different result set would filter by a category that was
     computed over patents that are no longer there. */
  window.addEventListener('terrain:searched', () => {
    LOADED = false;
    PICKED.clear();
    LABELS.clear();
    paintChips(LABELS);
    const host = $('#fishWrap');
    if (host && !host.hidden) load();
  });

  onActivate(document, '.fb-leaf', el => {
    const id = el.getAttribute('data-leaf');
    const on = el.getAttribute('aria-checked') !== 'true';
    el.setAttribute('aria-checked', String(on));
    if (on) PICKED.add(id); else PICKED.delete(id);
    applyGroups();
  });

  onActivate(document, '#fbChips [data-unpick]', el => {
    const id = el.getAttribute('data-unpick');
    PICKED.delete(id);
    const leaf = document.querySelector('.fb-leaf[data-leaf="' + id + '"]');
    if (leaf) leaf.setAttribute('aria-checked', 'false');
    applyGroups();
  });
}
