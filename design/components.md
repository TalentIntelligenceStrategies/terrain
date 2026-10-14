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

---

## 1 · Built, and data-bearing

Every component below consumes engine data. **The names are the ports** — the fifteen entries of
`PORTS` in [`app/js/ports.mjs`](../app/js/ports.mjs) — and every one returns the same envelope:
`{ ok: true, data }` or `{ ok: false, code, retryable, detail? }`. §0.1 is why. `code` is one of
`UNAVAILABLE` `TIMEOUT` `RATE_LIMITED` (retryable) or `NO_CORPUS` `NOT_FOUND` `UNSUPPORTED` (not); an
unknown code is treated as `UNAVAILABLE`. **The client branches on `retryable`, never on `code`**:
the code is for logs, and the sentence is ours.

| Component | Tokens it reads | Data shape it needs | Capability that supplies it |
| --- | --- | --- | --- |
| **The search** · `search` | the composer, `--accent` on the primary | **request** `{ query: string, field: string, settings, mode: 'text'\|'number' }` where `settings = { sources: [cc], kinds: ['granted'\|'applications'], count: 10\|20\|50\|100\|500, basis: 'filed'\|'published', from: 'YYYY'\|'', to: 'YYYY'\|'' }` · **response** `PatentSet + { elapsedMs: int }` — the surface prints `matched` and the time. `field` is the selected technology tile's `id` from `fields`. **`mode` says what `query` is**: a description, or a patent number to look up. A number search returns the set with that patent **first**, and `NOT_FOUND` with `retryable: false` when the index does not hold the number — the surface says *No patent matches* and names the number, which is an answer rather than an outage. The forms a number may take are question 11. **One call.** There is no reading step, no criteria to approve and no build stream; the five ports that were those are gone | Semantic retrieval from a plain-language sentence, as PI-VuePat already does it. `sources × kinds` is the index cross-product |
| **The grouping panel** · `cluster` | `--border` `--text-1/2/3`, no accent, **no caption** | **response** `{ head: string, spines: [{ label, leaves: [{ id, label, n: int }] }] }` — **two levels and no more.** A leaf carries a **count, not a list of ids**: the client holds twenty rows at a time and never the whole set, so a leaf naming its patents would name ones the list does not have. **Selecting a branch is therefore a REQUEST** — `facets({groups:[leafId]})` returns a fresh first page — which also means the badge and the count above the list come from the same place. **The leaves must PARTITION the set**: a patent counted under every class it carries makes the branches sum to more than the results, which is the defect `corpus/FINDINGS.md` records as finding A. **Too few to group is a SUCCESSFUL response**, `spines: []` with `ok:true` — refusing would offer a retry that cannot help | **AI魚骨**, pointed at a result set. **Question 2 in §4** — the whole panel depends on an answer we do not have |
| **Find similar** · `rerank` | none of its own | **request** `{ anchors: [patentId] }` · **response** `{ order: [patentId] }` over the **same set**. No patent enters or leaves; the interface moves existing rows into the returned order. A `null` response is a refusal, not an empty ordering. **`anchors` is an array of one**: the open record sends itself, and it is not starred by doing so. The array shape is kept so a later anchor set is not a contract change | **Nearest-neighbour retrieval pointed at one patent**, which your surface already does as *Source patent (n)* |
| **The list and its foot** · `list.mjs` | `--surface` `--surface-sunken` `--border` `--text-1` `--skeleton` `--skeleton-strong` | `{ patents: [{ id, number, skim, holder, where, year, versions: [{ kind: 'grant'\|'application', number, published }]\|null, score: number\|null, inventors: [name], abstract, ipcMain, filed, published, kind, figs: int\|null, thumbs: [{n, src, alt}] }], order: [id], matched: int }`. **The row draws three bands — identity, party and date, and what it claims — and `thumbs` is not one of them**: a field is a value read OFF the patent, a drawing is the patent. **`versions` is the patent's documents** — the application as published and the grant, each with its own number and date, the one to show first first. Two render a *Grant / Application* switch and the row shows the chosen one's number and date; one renders as the word; `null` renders nothing. **Band one is two lines**: an eyebrow carrying `number` and the position in the order, with `score` at its trailing edge when the engine returned one, and `skim` on its own full width below. A title that shared the number's line would begin its second line indented past it. **The row answers the glance, and that is why it carries more than four fields.** Four could not separate a corporate filing from a university one, or a printing patent from a motor-control one, without opening the record — so the record would be opened on every row and the list would be a table of contents rather than a result. The fields added are the ones that end that trip: `inventors`, `abstract`, `ipcMain`, `filed`, `published`, `kind`. **`abstract` is the one that pays for itself and the one to watch** — it is the only prose here, the row clamps it to three lines, and the clamp is a RENDERING decision rather than a contract: send it as published, because an engine that pre-truncates has decided for every surface and the record needs the whole thing. **`inventors` is an array and the row prints one** — a pre-joined string cannot be counted, and a patent with six inventors is the ordinary case rather than the exception. **Up to twelve drawings, and they may point at a SMALLER rendition than the record's** — the strip scrolls, so the cap stopped being the column's width and became the DOM's: twelve a row and twenty rows a page is 240 `<img>` on one screen, and a patent in our stress corpus carries 347. A 72px row thumbnail has no business decoding a 2000px drawing 240 times, and nothing in the contract says the two ports must return the same file. **`figs` is the patent's own figure count and is NOT `thumbs.length`** — the strip's last tile says how many it stands in for, and a count derived from what was sent would state our cap rather than the patent. `figs: null` means we hold no figure list, which is not zero: no tile is drawn, never `+0`. **The order of `thumbs` need not be the order of `figures`, and the join is `n`** — the published figure number, which the record's own contract already insists is not an index. The skeleton contract is the record's: `[]` means no drawings, `[{n, src: null}]` means withheld. It CARRIES `where` without drawing it as a field of its own — it shares the fourth meta cell with `ipcMain` — because the starred set leaves as a seven-column file and the export reads the row rather than the record; fifty starred patents must not be fifty record calls, and one record exporting alone still reads its row. **The seventh column is not yours to send.** A starred row carries two fields the CLIENT writes when the star happens — which search it was starred under, and when — and they are namespaced so they read as ours at every call site that spreads a row. Do not return them; a row that arrived with them would be the engine asserting a fact about the founder's own session. **`order` is a first-class field and not an array index**: rows are keyed by patent, and the focus return, the re-sequence and its reversal all resolve through that key. **`matched` and `patents.length` differ** by what a facet binned, and printing the wrong one beneath the standing chip is a recorded regression. `matched` is also what decides whether *Show more* stays, so it must be the count the founder can page through, not a larger estimate. **Sort, a grouping branch and paging are all requests** — `{ sort }`, `{ groups }` and the next page each return this same shape. **`patentsPage` returns the whole loaded prefix, not the next twenty**: the list re-renders from it. **None of these carries a set id** — the engine holds the current result set between calls, so `patents`, `patentsPage`, `sort`, `facets`, `rerank` and `cluster` all answer about the most recent `search`. Question 9 asks whether that survives a real deployment. They cannot be client-side: twenty rows arrive at a time, so sorting what the client holds would sort a page rather than a result, and the founder could not tell. **Jurisdiction is deliberately not a facet**, because `where` renders as a bar and a founder cannot check a filter on a value they cannot see. **`null` on any identity field renders a bar**, and exactly one demo row is populated so the surface can be judged with words on it | **Bulk record retrieval** + **名稱統一** for the fields the row draws. Without the first this degrades to a list of titles, which is a search result rather than evidence. **Legal status is not asked for**: Terrain does not print it |
| **The grouping filter chip** · above the list | `--r-chip` `--border` `--text-2` | `{ id: leafId, label: string, n: int }` — **which branch the founder selected, and how many patents are in it.** *`n` must agree with the leaf's own count in the grouping payload — the two are the same number and the client must not compute one from the other.* Several may be active at once and each is removable | Nothing new — a projection of the grouping's own payload |
| **The patent record** · `record` | `--surface-sunken` `--text-2` `--r-inner`, `figure-s` for the claim numbers, `--figure-ground` for the drawings | **request** `{ id, version? }` — `version` is the `kind` the row is showing, and the record answers with that document · **response** `{ title, number, appno, kind, ipcMain, ipc: [symbol], holder, inventors: [name], filed, published, where, abstract, claims: [string], figures: [{ n, src, alt }], sourceUrl? }` — **ten identifiers, the abstract, the claim set as published, and the drawings.** **An unknown `id` is `NOT_FOUND` with `retryable: false`**, never `ok` with `null` data — the pane offers no retry for a record that does not exist. **`sourceUrl` is the one optional field**: absent, *Open in IPtech* keeps its placeholder destination; `null`, the control is omitted; a string is question 3's answer. `claims` is an **array, one entry per claim**, not one blob: a patent numbers its claims and counsel is pointed at claim 4 by number. **`figures[].n` is the PUBLISHED figure number and not the index** — the claims refer to figures by number, and a renumbered figure is a different document. **Two absences must not collapse**: `figures: []` means this record HAS no drawings; `figures: [{n, src: null}]` means it has them and we decline to show them. **Nothing here may arrive interpreted** — no highlight offsets, no decode, no plain-English gloss. One demo record is fully populated, with a recognisably fictional holder and inventors and a number deliberately above the issued range, so a real patent is never named | **The single largest ask in this file.** Your record view holds all of it, so the fields plainly exist; what we cannot see is whether the claim text is reachable **as published** rather than as your reading of it. Drawings are question 4 |
| **The handoff row** · the record's four-field projection | inherits the record's `<dl>` | **Nothing new — a five-field projection of the record above**: `number, title, holder, where, ipcMain`, copied as a citation. Recorded because it looks like its own shape and is not | **IPC**: the full symbol |
| *— two rows went here —* | | **The Delta pill** was specced and applied nowhere; §2's *direction of change* colour case stays reserved and its two tokens are aliases, so reserving costs nothing. | |
| **Plan card** · `billing`, `invoices` | `--surface`, `figure-l` + `.fig-sub`, `.sk` for the tier name, `.ur` rows for invoices | `billing` → `{ price: money \| 'XXX' }` · `invoices` → `{ invoices: [{ id, when: date, amount: money \| 'XXX', status: 'paid' \| 'failed' }] }` — the two are requested together and the plan card fails as one. **The tier name and the renewal date render as bars from the markup and read no field.** *A bar and an `XXX` are not the same refusal, and `price` is the only field in the manifest of the second kind: **a bar means a real value that is not ours to print**; **`XXX` means nobody has chosen one yet** (`platform.md` §12), and the card prints *Not set yet* for it rather than a figure.* An empty `invoices` is *No invoices yet*. | **Nothing from the engine, and nothing from IPtech at all** — the first row in this file whose capability column has nothing to fill it. A plan and an invoice are ours or a payment processor's. It does not exist until pricing closes (`platform.md` §12) |
| **Support message** · `sendSupport` | `.ta`, the `.lm` topic menu, `.btn-primary` | **request** `{ text: string, topic: string\|null }` — `topic` is the label of the chosen menu item, `null` if none. **response** `{ sent: true }`; only `ok` and `retryable` are read. There is no reply address in the request: the engine answers to the account's own address | **None.** Terrain-owned, and deliberately not the composer — `design-language.md` §7 carries why a support field may not wear the thing you type your idea into |
| **Account** · `account`, `saveAccount` | `.pref-card`, the inline field, `.sk` | `account` → `{ name: string\|null, email: string\|null }`, each `null` rendering a bar. **`saveAccount` sends ONE field per call, keyed by the control that edited it**: `{ acctName: string }` or `{ acctMail: string }`. The response is the account as it now stands, `{ name, email }`, and is not read; `ok` confirms, and `retryable` decides whether the inline failure offers *Try again*. The `@` check is the client's and never reaches the engine | **None.** Terrain-owned |
| **The FAQ** · Help's *Common questions* | `.hlp-qa` `<dl>`, `t-micro` group headings, `--text-1` / `--text-2` | `{ groups: [{ label, items: [{ q: string, a: string }] }] }` — **static content, ours, shipped in the page.** Recorded because it looks like a payload and must never become one: an answer fetched at runtime is an answer that can disagree with the build that renders it. **No answer may restate labelling** (`platform.md` §6.4), and they stay **open** — no disclosure, because the questions are the scan target and the answers run one to three lines | **None.** Terrain-owned |

