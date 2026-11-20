# TIS Terrain — Project Context

## What this folder is

The working directory for **TIS Terrain**, an English-native, self-serve SaaS product in the TIS
Patent Intelligence pillar. **Innovue builds and ships it, and `app/` is the reference it is built
from**: the frontend that defines how Terrain looks and behaves and the engine contract, delivered
to them as round packages, and four documents describe it. *Terrain* is the working name, not a decided one:
`docs/brief.md` §2 records the three in use.

This folder is **deliberately outside** the TIS brand monorepo (`~/Desktop/TIS`). That is a decision,
not an accident — see "Relationship to the TIS monorepo" at the bottom.

## The product, in one paragraph

Terrain is **patent search built to return the patents actually near an idea**, for founders and the
people who back them (`docs/brief.md` §1 *Who it is for*), **and to hand that set over as a file**.
You describe what you are building, Terrain returns the patents that are actually near it, you open
the ones that matter, and the results or one record leave as a CSV or a Markdown file. *Backers* are
the investors, incubators and accelerators behind a startup; an incubator is a backer, not a third
audience. Self-serve software searching Innovue's patent database. **TIS provides a patent
intelligence layer** (the second of four, between an organisation's own data and the tools and
decisions it runs on it) **and Terrain is TIS's own tool on that layer**: the low-cost baseline,
showing no price. An organisation's other tools, a portal fitted to it, and any analysis of a set
call the same layer. **Terrain has no tier word** (`docs/brief.md` §6).

**One flow, and every surface serves it:** search → find similar → export. There is no star, no
starred set, no report, and no account, billing or help page.

**The search shows what came back, as published, and says nothing about what it means.** The gap
worth solving is not finding patent information but finding information a founder can trust:
generative AI is near and writes what it returns, a keyword index is real and misses what is near.
Terrain is built to give both: the real patents nearest the idea, as published. *Trusted* is a claim
about the record and holds by construction; *near* is a claim about the set and is an aim, since the
evaluations of the engine are Innovue's, in two fields, against other tools. `docs/brief.md` §1
carries the wording rules.

