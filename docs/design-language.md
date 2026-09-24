# TIS Terrain — Design Language

> **How Terrain looks.** Tokens, type, space, motion, and the rules a component must hold to.
> What gets built is [`platform.md`](platform.md); what Terrain is is [`brief.md`](brief.md); what
> the engine must return, per component, is [`../design/components.md`](../design/components.md).
>
> Every standalone page inlines its own token block. There is no shared token stylesheet and no build step —
> and there must not be one until three previews independently want the same value. A linked font
> stylesheet locks nothing; a linked token sheet would.

---

## 1 · The read

Terrain is a dense information surface that has to be legible to somebody who has never used one.
Three things follow from that and everything else is downstream of them:

- **Hierarchy comes from weight, size and space, not from colour.** A founder scanning a screen of
  patent data should be able to find the heading, the figure and the caption without a hue telling
  them which is which.
- **Nothing on screen is a reading of what is on screen.** Terrain prints the engine's answer and the
  patent's own text. There is no caption stating a finding, because a finding is an analysis and
  `brief.md` §1 puts those outside the product — this is the rule that used to say the opposite, and
  it inverted with the product rather than being relaxed.
- **Nothing pretends to more certainty than it has.** A value we do not hold is a grey bar. A wait is
  a loader, not a fake skeleton. An empty result says what was searched.

---

## 2 · The one rule

**Colour carries information, or it is not there.**

Three narrow, earned places have colour. Everything else is the neutral ramp, carrying meaning with
hierarchy, weight and spacing.

| Where | What it encodes |
| --- | --- |
| **Discrete states** | live / expired / pending — §3.3 |
| **Direction of change** | a delta pill rising or falling — §3.3 |
| **The accent** | the primary action, the focus ring, a selected control — §3.8 |

*A fourth was **chart layers**, and it left with the charts entirely. §3.5 is retired and its number
is not reused.*

**A new chart is an amendment to [`brief.md`](brief.md) §4, not a design task.** The tokens are gone
rather than parked, so drawing one means declaring them again, in all three theme blocks, with
measured contrast — which is the friction this rule is for.

**Colour encodes direction, never desirability.** This is the load-bearing half. A patent being live
is not good or bad for a founder — it is information, and whether it is a problem depends entirely on
what they are building. Green and red are confined to state chips and delta pills, where direction is
unambiguous.

**Nothing means *good* because it is green.** The accent is a hue for a control, not a verdict about
data, and it may not enter a status, a score or a rank.

**Never colour alone.** Every coloured element also carries a word or a shape — a dot plus a label,
an arrow plus a number, a hatch plus a legend entry.

---

## 3 · Colour

**The subsection numbers are stable across retirements.** §3.4 was the density ramp and §3.7 was the
categorical marks; both went with the analysis layer, and their numbers are not reused. A number that
gets reassigned turns every reference to it in the code, in the other documents and in this file's
own prose into a silently wrong pointer rather than a visibly missing one.


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
| `--surface` | `--n-0` | cards, menus, popovers |
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
| `--track-pressed` | `--n-4` | a bar track under the selected row |
| `--veil` | `rgba(255,255,255,.82)` | the ground under a control bar floating over content |
| `--veil-edge` | `rgba(37,37,37,.12)` | the hairline on that bar, compositing over the same thing |
| `--scrim` | `rgba(37,37,37,.55)` | the one dimming layer, under the enlarged drawing |
| `--figure-ground` | `#FFFFFF` | the paper a patent drawing was published on |
| `--figure-ink` | `#595959` | a caption ON that paper, quiet |
| `--figure-ink-strong` | `#252525` | the same caption, raised |

Three of these are alpha rather than flat neutrals because they composite over a surface whose colour
varies — `--veil` sits on a patent's own line-work, `--veil-edge` sits on whatever `--veil` is sitting
on, and `--scrim` sits on whatever the founder was looking at. They are still tokens, and still the
only alpha values in the system. **`--veil`'s .82 is measured**: below about .78 a 1.5px Lucide stroke
stops clearing 4.5:1 against the black line-work showing through, and above .90 the bar stops reading
as floating and becomes a plate over the figure.

