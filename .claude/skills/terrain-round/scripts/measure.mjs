/* measure — one component in one state: a redline and a token + px table.
 *
 *   node measure.mjs --round 2 --component star --selector '.row .star' --state results
 *   node measure.mjs ... --target theirs --overlay R2-05      their build, overlay applied
 *   node measure.mjs ... --interact hover|focus --theme dark --depth 2
 *
 * --target ours (default) measures app/ on 127.0.0.1:8765 — start the server
 * first. Writes measure/<component>-<state>-<theme>[-<interact>].png and .md.
 *
 * EVERY VALUE IS STATED AS A TOKEN AND AS PIXELS. The token is what they build
 * to; the pixels are what they check their build against. Values are matched
 * to tokens by parsing app/styles/tokens.css for the theme being measured, so
 * a colour on their build that matches none of ours prints as a raw value, and
 * that is a finding, not a gap in the table. Semantic tokens are preferred over
 * primitives, because no component may read a primitive. */
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, args, roundDir, open, reach, setTheme, die, readOverlay, injectOverlay, THEIRS, OURS_LOCAL, QUERY } from './lib.mjs';

const a = args();
for (const k of ['component', 'selector']) if (!a[k]) die(`--${k} is required`);
const target = a.target || 'ours';
const url = target === 'theirs' ? THEIRS : (a.url || OURS_LOCAL);
const theme = a.theme || 'light';
const state = a.state || 'results';
const depth = Number(a.depth || 2);
const out = roundDir(a.round, 'measure');
const stem = [a.component, state, theme, a.interact].filter(Boolean).join('-');

