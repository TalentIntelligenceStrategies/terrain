# TIS Terrain — Project Context

## What this folder is

The working directory for **TIS Terrain**, an English-native, self-serve SaaS product in the TIS
Patent Intelligence pillar. It is in the **design and definition** phase: there is a working
prototype and four documents, and no application code.

This folder is **deliberately outside** the TIS brand monorepo (`~/Desktop/TIS`). That is a decision,
not an accident — see "Relationship to the TIS monorepo" at the bottom.

## The product, in one paragraph

Terrain is patent search with strategic direction, for founders working out where their idea sits.
You arrive with a concept — filed, mid-filing, or nowhere near it — and Terrain shows you who else is
in the space, which technology is adjacent to yours, and which part of it each of them holds.
Self-serve software on a subscription, searching the full Innovue patent database.

**Two questions:** *who else is here?* and *what is adjacent?* What makes it a product rather than a
search box is **legibility and self-serve** — the same analysis an IP professional runs, operable by
the founder who has the question.

**Terrain is software, not a report.** The user logs in and searches; nothing is human-produced to
order. Never write copy that describes it in report language.

**The map's rows are holders.** An empty cell means *this company has not filed against that
approach* — a fact about them, not about the technology. `docs/brief.md` §1 carries the test for what
may and may not be said about it, and it is a test rather than a ban: statements about *these
holders* are admissible, statements about *this technology being unclaimed* are not.

## The prototype is the reference

**`design/previews/terrain-prototype.html` is what was decided.** The documents describe it. Where a
document and the prototype disagree, the prototype wins and the document is stale — which is the
reverse of the rule that governed this folder while the definition was being written, and it is the
right way round now that there is a working thing to read.

That does **not** make the prototype the place to record a decision. Settle it in `docs/`, then build
it. A design decision that exists only as a diff is a decision nobody can find.

## Structure

```
CLAUDE.md            this file — how to work here
README.md            what a visitor to the public repo reads first

docs/                FOUR FILES. See "Four documents" below.
  brief.md           what Terrain IS — positioning, the name, Innovue, locked, the accent
  platform.md        what gets BUILT — the PRD, reverse-written from the prototype
  design-language.md how it LOOKS — tokens, type, space, motion, the skeleton contract

design/
  components.md      what the ENGINE must return, per component
  previews/
    terrain-prototype.html    the product
    terrain-loading-lab.html  the loader bench

tools/               ONLY what regenerates the published branch — publish-prototype.sh,
                     strip-comments.py, check-publish.py, test-gates.sh
.github/workflows/   publish-prototype.yml — rebuilds gh-pages on every push to main
brand/assets/imagery/terrain/  the ONE permitted raster family — see Rules
brand/favicon.svg    the browser-tab icon — the submark, with its own dark/light block
brand/logos/tis/     TIS SVGs, copied from the monorepo (read-only, do not edit)
brand/fonts/         7 self-hosted woff2 + fonts.css + the two OFL licences

    LOCAL ONLY — in the working tree, excluded by .gitignore, never pushed:
visual-reference/    every capture and crop of IPtech
  iptech-screenshots/ · iptech-screenshots-identified/ · iptech-semantic-search/
  mmap-audit/        59 captures of a LIVE CLIENT PROJECT — assignee, inventor and examiner
                     names, patent numbers, counts, and that landscape's own axes.
                     NOTHING from these travels.
  visual-inspiration/ · comparison-assets/
design/previews/iptech-terrain-comparison.html   the side-by-side deck
design/previews/iptech-feature-request.html      the capability ask addressed to Innovue
brand/logos/innovue/ a third party's marks. TWO exceptions are tracked and published —
                     Innovue_Logo_Blue_eng_inline.svg and Innovue_Logo_Light_eng_inline.svg,
                     which the theme-aware attribution line renders. See Logos.
```

Add directories when work actually needs them, not in advance. When application code arrives it goes
in `app/`, and that decision gets recorded in `docs/brief.md` first.

## Publishing

**Two branches, and the split is the whole design.**

| | `main` | `gh-pages` |
| --- | --- | --- |
| holds | everything | 14 files |
| is | authored | **generated — never edit it by hand** |
| is served | **no** | yes, at `talentintelligencestrategies.github.io/terrain/` |

