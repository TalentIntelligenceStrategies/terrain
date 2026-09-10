# TIS Terrain — component manifest

> **What each component reads, what it needs from your engine, and which IPtech capability supplies
> it.** Version **0.8.0**, 2026-09-10 — Innovue's architecture is adopted (`platform.md` §1a) and
> **the asks get smaller in three places and larger in none.** The map's second axis stops being
> generated: `outcomes` leaves the shape entirely, the rows are assignees read off the patents, and
> nothing on either axis is editable, so the whole edit contract goes with it. The set and the
> drill-down merge into **one list row**, because they are now literally one list. And the record
> may carry the engine's relevance score, which `brief.md` §4 stopped forbidding on the same day.
>
> *A version of this file is not a changelog, so the rows below are rewritten clean rather than
> struck. **A component contract is the one place a superseded direction must not be left
> standing** — a reader implementing from it cannot tell which sentence is live. The trail is here
> in the header and nowhere else.*
>
> *0.7.0, 2026-09-09 — the patent record arrived. `platform.md` §9's detail-page entry
> was un-deferred and §7a.3 closed for a record pane, so this file gained **the largest single ask in
> it** and the handoff row stopped being a shape of its own: it is now a five-field projection of the
> record. 0.6.0, earlier the same day — the points page lost its cross-card selection, so three of
> its rows lost a field and the daily-ledger row became the page's one real dependency.*
>
> *This lived at `design/tokens/components.md` until 2026-09-08, alongside a generated token
> extraction. The extraction is gone — it was a copy of a document that already exists, and
> `docs/design-language.md` is the source anyone would regenerate it from. This file is not a copy
> of anything, so it stays.*
>
> The source of truth for every component spec here is
> [`docs/design-language.md`](../docs/design-language.md) §7; for every capability claim, the
> **sixty**-row ledger at [`docs/platform.md`](../docs/platform.md) §8. Where this file and those
> disagree, **they win.** *This said fifty-nine until 2026-09-10 — §8's own headline did too, and
> its tables never did.*

**The third column is why this file exists.** Tokens tell you what our interface looks like. The
data shape tells you what we would be asking your engine to return — which is the half of
[`docs/case.md`](../docs/case.md) §8.2 that a cost estimate actually attaches to.

**It is not aspirational.** Every shape below is what the working prototype already consumes.
`design/previews/terrain-prototype.html` runs on a `DATA` object holding an illustrative set — 117
patents, a full 8×8 grid, a jurisdiction split — modelled on a project we observed inside IPtech
whose data is not ours to publish. **The shapes are exact; the values are not real.** Each row names
the function that renders it, so you can check the shape against running code rather than against
our description of it.

---

## 0 · The assumption that voids every row below

**The engine returns structured values, not rendered pictures.** You cannot re-token a PNG.

If the analyses come back as server-generated images, no row in this file is buildable and the
visual layer needs its own rendering path against raw values. This is question 1 in
`docs/case.md` §9 and it is not a detail — it is the gate on the entire folder. We have
assumed structured values throughout because that is the only assumption under which a design
handoff means anything, and we would rather be corrected early than build on it.

**Notation.** `{ field: type }` — an object. `[…]` — an array. Field names are ours and are
illustrative; the *shape* is the claim, not the spelling.

---

## 1 · Built, and data-bearing

Twelve of the fifteen `Diverge` rows in `platform.md` §8.1 are built. Listed below are the
components that consume engine data — which is those twelve plus the Terrain-owned pieces that sit
between them, so the seam is complete rather than only its interesting half.

*Five rows left `Diverge` on 2026-09-10 when the widget page was abolished, and none of them was
one of the twelve. **Two of the five are built anyway** — the share pie and the holder-comparison
bars — and they now render `Where it is filed` and nothing else respectively. `platform.md` §11
carries where a widget's full form lives.*

*The points page's six rows joined on 2026-09-08 and one of them carries a real dependency worth
reading before the rest: the columns and the runs list both need a **per-run ledger**, not a balance.
Everything else on that page is arithmetic over what the meter already returns — and after the
2026-09-09 pass removed the page's selection mechanism, **nothing on it is interactive except two
view controls**, so no row here asks the engine for anything a filter would need.*

