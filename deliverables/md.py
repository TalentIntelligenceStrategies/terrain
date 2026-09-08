"""Minimal Markdown -> HTML for the deliverable build.

Deliberately small. It covers exactly what docs/case.md and
design/components.md use — verified by inventory before it was written:
headings h1-h4, tables, bullets, ordered lists, blockquotes, rules, paragraphs,
and inline bold / italic / code / link / strikethrough. No fenced code blocks,
because neither document has one. If a construct is added upstream that this
does not handle, it will render literally rather than silently vanish.

Four things beyond plain conversion, all of them presentation and none of them
content:

  * headings carry slug ids, so the contents rail can link to them
  * ordered lists keep their SOURCE numbers via start=, because case.md 9's
    numbering is a contract with platform.md 10 and is cited by number in
    four places. Without this every group restarts at 1 and 9.24 in the deck
    points at an item labelled 1.
  * a table cell that is entirely one bold verdict becomes a pill. The tones
    are NEUTRAL by rule: CLAUDE.md permits colour only on discrete states,
    delta direction and chart layers, so these separate by fill and weight.
  * every cell carries data-h with its column header, so a wide table can
    become a stack of labelled cards on a narrow screen.
"""
import re, html

_slugs = {}

def slug(text):
    t = re.sub(r'<[^>]+>', '', text)
    t = re.sub(r'[^A-Za-z0-9]+', '-', t).strip('-').lower()
    t = re.sub(r'-{2,}', '-', t) or 'h'
    t = t[:48].strip('-')
    n = _slugs.get(t, 0) + 1
    _slugs[t] = n
    return t if n == 1 else '%s-%d' % (t, n)

def reset_slugs():
    _slugs.clear()

# longest / most specific first, because "not for this buyer" must beat "High"
# inside "High, in a narrow role" is not a conflict but "The permissions model
# is not for this buyer" would otherwise fall through to no pill at all.
TONES = [
    ('Omit · deferred', 'off'), ('Omit · later', 'off'),
    ('Omit · cut', 'off'), ('Not for this buyer', 'off'),
    ('not for this buyer', 'off'), ('Not a surface', 'off'),
    ('Not in v1', 'mid'), ('Blocked', 'mid'), ('Hidden by design', 'mid'),
    ('On screen', 'on'), ('Match', 'on'), ('Diverge', 'mid'),
    ('High', 'on'), ('Qualified', 'mid'), ('Split', 'mid'),
]

def _verdict(cell):
    """A cell that is exactly one bold run -> pill + qualifier. Else None."""
    m = re.fullmatch(r'<b>(.+?)</b>', cell.strip())
    if not m:
        return None
    plain = re.sub(r'<[^>]+>', '', m.group(1))
    low = plain.lower()
    for key, tone in TONES:
        k = key.lower()
        if k in low:
            i = low.index(k)
            rest = (plain[:i] + ' ' + plain[i + len(key):]).strip()
            rest = re.sub(r'\s+', ' ', rest.strip(' ,—-·')).strip()
            label = key[0].upper() + key[1:]
            out = '<span class="vp vp-%s">%s</span>' % (tone, label)
            if rest:
                out += '<span class="vq">%s</span>' % rest
            return out
    return None

def _inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'`([^`]+)`', lambda m: '<code>%s</code>' % m.group(1), t)
    # a link to a file that travels in the bundle becomes a link; everything
    # else becomes a plain cross-reference, because a link to a document the
    # reader was not sent is worse than no link.
    def link(m):
        text, tgt = m.group(1), m.group(2)
        if tgt.startswith('http'):
            return '<a href="%s">%s</a>' % (tgt, text)
        # an anchor into this same document is the one target that is always
        # there -- it is how case.md reaches the prototype now that the
        # prototype is inlined rather than sent alongside.
        if tgt.startswith('#'):
            return '<a href="%s">%s</a>' % (tgt, text)
        if tgt.endswith('.html'):
            return '<a href="%s">%s</a>' % (tgt.rsplit('/', 1)[-1], text)
        return '<span class="xref">%s</span>' % text
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, t)
    # bold first and non-greedy, because bold spans routinely contain italics:
    # `[^*]+` stops at the inner asterisk and leaves the markers on the page.
    t = re.sub(r'\*\*\*(.+?)\*\*\*', r'<b><em>\1</em></b>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<!\*)\*(?!\*)(.+?)\*(?!\*)', r'<em>\1</em>', t)
    t = re.sub(r'~~([^~]+)~~', r'<s>\1</s>', t)
    return t

