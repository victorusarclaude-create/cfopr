/* ===================== ARENA: FÍSICA, PARTE 2 =====================
   "Decorei a fórmula mas não sei quando usar" é um problema conhecido: quem está
   aprendendo indexa o problema pela casca (tem plano inclinado → decorei essa conta);
   quem domina indexa pelo princípio por trás (isso é conservação de energia, não importa
   se é bala, pêndulo ou montanha-russa). Os dois jogos abaixo treinam só essa etapa —
   reconhecer a ferramenta certa — sem pedir nenhuma conta, para separar esse músculo do
   de calcular. */
const FIS_RADAR=[
[['Um carro sai do zero e atinge 100 km/h em 10 segundos; você quer a aceleração dele.','Cinemática'],
 ['Duas pessoas empurram uma caixa com forças diferentes; você quer a força resultante.','Dinâmica (leis de Newton)'],
 ['Uma bola cai de um telhado, sem atrito, e você quer a velocidade dela ao chegar ao chão.','Energia (conservação de energia mecânica)'],
 ['Você mistura água quente e água fria e quer a temperatura final da mistura.','Calor e temperatura'],
 ['Você quer saber quanta corrente passa por um chuveiro elétrico ligado numa tomada.','Eletricidade (circuitos)'],
 ['Um trem anda em linha reta a velocidade constante; você quer a posição dele depois de certo tempo.','Cinemática'],
 ['Um bloco é puxado por uma força e você quer com que aceleração ele passa a se mover.','Dinâmica (leis de Newton)'],
 ['Você aquece uma barra de metal e quer saber quanto ela vai se dilatar.','Calor e temperatura']],
[['Um carro freia com aceleração constante até parar; você quer a distância percorrida na freada.','Cinemática (MUV)'],
 ['Uma força constante empurra um bloco com atrito; você quer a aceleração resultante.','Dinâmica (2ª lei de Newton)'],
 ['Um guindaste levanta uma carga a velocidade constante; você quer a potência do motor.','Energia (trabalho e potência)'],
 ['Duas bolinhas de bilhar se chocam; você quer a velocidade de cada uma depois do choque.','Impulso e quantidade de movimento'],
 ['Uma mola é comprimida e depois solta, lançando um objeto; você quer a velocidade de saída.','Energia (conservação, energia elástica)'],
 ['Um foguete de brinquedo expulsa gás para trás; você quer a velocidade de recuo dele.','Impulso e quantidade de movimento'],
 ['Um objeto desliza ladeira abaixo; você quer a aceleração dele no plano inclinado.','Dinâmica (leis de Newton)'],
 ['Um corredor passa de 0 a 8 m/s em 4 segundos; você quer quanto ele acelerou.','Cinemática (MUV)']],
[['Duas viaturas colidem e ficam grudadas; você quer a velocidade final do conjunto.','Impulso e quantidade de movimento'],
 ['Uma bola desce um escorregador sem atrito; você quer a velocidade dela ao chegar embaixo.','Energia (conservação de energia mecânica)'],
 ['Você quer o calor necessário para derreter completamente um bloco de gelo a 0 °C.','Calor latente'],
 ['Você quer o calor necessário para esquentar água de 20 °C até 60 °C, sem mudar de estado.','Calor sensível'],
 ['Um mergulhador desce e você quer a pressão da água sobre ele a certa profundidade.','Pressão hidrostática (Stevin)'],
 ['Um objeto flutua parcialmente submerso na água; você quer a força que a água faz para cima nele.','Empuxo (princípio de Arquimedes)'],
 ['Uma bala atravessa um bloco de madeira e sai com velocidade menor; você quer a velocidade do bloco depois.','Impulso e quantidade de movimento'],
 ['Um pêndulo solto de certa altura oscila sem atrito com o ar; você quer a velocidade dele no ponto mais baixo.','Energia (conservação de energia mecânica)']],
[['Um objeto é solto do repouso e cai, sem nenhum empurrão inicial.','Queda livre'],
 ['Um objeto é empurrado horizontalmente do alto de um prédio e cai fazendo uma curva.','Lançamento horizontal'],
 ['Uma bola é arremessada para cima, na vertical, e depois volta a cair.','Lançamento vertical'],
 ['Um gás é comprimido rapidamente numa bomba de bicicleta, esquentando, sem trocar calor com fora.','Transformação adiabática'],
 ['Um gás num cilindro com êmbolo livre é aquecido lentamente, com a pressão sempre igual à atmosférica.','Transformação isobárica'],
 ['Uma seringa tampada é empurrada bem devagar, em equilíbrio térmico com o ambiente o tempo todo.','Transformação isotérmica'],
 ['Duas bolas de massas iguais colidem de frente e voltam cada uma com a velocidade da outra, trocada.','Colisão elástica'],
 ['Dois carrinhos se chocam de frente e seguem grudados, andando juntos depois.','Colisão perfeitamente inelástica']],
[['Você quer a força elétrica entre duas cargas paradas, separadas por certa distância.','Eletrostática (lei de Coulomb)'],
 ['Você quer saber quanta corrente elétrica passa por um resistor ligado a uma pilha.','Circuitos elétricos'],
 ['Uma barra apoiada num ponto de apoio equilibra dois pesos em lados opostos; você quer a distância certa.','Alavancas (momento de uma força)'],
 ['Uma polia é usada para erguer um peso com menos força; você quer a força necessária.','Máquinas simples (polias)'],
 ['Você quer a força de atração gravitacional entre a Terra e um satélite em órbita.','Gravitação'],
 ['Um motor elétrico converte energia elétrica em movimento; você quer a potência dele em watts.','Potência elétrica'],
 ['Uma pessoa empurra uma carroça e quer saber a potência mecânica que está desenvolvendo.','Potência mecânica (trabalho e potência)'],
 ['Você bate palmas numa sala vazia e ouve o som voltar poucos instantes depois.','Ondas e som (reflexão do som)']]
];
const FIS_RADAR_D=['Áreas bem diferentes: cinemática, força, energia, calor ou eletricidade?','Dentro da mecânica: cinemática, Newton, energia ou impulso?','Cenas parecidas, ferramenta diferente: energia, impulso, calor ou fluidos?','As pegadinhas clássicas: queda × lançamento, e as transformações do gás.','As mais sutis: eletrostática × circuito, alavanca × polia × gravitação.'];
arGame({id:'ar-fis-radar',s:'fis',t:'fis-radar',nome:'Raio-X do problema',ic:'?',desc:'Sem fazer nenhuma conta: qual princípio ou fórmula resolve essa situação? O passo que trava mais gente na prova, treinado sozinho.',
 lv:FIS_RADAR.map((bank,i)=>({d:FIS_RADAR_D[i],g:[cq(bank,'Qual ferramenta resolve essa situação?')]}))});

