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
> **It is not aspirational.** Every shape below is what `app/` already reads and sends, and
> [`app/js/ports.mjs`](../app/js/ports.mjs) is the same contract as code: the port names, the envelope
> and a typedef per shape. [`demo/engine.mjs`](../demo/engine.mjs) answers every port with an
> illustrative set — **the shapes are exact; the values are not real.** Where this file and `app/`
> disagree, `app/` is what was decided and this file is stale.
>
> **Notation.** `{ field: type }` — an object. `[…]` — an array. The field names are the ones
> `app/` reads; a different spelling is a change on both sides, not a translation.

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

Every component below consumes engine data. **The names are the ports** — the nineteen entries of
`PORTS` in [`app/js/ports.mjs`](../app/js/ports.mjs) — and every one returns the same envelope:
`{ ok: true, data }` or `{ ok: false, code, retryable, detail? }`. §0.1 is why. `code` is one of
`UNAVAILABLE` `TIMEOUT` `RATE_LIMITED` (retryable) or `NO_CORPUS` `NOT_FOUND` `UNSUPPORTED`
`INSUFFICIENT` (not); an unknown code is treated as `UNAVAILABLE`. **The client branches on
`retryable` everywhere and on `code` in exactly one place**: `INSUFFICIENT` from `search`, which
sends the founder to their points rather than offering a retry.

*One dependency on the points page is worth reading before the rest: the columns and the runs list
both need a **per-run ledger**, not a balance. Everything else on that page is arithmetic over what
the meter already returns.*

