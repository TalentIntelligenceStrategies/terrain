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
| **The results surface** | The patents the search found down the left, with their drawings; whichever one you open on the right, with all of them. |
| **The starred set** | Everything the founder starred, read as a whole, and where it leaves as a file. |
| *Destinations* | Points · Account settings · Plan & billing · Help. Reached from the masthead, returned from in place. |

A **surface** is somewhere the product happens. A **destination** is somewhere the founder steps off
to and comes back from. No moment routes through a destination, and nothing opens a new tab or a new
window anywhere in the product.

**A top masthead, not a sidebar.** Arithmetic, not taste. The two columns split a 1440px laptop
44/56 — 634 for the list, 806 for the record — and neither half survives a 260px rail: the result
list stops being readable under 340px, and the record's eleven-field list wraps its values onto
second lines under about 600px, which a 260px rail would put it under at any window below ~1465.
Everything a rail would have carried is in the 48px bar: the project switcher, the points balance, the
appearance control, the account menu.

---

## 2 · The four moments

| Moment | Surface | What is on screen |
| --- | --- | --- |
| 1 · First run | home | The field tiles, the composer, and the question above it. Nothing else. |
| 2 · What was found | results | The ranked patents fill the left column, and keep it. Nothing is approved and nothing is waited for beyond the one call. |
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

An **anchored popover**, not a modal — this product has no modal and no `<dialog>`, and its one
scrim and one focus trap belong to the enlarged drawing (§4.5). A panel that is none of those must
not pretend otherwise by dimming the page.

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

**Two columns, 44 / 56, and each means one thing.** The left carries the result list and never gives
it up; the right carries the record of whichever patent is open. The grouping is a popover anchored
to its own control, and an enlarged drawing is a lightbox over the viewport.

**The search bar stays.** It sits above both columns with the founder's sentence still in it, so
changing the search is editing what is already there rather than navigating back to a blank one.
There is no pin control on it, because this surface does not scroll as a whole — a toggle that cannot
change anything is worse than a missing one.

### 4.1 · The masthead

48px, full width, six regions:

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
2. **Grouping** — opens the branch panel, §4.4, as a popover under this control.
3. **Details and drawings** — every row as it is: title, status, holder, year, drawings.
4. **Drawings only** — every row stripped to its drawings, for a set being scanned visually.

**Toggles 3 and 4 govern the list, and that is a correction.** They governed the record, which made
a bar-wide control do nothing at all until a patent was open — and the control's own group label
reads *how much of each patent to show*, which is a claim about the set rather than about one of
them. The record always shows everything; a drawing worth enlarging has the lightbox.

***Drawings only* refuses with a spoken reason when nothing in the set has a drawing**, rather than
emptying the list.

### 4.3 · The list

**The left column, and it never gives it up.** 44% of the split, floored at 340px. It held the
record too until the record moved opposite it, swapping with it by display — which meant the founder
could read a patent or see the set it came from, never both. Reading one patent against the set is
one act, and one region that means two things by state is what that cost.

**Three bands a row, then the drawings.** Band one is identity — the number, the title, the
position in the order, and the score if the engine returned one. Band two is a 2×2 grid of who and
when: the first inventor, the holder, the publication date, and a cell carrying the status chip, the
jurisdiction and the main classification. Band three is the abstract, clamped to three lines. The
drawings are not a fourth band: a field is a value read *off* the patent, and a drawing is the
patent.

**The row answers the glance, and four fields could not.** It carried the skim, the status, the
holder and the year, and a founder could not tell a corporate filing from a university one, or a
printing patent from a motor-control one, without opening the record — so the record was opened on
every row and the list read as a table of contents rather than as a result. What changed is not how
many facts a row may assert; it is which surface answers the glance. **The cost is stated rather
than hidden**: the row measures about 300px against the old 176, so a 1000px column shows three
results where it showed five.

