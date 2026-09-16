# `app/` — the Terrain frontend

**Run it with a server. `python3 -m http.server` from the repository root, then open
`http://localhost:8000/app/`.** Opening `index.html` from the filesystem does not work and never
will: `<script type="module">` is CORS-fetched, a `file://` origin is opaque, and Chrome, Safari and
Firefox all refuse it. The prototype at `design/previews/terrain-prototype.html` keeps the
open-the-file property; this does not.

---

## What this is

The frontend extracted from `design/previews/terrain-prototype.html`, which is 13,000 lines in one
file — one `<style>`, one block of markup, one IIFE — and is **the reference for what Terrain is**.
Where a document and the prototype disagree, the prototype is what was decided.

**This is a separation, not a rewrite.** The prototype is read; `app/` is built beside it, so every
step is checked against a known-good reference rather than against a memory of how it used to behave.

**It is not published.** `docs/brief.md` §4 records that: the prototype stays the published artifact
at `talentintelligencestrategies.github.io/terrain/`, and pointing GitHub Pages at this tree would
publish forty-odd files of internal reasoning in view-source.

**This file is not a fifth document.** `CLAUDE.md` holds the four, and the test it applies to the
repository's own `README.md` applies here: this is the front door for `app/` and holds no rule that
is not already in one of the four. **If it ever states a rule that is not in `docs/design-language.md`,
the rule is in the wrong file.**

---

## The stylesheet order, and why the number is the cascade

One `<link>` per stylesheet, in numeric order. **Not an `@import` chain**: `@import` serialises
discovery, so each file is found only after the one importing it has parsed, and it hides which file
a rule came from in DevTools. `tools/check-app.py` asserts that the tag list matches what is on disk
and that `99-reduced-motion.css` is **last**.

| | |
| --- | --- |
| `00`–`05` | foundation — tokens, reset, type, skeleton, loader, wait/fail |
| `10`–`15` | primitives — button, chip, field, inline-confirm, menu, empty |
| `20`–`21` | layout — shell, surface |
| `30`–`37` | components — conversation, card, map, chart, list, record, destination, attribution |
| `99` | reduced motion, **which must load last** |

**`99-reduced-motion.css` must load last because 20 of its 28 rules are same-specificity overrides
declaring end states.** Same specificity means order decides.

**There is no `@layer`, and the reason is `!important`.** Inside a layer, `!important` *reverses*
layer order: an important declaration in an earlier layer beats one in a later layer. Three of the
four `!important`s in this codebase are in the reduced-motion block, and that block has to be the
thing that wins — otherwise a transition that never ticks leaves a view at `opacity:0` and the screen
blank, which is a failure `design-language.md` §6 records from a real incident. Layering it last
would make its importants the *weakest* in the sheet.

*If a consumer ever needs layering, there is exactly one permitted form:* `@layer terrain { … }`
wrapping every file identically, one layer, no sub-layers. Sub-layers reintroduce the inversion.

---

## The five token tiers

`app/styles/tokens.css` is **the one authored copy** and **the only file permitted to declare a
custom property on `:root`**. `design-language.md` §3.9 is the rule; this is the summary.

| Tier | Count | Declared | Rule |
| --- | --- | --- | --- |
| primitive | 11 | `:root` once | `--n-0`…`--n-10`. No component may read one |
| scale | 29 | `:root` once | Invariant by construction |
| semantic | 42 | **all three blocks** | The dark contract |
| derived | 5 | `:root` once | Resolves *through* a themed token. **Never in a dark block** |
| component-scoped | 5 | the component's own class | Never on `:root` |

**Every other copy of the token block is generated.** `tools/sync-tokens.py --write` writes it into
the two previews between sentinels; `--check` verifies them **byte for byte** and CI runs it before
the publish. Byte-for-byte rather than value-for-value because the block carries ~130 lines of
measured reasoning — every contrast ratio, the withdrawn `--mark-1` hue — and a value diff passes
while all of it drifts. `app/index.html` is not a target: it links `styles/tokens.css` from the
directory next to it.

### The properties JavaScript sets

**This table is read by `tools/check-app.py` gate B**, which refuses a `var()` that is declared
nowhere, carries no fallback, and is not listed here — so the table cannot go stale while the gate
passes.

| Property | Set by | Read with fallback | What it carries |
| --- | --- | --- | --- |
| `--i` | the renderer, per visible item | `var(--i,0)` | the stagger index. **Set from the visible index, never counted by `:nth-child`** — cards are hidden with `[hidden]`, not removed, so a positional ladder counts hidden ones |
| `--rest` | the loader build, per dot | `var(--rest, calc(…))` | the idle opacity ramp under reduced motion |
| `--stage-delay` | the build runner | `var(--stage-delay,0ms)` | per-stage entrance delay |
| `--dmx-speed` | the loader | `var(--dmx-speed,1)` | cycle multiplier |
| `--dmx-path` | the loader, per dot | `var(--dmx-path,0)` | position along the ripple path |
| `--dmx-opacity-base` | the loader | on `.dmx-root` | trough of the pulse |
| `--dmx-opacity-mid` | the loader | on `.dmx-root` | midpoint of the pulse |
| `--mx-n` | the map renderer | `var(--mx-n,5)` | column count |
| `--mx-min` | the map renderer | `var(--mx-min,520px)` | minimum grid width |
| `--mx-head` | the map renderer | `var(--mx-head,132px)` | header row height |
| `--uc-cap` | the usage chart | `var(--uc-cap,44px)` | column cap height |
| `--xr-n` | the cross-ref renderer | `var(--xr-n,5)` | row count |

