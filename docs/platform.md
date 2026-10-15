# TIS Terrain — Platform

> **What gets built.** This document describes Terrain as it exists in [`app/`](../app/), which is
> the reference: where this document and `app/` disagree, the code is what was decided and this
> document is stale. Innovue's shipped build is the reference for type and text layout, and §13 says
> where that line sits. Run it with `python3 -m http.server 8765` from the repo root, then
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

**Two surfaces on the path, one collection surface, three destinations off the chrome.**

| | |
| --- | --- |
| **The home surface** | Where the founder picks a technology field and describes an idea. One composer, one button. |
| **The results surface** | The patents the search found down the left, with their drawings; whichever one you open on the right, with all of them. |
| **The starred set** | Everything the founder starred, read as a whole, and where it leaves as a file. |
| *Destinations* | Account settings · Plan & billing · Help. Reached from the masthead, returned from in place. |

A **surface** is somewhere the product happens. A **destination** is somewhere the founder steps off
to and comes back from. No moment routes through a destination, and nothing opens a new tab or a new
window anywhere in the product.

**A top masthead, not a sidebar.** Arithmetic, not taste. The two columns split a 1440px laptop
44/56 — 634 for the list, 806 for the record — and neither half survives a 260px rail: the result
list stops being readable under 340px, and the record's ten-field list wraps its values onto
second lines under about 600px, which a 260px rail would put it under at any window below ~1465.
Everything a rail would have carried is in the 56px bar: search history, the starred count, the
appearance control, the account menu.

---

## 2 · The four moments

| Moment | Surface | What is on screen |
| --- | --- | --- |
| 1 · First run | home | The field tiles, the composer, and the question above it. Nothing else. |
| 2 · What was found | results | The ranked patents fill the left column, and keep it. Nothing is approved and nothing is waited for beyond the one call. |
| 3 · Working | results | Sorting, grouping, starring, finding similar, reading a record, opening a drawing. The founder may stay here indefinitely and most of the product's value is spent here. |
| 4 · Leaving | starred set | The shortlist as a whole, and two buttons that write a file. |

**There is no confirm step and no build stream.** The search runs on submit. The reading, the five
narrowing questions, the priced gate and the staged build were four ports and are now none — a
founder who has to approve a paraphrase of their own sentence before anything happens is a founder
being asked to do the product's job.

**The commitment is pressing Search.** Nothing is approved before it and nothing is charged by it.

**Moment 4 is a moment and not a destination.** The starred set is where the product ends, so it is
on the path — reached from the count beside the results, and returned from to exactly the same list.

---


## 3 · The home surface

### 3.1 · The field tiles

The surface opens on **What are you building?** and a row of technology-field tiles. One is ready;
the rest carry a *Coming soon* badge **under the name, in flow** — a corner badge on a disabled tile
reads as decoration, and this one has to read as a reason. **The name and its badge are one group,
8px apart, and the icon sits 16px above them**: at 4px the badge touched the name and read as its
second line.

**The tiles and the composer are the closest pair of blocks on the page.** Choosing a field and
describing the idea are one decision, so the rhythm down the page is 10 · 20 · 40: label to tiles,
tiles to composer, and 40 either side of that pair.

**On a phone the tiles are one row that scrolls sideways**, each a compact tile with the icon beside
the name. Stacked two-across they were 400px of an 844px screen and put the composer below the fold.
The row has no scroll snap, and its last visible tile is cut by the screen edge, which is what says
there are more.

**A tile that is not ready is `aria-disabled`, not `disabled`.** It keeps its tab stop, so a founder
moving by keyboard finds out the field exists and is not yet covered, rather than finding nothing
there at all.

### 3.2 · One composer, one button

Below the tiles: one composer, and *Describe what you are building.* The field is inert until
something is typed. **A toggle at the toolbar's leading edge says what the box holds — *Text* or
*Patent number*** — and the placeholder and the field's accessible name change with it, so the engine
is never left to guess whether `EP2214203` is a description. The results bar carries the same toggle
on the same value. A number search opens on that patent's set with it first; a number the index does
not hold is answered in a sentence that names the number, with one action, *Search this as text*,
which runs the same words as a description (§7.2). It is an answer, not a failure. **The founder can drag it taller**, up to 320px, so a long description is not
read through a four-line window; it never grows by itself, because a box that grew while the founder
typed would move Search under the pointer. Enter runs the search; Shift+Enter breaks the line; an IME composition is
excluded, because a founder composing in any input method presses Enter to commit characters and
would otherwise search half a word.

**The primary action sits at the trailing edge of the composer's toolbar row.** The two things a
founder may do — search, or change what they typed — are one decision, so they are one zone: the
field and the button share an edge of one panel. Search settings sit at the leading edge of the same
row.

**The button is labelled `Search`, not an arrow.** It is the commitment; a glyph that means *send*
understates it.

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

**Selection is a tick, the label and the hairline, never a filled chip.** A chosen chip carries a
tick and an unchosen one carries none — not an empty box — so *on* is a shape and *off* is its
absence, and a chip keeps its width either way. Eight simultaneously filled accent chips read as data,
and `design-language.md` §3.8 gives the accent three sites, none of which is a set of options.

### 3.4 · The coverage block

What is in the corpus, and when each source was last taken in. One sentence of scope over a table
with **one row per source and two dates**: the latest grant and the latest application taken in. An
index that is not covered prints a dash rather than a bar, because it is absent rather than
withheld.

**It states what it does not know.** The number of documents per index is not on this surface,
because the engine does not emit it — and a coverage table that quietly omits its own size is a
coverage table a founder will assume is complete.

---

## 4 · The results surface

One screen. Moments 2 and 3 both happen on it without it ever being left, and the founder returns to
it from the starred set.

**Two columns, evenly split, and each means one thing.** The left carries the result list and never
gives it up; the right carries the record of whichever patent is open. The grouping is a popover
anchored to its own control, and an enlarged drawing is a lightbox over the viewport.

**Three panels in one frame, and each is frozen to its box.** The search bar, the list and the
record are peers: 16px to the window on all four sides, 32 between any two of them, one radius. Each
column holds exactly one panel that fills it, so a panel's head stays at the column's top edge and
only its body scrolls — both rounded ends are on screen at every scroll position. The list was the
odd one out until this held: its heading and its controls sat on ground above the panel and left on
the first gesture, so the founder lost what they were looking at and every control that changes it,
while the record beside them kept its head. A column whose identity scrolls away is a column that is
not a component, and two columns of equal standing cannot be one of each.

