# TIS Terrain — Platform

> **What gets built.** This document describes Terrain as it exists in [`app/`](../app/), which is
> the reference for everything: behaviour, flow, the engine contract, type and layout. `app/` is
> built from the round 4 detail lab (`visual-reference/innovue-build/round-4/detail-lab/`, V8), and
> where this document and `app/` disagree, the code is what was decided and this document is stale.
> Run it with `python3 -m http.server 8765` from the repo root, then `http://127.0.0.1:8765/app/`.
>
> **This is the specified product, and Innovue builds it.** Their build is what founders use; §13
> says how a round hands this over and lists where their build differs.
>
> Positioning (what Terrain is and who it is for) is [`brief.md`](brief.md). How it looks is
> [`design-language.md`](design-language.md). What the engine must return, per component, is
> [`../design/components.md`](../design/components.md).
>
> **Every figure here is illustrative.** No number is a real filing count. §11 says what is left to
> check, and nothing checks it.

---

## 1 · The shape

**Two surfaces, and nothing off the chrome.**

| | |
| --- | --- |
| **The home surface** | Where the founder picks a technology field and describes an idea, and reads what the database covers. One composer, one button. |
| **The results surface** | The patents the search found in the left panel, with their drawings; whichever one the founder opens in the right panel, with all of them. |

There is no starred set, no report, no account page, no billing page and no help page. **Every
surface serves the flow (`brief.md` §1), and a page that serves none is not built**: an account page
would carry acts on an account the product does not have, and a help page would repeat what the
interface already says where it is needed. Nothing opens a new tab or a new window, except *Open in
IPTECH* and a row's source link, which leave for another site by design.

**A top masthead, not a sidebar.** Arithmetic, not taste. The two panels split a 1440px laptop
evenly, and neither half survives a 260px rail: the result list stops being readable under about
340px, and the record's side panel needs its own 300px beside the prose. Everything a rail would
have carried is in the 56px bar: New, History, the appearance control and the version.

---

## 2 · The four moments

| Moment | Surface | What is on screen |
| --- | --- | --- |
| 1 · First run | home | The field tiles, the composer, the question above it, and the coverage below. |
| 2 · What was found | results | The search panel with the scope it ran over, the ranked patents in the left panel, and *Select a patent* in the right. |
| 3 · Working | results | Sorting, grouping by topic, reading a record, finding similar, opening a drawing. The founder may stay here indefinitely and most of the product's value is spent here. |
| 4 · Leaving | results | *Export this record* from the record, or *Export* from the end of the scope row (the list head below 640px), as CSV or Markdown. |

**There is no confirm step and no build stream.** The search runs on submit. A founder who has to
approve a paraphrase of their own sentence before anything happens is a founder being asked to do the
product's job.

**The commitment is pressing Search.** Nothing is approved before it and nothing is charged by it.

---

## 3 · The home surface

### 3.1 · The field tiles

The surface opens on **What are you building?** and a row of technology-field tiles. **The list
comes from the engine** (`fields`), and this document does not count how many are ready: that is the
engine's to say and it changes without a round. A tile is selected, ready, or not yet covered, and
one that is not yet covered carries a *Coming soon* badge **under the name, in flow**: a corner
badge on a disabled tile reads as decoration, and this one has to read as a reason.

**The tiles and the composer are the closest pair of blocks on the page.** Choosing a field and
describing the idea are one decision, so they sit closer to each other than to anything else.

**The home surface is Innovue's live home** (terrain.innovue.ltd), copied value for value: six field
cards, the composer, the coverage, the attribution, on a flat ground.

**On a phone the composer comes first and the tiles follow it as one row of 44px chips that scrolls
sideways**, each with the icon beside the name and *Coming soon* as plain text. Stacked two-across
they put the composer below the fold. The row has no scroll snap, and
its last visible tile is cut by the screen edge, which is what says there are more.

**A tile that is not ready is `aria-disabled`, not `disabled`.** It keeps its tab stop, so a founder
moving by keyboard finds out the field exists and is not yet covered, rather than finding nothing
there at all.

**A field is a scope, not only a label.** Innovue's roadshow deck states it: collections are built
per technology field, and a patent classified outside the chosen field is not searched, however close
it is. The interface prints the field's name and not its symbol, which is the vocabulary rule.
Innovue's stated direction is one index across all fields, with medical the next field added before
it; the tiles are built to take a field that becomes ready, and nothing in the interface dates either.

### 3.2 · One composer, one button

Below the tiles: one composer, Innovue's. The sentence in a box at least 56px tall, a count of what
it may hold (*0 / 5000*) under it, then a row: *Text / Patent number* (glyphs only on a phone), a
settings glyph that opens the search settings upward, and **Search** at the far end, 36px, quiet until
there is something to search.
**A *Text / Patent number* switch says what the box holds**, and the placeholder and the field's
accessible name change with it, so the engine is never left to guess whether `EP2214203` is a
description. The results surface carries the same switch on the same value. A number search opens on
that patent's set with it first; a number the index does not hold is answered in a sentence that
names the number, with one action, *Search this as text* (§7.2). Enter runs the search; Shift+Enter
breaks the line; an IME composition is excluded, because a founder composing in any input method
presses Enter to commit characters and would otherwise search half a word.

**The button is labelled `Search`, not an arrow.** It is the commitment; a glyph that means *send*
understates it. It is the surface's one filled button.

**Below the coverage, the foot of the page carries *Powered by Innovue*** (`brief.md` §3), the only
place in the product it appears.

### 3.3 · The search settings

