# TIS Terrain — Platform

> **What gets built.** This document describes Terrain as it exists in [`app/`](../app/), which is
> the reference: where this document and `app/` disagree, the code is what was decided and this
> document is stale. Run it with `python3 -m http.server 8765` from the repo root, then
> `http://127.0.0.1:8765/app/`.
>
> Positioning — what Terrain is and who it is for — is [`brief.md`](brief.md). How it looks is
> [`design-language.md`](design-language.md). What the engine must return, per component, is
> [`../design/components.md`](../design/components.md).
>
> **Every figure here is illustrative.** No number is a real filing count. §11 carries the one
> invariant that survives, and nothing checks it.

---

## 1 · The shape

**Two surfaces on the path, one collection surface, four destinations off the chrome.**

| | |
| --- | --- |
| **The home surface** | Where the founder picks a technology field and describes an idea. One composer, one button. |
| **The results surface** | The patents the search found down the left, any patent's record in their place, the grouping panel and the drawings on the right. |
| **The starred set** | Everything the founder starred, read as a whole, and where it leaves as a file. |
| *Destinations* | Points · Account settings · Plan & billing · Help. Reached from the masthead, returned from in place. |

A **surface** is somewhere the product happens. A **destination** is somewhere the founder steps off
to and comes back from. No moment routes through a destination, and nothing opens a new tab or a new
window anywhere in the product.

**A top masthead, not a sidebar.** Arithmetic, not taste: the two columns split a 1440px laptop
evenly at 720px each, and neither half survives a 260px rail — the result list stops being readable
under 340px, and the record's eleven-field list wraps its values onto second lines under about 600px.
Everything a rail would have carried is in the 48px bar: the project switcher, the points balance,
the appearance control, the account menu.

---

## 2 · The four moments

| Moment | Surface | What is on screen |
| --- | --- | --- |
| 1 · First run | home | The field tiles, the composer, and the question above it. Nothing else. |
| 2 · What was found | results | The ranked patents fill the left column. Nothing is approved and nothing is waited for beyond the one call. |
| 3 · Working | results | Sorting, filtering, starring, finding similar, reading a record, opening a drawing. The founder may stay here indefinitely and most of the product's value is spent here. |
| 4 · Leaving | starred set | The shortlist as a whole, and two buttons that write a file. |

**There is no confirm step and no build stream.** The search runs on submit. The reading, the five
narrowing questions, the priced gate and the staged build were four ports and are now none — a
founder who has to approve a paraphrase of their own sentence before anything happens is a founder
being asked to do the product's job.

**The commitment is pressing Search, and the points are charged there.** Approval used to be the
commitment; with no approval, the button is it.

**Moment 4 is a moment and not a destination.** The starred set is where the product ends, so it is
on the path — reached from the count beside the results, and returned from to exactly the same list.

---


## 3 · The home surface

### 3.1 · The field tiles

The surface opens on **What are you building?** and a row of technology-field tiles. One is ready;
the rest carry a *Coming soon* badge **under the name, in flow** — a corner badge on a disabled tile
reads as decoration, and this one has to read as a reason.

**A tile that is not ready is `aria-disabled`, not `disabled`.** It keeps its tab stop, so a founder
moving by keyboard finds out the field exists and is not yet covered, rather than finding nothing
there at all.

### 3.2 · One composer, one button

Below the tiles: one composer, and *Describe what you are building.* The field is inert until
something is typed. Enter runs the search; Shift+Enter breaks the line; an IME composition is
excluded, because a founder composing in any input method presses Enter to commit characters and
would otherwise search half a word.

**The primary action sits under the composer, full width.** The two things a founder may do — search,
or change what they typed — are one decision, so they are one zone. The send arrow already owns the
bottom-right corner, and a right-aligned pill beneath it reads as a second send.

**The button is labelled `Search`, not an arrow.** It spends points and it is the commitment; a glyph
that means *send* understates both.

### 3.3 · The search settings

An **anchored popover**, not a modal — this product has no modal, no scrim and no focus trap, and a
panel that is none of those must not pretend otherwise by dimming the page.

