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
The two payloads are a **patent list** and a **record**, which are text by nature. *Group by topic* is
built in the client from the rows' classification, so nothing about grouping can arrive rendered.

**The drawings are the exception that proves it, and they are rasters on purpose.** A patent figure
*is* the published document; there is nothing to re-token. What we need there is a URL and permission
to fetch it (§4 question 4), not a structure.

---

## 0.1 · What a failed response looks like

**A failure is a response, and it is not the same thing as an empty one.** *No patents matched* is an
answer; *the search did not run* is not. A component that cannot tell them apart renders "nothing
found" over an outage, which is the one wrong thing it can say. **Every shape below needs a way to say
which of the two happened**, and an empty array is not it.

**Partial success is the normal case, not an exception.** The list, the record and each drawing
resolve independently and each arrives when its own data lands, so a record failing while the list
stands is ordinary. A response that can only be wholly good or wholly bad forces the surface
to blank a working result set to report one broken panel.

**The reason is machine-readable; the sentence is ours.** Return a code and whatever detail helps us
log it — never a prose string intended for display. Our copy states the fix rather than the fault and
does it in our own voice, and an engine cannot know either. A message we did not write is a message
that cannot be made true of our interface.

**Whether it is worth retrying is part of the answer.** The surface offers *try again* only where
trying again could work. Something permanent, such as a record that does not exist, offers the founder a different route, and guessing wrong in either direction wastes their time or
hides their way out.

---

## 1 · Built, and data-bearing

Every component below consumes engine data. **The names are the ports**, the entries of
`PORTS` in [`app/js/ports.mjs`](../app/js/ports.mjs) — and every one returns the same envelope:
`{ ok: true, data }` or `{ ok: false, code, retryable, detail? }`. §0.1 is why. `code` is one of
`UNAVAILABLE` `TIMEOUT` `RATE_LIMITED` (retryable) or `NO_CORPUS` `NOT_FOUND` `UNSUPPORTED` (not); an
unknown code is treated as `UNAVAILABLE`. **The client branches on `retryable`, and on `code` in one
place only**: a number search answered `NOT_FOUND`, which is an answer about the number rather than a
failure, and prints its own sentence with a way out (`platform.md` §7.2). Everywhere else the code is for
logs, and the sentence is ours.

