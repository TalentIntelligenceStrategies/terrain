/* capture-deck — the deck's product shots, from Innovue's live build, at 2×,
 * each cropped to ONE component.
 *
 *   node capture-deck.mjs --claims <dir>
 *
 * visual-reference/deck/demos.json lists the demos: [{tag, file, to, find,
 * record}], where `file` is a text file in <dir> holding the query as
 * published, `to` the latest filing year, `find` the numbers whose result
 * rows are cropped, and `record` the number whose record is opened and used as
 * the find-similar anchor. Both stay local, so no patent text or number enters
 * a tracked file. The first demo drives every shot.
 *
 * Writes visual-reference/deck/captures/NN-<shot>.png and log.md: the build's
 * version, the date, and every setting each shot was taken under, because a
 * rank on a slide is a fact about one search on one day.
 *
 * ONE COMPONENT PER SHOT, AND NEVER THE APP'S FOOTER. A full window spends
 * most of a slide on margins, and the footer carries the provider's wordmark,
 * which a deck does not print (docs/brief.md §3).
 *
 * THE CUTOFF IS THE YEAR BEFORE FILING. Their build takes a year and sends it
 * as 31 December, so the filing year itself lets the query patent and its own
 * family in at the top. platform.md §13.5 queues the full date. */
import fs from 'node:fs';
import path from 'node:path';
import { args, open, click, THEIRS, ROOT, die } from '../../terrain-round/scripts/lib.mjs';

const a = args();
if (!a.claims) die('--claims <dir> is required');
const DEMOS = JSON.parse(fs.readFileSync(path.join(ROOT, 'visual-reference', 'deck', 'demos.json'), 'utf8'));
const demo = DEMOS[0];
const dir = path.join(ROOT, 'visual-reference', 'deck', 'captures');
fs.mkdirSync(dir, { recursive: true });
const log = ['# Deck captures · ' + THEIRS, '', 'Taken: ' + new Date().toISOString(), ''];
let n = 0;
const shotName = tag => `${String(++n).padStart(2, '0')}-${tag}.png`;

const { browser, page } = await open({ theme: 'light', scale: 2, height: 1400 });
const settle = ms => page.waitForTimeout(ms);

/* A DRAWING STILL LOADING IS A GREY TILE, and a grey tile on a slide reads as
   a patent with no drawings. Wait for every image on screen, up to a limit. */
async function drawingsLoaded(limit = 25000) {
  await page.waitForFunction(() => [...document.images].filter(i => {
    const r = i.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight && r.width > 20;
  }).every(i => i.complete && i.naturalWidth > 0), null, { timeout: limit }).catch(() => null);
  await settle(800);
}

const scrollersToTop = () => page.evaluate(() => document.querySelectorAll('*').forEach(e => {
  if (e.scrollTop > 0 && e !== document.scrollingElement) e.scrollTop = 0;
}));

/* the smallest box around `text` (or the element `sel`) that is at least
   `minH` tall, clamped to the viewport; `maxH` cuts a tall panel to its top.
   Found by what it says rather than by a class their build may rename
   between rounds. */
async function boxAround({ text, sel, minH = 0, maxH = 0, scroll = true }) {
  return page.evaluate(([t, s, h, m, sc]) => {
    let el = s ? document.querySelector(s)
      : [...document.querySelectorAll('body *')].find(e =>
          e.children.length === 0 && e.textContent.includes(t) && e.offsetParent);
    while (el && el.getBoundingClientRect().height < h) el = el.parentElement;
    if (!el) return null;
    if (sc) el.scrollIntoView({ block: m ? 'start' : 'center' });
    const r = el.getBoundingClientRect();
    const x = Math.max(0, r.x - 8), y = Math.max(0, r.y - 8);
    const height = Math.min(m || r.height + 16, r.height + 16, innerHeight - y);
    return { x, y, width: Math.min(r.width + 16, innerWidth - x), height };
  }, [text || null, sel || null, minH, maxH, scroll]);
}

async function shoot(tag, box, note) {
  const f = shotName(tag);
  if (!box) { log.push(`## ${f}`, '', `SKIPPED: ${note} — component not found`, ''); return; }
  await page.screenshot({ path: path.join(dir, f), clip: box });
  log.push(`## ${f}`, '', note, '');
}

const query = fs.readFileSync(path.join(a.claims, demo.file), 'utf8').trim();

