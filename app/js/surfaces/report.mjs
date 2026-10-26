/* report — the starred set read for one question, as paper. platform.md §5.3.
 *
 * ═══ ONE SEQUENCE, TWO RENDERINGS ══════════════════════════════════════════
 * The report is a list of SECTIONS, each a list of BLOCKS: cover, how the set
 * was made, at a glance, the counts, the analysis, the starred patents, and
 * what this report is not. On screen each section is one sheet, as tall as it
 * needs. For the PDF the same blocks are packed into US Letter pages by
 * measuring (paginate, below), so a block never splits and the file breaks
 * where it was measured. design/previews/terrain-report-lab.html is the bench
 * the look was chosen on.
 *
 * ═══ THE SET, WITH THE RESULTS BESIDE IT ══════════════════════════════════
 * Every exhibit counts the STARRED rows the client already holds, tallied with
 * the port's own arithmetic (tallyField), and prints the RESULTS beside them,
 * lighter: each search behind the stars, re-run with the settings it was
 * stamped with and counted whole by the `fieldCounts` port. The report is
 * about the set the founder picked, so the set leads; the field is there for
 * scale (platform.md §5.3).
 *
 * ═══ THE PRO PART IS HEADINGS AND BARS ══════════════════════════════════════
 * Nothing is generated before Pro runs, so nothing is hidden behind a blur
 * (design-language.md §8). In the reference Pro does not run yet: Run opens
 * the confirm step — what Pro writes, the price, charged on delivery — and its
 * Confirm says Pro runs once Innovue's prompts are connected. platform.md §10
 * item 8 is what starts it. The PDF leaves the Pro part out until it has run.
 *
 * ═══ A CAPTION STATES A COUNT ═══════════════════════════════════════════════
 * Every exhibit title here is arithmetic over the rows beneath it. A sentence
 * that says what the set MEANS belongs in a Pro section, marked and cited
 * (brief.md §1), and none is written in this file.
 */
import { $, esc } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { say } from '../core/live-region.mjs';
import * as Starred from '../core/starred.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { bump, stale } from '../core/generation.mjs';
import { codeOf, holderText } from '../core/format.mjs';
import { push, drop } from '../core/esc-stack.mjs';
import { tallyField } from '../ports.mjs';

let ENGINE = null;
/* THE COUNTS ARE ASKED FOR ONCE PER SET, keyed by the searches they were
   asked about, and dropped when the stars change. */
let COUNTS = null;
let COUNTED_FOR = '';
/* what the sheets on screen were built from, so the PDF packs the same */
let LAST = null;

/* ══ THE PATENT REPORT · one report, whoever reads it ══════════════════════
   A founder and a backer want the same sections — the founder wants the risk
   flags and the questions before an investor asks them, the backer wants
   where the idea may differ and each patent in plain English — so the report
   is written in neutral voice and carries all of them (platform.md §5.3). */
const REPORT = {
  name: 'Patent report', ask: 'How close are these patents to the idea, and who holds them?',
  /* field first, starred second; a pair shares a base */
  counted: ['holders', 'years', ['offices', 'classes'], 'cluster', ['status', 'licence']],
  lead: ['Bottom line', 'One paragraph on the closest patents, citing their numbers.'],
  pro: [
    ['Closest claims', 'The idea’s features against the closest claims. Each mark cites the claim and the passage it rests on. A feature no claim reaches is what falls outside.', 'chart'],
    ['Where the idea may differ', 'Changes that may avoid the closest claims, each citing the claim it moves away from.', 'list'],
    ['What’s already described', 'How much of the idea these patents already describe. The set is not a prior-art search.', 'text'],
    ['Other holders in the set', 'Each holder with its starred patents, and a note on what they cover.', 'list'],
    ['Risk flags', 'What to check before building or backing it. Each flag gives its basis and the patents behind it. No score.', 'list'],
    ['Questions a backer may ask', 'What these patents leave open, turned into questions for the team.', 'list'],
    ['Each patent in plain English', 'For every starred patent: what it protects, and what it doesn’t cover.', 'list'],
  ],
  disclaimer: 'Pro sections are generated from the patents you starred and the description. They are not legal or investment advice, and not a freedom-to-operate, patentability or validity opinion. Patents outside this set may matter.',
};

/* ══ the searches behind the stars ═══════════════════════════════════════
   One per distinct stamped search, most recent first. A star from before the
   whole search was stamped carries its sentence only, and is re-run with the
   engine's default settings — said in the basis line rather than hidden. */
function searchesOf(rows) {
  const seen = new Map();
  for (const r of [...rows].reverse()) {
    const s = r.starredSearch || (r.starredUnder ? { query: r.starredUnder, field: null, settings: {}, mode: 'text' } : null);
    if (!s) continue;
    const key = JSON.stringify([s.query, s.field, s.settings, s.mode]);
    if (!seen.has(key)) seen.set(key, s);
  }
  return [...seen.values()];
}

const today = new Date();
const DATE = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const DATE_LONG = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
/* THE LAST EIGHTEEN MONTHS ARE INCOMPLETE: applications publish about
   eighteen months after filing. A year that reaches into that window is drawn
   as an outline and the note says why — cutting it would hide data. */