An **anchored popover**, not a modal: this product has no modal and no `<dialog>`, and its scrims
belong to the enlarged drawing and to the phone's search sheet. A panel that is none of those must
not pretend otherwise by dimming the page.

It carries, in this order:

- **Technology field**, read-only: the field the search runs in, set on home (§4.2 says why it is not
  changed here).
- **Results to show**: 10 · 20 · 50 · 100 · 200.
- **Where to search**: the six offices, US · CN · TW · EP · KR · JP, by name.
- **Rerank**: Off or On, with one line saying what it changes. It asks the engine to re-score its
  top results with a second pass; the list stays the same set.
- **What to include**: grants and applications.
- **Dates**: a basis (Filed · Published · Priority) and an optional range whose bounds are each **a
  year or a full date**.

At least one office and one kind must stay selected, and the panel says so beside the last chip
rather than letting the founder produce a search that cannot run. **Done applies the draft; Reset
returns it to the defaults; closing the panel without Done discards it**, so a founder trying
combinations never runs a search they did not mean to.

**A bound is a year or a full date, because a practitioner's cutoff is a day.** Prior art is
measured against a filing date, so the useful range ends the day before it; a year either lets in
ten months that cannot be prior art (the patent's own family among them) or drops ten that can.
The field takes digits only and places the hyphens itself, so a phone keeps its number pad: four
digits are a year, eight are a date. A year as the upper bound means the end of that year and as
the lower bound its start. **A half-typed date searches as its year**, which widens the search
rather than narrowing it on something the founder did not finish.

**The date filter is applied before ranking, not after it.** Innovue states this, and it is what
makes the filter worth having for a practitioner: with the range ending the day before a filing
date, nothing filed later takes a place in the list. Copy says what the filter does (*filed before*
a date) and never that what remains *is* prior art.

**Priority is a basis, and a record without a priority date is outside a priority range.** Innovue's
build offers it and the priority date is often blank in their index, so the founder who chooses it
is choosing the field a practitioner measures against, with fewer records able to answer. The record
prints a missing priority date as a dash (§4.5), so the gap is visible rather than silent.

**The whole panel travels as one object** to the engine, not as loose arguments: the panel is the
only thing that builds it and the engine is the only thing that reads it, so a shape change is a
change in two places rather than in every call site.

**Selection is a tick, the label and the hairline, never a filled chip.** A chosen chip carries a
tick and an unchosen one carries none, so *on* is a shape and *off* is its absence, and a chip keeps
its width either way. Eight filled accent chips would read as data.

### 3.4 · The coverage block

What is in the database, and when each source was last taken in. One sentence of scope over a table
with **one row per source and two dates**: the latest grant and the latest application taken in. An
index that is not covered prints a dash, because it is absent rather than withheld.

**It states what it does not know.** The number of documents per index is not on this surface,
because the engine does not emit it, and a coverage table that quietly omits its own size is a
coverage table a founder will assume is complete.

---

## 4 · The results surface

One screen. Moments 2 to 4 all happen on it without it ever being left.

**Three panels: the search across the top, the list on the left, the record on the right.** Each is
a rounded panel on the slate ground, 16px from the window and 16px apart. The search panel holds its
height; the list and the record share the rest evenly, and each scrolls inside its own body, so
both heads stay on screen at every scroll position.

**The search is in the address.** Every search writes what ran (the sentence, the field and the
mode) into the URL, and the open record adds itself. A reload, a link sent to a colleague, and Back
or Forward between two searches all bring the search back by running it again, with its record open;
a URL that names a record the first page does not hold opens nothing. **A search is a step, and so
is whatever covers the thing before it**: each search is one entry in the browser's history, an
enlarged drawing is one more, and on a phone, where the record is a full screen over the list, so is
the record. Back closes the drawing and leaves the record open, and on a phone it closes the record
and leaves the list where it was. Where the record sits beside the list it covers nothing, so
reading five records in a row rewrites the entry rather than adding five.

### 4.1 · The masthead

56px, full width, with a 24px inline inset and a hairline along its foot, sitting on the page ground
rather than on a panel. **Every control in it is one recipe, Innovue's: 28px tall, a 13px label, a
14px glyph** (`design-language.md` §7), so the bar reads as chrome and the panels under it as the
work. Left to right:

1. **The lockup**: the TIS submark and *TIS Terrain*, the way home. It is **inert on the home
   surface**, and says so with `aria-disabled` rather than by going grey: a lockup that changes
   appearance by screen stops being a fixed point in the chrome.
2. **New**: the magnifier and the word. It returns to home with an empty composer.
3. **History**: the searches the founder has run, newest first (§5).
4. **The appearance control**: three segments, light, dark, system. **It may not be demoted into a
   menu at any width.**
5. **The version**: `v1.0.42`-style, in the figure face, quiet, with a dot while the build is new to
   this browser. It opens the release notes when there are any; it is how support reads the build.

**On a phone the bar is 56px, glyphs only.** The lockup is the mark alone, New and History are their
glyphs, and the appearance control is **one button that steps through light, dark and system**, its
glyph the state it is in: three segments at a 44px reach are 132px, which the bar does not have. It
is still the appearance control, in the bar, with the same three states, so it is not a demotion.
The version is not on the phone bar: it is a support detail with a desktop home. Every glyph is a
44px button, and every dropped word is still the control's accessible name.

### 4.2 · The search panel

**Two rows in one panel.** The first is the sentence, still editable, then the *Text / Patent number*
switch and **Search** at its trailing end. The second, under a hairline, is **the scope the search
ran over**, stated as labelled chips:

| Chip | What it says |
| --- | --- |
| Field | the technology field, by name |
| Offices | the office codes, `US · CN · TW · EP · KR · JP` |
| Documents | *Grants and applications*, or one of them |
| Dates | the basis and the range, or *any date* |
| Results | how many the search returns |

**Then the time the search took**, in the figure face, and **Search settings** and **Export** at the
row's end; below 640px, where this row is hidden, Export is a glyph in the list head. A
chip opens the settings; the field chip names the field and changes nothing. **The time clears while
a new search runs** and comes back with its answer, because the old figure is about a search that is
no longer the one on screen.

**Search is 36px, the same height as *Text / Patent number* beside it**, with a 15px label at 600;
its ink fill is what makes it the primary action.

**A running search shows no loader.** Search keeps its label at reduced ink and is busy to a screen
reader; the rows already listed stay, dimmed, until the new ones replace them. The answer appears
when it arrives, and nothing holds it back to make the wait legible (`design-language.md` §6).

**The sentence grows from one line to two and then scrolls**, and it cannot be dragged. Two lines
hold a founder's description at 18px without pushing the list down; a box the founder could drag
taller would take the list's height for the length of the session.

**The scope is stated, not edited in place.** Every chip says what ran, so a founder reading the list
can see what the list is an answer to without opening anything, and an edit happens in one place,
the settings, where Done is the commitment. This is what makes an empty result legible (§7.2): the
scope that produced it is on screen above it.

**The field is changed on home, not here.** A field is a different index (§3.1), and changing it is
starting a different search rather than adjusting this one: New is one press away.

**On a phone the search docks at the bottom of the screen**: the sentence and a Search glyph, over
the list, above the safe area. The switch and the scope chips are not on the dock; pressing the
sentence opens it upward as a sheet with the switch and the settings, over a scrim. The masthead and
the list head are pinned at the top, so the founder's thumb reaches the search and their eye reads
the list.

### 4.3 · The list

**The left panel, and it never gives it up.** Its head is pinned: **Search results** at 20px, an ⓘ
that says how the list is ordered and how many matched, and then the controls:

- **Details / Drawings**, a two-glyph switch: *Details* shows every row as it is; *Drawings* strips
  every row to its drawings, for a set being scanned visually. It refuses with a spoken reason when
  nothing in the set has a drawing.
- **Group by topic** (§4.4).
- **Sort**: *Relevance*, *Newest first*, *Oldest first*, the last two by published date.
- **Export results**: CSV or Markdown, the rows in the order on screen (§4.6).

After *Find similar* the head carries a tag, **Similar to US 12107086 B2**, with **Restore** beside
it, which puts the engine's order back. **The sort still reads *Relevance***: the order is still the
engine's and so is the score on every row; what changed is the patent it is measured from, and the tag
says so. Choosing *Relevance* from the menu is the same as Restore. Nothing else announces it: no
toast is laid over the rows to repeat what the tag already states.

**Every result is a card.** Top to bottom:

1. **The number line**: the patent number in the figure face, the kind and version as words
   (*Invention · Grant*), and a source-link glyph that opens the patent where it is published. At its
   trailing end, **two chips: the rank (`#1`) and the relevance score (`Relevance score 0.8862`)**.
   The rank chip is white; the score chip carries the silver edge (`design-language.md` §3.8).
2. **The title**, 18px, up to two lines.
3. **The facts**, under a hairline: *Holder* on a full row (a long holder takes its whole line and is
   never cut), then *Inventors* (the first, then `+n`), *Published* and *Class* (the main
   classification) in three columns, each under its field name in small capitals.
4. **The abstract**, clamped to three lines.
5. **The drawings**: up to eight tiles, 92px, in a strip that scrolls sideways.

**The rank and the score travel together and trail the number.** What the document *is* leads (the
number, true wherever it was found); what the *query* made of it trails (its place and the engine's
score, which exist only because this search ran). **The rank is the engine's place for the patent,
and it travels with the row when the list is sorted**, so *Newest first* reads as the same ranked set
in another order rather than a new ranking. *Find similar* is the same: each row keeps its rank and
its score, and the tag above the list says what the order is measured from.

**The score is the engine's, printed as it comes**, four decimals in the figure face (`brief.md`
§1). Copy never calls it a match quality; the ⓘ says the list is ordered by the engine's relevance
score and the number is that score. **The published corpus prints stand-in scores** that descend with
the rank (`brief.md` §4); an engine that returns no score leaves the row with the rank alone.

