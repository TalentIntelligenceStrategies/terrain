# TIS Terrain

Patent search with strategic direction, for founders working out where their idea sits. You arrive
with a concept — filed, mid-filing, or nowhere near it — and Terrain shows you who else is in the
space, which technology is adjacent to yours, and which part of it each of them holds.

Terrain is a self-serve product in the **TIS Patent Intelligence** pillar, searching the Innovue
patent database. It is **software, not a report**: you log in and search, and nothing is produced
to order.

This repository is the **design and definition phase** — positioning, product definition and the
design language, settled in writing before application code exists.

## The three pages

| | |
| --- | --- |
| [**The case**](design/previews/terrain-the-case.html) | Why this direction, who it is for, every IPtech capability rated from a founder's position, and the design pass. Its second tab runs the prototype in a frame. Written from [`docs/case.md`](docs/case.md), which stays the record of the argument. |
| [**The prototype**](design/previews/terrain-prototype.html) | The interface, running. **One working surface** — the patents the search found down the left, six views of them on the right, and any patent's record over those views — reached through a conversation, with a points page as the only destination. Thirty states, clickable end to end. |
| [**The product page**](design/previews/terrain-product-page.html) | The marketing page, in the TIS website's house style. A **scaffold**: product imagery is placeholder boxes, and it is built for later transplant into `~/Desktop/TIS/website/`. It ships **veiled** — open it and you get the Coming soon card, which is correct. Written from [`docs/marketing.md`](docs/marketing.md). |

*A fourth page rendered Innovue's proposed architecture with its five conflicts marked on screen.
**It was deleted on 2026-09-10, when the proposal was adopted** — the prototype now renders that
architecture as Terrain's own, so a second page rendering it as somebody else's proposal is a view
of a decision rather than of a question. [`docs/platform.md`](docs/platform.md) §1a is the adoption
record; `git log design/previews/innovue-proposal.html` has the marked-up version.*

All three are static HTML with no build step and no server. They link one stylesheet —
[`brand/fonts/fonts.css`](brand/fonts/fonts.css) — and the case document loads the prototype into a
frame, so the repository is the unit rather than any file alone. Clone it, or open any page over
`file://`, and they work.

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
index.html       the landing page — links the three pages below
design/
  previews/
    terrain-the-case.html   the case, four sections and a prototype tab
    terrain-prototype.html  the interface, running
    terrain-product-page.html  the marketing page — a scaffold, ships veiled
  components.md    per component, the data shape the engine must return
docs/            the source of truth — five documents, and they win over anything rendered
  brief.md         what Terrain is: positioning, naming, the Innovue relationship
  platform.md      what gets built, and §9 deferred scope
  design-language.md  how it looks: tokens, type, components
  case.md          the outbound argument, for TIS management and for Innovue
  marketing.md     outbound copy, for a founder — the product page and the voice chart
brand/
  favicon.svg      the browser-tab icon — the submark, dark/light aware
  fonts/           the two typefaces, their licences, and the stylesheet every page links
  logos/tis/       TIS marks
  assets/imagery/  the one permitted raster family — Terrain's nav gradient
CLAUDE.md        how to work in this repository
```

## Editing

`docs/` is the source of truth. A decision — what Terrain is, what gets built, how it looks, what we
are asking Innovue, what a customer is told — goes into one of the five documents there first.

The three HTML pages are **maintained directly**. `docs/case.md` remains the record of the argument
the case document makes, but editing it no longer regenerates the page; both have to be changed.

*A Python build generated the case document from `docs/case.md` until 2026-09-08. It was removed
with the packaging it existed for. It is still readable at `git show b96f61a:deliverables/build.py`
if the generated approach is ever wanted back.*

## Before pushing

Four things must hold. Each command prints offending files and nothing otherwise — note the
`grep -v README.md`, without which this file matches its own patterns and the check never passes.

**Two tool files carry the same exemption, added 2026-09-11, and it is the same reason rather than a
new one.** `tools/check-publish.py` and `tools/test-gates.sh` are checks 1–4 reimplemented as gates
on the published branch, so they contain the assignee names and the `data:image` literal as *their
own search patterns* — and without the exemption checks 3 and 4 match them on every single run. A
check that always fires is a check nobody reads, which is how the 6 MB in check 1 got staged.
**The exemption is two literal paths, anchored, no glob**, for the same reason the raster exception
is three literal paths: rename either file and it stops being exempt.

```bash
# 1 · no raster images, except the one permitted family. Still close to an
#     invariant rather than a list of names: every OTHER raster here would be a
#     capture of a third party's product or a mood board, and neither is ours
#     to publish.
#
#     The exception is brand/assets/imagery/terrain/terrain-forest.{jpg,webp} --
#     three files, 48 KB, Terrain's own gradient thumbnail for the TIS website's
#     Products menu, in the same shape as its siblings licensing-warm-v2 and
#     signal-cool. Ours, and meant to be published, so neither reason applies.
#     CLAUDE.md carries the full argument.
#
#     The second grep is the whole exception. Anything it does not match is
#     still refused -- including a RENAME of those three files, which is the
#     failure mode that made this check necessary.
git ls-files | grep -iE '\.(png|jpe?g|gif|webp|bmp|tiff)$' \
  | grep -vE '^brand/assets/imagery/terrain/terrain-forest(-400|-640)?\.(jpg|webp)$'

