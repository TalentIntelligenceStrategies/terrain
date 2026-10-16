# TIS Terrain — Brief

> **Source of truth for what Terrain is.** What gets built is [`platform.md`](platform.md); how it
> looks is [`design-language.md`](design-language.md); what the engine must return is
> [`../design/components.md`](../design/components.md).

---

## 1 · The product

**Terrain is patent search built to return the patents actually near an idea, and to hand them over cleanly, for founders
working out where their idea sits.**

The user arrives with a concept. Whether they have filed, are mid-filing, or have no intention of
filing does not change the job — early-stage IP positions are all over the place, and Terrain does
not assume one. They describe what they are building, Terrain returns the patents that are actually
near it, and they take the ones that matter with them.

**One question, and the whole product answers it:** *what is already here that is close to this?*

Self-serve software, English-native, searching Innovue's patent database. How it is sold is
open (§6), and nothing in the product presumes an answer.

**Innovue builds and ships it.** The founder uses Innovue's build, on Innovue's engine. `app/` in this
repository is the reference that build is made from — behaviour, flow and the engine contract — and
reaches Innovue as round packages ([`platform.md`](platform.md) §13).

### The flow, and there is only one

**Search → find similar → star → the starred set → export.** Every surface serves a step of it, and a
surface that serves none does not belong in the product.

1. **Search.** One sentence, one call. Nothing is asked before it runs — the Text / Patent number
   switch says what kind of thing was typed, and asks nothing about it.
2. **Find similar.** Open a patent and the set re-orders by nearness to it. No patent enters or
   leaves — only the sequence changes, and it can be put back.
3. **Star.** The founder's own shortlist, and the only thing in the product they curate by hand.
4. **The starred set.** Its own surface, where the shortlist is read as a whole.
5. **Export.** It leaves as a CSV or a Markdown list, and the product is over.

### Terrain shows what came back, and never says what it means

**Founders do not run somebody else's pre-built analysis.** They take the data and work it in tools
they already trust, because they know how the answer came out — and a conclusion they did not reach,
sitting inside software they are still deciding whether to pay for, is a claim they have no way to
check. Terrain does not compete on the analysis; it sits upstream of it.

**The gap worth solving is retrieval.** Patent search returns inaccurate, incomplete sets: the right
patent is missing, or it is on page nine behind forty that are not close at all. A founder cannot
tell which, because they cannot see what was left out. **An accurate set, and a clean way to take
it out, is what the product is for** — an aim, not a measured claim. The one evaluation of the
engine is Innovue's own, in one field, and it measures the engine *against other tools* rather than
the set a founder gets ([`platform.md`](platform.md) §12; §3 below says what it licenses). So copy
says *built to return* rather than *returns*, and the evaluation that would change that is one run
on founders' own descriptions.

**That is a claim about retrieval, not about presentation** — so the line is not *is it a chart* but
*does it say what the set means*.

- **Admissible: a view of the set.** How many came back per filing year, per holder, per office, per
  group — the returned rows counted and redrawn. Every number in it can be checked against the rows
  beneath it, and it says nothing the rows do not.
- **Out, however small: a reading of the set.** No generated summary, no finding sentence, no
  verdict, no caption that draws a conclusion, no score of Terrain's own. *Holder A leads this
  space* is a reading; a bar per holder is a count.

Terrain prints what the engine returned, what the patent says, and counts of both. **A view is
permitted, not built** — none ships, [`platform.md`](platform.md) §10 says what would start one, and
[`design-language.md`](design-language.md) §2 says it is drawn without a hue.

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

**Patent search is built for the profession.** Keyword tools miss patents written in other words;
analyst platforms want a taxonomy authored before the first search and an analyst on the other side
of it; a general search engine returns a long list in the vocabulary of patent law. Terrain is one
sentence and a set — no analyst, no definitions table, and nothing the founder must learn before it
is useful. Classification and kind codes print on the record as data; none is a control the founder
has to understand.

