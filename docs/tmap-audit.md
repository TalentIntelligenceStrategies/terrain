# TIS Terrain — T-Map, view by view

> **What IPtech's `T-Map` module actually contains.** Walked from 69 captures taken 2026-09-12,
> held locally at `visual-reference/tmap-audit/`. One row per view the menu reaches that
> [mmap-audit.md](mmap-audit.md) does not already cover.
>
> This is the **seventh** document in `docs/`, authorised in `CLAUDE.md` on the same bar as
> [mmap-audit.md](mmap-audit.md) and for the same reader — whoever writes a widget or an ask and
> needs the record at menu grain. **That authorisation is also the end of the family.** An audit
> file is admissible for a module of somebody else's product we have walked end to end; it is not a
> licence for a file per topic.
>
> **This is deliberately not another sixty rows.** [platform.md](platform.md) §8.3 settled the shape
> on 2026-09-04: `T-Map` is `M-Map` plus a classification filter, with the eight `Tech-Effx` entries
> on top. The walk confirms it. So §2 covers the shared sixty **by citation**, and §3 is the eight
> entries that are genuinely new.
>
> **[platform.md](platform.md) §8 remains the authority on scope.** The `Read` column here is a
> founder-perspective rating made with fresh eyes; where it and §8 disagree, §8 wins on what gets
> *built* and §6 below records the disagreement rather than hiding it.

---

## 0 · The one rule this is written under, and this time it caught something

**The captures are a live client project** — the same project `M-Map` was walked on. They carry real
assignee names, real inventor names, real patent numbers, real counts, and on the `Tech-Effx` views
**both axes of that project's landscape**: eight technology labels across the columns and eight
outcome labels down the rows, each one a compound phrase an analyst was paid to write.

**So this document records IPtech's view names, chart forms and parameters, and nothing else.** No
entity name, no count, no patent number, no classification code, and **no axis label**.

*Swept before a line was written, as `CLAUDE.md` instructs:* **140 items** — assignee, inventor and
examiner names, patent numbers, the sixteen axis labels, and **23 classification codes** (9 IPC and
14 CPC, all at level 4, all of them on the inherited views and **none on any `Tech-Effx` surface**)
— grepped against the whole tracked tree.

***Two hits, and that is the finding of this section.*** [mmap-audit.md](mmap-audit.md) §0 reported
**zero** and concluded *"the tree is clean"*. It was not.

| What | Where | Why it survived |
| --- | --- | --- |
| One **outcome-axis label**, in full, in backticks | [platform.md](platform.md) §8.2, the `AI魚骨` row | It sat in prose as a **citation** — evidence for the claim *the structures it produces are compound and specific* — not as a payload. The claim survives its deletion intact, which is the test `CLAUDE.md` sets |
| The project's **corpus size**, four times | [platform.md](platform.md) §4, §6.1, §10.52 and [case.md](case.md) §9.52 | It did the same argumentative work in all four — *the matrix is drawn over a retrieved set* — and that work needs no number. `case.md` is **outbound** |

Both were removed 2026-09-14. **The published git history still carries them**, which is the
position already recorded for the 2026-09-08 figure scrub: the tree is cleaned, the history is not.

**Two classes of hit were checked and cleared, and they are recorded so the next run does not
re-raise them.** *IPtech's own untranslated interface strings* — a column header and a button
caption — are cited in §10.31 as questions about their product, which is ordinary competitive work
and explicitly not the boundary. And *`B64U`*, which matches the prototype's seed record: the class
is the published scheme for unmanned aircraft, the prototype's symbols are **different subgroups**
from the client's, and the argument for carrying them is already written beside them. **The broad
field does coincide**, though — the worked example is a drone-airframe landscape and the client
project is in the same area — and `CLAUDE.md` asks for a domain nobody has hired us about. The
taxonomy is provably different (all sixteen labels return nothing) and the symbols are argued;
**the domain choice is not re-opened here, and is flagged rather than settled.**

