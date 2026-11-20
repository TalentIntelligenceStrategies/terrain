# TIS Terrain — Brief

> **Source of truth for what Terrain is.** What gets built is [`platform.md`](platform.md); how it
> looks is [`design-language.md`](design-language.md); what the engine must return is
> [`../design/components.md`](../design/components.md).

---

## 1 · The product

**Terrain is patent search built to return the patents actually near an idea, for founders and the
people who back them, and to hand that set over as a file.**

The user arrives with a concept. Whether they have filed, are mid-filing, or have no intention of
filing does not change the job: early-stage IP positions are all over the place, and Terrain does
not assume one. They describe what they are building, Terrain returns the patents that are actually
near it, they open the ones that matter, and the set leaves as a CSV or a Markdown file.

**One question.** The search answers *what is already here that is close to this?* It answers it
with the documents themselves, as published, and leaves what they mean to the reader.

Self-serve software, English-native, searching Innovue's patent database. Terrain is the low-cost
baseline, and it shows no price.

**TIS provides a patent intelligence layer, and Terrain is TIS's own tool on it.** An organisation
(an incubator, an accelerator, an investor) keeps its data, its tools and its decisions; the layer
sits between them, and every tool the organisation runs, its own or one it buys, can call it.
Terrain is the first such tool and the one every organisation gets (§6).

**Innovue builds and ships it.** The founder uses Innovue's build, on Innovue's engine. `app/` in this
repository is the reference that build is made from, for its look as much as its behaviour, and it
reaches Innovue as round packages ([`platform.md`](platform.md) §13).

### The flow, and there is only one

**Search → find similar → export.** Every surface serves a step of it, and a surface that serves
none does not belong in the product.

1. **Search.** One sentence, one call. Nothing is asked before it runs: the Text / Patent number
   switch says what kind of thing was typed, and asks nothing about it.
2. **Find similar.** Open a patent and the set re-orders by nearness to it. No patent enters or
   leaves; only the sequence changes, and it can be put back.
3. **Export.** One record leaves from the record, and the results leave from the list head, each as
   a CSV or a Markdown file carrying exactly the fields on screen.

There is no shortlist, no saved set and no report. A founder who wants to keep a set keeps the file.

### The search shows what came back

**A conclusion is worth only as much as the reader's ability to check it, so the search draws none.**
A founder who wants an analysis runs it themselves, on the set, exactly as published.

**The gap is not finding patent information; it is finding information a founder can trust.** There
is no shortage of it. The tools a founder reaches for give one half or the other:

- **Generative AI is near and cannot be trusted.** It answers in the founder's own words, but it
  writes the answer rather than retrieving the documents, so it can cite a patent that does not
  exist, misread the scope of a claim, or fold two patents into one. The founder sees its retelling
  and never the search behind it.
- **A keyword index can be trusted and is not near.** Its records are real, but it returns what
  shares the founder's words rather than their meaning: the right patent is missing, or it is on
  page nine behind forty that are not close at all. The founder cannot tell which, because they
  cannot see what was left out.

**Terrain is built to give both: the real patents nearest the idea, exactly as published.** The
claims it carries are of two kinds, and copy keeps them apart:

- **Trusted is a claim about the record, and it holds by construction.** Every result is a patent
  document retrieved from the index and printed as the database holds it (identifiers, holder,
  dates, legal status, classes, abstract, claims, drawings) with nothing summarised, paraphrased or
  interpreted. Copy says *real*, *as published* and *nothing generated*. It does not say *accurate*,
  because the database is not verbatim either: family merge and name unification are Innovue's
  hygiene (§3), and a field can come back blank, which the page prints as a dash.
- **Near is a claim about the set, and it is an aim.** The evaluations of the engine are
  Innovue's own, in two fields, and they measure the engine *against other tools* rather than the
  set a founder gets ([`platform.md`](platform.md) §12; §3 below says what it licenses). So copy says
  *built to return* rather than *returns*, and the evaluation that would change that is one run on
  founders' own descriptions. ***Reliable* describes the data, never the results**: *reliable
  patent records* is true; *reliable results* would be heard as *it finds the right ones*.

