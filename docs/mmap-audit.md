# TIS Terrain — M-Map, view by view

> **What IPtech's `M-Map` module actually contains.** Walked from 59 captures taken 2026-09-12,
> held locally at `visual-reference/mmap-audit/`. One row per view the menu reaches.
>
> This is the **sixth** document in `docs/`, and `CLAUDE.md`'s five-document rule requires the bar
> be named rather than assumed. It is a per-view inventory of **someone else's product**, where the
> other five are Terrain's own positioning, build, look, argument and copy — a different *kind* of
> content. Its *reader* is whoever writes a widget or an ask and needs the record at menu grain,
> which no existing file carries: [platform.md](platform.md) §8.1 is one row per **screen we
> photographed**; this is one row per **view the menu reaches**. It pairs with a `tmap-audit.md`
> in the next pass.
>
> **[platform.md](platform.md) §8 remains the authority on scope.** The `Read` column here is a
> founder-perspective rating made with fresh eyes and no cross-reference; where it and §8 disagree,
> §8 wins on what gets *built* and §6 below records the disagreement rather than hiding it.

---

## 0 · The one rule this is written under

**The captures are a live client project.** They carry real assignee names, real inventor names,
real examiner names, real patent numbers, real counts, and — on twenty of the sixty views — **five
classification codes that are that project's landscape axes**.

`CLAUDE.md` records this failure twice, and the sentence it sets in bold is the reason this section
is first: *a scrub that changes the numbers and keeps the labels has not removed the landscape.*
The second instance was worse than the first, because it sat in **prose**, inside parentheses,
reading as a citation rather than as a payload.

**So this document records IPtech's view names, chart forms and parameters, and nothing else.** No
entity name, no count, no patent number, and **no classification code**, from any capture.

*Why the codes too, when a code is a published WIPO string and not an invented taxonomy.* One code
is public. **The set of five, in this order, on these axes, is the landscape** — it names the
industry, the problem and the approach, which is the whole of what an analyst was paid to find. The
individual code is not the client's; the tuple is.

**The test this document passes:** delete every proper noun and every number from it and it still
says everything it says. Nothing below depends on a label.

*Swept before a line was written, as `CLAUDE.md` instructs when a capture of a real project enters a
session:* 51 proper nouns and 12 classification codes from the captures, grepped against the whole
tracked tree. **Zero hits**, and this document keeps it that way.

> ***That sweep was honest and its conclusion was too broad. Amended 2026-09-14.***
> This paragraph read *"the tree is clean"*. It was not. The `T-Map` walk
> ([tmap-audit.md](tmap-audit.md)) swept **140** items from a different module's captures and found
> **two** — an outcome-axis label sitting in [platform.md](platform.md) §8.2 as a citation, and the
> project's corpus size in four places including the outbound [case.md](case.md). Neither was ever
> on an `M-Map` screen, so no list built from these 59 captures could have contained them.
>
> **The rule that follows is the one `CLAUDE.md` did not yet have.** It already says *a check built
> from leaks already found cannot recognise the next one*. The sharper form is: **a sweep is only as
> wide as the capture set that feeds it, and a clean sweep licenses no claim beyond the module it
> was built from.** Say *these nouns are absent*, never *the tree is clean*.

> **`check-publish.py` gate 3 did not and could not help.** It matches a hardcoded list of names
> from leaks already found, and **not one entity in these 59 captures is on it**. That is precisely
> what `CLAUDE.md` means by *a check built from leaks already found cannot recognise the next one* —
> the gate reports clean on this landscape and always will. The sweep above is the control that
> actually ran. **Extending the gate is not the fix**, because `tools/` is tracked in a public
> repository: adding this client's names to it would publish them. §7 carries this as an open
> problem, and it is the most useful thing in this document that is not about charts.

---

## 1 · The shell every view shares

Sixty views, one chrome. Learning it once explains all sixty.

| Element | What it is |
| --- | --- |
| Title | `Group - View`, restating the menu path |
| Parameter strip | Some of: entity-type selector · `Date Type` · `Start` · `End` · `Interval` · classification `Level` · `Top` · `Base Year` · `Citings Threshold` · `Analysis Type`, then **`Analyze`** |
| Entity picker | Left rail. A `First 5 Items` dropdown, an `Other` checkbox, then a checkbox list of entities with a count each. **The top five arrive pre-checked.** |
| Chart panes | **Two, side by side.** Always. §2 is about what the pair means |
| Pane toolbar | bar · horizontal bar · line · radar · list · `3D` · download. Greyed where inapplicable |
| Data table | Under each pane, always, with the exact figures and a `Total` row |

