# Terrain — marketing copy

> The record for outbound copy addressed to a **prospective founder**. Settled 2026-09-08 unless
> marked open.

**Why this is a fifth document.** `CLAUDE.md` requires a new file in `docs/` to have a distinct
*kind* of content **and** a distinct *reader*, not merely a distinct topic. This has both. The
reader is someone deciding whether to use Terrain — not the internal record's reader, and not
`case.md`'s reader, who is TIS management and Innovue. The kind is conversion copy, not a decision
record and not an argument. It clears the same bar `case.md` cleared, on the same grounds.

**And like `case.md`, this is a *view*.** `brief.md`, `platform.md` and `design-language.md` win
wherever they and this file disagree. If a line of copy here contradicts one of them, the copy is
wrong. Nothing enforces that — so when copy on the page changes, it changes here in the same pass,
and if it touches what Terrain *is*, it changes in `brief.md` too.

The page this records is `design/previews/terrain-product-page.html`. It is a **scaffold** built to
be transplanted into `~/Desktop/TIS/website/` as `product/terrain/index.html`. Porting has not
happened.

---

## 1 · The core

Written with two installed skills, split by job: **`great-writer`** decided the sections and the
argument, **`ux-writing`** decided the strings inside every label and control. Both live in
`~/.claude/skills/`, outside this repository, because they are tooling rather than product.

The core statement:

> **Patent search assumes you already know what to search for. A founder does not — that is the
> thing they came to find out.**

**Rewritten 2026-09-10, and the sentence it replaces was good.** It read:

> *A founder searching patents cannot tell "nobody is here" from "I asked the wrong question."
> Both come back almost empty.*

It survived `great-writer`'s stress test and got sharper doing it. **It is a claim about absence**,
and `brief.md` §1 dropped the question absence answered. Three things went with it and they are
named because each was load-bearing:

- **The scaffold — *an index versus a map*.** An index finds things whose names you already know; a
  map shows you what lies between them. The page hung on that distinction.
- **The protected value carrier** — *a gap is an absence, and absences cannot be enumerated.*
- **The counterfeit line** — that a wrong query does not merely fail to show a gap, it **fabricates**
  one.

***What replaces them is a claim about the reader rather than about the tool, and that is the
change.*** The old argument said *the instrument is wrong*. The new one says *the instrument is
fine and it is not built for you* — which is the argument `case.md` §3 has made since 2026-09-01,
and which is now what `brief.md` §1 says the product is for. **Terrain is the same patent analysis
an IP professional runs, operable by the founder who has the question.**

The scaffold the page hangs on: **a tool you can use versus a tool you cannot.** One sentence in,
five plain questions, and you are looking at who holds what. No vocabulary, no analyst, nothing
authored in advance. Remove that and the page has no argument left, which is the test for a
load-bearing analogy rather than a decorative one.

The protected value carrier, never compressed: `case.md` §5.1 — **only the grid answers *where each
holder is*.** A list of results tells a founder who is in the space; it cannot tell them which part
of it each rival occupies, and that is the join no list can make.

### Three places the skills were overruled

Recorded because a later session will otherwise re-import them:

1. **Emoji.** `great-writer`'s marketing mode specifies "emoji + bold action" feature blocks.
   `CLAUDE.md` says no emoji. → Lucide icon, or nothing.
2. **Data anchors and social proof.** Its writing DNA demands memorable numbers repeated three
   times, and its proof section wants traction figures. Terrain has **no customers**, and every
   figure in this repository is illustrative by decision. → Anchors are *true* facts about
   mechanism instead: the eighteen-month publication lag, family-merging, six views. Where no true
   number exists the claim is **cut**, not softened into an adjective. **There is no proof section
   and no testimonial on the page.**
3. **Urgency.** Its marketing voice is "30°C, Persuader, with urgency". Terrain's house voice is
   flat and unhurried, and the website's `DESIGN.md` §13.3 bans hype-SaaS copy outright. → Keep the
   structure of the persuader mode, hold the house register.

