# New baseline — closing the gaps toward the three deliverables

> **HANDOFF DOCUMENT. Rewritten 2026-09-04 to be picked up cold; revised 2026-09-08.**
> **This file is canonical.** Older copies under `~/.claude/plans/` are session scratch and have
> drifted; ignore them. This is not a fifth `docs/` document — it is operational state, the same
> category as `KICKOFF-PROMPT.md`. `docs/` still holds four.
>
> **Phases 0 through 10 are done and committed** — eleven phases counting Phase 0. Phase 5 closed
> with the `Patent Count - Life Cycle` cell in Phase 7. Everything an incoming session needs is in
> §A–§F below; the phase specs are kept as the record of what was asked for.
>
> **Read in this order:** `CLAUDE.md` → `docs/brief.md` → `docs/platform.md` §8 →
> `docs/design-language.md` §2, §3.7, §7 → this file's §A–§F. **Every phase is closed** —
> see §G for what a next pass would pick up.
>
> **Phase 9 landed 2026-09-07 — a new step in the flow, and it moved the product, not just the
> render.** `platform.md` gained **§4a** (narrowing questions before the confirm card) and **§4b**
> (the set — what the search found, reviewed before the map is built). The moments went **five to
> six** and the surfaces **three to four**. Three recorded decisions were amended rather than
> worked around, each argued in place: **§2.2** (jurisdiction may be asked once — §9's standing
> filter is untouched), **§3** (a founder does select, once, at build time), and **§9** (the
> *not-relevant* dismissal un-deferred as §4b's star; the other five detail-page elements stay
> deferred). §6.1 gained a standing requirement: **the map says what it was built on**, because the
> founder's cut is now a second reason a cell can be empty. `§10.38` and `§10.39` were appended.
>
> **What is not done:** the comparison deck has no panel for the set step, and it is the strongest
> one available — `Hierarchy` is its direct counterpart. That needs a re-crop, a re-inline and a
> re-shrink, so it was left rather than half-done. See §G.
>
> **Phase 10, same day — the questions were given a job, and two defects were fixed.** An audit
> against §6 found that the confirm card's two lists feed **only** the matrix: Rivals, Filings and
> Lineage take nothing from it. So the division is now written down — **the questions decide the
> corpus, the card decides the map's shape** — and §4a carries a bank of six asked three-to-five
> adaptively, replacing the old two-or-three cap with a value rule. §4's example rows were corrected
> (they mixed three technology facets with an outcome), §6.1 records that our matrix is IPtech's
> transpose, and §10.40 asks about the definitions table — wizard step 2, the one screen never
> captured, and the layer the answers map onto.
>
> **Two defects, both measured rather than assumed.** The dashboard swallowed the first scroll:
> `.view` had no `pointer-events` guard, so a leaving view — `visibility:visible` for 220ms and a
> scroll container itself — ate the wheel. It only surfaced when the set surface arrived, because a
> leaving view paints above the arriving one only when it comes later in the DOM. Proven both ways
> with a hit-test probe. And a first build no longer asks *Open the map* after the founder pressed
> *Build the map*; the rebuild keeps its CTA, and `design-language.md` §7 now says the rule was
> always about the rebuild.

---

## §A · Where the work actually stands

The three deliverables are defined in `docs/case.md` under *What travels with this* and were not
invented by this plan.

**One document since 2026-09-04**, not three: `deliverables/terrain-the-case.html`, two tabs — the
case in four sections, and the prototype. Three documents plus a standalone deck was five artifacts
for one argument. **Start at [`deliverables/README.md`](deliverables/README.md)**, which is the
routing table.

| | The argument's three parts | State | Carried by |
| --- | --- | --- | --- |
| 1 | IPtech capability read, from a US founder's position | **Re-rated against the screens 2026-09-04.** The inventory ran 43 marketing-sourced rows while the ledger had been rebuilt against 31 captures; it is now **59 rows, 18 High**, and §8.6 says where every High-rated capability actually is | `platform.md` §8 + §8.6 → viewed by `case.md` §4–§5, document section 3 |
| 2 | Design pass | **Built and running on real data.** Two IPtech forms restyled, four specced, one closed by deciding it needs no chart, matrix column selection added. Carries a **component manifest** — per component, the data shape it needs from the engine. The entry field now takes four kinds of input (§2.2) | `case.md` §6 + `terrain-prototype.html` + `components.md` + the comparison panels, document section 4 |
| 3 | Open implementation questions for Innovue | **39 live questions in eight groups**, numbered 1–40 with §9.12 struck, mirrored number-for-number at `platform.md` §10 | `case.md` §8–§9 — carried in the internal record, no longer a document section |