**The whole card opens its record**, by pointer, Enter or Space; the source link and the drawing
tiles are their own controls inside it. **The open row takes the accent border** (`brief.md` §5), so
the founder can see where they are in the list while they read the record beside it.

**The drawing strip scrolls and does not wrap.** Eight drawings or three, the row is the same height,
and that is the one thing a list you *scan* cannot do without. What is off the end is shown by a cut
tile, not a shadow or a fade: white tiles on a white row cannot be separated by a shadow, and a fade
would be a near-black wipe over a white drawing in dark. A tile opens the record at that drawing and
the viewer over it; a tile joins the record on the published figure number, never on its index.

**All the results are on the list at once.** The search returns as many as *Results* asks for, up to
200, and the list shows every one; there is no *Show more*. A founder who wants fewer asks for fewer.

**The keys.** There is no shortcuts control; the keys are the ones a founder already expects:

| Key | Does |
| --- | --- |
| ← → | the previous or next record, while one is open |
| Esc | closes the drawing, the popover or the record, innermost first |
| / | puts the caret in the sentence |
| Enter | runs the search, from the sentence |
| Shift+Enter | a new line in the sentence |

**They are scoped**, because a key that fires anywhere fires into a text field and into a founder who
never knew it existed: never in a text field (except Enter and Shift+Enter, which belong to it), never
with a modifier, never over a menu or a popover.

