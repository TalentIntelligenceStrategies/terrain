# TIS Terrain — component manifest

> **What each component reads, what it needs from your engine, and which IPtech capability supplies
> it.**
>
> The source of truth for every component spec is
> [`docs/design-language.md`](../docs/design-language.md); for what gets built,
> [`docs/platform.md`](../docs/platform.md). Where this file and those disagree, **they win.**
>
> **The third column is why this file exists.** Tokens tell you what our interface looks like. The
> data shape tells you what we would be asking your engine to return — which is the half a cost
> estimate actually attaches to.
>
> **It is not aspirational.** Every shape below is what the working prototype already consumes.
> `design/previews/terrain-prototype.html` runs on a `DATA` object holding an illustrative set — a
> full 8×8 grid, a jurisdiction split, a legal-status split. **The shapes are exact; the values are
> not real.** Each row names the function that renders it, so you can check the shape against running
> code rather than against our description of it.
>
> **Notation.** `{ field: type }` — an object. `[…]` — an array. Field names are ours and are
> illustrative; the *shape* is the claim, not the spelling.

---

## 0 · The assumption that voids every row below

**The engine returns structured values, not rendered pictures.** You cannot re-token a PNG.

This mattered most when the rows below were charts, and it has not stopped mattering — it has moved.
The two payloads left are a **patent list** and a **record**, which are text by nature; the one that
could still arrive rendered is the **grouping** (§4 question 2), and a fishbone returned as an image
is a fishbone Terrain cannot filter a list with, theme, or make keyboard-reachable.

**The drawings are the exception that proves it, and they are rasters on purpose.** A patent figure
*is* the published document; there is nothing to re-token. What we need there is a URL and permission
to fetch it (§4 question 4), not a structure.

---

## 0.1 · What a failed response looks like

**A failure is a response, and it is not the same thing as an empty one.** *No patents matched* is an
answer; *the search did not run* is not. A component that cannot tell them apart renders "nothing
found" over an outage, which is the one wrong thing it can say. **Every shape below needs a way to say
which of the two happened**, and an empty array is not it.

**Partial success is the normal case, not an exception.** The list, the grouping, the record and each
drawing resolve independently and each arrives when its own data lands, so a grouping failing while
the list stands is ordinary. A response that can only be wholly good or wholly bad forces the surface
to blank a working result set to report one broken panel.

**The reason is machine-readable; the sentence is ours.** Return a code and whatever detail helps us
log it — never a prose string intended for display. Our copy states the fix rather than the fault and
does it in our own voice, and an engine cannot know either. A message we did not write is a message
that cannot be made true of our interface.

**Whether it is worth retrying is part of the answer.** The surface offers *try again* only where
trying again could work. Something permanent — a set too small to group, a record that does not exist
— offers the founder a different route, and guessing wrong in either direction wastes their time or
hides their way out.

**A run that did not finish is not a run that was charged.** The meter is returned to where it was, so
the ledger behind it must distinguish an attempted run from a completed one
(`platform.md` §7.2, §6.1).

**The export port inverts this and is the only one that does.** The file is built in the client from
rows already delivered, so it is handed to the founder *before* the ledger is called. A refused
ledger call must not cost them their download — the bytes were never yours to withhold.

---

## 1 · Built, and data-bearing

Every component below consumes engine data. **The names are the ports** — the keys of `PORTS` in
[`app/js/ports.mjs`](../app/js/ports.mjs) — and every one returns the same envelope:
`{ ok: true, data }` or `{ ok: false, code, retryable }`. §0.1 is why.

*One dependency on the points page is worth reading before the rest: the columns and the runs list
both need a **per-run ledger**, not a balance. Everything else on that page is arithmetic over what
the meter already returns.*

