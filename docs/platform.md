# TIS Terrain — Platform

> **What gets built.** This document describes Terrain as it exists in
> [`design/previews/terrain-prototype.html`](../design/previews/terrain-prototype.html). The
> prototype is the reference: where this document and the prototype disagree, the prototype is what
> was decided and this document is stale.
>
> Positioning — what Terrain is and who it is for — is [`brief.md`](brief.md). How it looks is
> [`design-language.md`](design-language.md). What the engine must return, per component, is
> [`../design/components.md`](../design/components.md).
>
> **Every figure here is illustrative.** No number is a real filing count. The distribution is
> representative and the arithmetic is internally consistent; §13 carries the invariants.

---

## 1 · The shape

**Two surfaces on the path, four destinations off the chrome.**

| | |
| --- | --- |
| **The conversation** | Where the founder describes an idea, answers five questions, and approves a reading of it. |
| **The working surface** | The patents the search found down the left, every view of them on the right, any patent's record over those views. |
| *Destinations* | Points · Account settings · Plan & billing · Help. Reached from the masthead, returned from in place. |

A **surface** is somewhere the product happens. A **destination** is somewhere the founder steps off
to and comes back from. No moment routes through a destination, and nothing opens a new tab or a new
window anywhere in the product.

**The map is Technology × holder.** Approaches across the columns, holders down the rows. One cut,
no axis switch, no founder veto over either list. An empty cell means *this holder has not filed
against that approach* — a fact about a company, not about the technology.

**A top masthead, not a sidebar.** Arithmetic, not taste: the map needs 944px and the result list
stops being readable under 340px, which does not fit a 1440px laptop beside a 260px rail. Everything
a rail would have carried is in the 48px bar — the project switcher, version history, the points
balance, the appearance control, the account menu.

---

## 2 · The six moments

| Moment | Surface | What is on screen |
| --- | --- | --- |
| 1 · First run | conversation | The composer, centred, and the question above it. Nothing else. |
| 2 · Confirm | conversation | Five questions in two beats, then the reading — *here is how we read your idea* — with the commitment under the composer. **Gates the search.** |
| 3 · What was found | working surface | The ranked patents fill the left column, and every one of them already feeds the views. Nothing is approved and nothing is waited for. |
| 4 · Build | working surface | Each view resolving in place in the right pane, a loader in it until its own data lands. No stage screen. |
| 5 · At rest | working surface | The masthead, the list, the views across the `Market` / `Technology` toggle, the standing note of what the map was built on. |
| 6 · Return | working surface | Project switcher → project → straight to moment 5. No search step, no rebuild. |

**Moments 3, 4 and 5 are separated by time, not by navigation.** Each marks a distinct thing being
true — the corpus is visible, the views are arriving, the views are there — and a founder watching
the screen for four seconds sees all three.

**The build fires on creation and after a confirmed scope change only.** Never on a return visit, or
it becomes a loading screen the founder watches every day. The rebuild is visibly shorter than the
first build and says so.

---

## 3 · The conversation

### 3.1 · One field

The surface opens on **What are you building?** and one composer. Below it: *Describe it in a
sentence — or start from a patent number, a company, or a classification code. TIS Terrain shows you
who else is in the space, what sits adjacent, and who holds which part.*

Under the composer, before there is a thread: **We'll ask you to approve the criteria before we
search.** That note is replaced by the approve button when the gate arrives — the promise becomes
the control that keeps it.

The composer is **one component at one size**. It is the whole column until there is a thread, then
it pins to the bottom of it. It is inert until something is typed. A rotating ghost hint sits behind
the field and stops on first keystroke.

**The field accepts a sentence, a patent number, a company name, or a classification code.** All
four route to the same place: a reading, read back at the gate.

### 3.2 · Narrowing — five questions, two beats

Five questions, fixed, one at a time. The next arrives only when the current one is answered.

**Beat one — *Got it — two things before I search.***

| Key | Question | Options |
| --- | --- | --- |
| `dir` | Which of these is closest to what you mean? | Five directions generated from the sentence, plus **None of these** |
| `kind` | Is this hardware, software, or both? | Hardware · Software · Both |

**Beat two — *And three about where to look.***