const LAG = new Date(today.getFullYear(), today.getMonth() - 18, today.getDate()).getFullYear();

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const sk = w => `<span class="sk rep-sk" style="width:${w}%"></span>`;
const skp = w => `<span class="sk rep-skp" style="width:${w}%"></span>`;
const pct = (n, of) => of ? Math.round(n / of * 100) + '%' : '';
const LOCK = s => `<span class="rep-brand"><svg class="rep-mk" width="${s}" height="${s}" fill="currentColor" aria-hidden="true"><use href="#terrain-tis-mark"/></svg><span><b>TIS</b> Terrain</span></span>`;

/* ══ the counted exhibits ════════════════════════════════════════════════
   TWO COUNTS ON EVERY ROW. `S` is the starred set's, tallied here over the
   rows the client holds; `c` is the results', from the fieldCounts port. The
   title and the dark number are S's. A bar is S's share of the set and the
   tick is c's share of the results, on one scale, because 6 of 12 and 24 of
   50 compare as proportions and not as counts. */
const OTHERS = Symbol('others');
const share = (n, of) => (of ? n / of : 0);
const w = x => (x * 100).toFixed(1);

/* ONE ROW LIST FOR TWO COUNTS: the set's largest buckets, then the results'
   largest that the set lacks, at 0 — the field's biggest holder missing from
   the set is a fact worth seeing — then the rest folded, then the blanks. */
function both(sList, fList, nS, nF) {
  const sBy = new Map(sList), fBy = new Map(fList);
  const named = l => l.filter(([k]) => k);
  const pick = named(sList).slice(0, nS).map(([k]) => k);
  for (const [k] of named(fList).slice(0, nF)) if (!pick.includes(k)) pick.push(k);
  const out = pick.map(k => ({ k, s: sBy.get(k) || 0, f: fBy.get(k) || 0 }));
  const rest = new Set([...named(sList), ...named(fList)].map(([k]) => k).filter(k => !pick.includes(k)));
  if (rest.size) {
    const sum = by => [...rest].reduce((t, k) => t + (by.get(k) || 0), 0);
    out.push({ k: OTHERS, s: sum(sBy), f: sum(fBy), n: rest.size, dim: true });
  }
  for (const blank of [null, '']) {
    if (sBy.has(blank) || fBy.has(blank)) out.push({ k: blank, s: sBy.get(blank) || 0, f: fBy.get(blank) || 0, dim: true });
  }
  return out;
}
const pairs = hs => hs.map(h => [h.name, h.n]);
const holderRows = (S, c) => both(pairs(S.holders), pairs(c.holders), 3, 3);
/* the holders a title may name: the set's own, never one it holds none of */
const topHeld = rows => rows.filter(r => typeof r.k === 'string' && r.k && r.s > 0).slice(0, 3);

function holderLabel(r) {
  if (r.k === OTHERS) return `Others<span class="rep-sub">${plural(r.n, 'holder', 'holders')}</span>`;
  if (r.k === null) return `${sk(46)}<span class="sr-only">Holder withheld</span>`;
  if (r.k === '') return 'Holder not recorded';
  return esc(r.k);
}
const officeLabel = r => (r.k === OTHERS ? 'Other offices' : r.k ? esc(codeOf(r.k) || r.k) : 'Not recorded');
const classLabel = r => (r.k === OTHERS ? 'Other classes' : r.k ? `<span class="rep-num">${esc(r.k)}</span>` : 'Unclassified');

/* the scale is the larger share on the chart, so the longest mark fills it */
const scaleOf = (rows, S, c) => Math.max(1e-9, ...rows.flatMap(r => [share(r.s, S.results), share(r.f, c.results)]));
const barHTML = (r, S, c, m) => `<span class="rep-bar-c"><span class="rep-bar${r.dim ? ' is-dim' : ''}" style="width:${w(share(r.s, S.results) / m)}%"></span><span class="rep-tick" style="left:${w(share(r.f, c.results) / m)}%"></span></span>`;

function holderTable(S, c) {
  const rows = holderRows(S, c), m = scaleOf(rows, S, c);
  return `<table class="rep-ht"><thead><tr><th scope="col"><span class="sr-only">Holder</span></th><td></td><th scope="col" class="rep-r" colspan="2">Starred</th><th scope="col" class="rep-r rep-f" colspan="2">Results</th></tr></thead><tbody>${rows.map(r =>
    `<tr><th scope="row">${holderLabel(r)}</th><td class="rep-bc">${barHTML(r, S, c, m)}</td><td class="rep-r rep-num">${r.s}</td><td class="rep-r rep-pc rep-num">${pct(r.s, S.results)}</td><td class="rep-r rep-num rep-f">${r.f}</td><td class="rep-r rep-pc rep-num rep-f">${pct(r.f, c.results)}</td></tr>`).join('')}
    <tr class="rep-tot"><th scope="row">Total</th><td></td><td class="rep-r rep-num">${S.results}</td><td class="rep-r rep-pc rep-num">100%</td><td class="rep-r rep-num rep-f">${c.results}</td><td class="rep-r rep-pc rep-num rep-f">100%</td></tr></tbody></table>`;
}

