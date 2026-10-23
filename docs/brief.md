# TIS Terrain — Brief

> **Source of truth for what Terrain is.** What gets built is [`platform.md`](platform.md); how it
> looks is [`design-language.md`](design-language.md); what the engine must return is
> [`../design/components.md`](../design/components.md).

---

## 1 · The product

**Terrain is patent search built to return the patents actually near an idea, and a report on what
they may mean — for founders, and the people who back them.**

The user arrives with a concept. Whether they have filed, are mid-filing, or have no intention of
filing does not change the job — early-stage IP positions are all over the place, and Terrain does
not assume one. They describe what they are building, Terrain returns the patents that are actually
near it, they star the ones that matter, and the starred set becomes a report.

**Two questions, in order.** The search answers *what is already here that is close to this?* The
report answers the next one: *how close are these patents to the idea, and who holds them?* **It is
one report, whoever reads it**, because a founder and a backer want the same sections — the founder
wants the risk flags and the questions before an investor raises them, the backer wants where the
idea may differ and each patent in plain English.

Self-serve software, English-native, searching Innovue's patent database. The search shows no
price; the Pro part of a report is paid per report (§6).

**Innovue builds and ships it.** The founder uses Innovue's build, on Innovue's engine. `app/` in this
repository is the reference that build is made from — behaviour, flow and the engine contract — and
reaches Innovue as round packages ([`platform.md`](platform.md) §13).

### The flow, and there is only one

**Search → find similar → star → the starred set → report or export.** Every surface serves a step of
it, and a surface that serves none does not belong in the product.

1. **Search.** One sentence, one call. Nothing is asked before it runs — the Text / Patent number
   switch says what kind of thing was typed, and asks nothing about it.
2. **Find similar.** Open a patent and the set re-orders by nearness to it. No patent enters or
   leaves — only the sequence changes, and it can be put back.
3. **Star.** The founder's own shortlist, and the only thing in the product they curate by hand.
4. **The starred set.** Its own surface, where the shortlist is read as a whole.
5. **Report or export.** The starred set becomes a **patent report**, or leaves as a
   CSV or a Markdown list. A report opens with counts anyone can check and runs on into its Pro part,
   which is written only when the user runs it. [`platform.md`](platform.md) §5.3 is the report.

### The search shows what came back; a report says what it may mean

**A conclusion is worth only as much as the reader's ability to check it.** So the search never draws
one, and a report draws its conclusions where they can be checked: every reading sits in a section
marked as AI-written, cites the starred patents it rests on, and stands beside counts of the same
set. A founder who would rather run the analysis themselves still has the set, exactly as published.

**The gap is not finding patent information; it is finding information a founder can trust and act
on.** There is no shortage of it. The tools a founder reaches for give one half or the other:

- **Generative AI is near and cannot be trusted.** It answers in the founder's own words, but it
  writes the answer rather than retrieving the documents, so it can cite a patent that does not
  exist, misread the scope of a claim, or fold two patents into one. The founder sees its retelling
  and never the search behind it.
- **A keyword index can be trusted and is not near.** Its records are real, but it returns what
  shares the founder's words rather than their meaning: the right patent is missing, or it is on
  page nine behind forty that are not close at all. The founder cannot tell which, because they
  cannot see what was left out.

**Terrain is built to give both: the real patents nearest the idea, exactly as published, and a
report built on them that shows its sources.** The claims it carries are of different kinds, and
copy keeps them apart:

- **Trusted is a claim about the record, and it holds by construction.** Every result is a patent
  document retrieved from the index and printed as the database holds it — identifiers, holder,
  dates, abstract, claims, drawings — with nothing summarised, paraphrased or interpreted. Copy says
  *real* and *as published* about results, and *nothing generated* only about the search: a report's
  Pro sections are generated, and say so. It does not say *accurate*, because the database is not
  verbatim either: family merge and name unification are Innovue's hygiene (§3), and a field can come
  back blank.