It carries: **data source** (jurisdiction chips, and document kind — granted or applications),
**results to return**, and a **date filter** with a basis (filed or published) and an optional range.
At least one jurisdiction and one kind must stay selected, and the panel says so rather than letting
the founder produce a search that cannot run.

**The whole panel travels as one object** to the engine, not as six loose arguments: the panel is the
only thing that builds it and the engine is the only thing that reads it, so a shape change is a
change in two places rather than in every call site.

**Selection is on the label and the hairline, never a filled chip.** Eight simultaneously filled
accent chips read as data, and `design-language.md` §3.8 gives the accent three sites, none of which
is a set of options.

### 3.4 · The coverage block

What is in the corpus, and when each source was last taken in. One sentence of scope over a table of
sources and dates.

**It states what it does not know.** The number of documents per index is not on this surface,
because the engine does not emit it — and a coverage table that quietly omits its own size is a
coverage table a founder will assume is complete.

---

## 4 · The results surface

One screen. Moments 2 and 3 both happen on it without it ever being left, and the founder returns to
it from the starred set.

**Two columns, split evenly.** The left carries the result list, and the patent record in its place
when one is open. The right carries the grouping panel, and the drawing when one is enlarged.

**The search bar stays.** It sits above both columns with the founder's sentence still in it, so
changing the search is editing what is already there rather than navigating back to a blank one.
There is no pin control on it, because this surface does not scroll as a whole — a toggle that cannot
change anything is worse than a missing one.

### 4.1 · The masthead

48px, full width, seven regions:

1. **The lockup** — the way home. It returns the founder to the working screen. It is **inert on the
   home surface**, both times it is reachable, and says so with `aria-disabled` rather than
   by going grey: a lockup that changes appearance by screen stops being a fixed point in the chrome.
2. **New search** — Lucide `zoom-in`, not `plus`. The plus said *new* and said nothing about what a
   new one is.
3. **The project switcher** — the projects list, most recent first.
4. **The points balance** — a button, and the link to the points page.
5. **The appearance control** — three states: light, dark, system. **It may not be demoted into the
   account menu at any width.** A second control over the same value elsewhere is not a demotion; a
   move is.
6. **The account menu** — Account settings, Plan & billing, Help, and Sign out.

One region is protected by name: the appearance control.

### 4.2 · The search bar

The founder's sentence, still editable, with the elapsed time and the match count beside it. Four
toggles sit under it:

1. **Search settings** — the same popover §3.3 describes, anchored here instead.
2. **Grouping** — shows and hides the panel in the right column.
3. **Details and drawings** — the record as published.
4. **Drawings only** — the figures at the size the column allows, for a patent being read visually.

**Toggles 3 and 4 do nothing until a record is open**, and *Drawings only* refuses with a spoken
reason when the open record has no figures rather than switching to an empty pane.

### 4.3 · The list

The left column, 340px minimum.

**Head** — *Your results*, a star count, `N matched`, and one info affordance. A narrow column has room
for the list or for prose about the list; every sentence that is not the list lives behind that
control.

**Bar** — Sort (Relevance · Newest filed · Oldest filed), Filter (status and kind facets, with a
count), **Find similar** and **Restore the original order**. Find similar is the only filled control
on the surface and is hidden rather than disabled when nothing is starred.

**Rows** — each carries the patent's identity as bars, a status chip, and the engine's relevance score
on the right. Twenty rows, then a foot that says how many are left and offers `Show more`.

**Arranging the list is a request.** Twenty rows arrive at a time and *Show more* asks the engine for
the next twenty, so the client never holds the whole result set. A sort re-sequences it at the engine
and hands back a different first page; a facet asks which patents answer to it. Both wait, both can
fail, and §7.1 says what the founder sees when they do. Neither spends points — §6.1.

**Sorting and filtering change what the founder is looking at, never what was searched.** The set is
fixed by the sentence and the search settings; everything on this bar rearranges it. A founder who
wants a different set edits the sentence and searches again, and the bar above says so by staying
full of what they typed.

