# TIS Terrain — Design Language

> **How Terrain looks.** Tokens, type, space, motion, and the rules a component must hold to.
> What gets built is [`platform.md`](platform.md); what Terrain is is [`brief.md`](brief.md); what
> the engine must return, per component, is [`../design/components.md`](../design/components.md).
>
> The prototype inlines its own token block. There is no shared token stylesheet and no build step —
> and there must not be one until three previews independently want the same value. A linked font
> stylesheet locks nothing; a linked token sheet would.

---

## 1 · The read

Terrain is a dense information surface that has to be legible to somebody who has never used one.
Three things follow from that and everything else is downstream of them:

- **Hierarchy comes from weight, size and space, not from colour.** A founder scanning a screen of
  patent data should be able to find the heading, the figure and the caption without a hue telling
  them which is which.
- **Every widget states its own finding.** A chart nobody can read is a chart that needed a sentence.
  Captions are the longest prose in the product and they are not decoration.
- **Nothing pretends to more certainty than it has.** An unpublished window is shaded and named. A
  value we do not hold is a grey bar. A wait is a loader, not a fake skeleton.

---

## 2 · The one rule

**Colour carries information, or it is not there.**

Four narrow, earned places have colour. Everything else is the neutral ramp, carrying meaning with
hierarchy, weight and spacing.

| Where | What it encodes |
| --- | --- |
| **Discrete states** | live / expired / pending — §3.3 |
| **Direction of change** | a delta pill rising or falling — §3.3 |
| **Chart layers** | series, trend, unknown, grid — §3.5, plus the categorical marks in §3.7 |
| **The accent** | the primary action, the focus ring, a selected control — §3.8 |

**Colour encodes direction, never desirability.** This is the load-bearing half. A space heating up
is not good or bad for a founder — it is information. If rising filings render green, the founder
reads *green means build here*, and the trend chart delivers exactly the verdict the map is forbidden
from delivering. Green and red are confined to state chips and delta pills, where direction is
unambiguous. Series and trend overlays are both neutral.

**Nothing means *good* because it is green.** The accent is a hue for a control, not a verdict about
data, and it may not enter a chart, a cell or a status.

**Never colour alone.** Every coloured element also carries a word or a shape — a dot plus a label,
an arrow plus a number, a hatch plus a legend entry.

---

## 3 · Colour

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

`#252525` is the TIS ink and the submark's own fill. Not pure black — the reference screens all stop
short of it.

**A warm cast was tried and rejected on sight.** It read as yellow, and a neutral foundation is also
what lets an accent sit on the system without fighting a temperature.

### 3.2 · Semantic tokens

**Components read only these.**

| Token | → | Contrast |
|---|---|---|
| `--ground` | `--n-2` | page background |
| `--surface` | `--n-0` | widget cards, menus |
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
| `--key-ring` | `rgba(37,37,37,.24)` | the 1px ring on a 9px legend key |

The last three are alpha rather than flat neutrals because they composite over a surface whose colour
varies — a matrix cell is one of five tones, the legend key sits on a slice. They are still tokens,
and still the only alpha values in the system.

**There is no scrim token, and no scrim.** Nothing in the product dims the page: the record opens in
its own column, the delete confirmation is inline, and both menus close on an outside click the
document hears for itself. A dimming layer would arrive with whatever first needs one.

`--text-3` is darker than it looks like it should be. It carries the 10.5px micro-labels, which are
small text and need the full 4.5:1 — the obvious mid-grey lands at 3.6 and fails.

#### No component may read a primitive or a raw hex

This is what makes dark (§10) a token swap rather than a rewrite, and it is the rule most easily
broken silently: a component that reads `--n-*` is a component that **stays light** and throws
nothing, logs nothing, and reads as correct CSS.

**The check, stated precisely, because a naive grep does not work.** There are three token-defining
blocks — `:root`, the dark media block and `:root[data-theme="dark"]` — and all three legitimately
contain raw hex. Cut those three blocks and the comments, then look for three things in what remains:

```
var(--n-*)     →  0      a component reading a primitive
rgba() / hsl() →  0      an alpha written inline instead of tokenised
raw hex        →  0      anything at all
```

Comments are excluded because §3.4, §3.7 and §10.3 quote measured hex values as prose, and those are
the evidence rather than a violation.

### 3.3 · State colours

