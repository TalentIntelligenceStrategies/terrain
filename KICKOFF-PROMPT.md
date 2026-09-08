# Kickoff prompt

Paste the block below into a fresh Claude Code session opened in `~/Desktop/TIS-Terrain`.
`CLAUDE.md` loads automatically, so this is context and framing rather than a full re-brief —
but it is written to stand on its own if pasted somewhere else.

**If you are picking up work in progress rather than starting fresh, read
[PLAN.md](PLAN.md) instead.** It carries the phase state, what is still owed, the decisions that
are closed, and the verification commands. This file is framing; that one is the handoff.

---

I'm building a new product called **TIS Terrain** and this folder is where it gets designed and
defined. Read `CLAUDE.md` and `docs/brief.md` first — together they carry the positioning, the
naming decisions, the constraints, and the list of what's still open. Don't restate them back to
me; just work from them.

**What Terrain is.** Patent search with strategic direction, for founders working out where their
idea sits. Someone arrives with a concept — filed, mid-filing, or nowhere near it — and Terrain
shows them who else is in the space, what technology is adjacent, and where the gaps are.
Self-serve subscription software, English-native, searching the full Innovue patent database. The
gap analysis is the point: search tools return results, Terrain returns a direction. It is
software, not a report — nothing here is human-produced to order. The ICP is early-stage founders,
not IP departments — they don't know patent vocabulary and shouldn't have to learn any to get
value.

**Where we are.** *Updated 2026-09-04 — this paragraph said "early, nothing settled but the
positioning" and that stopped being true.* There is still no application code and no PRD, and the
phase is still design and definition. But there is now a great deal to work from: four documents in
`docs/`, a canonical IPtech→Terrain capability ledger in `platform.md` §8, a full design language
in `design-language.md`, an outbound case in `case.md`, 31 identified screenshots of Innovue's
IPtech in `iptech-screenshots-identified/`, and a clickable prototype running on a real observed
dataset. **Read [PLAN.md](PLAN.md) for exactly what is done and what is owed.**

The folder is structured for the phase: `docs/` holds the markdown source of truth,
`design/previews/` holds self-contained static HTML explorations, `brand/logos/` holds the TIS and
Innovue SVGs. Application code lands in `app/` later, and that decision gets written into
`docs/brief.md` before it happens.

**How I want you to work here.**

- **Settle it in markdown, then build it.** `docs/` is the source of truth and every render is a
  view of it. Never let a design preview become the only record of a decision.
- **Add to an existing document before creating a new one.** `docs/` has four on purpose —
  `brief.md` is what Terrain *is*, `platform.md` is what gets *built*, `design-language.md` is how
  it *looks*, `case.md` is the argument sent *outward*. I'd rather have one dense file than eight
  thin ones. A new one needs a distinct **kind** of content and a distinct **reader**.
- **Design previews are self-contained** — inline CSS, no shared stylesheet, no build step. There
  is no design system here yet and I don't want one guessed into existence. Extract a shared value
  only once three previews independently ask for it.
- **Don't import the TIS design system to fill the gap.** This folder is intentionally outside the
  TIS brand monorepo so that the design work has real latitude. If something you decide here
  belongs upstream, say so and write it into `docs/brief.md` — then leave it. Never edit the
  monorepo from here.
- **Colour carries information, or it is not there.** *Superseded the monochrome-wireframe rule
  that stood here until 2026-08-31; the reasoning is in `docs/design-language.md` §2, which carries
  three dated amendments — the last of which, 2026-09-05, withdrew the other two.* Colour is
  permitted in exactly three places: discrete states, direction of change on a delta pill, and the
  chart layers. **There is no hue in Terrain** — `--lime` was withdrawn 2026-09-05 and no non-neutral
  primitive replaced it; the categorical marks carry value, not hue.
  **And colour encodes direction, never desirability: no green-means-good anywhere.** There is
  still **no accent**, so primary actions are near-black; a placeholder accent becomes the thing we
  review instead of the structure. Everything else is the neutral ramp.
- **Icons come from Lucide, and nothing else.** No Heroicons, no Feather, no Material, no one-off
  SVGs. Mixing sets shows up immediately in stroke weight and corner radius.
- **No emoji. Plain commit messages, no AI-attribution trailer of any kind.**

**What's locked, and it's a short list.**

