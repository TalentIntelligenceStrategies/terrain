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
is in the space, which technology is adjacent to yours, and which part of it each of them holds.
Self-serve software on a subscription, searching the full Innovue patent database. Read
[docs/brief.md](docs/brief.md) before doing any substantive work; it carries the positioning and
the list of what is still open.

***Two questions, not three, since 2026-09-10.*** *Where are the gaps?* was dropped when Innovue's
architecture was adopted: the map's rows are **holders** now, and an empty cell on a Technology ×
Assignee grid means *this company has not filed there*, which is a competitor's profile and not
open ground. **Never write copy that says Terrain shows absence, whitespace or open ground**, and
never reintroduce the zone names Crowded / Emerging / Open. What makes it a product rather than a
search box is **legibility and self-serve** — the same analysis an IP professional runs, operable
by the founder who has the question. `docs/brief.md` §1 and `docs/platform.md` §1a carry it.

Terrain is **software, not a report** — the user logs in and searches, nothing is human-produced to
order. Never write copy that describes it in report language.

## Structure

```
CLAUDE.md            this file — how to work here
README.md            what a visitor to the public repo reads first
index.html           the landing page — links all three previews. NOT SERVED any more:
                     Pages publishes the gh-pages branch, which is the prototype alone
docs/brief.md        positioning, naming, the Innovue relationship — what Terrain is
docs/platform.md     product definition — what gets built, and §9 DEFERRED — NOT IN SCOPE
docs/design-language.md  tokens, type, components — how it looks
docs/marketing.md    outbound copy for a founder — the product page, the voice chart, the nav
docs/case.md         outbound — the capability read and the design pass, for management and
                     Innovue. The page renders §0.1–§0.4 and §3–§6; §0.5, §4.H and §7–§10 stay in
                     the record and do not render
design/previews/     the case document and the prototype — both maintained directly
design/previews/terrain-product-page.html  the marketing product page — a SCAFFOLD, built
                     in the website's house style for later transplant into ~/Desktop/TIS/website/
design/components.md the component manifest — per component, the data shape the engine must return
tools/               ONLY what regenerates the published branch — publish-prototype.sh,
                     strip-comments.py, check-publish.py, test-gates.sh
.github/workflows/   publish-prototype.yml — rebuilds gh-pages on every push to main
brand/assets/imagery/terrain/  the ONE permitted raster family — see Rules
brand/favicon.svg    the browser-tab icon — the submark, with its own dark/light block
brand/logos/tis/     TIS SVGs, copied from the monorepo (read-only, do not edit)
brand/fonts/         7 self-hosted woff2 + fonts.css + the two OFL licences — see Typefaces

    LOCAL ONLY — present in the working tree, excluded by .gitignore, never pushed:
visual-reference/    every capture and crop, gathered here 2026-09-08
  iptech-screenshots/             raw platform captures, 2026-09-02 and 2026-09-04
  iptech-screenshots-identified/  the same, identified and cropped, with a README index
  iptech-semantic-search/         Innovue's semantic search surface, 2026-09-08, with a README index
  visual-inspiration/             reference screens the design language was derived from
  comparison-assets/              crops taken from those captures
design/previews/iptech-terrain-comparison.html   the side-by-side deck
design/previews/iptech-feature-request.html      the capability ask addressed to Innovue
brand/logos/innovue/ Innovue SVGs — a third party's marks, cited but not redistributed.
                     ONE exception is tracked and published: Innovue_Logo_Blue_eng_inline.svg,
                     which the product's attribution line renders. See Logos.
```

Add directories when work actually needs them, not in advance. When application code arrives it
goes in `app/`, and that decision gets recorded in `docs/brief.md` first.

*Three tracked previews, and `index.html` links all three.* **A fourth existed for one day and is
deleted.** `innovue-proposal.html` rendered Innovue's proposed architecture with its five conflicts
marked on screen, and it cleared the bar a fourth preview needs — somebody else's architecture,
addressed to the room deciding whether to adopt it. **That room adopted it** (`docs/platform.md`
§1a), so the prototype renders the architecture as Terrain's own and a second page rendering it as
a proposal is a view of a decision rather than of a question. *That is the general test for
retiring a preview, and it is worth having: a preview earns its place by being about a question
nothing else asks. When the question closes, so does the preview.*

