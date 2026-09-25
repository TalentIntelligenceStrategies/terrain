# TIS Terrain — Brief

> **Source of truth for what Terrain is.** What gets built is [`platform.md`](platform.md); how it
> looks is [`design-language.md`](design-language.md); what the engine must return is
> [`../design/components.md`](../design/components.md).

---

## 1 · The product

**Terrain is patent search that returns an accurate set and hands it over cleanly, for founders
working out where their idea sits.**

The user arrives with a concept. Whether they have filed, are mid-filing, or have no intention of
filing does not change the job — early-stage IP positions are all over the place, and Terrain does
not assume one. They describe what they are building, Terrain returns the patents that are actually
near it, and they take the ones that matter with them.

**One question, and the whole product answers it:** *what is already here that is close to this?*

Self-serve software, subscription-priced, English-native, searching the full Innovue patent database.

### The flow, and there is only one

**Search → find similar → star → the starred set → export.** Every surface serves a step of it, and a
surface that serves none does not belong in the product.

1. **Search.** One sentence, one call. Nothing is asked before it runs.
2. **Find similar.** Star a patent and the set re-orders by nearness to it. No patent enters or
   leaves — only the sequence changes, and it can be put back.
3. **Star.** The founder's own shortlist, and the only thing in the product they curate by hand.
4. **The starred set.** Its own surface, where the shortlist is read as a whole.
5. **Export.** It leaves as a CSV or a Markdown list, and the product is over.

### Terrain does not analyse, and that is the position

**Founders do not run somebody else's pre-built analysis.** They take the data and work it in tools
they already trust, because they know how the answer came out — and a chart they did not build,
sitting inside software they are still deciding whether to pay for, is a claim they have no way to
check. Terrain stopped competing on the analysis and moved upstream of it.

**The gap worth solving is retrieval.** Patent search returns inaccurate, incomplete sets: the right
patent is missing, or it is on page nine behind forty that are not close at all. A founder cannot
tell which, because they cannot see what was left out. An accurate set, and a clean way to take it
out, is the product.

**That is a claim about retrieval, not about presentation** — so anything that reads the set and
tells the founder what it *means* is out, however small. No map, no charts, no widgets, no generated
summary, no finding sentence, no verdict. Terrain prints what the engine returned and what the patent
says.

**The engine's own relevance score is printed, and that is the line rather than an exception to it.**
The question is not *is it an opinion* but *is it ours*. Terrain refuses to **generate** a verdict; it
does not **hide** one the engine already produced. No ranking language may read as a verdict —
*ranked by relevance* is an ordering; *strong match*, *best fit* and *most relevant* are readings,
whatever number sits beside them.

**Printed is not the same as always on screen.** An engine that returns no score leaves the row with
none, and Terrain does not compute one to fill the gap — which is this rule read from the other end
rather than an exception to it. [`platform.md`](platform.md) §4.3 carries what the interface does
about it.

### What makes it a product rather than a search box

**Legibility and self-serve.** The same set an IP professional would assemble, operable by the person
who actually has the question — and handed over in a form they can work in.

A founder cannot run IPtech: it wants a taxonomy authored before the first search is typed, it is
built in the vocabulary of the profession, and it assumes an analyst on the other side of it. Terrain
is one sentence and a set — no analyst, no definitions table, and no term of art anywhere on the
surface.

**This is a durable claim in a way a feature claim is not.** *We draw X* is beaten the day somebody
else draws X. *A founder can operate this and cannot operate that* is a claim about who can use the
thing, and it does not fall to a feature.

**And there is a second one underneath it, which is the harder claim to beat:** the incumbent's only
way out is one patent at a time, into another of its own products. A set the founder can leave with
is not a feature the incumbent has declined to build — it is one that cuts against why they built the
rest.

### What Terrain may not say about a set

**A search that returns nothing has found nothing, which is not the same as there being nothing.**
The engine searched an index, over a vocabulary, at a moment. Copy may describe **what came back**
and may not describe **what exists**:

- Sayable: *Nothing in the Innovue database came back close to this.* *Forty-one patents matched, and
  these eight are nearest to the one you starred.* *This holder's most recent filing here is 2019.*
- Not sayable: *Here is the gap.* *Open ground.* *Whitespace.* *Nobody is here.* *This is unclaimed.*

**The test:** a sentence is admissible if it would still be true when the whole rest of the world's
patent estate is added to the index. A statement about *this result set* survives that. A statement
about *this technology being unclaimed* does not.