**The list ports are all requests, and that is the load-bearing half.** Twenty rows arrive at a time,
so the client never holds the whole set: `patents`, `patentsPage`, `sort` and `facets` each hand back
a `PatentSet` and each can fail independently. Sorting client-side would sort a page rather than a
result, and the founder would have no way to tell.

**The home surface needs two more**: `fields` → `{ fields: [{ id, label, icon, ready: bool }] }` for the
technology tiles — `icon` is a key into the client's own icon set (`cpu` `network` `monitor` `battery` `stetho`; an unknown key draws `cpu`), and the first `ready` field is selected on arrival — and `coverage` → `{ scope: string, sources: [{ source, grant: 'YYYY-MM-DD'\|null, application: 'YYYY-MM-DD'\|null }] }`
for what is in the corpus: **one row per source** and the latest grant and application taken into
each, `null` where the index is not covered (it prints a dash, not a bar). **`coverage` cannot currently state its own size**, which is
question 8.

---

## 3 · Reads tokens, needs no engine data

The structural layer. Listed once rather than as rows, because a data-shape column reading *none*
twenty times is filler:

> the shell and its masthead · **search history**, kept in the browser · the profile row and menu · the card · the info
> affordance · the segmented control · **the anchored popover**, which carries the search settings ·
> the list's **sort menu** · **the search bar and its four toggles** · the composer ·
> buttons · the skeleton bars themselves · **the settings row, the text field, the switch and the
> inline confirm** · **the figure viewer's action bar, thumbnail strip and zoom ladder** · **Account
> settings and Help entire**.

