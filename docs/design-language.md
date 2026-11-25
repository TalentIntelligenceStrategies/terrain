# TIS Terrain — Design Language

> **How Terrain looks.** Tokens, type, space, motion, and the rules a component must hold to.
> What gets built is [`platform.md`](platform.md); what Terrain is is [`brief.md`](brief.md); what
> the engine must return, per component, is [`../design/components.md`](../design/components.md).
>
> Every standalone page carries its own token block, generated from `app/styles/tokens.css` by
> `tools/sync-tokens.py` and checked byte for byte, so a page opened from a download works with nothing
> beside it. `app/index.html` links `tokens.css` instead, because `app/` cannot run from a download
> under any circumstances. A linked font stylesheet locks nothing; a linked token sheet would.

---

## 1 · The read

Terrain is a dense information surface that has to be legible to somebody who has never used one.
Three things follow from that and everything else is downstream of them:

- **Hierarchy comes from weight, size and space, not from colour.** A founder scanning a screen of
  patent data should be able to find the heading, the figure and the caption without a hue telling
  them which is which.
- **Nothing is a reading of what is on screen.** Terrain prints the engine's answer and the patent's
  own text (`brief.md` §1), and a caption states a count or nothing.
- **Nothing pretends to more certainty than it has.** A value we withhold is a grey bar; a field the
  record does not carry is a dash. A wait keeps what is on screen, dimmed, never a fake skeleton. An empty result says what
  was searched.

---

## 2 · The one rule

**Colour carries information, or it is not there.**

**Terrain has no hue of its own.** Everything is the neutral ramp, carrying meaning with hierarchy,
weight and spacing, and the one place colour is permitted is achromatic:

| Where | What it encodes |
| --- | --- |
| **The accent** | the primary action, the focus ring, a selected control, the open row's border — §3.8 |

**The ground is slate, and it carries one light that encodes nothing.** The page ground is the
deck's: `#ECEEF0` in light and `#16191C` in dark, lighter toward the top right in one radial light,
fixed to the viewport so every layer that paints the ground lines up with it (`--ground-light`,
§3.2). It sits on the page ground and nowhere else — never on a card, a row, a sheet or a drawing —
so nothing that is read sits on a gradient. Its tint is hue 248 at a chroma under .015: there to set
the ground apart from the white of a card and the paper of a drawing, not read as a colour, and the
only tinted values in the system. **The deck and the product share it**, which is why it is taken
exactly rather than redrawn on the ramp.

**Legal status is a word, never a coloured chip.** The record prints *Active*, *Expired* or
*Pending* in the text colour of the facts row; a live / expired / pending hue would be the one colour
on the screen and would read as a verdict on the patent. §3.3 and §3.5 are retired and their numbers
are not reused.

**A hue is an amendment, not a design task.** The tokens are gone rather than parked, so a hue means
declaring a semantic token in all three theme blocks, measuring it against both grounds, and arguing
it against this section, which is the friction this rule is for. **A view of the set is not an
amendment** ([`brief.md`](brief.md) §1 admits one) **but a hue for one is**, on the same terms. A
view draws from the neutral ramp: *Group by topic* is words and counts, and a chart, when one is
built, is `--text-2` bars told apart by position and label, never by colour.

**Colour would encode direction, never desirability.** Whatever earns a hue next — a state, a
direction — earns it as information. Nothing is green because it is good.

**The accent is a control's colour, not a verdict about data**: it is achromatic precisely so it
cannot be read as one, and it may not fill or tint a score, a rank or a count. The open row's border
marks a state of the interface, not a property of the patent (§3.8).

**Never colour alone.** A coloured element would also carry a word or a shape: a dot plus a label, an
arrow plus a number. The one hue on any Terrain surface today is a third party's, Innovue's blue
inside the Innovue mark (§3.8), and it is a logotype rather than a signal.

---

## 3 · Colour

**The subsection numbers are stable across retirements.** §3.4 was the density ramp and §3.7 was the
categorical marks; both went with the analysis layer, and their numbers are not reused. A number that
gets reassigned turns every reference to it in the code, in the other documents and in this file's
own prose into a silently wrong pointer rather than a visibly missing one.


### 3.1 · Neutral ramp

Perceptually even in L*, **true neutral — no hue at all, R = G = B**. The ground, its hairline and
the quietest text sit beside the ramp rather than on it: they are the deck's slate (§2), and §3.2
gives their values.

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
| `--ground` | `#ECEEF0` | page background, slate |
| `--ground-light` | radial, `#FFFFFF` → `#F2F3F5` 34% → `#E4E6E9` 70% | the ground's one light, at 86% 16%, fixed — §2 |
| `--surface` | `--n-0` | cards, menus, popovers |
| `--surface-sunken` | `--n-3` | input tracks, table headers, segmented tracks |
| `--border` | `#D0D4D8` | every hairline, 1px; slate, 1.49 on surface |
| `--edge-silver` | 135°, `#3A4148` 0% · `#C9D0D6` 30% · `#4A5158` 55% · `#9AA2AA` 80% · `#3A4148` 100% | the silver edge, 2px — §3.8. **Does not swap** |
| `--border-strong` | `--n-5` | active edges |
| `--focus` | `--n-10` | 2px ring, 2px offset |
| `--text-1` | `--n-10` | 15.3 on surface |
| `--text-2` | `--n-8` | 6.99 |
| `--text-3` | `#5F666D` | 5.82 on surface, 5.11 on sunken, 4.65 on the ground's darkest stop |
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

**A component may thin a semantic token with `color-mix(… transparent)`, and only to sit under a
blur.** That is three places, all on a phone: the masthead, the record's head bar and its action bar,
each `backdrop-filter`ed at 12px over the content scrolling beneath. Mixing a semantic token keeps the
swap: the result follows the theme the way the token does, which a raw `rgba()` would not. A hover is
not a site: a control's or a row's hover is the flat `--surface-sunken` fill, and a drawing tile,
which is paper, darkens its edge instead. A fourth site is an amendment to this
paragraph.

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

**There are exactly two scrims, and each is a layer laid over the founder's place without moving
it.** The figure viewer is a lightbox over the viewport, because capped at one panel of a two-panel
split it is too small for the reference numerals a founder enlarges a drawing to read. **On a phone
the search sheet opens over the list** (§7), because a sheet that pushed the list would lose the
founder's place in it. Both are a thing on top of the set, and the dim says the set is still there.

