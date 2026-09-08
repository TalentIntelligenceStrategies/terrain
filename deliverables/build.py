#!/usr/bin/env python3
"""Build the deliverable.

    python3 deliverables/build.py

ONE self-contained HTML file, two tabs: the case in four sections, and the
prototype. Fonts inlined as woff2 data URIs, every style inline, no external
reference of any kind. It opens by double-click from an inbox or a USB stick
and renders identically anywhere, because nothing about it is fetched at open
time.

    terrain-the-case.html

This replaced three separate documents plus a standalone comparison deck on
2026-09-04. Three documents was five artifacts for one argument, and each was
written at working-record density.

There IS an inline <script> now, which is a deliberate change from the earlier
promise of none: it drives the two tabs and opens every fold before printing.
The fallback is not optional and is checked on every build --

    with script disabled, BOTH tabs' content is visible and nothing is lost.

That works because the markup ships with everything shown; the script adds a
class to <html> and the CSS hides inactive panels only under that class. So a
mail-client preview or a text-mode browser sees one long document rather than
a blank page.

docs/case.md is the source of truth for the argument.
deliverables/document.css carries the document's tokens and components. This
script is a view of docs/case.md: change the source, re-run this, never edit
the output.

Section 4 carried side-by-side panels ingested from the comparison deck until
2026-09-08. They were dropped when the repo went public: every panel paired an
IPtech screenshot against ours, and those captures render a client's data. The
deck stays local as a working record.
"""
import base64, datetime, io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "design", "previews"))
import md as MD
from inline_fonts import block as font_block           # noqa: E402

OUT   = "terrain-the-case.html"
CASE  = io.open(os.path.join(ROOT, "docs", "case.md"), encoding="utf-8").read()
DOCCSS = io.open(os.path.join(HERE, "document.css"), encoding="utf-8").read()


def section(src, start, end=None):
    i = src.index(start)
    return src[i:src.index(end, i)] if end else src[i:]


# ═══ transforms on rendered blocks ════════════════════════════════════════
# md.render joins one HTML block per line, so splitting on \n gives the block
# list back. Every transform below is presentation: it moves nothing and drops
# nothing, it only decides what is open on arrival.

def demote(html, by=1):
    return re.sub(r"<(/?)h([1-6])",
                  lambda m: "<%sh%d" % (m.group(1), min(6, int(m.group(2)) + by)), html)


def _leads(blocks, cap=52):
    """The bold opening of each paragraph, for a fold's summary. A reader
    should know what is inside a fold without opening it."""
    out = []
    for b in blocks:
        m = re.match(r"<p><b>(.+?)</b>", b)
        if m:
            t = re.sub(r"<[^>]+>", "", m.group(1)).strip(" .,:—-")
            out.append(t if len(t) <= cap else t[:cap].rsplit(" ", 1)[0] + "…")
    return out


def fold_after_tables(blocks, first, last, min_chars=340, min_paras=2):
    """Prose that trails a table inside the inventory blocks is EVIDENCE for
    the table, and folds.

    Windowed on purpose. Applied to everything that trails a table it also
    folded the punchlines -- 4.H's "126 charts is 126 decisions" and, worse,
    4.I's "thirteen of the eighteen are working in the product today", which
    is the answer this document exists to give. A fold is for the reasoning
    behind a claim, never for the claim.

    Two paragraphs minimum as well as a length floor: one paragraph behind a
    summary reading "1 note" is worse than the paragraph.
    """
    def find(hid, dflt):
        for k, b in enumerate(blocks):
            if 'id="%s"' % hid in b:
                return k
        return dflt
    lo, hi = find(first, 0), find(last, len(blocks))
    out, i = [], 0
    while i < len(blocks):
        b = blocks[i]; out.append(b); i += 1
        if not b.startswith('<div class="tbl-wrap">') or not (lo < i <= hi):
            continue
        run = []
        while i < len(blocks) and not blocks[i].startswith(("<h", '<div class="tbl-wrap"', "<hr")):
            run.append(blocks[i]); i += 1
        if len(run) < min_paras or len(re.sub(r"<[^>]+>", "", "".join(run))) < min_chars:
            out.extend(run); continue
        leads = _leads(run)
        n = len(run)
        cap = ("%d note%s" % (n, "" if n == 1 else "s"))
        hint = (" &middot; ".join(leads[:3])) if leads else "the evidence, and how we read it"
        out.append('<details class="fold"><summary><span class="fold-n">%s</span>'
                   '<span class="fold-h">%s</span></summary><div class="fold-b">%s</div>'
                   '</details>' % (cap, hint, "".join(run)))
    return out


def _trim(t, n=42):
    t = re.sub(r"<[^>]+>", "", t).strip()
    return t if len(t) <= n else t[:n].rsplit(" ", 1)[0] + "\u2026"


