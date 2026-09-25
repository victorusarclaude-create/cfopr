#!/bin/sh
# Roda todos os testes contra o "Plano Cadete CBMPR.html" gerado pelo build.sh.
set -e
cd "$(dirname "$0")"
for t in e2e_fluxos.js sincronizacao.js modos_e_desempenho.js atualizacao_do_app_antigo.js arena_fuzz.js arena_e2e.js arena_new_e2e.js jornada_e2e.js painel_e2e.js qui_tabela_theme_e2e.js; do
  echo "== $t"; node "$t"
done
