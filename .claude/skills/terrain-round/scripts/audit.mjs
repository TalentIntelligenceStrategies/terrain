/* audit — walk the user journeys on one build, for the round's audit phase.
 *
 *   node audit.mjs --round 2 --journey all                 their build
 *   node audit.mjs --round 2 --journey reading --target ours
 *   node audit.mjs --round 2 --journey errors --no-dark
 *   node audit.mjs --round 2 --journey errors --queries nonsense,few-hits
 *
 * Journeys: first-visit reading patent-number errors return field-switch take-out keyboard.
 *
 *   node audit.mjs --round 3 --journey all --viewport phone
 *
 * --viewport names a lib.mjs preset; any but desktop writes audit/<target>-<viewport>/.
 *
 * Writes audit/<target>/<journey>/NN-<step>-{light,dark}.png and one log.md per
 * journey: the step, the URL, how long any wait took, the visible text of open
 * layers, the control labels, and, on the keyboard journey, where focus is and
 * whether it can be seen.
 *
 * DARK COSTS NO SEARCH. Every step is shot in light, the appearance control
 * flips to dark for a second shot, and flips back. A second dark pass over the
 * whole journey would double the load on their live service for screenshots
 * the first pass already reaches.
 *
 * THE QUERIES ARE THE ROUND'S, NOT THE SCRIPT'S. round-N/queries.json holds
 * them, so the next round reuses the same set and its screenshots compare. If it
 * is absent this writes the defaults below into it, and STATE.md should say so.
 * Every search on their build is counted in the log. */
import fs from 'node:fs';
import path from 'node:path';
import { args, roundDir, open, click, setTheme, labels, openRecord, die, viewport, scrollAt, touchProbe, THEIRS, OURS_LOCAL, QUERY } from './lib.mjs';

const DEFAULT_QUERIES = {
  fixed: {
    packaging: QUERY,
    ict: 'A method for scheduling uplink transmissions in a 5G base station to reduce latency for many small devices',
    short: 'FinFET gate',
    long: 'We are building a fan-out wafer-level package for a power amplifier. The die sits in a moulded cavity with a copper heat slug bonded to its back side, and a redistribution layer routes the pads to solder balls. The problem we are solving is warpage and delamination during reflow, which we address with a stress-buffer layer between the mould compound and the slug.',
    number: 'US9000581B2',
  },
  edge: {
    oneWord: 'transistor',
    veryLong: ('A semiconductor device comprising a substrate, a channel region, a gate dielectric and a gate electrode, wherein the gate electrode wraps around the channel on three sides and the dielectric has a high permittivity. ').repeat(4),
    nonsense: 'qwzx plorb flimm vantadrex',
    fewHits: 'biodegradable chewing gum wrapper',
    numberEP: 'EP2214203A2',
    numberApp: 'US20130270686A1',
    numberMalformed: 'US12-345',
    numberMissing: 'US99999999B2',
  },
};
const JOURNEYS = ['first-visit', 'reading', 'patent-number', 'errors', 'return', 'field-switch', 'take-out', 'keyboard'];

const a = args();
const VP = viewport(a.viewport || 'desktop');
const target = a.target || 'theirs';
const url = target === 'ours' ? (a.url || OURS_LOCAL) : THEIRS;
const dark = !a['no-dark'];
const only = a.queries ? String(a.queries).split(',') : null;   /* rerun just these query keys */
const want = k => !only || only.includes(k);
const qfile = path.join(roundDir(a.round), 'queries.json');
if (!fs.existsSync(qfile)) { fs.writeFileSync(qfile, JSON.stringify(DEFAULT_QUERIES, null, 2)); console.log('wrote default queries to', qfile); }
const Q = JSON.parse(fs.readFileSync(qfile, 'utf8'));
const which = a.journey === 'all' || !a.journey ? JOURNEYS : String(a.journey).split(',');
for (const j of which) if (!JOURNEYS.includes(j)) die(`unknown journey ${j}; one of ${JOURNEYS.join(', ')}`);

let searches = 0;