**Commits, newest first.**

**Superseded 2026-09-08.** The repo's history was re-initialised for a public push; the
47-commit working history is archived as a bundle outside the repo and the hashes below no
longer resolve. Kept only as a record of the order the work landed in.

```
13ea38b  Withdraw the lime; the categorical marks carry value, not hue
560e32d  Pair panel 06 against the populated matrix, and take the counts out of 0
19a6056  Drop the last 128 from 4.I
39aa4cc  Streamline the panels, link every cross-reference, and drop 128 from the case
1a977ab  Show the short version, fold the full reading, and fix the prototype link
dba4491  Place the panels outside the prose layer, and update the handoff state
5d2ef61  Collapse the three documents and the deck into one, and rebuild the reader
b50fb90  Cut the duplication 4 created in the question list
```

**Phases 0–3 landed as planned.** Phase 4 ran long: it absorbed most of Phase 5 and then four rounds
of colour revision. That is finished. **Do not reopen the palette** — see §C.

---

## §B · The seven things that are still owed

Ordered by cost of leaving them. The first is a live inconsistency in a document going to a vendor.

~~1–5.~~ **All closed 2026-09-04** by Phases 6 and 7: §10.13 and §10.14 created at exactly those
numbers; §9.12/§10.12 struck with the slot retained; the 68–128 range fixed at every site; the
walk-away subsection carried outward unranked; and the token extraction rebuilt (87 → 93, six added,
`--chart-excluded` retired, `--chart-grid` recovered).

~~6–7.~~ **Closed 2026-09-04 by Phase 8.** Both HTMLs are genuinely self-contained — zero external
references, verified by rendering from an empty directory, with `design/previews/inline-fonts.py` as
the idempotent tool. The deck was rebuilt: canonical question numbers, 15 panels with ids and
displayed numbers agreeing, four stale claims corrected, and two panels added for the share pie and
the holder comparison.

**Nothing is owed toward the three deliverables.** §G carries the one open item and what a next
pass would pick up.

---

## §C · Decisions that are closed. Do not reopen these.

**The palette went through four revisions on 2026-09-04, a fifth on 2026-09-05, and is settled.**
The reasoning is in `design-language.md` §2 (three dated amendments, in order) and §3.7. Summary
only:

| Token | Value | Role |
| --- | --- | --- |
| `--mark-1` | `→ --n-10` | first encoded value, **or the entity being tracked** |
| `--mark-2` | `→ --n-7` | second encoded value |
| `--mark-3` | `→ --n-10` | third encoded value, **only ever a 45° hatch** |
| `--mark-3-hatch` | gradient | the line-scale rendering of the third value, 3px pitch |
| `--mark-off` | `→ --n-7` | **not a fourth value — the absence of one** |

- **There is no hue in Terrain.** `--lime` `#C2F662` shipped 2026-09-04 as `--mark-1` and was
  **withdrawn 2026-09-05**; there is no non-neutral primitive left. It was becoming the accent by
  default in the one artifact going outward, and it contradicted `case.md` §6.4, which tells that
  reader there is no accent colour. The *form* of §3.7 survived intact — three encoded values, a
  fourth folds into *Other*, identity never rides on rank — and only what fills the slots changed.
  The encoding is now **value**: `--mark-1` is the darkest thing on the card. Full reasoning at the
  end of `design-language.md` §2; the hue's own numbers are kept in §3.7's record block.
- **The third mark cannot be a solid**, and that is the ramp rather than a preference: `--n-6` is
  2.17:1 on white, and the value that would clear 3:1 (`#8A8A8A`) is not on the ramp. Texture is the
  whole third slot, at two pitches.

