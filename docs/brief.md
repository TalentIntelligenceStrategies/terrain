# TIS Terrain — Brief

> Source of truth for what Terrain is. Settled 2026-08-31 unless marked open.
> Add to this file before creating a new one.

## 1 · The product

**Terrain is patent search with strategic direction, for founders working out where their idea
sits.**

The user arrives with a concept. Whether they have filed, are mid-filing, or have no intention of
filing does not change the job — early-stage IP positions are all over the place, and Terrain
should not assume one. Terrain answers three questions:

1. **Who else is here?** The competitors already holding ground in this space.
2. **What is adjacent?** Similar and neighbouring technology they didn't know to look for.
3. **Where are the gaps?** What nobody has claimed — the whitespace, and what that implies about
   where to build.

Self-serve software, subscription-priced, English-native, searching the full Innovue patent
database. The third question is the one that makes it a product rather than a search box: search
tools return results, Terrain returns a direction.

**Terrain is software, not a report.** The user logs in and searches. Nothing is produced to order
by a human, nothing is delivered as a document. Never write copy that describes Terrain in report
language.

*This lock is unchanged, and one live discussion runs up against it.* On 2026-09-04 the question
**what does the founder actually walk away with?** was asked and found unanswered anywhere in these
documents. It is open, and the thinking is recorded at [platform.md](platform.md) §7a.8 — **a
discussion, not a proposal.** Two things are worth carrying here rather than leaving buried in it:

- **The test that keeps any answer honest is already written**, at `platform.md` §7a.4: *a title
  page, a download, or the word* report *is the line.* A page with a URL is software; selectable
  text is not a document; a PDF is.
- **A downloadable file was put to the decision on 2026-09-04 and declined**, in favour of a link
  plus copyable text. That closes the strongest threat to this paragraph. If a later session
  proposes a PDF, a slide or a cover page, **that is an amendment to this lock and must be argued as
  one.**

**Language:** English only. The parent TIS surfaces are bilingual; Terrain deliberately is not.
No Chinese copy, no bilingual markup, no CJK typeface. Decided 2026-08-31.

**ICP:** early-stage startups and their founders. Not IP departments, not attorneys, not analysts.
The user does not know patent vocabulary and should never need to learn it to get value.

**User and buyer are not the same, and only the user constrains the design.** Added 2026-09-01 while
writing [case.md](case.md). The market is **US** founders, and frequently someone else pays — the
university, accelerator, incubator or investor backing them. Institutions are a **channel**, not a
second ICP: they change how seats are sold, never who the interface is designed for. A university
tech transfer office is closer to the excluded category above than to the included one, so the lock
in the paragraph above holds unchanged — the person inside the product is a founder who does not
speak patent. Do not let an institutional buyer justify an analyst-facing feature.

## 2 · The name

**`TIS Terrain`** — the working name. Not locked. Everything in this folder is written as though it
holds, because the alternative is writing nothing, but it is a decision that can still move.

It is positioned as a TIS-endorsed sub-brand, not a standalone brand and not a descriptive label.

*Why Terrain.* It maps directly onto the job — competitors, adjacent technology, unclaimed ground.
It verbs naturally ("map the terrain", "your patent terrain"). It is ownable in a way that a
descriptive name is not. And the map register is an extensible namespace rather than a single word:
Bearing, Waypoint, Atlas, Contour are all available for later products or modules without a
rebrand.

*Why Terrain, second and stronger reason.* Discovered during the IPtech audit on 2026-08-31: the
engine's own analysis vocabulary is already territorial. Its technology-function matrix divides
results into 地雷區 (minefield), 新興區 (emerging ground) and 處女地帶 (virgin territory), and its
fourth analysis family is 技術脈絡 — technology lineage, literally a pathway. Terrain is therefore
not a metaphor imposed on the capability; it is the capability's native vocabulary rendered into
English a founder reads without instruction. Innovue built the map and described it in Chinese to
analysts. Terrain names it in English for the person standing on it.