| Component | Tokens it reads | Data shape it needs | Capability that supplies it |
| --- | --- | --- | --- |
| **The search** · `search` | the composer, `--accent` on the primary | **request** `{ query: string, field: string, settings }` where `settings = { sources: [cc], kinds: ['granted'\|'applications'], count: 10\|20\|50\|100\|500, basis: 'filed'\|'published', from: 'YYYY'\|'', to: 'YYYY'\|'' }` · **response** `PatentSet + { said, elapsedMs, balance }`. **One call.** There is no reading step, no criteria to approve and no build stream; the five ports that were those are gone | Semantic retrieval from a plain-language sentence, as PI-VuePat already does it. `sources × kinds` is the index cross-product |
| **The grouping panel** · `cluster` | `--border` `--text-1/2/3`, no accent, **no caption** | **response** `{ head: string, spines: [{ label, leaves: [{ id, label, n: int }] }] }` — **two levels and no more.** A leaf carries a **count, not a list of ids**: the client holds twenty rows at a time and never the whole set, so a leaf naming its patents would name ones the list does not have. **Selecting a branch is therefore a REQUEST** — `facets({groups:[leafId]})` returns a fresh first page — which also means the badge and the count above the list come from the same place. **The leaves must PARTITION the set**: a patent counted under every class it carries makes the branches sum to more than the results, which is the defect `corpus/FINDINGS.md` records as finding A. **Too few to group is a SUCCESSFUL response**, `spines: []` with `ok:true` — refusing would offer a retry that cannot help | **AI魚骨**, pointed at a result set. **Question 2 in §4** — the whole panel depends on an answer we do not have |
| **Find similar** · `rerank` | none of its own | **request** `{ anchors: [patentId] }` · **response** `{ order: [patentId] }` over the **same set**. No patent enters or leaves; the interface moves existing rows into the returned order. A `null` response is a refusal, not an empty ordering | **Nearest-neighbour retrieval pointed at a SET.** **Question 1 in §4, and it is a product risk rather than a question** |
| **The starred set and the export** · `export` | `--skeleton-strong` on a starred row | **request** `{ ids: [patentId], format: 'csv'\|'md' }` · **response** `{ balance }`. **The ledger, not the file.** Every field the file carries is already in the client, so the bytes are built there; this call exists because a run costs points. It follows that a refusal must not cost the founder their download | Nothing. This is the one component with **no Innovue dependency at all**, and that is the point of it |
| **The list and its foot** · `list.mjs` | `--surface` `--surface-sunken` `--border` `--text-1` `--state-live` `--state-expired` `--skeleton` `--skeleton-strong` | `{ patents: [{ id, number, skim, holder, where, year, status: 'live'\|'expired'\|'pending', score }], order: [id], matched: int }`. **Four fields per row and no more** — that is what the row DRAWS. It CARRIES two it does not draw, `number` and `where`, because the starred set leaves as a seven-column file and the export reads the row rather than the record; fifty starred patents must not be fifty record calls. **`order` is a first-class field and not an array index**: rows are keyed by patent, and the focus return, the re-sequence and its reversal all resolve through that key. **`matched` and `patents.length` differ** by what a facet binned, and printing the wrong one beneath the standing chip is a recorded regression. **Sort, filter and paging are all requests** — `{ sort }`, `{ facets }` and the next page each return this same shape. They cannot be client-side: twenty rows arrive at a time, so sorting what the client holds would sort a page rather than a result, and the founder could not tell. **None of them spends points** (`platform.md` §6.1). **Jurisdiction is deliberately not a facet**, because `where` renders as a bar and a founder cannot check a filter on a value they cannot see. **`null` on any identity field renders a bar**, and exactly one demo row is populated so the surface can be judged with words on it | **Bulk record retrieval** + **名稱統一** + **legal status per patent in bulk** for the four drawn fields. Without the first this degrades to a list of titles, which is a search result rather than evidence. The status vocabulary is question 6 |
| **The grouping filter chip** · above the list | `--r-chip` `--border` `--text-2` | `{ id: leafId, label: string, n: int }` — **which branch the founder selected, and how many patents are in it.** *`n` must agree with the leaf's own count in the grouping payload — the two are the same number and the client must not compute one from the other.* Several may be active at once and each is removable | Nothing new — a projection of the grouping's own payload |
| **The patent record** · `record` | `--surface-sunken` `--text-2` `--r-inner`, `figure-s` for the claim numbers, `--figure-ground` for the drawings | `{ title, number, appno, kind, ipcMain, ipc: [symbol], holder, inventors: [name], filed, published, where, status, abstract, claims: [string], figures: [{ n, src, alt }] }` — **eleven identifiers, the abstract, the claim set as published, and the drawings.** `claims` is an **array, one entry per claim**, not one blob: a patent numbers its claims and counsel is pointed at claim 4 by number. **`figures[].n` is the PUBLISHED figure number and not the index** — the claims refer to figures by number, and a renumbered figure is a different document. **Two absences must not collapse**: `figures: []` means this record HAS no drawings; `figures: [{n, src: null}]` means it has them and we decline to show them. **Nothing here may arrive interpreted** — no highlight offsets, no decode, no plain-English gloss. One demo record is fully populated, with a recognisably fictional holder and inventors and a number deliberately above the issued range, so a real patent is never named | **The single largest ask in this file.** Your record view holds all of it, so the fields plainly exist; what we cannot see is whether the claim text is reachable **as published** rather than as your reading of it. Drawings are question 4, status is question 6 |
| **The handoff row** · the record's five-field projection | inherits the record's `<dl>` | **Nothing new — a five-field projection of the record above**: `number, holder, where, status, ipc`. Recorded because it looks like its own shape and is not | **Legal status** + **IPC**. Depth is question 6: full symbol or class only |
| **Status chip** · `.status` | `--state-live` `--state-expired` `--state-pending` + their tints | `'live' \| 'expired' \| 'abandoned' \| 'pending' \| null` — **four words over three hues.** *Abandoned* takes expired's hue because the hue means **not enforceable**, which is true of both; the word is what separates a patent that was granted and lapsed from an application that never was. **Collapsing them is not a simplification, it is a false statement** — real data carries at least five raw statuses, and folding them into two made the interface say *Expired* about ten pending applications and five abandoned ones. `null` renders NOTHING: not a bar, because this is an absent value rather than a withheld one | **Legal status, resolved, per patent.** Question 6 asks whether it is in the response at all — your result card carries kind code and application type, and neither is a status. **The VOCABULARY matters as much as the field** |
| **Project switcher** · the masthead menu | `--surface-sunken` `--text-2`, `--skeleton` | `{ projects: [{ id, name, updatedAt }] }` | **專案** *if* projects live in IPtech and are reachable programmatically; Terrain-owned if not. We do not know which — see §4 |
| **Delta pill** · `.delta` | `--state-up` `--state-down` + tints, `--r-chip` | `{ value: number, previous: number }` — the same measure at two time points | **None identified.** Specced in the stylesheet and applied nowhere, because we hold one time point — see §4 |
| **Usage meter** · `points` | `--text-2` `--text-3`, `figure-s` tabular | `{ balance: int, costPerRun: { runType: int } }` — a **balance**, not a percentage and not a quota. `costPerRun` is a map rather than one int, because a search and an export are not the same cost. *The charge lands when Search is pressed, not when the set lands — `platform.md` §7.2. That is a timing rule, not a shape change* | **Usage metering in points.** Which unit it counts is question 5, and the answer changes `costPerRun`, not the shape |
| **Balance card + arc meter** · `points` | `--surface-sunken` track, `--text-1` fill, `figure-xl` + `.fig-sub`, `micro` | `{ balance: int, allowance: int, periodEnd: date }` — the **allowance is the field that presupposes a plan shape**. `periodEnd` renders as a bar | Nothing from the engine. `allowance` and `periodEnd` are **ours**, and they do not exist until pricing closes |
| **Plan card** · `renderBilling` | `--surface`, `figure-l` + `.fig-sub`, `.sk` for the tier name, `.ur` rows for invoices | `{ planName: string, allowance: int, price: money \| 'XXX', period: enum, periodEnd: date, invoices: [{ date, amount: money \| 'XXX', status: 'paid' \| 'failed' }] }` — **`planName` and `periodEnd` render as bars, `status` as a dot plus a word, and `price` and every `amount` as the literal `XXX`.** *A bar and an `XXX` are not the same refusal, and this is the only field in the manifest of the second kind: **a bar means a real value that is not ours to print**; **`XXX` means nobody has chosen one yet** (`platform.md` §12). Rendering the second as the first would claim a price exists somewhere and is merely being withheld.* `allowance` and `periodEnd` are shared with the balance card above; **`price` and `period` appear on no other component.** All three of `allowance`, `price` and `period` come from **one constants block in our code** — which is a fact about our implementation rather than about any shape you return. | **Nothing from the engine, and nothing from IPtech at all** — the first row in this file whose capability column has nothing to fill it. A plan and an invoice are ours or a payment processor's. It does not exist until pricing closes (`platform.md` §12) |
| **Support message** · `sendSupport` | `.ta`, the `.lm` topic menu, `.btn-primary` | `{ topic: enum, body: string, replyTo: email }` — `replyTo` is **not asked for**: it is the account's own address, and it renders as a bar | **None.** Terrain-owned, and deliberately not the composer — `design-language.md` §7 carries why a support field may not wear the thing you type your idea into |
| **The FAQ** · Help's *Common questions* | `.hlp-qa` `<dl>`, `t-micro` group headings, `--text-1` / `--text-2` | `{ groups: [{ label, items: [{ q: string, a: string }] }] }` — **static content, ours, shipped in the page.** Recorded because it looks like a payload and must never become one: an answer fetched at runtime is an answer that can disagree with the build that renders it. **No answer may restate labelling** (`platform.md` §6.4), and they stay **open** — no disclosure, because the questions are the scan target and the answers run one to three lines | **None.** Terrain-owned |
| **Run-type cards** · `usCards`, `usCount` | `.rt`, `--border`, `micro` + `figure-l` + a 12px unit | `{ runs: [{ type, points: int, count: int }] }` **for the whole period**, plus `costPerRun` above. `≈N more` is `balance / costPerRun[type]` and is computed, never returned. Static | Derived from the ledger below. The **mapping** from our three run types to your modules is `platform.md` §6.1, and it is unsettled because your surface meters nothing — question 5 |
| **Columns** · `usColumns`, `usBins`, `usStep` | `--chart-series`, `--border` grid | `{ daily: [{ date, byType: { runType: int } }] }` — **one entry per day, run counts not points**, so the series and the cards cannot drift. Weekly and monthly are binned here, never requested. This is the one genuinely new shape on the page | **The per-run ledger behind the meter, and the page's only real dependency.** Question 5 asks it in the form that matters: a balance alone cannot draw this. If only a running total is exposed, this component and the one below do not exist and the rest of the page still does |
| **Runs list** · `runs` | `.ur` on 1px `--border` dividers, `figure-m` | `{ runs: [{ id, kind, project, when, cost: int }] }` — `when` and `project` are **identities and render as bars**. Sorted client-side, so **no `sort` parameter is needed** | The same per-run ledger the columns need. A balance cannot produce this |