**`--veil-edge` is `--veil`'s own argument applied to the edge**, and it exists because that argument
had only been applied to the fill. The border on a floating control composites over the same varying
thing the fill does, and it was `--border`, which swaps: in dark the figure bar wore a `#2E2E2E`
hairline measuring **13.6:1** against the `#FFFFFF` pill it edges, where light's `#E4E4E4` measures
**1.27:1**. A factor of ten for one declaration. **The .12 is measured against both backdrops** — over
white paper the edge lands at `#E5E5E5` (1.26:1), over black line-work at `#BCBCBC` on a `#D1D1D1`
pill (1.24:1) — because an edge has to be the same weight whatever is under it. **It is alpha and not
a hex for that reason:** a solid `#E4E4E4` measures 1.20:1 over line-work but *inverted*, lighter than
what it edges, so the hairline would change polarity as the founder pans and read as an artefact.

**`--scrim`'s .55 is measured too, against the thing it separates.** The enlarged drawing's stage is
`--figure-ground`, white in both themes, so in light theme — where the page behind is `--n-2` — the
scrim is the only thing making the lightbox's edge an edge. Composited it lands at `#838383` and
clears the white stage at 3.79:1; at .48 it falls to 3.11 and below that it fails 3:1 outright, which
is the floor for a boundary that is not text. Above about .65 the page stops reading as a page that
is still there.

**The paper does not swap, and neither does the ink on it.** `--figure-ink` and
`--figure-ink-strong` are light's own `--text-2` and `--text-1`, frozen, because a caption sitting on
a patent drawing sits on `--figure-ground` rather than on the app. Taking `--text-*` there was the
same defect `--veil-edge` was added for: **measured in dark, the record's figure number was `#8E8E8E`
on `#FFFFFF` paper at 3.28:1** — under the 4.5:1 this section sets for small text — and a caption
raised to `--text-1` was `#F0F0F0` at **1.14:1**. Frozen, they measure **7.00:1** and **15.33:1** on paper, in both themes.

**`--figure-ground` is the semantic token this all follows from**, and that is a fact about the
content rather than an exemption from §10. A patent drawing is black line-work on a transparent
background; composited onto `#1A1A1A` it is a blank rectangle. Every other semantic token means *the
surface under our own chrome*; this one means *the paper this was published on*, which has no dark
value. It is a token rather than a literal because §3.2's rule is that every colour is a token — a
named invariant is checkable where a hex in a component is a judgement call the gate has to allow.

**There is exactly one scrim, and it is the enlarged drawing.** This read *there is no scrim token
and no scrim*, and closed with *a dimming layer would arrive with whatever first needs one*. That is
what happened: the figure viewer became a lightbox over the viewport, because it had been capped at
one column of a two-column split and reference numerals are what a founder enlarges a drawing for.

**Everything else still dims nothing**, and the list is the rule rather than an anecdote: the record
opens in its own column, the grouping panel is a popover, the delete confirmation is inline, and
every menu closes on an outside click the document hears for itself. `--scrim` has one reader. **A
second one is a sign this rule has stopped holding**, not a sign the token turned out to be useful.

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

Comments are excluded because §3.1, §3.2 and §10.3 quote measured hex values as prose, and those are
the evidence rather than a violation.

### 3.3 · State colours

Each is an ink/tint pair; each renders as **dot + word**.

| Token | Ink | Tint | Ink on surface | Ink on tint | Meaning |
|---|---|---|---|---|---|
| `--state-live` | `#1B6B45` | `#E4F1EA` | 6.49 | 5.58 | live patent, active |
| `--state-expired` | `#A32B21` | `#FAE9E7` | 7.18 | 6.11 | expired patent |
| `--state-pending` | `#7A5200` | `#FBF0D9` | 6.92 | 6.12 | an application still in examination |
| `--state-up` | `--state-live` | | | | delta pill, rising |
| `--state-down` | `--state-expired` | | | | delta pill, falling |

Live-versus-expired is the single most decision-relevant fact a US founder reads off a row — an
expired patent is not a threat, it is free to use. It earns colour on that ground alone.

**Four status words share three hues, and the fourth word is why.** A patent's status renders as
**Live**, **Expired**, **Abandoned** or **Pending**; *Abandoned* takes `--state-expired`. The hue
means **not enforceable**, which is true of both, and the word is what separates them: an expired
patent was granted and lapsed, an abandoned application was never granted. A fifth token for a fact
the first already carries would be colour doing a word's job, which §2 puts the other way round.

**A status Terrain does not know renders nothing at all.** Not a bar, and certainly not a guess —
`null` here is not a withheld value, it is an absent one, and a chip is the wrong shape for either.

`--state-up` / `--state-down` are aliases, not new hues. **They apply only to delta pills**, never to
a series, a score or a status.