| Component | Tokens it reads | Data shape it needs | Capability that supplies it |
| --- | --- | --- | --- |
| **Confirm step** · `#cfCard` | `--surface-sunken` `--border` `--text-1/2/3` `--r-inner`, type scale | `{ said: string, answers: [{ q, a }], exclude: [string] }` — **everything the founder said**, read back before anything runs. Nothing here is engine output and nothing here is editable in place; the composer is the edit | `platform.md` §4. *This row carried `approaches` and `outcomes` until 2026-09-09; both moved to **The map's axes** below, with the reason.* `exclude` is retired Q4, offered at the gate rather than asked in the round |
| **The map's axes** · part of the map's payload | `--border` `--text-1/2/3`, type scale | `{ approaches: [{ id, label }], holders: [{ id }] }` — **two lists, neither editable and neither vetoable.** `approaches` is **engine-generated over the result set** and becomes the columns; `holders` is **read off the patents** and becomes the rows, largest first. Both are ordered and `id` is the join key into the map below. **`holders` carries no `label`** — holder names render as bars by decision, so a name would be a field nothing may print | **AI魚骨** + 技術定義表 for `approaches`. The mechanism carries the product; the fishbone diagram never appears. Whether the scheme can be generated **over a set we supply** is `case.md` §9.52 — the one question this row still depends on |
| **Build progress** · the inline resolve | `--surface-sunken` `--text-1` `--dur-*` `--ease` | `{ steps: [{ label, state: 'pending' \| 'running' \| 'done' }], elapsedMs }` — a stage stream, not a percentage. **The shape is unchanged and what consumes it is not**: there is no build screen, so each view leaves its skeleton as its own data lands (`platform.md` §6a.5) and the `label` is read by the composer's narration rather than by a stage list | **AI分類Pro**. Needs stage-level progress. If the pipeline is one opaque call this degrades to six skeletons resolving at once, which is a worse product but not a broken one |
| **The map** · `matrixHTML`, `band`, `colTotal` | `--density-0`…`--density-4`, `--border`, `--surface`, the rising hatch | `{ cols: [label], rows: [{ label, counts: [int] }], total: int, shown: int }` — one count per intersection, **family-merged**. `cols` is the approaches; `rows` is the holders, and **every row's `label` is `null`** — the component renders a bar, and printing the word "null" in eight cells is what reading a set-level flag instead of the row got wrong. `shown` is what the cells sum to and **is always less than `total`**, because the map lays out the eight largest holders (§6.1). Density tone is derived client-side by `band(n, max)` *relative to the view's own maximum*, so no tone or threshold is ever sent | **`T-Map › Tech-Effx › Company`** + **同族合併** + **`Applicant/Assignee Merge`**. Without family merge one invention filed in nine countries counts nine times; **without assignee merge one company becomes five rows of the map**, which is `platform.md` §10.56 and the hardest requirement in this file |
| **The rising hatch** · part of `matrixHTML` | the 45° hatch `<pattern>` | `rows[].rising: [colIndex]` — which intersections are growing. **Requires the same grid over two time windows**, which is the one part of the map's shape we cannot derive from a single result set | 技術功效矩陣, run twice — or a field we do not know exists. See §4 |
| **The map's caption** · the widget's finding | `--text-1` `--text-2`, body scale | Nothing new — **derivable in full from `cols`, `rows` and `total`.** Recorded because it looks like generated content and is not | — |
| **Column selection** · `colTotal`, `MX_SEL` | `--mark-1` on the column **edge** only, inverting to `--text-inverse` over `--density-4` | Nothing new. The header total is summed client-side from the cells, so header and cells cannot disagree | — |
| **Rivals** · `sortRivals` | `--border`, table + `--state-*` for the row status | `{ holders: [{ name, patentsInScope: int, lastFiledYear: int, cells: [[rowIdx, colIdx]] }] }` — recency is a **separate field, not a sort of the count**: a rival who stopped filing in 2019 is a different fact from one filing now | **競合分析** + **名稱統一** + **同族合併**. Merged *by default*, not behind a toolbar toggle. Whether the coverage reaches US seed-stage entities is `case.md` §9.4 |
| **Filings over time** · `filingsChart` | `--chart-series` `--chart-trend` `--chart-unknown` `--chart-grid` `--border-strong` | `{ perYear: [{ year, count }], lagWindowYears: number }` — the trend is fitted over the **published points only**, so the incomplete window cannot pull the decline the caption exists to prevent a founder reading | **宏觀趨勢分析**. `lagWindowYears` is the open one — see §4 |
| **Lineage** · the most-cited table | `--border`, table scale | `{ mostCited: [{ title, holder, year, citedBy: int }] }` — three to five rows. **Not a network graph**: a citation graph is noise to someone with no patent background | **技術脈絡分析**, reduced. The hard part is `citedBy` counted *within scope* rather than globally — see §4 |
| **The list, its foot and the re-rank** · `renderSet`, `rebaseline`, `setRestore`, `setFilter` | `--surface` `--surface-sunken` `--border` `--text-1` `--state-live` `--state-expired` `--skeleton` `--skeleton-strong` | `{ patents: [{ id, skim: string, holder, year, status: 'live' \| 'expired', score: number }], order: [id], matched: int }` — **four fields per row and no more**, plus the score and the id the client keys on. A re-rank sends `{ anchors: [id] }` and returns `{ order: [id] }` over the *same* set: no patent enters or leaves, only the sequence changes. **The client keeps the arrival order and never overwrites it**, because that is what a reversal returns to and there is no second request for it. *The order is a first-class field and not an array index: it was implicit until 2026-09-09, and the whole of what that cost is that a re-rank could not survive the next render.* Rows are keyed by patent, not by position — the FLIP, the rail, the focus return and the reversal all resolve through that key. **Filtering to a cell or a holder sends nothing**: the client already holds every patent's cell, which is what makes `platform.md` §6a.3 free. **The foot's count is derived, never sent** — `SET_SHOWN of patents.length` — and `patents.length` is what is IN SCOPE, not what matched: the two differ by `binned`, and printing the wrong one beneath the standing chip is the invariant `platform.md` §6a.2 records breaking on 2026-09-11 | **AI速讀Pro in bulk** (`case.md` §9.11) + **名稱統一** + **法律狀態 per patent in bulk** (§9.7) for the four fields. Without the first this degrades to a list of titles, which is a search result rather than evidence. For `order`: **AI排序 · 關聯性排序**, specifically `相似專利` pointed at a result set rather than at one patent — **the one capability in this table that is not confirmed**, asked at `platform.md` §10.38 and §10.45. §11 records that if the answer is no, §4b loses the star and keeps everything else. *The set row and the drill-down row were separate until 2026-09-10 and described one list in two states; they are one row because they are one list.* **Later that day the per-row selection was deleted** (`platform.md` §6a.2): every patent in `patents` feeds every view, so there is no `selected` field, no cut and nothing for the client to send back about membership. **`score` now renders top right of the row** rather than last in it. **Sort and filter are client-side and send nothing** — `newest`/`oldest` read the `year` already on the row, and the two facets read `status` and `kind`; **jurisdiction is deliberately not a facet**, because `where` renders as a bar and a founder cannot check a filter on a value they cannot see. ***One row is populated as of 2026-09-10*** — patent 0 renders a real `skim`, `status`, `year` and `score` so the surface can be judged with words on it instead of only as a grid of bars, and **no real `holder` is named even there**: `CLAUDE.md` forbids naming a party, so the row carries **ACME Group** — the archetypal fictional company, which cannot be mistaken for data and so satisfies that rule's reason rather than evading it. A plausible-sounding invention would not. Every other row keeps its bar. The shape is unchanged either way — this is which fields the renderer prints, not which fields the payload carries |
| **The filter chip** · above the list | `--r-chip` `--border` `--text-2` | `{ row: label, col: label, n: int }` — **which intersection the founder clicked, and how many patents are in it.** *`n` must agree with the map's own cell count — the two are the same number and a client must not compute one from the other.* `row` is a holder and renders as a **bar** inside the chip; `col` is a generated word and renders as a word | Nothing new — a projection of the map's own payload. *This was the drill-down list's "plus the cell that was clicked" clause. **The shape survived the merge unchanged**, which is the useful part: it was right when it scoped a second list and it is right now that it drives a filter over the only one* |
| **The patent record** · `patentPaneHTML`, `pnFieldsHTML` | `--surface-sunken` `--text-2` `--r-inner`, `figure-s` for the claim numbers | `{ number, appno, kind, ipcMain, ipc: [symbol], holder, inventors: [name], filed, published, where, status, abstract: string, claims: [string] }` — **eleven identifiers, the abstract, and the claim set as published.** `claims` is an **array, one entry per claim**, not one blob: a patent numbers its claims and counsel is pointed at claim 4 by number. `inventors` and `ipc` are arrays for the same reason. **Nothing here may arrive as a rendered image** — §0, you cannot re-token a PNG — and nothing here may arrive *interpreted*: no highlight offsets, no decode. §7a.3's rule is a constraint on the payload as much as on the render. *It read "no highlight offsets, no decode, no score" until 2026-09-10 — the score is printed (`brief.md` §4) and travels on the list row above as well as here.* **The record's foot went on 2026-09-10** — a disclaimer and an unwired *Copy these details* button — which changes no field in this shape | | **The single largest ask in this file**, and §8.7 moved its row from `Omit · deferred` to `Match` when §9 entry 1 was un-deferred on 2026-09-09. Their record view holds all of it (`05` `06` `25`), so the fields plainly exist; §10.54 asks the one thing we cannot see, which is whether the claim text is reachable **as published** rather than only as their reading of it. **Two of their fields collapse to one of ours** — 文件種類 `U` and 申請類型 `model` say the same thing twice, so Terrain sends `kind` |
| **The handoff row** · `pnFieldsHTML(rec, PN_HANDOFF)` | inherits the record's `<dl>` | **Nothing new — a five-field projection of the record above**: `number, holder, where, status, ipc`. Recorded because it looks like its own shape and is not | **法律狀態** + **IPC**. Depth is `case.md` §9.6: full symbol or class only. **No longer provisional** — `platform.md` §7a.3 closed for the record pane on 2026-09-09, and this stopped being a row-level disclosure and became a subset of it. *It survived the decision it was hedging against, which is the useful thing about having built it* |
| **Status chip** · `.status` | `--state-live` `--state-expired` + their tints | `'live' \| 'expired' \| 'pending'` | **法律狀態**. One word per row, and the most decision-relevant fact a US founder gets from the product |
| **Share pie + ranked bars** · `sharePie`, `shareBars` | `--mark-1` `--mark-2` `--mark-3` + `--mark-3-hatch` at line scale, `--surface` stroke | `{ slices: [{ label, count }], total: int }` — **`total` is the whole scope, not the sum of the slices shown.** Everything below the third slice folds into *Other* and takes no mark of its own | `Company › Share`, and **`Country › Distribution` from 2026-09-10** — the same two components render *Where it is filed*, third on `Market` (`platform.md` §6.6), where `slices[].label` is a jurisdiction and **renders as a word rather than a bar**. *That is now their only rendering: the Rivals widget page they were first built for is gone.* **One correction travels with this row:** IPtech's denominator is the five rows the analyst selected, so screen `29` reads 25.93% for a holder with 7 of 102. Ours is share of scope |
| **Holder comparison** · `holderBars`, `hbSync` | `--mark-1` for the tracked holder, `--mark-off` for the rest, `--surface-sunken` track | `{ holders: [{ id, patents: int, inventors: int }] }` — **two measures, two charts, never two axes.** Each panel sorts by its own measure | `Company › Ranking`. Sorting separately is what makes the finding visible: in the observed data the holder top by patent count fields the *fewest* inventors — 7, against 20 from a holder with 4 patents |
| ~~**Landscape summary**~~ · *deleted 2026-09-10* | — | ~~`{ lead: string, rows: [{ widget: label, lines: [string] }] }`~~ — **the component is gone with the chat panel that was its only entrance** (`platform.md` ~~§5~~, ~~§7a.4~~). The shape is kept struck rather than removed because §7a.8's deliverable would need the same one | Was **技術脈絡分析** — the candidate is now homeless, `platform.md` §11 |
| **Version history** · `renderHist`, `addVersion` | `--border`, `--r-chip`, label scale | `{ versions: [{ label, createdAt, isCurrent }] }` — **Terrain-owned.** Labels are the founder's own scope changes, *"removed plastic propellers"*. *A second label — "narrowed to 96 of 162", written when a selection settled — was added and removed the same day with the selection itself (`platform.md` §6a.2). **A version is written for a scope change and nothing else.*** *It has moved three times in two days — a popover in the dashboard head, a nested list in the sidebar, and a nested list in the masthead's project switcher — and **the shape never changed once.** That is the point of recording it: three placements cost no engine capability at all* | None. Recorded so the seam is complete: a chat log is not something a founder can reason about; a list of decisions is |
| **Project switcher** · the masthead menu | `--surface-sunken` `--text-2`, `--skeleton` | `{ projects: [{ id, name, updatedAt }] }` | **專案** *if* projects live in IPtech and are reachable programmatically; Terrain-owned if not. We do not know which — see §4 |
| **Delta pill** · `.delta` | `--state-up` `--state-down` + tints, `--r-chip` | `{ value: number, previous: number }` — the same measure at two time points | **None identified.** Specced in the stylesheet and applied nowhere, because we hold one time point — see §4 |
| **Usage meter** · `renderPoints`, `spendPoints` | `--text-2` `--text-3`, `figure-s` tabular | `{ balance: int, costPerRun: { runType: int } }` — a **balance**, not a percentage and not a quota. The cost is per completed run, so the two numbers are consistent by construction. *The charge lands when the gate is approved, not when the views finish resolving — `platform.md` §6a.5. That is a timing rule and not a shape change.* *`costPerRun` was a single int until 2026-09-08: screen `32` shows the price differs per module by a factor of ten, so one number cannot carry it* | **Usage metering in points** (`platform.md` §8.2, reversed to *Match* 2026-09-08). Which unit it counts is `platform.md` §10.34 — per API call or per UI action — and the answer changes `costPerRun`, not the shape |
| **Balance card + arc meter** · `renderUsage`, `usRing` | `--surface-sunken` track, `--mark-1` fill, `figure-xl` + `.fig-sub`, `micro` | `{ balance: int, allowance: int, periodEnd: date }` — the **allowance is the new field**, and it is the only thing on any surface that presupposes a plan shape. `periodEnd` renders as a bar | Nothing from the engine. `allowance` and `periodEnd` are **ours**, and they do not exist until pricing closes (`platform.md` §11) |
| **Run-type cards** · `usCards`, `usCount` | `.rt`, `--border`, `micro` + `figure-l` + a 12px unit | `{ runs: [{ type, points: int, count: int }] }` **for the whole period**, plus `costPerRun` above. `≈N more` is `balance / costPerRun[type]` and is computed, never returned. *Static — the `selected` flag came out with the isolate control on 2026-09-09* | Derived from the ledger below. The **mapping** from our five run types to your modules is `platform.md` §7a.9 — one map build is `魚骨通` plus `分類通` over every record in the set |
| **Usage bars** · `usBars` | `.hb.ub` — `--mark-off` on every bar, `--surface-sunken` track | Same `runs` array. Shares are computed from it; **no percentage is ever returned**, so the denominator cannot disagree with the bars | Derived. Nothing new |
| **Columns** · `usColumns`, `usBins`, `usStep` | `--chart-series`, `--border` grid | `{ daily: [{ date, byType: { runType: int } }] }` — **one entry per day, run counts not points**, so the series and the cards cannot drift. Weekly and monthly are binned here, never requested. This is the one genuinely new shape on the page | **The per-run ledger behind the meter, and the page's only real dependency.** `platform.md` §10.34 asked in the form that matters: a balance alone cannot draw this. If only a running total is exposed, this component and the one below do not exist and the rest of the page still does |
| **Runs list** · `usRecent` | `.ur` on 1px `--border` dividers, `figure-m`, `.seg` sort | `{ recent: [{ date, runType, subject, points: int }] }` — `date` and `subject` are **identities and render as bars**; a rebuild's `subject` is its change label. Sorted client-side by date or cost, so **no `sort` parameter is needed** | Same ledger. Also the join to `platform.md` §5 — every rebuild row is a version of a map, and `subject` is the version's label |

