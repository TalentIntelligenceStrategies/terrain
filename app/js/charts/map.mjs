/* charts/map — technology across, holders down.
 *
 * PORTED rather than extracted, and it is the only one. The prototype's
 * matrixHTML reads five module-level globals — DATA, mxRows, COL_LBL, MX_SEL
 * and axisScope() — so extracting it verbatim would have dragged the data layer
 * across with it, and app/js/** holds no data. Everything it read is a
 * parameter here; nothing else about it moved.
 *
 * ═══ TWO CHANNELS AND NO MORE ══════════════════════════════════════════════
 * TONE IS THE COUNT. THE CORNER HATCH IS "RISING". design-language.md §3.4 owns
 * the ramp and §3.7 owns the marks; nothing in this file introduces a colour.
 *
 * THE RAMP IS TONAL AND STAYS TONAL. A green cell would say the territory is
 * open and a red one would say it is crowded, and the interface may not imply
 * WHY a cell is empty — brief.md §1. An empty cell means THIS HOLDER HAS NOT
 * FILED against that approach. That is a fact about them, not about the
 * technology, and it is the one claim this grid is allowed to make.
 *
 * ═══ THE ROW LABEL IS TESTED ON THE ROW, NOT ON THE SET ════════════════════
 * It was `populated ? row.label : bar`, which is the same answer while every
 * populated row is named — and the holder axis is a POPULATED SET WHOSE ROWS
 * ARE DELIBERATELY UNNAMED. Reading the set printed the word "null" in eight
 * cells. components.md §1 gives the map's holders no label field at all.
 */
import { esc } from '../core/dom.mjs';
import { band, bandRow, maxOf } from './primitives.mjs';

/** what the cells in one column sum to, across the rows on screen */
export function colTotal(rows, c) {
  return rows.reduce((t, row) => t + (row.counts ? row.counts[c] : 0), 0);
}

/**
 * matrixHTML(model) -> string
 *
 * model = { cols:string[], rows:{label:null, counts:number[], rising?:number[]}[],
 *           shown:number, selected:number|null, populated:boolean }
 *
 * THE DENSITY BAND IS DERIVED HERE, relative to THIS VIEW'S OWN MAXIMUM, and
 * never sent by the engine. An engine that sent a tone would be deciding what
 * "dark" means for a grid whose size it cannot see — and the same counts drawn
 * over eight holders and over eighty need different cuts to say the same thing.
 */
export function matrixHTML(model) {
  const { cols, rows, shown, selected = null, populated = true } = model;
  const max = maxOf(rows.map(r => ({ n: r.counts })));
  const banded = rows.map(r => ({ ...r, d: bandRow(r.counts || [], max) }));

  let html = '<div class="mx-corner"></div>';

  cols.forEach((label, c) => {
    const on = selected === c;
    const n = colTotal(rows, c);
    html += '<div class="mx-col"' + (on ? ' data-mxsel' : '') + '>'
      + (populated
        ? '<button type="button" class="mx-col-btn" data-mxc="' + c + '"'
          + ' aria-pressed="' + on + '"'
          + ' aria-label="Follow ' + esc(label) + ' — ' + n
          + ' of ' + shown + ' patents held by the eight largest holders">'
          + '<span class="mx-col-t">' + esc(label) + '</span>'
          + '<span class="mx-col-n">' + n + '</span>'
          + '</button>'
        : '<span class="sk sk-h-micro w-md"></span>')
      + '</div>';
  });

  banded.forEach((row, r) => {
    html += '<div class="mx-row" data-r="' + r + '">'
      + (row.label
        ? '<span class="mx-row-t">' + esc(row.label) + '</span>'
        : '<span class="sk sk-h-label ' + (row.lbl || 'w-md') + '"></span>')
      + '</div>';
    row.d.forEach((d, c) => {
      const n = row.counts ? row.counts[c] : null;
      const rising = (row.rising || []).indexOf(c) > -1;
      html += '<div class="mx-cell" data-d="' + d + '" role="gridcell" tabindex="-1"'
        + ' data-rc="' + r + ',' + c + '"'
        + (selected === c ? ' data-mxsel' : '')
        + (rising ? ' data-rising' : '') + '>'
        + (populated
          ? (n > 0 ? '<span class="fig-m mx-n">' + n + '</span>' : '')
          : (d > 0 ? '<span class="sk" style="width:26px;height:10px"></span>' : ''))
        + '</div>';
    });
  });
  return html;
}

/**
 * Mount into an element, setting the grid's own custom properties.
 *
 * THE GRID'S SHAPE FOLLOWS THE DATA rather than being hard-coded to five. Each
 * of these is read with a fallback at the CSS side — a var() whose property is
 * set by nothing and whose read has no fallback is invalid at computed-value
 * time and the property takes its INITIAL value, which for a grid template is
 * not the shape you wanted and is silent about it.
 */
export function mountMatrix(el, model) {
  if (!el) return;
  const n = model.cols.length;
  el.style.setProperty('--mx-n', n);
  if (model.populated !== false) {
    el.style.setProperty('--mx-head', '176px');
    el.style.setProperty('--mx-min', (176 + n * 96) + 'px');
  }
  el.innerHTML = matrixHTML(model);
  /* roving tabindex: one tab stop for the whole grid, and it moves with focus
     so leaving and returning lands where the founder was */
  const first = el.querySelector('.mx-cell');
  if (first) first.setAttribute('tabindex', '0');
}

/**
 * The legend — a density scale and a hatch, and NO STATE NAMES.
 *
 * The three named zones — Crowded, Emerging, Open — were dropped on 2026-09-10
 * and must not come back. "Open" is precisely the claim brief.md §1 forbids:
 * an empty cell says this holder has not filed there, not that the territory is
 * unclaimed. A legend that names the zones makes the stronger claim in one word
 * and puts it under the chart where it reads as a key rather than as an
 * argument.
 */
export function mxLegendHTML(hint) {
  return '<span class="lg lg-ramp">'
    + '<span class="lg-sw" style="background:var(--density-0)"></span>'
    + '<span class="lg-sw" style="background:var(--density-2)"></span>'
    + '<span class="lg-sw" style="background:var(--density-4)"></span>'
    + 'Fewer → more filings</span>'
    + '<span class="lg"><span class="lg-sw hatch"></span>Rising</span>'
    + (hint ? '<span class="lg" style="margin-left:auto;color:var(--text-3)">'
      + esc(hint) + '</span>' : '');
}

export { band };
