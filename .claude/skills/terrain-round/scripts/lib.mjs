/* Shared by every /terrain-round script.
 *
 * THE LIVE BUILD RECORDS SESSIONS, so every page this opens has PostHog and
 * their RUM collector (/rum/, OpenObserve, shipped by v1.0.36) blocked before
 * the first request. Our iterations are not their users.
 *
 * Paths are resolved from the repo root, never the cwd, so a script run from
 * anywhere writes into the same round folder. */
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
export const THEIRS = 'https://terrain.innovue.ltd/VuePat/';
/* The path their build is served under ('VuePat'), from its address. A mirror
   records the address it was taken from, so an older round's mirror still
   serves under its own path. */
export const baseOf = url => new URL(url).pathname.replace(/^\/|\/$/g, '');
export const BASE = baseOf(THEIRS);
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

/* The viewports a round reviews at. PHONE IS AN EMULATED DEVICE, NOT A NARROW
   WINDOW: isMobile makes Chromium honour the page's meta viewport and hasTouch
   makes (hover:hover) and (pointer:fine) false, so a hover-only control is
   missing here exactly as it is on a phone. A 390px desktop window would match
   every width query and still report a mouse. floor and narrow are the widths
   design-language.md §6 designs down to and wraps the masthead at. */
const IPHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const touch = { isMobile: true, hasTouch: true, userAgent: IPHONE_UA };
export const VIEWPORTS = {
  desktop:   { width: 1440, height: 900, scale: 1 },
  tablet:    { width: 820, height: 1180, scale: 2, ...touch },
  phone:     { width: 390, height: 844, scale: 3, ...touch },
  floor:     { width: 375, height: 667, scale: 2, ...touch },
  narrow:    { width: 320, height: 568, scale: 2, ...touch },
  landscape: { width: 844, height: 390, scale: 3, ...touch },
};
export function viewport(name = 'desktop') {
  if (!VIEWPORTS[name]) die(`--viewport is one of ${Object.keys(VIEWPORTS).join(', ')}`);
  return { name, ...VIEWPORTS[name] };
}

/* REPLAY: THEIR API, ANSWERED FROM A RECORDING. A round's search budget on
   their service is a few dozen, and an overlay round shoots hundreds of
   pictures at two viewports. Every request to their /api/ is keyed by
   method, path, query and body; a recorded answer is served from
   round-N/replay/api.json, and one that is missing goes to the network ONCE,
   is stored, and is counted out loud. The bundle, fonts and drawings still
   load live: they are static files, not searches.

   mode 'record' stores what it fetches; 'replay' also fetches what is missing
   (and stores it), but prints LIVE for each, so a run that should have cost
   nothing says when it did not. Call the returned save() before closing. */
export async function replay(ctx, round, { mode = 'replay' } = {}) {
  const file = path.join(roundDir(round, 'replay'), 'api.json');
  const store = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  let live = 0, served = 0, dirty = false;
  await ctx.route(new RegExp(`/${BASE}/api/`), async route => {
    const r = route.request(), u = new URL(r.url());
    const key = `${r.method()} ${u.pathname}${u.search} ${r.postData() || ''}`;
    const hit = store[key];
    if (hit) { served++; return route.fulfill({ status: hit.status, headers: hit.headers, body: Buffer.from(hit.body, 'base64') }); }
    live++;
    if (mode !== 'record') console.log(`LIVE (not in the recording): ${r.method()} ${u.pathname}`);
    const res = await route.fetch().catch(() => null);
    if (!res) return route.abort();
    const body = await res.body();
    store[key] = { status: res.status(), headers: res.headers(), body: body.toString('base64') };
    dirty = true;
    return route.fulfill({ response: res, body });
  });
  return {
    stats: () => ({ live, served }),
    /* Merged with what is on disk, never a rewrite of it: two runs saving at
       once would otherwise each drop the other's new entries. */
    save: () => {
      if (dirty) {
        const now = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
        for (const [k, v] of Object.entries(now)) if (!(k in store)) store[k] = v;
        const tmp = `${file}.${process.pid}`;
        fs.writeFileSync(tmp, JSON.stringify(store)); fs.renameSync(tmp, file);
      }
      return { live, served, keys: Object.keys(store).length };
    },
  };
}

