/* R3-21 · Result row and record header, phone: the kind is text; the switch is in the record
 *
 * Current: every row carries a 49x22 / 81x22 Grant | Application segment
 * where a status chip would sit, and a single-version row prints plain
 * "Grant" in the same slot, so the slot means two things. On a phone it
 * takes a line of its own. Its purpose is only in its accessible name.
 * Wanted:  the row says its kind as text in the number line,
 * "US 09000581 B2 · Grant". The version switch is a 44px segmented control
 * in the record header, shown only where both versions exist, and it is in
 * the natural tab order (R3-37).
 * Viewport: phone only; desktop keeps the row switch (platform.md §4.3),
 * and R3-21.css hides all of this from 40rem up. The record header wraps and the switch takes
 * the header's second line at full width (R3-21.css).
 *
 * The record-header control is placed in the header row
 * (div.border-b:has(> button[aria-label="Close details"])), immediately
 * before "Find similar", as div[data-r3-version]. The left of the header,
 * the empty div.min-w-0.flex-1, is left alone for the publication number.
 *
 * The patch drives their own state: each record button clicks the hidden
 * row segment of the row whose number the record shows, so their
 * De(index) still emits "open" and the record follows. In the component the
 * variant index (d) belongs to the record, not the card: the record header
 * renders the segment from hit.alternatives, and the card renders
 * kind-as-text from the current variant. */
(() => {
  if (window.__r3_21) return;
  window.__r3_21 = true;
  const GROUP = '[role="group"][aria-label="Switch grant/application version"]';
  const digits = s => ((s || '').match(/\b[A-Z]{2} ([0-9A-Z]{5,})/) || [])[1] || '';

  /* Row: kind as text inside the number link, before its icon. */
  const rowKind = card => {
    const link = card.querySelector('a[href], a[title^="Open "]');
    if (!link) return;
    const group = card.querySelector(GROUP);
    let word = '';
    if (group) word = group.querySelector('button[aria-pressed="true"]')?.textContent.trim() || '';
    else {
      const meta = card.querySelector('div:has(> div > span.font-mono.text-muted-foreground)');
      const only = meta && [...meta.children].find(c => c.tagName === 'SPAN' && /^(Grant|Application)$/.test(c.textContent.trim()));
      if (only) { only.setAttribute('data-r3-kind-src', ''); word = only.textContent.trim(); }
    }
    if (!word) return;
    let tag = link.querySelector('[data-r3-kind]');
    if (!tag) {
      tag = document.createElement('span');
      tag.setAttribute('data-r3-kind', '');
      link.insertBefore(tag, link.querySelector('svg'));
    }
    const t = `· ${word}`;
    if (tag.textContent !== t) tag.textContent = t;
  };

  /* Record header: the switch, where the record's row has both versions. */
  const recordNumber = header => {
    const box = header.parentElement;
    const dt = [...box.querySelectorAll('dl.record-fields dt')].find(d => d.textContent.trim() === 'Number');
    const n = dt?.nextElementSibling?.textContent.trim();
    if (n) return n;
    /* Still loading, or failed: the record's heading still prints its number. */
    const head = [...box.querySelectorAll('.font-mono')].map(e => e.textContent.trim())
      .find(t => /^(?:[A-Z]{2} )?[0-9A-Z]{5,}(?: [A-Z][0-9]?)?$/.test(t));
    return head ? head.replace(/^[A-Z]{2} /, '').replace(/ [A-Z][0-9]?$/, '') : '';
  };
  const rowFor = n => (n && [...document.querySelectorAll('[data-result-card]')]
    .find(c => digits(c.querySelector('a[title^="Open "]')?.textContent) === n)) || null;

  let last = null;
  const record = header => {
    let sw = header.querySelector(':scope > [data-r3-version]');
    const n = recordNumber(header);
    /* While the other version's record loads there is no Number yet: keep
       the switch, and the focus on it, against the row it last drove. */
    const row = rowFor(n) || (!n && last?.isConnected ? last : null);
    const source = row?.querySelector(GROUP);
    if (!source) { sw?.remove(); return; }
    const from = [...source.querySelectorAll('button')];
    if (!sw) {
      sw = document.createElement('div');
      sw.setAttribute('data-r3-version', '');
      sw.setAttribute('role', 'group');
      sw.setAttribute('aria-label', source.getAttribute('aria-label'));
      header.insertBefore(sw, header.querySelector(':scope > button[aria-label="Find similar"]'));
    }
    last = row;
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
        sw.appendChild(m);
      }
      if (m.textContent !== b.textContent.trim()) m.textContent = b.textContent.trim();
      const p = b.getAttribute('aria-pressed') === 'true' ? 'true' : 'false';
      if (m.getAttribute('aria-pressed') !== p) m.setAttribute('aria-pressed', p);
    });
    mine.slice(from.length).forEach(m => m.remove());
  };

  const fix = () => {
    document.querySelectorAll('[data-result-card]').forEach(rowKind);
    document.querySelectorAll('div.border-b:has(> button[aria-label="Close details"])').forEach(record);
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fix(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-pressed', 'href'] });
  fix();
})();