**The star does two things and §5.1 is where they are settled.** It adds the patent to the founder's
starred set, and it makes *Find similar* available — which orders the rest by how close they are to
what was starred. No patent enters or leaves; only the sequence changes. A chip announces the settled
state, a second chip counts the starred set and links to it, and *Restore the original order* undoes
the ordering without unstarring anything.

**The ordering is a ranking, not a verdict.** A patent near the top is close to what the founder
described. It does not mean it affects them, and it does not mean the ones below it do not. No ranking
language may read as a verdict — *ranked by relevance* is an ordering; *strong match*, *best fit* and
*most relevant* are readings and stay out whatever number sits beside them.

### 4.4 · The grouping panel

The right column, while no record is open. A **fishbone**: the search at the spine, and branches
generated over the result set, each carrying a count.

**It is navigation, not analysis, and the distinction is the whole of why it survives.** It does not
tell the founder what the set means. It groups what came back so a set of two hundred can be walked
through in pieces, and selecting a branch **filters the list to that branch** — one selection, one
list, nothing redrawn. Selected branches appear as removable chips above the results with a running
count.

**It carries no caption and states no finding.** A sentence under it saying *most of this space is
X* would be exactly the reading `brief.md` §1 puts out of bounds, and the branch counts are already
on screen for a founder who wants to know.

**Two levels, and no more.** A third is a taxonomy, which is the authored artifact IPtech wants
before the first search and the thing a founder cannot produce.

**The taxonomy is generated after retrieval, so it cannot be shown before the search runs.** Below a
floor the panel says there are too few results to group rather than drawing two branches and implying
a structure. That floor is a property of the set, not an error.

**Its data is a separate request and a separate failure.** The list does not wait for it, and a
grouping that could not be generated leaves the results entirely usable, with its own sentence and
its own retry in the panel.

### 4.5 · The record, and where the drawings go

**A patent's record takes the left column, in the list's place.** The right column, which held the
grouping panel, becomes where a drawing is enlarged.

**The two columns divide by how hard you are looking.** The left is for glancing: the identifiers,
the abstract, the claims, and a strip of numbered thumbnails under them — everything needed to decide
whether this patent matters, in one scroll. The right is for when it does: one drawing, as large as
the column allows, with zoom, rotation and pan.

**That costs the list, and the record pays it back.** The founder loses sight of the results while a
record is open, so the record carries **previous and next patent** in its own head. Without them,
moving through a set means close, find your place, open — once per patent, and a founder comparing
five patents does it eight times.

It renders **the record, not an opinion about the record**: eleven identifiers, the abstract, the
claim set as published, and the drawings. A five-field handoff row — number, holder, where, status,
IPC — is a projection of the same fields, for the founder taking this to counsel.

**The enlarged drawing dims nothing and covers nothing.** [`design-language.md`](design-language.md) §3.2 has no scrim, and there is nothing to
dim: it opens in a column that was showing the grouping panel, beside a record that stays live. The
founder picks the next figure from the strip without closing the one they are looking at, which is
the arrangement's whole return.

**Every figure keeps its published number.** That number is what the claims refer to, and a
renumbered figure is a different document. The number is rendered at rest and raised on hover — a
caption that exists only under a pointer does not exist on a touch screen or to a keyboard.

**Zoom is a ladder, not a slider.** Seven stops, because a founder comparing two figures needs to
return to the same magnification and a continuous zoom cannot be returned to.

**Two absences, and the interface must not confuse them.** A record with no drawings says so in a
sentence. A record whose drawings Terrain declines to print renders numbered frames —
[`design-language.md`](design-language.md) §8's skeleton
contract in the shape a figure has, exactly as a withheld holder name is a bar. An empty strip where
drawings exist says a patent has none; a frame where none exist claims one is being withheld.

**What stays out**: plain-English decode, match highlighting, an IPC gloss, unread markers. Each is a
*reading* of the record rather than the record.

---

## 5 · Projects and the starred set

A project is the saved object: the sentence, the search settings it ran under, and the set that came
back. It takes its name from the founder's sentence.

**Returning to a project opens it straight away.** No search step, no rebuild, no progress bar.

