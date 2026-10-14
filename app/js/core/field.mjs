/* core/field — the technology field a search runs in. platform.md §3.1, §4.2.
 *
 * ONE VALUE, TWO PLACES TO CHOOSE IT. The home surface chooses it with the
 * tiles; the results bar carries it as a chip at its leading edge, so the
 * field is on screen while the founder reads what it returned and can be
 * changed without going back. A field each kept for itself is how the bar
 * searched without one at all (components.md §4 question 10), so it lives
 * here, both send get(), and set() repaints every control that shows it.
 *
 * THE LIST IS THE ENGINE'S. `fields` returns it once, home.mjs hands it over,
 * and a field that is not ready is listed and refused, the way its tile is.
 */
import { esc } from './dom.mjs';

let FIELDS = [];
let current = null;

export function get() { return current; }

/** the chosen field's label, or null while the list has not loaded */
export function label() {
  const f = FIELDS.find(x => x.id === current);
  return f && f.label != null ? f.label : null;
}

export function setList(list) {
  FIELDS = Array.isArray(list) ? list : [];
  paint();
}

export function set(id) {
  const f = FIELDS.find(x => x.id === id);
  if (f && f.ready !== true) return;
  current = id;
  paint();
}

function paint() {
  document.querySelectorAll('#fields .field[aria-pressed]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.getAttribute('data-field') === current)));
  const name = document.getElementById('resFieldName');
  if (name) name.textContent = label() || 'Field';
  const btn = document.getElementById('resField');
  if (btn) btn.setAttribute('aria-label', 'Technology field: ' + (label() || 'not chosen') + '. Change it.');
  const pop = document.getElementById('resFieldPop');
  if (pop) pop.innerHTML = FIELDS.map(f => {
    const ready = f.ready === true;
    return '<button class="lm-item" type="button" role="menuitemradio" data-field-pick="' + esc(f.id) + '"'
      + ' aria-checked="' + String(f.id === current) + '"'
      + (ready ? '' : ' aria-disabled="true"') + '>'
      + '<span class="lm-tick"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
      + ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></span>'
      + '<span>' + esc(f.label == null ? 'Field' : f.label) + '</span>'
      + (ready ? '' : '<span class="lm-soon t-micro">Coming soon</span>')
      + '</button>';
  }).join('');
}
