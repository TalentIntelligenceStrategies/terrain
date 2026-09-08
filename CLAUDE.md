# TIS Terrain — Project Context

## What this folder is

The working directory for **TIS Terrain**, a new English-native, self-serve SaaS product in the
TIS Patent Intelligence pillar. It is in the **design and definition** phase: positioning, naming,
and UX intent are being settled here before any application code exists.

This folder is **deliberately outside** the TIS brand monorepo (`~/Desktop/TIS`). That is a
decision, not an accident — see "Relationship to the TIS monorepo" below. Do not relocate it
without reading that section.

## The product, in one paragraph

Terrain is patent search with strategic direction, for founders working out where their idea sits.
You arrive with a concept — filed, mid-filing, or nowhere near it — and Terrain shows you who else
is in the space, which technology is adjacent to yours, and where the gaps are. Self-serve software
on a subscription, searching the full Innovue patent database. Read [docs/brief.md](docs/brief.md)
before doing any substantive work; it carries the positioning and the list of what is still open.

Terrain is **software, not a report** — the user logs in and searches, nothing is human-produced to
order. Never write copy that describes it in report language.

## Structure

```
CLAUDE.md            this file — how to work here
README.md            what a visitor to the public repo reads first
index.html           the landing page GitHub Pages serves — links the two pages
docs/brief.md        positioning, naming, the Innovue relationship — what Terrain is
docs/platform.md     product definition — what gets built, and §9 DEFERRED — NOT IN SCOPE
docs/design-language.md  tokens, type, components — how it looks
docs/case.md         outbound — the capability read and the design pass, for management and
                     Innovue. The page renders §0.1–§0.4 and §3–§6; §0.5, §4.H and §7–§10 stay in
                     the record and do not render
deliverables/        the case document — maintained directly, no longer generated
design/previews/     static HTML design explorations
design/components.md the component manifest — per component, the data shape the engine must return
brand/logos/tis/     TIS SVGs, copied from the monorepo (read-only, do not edit)
brand/fonts/         7 self-hosted woff2 + fonts.css + the two OFL licences — see Typefaces

    LOCAL ONLY — present in the working tree, excluded by .gitignore, never pushed:
iptech-screenshots/             raw platform captures, 2026-09-02 and 2026-09-04
iptech-screenshots-identified/  the same, identified and cropped, with a README index
design/previews/comparison-assets/       crops taken from those captures
design/previews/iptech-terrain-comparison.html   the side-by-side deck
design/previews/iptech-feature-request.html      the capability ask addressed to Innovue
visual-inspiration/  reference screens the design language was derived from
brand/logos/innovue/ Innovue SVGs — a third party's marks, cited but not redistributed
```

Add directories when work actually needs them, not in advance. When application code arrives it
goes in `app/`, and that decision gets recorded in `docs/brief.md` first.

*There is no `.nojekyll`, and the reason first recorded for one was wrong. It was committed and
removed on 2026-09-08. Markdown with no YAML front matter is a Jekyll **static file** — copied
byte-for-byte, never rendered — so Jekyll was never going to turn `docs/*.md` into site content.
Nothing here carries front matter and no path starts with `_` or `.`, so a Jekyll build and a raw
copy produce the same site.*

***The next Pages pass owns what that leaves open.*** *Deploying from a branch runs Jekyll, and two
things stop being hypothetical: a build failure fails the **whole** deploy rather than one file, and
any path later added with a `_` prefix is dropped from the output with no error — the same shape as
the rename that defeated the path-based ignore rule. `touch .nojekyll` is the entire fix if either
bites. Deploying through a GitHub Actions workflow skips Jekyll and the question does not arise.*

## Rules

**Fewer, denser documents.** Add to an existing doc in `docs/` before creating a new file. There
are **four**, split on purpose:

*The rule governs `docs/`, and `README.md` at the root is not a fifth — it is the front door for a
visitor, and it holds no decision that is not already recorded in one of the four. If it and they
disagree, they win. `PLAN.md` and `KICKOFF-PROMPT.md` used to sit here as operational state; both
were deleted 2026-09-08 when the repo went public, being tooling rather than product.*
`brief.md` is what Terrain *is*, `platform.md` is what gets *built*,
`design-language.md` is how it *looks*, `case.md` is the argument sent *outward*. A folder full of
near-duplicate markdown is how the definition phase stops being legible.

Two were deliberate exceptions, and the bar each cleared is the point:

- `design-language.md`, 2026-08-31 — tokens, type scale and component specs are a different kind of
  content, and folding them into `platform.md` would have roughly doubled it.
- `case.md`, 2026-09-01 — the other three are **internal working documents that record decisions**;
  this one is **outbound**, addressed to TIS management and to Innovue. Different audience,
  different tone, different lifecycle. Putting an argument aimed at Innovue inside `brief.md` would
  stop that file being scannable as the answer to *what is Terrain*.