**Everything else dims nothing**, and the list is the rule rather than an anecdote: the record opens
in its own panel (on a phone, a full screen that slides in rather than a dimmed card), search
settings, grouping and sorting are popovers, and every menu closes on an outside click the document
hears for itself. `--scrim` has two readers. **A third is a sign this rule has stopped holding**, not
a sign the token turned out to be useful.

`--text-3` is darker than it looks like it should be. It carries the 11px micro-labels, which are
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

### 3.3 · State colours — retired

*It held the live / expired / pending hues. Legal status prints as a word (§2), so they have no
reader.*

*§3.5 was chart layers and is retired, and `--chart-series` with it. A view of the set draws from the
neutral ramp (§2). §3.5's number is not reused, for the reason §3 opens with.*

### 3.6 · Skeleton

| Token | Value |
|---|---|
| `--skeleton` | `--n-4` |
| `--skeleton-shimmer` | `--n-3` |
| `--skeleton-strong` | `--n-5` |

**`--skeleton-strong` is a bar the founder has acted on**, such as the open row's withheld holder.
It is a state, not a second grey.

### 3.8 · The accent

**Terrain's accent is achromatic** — the ink pair, near-black in light and near-white in dark.
[`brief.md`](brief.md) §5 is the decision and carries the reasoning; this section is how it behaves.

**Four tokens, all themed:**

```
--accent             the fill
--accent-ink         text and glyphs on that fill
--accent-hover       hover on an accent fill
--accent-on-surface  the accent as ink, on --surface
```

**They hold ink values and are still four tokens, because the accent is a role and not a hue.** The
sites below have to be able to *say* they are the accent. A site that read `--text-1` would
leave this section pointing at nothing, and the rule would stop being enforceable the moment somebody
added a site.

**The fourth exists because two of the three sites do not want a fill.** The selected technology tile
keeps `--surface` because a filled accent tile would be a second primary action on a surface that
already has Search, and the settings panel's segmented control is a pill on a track. Both put the
accent on `color`, which is a foreground job, so the foreground has its own token rather than a second
job for the fill token.

**`--accent-hover` is the third, not a spare.** `--ink-hover` is one step along the neutral ramp, the
correct hover for a near-black fill. The two agree today and stay two tokens, because one answers
*how does an ink fill hover* and the other *how does the accent hover*, and those remain two questions.

**`--focus` is derived from `--accent`, not declared beside it.** One declaration moves the primary
fill, the selected control and the ring together, which is what makes site 2 below true by
construction rather than by discipline. §3.9 carries the tier.

**Where it appears: four places, and they are the whole list.**

1. **The primary action.** One filled button per surface, never two: Search, on home and in the search
   panel.
2. **The focus ring.** `--focus` becomes the accent rather than ink.
3. **The selected state of a single-select control**: a pressed segment, a checked menu item, the
   current drawing in the viewer's strip. One of N is chosen, and the accent says which.
4. **The open row's border.** The result whose record is open takes a 1px `--accent` border in place
   of `--border`. It says *you are here*, which is a state of the interface, and it is the only thing
   that makes ← and → legible when the record has no head bar.

**A multi-select chip that is on is not one of N, and takes no accent.** It takes `--border-strong`
and a tick in `--text-1`. Six offices on at once in the accent would be six ink outlines, the
heaviest thing in the panel and heavier than the primary action beside it.

**A ring means focus and nothing else.** A selected tile changes its edge at 1px and its ink; the
2px ring at an offset is reserved for focus, so a selected tile that also has focus shows both, and
one that is only selected never looks focused.

**Where it may not appear:**

- **In data.** Not a score, not a rank, not a count. §2 permits the accent in controls and in the one
  state above, and nowhere else.
- **As decoration.** No wash, no tinted card background, no accent border but the open row's, and no
  gradient but the two named ones: the ground's light (§2) and the silver edge below. *A mask is not
  a third*: it paints no colour, only fades what is already there. The docked phone search fades its
  one-line sentence at the trailing edge with one, and that is the only mask.
- **Anywhere it could be read as a verdict.**

#### The silver edge

**The deck's silver edge marks the engine's two outputs a founder acts on: the order, and the
number it is read by.** A 2px border drawn with `--edge-silver` behind the control's own fill,
clipped to the border box, so no wrapper carries it:

```
border: 2px solid transparent;
background: linear-gradient(<fill>, <fill>) padding-box, var(--edge-silver) border-box;
```

**Two sites, and they are the whole list:**

1. **Find similar**, on the open record. On a phone it carries its label beside the icon: an edge
   on a bare icon reads as a pressed toggle.
2. **The relevance score chip** on every row. The edge is the same on every row, whatever the value,
   so it frames the number as the engine's and never ranks one row's number above another's.

**Export this record, Export results, the CSV | Markdown pair and Search have none.** Export is a
way out, not an engine output, and takes the plain 1px `--border-strong` of every other control;
Search is the filled primary already, and an edge on an ink fill merges with it on one half and with
the panel on the other. **The home composer has none**: it is a panel in the results surface's
language, edged with `--border` like the search panel.

**It is the same in both themes, and reads from whichever half contrasts.** On the dark ground the
`#C9D0D6` and `#9AA2AA` stops carry it (5.01:1 or more) and it reads as silver; on the light ground
the `#3A4148` and `#4A5158` stops do (6.44:1 or more) and it reads darker.
**It is not a state, and it changes no box's size.** The 2px comes out of the control's padding.
**Focus turns the edge solid** (`--focus`) in place of a ring outside it, so focus and the edge are
never two rules side by side. Hover changes the fill, never the edge. Under `prefers-contrast: more`
the edge is a solid `--text-1`. **A third site is an amendment**, argued against this section,
because an edge on every control is an edge on none.

**What being achromatic buys.** It can never be read as data, and it needs no separately measured
dark value: the ink pair inverts with the theme and §10.3's ink rows already carry its contrast. **A
future hue would have to answer both** — a meaning that is not *press here*, and its own measurement
against `#1A1A1A` — and §2 is what it would be argued against.

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
| **semantic** | 29 | **all three blocks** | This is the dark contract. §10.1. |
| **derived** | 1 | `:root`, once | Resolves *through* a themed token, so it inverts for free. **Never add one to a dark block.** |
| **component-scoped** | 2 | on the component's own class | Never on `:root`, never read outside that component. |

**The file is ordered by theme-variance, not by document section**, so *the three blocks carry the
same names in the same order* is a one-line assertion and **added to light, forgot dark** is
impossible to commit. The cost is that `--shadow-float` sits under §5 here and in the themed half
there; that mismatch is exactly why the file is not organised by §.

