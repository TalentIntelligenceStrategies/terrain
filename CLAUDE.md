# TIS Terrain — Project Context

## What this folder is

The working directory for **TIS Terrain**, an English-native, self-serve SaaS product in the TIS
Patent Intelligence pillar. **`app/` is the product** — the frontend, and what gets handed over —
and four documents describe it.

This folder is **deliberately outside** the TIS brand monorepo (`~/Desktop/TIS`). That is a decision,
not an accident — see "Relationship to the TIS monorepo" at the bottom.

## The product, in one paragraph

Terrain is **patent search that returns an accurate set and hands it over cleanly**, for founders
working out where their idea sits. You describe what you are building, Terrain returns the patents
that are actually near it, you star the ones that matter, and you take them out as a file.
Self-serve software on a subscription, searching the full Innovue patent database.

**One flow, and every surface serves it:** search → find similar → star → the starred set → export.

**Terrain does not analyse.** No map, no charts, no widgets, no generated summary. Founders do not
run somebody else's pre-built analysis — they take the data and work it in tools they already trust,
because they know how the answer came out. The gap worth solving sits upstream of analysis: patent
search returns inaccurate, incomplete sets, and an accurate one is the product.

**That is a claim about retrieval, not about presentation.** Anything that reads the result set and
tells the founder what it *means* is out, however small: a finding sentence, a caption, a verdict, a
score we computed. Terrain prints what the engine returned and what the patent says.

**Terrain is software, not a report.** The user logs in and searches; nothing is human-produced to
order. A file the founder assembles from their own starred set is their data leaving, not our report
arriving — `docs/brief.md` §1 carries the test, and it is a test rather than a ban.

## `app/` is the reference

**`app/` is what was decided.** The documents describe it. Where a document and `app/` disagree, the
code wins and the document is stale.

**Run it:** `python3 -m http.server 8765` from the repo root, then `http://127.0.0.1:8765/app/`.
`file://` will never work — ES modules are CORS-fetched and a `file://` origin is opaque.

That does **not** make `app/` the place to record a decision. Settle it in `docs/`, then build it. A
design decision that exists only as a diff is a decision nobody can find.

**`design/previews/terrain-prototype.html` is the frozen v1 landscape prototype.** It is kept because
every partial in `app/` cites it as the file it was extracted from, and that provenance is worth more
than the tidier tree. It is **not the reference, not maintained, and not published**. Do not edit it,
and do not read it to settle a question about what Terrain is now — it answers about a product that
was replaced.

## Structure

```
CLAUDE.md            this file — how to work here
README.md            what a visitor to the public repo reads first

app/                 THE PRODUCT, and the reference. Run it on a server, not file://
  README.md          THE HANDOFF DOCUMENT — how to run it is its first line
  index.html · lab.html · partials/ · styles/ · js/core/ · js/surfaces/
demo/                fake data and the fake engine. A SIBLING of app/, deletable,
                     imported exactly once — see "The demo seam" in app/README.md

docs/                FOUR FILES. See "Four documents" below.
  brief.md           what Terrain IS — positioning, the name, Innovue, locked, the accent
  platform.md        what gets BUILT — the PRD, written against app/
  design-language.md how it LOOKS — tokens, type, space, motion, the skeleton contract

design/
  components.md      what the ENGINE must return, per component
  previews/
    terrain-prototype.html    FROZEN v1 — the landscape product. Kept for provenance
                              only: every partial in app/ names it as its source.
                              Not the reference, not maintained, not published.
    terrain-loading-lab.html  the loader bench

tools/               everything CI runs, and every one of them can refuse —
                     check-app.py, sync-tokens.py, cssgates.py, test-gates.sh
.github/workflows/   gates.yml — runs the gates on every push to main. NOTHING PUBLISHES
brand/assets/imagery/terrain/  the ONE permitted raster family — see Rules
brand/favicon.svg    the browser-tab icon — the submark, with its own dark/light block
brand/logos/tis/     TIS SVGs, copied from the monorepo (read-only, do not edit)
brand/logos/innovue/ a third party's marks, and the theme-aware attribution renders two
brand/fonts/         7 self-hosted woff2 + fonts.css + the two OFL licences

    LOCAL ONLY — in the working tree, excluded by .gitignore, never pushed:
corpus/              THE STRESS-TEST SET, and what app/ loads by default when it is
                     here. Real patents captured from Google Patents; ?data=demo is
                     the flag that forces the fake engine instead. It prints real
                     holder names, which is why the whole directory is excluded —
                     see brief.md §4.
visual-reference/
  pi-vuepat/         the USERFLOW REFERENCE — Innovue's own search product, inventoried
  iptech-semantic-search/  the only evidence on two questions PI-VuePat does not close
```

*The IPtech capture sets and the two comparison decks were archived out of this folder with
the landscape product; `~/Desktop/TIS-Terrain-archive/` holds them and a bundle of the whole
repository at tag `v1-landscape`. They argued a direction that no longer exists.*

Add directories when work actually needs them, not in advance — and a decision about where code goes
is recorded in `docs/brief.md` before the directory exists. `app/` and `demo/` are in §4 Locked.

