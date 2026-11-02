/* capture — every surface and state of one build, into the round folder.
 *
 *   node capture.mjs --round 2                  their live build
 *   node capture.mjs --round 2 --target ours    app/ on 127.0.0.1:8765
 *   node capture.mjs --round 2 --url <url>      any other copy
 *   node capture.mjs --round 3 --viewport phone  the same states on an emulated phone
 *   node capture.mjs --round 3 --viewport checks tablet, floor, narrow, landscape: one
 *                                                search, resized through each
 *
 * Desktop writes captures/<target>/; any other viewport captures/<target>-<viewport>/.
 * On a touch viewport every step's log also lists the controls under 44px and
 * the inputs under 16px (touchProbe), and the phone states add the composer
 * focused, the soft keyboard simulated by a shorter viewport, and the record
 * scrolled by its own scroller rather than by an aimed wheel.
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
import { args, roundDir, open, click, search, setTheme as clickTheme, labels, openRecord, viewport, scrollAt, touchProbe, VIEWPORTS, THEIRS, OURS_LOCAL, QUERY } from './lib.mjs';

const a = args();
const target = a.target || 'theirs';
const url = a.url || (target === 'ours' ? OURS_LOCAL : THEIRS);
const query = a.query || QUERY;
const vpName = a.viewport || 'desktop';
const checks = vpName === 'checks';
const vp = checks ? viewport('phone') : viewport(vpName);
const isTouch = !!vp.hasTouch;
const dir = roundDir(a.round, 'captures', vpName === 'desktop' ? target : `${target}-${vpName}`);
const log = [`# Capture · ${target} · ${url} · ${vpName}`, '', `Query: ${query}`, `Taken: ${new Date().toISOString()}`, ''];

/* On a phone the appearance control may sit in a menu, and a click that finds
   nothing would leave a "dark" shot light. Both builds key the theme on
   data-theme on <html>, which is what their control writes. */
async function setTheme(page, theme) {
  const hit = await page.locator(`button[aria-label="${theme === 'dark' ? 'Dark' : 'Light'} appearance"]:visible`).count();
  if (hit) return clickTheme(page, theme);
  await page.evaluate(t => { document.documentElement.dataset.theme = t; }, theme);
  log.push(`(theme ${theme} written to data-theme: no visible appearance control at ${vpName})`, '');
}
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
  if (isTouch) {
    const t = await touchProbe(page);
    log.push(`Viewport ${page.viewportSize().width}×${page.viewportSize().height} · sideways overflow ${t.overflowX}px`,
      `Under 44px (${t.small.length}): ${t.small.join(' · ') || 'none'}`,
      `Inputs under 16px: ${t.zoom.join(' · ') || 'none'}`, '');
  }
}

/* The checks pass: one search, the results and the record at every check
   width, by resizing one touch context. A width is a layout question, and a
   fresh search per width would be the same answer four times on their service. */
if (checks) {
  const sizes = ['tablet', 'floor', 'narrow', 'landscape'];
  const { browser, page, blocked } = await open({ viewport: 'phone', theme: 'light' });
  const to = async name => { const v = VIEWPORTS[name]; await page.setViewportSize({ width: v.width, height: v.height }); await page.waitForTimeout(1200); };
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  for (const s of sizes) { await to(s); await step(page, `home-${s}-light`, async () => { await page.evaluate(() => scrollTo(0, 0)); }); }
  await to('phone');
  await search(page, url, query);
  for (const s of sizes) {
    await to(s);
    await step(page, `results-${s}-light`, async () => { await page.keyboard.press('Escape'); await page.waitForTimeout(500); await page.evaluate(() => scrollTo(0, 0)); });
    await step(page, `record-${s}-light`, async () => { await openRecord(page); await page.waitForTimeout(1200); });
  }
  log.push(`PostHog requests blocked: ${blocked.length}`, '');
  await browser.close();
  fs.writeFileSync(path.join(dir, 'log.md'), log.join('\n'));
  console.log(`captured ${n} states into ${path.relative(process.cwd(), dir)}`);
  process.exit(0);
}

const esc = page => page.keyboard.press('Escape').then(() => page.waitForTimeout(400));

for (const theme of ['light', 'dark']) {
  const { browser, page, blocked } = await open({ theme, viewport: vpName });
  const t = `-${theme}`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  await setTheme(page, theme);
  if (theme === 'light') {
    const version = await page.evaluate(() => (document.body.innerText.match(/v\d+\.\d+\.\d+/) || [''])[0]);
    log.push(`Version on the masthead: ${version || 'none printed'}`, '');
  }
  await step(page, 'home' + t, async () => {});
  if (isTouch) {
    /* A real soft keyboard shrinks the visual viewport, not the layout one, so
       this overstates what a fixed bar does; the name says simulated. What it
       shows truly is whether the field and Search stay in reach above it. */
    await step(page, 'composer-focused' + t, async () => { await page.locator('textarea:visible').first().tap(); await page.waitForTimeout(600); });
    await step(page, 'keyboard-simulated' + t, async () => { await page.setViewportSize({ width: vp.width, height: vp.height - 336 }); await page.waitForTimeout(800); });
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.locator('textarea:visible').first().blur().catch(() => {});
  }
  await step(page, 'settings' + t, async () => { await click(page, /^Search settings$/); });
  await esc(page);
  await step(page, 'patent-number-mode' + t, async () => { if (!(await click(page, /^Patent number$/))) throw new Error('no patent-number mode'); });
  await click(page, /^Text$/);
  await step(page, 'results' + t, async () => { await search(page, url, query); await page.evaluate(() => scrollTo(0, 0)); });
  await step(page, 'results-scrolled' + t, async () => {
    if (isTouch) { log.push(`(results scrolled: ${await scrollAt(page, 2400)})`); }
    else { await page.mouse.move(360, 600); await page.mouse.wheel(0, 2400); }
    await page.waitForTimeout(1500);
  });
  if (isTouch) await scrollAt(page, -9000); else await page.mouse.wheel(0, -9000);
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
  await step(page, 'record-scrolled' + t, async () => {
    if (isTouch) { log.push(`(record scrolled: ${await scrollAt(page, 2000)})`); }
    else { await page.mouse.move(1080, 600); await page.mouse.wheel(0, 2000); }
    await page.waitForTimeout(1500);
  });
  if (isTouch) await scrollAt(page, -9000); else await page.mouse.wheel(0, -9000);
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
  if (!isTouch) {
    await page.setViewportSize({ width: 390, height: 844 });
    await step(page, 'phone' + t, async () => { await page.waitForTimeout(1500); });
  }
  log.push(`PostHog requests blocked (${theme}): ${blocked.length}`, '');
  await browser.close();
}

fs.writeFileSync(path.join(dir, 'log.md'), log.join('\n'));
console.log(`captured ${n} states into ${path.relative(process.cwd(), dir)}`);

if (target === 'theirs' && !a.url && vpName === 'desktop') {
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
  /* Their stylesheet, as entry.css whatever its hash: phase 4 reads the rule
     it overrides here before writing an overlay, and the JS alone does not
     say what a breakpoint does. */
  const css = [...new Set([...html.matchAll(/_nuxt\/(entry[A-Za-z0-9_.-]*\.css)/g)].map(m => m[1]))];
  for (const f of css) fs.writeFileSync(path.join(bdir, 'entry.css'), await (await fetch(`${THEIRS}_nuxt/${f}`)).text());
  console.log(`saved ${seen.size} bundle files${css.length ? ' and entry.css' : ' (no entry stylesheet linked)'} into ${path.relative(process.cwd(), bdir)}`);
}