- **Near is a claim about the set, and it is an aim.** The evaluations of the engine are
  Innovue's own, in two fields, and they measure the engine *against other tools* rather than the
  set a founder gets ([`platform.md`](platform.md) §12; §3 below says what it licenses). So copy says
  *built to return* rather than *returns*, and the evaluation that would change that is one run on
  founders' own descriptions. ***Reliable* describes the data, never the results** — *reliable
  patent records* is true; *reliable results* would be heard as *it finds the right ones*.
- **A reading is a claim about the starred set, and it is checkable or it is not printed.** A Pro
  section cites the patents, claims and passages it rests on, so every sentence in it can be traced
  to a row the founder can open.

**The search uses AI and does not generate; a report's Pro part does, and says so.** The engine's
embedding model is from the same family as the large language models behind a chatbot, so the
contrast is never *AI* or *an LLM* against none — a technical buyer answers *you use one too*, and is
right. In the search the contrast is **generating against retrieving**: the model compares meaning
and writes nothing the founder reads in a result. In a report a language model does write, from the
starred patents and the founder's description, and the contrast becomes **a retrieved set, and a
reading of it you can check against the set.** *To understand what you mean, it compares; where it
writes, it says so and shows its sources.* Copy says **generative AI**, or *an LLM that writes
answers* in a technical room, and never names a product: a named chatbot dates the claim, and invites
the reply that it now searches the web.

**So the line is where a reading sits, not whether there is one.**

- **Admissible everywhere: a view of the set.** How many came back per filing year, per holder, per
  office, per class — the rows counted and redrawn. Every number in it can be checked against the
  rows, and a caption over it may state a count and nothing more. *Three holders account for 67 of
  186 results* is a count.
- **Admissible only in a report's Pro part: a reading of the set.** A summary, a claim chart, what
  falls outside the claims, where an idea may differ — marked as AI-written, citing what it rests on,
  and in *may* wording wherever it touches a claim's reach.
- **Out everywhere:** a reading on the search surface; a verdict shown as a score, a rank or a
  probability of Terrain's own; and anything shaped like legal advice stated as fact — *infringes*,
  *is clear*, *is free to use*, *is novel*, *is invalid*. *Holder A leads this space* is a reading and
  belongs in a Pro section if anywhere; *a design without feature C may avoid claim 1 of Patent X* is
  admissible there under the disclaimer; *you are clear to build* is not admissible at all.

Terrain prints what the engine returned, what the patent says, counts of both, and — in a report's
Pro part — a marked reading of the starred set. **The views ship in the report's counted part**
([`platform.md`](platform.md) §5.3), and [`design-language.md`](design-language.md) §2 says they are
drawn without a hue.

**The engine's own relevance score is printed, and that is the line rather than an exception to it.**
The question is not *is it an opinion* but *is it ours*. Terrain refuses to **generate** a verdict; it
does not **hide** one the engine already produced. No ranking language may read as a verdict —
*ranked by relevance* is an ordering; *strong match*, *best fit* and *most relevant* are readings,
whatever number sits beside them. A report's reading is in words, never a number of Terrain's own.

**Printed is not the same as always on screen.** An engine that returns no score leaves the row with
none, and Terrain does not compute one to fill the gap — which is this rule read from the other end
rather than an exception to it. [`platform.md`](platform.md) §4.3 carries what the interface does
about it.

### What makes it a product rather than a search box

**Legibility and self-serve.** The same set an IP professional would assemble, operable by the person
who actually has the question — and handed over in a form they can work in.

**Patent search is built for a trained operator.** Keyword tools miss patents written in other
words; analyst platforms want a taxonomy authored before the first search and an analyst on the
other side of it; a general search engine returns a long list in the vocabulary of patent law.
Terrain is one passage and a set — no analyst, no definitions table, and nothing a user must learn
before it is useful. A practitioner who already knows the vocabulary loses nothing by not needing
it. Classification and kind codes print on the record as data; none is a control the founder
has to understand.

