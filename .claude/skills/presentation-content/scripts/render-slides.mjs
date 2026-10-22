/* Render deck slides locally to PNG for review: node render-slides.mjs <projectDir> <blobDir> <outDir> [id...] */
import { open } from '../../terrain-round/scripts/lib.mjs';
import fs from 'node:fs';
import path from 'node:path';
const [proj, blobs, out, ...only] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const deck = JSON.parse(fs.readFileSync(path.join(proj, 'deck.json'), 'utf8'));
const ids = only.length ? only : deck.order;
const { browser, page } = await open({ width: 1920, height: 1080, theme: 'light' });
const css = `*{margin:0;padding:0;box-sizing:border-box} body{width:1920px;height:1080px;overflow:hidden}
section{position:relative;width:1920px;height:1080px;overflow:hidden} aside{display:none} section > *{position:relative}
x-shape{display:block;border-radius:50%} x-icon{display:inline-block;border:2px solid currentColor;border-radius:6px}
table{border-collapse:separate;border-spacing:0;overflow:hidden} th,td{padding:18px 28px;border-bottom:1px solid #e4e4e4} th{font-weight:600}`;
for (const id of ids) {
  let html = fs.readFileSync(path.join(proj, 'slides', id + '.html'), 'utf8');
  html = html.replace(/\/_blob\/([0-9a-f]{32})/g, (m, id) => 'file://' + path.resolve(blobs) + '/' + (fs.existsSync(path.join(blobs, id + '.svg')) ? id + '.svg' : id));
  const doc = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${deck.faces.urbanist.href}"><style>${css}</style></head><body>${html}</body></html>`;
  const f = path.join(out, id + '.src.html');
  fs.writeFileSync(f, doc);
  await page.goto('file://' + path.resolve(f));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(out, (deck.order.indexOf(id) + 1).toString().padStart(2, '0') + '-' + id + '.png') });
}
await browser.close();