---

## 2 · The voice chart

Three concepts, each with do/don't pairs. This outlives the page and governs product UI copy later.

### Honest about limits

**Characteristics:** plain, unhedged, specific about what it cannot do.

Terrain's most unusual selling point is that it refuses to answer questions it cannot answer. Say
so directly; never soften it into a caveat.

- **Do** — "Terrain shows you who is where. It cannot tell you why anyone is absent, and it does
  not pretend to."
- **Do** — "An ordering is not a verdict."
- **Don't** — "Terrain provides directional guidance to help inform your strategy."
- **Don't** — bury a limit in a footnote or a tooltip.

*The first Do read "Terrain shows you where nobody is. It cannot tell you why nobody is there"
until 2026-09-10. **It is the chart's best example and the first clause had to move anyway**: the
map's rows are holders, so "where nobody is" is not a thing it shows. The second clause is what
made it the best example, and it is unchanged. **Keeping an example whose first half the product
no longer does would have taught the voice on a false sentence.***

*And the second Do got more load-bearing on the same day, without changing.* Terrain now prints
the engine's relevance score on every row (§5). **An ordering is not a verdict** is the line that
keeps a number from acquiring an adjective.

### Second person, present tense

**Characteristics:** direct, concrete, scenario-led.

Features are things you can do, never things the product has.

- **Do** — "Come back next month and it opens straight away."
- **Do** — "Describe what you are building in a sentence."
- **Don't** — "Supports persistent project state across sessions."
- **Don't** — "Users are able to re-run their searches."

### No vocabulary the reader does not have

**Characteristics:** ordinary English, no term of art, no internal name.

The ICP does not know patent vocabulary and must never need to learn any to get value.

- **Do** — "the technical approaches to your problem" / "what those approaches are trying to
  achieve"
- **Don't** — *fishbone*, *node*, *taxonomy*, *classification*, *SABCD*, *corpus*, *the set*
- **Don't** — *boolean*, *prior art*, *claim chart*, *freedom to operate*
- **Don't** — **SaaS.** Terrain sells direction, not seats. The brand system's internal surface
  name is "Patent Intelligence SaaS" and it never surfaces publicly.

---

## 3 · The page

Nine sections. `great-writer`'s landing skeleton mapped onto the website's section grammar, built
only from material already settled in `docs/`. Weight is deliberately uneven: §3 carries the most,
because nothing else on the page earns the product.

**Veil.** The page ships behind `data-veil="coming-soon"` exactly as Licensing Platform does —
`main` inert, `robots noindex, follow`, the skip link retargeted, the hero heading demoted to `h2`
because the veil owns the `h1`. Terrain has one prototype and no application code; a live product
page for software nobody can open would be a promise with a date on it.

> **Coming soon** · **TIS Terrain**
> Terrain is still being built. Tell us what you are working on and we will get in touch when it
> opens.
> `Talk to us`

**1 · Hero.** Eyebrow is the Lucide `ratio` icon plus `TIS Terrain` — the lockup, never bare
"Terrain", because clearance is outstanding (`brief.md` §2).

> Search returns results.
> *Terrain returns a direction.*
>
> Describe what you are building in a sentence. Terrain shows you who else is in the space and what
> sits adjacent to it — laid out so you can see which part of it each of them holds.
>
> `See how it works` · `See what you get`

The headline is `brief.md` §1's surviving differentiator — *search tools return results, Terrain
returns a direction* — cut to the house pattern of two clauses. *The subhead's third clause was
"and where the ground is still open" until 2026-09-10 and is the dropped pillar; the replacement
is the join the map makes, which is what §5.1 says only the grid can do.* Both CTAs are
`[verb] [object]` and specific; `great-writer` blacklists "Learn more" and "Get started", and
`ux-writing` blacklists "Submit" and "Click here".