def _row(line):
    return [c.strip() for c in line.strip().strip('|').split('|')]

def render(md):
    lines, out, i = md.split('\n'), [], 0
    while i < len(lines):
        ln = lines[i]
        if not ln.strip():
            i += 1; continue
        if re.match(r'^---+\s*$', ln):
            out.append('<hr>'); i += 1; continue
        m = re.match(r'^(#{1,6}) (.*)$', ln)
        if m:
            lv, txt = len(m.group(1)), _inline(m.group(2))
            out.append('<h%d id="%s">%s</h%d>' % (lv, slug(m.group(2)), txt, lv))
            i += 1; continue
        if ln.startswith('>'):
            buf = []
            while i < len(lines) and lines[i].startswith('>'):
                buf.append(lines[i].lstrip('>').strip()); i += 1
            out.append('<blockquote>%s</blockquote>' % _inline(' '.join(x for x in buf if x)))
            continue
        if ln.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append(lines[i]); i += 1
            head = _row(rows[0])
            body = rows[2:] if len(rows) > 1 and set(rows[1].replace('|', '').replace(' ', '')) <= set('-:') else rows[1:]
            hh = [_inline(c) for c in head]
            t = ['<div class="tbl-wrap"><table>', '<thead><tr>']
            t += ['<th>%s</th>' % c for c in hh]
            t += ['</tr></thead><tbody>']
            for r in body:
                cells = _row(r)
                tds = []
                for k, c in enumerate(cells):
                    lbl = re.sub(r'<[^>]+>', '', hh[k]) if k < len(hh) else ''
                    inner = _inline(c)
                    v = _verdict(inner)
                    cls = ' class="td-v"' if v else ''
                    tds.append('<td%s data-h="%s">%s</td>'
                               % (cls, html.escape(lbl, quote=True), v or inner))
                t.append('<tr>' + ''.join(tds) + '</tr>')
            t.append('</tbody></table></div>')
            out.append(''.join(t)); continue
        m = re.match(r'^(\s*)([-*]|(\d+)\.) ', ln)
        if m:
            ordered = m.group(3) is not None
            start = int(m.group(3)) if ordered else None
            tag = 'ol' if ordered else 'ul'
            items, pat = [], re.compile(r'^\s*(?:[-*]|\d+\.) (.*)$')
            while i < len(lines):
                mm = pat.match(lines[i]) if lines[i].strip() else None
                if mm:
                    buf = [mm.group(1)]; i += 1
                    while i < len(lines) and lines[i].startswith('  ') and lines[i].strip() \
                          and not pat.match(lines[i]):
                        buf.append(lines[i].strip()); i += 1
                    items.append(' '.join(buf))
                elif not lines[i].strip() and i + 1 < len(lines) and pat.match(lines[i + 1] or ''):
                    i += 1
                else:
                    break
            # start= keeps the SOURCE numbers. case.md 9 is a numbering
            # contract; a group that silently restarts at 1 breaks every
            # citation pointing into it.
            attr = ' start="%d"' % start if ordered and start != 1 else ''
            out.append('<%s%s>%s</%s>' % (tag, attr, ''.join('<li>%s</li>' % _inline(x) for x in items), tag))
            continue
        buf = []
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(('|', '>', '#')) \
              and not re.match(r'^\s*(?:[-*]|\d+\.) ', lines[i]) and not re.match(r'^---+\s*$', lines[i]):
            buf.append(lines[i].strip()); i += 1
        if buf:
            out.append('<p>%s</p>' % _inline(' '.join(buf)))
    # a source `---` immediately before a heading doubles the heading's own rule
    out = [b for k, b in enumerate(out)
           if not (b == '<hr>' and k + 1 < len(out) and out[k + 1].startswith('<h'))]
    return '\n'.join(out)