**This is a durable claim in a way a feature claim is not.** *We draw X* is beaten the day somebody
else draws X. *A founder can operate this and cannot operate that* is a claim about who can use the
thing, and it does not fall to a feature.

**And there is a second one underneath it: the ending is designed, not an afterthought.** The
founder's shortlist leaves as a file carrying exactly the fields they read on screen, so the work
continues in the tools they already trust. This is a claim about Terrain's flow, not about what any
other product lacks.

### What Terrain may not say about a set

**A search that returns nothing has found nothing, which is not the same as there being nothing.**
The engine searched an index, over a vocabulary, at a moment. Copy may describe **what came back**
and may not describe **what exists**:

- Sayable: *Nothing in the Innovue database came back close to this.* *Forty-one patents matched, and
  these eight are nearest to the one you have open.* *This holder's most recent filing here is 2019.*
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

**Language: the product is English only.** The parent TIS surfaces are bilingual, and the TIS
website's page about Terrain carries a Traditional Chinese translation — marketing copy about the
product, recorded in §7, which this rule does not govern. Inside the interface: no Chinese copy, no
bilingual markup, no CJK typeface. Innovue's build carries a zh-TW locale it does not render, and
Terrain does not ask for one.

---

## 2 · The name

**Not decided.** Three names are in use, and each is somebody's working choice rather than a
decision:

- **Terrain** — this repository, `app/`, and every document in it.
- **Patent Search** — the TIS website and sales material, which keep *Terrain* off anything a buyer
  reads.
- **TIS Terrain** — the masthead of Innovue's build.

Everything here is written as *Terrain*, because the alternative is writing nothing, and the
masthead is not raised with Innovue until the name is settled. What follows is the case for Terrain;
it stands until the name is decided against it.

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
- The patent database cited in body copy where it does credibility work — by Innovue's own
  published figure, around 180 million patent records. It is cited as theirs (*Innovue's database of
  around 180 million patent records*), never as a count Terrain measured.
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
translation of it. [`platform.md`](platform.md) §9 records what is adopted and what is cut.

### The engine, and what may be said about it

**Terrain's search is Innovue's semantic search** — the engine behind PI-VuePat, which Innovue
serves Terrain from. A founder's sentence is turned into a vector by an embedding model and the
nearest patents in the index come back, so a patent written in other words than the founder's can
still be found; nothing is generated, and every row is a patent document that exists. **Which parts
of a patent the index reads — which text fields, whether the drawings — and which index answers a
Terrain search is not stated**, and `components.md` §4 asks.

**One evaluation exists, and it is Innovue's own** — granted patents in one field, the prior art
their examiners cited taken as the answer, and other tools run beside the engine. **Its figures and
how the engine fared against the others are not stated here**, because this file is public and they
are not (the last paragraph of this section); the translation is local, in
`visual-reference/innovue-research/`. What this section fixes is what *kind* of claim it can carry,
which does not depend on what it found.

**What it licenses, and what it does not:**

- **Sayable, with its source and its scope:** a comparison with the tools it was run against,
  attributed to Innovue, naming the field and the number of patents. That Terrain retrieves real
  documents rather than generating text. That a general-purpose embedding model is used because
  a published benchmark found such models ahead of patent-specific ones at prior-art retrieval —
  that benchmark is public and needs nobody's clearance.
- **Not sayable:** *accurate*, *finds all the prior art*, *finds what an examiner would*, *replaces a
  professional search*, or any figure without its scope. An evaluation of one field on a few dozen
  patents is a comparison, and it does not become a measure of the set a founder gets. *Confidential*
  or *private* about a founder's search, while Innovue's build records sessions (§4). *Searches
  180 million patents*: that figure is Innovue's database, and how much of it a field's index holds
  is not stated. Anything shaped like legal advice — a freedom-to-operate view, patentability,
  *open ground* (§1).