/* ── one journey's recorder ─────────────────────────────────────────────── */
function recorder(page, journey) {
  const dir = roundDir(a.round, 'audit', VP.name === 'desktop' ? target : `${target}-${VP.name}`, journey);
  const log = [`# ${journey} · ${target}`, '', `${new Date().toISOString()} · ${url}`, ''];
  let n = 0;
  const layers = () => page.evaluate(() => [...document.querySelectorAll('[role=dialog],[role=menu],[role=listbox],[role=alert],[role=status],dialog[open],[popover]')]
    .filter(e => e.offsetParent || e.matches(':popover-open'))
    .map(e => e.innerText.trim().replace(/\n+/g, ' ⏎ ').slice(0, 600)).filter(Boolean));
  return {
    dir, log,
    async step(tag, fn, { note = '' } = {}) {
      const t0 = Date.now();
      let err = null;
      try { await fn?.(); } catch (e) { err = e.message.split('\n')[0]; }
      const ms = Date.now() - t0;
      n++;
      const stem = `${String(n).padStart(2, '0')}-${tag}`;
      await page.screenshot({ path: path.join(dir, `${stem}-light.png`) }).catch(() => {});
      fs.writeFileSync(path.join(dir, `${stem}.txt`), await page.evaluate(() => document.body.innerText).catch(() => ''));
      if (dark) {
        await setTheme(page, 'dark');
        await page.screenshot({ path: path.join(dir, `${stem}-dark.png`) }).catch(() => {});
        await setTheme(page, 'light');
      }
      log.push(`## ${stem}`, '', `URL: ${page.url()} · ${ms} ms${note ? ' · ' + note : ''}`, '');
      if (err) log.push(`FAILED: ${err}`, '');
      const l = await layers().catch(() => []);
      if (l.length) log.push('Open layers:', ...l.map(t => `> ${t}`), '');
      const head = await page.evaluate(() => document.body.innerText.slice(0, 400).replace(/\n+/g, ' ⏎ ')).catch(() => '');
      log.push(`Top of page: ${head}`, '');
      log.push('Controls: ' + (await labels(page).catch(() => [])).filter(x => !/^(Drawing|Figure) \d|more drawings|^Open US|^View details/.test(x)).join(' · '), '');
      return !err;
    },
    write() { log.push(`Searches on ${target} in this journey so far: ${searches}`, ''); fs.writeFileSync(path.join(dir, 'log.md'), log.join('\n')); },
  };
}

/* Submit and time it. The wait ends when the head of the list says how many
   matched, which both builds print; the elapsed time is the founder's wait. */
/* ON THE RESULTS PAGE THE BOX IS FOLDED into a button carrying the last query
   ("Expand search box: …" on theirs, "Edit your search: …" on ours). Typing
   into the hidden textarea behind it changes nothing, and Search reruns the
   old query: so unfold first, and check the box really holds the new text.

   The wait ends on the answer, not on a word already on the page: theirs is
   timed to its search API's response; ours, in-page, to the results head
   changing. Both are the founder's wait. */
async function submit(page, text) {
  await click(page, /^(Expand search box|Edit your search)/, 600);
  const box = page.locator('textarea:visible, input[type=search]:visible').first();
  await box.fill(text);
  const held = await box.inputValue().catch(() => '');
  if (held !== text) throw new Error(`the search box did not take the query (holds ${JSON.stringify(held.slice(0, 40))})`);
  const before = await page.evaluate(() => document.body.innerText.slice(0, 2000));
  const t0 = Date.now();
  const answered = target === 'theirs'
    ? page.waitForResponse(r => /\/api\/Search\//.test(r.url()), { timeout: 45000 }).catch(() => null)
    : page.waitForFunction(b => document.body.innerText.slice(0, 2000) !== b, before, { timeout: 45000 }).catch(() => null);
  await click(page, /^Search$/, 0);
  searches++;
  await answered;
  const ms = Date.now() - t0;
  await page.waitForTimeout(1500);
  return ms;
}

async function home(page) { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); await page.waitForTimeout(1500); }