### Three notes on **Confirm step**, **The map's axes** and **The map**

*They are here rather than in the table because they are about how rows join, and a cell has
nowhere to say that. Rewritten 2026-09-10 — the direction settled and one of the three questions
stopped existing.*

**The join is inside one component, and that is the whole of it.** The two lists and the map they
lay out were once on different surfaces, joined by nothing: the confirm step returned `approaches`
and `outcomes` as `[{ id, label }]`, the map returned `cols: [label]` and `rows: [{ label, counts }]`,
and there was **no direction** — nothing said which list became which axis — and **no key**, because
a flat `[label]` array cannot carry an `id`. A rename or a reorder had nothing to travel on.

**None of that is a live problem, because none of those acts exists.** The axes arrive with the map,
in one payload: **`approaches` are the `cols`, `holders` are the `rows`**, and the join is position
within one component. Nothing renames, reorders, removes or adds. **The `id` is still specified**
because an engine returning the axes needs to name them, but nothing in the client depends on it.

***The direction reversed twice and the row above states only its current form.*** It was
`approaches` → `rows` until the 2026-09-10 transpose, then `approaches` → `cols` with `outcomes` →
`rows`, and now `approaches` → `cols` with `holders` → `rows`. **A component contract is the one
place a superseded direction must not be left standing**, because a reader implementing from it
cannot tell which sentence is live — so the amendment trail is this paragraph and the row is simply
right.