| Component | Tokens it reads | Data shape it needs | Capability that supplies it |
| --- | --- | --- | --- |
| **The search** · `search` | the search panel, `--accent` on the primary | **request** `{ query: string, field: string, settings, mode: 'text'\|'number' }` where `settings = { sources: [cc], kinds: ['granted'\|'applications'], count: 10\|20\|50\|100\|200, rerank: bool, basis: 'filed'\|'published'\|'priority', from: 'YYYY'\|'YYYY-MM-DD'\|'', to: 'YYYY'\|'YYYY-MM-DD'\|'' }` · **response** `PatentSet + { elapsedMs: int }`; the scope chips print the settings and the time. `field` is the chosen field's `id` from `fields`. **`rerank` asks for a second scoring pass over the top results**; the set is the same, the order and the scores may change. **`basis: 'priority'` excludes a record with no priority date from a bounded range**; say if your index treats it otherwise. **`mode` says what `query` is**: a description, or a patent number to look up. A number search returns the set with that patent **first**, and `NOT_FOUND` with `retryable: false` when the index does not hold the number; the surface says *No patent matches US99999999B2. Check the office code and the number, or search it as text.* and offers *Search this as text*. The forms a number may take are question 10. **Below a relevance floor the set is empty**: `matched: 0` with `ok: true`, never the nearest fifty of an index that holds nothing close. **One call**, and it returns every row asked for: there is no paging | Semantic retrieval from a plain-language sentence, as PI-VuePat already does it. `sources × kinds` is the index cross-product |
| **Find similar** · `similar` | the silver edge on the control, nothing on the rows | **request** `{ anchors: [patentId] }` · **response** `{ order: [patentId] }` over the **same set**. No patent enters or leaves; the interface moves existing rows into the returned order, and **each row keeps its rank and its relevance score**: the sort still reads *Relevance*, and a tag above the list (*Similar to …*, with Restore) says what the order is measured from. A per-row similarity value, if the engine has one, is not printed. A `null` response is a refusal, not an empty ordering. **`anchors` is an array of one**, the open record; the array shape is kept so a later anchor set is not a contract change | **Nearest-neighbour retrieval pointed at one patent**, which your surface already does as *Source patent (n)* |
| **The list** · `list.mjs` | `--surface` `--ground` `--border` `--border-strong` `--edge-silver` `--accent` (the open row) `--text-1/2/3` `--skeleton` | `{ patents: [{ id, number, skim, holder: string\|null\|'', where, kind, version: 'grant'\|'application', score: number\|null, inventors: [name], abstract, ipcMain, ipcWords: { [subclass]: string }\|null, filed, published, url: string\|null, thumbs: [{n, src, alt}] }], order: [id], matched: int }`. **The card draws the number line, the title, the facts and the abstract, and then the drawings.** The number line carries `number`, the kind and `version` as words, a link to `url` (the patent's published page) when there is one, and at its trailing end **the rank** (the row's place in `order` as the engine returned it) **and `score`**, printed to four decimals as *Relevance score 0.8862*. **The rank is the engine's and travels with the row when the list is sorted.** The facts are `holder`, the first of `inventors` and *+n*, `published` and `ipcMain`. **`ipcWords` maps a four-character subclass to CPC's own words for it**, and *Group by topic* reads it with `ipcMain` to name each group; a subclass with no words is grouped under its code. **`abstract` is sent as published**: the card clamps it to three lines, and the clamp is a rendering decision rather than a contract. **`holder` has three states**: the name; `null`, held back, which renders a bar; and `''`, a patent that names no assignee, which prints *No assignee listed*. **`inventors` is an array and the card prints one.** **Up to eight drawings, and they may point at a SMALLER rendition than the record's**: the strip scrolls, and a 92px tile has no business decoding a 2000px drawing. **The order of `thumbs` need not be the order of `figures`, and the join is `n`**, the published figure number. `[]` means no drawings, `[{n, src: null}]` means withheld. **`score: null` leaves the chip off and the rank alone.** **`order` is a first-class field and not an array index**: rows are keyed by patent, and the focus return, the re-sequence and its reversal all resolve through that key. **`matched` and `patents.length` may differ** only where the count setting cut the set; the ⓘ prints `matched`. **Sort is a request**, `sort({ by: 'relevance'\|'newest'\|'oldest' })`, by published date, returning this same shape. **None of these carries a set id**: the engine holds the current result set between calls, so `sort` and `similar` answer about the most recent `search` (question 9). **The export reads the row and the record, never a port of its own**: *Export results* writes the rows in the order on screen. **`null` on any identity field renders a bar** | **Bulk record retrieval** + **名稱統一** for the fields the row draws |
| **The topic tag** · above the list | `--r-control` `--border` `--text-2` | **Nothing new**: the chosen subclass, its words from `ipcWords` and its count over the rows on the list. The client computes it; it is a view of the rows (`brief.md` §1) | Nothing beyond the list |
| **The patent record** · `record` | `--surface` `--border` `--text-1/2/3`, the figure face for codes and dates, `--figure-ground` for the drawings | **request** `{ id, version? }` · **response** `{ title, number, appno, kind, kindCode, ipcMain, ipc: [symbol], ipcWords: { [subclass]: string }\|null, holder, inventors: [name], filed, published, priority: 'YYYY-MM-DD'\|null, where, status: { word: string, expires: 'YYYY-MM-DD'\|null }\|null, abstract, claims: [string], figures: [{ n, src, alt }], url: string\|null, sourceUrl? }`: **every identifier, the legal status, the abstract, the claim set as published, and the drawings.** **`status`, `priority` and `ipcWords` print as a dash when `null`**: send what your index holds and nothing derived. `status.word` is the office's word, cased as data (*Active*, *Expired*, *Pending*), and `expires` rides beside it. **An unknown `id` is `NOT_FOUND` with `retryable: false`**, never `ok` with `null` data. **`sourceUrl` is optional**: absent, *Open in IPTECH* keeps its placeholder destination; `null`, the control is omitted; a string is question 3's answer. `url` is the patent's published page, which the row's source link opens. `claims` is an **array, one entry per claim**. **`figures[].n` is the PUBLISHED figure number and not the index.** **Two absences must not collapse**: `figures: []` means this record HAS no drawings; `figures: [{n, src: null}]` means it has them and we decline to show them. **Nothing here may arrive interpreted**: no highlight offsets, no decode, no plain-English version. CPC's class words are not an interpretation; they are the classification's published name. One demo record is fully populated, with a recognisably fictional holder and inventors and a number deliberately above the issued range | **The single largest ask in this file.** Your record view holds all of it; what we cannot see is whether the claim text is reachable **as published**, and which offices supply legal status (question 6). Drawings are question 4 |
| **The exports** · *Export this record*, *Export* | the record's menu, and the menu at the end of the scope row (in the list head below 640px) | **Nothing new**: the record's fields, or the rows in the order on screen with the search's scope at the head, written as CSV or Markdown in the client. A file states nothing its page did not (`brief.md` §1) | Nothing beyond the list and the record |

