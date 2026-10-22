---
name: presentation-outline
description: Outline a Terrain / Patent Search deck — sections, slide types and the narrative arc, before any slide copy is written. Use when starting a deck or asking "outline a presentation about…", "structure a deck for…", "what slides should this have". Outputs a markdown outline ready for presentation-content.
---

# /presentation-outline

The structure of a deck, settled before a word of slide copy. **What a slide may claim is not this
skill's call**: `docs/brief.md` §1 and §3 decide it, `sales/answers.md` holds the deck line for each
claim, and `/tis-copy` checks it.

## Principles

- **Slides start a conversation, they are not a script.** Each slide prompts what the speaker says.
- **One point per slide.** A slide carrying two is two slides or a cut.
- **Fewer slides, more weight.** The section that matters gets the room.
- **The audience always knows where they are**, from the section label and the dividers — never from
  colour. **Terrain has no hue**; a section never gets one (`docs/design-language.md` §2).

## The arc

Adapt it; don't pad it. For a buyer deck:

```
1. Opening      title · the one question Terrain answers
2. The gap      there's no shortage of patent information — what's scarce is
                information you can trust and act on (brief §1)
3. The product  one sentence in, the real patents near it out, a report on the ones
                you star — shown with real app captures, not described
4. How it works retrieving for the search; a report whose readings cite their patents
5. What it is not   no verdict, no white space, not a professional search (a strength)
6. For whom     founders, and the backers behind them — investors, incubators,
                accelerators (brief §1 Who it is for)
7. Close        one ask
```

Sections expand or contract. A seven-minute demo may be 3 and 4 only. **For a practitioner room**,
3 is a live run from `sales/answers.md` Part 6 (claim 1, a cutoff, the list) and 4 carries the
evidence against other tools (Part 1, C1, C2); 5 still says it is a first look, not the search of
record.

## Slide types

| Type | When | Example |
| --- | --- | --- |
| **Statement** | Land one point | "Generative AI writes. We retrieve, and show our sources." |
| **Big statement** | One idea, maximum weight | "Real patents. Exactly as published." |
| **Question** | Create tension | "What's already filed near your idea?" |
| **Section divider** | Signal a shift | "How it works" |
| **Product** | Show the thing | A capture of the results surface against the corpus |
| **Data** | A figure, with its scope on the slide | Only figures marked ✅ in `sales/answers.md` |
| **Framework** | A comparison or a flow | Search → Find similar → Star → Export |
| **Quote** | Borrowed authority, attributed | A named public source, never an invented testimonial |
| **Next step** | Drive the ask | "Run it on one idea" |

**No recap slide that concludes**, and no data slide whose caption reads the figure. A count is
admissible; a sentence about what it means is not (`brief.md` §1).

## Output

```markdown
# [Deck title]
[One line: audience, setting, length]

## 1. [Section]
### Slide 1 · [purpose]
- **Type:** Statement
- **Headline:** [the line]
- **Supporting:** [one line, or none]
- **Basis:** [brief § / answers entry] · [✅ 🔒 ⛔]
```

**Every slide carries its basis and mark.** A 🔒 slide is built as a visibly marked placeholder. A ✅
slide citing Innovue's roadshow figures says they are Innovue's and carries their scope. Either way,
the user is reminded to confirm with Innovue before the deck leaves.

## Workflow

1. **Ask** the audience, the setting (live, sent, recorded) and the length.
2. **Name the three things that must land.**
3. **Map the arc** against the one above.
4. **Draft the outline** in the format above.
5. **Cut** every slide that doesn't earn its place.
