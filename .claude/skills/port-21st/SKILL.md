---
name: port-21st
description: Pull a component from 21st.dev and rewrite it into a TIS Terrain preview. Use when the user pastes a 21st.dev URL or install command, asks to search the 21st catalog, or says "add this component" / "find me a component for X" while working in TIS-Terrain. Covers discovery via the 21st MCP server, the React+Tailwind to vanilla rewrite, and the audit.
---

# Porting a 21st.dev component into Terrain

**Terrain has no React, no Tailwind, no build step, and no npm.** Previews are single self-contained
HTML files with inline CSS. So a 21st component never arrives as a dependency here — it arrives as
**a reference you re-implement**, and the port is a translation job, not an install.

That is the whole difference from the monorepo's version of this skill, which mounts components as
real React islands. Do not follow that procedure here. If the target is actually the TIS website,
say so and switch folders — this skill will produce the wrong artifact.

`docs/design-language.md` is the contract. `build-terrain-preview` is where the component ends up.

## 1 · Discover

The `21st` MCP server is configured local-scope for this folder. Search and list tools are free.

**The handoff is a URL.** The user browses and pastes
`https://21st.dev/@<author>/components/<slug>`. Resolve it to a demo id, which is what
`get_component` needs:

```
mcp__21st__search { query: "<slug words>", author: "<author>", type: "component", limit: 30 }
→ match the result whose `url` equals the pasted URL → use its `id`
```

`author` returns a recency-ordered list of that author's **public** components capped at 30, so a
prolific author's target can fall outside the window and private components never appear. When
resolution fails, ask the user for **"Copy all files"** from the component's menu.

Other entry points: `search_picker` (renders an inline picker so the *user* chooses),
`list_bookmarks` (the flat Saved set — **not** `list_bookmark_lists`, which is named folders and is
usually empty), and `get_inspiration` when nothing fits.

**Ignore both "Copy CLI command" and "Copy prompt → Claude Code"** in the component's menu. Both
assume a shadcn + Next project with `components.json`, and this folder deliberately has none of
that. You would spend the first half of the job un-following the instructions.

## 2 · Retrieve

`mcp__21st__get_component` with the demo id. You get `componentCode`, `demoCode` (read it — it
shows the props and therefore the states), `registryDependencies.filesWithRegistry`, and
`npmDependencies`.

`npmDependencies` is unreliable — it has come back `{}` for components importing three packages.
**Derive dependencies by reading the import statements.** It rarely matters here, since everything
gets stripped, but it tells you what the component actually does.

## 3 · Triage before you write anything

Reject, and say why, if:

- **The component's value is its colour.** Terrain is neutral plus semantic states, with no accent
  decision. A component whose whole idea is a gradient, a vivid palette or a colour-coded state
  machine has nothing left after the rewrite.
- **Its value is a heavy interaction** — drag-reorder, virtualised list, canvas chart. Previews are
  static or lightly animated. There is no runtime to host it.
- **`design-language.md` already specifies this component.** Grep the doc first. The system already
  has a widget card, hairline table, segmented control, status chip, delta pill, slide-over and
  profile menu.
- **It is chrome that fights the shell.** Terrain's shell is settled: submark top-left, project
  sidebar, profile at the sidebar's base. A component that wants to own the page frame is not a
  fit.

The best use of 21st here is the narrow one: a component whose **layout or interaction detail** is
worth borrowing — a table row treatment, an empty state, a menu, a stat tile.

## 4 · Rewrite

Fixed mapping. Do not improvise a different one per component.

| In the payload | What to do |
|---|---|
| JSX structure | Flatten to semantic HTML. `<div>` soup becomes the real element — `nav`, `ul`, `table`, `button`, `dialog`. |
| Tailwind spacing/layout utilities | Translate to CSS against Terrain's 4-based space scale. Do not import Tailwind, do not approximate — use the nearest scale step. |
| Tailwind colour utilities, any `bg-*`/`text-*`/`border-*` with a hue | **Delete.** Re-derive from Terrain's semantic tokens. A borrowed palette is the single fastest way off-brand. |
| `dark:` variants | Delete. Terrain's dark pass is token-level; components never carry theme variants. |
| `style={{ … }}` with a hex, `rgb()` or a gradient | Delete or tokenise. This path bypasses the token system entirely. |
| Any raw hex | Delete. **No component may reference a raw hex or a primitive `N0–N10`** — that is the dark-mode contract, and one hex breaks it. |
| Shadows, especially coloured ones | Terrain has one shadow token, for genuinely floating things. Everything else is a 1px hairline. |
| `lucide-react` icons | Keep the *icons*, inline the SVG. Lucide is the mandated set. |
| Any other icon set | Replace with the Lucide equivalent, or drop the icon. |
| `framer-motion` / `motion` | Re-express as CSS transitions on Terrain's `--ease` and duration tokens, or strip. |
| `next/image`, `next/link`, `"use client"` | Plain `<img>` / `<a>`; delete the directive. |
| `useState` and friends | If the state is worth showing, render it as a static variant or a `:has()`/`:checked` CSS toggle. Previews carry almost no JS. |
| Fonts the component names | Delete. Urbanist and Inconsolata, per `design-language.md`. Every numeral is Inconsolata. |
| Placeholder content — names, numbers, avatars, logos | **Delete.** Replace with skeleton bars per the contract in `build-terrain-preview`. This is the rule most likely to be violated by accident, because 21st components ship full of plausible fake data. |

## 5 · Audit

```bash
# raw hex or rgb outside the :root block — breaks the dark-mode contract
grep -nE "#[0-9a-fA-F]{3,6}\b|rgba?\(" design/previews/<file>.html | grep -v -- "--"
# Tailwind class names that survived the rewrite
grep -nE 'class="[^"]*\b(flex-|gap-|px-|py-|mt-|mb-|w-|h-|text-(xs|sm|base|lg|xl)|bg-|rounded-(sm|md|lg|xl))' design/previews/<file>.html
# fake data the component shipped with
grep -nEi "US ?[0-9]{7,}|lorem|john doe|acme|example\.com" design/previews/<file>.html
```

Then render and `Read` the PNG per `build-terrain-preview` step 5. A ported component that looks
like it came from somewhere else will be obvious in the image and invisible in the diff.

## 6 · Close out

If the port introduced a pattern the system does not have yet, **write it into
`docs/design-language.md`** before you stop. A component that exists only inside one preview is the
thing `CLAUDE.md` is guarding against — `docs/` is the source of truth, previews are a view of it.

Do not add a token to make one borrowed component compile. Pick the nearest existing one, or decide
deliberately that the system needs a new value and record why.
