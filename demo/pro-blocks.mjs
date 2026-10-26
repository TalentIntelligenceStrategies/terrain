/* pro-blocks — an illustrative Pro result: seven sections, every block kind
 * at least once. The demo engine's proQuote and proResult answer with it,
 * the report template draws it (?blocks=demo), and the package's
 * contract/examples/pro-result-blocks.json is printed from it, so the three
 * cannot drift apart.
 *
 * THE CONTENT IS INVENTED AND IS NOT A SPEC. It reads a fictional folding
 * drone frame against three fictional starred patents, refs 1 to 3, and
 * names no holder. Which sections there are and what they say are the
 * engine's (components.md §1); this shows only the shapes the report lays
 * out. Readings use *may*; a checkable fact is tagged C, an outside one O
 * with its source. */

const S = (text, cites, tag, source) => ({ text, cites, ...(tag ? { tag } : {}), ...(source ? { source } : {}) });

export const SECTIONS = [
  { key: 'closest', title: 'Closest claims', question: 'Where does each feature of the idea meet the nearest claims?' },
  { key: 'differ', title: 'Where the idea may differ', question: 'What changes may take the idea away from the closest claims?' },
  { key: 'described', title: 'What’s already described', question: 'Which parts of a product do the claims in the set reach?' },
  { key: 'holders', title: 'Other holders in the set', question: 'Who else holds patents here, and what do they cover?' },
  { key: 'risks', title: 'Risk flags', question: 'What should be checked before building or backing the idea?' },
  { key: 'conclusion', title: 'Conclusion', question: 'How close is the nearest claim, and what must be checked?' },
  { key: 'each', title: 'Each patent in plain English', question: 'What does each starred patent protect?' },
];

export const RESULT = {
  /* one line per answer, for At a glance; optional, and left out when absent */
  summary: [
    S('Claim 1 of [2] may come nearest, at the arm hinge (§closest).', [{ ref: 2, claim: 1 }]),
    S('Whether [3] was granted is not recorded (Ex:status).', [{ ref: 3 }], 'C'),
  ],
  sections: [
    { key: 'closest', blocks: [
      { kind: 'chart', cols: [2, 1], rows: [
        { label: 'Folds at the arm root', cells: [
          { mark: 'present', why: S('Claim 1 recites a hinge at each arm’s root [2].', [{ ref: 2, claim: 1 }], 'C') },
          { mark: 'unclear', why: S('Claim 1 recites a pivot, and may or may not place it at the root [1].', [{ ref: 1, claim: 1 }]) } ] },
        { label: 'Arms carry the load when open', cells: [
          { mark: 'absent', why: S('No element of claim 1 recites a load [2].', [{ ref: 2, claim: 1 }], 'C') },
          { mark: 'present', why: S('Claim 1 recites a strut that locks under load [1].', [{ ref: 1, claim: 1 }], 'C') } ] } ] },
      { kind: 'p', sentences: [
        S('Claim 1 of [2] has three elements.', [{ ref: 2, claim: 1 }], 'C'),
        S('Its hinge may not reach a frame that folds at mid-arm [2].', [{ ref: 2, claim: 1 }]) ] } ] },
    { key: 'differ', blocks: [
      { kind: 'list', numbered: true, items: [
        S('Moving the fold to mid-arm may take the idea away from claim 1 of [2] (§closest).', [{ ref: 2, claim: 1 }]),
        S('A frame without a locking strut may sit outside claim 1 of [1].', [{ ref: 1, claim: 1 }]) ] } ] },
    { key: 'described', blocks: [
      { kind: 'matrix', cols: [1, 2, 3], rows: [
        { label: 'Airframe', on: [1, 2] }, { label: 'Arm lock', on: [1] }, { label: 'Flight software', on: [] } ] },
      { kind: 'p', sentences: [S('No claim 1 in this set reaches flight software [1][2][3].', [{ ref: 1 }, { ref: 2 }, { ref: 3 }], 'C')] } ] },
    { key: 'holders', blocks: [
      { kind: 'table', head: ['Holder', 'Patents', 'What their claims may cover'], rows: [
        ['Holder A', S('[1] [3]', [{ ref: 1 }, { ref: 3 }]), S('Both may cover a strut that locks the arm open [1][3].', [{ ref: 1 }, { ref: 3 }])],
        ['Holder B', S('[2]', [{ ref: 2 }]), S('A hinge at the arm root [2].', [{ ref: 2, claim: 1 }], 'C')] ] },
      { kind: 'bars', base: 4, rows: [
        { label: S('Elements in claim 1 of [1]', [{ ref: 1, claim: 1 }]), n: 4 },
        { label: S('Elements in claim 1 of [2]', [{ ref: 2, claim: 1 }]), n: 3 } ] } ] },
    { key: 'risks', blocks: [
      { kind: 'list', numbered: true, items: [
        S('[3] is an application; its claims may change before grant (Ex:status).', [{ ref: 3 }], 'C'),
        S('[1] may have changed owner since filing.', [{ ref: 1 }], 'O', { name: 'Assignment records' }) ] } ] },
    { key: 'conclusion', blocks: [
      { kind: 'answers', items: [
        { head: 'How close is the nearest claim?', says: [S('Claim 1 of [2] may come nearest, at the hinge (§closest, Ex:holders).', [{ ref: 2, claim: 1 }])], ask: 'Has the team filed on a mid-arm fold?' },
        { head: 'What is open?', says: [S('No claim 1 here reaches flight software (§described).', [{ ref: 1 }, { ref: 2 }, { ref: 3 }], 'C')] } ] },
      { kind: 'checklist', items: [
        { text: S('Whether [3] was granted, and with what claims.', [{ ref: 3 }], 'C'), section: 'closest' },
        { text: S('Who holds [1] today.', [{ ref: 1 }], 'O', { name: 'Assignment records' }), section: 'holders' } ] } ] },
    { key: 'each', blocks: [
      { kind: 'patent', ref: 2,
        plain: S('A drone frame whose arms fold at the root [2].', [{ ref: 2 }]),
        claim1: S('A frame, four arms, and a hinge at each arm’s root that locks open [2].', [{ ref: 2, claim: 1 }]),
        abstractReadsBroader: { abstract: 'A foldable drone frame.', adds: ['a hinge at each arm’s root', 'that locks open'] } },
      { kind: 'patent', ref: 1,
        plain: S('A drone arm held open by a locking strut [1].', [{ ref: 1 }]),
        claim1: S('An arm, a pivot, and a strut that locks under load [1].', [{ ref: 1, claim: 1 }]) } ] },
  ],
};