- **There is no `--mark-4`.** A fourth category folds into *Other* or the chart becomes small
  multiples. Cap is three encoded values.
- **The five-hue set was withdrawn as defective**, not as taste: two slots sat within 15° of
  `--state-live` and `--state-expired`, so the pie read green-means-good.
- **Pale yellow `#F3FFA5` was proposed and dropped.** It is 11.5° from `--mark-1`; as peers they
  return normal-vision ΔE 11.8, below the floor of 15. No `--mark-tint` exists.
- **`#9ACB2F` was tried and reverted.** It bought contrast and cost the glow.
- **`--mark-off` stays at `--n-7`** on measured evidence: tritan 37.2 / normal 41.0, against 16.0 /
  23.8 at `--n-6`.
- **The categorical validator no longer applies**, and that is the point: three neutral ramp steps
  have no hue to separate and no chroma to floor. What governs is WCAG contrast against the surfaces
  each mark sits on and L\* separation between marks that co-occur. A hue-separated set that returns
  `ALL CHECKS PASS` exists and was rejected; it is recorded in §3.7 so nobody rediscovers it and
  assumes we never looked.
- **The accent is still open, and is now fully open again.** `brief.md` §4 records `#C2F662` as a
  *candidate with numbers*. Adopting it amends `CLAUDE.md`, `brief.md` §4 and `design-language.md`
  §2, §3.1 and §11 together — **all four in one deliberate pass**, which is exactly what shipping it
  as a chart mark routed around. Do not trial an accent by putting it on screen first. Primary
  actions stay near-black.

**Also closed:** §7a.2 and §7a.4 (closed-by-build), the density thresholds, the categorical-colour
question, the 68-vs-128 count, the red `Incomplete` band (retired — red is the expired hue, and it
said *this data is bad* where the fact is *not yet known*).

**Still deliberately open:** the three zones (`platform.md` §6.1 holds a ledger row at a value its
own evidence contradicts, openly, pending §10.13), §7a.3's handoff-vs-detail-page, chat routing,
§7a.8's walk-away artifact, the name, the accent.

---

## §D · What is blocked by data, and the argument it produces

Colour coverage stopped where the data stopped, and **the wall is the same one the four unbuilt
forms hit.** Recorded in `design-language.md` §7. Do not build these; do not colour a skeleton.

| Candidate | Why not |
| --- | --- |
| **Live vs expired**, everywhere | The strongest one. No legal status held for this project — screen `21` is a different dataset. Those columns are skeleton bars |
| **Tracked holder** in *Who cites whom* | `cites` is anonymous skeleton rows — no identity to key a selection to |
| **Delta pills** | Fully specced in the stylesheet, applied nowhere. A delta needs two time points; we hold one |
| **Radar / chord / tree / donut+stacked** | `design-language.md` §7 names the missing data per row. *Phase-space was the fifth and is withdrawn — Life Cycle goes in words on §6.3's caption* |

**Every one of these unblocks on `platform.md` §10.1 — "is any of this available as an API?"** That
is the argument delivery 3 makes, and **it is now made explicitly**: `case.md` §9 closes the numbered
list with *The design is not waiting on design decisions*, naming the blocked set and pointing at one
answer. `design/components.md` names the data shape each blocked item needs, which is what
turns the argument from a complaint into a request.

---

## §E · Verification — copy-paste, do not improvise

```bash
cd "$(git rev-parse --show-toplevel)/design/previews"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# 1 · every hash state must be JS-clean (24 states)
for h in thread questions questions-more confirm build dashboard return drilldown menu collapsed \
         chat history info track confirm-change build-rebuild page-map page-rivals page-filings \
         page-lineage set set-starred set-rebaselined set-loaded; do
  n=$("$CHROME" --headless --disable-gpu --virtual-time-budget=3500 --enable-logging=stderr --v=1 \
      --dump-dom "file://$PWD/terrain-prototype.html#$h" 2>&1 | grep -cE 'CONSOLE:|Uncaught')
  [ "$n" != "0" ] && echo "$h ERRORS:$n"
done

# 2 · render and LOOK at the PNG. A missing typeface fails silently.
"$CHROME" --headless --disable-gpu --force-device-scale-factor=2 --window-size=1440,1000 \
  --virtual-time-budget=6000 --screenshot=out.png "file://$PWD/terrain-prototype.html#track"

# 3 · no raw hex outside :root
awk 'NR>130' terrain-prototype.html | grep -nE '#[0-9a-fA-F]{6}'   # comment refs only

# 4 · no fabricated identifiers
grep -nE '\b(US|EP|CN|TW|JP|WO)[0-9]{6,}' terrain-prototype.html   # must be empty

# 5 · no hue anywhere — every colour is a neutral, a state or a density step
grep -oE '#[0-9A-Fa-f]{6}' terrain-prototype.html | sort -u    # eyeball against §3
```

