/* type — the type scale their build actually renders, as a histogram.
 *
 *   node type.mjs --round 1 [--state results]
 *
 * For every visible element that directly holds text: font-size, weight,
 * line-height and family, counted, with three sample strings each. Written to
 * dom/type-<state>.md. Used to propose a reduced scale (R1-38) from what is
 * there rather than from a guess. One search for results; none for home. */
import fs from 'node:fs';
import path from 'node:path';
import { args, roundDir, open, reachTheirs } from './lib.mjs';

const a = args();
const states = a.state ? [a.state] : ['home', 'results'];
const out = roundDir(a.round, 'dom');
for (const state of states) {
  const { browser, page } = await open({});
  await reachTheirs(page, state, a.query);
  const rows = await page.evaluate(() => {
    const m = new Map();
    for (const el of document.querySelectorAll('body *')) {
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
      if (!own) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const fam = /Inconsolata|mono/i.test(cs.fontFamily) ? 'mono' : 'sans';
      const k = `${parseFloat(cs.fontSize)}px | ${cs.fontWeight} | ${cs.lineHeight} | ${fam} | ${cs.textTransform === 'uppercase' ? 'CAPS' : ''}`;
      const e = m.get(k) || { n: 0, ex: [] };
      e.n++;
      if (e.ex.length < 3 && !e.ex.includes(own.slice(0, 40))) e.ex.push(own.slice(0, 40));
      m.set(k, e);
    }
    return [...m].sort((x, y) => parseFloat(x[0]) - parseFloat(y[0]) || y[1].n - x[1].n);
  });
  const md = ['| size | weight | line-height | family | case | count | samples |', '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(([k, e]) => `| ${k} | ${e.n} | ${e.ex.join(' · ').replace(/\|/g, '/')} |`)].join('\n');
  fs.writeFileSync(path.join(out, `type-${state}.md`), `# Type on their ${state}\n\n${md}\n`);
  console.log('wrote type-' + state + '.md', rows.length, 'rows');
  await browser.close();
}