*The rule is easy to think unnecessary, because nobody would write "nobody is here" on purpose. The
failure is quieter than that: an empty result list, rendered plainly and captioned honestly, still
reads as open ground to a founder who does not know what an index is. Saying what was searched is
what keeps the absence a fact about the search.*

### Software, not a report

The user logs in and searches. Nothing is produced to order by a human, nothing is delivered as a
document. **Never write copy that describes Terrain in report language.**

The test that keeps this honest: *a title page, an authored narrative, or the word* report *is the
line.* A page with a URL is software; selectable text is not a document; a PDF with a cover is.

**A download is not the line, because it never separated the two.** The founder may take the patents
they starred out as a CSV or a Markdown list: that file is the rows already on their screen, in a
format they can work in, and it is their data leaving rather than our document arriving. The line is
what the file is permitted to *say*. It carries no cover page, no summary written for them and no
conclusion — the moment it states something the interface did not, Terrain has produced a report. A
proposal for a PDF, a slide or a written-up handoff is an amendment to this lock and must be argued
as one.

### Who it is for

**Early-stage startups and their founders.** Not IP departments, not attorneys, not analysts. The
user does not know patent vocabulary and should never need to learn it to get value.

**User and buyer are not the same, and only the user constrains the design.** The market is **US**
founders, and frequently someone else pays — the university, accelerator, incubator or investor
backing them. Institutions are a **channel**, not a second ICP: they change how seats are sold, never
who the interface is designed for. Do not let an institutional buyer justify an analyst-facing
feature.

**Language: English only.** The parent TIS surfaces are bilingual; Terrain deliberately is not. No
Chinese copy, no bilingual markup, no CJK typeface.

---

## 2 · The name

**`TIS Terrain`** — the working name. **Not locked.** Everything in this folder is written as though
it holds, because the alternative is writing nothing, but it is a decision that can still move.

It is positioned as a **TIS-endorsed sub-brand** — not a standalone brand and not a descriptive
label.

**Why Terrain.** Three reasons, none of which depends on the product drawing a map:

1. **It names the founder's question, not our output.** *Where does my idea sit, and what is around
   it* — §1's one question is spatial, and it stays spatial whether the answer arrives as a grid or
   as a ranked list. The name survived the product changing shape underneath it, which is the test a
   name is supposed to pass.
2. **The engine's own vocabulary is already territorial.** Its lineage family is **技術脈絡** — a
   *pathway*; its competitive family is **競合分析**, contending over the same ground; and the system
   it sits in is **專利布局分析系統**, a patent *layout* analysis system, layout in the sense of how
   ground is laid out and held. Terrain is the capability's native vocabulary rendered into English a
   founder reads without instruction.
3. **The register extends.** Bearing, Waypoint, Atlas, Contour are available for later products or
   modules without a rebrand.

**Why endorsed rather than standalone.** Equity compounds into TIS, the SABCD rating engine's
credibility transfers for free, and it is far cheaper to launch. Revisit only if Terrain is ever meant
to be financed or exited on its own.

**Why not "Plus".** A filler name like *IPtech Plus* was rejected on three commercial grounds, not
taste: it permanently frames TIS as an upgrade SKU of someone else's system, so pricing anchors to
their list; *IP tech* is generic English and unownable as a trademark; and it inherits IPtech's
identity as a Chinese-language enterprise system, which is precisely the association an
English-native founder-facing product needs to shed.

**Live risk.** *Terrain* is a real English word used by outdoor, mapping and some B2B software brands.
The `TIS Terrain` lockup is defensible where bare *Terrain* likely is not — another reason the
endorsed architecture is right. **A USPTO / TIPO and domain clearance check is outstanding and must
happen before anyone designs a logo.**

---

## 3 · Innovue

Terrain is built on the capability behind Innovue's IPtech. Innovue is a TIS shareholder and the
co-developer of the SABCD engine. The relationship is **attribution only**:

- *Powered by Innovue* as an attribution line, at the foot of every surface.
- The patent database cited in body copy where it does credibility work.
- **Innovue never appears in the product name or the primary lockup.**

The commercial reasons: a name-level dependency caps pricing against their list, blocks the
trademark, and forces a rebrand if the engine ever changes. None of them attaches to a credit line at
the foot of a page.

### The mark, and the one colour that is not ours

The attribution line renders **Innovue's mark in Innovue's blue**, not the words alone. It is
theme-aware — their primary blue in light, their own white mark in dark — and **both files are
theirs**, with identical `viewBox`, so the swap is pixel-stable. The alternative would have been a
Terrain-authored light variant of someone else's brand, which is the thing this section exists to
prevent.

