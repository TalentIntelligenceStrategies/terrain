#!/usr/bin/env python3
"""Gates for the SOURCE tree. Exits non-zero on any violation.

WHY THIS FILE EXISTS, and it is the highest-risk item in the extraction.

check-publish.py gates 6 (comments stripped), 8 (JS parses), 8a (CSS braces
balance), 9 (every :hover gated), 9a (no base rule inside a hover gate) and 11
(link-preview meta) all read <style> and <script> blocks INSIDE .html FILES.
Split the CSS into 22 files and the JS into ES modules and every one of them
finds nothing to read, finds no violation, and REPORTS CLEAN -- which is
verbatim the failure CLAUDE.md records as the reason the gates were rewritten
in Python in the first place. The generated tree cannot see the source tree, so
the cover has to be rebuilt on this side.

It also carries the gates that only make sense on source: the token tiers, the
theme contract, the demo seam, and the state-convention rules that the file
split introduces for free by putting the module that writes an attribute and
the file that styles it in different directories.

Run:  python3 tools/check-app.py
Every gate is exercised by tools/test-gates.sh against a planted violation.
ADD A GATE, ADD ITS TEST -- a gate nobody has watched fail is not a gate.
"""
import io, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from cssgates import (css_depth_errors, ungated_hovers,
                      base_rules_in_hover_gate, styles_in)

fails = []
def fail(m): fails.append(m)

# ── what is in scope ──────────────────────────────────────────────────────
# Only files this repository authors. The two IPtech previews are deliberately
# out: they exist to argue with this system rather than conform to it.
def walk(rel, exts):
    base = os.path.join(ROOT, rel)
    if not os.path.isdir(base):
        return []
    out = []
    for dp, _, fs in os.walk(base):
        for f in sorted(fs):
            if f.endswith(exts):
                out.append(os.path.relpath(os.path.join(dp, f), ROOT))
    return sorted(out)

APP_CSS  = walk('app/styles', ('.css',))
APP_JS   = walk('app/js', ('.mjs', '.js'))
DEMO_JS  = walk('demo', ('.mjs', '.js'))
APP_HTML = [p for p in walk('app', ('.html',))]
PARTIALS = walk('app/partials', ('.html',))
PREVIEWS = ['design/previews/terrain-prototype.html',
            'design/previews/terrain-loading-lab.html']
TOKENS   = 'app/styles/tokens.css'

def read(p):
    return io.open(os.path.join(ROOT, p), encoding='utf-8').read()

texts = {p: read(p) for p in APP_CSS + APP_JS + DEMO_JS + APP_HTML + PARTIALS
         + [p for p in PREVIEWS if os.path.exists(os.path.join(ROOT, p))]}

def strip_comments_css(css):
    return re.sub(r'/\*.*?\*/', '', css, flags=re.S)


# ── the three lifted CSS scanners, now over .css files too ────────────────
# This is the cover that goes dark when the CSS leaves the HTML.
for p, t in texts.items():
    if not (p.endswith('.css') or p.endswith('.html')):
        continue
    for blk in styles_in(p, t):
        for m in css_depth_errors(blk):
            fail(f"{p}: unbalanced CSS -- {m}. A stray brace silently eats the rule after it")
        for ln, sel in ungated_hovers(blk):
            fail(f"{p}:{ln}: ungated :hover -- {sel}. On a touch screen it applies on TAP "
                 f"and sticks until something else is tapped")
        # ── GATE F ──
        for ln, sel in base_rules_in_hover_gate(blk):
            fail(f"{p}:{ln}: base rule inside a hover gate -- {sel}. It never applies on a "
                 f"coarse pointer, and no screenshot at any width can catch that")


# ── GATE A · no component may read a primitive or a raw hex ───────────────
# design-language.md §3.2. A component that reads --n-* is a component that
# STAYS LIGHT and throws nothing, logs nothing, and reads as correct CSS.
# Eleven of them did before the dark pass, and every one reported clean.
HEX = re.compile(r'#[0-9A-Fa-f]{3,8}\b')
FN  = re.compile(r'\b(rgba?|hsla?)\s*\(')
for p in APP_CSS:
    if p == TOKENS:
        continue                        # the one file that declares values
    body = strip_comments_css(texts[p])
    for m in re.finditer(r'var\(\s*(--n-\d+)', body):
        fail(f"{p}: component reads the primitive {m.group(1)} -- read a semantic token; "
             f"a primitive does not move when the theme does")
    for m in HEX.finditer(body):
        fail(f"{p}: raw hex {m.group(0)} -- every colour is a token ({TOKENS})")
    for m in FN.finditer(body):
        fail(f"{p}: inline {m.group(1)}() -- an alpha is a token too; "
             f"--key-ring and --veil are the two that exist")


