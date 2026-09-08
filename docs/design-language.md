# TIS Terrain — Design Language

> How Terrain looks. Settled 2026-08-31 unless marked open.
> [brief.md](brief.md) is what Terrain *is*. [platform.md](platform.md) is what gets *built*.
> This file is the third of three, and the exception is deliberate — see `CLAUDE.md`.

**This document is the source of truth. Every preview in `design/previews/` is a view of it.** If a
preview and this file disagree, one of them is a bug; decide which and fix it. Never let a preview
become the only record of a decision.

Light mode only. The dark pass is a separate job, and §10 is the contract that keeps it cheap.

---

## 1 · The read on the reference screens

Seven screens in `visual_inspo/` — six light, one dark. They are not one aesthetic, but they run one
system, and that system is what Terrain takes.

**The shared structure.** A grey page ground with white cards floating on it. Generous radius.
Hairline borders rather than shadows — depth comes from the ground↔surface tonal step, not
elevation. Large geometric-sans numerals as the primary visual event, each with a tiny letterspaced
uppercase micro-label above it. Four of six put navigation in a left rail. Every one puts the user
somewhere small and persistent.

**Three details taken outright:**

1. **The secondary part of a large figure drops in weight and opacity.** Decay's `$420.⁵⁴K`, ZIXO's
   `$578,395.₀₀`, the dark screen's `194 / 381`. Three screens arrived at this independently. It
   maps onto Inconsolata and gives Terrain's counts a signature that costs nothing.
2. **Dense tables ride on 1px dividers** — no card-per-row, no shadow. This is what makes the §7
   drill-down affordable as a panel instead of a page.
3. **The dark screen separates three chart jobs that are usually conflated** — a muted series area,
   a dashed amber *trend* overlay above it, and red vertical bands with baseline ticks marking
   excluded regions. Terrain needs all three (§3.5). It took the **separation**, not the palette:
   the trend went near-black on 2026-08-31 because amber was carrying no information, which is the
   one thing §2 requires of a colour.

**What is left behind.** Sypher's green-on-everything, CreditTB's mint canvas, ZIXO's
glassmorphism, Decay's illustrative hero. Strip the colour from any of those screens and the
hierarchy survives intact, because tone and weight were carrying it and the colour was decoration.
That observation is the entire argument for §3.3.

---

## 2 · The one rule

**Colour carries information, or it is not there.**

Terrain has no accent decision (`brief.md` §4 lists it as open and upstream-affecting), so there is
no brand colour to spend. What remains is a neutral system with three narrow, earned exceptions:
discrete states, direction of change, and the chart layers. Everything else is grey.

**And colour encodes direction, never desirability.** This is the load-bearing half, and it is the
same argument that keeps the matrix tonal in §3.4. A space heating up is not good or bad for a
founder — it is information. If rising filings render green, the founder reads *green means build
here*, and the trend chart delivers exactly the verdict `platform.md` §6.1 spends a paragraph
forbidding the map from delivering. Green and red are therefore confined to delta pills, where a
metric's direction is unambiguous. Series and trend overlays are both neutral — *the trend was amber
until 2026-08-31, when §3.5 retired it for carrying no information.*

**Never colour alone.** Every coloured element also carries a word or a shape — a dot plus a label,
an arrow plus a number, a hatch plus a legend entry.

### Amended 2026-09-04 — categorical colour is permitted, inside a chart's data marks only

§11 said a categorical palette was *"a design decision, not a token addition, and it is not made."*
**It is made now**, and the fourth exception is recorded here rather than hidden in §3.

**Why the rule allowed it all along.** §2 permits colour that *carries information*. The original
objection was that a five-slice pie needs "five hues that mean nothing" — but that conflated
*meaningless* with *non-ordinal*. A categorical hue carries identity: this slice is one holder, that
one is another. What it must not carry is **order or desirability**, and that is the half of §2 that
is load-bearing and is unchanged.

**The commercial reason, which is the actual reason.** Terrain is repackaging Innovue's engine, not
redrawing its output. A chart a founder recognises from IPtech, wearing a different aesthetic, is a
far easier thing for Innovue to say yes to than a chart we redesigned on principle — and the backend
already produces it. Recorded because a future session will otherwise read the amendment as taste.

**Four constraints, and they are what keep §2 intact:**

1. **Data marks only.** Categorical hue appears inside a chart's own marks — slices, series, ribbons,
   radar rings. Never in chrome, text, icons, borders, backgrounds or actions. **There is still no
   accent**, and primary actions are still near-black.
2. **Identity, never desirability.** No slot is "good". The density ramp in §3.4 stays tonal and the
   filings series stays neutral, because those encode *magnitude* and *direction* — `platform.md`
   §6.1 still forbids the interface implying why a cell is empty.
3. **Fixed order, never cycled.** A hue goes to an entity in a chart's own stable order and stays
   with it when a filter removes its neighbours. A further category folds into *Other* — it never
   gets a generated hue.
4. **Never colour alone, unchanged.** Every chart with two or more series carries a legend, and four
   or fewer are also directly labelled, so identity never rests on hue.

### Amended again the same day — one hue, not five

The five-hue set shipped that morning and was **withdrawn before it left the building**. Two things
killed it, one measured and one observed.

**Measured: two of the five collided with the reserved status hues.** `--cat-2` `#009956` sat 3° off
`--state-live` and `--cat-5` `#BF2846` sat 13° off `--state-expired` — inside the 15° at which two
hues read as one colour. So the jurisdiction pie's largest slice read *live* and its smallest read
*expired*: **green-means-good arriving through the back door that §2 bolts at the front.** `dataviz`
reserves the status hues outright — never a series. That is a defect, not a preference, and it is why
this amendment is not a reversal of the one above but a correction inside it.

**Observed: the reference screens do not use categorical palettes at all.** `visual_inspo`
2.13.59, 2.16.27 and 2.17.53 each use **one warm hue against ink**, with a third value carried as a
diagonal hatch. Sampled, they are `#C2F662`, `#F3FFA5` and `#E4A24E`. Nothing in the folder that
Terrain's aesthetic is derived from asks for five hues.

**So the fifth exception replaces the fourth, and it is narrower.** One hue, one ink, one texture,
capped at three encoded values. Constraints 1, 2 and 4 above are unchanged and constraint 3 is
strengthened: with three values there is nothing to cycle.

**And the hue means something the five never could.** Five hues name categories. One hue marks
**the entity you are tracking** — which is why a founder can watch one holder move from first by
patents to last by inventors across two panels. That is `platform.md` §6.2's requirement met by
colour rather than by caption.

The palette itself, its provenance and its validation are §3.7.

### Withdrawn 2026-09-05 — no hue at all, and §2 goes back to standing unamended

**`--lime` is gone.** `#C2F662` is out of the system, `--mark-1` is `--n-10`, and the two amendments
above are **withdrawn rather than narrowed again**. What replaces them is nothing: the categorical
marks survive as `--n-10`, `--n-7` and a 45° ink hatch, and three neutral ramp steps plus a texture
need no exception to §2, because none of them is colour. The rule at the top of this section is once
more the whole rule — **discrete states, direction on a delta pill, the chart layers**, and nothing
else.

**Why, and the contrast warning is not the reason.** 1.26:1 was survivable and §3.7 had the five
reliefs to prove it. Three other things were not.

1. **It was becoming the accent by default.** `CLAUDE.md` holds the accent open on one specific
   ground: *a placeholder accent becomes the thing everyone reviews instead of the structure.*
   `brief.md` §4 had already logged the hue as a candidate with numbers and explicitly **not** a
   decision — and then it shipped, in the one artifact going to Innovue and to TIS management in the
   week the structure is what needs reading. The distinction between *a chart mark* and *the accent*
   is one a reviewer does not make on sight. That is the risk `CLAUDE.md` names, arriving exactly
   where it was predicted to.
2. **It put the prototype in conflict with the document sent beside it.** `case.md` §6.4 tells that
   reader, in the list of deliberate absences, that colour appears in **exactly three places** —
   none of them a chart mark — and that there is **no accent colour**. `case.md` is a view of these
   three documents and when it and they disagree, *they* win — but here the view was right and the
   system had drifted under it. Rather than amend the outbound document to admit a hue we were not
   committed to, the hue goes.
3. **Five reliefs to make one mark legible is the design telling you the mark is wrong.** A printed
   number, a semibold weight, a hairline ring at two sizes, an ink circle on the pie, and a table
   view underneath. Each was individually defensible and the total was a hue held up by scaffolding.

**What carries the encoding instead: value.** `--mark-1` is now the darkest thing on the card, and
*being darkest* is what "this is the one" means. That is the same channel hierarchy, weight and
spacing already carry everywhere else in this system, and it is strictly better on four counts —
it reads in greyscale, in print and under forced colours with no second channel; it clears 3:1
where the hue was under it; it cannot collide with a reserved status hue, because it has no hue; and
it needs no CVD check at all, since lightness is the one channel no colour vision deficiency takes
away.

**What it costs, stated rather than hidden.** Two things, and the second is a real loss.

- **The third value can no longer be a solid.** The ramp has no third step that clears 3:1 and stays
  clear of the other two, so the texture is the whole third slot now rather than one of its
  renderings. §3.7 has the numbers and the two pitches.
- **The matrix rail no longer crosses the density ramp unchanged.** A lime rail was a different
  *kind* of thing from the grey it ran over; an ink rail is the same kind at a darker step, and on
  `--density-4` it has to invert to stay visible. The mark on the map is now legible at every step
  but is no longer one unbroken line. That is the price, it is confined to one band of the ramp, and
  the column total is the cue that does run uninterrupted.

**What does not change, and is worth being explicit about.** The *form* survives intact — three
encoded values maximum, a fourth folds into *Other*, identity never rides on rank, `--mark-1` means
the entity being tracked and not the largest slice, and every mark still carries a printed number.
Removing the hue narrowed what the marks are made of and nothing about what they mean.

**And `CLAUDE.md` needs no amendment.** It never permitted the hue; §2's fourth exception did. With
that exception withdrawn the prototype complies with the project rule as written, which is the state
this section was in before 2026-09-04.

---

## 3 · Colour

All values verified for WCAG AA at their intended size. No component may reference a primitive or a
raw hex — see §10.

### 3.1 · Neutral ramp

Perceptually even in L*, **true neutral — no hue at all, R = G = B**.

| | Hex | L* | |
|---|---|---|---|
| `--n-0`  | `#FFFFFF` | 100 | surface |
| `--n-1`  | `#FCFCFC` | 98.6 | |
| `--n-2`  | `#F6F6F6` | 96.8 | ground |
| `--n-3`  | `#F0F0F0` | 94.4 | sunken |
| `--n-4`  | `#E4E4E4` | 90.6 | hairline, skeleton |
| `--n-5`  | `#D1D1D1` | 83.8 | strong border |
| `--n-6`  | `#B0B0B0` | 71.8 | disabled |
| `--n-7`  | `#6F6F6F` | 47.0 | tertiary text |
| `--n-8`  | `#595959` | 37.9 | body text |
| `--n-9`  | `#383838` | 23.9 | |
| `--n-10` | `#252525` | 14.7 | ink |

