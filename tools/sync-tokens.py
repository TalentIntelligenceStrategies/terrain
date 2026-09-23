#!/usr/bin/env python3
"""Copy app/styles/tokens.css into every page that carries a copy of it.

WHY THIS EXISTS. CLAUDE.md: every page carries its own tokens in its own
bytes -- a prototype somebody opens from a download has to work with nothing
beside it -- and ONE file authors them. Those two only hold together with a
generator, so this is it. app/styles/tokens.css is the authored copy; every
other copy is the region between the sentinels below.

BYTE-FOR-BYTE, NOT VALUE-FOR-VALUE, and that is the whole design. The block
carries ~130 lines of irreplaceable reasoning: every measured contrast ratio,
the withdrawn --mark-1 hue, why the dark list is duplicated. A value diff
passes while all of it drifts, and the comments are where §10.3's measured
numbers actually live. A byte compare also has no parser to be wrong, which
matters in a repo bitten twice by checks that looked right and did not run.

The bad idea, recorded so nobody rebuilds it: a value diff with a tolerance --
"colours must match, comments need not". It is 20% less code and exactly how
drift returns.

  --write   rewrite every region from tokens.css
  --check   verify every region matches, byte for byte. CI runs this.

A page may declare its OWN tokens below the closing sentinel; nothing here
touches anything outside the region.
"""
import sys, os, io

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = 'app/styles/tokens.css'
OPEN   = '/* ══ tokens · generated ══ */'
CLOSE  = '/* ══ end tokens ══ */'

# Every page that carries a copy. Adding a page means adding it here AND
# putting the two sentinels in it -- a page with no sentinels is refused
# rather than skipped, because skipping is how a copy goes stale in silence.
#
# app/index.html IS NOT ON THIS LIST, and the reason is the rule's own reason.
# Pages inline their tokens so that a prototype somebody opens from a download
# works with nothing beside it. app/ cannot work with nothing beside it under
# any circumstances -- it needs a server, a stylesheet manifest and a module
# graph -- so it LINKS app/styles/tokens.css, which sits in the directory next
# to it. A third copy of the block, generated into the page that owns the
# authored one, would be drift risk bought for nothing.
# terrain-prototype.html IS NOT ON THIS LIST EITHER, AND IT WAS. It is FROZEN
# AT v1 -- the landscape product, with the map. app/ no longer renders a map, so
# the chart, density and categorical-mark tokens left the authored file; the
# prototype still reads 28 of them and regenerating its block would blank the
# one artifact the public link serves.
#
# Freezing is the narrow move rather than deleting the page: it stays readable,
# it stays published, and it stops claiming to track a file it no longer agrees
# with. The cost is that its block can no longer be verified, and that is why
# the page carries its own note saying which it is.
#
# THIS IS TEMPORARY BY INTENT. The exit is publishing app/ itself at the same
# URL, which needs strip-comments.py to run across a tree rather than over one
# file. Until that lands, this list has one entry.
TARGETS = [
    'design/previews/terrain-loading-lab.html',
]

def read(p):
    return io.open(os.path.join(ROOT, p), encoding='utf-8').read()

def region(text, path):
    """(before, current, after) around the generated region. Raises on trouble."""
    no = text.count(OPEN)
    nc = text.count(CLOSE)
    if no != 1 or nc != 1:
        raise ValueError(
            f'{path}: expected exactly one opening and one closing sentinel, '
            f'found {no} opening and {nc} closing')
    i = text.index(OPEN)
    j = text.index(CLOSE)
    if j < i:
        raise ValueError(f'{path}: the closing sentinel precedes the opening one')
    return text[:i + len(OPEN)], text[i + len(OPEN):j], text[j:]

def wanted():
    body = read(SOURCE)
    # one blank line inside each sentinel, so the region reads as a block
    return '\n' + body.rstrip('\n') + '\n'

def main():
    if len(sys.argv) != 2 or sys.argv[1] not in ('--write', '--check'):
        print(__doc__.strip()); return 2
    mode = sys.argv[1]
    want = wanted()
    bad = []
    for t in TARGETS:
        full = os.path.join(ROOT, t)
        if not os.path.exists(full):
            # A MISSING target is reported, never silently passed: a target
            # that quietly drops off the list is a copy nobody syncs again.
            bad.append(f'{t}: does not exist')
            continue
        text = read(t)
        try:
            before, current, after = region(text, t)
        except ValueError as e:
            bad.append(str(e)); continue
        if current == want:
            if mode == '--check': print(f'  ok    {t}')
            continue
        if mode == '--write':
            io.open(full, 'w', encoding='utf-8').write(before + want + after)
            print(f'  wrote {t}')
        else:
            cl, wl = current.split('\n'), want.split('\n')
            first = next((n for n in range(max(len(cl), len(wl)))
                          if (cl[n] if n < len(cl) else None) != (wl[n] if n < len(wl) else None)), 0)
            bad.append(
                f'{t}: the generated region does not match {SOURCE} byte for byte.\n'
                f'      first difference at region line {first + 1}:\n'
                f'        in the page: {(cl[first] if first < len(cl) else "<region ends>")!r}\n'
                f'        in {SOURCE}: {(wl[first] if first < len(wl) else "<source ends>")!r}\n'
                f'      run  python3 tools/sync-tokens.py --write')
    if bad:
        print('token sync FAILED')
        for b in bad: print('  ' + b)
        return 1
    print(f'  tokens in sync — {len(TARGETS)} pages carry {SOURCE} byte for byte')
    return 0

if __name__ == '__main__':
    sys.exit(main())