**The attribution is the surface's foot, under both columns.** It was the last thing in the right
column's scroller, which made the credit a tail on the record: the left column carried none and the
two columns ended at different heights. It also holds the fourth gutter — without it the window edge
cuts both panels' corners square.

**The search bar stays.** It sits above both columns with the founder's sentence still in it, so
changing the search is editing what is already there rather than navigating back to a blank one.
There is no pin control on it, because this surface does not scroll as a whole — a toggle that cannot
change anything is worse than a missing one. **It stays folded**, §4.2: one line, so the list starts
65px higher than it did under the open field.

**The search is in the address.** Every search writes what ran — the sentence, the field and the
mode — into the URL, and the open record adds itself. A reload, a link sent to a colleague, and Back
or Forward between two searches all bring the search back by running it again, with its record open;
a URL that names a record the first page does not hold opens the first result instead. **A search is
a step and a record is not**: each search is one entry in the browser's history, and reading five
records in a row rewrites the entry rather than adding five.

### 4.1 · The masthead

56px, full width, with a 24px inline inset and 12px between regions; six regions:

1. **The lockup** — the way home. It returns the founder to the working screen. It is **inert on the
   home surface**, both times it is reachable, and says so with `aria-disabled` rather than
   by going grey: a lockup that changes appearance by screen stops being a fixed point in the chrome.
2. **New search** — Lucide `zoom-in`, not `plus`. The plus said *new* and said nothing about what a
   new one is.
3. **History** — the searches the founder has run, newest first, §5.
4. **The starred count** — a button, and the way to the starred set (§5.2).
5. **The appearance control** — three states: light, dark, system. **It may not be demoted into the
   account menu at any width.** A second control over the same value elsewhere is not a demotion; a
   move is.
6. **The account menu** — Account settings, Plan & billing, Help, and Sign out, and the build at its
   foot, where support can read it without the build taking a region of the bar.

One region is protected by name: the appearance control.

**On a phone every region keeps its control and loses its words.** Below 720px the lockup is the
mark alone, New search and the switcher are their glyphs, the meters drop their units and the profile
its chevron, and the bar is one 48px row at 390px. Every dropped word is still the control's
accessible name. At 320px the bar wraps to a second row rather than hiding a region.

### 4.2 · The search bar

The founder's sentence, still editable, with the elapsed time and the match count beside it.

**It folds once a search has run.** The sentence moves onto the toolbar row, **two lines before it
truncates** — one line cut a long description to its first clause, which is the part descriptions of
the same kind of thing share — and pressing it opens the field with the caret at the end. **Leaving the composer folds it again only
if the sentence is still the one that ran** — an edit in progress is never folded away under the
founder; it waits for Search, which runs it and folds, or Escape, which puts the sentence back and
folds. Escape closes the thing the founder is in, so focusing the field lifts the composer above an
open record on the Escape stack, and a popover opened from the toolbar still closes before it.

**The technology field leads the row, as a chip.** It names the field the search runs in, so the
field is on screen beside what it returned, and it opens the list of fields to change it — the
ready ones chosen with a press, the rest listed and refused as their tiles are. Choosing one does not
search: the founder may want to change the sentence too, and Search is the commitment. It is the
same value as the home surface's tiles, and the bar sends it with every search.

Two controls sit on the same row, after the Text / Patent number toggle (§3.2):

1. **Search settings** — the same popover §3.3 describes, anchored here instead.
2. **Grouping** — opens the branch panel, §4.4, as a popover under this control.

**The view switch is the list's, and it sits in the list's head beside Sort** (§4.3): *Details and
drawings* shows every row as it is, *Drawings only* strips every row to its drawings, for a set being
scanned visually. Both decide what the column shows and neither changes what was searched, which is
why they left this row, where they were two more icon-only controls on the bar whose job is the
search. They govern the list and never the record: the record always shows everything, and a drawing
worth enlarging has the lightbox.

***Drawings only* refuses with a spoken reason when nothing in the set has a drawing**, rather than
emptying the list.

### 4.3 · The list

**The left column, and it never gives it up.** Half of the split, floored at 340px. It held the
record too until the record moved opposite it, swapping with it by display — which meant the founder
could read a patent or see the set it came from, never both. Reading one patent against the set is
one act, and one region that means two things by state is what that cost.

**Three bands a row, then the drawings.** Band one is identity, on two lines: an **eyebrow** carrying
the patent number at its leading edge, the position in the order and the engine's score together at
its trailing edge — and the **title on its own full width** below it. Band two is a 2×2
grid of who and when: the first inventor, the holder, the publication date, and a cell carrying the
jurisdiction and the main classification. Band three is the abstract, clamped to three lines. The
drawings are not a fourth band: a field is a value read *off* the patent, and a drawing is the
patent.

**The eyebrow is what lets the title be read.** With the number beside it on one line, a title that
wrapped began its second line at the title's own leading edge — indented past the number by the
number's width, declared nowhere and removable by nothing while the two shared a line. Freeing the
full column also bought a size step: measured over 100 corpus titles, one-line titles went from 33%
to 45% *at the larger size*, so the title reads bigger and wraps less.

**The score is inline at the eyebrow's trailing edge, not stacked above it.** Stacked, a scored row
stood 10.35px taller than an unscored one, so row height depended on what the engine returned.
Inline, the eyebrow is one height either way — the same invariant the scrolling drawing strip is
built on, and the row went from six possible heights to two.

**The position travels with it, and the eyebrow is two clusters rather than three positions.** What
the document *is* leads — the number, true of the patent wherever it was found. What the *query* made
of it trails — the position and the score, which exist only because this search ran and which change
when the sort does. A position sitting beside the identifier reads as a second fact about the patent,
and it is not one. They wrap together for the same reason
they sit together.

**A patent is often two documents, and the row shows one.** The application as published and the
grant carry different numbers and dates, so a patent with both carries a *Grant / Application* switch
at the eyebrow's trailing edge, and the number and the date beside it are the chosen document's. The
record opens on the same one, and switching while it is open turns the record over in place. **One
version is a word, not a switch**: a single filled segment reads as the pressed half of a switch with
its other half missing, so a patent the index holds once says *Grant* or *Application* in plain text.
A patent whose versions the engine did not return shows neither.

**The position always renders; the score may not.** There is no engine to withhold an ordinal. A
score the engine did not return takes its label with it and the cluster is the position alone.