const twin=(a,b,q,right,x)=>()=>arCh('A: '+a+'\nB: '+b+'\n'+q,right,['Só em A','Só em B','Nas duas','Em nenhuma das duas'].filter(o=>o!==right),{x});
const FIS_GEMEO=[
[twin('Uma bola é largada do repouso e cai.','Uma bola é empurrada para baixo com força extra e cai.','Em qual delas a velocidade após 2 s é só g·t (queda livre pura)?','Só em A','Queda livre exige partir do repouso; em B há uma velocidade inicial somada.'),
 twin('Um carrinho anda a 20 m/s constantes numa pista reta.','Um carrinho ganha 2 m/s a cada segundo na mesma pista.','Em qual delas a aceleração é zero?','Só em A','Velocidade constante é aceleração zero (MU). Ganhar velocidade a cada segundo é MUV.'),
 twin('Um bloco de 2 kg é empurrado por 10 N num chão sem atrito.','O mesmo bloco é empurrado pela mesma força, com 4 N de atrito contra ele.','Em qual delas a aceleração é maior?','Só em A','Sem atrito, toda a força vira aceleração; com atrito, parte da força é gasta vencendo o atrito.'),
 twin('Um objeto se move com velocidade constante numa trajetória reta.','Um objeto se move em círculo com velocidade de módulo constante.','Em qual delas a aceleração é zero?','Só em A','Mesmo com o módulo constante, o movimento circular muda a direção da velocidade o tempo todo — isso já é uma aceleração (centrípeta).'),
 twin('Uma pessoa empurra uma parede com toda a força e a parede não se move.','Uma pessoa empurra uma caixa leve e ela desliza pelo chão.','Em qual delas a força aplicada produz aceleração no objeto empurrado?','Só em B','A parede tem uma reação que anula a força (está apoiada na estrutura); a caixa livre acelera conforme F = m·a.')],
[twin('Uma bola desce um escorregador sem atrito, de altura h.','A mesma bola desce o mesmo escorregador, agora com atrito considerável.','Em qual delas dá para usar conservação de energia mecânica (toda a potencial vira cinética)?','Só em A','Com atrito, parte da energia mecânica vira calor — deixa de se conservar.'),
 twin('Dois carrinhos idênticos se chocam de frente e ficam grudados.','Dois carrinhos idênticos se chocam de frente e cada um volta com a velocidade do outro.','Em qual delas a energia cinética total se conserva (colisão elástica)?','Só em B','Em A os carrinhos grudam: colisão perfeitamente inelástica, com perda de energia cinética.'),
 twin('Um gás se expande num pistão, mantendo a pressão igual à atmosfera lá fora.','O mesmo gás está preso num recipiente de paredes rígidas, sem mudar de volume.','Em qual delas o trabalho realizado pelo gás é zero?','Só em B','Trabalho de um gás é p·ΔV; sem variação de volume (isocórica), o trabalho é sempre zero.'),
 twin('Uma caixa é puxada por uma corda horizontal num chão com atrito.','A mesma caixa é empurrada morro abaixo, sem atrito, só pela gravidade.','Em qual delas existe uma força de atrito atuando contra o movimento?','Só em A','B diz explicitamente "sem atrito": só a gravidade atua.'),
 twin('Uma mola é esticada e solta, empurrando um carrinho.','Um carrinho é empurrado pela mão de alguém, com força constante, por certa distância.','Em qual delas a energia armazenada antes do movimento é do tipo elástica?','Só em A','Só a mola guarda energia potencial elástica; a mão faz trabalho direto, sem estocar energia numa deformação.')],
[twin('Uma bala atinge um bloco de madeira e fica alojada dentro dele.','Uma bola de aço bate numa parede e volta com quase a mesma velocidade.','Em qual delas a quantidade de movimento do sistema se conserva?','Nas duas','Quantidade de movimento se conserva em qualquer colisão de sistema isolado — só a energia cinética é que pode se perder.'),
 twin('Um bloco desliza sobre uma mesa com atrito, freando aos poucos.','Uma bola de bilhar rola numa mesa sem atrito, sem perder velocidade.','Em qual delas a energia mecânica se conserva?','Só em B','O atrito, em A, dissipa energia mecânica em forma de calor.'),
 twin('Um balão é aquecido lentamente ao sol, com a pressão do ar sempre igual à de fora.','Um balão idêntico é comprimido rapidamente na mão, sem tempo de trocar calor com o ambiente.','Em qual delas o calor trocado (Q) é zero?','Só em B','Transformação adiabática é justamente a que não troca calor — o caso de B.'),
 twin('Um bloco de gelo a 0 °C recebe calor e começa a virar água, ainda a 0 °C.','Um bloco de água a 20 °C recebe calor e sobe para 40 °C.','Em qual delas a temperatura muda enquanto o calor é recebido?','Só em B','Numa mudança de estado (calor latente), a temperatura fica constante; ela só sobe quando não há mudança de estado (calor sensível).'),
 twin('Um corpo está imerso totalmente na água e sente uma força para cima.','Um corpo está no fundo do oceano, sentindo a pressão da água ao redor por todos os lados.','Em qual delas o conceito central é o empuxo?','Só em A','A é empuxo (força resultante para cima); B é pressão hidrostática, a força da água por área, em todas as direções.')],
[twin('Duas cargas elétricas positivas ficam paradas, uma perto da outra.','Uma corrente elétrica percorre um fio condutor.','Em qual delas se aplica a lei de Coulomb (força entre cargas)?','Só em A','Coulomb trata da força entre cargas em repouso; corrente é carga em movimento, capítulo de circuitos.'),
 twin('Uma barra rígida gira em torno de um ponto de apoio fixo, equilibrando dois pesos.','Um bloco é erguido por uma corda que passa por uma roldana fixa no teto.','Em qual delas o conceito principal é o momento de uma força (torque)?','Só em A','A é uma alavanca (torque); B é uma polia simples, que só muda a direção da força.'),
 twin('Uma lâmpada de 100 W fica ligada por 1 hora.','Uma pessoa realiza 360.000 J de trabalho empurrando um carrinho em 1 hora.','As duas envolvem a mesma unidade de potência (watt)?','Nas duas','Potência elétrica e mecânica são medidas na mesma unidade, o watt — só a origem da energia muda.'),
 twin('Uma bola é solta do repouso de uma altura h.','Uma bola é lançada horizontalmente da mesma altura h, com alguma velocidade.','As duas levam o mesmo tempo para chegar ao chão?','Nas duas','O tempo de queda depende só da altura e da gravidade; a velocidade horizontal não interfere no tempo de queda, só no alcance.'),
 twin('Dois carrinhos de massas iguais colidem e ficam grudados, cada um a 10 m/s antes do choque, em sentidos opostos.','Os mesmos dois carrinhos colidem e cada um ricocheteia com 10 m/s, invertendo o sentido.','Em qual delas a velocidade final, depois do choque, é zero?','Só em A','Em A os carrinhos grudam com quantidades de movimento opostas que se cancelam, parando; em B (elástica, massas iguais) cada um sai com a velocidade do outro.')],
[twin('Um satélite orbita a Terra a uma altura constante.','Uma pedra presa por um barbante gira em círculo na mão de alguém.','Nas duas existe uma força centrípeta apontando para o centro do movimento?','Nas duas','Todo movimento circular precisa de força resultante para o centro — na órbita é a gravidade; no barbante, a tração.'),
 twin('Um gás se expande empurrando um pistão, realizando trabalho sobre o meio.','Um gás é aquecido num recipiente de volume fixo, sem pistão.','Em qual delas todo o calor recebido vira só energia interna?','Só em B','Sem variação de volume, W = p·ΔV = 0; pela 1ª lei, Q = ΔU inteiro.'),
 twin('Uma onda sonora se propaga no ar.','Uma onda de luz se propaga no vácuo.','As duas precisam de um meio material para se propagar?','Só em A','Som é onda mecânica: precisa de meio. Luz é eletromagnética: se propaga até no vácuo.'),
 twin('Uma mola ideal presa a um bloco oscila para frente e para trás, sem atrito.','Um pêndulo simples oscila de um lado para o outro, sem atrito com o ar.','Nas duas a energia mecânica total se conserva durante o movimento?','Nas duas','Sem atrito, tanto o sistema massa-mola quanto o pêndulo trocam energia potencial por cinética sem perdas.'),
 twin('Uma lente convergente forma a imagem de um objeto colocado além do foco.','Um espelho plano forma a imagem de um objeto à sua frente.','Em qual delas a imagem pode ser projetada numa tela (imagem real)?','Só em A','A lente convergente, com o objeto além do foco, forma imagem real, projetável. O espelho plano sempre forma imagem virtual, atrás do espelho.')]
];
const FIS_GEMEO_D=['Queda, MU/MUV e atrito: o par mais direto.','Conservação de energia e transformações do gás: quando "zera"?','Colisão e troca de calor: o que se conserva de fato?','Eletrostática × circuito, alavanca × polia: nomes parecidos, contas diferentes.','As mais avançadas: centrípeta, 1ª lei da termodinâmica e natureza da onda.'];
arGame({id:'ar-fis-gemeo',s:'fis',t:'fis-gemeo',nome:'Pegadinha gêmea',ic:'A≟B',desc:'Duas situações quase idênticas na casca: só uma (ou nenhuma, ou as duas) aceita a mesma ferramenta. Treina exatamente a discriminação que falha na prova.',
 lv:FIS_GEMEO.map((g,i)=>({d:FIS_GEMEO_D[i],g}))});
