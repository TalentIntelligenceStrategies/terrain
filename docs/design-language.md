# TIS Terrain — Design Language

> How Terrain looks. Settled 2026-08-31 unless marked open.
> [brief.md](brief.md) is what Terrain *is*. [platform.md](platform.md) is what gets *built*.
> This file is the third of three, and the exception is deliberate — see `CLAUDE.md`.

**This document is the source of truth. Every preview in `design/previews/` is a view of it.** If a
preview and this file disagree, one of them is a bug; decide which and fix it. Never let a preview
become the only record of a decision.

**Both modes, since 2026-09-08.** This file was light-only by decision until then, with §10 held as
a contract for a later pass. The pass happened: §10 is now the dark specification and the measured
tables that go with it. Everything from §3.1 to §3.7 describes the **light** values, which are still
the ones a component is written against — dark redefines the semantics underneath and touches no
component rule.

---

## 1 · The read on the reference screens

Seven screens in `visual-reference/visual-inspiration/` — six light, one dark. They are not one aesthetic, but they run one
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

**Observed: the reference screens do not use categorical palettes at all.** The reference screens
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
| `--ink-hover` | `--n-9` | hover on an ink fill |
| `--indicator-rest` | `--n-5` | a dot or ring for a thing not yet current |
| `--track-pressed` | `--n-4` | a bar track under the selected row |
| `--cell-mark` | `rgba(37,37,37,.14)` | skeleton bar inside a matrix cell |
| `--cell-mark-inverse` | `rgba(250,250,250,.30)` | the same, on `--density-4` |
| `--scrim` | `rgba(37,37,37,.18)` | behind the slide-over |
| `--key-ring` | `rgba(37,37,37,.24)` | the 1px ring on a 9px legend key |

The last four are alpha rather than flat neutrals because they composite over a surface whose
colour varies — a matrix cell is one of five tones, the legend key sits on a slice, and the scrim
sits over the whole page. A flat neutral would be wrong on four of the five. They are still tokens,
and still the only alpha values in the system.

**`--ink-hover`, `--indicator-rest`, `--track-pressed` and `--key-ring` were added 2026-09-08, and
the reason is worth recording because it is the shape of the mistake rather than the fix.** §10's
whole claim is that dark is cheap *because* no component reads a primitive or a raw hex — and the
claim was false. Eleven places in the prototype reached past the semantics into `--n-*` or wrote an
alpha inline: four hover states on ink fills, two skeleton bars the founder had acted on, a waiting
ring, a project dot, a pressed bar track, an arrow between two bars, and the legend key's ring.

Every one of them is a place that would have **stayed light** when the tokens flipped, and none of
them would have thrown, logged or failed a review — the CSS reads as correct.

**The check, stated precisely, because a naive grep no longer works.** It was *"raw hex outside
`:root`"* while there was one theme. There are now three token-defining blocks — `:root`, the dark
media block and `:root[data-theme="dark"]` — and all three legitimately contain raw hex, so grepping
"after `:root`" reports dozens of false positives and a check nobody can pass is a check nobody runs.

Cut the three blocks and the comments first, then look for three things in what remains:

```
var(--n-*)     →  0      a component reading a primitive
rgba() / hsl() →  0      an alpha written inline instead of tokenised
raw hex        →  0      anything at all
```

Comments are excluded because §3.4, §3.7 and §10.3 all quote measured hex values as prose, and those
are the evidence rather than a violation. All three currently return zero.

*The eleventh site needed a token that already existed: an arrow stroked `--n-6` became
`--text-disabled`, which is the same value and is exactly what §3.2 means by "non-text use only".
Four of the eleven needed no new token either. The lesson is not that the system was short of
tokens — it is that a rule nothing greps is a rule that has already been broken.*

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

`--density-0` sits 1.08 against the white card, which is nearly invisible — correct, since an empty
cell should read as nothing. **The grid is therefore delineated by 1px `--border` gridlines, not by
cell fills**, so the matrix reads as a matrix even when every cell is empty (an edge state
`platform.md` §6.1 requires).

***That gridline decision stopped being a nicety on 2026-09-10 and became load-bearing.*** The
surviving view is technology × **holder** (`platform.md` §6.1), and it is much the sparser of the
two the map used to offer: no cell exceeds 5 against the outcome view's 14, and most of the grid
sits at `--density-0` or `--density-1`. **A matrix drawn only by its fills would, on this axis,
frequently be a handful of pale marks on a card.** The gridlines are what make it read as a grid at
all.

**Why the ramp is grey — re-founded 2026-09-10, and the conclusion is unchanged.** *It rested on
the blind-spot argument: an empty cell is ambiguous, nobody has patented plastic blades for noise
reduction, and that is either an opportunity or a sign that plastic is inherently louder and
everyone knows it. That argument was about **whitespace**, and `brief.md` §1 dropped the claim.*

**The replacement is shorter and it is a stronger prohibition, not a weaker one.** The tone now
encodes **one holder's count against one approach**. So a red↔green ramp would not merely answer a
question the data cannot — **it would grade a competitor.** Green on a rival's cell says *they are
doing well here* or *this is bad for you*, depending on which way the reader takes it, and the
interface would be making one of those claims without knowing which. **Grey states quantity and
stops.**

*The blind spot itself is untouched and lives at `platform.md` §6.1, restated for a holder row: the
map shows who is where; it cannot say why anyone is absent.*

#### Two channels, because rising is not a point on the ramp

*Retitled 2026-09-10. It was "The Emerging problem, and how it is solved", and the problem was
named after a state that no longer exists — the argument underneath it is durable and is the whole
reason the legend can be rewritten without redesigning anything.*

`platform.md` §6.1 named three states until 2026-09-10 — Crowded (地雷區), Emerging (新興區), Open
(處女地帶). It was tempting to map them onto three tones. **That is wrong, and the error is
structural:** *Emerging* was *low count **and** rising recently*. It is a second dimension, not a
point between two others. A single ramp cannot encode it, and forcing it produces a scale whose
middle means two different things.

**Resolution: tone encodes count; a corner hatch encodes rising.** A cell can be light *and*
hatched, and it is only expressible because the two channels are independent.

***The zone names went and the two channels stayed, which is the test of whether this section was
ever about the names.*** `platform.md` §6.1's legend is now the ramp read as *fewer → more filings*
plus one hatch entry reading *Rising*. **Dropping the state names removed the thing that made two
channels look like three states**, so this encoding is now the whole of the design rather than a
workaround inside a naming scheme that fought it.

**The hatch entry is labelled by its channel, not by a state** — and that was already the rule
before there were no states to name. *Rising* over a light tone is a cell somebody has just started
filing in; the same hatch over a dark tone reads **crowded and rising**, which is a true and useful
cell and a fourth reading three state names had no room for. **Labelling that swatch *Emerging —
low, but rising* was the earlier wording, and it was wrong about the data on screen:** two of the
three hatched cells in the prototype sit at `--density-4`, the tone the same legend called Crowded.
The correction was in the words, not the data — and not in this section's design, which is what
made the dark hatched cell legitimate in the first place. **That correction is the precedent for
the whole legend rewrite**: the fix for a label that overclaims is a label that names its channel.

#### `Open` may never describe a holder's absence

*Promoted 2026-09-10 out of a condition and into a standing prohibition. It was written as
"`Open` is conditional on the axis" while `platform.md` §6.1b offered a switch between a technology
× outcome grid and a technology × holder grid; there is one grid, so there is no condition left —
only the rule.*

> **Labelling one holder's absence as open ground is the interface answering a question the data
> cannot.**

`--density-0` means *this one holder has not filed against this approach*. That is not a gap in the
field and it is not enterable ground; it is one party's profile. It is the identical failure this
section already forbids of a red↔green ramp, arriving through the **label** instead of through the
hue.

**So the word is gone from the legend, and it may not come back through copy.** `platform.md` §6.1
carries the same prohibition on the filtered list's empty state, which is the other place it would
try to reappear.

*This is why §2's rule reads "every coloured element also carries a word".* The word is not a
caption on the colour; it is where the claim lives. **The ramp is the part that stays put** — five
measured steps, unchanged since 2026-08-31, through two complete rewrites of what the words beside
them say.

**And the thresholds are relative, which is simpler than it was.** The cuts are fractions of the
view's own maximum — 2/14, 6/14 and 12/14 — so at a maximum of 14 they land on exactly 2, 6 and 12.
*There were two views with maxima of 14 and 5, and a fixed ramp left the second uniformly pale.
There is one view and one maximum now, and the relative arithmetic that the switch forced is kept
because it was always what `platform.md` §6.1 claimed.*

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
| `--skeleton-strong` | `--n-5` |

**`--skeleton-strong` is a bar the founder has acted on** — starred on the set surface, or edited in
the confirm card. One step darker, so *changed* reads without leaving the skeleton grammar and
without spending a hue on it. *Recorded here 2026-09-09. It had existed since the set surface was
built and its rule lived in a CSS comment in the prototype and in §10.3's dark values table — which
is precisely the drift this document is the defence against.*

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

