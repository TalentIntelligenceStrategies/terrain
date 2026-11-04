/* overlay — their live build, with and without a round's overlay.
 *
 *   node overlay.mjs --round 1 --item R1-08                    results, both themes
 *   node overlay.mjs --round 1 --item R1-25 --state home
 *   node overlay.mjs --round 1 --item R1-43 --hover 'main [class*="group cursor-pointer"]'
 *   node overlay.mjs --round 1 --item all --state record-scrolled
 *
 * ONE SEARCH PER RUN. The state is reached once; the before shots are taken in
 * both themes, then the overlay goes into the same page and the after shots
 * are taken. A fresh page per shot would cost their service four searches for
 * every picture, and a round shoots dozens.
 *
 * That makes the overlay prove one more thing a real patch must do: work when
 * it lands on a page that has already rendered. Overlay scripts therefore
 * handle what is already there and watch for what arrives.
 *
 * Reads design/overlays/round-N/<item>.css and <item>.js (either may be
 * absent); --item all injects every file, the combined patch.
 *
 * Options, applied before every shot:
 *   --hover <css>   pointer over the first match
 *   --focus <css>   keyboard focus on the first match (focus-visible applies)
 *   --scroll <px>   scroll the record pane (or, on states without one, the list)
 *   --clip x,y,w,h  crop
 *   --tag <name>    suffix for the file names, to keep variants apart
 *   --without <IDs> with --item all, leave these out (the unchosen variant)
 *   --live          ask their service, not round-N/replay/api.json
 *   --viewport <name> phone, floor, narrow, tablet, landscape (lib.mjs VIEWPORTS);
 *                   the file names carry it, desktop's do not
 *   --early         the after shots come from a second page with the overlay
 *                   injected before the state is reached. For an item that
 *                   acts on the way to its state (Find similar closing the
 *                   record, a sheet opening): injected after, it would shoot
 *                   the state it was meant to change. Under replay it is free.
 *
 * Writes overlay/<item>-<state>[-tag]-<theme>-before.png and -after.png. */
import path from 'node:path';
import { args, roundDir, open, die, readOverlay, injectOverlay, reachTheirs, THEIRS_STATES, viewport, replay } from './lib.mjs';

const a = args();
if (!a.item) die('--item <ID|all> is required');
const state = a.state || 'results';
if (!THEIRS_STATES.includes(state)) die(`--state is one of ${THEIRS_STATES.join(', ')}`);
const overlay = readOverlay(a.round, a.item, a.without ? String(a.without).split(',') : []);
const out = roundDir(a.round, 'overlay');
console.log('overlay files:', overlay.files.join(', '));

const vp = viewport(a.viewport || 'desktop');
let { browser, ctx, page } = await open({ viewport: vp.name });
/* Their API is answered from the round's recording unless --live; see replay() in lib.mjs. */
let rec = a.live ? null : await replay(ctx, a.round);
const listen = () => { page.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED/.test(m.text())) console.error('page:', m.text().slice(0, 200)); });
page.on('pageerror', e => console.error('page error:', e.message.slice(0, 200))); };
listen();
const settle = ms => page.waitForTimeout(ms);

/* THE THEME CONTROL IS CLICKED WHEN IT CAN BE, so the shot shows it in the
   right position. While a dialog, popover or menu is open a click would close
   it (behind a modal the control is inert anyway), so then the theme is
   written straight to data-theme on <html>, which is what their control does. */
async function setTheme(t) {
  const name = t === 'dark' ? 'Dark appearance' : 'Light appearance';
  const modal = await page.locator('[aria-modal="true"]:visible, [role="dialog"]:visible, [aria-expanded="true"]').count();
  const ok = !modal && await page.locator(`button[aria-label="${name}"]`).first()
    .click({ timeout: 1500, trial: false }).then(() => true).catch(() => false);
  if (!ok) await page.evaluate(t => { document.documentElement.dataset.theme = t; }, t);
  await page.mouse.move(1, vp.height - 1);
  await settle(700);
}

async function prep() {
  if (a.scroll) await page.evaluate(px => {
    const e = document.querySelector('#results-side-pane') || document.querySelector('main [class*="overflow-y-auto"]');
    if (e) e.scrollTop = +px;
  }, a.scroll);
  if (a.hover) await page.locator(a.hover).first().hover({ timeout: 4000 }).catch(e => console.error('hover:', e.message.split('\n')[0]));
  if (a.focus) {
    await page.keyboard.press('Shift');
    await page.locator(a.focus).first().focus().catch(e => console.error('focus:', e.message.split('\n')[0]));
  }
  await settle(400);
}

async function shot(theme, when) {
  await setTheme(theme);
  await prep();
  const tag = (vp.name !== 'desktop' ? `-${vp.name}` : '') + (a.tag ? `-${a.tag}` : '');
  const f = `${a.item}-${state}${tag}-${theme}-${when}.png`;
  const clip = a.clip ? (([x, y, width, height]) => ({ x, y, width, height }))(a.clip.split(',').map(Number)) : undefined;
  await page.screenshot({ path: path.join(out, f), clip });
  console.log('wrote', f);
}

await reachTheirs(page, state, a.query);
await shot('light', 'before');
await shot('dark', 'before');
if (a.early) {
  if (rec) console.log('replay:', JSON.stringify(rec.save()));
  await browser.close();
  ({ browser, ctx, page } = await open({ viewport: vp.name }));
  rec = a.live ? null : await replay(ctx, a.round);
  listen();
  await injectOverlay(ctx, overlay);
  await reachTheirs(page, state, a.query);
} else {
  if (overlay.css) await page.addStyleTag({ content: overlay.css }).then(h => h.evaluate(s => { s.id = 'terrain-overlay'; }));
  if (overlay.js) await page.addScriptTag({ content: overlay.js });
}
await settle(1200);
await shot('dark', 'after');
await shot('light', 'after');
if (rec) console.log('replay:', JSON.stringify(rec.save()));
await browser.close();