| Key | Question | Options |
| --- | --- | --- |
| `where` | Where does this need to hold? | United States · Taiwan · Both |
| `stage` | Granted patents, applications, or both? | Granted · Applications · Both |
| `count` | How many patents should I bring back? | 10 · 20 · 50 · 100 · 500 |

**Every question carries the same abstention — *Not sure* — and it is not one of the answers.** On
the direction question *None of these* sits among the options and *Not sure* beside them: asserting
all five are wrong is information; not knowing is not.

**Only the direction question carries a gloss.** The line opening each turn names the answer just
given; on the direction it adds a clause saying what that direction *is* — *the frame itself, not
what it carries*. The other four are administrative and glossing them would be four small claims to
defend for no reader who needed them.

**A declined question echoes nothing.** *No matter.* and the next question. Acknowledging an
abstention as though it were an answer is the surest way to make it feel like it cost something.

**The direction options are real words, not bars.** They are observed output from Innovue's own
semantic surface — nobody's client data, and observed rather than invented. This is the one place in
the product where generated content renders as text instead of as a skeleton bar.

**The beat seam is an ordering rule, not a message.** Two beats exist because the first two questions
are about *what you mean* and the last three are about *where to look*, and a founder answering five
questions in a row should be told when the subject changes. Nothing renders the seam but the lede.

### 3.3 · Typing instead of answering

The composer stays live throughout. A founder who types instead of picking an option gets the same
treatment the gate gives: what they said is read back, and it goes through the gate before anything
is searched.

---

## 4 · The gate

**The confirm step is the only correction point in the product.** With a single fixed axis scheme
there is no axis veto to fall back on, so this step is load-bearing in a way nothing else is.

### 4.1 · Two modes, one component

| | `first` | `change` |
| --- | --- | --- |
| Title | Here is how we read your idea | Review this change |
| Lede | Correct anything that is wrong — say what is off and I will adjust it. | One change to your scope. Nothing is re-searched until you approve it. |
| Gate | **Nothing is searched until you approve this.** Every result that follows is built from these criteria — if the reading is wrong, the results will be wrong in a way you cannot see. | **Approving re-searches only what changed.** Everything else stays exactly as it is, and this change is saved as a version you can revert to. |
| Action | Approve and search | Approve and rebuild |
| Reads back | the sentence, the answers, the exclusions | what was asked for |

It is **literally the same node** in both threads — moved rather than duplicated — so *same
component, refining rather than creating* is true in the DOM and not only by resemblance.

### 4.2 · What it reads back

- **What you said** — the founder's own sentence, as text and not as a bar, because what they typed
  is theirs. Editable inline: Enter saves, Escape cancels, Save is inert while the field is empty,
  and the caret lands at the end rather than selecting the whole sentence.
- **And you told us** — the five answers, each carrying its question's label, as a word if one was
  picked and as a bar if the option was one.
- **And leaving out** — anything the founder asked to exclude, rendered separately from the answers
  because an exclusion is the opposite kind of fact and reading them in one row takes a moment's work
  to tell apart.

**Editing the sentence does not re-open the round.** If the change is large enough to invalidate the
five answers, the composer below is still the way to say so, and it routes through this same gate.

### 4.3 · Where the commitment lives

**The primary action sits under the composer, not at the foot of the card.** The two things a founder
may do — approve, or say what is off — are one decision, so they are one zone. It is full width: the
send arrow already owns the bottom-right corner, and a right-aligned pill beneath it reads as a
second send.

**You cannot approve a reading you are half way through rewriting.** While the sentence is being
edited the card goes quiet and the approve button is gated, with the reason stated in the composer's
status line.

### 4.4 · What this step does not do

It does not show the axes. Approaches and outcomes are computed **over a result set**, so they are an
output of the corpus and not an input to it — showing them for approval before a single patent has
been retrieved was a sequencing error. They appear on the map, where they are computed.

---

## 5 · The build

Two shapes, sharing one component.

| | `create` | `rebuild` |
| --- | --- | --- |
| Title | Building your map | Updating your map |
| Lede | This runs once. Coming back to this project later opens it straight away — you will not watch this again. | Only what changed is being rebuilt. Everything you did not touch stays as it was. |
| Stages | Reading your idea · Searching the patent database · Grouping what came back · Merging duplicate filings across countries · Drawing the map | Applying your change · Searching the patent database · Redrawing the map |
| Action | Open your results | Back to your results |
| Note | Saved to your projects. Changing the scope later rebuilds only what changed. | Saved as a new version. You can revert to the previous one from the version list beside your project. |

