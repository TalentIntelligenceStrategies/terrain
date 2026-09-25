#!/usr/bin/env python3
"""publish-pages — assemble the gh-pages tree and push it.

═══ THE FENCE MOVED, AND THIS IS WHAT IT ADMITS ═══════════════════════════════
`tools/` read "everything CI runs, that can refuse" while nothing was published.
Something is published now, so the fence widens by exactly one kind: a publisher
that REFUSES BEFORE IT WRITES. That qualifier is the whole of the rule — the
script this replaces (`publish-prototype.sh`) checked nothing and rotted pointing
at a frozen file. Every refusal below is a thing that has to be true before a
stranger can open the result.

═══ WHAT GOES UP, AND WHY EACH PIECE ══════════════════════════════════════════
  app/      the product
  demo/     the fake engine — the seam has to survive, because a corpus that
            fails to load must fall back rather than show a dead page
  brand/    fonts and the two Innovue marks the attribution line renders
  corpus/   engine.mjs · data.mjs · figures/ · thumbs/ AND NOTHING ELSE

WHAT STAYS LOCAL IS NAMED RATHER THAN FILTERED. corpus/raw/ (58M of scraped
HTML) and corpus/patents/ (19M of intermediate JSON) are build inputs the app
never loads. corpus/FINDINGS.md is an internal test report. corpus/build.py and
corpus/fetch.py are scrapers. None of them is product, and a publisher that
copied a directory wholesale would have shipped all five.

═══ THE PATHS ARE ROOT-RELATIVE AND THAT IS LOAD-BEARING ══════════════════════
corpus/engine.mjs builds figure srcs as '../corpus/<path>'. Those resolve
against the DOCUMENT, which is /app/index.html, so they land at /corpus/<path>.
The published tree therefore has to keep app/ and corpus/ as siblings at the
root. Flattening app/ to the root would break every drawing on the site.
"""
import subprocess as sp
import shutil
import sys
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BRANCH = 'gh-pages'

# Whole directories that go up as they are.
TREES = ['app', 'demo', 'brand']

# corpus/ is named file by file, because it is the one directory where what
# stays back is larger than what goes.
CORPUS_FILES = ['engine.mjs', 'data.mjs']
CORPUS_TREES = ['figures', 'thumbs']

FAIL = []


def refuse(msg):
    FAIL.append(msg)


def run(*args, **kw):
    return sp.run(args, cwd=kw.pop('cwd', ROOT), capture_output=True, text=True, **kw)


def checks():
    """Everything that must be true before a stranger can open this."""

    # 1 · THE GATES. Publishing a tree CI would reject is publishing a tree
    #     nobody has checked.
    for cmd in (['python3', 'tools/check-app.py'],
                ['python3', 'tools/sync-tokens.py', '--check']):
        if run(*cmd).returncode != 0:
            refuse(f"{' '.join(cmd)} fails — fix the tree before publishing it")

    # 2 · A CLEAN TREE, so the published bytes match a commit somebody can read.
    #     A site built from uncommitted edits is a site nothing in the history
    #     explains.
    if run('git', 'status', '--porcelain').stdout.strip():
        refuse('working tree is dirty — commit first, so the site matches a commit')

    # 3 · THE CORPUS IS PRESENT AND IS THE RUNTIME SET.
    for f in CORPUS_FILES:
        if not (ROOT / 'corpus' / f).is_file():
            refuse(f'corpus/{f} is missing — the site would fall back to demo/')
    for d in CORPUS_TREES:
        if not (ROOT / 'corpus' / d).is_dir():
            refuse(f'corpus/{d}/ is missing — drawings would 404')

    # 4 · NOTHING LOCAL-ONLY RIDES ALONG. These are named because a directory
    #     copy is how each of them would have travelled.
    for never in ('raw', 'patents', 'FINDINGS.md', 'build.py', 'fetch.py', 'index.json'):
        if never in CORPUS_FILES or never in CORPUS_TREES:
            refuse(f'corpus/{never} is in the publish set and must not be')

    # 5 · NO CAPTURE OF A THIRD PARTY'S PRODUCT. visual-reference/ renders a
    #     vendor's interface as pixels and is local by decision; it is not in
    #     TREES, and this asserts that rather than trusting it.
    for tree in TREES:
        if tree in ('visual-reference', 'corpus'):
            refuse(f'{tree} must not be published wholesale')