function hbars(rows, S, c, label) {
  const m = scaleOf(rows, S, c);
  return `<div class="rep-hb"><span class="rep-hb-h"></span><span class="rep-hb-h"></span><span class="rep-hb-h">Starred</span><span class="rep-hb-h">Results</span>${rows.map(r =>
    `<span class="rep-hb-k">${label(r)}</span>${barHTML(r, S, c, m)}<span class="rep-hb-n rep-num">${r.s}</span><span class="rep-hb-n rep-hb-f rep-num">${r.f}</span>`).join('')}</div>`;
}

function yearSpan(S, c) {
  const ys = [...S.years, ...c.years].filter(([y]) => y != null).map(([y]) => y);
  if (!ys.length) return [];
  const hi = Math.max(...ys), lo = Math.max(Math.min(...ys), hi - 11);
  const sBy = new Map(S.years), fBy = new Map(c.years);
  const out = [];
  for (let y = lo; y <= hi; y++) out.push({ y, s: sBy.get(y) || 0, f: fBy.get(y) || 0 });
  return out;
}

function yearBars(S, c) {
  const span = yearSpan(S, c);
  if (!span.length) return `<p class="rep-ex-note">No filing dates came back for these patents.</p>`;
  const m = Math.max(1e-9, ...span.flatMap(r => [share(r.s, S.results), share(r.f, c.results)]));
  return `<div class="rep-cols" role="img" aria-label="Starred patents by filing year, ${span[0].y} to ${span[span.length - 1].y}, with the results’ share marked">${span.map(r =>
    `<div class="rep-col${r.y >= LAG ? ' is-inc' : ''}"><span class="rep-col-v rep-num">${r.s}</span><span class="rep-col-b" style="height:${w(share(r.s, S.results) / m)}%"></span><span class="rep-col-t" style="bottom:${w(share(r.f, c.results) / m)}%"></span></div>`).join('')}</div>
    <div class="rep-yrs" aria-hidden="true">${span.map((r, i) => `<span class="rep-num">${i === 0 || i === span.length - 1 ? r.y : String(r.y).slice(2)}</span>`).join('')}</div>
    <div class="rep-yrs rep-yrs-f" aria-hidden="true">${span.map(r => `<span class="rep-num">${r.f}</span>`).join('')}</div>`;
}

/* THE LAST COLUMN IS EVERY YEAR, and says so. The periods cover ten years and
   a class's filings may reach further back, so a column headed Total would
   not be the sum of the cells beside it. Each cell is the set's count, then
   the results' after the slash. */
function clusterGrid(S, c) {
  const ys = [...S.years, ...c.years].filter(([y]) => y != null).map(([y]) => y);
  if (!ys.length) return `<p class="rep-ex-note">No filing dates came back for these patents.</p>`;
  const hi = Math.max(...ys);
  const periods = [];
  for (let i = 4; i >= 0; i--) periods.push([hi - 2 * i - 1, hi - 2 * i]);
  const label = ([a, b]) => `${a}–${String(b).slice(2)}`;
  const keys = both(S.classes, c.classes, 4, 4).filter(r => r.k && r.k !== OTHERS).slice(0, 4).map(r => r.k);
  if (!keys.length) return `<p class="rep-ex-note">No classification came back for these patents.</p>`;
  const sCY = new Map(S.classYears), fCY = new Map(c.classYears);
  const cell = (s, f, cls = '') => `<td class="rep-num${cls}">${s}<span class="rep-f"> / ${f}</span></td>`;
  return `<div class="rep-tw"><table class="rep-gt"><thead><tr><th scope="col">Class</th>${periods.map(p => `<th scope="col" class="rep-num">${label(p)}</th>`).join('')}<th scope="col">All years</th></tr></thead><tbody>${keys.map(k => {
    const sb = new Map(sCY.get(k) || []), fb = new Map(fCY.get(k) || []);
    const two = ([a, b]) => cell((sb.get(a) || 0) + (sb.get(b) || 0), (fb.get(a) || 0) + (fb.get(b) || 0));
    const tot = by => [...by.values()].reduce((t, n) => t + n, 0);
    return `<tr><th scope="row" class="rep-num">${esc(k)}</th>${periods.map(two).join('')}${cell(tot(sb), tot(fb), ' rep-t')}</tr>`;
  }).join('')}</tbody></table></div>`;
}

function statusOf(rows) {
  const s = { grant: 0, application: 0, unknown: 0 };
  for (const r of rows) {
    const k = r.versions?.[0]?.kind;
    s[k === 'grant' || k === 'application' ? k : 'unknown']++;
  }
  return s;
}

