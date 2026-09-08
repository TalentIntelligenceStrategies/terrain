# The deliverable — how to change it

> **`terrain-the-case.html` is GENERATED. Do not edit it.**
> Edit the source, re-run the build. An edit made directly to the output survives until the next
> build and then vanishes silently, which is the worst failure mode available here.

```bash
python3 deliverables/build.py        # rebuilds the document
```

*It packed a zip and a `bundle/` for the Innovue token handoff until 2026-09-08. Both are gone with
the handoff: the extraction was a copy of `docs/design-language.md`, which is the source anyone
would regenerate it from. The component manifest was not a copy of anything and survives at
[`design/components.md`](../design/components.md).*

**One document, two tabs.** It replaced three separate documents plus a standalone comparison deck
on 2026-09-04: three documents was five artifacts for one argument, and each was written at
working-record density. Tab 1 is the case in **four** sections; tab 2 is the prototype.

*It was five sections until 2026-09-05.* The section that asked Innovue for answers came out, and
with it §8, §9, the component manifest and the Closing. **Nothing in the document asks for anything
any more** — which is why the 15 panel ask-lines went too, and why no `§8.x`, `§9.x` or
`question N` reference may reappear in rendered material. That is checked below.

**Every section shows the short version and folds the full reading.** That is the structural answer
to *"way too dense"*, and it is why `case.md` §0 exists.

| Section | Shows (visible) | Folds behind one disclosure |
| --- | --- | --- |
| 1 · Why this direction | `docs/case.md` **§0.1** | — *(no fold: §0.1 is the position, not how it was reached)* |
| 2 · Our audience, and why IPtech is not built for them | **§0.2** | §3 |
| 3 · Everything IPtech does, and why we take only some of it | **§0.3** | §4, §5 |
| 4 · Side by side | **§0.4** | §6 |

**§0.5 and §7–§10 stay in `case.md` and are no longer rendered.** They are not deleted, because
`case.md` §9.n ≡ `platform.md` §10.n is an append-only contract checked below, and because §0.5 is
still the *end anchor* for section 4's visible slice. Dropping a section is a `SECS` change, never a
deletion from `case.md`. The sources §10 held now sit in the document footer, with the source-tag
legend, so §4's `platform 24`-style tags stay explained.

**`case.md` §0 is the visible layer, and it is written for a reader whose first language is not
English.** Short sentences, common words, no rhetorical inversions, the key numbers in small tables.
**It states nothing that is not already in §1–§9** — if a claim only exists in §0, it is in the wrong
place. The panels in section 4 stay visible because they are pictures, not prose.

Nothing is lost to the fold: it is one click, the rail is a map of the visible layer, and printing
opens every fold and both tabs.

## Where to make a change

| To change | Edit | Then run |
| --- | --- | --- |
| **What a section says at a glance** — the visible layer | [`docs/case.md`](../docs/case.md) **§0**, the matching §0.n | `deliverables/build.py` |
| **The argument** behind it — the folded layer | [`docs/case.md`](../docs/case.md), at the sections in the table above | `deliverables/build.py` |
| Which slice is visible, and each fold's label | `SECS` / `FULL_LABEL` in [`build.py`](build.py) | `deliverables/build.py` |
| The **component manifest** | [`design/components.md`](../design/components.md) — not embedded in the document; it stands on its own | — |
| **Which sections go where**, the section titles, ledes, tabs, the prototype tab | `SECS` / `PROTO` in [`build.py`](build.py) | `deliverables/build.py` |
| How the document **looks** | `DOC_CSS` in [`build.py`](build.py) | `deliverables/build.py` |
| A **Markdown rendering bug**, a verdict pill, a heading id | [`md.py`](md.py) | `deliverables/build.py` |
| The **prototype** | [`design/previews/terrain-prototype.html`](../design/previews/terrain-prototype.html) — a source, edited directly | `deliverables/build.py` — **it is inlined now, so a change to it needs a rebuild** |
| How the document's **tokens and components** look | [`document.css`](document.css) — extracted 2026-09-08 from the comparison deck, which used to supply it | `deliverables/build.py` |

