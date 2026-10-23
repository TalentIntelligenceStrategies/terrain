---
name: presentation-content
description: Write Terrain / Patent Search slide copy — headlines, supporting lines and bullets that are bold, minimal and spoken to rather than read. Use when writing slides, or asking "write content for…", "draft slides about…", "help me phrase this slide…". Works from an outline made with presentation-outline.
---

# /presentation-content

Slide copy that is bold, minimal, and designed to be spoken to. **The claim on each slide comes from
`sales/answers.md`'s deck line wherever one exists** — reuse it verbatim; a second phrasing of one
claim is drift. Check everything with `/tis-copy`.

## Principles

- **Headlines are statements, not descriptions.** "Real patents, exactly as published", not
  "Overview of data quality".
- **If it takes more than five seconds to read, cut it.**
- **Emphasis through scale, not bold.** Big words at a light weight.
- **The slide prompts what the speaker says**; it does not say it for them.

## Headline patterns

| Pattern | Example |
| --- | --- |
| Statement | "Generative AI writes. We retrieve, and show our sources." |
| Question | "What's already filed near your idea?" |
| Action | "Describe it in one sentence." |
| Framing | "How it works" |

## Body patterns

**Lead-in and one line**

```
**Every result is a real patent**
Its own numbers, holder, dates, claims and drawings. Nothing generated in the search.
```

**Bullets: three or four at most, each earning its place.** Vary the count; not every list is three.

## Templates

```markdown
**Section label:** HOW IT WORKS
**Headline:** It matches meaning, not keywords
**Supporting:** A patent written in other words can still come back.
**Basis:** answers B1 · ✅
```

```markdown
**Section label:** THE PRODUCT
**Type:** Product
**Headline:** One sentence in. The patents near it out.
**Capture:** results surface, corpus, light theme
**Basis:** brief §1 · ✅
```

A data slide prints the figure **and its scope** on the slide, and only figures marked ✅. A 🔒
figure is a marked placeholder.

## Slide conventions

Three rules that hold across published decks, whichever market they were made for:

- **One accent, used once.** On a slide, the accent marks the one thing to look at. Terrain's accent
  is the ink pair (`docs/design-language.md` §3.8), so this is weight and position, not a hue.
- **Fix a bland slide with containment and label density, never with colour.** A panel, a rule, a
  label on every value — not a tint.
- **Every figure's source sits on the slide that carries it**, footnoted, not on a sources page at
  the end.
- **The engine's maker is *our IP-technology provider*** on a slide, in a footnote and in the notes,
  and no slide carries their mark (`docs/brief.md` §3). The footer is the TIS submark alone.

## What a Terrain slide never says

`sales/answers.md` Part 4 is the list. The ones a slide reaches for most: *accurate*, *strong
match*, *white space*, *insights*, *AI-powered*, *free*, *report* for anything but the patent report, a chatbot's name, a score as a
percentage, and any figure without its scope.

## Before and after

> "Our platform leverages advanced AI to deliver comprehensive, actionable patent insights."

> **Headline:** Real patents. Exactly as published.
> **Supporting:** Nothing summarized, nothing interpreted — a clean base for your own analysis.

## Workflow

1. **Name the one thing** the audience must remember from this slide.
2. **Find its deck line** in `sales/answers.md`. Write one only if none exists, and add it there.
3. **Add only what earns its place** — cut what the speaker will say anyway.
4. **Read it at arm's length.** If it doesn't parse in three seconds, simplify.
5. **Run `/tis-copy`.**
