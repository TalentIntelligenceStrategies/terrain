# TIS Terrain — The Case

> **Audience: TIS management, and Innovue.** Why Terrain is being built, what it takes from IPtech,
> and what the interface looks like.
>
> Assembled 2026-09-01, revised 2026-09-10. **Nothing here is new scope.** It is the record already
> held in [brief.md](brief.md), [platform.md](platform.md) and
> [design-language.md](design-language.md), arranged as an argument. Those three are the source of
> truth: where this document and they disagree, they win. Every claim about IPtech comes from the
> audit dated 2026-08-31 and carries a source tag; the sources are listed in the document footer.

---

### What travels with this

*Section numbers are append-only: §1, §2, §3.2, §3.3, §4.I and §6.3 were folded into the sections
around them on 2026-09-05 and their numbers were retired rather than reused, so a citation made
against an earlier draft still means what it meant. The live sections are §0 and §3–§10.*

***The rendered page carries fewer, and that is deliberate.*** *`design/previews/terrain-the-case.html`
renders §0.1–§0.4 as its four sections and §3–§6 as the detail folded under them. **§0.5, §4.H and
§7–§10 are markdown-only.** The page is a four-section outbound read, not the whole document; this
file is the complete record and wins wherever the two differ. Adding a section here does not add one
there — and if one of these is ever wanted on the page, the section count in `index.html` and
`README.md` moves with it.*

**Static HTML, no server and no build step** — open it in any browser. The prototype is a second
file that the document loads into a frame, so keep the two together, or read them from the repository
where they live.

| File | What it is |
| --- | --- |
| `terrain-the-case.html` | **This document.** Four sections, and a second tab running the prototype in a frame |
| `terrain-prototype.html` | **The prototype itself** — clickable, on an illustrative set (§6.5). The tab above frames this file; it also opens on its own at full window |

*It was one file with the prototype embedded inside it between 2026-09-05 and 2026-09-08, so it could
be sent as a single mail attachment. It is hosted now, so the two are separate files again and the
document is 96 KB rather than 700.*

And the handoff, for whoever would implement it: `design/components.md` (**the component manifest**
— per component, what it reads, the data shape it needs from your engine, and which capability
supplies it). **The data-shape column is the one worth an engineer's time.** The tokens themselves
are `docs/design-language.md` §3–§6; a machine-readable extraction is a build away and is not
carried as a separate artifact, because a second copy is a second thing to keep in sync.

*This document cites `platform.md` and `design-language.md` throughout. Those are our internal
working records and are not included; every claim that matters is restated here, and the citations
are there so we can be held to the same record we work from rather than a summary written for the
occasion.*

---

## 0 · The short version

**Added 2026-09-04, and it is what the outbound document shows.** Each of the four sections opens
with the matching part of this, and the full reading sits behind one fold. Written short and plain on
purpose: most of our readers do not have English as a first language, and the detail is one click
away rather than in the way.

*Nothing here is new. It is §3–§9 said briefly.*

### 0.1 · Why this direction

IPtech is a strong system, and it is built for an IP professional. That person knows patent language
and already does this analysis. **Terrain is the same engine with a new front door, for a different
person: a US startup founder.**

A founder asks two questions. *Who else is here? What is close to my idea?* **These are the things
Terrain is built to help them address.**

**Terrain needs no new capability from the engine.** Everything it uses works in IPtech today. What
changes is who the product speaks to, in which language, and how much of the machine the user sees.

**And that is the whole claim.** Not that Terrain shows something IPtech cannot draw — it shows
what `Tech-Effx › Company` already draws. **The difference is that a founder can operate it.**
They describe an idea in one sentence, answer five questions, approve how it was read, and the
analysis is there. No taxonomy authored in advance, no analyst, and no term of art anywhere on the
screen.

### 0.2 · Our audience, and why IPtech is not built for them

**Terrain's buyer is a different person entirely.** A US early-stage startup founder, arriving with
a concept — filed, mid-filing, or nowhere near it. No IP team. No patent vocabulary. No prior
analysis to be made faster, because they have never done any.

| | IPtech | Terrain |
| --- | --- | --- |
| User | IP or legal professional | Startup founder, non-specialist |
| Buyer | The same company | The founder, or the institution backing them |
| Expertise assumed | Substantial | None |
| Language | Chinese first | English, natively |
| Sold as | Enterprise licence, quoted | Self-serve subscription |
| Value claim | The same work, faster | The same analysis, operable by the person who has the question |

**The last row matters most** — a founder does not know what they do not know, so they cannot steer
around it, and they cannot commission the analysis that would tell them. IPtech makes three
assumptions. **Each one is correct for its own user. None of them
works for a founder.**

1. **It assumes the user knows patent words.** A founder does not, and learning them is not what
   they came to do.
2. **It assumes the user builds the structure first.** A founder cannot. That knowledge is the thing
   they came for.
3. **It assumes the user already does this work**, so *"80% faster"* means something. A founder has
   never done it, so faster measures nothing. The value has to be **possible**, not faster.

**None of this is a reason to change IPtech.** It is the reason for a second front door.

### 0.3 · Everything IPtech does, and why we take only some of it

**Eighteen capabilities carry Terrain.** You will not see eighteen things in the product, and that is
the point.

| Where the eighteen are | |
| --- | --- |
| On screen today | 7 |
| Running, but hidden on purpose | 5 |
| Waiting on one answer | 1 |
| Cut | 1 |
| Not in the first version | 3 |
| Not a screen at all — it is the data underneath | 1 |

**Twelve of the eighteen work today, and five of those cannot be seen.** A fishbone diagram, a
family-merge setting and an IPC code would each complicate a founder's path to an answer. So they
run, and stay out of sight. **The product is as much what is hidden as what is shown.**

*The one cut is the matrix's three named zones, and it was ours rather than yours — Terrain's own
labels over Terrain's own arithmetic. The map's legend is a density scale now, and §5.1 says why.*

### 0.4 · Side by side

Fifteen components, your screen beside ours. Under each pair: what changed, why a founder needs it
that way, and where we would take it next.

Three ideas run through all fifteen.

- **One box, not thirty controls.** Your AI search box holds the clearest sentence on the screen:
  *"I want to learn about electric vehicles."* It sits below about thirty controls and four other
  tabs. We make that box the whole first screen. It accepts a sentence, a patent number, a company
  name, or a classification code, and works out which it received.
- **One tab, and one screen.** In IPtech, opening a project opens a new browser tab, and each
  analysis is reached by leaving the one before it. That is useful for an analyst comparing charts.
  A founder gets lost. **In Terrain everything after the first conversation is a single working
  screen** — the patents the search found down the left, every view of them on the right, and any
  patent's record brought over those views. Nothing to navigate between.
- **A question, not a diagram.** Your `Fishbone` asks the user to build the structure before
  searching. Terrain builds it and asks the founder to approve it in plain English. **Nothing runs
  until they do.**

And one line describes every removal: *a founder cannot answer a control they have not seen a result
for yet.* Filters, chart pickers and boolean fields all fail that test.

### 0.5 · What we need from Innovue

Three things matter more than the rest, and one of them is not a question.

1. **Is any of this reachable programmatically?** Terrain cannot be built on a login page. §8.2 asks
   the softer and, we hope, cheaper version: *based on what IPtech has today, can a separate English,
   startup-facing portal be built?*
2. **Can the technology axis be generated over a result set we hand you** — the way your semantic
   search surface generates one from a sentence — **and can `Tech-Effx › Company` then be computed
   over that set?** Terrain's map is your grid with holders on the rows, drawn over what one
   founder's sentence retrieved. It is the only thing we ask you for that needs both halves of the
   engine at once, and it is the largest risk we carry. §9.44 and §9.52.
3. **`Applicant/Assignee Merge` has to be on.** A requirement rather than a question, and the only
   one in this document. Your merge defaults off, and on the screens we hold it puts one US company
   across four and five rows. **On our map the holders are an axis**, so one company unmerged is
   five rows of the grid with its filings divided among them — and every reading the map supports
   is wrong in the same direction. §9.56.

There are fifty-three questions in nine groups. **Not one asks for new capability.** Each asks what
already exists, and in what form. A *no* is as useful to us as a *yes*, because each answer changes
what gets built rather than what gets rewritten.

**One question is for TIS and not for Innovue:** what does a founder take away at the end of a
session? We have not decided, and we would rather say so than hide it.

---

## 3 · Where the gap shows

> **This is the whole case, and everything after it is evidence.** Terrain does not draw anything
> IPtech cannot draw. **It is the same analysis, operable by the person who has the question** —
> and the distance between those two is not a feature, it is a vocabulary, a workflow and a
> language.

The three assumptions above are each the **right** choice for the buyer IPtech has, and none of them
is a defect. Two places show what they cost the buyer Terrain wants — the vocabulary the interface
is built in, and the state of its English.

**Why that is the durable position rather than a modest one.** A claim about what a product
*draws* is beaten the day somebody draws it, and that has already happened once here: your own
semantic search surface generates a technology structure from one sentence in about two seconds,
which is the thing we had been describing as the hard part. **A claim about who can *operate* the
thing does not fall to a feature.** It falls only if the vocabulary changes, the workflow changes
and the language changes — which is a product decision about a different buyer, and the reason
this document proposes a second front door rather than an argument about the first.

### 3.1 · It assumes the user already speaks patent

The interface is built in the vocabulary of the profession — 魚骨, 技術定義表, 布局分析. For an IP
manager that is precision, and stripping it would make the product worse.

A founder does not have those words. Terrain's rule is the mirror image, and it is a hard one:
*never expose the words fishbone, node, taxonomy, or classification* ([platform.md](platform.md)
§4).

### 3.4 · The surface layer

Read from inside the platform, 2026-09-03.

The marketing site is Chinese-only. The product does have an English UI, but the English is
**minimal** — largely titles and chrome. The content underneath still returns Chinese in the English
version, so it is not a fully English product.

---

## 4 · The full IPtech capability inventory

Everything the 2026-08-31 audit found, with our read on how much each matters to a US founder.

> **This section is the *reading*, not the mapping.** It rates *how much each capability matters to
> a founder*. What gets built is decided in our own ledger, and where the two disagree the ledger
> wins.

> **This section rates fifty capabilities; our own ledger carries sixty.** A completeness audit
> on 2026-09-07 swept the 23 M-Map/T-Map sidebar captures and all 31 screens against
> [platform.md](platform.md) §8, and found nine capabilities catalogued in neither document — among
> them the whole **LOC** classification dimension, the **Invention / Model / Design** patent-type
> filter, the fact that family grouping has **three** toolbar modes rather than one, and two
> **Tier-1 destinations with no row at all** (`Patent Count › Trend`, `Country › Distribution`).
> Those nine are in §8 and are **not** rated here, because appeal-to-a-founder is a judgement and
> nine of them have not had one. §4.H's 68-destination tiering and the appeal ratings below are
> unaffected and stand as written.