**One consequence for `The map` that the table cannot hold.** Its `total` is the scope — patents
retrieved — while `shown` is what the cells sum to. **They are never the same number**, because the
map lays out the eight largest holders and the corpus has more. *That was a condition an axis edit
could produce, and it is now the state on arrival* — which is why `shown` is a field rather than
something the client adds up. **A client must not derive one from the other**, and the field exists
so the reconciling sentence on the card never has to be computed from the cells, which would make it
silently wrong the moment a filter is applied.

**And a re-tick does not re-request anything.** `platform.md` §6a.2 lets the founder untick rows in
the list and redraw the views over what is left. **The columns are computed once, at the gate, and a
re-tick never regenerates them** — only the counts move, and the client already holds every patent's
cell. So the interaction that looks most like a new request is the one that makes none.

## 2 · Specced, not built

The remaining `Diverge` chart forms, plus one row that needs the data and no chart. **They are
blocked by data, not by design** — the illustrative set does not carry what they need, and drawing a
shape from numbers we do not hold is the one thing our skeleton contract forbids. Specs are in
`design-language.md` §7. These shapes are `platform.md` §10.22, asked as one question.

***Three of the five are now blocked by something else as well, and it is worse than data.*** The
radar, the chord and the expandable tree were specced for the Rivals widget page, and that surface
was abolished on 2026-09-10 (`platform.md` ~~§7a.2~~). **They have no destination**, which is a
different kind of blocked from having no data: §10.1 would unblock the data and change nothing
about where they go. `platform.md` §11 carries the question. *They stay in this table because the
shapes are still what we would ask for, and because a shape deleted for want of a home is a shape
someone re-derives.*