**Nothing runs until `Analyze` is pressed**, and no view carries a default reading of its own output.

---

## 2 · The twin panes are a methodology choice, never two analyses

This is the structural finding that most changes what Terrain should do. Three pairs recur:

| The pair | What differs | What Terrain should default to |
| --- | --- | --- |
| `Pub. Year` vs `Appl. Year` | when the office published vs when the invention was filed | **`Appl. Year`.** Filing date is when the invention happened; publication date is an administrative artifact of a queue the founder is not in |
| `Main-<scheme>` vs all `<scheme>` | the single primary classification vs every classification on the record | **All.** A patent doing three things is doing three things; the primary is an indexing convenience |
| all contributors vs `(Primary)` only | every inventor/examiner vs the first-named | **All**, where the view survives at all |

**So sixty views are about thirty analyses shown twice.** The founder is being handed a
methodology decision they cannot make, in the most expensive possible form — two charts, side by
side, differing subtly, with no statement of which is which or why it matters.

**Terrain's form is one chart and a stated default**, with the alternative reachable and named in
words. That is not a simplification of IPtech; it is answering the question the pair poses.

---

## 3 · The eleven groups, sixty views

`ZH` is IPtech's own Chinese name **where we hold a confirmed one**. We hold four across all sixty —
see §4 finding 8. **An em-dash means we have no confirmed name, and it stays an em-dash**; inventing
a plausible translation would be fabrication, and it is the same discipline as the skeleton bars.

`Read` is this document's founder rating: **Adopt** · **Ask** · **Skip**. §5 gives the totals.

### 3.1 · Company — 17 views

| View | ZH | Form | What it answers | Read |
| --- | --- | --- | --- | --- |
| `Count` | 競合分析 | Vertical bars, one per holder, twinned on date basis; table adds an inventor count | Who else is here? | **Adopt** — already Terrain's Rivals |
| `Research Ability` | — | **Radar** whose five axes are the five holders, one polygon, values normalised so the leader reads 100%; table carries seven raw metrics behind it | Who is investing hardest? | **Ask** — the composite is a black box |
| `Trend` | 宏觀趨勢分析 | Multi-line by holder, **a printed label on every point** | Is this rival still filing? | **Adopt** |
| `Citation` | — | Grouped bars per holder over four citation measures; six aggregate averages sit in the parameter strip | Self-referential, or building on others? | **Ask** |
| `Share` | — | *Not captured.* The `Country › Share` pattern implies pie + share-bar table | How concentrated is this? | **Ask** |
| `Cross Reference` | 公司相互引證分析 | A ring, plus an **N×N "cited by others" matrix** with the diagonal tinted | Whose work does everyone build on? | **Adopt** — as the matrix, not the ring |
| `Activity` | — | Expandable folder tree, one node per holder, each labelled with a span in years | Who is still active? | **Ask** — as a span bar |
| `Inventor Activity` | — | Expandable folder tree, each node labelled with a headcount | How big is their bench? | **Ask** — §6 disagrees with §8.1 here |
| `Ranking` | — | **Diverging/tornado** split on a `Base Year`, holder labels on both outer edges, two rank tables | Who is rising, who stalled? | **Adopt** |
| `– Project (M)-IPC` | — | Radar over five project-level codes, one polygon per holder, twinned main/all; matrix table beneath | Which part does each hold? | **Adopt the table, not the radar** |
| `– Company (M)-IPC` | — | As above, axes drawn from each holder's own top codes | " | **Adopt the table** |
| `– Project (M)-UPC` | — | Same form. **Empty in every capture** | — | **Skip** |
| `– Company (M)-UPC` | — | Same form. **Empty** | — | **Skip** |
| `– Project (M)-CPC` | — | Radar + matrix, populated | " | **Adopt the table** |
| `– Company (M)-CPC` | — | Radar + matrix, populated | " | **Adopt the table** |
| `– Project (M)-LOC` | — | Same form. **Empty** | — | **Skip** |
| `– Company (M)-LOC` | — | Same form. **Empty** | — | **Skip** |

### 3.2 · Patent Count — 3 views

| View | ZH | Form | What it answers | Read |
| --- | --- | --- | --- | --- |
| `Trend` | — | Single line over the whole corpus, twinned on date basis; table carries a per-year share with an inline bar | Is this field growing? | **Adopt** — Terrain's Filings |
| `Patent Count - Life Cycle` | — | **Connected scatter.** X is distinct holders, Y is patents, every point labelled with its year and joined in time order. Twinned on holders vs inventors | Am I early or late? | **Adopt** — §6 records this as a reversal |
| `Citation` | — | Per-patent grouped bars with patent numbers on the X axis, a tree navigator beside it; the table splits citing counts **within the project** from **within the US**. Parameters include a citings threshold and a project/US scope switch | Which documents here carry weight? | **Ask** — belongs on a record, not a map |

