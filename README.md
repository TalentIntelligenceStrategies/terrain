# TIS Terrain

Patent search with strategic direction, for founders working out where their idea sits. You arrive
with a concept — filed, mid-filing, or nowhere near it — and Terrain shows you who else is in the
space, which technology is adjacent to yours, and where the gaps are.

Terrain is a self-serve product in the **TIS Patent Intelligence** pillar, searching the Innovue
patent database. It is **software, not a report**: you log in and search, and nothing is produced
to order.

This repository is the **design and definition phase** — positioning, product definition and the
design language, settled in writing before application code exists.

## The two pages

| | |
| --- | --- |
| [**The case**](deliverables/terrain-the-case.html) | Why this direction, who it is for, every IPtech capability rated from a founder's position, and the design pass. Its second tab runs the prototype in a frame. Written from [`docs/case.md`](docs/case.md), which stays the record of the argument. |
| [**The prototype**](design/previews/terrain-prototype.html) | The interface, running. Four surfaces, twenty-four states, clickable end to end. |

Both are static HTML with no build step and no server. They link one stylesheet —
[`brand/fonts/fonts.css`](brand/fonts/fonts.css) — and the case document loads the prototype into a
frame, so the repository is the unit rather than either file alone. Clone it, or open either page
over `file://`, and both work.

*They were single self-contained files until 2026-09-08, with the typefaces inlined as base64 and
the whole prototype escaped into the case document. That existed so either could be sent as one mail
attachment. Hosting made it pointless and cost 0.9 MB, so it is gone.*

## Every figure here is illustrative

The prototype and the documents were populated from a real project observed inside IPtech. **That
data is not ours to publish**, so it was replaced: the distribution is representative and the
arithmetic is internally consistent, but **no number is a real filing count**. No holder is named
either — holder labels render as skeleton bars by decision, because inventing a name would read as
a live example and transliterating a real one would be fabrication.

Screenshots of Innovue's platform, and the side-by-side deck built from them, are **not in this
repository**. They render a client's data as pixels.

## Layout

```
index.html       the landing page — links the two pages below
deliverables/
  terrain-the-case.html   the case, four sections and a prototype tab
design/
  previews/
    terrain-prototype.html  the interface, running
  components.md    per component, the data shape the engine must return
docs/            the source of truth — four documents, and they win over anything rendered
  brief.md         what Terrain is: positioning, naming, the Innovue relationship
  platform.md      what gets built, and §9 deferred scope
  design-language.md  how it looks: tokens, type, components
  case.md          the outbound argument, for TIS management and for Innovue
brand/
  fonts/           the two typefaces, their licences, and the stylesheet both pages link
  logos/tis/       TIS marks
CLAUDE.md        how to work in this repository
```

## Editing

`docs/` is the source of truth. A decision — what Terrain is, what gets built, how it looks, what we
are asking Innovue — goes into one of the four documents there first.

The two HTML pages are **maintained directly**. `docs/case.md` remains the record of the argument
the case document makes, but editing it no longer regenerates the page; both have to be changed.

*A Python build generated the case document from `docs/case.md` until 2026-09-08. It was removed
with the packaging it existed for. It is still readable at `git show b96f61a:deliverables/build.py`
if the generated approach is ever wanted back.*

## Before pushing

Four things must hold. Each command prints offending files and nothing otherwise — note the
`grep -v README.md`, without which this file matches its own patterns and the check never passes.

```bash
# 1 · no raster images. The strongest check, because it is an invariant rather
#     than a list of names: every screenshot here is a capture of a third
#     party's product or a mood board, and neither is ours to publish. This
#     repository's images are SVG marks and nothing else.
git ls-files | grep -iE '\.(png|jpe?g|gif|webp|bmp|tiff)$'

# 2 · nothing local-only is tracked, by name as well
git ls-files | grep -Ei 'iptech-screenshots|comparison-assets|visual.inspo|visual.inspiration|logos/innovue|iptech-terrain-comparison|iptech-feature-request'

# 3 · no client or patent data in tracked files
git ls-files | grep -v README.md | tr '\n' '\0' \
  | xargs -0 grep -lEi 'Tektronix|Nike|Qualcomm|ENANTA|MONOLITHIC|緯穎|富蘭登|Macroblock|4,50[0-9]|4,49[0-9]'

# 4 · nothing tracked embeds an image as base64
git ls-files | grep -v README.md | tr '\n' '\0' | xargs -0 grep -l 'data:image'
```

**Check 1 exists because check 2 failed.** On 2026-09-08 the mood-board folder was renamed from
`visual_inspo/` to `visual-inspiration/` outside the repository. `.gitignore` matched only the old
name, `git add -A` staged all 6 MB of it, and the name-based check looked for the old name too, so it
reported clean. Caught before the commit. A blocklist of paths protects you until something is
renamed; refusing rasters outright does not have that failure mode.

## Typefaces

**Urbanist** for text and display, **Inconsolata** for numerals and monospace. Both are self-hosted
in `brand/fonts/` as subsets, under the SIL Open Font License 1.1 — the licences travel with them as
OFL requires, in [`OFL-Urbanist.txt`](brand/fonts/OFL-Urbanist.txt) and
[`OFL-Inconsolata.txt`](brand/fonts/OFL-Inconsolata.txt).

Terrain is English-only; that is a decision, not an omission.

## Attribution

Terrain is an endorsed TIS sub-brand. **Powered by Innovue** — the patent database underneath is
Innovue's, and it is cited in body copy where it does credibility work. IPtech is Innovue's
product; this repository reads and argues with its publicly marketed capabilities, which is
competitive analysis, not a claim on it.