**The derived one** is `--focus`. A literal for it inside a dark block would pin the value to one
palette **while reading as perfectly correct CSS** — the same failure mode as a component reading a
primitive. It re-reads `--accent` at use time, so the one accent declaration gives the focus ring
both its values. The tier stays a tier with one member, because the rule it carries — never in a dark
block — is the one a second derived token would need.

**The component-scoped two** are `--gut`, the record's inline gutter, and `--fill`, the fill a
silver-edged control paints behind its edge. They are declared on the record's own classes because
that is their scope: the record's gutter is not a fact about the interface, and putting it on `:root`
would invite a second component to read it.

**A component-scoped token is read with a fallback wherever its property does not inherit.** A
`var()` whose property is set by nothing and whose read has no fallback is *invalid at computed-value
time*, and the property takes its **initial** value, silently. `check-app.py` refuses a `var()` that
is declared nowhere, has no fallback, and is not in `app/README.md`'s interface table.

---

## 4 · Typography

Urbanist for all text. Inconsolata for **every** number, date, year, count and code, without
exception — mixed numeral rendering across a dense table is immediately visible and cheap to avoid.

**Eleven sizes, and each is a role: 11 · 12 · 13 · 14 · 15 · 16 · 18 · 20 · 24 · 26 · 36.** They
are the round 4 detail lab's (V8), which is the look `app/` is built from. A dense working surface
needs more steps than a page of prose: a chip, a control, a fact and a reading line sit side by side
in one card, and each has to be told apart by size as well as weight. A size that is not one of the
eleven is a role nobody named, and `tools/check-app.py` refuses it. The one exception is the
wordmark, which is brand and not text.

| Step | Role | Face | Size / weight / line | What carries it |
|---|---|---|---|---|
| 36 | `display-1` | Urbanist | 36 / 600 / 1.15 | the home headline, and nothing else |
| 26 | `display-2` | Urbanist | 26 / 600 / 1.2 | reserved for a full-page record's title |
| 24 | `title-l` | Urbanist | 24 / 600 / 1.2 | the record's title, at every width |
| 20 | `title` | Urbanist | 20 / 600 / 1.3 | every panel and section heading: *Search results*, *Drawings*, *Abstract*, *Claims* |
| 18 | `title-row` | Urbanist | 18 / 600 / 1.3 | the row's title |
| 18 | `lead` | Urbanist | 18 / 400 / 1.45 | the search sentence |
| 16 | `title-s` | Urbanist | 16 / 600 / 1.4 | the empty record's heading, a popover's heading |
| 16 | `prose` | Urbanist | 16 / 400 / 1.55 | the record's abstract; what is typed into a field. Claim 1 at 18 / 1.6, every later claim at 15 in `--text-2` |
| 15 | `body` | Urbanist | 15 / 400 / 1.5 | a fact's value in the row, the facts row and the side panel; the holder at 500 |
| 14 | `body-s` | Urbanist | 14 / 400 / 1.55 | the row's abstract, menu text, the empty record's sentence, release notes |
| 15 | `control-l` | Urbanist | 15 / 600 / 1 | the results surface's Search, the record's actions, *Show all* |
| 14 | `control` | Urbanist | 14 / 500 / 1 | every other button label: the list head, menus, *Reset*, *Done* |
| 13 | `control-s` | Urbanist | 13 / 500 / 1 | the masthead, chips, tags, segments, the scope row's two controls, everything on home's composer |
| 13 | `meta` | Urbanist | 13 / 400 / 1.4 | the kind line, counts, *expires*, help, a tip; `--text-3` |
| 11 | `label` | Urbanist | 11 / 600 / 1.3, tracked .08em | **every field name**, in small capitals by style over sentence-case markup, `--text-3` |
| 12 | `caption` | Urbanist | 12 / 400 / 1.35 | CPC's class words, the source note, a menu item's second line |
| 15 | `figure` | Inconsolata | 15 / 500 | a number, date or code that *is* the value: the patent number, dates, class codes |
| 13 | `figure-s` | Inconsolata | 13 / 400 | a figure that is metadata: the viewer's number, the similar tag, the version, a count |
| 11 | `figure-xs` | Inconsolata | 11 / 500 / 1 | a drawing's published number on its tile |

`font-variant-numeric: tabular-nums` on every Inconsolata run, so columns of numbers align and
figures do not jitter when they change.

**Weight descends with level** from the titles (600) to the prose (400). A control sits at 500,
except the three that commit something on the results surface (Search, the record's actions, *Show
all*), which take `control-l` at 600, as the lab draws them. 700 belongs to the wordmark and nothing
else.

**Claim 1 is set larger than the claims after it**, at 18, and every later claim at 15 in
`--text-2`: claim 1 is the broadest claim and the one a founder reads first, and the dependent claims
under it read as its detail.

**A field name is one role everywhere**: `label`, 11/600, tracked .08em and in small capitals by
style, `--text-3`, over or beside its value, in the row's facts, the record's facts row and side
panel, the settings, a popover's kicker, and home's field label and coverage heads. The markup stays
in sentence case, so a screen reader and a copied value read words. The scope chips are the one
exception, a name and a value on one line at 13. One job in two looks reads as two kinds of
information.

**In the row's facts the holder alone keeps `--text-1` at the full line**: it is the fact a founder
reads first and sorts by later.

**What a founder types is 16 or more.** The composer is 18 in the search panel and every input is at
least 16, which is also the size iOS does not zoom a page to edit.

**A role is one class, never two.** Each `figure-*` carries the family, the numeric setting and the
weight along with its size, because a role split across a base class and a size class is a role that
only works when both are spelled — and nine sites spelled one. *This is the failure mode a preview
cannot show you: a numeral in the wrong face at the right size is still a numeral, and the alignment
it loses with `tabular-nums` only shows up in a column someone happens to be reading down.* Check it
by reading the computed style, not the page.

**The secondary-figure treatment.** In a `figure-l`, a suffix, denominator or
decimal drops to weight 400 at 55% opacity: `194` stays full, `/ 381` recedes.

**Measure is capped at `68ch`** for body prose — **and a measure rule only holds where something
declares it.** No preview will tell you which containers are missing the cap; the two most-read
sentences in the product ran at ~88 and ~95 characters for a month inside a card that looked like it
had a measure discipline.