/* ── tokens.css → { light, dark } maps of resolved value → token names ───── */
function tokens() {
  const src = fs.readFileSync(path.join(ROOT, 'app/styles/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const light = {}, dark = {};
  for (const m of src.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim();
    const isDark = /data-theme="dark"|:not\(\[data-theme="light"\]\)/.test(sel);
    if (!/:root/.test(sel)) continue;
    for (const d of m[2].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) (isDark ? dark : light)[d[1]] = d[2].trim();
  }
  const resolve = (map, v, seen = 0) => v.replace(/var\((--[a-z0-9-]+)\)/gi, (_, n) =>
    seen > 8 ? '' : resolve(map, map[n] ?? light[n] ?? '', seen + 1));
  const index = map => {
    const all = { ...light, ...map }, idx = {};
    for (const [name, raw] of Object.entries(all)) {
      const v = norm(resolve(all, raw));
      if (!v) continue;
      (idx[v] ||= []).push(name);
    }
    for (const k in idx) idx[k].sort((x, y) => /^--n-/.test(x) - /^--n-/.test(y));
    return idx;
  };
  return { light: index({}), dark: index(dark) };
}
function norm(v) {
  v = v.trim().toLowerCase();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (hex) {
    let h = hex[1]; if (h.length === 3) h = [...h].map(c => c + c).join('');
    return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
  }
  const rgba = v.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) {
    const p = rgba[1].split(',').map(s => s.trim());
    return p.length === 4 && p[3] !== '1' ? `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${Number(p[3])})` : `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
  }
  return v;
}
const idx = tokens()[theme];
/* Several tokens can share a value (--text-1 and --accent are the same ink).
   The one named is the one for the property's role, so a text colour reads as
   a text token and a fill as a surface token. */
const ROLE = {
  fg: [/^--text-/, /^--state-[a-z]+$/, /^--figure-ink/, /^--accent/],
  bg: [/^--(surface|ground)/, /^--skeleton/, /^--state-.*-tint$/, /^--(veil|scrim|figure-ground|track)/, /^--accent/],
  border: [/^--border/, /^--veil-edge/, /^--accent/],
  space: [/^--s-/],
  radius: [/^--r-/],
};
const prefer = (names, role) => {
  for (const re of ROLE[role] || []) { const n = names.find(x => re.test(x)); if (n) return n; }
  return names[0];
};
const tok = (v, role) => {
  if (!v || v === 'none' || v === 'normal' || v === 'rgba(0, 0, 0, 0)') return '';
  const names = idx[norm(v)];
  return names ? `\`${prefer(names, role)}\` = ${v}` : `${v} (no token)`;
};
const box = (v, role = 'space') => {
  if (!v || v === 'normal' || /^(0px ?)+$/.test(v)) return '';
  const named = v.split(' ').map(p => idx[p] ? `\`${prefer(idx[p], role)}\`` : p).join(' ');
  return named === v ? v : `${named} = ${v}`;
};

/* ── the page ───────────────────────────────────────────────────────────── */
const { browser, ctx, page } = await open({ theme, width: state === 'phone' ? 390 : 1440, height: state === 'phone' ? 844 : 900 });
if (target === 'theirs' && a.overlay) await injectOverlay(ctx, readOverlay(a.round, a.overlay));
await page.goto(url, { waitUntil: 'networkidle' }).catch(() => die(`${url} did not answer — for --target ours, run python3 -m http.server 8765 from the repo root`));
await setTheme(page, theme);
await reach(page, url, state, a.query || QUERY);
const el = page.locator(a.selector).first();
if (!(await el.count())) die(`nothing matches ${a.selector} in state ${state}`);
await el.scrollIntoViewIfNeeded();
if (a.interact === 'hover') await el.hover();
if (a.interact === 'focus') await el.focus();
await page.waitForTimeout(600);

const rows = await el.evaluate((root, depth) => {
  const out = [];
  const walk = (e, d) => {
    const r = e.getBoundingClientRect();
    if (r.width > 1 && r.height > 1) {   /* a 1×1 box is .sr-only, not layout */
      const s = getComputedStyle(e);
      out.push({
        n: out.length + 1, el: e, rect: [r.x, r.y, r.width, r.height],
        name: (e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 48),
        size: `${Math.round(r.width)} × ${Math.round(r.height)}`,
        padding: s.padding, margin: s.margin, gap: s.gap, radius: s.borderRadius,
        fg: s.color, bg: s.backgroundColor, border: s.borderTopWidth !== '0px' ? s.borderTopColor : '',
        font: `${s.fontSize} / ${s.lineHeight} · ${s.fontWeight}`,
      });
    }
    if (d < depth) for (const c of e.children) walk(c, d + 1);
  };
  walk(root, 0);
  /* the redline: numbered boxes over each measured element, drawn in one
     fixed layer so nothing in the page reflows under it */
  const layer = document.createElement('div');
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647';
  const corners = {};   /* nested boxes often share a corner; their numbers step right */
  for (const o of out) {
    const [x, y, w, h] = o.rect;
    const key = `${Math.round(x)},${Math.round(y)}`;
    const shift = (corners[key] = (corners[key] ?? -1) + 1) * 18;
    const b = document.createElement('div');
    b.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;outline:1px solid #E5007E;outline-offset:-1px`;
    const t = document.createElement('span');
    t.textContent = o.n;
    t.style.cssText = `position:absolute;left:${shift}px;top:0;transform:translateY(-100%);background:#E5007E;color:#fff;font:600 10px/14px monospace;padding:0 3px`;
    b.appendChild(t); layer.appendChild(b);
    delete o.el;
  }
  document.body.appendChild(layer);
  return out;
}, depth);

const r = rows[0].rect, pad = 24;
await page.screenshot({
  path: path.join(out, `${stem}.png`),
  clip: { x: Math.max(0, r[0] - pad), y: Math.max(0, r[1] - pad), width: r[2] + pad * 2, height: r[3] + pad * 2 },
});

const md = [
  `### ${a.component} · ${state} · ${theme}${a.interact ? ' · ' + a.interact : ''}`, '',
  `Measured on ${target === 'theirs' ? `their build${a.overlay ? ` with overlay ${a.overlay}` : ''}` : 'app/'}, \`${a.selector}\`, ${new Date().toISOString().slice(0, 10)}.`, '',
  `![](${stem}.png)`, '',
  '| # | Element | Size | Padding | Margin | Gap | Radius | Text | Fill | Border | Type |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map(o => `| ${o.n} | \`${o.name}\` | ${o.size} | ${box(o.padding)} | ${box(o.margin)} | ${box(o.gap)} | ${box(o.radius, 'radius')} | ${tok(o.fg, 'fg')} | ${tok(o.bg, 'bg')} | ${tok(o.border, 'border')} | ${o.font} |`),
  '',
];
fs.writeFileSync(path.join(out, `${stem}.md`), md.join('\n'));
console.log('wrote', path.relative(process.cwd(), path.join(out, `${stem}.png`)), 'and .md');
await browser.close();