**The row answers the glance, and four fields could not.** It carried the skim, the status, the
holder and the year, and a founder could not tell a corporate filing from a university one, or a
printing patent from a motor-control one, without opening the record — so the record was opened on
every row and the list read as a table of contents rather than as a result. What changed is not how
many facts a row may assert; it is which surface answers the glance. **The cost is stated rather
than hidden**: the row measures about 370px against the old 176, so a 1000px column shows under
three results where it showed five. [`design-language.md`](design-language.md) §7 carries the
measurement.

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
two surfaces of the same colour, which white tiles on a white row are; and a fade would be white over
white in light and a near-black wipe over a white drawing in dark, because `--figure-ground` does not
swap — invisible where it is needed and loudest where it is not.
[`design-language.md`](design-language.md) §7 carries the measurement. There is no scroll snap,
because snapping resolves every rest position flush and deletes the affordance.

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

**Bar** — Sort (Relevance · Newest filed · Oldest filed), the view switch (§4.2), and after *Find
similar* the chip naming what the set is ordered by and **Restore the original order**. **There is no filter**: the one it had
was legal status, which Terrain does not print (§13, R1-17). *Find similar* itself is in the record's
head, §5.1. The heading's two-count form is
`100 matched · 20 shown`: the noun is the subject of every row beneath it, and dropping it is what
buys the slot.

**Rows** — each carries the patent's identity and the engine's relevance score on the right. Twenty rows, then a foot that says how many are left and offers `Show more`.

**The reading loop is one hand.** With focus in either column, `j` and `k` open the next and previous
patent — focus moves to its row and stays on the list, so the next press is one key away — the arrow
keys move between rows without opening them, `]` and `[` step the open record, and `s` stars the
patent under focus, or the open record's. **They are scoped**, because a single-character shortcut
that fires anywhere fires into speech input and into a founder who never knew it existed: never in a
text field, never with a modifier, never over a menu, a popover or a drawing. Help lists them, §6.3.

**A score the engine did not return is omitted, not barred**, and it is the one field on the row
where `null` does not mean the skeleton. A bar says *this value exists and we decline to print it*;
the engine produced no score at all, so a bar would claim something untrue about it, and a label over
an empty space is a broken component rather than a withheld value. **The label goes with the value or
neither goes** — the word *Score* alone over nothing is what this rule was written against. `corpus/`
returns no score on any record, so the row prints none; `?data=demo` is where the field can be seen.

**Arranging the list is a request.** Twenty rows arrive at a time and *Show more* asks the engine for
the next twenty, so the client never holds the whole result set. A sort re-sequences it at the engine
and hands back a different first page; a facet asks which patents answer to it. Both wait, both can
fail, and §7.1 says what the founder sees when they do.

**Sorting and grouping change what the founder is looking at, never what was searched.** The set is
fixed by the sentence and the search settings; everything on this bar rearranges it. A founder who
wants a different set edits the sentence and searches again, and the bar above says so by staying
full of what they typed.

**The star collects and does nothing else**, §5.1. A chip beside the heading counts the starred set
and links to it. *Find similar* belongs to the open record: it orders the rest by how close they are
to that patent, a chip names the patent the order is by, and *Restore the original order* undoes it.

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

**After a search the first result's record opens by itself**, where the columns sit side by side.
The right column would otherwise say *pick a patent* beside a list that has already ranked one
first. Focus stays where the founder put it — they pressed Search, not the row — and below 1080px,
where the columns stack, nothing opens, because a record arriving there would push the list the
founder asked for below the fold. A sort, a grouping branch or *Show more* opens nothing: those are
the founder working the set they have.

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

**The record's title is the largest type in the pane.** It is `display-2`, 26/700, two steps above the
row's `title-s`: the row answers *which of these*, the record answers *this one*, and a row and the document
it opens set at one size is a page with no subject. **The pane is named for assistive technology
only** — *The patent record* is the head's `<h2>` and the focus target on open, visually hidden,
because an eyebrow over a 26px title that already says what the pane holds is chrome read first and
used never. **Drawings, Abstract and Claims are `title`**, 20/600, so the published document's sections
sit a clear step above its 16px prose and a step below the title, with the field labels in `micro`
a level under both.

**A long strip is capped.** Real records run to hundreds of figures; the strip shows two rows and a
control for the rest. The count in the heading is what states how many there are, so the control is
disclosure rather than a claim about the data.

**The two halves are even.** The record's ten-field list is the width-critical thing on the
surface and the list's four are not, which is what bought the record the wider half — and the
container query enforcing that width floor had never fired, so the share was protecting a constraint
that did not exist. With the floor working the record adapts its own field list and the split no
longer has to hold it up. [`design-language.md`](design-language.md) §7 carries the measurement and
the point at which the field list goes single-column.

**Previous and next survived the move on a narrower argument.** They were built because the record
ate the list and there was no other way through a set. The list is back, and they stay because
reading five in a row is otherwise five round trips to the column beside you while the founder's
eyes are on the record. **The list marks the open row**, which is what makes the pair legible rather
than a second navigation with no anchor.

**One scroller, and it is the panel's body.** The record used to be a contained scroll inside a
contained scroll — the card was forced to the column's height, so the column's own scroller never had
anything to scroll and 1,500px of claims overflowed one level further down, against a scrollbar 1px
from its own border. Moving the scroll out to the column's edge fixed that and cost the panel its
edges: the card grew to its content, so the record's rounded top and bottom left the frame the moment
anything moved. The scroller sits below the head now — inside the card, under the hairline, within
the padding. The card fills its column and it is three parts, the list panel's shape: a head, the scroller, and
a foot. *Previous*, *next* and *close* stay reachable through a long claim set because the head does
not move, and the three ways out stay reachable because the foot does not either.

**The ways out are pinned to the foot of the panel.** They sat after the last claim, which put them
about 3,000px down a patent with nineteen claims — off screen for nearly all the time a record was
open, so the founder scrolled to the end to take the patent out. The foot holds them in view at every
scroll position, under a hairline, and it is still the foot: the head carries what changes the set,
the foot what leaves with the patent. *Open in IPtech*, with a label rather than a bare glyph,
because it has a destination and an arrow alone says only *somewhere else*. **The
destination is a placeholder and is named as one**:
[`components.md`](../design/components.md) §4 question 3 is the real answer and it is still open —
the source varies by jurisdiction, so the engine has to return the URL *and* the label per patent.
Until it does, every record points at the same sign-in, which is honest about being a stand-in in a
way a constructed per-patent link would not be. *In the foot a placeholder sits at the quiet end of
the panel; in the head, beside the patent's own title, it was a placeholder at maximum prominence.*

