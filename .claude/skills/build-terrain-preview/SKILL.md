---
name: build-terrain-preview
description: Build or revise a self-contained static HTML design preview for TIS Terrain in design/previews/. Use when the user asks for a screen, wireframe, mockup, preview or "what would X look like" for Terrain, or names one of platform.md's six moments (first run, confirm, the set, build, at rest, return). Covers the token block, the skeleton-data contract, inline Lucide and the TIS submark, and the headless render-then-read verification loop.
---

# Building a Terrain preview

A preview is **one `.html` file that opens over `file://` with no server and no build step**.
Inline CSS, inline SVG, no CDN, no framework. That is a rule in `CLAUDE.md`, not a convenience.

`docs/design-language.md` is the contract. Read it before writing anything — it holds the
authoritative token values, the type scale, and the component specs. This skill is the procedure.

**The single fact that shapes everything here:** Terrain has no API and no data. Every preview is a
populated-looking screen with nothing real in it, so the discipline that matters most is the
skeleton contract in step 3. Get that wrong and the preview either lies or shows nothing.

## 0 · Before you write a file

Confirm with the user, briefly, if it is not obvious from the ask:

- **Which screen** — a moment from `platform.md` §2, or a state within one.
- **Which states** — default only, or also empty / collapsed / overlay-open. Edge states are
  specced per widget in `platform.md` §6; they are cheap to add while you are in the file and
  expensive to retrofit.
- **New file or a revision** of an existing preview.

Then check `platform.md` §9 `DEFERRED — NOT IN SCOPE`. If the screen needs something from it,
**stop and say so** rather than building it. In practice this means: no patent detail page, no
jurisdiction/status filter, no second matrix, no export, no alerts.

## 1 · Scaffold

```html
<link rel="stylesheet" href="../../brand/fonts/fonts.css">
```

Relative from `design/previews/`. That is the only external reference any preview may make.

Then paste the `:root` token block from `docs/design-language.md` verbatim. Every preview inlines
its own copy — `CLAUDE.md` forbids a shared stylesheet until three previews independently want the
same value, and the doc holds the source of truth in the meantime.

`prefers-reduced-motion` is not optional. Every animated preview needs a media block that stops
shimmer and jumps any sequence to its final frame. **Declare the final state; do not merely shorten
the motion that would reach it.** Collapsing durations to `1ms` looks equivalent and is not — a
transition that is shortened can still fail to run, and anything relying on it to become visible
renders blank. Always verify with a `--force-prefers-reduced-motion` render, not by reading the CSS.

## 2 · Brand marks and icons

**The TIS submark, top left, inlined.** Copy the polygon paths out of
`brand/logos/tis/tis_cubelogo_submark_dark.svg`, and set `fill="currentColor"` instead of its
hard-coded `#252525`, so it inverts for free when the dark pass lands. The file in `brand/logos/`
stays untouched — it is read-only per `CLAUDE.md`; this is how the mark is *used*, not an edit
to it.

**Icons are Lucide, inlined, and nothing else.** No CDN, so copy the path data from lucide.dev
into an inline `<svg>` at `stroke-width: 1.5`, `fill: none`, `stroke: currentColor`,
`stroke-linecap: round`, `stroke-linejoin: round`. 20px in nav, 16px inline with text. Mixing icon
sets is visible in the stroke weight and corner radius immediately, and it reads as an interface
assembled from parts — which is exactly what a preview is trying to prove it is not.

Innovue appears as an attribution line only. Never in a lockup, never in the product name.

## 3 · The skeleton contract

**Chrome is real. Data is a bar. Nothing is invented.**

| Real English | Grey bar |
|---|---|
| Nav labels, widget titles, buttons, column headers, captions, legends, empty-state copy, menu rows | Patent counts, company names, dates, years, project names, user name, plan tier, axis labels |

No invented patent number, company, count or date reaches a preview. Not "US 12051972 B2", not
"Acme Robotics", not a plausible-looking 2019. The screen has to read as populated **through
layout**, which is the harder and more useful test anyway.

Two rules that make skeletons behave:

- **Bar widths come from a fixed set of classes, never randomised.** Random widths change on every
  render, which makes screenshots un-diffable and review impossible.
- **A bar occupies the box its text would occupy** — same height as the line-height it replaces,
  same alignment. A skeleton that collapses the layout is not showing you the layout.

The one place tone carries meaning instead of a bar: **matrix cells**. Tone encodes count on the
five-step `--density-*` ramp, and a corner hatch marks *rising*. Nothing there is fabricated, since
tone is structure rather than data. See `design-language.md` for why the ramp stays neutral.

## 4 · Colour

Colour appears **only** where it carries information a grey cannot:

- discrete states — live / expired, complete / incomplete
- delta pills — up / down
- the three chart layers — neutral series, amber dashed trend overlay, red excluded band

**Colour encodes direction, never desirability.** No green-means-good anywhere: not on the matrix,
not on the filings chart. Terrain has no accent decision yet, so primary actions are near-black
fill. Every coloured element also carries a word or a shape — never colour alone.

Everything else is the neutral ramp.

## 5 · Verify

Render it and **look at it**. Reading the code does not catch optical problems.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --hide-scrollbars --force-device-scale-factor=2 \
  --screenshot=<out>.png --window-size=1440,1000 --virtual-time-budget=3000 \
  "file://<abs-path>"
```

Then `Read` the PNG. For an animated preview, render at three `--virtual-time-budget` values to
sample the sequence, and once with `--force-prefers-reduced-motion` to prove the reduced path lands
on the final frame.

Audit greps — every hit is a fix or a stated exception:

```bash
# raw hex outside :root breaks the dark-mode contract
grep -nE "#[0-9a-fA-F]{3,6}\b|rgba?\(" design/previews/<file>.html | grep -v -- "--"
# anything that looks like fabricated patent data
grep -nEi "US ?[0-9]{7,}|[A-Z]{2}[0-9]{6,}|\b(19|20)[0-9]{2}\b" design/previews/<file>.html
```

**A missing typeface fails silently and every numeral in the system depends on Inconsolata.** Check
the render, not the code: numerals must be monospaced, letterforms must not be a system serif.

Then confirm, on the image:

- Colour only where step 4 permits it; matrix grey; no accent.
- Icons all Lucide, consistent stroke.
- Chrome copy reads as finished English, not placeholder.
- Nothing from `platform.md` §9 has appeared.

## 6 · Close out

- Previews live in `design/previews/`. Nothing else goes there.
- **If the preview settled a decision, write it into `docs/` before you stop.** `CLAUDE.md`:
  `docs/` is the source of truth and everything rendered is a view of it. A design preview that is
  the only record of a decision is the failure mode this rule exists to prevent.
- If a decision belongs upstream in the TIS monorepo — a token, a logo rule, the Innovue
  attribution phrasing — say so in the session and record it in `docs/brief.md` §6. **Never edit
  the monorepo from this folder.**
- Plain commit messages. No emoji, no AI-attribution trailer of any kind. Commit only when asked.

## The extraction rule

Duplicated token blocks across previews are accepted **for the definition phase only**. Once the
language locks, extract a shared stylesheet and have the previews link it. Extracting earlier is
the most likely way to lock in a bad early guess, which is why `CLAUDE.md` sets the trigger at three
previews independently wanting the same value rather than at the first sign of repetition.
