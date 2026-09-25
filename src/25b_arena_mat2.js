/* ===================== ARENA: MATEMÁTICA, PARTE 2 =====================
   Mesma ideia da Física: dois jogos que treinam reconhecer qual ferramenta usar,
   sem pedir nenhuma conta, e discriminar pares de problemas que parecem gêmeos
   mas pedem fórmulas diferentes. Ver a nota no topo de 26b_arena_fis2.js. */
const MAT_RADAR=[
[['Você quer descobrir o valor de x numa equação com uma incógnita.','Álgebra (equações)'],
 ['Você quer calcular a área de um terreno retangular.','Geometria plana'],
 ['Você quer saber a média das notas de uma turma.','Estatística'],
 ['Você quer saber a chance de tirar um número par jogando um dado.','Probabilidade'],
 ['Você quer saber quantos metros de cerca fecham um terreno retangular.','Geometria plana (perímetro)'],
 ['Você quer o próximo termo de uma sequência que sempre soma o mesmo valor ao anterior.','Progressões (PA)'],
 ['Você quer resolver um sistema com duas equações e duas incógnitas.','Álgebra (equações)'],
 ['Você quer saber de quantas formas 3 pessoas podem sentar em 3 cadeiras.','Contagem (permutação)']],
[['Se 4 pedreiros constroem um muro em 10 dias, em quantos dias 8 pedreiros constroem o mesmo muro?','Regra de três (inversa)'],
 ['Se 3 kg de um produto custam R$ 30, quanto custam 5 kg do mesmo produto?','Regra de três (direta)'],
 ['Um produto que custava R$ 200 teve desconto de 15%; você quer o preço final.','Porcentagem'],
 ['Você aplicou um valor a juros simples e quer o total depois de alguns meses.','Juros simples'],
 ['Você aplicou o mesmo valor a juros compostos e quer o total depois do mesmo tempo.','Juros compostos'],
 ['Uma receita rende 4 porções com certos ingredientes; você quer os ingredientes para 10 porções.','Regra de três (direta)'],
 ['Quanto mais torneiras iguais abertas ao mesmo tempo, menos tempo para encher um tanque: você quer esse tempo.','Regra de três (inversa)']],
[['Uma sequência começa em 3 e cada termo soma sempre 5 ao anterior.','Progressão aritmética (PA)'],
 ['Uma sequência começa em 3 e cada termo é sempre o dobro do anterior.','Progressão geométrica (PG)'],
 ['Você quer de quantas formas pode escolher uma comissão de 3 pessoas entre 8, sem se importar com a ordem.','Combinação'],
 ['Você quer de quantas formas pode formar um pódio (1º, 2º, 3º) com 8 atletas.','Arranjo (a ordem importa)'],
 ['Você quer a chance de dois eventos acontecerem juntos, sendo eles independentes.','Probabilidade (eventos independentes)'],
 ['Você tem uma lista de valores e quer o que aparece com mais frequência.','Estatística (moda)'],
 ['Você tem uma lista de valores e quer o valor "do meio", depois de ordenar todos.','Estatística (mediana)']],
[['O valor de uma corrida de táxi cresce sempre na mesma proporção por quilômetro rodado.','Função afim (linear)'],
 ['A altura de uma bola lançada para cima cresce e depois decresce, formando uma curva.','Função quadrática'],
 ['Você quer a distância em linha reta entre dois pontos no plano cartesiano.','Geometria analítica (distância entre pontos)'],
 ['Você quer o ponto exatamente no meio de um segmento entre dois pontos.','Geometria analítica (ponto médio)'],
 ['Você quer saber quantos litros de água cabem numa caixa d’água em formato de cilindro.','Geometria espacial (volume)'],
 ['Você quer saber quanto material reveste todas as faces de uma caixa de sapato.','Geometria espacial (área de superfície)'],
 ['Você quer os valores de x que zeram uma equação do 2º grau.','Função quadrática (raízes)']],
[['Você quer a chance de tirar uma carta de copas, sabendo que já saiu uma carta vermelha.','Probabilidade condicional'],
 ['Você quer a chance de dois dados, jogados juntos, darem soma 7.','Probabilidade (eventos independentes)'],
 ['Uma quantia cresce sempre multiplicada pelo mesmo fator a cada período, como juros compostos.','Progressão geométrica (PG)'],
 ['Você quer resolver um sistema com três equações usando uma tabela de números em linhas e colunas.','Matrizes'],
 ['Você quer a razão entre dois lados de um triângulo retângulo, conhecendo um ângulo.','Trigonometria'],
 ['Você quer a taxa de variação instantânea de uma função num ponto exato.','Derivadas'],
 ['Você quer saber para qual valor uma função se aproxima quando x cresce sem parar.','Limites']]
];
const MAT_RADAR_D=['Áreas bem diferentes: álgebra, geometria, estatística ou probabilidade?','Proporção: regra de três direta ou inversa, porcentagem ou juros?','PA × PG, permutação × combinação, média × mediana × moda.','Função afim × quadrática, e as três de geometria analítica/espacial.','As mais sutis: condicional × independente, PG × exponencial, limite × derivada.'];
arGame({id:'ar-mat-radar',s:'mat',t:'mat-radar',nome:'Raio-X do problema',ic:'?',desc:'Sem fazer nenhuma conta: qual ferramenta resolve essa situação? O passo que trava mais gente na prova, treinado sozinho.',
 lv:MAT_RADAR.map((bank,i)=>({d:MAT_RADAR_D[i],g:[cq(bank,'Qual ferramenta resolve essa situação?')]}))});