**A founder who has never searched has no projects.** The switcher says what fills it rather than
rendering as a heading over nothing. An empty list that looks like a list which failed to load is the
same defect as a bar standing in for a value nobody withheld.

### 5.1 · Starring, and what it is for

**A star means *this one is close to what I meant*.** It does two things and they are separate acts,
which is why one of them is a button rather than a consequence:

- **It collects.** The starred set is the founder's own shortlist and it is the only thing in the
  product they curate by hand. It **survives a new search**, because the set is what they are taking
  out and clearing it on the next query would delete their work to save them a click.
- **It finds similar.** With at least one patent starred, *Find similar* re-orders the set by
  nearness to what was starred. **No patent enters or leaves; only the sequence changes**, and
  *Restore the original order* puts it back.

**That ordering is a ranking, not a verdict.** A patent near the top is close to what the founder
described. It does not mean it affects them, and the interface never says it does.

### 5.2 · The starred set leaves as data

The starred set has **its own surface**, reached from the count beside the results. It is where the
shortlist is read as a whole rather than one row at a time, and it is where the set leaves.

**It leaves as a CSV or a Markdown list, and as nothing else.** Both carry the fields already on
screen — number, title, holder, where, status, date, score — and neither carries a cover page, a
summary or a conclusion. `brief.md` §1 is the rule and the test is one question: **does the file
state anything the interface did not?** If it does, Terrain has written a report.

---

## 6 · The destinations

Four pages behind the chrome. Each has a back control that names **whatever the founder was doing
before they stepped off** — not a fixed label, and not a ring of account pages: a destination reached
from a destination does not become the way out.

### 6.1 · Points

What was spent, never what is paid. A balance ring against the quarter's allowance, a card per run
type, share bars, a per-day column chart with day / week / month grain, and a list of recent runs.

| Run | Costs |
| --- | --- |
| Search | 40 |
| Find similar | 4 |
| Export | 8 |

**These three are the run types that exist, and the figures beside them are illustrative.** Pricing is
unsettled — `brief.md` §6 carries it — and the plan screen prints `XXX` rather than guessing. What
this table is for is the *shape*: which acts move the meter at all.

**The open question the pivot forces is Export.** A charge on taking your own data out sits awkwardly
against `brief.md` §1's argument that the file is the founder's data leaving rather than our document
arriving — and the counter-argument is that an export is a run somebody pays Innovue for. It is
listed here because it is charged in `app/` today, not because it is settled.

**Changing the grain changes the resolution and never the denominator.** 91 days is 13 whole weeks and
three months, so all three grains divide it exactly and every one sums to the same total. There is
nothing to reconcile.

**Retrieving spends points; reading does not.** Opening a record, reading its drawings, sorting,
filtering, starring and paging are all free, however many times — they rearrange or reveal a set that
was already paid for. What costs is asking the engine a new question.

**A search is charged when it is submitted, not when it lands**, and returned if it does not land —
§7.2 carries the rule. The commitment used to be an approval step and the charge sat there; with the
approval gone, the button is the commitment.

*Find similar is charged, and §12 records that this is the one cost the interface has never agreed
with itself about.*

### 6.2 · Account settings

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

**Export is not here, and that is a placement rule rather than a refusal.** The starred set leaves
from its own surface (§5.2), where the founder can see the rows they are taking. An *Export my data*
row in settings hands over a file nobody looked at first.

### 6.3 · Plan & billing

What is paid, never what was spent. The plan's allowance and price, the payment method, a receipt
switch, and a list of invoices. One sentence links to the points page for the other half.

**The plan name is a bar and the price is `XXX`.** An allowance and a price are *figures*, and every
figure here is illustrative. A tier *name* is a taxonomy, and inventing Pro / Team / Enterprise would
put a tier structure nobody has decided into a public artifact. `XXX` means nobody has chosen a price
yet; a bar would mean a real value exists and is not ours to print. The two must not be conflated.

### 6.4 · Help

**Contact-first**, which is honest about a product with no documentation site. A topic menu, a message
field, and a sent state that *replaces* the form rather than sitting under it — a composer left on
screen beneath a confirmation invites a second send of the same message.

