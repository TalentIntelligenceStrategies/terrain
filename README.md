# TIS Terrain

**Patent search with strategic direction, for founders working out where their idea sits.**

You arrive with a concept — filed, mid-filing, or nowhere near it — and Terrain shows you who else is
in the space, which technology is adjacent to yours, and which part of it each of them holds.
Self-serve software on a subscription, searching the full Innovue patent database.

Terrain is a TIS product in the Patent Intelligence pillar. This repository holds the definition,
one working prototype, and [`app/`](app/) — the frontend being extracted from that prototype so the
interface can be built on rather than read.

---

## The prototype

| | |
| --- | --- |
| [**The prototype**](design/previews/terrain-prototype.html) | The whole product as an interactive HTML page — the conversation, the gate, the build, the working surface with its twelve views, the patent record, and four account destinations. Nothing to install: open the file. |
| [**The loading lab**](design/previews/terrain-loading-lab.html) | A bench for the loader and the waiting states, kept beside the prototype rather than inside it. |

**The prototype is published** at
[`talentintelligencestrategies.github.io/terrain/`](https://talentintelligencestrategies.github.io/terrain/)
from the generated `gh-pages` branch — the prototype alone, with its eleven assets and both font
licences. Nothing else in this repository is served.

**It is the reference.** The documents below describe what the prototype is. Where a document and the
prototype disagree, the prototype is what was decided.

## Every figure here is illustrative

**No number in this repository is a real filing count.** The distribution is representative and the
arithmetic is internally consistent — the matrix sums to the scope figure, the finding quotes the
true maximum, the rivals total matches its own sentence — but nothing is observed data.
[`docs/platform.md`](docs/platform.md) §13 lists the invariants a change has to keep.

**No real patent holder is ever named.** Identities render as grey skeleton bars by decision:
inventing one reads as a live example, and transliterating a real one is fabrication.
[`docs/design-language.md`](docs/design-language.md) §8 is the contract.

## Layout

```
CLAUDE.md            how to work in this folder
README.md            this file

docs/
  brief.md           what Terrain is — positioning, the name, Innovue, what is locked
  platform.md        what gets built — the PRD, reverse-written from the prototype
  design-language.md how it looks — tokens, type, space, motion, the skeleton contract

design/
  components.md      what the engine must return, per component
  previews/
    terrain-prototype.html    the product
    terrain-loading-lab.html  the loader bench

brand/               fonts, logos, the favicon, and one permitted image family
tools/               only what regenerates the published branch
.github/workflows/   publish-prototype.yml — rebuilds gh-pages on every push to main
```

**Four documents, and that is the whole set.** A fifth needs a distinct *kind* of content and a
distinct *reader*, not just a distinct topic. `CLAUDE.md` carries the rule.

## Editing

**No build step.** The prototype inlines its own tokens and links the shared font stylesheet. Edit
the file, open it in a browser, look at it.

**Publishing is automatic.** Push to `main`; the workflow rebuilds `gh-pages` and Pages redeploys
about a minute later. `tools/publish-prototype.sh` is the same thing runnable by hand, and
`--build-only <dir>` assembles the tree without publishing.

**Never edit `gh-pages` by hand.** It is generated.

## Before pushing

Four things must hold. Each command prints offending files and nothing otherwise — note the
`grep -v README.md`, without which this file matches its own patterns and the check never passes.
`tools/check-publish.py` and `tools/test-gates.sh` carry the same exemption, because they are these
checks reimplemented as gates and contain the patterns as their own search strings.

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
#     fire on a 4.5s animation delay in the prototype, and a check that fires on
#     a legitimate line is a check people learn to skip.
git ls-files | grep -vE 'README\.md|^tools/(check-publish\.py|test-gates\.sh)$' | tr '\n' '\0' \
  | xargs -0 grep -lEi 'Tektronix|Nike|Qualcomm|ENANTA|MONOLITHIC|緯穎|富蘭登|光焱|聯享光電|Macroblock|4,50[0-9]|4,49[0-9]|4,438|4,368|10,004|5,566|2,184|78\.5'

# 4 · nothing tracked embeds an image as base64
git ls-files | grep -vE 'README\.md|^tools/(check-publish\.py|test-gates\.sh)$' | tr '\n' '\0' | xargs -0 grep -l 'data:image'
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
the notice travel with the Font Software wherever it is redistributed. This repository is public and
the published branch serves the fonts, so that is not theoretical.

**Terrain is English-only.** No CJK face, by decision.

## Attribution

Terrain is an **endorsed sub-brand**: the TIS mark appears in the lockup, Terrain is the product name.
**Innovue appears as attribution only** — *Powered by Innovue* at the foot of every surface, rendered
as their own mark in their own blue, and the database cited in body copy where it does credibility
work. Innovue never enters the product name or the primary lockup.
