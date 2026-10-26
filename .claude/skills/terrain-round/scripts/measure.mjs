/* measure — components in their states: a redline and a token + px table each.
 *
 *   node measure.mjs --round 2 --component star --selector '.row .star' --state results
 *   node measure.mjs ... --target theirs --overlay R2-05      their build, overlay applied
 *   node measure.mjs ... --interact hover|focus --theme dark --depth 2
 *   node measure.mjs --round 2 --spec measure/spec.json        many, from one file
 *   node measure.mjs --round 2 --render                         every table again, offline
 *
 * --target ours (default) measures app/ on 127.0.0.1:8765 — start the server
 * first. Writes measure/<target>-<component>-<state>-<theme>[-<interact>]
 * .png, .md and .json (the raw values --render rebuilds the .md from), and
 * with --spec, measure/GRID.md: every component against every state it was
 * asked for, and why any state could not be reached.
 *
 * A job whose state is "url" just opens its url, for a state the address
 * itself restores.
 *
 * ONE PAGE PER JOB, MEASURED IN BOTH THEMES. A state on their build costs a
 * search on their service, so a spec job reaches its state once and measures
 * every item on it, in each theme it lists, by switching the theme in place.
 * A job is { target, state, query?, url?, overlay?, without?, themes?, prep?,
 * items: [{ component, selector, state?, interact?, steps?, undo?, depth?, pad? }] };
 * steps and undo are actions: {click: css} {label: regex} {hover: css}
 * {focus: css} {fill: [css, text]} {type: text} {key: name} {wait: ms} {eval: js}
 * {scroll: [css, px]}.
 *
 * EVERY VALUE IS STATED AS A TOKEN AND AS PIXELS. The token is what they build
 * to; the pixels are what they check their build against. Tokens are read from
 * the page being measured — app/'s from tokens.css as the page resolves them,
 * theirs from their own :root — so a value on an overlay item that matches no
 * token of theirs prints as a raw value, and that is a finding, not a gap. */
import fs from 'node:fs';
import path from 'node:path';
import { args, roundDir, open, reach, reachTheirs, click, die, readOverlay, injectOverlay, THEIRS, OURS_LOCAL, QUERY } from './lib.mjs';

const a = args();
const out = roundDir(a.round, 'measure');
const jobs = a.spec
  ? JSON.parse(fs.readFileSync(path.resolve(roundDir(a.round), a.spec), 'utf8'))
  : [{ target: a.target, state: a.state, query: a.query, url: a.url, overlay: a.overlay,
       without: a.without ? String(a.without).split(',') : [], themes: [a.theme || 'light'],
       items: [{ component: a.component, selector: a.selector, interact: a.interact, depth: a.depth }] }];
if (!a.spec && !a.render) for (const k of ['component', 'selector']) if (!a[k]) die(`--${k} is required`);

/* Several tokens can share a value (--text-1 and --accent are the same ink).
   The one named is the one for the property's role, so a text colour reads as
   a text token and a fill as a surface token. A length is named only by a
   token of its own role: 13px is not --text-sm because a padding happens to
   be 13px. */
const ROLES = {
  ours: {
    fg: [/^--text-/, /^--figure-ink/, /^--accent/],
    bg: [/^--(surface|ground)/, /^--skeleton/, /^--(veil|scrim|figure-ground|track)/, /^--accent/],
    border: [/^--border/, /^--veil-edge/, /^--accent/, /^--focus/, /^--text-/],
    /* the report's page geometry names its own lengths (the template) */
    space: [/^--s-/, /^--(px|pt|pb)$/], radius: [/^--r-/],
  },
  theirs: {
    fg: [/^--foreground$/, /^--muted-foreground$/, /^--card-foreground$/, /^--primary$/, /-foreground$/],
    bg: [/^--card$/, /^--background$/, /^--muted$/, /^--popover$/, /^--accent$/, /^--secondary$/, /^--primary$/],
    border: [/^--border$/, /^--input$/, /^--ring$/],
    space: [/^--spacing$/], radius: [/^--radius/],
  },
};
const LENGTH_ROLES = new Set(['space', 'radius']);