**Naming the shape is the point of these rows.** It is how we find out whether the data exists.

| Form | Yours | Data shape it needs | What we hold |
| --- | --- | --- | --- |
| **Radar** | `Company › Research Ability` (`04`) | `{ holders: [{ id, rdCapability, patentAge, inventorCount, activeYears }] }` — four axes | One of the four. Capped at three series, one tracked at `--mark-1`, the rest `--mark-off`. **Three overlapping neutral rings is the open problem** — with no hue, a radar's series separate on stroke weight and dash rather than fill |
| **Chord + N×N** | `Company › Cross Reference` (`08`) | `{ pairs: [[fromHolderIdx, toHolderIdx, count]] }` — a **directed** citation pair matrix | Nothing. Direction is the information; the ribbons are not, so the N×N reuses the density ramp and the diagonal takes `--surface-sunken` |
| **Expandable tree** | `Company › Activity` (`09` `09b`) | `{ holders: [{ id, activeYears: [year] }] }` — a filing span per holder on one shared axis | Nothing |
| **Donut + stacked** · *built to skeleton 2026-09-10* | `Company-Legal Status` (`21`) | `{ holders: [{ id, live: int, expired: int }] }` — legal status per holder **for this project** | Screen `21` is a different dataset; mixing them would be worse than a skeleton. Takes the state hues, not `--mark-*` — live and expired are ordinal. **This row has a destination** — *Live and expired*, fourth on `Market`, `platform.md` §6.7. It is drawn and it is still blocked: the shape is real, the numbers are skeleton, and §10.1 is what changes that. **It stays in this table**, because building a form against the skeleton contract is not the same as holding the data |
| *(no chart)* — the Filings caption | `Patent Count - Life Cycle` (`20`) | `{ perYear: [{ year, patents: int, assignees: int }] }` — **the only row here that feeds a sentence rather than a chart.** Filings per year cannot distinguish a few holders filing hard from many holders arriving, and those are opposite situations for a founder | Nothing. We specced your phase-space trajectory and then withdrew it: your own index calls both charts near-unreadable at ~50 self-crossing labelled points, so Terrain computes the reading and states it in words |

