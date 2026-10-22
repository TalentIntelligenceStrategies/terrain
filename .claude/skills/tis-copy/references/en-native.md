# en-native — English that reads as first-language

**Run on all English output.** A reader who stops to re-parse a sentence has stopped listening to the
argument inside it. This is register, not a note about anyone's competence: much of TIS's source
material is written in English by second-language speakers, and the defect it leaves is Chinese
structure wearing English words.

---

## 1 · The reverse translation test

**Render the sentence into Chinese. Does it come out clean, with no restructuring?** Then the English
was probably built on Chinese structure.

| English | Fix |
| --- | --- |
| "you converge the scope" | "you narrow the scope" — *converge* is intransitive |
| "the logic scatters" | "the reasoning goes with them" |
| "country layout" | "country coverage" |
| "layout density" | "filing density" |

**佈局 is the worked example for why this is a pass, not a lookup.** It arrives as *layout* and
English needs two different words for it — *filing density* in one compound, *coverage* in another.
A find-and-replace produces the wrong one half the time.

## 2 · The five categories

Greps find candidates; **the grep is never the verdict.** These use `grep -E` and Python because
macOS `grep` has no `-P` — a check that silently does not run reports clean.

```bash
# A — imported punctuation and stray CJK
python3 - <file> <<'PY'
import re, sys
t = open(sys.argv[1], encoding='utf-8').read()
for m in re.finditer(r'.{0,40}([×→·]|[一-鿿]).{0,10}', t):
    print(m.group(0))
PY
grep -nE ' / '            <file>   # slash as a conjunction
grep -nE '& '             <file>   # ampersand — keep in titles, cut in sentences
grep -nE '\b\w+ x \w+'    <file>   # lowercase x doing multiplication's job
```

**B — calques.** No grep. Run §1 on every sentence carrying a verb you would not say aloud.

**C — articles and agreement.** Read every headline noun phrase aloud with *the* or *a* inserted. If
it improves, one was missing. Check adjective-for-adverb: *most lack* → *mostly lack*.

**D — parallelism and person.** Invisible one item at a time and obvious down a column. Extract each
list into a column; every member has the same grammatical shape, and person and mood do not change
inside one sentence.

**E — headline case.** Count Title Case and sentence case across the piece. **The majority decides.**
A deck carrying both has a visible seam.

## 3 · Judge the use, not the substring

| | Wrong | Leave it |
| --- | --- | --- |
| `×` | joining noun phrases as *and* | a real operator: *1.7×* |
| `→` | carrying a sentence's only verb | a process flow: *Search → Star → Export* |
| `&` | inside a sentence | a title or a noun list |
| `·` | separating a label from its value | a chip or citation separator |
| `/` | standing in for *and* / *or* in prose | a real either-or label: *CSV / Markdown* |

## 4 · What a fluency pass may never do

1. **Change a claim.** Not a digit, counterparty, jurisdiction or scope word. **Prove it**: extract
   the digits and names before and after and compare. A copy pass that cannot prove it changed no
   claim is indistinguishable from a claim pass that got lucky.
2. **Reshape a headline's rhetoric** unless asked. Fixing a calque in a headline is fluency;
   rewriting it for impact is a different job with a different approval.
3. **Break the layout.** A better sentence that wraps one card in a row of three is a worse slide.
   Re-measure.
4. **Touch a locked line** — a deck line in `sales/answers.md`, a figure with its scope, a
   *Never say* term. Fluency never overrides what may be claimed.
5. **Go unrecorded.** Every changed string gets a before/after row.

## 5 · Report

- The count by category, and where.
- The invariance result — digits and names, stated, not assumed.
- The layout result — measured, not eyeballed.
- **What you did not change and why.** An unstated decision reads as an oversight.