| Component | Tokens it reads | Data shape it needs | Capability that supplies it |
| --- | --- | --- | --- |
| **The search** · `search` | the composer, `--accent` on the primary | **request** `{ query: string, field: string, settings }` where `settings = { sources: [cc], kinds: ['granted'\|'applications'], count: 10\|20\|50\|100\|500, basis: 'filed'\|'published', from: 'YYYY'\|'', to: 'YYYY'\|'' }` · **response** `PatentSet + { elapsedMs: int, balance: int }` — the surface prints `matched`, the time and the new balance. `field` is the selected technology tile's `id` from `fields`. **One call.** There is no reading step, no criteria to approve and no build stream; the five ports that were those are gone | Semantic retrieval from a plain-language sentence, as PI-VuePat already does it. `sources × kinds` is the index cross-product |
| **The grouping panel** · `cluster` | `--border` `--text-1/2/3`, no accent, **no caption** | **response** `{ head: string, spines: [{ label, leaves: [{ id, label, n: int }] }] }` — **two levels and no more.** A leaf carries a **count, not a list of ids**: the client holds twenty rows at a time and never the whole set, so a leaf naming its patents would name ones the list does not have. **Selecting a branch is therefore a REQUEST** — `facets({groups:[leafId]})` returns a fresh first page — which also means the badge and the count above the list come from the same place. **The leaves must PARTITION the set**: a patent counted under every class it carries makes the branches sum to more than the results, which is the defect `corpus/FINDINGS.md` records as finding A. **Too few to group is a SUCCESSFUL response**, `spines: []` with `ok:true` — refusing would offer a retry that cannot help | **AI魚骨**, pointed at a result set. **Question 2 in §4** — the whole panel depends on an answer we do not have |
| **Find similar** · `rerank` | none of its own | **request** `{ anchors: [patentId] }` · **response** `{ order: [patentId] }` over the **same set**. No patent enters or leaves; the interface moves existing rows into the returned order. A `null` response is a refusal, not an empty ordering. **`anchors` is an array and ONE of them is the ordinary case, not an edge**: the starred set sends what the founder starred, and the open record sends itself without being starred. Nothing in the request distinguishes them, which is the point — what changes is only what the interface says it ordered by | **Nearest-neighbour retrieval pointed at a SET.** **Question 1 in §4, and it is a product risk rather than a question** |
| **The starred set and the export** · `export` | `--skeleton-strong` on a starred row | **request** `{ ids: [patentId], format: 'csv'\|'md' }` · **response** `{ balance }`. **`ids` of length one is a real call**, not a degenerate one: the record's closing block exports the patent being read, through the same builders and the same columns, so a file of one cannot carry different fields from the set it came out of. **The ledger, not the file.** Every field the file carries is already in the client, so the bytes are built there; this call exists because a run costs points. It follows that a refusal must not cost the founder their download | Nothing. This is the one component with **no Innovue dependency at all**, and that is the point of it |
| **The list and its foot** · `list.mjs` | `--surface` `--surface-sunken` `--border` `--text-1` `--state-live` `--state-expired` `--skeleton` `--skeleton-strong` | `{ patents: [{ id, number, skim, holder, where, year, status: 'live'\|'expired'\|'abandoned'\|'pending'\|null, score: number\|null, inventors: [name], abstract, ipcMain, filed, published, kind, figs: int\|null, thumbs: [{n, src, alt}] }], order: [id], matched: int }`. **The row draws three bands — identity, party and date, and what it claims — and `thumbs` is not one of them**: a field is a value read OFF the patent, a drawing is the patent. **Band one is two lines**: an eyebrow carrying `status`, the position in the order and `number`, with `score` at its trailing edge when the engine returned one, and `skim` on its own full width below. A title that shared the number's line would begin its second line indented past it. **The row answers the glance, and that is why it carries more than four fields.** Four could not separate a corporate filing from a university one, or a printing patent from a motor-control one, without opening the record — so the record would be opened on every row and the list would be a table of contents rather than a result. The fields added are the ones that end that trip: `inventors`, `abstract`, `ipcMain`, `filed`, `published`, `kind`. **`abstract` is the one that pays for itself and the one to watch** — it is the only prose here, the row clamps it to three lines, and the clamp is a RENDERING decision rather than a contract: send it as published, because an engine that pre-truncates has decided for every surface and the record needs the whole thing. **`inventors` is an array and the row prints one** — a pre-joined string cannot be counted, and a patent with six inventors is the ordinary case rather than the exception. **Up to twelve drawings, and they may point at a SMALLER rendition than the record's** — the strip scrolls, so the cap stopped being the column's width and became the DOM's: twelve a row and twenty rows a page is 240 `<img>` on one screen, and a patent in our stress corpus carries 347. A 72px row thumbnail has no business decoding a 2000px drawing 240 times, and nothing in the contract says the two ports must return the same file. **`figs` is the patent's own figure count and is NOT `thumbs.length`** — the strip's last tile says how many it stands in for, and a count derived from what was sent would state our cap rather than the patent. `figs: null` means we hold no figure list, which is not zero: no tile is drawn, never `+0`. **The order of `thumbs` need not be the order of `figures`, and the join is `n`** — the published figure number, which the record's own contract already insists is not an index. The skeleton contract is the record's: `[]` means no drawings, `[{n, src: null}]` means withheld. It CARRIES `where` without drawing it as a field of its own — it shares the fourth meta cell with `ipcMain` — because the starred set leaves as an eight-column file and the export reads the row rather than the record; fifty starred patents must not be fifty record calls, and one record exporting alone still reads its row. **The eighth column is not yours to send.** A starred row carries two fields the CLIENT writes when the star happens — which search it was starred under, and when — and they are namespaced so they read as ours at every call site that spreads a row. Do not return them; a row that arrived with them would be the engine asserting a fact about the founder's own session. **`order` is a first-class field and not an array index**: rows are keyed by patent, and the focus return, the re-sequence and its reversal all resolve through that key. **`matched` and `patents.length` differ** by what a facet binned, and printing the wrong one beneath the standing chip is a recorded regression. `matched` is also what decides whether *Show more* stays, so it must be the count the founder can page through, not a larger estimate. **Sort, filter and paging are all requests** — `{ sort }`, `{ facets }` and the next page each return this same shape. **`patentsPage` returns the whole loaded prefix, not the next twenty**: the list re-renders from it. **None of these carries a set id** — the engine holds the current result set between calls, so `patents`, `patentsPage`, `sort`, `facets`, `rerank`, `cluster` and `export` all answer about the most recent `search`. Question 10 asks whether that survives a real deployment. They cannot be client-side: twenty rows arrive at a time, so sorting what the client holds would sort a page rather than a result, and the founder could not tell. **None of them spends points** (`platform.md` §6.1). **Jurisdiction is deliberately not a facet**, because `where` renders as a bar and a founder cannot check a filter on a value they cannot see. **`null` on any identity field renders a bar**, and exactly one demo row is populated so the surface can be judged with words on it | **Bulk record retrieval** + **名稱統一** + **legal status per patent in bulk** for the fields the row draws. Without the first this degrades to a list of titles, which is a search result rather than evidence. The status vocabulary is question 6 |
| **The grouping filter chip** · above the list | `--r-chip` `--border` `--text-2` | `{ id: leafId, label: string, n: int }` — **which branch the founder selected, and how many patents are in it.** *`n` must agree with the leaf's own count in the grouping payload — the two are the same number and the client must not compute one from the other.* Several may be active at once and each is removable | Nothing new — a projection of the grouping's own payload |
| **The patent record** · `record` | `--surface-sunken` `--text-2` `--r-inner`, `figure-s` for the claim numbers, `--figure-ground` for the drawings | **request** `{ id }` · **response** `{ title, number, appno, kind, ipcMain, ipc: [symbol], holder, inventors: [name], filed, published, where, status, abstract, claims: [string], figures: [{ n, src, alt }], sourceUrl? }` — **eleven identifiers, the abstract, the claim set as published, and the drawings.** **An unknown `id` is `NOT_FOUND` with `retryable: false`**, never `ok` with `null` data — the pane offers no retry for a record that does not exist. **`sourceUrl` is the one optional field**: absent, *Open in IPtech* keeps its placeholder destination; `null`, the control is omitted; a string is question 3's answer. `claims` is an **array, one entry per claim**, not one blob: a patent numbers its claims and counsel is pointed at claim 4 by number. **`figures[].n` is the PUBLISHED figure number and not the index** — the claims refer to figures by number, and a renumbered figure is a different document. **Two absences must not collapse**: `figures: []` means this record HAS no drawings; `figures: [{n, src: null}]` means it has them and we decline to show them. **Nothing here may arrive interpreted** — no highlight offsets, no decode, no plain-English gloss. One demo record is fully populated, with a recognisably fictional holder and inventors and a number deliberately above the issued range, so a real patent is never named | **The single largest ask in this file.** Your record view holds all of it, so the fields plainly exist; what we cannot see is whether the claim text is reachable **as published** rather than as your reading of it. Drawings are question 4, status is question 6 |
| **The handoff row** · the record's five-field projection | inherits the record's `<dl>` | **Nothing new — a six-field projection of the record above**: `number, title, holder, where, status, ipcMain`, copied as a citation. Recorded because it looks like its own shape and is not | **Legal status** + **IPC**. Depth is question 6: full symbol or class only |
| **Status chip** · `.status` | `--state-live` `--state-expired` `--state-pending` + their tints | `'live' \| 'expired' \| 'abandoned' \| 'pending' \| null` — **four words over three hues.** *Abandoned* takes expired's hue because the hue means **not enforceable**, which is true of both; the word is what separates a patent that was granted and lapsed from an application that never was. **Collapsing them is not a simplification, it is a false statement** — real data carries at least five raw statuses, and folding them into two made the interface say *Expired* about ten pending applications and five abandoned ones. `null` renders NOTHING: not a bar, because this is an absent value rather than a withheld one | **Legal status, resolved, per patent.** Question 6 asks whether it is in the response at all — your result card carries kind code and application type, and neither is a status. **The VOCABULARY matters as much as the field** |
| **Project switcher** · the masthead menu | `--surface-sunken` `--text-2`, `--skeleton` | `{ projects: [{ id, label: string\|null, current: bool }] }` — `label: null` renders a bar; exactly one `current` names the masthead. An empty array is *no projects yet*, which is a sentence, never bars | **專案** *if* projects live in IPtech and are reachable programmatically; Terrain-owned if not. We do not know which — see §4 |
| *— two rows went here —* | | **The Delta pill** was specced and applied nowhere; §2's *direction of change* colour case stays reserved and its two tokens are aliases, so reserving costs nothing. **Columns** described a per-day chart on the points page, which draws a meter bar and a table. It read `--chart-series`, which is gone. | |
| **Usage meter** · `points` | `--text-2` `--text-3`, `figure-s` tabular | `{ balance: int, allowance: int, runTypes: [{ id, label, cost: int }] }` — a **balance**, not a percentage and not a quota. The masthead prints `balance`; the points page prints all three. `runTypes` is a list rather than one int, because a search and an export are not the same cost. *The charge lands when Search is pressed, not when the set lands — `platform.md` §7.2. That is a timing rule, not a shape change* | **Usage metering in points.** Which unit it counts is question 5, and the answer changes `costPerRun`, not the shape |
| **Balance meter** · `points` | `--surface-sunken` track, `--text-1` fill, `figure-xl` + `.fig-sub`, `micro` | The same `points` payload — `balance / allowance` is the meter's length. The **allowance is the field that presupposes a plan shape**. The period is a word in our copy (*this quarter*), not a field | Nothing from the engine. `allowance` is **ours**, and they do not exist until pricing closes |
| **Plan card** · `billing`, `invoices` | `--surface`, `figure-l` + `.fig-sub`, `.sk` for the tier name, `.ur` rows for invoices | `billing` → `{ price: money \| 'XXX' }` · `invoices` → `{ invoices: [{ id, when: date, amount: money \| 'XXX', status: 'paid' \| 'failed' }] }` — the two are requested together and the plan card fails as one. **The tier name and the renewal date render as bars from the markup and read no field.** *A bar and an `XXX` are not the same refusal, and `price` is the only field in the manifest of the second kind: **a bar means a real value that is not ours to print**; **`XXX` means nobody has chosen one yet** (`platform.md` §12), and the card prints *Not set yet* for it rather than a figure.* An empty `invoices` is *No invoices yet*. **The allowance and the points left on this page are static markup today** — question 12. | **Nothing from the engine, and nothing from IPtech at all** — the first row in this file whose capability column has nothing to fill it. A plan and an invoice are ours or a payment processor's. It does not exist until pricing closes (`platform.md` §12) |
| **Support message** · `sendSupport` | `.ta`, the `.lm` topic menu, `.btn-primary` | **request** `{ text: string, topic: string\|null }` — `topic` is the label of the chosen menu item, `null` if none. **response** `{ sent: true }`; only `ok` and `retryable` are read. There is no reply address in the request: the engine answers to the account's own address | **None.** Terrain-owned, and deliberately not the composer — `design-language.md` §7 carries why a support field may not wear the thing you type your idea into |
| **Account** · `account`, `saveAccount` | `.pref-card`, the inline field, `.sk` | `account` → `{ name: string\|null, email: string\|null }`, each `null` rendering a bar. **`saveAccount` sends ONE field per call, keyed by the control that edited it**: `{ acctName: string }` or `{ acctMail: string }`. The response is the account as it now stands, `{ name, email }`, and is not read; `ok` confirms, and `retryable` decides whether the inline failure offers *Try again*. The `@` check is the client's and never reaches the engine | **None.** Terrain-owned |
| **The FAQ** · Help's *Common questions* | `.hlp-qa` `<dl>`, `t-micro` group headings, `--text-1` / `--text-2` | `{ groups: [{ label, items: [{ q: string, a: string }] }] }` — **static content, ours, shipped in the page.** Recorded because it looks like a payload and must never become one: an answer fetched at runtime is an answer that can disagree with the build that renders it. **No answer may restate labelling** (`platform.md` §6.4), and they stay **open** — no disclosure, because the questions are the scan target and the answers run one to three lines | **None.** Terrain-owned |
| **What a run costs** · the points page table | `.tbl`, `figure-m` | `runTypes` from `points` above, one row per type: `label` and `cost`. Nothing is computed from it | Derived from the ledger below. The **mapping** from our three run types to your modules is `platform.md` §6.1, and it is unsettled because your surface meters nothing — question 5 |
| **Runs list** · `runs` | `.ur` on 1px `--border` dividers, `figure-m` | `{ runs: [{ id, kind: string, project: string\|null, when: date, cost: int }] }` — `project: null` **renders a bar**. Printed in the order received, newest first. An empty array is *No runs yet* | The same per-run ledger the columns need. A balance cannot produce this |