/* A COLOUR AT AN OPACITY IS STILL ITS TOKEN. Their build writes
   border-border/60 and bg-background/95, which compute to a colour no token
   holds; named as "(no token)" that would read as a missing token when it is
   a token at 60%. Every colour is reduced to sRGB channels and an alpha, in
   the page, so lab(), oklch() and rgb() compare as one thing. */
const SRGB = `(c, probe) => {
  probe.style.color = '';
  probe.style.color = 'color-mix(in srgb, ' + c + ' 100%, transparent)';
  const v = getComputedStyle(probe).color;
  let m = v.match(/color\\(srgb ([-\\d.e]+) ([-\\d.e]+) ([-\\d.e]+)(?: \\/ ([-\\d.e]+))?\\)/);
  if (m) return { rgb: [m[1], m[2], m[3]].map(x => Math.round(Math.min(1, Math.max(0, +x)) * 255)), a: m[4] === undefined ? 1 : +m[4] };
  m = v.match(/rgba?\\((\\d+), (\\d+), (\\d+)(?:, ([\\d.]+))?\\)/);
  if (m) return { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] };
  return null;
}`;
async function toSrgb(page, colors) {
  return page.evaluate(({ colors, fn }) => {
    const conv = eval(fn), probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden';
    document.body.appendChild(probe);
    const out = {};
    for (const c of colors) out[c] = conv(c, probe);
    probe.remove();
    return out;
  }, { colors, fn: SRGB });
}

