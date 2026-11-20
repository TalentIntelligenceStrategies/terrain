/* The package's .md files as pages, beside the build they patch: fake.mjs
 * --patch serves them at /package/<file>. Read on every request, so an edit to
 * a card shows on reload. Image links in them are relative to package/
 * (../overlay/…png) and are served from the round folder at /__pkg/r/, never
 * from outside it. */
import fs from 'node:fs';
import path from 'node:path';
import { roundDir } from './lib.mjs';

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const slug = s => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');

/* A link in a package file, made to work from the server: an anchor in the
   same file stays, another package .md goes to /package/, anything else
   relative to package/ goes to /__pkg/r/ inside the round folder. */
function href(u, here) {
  if (/^(https?:|mailto:)/.test(u)) return u;
  if (u.startsWith('#')) return here ? u : `/package/CHANGES.md${u}`;
  const [p, hash = ''] = u.split('#');
  if (/^[\w-]+\.md$/.test(p)) return `/package/${p}${hash && '#' + hash}`;
  const rel = path.posix.normalize(path.posix.join('package', p));
  return rel.startsWith('..') ? '#' : `/__pkg/r/${rel}${hash && '#' + hash}`;
}

function inline(s, here) {
  const code = [];
  s = s.replace(/`([^`]+)`/g, (m, c) => `\u0000${code.push(esc(c)) - 1}\u0000`);
  s = esc(s)
    .replace(/&lt;a id="([^"]+)"&gt;&lt;\/a&gt;/g, '<a id="$1"></a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, u) => `<img alt="${alt}" src="${href(u, here)}" loading="lazy">`)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${href(u, here)}">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>');
  return s.replace(/\u0000(\d+)\u0000/g, (m, i) => `<code>${code[i]}</code>`);
}

/* Enough Markdown for the package's files: headings, paragraphs, nested
   lists, tables, fences, rules, images, links, and its <a id> anchors. */
export function md(src, here = true) {
  const lines = src.split('\n'), out = [];
  let i = 0;
  const list = (indent) => {
    const html = ['<ul>'];
    while (i < lines.length) {
      const m = lines[i].match(/^(\s*)[-*] (.*)$/);
      if (!m || m[1].length < indent) break;
      if (m[1].length > indent) { html.push(list(m[1].length)); continue; }
      html.push(`<li>${inline(m[2], here)}`); i++;
      while (i < lines.length && /^\s+\S/.test(lines[i]) && !/^\s*[-*] /.test(lines[i])) html.push(' ' + inline(lines[i++].trim(), here));
      const n = lines[i]?.match(/^(\s*)[-*] /);
      if (n && n[1].length > indent) html.push(list(n[1].length));
      html.push('</li>');
    }
    return html.join('') + '</ul>';
  };
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{1,4}) (.*)$/))) {
      out.push(`<h${m[1].length} id="${slug(m[2])}">${inline(m[2], here)}</h${m[1].length}>`); i++;
    } else if (l.startsWith('```')) {
      const body = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) body.push(lines[i++]);
      i++; out.push(`<pre><code>${esc(body.join('\n'))}</code></pre>`);
    } else if (/^---+$/.test(l.trim())) { out.push('<hr>'); i++; }
    else if (/^\s*[-*] /.test(l)) out.push(list(l.match(/^\s*/)[0].length));
    else if (l.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const cells = r => r.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => inline(c.trim(), here));
      const body = rows.filter((r, k) => !(k === 1 && /^\|[\s:|-]+\|$/.test(r)));
      out.push(`<table><thead><tr>${cells(body[0]).map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>`
        + body.slice(1).map(r => `<tr>${cells(r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('') + '</tbody></table>');
    } else if (/^<a id="[^"]+"><\/a>$/.test(l.trim())) { out.push(l.trim()); i++; }
    else {
      const para = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,4} |```|\||\s*[-*] |---+$)/.test(lines[i])) para.push(lines[i++]);
      out.push(`<p>${inline(para.join(' '), here)}</p>`);
    }
  }
  return out.join('\n');
}

const CSS = `body{margin:0;font:15px/1.55 system-ui,sans-serif;color:#1a1a1a;background:#fff}
main{max-width:980px;margin:0 auto;padding:24px 16px 80px}nav{position:sticky;top:0;background:#fff;border-bottom:1px solid #e5e5e5;padding:10px 16px;display:flex;gap:16px;flex-wrap:wrap;z-index:1}
nav a{color:#1a1a1a}img{max-width:100%;border:1px solid #e5e5e5;border-radius:6px;margin:6px 0}table{border-collapse:collapse;display:block;overflow-x:auto;font-size:13px;margin:12px 0}
th,td{border:1px solid #e5e5e5;padding:4px 8px;text-align:left;vertical-align:top}code{font:13px ui-monospace,monospace;background:#f3f3f3;padding:1px 4px;border-radius:4px}
pre{background:#f3f3f3;padding:12px;overflow-x:auto;border-radius:6px}pre code{background:none;padding:0}h3{margin-top:2.2em;padding-top:1em;border-top:1px solid #e5e5e5}
@media (prefers-color-scheme:dark){body,nav{background:#141414;color:#e8e8e8}nav a,a{color:#e8e8e8}th,td,nav,h3{border-color:#333}code,pre{background:#222}img{border-color:#333}}`;

export const DOCS = ['README.md', 'CHANGES.md', 'CHECKLIST.md', 'TOKENS.md', 'MEASUREMENTS.md'];

export function page(round, file) {
  const p = path.join(roundDir(round), 'package', file);
  if (!DOCS.includes(file) || !fs.existsSync(p)) return null;
  const nav = DOCS.map(d => `<a href="/package/${d}">${d.replace('.md', '')}</a>`).join('') + '<a href="/">← the build</a>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${file} · round ${round} package</title><style>${CSS}</style></head><body><nav>${nav}</nav><main>${md(fs.readFileSync(p, 'utf8'))}</main></body></html>`;
}