**The bar advances on completed stages, never on elapsed time.** Search latency is an open question,
so there is no duration to honestly fill against — and a bar that fills on a timer asserts something
the data cannot support, at the most credulous moment the founder has. An elapsed counter runs beside
the title and says what is actually known.

---

## 6 · The working surface

One screen. Moments 3 through 6 all happen on it without it ever being left.

### 6.1 · The masthead

48px, full width, seven regions:

1. **The lockup** — the way home. It returns the founder to the working screen. It is **inert on the
   conversation**, both times that surface is reachable, and says so with `aria-disabled` rather than
   by going grey: a lockup that changes appearance by screen stops being a fixed point in the chrome.
2. **New search** — Lucide `zoom-in`, not `plus`. The plus said *new* and said nothing about what a
   new one is.
3. **The project switcher** — the projects list in two recency groups, with **version history nested
   under the open project**, indented on a left hairline. A version is *of* a project; two flat lists
   say nothing about which belongs to which.
4. **The points balance** — a button, and the link to the points page.
5. **The appearance control** — three states: light, dark, system. **It may not be demoted into the
   account menu at any width.** A second control over the same value elsewhere is not a demotion; a
   move is.
6. **The account menu** — Account settings, Plan & billing, Help, and Sign out.

Two regions are protected by name: the appearance control and the nesting of version history.

### 6.2 · The head

The surface's own `h1` — *Your search* — with the project name beside it as a bar. Then a row of
chips, which are statements rather than controls:

`Version …` · `Updated …` · `Deduplicated by family` · the scope note · and, on a return,
`Opened from your projects — nothing was rebuilt` or `Updated from your change — only what changed
was rebuilt`.

**The scope note is standing, not a toast.** It names both numbers — what the views were built on and
what matched — because *built on 124* without the total says nothing.

**The `Market` / `Technology` toggle sits at the trailing end of that row**, as the only control among
the statements, which is why it keeps the segmented form. `role="tablist"` with `aria-selected`, not
`aria-pressed`: this is which-of-these-am-I-looking-at, not a setting. Nothing animates on a swap —
both pages are built from the same payload, so the toggle chooses what is on screen and makes no
request.

**The split is IPtech's own and it is lopsided because theirs is.** `Tech-Effx` is the one group
reachable under `T-Map` and not under `M-Map`, and the cut of it Terrain takes is the map. Every other
view is sourced from a group reachable under both, so they sit on `Market` — and `Market` lands.

### 6.3 · The list

The left column, 340px minimum.

**Head** — *Your results*, a star count, `N matched`, and one info affordance. A narrow column has room
for the list or for prose about the list; every sentence that is not the list lives behind that
control.

**Bar** — Sort (Relevance · Newest filed · Oldest filed), Filter (status and kind facets, with a
count), **Re-rank** and **Restore the original order**. Re-rank is the only filled control on the
surface and is hidden rather than disabled when there is nothing to rank.

**Rows** — each carries the patent's identity as bars, a status chip, and the engine's relevance score
on the right. Twenty rows, then a foot that says how many are left and offers `Show more`.

**Arranging the list is a request.** Twenty rows arrive at a time and *Show more* asks the engine for
the next twenty, so the client never holds the whole result set. A sort re-sequences it at the engine
and hands back a different first page; a facet asks which patents answer to it. Both wait, both can
fail, and §9.1 says what the founder sees when they do. Neither spends points — §8.1.

**Every patent the search returns feeds the views, and keeps doing so.** There is no per-row
selection. Sorting and filtering change what the founder is *looking at*, not what the views count.
The corpus is set by the gate and by the fifth narrowing question alone.

**The star re-baselines the order.** Star a patent and *Re-rank* appears; it orders the rest by how
close they are to the one starred. No patent enters or leaves; only the sequence changes. A chip
announces the settled state and *Restore the original order* undoes it.

**The ordering is a ranking, not a verdict.** A patent near the top is close to what the founder
described. It does not mean it affects them, and it does not mean the ones below it do not. No ranking
language may read as a verdict — *ranked by relevance* is an ordering; *strong match*, *best fit* and
*most relevant* are readings and stay out whatever number sits beside them.