**Appeal is a three-way call:**

- **High** — carries real value for a founder; Terrain builds on it.
- **Qualified** — genuinely valuable, but reduced, deferred, or dependent on an unanswered question.
- **Not for this buyer** — valuable to an IP professional; not to a founder, with the reason given.

Each row carries its Chinese term and a **source tag** saying where the claim came from. A
`platform` tag names the screen, so any row can be checked against your own interface rather than
against our summary of it. That tagging exists to stop a marketing number quietly becoming a product
assumption.

> **Re-rated against the 31 captured screens.** This inventory was first read from public marketing.
> Two passes inside the platform added seven capabilities and changed two ratings on evidence, both
> flagged in the notes under §4.C. Fifty rows rated; see the note above on the nine that are not.

### 4.A · Ingest and interpretation

| Capability | 中文 | Source | Appeal | Reads as |
| --- | --- | --- | --- | --- |
| Plain-language search input | AI檢索Pro | product page · platform `01` | **High** | The only entry point a founder can use. Terrain's front door |
| Auto-generated technology structure | AI魚骨 | blog · platform `17` | **High, hidden** | An essential mechanism and an artifact from someone else's profession |
| Auto-clustering + relevance ranking | AI分類Pro | product page · blog | **High** | A result set becomes a structure without the founder classifying anything |
| Plain-language summary | AI速讀Pro | product page · platform `18` | **High** | How a founder judges relevance without reading a patent |
| Classification confidence score | 分類相似度 | platform `25` | **Qualified** | The engine already scores how well each patent fits its branch |
| AI relevance ranking | AI排序 · `AI Sort` | update log · platform `25` | **Qualified** | Ordering any list of evidence. Not in v1 |
| Tag keywords from patent text | 標籤關鍵字 | update log · platform `18` | **Qualified** | Keyword chips beside the summary. Not in v1 |

**The front door is real, and it is buried.** Screen `01` puts five tabs and roughly thirty controls
**above** the AI composer — including a boolean textarea headed *Logical symbol(AND;OR;NOT) must be
capitalized*. Two search inputs on one screen, and the AI box is last. **Its own placeholder is the
clearest sentence on the page.** Terrain takes that line as the whole screen and folds the five tabs
into one field: a sentence, a patent number, a company or a classification code, and no modes.

**AI速讀Pro is a paragraph, and we had it as a line.** Screen `18` shows AI Skim producing a full,
readable plain-English explanation — *"Think of it like a special lens on a flashlight…"* — beside
keyword chips, a status badge, per-patent IPC and a drawing thumbnail. **That is better than we
credited.** Terrain takes one line of it per drill-down row, which is a decision about the row and
not a limit of the capability.

**分類相似度 is new to this inventory, and it is the more useful confidence signal.** Screen `25`
scores each patent against the branch it was assigned to. IPC checks the grouping against the patent
office; this checks the *classification*, which is what the matrix is built on. No visual form yet.

### 4.B · Data hygiene

The least glamorous block in the inventory and the most load-bearing. A founder cannot audit this
layer and has no way to notice when it is wrong.

| Capability | 中文 | Source | Appeal | Reads as |
| --- | --- | --- | --- | --- |
| Applicant name unification | 名稱統一 · 名稱合併 | changelog · platform `03` `26` | **High** | A rivals list that is true, rather than confidently wrong |
| The six merge toggles | — | platform `03` | **High, as defaults** | Applicant/Assignee, Inventor, Country, Patent Country, Examiner, Application |
| Patent family merge | 同族合併 | changelog | **High** | Without it one invention filed in nine countries counts nine times |
| Legal status | 法律狀態 | changelog · platform `18` `21` | **High, as one field** | The single most decision-relevant fact for a US founder |

**Name unification exists and it is off by default.** With `Applicant/Assignee Merge` unlit, one
ranking table lists a single holder as four rows — 61 + 38 + 19 + 12 = **130, not 61** — and another
as five. One screen shows a third holder split across two rows, **ranked against itself**. Figures
throughout this section are illustrative, for the reason given in §6.5. An analyst knows to
press the toggle; a founder does not know there is one. **Terrain merges by default**, so it is a
default rather than a control. **The merge set is six dimensions, not one**, and a founder never
sees any of them.

**Legal status costs one word per row and it inverts the answer.** §5.3 has the numbers.

### 4.C · Analysis and visualisation

| Capability | 中文 | Source | Appeal | Reads as |
| --- | --- | --- | --- | --- |
| Tech × function matrix, on its `Company` cut | 技術功效矩陣 · `Tech-Effx › Company` | product page · platform `24` `16` | **High** | The single most valuable thing in the engine for this buyer. §5.1 |
| The three zones | 地雷區 · 新興區 · 處女地帶 | blog — *and absent from* `24` | **Cut** | Terrain does not render zones. The map's legend is a density scale |
| Cell drill-down | — | platform `31` | **High — and Terrain adds it** | IPtech's cell pivots to another chart. It has no route to the patents inside |
| Competitive analysis | 競合分析 | search listing · platform `03` `26` `27` | **High** | Answers *who else is here* directly. Depends entirely on 4.B |
| Macro trend analysis | 宏觀趨勢分析 | search listing · platform `05` | **High** | Is this space heating up, cooling, or did it peak years ago |
| Technology lineage | 技術脈絡分析 | search listing · platform `28` | **Qualified, and better than we rated it** | A generated three-era narrative already exists. Not a network graph |
| Company cross-citation | 公司相互引證分析 | update log · platform `06` `08` | **Qualified** | Who cites whom. Real, and not in v1 |
| Standard-essential patent marking | SEPs 標準必要專利 | update log · platform `01` | **Qualified** | A real signal of leverage, filterable at search. Not in v1 |
| Listed-company stock links | — | update log | **Qualified** | Telling an incumbent apart from a small player. Not in v1 |
| Cluster / positioning / honeycomb charts | 專利集群分析圖表 · 市場布局拼圖 · 蜂窩圖 | update log | **Qualified** | Real, and Terrain has nowhere to put them. Not in v1 |
| Tech × application matrix | 技術應用矩陣 | product page | **Qualified, deferred** | Adjacency, more directly than our own map does it — and the highest-risk part of the build |
| Legal status by jurisdiction | 法律狀態分析圖 | changelog · platform `21` | **Qualified, deferred** | The map caption states the same fact for a fraction of the cost |
| `Mark Colors` — cell paint tool | — | platform `22` `24` | **Not for this buyer** | A red/amber/green traffic light over cells |
| Bubble chart | 泡泡圖 | changelog · platform `24` | **Not for this buyer** | Analyst tooling — and the form the hero matrix itself uses |
| `M-Map` multi-chart overview | — | platform `02` | **Not for this buyer** | Four charts at once with a density toggle |
| The analysis menu | — | product page · platform | **Split three ways — see §4.H** | 126 claimed, 68 distinct. 15 founder-facing, 7 qualified, 46 not for this buyer |

**Two ratings changed when we looked at the screens, and both matter more than the ratings do.**

**Cell drill-down — we do not inherit this, we add it.** It was rated High from the blog and carried
into §6.2 as something Terrain takes. Screen `31` shows the cell has **no drill-down at all**:
`Patents : 15` is printed text, and the five items beneath are pivot links to another chart of the
same cell. There is no route from a cell to the patents inside it, so it answers *show me another
chart of this* and never *what is in here*. **The appeal rating stands; the attribution does not.**

**The three zones are cut, and the reason is ours rather than anything about your product.** They
were never confirmed to be an engine output — the populated matrix shows no 地雷區 / 新興區 /
處女地帶 anywhere, and what it shows instead is `Mark Colors`, which reads as an analyst painting
them by hand. **We held the row at its blog-sourced value rather than concluding from that
absence**, and then Terrain stopped rendering zones for a reason that has nothing to do with the
question: our map's rows are **holders**, and a zone is a region of a field where a holder row is
one party's profile. *Calling a company's empty cell "open ground" would be the interface making a
claim the data cannot support.* The legend is a density scale and a hatch for *rising*. §5.1.

**技術脈絡分析 reads better from inside than from the marketing.** We had rated it the least valuable
of the four families and the hardest to build. Screen `28` shows `Switch To Ai Insight` producing a
three-era history and five named concepts with representative patents — and its own text uses the
term 技術脈絡 for what it produced. **That is our reading, not your confirmation.**
§6.2 ships a most-cited table for v1 and records this as the better candidate.

**The hero's own cell form is the bubble chart we cut.** `24` draws sized, colour-scaled bubbles.
Terrain fills the cell instead: a bubble encodes magnitude by area, the least accurately-read channel
there is, and it leaves an empty cell looking like a small one.

### 4.D · Patent-level study

This block divides on one line, and the line is worth stating precisely because it is not the
obvious one:

> **Terrain renders the record. Terrain does not render an opinion about the record.**

A claim is the public text of a granted patent. Reproducing it — unhighlighted, unparaphrased — is
what every patent office does, and Terrain does it: open a patent and you get its identifiers, its
abstract and its claims as published. **What Terrain will not do is read one for you.** *Does this
specific patent block me* is a freedom-to-operate judgement and a legal one, and every capability
below is a step toward answering it on the founder's behalf. A decode is a paraphrase, and a
paraphrase is an interpretation. Highlighting says *this part is about you*. *Strong match* is a
verdict.

**The relevance score your surface returns is on the other side of that line, and we want to be
exact about why.** It is not Terrain reading a patent; it is your engine's own ordering, printed
rather than paraphrased. **We print it.** What we will not add is a word about quality beside it —
no *strong match*, no *best fit*, no *most relevant* — because the number is a fact about the
ranking and those are claims about the founder's chances.

So the pane says whose call it is, out loud: *"The record as it was published, and nothing read into
it. Whether it affects you is their call, not ours."*

| Capability | 中文 | Source | Appeal | Reads as |
| --- | --- | --- | --- | --- |
| Plain-language full decode | AI閱讀Pro | product page · platform `18` | **Not for this buyer** | Cut. A paraphrase of a claim is an interpretation of it |
| All figures at once | 多圖顯示模式 | changelog | **Qualified** | A figure *is* the record, so nothing rules it out. Not built — a cost decision, and the one item here a later pass could add |
| Keyword density highlighting | 記號關鍵字 | changelog | **Not for this buyer** | Cut. Highlighting a claim says *this part is about you* |
| Unread markers | 專利未讀標記 | changelog | **Not for this buyer** | A reading queue is an analyst's workflow |
| Reclassification / dismissal | 進階分類 | changelog · platform `25` | **Qualified** | Seen working as `Hierarchy`'s recycle bin. Deferred as a patent-level judgement — but **un-deferred 2026-09-07 in inverted form** as the set's star, which says *more like this one* before a map exists |
| Figure rotate / mirror | — | changelog | **Not for this buyer** | Analyst tooling |