Neither exception is a licence for a fifth. A new file needs a distinct **kind** of content and a
distinct **reader**, not just a distinct topic — and `case.md` is a *view* of the other three, so
when it and they disagree, they win.

**Deferred means deferred.** `docs/platform.md` §9 is marked `DEFERRED — NOT IN SCOPE`. Nothing in
it is built, specced further, wireframed, or designed against unless the session explicitly names
the item and asks for it. If a task appears to require a deferred item, stop and say so rather than
building it. Deferral here is a scope decision, not a backlog.

**`docs/` is the source of truth; everything rendered is a view of it.** Same discipline as the
parent monorepo: settle the decision in markdown, then build the preview. Never let a design
preview become the only record of a decision.

**One exception, and it is a real weakening rather than a clarification.** `deliverables/` holds one
outbound document, `terrain-the-case.html` — four sections and a prototype tab — and it is
**maintained directly**. A Python build generated it from `docs/case.md` until 2026-09-08; the build
was removed with the packaging it existed for, when hosting made a single self-contained file
pointless.

So the case document is the one rendered thing that is **not** automatically a view of its source.
`docs/case.md` is still the record of the argument, and it still wins where the two disagree — but
nothing enforces that any more. **Change both, in the same pass.** If they drift, the markdown is
right and the page is stale. `git show b96f61a:deliverables/build.py` has the generator if the
generated approach is ever wanted back.

*It was three documents plus a standalone comparison deck until 2026-09-04, then one document with
the deck ingested into section 4. The deck's panels came out on 2026-09-08 with the screenshots.*

**And the outbound document carries the conclusion, not the history of reaching it.** Amendment
trails, retractions and dated corrections stay in `brief.md` and `platform.md`, which are working
records. `case.md` is a view for a reader who was not in the room.

**Design previews inline their own tokens.** Each file in `design/previews/` carries its own token
block — no shared token stylesheet, no build step. There is no design system here yet, and
prematurely extracting one is the most likely way to lock in a bad early guess. Extract shared
tokens only once three previews independently want the same value.

*The typefaces are the one shared thing, since 2026-09-08.* Every page links
`brand/fonts/fonts.css` rather than inlining seven base64 payloads, because these are served from a
repository now instead of sent as attachments — the inlining existed only to survive being emailed,
and it cost 0.9 MB across two files. **Tokens are still inlined and must stay that way**; a linked
font stylesheet locks nothing, a linked token sheet would.

*There was one recorded exception between 2026-09-03 and 2026-09-08: `design/tokens/` held a
generated token extraction built for handoff to Innovue. **It is deleted.** A copy of
`docs/design-language.md` in another format is regenerable from the document at any time, and
carrying it meant carrying a second thing to keep in sync. `design/components.md` — the per-component
data-shape manifest — was never part of that extraction and survives, because it is not a copy of
anything. **Previews still inline their own token blocks and must continue to.** `document.css`,
the case document's stylesheet, went with the build on 2026-09-08 — its rules live inline in the
page they style.*

**This is a public repository, and the boundary is client data, not Innovue's features.** Innovue
markets IPtech's capabilities publicly, so reading them, rating them and arguing with them is
ordinary competitive work and it stays. What may never be published is a **client's data** or a
**patent landscape that is not ours** — the real project, its counts, the assignee names, the
account's billing telemetry. Those were removed at source on 2026-09-08 and replaced with
illustrative figures.

Three things follow, and they are not stylistic:

- **Every figure in the prototype and in `docs/` is illustrative.** The distribution is
  representative and the arithmetic is internally consistent; no number is a real filing count. If
  you change one, say so where the document claims provenance, and keep the invariants — the matrix
  sums to the scope figure, the finding quotes the true maximum, the rivals total matches its own
  sentence. Nothing checks this for you — the build that used to is gone.
- **Never name a real holder as data.** Holder names render as skeleton bars by decision. Inventing
  one reads as a live example, and transliterating a real one is fabrication — both are worse than
  a bar.
- **The screenshots and the deck stay local.** They render a client's data as pixels. Nothing in a
  published artifact may embed them. Before any push, run the four checks in `README.md`.

  **`.gitignore` is a hint; the raster rule is the mechanism.** `*.png` and friends are refused
  wholesale, because this repository legitimately holds no raster images — the pages are HTML, the
  marks are SVG, the typefaces are woff2. That rule exists because the path-based one failed: the
  mood-board folder was renamed outside the repo on 2026-09-08, the ignore entry stopped matching,
  and `git add -A` staged 6 MB of it while the name-based check reported clean. **Never add a
  raster to this repository**, and if you ever need to, understand that you are removing the guard
  that catches the next rename.