**The record closes with what leaves, and the head carries what changes the set.** Five controls,
split by where the act lands rather than by how often it is pressed. *Star* and *Find similar* change
the founder's own set — one adds to the shortlist that leaves the product, the other re-orders the
column beside this one — so they sit in the head with the stepping pair, the other control here that
moves through the set rather than reading the record. *Open in IPtech*, *Copy citation* and *Export
this record* take the patent out, and they sit in the foot. **The foot is chrome and not a fourth
section of the patent** — Drawings, Abstract and Claims are the published
document, and a fourth heading in the same grammar would claim these belong to it. The divider is the
same rule the identity block closes with, so the patent is bracketed between two identical hairlines
and everything between them is the document.

**The patent stays named while it scrolls.** Once the title has scrolled out of the panel, the head
shows the number and the title on one line, truncated, in the space between its heading and its
controls — so a founder deep in the claims can see which patent this is, and the head gains no
height to say so.

**It is one star, not a second one.** The head's star is the row's star with a label on it: the same
class, the same `data-star`, the same delegated handler, because the thing that paints them writes to
every star in the document and never knew where they were.

It renders **the record, not an opinion about the record**: ten identifiers, the abstract, the
claim set as published, and the drawings. **The citation is the payload of *Copy citation* rather
than a block on screen**: the number with its kind code, the title, the holder, the publication date
and the jurisdiction as its code — `US 12,984,117 B2 · Foldable quadrotor airframe … · ACME Group ·
2019-05-10 · US`, the demo's fictional patent. The kind code because a grant and its application are two documents, the date because a
citation without one does not say which state of the document it means. Printing them again at the
foot of a record that has just printed all ten is the repetition the *Classes* rule refuses one
paragraph down; its stated purpose is the founder taking this to counsel, which is something that
**leaves**. The closing block names the fields it copies where the founder is standing when they
press it — **behind one control rather than standing open**. It was a paragraph under the row, read
in full every time a record opened, saying the same thing about every patent. `design-language.md` is
the rule: a narrow column has room for the reading or for prose about the reading, and every sentence
that is not the reading lives behind one control.

**The record prints the score the row printed.** It is the search's number rather than the patent's,
so it sits on the meta line under the title rather than among the ten identifiers, and it is
read from the row rather than added to the record contract — the same patent fetched from a different
query has a different one, and fetched from no query has none.

**As published does not mean twice.** Claim text arrives carrying its own number — *1. A method of…*
— and the claim list prints a number in its gutter, so both appeared. The leading number is removed
**only where it agrees with the position the gutter is about to print**; where they disagree, both
stay, because a claim set that does not start at 1 is telling the reader something. The same rule
governs *Classes*, which lists the classifications **other than** the main one: the main symbol
already has its own row above, and a reader who sees it twice looks for the difference.

**The enlarged drawing is a panel over a scrim, and it has two sizes.** It filled the right column
until the record moved into that column — where filling it would cover the text the drawing is read
against, which is the arrangement the column version existed to avoid. The left column would give a
technical drawing 44% of the window, and reference numerals are what a founder enlarges a drawing
*for*.

**It opens sized to the plate rather than to the screen.** Taking the whole viewport less a gutter
made it the page rather than a panel on the page, and a patent drawing is a portrait plate, so most
of that width went to empty ground either side of it while the scrim was reduced to a frame nobody
reads as one. It opens at a size the drawing fills, with enough scrim left to say the page is still
behind it.

**Full bleed is reached from inside it, and it is the page's own.** *Fill the screen* drops the
panel's two maxima and the viewer's padding, so the drawing fills the viewport the lightbox already
covers. It was the browser's Fullscreen API, which meant a control inside a drawing changed what
application the founder appeared to be running — the tab strip and the OS chrome went, and Escape
left fullscreen instead of closing the drawing. A founder reading a dense schematic asks for a bigger
drawing; a founder glancing at a thumbnail does not, and the default serves the second one.

**A drawing in a result row opens the same panel, and nothing opens on hover.** A hover preview
existed and is withdrawn: it was a third way to see a drawing, available only to a mouse, in a
product whose other two work for everyone. Pressing a row's tile opens the record at that figure and
the panel over it — the row carries small renditions of the first twelve and the panel needs the
published plate, so the record fetch is where the drawing comes from rather than a detour around it.

**So it is the product's one scrim, one `position:fixed` node and one focus trap**, and each of
those rules is narrowed rather than repealed —
[`design-language.md`](design-language.md) §3.2 anticipated exactly this, closing with *a dimming
layer would arrive with whatever first needs one*. The page behind goes `inert` for the length of
it: a cover the pointer cannot reach and the tab key can is an interface lying about what is
reachable. Escape closes the drawing and leaves the record open, and **so does a press on the scrim**
— both ends of it on the scrim, so a pan released past the panel's edge is not taken for a request to
leave.

**The head names the patent as well as the figure.** The record's number and title sit beside
*Figure N of M*, because once the scrim dims the record, a figure count is a position in nothing. On
a phone the title goes and the number stays.

**Every figure keeps its published number.** That number is what the claims refer to, and a
renumbered figure is a different document. The number is rendered at rest and raised on hover — a
caption that exists only under a pointer does not exist on a touch screen or to a keyboard.

**The buttons climb a ladder; the hands zoom freely between its ends.** The zoom buttons and the
`+` `−` `0` keys step seven stops from 50% to 400%, because a founder comparing two figures needs to
land on the same magnification twice. A wheel notch, a trackpad pinch, two fingers and a double press
all say *this much, here*, and snapping them to the ladder throws away both the amount and the place —
so they zoom continuously within the same ends, **about the point under the cursor or between the
fingers**, and the bar prints the exact level so it can be returned to. The next button press lands
on the next stop.

**Rotation is a quarter turn either way**, so a drawing published sideways is turned back the short
way, and *Reset the view* returns rotation, zoom and pan together.

**The drawing cannot be lost off the stage.** Pan is bounded by the drawing's own edge at the current
scale; below 100% it is held at the centre. On touch, one finger at 100% or less swipes to the
neighbouring drawing, and two taps toggle 100% and 200%.

**Paging crossfades, and the neighbours are already fetched.** The outgoing drawing fades while the
incoming one arrives; a slow one shows the loader after a beat, and one that fails says so on the
stage rather than leaving white paper that reads as a blank plate.

**The strip survives a phone.** It shrinks to 44px thumbnails rather than going: a 347-drawing patent
with no strip is 199 swipes to drawing 200.

**Two absences, and the interface must not confuse them.** A record with no drawings says so in a
sentence. A record whose drawings Terrain declines to print renders numbered frames —
[`design-language.md`](design-language.md) §8's skeleton
contract in the shape a figure has, exactly as a withheld holder name is a bar. An empty strip where
drawings exist says a patent has none; a frame where none exist claims one is being withheld.