**This is a durable claim in a way a feature claim is not.** *We draw X* is beaten the day somebody
else draws X. *Anyone with the question can operate this, and only a trained operator can operate
that* is a claim about who can use the thing, and it does not fall to a feature.

**And there is a second one underneath it: the ending is designed, not an afterthought.** The
founder's shortlist becomes a report written for the question they actually have — building it, or
backing it — or leaves as a file carrying exactly the fields they read on screen. This is a claim
about Terrain's flow, not about what any other product lacks.

### What Terrain may not say about a set

**A search that returns nothing has found nothing, which is not the same as there being nothing.**
The engine searched an index, over a vocabulary, at a moment. Copy may describe **what came back**
and may not describe **what exists** — and that holds inside a report's Pro part as much as on the
search surface:

- Sayable: *Nothing in the Innovue database came back close to this.* *Forty-one patents matched, and
  these eight are nearest to the one you have open.* *This holder's most recent filing here is 2019.*
  *No claim in this set covers feature D; this set is not a full search.*
- Not sayable: *Here is the gap.* *Open ground.* *Whitespace.* *Nobody is here.* *This is unclaimed.*

**The test:** a sentence is admissible if it would still be true when the whole rest of the world's
patent estate is added to the index. A statement about *this result set* survives that. A statement
about *this technology being unclaimed* does not.

*The rule is easy to think unnecessary, because nobody would write "nobody is here" on purpose. The
failure is quieter than that: an empty result list, rendered plainly and captioned honestly, still
reads as open ground to a founder who does not know what an index is. Saying what was searched is
what keeps the absence a fact about the search — which is why every report opens with how its set
was made.*

### The search is software; a report says it is one

The user logs in and searches. Nothing is produced to order by a human. **The search is never
described in report language**, and *report* names the patent report and nothing else — not an export,
not a view, not the starred set.

**A report is generated by the software from the founder's own starred set, and it says it is a
report.** It carries a memo header (to, about, date, basis) and a statement of how its set was made,
because a reading without its basis is the failure this section exists to prevent. It carries no
cover written for the reader and no conclusion that is not on its page.

**The file test survives, narrowed to what the page showed.** The founder may take the starred set out
as a CSV or a Markdown list: the rows already on their screen. A report leaves as a PDF of its own
page — before Pro, the counted sections and nothing else; after Pro, everything. **The moment a file
states something its page did not, Terrain has produced a different document**, and that is an
amendment to this lock argued as one.

### Who it is for

**Founders, and the people who back them.** *Backers* are the investors, incubators and accelerators
behind a startup, and *backers* is the word: an incubator is not a third audience. Practitioners who
search on a founder's behalf or beside them — the searcher with a claim and a filing date, the
advisor screening a portfolio company's idea — use the same search and either report, and lose
nothing by it.

**The founder stays the reader the interface is designed for, because designing for the
least-trained user loses nothing for the rest.** Terrain **never requires** patent vocabulary — a
practitioner who has it can bring a claim and a cutoff date, and a founder who does not can bring a
sentence, and the same search serves both. **The backer reads the same report the founder does**,
written in neutral voice so it reads the same when a founder forwards it, and nothing in the
interface changes for them. The search never says what a result means, whoever is reading; the
report does, in its Pro part.

**User and buyer are not the same.** The first market is **US** founders, and frequently someone else
pays — the university, accelerator, incubator or investor backing them. Incubators and accelerators
are backers and read the same report. Bringing a whole cohort is their second role, and that one is
a **sales channel**, not an audience: it changes how reports are sold, never who the interface is
designed for.

**Language: the product is English only.** The parent TIS surfaces are bilingual, and the TIS
website's page about Terrain carries a Traditional Chinese translation — marketing copy about the
product, recorded in §7, which this rule does not govern. Inside the interface: no Chinese copy, no
bilingual markup, no CJK typeface. Innovue's build carries a zh-TW locale it does not render, and
Terrain does not ask for one.

---

## 2 · The name