**Sorting and grouping change what the founder is looking at, never what was searched.** The set is
fixed by the sentence and the search settings; everything in the list head rearranges it.

**The ordering is a ranking, not a verdict.** A patent near the top is close to what the founder
described. It does not mean it affects them, and it does not mean the ones below it do not.

### 4.4 · Group by topic

**A popover from the list head**, listing the topics in the results: each is a CPC subclass, named in
CPC's own words where the records carry them (`H01L · Semiconductor devices`), with its count.
Choosing one **filters the list to that topic** and puts a removable tag above the list naming it;
removing the tag, or choosing *All results*, puts the list back.

**It is a view of the set, which is why it is admissible** (`brief.md` §1). Every group is the rows'
own main classification and every count can be checked against the rows; nothing is generated, and
the words are CPC's, not ours. One level, one topic at a time: a deeper tree is a taxonomy, which is
the authored artifact an analyst platform wants and a founder cannot produce.

**It carries no caption and states no finding.** A sentence under it saying *most of this set is X*
would be a reading, and the counts are already on screen for a founder who wants to know.

**It is built from the rows on the list**, so it asks the engine for nothing and cannot fail on its
own. A set too small to group (fewer than two topics) disables the control with a reason.

### 4.5 · The record

**A patent's record takes the right panel.** Until one is picked it says **Select a patent**, with one
sentence: *Its full record opens here: the drawings, the claims and every field, as published.*
**Nothing opens by itself after a search**: the founder pressed Search, not a row, and the first row
is the engine's choice of where to start, not theirs.

**Top to bottom:**

1. **Identity**: the number and the kind as an eyebrow (`US 12107086 B2 · Invention · Grant`), the
   title at 24px, the holder under it.
2. **The actions**, beside the identity on a wide panel and under it on a narrow one: **Find
   similar** (with the silver edge), **Export this record** (CSV or Markdown, a plain border), and
   **Open in IPTECH**, a quiet link with its glyph, beside Export.
3. **The facts row**, four cells under a hairline: **Legal status** (a word, with the expiry date
   where the record carries one), **Filed**, **Published**, **Where** (the office by name).
4. **Drawings**, with the count: the first drawing large, then eight more, then **Show all 22
   drawings**. Every tile opens the viewer.
5. **Abstract**, whole.
6. **Claims**, with the count: claim 1 whole, then **Show all 20 claims**. Claim 1 is the broadest and
   the one a founder reads first, so it leads by its place; it is set at the same size as the rest.
7. **The side panel**, beside the abstract and claims on a wide panel and after them on a narrow one:
   - **Parties**: the inventors, in two columns.
   - **Identifiers**: Number, Application, Kind (with its kind code), Priority.
   - **Classification**: the main class, then every class grouped by subclass, each group a
     disclosure with the subclass code, CPC's words for it and the count; the main class is at full
     ink inside its group. A note closes it: *As published. Class words are CPC's own, where the record
     carries them.*

**Every field the record defines is printed, and a field the record does not carry prints as a
dash.** Legal status, priority and the class words are the three most often missing; a dash says
*not in this record*, which is true, where leaving the slot out would make two records look
differently shaped for no reason the founder can see.

**The drawings come before the abstract**, because a founder opening a patent to see what it looks
like should not scroll past the claims to find out it has pictures. **The claims are behind one
press, and the abstract is not**: the abstract is the patent's own summary and short; twenty claims
of legal prose are the longest thing on the page, and claim 1 is what is read first.

**Closing and stepping.** On a wide panel the record has no head bar: a × in its top corner closes
it, and ← and → step to the previous and next result. The list's accent border is what makes the
step legible. **Find similar** orders the list by similarity to this patent (§4.3), and the record
stays open.

**The record is the lab's, value for value**: its actions and *Show all* are 44px with a 15px label
at 600, and claim 1 is set at 18 over the claims after it at 15.

**On a phone the record is a full screen over the list.** Its head is pinned: **Back**, the number,
and **previous** and **next**; once the title has scrolled away the head names the patent. *Open in
IPTECH* sits under the holder. A bar on the safe area carries **Find similar** and **CSV | Markdown**.
The drawings are a four-column grid. Back, the browser's Back and Escape all close it.

**As published does not mean twice.** Claim text arrives carrying its own number (*1. A method
of…*) and the claim list prints a number in its gutter, so the leading number is removed **only where
it agrees with the position the gutter is about to print**; where they disagree, both stay, because a
claim set that does not start at 1 is telling the reader something.

### 4.6 · Export

**Two exports, one format pair.** *Export this record* writes the record's fields; *Export results*
writes the rows in the order on screen, after any sort, topic or *Find similar*, with the scope the
search ran over at the head of the file. Each leaves as a **CSV** for a spreadsheet or a **Markdown**
list for a document.

**A file states nothing its page did not** (`brief.md` §1). Its columns are the fields the page
shows, under the page's own labels, and a missing field is empty in the file as it is a dash on the
page.

### 4.7 · The drawing viewer

**A panel over a scrim, sized to the plate.** A patent drawing is a portrait plate, so the viewer
opens at a size the drawing fills, with enough scrim left to say the page is still behind it. Below
640px the plate is the width of the screen and the viewer opens full bleed.

**The head names the patent as well as the drawing**: the record's number and title beside *Drawing N
of M*, the word every other surface uses. **Every drawing keeps its published number**, which is what
the claims refer to.