**2 · The two questions.** *A founder asks two questions.* / Terrain is built to answer them, in
that order. Then `Who else is here?` and `What is adjacent?` — the settled positioning used as the
feature spine, so the page cannot drift from `brief.md` §1. **The second card carries the limit
rather than hiding it**: the map shows who is where, and it cannot say why anyone is absent.

*It was three cards and three questions until 2026-09-10. **Two cards is a real layout problem and
the section is not to be padded back to three** — a third card added to balance a grid is the
failure `platform.md` §7a.1 names. Two full-width cards, or two on a wider measure, is the answer.*

**3 · The same analysis, and you can run it.** The differentiation section, and the heaviest. *An
IP analyst could tell you this. You cannot hire one for a question you have not asked yet.* On a
near-black panel, per `DESIGN.md` §11 — carry weight with a black card, never a colour wash.

Runs the legibility argument in three beats: **what the analysis is** (a grid of who holds which
approach, over the patents your sentence found), **what it normally costs** (someone who speaks
patent, building the classification before the first search), and **what Terrain changes** (one
sentence, five plain questions, and it is on screen). Then the map's own limit, in its own words:
*it shows who is where; it cannot say why anyone is absent.*

*This replaced "Why a list cannot show a gap" on 2026-09-10, which ran the absence argument and
then named the three density states — **Crowded**, **Rising**, **Open**. Those state names are
gone from the product (`platform.md` §6.1) and may not survive here as copy: the legend is a
density scale and a hatch, and a marketing page naming states the interface does not is the
clearest possible way to make the page wrong.*

**4 · How it works.** Four moments from `platform.md` §2: `Describe it`, `Answer five questions`,
`Confirm the reading`, `Read the map`. The gate is the selling point — nothing is searched until
the founder approves how their idea was read. *The fourth moment was `Approve what it found`; that
is not a step any more (`platform.md` §6a.2) and the list is one screen shorter than the flow used
to be.*

**5 · Everything over one search.** The map, Rivals, Filings over time, Where it is filed, Is it
still live, Lineage — each with its kind label and approved gloss, and **all of them on one screen
beside the patents they are drawn over**. The filings card carries the eighteen-month publication
lag, because `platform.md` §6.3 makes stating it mandatory rather than optional. *It was "Four
views over one search" until 2026-09-10.*

**6 · Built for a founder, not an analyst.** What is deliberately absent, from `case.md` §6.4 — no
boolean search box, no report to download, no chart picker, no verdict on any patent. Each with its
reason. Framed as fit, not as apology.

*This section carries more weight than it did, because §3 now makes the same argument positively.
Watch for the two saying the same thing twice: §3 is **what you can do**, §6 is **what is not in
the way**.*

*Amended 2026-09-09.* The fourth item was **no patent detail page**, and Terrain now has one:
`platform.md` §9's entry was un-deferred and §7a.3 closed for a record pane. **The claim it is
replaced with is the stronger one anyway** — *no verdict on any patent* is what a founder actually
wants reassurance about, and it is still true. Terrain shows the record as published and says whose
call it is.

**7 · Pricing.** *Self-serve, on a subscription. The tiers are not settled yet.* Three tier cards
built as **empty slots carrying no numbers at all**. `platform.md` §11 has pricing and whether a
free tier exists open, and `design-language.md` records what a placeholder *value* did to a review
last time: it became the thing everyone reviewed instead of the structure. The structure is
reviewable; the numbers are absent on purpose.

**8 · Powered by Innovue.** Attribution only, per `brief.md` §3: the line, plus the database cited
in body copy where it does credibility work. Innovue never enters the product name or the primary
lockup.

**9 · Contact.** The house block, pointing at `/#contact` on the homepage because a veiled page has
no contact section of its own (`DESIGN.md` §4).

---

## 4 · The Products nav

The shipping dropdown is a 560px panel, `grid-template-columns: 1fr 1fr`, two ~243px cards. **A
third card at that size needs an 836px panel.** So the panel splits into a **list and a preview**
instead: three icon-and-name rows on the leading side, and one product card on the trailing side
that follows whichever row is hovered or focused.

