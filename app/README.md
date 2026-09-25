# `app/` — the Terrain frontend

**Run it with a server. `python3 -m http.server 8765` from the repository root, then open
`http://127.0.0.1:8765/app/`.** Opening `index.html` from the filesystem does not work and never
will: `<script type="module">` is CORS-fetched, a `file://` origin is opaque, and Chrome, Safari and
Firefox all refuse it.

*`127.0.0.1` rather than `localhost`, and it is not fussiness.* `localhost` resolves to IPv6
first; a second server already bound to `*:8765` on IPv6 will shadow one bound to
`127.0.0.1:8765` on IPv4, and what you get is somebody else's site with no error anywhere.

**What you should see:** the home surface on arrival — the technology-field tiles, the composer, and
what is in the corpus. Type a sentence and press Search. `#set` opens the results surface: **the list
on the left, which never goes away**, each row in three bands — its number and title, then who holds
it and when, then three clamped lines of its abstract — over **a scrolling strip of its own
drawings**; and the record on the right when you click a row — every identifier, then the drawings,
then the abstract and the claims. The open row is marked in the list.

**The strip holds up to twelve drawings and scrolls sideways**, with a `+N` tile at the end carrying
however many the cap hid; that tile opens the record. It is **one tab stop per row** — arrows move
inside it, `Home` and `End` reach its ends — because twenty rows at twelve drawings would otherwise be
240 tab stops. Pressing any drawing, **on a row or in the record**, opens it **as a lightbox over the
whole viewport**, with zoom, rotation, pan and a thumbnail strip; from a row it opens the record
underneath it at the same time, so Escape closes the drawing and leaves you in the record. *Drawings only* in the search bar strips the
**list** to its pictures; the record is unaffected. The grouping control opens a **popover**, and the
branches you pick stay as chips above the list after it closes. Star two rows and *Find similar*
appears; the count beside the results leads to the starred set, which is where the export lives.

*Open in IPtech* in the record's head **points at a sign-in page and always the same one.** It is a
stand-in for a per-patent source URL the engine does not return yet — `design/components.md` §4
question 3 — and it is the only control in the product whose destination the data did not choose.

`?fail=search,record` arms named ports to refuse and `?fail=all` arms every one, which is how
`platform.md` §7.1's *a failure is the size of the region that was waiting* gets checked rather than
asserted. `?slow=3` multiplies every latency. `?theme=light|dark` pins appearance.

**`corpus/` is the default when it is there, and `?data=demo` forces the demo.** The flag used to
run the other way — the corpus lived behind `?data=real` — and the cost of that only became obvious
once the drawings were built: the demo ships no images at all, so the plain URL, which is the one
everybody opens, showed a product with no pictures in it. `corpus/fetch.py` captures the set,
`corpus/build.py` shapes it. The flags combine: `?fail=all` against the corpus is the one that checks
a failure state still fits around real text.

**`corpus/` is local only and absent from a fresh clone.** There the dynamic import throws, `app/`
lands on the demo and says so in the console rather than failing to mount — which is exactly what it
did before the inversion, so a clone behaves identically either way.

> ### Two features are only visible against the corpus, and that is a decision
>
> **The drawings and the export.** `demo/` never names a real holder and never ships a real patent
> figure — `CLAUDE.md`'s client-data boundary — so demo rows and the demo record render numbered
> *skeleton* frames rather than drawings, and a CSV exported from it has an almost-empty Number
> column. Both are correct behaviour: a bar means *this value exists and we decline to print it*.
>
> **But it means a reader receiving this handoff without `corpus/` cannot watch the product's own
> ending work.** That is the price of never tracking a third party's data, it was paid deliberately,
> and `brief.md` §4 carries it. If you need to see the export produce a real file, or a drawing at
> all, you need the corpus: `python3 corpus/fetch.py`, then reload.

*And one runs the other way.* **The relevance score is only visible under `?data=demo`**, because
`corpus/` returns `null` for it on every record. That is correct behaviour and not a gap: a score the
engine did not produce is omitted rather than barred, since a bar would claim a value was withheld.
`platform.md` §4.3 carries the rule. It is worth knowing before concluding the field was never built.

---

## What this is

**This is the product and the reference.** Where a document and `app/` disagree, the code is what was
decided.

It was extracted from `design/previews/terrain-prototype.html`, 13,000 lines in one file — one
`<style>`, one block of markup, one IIFE. That file is **frozen at v1** and describes a
landscape-analysis product that no longer exists; it is kept because every partial here names it as
its source, which is provenance rather than authority. Do not read it to settle a question.

