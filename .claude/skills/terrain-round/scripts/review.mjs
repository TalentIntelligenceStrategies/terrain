/* review — one local page with every overlay's before and after.
 *
 *   node review.mjs --round 1
 *
 * Reads design/overlays/round-N/ (each item's header comment: what it
 * changes and why) and the shots overlay.mjs wrote to round-N/overlay/, and
 * writes round-N/overlay/review.html beside them. Images are linked by
 * relative path, so the page opens from file:// and never leaves the machine.
 * It shows real holder names (the shots do), which is why it is local only. */
import fs from 'node:fs';
import path from 'node:path';
import { args, roundDir, ROOT } from './lib.mjs';

const a = args();
const dir = path.join(ROOT, 'design', 'overlays', `round-${a.round}`);
const out = roundDir(a.round, 'overlay');
const files = fs.readdirSync(dir).filter(f => /\.(css|js)$/.test(f)).sort();
const shots = fs.readdirSync(out).filter(f => f.endsWith('.png'));

const head = f => {
  const m = fs.readFileSync(path.join(dir, f), 'utf8').match(/^\/\*([\s\S]*?)\*\//);
  return m ? m[1].split('\n').map(l => l.replace(/^\s*\* ?/, '')).join('\n').trim() : '';
};
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* An item is every name with a file, plus "all"; a variant (R1-09a) also
   shows its base's shared files (R1-09.css, R1-09.js). A base that only
   carries shared files for its variants is not listed on its own. */
const names = [...new Set(files.map(f => path.parse(f).name))];
const items = names.filter(n => !names.some(m => m !== n && m.replace(/[a-z]$/, '') === n));
items.push('all');

const section = id => {
  const own = files.filter(f => [id, id.replace(/[a-z]$/, '')].includes(path.parse(f).name));
  const notes = id === 'all'
    ? 'Every overlay at once (the unchosen variant left out): the package\'s combined patch, shot to catch collisions.'
    : own.map(f => `<div class="file">${esc(f)}</div><pre>${esc(head(f))}</pre>`).join('');
  const groups = [...new Set(shots.filter(s => s.startsWith(id + '-') && s.endsWith('-light-before.png'))
    .map(s => s.slice(id.length + 1, -'-light-before.png'.length)))];
  const grid = groups.map(g => `
    <h3>${esc(g)}</h3>
    <div class="grid">${['light', 'dark'].map(t => ['before', 'after'].map(w => {
      const f = `${id}-${g}-${t}-${w}.png`;
      return shots.includes(f) ? `<figure><figcaption>${t} · ${w}</figcaption><a href="${f}"><img loading="lazy" src="${f}" alt="${esc(id)} ${esc(g)} ${t} ${w}"></a></figure>` : '';
    }).join('')).join('')}</div>`).join('');
  return `<section id="${id}"><h2>${esc(id)}</h2>${notes}${grid || '<p class="none">No shots: see the note above for how this item is checked.</p>'}</section>`;
};

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Round ${a.round} overlays</title>
<link rel="stylesheet" href="../../../../brand/fonts/fonts.css">
<style>
:root{--bg:#f6f6f6;--card:#fff;--ink:#1a1a1a;--muted:#5c5c5c;--line:#e2e2e2;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--bg:#141414;--card:#1c1c1c;--ink:#ececec;--muted:#a3a3a3;--line:#333;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 Urbanist,system-ui,sans-serif}
header{padding:32px 24px 8px;max-width:1280px;margin:0 auto}
h1{font-size:26px;margin:0 0 4px}
nav{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0 0}
nav a{font:13px Inconsolata,monospace;color:var(--ink);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:3px 10px;background:var(--card)}
main{max-width:1280px;margin:0 auto;padding:0 24px 64px}
section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px 24px;margin-top:20px}
h2{font:600 20px Urbanist,sans-serif;margin:0 0 8px}
h3{font:500 13px Inconsolata,monospace;color:var(--muted);margin:20px 0 8px}
.file{font:12px Inconsolata,monospace;color:var(--muted);margin-top:8px}
pre{white-space:pre-wrap;font:13px/1.55 Inconsolata,monospace;margin:4px 0 0;max-width:90ch}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
figure{margin:0}
figcaption{font-size:12px;color:var(--muted);margin-bottom:4px}
img{display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:6px}
.none{color:var(--muted)}
@media (max-width:720px){.grid{grid-template-columns:1fr}}
</style></head><body>
<header><h1>Round ${a.round} · overlays on their build</h1>
<p>Before and after, light and dark, for every overlay in <code>design/overlays/round-${a.round}/</code>. Local only: the shots show real holder names.</p>
<nav>${items.map(i => `<a href="#${i}">${i}</a>`).join('')}</nav></header>
<main>${items.map(section).join('')}</main></body></html>`;
fs.writeFileSync(path.join(out, 'review.html'), html);
console.log('wrote', path.relative(ROOT, path.join(out, 'review.html')), `(${items.length} items)`);
