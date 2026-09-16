#!/usr/bin/env bash
# Proves every gate actually fires -- check-publish.py on the GENERATED tree,
# and check-app.py plus sync-tokens.py on the SOURCE tree.
#
# ONE SCRIPT, TWO SECTIONS, and not two scripts. The whole argument of this
# file is that every gate is in one place, each watched failing; a second
# script is the first step to a gate nobody runs.
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
# the one that shipped: a stray `}` eats the rule after it, silently
p_straybrace(){ printf '<style>}\n.probe{position:relative}</style>\n' >> "$1/index.html"; }
p_unclosed()  { printf '<style>.probe{position:relative</style>\n' >> "$1/index.html"; }
# on a touch screen this sticks after a tap and nothing on a desktop shows it
p_ungatedhover(){ printf '<style>.probe:hover{background:var(--surface)}</style>\n' >> "$1/index.html"; }
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
run "stray CSS brace"       "stray"               p_straybrace
run "unclosed CSS block"    "unclosed block"      p_unclosed
run "ungated :hover"        "ungated :hover"      p_ungatedhover
run "OFL licence removed"   "OFL 1.1"             p_nolicence
run "link preview tag removed" "meta tag missing"  p_nometa
run "noindex removed"       "searchable"          p_indexable

echo "and the clean build itself:"
if out=$(python3 "$CHECK" "$SRC" 2>&1); then
  printf '  PASS  %-34s (%s)\n' "clean build accepted" "$(tr -d '\n' <<<"$out" | xargs)"; pass=$((pass+1))
else
  printf '  FAIL  %-34s\n' "clean build REJECTED"; sed 's/^/          /' <<<"$out"; fail=$((fail+1))
fi

# ══════════════════════════════════════════════════════════════════════════
# SECTION 2 · the SOURCE tree. check-app.py and sync-tokens.py.
#
# These cannot live in check-publish.py: that file walks the BUILT tree, where
# every comment is stripped and app/ does not exist. The five publish gates
# that read <style> and <script> blocks go dark the moment CSS and JS leave the
# HTML -- verbatim the failure this script exists to prevent -- so the cover
# has to be rebuilt on this side and watched failing here.
# ══════════════════════════════════════════════════════════════════════════