Then **Common questions**, in three groups — your search and your results, points and your plan,
your starred set. **Every answer says something no other surface states.** A Help page that hoovered
up labels would be restating the interface.

**The one that matters most is the one that says what a search is and is not.** A founder who reads
*no patents matched* has to be able to find out, on this page, that they searched an index over a
vocabulary at a moment — and that this is not the same as nothing existing.

The most important of the twelve is the one that says Terrain **cannot** tell a founder whether they
are free to file. That is a legal question and it is for a patent attorney.

---

## 7 · When it does not work

**A search crosses a network to an engine, and an engine that does not answer is not an edge case.**
Every wait in this product can end two ways. This section is the second way.

**The founder never loses what they wrote.** A failure returns them to the last point they could have
chosen differently — the search bar for a search, the field for a save, the composer for a message —
with what they typed still in it. Nothing here asks anyone to remember what they said.

**What failed is named, and the fix is the next thing in the sentence.** The message states the fix
rather than the fault, which is the rule the email field already follows. No blame, no *oops*, no
apology standing in for an instruction. Where there is nothing the founder can do, the message says
that instead of inventing an action.

**It is drawn in weight, not colour**, and [`design-language.md`](design-language.md) §7 carries the
treatment. The short reason: the one red this system has means *expired patent*, and it can be on a
chip the founder is reading on the same screen.

### 7.1 · A failure is the size of the region that was waiting

**Whatever was waiting is what fails.** A grouping that does not arrive leaves the results entirely
usable and says so in its own panel. A record that does not open leaves the list underneath it
untouched. Only a failure of the search itself takes the whole surface, because there is no surface
without it.

| What was waiting | What the founder sees | What survives |
|---|---|---|
| The search | The search bar, with the sentence still in it and Search offered again | The sentence, the settings, and the points, which are returned |
| The grouping, while the list stands | The panel alone, naming what did not arrive | The list, the record, everything else |
| The record | The column, with the row still selected | The list, and the starred set |
| A drawing | The figure frame, naming the one that did not load | The record, the strip, and the other figures |
| Find similar, a sort, a filter | The list as it was, and a sentence saying the order did not change | The order that was on screen, and every star |
| A page of results | The rows already loaded, untouched, and *Show more* offered again | Everything on screen |
| An export | **The file, which was already written** — see §5.2 | The starred set, and the balance if the ledger refused |
| A save | The field, still open, still holding the value | What was typed |
| A message | The form, not the sent state | The message and the topic |

**A region that fails keeps the height it reserved.** A wait that collapses into a short sentence
moves everything below it twice — once for the wait and once for the failure — and the second jump is
the one that loses the founder's place.

### 7.2 · Points

**The meter may not retain points for work that did not finish.**

**The charge lands on submit and is returned if the run does not.** Pressing Search is the last point
the founder could have chosen not to spend, so it is where the commitment belongs, and a balance that
moved only on success would leave the most expensive act in the product invisible while it ran. The
refund is what makes charging early honest rather than optimistic.

**Export inverts it, and the inversion is deliberate.** The file is built entirely in the client from
rows the founder already has, so it is handed over *first* and the ledger is called after. A refused
ledger call must not cost the founder their download — the bytes were never the engine's to withhold.

**The failure copy says the balance moved back**, because a founder watching a meter drop and a search
fail will otherwise assume they paid for nothing.

### 7.3 · When there are not enough points

**The arithmetic happens before the button, not after it.** A founder is never invited to run a search
that cannot be paid for, and the block is stated on the composer rather than discovered by pressing.

**The button is withheld, not hidden.** The sentence stays editable and the reason sits with the
control that is refusing, in the composer's status line. What it names is the shortfall and when the
allowance returns.

**The meter carries its own zero.** A balance at nothing is a state, not an absence, and it reads as
one rather than as a figure that failed to load.

### 7.4 · When the search finds nothing

**This is not a failure and may not be drawn as one.** The engine was asked a question and answered
it. The founder gets the answer they paid for, which is that nothing in the index they searched came
back close — and a run that finished keeps its charge under §7.2, however unwelcome the answer is.