**The list ports are all requests, and that is the load-bearing half.** Twenty rows arrive at a time,
so the client never holds the whole set: `patents`, `patentsPage`, `sort` and `facets` each hand back
a `PatentSet` and each can fail independently. Sorting client-side would sort a page rather than a
result, and the founder would have no way to tell.

**The home surface needs two more**: `fields` → `{ fields: [{ id, label, icon, ready: bool }] }` for the
technology tiles — `icon` is a key into the client's own icon set (`cpu` `network` `monitor` `battery` `stetho`; an unknown key draws `cpu`), and the first `ready` field is selected on arrival — and `coverage` → `{ scope: string, sources: [{ source, updated }] }` for what is in
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

**The sort and filter menus are listed here for their chrome only.** What they do is a request —
`sort` and `facets` in §1 — because twenty rows arrive at a time and ordering a page is not ordering
a result. The menus themselves need no data: their options are fixed words.

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
   branches with a count per leaf, generated *after* retrieval over the set that came back. Your own
   fishbone partitions its result set exhaustively, which is what suggests this is possible — but over
   **your** search, not over a set handed to you.

   **And the branch labels must be WORDS.** Grouping the stress corpus by CPC gives branches called
   `H10D` and `G06N`, which navigate nobody who is not already an examiner — the panel exists so a
   founder can walk two hundred results in pieces. CPC ships a description per node and that was
   enough here; a generated taxonomy has to come back with the same thing.