**The search uses AI and does not generate.** The engine's embedding model is from the same family
as the large language models behind a chatbot, so the contrast is never *AI* or *an LLM* against
none: a technical buyer answers *you use one too*, and is right. The contrast is **generating
against retrieving**: the model compares meaning and writes nothing the founder reads. *To
understand what you mean, it compares; it never writes the answer.* Copy says **generative AI**, or
*an LLM that writes answers* in a technical room, and never names a product: a named chatbot dates
the claim, and invites the reply that it now searches the web. **One place shows them by their
marks: the deck's positioning chart**, where a row of marks stands for the category a founder
already reaches for, and a mark is recognised faster than the phrase. The chart claims nothing about
any one product; its caption and the speaker still say *generative AI*.

**So the line is between a view of the set and a reading of it.**

- **Admissible: a view of the set.** The rows counted and regrouped by year, holder, office or
  class. *Group by topic* is one: it groups the results by their CPC subclass and names each group
  in CPC's own words. Every number in a view can be checked against the rows, and a caption over it
  may state a count and nothing more.
- **Out: a reading of the set.** A summary, a claim chart, a plain-English version, where an idea
  may differ, *Holder A leads this space*. Terrain prints none of it, anywhere.
- **Out: legal advice stated as fact**: *infringes*, *is clear*, *is free to use*, *freedom to
  operate*, *is novel*, *is invalid*, *will be granted*.

**The engine's relevance score is printed on every row**, beside the row's rank, because it is the
number the engine ordered the set by and the founder can see the order it produced. It is the
engine's, not Terrain's: Terrain computes no score, and copy never presents the number as a
confidence or a probability. **No ranking language may read as a verdict**: *ranked by relevance*
is an ordering; *strong match*, *best fit* and *most relevant* are readings, whatever number sits
beside them. The published corpus has no engine behind it, so its rows carry stand-in scores that
descend with the rank; `CLAUDE.md` under *What is published* says so where the corpus is described.

### What makes it a product rather than a search box

**Legibility and self-serve.** The same set an IP professional would assemble, operable by the person
who actually has the question, and handed over in a form they can work in.

**Patent search is built for a trained operator.** Keyword tools miss patents written in other
words; analyst platforms want a taxonomy authored before the first search and an analyst on the
other side of it; a general search engine returns a long list in the vocabulary of patent law.
Terrain is one passage and a set: no analyst, no definitions table, and nothing a user must learn
before it is useful. A practitioner who already knows the vocabulary loses nothing by not needing
it. Classification codes print as data, with CPC's own words beside them where the record carries
them; *Group by topic* reads those words, so the founder never has to know what a subclass is.

**This is a durable claim in a way a feature claim is not.** *We draw X* is beaten the day somebody
else draws X. *Anyone with the question can operate this, and only a trained operator can operate
that* is a claim about who can use the thing, and it does not fall to a feature.

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
what keeps the absence a fact about the search, which is why the search panel always shows the scope
it ran with.*

### The search is software, and a file is its page

The user opens it and searches. Nothing is produced to order by a human, and nothing in the product
is called a *report*.

**The file test: no file states anything its page did not.** A record leaves as the fields its
record shows; the results leave as the rows in the order on screen, with the scope that produced
them. **The moment a file states something its page did not, Terrain has produced a different
document**, and that is an amendment to this lock argued as one.

### Who it is for

**Founders, and the people who back them.** *Backers* are the investors, incubators and accelerators
behind a startup, and *backers* is the word: an incubator is not a third audience. Practitioners who
search on a founder's behalf or beside them (the searcher with a claim and a filing date, the
advisor screening a portfolio company's idea) use the same search and lose nothing by it.

