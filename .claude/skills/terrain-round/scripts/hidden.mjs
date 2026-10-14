/* hidden — strings their build ships and no capture ever showed.
 *
 *   node hidden.mjs --round 2
 *
 * Reads round-N/bundle/*.js, finds the English message table (the chunk that
 * carries brand:"TIS Terrain" beside backHome), and lists every key:"value"
 * whose text appears in no log.md and no per-state .txt (the page's visible
 * text) under round-N/captures/ or round-N/audit/.
 * Writes round-N/audit/hidden.md.
 *
 * A STRING IS EVIDENCE OF A LABEL, NOT OF A FEATURE. It proves somebody wrote
 * the words; it does not prove the feature works, where it sits or that it is
 * reachable. The September inventory found three columns this way that exist
 * in the build and are never emitted, and a screenshot alone would have
 * recorded them as missing. The output says so in its first line.
 *
 * Matching is on the first 40 characters, with {placeholders} as wildcards,
 * because the logs truncate long text and fill in counts. */
import fs from 'node:fs';
import path from 'node:path';
import { args, roundDir, die } from './lib.mjs';

const a = args();
const rdir = roundDir(a.round);
const bdir = path.join(rdir, 'bundle');
if (!fs.existsSync(bdir)) die(`${bdir} does not exist; phase 1 saves the bundle`);

const files = fs.readdirSync(bdir).filter(f => f.endsWith('.js'));
const en = files.map(f => [f, fs.readFileSync(path.join(bdir, f), 'utf8')])
  .find(([, s]) => /brand:"TIS Terrain"/.test(s) && /backHome:"Back to home"/.test(s));
if (!en) die('no chunk carries the English message table (brand:"TIS Terrain" with backHome)');

/* The chunk holds both languages. The English table is the one that starts at
   the object carrying backHome:"Back to home" — take from the last group
   boundary before it to the export after it. */
const src = en[1];
const at = src.indexOf('backHome:"Back to home"');
const start = Math.max(0, src.lastIndexOf('export{', at) + 1, src.lastIndexOf(';', src.lastIndexOf('const ', at)));
const end = src.indexOf('export{', at) > 0 ? src.indexOf('export{', at) : src.length;
const table = src.slice(start, end);
const pairs = [...table.matchAll(/([A-Za-z0-9_$]+):"((?:[^"\\]|\\.)*)"/g)]
  .map(m => ({ key: m[1], text: m[2].replace(/\\n/g, ' ').replace(/\\"/g, '"') }))
  .filter(p => /[A-Za-z]{2}/.test(p.text) && !/[一-鿿]/.test(p.text));

const logs = [];
const walk = d => { if (!fs.existsSync(d)) return; for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f === 'log.md' || f.endsWith('.txt')) logs.push(fs.readFileSync(p, 'utf8')); } };
walk(path.join(rdir, 'captures')); walk(path.join(rdir, 'audit'));
if (!logs.length) die('no log.md or .txt under captures/ or audit/ yet; run capture.mjs or audit.mjs first');
const seen = logs.join('\n').replace(/\s+/g, ' ').toLowerCase();

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const shown = t => {
  const head = t.slice(0, 40).toLowerCase();
  const re = new RegExp(head.split(/\{[^}]*\}/).map(x => esc(x.trim())).filter(Boolean).join('.{0,40}'));
  return re.test(seen);
};
const hidden = pairs.filter(p => !shown(p.text));

const out = [
  '> **A string is evidence of a label, not of a feature.** Each row below is text their build ships',
  '> that no capture or audit log in this round shows. It may be unreachable, conditional on a state',
  '> nobody reached, or simply unused. Check before calling anything built-but-hidden.',
  '',
  `# Hidden strings · round ${a.round}`,
  '',
  `Bundle file: \`${en[0]}\` · ${pairs.length} English strings · ${hidden.length} never shown · ${logs.length} logs and text files read`,
  '',
  '| Key | Text |',
  '| --- | --- |',
  ...hidden.map(p => `| \`${p.key}\` | ${p.text.replace(/\|/g, '\\|')} |`),
  '',
];
const f = path.join(roundDir(a.round, 'audit'), 'hidden.md');
fs.writeFileSync(f, out.join('\n'));
console.log(`${hidden.length} of ${pairs.length} strings never shown → ${path.relative(process.cwd(), f)}`);