The first pass carried a faint warm cast, on the theory that it would avoid looking like a
framework default. It read as yellow and was rejected on sight 2026-08-31. Neutral is also the
safer foundation while `brief.md` §4 leaves the accent open — a cast commits the system to a
temperature that a later accent may fight.

`#252525` is the TIS ink and the submark's own fill. Not pure black — the reference screens all
stop short of it.

### 3.2 · Semantic tokens

**Components read only these.**

| Token | → | Contrast |
|---|---|---|
| `--ground` | `--n-2` | page background |
| `--surface` | `--n-0` | widget cards, sidebar, menus |
| `--surface-sunken` | `--n-3` | input tracks, table headers, segmented tracks |
| `--border` | `--n-4` | every hairline, 1px |
| `--border-strong` | `--n-5` | active edges |
| `--focus` | `--n-10` | 2px ring, 2px offset |
| `--text-1` | `--n-10` | 15.3 on surface |
| `--text-2` | `--n-8` | 6.99 |
| `--text-3` | `--n-7` | 5.02 on surface, 4.65 on ground |
| `--text-disabled` | `--n-6` | non-text use only |
| `--text-inverse` | `#FAFAFA` | on ink fills |
| `--cell-mark` | `rgba(37,37,37,.14)` | skeleton bar inside a matrix cell |
| `--cell-mark-inverse` | `rgba(250,250,250,.30)` | the same, on `--density-4` |
| `--scrim` | `rgba(37,37,37,.18)` | behind the slide-over |

The last three are alpha rather than flat neutrals because they composite over a surface whose
colour varies — a matrix cell is one of five tones, and the scrim sits over the whole page. A flat
neutral would be wrong on four of the five. They are still tokens, and still the only alpha values
in the system.

`--text-3` is darker than it looks like it should be. It carries the 10.5px micro-labels, which are
small text and need the full 4.5:1 — the obvious mid-grey lands at 3.6 and fails.

### 3.3 · State colours

The only colour in the system. Each is an ink/tint pair; each renders as **dot + word**.

| Token | Ink | Tint | Ink on surface | Ink on tint | Meaning |
|---|---|---|---|---|---|
| `--state-live` | `#1B6B45` | `#E4F1EA` | 6.49 | 5.58 | live patent, active |
| `--state-expired` | `#A32B21` | `#FAE9E7` | 7.18 | 6.11 | expired patent |
| `--state-pending` | `#7A5200` | `#FBF0D9` | 6.92 | 6.12 | in progress, incomplete |
| `--state-up` | `--state-live` | | | | delta pill, rising |
| `--state-down` | `--state-expired` | | | | delta pill, falling |

Live-vs-expired is the single most decision-relevant fact on a drill-down row (`platform.md` §7) —
an expired patent is not a threat, it is free to use. It earns colour on that ground alone.

`--state-up` / `--state-down` are aliases, not new hues. **They apply only to delta pills**, never
to a series or a matrix cell.

### 3.4 · Density ramp — the matrix

Five tonal steps, evenly spaced in L*, carrying **count and nothing else**.

| Token | Hex | Text on it | Contrast |
|---|---|---|---|
| `--density-0` | `#F6F6F6` | `--text-1` | 14.14 |
| `--density-1` | `#DDDDDD` | `--text-1` | 11.25 |
| `--density-2` | `#BBBBBB` | `--text-1` | 7.98 |
| `--density-3` | `#909090` | `--text-1` | 4.81 |
| `--density-4` | `#5E5E5E` | `--text-inverse` | 6.20 |

Text flips to inverse at `--density-4` and only there. The ramp was tuned to remove a dead zone the
first attempt had at step 3, where neither ink nor inverse cleared 4.5.

`--density-0` sits 1.08 against the white card, which is nearly invisible — correct, since an open
cell should read as nothing. **The grid is therefore delineated by 1px `--border` gridlines, not by
cell fills**, so the matrix reads as a matrix even when every cell is empty (an edge state
`platform.md` §6.1 requires).

**Why the ramp is grey.** §6.1 states the blind spot plainly: an empty cell is ambiguous — nobody
has patented plastic blades for noise reduction, and that is either an opportunity or a sign that
plastic is inherently louder and everyone knows it. The map shows where nobody is; it cannot say
why. A red↔green ramp would answer a question the data cannot. Grey states quantity and stops.

#### The Emerging problem, and how it is solved

`platform.md` §6.1 names three states — Crowded (地雷區), Emerging (新興區), Open (處女地帶). It is
tempting to map them onto three tones. **That is wrong, and the error is structural:** Emerging is
*low count **and** rising recently*. It is a second dimension, not a point between Crowded and Open.
A single ramp cannot encode it, and forcing it produces a scale where the middle means two
different things.

**Resolution: tone encodes count; a corner hatch encodes rising.** A cell can be light *and*
hatched — that is precisely Emerging, and it is only expressible because the two channels are
independent. The legend names all three states in words.

### 3.5 · Chart layers

Three layers, never merged. From the dark reference screen.

| Token | Value | Role |
|---|---|---|
| `--chart-series` | `#595959` | the data — neutral line, area fill at 8% |
| `--chart-trend` | `--n-10` | 1.5px dashed trend overlay, 15.3 on surface |
| `--chart-unknown` | `--n-3` | the unpublished window — full tone, dashed boundary rule at `--border-strong` |
| `--chart-grid` | `--border` | dashed gridlines, values inside the plot |

**Series is grey on purpose.** Direction lives in the caption, which `platform.md` §6.3 requires to
state heating / cooling / flat in words rather than leaving it to chart literacy. The trend overlay
says *there is a trend*; the words say which.

**The trend was amber until 2026-08-31, and the argument for it was wrong.** The defence was that
amber is directionless — that it says *there is a trend* without saying whether the trend is good.
That much held. What it missed is that §2 does not permit a colour for being harmless; it permits a
colour for **carrying information**. Amber carried none. It was the one hue in the system that was
not a state, and it earned its place by not doing damage rather than by doing work. A dash pattern
already says "this is an overlay, not the data", and it says it in a channel that costs no palette.

So the trend is `--n-10`, dashed `5 4`, at **1.5px** — down from 2px. That width is not cosmetic.
`--chart-series` is `--n-8`; a near-black trend at the same weight would outweigh the data it
overlays and invert the hierarchy this section sets up. Dashed at 1.5px it reads as an overlay on a
solid series, which is what it is.

**When this was written the entire palette was the three state hues in §3.3**, and the claim that
followed — that nothing else in Terrain is coloured — has held throughout. §2's 2026-09-04 amendments
briefly admitted one categorical hue inside a chart's data marks; **both were withdrawn 2026-09-05**
and §3.7 is now a palette of value and texture rather than hue. The rule underneath never moved:
colour carries information, or it is not there. Every colour in the system is a discrete state, a
direction of change, or a chart layer — never a decoration, and never a verdict.

**The band over that window is mandatory, not decorative.** Patents publish roughly 18 months after
filing, so the most recent ~18 months of any filing chart is always artificially empty. Left raw, a
founder reads a data artifact as "this space is dying" and draws exactly the wrong conclusion. The
band is shaded, ticked at the baseline, and labelled in words. **The trend line is fitted over the
published points only**, so the incomplete window cannot pull the very decline this paragraph exists
to prevent the founder from reading.

**It was red — `--chart-excluded` `#A32B21` — until 2026-09-04, and the red was the error.** Red is
`--state-expired`'s hue, so the band said *this data is bad* where the fact is *this is not yet
known*. Those are different claims and only the second is true: the patents in that window exist,
they are filed, and they will publish. The token is now `--chart-unknown` at `--n-3` and the legend
reads **Not yet published** rather than *Incomplete*, which names the fact instead of grading it.
The label moved with the colour because a neutral band under a word like *incomplete* would have
kept the verdict and lost only the signal.

### 3.6 · Skeleton

| Token | Value |
|---|---|
| `--skeleton` | `--n-4` |
| `--skeleton-shimmer` | `--n-3` |

Bars are `border-radius: 3px`, sized to the line-height of the text they replace. **Widths come from
a fixed set of classes — `w-xs w-sm w-md w-lg w-full` — never randomised**, because random widths
change on every render and make screenshots un-diffable.

Shimmer is a 1.6s linear sweep. Under `prefers-reduced-motion` it goes flat, never off — the bar
still has to read as absent data rather than as a grey design element.

---

### 3.7 · The categorical marks — one ink, one grey, one texture

Three encoded values maximum, for charts whose categories have no inherent order. **No hue.** These
are three neutral-ramp values and a texture, so they sit inside §2's base rule rather than under an
exception to it — the two amendments that permitted a categorical hue were withdrawn 2026-09-05 and
the reasoning is at the end of §2.

| Token | Value | Role |
| --- | --- | --- |
| `--mark-1` | `→ --n-10` `#252525` | first encoded value, **or the entity being tracked** |
| `--mark-2` | `→ --n-7` `#6F6F6F` | second encoded value |
| `--mark-3` | `→ --n-10` `#252525` | third encoded value — **only ever as a 45° hatch**, never a solid |
| `--mark-3-hatch` | `repeating-linear-gradient(45deg, --mark-3 0 1.2px, --surface 1.2px 3px)` | the line-scale rendering of the third value |
| `--mark-off` | `→ --n-7` `#6F6F6F` | **not a fourth value — the absence of one** |

There is no primitive above this table. `--lime` was the one non-neutral primitive in the system and
it is gone; every value here resolves to §3.1's ramp.

**The encoding is value, and that is the whole design.** `--mark-1` is the darkest thing on the card
and *being darkest* is what "this is the one" means. It reads in greyscale, in print and under
forced colours unaided, and lightness is the one channel no colour vision deficiency removes — so
the CVD arithmetic that governed the hue does not apply to any pair here.

**Measured.**

| | vs `--surface` `#FFFFFF` | vs the bar track `#F0F0F0` | L\* |
| --- | --- | --- | --- |
| `--mark-1` | **15.32:1** | 13.44:1 | 14.7 |
| `--mark-2` | **5.03:1** | 4.41:1 | 46.8 |
| `--mark-3` as drawn | 1.60:1 *(mean tone)* | — | 82.2 |

`--mark-1` to `--mark-2` is **32 L\* points**, and both clear the 3:1 a data mark needs — where the
hue they replaced was at 1.26:1, a fifth of it.