**The founder stays the reader the interface is designed for, because designing for the
least-trained user loses nothing for the rest.** Terrain **never requires** patent vocabulary: a
practitioner who has it can bring a claim and a cutoff date, and a founder who does not can bring a
sentence, and the same search serves both. The search never says what a result means, whoever is
reading.

**User and buyer are not the same.** The first market is **US** founders, and frequently someone else
pays: the university, accelerator, incubator or investor backing them. Bringing a whole cohort is a
backer's second role, and that one is a **sales channel**, not an audience: it changes how Terrain is
sold, never who the interface is designed for.

**Language: the product is English only.** The parent TIS surfaces are bilingual, and the TIS
website's page about Terrain carries a Traditional Chinese translation: marketing copy about the
product, recorded in §7, which this rule does not govern. Inside the interface: no Chinese copy, no
bilingual markup, no CJK typeface. Innovue's build carries a zh-TW locale it does not render, and
Terrain does not ask for one.

---

## 2 · The name

**Not decided.** Three names are in use, and each is somebody's working choice rather than a
decision:

- **Terrain**: this repository, every document in it, and the sales deck, where it sits in the TIS
  lockup. The clearance check below applies before it is locked.
- **Patent Search**: the TIS website, which keeps *Terrain* off its pages.
- **TIS Terrain**: the masthead of Innovue's build, and of `app/`, which takes it from that build.

Everything here is written as *Terrain*, because the alternative is writing nothing. What follows is
the case for Terrain; it stands until the name is decided against it.

It is positioned as a **TIS-endorsed sub-brand**, not a standalone brand and not a descriptive
label.

**Why Terrain.** Three reasons, none of which depends on the product drawing a map:

1. **It names the founder's question, not our output.** *What is already here that is close to
   this?* §1's one question is about nearness, and nearness is a spatial idea whether the answer
   arrives as a map or as a ranked list. The name rests on *near*, not on surveying the ground, which
   is why it survived the product changing shape underneath it, the test a name is supposed to pass.
2. **The engine's own vocabulary is already territorial.** Its lineage family is **技術脈絡**, a
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
The `TIS Terrain` lockup is defensible where bare *Terrain* likely is not, another reason the
endorsed architecture is right. **A USPTO / TIPO and domain clearance check is outstanding and must
happen before anyone designs a logo.**

---

## 3 · Innovue

Terrain is built on the capability behind Innovue's IPtech. Innovue is a TIS shareholder and the
co-developer of the SABCD engine. The relationship is **attribution only**:

- *Powered by Innovue* as one attribution line, **at the foot of the home page and nowhere else in
  the product**. Home is where a visitor learns what Terrain is and what it searches, so the credit
  sits beside the data coverage it explains; the working surface carries no vendor line, as Innovue's
  own build carries none there.
- **A sales deck names them *our IP-technology provider*** and carries no Innovue mark; a figure is
  cited as *our IP-technology provider's evaluation*, with its scope. The deck sells Terrain, and the
  provider's name in a buyer's hands is an invitation to go around it. The relationship is the same;
  only what a deck prints changes.
- The patent database cited in body copy where it does credibility work, as Innovue's and without
  a size. A record count would be theirs, not one Terrain measured, and no count is printed until
  Innovue confirms it for Terrain.
- **Innovue's company credentials are cited as theirs, never as TIS's**: the year they were founded,
  their client and user counts, and the clients they name. **A named client needs Innovue's
  confirmation for Terrain**, and a confirmation given for IPtech material does not carry over: a
  client who agreed to be cited for an analyst platform has not agreed to endorse a founder's
  search tool.
- **Innovue never appears in the product name or the primary lockup.**

The commercial reasons: a name-level dependency caps pricing against their list, blocks the
trademark, and forces a rebrand if the engine ever changes. None of them attaches to a credit line at
the foot of a page.

### The mark, and the one colour that is not ours

