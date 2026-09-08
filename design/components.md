# TIS Terrain — component manifest

> **What each component reads, what it needs from your engine, and which IPtech capability supplies
> it.** Version **0.3.0**, 2026-09-08.
>
> *This lived at `design/tokens/components.md` until 2026-09-08, alongside a generated token
> extraction. The extraction is gone — it was a copy of a document that already exists, and
> `docs/design-language.md` is the source anyone would regenerate it from. This file is not a copy
> of anything, so it stays.*
>
> The source of truth for every component spec here is
> [`docs/design-language.md`](../docs/design-language.md) §7; for every capability claim, the
> fifty-nine-row ledger at [`docs/platform.md`](../docs/platform.md) §8. Where this file and those
> disagree, **they win.**

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

Twelve of the seventeen `Diverge` rows in `platform.md` §8.1 are built. Listed below are the
components that consume engine data — which is those twelve plus the Terrain-owned pieces that sit
between them, so the seam is complete rather than only its interesting half.

| Component | Tokens it reads | Data shape it needs | Capability that supplies it |
| --- | --- | --- | --- |
| **Confirm card** · `#cfCard`, `addRow`, `commitEdit` | `--surface` `--border` `--text-1/2/3` `--r-widget`, type scale | `{ said: string, approaches: [{ id, label }], outcomes: [{ id, label }] }` — one sentence decomposed into the map's rows and columns, editable before anything runs | **AI魚骨** + 技術定義表. The mechanism carries the product; the fishbone diagram never appears. Whether the outcome axis can be generated at all is `case.md` §9.2, the highest product risk we carry |
| **Build progress** · `runBuild` | `--surface-sunken` `--text-1` `--dur-*` `--ease` | `{ steps: [{ label, state: 'pending' \| 'running' \| 'done' }], elapsedMs }` — a stage stream, not a percentage | **AI分類Pro**. Needs stage-level progress. If the pipeline is one opaque call this degrades to a spinner, which is a worse product but not a broken one |
| **The map** · `matrixHTML`, `band`, `colTotal` | `--density-0`…`--density-4`, `--border`, `--surface`, the rising hatch | `{ cols: [label], rows: [{ label, counts: [int] }], total: int }` — one count per intersection, **family-merged**. Density tone is derived client-side by `band()` *relative to this matrix*, so no tone or threshold is ever sent | **技術功效矩陣** + **同族合併**. Without family merge one invention filed in nine countries counts nine times and the map's whole grammar stops meaning anything |
| **The rising hatch** · part of `matrixHTML` | the 45° hatch `<pattern>` | `rows[].rising: [colIndex]` — which intersections are growing. **Requires the same grid over two time windows**, which is the one part of the map's shape we cannot derive from a single result set | 技術功效矩陣, run twice — or a field we do not know exists. See §4 |
| **The map's caption** · the widget's finding | `--text-1` `--text-2`, body scale | Nothing new — **derivable in full from `cols`, `rows` and `total`.** Recorded because it looks like generated content and is not | — |
| **Column selection** · `colTotal`, `MX_SEL` | `--mark-1` on the column **edge** only, inverting to `--text-inverse` over `--density-4` | Nothing new. The header total is summed client-side from the cells, so header and cells cannot disagree | — |
| **Rivals** · `sortRivals` | `--border`, table + `--state-*` for the row status | `{ holders: [{ name, patentsInScope: int, lastFiledYear: int, cells: [[rowIdx, colIdx]] }] }` — recency is a **separate field, not a sort of the count**: a rival who stopped filing in 2019 is a different fact from one filing now | **競合分析** + **名稱統一** + **同族合併**. Merged *by default*, not behind a toolbar toggle. Whether the coverage reaches US seed-stage entities is `case.md` §9.3 |
| **Filings over time** · `filingsChart` | `--chart-series` `--chart-trend` `--chart-unknown` `--chart-grid` `--border-strong` | `{ perYear: [{ year, count }], lagWindowYears: number }` — the trend is fitted over the **published points only**, so the incomplete window cannot pull the decline the caption exists to prevent a founder reading | **宏觀趨勢分析**. `lagWindowYears` is the open one — see §4 |
| **Lineage** · the most-cited table | `--border`, table scale | `{ mostCited: [{ title, holder, year, citedBy: int }] }` — three to five rows. **Not a network graph**: a citation graph is noise to someone with no patent background | **技術脈絡分析**, reduced. The hard part is `citedBy` counted *within scope* rather than globally — see §4 |
| **Drill-down list** · `openDrill`, `DRILL_ROWS` | `--surface` `--border` `--state-live` `--state-expired` `--skeleton` | `{ patents: [{ skim: string, holder, year, status: 'live' \| 'expired' }] }` — four fields per row and nothing else | **AI速讀Pro in bulk** (`case.md` §9.11) + **名稱統一** + **法律狀態 per patent in bulk** (§9.7). Without the first this degrades to a list of titles, which is a search result rather than evidence |
| **The handoff row** · `.handoff` inside each drill row | `--surface-sunken` `--text-2`, `--r-chip` | `{ number, holder, jurisdiction, status, ipc: [symbol] }` — five identifiers, copyable | **法律狀態** + **IPC**. Depth is `case.md` §9.6: full symbol or class only. **Built provisionally** — `platform.md` §7a.3 has not chosen between this row and a detail page |
| **Status chip** · `.status` | `--state-live` `--state-expired` + their tints | `'live' \| 'expired' \| 'pending'` | **法律狀態**. One word per row, and the most decision-relevant fact a US founder gets from the product |
| **Share pie + ranked bars** · `sharePie`, `shareBars` | `--mark-1` `--mark-2` `--mark-3` + `--mark-3-hatch` at line scale, `--surface` stroke | `{ slices: [{ label, count }], total: int }` — **`total` is the whole scope, not the sum of the slices shown.** Everything below the third slice folds into *Other* and takes no mark of its own | `Company › Share`. **One correction travels with this row:** IPtech's denominator is the five rows the analyst selected, so screen `29` reads 25.93% for a holder with 7 of 102. Ours is share of scope |
| **Holder comparison** · `holderBars`, `hbSync` | `--mark-1` for the tracked holder, `--mark-off` for the rest, `--surface-sunken` track | `{ holders: [{ id, patents: int, inventors: int }] }` — **two measures, two charts, never two axes.** Each panel sorts by its own measure | `Company › Ranking`. Sorting separately is what makes the finding visible: in the observed data the holder top by patent count fields the *fewest* inventors — 7, against 20 from a holder with 4 patents |
| **Landscape summary** · `summarise`, `summaryNode` | `--surface`, body scale, the thread's reveal timing | `{ lead: string, rows: [{ widget: label, lines: [string] }] }` — the four widgets' findings assembled, no new claim | `platform.md` §7a.4. Candidate source is **技術脈絡分析** — see §4 |
| **Version history** · `renderHist`, `addVersion` | `--border`, `--r-chip`, label scale | `{ versions: [{ label, createdAt, isCurrent }] }` — **Terrain-owned.** Labels are the founder's own scope changes, *"removed plastic propellers"* | None. Recorded so the seam is complete: a chat log is not something a founder can reason about; a list of decisions is |
| **Project rail** · the sidebar list | `--surface-sunken` `--text-2`, `--skeleton` | `{ projects: [{ id, name, updatedAt }] }` | **專案** *if* projects live in IPtech and are reachable programmatically; Terrain-owned if not. We do not know which — see §4 |
| **Delta pill** · `.delta` | `--state-up` `--state-down` + tints, `--r-chip` | `{ value: number, previous: number }` — the same measure at two time points | **None identified.** Specced in the stylesheet and applied nowhere, because we hold one time point — see §4 |