Each is an ink/tint pair; each renders as **dot + word**.

| Token | Ink | Tint | Ink on surface | Ink on tint | Meaning |
|---|---|---|---|---|---|
| `--state-live` | `#1B6B45` | `#E4F1EA` | 6.49 | 5.58 | live patent, active |
| `--state-expired` | `#A32B21` | `#FAE9E7` | 7.18 | 6.11 | expired patent |
| `--state-pending` | `#7A5200` | `#FBF0D9` | 6.92 | 6.12 | in progress, incomplete |
| `--state-up` | `--state-live` | | | | delta pill, rising |
| `--state-down` | `--state-expired` | | | | delta pill, falling |

Live-versus-expired is the single most decision-relevant fact a US founder reads off a row — an
expired patent is not a threat, it is free to use. It earns colour on that ground alone.

`--state-up` / `--state-down` are aliases, not new hues. **They apply only to delta pills**, never to
a series or a matrix cell.

### 3.4 · Density ramp — the matrix

| Token | Hex | Text on it | Contrast |
|---|---|---|---|
| `--density-0` | `#F6F6F6` | `--text-1` | 14.14 |
| `--density-1` | `#DDDDDD` | `--text-1` | 11.25 |
| `--density-2` | `#BBBBBB` | `--text-1` | 7.98 |
| `--density-3` | `#909090` | `--text-1` | 4.81 |
| `--density-4` | `#5E5E5E` | `--text-inverse` | 6.20 |

**Thresholds are fractions of the view's own maximum** — 2/14, 6/14 and 12/14 — so `band(n, max)`
takes the count and the maximum, never a percentile and never an absolute cut.

**Two channels, because rising is not a point on the ramp.** Tone is *how many*; a 45° hatch over the
cell is *the count is climbing*. They are independent: a pale cell can be rising and the darkest cell
can be flat. Encoding growth as a sixth tone would make the two unreadable as separate facts.

#### The ramp stays tonal, and no label may describe absence

**`--density-0` means *this one holder has not filed against this approach*.** That is a fact about a
company. It is not a gap in the field and it is not enterable ground.

A red↔green ramp would say *this cell is bad and that one is good*, and the interface would be
answering a question the data cannot. **A label saying `Open` does exactly the same thing through the
word instead of the hue** — which is why the legend has no such step and copy may not reintroduce
one. [`brief.md`](brief.md) §1 carries the test for what may and may not be said about an empty cell.

### 3.5 · Chart layers

| Token | Value | Role |
|---|---|---|
| `--chart-series` | `#595959` | the data — neutral line, area fill at 8% |
| `--chart-trend` | `--n-10` | 1.5px dashed trend overlay, 15.3 on surface |
| `--chart-unknown` | `--n-3` | the unpublished window — full tone, dashed boundary at `--border-strong` |
| `--chart-grid` | `--border` | dashed gridlines, values inside the plot |

**Series is grey on purpose.** Direction lives in the caption, in words, where it can be qualified.

**The band over the unpublished window is mandatory, not decorative.** Patents publish roughly 18
months after filing, so the last ~18 months of any series is structurally incomplete. It is shaded,
excluded from the trend, and named in the legend as *Not yet published*. It is **not** red: red in
this system means *expired*, and an incomplete window is not an error.

### 3.6 · Skeleton

| Token | Value |
|---|---|
| `--skeleton` | `--n-4` |
| `--skeleton-shimmer` | `--n-3` |
| `--skeleton-strong` | `--n-5` |

**`--skeleton-strong` is a bar the founder has acted on** — a starred row, an edited field. It is a
state, not a second grey.

### 3.7 · The categorical marks — one ink, one grey, one texture

| Token | Value | Role |
| --- | --- | --- |
| `--mark-1` | `--n-10` `#252525` | first encoded value, **or the entity being tracked** |
| `--mark-2` | `--n-7` `#6F6F6F` | second encoded value |
| `--mark-3` | `--n-10` `#252525` | third encoded value — **only ever as a 45° hatch**, never a solid |
| `--mark-3-hatch` | `repeating-linear-gradient(45deg, --mark-3 0 1.2px, --surface 1.2px 3px)` | the line-scale rendering of the third value |
| `--mark-off` | `--n-7` `#6F6F6F` | **not a fourth value — the absence of one** |

**Measured.**