What replaces the block is a **record pane**: clicking a row in the drill-down list opens that
patent's record in the frame beside it — eleven identifiers, the abstract, the claim set — with the
list still on screen. The five identifiers counsel needs are five of the eleven, so the attorney
handoff comes free rather than as a separate feature.

**The founder who can see nothing about a patent that worries them goes and looks somewhere else,**
and reads the claim there without the sentence above attached to it. Showing the record is how
Terrain stays the place that conversation happens.

### 4.E · Project lifecycle and recurrence

| Capability | 中文 | Source | Appeal | Reads as |
| --- | --- | --- | --- | --- |
| Filing alerts | 專利預警 | blog / testimonial | **High** | The most consequential open item in this document — see below |
| Project update notifications | 專案更新通知 | update log | **High** | Optional email when new patents land in a project. **Already built** |
| One-click project update | 一鍵搞定專案更新 | update log | **High** | The apply half of the same mechanism |
| Project archival after 6 months | 專案封存機制 | update log | **Qualified** | Lifecycle, undesigned |
| Project sharing, read-only or edit | 專案共享 | update log · platform `19` | **The permissions model is not for this buyer** | Seats and roles are enterprise shape |

**Filing alerts carry the subscription.** Recorded as the strongest recurring-value feature in the
engine. Without it a founder searches, gets an answer, and has no reason to return next month —
which leaves a subscription with no rationale beyond re-running searches. That 專案更新通知 already
ships makes this materially cheaper than we had assumed.

**On sharing: what this cuts is the model, not the idea.** Founders share by link or not at all, and
a single read-only link is what [platform.md](platform.md) §7a.8 proposes — no seats, no roles, no
read-versus-edit.

### 4.F · Classification and coverage

| Capability | 中文 | Source | Appeal | Reads as |
| --- | --- | --- | --- | --- |
| IPC classification | — | blog · platform `12` `13` `25` | **High, in a narrow role** | A *confidence signal*, never a label a founder reads |
| Database scale | 100+ countries · 180M records | product page · platform `30` | **High, unverified for our market** | The coverage claim is the product's foundation |
| CPC classification search | CPC | update log · platform `24` | **Qualified** | A third classification system, in the T-Map sidebar |
| EU / JP / CN English abstract backfill | 歐盟核准摘要 · 日本核准摘要 · 大陸專利英文摘要 | update log | **Qualified** | English coverage of the *data* is a separate problem from the chrome |
| UPC classification | UPC | platform `14` | **Not for this buyer** | A second cross-tab system we had never catalogued |
| Patent search database (sibling product) | WEBPAT 專利檢索資料庫 | product page | **Not for this buyer** | A list of results cannot show a founder where each holder sits. §5.1 |

**IPC is the only part of the pipeline that is not AI-generated** — the patent office assigned it —
which makes it the one available check on a system that otherwise infers everything from a sentence.
Screens `12` and `13` show it exposed with depth selectable to level 4, so **the depth exists.**
What remains open is whether it is reachable outside your UI.

**One number attaches to the coverage claim for the first time.** The platform gives a jurisdiction
split — on the set we opened, roughly **three US filings for every ten Taiwanese ones**, with a long
tail of single filings across five further countries. The scope of that project is unknown, so this
does not demonstrate thin US coverage; it means the coverage claim now has a shape beside it rather
than only a claim.

### 4.G · Analyst labour and output

| Capability | 中文 | Source | Appeal | Reads as |
| --- | --- | --- | --- | --- |
| Classification workbench | 分類通 · `Hierarchy` | platform `25` | **Not for this buyer** | **The clearest statement of what Terrain automates.** See below |
| Auto-generated reports | 專利報告 | product page · platform `30` | **Not for this buyer** | Terrain is software, not a report |
| Export history | 匯出紀錄 | changelog | **Not for this buyer** | There is no export in v1 |
| Full boolean search | — | product page · platform `01` | **Not for this buyer** | A query language is the specific skill a founder does not have |
| Inventor-level analysis | — | platform `10` | **Not for this buyer** | A founder competes with companies, not with named engineers |
| EN→ZH translation | — | changelog | **Not for this buyer** | Terrain is English-only by decision |

**`Hierarchy` is the most important row here, and it was missing from this inventory entirely.** It
is a top-level destination in your own navigation and appears in no marketing we audited. Screen `25`
shows the 技術 tree with per-branch counts, the patent list, a per-patent 分類相似度 score, an
`AI Sort` control — and a **Recycle Bin** holding what did not fit. An analyst builds the taxonomy,
assigns patents by hand, and bins the rest: at the scale our illustrative set models, **41 of
roughly 158 binned**, leaving 117 in scope.

**That is the work Terrain exists to remove, not a feature to match.** Every other cut here removes
something a founder would not use; this one removes a *job*, and it is the clearest answer to *what
does Terrain do that IPtech does not*. And it leaves one thing open: **Terrain has no analyst to do
that discarding.**

**Two cuts are confirmed by their own screens.** `30` is not a document viewer but a configuration
screen — twelve settings and four entity pickers before anything is produced. And `01` opens with a
query field instructing that *logical symbols must be capitalized*, which is the clearest available
statement of who the interface expects.

### 4.H · The analysis menu, read by tier

**Added 2026-09-04, and this subsection replaces a single row.** Everything above was read from
Innovue's public marketing in the 2026-08-31 audit. This one block is different: it is the
`M-Map` and `T-Map` navigation walked entry by entry from inside the platform, so Innovue can
check every line of it against their own screen in about a minute. It is here as a separate
subsection rather than as more rows in §4.C because it is a different kind of evidence — a
complete enumeration of a live menu, not a capability claim with a source tag.

**The count.** Eight top-level destinations. Under `M-Map` and `T-Map`, eleven dimension groups —
the four classification systems share one row below but are four groups in the menu:

| Group | Entries | Under |
| --- | --- | --- |
| Company | 17 | both |
| Patent Count | 3 | both |
| Country | 7 | both |
| Legal Status | 3 | both |
| Patent Country | 7 | both |
| Inventor | 4 | both |
| Examiner | 3 | both |
| IPC · UPC · CPC · LOC | 4 each = 16 | both |
| **Shared subtotal** | **60** | |
| **Tech-Effx** | **8** | **T-Map only** |

**M-Map 60 · T-Map 68 · 128 menu entries.** Innovue's own marketing says "126 charts"; walking the
menus gives 128. The eleven shared groups are identical under both maps — same items, same order,
one label difference (`Patent Count - Life Cycle` under M-Map, `Life Cycle` under T-Map).

**The count is 68, and we settled it ourselves rather than asking you.** `Company - Count` captured
under `M-Map` and then under `T-Map`, same project, nothing else changed: identical title, charts,
companies, values, tables and totals. The only difference is a `Classification` scope field which,
left empty, renders the `M-Map` result exactly.

**So `T-Map` is not a second analysis engine. It is `M-Map` plus a classification filter, with the
eight `Tech-Effx` entries on top** — 60 shared entries are one analysis reachable two ways. Screens
`26` and `27`.

**The tiers below sort all 68 T-Map entries — the union, counting each shared entry once.**

#### Tier 1 — founder-facing: 15 of 68

| Entry | Group | Map | The founder question it answers |
| --- | --- | --- | --- |
| Matrix | Tech-Effx | T-Map only | On its `Company` cut, Terrain's hero view — §5.1 |
| Company | Tech-Effx | T-Map only | Who occupies which cell |
| 1D Matrix | Tech-Effx | T-Map only | The simplest usable form of the map |
| Company Trend | Tech-Effx | T-Map only | Who is moving into which cell, over time |
| Count | Company | both | Who else is here |
| Trend | Company | both | How each rival is moving |
| Share | Company | both | How concentrated is this space |
| Cross Reference | Company | both | Who is following whom |
| Activity | Company | both | Is this rival still active |
| Ranking | Company | both | Who is *arriving* — the before/after split |
| Trend | Patent Count | both | How the whole space is moving |
| Patent Count - Life Cycle | Patent Count | both | **Is this space early or late** |
| Patent-Legal Status | Legal Status | both | Live or expired |
| Company-Legal Status | Legal Status | both | Which rivals hold *live* patents |
| Distribution | Country | both | Is the US contested |

**`Patent Count - Life Cycle` is the find of this pass**, and it appears nowhere in §4.A–§4.G
because the marketing audit never surfaced it. It answers *is this space early or late* — arguably
the second-most important question a founder has after *who else is here*. It is a phase-space
trajectory, not a time series: patents on Y, assignee count on X, one point per year, connected
chronologically, and read by quadrant. It ships as two of them side by side, by assignee count and
by inventor count. **It should be assessed as a candidate view, not merely catalogued.**

#### Tier 2 — real, but analyst-shaped: 7 of 68

| Entry | Group | Why it is qualified |
| --- | --- | --- |
| Research Ability | Company | A composite score. Meaningful to an analyst who knows its inputs; unreadable as a number to a founder. |
| Citation | Company | Citation weight is a real influence signal, but it needs explaining before it means anything. |
| Citation | Patent Count | Same, at the corpus level. |
| Trend | Country | Useful only once the founder has a reason to care about a second jurisdiction. |
| Share | Country | As above. Terrain answers *is the US contested* with `Distribution` alone. |
| Country-Legal Status | Legal Status | Jurisdiction-by-jurisdiction status is a filing-strategy question, which is counsel's, not ours. |
| (Main) IPC - Distribution | IPC | **Internal only.** IPC is the one part of the pipeline a patent office assigned rather than an AI inferred, which makes it the available check on a system that otherwise infers everything from a sentence. It is a confidence signal we read, never a label the founder sees. |

#### Tier 3 — not for this buyer: 46 of 68

Grouped by the reason each is cut, because the reasons are few and they repeat.