# A source mirror: everything the two source checkers read, and nothing else.
mirror() {
  local d=$1
  mkdir -p "$d"
  cp -R tools "$d"/
  [ -d app ]  && cp -R app  "$d"/
  [ -d demo ] && cp -R demo "$d"/
  mkdir -p "$d/design/previews" "$d/docs"
  cp design/previews/terrain-prototype.html design/previews/terrain-loading-lab.html "$d/design/previews/" 2>/dev/null
  cp docs/*.md "$d/docs/" 2>/dev/null
  cp design/components.md "$d/design/" 2>/dev/null
}

runsrc() { # runsrc <name> <expected-substring> <checker-args> <setup-fn>
  local name=$1 want=$2 checker=$3 fn=$4
  local d; d=$(mktemp -d); mirror "$d"
  $fn "$d"
  local out; out=$(cd "$d" && python3 $checker 2>&1); local rc=$?
  rm -rf "$d"
  if [ $rc -ne 0 ] && grep -qi -- "$want" <<<"$out"; then
    printf '  PASS  %-34s (refused: %s)\n' "$name" "$want"; pass=$((pass+1))
  else
    printf '  FAIL  %-34s (rc=%s, wanted %q)\n' "$name" "$rc" "$want"
    sed 's/^/          /' <<<"$out" | head -4; fail=$((fail+1))
  fi
}

TOK=app/styles/tokens.css

# ── sync · the region must match tokens.css BYTE for byte ──
s_value()    { sed -i.bak 's|--border:#2E2E2E|--border:#2E2E2F|' "$1/design/previews/terrain-prototype.html"; rm -f "$1"/design/previews/*.bak; }
s_comment()  { sed -i.bak 's|even in L\*|even in L star|' "$1/design/previews/terrain-prototype.html"; rm -f "$1"/design/previews/*.bak; }
s_sentinel() { sed -i.bak 's|/\* ══ end tokens ══ \*/||' "$1/design/previews/terrain-prototype.html"; rm -f "$1"/design/previews/*.bak; }

# ── A · a component reading a primitive, a raw hex, or an inline alpha ──
a_prim()  { printf '.probe{color:var(--n-7)}\n'          > "$1/app/styles/90-probe.css"; }
a_hex()   { printf '.probe{color:#BADA55}\n'             > "$1/app/styles/90-probe.css"; }
a_alpha() { printf '.probe{color:rgba(0,0,0,.4)}\n'      > "$1/app/styles/90-probe.css"; }
# ── B · a var() set by nothing, with no fallback. THE --rest SHAPE ──
b_novar() { printf '.probe{opacity:var(--rest)}\n'       > "$1/app/styles/90-probe.css"; }
# ── C · a custom property on :root outside tokens.css ──
c_root()  { printf ':root{--probe:#fff}\n'               > "$1/app/styles/90-probe.css"; }
# ── D · a token added to light and forgotten in dark ──
d_drift() { python3 - "$1/$TOK" <<'PY'
import io,sys
p=sys.argv[1]; s=io.open(p,encoding='utf-8').read()
s=s.replace('  --text-1:var(--n-10); --text-2:var(--n-8); --text-3:var(--n-7);',
            '  --probe:var(--n-1);\n  --text-1:var(--n-10); --text-2:var(--n-8); --text-3:var(--n-7);',1)
io.open(p,'w',encoding='utf-8').write(s)
PY
}
# ── E · a theme selector reaching into a component ──
e_theme() { printf ':root[data-theme="dark"] .probe{color:var(--text-1)}\n' > "$1/app/styles/90-probe.css"; }
# ── F · a base rule inside a hover gate. THE .pg-back SHAPE ──
f_base()  { printf '@media (hover:hover) and (pointer:fine){\n  .probe{display:inline-flex;height:30px}\n  .probe:hover{color:var(--text-1)}\n}\n' > "$1/app/styles/90-probe.css"; }
# ── a mirror class for a state ARIA already has a word for ──
m_mirror(){ printf '.probe.is-selected{color:var(--text-1)}\n' > "$1/app/styles/90-probe.css"; }
# ── a second demo/ import outside main.mjs ──
x_demo()  { mkdir -p "$1/app/js" "$1/demo"; printf 'export const x=1\n' > "$1/demo/engine.mjs";
            printf "import {x} from '../../demo/engine.mjs'\nexport const y=x\n" > "$1/app/js/probe.mjs"; }

echo
echo "planting violations against the source tree:"
runsrc "token region · value edited"   "byte for byte"   "tools/sync-tokens.py --check" s_value
runsrc "token region · comment edited" "byte for byte"   "tools/sync-tokens.py --check" s_comment
runsrc "token region · sentinel gone"  "sentinel"        "tools/sync-tokens.py --check" s_sentinel
runsrc "A · component reads --n-*"     "primitive"       "tools/check-app.py"           a_prim
runsrc "A · raw hex in a component"    "raw hex"         "tools/check-app.py"           a_hex
runsrc "A · inline alpha"              "inline rgba"     "tools/check-app.py"           a_alpha
runsrc "B · var() set by nothing"      "declared nowhere" "tools/check-app.py"          b_novar
runsrc "C · :root outside tokens.css"  "custom property on" "tools/check-app.py"        c_root
runsrc "D · token added to light only" "stays light"     "tools/check-app.py"           d_drift
runsrc "E · theme selector on a class" "token swap"      "tools/check-app.py"           e_theme
runsrc "F · base rule in a hover gate" "base rule inside" "tools/check-app.py"          f_base
runsrc "mirror class for an ARIA state" "mirrors an ARIA" "tools/check-app.py"          m_mirror
runsrc "a second demo/ import"         "imported exactly once" "tools/check-app.py"     x_demo

echo "and the clean source tree itself:"
for c in "tools/check-app.py" "tools/sync-tokens.py --check"; do
  if out=$(python3 $c 2>&1); then
    printf '  PASS  %-34s (%s)\n' "${c#tools/} accepts it" "$(tr -d '\n' <<<"$out" | xargs | cut -c1-70)"; pass=$((pass+1))
  else
    printf '  FAIL  %-34s\n' "${c#tools/} REJECTS a clean tree"; sed 's/^/          /' <<<"$out" | head -6; fail=$((fail+1))
  fi
done

echo
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
