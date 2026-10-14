/* Shared by every /terrain-round script.
 *
 * THE LIVE BUILD RECORDS SESSIONS, so every page this opens has PostHog
 * blocked before the first request. Our iterations are not their users.
 *
 * Paths are resolved from the repo root, never the cwd, so a script run from
 * anywhere writes into the same round folder. */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
export const THEIRS = 'https://pi.innovue.ltd/ipcembedding/';
export const OURS_LOCAL = 'http://127.0.0.1:8765/app/';
export const QUERY = 'A semiconductor package with a through-silicon via and a heat spreader that reduces warpage';

export function args() {
  const out = {};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    const k = a[i].slice(2), v = a[i + 1];
    if (v === undefined || v.startsWith('--')) out[k] = true; else { out[k] = v; i++; }
  }
  return out;
}

export function roundDir(n, ...sub) {
  if (!n) die('--round N is required');
  const d = path.join(ROOT, 'visual-reference', 'innovue-build', `round-${n}`, ...sub);
  fs.mkdirSync(d, { recursive: true });
  return d;
}

export function die(msg) { console.error(`refused: ${msg}`); process.exit(1); }

export async function open({ width = 1440, height = 900, theme } = {}) {
  const exe = process.env.TERRAIN_CHROME || undefined;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const ctx = await browser.newContext({
    viewport: { width, height }, locale: 'en-US', acceptDownloads: true,
    colorScheme: theme === 'dark' ? 'dark' : 'light',
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  await ctx.route(/posthog/i, r => r.abort());
  const page = await ctx.newPage();
  const blocked = [];
  page.on('requestfailed', r => { if (/posthog/i.test(r.url())) blocked.push(r.url()); });
  return { browser, ctx, page, blocked };
}

/* Click the first visible control whose accessible name matches. Their build
   and ours both label controls well, so labels are the stable handle; class
   names in a Nuxt bundle are not. */
export async function click(page, re, wait = 1500) {
  const els = await page.locator('button:visible, a:visible, [role=menuitem]:visible, [role=option]:visible, [role=checkbox]:visible, [role=radio]:visible').all();
  for (const e of els) {
    const label = ((await e.getAttribute('aria-label')) || (await e.innerText().catch(() => '')) || (await e.getAttribute('title')) || '').trim();
    if (!re.test(label)) continue;
    try { await e.click({ timeout: 4000 }); } catch { await e.click({ force: true, timeout: 3000 }).catch(() => null); }
    await page.waitForTimeout(wait);
    return label;
  }
  return null;
}

export async function search(page, url, query = QUERY, settle = 15000) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.locator('textarea:visible').first().fill(query);
  await click(page, /^Search$/, settle);
}

/* The named states a script can stop in. Both builds label the controls the
   same way, which is what lets one helper drive either. */
export const STATES = ['home', 'results', 'scrolled', 'group', 'record', 'phone'];
export async function reach(page, url, state, query = QUERY) {
  if (!STATES.includes(state)) die(`--state is one of ${STATES.join(', ')}`);
  if (state === 'home') { await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(1500); return; }
  await search(page, url, query);
  if (state === 'group') await click(page, /^Group the results$/, 20000);
  if (state === 'record') await openRecord(page);
  if (state === 'scrolled') { await page.mouse.move(360, 600); await page.mouse.wheel(0, 2400); await page.waitForTimeout(2500); }
  if (state === 'phone') { await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(1500); }
}

/* THE RECORD IS A TOGGLE ON THEIR BUILD, and it opens the first result by
   itself after a search. Clicking that row again closes it, so the click only
   happens when no record is showing. */
export async function openRecord(page) {
  const isOpen = async () => (await page.locator('button[aria-label^="Close details"]:visible, button[aria-label^="Close this patent"]:visible').count()) > 0;
  if (await isOpen()) return;
  const r = page.locator('button[aria-label^="View details"]:visible, button[aria-label*="Open the record"]:visible').first();
  if (await r.count()) { await r.click(); await page.waitForTimeout(4000); }
  if (!(await isOpen())) throw new Error('the record did not open');
}

/* A round's overlay, read from design/overlays/round-N/. item is one ID, or
   'all' for the combined patch the package ships.

   INJECTED BEFORE THE APP BOOTS AND KEPT THERE. Their build is a Nuxt SPA that
   re-renders on navigation, so a style appended once after load can be dropped
   by the first route change. The init script appends it at DOMContentLoaded and
   a MutationObserver puts it back if it is ever removed. */
export function readOverlay(round, item) {
  const dir = path.join(ROOT, 'design', 'overlays', `round-${round}`);
  if (!fs.existsSync(dir)) die(`${path.relative(ROOT, dir)} does not exist`);
  const files = fs.readdirSync(dir)
    .filter(f => /\.(css|js)$/.test(f) && (item === 'all' || path.parse(f).name === item)).sort();
  if (!files.length) die(`no ${item}.css or ${item}.js in ${path.relative(ROOT, dir)}`);
  const read = ext => files.filter(f => f.endsWith(ext))
    .map(f => `/* ${f} */\n` + fs.readFileSync(path.join(dir, f), 'utf8')).join('\n;\n');
  return { css: read('.css'), js: read('.js'), files };
}

export async function injectOverlay(ctx, { css, js }) {
  await ctx.addInitScript(({ css, js }) => {
    const put = () => {
      if (css && !document.getElementById('terrain-overlay')) {
        const s = document.createElement('style');
        s.id = 'terrain-overlay';
        s.textContent = css;
        document.head.appendChild(s);
      }
    };
    document.addEventListener('DOMContentLoaded', () => {
      put();
      new MutationObserver(put).observe(document.documentElement, { childList: true, subtree: true });
      if (js) { try { new Function(js)(); } catch (e) { console.error('terrain overlay script failed', e); } }
    });
  }, { css, js });
}

export async function setTheme(page, theme) {
  await click(page, theme === 'dark' ? /^Dark appearance$/ : /^Light appearance$/, 1200);
}

export async function labels(page) {
  return page.evaluate(() => [...new Set([...document.querySelectorAll('button,a,[role=menuitem],[role=checkbox]')]
    .filter(e => e.offsetParent)
    .map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 100))
    .filter(Boolean))]);
}
