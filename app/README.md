# `app/` — the Terrain frontend

**Run it with a server. `python3 -m http.server 8765` from the repository root, then open
`http://127.0.0.1:8765/app/`.** Opening `index.html` from the filesystem does not work and never
will: `<script type="module">` is CORS-fetched, a `file://` origin is opaque, and Chrome, Safari and
Firefox all refuse it.

*`127.0.0.1` rather than `localhost`, and it is not fussiness.* `localhost` resolves to IPv6
first; a second server already bound to `*:8765` on IPv6 will shadow one bound to
`127.0.0.1:8765` on IPv4, and what you get is somebody else's site with no error anywhere.

**What you should see:** the home surface on arrival — the heading, the technology-field tiles, the
search panel, and what is in the corpus, with *Powered by Innovue* at its foot. Type a sentence and
press Search. `#set` opens the results surface, built from the V8 detail lab: **the search panel**
on top, its scope stated as chips (field, offices, documents, dates, results) with the time the
search took and *Search settings* at the end; under it **two panels side by side**. On the left, the
results as flat cards: the number, the kind, a link to the patent at its source, the **rank and the
relevance score** as two chips, the title, a ruled facts grid (holder, inventors, published, class),
three lines of the abstract and **up to eight drawings**. On the right, **nothing opens until you
pick a result** — the pane says *Select a patent* — and then the record: the number and title, the
holder, *Find similar*, *Export this record* and *Open in IPTECH* beside it, the four facts (legal
status, filed, published, where), the drawings with a lead sheet and *Show all*, the abstract and
claim 1 with *Show all*, and a rail with the parties, the identifiers and the classes grouped by
subclass in CPC's own words. A field the record does not carry prints an em dash.

**The list head** carries *Details* / *Drawings only*, **Group by topic** (the results by CPC
subclass, every count checkable against the list, picked as a filter tag), **Sort** (relevance,
newest, oldest, by published date). **Export** (these results in this order, as CSV or Markdown)
sits at the end of the scope row beside *Search settings*, and moves into the list head below 640px,
where that row is hidden. *Find similar* in the record orders the list by similarity to that patent; the sort still reads
*Relevance*, and the filter bar says what changed with a tag, *Similar to …*, whose × restores the
relevance order. The rank travels with its row through every sort.

**Pressing any drawing**, on a row or in the record, opens it **in the viewer over the whole
window**: zoom, rotation, pan, previous and next, and a strip of every drawing. From a row it opens
the record underneath at the same time, so Escape closes the drawing and leaves you in the record.

**Keys:** ← → step the record, Esc closes the innermost thing, `/` edits the search, Enter searches,
Shift+Enter is a new line. There is no shortcuts control.

**A search shows no loader.** Search keeps its label at reduced ink and is busy to a screen reader,
the rows on screen stay dimmed until the new ones land, and nothing holds the answer back.