**The panel width does not change.** 200px list + 16px gap + 328px preview = 544, which is exactly
the 560px panel minus its 8px padding. And it gets *shorter*: **560 × 227** measured, against 504px
tall for a stacked-row version that was tried first — three names cost 132px, while only one
description is ever showing. A fourth product adds 44px to the list and nothing to the preview.

| | Shipping | Terrain pass |
| --- | --- | --- |
| Panel | `min(560px, 100vw - 32px)`, ~230px tall | **unchanged width**, 227px tall |
| Grid | `1fr 1fr` | `200px 328px`, 16px gap |
| Interactive | the two cards | the three `.pm-row` links |
| Media | 243 × 96px, one per card | 328 × 140px, one at a time |
| Name | 18px / 600 | **18px / 600, unchanged** |

**Row one is active at rest and hover moves it** — the Vercel/HubSpot pattern. The rule is just
"row one", so it never needs deciding again, and the menu never opens blank. Closing resets to row
one, so it cannot reopen showing whatever the pointer was last over. It does mean the menu opens on
Licensing Platform, which is Coming soon; that is a nav-order question, and nav order is site-wide
IA that outranks this page.

**The status chip lives only in the preview**, on the gradient, top-trailing. The list stays clean
icon + name, so two "Coming soon" chips are never visible at once in a three-row list.

### Four things that had to be got right

- **The description carries a `min-height` of three lines.** The three descriptions are 82, 100 and
  119 characters, which is 2, 3 and 3 lines at 328px — so without it the panel would resize as the
  pointer moved down the list. Pinned, every panel is the same height and the menu holds still:
  **verified at 227px across all three hover states.** Same device as the site's own
  `.offer-card-desc { min-height: 4.5em }`.
- **The preview is `aria-hidden`, and each row carries its description as `sr-only` text.** The
  preview is a picture of what the row already says, so exposing both would double every product to
  a screen reader. But `styles.css:2168` records that "Coming soon" is deliberately real text
  *inside the link*, so the accessible name reads "Licensing Platform Coming soon" — moving the chip
  into an aria-hidden preview would silently drop that. The `sr-only` text carries the description
  **and** the status, which puts it back. Measured accessible name: *"Licensing Platform. Patent
  insurance for exporters. Curated 30-patent bundles by country and industry. Coming soon."* Reuse
  `.sr-only` from `styles.css:4039`; do not author a second copy.
- **The swap fires on `focus` as well as `pointerenter`.** A keyboard user arrowing down the list
  sees the preview change too, which a `:hover`-only CSS rule could not do. On a coarse pointer
  neither fires: the default panel stays and a tap navigates, which is correct on touch.

  Verified end to end: `ArrowDown` on the trigger opens the panel and moves focus in,
  `ArrowDown`/`ArrowUp` cycle and the preview follows, `Escape` closes and returns focus to the
  trigger with the panel reset to row one. **Keyboard entry lands on Terrain's row, not row one**,
  because `site.js`'s existing logic focuses `aria-current` first if it is present — so on Terrain's
  own page the pointer default and the keyboard default differ. That is inherited behaviour and it
  is reasonable (a keyboard user arrives at the contextually relevant row), but it is a real
  difference and worth knowing before someone reports it as a bug.
- **The crop is anchored to the bottom.** The gradients run light at the top to dark at the base and
  the name is white, so the crop has to keep the base; plain `cover` keeps the centre. Measured on
  the shipped green asset over the region the name occupies, at 328×140:

  | Crop | Mean vs white | Lightest pixel |
  | --- | --- | --- |
  | `cover`, default centre | 9.15:1 | **3.30:1** — scrapes the 3:1 minimum |
  | `cover` + `object-position: 50% 100%` | 12.80:1 | **9.44:1** |

  At an earlier 72px media height the same measurement gave **1.69:1** and failed outright, which is
  how the problem was found. The margin is the point, and the numbers move fast with the box height,
  so **re-measure if it changes**. The site's treatment is deliberately scrim-free, so the contrast
  has to come from the image.