**What stays out**: plain-English decode, match highlighting, an IPC gloss, unread markers. Each is a
*reading* of the record rather than the record.

---

## 5 · History and the starred set

**History is the searches the founder has run, newest first**, behind the masthead's *History*
button. Each entry is the sentence, the date, the field it ran in, and *Patent number* when it was a
number search; pressing one runs it again through the home composer, so it lands exactly as a new
search does and moves to the top. Each entry can be removed on its own and the whole list cleared.
Running the same sentence in the same field and mode again moves it up rather than adding a line, and
the list keeps thirty.

**It replaces projects.** A project was a saved object with a name and a switcher, and nothing the
founder did ever made one — the switcher listed what the engine returned. What a founder coming back
wants is the search they ran last week, one press from running again.

**It is kept in the browser, as the starred set is**, so it survives a reload and asks the engine
for nothing. That is the same floor and the same limit as §5.1's: one browser on one machine, and §10
item 2 is what an account adds.

**An empty history says what fills it.** *No searches yet*, and that each one is kept here — never
rows of bars, because a bar is a value withheld and an empty history has none.

### 5.1 · Starring, and what it is for

**A star means *this one is worth taking out*, and it is a collection.** The starred set is the
founder's own shortlist and it is the only thing in the product they curate by hand. It **survives a
new search**, because the set is what they are taking out and clearing it on the next query would
delete their work to save them a click. **It survives a reload for the same reason**, in browser
storage: a refresh is not a decision the founder made about their shortlist. That is a floor rather
than the session model — one browser on one machine, and §10 item 2 is what an account adds. Each
starred patent remembers the search it was starred under, §5.2.

**Find similar is the open record's, and it does not star it.** It sends that one patent as the
anchor and re-orders the set by nearness to it. **No patent enters or leaves; only the sequence
changes**, and *Restore the original order* puts it back. A founder who wants more like *this* has
not necessarily decided it belongs in the set they are taking out, which is why the two are separate
acts on separate controls. **The chip says what the order is by** — *Nearest to* and the patent's
number. **So does every row**: its score reads *Nearness*, from the engine's `nearness`, and the
open patent's row says *This patent* rather than a 1.0000 that reads as the best match. Without
`nearness` the rows print no score, because relevance down a nearness order reads as its reason.
The ranks are renumbered to the order on screen. **The wait is on the button that was pressed and the failure is said from the list**, which
is where the change would have happened.

**That ordering is a ranking, not a verdict.** A patent near the top is close to what the founder
described. It does not mean it affects them, and the interface never says it does.

### 5.2 · The starred set leaves as data

The starred set has **its own surface**, reached from a standing count in the masthead and from the
count beside the results. It is where the shortlist is read as a whole rather than one row at a time,
and it is where the set leaves.

**The masthead count shows at nought, and that is the point.** The contextual chip beside the results
appears only once something is starred, so the page explaining what starring is for was reachable
only by a founder who had already worked it out. A count that is visibly empty is what makes filling
it obvious, and it is the difference between the set being somewhere you go and something you watch
accumulate.

**It is a table, because a shortlist is the one collection here that gets compared.** It was a list
of title-led rows with a meta line that flowed — holder, jurisdiction, year and score packed to the
trailing edge in whatever order they fitted — so no two rows put the same fact at the same place and
the set could not be read down a column. A founder deciding which of twelve matters reads one field
down twelve rows, not twelve fields across one. Fixed columns, a header row that names them, and a
long value truncates rather than widening its column and dragging the rest sideways. It takes the
full width of the surface inside the same 16px gutter the results surface uses; the two sentences
around it keep a reading measure of their own, because those are prose and the table is not.

**It is grouped by the search each patent was starred under, most recent search first.** A shortlist
built across three searches is three questions, and reading it as one undifferentiated list loses
which question each answer belongs to. Inside a group the order is the order they were starred,
which is the only order the set has.

**That means a star is stamped when it happens.** Nothing afterwards knows which search a row came
from, so the store records the **query that ran** — not what is in the search box at the moment the
star is pressed, because the founder can edit that sentence without searching again. The stored row
carries two fields of the store's own beside the engine's, and they are named so they read as ours.

**Every column the file carries is on the row above it.** The page tells the founder the files carry
the same fields as the rows, so a field that leaves in the file without appearing on screen is the
one thing `brief.md` §1's test is about. The row shows all seven.

**It leaves as a CSV or a Markdown list, and as nothing else.** Both carry the fields already on
screen — number, title, holder, where, date, score, and the search it was starred under —
and neither carries a cover page, a summary or a conclusion. The CSV carries the search as a column;
the Markdown has no columns, so it carries it as a heading per search, in the order the page shows
them. One grouping function feeds both, because two would be two chances for the file and the screen
to disagree about the order of the founder's own work. `brief.md` §1 is the rule and the test is one
question: **does the file state anything the interface did not?** If it does, Terrain has written a
report.

**The two buttons sit in the page's head and name the format** — *Download CSV* and *Download
Markdown*, both secondary, at the trailing end of the title's line. They act on the whole set, so
they belong to the heading that names it rather than to a row of their own above the table. **The
pressed button says *Downloaded* for a moment**, keeping its accessible name: a download has no
screen of its own, and the page it was pressed on otherwise looks exactly as it did. The live region
says it once.

**One record can leave on its own, through the same two builders.** The record's closing block offers
the same CSV and Markdown for the patent being read, and it reads the **row** rather than the record
— which is why the row carries `number` and `where` it does not draw. One record must not grow a
third opinion about what a row contains, and a file of one must not carry different fields from the
set it came out of. Neither file reaches the engine: every byte is already in the client.

---

## 6 · The destinations

Three pages behind the chrome. Each has a back control that names **whatever the founder was doing
before they stepped off** — not a fixed label, and not a ring of account pages: a destination reached
from a destination does not become the way out.

### 6.1 · Account settings

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

### 6.2 · Plan & billing

What is paid. The plan and its price, the payment method, a receipt switch, and a list of invoices.

**The plan name is a bar and the price is `XXX`.** A price is a *figure*, and every figure here is
illustrative. A tier *name* is a taxonomy, and inventing Pro / Team / Enterprise would
put a tier structure nobody has decided into a public artifact. `XXX` means nobody has chosen a price
yet; a bar would mean a real value exists and is not ours to print. The two must not be conflated.

### 6.3 · Help

**Contact-first**, which is honest about a product with no documentation site. A topic menu, a message
field, and a sent state that *replaces* the form rather than sitting under it — a composer left on
screen beneath a confirmation invites a second send of the same message.