**Its controls are the lab's**: round 32px buttons with 16px glyphs in a floating pill, and round
36px previous and next on the stage's edges. Below 640px every one is 44.

**Zoom, rotate, fill, and a strip.** The zoom buttons step a ladder from 50% to 400%; a wheel, a
pinch or a double press zoom continuously about the point under the cursor. Rotation is a quarter
turn either way. *Fill the screen* drops the panel's maxima. A strip of thumbnails runs along the
foot, and on a phone it shrinks rather than going. Pan is bounded by the drawing's own edge.

**The page behind goes `inert`**, Escape and a press on the scrim close the viewer and leave the
record open, and paging crossfades with the neighbours already fetched.

**Two absences, and the interface must not confuse them.** A record with no drawings says so in a
sentence. A record whose drawings Terrain declines to print renders numbered frames
([`design-language.md`](design-language.md) §8's skeleton contract in the shape a figure has).

**What stays out**: plain-English decode, match highlighting, a summary, unread markers. Each is a
*reading* of the record rather than the record. CPC's own class words are not a reading: they are the
classification's published name, printed beside its code.

---

## 5 · History

**History is the searches the founder has run, newest first**, behind the masthead's *History*
button. Each entry is the sentence, the date, the field it ran in, and *Patent number* when it was a
number search; pressing one runs it again, so it lands exactly as a new search does and moves to the
top. Each entry can be removed on its own and the whole list cleared. Running the same sentence in
the same field and mode again moves it up rather than adding a line, and the list keeps thirty.

**It is kept in the browser**, so it survives a reload and asks the engine for nothing: one browser
on one machine, and §10 item 2 is what an account would add.

**An empty history says what fills it.** *No searches yet*, and that each one is kept here, never
rows of bars, because a bar is a value withheld and an empty history has none.

---

## 6 · What leaves

**Two exports and one link out.** The record's *Export this record*, the list's *Export results*
(§4.6), and *Open in IPTECH*. Nothing else leaves the product, and nothing is saved inside it except
History, in the browser.

**Open in IPTECH has a destination the data does not choose yet.** The source varies by
jurisdiction, so the engine has to return the URL and its label per patent
([`components.md`](../design/components.md) §4 question 3). Until it does, every record points at the
same IPtech sign-in, which is honest about being a stand-in in a way a constructed per-patent link
would not be. The row's source-link glyph is different: it opens the patent's published page, a URL
the record carries.

---

## 7 · When it does not work

**A search crosses a network to an engine, and an engine that does not answer is not an edge case.**
Every wait in this product can end two ways. This section is the second way.

**The founder never loses what they wrote.** A failure returns them to the last point they could have
chosen differently (the search panel for a search) with what they typed still in it.

**What failed is named, and the fix is the next thing in the sentence.** The message states the fix
rather than the fault. No blame, no *oops*, no apology standing in for an instruction. Where there is
nothing the founder can do, the message says that instead of inventing an action.

**It is drawn in weight, not colour**, and [`design-language.md`](design-language.md) §7 carries the
treatment. Terrain has no hue, and a red would be the loudest thing on any screen it reached.

### 7.1 · A failure is the size of the region that was waiting

| What was waiting | What the founder sees | What survives |
|---|---|---|
| The search | The search panel, with the sentence still in it and Search offered again | The sentence and the settings |
| The record | The right panel, naming what did not open, with the row still marked | The list |
| A drawing | The figure frame, naming the one that did not load | The record and the other figures |
| Find similar, a sort | The list as it was, and a sentence saying the order did not change | The order that was on screen |

**Every failure names the next move.** Where a retry exists it is the button; where none does, the
sentence says what still works (*the other patents in your results still open*). **A failure is on
screen, not only spoken.**

**A region that fails keeps the height it reserved.** A wait that collapses into a short sentence
moves everything below it twice, and the second jump is the one that loses the founder's place.

### 7.2 · When the search finds nothing

**This is not a failure and may not be drawn as one.** The engine was asked a question and answered
it. **It answers with nothing when nothing clears its relevance floor**, rather than with the fifty
least distant patents in the index: a nonsense sentence or one from another field would otherwise
return a full list that looks exactly like a good set, which is the one result a founder cannot
tell is wrong.

**It is a result about the search, and the copy says so.** An empty result read as *nobody is here*
is the exact claim Terrain may never make (`brief.md` §1). So the sentence names **what was searched**
(the field, the offices, the kinds, the dates, which the scope chips above already show), offers the
settings, and stops. No *open ground*, no *whitespace*, no count of how close it came.

**The sentence stays in the panel**, and **Search is withheld until something changes**: the same
sentence under the same settings returns nothing twice, so the button states why it is shut.

**A number the index does not hold is the same kind of answer.** `search` returns `NOT_FOUND` for it,
not a failure, and the status line names the number in the figure face, says to check the office code
and the number, and offers one action: *Search this as text*, which switches the mode and runs the
same words as a description.

---

## 8 · What is inert, and why

**Nothing, on purpose.** Every control on screen does what it says. Acts on an account, which would
do nothing without an account model, are not built rather than built inert (§1): a control that looks live and does nothing is worse than one that is absent. A field tile that is
not yet covered is the one refused control, and it says why.

---

## 9 · What Terrain takes from IPtech

Innovue's IPtech is a patent landscape platform built for analysts (Chinese-first, with an English
interface) whose analysis runs to dozens of destinations across two map modules. **Innovue also ships
PI-VuePat**, a semantic patent search surface, and that is the product Terrain's flow is answerable
to. Terrain is a tier of neither. This section records what is adopted, what is cut, and why.