**Counts are read off the source, not typed into the build.** The capability count, the High count,
the question count and the number of groups are all computed at build time and printed when it runs. Do not hard-code any of them into a lede or a tile.

## The rule that governs all of it

**`docs/` is the source of truth.** If the change is a *decision* — what Terrain is, what gets built,
how it looks, what we are asking Innovue — it goes into one of the four documents in `docs/` first,
and the render follows. If the generated document and a `docs/` file disagree, **the document in
`docs/` wins**, and the generated one is stale rather than right.

`docs/case.md` is the outbound view of the other three. It holds no decision that is not already in
`brief.md`, `platform.md` or `design-language.md`; where it and they disagree, they win.

**And the outbound document carries the conclusion, not the history of reaching it.** The amendment
trails, the retractions and the dated corrections belong in `brief.md` and `platform.md`, which are
working records. That is the rule that made the 2026-09-04 compression pass decidable; apply it to
anything new.

## Two things about the build that are easy to break

**The numbering contract.** `case.md` §9.n ≡ `platform.md` §10.n, by number **and** content. The list
is **append-only** — §10.9 alone is cited by number in ten places, and §10.12 is struck-but-retained
for exactly this reason. Never insert, never renumber, never reuse a struck number. The comparison
panels cite these numbers and must move with them.

```bash
python3 - <<'PY'
import re, io
pl = io.open('docs/platform.md').read(); ca = io.open('docs/case.md').read()
p = pl[pl.index('## 10 · Confirm'):pl.index('## 11 · Open')]
c = ca[ca.index('## 9 · What is blocked'):ca.index('## 10 · Sources')]
pn = [int(m.group(1)) for m in re.finditer(r'^(\d+)\. ', p, re.M)]
cn = [int(m.group(1)) for m in re.finditer(r'^(\d+)\. ', c, re.M)]
print('§9 ≡ §10:', pn == cn, '  count:', len(pn))
PY
```

`md.py` emits `<ol start="N">` so a group keeps its **source** numbers. Without it every group
restarts at 1 and §9.24 cited in a panel points at an item labelled 1 — which shipped that way until
2026-09-04. If you touch the list rendering, check a mid-list number on the render.

**Folds are for reasoning, never for a claim.** `fold_after_tables` is deliberately **windowed** to
§4.A–§4.G's evidence notes. Applied to every table it also folded §4.H's *"126 charts is 126
decisions"* and, under `### The eighteen, and where each one actually is`, *"thirteen of the eighteen
are working in the product today"* — the answer the document exists to give. Both sit outside the
window; if you widen it, read the summaries it produces. *(That second sentence lived in §4.I until
2026-09-05, when §4.I was removed as a duplicate of the heading that follows it.)*

## Before sending anything

The document must be closed — no external reference, both typefaces rendering, **and the fallback
intact.** A missing typeface fails silently, and so does a tab that never opens.

**`build.py` refuses to write a file that fails any of this.** As of 2026-09-05 it checks, and exits
non-zero: the prototype actually inlined, no `href`/`src` to a sibling file, no `http`/`../`
reference of any kind, seven `@font-face` in the document itself, the prototype frame present, and
no `§8.x` / `§9.x` / `question N` anywhere — the frame's source comments included. The greps below
are how you check a file you did not just build.

**It is sent as one attachment, so test it as one file.** Copy it alone into an empty directory
before you believe it. Everything that broke here broke because a second file was assumed:

```bash
D=$(mktemp -d) && cp deliverables/terrain-the-case.html $D/ && open $D/terrain-the-case.html
# then: Prototype tab -> the frame runs -> click a #deep-link -> the frame moves
```