| | vs `--surface` `#FFFFFF` | vs the bar track `#F0F0F0` | L* |
| --- | --- | --- | --- |
| `--mark-1` | **15.32:1** | 13.44:1 | 14.7 |
| `--mark-2` | **5.03:1** | 4.41:1 | 46.8 |
| `--mark-3` as drawn | 1.60:1 *(mean tone)* | — | 82.2 |

**The third value cannot be a solid, and that is the ramp rather than a preference.** A third solid
step would have to sit between 15.32 and 5.03, and every value there collides with `--text-3`,
`--border-strong` or the density ramp. A hatch is a different *channel*, so it does not compete.

**A hatch is not a tint, and its mean tone is the wrong number to judge it by.** What the eye
resolves is the stripe — the ink itself at 15.32:1 — so the mark has the crispest edges on the card
while reading as the lightest.

**Two renderings, one meaning.** Which one a mark gets is a question of area, not of value:

| Rendering | Where | Pitch | Duty cycle |
| --- | --- | --- | --- |
| SVG `<pattern>` | area marks — pie slices, stacked segments | 6px | 2.4 / 6 = 40% |
| `--mark-3-hatch` | line-scale marks — 8px bars, 9px key dots | 3px | 1.2 / 3 = 40% |

**There is no `--mark-4`, deliberately.** A fourth category folds into *Other*, or the chart becomes
the wrong chart. L* separation between marks that co-occur is 32 points solid-to-solid and 35 to the
hatch's mean.

### 3.8 · The accent

**Terrain's accent is green.** [`brief.md`](brief.md) §5 is the decision and carries the reasoning;
this section is how it behaves.

**Two tokens, both themed:**

```
--accent        the fill
--accent-ink    text and glyphs on that fill
```

**Where it appears — three places, and they are the whole list:**

1. **The primary action.** One filled button per surface, never two. A surface whose primary action
   is destructive has no primary action.
2. **The focus ring.** `--focus` becomes the accent rather than ink.
3. **The selected state** of a segmented control or a menu item.

**Where it may not appear:**

- **In data.** Not a chart series, not a map cell, not a density step, not a mark, not a status chip.
  §2's four permitted cases are exhaustive and the accent is the control case, not the data case.
- **As decoration.** No gradient, no wash, no tinted card background, no accent border.
- **Anywhere it could be read as a verdict.**

**Two constraints that are easy to miss:**

- **It must not be confusable with `--state-live` `#1B6B45`.** That green already means *this patent
  is enforceable*, on a chip the founder reads as a fact. An accent close enough to be mistaken for it
  makes the primary button look like a status.
- **It needs a measured dark value.** A hue chosen against `#FFFFFF` and carried unchanged onto
  `#1A1A1A` is how a control silently stops meeting contrast. §10.3's table gains two rows when the
  specific green is chosen.

**Not yet applied.** The prototype ships with near-black primary fills, which is what the no-accent
rule left behind. Repainting is a separate pass and a visible one.

**Innovue's blue is not an accent and never becomes one.** `#006CB6` appears inside the Innovue mark
on the attribution line and nowhere else — a third party's mark reproduced as issued.
[`brief.md`](brief.md) §3 carries the test.

---

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

**A role is one class, never two.** Each `figure-*` carries the family, the numeric setting and the
weight along with its size, because a role split across a base class and a size class is a role that
only works when both are spelled — and nine sites spelled one. *This is the failure mode a preview
cannot show you: a numeral in the wrong face at the right size is still a numeral, and the alignment
it loses with `tabular-nums` only shows up in a column someone happens to be reading down.* Check it
by reading the computed style, not the page.

**The secondary-figure treatment.** In any `figure-xl` or `figure-l`, a suffix, denominator or
decimal drops to weight 400 at 55% opacity: `194` stays full, `/ 381` recedes.

**Measure is capped at `68ch`** for body prose — **and a measure rule only holds where something
declares it.** No preview will tell you which containers are missing the cap; the two most-read
sentences in the product ran at ~88 and ~95 characters for a month inside a card that looked like it
had a measure discipline.

**A label that heads a box is not a label inside it.** `micro` is one role, so a box title and a field
label inside it render identically unless something separates them. The box title takes `--text-2`
and a 12px gap.

**English only.** No `data-zh`, no bilingual markup, no CJK face.

---