**Do not invent brand law.** Terrain is a TIS product, but this folder is not the TIS brand system.
If a decision here changes something that belongs upstream — a token, a logo rule, a component,
the Innovue attribution phrasing — say so in the session and record it in `docs/brief.md`, then
leave it for a deliberate propagation pass. Never edit the monorepo from this folder.

**Colour carries information, or it is not there.** Superseded the monochrome-wireframe rule on
2026-08-31; the reasoning is in `docs/design-language.md` §2. Colour is permitted in exactly three
places: discrete states (live / expired, published / not yet published), direction of change on a delta
pill, and the three chart layers. No accent, no brand colour, no gradient, no decorative colour —
Terrain still has no accent decision, and a placeholder one becomes the thing everyone reviews
instead of the structure. Primary actions are near-black fill. Everything else is the neutral ramp,
carrying meaning with hierarchy, weight and spacing.

**And colour encodes direction, never desirability.** No green-means-good anywhere. The matrix
density ramp stays tonal grey and the filings series stays neutral, because `platform.md` §6.1
forbids the interface implying *why* a cell is empty — and a green "open" cell or a green rising
trend line does exactly that. Every coloured element also carries a word or a shape; never colour
alone.

**Icons come from Lucide, and nothing else.** No Heroicons, no Feather, no Material, no one-off
SVGs pulled from a search result. Mixing sets is immediately visible in the stroke weight and
corner radius, and it reads as an interface assembled from parts.

**No emoji.** Plain commit messages, and never an AI-attribution trailer of any kind.

## Typefaces

Two, carried over from TIS and locked:

| Role | Typeface |
| --- | --- |
| Text and display | **Urbanist** |
| Numerals, figures, monospace | **Inconsolata** |

**Terrain is English-only.** No Chinese surface, so no CJK face is in this folder — that is a
decision, not an omission. Don't add one, and don't write bilingual markup or `data-zh` attributes
out of habit from the parent site.

`brand/fonts/` holds the 7 self-hosted woff2 files, `fonts.css`, and the two OFL licences —
`OFL-Urbanist.txt` and `OFL-Inconsolata.txt`. The woff2 came from the marketing site's subset build
with paths rewritten relative to the CSS file, and **the licences must stay with them**: these are
subsets, which OFL permits, and OFL 1.1 requires the notice travel with the Font Software wherever
it is redistributed. This repository is public, so that is not theoretical.

Every page links it — no server, no build step:

```html
<link rel="stylesheet" href="../../brand/fonts/fonts.css">
```

If a Chinese surface is ever needed, Noto Sans TC lives in the marketing site's subset build at
`~/Desktop/TIS/website/assets/build/fonts/` — but note it is **split across four subset files**,
each with its own `unicode-range`. All four are required, and dropping one doesn't fail loudly; it
silently falls back to a system CJK face for part of the character set. Copy the `@font-face` block
with the files rather than reconstructing it.

Verified headlessly on 2026-09-08, after the inlined base64 was replaced by this link: all seven
faces resolve in both pages over `file://`. **Render and look at the PNG when you touch font
loading** — a missing typeface falls back to a system face and reports nothing.

## Logos

`brand/logos/` holds the TIS and Innovue SVGs, copied from
`~/Desktop/TIS/website/designs/assets/logos/` with original filenames intact so references stay
greppable against the parent system. Treat them as read-only. Use the `_eng` variants — the `_ch`
and `_dual` files are kept only in case a Chinese surface is ever needed, which it currently isn't.

Terrain is an **endorsed sub-brand**: the TIS mark appears in the lockup, Terrain is the product
name. Innovue appears as **attribution only** — a "Powered by Innovue" line and the database cited
in body copy where it does credibility work. Innovue never enters the product name or the primary
lockup. The reasons are in `docs/brief.md`; they are commercial, not aesthetic.

*One recorded exception, 2026-09-07, and it is scoped: Innovue's mark appears in the masthead of an
outbound document, in their own brand blue. That is attribution on a document addressed to them, not
an accent entering Terrain's palette. `docs/brief.md` §3 carries the reasoning.*

## Relationship to the TIS monorepo

The monorepo's root `CLAUDE.md` governs any working directory beneath it, and its project memory
is keyed to that path. Building Terrain inside it would inherit the brand DAG, the snapshot-resync
obligations, the changelog law, and a PostToolUse brand-sync hook — all correct for a surface
consuming a settled brand system, all premature for a product whose positioning is still moving.
The real risk was never a broken build; it was an agent helpfully routing Terrain's components into
`brand/components.md` and locking the design to existing tokens during the exact phase that needs
latitude.

The cost of the split is a propagation step later. Record upstream-affecting decisions in
`docs/brief.md` as they are made so that step stays a merge and not an excavation.

**Graduation:** once positioning and design direction lock, Terrain becomes a surface folder in the
monorepo with its own repo — the established pattern (`operations-site/`, `capital/`) — or stays
standalone and consumes a brand snapshot. Not decided yet.