# ── GATE C · only tokens.css may declare a custom property on :root ───────
# This turns §3.2's exemption into a FILE rather than a list of blocks that
# goes stale the moment somebody adds a fourth.
for p in APP_CSS:
    if p == TOKENS:
        continue
    body = strip_comments_css(texts[p])
    for m in re.finditer(r'(^|[}\s])(:root|html)\b[^{]*\{([^{}]*)\}', body):
        if re.search(r'--[\w-]+\s*:', m.group(3)):
            fail(f"{p}: declares a custom property on {m.group(2)} -- {TOKENS} is the only "
                 f"file permitted to. A token declared beside a component is a token "
                 f"nobody finds when the theme changes")


# ── GATE D · the three theme blocks carry the same names in the same order ─
# ADDED TO LIGHT, FORGOT DARK is the mistake whose symptom is a component that
# silently stays light. Ordering the file by theme-variance is what makes this
# a one-line assertion instead of a diff nobody runs.
def blocks_of(css):
    """(selector, [token names in order]) for every declaration block."""
    out, i = [], 0
    while True:
        j = css.find('{', i)
        if j < 0:
            break
        sel = ' '.join(strip_comments_css(css[i:j]).split())
        d, k = 1, j + 1
        while d and k < len(css):
            if css[k] == '{': d += 1
            elif css[k] == '}': d -= 1
            k += 1
        body = css[j + 1:k - 1]
        if sel.startswith('@media'):
            for s2, t2 in blocks_of(body):
                out.append((f'@media{{{s2}}}', t2))
        else:
            out.append((sel, re.findall(r'(--[\w-]+)\s*:', strip_comments_css(body))))
        i = k
    return out

if os.path.exists(os.path.join(ROOT, TOKENS)):
    tok = texts[TOKENS]
    runs = [(s, t) for s, t in blocks_of(tok) if t]
    light = [t for s, t in runs if s == ':root']
    med   = [t for s, t in runs if s.startswith('@media')]
    attr  = [t for s, t in runs if s == ':root[data-theme="dark"]']
    if len(light) < 3 or not med or not attr:
        fail(f"{TOKENS}: expected three :root tiers plus both dark blocks; "
             f"found {len(light)} :root, {len(med)} media, {len(attr)} attribute")
    else:
        semantic = light[2]             # primitive, scale, semantic
        for name, other in (('the dark media block', med[0]),
                            ('the [data-theme=dark] block', attr[0])):
            if other != semantic:
                miss = [t for t in semantic if t not in other]
                extra = [t for t in other if t not in semantic]
                if miss:
                    fail(f"{TOKENS}: {name} is missing {miss} -- a token added to light and "
                         f"not to dark is a component that silently stays light")
                if extra:
                    fail(f"{TOKENS}: {name} declares {extra}, which light does not")
                if not miss and not extra:
                    fail(f"{TOKENS}: {name} carries the same names in a DIFFERENT ORDER. "
                         f"The order is the check; keep the three blocks parallel")
        # derived tokens must never be redefined in a dark block
        derived = light[3] if len(light) > 3 else []
        for d in derived:
            if d in med[0] or d in attr[0]:
                fail(f"{TOKENS}: {d} is derived and is ALSO declared in a dark block. "
                     f"A literal there pins it to one palette while reading as correct")