***The lesson is new and it is the most useful thing in this document that is not about charts.***
`CLAUDE.md` already says *a check built from leaks already found cannot recognise the next one*. This
adds the sharper case: **a sweep is only as wide as the capture set that feeds it.** The `M-Map`
sweep ran 51 nouns and 12 codes and reported clean — honestly, and against the wrong list. The label
it missed was never on an `M-Map` screen. **A clean sweep licenses no claim beyond the module it was
built from**, and §0 of [mmap-audit.md](mmap-audit.md) must be amended to say so rather than left
asserting a clean tree.

> **`check-publish.py` gate 3 reported clean throughout, and always will.** It matches a hardcoded
> list from leaks already found; not one entity in these 69 captures is on it. **Extending it is
> still not the fix** — `tools/` is tracked in a public repository, so adding this client's names
> would publish them. [mmap-audit.md](mmap-audit.md) §7 carries this as an open problem and it is
> now **two** instances old.

**The test this document passes:** delete every proper noun and every number from it and it still
says everything it says.

---

## 1 · Two shells, not one

`M-Map` had one chrome across sixty views. `T-Map` has that one, plus a second that only
`Tech-Effx` uses — and learning that the two are different is most of what this module is.

| | The shared sixty | `Tech-Effx`'s eight |
| --- | --- | --- |
| Parameter strip | [mmap-audit.md](mmap-audit.md) §1's exactly, **plus a `Classification` field, a `Classification` button and a `Clear` button** on their own row above it | `XClass` and `YClass` dropdowns, **each with its own filter funnel** · `Analysis Type` · a grid/table toggle · **`Analyze`** · `Mark Colors` — three swatches and an eraser |
| Entity picker | Left rail, `First 5 Items`, top five pre-checked | **None.** There is no rail |
| Chart panes | **Two, side by side.** Always | **One.** Never twinned |
| Data table | Under each pane, always, with a `Total` row | **None.** The figures are printed in the cells |
| Form | bar · horizontal bar · line · radar · list · `3D` · download | A grid of sized, toned bubbles |

**Nothing runs until `Analyze` is pressed**, in both shells, and **no view in either carries a
default reading of its own output.**

***One control name is used twice for two different things, and porting either would inherit it.***
The inherited sixty carry a `Classification` **text field** that scopes a result; `1D Matrix` carries
a `Classification` **dropdown** that picks which scheme is on the axis. Same word, same module,
unrelated jobs.

*`Mark Colors` is new and has no `M-Map` equivalent: three fixed swatches and an eraser, letting the
user paint a cell by hand. It is annotation, not encoding — nothing on screen records what a painted
cell means, and the paint is not in the data table because there is no data table.*

---

## 2 · The shared sixty, by citation

**[mmap-audit.md](mmap-audit.md) §3 is the record of these sixty views and it is not repeated here.**
The walk confirms `platform.md` §8.3's finding rather than qualifying it:

- **The menu is the same menu.** Eleven groups in the same order under the same labels, and
  **IPtech's own typos recur unchanged** — the `LOC` group's fourth entry is still mislabelled
  `CPC Company`, and `LOC- Distribution` still carries the missing space. A module that reproduced
  its sibling's typos is a module sharing its sibling's menu definition.
- **The views render identically.** `Company - Count` and `Company-Legal Status` under `T-Map` match
  their `M-Map` captures in title, chart, values, table and totals.
- **The `UPC` and `LOC` families are empty here too**, on every capture, exactly as
  [mmap-audit.md](mmap-audit.md) §3.9 and §3.11 record.
- **The one label divergence** [case.md](case.md) §4.H already holds: `Patent Count - Life Cycle`
  under `M-Map` is `Life Cycle` under `T-Map`. Same view.