*Retired with the hue:* the ring on the 24px tracking square (an ink square at 15.32:1
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
pixels of `visual-reference/visual-inspiration/Screenshot 2026-08-31 at 2.13.59 PM.png`. Its two siblings in the folder were
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
and absence on the widgets in the pane. The `--mark-*` set appears only where categories genuinely
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
<!-- the confirm card's h2 ran at 15px until 2026-09-11 — a size that existed there and nowhere
     else, on the most important heading in the product, rendering smaller than the body copy
     beside it. It is `title` now. The gate's sentence went 13 -> 14 (`body`) in the same pass,
     for the same reason: it was set smaller than the lede it follows. -->
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

> **And it was not enforced, which is worth more than the rule.** Found 2026-09-11: nothing in the
> confirm card capped anything, so in a 680px column its lede ran ~88 characters and its gate ~95 —
> the two most-read sentences in the product, both past the rule written three paragraphs up. The
> cap is not a new decision and the fix was two declarations; the finding is that **a measure rule
> only holds where something declares it**, and no preview will tell you which containers are
> missing it. `.conv-sub` and `.conv-note` had theirs from the first build, which is exactly why the
> gap was invisible — the surface looked like it had a measure discipline.

`brief.md` §1: Terrain is **English only**. No `data-zh`, no bilingual markup, no CJK face.

---

## 5 · Space, radius, elevation

**Space** — `2 4 6 8 10 12 14 16 20 24 32 40 56 72`. Two-based below 16, four-based above.
Nothing off-scale.

**Group gaps are at least twice the gaps inside the group, or the grouping does not read.** Added
2026-09-11 from the confirm card, which had it backwards: 20px between its two turns against 16px
between the boxes inside one of them — 1.25×, so the gate read as a fourth metadata box rather than
as the thing the card had been building to. It is 32 against 12 now. The scale is the constraint
that makes this cheap to get right and easy to get wrong: **there is no 28**, so "one step up from
24" is 32, and the temptation to split the difference is the temptation to add a step.

**A label that heads a box is not a label inside it.** Same pass, same card. `micro` is one role, so
"AND YOU TOLD US" and the "DIRECTION" beneath it were the same size, the same tracking and the same
`text-3`, eight pixels apart — two labels, not a heading and its contents. The box title takes
`text-2` and a 12px gap; §2 has no colour to spend here and does not need any, because hierarchy,
weight and spacing are what the neutral ramp is for.

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
`--border`. ~~Exactly one shadow token exists:~~ ***Two do, and this sentence has been wrong since
`--shadow-drop` was added.*** Corrected 2026-09-11. `--shadow-drop` is the same elevation expressed
as a `filter` rather than a `box-shadow`, for the clipped composer — `clip-path` eats a `box-shadow`,
but a filter on the unclipped parent sees the clip. §10.3 already redefined both for dark while this
line still claimed one; the prototype has defined both throughout.

```
--shadow-float: 0 1px 2px rgba(37,37,37,.04), 0 8px 24px -6px rgba(37,37,37,.10);
--shadow-drop:  drop-shadow(0 1px 1px rgba(37,37,37,.05)) drop-shadow(0 6px 16px rgba(37,37,37,.10));
```

It belongs to **anything that floats free of the page, over content it does not push aside** — the
profile menu, the version-history list where it floats, the info popover, **the list's sort and
filter popovers**, and **the record over the right pane**.

***And on the record the shadow is not what carries the edge — the hairline is, which is this
section's own rule arriving somewhere it was not expected.*** *Added 2026-09-11, after the record
was tried borderless on the reasoning that shadows are for elevation and borders for structure.
Measured in dark, the leading edge was `#1A1A1A` card against `#1A1A1A` widget with a `#181818`
gutter between them: a **two-level step**, invisible. Two things caused it, and both generalise —
`--shadow-float` is downward-biased with a `-6px` spread, so it contributes almost nothing at a
**vertical** edge; and an elevation shadow needs a background that **recedes**, where the record
floats over other cards of its own surface value. **A shadow cannot separate two surfaces of the
same colour.** The record carries `1px --border` on all four sides in both modes, and where it goes
flush to the pane below the breakpoint it carries none, because there the surrounding chrome already
supplies the edges.* *The chat panel over the left column was
the fifth and is deleted — `platform.md` ~~§5~~.* A widget card that reaches for a shadow is a widget card that has not earned one:
it sits *in* the layout, and the ground↔surface step plus a hairline is what says so.

*This was an enumeration of three until 2026-08-31, and it was already wrong when written — §7 gave
the shadow to the version-history popover as a fourth. A list that has to be edited every time a
component is added was standing in for a rule; the rule is above.*

---

## 6 · Motion

```
--ease:        cubic-bezier(.2, 0, 0, 1);      strong ease-out
--ease-in-out: cubic-bezier(.77, 0, .175, 1);  system-driven movement only
--ease-drawer: cubic-bezier(.32, .72, 0, 1);   an overlay entering from an edge

--dur-1: 120ms;   hover, press
--dur-2: 200ms;   popover, chip, tooltip
--dur-3: 320ms;   the record, composer expansion and collapse
--dur-4: 520ms;   a build stage (platform.md moment 4)
```

**Which curve, and why it is not simply "morphing takes ease-in-out".** One curve carried everything
until 2026-08-31, which is one too few — an entrance and an on-screen step are not the same gesture.
Three is the whole vocabulary, and the assignment is a rule, not a list:

| | Curve |
| --- | --- |
| Anything the founder initiated — entrances, exits, click-triggered morphs | `--ease` |
| **System-driven** on-screen movement, where nobody is waiting on their own click | `--ease-in-out` |
| An overlay entering from an edge — the record | `--ease-drawer` |
| Constant motion — the build sweep, the skeleton shimmer | `linear`, no token |

The middle row is narrower than it first looks, and deliberately so. `cubic-bezier(.77,0,.175,1)` is
flat for its first half: it *is* an ease-in at the start, and the paragraph below rejects ease-in for
exactly that reason. So it is confined to movement no one is waiting on — the build bar stepping as a
stage completes, the composer dropping to the bottom of the thread after submit. Anything triggered
by a pointer or a key takes `--ease` and begins moving immediately. `--ease-drawer` is exempt because
it rises fast off the line despite its name.

*The third row read "the drill-down slide-over" until 2026-09-10 and named a component rather than
a gesture, which is the same fault the shadow list above was corrected for on 2026-08-31. **The
slide-over is retired and the curve is not** — it now names what it was always for, an overlay
arriving from an edge. *It had two users for one day; the chat panel from the left is deleted, so
the record from the right is the only one. A curve named for a gesture survives losing a user,
which is the whole point of the correction.*

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

**Two bugs in the widget entrance, found 2026-09-08 and both there from the start.** They are
recorded because neither was visible in review, neither would ever have failed a screenshot, and the
entrance §7 specifies — *only a fresh build earns the staggered entrance* — was not actually
happening.

*The widget entrance had never run on a fresh build.* `restagger()` removed a class, forced a reflow
and re-added it, on the assumption that applying the start state snaps the cards to `opacity: 0`. It
does not: the same style change that applies `opacity: 0` also applies the transition, so the cards
animate **towards** zero and get retargeted upward a moment later from wherever they reached.
Measured, that was **0.627** — so the entrance was a barely visible wobble between 0.63 and 1, with a
different start value every run. The fix is to commit the start state with transitions suppressed for
one frame, then restore them and set the end state.

*And it was being set up on a hidden element.* `go()` calls `setDash()` before `swap()`, so the map
view was still `visibility: hidden` when the entrance class was added. The class change now waits one
frame, by which point the view is rendered.

Fixing either alone leaves the other. **This is the failure mode §6 exists to prevent** — a state left
for a transition to arrive at, which then did not arrive — and it is worth noting that the earlier
audit of this section caught the *reduced-motion* version of the bug and missed the ordinary one.

*Found while building a larger transition over this crossing, which was then abandoned — see §11.
The fixes are independent of it and stay.*

**A theme change is not a transition anybody asked to watch.** Switching light↔dark runs one frame
with `transition: none` on everything. Without it, every property in the sheet that carries a colour
transitions at once and the page reads as melting rather than as changing. This rule postdates the
rest of §6 — there was only one theme when it was written — but it is the same principle as the two
paragraphs above: motion has to be *about* something.

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

***Open, recorded 2026-09-09.*** *Reduced motion currently skips §4b's re-rank **beat**, not only its
motion — the same branch serves "render this synchronously for a screenshot" and "this founder asked
for less movement", and those are not the same request. The sweep is already flattened rather than
removed by the rule above, so the beat could honestly run with a still indicator, and a founder who
asked for less movement did not ask to be told an engine call is instant. Left as it was rather than
changed quietly, because which way it should go is a decision for this section and not for an
implementation pass.*

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

**A reversal that costs nothing may not look like it costs something.** Added 2026-09-09 with §4b's
restore. A re-rank plausibly waits on the engine, so it gets a beat and a sweep. Restoring is an
order the client already holds, so it lands immediately — no beat, no indicator, and the reorder
plays at once. This is the same rule as the two paragraphs above rather than a new one: motion has to
be *about* something, and a wait the system is not actually having is the one thing an indicator may
never assert.

**A state revealed after a transition must be a state the element already has.** Also 2026-09-09.
§4b's band headings are held back until the rows land, and the mechanism is to **clear an inline
value** rather than to set one — the heading is opaque by declaration and the transition only
animates its arrival. Written the other way round, a transition that failed to tick would leave the
headings invisible, which is the blank-screen bug of 2026-08-31 in miniature. *Anything held back
for a beat should be checked against this: what does the element look like if the transition never
runs?*

### The record's arrival, and four ways to defeat a correct spec

*Added 2026-09-11. The curve and the durations above were right and implemented, and the record
still arrived with a visible lurch. Every cause was in the open path, and three of the four are
general enough to check anywhere.*

1. **A programmatic `focus()` scrolls, and an `overflow: hidden` box is still scrollable.** The
   heading was focused while the pane sat at its off-screen transform, entirely outside the
   column's box, so the browser scrolled the column sideways in one frame to bring it into view.
   **This was the whole of the visible jump.** `focus({ preventScroll: true })` unless there is a
   reason to scroll. *The router's `focusHeading()` had always passed it; the record's call never
   did, which is the argument for one focus helper rather than two call sites.*
2. **Commit the start state before the class, not after.** The forced reflow sat below the
   `classList.add` and so committed nothing. It was harmless only because the pane had no
   `[hidden]{display:none}` companion rule; adding that rule — every other hidden element in the
   prototype has one — makes the ordering load-bearing, so the two changes belong in one pass.
3. **A large subtree's layout must not land on the frame the transition starts on** — eleven
   fields, an abstract and up to fifteen claims, each carrying a running shimmer. ***The forced
   reflow in 2 already pays this, and the obvious fix is the wrong one.*** Handing the class to
   `requestAnimationFrame` was written first, on the `restagger()` precedent. It bought nothing —
   `offsetHeight` has already laid the subtree out synchronously, so the class change that follows
   only touches `transform` and `visibility`, both of which the compositor handles — **and it broke
   1**: `.rec` is `visibility: hidden` until `.rec-open` lands, a `visibility: hidden` element
   cannot take focus, and the focus move then failed silently. *One correct reflow removes the need
   for the frame. Defer only what has not already been paid for.*
4. **Two motions on one object** — the item above in the prohibitions list.

*The order matters and reads: write the content → unhide → force the reflow → add the class →
focus without scrolling. All synchronous.*

*Measured after the fix, on the built prototype: entering creates `transform 320ms
cubic-bezier(.32, .72, 0, 1)`, leaving creates `transform 200ms` on the same curve, and the covered
column's `scrollLeft` stays `0` throughout — which is the lurch, gone.*

### Standing prohibitions

Adopted 2026-08-31. Each is greppable, and §7 of the working plan for that pass greps them.

- **No `transition: all`.** Name the properties. `all` animates whatever a later edit happens to add.
- **No entrance from `scale(0)`.** `.95`–`.97` with opacity. Nothing in the world appears from nothing.
- **No `ease-in`**, per the argument above. `ease-in-out` is permitted under the rule above.
- **No transition or animation on a layout property** — `width`, `height`, `margin`, `padding`,
  `top`, `left`. Use `transform`, `clip-path`, `grid-template-rows`, or FLIP. **One exception**, and
  it is named rather than implied: the sidebar collapse transitioned `width` and `flex-basis`,
  because a collapsing flex sibling has to actually surrender space and `scaleX` would squash the
  content column instead of resizing it. **That exception is spent — there is no collapse (§7) —
  and the prohibition is back to having none.** A new exception requires a written reason, not a
  convenience, and the bar is higher now that the list is empty.
- **Hover-driven motion sits inside `@media (hover: hover) and (pointer: fine)`.**
- **Exit is faster than enter**, everywhere, not only on the view swap.
- **One motion per arrival.** *Added 2026-09-11.* An element that is arriving inside a container
  that is itself arriving does not get an entrance of its own. The record carried one — `.pn` ran
  a 200ms `pn-in` keyframe on `--ease` with 4px of Y, inside a container travelling 320ms on
  `--ease-drawer` — and two curves over two durations on one object reads, at a tenth speed, as the
  text settling inside a box that is still moving. **A drawer's contents do not fade in after the
  drawer opens.** `pn-in` is deleted rather than scoped off, the record having one host; two
  keyframes are left in the prototype, `sweep` and `sweepx`.
- **A container already in place does not move to say its contents changed.** *Added 2026-09-11.*
  Picking a second patent without closing the first is a designed path — the record never covers the
  left list precisely so it can be done — and re-running the slide there would be motion claiming
  something arrived when nothing did. The **body crossfades** instead, on the `--dur-1` blur this
  file already specifies for `.set-run-say` and `.rv`, and for the same reason: two records are
  different lengths, so a bare opacity swap reflows the pane and reads as two documents trading
  places rather than one pane changing what it holds.

---

## 7 · Components

**The shell.** TIS submark leading edge of a **48px top masthead**, inlined with
`fill="currentColor"` so it inverts for free. Content area on `--ground`, cards on `--surface`,
one working surface beneath the bar.

> ***Rewritten 2026-09-10, and it inverts a decision this section recorded with a reason.*** It
> read: *"Project sidebar 260px, collapsing to 64px. **No top bar** — `platform.md` §6 makes the
> dashboard map-dominant, and the map needs the vertical room."*
>
> **The two arguments are about different axes, and that is the whole reconciliation.** The
> sidebar cost **260px of width**; the masthead costs **~48px of height**. The map's binding
> constraint is width — 944px for eight columns plus 176px of row labels — and it did not fit a
> 1440px laptop beside a 260px rail and a 340px result list. `platform.md` §1a and §6a carry the
> sum.
>
> **So "the map needs the vertical room" was not wrong; it was answering the wrong question.** It
> is still true that a tall map reads better than a short one, and the masthead takes 48px of that.
> What changed is that a *width* problem became binding, and there was no arrangement that solved
> it without giving up one of the two.

**The masthead**, leading to trailing: submark + `Terrain` wordmark · **New search** · the project
switcher, with version history nested inside it · chat · **the control rail** · the account menu.
`platform.md` §6a.1 governs what may and may not be demoted out of it.

***The lockup is the way home, 2026-09-11.*** It fired `conversation:new` until then — **the same
action as the New search button twelve pixels to its right**, which is one action offered twice and
a brand mark doing the job of a labelled control. It now returns the founder to the working screen.

Three states, and the rule is one sentence: **the lockup routes home unless there is no home to
route to.**

- **On the working screen** it scrolls both columns to the top. A home control that is already home
  should do the thing that convention expects of it, and *both* columns because this surface has
  two — returning only one would be a half-answer.
- **On the points page** it returns to the working screen, in the mode `#usBack` would have used,
  so the two ways back agree about what returning looks like.
- **On the conversation it is inert**, on both of the screens that surface can be: the first search,
  where there is nothing to go back to, and the re-entry from a version revert, where there is —
  but §4's gate is the product's only correction point and a mark in the chrome should not be the
  way out of one.

**The visual does not change between those states, and that is the constraint the rest follows
from.** It stays an `<a>`, keeps its styling and its cursor everywhere, and tells assistive tech
with `aria-disabled` rather than by greying out or dropping its `href` — both of which change what
a sighted user sees. *A lockup that changes appearance by screen stops being a fixed point in the
chrome, which is the whole of what makes it usable as home.* The accessible name promises
navigation only where navigation happens: *TIS Terrain — back to your results* from the points page,
and the name alone everywhere else.

*The test is `hasEntered` — has the founder ever reached the working screen — and not "is there a
set" or "is the map built", which are the set's business and answer a different question. New
search resets it with everything else.*

**Two things in it are protected by name, and both were protected before the masthead existed.**

- ***The appearance control stays on the bar.*** This section protected it from disappearing at
  64px on the grounds that *a rail that vanishes when the sidebar collapses would make collapsing
  a way to lose the theme control.* **Moving it into the account menu is the same loss by a
  different route.** The protection transfers; the mechanism it was written against does not.
- ***Version history stays nested under the open project.*** `placeHist()` relocated the block to
  sit directly beneath the `aria-current` project, indented, with a left hairline carrying the
  relationship — a version is *of* a project, and two flat lists side by side say nothing about
  which belongs to which. **A menu flattens by default**, so the nesting is rebuilt inside the
  switcher or the loss is recorded.

**The collapse toggle is gone**, and the paragraph that specced it goes with it. *It swapped
`panel-left-close` for `panel-left-open` under a `filter: blur(2px)` crossfade at `--dur-1` in a
fixed 26px box, so the target never moved or resized. It was recorded on 2026-08-31 because the
first build hid it — the sidebar could be collapsed and not expanded again.* **The bug it fixed
generalises and the fix does not:** *a control the founder needs must be reachable without a
pointer and must not be hidden behind hover.* That is the rule the info affordance is also held
to, and it is what the two protections above are applications of.

**Project search and recency groups** were the sidebar's second job and belong to the switcher now.
`platform.md` §2 routes every return through it, so it is navigation, not a list — which is a
better fit for a menu than it was for a rail.

**The control rail.** Added 2026-09-08 above the profile row; **on the masthead since 2026-09-10**,
between chat and the account menu: the **usage meter** and the **appearance control**.

*Why it is chrome, and not in a page head.* Both are account-level and both are true on every
surface. *The original argument was that the sidebar was the only element surviving a view swap,
and the map's page head — where IPtech puts its own meter — was no good because the conversation
and the set had no head at all.* **There are no view swaps now**, and the argument that replaces it
is plainer: these are account-level and the masthead is where account-level things go. The
conclusion did not move.

- **The meter** is a standing balance and a unit word: the figure in `figure-s`, Inconsolata and
  tabular per §4 so it does not jitter sideways as it decrements, the word in `micro`. It moves
  **only when a run completes** — the same rule §6 puts on the progress bar; the meter may not
  claim a run that did not finish. *`platform.md` §6a.5 fixes the moment: the charge lands when
  the gate is approved, and the views resolving afterwards move nothing.* It is a balance and
  deliberately not a percentage or a bar: a balance says what has been spent, which is true, where
  *60% of your plan* would assert a plan shape `platform.md` §11 has not chosen. **No thousands
  separator.**

  ***And since 2026-09-08 it is a button.*** It opens the points page (`platform.md` §7a.9) and
  takes `aria-current` while that page is open, the way a project row does. Nothing about the
  figure changed: hover and focus are a `--surface-sunken` fill on a `--r-control` radius with a
  negative margin so the target grows without moving the number. The meter is the only standing
  reference to spend in the product, so it is where a founder looking for *where did my points go*
  will press.

  ***The one sentence above that the points page does not honour is the percentage, and the
  exception is scoped rather than a reversal.*** That page asserts a plan shape outright — a
  balance over an allowance, and an arc meter reading the share spent — because its whole subject
  is the plan. **The meter still asserts nothing**, on either of the two surfaces that carry it,
  and that is the line: a percentage is permitted on the page about the plan and nowhere else.
- **The appearance control** is three states in a segmented control — light, dark, system — and
  §10.4 has its behaviour. It reuses `.seg` but keys on **`aria-pressed`**, not `aria-selected`:
  three toggles in a group are not options in a listbox. *That reuse cost a real bug worth
  recording — the rivals sort handler was bound to `$$('.seg-btn')`, every segmented button in the
  document, and the new control was the first one present at load time to be caught by it. The
  handler now binds on `[data-sort]`, the attribute it actually reads.*

  ***The `aria-pressed` distinction is a general finding, and its clearest instance is back.***
  *a segmented control is a `tablist` when it selects one of N views and a `group` of
  `aria-pressed` buttons when each button is independently on or off.* The
  **`Market` / `Technology` toggle** is the first kind and was written to demonstrate it — struck
  with the dashboard on 2026-09-10 and **restored the same evening** (`platform.md` §6.5), because
  the toggle never depended on there being a dashboard. The appearance control is the second kind.

  ***The toggle moved out of the pane and into the surface's head on 2026-09-11.*** It had a
  band of its own inside the right pane — 28px of control plus 16px of padding above the first
  card, for one segmented control — and it now sits at the trailing end of the head's chip row,
  above the hairline, where the row was already drawn and had space. **It keeps the segmented
  form rather than becoming two chips**, because a chip on that row is a *fact about the search*
  and the `.seg`'s fill-and-lift is what says this one is a thing you press. The 12.5px/28px
  size override went with the move: the base `.seg-btn` is 24px at 11.5px, which is exactly the
  chip metrics beside it, and the `.seg`'s own 2px padding leaves the control at 28px against
  their 24px — *distinct without being loud, which is the requirement for a control in a row of
  statements.*

  ***And the rule now has a third instance one level down.*** The list's sort and filter are
  **menus**, not segmented controls — three options and five facets do not fit a 420px column —
  but the same distinction decides their roles: sort is `menuitemradio`, filter is
  `menuitemcheckbox`. *One of N* and *each independently on or off* is the question, and the
  control it is asked about does not change the answer.

**The profile row and menu.** Avatar, name, plan line — **in the masthead's trailing edge, opening
downward** into a menu with Account settings, Plan & billing, Help, Sign out. *It opened upward
from the base of the sidebar until 2026-09-10.* The rows exist; their destinations are undesigned
this pass, because pricing and whether a free tier exists are open (`platform.md` §11) and a Plan
screen would be designing against an undecided thing.

**The attribution line.** *Powered by* in italic, then Innovue's mark — `brief.md` §3 governs it and
carries the 2026-09-08 amendment that made it a mark rather than four words. It sits at the foot of
**the right pane** on the working surface and of the scrolling column on the points page, and
centred under the composer on the conversation surface.

**Centred, on every surface.** It was briefly left-aligned to the grid's gutter on the map-shaped
surfaces, on the reasoning that a page footer aligns with the page and that it kept clear of the
dock. Neither held: the dock was a 44px icon in the opposite corner and never came close, and the
conversation surface had centred its line from the first build — so "aligned with the page" was
quietly producing two different answers across four surfaces. One rule now, and the credit reads as
belonging to the product rather than to the column it happens to sit under.

*One rule is what makes a new surface free, which is the argument arriving from a direction it was
not written for.* The points page took its footer with no decision to make on 2026-09-08, and the
collapse from five surfaces to three on 2026-09-10 took none either — **the line moved hosts three
times and was never re-decided.* **And the retired rule cost a real regression on the way in**: a
session reading this section before the amendment landed changed `.foot` to `flex-start` on the
reasoning the paragraph above retires, which would have moved the line on four surfaces to fix
nothing. Caught and reverted the same pass. *If the left-aligned wording is ever quoted again, it is
this paragraph that is current.*

**It does not go on the masthead.** The credit belongs at the foot of what it powers, and a 48px bar
with seven regions in it is the last place to add an eighth that nobody needs to reach.

*The clearance argument is spent and is recorded because its conclusion held anyway.* The bottom pad
was 72px purely to keep the last card out from under the dock icon, and 24 + the line + its own 32
came back to the same number — empty space became the credit rather than being added to. **The dock
is gone (`platform.md` §11) and the 72px has no reason of its own left**, so the pad is now simply
what the line needs. Nothing on screen changed; the justification for a number did.

**The mark follows the theme — their primary blue in light, their own white mark in dark.** Both are
Innovue's own files at an identical `viewBox`, so the swap is pixel-stable and neither is a
Terrain-authored variant of someone else's brand, which is the thing to avoid here. It shipped blue
on both grounds and was changed 2026-09-08: the blue measures **5.50** on the light card and **3.35**
on the dark, which is legal for a logotype and legible, but quiet — and their white mark, at
**17.65**, was sitting unused in the same folder. Two `<img>` swapped by CSS rather than a
`<picture>`, because a `<picture>` source query follows the OS and the appearance control has to beat
the OS; `display: none` also keeps the inactive one out of the accessibility tree, so the name is
announced once.

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

**What must never move into it:** the map's legend — the density scale reading *fewer → more
filings*, and the rising hatch — and the chart's `Not yet published` swatch. Those are labelling,
which §6.1 and §6.3 require on the card. The popover carries explanation only. The test is whether
a screenshot with no popover open still states what the founder is looking at.

*The legend "named Crowded / Emerging / Open" until 2026-09-10. **The rule got harder to satisfy,
not easier**, because a density scale with no state names carries less on its own — which is
exactly why it may not be demoted into a popover.*

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

**The slide-over.** ***Retired 2026-09-10.*** A right-hand panel on `--shadow-float`, radius 16 on
the left edge, focus-trapped, Escape to close, carrying the drill-down list. **A cell click now
filters the list that is already on screen** (`platform.md` §6a.3), and a second list beside a
permanent one is two answers to one question. *The overlay mechanics — the focus trap, the Escape
handling, the `--ease-drawer` curve — are reused by the record (below), so what is retired is the
container and not the machinery. *They were reused by the chat panel too, for one day; that is
deleted as well, and the machinery still survives in the record.*

**The composer.** ***One component, one size since 2026-09-10:*** the content column on the
conversation surface. The second was the chat panel's and is deleted with it (`platform.md`
~~§5~~). *The two-size rule is kept below because it is what a second instance would have to
honour, and because it is the half of the dock argument that survived the dock.* It was
**a panel over the left column** on the working surface. *It was docked bottom-right on the map
until 2026-09-10 — `platform.md` §5 and §11.* `--surface` card at `--r-widget`, textarea above, control row
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

