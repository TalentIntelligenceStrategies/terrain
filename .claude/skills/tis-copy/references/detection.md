# Detection — mechanical quality checks

Run all four. Every item is checkable by two reviewers independently. A failure is a rewrite.

Adapted from [great-writer](https://github.com/d-wwei/great-writer) (MIT). Where it disagrees with
`docs/brief.md` or the banned lists the skill names, **those win**.

---

## 1 · Say it out loud

Would you say this sentence to a smart founder across a table? No → rewrite.

**Keep** the connectors that are how thought turns: *but*, *so*. **Cut** the filing-cabinet ones:
*Furthermore*, *Additionally*, *It is worth noting that*, *Moreover*.

| Written | Spoken |
| --- | --- |
| "It is worth noting that the system provides…" | "It also gives you…" |
| "This fundamentally transforms the paradigm of…" | "This changes how you…" |

**Interface and legal copy** become *clear and exact*: no rhetorical questions, no asides. Legal
copy is a liability instrument; precision outranks readability where they conflict.

---

## 2 · AI slop

### 2a · Vocabulary

The skill's banned lists are authoritative. These are additions they do not carry:

"In today's rapidly evolving…" · "It's worth noting that" · "In conclusion" / "To summarize" ·
"Delve into" / "Dive deep into" · "Excited to announce" / "Thrilled to share" · "Robust" /
"Holistic" / "Comprehensive" · "seamlessly integrates" · "It goes without saying" · "At the end of
the day" · "experts say" / "studies show" / "research indicates" without naming which.

**Judge the use, not the substring.** Scope a grep to copy, not code — *seamless* in a CSS comment
about an animation loop is not copy.

### 2b · Structure

Each is fine alone. What marks generated text is several at once, uniformly applied.

| Pattern | Detection | Fix |
| --- | --- | --- |
| Low burstiness | 3+ consecutive sentences within ±20% word count | A 4-word punch or a 30-word breather |
| Rule-of-three compulsion | Every list has exactly 3 items | Use 2, 4 or 5. Keep triplets for deliberate effect |
| Significance inflation | A paragraph ends explaining why the thing matters | Delete it. If it isn't obvious, the content failed |
| Copula avoidance | "serves as" / "functions as" for "is" | Use "is" |
| Outline-as-prose | Parallel headers with identical internal structure | Vary length; nest unevenly |
| Negative parallelism | "not X, but Y" more than once | Once is emphasis. Twice is a tic |
| Symmetrical weight | Every section the same length | The section that matters gets 40% |
| Hedging uniformity | The same hedge level whatever the certainty | Confident where you know; cut what you can't back |

**Do not apply to** tables, spec lists or field enumerations. Parallel structure is correct there.

### 2c · Filler

Cut crutch words (*actually*, *really*, *truly*), inflated symbolism, and poster lines. If a sentence
would look good on a motivational poster, rewrite it — over-polish reads as untrustworthy, which is
fatal for a product whose claim is trust.

---

## 3 · Anti-style

| If you're… | Then… |
| --- | --- |
| Explaining | Show the mechanism instead — the sentence in, the set out, the file |
| Listing | Keep the strongest item, cut the rest |
| Inventing a framework | Delete the acronym and the matrix. One sentence |
| Covering everything | One point per slide. Say it. Stop |
| Repeating an argument | Strengthen the first occurrence, delete the second |
| Writing what any product could write | Fails the swap test |

---

## 4 · Checklist

- [ ] Passes say-it-out-loud, at the register of its surface
- [ ] Zero banned phrases — both lists re-read, plus §2a here
- [ ] Fewer than 3 structural patterns from §2b firing at once
- [ ] No filler, no poster lines
- [ ] Passes the swap test
- [ ] Every claim carries its basis in the same sentence or the note beside it
- [ ] Nothing reads the set outside a report's AI-written part; *report* names only the patent report
- [ ] Opening enters directly — no context-setting
- [ ] Closing doesn't restate what was just said
