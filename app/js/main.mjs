/* main — boot, the engine seam, and the router.
 *
 * ═══ THE ORDERING CONTRACT ══════════════════════════════════════════════════
 * EVERY PARTIAL IS IN THE DOM BEFORE ANY init() RUNS. That single rule replaces
 * 55 scattered parse-time element captures in the prototype, each of which was
 * a `var x = $('#x')` at the top of a 13,000-line IIFE and each of which broke
 * differently when the markup moved.
 *
 * Every surface module exports `init(ctx)` and reads the DOM THERE, never at
 * module scope. A module that captures an element at import time dereferences
 * null the first time a partial is slower than an import, and that failure is
 * intermittent by construction — which is the worst kind to be handed.
 *
 * ═══ THE SEAM ══════════════════════════════════════════════════════════════
 * The import of demo/ below is the ONLY one in the tree. tools/check-app.py
 * fails the build if a second appears, so deleting demo/ leaves exactly one
 * broken line rather than a search. Delete it and app/ runs against NullEngine,
 * where every port refuses and every surface says "this did not run".
 */
import { $, $$ } from './core/dom.mjs';
import { assertEngine, NullEngine } from './ports.mjs';
import { bindEscape } from './core/esc-stack.mjs';
import { disarmAll } from './core/armed.mjs';
import { sayNothing } from './core/live-region.mjs';

/* ══════════════════════════════════════════════════════════════════════════
   THE DEMO SEAM · one import, and app/js/** holds no data by construction.
   Delete demo/ and delete this block; everything else keeps working, on
   NullEngine, saying that nothing ran.
   ══════════════════════════════════════════════════════════════════════════ */
import DemoEngine from '../../demo/engine.mjs';
const ENGINE_FROM_DEMO = DemoEngine;
/* ════════════════════════════════════════════════════════════════════════ */

const PARTIALS = ['masthead', 'conversation', 'surface', 'points', 'account',
                  'billing', 'help', 'parked'];

/* THE SURFACES. Each is imported for its side-effect-free init(); the order
   here is the order init() runs, and it is DOM order rather than dependency
   order because none of them may depend on another having run. */
const SURFACES = [
  ['masthead',     () => import('./surfaces/masthead.mjs')],
  ['conversation', () => import('./surfaces/conversation.mjs')],
  ['work',         () => import('./surfaces/work.mjs')],
  ['views',        () => import('./surfaces/views.mjs')],
  ['list',         () => import('./surfaces/list.mjs')],
  ['record',       () => import('./surfaces/record.mjs')],
  ['destinations', () => import('./surfaces/destinations.mjs')],
];

/* ── partial loading ──────────────────────────────────────────────────────
   REPLACED, NOT FILLED. The host div is swapped for the partial's own nodes,
   so `.stage > .view` is a real parent-child relationship. `.view` is
   `position:absolute; inset:0` against `.stage`, and a wrapper left in place
   would be one more element for a future selector to trip over. */
async function loadPartials() {
  const hosts = $$('[data-partial]');
  const jobs = hosts.map(async host => {
    const name = host.dataset.partial;
    const res = await fetch(`partials/${name}.html`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`partials/${name}.html → HTTP ${res.status}`);
    const tpl = document.createElement('template');
    tpl.innerHTML = await res.text();
    host.replaceWith(...tpl.content.childNodes);
  });
  await Promise.all(jobs);
}

/* ── the router ───────────────────────────────────────────────────────────
   One view at a time. `.is-leaving` keeps the outgoing view visible for its
   fade and `pointer-events:none` stops it eating the first wheel gesture over
   the arriving one — a leaving view is painted ABOVE the arriving one whenever
   it comes later in the DOM, which the work surface does and the conversation
   does not. */
const VIEWS = ['conversation', 'work', 'usage', 'account', 'billing', 'help'];

/* which hash lands on which view. A hash that names a STATE rather than a
   surface still has to resolve to one, or the router silently shows nothing. */
