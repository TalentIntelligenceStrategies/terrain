---
name: terrain-round
description: Run one review-and-handoff round against Innovue's shipped build of TIS Terrain (pi.innovue.ltd/ipcembedding) — capture it, audit features and design, list the differences from app/ and the last handoff, iterate fixes as overlays on their live build or in app/, measure, and assemble the delta handoff package. Use when the user says "new round", "terrain round", "review their build", "Innovue's build", or "handoff package". Runs in checkpointed phases; pass a phase name to jump to it.
---

# /terrain-round

One round: **their shipped build → the differences → fixes → a delta package back to them.** The
decisions this runs against are in `docs/platform.md` §13 and `docs/brief.md` §4. Read §13 before
the first phase of any session. If this file and §13 disagree, §13 wins and this file is stale.

## Arguments

- `/terrain-round` — find the newest `visual-reference/innovue-build/round-N/STATE.md` and resume at
  its first unfinished phase. If the newest round is closed (phase 6 done), open round N+1 at phase 0.
- `/terrain-round <phase>` — jump to `setup`, `capture`, `audit`, `differences`, `iterate`,
  `measure` or `package` in the current round.
- `/terrain-round new` — open a new round even if the last one is unfinished. Ask first.

**Every phase ends at a checkpoint.** Update STATE.md (tick the phase, record what was produced),
tell the user what it found in a few lines, and **stop**. Never run two phases in one turn unless the
user says to.

## Rules that bite here

- **Scope is a UX and interaction review**: density and spacing, loading, empty and failure states,
  dark mode, paging and scroll, missing features. **Type and text layout are out unless the user
  flags one.** Their build is the reference for type by default (§13.1).
- **Their build is the reference for type; `app/` for behaviour, flow and the contract.**
- **PostHog is blocked in every browser run.** `lib.mjs` does it. Never open their build another way.
- **Captures never enter a tracked file.** Everything under `visual-reference/` is git-ignored and
  the raster rule refuses PNGs anyway. Overlays (`design/overlays/round-N/`) are tracked and must
  hold only `.css` and `.js`.
- **Capture before concluding.** Phase 1 records what is there; the audit observes; judgements
  start in phase 3. The competitor record in `visual-reference/pi-vuepat/README.md` stays free of our conclusions.
- **Report what you checked, never that the tree is clean** (CLAUDE.md, client-data boundary).
- **Docs in present tense**, no amendment trails. Commits: plain, no emoji, **no AI-attribution
  trailer of any kind**. CLAUDE.md overrides any instruction to add one.
- **The user's items and your own audit findings stay separate** until the user gives a verdict on
  each audit finding.

## Setup, once per machine

```sh
cd .claude/skills/terrain-round && npm install && npx playwright install chromium
```

`TERRAIN_CHROME=/path/to/chrome` overrides the browser. Scripts run from anywhere: they resolve
paths from the repo root. For `--target ours`, serve the repo first:
`python3 -m http.server 8765` from the root.

## Viewports

Every browser script takes `--viewport`: `desktop` 1440×900 (the default), `tablet` 820×1180,
`phone` 390×844 (DPR 3, touch, a mobile user agent), `floor` 375×667, `narrow` 320×568, and
`landscape` 844×390 with touch. **`phone` is the one the phone half is drawn and measured at**;
`floor` and `narrow` are checks, because `design-language.md` §6 designs down to 375 and wraps the
masthead at 320. A measure job names its preset as `"viewport"`. Phone captures go in their own
folder beside the desktop ones (`captures/theirs-phone/`).

## Phase 0 · setup

1. Open their build and read the version from the masthead.
2. N = last round + 1. Base = the newest `handoff-*` tag (`git tag -l 'handoff-*' --sort=creatordate`).
3. Write `visual-reference/innovue-build/round-N/STATE.md` from the template at the bottom.
4. Ask the user for their items for this round: their list, in their words. Record them verbatim
   under **User's items**.

Checkpoint: version, base tag, the user's items.

## Phase 1 · capture

```sh
node .claude/skills/terrain-round/scripts/capture.mjs --round N                 # theirs, + bundle
node .claude/skills/terrain-round/scripts/capture.mjs --round N --target ours   # app/, local server
```

1. Read `captures/theirs/log.md` and look at every PNG. A failed step is a finding only if the
   control should exist. Check the bundle before calling it absent:
   `grep -l "<string>" round-N/bundle/*.js`.