**The blue is admissible because it is a third party's mark reproduced as issued, not a hue Terrain
has chosen.** The test that keeps it from spreading: **the blue may only ever appear inside the
Innovue mark itself.** In a border, a chip, a chart or a button, it has been misread.

Two of Innovue's eight SVGs are tracked and published — the tight-cropped `_eng_inline` variants in
blue and in white, because a published page cannot reference a file that is not published. The other
six are not redistributed.

### What IPtech is

`專利布局分析系統` — a patent layout analysis system, sold beside `WEBPAT`, a search database, in a
rack of management systems plus consulting. Its marketing site is Chinese-only; **the product is
not** — there is an English UI, and TIS has an account. What is incomplete is the English, not its
absence: a Chinese column header sits in an otherwise English table, applicant names render
untranslated, and the vocabulary is non-idiomatic throughout.

It is built for an analyst and it is good at what it does. Terrain is not a tier of it and not a
translation of it. [`platform.md`](platform.md) §11 records what is adopted and what is cut.

---

## 4 · Locked

- **Innovue as attribution only**, never in the name or the primary lockup.
- **The endorsed sub-brand architecture** — the TIS mark appears in the lockup.
- **Two typefaces**: Urbanist (text and display), Inconsolata (numerals and figures).
- **English only** — no Chinese surface, no bilingual markup.
- **The product definition and ICP** in §1, including what may and may not be said about a set.
- **Terrain does not analyse.** No map, no charts, no widgets, no generated summary, no finding
  sentence. Anything that reads the result set and tells the founder what it *means* is out. This is
  the decision the whole product turned on and it is the one most likely to be reopened by accident,
  because every individual chart looks small.
- **Software, not a report.**
- **Terrain renders the record, not an opinion about the record.** A patent's identifiers, abstract
  and claims are the public text of a granted patent and Terrain shows them; every *reading* of that
  text stays out — no plain-English decode, no match highlighting, no *strong match*.

  The engine's own relevance score is printed, and that is a real narrowing of this rule rather than
  an exception to it: the line moved from *is it an opinion* to *is it ours*. What is still refused is
  Terrain **generating** a verdict; what is admitted is Terrain **not hiding** one the engine already
  produced. **No ranking language may read as a verdict** — *ranked by relevance* is an ordering;
  *strong match*, *best fit* and *most relevant* are readings, whatever number sits beside them.
- **One working screen, two columns, and each column means one thing.** The result list has the left
  and keeps it; the patent record has the right. The grouping is a popover anchored to its control,
  and an enlarged drawing is a lightbox over the viewport. *This is a narrowed successor, not a
  reversal*: the rule used to read that the list and the record shared the left column and the right
  carried whatever else was open, which made one region mean three kinds of thing by state. What
  survives is the part that was doing the work — two columns, no sidebar, and nothing floating that
  does not have to. A top masthead, not a sidebar.
- **The search runs on submit.** No narrowing questions, no criteria to approve, no build stream. The
  commitment is pressing Search, and the points are charged there.
- **Starring is the one thing the founder curates by hand**, and it is per-row. *This is a narrowed
  successor, not a reversal*: the old rule banned per-row selection because checkboxes redrew a
  chart and the set feeding the charts had to stay whole. There are no charts, and the starred set
  feeds nothing but itself and the export.
- **Application code goes in `app/`, and it is framework-agnostic** — plain CSS files, semantic HTML
  partials, vanilla ES modules. No framework, no preprocessor, no bundler. The team receiving this
  writes CSS, and a custom property is the one interchange format every stack consumes; a
  preprocessor variable also resolves at build time, which the theme swap cannot survive. `app/` is
  the reference implementation and [`app/README.md`](../app/README.md) is what an engineer reads
  first.
- **`app/` publishes to GitHub Pages, against the real corpus.** The question that held it back was
  what a stranger sees when the fake engine answers — bars where every holder should be, and no
  drawing at all. They do not see it: the published site carries `corpus/`, so the link shows real
  titles, real assignees and 2,247 real plates, with `demo/` along only as the fallback the seam
  requires. The site is `noindex`, which is not the same as private: **anyone with the URL can open
  it.** `CLAUDE.md` under *What is published* carries the argument, including why this corpus is
  publishable and why the next one might not be.
