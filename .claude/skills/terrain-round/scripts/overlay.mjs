/* overlay — their live build, with and without a round's overlay, side by side.
 *
 *   node overlay.mjs --round 2 --item R2-05                  results state, both themes
 *   node overlay.mjs --round 2 --item R2-05 --state home
 *   node overlay.mjs --round 2 --item all --state record
 *
 * Reads design/overlays/round-N/<item>.css and <item>.js (either may be absent).
 * --item all injects every file in the folder: the package's combined patch,
 * shot once before the round closes, because two overlays that each look right
 * alone can still collide.
 *
 * States: home · results · scrolled · group · record · phone.
 * Writes overlay/<item>-<state>-<theme>-before.png and -after.png. */
import path from 'node:path';
import { args, roundDir, open, reach, setTheme, die, readOverlay, injectOverlay, THEIRS, QUERY } from './lib.mjs';

const a = args();
if (!a.item) die('--item <ID|all> is required');
const state = a.state || 'results';
const overlay = readOverlay(a.round, a.item);
const out = roundDir(a.round, 'overlay');
console.log('overlay files:', overlay.files.join(', '));

for (const theme of ['light', 'dark']) {
  for (const when of ['before', 'after']) {
    const { browser, ctx, page } = await open({ theme });
    if (when === 'after') await injectOverlay(ctx, overlay);
    page.on('console', m => { if (m.type() === 'error' && /terrain overlay/.test(m.text())) console.error(m.text()); });
    await page.goto(THEIRS, { waitUntil: 'networkidle' });
    await setTheme(page, theme);
    await reach(page, THEIRS, state, a.query || QUERY);
    const f = `${a.item}-${state}-${theme}-${when}.png`;
    await page.screenshot({ path: path.join(out, f) });
    console.log('wrote', path.relative(process.cwd(), path.join(out, f)));
    await browser.close();
  }
}