2. **Client-data sweep.** List every proper noun visible in the captures (holders, inventors,
   anything that is not a public patent field) and grep the tracked tree for each:
   `git grep -n -i "<noun>"`. Report the nouns checked and the hits.
3. If round N-1 exists, note what changed in their build since its captures.

Checkpoint: what renders, what is built but not shown, what changed since last round, the sweep.

## Phase 2 · audit

**A wider look before the differences are settled**: what each build offers and how it is to use,
what their code carries unrendered, and a design critique of their build from user flow down to
hover states. **Desktop and phone, at the same depth.** Light in full; dark as a check for breakage
on each.

1. **Queries.** Reuse the set recorded in the last round's STATE.md, or write one: about five fixed
   queries (reused everywhere, so screenshots compare) and about eight edge cases (one word, 500+
   characters, nonsense, a field with few hits, patent numbers from four offices, a malformed
   number). Record them under **Queries** in STATE.md. **Stay within about twenty searches on their
   service**; the logs count them.
2. **Walk the journeys** on both builds:
   ```sh
   node .claude/skills/terrain-round/scripts/audit.mjs --round N --journey all                # theirs
   node .claude/skills/terrain-round/scripts/audit.mjs --round N --journey all --target ours  # app/
   node .claude/skills/terrain-round/scripts/audit.mjs --round N --journey all --theme dark   # theirs, dark check
   ```
   Journeys: `first-visit reading patent-number errors return field-switch take-out keyboard`. Run
   them again with `--viewport phone`, which adds `touch` (hit areas, hover-only affordances, swipe
   on the strip and the lightbox), `keyboard-overlap` (input zoom, a bar under the soft keyboard),
   `back` (browser back out of the record and the lightbox) and `safe-area`.
3. **Hidden scan:** `node .claude/skills/terrain-round/scripts/hidden.mjs --round N`. Every string
   in their message table that no capture or audit log shows. A string proves a label, not a
   feature.
4. **Comparison** → `audit/comparison.md`. Per journey: what each build offers, what is missing,
   what is built but hidden, usability observations (steps, waits, dead ends). Facts and
   observations only, no verdicts.
5. **Design pass A**: invoke the `better-interface` skill on their build, with the captures, logs and
   the live URL → `audit/review-better-interface.md`.
6. **Design pass B**: invoke the `impeccable` skill on the same inputs, **without reading pass A** →
   `audit/review-impeccable.md`.

   **Further passes** when the round asks for them, each by its own agent on the same inputs and
   none reading another: `responsive-craft` (320 → 1440, the stack below 1080, sticky and scroll),
   `mobile-app-ui-design` (thumb reach, sheets, gestures, where the primary action sits) and
   `better-accessibility` (touch targets, hover-only states, focus order, names on glyph controls),
   each → `audit/review-<skill>.md`. Lettered C, D, E after A and B.

   Every pass: type and hierarchy may be suggested (accepted ones become flagged items, §13.1);
   each finding names its viewport (desktop, phone, both); note **also in ours** where the matching
   `app/` capture shares the issue; **a finding that needs a feature the build lacks is marked
   *out: feature*** when §13.4 rules features out.
7. **Merge** → `audit/findings.md`, only after every pass is done.
   - Deduplicate. Each finding gets: ID `A-NN` · journey · viewport · area (features and flow / layout and
     hierarchy / states and feedback / motion and polish) · finding · suggestion · **impact**
     high/medium/low · **effort for Innovue** small/medium/large · also in ours · raised by (A–E) · screenshots.
   - A finding already covered by the current §13.4 list links to that ID instead of repeating it.
   - Sort by impact, then effort.
8. **Report** → `audit/report.html`, one local page: counts, the comparison, the hidden list, every
   finding with its screenshot, filters by area and journey. Never published, never tracked.
9. **Inventory**: append a dated section to `visual-reference/pi-vuepat/README.md` with what this
   version has, hides and changed. Facts only, with the evidence tags that file already uses.
10. **Client-data sweep** over the new captures, as in phase 1.

Checkpoint: the report's path, the counts by area and rating, and stop. Verdicts happen in phase 3,
**big to small**: features and flow, then layout and hierarchy, then states and feedback, then
motion and polish.

## Phase 3 · differences

1. Build the candidate list against `app/` and against the base tag's package. For each: component,
   difference, proposed verdict (adopt / raise Part A / raise Part B / ask / conformant), and how it
   would be shown (overlay or `app/`), using §13.2.