/* Each exhibit: a title that states a count, its base, its body, a note. */
function exhibit(key, c, rows, S) {
  const two = `${rows.length} starred, beside ${c.results} results`;
  const starred = `${rows.length} starred`;
  const ofSet = `of the ${rows.length} starred patents`;
  if (key === 'holders') {
    const hr = holderRows(S, c), top = topHeld(hr);
    const held = top.reduce((t, r) => t + r.s, 0);
    const none = (S.holders.find(h => h.name === '') || {}).n || 0;
    const title = top.length
      ? `${top.length === 1 ? 'One holder accounts' : `${['', 'One', 'Two', 'Three'][top.length]} holders account`} for ${held} ${ofSet}${none ? `; ${none} name no holder` : ''}.`
      : `The holders ${ofSet} are withheld.`;
    return { label: 'Who holds them', title, base: two, body: holderTable(S, c), glance: hbars(hr, S, c, holderLabel) };
  }
  if (key === 'years') {
    const span = yearSpan(S, c);
    const peak = span.reduce((p, r) => (r.s > p.s ? r : p), { y: null, s: 0 });
    return { label: 'Filed by year', title: peak.y ? `Starred filings peak in ${peak.y}.` : 'No filing dates came back for the starred patents.', base: two, body: yearBars(S, c),
      note: `Filing year. Bars are the starred patents; a tick marks the results’ share, and the row beneath counts them. Applications publish about 18 months after filing, so ${LAG} onward is incomplete and drawn in outline.` };
  }
  if (key === 'offices') {
    const named = S.offices.filter(([o]) => o);
    const title = named.length ? `${named[0][1]} ${ofSet} ${named[0][1] === 1 ? 'was' : 'were'} filed in ${esc(codeOf(named[0][0]) || named[0][0])}.` : 'No office came back for the starred patents.';
    return { label: 'Where they were filed', title, base: two, body: hbars(both(S.offices, c.offices, 99, 99), S, c, officeLabel) };
  }
  if (key === 'classes') {
    const named = S.classes.filter(([k]) => k);
    const title = named.length ? `${named[0][1]} ${ofSet} sit in ${esc(named[0][0])}.` : 'No classification came back for the starred patents.';
    return { label: 'Technology classes', title, base: two, body: hbars(both(S.classes, c.classes, 4, 2), S, c, classLabel) };
  }
  if (key === 'cluster') {
    return { label: 'Where filings cluster', title: 'The four largest classes in the starred set, across five two-year periods.', base: two, body: clusterGrid(S, c),
      note: `The starred count, then the results’ after the slash. ${LAG} onward is incomplete.` };
  }
  if (key === 'status') {
    const s = statusOf(rows), k = c.kinds || {};
    const title = s.unknown === rows.length
      ? `No status came back for the ${rows.length} starred patents.`
      : `${s.grant} ${ofSet} ${s.grant === 1 ? 'is' : 'are'} granted; ${s.application} ${s.application === 1 ? 'is an application' : 'are applications'}${s.unknown ? `; ${s.unknown} not recorded` : ''}.`;
    const segs = [['Granted', s.grant, ''], ['Pending', s.application, 'is-dim'], ['Not recorded', s.unknown, 'is-none']].filter(x => x[1]);
    return { label: 'Granted and pending', title, base: two,
      body: `<div class="rep-split" aria-hidden="true">${segs.map(([, n, cls]) => `<span class="${cls}" style="flex:${n}"></span>`).join('')}</div>
        <div class="rep-legend">${segs.map(([l, n, cls]) => `<span><i class="${cls}"></i>${l} <span class="rep-num">${n}</span></span>`).join('')}</div>`,
      note: k.grant != null ? `Across the ${c.results} results: ${k.grant} granted, ${k.application} ${k.application === 1 ? 'application' : 'applications'}.` : '' };
  }
  if (key === 'licence') {
    return { label: 'Listed for licence on TIS', title: 'Which starred patents are listed on TIS’s licensing platform.', base: starred,
      body: `${skp(70)}${skp(42)}`, note: 'Listing status isn’t available yet.' };
  }
  return null;
}

/* ══ the Pro bodies: the real shape, empty ═══════════════════════════════ */
function proBody(kind) {
  if (kind === 'chart') {
    return `<table class="rep-cc"><thead><tr><th scope="col">Feature</th><th scope="col">Patent 1</th><th scope="col">Patent 2</th><th scope="col">Patent 3</th></tr></thead><tbody>${[1, 2, 3, 4].map(i =>
      `<tr><th scope="row">Feature ${i}</th><td>${sk(60)}</td><td>${sk(60)}</td><td>${sk(60)}</td></tr>`).join('')}</tbody></table><p class="rep-ex-note">● present · ◐ unclear · ○ absent, each citing claim and passage</p>`;
  }
  if (kind === 'list') return `<ol class="rep-ps-l">${[88, 72, 80].map((w, i) => `<li><span class="rep-num">${i + 1}.</span><span>${sk(w)}</span></li>`).join('')}</ol>`;
  return skp(96) + skp(92) + skp(64);
}

/* ══ the sections ════════════════════════════════════════════════════════
   `paper` is the PDF: it carries no Pro part before Pro has run — a file of
   empty bars says nothing — no Run control, and the page numbers screen has
   no use for. */
