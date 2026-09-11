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
carries a complete **six-branch, two-level taxonomy** in which **every branch count reads `(0)`**:
the structure exists in full before a single patent has been matched to it. It also renders entirely
in Chinese inside the English UI.

*The six branch labels were quoted here until 2026-09-10 and have been removed.* They were a named
client's taxonomy — the client's own name was the first branch — and this is the failure `CLAUDE.md`
describes in the sentence it sets in bold: **a scrub that changes the numbers and keeps the labels
has not removed the landscape.** The 2026-09-09 pass caught the prototype's `Tech-Effx` axes and did
not look at this paragraph, because the labels here are prose rather than data and read as a
citation. **Nothing in the finding depended on them** — six branches, two levels, every count zero,
all of it in Chinese — which is the test for whether a label was ever carrying argument or only
provenance.

**Amended 2026-09-08, and one sentence above is now false.** The paragraph beginning *Terrain's
product* ends with the claim that *nobody has run them end to end off a founder's own words*. Innovue
now has. `快檢通 · AI 快速檢索` is a semantic search surface of theirs, separate from the IPtech
platform, and it runs the chain in one step: a sentence goes in, a fishbone comes back **generated
from it** with a patent count on every node, and clicking a node opens that semantic subgroup. No
wizard, no analyst, no definitions table in front of it. The captures and the full reading are in
`visual-reference/iptech-semantic-search/README.md`; the capability rows are §8.7.

**The finding itself is untouched, and it is worth being exact about why.** *The taxonomy is an input,
not an output* describes how patent analysis works — not how many products automate it. And a founder
still cannot author one, which is the second paragraph above and the reason any of this exists. What
was false was a claim about **novelty**, and novelty was never the finding; it was a sentence about the
competitive landscape that had been standing inside one.

**What the amendment costs, stated plainly.** Generating the structure from one sentence is no longer
the thing nobody else does. It is still the thing Terrain is built on, and four layers of this
document have no counterpart on that surface: the search runs on submit with **no gate** (§4, §4b),
there is **no narrowing round** (§4a), the fishbone is **shown as a diagram** rather than hidden behind
a founder-legible card, and a **relevance score is printed beside every patent**, which §6.1 forbade
outright until 2026-09-10 and now does not — [brief.md](brief.md) §4, §1a conflict 1. Its English exists and is machine-grade — the control that decides how many records come
back reads *500 pens*.

**What this does not settle** is whether Terrain sits on that surface or beside it. That is a working
direction rather than a decision, and it is recorded as one at `brief.md` §4. §10.41–§10.51 are the
questions that settle it.

---

## 1 · The shape

Natural language in. Five questions back. A confirmed reading of the idea. Then **one working
screen** — the patents the search found down the left, the views over them on the right, and any
patent's record brought over those views. Chat proposes changes; the founder confirms them; every
confirmed change is a version.

***Rewritten 2026-09-10, when §1a's proposal was adopted.*** It read: *"Natural language in. A few
questions back. A confirmed reading of the idea. **What the search found, approved before anything
is drawn over it.** A saved project. A dashboard of views over that one corpus."* Three of those
sentences named surfaces that no longer exist as surfaces — the set is the left column of the
working screen, and there is no dashboard and no widget page. **The gate is the one thing in the
old sentence that survives as itself**, and §1a records why it was the single conflict resolved
against the proposal.

*The narrowing round and the gate arrived 2026-09-07 — §4a and §4. Both exist for the same reason:
one sentence against 180M records is a wide net, and the founder is the only person in this product
who can narrow it. **That reason is stronger now rather than weaker.** §4b's separate approval step
is gone, so the gate is the last place a wide net gets caught before something is drawn over it.*

## 1a · Innovue's architecture — proposed 2026-09-10, adopted 2026-09-10

**Innovue proposed collapsing §1 into one surface, and the proposal is adopted.** Plain-language
search runs; the ranked patents fill a left column; the map and the market widgets fill the right,
computed over the whole result set; clicking a patent brings its record **over** the right pane.
The analysis is a by-product of the search rather than something the founder commissions.

**This section was written as an open question and is now the adoption record.** What it argued
is kept below rather than rewritten into a decision that always looked obvious, because four of its
five conflicts were resolved **in Innovue's favour** and one was resolved against them, and a reader
who only sees the outcome cannot tell which of those was hard.

*It was rendered before it was decided, at `design/previews/innovue-proposal.html`, with every
conflict marked on the screen it occurred on. **That page is deleted** — the prototype now renders
the architecture as Terrain's own, so a second page rendering it as somebody else's proposal is a
view of a decision rather than of a question. `git log design/previews/innovue-proposal.html` has
it if the marked-up version is ever wanted.*

### What was attractive about it, stated first and without hedging

**It needs no engine work that has not shipped.** The map is the same call with the search's result
set as its corpus. §8.7 already records the technology structure being generated from one sentence
in about two seconds, and their semantic surface already returns a ranked list with a structure
drawn from the query beside it. **The proposal was mostly a rearrangement of parts that exist**,
which is not something any other open item in this document can claim.

It is also fewer screens and faster to a first useful thing, and *one screen* is a real product
virtue rather than a slogan.

### The five conflicts, and how each resolved

| | Conflict | With | Resolution |
| --- | --- | --- | --- |
| 1 | A relevance score printed beside every patent | §6.1 | **Resolved for Innovue.** The prohibition is **removed outright, with no successor rule** — [brief.md](brief.md) §4 carries it, because the rule it amends is positioning. Terrain prints the score the engine returns. What is still forbidden is ranking *language* that reads as a verdict |
| 2 | No confirm step anywhere | §4, §4b | **Resolved against Innovue. The gate stays**, and §4b's separate approval surface goes. See below |
| 3 | The map does not follow the selection, and a record over a map implies it does | §6.1 | **Resolved for Innovue, and then made false.** The mitigation was a persistent scope line plus the record overlaying only the right pane. Then §6.8 gave the map a click that *does* filter the list — so the relationship is now real in one direction and stated in the other |
| 4 | Assignee names printed as data | `CLAUDE.md` | **Ruled irrelevant.** The rule governs *published artifacts*; the product may name holders. It bites on the prototype, not on the design — holder rows stay skeleton bars **in the prototype**, and the map says so on the card |
| 5 | The axes arrive with no veto — there is no widget page for the two lists | §6.1a, §7a.2 | **Resolved for Innovue, and it cost the most.** There is no veto, because there are no generated axes to veto: the map is one fixed cut, `T-Map › Tech-Effx › Company`. §6.1a and §6.1b are deleted, §7a.2 is abolished, and the founder's only correction point is §4's gate |

### The gate is the whole argument, and it was the one thing not conceded

§4's gate exists because **one sentence against 180M records is a wide net** (§1). Remove it and the
founder never sees what the engine understood them to mean, so a misreading is invisible instead of
correctable — and when a map is wrong there is no way to tell *which* thing to change, the sentence
or the scope.

**The counter-argument was real and is not strawmanned by having lost.** A gate is a cost on every
search including the many that are fine, and Innovue's flow is measurably faster to something
useful. *Whether the gate earns its friction is a question about founders, and nothing in this
document answers it* — §11 still carries it as unanswered, and it is now unanswered about something
that shipped rather than about something proposed.

***What tipped it is conflict 5, not conviction, and that is worth being exact about.*** Two of the
three correction points this document had a week ago are gone: §4b's set approval went with the
surface, and §6.1a's axis veto went with the generated axes. **The gate is the only one left.**
Removing it as well would have left a founder with a misread sentence no route to say so except
starting again — so the gate did not survive because the argument for it got stronger; it survived
because everything that shared its job was removed in the same pass. §4 says so in its own words.

### The left edge, which is arithmetic before it is taste

The map's eight columns need **944px** (176px of row labels plus 96px per column) before the grid
reads without scrolling; the result list stops being readable under about 340px. With the 260px
sidebar that is **1544px**, which does not fit a 1440px laptop. At the collapsed 64px rail it is
1348px and does; with a top masthead, 1284px.

**The masthead won.** Two survivors were available and the icon rail was recommended here when this
was a proposal, on the grounds that it keeps one shell and the work it demands — fixing the 64px
rail, which currently *drops* search and version history rather than reducing them to icons — is
owed anyway.

**That recommendation was overturned, and the reason is the record list rather than the map.** At a
1280px laptop the rail leaves the right pane at ~876px against the matrix's 944px, so the map
scrolls horizontally on the most common screen the product will meet; the masthead leaves ~940px and
it does not. The rail's advantage was that it is one shell; the masthead's is 64px, and 64px is the
difference between the hero widget fitting and not fitting.

**The cost is named rather than argued away.** §1c carries it: a masthead is a **second shell**,
§2's note is that the sidebar persists across surfaces, and seven regions that a 260px rail held
comfortably now have to fit a 48px bar. **The theme control is the one to watch** —
[design-language.md](design-language.md) protected it by name from disappearing at 64px, on the
grounds that *a rail that vanishes when the sidebar collapses would make collapsing a way to lose
the theme control*. Burying it in an account menu is that same loss by another route.

*And the 64px-rail bug does not go away by not using the rail.* §11 keeps it, because it is a defect
in a shell that still exists in the codebase, and because the argument for fixing it never depended
on this decision.

### One thing this was adopted without, and it is the largest risk in the document

**Whether the map can be computed over an ad-hoc search result at all.** Every capture shows the
matrix drawn over a **project** — a curated, saved set — and none shows it pointed at a search
result. This section said, while it was a proposal, that the question *decides the rest of the
section*.

**It was not answered, and the architecture was adopted anyway.** That is a decision to build ahead
of an answer, and it is recorded as one rather than left to look like an oversight. **If the map
needs a project, this architecture needs a save step and the *one screen* claim goes with it** —
what would change is a step, not the layout, which is why the risk was judged takeable. §10.1 and
§11 both carry it; it is the first thing to ask.

## 2 · The six moments

There is no "search screen" and "dashboard screen" competing for the flow. There is one session
over time — and, since 2026-08-31, **surfaces rather than screens.**

***The three are conversation · the working surface · points.** This line said "two" until later on
2026-08-31, when the widget page was specced in §7a.2 and built in the prototype, "three" until
2026-09-07, when §4b added the set, "four" until 2026-09-08, when §7a.9 added the points page, and
**"five" until 2026-09-10, when §1a's adoption collapsed the set, the map and the widget page into
one.** Each correction is made in place rather than left as a correction to read past — and it is
worth noticing that this is the first one that **subtracts**.*

***Only two of the three are on the path, and the distinction is the one §7a.2 used to keep.** The
points page is a destination reached from the chrome — the masthead's balance is the link — and no
moment routes through it. **The working surface is a step and a destination at once**, which is
new: moments 3, 4, 5 and 6 all happen on it without it ever being left.* All are reached and left
without opening a window — §2.1 is unaffected.

| Moment | Surface | What is on screen |
| --- | --- | --- |
| 1 · First run | conversation | The composer, centred, and the question above it. Nothing else. |
| 2 · Confirm | conversation | **Three beats, all of them turns.** The direction (§4a beat one), then three settings together (§4a beat two), then the reading — *here is how I read that* — with the structure behind a disclosure and the action in the turn after it (§4). Gates the search. |
| 3 · What was found | working surface | The ranked patents fill the left column, and **every one of them already feeds the views** (§4b, §6a.2). Sort them, filter them, or star one to re-baseline the order. **Nothing is approved and nothing is waited for** — the right pane is already resolving. |
| 4 · Build | working surface | Six skeletons in the right pane becoming six views, in place (§6a.5). The composer narrates. No stage screen. |
| 5 · At rest | working surface | Masthead, the list, the six views across the `Market` / `Technology` toggle (§6.5), the standing note of what the map was built on (§6.1). |
| 6 · Return | working surface | Project switcher → project → straight to moment 5. No search step, no rebuild. |

***Moments 3, 4 and 5 stopped being separated by navigation and are now separated only by time.***
That is the whole of §1a's collapse stated as moments. The moments survive because each still marks
a distinct thing being true — the corpus is visible, the views are arriving, the views are there —
and a founder who watches the screen for four seconds sees all three. **What no longer exists is a
step between them**, which is why *"Approving it is what builds the map"* came out of row 3: nothing
is approved there, and the build does not wait.

**Why 1 and 2 are one surface.** They were always one conversation: the founder describes an idea,
the system asks what it needs to ask, reads the idea back, and the founder corrects it. Rendering
that as separate full-screen views made a founder feel they were being handed between rooms for what
is a single exchange — and it hid the fact that the thing they typed into at the start is the same
thing they will type into forever after. The moments survive as *moments*; they are no longer
*screens*.

They remain distinct in every way that carries a decision. **Confirm still gates**: nothing runs until
it is approved. Build still fires on creation and after a confirmed scope change only.

*Amended 2026-09-09. This paragraph used to say confirm "is a card in the thread". It is now turns in
the thread, which finishes the move this table began — the moments stopped being screens on
2026-08-31 and the last of them stopped being a panel today. The gate is unchanged and that is the
only part that ever carried a decision.*

**Why the old moment 3 is two.** §5 already describes a re-run as "a search across 180M records
**plus** AI classification" — two operations, which the interface used to run back to back behind one
progress bar. They are separated because the founder has a decision to make between them: the
search produces a set, and the classification is laid out **over the whole of what it returned**
(§6a.2 — the per-row tick was deleted 2026-09-10).
Recorded 2026-09-07; the reasoning is §4b.

*Amended 2026-09-10. That sentence read "over whatever the founder approves", and there is no
approval act any more — the views draw over everything the search returned, immediately.
**The decision between the two operations survives; the gate between them does not.** §6a.2 carries
what that cost, including the §3 requirement it broke.*

**Chat is not a place, it is the means.** It is how the map gets made and how it gets changed —
which is §1 restated. Before a map exists the conversation is the whole content area; once one
exists it collapses to **a control in the masthead that opens a panel over the left column** (§5,
§6a). One composer, two sizes, never two different things.

*It was a 44px dock at the bottom-right of the map from 2026-08-31 until 2026-09-10. §5 carries the
move and the one thing it costs.*

Progressive build fires **on creation and after a confirmed scope change only.** Never on a return
visit, or it becomes a loading screen the founder watches every day.

The rebuild after a scope change is **visibly shorter than the first build** — fewer views return
to skeleton, and it says so. Only what changed is re-run, and the founder should be able to see
that from the screen rather than take it on trust. *§6a.5 carries the inline form; "fewer stages"
was the stage screen's way of saying this and the stage screen is gone.*

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

~~§7a.2~~ said the widget page was *a destination, never a step*. This extended that from the flow
to the window: a destination is somewhere you go and return from **in place**. *The widget page is
gone and the rule is not weaker for it — the only destination left is the points page (§7a.9), and
it is reached and left without a window.*

**The founder-facing order falls out of it.** Search → the project → the content. What IPtech splits
across two menus and a new browser window arrives as **one surface with everything on it** — §6a.

*This paragraph has been corrected twice in three days and the second correction reverses part of
the first, so both are kept.* From 2026-09-04 it read "**the map is the `T-Map` content, and the
widgets beneath it are the `M-Map` content**". That was wrong about IPtech — sixty of their
sixty-eight destinations sit under **both** maps, so there was never a T-Map half and an M-Map half
to lay out vertically (§8.3). On 2026-09-10 it was rewritten to say the split arrives as **one
toggle**, `Market` / `Technology`. §6.5 was struck the same day and restored the same evening; the
split it names is the one below.

**What survives is the sentence's actual point, and it has survived both corrections unchanged:**
*these are two menus in the same product, and a founder should not have to know which one they are
standing in.* **One pane with everything in it serves that better than either a stack or a toggle**,
because the founder is not asked to infer the split from position **or** to choose a side of it. It
is the plainest available answer, and it took two attempts at cleverer ones to reach.

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
| A patent number | `Number` | That patent — its technical approaches seed §4's reading |
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

**Corroborated 2026-09-08, from Innovue's own semantic surface.** `快檢通` puts one field on the screen
with no tabs and no filter rail, and hides jurisdiction and status behind a small control inside the
field (§8.7). That is this section's decision, reached independently by the people who own the engine
— which is the strongest evidence available that folding the tabs in costs nothing in retrieval.

**And it corroborates the amendment above rather than the sentence the amendment corrected.**
Jurisdiction and status are **query parameters** there — `資料來源`, set before the search runs — not
filters applied to a set that came back. §4a asks the fact once, in English, and scopes the search
with it; that is now known to be the shape the engine already takes. Two limits come with it: **two
countries only**, Taiwan and USA (§10.48), and a **500-record ceiling** (§10.47).

*Their field takes a sentence and nothing else.* The four routes above — a number, a company, a class
— have no equivalent on that surface, so §10.36 is unanswered and this table stands as written.

## 3 · The saved object

Not a search. A search is one query against one branch — it is a verb, not a thing. The durable
object is **the structure plus everything it caught**: the reading that was approved, the corpus, the
views with the axes they are laid out on, and the version history. IPtech calls this a 專案.

*"The confirmed breakdown" until 2026-09-09. It named the two lists as one thing confirmed at one
moment, and they stopped being confirmed at the gate — the reading is (§4), and the axes moved to
the map. **Amended again 2026-09-10: there are no two lists.** The map is one fixed cut, its columns
are generated and never vetoed (§6.1), and what the object holds is the reading, the corpus, the
selection, the six views and the version history.*

This is what the project switcher lists. It is not a list of conversations; the conversation is how
the object got shaped, not the object itself. *It was the sidebar's list until 2026-09-10 and it is
the masthead's now — §6a.1, which also records that version history stays nested under the open
project rather than flattening into a peer list.*

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
doing invisibly.** §10.20 records it: an analyst working in `Hierarchy` assigns by hand and bins what
does not fit — at the scale our illustrative set models, 41 of roughly 158, leaving 117 in scope.
**Terrain has no analyst to do that discarding**, so either the founder does it once, in the open, or
nobody does it and the map is drawn over everything the search returned. §4b chooses the first.

**The cost, recorded plainly, because it is real.** A list of patents with checkboxes is `Hierarchy`
at smaller scale, and `case.md`'s argument to Innovue is that Terrain removes the analyst workflow. A
reviewer can reasonably read §4b as us rebuilding the thing we said we cut. Three requirements answer
that, and they are load-bearing rather than polish — if any one stops being true, this amendment
should be reopened:

1. **The recommendation arrives already selected.** The default path through §4b is one click. The
   checkboxes are an escape hatch for a founder who disagrees, never work the product requires.
2. **The selection does not survive as an object.** No saved list, no unread state, no folder, no
   second visit. Nothing to maintain is what keeps the sentence above true.
3. ~~**One pass only.** The set surface is not reachable from the map, and moment 6 never routes
   through it. A founder who wants a different corpus changes the scope (§5) and gets a new set; they
   do not go back and re-tick.~~

   ***Broken 2026-09-10 by §1a's adoption, and this amendment is therefore reopened as its own
   text requires.*** The list is a permanent column of the working surface (§6a.2), so there is no
   "back" — a founder can re-tick at any moment and the views redraw. **Requirement 3 was the
   strongest of the three and it is retired.**

   **The successor, and it is narrower:** *the selection is bounded by one corpus and does not
   compose across searches.* A scope change produces a new set and the ticks do not travel to it.
   **Curation is across time and across searches; this is within one screen and one corpus.**
   §6a.2 carries the full reckoning, including the admission that this is closer to `Hierarchy`
   than the surface it replaced.

**Open:** the product-facing name for this object. Do not use "terrain" as the object noun without
deciding it. §4b adds a second unnamed thing — *the set* is working language, not a decision.

## 4 · The confirm step

The most important moment in the product: the last thing the founder sees before anything is
searched, and the only place a misreading is cheap to fix.

*It was "the confirm screen" until 2026-09-09, and before that a full-screen view until 2026-08-31.
The name has followed the form down: a screen, then a card in the thread, now a pair of turns in it.
What has never moved is the gate.*

*And it was "the founder-legible form of IPtech's 技術魚骨 plus 技術定義表" until later the same day.
It is not that any more, because the two lists that made it that moved to the map. What
is left is a **read-back and a gate**, which is a smaller thing than this section used to claim and a
truer one.*

***And on 2026-09-10 it became the only correction point in the product, which makes it larger
again without changing a word of what it does.*** The lists it handed to the map went with the map's
axis veto (~~§6.1a~~), and §4b's separate approval of the corpus went with §4b's surface (§6a.2).
**Three correction points became one.** A founder whose sentence was misread has this gate and
nothing else — no axis to rename, no set to reject, only a new search. §1a records that this is
what tipped the gate's own survival, and it is the reason the paragraphs below are not to be
softened.

After the round, the system shows what it understood — the founder's own sentence, the answers they
gave, and anything they asked to leave out. The founder corrects it or approves it. Nothing runs
until they do.

### Three changes, 2026-09-09, and the third is the largest

**Provenance. The founder is never asked to author anything here.** What reaches this step arrived
either from them directly (the sentence, the five answers) or from the engine (§8.7 records the
structure being generated from one sentence in about two seconds). What the founder does here is
**check a reading, not produce one**, and that is a materially smaller thing to ask of someone who
does not speak patent.

**Form. It is not a card any more; it is two turns.** The reading is one message and the action is
the turn after it, with no card chrome around either.

*Why, stated as the problem it fixes.* The card was a ~600px panel with its own heading, its own
bordered gate block and its own actions row, sitting above a composer that had nothing to do. It was
*in* the thread and did not read as *part of* it — a form the conversation happened to contain, which
made the composer look redundant at the one moment the founder most needs to know they can still just
say something.

**Sequence. The two lists left this step, and the reason is an ordering error rather than a layout
one.** They were approaches and outcomes derived from **the sentence**, shown for approval **before a
single patent had been retrieved**. But the matrix is computed over a result set — IPtech's own screen
`24` draws its 8 × 8 over 102 retrieved patents. **The axes are an output of the corpus, not an input
to it.** Approving them here asked the founder to veto a guess; §6.1a asks them to veto a result.

*This retires the disclosure written the same morning, and the "collapsed is not hidden" argument with
it.* That argument was sound about disclosures and beside the point: the question was never whether a
collapsed list is visible, it was whether the list should be here at all.

**What did not change, and this list is the point of the amendment.** It still gates — nothing runs
until the action is taken. It is still reused for every scope change (§5). It is still the last beat
of moment 2. And **the correction is still cheap here and expensive later**, which is the whole reason
the gate exists.

It gates the search because **a wrong reading here poisons every downstream view.** If the system
decided "drone" means camera gimbals when the founder meant propellers, the map, the rivals list
and the trend chart are all confidently wrong, and the founder has no way to tell.

**This step is reused for every subsequent scope change**, not just onboarding. See §5.

**And for every kind of entry.** §2.2 lets the composer take a patent number, a company name or a
classification code as well as a sentence. All four arrive here, and the job is identical in each
case: say what was understood, in plain English, before anything runs.

Never expose the words *fishbone*, *node*, *taxonomy*, or *classification*.

### The composer at the gate — added 2026-09-09

**The gate is the one place the composer is not a new search.** Typing here used to restart the round
from the founder's first word, discarding five answers: the affordance the two-turn form exists to
make usable did the most destructive thing on the surface. It now asks one question back —

> *Do you want me to change how I read this, or leave that out of the search?*

— and applies the answer without leaving the gate.

**The second branch is retired Q4, and getting it back this way is better than a sixth question.**
§4a records *is anything coming up that isn't what you're building* as the real loss of the rewrite:
the fastest narrowing act available, and the only one that used what the founder already knew. As a
question it would be asked of everyone, including the founder who has nothing to exclude. As a branch
off something they chose to type, it is offered exactly when it applies. **It is recorded in the
reading and it travels to §4b**, where the set states what was left out — an exclusion that never
shows on the result it shaped is indistinguishable from one that was dropped.

**And asking is not inferring.** §5's open question says telling a command from a question needs an
intent model we do not have and must not fake. This answers it inside that constraint rather than
around it: the product does not guess which kind of act the sentence was, it asks.

### The commitment moved under the composer — 2026-09-11

**Approve and search is not in the card any more. It is in the composer dock, directly beneath the
field the founder types their correction into.** The two things available at the gate — approve it,
or say what is off — are one decision, and they were in two places separated by a card boundary. The
section above argues that typing at the gate is the affordance the whole step exists to make usable;
putting the commitment a card away from it is the layout saying the opposite.

**It is full width, which is a departure from the note-left / action-right footer the card used.**
The composer's send arrow already holds the bottom-right corner. A right-aligned action directly
under it reads as a second send, and the one control the founder must not press by mistake is the
one that starts the search.

**Three states, and the second is the reason this is written down.** The action is *live* while the
gate is live; *gone* once approved, on reset, and while a read-or-omit question from the branch above
is still open — approving there would search the reading the founder just said was wrong; and
*visible but disabled* while the sentence is being edited, with the reason stated in the composer's
own status line. Disabled rather than removed: the dock is sticky and carries the button, so removing
it would change the dock's height and move the thread under an open textarea.