## 5 · Space, radius, elevation

**Space** — `2 4 6 8 10 12 14 16 20 24 32 40 56 72`. Two-based below 16, four-based above. Nothing
off-scale.

**Group gaps are at least twice the gaps inside the group, or the grouping does not read.** The scale
is what makes this cheap to get right: **there is no 28**, so one step up from 24 is 32, and the
temptation to split the difference is the temptation to add a step.

**Radius** — `4` chip · `6` segmented pill · `8` control · `12` card inner · `16` widget · `20` shell
· `999` pill.

`6` exists only for the active pill inside a segmented control: an 8-radius pill in an 8-radius track
with 2px of padding reads as a bulge, because inner and outer curves are concentric only when the
inner radius is the outer minus the inset.

**Elevation is a hairline, not a shadow.** Depth comes from the ground↔surface step plus 1px
`--border`. Two shadow tokens exist:

```
--shadow-float: 0 1px 2px rgba(37,37,37,.04), 0 8px 24px -6px rgba(37,37,37,.10);
--shadow-drop:  drop-shadow(0 1px 1px rgba(37,37,37,.05)) drop-shadow(0 6px 16px rgba(37,37,37,.10));
```

`--shadow-drop` is the same elevation as a `filter` rather than a `box-shadow`, for the clipped
composer: `clip-path` eats a `box-shadow`, but a filter on the unclipped parent sees the clip.

**The shadow belongs to anything that floats free of the page, over content it does not push aside** —
menus, popovers, the record over the right pane. **A widget card that reaches for a shadow has not
earned one**: it sits *in* the layout, and the ground↔surface step plus a hairline says so.

**A shadow cannot separate two surfaces of the same colour.** `--shadow-float` is downward-biased
with a `-6px` spread, so it contributes almost nothing at a *vertical* edge, and an elevation shadow
needs a background that recedes. The record floats over cards of its own surface value, so it carries
`1px --border` on all four sides — the hairline is what draws the edge, not the shadow.

---

## 6 · Motion

```
--ease:        cubic-bezier(.2, 0, 0, 1);      strong ease-out
--ease-in-out: cubic-bezier(.77, 0, .175, 1);  system-driven movement only
--ease-drawer: cubic-bezier(.32, .72, 0, 1);   an overlay entering from an edge

--dur-1: 120ms;   hover, press
--dur-2: 200ms;   popover, chip, tooltip
--dur-3: 320ms;   the record, composer expansion and collapse
--dur-4: 520ms;   an assembly, where the staging IS the design
```

**Which curve, as a rule rather than a list:**

| | Curve |
| --- | --- |
| Anything the founder initiated — entrances, exits, click-triggered morphs | `--ease` |
| **System-driven** on-screen movement, where nobody is waiting on their own click | `--ease-in-out` |
| An overlay entering from an edge | `--ease-drawer` |
| Constant motion — the loader, the skeleton shimmer | `linear`, no token |

The middle row is narrower than it looks. `cubic-bezier(.77,0,.175,1)` is flat for its first half —
it *is* an ease-in at the start — so it is confined to movement no one is waiting on. Anything
triggered by a pointer or a key takes `--ease` and begins moving immediately.

**The view swap.** The leaving view goes to `opacity: 0` and `translateY(-4px)` over `--dur-2`; the
arriving view starts 120ms later at `opacity: 0` / `translateY(6px)` and lands over `--dur-3`.
**Exit is faster than enter** — the founder has already decided to leave, and the system should look
like it is responding rather than deliberating.

**Motion is restrained everywhere except the build, where the assembly is the design.** Nothing
animates on a return visit.

### What a wait looks like

**A loader, not a skeleton.** A bar is the refusal to invent a value and is permanent; a loader is
work in flight and goes when the work does.

**One loader, one size, every wait** — a 20px dot-matrix mark, from the column to a card to the
record to the *Show more* button. Two indicators read as an inconsistency, never as a vocabulary: a
second one asks *why is this one different*, which is never a question about the data, and it does not
stop asking because there is a good answer.

**The size is small on purpose.** 20px in a ~986px card is about 2% of its width. A loader is a mark
meaning *working*, not a thing that fills the region it waits on. **If one ever reads as too faint,
the fix is its opacity, never its size** — the moment a loader's size varies by region it has begun
carrying information, and at that point it is a chart.