---

## 2 · Specced, not built

The four remaining `Diverge` chart forms, plus one row that needs the data and no chart. **They are
blocked by data, not by design** — the eVTOL capture does not carry what they need, and drawing a
shape from numbers we do not hold is the one thing our skeleton contract forbids. Specs are in
`design-language.md` §7. These five shapes are `platform.md` §10.22, asked as one question.

**Naming the shape is the point of these rows.** It is how we find out whether the data exists.

| Form | Yours | Data shape it needs | What we hold |
| --- | --- | --- | --- |
| **Radar** | `Company › Research Ability` (`04`) | `{ holders: [{ id, rdCapability, patentAge, inventorCount, activeYears }] }` — four axes | One of the four. Capped at three series, one tracked at `--mark-1`, the rest `--mark-off`. **Three overlapping neutral rings is the open problem** — with no hue, a radar's series separate on stroke weight and dash rather than fill |
| **Chord + N×N** | `Company › Cross Reference` (`08`) | `{ pairs: [[fromHolderIdx, toHolderIdx, count]] }` — a **directed** citation pair matrix | Nothing. Direction is the information; the ribbons are not, so the N×N reuses the density ramp and the diagonal takes `--surface-sunken` |
| **Expandable tree** | `Company › Activity` (`09` `09b`) | `{ holders: [{ id, activeYears: [year] }] }` — a filing span per holder on one shared axis | Nothing |
| **Donut + stacked** | `Company-Legal Status` (`21`) | `{ holders: [{ id, live: int, expired: int }] }` — legal status per holder **for this project** | Screen `21` is a different dataset; mixing them would be worse than a skeleton. Takes the state hues, not `--mark-*` — live and expired are ordinal |
| *(no chart)* — the Filings caption | `Patent Count - Life Cycle` (`20`) | `{ perYear: [{ year, patents: int, assignees: int }] }` — **the only row here that feeds a sentence rather than a chart.** Filings per year cannot distinguish a few holders filing hard from many holders arriving, and those are opposite situations for a founder | Nothing. We specced your phase-space trajectory and then withdrew it: your own index calls both charts near-unreadable at ~50 self-crossing labelled points, so Terrain computes the reading and states it in words |

