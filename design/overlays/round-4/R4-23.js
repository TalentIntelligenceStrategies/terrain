/* R4-23 (restores R3-21) · Result row and record, phone: the kind is text; the version is chosen under the title
 *
 * Current: every row carries a 49x22 / 81x22 Grant | Application segment
 * where a status chip would sit, and a single-version row prints plain
 * "Grant" in the same slot, so the slot means two things. On a phone it
 * takes a line of its own. Its purpose is only in its accessible name.
 * Wanted:  the row says its kind as text in the number line,
 * "US 09000581 B2 · Grant". In the record, where both versions exist, the
 * version is chosen under the title (R4-36's head) with two text tabs,
 * Grant and Application, 44px tall, the current one in the foreground
 * colour with a 2px underline on the head's bottom rule; on a patent with
 * one version there are no tabs and the kind is beside the number. It is in the natural tab order (R4-32).
 * Viewport: phone only (below sm, 40rem). From sm up the row keeps its
 * switch; R4-23.css hides all of this from 40rem up.
 *
 * Needs R4-36: the tabs go under its title, and its head holds steady
 * while a version loads from the row's number and title, which this
 * script writes on the dialog (data-r3-row-pn, data-r3-row-title).
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
  const digits = s => ((s || '').match(/\b[A-Z]{2} ([0-9A-Z]{5,})/) || [])[1] || '';

  /* Row: kind as text inside the number link, before its icon. */
  const rowWord = card => {
    const group = card.querySelector(GROUP);
    if (group) return group.querySelector('button[aria-pressed="true"]')?.textContent.trim() || '';
    const meta = card.querySelector('div:has(> div > span.font-mono.text-muted-foreground)');
    const only = meta && [...meta.children].find(c => c.tagName === 'SPAN' && /^(Grant|Application)$/.test(c.textContent.trim()));
    if (only) { only.setAttribute('data-r3-kind-src', ''); return only.textContent.trim(); }
    return card.querySelector('[data-r3-kind-src]')?.textContent.trim() || '';
  };
  const rowKind = card => {
    const link = card.querySelector('a[href], a[title^="Open "]');
    const word = link && rowWord(card);
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

  /* Record: which row it is, read from its fields, or its number while loading. */
  const recordNumber = d => {
    const dt = [...d.querySelectorAll('dl.record-fields dt')].find(x => x.textContent.trim() === 'Number');
    const n = dt?.nextElementSibling?.textContent.trim();
    if (n) return n;
    const pn = d.querySelector('[data-r3-pn]')?.textContent.trim() || '';
    return pn.replace(/^[A-Z]{2} /, '').replace(/ [A-Z][0-9]?$/, '');
  };
  const rowFor = n => (n && [...document.querySelectorAll('[data-result-card]')]
    .find(c => digits(c.querySelector('a[title^="Open "]')?.textContent) === n)) || null;

  let last = null;
  const record = d => {
    const fields = d.querySelector('dl.record-fields');
    const name = d.querySelector('[data-r3-name]');
    const title = name?.querySelector(':scope > [data-r3-title]');
    let sw = d.querySelector('[data-r3-version]');
    if (!title) return;
    const n = fields ? recordNumber(d) : '';
    /* While the other version loads, or if it fails to, the record has no
       Number the row shows: keep the tabs, and the focus on them, against the
       row they last drove, so the reader can always switch back. */
    const row = rowFor(n) || (last?.isConnected ? last : null);
    /* the row's number and title, for R4-36's head while the record has none */
    const rowPn = row?.querySelector('a[title^="Open "] > span')?.textContent.trim() || '';
    if ((d.getAttribute('data-r3-row-pn') || '') !== rowPn) d.setAttribute('data-r3-row-pn', rowPn);
    const rowTitle = row?.querySelector('button[data-card-primary]')?.textContent.trim() || '';
    if ((d.getAttribute('data-r3-row-title') || '') !== rowTitle) d.setAttribute('data-r3-row-title', rowTitle);
    const source = row?.querySelector(GROUP);
    /* the kind beside the number in the head (R4-36 draws it) */
    const meta = name.querySelector(':scope > [data-r3-meta]');
    const word = row ? rowWord(row) : '';
    if (meta && (meta.getAttribute('data-kind') || '') !== word) {
      if (word) meta.setAttribute('data-kind', word); else meta.removeAttribute('data-kind');
    }
    if (!source) { sw?.remove(); return; }
    last = row;
    if (!sw || sw.previousElementSibling !== title) {
      sw?.remove();
      sw = document.createElement('div');
      sw.setAttribute('data-r3-version', '');
      sw.setAttribute('role', 'group');
      sw.setAttribute('aria-label', 'Version');
      title.after(sw);
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

  const fix = () => {
    document.querySelectorAll('[data-result-card]').forEach(rowKind);
    document.querySelectorAll('[role="dialog"][data-result-detail]').forEach(record);
  };
  let queued = false;
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; fix(); }); } };
  new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-pressed', 'href'] });
  fix();
})();