`gh-pages` carries the prototype as `index.html`, the eleven assets it references, and **both OFL
licences** — this branch redistributes seven subset woff2 on a public host, which is precisely the
case OFL 1.1 covers.

**Pages has no per-file access control**, so publishing the prototype without publishing `docs/` means
pointing Pages at a smaller tree. Two transforms separate the branches and both are mechanical:
`../../brand/` → `brand/`, and **every comment stripped** — 51% of the file by weight. None of it is
client data and all of it is ours, but it is reasoning written for this room, and a link sent outward
carried it in view-source.

**The workflow is: edit, check locally, push to `main`.**
`.github/workflows/publish-prototype.yml` runs on every push to `main`, rebuilds `gh-pages` and
pushes it; Pages redeploys itself about a minute later. No Pages setting is involved in a publish.

`tools/publish-prototype.sh` is the same thing by hand, and `--build-only <dir>` assembles the tree
without publishing. **CI calls that flag rather than repeating the build**, so the tree the gates are
tested against is the tree that ships.

**The gates are in Python, and why is the most useful thing here.** They were shell first, and **three
of them silently did not run** — `grep -P` does not exist on macOS, the `node` syntax check never
fired, and a `fail` inside a pipeline subshell could not stop the publish. **All three reported
clean.** `tools/test-gates.sh` plants a violation for **every** gate and proves it
refuses. **Add a gate, add its test** — a gate nobody has watched fail is not a gate.

**Jekyll still runs, on the smaller tree.** Two consequences stand: a build failure fails the whole
deploy, and any path added with a `_` prefix is dropped with no error. **`touch .nojekyll` is the
entire fix, and the trigger is a `_`-prefixed path, not a broken page** — the failure is silent by
construction, so nothing will tell you.

## Rules

### Four documents

**`docs/` holds three files and `design/components.md` is the fourth.** They split by *reader*:

- `brief.md` — what Terrain **is**. For anyone deciding whether this is the right product.
- `platform.md` — what gets **built**. For anyone building it.
- `design-language.md` — how it **looks**. For anyone designing against it.
- `components.md` — what the **engine** must return. For an engineer on the other side of the API.

**A fifth needs a distinct *kind* of content and a distinct *reader*, not just a distinct topic.**
`README.md` is not a fifth — it is the front door for a visitor and holds no decision that is not
already in one of the four. If it and they disagree, they win.

**Add to an existing document before creating a new file.** A folder of near-duplicate markdown is how
the definition phase stops being legible.

### Present tense

**These documents describe what is, not how it got there.** No amendment trails, no struck sections,
no dated corrections, no *this read X until Y*. Git history is the record of how a decision was
reached; the document is the decision.

**Where a rule would look arbitrary to a new reader, one sentence says why** — and the why is the
argument, not the chronology.

### Lift a rule by narrowing it

When a rule stops serving, **replace it with a narrower one that can actually be applied.** Deleting
it outright leaves a vacuum that the next session fills with a guess. Three rules were lifted this way
on 2026-09-15 — the no-accent rule, the absence prohibition, and the deferred-scope fence — and each
has a successor that is checkable:

- Terrain **has** an accent (green), and `design-language.md` §3.8 says the three places it may appear
  and the places it may not.
- Copy **may** describe a holder's absence and **may not** describe the territory as empty, with the
  test written out in `brief.md` §1.
- `platform.md` §12 is an **ordered list of what is not next**, each with what would start it — not a
  fence, and not a backlog either.

### Colour carries information, or it is not there

Four permitted places and no more: discrete states, direction of change, the chart layers, and the
accent. No gradient, no decorative colour, no tinted background.

**Colour encodes direction, never desirability.** No green-means-good anywhere. The density ramp stays
tonal and the filings series stays neutral, because the interface may not imply *why* a cell is empty
— and a green cell or a green rising trend line does exactly that. Every coloured element also carries
a word or a shape; never colour alone.

**The accent is for controls, never for data.** A primary action, a focus ring, a selected control.
Not a chart series, not a map cell, not a status. `design-language.md` §3.8 is the rule and
`brief.md` §5 is the decision. **The prototype has not been repainted** — applying it is a separate,
visible pass.