**This is a separation, not a rewrite.** The prototype is read; `app/` is built beside it, so every
step is checked against a known-good reference rather than against a memory of how it used to behave.

**It is not published, and neither is anything else.** `docs/brief.md` §4 records that: `gh-pages` was
emptied and the pipeline retired, because the prototype it served showed the landscape product and a
link to that misrepresents what Terrain is. Publishing `app/` was considered and is not next —
pointing GitHub Pages at this tree would publish forty-odd files of internal reasoning in
view-source, and making it public means first deciding what a stranger sees when the fake engine
answers.

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
| `10`–`16` | primitives — button, chip, field, inline-confirm, menu, empty, popover | `16` is **new** |
| `20`–`21` | layout — shell, surface | **extracted** |
| `30`–`41` | components — composer, card, list, record, destination, attribution, home, starred, drawings, grouping | `38`–`41` are **new** |
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
| scale | 28 | `:root` once | Invariant by construction |
| semantic | 32 | **all three blocks** | The dark contract |
| derived | 3 | `:root` once | Resolves *through* a themed token. **Never in a dark block** |
| component-scoped | 4 | the component's own class | Never on `:root` |

**Every other copy of the token block is generated.** `tools/sync-tokens.py --write` writes it into
the loading lab between sentinels; `--check` verifies it **byte for byte** and CI runs it on every
push to `main`. Byte-for-byte rather than value-for-value because the block carries ~130 lines of
measured reasoning — every contrast ratio, the withdrawn `--mark-1` hue — and a value diff passes
while all of it drifts. `app/index.html` is not a target: it links `styles/tokens.css` from the
directory next to it.

### The properties JavaScript sets

**This table is read by `tools/check-app.py` gate B**, which refuses a `var()` that is declared
nowhere, carries no fallback, and is not listed here — so the table cannot go stale while the gate
passes.

| Property | Set by | Read with fallback | What it carries |
| --- | --- | --- | --- |
| `--rest` | the loader build, per dot | `var(--rest, calc(…))` | the idle opacity ramp under reduced motion |
| `--dmx-speed` | the loader | `var(--dmx-speed,1)` | cycle multiplier |
| `--dmx-path` | the loader, per dot | `var(--dmx-path,0)` | position along the ripple path |
| `--dmx-opacity-base` | the loader | on `.dmx-root` | trough of the pulse |
| `--dmx-opacity-mid` | the loader | on `.dmx-root` | midpoint of the pulse |
| `--fig-scale` | the figure viewer | `var(--fig-scale,1)` | zoom, as a step off a fixed ladder rather than a free multiplier |
| `--fig-rot` | the figure viewer | `var(--fig-rot,0deg)` | rotation, a quarter turn at a time |
| `--fig-x` `--fig-y` | the figure viewer, while panning | `var(--fig-x,0px)` | pan offset. **All four compose into ONE transform, and the CSS decides the order** — a JS-built transform string is three call sites that can disagree about whether rotation happens before scale |

*`--mx-n`, `--mx-min`, `--mx-head` and `--xr-n` left with the analysis layer.*

**Every read site carries a fallback, and that is load-bearing rather than tidy.** A `var()` whose
property is set by nothing and whose read has no fallback is *invalid at computed-value time*, and
the property takes its **initial** value. For `opacity` that is `1`. `.dmx-dot{opacity:var(--rest)}`
turned the reduced-motion loader into a solid block at full strength, with the positional ramp gone,
while every grep for the token found it present and correct.

---

## `js/core/` — the behaviour layer, and the part a rewrite gets subtly wrong

Eighteen modules, dependency-free. **This is the deliverable.** Every
one of them encodes a rule that reads as an implementation detail and is not:

| Module | The rule it carries |
| --- | --- |
| `dom` | `esc` is used in exactly one place — the exclusion chips. Everywhere else renders typed text with `textContent` |
| `motion` | `reduced()` is read **live**, never cached. The prototype read it once at parse time, so turning reduced motion on mid-session moved the CSS and left the JS behind |
| `loader` | One mark, one size, no variants, no region scaling. Third-party motion: permitted in the product, **not** republishable as a standalone component |
| `wait` | `waitOn` captures `offsetHeight` **before** emptying. `failIn` deliberately does **not** clear `minHeight`. `failHTML`'s retry button is optional **by rule** |
| `button-wait` | Re-applies the label as `aria-label`, because `display:none` children are excluded from the accessible name. Not `disabled` — that drops focus to `<body>` |
| `beat` | The beats are the engine's, and none of them is a measurement. **Reduced motion does not shorten or skip a beat** |
| `generation` | A counter per channel. The third line — `if (stale(…)) return` in every deferred callback — is the one people forget |
| `timers` | A scope that can cancel everything it started. 66 timer calls in the prototype, each cleared or not by hand |
| `armed` | A **registry**, so `disarmAll()` cannot miss a flag. The hand-maintained checklist it replaces said "the list has to stay whole" and lived inside the router being deleted |
| `focus` | `preventScroll` is the fix for the record jumping. `isConnected` before restoring — a row re-rendered by a re-rank is the ordinary case |
| `esc-stack` | Escape closes the most recent. One overlay left; the stack is what makes a second one safe |
| `live-region` | Clears and re-sets after 60ms so an **identical** second failure announces. Unhides **before** writing |
| `roving` | One tab stop per group; the stop moves with focus so leaving and returning lands where the founder was. **Two exports**: `roving` binds to one container, `rovingIn` is delegated at an ancestor for N groups that come and go — the result list rebuilds twenty drawing strips on every sort, filter, re-rank and page, and an instance per row is twenty teardowns a render with nothing watching that they happen |
| `delegate` | `closest`, not `matches` — the founder clicks the label inside the button |
| `popover` | One floating panel, one trigger, four things every one of them must get right. It exists because there were two private copies and a third would have been the one that drifted. `infoPopovers` wires the `.info` notes, which shipped as markup and a stylesheet with **no driver at all** — a disclosure with a hover state, an `:active` scale and a hard-coded `aria-expanded="false"`, which is what made a control that had never once opened hard to see |
| `starred` | The set holds **rows, not ids**: an id is enough to re-order a list and not enough to render a collection or write a CSV, and the client holds one page at a time. It persists to `localStorage` behind `read()`/`write()` — every access wrapped, because Safari in private mode throws on `setItem` and a throw here loses the starring the founder is doing to protect the starring they had done. The payload is versioned: a stored row in a shape the list no longer emits is bars where there were names |
| `figure-viewer` | Zoom is `scale()`, rotation is `rotate()`, pan is `translate()`, composed into **one** transform by the CSS. §6 forbids animating a layout property and says there are no exceptions |

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

`js/ports.mjs` is `design/components.md` §1 made executable: **19 named ports**, one per
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

## `partials/` and `js/surfaces/` — the rest of the tree

**Nine partials, and the host list in `index.html` is the manifest.** `main.mjs` fetches
every one, **replaces** its host with the partial's own nodes, and **awaits all of them
before calling any `init()`**. That single ordering rule is what replaces 55 scattered
parse-time element captures: every surface module exports `init(ctx)` and reads the DOM
*there*, never at module scope. A module that captures an element at import time
dereferences null the first time a partial is slower than an import, and that failure is
intermittent by construction.

**The record is a child of `.panecol` and the figure viewer is not a child of anything
here.** Both still ship inside `surface.html`, which is the surface they belong to, but
they resolve differently. The record is in flow and IS the right column while it is open.

**The viewer is moved to `<body>` at init, and that is load-bearing rather than tidy.**
It became a lightbox — `position:fixed`, a scrim, the page behind it `inert` — and
`inert` works downward: authored four levels inside `#app`, inerting the page would inert
the viewer with it, and inerting everything-but would be a hand-kept list of regions that
goes stale the first time the surface gains one. Nothing about its rendering depends on
where it lives, because its containing block is the viewport either way.

**Three rules used to say this product had no lightbox** — no scrim, no `position:fixed`,
no focus trap — and all three are now narrowed to exactly this one node. `design-language.md`
§3.2 carries the successor and `figure-viewer.mjs`'s header carries why the premise changed.

**Nine surfaces**, one per region rather than one per file that happened to get large:
`masthead`, `settings`, `home`, `work`, `list`, `fishbone`, `record`, `starred`, `destinations`.
`views` left with the analysis layer.

**`js/charts/` is gone.** The four modules — `primitives`, `share`, `series`, `map` — left
with the analysis layer; the skeleton bar and the status chip they shared moved to
`core/primitives.mjs`, which is where the surviving renderers read them from.

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
indirection buys nothing and hides which value is live. **One** scrim token with **one** reader,
the enlarged drawing, and nothing else in the product dims anything. No `@layer`.
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