### 6.4 · The views

Twelve cards in the right pane, across two pages. Each has a title, an icon, an info popover, and a
caption that states its finding.

**`Technology` — three**

| View | Form | What it answers |
| --- | --- | --- |
| **The map** | density matrix, technology × holder | Who holds which part of this space |
| **What this space is made of** | ranked bars, flat | How big each approach is, over the whole corpus |
| **Which part is moving** | one year-strip per approach, shared scale | Which approach is growing, which has stalled |

**`Market` — nine**

| View | Form | What it answers |
| --- | --- | --- |
| **Filings over time** | series + trend, with the unpublished window shaded | Whether this space is accelerating |
| **Early or late** | holders against patents, one point per year | Whether it is forming or consolidating |
| **Rivals** | table, sortable by count or recency | Who is here, and who is still active |
| **Rival momentum** | one year-strip per rival, shared scale | Which rivals are still filing |
| **Where the holders are from** | ranked bars | Where the companies are based |
| **Where it is filed** | pie + ranked bars | Which countries the patents are granted in |
| **Live and expired** | donut + stacked bars per holder | How much of this is still enforceable |
| **Who builds on whom** | directed N×N citation grid | Whose work the others had to build on |
| **Lineage** | most-cited table | Who holds the ground this approach grew out of |

**The map is read across; *What this space is made of* is read down.** The denominators differ on
purpose and the cards say so: the map's column headers cover the eight largest holders, the mix card
covers the whole corpus. Two questions, not a disagreement.

**Tone is how many filings; the hatch marks where the count is climbing.** The density ramp is
relative to the active view's own maximum, not to absolute thresholds.

**The caption owes a sentence when the cells do not sum to the scope figure.** The map lays out the
eight largest holders, so its cells sum to less than the corpus with nothing removed. The invariant is
*cells sum to shown, shown < total, and a sentence says why* — not *cells sum to total*.

**Each view waits with a loader, not a skeleton.** A bar is the refusal to invent a value and is
permanent; a loader is work in flight and goes when the work does. The region reserves its height
before it empties, so the only thing that changes is what is inside it.

### 6.5 · A cell click filters the list

Clicking a cell on the map filters the left column to the patents in that intersection, with a chip
above the list naming the row, the column and the count, and a way back. **The list is filtered; the
views are not.** Nothing is redrawn and nothing is re-run.

### 6.6 · The record

A patent's record opens **over the right pane**, leaving a ~200px peek. It covers the thing that is
not its subject — you read a record against the map you found it on. The left column is never covered.

It renders **the record, not an opinion about the record**: eleven identifiers, the abstract, and the
claim set as published. A five-field handoff row — number, holder, where, status, IPC — is a
projection of the same fields, for the founder taking this to counsel.

**What stays out**: plain-English decode, match highlighting, an IPC gloss, unread markers. Each is a
*reading* of the record rather than the record. Drawings are the odd one out — a figure *is* the
record, so nothing forbids them and they are simply not built.

---

## 7 · Projects and versions

A project is the saved object: the sentence, the five answers, the approved criteria, and everything
built from them. It takes its name from the founder's sentence plus the direction picked at beat one.

**Versions are the founder's own scope changes**, nested under the open project in the switcher. A
confirmed change through the gate saves a new version and rebuilds only what changed. Reverting is
free and costs no points.

**Returning to a project opens it straight away.** No search step, no rebuild, no progress bar.

**A founder who has never searched has no projects, and a project whose map has not been built yet has
no versions.** Both say what fills them rather than rendering as a heading over nothing. An empty list
that looks like a list which failed to load is the same defect as a bar standing in for a value nobody
withheld.

---

## 8 · The destinations

Four pages behind the chrome. Each has a back control that names **whatever the founder was doing
before they stepped off** — not a fixed label, and not a ring of account pages: a destination reached
from a destination does not become the way out.

### 8.1 · Points

What was spent, never what is paid. A balance ring against the quarter's allowance, a card per run
type, share bars, a per-day column chart with day / week / month grain, and a list of recent runs.