| Reason | Entries | Count |
| --- | --- | --- |
| **Classification cross-tabs** — a two-way table of company or country against a patent-office code. The output is only legible to someone who reads the codes. | `Company - Project/Company (M)-IPC · UPC · CPC · LOC` (8); `Country - Country / (M)IPC · UPC · CPC · LOC` (4) | 12 |
| **The classification groups themselves** — distribution and trend *of the codes*, which is taxonomy analysis, not market analysis. | `IPC` (3 remaining) · `UPC` (4) · `CPC` (4) · `LOC` (4) | 15 |
| **Duplication** — `Patent Country` re-runs `Country` against a different date field. One of the two is enough, and neither is Tier 1 beyond `Distribution`. | the whole `Patent Country` group | 7 |
| **Wrong profession** — founders do not hire by inventor, and examiner analysis is prosecution strategy: it helps you argue with the patent office, which is something a founder pays an attorney to do. | `Inventor` (4) · `Examiner` (3) · `Company - Inventor Activity` (1) | 8 |
| **Tech-Effx by the wrong axis** — the matrix is powerful sliced by company; sliced by inventor or country it answers a question this buyer does not have. | `Tech-Effx - Country · Inventor · Country Trend · Inventor Trend` | 4 |

**This is where "126 charts is 126 decisions a founder cannot make" stops being a quip and becomes
arithmetic.** Forty-six of sixty-eight — just over two thirds of the menu — is built for a
profession the founder is not in. That is not a criticism of IPtech. It is the correct menu for the
buyer IPtech has, and it is the clearest statement available of why the same engine needs a
different surface for a different one.

> **What these tiers are not: a v1 scope list.** They rate *founder relevance*, exactly as the
> High / Qualified / Not-for-this-buyer ratings above do — and on the same terms, something can be
> Tier 1 and still deferred. `Tech-Effx - Company Trend` is Tier 1 and is not in v1. What gets
> built, and in what order, is `platform.md`.

### The eighteen, and where each one actually is

The question this inventory invites is the obvious one: *eighteen are rated High, so why can I not
see eighteen things in the product?* The honest answer is that most of them are there and five of
them are invisible on purpose.

| State | Count | Which |
| --- | --- | --- |
| **On screen** | 8 | The composer · the one-line summary · rivals · the matrix · the three density states · the drill-down · competitive analysis · filings over time |
| **Hidden by design** | 5 | AI魚骨 · AI分類Pro · 同族合併 · the six merge toggles · IPC |
| **Blocked** | 1 | 法律狀態 — the column exists and holds a grey bar, because we hold no legal status for this project and inventing one is the act our own contract forbids |
| **Not in v1** | 3 | 專利預警 · 專案更新通知 · 一鍵搞定專案更新 |
| **Not a surface** | 1 | Database scale — it is the ground the product stands on |

**Thirteen of the eighteen are working in the product today, and five of those thirteen cannot be
seen.** That is not a shortfall. A fishbone diagram, a family-merge setting and an IPC label are all
things that would make this product worse if a founder met them, and the five *invisible* rows are
the ones doing the most work. Only four rows are genuinely absent — three by our choice of a small
v1, and one on what is reachable outside your interface.

Which is the same sentence both readings converge on, now with arithmetic under it. **The product is
as much what is hidden as what is shown.**

---

## 5 · What Terrain therefore is

Three things carry it. Everything else is subordinate.

### 5.1 · The map — `T-Map › Tech-Effx › Company`

**The most valuable artifact in the engine for this buyer**, and the hardest for a founder to
reach. **Columns are technical approaches**, generated from the founder's own sentence over what
the search returned. **Rows are the holders**, largest first. Each cell counts the patents at that
intersection — *this company, filing against this approach* — deduplicated by family.

**It is your grid, on a cut you already ship.** `Tech-Effx › Matrix` is 技術 × 功效; `Tech-Effx ›
Company` is technology × `Assignee`, with the Y axis fixed and X still the selectable class. Terrain
takes the second. **One engine call with a different Y, and nothing new to build.**

**Why it is the hero, and why a results list cannot substitute for it.** Three reasons, and each is
a claim about this grid rather than about charts in general:

- **It is the only artifact that carries two dimensions at once.** A rivals table is a list of
  holders; a trend chart is a series over time; a lineage table is a list of patents. Each answers
  *who* or *when* separately. **Only the grid answers *where each holder is*** — and a founder
  asking *who else is here* has not been answered until they know which part of the space each
  rival occupies. That is a claim about the **join**, and no list can make it.
- **It is the only view shaped by the founder's own sentence.** Everything else in the product is
  computable from bibliographic fields over any result set. The columns come from what this
  founder described.
- **It is the only view that answers *what is adjacent to mine*.** Reading across the columns is
  how a founder finds the technology they did not know to look for. Nothing else in the product
  does that at all.

Reaching it in IPtech takes work a founder cannot do. The menu reads as a linear sequence, but the
route jumps between destinations and opens new browser tabs along the way, and the analyst supplies
the classification before any of it runs.

**Three constraints travel with it permanently, and all three are stated in the interface.**

- **The map shows who is where; it cannot say why anyone is absent.** An empty cell means *this
  holder has not filed against this approach*, and that is either an opening or a sign they tried
  it and stopped. Terrain never implies which.
- **An empty cell is not open ground.** One company's absence is one company's absence. The
  legend is a **density scale** — *fewer → more filings* — plus a hatch for *rising*, and it
  carries no state names at all, because a word like *open* on a holder's row would be the
  interface answering a question the data cannot.
- **The map lays out the largest holders, not all of them, and it says so on the card.** Its cells
  therefore sum to less than the number of patents in scope, and the card reconciles the two in a
  sentence rather than leaving a reader to notice.

**And the fragmentation is often the finding.** In the illustrative set no cell exceeds 5 against a
scope of 124. *No holder owns any approach here* is the single most useful sentence this widget can
give a founder, and it is only visible because the density bands are computed against this grid's
own maximum rather than against a fixed scale.

**One divergence from your rendering, and it is deliberate.** IPtech draws each cell as a sized,
colour-scaled bubble with the count beneath. Terrain fills the cell instead. A bubble encodes
magnitude by area, which is the least accurately-read visual channel available, and it leaves the
cell's own boundary unmarked so an empty cell and a low cell look alike. **A filled cell reads as a
region of a map**, which is what this widget claims to be.

### 5.2 · The chain, run end to end from one sentence

AI檢索Pro → AI魚骨 → AI分類Pro → 矩陣. Each link is already automated. **Nobody has run them end to
end off a founder's own words.**

### 5.3 · The hygiene layer — 名稱統一 · 同族合併 · 法律狀態

Invisible, unglamorous, and the difference between a rivals list that is true and one that is
confidently wrong in a way the founder cannot detect. Both halves are observed rather than argued,
on one dataset inside the platform — a Taiwanese hardware manufacturer, roughly 2,400 patents, top
five assignees.

**Name unification exists, and it is off by default.** With `Applicant/Assignee Merge` unlit, the
ranking table lists one holder as four near-identical rows totalling **130 patents, not 61**, and
another as five. An analyst knows to press the toggle. A founder does not know there is a toggle.

**Legal status sits one menu item away, and it inverts the answer.** `Company - Legal Status` gives
a valid/overdue breakdown for the same top five:

| Holder | Valid | Overdue | Overdue rate |
| --- | --- | --- | --- |
| The dataset owner | 268 | 4 | 1.5% |
| Second-ranked holder | 43 | 121 | 73.8% |
| Third-ranked holder | 0 | 61 | **100%** |
| Fourth-ranked holder | 25 | 32 | 56.1% |
| Fifth-ranked holder | 0 | 54 | **100%** |

*Rates are the observed ones; the holders are not named, per §6.5.*

**Two of the five hold no live patents at all** — yet the views a founder reaches first rank on raw
patent count, and put the third-ranked holder at the top. Read there, it is the incumbent to worry
about. Read one menu item away, its entire position is expired, which in practice means that
technology is **free for the founder to use.** An analyst cross-references the two as routine; a
founder reads the first chart and stops.

**That is why live-or-expired is one of the four fields on every evidence row in Terrain, and why it
sits inside the rivals view rather than beside it** — not because it saves a click, but because the
answer is wrong without it.

> **IPtech sells knowledge to patent professionals. Terrain is for startups.** Terrain takes
> specific capabilities that already exist in IPtech and repackages them for that audience.

---

## 6 · What it looks like