def link_anchors(html):
    """Make every cross-reference in the document clickable.

    Only NN.MM forms are linked. A bare 9 or 10 is ambiguous -- platform.md
    has its own 10 and this document has a 10 too -- so bare section numbers
    stay plain text and cannot mislead. A reference that names platform.md is
    skipped for the same reason.
    """
    ids = {}
    for m in re.finditer(r'<h[2-5] id="([^"]+)"[^>]*>(.*?)</h[2-5]>', html, re.S):
        txt = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        k = re.match(r"^(\d+(?:\.[0-9A-Za-z]+)?)\s*·", txt)
        if k:
            ids.setdefault(k.group(1), m.group(1))
    qs = set(re.findall(r'<li id="q(\d+)"', html))
    secs = set(re.findall(r'<section class="sec" id="s(\d+)"', html))
    panels = set(re.findall(r'<section class="panel" id="p(\d+)"', html))

    def a(href, text):
        return '<a class="jump" href="#%s">%s</a>' % (href, text)

    def sec_ref(m):
        sign, num, sub = m.group(1), m.group(2), m.group(3)
        key = "%s.%s" % (num, sub)
        if key in ids:
            return a(ids[key], sign + key)
        if num == "9" and sub.isdigit() and sub in qs:
            return a("q" + sub, sign + key)
        return m.group(0)

    # NN.MM only. A bare 9 or 10 is ambiguous, because platform.md has its
    # own 10 and this document has a 10 too, so bare numbers stay plain and
    # cannot mislead. Any 4.x / 6.x / 8.x reference in this document is to
    # this document -- the one place that was not, 8.1, was reworded at
    # source rather than guarded here with a regex that would rot.
    # md.py emits a literal section sign; the hand-written HTML uses the
    # entity. Both, or most references in the document go unlinked.
    html = re.sub(r'(&sect;|\u00a7)(\d+)\.([0-9A-Za-z]+)', sec_ref, html)
    html = re.sub(r'\bquestion (\d+)\b',
                  lambda m: a("q" + m.group(1), "question " + m.group(1))
                  if m.group(1) in qs else m.group(0), html)
    html = re.sub(r'\bsection (\d)\b',
                  lambda m: a("s" + m.group(1), "section " + m.group(1))
                  if m.group(1) in secs else m.group(0), html)
    html = re.sub(r'\bpanel (\d\d?)\b',
                  lambda m: a("p%02d" % int(m.group(1)), "panel " + m.group(1))
                  if "%02d" % int(m.group(1)) in panels else m.group(0), html)
    return html


def rail(groups):
    """The contents rail, grouped by section. Flat, it lists 4.A through 4.I
    with no way to tell which section they belong to."""
    out = []
    for sid, num, title, html in groups:
        out.append('<a class="r2" href="#%s"><span class="rn">%s</span>%s</a>'
                   % (sid, num, _trim(title, 48)))
        for lv, hid, txt in re.findall(r'<h([34]) id="([^"]+)"[^>]*>(.*?)</h[34]>', html, re.S):
            out.append('<a class="r%s" href="#%s">%s</a>' % (lv, hid, _trim(txt)))
    return "".join(out)


# ═══ counts, read off the source rather than typed here ═══════════════════

def stats():
    inv = section(CASE, "### 4.A · Ingest", "### 4.H · The analysis menu")
    rows, high = 0, 0
    for ln in inv.split("\n"):
        if ln.startswith("|") and not set(ln.replace("|", "").replace(" ", "")) <= set("-:"):
            c = [x.strip() for x in ln.strip().strip("|").split("|")]
            if c[0] == "Capability":
                continue
            rows += 1
            if c[3].startswith("**High"):
                high += 1
    q = section(CASE, "## 9 · What is blocked", "## 10 · Sources")
    nums = re.findall(r"^(\d+)\. ", q, re.M)
    struck = len(re.findall(r"^\d+\. ~~", q, re.M))
    groups = len([1 for k, ln in enumerate(q.split("\n"))
                  if re.match(r"^\d+\. ", ln) and (k == 0 or not re.match(r"^\d+\. |^ ", q.split("\n")[k - 1]))])
    return dict(rows=rows, high=high,
                questions=len(nums) - struck, numbered=len(nums), groups=groups,
)

S = stats()


def tiles(items):
    return ('<div class="tiles">%s</div>'
            % "".join('<div class="tile"><span class="tn">%s</span>'
                      '<span class="tl">%s</span></div>' % (n, l) for n, l in items))


# ═══ the four sections ════════════════════════════════════════════════════

SECS = [
    # (n, title, lede, the SHORT version slice, the full-reading slices, tiles)
    ("1", "Why this direction",
     "The same engine, a new front door, for a different person.",
     ("### 0.1 ·", "### 0.2 ·"),
     # no fold: §1 and §2 were the working record of how the position was
     # reached, and the visible §0.1 is the position.
     [], None),

    ("2", "Our audience, and why IPtech is not built for them",
     "A US early-stage founder, and three assumptions they cannot meet. "
     "None of the three is a defect.",
     ("### 0.2 ·", "### 0.3 ·"),
     [("## 3 · Where the gap shows", "## 4 · The full IPtech capability inventory")],
     [("3", "assumptions they cannot meet"), ("0", "of them a defect")]),

    ("3", "Everything IPtech does, and why we take only some of it",
     "Every capability, rated from a founder's position. This is the fastest place to disagree "
     "with us.",
     ("### 0.3 ·", "### 0.4 ·"),
     # 4.H is skipped here on purpose: panel 14 in section 4 carries the same
     # tiering as tables, and printing it twice is the densest duplication in
     # the document. The pointer below sends a reader there instead.
     [("## 4 · The full IPtech capability inventory", "### 4.H · The analysis menu, read by tier"),
      ("### The eighteen, and where each one actually is", "## 6 · What it looks like")],
     # two tiles, not four. 68 and 46 need the menu explained before they
     # mean anything, and the short version deliberately no longer does that.
     [(S["rows"], "capabilities rated"), (S["high"], "carry the product")]),

    ("4", "Side by side",
     "Your screens beside ours, component by component.",
     ("### 0.4 ·", "### 0.5 ·"),
     [("## 6 · What it looks like", "## 7 · How we are building it")],
     [("4", "surfaces, one tab"), ("18", "capabilities behind them")]),
]