- **The engine's score is printed and not sold.** It is the engine's ordering, not a confidence,
  and no copy may present it as one; whether it separates near from not near at all is
  `platform.md` §12's question.

**Innovue's research is cleared for internal use, and only that.** They shared it with TIS; nobody
has published it. **Its figures and its comparative results — what it measured, and how the engine
fared against other tools — reach nothing public until Innovue confirms them again, figure by
figure**: a deck, the website, a published page, or a tracked file on `main`, which a push
publishes. What a partner shares to inform a decision is not what it has agreed to see quoted. A
session preparing public material that draws on it says so before the material leaves.

**The rule is narrower than "all of it", on purpose.** A behaviour of the engine that a Terrain
decision rests on — that a date field is often blank, that a query's language shapes which offices
come back — may be stated in these documents without a figure and attributed to Innovue, because
an engineer reading `platform.md` needs the reason for the decision, and a figureless fact about
how a search behaves is not the result Innovue measured. `sales/answers.md` is the working copy of
what a buyer will ask, and it is local because its answers carry the figures.

---

## 4 · Locked

- **Innovue as attribution only**, never in the name or the primary lockup.
- **The endorsed sub-brand architecture** — the TIS mark appears in the lockup.
- **Two typefaces**: Urbanist (text and display), Inconsolata (numerals and figures).
- **English only, in the product** — no Chinese surface and no bilingual markup in the interface.
  Marketing copy about it belongs to the TIS website.
- **The product definition and ICP** in §1, including what may and may not be said about a set.
- **Terrain never says what the set means.** A view of the returned set is admissible — counts by
  year, holder, office or group, the rows redrawn. A generated summary, a finding sentence, a verdict,
  or a caption that draws a conclusion is not. *The line is the claim, not the form*: a bar per
  holder says nothing the rows do not, and a one-line caption under a plain table can still say
  *here is the gap*. This is the decision the whole product turned on, and it is the one most likely
  to be reopened by accident, because every individual caption looks small.
- **No session recording.** Usage events may be counted; a session may not be recorded. The search
  box holds an idea the founder may not have filed, and a recording sends it, keystroke by
  keystroke, to a third party. Innovue's build records sessions, and [`platform.md`](platform.md)
  §13.5 raises it.
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
  commitment is pressing Search.
- **Starring is the one thing the founder curates by hand**, and it is per-row. *This is a narrowed
  successor, not a reversal*: the old rule banned per-row selection because checkboxes redrew a
  chart and the set feeding the charts had to stay whole. The starred set feeds nothing but itself
  and the export.
- **Application code goes in `app/`, and it is framework-agnostic** — plain CSS files, semantic HTML
  partials, vanilla ES modules. No framework, no preprocessor, no bundler. The team receiving this
  writes CSS, and a custom property is the one interchange format every stack consumes; a
  preprocessor variable also resolves at build time, which the theme swap cannot survive. `app/` is
  the reference implementation and [`app/README.md`](../app/README.md) is what an engineer reads
  first.
- **Innovue ships Terrain; `app/` is the reference it is built from.** `app/` is the reference for
  behaviour, flow and the engine contract; Innovue's shipped build is the reference for type and
  text layout, unless a round's difference list flags a component. Their type is fine as it is, and
  without a default every cosmetic difference would be reopened each round. `platform.md` §13
  carries the round and the package.
- **Two directories serve the rounds.** `.claude/skills/terrain-round/` holds the procedure and the
  scripts it runs. It is not `tools/`: the capture, overlay and measuring scripts refuse nothing, and
  the packager, which does refuse, belongs to the procedure rather than to the gates the repository
  runs. `design/overlays/round-N/` holds the overlays written against their
  build, tracked because they are a deliverable. The captures each round takes stay under
  `visual-reference/`, untracked, because they print real holder names.
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
- **`sales/` is the answer bank, and it is excluded from `main` in its entirety.** What a buyer
  will ask about the technology, answered with a deck line, a backup and a source for each. It
  sits in this folder because every answer cites a decision here, and it is local because its
  answers carry Innovue's figures, which §3 keeps off anything public until Innovue confirms them.
  **The decisions stay in §3, not in it**: `sales/answers.md` may say less than §3 permits and
  never more, and where the two disagree, §3 wins.