*There is no `.nojekyll`, and the reason first recorded for one was wrong. It was committed and
removed on 2026-09-08. Markdown with no YAML front matter is a Jekyll **static file** — copied
byte-for-byte, never rendered — so Jekyll was never going to turn `docs/*.md` into site content.
Nothing here carries front matter and no path starts with `_` or `.`, so a Jekyll build and a raw
copy produce the same site.*

***That pass happened on 2026-09-11, and what it settled is not what it set out to.*** *Pages went
live from `main` / root first, and the static-file reasoning above was checked rather than trusted —
`index.html`, `README.md`, `docs/brief.md` and the prototype all hashed identical to the tree, so
Jekyll is provably a no-op here. Then the question changed: **the ask was a link that lands on the
prototype and exposes nothing else**, and Pages has no per-file access control. It serves whatever
tree it is pointed at. The only lever is to point it at a smaller tree.*

***So there are two branches now, and the split is the whole design.***

| | `main` | `gh-pages` |
| --- | --- | --- |
| holds | everything, unchanged | 14 files |
| is | authored | **generated — never edit it by hand** |
| is served | **no** | yes, at `talentintelligencestrategies.github.io/terrain/` |

`gh-pages` carries the prototype as `index.html`, the eleven assets it references, and **both OFL
licences** — this branch redistributes seven subset woff2 on a public host, which is precisely the
case OFL 1.1 covers. `docs/`, `case.md`, the product page and this file are no longer served at all.

**`index.html` at the root of `main` is now dead**, in the sense that nothing renders it — it is the
landing page that linked all three previews, and the published site is the prototype alone. It is
still the right front door if the full set is ever published again, so it stays.

***Two transforms separate the branches, and both are mechanical:*** `../../brand/` → `brand/`
because the prototype moves to the root, and **every comment stripped**. That second one was 51% of
the file by weight — dated design decisions, `§`-references into `platform.md`, and the competitive
read on IPtech's modules. **None of it is client data and all of it is ours**, but it is reasoning
written for this room, and a link sent outward carried it in view-source. `main` keeps every comment;
nothing is lost.

***Publishing is automatic, and the workflow is unchanged from what it always was:*** **edit, check
locally, push to `main`.** `.github/workflows/publish-prototype.yml` runs on every push to `main`,
rebuilds `gh-pages` and pushes it; Pages redeploys itself about a minute later. *It needs **write**
access only — admin was needed exactly twice, to enable Pages and to point it at this branch, and
both are done. No Pages setting is involved in a publish.*

*`tools/publish-prototype.sh` is the same thing runnable by hand, and `--build-only <dir>` assembles
the tree without publishing. **CI calls that flag rather than repeating the build**, so there is never
a second definition of what gets published — the tree the gates are tested against is the tree that
ships.*

***The manual step was the first design and it was wrong.*** *A generated branch plus "remember to run
the script" is a step that gets skipped exactly once and then the live site is quietly stale. If the
automation is ever removed, the branch must go back to being served directly rather than left
depending on someone's memory.*

***`tools/` is new, and it is a real weakening of "no build step" — say so rather than pretending
otherwise.*** *`index.html` still tells a visitor there is nothing to install, and for the previews
that stays true; but a generated branch cannot be generated by hand twice running and stay
byte-identical, and the comment strip in particular is not a thing anyone should do manually. The
guard is that the directory holds **only** what regenerates the published branch.*

***The gates are in Python, and why is the most useful thing in this section.*** *They were shell
first, and **three of them silently did not run** — `grep -P` does not exist on macOS, the `node`
syntax check never fired, and a `fail` inside a pipeline subshell could not stop the publish. **All
three reported clean.** That is the same failure as the taxonomy that survived a figure scrub and the
6 MB that a renamed folder slipped past: not a check that was wrong, a check that was never
consulted. `tools/test-gates.sh` now plants a violation for each of the twelve gates and proves it
refuses. **Add a gate, add its test** — a gate nobody has watched fail is not a gate.*