*§3.5 was chart layers and is retired. It survived the analysis layer on one claim — that the points
page still drew a column per day — and the points page draws no chart: it renders a meter bar and a
table. `--chart-series` went with the section, and §3.5's number is not reused, for the reason §3
opens with.*

### 3.6 · Skeleton

| Token | Value |
|---|---|
| `--skeleton` | `--n-4` |
| `--skeleton-shimmer` | `--n-3` |
| `--skeleton-strong` | `--n-5` |

**`--skeleton-strong` is a bar the founder has acted on** — a starred row, an edited field. It is a
state, not a second grey.

### 3.8 · The accent

**Terrain's accent is green.** [`brief.md`](brief.md) §5 is the decision and carries the reasoning;
this section is how it behaves.

**Three tokens, all themed:**

```
--accent          the fill
--accent-ink      text and glyphs on that fill
--accent-hover    hover on an accent fill
```

**The third is not an afterthought.** `--ink-hover` is one step along the *neutral* ramp, which is
the correct hover for a near-black fill and turns a green button grey the day the accent lands. A
hover on an accent is a measured darker accent and cannot be derived from the accent by a formula,
so it is its own token in all three blocks.

**`--focus` is derived from `--accent`, not declared beside it.** One edit moves the primary fill,
the selected control and the ring together, which is what makes site 2 below true by construction
rather than by discipline. §3.9 carries the tier.

**Where it appears — three places, and they are the whole list:**

1. **The primary action.** One filled button per surface, never two. A surface whose primary action
   is destructive has no primary action.
2. **The focus ring.** `--focus` becomes the accent rather than ink.
3. **The selected state** of a segmented control or a menu item.

**Where it may not appear:**

- **In data.** Not a chart series, not a status chip, not a score, not a relevance rank.
  §2's three permitted cases are exhaustive and the accent is the control case, not the data case.
- **As decoration.** No gradient, no wash, no tinted card background, no accent border.
- **Anywhere it could be read as a verdict.**

**Two constraints that are easy to miss:**

- **It must not be confusable with `--state-live` `#1B6B45`.** That green already means *this patent
  is enforceable*, on a chip the founder reads as a fact. An accent close enough to be mistaken for it
  makes the primary button look like a status.
- **It needs a measured dark value.** A hue chosen against `#FFFFFF` and carried unchanged onto
  `#1A1A1A` is how a control silently stops meeting contrast. §10.3's table gains two rows when the
  specific green is chosen.

**The slot exists and is read; the hue does not.** All three tokens are declared in
`app/styles/tokens.css` **aliased to the ink pair**, and the three sites above read them today. That
is a faithful description of what ships — near-black primary fills, which is what the no-accent rule
left behind — rather than a placeholder, and it makes the repaint a **three-value edit in each of the
three token blocks** instead of a hunt through the stylesheet.

Declaring them aliased rather than omitting them is the point: tokens that exist and are read by
nothing leave the repaint a hunt anyway. A loud sentinel value was the other option and was turned
down — it violates §2's one rule and it would ship the day somebody forgot.

**Innovue's blue is not an accent and never becomes one.** `#006CB6` appears inside the Innovue mark
on the attribution line and nowhere else — a third party's mark reproduced as issued.
[`brief.md`](brief.md) §3 carries the test.

### 3.9 · The five tiers, and the fourth one nothing had written down

`app/styles/tokens.css` is the one authored copy of every token and **the only file permitted to
declare a custom property on `:root`** — which makes §3.2's exemption a *file* rather than a list of
blocks that goes stale. `tools/check-app.py` refuses one declared anywhere else.

| Tier | Count | Declared | The rule |
| --- | --- | --- | --- |
| **primitive** | 11 | `:root`, once | `--n-0`…`--n-10`. **No component may read one.** |
| **scale** | 28 | `:root`, once | `--s-*` `--r-*` `--dur-*` `--ease*` `--cycle`. Invariant by construction: a step is not a different size at night. |
| **semantic** | 32 | **all three blocks** | This is the dark contract. §10.1. |
| **derived** | 3 | `:root`, once | Resolves *through* a themed token, so it inverts for free. **Never add one to a dark block.** |
| **component-scoped** | 5 | on the component's own class | Never on `:root`, never read outside that component. |

**The file is ordered by theme-variance, not by document section**, so *the three blocks carry the
same names in the same order* is a one-line assertion and **added to light, forgot dark** is
impossible to commit. The cost is that `--shadow-float` sits under §5 here and in the themed half
there; that mismatch is exactly why the file is not organised by §.