- The **endorsed sub-brand architecture** — the TIS mark is in the lockup and the product name sits
  with it. (`TIS Terrain` is the working name and I'm using it throughout, but see below.)
- Innovue is **attribution only**: a "Powered by Innovue" line and the database cited in body copy
  where it does credibility work.
  Innovue never enters the product name or the primary lockup.
- Two typefaces: **Urbanist** for text and display, **Inconsolata** for numerals and figures.
  Both are already self-hosted in `brand/fonts/` — link `brand/fonts/fonts.css` from any preview
  and they work with no server and no build step.
- **Terrain is English-only.** No Chinese surface, no bilingual markup, no `data-zh` attributes.
  The parent TIS site is bilingual; this product deliberately isn't.

**Everything else was from scratch, and much of it now exists.** `docs/design-language.md` holds a
verified neutral ramp, state and categorical colour, a type scale, component specs, a motion
vocabulary and a dark-mode contract — Terrain's own system, not the monorepo's. Treat the remaining
gaps as licence, not as something to fill with the parent system's answers.

**The name is open on purpose — don't resolve it for me.** `TIS Terrain` is what I'm going with for
now and everything is written as though it holds, but it isn't locked. It also hasn't been
trademark- or domain-cleared, so no logo work until that happens. Flag it if a task runs into it
rather than picking an answer.

Start by telling me what you'd want to settle first, and why — then wait for me to pick. If
[PLAN.md](PLAN.md) has open phases, say which one you'd pick up and why, rather than proposing
something new.

---

## Handoff prompt — for picking up work in progress

The block above is for a *fresh* session. Use the block below instead when work is already
underway: it routes to `PLAN.md` rather than re-briefing, and it front-loads the things an agent
is most likely to get wrong in its first few actions. Added 2026-09-04.

---

I'm handing you work in progress on **TIS Terrain**, in `~/Desktop/TIS-Terrain`. It's a new
English-native self-serve SaaS product in the TIS Patent Intelligence pillar — patent search with
strategic direction, for founders working out where their idea sits. It's in the design and
definition phase: no application code yet, and the work is producing three deliverables for TIS
management and for Innovue, whose IPtech engine sits underneath.

**Read these, in this order, before doing anything:**

1. `CLAUDE.md` — loads automatically. How to work here, and the rules.
2. `PLAN.md` — **the handoff document.** Phase state, what's owed with file:line references,
   decisions that are closed, what's blocked by data, and copy-paste verification commands.
3. `docs/brief.md` — what Terrain is. `docs/platform.md` §8 — the canonical IPtech capability
   ledger, 59 rows. `docs/design-language.md` §2, §3.7, §7 — the colour rules and the built
   components. `docs/case.md` — the outbound argument; *What travels with this* states what is sent.

Don't restate any of it back to me. Work from it.

**The state, in three lines.** Every phase, 0 through 10, is done and committed. Phase 5 is largely
absorbed because four of its seven charts are blocked by data we don't hold, not by design
decisions. The three deliverables are defensible on their own terms.

**There is no phase to start on.** `PLAN.md` §G is what a next pass would pick up, and the current
direction is the public repo: the folder was audited, the client and patent data replaced with
illustrative figures, and the screenshots and comparison deck kept local. Ask me what I want before
assuming the next task.

**Things that will waste your time or my credibility if you get them wrong:**

- **`docs/` is the source of truth.** Settle it in markdown, then build. If a preview and a
  document disagree, the document wins. `PLAN.md` is operational state, not a fifth document — if
  it and the four disagree, they win.
- **Don't reopen the palette.** It took four rounds on 2026-09-04 and it's settled. `PLAN.md` §C
  is the summary, `design-language.md` §2 and §3.7 the reasoning, including the sets that were
  tried and rejected with measurements. Don't re-litigate; don't rediscover them.
- **`docs/platform.md` §9 is `DEFERRED — NOT IN SCOPE`,** and §7a.8 is further back still.
  Nothing in either is built, specced, wireframed or designed against. If a task appears to need
  one, stop and say so.
- **Colour carries information or it isn't there, and it encodes direction, never desirability.**
  No green-means-good. Matrix density stays tonal grey; the filings series stays neutral. Every
  coloured element also carries a word or a shape.
- **The skeleton contract:** chrome is real, data is a bar, nothing is invented. No fabricated
  patent number, company or year, ever. Two drawn-shape exceptions exist and a third has to be
  argued in `design-language.md` §8 *before* it's drawn.
- **Lucide icons only. No emoji. Never an AI-attribution trailer in a commit.** English only — no
  CJK face, no bilingual markup, no `data-zh`. Never edit the TIS monorepo from this folder.
- **Verify by rendering and looking at the PNG.** A missing typeface fails silently, and three
  real layout defects in this build were only visible on a render. Commands are in `PLAN.md` §E.
- **Count programmatically, not by hand.** The ledger tally drifted twice; a script caught it both
  times.
- Two environment traps: the Bash tool's working directory persists between calls and Python
  inside it may not inherit it, so use absolute paths — and filenames in `visual_inspo/` contain a
  non-breaking space before `PM`, so glob them rather than retyping.

**How I want you to work.** Stop at the end of every phase and report five things, short: what
landed with paths; what the phase turned up that we didn't know when we planned it; what that means
for the phases still ahead; anything you couldn't settle without me; and the one-line ask to
proceed. Don't start the next phase until I say go. Use `AskUserQuestion` when a choice would
change the work materially — and bring measurements, not impressions.

Commit locally on natural seams, with plain messages and no trailer.

Start by telling me which phase you're picking up and what you intend to do in it — then wait.