- **`corpus/` is the stress-test set and it prints real holder names.** A hundred patents captured
  from Google Patents, sitting beside `demo/` with the same two-file shape, and **it is what loads by
  default when it is present** — `?data=demo` is the flag now, and it goes the other way. The whole
  directory is excluded from `main`, which is what keeps the demo rule meaningful: no real assignee
  or inventor name enters a file tracked there. **Its four runtime paths are published to
  `gh-pages`**, because the site would show nothing without them — a separate decision resting on how
  the set was assembled rather than on the exclusion it breaks.

  **Real names are printed, and that does not reopen §1.** The rule §1 carries governs what copy may
  claim about a *set* — that nothing came back is not that nothing exists. Naming a holder who did
  file is the opposite kind of claim and has always been admissible; what `CLAUDE.md` refuses is
  *inventing* one or *transliterating* one into illustrative data, and an observed assignee is
  neither. The demo keeps its bars, because its rows are fictional and a fictional name reads as a
  live example.

  **The cost is stated rather than hidden: the export and the drawings are only demonstrable against
  the corpus.** A spreadsheet of skeleton bars shows nothing and the demo ships no patent figure at
  all, so anyone receiving this handoff without `corpus/` cannot see the product's own ending work. That is the price of never tracking a real name, it was
  paid deliberately, and [`app/README.md`](../app/README.md) says so where an engineer will read it.

  **What the corpus is for is finding what the demo cannot ask.** `demo/` is well-behaved by
  construction — one 46-character holder, three classification codes, nine short claims — so every
  renderer was written against shapes that never strain. The corpus supplies the strain, and the
  findings belong in this repository rather than in it.

---

## 5 · The accent

**Terrain's accent is green**, decided 2026-09-15. It is the hue Terrain's row carries in the TIS
website's Products menu, and `brand/assets/imagery/terrain/` is the gradient thumbnail that already
uses it.

**Where it may appear:**

- The **primary action** — one filled button per surface, and never two.
- The **focus ring**.
- The **selected** state of a segmented control or a menu item.

**Where it may not:**

- **In data.** Not a status chip, not a score, not a relevance rank, not a bar. The permitted colour
  cases in [`design-language.md`](design-language.md) §2 — discrete states and direction of change —
  are unchanged and the accent is not one of them.
- **As decoration.** No gradient, no wash, no accent border on a card, no tinted background.
- **Anywhere it could be read as a verdict.** Nothing in this product means *good* because it is
  green.

**Two constraints that are easy to miss:**

1. **It must not be confusable with `--state-live`.** Live-versus-expired is already a green and a
   red, on a chip the founder reads as a fact about a patent. An accent green close enough to be
   mistaken for it would make the primary button look like a status.
2. **It needs a dark value, measured.** A hue chosen against white and carried unchanged into the
   dark palette is how a component silently stops meeting contrast.

**`app/` has not been repainted.** It ships with near-black primary fills, which is what the
no-accent rule left behind. Applying this decision is a separate, visible pass.

**A green marketing page was never licence to put green in the product**, and that separation still
holds in the other direction: this decision governs the product interface. The TIS website's surface
accents are a different system, recorded upstream.

---

## 6 · Open

- **The name.** Clearance is outstanding. Nothing is locked until it clears.
- **Pricing** — the allowance, the price and the tier structure. The plan screen prints `XXX` and a
  bar rather than guessing, and [`platform.md`](platform.md) §10 item 1 records why this cannot be settled
  before filing alerts are.
- **The specific green**, its dark value, and its two tokens.
- **What a search costs, and what an export costs.** [`platform.md`](platform.md) §6.1 lists the run
  types that exist and prints illustrative figures against them. Pricing is unsettled, and the one
  question the pivot forces is whether taking your own data out should move the meter at all.
- **Whether Terrain sits on Innovue's semantic search surface or beside it.**

---

## 7 · Upstream

Decisions recorded here that belong in the TIS monorepo when Terrain graduates. **Never edit the
monorepo from this folder** — record it here and leave it for a deliberate propagation pass.

- The Terrain name and the endorsed-sub-brand lockup → `brand/positioning.md`.
- **Terrain's accent decision and its two tokens** → `brand/visual-guide.md`, where the
  gradient ↔ pillar pairings live.
- Terrain's neutral ramp and semantic-colour rule → the two systems will need deliberate
  reconciliation, not a copy.
- **Terrain's dark palette** — the semantic tokens in `design-language.md` §10, and more usefully the
  rule that no component may read a primitive.
- **Terrain's motion vocabulary** — the easing curves and the standing prohibitions.
- **What the lockup *does*** — a masthead lockup that is the way home is a component behaviour, not
  just a mark.
- **The record-vs-opinion rule** → `brand/positioning.md`. It is the item on this list most likely to
  matter to a sibling product.
- **The browser-tab icon**, `brand/favicon.svg` — the submark with its own `prefers-color-scheme`
  block.
- Terrain's row copy in the website's Products menu → `website/`.