**Size.** The document is ~0.70 MB. *It was 2.6 MB until 2026-09-08, when section 4's ingested
panels went; 1.97 MB of it was twenty-five base64 screenshots.*

**Nothing may ask Innovue for anything.** Section 5 came out on 2026-09-05; a reference that
survives it points at material the reader does not have. An unqualified `§8.x`/`§9.x` must not
appear — one preceded by a filename is fine, and deliberate:

```bash
O=deliverables/terrain-the-case.html
grep -oE '(\w+\.md )?(&sect;|§)[89]\.[0-9A-Za-z]+' $O | grep -v '\.md ' | sort -u   # empty
grep -c 'class="ask"' $O                                                            # 0
grep -c 'id="s[56]"' $O                                                             # 0
```

```bash
# it must survive being copied out alone
D=$(mktemp -d) && cp deliverables/terrain-the-case.html $D/ && open $D/terrain-the-case.html
```

**The prototype is inside the document.** *It sat beside it until 2026-09-05,* linked by bare
filename — which quietly made the deliverable a pair and not a file. Sent as one mail attachment,
which is how it is actually sent, all seven deep links and the CTA were dead, and dead in the way
that shows nothing: the browser simply fails to navigate. It was also dead inside the repo exactly
once, on 2026-09-04.

It now rides in an `<iframe srcdoc>` in the prototype tab, and the deep links drive it by setting
its hash — the same hashes it answers to standalone. `srcdoc` rather than a `data:` URI for two
reasons: a srcdoc frame inherits the document's origin, so the links can reach into it over
`file://`, which is where it is actually opened; and escaping costs ~15 KB where base64 costs ~125.
The frame carries its own copy of the seven typefaces, so `@font-face` legitimately appears
**fourteen** times in the output — `build.py` subtracts the frame's before checking.

The standalone prototype lives at
[`design/previews/terrain-prototype.html`](../design/previews/terrain-prototype.html) and is worth
opening at full window. **Nothing in the document depends on it.**

*`build.py` carried a `PROTO_SCRUB` list until 2026-09-08*, rewriting internal cross-references and
one candid note about the recipient out of the copy that travelled. Both were removed at source when
the repo went public, so there is nothing left to strip and there is no second version of the file.
The reference check survives and is now precise: a citation that **names its file** passes, a bare
`§8.2` — which means `case.md`'s own §8, not rendered here — still fails the build.

**The no-script fallback is not optional.** The markup ships with everything visible; only
`html.js` hides an inactive tab. Check it by stripping the scripts and rendering — a mail-client
preview must see one long document, never a blank page.

**Headless `--screenshot` will not paint a scrolled region after fragment navigation.** Opening
`file://…#anything-valid` headless returns a blank PNG, on this document and on the comparison deck
alike. It is a harness limitation, not a bug — do not spend a session on it. To look at the middle of
the document, either `--print-to-pdf` (which lays out everything, both tabs, all folds open) or build
a scratch file holding one section and shoot it from the top.

## What is not in the bundle, on purpose

`brief.md`, `platform.md` and `design-language.md` are internal working records. `case.md` cites them
throughout and says plainly in its header that they are not included. **Do not add them** without a
deliberate decision — `platform.md` §9 is deferred scope and §7a is thinking-in-progress, neither
written for an outside reader.

**Hosting was considered and declined twice on 2026-09-04, and the objections were answered rather
than overruled on 2026-09-08.** The declines named four things a public URL would publish: TIS's
commercial position, an unlaunched product strategy, named third parties who consented to nothing,
and a client project's landscape. Each was removed at source rather than argued away — the points
meter and the resale-licensing ask are out of `case.md`, the named holders are generic descriptors,
and every figure in the prototype and the documents is now illustrative. The screenshots and the
comparison deck are not published at all. What remains is a capability read of a product Innovue
markets publicly, and Terrain's own design work.

**The document is still self-contained and still worth sending as a file.** Hosting adds a URL; it
does not change what the artifact is.