**Adopted.** Semantic retrieval from a plain-language sentence; the search-settings vocabulary
(offices and document kind as the index cross-product, a result count, rerank, a date filter with a
chosen basis); the engine's relevance score on the row; CPC's classification as the grouping; the
drawings and their viewer. Name unification and family merge are taken as **hygiene the founder
never sees**: they are why one holder reads one way and one invention does not fill three rows.

**Cut, with reasons.**

| Cut | Why |
| --- | --- |
| **The analysis layer** | Dozens of destinations of charts, matrices and trend cuts, each a reading authored for an analyst to navigate. A founder does not operate an analyst's workbench; the set (real, as published, and built to be near) is what the search returns, and it leaves as a file. |
| The authored taxonomy | IPtech wants a taxonomy written before the first search. Terrain groups by CPC's own classification of the rows, which nobody has to write. |
| Valuation (`價值通`) | A verdict on a patent's worth. The only number on a row is the engine's relevance score, which is an order, not a worth. |
| Plain-English decode (`AI閱讀Pro`) and the landscape summary (`AI Insight`) | A paraphrase in place of the record, and a reading of a field nobody chose. Terrain prints the record as published and no reading of it. |
| An attorney handoff file | A document somebody could file against. Terrain's files are its pages (§4.6). |
| The zone names (`地雷區` / `新興區` / `處女地帶`) | Minefield, emerging, virgin territory. They label absence, and a search result cannot carry a claim about what exists. |

**What Terrain adds.** PI-VuePat, as inventoried (`visual-reference/pi-vuepat/`), had no
multi-patent export: its egress was one patent at a time into another Innovue product. **A set the
founder can leave with is the thing Terrain ends on**, and Innovue builds it as part of Terrain.

**Find similar is the primitive they already ship.** Nearest-neighbour retrieval is pointed at one
patent on their surface, and Terrain's *Find similar* points it at the open record.

---

## 10 · Not now

**Not a fence: an ordered list of things that are not being built yet, each with what would start
it.** Nothing here is prohibited; it is simply not next. Where an item is *decided against* rather than
postponed, it says so.

1. **Filing alerts**: *tell me when someone files near my idea.* The strongest recurring-value
   feature in the engine. **Starts when:** how Terrain is sold is decided (`brief.md` §6).
2. **Accounts and a saved set.** History is in the browser; nothing else is kept. An account would
   buy the same history on a second machine and a set kept between visits. **Starts when:** the
   founder is expected to be the same person on two devices, and the price says who an account is.
3. **Per-patent link-out from *Open in IPTECH***. **Starts when:** Innovue answers question 3 in
   `components.md` §4.
4. **A patent package**: the drawings and PDFs of a set as a zip, distinct from the export, which is
   rows. **Starts when:** drawing and PDF URLs are available and CORS permits a client-side fetch,
   which is question 4.
5. **A standing office filter** on the list (*US only*). **Starts when:** founders are seen
   re-running searches only to change the offices.
6. **More views of the set**: the rows counted by filing year, holder or office, beside the list.
   *Group by topic* is the one view built. **Starts when:** founders are seen exporting only to
   count.
7. **A report on a set**: a reading of the patents a founder chose. **Decided against for the
   product**: a reading is what Terrain does not print (`brief.md` §1). An analysis an organisation
   wants is scoped with it as a tool on the layer (`brief.md` §6), not built into the baseline.

---

## 11 · Invariants

**None is checked.** Six went with the analysis layer, and the plan screen's went with the plan
screen. A pass that changes an illustrative figure in `demo/` has nothing checking that the rest
still agree, which is worth knowing before changing one.

---

## 12 · Open

- **Who supplies the per-patent "open this in the source" URL?** `components.md` §4 question 3 (§6).
- **How Terrain is sold.** Open (`brief.md` §6), which is why nothing on any surface shows a price or
  counts what a search costs.
- **The name.** Three are in use and none is decided (`brief.md` §2).
- **What does `ipcembedding` mean for retrieval?** Innovue states that a field is its own
  collection (§3.1), so the field tile decides what can come back. What is still open is the exact
  boundary: one IPC subclass, or a set of them. `components.md` §4 question 11.
- **Whether 200 is the engine's ceiling or the interface's.** The settings ladder stops at 200, as
  Innovue's build does.
- **What Rerank does to the order**, beyond Innovue's one line. `components.md` §4 question 14.
- **Whether Terrain sits on Innovue's semantic search surface or beside it.**
- **How accurate is the set?** Innovue's evaluations do not answer this. They are Innovue's, in
  two fields plus a run on US grants from claim 1 alone, they take the prior art examiners cited as
  the answer, and they compare the engine with other tools; `brief.md` §3 says what they license,
  and their figures are kept local (`visual-reference/innovue-research/`). What would answer it is
  a fixed set of founders' descriptions, each with patents known to be near it, run against
  Innovue's build, which is why copy still says *built to return*.
- **Does the score separate near from not near?** Every row prints the engine's score. Until Innovue
  says what it measures, it is printed as the engine's ordering and nothing on any surface may read it
  as confidence. `components.md` §4 question 14.
- **Which index answers a Terrain search?** Which text fields are indexed, whether the drawings
  are, and whether a field tile chooses an index or filters one. `components.md` §4 questions 11
  and 13.
- **An English query leans toward US documents.** Innovue's evaluation found the query's language
  shapes which offices the results come from, and Terrain is English only. It does not wall the other
  offices off, so a claim about the other offices is sayable as reach, never as even coverage.
- **Is the flow right?** Search → find similar → export has never been watched with a founder or a
  backer. The part most likely to be wrong is that a founder wants to keep a set inside the product
  rather than in a file.