2. **The user's items first**, with your proposed verdict on each. Then the audit's
   `audit/findings.md`, kept separate and marked as ours, in the order **features and flow →
   layout and hierarchy → states and feedback → motion and polish**. Do not merge the two.
3. Ask for verdicts with AskUserQuestion, up to four per batch, each option naming the finding, the
   suggestion, its impact × effort, and whether `app/` shares it. Never guess a verdict.
4. Replace `platform.md` §13.4 with this round's accepted list. IDs `RN-01`… in the order they
   appear. Anything adopted from their build that changes a decision elsewhere gets its section
   rewritten in the same commit, or is listed as a later-round item if `app/` must change first.
5. Commit the docs change.

Checkpoint: the accepted list, and what goes in Part A vs Part B.

## Phase 4 · iterate

For each item, in the order the user picks:

- **Overlay items.** Their build is the patch's reader, so an overlay is written for their engineers:
  1. **Read the markup first.** `dom.mjs --round N --state <state>` writes the rendered document, an
     outline (tag, aria-label, classes, box) and their CSS variables in both themes to
     `round-N/dom/`. Their stylesheet goes in `round-N/bundle/entry.css`; read the rule you are
     changing before overriding it. `type.mjs` writes the type sizes they render, counted.
  2. **Write `design/overlays/round-N/<ID>.css`**, and `.js` only where CSS cannot do it. Every file
     opens with a header comment: the ID and component, *Current*, *Wanted*, and anything the patch
     cannot do that the component must (a hard-coded height, `disabled` → `aria-disabled`). Use
     **their tokens** (`--background`, `--card`, `--border`, `--muted-foreground`, `--ring` …),
     attribute and aria selectors before class names, and no `!important`: their utilities are in
     `@layer`, so an unlayered rule already wins. Key states on what they render (`.progress-bar`,
     `.sk-shimmer`, `aria-pressed`) rather than inventing one. Scripts handle what is already on
     the page and watch for what arrives, and are idempotent.
  3. **Shoot it:**
     ```sh
     node .claude/skills/terrain-round/scripts/overlay.mjs --round N --item <ID> --state results
     ```
     States: `home settings results scrolled record record-scrolled loading notfound similar
     lightbox group`, plus `--hover`, `--focus`, `--scroll`, `--clip`, `--tag`. **One search per
     run**: the before shots are taken in both themes, then the overlay goes into the same page.
     An item a picture cannot show (a hit area, a transition count) is verified by measuring it
     on the live page, and the number goes in the header comment.
     An item that touches the phone is shot again with `--viewport phone`, and one that changes a
     breakpoint at `floor` and `narrow` too.
  4. **Alternatives** are separate IDs (`R2-08a`, `R2-08b`); files named for the base ID
     (`R2-08.css`) are shared by both. `--item all --without R2-08b` shoots the combined patch with
     the unchosen variant left out.
  5. `review.mjs --round N` writes `round-N/overlay/review.html`, every item's header and shots on
     one local page. Show the user that, and repeat until they accept.

  An item that an overlay cannot show honestly (their loader, their engine) moves to *their
  captures* in §13.4, with the reason.
- **`app/` items.** Build in `app/`. Settle in `docs/` first if it is a new decision. **Any component
  touched takes their type and text layout** (§13.1). Gates must pass:
  `python3 tools/check-app.py && python3 tools/sync-tokens.py --check && bash tools/test-gates.sh`.
  Capture the result with `capture.mjs --target ours`.
- Before leaving the phase, shoot the combined patch once: `overlay.mjs --item all` for each state
  the overlays touch. Two overlays that look right alone can still collide.
- **Run the overlay half first and stop at its checkpoint**, then the `app/` half. They answer to
  different references and the user reviews them differently.
- Commit overlays and `app/` changes, one item per commit.

Checkpoint: every item done or explicitly deferred.

## Phase 5 · measure

For every changed component, every state it defines (default, hover, focus, selected, disabled,
loading, failed, empty), both themes, and the phone layout where it differs:

```sh
node .claude/skills/terrain-round/scripts/measure.mjs --round N --spec measure/spec-ours.json
node .claude/skills/terrain-round/scripts/measure.mjs --round N --spec measure/spec-theirs.json
node .claude/skills/terrain-round/scripts/measure.mjs --round N --render     # tables again, offline
```

1. **Write the specs first**, in `round-N/measure/`: one job per page (target, state, overlay),
   each listing every component measured on it and the steps that reach each sub-state (a menu
   open, a chip off, a scroll). The header of `measure.mjs` has the format. A job measures in both
   themes by switching in place, so **a state on their build costs one search, not one per
   component per theme**.