**The derived three** are `--state-up`, `--state-down` and `--focus`. A literal for any of them
inside a dark block would pin the value to one palette **while reading as perfectly correct CSS** —
the same failure mode as a component reading a primitive. `--focus` is the clearest case: it
re-reads `--accent` at use time, so choosing the green once gives the focus ring both its values.

*This read `the derived five` and named two tokens the file had already deleted. It is the same
drift §10.1 describes, in the prose rather than the table, which is why the gate added there counts
the tiers rather than trusting either.*

**The component-scoped five** are `--dmx-cycle`, `--dmx-opacity-base`, `--dmx-opacity-mid`,
`--dmx-opacity-peak` and `--stage-delay`. They are declared on the component's own class because
that is their scope: a loader's idle opacity is not a fact about the interface, and putting it on
`:root` would invite a second component to read it.

**`--dmx-opacity-*` is the pattern to copy: a CSS default plus a JS override.** The class declares
the value, JavaScript may raise or lower it per instance with `setProperty`, and **every read site
carries a fallback**. That last clause is the load-bearing one. `opacity` does not inherit, so a
`var()` whose property is set by nothing and whose read has no fallback is *invalid at
computed-value time* and the property takes its **initial** value — for `opacity`, `1`. That turned
the reduced-motion loader into a solid block at full strength while every grep for the token found
it present. `check-app.py` refuses a `var()` that is declared nowhere, has no fallback, and is not
in `app/README.md`'s interface table.

---

## 4 · Typography

Urbanist for all text. Inconsolata for **every** number, date, year, count and code, without
exception — mixed numeral rendering across a dense table is immediately visible and cheap to avoid.

| Role | Face | Size / line | Weight | Tracking |
|---|---|---|---|---|
| `display-1` | Urbanist | 34 / 1.15 | 700 | -0.02em |
| `display-2` | Urbanist | 26 / 1.2 | 700 | -0.015em |
| `title` | Urbanist | 17 / 1.3 | 600 | -0.005em |
| `title-s` | Urbanist | 15 / 1.45 | 600 | 0 |
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

**A one-line caption over a table is not body prose**, and capping it to 68ch breaks it in two for a
reader who was never going to track back across it. The cap there is *whatever keeps it on one line
at that column's width*, stated in the rule with its reason. The test is the number of lines the
sentence is meant to occupy: more than one and 68ch holds.

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

**Radius** — `4` chip · `6` segmented pill · `8` control · `12` card inner · `16` card · `20` shell
· `999` pill.

`6` exists only for the active pill inside a segmented control: an 8-radius pill in an 8-radius track
with 2px of padding reads as a bulge, because inner and outer curves are concentric only when the
inner radius is the outer minus the inset.

**Elevation is a hairline first and a shadow second.** Depth starts with the ground↔surface step and
1px `--border`; the shadow says how far off the page a thing is, and **there are exactly two
distances**.

```
--shadow-raise: 0 1px 2px rgba(37,37,37,.05), 0 3px 8px -3px rgba(37,37,37,.10);
--shadow-float: 0 1px 2px rgba(37,37,37,.04), 0 8px 24px -6px rgba(37,37,37,.10);
```

*`--shadow-drop` stood beside them — the same elevation as a `filter` rather than a `box-shadow`, for a
composer that was clipped. The composer carries no `clip-path` now, so nothing read it and it went.*

**`--shadow-raise` is a thing that has lifted without leaving.** It is still in the flow and still
pushes nothing aside — a drawing tile coming toward the pointer, a control under the founder's hand.
**It is always paired with the 1px translate that causes it**, because a shadow with no movement is a
thing that grew rather than rose. It is `--shadow-float` at a third of the geometry: offset 8→3, blur
24→8, spread −6→−3, with the contact layer at `.05` rather than `.04` because a 1px lift needs its
contact to read where a floating panel has the ambient doing the work.

**`--shadow-float` is a thing drawn over the page** — out of the flow, anchored to a trigger,
closable. Menus, popovers, the figure viewer's action bar, the row's figure peek.

**There is no third rung, and the reason is measurable.** The one thing that covers the product is the
enlarged drawing, and it sits on `--scrim`. In light the scrim composites to `#838383`, and
`--shadow-float`'s ambient layer over that lands at `#757575` — a **1.1:1** step. A shadow under a
panel on a scrim is a shadow nobody can see. The scrim separates and the hairline draws the edge; the
token is carried there and does almost nothing, which is the honest amount.