> **Part 2 of the argument.** §4 is a reading of which capabilities matter to a founder; this is what
> the interface has to be **if that reading is right**. It is a design pass, not a specification —
> the full component-level record is in [design-language.md](design-language.md), and a working,
> clickable version is
> [the prototype on the second tab](#p-tab).

### 6.1 · Two surfaces, and a session that never leaves the page

IPtech's shape is a pipeline the user walks, and in the platform it is also a place you leave — the
menu reads as a linear sequence, but the route to an analysis jumps between destinations and opens
new browser tabs along the way. **Terrain has two surfaces.** A third, about what runs have cost,
is a destination nobody has to visit.

| Surface | The founder's moment | What is on screen |
| --- | --- | --- |
| **Conversation** | Describe the idea · answer five questions · approve how it was read | One composer under one question — *"What are you building?"* No filters, no query syntax, no advanced panel. The questions and the reading arrive as turns in the same thread. |
| **The working surface** | Everything after that, including every return visit | The patents the search found down the left, ranked and already selected. Every view of them on the right, map first. Click a cell and the list narrows to it; click a patent and its record comes over the views. |
| *The points page* | A destination, never a step | What runs have cost. Reached from the balance in the masthead. |

Four rules hold that shape together, and all four are testable rather than decorative:

- **Chat is the means, not a place.** Before a map exists it is the whole screen; once one exists
  it is a control in the masthead that opens a panel. One composer at two sizes — never two things
  that merely resemble each other.
- **The session is one tab and one screen.** What IPtech splits across two menus and a new browser
  window arrives as one pane of views beside one list. There is nothing to navigate between and
  nothing to come back from.
- **Nothing runs until the founder approves how we read the idea.** After the first sentence and
  five short questions, Terrain says back what it understood — the sentence, the answers, and
  anything they asked to leave out — and waits. **This is the only place a misreading is cheap to
  fix**, and it gates because a wrong reading here poisons every view equally and invisibly.
- **The corpus is visible, and it never hides.** The list on the left *is* what the views are drawn
  over — **all of it**. There is nothing to select and nothing to approve, so the default path is
  zero clicks and there is no wrong way to take it. The founder can sort it, filter it, or star a
  patent to re-rank the rest around it; none of those changes what the views count, and the list
  says so. The map carries a standing note of what it was built on — *built on 124 of 162 matched*.
  **A cell that is empty because of that cut must never look like a cell that is empty because
  nobody filed**, which is why the note is standing rather than a hint.

  *An analyst working in `Hierarchy` assigns by hand and bins what does not fit — at the scale our
  illustrative set models, 41 of roughly 158. **We have no analyst to do that discarding**, so the
  founder can, in the open, without it ever being a step.*

The words *fishbone*, *node*, *taxonomy* and *classification* appear nowhere in the interface.

### 6.2 · Every element, and the capability behind it

This is the table that joins the first two parts. Left column is what a founder sees; right column is
the §4 capability that has to be there for it to exist.

| On screen | Powered by | Notes |
| --- | --- | --- |
| *"What are you building?"* — one composer | AI檢索Pro | The only entry point, and there is no boolean field anywhere in the product. It accepts **a sentence, a patent number, a company or a classification code** — your five search tabs folded into one field, with the sentence as the demonstrated path and the rest offered *if you have one*. |
| Five narrowing questions, one per turn, answered in the thread | AI檢索Pro · `探索方向` · `資料來源` · `回傳筆數` | *Which of these is closest to what you mean · is this hardware or software · where does this need to hold · granted or applications · how many patents should I bring back.* **Four of the five are your own controls**, asked in words instead of set in a panel. One sentence against 180M records is a wide net; these narrow it without a filter rail. Every one is answerable by someone who has never read a patent, and every one can be declined. |
| *"Here is how I read that"* — the sentence, the five answers, and anything excluded, with one action under it | — | **The gate.** Nothing is searched until it is taken. It is the only correction point in the product, which is why it is a step and not a banner. |
| **The list** — what the search found, ranked | AI排序 · 關聯性排序 · AI分類Pro | On screen from that moment and never left. **Every patent it returns feeds every view** — there is nothing to select and nothing to approve. Twenty to a page; reading further never changes what the views count. |
| Sort and filter on the list | — | Relevance, newest, oldest; live or expired; kind. **Both change what the founder is looking at, neither changes what the views count** — which is the whole reason the list can sit permanently beside the map without becoming a curation tool. Computed client-side over data already sent. |
| The relevance score, top right of each row, labelled | 分數 | **Yours, printed rather than removed, and placed where you place it.** An ordering the engine computed, not a reading Terrain authored — which is why the only word beside it is **Score**, your own 分數 in English. *Strong match*, *best fit* and *most relevant* are readings, and they stay out. |
| The star — *more like this one* — and the prompt it raises | AI排序 · 關聯性排序 | Star a patent and the list offers to order the rest around it. Optional, and most founders will not need it. **This is the one element that asks for a capability we could not confirm you have** — ranking a set against a supplied patent. If you do not, the list survives and the star comes out. |
| Six skeletons becoming six views, in place | AI分類Pro | On creation and after a confirmed scope change only. Never on a return visit, or it becomes a loading screen the founder watches daily. |
| The `Market` / `Technology` toggle over the views | — | **Your own split, read off your own menu.** `Technology` is the map, because `Tech-Effx › Company` is the one destination reachable under `T-Map` and not under `M-Map`. `Market` is the other five and it lands. |
| **The map** — technology across, holders down, a count per cell | `Tech-Effx › Company` · 同族合併 · **`Applicant/Assignee Merge`** | Counts are family-merged, so one invention filed in nine countries counts once. **And the assignee merge has to be on**, or one company is five rows of the grid. |
| The map's caption — two or three plain sentences naming what the grid shows | generated | The view's *finding*, on the card. Not chart literacy homework. |
| A cell click — the list narrows to that intersection | — | The chip above the list names it and removes it. The views do not change: filtering is a way of looking at the corpus, not a way of cutting it. |
| **Filings over time** — filings per year in scope | 宏觀趨勢分析 | Directly under the map, because your own `M-Map` opens on this. The most recent ~18 months is hatched and labelled *Not yet published*. |
| **Rivals** — company, count in scope, closest cells, most recent filing | 競合分析 · 名稱統一 · 同族合併 | Recency is surfaced separately from count: a rival who stopped filing in 2019 is a different fact. A row click narrows the list, the same act a cell click performs. |
| **Where it is filed** — the jurisdiction split | `Country › Distribution` | Share of the result set, not of a selected five. The caption states the US share in a sentence. |
| **Live and expired** — how much of the crowd is enforceable | 法律狀態 | An expired patent is prior art rather than an obstacle. Blocked on one answer; the shape is drawn. |
| **Lineage** — the three to five most-cited patents, holder and date | 技術脈絡分析 | Reduced deliberately. **Not a network graph** — a citation graph is noise to this user. |
| A patent opened — its record over the views, with the map still visible behind it | 法律狀態 · IPC · 申請號 · 主 IPC · 申請人 · 發明人 | Eleven identifiers, the abstract and the claims **as published**. No highlighting, no decode — Terrain renders the record, not a reading of it. The five identifiers counsel needs are a subset, so the **handoff to your attorney** is the same object. |
| History — every confirmed scope change as a labelled, revertible version | — | *"removed plastic propellers"*. A chat log is not something a founder can reason about; a list of decisions is. |

**The map is the product; the patents are evidence.** Evidence has to be legible, not explorable —
which is why the row carries four fields and no more, and why opening one gives you the record
rather than a place to explore.

### 6.4 · What is deliberately absent

The design pass is as much a list of removals as additions, and each removal is a decision from §4
rather than a gap:

- **No boolean search box.** A query language is the specific skill this user does not have.
- **No report, no export, no download.** Terrain is software, not a document. A founder still has
  people to convince — funders, the institution backing them, a co-founder, a grant committee — so
  **there must be an artifact and it must not be a report.** What it is remains genuinely open:
  [platform.md](platform.md) §7a.8.
- **No fishbone diagram**, no 技術定義表, no visible taxonomy.
- **No chart picker.** 126 charts is 126 decisions a founder cannot make. Six views, in one order,
  chosen for the founder. The cluster, positioning and honeycomb charts are real and there is
  nowhere in this product to put them.
- **No verdict on any patent.** The record is shown as published, claims included. What is absent
  is every reading of it — no decode, no highlighting, and no word about quality beside the score.
  Whether a patent affects you is a legal question and it is counsel's to answer.
- **No zones on the map, and no word for an empty cell.** The legend is a density scale and a hatch
  for *rising*. A cell on the holder axis is one company's absence, and calling that *open* would
  be the interface making a claim the data does not support.
- **No accent colour, and no green.** Terrain's own colour appears in exactly three places —
  discrete states, direction of change on a delta pill, and the chart layers — and it encodes
  **direction, never desirability.** A green cell would tell a founder something about a competitor
  that the count does not say. Every coloured element also carries a word or a shape; never colour
  alone. Primary actions are near-black; **there is still no accent.**

  *One colour on screen is not ours: Innovue's mark, in Innovue's blue, on the attribution line. It
  is your brand reproduced as issued rather than a hue we have chosen, and it is the only place the
  rule above admits an exception.*

Two typefaces, both self-hosted: **Urbanist** for text, **Inconsolata** for every number on screen.
Interface language is English only, natively — not translated.

**Both appearances.** The interface runs light and dark, following the founder's system by default
with an explicit control in the masthead. The dark theme is not an inversion of the light one: the
card-versus-page contrast that carries the light theme nearly disappears, hairlines take over the
separating, and the three state colours are re-chosen against a dark ground rather than lightened —
a sage, an oxblood and a dull gold. Every contrast ratio in both themes is measured rather than
assumed.

### 6.5 · The honest status of the prototype

The prototype is a real, clickable build of every surface — the conversation, the working surface
with its list and its six views across the two pages, the record, and the points page — running on
a deliberate contract:

> **Chrome is real. Identities stay bars. Figures are illustrative.**

*One row is the exception, added 2026-09-10 so the surface can be read with words on it: the first
patent in the list carries a real title, status, date and score. **No real holder is named** — that is
the half of the contract that does not bend, because a company we transliterated would be
fabrication and a plausible invention would read as a live example. The holder on that row is
**ACME Group**, which is neither: being unmistakably fictional is the whole reason it is usable.*

It ships showing an **illustrative set**: 124 patents in scope out of 162 matched, an 8×8 grid of
technologies against the eight largest holders, and a jurisdiction split. **The figures are modelled on a project we opened inside IPtech, whose data is not ours
to publish** — the distribution is representative, the arithmetic is internally consistent, and no
number is a real filing count. Every label, caption, legend and empty state is the real English a
founder would read.

**What stays a grey bar is what the prototype does not name** — holder names, because naming real
parties is not ours to do and inventing one would read as a live example, and project names, dates
and version strings for the same reason. So the Rivals card shows a count beside a grey bar: the
chrome is English and the identity is withheld.

***That rule now reaches the hero widget, and it is worth being plain about it.*** The map's rows
are holders, so **the whole left axis of the prototype's most important view is skeleton bars.** In
the product they are company names. This is a constraint on what we may publish and not a design
decision — but it does mean the prototype understates the map: a founder reading it sees eight
named competitors laid out against eight approaches, where a reviewer of this document sees eight
grey bars.

Two shapes are drawn rather than barred, and only because a flat rendering would show nothing at
all: the matrix's density tone, and the curve on the filings chart. Neither carries a value. A tone
is not a count, and an unlabelled curve is not a year.

---

## 7 · How we are building it

Five practices, each evidenced by something that exists in the working folder today rather than by a
process claim.

1. **Decisions settle in writing before anything is rendered.** `docs/` is the source of truth; a
   prototype is a view of it. A design file is never allowed to become the only record of a
   decision.
2. **Every capability claim carries a source tag** — as in §4 above. This exists to prevent a
   marketing number quietly becoming a product assumption.
3. **Scope is deferred explicitly, in writing, with the reasoning preserved.** There is a standing
   list of things deliberately not in v1, governed by a rule that forbids designing against them
   without naming them. The point is that v1 stays small and that decisions are not re-argued every
   session.
4. **The design language is derived and verified, not asserted.** Tokens read off reference screens;
   typefaces verified rendering. One constraint is worth stating to an external reader because it
   follows directly from §5.1: **colour encodes direction, never desirability.** No green-means-good
   anywhere — the map's tone is one holder's count against one approach, and a red-to-green ramp
   over that would be the interface grading a competitor.
5. **Where we are today: one working interactive prototype, and no application code.** Nothing has
   been built that the answers in §8 and §9 could invalidate. That is deliberate, and it is why
   these questions are being asked now rather than after a build.

---

## 8 · The two questions

> **Part 3 starts here.** §8 is what we are asking; §9 is the full set of fifty-three
> questions that are blocked until it is answered. Both are open-ended on purpose — we are asking what
> is possible, not proposing terms.

### 8.1 · To both audiences — what are we missing?

§4 and §5 are our best current reading of what a US founder needs and what Terrain should therefore
contain. Two specific challenges are more useful to us than general agreement:

- **Which capability marked *Not for this buyer* would you argue a founder does need?** §4.D is the
  block we are least certain about — a founder who is worried about a specific patent and can see
  nothing about it may go looking elsewhere, in a worse experience we do not control.
- **Which capability marked *High* would you argue does not survive contact with real US data?**
  Innovue knows the data's edges far better than we do.

### 8.2 · To Innovue — can a separate portal be built on what IPtech has today?

**We understand a public API may not be the preferred path, and that cost is the reason. What
follows takes that as given rather than arguing with it.**

The question is therefore narrower and, we hope, cheaper: **based on what is currently available in
IPtech, can a separate English, startup-facing portal be built?** Same engine, same database, same
capabilities — a different front door, in a different language, for a different person.

Three sub-questions, so it is answerable rather than rhetorical:

1. **What does "currently available" actually permit?** A themed or white-labelled instance; a
   restricted feature set on the existing interface; or a new front end built against internal
   services. These are very different amounts of work and we do not know which is realistic.
2. **What is the English state of the underlying data, as distinct from the interface chrome?**
   **Partly answered by our own look at the platform, 2026-09-02:** the chrome is already largely
   English, and it is the *data* that is not — applicant names render untranslated, and at least one
   Chinese column header survives in an English table (§3.4). §4.F records EU / JP / CN English
   abstract backfill already shipping. So the question narrows usefully: **what would it take to
   finish the English rather than start it**, and is the data layer separable from the chrome?
3. **What does the cost objection attach to?** Per-call compute, licensing terms, or engineering
   time. Each points at a different answer, and one of them may be considerably cheaper than the
   others. **One observation that may narrow this:** the platform meters usage in **points**, and a
   matrix run visibly decrements the balance by a small fixed amount. If consumption is already
   credit-metered per analysis, the per-run cost is a known quantity on your side, and a portal
   could inherit the same meter rather than needing a new commercial model.

---

## 9 · What is blocked until this is answered

**Fifty-three live questions, in nine groups, ordered by how much each blocks.** *Was thirty-nine in
eight until 2026-09-08, when Innovue's own semantic search surface added eleven — and moved the
first question on the list, because §9.41 now sits ahead of §9.1. §9.52 was added 2026-09-09, and it
is the only question here raised by a design decision rather than by a screen. Four arrived on
2026-09-10 and two were retired on the same day.* **Nothing here is a
request for new capability** — every
one asks what already exists and in what form. Each says what stops working in §6 if the answer is
no, so that a "no" is as useful to us as a "yes".

**This is the whole list.** Anything else that carries a subset of it uses these numbers; where it
and this section differ, **this section wins**.

**The numbering is append-only and one number is struck rather than reused**, because §9.n here and
§10.n in [platform.md](platform.md) are the same question and both are cited by number elsewhere.

**Blocking everything — the product does not exist in this form without these two:**

1. **Is any of this available programmatically, in any form?** Terrain cannot be built on a
   login-walled third-party interface, whatever language it is in. §8.2 is the softened version of
   this question, and it is the one we would rather you answer.
2. ~~**Can the function axis (功效) be generated automatically, and how good is it?**~~
   **Retired 2026-09-10 — it stopped applying, and it was not answered.** Terrain's map is your
   `Tech-Effx › Company` cut: technology across, **holders down the rows**, read straight off the
   patents. Nothing in the product consumes a 功效 scheme any more, so the question we called the
   highest product risk in the build has no product behind it.

   **What carries that risk now, because a retired question with no successor reads as a risk we
   stopped tracking.** The **technology** axis is still generated, and everything this question
   worried about transfers to it: **§9.43** (what generates the `探索方向` candidates), **§9.44**
   (is the query-generated structure the same one the matrix consumes) and **§9.52** (can it be
   computed over a set we hand you). Those three are the successor, and §0.5 now leads on the
   second and third of them.

   *One thing learned before it was retired is worth keeping.* Half of it had already answered
   itself from your own screens: the semantic search surface generates the technology structure
   from one sentence in about two seconds, so *an analyst hand-writes both axes* was no longer
   true of that axis. And 功效 is plainly a real scheme rather than something anyone would have to
   invent — `Tech-Effx` offers `XClass` and `YClass` as separate dropdowns. **So the scheme is
   there if we ever want a second cut of the grid; what is gone is the requirement.**

   *The number is retained rather than reused, because §9.n here and §10.n in
   [platform.md](platform.md) are the same question and both are cited by number elsewhere.*

**Blocking the quality of the answer rather than its availability — the pipeline can be reachable
and still not be good enough. Two of the three are specifically about the US.** Numbered to match
[platform.md](platform.md) §10 exactly, so §9.n here and §10.n there are the same question:

3. **How good is the AI fishbone actually?** Innovue's own blog contradicts itself: 專利布局分析大解密
   EP7 argues *against* AI classification and cites a case where AI-selected patents were 20%
   accurate, while 專利分析實操 EP41 sells AI魚骨 and AI分類Pro doing exactly that. Which position is
   current? This decides how much work the confirm card (§6.1) has to do.
4. **Does 名稱統一 cover US startups?** The stated coverage is 1,800+ Taiwanese listed and academic
   entities plus 1,000+ large international names. US seed-stage companies are exactly what such a
   list would miss, and exactly the competitors this audience most needs deduplicated correctly.
   **The rivals view could work perfectly for DJI and fail completely for a YC company**, and the
   founder would have no way to notice. Not hypothetical: §4.B has the evidence, and the strongest
   part of it is that one *Taiwanese* company — inside the coverage described as strongest — splits
   across five rows totalling 163 patents.
5. **US patent depth and lag** within the 100+ countries / 180M records claim. The coverage claim is
   the product's foundation and we have not verified it for our market.

**Blocking specific elements of §6:**

6. **Is IPC data exposed, and at what depth** — full symbol, or class only? It is the only part of
   the pipeline that is not AI-generated, so it is the one available check on a system that infers
   everything else from a sentence. It also carries the handoff row in §6.2.
7. **Is legal status (法律狀態) available per patent in bulk**, or only inside your UI? §6.2 puts
   *live or expired* on every drill-down row — one word, and the most decision-relevant fact a US
   founder gets from the product.
8. **Latency, and one specific thing about the unit cost.** This determines whether
   confirm-before-apply is a nicety or a necessity, and it bears directly on what a subscription can
   be priced at.

   **We can now read the point cost of a run off our own account screen, so the open question has
   narrowed to one.** The point-usage page prints an estimated remaining-uses figure per module,
   which is the balance divided by the unit price — so the price list inverts out of it:
   `檢索通` 2 · `分類通` 2 · `速讀通` 1 · `閱讀通` 4 · `價值通` 4 · `魚骨通` 10 · `洞察通` 5 ·
   `快檢通` 10. It reconciles twice: the eight module spends sum exactly to the balance drawn down,
   and every estimate is an exact integer division. *The balances themselves are our account's
   billing telemetry and are not reproduced here.*

   **What we cannot tell is the one thing that decides the economics.** `分類通` is much the largest
   line on that account, and dividing its spend by the 2-point unit gives a number of units no
   plausible number of *projects* could reach — so we read the unit as **per record classified rather
   than per run**. If that is right, the cost of building a map is a function of how many patents the
   founder keeps, and the approval gate in §6.1 is a cost control as well as an accuracy one — which
   is a materially different pricing problem from a flat per-run one.

   **So: is `分類通` metered per run or per record, and what is a point worth in currency?** The
   second half is still entirely yours to answer.
9. **Is 專利預警 available programmatically?** Filing alerts are the strongest recurring-value feature
   in the engine, and 專案更新通知 already ships — which may make this considerably cheaper than we
   have assumed. Without it, v1 has no subscription rationale beyond re-running searches.
10. **Licensing terms for reselling into a self-serve, English-language SaaS.**
11. **Is AI速讀Pro available in bulk** — one plain-English line per patent across a whole result set,
    rather than one patent at a time? Without it the drill-down degrades into a list of titles.
    *Last by number, not by weight — in blocking order it sits with 7.*
12. ~~**Do the 60 shared entries render differently under `M-Map` than under `T-Map`?**~~
    **Withdrawn — we answered it ourselves; §4.H has the method.** The number is struck rather than
    reused, because both question lists are append-only.

**Two we owe you, because we identified them by inference rather than by seeing them confirmed.**
Both are cited in our own ledger as the thing that would settle a row, so they are questions we have
already committed to asking.

13. ~~**Do the three zones — 地雷區 · 新興區 · 處女地帶 — exist in the product, or does an analyst
    paint them?**~~ **Retired 2026-09-10 — Terrain does not render zones.** The map's legend is a
    density scale and a hatch for *rising*, with no state names on it, because our rows are holders
    and one company's empty cell is not open ground. Whether IPtech has the zones decides nothing
    for either of us now.

    *We asked it for six days because our own inventory listed the zones as something Terrain
    takes from you, the populated matrix showed none of them, and we were not willing to conclude
    from that absence. **We never did conclude** — the row was cut for a reason about our own
    product instead.* §4.C.

    *The number is retained rather than reused.*

14. **Is the toolbar's `Switch To Ai Insight` the same capability as 技術脈絡分析?** Its own text uses
    the term for what it produced, which is our reading of screen `28` and not your confirmation —
    §4.C has what it produces. It matters because §6.2's Lineage ships a most-cited table with this
    recorded as the better candidate, and we would rather compare against the real thing.

**Raised by building the interface.** Each of these came from a component we could specify but could
not say what data it needed. A design that cannot name its input is not finished, so these are
questions rather than assumptions. The full mapping — every component, the data shape it needs, and
the capability behind it — is `design/components.md`.

15. **Does 同族合併 travel with every result set the engine returns?** This was the one claim in §6.2
    we carried without a question against it, and the omission was deliberate: we assumed family
    merge is inseparable from any count. **If that assumption is wrong it is the most severe question on this
    list.** One invention filed in nine countries counting nine times does not make the map slightly
    wrong; it makes *dense* and *empty* stop meaning anything, and a founder has no way to detect it.
16. **Is publication lag a field per record, or must it be inferred per jurisdiction?** §6.2 makes
    the shaded window mandatory — left raw, a founder reads a data artifact as *this space is dying*.
    The shading has to be computed from something.
17. **Can the matrix be run over a bounded time window, so the same grid can be computed twice?**
    Our map marks which intersections are *growing*, which needs the same rows and columns over two
    periods. A parameter, a field, or two runs we diff ourselves — and if the last, does it cost two
    runs on the meter? **It is the only part of our main view we cannot derive from one result set.**
18. **Are citation counts available per patent, and countable against the result set rather than
    globally?** §6.2's Lineage ranks by *most cited in scope*. A global count ranks famous patents; a
    scoped one ranks the ground this specific idea grew out of.
19. **Is `Switch To Ai Insight`'s output reachable as structured values, or only as a rendered
    panel?** If it comes back as generated HTML or an image we cannot re-label it in English or place
    it in our own summary — which would settle question 14's follow-on for reasons that have nothing
    to do with whether the capability is good.
20. **Does a programmatic result return what was excluded, or only what was kept?** An analyst in
    `Hierarchy` assigns by hand and bins what does not fit — at the scale our illustrative set
    models, 41 of roughly 158, leaving 117 in scope; §4.G. **Terrain has no analyst to do that
    discarding.** Is the kept-or-binned decision the engine's or the person's, and can we see the
    discarded set? **This bears on whether our counts and yours are comparable at all.**
21. **Is the same measure available at an earlier date?** A change indicator needs two time points
    and we hold one. We can snapshot our own runs and diff them — but that changes what we store and
    what a run costs, so we would rather know first. Related to question 8.
22. **Which of five data shapes can the engine return?** `design/components.md` §2 tables
    them: four incommensurable axes per holder; a directed citation pair matrix; active years per
    holder; live and expired per holder for one project; and patents against distinct-holder count
    per year. Four of the five are chart forms of yours we have specced and cannot build; the fifth
    feeds a sentence. **One question rather than five**, because they share one blocker.
23. **What does a 專案 contain, and can one be created, listed and reopened programmatically?** It
    decides whether our project list is a view of your object or our own object holding a query.
24. **Is the search filter set required by the query engine, or is it a UI default?** §6.1 puts one
    composer under one question and no filters anywhere. Could a portal omit them and infer scope
    from the sentence, exposing narrowing later?
25. **Is the pipeline reachable end to end in one call sequence?** 技術魚骨 → 檢索策略 → 專利檢視 →
    篩選/分類 → 布局分析 is six steps of user labour in IPtech and one uninterrupted run in Terrain —
    the whole difference between the products. Does each stage need an explicit user action to
    advance, and does a classification run report **stage-level progress** or is it one opaque
    call?

**How a front end could sit on it.** A different kind of question and probably a different reader —
the first twenty-five ask what the engine can *do*; these ask what a separate portal could be *built
against*. They are the practical form of §8.2.

26. **Are the analysis charts server-rendered images, or client-side components?** **This one gates
    our entire design pass.** If charts arrive as generated pictures, no styling work can restyle
    them and the visual layer needs its own rendering path against raw values — **you cannot
    re-token a PNG.** Everything we have handed over assumes structured values. In blocking order
    this sits second, behind only question 1.
27. **What is the front-end stack** — framework, CSS approach, build step?
28. **Can the interface be themed through CSS custom properties**, or are styles compiled or inline?
    If custom properties are already in play, our semantic token layer maps onto it directly.
29. **Is there a shared component library**, or is markup authored per page? This decides whether we
    hand over tokens, or tokens plus component specs.
30. **Is the `Mark Colors` ramp configurable per deployment, or fixed in the component?** This is the
    one visual decision where we would diverge from you deliberately rather than incidentally: a
    traffic light over matrix cells answers a question the underlying data cannot answer. Ours stays
    a tonal grey ramp.
31. **Is 全美引證次數 — the untranslated column header — a data-layer value or a template string?**
    That single answer tells us where the translation boundary actually sits, which is §8.2's second
    sub-question made concrete.
32. **Is there an i18n layer we can extend**, or is English a parallel template set?
33. **Are the six merge toggles** — Applicant/Assignee, Inventor, Country, Patent Country, Examiner,
    Application — **server-side operations or client-side view state?** It decides whether *merged by
    default* is a request parameter or a UI decision, and §6.2 needs the former.
34. **Is the points meter per API call or per UI action** — and could a separate portal share it?
    Consumption is already credit-metered at a readable per-module price (§10.8), so a portal could
    inherit the meter rather than needing a new commercial model. What we would need is for a run
    made through an API to draw on the same balance a run made through your UI draws on.
35. **Can a separate front end share session and auth?**

**Raised by the entry field.** One composer takes IPtech's five search tabs; these two ask what that
costs on your side.

36. **Does one entry point accept a sentence, a patent number and a classification code, or are
    `AI Search`, `General` and `Number` separate endpoints?** Terrain folds the five tabs into one
    field and detects the kind on submit. If the caller must choose the mode, that is routing work we
    do and not a blocker; if the modes take different query shapes or return different result
    objects, the single field needs to know before it is built.
37. **Is `Company` a search mode or a filter?** On screen `01` it sits as a tab beside `Number`, and
    a company picker also appears in `Report`'s entity list. The answer decides whether *who is DJI
    here* is an entry point or a scope applied to one — the difference between a founder's first
    sentence and a control they never see.

**Raised by showing a founder what the search found.** Three questions about the layer between a
search and a map — the step where someone decides which of the results are theirs.

38. **Can a result set be re-ranked against a patent we point at?** A founder browsing what the
    search found will recognise one patent as close to what they are building; saying *more like this
    one* and re-ranking the set around it is the cheapest narrowing act available to someone who
    cannot read a thousand records. Your `AI Sort` control is evidence you rank a result set. Ranking
    it against **a supplied document** is a different capability and we have seen no screen that does
    it. If the answer is no, the step survives and only that one control comes out.
39. **Does relevance ranking return an order, or a score?** An order is enough to recommend which
    results to keep. A score would also let that recommendation be a threshold rather than a fixed
    count. It also carries a constraint on our side: an ordering is a fact, and a score printed
    beside a patent reads as a verdict about a founder's chances, which our map is careful never to
    give.
40. **Can the definitions table be written programmatically, and does it take terms per branch?**
    `Fishbone` step 2 — *Edit Search Query / Technical Description* — is the one screen we have never
    seen, and it is the layer a founder's answers map onto: someone telling us *this is for urban
    delivery* and *not the whole aircraft* is authoring what your analyst types there. Is that table
    reachable programmatically, does it take terms per branch rather than one query for the whole
    tree, and can a branch carry an **exclusion** as well as an inclusion? We found no screen showing
    the last one, and it is the single most useful thing a founder can tell us.

**Raised by your own semantic search surface**, and appended 2026-09-08. Eleven questions, and they
are a different kind from the forty above. Those ask what IPtech can do and what a separate portal
could be built against. **These ask about `快檢通 · AI 快速檢索`** — which we saw for the first time on
2026-09-08, and which does several of the things §6 describes. We would rather ask than assume, and
the first two are the ones everything else waits on.

**Said plainly, because it is the useful thing to say: if this surface is what we think it is, the
question in §8.2 has a better answer than the three we offered.** A front end for a founder is a much
smaller job on top of a semantic search engine than on top of an analysis platform, and we would
rather build the second layer of your product than a parallel first one.

41. **Is `快檢通` the same engine and the same database as IPtech, or a separate product?** This is
    now the first question on our list, ahead of the API question above. Everything we have catalogued
    over five weeks is keyed to the platform. If the semantic surface runs on a different index or a
    different retrieval model, our reading of what we would be building on is aimed at the wrong
    place.
42. **Is it reachable programmatically, or is it browser-only?** Asked of the platform this was
    §9.1. Asked here it matters more, because this surface already does in one step what we assumed
    we would assemble from several: a sentence in, a technology structure and ranked patents out.
43. **What generates the `探索方向` suggestions, and can they be requested without running a search?**
    Five directions appear as we type, and one of them — *agricultural plant protection spraying* —
    is a field of use, which is one of the clarifying questions we had already planned to ask. If that
    generator can be called on its own, our questions have real options instead of placeholders.
44. **Is the fishbone it generates the same `技術魚骨` structure as `Fishbone`'s, does it come back as
    data or as a rendered image — and can it drive `Tech-Effx`?** The third part was added 2026-09-09
    and it is the one we most need answered. We understand `快檢通` to be a feature of IPtech rather
    than a separate product; if that is right, then the structure it generates and the matrix in
    `T-Map` are two ends of one pipeline, and almost everything in §6 assumes that pipeline connects.
    If it does not — if the semantic surface returns a structure nothing downstream consumes — that is
    still workable, but it is a different build and we would rather know now. On the middle part: §6's
    matrix takes its axes from that structure, so we need the values. An image we cannot use.
45. **Can the `相似專利` mechanism be pointed at a whole result set rather than at one patent?** What
    we saw selects a patent and offers three near neighbours, then navigates to whichever is clicked —
    the ranked list underneath stays as it was. We want to let a founder point at one patent and say
    *more like this*, and have the **set** re-order around it. Those may be the same capability with
    a different surface, or two different ones.
46. **What is `分數` — a normalised similarity, and is it comparable between different queries?** We
    asked above whether relevance returns an order or a score. It is visibly a score. Whether the
    scale means the same thing across two different sentences decides whether we can recommend a
    cut-off rather than a fixed number of results.
47. **Is the 500 in `回傳筆數` a limit of the interface or of the engine?** If a sentence cannot return
    more than 500 records, every chart in §6 is drawn over at most 500 patents. We would want to say
    so plainly to a founder, and it changes what our counts mean next to yours.
48. **Is `資料來源`'s Taiwan and USA the full jurisdiction coverage of this surface?** Your platform's
    figure is 100+ countries and 180M records, and the modal offers two. Our buyer is a US founder, so
    this decides whether the semantic layer is usable for us as it stands.
49. **Who wrote the English, and does it extend to the patent data?** The interface is already in
    English, and so are the generated suggestions — which was more than we expected and is genuinely
    good news. Two things follow. There are rough edges a native reader will catch: `筆` renders as
    *pens* on the record-count control, and the same term appears as *Drone* in one suggestion and
    *UAV* in three. **We would happily do that work** — we are a native-English team and it is the
    part of this we are most confident about. And the patent data itself — titles, abstracts,
    applicant names — is not translated in anything we saw, which is the harder half and the one that
    decides whether a founder can read a result at all.
50. **Is `搜尋耗時 1.97 秒` representative, and what does a search cost you?** Two seconds is fast
    enough to change what we can offer — a founder could re-ask freely rather than being rationed. We
    would want to know it holds at 500 records, on US data, before designing around it.
51. **What is its release status, and is there still room to shape it?** This is the one question on
    our list that is about timing rather than capability. If the surface is still in development,
    there are a few choices in it we thought we would want to discuss. **In the end we adopted all
    of them** — the caller-set record count, the direction chips and the printed relevance score.
    Each time we asked what the control was *for*, the answer was better than the thing we were
    about to build in its place. So this question is now about timing rather than about those:
    what we would still want to know is whether the surface is settled enough to build a front end
    against.
52. **Can the technology axis be computed over a result set we hand you, rather than only when the
    fishbone is first built — and can `Tech-Effx › Company` then be drawn over that set?** Your own
    populated matrix is drawn over 102 retrieved patents, so the axis clearly can come from a
    corpus. What we do not know is whether that step is callable **after** a search, on the set it
    returned. **It decides what the map's columns are describing.** If they are computed from what
    came back, the caption can say *this approach holds 32 of the 124* and mean it. If they can
    only be produced from the sentence before anything is retrieved, the columns describe the
    founder's sentence rather than the corpus — the arithmetic is still correct and it is
    answering a different question, which is worse than being wrong because nothing on the screen
    shows it. **This is the largest risk we carry**, and it is one of the two things §0.5 leads on.
53. **What is `回傳筆數`'s own default, when a caller does not set it?** We ask the founder how many
    patents to bring back, using your control's own five values, and *Not sure* has to land on a
    number. Ours is currently **50** — the middle of the five, chosen because it reads as *a
    reasonable amount* rather than as a decision. Every screen we hold shows the control already
    set, so we cannot tell what it does when it is left alone. **If the engine has a default, we
    would rather use yours.** Pairs with §9.47, which asks about the other end of the same control.
54. **Does the record carry the claim set as text, per claim, and does it carry the abstract?**
    Opening a patent gives the founder its identifiers, its abstract and its claims **as
    published** — unhighlighted and unparaphrased, which is the whole basis on which we show them
    at all. So the shape matters more than usual: an **array of claims** lets us number them the
    way a patent numbers them and lets counsel be pointed at claim 4; **one blob of text** does
    not, and a rendered image of the claims would make the whole pane unbuildable. Screen `25`
    shows a record view with a decode, so the text is plainly held somewhere; what we cannot see is
    whether it is reachable as the published text rather than only as a reading of it.
55. **Could we see `Tech-Effx › Company` populated?** This is a capture request rather than a
    capability question, and it is the cheapest thing on this list to satisfy. The only screen we
    hold of that view is **degenerate** — a single 1 × 1 cell — and the only populated matrix we
    hold is 技術 × 功效. **So our hero widget is designed against a view none of us has seen with
    data in it.** Three things we cannot answer from what we have: how many assignee rows does it
    lay out, do they collapse into a tree the way your assignee list does, and does it paginate?
    We take the top eight and say so on the card; if the engine already has an opinion about that
    number, we would rather use it than author a second one.
56. **`Applicant/Assignee Merge` has to be on, and on by default for our calls.** *A requirement
    rather than a question, and the only one in this document.* The toggle defaults off, and on the
    screens we hold it puts one US company across **five** rows, and two more across four and five.
    An analyst knows to press it; a founder does not know there is one. **On a rivals table that is
    a bad row. On our map the holders are an axis**, so one company unmerged is five rows of the
    grid with its filings divided among them — and *no holder owns any approach here*, which is the
    most useful sentence the map can produce, becomes false in the same direction. **If the merge
    cannot be defaulted on for our calls, the map's row axis has to be reopened.** Pairs with §9.4,
    which asks whether 名稱統一 reaches US startups at all, and with §9.33 — **and §9.33 is the one
    that decides whether this requirement is even expressible**, since it asks whether the six
    merge toggles are request parameters or interface state.

### The design is not waiting on design decisions

Worth stating plainly, because it is the shape of the whole design pass. **Three colour treatments
and four chart forms are specified in full and cannot be built** — not because we have not decided how
they should look, but because we do not hold the data to draw them honestly. Our own rule is that a
screen shows real chrome and a grey bar where a value would be, and that nothing is invented; so a
chart we cannot feed stays a specification.

The blocked set is specific: **live-versus-expired everywhere it appears**, which is the single most
decision-relevant fact a US founder gets from the product; **tracking one holder through the citation
view**; **any change-over-time indicator**; and the four chart forms in question 22. Every one of them
lights up on the same answer.

**That answer is question 1.** Not a design review, not more wireframes, not another pass on the
visual language. One answer about what is reachable programmatically converts a specification into a
build, and until it arrives the design pass is as complete as it can honestly be made.

### One question for TIS, not for Innovue

**Deliberately outside the numbering above, and deliberately unranked.** Every question in §9 asks
Innovue what exists. This one asks us what we want, and we have not decided. It is here because it is
load-bearing, and because a document that hid it would be less useful than one that did not.

**What does a founder actually walk away with?**

Terrain answers *"you have your map — now what?"* three times, and all three answers keep the founder
**inside** the product. None is a thing they carry out. A founder should be able to go to their
funders or their institution and say ***"we're heading this direction because of findings in
Terrain"*** — and right now that is packaged as nothing.

**How it went unnoticed.** Four separate decisions, each defensible where it was made: auto-generated
reports cut, project sharing cut, the project-level summary half-specced, export ruled out of v1.
Nobody checked what was standing after all four. What is standing is a live map inside a subscription
the founder must keep paying to look at again — and [brief.md](brief.md) §1 names universities and
accelerators as the **paying channel**, so if an accelerator buys thirty seats, *"each founder has a
map they can log into"* is a weak renewal conversation. **The cut of the report stands.** What follows
is narrower: *there must be an artifact, and it must not be a report.*

**Four constraints eliminate whole shapes before any option is considered.**

- **The interface may not say *why* a cell is empty.** No verdicts, no *"file here"*, no *"this is
  your opportunity"*. Anything reading as a recommendation from Terrain breaks the one promise §5.1
  says the map is careful never to make.
- **Software, not a report.** [brief.md](brief.md) §1 is a lock, and the test is written: *a title
  page, a download, or the word* report *is the line.* A page with a URL is software; selectable text
  is not a document; a PDF is.
- **Stage-neutrality.** The founder may have filed, be mid-filing, or be nowhere near it. No copy may
  assume a fundraise, a filing, a board or an institution.
- **The idea is not the direction.** The idea is the *input*, captured at the confirm card. The
  direction is what the founder concluded *after reading the map*, and it does not exist until they
  have seen it. Terrain cannot simply replay what it was told.

**Four candidate shapes, unranked.** Not mutually exclusive — B is A plus a sentence, D is B plus
time.

| | Shape | Against it |
| --- | --- | --- |
| **A** | **Evidence only** — a read-only link to the live map. The product is the artifact | The recipient has to interpret a matrix, and the founder still writes the story elsewhere — which is the work they wanted help with |
| **B** | **The direction, in the founder's words, over the findings that support it** | A new object with a new authoring step, and the draft-and-approve mechanism has to work or the field sits empty |
| **C** | **Terrain's summary of findings, no direction at all** | Stops one step short of the thing the founder needs to say. A list of facts is not a direction |
| **D** | **A position, recorded and re-checked over time** — B, plus *"you set this in March; here is what has changed"* | Depends on question 8's per-run cost, and it is the largest build of the four by some way |

**Two things are settled**, because they were put to the decision-maker directly.

- **Portability: a link plus copyable text.** A downloadable file was proposed and **actively
  declined.** That closes the strongest threat to the software-not-a-report lock, and it protects the
  human-produced Survey tier from being undercut by a cheaper artifact that looks like the same
  object.
- **Freshness: a dated snapshot with the live map behind a link.** So a founder is never contradicted
  by their own updating link, and a finding can be quoted in six months or in a grant form.

**One mechanism is worth recording whichever shape wins.** Terrain holds the raw material — the cells
the founder opened, the questions they typed, the scope changes they confirmed. So: *Terrain drafts
the direction from what the founder did; the founder edits or replaces it; nothing is shared until
they approve.* That is the confirm card's own pattern run at the other end of the session — same
component, same gate, no new interaction model. It stays inside the no-verdict rule **only if the
boundary is held precisely:** *"you have been looking at passive thermal"* is a transcription;
*"passive thermal is your opportunity"* is a verdict. Where the founder engaged with nothing in
particular, Terrain has nothing to draft and should say so rather than invent a direction.

**What would settle it.** Does the artifact carry a **conclusion** or only **evidence** — everything
else follows from that one answer, and it is the axis A–D actually vary on. Then: would
draft-and-approve produce something a founder would actually send, which is testable with a written
example before any build. What it is called, which is constrained — not *report*, *brief*, *summary*
or *memo*, all document nouns that would breach the lock by themselves. And whether positions
accumulate per project or supersede each other, which quietly gates option D.

*Full thinking record at [platform.md](platform.md) §7a.8. Nothing in it is built or designed
against, and this subsection deliberately declines to recommend.*

---

**Why we are asking now rather than after a build.** There is one prototype and no application code.
Nothing exists that these answers could invalidate, and every one of them changes what gets built
rather than what gets rewritten.

---

## 10 · Sources

Audited 2026-08-31: `innovue.ltd/products-iptech/` and the 2025-11 rebuild of that page,
`innovue.ltd/products-webpat/`, `innovue.ltd/update-iptech/`, `innovue.ltd/patentmap/`, `iptech.cc`,
and the blog series 專利分析實操 (EP7, EP41) and 專利布局分析大解密 (EP1, EP7, EP8).

**Audited inside the platform, 2026-09-02 and 2026-09-04**, on a TIS account: the eight top-level
destinations, the `M-Map` and `T-Map` menus expanded group by group, and the `Fishbone`, `View`,
`Project`, `Company - Ranking`, `Company - Activity`, `Company - Legal Status`,
`Patent Count - Life Cycle`, `Tech-Effx - 1D Matrix` and `Tech-Effx - Company Trend` screens.
Captures are indexed in [visual-reference/iptech-screenshots-identified/README.md](../visual-reference/iptech-screenshots-identified/README.md).
**This is the source for §4.H and for the evidence in §5.3**, and where it disagrees with the
marketing audit above, it wins.

**Seen in a live walkthrough of the platform, 2026-09-04.** How the product is navigated in
practice — `Search` → `Project` → a separate browser tab → `Fishbone` / `M-Map` / `T-Map`. The
captures are cropped to the app viewport, so **no screenshot shows the new tab**; that one detail is
recorded as observed rather than captured, and nothing in §6 depends on it. Everything else about
the navigation is visible in any capture with the top nav in frame.

Source tags in §4: **product page** · **blog** · **changelog** · **search listing** ·
**update log** (IPTECH update日誌) · **platform** (observed in-product, with the screen number given).

The assessment in §3.4 of in-product English is **our own, from use**, and is not drawn from any of
the above. Our internal records — the brief, the platform definition and the design language — are
not included here; every claim that matters is restated in this document.