Then **Common questions**, in three groups — your search and your results, working by keyboard, your
starred set. The keyboard group is the one place the shortcuts are written
down, and it says where they work as well as what they do. **Every answer says something no other surface states.** A Help page that hoovered
up labels would be restating the interface.

**The one that matters most is the one that says what a search is and is not.** A founder who reads
*no patents matched* has to be able to find out, on this page, that they searched an index over a
vocabulary at a moment — and that this is not the same as nothing existing.

The most important of the eleven is the one that says Terrain **cannot** tell a founder whether they
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
treatment. The short reason: Terrain has no hue, and a red would be the loudest thing on any screen it
reached.

### 7.1 · A failure is the size of the region that was waiting

**Whatever was waiting is what fails.** A grouping that does not arrive leaves the results entirely
usable and says so in its own panel. A record that does not open leaves the list underneath it
untouched. Only a failure of the search itself takes the whole surface, because there is no surface
without it.

| What was waiting | What the founder sees | What survives |
|---|---|---|
| The search | The search bar, with the sentence still in it and Search offered again | The sentence and the settings |
| The grouping, while the list stands | The panel alone, naming what did not arrive | The list, the record, everything else |
| The record | The column, with the row still selected | The list, and the starred set |
| A drawing | The figure frame, naming the one that did not load | The record, the strip, and the other figures |
| Find similar, a sort, a grouping branch | The list as it was, and a sentence saying the order did not change | The order that was on screen, and every star |
| A page of results | The rows already loaded, untouched, and *Show more* offered again | Everything on screen |
| A save | The field, still open, still holding the value | What was typed |
| A message | The form, not the sent state | The message and the topic |

**Every failure names the next move.** Where a retry exists it is the button; where none does, the
sentence says what still works — *the other patents in your results still open* — because a failure
that offers nothing reads as the product being stuck. **And a failure is on screen, not only spoken**:
a search run again from the results bar that does not run says so in a line under the bar, and that
the list below is from the last search, rather than only to the live region.

**A region that fails keeps the height it reserved.** A wait that collapses into a short sentence
moves everything below it twice — once for the wait and once for the failure — and the second jump is
the one that loses the founder's place.

### 7.2 · When the search finds nothing

**This is not a failure and may not be drawn as one.** The engine was asked a question and answered
it. **It answers with nothing when nothing clears its relevance floor**, rather than with the fifty
least distant patents in the index: a nonsense sentence or one from another field would otherwise
return a full list that looks exactly like a good set, which is the one result a founder cannot
tell is wrong. The founder gets an answer, which is that nothing in the index they searched came back close.

**It is a result about the search, and the copy says so.** This is the one place in the product where
`brief.md` §1's test bites hardest: an empty result read as *nobody is here* is the exact claim
Terrain may never make, and a founder who has just searched is the reader most likely to make it for
us. So the sentence names **what was searched** — the jurisdictions, the kinds, the date range —
offers the way back to the search bar, and stops. No *open ground*, no *whitespace*, no count of how
close it came.

**The settings are the way back, and they are already on screen.** A founder who searched one
jurisdiction and got nothing has a next move; one who is told only that nothing matched does not.

**The sentence stays in the bar.** Nothing about a search that returned nothing makes what the founder
typed wrong, and clearing the field would say it did.

**Search is withheld until something changes.** The same sentence under the same settings returns
nothing twice, so the button states why it is shut, and the two ways to change the search, the
sentence and the settings, are the two ways to open it.

**A number the index does not hold is the same kind of answer.** `search` returns `NOT_FOUND` for it,
not a failure, and the status line under the bar names the number in the figure face, says to check
the office code and the number, and offers one action: *Search this as text*, which switches the
mode and runs the same words as a description.

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
their viewer. Name unification and family merge are taken as **hygiene the founder never sees** — they are why the list can say *deduplicated by family* without asking anyone
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

**Find similar is the primitive they already ship.** Nearest-neighbour retrieval is pointed at **one
patent** on their surface, and Terrain's *Find similar* points it at the open record — one patent too.
The risk this section used to carry, a set as the anchor, left with the star's second job.

---

## 10 · Not now

**Not a fence — an ordered list of things that are not being built yet, each with what would start
it.** Nothing here is prohibited; it is simply not next. Where an item is *decided against* rather than
postponed, it says so.

1. **Filing alerts** — *tell me when someone files near my idea.* This is the strongest recurring-
   value feature in the engine, and without it v1 launches with no subscription rationale beyond
   re-running searches: a founder searches, gets an answer, and has no reason to return next month.
   **Starts when:** pricing is decided, because pricing cannot be decided without it.
2. **Authentication and the session model.** Every *has the founder done X yet* test is a
   page-lifetime flag, so a reload starts the founder over and the real product will not. **The
   starred set no longer waits on this** — it is stored in the browser and survives a reload on its
   own (§5.1), which was the one case that actually lost work. What is still ahead is everything an
   account buys that a browser cannot: the same set on a second machine, a set that survives cleared
   site data, and a set that is the founder's rather than the browser's. **Starts when:** the founder
   is expected to be the same person on two devices.
3. **Per-patent link-out** — *open this in the source database*. The source varies by jurisdiction, so
   the URL and its label have to come from the engine rather than be constructed by the interface.
   **Starts when:** Innovue answers question 3 in `components.md` §4.
4. **A patent package** — the starred set's drawings and PDFs as a zip. Distinct from the export
   already built, which is rows. **Starts when:** drawing and PDF URLs are available and CORS
   permits a client-side fetch, which is question 4.
5. **A standing jurisdiction filter** on the result list — *US only*. Mechanical, and it answers the
   question a founder asks second. **Starts when:** every row prints its jurisdiction as a code
   (R1-13), so the filter can be checked against what is on screen.
6. **An attorney handoff file** — the starred set written up as a document somebody could file
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

- **Can a grouping be generated over a result set we supply?** §4.4 depends on it entirely.
- **Who supplies the per-patent "open this in the source" URL?** `components.md` §4 question 3. The
  source varies by jurisdiction — Google Patents, WebPat, TIPO — so the interface cannot construct
  it; the engine has to return the URL and the label together. **The affordance is built and its
  destination is a stand-in**, a single IPtech sign-in on every record. That is the one place in the
  product where a control points somewhere the data did not choose, and it is written into §4.5 so
  it cannot be mistaken for a decision.
- **Pricing.** The allowance, the price, and the tier structure are all open, which is why the plan
  screen prints `XXX` and a bar rather than guessing.
