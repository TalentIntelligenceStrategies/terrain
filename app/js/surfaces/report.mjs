/* report — the starred set read for one question, as paper. platform.md §5.3.
 *
 * ═══ TWO BASES, AND EVERY EXHIBIT NAMES ITS OWN ═══════════════════════════
 * Counts of the FIELD come from the `fieldCounts` port: each search behind the
 * stars, re-run with the settings it was stamped with, counted whole. Counts
 * of STATUS and the appendix come from the starred rows the client already
 * holds. A hand-picked set says little about a field, which is why the field
 * is not counted from the stars.
 *
 * ═══ THE PRO PART IS HEADINGS AND BARS ══════════════════════════════════════
 * Nothing is generated before Pro runs, so nothing is hidden behind a blur
 * (design-language.md §8). In the reference Pro does not run yet: the button
 * says so inline, and platform.md §10 item 8 is what starts it.
 *
 * ═══ A CAPTION STATES A COUNT ═══════════════════════════════════════════════
 * Every exhibit title here is arithmetic over the rows beneath it. A sentence
 * that says what the set MEANS belongs in a Pro section, marked and cited
 * (brief.md §1), and none is written in this file.
 */
import { $, $$, esc } from '../core/dom.mjs';
import { onActivate } from '../core/delegate.mjs';
import { say } from '../core/live-region.mjs';
import * as Starred from '../core/starred.mjs';
import { waitOn, landIn, failWith } from '../core/wait.mjs';
import { bump, stale } from '../core/generation.mjs';
import { codeOf, holderText } from '../core/format.mjs';

let ENGINE = null;
let KIND = 'founder';
/* THE COUNTS ARE ASKED FOR ONCE PER SET, not once per switch: Founder and
   Backer read the same stars, so a switch is a change of question, not of
   data. Keyed by the searches it was asked about. */
let COUNTS = null;
let COUNTED_FOR = '';

