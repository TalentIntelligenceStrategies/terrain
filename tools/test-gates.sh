#!/usr/bin/env bash
# Proves every gate actually fires -- check-app.py and sync-tokens.py over the
# SOURCE tree, each watched refusing a violation planted on purpose.
#
# ONE SCRIPT, and not one per checker. The whole argument of this file is that
# every gate is in one place, each watched failing; a second script is the
# first step to a gate nobody runs.
#
# This exists because the first version of these checks was shell, and three of
# them silently did not run -- grep -P is absent on macOS, node --check never
# fired, and a subshell exit could not stop the publish. All three REPORTED
# CLEAN. The only way to trust a check is to watch it fail on purpose.
#
# IT TAKES NO ARGUMENT NOW. It used to want a path to a clean BUILD, because
# half of it planted violations into the generated gh-pages tree. Terrain
# publishes nothing, so check-publish.py, publish-prototype.sh and the fifteen
# plants that fed them are gone, along with the eight arithmetic plants that
# read the frozen prototype's landscape figures. What remains gates the source,
# which is the tree anybody now changes.
set -uo pipefail
cd "$(dirname "$0")/.."

pass=0; fail=0

# ══════════════════════════════════════════════════════════════════════════
# The SOURCE tree. check-app.py and sync-tokens.py.
# ══════════════════════════════════════════════════════════════════════════

# A source mirror: everything the two source checkers read, and nothing else.
mirror() {
  local d=$1
  mkdir -p "$d"
  cp -R tools "$d"/
  [ -d app ]  && cp -R app  "$d"/
  [ -d demo ] && cp -R demo "$d"/
  mkdir -p "$d/design/previews" "$d/docs"
  cp design/previews/terrain-loading-lab.html "$d/design/previews/" 2>/dev/null
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
# THE VIOLATION GOES WHERE THE GATE LOOKS, which is sync-tokens.py's TARGETS
# and nothing else. These three planted into the PROTOTYPE, which stopped being
# a target when the analysis layer left — so for two commits they planted a
# violation in a file the gate does not read, and reported FAIL on a gate that
# was working perfectly. A test that fails for the wrong reason costs the same
# attention as one that passes for the wrong reason and buys less.
s_value()    { sed -i.bak 's|--border:#2E2E2E|--border:#2E2E2F|' "$1/design/previews/terrain-loading-lab.html"; rm -f "$1"/design/previews/*.bak; }
s_comment()  { sed -i.bak 's|even in L\*|even in L star|' "$1/design/previews/terrain-loading-lab.html"; rm -f "$1"/design/previews/*.bak; }
s_sentinel() { sed -i.bak 's|/\* ══ end tokens ══ \*/||' "$1/design/previews/terrain-loading-lab.html"; rm -f "$1"/design/previews/*.bak; }

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
# ── G · a printed token count that disagrees with tokens.css ──
# The one gate here whose subject is a DOCUMENT rather than code. It exists
# because the sentence it replaced asked three files to stay equal by memory
# and they did not.
g_count() { sed -i.bak 's|\*\*31 semantic tokens\*\*|**30 semantic tokens**|' "$1/docs/design-language.md"; rm -f "$1"/docs/*.bak; }
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
runsrc "G · printed token count drifts" "holds 31"       "tools/check-app.py"           g_count

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