**A shadow cannot separate two surfaces of the same colour.** Both tokens are downward-biased with a
negative spread, so they contribute almost nothing at a *vertical* edge, and an elevation shadow needs
a background that recedes. The record floats over cards of its own surface value, and the figure peek
is `--figure-ground` white on a white column in light — both carry `1px --border` on all four sides,
and there the hairline is what draws the edge, not the shadow. **This clause is not a taste rule and
does not lift.**

**A shadow on an ink fill is invisible.** `.btn` takes neither rung: in dark it disappears, and in
light it reads as a button from 2010.

*This section read "elevation is a hairline, **not** a shadow" and "a card that reaches for a shadow
has not earned one" until 2026-09-24. It was right about the second clause and over-general about the
first — it was written when the only floating thing in the product was a menu, and it was then used to
argue three drawing tiles into compensating for a refused shadow with a bare 1px translate. The
refusal was never about the shadow; it was about a card in the layout pretending to float. That is
one rung now rather than a prohibition.*

---

## 6 · Motion

```
--ease:        cubic-bezier(.2, 0, 0, 1);      strong ease-out
--ease-in-out: cubic-bezier(.77, 0, .175, 1);  system-driven movement only

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

`app/` is the component reference: every rule below is implemented in `app/styles/`, with the
reasoning in its own comments. This section carries what a reader cannot get from the CSS.

**The balance bar is neutral, and that is a rule rather than a leftover.** A coloured meter says
*this direction is the good one*; a neutral one says *this is how much*. The points page is the one
place an inventor watches a number move, and it is the last place the interface should imply that
moving is success. It fills with `--text-1` on a `--surface-sunken` track and takes no hue at all.
*This argument outlived the charts it was written for, which is why it is here rather than in §3.*

**The shell.** TIS submark at the leading edge of a **48px top masthead**, inlined with
`fill="currentColor"` so it inverts for free. Content on `--ground`, cards on `--surface`, one working
surface beneath the bar.

**The results surface has a floor, and below it Terrain says so rather than reflowing.** **The
supported floor is 1024px.** Below it the product states that it needs a wider window and stops.

**A result row is ~290px, and it buys back the trip into the record.** It was ~102px with four
fields on it, ~176px once it gained drawings, and it is three bands now — what the document is, who
holds it and when, and what it claims — over a strip of its own drawings. Measured, that takes a
1000px column from five results to about three. **That is the largest single cost in this document
and it is spent on one thing:** four fields could not answer the glance, so the record was opened on
every row and the list was a table of contents rather than a result. A row that settles *not this
one* without a press is worth more than two more rows that cannot.

**The strip is a constant ~104px of it, whatever the patent carries**, and that is a stronger claim
than the fixed four-up grid could make. The grid capped at four because four was what the column
could hold — six would have wrapped, and a strip that wraps makes row height depend on the data,
which is the one thing a scan target cannot have. A horizontal scroller answers that outright:
twelve drawings or three, the row is the same height. **The gap above the strip is half the row's own
block padding**, which is the 2:1 that makes a group read as a group rather than as a caption on the
row below.

**102px on a row, 148px in the record, and the step is still the point.** One size down reads as
subordinate; the row's job is *which of these*, the record's is *this one*. The row's tile ran 64,
then 72, and is 102 now — five across the strip instead of not quite seven, which is what a patent
figure has to be before it is a drawing rather than a kind of drawing. Below about 48px it is a grey
smudge, which is the floor none of them is near.

**Check the step rendered, not declared, because this section had it wrong twice.** It argued
72/104 = 0.69 against 80/104 = 0.77, "where the step starts to go". **Both numbers were the wrong
ones.** 104 was the `minmax()` *floor* of the record grid's `auto-fill`, not a width anything painted:
measured in a 732px record column it packed six columns at **115px**, so the real step was
72/115 = 0.624. The floor is 148 now, which packs **four columns at 177px**, and the step is
102/177 = **0.576** — further from 0.77 than it has ever been. A declared minimum is not a rendered
size, and a ratio computed from one is a ratio about nothing.

**The strip's scroll affordance is a cut tile, not a shadow and not a fade**, and §5's second clause
is the half that still carries it: a shadow cannot separate two surfaces of the same colour, and these
are white tiles on a white row. *§5's first clause used to be the other half. It is not a prohibition
any more, so the argument has to stand without it — and it does, on something neither document said.*

**A fade is theme-asymmetric in the wrong direction.** The gradient would run from the row's own
background to transparent. In light the row is `--surface` `#FFFFFF` and the tiles are
`--figure-ground` `#FFFFFF`, so it is white over white — invisible at the one moment it is needed. In
dark the row is `#1A1A1A` and the tiles are **still** `#FFFFFF`, so it is a near-black wipe eating a
white drawing, and the loudest thing on the row. That asymmetry exists because `--figure-ground` does
not swap, which is a fact about paper rather than a decision anyone is proposing to revisit. A fade is
also only honest if it appears when there is somewhere left to scroll, which costs a scroll listener
on twenty rows or a fourth keyframe.