# 2 · nothing local-only is tracked, by name as well.
#
#     TWO Innovue variants are now tracked on purpose -- the ones the dashboard
#     renders, so the attribution does not ship a broken image. The line is
#     theme-aware: their primary blue in light, their own white mark in dark.
#     .gitignore carries the argument and names the six files it does not cover.
#     The second grep is those two exceptions and nothing else, anchored at both
#     ends, so the other six still trip this check -- and so does a rename.
git ls-files | grep -Ei 'visual-reference|iptech-screenshots|comparison-assets|visual.inspo|visual.inspiration|logos/innovue|iptech-terrain-comparison|iptech-feature-request' \
  | grep -vE '^brand/logos/innovue/Innovue_Logo_(Blue|Light)_eng_inline\.svg$'

# 3 · no client or patent data in tracked files, and no account billing telemetry
#
#     The balance patterns were 4,49x and 4,50x only, and that was too narrow:
#     on 2026-09-08 a pass reading the point-usage screen (`32`) put the
#     account's absolute spend into two tracked documents and this check
#     reported clean. The figures now covered are the balance, the top-up
#     total, the period spend and the largest module line -- and the general
#     shape of the mistake is worth naming, because the next one will not be
#     one of these literals: A DERIVED FIGURE IS STILL TELEMETRY. A percentage
#     of our own spend, or a unit count divided out of it, is the same private
#     number wearing arithmetic. Innovue's per-module PRICE is their
#     commercial terms and stays; every balance it was read off does not.
#
#     A FOURTH ASSIGNEE WAS ADDED ON 2026-09-11, and it arrived the way this
#     block says they do: a screenshot of Innovue's own result row was pasted
#     into a session to show what a populated patent row looks like, and it
#     carried a real Taiwanese holder, a real publication number and a real
#     title. The tree was grepped for every proper noun on it BEFORE anything
#     else was done -- all clean, nothing had leaked -- and the name is added
#     here anyway, because this list is a record of what has been seen and
#     not a definition of what a leak looks like.
#
#     A THIRD ASSIGNEE WAS ADDED ON 2026-09-10, and how it was found is the
#     point: this check passed while `docs/platform.md` carried that client's
#     six-branch TAXONOMY, their own name as the first branch. The check only
#     ever knew two assignee names, and it cannot know one it has not been
#     told. It was caught by grepping the repo for a name seen in a screenshot
#     -- not by running this block. So: WHENEVER A CAPTURE OF A REAL PROJECT
#     COMES INTO A SESSION, GREP THE TREE FOR EVERY PROPER NOUN ON IT BEFORE
#     DOING ANYTHING ELSE, and add what you find here. This check is a record
#     of leaks already found, never a definition of what a leak looks like.
#
#     THE COMMA IS REQUIRED, and that is deliberate. Dropping it to catch
#     `4438` as well made the check fire on `setInterval(cycle, 4500)` in the
#     prototype -- a 4.5s animation delay. A check that fires on a legitimate
#     line is a check people learn to skip, which is how the 6 MB in check 1
#     got staged. Every one of these figures is read off a UI that renders
#     thousands separators, so a leak arrives carrying its comma; the four
#     that leaked on 2026-09-08 all did.
git ls-files | grep -vE 'README\.md|^tools/(check-publish\.py|test-gates\.sh)$' | tr '\n' '\0' \
  | xargs -0 grep -lEi 'Tektronix|Nike|Qualcomm|ENANTA|MONOLITHIC|緯穎|富蘭登|光焱|聯享光電|Macroblock|4,50[0-9]|4,49[0-9]|4,438|4,368|10,004|5,566|2,184|78\.5'

# 4 · nothing tracked embeds an image as base64
git ls-files | grep -vE 'README\.md|^tools/(check-publish\.py|test-gates\.sh)$' | tr '\n' '\0' | xargs -0 grep -l 'data:image'
```

**Check 1 was amended on 2026-09-08 to admit that one family, and the amendment matters more than
the exception.** A check that fires on a legitimate file is a check people stop reading — which is
exactly how the 6 MB below got staged. Narrowing the check in the same pass that added the files
keeps it meaningful. Adding another permitted raster means extending that `grep -vE` deliberately,
and every extension buys a little less protection.

**Check 1 exists because check 2 failed.** On 2026-09-08 the mood-board folder was renamed from
`visual_inspo/` to `visual-inspiration/` outside the repository. `.gitignore` matched only the old
name, `git add -A` staged all 6 MB of it, and the name-based check looked for the old name too, so it
reported clean. Caught before the commit. A blocklist of paths protects you until something is
renamed; refusing rasters outright does not have that failure mode. **The 2026-09-08 exception
keeps that property on purpose** by naming three literal paths rather than a directory or a glob —
rename any of them and check 1 fires again.

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