**The line is between a view of the set and a reading of it.** A view (counts or groups by year,
holder, office or class, such as *Group by topic*, which groups by CPC subclass in CPC's own words) is
admissible, because every number in it can be checked against the rows, and a caption over it states
a count. A reading (a summary, a claim chart, a plain-English version, where an idea may differ) is
printed nowhere, and neither is legal advice stated as fact (*infringes*, *is clear*, *is novel*).
**Every row prints the engine's relevance score** beside its rank: the engine's number, never one
Terrain computes, and never sold as a confidence.

**The search is software, and a file is its page.** The user opens it and searches; nothing is
human-produced to order. `docs/brief.md` §1 carries the file test: no file states anything its page
did not.

## `app/` is the reference

**`app/` is what was decided.** The documents describe it. Where a document and `app/` disagree, the
code wins and the document is stale.

**`app/` is the reference for everything: behaviour, flow, the engine contract, type and layout.**
It is built from the round 4 detail lab (`visual-reference/innovue-build/round-4/detail-lab/`, V8),
which is the look Terrain now has; Innovue builds Terrain from our handoff packages on their own
engine, and the next round hands them that look. One reference means every difference between the
two builds has one answer. `docs/brief.md` §4 is the decision and `docs/platform.md` §13 is the
round; `/terrain-round` runs one.

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

app/                 THE REFERENCE Innovue builds from. Run it on a server, not file://
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
  overlays/round-N/  CSS and script injected into Innovue's live build — a round's
                     fixes, shipped in its package as the patch
  previews/
    terrain-prototype.html    FROZEN v1 — the landscape product. Kept for provenance
                              only: every partial in app/ names it as its source.
                              Not the reference, not maintained, not published.
    terrain-loading-lab.html  the loader bench

tools/               everything that can refuse — check-app.py, sync-tokens.py,
                     cssgates.py, test-gates.sh, and publish-pages.py, which
                     refuses before it writes
.claude/skills/terrain-round/  /terrain-round — one review-and-handoff round against
                     Innovue's build, in checkpointed phases. Procedure and scripts
                     only; node_modules and every capture stay untracked
.claude/skills/tis-copy/  /tis-copy — what a line of copy may claim, the banned lists,
                     and the English fluency pass. Procedure, not canon
.claude/skills/presentation-{outline,content,notes}/  the deck: its arc, its slide
                     copy, its speaker notes. Each defers to brief §1 and §3
.github/workflows/   gates.yml — runs the gates on every push to main. It does NOT
                     publish: publishing is a deliberate act, run by hand
brand/favicon.svg    the browser-tab icon — the submark, with its own dark/light block
brand/logos/tis/     TIS SVGs, copied from the monorepo (read-only, do not edit)
brand/logos/innovue/ a third party's marks, and the theme-aware attribution renders two
brand/fonts/         6 self-hosted woff2 + fonts.css + the two OFL licences
  ttf/               7 static TTFs for embedding in a deck, with their own two licences

    EXCLUDED FROM main — in the working tree, never tracked on this branch:
corpus/              THE STRESS-TEST SET, and what app/ loads by default. Real
                     patents captured from Google Patents; ?data=demo is the flag
                     that forces the fake engine instead. Excluded from main
                     because it prints real holder names; four of its paths ARE
                     published to gh-pages — see "What is published" above.
sales/
  answers.md         THE ANSWER BANK — what a buyer asks about the technology, a
                     deck line, a backup and a source per answer. Local because its
                     answers carry Innovue's figures; see "Innovue's research"
visual-reference/
  pi-vuepat/         the USERFLOW REFERENCE — Innovue's own search product, inventoried
  iptech-semantic-search/  the only evidence on two questions PI-VuePat does not close
  innovue-build/round-N/   one /terrain-round: STATE.md, captures, redlines, the zip
  innovue-research/  Innovue's two reports on their engine, translated side by side
                     zh / en, with a glossary and verify.py, the token-parity check
```

*The IPtech capture sets and the two comparison decks were archived out of this folder with
the landscape product; `~/Desktop/TIS-Terrain-archive/` holds them and a bundle of the whole
repository at tag `v1-landscape`. They argued a direction that no longer exists.*

Add directories when work actually needs them, not in advance — and a decision about where code goes
is recorded in `docs/brief.md` before the directory exists. `app/` and `demo/` are in §4 Locked.

## What is published, and what a stranger sees

**`app/` is published to GitHub Pages, against the real corpus.** The question that held this back
was *what does a stranger see when the fake engine answers* — bars where every holder and title
should be, and no drawing at all, because `demo/` ships none. The answer is that they do not see the
fake engine: the published site carries `corpus/`, so the link shows the product with real titles,
real assignees and 2,247 real plates. `demo/` ships with it as the fallback the seam requires, not
as what anybody lands on. **The corpus has no engine, so its relevance scores are stand-ins**: its
local engine gives each row a score that descends with the rank, so a row reads as Innovue's engine
fills it. No number in it was measured, and nothing outside the published page may cite one.

**The corpus is publishable because of how it was assembled, and that is the whole argument.** Ten
seed patents plus ninety reached by following each seed's own `similar` list on Google Patents — one
domain **by adjacency rather than by assertion**, and the grouping on screen is CPC's own published
classification. The thing the client-data boundary protects is *a taxonomy*, because a taxonomy is
what an analyst was paid for; there is no analyst in this set. Every record is a public patent
document. **A corpus assembled any other way is a different decision** — if the seeds ever come from
a client's technology area, the set carries that aim even though each patent is public.

**What is published is named, not filtered.** `app/`, `demo/`, `brand/`, and from `corpus/` exactly
four things: `engine.mjs`, `data.mjs`, `figures/` and `thumbs/`. What stays local is larger than what
goes: `corpus/raw/` is 58 MB of scraped HTML, `corpus/patents/` 19 MB of intermediate JSON — both
build inputs the app never loads — and `FINDINGS.md`, `build.py` and `fetch.py` are working material
rather than product. **A publisher that copied a directory wholesale would have shipped all five**,
which is why `tools/publish-pages.py` lists paths and refuses anything it was not given.

**The site is `noindex`, and that is not the same as private.** It is a pre-release product shown to
a named few; `robots.txt` and the root redirect both say so. Anyone with the URL can open it, and
GitHub Pages cannot be made otherwise on this plan. **Treat the link as public** — that is the fact
that governs what may go into the tree it serves.

**`main` keeps the raster rule and the corpus exclusion.** The published bytes live on `gh-pages`
and reach it through a worktree, so nothing on `main` tracks a PNG and `corpus/` stays excluded
there in its entirety. The rules did not lift; the branch they apply to is the one being protected.

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
it outright leaves a vacuum that the next session fills with a guess. **Nine rules have been lifted
this way, and each successor is checkable** — six by a document that says exactly what is permitted,
three by a script that refuses:

- Terrain **may** draw a view of a set, and a caption over it **states a count**. The line moved
  from the form — *no charts* — to the claim: `brief.md` §1 says what a view may count and what a
  caption may say, and `design-language.md` §2 says it is drawn without a hue.

- Terrain **has** an accent, and it is **achromatic** — the ink pair. `design-language.md` §3.8 says
  the four places it may appear (the open row's border among them) and the places it may not.
- *No gradient* is now **two named gradients and no third**: the ground's one light, on the page
  ground only, and the deck's silver edge, on two sites listed by name (Find similar and the
  relevance score chip). `design-language.md` §2 and §3.8 say where each may sit, and a third silver
  site is an amendment.
- A **download** is not the line between software and a document. The line is **what the file is
  permitted to say**, and `brief.md` §1 carries the test: does it state anything its page did not.
  A record and the results leave as a CSV or Markdown, and nothing leaves that the page did not show.
- `platform.md` §10 is an **ordered list of what is not next**, each with what would start it — not a
  fence, and not a backlog either.
- The semantic token count is no longer *the one place that number lives* — it appeared in three —
  it is **one argued place and a gate that refuses any copy disagreeing with `tokens.css`**.
- Tokens are no longer *inlined by hand*; they are **inlined by a generator with a byte-level
  check**, and `sync-tokens.py --check` is the successor to the honour system.
- Terrain **prints** legal status and CPC's class words, where it used to print neither. The line
  moved from *no status, no gloss* to *as published, or a dash*: the record prints the office's
  status word and CPC's published name for a class, and a field the record does not carry prints as
  a dash, never as a value Terrain derived. `components.md` §1 says exactly which fields and how
  each prints when `null`.
- `tools/` is no longer *everything CI or a publish runs*, and it is not *everything CI runs* either:
  it is **everything that can refuse**. `publish-pages.py` is admitted on that qualifier and on
  nothing else — it refuses a dirty tree, a failing gate, a missing corpus and a path it was not
  given, before it writes a byte. `publish-prototype.sh` was deleted for the lack of exactly that,
  so this is the fence holding rather than the fence moving back.

### Colour carries information, or it is not there

**Terrain has no hue of its own.** One place may take colour, the accent, and the accent is
achromatic. No decorative colour, and no gradient or tint but two, both the deck's: the slate ground
with its one light, and the silver edge on two named sites (`design-language.md` §2, §3.8). *Legal
status prints as a word, never a coloured chip, and the state hues have no reader; chart layers and a
direction-of-change pill left with what they coloured. Their tokens are gone rather than parked. A
view of the set does not bring a hue back: it draws from the neutral ramp.*

**A hue is an amendment, not a design task.** It means a semantic token in all three theme blocks,
measured against both grounds, argued against `design-language.md` §2 — and it would encode
direction, never desirability, and carry a word or a shape beside it. No green-means-good anywhere.

**The accent is for controls, never for data.** A primary action, a focus ring, a selected control,
and the open row's border, which marks where the founder is. Not a score, not a rank. `design-language.md` §3.8 is the rule and `brief.md` §5 is the
decision. The one green Terrain material carries is the sales deck's *live* dot, which `brief.md`
§5 confines to availability, always beside its word.

**Innovue's blue may only ever appear inside the Innovue mark itself.** In a border, a chip or a
button, it has been misread.

**And the rule describes two palettes.** Dark is a swap of **29 semantic tokens** — `design-language.md`
§10.1 is where that number is argued, and `tools/check-app.py` is what keeps every printed copy of it
honest — with **two named component exceptions and no others**, the two `.foot-mark-*` selectors on
the attribution line. **Three semantic tokens do not swap and each says so in its own row.** `--edge-silver` is one
gradient that reads on both grounds; the other two are facts about the content rather than
exemptions: `--figure-ground` is the paper a patent drawing was published on —
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
inlining six base64 payloads. A linked font stylesheet locks nothing; a linked token sheet would,
which is why the tokens are copied into each page rather than fetched by it.

### What belongs in `tools/`

**Every file in `tools/` can refuse, and that is now the whole test.** It read *run by CI* as well,
which stopped being the right fence the moment something was published by hand. Three kinds qualify
and there is no fourth:

- **It refuses** — `check-app.py` gates the source tree; `sync-tokens.py --check` gates the generated
  token regions byte for byte. `cssgates.py` is the lexer they share and refuses nothing on its own,
  which is why it is not a separate kind: it is part of `check-app.py`, in its own file because two
  callers read it.
- **It proves a gate fires** — `test-gates.sh`.
- **It refuses before it writes** — `publish-pages.py`. A dirty tree, a failing gate, a missing
  corpus or a path it was not given each stop it before a byte reaches `gh-pages`.

**The third kind is narrow on purpose, because its predecessor is why the fence exists.**
`publish-prototype.sh` checked nothing, and a script whose output nothing serves is a script that
rots pointing at a frozen file; it was deleted rather than kept. **A publisher that cannot refuse is
not admissible here** — that is the clause doing the work, not the fact that something is published
again.

**A generator that writes into the tree is admissible only when it also checks.** `sync-tokens.py`
qualifies because `--check` exists and CI runs it; a `--write` with no `--check` would be a second
source of truth with a script to spread it.

### Innovue's research

**Innovue shared two reports on their engine with TIS — its architecture, and an evaluation of it
against other tools — and made a roadshow deck that presents the engine.** All three are in
`visual-reference/innovue-research/` (R1, R2, R3), and `docs/brief.md` §3 says what they license.

**The deck's figures may be cited as Innovue's, with their scope; they are Innovue's claims, made to
be presented. A figure found only in the two reports reaches nothing public until Innovue confirms
it again, figure by figure.** That covers a deck, the website, a published page, and a tracked file
on `main`, because this repository is public and a push publishes. **Whenever a session prepares
public material that draws on any Innovue figure, it reminds the user to confirm with Innovue before
the material leaves**. The user asked for that reminder, so a session does not skip it. A behaviour of the engine
that a Terrain decision rests on may be stated in `docs/` without a figure; brief §3 draws that line.

**`sales/answers.md` may say less than `brief.md` §3 permits and never more.** It is a working
copy for a deck, not a fifth document: every answer cites the decision it rests on, and where the
two disagree, §3 wins.

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
  `platform.md` §11 says no invariant among them is checked.
- **Never name a real holder as data in `demo/`.** Holder names render as skeleton bars there by
  decision. Inventing one reads as a live example; transliterating a real one is fabrication. Both
  are worse than a bar.

  **`corpus/` is the narrower rule, not an exception to it.** It prints real assignee names because
  it is real captured data and its whole job is to strain renderers that were written against
  well-behaved shapes. It is excluded from `main` in its entirety, which is what keeps the demo rule
  meaningful: no real assignee or inventor name enters a tracked file *there*.

  **It is published on `gh-pages`, and that rests on a separate fact rather than on the exclusion,
  which it plainly breaks.** Every record is a public patent document, and the set was assembled by
  following Google Patents' own `similar` links out from ten seeds, so there is no taxonomy in it and
  no client's aim behind the selection. **Check that the next corpus is the same kind of thing before
  publishing it**: the same hundred records chosen by an analyst around a client's technology area
  would be a landscape, and publishing it would leak the one thing this boundary exists to protect.
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

**There is no exception on `main`.** A raster that is ours and meant to be published would be
admitted by its literal paths in `.gitignore`, one line each and no glob, with the same paths
excepted in `README.md` check 1 — and if that ever feels tedious enough to replace with a glob, that
is the guard working. Verify with `git check-ignore -v <path>`.

*The rule costs an `og:image` again now that something is published — one would have to be a PNG or
JPG, and scrapers will not render SVG. The guard is unchanged, which is the test it was written for:
it is the kind of rule that has to hold while it costs nothing, or it will not hold when it costs
something. It costs something now.*

**The 4,592 published drawings are not an exception to it, and the reason is which branch they are
on.** `corpus/**.png` is refused on `main` exactly as before; `tools/publish-pages.py` stages them
into a `gh-pages` worktree and force-adds paths it named itself. **A force-add is admissible only
from a script that enumerates what it is adding** — `git add -f -A` from a shell is the failure this
rule exists to catch, and the difference is whether a stray capture in the tree would ride along.*

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

**The product is English-only.** No Chinese surface, so no CJK face is in this folder — a decision,
not an omission. Don't add one, and don't write bilingual markup or `data-zh` attributes out of habit
from the parent site. The TIS website's page about the product carries a Traditional Chinese
translation; that is marketing copy in the monorepo, and it does not reach this folder.

`brand/fonts/` holds the 6 self-hosted woff2, `fonts.css`, and the two OFL licences. **The licences
must stay with them**: these are subsets, which OFL permits, and OFL 1.1 requires the notice travel
with the Font Software wherever it is redistributed. This repository is public, so that is not
theoretical.

**`brand/fonts/ttf/` is for decks, not pages.** A `.pptx` embeds raw TrueType and a presenter installs
TTF; neither can use a woff2 subset. Seven static faces — Urbanist 400, 500, 600, 700 and Inconsolata
400, 500, 700 — each family with the OFL file it was released with. They are a different release from
the woff2 subsets, which is why the licences beside them differ by a copyright year and are not
merged. No page links them.

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
**Four TIS variants come from `~/Desktop/TIS/brand/assets/logos/tis/` instead**, because the website
folder does not carry them: the primary logo in dark and light, the dark dual secondary, and the
licensing-platform logo. They are there for decks.

Terrain is an **endorsed sub-brand**: the TIS mark appears in the lockup, Terrain is the product name.
Innovue appears as **attribution only** — *Powered by Innovue* at the foot of the home page and nowhere else in the product (`docs/brief.md` §3),
rendered as their own mark (a sales deck says *our IP-technology provider* instead, with no mark), and the database cited in body copy where it does credibility work. **Innovue never
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

**Terrain stays standalone, and the monorepo consumes it.** The TIS website's Patent Search page
(`website/product/search/`, veiled) is captured from this repository and its brief points at
`docs/brief.md`. It is downstream, and what it trails is listed in `docs/brief.md` §7.

The monorepo's root `CLAUDE.md` governs any working directory beneath it, and its project memory is
keyed to that path. Building Terrain inside it would inherit the brand DAG, the snapshot-resync
obligations, the changelog law, and a PostToolUse brand-sync hook — machinery for a surface that
consumes a settled brand system. Terrain's product is settled enough for a website page to describe
it; its system is not. The name is open, the accent and the dark palette are Terrain's rather than
the brand's, and the components are still moving round by round in a build a third party owns. The
real risk is not a broken build; it is an agent helpfully routing Terrain's components into
`brand/components.md` and locking them to existing tokens while Innovue's rounds are still moving
them.

The cost of the split is a propagation step later. **Record upstream-affecting decisions in
`docs/brief.md` §7 as they are made** so that step stays a merge and not an excavation.

**Graduation:** once positioning and design direction lock, Terrain becomes a surface folder in the
monorepo with its own repo — the established pattern (`operations-site/`, `capital/`) — or stays
standalone and consumes a brand snapshot. Not decided yet.