**A third state, added 2026-09-09: while a round is open, the placeholder is one fixed contextual
line.** After the first message the composer is empty again, and an empty composer beside an open
question is the moment it looks redundant — which is what `platform.md` §4's amendment was written to
fix. So it says what typing would do *right now*: *"Or describe it differently…"* during the round,
*"Tell me what's off…"* at the gate. **It never resumes rotating** — the rule above already stops the
cycle at first keystroke and this does not restart it. One line, no cycle, no crossfade: a hint moving
beside a question the founder is answering is the noise the docked-form rule already names.

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

#### Amended 2026-09-09 — the confirm card became two turns

`platform.md` §4 dissolved the card: the reading is one message and the action is the turn after it.
Four rules above are written against a ~600px panel, and rather than quietly editing each, here is
what happens to all four and why.

*Written first against a version with the two lists behind a collapsed disclosure. **The lists left
the gate entirely later the same day** — `platform.md` §4 and §6.1a — so the disclosure is gone and
the turn is shorter still. The table below is annotated where that changes a disposition; where it
does not, the reasoning stood on the turn being short and stands harder now.*

| Rule | Disposition |
| --- | --- |
| **Rows do not stagger** | **Survives, and moves surface.** It is several messages now, and messages arriving in sequence is the normal thread behaviour. The rule follows the rows to the map page (§6.1a): staggering them there would still imply the approaches were generated one at a time, which the skeleton contract forbids. *It governs no part of the gate any more — there are no rows there.* |
| **Wordless sweep, then `0fr → 1fr`** | **Survives**, attached to the reading turn — the one that replaces the card. The two-beat narration above it is unchanged |
| **The card is ~600px, so it must grow rather than jump-cut** | **Retires.** The premise is gone: the turn is a title, a lede and two or three read-back blocks. *This first said the technique survives on the disclosure opening; with the disclosure gone it survives nowhere on this surface, and `grid-template-rows` animation is simply not used at the gate.* |
| **Scrolls to its top** | **Retires as a mechanism, survives as a requirement.** Normal scroll-to-bottom works once the turn is short. What the rule was protecting is that the reading must be seen before it is acted on — so the requirement is restated: **the reading turn and the action turn must land visible together.** *The disclosure caveat this carried is void with the disclosure.* |

**The disclosure and its rule are both retired**, hours after being written. *Collapsed is not
hidden* was a sound rule and it was answering the wrong question: not *should a collapsed list say
what is in it* — it should — but *should the list be at this gate at all*. `platform.md` §4 says no,
because the axes are computed from the search and the gate runs before it.

**Keep the rule for the next disclosure, and keep the correction with it.** A summary reading only
*Details* still hides what it holds, and that part travels. What does not travel is treating a
disclosure as the answer to *this surface has too much on it* — sometimes the content is on the wrong
surface, and folding it up makes that harder to notice rather than easier.

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

**Amended 2026-09-08 — the clip wraps the whole card, and the card has a header and a way out.**

*What it was.* The clip wrapped the composer only. The thread rose separately above it as a second
card, on its own `--shadow-float`, with a 10px gap; a hint block sat above that. Three surfaces,
arriving together, reading as three things — and none of them titled. The only way out was Escape,
which worked and was written down nowhere, and the icon that would have been the obvious way back
was underneath the composer.

*What it is.* **One card.** The header, the thread and the composer sit inside the clipped element,
so the clip reveals a single shape and the surface, border, radius and shadow are declared once. The
`grid-template-rows` growth is gone with the second card — the clip was already doing that job, twice.

- **The header names the current job**, because the dock hosts three: `Ask about this map` at rest,
  `Review this change` when the confirm gate is inside it, and a working label during a rebuild.
  `platform.md` §4 calls the gate the most important screen in the product, and a panel still
  labelled as a chat at that moment is the interface understating the one step that is not undone by
  scrolling. The title is **swapped behind a fade**, never retyped in place: a word changing letter
  by letter in a header reads as a glitch rather than as a state change.
- **The gate stops titling itself inside the dock.** The card's own `h2` is hidden there and its
  `aria-labelledby` moves to the dock header, so the name exists exactly once in both the render and
  the accessibility tree. The lede stays — that is information, not a second title. On the
  conversation surface, where there is no dock header, the `h2` is unchanged.
- **Close is MINIMIZE.** The thread is kept, reopening lands back in it, and nothing the founder
  typed is discarded by a control marked with an ✕. The motion is the open animation run backwards,
  so the card visibly **shrinks into the corner it grew out of** rather than vanishing.

  **Both directions run at `--dur-3` on `--ease-drawer`, and that is a deliberate exception to
  "exit is faster than enter".** Close ran at `--dur-2` on `--ease` until 2026-09-08 and read as a
  snap: a strong ease-out puts maximum velocity in the first frame, which is right for an entrance
  and wrong for a collapse — the shape slams most of the way shut and then crawls. Two things follow.
  The curve becomes `--ease-drawer`, which rises fast but keeps a long tail, so the card commits
  immediately and *settles* into the corner. And the duration matches the open, because **§6's rule
  is about a view leaving while another arrives — two states swapping, where the founder has already
  decided. This is one object reversing along its own path**, and §7 already requires that pressing
  the icon and immediately pressing Escape reverses from where it is. A reversal that runs at a
  different speed each way cannot do that cleanly. Morphs are symmetric; exits are not.
- **A dot on the corner when a thread is folded up behind it**, arriving `--dur-3` *after* the shape
  has closed rather than with it. *The chat is now here* and *a conversation is waiting in it* are two
  statements, and delivered together the second one is invisible. Never colour alone (§2): it is a
  shape on the ink fill, and the icon's `aria-label` changes with it, from *Ask about this map* to
  *Continue this conversation*.
- **Escape is named on the card.** It always worked; nothing said so. A hint, not a control — it
  never takes focus, and the ✕ beside it is the reachable way out.
- **Clicking the surface closes it, and that click is consumed.** The cost is real and was taken
  deliberately: the first click on a matrix cell after opening the panel closes the panel instead
  of filtering the list. Clicking the **masthead** also closes it but the click is *not* consumed —
  the masthead is chrome that outlives every state, and eating a click on it to dismiss a panel
  elsewhere would be the panel claiming ownership of the window. *This read "the map" and "the
  sidebar" until 2026-09-10; the rule is about content versus chrome and the two nouns moved.*

  ***And the cost changed shape with the anchor.*** The panel now covers the **left column**
  (`platform.md` §6a), so the click it eats lands on the **map**, which is on the other side of the
  screen and fully visible behind it. **That is worse than it was**: a founder can see the cell
  they mean to press, which makes a swallowed click read as the interface ignoring them rather
  than as a dismissal. It is named here as the one thing about the panel's placement that is worse
  than the dock's, and it is the first thing a motion pass should look at.

*Two consequences of clipping a full-height card, and only one of them was free.* `clip-path` clips
hit-testing as well as paint, so the closed card catches no pointer events even though its box still
occupies full height over the widgets. It was still in the **tab order** — and tabbing from a widget
into an invisible composer is the kind of defect only a keyboard finds. The card is `inert` when
closed, which takes it out of focus, the accessibility tree and hit-testing at once. Opacity alone
would have done none of the three, and this was already true of the old build.

Expanded, it is the composer above, with the same contract — including the field's 60px rest, since
the two sizes §7 means are the two widths, not two fields. A scope change
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

***And on 2026-09-10 the build block itself went.*** There is no build screen: the six views resolve
from skeletons in place in the right pane (`platform.md` §6a.5). **The footer question is settled by
removal** — there is nowhere to send the founder, because they are already there.

**Three things in this block's spec are re-homed rather than lost**, and they are the ones that were
never about having a screen: *only a fresh build earns the staggered entrance*, so a re-count after a
tick animates nothing; *a change lands when it is asked for*, so the panel goes out before the pane
reshuffles rather than under it; and *a progress indication claims only completed work* (§6), which
a skeleton resolving into a widget satisfies more honestly than a bar did. **What is genuinely lost
is the stage list** — *searching · classifying · laying out the map* — because a skeleton cannot
carry a label. `platform.md` §6a.5 moves that narration to the composer and records the cost.

*The rebuild keeps its CTA, and the two are not in conflict.* "A change lands when it is asked for",
directly above, is about a change to a map **that already exists** — the panel goes out, then the map
reshuffles in full view, because a change made under a panel is not a confirmation. On a first build
there is no map yet and nothing to confirm, so the same reasoning that gives the rebuild a button
takes it off the create path. **The rule was always about the rebuild; it now says so.**

*This replaced the floating pill and panel, and with it the overlap recorded on 2026-08-31 where the
resting pill sat on the Lineage caption. `platform.md` §11 closed in favour of the docked form; the
collision was one of the three reasons.*

> ***The dock is retired, 2026-09-10 — and so is the panel that replaced it, the same day.***
> **There is no chat surface** (`platform.md` ~~§5~~). Everything from here to the end of this
> block described the panel and is kept as the record of a form that existed for one day, because
> two of its rules are general and outlive it: **an overlay entering from an edge takes
> `--ease-drawer`**, which the record still uses, and **a header is swapped behind a fade rather
> than retyped in place**, which the list's own state line still uses.
>
> *What follows described the panel:* **the dock's card at a different anchor** — the header that
> named the current job, the close that reversed the open motion, the folded-thread dot, Escape
> named on the card rather than merely working, and the rule that the surface is never faded and
> only its contents are.
>
> **What does not transfer is the morph.** The clip-path grow from a 44px corner icon was written
> against a corner; a panel that slides from the left edge over a 340px column is a different
> gesture, and re-timing the old one against a new anchor would be keeping the numbers and losing
> the reason. `platform.md` §6a is the constraint — the panel covers the **list**, so the map the
> founder is correcting stays visible — and §6's three curves are the law it is re-authored inside.
>
> *The overlap that killed the floating pill cannot recur: a panel over a column never floats over
> a caption.*

***The widget page is gone — 2026-09-10.*** Its spec is deleted rather than struck, because a
struck component spec is one a reader implements anyway: this file's own rule is that a component
contract is the one place a superseded direction must not be left standing. `platform.md`
~~§7a.2~~ carries the retirement.

*The `Market` / `Technology` toggle was deleted alongside it in the same pass and **came back the
same evening** — `platform.md` §6.5. Its contract is above, with the segmented-control rule it is
the clearest instance of. Deleting a spec and restoring it inside a day is the cost of that rule
being strict, and the rule is still right: the alternative is a struck spec somebody builds.*

**Three rules inside them generalise and are re-homed here rather than lost with their hosts.**

- ***The finding leads, the evidence follows.*** Every widget page opened with a `What this says`
  card before anything else — *the order is the argument.* **That rule was never about pages.** It
  is why every card in the pane carries its caption (`platform.md` §6.1, §6.3, §6.6), and it is the
  form the rule survives in.