function sections(rows, searches, c, paper) {
  const out = [];
  const sec = (key, label, blocks, cls = '') => out.push({ key, label, blocks, cls });
  const queries = searches.map(s => s.query).filter(Boolean);
  const re = queries.length
    ? `The description: “${esc(queries[0])}”${queries.length > 1 ? `<span class="rep-sub">and ${plural(queries.length - 1, 'other search', 'other searches')}</span>` : ''}`
    : 'The description: not recorded';
  const stamped = rows.every(r => r.starredSearch);
  const basis = `${plural(searches.length, 'search', 'searches')}, ${plural(c.results, 'result', 'results')}; ${plural(rows.length, 'patent', 'patents')} starred. Counts describe the starred patents and what the searches returned, not every patent that exists.${stamped ? '' : ' Some stars predate their settings being kept, and were re-run with the engine’s defaults.'}`;
  const short = `${plural(searches.length, 'search', 'searches')}, ${plural(c.results, 'result', 'results')}, ${plural(rows.length, 'patent', 'patents')} starred.`;
  /* THE SET'S OWN COUNTS, in the port's buckets, so the two sit side by side */
  const S = tallyField(rows);
  const s = statusOf(rows);
  const top = topHeld(holderRows(S, c));
  const top3 = top.reduce((t, r) => t + r.s, 0);
  const offices = S.offices.filter(([o]) => o).length;
  /* the set leads, the results close: the cover takes the first four */
  const figs = [
    [rows.length, 'patents starred'],
    [`${s.grant} / ${rows.length}`, 'starred patents granted'],
    [offices, offices === 1 ? 'office' : 'offices'],
    [c.results, `results from ${plural(searches.length, 'search', 'searches')}`],
    ...(top3 ? [[top3, `starred held by the top ${plural(top.length, 'holder', 'holders').replace(/^1 /, '')}`]] : []),
  ];
  const dl = (cls, xs) => `<dl class="${cls}">${xs.map(([v, l]) => `<div><dt>${v}</dt><dd>${l}</dd></div>`).join('')}</dl>`;
  const op = (n, t, sub) => `<header class="rep-op"><p class="rep-op-n">${n}</p><h2 class="rep-op-t rep-bal">${t}</h2>${sub ? `<p class="rep-op-s rep-pretty">${sub}</p>` : ''}</header>`;
  const tag = '<span class="pro-label">Pro</span>';
  /* THE LISTING WAITS FOR ITS DATA ON PAPER, as Pro does: until the TIS-side
     listing is connected its exhibit is bars, and a file of bars says
     nothing. Status then stands alone rather than beside an empty partner. */
  const order = paper
    ? REPORT.counted.map(o => (Array.isArray(o) ? o.filter(k => k !== 'licence') : o)).map(o => (Array.isArray(o) && o.length === 1 ? o[0] : o))
    : REPORT.counted;
  const flat = order.flat();

  const toc = [['How the set was made', 'made'], ['At a glance', 'glance'], ['Part 1 · The counts', 'counts'],
    ...(paper ? [] : [['Part 2 · Analysis', 'pro']]),
    ['Appendix · The starred patents', 'apx'], ['What this report is not', 'close']];

  /* THE COVER STATES WHAT ITS PAGES STATE, and nothing else (brief.md §1). */
  sec('cover', 'Cover', [`<div class="rep-cv-band"><div class="rep-cv-top">${LOCK(22)}<span class="rep-cv-d">${DATE_LONG}</span></div>
      <p class="rep-cv-kick">${REPORT.name}</p><h2 class="rep-cv-q rep-bal">${REPORT.ask}</h2></div>
    <div class="rep-cv-low">${dl('rep-cv-figs', figs.slice(0, 4))}
      <dl class="rep-cv-about"><dt>About</dt><dd class="rep-pretty">“${esc(queries[0] || 'not recorded')}”</dd><dt>Basis</dt><dd class="rep-pretty">${short}</dd></dl></div>`], 'rep-pg-cover');

  sec('made', 'How the set was made', [
    `${op('Before the numbers', 'How the set was made', 'Every count in this report rests on what follows.')}
     <dl class="rep-memo"><dt>Re</dt><dd>${re}</dd><dt>Date</dt><dd>${DATE_LONG}</dd><dt>Basis</dt><dd class="rep-pretty">${basis}</dd></dl>`,
    /* NO FIGURES HERE: they are the cover's and the glance page's, and a third
       copy between them only repeats them. */
    `<div class="rep-made"><p class="rep-lbl">Contents</p><ol class="rep-toc">${toc.map(([t, k]) => `<li><span>${t}</span><span class="rep-dots"></span><span class="rep-num" data-first="${k}"></span></li>`).join('')}</ol></div>`]);

  /* AT A GLANCE: the figures, the bottom line, and every counted exhibit
     small with the page its full version is on. A view of the set, so it is
     admissible before Part 1; the bottom line is Pro, and on paper it waits
     for Pro like the rest of Part 2. */
  /* in exhibit order, so the tiles read 1, 2, 3 … like the part they point to */
  const tiles = ['holders', 'years', 'offices', 'classes', 'status', 'licence'].filter(key => flat.includes(key)).map(key => {
    const e = exhibit(key, c, rows, S), n = flat.indexOf(key) + 1;
    return `<div class="rep-gl-t"><p class="rep-gl-l">${e.label}</p><p class="rep-gl-h rep-pretty">${e.title}</p><div class="rep-gl-b">${e.glance || e.body}</div><p class="rep-gl-p">Exhibit ${n}<span class="rep-at"> · page <span class="rep-num" data-at="ex${n}"></span></span></p></div>`;
  }).join('');
  const lead = paper ? '' : `<section class="rep-lead" aria-label="${REPORT.lead[0]}, Pro"><h3>${REPORT.lead[0]} ${tag}</h3>${skp(96)}${skp(90)}${skp(58)}<p class="rep-ex-note">${REPORT.lead[1]} Written when you run the Pro report.</p></section>`;
  sec('glance', 'At a glance', [`${op('Summary', 'At a glance')}${dl('rep-gl-figs', figs)}${lead}`, `<div class="rep-gl">${tiles}</div>`]);

  let n = 0;
  const ex = key => {
    const e = exhibit(key, c, rows, S); n++;
    return `<section class="rep-ex" data-k="ex${n}" aria-labelledby="repEx${n}${paper ? 'p' : ''}">
      <p class="rep-ex-l">Exhibit ${n} · ${e.label}</p>
      <h3 class="rep-ex-t rep-bal" id="repEx${n}${paper ? 'p' : ''}">${e.title}</h3>
      <div class="rep-ex-b">${e.body}</div>${e.note ? `<p class="rep-ex-note rep-pretty">${e.note}</p>` : ''}
      <p class="rep-ex-src">Source: TIS Terrain, ${DATE}. Base: ${e.base}.</p></section>`;
  };
  const counted = order.map(o => Array.isArray(o) ? `<div class="rep-pair">${o.map(ex).join('')}</div>` : ex(o));
  counted[0] = op('Part 1', 'The counts', `Every title states a count of the ${rows.length} starred patents. Beside each, lighter, is the same count over the ${c.results} results the searches returned; on a bar, a tick marks the results’ share.`) + counted[0];
  sec('counts', 'Part 1, the counts', counted);

  if (!paper) {
    const names = [REPORT.lead[0], ...REPORT.pro.map(([t]) => t)];
    const band = `<div class="rep-pband"><p class="rep-pretty">Generated from the starred patents and the description. Ready in about 10 minutes. Paid per report.</p>
        <button class="btn btn-secondary" id="repRun" type="button" aria-expanded="false" aria-controls="repConfirm">Run the Pro report</button>
        <div class="rep-confirm" id="repConfirm" role="group" aria-label="Run the Pro report" hidden>
          <p class="rep-lbl">Pro writes</p><ul>${names.map(x => `<li>${x}</li>`).join('')}</ul>
          <p class="rep-confirm-price"><span>Price</span><span class="sk rep-sk"></span><span class="sr-only">not set yet</span></p>
          <p class="rep-pretty">Charged when the report is delivered. A run that fails costs nothing.</p>
          <div class="rep-confirm-acts"><button class="btn btn-primary" id="repConfirmRun" type="button">Confirm and run</button><button class="btn btn-ghost" id="repCancel" type="button">Cancel</button></div>
        </div>
        <p class="rep-pro-say" id="repProSay" role="status"></p></div>`;
    const ps = ([t, w, k]) => `<section class="rep-ps"><h3>${t} ${tag}</h3><p class="rep-ps-q rep-pretty">${w}</p><div class="rep-ps-b">${proBody(k)}</div></section>`;
    const P = REPORT.pro.map(ps);
    P[0] = op('Part 2', 'Analysis') + band + P[0];
    P[P.length - 1] += `<p class="rep-disc rep-pretty">${REPORT.disclaimer}</p>`;
    sec('pro', 'Part 2, the analysis', P, 'rep-pg-pro');
  }

  /* THE APPENDIX NAMES EACH PATENT, because a reader of the file has nothing
     else to go on: a number says where to look, a title says what it is. */
  sec('apx', 'Appendix, the starred patents', [`${op('Appendix', 'The starred patents', `${plural(rows.length, 'patent', 'patents')}, ${s.grant} granted. A reading cites each by its row.`)}
    <div class="rep-tw"><table class="rep-apx"><thead><tr><th scope="col">Ref.</th><th scope="col">Number</th><th scope="col">Title</th><th scope="col">Holder</th><th scope="col">Office</th><th scope="col">Filed</th><th scope="col">Status</th></tr></thead><tbody>${rows.map((r, i) => {
      const k = r.versions?.[0]?.kind;
      const filed = r.filed ? String(r.filed).slice(0, 4) : (r.year ?? null);
      return `<tr><td class="rep-num">${i + 1}</td><td class="rep-num rep-pn">${r.number ? esc(r.number) : sk(80)}</td><td class="rep-ti">${r.skim == null ? sk(80) : esc(r.skim)}</td><td class="rep-hold">${r.holder === null || r.holder === undefined ? sk(70) : esc(holderText(r.holder))}</td><td class="rep-num">${r.where ? esc(codeOf(r.where) || r.where) : '—'}</td><td class="rep-num">${filed ?? '—'}</td><td>${k === 'grant' ? 'Granted' : k === 'application' ? 'Application' : '—'}</td></tr>`;
    }).join('')}</tbody></table></div>
    <p class="rep-ex-src">Source: TIS Terrain, ${DATE}. Base: ${rows.length} starred.</p>`]);

  sec('close', 'What this report is not', [`${op('Before you rely on it', 'What this report is not')}
    <ol class="rep-cl">
      <li><h3>It is not advice.</h3><p class="rep-pretty">Nothing here is legal or investment advice.</p></li>
      <li><h3>It is not an opinion on any patent.</h3><p class="rep-pretty">It is not a freedom-to-operate, patentability or validity opinion, and no word in it says a patent is infringed, clear or novel.</p></li>
      <li><h3>It is not a full search.</h3><p class="rep-pretty">Its counts describe the ${plural(rows.length, 'patent', 'patents')} starred, beside what ${plural(searches.length, 'search', 'searches')} returned — ${plural(c.results, 'result', 'results')} — and its readings rest on the starred patents. Patents outside this set may matter.</p></li>
      <li><h3>It holds no score.</h3><p class="rep-pretty">No number in it is a rating, a rank or a probability. Every count can be checked against the rows it was taken from.</p></li>
      <li><h3>Its readings are marked.</h3><p class="rep-pretty">Part 2 is generated from the starred patents and the description, marked Pro, and every reading cites the patents it rests on.${paper ? ' It has not been run for this copy, so this copy carries none.' : ''}</p></li>
    </ol>`,
    `<div class="rep-cl-made"><p class="rep-lbl">How this report was made</p>
      <dl class="rep-memo"><dt>Generated</dt><dd>By TIS Terrain on ${DATE_LONG}, from a starred set.</dd><dt>Searches</dt><dd>${queries.length ? queries.map(q => `“${esc(q)}”`).join('; ') : 'Not recorded'}</dd></dl></div>`]);
  return out;
}

