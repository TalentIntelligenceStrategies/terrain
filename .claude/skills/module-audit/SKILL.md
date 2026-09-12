---
name: module-audit
description: Walk one module of IPtech (or another vendor's product) view by view from captures, rate every view from a US founder's perspective, update the outbound ask to Innovue, build what survives, and reconcile the record. Use when a folder of captures of a vendor module arrives, when asked to audit M-Map / T-Map / Tech-Effx / a competitor surface, or when told to "go through the screenshots and see what we'd adopt". Triggers on module audit, mmap, m-map, tmap, t-map, Tech-Effx, IPtech audit, the ask to Innovue, feature-request sheet, adopt into Terrain.
---

# Module audit

**One module of somebody else's product, walked end to end, turned into three things:
a record, an ask, and widgets.** Proven on `M-Map` 2026-09-12 — 59 captures, 60 views, four
widgets shipped. `T-Map` is the next run and §5 below is already scoped for it.

Read [CLAUDE.md](../../../CLAUDE.md) first. This skill assumes its rules and does not restate them.

---

## 0 · Before anything else — the scrub

**A capture of a real project has entered the session. Grep the tree for every proper noun on it
before writing a line.** This is `CLAUDE.md`'s rule and it is first here because it is the step
that gets skipped.

```bash
# build the list BY LOOKING AT THE CAPTURES — assignees, inventors, examiners,
# patent numbers, AND every classification code on an axis
while IFS= read -r n; do
  r=$(git grep -l -F -- "$n") && echo "LEAK: $n -> $r"
done < /tmp/nouns.txt
```

**Classification codes count.** One code is a published WIPO string. **The tuple of five on those
axes is the landscape** — it names the industry, the problem and the approach, which is the whole
of what the analyst was paid to find. Record the *form* (*"five level-4 codes on the axes"*), never
the codes.

> ***`tools/check-publish.py` gate 3 cannot help and you must not rely on it.*** It matches a
> hardcoded list of names from leaks already found, and **no entity from a new capture set is on
> it.** It reports clean on every new landscape. *Extending it is also not the fix — `tools/` is
> tracked in a public repo, so adding the names would publish them.* Open problem, recorded at
> `docs/mmap-audit.md` §7.

**The test the audit must pass:** delete every proper noun and every number from it and it still
says everything it says. If a sentence dies, it was carrying a payload, not an argument.

---

## 1 · The four passes

Run them in order. Each has a gate that must pass before the next starts.

| Pass | Does | Gate |
| --- | --- | --- |
| **A** | `docs/<module>-audit.md` — every view, one row each | Scrub passes on the new file alone |
| **B** | The ask — `design/previews/iptech-feature-request.html` | Still paginates; every page label right |
| **C** | Build the widgets into `design/previews/terrain-prototype.html` | Gates, both themes, both greps |
| **D** | Reconcile `docs/` — the record is the source of truth, the prototype is a view of it | The ledger's arithmetic balances |

**Do not reorder.** B before C stops the build narrowing the ask, which is the coupling
`platform.md` §8 cut on 2026-09-07: *a capability left off the ask is one Innovue never tells us
about; a capability asked about and later dropped costs nothing.*

---

## 2 · Pass A · the audit document

One row per **view the menu reaches** — not per screen photographed. That distinction is the whole
value: `platform.md` §8.1 is the screenshot grain and it missed seven whole `M-Map` groups.

Columns: `View (their label) | ZH | Chart form | What it answers | Read`

- **`Read` is `Adopt` · `Ask` · `Skip`**, deliberately different words from §8's five verdicts so
  nobody confuses an audit rating with a scope decision. **§8 wins on what gets built.**
- **ZH is an em-dash when we hold no confirmed name.** Inventing a plausible translation is
  fabrication — the same discipline as the skeleton bars. *We hold four names across `M-Map`'s
  sixty.* How many exist is itself an ask.
- **Record the disagreements with `platform.md` §8 in their own section** rather than resolving
  them quietly. Three came out of the `M-Map` pass and two changed the product.

**Sections that earned their place:** §0 the client-data rule · §1 the shell every view shares ·
§2 what the twinned panes mean · §3 the groups · §4 structural findings · §5 the rating totals ·
§6 disagreements with §8 · §7 what the captures do not show.

---

## 3 · The five findings that recur

These came out of `M-Map` and are worth **checking for** rather than rediscovering.

1. **Two charts per view is a methodology choice, not two analyses.** Publication year against
   application year; main classification against all; all contributors against primary. So sixty
   views are about thirty analyses shown twice, and the user is handed a decision they cannot
   make. **Terrain's form is one chart and a stated default** — `Appl. Year`, all classes, all
   contributors.
2. **Radar where a matrix table sits underneath it.** Axes are arbitrary, enclosed area is
   meaningless, rotation changes the shape and nothing else. **Adopt the table, never the radar.**
3. **A number on every point.** Forty labels on a forty-year series. `dataviz` names it an
   anti-pattern in the same words. Label the endpoints and the extreme; nothing else.
4. **Colour assigned by series index**, so an encoding that *does* carry meaning is drawn from the
   same arbitrary ramp and nothing says which is which.
5. **No view carries a sentence.** Sixty charts, zero findings. **Every widget we ship carries a
   derived caption** — derived, never typed, because a typed caption is a second source of truth
   and goes stale the first time a number moves.

---

## 4 · Pass C · building, and the three bugs only the render caught

Charts are **hand-rolled SVG strings and CSS grid. No library.** Reuse `HATCH_DEF`, `MARK`,
`markFill()`, `barStyle()`, `sk()`, `band()` so a swatch, a slice and a bar can never disagree.

**The palette decision, settled 2026-09-12: shadcn's chart *grammar*, Terrain's *palette*.** Take
the conventions — dashed cartesian grid, recessive ticks, 2px line, ringed marker, plot margins,
the tooltip card — and render them in tokens that already exist. **shadcn's `--chart-1…5` is
exactly what `design-language.md` §2 withdrew on 2026-09-05, at five times the scale. Do not
re-open it without being asked.**

> ***Render it and look at it. These three were invisible in the diff and obvious in the PNG:***
>
> - **A single-class selector losing on source order.** `.chart{height:150px}` is declared *after*
>   any block you add above it, so `.lc{height:auto}` never applied and the scatter letterboxed.
>   **Two classes.**
> - **A viewBox narrower than the render width.** At 520 in a ~1000px card everything scales 2× —
>   an 11px label lands at 21px. **Make the viewBox the render width** so svg units are CSS pixels.
> - **More categories than marks.** `barStyle()` holds three and everything past index 2 repeats
>   `--mark-2`, so six rows drew as three. **§3.7's "a fourth folds into Other" is enforced by that
>   function, not by discipline.**
>
> **And the stagger ladder.** It is written out per `nth-child`. Add a card and it falls through to
> a 0ms delay and arrives *before* the cards above it. **Adding a card means adding its line.**

**Two greps before the pass is done:** no component reads a `--n-*` primitive, none carries a raw
hex outside `:root`. Then both themes, then `bash tools/test-gates.sh <build>` — **add a gate, add
its test.**

---

## 5 · The T-Map run — pre-scoped

`platform.md` §8.3 already settles the shape, so this run starts further along than `M-Map` did.

**T-Map is `M-Map` plus a classification filter, plus eight `Tech-Effx` entries.** The 60 shared
views are **one analysis reachable two ways** — `Company - Count` under either map is identical but
for a `Classification` scope field which, left empty, renders the `M-Map` result exactly.

**So the T-Map audit is not another sixty rows.** It is:

1. **The eight `Tech-Effx` entries**, walked properly — the only genuinely new destinations.
2. **What the classification filter does to the shared sixty** — one section, not sixty rows.
   `docs/mmap-audit.md` covers those views already and must be cited, not duplicated.
3. **Group 5 of the ask**, the same treatment pages 2–3 got for `M-Map`.
4. **The `Technology` page**, which today is the map alone.

**Four things to carry in:**

- **`Tech-Effx › Company` is the hero's source** (`platform.md` §6.1) and it is a **T-Map-only**
  destination. §8.3 flags the concentration risk plainly: if it cannot run over a supplied result
  set (§10.52), the hero has no source and the fallback is a list.
- **`docs/tmap-audit.md` is already authorised** as the seventh `docs/` file, on the same bar, in
  CLAUDE.md. **That is the end of the family** — an audit file is admissible for a module walked
  end to end, not per topic.
- **Never write copy saying Terrain shows absence, whitespace or open ground.** One such line was
  found sitting in group 5 of the outbound sheet on 2026-09-12 and removed.
- **Two Terrain surfaces may need the classification axis** and `platform.md` §8.2 forbids it:
  IPC is *a confidence signal only, deliberately never a label*, because two technology axes on one
  page leaves the founder unable to tell which is authoritative. **That is a live disagreement, not
  a settled cut** — the ask asks for it anyway.

---

## 6 · Pass D · what always has to move

| File | Why |
| --- | --- |
| `docs/platform.md` §6 | The view roster and its order |
| `docs/platform.md` §8.1 | A row per newly-catalogued destination; **verdict changes argued, never overwritten** |
| `docs/platform.md` §8.5 | **Recount from the columns, not from the notes.** It has been wrong three times and every time the tables were right |
| `docs/design-language.md` §7 | A spec per new form, and any rule departed from |
| `design/components.md` | The data shape each widget needs from the engine; bump the version |
| `docs/case.md` **and** its rendered page | The one non-generated view — **change both in the same pass** |

**Then sweep for stale counts.** *"Six views"* survived in eleven places across five files after the
roster changed. `grep -rn` for the old number before committing.