**Why the third value cannot be a solid, and it is the ramp rather than a preference.** The next step
below `--mark-2` is `--n-6` `#B0B0B0` at **2.17:1** on white and **1.90:1** on the bar track: a third
solid there either fails the 3:1 floor or vanishes into its own track. The value that would clear it
is `#8A8A8A` at 3.45:1, and that is **not on the ramp** — adding a step between `--n-6` and `--n-7`
breaks §3.1's claim that the ramp is even in L\*. That trade came up once before, on the darker-mark
detour recorded below, and was turned down then for the same reason. So the third slot is texture,
and it is texture at every scale.

**A hatch is not a tint, and its mean tone is the wrong number to judge it by.** `--mark-3` as drawn
averages 1.60:1 against a white card, which would be indefensible for a fill. What makes it read is
**stripe contrast — the ink itself is at 15.32:1** — so the mark has the crispest edges in the chart
while sitting light overall. The two consequences are real and both are handled: it needs an outer
edge wherever it abuts the surface *(the pie's circle, the key dot's ring)*, and it needs enough area
to show more than one stripe *(the pitch rule below)*.

**The hatch has two renderings and one meaning.** Which one a mark gets is a question of **area, not
of category** — at 8px tall and 5% wide, or on a 9px key dot, a 6px pattern draws a single diagonal
line and reads as a rendering fault.

| Rendering | Where | Pitch | Duty cycle |
| --- | --- | --- | --- |
| SVG `<pattern>` | area marks — pie slices, stacked segments | 6px | 2.4 / 6 = 40% |
| `--mark-3-hatch` | line-scale marks — 8px bars, 9px key dots | 3px | 1.2 / 3 = 40% |

Same angle, same duty cycle, half the pitch. **Keep the two in step**; they are one category with two
sizes. *The CSS twin had been deleted 2026-09-04 as dead code — `barStyle()` sent every HTML-scale
mark to `--mark-3` solid — and was restored on 2026-09-05, because with the hue gone there is no
third solid left to send it to.*

**Two patterns, and the difference is only how many values are encoded at once:**

- **A tracked entity.** The field is `--mark-off`, the tracked one is `--mark-1`. Ranked bars work
  this way: rank is already carried by length, so value is free to mean *this is the one* — and the
  tracked bar being the darkest is a claim length cannot make.
- **Two or three categories.** `--mark-1`, `--mark-2`, `--mark-3`, no field. The pie works this way.

**`--mark-2` and `--mark-off` therefore resolve to the same primitive** — the licence `--mark-3` and
`--mark-off` used to share, for the same reason: **a chart uses one or the other, never both.** Two
or three encoded categories leave no unencoded field, and a chart that has a field encodes exactly
one thing. If one ever needs both, `--mark-off` moves and the marks stay.

**`--mark-off` stays at `--n-7` rather than following the mark down the ramp.** It was moved there
from `--n-6` on measured separation while the mark was briefly darker, and it is kept: against a
`#252525` mark the field is 32 L\* points clear, and `--n-6` would put the unselected bars at 1.90:1
on their own track — context that has stopped reading as a bar.

**There is no `--mark-4`, deliberately.** A fourth category folds into *Other* or the chart becomes
small multiples. `--mark-off` is what a chart shows but does not encode: the four holders you are
not tracking. It is recessive on purpose — five near-black bars made the Holders card heavier than
its own finding, which is the mistake `dataviz` describes when it asks for context to sit behind the
mark that carries the point.

**The reliefs, and there are two left of five.** `dataviz` requires visible labels or a table view,
and the marks now carry their own contrast — so three of the five scaffolds the hue needed are gone
with it. What remains is owed to the *hatch*, not to a weak fill:

1. **An edge for the textured mark.** A hairline ring on every 9px key dot, and one ink circle on the
   pie's **outer boundary** — on the circle, not on each slice, so the solids read as filled rather
   than outlined. Both exist because a mark that is mostly `--surface` has no edge of its own.
2. **The share table is the table view** of the pie above it, unchanged.

*Retired with the hue:* the ring on the dashboard's 24px tracking square (an ink square at 15.32:1
did not need a 14%-ink hairline over it), and the claim that a printed number and a semibold count
were *reliefs* at all. Both are still there — **every mark in this system still carries its number,
and the tracked row still takes a semibold count** — but they are now `CLAUDE.md`'s standing rule
that a mark never rests on one channel, not a patch on a mark that could not hold its own.