const RUN = `${LOCK(12)}<span>${REPORT.name} · ${DATE}</span>`;
const foot = (no, of) => `<span>${REPORT.name} · ${DATE}</span><span>Page <span class="rep-num">${no}</span> of <span class="rep-num">${of}</span></span>`;

/* on screen: one sheet per section, as tall as it needs */
function screenHTML(secs) {
  return secs.map(s => `<section class="rep-pg ${s.cls}" aria-label="${s.label}">${s.key === 'cover' ? '' : `<div class="rep-run">${RUN}</div>`}<div class="rep-in">${s.blocks.join('')}</div></section>`).join('');
}

/* ══ pagination · the PDF ════════════════════════════════════════════════
   Each section starts a page. A block goes onto the current page; if the page
   now holds more than it shows and the block was not alone on it, the block
   comes off and starts the next one. The head and the foot are filled before
   measuring, because the room a page has is what is left after them. */
function paginate(box, secs) {
  box.innerHTML = '';
  const pages = [];
  const fresh = (s, cont) => {
    const el = document.createElement('section'), cover = s.key === 'cover';
    el.className = `rep-pg ${cont ? '' : s.cls}`.trim();
    el.innerHTML = `${cover ? '' : `<div class="rep-run">${RUN}</div>`}<div class="rep-in"></div>${cover ? '' : `<div class="rep-ft">${foot(1, 1)}</div>`}`;
    box.append(el); pages.push({ el, key: s.key, cover });
    return el.querySelector('.rep-in');
  };
  for (const s of secs) {
    let inn = fresh(s, false), n = 0;
    for (const b of s.blocks) {
      const before = inn.childNodes.length;
      inn.insertAdjacentHTML('beforeend', b);
      if (n > 0 && inn.scrollHeight > inn.clientHeight + 1) {
        [...inn.childNodes].slice(before).forEach(x => x.remove());
        inn = fresh(s, true);
        inn.insertAdjacentHTML('beforeend', b);
      }
      n++;
    }
  }
  const of = pages.length, first = {}, at = {};
  pages.forEach((p, i) => {
    if (!(p.key in first)) first[p.key] = i + 1;
    for (const k of p.el.querySelectorAll('[data-k]')) if (!(k.dataset.k in at)) at[k.dataset.k] = i + 1;
    if (!p.cover) p.el.querySelector('.rep-ft').innerHTML = foot(i + 1, of);
  });
  for (const el of box.querySelectorAll('[data-first]')) el.textContent = first[el.dataset.first] || '';
  for (const el of box.querySelectorAll('[data-at]')) el.textContent = at[el.dataset.at] || '';
}