**The whole set arrives at once, and sort is still a request.** `search` returns every row the count
asks for, up to 200, so the client holds the set; `sort` asks the engine anyway, so the order a founder
sees is the engine's order and a date the client cannot parse never decides it.

**The home surface needs two more**: `fields` → `{ fields: [{ id, label, icon, ready: bool }] }` for the
technology tiles — `icon` is a key into the client's own icon set (`cpu` `network` `monitor` `battery` `stetho`; an unknown key draws `cpu`), and the first `ready` field is selected on arrival — and `coverage` → `{ scope: string, sources: [{ source, grant: 'YYYY-MM-DD'\|null, application: 'YYYY-MM-DD'\|null }] }`
for what is in the corpus: **one row per source** and the latest grant and application taken into
each, `null` where the index is not covered (it prints a dash, not a bar). **`coverage` cannot currently state its own size**, which is
question 8.

---

## 3 · Reads tokens, needs no engine data

The structural layer. Listed once rather than as rows, because a data-shape column reading *none*
twenty times is filler:

> the shell and its masthead · **search history**, kept in the browser · the keyboard-shortcuts
> popover · the version · the panel · the info affordance · the segmented control · **the anchored
> popover**, which carries the search settings · the list's **sort menu** · the composer and the
> scope chips · buttons · the skeleton bars themselves · **the figure viewer's action bar, thumbnail
> strip and zoom ladder** · **Group by topic**, built from the rows.

**The sort menu is listed here for its chrome only.** What it does is a request, `sort` in §1. The
menu itself needs no data: its options are fixed words.

**The figure viewer reads tokens and needs no engine data beyond the image URLs themselves.** Zoom,
rotation and pan are `transform` on a custom property; the ladder is seven fixed stops in the
client. Nothing about how a drawing is displayed is a question for your engine.

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

2. **Can every row and record carry CPC's words for its subclasses?** *Group by topic* names each
   group by `ipcWords`, and a group without words prints its code, which navigates nobody who is not
   already an examiner. CPC ships a description per node; send it with the row.

3. **Who supplies the per-patent "open this in the source" URL?** The source varies by jurisdiction —
   Google Patents, WebPat, TIPO — so the interface cannot construct it. We need the engine to return
   both the **URL and the label**, per patent: the affordance is ours, the destination is yours.

   **The affordance is built and its destination is a stand-in.** *Open in IPTECH* sits beside the
   record's Export and points every patent at the same sign-in page. It is deliberately not a
   constructed link: a per-patent URL assembled from a number and a guessed registry would be right
   often enough to be trusted and wrong without saying so. **The record already reads `sourceUrl`**
   (§1) — absent keeps the placeholder, `null` omits the control — and a label beside it would let
   the control name the registry rather than always saying IPTECH.

4. **Drawings and PDFs — what are the URLs, and does CORS permit a client-side fetch?** The viewer
   already works against images fetched by the browser. A patent *package* (a set's drawings and
   PDFs as one file) cannot be assembled client-side without both, and yours are served
   over IPFS.

   **We need TWO renditions per drawing, and this is not a preference.** A thumbnail for the list —
   eight a row, up to 200 rows — and the full drawing for the enlarged view. Capturing our own
   stress-test set proved the cost of getting it wrong: Google Patents serves both under
   indistinguishable content-hash paths, our capture kept the wrong one for every figure, and the
   enlarged view spent a month upscaling a 4 KB thumbnail eleven times. Nobody noticed, because a
   thumbnail and a drawing are hard to tell apart until something makes one large. **If your response
   carries one URL, say which rendition it is.**