**The list ports are all requests, and that is the load-bearing half.** Twenty rows arrive at a time,
so the client never holds the whole set: `patents`, `patentsPage`, `sort` and `facets` each hand back
a `PatentSet` and each can fail independently. Sorting client-side would sort a page rather than a
result, and the founder would have no way to tell.

**The home surface needs two more**: `fields` → `{ fields: [{ id, label, icon, ready }] }` for the
technology tiles, and `coverage` → `{ scope: string, sources: [{ source, updated }] }` for what is in
the corpus and when it was taken in. **`coverage` cannot currently state its own size**, which is
question 8.

---

## 3 · Reads tokens, needs no engine data

The structural layer. Listed once rather than as rows, because a data-shape column reading *none*
twenty times is filler:

> the shell and its masthead · the project switcher · the profile row and menu · the card · the info
> affordance · the segmented control · **the anchored popover**, which carries the search settings ·
> the list's **sort and filter menus** · **the search bar and its four toggles** · the composer ·
> buttons · the skeleton bars themselves · **the settings row, the text field, the switch and the
> inline confirm** · **the figure viewer's action bar, thumbnail strip and zoom ladder** · **Account
> settings and Help entire**.

**The sort and filter menus are computed entirely client-side over data the list already holds**,
which is the whole reason they are cheap. `newest`/`oldest` read the `year` the row already carries;
the facets read `status` and `kind`, which are already printed as words.

