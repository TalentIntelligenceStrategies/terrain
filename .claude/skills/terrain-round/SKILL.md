---
name: terrain-round
description: Run one review-and-handoff round against Innovue's shipped build of TIS Terrain (pi.innovue.ltd/ipcembedding) — capture it, list the differences from app/ and the last handoff, iterate fixes as overlays on their live build or in app/, measure, and assemble the delta handoff package. Use when the user says "new round", "terrain round", "review their build", "Innovue's build", or "handoff package". Runs in checkpointed phases; pass a phase name to jump to it.
---

# /terrain-round

One round: **their shipped build → the differences → fixes → a delta package back to them.** The
decisions this runs against are in `docs/platform.md` §13 and `docs/brief.md` §4. Read §13 before
the first phase of any session. If this file and §13 disagree, §13 wins and this file is stale.

## Arguments

- `/terrain-round` — find the newest `visual-reference/innovue-build/round-N/STATE.md` and resume at
  its first unfinished phase. If the newest round is closed (phase 5 done), open round N+1 at phase 0.
- `/terrain-round <phase>` — jump to `setup`, `capture`, `differences`, `iterate`, `measure` or
  `package` in the current round.
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
- **Capture before concluding.** Phase 1 records what is there; judgements start in phase 2. The
  competitor record in `visual-reference/pi-vuepat/README.md` stays free of our conclusions.
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

## Phase 2 · differences

1. Build the candidate list against `app/` and against the base tag's package. For each: component,
   difference, proposed verdict (adopt / raise Part A / raise Part B / ask / conformant), and how it
   would be shown (overlay or `app/`), using §13.2.
2. **The user's items first**, with your proposed verdict on each. Then **Audit suggestions** in a
   separate block, each marked as yours. Do not merge them.
3. Ask for verdicts with AskUserQuestion. Batch related items; never guess a verdict.
4. Replace `platform.md` §13.4 with this round's accepted list. IDs `RN-01`… in the order they
   appear. Anything adopted from their build that changes a decision elsewhere gets its section
   rewritten in the same commit, or is listed as a later-round item if `app/` must change first.
5. Commit the docs change.

Checkpoint: the accepted list, and what goes in Part A vs Part B.

## Phase 3 · iterate

For each item, in the order the user picks:

- **Overlay items.** Write `design/overlays/round-N/<ID>.css` (and `.js` only if CSS cannot do it).
  Selectors target their markup, so read the DOM first (`page.evaluate` or the captures' log), and
  prefer attribute and aria selectors over hashed class names. Then:
  ```sh
  node .claude/skills/terrain-round/scripts/overlay.mjs --round N --item <ID> --state results
  ```
  States: `home results scrolled group record phone`. Show the user before and after, in both
  themes. Repeat until the user accepts. Offer alternatives side by side when the item asks for
  them, as separate IDs (`R2-08a`, `R2-08b`).
- **`app/` items.** Build in `app/`. Settle in `docs/` first if it is a new decision. **Any component
  touched takes their type and text layout** (§13.1). Gates must pass:
  `python3 tools/check-app.py && python3 tools/sync-tokens.py --check && bash tools/test-gates.sh`.
  Capture the result with `capture.mjs --target ours`.
- Before leaving the phase, shoot the combined patch once: `overlay.mjs --item all` for each state
  the overlays touch. Two overlays that look right alone can still collide.
- Commit overlays and `app/` changes, one item per commit.

Checkpoint: every item done or explicitly deferred.

## Phase 4 · measure

For every changed component, every state it defines (default, hover, focus, selected, disabled,
loading, failed, empty), both themes, and the phone layout where it differs:

```sh
node .claude/skills/terrain-round/scripts/measure.mjs --round N --component <name> \
  --selector '<css>' --state results [--interact hover|focus] [--theme dark] \
  [--target theirs --overlay <ID>]
```

Measure `app/` items on `--target ours`, and overlay items on `--target theirs --overlay <ID>`.
A value printed as `(no token)` on an overlay item is a finding: either the overlay should use a
token, or their build lacks one, and the card should say which.

Checkpoint: the component × state grid, with any state that could not be reached.

## Phase 5 · package

1. Write `round-N/package/CHANGES.md` to the §13.3 format:
   - a header with the base tag, their version, the new tag, and counts;
   - **Part A · Conformance** and **Part B · Changes**, each grouped **by component**;
   - for each component: its cards (ID · restore/change/new/remove · current → wanted · why in one
     line · how to check · contract change yes/no), its redline, its table pasted from `measure/*.md`,
     and its state captures;
   - **Questions** last, each tied to an ID.

   Link images by path relative to `package/` (e.g. `../measure/star-results-light.png`).
   Write it for Innovue's engineers: plain, specific, no internal argument. Show it to the user
   before packaging.
2. Commit, then `git tag -a handoff-YYYY-MM-DD -m "<one line>"`.
3. Package:
   ```sh
   node .claude/skills/terrain-round/scripts/package.mjs --round N --tag handoff-YYYY-MM-DD
   ```
   It refuses on a dirty tree, a missing tag, a failing gate, a broken image link, or an existing
   zip. Fix the cause; never work around a refusal.
4. Update the "What the backend team holds" section of `app/README.md` to name the new tag, and
   commit.
5. Tick phase 5 in STATE.md. The round is closed; the next `/terrain-round` opens N+1.

Checkpoint: the zip's path, and what is in it. Sending it is the user's act, not this skill's.

## STATE.md template

```markdown
# Round N

Their build: vX.Y.Z, captured YYYY-MM-DD
Base tag: handoff-YYYY-MM-DD
New tag: (set in phase 5)

## Phases
- [ ] 0 setup
- [ ] 1 capture
- [ ] 2 differences
- [ ] 3 iterate
- [ ] 4 measure
- [ ] 5 package

## User's items
(verbatim)

## Audit suggestions
(yours, each awaiting a verdict)

## Notes
(what each phase produced, and anything deferred)
```
