# TIS Terrain — Platform

> What gets built. Settled 2026-08-31 unless marked open.
> [brief.md](brief.md) holds positioning, naming, and the Innovue relationship — read it first.

**This is not a PRD.** A PRD needs data contracts and acceptance criteria, and the largest unknown
— whether Innovue exposes any of this as an API — is unanswered (§10). This document is structured
to graduate into one once that closes.

---

## 0 · The finding this all rests on

In IPtech, **the taxonomy is an input, not an output.**

An analyst builds a fishbone (技術魚骨) *before* searching anything. They decide that "drone" means
propellers, and that propellers decompose into type, material, and motor topology. They write
keyword sets per branch into a definitions table (技術定義表). They then search branch by branch.
Classification is not a separate step — the fishbone already is the classification, and a patent
lives in whichever branch caught it. The matrix axes come from that same structure.

A founder cannot do any of that. They do not know that drones decompose into rotor material and
motor topology; that knowledge is the thing they came for.

**Terrain's product is generating that structure from one sentence and hiding the machinery.** Every
decision below follows from it. Innovue's engine already automates each link in the chain
individually — AI魚骨 → 檢索策略 → AI分類Pro → 矩陣 — and nobody has run them end to end off a
founder's own words.

**Confirmed inside the platform, 2026-09-04.** `Fishbone` is a top-level destination and a
three-step wizard: *Create a new AI fishbone → Edit Search Query / Technical Description → Download
Patent*. The order is the finding made literal — the taxonomy is authored at step one, the search
query is written against it at step two, and patents arrive at step three. The captured example
carries a complete six-branch, two-level taxonomy (光焱核心技術, 能源轉換系統, 感測與偵測技術,
照明與顯示應用, 電子元件製造, 表面處理與塗層) in which **every branch count reads `(0)`**: the
structure exists in full before a single patent has been matched to it. It also renders entirely in
Chinese inside the English UI.

---

## 1 · The shape

Natural language in. A few questions back. A confirmed reading of the idea. **What the search found,
approved before anything is drawn over it.** A saved project. A dashboard of views over that one
corpus. Chat proposes changes; the founder confirms them; every confirmed change is a version.

*The second and fourth sentences arrived 2026-09-07 — §4a and §4b. Both exist for the same reason:
one sentence against 180M records is a wide net, and the founder is the only person in this product
who can narrow it.*

## 2 · The six moments

There is no "search screen" and "dashboard screen" competing for the flow. There is one session
over time — and, since 2026-08-31, **surfaces rather than screens.**

***The four are conversation · set · map · widget.** This line said "two" until later on 2026-08-31,
when the widget page was specced in §7a.2 and built in the prototype, and "three" until 2026-09-07,
when §4b added the set. Each was corrected in place rather than left as a correction to read past.*

***The two additions are different in kind, and the distinction is what keeps §7a.2 intact. A widget
page is a destination, never a step: no moment routes through one. The set surface is a step, and
exactly one moment is spent on it.** Both are reached and left without opening a window — §2.1 is
unaffected.*

| Moment | Surface | What is on screen |
| --- | --- | --- |
| 1 · First run | conversation | The composer, centred, and the question above it. Nothing else. |
| 2 · Confirm | conversation | **Two beats.** A short round of narrowing questions, answered in the thread (§4a), then the plain-English breakdown of the idea, as a card in the same thread (§4). Edit or approve. Gates the search. |
| 3 · The set | set | What the search found, ranked, with the recommendation already selected (§4b). Star to re-baseline, or adjust the selection. Approving it is what builds the map. |
| 4 · Build | set | Progressive assembly, narrated, in place on the set surface once the set is approved. |
| 5 · At rest | map | Map-dominant dashboard, collapsible project sidebar, chat docked bottom-right as an icon — and a standing note of what the map was built on (§6.1). |
| 6 · Return | map | Sidebar → project → straight to moment 5. No search step, no set step, no rebuild. |

**Why 1 and 2 are one surface.** They were always one conversation: the founder describes an idea,
the system asks what it needs to ask, reads the idea back, and the founder corrects it. Rendering
that as separate full-screen views made a founder feel they were being handed between rooms for what
is a single exchange — and it hid the fact that the thing they typed into at the start is the same
thing they will type into forever after. The moments survive as *moments*; they are no longer
*screens*.

They remain distinct in every way that carries a decision. **Confirm still gates**: it is a card in
the thread, but nothing runs until it is approved, and §4 is unchanged. Build still fires on
creation and after a confirmed scope change only.

**Why the old moment 3 is now two.** §5 already describes a re-run as "a search across 180M records
**plus** AI classification" — two operations, which the interface used to run back to back behind one
progress bar. They are separated now because the founder has a decision to make between them: the
search produces a set, and the classification builds the map **over whatever the founder approves**.
Recorded 2026-09-07; the reasoning is §4b.

**Chat is not a place, it is the means.** It is how the map gets made and how it gets changed —
which is §1 restated. Before a map exists the conversation is the whole content area; once one
exists it collapses to an affordance on the map (§11). One composer, two sizes, never two
different things.

Progressive build fires **on creation and after a confirmed scope change only.** Never on a return
visit, or it becomes a loading screen the founder watches every day.

The rebuild after a scope change is **visibly shorter than the first build** — fewer stages, and it
says so. Only what changed is re-run, and the founder should be able to see that from the screen
rather than take it on trust.

*"The door" was this table's term for moment 1 until 2026-08-31. It was dropped: in review it read
as internal jargon, and the plain answer to "is there a search screen" is yes — it is just not a
screen competing with the dashboard.*

### 2.1 · One place, and no new tabs

**Recorded 2026-09-04, from a live walkthrough of the platform rather than from a capture.**

IPtech's own route to an analysis runs `Search` → `Project` → **a separate browser tab** →
`Fishbone`, `M-Map` or `T-Map`. The project list is where work is kept; opening one hands you to a
new window, and the analysis destinations are then reached by leaving whichever one you are in.
Eight top-level destinations, and the path across them is not a line.

**That shape is right for the person it was built for.** An analyst lives in that menu, holds several
analyses open at once and compares them — a second window is a feature when you are reading two
charts side by side, and Innovue build for the audience they have. It is the wrong shape for someone
who has never done this before, has one idea and one question, and has no model of which of eight
destinations answers it.

So Terrain adds a rule to the surfaces, and it is testable rather than decorative:

> **The session is one tab.** Nothing on the founder's path opens a window they have to come back
> from.

§7a.2 already says the widget page is *a destination, never a step*. This extends that from the flow
to the window: a destination is somewhere you go and return from **in place**, and the project rail,
the map and the widget page are one document.

**The founder-facing order falls out of it.** Search → the project → the content. What IPtech splits
across two menus arrives on one surface: **the map is the `T-Map` content, and the widgets beneath it
are the `M-Map` content.** That is §6's map-dominant dashboard argued from the other direction — not
*the map matters more*, but *these are two menus in the same product and a founder should not have to
know which one they are standing in*.

*One caveat, because §8.5's discipline requires it.* The captures are cropped to the app viewport, so
**no screenshot shows the new tab**; the behaviour was observed in the walkthrough and is recorded as
observed rather than captured. Nothing here depends on it — the rule above stands on the eight
destinations, which every capture with the nav in frame shows.

### 2.2 · What the one field accepts

**Decided 2026-09-04.** The composer is the only entry point, and it takes more than a sentence.

IPtech's search screen puts five tabs and roughly thirty controls **above** its AI box — `AI Search`,
`General`, `Number`, `Company`, `SEPs`, then patent type, case type, an SEPs flag, three legal-status
checkboxes and sixteen countries with a `more` — plus a boolean textarea of its own, headed *Logical
symbol(AND;OR;NOT) must be capitalized*. Two search inputs on one screen, and the AI composer is
last. Its placeholder is the clearest sentence on the page: *"Please enter your question, e.g., 'I
want to learn about electric vehicles.'"* Screen `01`.

**Terrain takes that line as the whole screen and folds the tabs into the field.** One composer, four
kinds of input, detected on submit:

| The founder types | IPtech's equivalent | What Terrain starts from |
| --- | --- | --- |
| A sentence describing the idea | `AI Search` | The path everything else is designed around |
| A patent number | `Number` | That patent — its approaches and outcomes seed §4's reading |
| A company name | `Company` | A rival — what they hold becomes the first scope |
| An IPC or CPC class | `General` | The classification, for a founder who has been handed one |

**The filter rail stays out.** Patent type, case type, legal status and jurisdiction are *narrowing*,
not entry; they belong after a map exists, and §10.24 asks whether the engine requires them at all.
Folding them in would trade one wall of controls for a query language, which is the specific thing
§6's design removes.

**Amended 2026-09-07 — jurisdiction is asked once, at §4a, and that is not the filter rail.** The
sentence above stands for the rail; it no longer stands for the fact. §4a asks *where does this need
to hold* as one question among three to five, before anything is searched, and the answer scopes the
search that follows.

The distinction is between **an act and a control**, and it is the same distinction §4b uses to admit
the star:

> **A single act at build time is not the standing analyst behaviour these documents rule out.**

What §9 defers is a *persistent* jurisdiction and status control that redraws the map, Rivals and the
trend together on every change — a rail the founder operates while reading. That stays deferred, and
nothing here moves it. Asking once, in plain English, before a map exists, costs one question and
redraws nothing. **What the amendment concedes** is that the old sentence was doing two jobs: it kept
the wall of controls out, which was right, and it also asserted that the *fact* was not needed until
later, which was never argued. A founder who only cares about the US should not have their corpus
built worldwide and then filtered back down.

Patent type, case type and legal status are **not** admitted by this. They stay out on the original
reasoning.

**All four routes still gate at §4.** A number or a class is a *starting point*, not a search Terrain
runs blind — the confirm card reads back what it understood either way, and nothing runs until the
founder approves it. That is why this can be four inputs rather than four modes: there is one screen
after it, and it is the same screen.

**One rule on the copy, because it runs against `brief.md` §1.** The ICP does not speak patent and
must never need to. So the field *recognises* a classification code without teaching it — the
sentence is the demonstrated path and the rest is offered conditionally. Never *enter an IPC class*;
always *if you have one*. `design-language.md` §7's placeholder rotation carries it.

Two questions follow, at §10.36 and §10.37.

## 3 · The saved object

Not a search. A search is one query against one branch — it is a verb, not a thing. The durable
object is **the structure plus everything it caught**: the confirmed breakdown, the corpus, the
views, and the version history. IPtech calls this a 專案.

This is what the sidebar lists. The sidebar is not a list of conversations; the conversation is how
the object got shaped, not the object itself.

**What IPtech's 專案 actually is, and why ours is not that.** Observed 2026-09-04: `Project` holds
curated multi-patent folders — a company folder of ~210 patents, another of ~2,200,
`無人機無人載具相關 (751)` — expandable into sub-items, each row carrying six actions and a numeric
ID, split across `My Projects` and `Shared Projects`.

**The difference is not how many patents a project holds. It is who assembles the set.** IPtech's
專案 is a folder an analyst curates: they decide what belongs in it and add to it over time, which
is why one project can span 2,216 patents across a whole company's portfolio. Terrain's saved object
is one idea's *persisted result* — the structure plus everything it caught, as above. A founder does
not curate a corpus; they describe an idea once and keep what came back.

That is the distinction to preserve. It is **not** "founders need fewer patents" — a Terrain project
may well catch thousands. It is that curation is an analyst's job, and Terrain has no analyst in it.
Record IPtech's `Project` as a reference for what the object looks like, never as a model for what
it does.

### Amended 2026-09-07 — the founder does select, once, and the sentence above needed narrowing

§4b puts a set of ranked results in front of the founder with per-row checkboxes and a select-top
shortcut, and what they leave checked becomes the corpus. Read flatly, *"a founder does not curate a
corpus"* forbids that. The sentence is kept, and its scope is stated:

> **§3 governs the object over time. §4b governs one act at the moment of creation.**

IPtech's 專案 is a folder an analyst **maintains** — adds to, prunes, re-files, and returns to across
months, which is how one reaches 2,216 patents. That is what this section rules out and it is still
ruled out. Selecting once, before a map exists, is not maintenance. It is the same act as approving
the confirm card, applied to results instead of to a reading.

**And it is not an act Terrain invented for the founder's benefit — it is one the analyst was already
doing invisibly.** §10.20 records that the project we opened reaches 117 patents because an analyst
working in `Hierarchy` binned 41 of roughly 158 by hand. **Terrain has no analyst to do that
discarding**, so either the founder does it once, in the open, or nobody does it and the map is drawn
over everything the search returned. §4b chooses the first.

**The cost, recorded plainly, because it is real.** A list of patents with checkboxes is `Hierarchy`
at smaller scale, and `case.md`'s argument to Innovue is that Terrain removes the analyst workflow. A
reviewer can reasonably read §4b as us rebuilding the thing we said we cut. Three requirements answer
that, and they are load-bearing rather than polish — if any one stops being true, this amendment
should be reopened:

1. **The recommendation arrives already selected.** The default path through §4b is one click. The
   checkboxes are an escape hatch for a founder who disagrees, never work the product requires.
2. **The selection does not survive as an object.** No saved list, no unread state, no folder, no
   second visit. Nothing to maintain is what keeps the sentence above true.
3. **One pass only.** The set surface is not reachable from the map, and moment 6 never routes
   through it. A founder who wants a different corpus changes the scope (§5) and gets a new set; they
   do not go back and re-tick.

**Open:** the product-facing name for this object. Do not use "terrain" as the object noun without
deciding it. §4b adds a second unnamed thing — *the set* is working language, not a decision.

## 4 · The confirm screen

The most important screen in the product, and the founder-legible form of IPtech's 技術魚骨 plus
技術定義表.