The track is wider than the column whenever it overflows, so the column's own edge cuts a tile at most
widths. **Measured at the 108px pitch**, swept at 1px from 1080 to 1920: 5.2% of widths are flush and
11.3% show 8px or less of a 102px tile, in three bands — about one width in nine. *The 72px tile gave
8.8% and 18.9% in five bands, so the larger tile roughly halved it.*

*Revisit trigger, named: `@container scroll-state(scrollable: inline-end)` makes the honest
only-when-scrollable fade a three-line change with no listener and no keyframe. It is Chrome 133+ and
not yet in Safari. When it reaches baseline, re-argue the fade on the dark-theme asymmetry above.*

**The columns are 44 / 56, and the record has the larger half.** They were even until the record
moved into the right column; equal halves would then have given the denser column the same room as
the sparser one. The list carries three bands a row and floors at 340px; the record carries eleven
identifiers, an abstract, the claims and the drawings.

**The record's field list is the width-critical thing on the surface.** It is a two-column grid —
label, value — and what makes eleven rows scannable is that the values share a leading edge. Under
about 600px the longest values wrap onto second lines under their own labels, the shared edge stops
existing, and the grid costs a column of whitespace for nothing. Below that it goes single-column,
label above value.

The chain, at a 1440px window:

```
1440 × 0.56 (the record's column)   = 806
     −  32  (the pane's inset)       = 774
     −   2  (the record's border)    = 772
     −  40  (the record body's pad)  = 732   what the field list gets
```

**So the crossing point is a window of about 1203px**, from `0.56W − 74 = 600`. Between 1203 and the
stack the field list is single-column, which is the arrangement working rather than a defect.

**It is a container query and not a viewport one**, and the reason is that the same element is 56% of
a split above the stack and the full width below it — a viewport query would fire at the wrong moment
in both directions.

**The columns stack below 1080**, in the 56px band between there and the floor, list above record.
That is not a third structure: it is the same two regions in the other axis, and the list keeps a
46vh cap so the record it opened sits beneath it rather than off the bottom of the page.

**Above the stack the breakpoints adjust components, never the structure.** A label narrows, the
thumbnail strip fits fewer per row, the field tiles reflow.

**The breakpoints are the viewport's, with three exceptions, and all three earn it the same way**: a
subject that exists in the markup, and a width the viewport does not know.

- `.pref-card` — a settings card is handed whatever width its column has.
- `.rec-body` — the record's field list, §7. The column is 56% of a split or the whole width,
  depending on a breakpoint above it.
- `.rec-head` — the same column, one level up. *Open in IPtech* keeps its glyph and drops its label
  below 520px of head, because four controls and a heading is the row's whole budget.

**A fourth has to argue the same two things.** The count is here rather than in a comment because
"it is the only one" was the claim this paragraph used to make, and it stopped being true in one
pass.
*A container query whose subject was never built does not fail — it sits in the stylesheet looking
like responsive behaviour, and no screenshot at any width can show you that it is not there.*

**The lockup routes home unless there is no home to route to.** On the working screen it scrolls both
columns to the top — both, because the surface has two and returning one is a half-answer. On a
destination it returns to the working screen in the mode that destination's own Back would have used.
On the home surface it is inert.

**The visual does not change between those states**, and that is the constraint everything else
follows from. It stays an `<a>`, keeps its styling and its cursor, and tells assistive tech with
`aria-disabled` rather than by greying out. *A lockup that changes appearance by screen stops being a
fixed point in the chrome, which is the whole of what makes it usable as home.*

**One thing in the masthead is protected by name.** The appearance control stays on the bar at every
width — burying it in a menu is the same loss as dropping it.

**One `<main>` per surface.** Collapsing surfaces is how a screen-reader user loses the landmark they
meet before anything else.

**The composer is one component at one size**, and it appears twice: centred on the home surface, and
above the columns on the results surface still holding what the founder typed. It is inert until
something is typed. **A support field may not wear it** — the composer's identity is *the thing you
type your idea into*, and a second one would claim the help form searches.