3. **Who supplies the per-patent "open this in the source" URL?** The source varies by jurisdiction —
   Google Patents, WebPat, TIPO — so the interface cannot construct it. We need the engine to return
   both the **URL and the label**, per patent: the affordance is ours, the destination is yours.

   **The affordance is built and its destination is a stand-in.** *Open in IPtech* sits at the
   record's foot and points every patent at the same sign-in page. It is deliberately not a
   constructed link: a per-patent URL assembled from a number and a guessed registry would be right
   often enough to be trusted and wrong without saying so. **The record already reads `sourceUrl`**
   (§1) — absent keeps the placeholder, `null` omits the control — and a label beside it would let
   the control name the registry rather than always saying IPtech.

4. **Drawings and PDFs — what are the URLs, and does CORS permit a client-side fetch?** The viewer
   already works against images fetched by the browser. A patent *package* — the starred set's
   drawings and PDFs as one file — cannot be assembled client-side without both, and yours are served
   over IPFS.

   **We need TWO renditions per drawing, and this is not a preference.** A thumbnail for the list —
   twelve a row, twenty rows a page — and the full drawing for the enlarged view. Capturing our own
   stress-test set proved the cost of getting it wrong: Google Patents serves both under
   indistinguishable content-hash paths, our capture kept the wrong one for every figure, and the
   enlarged view spent a month upscaling a 4 KB thumbnail eleven times. Nobody noticed, because a
   thumbnail and a drawing are hard to tell apart until something makes one large. **If your response
   carries one URL, say which rendition it is.**

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