| Run | Costs |
| --- | --- |
| Map build | 265 |
| Rebuild | 51 |
| Search | 2 |
| Re-rank | 4 |
| Skim | 1 per patent |

**Changing the grain changes the resolution and never the denominator.** 91 days is 13 whole weeks and
three months, so all three grains divide it exactly and every one sums to the same total. There is
nothing to reconcile.

**Building spends points; reading does not.** Opening a record, sorting, filtering, re-ranking,
switching pages and reverting to an earlier version are all free, however many times. A build is
charged when it is approved, not when it finishes, and returned if it does not finish — §9.2 carries
the rule and why the charge sits at the gate rather than at the end.

### 8.2 · Account settings

**Your details** — name, email, password. Name and email are inline edits: the bar becomes a field,
Enter saves, Escape cancels, and the field opens *empty* rather than seeded, because there is no text
to load. The email field validates and states the fix rather than the fault.

**A save is confirmed in words.** The value's bar darkening one step says it changed; it does not say
it was kept, and a founder who looked away for the length of the request sees nothing at all. The
confirmation is a short settled statement beside the value — *Name saved* — and it stands until the
next edit rather than fading.

**Appearance** — the same three-state control as the masthead, reading and writing the same value.

**Your data** — delete the account, behind an inline confirm. **The safe path carries the weight and
the act is the quiet one**: *Keep account* is the affirmed button and *Delete account permanently* is
the ghost one. Neither is primary — the primary action of a settings card is never deletion.

**There is no export row.** Export is out by decision, not by deferral.

### 8.3 · Plan & billing

What is paid, never what was spent. The plan's allowance and price, the payment method, a receipt
switch, and a list of invoices. One sentence links to the points page for the other half.

**The plan name is a bar and the price is `XXX`.** An allowance and a price are *figures*, and every
figure here is illustrative. A tier *name* is a taxonomy, and inventing Pro / Team / Enterprise would
put a tier structure nobody has decided into a public artifact. `XXX` means nobody has chosen a price
yet; a bar would mean a real value exists and is not ours to print. The two must not be conflated.

### 8.4 · Help

**Contact-first**, which is honest about a product with no documentation site. A topic menu, a message
field, and a sent state that *replaces* the form rather than sitting under it — a composer left on
screen beneath a confirmation invites a second send of the same message.

Then **Common questions**: twelve answers in three groups — your search and your map, points and your
plan, your projects. **Every answer says something no other surface states.** A Help page that
hoovered up captions would be restating labelling.

The most important of the twelve is the one that says Terrain **cannot** tell a founder whether they
are free to file. That is a legal question and it is for a patent attorney.

---

## 9 · When it does not work

**A search crosses a network to an engine, and an engine that does not answer is not an edge case.**
Every wait in this product can end two ways. This section is the second way.

**The founder never loses what they wrote.** A failure returns them to the last point they could have
chosen differently — the gate for a search, the field for a save, the composer for a message — with
what they typed still in it. Nothing here asks anyone to remember what they said.

**What failed is named, and the fix is the next thing in the sentence.** The message states the fix
rather than the fault, which is the rule the email field already follows. No blame, no *oops*, no
apology standing in for an instruction. Where there is nothing the founder can do, the message says
that instead of inventing an action.

**It is drawn in weight, not colour**, and [`design-language.md`](design-language.md) §7 carries the
treatment. The short reason: the one red this system has means *expired patent*, and it can be on a
chip the founder is reading on the same screen.

### 9.1 · A failure is the size of the region that was waiting

**Whatever was waiting is what fails.** A view that does not arrive leaves the other nine standing and
says so in its own card. A record that does not open leaves the list and the map underneath it
untouched. Only a failure of the search itself takes the whole surface, because there is no surface
without it.

| What was waiting | What the founder sees | What survives |
|---|---|---|
| The reading, before any question | The sentence still in the thread, and the reading offered again | The sentence, and the points, which were never charged |
| The search, after approval | The gate, with the criteria still on it and the approval offered again | Every answer, the exclusions, and the points |
| One view, while the others land | That card alone, in place, naming the view that did not arrive | The other views, the list, the map |
| The record | The pane, with the row still selected | The list and the views under it |
| A re-rank, a sort, a filter | The list as it was, and a sentence saying the order did not change | The order that was on screen |
| A save | The field, still open, still holding the value | What was typed |
| A message | The form, not the sent state | The message and the topic |