***The twelfth gate was added 2026-09-12 and it is the argument for the rule, not an illustration of
it.*** *A single stray `}` sat above `.lm{position:relative}` in the prototype and shipped. CSS does
not discard a top-level stray brace — it starts a qualified rule, takes `}` as the beginning of a
selector, and **swallows everything through the next `{...}`** — so the brace and the rule after it
were parsed as one bogus rule and both were dropped. **Exactly one rule, which is why nobody saw it:**
the declarations either side parsed normally, nothing appeared in the console, and the only symptom
was that the list's Sort and Filter menus opened 550px from their buttons. Gate 8 had been running
`node --check` over every script block since the gates were written; **nothing did the equivalent for
CSS**, and that is the whole of why it survived. The gate is a brace-depth scan, and running it
against the commit before the fix prints the line number.*

***So Jekyll still runs, on the smaller tree now,*** *and the two consequences stand: a build failure
fails the **whole** deploy, and any path added with a `_` prefix is dropped with no error.*
**`touch .nojekyll` is the entire fix, and the trigger is a `_`-prefixed path, not a broken page** —
the failure is silent by construction, so nothing will tell you. *On a 14-file generated tree neither
is likely; on `main` it no longer matters, because `main` is not served.*

## Rules

**Fewer, denser documents.** Add to an existing doc in `docs/` before creating a new file. There
are **five**, split on purpose:

*The rule governs `docs/`, and `README.md` at the root is not a sixth — it is the front door for a
visitor, and it holds no decision that is not already recorded in one of the five. If it and they
disagree, they win. `PLAN.md` and `KICKOFF-PROMPT.md` used to sit here as operational state; both
were deleted 2026-09-08 when the repo went public, being tooling rather than product.*
`brief.md` is what Terrain *is*, `platform.md` is what gets *built*,
`design-language.md` is how it *looks*, `case.md` is the argument sent *outward*, `marketing.md` is
what a *customer* is told. A folder full of near-duplicate markdown is how the definition phase
stops being legible.

Three were deliberate exceptions, and the bar each cleared is the point:

- `design-language.md`, 2026-08-31 — tokens, type scale and component specs are a different kind of
  content, and folding them into `platform.md` would have roughly doubled it.
- `case.md`, 2026-09-01 — the other three are **internal working documents that record decisions**;
  this one is **outbound**, addressed to TIS management and to Innovue. Different audience,
  different tone, different lifecycle. Putting an argument aimed at Innovue inside `brief.md` would
  stop that file being scannable as the answer to *what is Terrain*.
- `marketing.md`, 2026-09-08 — outbound too, but to a **different outward reader**: a prospective
  founder, who was in neither room. `case.md` argues a direction to the people funding and building
  it; this sells the product to the person using it. Different reader, and a different kind of
  content — conversion copy rather than an argument. Folding a hero headline into `case.md` would
  put marketing copy inside a document addressed to a vendor.

None of the three is a licence for a sixth. A new file needs a distinct **kind** of content and a
distinct **reader**, not just a distinct topic — and both `case.md` and `marketing.md` are *views*
of the other three, so when they and those three disagree, the three win.

**Deferred means deferred.** `docs/platform.md` §9 is marked `DEFERRED — NOT IN SCOPE`. Nothing in
it is built, specced further, wireframed, or designed against unless the session explicitly names
the item and asks for it. If a task appears to require a deferred item, stop and say so rather than
building it. Deferral here is a scope decision, not a backlog.

**`docs/` is the source of truth; everything rendered is a view of it.** Same discipline as the
parent monorepo: settle the decision in markdown, then build the preview. Never let a design
preview become the only record of a decision.

**One exception, and it is a real weakening rather than a clarification.** `design/previews/` holds
one outbound document, `terrain-the-case.html` — four sections and a prototype tab — and it is
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

***That removal was incomplete, and finding out how is the most useful thing in this section.***
*On 2026-09-09 the prototype was still carrying the client project's `Tech-Effx` **taxonomy** —
both axes, eight labels each, translated one-for-one into English and in the same order. The
2026-09-08 pass had replaced every **figure** and left every **label**. It was removed the same day
by rewriting the worked example as a drone-airframe landscape written from scratch.*

***The lesson generalises, so it is a rule and not an anecdote: a scrub that changes the numbers and
keeps the labels has not removed the landscape.*** *A taxonomy is the most valuable thing on the
screen — it is what the analyst was paid for — and it survives translation, reordering and having
its counts replaced. **Check the axis labels, the row names, the column headers and the category
lists, not just the digits.***

