---
name: presentation-notes
description: Write speaker notes for a Terrain / Patent Search deck — scannable prompts for conversational delivery, not scripts. Use when asking "write speaker notes for…", "talking points for…", "what should I say on this slide…", or when preparing to present a deck live.
---

# /presentation-notes

Notes for speaking, not reading.

**Speaker notes are held to exactly the rules slide copy is. A claim you can't print is one you
can't say.** Everything in `docs/brief.md` §1 and §3 and `sales/answers.md` Part 4 applies to what
is spoken, and a leak in a talk track is as public as one on a slide.

**What notes are for that slides are not:** the backup. A slide carries the deck line; the note
carries the answer to the follow-up question, from the matching `sales/answers.md` entry, with its
basis. A figure marked 🔒 stays out of the note as well as the slide until Innovue has confirmed
it — remind the user before the deck is presented outside TIS.

**The inverse never applies.** Nothing banned on a slide becomes sayable because it is only spoken.

## Per slide

```markdown
## Slide: [Headline]

**Key point:** [the one thing they must remember]
**Open with:** [the first sentence]
**Talk track:**
- [prompt]
- [prompt]
**If asked:** [the likely follow-up → the answers.md entry that answers it]
**Transition:** [the bridge to the next slide]
```

## By slide type

- **Statement** — the story behind it: what led here, what follows.
- **Question** — pause and let it land before answering.
- **Product** — narrate what the user does, step by step, on the capture. On the search, say what
  came back and never what it means; on a report, say what each section answers and that its
  readings cite their patents.
- **Data** — say the scope aloud with the figure, every time.
- **Divider** — one line of framing.

## Delivery cues

```markdown
**Delivery:**
- [PAUSE] after the question
- Good moment for: "Questions so far?"
```

## By room

- **Institutional buyer** — they ask the hard technical questions first; keep `sales/answers.md`
  sections A–E to hand. Never position against the programme's own IP counsel.
- **Founders** — less on the engine, more on the flow and the file they leave with.
- **Practitioners** — claim 1 in, a cutoff date, a ranked list across offices; keep
  `sales/answers.md` Part 6 (the demos) to hand. They draw the legal conclusions; never say a
  result *is* prior art.
- **Recorded or sent** — tighter, stronger signposting; assume no follow-up question gets asked.