**Four more came out of reading the client against this file rather than against your surface.**
They are ours to settle with you, not capabilities to confirm:

9. **Do a status filter and a grouping branch combine?** Today they do not: the filter menu sends
   `facets({ facets: { status } })` and a branch sends `facets({ facets: {}, groups })`, so each
   clears the other. `kind` is in the request shape and no control sends it. If they should combine,
   the request carries both and the engine intersects.

10. **What identifies a result set?** No list port carries one. The engine holds *the most recent
    search* and every later call is about it — which is true of one tab against one process, and false
    of two tabs, a restarted server or a load balancer. A `setId` returned by `search` and sent with
    every list call is the likely answer; it is a change on both sides.

11. **Does a search from the results bar keep its field?** The home composer sends `field`; the bar
    above the results sends only `query` and `settings`. Either the engine keeps the last field, or the
    bar sends it.

12. **Where do the plan's allowance and points-left come from?** The billing page prints both from
    static markup, while the points page reads `allowance` and `balance` from `points`. One source
    should feed both; the likely one is `points`.

*`Figure.alt` is carried and not yet read* — the viewer labels a drawing *Figure n*. Send it when the
source has one; it costs nothing and the client will use it.

**One component generated no question and that is worth saying:** the export. Every field it writes is
already in the client, so it needs nothing from you — which is also why it is the one thing in
Terrain that cannot be taken away by an answer.
