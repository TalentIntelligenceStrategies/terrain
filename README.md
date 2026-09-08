# TIS Terrain

Patent search with strategic direction, for founders working out where their idea sits. You arrive
with a concept — filed, mid-filing, or nowhere near it — and Terrain shows you who else is in the
space, which technology is adjacent to yours, and where the gaps are.

Terrain is a self-serve product in the **TIS Patent Intelligence** pillar, searching the Innovue
patent database. It is **software, not a report**: you log in and search, and nothing is produced
to order.

This repository is the **design and definition phase** — positioning, product definition and the
design language, settled in writing before application code exists.

## The two pages

| | |
| --- | --- |
| [**The case**](deliverables/terrain-the-case.html) | Why this direction, who it is for, every IPtech capability rated from a founder's position, and the design pass. Carries the working prototype in its second tab. Generated from `docs/case.md`. |
| [**The prototype**](design/previews/terrain-prototype.html) | The interface, running. Four surfaces, twenty-four states, clickable end to end. |

Both are self-contained static HTML — typefaces inlined, no external request, no build step. Open
either over `file://` and it works.

## Every figure here is illustrative

The prototype and the documents were populated from a real project observed inside IPtech. **That
data is not ours to publish**, so it was replaced: the distribution is representative and the
arithmetic is internally consistent, but **no number is a real filing count**. No holder is named
either — holder labels render as skeleton bars by decision, because inventing a name would read as
a live example and transliterating a real one would be fabrication.

Screenshots of Innovue's platform, and the side-by-side deck built from them, are **not in this
repository**. They render a client's data as pixels.

## Layout

```
docs/            the source of truth — four documents, and they win over anything rendered
  brief.md         what Terrain is: positioning, naming, the Innovue relationship
  platform.md      what gets built, and §9 deferred scope
  design-language.md  how it looks: tokens, type, components
  case.md          the outbound argument, for TIS management and for Innovue
design/
  previews/        self-contained HTML design explorations
  components.md    per component, the data shape the engine must return
deliverables/    the case document, GENERATED — see deliverables/README.md
brand/           self-hosted typefaces and TIS marks
PLAN.md          phase state and handoff
CLAUDE.md        how to work in this repository
```

## Building

The case document is generated. Edit the source, never the output:

```bash
python3 deliverables/build.py
```

It reads `docs/case.md`, `design/previews/terrain-prototype.html`, `deliverables/document.css` and
the typefaces in `brand/fonts/`, and it refuses to write a file that is not self-contained. No
dependencies beyond the standard library.

## Before pushing

```bash
./check-before-push.sh
```

Four checks, run against what git actually tracks rather than what is on disk: that no local-only
material is staged, that no client or patent data survives in a tracked file, that nothing tracked
embeds a screenshot, and that the hosted pages reference nothing outside the repository. It exits
non-zero if any of them fires.

## Typefaces

**Urbanist** for text and display, **Inconsolata** for numerals and monospace. Both are
[SIL Open Font License](https://openfontlicense.org/) and are self-hosted in `brand/fonts/`.
Terrain is English-only; that is a decision, not an omission.

## Attribution

Terrain is an endorsed TIS sub-brand. **Powered by Innovue** — the patent database underneath is
Innovue's, and it is cited in body copy where it does credibility work. IPtech is Innovue's
product; this repository reads and argues with its publicly marketed capabilities, which is
competitive analysis, not a claim on it.