*Why endorsed rather than standalone.* Equity compounds into TIS, the SABCD rating engine's
credibility transfers for free, and it is far cheaper to launch. Revisit only if Terrain is ever
meant to be financed or exited on its own.

*Why not "Plus".* A filler name like "IPtech Plus" was considered and rejected on three commercial
grounds, not taste: it permanently frames TIS as an upgrade SKU of someone else's system, so
pricing anchors to their list; "IP tech" is generic English and unownable as a trademark; and it
inherits IPTECH's identity as a Chinese-language enterprise system, which is precisely the
association an English-native founder-facing product needs to shed.

*Live risk.* "Terrain" is a real English word used by outdoor, mapping, and some B2B software
brands. The `TIS Terrain` lockup is defensible where bare "Terrain" likely is not — another reason
the endorsed architecture is right. **An actual USPTO / TIPO and domain clearance check is
outstanding and must happen before anyone designs a logo.**

## 3 · Innovue

Terrain is built on the capability behind Innovue's IPtech, and Innovue is a TIS shareholder and
the co-developer of the SABCD engine. The relationship is **attribution only**:

- "Powered by Innovue" as an attribution line.
- The patent database cited in body copy where it does credibility work.
- **Innovue never appears in the product name or the primary lockup.**

Reasons: a name-level dependency caps pricing against their list, blocks the trademark, and forces
a rebrand if the engine ever changes. The parent monorepo owns the approved attribution phrasing in
`visual-guide.md` — check it there before inventing wording.

**One recorded exception, 2026-09-07: Innovue's mark appears in the masthead of an outbound
document.** `design/previews/iptech-feature-request.html` — the one-page feature request sent *to*
Innovue — pairs the TIS submark with `Innovue_Logo_Blue_eng.svg` across a hairline divider, in
Innovue's own brand blue.

**This does not amend the rule above; it scopes it.** The attribution-only rule governs the
**product** — Terrain's name, its primary lockup, and any surface a founder sees. A document
*addressed to* Innovue, whose entire subject is which of their features we intend to build on, is
correspondence between two companies, and correspondence carries both marks. No founder sees this
page, and nothing in the product changed.

Two limits hold it there. The pairing is **only** valid on outbound documents to Innovue — a page
addressed to anyone else, and every product surface, keeps attribution-only. And Innovue's blue is
permitted **because it is their mark, not our accent**: `design-language.md` §2 governs colour that
carries information in a Terrain interface, and Terrain still has no accent decision. If a future
outbound document wants the pairing, reuse the masthead from that file rather than re-deciding it.

### What Innovue's IPtech actually is (competitive read, 2026-08-31)

From `innovue.ltd/products-iptech/`: IPtech is `專利布局分析系統` — a patent layout/portfolio
analysis system. It sits beside `WEBPAT 專利檢索資料庫` (a search database) in a rack of
management systems (專利 / 商標 / 合約 / 營業秘密) plus TIPS consulting. Chinese-only, no English
product marketing, and the product page itself is essentially one large image.

**Amended 2026-09-03, from inside the platform.** The paragraph above describes the *marketing
site*, and it stands. **The product is not Chinese-only** — there is an English UI, and TIS has an
account. What is incomplete is the English, not its absence: a Chinese column header sits in an
otherwise English table, applicant names render untranslated, and the vocabulary is non-idiomatic
throughout (*Citings*, *Overdue*, *Tech-Effx*). Evidence and screens are indexed in
`iptech-screenshots-identified/README.md` §2.2.

The platform's own structure, which replaces what we had inferred, is its top navigation:
**Search · Fishbone · View · Hierarchy · M-Map · T-Map · Report · Project.** `T-Map › Tech-Effx` is
the technology-function matrix; `Fishbone` is a top-level destination, which is §0's finding made
literal; `M-Map` is the analysis engine.

*Two corrections, 2026-09-04, both from walking the platform rather than reading about it.* The
engine is **60 entries across eleven dimension groups**, not the "11 × ~11" this sentence once
claimed — and `T-Map` adds eight more, so the menus walk to 128 entries but only **68 distinct
destinations**, because a shared entry renders identically under either map. Innovue's marketing says
"126 charts". And **`Hierarchy` is no longer uncatalogued**: it is the classification workbench where
an analyst builds the taxonomy and assigns patents to it by hand, which makes it the single clearest
statement of what Terrain automates. Both are recorded in [platform.md](platform.md) §8, which is now
the canonical mapping.