**The abstract is barred when it is withheld and absent when there is none**, which is the skeleton
contract in the one place on the row where the two are easy to confuse. Three lines rather than the
corpus's median nine, because three reaches past the boilerplate a patent abstract opens with and
into the clause that separates this one from the next.

**Twelve drawings at 72px, and the strip scrolls.** The number is the DOM's now rather than the
column's: twelve a row over twenty rows is 240 images, against a corpus patent that carries 347
figures. Twelve is also the record's cap, so the row and the record agree about how many drawings is
enough to judge a patent by. **The last tile is a `+N` control** — the patent's real total less what
the strip holds — and it opens the record; a patent whose figure count the engine did not return
draws no tile at all, because `+0` is a claim and a missing tile is not.

**A horizontal scroller answers the wrap rather than working around it.** The old four was derived
from the column's width on the premise that a strip which wraps makes row height depend on the data,
and that is the one thing a list you *scan* cannot have. Scrolling settles it outright: twelve
drawings or three, the row is the same height. 72px rather than the record's 104 still says
subordinate — 80 is where the step stops reading as one — and is enough to tell a circuit diagram
from a mechanical assembly, which is the whole of what a glance wants.

**What is off the end is shown by a cut tile**, not a shadow and not a fade. A shadow cannot separate
two surfaces of the same colour, which white tiles on a white row are, and
[`design-language.md`](design-language.md) §5 refuses one to anything in the layout; a fade would
need a scroll listener on twenty rows. There is no scroll snap, because snapping resolves every rest
position flush and deletes the affordance.

**They are controls now, and the row's own target is not one of them.** Each tile opens the record at
that drawing. **One tab stop per strip**, with the arrows moving inside it — twenty rows of twelve
would otherwise be 240 tab stops, and a keyboard founder would tab through the drawings of a patent
they had not decided to open.

**The strip sits outside the row's button, and that is correctness rather than layout.** A
drag-to-scroll that begins inside a `<button>` ends as a click on it, so every horizontal scroll
would have opened a record.

**A tile joins the record on the published figure number, never on its index.**
[`../design/components.md`](../design/components.md) §1 is explicit that the row's thumbnails and the
record's figures are two renditions the engine chooses independently, so nothing says the fourth
thumbnail is the fourth figure.

**Head** — what the search matched and how much of it is on screen, a star count once anything is
starred, and one info affordance. The count is printed once: a chip beside the heading repeating
`matched` as a bar said the same fact twice, once as a number and once as withheld. A narrow column
has room for the list or for prose about the list, and every sentence that is not the list lives
behind that control.

**Bar** — Sort (Relevance · Newest filed · Oldest filed), Filter (status and kind facets, with a
count), **Find similar** and **Restore the original order**. Find similar is the only filled control
on the surface and is hidden rather than disabled when nothing is starred.

**Rows** — each carries the patent's identity, a status chip, and the engine's relevance score on
the right. Twenty rows, then a foot that says how many are left and offers `Show more`.

**A score the engine did not return is omitted, not barred**, and it is the one field on the row
where `null` does not mean the skeleton. A bar says *this value exists and we decline to print it*;
the engine produced no score at all, so a bar would claim something untrue about it, and a label over
an empty space is a broken component rather than a withheld value. **The label goes with the value or
neither goes** — the word *Score* alone over nothing is what this rule was written against. `corpus/`
returns no score on any record, so the row prints none; `?data=demo` is where the field can be seen.

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

**A popover, anchored to its own control in the search bar.** A **fishbone**: the search at the
spine, and branches generated over the result set, each carrying a count.

**It owned the right column until the record took it**, and the three candidates were: let the
record cover it, move it above the list, or anchor it to its trigger. The first makes one region
mean three kinds of thing by state. The second costs the list vertical room at every width and
breaks where the columns stack. The third is width-independent, which is the property that decides
it — it survives the stack and the floor with no third region to place.

**Closing it hides nothing the founder decided.** The selected branches are chips *above the list*,
in the left column, so the cut stays on screen whether the tree is open or not. That is what makes a
popover affordable here and would not be true of a panel whose selection lived inside it.

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