**A region that fails keeps the height it reserved.** A wait that collapses into a short sentence
moves everything below it twice — once for the wait and once for the failure — and the second jump is
the one that loses the founder's place.

### 9.2 · Points

**The meter may not retain points for work that did not finish.**

**The charge lands at approval and is returned if the run does not.** The gate is the last point the
founder could have chosen not to spend, so it is where the commitment belongs, and a balance that
moved only on success would leave the most expensive act in the product invisible while it ran. The
refund is what makes charging early honest rather than optimistic.

**Both runs follow it.** A first build and a rebuild charge at the same moment and return at the same
moment. Two debit rules for two runs of the same engine is a distinction the founder has no way to
learn and no reason to expect.

**The failure copy says the balance moved back**, because a founder watching a meter drop and a search
fail will otherwise assume they paid for nothing.

### 9.3 · When there are not enough points

**The gate does the arithmetic before it asks for the approval.** A founder is never invited to
approve a run that cannot be paid for, and the block is stated at the gate rather than discovered
after it.

**The approval is withheld, not hidden.** The criteria stay readable and the reason sits with the
control that is refusing, in the composer's status line — the same place the gate already states why
approval is withheld mid-edit. What it names is the shortfall and when the allowance returns.

**The meter carries its own zero.** A balance at nothing is a state, not an absence, and it reads as
one rather than as a figure that failed to load.

### 9.4 · When the search finds nothing

**This is not a failure and may not be drawn as one.** The engine was asked a question and answered
it. The founder gets the answer they paid for, which is that no patent in the database matched every
criterion they approved — and a run that finished keeps its charge under §9.2, however unwelcome the
answer is.

**It is a result about the criteria, and the copy says so.** This is the one place in the product
where `brief.md` §1's test bites hardest: an empty result read as *nobody is here* is the exact claim
a holder-axis product may never make, and a founder who has just spent points is the reader most
likely to make it for us. So the sentence names the criteria, offers the way back to them, and stops.
No *open ground*, no *whitespace*, no count of how close it came.

**The way back is the gate**, with every answer still on it. Nothing about a search that returned
nothing makes the founder's five answers wrong, and making them retype the sentence would say it did.

**And the approval is withheld until something on it changes.** §9.3 blocks a run that cannot be paid
for; this blocks one that cannot come back different. The same criteria searched twice return nothing
twice, and the second run costs what the first one did — so the gate states why it is shut, and the
three ways to change the criteria are the three ways to open it.

---

## 10 · What is inert, and why

**One rule, not a list of exceptions.** Change password, delete account, change plan, both payment
updates, viewing an invoice, and sign out do nothing. Every one of them is an **act on an account**,
and there is no account model yet (§12). The three account pages are *about* an account; none of them
*authenticates* one.

**And the surface says so, once per place rather than once per control.** A control that looks live
and does nothing is worse than one that is absent, because the founder blames themselves for the
press that did nothing. Each is marked unavailable and kept focusable — the treatment the gate
already uses when it withholds an approval — and one sentence per surface names what is not ready.
Seven notices for one rule would make it read as seven separate faults.

What is live is everything that is pure client state: both inline edits, the switches, the appearance
control, the topic menu, and the message.

---

## 11 · What Terrain takes from IPtech

Innovue's IPtech is a Chinese-language patent landscape platform built for analysts, with 68 analysis
destinations across two map modules. Terrain is not a tier of it. This section records what is
adopted, what is cut, and why — so a later ask to Innovue does not start from nothing.

**Adopted.** The search and classification chain; the technology × assignee matrix (`T-Map ›
Tech-Effx › Company`) as the map; the filings trend, the competitor table, the citation cross-
reference, the country distributions, legal status, life cycle, and the per-holder and per-column
trend cuts. Name unification, family merge and legal-status resolution are taken as **hygiene the
founder never sees** — they are why the list can say *deduplicated by family* without asking anyone
to configure it.

**Cut, with reasons.**