**A one-line caption over a table is not body prose**, and capping it to 68ch breaks it in two for a
reader who was never going to track back across it. The cap there is *whatever keeps it on one line
at that column's width*, stated in the rule with its reason. The test is the number of lines the
sentence is meant to occupy: more than one and 68ch holds.

**A label that heads a box is not a label inside it.** The side panel's group heads (*Parties*,
*Identifiers*, *Classification*) are `label` at `--text-2` with a 12px gap, so they sit one step
above the field names inside them without becoming a heading.

**The product is English only.** No `data-zh`, no bilingual markup, no CJK face.

### Case, and who owns it

**Two kinds of text reach the screen, and their case is owned in two different places.** What we
write, the interface owns. What the patent offices filed, the engine owns: the same search returns
titles in capitals, in sentence case and in title case, and the same company in two spellings, because
the offices store them that way. **No component converts the case of patent data.** A converter would
print *Tsv* and *Ibm* wherever it guessed wrong, so the engine returns data already cased and the
interface prints what it gets.

**What we write:**

| Kind | Case | Example |
| --- | --- | --- |
| Page and section titles | Sentence case | *Search results* |
| Buttons, menu items, tabs, chips | Sentence case, verb first when it acts | *Find similar*, *Export this record*, *Group by topic* |
| Small field and section labels | `label`, written in sentence case and set in small capitals, three words at most | *Number*, *Where to search* |
| Subtext, help, empty states | Sentence case, whole sentences | *Select a patent* over *Its full record opens here: the drawings, the claims and every field, as published.* |
| Counts | A figure and a word | *50 matched*, *Show all 22 drawings* |
| Engine values | The engine's own label, then the figure | *Relevance score 0.8862*, *#1* |

**One role is uppercase by style, and only that one: the field name.** It is how the lab and
Innovue's live home both set it, and a small tracked capital is what keeps a field's name from being
read as its value at 11px. Nothing else is uppercase by style, and the text itself is never written in
capitals: capitals in the source reach the screen only where the source has them, an office code, a
class symbol, an acronym in a title.

**What the engine returns:**

| Kind | Rule | Example |
| --- | --- | --- |
| Patent titles | Sentence case, acronyms kept | *Semiconductor package having a heat spreader* |
| Holders | One form per company, as the company writes itself; variants merged | The company's own spelling, once, not the filing's all-caps form beside it |
| Inventors | Normal case, as the person writes their name | Given and family name in normal case, never all caps |
| CPC class words | As CPC publishes them, after the code | *H01L · Semiconductor devices* |

**Lists of people and holders are separated by `; `**, a semicolon and a space. A name can contain a
comma, so a comma cannot be the separator.

**Offices are codes where they are data**: the scope chip (`US · CN · TW · EP · KR · JP`), the
coverage table and both exports, all through `core/format.mjs`. Codes are what patent numbers already
carry. **Two places print the name**: Search settings, where it labels a choice, and the record's
*Where* cell, where it answers a question in a sentence's place (*United States*).

**Codes, numbers and dates are Inconsolata**: *2015-04-07*. **A classification symbol is printed with
one space between the subclass and the group**, *H01L 23/36*, as CPC and both builds print it, so the
subclass a founder groups by reads as its own word. The source link and the exports carry the symbol
as the record holds it.

---

## 5 · Space, radius, elevation

**Space** — `2 4 6 8 10 12 14 16 20 24 32 40 56 72`. Two-based below 16, four-based above. Nothing
off-scale.

**Group gaps are at least twice the gaps inside the group, or the grouping does not read.** The scale
is what makes this cheap to get right: **there is no 28**, so one step up from 24 is 32, and the
temptation to split the difference is the temptation to add a step.

**Radius: four, each with one kind of thing, and concentric where they nest.**