- **The walk counts 68 views across 12 groups** — the eleven inherited plus `Tech-Effx` — which is
  [platform.md](platform.md) §8.3's figure reached a second time, from the menu rather than from the
  arithmetic. *§8.3 settled 68 by noticing two entries were one analysis; this counted them.*

**So the difference is one control strip, and the strip was empty in all 69 captures.** What the
filter does when it is *set* — whether it scopes to one branch of the technology scheme, whether it
takes more than one, whether the sixty then recompute or merely re-filter — is **unobserved**. §7
carries it and §6 turns it into an ask.

***That is a bigger gap than it looks.*** The filter is the entire difference between two thirds of
IPtech's analysis menu and the other third. Sixty destinations exist twice over because of it, and
**we have never seen it do anything.**

---

## 3 · `Tech-Effx` — eight entries, two rendered results

`ZH` is IPtech's own Chinese name **where we hold a confirmed one**. We hold one across the eight.
**An em-dash means we have no confirmed name, and it stays an em-dash**; inventing a plausible
translation would be fabrication, and it is the same discipline as the skeleton bars.

`Read` is this document's founder rating: **Adopt** · **Ask** · **Skip**. §5 gives the totals.

| View | ZH | Form | What it answers | Read |
| --- | --- | --- | --- | --- |
| `Matrix` | 技術功效矩陣 | **The only entry that arrives laid out.** `XClass` × `YClass` grid, both scheme-selected; every cell a bubble **sized and toned by the same value** with the figure printed beneath | Which approaches address which outcomes? | **Ask** — the form is the hero's, the axes are not. §6 |
| `Company` | — | Same grid, `YClass` fixed to `(Current)Assignee`. **Arrives collapsed to a single `+ Assignee` roll-up row** | Which part of the space does each holder sit in? | **Adopt** — this is §6.1's source. §6 records what arriving collapsed costs |
| `Country` | — | Same grid, `YClass` fixed to `Applicant's Country`. Collapsed to one `+ Applicant's Country` row | Which countries hold which parts? | **Ask** — wrong axis for the hero, per [case.md](case.md) §4.H |
| `Inventor` | — | Same grid, `YClass` fixed to `Inventor`. Collapsed to one `+ Inventor` row | Which people work on which parts? | **Skip** — a founder competes with companies, per §8.1's standing cut |
| `1D Matrix` | — | The same eight columns with **no entity dimension at all** — one `ALL` row, a `Direction` control, and a scheme picker confusingly also called `Classification` | What is this space made of? | **Adopt** — merged into the map's column totals, not a second widget |
| `Company Trend` | — | `+ Assignee` × `+ Pub. Year`, **both axes collapsed. A 1 × 1 grid** | Who is filing in which part, over time? | **Ask** — the question is real, the delivered form is not |
| `Country Trend` | — | `+ Applicant's Country` × `+ Pub. Year`. 1 × 1 | " | **Skip** — wrong axis, and the same 1 × 1 |
| `Inventor Trend` | — | `+ Inventor` × `+ Pub. Year`. 1 × 1 | " | **Skip** — wrong axis, and the same 1 × 1 |

***Read the Form column down and the finding is unmissable.*** `Company`, `Country`, `Inventor` and
`1D Matrix` render **the same eight figures**, because all four are collapsed to a roll-up and a
roll-up over the corpus is the corpus. The three `Trend` entries render **the same single cell**, for
the same reason. **Eight menu entries produce two distinct results on arrival**: one populated grid,
and one roll-up shown at four widths.

---

## 4 · Eight structural findings

**The five from [mmap-audit.md](mmap-audit.md) §4 were checked for first**, and the interesting
result is that three of them do **not** recur in `Tech-Effx`.

**1 · Seven of the eight arrive collapsed, and nothing on screen says so.** A `+` sits on the axis
header. There is no count of what is inside it, no hint that the row is a roll-up rather than a
result, and no empty state — a single fat bubble reading *the whole corpus* looks exactly like a
finished analysis. **This is [mmap-audit.md](mmap-audit.md) §4's sixth finding — the picker silently
truncating to five — in a worse form**: that one showed five of many, this shows one of many and
calls it `Assignee`.