The attribution line renders **Innovue's mark in Innovue's blue**, not the words alone. It is
theme-aware (their primary blue in light, their own white mark in dark) and **both files are
theirs**, with identical `viewBox`, so the swap is pixel-stable. The alternative would have been a
Terrain-authored light variant of someone else's brand, which is the thing this section exists to
prevent.

**The blue is admissible because it is a third party's mark reproduced as issued, not a hue Terrain
has chosen.** The test that keeps it from spreading: **the blue may only ever appear inside the
Innovue mark itself.** In a border, a chip, a chart or a button, it has been misread.

Two of Innovue's eight SVGs are tracked and published, the tight-cropped `_eng_inline` variants in
blue and in white, because a published page cannot reference a file that is not published. The other
six are not redistributed.

### What IPtech is

`專利布局分析系統`: a patent layout analysis system, sold beside `WEBPAT`, a search database, in a
rack of management systems plus consulting. Its marketing site is Chinese-only; **the product is
not**: there is an English UI, and TIS has an account. What is incomplete is the English, not its
absence: a Chinese column header sits in an otherwise English table, applicant names render
untranslated, and the vocabulary is non-idiomatic throughout. A record opens in it from Terrain's
*Open in IPTECH*.

It is built for an analyst and it is good at what it does. Terrain is not a tier of it and not a
translation of it. [`platform.md`](platform.md) §9 records what is adopted and what is cut.

**What IPtech's material says about itself does not transfer to Terrain by default.** Its sales
material is the nearest thing to Terrain's, and the temptation is to lift selling points from it.
The test is one question: **would the claim still be true if IPtech did not exist?** A claim about
the **engine, the database or the company** (Innovue's database and its coverage, how often it
syncs, that a search starts from plain language, when Innovue was founded) passes, and may be made
for Terrain with its source. A claim about the **IPtech application** does not: its analysis
modules, the time it saves an analyst, its testimonials, and its clients cited as endorsement are
facts about a product a founder will never open.

### The engine, and what may be said about it

**Terrain's search is Innovue's semantic search**, the engine behind PI-VuePat, which Innovue
serves Terrain from. A founder's sentence is turned into a vector by an embedding model and the
nearest patents in the index come back, so a patent written in other words than the founder's can
still be found; nothing is generated, and every row is a patent document that exists. **Which parts
of a patent the index reads (which text fields, whether the drawings) and which index answers a
Terrain search is not stated**, and `components.md` §4 asks.

**The evaluations are Innovue's own**: granted patents in two fields, semiconductors and
information and communication technology, the prior art their examiners cited taken as the answer,
and other tools run beside the engine; and a run on US grants from claim 1 alone. Innovue presents
them in its **PI roadshow deck** (October 2026), made in English and Chinese for US patent
practitioners. The figures are not repeated in this file, which states decisions; they are in
`visual-reference/innovue-research/` and `sales/answers.md`, both local because they print real
holders. What this section fixes is what *kind* of claim they can carry, which does not depend on
what they found.

**Three behaviours of the engine come from that deck, and Terrain's copy may state them:**

- **A query in one language reaches documents in another.** An English claim is matched against
  Japanese and Korean documents in their own language, with no translation step, and the query's
  language steers the results toward the offices that publish in it.
- **A search runs inside one technology field.** A patent classified outside the chosen field is
  not searched. Innovue states the direction as a single index across all fields, with medical the
  next field to be added; Terrain material gives neither a date.
- **The same text on the same day returns the same list.** The daily intake of new publications
  moves ranks slightly between days.

**What it licenses, and what it does not:**

- **Sayable, with its source and its scope:** a comparison with the tools it was run against,
  attributed to Innovue, naming the field, the number of patents and the cutoff each tool was
  counted at. That Terrain's search retrieves real documents rather than generating text. That a
  general-purpose embedding model is used because a published benchmark found such models ahead of
  patent-specific ones at prior-art retrieval: that benchmark is public and needs nobody's
  clearance.