That is a Taiwanese enterprise IP toolchain: all-caps utility codes bolted to functional
descriptors, sold to in-house legal and IP departments who already speak the language. **It is a
tool.** Terrain is a decision product for founders who don't. Different buyer, different job,
different naming grammar — that gap is the differentiation, and it is why Terrain must not sound
like a tier of IPtech.

## 4 · Locked, open, and from scratch

**Locked**

- Innovue as attribution only, never in the name.
- The endorsed sub-brand architecture — the TIS mark appears in the lockup.
- Two typefaces: **Urbanist** (text and display), **Inconsolata** (numerals and figures).
- **English only** — no Chinese surface, no bilingual markup.
- The product definition and ICP in §1.
- **Colour carries information, or it is not there.** Decided 2026-08-31, superseding the
  monochrome-wireframe rule. Colour appears only on discrete states, delta pills, and the three
  chart layers — and it encodes direction, never desirability. There is still no accent, so primary
  actions are near-black. Full reasoning and the verified palette live in
  [design-language.md](design-language.md).

**Open — needs a decision**

- **The name.** `TIS Terrain` is the working name, used throughout as if settled. It is not.
  USPTO / TIPO and domain clearance is outstanding and gates any logo work.
- **The accent.** None chosen; primary actions are near-black in the meantime. Listed here because
  [design-language.md](design-language.md) §2, §3.1 and §11 all cite *this list* as the place the
  accent is held open, and until 2026-09-04 it was not actually on it. It is upstream-affecting —
  see §6.

  **It has a candidate, a candidate is not a decision, and the candidate was tried in production for
  one day.** `#C2F662`, sampled from `visual_inspo/Screenshot 2026-08-31 at 2.13.59 PM.png`, shipped
  2026-09-04 as `--mark-1`, the chart hue in `design-language.md` §3.7 — and **withdrawn 2026-09-05.
  There is now no hue anywhere in Terrain.** The marks are neutral ramp steps and a hatch; §2 of
  `design-language.md` carries the amendment. It was also darkened to `#9ACB2F` and reverted inside
  the shipped day — the drop bought contrast and cost the glow.

  **The withdrawal is the most useful thing this entry now records**, and it is a finding about *how*
  to trial an accent rather than about the colour. Shipping it as a chart mark looked like the safe,
  reversible way to see the hue in context. It was not: it went out in the one artifact addressed to
  Innovue and to TIS management, where **a reviewer does not distinguish a chart mark from an
  accent on sight** — so a candidate we were not committed to was about to be reviewed as the
  decision. `CLAUDE.md` predicts exactly this in its reason for holding the accent open: *a
  placeholder accent becomes the thing everyone reviews instead of the structure.* It also put the
  prototype in conflict with `case.md` §6.4, which tells that reader there is **no accent colour**.
  **Whenever the accent is decided, it gets decided deliberately and recorded here first — not
  trialled inside a deliverable.**

  The numbers below stand and are the evidence any future proposal argues from. Three things
  recommend it and one warns against it, all measured:

  - It clears every reserved status hue by a wide margin — **31.7° from `--state-live`**, 49.9° from
    pending, 97.1° from expired — so it cannot be read as *good* or *expired*.
  - Against near-black it measures **12.16:1**, which is what a filled primary button needs. The
    reference screen uses it as exactly that.
  - All three screens the aesthetic was sampled from are **one warm accent plus ink**. None uses a
    categorical palette. If Terrain's look is derived from them, an accent is the shape of the thing
    it is derived from.
  - Against it: at **1.26:1 on white** it cannot carry a thin mark, a hairline or text unaided. As a
    button fill that is fine; as a general-purpose accent it constrains every use to a dark partner.

  **Still deliberately not decided, and now with the evidence of having half-decided it once.**
  Adopting it would amend `CLAUDE.md`, this list, and `design-language.md` §2, §3.1 and §11
  together — *all four in one deliberate pass*, which is precisely what shipping it as a chart mark
  routed around. If a later session proposes it, that is the change to argue, the numbers above are
  the evidence to argue it from, and the paragraph above is the reason not to trial it by putting it
  on screen first.