**Mobile** is a compact icon-and-name list — no image, no description — which now mirrors the
desktop leading list rather than diverging from it. Three image cards would have tripped `site.js`'s
`fitProductsDefault()` height measurement and collapsed the Products group by default on a 375×667
phone. Verified: the group does not overflow vertically at 667px, rows are 44px, and the chip stays
20px inside the drawer edge at its tightest — a 320px phone, where the drawer is 272px.

**`site.js` does need editing at port time**, and an earlier draft of this document wrongly said it
did not. Two changes, both small: its card array moves from `querySelectorAll('.product-card')` to
`'.pm-row'`, and the preview swap is new logic it has nothing equivalent to. Everything else — hover
intent at 120/200ms, click-to-open, arrow cycling, Escape, outside click, `scrollY > 64` — works
unchanged.

**Terrain's row copy** — 118 characters, against 85 and 100 for the other two:

> **TIS Terrain** · Patent search with strategic direction. See who else is in the space, what sits
> adjacent, and who holds which part.

***Rewritten 2026-09-10 — the third clause was `brief.md` §1's dropped question, and the length is
the constraint.*** **115 characters against the old 119**, so it stays inside the band the
`min-height` below was measured against — 2, 3 and 3 lines at 328px, with the panel pinned at
227px. *The first replacement drafted was "and which part of it each of them holds", at **130**,
which would have wrapped to a fourth line and moved a panel height that four other measurements
depend on. Shortening it was not a style edit.* `brief.md` §6 carries this as an upstream item:
the row has not shipped into `website/` yet, and nothing in this folder may edit the monorepo.

**Icon:** Lucide `ratio` — two overlapping rounded rectangles. Chosen 2026-09-08.

### Two things the nav pass surfaced that outrank this folder

- **`aria-current="page"` activates a dormant rule.** No page in `website/` sets it today
  (`grep -c aria-current` returns 0 everywhere), yet `styles.css:862` styles it and `site.js`
  handles it. `DESIGN.md`:661 says it "stays in markup for a11y only — the page H1/hero is the
  wayfinding signal, not a nav pill". The scaffold sets it on Terrain's row, because that is the
  correct accessibility markup. **Whether any visible treatment is wanted is a port-pass decision**,
  not one to settle from here.
- **Nav order.** Patent Intelligence is the only product that ships, and row one — the rest-state
  default — is a Coming soon product. Whether the live product should lead the menu is site-wide
  information architecture.

## 5 · What the copy may never say

- **No report language.** No *report*, *export*, *download*, *deliverable*, *PDF*. Terrain is
  software: you log in and search, and nothing is produced to order.
- **No deferred feature.** Nothing from `platform.md` §9 — no alerts or monitoring, no "watch this
  space", no standing filter ("US only", "live only"), no technology × application matrix, no IPC
  adjacency detection, no drawings, highlighting, decode or unread state.
  *Amended 2026-09-09 — two items came off this list, and only two.* §9 entry 1 was un-deferred, so
  the copy **may** now say Terrain shows a patent's record, including its claims as published.
  **What the copy still may never say is that Terrain reads one for you**: no highlighting, no
  plain-English decode, no *strong match*. That is §7a.3's line — Terrain renders
  the record, not an opinion about the record — and it is a sharper thing to hold copy to than the
  deferral was.
  *Amended again 2026-09-10 — the relevance score came off this list too.* Terrain prints the score
  the engine returns (`brief.md` §4), so **the copy may say results are ranked and may show the
  number**. What it may never do is put a word about quality beside it: no *strong match*, no
  *best fit*, no *most relevant*. **The number is the engine's ordering; the adjective would be
  ours.**