*The `validate_palette.js` calls that used to be step 5 are gone with the hue. `dataviz`'s validator
is scoped to categorical palettes and there is no longer one to check — see `design-language.md`
§3.7, last paragraph before the record block.*

**Three traps that cost real time. The third was found 2026-09-04:**

- **Headless `--screenshot` does not paint a scrolled region after fragment navigation.** Opening
  `file://…#any-valid-id` returns a blank PNG — on `terrain-the-case.html` and equally on the
  comparison deck, which is a plain static page with no script. The geometry is correct (measured:
  target at y=9535, scrollY 9463); it is the rasterisation that does not follow. **Do not debug the
  document.** To see the middle of a long page, use `--print-to-pdf`, which lays out everything, or
  build a scratch file holding one section and shoot it from the top.

**And the two from the earlier pass:**

- **The Bash tool's working directory persists between calls, and Python inside it may not inherit
  it.** Use absolute paths. A `cd` in an earlier call silently broke a later `&&` chain.
- **Filenames in `visual_inspo/` contain a NBSP before `PM`.** Glob them; do not retype them.

**Cross-document checks:** every `case.md` §9.n must equal `platform.md` §10.n by number *and*
content; every count in `case.md` re-counted against its own tables (**programmatically — the tally
drifted twice in this session and both times a script caught it**); every screen in
`iptech-screenshots-identified/README.md` has exactly one §8 row with one verdict.

**Ledger tally, as committed:** Match 10 · Diverge 20 · Omit·later 17 · Omit·deferred 4 · Omit·cut 8
= **59 rows**. If you change a verdict, recount programmatically and fix `case.md`'s prose — the
tally has drifted every time a verdict moved.

---

## §F · Rules that override anything below

From `CLAUDE.md`, and non-negotiable:

- **No fifth document.** Four in `docs/`. A new file needs a distinct *kind* of content and a
  distinct *reader*.
- **`docs/` is the source of truth.** Settle it in markdown, then build the preview. If the
  prototype and a doc disagree, **the doc wins.**
- **`platform.md` §9 is `DEFERRED — NOT IN SCOPE`.** Nothing in it is built, specced, wireframed or
  designed against. **§7a.8 is further back than §7a's own "proposed" banner** — carried outward,
  never built.
- **Previews are self-contained.** Inline CSS, no build step. `design/tokens/` was the one recorded
  exception and it was deleted 2026-09-08; **no preview imports a shared stylesheet.** The single
  generated stylesheet left is `deliverables/document.css`, which only `build.py` reads.
- **Colour carries information or it is not there**, and it encodes **direction, never
  desirability**. No green-means-good. Matrix density stays tonal grey; the filings series stays
  neutral. Every coloured element also carries a word or a shape.
- **Lucide icons only. No emoji. No AI-attribution trailer of any kind. English only** — no CJK
  face, no bilingual markup, no `data-zh`. **Never edit the TIS monorepo from this folder.**
- **`brand/logos/` is read-only.** Use the `_eng` variants.
- **The skeleton contract:** *chrome is real, data is a bar, nothing is invented.* Two drawn-shape
  exceptions exist — the matrix density tone and the filings curve. **Argue a third in
  `design-language.md` §8 before drawing it.**

---

## Phase 0 · Baseline — **DONE**

Four commits on the natural seams. `design/previews/comparison-assets/` was resolved.

## Phase 1 · Close the evidence gaps — **DONE**

