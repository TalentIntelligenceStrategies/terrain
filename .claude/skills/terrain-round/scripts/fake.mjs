/* Serves their build from the mirror, with every /api/ call answered from demo/.
 *
 *   node scripts/fake.mjs --round 3 [--port 8767] [--data corpus] [--patch [--visual R4-47,R4-48]]
 *   then http://127.0.0.1:8767/<their path>/ (VuePat/ from round 4)
 *
 * local.mjs answers from a recording, so only the recorded queries work. This
 * answers ANY query: each endpoint their build calls is rebuilt in their
 * response shape from demo/data.mjs, so their build runs on our fake data.
 * NOTHING IS FETCHED FROM THEIR SERVICE; an endpoint this file does not know
 * gets a 501 and is logged. The same CSP as local.mjs keeps every request on
 * 127.0.0.1.
 *
 * --patch lays the round's package over it AS INNOVUE APPLIES IT: apply.js,
 * built from design/overlays/round-N/ by the lines package.mjs uses (so it is
 * the zip's own file while the overlays are unchanged), run once their app has
 * mounted, as a console paste is. Every item, every load; an overlay edit
 * shows on reload. /package/ is the package's .md files.
 *
 * demo/ withholds almost every value (null renders a bar in app/), and their
 * build has no bar state, so a null becomes an unmistakably fake placeholder
 * here rather than an empty cell. Row 0 is the one populated ACME record. The
 * drawings are grey SVG frames that say "Fig. N"; none is a technical drawing.
 *
 * --data corpus answers from corpus/ instead: its hundred real records and
 * their drawings, so the build can be judged against real content. A search
 * ranks them by the words it shares with each title and abstract; Find similar
 * puts the record's own Google Patents neighbours first. corpus/ prints real
 * holder names and stays local: this reads it at run time and writes nothing.
 *
 * --visual names patch items a second tab turns off on their own (a cookie),
 * so a visual layer can be judged with the rest of the patch on. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { args, roundDir, die, ROOT, buildApply, baseOf } from './lib.mjs';
import { page as pkgPage } from './pkgview.mjs';

const a = args();
if (!a.round) die('--round N is required');
const port = Number(a.port || 8767);
const mirror = roundDir(a.round, 'mirror');
const meta = path.join(mirror, 'MIRROR.json');
if (!fs.existsSync(meta)) die(`no ${path.relative(process.cwd(), meta)}: run mirror.mjs --round ${a.round} first`);
const { version, files, from } = JSON.parse(fs.readFileSync(meta, 'utf8'));
const base = baseOf(from);
const demoPath = path.join(ROOT, 'demo', 'data.mjs');
if (!fs.existsSync(demoPath)) die('no demo/data.mjs: the fake answers are built from it');
const D = await import(demoPath);
const CORPUS = a.data === 'corpus';
const corpusDir = path.join(ROOT, 'corpus');
if (CORPUS && !fs.existsSync(path.join(corpusDir, 'data.mjs'))) die('no corpus/data.mjs: --data corpus reads it');
const C = CORPUS ? await import(path.join(corpusDir, 'data.mjs')) : null;
const VISUAL = String(a.visual || '').split(',').filter(Boolean);

const TELEMETRY = /posthog|\/rum\/v\d/i;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.json': 'application/json', '.ico': 'image/x-icon', '.txt': 'text/plain' };
const CSP = `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:">`;
/* ── the package ──────────────────────────────────────────────────────────── */
const odir = path.join(ROOT, 'design', 'overlays', `round-${a.round}`);
const zipName = fs.readdirSync(roundDir(a.round)).filter(f => /^terrain-handoff-.*\.zip$/.test(f)).sort().pop();
const tag = zipName ? zipName.replace(/^terrain-|\.zip$/g, '') : `round-${a.round}`;
const unzip = name => { try { return execFileSync('unzip', ['-p', path.join(roundDir(a.round), zipName), name], { maxBuffer: 1 << 26 }).toString('utf8'); } catch { return null; } };
const zipApply = a.patch && zipName ? unzip('overlays/apply.js') : null;
const overlayFiles = () => fs.readdirSync(odir).filter(f => /\.(css|js)$/.test(f)).sort()
  .map(name => ({ name, text: fs.readFileSync(path.join(odir, name), 'utf8') }));
