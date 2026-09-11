#!/usr/bin/env bash
# Proves every gate in check-publish.py actually fires.
#
# This exists because the first version of these checks was shell, and three of
# them silently did not run -- grep -P is absent on macOS, node --check never
# fired, and a subshell exit could not stop the publish. All three REPORTED
# CLEAN. The only way to trust a check is to watch it fail on purpose.
set -uo pipefail
cd "$(dirname "$0")/.."
CHECK=tools/check-publish.py
SRC=${1:-}
[ -n "$SRC" ] && [ -d "$SRC" ] || { echo "usage: $0 <path-to-clean-build>"; exit 2; }

pass=0; fail=0
run() { # run <name> <expected-substring> <setup-fn>
  local name=$1 want=$2 fn=$3
  local d; d=$(mktemp -d); cp -R "$SRC"/. "$d"/
  $fn "$d"
  local out; out=$(python3 "$CHECK" "$d" 2>&1); local rc=$?
  rm -rf "$d"
  if [ $rc -ne 0 ] && grep -qi -- "$want" <<<"$out"; then
    printf '  PASS  %-34s (refused: %s)\n' "$name" "$want"; pass=$((pass+1))
  else
    printf '  FAIL  %-34s (rc=%s, wanted %q)\n' "$name" "$rc" "$want"
    sed 's/^/          /' <<<"$out" | head -4; fail=$((fail+1))
  fi
}

p_raster()   { : > "$1/screenshot.png"; }
p_local()    { : > "$1/visual-reference-note.txt"; }
p_client()   { printf 'filed by Qualcomm\n' > "$1/leak.txt"; }
p_b64()      { printf 'x data:image/png;base64,AAAA\n' > "$1/embed.txt"; }
p_cjk()      { printf '<p>技術功效</p>\n' >> "$1/index.html"; }
p_comment()  { printf '<!-- design note: cut in §6.1 -->\n' >> "$1/index.html"; }
p_blockcmt() { printf '<style>/* internal note */</style>\n' >> "$1/index.html"; }
p_dangling() { printf '<img src="brand/missing-asset.svg">\n' >> "$1/index.html"; }
p_badjs()    { printf '<script>function (</script>\n' >> "$1/index.html"; }
p_nolicence(){ rm -f "$1/brand/fonts/OFL-Urbanist.txt"; }
p_nometa()   { sed -i.bak 's|<meta property="og:title"[^>]*>||' "$1/index.html"; rm -f "$1/index.html.bak"; }
p_indexable(){ sed -i.bak 's|noindex, nofollow|all|' "$1/index.html"; rm -f "$1/index.html.bak"; }

echo "planting violations against a clean build:"
run "raster image"          "raster image"        p_raster
run "local-only material"   "local-only"          p_local
run "client data"           "client data"         p_client
run "base64 image"          "base64"              p_b64
run "CJK in the surface"    "CJK"                 p_cjk
run "HTML comment survived" "HTML comment"        p_comment
run "block comment survived" "block comment"      p_blockcmt
run "dangling reference"    "dangling"            p_dangling
run "broken JavaScript"     "does not parse"      p_badjs
run "OFL licence removed"   "OFL 1.1"             p_nolicence
run "link preview tag removed" "meta tag missing"  p_nometa
run "noindex removed"       "searchable"          p_indexable

echo "and the clean build itself:"
if out=$(python3 "$CHECK" "$SRC" 2>&1); then
  printf '  PASS  %-34s (%s)\n' "clean build accepted" "$(tr -d '\n' <<<"$out" | xargs)"; pass=$((pass+1))
else
  printf '  FAIL  %-34s\n' "clean build REJECTED"; sed 's/^/          /' <<<"$out"; fail=$((fail+1))
fi

echo
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