/* ══ painting ════════════════════════════════════════════════════════════ */
async function paint() {
  const desk = $('#repDesk'), empty = $('#repEmpty');
  const rows = Starred.list();
  if (!desk || !empty) return;
  empty.hidden = rows.length > 0;
  $('#repPdf').hidden = !rows.length;
  $('#repProTop').hidden = !rows.length;
  closeConfirm(false);
  if (!rows.length) { desk.innerHTML = ''; LAST = null; return; }
  const searches = searchesOf(rows);
  const key = JSON.stringify(searches);
  const land = c => {
    LAST = { rows, searches, c };
    landIn(desk, screenHTML(sections(rows, searches, c, false)));
    /* A SCROLL PORT HAS TO BE REACHABLE BY KEYBOARD, and only the DOM knows
       whether a table is scrolling at this width — starred.mjs's rule. */
    desk.querySelectorAll('.rep-tw').forEach(w => {
      if (w.scrollWidth > w.clientWidth) { w.setAttribute('tabindex', '0'); w.setAttribute('role', 'region'); w.setAttribute('aria-label', 'Table, scrolls sideways'); }
    });
  };
  if (COUNTS && COUNTED_FOR === key) { land(COUNTS); return; }
  const token = bump('report');
  waitOn(desk, 480);
  const res = await ENGINE.fieldCounts({ searches });
  if (stale('report', token)) return;
  if (!res.ok) {
    failWith(desk, 'The counts for this report did not load.', res.retryable ? () => paint() : null);
    say('destination', 'The counts for this report did not load.');
    return;
  }
  COUNTS = res.data; COUNTED_FOR = key;
  land(COUNTS);
}