- ***One source per component, except where resolution differs.*** Two copies of a shape are two
  shapes the moment one is edited, so the page's matrix rendered through the same `matrixHTML()` as
  the card's. **The stated exception is the one that matters and it outlives the page**: the
  filings chart was cloned, and the clone was wrong — a nine-period series stretched across 1100px
  puts ~120px between points and reads as a zigzag rather than a trend. The card bins to nine
  because nine is what reads at 360px; a full-width rendering draws one point per year because that
  is what the room is for. **Same data, two resolutions**, which is what a small chart and a large
  chart have always legitimately done. *A second exception needs a written reason, not a
  convenience.* The clone also silently dropped the card's axis row, so the page had **no x axis at
  all** until it was caught — cloning a component copies its markup, not its context.

  *This exception is now homeless in the same way its host is.* There is no full-width rendering of
  the filings series anywhere, so the one-point-per-year form and its `All · 10 years · 5 years`
  range control exist as a spec with nothing to render them. `platform.md` §11 carries where a
  widget's full form lives. **Two rules inside that spec are worth keeping written down for
  whatever answers it:** the excluded window keeps its width in **years, not pixels** — 14% of the
  chart at twelve years, 38% at five, which is the clearest statement the chart can make that a
  short window of patent data is mostly not visible yet — and the trend is fitted over the
  **published points only**, because letting the incomplete window pull the line makes the chart
  assert exactly the decline `platform.md` §6.3 spends a paragraph denying. The y axis keeps a
  **zero baseline** and scales to the visible window; cropping the x axis may not also rescale the
  story.
- ***`role="tablist"` versus `role="group"`, and this is a general accessibility finding.*** The
  toggle was `role="tablist"` with `aria-selected`; the appearance control is a `group` of
  `aria-pressed` buttons. **The distinction is not cosmetic:** `aria-pressed` is for a control that
  toggles a *setting*; `aria-selected` in a tablist is for choosing *which of several things you
  are looking at*. A screen-reader user given "pressed" for a surface swap is told the wrong thing
  about what just happened. **The rule is re-homed to the control rail in §7's shell**, beside the
  `.seg` component both forms share.

**And one rule from the toggle is kept because it is about motion rather than about tabs.** *A
content change is not an arrival* — no staggered entrance, no rebuild narration, because only a
fresh build earns the stagger and anything that animates like one says the data was recomputed when
it was not. `platform.md` §6a.5 applies it to the inline resolve, where it now does most of its
work: **the views stagger when they are built and never when they are re-counted.**

*Two things in the deleted blocks are simply spent.* The **expand control** — a Lucide arrow in each
card head beside the info button — has nothing to expand to. And the toggle's alignment fix
(`align-self:flex-start` lifting it onto the title line rather than sharing a baseline with the
project metadata) was a real finding about `.page-head`, and there is no `.page-head` with a
trailing control in it any more.

**Version history — nested under the open project in the project switcher.** *In the map's
`.page-head` as a popover until 2026-09-10, then in the sidebar for one day, and in the masthead's
switcher since.* Rows are skeleton version labels, newest tagged `Current`, each with a `Revert`.
Revert routes through the confirm step rather than acting directly, because a revert *is* a scope
change and `platform.md` §5 admits no exception. The list gaining a row after a confirmed change is
what makes versioning visible — a skeleton version chip cannot show that something was written.

***The argument that moved it into the sidebar has dissolved and the placement survives it.*** That
argument was *a control that exists on one of five surfaces was never a control*, and the sidebar
was the only element surviving a view swap. **There are no view swaps.** What is left is smaller
and sufficient: version history is *project-scoped*, so it belongs with the project — which is the
nesting rule below, not a claim about which container holds it.

**Four things the placement has to carry, and each is a way to get it wrong:**

- **Nested under the open project, not a peer of it.** Indented, with a left hairline carrying the
  relationship. It is about *one* row of the list above it; peers would say these are two kinds of
  project. **A menu flattens by default, which is why this is written down rather than assumed.**
- **The `#history` deep link still resolves.** It opened a popover, then scrolled a sidebar section
  into view; it now opens the switcher and marks the section. A route that silently stops routing
  is worse than a removed one.
- **Revert still routes through the confirm gate.** Moving a control must not change what it does.
  *It has moved three times in two days and this is the sentence that has had to be re-checked
  each time.*
- **A menu that closes on outside click must not lose the list.** The sidebar's version block could
  be read at rest; a menu's cannot. `platform.md` §6a.1 records this as one of the two things the
  masthead may not quietly lose.

### Where it is filed · `sharePie` + `shareBars` at card scale — added 2026-09-10

**`platform.md` §6.6.** No new component: the share pie and ranked bars already built for the Rivals
Rivals widget page, at card resolution. *That page is retired (`platform.md` ~~§7a.2~~); the two components survive it and this is now their only rendering.* The one substantive difference from their earlier use is
that **jurisdictions are named in words** — `US`, `CN`, `EP`, `JP`, `KR` — where holders are skeleton
bars. The skeleton rule protects a real party from being invented or transliterated; a jurisdiction
is neither, and a pie of five grey wedges would be unreadable for no gain.

Slices take **`--mark-*`, exactly as the Rivals page draws them** — and it is worth saying why that
is not a contradiction of §2. Since the hue was withdrawn on 2026-09-05 the three marks *are* the
neutral ramp: `--mark-1` is the darkest step, `--mark-2` the mid grey, `--mark-3` a hatch. Reaching
past them for a "neutral" value would mean a component reading an `--n-*` primitive, which §10 forbids
outright and which two greps exist to catch. **The semantic token is the neutral answer here.**
§3.7's one-ink rule still binds the count: three marks and an *Other*, never five.
The pie carries magnitude, the bars carry the order and the numbers, and the caption carries the
finding — the same three-part division the Rivals page already uses.

### Live and expired · donut + stacked bar — added 2026-09-10, renamed 2026-09-10

**`platform.md` §6.7**, and the form was specced here and carried in
[`design/components.md`](../design/components.md) §2 as blocked by data long before it had a home.

**It takes `--mark-1` and the `--mark-3` hatch — the tonal pair — and NOT the state hues.** This
paragraph said the opposite when it was written on 2026-09-10, and building it proved the instruction
wrong within the hour, which is worth keeping rather than quietly correcting.

*The reasoning that failed.* §2 permits colour on discrete states, and live/expired is the discrete
state par excellence — the status chip on every drill-down row already carries `--state-live` and
`--state-expired`. Extending that to the chart looked like consistency.

**What it actually produced was a saturated green ring with a red segment cut out of it**, which is
`CLAUDE.md`'s *no green-means-good* prohibition rendered at 140px. The chip survives the same hues
because it is an 11px tinted label reading the word `Live` — the colour is redundant to a word that is
right there. A donut is an *area*, the area is the message, and at that scale green-versus-red is a
verdict on a space the interface is forbidden from judging.

**The rule that generalises: a hue that is decoration on a chip becomes an argument on a chart.**
Permission granted at label scale does not travel to area scale, and `platform.md` §6.1's ban on
implying *why* something is empty is what it collides with.

So: **live is the solid ink, expired is the hatch**, which is §3.7's one-ink-one-texture pair doing
what it was built for — the hatch reads as *lapsed* rather than as *bad*, and it carries no direction
at all. Both segments are labelled in a legend, the centre states the live count, and the caption
states the split in words. An expired patent is prior art rather than an obstacle, which for a founder
is the *easier* of the two, and nothing in the rendering may suggest otherwise.

**It ships against §8's skeleton contract** — the illustrative set carries no per-holder legal status,
and drawing a shape from numbers we do not hold is the one thing that contract forbids.

### The record pane — added 2026-09-09

**`platform.md` §7a.3 is closed, and it closed for the pane.** §9's patent-detail-page entry was
un-deferred in the same pass, on the rule that replaced the one §7a.3 used to carry:

> **Terrain renders the record. Terrain does not render an opinion about the record.**

*This section described **the handoff — built provisionally** until 2026-09-09, and the handoff is
not gone: it is a subset of the pane, rendered by the same field function.* What went is the
**row-level disclosure** — the row no longer expands downward, because the pane beside it carries
those five fields and six more, and two controls per row showing one subset of the other is not a
design.

**A row click opens the record in the pane beside the list.** Eleven fields as a `<dl>` on
`--surface-sunken` at `--r-inner` — **Number · Application · Kind · Main IPC · IPC · Holder ·
Inventors · Filed · Published · Where · Status** — then the **abstract**, then the **claim set** as an
`<ol>`, then the copy control. It is a `<dl>` and an `<ol>` because that is what those are; the claim
numbers are Inconsolata and tabular like every other figure, carried as content rather than as a
`list-style` marker.

**The skeleton contract needs no third exception for it**, and that is the test that the shape is
right. §8 warns that a third exception is evidence the contract is being eroded — so: the field
*labels*, the section headings, the closed enumerations (`Kind: Utility model`) and the disclaimer are
real English; **every identifier, the abstract and every claim are bars**; the claim *count* is an
illustrative figure. Nothing legible about any real patent renders.

**What is absent is still what makes it admissible**: no highlighting, no plain-English decode, no
ranking language. The copy says so out loud — *"The record as it was published,
and nothing read into it. Whether it affects you is their call, not ours."*

*This list read "no relevance score" until 2026-09-10. **The score is printed** —
[`../docs/brief.md`](brief.md) §4 removed the prohibition outright, and `platform.md` §7a.3 records
why a number the engine returned is not the same kind of thing as the three that remain. The
disclaimer copy is unchanged and is doing more work than it was: it is now the only thing on the
pane saying the number is not a verdict.* An interface that
**reads** a patent for you implies it can tell you whether the patent matters, and that is the legal
judgement. An interface that **shows** the patent does not.

**One renderer, and since 2026-09-10 one host.** The record opens **over the right pane**, leaving
a ~200px peek of the views underneath — `platform.md` §6a.4. *It had two hosts: in flow as the
second column of §4b's two-pane, and inside §7's drill-down overlay at `min(1040px, 94vw)`. The
overlay is retired with the slide-over, and the set's second column is retired with the set's
surface.*

**The peek is the spec, not a margin.** It is what keeps the record legible as *this came from
there* rather than as *this replaced that*, and `platform.md` §1a records it as the mitigation for
the conflict that a record over a map implies the map responded. **The left list is never
covered** — the record owns the right edge, and since 2026-09-10 nothing owns the left, so no
overlay ever hides the thing it is about.

***It floats over the views rather than owning the pane's edge — a card, not a panel.*** *Changed
2026-09-11. The record was flush to the pane's top, trailing and bottom edges with a single
`border-left`; it is now **inset by `--s-16` on those three sides**, at `--r-shell` with
`overflow: hidden`. The **leading edge is unchanged at 200px** and the peek clause above is
untouched — what changed is the other three.*

*Two reasons, and the second is the one that matters.* **The inset is not an arbitrary margin: it is
the pane's own rhythm** — `--s-16` is what `.panescroll` pads by and what the widget grid gaps by, so
the record's top and trailing edges line up with the widgets underneath rather than cutting across
them. And the pane is a **grid of `--r-widget` cards**, so a full-height panel bolted to its trailing
edge is a different kind of object arriving from outside; a card at one radius step up is the same
kind of object, larger and nearer. **The peek's argument survives intact and is served better** —
16px of pane is now visible on three further sides, so more of the views stay present, not less.

*An all-round inset of `--s-12` was the first proposal and is refused by the paragraph below: it
leaves a 12px strip, which is the sliver that paragraph exists to reject. **The leading peek is the
only peek that is a spec; the other three sides are alignment.***

*The off-screen transform is `translateX(calc(100% + var(--s-16)))` and the addend is not cosmetic —
the card no longer touches the trailing edge, so `translateX(100%)` alone parks a 16px strip of it
in view inside the pane's `overflow: hidden`.* *The chat panel held that edge under the same rule and
is deleted (`platform.md` ~~§5~~).*

**The container query survives, and its original reason does not.** `container-type: inline-size`
on the split was chosen over a viewport breakpoint because **collapsing the sidebar took 260px to
64px and handed the surface 196px more room with no viewport change**, so a media query would have
refused a second pane that plainly fitted. *There is no collapsible sidebar.* **It stays a
container query anyway**, and the new reason is better: the right pane's width is set by the
masthead layout and the list's width, so what the record has to fit inside is a **container** whose
width the viewport does not describe. A component that asks its own box how much room it has is
right for the same reason it was right before, arrived at from the other side.

*The measurements are re-checked against the new arithmetic rather than inherited.* **At 420px of
list (2026-09-10, up from 340) the pane is ~1020px and the record's peek leaves it ~820px, which is
below the 860px the split wanted — so the record's own two-column form is out at 1440 as well as at
1280.** *The figures below are the 340px working and are kept as such:* at 1440 the
right pane was ~1080px and the record's peek left it ~880px — comfortably above the 860px the
split wanted. **At 1280 the pane is ~940px and the record leaves ~740px, which is below it**, so
the record renders as one column there rather than two. That is the breakpoint doing its job and
it is noted rather than discovered: `platform.md` §6a already records that 1280 is where this
layout gets tight.

**Only the record scrolls.** `overscroll-behavior: contain`; the pane underneath keeps its own
scroll position, so closing the record returns the founder to the widget they were reading.

**Below the container breakpoint the record is full-width over the pane**, with no peek — a 200px
peek of a 400px pane is a sliver rather than a reassurance. The script chooses by measuring the
container, so the threshold lives in one place. *And with no peek there is nothing for the record to
float over, so the inset, the radius and the hairline all go with it: flush to the pane, square, and
borderless because the list column's `border-bottom` already sits one pixel above where the record's
`border-top` would be.*

**Selection semantics, and it is not a listbox.** `role="option"` may not contain interactive
children and a set row holds three of them, so the open control carries **`aria-current`** and Tab
keeps moving between rows in the order §7 already specified. Activating a row **moves focus to the
pane's heading** — which is why there is no live region: focusing a heading announces it, and doing
both announces twice. The heading is real English naming *what the pane is*, because the patent's own
title is a bar and a heading of bars has no accessible name and nothing to focus. Closing returns
focus to the row that opened it.

**Three states that are easy to miss.** An **empty pane** says *"Select a patent to see its record."*
and nothing about how many are waiting. An **empty cell** collapses the overlay to one column, since
there is no record to frame. At narrow widths a row click on the set opens **the record alone**, not a
one-row list — the founder asked for a patent, not for a list of one.

### The list — added 2026-09-07 as the set surface, re-hosted 2026-09-10

`platform.md` §4b, §6a.2. **The left column of the working surface, 420px, permanently on screen.**
*It was 340px until 2026-09-10; the row gained a relevance score beside the title and the column
gained a sort and filter bar, and 340 stopped holding them.*
It is where the founder sees what the search caught, and it stays there while the views are drawn
beside it.

#### Its head — `Your results`, and one line

**Renamed 2026-09-11.** It was *What the search found* — the one clause among six noun-phrase card
titles (`The map`, `Rivals`, `Lineage`), and a different name for the surface the points page's
back control already called *your results*. **Two places naming one thing one way.**

**The corpus chip moved up into the heading row**, immediately before the info affordance at the
trailing edge. It had a chip row of its own beneath, which at rest held one visible chip and two
hidden ones — a whole line for one fact.

***The star chip followed it up, later the same day, and `N starred` now sits immediately to the
LEFT of `N matched`.*** It was in the row beneath, which meant a founder's first star opened a whole
second line to report two words — and reported them about 40px from the count they are a subset of.
**Two counts about the same list belong on the same line**, and the narrower reads first: *what you
did*, then *what you are looking at*.

**The rank chip stays below, and that is not an inconsistency.** `N starred` is a count of the same
kind as `N matched`; `Re-ranked around N starred` is a **sentence about the order**, and it would be
the longest thing in a 345px heading row. *One line holds counts, the line beneath holds the state.*

