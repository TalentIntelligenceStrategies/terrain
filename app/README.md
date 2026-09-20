# `app/` — the Terrain frontend

**Run it with a server. `python3 -m http.server` from the repository root, then open
`http://127.0.0.1:8000/app/`.** Opening `index.html` from the filesystem does not work and never
will: `<script type="module">` is CORS-fetched, a `file://` origin is opaque, and Chrome, Safari and
Firefox all refuse it. The prototype at `design/previews/terrain-prototype.html` keeps the
open-the-file property; this does not.

*`127.0.0.1` rather than `localhost`, and it is not fussiness.* `localhost` resolves to IPv6
first; a second server already bound to `*:8000` on IPv6 will shadow one bound to
`127.0.0.1:8000` on IPv4, and what you get is somebody else's site with no error anywhere.

**What you should see:** the conversation on arrival. `#set` opens the working surface — the
list on the left, the Market views on the right, and the map under the **Technology** tab.
Clicking a row opens the record over the views. `?fail=map,record` arms named ports to refuse
and `?fail=all` arms every one, which is how §9.1's *a failure is the size of the region that
was waiting* gets checked rather than asserted. `?slow=3` multiplies every latency.

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

| | | |
| --- | --- | --- |
| `tokens` `01`–`05` | foundation — tokens, reset, type, skeleton, loader, wait/fail | **extracted** |
| `10`–`15` | primitives — button, chip, field, inline-confirm, menu, empty | **extracted** |
| `20`–`21` | layout — shell, surface | **extracted** |
| `30`–`37` | components — conversation, card, map, chart, list, record, destination, attribution | **extracted** |
| `98` | the bench, `lab.html` only — numbered into the same manifest so it cannot drift into testing something else | **extracted** |
| `99` | reduced motion, **which must load last** | **extracted** |

**Extracted means extracted.** Each of `20`–`37` is a run of the prototype's own
sections, copied by line range and **brace-balanced before it was written** — not a
rewrite from a memory of what the rules were. The prototype carries its own note about
why that check exists: *"A STRAY `}` STOOD HERE, AND IT ATE THE RULE BELOW."* A split
that lands mid-rule is the known failure of this exact move, and it is silent.

**Two rules the split had to get right, both recorded where they bite.**
`05-wait-fail.css` has its own number because `.card-body.is-wait` and `.rec-body.is-wait` span two
component families *for the same reason* — they share one **contract**, not one appearance, and the
JavaScript half is `core/wait.mjs`. And `#acctMenu .menu-item:focus-visible` sat in the reset section
and belongs to the shell; it moved to `14-menu.css`, which is safe because it wins on **specificity**
wherever it lands rather than on order.

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

## The engine seam

`js/ports.mjs` is `design/components.md` §1 made executable: **32 named ports**, one per
data-bearing row, plus a typedef for each shape and a `NullEngine` that implements every port by
refusing.

**Every port resolves to `{ok:true, data}` or `{ok:false, code, retryable}`.** Each clause earns its
place:

- **A failure is a response and is not an empty one.** *No patents matched* is an answer; *the search
  did not run* is not. A component that cannot tell them apart renders "nothing found" over an
  outage. An empty array is not a failure signal.
- **Partial success is the normal case**, which is why every view is its own port. A response that
  can only be wholly good or wholly bad forces the surface to blank nine working views to report one
  broken one.
- **The reason is machine-readable; the sentence is ours.** Never return prose for display — our copy
  states the fix rather than the fault, and a message we did not write cannot be made true of our
  interface.
- **`retryable` is part of the answer**, and it is exactly what `failHTML(say, act)` consumes.
  `true` → pass an `act` and the block offers *Try again*. `false` → pass none, and the block says
  there is no way forward **by having no button**.

**`null` on an identity field means render the skeleton bar, and it is the only thing that means
that.** A real engine returning real names then changes nothing but the presence of a value — no
renderer branches on whether the data is real. **`null` and `'XXX'` stay distinct**: one is *this
value exists and we decline to print it*, the other is *nobody has chosen one yet*, and they render
through different paths on purpose.

`NullEngine` **is not a stub.** It is what `app/` runs against when `demo/` is deleted, and every
surface has to say *this did not run* rather than throw. It is also the check that no component
secretly needs data to draw its own chrome — a surface that cannot render against it cannot render
its own failure state either.

---

## `partials/`, `js/surfaces/`, `js/charts/` — the rest of the tree

**Eight partials, and the host list in `index.html` is the manifest.** `main.mjs` fetches
every one, **replaces** its host with the partial's own nodes, and **awaits all of them
before calling any `init()`**. That single ordering rule is what replaces 55 scattered
parse-time element captures: every surface module exports `init(ctx)` and reads the DOM
*there*, never at module scope. A module that captures an element at import time
dereferences null the first time a partial is slower than an import, and that failure is
intermittent by construction.

**The record is not a host of its own**, and that is a correction to `index.html` rather
than an omission. `.rec` is positioned against `.panecol` and leaves a ~200px peek of the
views behind it — §6.6 calls the peek the spec rather than a margin. Hoisted to a sibling
host it would position against the viewport. It ships inside `surface.html`.

**Seven surfaces**, one per region rather than one per file that happened to get large:
`masthead`, `conversation`, `work`, `views`, `list`, `record`, `destinations`.

**Four chart modules.** `primitives` (the skeleton bar, the density band, the three marks),
`share`, `series`, and `map`. Three of the four were extracted by **brace matching from the
function name**, so a moved line cannot silently truncate one. `map.mjs` is the exception
and says so at the top: the prototype's `matrixHTML` reads five module-level globals, so
extracting it verbatim would have dragged the data layer across with it.

**Three globals became parameters on the way across**, and each one is the same lesson:
`PG_FILINGS` and `PG_LAG` in `filingsChart`, and everything `matrixHTML` read. A chart that
reads a module-level array cannot be drawn twice with two corpora, and it cannot be drawn
at all against `NullEngine`.

### The three zones

| | |
| --- | --- |
| `app/js/**`, `app/partials/**` | the contract. **Never holds data** |
| `demo/**` | fake data and the fake engine. **Deletable entirely** |
| the seam | **one import line** in `js/main.mjs`, under a banner |

`check-app.py` fails the build if `demo/` is imported anywhere else, so deleting the directory leaves
one broken line rather than a search. **Never bend a component toward the demo data's shape; bend the
fake engine toward the contract** — a component shaped around the fake engine is a component that
breaks against the real one.

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