# Section 1 has no fold, so it needs no label.
FULL_LABEL = {
    "2": "The full reading &mdash; where the gap shows, with the evidence",
    "3": "The full reading &mdash; all %d capabilities rated, and all 68 analyses tiered"
         % S["rows"],
    "4": "The full reading &mdash; every element traced to the capability behind it",
}


def body():
    """Returns (html, rail groups).

    Each section shows the SHORT version and folds the full reading. The
    document is the big picture; docs/case.md is the record.

    Section 1 has no full reading: it is the position, not how it was
    reached, so it renders as visible prose with no fold at all.
    """
    parts, groups = [], []
    for n, title, lede, brief, slices, tl in SECS:
        vis = demote(MD.render(section(CASE, *brief)))
        # the 0.n heading is redundant beside the section banner that repeats it
        vis = re.sub(r'<h4 id="0-\d[^"]*"[^>]*>.*?</h4>\n?', '', vis, count=1)

        full = "\n".join(MD.render(section(CASE, a, b)) for a, b in slices)
        blocks = demote(full).split("\n")
        if n == "3":
            blocks.insert(next(k for k, b in enumerate(blocks)
                               if 'id="the-eighteen-and-where-each-one-actually-is"' in b),
                          '<p><b>&sect;4.H sorted all 68 of your analyses into three tiers</b>, using '
                          'your own labels. It is in <a class="jump" href="#p14">panel 14</a> rather '
                          'than repeated here.</p>')
            blocks = fold_after_tables(blocks, "4-a-ingest-and-interpretation",
                                       "4-h-the-analysis-menu-read-by-tier")
        full = "\n".join(blocks)

        # Section 4 carried ingested comparison panels until 2026-09-08.
        # They are gone with the screenshots; see the module docstring.
        after = ""

        inner = '<div class="doc brief">%s</div>' % vis
        if slices:
            inner += ('<details class="fold full"><summary><span class="fold-n">detail</span>'
                      '<span class="fold-h">%s</span></summary>'
                      '<div class="fold-b doc">%s</div></details>'
                      % (FULL_LABEL[n], full))

        groups.append(("s%s" % n, n, title, vis))
        parts.append(
            '<section class="sec" id="s%s">'
            '<header class="sec-h">'
            '<p class="eyebrow">Section %s of %d</p><h2 class="sec-t">%s</h2>'
            '<p class="sec-l">%s</p>%s</header>'
            '%s%s</section>'
            % (n, n, len(SECS), title, lede, tiles(tl) if tl else "", inner, after))
    return "".join(parts), groups


PROTO_SRC = os.path.join(ROOT, "design", "previews", "terrain-prototype.html")


# The prototype's source comments cite the internal records by section --
# case.md §8.2, platform.md §8.1 -- because they are design notes written for
# us. Section 5 came out of the document on 2026-09-05 and with it every ask;
# a §8.x or "question N" pointer that survives points the recipient at material
# they were deliberately not sent. The comments are worth keeping in the
# source, so they are scrubbed on the way OUT instead, for the frame and the
# zip copy alike. Each replacement is asserted: if the source is reworded, this
# fails loudly rather than leaking quietly.
def proto_outbound():
    """The prototype, read from source.

    This used to apply a scrub list on the way out: the source carried internal
    cross-references and a candid note about the recipient, and neither belonged
    in the artifact they received. Both were removed at source on 2026-09-08 when
    the repo went public, so there is nothing left to strip and a second version
    of the file no longer exists.
    """
    return io.open(PROTO_SRC, encoding="utf-8").read()


def proto_srcdoc():
    """The prototype, escaped to ride inside srcdoc="...".

    The document used to link it by bare filename, which quietly made it a
    pair and not a file. Sent alone as a mail attachment -- which is how it is
    actually sent -- all eight prototype links were dead, and dead in the way
    that shows nothing: the browser just fails to navigate. Inlining it closes
    the last external reference in the document.

    srcdoc rather than a data: URI for two reasons. A srcdoc frame inherits
    this document's origin, so the deep links can drive it by setting its
    hash -- verified on file://, which is where it will actually be opened.
    And escaping costs about 15 KB where base64 would cost 125.
    """
    return proto_outbound().replace("&", "&amp;").replace('"', "&quot;")