---

## 3 · Reads tokens, needs no engine data

The structural layer. Listed once rather than as rows, because a data-shape column reading *none*
fifteen times is filler:

> the shell and sidebar · the collapse toggle and its 64px rail · the profile row and menu · the
> widget card · the info affordance · the segmented control · the slide-over · the composer, at both
> its sizes · the thread and its reveal · buttons · the skeleton bars themselves.

Each is specced in `design-language.md` §7 and reads semantic tokens only. **No component in Terrain
references a primitive or a raw hex** — one grep proves it, and it is what makes a dark theme cheap
later: redefine ~21 semantic tokens, touch no component CSS.

---

## 4 · What we could not name — and these are questions, not gaps

Writing the third column is what produced this list. A component whose data shape we cannot name is
not a hole in the manifest; it is a question we had not yet asked.

**All eight are now in the canonical list** at [`docs/case.md`](../docs/case.md) §9, mirrored at
[`docs/platform.md`](../docs/platform.md) §10. They are kept here with their canonical numbers so
each stays attached to the component that raised it — that link is the argument, and a bare list of
questions loses it. Where this file and §9 differ, **§9 wins.**

1. **→ `case.md` §9.17** · **Rising, over what window?** The map's hatch marks intersections that are growing, which needs
   the same grid computed over two time windows. Is that a parameter on the matrix run, a field on
   the result, or must we run the analysis twice and diff it ourselves? This is the only part of the
   hero's shape we cannot derive from a single result set.
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
8. **→ `case.md` §9.20** · **Does a result return what was excluded?** The observed project reaches 102 patents because an
   analyst discarded 33 of ~135 in `Hierarchy` by hand. **Terrain has no analyst to do that
   discarding.** Does a programmatic result return the excluded set, or only the kept one — and if
   only the kept one, is the kept/discarded decision made by the engine or by the person? This bears
   on whether our counts and yours are comparable at all, and we would rather raise it than assume.

**One row generated no question and that is worth saying:** the map's caption, which looks like
generated content and is derivable in full from the counts we already need. The interface's most
persuasive single sentence costs nothing extra.
