#!/bin/sh
# Monta o app num único arquivo HTML a partir de src/.
# Uso: ./build.sh   (gera "Plano Cadete CBMPR.html")
set -e
cd "$(dirname "$0")"
OUT="Plano Cadete CBMPR.html"
{
  cat src/00_page.html
  echo '<script>'
  echo '(function(){'
  echo "'use strict';"
  for f in src/[1-9]*.js; do cat "$f"; done
  echo '})();'
  echo '</script>'
} > "$OUT"
if command -v node >/dev/null 2>&1; then
  sed -n '/^<script>$/,/^<\/script>$/p' "$OUT" | sed '1d;$d' > .build-check.js
  node --check .build-check.js && rm -f .build-check.js && echo "OK: $OUT ($(wc -c < "$OUT") bytes)"
fi