PROTO = """
<section class="sec" id="p-tab"><header class="sec-h">
<p class="eyebrow">The prototype</p>
<h2 class="sec-t">A clickable build of all four surfaces</h2>
<p class="sec-l">It is <b>inside this file</b>. The frame below is the running prototype, not a
picture of one &mdash; no server, no build step, nothing to install, and nothing that has to travel
beside this document.</p>
<p class="proto-cta"><button class="btn" type="button" id="proto-full">Open it full screen
&nbsp;&rarr;</button><span class="proto-f">Or work in the frame below. Esc leaves full screen.</span></p>
</header>
<div class="proto-stage">
<iframe id="proto-frame" class="proto-frame" title="Terrain prototype, running"
srcdoc="__PROTO_SRCDOC__"></iframe>
</div>
<div class="doc">
<h3 id="what-it-runs-on">What it runs on</h3>
<p>It ships showing <b>a real eVTOL project we opened inside your platform</b> &mdash; its grid, its
cell counts, its largest holders and its jurisdiction split. None of it is generated. Every number on
screen was read off a captured screen.</p>
<blockquote><b>Chrome is real. Data is a bar. Nothing is invented.</b></blockquote>
<p>Every label, caption, legend, column header and empty state is the real English a founder would
read. <b>There is no invented patent number, no invented company and no plausible-looking year
anywhere in it.</b> Where a value would be and we do not hold it, there is a grey bar &mdash; holder
names, because two of the five have no official English registration and transliterating them would
be the one act this contract forbids.</p>
<h3 id="where-to-start">Where to start</h3>
<p>Each one loads into the frame above. They are the prototype's own URLs, so the menu inside it reaches the same ten states.</p>
<div class="tbl-wrap"><table><thead><tr><th>Open this</th><th>To see</th></tr></thead><tbody>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="thread"><code>#thread</code></a></td><td data-h="To see">First run &mdash; one composer under one question, and the rotating prompt that says what the field accepts</td></tr>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="confirm"><code>#confirm</code></a></td><td data-h="To see"><b>The gate.</b> How we read your idea, as editable rows. Nothing runs until it is approved &mdash; section 4, panel 10</td></tr>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="questions"><code>#questions</code></a></td><td data-h="To see">The narrowing round &mdash; plain questions answered in the thread, before we read the idea back. <b>These decide the corpus</b>, and the corpus is what all four widgets are drawn over. How many get asked depends on what the sentence already answered</td></tr>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="set"><code>#set</code></a></td><td data-h="To see"><b>What the search found</b>, with our recommendation already selected. The step that replaces the hand-binning your analyst does in <code>Hierarchy</code></td></tr>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="set-rebaselined"><code>#set-rebaselined</code></a></td><td data-h="To see">The same set re-ranked around one starred patent &mdash; <em>more like this one</em>, which is the one control here that needs a capability we could not confirm you have</td></tr>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="dashboard"><code>#dashboard</code></a></td><td data-h="To see">The map at rest: the matrix dominant, three widgets beneath, chat collapsed to an icon &mdash; and a standing note of what it was built on</td></tr>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="drilldown"><code>#drilldown</code></a></td><td data-h="To see">What a cell opens into &mdash; a list of evidence, four fields per row. The capability your cell popover does not have</td></tr>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="track"><code>#track</code></a></td><td data-h="To see">Matrix column selection &mdash; how the map marks the one technology you are following, without a colour</td></tr>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="page-map"><code>#page-map</code></a></td><td data-h="To see">A widget page &mdash; a destination, never a step, and reached without leaving the tab</td></tr>
<tr><td data-h="Open this"><a class="proto-go" href="#proto-frame" data-proto="history"><code>#history</code></a></td><td data-h="To see">Every confirmed scope change as a labelled, revertible version</td></tr>
</tbody></table></div>
<h3 id="what-is-deliberately-missing">What is deliberately missing</h3>
<p>No boolean field. No chart picker. No report, export or download. No patent detail page. No accent
colour and no green &mdash; colour appears on discrete states, on the direction of a change, and in
the chart layers, and it encodes <b>direction, never desirability</b>. A green &ldquo;open&rdquo; cell
would tell a founder <em>why</em> a cell is empty, which is the one thing the map may never do.</p>
</div></section>
"""