**Every read site carries a fallback, and that is load-bearing rather than tidy.** A `var()` whose
property is set by nothing and whose read has no fallback is *invalid at computed-value time*, and
the property takes its **initial** value. For `opacity` that is `1`. `.dmx-dot{opacity:var(--rest)}`
turned the reduced-motion loader into a solid block at full strength, with the positional ramp gone,
while every grep for the token found it present and correct.

---

## `js/core/` — the behaviour layer, and the part a rewrite gets subtly wrong

Fourteen modules, dependency-free, each exercised by `lab.html`. **This is the deliverable.** Every
one of them encodes a rule that reads as an implementation detail and is not:

| Module | The rule it carries |
| --- | --- |
| `dom` | `esc` is used in exactly one place — the exclusion chips. Everywhere else renders typed text with `textContent` |
| `motion` | `reduced()` is read **live**, never cached. The prototype read it once at parse time, so turning reduced motion on mid-session moved the CSS and left the JS behind |
| `loader` | One mark, one size, no variants, no region scaling. Third-party motion: permitted in the product, **not** republishable as a standalone component |
| `wait` | `waitOn` captures `offsetHeight` **before** emptying. `failIn` deliberately does **not** clear `minHeight`. `failHTML`'s retry button is optional **by rule** |
| `button-wait` | Re-applies the label as `aria-label`, because `display:none` children are excluded from the accessible name. Not `disabled` — that drops focus to `<body>` |
| `beat` | `BEAT` is the engine's, `SAVE_MS` is ours, and the second is not a rounding of the first. **Reduced motion does not shorten or skip a beat** |
| `generation` | A counter per channel. The third line — `if (stale(…)) return` in every deferred callback — is the one people forget |
| `timers` | A scope that can cancel everything it started. 66 timer calls in the prototype, each cleared or not by hand |
| `armed` | A **registry**, so `disarmAll()` cannot miss a flag. The hand-maintained checklist it replaces said "the list has to stay whole" and lived inside the router being deleted |
| `focus` | `preventScroll` is the fix for the record jumping. `isConnected` before restoring — a row re-rendered by a re-rank is the ordinary case |
| `esc-stack` | Escape closes the most recent. One overlay left; the stack is what makes a second one safe |
| `live-region` | Clears and re-sets after 60ms so an **identical** second failure announces. Unhides **before** writing |
| `roving` | One tab stop per group; the stop moves with focus so leaving and returning lands where the founder was |
| `delegate` | `closest`, not `matches` — the founder clicks the label inside the button |

### The numbered checks

`lab.html` states each check, proves it in the DOM, and returns a verdict. Press **Run every check**,
or call `window.runAll()` from a script — it is the same definition either way, because a bench that
only renders is a bench somebody has to look at, and these are exactly the faults looking cannot
catch.

**Three of them need a person.** The DOM check proves the live region was cleared and re-set; it
cannot prove a screen reader spoke. **Verify checks 3, 4 and 9 with VoiceOver**: an identical second
failure announces twice, a button keeps its name through a wait, and a failure with no way forward
offers no button to tab to.

---

## The four `!important`s

An inventory, so that a fifth has to argue for itself.

| Where | Why |
| --- | --- |
| `*,*::before,*::after{transition-property:none!important;animation:none!important}` | two of the four. The blanket reduced-motion stop; it must beat every component |
| `.dmx-dot{opacity:…!important}` | beats both the `*` rule above it and the animation origin that would otherwise win |
| `:root.theme-switching *{transition:none!important}` | one frame, so the theme change does not cross-fade every coloured property at once |

---

## What is deliberately absent

No build step. No framework. No preprocessor. No bundler. No `--dark-*` primitive layer — a third
indirection buys nothing and hides which value is live. No scrim token and no scrim. No `@layer`.
No `og:image`, and no link-preview meta at all, because this tree is never published.

---

## Checking it

```
python3 tools/check-app.py            # the source tree: tokens, theme, hover gates, the demo seam
python3 tools/sync-tokens.py --check  # the generated token regions, byte for byte
bash   tools/test-gates.sh <build>    # every gate above, watched refusing a planted violation
```

**Add a gate, add its test.** A gate nobody has watched fail is not a gate — three of these checks
were shell once and silently did not run, and all three reported clean.