***It happened again, and the second instance is worse than the first.*** *Found 2026-09-10:
`docs/platform.md` §0 had been carrying a **different** client's six-branch taxonomy since it was
written — that client's own name as the first branch — through the 2026-09-08 figure scrub, through
the 2026-09-09 taxonomy sweep, and into the public repository. The 2026-09-09 pass fixed the
prototype and did not look at the prose.*

***Why prose is the harder case, and the rule that follows.*** *In the prototype a taxonomy sits in a
data array and looks like data. In a working document it sits inside a sentence, in parentheses,
reading as a **citation** — evidence for a claim rather than a payload. It is the same landscape.
**A client's category list is client data in prose exactly as much as in an array**, and the test for
whether it may stay is whether the surrounding argument would survive its deletion. Here the finding
was *six branches, two levels, every count zero, all of it in Chinese*, and not one of those depended
on a label.*

***And the check did not catch it, which is the most useful part.*** `README.md` *check 3 greps for
assignee names, and it only ever knew the two it had been told. A check built from leaks already
found cannot recognise the next one.* **When a capture of a real project enters a session — a
screenshot pasted into chat included — grep the tree for every proper noun on it before doing
anything else.** *That is what found this one; the check block reported clean throughout.*

Four things follow, and they are not stylistic:

- **Every figure in the prototype and in `docs/` is illustrative.** The distribution is
  representative and the arithmetic is internally consistent; no number is a real filing count. If
  you change one, say so where the document claims provenance, and keep the invariants — the matrix
  sums to the scope figure, the finding quotes the true maximum, the rivals total matches its own
  sentence. Nothing checks this for you — the build that used to is gone.
- **Never name a real holder as data.** Holder names render as skeleton bars by decision. Inventing
  one reads as a live example, and transliterating a real one is fabrication — both are worse than
  a bar.
- **A worked example is written from scratch, never derived from a client's.** Added 2026-09-09
  after the taxonomy above. The temptation is real, because a landscape modelled on one that exists
  has a plausible distribution for free — and that is exactly what makes the labels travel with it.
  **Pick a domain nobody has hired us about.** *One scoped exception is in force and it is the only
  one: `platform.md` §4a's five direction options are observed output from Innovue's own semantic
  surface, rendered as real words rather than bars. Observed is not invented, they are nobody's
  client data, and the argument and its limits are recorded in §4a.*
- **The screenshots and the deck stay local.** They render a client's data as pixels. Nothing in a
  published artifact may embed them. Before any push, run the four checks in `README.md`.

  **`.gitignore` is a hint; the raster rule is the mechanism.** `*.png` and friends are refused
  wholesale. That rule exists because the path-based one failed: the mood-board folder was renamed
  outside the repo on 2026-09-08, the ignore entry stopped matching, and `git add -A` staged 6 MB of
  it while the name-based check reported clean.

  **There is now exactly one exception, added 2026-09-08, and it is the only one.**
  `brand/assets/imagery/terrain/` holds three files — `terrain-forest.jpg` at 640×413 plus
  `terrain-forest-400.webp` and `terrain-forest-640.webp` — the gradient thumbnail Terrain's row
  needs in the TIS website's Products menu, in the same three-file shape as its siblings
  `licensing-warm-v2` and `signal-cool`. 48 KB total. The multi-megabyte PNG and 2560px variants
  were deliberately not copied.

  **Why it clears the rule:** the rule's premise was that every raster here is a capture of a third
  party's product or a mood board, and neither is ours to publish. These are *ours*, and they are
  marketing assets meant to be published. Neither reason applies. The sentence that used to say
  this repository "legitimately holds no raster images" is no longer true, and `README.md`'s check 1
  was amended in the same pass — a check that fails on a legitimate file is a check people learn to
  ignore, which is how the 6 MB got staged in the first place.

  ***The rule was tested on 2026-09-11 and it held.*** *A link sent to someone renders a preview
  card, and an `og:image` would have made it look like a product rather than a bare URL — but
  `og:image` must be a PNG or JPG, because scrapers will not render SVG. **So the card ships without
  an image**, and the prototype carries `og:` and `twitter:` text tags only. A nicer unfurl is not
  worth a fourth literal path; if one is ever wanted, it is a deliberate decision recorded here, not
  a file quietly added to the branch.*

  **It is still a weakening, so it is scoped to three literal paths, no glob.** A rename is still
  refused. A fourth file in that directory is still refused. Verify with
  `git check-ignore -v <path>`. **Adding a product means adding its three paths deliberately, one
  line each** — if that ever feels tedious enough to replace with a glob, that is the guard working.
  **Do not add any other raster to this repository**, and understand that each one you add removes a
  little more of the guard that catches the next rename.