---

## 3 · Reads tokens, needs no engine data

The structural layer. Listed once rather than as rows, because a data-shape column reading *none*
fifteen times is filler:

> the shell and its masthead · the project switcher · the profile row and menu · the widget card ·
> the info affordance · the segmented control, including the `Market` / `Technology` **toggle** ·
> the list's **sort and filter menus** · the list's **star prompt** · the record's overlay · the
> composer · the thread and its reveal · buttons · the skeleton bars themselves.

*Four entries left that list on 2026-09-10: the sidebar's **collapse toggle and its 64px rail**,
the **slide-over**, the **chat panel** and its overlay machinery, and the **row checkbox**. The
overlay machinery the slide-over carried — the focus trap, the Escape handling, the `--ease-drawer`
curve — survives in the one overlay named above, so what went there is a container rather than a
capability.*

***Two arrived, and one of the four departures was reversed inside the day.*** The
`Market` / `Technology` toggle was deleted with the dashboard and **restored the same evening**
(`platform.md` §6.5) — it reads tokens and needs no engine data either way, which is why it costs
nothing to have been wrong about. **The list's sort and filter menus are genuinely new** and belong
in this section rather than in §2 above: *both are computed entirely client-side over data the list
already holds*, which is the whole reason they are cheap. `newest`/`oldest` read the `year` the row
already carries; the facets read `status` and `kind`, which are already printed as words. **A
jurisdiction facet was refused for exactly the reason this section exists to make visible** — it
would have needed a value the payload renders as a bar, so the filter would have been unverifiable
by the person using it.