const twinM=(a,b,q,right,x)=>()=>arCh('A: '+a+'\nB: '+b+'\n'+q,right,['Só em A','Só em B','Nas duas','Em nenhuma das duas'].filter(o=>o!==right),{x});
const MAT_GEMEO=[
[twinM('3 pedreiros fazem um muro em 12 dias.','3 máquinas produzem 90 peças em 2 horas.','Em qual delas aumentar o número de "trabalhadores" diminui o tempo (regra de três inversa)?','Só em A','Em A, mais pedreiro termina mais rápido: inversa. Em B, mais máquina no mesmo tempo produz mais peças: direta, o tempo nem muda.'),
 twinM('Uma sequência: 2, 5, 8, 11, ...','Uma sequência: 2, 6, 18, 54, ...','Em qual delas a diferença entre termos vizinhos é sempre a mesma?','Só em A','Em A soma-se sempre 3 (PA). Em B multiplica-se sempre por 3 (PG).'),
 twinM('Comissão de 3 pessoas escolhida entre 6, sem função definida para cada uma.','Escolha de presidente, vice e secretário entre 6 pessoas.','Em qual delas a ordem da escolha importa?','Só em B','Em A o grupo é o mesmo não importa a ordem (combinação). Em B cada cargo é diferente: ordem importa (arranjo).'),
 twinM('Você quer somar os termos de 1 a 10 de uma sequência que cresce sempre a mesma quantidade.','Você quer somar os termos de 1 a 10 de uma sequência que sempre dobra.','Em qual delas a soma cresce muito mais rápido conforme aumentam os termos?','Só em B','Uma PG que dobra cresce exponencialmente; uma PA que soma sempre o mesmo valor cresce de forma bem mais lenta (linear).'),
 twinM('Você quer saber quantos números pares existem de 1 a 100.','Você quer saber a chance de um número sorteado de 1 a 100 ser par.','Em qual delas o resultado é uma fração entre 0 e 1?','Só em B','A é uma contagem simples (um número inteiro); B é uma probabilidade, sempre entre 0 e 1.')],
[twinM('R$1.000 aplicados a 5% ao mês, por 3 meses, com juros simples.','R$1.000 aplicados a 5% ao mês, por 3 meses, com juros compostos.','Em qual delas o rendimento de cada mês incide sempre sobre o valor original?','Só em A','Juros simples sempre incide sobre o capital inicial; juros compostos incide também sobre o que já rendeu.'),
 twinM('Uma função y = 3x + 2.','Uma função y = x² + 2.','Em qual delas dobrar o valor de x sempre dobra exatamente o crescimento de y?','Só em A','Função afim cresce sempre na mesma proporção; a quadrática cresce cada vez mais rápido.'),
 twinM('Área de um retângulo de 8 m por 5 m.','Perímetro do mesmo retângulo.','Em qual delas o cálculo é multiplicar os lados?','Só em A','Área multiplica base por altura; perímetro soma todos os lados.'),
 twinM('Um carro percorre distâncias iguais a cada hora (velocidade constante).','Uma bactéria dobra de quantidade a cada hora.','Em qual delas o crescimento pode ser descrito por uma função afim (reta)?','Só em A','Distância constante por tempo é proporção direta simples (reta). Dobrar sempre é crescimento exponencial (PG), não é reta.'),
 twinM('Uma loja dá 20% de desconto sobre o preço original de um produto.','Uma loja aumenta o preço em 20% e depois dá 20% de desconto sobre o novo preço.','Em qual delas o preço final volta a ser igual ao original?','Em nenhuma das duas','Em B, aumentar 20% e depois descontar 20% não volta ao valor original, porque o desconto incide sobre um valor já maior — um erro clássico de porcentagem.')],
[twinM('Sorteio de uma bola numa urna com 5 vermelhas e 5 azuis: qual a chance de ser vermelha?','Sorteio de duas bolas seguidas, sem repor a primeira: qual a chance da segunda ser vermelha, sabendo que a primeira foi vermelha?','Em qual delas o resultado do primeiro sorteio muda a chance do segundo?','Só em B','Em B é probabilidade condicional (sem reposição): a primeira retirada muda o total de bolas restantes.'),
 twinM('Volume de uma caixa (paralelepípedo) de 2 m × 3 m × 4 m.','Área total das faces da mesma caixa.','Em qual delas o resultado mede o que cabe dentro da caixa?','Só em A','Volume mede a capacidade (o que cabe dentro); área de superfície mede quanto material cobre as faces por fora.'),
 twinM('Um triângulo retângulo, ângulo de 30°, hipotenusa conhecida: você quer um cateto.','Um triângulo qualquer, sem ângulo reto, dois lados e o ângulo entre eles conhecidos: você quer o terceiro lado.','Em qual delas dá para usar seno e cosseno direto, sem lei dos cossenos?','Só em A','Só o triângulo retângulo permite seno/cosseno direto; o outro caso pede a lei dos cossenos.'),
 twinM('Você quer saber quantos anagramas diferentes tem a palavra "AMOR" (4 letras diferentes).','Você quer saber quantos anagramas diferentes tem a palavra "ANA" (com letras repetidas).','Em qual delas você precisa dividir pela repetição de letras na fórmula?','Só em B','Com letras repetidas, a permutação simples conta anagramas iguais mais de uma vez — por isso se divide pelo fatorial das repetições.'),
 twinM('Você quer a média de um conjunto de notas, todas com o mesmo peso.','Você quer a média de um conjunto de notas em que a prova final vale o dobro das outras.','Em qual delas você usa média ponderada?','Só em B','Pesos diferentes por item pedem média ponderada; pesos iguais é a média aritmética simples.')],
[twinM('Uma matriz 2×2 representando um sistema de duas equações.','Uma tabela com as notas de 5 alunos em 3 provas.','Nas duas os números estão organizados em linhas e colunas?','Nas duas','Matriz é, literalmente, uma tabela de números — qualquer tabela organizada assim vira uma matriz.'),
 twinM('A altura de uma bola lançada para cima, com o tempo, forma uma parábola.','O preço de uma corrida de aplicativo cresce direto proporcional aos quilômetros rodados.','Em qual delas o gráfico é uma reta?','Só em B','Função afim (preço por km) é sempre reta; função quadrática (altura no tempo) é sempre parábola.'),
 twinM('Você quer saber para que valor uma função se aproxima quando x fica gigante.','Você quer a inclinação exata da curva de uma função num ponto específico.','Em qual delas você usa derivada?','Só em B','Aproximar-se de um valor é limite; a inclinação exata num ponto é derivada.'),
 twinM('Você quer a distância percorrida por um carro que anda a 80 km/h por 3 horas.','Você quer a área sob o gráfico de velocidade × tempo de um carro que acelera.','Nas duas o resultado representa a mesma grandeza física (uma distância)?','Nas duas','Em qualquer gráfico v×t, a área sob a curva é sempre a distância percorrida — com velocidade constante (retângulo) ou variável (outra forma).'),
 twinM('Você quer resolver a equação x² − 5x + 6 = 0.','Você quer encontrar onde a parábola y = x² − 5x + 6 cruza o eixo x.','As duas perguntas têm exatamente a mesma resposta?','Nas duas','As raízes da equação são, por definição, os pontos onde a parábola da função cruza o eixo x — a mesma conta vista de dois jeitos.')],
[twinM('Uma população de bactérias dobra a cada hora.','Uma conta de água aumenta sempre no mesmo valor fixo todo mês.','Em qual delas o crescimento é uma progressão geométrica?','Só em A','Dobrar sempre é multiplicar pelo mesmo fator: PG. Aumentar sempre o mesmo valor fixo é PA.'),
 twinM('Jogar uma moeda e um dado ao mesmo tempo: qual a chance de dar cara e o número 6?','Tirar duas cartas de um baralho, uma após a outra, sem devolver a primeira.','Em qual delas os eventos são independentes?','Só em A','Moeda e dado não têm nenhuma relação entre si. Cartas sem reposição mudam as chances uma da outra.'),
 twinM('log₂(8) = 3.','2³ = 8.','As duas expressam a mesma relação entre os números 2, 3 e 8, só de jeitos diferentes?','Nas duas','Logaritmo e potência são operações inversas: contam a mesma história por lados opostos.'),
 twinM('Você quer saber quantas comissões de 2 pessoas dá pra formar com 4 amigos.','Você quer saber de quantas formas 2 prêmios diferentes (ouro e prata) podem ser dados a 4 amigos.','Em qual delas a diferença entre os cargos/prêmios importa?','Só em B','Comissão sem função definida é combinação; prêmios diferentes (ouro ≠ prata) tornam a ordem importante — é arranjo.'),
 twinM('Você quer o determinante de uma matriz 2×2 para saber se um sistema linear tem solução única.','Você quer somar duas matrizes 2×2, elemento por elemento.','Em qual delas o resultado final é um único número?','Só em A','O determinante é sempre um número; a soma de matrizes ainda é uma matriz.')]
];
const MAT_GEMEO_D=['Regra de três, PA×PG e arranjo×combinação: o par mais direto.','Juros, função e área×perímetro: o que muda de fato entre os dois.','Probabilidade condicional, volume×área e trigonometria.','Matriz, função afim×quadrática e limite×derivada.','As mais avançadas: PG×PA, eventos independentes e log×potência.'];
arGame({id:'ar-mat-gemeo',s:'mat',t:'mat-gemeo',nome:'Pegadinha gêmea',ic:'A≟B',desc:'Duas situações quase idênticas na casca: só uma (ou nenhuma, ou as duas) aceita a mesma fórmula. Treina exatamente a discriminação que falha na prova.',
 lv:MAT_GEMEO.map((g,i)=>({d:MAT_GEMEO_D[i],g}))});