# ── GATE G · every printed copy of the tier counts matches tokens.css ──────
# THE SUCCESSOR TO A RULE THAT COULD ONLY BE OBEYED BY REMEMBERING.
# design-language.md §10.1 used to claim it was "the one place that count
# appears". It was not -- the number lived in three files, and it drifted in
# all three: they read 42 while tokens.css held 29. A number repeated in three
# documents is a number nobody can keep right by discipline, so it is parsed
# from the file and every printed copy has to agree.
#
# It counts the tiers it can see rather than a list of names, so adding a
# semantic token fails here until the three documents are updated -- which is
# the point. Add a token, move the number.
if os.path.exists(os.path.join(ROOT, TOKENS)) and len(light) >= 4:
    counts = {'primitive': len(light[0]), 'scale': len(light[1]),
              'semantic': len(light[2]), 'derived': len(light[3])}
    # (file, regex with the tier's count as group 1, tier)
    PRINTED = [
        ('docs/design-language.md',
         r'\*\*(\d+) semantic tokens\*\*', 'semantic'),
        ('docs/design-language.md',
         r'\|\s*\*\*semantic\*\*\s*\|\s*(\d+)\s*\|', 'semantic'),
        ('docs/design-language.md',
         r'\|\s*\*\*derived\*\*\s*\|\s*(\d+)\s*\|', 'derived'),
        ('CLAUDE.md',
         r'swap of \*\*(\d+) semantic tokens\*\*', 'semantic'),
        ('app/README.md',
         r'\|\s*semantic\s*\|\s*(\d+)\s*\|', 'semantic'),
        ('app/README.md',
         r'\|\s*derived\s*\|\s*(\d+)\s*\|', 'derived'),
    ]
    for rel, pat, tier in PRINTED:
        ap = os.path.join(ROOT, rel)
        if not os.path.exists(ap):
            fail(f"{rel}: missing -- it prints the {tier} token count and this gate reads it")
            continue
        body = io.open(ap, encoding='utf-8').read()
        hits = re.findall(pat, body)
        if not hits:
            fail(f"{rel}: the printed {tier} count could not be found. "
                 f"GATE G reads it by pattern; if the sentence moved, move the pattern")
        for h in hits:
            if int(h) != counts[tier]:
                fail(f"{rel}: prints {h} {tier} tokens; {TOKENS} holds {counts[tier]}. "
                     f"A count repeated in three documents drifts in all of them")


# ── GATE E · a theme selector may only ever be combined with :root / html ──
# The two exceptions are literal, no glob, the same shape as the raster rule:
# a custom property cannot carry an `src`, and tokenising the attribution mark
# into a background-image would drop the alt on a third party's mark.
THEME_ALLOWLIST = {'.foot-mark-light', '.foot-mark-dark'}
# The two shapes a theme selector may take, and nothing else:
#   :root[data-theme="dark"]              the explicit choice
#   :root:not([data-theme="light"])       inside the media query
THEME_ROOT = re.compile(r'^\s*(?::root|html)\s*'
                        r'(?:\[data-theme="(?:dark|light)"\]|:not\(\[data-theme="(?:dark|light)"\]\))')
for p in APP_CSS + PREVIEWS:
    if p not in texts:
        continue
    for blk in styles_in(p, texts[p]):
        for sel, _ in blocks_of(blk):
            sel = re.sub(r'^@media\{(.*)\}$', r'\1', sel)     # unwrap the media nesting
            if 'data-theme' not in sel:
                continue
            for one in sel.split(','):
                one = one.strip()
                if not one or 'data-theme' not in one:
                    continue
                m = THEME_ROOT.match(one)
                if not m:
                    fail(f"{p}: theme selector {one!r} does not start at :root or html. "
                         f"Dark is a swap on the root and nothing else")
                    continue
                rest = one[m.end():].strip()
                if rest and rest not in THEME_ALLOWLIST:
                    fail(f"{p}: theme selector combined with {rest!r} -- dark is a token swap "
                         f"and touches no component rule. The only two exceptions are "
                         f"{sorted(THEME_ALLOWLIST)}")


# ── GATE B · every var() resolves, or declares a fallback, or is on the list ─
# The list is app/README.md's "The properties JavaScript sets" table, read from
# the document rather than retyped here, so the table cannot go stale while the
# gate passes. A var() that is set by nothing and falls back to nothing is
# INVALID AT COMPUTED-VALUE TIME and the property takes its INITIAL value --
# which for opacity is 1, and which turned the reduced-motion loader into a
# solid block while every grep for the token found it.
def js_interface():
    doc = os.path.join(ROOT, 'app/README.md')
    if not os.path.exists(doc):
        return None
    t = io.open(doc, encoding='utf-8').read()
    m = re.search(r'The properties JavaScript sets(.*?)(?=\n#|\Z)', t, re.S)
    return set(re.findall(r'`(--[\w-]+)`', m.group(1))) if m else set()

# SCOPED TO app/styles/** ON PURPOSE. Resolving these against the prototype's
# declarations would make the gate pass on a token app/ has not extracted yet,
# which is the loophole that lets the extraction ship a var() set by nothing.
declared = set()
for p in APP_CSS:
    for blk in styles_in(p, texts[p]):
        declared |= set(re.findall(r'(--[\w-]+)\s*:', strip_comments_css(blk)))
