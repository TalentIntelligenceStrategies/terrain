#!/usr/bin/env python3
"""Gates for the generated gh-pages tree. Exits non-zero on any violation.

Written in Python rather than shell on purpose. The first version of these
checks was shell, and three of them silently did not run: grep -P does not
exist on macOS, node --check never fired, and the dangling-reference loop
called exit inside a pipeline subshell so it could not stop the publish.
A check that cannot fail is worse than no check, because it reports clean.

Every gate here is exercised by tools/test-gates.sh against planted
violations. If you add a gate, add a test with it.
"""
import io, os, re, subprocess, sys, tempfile
from html.parser import HTMLParser

root = sys.argv[1]
fails = []
def fail(m): fails.append(m)

files = sorted(
    os.path.relpath(os.path.join(dp, f), root)
    for dp, _, fs in os.walk(root) for f in fs
)
text = {}
for f in files:
    try:
        text[f] = io.open(os.path.join(root, f), encoding='utf-8').read()
    except (UnicodeDecodeError, OSError):
        text[f] = None          # binary (woff2, etc.)

# 1 · no rasters. The published tree is generated, so there is no legitimate
#     raster here at all -- terrain-forest.* belongs to the marketing page,
#     which this branch does not carry.
for f in files:
    if re.search(r'\.(png|jpe?g|gif|webp|bmp|tiff)$', f, re.I):
        fail(f"raster image in the published tree: {f}")

# 2 · nothing local-only
for f in files:
    if re.search(r'visual-reference|iptech-screenshots|comparison-assets|visual.inspo|'
                 r'visual.inspiration|iptech-terrain-comparison|iptech-feature-request', f, re.I):
        fail(f"local-only material: {f}")

# 3 · no client data or billing telemetry, in NAMES or CONTENT
pat = re.compile(r'Tektronix|Nike|Qualcomm|ENANTA|MONOLITHIC|緯穎|富蘭登|光焱|聯享光電|'
                 r'Macroblock|4,50[0-9]|4,49[0-9]|4,438|4,368|10,004|5,566|2,184|78\.5', re.I)
for f, t in text.items():
    if t and pat.search(t):
        fail(f"client data or billing telemetry in {f}: {pat.search(t).group(0)!r}")

# 4 · no base64 images
for f, t in text.items():
    if t and 'data:image' in t:
        fail(f"base64 image embedded in {f}")

# 5 · English-only surface. Terrain has no CJK face, so CJK would render as a
#     system fallback -- and in the HTML it would mean the comment strip missed
#     something, since every scrap of CJK in the prototype lives in comments.
#
#     SCOPED TO HTML DELIBERATELY. Both Innovue marks carry id="圖層_1", which is
#     Illustrator's default layer name from a Chinese-locale export. It is dead
#     metadata in a third party's file reproduced as issued, it never renders,
#     and CLAUDE.md permits their mark as issued. Gating on it would fire on a
#     legitimate file every single run, which is how a check stops being read.
for f, t in text.items():
    if t and f.endswith('.html') and re.search(r'[一-鿿]', t):
        got = re.findall(r'[一-鿿]+', t)[:5]
        fail(f"CJK in {f} (Terrain is English-only): {got}")

# 6 · the commentary really is gone
for f, t in text.items():
    if not t or not f.endswith('.html'):
        continue
    if re.search(r'<!--.*?-->', t, re.S):
        fail(f"HTML comment survived in {f}")
    for _, body in re.findall(r'<(script|style)\b[^>]*>(.*?)</\1>', t, re.S | re.I):
        if re.search(r'/\*.*?\*/', body, re.S):
            fail(f"block comment survived in {f}")

# 7 · every local reference resolves, with EXACT case (Pages is case-sensitive,
#     macOS is not, so this cannot be checked with os.path.exists alone)
present = set(files)
for f, t in text.items():
    if not t or not f.endswith('.html'):
        continue
    base = os.path.dirname(f)
    for ref in re.findall(r'(?:href|src)="([^"]+)"', t):
        if re.match(r'^(https?:|#|mailto:|data:|javascript:)', ref):
            continue
        p = os.path.normpath(os.path.join(base, ref.split('#')[0].split('?')[0]))
        if p and p not in present:
            fail(f"dangling reference in {f}: {ref}")