**Not decided.** Three names are in use, and each is somebody's working choice rather than a
decision:

- **Terrain** — this repository, `app/`, every document in it, and the sales deck, where it sits in
  the TIS lockup. The clearance check below applies before it is locked.
- **Patent Search** — the TIS website, which keeps *Terrain* off its pages.
- **TIS Terrain** — the masthead of Innovue's build.

Everything here is written as *Terrain*, because the alternative is writing nothing, and the
masthead is not raised with Innovue until the name is settled. What follows is the case for Terrain;
it stands until the name is decided against it.

It is positioned as a **TIS-endorsed sub-brand** — not a standalone brand and not a descriptive
label.

**Why Terrain.** Three reasons, none of which depends on the product drawing a map:

1. **It names the founder's question, not our output.** *What is already here that is close to
   this?* — §1's one question is about nearness, and nearness is a spatial idea whether the answer
   arrives as a map or as a ranked list. The name rests on *near*, not on surveying the ground, which
   is why it survived the product changing shape underneath it — the test a name is supposed to pass.
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

- *Powered by Innovue* as an attribution line, at the foot of every **product** surface.
- **A sales deck names them *our IP-technology provider*** and carries no Innovue mark; a figure is
  cited as *our IP-technology provider's evaluation*, with its scope. The deck sells Terrain, and the
  provider's name in a buyer's hands is an invitation to go around it. The relationship is the same;
  only what a deck prints changes.
- The patent database cited in body copy where it does credibility work — by Innovue's own
  published figure, around 180 million patent records. It is cited as theirs (*Innovue's database of
  around 180 million patent records*), never as a count Terrain measured.
- **Innovue's company credentials are cited as theirs, never as TIS's** — the year they were founded,
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

**What IPtech's material says about itself does not transfer to Terrain by default.** Its sales
material is the nearest thing to Terrain's, and the temptation is to lift selling points from it.
The test is one question: **would the claim still be true if IPtech did not exist?** A claim about
the **engine, the database or the company** — Innovue's database and its coverage, how often it
syncs, that a search starts from plain language, when Innovue was founded — passes, and may be made
for Terrain with its source. A claim about the **IPtech application** does not: its analysis
modules, the time it saves an analyst, its testimonials, and its clients cited as endorsement are
facts about a product a founder will never open.

### The engine, and what may be said about it

**Terrain's search is Innovue's semantic search** — the engine behind PI-VuePat, which Innovue
serves Terrain from. A founder's sentence is turned into a vector by an embedding model and the
nearest patents in the index come back, so a patent written in other words than the founder's can
still be found; nothing is generated, and every row is a patent document that exists. **Which parts
of a patent the index reads — which text fields, whether the drawings — and which index answers a
Terrain search is not stated**, and `components.md` §4 asks.

**The evaluations are Innovue's own** — granted patents in two fields, semiconductors and
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
  counted at. That Terrain's search retrieves real
  documents rather than generating text. That a general-purpose embedding model is used because
  a published benchmark found such models ahead of patent-specific ones at prior-art retrieval —
  that benchmark is public and needs nobody's clearance.
- **Not sayable:** *accurate*, *finds all the prior art*, *finds what an examiner would*, *replaces a
  professional search*, or any figure without its scope. An evaluation of two fields on a few dozen
  patents each is a comparison, and it does not become a measure of the set a founder gets. *Confidential*
  or *private* about a founder's search, while Innovue's build records sessions (§4). *Searches
  180 million patents*: that figure is Innovue's database, and how much of it a field's index holds
  is not stated. Anything shaped like legal advice stated as a finding — a freedom-to-operate view,
  patentability, *open ground* (§1), or *qualifies as prior art*, which Innovue's deck says of one
  demo and which is a reading of a document, not something the engine returned. A report's Pro part
  may say a change *may avoid* a claim, under its disclaimer (§1); no copy says the engine or a
  report finds what infringes.
- **The engine's score is printed and not sold.** It is the engine's ordering, not a confidence,
  and no copy may present it as one; whether it separates near from not near at all is
  `platform.md` §12's question.