**The region reserves its height before it empties.** Otherwise a card body collapses to the loader's
20px, the grid reflows, and it reflows again when the data lands — two layout jumps to say one thing
arrived.

**What waits is what the request changes.** A request that rearranges rows already on screen leaves
them standing and puts the loader on the control that was pressed — a sort, the next page. A request
that changes *which* rows exist empties the region and puts the loader inside it — a filter, a new
search, a record. The test is whether what is on screen is still true while the answer is coming.
Where it is, blanking it claims a re-fetch that is not happening; where it is not, keeping it shows
the founder data they have just excluded.

**The build bar advances on completed stages, never on elapsed time.** A bar that fills on a timer
asserts a duration nothing supports, at the most credulous moment the founder has.

### Standing prohibitions

Each is greppable.

- **No `transition: all`.** Name the properties. `all` animates whatever a later edit adds.
- **No entrance from `scale(0)`.** `.95`–`.97` with opacity. Nothing in the world appears from nothing.
- **No `ease-in`.** It delays movement at exactly the moment the eye is on it.
- **No transition or animation on a layout property** — `width`, `height`, `margin`, `padding`, `top`,
  `left`. Use `transform`, `clip-path`, `grid-template-rows`, or FLIP. **There are no exceptions.**
- **Hover-driven motion sits inside `@media (hover: hover) and (pointer: fine)`.**
- **Exit is faster than enter**, everywhere.
- **Contents do not move while their container is moving.** Transitions on separate objects may begin
  after the container stops; nothing fades in while an overlay is still opening.
- **A container already in place does not move to say its contents changed.** Opening a second record
  without closing the first crossfades the body on `--dur-1`; re-running the slide would be motion
  claiming something arrived when nothing did.
- **Three keyframes, and the bar for a fourth is high.** `sweep`, `sweepx` and the loader's ripple.
  Each does something a transition cannot: constant, indeterminate motion with **no end state to
  transition to**. **The test is unchanged — could a transition have done this?** For anything with a
  start state and an end state the answer is yes, and the answer to whether it may be a keyframe is
  then no. *There are already three* is not an argument.

### Two ways a correct spec gets defeated

Both were real, both were invisible in review, and neither would have failed a screenshot.

1. **A start state that was never committed.** Removing a class, forcing a reflow and re-adding it
   does not snap an element to `opacity: 0` — the same style change that applies the start state also
   applies the transition, so the element animates *towards* zero and gets retargeted from wherever it
   reached. Commit the start state with transitions suppressed for one frame, then restore them.
2. **Setting up an entrance on a hidden element.** A view still `visibility: hidden` when the entrance
   class lands never runs it. Wait a frame.

Fixing either alone leaves the other.

---

## 7 · Components

The prototype is the component reference: every rule below is implemented there, with the reasoning in
its own comments. This section carries what a reader cannot get from the CSS.

**The shell.** TIS submark at the leading edge of a **48px top masthead**, inlined with
`fill="currentColor"` so it inverts for free. Content on `--ground`, cards on `--surface`, one working
surface beneath the bar.

**The working surface has a floor, and below it Terrain says so rather than reflowing.** The list
column is a fixed 420px and the pane takes what is left, so the arithmetic decides this rather than a
preference: at 840px the pane is narrower than the list, which puts the answer in less room than the
evidence. **The supported floor is 1024px.** Below it the product states that it needs a wider window
and stops, which is honest about a two-column analytical surface carrying a five-column matrix.

**The breakpoints above the floor adjust components, never the structure.** The card grid folds to one
column, the record goes full-bleed over the pane, a label narrows. The two columns never stack — a
list and the views built from it are read against each other, and stacking them ends that.

**The breakpoints are the viewport's, with one exception.** A settings card is handed whatever width
its column has, which a viewport query cannot see, so `.pref-card` declares `container-type` and
queries its own descendants. **It is the only container query in the file**, and a second one has to
earn the same two things: a subject that exists in the markup, and a width the viewport does not know.
*A container query whose subject was never built does not fail — it sits in the stylesheet looking
like responsive behaviour, and no screenshot at any width can show you that it is not there.*

**The lockup routes home unless there is no home to route to.** On the working screen it scrolls both
columns to the top — both, because the surface has two and returning one is a half-answer. On a
destination it returns to the working screen in the mode that destination's own Back would have used.
On the conversation it is inert.