- **No named holder and no real filing count.** Every figure is illustrative. The page currently
  carries **no figures at all** except the eighteen-month lag, which is a fact about how patents
  publish rather than a count. *This bites harder than it did: §5's product imagery would now show
  a map whose row labels are company names, and a screenshot of one is a screenshot of a real
  landscape. The placeholders stay placeholders until that is solved.*
- **Never imply why a cell is empty, and never call one open.** The map's rows are holders, so an
  empty cell is *one company has not filed there* — not open ground. **The words *Crowded*,
  *Emerging* and *Open* are out of the product and out of the copy**, and `open` is the one that
  would slip back in, because it reads like plain English rather than like a state name.
- **No interface vocabulary.** *Fishbone*, *node*, *taxonomy*, *classification* appear nowhere.
- **Never bare "Terrain" as the mark.** The lockup is `TIS Terrain`.
- **No pricing claim**, no free-tier claim, no seat or sharing claim, and nothing a founder "walks
  away with".
- **No emoji, no `data-zh`, no accent colour.**

---

## 6 · Open

- **Section 2 is two cards where the grid was built for three**, and the layout is unresolved.
  Added 2026-09-10 with the dropped question. **Do not solve it by inventing a third card.**
- **Section 3 needs its copy written, not just its argument.** The section is re-founded and the
  beats are named, and the actual strings — the headline, the three beats, the limit line — are
  not written. It is the heaviest section on the page and the one most likely to be filled with
  something vaguer than what it replaced.
- **The accent.** **Green is the intended direction, stated 2026-09-08. It is not yet a recorded
  decision**, so the page ships hueless and the hero's `<em>` — the slot that carries the surface
  accent on every other product page — renders in ink. Filling it costs one line, and the page
  carries the instructions inline. `--surface-accent-terrain` / `-text` / `-wash` must be authored
  **upstream** in `brand/design-tokens.md` first; this folder may not edit the monorepo. See
  `brief.md` §4.
- **The Chinese product name.** The website's nav is bilingual and every product name carries
  `data-zh`. Terrain is English-only and has no Chinese name recorded. The scaffold ships **no
  `data-zh` at all**. This is an upstream brand decision and must not be invented — see
  `brief.md` §2.
- **Pricing and whether a free tier exists** (`platform.md` §11). Until then the tier cards hold no
  numbers.
- **The name itself** is not locked, and USPTO/TIPO plus domain clearance is outstanding
  (`brief.md` §2). It gates logo work, not copy.
- **Imagery direction.** Every product screenshot on the page is a dashed placeholder box.
  `brief.md` §4 lists imagery direction as from-scratch with nothing inherited, and none is decided.

---

## 7 · Porting, when it happens

Out of scope for the pass that built this. Recorded so it stays a merge rather than an excavation.

1. Asset paths go **root-relative** (`/assets/imagery/terrain/…`). Each one carries an inline
   `PORT:` note.
2. The page's `style` block **does not survive**. It is split in two on purpose: a mirrored token
   section that is deleted, and one NEW-CSS section written as if it already lived in
   `assets/styles.css`, which is cut and pasted into it. Do not blend them. `website/` bans
   page-local styles, and media queries must stay interleaved with the rules they override —
   `scripts/check-cascade-order.mjs` fails otherwise.
3. The inline script is deleted. `site.js:414–551` already does all of it.
4. The three imagery files move to `/assets/imagery/terrain/`; run `npm run images` and point
   `srcset` at what it emits. The originals here are already at the widths it produces.
5. The nav rows and the compact mobile rows go into **all nine** HTML files, which are byte-identical
   today apart from one CTA href — keep them that way. Also: the footer Products column in all nine,
   the search modal's jump list, `PAGES` in `scripts/build-search-index.mjs`, `sitemap.xml`, and the
   structure table in `website/CLAUDE.md`.
6. Bump `styles.css?v=` and `site.js?v=`, run `npm run verify`, and add one `CHANGELOG.md` line with
   a Taipei timestamp.
7. A Chinese name is required before the nav rows can ship, because every sibling row has one.