iface = js_interface()
if iface is None:
    fail("app/README.md is missing -- gate B reads its interface table, and without it a "
         "var() set by nothing cannot be told from one JavaScript sets")
for p in APP_CSS:
    body = strip_comments_css(texts[p])
    for m in re.finditer(r'var\(\s*(--[\w-]+)\s*([,)])', body):
        name, nxt = m.group(1), m.group(2)
        if nxt == ',' or name in declared:
            continue                     # has a fallback, or resolves in CSS
        # BEING IN THE INTERFACE TABLE IS NOT AN EXEMPTION -- IT IS THE OPPOSITE.
        # A property JavaScript sets is precisely the one that MUST carry a
        # fallback, because JavaScript may not have run yet, may have failed,
        # or the markup may have been shipped statically. That last case is the
        # handoff case exactly, and it is how .dmx-dot{opacity:var(--rest)}
        # turned the reduced-motion loader into a solid block.
        extra = (" It is in app/README.md's interface table, which is the reason it needs a "
                 "fallback rather than an excuse for not having one."
                 if iface and name in iface else
                 " It is not declared in app/styles/** either.")
        fail(f"{p}: var({name}) has no fallback and is declared nowhere." + extra +
             " It is INVALID at computed-value time, so the property silently takes its "
             "INITIAL value -- 1, for opacity")

# Every row of the interface table must name a property that EXISTS SOMEWHERE
# -- read by a stylesheet, declared by one, or set by a module.
#
# SCOPED ACROSS app/ AND THE PROTOTYPE ON PURPOSE. While the extraction is in
# flight the table describes the contract being delivered, so a property whose
# stylesheet has not been split out yet is ahead of the code rather than dead.
# What this still catches is the one thing that matters: a row naming a
# property that exists NOWHERE, which is a row that outlived its property.
if iface:
    everywhere = set()
    for p in list(texts):
        t = texts[p]
        everywhere |= set(re.findall(r'var\(\s*(--[\w-]+)', t))
        everywhere |= set(re.findall(r'''setProperty\(\s*['"](--[\w-]+)['"]''', t))
        everywhere |= set(re.findall(r'(--[\w-]+)\s*:', t))
    stale = [t for t in sorted(iface) if t not in everywhere]
    if stale:
        fail(f"app/README.md's interface table lists {stale}, which nothing anywhere reads, "
             f"declares or sets. A row that outlived its property is worse than no table, "
             f"because gate B trusts it")




# ── the state conventions · three, written down, not unified ──────────────
# 1 Does ARIA already have a word for it? Then ARIA is the state and CSS styles
#   the attribute. NO MIRROR CLASS -- a mirror can drift, and the attribute is
#   the one a screen reader reads. There is no .is-on here, and that is the
#   strongest thing about it.
MIRRORS = re.compile(r'\.is-(on|off|checked|pressed|selected|current|disabled|invalid)\b')
for p in APP_CSS + APP_JS:
    if p in texts:
        for m in MIRRORS.finditer(strip_comments_css(texts[p]) if p.endswith('.css') else texts[p]):
            fail(f"{p}: {m.group(0)} mirrors an ARIA state. Style the attribute instead -- "
                 f"a mirror class can drift from the thing a screen reader actually reads")

# For every [aria-X="V"] the CSS styles, some module must actually set it.
# THIS IS THE ONE BUG CLASS THE FILE SPLIT INTRODUCES FOR FREE: the module that
# writes the attribute and the file that styles it are now in different
# directories, so a rename on one side is silent on the other.
# TURNS ON WITH app/js/surfaces/, and not before. The check compares the
# modules that WRITE an attribute against the stylesheets that STYLE it, so
# until the surface modules exist there is nothing on one side of the
# comparison and the check would only report that the extraction is unfinished
# -- which is not what it is for, and a check that fires on a known-incomplete
# tree is a check people learn to skip.
SURFACES = walk('app/js/surfaces', ('.mjs',))
if SURFACES:
    alljs = '\n'.join(texts[p] for p in APP_JS)
    styled = set()
    for p in APP_CSS:
        styled |= set(re.findall(r'\[(aria-[\w-]+)\s*=', strip_comments_css(texts[p])))
    for a in sorted(styled):
        if not re.search(rf'''setAttribute\(\s*['"]{re.escape(a)}['"]''', alljs) \
           and not re.search(rf'''{re.escape(a)}''', '\n'.join(texts[p] for p in PARTIALS) or ''):
            fail(f"app/styles: [{a}] is styled but no module sets it and no partial carries it. "
                 f"The writer and the styler are in different directories now")