**2 · The twin panes are gone, and that is a point in IPtech's favour.**
[mmap-audit.md](mmap-audit.md) §2 is the structural complaint against `M-Map` — sixty views are
thirty analyses shown twice, handing the founder a methodology decision they cannot make.
**`Tech-Effx` shows one pane.** The `Date Type` choice that drove the pairing is a dropdown on the
three `Trend` entries rather than a second chart. Terrain's *one chart and a stated default* is what
this module already does.

**3 · No radar anywhere.** [mmap-audit.md](mmap-audit.md) §4's first and strongest finding — radar
over a matrix table that is better than the radar — **has no instance here.** The form these eight
reach for is the grid, which is the right one.

**4 · Colour is a density scale, not a series ramp.** The red/yellow/green/blue/purple index ramp
that [mmap-audit.md](mmap-audit.md) §4 objects to across `M-Map` is **absent**. Bubbles run one hue
from pale to dark by value. *That is what Terrain's map already does*, and the agreement is worth
recording: where IPtech chose an encoding that carries meaning, we reached the same one
independently.

**5 · But the bubble double-encodes.** Size **and** tone carry the identical value, so the channel is
spent twice and neither is read precisely. It also makes an empty cell and a one-patent cell nearly
indistinguishable at card scale. **[platform.md](platform.md) §6.1's filled cell on a density ramp is
the divergence, and this is the evidence for it** — not taste, a redundant channel.

**6 · Every cell prints its figure, and every cell prints two.** The form is `N (M)`, and **nothing
on screen, in a tooltip, or in a legend says what either number is.** The parenthesised series sums
to the corpus; the other does not. ***The obvious reading is ruled out by the captures themselves.***
*Distinct entities (patents)* fits `Company` perfectly — until you notice that `Country` and
`Inventor` print **the identical pair in every column**, and a corpus does not contain the same
number of distinct companies, distinct countries and distinct inventors. Whatever the first figure
counts, it is not the entity on the axis. Two unexplained figures in every cell is
[mmap-audit.md](mmap-audit.md) §4's *a number on every point* transplanted into a matrix, and it is
worse, because there is no data table underneath to check them against. **§10.57 asks.**

**7 · The module ships a cluster of label defects, and they are an integration risk rather than a
cosmetic one.** Three classification views carry a **title naming the wrong scheme** — a `CPC` view
titled `(M)IPC`, twice on `Country` and once on `Patent Country`, and a `Company` pane titled
`M-IPC` while its controls and data are `CPC`. Two views render the `Top` field **twice**. One pane
is titled `UPC - PROJECT UPC` where the menu says `Project Company`. The `LOC` group's fourth entry
is still called `CPC Company` in the menu while its own page says `LOC Company`, and
`LOC- Distribution` still has the missing space — **both exactly as [mmap-audit.md](mmap-audit.md)
§3.11 recorded them under the other map.** *Recorded as observed rather than corrected.* The reason
it matters to us: **if we ever consume a response keyed on a title or a pane label, four of these
would hand us the wrong scheme silently.**

**8 · Not one of the eight carries a sentence.** Same as all sixty. Eight grids, zero findings.
**Every widget Terrain ships carries a derived caption** — derived, never typed, because a typed
caption is a second source of truth and goes stale the first time a number moves.

---

## 5 · The founder rating

| Rating | Views | Means |
| --- | --- | --- |
| **Adopt** | 2 | Answers a founder sentence, and is either already built or is being built now |
| **Ask** | 3 | Asked of Innovue regardless of whether we build it |
| **Skip** | 3 | Not asked as a view, with the reason recorded |

**2 + 3 + 3 = 8.** *Counted from the rows in §3, not from an impression formed while writing them.*

