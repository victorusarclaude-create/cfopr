# Plano Cadete CBMPR

App de estudos para a prova de Cadete do Corpo de Bombeiros Militar do Paraná (CFO). Roda como artifact no Claude, com sincronização na conta e o Claude como tutor dentro do app.

O produto é um arquivo só: **`Plano Cadete CBMPR.html`**. Ele é gerado a partir de `src/`.

## Estrutura

| Arquivo | O que tem |
| --- | --- |
| `src/00_page.html` | Título, estilos (tema claro e escuro) e a estrutura da página |
| `src/10_dados.js` | Edital, fontes oficiais, bancos de jogos, geradores de cálculo, Teste 80/20 |
| `src/20_resumos.js` | Resumos essenciais de todos os tópicos |
| `src/21_flashcards.js` | Baralhos dos tópicos de Direito, Bombeiro, Inglês e Geografia |
| `src/22_teste80.js` | Teste 80/20 de Primeiros Socorros, Combate a Incêndio e Direito |
| `src/30_nucleo.js` | Estado, migração de versões antigas, domínio, XP, nível, sequência |
| `src/31_missoes_sync.js` | Missões do dia, conquistas e sincronização na conta (com mesclagem) |
| `src/32_som_efeitos.js` | Sons, vibração, confete e celebrações |
| `src/33_ia.js` | Tudo que usa o Claude: questões, simulado, Instrutor, aulas, correção de redação |
| `src/34_tela_hoje.js` | Tela Hoje e cronômetro de foco |
| `src/35_tela_treino.js` | Jogos, Relâmpago, Chefão, flashcards, simulado, Teste 80/20 |
| `src/36_telas_painel_erros_redacao.js` | Painel, Caderno de erros, Redação e folhas |
| `src/37_acoes_inicio.js` | Ações dos botões, teclado, renderização e inicialização |

## Gerar o arquivo

```sh
./build.sh
```

Para publicar no Claude, o artifact precisa das capacidades `db`, `user` e `sample` (e `downloads`, para o backup em arquivo).

## Testes

Os testes abrem o app num Chromium sem interface, com um Claude simulado, e passam por todos os fluxos: jogos, flashcards, simulado, IA, sincronização entre aparelhos e atualização a partir da versão antiga.

```sh
npm i -g playwright   # uma vez
sh tests/run_all.sh
```