| Token | Value | What takes it |
|---|---|---|
| `--r-shell` | 20 | a panel on the results surface: the search panel, the list, the record |
| `--r-widget` | 16 | the drawing viewer's panel, and home's field cards, composer and coverage (Innovue's home) |
| `--r-inner` | 12 | a thing inside or over a panel: a row card, a popover, a large drawing tile, a toast |
| `--r-control` | 8 | a control, a chip, a tag, a drawing tile, an input, a segmented control's track |
| `--r-seg` | 6 | a thing inside an 8 or a 12: the masthead's controls, home's segments, a record action's well |
| `--r-chip` | 4 | home's *Coming soon* badge, a skeleton bar |

**A segment or menu item takes its container's radius less the inset**, written as that sum in the
CSS rather than as a token: a segment in an 8 track with 3px of padding is 5, a menu item in a 12
popover with 6 is 6. Inner and outer curves are concentric only when the inner radius is the outer
minus the inset. **The pills are the viewer's**: its tools, its tool bar and home's phone field chips
are round, as the lab and Innovue draw them, and so is the version's unread dot.

**Control heights: four, and a control takes the one its role names.** The masthead is Innovue's;
the results surface under it is the lab's, value for value; home is Innovue's.

| Height | Role | What takes it |
|---|---|---|
| 28 | compact | the masthead's controls, chips (rank, score, the topic tag) |
| 32 | chip | the scope chips, and the scope row's two controls, *Search settings* and *Export*; the viewer's tools |
| 36 | standard | Search, *Text / Patent number*, the list head, menu items, inputs, *Done*, *Reset*, the viewer's previous and next; on home, Search and the mode's track |
| 44 | large and touch | the record's actions and *Show all*; every control below 640px |

**A segmented control's segments are its height less twice the track's padding**: a 36px track with
3px of padding holds 30px segments, home's 36px track with 2px holds 32, and the masthead's 28px track
with 2px holds 24. A standalone icon button is square at its role's height; a tag's remove button is
22, and nothing smaller is admissible at any width.

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
closable. Menus, popovers, the figure viewer's panel and its action bar.

**There is no third rung, and the reason is measurable.** The one thing that covers the product is the
enlarged drawing, and it sits on `--scrim`. In light the scrim composites to `#838383`, and
`--shadow-float`'s ambient layer over that lands at `#757575` — a **1.1:1** step. A shadow under a
panel on a scrim is a shadow nobody can see. The scrim separates and the hairline draws the edge; the
token is carried there and does almost nothing, which is the honest amount.

**A shadow cannot separate two surfaces of the same colour.** Both tokens are downward-biased with a
negative spread, so they contribute almost nothing at a *vertical* edge, and an elevation shadow needs
a background that recedes. The record and the result panel are `--surface` on a `--surface` column,
and the figure viewer's panel is `--figure-ground` white against a light scrim — all three carry
`1px --border` on all four sides, and there the hairline is what draws the edge, not the shadow.
**This clause is not a taste rule and does not lift.**

**A shadow on an ink fill is invisible.** `.btn` takes neither rung: in dark it disappears, and in
light it reads as a button from 2010.

*The refusal is not of the shadow; it is of a card in the layout pretending to float. A floating
thing takes one rung, a card in the layout takes none, and a drawing tile does not compensate for a
refused shadow with a bare 1px translate.*

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
| Constant motion — the skeleton shimmer | `linear`, no token |

The middle row is narrower than it looks. `cubic-bezier(.77,0,.175,1)` is flat for its first half —
it *is* an ease-in at the start — so it is confined to movement no one is waiting on. Anything
triggered by a pointer or a key takes `--ease` and begins moving immediately.

**The view swap.** The leaving view goes to `opacity: 0` and `translateY(-4px)` over `--dur-2`; the
arriving view starts 120ms later at `opacity: 0` / `translateY(6px)` and lands over `--dur-3`.
**Exit is faster than enter** — the founder has already decided to leave, and the system should look
like it is responding rather than deliberating.

**Motion is restrained everywhere.** Nothing animates on a return visit, and nothing animates on a
keyboard action. **A control presses to `.96`** on `:active`, and **a popover fades and scales in from
`.97` out of the corner of its own button**, faster out than in; under reduced motion both stay at
full size.

### What a wait looks like

**There is no loader.** A wait is shown by what is already on screen, and nothing moves to show it.
The answer appears when it arrives; nothing holds it back to make a wait legible, and nothing plays
while it is coming.

**What waits is what the request changes, and it says so in its state, not in motion.** A search: the
Search button stays labelled, takes `aria-busy` and reads at reduced ink, and the rows already listed
stay where they are, dimmed, with `aria-busy` on the list, until the new rows replace them. The elapsed
time beside the scope clears until the new result lands, because the old figure is about a search that
is no longer on screen. A record: the open sheet dims in place until the next one replaces it. A sort,
*Find similar* and *Restore* keep the rows standing and mark the control that was pressed busy. *Group
by topic* filters rows already held and waits on nothing.

**The region reserves its height while it waits**, so the arrival is one change rather than a collapse
and a second reflow.

**A screen reader hears the wait once and the outcome once**, through the two live regions (§7); the
busy state is what a sighted founder sees in the same moment.

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
  without closing the first crossfades the body on `--dur-1`; re-running the entrance would be motion
  claiming something arrived when nothing did.
- **Three keyframes, and the bar for a fourth is high.** `sweep`, the skeleton's shimmer, is
  constant motion with **no end state to transition to**. `rc-arrive` and its phone form `rc-fade`
  are the record's entrance on a sheet that has just been inserted, which has no committed start
  state for a transition to leave from. **The test for a fourth — could a transition have done this?**
  For anything with a start state and an end state on an element already in the page, the answer is
  yes, and the answer to whether it may be a keyframe is then no.

### Two ways a correct spec gets defeated

Both were real, both were invisible in review, and neither would have failed a screenshot.

1. **A start state that was never committed.** Removing a class, forcing a reflow and re-adding it
   does not snap an element to `opacity: 0` — the same style change that applies the start state also
   applies the transition, so the element animates *towards* zero and gets retargeted from wherever it
   reached. Commit the start state with transitions suppressed for one frame, then restore them.
2. **Setting up an entrance on a hidden element.** A view still `visibility: hidden` when the entrance
   class lands never runs it. Wait a frame.

Fixing either alone leaves the other.

### Lists and records

**Motion says what a request did to the rows, and the request decides it — never the control that
was pressed.** Four cases, and each has one motion:

| The request | What the rows do |
| --- | --- |
| **The surface's first list** | Land with the view. The view is still arriving, so the rows do not stagger on top of it. |
| **A new set**: a search, a topic | Arrive in a stagger: opacity and 6px of rise on `--dur-3`, 30ms apart, **the first eight only**. The ninth row is below the fold on every supported window, and a stagger that kept counting would make the last visible row wait on rows nobody can see. |
| **The same set in another order** — a sort, *Restore*, *Find similar* | Each row moves from where it stood to where it is (FLIP, on `transform`, `--dur-3`). Only rows whose old or new place is inside the scrollport move; a row travelling from off-screen to off-screen is a blur, so it lands. A sort keeps the rows standing while the engine answers and marks *Sort* busy. |

**The record arrives once.** The open that brings it into the column takes the view swap's entrance —
opacity and 6px of rise on `--dur-3` — and its exit on `--dur-2`. It never slides: the record is the
panel, not a drawer over it, and a slide reports a place it came from. **On a phone it does slide**,
in from the right over `--dur-3`, because there it is a screen of its own laid over the list, and
Back reverses it. **Its text waits for it to
land**, so a fast answer is held to the end of the entrance rather than fading in inside a panel still
rising. Opening another patent or stepping finds the panel in place, and only the body crossfades, on
`--dur-1`.

**The stagger is a delay set from JavaScript on a transition, not a keyframe.** It has a start state
and an end state, so §6's keyframe test answers it. The start state is committed with transitions off
and released on the next frame, and the delay is cleared once it has run so the row's later
transitions do not inherit it. `motion.mjs` holds `enter()` and `flip()`; both do nothing under reduced
motion.

### Reduced motion

**Flat, never absent.** A founder who asks for less movement has asked for less movement, not for
less information, so every rule below keeps what the motion was saying and drops only the travel.

- **One blanket rule stops it.** `99-reduced-motion.css` sets `transition-property: none` and
  `animation: none` on everything, and it **loads last**, because the end states under it are
  same-specificity overrides and order decides. It carries no `@layer`: inside a layer `!important`
  reverses, and the blanket stop would become the weakest rule in the sheet.
- **Every end state is declared outright.** Nothing depends on a transition having run, and nothing
  waits on `transitionend` to finish a state — a transition that never ticks would leave a view at
  `opacity: 0` and the screen blank.
- **Motion started from JavaScript checks `reduced()` and does not start.** A stagger, a FLIP, a
  smooth scroll: each reads the preference live through `motion.mjs`, never from a copy cached at
  parse time, and goes straight to its end state.
- **Information survives.** The open row keeps its border, the shimmer goes flat rather than off,
  and a busy control or region keeps its reduced ink.

**JavaScript knows the durations.** `motion.mjs` exports `DUR1`–`DUR4` beside the tokens, because
code that hides a node after its exit has to know when the exit ends. A hide waits its duration plus
20ms, never a literal typed at the call site.

---

## 7 · Components

`app/` is the component reference: every rule below is implemented in `app/styles/`, with the
reasoning in its own comments. This section carries what a reader cannot get from the CSS.

**The shell.** The page is the slate ground (§2) with its one light. On it, a **56px masthead**
with a 24px inline inset and a 1px `--border` hairline along its foot, so it reads as the page's top
edge rather than floating over the gradient. Every control in it is one
recipe, Innovue's: **28px, `control-s` 13/500, `--r-seg`, a 14px glyph, 8px of inline padding**. The
TIS submark at 24px, inlined with `fill="currentColor"` so it inverts for free, beside *TIS Terrain*
sized to that row (15px; *TIS* at 700, *Terrain* at 400 in `--text-2`); *New* and *History* as quiet
text buttons with their glyphs; and at the trailing end the appearance control as three 24px icon
segments in a 28px track, and the version in the figure face at 13/500 `--text-3`, with a 6px
`--text-1` dot while the build is new to this browser.

**Panels are the one container.** A panel is `--surface` with a 1px `--border` and `--r-shell`;
there is no card inside a card. The results surface is three panels on the ground (the search
across the top, the list and the record below it, side by side) 16px from the window and 16px
apart. The home surface puts its composer and its coverage in the same panel.

**The search panel sits 16px under the masthead's hairline**, the same 16 the panels keep from the
window and from each other, **and is two rows.** The first: the sentence in `lead` (18/400), growing
from one line to two and then scrolling, with the *Text / Patent number* segmented control and the
filled **Search** at its trailing end, both 36px tall (Search in `control-l` 15/600 with an 18px glyph,
`--accent`). The second, under a 1px `--border` rule: the scope as chips (32px, 1px `--border`,
`--r-control`), each a name at 13/400 `--text-3` and a 13/500 value, then the elapsed time in
`figure-s` at `--text-3`, then **Search settings** and **Export**, 32px and 13/500 like the chips.

**The list is a panel whose body is the ground.** Its head is 60px on `--surface`: *Search results*
in `title`; **the ⓘ as a bare 24px glyph, not a button with a fill**, that only darkens under a
pointer and shows its sentence on hover or focus; and *Details / Drawings only*, *Group by topic* and
the sort at the standard 36. Export is not in the head above 640px. Under it the body scrolls on
`--ground`, and **each result is its own soft card**: `--surface`, a 1px `--border`, `--r-inner`, 20px
of padding on the block and 15px on the inline edges, so with the border and the list's 8px inset its
text starts 24px in, the record's gutter. The open result's border is `--accent` (§3.8).

**The row's anatomy**, top to bottom: the number line (number in `figure`, the kind in `meta`, the
source glyph as a link named for where it goes, *Open on Google Patents*), with the **rank chip** and
the **score chip** (28px, 15/500 Inconsolata, the score with the silver edge, reading *Relevance score
0.8862*) at its trailing end; the title in `title-row`, two lines at most; the facts grid under a 1px
`--border` rule, its cells divided by hairlines, each a `label` over a `body` value (`figure` for the
date and the class); the abstract in `body-s` `--text-2`, three lines; the drawing strip, 92px tiles
on `--figure-ground` with `--r-control`, each with its published number in `figure-xs` in the bottom
left. **A tile's focus ring is drawn inside its edge**, so the strip's overflow never cuts it.

