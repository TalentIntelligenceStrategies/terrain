/* Serves their build from the mirror, with a round's patch on top, at 127.0.0.1.
 *
 *   node scripts/local.mjs --round 3 [--port 8766]
 *   then http://127.0.0.1:8766/<their path>/ (VuePat/ from round 4)
 *
 * The files are round-N/mirror/ (mirror.mjs). EVERY /api/ CALL IS ANSWERED
 * FROM round-N/replay/api.json; a key the recording lacks gets a 503 and is
 * logged, never fetched. index.html carries a CSP that keeps every request
 * on 127.0.0.1, so their session recording and analytics cannot fire.
 *
 * The patch is read from design/overlays/round-N/ on each page load, so an
 * overlay edit shows on reload. A cookie, set by the pill at bottom-left,
 * turns it off to show their build as it is. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { args, roundDir, die, readOverlay, baseOf } from './lib.mjs';

const a = args();
if (!a.round) die('--round N is required');
const port = Number(a.port || 8766);
const mirror = roundDir(a.round, 'mirror');
const meta = path.join(mirror, 'MIRROR.json');
if (!fs.existsSync(meta)) die(`no ${path.relative(process.cwd(), meta)}: run mirror.mjs --round ${a.round} first`);
const { version, files, from } = JSON.parse(fs.readFileSync(meta, 'utf8'));
const base = baseOf(from);
const store = JSON.parse(fs.readFileSync(path.join(roundDir(a.round, 'replay'), 'api.json'), 'utf8'));
const TELEMETRY = /posthog|\/rum\/v\d/i;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.json': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain' };

const CSP = `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:">`;
const PILL = on => `<style>
#terrain-local{position:fixed;z-index:2147483647;right:env(safe-area-inset-right,0px);top:62%;
display:flex;align-items:center;gap:6px;writing-mode:vertical-rl;min-width:28px;padding:12px 6px;border-radius:10px 0 0 10px;border:1px solid var(--border);border-right:0;
background:var(--card);color:var(--foreground);font:500 12px/1 var(--font-sans,system-ui);box-shadow:0 2px 10px rgba(0,0,0,.15);cursor:pointer}
/* a tab on the right edge, clear of their footers and of the record's actions */
#terrain-local b{font-weight:700}#terrain-local:focus-visible{outline:2px solid var(--ring);outline-offset:2px}</style>
<button id="terrain-local" type="button" aria-pressed="${on}" title="Local copy of v${version}. Turn the round ${a.round} patch ${on ? 'off' : 'on'}"
onclick="document.cookie='terrain_patch=${on ? 'off' : 'on'};path=/';location.reload()">Patch <b>${on ? 'on' : 'off'}</b></button>`;

function page(req) {
  let html = fs.readFileSync(path.join(mirror, base, 'index.html'), 'utf8')
    /* their drawing host, served from the mirror's copies */
    .replace(/https:\/\/(impat\.webpat\.co)\//g, '/_ext/$1/');
  const on = !/(?:^|;\s*)terrain_patch=off/.test(req.headers.cookie || '');
  let inject = CSP;
  if (on) {
    const { css, js, files } = readOverlay(a.round, 'all');
    const safe = s => s.replace(/<\/(script|style)/gi, '<\\/$1');
    /* As injectOverlay does it: the style kept in place by an observer, the
       scripts run once the document has parsed. */
    inject += `<script>(()=>{const css=${safe(JSON.stringify(css))};const put=()=>{if(!document.getElementById('terrain-overlay')){const s=document.createElement('style');s.id='terrain-overlay';s.textContent=css;document.head.appendChild(s);}};
document.addEventListener('DOMContentLoaded',()=>{put();new MutationObserver(put).observe(document.documentElement,{childList:true,subtree:true});
try{new Function(${safe(JSON.stringify(js))})();}catch(e){console.error('terrain overlay script failed',e);}});
console.info('terrain local: round ${a.round} patch, ${files.length} files');})();</script>`;
  }
  html = html.replace(/<head([^>]*)>/i, `<head$1>${inject}`).replace(/<\/body>/i, `${PILL(on)}</body>`);
  return html;
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://127.0.0.1:${port}`);
  if (TELEMETRY.test(u.pathname)) { res.writeHead(204); return res.end(); }
  if (u.pathname === '/' ) { res.writeHead(302, { Location: `/${base}/` }); return res.end(); }
  if (u.pathname.startsWith(`/${base}/api/`)) {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      const key = `${req.method} ${u.pathname}${u.search} ${body}`;
      const hit = store[key];
      if (!hit) {
        console.log(`not in the recording: ${req.method} ${u.pathname}${u.search.slice(0, 80)}`);
        res.writeHead(503, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: `not in the round ${a.round} recording` }));
      }
      const h = { ...hit.headers };
      for (const k of ['content-encoding', 'content-length', 'transfer-encoding', 'connection']) delete h[k];
      res.writeHead(hit.status, h);
      res.end(Buffer.from(hit.body, 'base64'));
    });
    return;
  }
  let p = decodeURIComponent(u.pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(mirror, p);
  if (!file.startsWith(mirror)) { res.writeHead(403); return res.end(); }
  const isPage = p === `/${base}/index.html` || (!path.extname(p) && p.startsWith(`/${base}`));
  if (isPage) {
    res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-store' });
    return res.end(page(req));
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    console.log(`not in the mirror: ${p}`);
    res.writeHead(404); return res.end();
  }
  res.writeHead(200, { 'Content-Type': files[p]?.type || TYPES[path.extname(p).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  const n = readOverlay(a.round, 'all').files.length;
  console.log(`their build ${version}, local, at http://127.0.0.1:${port}/${base}/ · round ${a.round} patch: ${n} files · ${Object.keys(store).length} recorded answers`);
});