### 3.3 · Country — 7 views

Country here is the **holder's** country, not the patent's. §3.5 is the other one, and the pair is
never explained on screen.

| View | ZH | Form | What it answers | Read |
| --- | --- | --- | --- | --- |
| `Distribution` | — | Vertical bars per country, twinned; **a geo toggle sits in the toolbar**; table adds holder and inventor counts | Where are the players from? | **Adopt** |
| `Trend` | — | Multi-line by country | Who is entering? | **Ask** |
| `Share` | — | Pie with leader-line labels carrying name, count and percent; share-bar table beneath | How concentrated by origin? | **Ask** |
| `– Country / (M)IPC` | — | Radar per country over five codes + matrix | Which country holds which part? | **Ask** — the table |
| `– Country / (M)UPC` | — | **Empty** | — | **Skip** |
| `– Country / (M)CPC` | — | Radar + matrix, populated | " | **Ask** — the table |
| `– Country / (M)LOC` | — | **Empty** | — | **Skip** |

### 3.4 · Legal Status — 3 views

| View | ZH | Form | What it answers | Read |
| --- | --- | --- | --- | --- |
| `Patent-Legal Status` | 法律狀態 | An **inset donut** (valid / published / overdue percentages) beside **grouped bars by year**; table gives a count and a rate for each of the three states | How much of this is still live? | **Adopt** — Terrain's §6.7 |
| `Company-Legal Status` | 法律狀態 | Same donut, bars grouped **by holder** | How much of this *crowd* is enforceable? | **Adopt** — the strongest founder fact in the module |
| `Country-Legal Status` | 法律狀態 | Same, **by country**, with the geo toggle | Where is protection actually live? | **Ask** |

### 3.5 · Patent Country — 7 views

The **patent's own jurisdiction**. Identical seven-view shape to §3.3, and in the captures it
collapses to a single jurisdiction — which makes the whole group look broken when it is merely
scoped.

| View | ZH | Form | What it answers | Read |
| --- | --- | --- | --- | --- |
| `Distribution` | — | Bars + geo toggle + table | Where is this filed? | **Adopt** — Terrain's §6.6 |
| `Trend` | — | Line per jurisdiction | Where is filing moving? | **Ask** |
| `Share` | — | Pie + share bars | Which market dominates? | **Ask** |
| `– Country / (M)IPC` | — | Radar + matrix | Which jurisdiction holds which part? | **Ask** — the table |
| `– Country / (M)UPC` | — | **Empty** | — | **Skip** |
| `– Country / (M)CPC` | — | Radar + matrix | " | **Ask** — the table |
| `– Country / (M)LOC` | — | **Empty** | — | **Skip** |

### 3.6 · Inventor — 4 views

| View | ZH | Form | What it answers | Read |
| --- | --- | --- | --- | --- |
| `(Primary) Inventor - Inventor Count` | — | Bars, twinned **all inventors vs primary only**; share-bar tables | Who are the people? | **Ask** |
| `Inventor Company` | — | **No chart at all** — a table row-grouped by inventor: inventor · activity year · company · count · share. It is an **affiliation history**, and reading down it shows an inventor moving between employers | Who moved where, and when? | **Ask** — §6, and the most interesting view in the module |
| `(Primary) Inventor - Trend` | — | Multi-line per inventor | Who is productive now? | **Ask** |
| `(Primary) Inventor - Share` | — | Pie, twinned | — | **Skip** — duplicates the count |

### 3.7 · Examiner — 3 views

| View | ZH | Form | What it answers | Read |
| --- | --- | --- | --- | --- |
| `(Primary) Examiner - Distribution` | — | Bars, twinned | Who examines in this art unit? | **Skip** |
| `(Primary) Examiner - Trend` | — | Multi-line | — | **Skip** |
| `(Primary) Examiner - Share` | — | Pie | — | **Skip** |

**The whole group is prosecution strategy** — it is for an attorney drafting claims to a known
examiner's habits. A founder has no move that depends on it. Skipped as a group, with the reason
stated so it reads as a decision rather than an oversight.

### 3.8 · IPC — 4 views