- **Not sayable:** *accurate*, *finds all the prior art*, *finds what an examiner would*, *replaces a
  professional search*, or any figure without its scope. An evaluation of two fields on a few dozen
  patents each is a comparison, and it does not become a measure of the set a founder gets.
  *Confidential* or *private* about a founder's search, while Innovue's build records sessions (§4).
  *Searches N million patents*: a database size is Innovue's, and how much of it a field's index
  holds is not stated. Anything shaped like legal advice stated as a finding: a
  freedom-to-operate view, patentability, *open ground* (§1), or *qualifies as prior art*, which
  Innovue's deck says of one demo and which is a reading of a document, not something the engine
  returned.
- **Assessment is a service, never an output.** Material that sells the layer (§6) may name
  *novelty, freedom-to-operate and claim-scope assessment* as a service TIS delivers to an
  organisation, scoped with it and carried out with qualified review. No copy says the engine or the
  search produces one, and the product names none of them.
- **The engine's score is printed and not sold.** It is the engine's ordering, not a confidence,
  and no copy may present it as one; whether it separates near from not near at all is
  `platform.md` §12's question.

**What Innovue presents and what Innovue shared are cleared differently.** The figures in its
roadshow deck are Innovue's own claims, made to be presented, and Terrain material **may cite them
as Innovue's, with their scope**. Its two research reports (architecture, and the evaluation
summary behind the semiconductor figures) were shared with TIS for internal use: **a figure that
appears only there reaches nothing public until Innovue confirms it, figure by figure**: a deck,
the website, a published page, or a tracked file on `main`, which a push publishes. What a partner
shares to inform a decision is not what it has agreed to see quoted. **Either way, a session
preparing public material that draws on Innovue's figures reminds the user to confirm them with
Innovue before the material leaves.**

**A figure is cited as Innovue states it, and its scope travels with it.** Where a headline
compares tools at different cutoffs (one tool's top 50 against another's top 20) the cutoffs are
said beside it.

**The rule is narrower than "all of it", on purpose.** A behaviour of the engine that a Terrain
decision rests on (that a date field is often blank, that a query's language shapes which offices
come back) may be stated in these documents without a figure and attributed to Innovue, because
an engineer reading `platform.md` needs the reason for the decision, and a figureless fact about
how a search behaves is not the result Innovue measured. `sales/answers.md` is the working copy of
what a buyer will ask, and it is local because its answers carry the figures.

---

## 4 · Locked

- **Innovue as attribution only**, never in the name or the primary lockup. The product credits them
  by name and mark on its home page; a sales deck credits *our IP-technology provider* without
  either (§3).
- **The endorsed sub-brand architecture**: the TIS mark appears in the lockup.
- **Two typefaces**: Urbanist (text and display), Inconsolata (numerals, codes and dates).
- **English only, in the product**: no Chinese surface and no bilingual markup in the interface.
  Marketing copy about it belongs to the TIS website.
- **The product definition** in §1: search, find similar and export, for founders and the backers
  behind them, and what may and may not be said about a set.
- **The search never says what the set means.** A view of a set is admissible (counts and groups by
  year, holder, office or class, the rows redrawn, with a caption that states a count). A reading (a
  summary, a claim chart, a finding sentence) and legal advice stated as fact are admissible
  nowhere. *The line is where the claim sits, not the form*: a one-line caption under a plain table
  can still say *here is the gap*, and that is the caption most likely to slip in, because every
  individual caption looks small.
- **No session recording.** Usage events may be counted; a session may not be recorded. The search
  box holds an idea the founder may not have filed, and a recording sends it, keystroke by
  keystroke, to a third party. Innovue's build records sessions, and [`platform.md`](platform.md)
  §13.5 raises it.
- **The search is software, and a file is its page** (§1).
- **The record is rendered, not an opinion about it.** A patent's identifiers, legal status, classes,
  abstract and claims are public text, and Terrain shows them as published, on the row and on the
  record. A field the record does not carry prints as a dash; nothing fills it. Nowhere: match
  highlighting, *strong match*, a plain-English version.

  The engine's relevance score is printed on every row, and copy treats it as the order it is (§1).