**A jurisdiction facet is refused for exactly the reason this section exists to make visible.** It
would need a value the payload renders as a bar, so the filter would be unverifiable by the person
using it. A control the founder cannot check is worse than a control they do not have.

**The figure viewer reads tokens and needs no engine data beyond the image URLs themselves.** Zoom,
rotation and pan are `transform` on a custom property; the ladder is seven fixed stops in the
client. Nothing about how a drawing is displayed is a question for your engine.

**Account settings and Help are listed whole rather than by component**, because they are made
*entirely* of this layer: a name, an address, a preference and a message are not things a patent
database knows.

**No component in Terrain references a primitive or a raw hex**, and dark mode is therefore a swap of
semantic tokens with two named component exceptions — the two `.foot-mark-*` selectors on the
attribution line, which a custom property cannot carry because it cannot carry an `src`.

**The counts live in [`design-language.md`](../docs/design-language.md) §10.1 and §3.9**, and
`tools/check-app.py` refuses any copy of them that disagrees with `app/styles/tokens.css`. They are
not repeated here — a number repeated across files drifts, and this one did, in three of them at
once.

## 4 · What we could not name — and these are questions, not gaps

Writing the third column is what produced this list. A component whose data shape we cannot name is
not a hole in the manifest; it is a question we had not yet asked. **This file is the canonical
list** and [`docs/platform.md`](../docs/platform.md) §12 points at it; **no fifth document is
needed**, because every question here stays attached to the component that raised it and a bare list
of questions loses that link.