**It is a result about the search, and the copy says so.** This is the one place in the product where
`brief.md` §1's test bites hardest: an empty result read as *nobody is here* is the exact claim
Terrain may never make, and a founder who has just spent points is the reader most likely to make it
for us. So the sentence names **what was searched** — the jurisdictions, the kinds, the date range —
offers the way back to the search bar, and stops. No *open ground*, no *whitespace*, no count of how
close it came.

**The settings are the way back, and they are already on screen.** A founder who searched one
jurisdiction and got nothing has a next move; one who is told only that nothing matched does not.

**The sentence stays in the bar.** Nothing about a search that returned nothing makes what the founder
typed wrong, and clearing the field would say it did.

**Search is withheld until something changes.** §7.3 blocks a run that cannot be paid for; this blocks
one that cannot come back different. The same sentence under the same settings returns nothing twice
and costs what the first one cost — so the button states why it is shut, and the two ways to change
the search, the sentence and the settings, are the two ways to open it.

---

## 8 · What is inert, and why

**One rule, not a list of exceptions.** Change password, delete account, change plan, both payment
updates, viewing an invoice, and sign out do nothing. Every one of them is an **act on an account**,
and there is no account model yet (§10). The three account pages are *about* an account; none of them
*authenticates* one.

**And the surface says so, once per place rather than once per control.** A control that looks live
and does nothing is worse than one that is absent, because the founder blames themselves for the
press that did nothing. Each is marked unavailable and kept focusable — the same treatment a field
tile that is not yet covered gets — and one sentence per surface names what is not ready.
Seven notices for one rule would make it read as seven separate faults.

What is live is everything that is pure client state: both inline edits, the switches, the appearance
control, the topic menu, and the message.

---

## 9 · What Terrain takes from IPtech

Innovue's IPtech is a Chinese-language patent landscape platform built for analysts, with 68 analysis
destinations across two map modules. **Innovue also ships PI-VuePat**, a semantic patent search
surface, and that is the product Terrain's flow is answerable to. Terrain is a tier of neither. This
section records what is adopted, what is cut, and why — so a later ask to Innovue does not start from
nothing.

**Adopted.** The search and classification chain; semantic retrieval from a plain-language sentence;
the search-settings vocabulary — jurisdiction and document kind as the index cross-product, a result
count, a date filter with a chosen basis; the generated grouping over a result set; the drawings and
their viewer. Name unification, family merge and legal-status resolution are taken as **hygiene the
founder never sees** — they are why the list can say *deduplicated by family* without asking anyone
to configure it.

**Cut, with reasons.**

| Cut | Why |
| --- | --- |
| **The entire analysis layer** | 68 destinations of charts, matrices and trend cuts. A founder does not run somebody else's analysis; the accurate set is the product. This is the pivot, and every row below is downstream of it. |
| The authored taxonomy | IPtech wants a taxonomy written before the first search. Terrain generates its grouping from the result set — this is the whole of what makes it operable by a founder. |
| Valuation (`價值通`) | A verdict on a patent's worth. Terrain does not issue verdicts. |
| Plain-English decode (`AI閱讀Pro`) | A paraphrase of the record rather than the record. |
| The landscape summary (`AI Insight`) | Same reason, at corpus scale. |
| An attorney handoff file | The starred set leaves as data (§5.2); a written-up handoff is the authored narrative `brief.md` §1 refuses. |
| The zone names (`地雷區` / `新興區` / `處女地帶`) | Minefield, emerging, virgin territory. They label absence, and a search result cannot carry a claim about what exists. |

**What Terrain adds that neither Innovue product has.** Their own surface has **no export of any
kind** — no CSV, no copy, no print, no multi-patent selection — and its only egress is one patent at
a time into another Innovue product. That is not an oversight; it is what a product does when it
wants you to stay. **A set the founder can leave with is the thing Terrain is for**, and it is the
hardest of its features for the incumbent to copy, because copying it cuts against why they built
the rest.

**The standing risk, and it is the same one it always was.** Nearest-neighbour retrieval is pointed
at **one patent** on their surface. Terrain's *Find similar* points it at a **starred set**, and that
capability is not confirmed. It is the first question in
[`../design/components.md`](../design/components.md) §4 and it is a product risk rather than a
detail: without it, the star collects and no longer finds.