**Do not invent brand law.** Terrain is a TIS product, but this folder is not the TIS brand system.
If a decision here changes something that belongs upstream — a token, a logo rule, a component,
the Innovue attribution phrasing — say so in the session and record it in `docs/brief.md`, then
leave it for a deliberate propagation pass. Never edit the monorepo from this folder.

**Colour carries information, or it is not there.** Superseded the monochrome-wireframe rule on
2026-08-31; the reasoning is in `docs/design-language.md` §2. Colour is permitted in exactly three
places: discrete states (live / expired, published / not yet published), direction of change on a delta
pill, and the three chart layers. No accent, no brand colour, no gradient, no decorative colour —
Terrain still has no accent decision, and a placeholder one becomes the thing everyone reviews
instead of the structure.

*This rule governs the **product interface**. The marketing page is a different surface with a
different system, and conflating them is the likeliest way to get this wrong.* The TIS website
gives every surface one accent (`--surface-accent-signal`, `--surface-accent-licensing`) and a
gradient thumbnail, both rationed; Terrain's slot there wants a green, and
`brand/assets/imagery/terrain/` is that gradient. **Green was named as the intended direction on
2026-09-08 and is still not a recorded decision**, so `design/previews/terrain-product-page.html`
ships hueless with the accent slot marked and empty. Two separate decisions, recorded separately in
`docs/brief.md` §4. A green marketing page is **not** licence to put green in the product. Primary actions are near-black fill. Everything else is the neutral ramp,
carrying meaning with hierarchy, weight and spacing.

*One scoped exception, 2026-09-08: **Innovue's mark, in Innovue's blue, on the attribution line** —
`Powered by` at the foot of the product's surfaces. It is a third party's mark reproduced as issued,
not a hue Terrain has chosen, which is the same argument that already permits their blue on the
outbound masthead. **Terrain still has no accent.** The test that keeps this from spreading: the blue
may only ever appear inside the Innovue mark itself. In a border, a chip, a chart or a button, it has
been misread. `docs/brief.md` §3 carries the reasoning.*

*And the rule now describes two palettes. Dark mode landed 2026-09-08 against `docs/design-language.md`
§10 — same rule, same three permitted places, 41 semantic tokens redefined and no component rule
touched. **No component may read a primitive (`--n-*`) or a raw hex**; two greps outside `:root` prove
it, and eleven violations had to be fixed before the pass could work. A component that reads a
primitive is a component that silently stays light.*

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

*Two recorded exceptions, both scoped, both in `docs/brief.md` §3.* **2026-09-07:** Innovue's mark
appears in the masthead of an outbound document, in their own brand blue — attribution on a document
addressed to them, not an accent entering Terrain's palette. **2026-09-08:** the product's own
attribution line renders their mark rather than the words alone, on the dashboard, the set, the
widget page and the conversation surface. The naming half of the rule is untouched — Innovue is still
not in the product name and not in the primary lockup, and the TIS submark is still the only mark in
the sidebar.

**That second one changed `.gitignore`, and the change is easy to get wrong.** A published page
cannot reference a file that is not published, so **two** of the eight Innovue SVGs are now tracked —
the tight-cropped `_eng_inline` variants in blue and in white, because the line is theme-aware and
renders their primary in light and their own white mark in dark. The other six stay out. The
rule reads `brand/logos/innovue/*` and not `brand/logos/innovue/`, because **git will not descend
into an excluded directory and a `!` negation under one silently does nothing** — the wrong form
fails exactly like the right one until you run `git check-ignore`.

**The favicon is the one new brand asset**, `brand/favicon.svg` — the submark's three polygons with
their own `prefers-color-scheme` block, because an external favicon cannot inherit `currentColor` the
way the inlined submark does. It is a new file, not an edit to `brand/logos/tis/`, which stays
read-only. **SVG, and it has to be**: the raster rule below refuses a `.ico` or a `.png`, and the
cost of that is Safari, whose SVG-favicon support is partial. Note it follows the *browser's* colour
scheme rather than Terrain's own theme control, and nothing can change that.

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