**One height per title length.** The score and the rank are inline on the number line and the title
is clamped to two, so a row is one of two heights whatever the patent and whatever the engine
returned. For a surface whose whole job is scanning, that is the target.

**The strip scrolls and never wraps, and what is off the end is a cut tile**, not a shadow and not a
fade. A shadow cannot separate two surfaces of the same colour, and these are white tiles on a white
card; a fade is theme-asymmetric in the wrong direction, white over white in light (invisible when it
is needed) and a near-black wipe over a white drawing in dark. **The tile is cut by the card's edge,
never by its padding**: the strip bleeds through the card's inline padding and scrolls back to it with
`scroll-padding-inline`, so the first tile aligns with the text above it at rest. No scroll snap,
because snapping resolves every rest position flush and deletes the affordance.

**The record is a panel with no head bar on a wide screen.** A 36px × sits in its top corner. The
identity is an eyebrow (number in `figure`, kind in `meta`), the title in `title-l` and the holder at
16/600; the actions sit beside it on a wide panel and under it on a narrow one, 44px tall in
`control-l` 15/600, each glyph trailing in a 32px well at `--r-seg`: **Find similar** (the silver
edge), **Export this record** (a 1px `--border-strong` edge, a menu of CSV and Markdown) and **Open in
IPTECH** as a quiet text button with its glyph. The **facts row** is four cells
divided by hairlines between two rules, each a `label` over a `body` value (`figure` for a date).
**Drawings**: a lead tile across two rows and two columns, eight more in a grid, all on
`--figure-ground` with a 1px `--border`, `--r-control` and the published number, then *Show all 22
drawings*, 44px in `control-l`. **Abstract** in `prose`; claim 1 at 18 and the claims after it at 15
in `--text-2`, the claim numbers in a `figure` gutter at 14; then *Show all 20 claims*. The **side panel**, about 300px, beside the abstract on
a wide panel and after the claims on a narrow one: group heads in `label` at `--text-2`, label/value
rows (`label`, then `body`, `figure` where it is a code or date), the inventors in two columns, and the
classification as `<details>` rows 44px tall (the subclass in `figure` at 14, CPC's words in
`caption` `--text-3`, the count at the trailing end), the main class at full ink in its group, and the note in
`caption` closing it.

**A dash is a field the record lacks.** `—` in `--text-3`, in the field's own face, in the field's own
cell; never a bar (a bar is a value withheld) and never an empty cell (which reads as broken).

**The empty record says what will be there.** A 48px square with the `panel-right-open` glyph at 24,
then *Select a patent* in `title-s` and one sentence in `body-s` `--text-2`, centred in the panel.