# 8 · the JavaScript still parses. This is the one that catches a bad strip.
node = subprocess.run(['which', 'node'], capture_output=True).returncode == 0
for f, t in text.items():
    if not t or not f.endswith('.html'):
        continue
    blocks = re.findall(r'<script[^>]*>(.*?)</script>', t, re.S | re.I)
    if not node:
        fail(f"node not installed -- cannot verify the JavaScript in {f} still parses")
        break
    for i, b in enumerate(blocks):
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as fh:
            fh.write(b); tmp = fh.name
        r = subprocess.run(['node', '--check', tmp], capture_output=True, text=True)
        os.unlink(tmp)
        if r.returncode:
            fail(f"script {i} in {f} does not parse: {r.stderr.strip().splitlines()[0][:140]}")

# 8a · every <style> block's braces balance. THIS GATE EXISTS BECAUSE ONE DID
#      NOT, and the bug shipped: a single orphaned `}` sat above
#      `.lm{position:relative}` in the prototype. At the top level CSS does not
#      discard a stray brace -- it starts a qualified rule, takes `}` as the
#      beginning of a selector, and swallows everything through the NEXT
#      `{...}`. So the brace and the rule after it were parsed as one bogus
#      rule and both were dropped.
#
#      IT REPORTED NOTHING. No console error, and the rules on either side
#      parsed normally, so the only symptom was that every list menu opened
#      550px from its button. gate 8 does this for JavaScript; nothing did it
#      for CSS, which is the whole of why it survived.
def css_depth_errors(css):
    """Brace depth over a stylesheet, ignoring comments and strings."""
    out = []
    i, n, depth = 0, len(css), 0
    line = 1
    while i < n:
        c = css[i]
        if css[i:i+2] == '/*':
            j = css.find('*/', i+2); j = n if j < 0 else j+2
            line += css.count('\n', i, j); i = j; continue
        if c in '"\'':
            q = c; j = i+1
            while j < n:
                if css[j] == '\\': j += 2; continue
                if css[j] == q: j += 1; break
                j += 1
            line += css.count('\n', i, j); i = j; continue
        if c == '\n': line += 1
        elif c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth < 0:
                out.append(f"stray '}}' at stylesheet line {line}")
                depth = 0        # keep going, report every one
        i += 1
    if depth > 0:
        out.append(f"{depth} unclosed block(s) at end of stylesheet")
    return out

for f, t in text.items():
    if not t or not f.endswith('.html'):
        continue
    for blk in re.findall(r'<style[^>]*>(.*?)</style>', t, re.S | re.I):
        for m in css_depth_errors(blk):
            fail(f"unbalanced CSS in {f}: {m} -- a stray brace silently eats the rule after it")

# 9 · the OFL licences travel with the fonts (OFL 1.1, public redistribution)
if any(f.endswith('.woff2') for f in files):
    for lic in ('brand/fonts/OFL-Urbanist.txt', 'brand/fonts/OFL-Inconsolata.txt'):
        if lic not in present:
            fail(f"fonts are published without {lic} -- OFL 1.1 requires the notice travel with them")

# 10 · the link preview survives. These are the difference between a link that
#      reads as a product and one that reads as a broken URL, they live in the
#      prototype's <head> on main, and nothing else would notice if an edit
#      dropped them. og:image is absent ON PURPOSE -- it would have to be a
#      raster, and the raster rule admits three literal paths.
required = ['name="description"', 'name="robots"', 'property="og:title"',
            'property="og:description"', 'property="og:url"', 'name="twitter:card"']
idx = text.get('index.html')
if idx is None:
    fail("index.html is missing from the published tree")
else:
    for tag in required:
        if tag not in idx:
            fail(f"link-preview meta tag missing from index.html: {tag}")
    if 'noindex' not in idx:
        fail("index.html is no longer noindex -- the prototype would become searchable")

if fails:
    print(f"REFUSING TO PUBLISH — {len(fails)} problem(s):")
    for m in fails:
        print(f"  · {m}")
    sys.exit(1)
print(f"   all gates clean — {len(files)} files")