**Three references, one each** (`docs/design-language.md` §4, §5, §9): the masthead is Innovue's
28px recipe; the results surface is the round 4 detail lab value for value (36px controls, small-capital
field names, the record's 44px actions, 44 below 640px); home is Innovue's live home value for value.

**Below 640px** the masthead is glyphs only, the search docks at the foot of the window, and the
record slides in over the list, full screen, with Back, previous and next in its head and *Find
similar* and *CSV | Markdown* in a bar at its foot. Back closes it.

*Open in IPTECH* **points at a sign-in page and always the same one** until the engine returns a
per-patent source URL (`sourceUrl`); `design/components.md` carries the question. It is the only
control in the product whose destination the data did not choose.

`?fail=search,record` arms named ports to refuse and `?fail=all` arms every one, which is how
`platform.md` §7.1's *a failure is the size of the region that was waiting* gets checked rather than
asserted. `?empty` makes every search match nothing, standing in for the engine's relevance floor.
`?slow=3` multiplies every latency. `?theme=light|dark` pins appearance.

**`corpus/` is the default when it is there, and `?data=demo` forces the demo.** `corpus/fetch.py`
captures the set, `corpus/build.py` shapes it. **`corpus/` is absent from a fresh clone of `main`**:
there the dynamic import throws, `app/` lands on the demo and says so in the console. **The published
site carries the corpus**, so a visitor sees real data.

> ### The corpus prints stand-in relevance scores
>
> A capture from Google Patents carries no relevance score, and every row prints one. So
> `corpus/engine.mjs` gives each row a descending stand-in — 0.8862, then 0.0021 less a place, in
> the order it ranks them — the numbers the V8 lab drew. **They are illustrative and app/ computes
> nothing**: a real engine returns its own score and the row prints that. The demo carries its own
> illustrative scores; a row whose score is `null` shows the rank alone.
>
> *Find similar* against the corpus is Google Patents' own `similar` list for the anchor, so its
> order is real.

> ### The drawings and the export are only real against the corpus
>
> `demo/` never names a real holder and never ships a real patent figure — `CLAUDE.md`'s
> client-data boundary — so demo rows render skeleton bars and frames, and a file exported from it
> has empty cells. Both are correct behaviour: a bar means *this value exists and we decline to print
> it*. To see a drawing or a full export, you need the corpus.

---

## What this is

**This is the reference Innovue builds Terrain from**, on their own engine; their build is what the
founder uses. Where a document and `app/` disagree, the code is what was decided. **It is the
reference for the look too**: it was rebuilt from the V8 detail lab, and its type, spacing and
layout are the ones to build.

The partials and stylesheets name the lab as their source. The lab
(`visual-reference/innovue-build/round-4/detail-lab/`) is local and is not published; it is where
the design was chosen, not where it is maintained.

**This tree is published to GitHub Pages as it stands**, against the real corpus rather than the fake
engine — `docs/brief.md` §4 records the decision and `tools/publish-pages.py` is what does it. The
comments go up with it: the repository is public, so every comment is already readable on GitHub.
**That holds only while the repository is public.**

**This file is not a fifth document.** It is the front door for `app/` and holds no rule that is not
already in one of the four. **If it ever states a rule that is not in `docs/design-language.md`, the
rule is in the wrong file.**

---

## The stylesheet order, and why the number is the cascade

One `<link>` per stylesheet, in numeric order. **Not an `@import` chain**: `@import` serialises
discovery and hides which file a rule came from. `tools/check-app.py` asserts that the tag list
matches what is on disk and that `99-reduced-motion.css` is **last**.

| | |
| --- | --- |
| `tokens` `01`–`05` | foundation — tokens, reset, type, skeleton, wait/fail |
| `10`–`16` | primitives — button, chip, field, inline-confirm, menu, empty, popover. **The bench's only**: `index.html` links none of them, and the product's controls are the shell's (`20`) |
| `20` | the shell — the views, the shared controls (segments, chips, popovers, menus), the masthead |
| `30` | the search panel, its scope chips and the settings popover |
| `34` | the split, the list head, the result cards, the record pane's empty state |
| `35` | the record — breakpoints are **container queries on the pane**, so the record lays itself out by the panel's width, as the lab's framed record did |
| `37` | the attribution line |
| `38` | the home surface |
| `40` | the drawing viewer |
| `98` | the bench, `lab.html` only |
| `99` | reduced motion, **which must load last** |

**`99-reduced-motion.css` must load last because most of its rules are same-specificity overrides
declaring end states.** `design-language.md` §6 *Reduced motion* is the contract.

**There is no `@layer`, and the reason is `!important`.** Inside a layer, `!important` *reverses*
layer order, and the reduced-motion block has to be the thing that wins.

**Every phone rule is a media query**, not a class set at load: the layout follows a resize.

---

## The five token tiers

`app/styles/tokens.css` is **the one authored copy** and **the only file permitted to declare a
custom property on `:root`**. `design-language.md` §3.9 is the rule; this is the summary.

| Tier | Count | Declared | Rule |
| --- | --- | --- | --- |
| primitive | 11 | `:root` once | `--n-0`…`--n-10`. No component may read one |
| scale | 28 | `:root` once | Invariant by construction |
| semantic | 29 | **all three blocks** | The dark contract |
| derived | 1 | `:root` once | Resolves *through* a themed token. **Never in a dark block** |
| component-scoped | 2 | the component's own class | Never on `:root` |

**Every other copy of the token block is generated.** `tools/sync-tokens.py --write` writes it into
the loading lab between sentinels; `--check` verifies it **byte for byte** and CI runs it on every
push to `main`. `app/index.html` is not a target: it links `styles/tokens.css`.

### The properties JavaScript sets

**This table is read by `tools/check-app.py` gate B**, which refuses a `var()` that is declared
nowhere, carries no fallback, and is not listed here — so the table cannot go stale while the gate
passes.

**There are none.** No module sets a custom property: the drawing viewer composes its zoom,
rotation and pan into one inline `transform`, and a waiting control or region is a state attribute
(`data-waiting`, `aria-busy`) that CSS reads. A row added here names the property, what sets it,
and the fallback its read carries.

**Every read site carries a fallback, and that is load-bearing.** A `var()` whose property is set
by nothing and whose read has no fallback is *invalid at computed-value time*, and the property takes
its **initial** value, silently.

---

## `js/core/` — the behaviour layer

Dependency-free modules. Each encodes a rule that reads as an implementation detail and is not:

| Module | The rule it carries |
| --- | --- |
| `dom` | `esc` for every string that enters markup |
| `motion` | `reduced()` is read **live**, never cached |
| `wait` | **No loader.** `waitOn` reserves the height and keeps what the region holds, dimmed, with `aria-busy`, until `landIn` replaces it. `failHTML`'s retry button is optional **by rule** |
| `button-wait` | The label stays and the ink drops; `aria-busy` says it is working. Not `disabled` — that drops focus to `<body>` |
| `pop` | **One popover open at a time**, anchored to its button. A pointer opening animates; a keyboard opening skips the motion and moves focus in. Outside press and Escape close it; arrows move inside a menu |
| `viewer` | The drawing viewer. Innermost: it takes Escape, the arrows, + / − and Tab before the page. A drawing we decline to show or one that fails to load says so on the stage |
| `export` | **One column list for both formats**, so a CSV and a Markdown file cannot carry different things. No column the page did not show |
| `toast` | A short line at the foot of the window, also spoken in the polite region |
| `field` | **The technology field, on one value.** Chosen on home; the results surface states it |
| `history` | **The searches run in this browser**, wrapped and versioned; the same search moves to the top rather than repeating |
| `url` | **The search in the address.** A reload, a link or Back reruns what the address holds, and the open record is named in it; on a phone the record is a step Back closes |
| `format` | The jurisdiction as a two-letter code; a holder as one of three things — a string, `null` (the bar), or `''` (*No assignee listed*) |
| `live-region` | Clears and re-sets after 60ms so an **identical** second message announces |
| `generation` `timers` `armed` `esc-stack` `delegate` | the bench's (`lab.html`) and the router's: a counter per channel, a cancellable timer scope, a registry of armed failures, the Escape stack, delegated activation |

### The numbered checks

`lab.html` states each check, proves it in the DOM, and returns a verdict. Press **Run every check**,
or call `window.runAll()`. **Verify checks 3, 4 and 9 with VoiceOver**: an identical second failure
announces twice, a button keeps its name through a wait, and a failure with no way forward offers no
button to tab to.

---

## The engine seam

`js/ports.mjs` is `design/components.md` §1 made executable: **six named ports** — `fields`,
`coverage`, `search`, `sort`, `similar`, `record` — a typedef for each shape, and a `NullEngine`
that implements every port by refusing.

**Every port resolves to `{ok:true, data}` or `{ok:false, code, retryable}`.**

- **A failure is a response and is not an empty one.** *No patents matched* is an answer; *the search
  did not run* is not.
- **The reason is machine-readable; the sentence is ours.** Never return prose for display.
- **`retryable` is part of the answer**, and it is exactly what `failHTML(say, act)` consumes.

**The search returns every row at once**, up to the count in the settings (at most 200). There is
no paging; the list sorts, groups and exports what it holds.

**`null` on an identity field means render the skeleton bar, and it is the only thing that means
that.** A real engine returning real names changes nothing but the presence of a value.

`NullEngine` **is not a stub.** It is what `app/` runs against when `demo/` is deleted, and every
surface has to say *this did not run* rather than throw.

### What the backend team holds

**The engine is built by a separate team.** They hold the packages built from the `handoff-*` tags,
the newest `handoff-2026-11-17`. **The V8 rebuild changes the contract after that tag** — the
`similar` port, the record's `status`, `priority`, `ipcWords`, `kindCode`, `url` and `version`, the
search settings' `rerank` and `priority` basis, and the six ports in place of twenty — and a new
package with a new tag is how it reaches them. `git diff handoff-2026-11-17 -- app/js/ports.mjs
design/components.md` is what has moved. `/terrain-round` builds the package.

---

## `partials/` and `js/surfaces/` — the rest of the tree

**Three partials** — `masthead`, `home`, `surface` — and the host list in `index.html` is the
manifest. `main.mjs` fetches every one, **replaces** its host with the partial's own nodes, and
**awaits all of them before calling any `init()`**: every surface module reads the DOM in `init`,
never at module scope.

**Five surfaces:** `search` (both search panels, the settings and the run), `masthead`, `home`,
`list` and `record`. The list and the record talk by events (`terrain:open`, `terrain:results`), so
the list never imports the record.

**The viewer is built on `<body>`**, because the page behind it is made `inert` and `inert` works
downward.

### The three zones

| | |
| --- | --- |
| `app/js/**`, `app/partials/**` | the contract. **Never holds data** |
| `demo/**` | fake data and the fake engine. **Deletable entirely** |
| the seam | **one import line** in `js/main.mjs`, under a banner |

**Never bend a component toward the demo data's shape; bend the fake engine toward the contract.**

---

## The three `!important`s

| Where | Why |
| --- | --- |
| `*,*::before,*::after{transition-property:none!important;animation:none!important}` | two of the three. The blanket reduced-motion stop |
| `:root.theme-switching *{transition:none!important}` | one frame, so a theme change does not cross-fade |

---

## What is deliberately absent

No build step. No framework. No preprocessor. No bundler. **One** scrim token, read by the drawing
viewer and nothing else. No `@layer`. No `og:image`: it would have to be a raster, which the raster
rule refuses on `main`.

---

## Checking it

```
python3 tools/check-app.py            # the source tree: tokens, theme, hover gates, type scale, the demo seam
python3 tools/sync-tokens.py --check  # the generated token regions, byte for byte
bash   tools/test-gates.sh            # every gate above, watched refusing a planted violation
```

**Add a gate, add its test.** A gate nobody has watched fail is not a gate.