---

## 10 · Not now

**Not a fence — an ordered list of things that are not being built yet, each with what would start
it.** Nothing here is prohibited; it is simply not next. Where an item is *decided against* rather than
postponed, it says so.

1. **Filing alerts** — *tell me when someone files near my idea.* This is the strongest recurring-
   value feature in the engine, and without it v1 launches with no subscription rationale beyond
   re-running searches: a founder searches, gets an answer, and has no reason to return next month.
   **Starts when:** pricing is decided, because pricing cannot be decided without it.
2. **Authentication and the session model.** Every *has the founder done X yet* test is currently a
   page-lifetime flag, so a reload starts the founder over and the real product will not. **The
   starred set makes this urgent rather than tidy** — it is the founder's own work, it survives a new
   search by decision, and it does not survive a refresh. **Starts when:** any surface has to survive
   a reload, which is now.
3. **Recent searches.** PI-VuePat keeps thirty in browser storage, capped and clearable. Cheap, and
   it makes a return visit mean something without an account. **Starts when:** item 2 settles whether
   this is local or server-side.
4. **Per-patent link-out** — *open this in the source database*. The source varies by jurisdiction, so
   the URL and its label have to come from the engine rather than be constructed by the interface.
   **Starts when:** Innovue answers question 3 in `components.md` §4.
5. **A patent package** — the starred set's drawings and PDFs as a zip. Distinct from the export
   already built, which is rows. **Starts when:** drawing and PDF URLs are available and CORS
   permits a client-side fetch, which is question 4.
6. **A standing jurisdiction + status filter** on the result list — *live only*, *US only*. Mechanical,
   and it answers the question a founder asks second. **Starts when:** the status vocabulary is
   widened; five real legal statuses currently collapse into two.
7. **An attorney handoff file** — the starred set written up as a document somebody could file
   against. **Decided against**, not postponed. The starred set leaves as data (§5.2); a written-up
   handoff is the authored narrative `brief.md` §1 draws the line at, and reopening it is an
   amendment to that lock.

---

## 11 · Invariants

**One survives, and nothing checks it.**

- Every invoice amount is the plan price — a plan that renews at one figure cannot bill four.

*Six others went with the analysis layer: they governed a matrix, per-holder series, origin sums,
legal splits, jurisdiction sums and a caption's quoted maximum, and none of those exist.
`tools/check-figures.mjs` enforced them on every push and was retired with them. A pass that changes
an illustrative figure in `demo/` now has nothing checking that the rest still agree, which is worth
knowing before changing one.*

---

## 12 · Open

- **Can nearest-neighbour retrieval be pointed at a result set rather than one patent?** Unconfirmed,
  and it is a product risk rather than a question — the star collects and finds similar, and without
  this it only collects. `components.md` §4 question 1.
- **Can a grouping be generated over a result set we supply?** §4.4 depends on it entirely.
- **What *Find similar* costs**, and whether *Export* should cost anything. §6.1 prices both; the
  interface has never agreed with itself about the first. *Free* follows from *retrieving spends
  points and reading does not* — it re-sequences a set already paid for and adds no patent to it.
  *Charged* follows from it being a real engine call, which a sort is not; but it makes the star a
  metered control, and nothing on the results surface says so.
- **Pricing.** The allowance, the price, and the tier structure are all open, which is why the plan
  screen prints `XXX` and a bar rather than guessing.
- **Does the starred set survive a reload, and where does it live?** It survives a new search by
  decision. It does not survive a refresh, because there is no persistence and no account — §10
  items 2 and 3.
- **How many results should a search return by default?** The settings ladder offers 10 · 20 · 50 ·
  100 · 500, and whether 500 is an engine ceiling or an interface one is unanswered.
- **Whether Terrain sits on Innovue's semantic search surface or beside it.**
- **Is the whole flow right?** Search → find similar → star → export has never been watched with a
  founder. The part most likely to be wrong is that the starred set is a place you go rather than
  something that accumulates visibly beside the list.