DOC_CSS = """
html{color-scheme:light}
/* ═══ document layer ══════════════════════════════════════════════════════
   The deck's tokens, set for reading rather than for panels. Everything here
   is presentation; the argument is docs/case.md.

   No new colour. CLAUDE.md permits colour on discrete states, on the
   direction of a change, and in chart layers -- and nowhere else. So the
   verdict pills below separate by FILL and WEIGHT on the neutral ramp, never
   by hue, and nothing in this stylesheet says good or bad.                 */
.wrap{max-width:1320px}
body{background:var(--n-1)}

/* ── the two tabs ────────────────────────────────────────────────────────
   Shipped visible. Only html.js hides an inactive panel, so with no script
   this is one long document rather than a blank page.                     */
.tabs{display:none}
html.js .tabs{display:flex; gap:var(--s-6); margin:0 0 var(--s-40);
  position:sticky; top:0; z-index:20; padding:var(--s-12) 0;
  background:linear-gradient(var(--n-1) 68%,transparent)}
.tab{appearance:none; font:inherit; font-size:13px; font-weight:500; cursor:pointer;
  padding:var(--s-8) var(--s-16); border-radius:var(--r-pill);
  border:1px solid var(--border); background:var(--surface); color:var(--text-3)}
.tab[aria-selected="true"]{background:var(--text-1); border-color:var(--text-1);
  color:var(--text-inverse)}
html.js .tabp[hidden]{display:none}
.tabp-h{font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--text-3);
  margin:var(--s-56) 0 var(--s-16); padding-top:var(--s-16);
  border-top:2px solid var(--text-1)}
html.js .tabp-h{display:none}

/* ── shell: contents rail beside the content ─────────────────────────────*/
.shell{display:block}
.rail-d{margin:0 0 var(--s-32); border:1px solid var(--border);
  border-radius:var(--r-inner); background:var(--surface); padding:var(--s-12) var(--s-16)}
.rail-d>summary{cursor:pointer; font-size:12px; font-weight:600; color:var(--text-1);
  letter-spacing:.02em}
.rail{display:flex; flex-direction:column; gap:1px; margin-top:var(--s-12)}
.rail a{text-decoration:none; color:var(--text-3); font-size:12.5px; line-height:1.45;
  padding:5px var(--s-10); border-radius:var(--r-chip); border-left:2px solid transparent}
.rail a:hover{color:var(--text-1); background:var(--surface-sunken)}
.rail a.r2{display:flex; gap:var(--s-8); align-items:baseline; font-size:13px; font-weight:600;
  color:var(--text-1); margin-top:var(--s-16); padding-left:var(--s-8)}
.rail a.r2:first-child{margin-top:0}
.rail a.r2 .rn{font-family:var(--font-fig); font-size:11px; color:var(--text-3); flex:none}
.rail a.r3{padding-left:var(--s-20)}
.rail a.r4{padding-left:var(--s-32); font-size:12px; color:var(--n-6)}
.rail a.is-here{color:var(--text-1); font-weight:600; border-left-color:var(--text-1)}
@media (min-width:1100px){
  .shell{display:grid; grid-template-columns:236px minmax(0,1fr); gap:var(--s-40);
    align-items:start}
  .rail-d{position:sticky; top:var(--s-56); border:0; background:none; padding:0;
    max-height:calc(100vh - var(--s-72)); overflow-y:auto; margin:0}
  .rail-d>summary{display:none}
  .rail-d[open]>.rail, .rail-d>.rail{display:flex}
}

/* ── section banners ─────────────────────────────────────────────────────*/
.sec{margin:0 0 var(--s-72); scroll-margin-top:var(--s-56)}
.sec-h{padding:0 0 var(--s-24); margin:0 0 var(--s-32);
  border-bottom:1px solid var(--border)}
.sec-t{margin:var(--s-8) 0 0; font-size:31px; line-height:1.14; font-weight:700;
  letter-spacing:-.022em; color:var(--text-1); max-width:26ch; text-wrap:balance}
.sec-l{margin:var(--s-14) 0 0; font-size:16px; line-height:1.55; color:var(--text-2);
  max-width:62ch}
.tiles{display:flex; flex-wrap:wrap; gap:var(--s-8); margin:var(--s-24) 0 0}
.tile{display:flex; flex-direction:column; gap:2px; padding:var(--s-10) var(--s-16);
  border:1px solid var(--border); border-radius:var(--r-inner); background:var(--surface);
  min-width:104px}
.tile .tn{font-family:var(--font-fig); font-size:22px; font-weight:500; line-height:1;
  color:var(--text-1); font-variant-numeric:tabular-nums}
.tile .tl{font-size:11px; line-height:1.3; color:var(--text-3); max-width:15ch}
.proto-cta{display:flex; align-items:center; gap:var(--s-16); flex-wrap:wrap;
  margin:var(--s-24) 0 0}
.btn{display:inline-block; text-decoration:none; font-size:14px; font-weight:600;
  padding:var(--s-12) var(--s-20); border-radius:var(--r-pill);
  background:var(--text-1); color:var(--text-inverse)}
.proto-f{font-family:var(--font-fig); font-size:12.5px; color:var(--text-3)}
.proto-go{font-family:var(--font-fig)}
.proto-stage{margin:var(--s-24) 0 0; border:1px solid var(--border);
  border-radius:var(--r-outer); overflow:hidden; background:var(--surface)}
.proto-frame{display:block; width:100%; height:min(78vh, 840px); min-height:560px;
  border:0; background:var(--surface)}
.proto-frame:fullscreen{width:100%; height:100%}
@media print{ .proto-stage{break-inside:avoid} .proto-frame{height:520px} }

/* ── prose ───────────────────────────────────────────────────────────────*/
.doc{max-width:none}
.doc>*{max-width:68ch}
.doc>.tbl-wrap, .doc>details, .doc>section, .doc>.tiles{max-width:none}
.doc h3{font-size:22px; font-weight:700; letter-spacing:-.014em; line-height:1.22;
  color:var(--text-1); margin:var(--s-56) 0 var(--s-16); max-width:34ch;
  text-wrap:balance; scroll-margin-top:var(--s-72)}
.doc>h3:first-child{margin-top:0}
.doc h4{font-size:16.5px; font-weight:600; letter-spacing:-.004em; line-height:1.3;
  color:var(--text-1); margin:var(--s-40) 0 var(--s-10); max-width:44ch;
  text-transform:none; scroll-margin-top:var(--s-72)}
.doc h5{font-size:14px; font-weight:600; color:var(--text-1); margin:var(--s-24) 0 var(--s-8);
  text-transform:none; letter-spacing:0}
.doc p{margin:0 0 var(--s-16); font-size:15.5px; line-height:1.68; color:var(--text-2)}
.doc p b, .doc li b, .doc td b, .doc th{color:var(--text-1)}
.doc ul,.doc ol{margin:0 0 var(--s-20); padding-left:var(--s-24);
  font-size:15.5px; line-height:1.68; color:var(--text-2)}
.doc li{margin-bottom:var(--s-10)}
.doc li::marker{color:var(--text-3); font-family:var(--font-fig); font-size:13px}
.doc blockquote{margin:0 0 var(--s-24); padding:var(--s-16) var(--s-20);
  background:var(--surface); border:1px solid var(--border);
  border-left:2px solid var(--text-1); border-radius:var(--r-inner);
  font-size:15px; line-height:1.62; color:var(--text-2)}
.doc hr{border:0; border-top:1px solid var(--rule-soft); margin:var(--s-40) 0}
.doc code{font-family:var(--font-fig); font-size:.9em; background:var(--surface-sunken);
  padding:1px 5px; border-radius:var(--r-chip); color:var(--text-1)}
.doc .xref{color:var(--text-2); border-bottom:1px dotted var(--border-strong)}
.doc a{color:var(--text-1); text-underline-offset:2px}
/* a cross-reference that goes somewhere. Underline only, no colour: colour
   is spoken for by CLAUDE.md and a link is not a discrete state. */
a.jump{color:inherit; text-decoration:none; border-bottom:1px solid var(--border-strong);
  white-space:nowrap}
a.jump:hover{border-bottom-color:var(--text-1); background:var(--surface-sunken)}
.doc s{color:var(--n-6)}

/* ── tables, and the card form they take when narrow ─────────────────────*/
.tbl-wrap{overflow-x:auto; margin:0 0 var(--s-32); border:1px solid var(--border);
  border-radius:var(--r-inner); background:var(--surface)}
.doc table{border-collapse:collapse; width:100%; font-size:14px; line-height:1.55}
.doc th{text-align:left; font-size:10px; font-weight:500; letter-spacing:.075em;
  text-transform:uppercase; color:var(--text-3); padding:var(--s-12) var(--s-14);
  border-bottom:1px solid var(--border); white-space:nowrap; vertical-align:bottom;
  background:var(--n-1)}
.doc td{padding:var(--s-14); border-bottom:1px solid var(--rule-soft);
  color:var(--text-2); vertical-align:top}
.doc tr:last-child td{border-bottom:0}
.doc td:first-child{color:var(--text-1); font-weight:500}
.doc td.td-v{white-space:normal}

/* verdict pills. Neutral by rule -- fill and weight, never hue.           */
.vp{display:inline-block; font-size:11px; font-weight:600; letter-spacing:.01em;
  padding:3px var(--s-10); border-radius:var(--r-pill); white-space:nowrap}
.vp-on{background:var(--text-1); color:var(--text-inverse)}
.vp-mid{background:var(--surface); color:var(--text-1); border:1px solid var(--border-strong)}
.vp-off{background:var(--surface-sunken); color:var(--text-3);
  border:1px solid transparent}
.vq{display:block; margin-top:var(--s-6); font-size:12.5px; line-height:1.4;
  color:var(--text-3)}

/* ── folds ───────────────────────────────────────────────────────────────*/
.fold{margin:0 0 var(--s-32); border:1px solid var(--border);
  border-radius:var(--r-inner); background:var(--surface); overflow:hidden}
.fold>summary{cursor:pointer; list-style:none; padding:var(--s-14) var(--s-16);
  display:flex; align-items:baseline; gap:var(--s-12); font-size:13.5px;
  color:var(--text-2)}
.fold>summary::-webkit-details-marker{display:none}
.fold>summary::after{content:"+"; margin-left:auto; font-family:var(--font-fig);
  font-size:15px; color:var(--text-3); flex:none}
.fold[open]>summary::after{content:"\\2013"}
.fold[open]>summary{border-bottom:1px solid var(--border)}
.fold>summary:hover{background:var(--n-1)}
.fold .fold-n{flex:none; font-family:var(--font-fig); font-size:11px; font-weight:500;
  text-transform:uppercase; letter-spacing:.05em; color:var(--text-3);
  border:1px solid var(--border); border-radius:var(--r-pill); padding:2px var(--s-8)}
.fold .fold-h{color:var(--text-2)}
.fold .fold-b{padding:var(--s-20) var(--s-16) var(--s-6)}
.fold .fold-b>*{max-width:68ch}
.qfold>summary .fold-n{font-size:13px; text-transform:none; letter-spacing:0;
  min-width:26px; text-align:center}
.qfold>summary .fold-h{font-weight:600; color:var(--text-1)}
.qfold .fold-b{padding-top:var(--s-16)}
/* the full-reading fold. One per section, and it should read as an offer
   rather than as a warning that something is missing. */
.fold.full{margin-top:var(--s-40); background:var(--n-1)}
.fold.full>summary{padding:var(--s-16); font-size:14px}
.fold.full>summary .fold-n{background:var(--surface)}
.fold.full>.fold-b{padding:var(--s-32) var(--s-20) var(--s-16)}
/* the short version carries the section. Give it a little more air and a
   slightly larger measure than the folded detail. */
.brief>*{max-width:66ch}
.brief>p{font-size:16.5px; line-height:1.7}
.brief>blockquote{font-size:17px; font-weight:600; color:var(--text-1);
  padding:var(--s-20) var(--s-24); margin-top:var(--s-24)}
.brief>ol,.brief>ul{font-size:16.5px; line-height:1.7}
.brief>h4{font-size:18px; margin-top:var(--s-40)}
.brief table{font-size:14.5px}

/* ── section 4's ingested panels. They keep the deck's own styles; this
      only places them. Nesting them inside .doc made .doc h3 beat .blk h3
      at equal specificity and turned every micro-label into a 22px head. ─*/
.deckwrap{margin-top:var(--s-40)}
.deckwrap .frame, .deckwrap .panel, .deckwrap .close{max-width:none}

@media (max-width:719px){
  .doc table, .doc thead, .doc tbody, .doc tr, .doc th, .doc td{display:block}
  .doc thead{display:none}
  .tbl-wrap{border:0; background:none; border-radius:0}
  .doc tr{border:1px solid var(--border); border-radius:var(--r-inner);
    background:var(--surface); padding:var(--s-8) var(--s-14); margin:0 0 var(--s-10)}
  .doc td{border:0; padding:var(--s-8) 0}
  .doc td:not(:last-child){border-bottom:1px solid var(--rule-soft)}
  .doc td::before{content:attr(data-h); display:block; font-size:10px; font-weight:500;
    letter-spacing:.075em; text-transform:uppercase; color:var(--text-3);
    margin-bottom:var(--s-4)}
  .doc td[data-h=""]::before{display:none}
  .sec-t{font-size:25px}
}

@media print{
  .tabs, .rail-d{display:none !important}
  .tabp{display:block !important}
  .shell{display:block}
  .fold, .fold>summary{border:0; background:none}
  .fold>summary::after{content:""}
  .fold .fold-b{padding-left:0; padding-right:0}
  .doc h3, .doc h4, .sec-h{break-after:avoid}
  .tbl-wrap, .doc blockquote, .panel{break-inside:avoid}
  .sec{break-before:page}
}
"""

