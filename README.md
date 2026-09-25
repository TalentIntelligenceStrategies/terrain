# TIS Terrain

**Patent search that returns an accurate set and hands it over cleanly, for founders working out
where their idea sits.**

You describe what you are building, Terrain returns the patents that are actually near it, you star
the ones that matter, and you take them out as a file. Self-serve software on a subscription,
searching the full Innovue patent database.

**Terrain does not analyse.** No map, no charts, no widgets, no generated summary. Founders do not
run somebody else's pre-built analysis — they take the data and work it in tools they already trust.
The gap worth solving sits upstream of analysis: patent search returns inaccurate, incomplete sets,
and an accurate one is the product.

Terrain is a TIS product in the Patent Intelligence pillar. This repository holds the product and
four documents describing it.

---

## The product

**[`app/`](app/) is the product, and it is the reference.** Where a document and `app/` disagree, the
code is what was decided.

**Run it:**

```bash
python3 -m http.server 8765      # from the repo root
# then open http://127.0.0.1:8765/app/
```

`file://` will never work — `<script type="module">` is CORS-fetched and a `file://` origin is
opaque. [`app/README.md`](app/README.md) is the handoff document and says so on its first line.

**`app/` is published to GitHub Pages**, running against the real patent corpus rather than the fake
engine. The site is `noindex` because this is a pre-release product shown to a named few, but that is
not the same as private: anyone with the URL can open it. `tools/publish-pages.py` builds it, and
`CLAUDE.md` under *What is published* says what goes up, what stays local, and why this corpus is
publishable when a differently assembled one would not be.

[`design/previews/terrain-prototype.html`](design/previews/terrain-prototype.html) is the frozen v1
prototype, and it is **not** what is published. It is kept because every partial in `app/` names it
as the file it was extracted from — provenance, not reference. Do not read it to find out what
Terrain is.

## Every figure here is illustrative

**No number in `demo/` or `docs/` is a real filing count.**
[`docs/platform.md`](docs/platform.md) §11 carries the one invariant a change has to keep, and
nothing checks it.

**No real patent holder is named in tracked files.** Identities render as grey skeleton bars by
decision: inventing one reads as a live example, and transliterating a real one is fabrication.
[`docs/design-language.md`](docs/design-language.md) §8 is the contract.

**`corpus/` is the deliberate exception and it is not tracked.** It holds real patents captured from
Google Patents, prints real assignee names, and exists to strain renderers written against
well-behaved demo shapes. It is excluded from `main` in its entirety, and it is **what `app/` loads by
default when it is present** — `?data=demo` forces the fake engine, and a clone without `corpus/`
gets it anyway. The cost is stated rather than hidden: **the export and the drawings are only
demonstrable with it**, because a spreadsheet of skeleton bars shows nothing and the demo ships no
patent figure.

**Four of its paths are published to `gh-pages`** — `engine.mjs`, `data.mjs`, `figures/`, `thumbs/` —
because the published site would show nothing without them. That rests on how the set was assembled,
not on the exclusion: ten seeds plus ninety followed from Google Patents' own `similar` links, so it
carries no taxonomy anybody was paid for. `corpus/raw/`, `corpus/patents/`, `FINDINGS.md` and the two
scrapers stay local.

## Layout

```
CLAUDE.md            how to work in this folder
README.md            this file

app/                 THE PRODUCT, and the reference. Needs a server
  README.md          the handoff document — how to run it is its first line
  index.html         the shell; styles/ the numbered stylesheets
demo/                fake data and the fake engine — deletable, imported once

docs/
  brief.md           what Terrain is — positioning, the name, Innovue, what is locked
  platform.md        what gets built — the PRD, written against app/
  design-language.md how it looks — tokens, type, space, motion, the skeleton contract

design/
  components.md      what the engine must return, per component
  previews/
    terrain-prototype.html    FROZEN v1 — kept for provenance, not maintained
    terrain-loading-lab.html  the loader bench

brand/               fonts, logos, the favicon, and one permitted image family
tools/               everything CI runs, and every one can refuse
.github/workflows/   gates.yml — runs the gates on every push to main
```

**Four documents, and that is the whole set.** A fifth needs a distinct *kind* of content and a
distinct *reader*, not just a distinct topic. `CLAUDE.md` carries the rule.

## Editing

**No build step.** No framework, no preprocessor, no bundler.

**The tokens have one author.** [`app/styles/tokens.css`](app/styles/tokens.css) is it; every other
copy is a region between sentinels written by `tools/sync-tokens.py --write` and verified byte for
byte by `--check`, which CI runs on every push. Edit the region in a page and the check reverts it —
edit `tokens.css` and run `--write`.

**The gates run locally in one command each:**

```bash
python3 tools/check-app.py            # tokens, theme, hover gates, the manifest, the demo seam
python3 tools/sync-tokens.py --check  # the generated token regions, byte for byte
bash   tools/test-gates.sh            # every gate above, watched refusing a planted violation
```

**Add a gate, add its test.** Three of these were shell once, three of them silently did not run,
and all three reported clean.