/* ══ Run the Pro report · the confirm step ═══════════════════════════════
   What Pro writes, the price, and when it is charged — on delivery, so a run
   that fails costs nothing (platform.md §5.3). Inline in the band rather than
   a dialog: it belongs to the band, and there is no focus to trap.

   TWO BUTTONS OPEN IT, ONE AT A TIME ON SCREEN. The page head's is the
   surface's one filled button, so the action is in reach from the cover; the
   band's is secondary and steps aside while the step is open, and the head's
   steps down to secondary, so Confirm and run is the only dark button. Focus goes back to whichever opened it. */
const OPENERS = ['#repProTop', '#repRun'];
let OPENER = null;
function openConfirm(from) {
  const box = $('#repConfirm');
  if (!box) return;
  if (!box.hidden) { closeConfirm(true); return; }
  OPENER = from;
  box.hidden = false;
  OPENERS.forEach(s => $(s)?.setAttribute('aria-expanded', 'true'));
  $('#repRun').hidden = true;
  /* the head's button steps down too: Confirm and run is the action now */
  $('#repProTop')?.classList.replace('btn-primary', 'btn-secondary');
  push('rep-confirm', () => closeConfirm(true));
  box.closest('.rep-pband').scrollIntoView({ block: 'start' });
  $('#repConfirmRun')?.focus({ preventScroll: true });
}
function closeConfirm(refocus) {
  const box = $('#repConfirm');
  drop('rep-confirm');
  if (!box || box.hidden) return;
  box.hidden = true;
  const run = $('#repRun');
  if (run) run.hidden = false;
  $('#repProTop')?.classList.replace('btn-secondary', 'btn-primary');
  OPENERS.forEach(s => $(s)?.setAttribute('aria-expanded', 'false'));
  if (refocus) (OPENER && OPENER.isConnected ? OPENER : run)?.focus({ preventScroll: OPENER?.id === 'repProTop' });
  OPENER = null;
}

export function init(ctx) {
  ENGINE = ctx.engine;
  ctx.onRoute(view => { if (view === 'report') paint(); else closeConfirm(false); });
  /* THE STARS CHANGED, SO THE COUNTS ARE STALE. Dropped rather than refetched:
     the report is not on screen while the founder stars, and it asks again
     when it is. */
  Starred.onChange(() => { COUNTED_FOR = ''; });

  onActivate(document, '#repRun', el => openConfirm(el));
  onActivate(document, '#repProTop', el => openConfirm(el));
  onActivate(document, '#repCancel', () => closeConfirm(true));
  /* IN THE REFERENCE, CONFIRM SAYS WHY NOTHING STARTS. Pro cannot run until
     Innovue's prompts are connected, so it says that where it was pressed
     rather than pretending to start a ten-minute job. */
  onActivate(document, '#repConfirmRun', () => {
    closeConfirm(true);
    const line = $('#repProSay');
    const msg = 'Pro runs once Innovue’s prompts are connected. Nothing has been charged.';
    if (line) line.textContent = msg;
    say('destination', msg);
  });

  /* THE PDF IS THE PAGE, PACKED. Printed light whatever the theme, because
     paper does not swap; the theme the founder chose comes back afterwards.
     The pages are built here rather than on the button, so the browser's own
     Print reaches the same file. */
  let swapped = false, prior = null;
  window.addEventListener('beforeprint', () => {
    if (!document.querySelector('.view-report.is-active')) return;
    swapped = true;
    prior = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');
    const box = $('#repPrint');
    if (box && LAST) paginate(box, sections(LAST.rows, LAST.searches, LAST.c, true));
  });
  window.addEventListener('afterprint', () => {
    const box = $('#repPrint');
    if (box) box.innerHTML = '';
    if (!swapped) return;
    if (prior === null) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', prior);
    swapped = false; prior = null;
  });
  onActivate(document, '#repPdf', () => window.print());
}