**Innovue's blue may only ever appear inside the Innovue mark itself.** In a border, a chip, a chart
or a button, it has been misread.

**And the rule describes two palettes.** Dark is a swap of 40 semantic tokens with no component rule
touched. **No component may read a primitive (`--n-*`) or a raw hex**; two greps prove it, and eleven
violations had to be fixed before the pass could work. A component that reads a primitive is a
component that silently stays light.

### Icons come from Lucide, and nothing else

No Heroicons, no Feather, no Material, no one-off SVGs pulled from a search result. Mixing sets is
immediately visible in the stroke weight and the corner radius, and it reads as an interface assembled
from parts.

### Previews inline their own tokens

Each file in `design/previews/` carries its own token block — no shared token stylesheet, no build
step. Extract a shared token only once three previews independently want the same value.

*The typefaces are the one shared thing.* Every page links `brand/fonts/fonts.css` rather than
inlining seven base64 payloads. **Tokens stay inlined**; a linked font stylesheet locks nothing, a
linked token sheet would.

### The client-data boundary

**This is a public repository, and the boundary is client data, not Innovue's features.** Innovue
markets IPtech's capabilities publicly, so reading them, rating them and arguing with them is ordinary
competitive work. What may never be published is a **client's data** or a **patent landscape that is
not ours**.

**A scrub that changes the numbers and keeps the labels has not removed the landscape.** A taxonomy is
the most valuable thing on the screen — it is what the analyst was paid for — and it survives
translation, reordering and having its counts replaced. **Check the axis labels, the row names, the
column headers and the category lists, not just the digits.**

**A client's category list is client data in prose exactly as much as in an array.** In a prototype it
sits in a data array and looks like data; in a document it sits inside a sentence, in parentheses,
reading as a *citation*. It is the same landscape. The test for whether it may stay is whether the
surrounding argument would survive its deletion.

**When a capture of a real project enters a session — a screenshot pasted into chat included — grep
the tree for every proper noun on it before doing anything else.** `README.md` check 3 is a record of
leaks already found, never a definition of what a leak looks like: it cannot recognise a name it has
not been told, and every entry in it was caught this way rather than by running it.

**Report what you checked, never that the tree is clean.** A sweep is only as wide as the capture set
that feeds it. *These nouns are absent* is a claim the evidence supports; *the tree is clean* is not,
and writing it down stops the next person looking.

Four things follow:

- **Every figure in the prototype and in `docs/` is illustrative.** No number is a real filing count.
  If you change one, keep the invariants in `platform.md` §13. Nothing checks this for you.
- **Never name a real holder as data.** Holder names render as skeleton bars by decision. Inventing
  one reads as a live example; transliterating a real one is fabrication. Both are worse than a bar.
- **A worked example is written from scratch, never derived from a client's.** The temptation is real,
  because a landscape modelled on one that exists has a plausible distribution for free — and that is
  exactly what makes the labels travel with it. **Pick a domain nobody has hired us about.** *One
  scoped exception is in force: the five direction options at the narrowing step are observed output
  from Innovue's own semantic surface, rendered as real words rather than bars. Observed is not
  invented, and they are nobody's client data.*
- **The captures stay local.** They render a client's data as pixels. Nothing in a published artifact
  may embed them. Before any push, run the four checks in `README.md`.

### The raster rule

**`.gitignore` is a hint; the raster rule is the mechanism.** `*.png` and friends are refused
wholesale, because the path-based rule failed once: a folder was renamed outside the repo, the ignore
entry stopped matching, and `git add -A` staged 6 MB of it while the name-based check reported clean.

**There is exactly one exception.** `brand/assets/imagery/terrain/` holds three files —
`terrain-forest.jpg` at 640×413 plus the 400 and 640 `.webp` variants — Terrain's own gradient
thumbnail for the TIS website's Products menu. 48 KB total. They are **ours** and meant to be
published, so neither reason behind the rule applies.

**It is scoped to three literal paths, no glob.** A rename is refused. A fourth file in that directory
is refused. Verify with `git check-ignore -v <path>`. **Adding a product means adding its three paths
deliberately, one line each** — if that ever feels tedious enough to replace with a glob, that is the
guard working.

*A consequence worth knowing: the published prototype ships without an `og:image`, because one would
have to be a PNG or JPG — scrapers will not render SVG. The link unfurls as text. A nicer card is not
worth a fourth literal path.*