- **Where does the starred set live when the founder has two machines?** It survives a new search and
  a reload, the second in browser storage (§5.1). What it does not survive is a different browser,
  cleared site data, or being handed to a colleague — all of which need an account rather than a
  key. §10 item 2.
- **How many results should a search return by default?** The settings ladder offers 10 · 20 · 50 ·
  100 · 500, and whether 500 is an engine ceiling or an interface one is unanswered.
- **Whether Terrain sits on Innovue's semantic search surface or beside it.**
- **Is the whole flow right?** Search → find similar → star → export has never been watched with a
  founder. The part most likely to be wrong is that the starred set is a place you go rather than
  something that accumulates visibly beside the list.
- **Does their engine return legal status at all?** Terrain no longer prints it (§13, item R1-17),
  so this is no longer a display question. It still bears on family merge and name unification, which
  §9 takes as hygiene.
- **What limits a plan, if anything?** Terrain does not meter by points (§13, R1-20) and nothing on
  any surface counts what a search costs. Whether a plan caps searches, seats or nothing at all is
  open, and it is the same question as pricing.

---

## 13 · Rounds against Innovue's build

**Innovue builds Terrain from our handoff packages, on their own engine, and ships it at
`https://pi.innovue.ltd/ipcembedding/`.** A round compares their shipped build with what they were
given, settles every difference, and sends back only the differences. The procedure is the
`/terrain-round` skill in `.claude/skills/terrain-round/`. This section is what it decides against.

### 13.1 · Who is the reference for what

**`app/` is the reference for behaviour, flow and the engine contract. Their build is the reference
for type and text layout**, unless an item in §13.4 flags a component. Without the default, every
cosmetic difference stays technically open and gets reopened each round. **`app/` ports their type
and layout as each component is touched for another reason**, so over time the overlay captures and
`app/` captures compare like for like.

**The scope of a round is a UX and interaction review**: density and spacing, loading, empty and
failure states, dark mode, paging and scroll, and features that went missing. Font size, hierarchy
and text layout are out of scope unless the user flags one.

### 13.2 · How an item is shown

- **A problem in their build** (spacing, loading, dark mode) is fixed as an **overlay**: CSS, and
  script where needed, injected into their live page. Overlays live in `design/overlays/round-N/`
  and go into the package as the patch, because a rule written against their real markup loses
  nothing in translation.
- **A feature `app/` already has** (the star, the starred set, paging) is shown in `app/`. Nothing new
  is built.
- **New behaviour** is built in `app/`, settled here first like any other change.

### 13.3 · The package

**A delta, never a repeat.** They hold everything up to the last `handoff-*` tag, so a package
carries only what moved:

```
terrain-handoff-YYYY-MM-DD.zip
  README.md        where to start, and which file wins when two disagree
  CHANGES.md       the cards; everything else hangs off it
  CHECKLIST.md     every card's check, in the order of work
  TOKENS.md        app/'s tokens mapped to theirs
  MEASUREMENTS.md  every measured state, light and dark, linked from the cards
  images/          the captures the cards and measurements link
  contract/        OpenAPI and JSON Schema for the ports whose shape changed, examples, the diff
  code/            the app/ and demo/ files changed since the last tag, and the diffs
  docs/            design-language.md and components.md when they changed, and the diff
  overlays/        design/overlays/round-N/ as it stands, and apply.js, the whole patch
```

**The package carries the engineering documents and nothing else.** `brief.md` and `platform.md` are
ours: the cards carry what Innovue needs from them, in words written for an engineer.

**`CHANGES.md` has two parts, kept apart because they ask different things of the reader.**
**Part A, conformance**, is where their build differs from the package they were given. **Part B,
changes**, is what we changed since that tag. Both are grouped **by component**. Each component has
numbered cards (ID · restore / change / new / remove · current → wanted · why in one line · how to
check · contract change yes or no), one redline of the running surface, a spec table that states
every value as **the token and the measured pixels**, and **every state the component defines**:
default, hover, focus, selected, disabled, loading, failed, empty, light, dark, and the phone layout
where it differs. **Part A is written at the same depth as Part B**, because a feature they never
built is one the last package did not get across. Questions for Innovue close the document, each
tied to an item.

**The redlines are taken against the corpus, so the package prints real holder names** and goes to
Innovue only. It is never published.

### 13.4 · The current round

**Round 1, against their v1.0.21, captured 2026-10-14, from `handoff-2026-10-04`.** The list is
replaced when the next round opens.

**Part A · conformance**: the package they hold has these, and their build does not.

| ID | Component | Difference → wanted | Shown in |
| --- | --- | --- | --- |
| R1-01 | Result card, record | No star → a star on every card and in the record. **The star is a collection**: one starred set, each patent remembering the search it came from | `app/` |
| R1-02 | Starred set, masthead | No starred set, no starred count → the masthead count, the starred set page grouped by search, and its CSV and Markdown downloads. Without it nothing leaves but one record at a time | `app/` |
| R1-03 | Masthead | No account menu → the avatar menu: account settings, plan and billing, help, sign out, and the build at its foot | `app/` |
| R1-04 | Search settings | The date range is in their code and not rendered → render it, with its two bases, filed and published | `app/` |
| R1-05 | Result list | Every result in one endless scroll → 20, then *Show more*, which also lets drawings arrive sooner | `app/` |
| R1-06 | Engine · names and titles | The same company in two spellings, names and titles in capitals → titles in sentence case with acronyms kept; holders merged to one form as the company writes itself; inventors in normal case. Design-language §4 *Case* | Their captures |
| R1-25 | Landing · field tiles | The selected tile shares the disabled tiles' grey, so the other enabled tile reads as selected → selected white with the ink border, enabled white with the hairline, disabled grey with *Coming soon* | Overlay |
| R1-26 | Every control | Focus shows as a 1 px border change or not at all (the search box, the version), and drops to the page after *Search settings* → a 2 px ring on `:focus-visible` everywhere, the search box ringed whole; focus never falls to the page; a skip link first | Overlay |
| R1-27 | Result list | About 12 tab stops per card and no shortcuts → one stop per card, the drawings reached inside the record, `j` / `k` between results | `app/` |
| R1-28 | Record · export | *Export this record* produced no file in the audit, and nothing confirms one → the file downloads, and its name is confirmed the way *Citation copied* is | Their captures; `app/` |

**Part B · changes**: what we ask for that the package did not have.