**Popovers anchor to their button** (`--surface`, a 1px `--border`, `--r-inner`, `--shadow-float`),
in from the button's corner (§6). A menu pads 6 and its items are 36px at `control`, its radius less 6; a panel
of fields (the search settings, the release notes) pads 16. The search settings are a 560px popover in
two columns: each field a `label`, its value in 14, its help in `meta`, with *Reset* and *Done* in its
foot; a multi-select chip rests on `--border-strong` and when on takes a `--text-1` edge and a tick, never a fill (§3.8), and the segmented
controls hug their content. *Group by topic* a 340px menu, scrolling past 360px, each topic a
`menuitemradio` with its code in `figure` at 14, CPC's words on a second line in `caption` and the count
at the trailing end. A chosen topic or a similar order is a 28px tag above the list (1px `--border-strong`,
13/500) with a 22px remove button.

**After Find similar the order is still the engine's, so the sort still reads *Relevance***, and the
tag above the list says what changed: *Similar to US 12107086 B2*, with *Restore* beside it. The score
chip stays on every row. There is no toast for it: the tag is the statement, and a toast laid over the
rows repeats it on top of the thing it describes.

**The drawing viewer is the lab's.** Its panel is `--r-widget` with a 1px `--border` on `--scrim`;
its head carries the title in `body` (one line, truncated), the patent number in `figure-s` and the
count, *Drawing 3 of 22*. Its tools are round 32px icon buttons with 16px glyphs in a floating pill;
previous and next are round 36px buttons on the stage's edges. The strip's thumbnails are tiles (`--r-control`), the current one in
the accent (§3.8). A disabled tool fades like any disabled button. Below 640px it opens full bleed and
every control is 44.

**Below 640px the layout is the phone's**, and it is designed down to 375px. The masthead is 56px,
sticky, on a blurred veil of the ground: the mark alone, New and History as 44px glyph buttons, and
the appearance control as one button that steps through its three states, every glyph at 18; the
version is not shown. The list head is sticky under it. **The search docks at the bottom**: the sentence and a
44px Search button with an 18px glyph in one bar on the ground's veil, above the safe area; pressing it opens the sheet
over `--scrim`. The record slides in as a full screen with a pinned head (*Back*, the number, previous
and next) and a bar on the safe area (*Find similar*, then *CSV | Markdown* as one two-part control
with a plain border, its inner corners square and its outer ones `--r-control`, every label in
`control`); *Open in IPTECH* sits under the holder, and the drawings are a four-column grid.

**Between 640 and 1080 the two panels stay side by side**, narrowing: the record's actions move under
its title and its side panel moves under the claims, by container query on the record panel, because
the same element is half the window at 1440 and most of it at 820.

**On a coarse pointer every control is reached through 44×44**, whatever size its glyph is drawn.
Where the glyph should stay small the box grows by a transparent hit area rather than by padding, so
the layout does not move.

**One `<main>` per surface.** Collapsing surfaces is how a screen-reader user loses the landmark they
navigate by.

**The lockup routes home unless there is no home to route to.** On the home surface it is
`aria-disabled`, and the visual does not change between those states: a lockup that changes
appearance by screen stops being a fixed point in the chrome.

**One primary action per surface.** A near-black fill — the accent, §3.8 — is what
says *this is the way forward*. Two filled buttons on one screen make the smaller one look like the
way forward. **The primary action of a settings card is never deletion** — where the act is
irreversible, the safe path is the affirmed button and the act is the ghost one, with the weight
carried by the sentence above them rather than by a hue.

**A switch is a claim that the product does the thing when it is on.** Every other invented value in
`demo/` is a grey bar or a figure the reader is told is illustrative; a control carries no such
marking, and nothing about a toggle says *this is a sketch*. Do not add one for a capability that does
not exist.

**There are no widget cards, and no caption states a finding.** A finding is a reading of the data,
and `brief.md` §1 prints none. A caption, where there is one, states a count and nothing more. **The
info popover carries explanation only**: what the score is, how the list is ordered. The test is whether a
screenshot with **no popover open** still says what the founder is looking at; an interface that needs
a popover to be legible is not legible.

**A narrow column has room for the list or for prose about the list.** Every sentence that is not the
list lives behind one control.

**A field states its own trouble in weight, not colour.** An error is a discrete state, and a red would
be the only hue in a product that has none — it would read as the most important thing on the screen
rather than as one field needing a fix. So the edge doubles instead: an inset 1px `--text-1` ring over the 1px border,
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
under an empty field, a save under an untouched one. Where the reason is a *sentence* — an edit
still open, an act that is not built yet — the control stays focusable and
`aria-describedby` carries the reason to it on every visit rather than announcing it once in passing.
Activation is then blocked in code, because the platform has stopped doing it.

**So a submit that is inert until there is something to submit stays natively disabled**, and that is
not a departure from the general advice to keep submits enabled. That advice exists to stop a form
hiding *why* it will not send. Here the why is the empty field directly above the button.

**A failure is the same argument at the size of a region.** A view, a pane or a list that does not
arrive takes an icon, a sentence that states the fix, and an action where there is one, on the
`--surface-sunken` fill any box inside a card takes. No hue, for the reason above.

**It takes one hairline at full ink, not the field's doubled edge**, and the difference is scale
rather than principle. A field doubles because it already has a resting border and may not change
width. A block has no resting border to double, and 2px of `--text-1` around something 300px wide
out-shouts the primary action on the same screen. One `--text-1` hairline says the same thing at the
right volume: `--border` is 1.27:1 and reads as furniture, `--text-1` is 15.3:1 and reads as a
statement.

**A failed region silences every count it was about to state.** The list head reads *162
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

---

## 8 · The skeleton contract

`demo/` stands in for an engine, so `app/` shows a populated screen without live data.

**Chrome is real. Identities stay bars. Figures are illustrative.**

| Real English | Grey bar | Illustrative |
|---|---|---|
| Titles, buttons, column headers, empty-state copy, menu rows, field labels | Company names, patent and application numbers, classification symbols, inventors | Counts, relevance scores, filing and publication years |

**`corpus/` is the deliberate exception and it is not in this table**, because it is not illustrative
data — it is real patents, captured, and its whole job is to strain renderers written against
well-behaved shapes. It prints real assignee names, it is excluded from `main` in its entirety while
its four runtime paths are published to `gh-pages`, and it is **what loads by default when it is
present** — `?data=demo` forces the fake engine. `brief.md` §4 carries it.

**No party is invented.** A named company is never invented, because an invented one reads as a live
example — and transliterating a real one is fabrication. Both are worse than a bar.

**A jurisdiction is not a party**, so it is printed, as its code where it is data and its name where
it labels a choice (§4 *Case*). Five grey wedges would read as nothing.

**A patent with no assignee is not a withheld one.** A bar claims a holder exists and is being
held back; a patent that names none has nothing to hold back. So the contract keeps three holder
states apart, the way `figures` keeps its two: a string is the holder, `null` is the bar, and `''`
prints *No assignee listed* in the quiet ink.

