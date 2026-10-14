/* capture — every surface and state of one build, into the round folder.
 *
 *   node capture.mjs --round 2                  their live build
 *   node capture.mjs --round 2 --target ours    app/ on 127.0.0.1:8765
 *   node capture.mjs --round 2 --url <url>      any other copy
 *
 * Writes captures/<target>/NN-<state>-<theme>.png and captures/<target>/log.md:
 * the visible text of every open popover and the control labels per step,
 * because a label proves a control exists where a screenshot only suggests it.
 *
 * For their build it also saves the shipped bundle to bundle/, so a feature can
 * be told apart as ABSENT (no string anywhere) or BUILT AND NOT SHOWN (strings
 * present, nothing rendered). The September inventory found three of the second
 * kind that a screenshot alone would have recorded as missing. */
import fs from 'node:fs';
import path from 'node:path';
import { args, roundDir, open, click, search, setTheme, labels, openRecord, THEIRS, OURS_LOCAL, QUERY } from './lib.mjs';

const a = args();
const target = a.target || 'theirs';
const url = a.url || (target === 'ours' ? OURS_LOCAL : THEIRS);
const query = a.query || QUERY;
const dir = roundDir(a.round, 'captures', target);
const log = [`# Capture · ${target} · ${url}`, '', `Query: ${query}`, `Taken: ${new Date().toISOString()}`, ''];
let n = 0;

async function step(page, tag, fn) {
  try { await fn(); } catch (e) { log.push(`## ${tag}\n\nFAILED: ${e.message.split('\n')[0]}\n`); return; }
  n++;
  const file = `${String(n).padStart(2, '0')}-${tag}.png`;
  await page.screenshot({ path: path.join(dir, file) });
  /* the visible text beside each shot, so hidden.mjs can tell a string that
     is on screen from one that never is */
  fs.writeFileSync(path.join(dir, file.replace(/\.png$/, '.txt')), await page.evaluate(() => document.body.innerText).catch(() => ''));
  const open_ = await page.evaluate(() => [...document.querySelectorAll('[role=dialog],[role=menu],[role=listbox],dialog[open],[popover]')]
    .filter(e => e.offsetParent || e.matches(':popover-open'))
    .map(e => e.innerText.trim().replace(/\n+/g, ' ⏎ ').slice(0, 1200)).filter(Boolean));
  log.push(`## ${tag}`, '', `![](${file})`, '');
  if (open_.length) log.push('Open layers:', ...open_.map(t => `> ${t}`), '');
  log.push('Controls: ' + (await labels(page)).filter(l => !/^(Drawing|Figure) \d|more drawings|^Open US|^View details/.test(l)).join(' · '), '');
}

const esc = page => page.keyboard.press('Escape').then(() => page.waitForTimeout(400));

for (const theme of ['light', 'dark']) {
  const { browser, page, blocked } = await open({ theme });
  const t = `-${theme}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  await setTheme(page, theme);
  if (theme === 'light') {
    const version = await page.evaluate(() => (document.body.innerText.match(/v\d+\.\d+\.\d+/) || [''])[0]);
    log.push(`Version on the masthead: ${version || 'none printed'}`, '');
  }
  await step(page, 'home' + t, async () => {});
  await step(page, 'settings' + t, async () => { await click(page, /^Search settings$/); });
  await esc(page);
  await step(page, 'patent-number-mode' + t, async () => { if (!(await click(page, /^Patent number$/))) throw new Error('no patent-number mode'); });
  await click(page, /^Text$/);
  await step(page, 'results' + t, async () => { await search(page, url, query); await page.evaluate(() => scrollTo(0, 0)); });
  await step(page, 'results-scrolled' + t, async () => { await page.mouse.move(360, 600); await page.mouse.wheel(0, 2400); await page.waitForTimeout(1500); });
  await page.mouse.wheel(0, -9000);
  await step(page, 'sort' + t, async () => { await click(page, /^(Relevance|Sort the list)$/); });
  await esc(page);
  await step(page, 'filter' + t, async () => { if (!(await click(page, /^Filter$/))) throw new Error('no filter control'); });
  await esc(page);
  await step(page, 'group' + t, async () => { await click(page, /^Group the results$/, 20000); });
  await step(page, 'group-leaf' + t, async () => {
    const leaf = page.locator('[role=checkbox]:visible').first();
    if (!(await leaf.count())) throw new Error('no group leaf');
    await leaf.click(); await page.waitForTimeout(3000);
  });
  await esc(page);
  /* A FRESH SEARCH, NOT AN UNDO. Each build clears a picked group its own way,
     and a grouping panel left open covers the record on ours. */
  await search(page, url, query);
  await step(page, 'drawings-only' + t, async () => { await click(page, /^Drawings only$/, 6000); });
  await click(page, /^Details and drawings$/, 2000);
  await step(page, 'record' + t, async () => { await openRecord(page); await page.waitForTimeout(1500); });
  await step(page, 'record-scrolled' + t, async () => { await page.mouse.move(1080, 600); await page.mouse.wheel(0, 2000); await page.waitForTimeout(1500); });
  await page.mouse.wheel(0, -9000);
  await step(page, 'lightbox' + t, async () => {
    const f = page.locator('button[aria-label^="Open figure"]:visible, button[aria-label$="open it larger"]:visible').first();
    if (await f.count()) await f.click(); else throw new Error('no figure control in the record');
    await page.waitForTimeout(3000);
  });
  await esc(page);
  await step(page, 'export-menu' + t, async () => { if (!(await click(page, /^Export this record$/))) throw new Error('no record export'); });
  await esc(page);
  await step(page, 'star' + t, async () => {
    const s = page.locator('button[aria-label^="Star"]:visible').first();
    if (!(await s.count())) throw new Error('no star control');
    await s.click(); await page.waitForTimeout(800);
  });
  await step(page, 'find-similar' + t, async () => { if (!(await click(page, /^Find similar$/, 12000))) throw new Error('no find similar'); await page.evaluate(() => scrollTo(0, 0)); });
  await step(page, 'starred-set' + t, async () => { if (!(await click(page, /starred set/i, 3000))) throw new Error('no starred set'); });
  await page.setViewportSize({ width: 390, height: 844 });
  await step(page, 'phone' + t, async () => { await page.waitForTimeout(1500); });
  log.push(`PostHog requests blocked (${theme}): ${blocked.length}`, '');
  await browser.close();
}

fs.writeFileSync(path.join(dir, 'log.md'), log.join('\n'));
console.log(`captured ${n} states into ${path.relative(process.cwd(), dir)}`);

if (target === 'theirs' && !a.url) {
  const bdir = roundDir(a.round, 'bundle');
  const html = await (await fetch(THEIRS)).text();
  fs.writeFileSync(path.join(bdir, 'index.html'), html);
  const seen = new Set();
  const queue = [...html.matchAll(/_nuxt\/([A-Za-z0-9_-]+\.js)/g)].map(m => m[1]);
  while (queue.length) {
    const f = queue.shift();
    if (seen.has(f)) continue;
    seen.add(f);
    const js = await (await fetch(`${THEIRS}_nuxt/${f}`)).text();
    fs.writeFileSync(path.join(bdir, f), js);
    for (const m of js.matchAll(/["'`]\.\/([A-Za-z0-9_-]+\.js)["'`]/g)) queue.push(m[1]);
  }
  console.log(`saved ${seen.size} bundle files into ${path.relative(process.cwd(), bdir)}`);
}
