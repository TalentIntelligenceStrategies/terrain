/* R4-23 (restores R3-21) · Result row and record, phone: the kind is text; the version is chosen under the title
 *
 * ── List (the row) ──
 * Current: below sm every row with two versions carries the "Switch
 * grant/application version" segment (136×28 at 390, Grant 49×22 |
 * Application 81×22) on a line of its own with the rank and the score, and a
 * single-version row prints a plain "Grant" in the same slot, so the slot
 * means two things. The number line, "US 9000581 B2", says nothing of the
 * kind. 27 of the 50 rows in the recorded search carry the segment.
 * Wanted:  the row says its kind as text in the number line,
 * "US 9000581 B2 · Grant", muted, in the sans face; the segment and the plain
 * kind word are not shown on the row. The version is chosen in the record.
 * Measured at 390 with the patch: the segment is not rendered (display
 * none); the number line reads "US 9000581 B2 · Grant" on one 18px line,
 * centred with the rank chip and the score (R4-22); row 5, one version,
 * reads "US … · Grant" the same way.
 *
 * ── Record (the version tabs) ──
 * Current: below sm the record's head is your sticky [data-detail-head]:
 * the actions, then the number (13px), then the title (20/26). It has no
 * version control: for US 9000581 B2, a patent with both versions, the
 * dialog holds 0 Grant/Application controls and 0 [aria-label*=version],
 * and the number line does not say the kind. The row's segment is the only
 * switch, and it is behind the modal.
 * Wanted:  where both versions exist, the version is chosen under the title
 * with two text tabs, Grant and Application, 44px tall, the current one in
 * the foreground colour with a 2px underline on the head's bottom rule; on a
 * patent with one version there are no tabs and the kind is beside the
 * number ("US … B2 · Grant"). They are in the natural tab order (R4-32).
 * Measured at 390×844 with the patch: the tabs sit under the h3, Grant 36×44
 * and Application 70×44, 24px apart; the head drops its 16px bottom padding
 * and grows from 115px to 147px. Choosing Application loads
 * US 20130313698 A1 into the same head, the head stays 147px, the tab keeps
 * the focus, and the hash reads rec=20130313698; Grant brings
 * US 9000581 B2 back the same way. The patch adds no history entry.
 *
 * Viewport: phone only (below sm, 40rem). From sm up the row keeps its
 * switch; R4-23.css hides all of this from 40rem up.
 *
 * The patch drives their own state: a pick clicks the hidden row segment of
 * the row whose number the record shows, so the card's own version handler
 * still emits "open" and the record follows. In the component the variant
 * index belongs to the record, not the card: the record head renders the
 * tabs under its title from hit.alternatives, and the card renders kind-as-text
 * from the current variant. */
(() => {
  if (window.__r4_23) return;
  window.__r4_23 = true;
  const GROUP = '[role="group"][aria-label="Switch grant/application version"]';

  /* ═══ LIST: the row's kind as text ═══ */

  /* Row: kind as text inside the number link, before its icon. */
  const rowWord = card => {
    const group = card.querySelector(GROUP);
    if (group) return group.querySelector('button[aria-pressed="true"]')?.textContent.trim() || '';
    const meta = card.querySelector('div:has(> div > span.font-mono.text-muted-foreground)');
    const only = meta && [...meta.children].find(c => c.tagName === 'SPAN' && /^(Grant|Application)$/.test(c.textContent.trim()));
    if (only) { only.setAttribute('data-r4-kind-src', ''); return only.textContent.trim(); }
    return card.querySelector('[data-r4-kind-src]')?.textContent.trim() || '';
  };
  const rowKind = card => {
    const link = card.querySelector('a[href], a[title^="Open "]');
    const word = link && rowWord(card);
    if (!word) return;
    let tag = link.querySelector('[data-r4-kind]');
    if (!tag) {
      tag = document.createElement('span');
      tag.setAttribute('data-r4-kind', '');
      link.insertBefore(tag, link.querySelector('svg'));
    }
    const t = `· ${word}`;
    if (tag.textContent !== t) tag.textContent = t;
  };

  /* ═══ RECORD: the version tabs under the title ═══ */

  /* Record: which row it is. The record's head prints the number as the row
     does ("US 9000581 B2"); the Number field drops the office and the kind
     and keeps the leading zero, so compare digits with the zeros stripped. */
  const norm = s => ((s || '').match(/\b[A-Z]{2} 0*([0-9A-Z]{5,})/) || [])[1] || '';
  const rowFor = n => (n && [...document.querySelectorAll('[data-result-card]')]
    .find(c => norm(c.querySelector('a[title^="Open "]')?.textContent) === n)) || null;

  let last = null;
  const record = d => {
    /* The phone head: your sticky [data-detail-head], its number p and its
       title h3 (inside div.min-w-0). While a version loads the h3 may be
       absent: the tabs then sit under the number. */
    const head = d.querySelector('[data-detail-head]');
    let sw = d.querySelector('[data-r4-version]');
    const num = head?.querySelector('p.font-mono');
    const title = head?.querySelector('h3') || num;
    if (!title) { sw?.remove(); return; }
    /* While the other version loads, or if it fails to, the head names no
       row: keep the tabs, and the focus on them, against the row they last
       drove, so the reader can always switch back. */
    const row = rowFor(norm(num?.textContent)) || (last?.isConnected ? last : null);
    const source = row?.querySelector(GROUP);
    /* One version: no tabs, the kind beside the number (R4-23.css draws it). */
    const word = !source && row ? rowWord(row) : '';
    if (num && (num.getAttribute('data-r4-head-kind') || '') !== word) {
      if (word) num.setAttribute('data-r4-head-kind', word); else num.removeAttribute('data-r4-head-kind');
    }
    if (!source) { sw?.remove(); return; }
    last = row;
    if (!sw) {
      sw = document.createElement('div');
      sw.setAttribute('data-r4-version', '');
      sw.setAttribute('role', 'group');
      sw.setAttribute('aria-label', 'Version');
    }
    /* Your head re-renders when the version loads: move the tabs back under
       the new title, and keep the focus on the tab that had it. */
    if (sw.previousElementSibling !== title) {
      const had = sw.contains(document.activeElement) ? [...sw.children].indexOf(document.activeElement) : -1;
      title.after(sw);
      if (had >= 0) sw.children[had]?.focus({ preventScroll: true });
    }
    const from = [...source.querySelectorAll('button')];
    const mine = [...sw.querySelectorAll('button')];
    from.forEach((b, i) => {
      let m = mine[i];
      if (!m) {
        m = document.createElement('button');
        m.type = 'button';
        m.addEventListener('click', () => {
          const r = last?.querySelectorAll(`${GROUP} button`)[i];
          if (r && r.getAttribute('aria-pressed') !== 'true') r.click();
        });
        sw.append(m);
      }
      if (m.textContent !== b.textContent.trim()) m.textContent = b.textContent.trim();
      const p = b.getAttribute('aria-pressed') === 'true' ? 'true' : 'false';
      if (m.getAttribute('aria-pressed') !== p) m.setAttribute('aria-pressed', p);
    });
    mine.slice(from.length).forEach(m => m.remove());
  };

  /* ═══ end RECORD ═══ */

  const fix = () => {
    document.querySelectorAll('[data-result-card]').forEach(rowKind);
    document.querySelectorAll('[role="dialog"][data-result-detail]').forEach(record);
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fix(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-pressed', 'href'] });
  fix();
})();