/* ══ THE TWO REPORTS · the copy is the direction's, word for word ══════════ */
const REPORTS = {
  founder: {
    name: 'Founder report', to: 'Founding team', ask: 'Can I build this, and protect it?',
    subject: 'Your description',
    counted: ['holders', 'years', 'offices', 'classes', 'status', 'licence'],
    lead: ['Bottom line', 'Three sentences on the closest patents, citing their numbers.'],
    pro: [
      ['Closest claims', 'Your idea’s features against the closest claims. Each mark cites the claim and the passage it rests on. A feature no claim reaches is what falls outside.', 'chart'],
      ['Where the idea may differ', 'Changes that may avoid the closest claims, each citing the claim it moves away from.', 'list'],
      ['What’s already described', 'How much of your idea these patents already describe. The set is not a prior-art search.', 'text'],
      ['Each patent in plain English', 'For every starred patent: what it protects, and what it doesn’t cover.', 'list'],
    ],
    disclaimer: 'Pro sections are written by AI from the patents you starred and your description. They are not legal advice, and not a freedom-to-operate, patentability or validity opinion. Patents outside this set may matter.',
  },
  backer: {
    name: 'Backer report', to: 'Investment committee', ask: 'Does this hold up, and who else is here?',
    subject: 'The company’s description',
    counted: ['holders', 'status', 'years', 'offices', 'cluster'],
    lead: ['The set in a page', 'One paragraph for an investment memo, citing the patents it rests on.'],
    pro: [
      ['Closest claims to the company', 'The company’s described technology against the closest claims, each mark citing the claim and passage.', 'chart'],
      ['Other holders in the set', 'Each holder with its starred patents, and a note on what they cover.', 'list'],
      ['Risk flags', 'What to check before backing it. Each flag gives its basis and the patents behind it. No score.', 'list'],
      ['Questions to ask the founders', 'What these patents leave open, turned into questions for the team.', 'list'],
    ],
    disclaimer: 'Pro sections are written by AI from the patents you starred and the company’s description. They are not legal or investment advice, and not a freedom-to-operate or validity opinion. Patents outside this set may matter.',
  },
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
/* THE LAST EIGHTEEN MONTHS ARE INCOMPLETE: applications publish about
   eighteen months after filing. A year that reaches into that window is drawn
   as an outline and the note says why — cutting it would hide data. */
const LAG = new Date(today.getFullYear(), today.getMonth() - 18, today.getDate()).getFullYear();

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const sk = w => `<span class="sk sk-h-label rep-sk" style="width:${w}%"></span>`;
const pct = (n, of) => of ? Math.round(n / of * 100) + '%' : '';

/* ══ the counted exhibits ════════════════════════════════════════════════ */
function holderRows(c) {
  const named = c.holders.filter(h => h.name);
  const top = named.slice(0, 3), rest = named.slice(3);
  const withheld = c.holders.find(h => h.name === null);
  const none = c.holders.find(h => h.name === '');
  const rows = top.map(h => ({ label: esc(h.name), n: h.n }));
  if (withheld) rows.push({ label: sk(46), n: withheld.n, dim: true, sr: 'Holder withheld' });
  if (rest.length) rows.push({ label: `Others <span class="rep-sub">${plural(rest.length, 'holder', 'holders')}</span>`, n: rest.reduce((a, h) => a + h.n, 0), dim: true });
  if (none) rows.push({ label: 'Holder not recorded', n: none.n, dim: true });
  return { rows, top };
}

function holderTable(c) {
  const { rows } = holderRows(c);
  const m = Math.max(1, ...rows.map(r => r.n));
  return `<table class="rep-ht"><tbody>${rows.map(r =>
    `<tr><th scope="row">${r.label}${r.sr ? `<span class="sr-only">${r.sr}</span>` : ''}</th><td class="rep-barc"><span class="rep-bar${r.dim ? ' is-dim' : ''}" style="width:${(r.n / m * 100).toFixed(1)}%"></span></td><td class="rep-n fig">${r.n}</td><td class="rep-pct fig">${pct(r.n, c.results)}</td></tr>`).join('')}
    <tr class="rep-tot"><th scope="row">Total</th><td></td><td class="rep-n fig">${c.results}</td><td class="rep-pct fig">100%</td></tr></tbody></table>`;
}

function hbars(rows) {
  const m = Math.max(1, ...rows.map(r => r[1]));
  return `<div class="rep-hb">${rows.map(([k, n, dim]) =>
    `<span class="rep-k">${k}</span><span class="rep-barc"><span class="rep-bar${dim ? ' is-dim' : ''}" style="width:${(n / m * 100).toFixed(1)}%"></span></span><span class="rep-n fig">${n}</span>`).join('')}</div>`;
}

function yearSpan(c) {
  const ys = c.years.filter(([y]) => y != null).map(([y]) => y);
  if (!ys.length) return [];
  const lo = Math.max(Math.min(...ys), Math.max(...ys) - 11), hi = Math.max(...ys);
  const by = new Map(c.years);
  const out = [];
  for (let y = lo; y <= hi; y++) out.push([y, by.get(y) || 0]);
  return out;
}

function yearBars(c) {
  const span = yearSpan(c);
  if (!span.length) return `<p class="rep-note">No filing dates came back for these results.</p>`;
  const m = Math.max(1, ...span.map(s => s[1]));
  return `<div class="rep-cols" role="img" aria-label="Results by filing year, ${span[0][0]} to ${span[span.length - 1][0]}">${span.map(([y, n]) =>
    `<div class="rep-col${y >= LAG ? ' is-inc' : ''}"><span class="rep-v fig">${n}</span><span class="rep-b" style="height:${(n / m * 100).toFixed(1)}%"></span><span class="rep-y fig">${String(y).slice(2)}</span></div>`).join('')}</div>`;
}

function clusterGrid(c) {
  const ys = c.years.filter(([y]) => y != null).map(([y]) => y);
  if (!ys.length) return `<p class="rep-note">No filing dates came back for these results.</p>`;
  const hi = Math.max(...ys);
  const periods = [];
  for (let i = 4; i >= 0; i--) periods.push([hi - 2 * i - 1, hi - 2 * i]);
  const label = ([a, b]) => `${a}–${String(b).slice(2)}`;
  const rows = c.classYears.filter(([k]) => k).slice(0, 4);
  return `<div class="rep-gridwrap"><table class="rep-grid"><thead><tr><th scope="col">Class</th>${periods.map(p => `<th scope="col">${label(p)}</th>`).join('')}<th scope="col">Total</th></tr></thead><tbody>${rows.map(([k, yrs]) => {
    const by = new Map(yrs);
    const cells = periods.map(([a, b]) => (by.get(a) || 0) + (by.get(b) || 0));
    const total = yrs.reduce((s, [, n]) => s + n, 0);
    return `<tr><th scope="row" class="fig">${esc(k)}</th>${cells.map(n => `<td class="fig">${n}</td>`).join('')}<td class="fig rep-t">${total}</td></tr>`;
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
function exhibit(key, c, rows) {
  const field = `${c.results} results`;
  const starred = `${rows.length} starred`;
  if (key === 'holders') {
    const { top } = holderRows(c);
    const held = top.reduce((a, h) => a + h.n, 0);
    const none = (c.holders.find(h => h.name === '') || {}).n || 0;
    const title = top.length
      ? `${top.length === 1 ? 'One holder accounts' : `${['', 'One', 'Two', 'Three'][top.length]} holders account`} for ${held} of ${c.results} results${none ? `; ${none} name no holder` : ''}.`
      : `The holders of these ${c.results} results are withheld.`;
    return { label: KIND === 'backer' ? 'Holder concentration' : 'Who holds them', title, base: field, body: holderTable(c) };
  }
  if (key === 'years') {
    const span = yearSpan(c);
    const peak = span.reduce((a, s) => (s[1] > a[1] ? s : a), [null, -1]);
    return { label: 'Filed by year', title: peak[0] ? `Filings in these results peak in ${peak[0]}.` : 'No filing dates came back.', base: field, body: yearBars(c),
      note: `Filing year. Applications publish about 18 months after filing, so ${LAG} onward is incomplete.` };
  }
  if (key === 'offices') {
    const rowsO = c.offices.map(([w, n]) => [w ? esc(codeOf(w) || w) : 'Not recorded', n, !w]);
    const named = c.offices.filter(([w]) => w);
    const title = named.length ? `${named[0][1]} of ${c.results} results ${named[0][1] === 1 ? 'was' : 'were'} filed in ${esc(codeOf(named[0][0]) || named[0][0])}.` : 'No office came back for these results.';
    return { label: 'Where they were filed', title, base: field, body: hbars(rowsO) };
  }
  if (key === 'classes') {
    const named = c.classes.filter(([k]) => k);
    const top = named.slice(0, 4), restN = named.slice(4).reduce((a, [, n]) => a + n, 0);
    const none = (c.classes.find(([k]) => !k) || [0, 0])[1];
    const rowsC = [...top.map(([k, n]) => [esc(k), n]), ...(restN ? [['Other classes', restN, true]] : []), ...(none ? [['Unclassified', none, true]] : [])];
    const title = top.length ? `${top[0][1]} of ${c.results} results sit in ${esc(top[0][0])}.` : 'No classification came back for these results.';
    return { label: 'Technology classes', title, base: field, body: hbars(rowsC) };
  }
  if (key === 'cluster') {
    return { label: 'Where filings cluster', title: `The four largest classes across five two-year periods.`, base: field, body: clusterGrid(c),
      note: `Counts per class and period, numbers in the cells. ${LAG} onward is incomplete.` };
  }
  if (key === 'status') {
    const s = statusOf(rows);
    const title = `${s.grant} of the ${rows.length} starred patents are granted; ${s.application} are applications.`;
    const segs = [['Granted', s.grant, ''], ['Pending', s.application, ' is-dim'], ['Not recorded', s.unknown, ' is-none']].filter(x => x[1]);
    return { label: 'Granted and pending', title, base: starred,
      body: `<div class="rep-split">${segs.map(([l, n, cls]) => `<span class="${cls.trim()}" style="flex:${n}">${l} ${n}</span>`).join('')}</div>` };
  }
  if (key === 'licence') {
    return { label: 'Listed for licence on TIS', title: 'Which starred patents are listed on TIS’s licensing platform.', base: starred,
      body: `${sk(70)}${sk(40)}`, note: 'The listing is TIS-side data and is not connected to the reference yet.' };
  }
  return null;
}

/* ══ the Pro bodies: the real shape, empty ═══════════════════════════════ */
function proBody(kind) {
  if (kind === 'chart') {
    return `<table class="rep-cc"><thead><tr><th scope="col">Feature</th><th scope="col">Patent 1</th><th scope="col">Patent 2</th><th scope="col">Patent 3</th></tr></thead><tbody>${[1, 2, 3, 4].map(i =>
      `<tr><th scope="row">Feature ${i}</th><td>${sk(60)}</td><td>${sk(60)}</td><td>${sk(60)}</td></tr>`).join('')}</tbody></table><p class="rep-key t-micro">● present · ◐ unclear · ○ absent, each citing claim and passage</p>`;
  }
  if (kind === 'list') return `<ol class="rep-skl">${[88, 72, 80].map(w => `<li>${sk(w)}</li>`).join('')}</ol>`;
  return sk(96) + sk(92) + sk(64);
}

/* ══ the sheets ══════════════════════════════════════════════════════════ */
function sheet(inner, no, rep) {
  return `<article class="rep-sheet">
    <div class="rep-mast"><span class="rep-brand">TIS Terrain</span><span class="rep-run t-micro">${rep.name} · ${DATE}</span></div>
    ${inner}
    <div class="rep-foot t-micro"><span>${rep.name}</span><span>Page ${no}</span></div></article>`;
}

function render(rows, searches, c) {
  const rep = REPORTS[KIND];
  const queries = searches.map(s => s.query).filter(Boolean);
  const re = queries.length
    ? `${rep.subject}: “${esc(queries[0])}”${queries.length > 1 ? ` <span class="rep-sub">and ${plural(queries.length - 1, 'other search', 'other searches')}</span>` : ''}`
    : rep.subject + ': not recorded';
  const stamped = rows.every(r => r.starredSearch);
  const basis = `${plural(searches.length, 'search', 'searches')}, ${c.results} results; ${plural(rows.length, 'patent', 'patents')} starred. Counts describe what the searches returned, not every patent that exists.${stamped ? '' : ' Some stars predate their settings being kept, and were re-run with the engine’s defaults.'}`;
  const s = statusOf(rows);
  const top3 = holderRows(c).top.reduce((a, h) => a + h.n, 0);
  const offices = c.offices.filter(([w]) => w).length;

  let n = 0;
  const ex = key => {
    const e = exhibit(key, c, rows);
    n++;
    return `<section class="rep-ex" aria-labelledby="repEx${n}">
      <p class="rep-lbl t-micro">Exhibit ${n} · ${e.label}</p>
      <h3 class="rep-ex-t" id="repEx${n}">${e.title}</h3>
      ${e.body}${e.note ? `<p class="rep-note">${e.note}</p>` : ''}
      <p class="rep-src t-micro">Source: TIS Terrain, ${DATE}. Base: ${e.base}.</p></section>`;
  };

  const [first, ...rest] = rep.counted;
  const pages = [];
  pages.push(sheet(`
    <h2 class="rep-h1">${rep.ask}</h2>
    <dl class="rep-meta">
      <dt class="t-micro">To</dt><dd>${rep.to}</dd>
      <dt class="t-micro">Re</dt><dd>${re}</dd>
      <dt class="t-micro">Date</dt><dd>${DATE}</dd>
      <dt class="t-micro">Basis</dt><dd>${basis}</dd>
    </dl>
    <div class="rep-body">
      <aside class="rep-rail" aria-label="Key figures"><p class="rep-lbl t-micro">Key figures</p>
        <dl class="rep-kf">
          <div><dt class="fig">${c.results}</dt><dd>results from ${plural(searches.length, 'search', 'searches')}</dd></div>
          <div><dt class="fig">${rows.length}</dt><dd>patents starred</dd></div>
          ${top3 ? `<div><dt class="fig">${top3}</dt><dd>results held by the top ${Math.min(3, holderRows(c).top.length)} holders</dd></div>` : ''}
          <div><dt class="fig">${s.grant} / ${rows.length}</dt><dd>starred patents granted</dd></div>
          <div><dt class="fig">${offices}</dt><dd>${offices === 1 ? 'office' : 'offices'}</dd></div>
        </dl></aside>
      <div class="rep-col1">
        <section class="rep-lead rep-pro" aria-label="${rep.lead[0]}, Pro"><h3 class="rep-ex-t">${rep.lead[0]} <span class="rep-protag t-micro">Pro</span></h3>${sk(96)}${sk(90)}${sk(58)}<p class="rep-note">${rep.lead[1]} Written when you run the Pro report.</p></section>
        ${ex(first)}
      </div>
    </div>`, 1, rep));
  for (let i = 0; i < rest.length; i += 2) {
    pages.push(sheet(`<div class="rep-two">${rest.slice(i, i + 2).map(ex).join('')}</div>`, pages.length + 1, rep));
  }
  pages.push(`<div class="rep-pro">${sheet(`
    <div class="rep-band"><div><h2 class="t-title">Part 2 · Analysis</h2><p class="rep-note">Written by AI from the starred patents and ${rep.subject.toLowerCase()}. Ready in about 10 minutes. Paid per report.</p><p class="rep-note" id="repProSay" role="status"></p></div>
      <button class="btn btn-primary" id="repRun" type="button">Run the Pro report</button></div>
    ${rep.pro.map(([t, w, k]) => `<section class="rep-prosec"><h3 class="rep-ex-t">${t} <span class="rep-protag t-micro">Pro</span></h3><p class="rep-note">${w}</p>${proBody(k)}</section>`).join('')}
    <p class="rep-disc t-micro">${rep.disclaimer}</p>`, pages.length + 1, rep)}</div>`);
  pages.push(sheet(`<section class="rep-ex" aria-labelledby="repApx"><p class="rep-lbl t-micro">Appendix · The starred patents</p>
    <h3 class="rep-ex-t" id="repApx">${plural(rows.length, 'patent', 'patents')}, ${s.grant} granted.</h3>
    <div class="rep-gridwrap"><table class="rep-grid rep-apx"><thead><tr><th scope="col">Number</th><th scope="col">Holder</th><th scope="col">Office</th><th scope="col">Filed</th><th scope="col">Status</th></tr></thead><tbody>${rows.map(r => {
      const k = r.versions?.[0]?.kind;
      const filed = r.filed ? String(r.filed).slice(0, 4) : (r.year ?? null);
      return `<tr><th scope="row" class="fig">${r.number ? esc(r.number) : sk(80)}</th><td>${r.holder === null || r.holder === undefined ? sk(70) : esc(holderText(r.holder))}</td><td class="fig">${r.where ? esc(codeOf(r.where) || r.where) : '—'}</td><td class="fig">${filed ?? '—'}</td><td>${k === 'grant' ? 'Granted' : k === 'application' ? 'Application' : '—'}</td></tr>`;
    }).join('')}</tbody></table></div>
    <p class="rep-src t-micro">Source: TIS Terrain. Base: ${rows.length} starred.</p></section>`, pages.length + 1, rep));
  return pages.join('');
}

/* ══ painting ════════════════════════════════════════════════════════════ */
function kindFromHash() {
  return location.hash.slice(1).split('/')[1] === 'backer' ? 'backer' : 'founder';
}

function setKind(k) {
  KIND = k;
  $$('[data-rep-kind]').forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-rep-kind') === k)));
  const t = $('#repTitle');
  if (t) t.textContent = REPORTS[k].name;
}

async function paint() {
  setKind(kindFromHash());
  const desk = $('#repDesk'), empty = $('#repEmpty');
  const rows = Starred.list();
  if (!desk || !empty) return;
  empty.hidden = rows.length > 0;
  $('#repPdf').hidden = !rows.length;
  if (!rows.length) { desk.innerHTML = ''; return; }
  const searches = searchesOf(rows);
  const key = JSON.stringify(searches);
  if (COUNTS && COUNTED_FOR === key) { landIn(desk, render(rows, searches, COUNTS)); return; }
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
  landIn(desk, render(rows, searches, COUNTS));
}

export function init(ctx) {
  ENGINE = ctx.engine;
  ctx.onRoute(view => { if (view === 'report') paint(); });
  /* THE STARS CHANGED, SO THE COUNTS ARE STALE. Dropped rather than refetched:
     the report is not on screen while the founder stars, and it asks again
     when it is. */
  Starred.onChange(() => { COUNTED_FOR = ''; });

  onActivate(document, '[data-rep-kind]', el => {
    const k = el.getAttribute('data-rep-kind');
    if (k === KIND) return;
    history.replaceState(null, '', '#report/' + k);
    paint();
    say('destination', REPORTS[k].name);
  });

  /* RUN THE PRO REPORT, in the reference. It cannot run until Innovue's
     prompts are connected, so it says that where it was pressed rather than
     pretending to start a ten-minute job. */
  onActivate(document, '#repRun', () => {
    const line = $('#repProSay');
    const msg = 'Pro runs once Innovue’s prompts are connected. Nothing has been charged.';
    if (line) line.textContent = msg;
    say('destination', msg);
  });

  /* THE PDF IS THE PAGE. Printed light whatever the theme, because paper
     does not swap; the theme the founder chose comes back afterwards. */
  let swapped = false, prior = null;
  window.addEventListener('beforeprint', () => {
    if (!document.querySelector('.view-report.is-active')) return;
    swapped = true;
    prior = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  window.addEventListener('afterprint', () => {
    if (!swapped) return;
    if (prior === null) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', prior);
    swapped = false; prior = null;
  });
  onActivate(document, '#repPdf', () => window.print());
}
