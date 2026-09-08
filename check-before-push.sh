#!/bin/sh
# Three things that must be true before this repository is pushed anywhere public.
# Each check prints the offending files and nothing otherwise. Exit 1 if any fires.
#
# This script excludes ITSELF from every scan: it necessarily contains the very
# patterns it looks for, and a check that always matches is a check nobody reads.
set -u
cd "$(dirname "$0")" || exit 1
self='check-before-push.sh'
fail=0

say() { printf '\n%s\n' "$1"; }

# Assembled rather than written out, so this file does not match its own grep.
names="Tektro""nix|Ni""ke|Qualc""omm|ENAN""TA|MONOLIT""HIC|緯""穎|富蘭""登|Macrob""lock|4,50[0-9]|4,49[0-9]"
blob="data:image/png;""base64"

say "1 · local-only material must not be tracked"
if git ls-files | grep -Ei 'iptech-screenshots|comparison-assets|visual_inspo|logos/innovue|iptech-terrain-comparison|iptech-feature-request'; then
  fail=1; else echo "  ok"; fi

say "2 · no client or patent data in tracked files"
hits=$(git ls-files | grep -v "^$self$" | tr '\n' '\0' | xargs -0 grep -lEi "$names" 2>/dev/null)
if [ -n "$hits" ]; then echo "$hits"; fail=1; else echo "  ok"; fi

say "3 · no tracked file embeds a screenshot"
hits=$(git ls-files | grep -v "^$self$" | tr '\n' '\0' | xargs -0 grep -l "$blob" 2>/dev/null)
if [ -n "$hits" ]; then echo "$hits"; fail=1; else echo "  ok"; fi

say "4 · the two hosted pages are self-contained"
for f in deliverables/terrain-the-case.html design/previews/terrain-prototype.html index.html; do
  ext=$(grep -oE '(src|href)="[^"]*"' "$f" | grep -v 'data:' | grep -vE 'href="#' | grep -vE 'href="(brand|deliverables|design)/' )
  if [ -n "$ext" ]; then echo "  $f references: $ext"; fail=1; fi
done
[ "$fail" = "0" ] && echo "  ok"

if [ "$fail" = "0" ]; then say "All checks passed."; else say "FAILED — do not push."; fi
exit $fail