/* scale is the device pixel ratio: 1 for desktop rounds, 2 for the deck's
   captures; a preset brings its own unless scale is given. */
export async function open({ viewport: vp, width, height, theme, scale } = {}) {
  const v = vp ? viewport(vp) : VIEWPORTS.desktop;
  const exe = process.env.TERRAIN_CHROME || undefined;
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const ctx = await browser.newContext({
    viewport: { width: width || v.width, height: height || v.height },
    deviceScaleFactor: scale || v.scale, locale: 'en-US', acceptDownloads: true,
    isMobile: !!v.isMobile, hasTouch: !!v.hasTouch, ...(v.userAgent ? { userAgent: v.userAgent } : {}),
    colorScheme: theme === 'dark' ? 'dark' : 'light',
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const TELEMETRY = /posthog|\/rum\/v\d/i;
  await ctx.route(TELEMETRY, r => r.abort());
  const page = await ctx.newPage();
  const blocked = [];
  page.on('requestfailed', r => { if (TELEMETRY.test(r.url())) blocked.push(r.url()); });
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
  if (state === 'group') {
    /* On a phone with round 3's patch the folded box holds no grouping
       control: it is in the opened box, so open it first. */
    if (!(await page.locator('button[aria-label="Group the results"]:visible').count())) {
      await page.locator('[data-search-line]').first().click().catch(() => {});
      await settle(800);
    }
    await click(page, /^Group the results$/, 20000);
  }
  if (state === 'record') await openRecord(page);
  if (state === 'scrolled') { await page.mouse.move(360, 600); await page.mouse.wheel(0, 2400); await page.waitForTimeout(2500); }
  if (state === 'phone') { await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(1500); }
}

/* Scroll whatever scrolls under a point, by dy. THE WHEEL IS AIMED, and a
   desktop script aims it at x=1080 for the record pane, which on a phone is off
   the screen: the wheel lands nowhere and the shot is the unscrolled state with
   a "scrolled" name. This finds the nearest scrollable ancestor of the element
   at (x, y) — the page itself when there is none — and moves it. */
export async function scrollAt(page, dy, x, y) {
  return page.evaluate(({ dy, x, y }) => {
    const vw = innerWidth, vh = innerHeight;
    let e = document.elementFromPoint(x ?? vw / 2, y ?? vh * 0.6);
    while (e && e !== document.body) {
      const s = getComputedStyle(e);
      if (/(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 1) { e.scrollTop += dy; return e.id || e.className.toString().slice(0, 40); }
      e = e.parentElement;
    }
    scrollBy(0, dy); return 'page';
  }, { dy, x, y });
}

/* What a thumb has to hit. Every visible control whose box is under 44 CSS px
   on either side (Apple's floor, and WCAG 2.5.5's AAA), plus every text input
   whose computed size is under 16px — iOS Safari zooms the page on focus
   below that, and nothing on the page can stop it but the size. */
export async function touchProbe(page) {
  return page.evaluate(() => {
    const vis = e => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < innerHeight && getComputedStyle(e).visibility !== 'hidden'; };
    const name = e => (e.getAttribute('aria-label') || e.innerText || e.getAttribute('title') || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 50);
    const small = [...document.querySelectorAll('button, a[href], [role=button], [role=checkbox], [role=radio], [role=tab], [role=menuitem], input, select, textarea, summary')]
      .filter(vis).map(e => ({ e, r: e.getBoundingClientRect() })).filter(({ r }) => r.width < 44 || r.height < 44)
      .map(({ e, r }) => `${name(e)} ${Math.round(r.width)}×${Math.round(r.height)}`);
    const zoom = [...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea, select')]
      .filter(vis).map(e => ({ e, fs: parseFloat(getComputedStyle(e).fontSize) })).filter(({ fs }) => fs < 16)
      .map(({ e, fs }) => `${e.getAttribute('aria-label') || e.placeholder || e.name || e.tagName} ${fs}px`);
    const over = document.documentElement.scrollWidth - innerWidth;
    return { small, zoom, overflowX: over > 0 ? over : 0 };
  });
}

/* THE RECORD IS A TOGGLE ON THEIR BUILD, and it opens the first result by
   itself after a search. Clicking that row again closes it, so the click only
   happens when no record is showing. */
export async function openRecord(page) {
  const isOpen = async () => (await page.locator('button[aria-label^="Close details"]:visible, button[aria-label^="Close this patent"]:visible').count()) > 0;
  if (await isOpen()) return;
  const r = page.locator('button[aria-label^="View details"]:visible, button[data-card-primary]:visible, button[aria-label*="Open the record"]:visible').first();
  if (await r.count()) { await r.click(); await page.waitForTimeout(4000); }
  if (!(await isOpen())) throw new Error('the record did not open');
}

/* A round's overlay, read from design/overlays/round-N/. item is one ID, or
   'all' for the combined patch the package ships.

   INJECTED BEFORE THE APP BOOTS AND KEPT THERE. Their build is a Nuxt SPA that
   re-renders on navigation, so a style appended once after load can be dropped
   by the first route change. The init script appends it at DOMContentLoaded and
   a MutationObserver puts it back if it is ever removed. */
export function readOverlay(round, item, without = []) {
  const dir = path.join(ROOT, 'design', 'overlays', `round-${round}`);
  if (!fs.existsSync(dir)) die(`${path.relative(ROOT, dir)} does not exist`);
  const files = fs.readdirSync(dir)
    /* A variant (R1-09a) also takes its item's shared files (R1-09.js). */
    .filter(f => /\.(css|js)$/.test(f) && (item === 'all' || [item, item.replace(/[a-z]$/, '')].includes(path.parse(f).name)))
    .filter(f => !without.includes(path.parse(f).name)).sort();
  if (!files.length) die(`no ${item}.css or ${item}.js in ${path.relative(ROOT, dir)}`);
  /* Scripts are joined with a ';' so one file's last statement cannot run
     into the next. Stylesheets must NOT be: a stray ';' at the top level of
     CSS swallows the next file's first rule, silently. */
  const read = (ext, sep) => files.filter(f => f.endsWith(ext))
    .map(f => `/* ${f} */\n` + fs.readFileSync(path.join(dir, f), 'utf8')).join(sep);
  return { css: read('.css', '\n'), js: read('.js', '\n;\n'), files };
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

/* The states the overlay and dom scripts can stop in on THEIR build, reached
   the same way by both, so a selector read from a dump is a selector the
   overlay shot exercises. One search per call (none for home and settings). */
export const THEIRS_STATES = ['home', 'settings', 'results', 'scrolled', 'record', 'record-scrolled',
  'loading', 'notfound', 'similar', 'lightbox', 'group'];

export async function reachTheirs(page, state, query) {
  const settle = ms => page.waitForTimeout(ms);
  async function submit(text, mode) {
    await page.goto(THEIRS, { waitUntil: 'networkidle', timeout: 60000 });
    await settle(1200);
    if (mode) await click(page, new RegExp(`^${mode}$`), 600);
    await page.locator('textarea:visible').first().fill(text);
    await Promise.all([
      page.waitForResponse(r => /\/api\/(Search|Patent)\//.test(r.url()), { timeout: 60000 }).catch(() => null),
      click(page, /^Search$/, 0),
    ]);
    await settle(5000);
  }
  if (state === 'home') { await page.goto(THEIRS, { waitUntil: 'networkidle', timeout: 60000 }); return settle(1500); }
  if (state === 'settings') {
    await page.goto(THEIRS, { waitUntil: 'networkidle', timeout: 60000 }); await settle(1200);
    return click(page, /^Search settings$/, 1000);
  }
  if (state === 'notfound') return submit(query || 'US12-345', 'Patent number');
  await submit(query || QUERY);
  if (state === 'scrolled') { await page.mouse.move(360, 600); await page.mouse.wheel(0, 2400); await settle(2500); }
  /* The record opens by itself only where the columns sit side by side. */
  if (['record', 'record-scrolled', 'similar'].includes(state)) await openRecord(page).catch(() => {});
  if (state === 'record-scrolled') {
    const pane = page.locator('#results-side-pane:visible');
    if (await pane.count()) await pane.evaluate(e => { e.scrollTop = 1400; }); else await scrollAt(page, 1400);
    await settle(800);
  }
  if (state === 'similar') await click(page, /^Find similar$/, 6000);
  if (state === 'lightbox') {
    /* Below 1080 no record opens by itself, and the row's figures are not the
       record's, so a phone opens the record first and takes its first figure. */
    const fig = () => page.locator('button[aria-label^="Open figure 1 "]:visible, button[aria-label^="Open figure"]:visible').first();
    if (!(await fig().count())) await openRecord(page);
    await fig().click({ timeout: 8000 }); await settle(2500);
  }
  if (state === 'group') {
    /* On a phone with round 3's patch the folded box holds no grouping
       control: it is in the opened box, so open it first. */
    if (!(await page.locator('button[aria-label="Group the results"]:visible').count())) {
      await page.locator('[data-search-line]').first().click().catch(() => {});
      await settle(800);
    }
    await click(page, /^Group the results$/, 20000);
  }
  if (state === 'loading') {
    /* Hold the NEXT search so the in-flight state can be shot, with the
       results already on screen still there: the state R1-09 is about. */
    await page.route(/\/api\/Search\//, async r => { await new Promise(res => setTimeout(res, 60000)); r.fallback().catch(() => {}); });
    await click(page, /^Expand search box/, 600);
    await click(page, /^Search$/, 1500);
  }
}

/* apply.js, the round's patch as one console paste: package.mjs writes it into
 * the zip and fake.mjs --patch runs it, so what we look at locally is the file
 * Innovue pastes, built by the same lines. `files` is [{ name, text }] of the
 * round's overlay files, sorted. */
export function buildApply(round, tag, files) {
  const ids = [...new Set(files.map(f => f.name.replace(/\.(css|js)$/, '')))];
  const items = ids.map(id => {
    const css = files.find(f => f.name === id + '.css');
    const js = files.find(f => f.name === id + '.js');
    return `    { id: ${JSON.stringify(id)},\n      css: ${JSON.stringify(css ? css.text : '')},\n`
      + `      js: ${js ? '() => {\n' + js.text.split('\n').map(l => '        ' + l).join('\n') + '\n      }' : 'null'} }`;
  });
  return `/* The round-${round} patch for your live build (${tag}). Open the build,
   paste this into the browser console (or save it as a DevTools snippet and
   run it), and the round shows as CHANGES.md describes it. Reload to remove it.

   To apply only some items, list them on the ONLY line below before pasting,
   for example ['${ids[0]}']. Empty applies every item. */
const ONLY = [];
(() => {
  if (window.__terrainRound${round}) { console.info('The round-${round} patch is already applied. Reload to remove it.'); return; }
  window.__terrainRound${round} = true;
  const ITEMS = [
${items.join(',\n')}
  ].filter(i => !ONLY.length || ONLY.includes(i.id));
  const CSS = ITEMS.map(i => i.css).join('\\n');
  const put = () => {
    if (document.getElementById('terrain-round-${round}')) return;
    const s = document.createElement('style');
    s.id = 'terrain-round-${round}';
    s.textContent = CSS;
    document.head.appendChild(s);
  };
  put();
  new MutationObserver(put).observe(document.documentElement, { childList: true, subtree: true });
  const run = () => {
    for (const i of ITEMS) if (i.js) try { i.js(); } catch (e) { console.warn(i.id, e); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  console.info('Applied: ' + ITEMS.map(i => i.id).join(' '));
})();
`;
}