| Cut | Why |
| --- | --- |
| The authored taxonomy | IPtech wants a taxonomy written before the first search. Terrain generates the axes from one sentence — this is the whole of what makes it operable by a founder. |
| Valuation (`價值通`) | A verdict on a patent's worth. Terrain does not issue verdicts. |
| Plain-English decode (`AI閱讀Pro`) | A paraphrase of the record rather than the record. |
| The landscape summary (`AI Insight`) | Same reason, at corpus scale. |
| Per-row curation | A checkbox that redraws a chart is a curation workbench. Sort and filter replace it. |
| Export | Declined in favour of a link plus copyable text. |
| The ring diagram beside the citation table | It carries no information the table does not. |
| The zone names (`地雷區` / `新興區` / `處女地帶`) | They label absence, and on a holder axis absence is a company's profile rather than open ground. |

**The seam worth remembering.** `Market` is computable from bibliographic fields; `Technology` needs a
taxonomy generated from the founder's sentence. The two halves have almost disjoint API surfaces, and
that bears on cost.

**The standing risk.** The map's source view arrives in IPtech's own captures with the holder axis
**collapsed**. The shape Terrain asks for is the *expanded* state of a view we have only seen shut.
That is the sharpest open question against any component, and
[`../design/components.md`](../design/components.md) carries it per row.

---

## 12 · Not now

**Not a fence — an ordered list of things that are not being built yet, each with what would start
it.** Nothing here is prohibited; it is simply not next. Where an item is *decided against* rather than
postponed, it says so.

1. **Filing alerts** — *tell me when someone files near my idea.* This is the strongest recurring-
   value feature in the engine, and without it v1 launches with no subscription rationale beyond
   re-running searches: a founder searches, gets an answer, and has no reason to return next month.
   **Starts when:** pricing is decided, because pricing cannot be decided without it.
2. **Authentication and the session model.** Every *has the founder done X yet* test is currently a
   page-lifetime flag, so a reload starts the founder over and the real product will not.
   **Starts when:** any surface has to survive a reload.
3. **A standing jurisdiction + status filter** — *live only*, *US only*, redrawing the map, the rivals
   and the trend together. The most persuasive single interaction available: watching two thirds of a
   rival's row stop being enforceable is the moment a US founder understands what they are looking at.
   **Starts when:** the map has proven out with real data.
4. **Tech × application matrix** — columns become industries rather than approaches. It answers *what
   is adjacent* more directly than the current columns do, and generating good columns from one
   sentence is the highest-risk part of the build. **Starts when:** one column set is demonstrably
   reliable.
5. **IPC drift as an adjacency detector** — flag patents whose IPC class sits outside the main cluster.
   Mechanical rather than inferred. **Starts when:** IPC depth in the engine is confirmed.
6. **Drawings in the record.** Out on cost, not on principle — a figure *is* the record.
   **Starts when:** anyone asks.
7. **Export and an attorney handoff file.** **Decided against**, not postponed: a link plus copyable
   text was chosen over a downloadable file. Reopening this is an amendment to `brief.md` §1's
   software-not-a-report lock and must be argued as one.

---

## 13 · Invariants

Nothing checks these automatically. They hold in the prototype's illustrative data and a pass that
changes one figure has to carry the rest.

- The matrix cells sum to the **shown** figure; shown is less than the total; a sentence says why.
- Every per-holder series sums to that holder's patent count.
- The country-of-origin figures sum to the corpus total.
- Live + expired equals the corpus total; each holder's split sits inside it.
- The jurisdiction figures sum to the corpus total, derived rather than typed.
- Every invoice amount is the plan price — a plan that renews at one figure cannot bill four.
- The finding quotes the true maximum cell on the grid it describes.

---

## 14 · Open

- **Does the gate earn its friction?** It costs every search a step. Its defence is that it is the only
  correction point in the product, and the cost of a wrong reading is invisible to the founder.
- **How many narrowing questions is too many.** Five is the current answer, fixed. A founder who
  abandons at question four has told us something.
- **Can the map be computed over an ad-hoc search result, or does it need a saved project?** This
  decides whether *search without saving* is possible at all.
- **Where a widget's full form lives**, now that there is no widget page. The map has a cell click; the
  filings chart and Lineage have no click-through at all.
- **Pricing.** The allowance, the price, and the tier structure are all open, which is why the plan
  screen prints `XXX` and a bar rather than guessing.
- **Whether Terrain sits on Innovue's semantic search surface or beside it.**