const zipped = new Map();
/* Which items the working tree has changed since the zip, for the panel's head. */
function against() {
  if (!zipApply) return 'no package zip to compare';
  const files = overlayFiles();
  if (buildApply(a.round, tag, files) === zipApply) return `matches ${tag}`;
  const changed = new Set();
  for (const f of files) {
    if (!zipped.has(f.name)) zipped.set(f.name, unzip(`overlays/${f.name}`));
    if (zipped.get(f.name) !== f.text) changed.add(f.name.replace(/\.(css|js)$/, ''));
  }
  return `differs from ${tag}: ${[...changed].join(' ') || 'files added or removed'}`;
}

const INDICES = ['twb', 'twa', 'cnb', 'cna', 'usb', 'usa'];

/* ── demo/ in their shape ─────────────────────────────────────────────────── */
const rows = D.patentRows();
const PLACEHOLDER_ABSTRACT = 'Placeholder abstract. This row is fake demo data and describes no real patent.';
const PLACEHOLDER_CLAIM = 'Placeholder claim. This row is fake demo data and claims nothing.';
const ipcTheirs = s => s.replace(/\s+/, '').replace(/^(\w{4})(\d+)\//, (m, c, g) => `${c}${g.padStart(3, '0')}/`);
const COUNTRY = { us: 'US', cn: 'CN', tw: 'TW' };

/* One record: its row as the list gets it, and the fields only the record
   adds. `rank` is set per answer. */
function record({ docId, score, title, holder, inventors, filed, published, abstract, claims, ipc, drawings }) {
  const [index, pnRaw, apnRaw, kindCode] = docId.split('_');
  const list = {
    score, docId, pnRaw, sourceIndex: index, domain: 'all', title, mainIpc: ipc[0],
    applicants: holder, assignees: holder, apd: filed, abstract: [abstract], inventors,
    apnRaw, pubDate: published, priorityDate: filed,
  };
  const detail = {
    ...list, claims, ipcs: ipc, mainCpc: ipc[0], cpcs: ipc, currentMainCpc: ipc[0], currentCpcs: ipc,
    kindCode, applType: 'invention', patentCountry: COUNTRY[index.slice(0, 2)],
  };
  return { list, detail, drawings };
}

const demo = rows.map((row, i) => record({
  docId: i === 0 ? 'usb_12984117_18992410_B2' : `usb_${String(i).padStart(8, '0')}_9${String(i).padStart(7, '0')}_B2`,
  score: row.score,
  title: row.skim || `Placeholder patent title ${i}`,
  holder: row.holder === null ? [D.DEMO_HOLDER] : row.holder ? [row.holder] : [],
  inventors: i === 0 ? D.DEMO_RECORD.inventors : ['Placeholder Inventor'],
  filed: row.filed, published: row.published,
  abstract: i === 0 ? D.DEMO_ABSTRACT : PLACEHOLDER_ABSTRACT,
  claims: i === 0 ? D.DEMO_CLAIMS.map((c, n) => `${n + 1}. ${c}`) : [`1. ${PLACEHOLDER_CLAIM}`],
  ipc: (i === 0 ? D.DEMO_RECORD.ipc : ['B64U 00/00']).map(ipcTheirs),
  drawings: i === 0 ? 6 : (row.score * 1000 | 0) % 5,
}));

/* FIXTURES: the cases a card is about that demo/ has no row for, every one of
   them as plainly fake as the demo rows. They score just under row 0, so they
   sit on the first screen.
     a grant and its application, one apnRaw: R3-21's version tabs, R3-11
     claims that open with a preamble: R3-10
     a Taiwan record in Chinese: R3-52, and the CJK side of R3-22 and R3-11
     a title long enough to clamp, and no drawings: R3-22, R3-57 */
const fx = (o) => record({
  holder: [D.DEMO_HOLDER], inventors: ['Placeholder Inventor'], filed: '2020-03-12', published: '2022-05-10',
  abstract: PLACEHOLDER_ABSTRACT, claims: [`1. ${PLACEHOLDER_CLAIM}`], ipc: ['B64U010/00'], drawings: 3, ...o,
});
const fixtures = [
  fx({ docId: 'usb_00000901_90000901_B2', score: 0.9870, title: 'Placeholder grant with an earlier application', published: '2023-08-01' }),
  fx({ docId: 'usa_20210000901_90000901_A1', score: 0.9869, title: 'Placeholder grant with an earlier application', published: '2021-09-16' }),
  fx({ docId: 'usb_00000902_90000902_B1', score: 0.9860, title: 'Placeholder record whose claims open with a preamble',
    claims: ['We claim:', `1. ${PLACEHOLDER_CLAIM}`, '2. The placeholder of claim 1, further comprising nothing real.', '3. The placeholder of claim 1, wherein nothing is claimed.'] }),
  fx({ docId: 'twb_I000903_90000903_B', score: 0.9850, title: '佔位專利標題（示範資料，非真實專利）', holder: ['範例公司'], inventors: ['佔位發明人'],
    abstract: '這是示範用的佔位摘要，不描述任何真實專利。', claims: ['1. 一種佔位請求項，不主張任何內容。'] }),
  fx({ docId: 'usb_00000904_90000904_B2', score: 0.9840, drawings: 0,
    title: 'Placeholder title long enough to run past two lines on every width, so the clamp can be seen: a system and method for a placeholder apparatus with a placeholder assembly and a placeholder mount, described nowhere and claimed by no one' }),
];

/* ── corpus/ in their shape ───────────────────────────────────────────────── */
const INDEX = { 'US/Invention': 'usb', 'US/Application': 'usa', 'CN/Invention': 'cnb', 'CN/Application': 'cna', 'TW/Invention': 'twb', 'TW/Application': 'twa' };
const corpus = !CORPUS ? [] : C.ROWS.filter(r => INDEX[`${r.id.slice(0, 2)}/${r.kind}`]).map(r => {
  const m = r.id.match(/^([A-Z]{2})([A-Z]?\d+)([A-Z]\d?)$/);
  const index = INDEX[`${m[1]}/${r.kind}`];
  const pnRaw = index === 'usb' ? m[2].padStart(8, '0') : m[2];
  const rec = record({
    docId: `${index}_${pnRaw}_${String(r.appno || '').replace(/\D/g, '') || pnRaw}_${m[3]}`,
    score: 0, title: r.title, holder: r.holder ? [r.holder] : [], inventors: r.inventors || [],
    filed: r.filed, published: r.published, abstract: r.abstract || '',
    claims: r.claims || [], ipc: (r.ipc || []).map(ipcTheirs), drawings: (r.figures || []).length,
  });
  if (!r.abstract) rec.list.abstract = rec.detail.abstract = [];
  rec.id = r.id; rec.ipcMain = r.ipcMain; rec.ipcWords = r.ipcWords || {}; rec.similar = r.similar || []; rec.figures = r.figures || [];
  rec.words = new Set(`${r.title} ${r.abstract || ''}`.toLowerCase().match(/[a-z]{3,}/g) || []);
  return rec;
});
/* Words shared with the query, then a stable order, scored into the range
   their engine returns. */
function rank(text, first = []) {
  const q = new Set(String(text || '').toLowerCase().match(/[a-z]{3,}/g) || []);
  const hit = r => [...q].filter(w => r.words.has(w)).length;
  const pos = r => { const k = first.indexOf(r.id); return k < 0 ? Infinity : k; };
  return [...corpus].sort((x, y) => pos(x) - pos(y) || hit(y) - hit(x) || x.id.localeCompare(y.id))
    .map((r, k) => { r.list.score = Math.round((0.8862 - k * 0.0021) * 1e4) / 1e4; return r; });
}

const RECORDS = CORPUS ? corpus : [...demo, ...fixtures];
const byDoc = new Map(RECORDS.map(r => [r.list.docId, r]));
const byScore = [...RECORDS].sort((x, y) => y.list.score - x.list.score);
const results = (size, order = byScore) => order.slice(0, Math.min(size || 100, order.length)).map((r, k) => ({ ...r.list, rank: k + 1 }));

/* the same patents dealt into four groups of two, on a stable hash */
function classify(posted, head) {
  if (CORPUS) return classifyCorpus(posted, head);
  const spines = ['A', 'B', 'C', 'D'].map(s => ({ label: `Placeholder group ${s}`, nodes: [1, 2].map(n => ({ label: `Placeholder subgroup ${s}${n}`, members: [] })) }));
  posted.forEach((p, k) => {
    const n = Number(String(p.pnRaw || k).replace(/\D/g, '')) || k;
    spines[n % 4].nodes[Math.floor(n / 4) % 2].members.push({ ...p, alternatives: [] });
  });
  for (const sp of spines) {
    sp.nodes = sp.nodes.filter(n => n.members.length);
    for (const n of sp.nodes) n.repDocId = n.members[0].docId;
    sp.repDocId = sp.nodes[0]?.repDocId;
  }
  return { head, tookMs: 120, spines: spines.filter(s => s.nodes.length) };
}

/* corpus/: grouped by IPC subclass, then main group, under CPC's own words */
function classifyCorpus(posted, head) {
  const groups = new Map();
  for (const p of posted) {
    const r = byDoc.get(p.docId), main = r?.ipcMain || 'Unclassified';
    const sub = main.slice(0, 4), grp = main.split('/')[0];
    if (!groups.has(sub)) groups.set(sub, { label: r?.ipcWords?.[sub] ? `${sub} · ${r.ipcWords[sub].toLowerCase()}` : sub, nodes: new Map() });
    const g = groups.get(sub);
    if (!g.nodes.has(grp)) g.nodes.set(grp, { label: grp, members: [] });
    g.nodes.get(grp).members.push({ ...p, alternatives: [] });
  }
  const spines = [...groups.values()].map(g => {
    const nodes = [...g.nodes.values()].map(n => ({ ...n, repDocId: n.members[0].docId }));
    return { label: g.label, nodes, repDocId: nodes[0].repDocId };
  }).sort((x, y) => y.nodes.reduce((t, n) => t + n.members.length, 0) - x.nodes.reduce((t, n) => t + n.members.length, 0));
  return { head, tookMs: 120, spines };
}

const searches = new Map();
const newSearch = rec => { const id = crypto.randomBytes(8).toString('hex'); searches.set(id, rec); return id; };
const NOT_FOUND = { error: { code: 'PATENT_NOT_FOUND', message: '找不到來源專利', retryable: false } };

function answer(method, u, body) {
  const q = u.searchParams, ep = u.pathname.replace(`/${base}/api/`, '');
  const b = body ? JSON.parse(body) : {};
  switch (`${method} ${ep}`) {
    case 'GET health':
      return [200, { status: 'ok', opensearch: { ok: true, clusterStatus: 'green' }, vllm: { ok: true, model: 'fake-demo' } }];
    case 'GET Patent/GetPatentStats': {
      /* illustrative, like every figure in demo/ */
      const sources = INDICES.map(index => ({ index, count: 1000000, pubDate: '2026-11-01' }));
      return [200, { sources, total: sources.length * 1000000 }];
    }
    case 'POST Search/GetPatentByText': {
      const r = results(b.size, CORPUS ? rank(b.text) : byScore);
      const searchId = newSearch({ mode: 'by-text', text: b.text, domain: b.domain || 'all' });
      return [200, { mode: 'by-text', query: { text: b.text, size: b.size || 100, domain: b.domain || 'all', indices: b.indices || INDICES, useInstruct: true },
        total: RECORDS.length, tookMs: 640, results: r, searchId }];
    }
    case 'POST Search/GetPatentByPatentNo': {
      const want = String(b.patentNo || '').toUpperCase().replace(/^[A-Z]{2}(?=[IM]?\d)/, '').replace(/[^\dIM]|[A-Z]\d?$/g, '').replace(/^0+/, '');
      const hit = (b.docId && byDoc.get(b.docId)) || RECORDS.find(r => want && r.list.pnRaw.replace(/^0+/, '') === want);
      if (!hit) return [404, NOT_FOUND];
      const order = CORPUS ? rank(`${hit.list.title} ${hit.list.abstract.join(' ')}`, [hit.id, ...hit.similar]).filter(r => r !== hit) : byScore;
      const searchId = newSearch({ mode: 'by-patent', patentNo: b.patentNo, domain: b.domain || 'all' });
      return [200, { mode: 'by-patent', query: { patentNo: b.patentNo, size: b.size || 100, domain: b.domain || 'all', indices: b.indices || INDICES },
        source: { ...hit.list, rank: 0 }, total: RECORDS.length, tookMs: 640, results: results(b.size, order), searchId }];
    }
    case 'GET Search/GetSearchById': {
      const s = searches.get(q.get('searchId'));
      return s ? [200, s] : [404, { error: { code: 'SEARCH_NOT_FOUND', message: 'search not found', retryable: false } }];
    }
    case 'GET Patent/GetPatentDetail': {
      const r = byDoc.get(q.get('docId'));
      return r ? [200, { found: true, patent: { ...r.detail, rank: 1, score: 1 } }] : [404, { found: false }];
    }
    case 'GET Patent/GetPatentDrawings': {
      return [200, { docId: q.get('docId'), count: byDoc.get(q.get('docId'))?.drawings ?? 0 }];
    }
    /* their Rerank setting: one score per posted result, in order. The demo's
       own scores, so a rerank keeps the order it was given. */
    case 'POST Search/GetPatentRerank':
      return [200, { scores: (b.results || []).map(r => r.score) }];
    case 'POST Search/GetPatentClassify':
      return [200, classify(b.results || [], b.head || b.text || D.DEMO_IDEA)];
    case 'POST Patent/GetAssigneeStandardNames':
      return [200, { names: (b.names || []).map(original => ({ original, standard: original })), available: true }];
  }
  return null;
}

const frame = n => `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
<rect width="800" height="1000" fill="#F2F2F2"/><rect x="40" y="40" width="720" height="920" fill="none" stroke="#BDBDBD" stroke-width="4" stroke-dasharray="16 12"/>
<text x="400" y="500" font-family="system-ui,sans-serif" font-size="56" fill="#9E9E9E" text-anchor="middle">Fig. ${n}</text>
<text x="400" y="570" font-family="system-ui,sans-serif" font-size="24" fill="#9E9E9E" text-anchor="middle">placeholder drawing</text></svg>`;

const safe = s => s.replace(/<\/(script)/gi, '<\\/$1');

const VTAB = vis => `<style>#terrain-visual{position:fixed;z-index:2147483647;right:0;top:calc(62% + 120px);writing-mode:vertical-rl;padding:12px 6px;border-radius:10px 0 0 10px;
border:1px solid var(--border);border-right:0;background:var(--card);color:var(--foreground);font:500 12px/1 var(--font-sans,system-ui);box-shadow:0 2px 10px rgba(0,0,0,.15);cursor:pointer}
#terrain-visual b{font-weight:700}</style><button id="terrain-visual" type="button" aria-pressed="${vis}" title="Turn ${VISUAL.join(', ')} ${vis ? 'off' : 'on'}"
onclick="document.cookie='terrain_visual=${vis ? 'off' : 'on'};path=/';location.reload()">Visual <b>${vis ? 'on' : 'off'}</b></button>`;

/* --visual also brings a Search-fill tab: a choice still open, shown by eye.
   ink is the patch as written; the other two override it here and nowhere
   else, so the package is unaffected. */
const SEARCH = '.search-box-morph:has(.search-toolbar-line) button[aria-label="Search"]:not(:disabled):not([data-r410-empty])';
const FILLS = {
  ink: '',
  card: `${SEARCH}{--r4-fill:var(--card);color:var(--foreground)}${SEARCH}:hover{--r4-fill:var(--muted)}`,
  slate: `${SEARCH}{--r4-fill:#16191c;color:#f0f0f0}${SEARCH}:hover{--r4-fill:#2c3238}`,
};
const FTAB = fill => { const next = Object.keys(FILLS)[(Object.keys(FILLS).indexOf(fill) + 1) % 3];
  return `<style>#terrain-fill{position:fixed;z-index:2147483647;right:0;top:calc(62% + 240px);writing-mode:vertical-rl;padding:12px 6px;border-radius:10px 0 0 10px;
border:1px solid var(--border);border-right:0;background:var(--card);color:var(--foreground);font:500 12px/1 var(--font-sans,system-ui);box-shadow:0 2px 10px rgba(0,0,0,.15);cursor:pointer}
#terrain-fill b{font-weight:700}</style><style id="terrain-fill-css">${FILLS[fill]}</style><button id="terrain-fill" type="button" title="Search fill: ${fill}. Switch to ${next}"
onclick="document.cookie='terrain_searchfill=${next};path=/';location.reload()">Search <b>${fill}</b></button>`; };

function page(req) {
  let html = fs.readFileSync(path.join(mirror, base, 'index.html'), 'utf8')
    .replace(/https:\/\/(impat\.webpat\.co)\//g, '/_ext/$1/');
  html = html.replace(/<head([^>]*)>/i, `<head$1>${CSP}`);
  if (!a.patch) return html;
  /* The paste: apply.js as the zip carries it, run after their app has mounted. */
  const vis = VISUAL.length > 0 && !/(?:^|;\s*)terrain_visual=off/.test(req.headers.cookie || '');
  const apply = buildApply(a.round, tag, overlayFiles().filter(f => vis || !VISUAL.includes(f.name.replace(/\.(css|js)$/, ''))));
  const tail = `<script>(()=>{const paste=()=>{const s=document.createElement('script');s.textContent=${safe(JSON.stringify(apply))};document.body.appendChild(s);};
addEventListener('load',()=>{const t=setInterval(()=>{if(document.querySelector('#__nuxt')?.children.length){clearInterval(t);setTimeout(paste,300);}},50);});})();</script>`;
  const fill = (/(?:^|;\s*)terrain_searchfill=(\w+)/.exec(req.headers.cookie || '') || [])[1];
  const ftab = vis ? FTAB(FILLS[fill] !== undefined ? fill : 'ink') : '';
  return html.replace(/<\/body>/i, `${tail}${VISUAL.length ? VTAB(vis) : ''}${ftab}</body>`);
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, `http://127.0.0.1:${port}`);
  if (TELEMETRY.test(u.pathname)) { res.writeHead(204); return res.end(); }
  if (u.pathname === '/') { res.writeHead(302, { Location: `/${base}/` }); return res.end(); }
  if (u.pathname.startsWith(`/${base}/api/`)) {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end', () => {
      let out;
      try { out = answer(req.method, u, body); } catch (e) { console.log(`bad request: ${req.method} ${u.pathname} ${e.message}`); out = [400, { error: { code: 'BAD_REQUEST', message: e.message, retryable: false } }]; }
      if (!out) {
        console.log(`no fake answer: ${req.method} ${u.pathname}${u.search.slice(0, 80)}`);
        out = [501, { error: { code: 'NOT_FAKED', message: 'fake.mjs does not answer this endpoint', retryable: false } }];
      }
      /* a little latency, so their loaders show as they do live */
      setTimeout(() => {
        res.writeHead(out[0], { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(out[1]));
      }, req.method === 'POST' ? 600 : 120);
    });
    return;
  }
  if (a.patch && u.pathname.startsWith('/package/')) {
    const html = pkgPage(a.round, decodeURIComponent(u.pathname.slice(9)) || 'CHANGES.md');
    res.writeHead(html ? 200 : 404, { 'Content-Type': TYPES['.html'] });
    return res.end(html || 'not a package file');
  }
  if (a.patch && u.pathname.startsWith('/__pkg/r/')) {
    const base = roundDir(a.round), f = path.join(base, decodeURIComponent(u.pathname.slice(9)));
    if (!f.startsWith(base + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    return fs.createReadStream(f).pipe(res);
  }
  const drw = u.pathname.match(/^\/_ext\/impat\.webpat\.co\/v1\/ipfs\/drw\/[^/]+\/\d+\/(\d+)$/);
  if (drw && CORPUS) {
    const docId = decodeURIComponent(u.pathname.split('/')[6]);
    const figs = byDoc.get(docId)?.figures || [];
    const f = figs[Math.max(0, Number(drw[1]) - 1)] || figs[0];
    const file = f && path.join(corpusDir, f.local);
    if (!file || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' });
    return fs.createReadStream(file).pipe(res);
  }
  if (drw) {
    res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
    return res.end(frame(drw[1]));
  }
  let p = decodeURIComponent(u.pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(mirror, p);
  if (!file.startsWith(mirror)) { res.writeHead(403); return res.end(); }
  if (p === `/${base}/index.html` || (!path.extname(p) && p.startsWith(`/${base}`))) {
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
  console.log(CORPUS
    ? `their build ${version}, local, on corpus/ data, at http://127.0.0.1:${port}/${base}/ · ${RECORDS.length} real records`
    : `their build ${version}, local, on demo/ data, at http://127.0.0.1:${port}/${base}/ · ${RECORDS.length} fake patents (${fixtures.length} fixtures)`);
  if (a.patch) console.log(`round ${a.round} package, as pasted: ${against()} · cards at http://127.0.0.1:${port}/package/CHANGES.md`);
});