**The auto margin had to move with it.** It sat on the corpus chip, which works while that chip is
the first thing after the title and breaks the moment anything joins the row ahead of it — the star
chip would have been stranded beside the heading with the whole gap opening between two chips that
belong together. **Pushing from the title's trailing edge** packs the trailing group right whichever
of them are rendered, which is what a row with two conditionally-present chips needs.

***And the row beneath now genuinely collapses, which it never did.*** It was documented here as
collapsing via `.head-meta:empty{display:none}` — **a rule that never matched once.** A div holding
a hidden span holds an element child and two whitespace text nodes, so `:empty` was always false and
the flex column paid its 10px gap for a row that drew nothing. *Measured after the fix: `.listhead`
and `.listhead-top` are the same height at rest to the pixel.* **The wrapper is deleted** — the chip
is a direct child, `.chip[hidden]` takes it out of the flow for real, and there is no container left
to be wrong about. *A rule whose job is to hide something is invisible when it fails, which is why
this sat in the document as a solved problem.*

#### Its foot — a foot, not a call to action

**Rebuilt 2026-09-11.** It was a centred `.btn-secondary` reading *View more patents*: a bordered
pill in the middle of a column of rows, which made paging look like the surface's next step rather
than like more of the list.

**Two ends, two jobs.** *Where you are* at the leading edge in `--text-3` — `20 of 124 patents` —
and *what to do about it* at the trailing edge as plain text with a chevron, no border and no
fill, taking a `--surface-sunken` ground on hover. **Its placement zone is what marks it as a
control**, which is §7's alternative to giving everything a box: the trailing edge of the list's
own foot is the one place an action about the list can sit.

**The count is the half that is always true**, so when everything is shown the action goes and the
count stays, reading `124 of 124 patents`. *Hiding the whole foot answered "is that all of them?"
by absence.* The row itself goes only when there is no list at all.

#### Its density — one step up the scale, 2026-09-10

**The column read tight, and one value in it was a defect rather than a preference.** `.set-row`
carried `padding: 14px 0 14px 10px` — **a trailing gutter of zero** — so the relevance score at the
row's trailing edge sat flush against the card's border. The pass that fixed it moved the whole
column up one step rather than patching the one number, because a single roomy edge in a tight
column reads as a mistake in the other direction.

| | Was | Is |
| --- | --- | --- |
| Row | `padding 14 / 0 / 14 / 10`, `gap 12` | `padding-block 20`, `padding-inline 10 / 16`, `gap 16` |
| Title → score | `gap 12` | `gap 16` |
| The bar | `padding 12 / 16`, `gap 8` | `padding 14 / 20`, `gap 10` |
| The column | `padding 16 / 16 / 24` | `padding 20 / 16 / 24` |

**Every new value is an existing step.** `--s-18` and `--s-28` would have been the arithmetic
middle and neither exists — the scale runs `2·4·6·8·10·12·14·16·20·24·32`, so *one step up* means
14 → 20. **Inventing two off-rhythm tokens to reach a rounder number is how a spacing scale stops
being one**, and that is the rule this entry exists to state.

***The type scale was not touched.*** This is a spacing pass; §3 is not reopened. The row goes
~90px to ~102px, which is about one fewer row per screen, and that was accepted.

**The row is written in logical properties** — `padding-inline: 10px 16px`, not `padding-right`.
On an RTL surface the physical form would put the gutter under the star and leave the score
touching the edge again, which is the same bug mirrored.

#### The star's prompt — `.set-cta`, added 2026-09-10

**Starring had no consequence on screen.** It filled the star, drew the anchor rail, counted a chip
and enabled a button twenty rows below — four quiet signals and no sentence saying what starring
was *for*. `.set-cta` is that sentence, with the button beside it.

- **It is the `.set-run` collapse, reused.** Same `grid-template-rows: 0fr → 1fr`, same durations.
  One mechanism, two adjacent strips, and they hand off: pressing the button closes this as the
  beat opens, in the same frame, which reads as the prompt becoming the work.
- **It is driven by the expression that enables its own button** — `stars > 0 && sig !== SET_SIG`.
  One condition, two consumers, so there is no state where a prompt offers an action already done.
- **A sunken ground**, because a strip of body text between the bar and the rows would read as a
  row. §7's rule: a control must not be styled like the static text beside it.
- **It sits at the TOP.** The button lived in a foot below the list under a comment claiming it sat
  outside the scroller and so could not be scrolled out of reach — it was inside the scroller and
  it plainly could. *A call-to-action under twenty rows is a call-to-action nobody sees.*
- **It says what you get, not what happens.** *Find patents like the one you starred* —
  ~~*The rest can be ordered by how close they are to what you starred*~~, which was accurate and
  described a mechanism. **The count is not in the sentence**: the `N starred` chip in the heading
  already carries it, and a chip, a sentence and a button all counting the same thing are three
  facts that are one. Singular and plural are **whole templated strings**, the same rule the
  settled sentence follows — the plural is part of the sentence rather than glued to it.
- **The button is `Re-rank the list`**, not `Re-rank around N starred`. The sentence beside it
  already says what it will rank around.

**`.set-foot` is deleted with it.** Its standing note went into the heading's info popover (below)
and its button came up here, which left the element empty.

#### The pane's inset, matched to the column — 2026-09-11

The right pane's cards sat **56px** in from the pane edge — 24 of scroller plus 32 of grid —
against the left column's **16**. With the toggle's band lifted out of the pane the same day, that
mismatch was the loudest thing left on the surface. **One rule for both columns at 16px**, and the
grid's own inset drops to zero.

***It also puts the matrix back inside its card.*** Measured at 1440: the scroller is 954px
against the 944 the eight columns need — 10px of room, where the 420px list had left it
overflowing by 79. At 1280 it overflows by 148px and scrolls inside `.matrix-scroll`. *The
arithmetic written up for the 420px change reasoned to a one-pixel fit and was close but not
measured; the chain is worth trusting and its last digit is worth checking in a browser.*

#### The list's scrollbar — added 2026-09-10

**There was no scrollbar rule in this file at all** before this pass: every scroller was the UA
default, tinted only by `color-scheme`, and on a surface built out of hairlines that read as the
heaviest thing on it.

**Thin, neutral, and always present.** `scrollbar-width: thin` with `scrollbar-color:
var(--border-strong) transparent`, and a matching `::-webkit-scrollbar` at 8px whose thumb is
`--border-strong` on a transparent track, stepping to `--text-3` on hover. No hue — §2.

- **`--border-strong` is deliberate**: it is the same weight as the row dividers the bar runs
  beside, so the scrollbar reads as part of the same rule set rather than as chrome laid over it.
- **Hidden-until-hover was refused.** A scroll affordance you cannot see is one the founder does
  not know is there, and it does nothing at all for touch.
- **`scrollbar-gutter: stable`** is what stops the list jumping sideways by 8px the first time it
  grows past one screen — the same class of shift the FLIP work on this surface exists to prevent.

#### Where an info popover anchors — a bug and the rule it produced

`.info-pop` is anchored to its **trailing** edge, always, with no flip and no clamp anywhere in the
file. That is correct in a card header, where `.card-head .info` takes `margin-inline-start: auto`
and the popover grows inward from the trailing edge. **It fails anywhere the button is not at the
trailing edge.** On the list heading the button sat immediately after the title, ~204px into a
420px column, so a 300px popover rendered at roughly `x = −72` and was clipped by the column's own
`overflow: hidden`.

> **A trailing-anchored popover needs a trailing-anchored trigger.** Give the button
> `margin-inline-start: auto`, or give the popover a leading anchor — never leave it mid-row.

*The fix was the first, because it is what every card header already does, and because a measured
clamp would be a mechanism this file does not otherwise have.*

**The row is the drill-down row and always was** — same four fields, same record, same chevron,
which points *across* rather than down since the row stopped opening downward. Nothing about it is
redrawn for this host; if the two ever diverge, that is a bug and not a variant. *As of 2026-09-09
that is structural rather than a promise: one row function and one field function serve the list,
so §7's cap cannot be kept in one place and broken in another.* **Since 2026-09-10 there is only
one list**, filtered or unfiltered, which makes the guarantee cheaper to hold than it was.

***The surface's own spec is retired and three of its rules are not.***

- *It reused the shell as the widget page did — `.main`, `.page-head`, `.card`.* There is no shell
  to reuse; the list is a column, and its head is a chip row rather than a `.page-head`.
- *It was a **step**, so unlike the widget page it had no back control — it was left by approving
  it and never returned to.* **It is not a step and it is not left.** `platform.md` §3's
  requirement 3 was the load-bearing form of this sentence and §6a.2 records what retiring it
  cost.
- ***The distinction the sentence was narrowed to make survives and is worth more than the
  sentence.*** On 2026-09-09 it was read as *nothing on this surface may be undone*, which it
  never said — `Clear selection` had been reversing the founder's own act since the day it was
  built. *(That control is gone with the selection — `platform.md` §6a.2 — and the correction it
  proved is not.)* The correction: **a back control leaves a surface; a reversal changes a state
  inside one.** With no surfaces to leave, everything the founder does here is the second kind, and the
  re-rank's reversal (below) is the worked example.

**The star.** Lucide `star`, 16px, `stroke-width: 1.5`, in the row's control cluster. Two states:
outline in `--text-3`, and **filled in `--text-1`** — the darkest thing in the row, which is how
`--mark-1` already encodes *the entity being tracked* (§3.7). **No hue.** A gold star would be the
first decorative colour in the system and would read as *good*, which §2 forbids twice over. The
state change is a fill, so "never colour alone" holds without a label. `aria-pressed`, and the
accessible name says what it does — *more like this one* — not what it is.

~~**The row checkbox.**~~ ***Deleted 2026-09-10*** — `platform.md` §6a.2. Every patent the search
returns feeds the views, so there is nothing to include or exclude one row at a time. *It was
near-black when checked, `--border-strong` unchecked, radius `--r-chip`, with an inlined Lucide
`check` on a filled square rather than `accent-color`, which renders a hue we do not have.* **That
last reason is the part worth keeping**: it is the general answer for any future two-state control
on this surface, and it is why the star also encodes with fill rather than colour.

**One control sits in a cluster the expand toggle does not own.** The whole drill row is one
`<button>`. On this surface the star is a real control *inside* a row that also expands, so the
toggle cannot be the row — it becomes a control beside it. Two targets, each at least 44px of hit
area, and tab order runs star → expand. *It was three and ran checkbox → star → expand.*

**The relevance score moved to the top right of the row on 2026-09-10** — `platform.md` §8. It sits
on the title's own line, right-aligned, in `--text-3`, and it is **not** one of §7's four fields:
it says nothing about the patent, only about where the engine put it.

**It is labelled `Score`, stacked above the figure** — 2026-09-10. It shipped as a bare
four-decimal number whose only explanation was a `title=` attribute, which is a tooltip nobody
opens. The label is the **micro-above-the-value** idiom this file already uses for the gate's
read-back and for every table header, and it is *stacked rather than inline* because inline would
put two type sizes on the row's own first line and compete with the sentence there.

***"Score" is not the word §7a.3 forbids.*** That rule bars a word about **quality** — *strong
match*, *best fit*, *most relevant* — because those are readings Terrain would be authoring.
`Score` names what the number **is**, and it is Innovue's own `分數` in English. The heading's
info popover carries what it *means*. *The record pane said `Relevance` for the same figure and
now says `Score` too: one number, one name.*

**The re-rank control joined that bar on 2026-09-11**, immediately after Filter, and the strip it
came from is gone. It was a `.btn-secondary` inside a collapsing `.set-cta` that opened the moment
a star made it live, beside the sentence *"Find patents like the one you starred."* The sentence is
in the heading's popover now, which already carried the same fact in its own words.

*It fits, and that was measured rather than assumed.* The bar's content box is **345px**; Relevance
is 119 and Filter is 89, so 127 remain. *"Re-rank the list"* at a page-sized `.btn` is 116 — a
**one-pixel** fit, which is a coincidence and not a fit. **"Re-rank" at the bar's own metrics is
85**, leaving 32px, and the shorter label is what makes the position a real choice instead of a
rounding error.

**It takes `.btn-primary`'s fill and `.lm-btn`'s geometry**, and both halves matter. `.btn` is 36px
and this row is 30px, so a page-sized button would sit six pixels proud of its neighbours; the fill
is how it draws the eye at all, because §2 leaves no accent to spend and near-black is what
`CLAUDE.md` reserves for a primary action. **Against two outlined menu triggers, the only filled
control in the bar is the loudest thing on the surface without a hue existing.**

**The icon is Lucide `list-ordered`.** It was `target` for one pass, reaching for *rank around a
point*; the plainer reading is the outcome — the list gets a new order — and it cannot be mistaken
for Restore the way a restart or refresh glyph would be. 15px, `stroke-width: 1.5`, the same as its
two neighbours, and its silhouette is distinct from both: Relevance is a pair of arrows and Filter
is a taper.

**Hidden, not disabled**, when there is nothing to rank — the strip used to collapse away entirely,
so hiding is what preserves the behaviour. And the star's hover background *is* `--surface-sunken`,
which on an open row it would match, so there it steps to `--track-pressed`.

***A ring was tried and is deleted.*** It traced the button once on arrival —
`--dur-4`, a conic gradient in `currentColor` — on the reasoning that a one-shot at the moment the
control appears is the version of "draw the eye" that does not charge its cost on every later
glance. **It went because it was not wanted, which is a sufficient reason and the honest one.**
*Two things survive it and are worth keeping written down: a loop would have been worse than a
one-shot for the reason above, and the fill is doing the work on its own — the only filled control
in a bar of outlined ones needs no help.*

**The sort and filter controls, added 2026-09-10.** Two menu buttons in the list's bar, `--r-control`
at 30px, each a trigger plus a popover. **The popover is concentric**: `--r-inner` with `--s-4` of
padding, so its items take `--r-control` — 8 + 4 = 12. **The roles differ because the acts do**, and
it is the tablist-vs-pressed rule one level down: sort is `menuitemradio` (one of N), filter is
`menuitemcheckbox` (each independently on or off). The filter trigger carries a **count**, not a
dot — a figure is a static cue and survives §2's rule that colour may never carry a state alone.

### The re-rank, and what says it happened — added 2026-09-09

`platform.md` §4b. ~~**The panel above the list has three states, not two**, and it is the same
`grid-template-rows: 0fr → 1fr` collapse in the last two — so the founder watches the running line
resolve into the result, in place, directly above the list that moved.~~ ***Two states, and the
settled one is deleted · 2026-09-11.*** The panel is a **beat that passes through** now: it opens
for the work and closes when the work lands. Nothing resolves in place, because there is no longer
a result written into the band.

| State | What it is |
|---|---|
| Rest | Collapsed, and **the sentence inside it is empty**. Not tidiness: a collapsed `grid-template-rows` with `overflow: hidden` does not remove text from the accessibility tree, so a resting set was letting a screen reader read a sentence about an operation that was not running |
| Running | Open, the shared 1.6s sweep, *re-ranking around what you starred*. The whole card is dimmed to `.45` **and inert** |
| ~~Settled~~ | ~~Open, `--surface-sunken`, the statement at `--text-1`, no sweep~~ — **struck 2026-09-11.** The panel returns to Rest at land and the sentence is cleared |

#### Why the settled statement went, and what had to be rebuilt to remove it

**The statement was `N patents moved. What you starred is now at the top — and what the views count
has not changed, only the order.`** Three reasons, and they compound rather than repeat:

1. **The figure went constant.** It counted positions that changed, which was a real measurement
   while the re-rank only hoisted the starred rows past their neighbours. Now that the re-rank
   re-sequences the whole list it reads *122 of 124* every time. **A number that never varies is a
   label wearing a measurement's clothes** — and the bullet above, written in the same pass that
   made the re-rank real, defended the constant as *the correct report of an operation that is
   nearly total*. That was true and it was not sufficient.
2. **The disclosure already has a home.** *What the views count has not changed, only the order* was
   recorded here as un-relocatable — true only just after a re-rank, so it could not follow the
   standing note into the heading's popover in 2026-09-10. **But the popover's own re-rank paragraph
   ends *No patent enters or leaves; only the sequence changes*,** which is that clause, stated
   durably, about this exact control. *It had stopped being the only carrier and the document had
   not noticed.*
3. **Three standing cues survive it**, none of them transient and none of them motion: the **rank
   chip** in the heading, the **two band headings** over the rows, and **`Restore the original
   order`** arriving in the bar. §6's rule is that motion may never be the only thing carrying a
   state, and it is not.

**What had to be rebuilt is the only interesting part.** The panel used to stay open across
*running → settled*, so it had **no height change for the FLIP to fight**. It closes now, and a
200ms collapse above a 320ms FLIP is precisely the defect `setReorder`'s `before()` callback was
extracted to prevent: the rows would play toward targets measured with the panel open while the
panel dragged them upward underneath.

***So the collapse is committed, not transitioned.*** Inside `before()` — after the first rects are
measured, before the rows are drawn — the panel's transition is suppressed, the state class dropped,
and `offsetHeight` read. The closed height is then in force for the second measurement, so **the
panel's 48px is absorbed into every row's own travel distance** and animates *as* the FLIP instead
of against it. *Measured: the panel goes 48.1px → 0 in a single frame, and the starred row's
translate starts at 504px — the six rows it rises past plus the band the panel vacated.*

**Which is the better reading anyway:** the band does not collapse while the list settles, **the
list settling is what closes it.** One motion.

**The live region moved to the rank chip.** The panel's sentence was this surface's one live region;
with the settled statement gone it announces the beat *starting* and nothing else, so the chip —
which is what carries the settled state — is what announces it. **`role="status"`, `aria-live="polite"`,
shipped empty and hidden** for the same reason the panel ships empty. *"Nothing announces twice"
still holds: the panel is emptied at land and emptying a live region is silent, so the two regions
carry two moments and never the same fact.* **And the chip is unhidden before it is written**, not
after — `[hidden]` keeps it out of the accessibility tree, so content set while hidden is a mutation
of a region that is not there.

**`The original order is back.` went too.** Its own note conceded *nobody reads it either way* — it
existed to be announced, on the argument that the panel still had height at that instant. **It has
no height now**, so that sentence would be invisible text delivered only to a screen-reader user,
which is the precise thing the Rest row above exists to prevent. The restore is carried by the chip
emptying, by focus moving to a live control, and by the bands and rails swapping back.

**Enter `--dur-3`, exit `--dur-2`**, written as a base rule carrying the exit with the state class
overriding the duration — §6 says exit is faster than enter *everywhere*, not only on the view swap.

***The `opacity` + `blur(2px)` swap is now unexercised, and it is kept.*** It masked *running →
settled*, two sentences of different lengths in one band; with one sentence left, nothing ever
replaces text that is on screen and every live call takes the immediate path. **It stays because the
panel is one state away from having two sentences again**, and because the failure mode of deleting
it is silent: a future second sentence written with `immediate` because the fade was gone and nobody
remembered it was the point.

**The band, and the anchor rail, hand off to each other.** One class governs both, so no two markers
for *what you starred* are ever on screen at once:

- **Flat list** — a 2px `--text-1` leading rail at the row's outer edge, plus the filled star and the
  `--skeleton-strong` first bar. The rail is how a founder finds what they starred without a group to
  collect it.
- **Re-ranked** — the starred rows lift into a labelled band (`.set-band`, `t-micro`, a `--border`
  rule beneath), and **the rail comes off**: inside a band headed *what you starred*, a rail on every
  row restates the heading.
- **Restored** — the band goes, the rails return.

~~**Two rails exist on this surface and they are told apart by position, not treatment.**~~
***One rail exists. Changed 2026-09-11, and the retired sentence is the reason why.*** *It read:
"the anchor rail sits at the row's outer edge; `.drill-toggle[aria-current]`'s rail sits left of the
drill body, about 54px in. A starred row can also be the row open in the record pane, so the two
have to read as independent facts."* **The requirement was right and the mechanism could not meet
it.** The two marks were the same object — 2px, `border-radius: 1px`, `--text-1`, spanning the same
content height — 48px apart, and *told apart by position, not treatment* is a description of a
distinction the reader has to be told rather than one they can see. In dark both resolve to
`#F0F0F0`, so what shipped was two identical white bars meaning different things.

**So they became different kinds of mark.** *What you starred* keeps the rail. *What is open in the
record* takes `--surface-sunken` across the whole row — `.set-row[data-open]`, with `aria-current`
unchanged on the toggle as the semantics and `data-open` as the visual hook, the same split as
`aria-pressed`/`data-starred` on the star. **A row that is both now says both**, legibly, which is
what the retired sentence was asking for.

*Not an invention: `.proj[aria-current]` and `.meter[aria-current]` already say* this is the current
item in a list *with exactly this token, and `.rival-row[data-filtered]` says it on the pane. No
hue, no new token. It carries no `:not(.is-ranked)` qualifier, because being open is independent of
the band in a way being starred is not.*

*Two consequences.* The row still carries **permanent inline padding** — it reserves the rail's
gutter in every state so nothing shifts when a star appears, and that is unchanged. And the star's
own hover background **is** `--surface-sunken`, so on an open row it would land on a ground it
already matches; it steps to `--track-pressed` there, the token whose definition is already *the
darker neutral carried by a selected row*.

***The general rule, because the next one will not be a rail:*** **two marks that differ only in
where they sit are one mark.** If telling two states apart needs a sentence about coordinates, they
need different treatments, not better coordinates.

**The rows move first; the headings arrive after.** Found only in slow motion, and worth recording
because it is invisible at speed: the headings are new nodes with no previous position, so they
snapped to their final places while the rows were still flying, and *ranked around it* overlapped the
very row it labels. Two beats — the FLIP over `--dur-3`, then the headings in over `--dur-2` on a
settled list. **The reveal clears an inline value rather than setting one**, so the headings are
opaque *by declaration* and a transition that never ticks costs nothing; and they are hidden with
transitions suppressed for one frame, which is the widget-entrance bug in §6 avoided rather than
repeated.

#### The re-rank did not re-rank · fixed 2026-09-11

***Everything above described the motion of a reordering that was barely happening.*** The ordering
hoisted the starred rows to the top and **left every other patent in the engine's order**. Star the
second row, press `Re-rank`, and two rows swapped places: the panel reported *2 patents moved*, the
band appeared over a list that had not been ranked around anything, and the 320ms of movement this
section specifies at length had two rows to carry it. *What the founder saw was indistinguishable
from a control that had misfired.*

**Three places already promised otherwise**, which is what makes this a defect and not a change of
direction — `platform.md` §4b (*re-baselining re-ranks the set around it*), the heading's info
popover (*orders the rest by how close they are to the one you starred*) and the band heading
itself (*Ranked around it*). **Nothing anywhere ever specified the hoist.** It was a comment in the
ordering function asserting a rule no document had, and it read as settled because it was written
in the same voice as the rules that are.

***The general form, because this is the third instance of it in this file:*** **a comment claiming
a rule is not a rule.** The taxonomy that survived a figure scrub, the three shell gates that
reported clean without running, and this — each was a thing everyone believed because something
in the repository said so in an authoritative tone. *The check is whether a document says it.*

**The rest are ordered by closeness to the anchor now**, drawn from the engine's order and tie-broken
by it, so the original ranking survives as the residue. Two consequences worth having in writing:

- ~~**`N patents moved` now lands at or near the full length of the list every time.** That reads as a
  figure gone constant, and it is the correct report of an operation that is nearly total — the old
  number was small because the old operation was.~~ ***Superseded the same day: the sentence carrying
  that figure is deleted outright*** — see *Why the settled statement went* below. The defence above
  was sound as far as it went and did not go far enough; a report nobody needs is not improved by
  being accurate. *It was also documented as measuring the depth of the deepest star, which the
  re-rank stopped being true of, and that sentence is struck in the source.*
- **Nothing new is printed on a row.** `components.md` fixes the engine's half as `{ anchors: [id] }`
  in, `{ order: [id] }` out — **an order and no per-row figure** — so there is no closeness value for
  the surface to show. The **score column visibly stops descending**, and that is the evidence the
  order changed: a founder can see the list is no longer sequenced by the number printed on it, and
  the band heading names what it is sequenced by instead. They cannot check that the new order really
  is by closeness, which is a fact about the engine and not something an interface may fake.
- **And what it is ordered by may not be built from what is on the row.** Weight `status` or `kind`
  and every live patent clumps under a live anchor — which puts *patents like this one means patents
  with this legal status* on screen as a claim Terrain never made. §6.1's rule against asserting
  **why** governs an ordering exactly as it governs a cell, so the ordering key is **opaque by
  decision**: semantic closeness is computed from the text the row renders as bars.

#### The stagger, keyed to the destination · 2026-09-11

Every row moved on the same frame, which was right for a hoist and is wrong for a re-sequencing.
**Twenty rows crossing each other simultaneously is a shuffle the eye cannot follow**, and what it
reads as is a list being *replaced* — the one thing this surface may not say, because no patent
enters or leaves.

**18ms per row, capped at fourteen**, so the gesture lands inside `--dur-4` rather than running past
a second. **By destination, not by source**, and that is the whole of why it reads: the starred row's
destination is `0`, so it leads with no delay and every other row closes in behind it. The list
re-forms **top-down, in the direction it is read**, and the object the founder's own click moved is
the one they can follow. *Keying it to the source would start the movement wherever the starred row
happened to be sitting, which is a position nobody is looking at.*

**The headings wait for the stagger, not for one row's travel.** At `--dur-3` the heading would
arrive over rows still closing in beneath it — the same overlap the two-beat split above exists to
prevent, one mechanism further on.

**Rows arriving from beyond the fold get an entrance.** They used to "appear at rest, the same
fallback `sortRivals` has and never exercises" — and a real re-rank exercises it about **thirteen
times in a twenty-row window**, because genuinely reordering a hundred-odd patents must bring some
of the ones below the fold up. Thirteen rows materialising instantly around seven that slide is the
list reading as replaced again. So they enter in the vocabulary `.tmsg` already uses for exactly
this: **8px of Y and opacity over `--dur-2` on `--ease`, on the same stagger** — lighter and shorter
than the travel beside it, because arriving from outside the window is a smaller claim than moving
within it. No new token and no second curve. **§6's *one motion per arrival* is satisfied rather
than dodged**: the list is a container already in place, so a row arriving inside it is the only
thing arriving.

*Both beats are `setReorder`'s, so the **sort** got them too — which is correct and was the point of
extracting it. The two reorderings on this surface look alike because they are alike.*

**`Restore the original order`** is a `.btn-ghost` in the control bar, beside the sort and filter
menus. *It sat beside `Clear selection`, because that was where this surface's other reversal
lived; with the selection gone it is the only reversal on the bar.* `[hidden]` rather than
`visibility`, so it leaves the tab order and the accessibility tree with it — and the geometry that
costs is absorbed by the reorder measuring rects *before* anything on the surface mutates. **Not
"recommended order":** this surface spent *recommendation* on the selection three times
over, so *the recommended order* read as *the recommended checkboxes*. *The selection went on
2026-09-10 and the collision with it went too — but the name stays, because "recommended" would now
be claiming the engine endorses an order rather than returned one.*

**Nothing announces twice.** One live region — the panel's own sentence, `role="status"`,
`aria-live="polite"`, present and empty from load, which is what makes a repeated polite update
land. No focus is moved onto it. `aria-busy` goes on the list for the running window only, and is
recorded as a weak signal rather than a strong one: the list carries no role by decision, so this is
a hint of limited effect and the live region is the load-bearing half.

**Focus is handed to a live target or to the heading, never dropped.** Two directions: the re-rank
disables its own trigger as it lands, so focus moves to the restore that has just appeared; the
restore hides itself, so focus returns to the re-rank if it is live and to the page heading if it is
not — deliberately not the primary action, since landing focus on *Build the map* one Enter after an
undo is how an undo becomes a build. **And focus follows the patent, not the position**: re-rendering
the list destroys whatever row control the founder had focused, so the control is re-found by the
patent's own key wherever the new order put it. That was reachable on the paging paths before this
surface had a re-rank at all — `pointer-events: none` does nothing to Tab, which is why only a
keyboard finds it.

**The question chips** (`platform.md` §4a). The existing `.suggest` / `.suggests` pair, unchanged —
dashed pill, `label` type, `--text-2`, `scale(.97)` on press. They are answers to a question in the
thread, so they behave like the composer's own affordances and not like filter pills.

*The round they belong to was rewritten twice on 2026-09-09 — first to **five questions in two beats**
from three-to-five of six, then to **five questions in five turns**.* The middle version put two or
three chip rows in one message; that is gone, and the reason is in `platform.md` §4a. **One question
per message, one reply per answer.**

Nothing about the chip itself changed through either version. Two rules written for the multi-question
message survive anyway, and both are worth keeping for the reason they now have rather than the one
they had:

- **The question keeps its label and its own abstention.** `.qa-item` is still the unit — a `.qa-sub`
  label with its chip row beneath it — and the gap above it still separates the spoken line from the
  thing being asked. *It used to separate one question from the next; there is no next in the same
  message now, and the spacing does the other job unchanged.*
- **An answered item goes quiet rather than disappearing.** Its chips are removed and its label drops
  to `--text-3`. The label has to stay: the founder's reply is a bare answer, and an answer with no
  question above it is not a record of anything.

**And the turn opens by naming the answer just given.** That is copy rather than a component, so it is
specified in `platform.md` §4a — but it has one typographic consequence here. The acknowledgement is
`.qa-q`, the same spoken-line treatment as a lede, and the question under it is `.qa-sub`. **Two
different weights doing two different jobs in every turn**: what was heard, then what is asked. If
they ever render alike the turn reads as one long sentence and the question stops being findable.

**The abstention chip is separate from the answers, and it looks it.** `Not sure` sits last in every
row at `--text-3`, one step quieter than the answers beside it, because it is a different kind of
act: the others assert something, it declines to. *Nothing so far* and *They both apply* are
**answers** and take the normal weight — the distinction is knowledge versus its absence, not
positive versus negative.

**The answers read back where they are approved.** `platform.md` §4a asks for the round to be visible
at the gate, so the **reading turn** carries a recap row — the same `.chip` used in the page head, in
a `.said`-shaped block directly under *You said*. Read-only: chips carry the answer, not a control.

*Amended twice on 2026-09-09.* This said *the card* carries the recap, then that the disclosure was
the real edit the unwired `[Edit]` button owed. **The disclosure is gone, so that debt is open again —
and the composer is now a real answer to it rather than a placeholder.** Typing at the gate no longer
restarts the round; it asks one question back and applies the result (`platform.md` §4). So a founder
who was misread has a working route, in words, without a control.

**The recap row itself grew a sibling.** An exclusion — what the founder asked to leave out — renders
as its own `.said` block with its own chips, under the answers rather than mixed into them. *An
exclusion is the opposite kind of fact from an answer, and one row of chips holding both would take a
moment's reading to tell apart.* Editing an **answer** is still unwired and `platform.md` §4a still
keeps it open.