**The visual does not change between those states**, and that is the constraint everything else
follows from. It stays an `<a>`, keeps its styling and its cursor, and tells assistive tech with
`aria-disabled` rather than by greying out. *A lockup that changes appearance by screen stops being a
fixed point in the chrome, which is the whole of what makes it usable as home.*

**Two things in the masthead are protected by name.** The appearance control stays on the bar at every
width — burying it in a menu is the same loss as dropping it. And version history stays **nested under
the open project**, indented on a left hairline: a version is *of* a project, and two flat lists say
nothing about which belongs to which. A menu flattens by default, so the nesting is rebuilt inside it.

**One `<main>` per surface.** Collapsing surfaces is how a screen-reader user loses the landmark they
meet before anything else.

**The composer is one component at one size.** It is the whole column until there is a thread, then it
pins to the bottom of it. It is inert until something is typed. **A support field may not wear it** —
the composer's identity is *the thing you type your idea into*, and a second one would be a second
conversational surface.

**The confirm card is two turns**, the reading and the act, with the primary action **under the
composer** rather than at the foot of the card. Approve and *say what is off* are one decision, so
they are one zone. The action is full width: the send arrow already owns the bottom-right corner, and
a right-aligned pill beneath it reads as a second send.

**One primary action per surface.** A near-black fill (an accent fill, once §3.8 is applied) is what
says *this is the way forward*. Two filled buttons on one screen make the smaller one look like the
way forward. **The primary action of a settings card is never deletion** — where the act is
irreversible, the safe path is the affirmed button and the act is the ghost one, with the weight
carried by the sentence above them rather than by a hue.

**A switch is a claim that the product does the thing when it is on.** Every other invented value in
the prototype is a grey bar or a figure the reader is told is illustrative; a control carries no such
marking, and nothing about a toggle says *this is a sketch*. Do not add one for a capability that does
not exist.

**Widget cards** carry a head (icon, title, optional control, one info affordance), a body, and a
caption that states the finding. **The info popover carries explanation only** — the test is whether a
screenshot with **no popover open** still says what the founder is looking at. A caption that needs a
popover to make sense is a caption that is not doing its job.

**A narrow column has room for the list or for prose about the list.** Every sentence that is not the
list lives behind one control.

**A field states its own trouble in weight, not colour.** §2 would permit a hue here — an error is a
discrete state — but the hue it would take is `--state-expired`, which in this product means *expired
patent* and can be on a chip the founder is reading on the same screen. **Two reds meaning two things
is worse than no red.** So the edge doubles instead: an inset 1px `--text-1` ring over the 1px border,
two pixels of ink and no layout change. A border-*width* change would move the value one pixel right,
which is a layout property doing a state's job.

**The message carries the fact; the edge only says where.** It states the fix rather than the fault —
*Use an address with an @ in it* rather than *invalid email* — and it sits with the field that failed,
not at the top of the form.

**Disabled is not opacity, and neither is invalid.** A button may fade because its label is all there
is in it. A field may not: fading a field fades its value to unreadable, so a disabled field takes the
sunken fill and keeps its value legible.

**`disabled` when the reason is already on screen; `aria-disabled` when it has to be read.** This is
the mechanism rule behind the one above, and the two treatments look identical — what differs is
whether the control keeps its place in the tab order. A native `disabled` control leaves it, and the
reason leaves with it, so it is only correct where the founder can already see why: a send button
under an empty field, a save under an untouched one. Where the reason is a *sentence* — not enough
points, an edit still open, an act that is not built yet — the control stays focusable and
`aria-describedby` carries the reason to it on every visit rather than announcing it once in passing.
Activation is then blocked in code, because the platform has stopped doing it.

**So a submit that is inert until there is something to submit stays natively disabled**, and that is
not a departure from the general advice to keep submits enabled. That advice exists to stop a form
hiding *why* it will not send. Here the why is the empty field directly above the button.

**A failure is the same argument at the size of a region.** A view, a pane or a list that does not
arrive takes an icon, a sentence that states the fix, and an action where there is one, on the
`--surface-sunken` fill any box inside a card takes. No hue, for the reason above, and none of the
three state colours is available anyway: red is *expired*, amber is *in progress*, green is *live*
and now the accent.

