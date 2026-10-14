/* core/search-mode — what the founder typed is a description or a number.
 * platform.md §3.2.
 *
 * ONE VALUE, TWO COMPOSERS. The home composer and the results bar are the
 * same component in two places, and a mode each of them kept for itself
 * would let the founder press "Patent number" on one and search the other
 * as a description. So the value lives here, every control that carries
 * [data-search-mode] reflects it, and both callers read get() into the one
 * request they send.
 *
 * THE BOX SAYS WHICH IT IS. The placeholder and the accessible name change
 * with the mode, because a field whose label still asks for a description
 * while it expects EP2214203A2 is a field that will be filled wrongly.
 */
const MODES = {
  text: {
    label: 'Describe what you are building',
    placeholder: 'For example: a folding drone arm that locks without a latch',
  },
  number: {
    label: 'A patent publication or grant number',
    placeholder: 'For example: EP2214203A2',
  },
};

let mode = 'text';

export function get() { return mode; }

export function set(next) {
  if (!MODES[next]) return;
  mode = next;
  document.querySelectorAll('[data-search-mode]').forEach(b =>
    b.setAttribute('aria-pressed', String(b.getAttribute('data-search-mode') === mode)));
  document.querySelectorAll('#cmpMain textarea, #resQuery').forEach(t => {
    t.setAttribute('aria-label', MODES[mode].label);
    t.setAttribute('placeholder', MODES[mode].placeholder);
  });
}

/* A NUMBER THAT IS NOT IN THE INDEX IS AN ANSWER, not an outage, and it gets
   its own sentence: the number echoed, what to check, and the way out. Both
   composers say the same thing about the same refusal, so it is here. An
   empty string means "not this case": the caller's general failure stands. */
export function notFound(res, text) {
  if (mode !== 'number' || !res || res.code !== 'NOT_FOUND') return '';
  return 'No patent matches ' + text + '. Check the office code and the number, '
    + 'or switch to Text to search for it as a description.';
}
