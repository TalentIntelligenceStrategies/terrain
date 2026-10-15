/* core/format — two fields printed the same way on every surface.
 * design-language.md §4 *Case*, platform.md §13.4 R1-13 and R1-31.
 *
 * THE JURISDICTION IS A TWO-LETTER CODE on every data surface: the row, the
 * record, the coverage table, the starred set and both downloads. One fact in
 * two spellings (*United States* on one surface, *US* on the next) reads as
 * two facts. The number's own office prefix is the code the document was
 * published under, so it wins; a name is mapped only when the number is
 * withheld, and an unknown name is printed as given rather than guessed.
 * Search settings keep the names, because there they label a choice.
 *
 * A HOLDER IS ONE OF THREE THINGS, and the contract keeps them apart the way
 * `figures` does (ports.mjs). A string is the holder. `null` is a holder the
 * engine holds and declines to print, and renders the skeleton bar. `''` is a
 * patent that names no assignee at all, which is a fact about the patent,
 * and prints *No assignee listed*. A bar there would claim something was
 * being withheld.
 */
const CODES = { 'United States': 'US', China: 'CN', Taiwan: 'TW', Europe: 'EP',
  Korea: 'KR', Japan: 'JP', Australia: 'AU', WIPO: 'WO' };

/** a name as its code, or the name when it has none */
export function codeOf(name) {
  return name == null ? null : (CODES[name] || name);
}

/** a patent's jurisdiction as a code, or null when neither the number nor
 *  the jurisdiction is held */
export function where(rec) {
  const m = /^([A-Z]{2})/.exec(String(rec.number || ''));
  return m ? m[1] : codeOf(rec.where);
}

export const NO_ASSIGNEE = 'No assignee listed';

/** true when the patent names no assignee, as opposed to one withheld */
export const noAssignee = holder => holder === '';

/** the holder as text: the name, the no-assignee sentence, or null for a
 *  withheld one, which the caller renders as a bar */
export function holderText(holder) {
  return noAssignee(holder) ? NO_ASSIGNEE : holder;
}