**An empty list is not a list of bars.** A bar says a value exists and is being withheld; a list with
nothing in it has no values to withhold. Three grey rows where a founder has run no searches claims
they have run three whose sentences we decline to print. So an empty list says what fills it and offers
the act that does — the same distinction a dash draws against the bar, one component up.

**The screen must read as populated through layout alone.** That is the harder and more useful test.

**A field the record does not carry is a dash, not a bar.** A bar says the value exists and is
withheld; legal status, a priority date or CPC's words that the record never had are absent, and the
dash says so (§7).

### The exceptions, and what makes one admissible

Each is the same exception: **where withholding the value would leave a control with nothing to act
on**, the value is shown and everything around it stays a bar.

- **The year on a list row.** A date sort over a column of grey bars is an order the founder cannot
  check. The control is the argument, not the row.
- **The relevance score.** A ranked list over a column of bars is the same defect, and the score is
  the engine's own number rather than one Terrain generated. The corpus prints stand-ins for it
  (`brief.md` §4).
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

**One release, too.** Every icon's geometry is copied from `lucide-static` 1.51.0. An icon taken from
an older release is a different drawing under the same name, and mixing releases shows in the corners
and proportions exactly as mixing sets does. Upgrading means re-copying every icon, not the ones that
happen to be touched.

**Four sizes, and a glyph takes the size of the control it sits in.** 1.5px stroke, round caps and
joins throughout, at every size: a heavier stroke in one bar would itself be the inconsistency.

| Size | Control | Where |
|---|---|---|
| 14px | 28 compact | the masthead's buttons and theme segments, chips, a tag's remove button, the row's source link, a ticked settings chip |
| 16px | 32 to 36 | the list head, the scope row, the record's actions in their wells, *Show all*, menus, the viewer, everything on home's composer |
| 18px | 36 primary | the results surface's Search, the record's × |
| 18px | 44 touch | every glyph below 640px: the masthead, the docked Search, the phone record's Back, previous and next, the viewer |
| 24px | none | the submark in the lockup, a technology-field tile on home, the empty record's glyph |

**One glyph, one act.** Two controls in one region carrying the same mark for different acts is the
assembled-from-parts failure arriving through repetition rather than through mixture — so *New search*
the masthead's *New* takes the magnifier because it is the only magnifier there; the search panel's
Search is a word with the same glyph, one region away, and it is the act *New* leads to.

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

**29 semantic tokens**, and **this is where that count is argued.** It is printed in three places —
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

§3.9 carries the tier it belongs to: the primitives, the scale and the derived one are *not* in it,
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

### 10.3 · The values, measured

**Ground, surface and text.** Contrast against `--surface` `#1E2227`. The ground and its hairline
are slate (§2); the text above `--text-3` stays neutral.

| Token | Hex | On surface | L* |
| --- | --- | --- | --- |
| `--ground` | `#16191C` | 1.10 | 8.6 |
| `--ground-light` | radial, `#2C3238` → `#1E2227` 34% → `#16191C` 70% | — | — |
| `--surface` | `#1E2227` | — | 13.0 |
| `--surface-sunken` | `#101010` | 1.19 | 3.9 |
| `--border` | `#3A4148` | 1.55 | 27.2 |
| `--border-strong` | `#454545` | 1.67 | 29.3 |
| `--focus` | `#F0F0F0` | 14.03 | 94.8 |
| `--text-1` | `#F0F0F0` | **14.03** | 94.8 |
| `--text-2` | `#B4B4B4` | **7.71** | 73.3 |
| `--text-3` | `#9AA2AA` | **6.18**, 5.01 at the light's centre | 66.2 |
| `--text-disabled` | `#5A5A5A` | 2.32 | 38.2 |
| `--text-inverse` | `#141414` | — | 6.3 |
| `--ink-hover` | `#FFFFFF` | — | 100 |
| `--track-pressed` | `#2A2A2A` | — | 17.1 |

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
| `--edge-silver` | the five stops, §3.2 | **does not swap** — it is read against either ground (§3.8) |

**`--edge-silver` is identical in both palettes because one gradient reads on both grounds**
(§3.8). **The drawings' tokens are identical for a different reason: they are facts about the
content rather than exemptions.** A patent drawing is black line-work on a transparent background; composited onto
`#1A1A1A` it is a blank rectangle — so `--figure-ground` means *the paper this was published on*,
which has no dark value, and `--veil` sits on that paper and may not swap either. Every other
semantic token means *the surface under our own chrome*.

**`--scrim` is the one that looks like it belongs with them and does not.** It composites over the
app, which does swap, so it swaps. Ink at .55 over `#141414` would dim nothing, which is the one
thing a scrim exists to do. In dark the binding constraint is not contrast — every usable value
clears 20:1 against the white stage — but the other side: enough that the masthead and the list stop
competing for the eye, little enough that the page reads as behind rather than gone.

**`--accent`, `--accent-ink` and `--accent-on-surface` have no rows of their own** because they hold
the ink pair's values, and the ink rows above are their measurement. A hue would give each of them a
row, and the third would have to be measured against `--surface` rather than derived from the fill,
because it is read as text.

### 10.4 · The control

Three states — light, dark, system — as a segmented control in the masthead, persisted to
`localStorage` and overridable by URL for headless capture. On a phone it is one button that steps
through the three states.

**It may not be demoted into a menu.** A pass proposing that reverses a recorded decision.

**A switch snaps; it never cross-fades.** Every coloured property carries a transition, so a theme
change would otherwise animate them all at once and smear the page for a beat. For the frame of the
switch transitions are off, and that holds when the system flips the theme under *Match your
system* as well as when the control is pressed.

**The favicon follows the *browser's* colour scheme, not Terrain's control**, and nothing can change
that — an external favicon cannot inherit `currentColor` the way the inlined submark does.

---

## 11 · Open

- **The figure viewer has no measured floor.** It takes the viewport less a 24px gutter now, so the
  question moved rather than going away: nothing states the width below which a patent figure stops
  being readable, and the strip's 640px breakpoint is re-derived from the old column figure rather
  than measured against a drawing. Every other dimension in this file is measured; this one is not.
- **Nobody has watched a founder use the lightbox.** The drawing gained roughly four times the area
  and lost the record beside it, and which of those matters more is the kind of thing one session
  with a real user settles and no amount of arithmetic does.