**What Innovue presents and what Innovue shared are cleared differently.** The figures in its
roadshow deck are Innovue's own claims, made to be presented, and Terrain material **may cite them
as Innovue's, with their scope**. Its two research reports (architecture, and the evaluation
summary behind the semiconductor figures) were shared with TIS for internal use: **a figure that
appears only there reaches nothing public until Innovue confirms it, figure by figure** — a deck,
the website, a published page, or a tracked file on `main`, which a push publishes. What a partner
shares to inform a decision is not what it has agreed to see quoted. **Either way, a session
preparing public material that draws on Innovue's figures reminds the user to confirm them with
Innovue before the material leaves.**

**A figure is cited as Innovue states it, and its scope travels with it.** Where a headline
compares tools at different cutoffs — one tool's top 50 against another's top 20 — the cutoffs are
said beside it.

**The rule is narrower than "all of it", on purpose.** A behaviour of the engine that a Terrain
decision rests on — that a date field is often blank, that a query's language shapes which offices
come back — may be stated in these documents without a figure and attributed to Innovue, because
an engineer reading `platform.md` needs the reason for the decision, and a figureless fact about
how a search behaves is not the result Innovue measured. `sales/answers.md` is the working copy of
what a buyer will ask, and it is local because its answers carry the figures.

---

## 4 · Locked

- **Innovue as attribution only**, never in the name or the primary lockup. The product credits them
  by name and mark; a sales deck credits *our IP-technology provider* without either (§3).
- **The endorsed sub-brand architecture** — the TIS mark appears in the lockup.
- **Two typefaces**: Urbanist (text and display), Inconsolata (numerals and figures).
- **English only, in the product** — no Chinese surface and no bilingual markup in the interface.
  Marketing copy about it belongs to the TIS website.
- **The product definition** in §1: search and one patent report, for founders and the backers behind
  them, and what may and may not be said about a set.
- **The search never says what the set means; a report's reading is marked and cited.** A view of
  a set is admissible anywhere — counts by year, holder, office or class, the rows redrawn, with a
  caption that states a count. A reading — a summary, a claim chart, a finding sentence — is
  admissible only in a report's Pro part, marked as AI-written and citing the patents it rests on. A
  verdict shown as a score, and legal advice stated as fact, are admissible nowhere. *The line is
  where the claim sits and whether it shows its sources, not the form*: a one-line caption under a
  plain table on the search surface can still say *here is the gap*, and that is the caption most
  likely to slip in, because every individual caption looks small.
- **No session recording.** Usage events may be counted; a session may not be recorded. The search
  box holds an idea the founder may not have filed, and a recording sends it, keystroke by
  keystroke, to a third party. Innovue's build records sessions, and [`platform.md`](platform.md)
  §13.5 raises it.
- **The search is software; a report says it is one**, and its PDF carries only what its page showed
  (§1).
- **The record is rendered, not an opinion about it.** A patent's identifiers, abstract and claims
  are the public text of a granted patent and Terrain shows them as published — on the search
  surface, on the record, and in a report's counted part. A *reading* of that text — a plain-English
  version, a claim chart — appears only in a report's Pro part, marked. Nowhere: match highlighting,
  *strong match*.

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
  commitment is pressing Search. A report's Pro part is the one thing in the product that takes
  minutes, and it runs only when the user asks for it.
- **Starring is the one thing the founder curates by hand**, and it is per-row. *This is a narrowed
  successor, not a reversal*: the old rule banned per-row selection because checkboxes redrew a
  chart and the set feeding the charts had to stay whole. The starred set feeds itself, the export
  and the report, and nothing else.
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
- **`.claude/skills/` holds procedure, never decisions.** Besides `terrain-round/`, it holds the
  copy and deck skills — `tis-copy/` and `presentation-{outline,content,notes}/` — which apply
  §1, §3 and the banned lists and define nothing of their own. They are tracked, so they carry no
  client name and no Innovue figure.
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
  answers carry real holders from Innovue's demos and figures from Innovue's internal research,
  which §3 keeps off anything public until Innovue confirms them.
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