## Nothing is published

**Terrain publishes nothing, and that is a decision rather than a gap.** The public URL served a
single-file prototype of the landscape product; that product was replaced, and a link showing it
misrepresents what Terrain is. `gh-pages` was emptied and the pipeline that filled it was retired —
`publish-prototype.sh`, `strip-comments.py`, `check-publish.py` and `check-figures.mjs` are gone,
along with the fifteen publish plants and the eight arithmetic plants in `tools/test-gates.sh`.

**Publishing `app/` was considered and is not next.** It is 40-odd files with a demo seam, and making
it public means deciding what a stranger sees when the fake engine answers. That is a real piece of
work, not a build-script change, and nothing depends on it today.

**What CI does now is refuse.** `.github/workflows/gates.yml` runs `check-app.py`,
`sync-tokens.py --check` and `test-gates.sh` on every push to `main`. No paths filter, deliberately —
a rule that silently skips the thing you needed it to do is the failure this repository keeps
relearning.

**The gates are in Python, and why is the most useful thing here.** They were shell first, and **three
of them silently did not run** — `grep -P` does not exist on macOS, the `node` syntax check never
fired, and a `fail` inside a pipeline subshell could not stop the run. **All three reported
clean.** `tools/test-gates.sh` plants a violation for **every** gate and proves it
refuses. **Add a gate, add its test** — a gate nobody has watched fail is not a gate.

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

**`app/README.md` is not a fifth either, on the same terms** — the front door for `app/`, holding no
rule that is not already in one of the four. That constraint is what keeps it honest: **if it ever
states a rule that is not in `design-language.md`, the rule is in the wrong file.**

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
it outright leaves a vacuum that the next session fills with a guess. **Six rules have been lifted
this way, and each successor is checkable** — three by a document that says exactly what is permitted,
three by a script that refuses:

- Terrain **has** an accent (green), and `design-language.md` §3.8 says the three places it may appear
  and the places it may not.
- A **download** is no longer the line between software and a report. The line is **what the file is
  permitted to say**, and `brief.md` §1 carries the test: does it state anything the interface did
  not. The founder's starred set leaves as a CSV; a cover page, a summary or a conclusion does not.
- `platform.md` §10 is an **ordered list of what is not next**, each with what would start it — not a
  fence, and not a backlog either.
- The semantic token count is no longer *the one place that number lives* — it appeared in three —
  it is **one argued place and a gate that refuses any copy disagreeing with `tokens.css`**.
- Tokens are no longer *inlined by hand*; they are **inlined by a generator with a byte-level
  check**, and `sync-tokens.py --check` is the successor to the honour system.
- `tools/` is no longer *everything CI or a publish runs*; it is **everything CI runs, that can
  refuse** — a fence one step in, and still a fence, because there is no publish.

### Colour carries information, or it is not there

**Three permitted places and no more**: discrete states, direction of change, and the accent. No
gradient, no decorative colour, no tinted background. *Chart layers were a fourth and left with the
charts entirely. There is no chart token and no chart: the points page draws a meter bar and a table.*

**Colour encodes direction, never desirability.** No green-means-good anywhere: a status chip says
*Live* or *Expired* and neither is good news, because whether a live patent is a problem depends
entirely on what the founder is building. Every coloured element also carries a word or a shape;
never colour alone.

**The accent is for controls, never for data.** A primary action, a focus ring, a selected control.
Not a status, not a score, not a relevance rank. `design-language.md` §3.8 is the rule and
`brief.md` §5 is the decision. **`app/` has not been repainted** — the specific green is unchosen, and
applying it is a separate, visible pass.

**Innovue's blue may only ever appear inside the Innovue mark itself.** In a border, a chip or a
button, it has been misread.

**And the rule describes two palettes.** Dark is a swap of **30 semantic tokens** — `design-language.md`
§10.1 is where that number is argued, and `tools/check-app.py` is what keeps every printed copy of it
honest — with **two named component exceptions and no others**, the two `.foot-mark-*` selectors on
the attribution line. **Two semantic tokens do not swap and each says so in its own row**, and both are facts about the
content rather than exemptions: `--figure-ground` is the paper a patent drawing was published on —
black line-work composited onto `#1A1A1A` is a blank rectangle — and `--veil` is the ground under a
control bar floating on that paper, so it composites over the drawing rather than over the app.
*`--scrim` is the one that looks like it belongs with them and does not: it dims the app, which does
swap, so it swaps.* **No component may read a primitive (`--n-*`) or
a raw hex**; eleven violations had to be fixed before the pass could work. A component that reads a
primitive is a component that silently stays light, and `tools/check-app.py` is what refuses one now.

### Icons come from Lucide, and nothing else

No Heroicons, no Feather, no Material, no one-off SVGs pulled from a search result. Mixing sets is
immediately visible in the stroke weight and the corner radius, and it reads as an interface assembled
from parts.

### Every page carries its own tokens, and one file authors them

**No standalone page fetches a token stylesheet.** A page somebody opens from a download has to work
with nothing beside it, and that is the whole reason the original rule existed — so the bytes stay in
the page. What moved is only *where the block is authored*.

