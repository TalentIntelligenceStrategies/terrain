/* dom — dump their live markup for one state, so overlay selectors are written
 * against what renders rather than guessed from a screenshot.
 *
 *   node dom.mjs --round 1 --state results
 *
 * Writes dom/<state>.html (the whole document after the state settles),
 * dom/<state>-vars.json (every custom property on :root, light and dark) and
 * dom/<state>-outline.txt (one line per element: tag, aria-label, classes,
 * box), which is what is actually read. One search per run. */
import fs from 'node:fs';
import path from 'node:path';
import { args, roundDir, open, reachTheirs, replay } from './lib.mjs';

const a = args();
const state = a.state || 'results';
const out = roundDir(a.round, 'dom');
/* --viewport phone dumps the markup a phone gets: their breakpoints render a
   different tree, and an overlay selector read from the desktop dump can miss. */
const vpn = a.viewport && a.viewport !== 'desktop' ? a.viewport : '';
const { browser, ctx, page } = await open({ viewport: a.viewport });
const rec = a.live ? null : await replay(ctx, a.round);
await reachTheirs(page, state, a.query);

const vars = {};
for (const theme of ['light', 'dark']) {
  await page.evaluate(t => { document.documentElement.dataset.theme = t; }, theme); await page.waitForTimeout(500);
  vars[theme] = await page.evaluate(() => {
    const o = {}, cs = getComputedStyle(document.documentElement);
    for (const sh of document.styleSheets) {
      let rules; try { rules = sh.cssRules; } catch { continue; }
      for (const r of rules) if (r.style) for (const p of r.style) if (p.startsWith('--')) o[p] = cs.getPropertyValue(p).trim();
    }
    return o;
  });
}
await page.evaluate(() => { document.documentElement.dataset.theme = 'light'; });

fs.writeFileSync(path.join(out, `${state}${vpn ? '-' + vpn : ''}.html`), await page.content());
fs.writeFileSync(path.join(out, `${state}${vpn ? '-' + vpn : ''}-vars.json`), JSON.stringify(vars, null, 1));
const outline = await page.evaluate(() => {
  const lines = [];
  const walk = (el, d) => {
    if (d > 60) return;
    const r = el.getBoundingClientRect();
    /* A zero box is not a hidden subtree: display:contents wrappers report none
       and their children render. Skip the line, keep walking; only an element
       that is not rendered at all ends the branch. */
    if (getComputedStyle(el).display === 'none') return;
    const zero = r.width === 0 && r.height === 0 && el.tagName !== 'BODY';
    const cls = typeof el.className === 'string' ? el.className.trim().replace(/\s+/g, ' ') : '';
    const attrs = ['id', 'aria-label', 'role', 'title', 'data-state', 'aria-pressed', 'aria-selected', 'aria-expanded']
      .map(k => el.getAttribute(k) ? `${k}="${el.getAttribute(k).slice(0, 60)}"` : '').filter(Boolean).join(' ');
    const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').slice(0, 50);
    if (!zero) lines.push(`${'  '.repeat(d)}<${el.tagName.toLowerCase()}${attrs ? ' ' + attrs : ''}${cls ? ` class="${cls.slice(0, 160)}"` : ''}> [${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)}]${txt ? ' "' + txt + '"' : ''}`);
    if (el.tagName === 'SVG' || el.tagName === 'svg') return;
    for (const c of el.children) walk(c, d + 1);
  };
  walk(document.body, 0);
  return lines.join('\n');
});
fs.writeFileSync(path.join(out, `${state}${vpn ? '-' + vpn : ''}-outline.txt`), outline);
console.log('wrote', state, outline.split('\n').length, 'lines,', Object.keys(vars.light).length, 'vars');
if (rec) console.log('replay:', JSON.stringify(rec.save()));
await browser.close();