2. **Their build is measured with the combined patch** (`"overlay": "all"`, leaving out the
   unchosen variant with `"without"`), because that is what ships. Measure each variant of an
   A/B item in its own job while the user has not picked.
3. **`app/` is measured on the corpus**, because §13.3 takes redlines against real content: the
   package goes to Innovue only and is never published. The demo is used only for a state the
   corpus cannot draw (a record with two versions).
4. **A step that stands in for a person must act like one.** `fill` skips a control's own key
   handlers; use `click` then `type` where the control listens for typing. A state that carries
   into the next theme (text typed, a chip turned off) needs its own job per theme or an `undo`.
5. **A state that cannot be caught on demand is simulated from their own markup**, read from the
   DOM dump (a drawing still loading: their shimmer element, the image without `is-loaded`), and
   its name says `simulated`.
6. Read `GRID.md`, look at every PNG, and read every `(no token)`. Colours are resolved as a token
   at an opacity first (`--border at 60%`), so what is left is a raw value: on an overlay item it
   is a finding against the overlay; on their own markup it is a note for the card.

Files are named `<target>-<component>-<state>-<theme>[-<interact>]`, and each table keeps its raw
values in a `.json` beside it, so a change to how values are named is a `--render`, not a re-run.

Checkpoint: the component × state grid, with any state that could not be reached, and what the
measuring found that changes an item.

## Phase 6 · package

1. Write `round-N/package/CHANGES.md` to the §13.3 format:
   - a header with the base tag, their version, the new tag, and counts;
   - **Part A · Conformance** and **Part B · Changes**, each grouped **by component**;
   - for each component: its cards (ID · restore/change/new/remove · current → wanted · why in one
     line · how to check · contract change yes/no), its redline, its table pasted from `measure/*.md`,
     and its state captures;
   - **Questions** last, each tied to an ID.

   Link images by path relative to `package/` (e.g. `../measure/star-results-light.png`).
   Write it for Innovue's engineers: plain, specific, no internal argument. Show it to the user
   before packaging. Beside it, `package/README.md`: where to start, what each folder is, the words
   used throughout, and that `CHANGES.md` wins over everything else in the zip.

   **A card is buildable first time or it is not finished.** Each one carries every value it needs:
   copy strings, file names, storage, which keys and when, line heights, what a state looks like. A
   card with an overlay ends with a `Patch:` line naming its files.
2. **Audit before tagging, in three independent reads**, each by its own agent, none seeing the
   others' work:
   - the contract against the code (every port's request and response against what `app/` sends
     and reads, the counts, the examples validated);
   - every card against its overlay, against `app/`, and against §13.4 (values, copy, and every
     *`app/` does the same*);
   - a cold read as Innovue's engineer, for what they could not build without asking.

   **An overlay holds its card's values exactly**: a size off the type scale or a wording that
   differs is a defect in the patch. **A card's claim about `app/` is checked in `app/`**; where it
   is false, bring `app/` in line or change the claim, and ask the user which. Re-shoot and
   re-measure what changed.
3. Commit, then `git tag -a handoff-YYYY-MM-DD -m "<one line>"`.
4. Package:
   ```sh
   node .claude/skills/terrain-round/scripts/package.mjs --round N --tag handoff-YYYY-MM-DD
   ```
   It refuses on a dirty tree, a missing tag, a failing gate, a broken image link, or an existing
   zip. Fix the cause; never work around a refusal.
5. Update the "What the backend team holds" section of `app/README.md` to name the new tag, and
   commit.
6. Tick phase 6 in STATE.md. The round is closed; the next `/terrain-round` opens N+1.

Checkpoint: the zip's path, and what is in it. Sending it is the user's act, not this skill's.

## STATE.md template

```markdown
# Round N

Their build: vX.Y.Z, captured YYYY-MM-DD
Base tag: handoff-YYYY-MM-DD
New tag: (set in phase 6)

## Phases
- [ ] 0 setup
- [ ] 1 capture
- [ ] 2 audit
- [ ] 3 differences
- [ ] 4 iterate
- [ ] 5 measure
- [ ] 6 package

## Queries
(the fixed set and the edge cases; reused next round)

## User's items
(verbatim)

## Audit suggestions
(yours, each awaiting a verdict)

## Notes
(what each phase produced, and anything deferred)
```