- **One working screen, two panels, and each panel means one thing.** The result list has the left
  and keeps it; the patent record has the right, and says *Select a patent* until one is picked.
  Search settings, grouping and sorting are popovers anchored to their controls, and an enlarged
  drawing is a viewer over the page. A top masthead, not a sidebar. On a phone the record is a full
  screen of its own over the list.
- **The search runs on submit.** No narrowing questions, no criteria to approve, no build stream. The
  commitment is pressing Search.
- **No per-row curation.** There is no star and no selection: the founder takes the results or one
  record as a file, and what they keep is the file. *This is a narrowed successor, not a reversal*:
  per-row selection existed to feed a set that fed a report, and with neither in the product a
  selection would be a control that leads nowhere.
- **Application code goes in `app/`, and it is framework-agnostic**: plain CSS files, semantic HTML
  partials, vanilla ES modules. No framework, no preprocessor, no bundler. The team receiving this
  writes CSS, and a custom property is the one interchange format every stack consumes; a
  preprocessor variable also resolves at build time, which the theme swap cannot survive. `app/` is
  the reference implementation and [`app/README.md`](../app/README.md) is what an engineer reads
  first.
- **Innovue ships Terrain; `app/` is the reference it is built from, for everything.** Behaviour,
  flow, the engine contract, type and layout all come from `app/`, which is built from the round 4
  detail lab (`visual-reference/innovue-build/round-4/detail-lab/`, V8). One reference means a
  difference between the two builds always has an answer; `platform.md` §13 carries the round and the
  package that hands it over.
- **`.claude/skills/` holds procedure, never decisions.** Besides `terrain-round/`, it holds the
  copy and deck skills (`tis-copy/` and `presentation-{outline,content,notes}/`) which apply §1, §3
  and the banned lists and define nothing of their own. They are tracked, so they carry no client
  name and no Innovue figure.
- **Two directories serve the rounds.** `.claude/skills/terrain-round/` holds the procedure and the
  scripts it runs. It is not `tools/`: the capture, overlay and measuring scripts refuse nothing, and
  the packager, which does refuse, belongs to the procedure rather than to the gates the repository
  runs. `design/overlays/round-N/` holds the overlays written against their build, tracked because
  they are a deliverable. The captures each round takes stay under `visual-reference/`, untracked,
  because they print real holder names.
- **`app/` publishes to GitHub Pages, against the real corpus.** The question that held it back was
  what a stranger sees when the fake engine answers: bars where every holder should be, and no
  drawing at all. They do not see it: the published site carries `corpus/`, so the link shows real
  titles, real assignees and 2,247 real plates, with `demo/` along only as the fallback the seam
  requires. The site is `noindex`, which is not the same as private: **anyone with the URL can open
  it.** `CLAUDE.md` under *What is published* carries the argument, including why this corpus is
  publishable and why the next one might not be.