**What is real English and what is a bar**, which §8 now states as a rule: an option that could only
exist because of what the founder typed is a bar; an option Terrain would offer anyone is real
English. *Restated 2026-09-09 against the rewritten round, where it lands more cleanly than it used
to — and then immediately gained an exception, which is recorded rather than folded in.* Beat two's
three settings are things Terrain would offer anyone, so all three carry **real content**, exactly as
the rule says. *Two carry words and one carries numerals* — `10 patents` … `500 patents` is still
plainly on the real-content side, because it is something Terrain offers anyone and is not derived
from what this founder typed. **The rule is unamended; only this description needed to be accurate.**

**Beat one's five directions are generated and render as words anyway**, which the rule as written
makes bars. `platform.md` §4a carries the argument; the short version is that they are **observed
rather than invented** — the engine returned them for `drone` and they are in the capture index — and
observed-versus-invented is what §8's contract actually protects. A bar is the honest render only when
there is nothing behind it.

**The rule is unamended and is now unexercised.** Its own illustration was a mixed row, words and bars
side by side, "which looks odd until you know why". There are no bars anywhere in the round any more,
so that row has no instance in the product. **Do not delete the rule on those grounds** — the moment a
second query is demonstrated without captured directions, its options are bars again and the mixed row
comes back.

*And the mixed **row** is now doubly hypothetical, because one question per message means a row is
never mixed — a turn would be.* The rule is about the option, not the row, so nothing in it changes;
the illustration is just further from anything on screen. **Where a real mixed case does exist is the
map's axis panel** (§6.1a): its rows carry words with a populated set and bars without one, from the
same component, on the same rule.

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

### The points page — added 2026-09-08

`platform.md` §7a.9 is the surface; these are its six components. Restyled from IPtech's account →
point usage screen, read at `visual-reference/iptech-screenshots-identified/README.md` §2.20. Every
rule below reads a semantic token, so §10's dark set arrives free and no component here stays light.

***The page had no inline margin at all until 2026-09-11, and the way it happened is the useful
part.*** `.grid` deliberately carries no inline padding, because on the working screen
`.panescroll` supplies it. The points page puts `.grid` straight inside `.main`, which is `inset: 0`
with no padding of its own — **so nothing supplied it, and the cards ran edge to edge at 1440 while
the `Points` title above them sat 32px in.** Not merely tight: *two edges 32px apart on one page*,
which is exactly what this file means by aligning to a shared edge. **Both are `--s-16` now** — the
step the right pane already uses — so the title and the cards share one edge and the page reads at
the rhythm of the surface it is reached from. Scoped to `.view-map`, because padding `.grid` itself
would pad it twice inside `.panescroll`.

***It is deliberately not capped, and that was checked rather than tidied.*** A `max-width` is the
obvious next move: at 1440 these cards are ~1376px against ~988px for the same components on the
working screen. **The width is carrying content.** *Points over time* is a 91-column chart at ~15px
a band — already at the width where a column stops being readable — and *What spent them* is a
five-tile KPI row that wraps if the page narrows. **The card that does look stretched is the
balance hero**, whose arc meter sits ~1300px from the figure it describes; that is a layout question
inside one card, and capping the page is the wrong instrument for it. *Recorded as open rather than
fixed.*

**The balance card · `.bal`.** A figure pair and an arc meter on one row. `figure-xl` for the
balance, then the allowance in `figure-l` under §1's secondary-figure treatment — `.fig-sub`, weight
400 at 55% — so *2700 / 6000* reads as one figure with a denominator rather than two competing
numbers. `micro` label above, a `body` line beneath carrying the spend, the renewal date as a bar,
and the meter's own rule restated in words: *the balance moves when a run finishes, never when one
starts.*

***The ring is a meter, not a two-slice pie, and the distinction decided the markup.*** `dataviz` is
explicit on both halves — *a single ratio against a limit* is a **meter on a same-ramp track**, and
*a 2-slice pie* is in its anti-pattern catalogue. So it is one arc: a `--surface-sunken` track, a
`--mark-1` fill with a round cap, 9px stroke on a 44px radius, rotated -90° so it starts at twelve.
IPtech's ring is this shape too; what it is not is a pie. The percentage sits inside in `figure-m`
with `spent` under it in `micro`, because an arc with no number is a shape and this page's whole
subject is the number.

**The run-type card · `.rt`.** Five of them, and **`repeat(auto-fit, minmax(140px, 1fr))` rather than
a column count with breakpoints.** Each carries a `micro` label, the spend as `figure-l` **with its
unit**, a `11.5px` line reading *N runs at ≈cost each*, then a rule and the forward-looking figure.
**The rule rather than a colour** is deliberate: §2 has no colour to spend on *remaining*, and
remaining is not a state.

***The unit is the quieter half of the figure***, which is §1's third borrowed detail applied to a
word rather than to a decimal: `2385` in Inconsolata at `figure-l`, then `points` at 12px in Urbanist
on `--text-3`. Urbanist because it is a word and not a numeral, and lowercase because the uppercase
label above it is already doing the labelling. The figure carried no unit at all until 2026-09-09 and
read as a bare count of something the reader had to infer.

***And the forward-looking figure is a sentence now.*** It was `≈10 MORE` under a rule, which left the
reader to work out *more of what*, and *out of what*. It reads **`Balance buys ≈10 more`** — the
subject named, the source named, one line.

**They are not controls.** They were buttons driving a cross-card isolate selection until 2026-09-09;
`platform.md` §7a.9 records the removal and what it cost. No `<button>`, no `aria-pressed`, no hover,
no press scale — a card that does nothing must not look like a control, and the cheapest fix for a
control that is not one is to delete the control rather than to restyle it.

**The grain control · in the card head it governs, and it is IPtech's own.** `每天 / 每週 / 每月` —
`Daily · Weekly · Monthly` — as a `.seg` in the `Points over time` head, which is the idiom the
Filings page already uses for its range.

***It replaced a page-level range control, and the replacement is the substantive one.*** A range sat
in the grid above the first card with a sentence reconciling it to the balance. Two things were wrong
with that: it floated outside every surface it acted on, and **it changed the denominator**, which is
the one thing this page must not do. A grain changes only the resolution — every grouping covers the
whole period and sums to the same total — so `platform.md` §7a.9's two denominator faults become
impossible rather than mitigated, and the reconciling sentence is deleted rather than maintained.

***One consequence for the illustrative data, recorded because it is not obvious.*** `每月` needs a
period longer than a month or it renders a single column, so the period is a quarter: **91 days, 13
whole weeks, three months**, each grain dividing it exactly.

**The usage bars · `.hb.ub`.** A **modifier on the rivals component, not a second one.** What the
modifier changes is the label column (104px, dropping to 76px below 720px so a 1% bar does not become
a dot), a second figure per row for the share, and the removal of the row's hover — in Rivals a row
selects a holder, and here nothing selects.

***Every bar is one tone, and that is the whole answer to §3.7's cap.*** The cap is on **encoded**
values, and with the isolate control gone this chart encodes none: `--mark-off` is the token whose
role is exactly *everything a chart shows but does not encode*, so all five rows take it and none is
darker than another. Five categories therefore need no marks at all — which is why the donut on `32`
could not be redrawn and this could. It also settles the value-ramp-on-nominal-categories
anti-pattern outright: darker cannot mean bigger when there is only one tone. **Rank rides on
length and on the figure beside it**, which is what rank is for.

**The columns · `.uc`.** Points spent per day, week or month. **One series, so one token and no
legend**: `--chart-series`, because it is *the data* and §3.5 owns that layer, and `dataviz` is
explicit that a single series needs no legend box because the title names it. *A two-mark emphasis
split — the selected run type against everything else — stood here until 2026-09-09 and went with the
isolate control; the legend it required went with it.*

Five rules the geometry needed, and four of them were a bug first:

- **The axis has its own 38px gutter.** With the labels at the plot's left edge the first column drew
  straight over them — invisible at 91 narrow columns and total at 3 wide ones. `dataviz` wants the
  grid recessive, which means *behind* the marks, so the labels have to sit where the marks are not.
- **Three or four gridlines at every grain.** The step is the largest of `1 · 2 · 2.5 · 5 ×10ⁿ` at or
  under `max / 3`. A fixed 100 gave three lines on the daily maximum and **eleven** on the monthly
  one, which is a grid competing with the data behind it.
- **Columns cap by count, and the plot centres.** 44px above 40 columns, 56px above 8, 88px below —
  with the gap widening as the cap does. Under `space-between` the three monthly columns sat at the
  far edges of a 1000px card with a void between them and read as a broken chart rather than as three
  months.
- **A non-zero bin floors at 2px.** A day with one 2-point search and a day with nothing must not read
  alike. The axis and the caption carry the magnitude; the floor carries only *something happened*.
- **No trend overlay**, and the info affordance says why: one map build costs more than a hundred
  searches, so a fitted line across these columns would describe when the founder happened to build
  rather than how their spending is moving. §3.5's third layer is not owed to every chart.

**The runs list · `.ur`.** §7's *a list, not a page* — dense rows on 1px dividers, no card per row.
Date bar, run type, a bar for what it was about, cost. The info affordance carries the cross-reference
that makes it more than a log: **every rebuild in it is also a version of the map** (`platform.md` §5),
readable in order from the project's own History.

***The head carries a real sort, not a claim about the order.*** It read `Newest first` as a static
chip until 2026-09-09 — a label asserting an order the reader could not change. It is a `.seg` with
`Newest` and `Costliest`, and both are honest under §8's contract for a different reason each: the
dates are bars, so *newest* is legible only as position, while every cost is printed, so *costliest*
is checkable on the face of it.

**Both `.seg` controls key on `aria-pressed` inside a `role="group"`**, which is the appearance
control's pattern and the argument is the same: these are toggles in a group, not options in a
listbox, and there is no panel behind them to make them tabs. *The Filings range and the Rivals sort
both use `role="tab"` with `aria-selected` and predate this; that inconsistency is recorded and not
resolved here.*

***And the head that carries a control is marked, `.card-head-ctl`.*** Only those wrap. Applying the
wrap to every `.card-head` put the icon, the title and the info affordance on three separate rows on
the two heads that have no control — a rule written for the crowded case and applied to every case.

**The skeleton contract, applied — and it needed no extension.** §8's table already decides every
field here. *Dates* are identities, so the chart's x axis carries two end bars and the span in words
rather than 91 tick labels, and the runs list dates its rows with a bar. *Plan tier* is an identity, so
the head chip reads `Renews ▤▤`. A **rebuild's change label** is a bar under the options rule — it
exists only because of what the founder typed. And *points* are figures, so the y axis prints its
values, every card prints its spend and every row prints its cost. **No third exception**; the two §8
names are untouched.

*One limitation that follows from it, stated rather than left to be discovered.* The columns carry a
per-bin `title` and the plot an `aria-label` with its own maximum, but there is **no table view of the
series** — `dataviz` normally asks for one. A table of 91 dated rows would be 91 date bars beside 91
figures, which is the contract producing a table nobody can read. The caption carries the finding
instead, which is what §7a.1 asks a page to do.

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
clicking it moves the selection, which `hbSync()` mirrors into **every** panel plus the pane's own
Rivals card — one selection, wherever it is rendered. The tracked row also takes a **semibold count**, so
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
carried as a separate figure — so the header and the cells can never disagree. *The figure the
finding quotes and the figure the header shows are the same number by construction, which is the
only property this paragraph is actually claiming.*

***One consequence of the 2026-09-10 axis change belongs here.*** With holders on the rows, a
column total is **how much of the corpus that approach carries across the eight largest holders**,
not across everyone — so it is bounded by `shown`, not by `total` (`platform.md` §6.1). The header
figure and the card's own scope sentence therefore disagree by construction, and the sentence is
what reconciles them. **Summing from the cells is what keeps that honest**: a separately-carried
total would have been the corpus figure and would have silently contradicted the grid.

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
| Nav labels, widget titles, buttons, column headers, captions, legends, empty-state copy, menu rows, axis *titles* | Company names, project names, user name, plan tier, ~~dates, years~~ *(see the third exception)* | Patent counts, cell values, jurisdiction split, axis *values*, filing years |

**No patent number, no named company, no plausible-looking date.** An *identity* is never invented,
because an invented one reads as a live example — that is the line as it was written.

***It moved on 2026-09-10, in the date clause and nowhere else.*** A filing year prints under a
date sort and on the one populated row; the reasoning, and the fact that this is an erosion rather
than an extension, is the third exception below. **`No named company` is untouched and is the half
that matters.**

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

### The third exception arrived, 2026-09-10, and the sentence above is the correct reading of it

**It is an erosion, not an extension, and it is written up as one.** Two things now print that the
table above puts in the grey-bar column:

- **A filing year on every row, whenever the list is sorted by date.** The argument is the same
  shape as the two above — a widget whose whole purpose is a *shape* must draw the shape — applied
  to a control: **a date sort over a column of grey bars is an order the founder cannot check**,
  and checking it is the only thing a sort is for. A sort nobody can verify is worse than no sort.
- **A real title, status, year and score on ONE row** — patent 0, and no other. Judging a list of
  titles when every title is a bar is not possible, and one populated row is the least that makes
  it possible. *`platform.md` §6a.2 records the request behind it.*

**What did NOT move, and it is the half of the rule that was always load-bearing: no holder is
named.** `CLAUDE.md` forbids it outright — an invented name reads as a live example, a
transliterated one is fabrication, and both are worse than a bar.

***The demonstration row names `ACME Group`, from 2026-09-11.*** It went bar → `[holder]` →
`ACME Group` in one day, and the two rejected forms are why the third is right: a grey bar on a
row with three real fields read as something **missing**, and a bracketed slot read as a template
nobody had filled in. Neither showed what a populated row will actually look like, which is the
only reason the row exists.

**ACME is the one invented name that cannot read as a live example, and that is the whole
argument.** The rule forbids naming a holder because *"an invented one reads as a live example,
and transliterating a real one is fabrication"* — the harm it names is a reader mistaking the name
for data. **ACME is the archetypal fictional company; being unmistakably fake is its entire
cultural function.** So it satisfies the rule's *reason* while departing from its letter, and the
distinction is load-bearing rather than a loophole: a plausible-sounding invention —
*Northaven Aerostructures* — would fail the same test, and must not be used here or anywhere else.

**It renders at the year's weight**, `--text-1` at 12.5px, because it is a field of the row and
not a note about one. *Urbanist, not Inconsolata: it matches the year's size and colour, not its
typeface — `.fig` is for numerals and a company name is text.* **Every other row keeps its bar,
and no real holder is named anywhere, ever.**

***The line has moved from "no identity is invented" to "no PARTY is invented", and that is a
narrower rule.*** Saying so plainly is the point of this entry: the next session will find it
easier to argue for the holder than this one did, and the answer is still no.

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

**The list's counts split on the same line.** *N matched* and *top N recommended* are corpus
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

## 10 · Dark

**Built 2026-09-08.** This section was a contract for a later pass until then, and the contract held
up: the pass was a token swap and one prerequisite. What follows is the specification, and the
paragraph the old version led with is kept at the bottom because it is what made the swap possible.

### 10.1 · The mechanism

**Two selectors carrying an identical list.**

```css
@media (prefers-color-scheme:dark){ :root:not([data-theme="light"]){ … } }
:root[data-theme="dark"]{ … }
```

The `:not([data-theme="light"])` is load-bearing and is not defensive noise. Three states exist —
*system* (no attribute), *light*, *dark* — and a bare media query cannot be beaten by an attribute,
so an explicit **light** choice on a dark OS would do nothing. Written this way, the attribute wins
in both directions.