| ID | Component | Difference → wanted | Shown in |
| --- | --- | --- | --- |
| R1-07 | Masthead, landing | Cramped → more room; at least 40 px above the landing headline; the version label leaves the masthead for the account menu | Overlay; `app/` too |
| R1-08 | Search bar, results bar | Cramped → more room; the view switch labelled or moved beside the sort; the query wraps to two lines before it truncates | Overlay; `app/` too |
| R1-09 | Results surface | The loading line sits flush on the two panels and reads as their border → no line there; the search box's own border pulses while the search runs, in their border and focus-border colours. A running search keeps the button's name and marks it busy, keeps the old results at full opacity, and one polite status region announces counts, *Citation copied*, regrouping and find similar | Overlay; `app/` too |
| R1-10 | Drawings | The drawing placeholder does not show in dark mode, so drawings below the fold arrive as blank white plates → visible in both themes. Every drawing tile is one skeleton while loading, a labelled failed tile with *Retry*, and absent when the patent has none | Overlay; `app/` too |
| R1-11 | Masthead | Projects → **search history**: a *History* button that opens past searches (query, field, date), each rerun by a click, deleted singly or cleared. Their build already stores history and shows it as a dropdown under the search box on focus; this makes it findable | `app/` |
| R1-12 | Search bar, masthead | The technology field sits in the nav → a chip at the start of the search bar, which opens the field list; it leaves the nav. The picked-group chip aligns to the card inset and shows its full label; the picked group is marked by a check, not a stripe, and the menu closes once it is picked | `app/` |
| R1-13 | Every surface | The case and separator rules in design-language §4 *Case*: `micro` the only uppercase, inventors and holders separated by `; `, generated group names in sentence case, jurisdictions as codes | Overlay; `app/` too |
| R1-29 | Address bar | A search never reaches the URL: Back shows a blank page, reload and forward land on an empty home → the query, field, mode and open record in the URL, so Back, reload and a shared link restore the search | `app/` |
| R1-30 | Engine · relevance | Nonsense and out-of-field text return 50 results that look like a good set → a relevance floor in the engine, and below it the empty state their build already has. It names what was searched and how to rephrase it, and never says what the set means (brief §1) | `app/` |
| R1-31 | Result card, record | The card and the record disagree about the holder, and the holder slot sometimes carries the inventors → one holder value from one source in both places; *No assignee listed* when there is none | Their captures; `app/` too |
| R1-32 | Engine · grouping | Group names change every run over the same set → cached per result set, so an unchanged set gets the same labels | Their captures |
| R1-33 | Find similar | The score is still called *Relevance*, and the open patent ranks first against itself at 1.0000 → the score reads *Nearness*, from the `nearness` that `rerank` returns, and the source card is marked *This patent* | Overlay; `app/` too |
| R1-34 | Record | *Open in IPtech*, *Copy citation* and *Export this record* sit after the last claim → pinned to the foot of the record panel, always in view | Overlay; `app/` too |
| R1-35 | Record · citation | The copied citation drops the kind code and every date → number with kind code · title · holder · publication date · jurisdiction code | `app/` |
| R1-36 | Result card | About 14 data points at near-equal weight → title, holder and one date carry the card; inventors collapse to the first and *+n*; the priority date moves to the record. **Flags the card** (§13.1) | Overlay |
| R1-37 | Record | The number and title scroll away → a compact sticky header with both once the title leaves view | Overlay; `app/` too |
| R1-38 | Type scale | Eleven sizes between 10.5 and 36 px, and the record's section headings barely above its reading text → their sizes merged into six steps, 11 · 13 · 16 · 20 · 26 · 36, each a role, heading weight descending with level. The two lower steps sit under 1.25 apart, because holding 1.25 there would put card meta at 11 px or the whole card at 14. **Flags the type scale** (§13.1); `app/` takes the reduced scale | Overlay; `app/` too |
| R1-39 | Patent-number search | *Patent not found* blames a TW prefix for a US number and drops the frame → the number echoed, the accepted forms named, *Search this as text* offered, both columns and the field control kept | Overlay; `app/` too |
| R1-40 | Every control | Targets under 24 px: Grant / Application, the patent number link, the version → at least 24 px, a pseudo-element extending the hit area where the visible size stays | Overlay |
| R1-41 | Results, record | No `<h1>` on results, and the record's title is not a heading → one `<h1>` per view, the record title a heading and its sections the level below | `app/` |
| R1-42 | Result card | A single-version record shows one filled *Grant* pill that reads as a pressed segment → plain text when only one version exists | Overlay; `app/` too |
| R1-44 | Error states | *Make sure the backend API is running.* reaches the founder → removed; the sentence says what the founder can do | Wording |
| R1-45 | Theme switch | Every coloured transition fires at once and the page smears → transitions off for one frame during the swap | Overlay (script); `app/` too |
| R1-46 | Search settings | Chips mark *on* with a filled square and show no *off* → a check when on, nothing when off | Overlay; `app/` too |
| R1-47 | Drawings viewer | The viewer's strip fetches every drawing again and shows placeholders, though the record behind it has already loaded them → the strip reuses the drawings the record holds, so it is full when the viewer opens | Their captures |

**Questions for Innovue**, each closing the package:

| ID | Question |
| --- | --- |
| R1-48 | Which patent-number forms does the lookup accept? `US9000581B2` and `US20130270686A1` are in the index and return *Patent not found*; `EP2214203A2` is found. R1-39's wording waits on the answer |
| R1-49 | Does the database hold English titles and abstracts for JP and CN records? Their build prints the original language in an English interface |

**Adopted from their build into `app/`**, not in the package. Each section that describes the old
behaviour is rewritten in the commit that changes `app/`, and so is every section a Part A or Part B
item marked *`app/` too* changes.

| ID | What `app/` takes |
| --- | --- |
| R1-14 | The Grant / Application switch on each card |
| R1-15 | The Text / Patent number toggle under the search box |
| R1-16 | A picked group shown as a removable chip above the list |
| R1-17 | **No legal status** — the status chip, the status filter and the CSV status column go |
| R1-18 | **Find similar from the patent open in the record**, not from the starred set |
| R1-19 | The coverage table with a grant date and an application date per jurisdiction |
| R1-20 | **No points** — the meter, the points page and run costs go. §12 holds what replaces them |
| R1-21 | The first result's record opens by itself after a search |
| R1-22 | The relevance score on every card |
| R1-23 | Rotate left and rotate right in the drawings viewer |
| R1-24 | A search box the founder can drag taller |

**Not raised:** their session recording; the card's patent number dropping its kind code; the class
code in the field label; the cards' double frame; two counts, search timing and four-decimal scores;
the *Nearest to* chip truncating its number; the abstract's measure; a `max-width` transition; and
*Granted patents* beside *Application*.
**Conformant:** the generated grouping, which §9 adopts, and the result card's hover state.