5. **Does anything limit how many searches a plan runs?** How Terrain is sold is not decided, so no
   surface counts what a search costs, which matches your build. If a plan is ever capped by
   searches, seats or anything else, the engine is where that count would live.

6. **Which offices supply legal status, and how fresh is it?** The record prints `status` and its
   expiry, and a dash where it is `null`. Say which offices you hold it for and when it was last
   updated, so a dash is read as *not held* rather than *no status*.

7. **Is 200 an engine ceiling or an interface one?** Your settings and ours offer 10 · 20 · 50 · 100 ·
   200, and the list shows every row, so the ceiling decides whether a founder can ever see everything
   that matched.

8. **How many documents are in each index?** The field exists in your bundle and is not rendered. A
   coverage table that lists sources and dates but not sizes reads as complete, and a founder has no
   way to learn otherwise.

**Two more are ours to settle with you rather than capabilities to confirm** — one came out of
reading the client against this file, one out of your build:

9. **What identifies a result set?** No list port carries one. The engine holds *the most recent
    search* and every later call is about it — which is true of one tab against one process, and false
    of two tabs, a restarted server or a load balancer. A `setId` returned by `search` and sent with
    every list call is the likely answer; it is a change on both sides.

10. **Which forms of a patent number does the lookup accept?** In your build `US9000581B2` and
    `US20130270686A1` are in the index and return *Patent not found*; `EP2214203A2` is found. A founder
    pastes what a registry prints — zero padding, spaces, commas, the kind code or not — and the lookup
    should accept all of it. The demo engine normalises case, punctuation and padding and treats the
    kind code as optional.

**Two more came out of reading your live build, and both are about what it does with a search:**

11. **What does `ipcembedding` mean for retrieval?** Your settings head a field *H01L · Semiconductor
    devices*, an IPC subclass, and the service is named for IPC embeddings. Is each technology field
    its own index, scoped to its subclasses? If it is, a patent classed elsewhere never comes back
    however close it is, and the founder needs to be told what the field excludes. Say which
    subclasses each field covers, and whether `field` is a filter on one index or a choice between
    several.

12. **What does your analytics record, and where is it sent?** Your build runs PostHog with session
    recording. The search box holds an idea a founder may not have filed, so Terrain counts usage
    events and does not record sessions. Say which events you send, and turn recording off — or, if
    any capture has to stay, mask the search box and the record from it.

**Four more came out of reading your engine research and your Round 2 evaluation**, which you
shared with us. They are what a buyer asks first, and we cannot answer them from the surface:

13. **Which index and which route answer a Terrain search?** Your research describes more than one
    way into a patent. Say which a Terrain search runs today — which text fields are embedded,
    whether the drawings are, and whether more than one is combined — so that what Terrain says
    about how it searches is true of what it searches.

14. **What does the score measure, is it calibrated, and what does Rerank do to it?** Every row
    prints it, from `score`, and keeps it after *Find similar*. Your evaluation looked at whether it separates the prior
    art from the rest. Say what the number is — a cosine, a rerank output, normalised or not — and
    whether a higher one means more likely near, or only earlier in this order. Until we know, no
    surface treats it as anything but the order.

15. **What does each field hold, and how large is its index?** Questions 8 and 11 from the other
    side: which classes each field tile covers, and how many patents each index holds, so a buyer
    who asks *how many patents does it search* gets the index rather than the database.

16. **Is a founder's query kept, and is it used for anything?** Whether queries are logged, for
    how long, whether they train or tune any model, and where the engine runs. The search box holds
    an idea that may not be filed, so this is the question a university or an investor asks before
    buying a seat.

*`Figure.alt` is carried and not yet read* — the viewer labels a drawing *Figure n*. Send it when the
source has one; it costs nothing and the client will use it.

**One component generated no question and that is worth saying:** the export. Every field it writes is
already in the client, so it needs nothing from you, which is also why it is the one thing in
Terrain that cannot be taken away by an answer.