**It takes one hairline at full ink, not the field's doubled edge**, and the difference is scale
rather than principle. A field doubles because it already has a resting border and may not change
width. A block has no resting border to double, and 2px of `--text-1` around something 300px wide
out-shouts the primary action on the same screen. One `--text-1` hairline says the same thing at the
right volume: `--border` is 1.27:1 and reads as furniture, `--text-1` is 15.3:1 and reads as a
statement.

**A failed region silences its own caption.** A widget caption states the finding — *filings have gone
from about 20 a year to about 45* — and that sentence is drawn from the data that did not arrive.
Left standing it is the interface making a claim about numbers it does not have, directly above a
block saying it does not have them.

**A region that fails keeps the height its wait reserved.** Dropping to the height of a short sentence
moves everything below it a second time, and the second jump is the one that loses the reader's place.

**Failure is the one thing that announces assertively.** Every other update in the product is polite
and waits its turn; a surface that did not do what was asked cannot. It is the only `role="alert"` in
the system, and it carries nothing else — a routine confirmation borrowing it is how an alert region
stops being read as urgent.

**Live regions announce once.** Two regions, two moments, never the same fact: one announces a beat
starting and is emptied when it lands, the other announces the settled state. A region ships **empty
and hidden** — a region registered at load and silent until there is something true to say is the only
kind that reliably announces a later polite update.

**`[hidden]`, not `visibility`,** for a control that has nothing to do: it leaves the tab order and the
accessibility tree with the pixels.

**There is no `<select>` in this system.** Four options behind a menu button, `menuitemradio` for
one-of-N.

**An info popover anchors to its trigger, not to its card.**

**A sent state replaces its form rather than sitting under it.** A composer left on screen beneath a
confirmation invites a second send of the same message.

---

## 8 · The skeleton contract

Terrain has no engine behind the prototype, so every preview shows a populated screen without live
data.

**Chrome is real. Identities stay bars. Figures are illustrative.**

| Real English | Grey bar | Illustrative |
|---|---|---|
| Titles, buttons, column headers, captions, legends, empty-state copy, menu rows, axis *titles* | Company names, other project names, the user's own name and address, plan tier, patent and application numbers, IPC symbols, inventors | Counts, cell values, jurisdiction splits, axis *values*, filing and publication years, version numbers |

**No party is invented.** A named company is never invented, because an invented one reads as a live
example — and transliterating a real one is fabrication. Both are worse than a bar.

**The founder's own name and address are bars too.** §8 does not bend for them: a settings page whose
whole content is a name and an email is where that temptation is strongest. A password renders as a
run of dots, which is what a password looks like everywhere and is chrome rather than an identity
being withheld.

**A jurisdiction is not a party**, so countries are named. Five grey wedges would read as nothing.

**An empty list is not a list of bars.** A bar says a value exists and is being withheld; a list with
nothing in it has no values to withhold. Three grey rows where a founder has no projects claims they
have three projects whose names we decline to print. So an empty list says what fills it and offers
the act that does — the same distinction the loader draws against the bar, one component up.

**The screen must read as populated through layout alone.** That is the harder and more useful test.

### The exceptions, and what makes one admissible

Each is the same exception: **where a widget's whole purpose is to express a *shape*, rendering it
flat would show nothing**, so the shape is drawn and the values stay bars.

- **Matrix tone.** Cells carry the density ramp and the rising hatch. Cell *counts* are bars.
- **The filings series.** The chart draws a curve so the three-layer grammar is visible at all. Both
  axes are bars.
- **The year on a list row.** A date sort over a column of grey bars is an order the founder cannot
  check. The control is the argument, not the row.
- **The one demonstration record.** A record pane of nothing but bars cannot demonstrate a record
  pane. Exactly one is populated, and its field *names* were always real anyway.

**None of them claims a fact.** A tone is not a count and an unlabelled curve is not a year.

**The line, stated once:** an exception is admissible when the alternative shows *nothing*, not when
it merely shows *less*. If a fifth is proposed, treat it as evidence the contract is being eroded
rather than extended.

---

## 9 · Icons

**Lucide, and nothing else.** No Heroicons, no Feather, no Material, no one-off SVGs from a search
result. Mixing sets is immediately visible in the stroke weight and the corner radius, and it reads as
an interface assembled from parts.

1.5px stroke, round caps and joins, 16px in controls and 18px in card heads.

