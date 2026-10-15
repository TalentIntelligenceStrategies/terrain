/* package — assemble a round's delta package. Refuses before it writes.
 *
 *   node package.mjs --round 2 --tag handoff-2026-11-02
 *   node package.mjs --round 2 --tag handoff-2026-11-02 --base handoff-2026-10-04
 *
 * --base defaults to the newest handoff-* tag older than --tag.
 *
 * Reads visual-reference/innovue-build/round-N/package/CHANGES.md (written in
 * phase 6) and writes round-N/terrain-handoff-<date>.zip next to it:
 *
 *   CHANGES.md   as written, and every other .md in package/ beside it
 *   images/      every image CHANGES.md links, and only those
 *   contract/    the diff of ports.mjs and components.md since --base, plus
 *                anything put in round-N/package/contract/ by hand
 *   code/        the app/ and demo/ files changed since --base, at --tag,
 *                with app.diff and demo.diff
 *   docs/        design-language.md and components.md when they changed, at
 *                --tag, and docs.diff. brief.md and platform.md are ours and
 *                do not go (platform.md §13.3)
 *   overlays/    design/overlays/round-N/ at --tag, plus all.css, all.js and
 *                apply.js, the whole patch as one console paste, or any items
 *                of it
 *
 * EVERY REFUSAL IS SOMETHING THAT MUST BE TRUE BEFORE INNOVUE OPENS IT, the
 * same shape as tools/publish-pages.py: a dirty tree (the package would not be
 * the tag), a missing tag, a failing gate, a CHANGES.md that links an image
 * that is not there or not in the round folder, or a zip that already exists. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { ROOT, args, die } from './lib.mjs';

const a = args();
if (!a.tag || !/^handoff-\d{4}-\d{2}-\d{2}$/.test(a.tag)) die('--tag handoff-YYYY-MM-DD is required');
const git = (...x) => execFileSync('git', x, { cwd: ROOT, encoding: 'utf8' }).trim();
const fail = [];

if (git('status', '--porcelain')) fail.push('the working tree is dirty; commit first, so the package is the tag');
const tags = git('tag', '-l', 'handoff-*', '--sort=creatordate').split('\n').filter(Boolean);
if (!tags.includes(a.tag)) fail.push(`tag ${a.tag} does not exist; tag the commit first`);
const base = a.base || tags.filter(t => t !== a.tag).filter(t => t < a.tag).pop();
if (!base || !tags.includes(base)) fail.push(`no base tag older than ${a.tag}`);

for (const [cmd, ...rest] of [['python3', 'tools/check-app.py'], ['python3', 'tools/sync-tokens.py', '--check']]) {
  const r = spawnSync(cmd, rest, { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) fail.push(`${rest.join(' ')} failed:\n${(r.stdout + r.stderr).trim().split('\n').slice(-6).join('\n')}`);
}

if (!a.round) die('--round N is required');
const rdir = path.join(ROOT, 'visual-reference', 'innovue-build', `round-${a.round}`);
const pdir = path.join(rdir, 'package');
const changes = path.join(pdir, 'CHANGES.md');
const images = [];
/* EVERY DOCUMENT IN package/ SHIPS: CHANGES.md and whatever it links to
   (MEASUREMENTS.md, TOKENS.md, CHECKLIST.md). A .src.md is the source a
   document was built from and stays here. */
const docsMd = fs.existsSync(pdir) ? fs.readdirSync(pdir).filter(f => f.endsWith('.md') && !f.endsWith('.src.md')) : [];
if (!fs.existsSync(changes)) fail.push(`${path.relative(ROOT, changes)} does not exist; phase 6 writes it`);
for (const doc of docsMd) {
  const text = fs.readFileSync(path.join(pdir, doc), 'utf8');
  for (const m of text.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const p = path.resolve(pdir, m[1]);
    if (!p.startsWith(rdir + path.sep)) fail.push(`${doc} links ${m[1]}, which is outside the round folder`);
    else if (!fs.existsSync(p)) fail.push(`${doc} links ${m[1]}, which does not exist`);
    else if (!images.some(i => i.link === m[1])) images.push({ link: m[1], file: p });
  }
}
const zip = path.join(rdir, `terrain-${a.tag}.zip`);
if (fs.existsSync(zip)) fail.push(`${path.relative(ROOT, zip)} already exists`);

if (fail.length) { console.error('refused, nothing written:\n- ' + fail.join('\n- ')); process.exit(1); }