All six capture targets landed, plus a third pass. `iptech-screenshots-identified/` now runs to
**31 screens** with a README index; §2.12–§2.19 document the new ones.

**What Phase 1 changed for everything downstream:**

- **The populated Tech-Effx arrived**, so the hero is no longer designed against a screen nobody has
  seen working. The real 8×8 grid is what the prototype now runs on.
- **`Hierarchy` is the classification workbench** — an analyst builds the taxonomy and assigns
  patents by hand, discarding 41 of ~158. **This is the single clearest statement of what Terrain
  automates** and it belongs in delivery 1's argument.
- **The 68-vs-128 question answered itself:** T-Map is M-Map plus a classification filter, so a
  shared entry renders identically under either map. 68 destinations, 128 menu entries.
- **`Switch To Ai Insight` is 技術脈絡分析** — by inference, which is why §10.14 is owed.

*Four capture items remain optional and low priority:* `-detail` crops for 24–31, the popover
chevron, the `Mark Colors` swatch press, and `02`'s nav path.

## Phase 2 · One canonical ledger — **DONE**

`platform.md` §8 rewritten as the canonical ledger, replacing five records that disagreed. §8.1
observed surfaces (24 rows) · §8.2 capabilities (26) · §8.3 the menu · §8.4 cuts · §8.5 the count.
§7a.7's twelve update-log capabilities folded in, retiring the standing "it is incomplete" note.

**The verdict rule this phase forced, and it is load-bearing:** *a verdict records a decision, not
an impression. Concluding from an absence is how a ledger stops being trustworthy.* That is why the
three-zones row is held at a value its own evidence contradicts, openly, pending §10.13.

## Phase 3 · Reconcile the four documents — **DONE**

Fifteen contradictions closed. The three that needed a decision were decided: the handoff is
confirmed but **marked provisional** with §7a.3 left open; §7a.2 and §7a.4 closed-by-build with
§7a.1/§7a.5/§7a.6/§7a.7 left proposed; the chat copy stands until an intent classifier exists, with
a dated *"reviewed and deliberately left open"* record in §5.

**The retracted "founders have no boss" reasoning was propagated to all three surviving sites.** The
cut stands; the reason is now `brief.md` §1 alone.

## Phase 4 · The visual-language pass — **DONE, and it absorbed most of Phase 5**

Ran to four rounds. Everything it settled is in §C. What was **built**:

- **`sharePie` + `shareBars`** — jurisdiction, on real data, with IPtech's misleading
  share-of-selected-five denominator **corrected** to share-of-scope. That correction is a better
  exhibit for Innovue than a chart we replaced.
- **`holderBars`** — two charts, never two axes. **Each panel sorts by its own measure**, which
  makes the real finding visible: the holder at the top of the patent count names the *fewest*
  inventors, 7 against the 20 fielded by a holder with only 4. One ink bar tracks it across both.
- **Matrix column selection** — the mark on the column's *edge*, since the fill is locked to density
  tone. It inverts to `--text-inverse` over `--density-4`, where an ink rail is 2.36:1. The header reveals that column's total, **summed from the observed counts** so header and
  cells cannot disagree: Navigation / control comes to 26, which is what the finding already says.
  Interaction-borne and default none — a standing highlight would light the **crowded** column and
  read as *go here*. `#track` renders it.
- **The illustrative dataset**, both sets in one `SETS` object, switched by `var DATA = SETS.illustrative`.

**Defects found and fixed while in there** — the last three only because the PNG was actually looked
at: the `.hb-lbl` column was 96px against a 132px skeleton class, so two equal values drew as
different lengths; a bare `.dot` rule overrode the 6px status-pill dot; the hatch renders as one
diagonal line at 8px, so **area marks take the texture and line-scale marks take `--mark-3` solid**;
and **the dashboard's Rivals card printed inventor counts under a `Last filed` header** — the count
was real and the recency was never captured, so the column is a bar again.

**One ledger row is still undecided and it was supposed to be decided here:**
`Patent Count - Life Cycle` is the only row of 50 whose *Where in Terrain* cell reads
**`Undecided — Phase 4`**. It is now specced-but-unbuilt rather than resolved. **Decide it in
Phase 7** and correct the cell.