### Do not invent brand law

Terrain is a TIS product, but this folder is not the TIS brand system. If a decision here changes
something that belongs upstream — a token, a logo rule, a component, the Innovue attribution phrasing
— say so in the session and record it in `docs/brief.md` §7, then leave it for a deliberate
propagation pass. **Never edit the monorepo from this folder.**

### No emoji

Plain commit messages, and never an AI-attribution trailer of any kind.

## Typefaces

Two, carried over from TIS and locked:

| Role | Typeface |
| --- | --- |
| Text and display | **Urbanist** |
| Numerals, figures, monospace | **Inconsolata** |

**Terrain is English-only.** No Chinese surface, so no CJK face is in this folder — a decision, not an
omission. Don't add one, and don't write bilingual markup or `data-zh` attributes out of habit from
the parent site.

`brand/fonts/` holds the 7 self-hosted woff2, `fonts.css`, and the two OFL licences. **The licences
must stay with them**: these are subsets, which OFL permits, and OFL 1.1 requires the notice travel
with the Font Software wherever it is redistributed. This repository is public, so that is not
theoretical.

Every page links it — no server, no build step:

```html
<link rel="stylesheet" href="../../brand/fonts/fonts.css">
```

**Render and look at the PNG when you touch font loading** — a missing typeface falls back to a system
face and reports nothing.

If a Chinese surface is ever needed, Noto Sans TC lives in the marketing site's subset build at
`~/Desktop/TIS/website/assets/build/fonts/` — but it is **split across four subset files**, each with
its own `unicode-range`. All four are required, and dropping one silently falls back to a system CJK
face for part of the character set. Copy the `@font-face` block with the files rather than
reconstructing it.

## Logos

`brand/logos/` holds the TIS and Innovue SVGs, copied from
`~/Desktop/TIS/website/designs/assets/logos/` with original filenames intact so references stay
greppable against the parent system. **Treat them as read-only.** Use the `_eng` variants.

Terrain is an **endorsed sub-brand**: the TIS mark appears in the lockup, Terrain is the product name.
Innovue appears as **attribution only** — *Powered by Innovue* at the foot of every surface, rendered
as their own mark, and the database cited in body copy where it does credibility work. **Innovue never
enters the product name or the primary lockup.** The reasons are commercial, not aesthetic, and they
are in `docs/brief.md` §3.

**Two of the eight Innovue SVGs are tracked**, because a published page cannot reference a file that
is not published: the tight-cropped `_eng_inline` variants in blue and in white, since the line is
theme-aware. The rule reads `brand/logos/innovue/*` and not `brand/logos/innovue/`, because **git will
not descend into an excluded directory and a `!` negation under one silently does nothing** — the
wrong form fails exactly like the right one until you run `git check-ignore`.

**`brand/favicon.svg` is the one new brand asset** — the submark's three polygons with their own
`prefers-color-scheme` block, because an external favicon cannot inherit `currentColor` the way the
inlined submark does. It is a new file, not an edit to `brand/logos/tis/`, which stays read-only.
**SVG, and it has to be**: the raster rule refuses a `.ico` or a `.png`, and the cost is Safari, whose
SVG-favicon support is partial. It follows the *browser's* colour scheme rather than Terrain's own
theme control, and nothing can change that.

## Relationship to the TIS monorepo

The monorepo's root `CLAUDE.md` governs any working directory beneath it, and its project memory is
keyed to that path. Building Terrain inside it would inherit the brand DAG, the snapshot-resync
obligations, the changelog law, and a PostToolUse brand-sync hook — all correct for a surface
consuming a settled brand system, all premature for a product whose positioning is still moving. The
real risk was never a broken build; it was an agent helpfully routing Terrain's components into
`brand/components.md` and locking the design to existing tokens during the exact phase that needs
latitude.

The cost of the split is a propagation step later. **Record upstream-affecting decisions in
`docs/brief.md` §7 as they are made** so that step stays a merge and not an excavation.

**Graduation:** once positioning and design direction lock, Terrain becomes a surface folder in the
monorepo with its own repo — the established pattern (`operations-site/`, `capital/`) — or stays
standalone and consumes a brand snapshot. Not decided yet.