| View | ZH | Form | What it answers | Read |
| --- | --- | --- | --- | --- |
| `(Main) IPC - Distribution` | — | Bars per code, twinned main/all; table carries patents, a code count and a share | What is this concept made of? | **Adopt** — codes rendered as text |
| `(Main) IPC - Trend` | — | Multi-line per code | Which part is growing? | **Adopt** |
| `(Main) IPC - Project Company` | — | Radar, holders over the project's top codes | Who holds which part? | **Ask** — the table |
| `(Main) IPC - IPC Company` | — | Bars, holders ranked within a code. Parameters expose **five nested level selectors** | Who owns this specific area? | **Ask** |

### 3.9 · UPC — 4 views

Same four shapes as §3.8. **Every one is empty in every capture.**

| View | ZH | Read |
| --- | --- | --- |
| `(Main) UPC - Distribution` · `- Trend` · `- Project Company` · `- UPC Company` | — | **Skip**, all four |

The USPTO retired USPC for utility patents in 2015. The group is a live menu over a dead scheme.

### 3.10 · CPC — 4 views

Same four shapes as §3.8, **populated**. CPC is the joint EPO/USPTO scheme and is finer-grained than
IPC — which makes it the better source for §3.8's two adopts, not a second copy of them.

| View | ZH | Read |
| --- | --- | --- |
| `(Main) CPC - Distribution` | — | **Adopt** — merged with the IPC one, one widget |
| `(Main) CPC - Trend` | — | **Adopt** — merged |
| `(Main) CPC - Project Company` | — | **Ask** — the table |
| `(Main) CPC - CPC Company` | — | **Ask** |

### 3.11 · LOC — 4 views

Same four shapes. **Every one empty.** Locarno classifies **industrial designs**, which are outside
Terrain's utility-patent scope — but not outside a founder's risk, and [platform.md](platform.md)
§8.2 already records that a founder shipping physical product can be blocked by a design patent
exactly as hard.

| View | ZH | Read |
| --- | --- | --- |
| `(Main) LOC- Distribution` · `- Trend` · `- Project Company` · `- CPC Company` | — | **Skip** as views; **Ask** whether the corpus carries designs at all |

*The fourth entry is labelled `CPC Company` in the `LOC` group's own menu, and the first carries a
missing space — `LOC- Distribution`. Recorded as observed rather than corrected.*

---

## 4 · Eight structural findings

**1 · Radar is the wrong form for all twenty views that use it.** Its axes are five classification
codes in arbitrary order; rotating them changes the shape and changes nothing else. Enclosed area is
meaningless when the axes are different slices of one nominal scheme, and no comparison a founder
wants to make is easier as a polygon. **Every one of those twenty views prints the same data as a
matrix table immediately beneath it, and the table is better than the chart.** That is the same
conclusion [platform.md](platform.md) §8.1 reached independently for `Research Ability` — arriving
at it twice, from different directions, is the strongest evidence in this document.

**2 · Colour is assigned by series index.** Red, yellow, green, blue, purple, in that order, on
every categorical chart regardless of what the series are. Green sitting beside red implies good and
bad where no such reading exists — and on `Legal Status`, where orange means *overdue* and blue means
*valid*, an encoding that **does** carry meaning is drawn from the same arbitrary ramp, so nothing
tells the reader which is which.

**3 · Every trend chart labels every point.** A forty-year series carries forty printed numbers,
overlapping at every crossing. The table below already holds them exactly.

**4 · Classification codes are never expanded.** A code and an ⓘ tooltip, nothing more — on axes,
on legends, on column headers. To a founder this is an unreadable string.
[platform.md](platform.md) §8.2 records that the engine **already renders classifications as
readable text chips** on other surfaces, so this is a presentation choice rather than a data limit.

**5 · No entity resolution in the picker.** The same corporate group appears under more than one
name variant in the same list, with its filings split between them — so a founder counting rivals
counts wrong, and a holder can be ranked against itself. Corroborates §8.2's row on name
unification being a **toggle the user must press** rather than a default.

**6 · The picker silently truncates to five.** `First 5 Items` is the default, the top five arrive
pre-checked, and nothing on screen says the list continues. A founder reads five rivals and
concludes there are five.

**7 · Not one view carries a sentence.** Sixty charts, sixty tables, zero findings. Every view
renders its data and stops; the reading is left entirely to the viewer. This is the finding that
most directly justifies Terrain's caption rule — and a widget we ship without a sentence repeats it.

**8 · We hold a confirmed Chinese name for four of the sixty.** `Company › Count` (競合分析),
`Company › Trend` (宏觀趨勢分析), `Company › Cross Reference` (公司相互引證分析), and the
`Legal Status` group (法律狀態). **The other fifty-six are em-dashes** — the interface renders these
view names in English, and the Chinese names we do hold came from marketing and from other surfaces
rather than from this menu. Closing that gap is an ask, not a translation exercise.

