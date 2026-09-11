#!/usr/bin/env bash
# Regenerate the gh-pages branch from main and publish it.
#
# WHY THIS EXISTS. GitHub Pages serves whatever tree it is pointed at, with no
# per-file access control, so publishing the prototype WITHOUT publishing docs/,
# CLAUDE.md and the other two previews means pointing Pages at a smaller tree.
# gh-pages is that tree. It is GENERATED -- never edit it by hand, and never
# commit anything there that this script does not produce.
#
# WHAT IT PUBLISHES. The prototype as index.html, the eleven assets it actually
# references, and the two OFL licences. The licences are not optional: this
# branch redistributes seven subset woff2 files on a public host, which is
# exactly the case OFL 1.1 covers.
#
# TWO TRANSFORMS, both mechanical:
#   1. ../../brand/ -> brand/   because the prototype moves to the root.
#   2. comments stripped        because half the file by weight was the internal
#                               design record -- dated decisions, section
#                               references into platform.md, and the competitive
#                               read on IPtech's modules. None of it is client
#                               data; all of it is reasoning written for us, and
#                               a link sent outward carries it in view-source.
#                               main keeps every comment.
#
# Needs WRITE access only. Admin is required to change Pages SETTINGS (which
# branch it serves, a custom domain) and that was a one-time step, already done.
set -euo pipefail

# --build-only <dir>  assemble the tree there and stop. Used by CI to build once
#                     and hand the same tree to the gate tests, so there is never
#                     a second definition of what gets published.
BUILD_ONLY=""
if [ "${1:-}" = "--build-only" ]; then
  BUILD_ONLY=${2:-}
  [ -n "$BUILD_ONLY" ] || { echo "--build-only needs a directory"; exit 2; }
fi

cd "$(dirname "$0")/.."
ROOT=$(pwd)
SRC=design/previews/terrain-prototype.html
BUILD=$(mktemp -d)
WT=$(mktemp -d)
# Gates run BEFORE the worktree is created, so the expected failure path leaves
# nothing behind. This trap is for the unexpected one -- a failed push -- where
# removing the directory alone would leave git's worktree registration dangling.
cleanup() { rm -rf "$BUILD" "$WT"; git -C "$ROOT" worktree prune 2>/dev/null || true; }
trap cleanup EXIT

[ -f "$SRC" ] || { echo "missing $SRC"; exit 1; }

echo "==> building from $(git rev-parse --short HEAD) on $(git rev-parse --abbrev-ref HEAD)"
mkdir -p "$BUILD/brand/fonts" "$BUILD/brand/logos/innovue"
sed 's|\.\./\.\./brand/|brand/|g' "$SRC" > "$BUILD/raw.html"
python3 tools/strip-comments.py "$BUILD/raw.html" "$BUILD/index.html"
rm "$BUILD/raw.html"

cp brand/favicon.svg                                        "$BUILD/brand/"
cp brand/fonts/fonts.css brand/fonts/*.woff2 \
   brand/fonts/OFL-Urbanist.txt brand/fonts/OFL-Inconsolata.txt "$BUILD/brand/fonts/"
cp brand/logos/innovue/Innovue_Logo_Blue_eng_inline.svg \
   brand/logos/innovue/Innovue_Logo_Light_eng_inline.svg     "$BUILD/brand/logos/innovue/"

# --- gates. Any failure here stops the publish. ---
#
# These live in check-publish.py, not inline here, because the first version was
# shell and three gates silently did not run: grep -P is absent on macOS, the
# node syntax check never fired, and a subshell exit could not stop the publish.
# All three reported clean. tools/test-gates.sh plants a violation for each one
# and proves it refuses; run it if you touch either file.
if [ -n "$BUILD_ONLY" ]; then
  mkdir -p "$BUILD_ONLY"
  find "$BUILD_ONLY" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  cp -R "$BUILD"/. "$BUILD_ONLY"/
  echo "   built into $BUILD_ONLY (not published)"
  exit 0
fi

echo "==> checking"
python3 tools/check-publish.py "$BUILD"

# --- publish ---
cd "$ROOT"
echo "==> publishing to gh-pages"
# Always base on origin/gh-pages rather than any local branch. A fresh CI
# checkout has no local gh-pages, and a stale local one would commit on top of
# the wrong parent and be rejected at push time -- both silent until they bite.
git fetch -q origin gh-pages 2>/dev/null || true
if git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
  git worktree add -q --detach "$WT" origin/gh-pages
  git -C "$WT" checkout -q -B gh-pages
else
  echo "   origin/gh-pages does not exist yet -- creating it"
  git worktree add -q --detach "$WT" HEAD
  git -C "$WT" checkout -q --orphan gh-pages
  git -C "$WT" rm -rq --cached . 2>/dev/null || true
fi
find "$WT" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R "$BUILD"/. "$WT"/
cd "$WT"
git add -A
if git diff --cached --quiet; then
  echo "   no change -- gh-pages already matches main"
else
  git -c user.name="${GIT_AUTHOR_NAME:-$(git config user.name || echo terrain-publish)}" \
      -c user.email="${GIT_AUTHOR_EMAIL:-$(git config user.email || echo terrain-publish@users.noreply.github.com)}" \
      commit -q -m "Republish the prototype from $(cd "$ROOT" && git rev-parse --short HEAD)"
  git push -q origin gh-pages
  echo "   pushed. live in ~1 min: https://talentintelligencestrategies.github.io/terrain/"
fi
cd "$ROOT"; git worktree remove --force "$WT"