**Its primary action sits under it, full width.** Search and *change what you typed* are one decision,
so they are one zone. The send arrow already owns the bottom-right corner, and a right-aligned pill
beneath it reads as a second send.

**One primary action per surface.** A near-black fill (an accent fill, once §3.8 is applied) is what
says *this is the way forward*. Two filled buttons on one screen make the smaller one look like the
way forward. **The primary action of a settings card is never deletion** — where the act is
irreversible, the safe path is the affirmed button and the act is the ghost one, with the weight
carried by the sentence above them rather than by a hue.

**A switch is a claim that the product does the thing when it is on.** Every other invented value in
`demo/` is a grey bar or a figure the reader is told is illustrative; a control carries no such
marking, and nothing about a toggle says *this is a sketch*. Do not add one for a capability that does
not exist.

**There are no widget cards, and no captions.** A caption states a finding, a finding is a reading of
the data, and `brief.md` §1 puts those outside the product. **The info popover survives and carries
explanation only** — what a score is, what *deduplicated by family* means. The test is whether a
screenshot with **no popover open** still says what the founder is looking at; an interface that needs
a popover to be legible is not legible.

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
three state colours is available anyway: red is *expired*, amber is *pending*, green is *live* and
now the accent.

**It takes one hairline at full ink, not the field's doubled edge**, and the difference is scale
rather than principle. A field doubles because it already has a resting border and may not change
width. A block has no resting border to double, and 2px of `--text-1` around something 300px wide
out-shouts the primary action on the same screen. One `--text-1` hairline says the same thing at the
right volume: `--border` is 1.27:1 and reads as furniture, `--text-1` is 15.3:1 and reads as a
statement.

**A failed region silences every count it was about to state.** The list head reads *162 patents
matched · 50 shown*, and both numbers come from the response that did not arrive. Left standing they
are the interface making a claim about data it does not have, directly above a block saying it does
not have it. The same holds for a grouping's branch counts and a record's figure count.

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

`demo/` stands in for an engine, so `app/` shows a populated screen without live data.

**Chrome is real. Identities stay bars. Figures are illustrative.**

| Real English | Grey bar | Illustrative |
|---|---|---|
| Titles, buttons, column headers, empty-state copy, menu rows, field labels | Company names, other project names, the user's own name and address, plan tier, patent and application numbers, IPC symbols, inventors | Counts, relevance scores, filing and publication years |

**`corpus/` is the deliberate exception and it is not in this table**, because it is not illustrative
data — it is real patents, captured, and its whole job is to strain renderers written against
well-behaved shapes. It prints real assignee names, it is excluded from git in its entirety, and it
is **what loads by default when it is present** — `?data=demo` forces the fake engine. `brief.md` §4
carries it.

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

Each is the same exception: **where withholding the value would leave a control with nothing to act
on**, the value is shown and everything around it stays a bar.

- **The year on a list row.** A date sort over a column of grey bars is an order the founder cannot
  check. The control is the argument, not the row.
- **The relevance score.** *Nearest first* over a column of bars is the same defect, and the score is
  the engine's own number rather than one Terrain generated.
- **The one demonstration record.** A record pane of nothing but bars cannot demonstrate a record
  pane. Exactly one is populated, and its field *names* were always real anyway.

*Two others — matrix tone and the filings series — went with the analysis layer. This list has
shrunk rather than grown, which is the only direction it is supposed to move.*

**None of them claims a fact about a party.** A year is a date and a score is the engine's, and
neither names a company.

**The line, stated once:** an exception is admissible when the alternative shows *nothing*, not when
it merely shows *less*. If a fifth is proposed, treat it as evidence the contract is being eroded
rather than extended.

---

## 9 · Icons

**Lucide, and nothing else.** No Heroicons, no Feather, no Material, no one-off SVGs from a search
result. Mixing sets is immediately visible in the stroke weight and the corner radius, and it reads as
an interface assembled from parts.

**Three sizes and each has one home.** 1.5px stroke, round caps and joins throughout.

| Size | Where |
|---|---|
| 16px | controls — buttons, menu rows, the masthead, the figure viewer's action bar |
| 18px | the head of a destination page |
| 24px | a technology-field tile on the home surface, where the glyph is the tile's subject rather than a marker on a control |

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

**32 semantic tokens**, and **this is where that count is argued.** It is printed in three places —
here, `CLAUDE.md`, and `app/README.md`'s tier table — and **a gate keeps them equal to the file**
rather than a sentence asking everyone to keep them equal to each other.