---

## 5 · The accent

**Terrain's accent is achromatic.** It is the near-black ink pair — near-white in dark — and that is
the decision, not a slot waiting on a hue.

**Why there is no colour in it.** [`design-language.md`](design-language.md) §2 permits colour where
it carries information, and a control's colour carries none: it says *press here*, which the control's
shape and word already say. **Terrain has no hue at all** — the legal-status chip that once held the
only colour in the product left with legal status — so a chromatic accent would be the one hue on the
screen and would read as data. It costs one thing worth naming: a near-black primary action is calmer
and less inviting than a coloured one.

**The accent is still a role, and it keeps its tokens.** The three sites below have to be able to
*say* they are the accent; a site that read `--text-1` would leave the rule pointing at nothing, and
it would stop being enforceable the moment a fourth site appeared.

**Where it may appear:**

- The **primary action** — one filled button per surface, and never two.
- The **focus ring**.
- The **selected** state of a segmented control or a menu item.

**Where it may not:**

- **In data.** Not a score, not a relevance rank, not a bar. A hue for data would be an amendment to
  [`design-language.md`](design-language.md) §2, and the accent would not be it.
- **As decoration.** No gradient, no wash, no accent border on a card, no tinted background.
- **Anywhere it could be read as a verdict.**

**Terrain's green lives on the TIS website, not in the product.** It is the hue Terrain's row carries
in the website's Products menu, and `brand/assets/imagery/terrain/` is the gradient thumbnail that
uses it. That is the marketing system's accent, recorded upstream; it does not enter the interface.

---

## 6 · Open

- **The name.** Three are in use (§2) and none is decided. Clearance is outstanding on whichever is
  chosen, and nothing is locked until it clears.
- **How Terrain is sold** — by subscription, by seat to an institution, by metered use, or otherwise;
  the price; and whether a plan limits anything at all. Nothing presumes a model: the plan screen
  prints `XXX` and a bar rather than guessing, and Innovue's build carries no pricing. Taking points
  out of both builds (R1-20) removed a model nobody had chosen; it did not choose another.
- **Whether Terrain sits on Innovue's semantic search surface or beside it.**

---

## 7 · Upstream

Decisions recorded here that belong in the TIS monorepo when Terrain graduates. **Never edit the
monorepo from this folder** — record it here and leave it for a deliberate propagation pass.

- The Terrain name and the endorsed-sub-brand lockup → `brand/positioning.md`.
- **Terrain's accent decision** — an achromatic product accent beside a green marketing hue →
  `brand/visual-guide.md`, where the gradient ↔ pillar pairings live.
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
- **The website's Patent Search page** (`website/product/search/`, veiled) is a downstream consumer of
  this repository: its screenshots are captured from it, and its brief points at §1. Three things on
  it trail this brief and wait for the propagation pass. Its limits row says *No charts or
  summaries*, which states more than §1 does — a view of the set is admissible, a summary is not. It
  names the product *Patent Search*, one of the three unsettled names in §2. And its Traditional
  Chinese translation is marketing copy, which §1's language rule does not govern. Its copy also
  trails the product in four places: it lists a legal-status filter, which Terrain does not have
  (R1-17); it says *Find similar* works from a starred patent, where it works from the open record
  (R1-18); it says *Semiconductor devices first* where the field list is the engine's; and it
  promises a reply in two business days where Help says one working day. Its product shots carry
  invented holders and numbers beside real drawings, which §4 records this repository refusing;
  sales material is captured from `app/` against the corpus instead.