/* ── the page's own tokens: name → resolved value, as colour and as length ── */
async function tokenIndex(page) {
  return page.evaluate(() => {
    const names = new Set();
    const visit = rules => {
      for (const r of rules) {
        if (r.cssRules && !r.selectorText) { visit(r.cssRules); continue; }
        if (!r.style || !/(:root|^html|\[data-theme)/.test(r.selectorText || '')) continue;
        for (const p of r.style) if (p.startsWith('--') && !p.startsWith('--tw-')) names.add(p);
      }
    };
    for (const s of document.styleSheets) { try { visit(s.cssRules); } catch { /* cross-origin */ } }
    const host = document.createElement('div');
    host.style.cssText = 'position:absolute;visibility:hidden;color:rgb(1, 2, 3)';
    const probe = document.createElement('div');
    host.appendChild(probe); document.body.appendChild(host);
    const color = {}, length = {};
    for (const n of names) {
      probe.style.cssText = `color:var(${n});padding-top:var(${n})`;
      const cs = getComputedStyle(probe);
      if (cs.color !== 'rgb(1, 2, 3)') (color[cs.color] ||= []).push(n);
      if (cs.paddingTop !== '0px') (length[cs.paddingTop] ||= []).push(n);
    }
    host.remove();
    return { color, length };
  });
}
async function tokenIndexWithSrgb(page) {
  const idx = await tokenIndex(page);
  const s = await toSrgb(page, Object.keys(idx.color));
  idx.srgb = Object.entries(idx.color).filter(([v]) => s[v] && s[v].a === 1).map(([v, names]) => ({ rgb: s[v].rgb, names }));
  return idx;
}

function namer(index, target, conv = {}) {
  const roles = ROLES[target];
  const name = (v, role) => {
    const names = (LENGTH_ROLES.has(role) ? index.length : index.color)[v];
    if (!names) return null;
    for (const re of roles[role] || []) { const n = names.find(x => re.test(x)); if (n) return n; }
    return null;   /* a token of another role is not this value's name */
  };
  const pick = (names, role) => {
    for (const re of roles[role] || []) { const n = names.find(x => re.test(x)); if (n) return n; }
    return null;
  };
  const tok = (v, role) => {
    if (!v || v === 'none' || v === 'normal' || v === 'rgba(0, 0, 0, 0)') return '';
    const n = name(v, role);
    if (n) return `\`${n}\` = ${v}`;
    const c = conv[v];
    /* exact channels first, then within one step of rounding; every token
       at that colour is a candidate, so a primitive found first cannot hide
       the semantic token beside it */
    const near = d => c ? index.srgb.filter(t => t.rgb.every((x, i) => Math.abs(x - c.rgb[i]) <= d)).flatMap(t => t.names) : [];
    const m = (near(0).length && pick(near(0), role)) || pick(near(1), role);
    if (m) return c.a === 1 ? `\`${m}\` = ${v}` : `\`${m}\` at ${Math.round(c.a * 100)}%`;
    return `${v} (no token)`;
  };
  const box = (v, role = 'space') => {
    if (!v || v === 'normal' || /^(0px ?)+$/.test(v)) return '';
    const named = v.split(' ').map(p => { const n = name(p, role); return n ? `\`${n}\`` : p; }).join(' ');
    return named === v ? v : `${named} = ${v}`;
  };
  return { tok, box };
}

/* ── actions a step list can take ──────────────────────────────────────── */
async function act(page, steps = []) {
  for (const s of steps) {
    if (s.click) await page.locator(s.click).first().click({ timeout: 5000 }).catch(() => page.locator(s.click).first().click({ force: true, timeout: 3000 }));
    if (s.label) { if (!(await click(page, new RegExp(s.label), 0))) throw new Error(`no control labelled ${s.label}`); }
    if (s.hover) await page.locator(s.hover).first().hover({ timeout: 5000 });
    if (s.focus) await page.locator(s.focus).first().focus({ timeout: 5000 });
    if (s.fill) await page.locator(s.fill[0]).first().fill(s.fill[1]);
    if (s.type) await page.keyboard.type(s.type);   /* real keys, where fill() would skip a control's own handlers */
    if (s.key) await page.keyboard.press(s.key);
    if (s.eval) await page.evaluate(s.eval);
    if (s.scroll) await page.locator(s.scroll[0]).first().evaluate((e, px) => { e.scrollTop = px; }, s.scroll[1]);
    await page.waitForTimeout(s.wait ?? 400);
  }
}

/* Their control is in the masthead; ours is in the account menu, so it is
   pressed by its data attribute. Either way the result is checked, and set
   directly if the control could not be reached (an open dialog covers it). */
async function setTheme(page, theme) {
  const pressed = await page.evaluate(t => { const b = document.querySelector(`[data-theme-set="${t}"]`); if (b) b.click(); return !!b; }, theme);
  if (!pressed) await click(page, theme === 'dark' ? /^Dark appearance$/ : /^Light appearance$/, 0);
  await page.waitForTimeout(500);
  const now = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  if (now !== theme) await page.evaluate(t => { document.documentElement.setAttribute('data-theme', t); }, theme);
  await page.waitForTimeout(700);
}

async function measureOne(page, item, { target, state, theme, idx, overlay }) {
  const depth = Number(item.depth ?? 2);
  const st = item.state || state;
  /* the target leads the name, so their build and app/ measured under one
     component and state never write the same file */
  const stem = [target === 'theirs' ? 'theirs' : 'ours', item.component, st, theme, item.interact].filter(Boolean).join('-');
  const el = page.locator(item.selector).first();
  if (!(await el.count())) throw new Error(`nothing matches ${item.selector}`);
  await el.scrollIntoViewIfNeeded().catch(() => {});
  if (item.interact === 'hover') await el.hover();
  if (item.interact === 'focus') { await page.keyboard.press('Shift'); await el.focus(); }
  await page.waitForTimeout(500);

  const rows = await el.evaluate((root, depth) => {
    const out = [];
    const walk = (e, d) => {
      const r = e.getBoundingClientRect();
      if (r.width > 1 && r.height > 1) {   /* a 1×1 box is .sr-only, not layout */
        const s = getComputedStyle(e);
        out.push({
          n: out.length + 1, rect: [r.x, r.y, r.width, r.height],
          name: (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 48),
          size: `${Math.round(r.width)} × ${Math.round(r.height)}`,
          padding: s.padding, margin: s.margin, gap: s.gap, radius: s.borderRadius,
          fg: s.color, bg: s.backgroundColor, border: s.borderTopWidth !== '0px' ? s.borderTopColor : '',
          outline: s.outlineStyle !== 'none' && s.outlineWidth !== '0px' ? [s.outlineWidth, s.outlineColor, s.outlineOffset] : null,
          shadow: s.boxShadow !== 'none' ? s.boxShadow : '',
          font: `${s.fontSize} / ${s.lineHeight} · ${s.fontWeight}`,
        });
      }
      if (d < depth) for (const c of e.children) walk(c, d + 1);
    };
    walk(root, 0);
    /* the redline: numbered boxes over each measured element, drawn in one
       fixed layer so nothing in the page reflows under it */
    const layer = document.createElement('div');
    layer.id = 'terrain-redline';
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
    }
    document.body.appendChild(layer);
    return out;
  }, depth);
  if (!rows.length) throw new Error(`${item.selector} has no box`);

  const vp = page.viewportSize();
  const r = rows[0].rect, pad = Number(item.pad ?? 24);   /* a tight pad keeps neighbouring text out of the shot */
  const x = Math.max(0, r[0] - pad), y = Math.max(0, r[1] - pad);
  await page.screenshot({
    path: path.join(out, `${stem}.png`),
    clip: { x, y, width: Math.min(vp.width - x, r[2] + pad * 2), height: Math.min(vp.height - y, r[3] + pad * 2) },
  });
  await page.evaluate(() => document.getElementById('terrain-redline')?.remove());

  const colors = [...new Set(rows.flatMap(o => [o.fg, o.bg, o.border, o.outline && o.outline[1]]).filter(v => v && !idx.color[v]))];
  /* THE RAW VALUES ARE KEPT BESIDE THE TABLE, so a change to how values are
     named re-renders every table with --render instead of costing a search
     per state on their service again. */
  const raw = { component: item.component, state: st, theme, interact: item.interact || null, target, overlay: overlay || null,
    selector: item.selector, date: new Date().toISOString().slice(0, 10), stem, rows, idx, conv: await toSrgb(page, colors) };
  fs.writeFileSync(path.join(out, `${stem}.json`), JSON.stringify(raw));
  fs.writeFileSync(path.join(out, `${stem}.md`), render(raw));
  return stem;
}