*That gate is the successor to a rule that did not work.* This paragraph used to claim it was the one
place the number appeared, which was false when it was written: the number lived in three files, and
it drifted in all of them. It read 42 while `tokens.css` held 29. **A rule that can only be obeyed by
remembering is not a rule**, so `tools/check-app.py` now parses the semantic block, counts it, and
refuses any printed copy that disagrees — and `tools/test-gates.sh` plants a wrong number and watches
it refuse.

**Counting them by hand is not one command.** `grep -c '^\s*--'` over the light block will not do it,
because the comments are longer than the declarations; the gate parses for `--name:` inside the block
bounds, which is why it is a gate rather than a shell one-liner in a comment.

§3.9 carries the tier it belongs to: the primitives, the scale and the derived three are *not* in it,
and a dark block that redefined one of them would be the bug rather than the contract.
`check-app.py` also asserts that all three blocks carry the same names in the same order.

`html` also moves from `color-scheme:light` to `color-scheme:light dark`, with each `[data-theme]`
pinning its own — that is what makes scrollbars, form controls and the canvas behind the page follow
the theme instead of staying light under a dark page.

**"And no component rule" is true with exactly two exceptions, and they are named rather than
waved at.** `.foot-mark-light` and `.foot-mark-dark` on the attribution line are swapped by a theme
selector reaching into a component class — a **second dark mechanism outside the tokens**. The
sentence is amended rather than the stylesheet, because the alternative is worse: a custom property
cannot carry an `src`, and tokenising the mark into a `background-image` would drop the `alt` on a
third party's mark. The exception is scoped to **those two literal selectors, no glob** — the same
shape as the raster rule — and `check-app.py` gate E refuses a theme selector combined with anything
else.

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
| `--track-pressed` | `#2A2A2A` | — | 17.1 |

**State.** Ink on `--surface`, and ink on its own tint.

| Token | Ink | Tint | On surface | On tint |
| --- | --- | --- | --- | --- |
| `--state-live` | `#84B899` | `#18241D` | 7.71 | 7.10 |
| `--state-expired` | `#D98B80` | `#2A1A17` | 6.59 | 6.32 |
| `--state-pending` | `#C9A45C` | `#251E10` | 7.42 | 7.04 |

**Skeleton.**

| Token | Hex | Note |
| --- | --- | --- |
| `--skeleton` | `#2A2A2A` | |
| `--skeleton-shimmer` | `#343434` | |
| `--skeleton-strong` | `#424242` | |

**The drawings.** Two tokens that behave unlike everything above them.

| Token | Value | Note |
| --- | --- | --- |
| `--veil` | `rgba(255,255,255,.82)` | **does not swap** — it composites over the drawing, not the app |
| `--veil-edge` | `rgba(37,37,37,.12)` | **does not swap** — the surface under it does not, so neither may it |
| `--scrim` | `rgba(0,0,0,.72)` | **does** swap — it composites over the app, not the drawing |
| `--figure-ground` | `#FFFFFF` | **does not swap** — see §3.2 |
| `--figure-ink` | `#595959` | **does not swap** — the paper does not, so the ink on it may not |
| `--figure-ink-strong` | `#252525` | **does not swap** — the raised form of the same |

**Two semantic tokens are identical in both palettes, and both are facts about the content rather
than exemptions.** A patent drawing is black line-work on a transparent background; composited onto
`#1A1A1A` it is a blank rectangle — so `--figure-ground` means *the paper this was published on*,
which has no dark value, and `--veil` sits on that paper and may not swap either. Every other
semantic token means *the surface under our own chrome*.

**`--scrim` is the one that looks like it belongs with them and does not.** It composites over the
app, which does swap, so it swaps. Ink at .55 over `#141414` would dim nothing, which is the one
thing a scrim exists to do. In dark the binding constraint is not contrast — every usable value
clears 20:1 against the white stage — but the other side: enough that the masthead and the list stop
competing for the eye, little enough that the page reads as behind rather than gone.

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
- **The figure viewer has no measured floor.** It takes the viewport less a 24px gutter now, so the
  question moved rather than going away: nothing states the width below which a patent figure stops
  being readable, and the strip's 640px breakpoint is re-derived from the old column figure rather
  than measured against a drawing. Every other dimension in this file is measured; this one is not.
- **Nobody has watched a founder use the lightbox.** The drawing gained roughly four times the area
  and lost the record beside it, and which of those matters more is the kind of thing one session
  with a real user settles and no amount of arithmetic does.