await page.goto(THEIRS, { waitUntil: 'networkidle', timeout: 60000 });
await settle(1500);
const version = await page.evaluate(() => (document.body.innerText.match(/v\d+\.\d+\.\d+/) || ['none printed'])[0]);
log.push('Build: ' + version, 'Viewport: 1440×1400 at 2×, light',
  'Field: Information & Communication Tech · all six offices · granted and applications · 100 results · Filed up to ' + demo.to, '');
await click(page, /^Light appearance$/, 300);
await click(page, /^Information & Communication Tech$/, 800);

/* home: the coverage table, then the composer with the claim in it */
await shoot('coverage', await boxAround({ text: 'Data coverage', minH: 300 }), 'The Data coverage table, home screen.');
await page.locator('textarea:visible').first().fill(query);
await scrollersToTop(); await settle(300);
await shoot('composer', await boxAround({ sel: 'textarea', minH: 200 }), `The composer, ${demo.file} pasted, before Search.`);

/* the settings, whole, then the date range alone */
await click(page, /^Search settings$/, 800);
await click(page, /^100$/, 300);
await click(page, /^Filed$/, 300);
await page.getByLabel(/^Latest (year|date)$/).fill(demo.to);
await page.getByLabel(/^Latest (year|date)$/).press('Tab');
await settle(400);
await scrollersToTop(); await settle(300);
await shoot('settings', await boxAround({ text: 'WHERE TO SEARCH', minH: 500, scroll: false }) || await boxAround({ text: 'Where to search', minH: 500, scroll: false }),
  `The search settings, filed up to ${demo.to}.`);
const dbox = await page.evaluate(() => {
  const label = [...document.querySelectorAll('body *')].find(e => e.children.length === 0 && /^date range$/i.test(e.textContent.trim()) && e.offsetParent);
  const inputs = [...document.querySelectorAll('input[aria-label^="Earliest"], input[aria-label^="Latest"]')];
  if (!label || !inputs.length) return null;
  const rs = [label, ...inputs].map(e => e.getBoundingClientRect());
  const x = Math.min(...rs.map(r => r.left)) - 16, y = Math.min(...rs.map(r => r.top)) - 16;
  return { x, y, width: Math.max(...rs.map(r => r.right)) - x + 16, height: Math.max(...rs.map(r => r.bottom)) - y + 16 };
});
await shoot('settings-dates', dbox, `The date range alone, filed up to ${demo.to}.`);

/* the search */
await click(page, /^Done$/, 400);
await Promise.all([
  page.waitForResponse(r => /GetPatentByText/.test(r.url()) && r.status() === 200, { timeout: 120000 }),
  click(page, /^Search$/, 0),
]);
await settle(9000);
await scrollersToTop(); await drawingsLoaded();
await shoot('results-top', await boxAround({ text: 'matched ·', minH: 900, maxH: 1180, scroll: false }), 'The result list, top rows.');

for (const num of demo.find) {
  await page.locator(`text=${num}`).first().scrollIntoViewIfNeeded();
  await drawingsLoaded();
  const rank = await page.evaluate(t => {
    const lines = document.body.innerText.split('\n'); const i = lines.findIndex(l => l.includes(t));
    return lines.slice(i).find(l => /^#\d+$/.test(l)) || '?';
  }, num);
  await shoot(`row-${num}`, await boxAround({ text: num, minH: 300 }), `${num} at ${rank}.`);
}

/* the record, opened by its title (the number is a link out to the source) */
await page.locator(`text=${demo.record}`).first().scrollIntoViewIfNeeded();
const row = await boxAround({ text: demo.record, minH: 300 });
await page.mouse.click(row.x + 60, row.y + 64);
await settle(4000);
await page.evaluate(() => { const p = document.querySelector('#results-side-pane'); if (p) p.scrollTop = 0; });
await drawingsLoaded();
await shoot('record', await boxAround({ sel: '#results-side-pane', scroll: false }), `The ${demo.record} record, its own pane.`);

/* find similar from that record: the list re-ordered around it */
await click(page, /^Find similar$/, 6000);
await scrollersToTop(); await drawingsLoaded();
await shoot('similar', await boxAround({ text: 'matched ·', minH: 900, maxH: 1180, scroll: false }), `The list after Find similar on ${demo.record}.`);

fs.writeFileSync(path.join(dir, 'log.md'), log.join('\n') + '\n');
console.log(log.join('\n'));
await browser.close();