**The first is a product risk, not a question.**

1. **Can nearest-neighbour retrieval be pointed at a result set rather than at one patent?**
   *Find similar* takes the founder's starred patents as anchors and re-orders the set by nearness to
   them. On your own surface the same primitive is pointed at **one** patent — *Source patent (n)* —
   and whether it generalises to a set is the one capability in §1's table that is not confirmed.

   **If the answer is no, the star collects and no longer finds.** That is not a degraded feature; it
   is half the reason a founder stars anything. We would rather know now than design around an
   assumption.

2. **Can a taxonomy be generated over a result set we supply?** The grouping panel is two levels of
   branches with a count and a patent-id list per leaf, generated *after* retrieval over the set that
   came back. Your own fishbone partitions its result set exhaustively, which is what suggests this is
   possible — but over **your** search, not over a set handed to you.

3. **Who supplies the per-patent "open this in the source" URL?** The source varies by jurisdiction —
   Google Patents, WebPat, TIPO — so the interface cannot construct it. We need the engine to return
   both the **URL and the label**, per patent: the affordance is ours, the destination is yours.

4. **Drawings and PDFs — what are the URLs, and does CORS permit a client-side fetch?** The viewer
   already works against images fetched by the browser. A patent *package* — the starred set's
   drawings and PDFs as one file — cannot be assembled client-side without both, and yours are served
   over IPFS.

5. **How is a search metered?** Terrain keeps a points balance and charges at submit, refunding a run
   that does not land. Your surface shows no metering of any kind, so we have no model of what a run
   costs you, and the whole subscription rests on it.

6. **Is legal status in the response and merely unprinted, or absent?** Terrain's status chip is a
   primary signal — for a US founder, *expired* is the single most decision-relevant fact on a row.
   Your result card carries kind code and application type, and neither is a status.

   **And the vocabulary matters as much as the field.** Real data carries at least five distinct
   statuses; collapsing them into two makes *Abandoned* render as *Expired*, which is a different
   fact about a patent stated with full confidence.

7. **Is 500 an engine ceiling or an interface one?** Your settings offer 10 · 20 · 50 · 100 · 500. We
   page at twenty against a set the engine holds, so the ceiling decides whether a founder can ever
   see everything that matched.

8. **How many documents are in each index?** The field exists in your bundle and is not rendered. A
   coverage table that lists sources and dates but not sizes reads as complete, and a founder has no
   way to learn otherwise.

**One component generated no question and that is worth saying:** the export. Every field it writes is
already in the client, so it needs nothing from you — which is also why it is the one thing in
Terrain that cannot be taken away by an answer.