**"You can change any of this later." is deleted.** It sat beside the action softening it, and it is
the wrong thing to say here — every other line on this screen argues that a mistake at the gate is
the one mistake the results cannot reveal, and §4b is where changing it later actually belongs.

### What this step does not do

*Rewritten 2026-09-09. It said "it does not narrow anything", which was true of the two lists and is
not true of what is left.* Everything at this gate now **does** narrow: the sentence, the five answers
and any exclusion all shape which patents come back. The thing that did not narrow — the map's two
axes — is the thing that left.

So the old division survives, with both halves in new places: **§4a's round and this gate shape the
corpus; §6.1a's two lists shape the map.** They were on one screen and they are on two, which is
easier to state and harder to confuse.

***Rewritten again 2026-09-10, and the division collapsed into one line.*** There are no two lists
and nothing shapes the map but the corpus:

> **The round and this gate shape the corpus. Nothing shapes the map but the corpus.**

The map's columns are generated over what the search returned, its rows are read off the patents,
and neither is editable anywhere. **So every act that changes the map is an act that changes the
corpus** — the sentence, the five answers, an exclusion at this gate, a scope change through §5, or
a tick in the left column (§6a.2). That is a shorter rule than the two-halves version and a
stricter one: *if the founder wants a different map, the only thing they can reach is the corpus.*

*The structure underneath is still IPtech's, not an invention of ours.* The fishbone is **two levels
deep, and only level 1 becomes an axis** — eight branches, eight matrix columns. The `n.n`
sub-branches beneath them exist to hold **a search query and a technical description**, which is
wizard step 2, the 技術定義表. **Their axes and their narrowing live on different levels of the same
tree**, which is the same split this section just made across two surfaces. Read from
`17-fishbone-wizard-context.png` and `25`; step 2 itself has never been captured, which is what
§10.40 asks about.

**Two trees, not one, and that is also theirs.** `技術` and `功效` are selected separately — the
matrix carries `XClass` and `YClass` dropdowns and the fishbone carries its own scheme selector. The
two lists are two independent decompositions of one idea, which is why a founder can be right about
the approaches and wrong about the outcomes.

*Kept as a reading of IPtech, which is what it is, and it no longer describes Terrain. Since
2026-09-10 the map has one generated axis (§6.1) and the founder is asked about neither. **The
observation still earns its place**: it is the evidence that `YClass` is a real selectable scheme,
which is what would make an outcome axis cheap if a later pass ever wants one back.*


## 4a · Narrowing, before the reading

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

**The questions decide the corpus. The confirm step decides the map's shape.**

*This said "the card" until 2026-09-09; the noun changed with §4's form and the division did not.*

That division was found rather than designed, by auditing the confirm step against §6. **Its two lists
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

### The bank — rewritten 2026-09-09

**Five questions, asked one per turn, and four of the five are controls Innovue already ships.** This
replaces the bank of six this section carried from 2026-09-07. The reason for the change is not that
the six were wrong: it is that the engine turned out to be answering some of them already, and
authoring our own version of a question the engine answers better is work that ages badly.

*Corrected twice on the day it was written, and both corrections are below: this first said **four**
questions and claimed beat one absorbed three of the six, and it then said the five were asked in
**two beats**. Five questions, five turns, and the beat survives as something else — see "The beat is
an ordering rule, not a message".*

**Beat one — about the idea.** Two questions. The first has generated options; the second does not.

| Question | Options | Where it comes from |
| --- | --- | --- |
| *Which of these is closest to what you mean?* | five **real labels**, plus `None of these` | `探索方向`, generated from the partial string |
| *Is this hardware, software, or both?* | `Hardware` · `Software` · `Both` | ours — restored 2026-09-09 |

**Beat two — about the search.** Three settings asked together, because they are administrative,
near-instant, and none of them is about the idea.

| Question | Options | Where it comes from |
| --- | --- | --- |
| *Where does this need to hold?* | `United States` · `Taiwan` · `Both` | `資料來源`, country |
| *Granted patents, applications, or both?* | `Granted` · `Applications` · `Both` | `資料來源`, 公告 / 公開 / 全部 |
| *How many patents should I bring back?* | `10` · `20` · `50` · `100` · `500`, each labelled **patents** | `回傳筆數`, the control's own five values |

***The fifth question got much more load-bearing on 2026-09-10, and not one word of it changed.***
It used to set a ceiling on a **list** the founder then approved. The list is now the corpus every
view computes over (§6a.2), so that answer sets **how much of the landscape the map can see** — and
it does so one surface earlier than the founder finds out. The question is unchanged, the wording is
unchanged, and it still says *you can cut the list down once you have seen it*. **What changed is
the consequence of getting it wrong**, and §10.53 — what the control's own default is when the
founder declines — matters more than it did when it was written.

### The beat is an ordering rule, not a message — corrected 2026-09-09

**This section said "two beats rather than five turns" and argued the round-trips saved. That was the
wrong thing to optimise.** Two questions in one message meant two answers in one reply —
*Airframe and body structure · Hardware*, one bubble — which is a fieldset with a submit button, not
a conversation. The saving was real and it bought the wrong thing.

**Five questions, five turns, and every answer is acknowledged as it arrives.** Each turn opens by
naming what was just picked and then asks the next thing, in one sentence, the way a person does it:

> *Airframe and body structure — the frame itself, not what it carries.*
> **Is this hardware, software, or both?**

**The beat did not die; it stopped being a message.** It is still the ordering seam — disambiguation
first, the administrative last — and it still supplies a line where the seam falls, folded into the
same acknowledgement: *"Hardware. And three about where to look."* So the founder is still told the
round has two parts and where they are in it, without either part being a form.

**Only the direction question's acknowledgement carries a gloss.** It is the one question whose
options are generated and whose labels are not self-evident. Echoing `United States` back with an
explanation of what the United States is would be four more small claims to defend, for no reader who
needed them. **A declined question echoes nothing** — "Not sure" is not an answer to read back, and
acknowledging it as though it were is the surest way to make an abstention feel like it cost
something.

**Beat one absorbs two of the retired six.** Old Q1 (*which did you mean*) and Q2 (*what is this for*)
were two ways of asking the same thing — what did that sentence actually denote. The generated
directions answer both in one pick.

**Old Q6 was retired for a few hours on 2026-09-08 and is restored, and the evidence is the same five
chips.** The claim was that the direction settles hardware-or-software too. It does not. Typing
`drone` returns *battery life* (hardware), *obstacle avoidance* (software), *flight stability*
(software), *body structure* (hardware) and *agricultural spraying* (neither) — **the five split three
ways on the very axis the question asks about**, so picking one leaves it open. The prototype had
gone further and asserted the opposite in a hardcoded line — *"Your sentence already told us what this
is for, what you are making and whether it is hardware"* — which is the kind of claim that is only
visible as wrong once there is a real example under it. That line is deleted.

**Two are retired outright, and one of them is a real loss.**

- Old Q3, *are you making the part, or the whole thing it goes into?* — component and system patents
  are near-disjoint sets, and this separated them. The direction chips do it implicitly when the
  generated candidates happen to split that way, and not at all when they do not. **Recorded as a
  gap rather than as a solved problem.**
- Old Q4, *is anything else coming up that isn't what you're building?* — **this is the real loss and
  the argument for it should survive its removal.** It was the fastest narrowing act available and
  the only one that used what the founder already knew, and it was §4b's star inverted: *less like
  this*. Nothing among Innovue's controls does it, which is precisely why it was ours. **It is the
  first candidate if this round ever earns a sixth question**, and until then §4b's star is the only
  surviving half of the pair.

  ***Recovered the same day, and not as a sixth question.*** §4's gate composer asks one thing back
  when the founder types into it — *change the reading, or leave that out of the search?* — and the
  second branch is this question, offered to the founder who has something to exclude rather than
  asked of everyone. **That is a better home than the round.** A forced sixth question would reach
  the founder with nothing to say and cost them a turn to decline; a branch off something they chose
  to type reaches exactly the founder it is for. The paragraph above stands as the record of why it
  was worth recovering.

**One of these is a reversal and one only looks like one.**

*Not a reversal.* §2.2 excludes **legal status** — live versus expired — and holds it out on the
original reasoning. `公告 / 公開` is not legal status; it is **publication stage**, granted versus
laid-open application. Different fact, and a better one for this buyer, because a pending application
is the thing that blocks a founder later. §2.2's exclusion stands unamended and the deferred rail in
§9 is untouched.

*A reversal, recorded as one — and then reversed a second time the same day.* §8.7 marked `回傳筆數`
**Omit · cut**, on the grounds that a founder should not decide how many records their map is drawn
over. The first fix asked for a **posture** instead — *how wide should we look*, `Closest matches` or
`Cast wider` — on the argument that a founder can hold an intention about breadth and cannot hold a
number.

**That argument does not survive asking what happens next.** The engine takes a number. So `Cast
wider` had to become 100 or 500 somewhere between the chip and the query, and **that mapping was ours,
invented, and invisible** — a founder choosing a posture was choosing a count without being told which
one, and we would have been maintaining a private translation table between our vocabulary and a
control that already ships five plain values. **Asking for the number the engine takes is both simpler
and more honest**, and it is the same principle that put the direction chips in beat one: implement
the control that exists rather than author a synonym for it.

**The original objection was to a founder being asked cold, and it is answered rather than dropped.**
A founder still has no basis to pick 50 over 500 before seeing anything — so the question says so:
*you can cut the list down once you have seen it*, which is §4b's recommended cut, stated at the
moment the anxiety occurs rather than one surface later. **The wording must still never imply that a
wider sweep is a better one.**

***And the unit is `patents`, which is Terrain's own English rather than theirs.*** The control renders
筆 as **"pens"** — 筆 is a counter for records, and the machine translation took it for the writing
implement. **This is the second instance of the argument that put the direction chips in our own
words** and it is a cleaner one, because *Drone* versus *UAV* was an inconsistency and this is simply
wrong. It is the strongest small piece of evidence for [brief.md](brief.md) §4's claim that the
English layer is the product: a founder reading *500 pens* does not mistranslate it back, they just
stop trusting the screen.

### The read-back at the gate got more warranted, not less — 2026-09-09

An obvious objection to acknowledging every answer as it arrives: if the thread already says each
answer back, why does §4's gate say all five again?

**Because the round is now twice as long.** Five questions asked one per turn put the founder's
answers across ten messages rather than four, and the first of them is further from the gate than it
has ever been. The read-back is the one place they are in view together, and the case for it
strengthens with every turn added between the first answer and the approval.

The two are also doing different jobs. The acknowledgement says **I heard that**, one answer at a
time, while there is still a question coming. The read-back says **this is what I am about to search
on**, all of it at once, at the moment that becomes irreversible.

### The direction options are real words, and that is a scoped exception

`design-language.md`'s options rule says **an option that could only exist because of what the founder
typed is a bar; an option Terrain would offer anyone is real English.** Beat one's five directions are
the first case and they now render as words anyway. That is a weakening and it is scoped here rather
than folded into the rule.

**What makes it admissible is that they are observed, not invented.** The contract the rule serves
forbids the prototype from *claiming data we do not hold* — an invented patent number, a fabricated
holder. These five came back from the engine for `drone` and are recorded in the capture index. The
distinction the contract actually protects is observed-versus-invented, and a bar is the honest render
only when there is nothing behind it. Here there is.

**Two limits hold it there.** It covers **beat one's options and nothing else** — holder names are
still bars, every figure is still illustrative, and the confirm step's two lists are still bars,
because those we would be inventing. And it is a **worked example**, not a general licence: a second
query would need its own captured directions or its own bars.

*One consequence worth naming.* The rule's own illustration was a **mixed row** — words and bars side
by side, which "looks odd until you know why". After this there are no bars anywhere in the round, so
that mixed row has no instance in the product. The rule is unamended and currently unexercised.

**Which are asked is no longer adaptive, and that is a simplification rather than a loss.** The old
bank chose three to five of six by what the sentence left open. Five is now the whole round, and the
rule that governed the choosing still governs the wording:

> **Ask a question only while it still changes what comes back.**

Beat one's first question always changes what comes back, because it decides which of five corpora
the sentence meant. Its second changes what comes back too, and the retirement that was reversed the
same day is the evidence: hardware and software patents share almost all their vocabulary, so a
corpus that has not been split on it is two corpora. Beat two never changes *what* the engine looks
at, only *where* and *how much* — which is why the three sit together and why none is asked twice.

*What went with the adaptive round.* The prototype carried a per-sentence picker, a lede explaining
how much was being skipped, and a second demo sentence that existed to earn a longer round. All three
are gone. **A fixed round is a smaller claim**: the old one asserted that Terrain could tell what a
sentence had already settled, and the deleted lede is what that assertion looked like when it was
wrong.

### The 2026-09-08 objection, and why it did not survive

*This section argued the opposite one day earlier, and the argument is kept rather than deleted.* The
note read: those chips **offer directions to pick from**; a question here **asks the founder about
their own idea**. A founder who picks *agricultural spraying* off a generated list has been handed a
corpus by the engine's guess at what `drone` decomposes into — the analyst's judgement relocated into
a chip rather than removed.

**That objection is real and it is now overruled on three grounds, in order of weight.**

1. **The alternative had the same defect and worse options.** Our own Q1 and Q2 rendered as bars
   precisely because their options could only be generated. We were never going to write them by
   hand; we were going to generate them too, from less data and with no view of the index. Preferring
   our guess to the engine's was a preference for authorship, not for accuracy.
2. **`None of these` is a real escape, and the composer stays live.** The founder is not confined to
   the frame. The objection assumed a closed list; the round has an open one beside it, which is what
   §2 means by chat being the means rather than a place.
3. **The gate is downstream and unchanged.** §4 still reads the structure back and still refuses to
   run until it is approved. A chip that guessed wrong is caught one turn later by the thing built to
   catch exactly that.

**What the objection correctly identified, and what is therefore recorded as a standing risk:** a
generated list makes the engine's decomposition the default, and defaults are accepted. That is the
price of this round being two taps, and it is why `None of these` may never be styled as the quiet
option.

**Rules, all inherited rather than new:**

- **The never-expose list applies unchanged** (§4). No *fishbone*, no *node*, no *taxonomy*, no
  *classification*, in a question or in an option.
- **The ICP does not speak patent** (`brief.md` §1). Every question is answerable by someone who has
  never read a patent, and no question asks for a code, a class or a date range. *This is what the
  three settings are translated for:* `公告` is not *announcement* and `500 筆` is not *500 pens*.
- **Every question carries a real abstention, and it is not one of the answers.** *Not sure* is its
  own route. *Corrected 2026-09-07*: the first question shipped with *They both apply* as its skip,
  which is an assertion of knowledge rather than an abstention — a founder who does not know had
  nowhere to go. Answers like *They both apply* and *Nothing so far* are real answers and stay;
  **`Not sure` sits beside them.** On beat one, `None of these` is an answer and not an abstention:
  it asserts that all five candidates are wrong, which is information.
- **Answers feed the reading, they do not bypass the gate.** §4 still gates. The questions make the
  reading better; they never stand in for approving it.
- **The answers are read back where they are approved**, so the founder confirms the narrowing and
  the reading together rather than trusting that a turn three messages up was recorded. Since
  2026-09-09 that is the reading turn rather than a row on a card — §4 carries the form.

**Open.** Whether an answer can be changed after the round without starting over. This is smaller than
it was: the composer stays live throughout, so a founder can always say what is wrong in their own
words, and §4's disclosure lets them fix the structure. What is still missing is a way to change *an
answer* — to move from `United States` to `Both` without re-running the round. After a map exists it
is a §5 scope change; between the round and the gate there is still no mechanism. **Small, and
load-bearing enough to keep naming.**

## 4b · The set — what the search found

**Added 2026-09-07.** The search runs, and the founder sees what it caught: a ranked list of what
matched. ~~**What is ticked is what every view in §6 is drawn over.**~~ **Every patent it returns is
what every view in §6 is drawn over** — see the second banner below.

> ***This section keeps its number and its whole argument. Only its host changed — 2026-09-10.***
> The set is no longer a surface; it is the **left column of the working surface** (§6a.2), on
> screen from the moment the gate is approved and never left. Everything specced below is still
> specced: four fields per row, the checkboxes, *Select the top N*, the star, *Re-rank around N
> starred*, *Restore the original order*, the two band headings, twenty to a page and
> *View more patents*.
>
> **Two things went with the surface.** The words *on its own surface* and *before anything is
> drawn* in the paragraph above — the views draw immediately, over the recommendation. And the
> **Build the map** action, because there is nothing to build to. *What that costs, including the
> §3 requirement it broke, is §6a.2's to carry rather than this section's; read the two together.*

> ***AND THEN THE SELECTION WENT — later the same day, 2026-09-10. READ THIS BANNER BEFORE THE
> SECTION.*** The banner above is one edit behind. **There is no per-row checkbox, no recommended
> cut, no *Select the top N* and no *Clear selection*.** Every patent the search returns feeds
> every view, and the corpus is set by the gate and by §4a's fifth question alone.
>
> **Everything below about the checkboxes is superseded by §6a.2 and is kept as the record of why
> they existed** — the escape-hatch argument, the three `Hierarchy` requirements, the interaction
> between a re-rank and a tick. §6a.2 records that deleting the checkbox is §3's own amendment
> being reopened and answered rather than a new idea, so the reasoning below is what that answer
> was argued against. **Where this section and §6a.2 disagree, §6a.2 wins.**
>
> **What replaced them in the bar: sort and filter.** Neither changes what the views count. §6a.2
> carries the table.

### Why this exists

§10.20, asked of Innovue about their own product, is the whole argument:

> An analyst working in `Hierarchy` assigns by hand and bins what does not fit — at the scale our
> illustrative set models, 41 of roughly 158, leaving 117 in scope. **Terrain has no analyst to do
> that discarding.**

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
than explorable. The row **opens the record beside it** — §7a.3's pane, in the second half of a
two-pane surface — exactly as the drill-down does.

*Amended 2026-09-09.* This said the row *expands in place onto §7a.3's handoff*, and it did, while a
detail page was deferred. The pane renders those five identifiers as five of its eleven fields
through the same field function, so keeping the inline disclosure as well would have put two controls
on every row, one showing a subset of the other. **Nothing the handoff showed became unreachable.**

**The star and the checkbox are controls, not a fifth and sixth field.** That distinction is what
keeps §7's cap honest rather than technically-satisfied.

- **The recommended cut arrives selected.** Terrain ranks what matched and pre-selects the top of it.
  The default path through this surface is one click.

  *Reconciled with §4a's fifth question, 2026-09-09.* The founder is now asked **how many patents to
  bring back** before the search runs, which sounds like it collides with this and does not. **That
  answer is a ceiling; this is a recommendation inside it.** The worked example states the whole
  chain: the founder picks **500** → the search matches **162** → the map is built on **124**, with 38
  not carried. Raising the ceiling raises what the engine returns; it does not raise what Terrain
  pre-selects, and it never means the map is drawn over more. The two are the same relationship §2.2
  draws between scoping a search and filtering its results, one layer down — and keeping them
  separate is what stops *more* reading as *better*.

  *The chain is literal in the prototype as of 2026-09-09, and it was not before.* The list is
  `min(ceiling, matched)` rows long and the recommendation is a **share** of it — the one ratio these
  documents cite, 124 of 162 — so the demonstrated path lands on exactly `DATA.total`. **A fixed cut
  was tried first and was wrong**: 124 against a 50-row list pre-selects every row, and a
  recommendation that recommends everything is not one. §10.39 asks whether the cut should be a fixed
  count, a share, or a confidence threshold; the prototype now **exercises** the share and §10.39
  stays open.
- **Twenty to a page, and reading further never changes the corpus.** *Page size recorded
  2026-09-09; it had never been stated.* The first twenty arrive with the surface and every further
  twenty is asked for — so a ceiling of 10 or 20 has no paging at all, and 500 has nine pages of it.
  The control says **View more patents** rather than *Load more*, because it names what is hidden.
  Reading and deciding stay separate acts, or the charts change as a side effect of scrolling.
- **The checkboxes are the escape hatch** for a founder who disagrees with the cut. §3 records what
  they cost and the requirements that keep them admissible. *There were three and there are three;
  the third was retired on 2026-09-10 and replaced by a narrower one — §3, §6a.2.*

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