After the first message, the system shows the idea decomposed — plain-English rows ("carbon blade,
plastic blade, inner-rotor motor") and the benefit columns it will measure them against ("less
noise, longer flight, cheaper"). The founder edits or approves. Nothing runs until they do.

*The example was corrected 2026-09-07.* It read *"shape, materials, motor type, power efficiency"*,
which is three facets of a component with one outcome bolted onto the end — the two dimensions
collapsed into one list, in the section that exists to keep them apart. §6.1's example was already
the clean version and is now the only one.

*Since 2026-09-07 the card is the **second beat of moment 2**, not the first. §4a asks three to five
narrowing questions ahead of it and the card is drafted from the answers. Everything in this section
is unchanged by that: the card still gates, it is still the one place the structure is shown, and it
is still reused for every subsequent scope change.*

It gates the search because **a wrong reading here poisons every downstream view.** If the system
decided "drone" means camera gimbals when the founder meant propellers, the map, the rivals list
and the trend chart are all confidently wrong, and the founder has no way to tell.

**This screen is reused for every subsequent scope change**, not just onboarding. See §5.

**And for every kind of entry.** §2.2 lets the composer take a patent number, a company name or a
classification code as well as a sentence. All four arrive here, and the card's job is identical in
each case: say what was understood, in plain English, before anything runs. A founder who pasted a
number has *more* to check, not less — the system has inferred approaches and outcomes from a single
document.

Never expose the words *fishbone*, *node*, *taxonomy*, or *classification*.

**Surfaced once, used three times.** Worth stating plainly, because the alternative phrasing —
that Terrain "scatters the fishbone through the product" — describes something we deliberately did
not do. The structure is *shown* in exactly one place, this screen. It is then *used* silently
twice more: as the search strategy that builds the corpus (§2), and as the rows of the map (§6.1).
One appearance, three jobs. A diffusion of the taxonomy across several surfaces would breach the
rule directly above it.

*This survives §4a.* The questions ask **about** the idea; they never display the structure. A
question may ask what the founder meant by a word. It may not show them the approaches and outcomes —
that happens once, here.

### What this card does not do — 2026-09-07

**It does not narrow anything.** The two lists become the map's rows and columns and nothing else;
an audit against §6 found that Rivals, Filings over time and Lineage take nothing from them. **The
card shapes the map. §4a's questions shape the corpus.** Both matter and they are not the same job,
and the card's copy now says so rather than leaving a founder to infer that editing a row changes
which patents come back. It does not.

*This is IPtech's own structure, not an invention of ours.* The fishbone is **two levels deep, and
only level 1 becomes an axis** — eight branches, eight matrix columns. The `n.n` sub-branches beneath
them exist to hold **a search query and a technical description**, which is wizard step 2, the
技術定義表. **Their axes and their narrowing live on different levels of the same tree.** Read from
`17-fishbone-wizard-context.png` and `25`; step 2 itself has never been captured, which is what
§10.40 asks about.

**Two trees, not one, and that is also theirs.** `技術` and `功效` are selected separately — the
matrix carries `XClass` and `YClass` dropdowns and the fishbone carries its own scheme selector. The
card's two lists are two independent decompositions of one idea, which is why a founder can be right
about the approaches and wrong about the outcomes.

## 4a · Narrowing, before the card

**Added 2026-09-07, and it reverses a decision this document held from the start.** Until now there
were no clarifying questions anywhere in the flow, and their absence was deliberate: §4's card *was*
the clarification mechanism, one card and one gate rather than a Q&A round-trip. That reasoning was
sound and is recorded here rather than deleted, because the reversal is narrow and the old argument
still constrains it.

**What changed is the size of what sits behind the sentence.** One sentence against 180M records is a
very wide net, and §4b now shows the founder what it caught. A card that reads back *approaches and
outcomes* cannot narrow a net; it can only correct a reading. A few questions can, and they cost one
turn.

### What these questions are for — stated plainly, 2026-09-07

**The questions decide the corpus. The card decides the map's shape.**

That division was found rather than designed, by auditing the card against §6. **The card's two lists
feed only §6.1.** Rivals (§6.2), Filings over time (§6.3) and Lineage (§6.4) take nothing from it —
they take *the scope*. So before this section existed, the product asked the founder to shape one
chart's axes and asked nothing at all about the thing three of the four widgets are drawn over.

The consequence runs one way and it is worth stating in the order it actually happens:

> The tighter the corpus, the closer the returned patents are to the founder's idea — and the more
> every chart drawn over them is *about them* rather than about the field in general.

**So a question is never asking the founder to help build a chart.** It asks about their own idea, in
their own words, and the narrowing is the consequence. A question that only a chart needs is the
wrong question, however useful the chart.

*This has a counterpart in IPtech's own structure, which is the strongest evidence the division is
real rather than convenient.* The fishbone is **two levels**, and only level 1 becomes a matrix axis;
the `n.n` sub-branches exist to carry a **search query and a technical description** — wizard step 2,
the 技術定義表. **Their axes and their narrowing are different layers too.** §4 carries the finding;
§10.40 asks the question it raises.

### The bank

**Six kinds. Three to five are asked**, chosen by what the sentence left genuinely open.

| # | Question | Options are | Why it narrows |
| --- | --- | --- | --- |
| 1 | *One word in what you wrote could go two ways, and it changes what comes back. Which did you mean?* | bars | The highest-value question, and the only one that cannot be written in advance |
| 2 | *What is this for?* | bars | The biggest single lever in retrieval. The same mechanism sits in delivery, filming, agriculture and defence corpora that barely overlap. It fixes §6.2 hardest — the founder gets the holders in *their* field, not every company in the technology |
| 3 | *Are you making the part, or the whole thing it goes into?* | real English | Component and system patents are near-disjoint sets. Without it, a founder building a propeller is buried in whole-aircraft filings and every rival returned is an aircraft manufacturer |
| 4 | *Is anything else coming up that isn't what you're building?* | bars | The fastest narrowing act available, and the only one that uses what the founder already knows. It is §4b's star inverted — *less like this* — and the two should read as a pair |
| 5 | *Where does this need to hold?* | real English | Scopes the search rather than filtering its results (§2.2, as amended) |
| 6 | *Is this hardware, software, or both?* | real English | Splits two corpora that share almost all their vocabulary |

**Which are asked is adaptive, and the rule is about value rather than count:**

> **Ask a question only while it still changes what comes back.**

A sentence that already answers one has answered it — *"a quieter drone propeller for urban
delivery"* settles field of use, part-or-whole and hardware-or-software in nine words, and asking
anyway is the interview failure this section has always warned about. Three to five is the expected
range, not a cap; a vague sentence earns more questions and a precise one earns fewer.

**Order.** Disambiguation first, because it is about the words the founder has just typed and reads
as listening. Jurisdiction last, because it is the most administrative and the least about the idea.

**Rules, all inherited rather than new:**

- **The never-expose list applies unchanged** (§4). No *fishbone*, no *node*, no *taxonomy*, no
  *classification*, in a question or in an option.
- **The ICP does not speak patent** (`brief.md` §1). Every question is answerable by someone who has
  never read a patent, and no question asks for a code, a class or a date range.
- **Every question carries a real abstention, and it is not one of the answers.** *Not sure* is its
  own route. *Corrected 2026-09-07*: the first question shipped with *They both apply* as its skip,
  which is an assertion of knowledge rather than an abstention — a founder who does not know had
  nowhere to go. Answers like *They both apply* and *Nothing so far* are real answers and stay;
  **`Not sure` sits beside them.**
- **Answers feed the card, they do not bypass it.** §4 still gates. The questions make the card's
  draft better; they never stand in for approving it.
- **The answers are shown again on the card**, as a read-back row, so the founder approves the
  narrowing and the reading on one screen rather than trusting that a turn three messages up was
  recorded.

**Open.** Whether an answer can be changed after the round without starting over. The card shows the
answers but does not yet let the founder edit them, and *"you can change any of this later"* is doing
work it has not earned — after a map exists a change is a §5 scope change, but between the round and
the gate there is no mechanism at all. **Small, and load-bearing enough to name.**

## 4b · The set — what the search found

**Added 2026-09-07.** The search runs, and before anything is drawn the founder sees what it caught:
a ranked list of what matched, on its own surface, with the recommended cut already selected. They
approve it, or they change it, and **what they approve is what every view in §6 is built over.**

### Why this exists

§10.20, asked of Innovue about their own product, is the whole argument:

> The project we observed reaches 117 patents because an analyst working in `Hierarchy`
> assigned by hand and binned 41 of roughly 158. **Terrain has no analyst to do that discarding.**

Three answers were available. **Let the engine decide silently** — the map is then drawn over a
corpus nobody has looked at, and a founder who was misread never finds out, which is the failure §4
exists to prevent, one layer down. **Skip the discarding entirely** — the map is drawn over
everything the sentence caught, and our counts are not comparable to IPtech's, which §10.20 says
bears on whether the two products can be compared at all. **Or show the founder the set and ask
once.** That is this section.

It also answers something the founder feels and cannot articulate: a chart over 180M records is only
as trustworthy as the corpus beneath it, and until now Terrain never gave them a moment to say *yes,
this is my space* before the views were drawn.

### What is on it

A ranked list. **Four fields per row and no more** — §7's cap applies here in full, and for the same
reason: the map is the product and the patents are evidence, so evidence has to be legible rather
than explorable. The row expands in place onto §7a.3's handoff, exactly as the drill-down does.

**The star and the checkbox are controls, not a fifth and sixth field.** That distinction is what
keeps §7's cap honest rather than technically-satisfied.

- **The recommended cut arrives selected.** Terrain ranks what matched and pre-selects the top of it.
  The default path through this surface is one click.
- **Load more reads further into what matched. It never changes the corpus.** Reading and deciding
  are separate acts, or the charts change as a side effect of scrolling.
- **The checkboxes are the escape hatch** for a founder who disagrees with the cut. §3 records what
  they cost and the three requirements that keep them admissible.

### The star, and re-baselining

A founder browsing the set recognises one patent as close to what they are building. **Starring it
says *more like this*, and re-baselining re-ranks the set around it.**

**The star is a signal, not a collection.** There is no starred-patents list, no folder, no second
visit, nothing to manage — which is precisely why it does not breach §3. It is an input to a
re-ranking and it does not outlive the surface.

**Re-baselining re-ranks in place. No gate, no version.** §5 routes scope changes through §4 for
three reasons, and none of them holds here: a map does not exist yet, so nothing changes underneath
the founder invisibly; there is no version history to write to; and a re-rank is not the 180M-record
search whose cost §5 is protecting. **The moment a map exists, §5 governs again** and every route
back through this surface is a scope change like any other.

**It is optional, and most founders will not use it.** A founder who is satisfied with the set clicks
through. The star exists for the one who is not, and the cost of ignoring it is zero.

### What this surface may not do

**§6.1 applies to it in full.** The set may state what it found. It may not say, or imply, why
something is or is not in it — no relevance scores presented as verdicts, no *strong match*, no
ranking language that reads as a judgement about the founder's chances. A rank is an ordering, not an
opinion.

**And the cut it produces becomes a reason a cell can be empty**, which is a §6.1 problem the map now
has to answer. See §6.1's standing note.

### Open

1. **Whether the engine can rank by example at all.** The star assumes *more like this one* is a
   query the engine supports. §8.2 records `AI排序 · 關聯性排序` as evidence it ranks; ranking by a
   **supplied document** is a different capability and is confirmed nowhere. **This is the largest
   technical assumption in the section.** Recorded as a question at §10.38.
2. **What a re-baseline costs.** §10.8's per-run cost is unanswered, and "no gate" is a cheap
   decision only while a re-rank is cheap.
3. **What the recommended cut should be.** A fixed count, a share of what matched, or a confidence
   threshold. Recorded at §10.39.

## 5 · Chat and versioning

- Chat answers questions freely and **changes nothing.**
- Any change to scope routes through §4 before it applies.
- That distinction needs a **visible form**, or reason 1 below is only a policy. Chat carries an
  explicit *"Change what this map covers"* affordance that routes to §4, so a command never looks
  like a question the founder can fire off without noticing it was one.
- Each confirmed change writes a version with a plain-English label — "removed plastic propellers",
  "added obstacle avoidance" — and is revertible.

Three reasons, all load-bearing:

1. **Questions and commands blur otherwise.** "Which of these is closest to mine?" is a question.
   "Drop the plastic ones" is a command. If both mutate, a founder asks something innocent and their
   map silently changes underneath them.
2. **History becomes legible.** A list of labelled scope decisions is something a founder can reason
   about and revert to. A chat log is not.
3. **Re-runs are expensive.** Each one is a search across 180M records plus AI classification.
   Confirm-before-apply batches edits and prevents accidental spend.

### Open · what makes a typed message a command

**The rule above is unchanged. The prototype currently cannot honour its first line.**
`design/previews/terrain-prototype.html` routes **every** typed message in the docked chat to §4,
rather than only the ones that are commands. Telling "which of these is closest to mine?" from "drop
the plastic ones" needs an intent classifier the prototype does not have, and inventing one in the
interface would be the same class of error as inventing a patent count: a claim the thing behind it
cannot support. Answering everything with a skeleton paragraph was the alternative, and it made the
refinement loop — the reason chat is on the map at all — impossible to demonstrate.

What survives intact is the **gate**, which is the load-bearing half: nothing is re-searched until
the confirm card is approved, and every approved change still writes a revertible version. What is
lost is free question-answering, so the dock's copy says so on screen rather than promising a path
that does not exist.

Two things to settle before this is built:

1. **What classifies a message.** A model call, a verb list, or an explicit mode the founder picks.
   Reason 1 above says the cost of getting it wrong is a map that changes underneath someone — so
   the failure has to bias towards routing a question to §4, never a command to an answer.
2. **What chat says while it is undecided.** The current line — *"Anything you write here changes
   what gets searched, so it goes to the confirm step first"* — is honest about the prototype and
   wrong about the product. It goes back the moment 1 is answered.

Recorded 2026-08-31. **Reviewed 2026-09-04 and deliberately left open, so it is not re-litigated.**

The candidate answer on the table was the two chips in [design-language.md](design-language.md) §7 —
*Summarise this landscape*, which never reaches the gate, and *Change what this map covers*, which
always does. That is intent classification by explicit choice rather than by model call, and it is a
real partial answer to question 1: for the two things a founder most often wants, the routing is
already correct and already honest.

**It was not accepted as the answer, and the reason is that it does not reach the case that matters.**
The chips handle the paths a founder takes deliberately. §5's rule is about the free-text field, where
someone types a sentence and the interface has to decide what kind of sentence it is — and two
buttons do not classify typed language. Crediting them as the answer would close question 1 while the
failure mode it exists to prevent, a map that changes underneath someone, remains exactly as
possible. So the copy stands, honest about the prototype and wrong about the product, until typed
intent can be told apart reliably.

### Open · AI Skim in chat — a proposal, not a decision

**Proposed 2026-09-04. Nothing is built against this.**

`View` was captured inside the platform and AI Skim is materially better than §7 assumed. Not a
one-line 速讀: it produces a full, genuinely readable plain-English paragraph — the captured example
opens *"Think of it like a special lens on a flashlight…"* — alongside keyword chips
(`LED PACKAGING`, `STEREOSCOPIC DISPLAY`), `Valid` / `Overdue` badges, per-patent IPC, and a drawing
thumbnail.

**The proposal:** that capability may belong in **chat** rather than only as a field on a drill-down
row. A founder who has a specific patent in front of them and wants to know what it actually says
could ask, and chat could answer.

**The case for.** It fits the rule at the top of §5 without bending it — *chat answers questions
freely and changes nothing* — because *"what does this patent actually say?"* is a question, not a
scope change. It routes to no confirm card because it mutates nothing. It keeps §7's four-field
evidence row scannable, since the long-form explanation has somewhere else to live. And it gives
chat a concrete, demonstrable job, which the *Open* note directly above says it currently lacks.

**The case against, recorded honestly.** A founder reading patents in chat is a step toward the
explorable patent-level evidence §7 deliberately refuses, and §4.D of [case.md](case.md) refuses on
a stronger ground: an interface for studying patents implies Terrain can answer *does this block
me?*, which is a freedom-to-operate judgement and a legal one. A paragraph in a chat bubble is
softer than a detail page, but it is on the same path — and the boundary would need stating before
this is built, not after.

**Unresolved either way:** §9 asks whether AI速讀Pro is available in bulk. If it is not, this is a
per-patent call, which changes the economics and possibly the answer.

## 6 · The dashboard

**Map dominant** — hero map, three subordinate widgets beneath. **Colour carries information, or it
is not there** — `CLAUDE.md` and [design-language.md](design-language.md) §2. *This line read
"monochrome, per `CLAUDE.md`" until 2026-09-04; that rule was superseded on 2026-08-31 and the
dashboard has carried colour since — status chips, delta pills and the excluded-window band. What
survives of the original intent is that there is no accent and no decorative colour, and primary
actions are near-black.*

The weighting is deliberate. Lineage is the weakest of the four for this ICP and the hardest to
build; an equal-weight grid would force it to look as important as the map, and the map is the only
thing here that a general patent database cannot show.

---

### 6.1 · Hero — the map · 技術功效矩陣

A grid. **Rows are technical approaches** — carbon blade, plastic blade, inner-rotor motor — taken
from the confirmed breakdown. **Columns are what those approaches achieve** (功效) — longer flight,
less noise, more rigid, cheaper, cooler. Each cell counts the patents that use that approach for
that purpose.

Cell value is deduplicated by family (同族合併), so one invention filed in nine countries counts
once.

***Terrain's orientation is the transpose of IPtech's, deliberately.** Screen `24` puts `技術` on X
and `功效` on Y — technology across the columns, effects down the rows. Terrain puts approaches on
the rows. Recorded 2026-09-07 so nobody "corrects" it later: a founder reads down a list of things
they might build far more naturally than across one, and the row labels are the longer phrases. The
data is the same either way; only the reading order changes.*

**The cell form is a divergence, established 2026-09-04.** IPtech draws each cell as a **sized,
colour-scaled bubble** with the count printed beneath it — pale blue at 1, dark navy at 16, with a
glossy specular highlight on hover. Terrain's density ramp (`design-language.md` §3.4) fills the cell
instead. That is deliberate and it is defensible on its own terms: a bubble encodes magnitude by
area, which is the least accurately-read visual channel available, and it leaves the cell's own
boundary unmarked so an empty cell and a low cell look alike. A filled cell reads as a region of the
map, which is what this widget claims to be.

**Three density states, computed relative to this matrix rather than against absolute thresholds:**

| State | ZH | Meaning |
| --- | --- | --- |
| Crowded | 地雷區 | High count. Defended ground; differentiation will be hard. |
| Emerging | 新興區 | Low count, rising recently. Someone just started here. |
| Open | 處女地帶 | Zero or near-zero. Nobody has claimed it. |

**The zones are Terrain's, not IPtech's — established 2026-09-04.** The populated matrix (screen
`24`) carries **no zones at all.** No 地雷區, no 新興區, no 處女地帶, nowhere on the screen. What it
carries instead is `Mark Colors` — a red / amber / green swatch trio with an eraser, sitting in the
control bar. The strong reading is that the zones are **an analyst's manual annotation applied with a
traffic-light paint tool**, not an engine output.

Two consequences, and only the first is a change.

- **§8 lists *the three zones* as a capability Terrain takes from IPtech. That row is probably
  wrong** — and it is **deliberately left at that value**, because we are not concluding from an
  absence. It goes to Innovue as §10.13 instead. It is the one row in the ledger sourced from a blog
  post that the platform then failed to corroborate, and §8.5 flags it as such.
- **Nothing here changes.** The three states above are defined as *computed relative to this matrix*,
  which is Terrain's own arithmetic over its own result set. They never depended on IPtech computing
  them, and they do not now. What was wrong was our belief that we were inheriting them.

*And the absence is an argument, not an embarrassment.* If a trained analyst has to paint the zones
by hand, then rendering them automatically is the thing Terrain adds — which is a better position
than matching a feature.

**Why this is the hero.** A search tool returns a list, and a list cannot show a gap — a gap is an
absence, and absences cannot be enumerated. The matrix is the only artifact that renders absence
visible. That is question three from [brief.md](brief.md) §1, and it is structurally impossible in a
results view.

**Caption, inside the widget.** Two or three plain sentences naming what is crowded, what is open,
and **how much of the crowding is live and US-filed**. Those sentences are the map's *finding* and
stay on the card.

**The caveat below moved, 2026-08-31.** It is now carried by an info affordance in the card head
rather than by a fixed sentence under the map. This is a deliberate amendment to a section that
called its caption mandatory, and it is conditional on all four of the following. If any one of
them stops being true, the caveat goes back on the card:

1. The affordance is present on **every** widget, not only where a caveat is long.
2. It is a real `<button>` — reachable by keyboard, `aria-expanded`, focus returned on close, and
   dismissible with Escape. Not a hover-only tooltip, which is invisible on touch and absent from
   every screenshot.
3. It opens on hover **and** focus **and** tap, and stays open while the pointer is inside it.
4. The **labelling** this section requires is still on the card and never inside the popover: the
   legend naming Crowded / Emerging / Open, and the rising hatch.

The reasoning: four fixed sentences under four cards were competing with the generated lines above
them for the same attention, and losing. The caveat is a thing the founder needs **once**, and needs
to be able to find again — which is an affordance, not a paragraph. What it must never become is
hover-only chrome, because then the map's blind spot is stated nowhere a screenshot or a keyboard
can reach it.

**The blind spot, stated plainly:** an empty cell is ambiguous. Nobody has patented plastic blades
for noise reduction — that is either an opportunity or a sign that plastic is inherently louder and
everyone knows it. **The map shows where nobody is; it cannot say why.** Never let the interface
imply otherwise.

**A second reason a cell can be empty, added 2026-09-07 with §4b: the founder's own cut.** The map is
built over the set approved at §4b, not over everything the search returned. So a cell can be empty
because nobody filed there, **or because what was filed there is not in the corpus** — and the second
is a reason the interface itself created, which makes hiding it worse than hiding the first.

> **The map carries a standing note of what it was built on**, in the page head, on every visit —
> *built on N of M matched*.

Four conditions, in the same spirit as the info affordance's four below. It is **standing**, not a
toast and not a dismissible hint; it is present on **moment 6 as well as moment 5**, because a return
visit is where the founder has forgotten what they picked; it names **both numbers**, since *built on
60* without the total says nothing; and it is not a control — changing the corpus is a scope change
and routes through §5 like any other.

*If the corpus ever stops being founder-cut — if §4b's selection is removed, or the cut becomes
whole-set by default — this note is no longer required and should come off rather than linger as
decoration.*

**IPC confidence signal.** Compare the system's grouping against the official IPC classification of
the same patents, and surface the agreement as a quality indicator. IPC is the only part of this
pipeline that is not AI-generated — the patent office assigned it — so it is the one available check
on a system that otherwise infers everything from a sentence. *Open: how to present this without
turning it into a statistics lesson.*

- **Interaction:** click a cell → the drill-down list (§7). Never a re-search.
- **Axis labels are plain English. Never IPC codes.**
- **Edge states to spec:** too few results to form a matrix; only one dimension resolves; every cell
  crowded; every cell empty.

---

### 6.2 · Rivals · 競合分析

Named companies holding ground near the idea. Company, patent count in scope, closest cells, and
most recent filing date.

**Deduplication is the entire value.** Without 名稱統一 (name unification) and 同族合併 (family
merge), "DJI", "SZ DJI Technology" and "Dajiang" are three rows and a single invention counts nine
times. The list is worthless without both, and a founder has no way to notice it is wrong.

Default sort by count, but surface **most recently active** separately — a competitor who stopped
filing in 2019 is a materially different fact from one filing now, and the count alone hides it.

- **Interaction:** click a company → the drill-down list, scoped to them.
- **Open:** the data source for distinguishing an incumbent from a small player.
- **Edge state:** no rivals found is a real and meaningful result. Say so in words. Do not render an
  empty table.

---

### 6.3 · Filings over time · 宏觀趨勢分析

Filings per year within scope; optionally split by top companies. Tells the founder whether the
space is heating up, cooling, or peaked years ago.

**Mandatory, not optional:** patents publish roughly 18 months after filing, so the most recent ~18
months of any filing chart is always artificially empty. **That window must be greyed or hatched and
explicitly labelled as incomplete.** Left raw, a founder reads a data artifact as "this space is
dying" and draws exactly the wrong conclusion.

Caption states heating / cooling / flat in words. Do not leave the reading to chart literacy. That
sentence is the widget's finding and stays on the card.

**And it carries a second sentence, added 2026-09-04: is this space early or late.** That is
IPtech's `Patent Count - Life Cycle` (screen `20`), and this is where it lands — **as words, not as
a chart.** Filings per year says the space is busy; it cannot say whether the busyness is a few
holders filing hard or many holders arriving, and those are opposite situations for a founder. The
distinction is the count of *distinct holders entering per year* against the filings, which is
exactly what IPtech plots as a phase-space trajectory of ~50 labelled self-crossing points that its
own index calls near-unreadable. A quadrant-read scatter is the most analyst-shaped form in that
whole family, and this user does not speak patent. **So Terrain computes it and says it**, in the
caption it was already writing. §8.1 carries the ledger row; §10.22 is the input it needs.

**The publication-lag explanation moved to the info affordance, 2026-08-31**, under the same four
conditions as §6.1. The *labelling* this section calls mandatory is untouched and stays on the card:
the window is still shaded, still ticked at the baseline, and the chart legend still carries a
swatch naming it. The popover now carries the *why* — that patents publish about 18 months after
filing — which is an explanation, not a label. A founder who never opens it still sees that the last
window is excluded.

**The swatch reads `Not yet published`, and it read `Incomplete` until 2026-09-04.** The band was
red then, and both changed together: red is the expired hue, so the pair said *this data is bad*
where the fact is *this is not yet known*. `design-language.md` §3.5 carries the reasoning and the
token.

- **Edge state:** fewer than a few years of data in scope.

---

### 6.4 · Lineage · 技術脈絡分析

Who holds the ground this approach grew out of — the party a founder would license from or design
around.

**v1 is a reduced form:** the three to five most-cited patents in scope, with holder and date.
**Not a network graph.** A citation graph is noise to someone with no patent background, and
rendering one would be effort spent making the weakest widget look expensive.

Recorded honestly: this is the least valuable of the four for this ICP and the hardest to build. It
ships rough. Map dominance is partly what allows that.

**The counterpart is identified, 2026-09-04.** 技術脈絡分析 came from a *search listing* and had
never been matched to a screen — the comparison deck's panel 07 was deliberately unpaired because of
it. It is **`Switch To Ai Insight`**, the toolbar action on every M-Map and T-Map screen: a generated
narrative that traces the field across three eras and then names five core technology concepts with
their relationships and representative patents. It closes its own first section with *"整體而言，本專案
**技術脈絡**正從「單機飛行性能優化」轉向…"* — using the exact term for what it produced. Screen `28` in
[`iptech-screenshots-identified/README.md`](../iptech-screenshots-identified/README.md) §2.16.

**This is our reading, not Innovue's confirmation**, so §10 keeps a one-line check on it.

**And it is a better answer to this widget's question than this widget is.** A three-era narrative
answers *how is this space moving* more directly than a most-cited table does, and §2.16 shows the
engine already produces it. **Decided the same day: the table stays for v1 and the narrative is
recorded as a candidate, not adopted.** Reopening a settled widget was the larger change of the two
available, and §7a.4's landscape summary is where that capability actually sits — so if the narrative
enters Terrain it should enter there, once, rather than here as a second thing that resembles it.

---

## 7 · Drill-down — a list, not a page

Clicking a cell or a company returns **a list**. There is no individual patent page in v1.

Each row carries four fields and nothing more:

1. **One line of plain English** describing the patent — AI速讀Pro.
2. **Holder**, deduplicated by 名稱統一.
3. **Year.**
4. **Live or expired** — 法律狀態. One field, not a view. It is the single most decision-relevant
   fact for a US founder — an expired patent is not a threat, it is free to use — and it costs one
   word per row.

**The map is the product; the patents are evidence.** Evidence has to be legible, not explorable.
Everything that would make a patent explorable — full decode, drawings, match highlighting,
per-patent IPC *with a plain-English gloss*, unread state — is deferred (§9). *The bare IPC
identifier is not: §7a.3's counsel handoff carries it as an identifier, which is the opposite of
making a patent explorable.*

*The list in this section is one of two, since 2026-09-07.* §4b's set uses the same row, the same
four fields and the same handoff, before the map exists rather than after it. **The cap is the same
in both places, and the two controls §4b adds — a star and a checkbox — are controls, not a fifth and
sixth field.** If they ever start carrying information about the patent rather than about what the
founder is doing, that is the cap being broken by another name.

*Dismissal left the list above on 2026-09-07 — see §9. It is not explorability; it turned out to be
§4b's star pointed the other way.*

*What a founder does once a row worries them is **built, and open** at §7a.3: the row expands onto
five identifiers for counsel — number, holder, jurisdiction, status, IPC — and stops there. That is
a **handoff**, not a detail page, and it reaches §9's attorney-handoff prize without an export. It
is **provisional** — §7a.3 has not chosen between it and a detail page, and this line said "settled"
until 2026-09-04.*

**Confirmed as a divergence, 2026-09-04 — and the sharpest one in §8.** We had assumed this row
matched IPtech's cell drill-down. It does not: IPtech has no cell drill-down. Hovering a populated
matrix cell opens a popover carrying the two axis labels, `Patents : N`, and **five pivot links** —
`(Current)Assignee | Country | Appl. Year | Pub. Year | Inventor`. The count is inert. Every route
out of a cell leads to *another chart of the same cell*, never to the patents inside it. Screen `31`,
four states, §2.19 of the screenshot index.

So the cell answers *show me another breakdown of this*. The question this section is built on —
**should I care about this?** — is one a pivot menu structurally cannot answer, whatever it pivots by.
That is the argument for the list, and it is now evidenced rather than assumed.

*One interaction was considered and not adopted.* Hover puts a crosshair down the cell's whole row
and column, which on a sparse matrix is what makes an empty cell read as the intersection of two
named things rather than a blank box. Recorded in §2.19 as observed; **not specced this pass.**

---

## 7a · The post-map layer — OPEN, brainstormed 2026-08-31

> **Status, revised 2026-09-04.** This section exists because a session asked the question the rest
> of this document does not answer: **a founder has their map and believes it — now what?** It said
> *"everything in this section is proposed, not decided"* while three of its subsections were
> specced in [design-language.md](design-language.md) §7 and built in the prototype. Four tiers now,
> and nothing is proposed by default:
>
> | | Status |
> | --- | --- |
> | **§7a.2** widget page · **§7a.4** landscape summary | **Closed by build.** Specced, built, and in scope. |
> | **§7a.3** patent level | **Open, and built provisionally.** The handoff row exists and works; the decision between it and a detail page is *not* made. Every place it appears says so. |
> | **§7a.1** the governing rule · **§7a.5** next actions · **§7a.6** watch · **§7a.7** update-log capabilities | **Proposed.** §7a.6 is blocked on §10.9. |
> | **§7a.8** what the founder walks away with | **Further back than proposed.** A thinking record. Not to be built or designed against. |
>
> Read §7a.0 before treating any of it as scope.

### 7a.0 · What was authorised, and what was not

`CLAUDE.md` forbids designing against §9 "unless the session explicitly names the item and asks for
it." In the 2026-08-31 session three were named, so the deferral is lifted *for design*, not for
build:

| Named | §9 entry | What that permits |
| --- | --- | --- |
| The widget page | — (not in §9; collides with §2 and §7 instead) | §7a.2 |
| The patent detail page | "The patent detail page" | §7a.3 — written up as a decision, with a recommendation against |
| Alerts | "Filing alerts · 專利預警" | §7a.6 |

**Not named, and therefore untouched: export.** It stays out on a stronger basis than deferral —
`brief.md` §1 is a lock: *"Terrain is software, not a report… nothing is delivered as a document."*
Nothing below proposes one, and §7a.3 is deliberately designed to reach §9's attorney-handoff prize
*without* one.

**Amended 2026-09-04 — the question was named, and export is still not the answer.** A session
asked what the founder walks away with. That is **§7a.8, and it is an open discussion rather than a
proposal** — it ranks nothing and permits nothing to be built. It is recorded here because it runs
into `brief.md` §1 rather than into §9, so the authorisation table above does not govern it.

One thing in it *is* a decision and belongs here: **the file half of export — PDF, slide, anything
downloadable — was put to the user on 2026-09-04 and explicitly declined**, in favour of a link plus
copyable text. **Export therefore remains out by decision, not only by omission**, which is a
stronger footing than this subsection had before.

**Four** deferrals still stand untouched, not two: the **jurisdiction/status filter**, the
**tech × application matrix**, **IPC drift as an adjacency detector**, and **IPC in export /
attorney handoff**. The last of those is arguably reached obliquely — §7a.3 claims to deliver §9's
attorney-handoff prize without an export — but §9's own text was never updated to say so, so it is
counted here as standing. *Corrected 2026-09-04: this sentence said "two" against a §9 that lists
six entries.*

### 7a.1 · The rule this whole section runs on

> **The dashboard decides. The widget page explains. Nothing on a page may be needed to read the
> dashboard.**

This resolves a conflict §8 has been carrying. §8 cut the engine's charts outright — *"126 charts is
126 decisions a founder cannot make"* — and that reasoning is about **attention**, not value.
Attention is only scarce where things compete. On a dashboard every widget competes; on a page the
founder chose to open, nothing does. So the cut holds exactly where it was aimed and lifts where it
was not.

Read this as a **reinterpretation of §8's cut, not a reversal.** The test that keeps it honest:

> *If a founder never opens a single widget page, have they lost a finding?*
> If yes, that content belongs on the dashboard or nowhere.

Everything in §7a.2 has to pass that test, and §6.1 still binds every page: **nothing may state or
imply *why* a cell is empty.**

### 7a.2 · The widget page — a further surface

**This amends §2.** "Two surfaces rather than five screens" became **three: conversation · map ·
widget** when this was written, and **four** once the set surface landed on 2026-09-07 — §2 carries
the current list. Recorded as a deliberate change with its reasoning, so it is not read later as
drift.

What survives the amendment: the widget page is a *destination*, never part of the flow. Every
moment is unchanged, no page is on the path to a map, and §2's argument — that a founder should not be
handed between rooms for one exchange — is untouched, because opening a page is not an exchange.

One shell, four pages. Each opens with **its finding in words** and then its evidence.

| Page | ZH | Beyond what the dashboard shows |
| --- | --- | --- |
| The map | 技術功效矩陣 | The full matrix with room; the three zones named; per-cell entry to the drill-down. Opt-in: 專利集群分析圖表 cluster view. |
| Rivals | 競合分析 | Per holder — 名稱統一 resolved identity, 同族合併 family-merged counts, live/expired split, filing recency, 公司相互引證分析 who-cites-whom, SEPs 標準必要專利 flag, listed-company link. |
| Filings | 宏觀趨勢分析 | **One point per year, not the dashboard's nine binned periods** — at page width the binned series reads as a zigzag. A range control (`All · 10 years · 5 years`) crops the axis; the unpublished window keeps its real width in years, so at five years it occupies 38% of the chart. The publication-lag exclusion is **explained** rather than only shaded. |
| Lineage | 技術脈絡分析 | Most-cited with what builds on each, and family members. §6.4 concedes this ships rough and is the weakest of the four — a page is where it stops being an afterthought without costing the dashboard anything. |

**Two of these are not clickable today at all.** The map cell and a rival row both open the same
generic list; Filings and Lineage have no click-through. Whatever is decided here, that asymmetry is
a bug in the current build.

### 7a.3 · The patent level — a decision, not a design

The founder's questions run in order:

1. *Who else is here?* — Rivals answers it. No patent needed.
2. *Is this cell really crowded?* — the drill-down list answers it. §7's four fields, and in
   particular the one-line 速讀 summary plus live/expired, already answer **should I care about
   this?**
3. *Does this specific patent block me?* — **a freedom-to-operate question. A legal judgement.**
4. *How do I take this to someone?*

Question 3 is the one Terrain must not answer, and a claim-reading interface implies it can. Every
one of §9's six deferred detail-page elements — AI閱讀Pro full decode, 多圖顯示模式, 記號關鍵字,
專利未讀標記, 進階分類, and per-patent IPC with a plain-English gloss — exists to serve question 3. They are built for someone *studying* patents, which is the
analyst workflow §8 cut and the user `brief.md` §1 says Terrain is not for. **On that reading §9's
deferral was right, and the thing worth un-deferring is not the detail page.**

*Amended 2026-09-07 — one of the six was un-deferred, and this paragraph's test is what let it
through rather than what was overridden.* §4b's star is 進階分類 inverted: it is used **before** a map
exists, on a set nobody has read closely, and it changes an ordering rather than answering anything
about a patent. It fails to serve question 3, which is exactly why it is admissible. **The other five
still serve it and stay deferred**, and the sentence above holds for them unchanged.

**Recommendation: build the handoff, not the page.** The drill-down row expands *in place* to the
identifiers counsel needs — number, holder, jurisdiction, status, IPC — and nothing that resembles
analysis. It keeps §7's *"evidence has to be legible, not explorable"* intact, it answers the only
patent-level question Terrain may honestly answer, and it delivers §9's own stated prize —
*"IPC is the shared language the moment a founder talks to counsel"* — **without an export**, which
is why it never touches `brief.md` §1.

The counter-case, recorded fairly: a widget page whose list dead-ends re-raises the same question
one level down, and a founder who cannot see *anything* about a patent that worries them may go
looking in Google Patents, which is a worse experience Terrain does not control.

**Open. Decide between the handoff row and the full detail page.**

*Reviewed 2026-09-04 and deliberately left open.* The handoff row was built anyway — it is specced
in [design-language.md](design-language.md) §7, shipped in the prototype, and listed in
[case.md](case.md) §6.2 — so the honest position is **built provisionally, decision pending**, and
every place it appears now says that rather than implying this section closed. The recommendation
above still stands and the counter-case is still live as §8.1's challenge; what has not happened is
a decision. Screen `25` strengthens the recommendation without settling it: IPtech's own record view
carries full decode, figures, IPC glosses and a similarity score, which is exactly the screen with
its own gravity this section warns about.

### 7a.4 · Summarise the landscape

Half-specced already. §6.1 and §6.3 both mandate a **per-widget caption** carrying "the widget's
finding," in two or three plain sentences. What does not exist is a **project-level** one — absent
from these documents rather than rejected by them.

*Superseded in scope 2026-09-04, not in reasoning.* The assembled summary is now **part two of
§7a.8's deliverable** rather than a standalone proposal, and it moves from the map to a shareable
dated page. Everything below still governs it — in particular the two tests, which §7a.8 inherits
unchanged and leans on.

The proposal is the narrowest possible version: **the four findings assembled**, written the way the
captions already are, living on the map as prose. Not a new kind of object, not a new voice — the
same generated sentences, in one place, so the answer to "what does all this say" is readable in one
pass rather than reconstructed from four cards.

Two tests it must pass, and they are the whole design:

- **§6.1.** It may not say or imply *why* anything is empty. "Nobody has filed in three of these
  five cells" is a fact. "Three cells are open to you" is a verdict.
- **`brief.md` §1.** It may not become a document or read as report language. Generated prose in the
  UI is already precedent — the captions are exactly that — but the moment it acquires a title page,
  a download, or the word *report*, it has crossed the line the brief locks.

### 7a.5 · Next actions — and the line they cannot cross

Named by the session after the collision was flagged, so it is designed with the constraint stated
rather than worked around.

> §6.1: **"The map shows where nobody is; it cannot say why.** Never let the interface imply
> otherwise."

A "file here" button *is* that implication. The distinction that makes this buildable:

| | Example | Allowed |
| --- | --- | --- |
| A verdict about the landscape | "This is your opportunity" · "File here" · "Avoid this" | **No.** This is exactly what §6.1 forbids. |
| A fact stated as a prompt | "Three of the four patents here are expired" | Yes — a caption with a click. |
| Something to do **in Terrain** | Narrow to live only · Add this approach · Watch this cell · Take this to counsel | Yes. |

The third row is the honest reading of "next action": **Terrain proposes its own next move, never
the founder's business decision.** It is also the only one of the three that has anywhere to go —
each item is an existing surface (§5's confirm, §7a.6's watch, §7a.3's handoff).

### 7a.6 · Watch this space, and the gap it closes

§9 defers filing alerts while naming the cost in full:

> "**this is the strongest recurring-value feature in the engine, and without it v1 launches with no
> subscription rationale beyond re-running searches.** A founder searches, gets an answer, and has
> no reason to return next month. That gap needs an answer before pricing is set (§11)."

**The proposal: watch a cell, or watch a holder.** Scoped to something the founder already pointed
at, so it needs no new mechanism — it inherits §5's confirm gate and §3's saved object, and it
arrives as a version-shaped event, which History already renders.

Two things make this cheaper than §9 assumed. The engine ships **專案更新通知** today — optional
email when new patents land in a project — plus **一鍵搞定專案更新** to apply them; and moment 5
currently has *no* concept of "what changed since you were last here," so watching gives the return
visit a reason to exist that §2 does not otherwise provide.

**Blocked on three §10 questions, all unanswered:** §10.9 *is 專利預警 available programmatically*,
§10.8 *per-run latency and unit cost*, §10.10 *resale licensing*. Until §10.9 closes this is not
known to be buildable at all.

Marked as **the candidate answer to §11's pricing blocker**. It is not built, and it should not be
built before §10.9.

### 7a.7 · Engine capabilities found on the update log — folded into §8

**Superseded 2026-09-04.** This subsection held twelve capabilities sourced from Innovue's update
log and product page that §8's table predated and did not carry. **They are now rows in §8.2**,
where they carry a verdict and a founder question like everything else, and most of them read
`Omit · later` — real, wanted, not v1, not formally deferred.

Kept as a pointer rather than deleted, because §7a.2 and §7a.6 cite this section by number for the
claim that they draw on real capability rather than invention. That claim now rests on §8.2.

**None of them are in v1.** Two are worth restating here because other subsections depend on them:
**專案更新通知** and **一鍵搞定專案更新** are already built in IPtech, which is what makes §7a.6's
watch mechanism materially cheaper than assumed — and §7a.6 remains blocked on §10.9 regardless.

---

### 7a.8 · What does the founder actually walk away with? — OPEN DISCUSSION

> **This subsection decides nothing.** It is a thinking record, opened 2026-09-04, kept because the
> question is load-bearing and the reasoning around it is easy to lose. Everything in §7a is
> proposed rather than decided; this one is deliberately further back than that — the options below
> are *not* ranked into a recommendation, and no part of it is to be built or designed against.
> When it settles, it settles as a decision written somewhere else, and this becomes the record of
> how we got there.
>
> **It goes outward as of 2026-09-04**, condensed into [case.md](case.md) §9's closing subsection
> under its own heading and **outside the numbered list**, so the §9.n ≡ §10.n contract survives and
> so nobody mistakes it for something we are asking Innovue. It is carried **unranked** — this
> subsection declines to recommend and the outward version declines with it. This file remains the
> full record; that one is a summary of it.

#### The question

**Even with the feature read correct and the founder-facing subset right — what is the actual thing
a founder walks away with?**

§7a already asks *"a founder has their map and believes it — now what?"* and answers it three times:
widget pages, next actions, watching. Every one of those keeps the founder **inside** the product.
None is a thing they carry out.

The user's own framing, and it is better than ours: a founder should be able to go to their funders
or their institution and say ***"we're heading this direction because of findings in Terrain"*** —
but that has to be packaged as something, and right now it is packaged as nothing.

#### Why the question has no answer today

Four separate decisions, each defensible where it was made, none of them wrong on its own terms.
Nobody checked what was left standing after all four:

| Decision | Where | Reason given |
| --- | --- | --- |
| Auto-generated reports cut | `case.md` §4.G | *"Founders have no boss"* |
| Project sharing cut | `case.md` §4.E | *"A permissions model is enterprise shape"* |
| Project-level summary | §7a.4 | Half-specced, still open |
| Export | §9, §7a.0 | *"There is no export in v1"* |

Subtract all four and the honest answer is **a live map, inside a subscription the founder must keep
paying to look at again.** That thinness is also part of why §11's pricing question is still open —
§7a.6 treats *why return* as the whole problem, and *why pay at all* is a different one.

#### The correction that reopens it

§4.G cut reports partly on: *"the reason an IP manager values a report is that they hand it upward.
**Founders have no boss.**"*

**The second sentence is wrong.** A founder has *more* people to convince than an IP manager does —
they are simply not organisational superiors. Funders. The institution backing them. A co-founder or
an early hire. A grant committee. And `brief.md` §1 names universities and accelerators as the
**paying channel**: if an accelerator buys thirty seats, it is one of those audiences, and *"each
founder has a map they can log into"* is a weak renewal conversation.

**The corrected premise does not restore the report**, and the cut in §4.G stands. What follows is
narrower: *there must be an artifact, and it must not be a report.* What was missing was anything in
its place. `case.md` §4.G carries the corrected reasoning; the record of the correction stays here,
because an outbound document should carry the conclusion and not the history of reaching it.

*One framing that was tried and rejected in the same conversation:* that the walk-away is the
**attorney handoff** — the five identifiers of §7a.3, taken to counsel. It is a real output and it
is already specced, but it is **not this**. Prior art for a lawyer is a different job for a different
audience, and reaching for it was reaching for something already written rather than answering the
question. The founder's walk-away is a **direction**, not a legal input.

#### Three things that constrain any answer

Worth stating before the options, because they eliminate whole shapes.

1. **§6.1 — the interface may not say *why* a cell is empty.** No verdicts, no *"file here"*, no
   *"this is your opportunity"*. Any artifact that reads as a recommendation from Terrain breaks
   this.
2. **`brief.md` §1 is a lock** — *"software, not a report… nothing is delivered as a document."*
   §7a.4 already wrote the test: **a title page, a download, or the word *report* is the line.** A
   page with a URL is software; selectable text is not a document; a PDF is.
3. **Stage-neutrality.** `brief.md` §1: the founder may have *"filed, mid-filing, or nowhere near it
   — Terrain should not assume one."* Asked directly on 2026-09-04, the user was explicit that the
   audience should **not** be narrowed to investors: *"it's general next directions to whatever
   state a start-up is; they're various levels of stages."* So no copy may assume a fundraise, a
   filing, a board, or an institution — it has to read correctly to a solo founder with an idea and
   no company.

#### A distinction that came out of the discussion, and is worth keeping either way

The obvious objection to any founder-authored artifact: *the founder already described their idea in
chat, so doesn't Terrain have this already?*

**No — and the distinction is the useful part.**

- **The idea** is the *input*. Captured at §4's confirm card, decomposed into the map's rows and
  columns.
- **The direction** is what the founder concluded *after reading the map*. It does not exist until
  they have seen it.

What Terrain *does* hold is the raw material — the cells the founder opened, the questions they
typed into chat (§5), the scope changes they confirmed. Which suggests a mechanism, if a
founder-authored option is ever taken:

> **Terrain drafts the direction from what the founder did; the founder edits or replaces it;
> nothing is shared until they approve.**

That is **§4's own pattern run at the other end of the session** — §4 confirms what they meant going
in, this would confirm what they concluded coming out. Same component, same gate, no new interaction
model.

And it is the one construction that stays inside §6.1, *if* the boundary is held precisely: Terrain
may draft only from what the founder **did** — *"you have been looking at passive thermal"* is a
transcription. *"Passive thermal is your opportunity"* is a verdict. Where the founder engaged with
nothing in particular, Terrain would have nothing to draft and should say so rather than invent a
direction to fill the field.

**A second thing to preserve:** the direction may be a **narrowed question**, not only a reached
answer. *"We're choosing between passive and active thermal, and here is what we know about both"*
is a legitimate position and at the earliest stage it is the most common one. Forcing a commitment
the founder has not made produces a confident artifact and a false one.

#### The candidate forms — unranked

Four shapes were sketched on 2026-09-04. **None is chosen.** They are not mutually exclusive; B is A
plus a sentence, D is B plus time.

**A · Evidence only — a read-only link to the live map.**
The product is the artifact. Cheapest by a distance, no new object, no new copy, and it cannot
overstate anything because it states nothing. *Against:* the recipient has to interpret a matrix, and
the founder still has to write the story somewhere else — which is exactly the work they wanted
help with. It shows the ground and leaves the direction unsaid.

**B · The direction, in the founder's words, over the findings that support it.**
The founder's sentence at the top; three to five generated findings under it; the map beneath. The
persuasive one, and §6.1-safe because the verdict belongs to the founder and Terrain only supplies
the ground. *Against:* it is a new object with a new authoring step, and the draft-and-approve
mechanism above has to actually work or the field sits empty.

**C · Terrain's summary of findings, no direction at all.**
§7a.4's assembled captions, made shareable. Facts and numbers, strictly no verdict. Safest of the
four and closest to what already exists. *Against:* it stops one step short of the thing the founder
needs to say, and a list of facts is not a direction — which is the whole point of the question.

**D · A position, recorded and re-checked over time.**
B, plus *"you set this in March; here is what has changed since."* Interesting because the
deliverable and the **return reason** become the same object, and it would answer §11's pricing
blocker without waiting on §10.9 — re-running our own search is in our control where 專利預警 is
not. *Against:* it depends on §10.8's per-run cost, which is unanswered, and it is the largest build
of the four by some way.

#### Where the thinking currently leans

Recorded as leanings from the 2026-09-04 conversation, **not as decisions.** Two were direct answers
to direct questions and should carry more weight than the rest:

- **Portability — link plus copyable text.** A read-only URL, and selectable text that can be pasted
  into an email or a slide. **The downloadable-file option was put to the user and actively
  declined**, which is a real decision and closes the strongest threat to `brief.md` §1. Note it
  also protects the human-produced Survey tier from being undercut by a cheaper artifact that looks
  like the same object — a commercial argument nobody had written down.
- **Freshness — a dated snapshot with the live map behind a link.** So the founder is never
  contradicted by their own updating link, and so a finding can be quoted in six months or in a
  grant form.
- **Content — genuinely open.** The user asked for a recommendation rather than picking, then asked
  the chat question that produced the idea/direction distinction above. Leaning toward **B**, but it
  is a leaning and the argument for **A** on cost is real.

#### What would settle this

- Does the artifact carry a **conclusion** or only **evidence**? Everything else follows from that
  one answer, and it is the axis A–D actually vary on.
- If it carries a conclusion, does the draft-and-approve mechanism produce something a founder
  would actually send? That is testable cheaply with a written example before any build.
- **What it is called.** Not *report*, *brief*, *summary* or *memo* — all document nouns that would
  undo constraint 2 by themselves. Recorded in §11.
- Whether positions accumulate per project or supersede each other. **D only works if they
  accumulate**, so this quietly gates the most interesting option.
- Whether the link expires, and whether it can be revoked.

## 8 · What Terrain takes from IPtech — the ledger

**Rewritten 2026-09-04, keyed to observed screens.** The previous table was built from a *marketing*
audit on 2026-08-31 and said of itself *"it is incomplete"*. It was. Two capture passes inside the
platform produced 31 identified screens, eight of which were catalogued nowhere, and the record had
fragmented across five documents at five different grains. This section is now the **single
canonical mapping**, and everything else is a view of it:

| Record | Was | Now |
| --- | --- | --- |
| §8, this table | 21 capabilities, marketing audit | **the ledger** — one row per observed surface, one verdict each |
| §7a.7 | 12 update-log capabilities not in §8 | folded in below as `Omit · later` rows |
| [case.md](case.md) §4.A–G | 43 rated capabilities, marketing-sourced | **50, re-rated against the screens 2026-09-04** — the outbound *reading* of this ledger |
| [case.md](case.md) §4.H | the 68-entry analysis menu, tiered | still the finer-grained menu record — §8.3 points at it |
| [screenshot index](../iptech-screenshots-identified/README.md) §1 | 31 observed screens | the **evidence** column below |
| §6, §7a, §9, §8.2, `design-language.md` §7 | five places explaining why a High-rated capability is not on screen | **§8.6** — one table, one state per capability |

**Five verdicts, not four.** The set began as Match / Diverge / Omit·deferred / Omit·cut, and a
whole population resisted all four: capabilities that are real, wanted, and recorded — but not in v1
and never formally deferred in §9. Forcing them into `cut` would have been a lie about our own
intent. So:

| Verdict | Means |
| --- | --- |
| **Match** | Terrain does this, recognisably the same thing |
| **Diverge** | Same founder question, deliberately different form. **The interesting rows.** |
| **Omit · deferred** | §9, which carries the reasoning. Not built, not specced, not designed against |
| **Omit · later** | Real and wanted. Not in v1, not formally deferred. Recorded so it is not re-discovered |
| **Omit · cut** | Cut with a reason, and not coming back |

---

**Amended 2026-09-07, and the amendment is about what this ledger is *for*.** A verdict here records
what **Terrain builds**. It was also being used, wrongly, as the gate on **what we ask Innovue
about** — `design/previews/iptech-feature-request.html` was built by taking this section's `Match`
and `Diverge` rows and sending exactly those to Innovue.

**That coupling is now cut.** Terrain's scope is not settled, and an outbound question capped by
unsettled decisions is a question we only get to ask once. *A capability left off the ask is one
Innovue never tells us about; a capability asked about and later dropped costs nothing.* The
feature-request sheet therefore carries no verdict column at all. **This section still governs what
gets built. It no longer governs what gets asked.**

*The sheet was briefly the wider of the two — 75 rows over two pages, sweeping every menu
destination, search filter and toolbar control, on 2026-09-07.* **It was cut back to 33 the same
day, and the reason is worth keeping:** Innovue knows what their own product does, and a sheet that
spells out `Search › Number` spends their attention on what neither side doubts while burying the
handful of capabilities Terrain stands on. It is now organised on **IPtech's own top navigation** —
Search · Fishbone · View · Hierarchy · M-Map · T-Map · Project, then engine capabilities — at one
row per capability rather than per destination. **The sweep is not lost: it is this section**, and
the rolled-up rows still name their destinations in the location column, so `Country › Distribution`
and `Patent Count › Trend` are still asked for by name.

*Corrected the same day, after a review caught the roll-up under-reporting itself.* The first cut
named only 8 of `Company`'s 17 entries and omitted the `Patent Country`, `Inventor` and `Examiner`
dimension groups outright — carrying this ledger's own **Omit · cut** reasoning ("an analyst's
frame", "duplication") into a document that is not supposed to be gated by our verdicts. **Rolling
up is allowed to compress a group; it is not allowed to silently drop one.** All 11 M-Map groups and
all 8 `Tech-Effx` entries are now named, and the sheet accounts for **68 of 68** destinations.

*A second review the same day ran the audit the other way — every Terrain element against the sheet —
and found the sheet complete about IPtech's **features** and silent about how Terrain reaches them.*
Twelve of roughly twenty-seven built elements depended on something no row asked for: 技術定義表
behind the confirm card (recorded five times in this document, absent from the sheet); the plain
summary and legal status **in bulk across a set** rather than one patent at a time; ranking against a
supplied patent for §4b's star; and all eight of `design/components.md` §4's data-shape
questions. **A document organised on someone's navigation has nowhere to put a question about access
or shape** — so the sheet now carries three more capability rows (36) and a closing block of nine
questions covering programmatic access, bulk operation, two-window matrix runs, scoped citation
counts, publication lag, distinct assignees per year, structured 技術脈絡分析 output, programmatic
projects, and whether a result returns what was excluded. That last one is §10.20 and bears on
whether our counts and theirs are comparable at all.

*The audit that produced that sheet also found this section incomplete, which is the second reason
for the amendment.* §8.5 called §8.1 and §8.2 "the single canonical mapping"; they were not. The rows
added below on 2026-09-07 are marked **`+ 2026-09-07`**, and §8.5's counts are corrected there.

---

### 8.1 · Observed surfaces

Every one of the 31 identified screens has exactly one row here. `Screen` numbers are the stable IDs
in the [screenshot index](../iptech-screenshots-identified/README.md) §1.

| IPtech surface | ZH | Screen | The founder question it answers | Verdict | Where in Terrain | Why |
| --- | --- | --- | --- | --- | --- | --- |
| `Search › AI Search` | AI檢索Pro | `01` | How do I even start? | **Match** | The composer, §2 | One question, no filters. The only entry point a founder can use. |
| `Fishbone` — 3-step wizard | 技術魚骨 | `17` | What is my idea made of? | **Diverge** | The confirm gate, §4 | The mechanism is essential; the diagram never appears. To a founder a fishbone is an artifact from someone else's profession. Confirmed as a wizard whose branches render in Chinese — §0. |
| `Hierarchy` — classification workbench | 分類通 | `25` | *(none — this is analyst labour)* | **Omit · cut** | Nothing | **The most important row in this table.** It is where an analyst builds the taxonomy, assigns patents to it by hand, and bins what does not fit — the recycle bin held 41 of ~158. This is the work Terrain exists to remove, not a feature to match. |
| `View` — record list + AI Skim | AI速讀Pro | `18` | Should I care about this one? | **Diverge** | The drill-down row's first field, §7 | AI Skim is a real paragraph, better than the marketing audit assumed. Terrain takes one line of it per row, not the paragraph. |
| `T-Map › Tech-Effx › Matrix` | 技術功效矩陣 | `24` `15` `16` `22` `23` | Where is the ground already taken, and where is it open? | **Diverge** | **The hero**, §6.1 | IPtech draws sized bubbles with the count beneath; Terrain fills the cell. A bubble encodes magnitude by area — the least accurately-read channel there is — and leaves an empty cell looking like a low one. A filled cell reads as a region of a map. |
| Matrix cell → hover popover | — | `31` | What is actually in this cell? | **Diverge** | The drill-down list, §7 | **The sharpest divergence in the ledger.** IPtech's cell has no drill-down: the count is inert and all five links pivot to another chart of the same cell. *Should I care about this?* is a question a pivot menu structurally cannot answer. |
| The three zones | 地雷區 · 新興區 · 處女地帶 | blog — *and absent from* `24` | Is this crowded, emerging, or open? | **Match** — *held, see Why* | §6.1's three density states | **The one row in this ledger held at a value its evidence does not support.** The populated matrix carries no zones anywhere; what it carries is `Mark Colors`, a red/amber/green paint tool, which suggests an analyst applies them by hand. But **we are not concluding from an absence** — they may exist somewhere we did not look. The row stays at its blog-sourced value until §10.13 answers, and is then either confirmed or becomes a `Diverge`. *Nothing in Terrain depends on the answer:* §6.1's three states are computed from Terrain's own density over its own result set, and always were. |
| `M-Map › Company › Count` | 競合分析 | `03` `26` `27` | Who else is here? | **Diverge** | Rivals, §6.2 | Merged by default rather than behind a toggle; live-or-expired on the row; no categorical hues. `26` shows one large holder split across two rows, ranked against itself. |
| `Company › Trend` | 宏觀趨勢分析 | `05` | Is this space heating up or did it peak? | **Diverge** | Filings over time, §6.3 | Terrain shades the publication-lag window and excludes it from the trend. IPtech draws the raw tail, which reads as a collapse in filings that has not happened. |
| `Company › Share` | — | `07` `29` | How concentrated is this space? | **Diverge** | Rivals widget page, §7a.2 | A five-slice pie in five arbitrary hues — and the same data as a ranked share bar printed directly beneath it. Terrain promotes the table IPtech already has. **And the pie's denominator is the selected five, not the corpus:** `29` reads ~26% for a holder with well under a tenth of the corpus. |
| `Company › Ranking` | — | `11` `11b` | Who is rising? | **Diverge** | Rivals widget page | A butterfly chart split on a base year becomes a ranked list with a delta pill. Note §2.11: ranking by count puts dead portfolios on top — a holder at 100% overdue ranked in the top five. |
| `Company › Activity` | — | `09` `09b` | Who is still active? | **Diverge** | Rivals widget page | An expandable folder tree becomes a span bar per holder on one shared year axis. |
| `Company › Cross Reference` | 公司相互引證分析 | `08` | Who builds on whom? | **Diverge** | Rivals widget page | A chord diagram plus an N×N citation matrix becomes a directed hairline table. Direction is the information; the ribbons are not. |
| `Company › Research Ability` | — | `04` | Who is investing hardest? | **Diverge** | Rivals widget page | A radar over four incommensurable axes becomes ranked bars, one metric per column. A radar's enclosed area has no meaning when the axes have different units. |
| `M-Map › Legal Status › Company-Legal Status` | 法律狀態 | `21` | How much of this is still live? | **Diverge** | One word per drill-down row, §7; a stacked bar on the rivals page | The strongest single finding of the platform audit (§2.11). Terrain spends one word per row on it rather than a donut and a grouped bar chart. |
| `Patent Count › Patent Count - Life Cycle` | — | `20` | Is this space early or late? | **Diverge** | **The Filings caption, §6.3** — a sentence, not a chart | Close to a first-order founder question, and the marketing audit never surfaced it. **Decided 2026-09-04, and the divergence is the form:** IPtech renders a phase-space trajectory of ~50 labelled self-crossing points and its own index calls both charts near-unreadable. Terrain states the finding in words on a caption it already writes. A quadrant-read scatter is the most analyst-shaped form in the set, for a user who does not speak patent — and §6.4 reduced Lineage and Cross Reference on the same reasoning. *It still needs the same input, §10.22; a sentence just degrades more gracefully than a chart if the answer is no.* |
| `Project` | 專案 | `19` | Where did my last search go? | **Diverge** | The project rail, §3 | An IPtech project is an analyst-curated folder of thousands. A Terrain project is one idea's persisted result. *The difference is not how many patents it holds — it is who assembles the set.* |
| Toolbar → `Switch To Ai Insight` | 技術脈絡分析 | `28` | How is this space moving, and where is it heading? | **Diverge** | §7a.4's landscape summary — **closed by build** | **This is 技術脈絡分析** — it uses the term for its own output (§2.16). A three-era narrative plus five concepts with representative patents, bilingual headings, cached. §6.4 keeps the most-cited table for v1 and records this as the candidate. Identified by inference, not confirmed — §10.14. |
| `Company › Inventor Activity` | — | `10` | — | **Omit · cut** | Nothing | Inventor-level analysis is an analyst's frame. A founder competes with companies, not with named engineers. |
| `Company – Project (M)-IPC`, `Company – Company (M)-IPC` | IPC | `12` `13` | — | **Omit · cut** | Nothing *as a chart* | A radar cross-tab of company against classification to level 4. IPC survives in Terrain in one narrow role only — a confidence signal, §8.2. |
| `Company – Project (M)-UPC` | UPC | `14` | — | **Omit · cut** | Nothing | A second classification system we never catalogued. Same reasoning; more of it. |
| `M-Map` multi-chart overview | — | `02` | — | **Omit · cut** | Nothing | Four charts at once with a view-density toggle. The dashboard is fixed at four widgets chosen for us; a picker is 68 decisions a founder cannot make. *Menu path unconfirmed — §3 of the index.* |
| `Report` | 專利報告 | `30` | — | **Omit · cut** | Nothing | **Confirms its own cut.** Not a document viewer — a configuration screen: twelve settings plus four entity pickers. Generating a report means making a dozen decisions first. Also [brief.md](brief.md) §1: software, not a report. |
| `Company › Citation` | 公司相互引證分析 | `06` | Is this holder self-referential or building on others? | **Omit · later** | Rivals widget page candidate | Tech independence and citing rate are real signals. Not v1. |
| `Patent Count › Trend` | — | m-map menu | Is this whole field growing? | **Diverge** · *+ 2026-09-07* | Filings over time, §6.3 | **A Tier-1 destination that had no row.** §6.3 specs the widget as *filings per year within scope, optionally split by top companies* — corpus-level. The ledger only ever carried `Company › Trend`, which is the per-company one, so the row backing §6.3's own spec was missing. |
| `Country › Distribution` | — | m-map menu | Where is this filed, and is the US contested? | **Diverge** · *+ 2026-09-07* | Undesigned — no widget yet | **The largest single omission found by the 2026-09-07 audit.** [case.md](case.md) §4.H tiers it founder-facing; it appeared nowhere in §8. For a US founder deciding whether a space is crowded *in their market*, this is closer to a first question than most of §6. Distinct from the database-scale row, which is total reach rather than distribution within a result set. §10.5 now has a destination attached, not only a number. |
| `Tech-Effx › Country`, `Tech-Effx › Country Trend` | — | t-map menu | Which countries hold which parts of the space? | **Omit · later** · *+ 2026-09-07* | — | The matrix with country on an axis. Tiered 3 in [case.md](case.md) §4.H as "wrong axis", and that holds for the *hero*; recorded because the audit's inclusive pass surfaced them and a country cut of the map is not obviously analyst-only for a US buyer. |

---

### 8.2 · Capabilities with no screen of their own

Real, but they are properties of the pipeline rather than destinations — so there is nothing to
photograph. Evidence is the source that established them.

| Capability | ZH | Evidence | The founder question | Verdict | Where in Terrain | Why |
| --- | --- | --- | --- | --- | --- | --- |
| Auto-generated technology structure | AI魚骨 | blog, `17` | What is my idea made of? | **Match, hidden** | Generates the confirm card's rows and the matrix's axes | The mechanism carries the product. The artifact never appears. `24` shows the axes it produces are compound and specific — `自主導航 / 操控 / 通訊（含 GPS-denied）` — which is the bar §10.2 has to clear. |
| Auto-clustering + relevance ranking | AI分類Pro | product page / blog | — | **Match** | The map's rows and columns | Turns a result set into a structure without the founder classifying anything. |
| Plain-language one-line summary | AI速讀Pro | product page, `18` | Should I care about this one? | **Match** | Drill-down field 1, §7 | Blocked on §10.11 — whether it runs in bulk across a result set. Without it the list degrades into titles. |
| Applicant name unification | 名稱統一 · 名稱合併 | changelog, `03` `26` | Who else is here? | **Diverge** | Rivals, on by default | **A toolbar toggle the user must press**, not a default. `26` shows one large holder as two rows. §10.4 asks whether the coverage reaches US startups; that split suggests it does not reliably reach large US names either. |
| Patent family merge | 同族合併 | changelog | — | **Match** | Every count | Without it one invention filed in nine countries counts nine times. Assumed to travel with any result set — [case.md](case.md) §9.15 flags that if the assumption is wrong it becomes a severe question. |
| Legal status | 法律狀態 | changelog, `18` `21` | Is this still live? | **Match, as one field** | Drill-down field 4, §7 | Blocked on §10.7 — per-patent, in bulk. |
| IPC classification | — | blog, `12` `25` | *(never shown as a label)* | **Diverge** | A confidence signal only, §6.1 | The one part of the pipeline that is not AI-generated, so the only available check on a system that infers everything else. `25` reveals a per-patent `分類相似度` score — 92, 95 — which is a classification confidence the engine already computes. Blocked on §10.6. |
| Classification confidence score | 分類相似度 | `25` | How sure is this? | **Omit · later** | §6.1's open confidence signal | Newly found. It scores the *classification*, which is more useful to Terrain than IPC confidence, because the matrix depends on classification. No visual form yet. |
| AI relevance ranking | AI排序 · 關聯性排序 | update log, `25` | Which of these is closest to mine? | **Match** · *reclassified 2026-09-07* | §4b — the set's order, its recommended cut, and re-baselining from a star | Was **Omit · later** until §4b made ordering the mechanism the whole surface runs on. Present in `Hierarchy` as an `AI Sort` control. §10.38 asks whether it can rank against a supplied patent, which the star needs and the rest of §4b does not. |
| Database scale | 100+ countries · 180M records | product page, `30` | — | **Match, unverified for our market** | Everything | `30` gives the first jurisdiction split we have seen: roughly **three US filings per ten Taiwanese**, with single filings across five further countries. Scope of that project is unknown, so this does not prove thin US coverage — but §10.5 now has a shape attached rather than only a claim. |
| EU / JP / CN English abstract backfill | 歐盟核准摘要 · 日本核准摘要 · 大陸專利英文摘要 | update log | — | **Omit · later** | — | Evidence that English coverage of the underlying data is already being extended. Bears directly on [case.md](case.md) §8.2. |
| Tag keywords from patent text | 標籤關鍵字 | update log, `18` | — | **Omit · later** | Drill-down and summary | Visible as keyword chips beside AI Skim on `18`. |
| Standard-essential patent marking | SEPs 標準必要專利 | update log, `01` | Who holds leverage here? | **Omit · later** | Rivals widget page | A real signal of leverage. Filterable at search on `01`. |
| Company cross-citation analysis | 公司相互引證分析 | update log | — | **Omit · later** | Rivals widget page | See `06` and `08` above. |
| Listed-company stock links | — | update log | Is this rival public? | **Omit · later** | Rivals | Bears on §11's open incumbent-vs-startup question. |
| CPC classification search | CPC | update log, `24` | — | **Omit · later** | — | A third classification system, in the T-Map sidebar. Adjacent to §10.6. |
| Project update notifications | 專案更新通知 | update log | What changed since last time? | **Omit · later** | §7a.6 | **Already built**, which makes filing alerts materially cheaper than assumed. §7a.6 is blocked on §10.9. |
| One-click project update | 一鍵搞定專案更新 | update log | — | **Omit · later** | §7a.6 | The apply half of the same mechanism. |
| Project archival after 6 months | 專案封存機制 | update log | — | **Omit · later** | — | Lifecycle, undesigned. |
| Cluster / positioning / honeycomb charts | 專利集群分析圖表 · 市場布局拼圖 · 蜂窩圖 | update log | — | **Omit · later** | A widget page only, never the dashboard | §7a.1 governs. [case.md](case.md) §6.4 records that this distinction is still open scope. |
| Filing alerts | 專利預警 | blog / testimonial | Tell me when someone files near me | **Omit · deferred** | §9 | The strongest recurring-value feature in the engine. Without it v1 has no subscription rationale beyond re-running searches. §9 carries the consequence; §11 carries the chain. |
| Legal status by jurisdiction | 法律狀態分析圖 | changelog, `21` | — | **Omit · deferred** | §9 | The map caption states the same fact for a fraction of the cost. |
| Tech × application matrix | 技術應用矩陣 | product page | What is adjacent to me? | **Omit · deferred** | §9 | Answers adjacency more directly than the function matrix, but generating good industry columns from one sentence is the highest-risk part of the build. |
| Patent detail page — full decode, all figures, match highlighting, unread state | AI閱讀Pro · 多圖顯示模式 · 記號關鍵字 · 專利未讀標記 | product page / changelog, `18` `25` | Does this patent block me? | **Omit · deferred** | §9, and §7a.3's handoff row instead | Five elements is a screen with its own gravity, and the question underneath it is legal. §7a.3 built a five-field handoff to counsel instead. |
| Project sharing | 專案共享 | update log, `19` | — | **Omit · cut** | Nothing | Read-only-versus-edit, seats and roles are enterprise shape. Founders share by link or not at all. *The sharing question itself is live at §7a.8 — this row cuts the permissions model, not the idea of an artifact.* |
| Patent search database (sibling product) | WEBPAT | product page | — | **Omit · cut** | Nothing | A search database returns a list. A list cannot show a gap, because a gap is an absence and absences cannot be enumerated. |
| **Patent type — invention, utility model, design** | — | `01`, `30` | Does a design patent block me? | **Omit · later** · *+ 2026-09-07* | — | **Uncatalogued until the 2026-09-07 audit.** `01` carries four filter groups above the search tabs — `Patent Type` (`Invention` / `Model` / `Design`), `Case Type` (`Issued` / `Published`), `Countries` (16 listed plus `more`) and `Legal Status` (`Valid` / `Overdue` / `Public`) — and every capture we hold is an invention-patent view. A founder shipping physical product can be blocked by a design patent exactly as hard, and we cannot currently say whether the corpus even carries them. Pairs with the LOC row below. |
| **LOC · Locarno design classification** | — | m-map menu, `30` | — | **Omit · later** · *+ 2026-09-07* | — | The fourth classification scheme, four menu entries, and a real configurable dimension — `30` shows `LOC Level 2`. The string `LOC` appeared **nowhere** in this document before today, though [case.md](case.md) §4.H has been counting its four entries toward the 68 all along. |
| **Family grouping has three modes, not one** | 同族合併 | `25` `30` toolbar | — | **Match, qualified** · *+ 2026-09-07* | Every count | `Application Merge`, `Simple Family` and `Extended Family` are **three separate toolbar toggles**. The 同族合併 row above treats family merge as one behaviour, which makes §10.15 ambiguous as asked: *which* mode is on by default, and does the answer change every count Terrain shows? [case.md](case.md) §9.15 already flags this as severe if the assumption is wrong. |
| **The six merge types, as a set** | — | `03` `30` | — | **Diverge** · *+ 2026-09-07* | Every count, as defaults | Applicant/assignee, inventor, country, patent country, examiner, application. §8.6 row 12 rates the set **High** and §10.33 asks whether it is a request parameter or a UI decision — but only the applicant one had a row here, so five of six were uncatalogued. |
| **Per-patent facts on `View` and `Hierarchy`** | — | `18` `25` | Should I care about this one? | **Omit · later** · *+ 2026-09-07* | Drill-down candidates | Five things the screen carries that no row named: the **family-spread badges `Country n \| Case n`**, a **per-patent `PDF`** of the original document, **IPC rendered as readable text chips** rather than codes, **Abstract / Technical Features / Claim 1** as separate fields, and **Excel export** from both toolbars. The IPC-as-text one matters most: §9 defers "per-patent IPC with a plain-English gloss" as though it were ours to build, and `25` shows the engine already produces it. |
| **Usage metering in points** | — | `25` `30` | — | **Omit · later** · *+ 2026-09-07* | — | A points balance in the top right, decrementing per analysis run (index §2.4). Not a founder-facing feature; recorded because it is the shape of the commercial answer to §10.1, and a per-call meter prices an integration differently from a seat licence. |

---

### 8.3 · The analysis menu — 68, not 128

**Settled 2026-09-04, by us rather than by Innovue.** `26` and `27` are `Company - Count` reached
under `M-Map` and under `T-Map`: identical title, charts, values, tables and totals. The only
difference is that the T-Map version carries a `Classification` scope field which, left empty,
renders the M-Map result exactly.

**So `T-Map` is not a second analysis engine. It is `M-Map` plus a classification filter, with the
eight `Tech-Effx` entries on top.** The 60 shared entries are one analysis reachable two ways.

IPtech has **68 distinct analyses.** [case.md](case.md) §4.H's honest range of 68–128 collapses to
its lower bound, and **§10.12 was struck on that basis 2026-09-04** — we answered it ourselves. Its
number is retained rather than reused, because both question lists are append-only. Innovue's own
marketing says "126 charts"; the menu walks to 128 entries and 68 destinations.

§4.H remains the finer-grained record — all 68 tiered into 15 founder-facing, 7 analyst-shaped and
46 not for this buyer, using IPtech's own labels so a reviewer can check it against the screen. **It
is not a scope list**, and this ledger is. Where they disagree about intent, this section wins.

---

### 8.4 · Cut outright, with reasons

- **技術魚骨 as a visible object.** The mechanism stays; the diagram never appears.
- **The bulk of the analysis menu.** Innovue's own flex — *"even with pivot tables mastered, 126
  charts beat you"* — is an anti-feature here. The cut is 46 of the 68 plus the 7 qualified, not the
  whole menu: four of the fifteen founder-facing entries are the matrix family this product is built
  on.
- **Auto-generated reports · 專利報告.** Violates the software-not-a-report line in
  [brief.md](brief.md) §1, and `30` shows it is a twelve-parameter configuration screen.
  *The original second reason given here — "founders have no boss" — was wrong and was retracted
  2026-09-04. A founder has more people to convince than an IP manager does; they are simply not
  organisational superiors. **The cut stands; that reasoning does not.** What follows from the
  corrected premise is that there must be an artifact and it must not be a report — and what that
  artifact is remains open at §7a.8.*
- **泡泡圖**, figure rotate/mirror, EN→ZH translation, 匯出紀錄, full boolean search. All analyst
  tooling.
- **`Hierarchy`, `Inventor Activity`, the IPC/UPC cross-tabs, the multi-chart overview.** Per §8.1.

---

### 8.5 · The count

**59 rows across §8.1 and §8.2**, and all 31 identified screens are accounted for. *Was 50 until
the 2026-09-07 audit added nine.*

| Verdict | Rows | Note |
| --- | --- | --- |
| **Match** | 10 | One hidden, one as a single field, one unverified for our market, **one held against its own evidence** — the three zones, pending §10.13. *Was 8; AI relevance ranking joined 2026-09-07, family-grouping-has-three-modes joined the same day as a qualified Match* |
| **Diverge** | 20 | **Seven needed a chart form Terrain had never specified** — Research Ability, Share, Cross Reference, Activity, Ranking, Legal Status, Life Cycle. Two were built 2026-09-04 (Share, Ranking) and one was answered without a chart (Life Cycle, §6.3's caption). **Four remain.** *Was 17; `Patent Count › Trend`, `Country › Distribution` and the six merge types joined 2026-09-07 — and `Country › Distribution` has no design at all, so it is a **fifth** unbuilt row* |
| **Omit · later** | 17 | Real, wanted, not v1, not deferred. *Was 13, then 12 when AI relevance ranking left on 2026-09-07; five joined the same day from the audit — Tech-Effx by country, patent type, LOC, the per-patent facts, points metering* |
| **Omit · deferred** | 4 | §9 — the fifth §9 entry, IPC drift, is a proposal of ours rather than an IPtech surface, so it has no row |
| **Omit · cut** | 8 | Plus the six items in §8.4 that were never destinations: 技術魚骨-as-diagram, 泡泡圖, figure rotate/mirror, EN→ZH translation, 匯出紀錄, full boolean search |

**One correction the audit forced, and it is worth naming rather than burying in a row.** §6.3 has
always specced the filings widget as *corpus-level, optionally split by top companies* — but the only
trend row this ledger carried was `Company › Trend`, the per-company one. **The section describing
what we build and the section recording what we take had disagreed since 2026-09-04**, and neither
noticed, because no row existed for the destination §6.3 actually needs. That is the failure mode
§8.5 exists to catch, and it did not.

**Twelve of the twenty `Diverge` rows are designed and built** in
`design/previews/terrain-prototype.html` — ten from the first pass, plus Share and Ranking from the
visual-language pass on 2026-09-04. *This read ten and seven until that pass landed.*

**The four that remain are blocked by data, not by design.** *`Country › Distribution` is the
separate fifth case named in §8.5: it is blocked by design, having none.* `design-language.md` §7
specs each of the four and names what it lacks; `design/components.md` §2 names the shape each would need from the
engine. Every one of them unblocks on §10.1.

*The fifth, Life Cycle, was closed 2026-09-04 by deciding it needs no chart* — the finding goes in
words on §6.3's caption. **That is a `Diverge` row resolved by removing a form rather than by
specifying one**, which is the same move §6.4 made on Lineage and Cross Reference, and it is worth
naming as a pattern rather than treating as three coincidences.

**Read the `Diverge` rows first.** They are where the product actually is. A `Match` row says we
kept something; a `Diverge` row says we understood what it was for and disagreed about the form. The
argument to Innovue lives in twenty of these fifty-nine rows.

**One discipline this ledger holds to.** A verdict records a decision, not an impression. Where the
evidence points one way and we have not confirmed it, the row keeps its old value and the question
goes to §10 — the three-zones row is the worked example, and §6.1 carries the reasoning. Concluding
from an absence is how a ledger stops being trustworthy.

---

### 8.6 · Where the High-rated capabilities actually are

**Added 2026-09-04, and it exists to answer one question that this record could not previously
answer in one place:** [case.md](case.md) §4 rates capabilities High for a founder, and a reader who
then looks at the product cannot see all of them. That reads as an unexplained absence. It is not
one — but the explanations were spread across §6, §7a, §9, §8.2 and `design-language.md` §7, which is
the same defect as having three question lists.

**Eighteen rows are rated High.** Each is here, with one of five states. **Four of the five are
reasons something is invisible; only one is a gap.**

| | Capability | ZH | Where it is in Terrain | State |
| --- | --- | --- | --- | --- |
| 1 | Plain-language search input | AI檢索Pro | The composer, §2.2 | **On screen** |
| 2 | Plain-language one-line summary | AI速讀Pro | Drill-down field 1, §7 | **On screen** — bulk availability is §10.11 |
| 3 | Applicant name unification | 名稱統一 | Rivals, on by default, §6.2 | **On screen** — the counts are shown; holder *names* are bars, [case.md](case.md) §6.5 |
| 4 | Tech × function matrix | 技術功效矩陣 | **The hero**, §6.1 | **On screen** — on a full 8×8 grid |
| 5 | The three zones | 地雷區 · 新興區 · 處女地帶 | §6.1's three density states | **On screen** — computed over our own result set. Whether IPtech has them is §10.13, and nothing here waits on it |
| 6 | Cell drill-down | — | The drill-down list, §7 | **On screen** — *and this one Terrain **adds**. See the note below* |
| 7 | Competitive analysis | 競合分析 | Rivals, §6.2 | **On screen** |
| 8 | Macro trend analysis | 宏觀趨勢分析 | Filings over time, §6.3 | **On screen** — with the publication-lag window shaded and excluded |
| 9 | Auto-generated technology structure | AI魚骨 | The confirm card's rows, and the matrix axes, §4 | **Hidden by design** — the mechanism carries the product; the diagram never appears |
| 10 | Auto-clustering + relevance ranking | AI分類Pro | The map's rows and columns | **Hidden by design** |
| 11 | Patent family merge | 同族合併 | Every count | **Hidden by design** — visible only as counts that are right. §10.15 |
| 12 | The six merge toggles | — | Every count, as **defaults** rather than controls | **Hidden by design** — §10.33 asks whether that is a request parameter or a UI decision |
| 13 | IPC classification | — | A confidence signal we read, §6.1 | **Hidden by design** — deliberately never a label. *How* it is surfaced at all is open, §11 |
| 14 | Legal status | 法律狀態 | Drill-down field 4, §7; the rivals split | **Blocked on §10.1** — the column exists and is a skeleton bar. We hold no legal status for this project, and inventing one is the act §8's contract forbids |
| 15 | Filing alerts | 專利預警 | §9 | **Not in v1** — deferred, and it carries the subscription-rationale gap |
| 16 | Project update notifications | 專案更新通知 | §7a.6 | **Not in v1** — `Omit · later`, blocked on §10.9 |
| 17 | One-click project update | 一鍵搞定專案更新 | §7a.6 | **Not in v1** — the apply half of the same mechanism |
| 18 | Database scale | 100+ countries · 180M records | Everything | **Not a surface** — it is the ground the product stands on. US depth is §10.5 |

**Eight on screen · five hidden by design · one blocked · three not in v1 · one not a surface.**

**Thirteen of the eighteen are working in the product today, and five of those thirteen cannot be
seen** — which is not a shortfall but the thing [case.md](case.md) §4 already says in words:
*the product is as much what is hidden as what is shown.* This table is that sentence as arithmetic.

**One row is not what it appears, and it is row 6.** *Cell drill-down* was rated High from the blog
and carried into §6.2 as though Terrain inherits it. Screen `31` shows IPtech's matrix cell has **no
drill-down**: `Patents : 15` is printed text, and all five items beneath it are pivot links that
re-run the cell as another chart, broken down by holder, country, filing year, publication year or
inventor. There is no route from a cell to the patents inside it. So the cell answers *show me
another chart of this* and never *what is in here* — and Terrain's drill-down is an **addition**, not
an adoption. It is the clearest `Diverge` row in §8.1 for exactly that reason.

**And the five rows that are invisible are invisible for two different kinds of reason.** Rows 9–13
are hidden because showing them would make the product worse — a fishbone diagram, a family-merge
setting, an IPC label. Row 14 is invisible because we do not hold the data, and rows 15–17 because we
chose a smaller v1. Only the second kind is a gap, and only one of those gaps is ours to close:
**rows 15–17 are decisions and row 14 is §10.1.**

## 9 · DEFERRED — NOT IN SCOPE

> **Nothing in this section is built, specced further, wireframed, or designed against.** It is
> recorded so the reasoning survives and the decisions are not re-argued. If a task appears to
> require an item here, stop and say so rather than building it. See the deferred-scope rule in
> `CLAUDE.md`.

> **One line item has been un-deferred outright: §4b's star, taken out of the patent-detail-page
> entry on 2026-09-07 and argued there.** That is the only reversal this section has taken. The
> entries below are otherwise intact.

> **Two entries were named by a session on 2026-08-31 and designed against under that rule** — the
> patent detail page and filing alerts. **Neither was built, and both deferrals stand.** §7a.3
> concluded that the detail page would answer a legal question Terrain must not answer, and built a
> five-field **handoff row** instead — so that entry now rests on two independent arguments rather
> than one. §7a.6 remains blocked on §10.9. **The other four were never named and remain fully
> deferred** — the jurisdiction/status filter, the tech × application matrix, IPC drift as an
> adjacency detector, and IPC in export / attorney handoff. *This sentence named only the first two
> until 2026-09-04.*

**The patent detail page.** Full plain-English decode (AI閱讀Pro), all drawings at once
(多圖顯示模式), match highlighting (記號關鍵字), per-patent IPC with a plain-English gloss, and unread
markers (專利未讀標記). ~~And a "not relevant to me" dismissal (進階分類)~~ — **un-deferred
2026-09-07, see below.**
*Why deferred:* five elements is a screen with its own gravity, and in the first pass it competes
with the map for attention and build time. The drill-down list (§7) answers the founder's actual
question — *should I care about this?* — at a fraction of the surface. Revisit once the map is
proven.

> **Un-deferred 2026-09-07 — the dismissal only, and it comes back as its inverse.** §4b's star says
> *more like this one* and re-baselines a set around it. 進階分類 says *not this one* about a patent
> being studied. They are the same mechanism pointed in opposite directions, so keeping one deferred
> while building the other would be a distinction nobody could defend.
>
> **What makes it admissible is where it sits, not what it does.** §7a.3's argument against this
> entry is that all six elements serve *does this specific patent block me* — a legal question
> Terrain must not answer — and are built for someone **studying** patents. The star is used before a
> map exists, on a set nobody has read closely, and it changes an **ordering**, not a verdict. Nothing
> about it helps a founder read a claim.
>
> **The other five stay deferred, including unread markers.** An unread marker is a reading aid: it
> is only useful to someone working through patents one at a time, which is the workflow §8 cut. The
> deferral of the detail page as a *screen* is untouched, and both of §7a.3's independent arguments
> for it still stand.

**Global jurisdiction + status filter.** "Live patents only" / "US only" as a **persistent control**
that redraws the map, rivals and trend together. *§7a.5 permits "narrow to live only" as a one-shot
action from a single cell; what is deferred is the standing control across every widget, which is a
different object with a different cost.*
*Why deferred:* the map caption states the same fact for a fraction of the cost. The filter is the
expensive version of that insight — though it is also the most persuasive single interaction
available, since watching a minefield thin into open ground is the moment a US founder understands
what they are looking at. Strong candidate for the next pass.

**Tech × application matrix · 技術應用矩陣, and a toggle between column sets.** Columns become
industries — agriculture, delivery, filming, defence — instead of outcomes.
*Why deferred:* it answers "what's adjacent" more directly than the function matrix does, but
generating good columns from one sentence is the highest-risk part of the entire build. One column
set done well beats two done badly.

**IPC drift as an adjacency detector.** Flag patents whose IPC class sits outside the main cluster —
wind-turbine blade technology solving a drone problem.
*Why deferred:* it is mechanical rather than AI-inferred, and would recover some of what deferring
the application matrix costs. But it depends on IPC depth that is unconfirmed (§10.6).

**IPC in export / attorney handoff.** IPC is the shared language the moment a founder talks to
counsel; carrying it into anything exported makes Terrain the artifact they bring to that meeting.
*Why deferred:* there is no export in v1.

**Filing alerts · 專利預警.** Tell me when someone files near my idea.
*Why deferred:* to prove the four views first. But record the consequence plainly — **this is the
strongest recurring-value feature in the engine, and without it v1 launches with no subscription
rationale beyond re-running searches.** A founder searches, gets an answer, and has no reason to
return next month. That gap needs an answer before pricing is set (§11).

---

## 10 · Confirm with Innovue

Questions, not assumptions. Ordered by how much they block.

1. **Is any of this available as an API?** Blocks everything else on this list. Terrain cannot be
   built on a login-walled Chinese UI, and nothing in this document is real until this is answered.
2. **Can the function axis (功效) be generated automatically, and how good is it?** In IPtech an
   analyst hand-writes both axes into the 技術定義表. Terrain must generate both from one sentence.
   This is the highest product risk in the build.
3. **How good is the AI fishbone actually?** Innovue contradicts itself: 專利布局分析大解密 EP7
   argues *against* AI classification and cites a case where AI-selected patents were 20% accurate;
   專利分析實操 EP41 sells AI魚骨 and AI分類Pro doing exactly that. Which position is current.
4. **Does 名稱統一 cover US startups?** The stated coverage is 1,800+ Taiwanese listed and academic
   entities plus 1,000+ large international names. US seed-stage companies are precisely what that
   list would miss — and they are the competitors this ICP most needs deduplicated correctly. The
   rivals widget could work perfectly for DJI and fail completely for a YC company.
5. **US patent depth and lag** within the 100+ countries / 180M records claim.
6. **Is IPC data exposed, and at what depth** — full symbol, or class only? §6.1 depends on it.
7. **Is legal status available per patent in bulk**, or only inside their UI? §7 needs it per row.
8. **Latency and unit cost** per search plus classification run. Determines whether
   confirm-before-apply is a nicety or a necessity.
9. **Is 專利預警 available programmatically?**
10. **Licensing terms for reselling into a self-serve, English-language SaaS.**
11. **Is AI速讀Pro available in bulk** — one plain-English line per patent across a whole result set,
    rather than one patent at a time? §7 makes it the first field on every drill-down row. Without
    it the list degrades into patent titles, which is a search result rather than evidence, and §6.1
    is the argument for why that is not a product. *Added 2026-09-01 while writing
    [case.md](case.md) §6.2, which is where the interface's dependency on it became explicit.
    Appended rather than inserted in blocking-order — it would sit around 7 — because §7a.6 and
    others reference §10.8, §10.9 and §10.10 by number.*
12. ~~**Do the 60 shared `M-Map` / `T-Map` entries render differently under each map?**~~
    **Struck 2026-09-04 — we answered it ourselves.** `26` and `27` are `Company - Count` reached
    under each map: identical title, charts, values, tables and totals, the T-Map version differing
    only by a `Classification` scope field which, left empty, renders the M-Map result exactly. So
    `T-Map` is `M-Map` plus a classification filter, and there are **68 distinct destinations**
    behind 128 menu entries. §8.3 carries the finding. *The number is retained rather than reused,
    because §10.n ≡ [case.md](case.md) §9.n and both lists are append-only. A question we answered
    and left standing would read as though we had not looked.*

**Identified by inference, and cited in the ledger as the thing that would confirm a row.** Both were
owed before these two numbers existed — four places in this document already pointed at them.

13. **Do the three zones — 地雷區 · 新興區 · 處女地帶 — exist in the product, or does an analyst paint
    them?** The blog names all three. The populated matrix on screen `24` carries **none of them**,
    anywhere. What it carries instead is `Mark Colors`, a red / amber / green swatch trio with an
    eraser, sitting in the control bar — which reads as a manual annotation tool rather than an
    engine output. **We have not concluded that**, because concluding from an absence is how a
    ledger stops being trustworthy: §8.1 holds the row at its blog-sourced `Match` and this question
    is what resolves it either way. *Nothing in Terrain depends on the answer* — §6.1's three states
    are computed from Terrain's own density over its own result set and always were. We are asking
    because the ledger should not claim to inherit something we may be building ourselves. **If an
    analyst paints them, that is the better answer for both of us:** rendering them automatically is
    then a thing Terrain adds rather than a feature it matches.

14. **Is the toolbar's `Switch To Ai Insight` the same capability as 技術脈絡分析?** It produces a
    three-era narrative and then names five core technology concepts with their relationships and
    representative patents, and it closes its own first section with *"整體而言，本專案技術脈絡正從
    「單機飛行性能優化」轉向…"* — using the term for what it produced. That is our reading of screen
    `28`, not your confirmation, and §8.1 records the row as identified by inference. Two things turn
    on it: §6.4's widget currently ships a most-cited table with this narrative recorded as the
    **candidate** rather than adopted, and §7a.4's landscape summary is where the capability would
    actually sit if it enters Terrain at all. *A second question rides with it, and it is the one
    that decides whether we can use it — see §10.19.*

**Raised by building.** The prototype and the component manifest at `design/components.md`
forced these: a row whose data shape we could not name is a question we had not asked, not a gap in
the design. Appended in discovery order rather than blocking order, because the numbers above are
cited by number elsewhere.

15. **Does 同族合併 travel with every result set the engine returns?** This is the one row in
    [case.md](case.md) §6.2 that carried no question, and the omission was deliberate: family merge
    is *assumed* to be inseparable from any count, because the counts are meaningless without it.
    One invention filed in nine countries counting nine times does not make the map slightly wrong —
    it makes dense and empty stop meaning anything, and the founder has no way to detect it.
    **If the assumption is wrong this is the most severe question on the list**, which is exactly why
    it is now asked rather than assumed.

16. **Is publication lag a field per record, or must it be inferred per jurisdiction?** §6.3 makes
    the shaded window mandatory, not optional — left raw, a founder reads a data artifact as *this
    space is dying*. The shading has to be computed from something, and our prototype currently
    carries the lag as a single scalar in years, which is almost certainly too crude across
    jurisdictions.

17. **Can the matrix be run over a bounded time window, so the same grid can be computed twice?**
    §6.1's rising hatch marks intersections that are *growing*, which is the second dimension a
    single density ramp cannot carry. It needs the same rows and columns over two periods. Is that a
    parameter on the run, a field on the result, or must we run the analysis twice and diff it
    ourselves — and if the last, does that cost two runs on the meter? **This is the only part of
    the hero's shape we cannot derive from a single result set.**

18. **Are citation counts available per patent, and can they be counted against the result set
    rather than globally?** §6.4 ranks by *most cited in scope*. A global count ranks famous
    patents; a scoped one ranks the ground this specific idea grew out of, which is the only version
    that answers the founder's question.

19. **Is `Switch To Ai Insight`'s output reachable as structured values, or only as the rendered
    panel?** Three eras, five named concepts, their relationships and representative patents. If it
    comes back as generated HTML or an image we cannot re-token it, re-label it in English, or place
    it in §7a.4's summary — which would settle §6.4's candidate question by making the answer *no*
    for reasons that have nothing to do with whether the capability is good.

20. **Does a programmatic result return what was excluded, or only what was kept?** The project we
    observed reaches 117 patents because an analyst working in `Hierarchy` assigned by
    hand and binned 41 of roughly 158. **Terrain has no analyst to do that discarding.** So: is the
    kept/discarded decision made by the engine or by the person, and can we see the discarded set?
    **This bears on whether our counts and yours are comparable at all**, and it is the question
    `Hierarchy` raises that we had not thought to ask.

    *§4b is Terrain's answer to the half of this we control: the founder does the discarding, once,
    over a set, before the map is built. The question above is unchanged and still needs an answer —
    knowing what the engine excludes is what tells us whether §4b is choosing from everything or from
    a set that has already been cut once without us.*

21. **Is the same measure available at an earlier date?** A delta needs two time points and we hold
    one, which is why the delta pill is specced in the stylesheet and applied nowhere. Terrain can
    snapshot its own runs and diff them — that is buildable — but it changes what we store and what
    a run costs, so we would rather know before choosing. Related to §10.8.

22. **Which of five data shapes can the engine return?** `design/components.md` §2 tables
    them. Four serve `Diverge` rows that are specced and unbuilt: four incommensurable axes per
    holder for Research Ability; a directed citation pair matrix for Cross Reference; active years
    per holder for Activity; and live and expired per holder *for one project* for Legal Status.
    The fifth — **patents against distinct-assignee count per year** — no longer serves a chart,
    because §6.3's caption now carries the Life Cycle finding in words; it is still the input that
    finding is computed from. **One question rather than five**, because they share a single blocker
    and are answerable as a table.

23. **What does a 專案 contain, and can one be created, listed and reopened programmatically?** It
    decides whether §3's project rail is a view of your object or a Terrain object that happens to
    hold a query — which is a storage and pricing question as much as an interface one.

24. **Is the search filter set required by the query engine, or is it a UI default?** §2 puts one
    composer under one question and no filters anywhere. Could a portal omit them, infer scope from
    the sentence, and expose narrowing later — or does the engine require a scope before it will
    run?

25. **Is the pipeline reachable end to end in one call sequence?** 技術魚骨 → 檢索策略 → 專利檢視 →
    篩選/分類 → 布局分析 is six steps of user labour in IPtech and one uninterrupted run in Terrain,
    which is the whole differentiation. Does each stage require an explicit user action to advance?
    A related and smaller version: does a classification run report **stage-level progress**, or is
    it one opaque call? §2's build narration degrades to a spinner without it — a worse product, not
    a broken one.

**How a front end could sit on it.** A different kind of question, and a different reader — the first
twenty-five ask what the engine can *do*, these ask what a separate portal could be *built against*.
They are the sub-questions of [case.md](case.md) §8.2 and they lived in the token README's §4 until
2026-09-04, which made two lists that could drift. That file is gone; this list is canonical.

26. **Are the analysis charts server-rendered images, or client-side components?** **This one gates
    the entire design pass.** If charts arrive as generated pictures, no token work can restyle them
    and the visual layer needs its own rendering path against raw values — **you cannot re-token a
    PNG.** `design/components.md` assumes structured values throughout, and that assumption is
    stated at the top of it so it can be corrected rather than discovered late. In blocking
    order this sits second, behind only §10.1.
27. **What is the front-end stack** — framework, CSS approach, build step?
28. **Can the interface be themed through CSS custom properties**, or are styles compiled or inline?
    If custom properties are already in play, `design-language.md` §2's semantic layer maps onto it
    directly and a re-theme touches no component.
29. **Is there a shared component library**, or is markup authored per page? This decides whether we
    hand over tokens, or tokens plus the component manifest.
30. **Is the `Mark Colors` ramp configurable per deployment, or fixed in the component?** This is the
    one visual decision where we diverge from IPtech deliberately rather than incidentally: a
    red/amber/green paint tool over matrix cells silently answers a question the underlying data
    cannot answer, which §6.1 forbids outright. Our cells stay a tonal grey ramp.
31. **Is 全美引證次數 — the untranslated column header — a data-layer value or a template string?**
    That single answer tells us where the translation boundary actually sits, which is §8.2's second
    sub-question made concrete.
32. **Is there an i18n layer we can extend**, or is English a parallel template set?
33. **Are the six merge toggles** — Applicant/Assignee, Inventor, Country, Patent Country, Examiner,
    Application — **server-side operations or client-side view state?** It decides whether *merged by
    default* is a request parameter or a UI decision, and §6.2 depends on it being the former.
34. **Is the points meter per API call or per UI action** — and could a separate portal share it?
    A matrix run visibly decrements the points balance by a small fixed amount. If consumption is
    already credit-metered, a portal could inherit the meter rather than needing a new commercial
    model. Bears on §10.8 and §10.10.
35. **Can a separate front end share session and auth?**

**Raised by the entry field**, §2.2, and appended 2026-09-04.

36. **Does one entry point accept a sentence, a patent number and a classification code, or are
    `AI Search`, `General` and `Number` separate endpoints?** §2.2 folds your five tabs into one
    field and detects the kind on submit. If the caller must choose the mode, that is routing work we
    do and not a blocker; if the modes take different query shapes or return different result
    objects, the single field needs to know that before it is built.
37. **Is `Company` a search mode or a filter?** On screen `01` it sits as a tab beside `Number`, and
    a company picker also appears in `Report`'s entity list. The answer decides whether *who is DJI
    here* is an entry point or a scope applied to one — which is the difference between a founder's
    first sentence and a control they never see.

**Raised by showing the founder what the search found.** Three questions about the layer between a
search and a map — §4a and §4b.

38. **Can a result set be re-ranked against a patent the founder points at?** §4b's star says *more
    like this one* and re-ranks the set around it. §8.2 records `AI排序 · 關聯性排序` as evidence the
    engine ranks a result set; ranking it against **a supplied document** is a different capability
    and we have seen no screen that does it. **If the answer is no, §4b loses the star and keeps
    everything else** — the set, the cut and the selection do not depend on it.
39. **What does relevance ranking actually return — an order, or a score?** §4b needs an order to
    recommend a cut. A score would also let the cut be a threshold rather than a count, which is
    §4b's third open item. And if a score is exposed, §6.1 governs how it may be shown: an ordering
    is a fact, a score printed beside a patent reads as a verdict about the founder's chances.
40. **Can the definitions table be written programmatically, and does it take narrowing terms per
    branch?** `Fishbone` step 2 — *Edit Search Query / Technical Description* — is the one screen in
    the product we have never captured, and it is the layer §4a's answers map onto: a founder saying
    *this is for urban delivery* and *not the whole aircraft* is authoring exactly what an analyst
    types there. So: is that table reachable through an API, does it accept terms per branch rather
    than one query for the whole tree, and can a branch carry an **exclusion** as well as an
    inclusion? The last one has no visible equivalent on any screen we hold.

---

## 11 · Open

**Closed 2026-08-31 — chat's resting form.** It was *floating panel vs docked command bar*. The
answer is the **docked command bar**: a 44px icon at the bottom-right of the map that expands into
the full composer, the same composer the conversation surface uses at full width.

Three things decided it. The floating pill had an observed collision — at a 1000px viewport it sat
on top of the Lineage caption, which is where §6.1 puts a widget's blind spot. The docked bar makes
the composer one component across both surfaces instead of two that merely resemble each other. And
"chat is the means, not a place" (§2) is only true if the thing you type into on the map is visibly
the thing you typed into to make it.

- Product-facing name for the saved object (§3) — and, since 2026-09-07, for **the set** (§4b).
  *The set* is working language, not a decision.
- **How many narrowing questions is too many** (§4a). Three to five is the intent, per §4a's bank
  of six asked adaptively.
- **What §4b's recommended cut should be** — a fixed count, a share of what matched, or a confidence
  threshold. Blocked on §10.39.
- **Whether the star survives.** §4b's re-baselining assumes the engine can rank against a supplied
  patent, which §10.38 asks and nothing confirms. If the answer is no, §4b keeps everything else.
- Density thresholds for the three zones (§6.1).
- How the IPC confidence signal is presented without becoming a statistics lesson (§6.1).
- Incumbent-vs-startup data source for the rivals widget (§6.2).
- **What the founder walks away with** — open, and discussed at §7a.8 without being settled. If it
  ever resolves to a named artifact, that name is constrained: not *report*, *brief*, *summary* or
  *memo*, which are document nouns and would breach `brief.md` §1 on their own.
- Pricing, and whether a free tier exists — blocked on the subscription-rationale gap in §9.
  §7a.6 proposes a candidate answer to that gap — watching a cell or a holder — and is itself
  blocked on §10.9. The chain is: §10.9 → §7a.6 → the §9 gap → pricing.

  **There is a second path to the same blocker, recorded 2026-09-04 and deliberately not ranked
  against the first.** §7a.8's option D — a position the founder records, re-checked over time —
  would make the deliverable and the return reason the same object, and it reaches the gap
  **without** §10.9, because re-running our own search is in our control where 專利預警 is not. It
  depends instead on §10.8's per-run cost, and it is the largest build of §7a.8's four options. Both
  paths lead to pricing; neither is chosen, and §7a.8 decides nothing.

---

## Appendix · What IPtech is, and why Terrain is not a tier of it

IPtech is not a search tool. It is a six-step analyst workflow sold as a pipeline:

`技術魚骨 → 檢索策略 → 專利檢視 → 篩選/分類 → 布局分析 → 專利報告`

**Corrected 2026-09-05: that pipeline is how the work decomposes, not how the product is walked.**
The menu reads as a linear sequence, but the route to an analysis jumps between destinations and
opens new browser tabs along the way — `Search` → `Project` → a separate tab → `Fishbone`, `M-Map`
or `T-Map`. Earlier wording here and in [case.md](case.md) described it as six steps walked in
order, which overstated how linear the experience is. The *labour* claim below is unaffected;
§10.25 is left as written for that reason.

Every step is user labour, made faster. Their claims are all time-savings against a baseline the
user already has — ↑500% search, ↑700% reading, two hours a day, fifty hours, seven days. **A
founder has no baseline.** They have never done patent analysis, so "80% faster" measures nothing.
That is the deepest repositioning problem and it sits upstream of every UI decision here.

The sales motion confirms the buyer: trial is a lead form requiring a company name, followed by a
callback within two days and a seven-day clock. Concurrent-seat licensing, IP-range access control,
accounts deactivated after two months idle. No price on any page. Testimonials from a US chip
manufacturer, a Taiwanese chemical plant, a Japanese automaker — no startups.

**IPtech sells knowledge to patent professionals. Terrain is for startups.** Terrain takes
specific capabilities that already exist in IPtech and repackages them for that audience: the
founder supplies the sentence and receives the answer, and the labour in between is the product's
job rather than theirs. That is the whole differentiation, and it requires no new engine
capability — only the willingness to hide machinery that Innovue currently sells as features.

*Reworded 2026-09-05. The earlier form — "their user performs all six steps faster; Terrain's user
performs step one and receives step six" — rested on the linear-walk reading corrected above.*

**Sources**, audited 2026-08-31: `innovue.ltd/products-iptech/`, the 2025-11 rebuild of that page,
`innovue.ltd/products-webpat/`, `innovue.ltd/update-iptech/`, `innovue.ltd/patentmap/`, `iptech.cc`,
and the blog series 專利分析實操 (EP7, EP41) and 專利布局分析大解密 (EP1, EP7, EP8).