- **`corpus/` is the stress-test set and it prints real holder names.** A hundred patents captured
  from Google Patents, sitting beside `demo/` with the same two-file shape, and **it is what loads by
  default when it is present**: `?data=demo` is the flag that forces the fake engine. The whole
  directory is excluded from `main`, which is what keeps the demo rule meaningful: no real assignee
  or inventor name enters a file tracked there. **Its four runtime paths are published to
  `gh-pages`**, because the site would show nothing without them: a separate decision resting on how
  the set was assembled rather than on the exclusion it breaks.

  **Real names are printed, and that does not reopen §1.** The rule §1 carries governs what copy may
  claim about a *set*: that nothing came back is not that nothing exists. Naming a holder who did
  file is the opposite kind of claim and has always been admissible; what `CLAUDE.md` refuses is
  *inventing* one or *transliterating* one into illustrative data, and an observed assignee is
  neither. The demo keeps its bars, because its rows are fictional and a fictional name reads as a
  live example.

  **The corpus has no engine, so its order and its scores are stand-ins.** Its rows come back in the
  order its local engine assigns, and each carries a stand-in relevance score that descends with the
  rank, so the published page shows the row as Innovue's engine fills it. No number in it was
  measured, and nothing outside the published page cites one.

  **The cost is stated rather than hidden: the export and the drawings are only demonstrable against
  the corpus.** A spreadsheet of skeleton bars shows nothing and the demo ships no patent figure at
  all, so anyone receiving this handoff without `corpus/` cannot see the product's own ending work.
  That is the price of never tracking a real name, it was paid deliberately, and
  [`app/README.md`](../app/README.md) says so where an engineer will read it.

  **What the corpus is for is finding what the demo cannot ask.** `demo/` is well-behaved by
  construction (one 46-character holder, three classification codes, nine short claims) so every
  renderer was written against shapes that never strain. The corpus supplies the strain, and the
  findings belong in this repository rather than in it.
- **`sales/` is the answer bank, and it is excluded from `main` in its entirety.** What a buyer
  will ask about the technology, answered with a deck line, a backup and a source for each. It
  sits in this folder because every answer cites a decision here, and it is local because its
  answers carry real holders from Innovue's demos and figures from Innovue's internal research,
  which §3 keeps off anything public until Innovue confirms them.
  **The decisions stay in §3, not in it**: `sales/answers.md` may say less than §3 permits and
  never more, and where the two disagree, §3 wins.

---

## 5 · The accent

**Terrain's accent is achromatic.** It is the near-black ink pair (near-white in dark) and that is
the decision, not a slot waiting on a hue.

**Why there is no colour in it.** [`design-language.md`](design-language.md) §2 permits colour where
it carries information, and a control's colour carries none: it says *press here*, which the control's
shape and word already say. **Terrain has no hue at all**: legal status prints as a word, never as a
coloured chip, so a chromatic accent would be the one hue on the screen and would read as data. It
costs one thing worth naming: a near-black primary action is calmer and less inviting than a
coloured one.

**The accent is still a role, and it keeps its tokens.** The sites below have to be able to *say*
they are the accent; a site that read `--text-1` would leave the rule pointing at nothing, and it
would stop being enforceable the moment another site appeared.

**Where it may appear:**

- The **primary action**: one filled button per surface, and never two.
- The **focus ring**.
- The **selected** state of a segmented control or a menu item.
- The **open row's border**: the result whose record is open in the right panel. It marks where the
  founder is, which is a state of the interface, not a fact about the patent.

**Where it may not:**

- **In data.** Not a score, not a rank, not a bar. A hue for data would be an amendment to
  [`design-language.md`](design-language.md) §2, and the accent would not be it.
- **As decoration.** No wash, no accent fill on a card, and no gradient but two.
- **Anywhere it could be read as a verdict.**

**The deck's ground and silver edge are the product's.** The page ground is the deck's slate, with
one light at the top right (slide 1's in dark, the appendix's in light), and two things carry the
deck's silver edge: **Find similar**, the action that turns a record into a new order, and **the
relevance score chip**, the number that order is read by. Both are named exceptions to *no
gradient*. The edge on the score chip frames the engine's number as the engine's, the way the deck
frames it; it never changes with the value, so it says *this is the score*, never *this one is
good*. [`design-language.md`](design-language.md) §2 and §3.8 carry the values and the rules. The
reason is that a founder who has seen the deck should open the product and recognise it.