The list is **duplicated on purpose.** CSS cannot share a declaration block between two selectors,
and the alternative — a third indirection layer of `--dark-*` primitives that both point at — buys
nothing and hides which value is live. Whatever writes them should write both.

**41 semantic tokens, and no component rule.** *The count was recorded as "30" here and as "~21" in
`design/components.md` §3; both were estimates and both were wrong. 41 is counted from the
implementation.* `html` also moves from `color-scheme:light` to `color-scheme:light dark`, with each
`[data-theme]` pinning its own — that is what makes scrollbars, form controls and the canvas behind
the page follow the theme instead of staying light under a dark page.

**The prerequisite is the whole cost.** No component may read a primitive or a raw hex, and eleven
did. §3.2 records what they were and why none of them would have failed visibly. **Re-run the two
greps before touching this section**; a component that reads `--n-*` is a component that stays light
and says nothing about it.

### 10.2 · It is not an inversion

The dark screen in `visual-reference/visual-inspiration/` is the reference and it is emphatic on two
points, both of which survived contact:

- **Surfaces stop being fills.** The ground↔surface step is **1.06** here against **1.08** in light,
  which is close to nothing — and `--border` carries the separation that the step carries in light.
  A surface lifted further above a near-black ground reads as muddy grey rather than as a card.
- **State colours are chosen, not swapped.** A dusty sage, an oxblood and a dull gold, each measured
  against the dark surface. **This is the part that cannot be mechanical**, and it is the only part
  that took judgement rather than arithmetic.

### 10.3 · The values, measured

**Neutral.** Contrast against `--surface` `#1A1A1A`.

| Token | Hex | On surface | L* |
| --- | --- | --- | --- |
| `--ground` | `#141414` | — | 6.3 |
| `--surface` | `#1A1A1A` | — | 9.3 |
| `--surface-sunken` | `#101010` | 1.09 | 3.9 |
| `--border` | `#2E2E2E` | 1.28 | 18.9 |
| `--border-strong` | `#454545` | 1.82 | 29.3 |
| `--focus` | `#F0F0F0` | 15.27 | 94.8 |
| `--text-1` | `#F0F0F0` | **15.27** | 94.8 |
| `--text-2` | `#B4B4B4` | **8.39** | 73.3 |
| `--text-3` | `#8E8E8E` | **5.31** | 59.0 |
| `--text-disabled` | `#5A5A5A` | 2.52 | 38.2 |
| `--text-inverse` | `#141414` | — | 6.3 |
| `--ink-hover` | `#FFFFFF` | — | 100 |
| `--indicator-rest` | `#4A4A4A` | — | 31.4 |
| `--track-pressed` | `#2A2A2A` | — | 17.1 |

`--text-3` clears 4.5 at 5.31, which it has to: it carries the 10.5px micro-labels, and the same
constraint drove its light value. **`--text-1` and `--text-inverse` swap roles rather than values** —
`.btn-primary` reads `--text-1` for its fill and `--text-inverse` for its label, so a near-black
button becomes a near-white one with no component rule changing. That is the clearest single
demonstration that the contract in 10.1 is real.

**State.** Ink on `--surface`, and ink on its own tint.

| Token | Ink | Tint | On surface | On tint |
| --- | --- | --- | --- | --- |
| `--state-live` | `#84B899` | `#18241D` | 7.71 | 7.10 |
| `--state-expired` | `#D98B80` | `#2A1A17` | 6.59 | 6.32 |
| `--state-pending` | `#C9A45C` | `#251E10` | 7.42 | 7.04 |

The light set measures 6.49, 7.18 and 6.92 on surface, so the dark pairs sit in the same band. They
are desaturated, not lightened: a sage, an oxblood and a dull gold. `--state-up` and `--state-down`
are aliases and follow without being redefined.

**Density.** The ramp runs the other way and keeps the light ramp's *shape*.

| Token | Hex | Text on it | Contrast | L* |
| --- | --- | --- | --- | --- |
| `--density-0` | `#141414` | `--text-1` | 16.17 | 6.3 |
| `--density-1` | `#2A2A2A` | `--text-1` | 12.60 | 17.1 |
| `--density-2` | `#454545` | `--text-1` | 8.41 | 29.3 |
| `--density-3` | `#6A6A6A` | `--text-1` | 4.75 | 44.8 |
| `--density-4` | `#9E9E9E` | `--text-inverse` | 6.88 | 65.1 |

L* gaps are **10.7 / 12.2 / 15.5 / 20.3** against light's **8.8 / 12.2 / 16.1 / 19.9**. `--density-0`
is `--ground`, exactly as in light, so an open cell reads as nothing at 1.06 against the card and the
1px gridlines carry the grid — which is the edge state `platform.md` §6.1 requires. Text flips to
inverse at `--density-4` and only there, as in light.

*`--density-3` is `#6A6A6A` and not the evenly-spaced `#6E6E6E`. The even step lands `--text-1` at
**4.47** and reopens the dead zone at step 3 that the light ramp was specifically tuned to remove.
The same defect, found the same way, in the same place.*

**Chart, marks and skeleton.**

| Token | Hex | Note |
| --- | --- | --- |
| `--chart-series` | `#A8A8A8` | 7.32 on surface |
| `--chart-trend` | `#F0F0F0` | 15.27 — still the strongest layer |
| `--chart-unknown` | `#242424` | the unpublished window, 1.12 |
| `--mark-1` | `#F5F5F5` | 15.96 |
| `--mark-2` | `#8A8A8A` | 5.04 |
| `--mark-3` | `#F5F5F5` | hatch only, never a solid |
| `--mark-off` | `#8A8A8A` | shares with `--mark-2`, as `--n-7` is shared in light |
| `--skeleton` | `#2A2A2A` | |
| `--skeleton-shimmer` | `#343434` | still the *lighter* band, so it still reads as a sweep |
| `--skeleton-strong` | `#424242` | |
| `--cell-mark` | `rgba(245,245,245,.16)` | |
| `--cell-mark-inverse` | `rgba(20,20,20,.34)` | on `--density-4` |
| `--scrim` | `rgba(0,0,0,.55)` | heavier: a light scrim over a dark page does nothing |
| `--key-ring` | `rgba(245,245,245,.30)` | |

**The marks invert as VALUE, which is the point of having retired the hue.** `--mark-1` is again the
most prominent thing on the card; it is simply the *lightest* here rather than the darkest. Separation
is **39.1** L* points against 32.1 in light. §11 held open whether `--mark-off` could reuse `--n-7`
and the answer is that it does not need to: it shares a value with `--mark-2` exactly as it does in
light, on the same licence — *a chart uses one or the other, never both.*

`--mark-3-hatch` is **not** redefined. It reads `--mark-3` and `--surface`, so the stripes and the
ground between them both invert on their own.

**Elevation.** `--shadow-float` and `--shadow-drop` go black and heavier — an ink shadow is invisible
on ink. They matter less here than in light, because 10.2 has already moved the separating work onto
the hairline.

### 10.4 · The control

Three states **in the masthead**, sharing the control rail with the usage meter (§7). *In the
sidebar footer above the account row until 2026-09-10.* The original argument was that the sidebar
was the only element surviving a view swap and the map's page head — the obvious home, and where
IPtech puts its own meter — did not exist on the conversation or the set. **There are no view
swaps**, and what replaces it is plainer: this is account-level state and it is true on every
surface, so it lives in the chrome. *The conclusion did not move, and §7 records that the control
is protected by name from being demoted into the account menu.*

- The stored choice is applied **before first paint**, by a small script in `<head>`. Applying it
  from the main script at the bottom of `<body>` paints one light frame on the way to a dark page,
  which is the single most visible defect a theme toggle can ship with.
- `localStorage` reads and writes are wrapped: a private window **throws** rather than returning
  null, and an uncaught exception in `<head>` would take the stylesheet with it.
- *System* is a real state and it **removes** the attribute rather than writing one.
- The swap is preceded by one frame with `transition:none` on everything. Without it, every property
  in the sheet that carries a colour transitions at once and the page reads as melting. §6 does not
  name this because §6 predates there being a second theme; it is the same principle.
- **The control may not disappear at any width.** *This read "at 64px the rail stacks and the
  segmented control turns vertical; collapsing the sidebar is not a way to lose the theme
  control."* There is no collapse, and the rule generalises rather than lapsing: **no state of the
  chrome may be a way to lose it** — not a narrow viewport, not an overflow menu, and not the
  account menu. `platform.md` §6a.1 carries it as one of two things the masthead may not quietly
  lose.
- **`?theme=light|dark` pins the initial appearance and is not persisted.** It exists for one real
  case: `terrain-the-case.html` embeds the prototype in an iframe, that document is light-only by
  decision, and a dark frame inside a light page reads as a rendering fault rather than as a
  demonstration. The control inside the frame still overrides, so it is a default and not a lock.

  *Precedence has to be stated in **both** places or they fight.* The head script honours the query
  first, and so must the function the main script syncs the control from — otherwise it returns
  *system*, `applyTheme` **removes** the attribute the head script just set, and the pin silently
  does nothing. That is exactly what happened on the first build, and it was invisible until the
  case document was rendered on a dark OS.

### 10.5 · What still stands from the contract

**No component may reference a primitive (`--n-*`) or a raw hex. Every component reads a semantic
token.** This is what made the pass cheap and it is what keeps the next change to either theme cheap.
The submark inverts for free, since it is inlined with `currentColor`.

**The one thing that cannot follow the theme is the favicon.** `brand/favicon.svg` carries its own
`prefers-color-scheme` block, because an external SVG cannot inherit `currentColor` from the page
that links it. It therefore follows the **browser's** scheme, not Terrain's control: a founder who
picks light-in-app on a dark OS gets the light-on-dark icon. Nothing an external favicon can do
changes that, and the alternative — a raster per theme — is refused by `CLAUDE.md` outright.

---

## 11 · Open

*Closed 2026-08-31: **chat's resting form**. It was the docked command bar, collapsed to a 44px
icon that expanded into the composer.* **Amended 2026-09-08 with the way back:** a header that
names the current job, a close that plays the open motion in reverse, and a dot when a thread is
folded up behind it.

***Re-answered 2026-09-10: it is a masthead control opening a panel over the left column.***
`platform.md` §5, §6a and §11 carry the reasoning; §7 has the spec. **The panel-versus-dock
question did not reopen — it stopped being available**, because the map no longer has a
bottom-right corner of its own. The 2026-09-08 way-back requirements all transfer; the clip-path
morph from a corner icon does not, and is re-authored inside §6's three curves rather than
re-timed.

- ~~**A transition for the build landing on the map.**~~ **Built and abandoned, 2026-09-08 — and
  moot since 2026-09-10, which is the more interesting half.** The problem was that the set surface
  and the map surface swapped wholesale and everything on screen moved at once; the idea was to have
  the build block *shrink into the dock*, so one element visibly crossed between the two.
  **There is no swap.** The list and the views are on one surface and the views resolve in place
  (`platform.md` §6a.5), so the transition has nothing to bridge. *A hard motion problem solved by
  removing the seam it spanned is worth noticing: it was three attempts and 700ms of tuning, and
  the architecture change made it unnecessary rather than easier.*

  It worked and it was rejected on the look of it. Recorded so it is not rebuilt from scratch: the
  mechanism was a card-shaped ghost closing its `clip-path` onto the dock icon, and the numbers that
  took three attempts to find were **700ms** and a mild S-curve — `cubic-bezier(.45,.05,.55,.95)`,
  23/53/23 across the thirds at 1.7× peak velocity. The three curves in §6 all collapse at that
  length: `--ease-drawer` put **88% of the travel into the first 242ms**, which is what "rushed"
  turned out to mean when it was measured rather than argued about. `git log` has the implementation.

  **Two things it left behind, both keepers.** The widget-entrance bugs in §6 were found underneath
  it and are unrelated to it. And the dock's own ✕ was retimed in the same pass — `--dur-3` on
  `--ease-drawer`, symmetric with its open — which was a fix to a separate complaint and stands on
  its own.

- **The accent.** None chosen. Primary actions are near-black in the meantime. `brief.md` §4 flags
  this as upstream-affecting — it lands in the monorepo's gradient↔pillar pairings.
- ~~**Density thresholds** for the three zones.~~ **Closed 2026-09-04**, once there was a real
  distribution to cut against, and the zones themselves went on 2026-09-10. The bands are
  **fractions of the view's own maximum** — 2/14, 6/14 and 12/14 — so `band(n, max)` takes the
  count and the maximum and never a percentile. *The function took only the count and cut at fixed
  values until 2026-09-10; one matrix on screen made the two the same thing, and stopped doing so
  the moment a second one existed. There is one view again and the relative form is kept, because
  it is what `platform.md` §6.1 always claimed.* Guessing these from an empty grid was what kept
  the item open; a populated one settled it in a minute.
- **The IPC confidence signal** (§6.1) — no visual form yet, and it must not become a statistics
  lesson.
- ~~**Dark-mode state pairs**, per §10.~~ **Closed 2026-09-08.** Chosen against the dark surface
  rather than lightened from the light pair, and measured: §10.3. A dusty sage, an oxblood and a
  dull gold, all three landing in the same contrast band as their light counterparts.
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

  ~~**Still owed, and unchanged by the withdrawal: `--mark-off` on a dark surface.**~~ **Closed
  2026-09-08, and the premise was wrong.** This was written expecting the dark set to need a value
  the ramp could not supply, and the search did start from `#8A8A8A` as suggested — but the answer is
  that `--mark-off` **shares with `--mark-2`** on the dark surface exactly as it shares `--n-7` on the
  light one, and for the identical reason: *a chart uses one or the other, never both*, so two or
  three encoded categories leave no unencoded field to collide with. The problem the item describes
  is real and the licence that dissolves it was already in §3.7. The hatch needed nothing either —
  `--mark-3-hatch` reads `--mark-3` and `--surface`, so stripes and ground invert on their own.

  **Newly owed: a third solid, if one is ever wanted.** The third mark is texture-only because the
  ramp has no step that clears 3:1 and stays clear of the other two — `#8A8A8A` would, and is not on
  the ramp. Adding it breaks §3.1's evenness claim, so the trade is recorded rather than taken.
  Numbers in §3.7.

  **The accent: back to fully open, and `CLAUDE.md` untouched.** `brief.md` §4 recorded
  `#C2F662` as a candidate with numbers and not a decision, and the withdrawal restores exactly that
  state — a candidate with numbers, now with the additional evidence that shipping it as a chart mark
  is *not* a safe way to trial it, because a reviewer does not distinguish a chart mark from an
  accent on sight. That is the finding worth carrying into whenever the accent is actually decided.

  These are **captured live as they surface**, against the component that forced each one, rather
  than guessed in advance. *They were logged in `design/tokens/README.md` §3 until that folder was
  deleted on 2026-09-08; the surviving home for a per-component claim is
  [`design/components.md`](../design/components.md), whose §2 already carries the five specced-but-
  unbuilt forms and the data each would need.*

---

## 12 · Decisions recorded here that belong upstream

For the propagation pass described in `brief.md` §6:

- Terrain's neutral ramp is Terrain's own, not the monorepo's. If Terrain graduates into the
  monorepo, the two ramps have to be reconciled deliberately rather than merged.
- The semantic-colour rule (§2) is narrower than the monorepo's brand system allows and was written
  for a product with no accent. It does not automatically transfer.
- `#252525` as ink and the `currentColor` submark treatment are shared with the monorepo and should
  stay shared.