- **What legal status covers.** The record prints the engine's status word and expiry where it
  returns them; which offices supply it and how fresh it is, is `components.md` §4 question 6.

---

## 13 · Rounds against Innovue's build

**Innovue builds Terrain from our handoff packages, on their own engine, and ships it at
`https://terrain.innovue.ltd/VuePat/`.** Their build is what the founder uses; `app/` is the
reference it is built from. A round compares their shipped build with what they were
given, settles every difference, and sends back only the differences. The procedure is the
`/terrain-round` skill in `.claude/skills/terrain-round/`. This section is what it decides against.

### 13.1 · Who is the reference for what

**`app/` is the reference for everything: behaviour, flow, the engine contract, type and layout.**
It is built from the round 4 detail lab (`visual-reference/innovue-build/round-4/detail-lab/`, V8),
so a difference between `app/` and their build always has one answer, and a round never has to ask
which side a cosmetic difference falls on.

**The next round hands the V8 look over.** It is a **change** round rather than a conformance one:
its cards are `app/` as it now stands, component by component, written as Part B, with type and
layout in scope. Rounds after it return to reviewing their build against `app/`.

### 13.2 · How an item is shown

- **A problem in their build** (spacing, loading, dark mode) is fixed as an **overlay**: CSS, and
  script where needed, injected into their live page. Overlays live in `design/overlays/round-N/`
  and go into the package as the patch, because a rule written against their real markup loses
  nothing in translation.
- **A feature `app/` already has** (Group by topic, the export of the results, the phone dock) is
  shown in `app/`. Nothing new is built.
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

**Round 4, against their v1.0.42, captured 2026-11-17 at `terrain.innovue.ltd/VuePat/`, from
`handoff-2026-11-06`.** Innovue reported round 3 as built, and **Part A** checks each of its 58 cards against what shipped
and sends back what did not land; every card was measured on a local copy of v1.0.42, with round 3's
patch on and off. **Part B** is the four changes below: the deck's ground and silver edge
(`design-language.md` §2, §3.8), judged on the same local copy against `corpus/`.

**Twelve cards are confirmed built** and leave the patch: R3-01, R3-02, R3-03, R3-04, R3-05, R3-06,
R3-10, R3-13, R3-15, R3-31, R3-39, R3-49. **Forty-six return**, every one as an overlay re-based on
v1.0.42's markup and none touching `app/`. Each keeps the wanted state its R3 card set, except
where v1.0.42 built part of it, where the item asks only for the rest.

**One card is changed rather than restored.** R3-11 asked for *US 09000581 B2* everywhere; v1.0.42
writes *US 9000581 B2* everywhere but the record's number field, and the unpadded form is kept,
because one form on a screen is what the card was for.

**One break that no card asked for is folded into the card it breaks:** on a phone and in
landscape, *Group the results* opens a panel that stays hidden, so R4 for R3-27 asks first that the
panel shows. **A holder name that gained a suffix** (*QUALCOMM Incorporated（QUALCOMM）*) is a question,
tied to R3-11's *holder names as published*.

| ID | Restores | Viewport | Component | Wanted |
| --- | --- | --- | --- | --- |
| R4-01 | R3-36 | touch | Masthead | The masthead controls take a real 44×44 box, as every other control on v1.0.42 now does |
| R4-02 | R3-14 | phone | Masthead | One row on the gutter; one appearance control; the version leaves it |
| R4-03 | R3-26 | phone | Shell | Fixed layers clear the safe area |
| R4-04 | R3-61 | both | Shell | Reduced motion stills dialog and popover enter and exit |
| R4-05 | R3-52 | both | Shell | The page declares English; Chinese records declare theirs |
| R4-06 | R3-59 | phone | Home | The hero sits inside the gutter; the lede does not open a line on a dash |
| R4-07 | R3-46 | both | Home | A ring means focus; a selected tile says so another way |
| R4-08 | R3-35 | tablet | Home | The field grid is three and three |
| R4-09 | R3-30 | phone | Composer | On home too, the mode switch says *Text* and *Patent #*, as it already does in the reopened box |
| R4-10 | R3-41 | both | Composer | An empty Search stays in the tab order and answers |
| R4-11 | R3-56 | both | Composer | No empty history panel on focus |
| R4-12 | R3-07 | both | Number search | No autocorrect, autocapitalise or spellcheck on the number |
| R4-13 | R3-18 | phone | Results | The search floats at the bottom of results and grows upward when opened, over a scrim; the masthead alone is pinned |
| R4-14 | R3-08 | phone | Search settings | The technology field is reachable from results |
| R4-15 | R3-28 | phone | Search settings | A sheet with a scrim; Reset and Done pinned |
| R4-16 | R3-12 | both | Search settings | *Grants · Applications*; Rerank says what it changes |
| R4-17 | R3-33 | both | Search settings | A small uppercase label is three words at most: *Results to show* |
| R4-18 | R3-51 | both | Search settings | A chip shows its off state |
| R4-19 | R3-42 | both | Segmented control | The selected segment is distinct in dark |
| R4-20 | R3-27 | phone | Grouping panel | The panel shows on a phone and in landscape (v1.0.42 opens it hidden), and is a sheet with Done; sentence-case headings, no dead indent |
| R4-21 | R3-22 | phone | List | Titles to two lines; holder, inventors, and date with class, on three even lines |
| R4-22 | R3-23 | phone | List | The rank leads the number line as a soft chip; smaller strip tiles; the abstract keeps three lines |
| R4-23 | R3-21 | phone | List, record | The kind is text in the number line; in the record the version is two tabs under the title, where both exist |
| R4-24 | R3-34 | phone | List | One line: "50 results" (or "50 of 120"), then the view toggle and Sort at 36px as one family; under 360px Sort is its icon |
| R4-25 | R3-29 | phone | List | *Drawings only* shows larger drawings |
| R4-26 | R3-60 | both | List | The strip is cut by the card's edge |
| R4-27 | R3-57 | phone | List | One placeholder for a drawing that is loading |
| R4-28 | R3-48 | both | List, record | Figure badges at 7:1 or more |
| R4-29 | R3-11 | both | Record | The record's number field reads as the row does, *US 9000581 B2*: v1.0.42's unpadded form is kept |
| R4-30 | R3-44 | both | List | A drawing strip is named for its patent; each thumbnail for its figure |
| R4-31 | R3-45 | both | List | A row's link is named by its title |
| R4-32 | R3-37 | both | List | Tab reaches each row's version switch and number link |
| R4-33 | R3-32 | touch | List | No keyboard-shortcuts control on a touch screen |
| R4-34 | R3-50 | both | List | One status region for *Find similar* |
| R4-35 | R3-19 | phone | Record | A card over the list, 8px from every edge: a drag down, the scrim, ×, Escape or Back close it; actions on the safe area |
| R4-36 | R3-24 | tablet | Record | At 820 the head names the patent from the start, as it already does on the phone |
| R4-37 | R3-16 | phone | Record | The field panel in two columns; the drawings a strip that scrolls sideways, as on a row |
| R4-38 | R3-25 | phone | Record | In landscape the record fills the height; one action row |
| R4-39 | R3-09 | phone | Record | Export is two buttons, CSV and Markdown, and the download is confirmed by name |
| R4-40 | R3-40 | phone, tablet | Record | Focus returns to the row whose record was showing, however the record closes |
| R4-41 | R3-47 | both | Record | A disabled chevron reads as disabled, at about 3:1 |
| R4-42 | R3-55 | both | Record | Escape closes the record |
| R4-43 | R3-20 | phone | Drawing viewer | Full bleed, the drawing at full width, close at the top edge |
| R4-44 | R3-43 | both | Drawing viewer | Its controls swap in dark; the current thumbnail is ringed |
| R4-45 | R3-58 | both | Drawing viewer | The arrows have an edge on the paper |
| R4-46 | R3-62 | desktop, tablet | Drawing viewer | The thumbnail strip is centred |