`app/styles/tokens.css` is **the one authored copy**. Every other copy is a region between

```
/* ══ tokens · generated ══ */  …  /* ══ end tokens ══ */
```

written by `tools/sync-tokens.py --write` and verified **byte-for-byte** by `--check`, which CI runs
on every push. Byte-for-byte and not value-for-value: the block carries ~130 lines of irreplaceable
reasoning — every measured contrast ratio, why the dark list is duplicated — and a value diff passes
while all of it drifts.

**Inside the sentinels the authored file wins, whatever the page says.** That is the one exception to
the reference rule and it is narrow on purpose: two sources of truth is the silent-drift failure this
repository keeps relearning, and a generated region has exactly one. A page **may** declare its own tokens *below* the
closing sentinel; **no page currently does**, and the loading lab's `--scrim` — the only candidate —
went instead, because nothing read it. *There is a `--scrim` in `tokens.css` now, and it is not that
one coming back: it is authored in the one file that authors tokens, it has exactly one reader, and
`design-language.md` §3.2 names it.*

**`app/index.html` is not a target and links `app/styles/tokens.css` instead.** The rule exists so a
page opened from a download works with nothing beside it; `app/` cannot do that under any
circumstances, so a third generated copy beside the authored one would be drift risk bought for
nothing. **`terrain-prototype.html` is not a target either, and that one is a freeze rather than a
rule**: it reads 28 tokens that left with the analysis layer, so regenerating its block would blank
the page rather than update it. `tools/sync-tokens.py` carries the argument at its `TARGETS` list.

*The typefaces are the other shared thing.* Every page links `brand/fonts/fonts.css` rather than
inlining seven base64 payloads. A linked font stylesheet locks nothing; a linked token sheet would,
which is why the tokens are copied into each page rather than fetched by it.

### What belongs in `tools/`

**Every file in `tools/` is run by CI, and every one of them can refuse.** Two kinds qualify and there
is no third:

- **It refuses** — `check-app.py` gates the source tree; `sync-tokens.py --check` gates the generated
  token regions byte for byte. `cssgates.py` is the lexer they share and refuses nothing on its own,
  which is why it is not a third kind: it is part of `check-app.py`, in its own file because two
  callers read it.
- **It proves a gate fires** — `test-gates.sh`.

**The kind that built the published tree is gone with the publish.** `publish-prototype.sh` and
`strip-comments.py` were the whole of it, and a script whose output nothing serves is a script that
rots pointing at a frozen file. Deleting them is the rule working rather than the rule being
suspended — this fence narrowed, it did not move.

**A generator that writes into the tree is admissible only when it also checks.** `sync-tokens.py`
qualifies because `--check` exists and CI runs it; a `--write` with no `--check` would be a second
source of truth with a script to spread it.

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

- **Every figure in `demo/` and in `docs/` is illustrative.** No number is a real filing count, and
  `platform.md` §11 carries the one invariant that survived the analysis layer. Nothing checks it.
- **Never name a real holder as data in `demo/`.** Holder names render as skeleton bars there by
  decision. Inventing one reads as a live example; transliterating a real one is fabrication. Both
  are worse than a bar.

  **`corpus/` is the narrower rule, not an exception to it.** It prints real assignee names because
  it is real captured data and its whole job is to strain renderers that were written against
  well-behaved shapes. It is excluded from git in its entirety, which is what makes that affordable:
  no real assignee or inventor name enters a tracked file. **The cost is stated rather than hidden** —
  the export and the drawings are only demonstrable against it, because a spreadsheet of skeleton
  bars shows nothing and `demo/` ships no patent figure at all, and `app/README.md` says so where
  somebody receiving the handoff will read it.
- **A worked example is written from scratch, never derived from a client's.** The temptation is real,
  because a set modelled on one that exists has a plausible distribution for free — and that is
  exactly what makes the labels travel with it. **Pick a domain nobody has hired us about.**
- **The captures stay local.** They render a client's data as pixels. Nothing tracked may embed them,
  and the IPtech capture sets have been archived out of this folder entirely. Before any push, run
  the four checks in `README.md`.

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

*The rule cost an `og:image` back when something was published — one would have to be a PNG or JPG,
and scrapers will not render SVG. Nothing is published now, so the cost is currently nil and the
guard is unchanged: it is the kind of rule that has to hold while it costs nothing, or it will not
hold when it costs something.*

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
consuming a settled brand system, all premature for a product whose positioning was still moving. The
real risk was never a broken build; it was an agent helpfully routing Terrain's components into
`brand/components.md` and locking the design to existing tokens during the exact phase that needed
latitude — and the pivot from landscape analysis to search is the proof that the phase was real.

The cost of the split is a propagation step later. **Record upstream-affecting decisions in
`docs/brief.md` §7 as they are made** so that step stays a merge and not an excavation.

**Graduation:** once positioning and design direction lock, Terrain becomes a surface folder in the
monorepo with its own repo — the established pattern (`operations-site/`, `capital/`) — or stays
standalone and consumes a brand snapshot. Not decided yet.