*The composer is listed once, not "at both its sizes" — the second size was the chat panel's.*

***One more arrived on 2026-09-10 and one left: `.set-cta`, the star's prompt, and `.set-foot`.***
The prompt reads tokens and needs no engine data — it is one sentence and the `Re-rank` button,
shown by the same expression that enables that button, so it cannot offer an action already done.
It replaced the foot, whose only two children were a standing note (now in the heading's info
popover) and that button. **Both are the `.set-run` collapse reused rather than a new mechanism**,
which is why neither costs anything in this table.

Each is specced in `design-language.md` §7 and reads semantic tokens only. *Add to that list, from
2026-09-08: the control rail — the appearance control and the meter's chrome — and the attribution
line, whose only non-token value is Innovue's own mark. Both moved hosts on 2026-09-10, to the
masthead and to the foot of the right pane, and neither gained or lost a data dependency in
moving.*

**No component in Terrain references a primitive or a raw hex**, and dark mode is therefore a swap of
**41** semantic tokens with no component CSS touched. *This read "~21" and `design-language.md` §10
read "30"; both were estimates made before the pass and both were wrong. 41 is counted from the
implementation, and §10.3 lists them.*

*The claim above was also **false when it was written**, which is the part worth keeping.* Eleven
components reached past the semantics into `--n-*` or wrote an alpha inline, and every one of them
would have stayed light while reporting nothing — the CSS reads as correct either way. They were
fixed as the prerequisite to the dark pass; `design-language.md` §3.2 lists them and the four tokens
that had to be added. **Two greps prove the condition now, and they are the check to re-run**: raw
**Cut the three token-defining blocks and the comments first** — `:root`, the dark media block and
`:root[data-theme="dark"]` all contain raw hex by definition, so a naive "after `:root`" grep reports
dozens of false positives, and a check nobody can pass is a check nobody runs. `design-language.md`
§3.2 states it precisely. A rule nothing greps is a rule that has already been broken.