function render(m) {
  const { tok, box } = namer(m.idx, m.target, m.conv);
  const where = m.target === 'theirs' ? `their build${m.overlay ? ` with overlay ${m.overlay}` : ''}` : 'app/';
  const extra = m.rows.some(o => o.outline || o.shadow);
  return [
    `### ${m.component} · ${m.state} · ${m.theme}${m.interact ? ' · ' + m.interact : ''}`, '',
    `Measured on ${where}, \`${m.selector}\`, ${m.date}.`, '',
    `![](${m.stem}.png)`, '',
    `| # | Element | Size | Padding | Margin | Gap | Radius | Text | Fill | Border | Type |${extra ? ' Ring / shadow |' : ''}`,
    `| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |${extra ? ' --- |' : ''}`,
    ...m.rows.map(o => `| ${o.n} | \`${o.name}\` | ${o.size} | ${box(o.padding)} | ${box(o.margin)} | ${box(o.gap)} | ${box(o.radius, 'radius')} | ${tok(o.fg, 'fg')} | ${tok(o.bg, 'bg')} | ${tok(o.border, 'border')} | ${o.font} |${extra ? ` ${[o.outline && `${o.outline[0]} ${tok(o.outline[1], 'border')}, offset ${o.outline[2]}`, o.shadow].filter(Boolean).join(' · ')} |` : ''}`),
    '',
  ].join('\n');
}