**A patent's record takes the right column.** The left column is the list and stays the list.

**The two columns divide by how hard you are looking, and the division is between them rather than
inside one.** The left is for glancing: three bands a row and up to twelve drawings, with the
abstract clamped to three lines — enough to decide which patent to open. The right is for reading
the one you opened: every identifier, then **all** its drawings, then the abstract and the claims as
published. **The clamp is the division**: the left shows enough of the prose to choose by, and the
right is the only place it is whole.

**The drawings sit under the field panel, above the abstract, and that is the third position they
have had.** They were briefly last, under the whole claim set, on the reading that *under the text*
meant under all of it. Measured, that put them about 950px down a 1300px scroller: a founder who
opened a patent to see what it looks like scrolled past five to forty claims of legal prose and
mostly concluded there were no pictures. Ordering by what a patent is published in lost to ordering
by what the reader came for.

**A long strip is capped.** Real records run to hundreds of figures; the strip shows two rows and a
control for the rest. The count in the heading is what states how many there are, so the control is
disclosure rather than a claim about the data.

**The right column is the wider half**, 56% against the list's 44%, because the record's eleven-field
list is the width-critical thing on the surface and the list's four are not.
[`design-language.md`](design-language.md) §7 carries the measurement and the point at which the
field list goes single-column.

**Previous and next survived the move on a narrower argument.** They were built because the record
ate the list and there was no other way through a set. The list is back, and they stay because
reading five in a row is otherwise five round trips to the column beside you while the founder's
eyes are on the record. **The list marks the open row**, which is what makes the pair legible rather
than a second navigation with no anchor.

**The way out is a control in the record's head.** *Open in IPtech*, with a label rather than a bare
glyph, because it has a destination and an arrow alone says only *somewhere else*. **The
destination is a placeholder and is named as one**:
[`components.md`](../design/components.md) §4 question 3 is the real answer and it is still open —
the source varies by jurisdiction, so the engine has to return the URL *and* the label per patent.
Until it does, every record points at the same sign-in, which is honest about being a stand-in in a
way a constructed per-patent link would not be.

It renders **the record, not an opinion about the record**: eleven identifiers, the abstract, the
claim set as published, and the drawings. A five-field handoff row — number, holder, where, status,
IPC — is a projection of the same fields, for the founder taking this to counsel.

**As published does not mean twice.** Claim text arrives carrying its own number — *1. A method of…*
— and the claim list prints a number in its gutter, so both appeared. The leading number is removed
**only where it agrees with the position the gutter is about to print**; where they disagree, both
stay, because a claim set that does not start at 1 is telling the reader something. The same rule
governs *Classes*, which lists the classifications **other than** the main one: the main symbol
already has its own row above, and a reader who sees it twice looks for the difference.

**The enlarged drawing takes the viewport, over a scrim.** It filled the right column until the
record moved into that column — where filling it would cover the text the drawing is read against,
which is the arrangement the column version existed to avoid. The left column would give a technical
drawing 44% of the window, and reference numerals are what a founder enlarges a drawing *for*.

**So it is the product's one scrim, one `position:fixed` node and one focus trap**, and each of
those rules is narrowed rather than repealed —
[`design-language.md`](design-language.md) §3.2 anticipated exactly this, closing with *a dimming
layer would arrive with whatever first needs one*. The page behind goes `inert` for the length of
it: a cover the pointer cannot reach and the tab key can is an interface lying about what is
reachable. Escape closes the drawing and leaves the record open.

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
- **Who supplies the per-patent "open this in the source" URL?** `components.md` §4 question 3. The
  source varies by jurisdiction — Google Patents, WebPat, TIPO — so the interface cannot construct
  it; the engine has to return the URL and the label together. **The affordance is built and its
  destination is a stand-in**, a single IPtech sign-in on every record. That is the one place in the
  product where a control points somewhere the data did not choose, and it is written into §4.5 so
  it cannot be mistaken for a decision.
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