**A re-rank changes the order and nothing else. It does not touch the selection.** *Added
2026-09-09.* The checkboxes are what the map is built over (§4b's opening), and a re-rank that
silently re-took them would change the corpus without a gate — which is the whole of what §5 exists
to prevent. So the patents ticked before a re-rank are the patents ticked after it, even though they
are no longer the head of the list. **The escape hatch is that *Select the top N* is still there**,
and pressing it takes the head of the ranking now in force. The surface says so in its own lede
rather than leaving it to be discovered.

### What a re-rank says for itself — added 2026-09-09

Re-baselining was built in a form where **the only lasting evidence it had happened was one chip**,
plus 320ms of movement a founder could miss by blinking or never see at all under
`prefers-reduced-motion`. A reordering the founder cannot confirm is one they have to take on trust,
and this surface is the one place they are asked to approve a corpus.

**Four things carry it, and each carries a different fact.** Redundancy was the failure mode to
avoid — the surface already suppresses its own star count once the cut chip covers it, on the
grounds that two chips saying one thing read as two facts.

| Surface | Fact |
|---|---|
| The cut chip | The standing **state** — *re-ranked around N starred* |
| The lede | The **framing**. The resting lede tells the founder to star something; after a re-rank it would be telling them to do what they have just done |
| The panel above the list | The **event** — *re-ranking…*, then how many patents moved |
| The control bar | The **way back** |

**The starred rows lift into a labelled band, and the list gains structure rather than just an
order.** Two headings: *what you starred*, and *ranked around it*. Both are statements about what the
founder did and about the ordering — neither is a claim about the patents underneath, which is what
keeps them inside §6.1. *Closest matches* would not be admissible; *ranked around it* is.

**The count of what moved is a real integer, not a bar.** §8 splits on whether a number counts the
founder's own act or describes the data, and *how many patents changed position* is the former. It
also answers the only question the chip cannot: starring something near the bottom of the list
shuffles a great deal, and starring the row already at the top shuffles nothing — and the surface
says *nothing moved* in that case rather than printing a zero.

### The way back — added 2026-09-09

**A re-rank is reversible in place. One step, and it does not destroy the stars.** *Restore the
original order* returns the list to the ranking the search arrived in, leaves every star set, and
re-arms the re-rank — so a founder can move between the two orderings as often as they like.

**This is not a version, and it is not the back control §4b refuses.** Three distinctions, and they
are the reason it does not reopen anything:

1. **It is not versioned.** §5's history exists for changes to a map that already exists; there is no
   map here and nothing to write a version against. The paragraph above is unchanged.
2. **It is not a route out of the surface.** `design-language.md` says this surface has no back
   control because it is left by approving it. That is about **navigating away**, and it still holds:
   there is no way back to §4a from here and no way back here from the map. What is reversible is an
   **ordering inside the surface**, which is the same kind of thing *Clear selection* was. *That
   control went with the selection on 2026-09-10; the restore is now the only reversal on the bar,
   which makes this point plainer rather than weaker.*
3. **It is not re-ticking.** Requirement 3 above — *one pass only* — forbids returning to this
   surface to change a selection after a map exists. A restore changes no selection at all.

**One step and no stack, and that is a decision rather than a limitation.** The re-ranked order is
computed from the arrival order and not composed onto whatever order is in force, so there is only
ever one step between the two. A stack would let *restore* land on *the order after the first
re-rank* — a state the founder has no name for and did not ask for.

**And restoring is instant. No progress state.** A re-rank plausibly costs an engine call; restoring
is an order already held. Showing a wait for it would be inventing one.

### What this surface may not do

**§6.1 applies to it in full.** The set may state what it found. It may not say, or imply, why
something is or is not in it — no relevance scores presented as verdicts, no *strong match*, no
ranking language that reads as a judgement about the founder's chances. A rank is an ordering, not an
opinion.

**2026-09-08: this is a live decision now, not a hypothetical.** Innovue's semantic surface prints a
relevance score beside every result — `分數 0.8955`, set in a monospaced figure at the top right of the
row, where it is the most prominent thing on it after the title. That is the presentation this
paragraph forbade, shipped, on the engine Terrain would sit on. **So if Terrain renders what the engine
returns, it renders a verdict.** What moves is that honouring the rule becomes an act
of deletion rather than an omission, and §10.46 asks for the score's properties precisely so that
deletion is a decision we make rather than a payload we discover.

***Resolved 2026-09-10, and the paragraph above is what resolved it.*** The score is **printed**.
The prohibition is removed outright with no successor rule — [brief.md](brief.md) §4 carries it,
because the sentence it amends is positioned there as positioning rather than as a feature
decision. *"Honouring it becomes an act of deletion rather than an omission"* was written as a cost
of keeping the rule and it turned out to be the argument against keeping it: Terrain would have
been deleting a number from somebody else's shipped surface on every row, forever, to protect a
line about **generating** verdicts that the number does not cross.

**What this paragraph still forbids is unchanged and is the whole of what is left.** No *strong
match*. No *best fit*, no *most relevant*, no ranking language that reads as a judgement about the
founder's chances. **A rank is an ordering and a score is an ordering; a word about quality is an
opinion.** §10.46 stays open and is now a question about what we are printing rather than about
what we are deleting.

**And the cut it produces becomes a reason a cell can be empty**, which is a §6.1 problem the map now
has to answer. See §6.1's standing note.

### Open

1. **Whether the engine can rank by example at all.** The star assumes *more like this one* is a
   query the engine supports. §8.2 records `AI排序 · 關聯性排序` as evidence it ranks; ranking by a
   **supplied document** is a different capability and is confirmed nowhere. **This is the largest
   technical assumption in the section.** Recorded as a question at §10.38.

   **Narrowed 2026-09-08, and not closed.** Innovue's semantic surface carries a `相似專利` row:
   select a patent and three nearest neighbours appear as chips (§8.7). So *nearest neighbours to a
   supplied document* is a real primitive and no longer "confirmed nowhere" — which was the
   load-bearing half of this assumption. **What no capture shows is the star.** Clicking a chip
   navigates to that patent and re-computes the row around it, with a back control; the ranked list
   underneath does not move. Their mechanism drills sideways **from one patent**; the star re-ranks
   **a set** around one. §10.45 asks whether the primitive can be pointed at a result set. Until it
   answers this is still the largest technical assumption in the section, at roughly half its former
   size.
2. **What a re-baseline costs.** §10.8's per-run cost is unanswered, and "no gate" is a cheap
   decision only while a re-rank is cheap.
3. **What the recommended cut should be.** A fixed count, a share of what matched, or a confidence
   threshold. Recorded at §10.39.

   *2026-09-09: the founder now sets a ceiling at §4a, which does not answer this.* A posture —
   *closest matches* or *cast wider* — says how much to retrieve. It says nothing about where to cut
   inside what came back, which is still one of those three and still §10.39.

   *2026-09-08 — a score exists, and so does a ceiling.* Innovue's surface prints `分數 0.8955` on
   every row, so a confidence threshold is a live option rather than a hypothetical one; §10.46 asks
   whether the score is comparable across queries, which is what a fixed threshold would require. And
   its `回傳筆數` control caps at 500, so if that is an engine ceiling the cut is made from at most 500
   records rather than from everything the sentence matched (§10.47).

## 5 · ~~Chat~~ and versioning

***Chat is deleted — 2026-09-10, the same day the panel replaced the dock.*** It was a 44px dock at
the bottom-right of the map from 2026-08-31; it became a masthead control opening a panel over the
left column that morning; and it was removed that evening. **There is no chat surface in Terrain.**

**Why, and it is a shorter argument than the one that moved it.** The product opens on a
conversation — that is moment 1, and it is the only way in. A second conversational surface reached
from a masthead control is *the same affordance offered twice*, and the second one had to explain
itself on screen (*"anything you type here changes what gets searched"*) precisely because it was
not obviously different from the first. **One conversation, at the front, is the whole of §2.**

**What went with it, stated plainly rather than quietly re-homed.**

- **The landscape summary (~~§7a.4~~) is gone**, not deferred. It was reachable from one chip in one
  panel and nowhere else.
- **The typed scope change is gone.** §5's load-bearing rule — *a command is a different kind of act
  from a question, so it goes to the gate* — is kept below, because it is the reason a typed command
  would still have to be gated if this surface ever grows one back.

***What survives is versioning, and one caller.*** A **version-history revert** is a scope change,
so it still passes the gate — and with the panel gone the gate has exactly one host: **the
conversation surface**. Reverting hands the founder back to where corrections are made, rather than
approving a change to the corpus underneath the map it is about to redraw. That is a better answer
than the panel was, and it arrived by deletion rather than by design.

**The cost is real and is not hidden.** There is now **no way to change what the search covers from
the working surface** except by reverting to a version or starting again. §4's gate is the only
correction point in the product (§4), and it is now the only *entrance* to a correction too. If a
founder on a built map wants a narrower corpus, they run a new search. **Whether that is
acceptable is the open question this deletion creates**, and it is recorded rather than settled.

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

**The rule above is unchanged, and as of 2026-09-10 there is no surface that can break it.** Chat
is deleted, so nothing types a command at a built map. **The rule is kept rather than struck**,
because it is the condition any future surface that accepts one would have to meet.

*What it recorded while the surface existed:* the prototype routed **every** typed message in the
docked chat to §4 rather than only the commands, because telling "which of these is closest to
mine?" from "drop the plastic ones" needs an intent classifier it did not have — and inventing one
in the interface would be the same class of error as inventing a patent count. What survived intact
was the **gate**, the load-bearing half, and that is what carried forward: the one remaining caller,
a version-history revert, still passes it.

### A third option arrived on 2026-09-09, and it is the cheapest of the three

**Ask.** Not a classifier, not a mode switch, not a verb list — one question back, in the thread,
with two chips. §4's gate composer does exactly this: a founder who types there is asked *change the
reading, or leave that out of the search?* and the answer decides the routing.

**This is not a general answer and it must not be read as one.** It works at the gate because the gate
is a narrow context: there are only two useful things a typed sentence can be doing there. On the map
the space of intents is much wider, and asking *"is that a question or a command?"* after every
message would be worse than either failure mode above. So it settles the gate — *and the surface it
left open, the dock, no longer exists. The limit is recorded anyway: it is the reason "just ask" is
not a general answer, and the next surface tempted by it will be wider than a gate.*

**What it does establish is a principle worth naming.** The failure this section fears is the product
*guessing wrong* — a map that changes underneath someone. **Asking is not guessing**, and where the
plausible intents are few enough to put on chips, asking costs one tap and cannot be wrong. That is a
cheaper answer than a classifier wherever it fits, and it should be the first thing tried on any
future surface before a model call is specified.

Two things still to settle before the general case is built:

1. **What classifies a message** *where asking will not do*. A model call, a verb list, or an explicit
   mode the founder picks. Reason 1 above says the cost of getting it wrong is a map that changes
   underneath someone — so the failure has to bias towards routing a question to §4, never a command
   to an answer.
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

## 6 · The views over the corpus

**Six views, stacked in the right pane of the working surface, in one order:**

| | | |
| --- | --- | --- |
| 1 | The map | §6.1 |
| 2 | Filings over time | §6.3 |
| 3 | Rivals | §6.2 |
| 4 | Where it is filed | §6.6 |
| 5 | Live and expired | §6.7 |
| 6 | Lineage | §6.4 |

**Numbers are citation keys, not positions**, which is why §6.3 sits second and §6.4 last. §6a is
the surface; this section is what is on it.

*This section was "The dashboard" and described **two pages behind one toggle**, `Market` and
`Technology`. §1a's architecture struck the dashboard on 2026-09-10 — the ranked list and the views
share one screen and the views share one scrolling column — and **the toggle came back the same
evening without it**, because there being one pane is a reason to have no dashboard and not a
reason for six views to stack in one scroll. §6.5 carries the whole sequence and the split.*

**Colour carries information, or it
is not there** — `CLAUDE.md` and [design-language.md](design-language.md) §2. *This line read
"monochrome, per `CLAUDE.md`" until 2026-09-04; that rule was superseded on 2026-08-31 and the
views have carried colour since — status chips, delta pills and the excluded-window band. What
survives of the original intent is that there is no accent and no decorative colour, and primary
actions are near-black.*

The weighting is deliberate. **Map dominance
survives every rearrangement this section has been through** — but it is now carried by the map
being the *whole* of the `Technology` page rather than by order in one column, and **`Market` is
the page that lands** (§6.5). *So on a first screen the founder sees Filings, not the map. §6.5
flags that as the decision in it most likely to be wrong; this paragraph is the rule it is in
tension with, and the two are left visibly disagreeing rather than reconciled by assertion.*
Within `Market`, order still does the weighting: Filings above Rivals, Lineage last, because
Lineage is the weakest of the six for this ICP and an equal-weight grid would force it to look as
important as the map.

**§6.1 to §6.4 keep their numbers.** They are cited by number from
[case.md](case.md), [design-language.md](design-language.md) and
[`design/components.md`](../design/components.md), and renumbering them to match the pane order
would break every one of those for no gain. **§6.1a and §6.1b keep their numbers too, struck
and marked spent in place** — the same discipline, and the same reason: `~~§6.1a~~` tells a reader
holding a citation what happened to it, where a gap tells them nothing. *§6.5 was in that list for
part of one day and is live again; keeping its number through the strike is exactly why restoring
it cost nothing.*

---

### 6.1 · Hero — the map · 技術功效矩陣 › Company

*The first thing in the right pane, on arrival and on every return.*

A grid. **Columns are technical approaches** — moulded composite shell, tubular space frame,
twin-layer impact skin — generated by the engine from the founder's sentence over what the search
returned. **Rows are the holders**, largest first. Each cell counts the patents at that
intersection: *this company, filing against this approach.*

**One view. There is no switch and no second row axis.** Adopted 2026-09-10 with §1a — it is
IPtech's own `T-Map › Tech-Effx › Company`, the same engine call Terrain was already asking for with
a different Y.

***This replaces a model that stood for one day and a claim that stood for ten, and both are
recorded rather than deleted.*** Until 2026-09-10 the rows were a **switch** between what the
approaches achieve (功效 — longer flight, less noise, cheaper) and who holds them, specced at
~~§6.1b~~. The outcome axis is gone entirely: nothing in the product consumes a 功效 scheme any
more, ~~§10.2~~ is retired moot with it, and [brief.md](brief.md) §1 dropped the question it
answered. **What that costs is stated in the section that carries it** — §1a conflict 5 — and the
short form is that the founder now has no veto over either axis and §4's gate is the only
correction point in the product.

**Where the axes come from.** Both are outputs of the corpus, not inputs to it. The matrix is
computed over a result set — IPtech's own screen `24` draws its 8 × 8 over 102 retrieved patents —
so the columns appear for the first time on the map, over what the search actually returned. The
rows are read off the patents themselves and were never generated at all.

**The second axis is not a Terrain invention and not a build risk, and this is the evidence Change A
rests on.** *Lifted from ~~§6.1b~~ before it was struck, because it is the load-bearing paragraph in
it.* IPtech ships both cuts of this grid under one menu — `T-Map › Tech-Effx` carries `Matrix`,
`Company`, `Country`, `Inventor`, `1D Matrix` and three trend variants: **eight cuts of one
object**. Screen `24` is 技術 × 功效; screen `16` is technology × `Assignee`, with the Y axis fixed to
the assignee and X still the selectable class. Terrain takes the second one.

*Two things we have never seen, and they are open rather than assumed.* Screen `16` is the right
structure captured **degenerate** — a single 1 × 1 cell — so **no capture anywhere shows this view
populated.** We do not know how many holder rows it lays out, whether they collapse into a tree the
way screen `09b`'s assignee list does, or whether it paginates. §10.55. And the holder axis inherits
IPtech's deduplication default, which is the more serious of the two: §10.56.

**Terrain's orientation matches IPtech's.** Screen `24` puts `技術` on X; screen `16` puts technology
on X and `Assignee` on Y. Terrain does the same: technology across the columns.

*This overturned a decision recorded on 2026-09-07 that said the opposite and asked in as many words
that nobody "correct" it later. The reversal is deliberate and the old note is quoted rather than
deleted, because a reader is owed the argument it made.* It said: **a founder reads down a list of
things they might build far more naturally than across one, and the row labels are the longer
phrases.** That is true, it was the right call on the evidence it weighed, and **it is still the
strongest thing anyone can say against this orientation.**

**What it did not weigh is that the rows would stop being things you might build.** Holders are
names, not phrases — and in the prototype they are not even that, because they render as bars. The
approach labels are the longer phrases and they now sit in narrow column heads wrapped to two lines,
which is worse than reading them down a rail. **That cost is real, it is paid, and the reason it is
paid is that Terrain follows IPtech's own axis assignment** rather than transposing a grid the
engine returns one way round.

Cell value is deduplicated by family (同族合併), so one invention filed in nine countries counts
once.

**The cell form is a divergence, established 2026-09-04.** IPtech draws each cell as a **sized,
colour-scaled bubble** with the count printed beneath it — pale blue at 1, dark navy at 16, with a
glossy specular highlight on hover. Terrain's density ramp (`design-language.md` §3.4) fills the cell
instead. That is deliberate and it is defensible on its own terms: a bubble encodes magnitude by
area, which is the least accurately-read visual channel available, and it leaves the cell's own
boundary unmarked so an empty cell and a low cell look alike. A filled cell reads as a region of the
map, which is what this widget claims to be.

#### The legend is a density scale and a hatch, and the three named zones are gone

**Two channels, and neither of them is a state name.**

| Channel | Encodes | Legend reads |
| --- | --- | --- |
| Tone, five steps | the count in the cell | *fewer* → *more filings* |
| A 45° corner hatch | the cell is growing | *Rising* |

***The three named zones — Crowded · Emerging · Open, 地雷區 · 新興區 · 處女地帶 — are dropped
outright, 2026-09-10.*** They were Terrain's own labels over Terrain's own arithmetic, and they
were specced here from 2026-08-31.

**Why they go, and the reason is the row axis rather than the words.** A zone is *a region of a
field*. `Open` on a technology × outcome grid meant *nobody has solved that purpose with that
approach*, which is a claim about the field and is at least the right shape of claim. On a holder
row it would mean *this one company has not filed there*, which is **a party's profile — and a
profile has no regions.** ~~§6.1b~~ had already written the prohibition down for that axis, and
[design-language.md](design-language.md) §3.4 had it as a standing rule; making the holder axis the
only axis made the prohibition the whole of the legend rather than half of it.

**Crowded and Emerging go with it, and not merely for symmetry.** Keeping two of three would leave a
scale whose middle is unnamed and whose ends are verdicts — and *Crowded* on a holder row says a
competitor is strong there, which is a reading of a count rather than the count. **Tone states
quantity and stops.** That is the same sentence `design-language.md` §3.4 uses to explain why the
ramp is grey, and it is now what the words do as well as what the hue does.

**The hatch survives, and it is the one thing here that had to be argued for rather than kept.**
*Rising* is a **second channel**, not a point on the ramp: a cell can be light and hatched, or dark
and hatched, and both are true and useful readings. Dropping the zone names removes the thing that
made two channels look like three states, so **the two-channel encoding is now the whole of the
design rather than a workaround inside it.** `design-language.md` §3.4 carries the structural
argument and the measurement behind the hatch label.

*A successor legend was drafted at ~~§6.1b~~ — `Most filings · Rising · None from this holder` — and
it is not what shipped. It was well argued and it kept the named-zone framing, which is the thing
being dropped. It is recorded so it is not re-proposed as new.*

**Density bands are cuts of the active view's own maximum**, not absolute thresholds. With one view
there is one maximum and the arithmetic is simpler than it was: the cuts land at 2/14, 6/14 and
12/14, which on the illustrative set's maximum of 14 fall on exactly 2, 6 and 12.

#### The finding: no holder owns any approach here

**The map's caption is two or three plain sentences naming what the grid shows** — which approach
carries the most filings, which is thinnest, and how concentrated the holders are. Those sentences
are the map's *finding* and stay on the card.

***And the fragmentation is the finding, on this axis, in the illustrative set.*** *Lifted from
~~§6.1b~~, where it was the strongest sentence.* No cell exceeds 5. That is not a rendering weakness
to be scaled away: **no holder owns any approach here** is the most useful single sentence this
widget can give a founder, and it is only visible because the bands are relative.

**The map lays out the largest holders, not all of them, and it says so.** A landscape of 124
patents across a fragmented field has too many holders to lay out; the map takes the top eight. Its
cells therefore sum to **less than the scope figure** — 51 against 124 — **on first load, with
nothing removed.**

*That sentence sits under the legend rather than in it, because it qualifies the whole grid rather
than one tone — read as a fourth legend entry it looked like a density state.* **And it is a
standing condition now rather than an edge case.** It used to appear only after an axis edit, which
is why it could be left owed; the holder axis produces it on arrival, and it is what the
verification check has to test against. **The invariant is not *cells sum to total*. It is: cells
sum to `shown`, `shown` is less than `total`, and a sentence on the card says why.**

#### Why this is the hero

*Rewritten 2026-09-10. It read: "A search tool returns a list, and a list cannot show a gap — a gap
is an absence, and absences cannot be enumerated. The matrix is the only artifact that renders
absence visible." That argument died with [brief.md](brief.md) §1's third question, and it was
argued against a straw search box rather than against the thing this widget now is.* Three claims
replace it, and each survives contact with `Tech-Effx › Company`:

1. **It is the only artifact here that carries two dimensions at once.** Rivals is a list of
   holders, Filings is a time series, Lineage is a table — each answers *who* or *when* separately.
   Only the grid answers **where each holder is**, and [brief.md](brief.md) §1's first question is
   not answered until the founder knows which part of the space each rival occupies. That is a claim
   about the **join**, and no list can make it.
2. **It is the only widget shaped by the founder's own sentence.** Every other view here is
   computable from bibliographic fields over any result set. The columns are generated from what
   this founder described, which is why the map is still *the only thing here a general patent
   database cannot show*.
3. **It is the only artifact serving the second pillar at all.** *What is adjacent to mine* has no
   other widget: §9 defers the technology × application matrix on the grounds that it *answers
   adjacency more directly*, and it is deferred. Until that changes, adjacency is read off the
   columns of this grid or it is not read.

#### What the map may never do

**The blind spot, stated plainly:** an empty cell is ambiguous, and on this axis it is ambiguous in
its own particular way. Nobody in this set has filed a twin-layer impact skin under that holder —
that is either an opening or a sign the holder tried it and stopped, and **the map cannot say
which. The map shows who is where; it cannot say why anyone is absent.** Never let the interface
imply otherwise.

*This paragraph read "the map shows where nobody is; it cannot say why" and gave plastic propellers
as the example. The rule is unchanged and the example had to move: on a holder row the absence is
one party's, not the field's, so an example about the field taught the wrong reading of the same
rule.*

**A second reason a cell can be empty, and it is one the interface itself created: the ceiling.**
The map is built over what the search **returned**, which is capped by the founder's answer to the
fifth question — *how many patents should I bring back* (§4a) — not over everything the sentence
matched. So a cell can be empty because that holder did not file there, **or because what they
filed fell outside the cap.**

*This used to say "the set the founder approved in the left column". **The per-row tick went on
2026-09-10** (§6a.2) and with it the founder's ability to shape the corpus one patent at a time —
but the reason survives intact, because the CEILING still cuts. It moved from an act the founder
performs on the result to an answer they give before it, which makes it earlier, coarser and
harder to notice. §4a's note that the fifth question got more load-bearing is the same finding
from the other end.*

> **The map carries a standing note of what it was built on**, above the pane, on every visit —
> *built on N of M matched*.

Four conditions. It is **standing**, not a toast and not a dismissible hint; it is present on the
return visit as well as the first, because a return visit is where the founder has forgotten what
they picked; it names **both numbers**, since *built on 60* without the total says nothing; and it
is not a control — changing the corpus is a scope change and routes through §5 like any other.

*This note's own retirement condition is written into it — "if the corpus ever stops being
founder-cut, this note is no longer required" — and **it has not occurred.** §4b's selection
survives §1a's collapse intact; it moved hosts and kept every act. The note stays.*

**A third place the two reasons bind: the filtered list's own empty state.** Clicking an empty cell
filters the left list to nothing, and the list has to say something. **It says
*"No patents from your set fall here."*** — and every word of that is doing work:

- *"No patents"* states the fact and stops.
- *"from your set"* is the second reason, carried in the copy rather than left to the standing note
  at the top of the screen. The founder is looking at the consequence of their own cut and is told
  so.
- **What it must never say** is *"nobody has filed here"* — which asserts the first reason as though
  the second did not exist, and which on a holder row is **false as well as forbidden**, because the
  cell is about one company and the sentence is about everybody. Nor *"open"*, *"an opportunity"* or
  *"unexplored"*, which assert **why**. *That prohibition got stronger with the axis change rather
  than weaker, and it is the one thing in this section that must not be relaxed alongside the zone
  names: dropping the word `Open` from the legend and then writing it into an empty state would be
  the same claim, arriving through copy.*

**IPC confidence signal.** Compare the system's grouping against the official IPC classification of
the same patents, and surface the agreement as a quality indicator. IPC is the only part of this
pipeline that is not AI-generated — the patent office assigned it — so it is the one available check
on a system that otherwise infers everything from a sentence. *Open: how to present this without
turning it into a statistics lesson.*

- **Interaction:** click a cell → **the left list filters to that intersection** (§6a.3). Never a
  re-search. *This was "the drill-down list" until 2026-09-10; §7 records what changed and what did
  not.*
- **Axis labels are plain English. Never IPC codes.** Column labels are generated words and render
  as words. **Holder rows render as skeleton bars in the prototype** and only there — the rule is
  `CLAUDE.md`'s, it governs published artifacts, and the product may name holders (§1a conflict 4).
  The card says so rather than leaving a reader to infer that Terrain ships nameless rows.
- **Edge states to spec:** too few results to form a matrix; only one dimension resolves; every cell
  crowded; every cell empty; **more holders than rows, which is now the ordinary case rather than an
  edge.**

---

### ~~6.1a · Changing the two axes~~ — added 2026-09-09, spent 2026-09-10

***Struck. There is no axis veto anywhere in the product.*** This section specced the founder's four
acts over the two generated lists — rename, remove, reorder, add — on the map's widget page. Both
the lists and the page are gone: the outcome axis with §6.1's rewrite, and the page with ~~§7a.2~~.

**The number is retained and not reused**, per §6's rule. Anything citing §6.1a is citing a control
that does not exist, and this line is what tells them so.

**What its removal costs, since the section spent a page arguing the veto was necessary.** It argued
that a founder who was misread needs somewhere to go, and that the map page *"already promised this
and shipped no control that did it"*. That is now true again and permanently: **the founder's only
correction point is §4's gate**, which is one surface and one moment earlier than the veto was, and
which corrects the *sentence* rather than the *axes*. §4 says so in its own words, and §1a records
that this is the price of conflict 5.

*One argument inside it generalises and is kept at §4: an edit redraws, it does not re-search. That
division — the round and the gate shape the corpus, nothing else shapes the map but the corpus —
outlived the control it was written for.*

### ~~6.1b · The two row axes, and the switch~~ — added 2026-09-10, spent 2026-09-10

***Struck the same day it was written.*** It specced a control in the map's card head switching the
rows between outcomes and holders, and changing five things together: the rows, the density bands,
the legend's words, the finding, and what an empty cell claims. **There is one row axis and no
switch.**

**Three things in it were right and are now in §6.1 rather than here**: the provenance evidence
(`Tech-Effx` ships eight cuts of one object; screen `16` is technology × `Assignee`), the
fragmentation finding (no cell exceeds 5 against 14 — *no holder owns any approach here*), and the
top-eight arithmetic with the sentence that reconciles it.

**One thing in it was right and is now stronger for being unconditional**: `Open` may not describe a
holder's absence. It was a rule about one of two states; it is a rule about the only state there is,
and §6.1 states it as a prohibition on the empty-state copy rather than as a legend condition.

**And one thing in it does not survive: the successor legend** — `Most filings · Rising · None from
this holder`. It kept the named-zone framing, and the framing is what went. §6.1 records it so it is
not re-proposed as new.

---

### 6.2 · Rivals · 競合分析

*Second on `Market` since 2026-09-10, under Filings, per §6.3 — §6.5, §6a.*

Named companies holding ground near the idea. Company, patent count in scope, closest cells, and
most recent filing date.

**And it is now the map's own row axis, read as a list.** §6.1's rows are these holders. That is a
redundancy worth naming rather than resolving by deleting one of them: the map says *where* each
holder is and the table says *how much* and *how recently*, and the recency field in particular has
nowhere on the grid to live. **Deduplication therefore stopped being this widget's problem and
became the map's** — §10.56, and the most serious external dependency in the document.

**Deduplication is the entire value.** Without 名稱統一 (name unification) and 同族合併 (family
merge), "DJI", "SZ DJI Technology" and "Dajiang" are three rows and a single invention counts nine
times. The list is worthless without both, and a founder has no way to notice it is wrong.

Default sort by count, but surface **most recently active** separately — a competitor who stopped
filing in 2019 is a materially different fact from one filing now, and the count alone hides it.

- **Interaction:** click a company → **the left list filters to that holder** (§6a.3), the same act
  a cell click performs and with the same chip. *It opened a drawer until 2026-09-10. Two clicks on
  one screen that mean "show me these patents" may not resolve two different ways, and the drawer
  was the one with no home once the list was permanently on screen.*
- **Open:** the data source for distinguishing an incumbent from a small player.
- **Edge state:** no rivals found is a real and meaningful result. Say so in words. Do not render an
  empty table.

---

### 6.3 · Filings over time · 宏觀趨勢分析

*First on `Market`, and so the first widget a founder sees, since 2026-09-10 — §6.5, §6a.*

Filings per year within scope; optionally split by top companies. Tells the founder whether the
space is heating up, cooling, or peaked years ago.

***Two decisions arrive here from §6.5, which was struck and restored inside one day.*** Both are
about this widget and neither depended on the toggle that carried them — which is why they stayed
here when it came back.

**One: this is the question a founder asks first, and that is IPtech's finding rather than ours.**
Selecting `M-Map` lands on `Patent Count › Trend` with no further navigation, drawn twice — once by
publication year, once by application year. The market side of the engine treats *is this space
moving* as the first question, and the people who built it have watched analysts use it for longer
than we have. **It does not make this the hero here** — the map is, and §6.1 says why — but it is
the reason this widget sits above Rivals in the pane rather than below it. *§6.5 read that finding
as* land the founder on `Market` — *for one day there was nowhere to land and the finding was only
an ordering; with the toggle restored it is doing both jobs again, and this widget is the first
thing a founder sees.*

**Two: the two-series form is declined, and it was observed rather than imagined.** IPtech plots
publication year and application year as separate charts, and the application-year series falls off
a cliff in the last two years — which is the publication lag, drawn rather than labelled. Terrain
keeps **one series and the shaded `Not yet published` window**, because this section's whole
argument is that this reader must not be asked to infer a data artifact from the shape of a line.
Two series would make them infer it twice.

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

*Last on `Market` since 2026-09-10 — §6.5, §6a.*

Who holds the ground this approach grew out of — the party a founder would license from or design
around.

**v1 is a reduced form:** the three to five most-cited patents in scope, with holder and date.
**Not a network graph.** A citation graph is noise to someone with no patent background, and
rendering one would be effort spent making the weakest widget look expensive.

Recorded honestly: this is the least valuable of the four for this ICP and the hardest to build. It
ships rough. Map dominance is partly what allows that, and being last in a scrolling column is a
more honest statement of that weighting than being one of two cards under a hero was.

**The counterpart is identified, 2026-09-04.** 技術脈絡分析 came from a *search listing* and had
never been matched to a screen — the comparison deck's panel 07 was deliberately unpaired because of
it. It is **`Switch To Ai Insight`**, the toolbar action on every M-Map and T-Map screen: a generated
narrative that traces the field across three eras and then names five core technology concepts with
their relationships and representative patents. It closes its own first section with *"整體而言，本專案
**技術脈絡**正從「單機飛行性能優化」轉向…"* — using the exact term for what it produced. Screen `28` in
[`visual-reference/iptech-screenshots-identified/README.md`](../visual-reference/iptech-screenshots-identified/README.md) §2.16.

**This is our reading, not Innovue's confirmation**, so §10 keeps a one-line check on it.

**And it is a better answer to this widget's question than this widget is.** A three-era narrative
answers *how is this space moving* more directly than a most-cited table does, and §2.16 shows the
engine already produces it. **Decided the same day: the table stays for v1 and the narrative is
recorded as a candidate, not adopted.** Reopening a settled widget was the larger change of the two
available, and §7a.4's landscape summary is where that capability actually sits — so if the narrative
enters Terrain it should enter there, once, rather than here as a second thing that resembles it.

***That destination went on 2026-09-10.*** ~~§7a.4~~ is struck with the chat panel, so the candidate
has nowhere to enter. **The table still stays for v1** — that half is unaffected — and the question
of where a fuller reading lives is §11's.

---

### 6.5 · The two pages, and the toggle — added 2026-09-10, struck 2026-09-10, restored 2026-09-10

***Written, struck and restored inside one day, and the churn is the record rather than an
embarrassment to tidy away.*** It specced one control at the top of the dashboard,
`Market` / `Technology`, swapping widgets between two pages with `Market` as the landing page. §1a's
adoption collapsed the dashboard into one pane and struck it the same morning. **It is back that
evening, against the collapsed surface**, because the argument that struck it was about the
*dashboard* and not about the toggle: there being one pane is a reason to have no dashboard, not a
reason for six views to stack in one scroll.

**The section keeps its number, which is why the number was retained and not reused.**
[brief.md](brief.md) §4 carried this as **Locked**, then recorded the retraction; the lock is back
and is recorded there as a third entry rather than by editing the retraction away.

#### The split

**It is IPtech's own, and it is lopsided because theirs is.**

| Page | Views | Source |
| --- | --- | --- |
| **`Market`** *(lands)* | Filings over time · Rivals · Where it is filed · Live and expired · Lineage | `Patent Count` · `Company` · `Country` · `Legal Status` — every one reachable under **both** maps |
| **`Technology`** | The map | `T-Map › Tech-Effx › Company` — **the only destination reachable under `T-Map` and not under `M-Map`** |

**This is the table §8 already carried, applied to the six views rather than to IPtech's groups.**
§8 records the finding that settles it: `T-Map` is `M-Map` plus a classification filter plus the
eight `Tech-Effx` entries, and 60 of the 68 destinations sit under both. So there is exactly one
view here that is *technology* in IPtech's own structure, and it is the map.

**`Market` lands**, for the reason §6.3 already carries: selecting `M-Map` opens on
`Patent Count › Trend` with no further navigation.

***Two things about that are uncomfortable and are stated rather than argued away.***

- **A one-view page.** `Technology` holds the map and nothing else. That is faithful to the source
  and it looks thin. It is accepted for now on the grounds that the map is the largest thing in the
  product and does not read as a thin page — and because the alternative, inventing a Terrain split
  that is not IPtech's, is the thing §8 warns against doing to somebody else's menu.
- **The hero is not on the landing page.** §6.1 makes the map the hero and §6.3 says it is what you
  see without scrolling. With `Market` landing, the founder's first screen is Filings. **This is the
  one decision in this section most likely to be wrong**, and flipping the default to `Technology`
  is a one-line change.

#### Form

**`role="tablist"` with `aria-selected`, not a group of `aria-pressed` buttons.** This is
which-of-these-am-I-looking-at, not a setting; telling a screen-reader user *pressed* for a surface
swap describes the wrong event. [design-language.md](design-language.md) §7 carries the general
rule and this is its clearest instance.

**In the working surface's own head, at the trailing end of the chip row, above the hairline.** It
moved twice in two days and the second move is the one that matters. It shipped on the *leading*
edge of a band inside the right pane, over the card titles, where it read as a label belonging to
the first card; it went to that band's trailing edge; and on 2026-09-11 the band went altogether.
**A segmented control does not need 44px of pane to itself** when the surface already draws a row
of chips with space at its trailing end — and those chips are the same scale, so nothing had to be
resized to fit.

*One consequence, and it is deliberate: the toggle now sits above BOTH columns rather than over the
pane it governs.* It reads as a control over the surface, which is what a surface head is for.

**Nothing animates.** Both pages are built from the same project payload, so the toggle chooses what
is on screen and makes no request. §7: a swap is navigation, and only a fresh build earns the
stagger — a toggle that animated like one would claim the data had been recomputed when it had not.

#### What the strike re-homed, and what it left

Three findings were re-homed while this section was struck. **All three stay where they went**, and
none of them comes back here:

- **The `Market`-landing reasoning → §6.3**, where it also does the work of putting Filings above
  Rivals in the `Market` page's order.
- **The two-series refusal → §6.3.** One series and a shaded `Not yet published` window.
- **The engine seam → [brief.md](brief.md) §4.** `Market` is computable from bibliographic fields;
  `Technology` needs a taxonomy generated from the founder's sentence. **This is what makes the
  split worth having rather than cosmetic**, and it was true with or without a toggle — but with
  one, the seam is visible on screen.

**And the rule that keeps a toggle honest comes back with it**, because it is answerable again:
*if a founder never touches the toggle, have they lost a finding?* With `Market` landing, a founder
who never touches it **never sees the map** — which is the sharpest possible form of that question
and the reason the landing-page decision above is flagged. The general form is §7a.1's.

**One thing the strike closed stays closed.** This section had noted that `Where it is filed` and
`Live and expired` had no widget page behind them while four other cards did. **There are no widget
pages at all** (~~§7a.2~~), so the asymmetry is gone by removal. The question it was really asking —
*where does a widget's full form live* — is open and carried at §11. *A preview may never become the
only record of a surface, which is why §11 carries it rather than this document answering it.*

### 6.6 · Where it is filed — added 2026-09-10

**Third on `Market` (§6.5), and it closes the largest single omission in §8.** `Country › Distribution` has
been a `Diverge` row since 2026-09-07 with **no design at all** — [case.md](case.md) §4.H tiers it
founder-facing and it appeared nowhere in §6. For a US founder deciding whether a space is crowded
*in their own market*, it is closer to a first question than most of this section.

**Form:** the share pie and the ranked bars already built for the Rivals widget page, at card scale —
`design-language.md` §7 specs both. Jurisdictions are a small closed set, so unlike holders they are
**named in words**: `US`, `CN`, `EP`, `JP`, `KR`. Naming a jurisdiction is not naming a holder and
the skeleton rule does not reach it.

**Caption states the US share in a sentence**, on the same principle as §6.3: the founder should not
have to read it off a wedge.

*Distinct from the database-scale claim*, which is total reach across 100+ countries. This is
distribution **within the result set**, and the two are answering different questions.

---

### 6.7 · Live and expired — added 2026-09-10, renamed 2026-09-10

*It was **`Is it still live`** for a few hours. The other five cards are `The map`,
`Filings over time`, `Rivals`, `Where it is filed` and `Lineage`; this was the only one that asked
the reader a question, and a card that interrogates the founder from its own title is a card
doing the reading's job. **`Live and expired` names both halves the donut draws.** The caption,
the donut's centre label and its `aria-label` all still say "still live" — those are sentences
about the data, not the widget's name, and they are correct.*

**Fourth on `Market` (§6.5).** `Legal Status › Company-Legal Status` (screen `21`) is rated the strongest
single finding of the platform audit and has until now spent exactly one word per drill-down row.
A founder reading a crowded space needs to know how much of the crowd is **still enforceable**, and
an expired patent is prior art rather than an obstacle — opposite situations.

**Form:** the donut plus stacked bar already specced in `design-language.md` §7 and carried in
[`design/components.md`](../design/components.md) §2 as blocked by data. It takes the **state
hues** — live and expired are ordinal, not categorical — and never `--mark-*`.

**It ships against the skeleton contract.** The illustrative set does not carry per-holder legal
status, and `design-language.md` §8 governs what that looks like. This is the one widget in the pane
whose numbers are not yet real, and §10.1 is what unblocks it.

---

---

## 6a · The working surface — added 2026-09-10

**One screen, three regions and one overlay.** Everything after the gate happens here.

| Region | Width at 1440 | What it is |
| --- | --- | --- |
| The masthead | full width, ~48px tall | §6a.1 |
| The left column | **420px** | the ranked patents — §6a.2 |
| The right pane | ~1020px | §6's six views across the `Market` / `Technology` toggle — §6.5 |
| *Overlay, right* | covers the pane to a ~200px peek | the patent record — §6a.4 |

*The left column was **340px** until 2026-09-10 and the chat panel was a second overlay over it.
Both changed the same day: the column is wider because the row now carries a relevance score beside
the title and a sort and filter bar above it, and the panel is deleted (~~§5~~).*

**The arithmetic is what forces this, and it is worth having in the section it constrains.** *Lifted
from §1a.* The map's eight columns need **944px** — 176px of row labels plus 96px per column —
before the grid reads without scrolling. The result list stops being readable under about **340px**.
With the 260px sidebar that is **1544px**, which does not fit a 1440px laptop. At the collapsed 64px
rail it is 1348px; with a top masthead, **1284px**.

***The paragraph that used to sit here was wrong, and the correction is more useful than the claim
was.*** It read: *"at 1440 the right pane is ~1080px and the matrix fits with about 136px spare."*
**The pane is not the matrix's container.** Four insets sit between them, and it counted none:

```
1440 − 421 (left column + its border)  = 1019   the pane
     −  48 (the pane's own padding)    =  971
     −  64 (the grid's padding)        =  907
     −   2 (the card's border)         =  905
     −  40 (the card's padding)        =  865   what the matrix actually gets
```

**The matrix needs 944. So at 1440 it overflows by ~79px and scrolls inside its own container**,
which is what that container is for. **At 340px it fitted by ONE pixel** — 945 against 944 — not by
136. So widening the column did not introduce the scroll; it spent a 1px margin nobody knew was
there. Recorded because the next person to widen a column will do this arithmetic, and the chain
above is the answer.

*The rest of that paragraph still holds and is why the masthead beat the icon rail: at 1280 the rail
leaves ~876px of pane, which is a far worse overflow than the masthead's.*

**One overlay now, and it takes the right edge.** The record covers the **right** pane, so it covers
the thing that is not its subject — you read a patent record against the map you found it on. *The
chat panel held the left edge under the same rule and is deleted (~~§5~~), so the left column is
never covered by anything. The allocation that resolved the collision between the two is moot; the
rule it was drawn from is kept, because a second overlay would need it again.*

### 6a.1 · The masthead

**48px, full width, and it carries what a 260px rail carried.** Six regions:

| | Region | Note |
| --- | --- | --- |
| 1 | The TIS submark and the product name | leading edge. Still the only mark in the chrome |
| 2 | **New search** | returns to §2's moment 1. Never clears the current project. *No longer a filled button — it is navigation, not this surface's primary act* |
| 3 | The project switcher, with version history nested under the open project | see below |
| 4 | The points figure | a balance, not a percentage |
| 5 | The three-state theme control | **light · dark · system**, and it stays visible |
| 6 | The account menu | four items |

*It was seven until 2026-09-10. `Chat` sat between the switcher and the balance and is deleted with
the panel it opened (~~§5~~), which relieved the pressure below without removing the problem.*

**This is the hardest visual problem in this pass and it is named as such rather than assumed
solved.** Six regions in 48px is a real constraint, and §1a records that the masthead won on
width arithmetic rather than because it was the better shell. What follows are the three things
that must not be quietly lost in fitting them.

***The theme control stays on the bar. It does not go into the account menu.***
[design-language.md](design-language.md) protected this control by name from disappearing at 64px,
on the grounds that *a rail that vanishes when the sidebar collapses would make collapsing a way to
lose the theme control.* **Burying it in an account menu is that same loss by another route**, and
the fact that the route is different does not make it a different outcome. If a design pass proposes
demoting it, that reverses a recorded decision and has to be argued as one.

***Version history stays nested under the open project, not flattened into a peer list.*** In the
sidebar, `placeHist()` relocated the version block to sit **directly beneath the `aria-current`
project**, indented, with a left hairline carrying the relationship. That nesting was a deliberate
statement about what a version belongs to — a version is of a project, and a flat list of labels
beside a flat list of projects says nothing about which belongs to which. **A dropdown flattens it
by default, so the nesting has to be rebuilt inside the menu rather than assumed to survive the
move.** If it cannot be, that is a loss and it gets recorded as one.

*§1a's own objection to the masthead was exactly this: it puts the project switcher and version
history behind a menu in a product whose §5 treats "every change is a version" as a first-class
promise. **The objection is not answered by the masthead winning.** It is answered by the two
paragraphs above, and only if they hold.*

***And the argument that moved history into the sidebar has dissolved, which is worth saying out
loud.*** History moved there on 2026-09-10 on the reasoning that version history is project-scoped
and the sidebar was the only element surviving a view swap — *a control that exists on one of five
surfaces was never a control.* **With one working surface there are no view swaps**, so that
argument decides nothing here. What replaces it is smaller and still sufficient: history belongs
with the project because it is a property of the project, which is the nesting rule above.

**The attribution line does not go on the masthead.** *Powered by* plus Innovue's mark stays at the
**foot of the right pane** and at the foot of the conversation, as it has since 2026-09-08.
[brief.md](brief.md) §3 governs it and nothing in this pass re-argued it.

### 6a.2 · The ranked list — §4b's set, on its new host

**§4b keeps its number and most of its argument.** What changed is the host, and then — later the
same day — what the list *is for*. Still specced from §4b: four fields per row, the star,
*Re-rank around N starred*, *Restore the original order*, the two band headings, twenty to a page
and *View more patents*.

**What is gone from it: the surface, the button, and the selection.** There is no set *screen*, no
**Build the map** action, and **no per-row checkbox**. The list is a column of the working surface
from the moment the gate is approved, and the views are beside it.

***EVERY PATENT THE SEARCH RETURNS FEEDS THE VIEWS.*** Decided 2026-09-10. There is no subset, no
recommendation, and nothing for the founder to include or exclude one row at a time. The map and
the five other views are computed over the whole of what the search brought back, from the moment
the gate is approved, and the standing note (§6.1) states the figure permanently — *built on N of M
matched*.

**Why, and it is the §3 argument finally landing rather than a new one.** §3 admitted the
checkboxes against three requirements and said that if any one stopped being true the amendment
should be reopened. Requirement 3 — *one pass only* — had already been retired by §1a putting the
list permanently on screen, and this section previously recorded that as *the honest cost*, with
the admission that a permanently visible list of patents with checkboxes that redraw a chart **is
closer to `Hierarchy`** — the analyst's curation workbench the whole product exists to remove.
**Deleting the checkbox is the amendment being reopened and answered.** The list stops being a
workbench and goes back to being a result.

Four things follow, and they are decisions rather than descriptions:

***One invariant broke when the selection went, and it is recorded rather than quietly fixed —
2026-09-11.*** The list held everything the search **matched** (162 at the demo ceiling) and a
share of it was *recommended* (124); the views were drawn over the recommendation, and the
standing chip read *built on 124 of 162 matched*. **Deleting the selection left 124 with no
source.** Every view is still computed from it — the matrix sums to it, the finding quotes its
maximum, Rivals totals to it — while the list went on being 162 rows long.

**The list is the 124.** `binned` is what the search itself dropped — families merged,
out-of-scope filings — and those never reach the founder; `matched` stays the wider figure the
chip cites as its denominator, which is all it was ever for. *Nothing on screen disagreed until
the list's foot began printing "20 of 162 patents" beneath a chip saying "built on 124 of 162",
which is the general lesson: **a figure removed from the interface does not remove what depended
on it.** Two consumers of the deleted share were fixed at the time and the list's own length was
a third, silently.*

1. **The corpus is set at the gate and by the fifth question, and nowhere else.** *How many patents
   should I bring back* (§4a) is now the **only** control the founder has over how much of the
   landscape the map can see. That question did not change; its consequence did, and §10.53 — what
   the engine's own default is when the founder declines — matters more than when it was written.
2. **The columns are computed once, at the gate, over everything the search returned.** Unchanged,
   and now trivially true: there is no re-tick that could regenerate them.
3. **Nothing on this list is a scope change.** Sorting, filtering, starring and re-ranking are all
   ways of LOOKING at one corpus. Nothing is re-retrieved, nothing is re-classified, no version is
   written and no points are spent (§7a.9). *The debounced "version per settled selection" specced
   here is deleted with the selection that produced it.*
4. **The list says so — behind its info affordance.** *Every patent the search found feeds the
   views beside them. Sorting and filtering change what you are looking at, not what they count.*
   ***It was a standing sentence under the list until 2026-09-10 and it is now in the heading's
   popover*** — the third thing that popover has absorbed, after a four-line lede and a second
   popover in the bar. The rule this keeps arriving at is worth stating: **a 420px column has room
   for the list or for prose about the list**, and every sentence that is not the list belongs
   behind one control. The one clause that could not go with it is *what the views count has not
   changed — only the order*, which is true only in the moment after a re-rank; it is a clause of
   the settled sentence in the beat panel instead.

**What the founder can still do to the list, and the line all three sit on the safe side of:**

| Act | What it changes | What it does not |
| --- | --- | --- |
| **Sort** — relevance · newest filed · oldest filed | the order on screen | what the views count |
| **Filter** — live/expired · kind | which rows are on screen | what the views count |
| **Star** → *Re-rank around N starred* | the order on screen | what the views count |

***And the star now has a consequence on screen — 2026-09-10.*** Until that day starring filled the
star, drew an anchor rail, counted a chip and enabled a button twenty rows below: four quiet
signals and **no sentence anywhere saying what starring was for**. A founder could star three
patents and never learn that re-ranking was the point.

**The first star opens a strip directly above the list** — *"Find patents like the one you
starred"* — carrying the `Re-rank the list` button, which moves up from the foot. Three things about it are decisions rather than styling:

- **It is shown by the expression that enables its own button.** One condition, two consumers, so
  the interface cannot offer an action it has already performed.
- **It is at the top of the list, not the bottom.** The button's old home carried a comment saying
  it sat outside the scroller and so could not be scrolled out of reach; it was inside the
  scroller and it plainly could. *A call to action under twenty rows is one nobody sees.*
- **It is still not a scope change.** Re-ranking reorders and nothing else — point 3 above is
  unchanged, and the settled sentence says so in as many words.

**Sort and filter are new on 2026-09-10 and they took the space the two selection controls held.**
*Select the top N* and *Clear selection* are deleted; they operated a recommendation that no longer
exists. **The facets are real values only** — `status` and `kind` are English words already printed
on the row and in the record. Jurisdiction was considered and refused: §8 keeps it a bar, and
filtering on a value the founder cannot see is a filter they cannot check.

**And the `Hierarchy` test now passes on its own terms rather than on a narrower replacement.** The
three properties this section used to have to argue for are simply true:

- **Zero clicks is the whole default path.** There is nothing to select, so there is nothing to
  select correctly.
- **Nothing survives as an object** — no saved list, no unread state, no folder.
- **Nothing composes across searches.** A new search is a new corpus; sort, filter and stars all
  reset with it.

*The star is the one act that survives from the old pair, and its meaning is unchanged and now
unshared: **more like this one**, an anchor for the re-rank. It was always that; it merely stopped
sharing a row with a control that meant something else.*

***One thing this costs, recorded rather than smoothed.*** A founder who can see that twenty of the
returned patents are irrelevant can no longer take them out of the count. The answer is that they
were never able to do it well — judging relevance one row at a time over 124 patents is the
analyst's job the product exists to remove — and that the honest control for *too much came back*
is the fifth question, one surface earlier. **If that turns out to be wrong, the reopening is here
and §3's three requirements are the frame for it.**

### 6a.3 · A cell click filters the list

**Clicking a cell filters the left column to the patents in that intersection.** The clicked cell
stays lit, a removable chip appears above the list naming the intersection and the count, and
dismissing the chip restores the full list. **A rival row does the same thing** (§6.2), with the
holder's name in the chip.

***This is the interaction that makes §1a conflict 3 false in the good direction.*** The proposal's
map did **not** follow the selection, and a record arriving over it implied that it did — the
mitigation was a scope line saying so. **Now the relationship is real, and it runs the other way:**
the map does not follow the list, the **list follows the map.** The scope line stays and says
exactly that, because the founder still needs to know that filtering the list does not redraw the
map.

**Why a filter and not a drawer.** The drawer existed because the list was somewhere else — on a
separate surface, or not on screen at all. It is on screen permanently now, and **opening a second
list beside a list is two answers to one question.** The filter also keeps the left column whole:
the record (§6a.4) covers the right pane, so the list is never displaced by anything.

**What a filter must not do**, and each of these is a rule rather than a preference:

- **It does not change the corpus.** The ticks are untouched, the views do not redraw, and the
  standing note does not move. A filter is a way of looking at the corpus, not a way of cutting it.
  *That distinction is the same one §2.2 draws between scoping a search and filtering its results,
  and the interface has to make it visible — the chip is above the list, not in the views.*
- **It does not survive a scope change.** A new corpus clears the filter rather than reapplying an
  intersection that may no longer exist.
- **The empty state says *"No patents from your set fall here."*** §6.1 carries the wording and
  what it may never say instead. **It is reachable now in a way it was not**, because the filter is
  one click from any of sixty-four cells and most of them on this axis are empty.

### 6a.4 · The record over the right pane

**Clicking a patent brings its record over the right pane, leaving a ~200px peek of what is
underneath.** §7a.3's rule is unchanged and this section changes only the host: eleven identifiers,
the abstract and the claim set as published, unhighlighted and unparaphrased.

**Adopted from §1a, conflict 3, with the mitigation the proposal itself specced.** The peek is the
mitigation: the map stays visibly present and visibly unchanged, so a record arriving over it cannot
be read as the map having responded to the click. **The left list stays whole** — the record never
covers the thing the founder clicked, which is what makes the peek legible as *this came from
there* rather than as *this replaced that*.

***It floats over the pane rather than owning its trailing edge.*** *Changed 2026-09-11.* The record
was flush to the pane's top, trailing and bottom edges; it is **inset by one grid gap on those
three** and rendered as a card at the radius step above the widgets. **The ~200px peek is unchanged
and so is every sentence above it** — the leading edge is the peek, and the other three sides are
alignment with the widget grid the record covers. *This strengthens the mitigation rather than
qualifying it: the pane is now visible on four sides instead of one, so "visibly present" is more
true than it was.* `design-language.md` §7 carries the geometry, the reason the inset is the grid's
own step rather than a chosen margin, and the measured reason the card keeps a hairline. **Below the
container breakpoint nothing changes** — no peek, so no float, so flush as before.

**One record renderer, two hosts.** The record that opens from the ranked list and the record that
opens from a filtered list are the same component in the same place. That is not an implementation
note: §7's cap on the row exists because *the map is the product and the patents are evidence*, and
two record renderers is how one of them quietly grows a fifth field.

**The score is on the record and on the row.** [brief.md](brief.md) §4 removed the prohibition
outright on 2026-09-10. What is still forbidden is language that reads as a verdict — *strong
match*, *best fit*, *most relevant*. A number is an ordering the engine returned; those are
readings Terrain would be authoring.

### 6a.5 · The build, inline

**The staged build screen is gone. The narration is not.** Moment 4 was a surface of its own: a
stage list, a progress readout, and a founder watching it. The stages now resolve **in place, in
the right pane** — each of the six views is a skeleton at the moment the gate is approved and
becomes itself as its data arrives.

**Three things this keeps from the screen it replaces**, and they are the parts that carried the
decisions:

- **It fires on creation and after a confirmed scope change only.** Never on a return visit, or it
  becomes a loading screen the founder watches daily.
- **A rebuild is visibly shorter than the first build**, and it says so. Only what changed is
  re-run.
- **A progress indication claims only completed work** — `design-language.md` §6. A skeleton that
  becomes a widget is a truer claim than a bar that fills, because each view resolves when *that
  view* is ready rather than when a percentage says so.

**What it costs, and why it was still right.** A stage list could name the stages — *searching ·
classifying · laying out the map* — and an inline resolve cannot without putting labels on
skeletons. **The narration moves to the composer**, which is where every other working state in this
product already lives (§5): the thread says what is happening while the pane fills. That keeps one
place for *what is the product doing right now* rather than two, and it is the same argument that
put chat's working states in the composer rather than in a loader.

*Points are charged when the gate is approved, not when the pane finishes* — §7a.9. The masthead
figure moves once, at the moment the founder commits, which is the moment they can still choose not
to.

## 7 · Drill-down — the list filtered, and the record over the pane

Clicking a cell or a company **filters the list that is already on screen** (§6a.3). Clicking a row
in it opens **the patent's record over the right pane** — §7a.3, §6a.4.

*Amended 2026-09-10. This read "returns **a list**" and "the pane beside it", and both described a
product where the list was somewhere you were sent. **The list is permanently the left column now**,
so a cell click narrows what is already in front of the founder instead of producing a second list
beside the first. Everything below about **what a row may carry** is untouched, and that is the part
this section was ever about.*

*Amended 2026-09-09.* This section read *"a list, not a page"* and *"there is no individual patent
page in v1"* from the day it was written, and that was §9's detail-page deferral stated one section
early. §9 entry 1 was un-deferred on 2026-09-09 and §7a.3 closed with it, so the sentence went with
them. **What the section is actually about survives intact and is restated below**: the cap on the
row is four fields, the map is the product, and the patents are evidence. A record you can open is
not a patent that has become explorable — §7a.3 draws that line, and it is a line about *opinion*
rather than about *amount*.

Each row carries four fields and nothing more:

1. **One line of plain English** describing the patent — AI速讀Pro.
2. **Holder**, deduplicated by 名稱統一.
3. **Year.**
4. **Live or expired** — 法律狀態. One field, not a view. It is the single most decision-relevant
   fact for a US founder — an expired patent is not a threat, it is free to use — and it costs one
   word per row.

**The map is the product; the patents are evidence.** Evidence has to be legible, not explorable —
**and the record is the evidence, not a reading of it.** Everything that would make a patent
explorable is still deferred (§9): full decode, drawings, match highlighting, per-patent IPC *with a
plain-English gloss*, unread state. Every one of those is an **opinion about** the record rather than
the record, which is the test §7a.3 now states. *The bare IPC identifier is not, and never was.*

*The list in this section **was** one of two, from 2026-09-07 to 2026-09-10. It is now one list.*
§4b's set and this drill-down were always the same row, the same four fields and the same record
pane; they are now literally the same list in the same column, filtered or not. *As of 2026-09-09
that is enforced rather than asked for: both lists render through one row function and one field
function, so §7's cap cannot be broken in one place and kept in the other.* **The cap is the same
in both places, and the two controls §4b adds — a star and a checkbox — are controls, not a fifth and
sixth field.** If they ever start carrying information about the patent rather than about what the
founder is doing, that is the cap being broken by another name.

*Dismissal left the list above on 2026-09-07 — see §9. It is not explorability; it turned out to be
§4b's star pointed the other way.*

*What a founder does once a row worries them is **built, and settled** at §7a.3: the row opens the
patent's record — eleven identifiers, the abstract and the claim set as published — carrying the
five-field counsel handoff as a subset of itself. It still reaches §9's attorney-handoff prize
without an export. **The decision this line called provisional from 2026-09-04 to 2026-09-09 is
made**, and it went to the pane.*

*Two things did not change with it, and they are the reason the change is small.* The row still
carries **four fields**, so the list is still a list. And Terrain still renders **no opinion** about
any patent — no decode, no highlighting, no score, no ranking language that reads as a verdict.*

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
> | ~~**§7a.2**~~ widget page | **Spent 2026-09-10.** Closed by build, then removed by §1a's adoption. There is no widget page. |
> | ~~**§7a.4** landscape summary~~ | **Struck 2026-09-10.** Was *closed by build*; deleted with the chat panel that was its only entrance (~~§5~~). |
> | **§7a.3** patent level | **Closed 2026-09-09, for the record pane.** It closed for the side the section's own counter-case argued, and §9 entry 1 was un-deferred with it. The rule it now carries is *Terrain renders the record, not an opinion about the record* — and the five-field handoff survives as a subset of the pane. |
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
| ~~The widget page~~ | — (not in §9; collided with §2 and §7 instead) | ~~§7a.2~~ — *the authorisation is spent with the surface, 2026-09-10* |
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

> **The surface decides. Nothing a founder has to go and get may be needed to read it.**

*Rewritten 2026-09-10. It read "**The dashboard decides. The widget page explains. Nothing on a
page may be needed to read the dashboard.**" There is no dashboard and no widget page, and the rule
had to be re-founded rather than re-pointed, because its second clause named a thing that gave the
first clause something to be measured against.*

This resolves a conflict §8 has been carrying. §8 cut the engine's charts outright — *"126 charts is
126 decisions a founder cannot make"* — and that reasoning is about **attention**, not value.
Attention is only scarce where things compete.

***The re-founding, and it is the part that took work.*** The old rule paid for the cut by naming a
place where nothing competes: a page the founder chose to open. **That place no longer exists, so
the reinterpretation loses its escape valve and the cut goes back to being a cut.** What survives
is the test, which never depended on the page:

> *If a founder never leaves the working surface, have they lost a finding?*
> If yes, that content belongs on the working surface or nowhere.

**And with one surface the honest reading is stricter than it was**: almost nothing is exempt,
because almost nowhere is left to put a thing. §6.1 still binds everything on it — **nothing may
state or imply *why* a cell is empty** — and §6's six views are the whole of what a founder is
given.

**Where a widget's full form now lives is genuinely open**, and it is carried at §11 rather than
answered here. Nine ledger rows in §8 routed a capability to *"the Rivals widget page"* and four
chart forms are specced in `design-language.md` for it. **They are not homeless by accident and
they are not to be re-homed by inventing an expand-in-place mechanism in the prototype** —
§6.5 already refused that move, on the grounds that it would make a preview the only record of
a surface, which is the one thing `CLAUDE.md` says a preview may never become.

*The 2026-09-10 amendment that extended this rule to a `Market` / `Technology` toggle is spent with
the toggle. Its observation was that a toggle is a second way to hide a finding; there is no toggle,
and the general form — anything the founder has to reach for can hide a finding — is in the rule
above.*

### ~~7a.2 · The widget page — a further surface~~ — spent 2026-09-10

***Struck. There is no widget page.*** This section specced four of them — the map, Rivals, Filings
and Lineage, each opening with its finding in words and then its evidence — and §1a's adoption
removed the surface they were.

**The number is retained and not reused.** §2, §2.1, §6.5, §7a.1 and nine rows of §8 cite it.

**What it argued, and which parts are now elsewhere:**

- *A destination, never a step.* The rule survives at §2 and applies to the one destination left,
  the points page (§7a.9).
- *One shell, four pages; each opens with its finding in words and then its evidence.* **The
  finding-leads rule generalises and is kept** — every widget in §6 states its finding in words on
  the card, which is where that rule was doing its real work anyway.
- *The map page's editable axes* (~~§6.1a~~) — gone with the axes.
- *The Filings page's one-point-per-year form, and its range control* — a **real difference in
  resolution** rather than a different chart, and it has nowhere to live. §11.
- *The Rivals page's seven per-holder capabilities* — 名稱統一 identity, family-merged counts, the
  live/expired split, filing recency, who-cites-whom, SEP flags, the listed-company link. **These
  are the nine ledger rows.** §11.

***And the amendment it made to §2 is reversed by removal rather than by argument.*** This section
took the surface count from two to three; §4b took it to four; §7a.9 took it to five. It is
**three** now — conversation, the working surface, points — and this section's own reasoning is
what makes that legible: a destination is not a step, so removing two destinations removes nothing
from the path.

**One observation in it was a bug report and is still true.** *"Two of these are not clickable
today at all"* — the map cell and a rival row opened the same generic list, and Filings and Lineage
had no click-through. §6a.3 fixes the first two by making both filter the same list. **Filings and
Lineage still have no click-through**, and that is now a plain gap rather than an asymmetry between
pages. §11.

### 7a.3 · The patent level — Terrain renders the record, not an opinion about it

**Decided 2026-09-09. This section was `Open` from 2026-09-04 and it is now closed.** It closed
**for** the record pane, which is the side this section's own counter-case argued, and §9 entry 1 was
un-deferred in the same pass. What follows is the rule that replaced the one this section used to
carry, then the history, because the history is the part that is easy to get wrong twice.

> **Terrain renders the record.**
> **Terrain does not render an opinion about the record.**

| The record — rendered | An opinion — not rendered |
| --- | --- |
| claim text, as published | match highlighting — *this part is about you* |
| the abstract, as published | a plain-English decode — a paraphrase **is** an interpretation |
| number, application, kind, IPC, holder, inventors, dates, jurisdiction, status | *strong match*, *best fit*, *most relevant* — a word about quality |
| **the relevance score the engine returned** — 2026-09-10 | unread state — a reading queue is an analyst's workflow |

**The right-hand column is not held out by this section any more, and that is the point of stating
the rule this way.** Ranking language that reads as a verdict is forbidden by §4b and §6.1. Unread
markers are §9 entry 1's fifth element and stay deferred as an analyst's workflow. **Neither
depended on the old rule**, so narrowing it costs nothing that was actually load-bearing.

***The score crossed the table on 2026-09-10 and this is the single most consequential edit in
that pass.*** It sat in the right-hand column as *"a relevance score, or strong match"* — one cell
holding two things — and the two came apart under the question the rule itself asks: **is this in
the record, or is it a reading of the record?** A number the engine computed and returns is neither
— it is a **third thing**, the engine's own ordering — and the rule had no cell for it, so it was
filed with the phrase it happened to share a sentence with.

**The rule is unamended and its test is unchanged. What changed is the answer for one element.**
*Strong match* is Terrain authoring a judgement and stays out. `0.8955` is Terrain not deleting
one. [brief.md](brief.md) §4 carries the decision, because the sentence it changes is positioning;
§4b carries why deleting it was the more active act; §1a records it as conflict 1.

**Three restatements of the old row travel with this and must move in the same pass:**
[case.md](case.md) §4.D and §6.4, `marketing.md` §5, and
[`design/components.md`](../design/components.md)'s record row, each of which repeats *no score* as
though it were settled. *A rule retired in one file and quoted as live in three is the failure
`CLAUDE.md` names about views.*

#### Why the old rule had to go

It read: *does this specific patent block me* is a freedom-to-operate question and a legal
judgement, **and a claim-reading interface implies Terrain can answer it.** The first clause is
correct and is kept. The second **conflates showing the evidence with delivering the verdict.**

A claim is the **public text of a granted patent.** Reproducing it verbatim, unhighlighted and
unparaphrased, is what every patent office, Espacenet and Google Patents do. The judgement is the
**inference**, and the inference is the thing Terrain declines — out loud, on the pane:
*"The record as it was published, and nothing read into it. Whether it affects you is their call,
not ours."*

**And the old rule was undefined, which is the practical objection.** It named no test for what
would constitute answering question 3, so it could be read to forbid anything patent-shaped, and
nothing could be checked against it. The replacement can be: for any element, ask whether it is in
the record or is a reading of the record. Highlighting fails. A claim does not.

#### The counter-case became the argument

Recorded here since 2026-09-04, unchanged, and now decisive:

> a widget page whose list dead-ends re-raises the same question one level down, and a founder who
> cannot see *anything* about a patent that worries them may go looking in Google Patents, which is
> a worse experience Terrain does not control.

**A founder who is sent elsewhere to read a claim reads it without the disclaimer.** The old rule
did not prevent the claim being read; it only prevented Terrain being the place it was read, and
that is worse on the rule's own terms.

#### What the founder's four questions look like now

1. *Who else is here?* — Rivals. No patent needed.
2. *Is this cell really crowded?* — the list, filtered to that cell (§6a.3). §7's four fields.
3. *Does this specific patent block me?* — **still a legal judgement, and Terrain still does not
   answer it.** It now shows the record the judgement would be made from, and says whose call it is.
4. *How do I take this to someone?* — the same five identifiers, now a subset of the pane.

#### The history, so it is not re-argued a third time

- **2026-08-31.** §9 defers the patent detail page: five elements, "a screen with its own gravity".
- **2026-09-04.** This section recommends the handoff over the page, records the counter-case
  fairly, and is left **`Open`**. The handoff is built anyway — *"built provisionally, decision
  pending"*.
- **2026-09-07.** One of the six elements is un-deferred: 進階分類 as §4b's star, inverted.
- **2026-09-09.** §9 entry 1 un-deferred on the session's explicit ask under `CLAUDE.md`'s deferral
  rule. This section closes for the pane, and the rule above replaces the old one.

**Screen `25` was cited as strengthening the old recommendation and it does not any more.** IPtech's
record view carries full decode, figures, IPC glosses **and a similarity score** — and three of
those four are in the right-hand column above. The screen is evidence for the *rule*, not against
the pane: it is what the pane would have been if the rule had not been written down.

### ~~7a.4 · Summarise the landscape~~ — struck 2026-09-10

***Deleted with the surface that reached it, not deferred.*** It was built, and it was reachable
from exactly one chip in the chat panel and nowhere else. ~~§5~~ deletes the panel, so the summary
had no entrance; rather than invent one for a capability nobody asked for, it goes.

**What survives is the two tests, and they are worth more than the feature was.** Any future
project-level summary — including §7a.8's deliverable, which inherits them — must pass both. They
are restated rather than struck below.

**And §6.4 keeps its candidate.** 技術脈絡分析's three-era narrative was recorded there as a better
answer to *how is this space moving* than a most-cited table, with the note that if it enters
Terrain it should enter *here*. **There is no here any more.** So the candidate is now homeless as
well as unadopted, and §11 is where that question lives.

*The original section follows, kept because the tests are in it.*

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
| Project-level summary | ~~§7a.4~~ → §7a.8 | Struck as a surface 2026-09-10; the two tests survive |
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

- **The idea** is the *input*. Read back and approved at §4, then decomposed into the map's
  **columns** by the search it authorises. *This said "captured at §4's confirm card, decomposed
  into the map's rows and columns", which put the decomposition at the gate; the decomposition
  moved after the search on 2026-09-09, and on 2026-09-10 the rows stopped being decomposed at all
  — they are read off the patents (§6.1). Nothing in the distinction below depends on either.*
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


### 7a.9 · The points page — the only destination

**Recorded 2026-09-08.** The standing points balance in the chrome (`design-language.md` §7) is
now a **link**, and what it opens is a page about spend.

**This amended §2 the way ~~§7a.2~~ did**, taking the surface list to five. *It is **three** since
2026-09-10 — conversation, the working surface, points — and this page is the only destination
left.* What survives is the rule ~~§7a.2~~ established, and it survives its author: a destination
is somewhere the founder goes and returns from **in place**, never a step on the path to a map. No
moment routes through this page and §2.1's one-tab rule is untouched.

*The way out is simpler than it was.* It used to be "whichever surface they came from", because
"back to the map" would have been false on three of four. **There is one working surface now**, so
the way out is that surface — and the balance that opens this page lives in the masthead (§6a.1)
rather than in a sidebar.

***And the label is `Back to your results`, not `Back to the map` — 2026-09-10.*** The collapse to
one surface made "the map" *nearly* true; §6.5's toggle made it false again, because the map is
one page of two and half the time the founder was on the other. **"Your results" is true whichever
page they left**, and it names the surface rather than one card on it. *The control itself had no
base CSS rule at all — only a `:hover` — so it inherited the bare button reset and painted its
hover state tight to the glyphs; it is shaped like the masthead's own buttons now.*

**Why the balance is the way in.** It is the only standing reference to spend anywhere in the
product, so a founder wondering where their points went looks at the number.
*And the number now moves in one place at one moment: it is charged when §4's gate is approved
(§6a.5), not when the views finish resolving. A balance that ticks while a pane fills would be
charging for work in progress, and the gate is the last point at which the founder could have
chosen not to spend it.* A `Plan & billing` row
exists in the profile menu and is still undesigned (§11 keeps pricing open); this page is **not**
that screen. It answers *what did I spend* and never *what do I pay*.

#### What it takes from IPtech, and what it refuses

Restyled from the account → point usage screen, captured as `32` and read in full at
`visual-reference/iptech-screenshots-identified/README.md` §2.20. Five of the seven elements on that
screen are kept; the eighth-column table is not.

| On `32` | In Terrain | Why |
| --- | --- | --- |
| `可用點數 / 總儲值點數` + a `已使用` ring | **Kept, restructured** — balance and allowance as a figure pair, the percentage inside an arc meter | The one place in the product where a percentage is permitted. See the note below. |
| Eight per-module cards with `預計可使用 N 次` | **Kept, remapped to five run types** | Their eight are products; ours are the things the founder did. The mapping is below. |
| `點數使用分佈` donut, five hues | **Kept as ranked bars** | `design-language.md` §3.7 caps encoded values at three and has no hue at all. Five slices cannot be drawn. Ranked bars carry five categories because rank rides on **length**, so no bar needs a mark of its own. |
| `點數使用趨勢`, five overlaid series | **Kept as one column series** | Same cap. One series, so `--chart-series` and no legend — `dataviz` is explicit that a single series needs none, because the title names it. |
| `每天 / 每週 / 每月` tabs | **Kept, and they are the page's only control** | Their granularity tabs, on the chart rather than on a table. See the note below on why this replaced a range control. |
| `點數使用紀錄`, a day × module table | **Cut, replaced by a list of the last runs** | Ninety mostly-zero cells answers a question no founder asks. §7's *a list, not a page* is the right grammar: one row per run, and every rebuild in it is also a version of the map (§5). The table's own sort becomes a **Newest · Costliest** control on the list. |
| `全部功能`, the module select | **Cut** | It was built as a cross-card *isolate* selection — press a run type, ink its bar, split the chart — and removed on 2026-09-09. See below. |

#### The run types, and the mapping is the substance of this section

Terrain's cards are **composites** of Innovue's modules, and that is the honest shape rather than a
translation: one map build is a taxonomy pass **plus** classification over every record in the
approved set.

| Terrain run | IPtech modules | Unit cost, derived from `32` | Where it happens |
| --- | --- | --- | --- |
| **Searches** | `檢索通` · AI檢索Pro | 2 | §4b — the search that produces the set |
| **Map builds** | `魚骨通` 10 **+** `分類通` 2 per record | ≈265 at a ~120-record set — *illustrative, and the assumption is the set size* | §4 approval → §6.1's matrix |
| **Rebuilds** | `分類通`, over what the change touched only | ≈51 | §2, §5 — a confirmed scope change |
| **Skims** | `速讀通` · AI速讀Pro | 1 per patent | §7 — the drill-down's first field |
| **Re-ranks** | `AI排序` · `關聯性排序` | **unmetered in the evidence** | §4b's star |

Three of their eight get no card, and each already had a reason on file:

- **`閱讀通` · AI閱讀Pro** — the patent detail page, §9, deferred. Nothing spends it.
- **`價值通`** — a verdict on what a patent is worth. §6.1 forbids the interface implying *why* a
  cell is empty; a valuation is a far stronger verdict than that, and §7a.3 already refused the
  legal question underneath it.
- **`洞察通`** — ~~§7a.4~~'s landscape summary, `Omit · later`. Unbuilt, so unspent — and the
  destination is struck as of 2026-09-10.

And one is a live question rather than a cut: **`快檢通`**, the semantic search surface at §8.7.
Whether Terrain sits on it or beside it is open at `brief.md` §4, so it has no card until that
closes. If it does, it is a **Searches** row at 10 rather than 2 — a fivefold change in the cost of
the front door, which is worth knowing before the question is answered.

#### The period is a quarter, and that is what makes their control real

**Recorded 2026-09-09.** The page carried a **range** control — *This period · 14 days* — invented
here rather than taken from `32`. It was replaced by IPtech's own `每天 / 每週 / 每月`, and the
substitution is not cosmetic:

- **A range changes the denominator; a grain does not.** Every grouping covers the whole period and
  sums to the same total, so the two faults below cannot occur at all rather than being mitigated by
  a reconciliation sentence. There is nothing left to reconcile, and the sentence is gone with it.
- **It needs a period longer than a month to be a control.** Over a one-month period `每月` renders a
  single column. So the illustrative period is **a quarter — 91 days, which is 13 whole weeks and
  three months**, and all three grains divide it exactly. *A quarterly allowance is an ordinary plan
  shape and it is still an assumption; it is recorded against §11 with the rest.*

**And the control that came out is worth recording, because it was the better-looking half.** Pressing
a run-type card inked its bar and split the daily columns into two marks — the selected type against
everything else. It was removed on request, and the page is better for it: five cards and five bars
stopped being controls that looked like data, the chart went from two marks to one, and the legend it
needed went with it. **What the removal costs** is the ability to ask *which days were the builds* —
and the caption answers that in words, which §7a.1 says a page should do anyway.

#### The percentage, and it is a real exception

`design-language.md` §7 makes the chrome's meter **a balance and deliberately not a percentage or a
bar**, because *60% of your plan* asserts a plan shape §11 has not chosen. This page asserts it: a
balance over an allowance, and a ring reading what share is spent.

**The exception is scoped to this page and the rail is unchanged.** A page whose entire subject is
the plan is the one place that claim is load-bearing rather than incidental, and the chrome still
says nothing about a plan on any of the four other surfaces. **If pricing resolves to something that
is not an allowance** — usage-billed, unmetered inside a tier, a free tier with a different shape —
the ring and the denominator are what has to change, and they are deliberately in one place.
Recorded against §11's pricing bullet.

#### Two faults on `32` that this page exists not to repeat

Both are failures of **denominator**, and they are why the range control is page-level.

1. **The donut is windowed and the balance is not.** The daily rows visible on `32` account for a
   small fraction of what the balance says has been spent, with nothing on screen saying so. *The
   arithmetic is in the local index — this repository is public and the figures behind it are the
   account's billing telemetry.*
2. **So the donut omits the great majority of the spend.** `分類通` — much the largest cost on that
   account — is not in its legend at all, because it was spent before the window opens. A reader who
   trusts a chart headed *point usage distribution* concludes that skimming is their largest cost
   when it is their smallest.

The fix is that **nothing on the page is windowed.** Every figure answers to the whole period, and
the only control changes the chart's resolution rather than its span. *An earlier build did this the
harder way — one range control governing every card with a sentence reconciling it to the balance —
and that version caught the same fault in a second form: the run-count line on each card read the
period while the figure above it read the window, so a card showed `1060` over `9 runs` while its own
caption said four. Nothing on `32` would have caught it either. The grain control removes the class
of bug rather than the instance.*

#### What this page may not do

- **No verdict on the spending.** No *you are using this efficiently*, no projection, no warning
  band. It reports; §6.1's prohibition on the interface implying *why* generalises here.
- **No colour.** Not for *running low*, which is the obvious temptation. `design-language.md` §2
  permits colour for a discrete state, and *running low* is a threshold somebody would have to
  choose — which is the plan-shape question again, one layer down.
- **Nothing that makes a founder ration.** The page explains what a build costs so that approving
  the set reads as worth doing (§4b), not so that searching feels expensive.
- **No card that is not a control looking like one, and none that is not looking like data.** Two
  explainer cards — *why a build costs what it does*, *what is not metered* — were cut on 2026-09-09
  as a footer of prose under five cards that already carry captions and info affordances. What they
  said that was load-bearing is in those: the balance card states the metering rule, and the
  run-type card's affordance states the build-versus-rebuild cost.

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
| [screenshot index](../visual-reference/iptech-screenshots-identified/README.md) §1 | 31 observed screens | the **evidence** column below |
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

**Amended again 2026-09-10, and this one reverses part of the amendment above.** The sheet was
rewritten to be organised on **Terrain's six surfaces** rather than on IPtech's top navigation — one
group per screen the founder sees, and under each group the IPtech capabilities that screen needs.
It went from 40 rows to 31, and `Fishbone`, `Hierarchy`, `View` and `Report` stopped being groups.

**Name what that costs, because the 2026-09-07 amendment named it first and it was right.** *A
capability left off the ask is one Innovue never tells us about.* Organising on our surfaces is a
filter shaped by our scope, which is exactly the coupling that amendment cut. The 2026-09-07 sheet
accounted for **68 of 68** destinations; this one does not, and does not try to.

**What was bought for it.** The old sheet described Innovue's product back to Innovue and said
nothing about where any of it lands in ours — so it could not be checked. Six groups, each one a
screen, can be: a reader who knows the product can tell us a row is wrong, which is the reply we
actually want and the sheet now asks for in as many words.

**The rule that keeps the cut from going further.** *Where a surface needs something the engine does
invisibly, the need is a row under that surface* — the patent list asks for 速讀通's plain-language
line, the technology page asks for 魚骨通's two axes, and neither module gets a group. Nothing
load-bearing left the sheet; four IPtech **screens** did. The two settings that apply to every number
on both pages — 同族合併 and 名稱統一 — are a closing note rather than a seventh group.

**This section is still the complete record**, and it is now the *only* complete one. §8.1 and §8.2
carry all 60 rows and every verdict. If the sheet and this ledger disagree, this ledger is right.

---

### 8.1 · Observed surfaces

Every one of the 31 identified screens has exactly one row here. `Screen` numbers are the stable IDs
in the [screenshot index](../visual-reference/iptech-screenshots-identified/README.md) §1.

| IPtech surface | ZH | Screen | The founder question it answers | Verdict | Where in Terrain | Why |
| --- | --- | --- | --- | --- | --- | --- |
| `Search › AI Search` | AI檢索Pro | `01` | How do I even start? | **Match** | The composer, §2 | One question, no filters. The only entry point a founder can use. |
| `Fishbone` — 3-step wizard | 技術魚骨 | `17` | What is my idea made of? | **Diverge** | The confirm gate, §4 | The mechanism is essential; the diagram never appears. To a founder a fishbone is an artifact from someone else's profession. Confirmed as a wizard whose branches render in Chinese — §0. |
| `Hierarchy` — classification workbench | 分類通 | `25` | *(none — this is analyst labour)* | **Omit · cut** | Nothing | **The most important row in this table.** It is where an analyst builds the taxonomy, assigns patents to it by hand, and bins what does not fit — the recycle bin held 41 of ~158. This is the work Terrain exists to remove, not a feature to match. |
| `View` — record list + AI Skim | AI速讀Pro | `18` | Should I care about this one? | **Diverge** | The drill-down row's first field, §7 | AI Skim is a real paragraph, better than the marketing audit assumed. Terrain takes one line of it per row, not the paragraph. |
| `T-Map › Tech-Effx › Matrix` | 技術功效矩陣 | `24` `15` `16` `22` `23` | Where is the ground already taken, and where is it open? | **Diverge** | **The hero**, §6.1 | IPtech draws sized bubbles with the count beneath; Terrain fills the cell. A bubble encodes magnitude by area — the least accurately-read channel there is — and leaves an empty cell looking like a low one. A filled cell reads as a region of a map. |
| Matrix cell → hover popover | — | `31` | What is actually in this cell? | **Diverge** | The drill-down list, §7 | **The sharpest divergence in the ledger.** IPtech's cell has no drill-down: the count is inert and all five links pivot to another chart of the same cell. *Should I care about this?* is a question a pivot menu structurally cannot answer. *And it stays true of the matrix: §8.7 records that Innovue's semantic surface does have a node-to-patents route, so what the engine lacks is the route from a **cell**, not the capability.* |
| The three zones | 地雷區 · 新興區 · 處女地帶 | blog — *and absent from* `24` | Is this crowded, emerging, or open? | **Omit · cut** · *was Match, held against its own evidence; cut 2026-09-10* | Nowhere — §6.1 dropped the named zones | **Cut for a product reason, not because the evidence finally resolved.** ~~§10.13~~ was never answered and is retired moot: Terrain no longer renders zones, so whether IPtech has them decides nothing. *§8.5 keeps this row as its worked example of holding a verdict against its own evidence — and it is a better example in the past tense than it was live, because it shows the discipline running to completion rather than merely being asserted.* |
| `M-Map › Company › Count` | 競合分析 | `03` `26` `27` | Who else is here? | **Diverge** | Rivals, §6.2 | Merged by default rather than behind a toggle; live-or-expired on the row; no categorical hues. `26` shows one large holder split across two rows, ranked against itself. |
| `Company › Trend` | 宏觀趨勢分析 | `05` | Is this space heating up or did it peak? | **Diverge** | Filings over time, §6.3 | Terrain shades the publication-lag window and excludes it from the trend. IPtech draws the raw tail, which reads as a collapse in filings that has not happened. |
| `Company › Share` | — | `07` `29` | How concentrated is this space? | **Omit · later** · *was Diverge; re-verdicted 2026-09-10* | Homeless — §11 | A five-slice pie in five arbitrary hues — and the same data as a ranked share bar printed directly beneath it. Terrain promotes the table IPtech already has. **And the pie's denominator is the selected five, not the corpus:** `29` reads ~26% for a holder with well under a tenth of the corpus. |
| `Company › Ranking` | — | `11` `11b` | Who is rising? | **Omit · later** · *was Diverge; re-verdicted 2026-09-10* | Homeless — §11 | A butterfly chart split on a base year becomes a ranked list with a delta pill. Note §2.11: ranking by count puts dead portfolios on top — a holder at 100% overdue ranked in the top five. |
| `Company › Activity` | — | `09` `09b` | Who is still active? | **Omit · later** · *was Diverge; re-verdicted 2026-09-10* | Homeless — §11 | An expandable folder tree becomes a span bar per holder on one shared year axis. |
| `Company › Cross Reference` | 公司相互引證分析 | `08` | Who builds on whom? | **Omit · later** · *was Diverge; re-verdicted 2026-09-10* | Homeless — §11 | A chord diagram plus an N×N citation matrix becomes a directed hairline table. Direction is the information; the ribbons are not. |
| `Company › Research Ability` | — | `04` | Who is investing hardest? | **Omit · later** · *was Diverge; re-verdicted 2026-09-10* | Homeless — §11 | A radar over four incommensurable axes becomes ranked bars, one metric per column. A radar's enclosed area has no meaning when the axes have different units. |
| `M-Map › Legal Status › Company-Legal Status` | 法律狀態 | `21` | How much of this is still live? | **Diverge** | **Live and expired, §6.7** · *promoted 2026-09-10, renamed the same day*; one word per drill-down row, §7 | The strongest single finding of the platform audit (§2.11). *Terrain spent one word per row on it and nothing else until 2026-09-10, when the `Market` page gave it somewhere to be — a founder in a crowded space needs to know how much of the crowd is still enforceable, and expired filings are prior art rather than obstacles.* Still blocked on §10.1. |
| `Patent Count › Patent Count - Life Cycle` | — | `20` | Is this space early or late? | **Diverge** | **The Filings caption, §6.3** — a sentence, not a chart | Close to a first-order founder question, and the marketing audit never surfaced it. **Decided 2026-09-04, and the divergence is the form:** IPtech renders a phase-space trajectory of ~50 labelled self-crossing points and its own index calls both charts near-unreadable. Terrain states the finding in words on a caption it already writes. A quadrant-read scatter is the most analyst-shaped form in the set, for a user who does not speak patent — and §6.4 reduced Lineage and Cross Reference on the same reasoning. *It still needs the same input, §10.22; a sentence just degrades more gracefully than a chart if the answer is no.* |
| `Project` | 專案 | `19` | Where did my last search go? | **Diverge** | The project rail, §3 | An IPtech project is an analyst-curated folder of thousands. A Terrain project is one idea's persisted result. *The difference is not how many patents it holds — it is who assembles the set.* |
| Toolbar → `Switch To Ai Insight` | 技術脈絡分析 | `28` | How is this space moving, and where is it heading? | **Diverge** | ~~§7a.4's landscape summary~~ — **struck 2026-09-10 with the chat panel**; homeless, §11 | **This is 技術脈絡分析** — it uses the term for its own output (§2.16). A three-era narrative plus five concepts with representative patents, bilingual headings, cached. §6.4 keeps the most-cited table for v1 and records this as the candidate. Identified by inference, not confirmed — §10.14. |
| `Company › Inventor Activity` | — | `10` | — | **Omit · cut** | Nothing | Inventor-level analysis is an analyst's frame. A founder competes with companies, not with named engineers. |
| `Company – Project (M)-IPC`, `Company – Company (M)-IPC` | IPC | `12` `13` | — | **Omit · cut** | Nothing *as a chart* | A radar cross-tab of company against classification to level 4. IPC survives in Terrain in one narrow role only — a confidence signal, §8.2. |
| `Company – Project (M)-UPC` | UPC | `14` | — | **Omit · cut** | Nothing | A second classification system we never catalogued. Same reasoning; more of it. |
| `M-Map` multi-chart overview | — | `02` | — | **Omit · cut** | Nothing | Four charts at once with a view-density toggle. Terrain's pane is fixed at six views chosen for the founder; a picker is 68 decisions they cannot make. *Read "the dashboard is fixed at four widgets" until 2026-09-10 — the count moved and the argument did not.* *Menu path unconfirmed — §3 of the index.* |
| `Report` | 專利報告 | `30` | — | **Omit · cut** | Nothing | **Confirms its own cut.** Not a document viewer — a configuration screen: twelve settings plus four entity pickers. Generating a report means making a dozen decisions first. Also [brief.md](brief.md) §1: software, not a report. |
| `Company › Citation` | 公司相互引證分析 | `06` | Is this holder self-referential or building on others? | **Omit · later** | Homeless — §11 | Tech independence and citing rate are real signals. Not v1. |
| `Patent Count › Trend` | — | m-map menu | Is this whole field growing? | **Diverge** · *+ 2026-09-07* | Filings over time, §6.3 | **A Tier-1 destination that had no row.** §6.3 specs the widget as *filings per year within scope, optionally split by top companies* — corpus-level. The ledger only ever carried `Company › Trend`, which is the per-company one, so the row backing §6.3's own spec was missing. |
| `Country › Distribution` | — | m-map menu | Where is this filed, and is the US contested? | **Diverge** · *+ 2026-09-07* | **Where it is filed, §6.6** · *designed 2026-09-10* | **The largest single omission found by the 2026-09-07 audit.** [case.md](case.md) §4.H tiers it founder-facing; it appeared nowhere in §8. For a US founder deciding whether a space is crowded *in their market*, this is closer to a first question than most of §6. Distinct from the database-scale row, which is total reach rather than distribution within a result set. §10.5 now has a destination attached, not only a number. |
| `Tech-Effx › Country`, `Tech-Effx › Country Trend` | — | t-map menu | Which countries hold which parts of the space? | **Omit · later** · *+ 2026-09-07* | — | The matrix with country on an axis. Tiered 3 in [case.md](case.md) §4.H as "wrong axis", and that holds for the *hero*; recorded because the audit's inclusive pass surfaced them and a country cut of the map is not obviously analyst-only for a US buyer. |

---

### 8.2 · Capabilities with no screen of their own

Real, but they are properties of the pipeline rather than destinations — so there is nothing to
photograph. Evidence is the source that established them.

| Capability | ZH | Evidence | The founder question | Verdict | Where in Terrain | Why |
| --- | --- | --- | --- | --- | --- | --- |
| Auto-generated technology structure | AI魚骨 | blog, `17` | What is my idea made of? | **Match, hidden** | Generates the matrix's **columns** — one axis, since 2026-09-10 | The mechanism carries the product. The artifact never appears. `24` shows the structures it produces are compound and specific — `自主導航 / 操控 / 通訊（含 GPS-denied）` — which is the bar **§10.43 and §10.44** have to clear. *This row said "the confirm card's rows **and** the matrix's axes" until 2026-09-09, which counted one output twice because it appeared on two surfaces; "the matrix's axes" until 2026-09-10, when the second axis stopped being generated. The bar was ~~§10.2~~'s until it was retired moot.* |
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
| Standard-essential patent marking | SEPs 標準必要專利 | update log, `01` | Who holds leverage here? | **Omit · later** | Homeless — §11 | A real signal of leverage. Filterable at search on `01`. |
| Company cross-citation analysis | 公司相互引證分析 | update log | — | **Omit · later** | Homeless — §11 | See `06` and `08` above. |
| Listed-company stock links | — | update log | Is this rival public? | **Omit · later** | Rivals | Bears on §11's open incumbent-vs-startup question. |
| CPC classification search | CPC | update log, `24` | — | **Omit · later** | — | A third classification system, in the T-Map sidebar. Adjacent to §10.6. |
| Project update notifications | 專案更新通知 | update log | What changed since last time? | **Omit · later** | §7a.6 | **Already built**, which makes filing alerts materially cheaper than assumed. §7a.6 is blocked on §10.9. |
| One-click project update | 一鍵搞定專案更新 | update log | — | **Omit · later** | §7a.6 | The apply half of the same mechanism. |
| Project archival after 6 months | 專案封存機制 | update log | — | **Omit · later** | — | Lifecycle, undesigned. |
| Cluster / positioning / honeycomb charts | 專利集群分析圖表 · 市場布局拼圖 · 蜂窩圖 | update log | — | **Omit · later** | Homeless — §11. *Read "a widget page only, never the dashboard" until 2026-09-10; there is neither* | §7a.1 governs. [case.md](case.md) §6.4 records that this distinction is still open scope. |
| Filing alerts | 專利預警 | blog / testimonial | Tell me when someone files near me | **Omit · deferred** | §9 | The strongest recurring-value feature in the engine. Without it v1 has no subscription rationale beyond re-running searches. §9 carries the consequence; §11 carries the chain. |
| Legal status by jurisdiction | 法律狀態分析圖 | changelog, `21` | — | **Omit · deferred** | §9 | The map caption states the same fact for a fraction of the cost. |
| Tech × application matrix | 技術應用矩陣 | product page | What is adjacent to me? | **Omit · deferred** | §9 | Answers adjacency more directly than the function matrix, but generating good industry columns from one sentence is the highest-risk part of the build. |
| Patent detail page — full decode, all figures, match highlighting, unread state | AI閱讀Pro · 多圖顯示模式 · 記號關鍵字 · 專利未讀標記 | product page / changelog, `18` `25` | Does this patent block me? | **Omit · cut** — *was `Omit · deferred`, 2026-09-09* | §7a.3's record pane carries the record; these four stay out | **The verdict moved without the deferral moving it.** §9 entry 1 was un-deferred and the pane was built, so *deferred* stopped being true — but not one of these four went into it. A decode is a paraphrase, highlighting says *this part is about you*, and unread state is a reading queue: all three are opinions about the record rather than the record, which is the line §7a.3 now draws. **Drawings are the exception and they are simply not built** — a figure is the record, so nothing forbids them; they are out on cost, not on principle. |
| Project sharing | 專案共享 | update log, `19` | — | **Omit · cut** | Nothing | Read-only-versus-edit, seats and roles are enterprise shape. Founders share by link or not at all. *The sharing question itself is live at §7a.8 — this row cuts the permissions model, not the idea of an artifact.* |
| Patent search database (sibling product) | WEBPAT | product page | — | **Omit · cut** | Nothing | A list of results cannot tell a founder **where each holder sits** — that is a join, and §6.1 records it as the first of the three reasons the map is the hero. *This cell read "a list cannot show a gap, because a gap is an absence and absences cannot be enumerated" until 2026-09-10.* |
| **Patent type — invention, utility model, design** | — | `01`, `30` | Does a design patent block me? | **Omit · later** · *+ 2026-09-07* | — | **Uncatalogued until the 2026-09-07 audit.** `01` carries four filter groups above the search tabs — `Patent Type` (`Invention` / `Model` / `Design`), `Case Type` (`Issued` / `Published`), `Countries` (16 listed plus `more`) and `Legal Status` (`Valid` / `Overdue` / `Public`) — and every capture we hold is an invention-patent view. A founder shipping physical product can be blocked by a design patent exactly as hard, and we cannot currently say whether the corpus even carries them. Pairs with the LOC row below. |
| **LOC · Locarno design classification** | — | m-map menu, `30` | — | **Omit · later** · *+ 2026-09-07* | — | The fourth classification scheme, four menu entries, and a real configurable dimension — `30` shows `LOC Level 2`. The string `LOC` appeared **nowhere** in this document before today, though [case.md](case.md) §4.H has been counting its four entries toward the 68 all along. |
| **Family grouping has three modes, not one** | 同族合併 | `25` `30` toolbar | — | **Match, qualified** · *+ 2026-09-07* | Every count | `Application Merge`, `Simple Family` and `Extended Family` are **three separate toolbar toggles**. The 同族合併 row above treats family merge as one behaviour, which makes §10.15 ambiguous as asked: *which* mode is on by default, and does the answer change every count Terrain shows? [case.md](case.md) §9.15 already flags this as severe if the assumption is wrong. |
| **The six merge types, as a set** | — | `03` `30` | — | **Diverge** · *+ 2026-09-07* | Every count, as defaults | Applicant/assignee, inventor, country, patent country, examiner, application. §8.6 row 12 rates the set **High** and §10.33 asks whether it is a request parameter or a UI decision — but only the applicant one had a row here, so five of six were uncatalogued. |
| **Per-patent facts on `View` and `Hierarchy`** | — | `18` `25` | Should I care about this one? | **Omit · later** · *+ 2026-09-07* | Drill-down candidates | Five things the screen carries that no row named: the **family-spread badges `Country n \| Case n`**, a **per-patent `PDF`** of the original document, **IPC rendered as readable text chips** rather than codes, **Abstract / Technical Features / Claim 1** as separate fields, and **Excel export** from both toolbars. The IPC-as-text one matters most: §9 defers "per-patent IPC with a plain-English gloss" as though it were ours to build, and `25` shows the engine already produces it. |
| **Usage metering in points** | — | `25` `30` `32` | Where did my points go? | **Match** · *was Omit · later, reversed 2026-09-08; extended the same day* | The masthead's balance, and **§7a.9's points page** behind it | A standing balance that decrements when a run completes (index §2.4). `32` is the screen behind it, and it changes what this row is worth: its `預計可使用 N 次` figure is the balance divided by the unit price, so **the unit cost of eight modules is derivable** — index §2.20 has the arithmetic and the two independent reconciliations. Still the shape of the commercial answer to §10.1, and now with numbers in it. |
| **The unit price list, derived** | — | `32` | — | **Match, inferred** · *+ 2026-09-08* | §7a.9's five run types | `檢索通` 2 · `分類通` 2 · `速讀通` 1 · `閱讀通` 4 · `價值通` 4 · `魚骨通` 10 · `洞察通` 5 · `快檢通` 10. Innovue's own commercial terms, so the list stays; **the balances it was read off do not** — those are the account's billing telemetry and live only in the local index. **The consequence that matters is which of these is expensive:** dividing `分類通`'s spend by its 2-point unit gives a unit count no plausible number of *projects* reaches, so the unit is almost certainly **per record classified rather than per run**. If that holds, the cost of a map scales with the size of the set the founder approves, and §4b's gate is a **cost** control as well as an accuracy one. Sharpens §10.8 into a yes/no question. |

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

**Read this before calling the two maps a market/technology split, 2026-09-10.** They are not one,
and the finding above is why: the 60 shared entries — `Company`, `Patent Count`, `Country`,
`Legal Status`, `Patent Country`, `Inventor`, `Examiner`, and four classification groups — sit under
**both**. `T-Map` adds a filter and eight `Tech-Effx` entries; it subtracts nothing. Whatever `M` and
`T` stand for, no evidence we hold says market and technology, and **a document sent to Innovue must
not tell them what their own menu means.** The feature-request sheet uses their labels and makes no
claim.

**Terrain's `Market` / `Technology` split is ours, drawn along a different line, and it is clean.**
The line is *what the data is about*, not which menu reaches it:

| Terrain page | IPtech groups | Reachable under |
| --- | --- | --- |
| `Market` | `Company` · `Country` · `Patent Country` · `Legal Status` · `Patent Count` | both maps |
| `Technology` | `Tech-Effx` | `T-Map` only |

**Two facts make the split worth having rather than cosmetic.** The buckets have **almost disjoint
API surfaces** — nothing on `Market` needs the classification the whole `Tech-Effx` family is built
on — so they can be built, blocked and shipped independently. And the `Market` bucket answers
*who, where, when, still live*, all of which are computable from bibliographic fields, while
`Technology` needs a taxonomy generated from the founder's sentence. **That is the real seam in the
engine**, and it survived ~~§6.5~~'s one-day retirement and is now the reason the restored split is
worth having: it is a fact about what we would be asking Innovue
for, and it bears on cost and on §10 rather than on layout. [brief.md](brief.md) §4 keeps it.

***The consequence this section told the next pass to watch for has occurred, and this is the
amendment it asked for.*** The paragraph read:

> *One consequence to watch.* If the `Market` hero is ever moved to a holders-on-an-axis grid, its
> source is `Tech-Effx › Company` — a **T-Map-only** destination on a page otherwise sourced from
> groups reachable under both. That would not break the split, which is about data and not menus,
> but it would make the sheet's *"from your `M-Map` groups"* line wrong and it must be amended in
> the same pass. The hero is §6.3 as of 2026-09-10 and the question does not arise.

**It arose the same day.** §6.1's map is `T-Map › Tech-Effx › Company` — holders on an axis — and
it is the hero of everything, there being one pane. Three things follow:

- **The split itself is untouched**, exactly as predicted: it is drawn on what the data is about,
  and *who holds what* is still holder data laid out against a generated taxonomy. **The map is
  the one view that needs both buckets**, which is a sharper statement of the seam than the toggle
  ever made — it is the widget where the two halves of the engine meet.
- **Any outbound sheet saying the market views come *"from your `M-Map` groups"* is now wrong**,
  because the hero of the product draws from a `T-Map`-only destination. `design/previews/iptech-feature-request.html`
  is that sheet and it is stale for several larger reasons — §11.
- **The dependency this creates is worth stating plainly.** `Tech-Effx › Company` is one entry of
  eight under one group of one map. If it turns out not to be callable over a supplied result set
  (§10.52), the hero has no source, and the fallback is not another entry in the same family — it
  is §6.2's Rivals table, which is a list. *That is the concentration risk the toggle used to
  spread across two heroes.*

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

**One row reversed 2026-09-08: usage metering.** It read `Omit · later` and *"not a founder-facing
feature"*, and it is now built and founder-facing. The reversal is recorded rather than quietly
overwritten, because the original judgement was reasonable and it is worth being clear about what
changed.

*What the row got right.* A points balance IS the shape of a commercial answer, and §10.34 still asks
whether the meter is per API call or per UI action. None of that moved.

*What it got wrong.* It reasoned from IPtech's buyer to Terrain's. In IPtech the meter is
back-office: a number in the corner of a tool bought by a company on a seat licence, read by whoever
does procurement rather than by the analyst. Terrain is **self-serve** (`brief.md` §1) — the founder
using it is the person paying for it, and there is no procurement department between them and the
bill. A consumption figure a self-serve user cannot see is not a simplification, it is a surprise
they get later.

**It does not settle pricing, and §11's blocker is untouched.** A balance says what has been spent.
It is deliberately not a percentage, not a plan bar and not a price: those would each assert a plan
shape, and §11 still lists pricing as open and blocked on the subscription-rationale gap in §9. The
one commitment the meter does make is that consumption is *countable and worth showing*, which is
true of every candidate model on the table.

*Every figure in it is illustrative, per the repo rule, and the two that exist are consistent with
each other — the balance only ever moves by the per-run cost.*

### 8.5 · The count

**60 rows across §8.1 and §8.2**, and all 31 identified screens are accounted for. *Was 50 until
the 2026-09-07 audit added nine, and this line read **59** from then until 2026-09-10 — one row was
added in the same pass and never counted. The tables always said 60; the headline did not, and so
did `case.md` §4, `design/components.md` and §8.7 below. **Recounted from the columns**, which
§8.5's own note says is the only way this kind of error surfaces.*

**This count covers §8.1 and §8.2 and nothing else.** §8.7 — Innovue's semantic search surface — is a
**separate ledger of fourteen rows and is uncounted here on purpose.** It is a different product, we
have seen nine screens of it, and it is still being built; rolling it into this number would turn a
completeness claim about the platform into a vaguer claim about two products at once. **Adding a
product means adding a sibling section and a line here**, deliberately, rather than growing this
figure.

| Verdict | Rows | Note |
| --- | --- | --- |
| **Match** | 11 | One hidden, one as a single field, one unverified for our market. *Was 8; AI relevance ranking joined 2026-09-07, family-grouping-has-three-modes joined the same day as a qualified Match; points metering joined 2026-09-08 from `Omit · later`* — **and the derived unit price list joined in the same pass and was never counted, which is why this read 11 until 2026-09-09 and 12 after it.** *Back to 11 on 2026-09-10, by a different route: the three-zones row was cut.* Found by recounting the column rather than by reading the note, which is the only way this kind of error surfaces. |
| **Diverge** | 15 | ***Was 20 until 2026-09-10.*** Five left in one pass — Share, Ranking, Activity, Cross Reference, Research Ability — when ~~§7a.2~~ abolished the surface every one of them routed to. **They are not cut and they are not built; they are homeless**, and §11 carries the question of where a widget's full form lives. *The seven that "needed a chart form Terrain had never specified" are now two: Legal Status, built as §6.7 on 2026-09-10, and Life Cycle, answered without a chart in §6.3's caption. The other five are the five that left.* |
| **Omit · later** | 21 | Real, wanted, not v1, not deferred. *Was 13, then 12 when AI relevance ranking left on 2026-09-07; five joined the same day from the audit — Tech-Effx by country, patent type, LOC, the per-patent facts, points metering. **Points metering left again on 2026-09-08**, the only row to enter and leave this verdict, and the reversal is argued under §8.2's table.* **Five more joined 2026-09-10 from `Diverge`** — the homeless Rivals-page rows above. |
| **Omit · deferred** | 3 | §9 — the fifth §9 entry, IPC drift, is a proposal of ours rather than an IPtech surface, so it has no row. *Was 4; the patent detail page left on 2026-09-09 when §9 entry 1 was un-deferred, and went to `Omit · cut` rather than to `Match` — the pane was built, none of that row's four elements went into it* |
| **Omit · cut** | 10 | Plus the six items in §8.4 that were never destinations: 技術魚骨-as-diagram, 泡泡圖, figure rotate/mirror, EN→ZH translation, 匯出紀錄, full boolean search. *Was 8; the patent detail page's four elements arrived 2026-09-09 from `Omit · deferred`, and the three zones arrived 2026-09-10 from `Match`* |

**11 + 15 + 21 + 3 + 10 = 60.**

***Five rows changed verdict in one pass and none of them changed because we learned anything about
IPtech.*** They changed because a surface of ours was removed. That is worth naming as a category:
a ledger row records *what Terrain takes from IPtech*, and until 2026-09-10 every re-verdict in
this file came from looking harder at their product. **These came from looking at ours.** A row
that moves for that reason is a row to re-examine when the destination question closes, not a row
that has been settled.

**One correction the audit forced, and it is worth naming rather than burying in a row.** §6.3 has
always specced the filings widget as *corpus-level, optionally split by top companies* — but the only
trend row this ledger carried was `Company › Trend`, the per-company one. **The section describing
what we build and the section recording what we take had disagreed since 2026-09-04**, and neither
noticed, because no row existed for the destination §6.3 actually needs. That is the failure mode
§8.5 exists to catch, and it did not.

**Twelve of the fifteen `Diverge` rows are designed and built** in
`design/previews/terrain-prototype.html`. *This read "twelve of the twenty" until 2026-09-10 — the
numerator did not move, because none of the five rows that left was one of the twelve.* Ten came
from the first pass; `Country › Distribution` was designed 2026-09-10 as §6.6 and Legal Status the
same day as §6.7. *Share and Ranking were built in the 2026-09-04 visual-language pass and are no
longer `Diverge` rows — their forms exist in the prototype with nowhere to render, which is the
plainest statement of what "homeless" means.*

**The three that remain are blocked by data, not by design.** `design-language.md` §7 specs each
and names what it lacks; `design/components.md` §2 names the shape each would need from the
engine. Every one of them unblocks on §10.1.

*The fifth, Life Cycle, was closed 2026-09-04 by deciding it needs no chart* — the finding goes in
words on §6.3's caption. **That is a `Diverge` row resolved by removing a form rather than by
specifying one**, which is the same move §6.4 made on Lineage and Cross Reference, and it is worth
naming as a pattern rather than treating as three coincidences.

**Read the `Diverge` rows first.** They are where the product actually is. A `Match` row says we
kept something; a `Diverge` row says we understood what it was for and disagreed about the form. The
argument to Innovue lives in fifteen of these **sixty** rows, and in five more that were `Diverge`
last week. *The headline read "fifty-nine" until 2026-09-10 — the tables never did.*

**One discipline this ledger holds to.** A verdict records a decision, not an impression. Where the
evidence points one way and we have not confirmed it, the row keeps its old value and the question
goes to §10. Concluding from an absence is how a ledger stops being trustworthy.

***The three-zones row is the worked example, and it is a better one now that it has finished.***
For six days it sat at `Match` on a blog post's authority while the only populated capture of the
matrix showed no zones at all and a red/amber/green paint tool in the control bar — strong evidence
that an analyst applies them by hand, and **not** evidence we were willing to conclude from. On
2026-09-10 it went to `Omit · cut`, and the reason is the point: **it was cut because Terrain
stopped rendering zones, not because ~~§10.13~~ came back.** The question is retired moot and was
never answered.

**So the discipline held to the end, and what it bought is visible in the counterfactual.** Had the
row been re-verdicted to `Diverge` on the strength of the absence, this ledger would now record a
disagreement with Innovue over a feature **neither of us renders**, and it would have been in the
document sent to them. *A verdict you decline to change on thin evidence sometimes never needs
changing at all.*

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
| 2 | Plain-language one-line summary | AI速讀Pro | The row's first field, §7 | **On screen** — bulk availability is §10.11 |
| 3 | Applicant name unification | 名稱統一 | Rivals, on by default, §6.2 | **On screen** — the counts are shown; holder *names* are bars, [case.md](case.md) §6.5 |
| 4 | Tech × function matrix | 技術功效矩陣 | **The hero**, §6.1 | **On screen** — on a full 8×8 grid |
| 5 | The three zones | 地雷區 · 新興區 · 處女地帶 | Nowhere | **Cut 2026-09-10** — §6.1's legend is a density scale and a hatch, with no state names. *This was the one High-rated row that was ours rather than theirs: the zones were Terrain's arithmetic over Terrain's result set and §8.1 records that they were probably never an IPtech output at all. Cutting it removes a **claim**, not a capability.* |
| 6 | Cell drill-down | — | The list, filtered — §6a.3, §7 | **On screen** — *and this one Terrain **adds**. See the note below* |
| 7 | Competitive analysis | 競合分析 | Rivals, §6.2 | **On screen** |
| 8 | Macro trend analysis | 宏觀趨勢分析 | Filings over time, §6.3 | **On screen** — with the publication-lag window shaded and excluded |
| 9 | Auto-generated technology structure | AI魚骨 | The matrix columns, §6.1 | **Hidden by design** — the mechanism carries the product; the diagram never appears. *This read "the confirm card's rows, and the matrix axes" until 2026-09-10; the card has no rows and the map has one generated axis* |
| 10 | Auto-clustering + relevance ranking | AI分類Pro | The map's columns, and the list's order | **Hidden by design** — *the rows are read off the patents, not clustered* |
| 11 | Patent family merge | 同族合併 | Every count | **Hidden by design** — visible only as counts that are right. §10.15 |
| 12 | The six merge toggles | — | Every count, as **defaults** rather than controls | **Hidden by design** — §10.33 asks whether that is a request parameter or a UI decision |
| 13 | IPC classification | — | A confidence signal we read, §6.1 | **Hidden by design** — deliberately never a label. *How* it is surfaced at all is open, §11 |
| 14 | Legal status | 法律狀態 | The row's fourth field, §7; §6.7 | **Blocked on §10.1** — the column exists and is a skeleton bar. We hold no legal status for this project, and inventing one is the act §8's contract forbids |
| 15 | Filing alerts | 專利預警 | §9 | **Not in v1** — deferred, and it carries the subscription-rationale gap |
| 16 | Project update notifications | 專案更新通知 | §7a.6 | **Not in v1** — `Omit · later`, blocked on §10.9 |
| 17 | One-click project update | 一鍵搞定專案更新 | §7a.6 | **Not in v1** — the apply half of the same mechanism |
| 18 | Database scale | 100+ countries · 180M records | Everything | **Not a surface** — it is the ground the product stands on. US depth is §10.5 |

**Seven on screen · five hidden by design · one cut · one blocked · three not in v1 · one not a
surface.**

**Twelve of the eighteen are working in the product today, and five of those twelve cannot be
seen** — which is not a shortfall but the thing [case.md](case.md) §4 already says in words:
*the product is as much what is hidden as what is shown.* This table is that sentence as arithmetic.

*It read "eight on screen" and "thirteen of the eighteen" until 2026-09-10, when row 5 was cut.
**The cut row is the only one of the eighteen that was ever ours**, which is why the arithmetic
moves without anything about IPtech changing.*

**One row is not what it appears, and it is row 6.** *Cell drill-down* was rated High from the blog
and carried into §6.2 as though Terrain inherits it. Screen `31` shows IPtech's matrix cell has **no
drill-down**: `Patents : 15` is printed text, and all five items beneath it are pivot links that
re-run the cell as another chart, broken down by holder, country, filing year, publication year or
inventor. There is no route from a cell to the patents inside it. So the cell answers *show me
another chart of this* and never *what is in here* — and Terrain's drill-down is an **addition**, not
an adoption. It is the clearest `Diverge` row in §8.1 for exactly that reason.

**And the invisible rows are invisible for three different kinds of reason.** Rows 9–13 are hidden
because showing them would make the product worse — a fishbone diagram, a family-merge setting, an
IPC label. Row 14 is invisible because we do not hold the data, and rows 15–17 because we chose a
smaller v1. **Row 5 is invisible because we cut it**, which is a fourth thing again and the only one
on this table that is a retraction rather than a design. Only the data gap is a gap, and only
one kind is ours to close: **rows 15–17 are decisions, row 14 is §10.1, and row 5 is not coming
back.**

---

### 8.7 · The semantic search surface — observed 2026-09-08

**A sibling ledger, and deliberately not part of §8.1.** `快檢通 · AI 快速檢索` is **a new feature of
IPtech rather than a separate product** — TIS's own reading, recorded 2026-09-09, and §10.41 still
asks Innovue to confirm it rather than treating our reading as the answer.

*This corrects what this section said on 2026-09-08, which was that it is "a different product from
the IPtech platform".* The evidence for that was surface evidence — its own masthead, a single-purpose
flow, no top navigation — and surface evidence is exactly what a new feature with its own entry point
would also look like. **The correction matters because of what it unblocks:** if it is one product,
the semantic surface's generated structure and `T-Map`'s 技術功效矩陣 are two ends of one pipeline,
which is the assumption §4 and §6.1 now rest on. §10.44 asks whether that pipeline actually connects.

**The rows still live here rather than in §8.1**, and the reason is unchanged by the correction:
§8.1's `Screen` column is keyed to the 31 stable IDs of the platform's own navigation order, this
surface has no place in that order, and a feature with nine captures of its own is clearer as its own
table. Same seven columns, same five verdicts, and the `Capture` column points at flow numbers in
[`visual-reference/iptech-semantic-search/README.md`](../visual-reference/iptech-semantic-search/README.md).

**It is not counted in §8.5.** The 60 rows and 31 screens there cover §8.1 and §8.2 only, and §8.5
now says so. Rolling this in would make a completeness claim about a surface we have seen nine screens
of.

**And the verdicts here are provisional in a way §8.1's are not.** The platform is shipped; this is
under active development, and Innovue told us so rather than us finding it. A verdict below records
what Terrain would do *if the surface stays as captured* — which is a weaker claim than any row in
§8.1 makes, and it is why §10.51 asks about release status before anything is designed against this.

| Surface | ZH | Capture | The founder question it answers | Verdict | Where in Terrain | Why |
| --- | --- | --- | --- | --- | --- | --- |
| Semantic entry, one field, whole screen | AI 快速檢索 · 語意檢索 | `01` | How do I even start? | **Match** | The composer, §2.2 | The same decision as ours, reached independently by the people who own the engine. No tabs, no filter rail, one sentence. **Theirs takes a sentence only**; §2.2's four routes have no equivalent |
| Advanced settings — jurisdiction × status | 進階設定 › 資料來源 | `02` | Where does this need to hold? | **Diverge** | §4a question 5, asked once in plain English | Evidence the fact is a **query parameter**, which is what §2.2's amendment assumed. Theirs is a modal of controls; ours is one question in a sentence. §9's *persistent* rail stays deferred and nothing here moves it |
| Result-count selector, capped at 500 | 回傳筆數 | `02` | How many patents should I bring back? | **Match** — *was `Omit · cut`, then `Diverge`, both on 2026-09-09* | §4a beat two, third question | **The only verdict in this table to have moved twice, and it ended further from where it started than the first move suggested.** Cut on the grounds that a founder does not decide how many records their map is drawn over; then `Diverge`, asking for a posture rather than a number; now `Match`, asking for the control's own five values. The middle position lost because the engine takes a number either way, so a posture only hid which one we were sending. **What Terrain changes is the unit, not the control**: 筆 renders as *pens* on their surface and as *patents* on ours. The 500 is still a constraint on us rather than a feature — §10.47 |
| Type-time direction suggestions | 探索方向 — before the search | `03` | What could I mean? | **Match** — *was `Diverge`, reversed 2026-09-09* | **§4a beat one**, the whole of it | The second reversal in this table, and the larger one. On 2026-09-08 this read `Diverge` on the argument that they *offer generated directions to pick* while §4a *asks about the founder's own idea*. §4a now records why that did not survive: our own Q1 and Q2 rendered as bars because their options could only be generated too, so the objection preferred our guess to theirs. §10.43 asks whether the generator is callable on its own |
| The same chips kept as post-search pivots | 探索方向 — after the search | `04` | What else is near this? | **Omit · later** | Nothing in v1 | Real and wanted; not v1. A chip that silently re-runs the search is the standing-analyst behaviour §4b admitted the star *against*, and §5 routes scope changes through a gate. Recorded so it is not re-discovered |
| **Fishbone generated from the query**, per-node counts | — | `04` | What is my idea made of? | **Diverge** | The confirm gate §4, and §6.1's axes | **The most important row in this table.** It is §0's chain — sentence → structure → patents — run end to end, which is the claim §0 used to make about nobody. The mechanism is exactly what Terrain needs; the diagram still never appears, because to a founder a fishbone is an artifact from someone else's profession |
| Click a node, expand that semantic subgroup | — | `04` | What is actually in this branch? | **Diverge** | The drill-down list, §7 | Worth reading against §8.6's row 6, which says the cell drill-down is something Terrain **adds** because IPtech's matrix cell has none. That still holds of the matrix — but this surface has a route from a node to the patents inside it, so the addition is now ours only in the map, not in the engine |
| Similar patents from a selected patent | 相似專利 | `05` `06` | What else is like this one? | **Match** — *qualified, see Why* | The primitive under §4b's star | **Nearest neighbours to a supplied document exists**, which §10.38 said no screen showed. But `06` shows the mechanism is *sideways navigation with a back stack* — the chip row re-computes around the new patent and the ranked list underneath does not move. The star re-ranks **a set**; this drills from **one patent**. §10.45 |
| Relevance score printed on every row | 分數 | `04` `05` `06` | How close is this to what I described? | **Match** · *was Omit · cut; reversed 2026-09-10* | The list row and the record — §6a.2, §6a.4 | **The sharpest collision in this table, resolved in Innovue's favour.** It read: *a score set beside a patent reads as a verdict about the founder's chances.* What settled it is §4b's own note that honouring the rule had become **a deletion rather than an omission** — Terrain would have been stripping a number off every row of somebody else's shipped surface, forever. [brief.md](brief.md) §4 removed the prohibition outright, with no successor. §10.46 still asks what the score actually is, and it matters more now that we print it. ***And on 2026-09-10 it moved to where Innovue puts it — top right of the row, beside the title.*** It shipped last in the row and in `--text-3`, on the reasoning that an ordering the founder did not ask for should not outrank the four fields §7 caps the row at. That was a half-measure: once [brief.md](brief.md) §4 had removed the prohibition on printing it, burying the number reads as neither printing it nor omitting it. It is still `--text-3`, and it gained one word — **`Score`**, stacked above the figure, matching what Innovue's own row prints. That is not the word §7a.3 forbids: the rule bars a word about *quality*, and `Score` names what the number is rather than reading it. An adjective would still be ours (§7a.3) |
| Elapsed-time readout | 搜尋耗時 | `04` | Is this working? | **Diverge** | §2's build narration | A duration printed after the fact is not narration during it — it tells the founder how long they waited, which they know. §2 narrates the stages instead. The number itself is useful to *us*: §10.50 |
| Save the search | — | `04` `05` | Can I come back to this? | **Match** | §3's saved object | One control, no naming step visible. What it saves to is uncaptured, and §3's object is a good deal more than a saved query |
| Seven fields on a result row | — | `04` | — | **Diverge** | §4b's set and §7's drill-down, at **four** | Score, number, jurisdiction-status, title, abstract snippet, IPC, assignee, filing date. §7's cap is four and the reason is in §4b: the map is the product and the patents are evidence, so evidence has to be legible rather than explorable |
| Patent detail pane | 申請號 · 主 IPC · IPC · 申請人 · 發明人 | `05` `06` | Should I care about this one? | **Match** — *was `Omit · deferred`, 2026-09-09* | §7a.3's record pane, §4b's set and §7's drill-down | **The largest single verdict change in this table.** This row read *not specced, not wireframed, not designed against* until §9 entry 1 was un-deferred. Terrain renders all five of these fields and six more, and the field list is theirs: 申請號 becomes *Application*, 主 IPC *Main IPC*, 申請人 *Holder*, 發明人 *Inventors*. **Two of their fields become one of ours** — 文件種類 `U` and 申請類型 `model` say the same thing twice, so Terrain shows `Kind: Utility model`. Same call as 筆 → *patents*. |
| Back to the fishbone · back one page | 回魚骨圖 · 回上一頁 | `05` `06` | How do I get back? | **Diverge** | §7's two-pane — the list stays on screen | Two back controls are the cost of the navigation model in the row above. *Restated 2026-09-09: this said §7's drill-down expands in place so there is nothing to return from, and the row no longer expands. The reason survives the mechanism* — the record opens **beside** the list rather than instead of it, so there is still nothing to return from. Only below the two-pane breakpoint does one replace the other, and that is the one place a back control exists. |

**Fourteen rows: six Match, six Diverge, one Omit · cut, one Omit · later.** *Recounted 2026-09-09
— the patent detail pane moved from `Omit · deferred` to `Match` when §9 entry 1 was un-deferred, and
this table now carries no deferred row at all.* 6 + 6 + 1 + 1 = 14.
*Was three, seven, two, one, one on 2026-09-08, and four, seven, one, one, one earlier on 2026-09-09.
Three moves in two days, all in the same direction: the record-count selector twice — `cut` to
`Diverge` to `Match` — and the type-time direction chips once. **Every movement in this table so far
has been towards adoption**, which is itself a finding about how the first pass read the surface.*

**Read the three rows about founder-facing controls first** rather than the `Diverge` ones — the
reverse of §8.5's advice, and for a reason. On the platform, a `cut` row was almost always analyst
labour Terrain exists to remove. Here the equivalent rows are **choices aimed at roughly our person
that we have to take a position on**, and the three have landed in three different places:

- **The relevance score** was the only outright `cut` and is now a `Match` — **reversed
  2026-09-10.** It read *"there is no version of it we want"*, which turned out to be a claim about
  a rule rather than about the score. [brief.md](brief.md) §4 removed the rule.
- **The record count** became a question (§4a beat two), and then became **their control**. The
  objection was to the number, so the first fix asked for a posture instead — until it was obvious
  the engine takes a number either way and the posture was only hiding which one we were sending.
  What Terrain changes is the **unit**: 筆 is a counter for records and their surface renders it as
  *pens*.
- **The direction chips**, `Omit · later` as a post-search pivot, became the **whole of beat one** as
  a pre-search question. The same control, admissible before a map exists and not after, which is the
  distinction §4b used to admit the star.

***All three moved, and the third moved last.*** *This paragraph read "two of the three" until
2026-09-10.* A verdict here records what Terrain would do if the surface stays as captured, and
each changed as soon as we asked what the control was *for* rather than what it looked like — then
again when we asked what we would have to **build** to avoid it. Both questions are cheaper than the
first pass made them look. It is the strongest argument in this document for §10.51 — asking whether
the surface is still movable — being asked early.

**And the pattern is now complete enough to state as one.** This table began as a list of three
things Innovue had chosen that we would have to undo. **We undid none of them.** That is not a
capitulation and it is worth being precise about why: in each case the thing we were going to build
instead was *a synonym for their control* — a posture standing for a number, our own chips for
their directions, an absence standing for a score. **A synonym you maintain is worse than a control
you adopt**, and finding that out three times is what makes it a pattern rather than three
judgement calls.

**One thing this table cannot record, and it is the reason §8.7 is provisional.** Every verdict above
assumes Terrain sits *beside* this surface, taking the engine and rejecting the presentation. If the
working direction at `brief.md` §4 holds and Terrain becomes this surface's English front end, then
half these rows stop being verdicts about someone else's product and become **decisions about our
own** — and three of them are removals we would be asking Innovue to make. Nothing here is settled
until §10.41 and §10.42 answer.

## 9 · DEFERRED — NOT IN SCOPE

> **Nothing in this section is built, specced further, wireframed, or designed against.** It is
> recorded so the reasoning survives and the decisions are not re-argued. If a task appears to
> require an item here, stop and say so rather than building it. See the deferred-scope rule in
> `CLAUDE.md` — including the one route out, which is a session naming the item and asking for it.
> **That route has now been used once, on 2026-09-09.** Using it is not a licence to widen the item
> it was used on: the pane was asked for, so the pane was built, and the four elements nobody asked
> for stayed out.

> **Two reversals, and the second spent a whole entry.**
>
> 1. **§4b's star**, 2026-09-07 — taken out of the patent-detail-page entry and argued there.
> 2. **The patent detail page itself**, 2026-09-09 — un-deferred on a session's explicit ask, built
>    as §7a.3's record pane. **Entry 1 below is spent.** Four of its six elements are still out, but
>    they are out under §7a.3's rule rather than under this section, and the distinction is the
>    reason to read that entry rather than skip it.
>
> **Five entries remain live**, and the numbering below is unchanged so that nothing that cites an
> entry by number breaks.

> **Two entries were named by a session on 2026-08-31 and designed against under that rule** — the
> patent detail page and filing alerts. **Filing alerts is still deferred and still unbuilt**; §7a.6
> remains blocked on §10.9. **The detail page is not**, as of 2026-09-09 — §7a.3 had concluded it
> would answer a legal question Terrain must not answer and built a five-field **handoff row**
> instead, and that conclusion is the one this section carried for nine days on a rule that turned
> out to be uncheckable. *This paragraph read "Neither was built, and both deferrals stand" until
> 2026-09-09.* **The other four were never named and remain fully deferred** — the
> jurisdiction/status filter, the tech × application matrix, IPC drift as an adjacency detector, and
> IPC in export / attorney handoff. *This sentence named only the first two until 2026-09-04.*

~~**The patent detail page.**~~ — **UN-DEFERRED 2026-09-09. The entry is spent; four of its six
elements remain out, and they are out under §7a.3's rule rather than under this section.**
Full plain-English decode (AI閱讀Pro), all drawings at once (多圖顯示模式), match highlighting
(記號關鍵字), per-patent IPC with a plain-English gloss, and unread markers (專利未讀標記).
~~And a "not relevant to me" dismissal (進階分類)~~ — **un-deferred 2026-09-07, see below.**
*Why it was deferred:* five elements is a screen with its own gravity, and in the first pass it
competes with the map for attention and build time. The drill-down list (§7) answers the founder's
actual question — *should I care about this?* — at a fraction of the surface. Revisit once the map is
proven.

> **Un-deferred 2026-09-09 — the screen, on the session's explicit ask.** `CLAUDE.md`'s deferral rule
> admits exactly one route out of this section: *"unless the session explicitly names the item and
> asks for it."* A session named the pane, described the two-pane surface it wanted, and supplied a
> reference capture of the fields. That is the route, used as written.
>
> **It is a resolution rather than an override, and the difference matters.** §7a.3 was marked
> **`Open. Decide between the handoff row and the full detail page.`** — so the decision this entry
> was waiting on had never been made. §7a.3 also recorded the counter-case fairly: *a founder who
> cannot see anything about a patent that worries them may go looking in Google Patents, which is a
> worse experience Terrain does not control.* **The un-deferral closes §7a.3 on the side §7a.3 itself
> recorded.** Nothing was overruled.
>
> **What was built:** a record pane — eleven identifiers, the abstract, and the claim set as
> published — beside the list on §4b's set and inside §7's drill-down. One renderer, two hosts. The
> five-field counsel handoff is now a subset of it through the same field function, so it stopped
> being a separate row-level disclosure.
>
> **Four of the six elements are still out**, and this is the part not to lose. They are out because
> **each is an opinion about the record rather than the record** — a decode is a paraphrase,
> highlighting says *this part is about you*, an IPC gloss is a reading of a class, and unread state
> is an analyst's reading queue. §7a.3 carries that rule and §8.7 moved their row to `Omit · cut`.
> **Drawings are the odd one out: a figure *is* the record, so nothing forbids them and they are
> simply not built.** Out on cost, not on principle — which makes them the one element of the six a
> later pass may add without reopening anything.
>
> **The screen-with-its-own-gravity objection was real and is answered by the host, not dismissed.**
> The pane is the second half of a surface the founder is already on; it is not a destination, has no
> route of its own, and the list stays on screen beside it. That is why it does not compete with the
> map — it never replaces anything.
>
> ***The generalisable lesson, because this section will face the same question again:*** *the old
> rule was **undefined** — it named no test for what would count as answering the legal question — and
> an undefined rule cannot be applied, only deferred to. It survived three passes on authority rather
> than on argument. **A deferral resting on a rule nobody can check is a deferral that will be
> re-argued until someone happens to ask what the rule means.*** Prefer a rule with a test.
>

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
>
> *Superseded in part, 2026-09-09.* The screen was un-deferred and one of §7a.3's two arguments — the
> claim-reading one — was narrowed rather than kept. **This note's own test is untouched and still
> governs the four that remain**: an unread marker is still a reading aid, and it is still out.

**Authentication, and the session it implies.** Terrain is self-serve software on a subscription —
`brief.md` §1 — so there is a login, and nothing in this document specs one. *Recorded 2026-09-11,
and it was reached from an unexpected direction:* the masthead lockup became a way home, which
needed a test for *has the founder entered*, and the prototype answers it with a session flag
(`hasEntered`) because there is no account to ask. **That flag is the shape of the question, not an
answer to it.** With auth, *entered* is a property of the session and the surfaces the lockup may
route to follow from it rather than from what has been clicked since page load.
*Why deferred:* it is plumbing that decides nothing about the product, and specifying it now would
fix a session model before the surfaces it serves have settled. **The cost of leaving it is named:**
every "has the founder done X yet" test in the prototype is a page-lifetime flag, so a reload starts
the founder over, and the real product will not.

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
2. ~~**Can the function axis (功效) be generated automatically, and how good is it?**~~
   **Retired moot 2026-09-10 — nothing consumes a 功效 scheme any more.** §6.1's map is
   Technology × Assignee: the rows are read off the patents and there is no outcome axis to
   generate. This question was called *the highest product risk in the build* from the day it was
   written, and it is not answered — it stopped applying.

   **What now carries the risk, because a moot question with no successor reads as a risk we
   stopped tracking.** The **technology** axis is still engine-generated from one sentence, and
   every concern this question raised about generation quality transfers to it intact: **§10.43**
   asks what generates the `探索方向` candidates, **§10.44** asks whether the query-generated
   fishbone is the same structure the matrix uses, and **§10.52** asks whether either can be
   computed over a result set we supply. Those three are the successor, and §8.3 records that the
   map is now the one widget drawing on both halves of the engine at once.

   *What was learned before it was retired is kept, because it bears on the successor.* The premise
   this question opened with — *an analyst hand-writes both axes* — was already false of the
   technology axis by 2026-09-09: `快檢通` generates the structure from one sentence in about two
   seconds (§8.7). And 功效 was confirmed to **exist** as a real selectable scheme rather than
   something Terrain would have to invent — screen `24` carries `XClass` and `YClass` as separate
   dropdowns set to `技術` and `功效`. *So the scheme is there if a later pass ever wants the
   outcome axis back; what is gone is the requirement, not the capability.*

   *The number is retained rather than reused, because §10.n ≡ [case.md](case.md) §9.n and both
   lists are append-only.*
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

13. ~~**Do the three zones — 地雷區 · 新興區 · 處女地帶 — exist in the product, or does an analyst
    paint them?**~~ **Retired moot 2026-09-10 — Terrain does not render zones.** §6.1's legend is a
    density scale and a hatch, with no state names on it; [brief.md](brief.md) §1 dropped the
    question the zones answered. Whether IPtech has them decides nothing on either side any more.

    **Nothing carries the risk forward, and that is the honest answer rather than a gap.** This
    question only ever protected a ledger row from being concluded from an absence — §8.1's zones
    row, held at a blog-sourced `Match` for six days while the only populated capture showed none
    of them and a red/amber/green paint tool in the control bar. **The row went to `Omit · cut` on
    a product decision instead**, so the thing this question was protecting no longer exists.
    §8.5 keeps the whole episode as its worked example of the discipline, and it is a better
    example finished than it was live.

    *The number is retained rather than reused.*

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

20. **Does a programmatic result return what was excluded, or only what was kept?** An analyst
    working in `Hierarchy` assigns by hand and bins what does not fit — at the scale our
    illustrative set models, 41 of roughly 158, leaving 117 in scope. **Terrain has no analyst to do
    that discarding.** So: is the kept/discarded decision made by the engine or by the person, and
    can we see the discarded set? **This bears on whether our counts and yours are comparable at
    all**, and it is the question `Hierarchy` raises that we had not thought to ask.

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
    *Narrowed by implementation 2026-09-09, not answered.* The prototype's cut is a **share** of what
    came back — the third of the three candidates, and the one that needs only an order. A fixed
    count was tried and failed on its own terms: 124 against a 50-row list selects every row. **So
    the count is out on arithmetic, and the choice is now between the share and a threshold** — which
    is exactly what this question decides.
40. **Can the definitions table be written programmatically, and does it take narrowing terms per
    branch?** `Fishbone` step 2 — *Edit Search Query / Technical Description* — is the one screen in
    the product we have never captured, and it is the layer §4a's answers map onto: a founder saying
    *this is for urban delivery* and *not the whole aircraft* is authoring exactly what an analyst
    types there. So: is that table reachable through an API, does it accept terms per branch rather
    than one query for the whole tree, and can a branch carry an **exclusion** as well as an
    inclusion? The last one has no visible equivalent on any screen we hold.

**Raised by Innovue's own semantic search surface**, §8.7, and appended 2026-09-08. Eleven questions,
and they are a different kind again — the first forty ask what the platform can do and what a portal
could be built against. **These ask what the thing Innovue is already building actually is**, because
if `快檢通` is the front end Terrain was going to be, the answers reorganise this document rather than
unblocking it. The first two are blocking; the rest are only worth asking if §10.41 says the surfaces
share a backend.

41. **Is `快檢通` the same engine and the same database as IPtech, or a separate product?** **This is
    now the most blocking question on the list, ahead of §10.1.** Every row in §8, and every question
    from §10.1 to §10.25, is keyed to the platform. If the semantic surface runs on a different index,
    a different retrieval model or a different corpus, then what we have audited for five weeks is not
    what we would be building on — and §8's ledger describes the wrong product.
42. **Is it reachable programmatically, or is it browser-only?** §10.1 asked this of the platform.
    Asked here it is sharper, because this surface already does in one call what §10.1's answer would
    have had us assemble from several: sentence in, structure and ranked patents out. If **this** has
    an interface, most of §10.26–§10.35 stops mattering.
43. **What generates the `探索方向` candidates, and can they be requested without running a search?**
    Five directions appear off a partial string, one of them a field of use — which is §4a's question
    2. If that generator is callable on its own, §4a's Q1 and Q2 have a real option set instead of
    options of their own. Since 2026-09-09 the prototype renders the five we
    observed for `drone` as real words, so the question is no longer *what would
    fill the bars* but **whether that list can be requested for any sentence** —
    without it, the worked example is the only query Terrain can narrow well.
44. **Is the query-generated fishbone the same `技術魚骨` structure as `Fishbone`'s, does it come
    back as data or as a picture — and can it drive `T-Map`'s 技術功效矩陣?** *The third clause was
    added 2026-09-09 and it is now the most important of the three.* If `快檢通` is a feature of
    IPtech rather than a separate product, then its generated structure and `T-Map`'s matrix are two
    ends of one pipeline, and **§4, §6.1 and §10.2 all now rest on that pipeline connecting.** If it
    does not — if the semantic surface returns a structure that nothing downstream consumes — then
    Terrain inherits a search and builds the map itself. Two questions in one because the answers pair badly: if it is the
    same structure, §0's chain is confirmed end to end and §4's card has a source; if it arrives as a
    rendered image, we cannot use it at all. **§10.26's rule applies with the most force here** — you
    cannot re-token a PNG, and this is the one diagram whose *values* Terrain needs, because §6.1's
    matrix axes come from it.
45. **Can the `相似專利` primitive be pointed at a result set rather than at a single patent?** §4b's
    star re-ranks the set around a patent the founder points at. `05` and `06` show nearest-neighbour
    retrieval from one patent with a navigation stack, and the ranked list underneath does not move —
    so the primitive exists and the product form is different. This is the remaining half of §10.38.
    **If the answer is no, §4b loses the star and keeps everything else.**
46. **What is `分數` — a normalised similarity, and is it comparable across queries?** §10.39 asked
    whether ranking returns an order or a score; the answer is visibly a score, printed to four
    decimal places on every row. Two consequences. **A threshold becomes a possible recommended cut**
    (§4b's third open item) *if* the scale is stable across queries — a 0.89 that means one thing for
    one sentence and another for the next cannot carry a fixed cut. And §6.1 governs what may be
    shown: we intend to delete it, and we would rather delete a value we understand.
47. **Is the 500 in `回傳筆數` a UI cap or an engine cap?** If the engine will not return more than 500
    records for a sentence, then every count in §6 — the matrix, Rivals, the trend, Lineage — is drawn
    over at most 500 patents rather than over what the sentence matched. That is a different product
    from the one this document describes, and §10.20's question about comparability with your own
    counts becomes much more pointed.
48. **Is `資料來源`'s Taiwan and USA the full jurisdiction coverage of this surface?** The platform's
    claim is 100+ countries and 180M records. Two countries in the modal is either the surface's real
    scope or a subset shown for now. **Taiwan-only would be fatal to our ICP**, and US-only is
    survivable, so this decides whether the semantic layer is usable for us at all.
49. **Who wrote the English on this surface, and does it extend to the patent data?** *This one
    changed shape on the evidence and is more useful for it.* The chrome is translated, and so is
    generated output — typing `drone` returns *Drone battery life optimization* and
    *UAV automatic obstacle avoidance technology*. So the question is no longer whether English
    exists. It is: **is it a translation layer we could correct, or strings compiled into the
    product?** `筆` renders as *pens* on the record-count control, and the same `無人機` becomes
    *Drone* in one chip and *UAV* in three. Patent titles, abstracts and assignee names are not
    translated in any capture we hold, which is the layer `case.md` §8.2's second sub-question is
    about and the layer that actually decides whether a US founder can read a result.
50. **Is `搜尋耗時 1.97 秒` representative, and what does a run cost?** §10.8 asks the cost question
    generally; here there is a number on the screen to attach it to. Two seconds is fast enough that
    §4b's re-baseline can be free and §2's narration is nearly unnecessary — if it holds at 500
    records, on US data, under load.
51. **What is its release status and roadmap, and is there room to shape it?** The only question on
    this list that is about the relationship rather than the capability, and the only one where a
    late answer costs us something irreversible. Nothing here has a version string or a changelog
    entry. If the surface is still moving, the three `Omit · cut` rows in §8.7 — the record-count
    control, the printed score, the ungated pivot chips — are things we could ask to have made
    optional rather than things we would have to undo.
52. **Can the 技術 scheme be computed over a result set we hand you, rather than off the string at
    fishbone time?** *Amended 2026-09-10, not retired: it had two clauses and only one went moot.*
    The **功效** half died with ~~§10.2~~ — nothing consumes an outcome scheme. The **技術** half is
    untouched and is now more load-bearing than when it was written, because the technology axis is
    the only generated thing left on the map.

    **What it asks, and why it is a different question from generation.** ~~§10.2~~ asked whether a
    scheme can be *generated*; this asks *when*, and the failure is different. Screen `24` draws its
    matrix over 102 retrieved patents, so the axis plainly can be derived from a corpus — what we do
    not know is whether that derivation is available as a step we can call **after** a search, on
    the set that search returned.

    ***The stated consequence is rewritten, because the veto it named no longer exists.*** It read:
    *if the schemes can only be produced before retrieval, the veto has to move back to the confirm
    step, where it was and where it was wrong.* There is no veto anywhere (~~§6.1a~~, §1a conflict
    5), so nothing can move back. The consequence now is a claim about what the map means:

    > **If the columns can only be produced before retrieval, they describe the founder's sentence
    > rather than the corpus — and §6.1's caption may not claim otherwise.**

    That is a smaller failure than losing a control and a harder one to notice, which is why it is
    written down. A caption saying *moulded composite shell holds 32 of the 124* is a statement
    about the corpus; if the column exists because the sentence implied it rather than because the
    corpus contains it, the sentence is still arithmetically true and is answering a different
    question than the founder thinks. §6a.2's rule — the columns are computed once at the gate and
    a re-tick never regenerates them — makes this observable rather than fixing it.

    *This is the only question on the list raised by a design decision rather than by a screen,
    which is why it is last and not third.*

53. **What is `回傳筆數`'s own default, when the founder declines to set it?** §4a's fifth question is
    skippable like every other one, and `Not sure` has to land on a number. Terrain currently picks
    **50** and that figure is **ours** — the middle of their five values, chosen because it is the one
    that reads as *a reasonable amount* rather than as a decision. Every capture we hold shows the
    control already set, so we cannot tell what it does when it is left alone. **If the engine has a
    default, Terrain should use it**, for the same reason it asks the control's own five values
    rather than a synonym for them (§4a). Pairs with §10.47, which asks whether the 500 is a UI cap
    or an engine cap; this asks about the other end of the same control.
54. **Does the record carry the claim set as text, per claim, and does it carry the abstract?**
    §7a.3's pane renders both, and it renders them as the record — unhighlighted and unparaphrased,
    which is the whole basis on which it is admissible. So the shape matters more than usual: an
    **array of claims** lets the pane number them the way a patent numbers them and lets counsel be
    pointed at claim 4; **one blob of text** does not, and a rendered image of the claims would void
    the row outright (`components.md` §0 — you cannot re-token a PNG). Screen `25` shows a record
    view with a decode, so the text is plainly held somewhere; what we do not know is whether it is
    reachable **as the published text** rather than only as their reading of it.


**Two added 2026-09-10 with §1a's adoption. Both are about the map's new row axis, and the first is
a requirement rather than a question.**

55. **Show us `Tech-Effx › Company` populated.** Screen `16` is the right structure captured
    **degenerate** — a single 1 × 1 cell — and screen `24`, the only populated matrix we hold, is
    技術 × 功效. **So Terrain's hero widget is specced against a view nobody here has seen with data
    in it.** Three things we cannot answer from the capture and need to: **how many assignee rows
    does it lay out**, does it **collapse them into a tree** the way screen `09b`'s assignee list
    does, and does it **paginate**? §6.1 takes the top eight and says so on the card; if the engine
    already has an opinion about that number, Terrain should use it rather than author a second
    one. *This is a capture request, not a capability question, and it is the cheapest item on this
    list to satisfy.*

56. **`Applicant/Assignee Merge` must be on, and it must be on by default for us.** *Recorded as a
    hard requirement rather than as a question, which no other item on this list is.* The toggle
    defaults **off**: screen `03` shows one holder across **5 rows**, and `11b` shows two more at
    4 and 5 rows each — **on US companies**, which is precisely the coverage §10.4 already asks
    about. On a rivals table that is a bad row a founder cannot detect. **As the left axis of the
    hero matrix it is one company rendered as five rows of the map**, with its filings divided
    among them, and every reading the map supports — who holds what, how concentrated the field
    is, §6.1's *no holder owns any approach here* — is then false in the same direction.

    **This is the most serious external dependency in the document**, and it is more serious than
    it was on 2026-09-09, when the same defect only affected a table. §6.2 records that
    deduplication stopped being that widget's problem and became the map's. **If the merge cannot
    be defaulted on for our calls, the holder axis is not shippable** and §6.1's row axis has to be
    reopened. Pairs with §10.4 (does 名稱統一 cover US startups at all) and §10.33 (are the six
    merge toggles request parameters or UI state) — **§10.33 is the one that decides whether this
    requirement is even expressible**, and it was written as a front-end curiosity.

---

## 11 · Open

**Closed 2026-08-31, and reopened and re-closed 2026-09-10 — chat's resting form.** It was
*floating panel vs docked command bar*, and the answer was the **docked command bar**: a 44px icon
at the bottom-right of the map that expands into the full composer.

> ***The dock is gone — and so is the panel that replaced it, later the same day. There is no
> chat surface at all*** (~~§5~~). **The question this entry closed is therefore moot**, and the
> entry is kept because the reasoning below is the record of why a second conversational surface
> was hard to place at all — which is most of the argument for not having one.
>
> *The third answer, for the one day it existed: a masthead control opening a panel over the left
> column. Neither original option was available, because the map no longer has a bottom-right
> corner of its own — the right pane scrolls and the record overlays it.*
>
> **Two of the three reasons that decided the dock survive the move and one does not.** The
> composer is still **one component at two sizes** rather than two things that resemble each
> other — that was the strongest reason and it is untouched. The observed collision that killed
> the floating pill (at 1000px it sat on the Lineage caption, which is where §6.1 puts a widget's
> blind spot) is avoided by an overlay that covers a column rather than floating over content.
>
> **What is lost is the third: "the thing you type into on the map is visibly the thing you typed
> into to make it."** A masthead control is one step further from the map than a corner of it, and
> the panel opens over the *list*. §5 records that as a real cost paid for the record owning the
> right edge, not as a wash.

*The 2026-09-08 amendment below is about the dock's card, and its **specifics** are spent with the
dock. Its four requirements are not: a header naming the current job, a close control that reverses
the open motion, a dot when a thread is folded away, and Escape named rather than merely working.
Every one of those transfers to the panel and none of them was about being in a corner.*

> **Amended 2026-09-08, and the closed question stays closed.** The dock was right and the *way out*
> of it was missing. It opened as three unlabelled surfaces — a hint block, a thread panel and the
> composer, each on its own shadow — dismissible only by Escape, which was never stated, while the
> icon that would have been the obvious way back sat underneath the composer.
>
> It is now **one card** with a header that names the current job (`Ask about this map` /
> `Review this change` / a working label), a close control that plays the open motion in reverse so
> the card visibly shrinks into the corner it grew from, a dot on that corner when a thread is folded
> up behind it, and Escape named on the card rather than merely working. Clicking the map closes it;
> clicking the sidebar closes it without eating the click.
>
> **Close means minimize.** The thread is kept and reopening lands back in it. `design-language.md`
> §7 has the spec and the two accessibility consequences of clipping a full-height card.
>
> None of this reopens *panel vs dock* — the three reasons below still hold, and the header is what
> lets the dock carry §4's gate without understating it.

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
- ~~Density thresholds for the three zones (§6.1).~~ **Closed 2026-09-10**, and the zones went the
  same day. The bands are cuts at 2/14, 6/14 and 12/14 of the view's own maximum — relative, which
  is what §6.1 always claimed. *There is one view now, so there is one maximum, and the arithmetic
  the axis switch forced is simpler than the thing that forced it.*
- ~~**Whether §1a's proposal is adopted, in whole or in part.**~~ **Closed 2026-09-10. Adopted in
  part** — four conflicts resolved in Innovue's favour, the gate resolved against them. §1a is the
  record.
- **Can the map be computed over an ad-hoc search result, or does it need a saved project?**
  **Narrowed 2026-09-10, and it does not close.** It was §1a's blocking question and §1a was
  adopted without it being answered, which is recorded there as a decision rather than an
  oversight.

  *What narrowed it:* the gate survived, so an approved corpus exists before anything is drawn —
  there is a **set**, and Terrain is not pointing the matrix at a raw search result.

  *Why that is not enough:* the set exists **as a selection in our client**, not as a 專案 in
  IPtech. If the engine needs a persisted project id, we would have to create one silently on
  every search, which is a save step wearing a different name. **So the question is now: can the
  matrix be computed over a set we hand you, or must the set be a 專案 on your side?** That is
  §10.52's 技術 clause and §10.23 together, and the two should be asked as one.
- **Does §4's gate earn its friction?** §1a's counter-argument is that a gate costs every search
  including the many that are fine. This is a question about founders, and nothing in this document
  answers it. *Naming it as unanswered is the honest state; it has been argued from conviction on
  both sides in this file.* **And it is now unanswered about something that shipped**: §1a records
  that the gate survived because everything that shared its job was removed in the same pass, not
  because this question resolved.
- **Where a widget's full form lives, now that there is no widget page.** Added 2026-09-10.
  ~~§7a.2~~ specced four pages; §1a's adoption removed the surface. **Nine §8 rows are homeless**
  — Share, Ranking, Activity, Cross Reference, Research Ability, Citation, SEP marking, company
  cross-citation, and the cluster charts — and `design-language.md` §7 specs four chart forms with
  nowhere to render them, two of which are **built in the prototype today**.

  **Do not answer this by inventing an expand-in-place mechanism in the prototype.** §6.5
  already refused that move, and its reason is `CLAUDE.md`'s: it would make a preview the only
  record of a surface. *The honest options are a destination that is not a page, a pane state, or
  deciding that six views is the product and the nine rows stay `Omit · later` permanently.
  Nothing here picks one.*
- **Filings and Lineage still have no click-through.** ~~§7a.2~~ logged this as a bug in 2026-09-08
  and half of it is fixed: the map cell and a rival row both filter the list (§6a.3). The other
  half is a plain gap now rather than an asymmetry between pages.
- **Fix the 64px rail before anything depends on it.** At its collapsed width the shell drops
  search and version history outright rather than reducing them to icons. **That was a bug
  regardless of §1a and it still is** — the masthead won, so nothing ships on the rail, but the
  rail is still in the codebase and the argument for fixing it never depended on which shell won.
  *It is lower priority than it was and it is not closed by not being used.*
- How the IPC confidence signal is presented without becoming a statistics lesson (§6.1).
- Incumbent-vs-startup data source for the rivals widget (§6.2).
- **What the founder walks away with** — open, and discussed at §7a.8 without being settled. If it
  ever resolves to a named artifact, that name is constrained: not *report*, *brief*, *summary* or
  *memo*, which are document nouns and would breach `brief.md` §1 on their own.
- **The outbound ask to Innovue is stale and must not be sent as it stands.** Added 2026-09-10.
  `design/previews/iptech-feature-request.html` is local-only, so no pre-push check will catch it.
  It is organised on Terrain's **six surfaces**, has groups titled *"The market page"* and
  *"The technology page — where the ground is open"*, still lists the three zones, and **asks for
  功效** — which ~~§10.2~~ retired. §8's own rule applies: *an outbound question capped by unsettled
  decisions is a question we only get to ask once.* **Rebuild it against §10 as it now stands, or
  record that it is withdrawn.** §10.55 and §10.56 are the two items it most needs to carry, and
  neither existed when it was written.
- Pricing, and whether a free tier exists — blocked on the subscription-rationale gap in §9.

  **And §7a.9 now presupposes an answer, which is recorded rather than hidden.** The points page
  asserts a **fixed allowance per period**: a balance over a denominator, and a percentage spent.
  That is the first thing anywhere in the product to assume a plan shape — `design-language.md` §7
  kept the chrome's meter a bare balance for exactly this reason, and it still is one. If pricing
  resolves to anything else, the denominator and the ring are what change, and they are in one
  place on purpose. **The derived price list at §8.2 also moves this bullet closer to answerable**:
  a per-record classification cost means the marginal cost of a founder is a function of how large
  their sets are, which is a very different pricing problem from a flat per-seat one.

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