/* ── every check passed; now, and only now, write ───────────────────────── */
const stage = path.join(rdir, `.stage-${a.tag}`);
fs.rmSync(stage, { recursive: true, force: true });
const put = (rel, data) => { const f = path.join(stage, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };

/* images are flattened into images/ and CHANGES.md is rewritten to match, so
   the zip does not carry the shape of our local folders */
const used = new Set(), renamed = {};
for (const im of images) {
  let name = path.basename(im.file);
  while (used.has(name)) name = '_' + name;
  used.add(name);
  put(`images/${name}`, fs.readFileSync(im.file));
  renamed[im.link] = `images/${name}`;
}
for (const doc of docsMd) {
  let text = fs.readFileSync(path.join(pdir, doc), 'utf8');
  for (const [link, to] of Object.entries(renamed)) text = text.split(`](${link})`).join(`](${to})`);
  put(doc, text);
}

put('contract/contract.diff', git('diff', base, a.tag, '--', 'app/js/ports.mjs', 'design/components.md') + '\n');
const extra = path.join(pdir, 'contract');
if (fs.existsSync(extra)) for (const f of fs.readdirSync(extra, { recursive: true }))
  if (fs.statSync(path.join(extra, f)).isFile()) put(`contract/${f}`, fs.readFileSync(path.join(extra, f)));

/* THE CODE IS app/ AND demo/, AND THE ENGINEERING DOCUMENTS GO WITH IT.
   demo/ is the working example of the contract, so a port that changed shape
   changed it too; design-language.md and components.md are what an engineer
   builds against, and a delta that leaves them out leaves Innovue reading
   stale copies. brief.md and platform.md stay ours: the first argues the
   product to us, and the second's round section is our process, and the
   cards carry what Innovue needs from both. Each changed file at --tag, and
   one diff per tree. */
const at = f => spawnSync('git', ['cat-file', '-e', `${a.tag}:${f}`], { cwd: ROOT }).status === 0;
const show = f => execFileSync('git', ['show', `${a.tag}:${f}`], { cwd: ROOT });
const namesIn = (...p) => git('diff', '--name-only', base, a.tag, '--', ...p).split('\n').filter(Boolean);
const changed = namesIn('app/', 'demo/');
for (const f of changed) if (at(f)) put(`code/${f}`, show(f));
put('code/app.diff', git('diff', base, a.tag, '--', 'app/') + '\n');
put('code/demo.diff', git('diff', base, a.tag, '--', 'demo/') + '\n');
const DOCS = ['docs/design-language.md', 'design/components.md'];
const docs = namesIn(...DOCS);
for (const f of docs) if (at(f)) put(`docs/${path.basename(f)}`, show(f));
if (docs.length) put('docs/docs.diff', git('diff', base, a.tag, '--', ...DOCS) + '\n');

/* THE PATCH, AS FILES AND AS ONE PASTE. Each item's file, and then all.css
   and all.js, the same patch joined (stylesheets by a newline, because a
   stray ';' at the top level of CSS swallows the next rule; scripts by ';'),
   and apply.js, which Innovue pastes into the console on their own build:
   it puts the stylesheet in, keeps it in across their client-side
   navigation, and runs the scripts once the page has loaded. */
const odir = `design/overlays/round-${a.round}`;
const ofiles = git('ls-tree', '-r', '--name-only', a.tag, '--', odir).split('\n').filter(Boolean).sort();
for (const f of ofiles) put(`overlays/${path.basename(f)}`, show(f));
const join = (ext, sep) => ofiles.filter(f => f.endsWith(ext))
  .map(f => `/* ${path.basename(f)} */\n` + show(f).toString('utf8')).join(sep);
const allCss = join('.css', '\n'), allJs = join('.js', '\n;\n');
put('overlays/all.css', allCss);
put('overlays/all.js', allJs);
/* apply.js CARRIES EACH ITEM APART, so one line at its top picks a subset:
   an engineer comparing one item before and after should not have to read
   the whole round to find it. A second paste is refused rather than doubled,
   because the scripts add elements (the skip link, a live region) that a
   second run would add again. */
const ids = [...new Set(ofiles.map(f => path.basename(f).replace(/\.(css|js)$/, '')))];
const items = ids.map(id => {
  const css = ofiles.find(f => path.basename(f) === id + '.css');
  const js = ofiles.find(f => path.basename(f) === id + '.js');
  return `    { id: ${JSON.stringify(id)},\n      css: ${JSON.stringify(css ? show(css).toString('utf8') : '')},\n`
    + `      js: ${js ? '() => {\n' + show(js).toString('utf8').split('\n').map(l => '        ' + l).join('\n') + '\n      }' : 'null'} }`;
});
put('overlays/apply.js', `/* The round-${a.round} patch for your live build (${a.tag}). Open the build,
   paste this into the browser console (or save it as a DevTools snippet and
   run it), and the round shows as CHANGES.md describes it. Reload to remove it.

   To apply only some items, list them on the ONLY line below before pasting,
   for example ['R1-07', 'R1-38']. Empty applies every item. */
const ONLY = [];
(() => {
  if (window.__terrainRound${a.round}) { console.info('The round-${a.round} patch is already applied. Reload to remove it.'); return; }
  window.__terrainRound${a.round} = true;
  const ITEMS = [
${items.join(',\n')}
  ].filter(i => !ONLY.length || ONLY.includes(i.id));
  const CSS = ITEMS.map(i => i.css).join('\n');
  const put = () => {
    if (document.getElementById('terrain-round-${a.round}')) return;
    const s = document.createElement('style');
    s.id = 'terrain-round-${a.round}';
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
`);

execFileSync('zip', ['-qr', zip, '.'], { cwd: stage });
fs.rmSync(stage, { recursive: true, force: true });
console.log(`wrote ${path.relative(ROOT, zip)}: ${images.length} images, ${changed.length} changed app/ and demo/ files, ${docs.length} documents, base ${base}`);