SHELL = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s</title>
<script>document.documentElement.className+=' js'</script>
%(fonts)s<style>
%(css)s
%(doccss)s
</style>
</head>
<body>
<div class="wrap">
<header class="cover">
  <p class="eyebrow">TIS Patent Intelligence &middot; for TIS management, and Innovue</p>
  <h1>%(h1)s</h1>
  <p class="lede">%(lede)s</p>
  <div class="meta">
    <span><b>Compiled</b> <time datetime="__DATE__">__DATE__</time></span>
    <span><b>Source</b> <code>docs/case.md</code></span>
    <span><b>Powered by</b> Innovue</span>
  </div>
</header>

<nav class="tabs" role="tablist" aria-label="Sections">
  <button class="tab" id="t-case" role="tab" aria-controls="p-case" aria-selected="true">The case</button>
  <button class="tab" id="t-proto" role="tab" aria-controls="p-proto" aria-selected="false">Prototype</button>
</nav>

<h2 class="tabp-h">The case</h2>
<div class="tabp" id="p-case" role="tabpanel" aria-labelledby="t-case">
  <div class="shell">
    <details class="rail-d" open><summary>Contents</summary><nav class="rail">%(rail)s</nav></details>
    <div>%(body)s</div>
  </div>
</div>

<h2 class="tabp-h">The prototype</h2>
<div class="tabp" id="p-proto" role="tabpanel" aria-labelledby="t-proto">%(proto)s</div>