def stage(dest: Path):
    for tree in TREES:
        shutil.copytree(ROOT / tree, dest / tree, dirs_exist_ok=True)

    corpus = dest / 'corpus'
    corpus.mkdir(parents=True, exist_ok=True)
    for f in CORPUS_FILES:
        shutil.copy2(ROOT / 'corpus' / f, corpus / f)
    for d in CORPUS_TREES:
        shutil.copytree(ROOT / 'corpus' / d, corpus / d, dirs_exist_ok=True)

    # .nojekyll — Pages otherwise runs Jekyll, which SKIPS any directory whose
    # name begins with an underscore and adds a build step to a site that has
    # none. Nothing here is named that way today; the file is here so that the
    # day something is, it does not vanish silently.
    (dest / '.nojekyll').write_text('')

    # THE ROOT IS A REDIRECT, NOT A COPY OF THE APP. app/ has to stay a
    # directory because corpus/ is its sibling in every figure src; so the root
    # sends the visitor one level down rather than duplicating index.html with
    # different relative paths.
    (dest / 'index.html').write_text(
        '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="robots" content="noindex, nofollow">\n'
        '<meta http-equiv="refresh" content="0; url=./app/">\n'
        '<title>TIS Terrain</title>\n'
        '<link rel="canonical" href="./app/">\n'
        '</head>\n<body>\n'
        '<p><a href="./app/">TIS Terrain</a></p>\n'
        '</body>\n</html>\n')

    # NOINDEX FOR THE WHOLE SITE. This is a pre-release product shown to a
    # named few, not a launch. robots.txt is at the root rather than a meta tag
    # in app/index.html because the product should not carry a fact about where
    # one copy of it happens to be hosted.
    (dest / 'robots.txt').write_text('User-agent: *\nDisallow: /\n')


def main():
    checks()
    if FAIL:
        print('refusing to publish:', file=sys.stderr)
        for f in FAIL:
            print(f'  · {f}', file=sys.stderr)
        return 1

    sha = run('git', 'rev-parse', '--short', 'HEAD').stdout.strip()
    work = ROOT / '.gh-pages-worktree'

    if work.exists():
        run('git', 'worktree', 'remove', '--force', str(work))
        shutil.rmtree(work, ignore_errors=True)

    r = run('git', 'worktree', 'add', '--force', str(work), BRANCH)
    if r.returncode != 0:
        print(r.stderr, file=sys.stderr)
        return 1

    try:
        # Empty the branch, then restage. A publish that only adds files leaves
        # whatever the last one wrote, and a deleted page keeps serving.
        for child in work.iterdir():
            if child.name == '.git':
                continue
            shutil.rmtree(child) if child.is_dir() else child.unlink()

        stage(work)

        # -f BECAUSE THE RASTER RULE REFUSES corpus/**.png ON main AND STILL
        # SHOULD. The rule exists to stop a stray capture being staged by
        # `git add -A`; here every path is named by this file and checked above,
        # which is the deliberate, one-line-each act the rule asks for.
        run('git', 'add', '-f', '-A', cwd=work)
        if not run('git', 'status', '--porcelain', cwd=work).stdout.strip():
            print('gh-pages already matches this tree — nothing to publish')
            return 0

        r = run('git', 'commit', '-q', '-m', f'Publish the app at {sha}', cwd=work)
        if r.returncode != 0:
            print(r.stdout + r.stderr, file=sys.stderr)
            return 1
        r = run('git', 'push', 'origin', BRANCH, cwd=work)
        if r.returncode != 0:
            print(r.stdout + r.stderr, file=sys.stderr)
            return 1
        print(f'published {sha} to {BRANCH}')
    finally:
        run('git', 'worktree', 'remove', '--force', str(work))
        shutil.rmtree(work, ignore_errors=True)

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
