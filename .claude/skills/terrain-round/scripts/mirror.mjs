/* Saves a local copy of their build's static files, for local.mjs to serve.
 *
 *   node scripts/mirror.mjs --round 3
 *
 * Walks their live site through every THEIRS_STATES state, at desktop and at
 * phone, so the chunks a phone or a dialog loads on demand are fetched too.
 * EVERY /api/ CALL IS ANSWERED FROM round-N/replay/api.json AND NEVER FROM
 * THEIR SERVICE: a key the recording lacks is aborted and listed, not
 * fetched. What is saved is what any visitor's browser downloads (HTML,
 * _nuxt/, CSS, fonts, icons, drawing images), by path, under round-N/mirror/.
 * That folder is their code, so it stays in visual-reference/, untracked. */
import fs from 'node:fs';
import path from 'node:path';
import { args, roundDir, die, open, reachTheirs, THEIRS, THEIRS_STATES } from './lib.mjs';

const a = args();
if (!a.round) die('--round N is required');
const out = roundDir(a.round, 'mirror');
const store = JSON.parse(fs.readFileSync(path.join(roundDir(a.round, 'replay'), 'api.json'), 'utf8'));
const ORIGIN = new URL(THEIRS).origin;
const DRAWINGS = /^https:\/\/impat\.webpat\.co$/;
const saved = new Map(), missing = new Set(), foreign = new Set();
let version = null;

for (const vp of ['desktop', 'phone']) {
  for (const state of THEIRS_STATES) {
    const { browser, ctx, page } = await open({ viewport: vp });
    await ctx.route(/\/ipcembedding\/api\//, route => {
      const r = route.request(), u = new URL(r.url());
      const key = `${r.method()} ${u.pathname}${u.search} ${r.postData() || ''}`;
      const hit = store[key];
      if (hit) return route.fulfill({ status: hit.status, headers: hit.headers, body: Buffer.from(hit.body, 'base64') });
      missing.add(key.slice(0, 160));
      return route.abort();
    });
    page.on('response', async res => {
      const u = new URL(res.url());
      if (u.pathname.includes('/api/') || res.request().method() !== 'GET') return;
      if (res.status() !== 200) return;
      let p = decodeURIComponent(u.pathname);
      /* The drawings come from their image host (index.html's
         ipfsImageBaseUrl); they are kept under _ext/<host>/ and local.mjs
         points that setting at them. Any other host is listed, not kept. */
      if (u.origin !== ORIGIN) {
        if (!DRAWINGS.test(u.origin)) { foreign.add(u.origin + u.pathname); return; }
        p = `/_ext/${u.host}${p}`;
      } else {
        if (p.endsWith('/')) p += 'index.html';
        /* A client route (no extension) is their index.html again; keep one. */
        if (!path.extname(p)) return;
      }
      const body = await res.body().catch(() => null);
      if (!body) return;
      const file = path.join(out, p);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, body);
      saved.set(p, { type: res.headers()['content-type'] || '', bytes: body.length });
    });
    try {
      await reachTheirs(page, state);
      /* A row's drawings load as it comes into view, so walk the whole list
         once, or the copy shows "did not load" below the first screen. */
      if (state === 'results') {
        for (let i = 0; i < 80; i++) {
          const end = await page.evaluate(() => { scrollBy(0, innerHeight * 0.8); return innerHeight + scrollY >= document.body.scrollHeight - 4; });
          await page.waitForTimeout(500);
          if (end) break;
        }
        await page.waitForTimeout(2000);
      }
      version ??= await page.evaluate(() => (document.body.innerText.match(/v\d+\.\d+\.\d+/) || [])[0] || null);
    } catch (e) { console.log(`  ${vp} ${state}: did not finish (${e.message.split('\n')[0]})`); }
    console.log(`${vp} ${state}: ${saved.size} files so far`);
    await browser.close();
  }
}

fs.writeFileSync(path.join(out, 'MIRROR.json'), JSON.stringify({
  from: THEIRS, version, at: new Date().toISOString(),
  files: Object.fromEntries([...saved].sort()), notInRecording: [...missing], otherHosts: [...foreign],
}, null, 1));
console.log(`\nversion ${version} · ${saved.size} files in ${path.relative(process.cwd(), out)}`);
console.log(`API keys the recording lacks (aborted, never fetched): ${missing.size}`);
for (const k of missing) console.log(`  ${k}`);
console.log(`other hosts the page asked for: ${foreign.size}`);
for (const k of foreign) console.log(`  ${k}`);