**Both Adopts are one widget.** `Company` is [platform.md](platform.md) §6.1's map, already on
screen; `1D Matrix` is that map's column totals, which the map computes anyway. **So the eight
`Tech-Effx` entries yield no new widget** — and that is the honest result of the walk rather than a
disappointment. The module's value to Terrain was always the one cut the hero takes.

**The three Skips are one judgement made three times**: `Inventor`, `Inventor Trend` and
`Country Trend` are the wrong axis for this buyer, which is [case.md](case.md) §4.H's own tiering
reached again independently. *`Country` is rated **Ask** rather than **Skip** on the same axis, for
the reason §8's decoupling gives: the question "which countries hold which parts" is one a founder
might one day want, and asking costs nothing.*

**Ask is not a scope list and must never be read as one.** *A capability left off the ask is one
Innovue never tells us about; a capability asked about and later dropped costs nothing.*

## 6 · Where this disagrees with `platform.md` §8

**First, the recount §8.5's own discipline demands.** §8.1 carries **four `T-Map` rows**, one of
which covers two entries: `Tech-Effx › Matrix`, the matrix cell's hover popover, the three zones
(cut 2026-09-10), and `Tech-Effx › Country` + `Country Trend` together. **So three of the eight
entries are catalogued.**

***Five are not, and one of those five is the source of the hero.*** `Company`, `1D Matrix`,
`Company Trend`, `Inventor` and `Inventor Trend` have no row in §8.1. **`Tech-Effx › Company` is
folded into the `Matrix` row's screen list rather than carried as a destination of its own** — and
§6.1 names it as what the map is, [components.md](../design/components.md) names it as the map's
supplying capability, and §8.3 calls it *"one entry of eight under one group of one map"* while
describing the concentration risk it creates. **The product's single most load-bearing destination
has never had a ledger row.** That is the same defect [mmap-audit.md](mmap-audit.md) §6 found on
seven `M-Map` groups, and §8's own 2026-09-07 correction is precisely about a roll-up silently
dropping what it rolled up.

Three substantive disagreements:

| | §8.1 says | This audit says |
| --- | --- | --- |
| `Tech-Effx › Matrix` | **Diverge** → *"The hero, §6.1"* | **The hero is not this view.** §6.1 is `Tech-Effx › Company` — technology × holder — and `Matrix` is technology × outcome, whose outcome axis ~~§10.2~~ retired moot. Conflating them puts the hero's row on a view Terrain deliberately does not take. **Two rows, not one**, and the `Matrix` row's verdict is then `Ask` rather than the hero's |
| `Tech-Effx › Company` | *no row* | It is **the hero's only source**, and the captures show it **arriving collapsed to a single roll-up with the holder axis closed**. §6.1 takes the top eight holders and says so on the card; the engine's own default for this view lays out **none**. That is not a reason to reopen §6.1 — it is a reason §10.55 is sharper than it was, and it needs a row that says so |
| `Tech-Effx › Inventor`, `Inventor Trend`, `Company Trend`, `1D Matrix` | *no row at all* | **Skip is right for the two `Inventor` cuts** and the reason is §8.1's own standing one. **But an uncatalogued entry reads as an oversight**, and `1D Matrix` in particular is a capability Terrain uses — the map's column totals — reached by a destination nobody recorded. Each needs a row saying what it is and why |

***What happened to the three above, in the same pass.*** §8.1 now carries **five** `Tech-Effx`
rows where it carried one: the hero was split out under its own name, `Matrix` kept its number and
moved to `Omit · later`, and `1D Matrix`, `Company Trend` and the two `Inventor` cuts were added.
§8.5 recounted from the columns — **67 → 71** — and [components.md](../design/components.md)
followed it to 0.11.0. *The disagreements are left standing above rather than edited away, because
the record of what an audit found is not the same document as the ledger it corrected.*