<footer>
  <p>TIS Terrain &middot; Patent Intelligence &middot; compiled __DATE__. Powered by Innovue.</p>
  <p>Every claim about IPtech comes from an audit of Innovue's public material dated 2026-08-31,
  two passes inside the platform on a TIS account (2026-09-02 and 2026-09-04) which produced 31
  identified screens, and a live walkthrough on 2026-09-04. Where a claim rests on a screen, the
  screen is named; where it rests on marketing, it is tagged as marketing.
  Source tags in section 3 read <b>product page</b> &middot; <b>blog</b> &middot;
  <b>changelog</b> &middot; <b>search listing</b> &middot; <b>update log</b> &middot;
  <b>platform</b> (observed in-product, with the screen number given).
  <b>This document is generated from <code>docs/case.md</code></b>, which is a view of the three
  internal records that hold the decisions &mdash; the brief, the platform definition and the design
  language. Where this and they disagree, they win.</p>
</footer>
</div>
<script>
(function(){
  /* Tabs. The markup ships with both panels shown; this is what hides one,
     and it only ever runs when scripting is on. */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  function show(id, push){
    tabs.forEach(function(t){
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      var p = document.getElementById(t.getAttribute('aria-controls'));
      if (p) { if (on) { p.removeAttribute('hidden'); } else { p.setAttribute('hidden',''); } }
    });
    if (push) { history.replaceState(null,'', id === 'p-proto' ? '#prototype' : '#case'); }
  }
  tabs.forEach(function(t){
    t.addEventListener('click', function(){ show(t.getAttribute('aria-controls'), true);
      window.scrollTo(0,0); });
  });
  show(location.hash === '#prototype' ? 'p-proto' : 'p-case', false);

  /* A rail link inside the hidden tab would go nowhere, so switch first. */
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    var panel = el.closest('.tabp');
    if (panel && panel.hasAttribute('hidden')) show(panel.id, true);
    var d = el.closest('details'); while (d) { d.open = true; d = d.parentElement.closest('details'); }
  });

  /* The prototype rides inside this file, in a srcdoc frame, so it inherits
     this document's origin and these links can drive it by hash -- the same
     hashes it answers to as a standalone file. Guarded throughout: if any of
     it fails, the frame is still there and still clickable on its own. */
  var pf = document.getElementById('proto-frame');
  document.addEventListener('click', function(e){
    var g = e.target.closest && e.target.closest('[data-proto]');
    if (!g || !pf) return;
    e.preventDefault();
    show('p-proto', true);
    try { pf.contentWindow.location.hash = g.getAttribute('data-proto'); } catch (err) {}
    try { pf.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch (err) {}
  });
  var pfull = document.getElementById('proto-full');
  if (pfull && pf) {
    pfull.addEventListener('click', function(){
      var r = pf.requestFullscreen || pf.webkitRequestFullscreen;
      if (r) { try { r.call(pf); } catch (err) {} }
    });
  }

  /* Mark where you are. Guarded: nothing depends on it having run. */
  try {
    var links = [].slice.call(document.querySelectorAll('.rail a'));
    var map = {};
    links.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){
        if (!en.isIntersecting) return;
        links.forEach(function(a){ a.classList.remove('is-here'); });
        var a = map[en.target.id]; if (a) a.classList.add('is-here');
      });
    }, { rootMargin: '-10%% 0px -80%% 0px' });
    Object.keys(map).forEach(function(id){
      var el = document.getElementById(id); if (el) io.observe(el);
    });
  } catch (err) {}

  /* Printing shows everything: both tabs, every fold. */
  var wasOpen = [];
  window.addEventListener('beforeprint', function(){
    wasOpen = [].slice.call(document.querySelectorAll('details:not([open])'));
    wasOpen.forEach(function(d){ d.open = true; });
    document.querySelectorAll('.tabp').forEach(function(p){ p.removeAttribute('hidden'); });
  });
  window.addEventListener('afterprint', function(){
    wasOpen.forEach(function(d){ d.open = false; });
    show(document.querySelector('.tab[aria-selected="true"]').getAttribute('aria-controls'), false);
  });
})();
</script>
</body>
</html>
"""

H1 = "Terrain, and what it needs from IPtech"
LEDE = ("A second front door on your engine, for a US early-stage founder. %d capabilities rated "
        "from that position, and four surfaces built from eighteen of them &mdash; <b>none of which "
        "asks the engine for anything new.</b>" % S["rows"])


def build():
    MD.reset_slugs()
    b, groups = body()
    return SHELL % dict(title="TIS Terrain — the case", h1=H1, lede=LEDE,
                        fonts=font_block(), css=DOCCSS, doccss=DOC_CSS,
                        rail=rail(groups),
                        body=link_anchors(b),
                        # after link_anchors, never through it: the prototype is
                        # 390 KB and none of it is this document's prose
                        proto=link_anchors(PROTO).replace("__PROTO_SRCDOC__",
                                                          proto_srcdoc()))


if __name__ == "__main__":
    html = build()

    # It is sent as one attachment, so it has to be one file. These are the
    # ways that has silently stopped being true before.
    fails = []
    if "__PROTO_SRCDOC__" in html:
        fails.append("the prototype never got inlined")
    for pat in ('href="terrain-prototype', 'src="terrain-prototype'):
        if pat in html:
            fails.append("still links a sibling file: %s" % pat)
    for pat in ('href="http', 'src="http', 'href="../', 'src="../', "url(http"):
        if pat in html:
            fails.append("external reference: %s" % pat)
    # the frame carries its own copy of the 7, escaped inside srcdoc; count
    # only the document's, or this passes for the wrong reason
    faces = html.count("@font-face") - proto_srcdoc().count("@font-face")
    if faces != 7:
        fails.append("expected 7 inlined faces in the document, found %d" % faces)
    if 'id="proto-frame"' not in html:
        fails.append("no prototype frame")
    # Nothing may point at material the reader does not have. The document is
    # forwarded on its own, so a bare "§8.2" -- which means case.md's own §8,
    # and case.md's §8 and §9 are not rendered here -- is a dead reference.
    # A citation that NAMES its file is fine: case.md says in as many words
    # that it cites platform.md and design-language.md on purpose, and those
    # travel with the repo. So only unqualified references fail.
    for m in re.finditer(r"(\w+\.md\s*)?(§[89]\.[0-9A-Za-z]+|question [0-9]+)", html):
        if not m.group(1):
            fails.append("points at material not sent: %s" % m.group(2))
    if fails:
        sys.exit("  BUILD FAILED -- not sendable:\n    " + "\n    ".join(fails))

    # the build date is stamped here rather than typed into the template,
    # because a hand-typed one goes stale the first time nobody notices
    html = html.replace("__DATE__", datetime.date.today().isoformat())
    io.open(os.path.join(HERE, OUT), "w", encoding="utf-8").write(html)
    mb = len(html.encode()) / 1048576
    print("  %-34s %7.2f MB   one closed file, prototype included" % (OUT, mb))
    print("\n  counts read from the source: %d capabilities, %d High, %d questions in %d groups"
          % (S["rows"], S["high"], S["questions"], S["groups"]))