## Before pushing

Four things must hold. Each command prints offending files and nothing otherwise — note the
`grep -v README.md`, without which this file matches its own patterns and the check never passes.

**These four are not gates and cannot be.** `tools/` holds what CI runs and what can refuse; these
run against the *tracked set* and against a capture set that only a human has seen. Check 3 in
particular cannot recognise a name it has not been told.

```bash
# 1 · no raster images, except the one permitted family.
#     Every OTHER raster here would be a capture of a third party's product or a
#     mood board, and neither is ours to publish. The exception is
#     brand/assets/imagery/terrain/terrain-forest.{jpg,webp} -- three files,
#     48 KB, Terrain's own gradient thumbnail for the TIS website's Products
#     menu. Ours, and meant to be published, so neither reason applies.
#
#     The second grep is the whole exception. Anything it does not match is
#     still refused -- including a RENAME of those three files, which is the
#     failure mode that made this check necessary.
git ls-files | grep -iE '\.(png|jpe?g|gif|webp|bmp|tiff)$' \
  | grep -vE '^brand/assets/imagery/terrain/terrain-forest(-400|-640)?\.(jpg|webp)$'

# 2 · nothing local-only is tracked, by name as well.
#     TWO Innovue variants are tracked on purpose -- the ones the attribution
#     line renders, so it does not ship a broken image. The line is theme-aware:
#     their primary blue in light, their own white mark in dark. The second grep
#     is those two and nothing else, anchored at both ends, so the other six
#     still trip this check -- and so does a rename.
git ls-files | grep -Ei 'visual-reference|iptech-screenshots|comparison-assets|visual.inspo|visual.inspiration|logos/innovue|iptech-terrain-comparison|iptech-feature-request' \
  | grep -vE '^brand/logos/innovue/Innovue_Logo_(Blue|Light)_eng_inline\.svg$'

# 3 · no client or patent data in tracked files, and no account billing telemetry.
#
#     THIS LIST IS A RECORD OF LEAKS ALREADY FOUND, NEVER A DEFINITION OF WHAT A
#     LEAK LOOKS LIKE. It cannot recognise a name it has not been told. Every
#     entry here was caught by grepping for a proper noun seen in a capture --
#     not by running this block.
#
#     So: WHENEVER A CAPTURE OF A REAL PROJECT COMES INTO A SESSION, INCLUDING A
#     SCREENSHOT PASTED INTO CHAT, GREP THE TREE FOR EVERY PROPER NOUN ON IT
#     BEFORE DOING ANYTHING ELSE, and add what you find here.
#
#     A DERIVED FIGURE IS STILL TELEMETRY. A percentage of our own spend, or a
#     unit count divided out of it, is the same private number wearing
#     arithmetic. Innovue's per-module PRICE is their commercial terms and stays;
#     every balance it was read off does not.
#
#     THE COMMA IS REQUIRED. Dropping it to catch `4438` as well made the check
#     fire on a 4.5s animation delay in the loader, and a check that fires on
#     a legitimate line is a check people learn to skip.
git ls-files | grep -vE 'README\.md|^tools/test-gates\.sh$' | tr '\n' '\0' \
  | xargs -0 grep -lEi 'Tektronix|Nike|Qualcomm|ENANTA|MONOLITHIC|緯穎|富蘭登|光焱|聯享光電|Macroblock|4,50[0-9]|4,49[0-9]|4,438|4,368|10,004|5,566|2,184|78\.5'

# 4 · nothing tracked embeds an image as base64
git ls-files | grep -vE 'README\.md|^tools/test-gates\.sh$' | tr '\n' '\0' | xargs -0 grep -l 'data:image'
```

**Report what you checked, never that the tree is clean.** A sweep is only as wide as the capture set
that feeds it: *these nouns are absent* is a claim the evidence supports, *the tree is clean* is not,
and writing it down stops the next person looking.

**Two classes of hit are expected and are not leaks:** IPtech's own interface strings, which are a
vendor's published product and ordinary competitive ground, and published classification class
prefixes that the worked example legitimately shares — check the full symbol before calling it a
match.

## Typefaces

**Urbanist** for text and display, **Inconsolata** for every numeral. Self-hosted in `brand/fonts/`
as seven subset `woff2` plus `fonts.css`, linked by every page:

```html
<link rel="stylesheet" href="../../brand/fonts/fonts.css">
```

**Both OFL licences must stay with them.** These are subsets, which OFL permits, and OFL 1.1 requires
the notice travel with the Font Software wherever it is redistributed. This repository is public, so
that is not theoretical — the licences travel with the files whether or not anything is served.

**Terrain is English-only.** No CJK face, by decision.

## Attribution

Terrain is an **endorsed sub-brand**: the TIS mark appears in the lockup, Terrain is the product name.
**Innovue appears as attribution only** — *Powered by Innovue* at the foot of every surface, rendered
as their own mark in their own blue, and the database cited in body copy where it does credibility
work. Innovue never enters the product name or the primary lockup.