**Validation: the categorical validator no longer applies, and that is the point.** `dataviz`'s
`validate_palette.js` says so in its own last line — *"scope: categorical palettes only."* Its three
checks are a hue-separation check, a chroma floor and a lightness band, and a palette of three
neutral ramp steps has no hue to separate, no chroma to floor, and a lightness spread that **is** the
encoding. Running it here would return FAILED for reasons that were never about the design, which is
exactly the trap the three-tier apparatus below was built to work around. What governs instead is
already in this document: **WCAG contrast against the surfaces each mark sits on** (the table above),
**L\* separation between marks that co-occur** (32 points solid-to-solid, 35 to the hatch's mean),
and §3.1's evenness claim for the ramp itself.

---

#### The record: what was here until 2026-09-05

Kept because the reasoning cost a day to produce and a later session will otherwise re-derive it —
and because two of the numbers below are the reason the *dark* set cannot be guessed.

**The hue was `--lime` `#C2F662`, `L 0.908 C 0.183 H 126.2`, sampled not chosen.** Read off the
pixels of `visual_inspo/Screenshot 2026-08-31 at 2.13.59 PM.png`. Its two siblings in the folder were
sampled at the same time and rejected with reasons:

| Sampled | Value | OKLCH hue | Why not |
| --- | --- | --- | --- |
| 2.13.59 | `#C2F662` | 126.2° | shipped 2026-09-04, withdrawn 2026-09-05 |
| 2.16.27 | `#F3FFA5` | 114.7° | 1.07:1 on white — a tint, not a mark. Invisible on a 3px line or a 9px dot |
| 2.17.53 | `#E4A24E` | 70.3° | **6° from `--state-pending`** `#7A5200`, which by §2's own 15° rule is the same colour. Choosing it would have meant moving pending, and pending is on the gate banner |

All three reference screens are **one warm hue against ink with a third value as a diagonal hatch**,
which is where the *form* of this section came from. The form survived the hue; only what fills the
three slots changed.

**It was an ink-partner, not a white-partner**, and that was the single most important fact about it:
**1.26:1 on `#FFFFFF`**, 1.11:1 on the bar track, **12.16:1 on `#252525`**. It could never carry a
chart alone.

**Darkened to `#9ACB2F` and reverted the same day.** The drop to `L 0.780` bought 1.26:1 → 1.92:1 and
cost the glow that was the whole reason the hue was sampled rather than chosen. `--mark-off` did
**not** revert with it, and that is on the evidence: at `L 0.780` the mark and a `#B0B0B0` field sat
0.023 apart in lightness — under tritanopia the yellow-green axis collapses and lightness is all that
remains, so separation fell to **tritan ΔE 5.1**, below `dataviz`'s 6–8 floor. Against the restored
mark, `--n-7` measured **tritan 37.2 / normal 41.0** where `--n-6` gave 16.0 / 23.8. The field stayed
at `--n-7` on that evidence and it is still there for a neutral reason now.

**`#8A8A8A` was the best field for a mark at `L 0.780`, and it is not on the ramp.** Recorded then for
§10's dark set; still the note that matters most in this block, and now doubly so — it is also the
value a third *solid* mark would need. See the ramp argument above.

**The five-hue set that preceded it**, and why it went: `--cat-2` `#009956` sat 3° off `--state-live`
and `--cat-5` `#BF2846` sat 13° off `--state-expired`, inside the 15° at which two hues read as one
colour — so the jurisdiction pie's largest slice read *live* and its smallest read *expired*.
Green-means-good through the back door. Full account in §2.

**The pale yellow tint that was specced and never built.** `#F3FFA5` could not be a second *mark*: at
114.7° it was **11.5° from `--mark-1`** and validated as peers the two returned **normal-vision
ΔE 11.8**, below the floor of 15. Its only valid role was a wash of the same hue — `--mark-tint`,
ink at 13:1, for selected rows and not-yet-known states. Agreed, then scratched before it was built.
**No `--mark-tint` exists**, and with the hue withdrawn none can.

**The clearances the hue was measured to hold**, now moot and cheap to keep: 31.7° from
`--state-live`, 49.9° from `--state-pending`, 97.1° from `--state-expired`. The current marks clear
every status hue by construction, having none.

**The one passing palette, recorded so nobody rediscovers it and assumes we did not look.** The only
set returning `ALL CHECKS PASS` unmodified was hue-separated — `#7FA925, #3B9CF6, #C374D5` at
`L 0.68` — and it was rejected for putting blue and violet back into the charts. It passes a check
that no longer applies to anything in this section.

---

**Dark mode is owed and is now a smaller job.** §10 is the dark contract and this document is
light-only by decision. With the marks on the neutral ramp, the dark set is a re-step of §3.1 rather
than a hue to re-derive — but the *inversion* is real and is recorded in §11: on ink the light-mode
pairing flips, so the field has to be **lighter** than the mark rather than darker, and `--mark-off`
cannot simply be reused. The hatch inverts with it, stripes and ground both.

**Relationship to the existing chart tokens.** `--chart-series`, `--chart-trend`, `--chart-unknown`
and `--chart-grid` in §3.5 are unchanged and are *not* categorical. They encode magnitude, direction
and absence on the four dashboard widgets. The `--mark-*` set appears only where categories genuinely
have no order, or where one entity is being tracked. **A chart uses one system or the other, never
both** — `--mark-*` means *these are different*, §3.5's layers mean *this is more than that*, and a
chart that needs both is two charts.

*Both systems are now entirely neutral, which removes the one thing that used to distinguish them at
a glance. The distinction is structural rather than visual and always was: it is about whether the
values have an order, not about what they are painted with.*

## 4 · Typography

Urbanist for all text. Inconsolata for **every** number, date, year, count and code, without
exception — mixed numeral rendering across a dense table is immediately visible and cheap to avoid.

| Role | Face | Size / line | Weight | Tracking |
|---|---|---|---|---|
| `display-1` | Urbanist | 34 / 1.15 | 700 | -0.02em |
| `display-2` | Urbanist | 26 / 1.2 | 700 | -0.015em |
| `title` | Urbanist | 17 / 1.3 | 600 | -0.005em |
| `body` | Urbanist | 14 / 1.55 | 400 | 0 |
| `body-strong` | Urbanist | 14 / 1.5 | 500 | 0 |
| `label` | Urbanist | 13 / 1.4 | 500 | 0 |
| `micro` | Urbanist | 10.5 / 1.2 | 500 | 0.08em, uppercase |
| `figure-xl` | Inconsolata | 40 / 1.0 | 500 | -0.01em |
| `figure-l` | Inconsolata | 26 / 1.1 | 500 | 0 |
| `figure-m` | Inconsolata | 15 / 1.4 | 500 | 0 |
| `figure-s` | Inconsolata | 12.5 / 1.4 | 500 | 0 |

`font-variant-numeric: tabular-nums` on every Inconsolata run, so columns of numbers align and
figures do not jitter when they change.

**The secondary-figure treatment.** In any `figure-xl` or `figure-l`, a suffix, denominator or
decimal drops to weight 400 at 55% opacity: `194` stays full, `/ 381` recedes. Taken from three of
the seven reference screens.

> **Inconsolata is now exercised, and it holds.** This was recorded as *specified but unexercised*
> until 2026-08-31: the skeleton contract (§8) replaces every numeral in the product with a grey bar,
> so no preview rendered a real figure and the note asked for a re-check on first use.
>
> The build's **elapsed counter** is that first use, and it is a fair test — a `figure-s` run that
> changes ten times a second. Checked on the render rather than in the code, because a missing face
> fails silently: Inconsolata resolves over `file://`, `tabular-nums` holds the width steady as the
> digits change, and the counter does not jitter as it passes from `0.9s` to `1.0s`. The face reads
> as clearly distinct from Urbanist at 12.5px, which is the whole reason for having it.
>
> Elapsed time is **measured, not invented**, so the skeleton contract is intact — this is not a
> third exception to §8. The `figure-xl` / `figure-l` roles and the secondary-figure treatment are
> still unexercised; the drill-down list will be their first real use, and the same re-check applies
> there.

**Measure** is capped at `68ch` for body prose. Captions under widgets are the longest prose in the
product and the most likely to be skipped if they sprawl.

`brief.md` §1: Terrain is **English only**. No `data-zh`, no bilingual markup, no CJK face.

---

## 5 · Space, radius, elevation

**Space** — `2 4 6 8 10 12 14 16 20 24 32 40 56 72`. Two-based below 16, four-based above.
Nothing off-scale.

`10` and `14` were added 2026-08-31. The scale was 4-based, and the five previews reached past it
19 times — `--s-10` twelve times, `--s-14` seven — each written as `var(--s-14,14px)` against a
token that was never defined, so the fallback silently supplied the value and the gap never
surfaced. A scale violated 19 times in five files is the wrong scale, not 19 wrong usages. Card
heads and control gaps genuinely need a step between 8 and 12; the ramp is finer at the low end
where 4px is a visible jump, and stays 4-based above 16 where it is not.

**Radius** — `4` chip · `6` segmented pill · `8` control · `12` card inner · `16` widget ·
`20` shell · `999` pill.

`6` exists only for the active pill inside a segmented control: an 8-radius pill sitting in an
8-radius track with 2px of padding reads as a bulge, because the inner and outer curves are
concentric only when the inner radius is the outer minus the inset.

**Elevation is a hairline, not a shadow.** Depth comes from the ground↔surface step plus 1px
`--border`. Exactly one shadow token exists:

```
--shadow-float: 0 1px 2px rgba(37,37,37,.04), 0 8px 24px -6px rgba(37,37,37,.10);
```

It belongs to **anything that floats free of the page, over content it does not push aside** — the
profile menu, the version-history popover, the info popover, the drill-down slide-over, and the
docked composer. A widget card that reaches for a shadow is a widget card that has not earned one:
it sits *in* the layout, and the ground↔surface step plus a hairline is what says so.

*This was an enumeration of three until 2026-08-31, and it was already wrong when written — §7 gave
the shadow to the version-history popover as a fourth. A list that has to be edited every time a
component is added was standing in for a rule; the rule is above.*

---

## 6 · Motion

```
--ease:        cubic-bezier(.2, 0, 0, 1);      strong ease-out
--ease-in-out: cubic-bezier(.77, 0, .175, 1);  system-driven movement only
--ease-drawer: cubic-bezier(.32, .72, 0, 1);   the slide-over

--dur-1: 120ms;   hover, press
--dur-2: 200ms;   popover, chip, tooltip, close
--dur-3: 320ms;   slide-over, composer expansion, sidebar collapse
--dur-4: 520ms;   a build stage (platform.md moment 4)
```

**Which curve, and why it is not simply "morphing takes ease-in-out".** One curve carried everything
until 2026-08-31, which is one too few — an entrance and an on-screen step are not the same gesture.
Three is the whole vocabulary, and the assignment is a rule, not a list:

| | Curve |
| --- | --- |
| Anything the founder initiated — entrances, exits, click-triggered morphs | `--ease` |
| **System-driven** on-screen movement, where nobody is waiting on their own click | `--ease-in-out` |
| The drill-down slide-over | `--ease-drawer` |
| Constant motion — the build sweep, the skeleton shimmer | `linear`, no token |

The middle row is narrower than it first looks, and deliberately so. `cubic-bezier(.77,0,.175,1)` is
flat for its first half: it *is* an ease-in at the start, and the paragraph below rejects ease-in for
exactly that reason. So it is confined to movement no one is waiting on — the build bar stepping as a
stage completes, the composer dropping to the bottom of the thread after submit. Anything triggered
by a pointer or a key takes `--ease` and begins moving immediately. `--ease-drawer` is exempt because
it rises fast off the line despite its name.

Motion is restrained everywhere except moment 4, where the assembly *is* the design. Nothing
animates on a return visit — `platform.md` §2 is explicit that progressive build fires on creation
and after a confirmed scope change only, or it becomes a loading screen the founder watches daily.

**The view swap.** Moving between moments is the one transition the founder sees on every path, so
it is tuned rather than defaulted. The leaving view goes to `opacity: 0` and `translateY(-4px)` over
`--dur-2`; the arriving view starts 120ms later at `opacity: 0` / `translateY(6px)` and lands over
`--dur-3`. **Exit is faster than enter** — the founder has already decided to leave, and the system
should look like it is responding rather than deliberating. `--ease` is already a strong ease-out,
which is the correct family for an arrival; nothing here uses `ease-in`, which delays movement at
exactly the moment the eye is on it.

**The placeholder cycle** on the search field runs at 4.5s per line, crossfading with a 4px rise.
It **stops permanently on first focus or keystroke** — it is there to teach the shape of an answer,
and once the founder is typing it has done its job and is only competing with them.

**`prefers-reduced-motion` is mandatory, and it is not a shortened version of the motion.**
Transitions are switched off outright (`transition-property: none`), and **every state that motion
would have arrived at is declared instead** — the progress bar full, each stage ticked, the
narration present, cards and messages at rest. Shimmer goes flat, never off. The placeholder stops
on its first line.

The obvious implementation — collapsing every duration to `1ms` — was written first and is wrong.
It leaves the *arrival* at a state as motion's job, and a transition that is shortened can still
fail to run: under Chrome's forced reduced-motion the view transition never ticked, so the active
view stayed at `opacity: 0` and the entire screen rendered blank. Caught on 2026-08-31 by rendering
the prototype with `--force-prefers-reduced-motion`; it is invisible to code review, because the
CSS reads as correct. **Nothing a user needs to see may depend on a transition having run.**
Reduced motion must never mean reduced information, and that includes no information at all.

**Press feedback is not optional either.** Every pressable element takes `scale(.97)` on `:active`
over `--dur-1`. A control that does not depress reads as dead no matter how correct its colour is,
and this is the cheapest available proof that the interface heard the click. Hover rules are gated
behind `@media (hover: hover) and (pointer: fine)`, because on a touch device `:hover` fires on tap
and then sticks.

**One indicator cycle per page, 1.6s, `linear`.** The skeleton shimmer and the build's running-stage
sweep share a single value, so several things working at once read as one system working rather than
as three unsynchronised timers. Any indicator added later takes the same 1.6s.

**A progress bar may only claim what has finished.** The build bar advances on **completed stages** —
`scaleX(completed / total)` — never on elapsed time. Faking determinate progress for an unknown wait
is the same class of error as a green "open" cell: the interface asserting something the data cannot
support, at the most credulous moment the founder has. `platform.md` §10.8 lists search latency as an
open question, so there is no duration to honestly fill against. Where a wait is genuinely unbounded,
use a sweep and a measured elapsed counter, both of which are true.

### Standing prohibitions

Adopted 2026-08-31. Each is greppable, and §7 of the working plan for that pass greps them.

- **No `transition: all`.** Name the properties. `all` animates whatever a later edit happens to add.
- **No entrance from `scale(0)`.** `.95`–`.97` with opacity. Nothing in the world appears from nothing.
- **No `ease-in`**, per the argument above. `ease-in-out` is permitted under the rule above.
- **No transition or animation on a layout property** — `width`, `height`, `margin`, `padding`,
  `top`, `left`. Use `transform`, `clip-path`, `grid-template-rows`, or FLIP. **One exception**, and
  it is named rather than implied: the sidebar collapse transitions `width` and `flex-basis`, because
  a collapsing flex sibling has to actually surrender space and `scaleX` would squash the content
  column instead of resizing it. A new exception requires a written reason, not a convenience.
- **Hover-driven motion sits inside `@media (hover: hover) and (pointer: fine)`.**
- **Exit is faster than enter**, everywhere, not only on the view swap.

---

## 7 · Components

**The shell.** TIS submark top-left, inlined with `fill="currentColor"` so it inverts for free.
Project sidebar 260px, collapsing to 64px. Content area on `--ground` with widget cards on
`--surface`. No top bar — `platform.md` §6 makes the dashboard map-dominant, and the map needs the
vertical room.

**The sidebar**, top to bottom: submark + `Terrain` wordmark · primary action · `PROJECTS`
micro-label · project list · **profile row pinned to the base**. Collapsed, it keeps the submark,
**the collapse toggle**, the primary action as an icon, and the avatar.

**The toggle survives the collapse**, stacked under the submark in the 64px rail, and swaps
`panel-left-close` for `panel-left-open` — a crossfade under `filter: blur(2px)` at `--dur-1` in a
fixed 26px box, so the target never moves or resizes. Recorded 2026-08-31, because the first build
hid it: the sidebar could be collapsed and not expanded again, which fails the same test §7 holds
the info affordance to — a control the founder needs must be reachable without a pointer and must
not be hidden behind hover. `aria-label` and `aria-expanded` swap with the state.

On return (moment 6) it grows a project search and recency groups. This is the sidebar's second job
and the reason return is a moment at all: `platform.md` §2 routes every return through it, so it
is navigation, not a list.

**The profile row and menu.** Avatar, name, plan line; opens *upward* into a menu with Account
settings, Plan & billing, Help, Sign out. The rows exist; their destinations are undesigned this
pass, because pricing and whether a free tier exists are open (`platform.md` §11) and a Plan screen
would be designing against an undecided thing.

**The widget card.** `--surface`, radius 16, 1px `--border`, no shadow. Title (`title`) left,
controls right, **info affordance last in the head**. Caption in `body` at `--text-2` inside the
card, never below it.

The caption now carries **only the widget's generated finding** — what is crowded and what is open
(§6.1), heating or cooling in words (§6.3). Fixed explanatory sentences moved to the info affordance
on 2026-08-31 under the four conditions `platform.md` §6.1 sets out. Two of the four widgets keep a
caption block; Rivals and Lineage had nothing but the fixed sentence and now end at their table.

**Reflow, and the one place content scrolls.** Responsive behaviour here is structural, never fluid
type. The three subordinate widgets sit at a deliberate `1.2fr 1.4fr 1fr` — `platform.md` §6 weights
Lineage lowest — but that ratio only holds while there is room for it. Below 1180px the row becomes
`repeat(auto-fit, minmax(300px, 1fr))` and reflows to two columns, then one. Without that the Lineage
card head crushes until its own title overflows, which is the failure it was checked for.

The matrix has a real minimum width: five columns of plain-English labels do not shrink past their
words. It sits in its own `overflow-x: auto` container with `min-width: 520px`, so below that it
**scrolls rather than being clipped**. A clipped column is a cell the founder cannot reach, and
§6.1 makes every cell a click target. Nothing else in the product scrolls horizontally, and the
page never does.

**The info affordance.** A Lucide `info` at 16px in `--text-3`, last in every `.card-head`, opening
a popover that carries the widget's fixed explanation. `transform-origin: top right`, `scale(.97)`
plus opacity over `--dur-2`, `--shadow-float`, measure capped at `44ch`.

It is a real `<button>` with `aria-expanded` and `aria-controls`, **not a hover tooltip**. It opens
on hover, on focus and on tap; it stays open while the pointer is inside it (WCAG 1.4.13 — hoverable,
dismissible, persistent); Escape closes it and focus returns to the trigger. Those are the conditions
`platform.md` §6.1 makes the caption's relocation conditional on, so they are requirements rather
than polish. Hover opening is gated behind `@media (hover: hover) and (pointer: fine)`; the tap path
is what serves touch.

**Once one is open, the next opens instantly** — no delay, no transition. The initial delay exists to
prevent accidental activation, and four info icons sit in one viewport; a founder deliberately
reading across them should not pay it four times.

**What must never move into it:** the legend naming Crowded / Emerging / Open, the rising hatch, and
the chart's `Not yet published` swatch. Those are labelling, which §6.1 and §6.3 require on the card. The
popover carries explanation only. The test is whether a screenshot with no popover open still states
what the founder is looking at.

**The figure block.** `micro` label, then the figure in Inconsolata, then an optional delta pill.
The label is always above, never beside.

**The delta pill.** Radius 999, tinted background, arrow glyph + number. The only place `--state-up`
and `--state-down` appear.

**The status chip.** Dot + word. `--state-live` / `--state-expired`.

**The hairline table.** 48px rows, 1px `--border` dividers, no row fills, header on
`--surface-sunken` with `micro` labels. Numerals right-aligned and tabular. This is the drill-down
list, and `platform.md` §7 caps it at four fields — plain-English line, holder, year, live/expired.
Nothing else goes in it.

**The segmented control.** `--surface-sunken` track, `--surface` active pill, `label` type. Its
first consumer is Rivals, where `platform.md` §6.2 requires most-recently-active to be surfaced
*separately* from count — a caption cannot do that, because the fact only lands when the founder can
switch the sort and watch the list reorder.

**The slide-over.** Right-hand panel, `--shadow-float`, radius 16 on the left edge, focus-trapped,
Escape closes. Carries the drill-down. §7 is explicit: a list, not a page.

**The composer.** One component, two sizes: the whole content column on the conversation surface,
and docked bottom-right on the map. `--surface` card at `--r-widget`, textarea above, control row
below, `--border-strong` edge on focus. It is deliberately not two components that resemble each
other — `platform.md` §2 says chat is the means and not a place, and that is only true if the thing
you type into on the map is visibly the thing you typed into to make it.

- **Auto-resize** between 60 and 200px, reset on submit, and **no transition on the height**. Typing
  is the most repeated action in the product, and a transitioning height lags the caret. It is also a
  layout property, which is the second reason.
- **Send is inert until there is text** — `--surface-sunken` fill with a `--text-3` arrow, becoming
  `--text-1` fill with `--text-inverse` the moment the field is non-empty, over `--dur-1`. This is the
  cheapest available signal that the interface is reading what you type.

  *The inert arrow measures 4.41 on its track, just under the 4.5 in §3.2's table.* It stays. WCAG
  1.4.3 and 1.4.11 both exempt an inactive control, and the two candidate "fixes" are worse than the
  exemption: darkening it weakens the enabled/disabled distinction that is the whole point of the
  state, and dropping to `--text-disabled` (2.1) hides the affordance from someone who has not typed
  yet. Recorded rather than silently left, because it is the only value in the system below its
  table.
- Enter submits, Shift+Enter newlines.

**The composer carries the working state; you never navigate to a loading screen.** On submit the
textarea disables, the send glyph crossfades to the shared 1.6s sweep under `filter: blur(2px)`, and
the wording under the bar changes. The blur is there because two glyphs crossfading in one 32px box
otherwise read as two objects overlapping rather than one thing changing.

*Where that wording sits differs by instance, for a structural reason.* In the conversation the
status is its own line below the card. In the docked form it **replaces the hint text inside the
control row**, because a line below the card would push the bar's bottom edge away from the icon —
and the icon has to pin to the exact corner it grows out of, or the morph stops reading as one
object. Both instances mark it `role="status" aria-live="polite"`.

Its placeholder rotates through example descriptions — plain founder sentences carrying no company,
count or date, so §8 holds. They exist because nothing on screen otherwise says what a good answer
looks like; a static example answers that once, a rotating set also says *the range is wide*.
**Rotation runs only in the empty state** and stops for good on first focus or keystroke. It never
runs in the docked form: that is opened by someone who already has a question, and moving text they
have to re-read is noise.

**Nine lines, not six, since 2026-09-04, and the last three do different work.** `platform.md` §2.2
made the field accept a patent number, a company name or a classification code as well as a sentence.
That is not discoverable from a field that only ever demonstrates sentences, so three of the nine
demonstrate the other routes:

| # | Line | What it teaches |
| --- | --- | --- |
| 1–6 | *A quieter drone propeller for urban delivery…* and five more | The shape of a good sentence, and that the range is wide |
| 7 | *A patent number, if someone sent you one…* | That the field takes one |
| 8 | *A company you keep running into…* | That a rival is a starting point |
| 9 | *An IPC or CPC code, if you have been given one…* | That a code is accepted — **not** that one is expected |

**Two rules on those three, both load-bearing.**

- **No fabricated identifier, ever.** §8's contract forbids invented patent numbers, and a rotating
  placeholder is the most tempting place in the product to break it — a real-looking number would
  read as a live example. So line 7 **names the kind and shows no number.** The same applies to line
  8: no company name, invented or real.
- **Conditional phrasing is not decoration.** `brief.md` §1 locks the ICP to someone who does not
  speak patent and must never need to. *"If you have been given one"* is what keeps line 9 an offer
  rather than an instruction. Never *enter an IPC class*, never *paste a patent number* as a bare
  imperative. The sentence stays first, and stays six of the nine, because it is the path the product
  is designed around.

The sub-line under the question carries the same division once, statically, so the information does
not depend on a rotation having reached line 7: *Describe it in a sentence — or start from a patent
number, a company, or a classification code if you have one.* Then, unchanged, what Terrain will do
with it. The offer comes before the promise, because the founder has to know what to put in the field
before a claim about the output means anything.

**The thread.** The conversation surface's empty state is the question, the sub-line and the composer
centred. On submit the heading and sub-line leave over `--dur-2`, the thread takes the column, and
the composer drops to the bottom over `--dur-3` on `--ease-in-out` — system-driven movement, which is
the one place §6's middle curve applies on this surface.

Messages enter at `opacity 0` / `translateY(8px)` over `--dur-2`, **staggered 50ms**. The stagger is
decorative: it never blocks interaction, and **nothing's visibility depends on it having run** —
§6's blank-screen bug is the standing warning. The confirm card enters as one message and its rows do
**not** stagger; staggering them would imply the approaches were generated one at a time, which is a
claim about data the skeleton contract forbids.

**Composing, then unfolding.** Between the founder's message and the confirm card the thread holds a
**wordless sweep** — the shared 1.6s indicator, no text, absolutely positioned so it costs no height
of its own. It carries no words because the composer says them one line below, where the working
state belongs; saying it twice reads as two systems rather than one. The card then grows into that
same place on `grid-template-rows: 0fr → 1fr` over `--dur-3`, its contents rising `translateY(6px)`
and clearing a `blur(2px)` as the sweep leaves under the same blur. Once it lands, the track goes to
`auto` and the clip comes off, so a founder adding a row afterwards is not animating against a
finished entrance.

The height is the point. The confirm card is ~600px; landing it at `--dur-2` with no growth is a
jump-cut, and the thread beneath it teleports. `grid-template-rows` is on §6's allow-list beside
`transform`, `clip-path` and FLIP, so this costs no exception. **The card still enters as one
message** — nothing inside it staggers, per the rule above.

The narration runs in **two beats** (`Reading your idea` → `Drafting the criteria`), crossfading
under blur in the composer's status line. One string held for the whole wait reads as a fixed timer;
two read as work being done.

**Where the thread scrolls to.** Every other message scrolls the thread to its bottom. The confirm
card scrolls to its **top** instead, because it is the one thing in the product that has to be read
before it is acted on, and the bottom of it is the approve button.

**The reveal — prose arrives in chunks.** Every sentence the system speaks in a thread is revealed
in groups of **three words, 80ms apart**, each clearing `opacity 0` and `blur(2px)` over `--dur-2`.
A reply that lands whole says the wait was a timer; one that arrives says something was being
written, and the sweep above it stops being a claim the interface does not honour.

*This said **four words, 45ms** until 2026-09-04, and the build disagreed with it on this document's
own reasoning.* At 4/45 the line was finished before a reader had registered it had started — which
makes the sweep above it exactly the unhonoured claim the paragraph above exists to prevent. 3/80 is
roughly the rate a sentence is *written*, not the rate a machine could emit one. **The document is
the source of truth, and this is what that means in practice:** where a build finds that a specified
value defeats the intent specified alongside it, the value changes here and the reasoning is
recorded. It does not mean the number wins over the purpose it was chosen to serve.

Three things about the mechanism, because the obvious implementation is worse than this one:

- **The whole string is placed at once and then *lit*.** Appending chunk by chunk re-wraps the line
  under the founder's eye on every step and reflows the messages beneath it. Placing it up front
  settles layout on the first frame, so only `opacity` and `filter` move — which is what §6 asks
  for — and it puts the full text in the DOM immediately for anything reading the page.
- **Chunks, not characters.** At sentence length, per-glyph typing is a gimmick, and it pays a
  layout pass per letter on a line that is being scrolled.
- **One reveal at a time, and never stranded.** A second reply while the first is still arriving
  reads as two voices, so anything that starts a new exchange — a submit, a reset, Escape — lands
  the line in flight in full first. Half a sentence left on screen is worse than no animation.

`prefers-reduced-motion` sets the string outright and creates no chunk spans at all. §6's rule
applies with no exception: nothing a user needs may depend on a transition having run.

**Where it applies, and where it must not.** Any generated sentence in a thread. **Never the confirm
card** — it "enters as one message and its rows do not stagger" for a reason, and revealing its copy
would make the same claim about data by a different route. The card unfolds *beneath* a revealed
line rather than during it: two things moving for the same reason at the same time read as neither.

**The indicator hands off in place.** The wordless sweep is absolutely positioned, so the first line
of revealed text lands exactly where it was. The sweep fades under `blur(2px)` as the first chunk
lights — the shape never goes empty between them, the same rule the docked composer's surface
follows.

**Chat on the map — the icon that becomes the composer.** Bottom-right of the content column, a 44px
round icon button. On click it *becomes* the composer: one element, not a pill that fades out under a
panel that fades in. Spatial continuity is the whole point — the thing you pressed is the thing you
type into.

**Mechanism, and why it is not a width animation.** The composer is rendered at full width and
right-aligned at all times, and collapsed with
`clip-path: inset(0 0 0 calc(100% - 44px) round var(--r-pill))` — clipped to a 44px round window at
the right end. Expanded is `inset(0 round var(--r-widget))`. `clip-path` is interpolatable, carries
the pill→widget radius change inside the same property, and stays off the layout path, which
§6's prohibition requires. The icon glyph and the composer contents crossfade under `filter:
blur(2px)`.

`--dur-3` open, `--dur-2` close, `--ease` both ways. **`--ease`, not `--ease-in-out`**, even though
this is a morph: it is click-initiated, and §6's middle curve is flat at the start, which would read
as lag on the frame the founder is watching hardest. Use transitions rather than keyframes — someone
who clicks the icon and immediately presses Escape must see it reverse from where it is, not restart.

**The surface is never faded; only the contents are.** The first build faded the whole composer in
while the icon faded out, and holding the real interpolation at fixed progress showed why that is
wrong: between roughly 15% and 35% the icon had gone and the card had not arrived, so the shape was
briefly hollow. The clip *reveals* an already-painted surface instead, the icon rides its bottom-right
corner and fades over it at `--dur-1` after a 70ms hold, and the shape is solid at every frame. This
is invisible at full speed and obvious held — check it that way, not by watching it.

Expanded, it is the composer above, with the same contract — including the field's 60px rest, since
the two sizes §7 means are the two widths, not two fields. Asking **raises** a thread panel over the
map that dismisses on Escape; **the composer does not move** while the panel raises. The panel is a
`grid-template-rows: 0fr → 1fr` growth with its contents rising `translateY(6px)`, `--dur-3` open
and `--dur-2` close, and it starts **90ms behind the bar** so it reads as coming out of the bar
rather than arriving over it. Recorded 2026-08-31: the first build toggled `display`, which is a pop,
and the word in this paragraph was already *raises*. A scope change
produces **the same confirm card** inline in that thread — same component, same gate, refining rather
than creating. Approve → the short rebuild → History gains a row → **and the map reshuffles when
the founder presses the CTA, not before.**

**A change lands when it is asked for.** The first build applied the change the moment the rebuild
finished, behind the open panel. It worked, and it was wrong: the panel's own button was left with
nothing to do but close a panel, because the thing it was meant to confirm had already happened
where the founder could not see it. The order is now **panel out, then map** — the dock closes over
`--dur-2`, and the map reshuffles one beat later, in full view. A change made under a panel is not a
confirmation of anything.

What lands: the removed row leaves the matrix and the rivals table, both over `--dur-2`; then the
matrix re-renders and the whole grid re-enters on the same staggered entrance a fresh build uses.
One mechanism, shared in the code, so a rebuild and a build cannot drift apart. **A return visit
still animates nothing** — `platform.md` §2 is unchanged.

**The build block's footer takes the confirm card's shape**: note left, CTA right, `margin-left:auto`
on the button so it stays right when the row wraps. Two footers that mean "you are done here, go" in
the same session should not disagree about which side the go is on.

**On a first build there is no footer CTA at all — amended 2026-09-07.** The founder reached the
build by pressing *Build the map* on the set surface (`platform.md` §4b), so *Open the map* asked
them to confirm the thing they had just asked for. The build now lands on the map on its own, and the
footer keeps only its note.

*The rebuild keeps its CTA, and the two are not in conflict.* "A change lands when it is asked for",
directly above, is about a change to a map **that already exists** — the panel goes out, then the map
reshuffles in full view, because a change made under a panel is not a confirmation. On a first build
there is no map yet and nothing to confirm, so the same reasoning that gives the rebuild a button
takes it off the create path. **The rule was always about the rebuild; it now says so.**

*This replaces the floating pill and panel, and with it the overlap recorded on 2026-08-31 where the
resting pill sat on the Lineage caption. `platform.md` §11 is now closed in favour of the docked
form; the collision was one of the three reasons.*

**The version-history popover.** Anchored under the History button, `transform-origin: top right`,
`scale(.97)` plus opacity over `--dur-2`, `--shadow-float`. Rows are skeleton version labels, newest
tagged `Current`, each with a `Revert`. Revert routes through the confirm screen rather than acting
directly, because a revert *is* a scope change and `platform.md` §5 admits no exception. The
popover gaining a row after a confirmed change is what makes versioning visible — a skeleton version
chip cannot show that something was written.

**The widget page — a destination, not a step.** `platform.md` §7a.2. *It was "the third surface"
until the set surface landed on 2026-09-07; §2's list is the current one.* It reuses the map's shell wholesale:
the same `.main`, the same `.page-head`, the same `.card` / `.card-body` / `.tbl` / `.matrix`. A page
that invented its own components would be a second design language inside one product, and §7a.1 is
explicit that the page *explains* the dashboard rather than competing with it.

Three rules hold it together:

- **The finding leads, the evidence follows.** Every page opens with a `What this says` card before
  anything else. The order is the argument.
- **One source per component, except where resolution differs.** The page's matrix renders from the
  same row data through a shared `matrixHTML()` — two copies of a shape are two shapes the moment
  one is edited.

  **The filings chart is the stated exception.** It was cloned at first, and the clone was wrong: a
  nine-period series stretched across 1100px puts ~120px between points and reads as a zigzag rather
  than a trend. The dashboard bins to nine because nine is what reads at 360px; the page draws one
  point per year because that is what the room is for. Same data, two resolutions — which is what a
  small chart and a large chart have always legitimately done. Recorded 2026-09-01. *A second
  exception to this rule needs a written reason, not a convenience.*

  The clone also silently dropped the dashboard's axis row, so the page had **no x axis at all**
  until this pass. Cloning a component copies its markup, not its context.
- **Nothing animates on the way back.** Only a fresh build earns the staggered entrance. Returning
  from a page is navigation, not arrival — the same reasoning §2 applies to a return visit.

**The range control.** `All · 10 years · 5 years`, the same `.seg` component the Rivals sort uses,
in the filings page's card head. Two rules make it honest rather than decorative:

- **The excluded window keeps its width in *years*, not in pixels.** At twelve years the unpublished
  window is 14% of the chart; at five it is 38%. That is not a bug to smooth over — it is the single
  clearest statement the chart can make that a short window of patent data is mostly not visible yet.
- **The trend is fitted over the published points only.** Letting the incomplete window pull the
  line would make the chart assert exactly the decline `platform.md` §6.3 spends a paragraph telling
  the founder is not there.

The y axis keeps a **zero baseline** and scales to the visible window. Cropping the x axis may not
also rescale the story.

**The expand control.** A Lucide arrow in each card head, beside the info button, same 16px, same
press and hover treatment. Deliberately *not* the whole card and *not* the title: the Rivals head
already carries a segmented control, a sort and a popover, and a card that is entirely a click
target cannot hold any of them.

**The handoff — built provisionally.** `platform.md` §7a.3 is **open**: the choice between this row
and a full patent detail page has not been made, and this spec exists ahead of that decision rather
than because of it. Recorded here 2026-09-04 so the spec does not read as a settled one. Everything
below describes what is built; none of it forecloses §7a.3.

`platform.md` §7a.3. A drill-down row expands in place — `grid-template-rows`,
`--dur-2`, chevron rotating — onto exactly five fields: **Number · Holder · Where · Status · IPC**,
plus a copy control. It is a `<dl>`, because that is what it is.

What makes it a handoff and not a detail page is what is *absent*: no claims, no drawings, no
highlighting, no decode. The copy says so out loud — *"Whether it affects you is their call, not
ours"* — because an interface that shows a patent's insides implies it can tell you whether the
patent matters, and that is a legal judgement.

### The set surface — added 2026-09-07

`platform.md` §4b. A fourth surface, and the one place the founder sees what the search caught before
anything is drawn over it. **It reuses the drill-down row wholesale** — same four fields, same
expand-in-place handoff, same `--dur-2` and rotating chevron. Nothing about the row is redrawn for
this surface; if the two ever diverge, that is a bug and not a variant.

It reuses the shell as the widget page does: `.main`, `.page-head`, `.card`. It is a **step**, so
unlike the widget page it has no back control — it is left by approving it, and it is never returned
to.

**The star.** Lucide `star`, 16px, `stroke-width: 1.5`, in the row's control cluster. Two states:
outline in `--text-3`, and **filled in `--text-1`** — the darkest thing in the row, which is how
`--mark-1` already encodes *the entity being tracked* (§3.7). **No hue.** A gold star would be the
first decorative colour in the system and would read as *good*, which §2 forbids twice over. The
state change is a fill, so "never colour alone" holds without a label. `aria-pressed`, and the
accessible name says what it does — *more like this one* — not what it is.

**The row checkbox.** Near-black when checked, `--border-strong` unchecked, radius `--r-chip`.
`accent-color` is not used; the check is an inlined Lucide `check` on a filled square, because
`accent-color` renders a hue we do not have.

**The two controls sit in a cluster the expand toggle does not own.** The whole drill row is
currently one `<button>`. On this surface the star and the checkbox are real controls *inside* a row
that also expands, so the toggle can no longer be the row — it becomes a control beside them. Three
targets, each at least 44px of hit area, and tab order runs checkbox → star → expand.

**The question chips** (`platform.md` §4a). The existing `.suggest` / `.suggests` pair, unchanged —
dashed pill, `label` type, `--text-2`, `scale(.97)` on press. They are answers to a question in the
thread, so they behave like the composer's own affordances and not like filter pills.

**The abstention chip is separate from the answers, and it looks it.** `Not sure` sits last in every
row at `--text-3`, one step quieter than the answers beside it, because it is a different kind of
act: the others assert something, it declines to. *Nothing so far* and *They both apply* are
**answers** and take the normal weight — the distinction is knowledge versus its absence, not
positive versus negative.

**The answers read back on the card.** `platform.md` §4a asks for the round to be visible where it is
approved, so the confirm card carries a **recap row** — the same `.chip` used in the page head, in a
`.said`-shaped block directly under *You said*. Read-only: chips carry the answer, not a control.
*The card already has one unwired `[Edit]` on* You said; *a second dead button would be worse than
none, and §4a records wiring them as owed.*

**What is real English and what is a bar**, which §8 now states as a rule: an option that could only
exist because of what the founder typed is a bar; an option Terrain would offer anyone is real
English. So the jurisdiction and hardware/software chips carry words and the industry and
disambiguation chips carry bars, **in the same row of chips**, which looks odd until you know why and
is the contract working correctly.

**The provenance chip** (`platform.md` §6.1). `.chip` in the map's `.page-head`, present on every
visit including a return. It names both numbers — *built on N of M matched* — with the counts as
bars. It is not a control and not dismissible.

**The landscape summary.** `platform.md` §7a.4. Real English widget names as labels, generated
content as bars — the contract the captions already run on, one level up. It arrives as a **reply in
the chat**, revealed, rather than sitting on the map: §6 gives the map the hero slot, and an
assembled four-widget reading is long enough to take it.

**Two chips, because there are two kinds of act.** The docked chat's intro now offers `Summarise
this landscape` and `Change what this map covers` side by side. A summary reads the map back and
changes nothing, so it never reaches the confirm gate; a scope change always does. `platform.md` §5
asked that distinction to have a visible form — two chips are a better answer to it than one.

**Buttons.** Primary is `--text-1` fill with `--text-inverse` text — near-black, because there is no
accent to spend and four of the six light reference screens do exactly this. Secondary is
`--surface` with a `--border`. Tertiary is text-only.

---

### Restyled from IPtech — the form is kept, the aesthetic changes

Seven `Diverge` rows in `platform.md` §8.1 are charts IPtech has and this system had never specified.
**They are not redrawn.** A pie stays a pie. Terrain repackages Innovue's output rather than
replacing it, so a founder who has seen IPtech recognises the chart and Innovue is being asked for a
skin rather than a rebuild. Marks are §3.7 — ink, grey and a hatch, no hue in any of them.

**Two are built** — both on real observed data, in `design/previews/terrain-prototype.html`:

**Share · `sharePie` + `shareBars`.** IPtech's `T-Map › Company › Share`, screen 29. Three values, so
the full `--mark-1` / `--mark-2` / `--mark-3` set: ink, grey, hatch. Slices carry a 2px `--surface`
stroke — the gap dataviz requires — and **one ink hairline on the outer circle**, not on each slice.
The two solid slices hold their own arcs; it is the **hatch** slice, mostly `--surface`, that would
dissolve into the card without an edge, and ringing each slice instead would make all three read as
outlined rather than filled. The key sits beside the pie with a ringed dot per row, so **identity
never rests on one channel** and the label wears a text token. Beneath it, the same numbers as a
ranked share bar — the form IPtech already prints under its own pie, and the table view `dataviz`
asks for.

Two changes, and only one is aesthetic. **The correction:** IPtech's denominator is the five rows the
analyst selected, so a holder with 9 of 117 filings reads 28%; ours is a share of the whole scope.
**The editorial one:** the US takes the ink and Taiwan the grey, *even though Taiwan is three times
larger*. `--mark-1` means "the one being tracked" and the reader is a US founder. Ranking the darkest
slice by size would have made value carry rank, which §3.7 forbids — and **the removal of the hue
makes this stricter rather than looser**, because value reads as an ordinal scale where a hue did
not. A reader who found the darkest slice on the largest share would take the whole set for a
ranking. Five countries holding one filing each fold into *Other* and share the hatch.

**Ranking · `holderBars`.** IPtech's `M-Map › Company › Ranking`, screens 11 and 11b. Two measures on
different scales, so **two charts and never two axes** — dataviz is absolute on this and it is the
most common chart error there is.

**Each panel sorts by its own measure**, which is where the mark earns its place. A shared row order
would have let position carry identity and hidden the finding in this data: the holder at the top of
the patent count names **the fewest inventors** — 7, against the 20 fielded by a holder with only 4.
Sorting each panel separately makes the inversion visible, and one ink bar tracks the same holder
from first place to last. Rank moves; identity does not.

One holder is tracked at a time and the rest are `--mark-off`; the row is a real `<button>` and
clicking it moves the selection, which `hbSync()` mirrors into **every** panel plus the dashboard's
own Rivals card — one selection, two surfaces. The tracked row also takes a **semibold count**, so
the selection survives greyscale and print.

Holder labels stay skeleton bars because we have the counts and not the official English names for
two of the five. The bar **width is keyed to the holder rather than the row**, so a holder keeps its
silhouette when the panels reorder — and the label column is 140px, wider than the widest skeleton
class it can hold, because at 96px a wide label pushed its own track right and two equal values drew
as different lengths. 10px tracks on `--surface-sunken`, `--r-chip` on both track and fill, count
right-aligned in `figure-m`.

**Column selection · the matrix.** Added 2026-09-04, and it is the only mark the map can carry.
Density tone is locked to grey by `CLAUDE.md` and §6.1 forbids the interface implying *why* a cell is
empty, so a selection cannot enter a cell's fill. It goes on the column's **edge**: a 3px `--mark-1`
rule under the header and 2px rails down the cells, a mark beside the tone rather than replacing it.
The header also reveals that column's **total, summed from the observed cell counts** rather than
carried as a separate figure — so the header and the cells can never disagree. Navigation / control
comes to 26, which is the number the dashboard finding already states.

**This was the one place the withdrawn hue did work no neutral does for free**, and it is the honest
cost of §2's 2026-09-05 amendment. A lime rail was a different *kind* of thing from the grey it ran
across; an ink rail is the same kind at a darker step, and against `--density-4` `#5E5E5E` it
measures **2.36:1** — under the 3:1 a 2px mark needs. So **the rail inverts to `--text-inverse` on
that band and only that band**: on `--density-3` `#909090` ink is 4.80:1 and 45 L\* points clear and
needs nothing. The consequence is that the rail is no longer one unbroken line down the column. Two
things carry it instead and both were already built — the rail is 3px under the header and 2px down
the cells, a geometry no density tone anywhere in the grid has, and the header total is a figure
appearing where there was none, which does run uninterrupted.

**It is interaction-borne, and default none, on purpose.** A standing highlight would have to pick a
column, and the only defensible pick is the densest — which would put the mark on the **crowded**
column and read as *go here*, precisely the verdict §6.1 spends a paragraph forbidding. The mark
means *the one you are following*, so it arrives when a founder follows one. A second click clears
it: a selection you cannot drop is a filter, and this is not one. `#track` renders the state for the
deck.

**Three candidates were turned down for want of data**, and they are the same wall the four unbuilt
forms hit:

| Candidate | Why not |
| --- | --- |
| **Live vs expired**, everywhere it appears | The strongest one, and blocked. We hold no legal status for this project — screen 21 is a different dataset. The Rivals page's Live and Expired columns are skeleton bars, and colouring a skeleton encodes nothing |
| **The tracked holder** into Who cites whom | `cites` is anonymous skeleton rows with no identity to key a selection to |
| **Delta pills** | Built in the stylesheet and applied nowhere, because a delta needs two time points per entity and we hold one |

Recorded rather than left silent: **the remaining colour coverage is blocked by data, not by rule.**
Each of these lights up the moment `platform.md` §10.1 is answered.

**Four are specced and not built**, because the capture behind the illustrative set does not carry the data they need and
drawing a shape from numbers we do not have is the one thing §8 forbids. *A fifth was specced here
and withdrawn — see the retired row beneath the table:*

| Form | IPtech | What it needs that we lack |
| --- | --- | --- |
| **Radar** — Research Ability | `04` | Four axes: R&D capability, patent age, inventor count, active years. We hold one. Rings recessive at `--border`. **Capped at three series**, not five — one tracked at `--mark-1` with a 12% fill, the others `--mark-off` |
| **Chord + N×N** — Cross Reference | `08` | A citation pair matrix. Ribbon opacity carries volume; **direction is the information** and the ribbon is not, so the N×N reuses §3.4's density ramp and the diagonal takes `--surface-sunken` |
| **Expandable tree** — Activity | `09` `09b` | Per-holder active years. Indentation at `--s-16`, depth capped at two, disclosure a real `<button>` with `aria-expanded` |
| **Donut + stacked** — Legal Status | `21` | Live/expired per holder for *this* project; screen 21 is a different dataset and mixing them would be worse than skeleton. **These take the state hues, not `--mark-*`** — live and expired are ordinal, and §3.3 already owns them |

~~**Phase-space** — Life Cycle, screen `20`.~~ **Withdrawn 2026-09-04: this one needs no chart.** It
was specced here as the one genuine redraw — patents against holder count, one point per year, only
inflection years labelled. What replaced it is a sentence: `platform.md` §6.3's caption states
whether the space is early or late, alongside the heating / cooling reading it already carried. A
quadrant-read scatter is the most analyst-shaped form in this table and this user does not speak
patent, which is the same reasoning §6.4 used to reduce Lineage to a table and Cross Reference to a
hairline. **The spec is retired, not deferred.** If a chart is ever wanted here the argument has to
be made from the caption failing, not from this row.

**The rule that keeps the two systems apart.** A chart uses §3.7's `--mark-*` set **or** §3.5's
ordinal layers, never both. `--mark-*` means *these things are different*, or *this is the one*;
`--chart-series`, `--chart-trend` and the density ramp mean *this is more than that*. A chart that
needs both encodings is two charts.

## 8 · The skeleton contract

Terrain has no API yet (`platform.md` §10.1 is unanswered and blocks everything downstream of it),
so every preview shows a populated screen without live data behind it.

**Chrome is real. Identities stay bars. Figures are illustrative.**

| Real English | Grey bar | Illustrative |
|---|---|---|
| Nav labels, widget titles, buttons, column headers, captions, legends, empty-state copy, menu rows, axis *titles* | Company names, dates, years, project names, user name, plan tier | Patent counts, cell values, jurisdiction split, axis *values* |

**No patent number, no named company, no plausible-looking date.** An *identity* is never invented,
because an invented one reads as a live example — that is the line, and it has not moved.

*The third column is new as of 2026-09-08, and it is a real narrowing of the contract.* It read
**"Data is a bar. Nothing is invented"** until the prototype was populated, and everything numeric
was genuinely observed. The figures are now modelled rather than observed — the repository is public
and the observed set was a client's — so the honest claim is *illustrative*, not *nothing invented*.
The invariants hold: cells sum to the scope figure, the finding quotes the true maximum, the
distribution is representative. **The screen must still read as populated through layout alone**,
which is the harder and more useful test.

**There are exactly two exceptions, and they are the same exception twice.** Where a widget's whole
purpose is to express a *shape*, rendering it flat would show nothing, so the shape is drawn and the
values stay bars:

- **Matrix tone.** Cells carry the `--density-*` ramp and the rising hatch. Cell *counts* are bars.
- **The filings series.** The chart draws a curve so the three-layer grammar in §3.5 is visible at
  all. Both axes are bars, there are no values anywhere on it, and the caption is a bar above the
  mandated warning sentence.

Neither claims a fact. A tone is not a count and an unlabelled curve is not a year. If a third
exception is ever proposed, treat that as evidence the contract is being eroded rather than
extended.

### The options rule — an application, not a third exception

**Added 2026-09-07 with `platform.md` §4a.** The narrowing questions put chips on screen that a
founder chooses between, and the table above does not obviously say which side they fall on. It does
once the question is asked correctly:

> **An option that could only exist because of what the founder typed is a bar. An option Terrain
> would offer anyone is real English.**

| Real English | Bar |
| --- | --- |
| *Anywhere · United States · Europe* — Terrain's own vocabulary, the same category as a menu row | *Which industry is this for?* → the industries inferred from the idea |
| *Hardware · Software · Both* | *You said "memory" — did you mean…* → the readings inferred from the sentence |
| Every question's text, every button, every column header | |

**This adds nothing to the contract.** Generated content was always a bar and fixed chrome was always
real; the rule just names the test for a control that can be either. It is the same test the confirm
card already passes silently — its headings are real and its rows are bars.

**The set surface's counts split on the same line.** *N matched* and *top N recommended* are corpus
values and stay bars. What the founder has **changed** about the recommendation is a real integer —
*2 removed*, *1 starred* — because it counts what they did and not what the data says.

**And the map's provenance chip is where the split does visible work.** Arrived at directly, it reads
*built on 117 of ▤▤ matched*: the set carries a scope figure and the total behind it never did.
Reach the map through a re-baseline or an edited selection and the first number **becomes a bar
too**, because the corpus it describes is one the set does not describe. A number turning into a bar
at exactly the point the data runs out is the contract working, not failing.

---

## 9 · Icons

**Lucide, and nothing else.** No Heroicons, no Feather, no Material, no one-off SVG from a search
result. Mixing sets shows in the stroke weight and corner radius immediately, and it reads as an
interface assembled from parts.

Inlined as SVG — previews have no CDN. `stroke-width: 1.5`, `fill: none`,
`stroke: currentColor`, round caps and joins. 20px in navigation, 16px inline with text.

---

## 10 · The dark-mode contract

Not built this pass. What makes the next one cheap:

**No component may reference a primitive (`--n-*`) or a raw hex. Every component reads a semantic
token.** Dark mode then redefines the **30** tokens in §3.2–3.6 under both `:root[data-theme="dark"]`
and `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`, and touches no
component CSS. One grep — raw hex outside `:root` — proves compliance.

The dark screen in `visual_inspo/` is the reference, and it says **the dark theme is not an
inversion**:

- **Surfaces stop being fills.** That screen separates every region on hairlines alone, with almost
  no card background. A surface lifted more than a few percent above a near-black ground reads as
  muddy grey, so the ground↔surface step carrying the light theme has to be replaced by dividers.
- **State colours desaturate rather than lighten.** Its green is a dusty sage, its red an oxblood —
  both well short of §3.3's saturation. **This is the one part that cannot be a mechanical swap.**
  The pairs need choosing and contrast-checking by hand against a dark ground.

The submark already inverts, since it is inlined with `currentColor`.

---

## 11 · Open

*Closed 2026-08-31: **chat's resting form**. It is the docked command bar, collapsed to a 44px icon
that expands into the composer — see §7 and `platform.md` §11 for the three reasons.*

- **The accent.** None chosen. Primary actions are near-black in the meantime. `brief.md` §4 flags
  this as upstream-affecting — it lands in the monorepo's gradient↔pillar pairings.
- ~~**Density thresholds** for the three zones.~~ **Closed 2026-09-04**, once there was a real
  distribution to cut against. On the prototype's 8×8 matrix — 64 cells, counts 0 to 19 over 117
  patents — the bands are `0 → density-0`, `1–2 → density-1`, `3–6 → density-2`, `7–12 → density-3`,
  `13+ → density-4`. They are **relative to the matrix**, per `platform.md` §6.1, never absolute:
  the function is `band(n)` in the prototype and it takes the count, not a percentile. Guessing these
  from an empty grid was the thing that kept the item open; a populated one settled it in a minute.
- **The IPC confidence signal** (§6.1) — no visual form yet, and it must not become a statistics
  lesson.
- **Dark-mode state pairs**, per §10.
- **The sidebar project search** (§7) is rendered but deliberately not wired. Filtering a list whose
  every label is a grey bar requires matching a typed string against invented project names — so the
  control can only be dead or dishonest, and dead is the better of the two until there is data. Wire
  it the moment `platform.md` §10.1 closes.
- **Token extraction.** Each preview inlines its own `:root` block, because `CLAUDE.md` requires
  self-containment and permits extraction only once three previews independently want the same
  value. That is already true. Held deliberately for the definition phase — extracting early is the
  most likely way to lock in a bad early guess. **Trigger: once the language locks, extract to
  `design/tokens/`.**

  **Tried 2026-09-03 as a recorded exception, and withdrawn 2026-09-08.** `design/tokens/` held a
  generated extraction — `tokens.json` (W3C format), `tokens.css` and a `build.py` — built for
  **handoff to Innovue** rather than internal reuse, which was the distinction that made it
  permissible. It is deleted. Nothing here imported it, which was the point, but a copy of this
  document in another format still had to be kept in sync with it, and it fell behind twice. The
  extraction is a build away whenever a handoff actually needs one; carrying it standing was the
  mistake. **Previews still inline their own blocks and must continue to.** *The per-component
  data-shape manifest that sat in the same folder was never part of the extraction and survives at
  `design/components.md`.* The trigger above still stands.

- **The chart forms IPtech uses that this system has never specified.** Surfaced 2026-09-03 while
  building `design/previews/iptech-terrain-comparison.html`. Matching IPtech's charts in Terrain's
  language is a **visual adaptation, not a restyle**, and the adaptation will force tokens the ramp
  does not contain: radar/spider plots (grid ring weight, series ordering beyond three layers), pie
  and share charts, chord diagrams (ribbon opacity, directionality), donut-plus-stacked-bar
  composites, N×N citation matrices (diagonal treatment, empty-cell states distinct from the density
  ramp), and expandable tree lists (indentation scale, depth limits).

  ~~**The hard one is categorical colour.**~~ **Closed 2026-09-04.** The palette is §3.7; the rule
  that permits it is §2's amendment. The reasoning that had blocked it — that five hues meaning
  nothing is exactly what §2 forbids — conflated *meaningless* with *non-ordinal*. A categorical hue
  carries identity; it is **order and desirability** that §2 actually prohibits, and those are still
  prohibited.

  *Corrected the same day.* The shadcn-derived five-hue set that first closed this item was
  **withdrawn hours later** — two of its slots collided with the reserved status hues, so the pie
  read green-means-good. What shipped instead was one hue, one ink, one texture, capped at three
  values.

  ***Closed differently, 2026-09-05: there is no categorical colour.*** The one hue was withdrawn
  the next day and `--mark-1` is `--n-10`. The item is still closed — the palette is still §3.7 and
  the *form* is unchanged — but it closed as **three neutral ramp steps and a texture**, which needs
  no amendment to §2 at all. §2 carries all three amendments in order so the two corrections are
  legible rather than silent, and the reasoning for this one is at the end of that section. What it
  turned on: the hue was becoming the accent by default in the one artifact going outward, and it
  contradicted `case.md` §6.4, which tells that reader there is no accent colour and that colour
  appears in exactly three places.

  **What the withdrawal closed with it.** The dark step for a lime `--mark-1` is no longer owed —
  there is no hue to derive one from, and the marks re-step with §3.1 in §10's pass like every other
  neutral. *The number is kept in §3.7's record block* (`L 0.908 C 0.183 H 126.2`, **12.16:1 against
  `#252525`**) because it is the evidence any future proposal to restore a hue would argue from.

  **Still owed, and unchanged by the withdrawal: `--mark-off` on a dark surface.** On ink the
  light-mode pairing inverts — the field has to be *lighter* than the mark rather than darker — so
  the dark set cannot reuse `--n-7`. This was always a lightness problem rather than a hue problem,
  which is why removing the hue does not touch it. The hatch inverts too, stripes and ground both.
  The search starts from the `#8A8A8A` note in §3.7's record block.

  **Newly owed: a third solid, if one is ever wanted.** The third mark is texture-only because the
  ramp has no step that clears 3:1 and stays clear of the other two — `#8A8A8A` would, and is not on
  the ramp. Adding it breaks §3.1's evenness claim, so the trade is recorded rather than taken.
  Numbers in §3.7.

  **The accent: back to fully open, and `CLAUDE.md` untouched.** `brief.md` §4 recorded
  `#C2F662` as a candidate with numbers and not a decision, and the withdrawal restores exactly that
  state — a candidate with numbers, now with the additional evidence that shipping it as a chart mark
  is *not* a safe way to trial it, because a reviewer does not distinguish a chart mark from an
  accent on sight. That is the finding worth carrying into whenever the accent is actually decided.

  These are **captured live as they surface**, logged in `design/tokens/README.md` §3 against the
  component that forced each one, rather than guessed in advance.

---

## 12 · Decisions recorded here that belong upstream

For the propagation pass described in `brief.md` §6:

- Terrain's neutral ramp is Terrain's own, not the monorepo's. If Terrain graduates into the
  monorepo, the two ramps have to be reconciled deliberately rather than merged.
- The semantic-colour rule (§2) is narrower than the monorepo's brand system allows and was written
  for a product with no accent. It does not automatically transfer.
- `#252525` as ink and the `currentColor` submark treatment are shared with the monorepo and should
  stay shared.
