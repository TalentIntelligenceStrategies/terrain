---
name: tis-copy
description: Write or review Terrain / Patent Search copy — deck slides and speaker notes, website and sales lines, interface strings, emails to buyers. Enforces what Terrain may claim (docs/brief.md §1, §3), the banned phrases, and English that reads as first-language. Use for "write copy", "review this copy", "headline", "deck line", "tagline", "CTA", "is this sayable", or any line a buyer, founder or practitioner will read.
---

# /tis-copy

How to write and review a line of Terrain copy. **This skill is procedure, not canon.** It applies
rules owned elsewhere and defines none of its own:

| Source | Owns |
| --- | --- |
| `docs/brief.md` §1 | What Terrain may say about a set, *trusted* vs *near*, *generative AI* not a chatbot's name, where a reading may sit (a report's AI-written part only) |
| `docs/brief.md` §3 | What may be said about the engine and Innovue's research; credentials cited as Innovue's; a deck names them *our IP-technology provider* |
| `sales/answers.md` Part 4 *Never say* | The banned words and wrong values (local only) |
| `~/Desktop/TIS/brand/brand-voice.md` §4 | TIS's company-wide banned phrases. **Read it, don't recall it.** Read-only, and only §4: its voice anchor and its Innovue section do not govern Terrain |
| this skill | How to execute a copy task against them, and the checks a rule list cannot do |

**Where they disagree, `docs/brief.md` wins.** Terrain's voice is not yet defined;
until it is, the voice is the bans plus the brief, and this skill does not invent one.

## Route by size

| Task | Lane | Steps |
| --- | --- | --- |
| Headline, deck line, button, chip, error, alt text | **String** | 1 → 2 → 4 → 5 |
| Slide, section, card set, email | **Block** | 1 → 5 |
| Deck, page, long-form | **Long** | 1 → 5, and show the skeleton before prose |

Do not inflate a string into a pipeline.

## 1 · Locate before writing

- **Is it already said?** Grep `sales/answers.md` and `docs/brief.md` for the claim. A deck line
  that exists is reused verbatim; a second phrasing of one claim is drift.
- **Which claim is it?** A claim about the **record** (real, as published) holds by construction. A
  claim about the **set** (near, finds) is an aim and reads *built to return*. Anything about
  **Innovue's evaluation** is 🔒 unless `sales/answers.md` marks it ✅ as a roadshow figure, which is
  cited as Innovue's with its scope. Either way, remind the user to confirm with Innovue before it
  leaves.
- **Who reads it?** Founder, practitioner or institutional buyer. The practitioner changes the
  vocabulary a line may use, and the buyer how seats are sold; neither changes what the product
  claims.

## 2 · Draft (string lane)

Write three candidates. Name the claim each carries and its basis. Keep one and say why.

**The swap test does the most work.** Substitute a competitor's name — a generative AI tool, Google
Patents, an analyst platform. If the line still reads true, it is generic. Rewrite with what only
Terrain can say: one sentence in and a set out; real records as published, with nothing generated
in the search; one report the founder and the backer both read, whose readings show their sources.

## 3 · Draft (block and long lanes)

Reader-first opening: the first clause is the reader's situation, and Terrain arrives as the reply.
One claim per paragraph. Asymmetric weight — the section that matters gets the room.

## 4 · Check

Run [`references/detection.md`](references/detection.md) in full, then
[`references/en-native.md`](references/en-native.md) on all English. Both are mechanical; a failure
is a rewrite, not a discussion.

## 5 · Report

- Where the copy lands, and every file it must land in.
- Each claim, with its basis (`brief` §, `answers` entry) and its public-use mark (✅ 🔒 ⛔).
- Any rule it deliberately breaks, and on whose authority.
- **For anything public that rests on an Innovue figure, the confirm reminder.** It is not
  optional.

## Red lines

Scan every output.

1. **No banned phrase** — `sales/answers.md` Part 4 and `brand-voice.md` §4. Read both.
2. **No hedge** — *may*, *could potentially*, *helps you*. Commit or cut the claim.
3. **No unbacked claim** — every claim carries its basis: a published figure with its scope, a
   behaviour of the product, a named public source. Softening an unbacked claim is not a fix.
4. **No reading outside a report's AI-written part** — no verdict, no *strong match*, no *white space*, no
   *open ground*, anywhere. A sentence must stay true if the rest of the world's patents were added
   to the index (`brief.md` §1). Inside an AI-written section a reading is marked as AI-written, cites what
   it rests on, and says *may* wherever it touches a claim; never *infringes*, *is clear*, *is novel*.
5. **Report means the patent report**, and nothing else. Never
   *insights*, *decision-ready*, *actionable* or *AI-powered*, and never *free* or *Pro*: Terrain has no
   tier word.
6. **No figure without its scope.** A figure from Innovue's internal research stays out of public
   material until Innovue confirms it; a roadshow figure (✅ in `sales/answers.md`) is cited as
   Innovue's, with its cutoffs.
7. **No swap-test failure.**
8. **No urgency theatre** — no scarcity, no countdown, no FOMO. The evidence is the sell.
9. **No emoji** in copy.
10. **English only** — no Chinese copy and no bilingual markup in anything Terrain ships.

---

*`detection.md` adapts [great-writer](https://github.com/d-wwei/great-writer) (MIT). Both
references were adapted from TIS USA's copy of the TIS monorepo's `tis-copy` skill; the Chinese
track was left behind, because Terrain is English-only.*