**From scratch — no inherited constraint**

Layout, motion, component language, information architecture, illustration and imagery direction.
The monorepo's tokens and components are still not to be imported to fill the gap.

As of 2026-08-31 this is **no longer bare**: [design-language.md](design-language.md) holds a
verified neutral ramp, state colours, type scale, component specs and a dark-mode contract, derived
from the reference screens in `visual_inspo/`. It is Terrain's own system, not the monorepo's.

## 5 · What gets built

Product definition — the search flow, the saved object, the dashboard, the founder-facing subset of
IPtech's capability, and the questions outstanding with Innovue — lives in
[platform.md](platform.md). This file holds positioning and naming; that one holds the build.

Its §9 is marked **DEFERRED — NOT IN SCOPE** and is governed by a rule in `CLAUDE.md`. Deferral
there is a scope decision, not a backlog.

**What the founder walks away with** is §7a.8, opened 2026-09-04 — the first place in these
documents to *ask* that question. It is an **open discussion that decides nothing**: it records why
the question had no answer, four candidate shapes, and what would settle it. Nothing in it is to be
built or designed against.

The **outward-facing** argument lives in [case.md](case.md), written 2026-09-01 for TIS
management and Innovue. Since 2026-09-01 it is structured as **three deliveries**, stated in its
*What travels with this*:
the full IPtech capability inventory read from a US founder's position (§4); a design pass tracing
every element of the interface back to the capability behind it, and converting the interface into
six testable claims about the engine (§6); and the open implementation questions for Innovue
(§8.2 and §9). It is a view of this file, `platform.md` and `design-language.md`, not a source of
truth: if it and they disagree, they win.

**§9 became the canonical question list on 2026-09-04.** It had been three lists — §9 itself, the
comparison deck's closing panel, and a front-end set in the token README — which is three
records that could disagree in a document going to a vendor. It is now thirty-nine live questions in
eight groups, numbered 1–40 with one struck, mirrored number-for-number at `platform.md` §10, and the
other two are views of it. **§7a.8 also goes outward there**, under its own heading and outside the
numbering, labelled *a decision for TIS, not an implementation question for Innovue* — which is what
it is, and which is why it is unranked.

## 6 · Upstream

Decisions made here that belong in the TIS monorepo, for a deliberate propagation pass later:

- The Terrain name and the endorsed-sub-brand lockup → `brand/positioning.md`.
- **Terrain's neutral ramp and semantic-colour rule** → the two systems will need deliberate
  reconciliation if Terrain graduates into the monorepo. The rule in `design-language.md` §2 is
  narrower than the brand system allows and was written for a product with no accent, so it does
  not transfer automatically. `#252525` as ink and the `currentColor` submark treatment are already
  shared and should stay shared. See `design-language.md` §12.
- The Signal ↔ Terrain boundary → `brand/positioning.md`, and the pillar model needs to show two
  products under Patent Intelligence rather than one.
- Terrain's accent decision → `brand/visual-guide.md` (gradient↔pillar pairings).
- **Terrain's motion vocabulary** — the three easing curves and the standing prohibitions in
  `design-language.md` §6 — is a candidate for the monorepo. Nothing about it is Terrain-specific:
  it is a rule about which curve a gesture takes and a list of things that should never be animated.
  Recorded here only. Do not propagate from this folder; `CLAUDE.md` forbids editing the monorepo
  from here, and the curves should be reviewed against the brand system's own motion before they
  land anywhere.
- `Surfaces:` tags in `brand/components.md` may need to distinguish Signal from Terrain.
- Any Survey-tier rename → live copy in `website/`, plus `legal/terms.en.html`, four report-cover
  render HTMLs, and `DESIGN.md`.