**One glyph, one act.** Two controls in one region carrying the same mark for different acts is the
assembled-from-parts failure arriving through repetition rather than through mixture — so *New search*
takes the magnifier with a plus in it, and it is the only magnifier in the masthead.

---

## 10 · Dark

### 10.1 · The mechanism

**Two selectors carrying an identical list.**

```css
@media (prefers-color-scheme:dark){ :root:not([data-theme="light"]){ … } }
:root[data-theme="dark"]{ … }
```

The `:not([data-theme="light"])` is load-bearing. Three states exist — *system* (no attribute),
*light*, *dark* — and a bare media query cannot be beaten by an attribute, so an explicit **light**
choice on a dark OS would do nothing. Written this way, the attribute wins in both directions.

The list is **duplicated on purpose.** CSS cannot share a declaration block between two selectors, and
a third indirection layer of `--dark-*` primitives buys nothing and hides which value is live.
Whatever writes one writes both.

**40 semantic tokens, and no component rule.** `html` also moves from `color-scheme:light` to
`color-scheme:light dark`, with each `[data-theme]` pinning its own — that is what makes scrollbars,
form controls and the canvas behind the page follow the theme instead of staying light under a dark
page.

**The prerequisite is the whole cost**, and it is §3.2's rule. Re-run the two greps before touching
this section.

### 10.2 · It is not an inversion

- **Surfaces stop being fills.** The ground↔surface step is **1.06** here against **1.08** in light —
  close to nothing — and `--border` carries the separation the step carries in light. A surface lifted
  further above a near-black ground reads as muddy grey rather than as a card.
- **State colours are chosen, not swapped.** A dusty sage, an oxblood and a dull gold, each measured
  against the dark surface. This is the only part that took judgement rather than arithmetic.

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

**State.** Ink on `--surface`, and ink on its own tint.

| Token | Ink | Tint | On surface | On tint |
| --- | --- | --- | --- | --- |
| `--state-live` | `#84B899` | `#18241D` | 7.71 | 7.10 |
| `--state-expired` | `#D98B80` | `#2A1A17` | 6.59 | 6.32 |
| `--state-pending` | `#C9A45C` | `#251E10` | 7.42 | 7.04 |

**Density.** The ramp runs the other way and keeps the light ramp's *shape*.

| Token | Hex | Text on it | Contrast | L* |
| --- | --- | --- | --- | --- |
| `--density-0` | `#141414` | `--text-1` | 16.17 | 6.3 |
| `--density-1` | `#2A2A2A` | `--text-1` | 12.60 | 17.1 |
| `--density-2` | `#454545` | `--text-1` | 8.41 | 29.3 |
| `--density-3` | `#6A6A6A` | `--text-1` | 4.75 | 44.8 |
| `--density-4` | `#9E9E9E` | `--text-inverse` | 6.88 | 65.1 |

**Chart, marks and skeleton.**

| Token | Hex | Note |
| --- | --- | --- |
| `--chart-series` | `#A8A8A8` | 7.32 on surface |
| `--chart-trend` | `#F0F0F0` | 15.27 — still the strongest layer |
| `--chart-unknown` | `#242424` | the unpublished window, 1.12 |
| `--mark-1` | `#F5F5F5` | 15.96 |
| `--mark-2` | `#8A8A8A` | 5.04 |
| `--skeleton` | `#2A2A2A` | |
| `--skeleton-shimmer` | `#343434` | |
| `--skeleton-strong` | `#424242` | |

**`--accent` and `--accent-ink` gain rows here when the specific green is chosen.** A hue measured
only against white is a hue that has not been measured.

### 10.4 · The control

Three states — light, dark, system — as a segmented control in the masthead, persisted to
`localStorage` and overridable by URL for headless capture. A second control over the same value on
the account page is additive: one value, one writer, two places to press.

**It may not be demoted into a menu.** A pass proposing that reverses a recorded decision.

**The favicon follows the *browser's* colour scheme, not Terrain's control**, and nothing can change
that — an external favicon cannot inherit `currentColor` the way the inlined submark does.

---

## 11 · Open

- **The specific green**, its `--accent-ink`, and both dark values. §3.8 is the rule; the hue is not
  chosen.
- **The map has a cell click; the filings chart and Lineage have none.** Two widgets that look
  interactive and are not.