**One deck exception: a status palette.** The sales deck marks *availability* with three dots:
**green** (#4DBF5F) for live,
**amber** (#E0A63A) for coming, **grey** for later. A dot always carries its word beside it, and
none ever marks a figure, a result, our engine against another tool, or anything in the interface.
A deck is marketing material, and a dot here says *when*, never *how good*. Red for limits and blue
for emphasis were considered and refused: red on a comparison reads as a verdict, and blue belongs
to the Innovue mark.

---

## 6 · Open

- **The name.** Three are in use (§2) and none is decided. Clearance is outstanding on whichever is
  chosen, and nothing is locked until it clears.
- **What Terrain costs, and what the layer costs.** The model is decided, and it has four layers:
  the organisation's own knowledge (its disclosures, its deal pipeline, its portfolio records); **the
  TIS patent intelligence layer**; the tools that call it; and the decisions the organisation makes
  with them. **TIS provides the second and only the second.** The layer is the engine, from our
  IP-technology provider (§3), plus access to it for the organisation's tools, connectors to the
  organisation's own data, and assessment delivered as a service (§3). The first and fourth
  layers stay the organisation's, and the third is whatever it builds or buys.
  **Terrain is the low-cost baseline tool on the layer**: search, find similar and export, with no
  price shown anywhere in the product. Anything else an organisation needs (its own tools, a portal
  fitted to it, an analysis of a set) calls the same layer, and is scoped with that organisation.
  **Terrain has no tier word**: nothing in the product is named as a paid part, and *free* is never
  printed, because everything in the baseline simply works. Open: the baseline's price, what the
  layer costs an organisation, and what a connector or an assessment engagement costs.
- **Whether Terrain sits on Innovue's semantic search surface or beside it.**
- **Accounts.** The product has no account surface, no sign-in and no billing page. What a
  signed-in organisation sees, and where, is open until the price is.

---

## 7 · Upstream

Decisions recorded here that belong in the TIS monorepo when Terrain graduates. **Never edit the
monorepo from this folder**: record it here and leave it for a deliberate propagation pass.

- The Terrain name and the endorsed-sub-brand lockup → `brand/positioning.md`.
- **TIS as the patent intelligence layer**: the second of four layers, with Terrain as TIS's own
  tool on it (§6) → `brand/positioning.md`. It is the Patent Intelligence pillar's offer, not
  Terrain's alone.
- **Terrain's accent decision**: an achromatic product accent → `brand/visual-guide.md`.
- Terrain's neutral ramp and semantic-colour rule → the two systems will need deliberate
  reconciliation, not a copy.
- **Terrain's slate ground and silver edge**: the deck's grounds and edge, now the product's
  (§5) → `brand/visual-guide.md`. They are the one place Terrain is tinted where the brand ramp is
  true neutral, so they need reconciling rather than copying.
- **Terrain's dark palette**: the semantic tokens in `design-language.md` §10, and more usefully the
  rule that no component may read a primitive.
- **Terrain's motion vocabulary**: the easing curves and the standing prohibitions.
- **What the lockup *does***: a masthead lockup that is the way home is a component behaviour, not
  just a mark.
- **The record-vs-opinion rule** → `brand/positioning.md`. The search renders the record and never
  reads it. It is the item on this list most likely to matter to a sibling product.
- **The browser-tab icon**, `brand/favicon.svg`: the submark with its own `prefers-color-scheme`
  block.
- Terrain's row copy in the website's Products menu → `website/`.
- **The website's Patent Search page** (`website/product/search/`, veiled) is a downstream consumer of
  this repository: its screenshots are captured from it, and its brief points at §1. It trails this
  brief and waits for the propagation pass. Its limits row says *No charts or summaries*, where §1
  admits a view of the set (counts and groups) and still no summary. It names the product *Patent
  Search*, one of the three unsettled names in §2, and its Traditional Chinese translation is
  marketing copy, which §1's language rule does not govern. Its copy lists a legal-status filter,
  which Terrain does not have; says *Find similar* works from a starred patent, where it works from
  the open record and there is no star; says *Semiconductor devices first* where the field list is
  the engine's; and promises a reply from Help, which the product no longer has. Its product shots
  carry invented holders and numbers beside real drawings, which §4 records this repository
  refusing, and they predate the round 4 look; sales material is captured from `app/` against the
  corpus instead. Its audience also trails §1, which names founders and the backers behind them.