---

## 4 · What we could not name — and these are questions, not gaps

Writing the third column is what produced this list. A component whose data shape we cannot name is
not a hole in the manifest; it is a question we had not yet asked.

**All eight are in the canonical list** at [`docs/case.md`](../docs/case.md) §9, mirrored at
[`docs/platform.md`](../docs/platform.md) §10. They are kept here with their canonical numbers so
each stays attached to the component that raised it — that link is the argument, and a bare list of
questions loses it. Where this file and §9 differ, **§9 wins.**

*Checked against the list on 2026-09-10, after two questions were retired moot and two were added.
**All eight of these survive** — none of them was §9.2 or §9.13, and none of the numbers moved,
because both lists are append-only and a retirement strikes a number rather than reusing it.
Question 1 is the one whose weight changed.*

1. **→ `case.md` §9.17** · **Rising, over what window?** The map's hatch marks intersections that are growing, which needs
   the same grid computed over two time windows. Is that a parameter on the matrix run, a field on
   the result, or must we run the analysis twice and diff it ourselves? This is the only part of the
   hero's shape we cannot derive from a single result set.

   ***This got more load-bearing on 2026-09-10 and is now the most consequential question in this
   section.*** The map's legend used to carry three named zones and a hatch; it carries a density
   scale and the hatch, and **`Rising` is the only *word* left on it** (`platform.md` §6.1). So the
   hatch is no longer one channel of several — it is the entire second dimension of the hero
   widget, and if this question comes back *"run it twice"*, the cost of the map's second channel
   doubles the cost of the map. **If it comes back *"you cannot"*, the map is one channel and the
   legend is a ramp.**
2. **→ `case.md` §9.18** · **Citation counts within scope.** Lineage ranks by *most cited in scope*. Is `citedBy` available
   per patent, and can it be counted against the result set rather than globally? A global count
   ranks famous patents; a scoped one ranks the ground this idea grew out of.
3. **→ `case.md` §9.21** · **Two time points, for a delta.** The delta pill is built and applied nowhere. Does the engine
   expose the same measure at an earlier date, or must Terrain snapshot every run and diff its own
   history? The second is buildable; it just changes what we store and what a subscription costs.
4. **→ `case.md` §9.16** · **Publication lag — a field, or an inference?** Our chart carries it as a single scalar in years.
   Is lag available per record, or must it be inferred per jurisdiction? The shading is mandatory
   (`platform.md` §6.3), so it has to be computed from something.
5. **→ `case.md` §9.22** · **Distinct assignees per year.** No longer a chart axis — we withdrew the
   phase-space redraw — but still the input the Filings caption computes *early or late* from. A
   field, or something we derive by walking a full result set? That changes the cost per run rather
   than the feasibility. Folded into §9.22 with the four chart shapes, since they share one blocker.
6. **→ `case.md` §9.19** · **技術脈絡分析's output — structured, or rendered?** `Switch To Ai Insight` produces a three-era
   narrative and five named concepts with representative patents. Is that reachable as structured
   concepts, or only as the rendered panel inside your UI? Adjacent to the identification question,
   but not the same one.
7. **→ `case.md` §9.23** · **Projects — yours or ours?** Can a 專案 be created, listed and reopened programmatically, and
   what does one contain? It decides whether the project rail is a view of your object or a Terrain
   object that happens to hold a query.
8. **→ `case.md` §9.20** · **Does a result return what was excluded?** An analyst working in
   `Hierarchy` assigns by hand and bins what does not fit — at the scale our illustrative set
   models, 41 of roughly 158, leaving 117 in scope. **Terrain has no analyst to do that
   discarding.** Does a programmatic result return the excluded set, or only the kept one — and if
   only the kept one, is the kept/discarded decision made by the engine or by the person? This bears
   on whether our counts and yours are comparable at all, and we would rather raise it than assume.

**One row generated no question and that is worth saying:** the map's caption, which looks like
generated content and is derivable in full from the counts we already need. The interface's most
persuasive single sentence costs nothing extra.