---

## Phase 5 · Build the adapted forms — **LARGELY ABSORBED. Reduced scope.**

Two of the seven are built, one was answered without a chart (Life Cycle), and one extra (matrix
selection) was added. The remaining four are
**blocked by data, not by design** — `design-language.md` §7 names what each lacks, and §D above is
the list. **Do not build them from numbers we do not hold.**

What is genuinely left here, and it is small:

- `Patent Count - Life Cycle` — decide the ledger cell (see Phase 4's closing note).
- If any form is built later, extend `terrain-prototype.html` rather than rewriting: reuse
  `matrixHTML()` (the single source §7 requires), `pgCard()`, `numCell()`, `axisRow()`, `sk()`,
  `markFill()` / `barStyle()`, `HATCH_DEF`, and the `PAGES` structure with its `body()` / `after()`
  hooks. New hash states append to `routeFromHash()`.

**Gate:** nothing to gate unless a form gets built. If one does, the user looks at the renders — a
form can spec well and read badly, and the PNG is the only place that shows up.

---

## Phase 6 · The Innovue handoff — components, not just tokens — **DONE, then partly deleted**

*The token extraction this phase produced was deleted 2026-09-08 (`design-language.md` §11); the
component manifest it also produced survives at `design/components.md`. Paths to
`design/tokens/` below are historical.*

**Landed 2026-09-04.** `design/components.md` — 23 rows, 18 carrying a concrete data shape
derived from the prototype's own `DATA` object. `tokens.json` 87 → 93. **It found three stale
statements in the source of truth** — §3.5 still listed the retired red band while §3.7 cited its
replacement; `--chart-grid` had been named in §3.5 since 2026-08-31 and never extracted; and §8.5
said ten of seventeen `Diverge` rows were built when the visual-language pass had made it twelve.
**And it produced eight questions**, which went to Phase 7 as §9.16–§9.23. The spec below is kept as
the record of what was asked for.

`design/tokens/` has the values and **no components**. Add a **component manifest** — the artifact
that makes the handoff buildable:

`Component · The tokens it reads · The data shape it needs from the engine · Which IPtech capability supplies it`

**That third column is the deliverable.** It converts the design pass into a data contract, which is
precisely what `case.md` §8.2 asks Innovue to price, and it makes `case.md` §6.2's claims
machine-checkable against what the engine returns.

- **Regenerate first:** `python3 design/tokens/build.py`. Six tokens are missing (§B.5). Verify the
  rebuild is byte-identical on a second run and that every prototype `:root` property appears.
  **Never hand-edit the CSS.**
- State the load-bearing assumption plainly: **the engine returns structured values, not rendered
  pictures. You cannot re-token a PNG.** Then carry it into §9 as a question.
- `design/tokens/README.md` §3's adaptation log gets a row per built form, including the matrix
  column selection and the retired `--chart-excluded`.
- The README's own gating question — server-rendered images vs client components — is **Innovue's to
  answer**, not ours to assume.

**Gate:** read the manifest as Innovue would. Does the **data-shape** column resolve to something
they could quote engineering time against, or is it design vocabulary wearing a table? If a row
cannot name the shape it needs, that is not a gap in the manifest — it is a missing question for §9,
and it goes to Phase 7.

---

## Phase 7 · One question list — `case.md` §9 canonical — **DONE**

**Landed 2026-09-04.** §9 and §10 are 1–35, identical by number, §12 struck with its slot retained,
dangling citations: none. 34 live questions in six groups. `design/tokens/README.md` §4 and
`components.md` §4 are views citing canonical numbers. The walk-away subsection went outward
unranked. `Patent Count - Life Cycle` was decided — words on the Filings caption, not a chart — which
emptied the last `Undecided` cell in the ledger and dropped the unbuilt chart forms from five to
four. **The comparison deck's closing panel is now the only surviving second numbering, and Phase 8
owns it.** The spec below is kept as the record of what was asked for.

This is what makes delivery 3 exist. Reconcile four sets: `case.md` §9 (12) · `platform.md` §10 (12)
· the comparison deck (19 in two groups) · `design/tokens/README.md` §4 (10 front-end questions).

**Preserve the numbering contract: §9.n ≡ §10.n. Append, never insert** — §7a.6 and others reference
§10.8/§10.9/§10.10 by number.

- **Create §10.13 and §10.14 at exactly those numbers.** Four forward references already point there
  (§B.1). Nothing else in Phase 7 matters more, because those citations are live in the outbound
  document's source.
- **Strike §9.12 / §10.12** — we answered the 68-vs-128 question ourselves (§B.2). *A question we
  answered and left in reads as though we did not look.*
- **Fix the surviving 68–128 range** in the four places at §B.3.
- **Add:** the 同族合併 assumption `case.md` §9.15 flags as *"the most severe question on this
  list"* if wrong; Phase 6's structured-values-not-pictures assumption; anything Phase 6's manifest
  could not name a data shape for.
- **Add the walk-away subsection** (§B.4). Carry across: the question, the four constraints that
  eliminate whole shapes (§6.1's no-verdict rule, `brief.md` §1's software-not-a-report lock,
  stage-neutrality, idea-vs-direction), the four unranked options A–D, the two settled leanings
  (**a downloadable file was actively declined**; dated snapshot with the live map behind a link),
  and the five things §7a.8 says would settle it.
- **Make §D's argument explicitly**: the design is not waiting on design decisions, it is waiting on
  §10.1. Six charts and three colour treatments are specced and unbuildable for one reason.
- Fix the eleven/twelve inconsistency as part of this, not separately.
- Decide `Patent Count - Life Cycle` and correct its ledger cell.

**Gate:** does the final count reconcile across all four sources, and does every §9.n still equal
§10.n? Which questions did Phase 1 **kill** — a shorter list is a better one. And does the walk-away
subsection read as a decision we are inviting rather than a hole we are confessing?

---

## §G · What a next pass would pick up

**To change any deliverable, start at [`deliverables/README.md`](deliverables/README.md).** It is
the routing table: what to edit to change what, the numbering contract that is easy to break, and
the pre-send check. **Every `.html` in `deliverables/` is generated** — an edit to an output is lost
on the next build, silently.


~~**One thing is owed, as of 2026-09-07.** The comparison deck has no panel for the set step.~~
**Closed 2026-09-08, by scope rather than by work.** The deck and its screenshot panels are no
longer part of anything published — they carry captures of a third party's product rendering a
client's data, and the repo is going public. The deck stays local as a working record; the case
document no longer ingests it. A panel that will never be published is not owed.

*The set step is still argued in the document* — `case.md` §6.1 carries it as one of the four
surfaces, and the prototype implements `#set`, `#set-starred`, `#set-rebaselined` and `#set-loaded`.
What it has lost is only the side-by-side against `Hierarchy`.

**Otherwise nothing is owed.** The document is sendable. These are the things a next session would
find waiting, in the order they would matter.

**What the 2026-09-04 consolidation pass added, so it is not rediscovered:**

- **`platform.md` §2.1** — how IPtech is navigated (`Search` → `Project` → a separate browser tab →
  `Fishbone` / `M-Map` / `T-Map`), and Terrain's rule: **the session is one tab.** The tab behaviour
  was seen in a walkthrough and is **in no capture**; it is recorded as observed, not captured, and
  nothing depends on it.
- **`platform.md` §2.2** — the entry field takes a sentence, a patent number, a company or an
  IPC/CPC class. The filter rail stays out. Questions 36 and 37 follow.
- **`platform.md` §8.6** — the reconciliation table. Eighteen High: 8 on screen, 5 hidden by design,
  1 blocked on §10.1, 3 not in v1, 1 not a surface.
- **Two mis-ratings corrected.** *Cell drill-down* was credited to IPtech and screen `31` shows their
  cell has none — Terrain **adds** it. *The three zones* are absent from the populated matrix and the
  row is held at its blog value pending §10.13.
- **`Hierarchy` was missing from the outbound inventory entirely** and is now `case.md` §4.G.
- **`md.py` shipped a live bug**: every ordered list restarted at 1, so §9.24 cited in a panel
  pointed at an item labelled 1. It emits `<ol start="N">` now.

1. **Send it.** The bundle is six files: `terrain-the-case.html`, `terrain-prototype.html`, and the
   four from `design/tokens/`. No hosting, no remote — files go directly, which is what the font
   inlining makes cheap to keep.
2. **`case.md` cites `platform.md` and `design-language.md` throughout, and neither is in the
   bundle.** Recorded openly in the header rather than papered over. If a recipient asks for them,
   that is a decision about how much internal record to expose — `platform.md` §9 is deferred scope
   and §7a is thinking-in-progress, neither written for an outside reader.
3. **The name, and the accent.** Both still open, both in `brief.md` §4. USPTO / TIPO and domain
   clearance gates any logo work.
4. **`--mark-off` on a dark surface** — `design-language.md` §11 records what is owed. On ink the
   light-mode pairing inverts, so the field has to be *lighter* than the mark; that was always a
   lightness problem rather than a hue problem, which is why the withdrawal did not touch it.
   `--mark-1` itself no longer needs a derived dark step — it re-steps with §3.1 like any neutral.
5. **The four unbuilt chart forms**, which are §9.22 and unblock on §9.1 with everything else.
6. **Four optional captures** from Phase 1: `-detail` crops for screens 24–31, the popover chevron,
   the `Mark Colors` swatch press, and `02`'s nav path. Low priority; nothing depends on them.

---

## Phase 8 · Package the three deliverables — **DONE**

**Landed 2026-09-04.** Both HTMLs self-contained and verified from an empty directory. The deck
rebuilt to 15 panels on canonical question numbers. **What the phase turned up:** the deck carried
four stale claims and every one of them *understated* the work — it said all Terrain data was a grey
bar, that we had never seen a populated matrix, that we had never captured the lineage analysis, and
that the 68-vs-128 count was unverifiable. A document going out with those in it would have argued
against itself. The spec below is kept as the record of what was asked for.



| | Delivery | Carried by |
| --- | --- | --- |
| 1 | Capability read | `case.md` §4–§5, viewing the `platform.md` §8 ledger |
| 2 | Design pass | `case.md` §6 + the prototype + the comparison deck |
| 3 | Open questions | `case.md` §8–§9 + the rendered page |

**Make both HTMLs genuinely self-contained.** One external reference each (§B.6). Inline the seven
woff2 as data URIs plus the `@font-face` block. **Verify by rendering from a directory containing
only the HTML — a missing typeface fails silently, so check the PNG by eye, not by assumption.**

**Repair the deck's staleness before it goes anywhere** (§B.7), then add panels for what Phase 4
built: the corrected share pie, the two-panel holder comparison with the rank inversion, and the
matrix column selection at `#track`. Pair panel 07 against capture 28.

No hosting, no remote, no GitHub Pages. **Files are sent directly.** The font inlining is what keeps
that decision cheap to reverse.

**Gate — read it cold.** Open each deliverable as its recipient, not its author: management reading
delivery 1, Innovue reading delivery 3. Does the argument land without the four internal documents
beside it? Is there anything in there we would not want to defend in the meeting?

---

## How we run this — stop and assess at every phase

**Do not start the next phase until the user says go.** At each gate, report five things, short:

1. **Done** — what actually landed, with paths
2. **Found** — what the phase turned up that we did not know when we planned it
3. **Changed** — what that means for the phases still ahead: scope up, scope down, reorder, or nothing
4. **Waiting on you** — anything that could not be settled without a decision
5. **Next** — the one-line ask to proceed

Point 3 is the one that matters. A gate that just says "done" wastes the stop.

## If time runs short

Cut in this order: **Phase 8 packaging** (the docs suffice) → **Phase 6 manifest** (the tokens alone
still ship) → **Phase 5** (already reduced to one decision).

~~**Do not cut Phase 7.**~~ **Done 2026-09-04.** All three deliverables are now defensible on their
own terms. ~~What remains is packaging, and the one thing in Phase 8 that is not cosmetic is the
comparison deck's question panel: it still numbers 1–19 against a canonical list of 1–35.~~
**Closed 2026-09-04** by the deck rebuild onto canonical numbers, and moot since 2026-09-08 — the
deck is no longer published. Phase 8 is closed; see §G.