**Part B · Changes.**

| ID | | Viewport | Component | Wanted |
| --- | --- | --- | --- | --- |
| R4-47 | new | all | Page ground | Dark: slate `#16191C` with one light at the top right |
| R4-48 | new | all | Page ground | Light: slate `#ECEEF0` with one light at the top right; slate hairlines and muted text |
| R4-49 | new | all | Find similar, Export | The silver edge on Find similar and Export (on a phone, one edge round CSV and Markdown) |
| R4-50 | new | all | Home composer | The silver edge on the whole composer box |

**Four round 4 cards are superseded by the V8 look** and are not chased in the next round: R4-23
(the record's version tabs on a phone), R4-35 (the phone record as a card 8px from every edge), R4-37
(the phone record's drawings as a strip) and R4-49 (the silver edge on Export). `app/` now draws a
full-screen phone record with a drawing grid and keeps the silver edge on Find similar and the score
chip; the next round's cards say so.

**Earlier rounds' IDs stay valid where `app/` and the docs cite them** (*R1-39*, *R1-36* …): each is
defined in this section as it stood at that round's tag — `handoff-2026-10-14` for R1,
`handoff-2026-10-26` for R2, `handoff-2026-11-06` for R3 — and in that package's `CHANGES.md`, which Innovue holds. An ID is never
reused.

### 13.5 · Queued for the next round

What has been settled and not yet packaged. Each goes in the first round whose scope it fits; the first row is the next round.

| What | Difference → wanted |
| --- | --- |
| The V8 look | `app/` as rebuilt from the detail lab, every component: masthead, search panel and scope chips, settings (200, Rerank, Priority), list head with Group by topic, Export at the end of the scope row, the row with rank and score chips, the record with the facts row, Show all and the side panel, the phone dock and full-screen record, the results surface value for value with the lab and home value for value with Innovue's live home (`design-language.md` §4, §5, §9: the masthead at their 28px recipe, the lab's 36px controls and small-capital field names, no loader). Removed: the keyboard-shortcuts control, the star, the starred page, the report and the account, billing and help pages (§1). Contract: `components.md` (the record's `status`, `priority`, `ipcWords`, `url`; `similar`) |
| Session recording | Their build runs PostHog with session recording → usage events only, recording off. `brief.md` §4: the search box holds an idea the founder may not have filed |
| Question | What does `ipcembedding` mean for retrieval — is each technology field an IPC-scoped index? `components.md` §4 question 11 |
| Question | What does their analytics record, and where is it sent? `components.md` §4 question 12 |
| Question | Which index and route answers a Terrain search; what the score measures; what each field holds; whether queries are kept or trained on, and where it runs. `components.md` §4 questions 13–16 |
| Clearance | Their engine research and Round 2 evaluation were shared with TIS → which of it, figure by figure, may be quoted in public material. `brief.md` §3 |
| Date bounds | Their range takes a year only (*Earliest year* / *Latest year*), and a year sent as the upper bound becomes its 31 December → each bound a year or a full date, typed as digits with the hyphens placed for the founder (§3.3). Their engine already accepts a date |
| Masthead name | Their masthead and `app/`'s read *TIS Terrain* → raised only once `brief.md` §2 settles the name, so both rename once |