**One deck exception: a status palette.** The sales deck marks *availability* with three dots:
**green** (#4DBF5F, Terrain's marketing green measured from the Products-menu thumbnail) for live,
**amber** (#E0A63A) for coming, **grey** for later. A dot always carries its word beside it, and
none ever marks a figure, a result, our engine against another tool, or anything in the interface.
A deck is marketing material, and a dot here says *when*, never *how good*. Red for limits and blue
for emphasis were considered and refused: red on a comparison reads as a verdict, and blue belongs
to the Innovue mark.

**Terrain's green lives on the TIS website, not in the product.** It is the hue Terrain's row carries
in the website's Products menu, and `brand/assets/imagery/terrain/` is the gradient thumbnail that
uses it. That is the marketing system's accent, recorded upstream; it does not enter the interface.

---

## 6 · Open

- **The name.** Three are in use (§2) and none is decided. Clearance is outstanding on whichever is
  chosen, and nothing is locked until it clears.
- **The price of Pro.** The model is decided — the search shows no price and the Pro part of a report
  is paid per report, because a founder needs one around a pitch or a filing and a backer per deal,
  and neither comes back monthly. Open: the price, what a run costs Innovue, and whether institutions
  buy reports in bulk. *Free* is never printed: everything outside Pro simply works, and **Pro is the
  only tier word**.
- **What the Pro sections say, and how.** Innovue writes the prompt behind each Pro section and runs
  the job; TIS checks the wording against §1. The run time (about ten minutes is the aim) and how the
  user hears it is done are open.
- **Whether Terrain sits on Innovue's semantic search surface or beside it.**
- **Which sections backers actually use.** The sections a backer reads — *Other holders in the
  set*, *Risk flags*, *Questions a backer may ask* — rest on what law firms and WIPO say investors
  ask in diligence; no investor or accelerator has been asked directly. Three to five calls with
  backers, shown the report, are the next step. What is not open with it: two audiences, founders
  and backers, one report both read, and the founder stays the reader the interface is designed for.

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
- **The record-vs-opinion rule, split between search and report** → `brand/positioning.md`. The
  search renders the record; a report's Pro part may read it, marked and cited. It is the item on this
  list most likely to matter to a sibling product.
- **The browser-tab icon**, `brand/favicon.svg` — the submark with its own `prefers-color-scheme`
  block.
- Terrain's row copy in the website's Products menu → `website/`.
- **The website's Patent Search page** (`website/product/search/`, veiled) is a downstream consumer of
  this repository: its screenshots are captured from it, and its brief points at §1. Three things on
  it trail this brief and wait for the propagation pass. Its limits row says *No charts or
  summaries*, which §1 no longer holds — a report draws counts of the set and, in its Pro part, a
  marked AI-written reading; the page says nothing of the report at all. It
  names the product *Patent Search*, one of the three unsettled names in §2. And its Traditional
  Chinese translation is marketing copy, which §1's language rule does not govern. Its copy also
  trails the product in four places: it lists a legal-status filter, which Terrain does not have
  (R1-17); it says *Find similar* works from a starred patent, where it works from the open record
  (R1-18); it says *Semiconductor devices first* where the field list is the engine's; and it
  promises a reply in two business days where Help says one working day. Its product shots carry
  invented holders and numbers beside real drawings, which §4 records this repository refusing;
  sales material is captured from `app/` against the corpus instead. Its audience also trails §1,
  which names founders and the backers behind them. And its shots of the starred set predate the page
  `platform.md` §5.2 describes: the set as the results card or a table, the record opening over it,
  and the report panel beside it.
- **The Pro label** — one solid ink chip marking the paid part of a product without a hue
  (`design-language.md` §7). If a sibling product sells a part of itself, this is the pattern to
  reconcile rather than reinvent.