/* --render: rewrite every table from the raw values it was measured from */
if (a.render) {
  const files = fs.readdirSync(out).filter(f => f.endsWith('.json') && !/^(GRID|spec)/.test(f));
  for (const f of files) {
    const m = JSON.parse(fs.readFileSync(path.join(out, f), 'utf8'));
    fs.writeFileSync(path.join(out, `${m.stem}.md`), render(m));
  }
  console.log(`rendered ${files.length} tables`);
  process.exit(0);
}

/* ── run every job ─────────────────────────────────────────────────────── */
const grid = [];   /* { target, component, cell, result } */
for (const job of jobs) {
  const target = job.target || 'ours';
  const themes = job.themes || ['light', 'dark'];
  const state = job.state || 'results';
  const cellOf = (item, theme) => [item.state || state, theme, item.interact].filter(Boolean).join(' · ');
  const { browser, ctx, page } = await open({ theme: 'light', width: job.width || 1440, height: job.height || 900 });
  try {
    if (target === 'theirs' && job.overlay) await injectOverlay(ctx, readOverlay(a.round, job.overlay, job.without || []));
    if (target === 'theirs') await reachTheirs(page, state, job.query);
    else {
      const url = job.url || OURS_LOCAL;
      if (state === 'url') { await page.goto(url, { waitUntil: 'networkidle' }); await page.waitForTimeout(3000); }
      else {
        await page.goto(url, { waitUntil: 'networkidle' }).catch(() => die(`${url} did not answer — run python3 -m http.server 8765 from the repo root`));
        await reach(page, url, state, job.query || QUERY);
      }
    }
    await act(page, job.prep);
  } catch (e) {
    for (const item of job.items) for (const theme of themes) grid.push({ target, component: item.component, cell: cellOf(item, theme), result: `not reached: ${e.message.split('\n')[0]}` });
    console.error(`job ${target}/${state}: ${e.message.split('\n')[0]}`);
    await browser.close();
    continue;
  }
  for (const theme of themes) {
    await setTheme(page, theme);
    const idx = await tokenIndexWithSrgb(page);
    for (const item of job.items) {
      try {
        await act(page, item.steps);
        const stem = await measureOne(page, item, { target, state, theme, idx, overlay: job.overlay });
        grid.push({ target, component: item.component, cell: cellOf(item, theme), result: `[measured](${stem}.md)` });
        console.log('wrote', stem);
      } catch (e) {
        grid.push({ target, component: item.component, cell: cellOf(item, theme), result: `not reached: ${e.message.split('\n')[0]}` });
        console.error(`${item.component} · ${cellOf(item, theme)}: ${e.message.split('\n')[0]}`);
      }
      await act(page, item.undo).catch(() => {});
      await page.mouse.move(1, 1);
      await page.evaluate(() => document.activeElement?.blur?.());
    }
  }
  await browser.close();
}

if (a.spec) {
  /* the grid accumulates across spec files, so a round measured in several
     runs (theirs, then ours) still has one */
  const file = path.join(out, 'GRID.json');
  const prev = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  const keep = prev.filter(p => !grid.some(g => g.target === p.target && g.component === p.component && g.cell === p.cell));
  const all = [...keep, ...grid].sort((x, y) => x.component.localeCompare(y.component) || x.cell.localeCompare(y.cell) || x.target.localeCompare(y.target));
  fs.writeFileSync(file, JSON.stringify(all, null, 1));
  const lines = ['# Measured', '', '| Component | State | Build | Result |', '| --- | --- | --- | --- |',
    ...all.map(g => `| ${g.component} | ${g.cell} | ${g.target === 'theirs' ? 'theirs + patch' : 'app/'} | ${g.result} |`), ''];
  fs.writeFileSync(path.join(out, 'GRID.md'), lines.join('\n'));
  const missed = grid.filter(g => !g.result.startsWith('[')).length;
  console.log(`grid: ${grid.length - missed} measured, ${missed} not reached → ${path.relative(process.cwd(), path.join(out, 'GRID.md'))}`);
}