**The sort menu is listed here for its chrome only.** What it does is a request — `sort` in §1 —
because twenty rows arrive at a time and ordering a page is not ordering a result. The menu itself
needs no data: its options are fixed words.

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

1. **Does nearest-neighbour retrieval answer for any patent in the set?** *Find similar* takes the
   open record as its one anchor and re-orders the set by nearness to it — the primitive your surface
   ships as *Source patent (n)*. We need it to answer over the **result set the search returned**, not
   over a fresh query, so that no patent enters or leaves.

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

5. **Does anything limit how many searches a plan runs?** Terrain does not meter by points and no
   surface counts what a search costs, which matches your build. If a plan is capped by searches,
   seats or anything else, the engine is where that count would live.

6. **Is legal status in the response at all?** Terrain no longer prints it and does not ask for it,
   as your build does not. It still bears on family merge and name unification, which Terrain takes
   as hygiene the founder never sees.

7. **Is 500 an engine ceiling or an interface one?** Your settings offer 10 · 20 · 50 · 100 · 500. We
   page at twenty against a set the engine holds, so the ceiling decides whether a founder can ever
   see everything that matched.

8. **How many documents are in each index?** The field exists in your bundle and is not rendered. A
   coverage table that lists sources and dates but not sizes reads as complete, and a founder has no
   way to learn otherwise.

**Four more came out of reading the client against this file rather than against your surface.**
They are ours to settle with you, not capabilities to confirm:

9. **What identifies a result set?** No list port carries one. The engine holds *the most recent
    search* and every later call is about it — which is true of one tab against one process, and false
    of two tabs, a restarted server or a load balancer. A `setId` returned by `search` and sent with
    every list call is the likely answer; it is a change on both sides.

10. **Does a search from the results bar keep its field?** The home composer sends `field`; the bar
    above the results sends only `query` and `settings`. Either the engine keeps the last field, or the
    bar sends it.

11. **Which forms of a patent number does the lookup accept?** In your build `US9000581B2` and
    `US20130270686A1` are in the index and return *Patent not found*; `EP2214203A2` is found. A founder
    pastes what a registry prints — zero padding, spaces, commas, the kind code or not — and the lookup
    should accept all of it. The demo engine normalises case, punctuation and padding and treats the
    kind code as optional.

*`Figure.alt` is carried and not yet read* — the viewer labels a drawing *Figure n*. Send it when the
source has one; it costs nothing and the client will use it.

**One component generated no question and that is worth saying:** the export. Every field it writes is
already in the client, so it needs nothing from you — which is also why it is the one thing in
Terrain that cannot be taken away by an answer.