# ── the demo seam · one import, under a banner ────────────────────────────
# app/js/** and app/partials/** are the contract and never hold data. demo/**
# is deletable entirely. The boundary is ONE import line in main.mjs.
demo_importers = []
for p in APP_JS:
    for m in re.finditer(r'''(?:from|import)\s*['"]([^'"]*\bdemo/[^'"]*)['"]''', texts[p]):
        demo_importers.append((p, m.group(1)))
allowed = 'app/js/main.mjs'
for p, ref in demo_importers:
    if p != allowed:
        fail(f"{p}: imports {ref}. demo/ is imported exactly once, in {allowed}, so that "
             f"deleting demo/ leaves one broken line rather than a search")
if len(demo_importers) > 1:
    fail(f"demo/ is imported {len(demo_importers)} times; the seam is ONE import line")


# ── the stylesheet manifest · the number IS the cascade ───────────────────
# 22 <link> tags and not an @import chain: @import serialises discovery, and
# <link> keeps DevTools honest about which file a rule came from. The last one
# must be 99-reduced-motion.css -- 20 of its 28 rules are same-specificity
# overrides declaring END STATES, which is what prevents the blank-screen
# failure design-language.md §6 records from a real incident.
linked_anywhere = set()
for p in APP_HTML:
    t = texts[p]
    links = re.findall(r'<link[^>]+href="(styles/[^"]+\.css)"', t)
    if not links:
        continue
    for l in links:
        if not os.path.exists(os.path.join(ROOT, 'app', l)):
            fail(f"{p}: links {l}, which does not exist")
    linked = [os.path.basename(l) for l in links]
    linked_anywhere |= set(linked)
    # ORDER IS CHECKED PER PAGE, because order is a property of a page.
    if linked[-1] != '99-reduced-motion.css':
        fail(f"{p}: the last stylesheet is {linked[-1]}, not 99-reduced-motion.css. "
             f"It declares end states at the same specificity and MUST win")
    nums = [int(m.group(1)) for m in (re.match(r'^(\d\d)-', c) for c in linked) if m]
    if nums != sorted(nums):
        fail(f"{p}: the stylesheets are linked out of numeric order ({linked}). "
             f"The number IS the cascade, so the tag order has to match it")
    if any('@import' in b for b in re.findall(r'<style[^>]*>(.*?)</style>', t, re.S)):
        fail(f"{p}: @import serialises discovery and hides which file a rule came from; "
             f"use one <link> per stylesheet")

# COLLECTIVELY, not per page: lab.html legitimately links a stylesheet
# index.html does not. What is not allowed is a stylesheet NO page links.
if APP_HTML:
    on_disk = [os.path.basename(c) for c in APP_CSS]
    orphans = [c for c in on_disk if c not in linked_anywhere]
    if orphans:
        fail(f"{orphans} exist in app/styles/ and no page links them. "
             f"A stylesheet nobody links is a stylesheet nobody knows is dead")


# ── the JavaScript parses ─────────────────────────────────────────────────
if APP_JS or DEMO_JS:
    if subprocess.run(['which', 'node'], capture_output=True).returncode:
        fail("node is not installed -- cannot verify the modules parse")
    else:
        for p in APP_JS + DEMO_JS:
            with tempfile.NamedTemporaryFile('w', suffix='.mjs', delete=False,
                                             encoding='utf-8') as fh:
                fh.write(texts[p]); tmp = fh.name
            r = subprocess.run(['node', '--check', tmp], capture_output=True, text=True)
            os.unlink(tmp)
            if r.returncode:
                fail(f"{p} does not parse: {r.stderr.strip().splitlines()[0][:140]}")


# ── report ────────────────────────────────────────────────────────────────
if fails:
    print(f"check-app: {len(fails)} problem(s):")
    for m in fails:
        print(f"  · {m}")
    sys.exit(1)
n = len(APP_CSS) + len(APP_JS) + len(APP_HTML) + len(PARTIALS) + len(DEMO_JS)
print(f"   source tree clean — {n} authored files "
      f"({len(APP_CSS)} css, {len(APP_JS)} modules, {len(PARTIALS)} partials, "
      f"{len(DEMO_JS)} demo)")