/* ── the journeys ───────────────────────────────────────────────────────── */
const J = {
  async 'first-visit'(page, r) {
    await r.step('landing', () => home(page));
    await r.step('scroll-home', async () => { await page.mouse.wheel(0, 900); await page.waitForTimeout(800); });
    await page.mouse.wheel(0, -2000);
    await r.step('field-picked', () => click(page, /^Semiconductor devices$/));
    await r.step('typed', () => page.locator('textarea:visible').first().fill(Q.fixed.packaging));
    let ms = 0;
    await r.step('first-results', async () => { ms = await submit(page, Q.fixed.packaging); });
    r.log.push(`Wait from Search to results: ${ms} ms`, '');
    await r.step('drawings-settled', () => page.waitForTimeout(6000));
  },

  async reading(page, r) {
    await home(page);
    await submit(page, Q.fixed.packaging);
    await r.step('record', () => openRecord(page));
    await r.step('next-patent', () => click(page, /^Next patent/, 3000));
    await r.step('next-patent-2', () => click(page, /^Next patent/, 3000));
    await r.step('previous-patent', () => click(page, /^Previous patent/, 3000));
    await r.step('lightbox', async () => {
      const f = page.locator('button[aria-label^="Open figure"]:visible, button[aria-label$="open it larger"]:visible').first();
      if (!(await f.count())) throw new Error('no figure control');
      await f.click(); await page.waitForTimeout(2500);
    });
    await r.step('lightbox-next', async () => { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1500); });
    await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    await r.step('group-open', () => click(page, /^Group the results$/, 15000));
    await r.step('group-leaf', async () => {
      const leaf = page.locator('[role=checkbox]:visible').first();
      if (!(await leaf.count())) throw new Error('no group leaf');
      await leaf.click(); await page.waitForTimeout(2500);
    });
    await page.keyboard.press('Escape'); await page.waitForTimeout(400);
    await r.step('group-cleared', async () => { if (!(await click(page, /^Remove group|^Clear/i, 1500))) throw new Error('no way to clear the group found by label'); });
    await r.step('sort-menu', () => click(page, /^(Relevance|Sort the list)$/));
    await r.step('sort-newest', () => click(page, /^Newest/, 2500));
    await r.step('find-similar', () => click(page, /^Find similar$/, 10000));
    await r.step('restore-order', () => click(page, /^Restore the original order$/, 3000));
    await r.step('scroll-list', async () => { await page.mouse.move(360, 600); for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 2000); await page.waitForTimeout(700); } });
    const cards = await page.locator('button[aria-label^="View details"], button[aria-label*="Open the record"]').count();
    r.log.push(`Result cards in the DOM after scrolling: ${cards}`, '');
    await r.step('list-end', async () => { for (let i = 0; i < 20; i++) { await page.mouse.wheel(0, 4000); await page.waitForTimeout(300); } await page.waitForTimeout(2000); });
    await r.step('drawings-only', async () => { await page.evaluate(() => scrollTo(0, 0)); await click(page, /^Drawings only$/, 4000); });
  },

  async 'patent-number'(page, r) {
    await home(page);
    await r.step('mode-toggle', async () => { if (!(await click(page, /^Patent number$/))) throw new Error('no patent-number mode; one box for both'); });
    for (const [k, v] of [['known', Q.fixed.number], ['ep', Q.edge.numberEP], ['application', Q.edge.numberApp], ['malformed', Q.edge.numberMalformed], ['missing', Q.edge.numberMissing]]) {
      if (!want(k)) continue;
      let ms = 0;
      await r.step(`number-${k}`, async () => { ms = await submit(page, v); }, { note: v });
      r.log.push(`Wait for ${v}: ${ms} ms`, '');
      if (k === 'known') await r.step('number-known-similar', () => click(page, /^Find similar$/, 8000));
      await page.evaluate(() => scrollTo(0, 0));
    }
  },

  async errors(page, r) {
    await home(page);
    for (const [k, v] of [['one-word', Q.edge.oneWord], ['very-long', Q.edge.veryLong], ['nonsense', Q.edge.nonsense], ['few-hits', Q.edge.fewHits]]) {
      if (!want(k)) continue;
      let ms = 0;
      await r.step(`query-${k}`, async () => { ms = await submit(page, v); });
      r.log.push(`Wait for ${k}: ${ms} ms`, '');
    }
    await r.step('empty-submit', async () => { await page.locator('textarea:visible').first().fill(''); await click(page, /^Search$/, 1500); });
    if (target === 'theirs' && want('slow')) {
      /* A slow service, simulated: their search API held for eight seconds.
         What the founder sees at one second and at four is the finding. */
      await page.route(/\/api\/Search\//, async route => { await new Promise(res => setTimeout(res, 8000)); await route.continue(); });
      await page.locator('textarea:visible').first().fill(Q.fixed.short);
      await click(page, /^Search$/, 0); searches++;
      await r.step('slow-1s', () => page.waitForTimeout(1000));
      await r.step('slow-4s', () => page.waitForTimeout(3000));
      await r.step('slow-done', () => page.waitForTimeout(8000));
      await page.unroute(/\/api\/Search\//);
      await page.route(/\/api\/Patent\/GetPatentDrawings/, route => route.abort());
      await r.step('drawings-fail', async () => { await openRecord(page).catch(() => {}); await page.waitForTimeout(4000); }, { note: 'drawing requests aborted' });
      await page.unroute(/\/api\/Patent\/GetPatentDrawings/);
    } else r.log.push('Slow-network and failed-drawing steps skipped on ours: the engine is in-page.', '');
  },

  async return(page, r, ctx, browser) {
    await home(page);
    await submit(page, Q.fixed.packaging);
    await openRecord(page).catch(() => {});
    await r.step('before-leaving');
    await r.step('browser-back', async () => { await page.goBack({ waitUntil: 'networkidle' }).catch(() => {}); await page.waitForTimeout(2000); });
    await r.step('browser-forward', async () => { await page.goForward({ waitUntil: 'networkidle' }).catch(() => {}); await page.waitForTimeout(2000); });
    await r.step('reload', async () => { await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(2500); });
    const state = await ctx.storageState();
    const ctx2 = await browser.newContext({ storageState: state, viewport: { width: VP.width, height: VP.height }, deviceScaleFactor: VP.scale, isMobile: !!VP.isMobile, hasTouch: !!VP.hasTouch, ...(VP.userAgent ? { userAgent: VP.userAgent } : {}), locale: 'en-US' });
    await ctx2.route(/posthog/i, x => x.abort());
    const p2 = await ctx2.newPage();
    const r2 = recorder(p2, 'return');
    r2.log.length = 0;
    await r2.step('next-day', async () => { await p2.goto(url, { waitUntil: 'networkidle' }); await p2.waitForTimeout(2000); });
    r.log.push(...r2.log.map(x => x.replace(/^## (\d+)/, '## later-$1')));
    const ls = Object.fromEntries(state.origins.flatMap(o => o.localStorage.map(i => [i.name, i.value.slice(0, 120)])));
    r.log.push('Browser storage kept between visits:', '```', JSON.stringify(ls, null, 2), '```', '');
    await ctx2.close();
  },

  async 'field-switch'(page, r) {
    await home(page);
    await submit(page, Q.fixed.packaging);
    await r.step('before-switch');
    await r.step('field-control', async () => { if (!(await click(page, /^Change search domain$/))) if (!(await click(page, /^New search$/, 2000))) throw new Error('no field control'); });
    await r.step('field-picked', async () => {
      if (!(await click(page, /Information & Communication|Digital communication/i, 2000))) throw new Error('no second field to pick');
    });
    const kept = await page.locator('textarea:visible').first().inputValue().catch(() => '');
    r.log.push(`Query text after the switch: ${kept ? JSON.stringify(kept.slice(0, 60)) : '(empty)'}`, '');
    let ms = 0;
    await r.step('second-field-results', async () => { ms = await submit(page, Q.fixed.ict); });
    r.log.push(`Wait: ${ms} ms`, '');
  },

  async 'take-out'(page, r, ctx) {
    await home(page);
    await submit(page, Q.fixed.packaging);
    await openRecord(page).catch(() => {});
    const dl = [];
    page.on('download', async d => {
      const f = path.join(r.dir, 'download-' + d.suggestedFilename());
      await d.saveAs(f).catch(() => {});
      dl.push(f);
    });
    await r.step('export-menu', () => click(page, /^Export this record$/));
    await r.step('export-csv', () => click(page, /^CSV$/, 2500));
    await r.step('export-menu-2', () => click(page, /^Export this record$/));
    await r.step('export-md', () => click(page, /^Markdown$/, 2500));
    await r.step('copy-citation', () => click(page, /^Copy citation$/, 1200));
    const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => '')).catch(() => '');
    r.log.push('Clipboard after Copy citation:', '```', clip, '```', '');
    const out = await page.locator('a:visible', { hasText: /IPtech/ }).first().getAttribute('href').catch(() => null);
    r.log.push(`Open in IPtech goes to: ${out || '(not found)'}`, '');
    await r.step('star', async () => {
      const s = page.locator('button[aria-label^="Star"]:visible');
      if (!(await s.count())) throw new Error('no star control: nothing can be collected');
      for (const b of (await s.all()).slice(0, 3)) { await b.click(); await page.waitForTimeout(500); }
    });
    await r.step('starred-set', async () => { if (!(await click(page, /starred set/i, 2500))) throw new Error('no starred set'); });
    await r.step('starred-download', async () => { if (!(await click(page, /^Download CSV$/, 2500))) throw new Error('no set download'); });
    await page.waitForTimeout(1500);
    for (const f of dl) {
      const head = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').slice(0, 6).join('\n') : '(not saved)';
      r.log.push(`Downloaded ${path.basename(f)}:`, '```', head, '```', '');
    }
  },

  async keyboard(page, r) {
    await home(page);
    /* Each Tab is a stop. A stop whose element has no visible outline,
       box-shadow or border change under :focus-visible is recorded as
       invisible; one that lands on <body> means focus was lost. */
    const probe = () => page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return { where: 'body (focus lost)', visible: false };
      const s = getComputedStyle(e);
      /* a ring drawn as a fully transparent shadow is no ring: count a shadow
         only when one of its colours has alpha above zero */
      const shadow = s.boxShadow && s.boxShadow !== 'none' && (s.boxShadow.match(/rgba?\([^)]*\)|oklab\([^)]*\)/g) || []).some(c => !/,\s*0\)$|\/\s*0\)$/.test(c));
      const visible = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || shadow;
      return { where: (e.getAttribute('aria-label') || e.innerText || e.placeholder || e.tagName).trim().replace(/\s+/g, ' ').slice(0, 70), visible };
    });
    const tabs = async (count, tag) => {
      const stops = [];
      for (let i = 1; i <= count; i++) {
        await page.keyboard.press('Tab'); await page.waitForTimeout(150);
        const p = await probe();
        stops.push(`${i}. ${p.where}${p.visible ? '' : '  ← NOT VISIBLE'}`);
        if (i % 4 === 0 || !p.visible) await page.screenshot({ path: path.join(r.dir, `tab-${tag}-${String(i).padStart(2, '0')}.png`) });
      }
      r.log.push(`### Tab order · ${tag}`, '', ...stops, '');
    };
    await tabs(16, 'home');
    await r.step('typed-and-enter', async () => {
      await page.locator('textarea:visible').first().focus();
      await page.keyboard.type(Q.fixed.short);
      await page.keyboard.press('Enter');          /* does Enter submit, or add a line? */
      await page.waitForTimeout(2000);
    });
    const sent = /\d+\s+matched/.test(await page.evaluate(() => document.body.innerText));
    r.log.push(`Enter in the search box submitted: ${sent ? 'yes' : 'no'}`, '');
    if (!sent) { await click(page, /^Search$/, 0); }
    searches++;
    await page.waitForTimeout(6000);
    await tabs(24, 'results');
    await r.step('escape', async () => { await page.keyboard.press('Escape'); await page.waitForTimeout(600); });
    await r.step('shortcut-j', async () => { await page.keyboard.press('j'); await page.waitForTimeout(800); }, { note: 'j/k move through results on ours' });
  },
};

for (const journey of which) {
  const { browser, ctx, page } = await open({ theme: 'light', viewport: VP.name });
  const r = recorder(page, journey);
  try { await J[journey](page, r, ctx, browser); }
  catch (e) { r.log.push(`JOURNEY STOPPED: ${e.message.split('\n')[0]}`, ''); }
  r.write();
  console.log(`${journey}: done · searches so far ${searches}`);
  await browser.close();
}
console.log(`total searches on ${target}: ${searches}`);