---

## 5 · The founder rating

| Rating | Views | Means |
| --- | --- | --- |
| **Adopt** | 18 | Answers a founder sentence, and is either already built or is being built now |
| **Ask** | 22 | Asked of Innovue regardless of whether we build it |
| **Skip** | 20 | Not asked as a view, with the reason recorded |

**18 + 22 + 20 = 60.** *Counted from the rows, not from the summary — the first draft of this
section said 15 / 24 / 21, which was the estimate made while writing §3 rather than a count of it.*

**Six of the eighteen Adopts are already on screen** — `Company › Count` is Rivals, `Patent Count ›
Trend` is Filings, both `Distribution` views are §6.6, and `Patent-Legal Status` is §6.7. **Seven
are being built this pass.** The remaining five are the four classification cross-tabs, whose
*table* is the map Terrain already renders, and `Company-Legal Status`, which is the per-holder cut
of a view we hold at corpus level.

**The Skip column is mostly empty menus, not judgement.** **Sixteen of the twenty** are the `UPC`
and `LOC` families and their cross-tabs, which returned no data on any capture. The genuine
judgement calls are **four**: the three `Examiner` views, and `Inventor - Share` as a duplicate of
`Inventor Count`.

**Ask is deliberately the largest column**, and [platform.md](platform.md) §8 is why: *a capability
left off the ask is one Innovue never tells us about; a capability asked about and later dropped
costs nothing.* This column is not a scope list and must never be read as one.

## 6 · Where this disagrees with `platform.md` §8

**First, the recount §8.5's own discipline demands.** §8.1 carries **15 rows covering 16 of the 60
views** — row 22 covers two. Four of the eleven groups have a row there; **seven do not**:
`Patent Country`, `Inventor`, `Examiner`, `IPC`, `UPC`, `CPC` and `LOC`. *`CPC` and `LOC` appear in
§8.2 as capabilities, which is a different claim from a destination having been catalogued.*

*This document's plan asserted "two groups" before the columns were counted. It was wrong, and the
correction is recorded rather than quietly applied — §8.5's note that recounting from the columns is
the only way this kind of error surfaces has now proved true a third time.*

Three substantive disagreements:

| | §8.1 says | This audit says |
| --- | --- | --- |
| `Patent Count › Life Cycle` | *"a sentence, not a chart"* — the finding goes in §6.3's caption, because a phase-space trajectory of self-crossing labelled points is the most analyst-shaped form in the set | It is the **only** view answering *am I early or late*, and it is being built as a chart. **The objection is to IPtech's rendering, not to the form** — a connected scatter with three labelled eras and a stated reading is not the chart §8.1 rejected. **A reversal, and §8.1 must record it as one.** |
| `Company › Inventor Activity` | `Omit · cut` — *"a founder competes with companies, not with named engineers"* | The cut is right about *activity*. It is wrong about `Inventor Company`, a different view §8.1 never saw: an **affiliation history** showing an inventor moving between employers. That is a talent signal, and TIS is a talent-intelligence company. **Not built this pass; asked for, and the disagreement recorded.** |
| `Examiner`, `Patent Country`, `IPC`, `CPC` groups | no row at all | Skip is right for `Examiner` and the reason is clean. **But an uncatalogued group reads as an oversight**, and §8's own 2026-09-07 correction is precisely about a roll-up silently dropping groups. Each needs a row saying what it is and why. |

---

## 7 · What this audit does not cover

- **`Company › Share` was never captured.** Its form is inferred from the `Country › Share` pattern
  and is marked as inferred in §3.1. It is the one gap in the sixty.
- **The geo toggle was never opened.** It appears in the toolbar on three views; what it renders is
  unknown.
- **`3D` is greyed on nearly every view.** Whether it is unavailable for the data or unavailable
  full stop is unknown.
- **The download control was never used**, so the export shape is unknown — which bears on whether
  any of this is reachable programmatically at all.
- **Every capture is one project, one art field, one date window.** Views that look thin here may be
  thin because of the scope rather than by design; `Patent Country` in particular collapses to a
  single jurisdiction and looks broken when it is merely scoped.
- **Gate 3 cannot be extended where it lives.** `tools/check-publish.py` is tracked in a **public**
  repository, so adding this client's proper nouns to its pattern would publish exactly what the
  gate exists to keep out — and the names already in it are already published. The gate needs its
  pattern list moved to a local-only, gitignored file, with the gate failing loudly when that file
  is absent. **Open, and it is a repository-hygiene decision rather than a Terrain one.**