function viewForHash(h) {
  if (!h) return 'conversation';
  if (h.startsWith('set') || h === 'technology' || h === 'track' ||
      h.startsWith('drilldown')) return 'work';
  if (h.startsWith('usage')) return 'usage';
  if (h.startsWith('account')) return 'account';
  if (h.startsWith('billing')) return 'billing';
  if (h.startsWith('help')) return 'help';
  return 'conversation';
}

let current = null;
const listeners = [];

/** subscribe to route changes. Surfaces use this instead of reading the hash,
 *  so there is one parser of the hash in the tree and not seven. */
export function onRoute(fn) { listeners.push(fn); }

export function go(view) {
  if (view === current) return;
  const next = $(`.view[data-view="${view}"]`);
  if (!next) return;
  const prev = current && $(`.view[data-view="${current}"]`);

  /* EVERY ARMED FAILURE IS DISARMED ON A ROUTE, and the registry is what makes
     that whole rather than a hand-maintained list. A flag set by one surface
     and consumed by the next press of one control would otherwise fire on a
     founder who came back through the state list and pressed something
     unrelated. */
  disarmAll();
  sayNothing();

  if (prev) {
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    setTimeout(() => prev.classList.remove('is-leaving'), 240);
  }
  next.classList.add('is-active');
  current = view;
  document.documentElement.setAttribute('data-view', view);
  listeners.forEach(fn => { try { fn(view, location.hash.slice(1)); } catch (e) { console.error(e); } });
}

function route() {
  go(viewForHash(location.hash.slice(1)));
}

/* ── theme · design-language.md §10.4 ─────────────────────────────────────
   The stored choice is applied before first paint by the inline block in
   index.html. This is only the control. */
function applyTheme(next) {
  const root = document.documentElement;
  /* one frame with transitions off, so the change does not cross-fade every
     coloured property at once — one of the four !importants in the tree */
  root.classList.add('theme-switching');
  if (next === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', next);
  try {
    if (next === 'system') localStorage.removeItem('terrain-theme');
    else localStorage.setItem('terrain-theme', next);
  } catch (e) { /* a private window throws rather than returning null */ }
  requestAnimationFrame(() => requestAnimationFrame(
    () => root.classList.remove('theme-switching')));
}

/* ── boot ─────────────────────────────────────────────────────────────────── */
async function boot() {
  await loadPartials();

  /* AT MOUNT, NOT AT FIRST USE. A missing port is otherwise a TypeError at the
     moment a founder presses something, several surfaces into the product, and
     it reads as that surface being broken rather than as the engine being
     incomplete. */
  const engine = assertEngine(ENGINE_FROM_DEMO || NullEngine);

  const ctx = { engine, go, onRoute, applyTheme };

  /* imported in parallel, init()ed in order — the DOM is already whole, so the
     only thing order buys is predictable logging when one of them throws */
  const mods = await Promise.all(SURFACES.map(async ([name, load]) => {
    try { return [name, await load()]; }
    catch (e) { console.error(`surface ${name} failed to import`, e); return [name, null]; }
  }));
  for (const [name, mod] of mods) {
    if (!mod || typeof mod.init !== 'function') continue;
    try { mod.init(ctx); }
    catch (e) { console.error(`surface ${name} failed to init`, e); }
  }

  bindEscape();
  window.addEventListener('hashchange', route);
  route();

  document.documentElement.setAttribute('data-booted', '1');
}

boot().catch(err => {
  console.error(err);
  document.body.insertAdjacentHTML('afterbegin',
    `<pre style="margin:0;padding:24px;font:13px/1.6 ui-monospace,monospace;
      color:#7f1d1d;background:#fef2f2;border-bottom:4px solid #b91c1c;white-space:pre-wrap">` +
    `app/ did not boot.\n\n${err && err.message}\n\n` +
    `Serve the repository root over http and open /app/ — a module script is ` +
    `CORS-fetched and a file:// origin is opaque, so opening index.html from ` +
    `the filesystem cannot work.</pre>`);
});
