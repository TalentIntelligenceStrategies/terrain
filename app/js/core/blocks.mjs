/* blocks — a Pro section's blocks, drawn. components.md §1, design-language.md §7.
 *
 * ONE RENDERER FOR BOTH REFERENCES. app/ draws a delivered result with it,
 * and the report template (design/previews/terrain-report-lab.html) draws the
 * contract's example with it, so the shape the engine sends and the page it
 * becomes are checked against one drawing. styles/43-blocks.css is its look.
 *
 * WHAT A SECTION SAYS IS THE ENGINE'S. This file only lays it out: nine kinds,
 * each the smallest shape its layout needs, made of Sentences that cite what
 * they rest on. A kind it does not know is not drawn.
 *
 * A Sentence is { text, cites, tag?, source? }. In `text`, [n] is a starred
 * patent by its appendix row, §key another section and Ex:key a counted
 * exhibit; `ctx.section(key)` and `ctx.exhibit(key)` say what number each
 * prints as. `tag` C marks a fact anyone can check against the rows, O a fact
 * from outside them, which names its `source`. */
import { esc } from './dom.mjs';

const TAG = { C: 'Checkable against the rows', O: 'From outside the records' };

function sentence(s, ctx) {
  if (!s) return '';
  if (typeof s === 'string') return esc(s);
  const text = esc(s.text || '')
    .replace(/\[(\d+)\]/g, '<span class="blk-cite">[$1]</span>')
    .replace(/§([a-z][a-z0-9-]*)/g, (_, k) => ctx.section(k) || '§?')
    .replace(/Ex:([a-z][a-z0-9-]*)/g, (_, k) => (ctx.exhibit(k) ? `Exhibit ${ctx.exhibit(k)}` : 'Exhibit ?'));
  const mark = s.tag === 'C' || s.tag === 'O'
    ? `<span class="blk-mark blk-mark-${s.tag}" title="${TAG[s.tag]}${s.tag === 'O' && s.source ? ': ' + esc(s.source.name) : ''}">${s.tag}</span>` : '';
  return text + mark;
}
const say = (xs, ctx) => (xs || []).map(s => sentence(s, ctx)).join(' ');
const ref = n => `<span class="blk-cite">[${n}]</span>`;

/* the claim chart's marks: a symbol and its word, never a fill */
const MARK = { present: '●', unclear: '◐', absent: '○' };

const KINDS = {
  p: (b, ctx) => `<p class="blk blk-p">${say(b.sentences, ctx)}</p>`,

  list: (b, ctx) => `<ol class="blk blk-list${b.numbered ? '' : ' blk-plain'}">${(b.items || []).map((s, i) =>
    `<li><span class="blk-n">${b.numbered ? i + 1 + '.' : '·'}</span><span>${sentence(s, ctx)}</span></li>`).join('')}</ol>`,

  table: (b, ctx) => `<table class="blk blk-table"><thead><tr>${(b.head || []).map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${(b.rows || []).map(r => `<tr>${r.map(c => `<td>${sentence(c, ctx)}</td>`).join('')}</tr>`).join('')}</tbody></table>`,

  chart: (b, ctx) => `<table class="blk blk-table blk-chart"><thead><tr><th scope="col">Feature</th>${(b.cols || []).map(n => `<th scope="col">${ref(n)}</th>`).join('')}</tr></thead>
    <tbody>${(b.rows || []).map(r => `<tr><th scope="row">${esc(r.label)}</th>${(r.cells || []).map(c =>
      `<td><span class="blk-mk">${MARK[c.mark] || ''} ${esc(c.mark || '')}</span><span class="blk-why">${sentence(c.why, ctx)}</span></td>`).join('')}</tr>`).join('')}</tbody></table>`,

  /* a bar is a share of its own base, and the count prints at its end */
  bars: (b, ctx) => `<div class="blk blk-bars">${(b.rows || []).map(r => {
    const w = b.base ? Math.min(100, Math.round(r.n / b.base * 100)) : 0;
    return `<div class="blk-bar"><span class="blk-bl">${sentence(r.label, ctx)}</span><span class="blk-bt"><span style="width:${w}%"></span></span><span class="blk-bn">${r.n}</span></div>`;
  }).join('')}<p class="blk-base">Base: ${b.base}</p></div>`,

  matrix: (b, ctx) => `<table class="blk blk-matrix"><thead><tr><th scope="col"></th>${(b.cols || []).map(n => `<th scope="col">${ref(n)}</th>`).join('')}</tr></thead>
    <tbody>${(b.rows || []).map(r => `<tr><th scope="row">${esc(r.label)}</th>${(b.cols || []).map(n =>
      (r.on || []).includes(n) ? '<td class="on"><span class="sr-only">reaches</span></td>' : '<td class="off"><span class="sr-only">does not reach</span></td>').join('')}</tr>`).join('')}</tbody></table>`,

  answers: (b, ctx) => `<div class="blk blk-answers">${(b.items || []).map((a, i) =>
    `<div class="blk-a"><h4><span class="blk-n">${i + 1}</span> ${esc(a.head)}</h4><p>${say(a.says, ctx)}</p>${a.ask ? `<p class="blk-ask">${esc(a.ask)}</p>` : ''}</div>`).join('')}</div>`,

  checklist: (b, ctx) => `<ol class="blk blk-list blk-check">${(b.items || []).map((it, i) =>
    `<li><span class="blk-n">${i + 1}.</span><span>${sentence(it.text, ctx)}${it.section && ctx.section(it.section) ? ` <span class="blk-to">→ ${ctx.section(it.section)}</span>` : ''}</span></li>`).join('')}</ol>`,

  patent: (b, ctx) => `<div class="blk blk-patent"><h4>${ref(b.ref)} ${esc(ctx.patent(b.ref) || '')}</h4>
    <p><span class="blk-lb">In plain English</span>${sentence(b.plain, ctx)}</p>
    <p><span class="blk-lb">Claim 1</span>${sentence(b.claim1, ctx)}</p>
    ${b.abstractReadsBroader ? `<div class="blk-dr"><div><p class="blk-lb">The abstract says</p><q>${esc(b.abstractReadsBroader.abstract)}</q></div>
      <div><p class="blk-lb">Claim 1 also requires</p><ul>${(b.abstractReadsBroader.adds || []).map(x => `<li><span>${esc(x)}</span></li>`).join('')}</ul></div></div>` : ''}</div>`,
};

/* ctx: { section(key) → '2.3', exhibit(key) → 4, patent(ref) → 'US 9,841,761 · Granted' }.
   Each block is its own string, so a paginator can break between them. */
export function drawBlocks(blocks, ctx = {}) {
  const c = { section: () => '', exhibit: () => '', patent: () => '', ...ctx };
  return (blocks || []).map(b => (KINDS[b.kind] ? KINDS[b.kind](b, c) : '')).filter(Boolean);
}

export const BLOCK_KINDS = Object.keys(KINDS);