***And two of this document's own ratings were reversed the same day, which is the more useful
record.*** §5 concluded the module yields **no new widget**, and that was right about what it
measured and wrong about what it was taken to mean. §3 rates **destinations**: does Terrain adopt
this menu entry as a view. It does not enumerate **what could be built from what the entry shows**,
and those are different questions.

| §3 rates it | Built as | The argument |
| --- | --- | --- |
| `1D Matrix` — **Adopt**, *"merged into the map's column totals, not a second widget"* | [platform.md](platform.md) §6.12 | The merge claim was about the **figures** and the figures are not the same: the map's headings sum to the eight largest holders, this sums to the corpus. Same column, two numbers, two questions |
| `Company Trend` — **Ask**, *"the question is real, the delivered form is not"* | [platform.md](platform.md) §6.13 | **The objection was to the rendering and the rating carried it to the question.** A 1 × 1 collapsed cell is not a chart; *which part of my space is moving* is still a founder sentence nothing else answers. Same shape as [mmap-audit.md](mmap-audit.md) §6's `Life Cycle` reversal |

**The ratings above stay as written.** They are what a walk of somebody else's product found, and
rewriting them to match what we later chose to build would destroy the only independent reading in
the file. *The general rule, and it is this document's most portable finding:* **an audit rates what
a vendor ships; it is not a build backlog, and an `Ask` or a `Skip` column read as one gets it
backwards in both directions.**

***And one place this audit agrees with §8 against itself.*** §8.2 holds IPC as **a confidence signal
only, deliberately never a label**, and §6's roster note records that a seventh `M-Map` widget was
dropped on that rule. **The rule is not reopened here.** `T-Map`'s whole reason for existing is a
classification filter, so the module is the strongest case anyone will make for a classification axis
on a Terrain surface — and it is still the wrong trade, for §8.2's stated reason: two technology axes
on one page, one generated and one standard, leaves the founder unable to tell which is
authoritative. **The ask asks for it anyway**, because §8 is explicit that the ask is not gated by our
scope. **This is a live disagreement recorded, not a cut being relitigated.**

---

## 7 · What this audit does not cover

- **No `Tech-Effx` axis was ever expanded.** The `+` was never clicked on any of the seven collapsed
  entries. **So the three questions §10.55 asks are still open** — how many rows the holder axis
  lays out, whether it is a tree, whether it paginates — and the captures answer only that the axis
  **arrives closed**, which the question did not think to ask.
- **The `Classification` filter was never set.** Empty on all 69 captures — though one capture
  catches the button in its active state, so the affordance is real. The one control that
  distinguishes `T-Map` from `M-Map` has not been seen doing anything, and **no picker behind it was
  ever opened**, so we do not know whether it takes free text, one branch, or several.
- **`XClass` and `YClass` were never changed**, and each carries a filter funnel that was never
  opened. What other schemes the dropdowns offer, and what the funnels filter, is unknown.
- **`Analysis Type` was never changed from `Patents`.** Other values exist in the dropdown.
- **`Mark Colors` was never used**, so whether a painted cell persists, exports, or means anything is
  unknown. *It is the most interesting interaction in the module — it turns an analysis grid into
  something a person can hand to someone else — and it is entirely unexamined.*
- **The two figures in every cell are unexplained** and no tooltip was opened to resolve them.
- **The grid/table toggle was never pressed.** It sits on four of the eight and is absent from the
  other four, so §1's claim that `Tech-Effx` has no data table is a claim about the **default view**
  of half the group.
- **The geo toggle was never opened**, exactly as [mmap-audit.md](mmap-audit.md) §7 already records.
  It appears on three inherited views here too.
- **`3D` and the download control are greyed on every inherited view**, so the export shape is still
  unknown — which still bears on whether any of this is reachable programmatically at all.
- **Every capture is one project, one art field, one date window** — the same project `M-Map` was
  walked on. Nothing here distinguishes a thin view from a thin corpus.
