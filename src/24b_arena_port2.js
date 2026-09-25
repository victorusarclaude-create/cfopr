/* ===================== ARENA: PORTUGUÊS, PARTE 2 =====================
   Duas peças novas contra o "gramática vira uma pilha de regras soltas":
   1) PORT_TRILHA/PORT_TRILHAS agrupam os 11 jogos em 3 trilhas com ordem sugerida
      (usado por viewArenaHome, em 29_arena_motor.js), em vez de uma lista só.
   2) PORT_PEGA é o banco único da Biblioteca de pegadinhas (sheetPortPega) e também
      alimenta o jogo "Caça-pegadinha": a mesma pegadinha vira card de estudo e vira
      pergunta de classificar, com o truque para lembrar em ambos os lugares. */
const PORT_TRILHA={
  'port-ort':{tr:'dura',o:1},'port-conc':{tr:'dura',o:2},'port-reg':{tr:'dura',o:3},'port-col':{tr:'dura',o:4},'port-pont':{tr:'dura',o:5},'port-pega':{tr:'dura',o:6},
  'port-cla':{tr:'lex',o:1},'port-sem':{tr:'lex',o:2},
  'port-sint':{tr:'lei',o:1},'port-coe':{tr:'lei',o:2},'port-gen':{tr:'lei',o:3},'port-int':{tr:'lei',o:4}
};
const PORT_TRILHAS={
  dura:{n:'Regra dura',d:'Regras fixas, cheias de pegadinha: é onde a banca mais testa decoreba disfarçada de lógica. Comece por aqui.'},
  lex:{n:'Léxico e forma',d:'Reconhecer a classe e o sentido exato das palavras — a base para entender qualquer frase.'},
  lei:{n:'Leitura e texto',d:'Como o texto se organiza e o que ele realmente diz. É onde tudo o que veio antes se junta.'}
};
const PORT_PEGA=[
 {n:'Crase antes de masculino',nv:1,pega:'Não existe crase antes de palavra masculina.',ex:['Fui a pé até o quartel.','Ela dirige a cavalo nos treinos.'],truque:'Troque a palavra por uma masculina: se virar "ao", tem crase; se virar só "o", não tem.'},
 {n:'Crase antes de verbo',nv:1,pega:'Verbo nunca recebe artigo, então nunca vem com crase antes dele.',ex:['Ele começou a correr assim que ouviu o alarme.','Recusou-se a falar com a imprensa.'],truque:'Verbo não tem gênero — sem crase, sempre.'},
 {n:'"A gente" no singular',nv:1,pega:'"A gente" (= nós) concorda sempre no singular.',ex:['A gente foi ao plantão ontem.','A gente já treinou esse procedimento.'],truque:'"A gente" é uma pessoa (o pronome) — o verbo trata como "ele", sempre singular.'},
 {n:'Verbo impessoal no singular',nv:1,pega:'Haver (existir) e fazer (tempo) não têm sujeito, então ficam sempre no singular.',ex:['Há muitos candidatos inscritos este ano.','Faz dois anos que ele passou no concurso.'],truque:'Existir e tempo não têm "dono" — o verbo nunca vai pro plural.'},
 {n:'Regência de "assistir"',nv:2,pega:'"Assistir" no sentido de ver pede a preposição "a".',ex:['Os recrutas assistiram ao treinamento.','Ninguém assistiu à cena do resgate.'],truque:'Assistir A alguma coisa: você fica a distância, olhando de fora.'},
 {n:'Regência de "chegar"/"ir"',nv:2,pega:'"Chegar" e "ir" pedem a preposição "a", nunca "em".',ex:['A viatura chegou ao local em cinco minutos.','Eles foram à base assim que foram chamados.'],truque:'Quem chega ou vai, chega/vai A um lugar — nunca "em", na norma culta.'},
 {n:'Regência de "namorar"',nv:2,pega:'"Namorar" é transitivo direto: usa-se sem preposição.',ex:['Ele namora a colega de turma.','Os soldados obedeceram ao comando.'],truque:'"Namorar" já abraça o complemento sozinho — não precisa de "com" no meio.'},
 {n:'"Onde" × "em que"',nv:2,pega:'"Onde" só serve para lugar físico; nos outros casos, usa-se "em que" ou "no qual".',ex:['Essa é a cidade onde ele nasceu.','Essa é a situação em que ele se meteu.'],truque:'Se não dá pra responder "lá" (num lugar), a resposta é "em que", nunca "onde".'},
 {n:'Próclise com negativa',nv:3,pega:'Palavra negativa antes do verbo puxa o pronome para antes dele.',ex:['Não se esqueça do capacete.','Nunca me atrasei para o plantão.'],truque:'Palavra de negação puxa o pronome para antes do verbo — nunca depois.'},
 {n:'Próclise com relativo/indefinido',nv:3,pega:'Pronome relativo ou indefinido antes do verbo também exige próclise.',ex:['Os documentos que se perderam foram recuperados.','Alguém me avisou sobre a mudança de horário.'],truque:'Quem "aponta" para algo ou alguém (relativo, indefinido) também puxa o pronome para antes.'},
 {n:'Ênclise no início de frase',nv:3,pega:'Não se inicia frase, na escrita formal, com pronome oblíquo átono: usa-se ênclise.',ex:['Chamaram-me às pressas.','Avisaram-nos sobre a mudança.'],truque:'Frase não começa com pronome "pequeno" (me, se, o, lhe) na escrita formal.'},
 {n:'Mesóclise no futuro',nv:3,pega:'Mesóclise só existe nos tempos futuros, e só quando nada antes do verbo atrai o pronome.',ex:['Dar-se-á o resultado amanhã.','Encontrar-nos-emos no quartel.'],truque:'Mesóclise mora dentro do verbo — só aparece nos futuros, sem nada "chamando" o pronome antes.'},
 {n:'Vírgula não separa sujeito e verbo',nv:4,pega:'Uma vírgula sozinha nunca separa o sujeito do verbo.',ex:['O comandante da unidade chegou atrasado.','O comandante, visivelmente cansado, chegou atrasado.'],truque:'Sujeito e verbo são um casal — vírgula sozinha nunca entra entre os dois (só em par, isolando um aposto).'},
 {n:'Vocativo sempre entre vírgulas',nv:4,pega:'O vocativo é isolado por vírgula(s) em qualquer posição da frase.',ex:['Soldado, apresente-se ao comandante.','Apresente-se ao comandante, soldado.'],truque:'Vocativo é quem você chama — sempre cercado de vírgula, não importa onde ele more na frase.'},
 {n:'Aposto explicativo × especificativo',nv:4,pega:'O aposto explicativo vem entre vírgulas; o especificativo, sem vírgula.',ex:['Curitiba, capital do Paraná, tem clima frio.','O poeta Drummond nasceu em Minas Gerais.'],truque:'Se a informação é um "extra" que dá pra tirar sem perder o sentido, tem vírgula; se faz parte do nome, não tem.'},
 {n:'Oração deslocada pede vírgula',nv:4,pega:'Oração adverbial que vai para o início do período é seguida de vírgula.',ex:['Quando o sinal tocar, todos devem sair em fila.','Todos devem sair em fila quando o sinal tocar.'],truque:'Oração que furou a fila e foi para o início do período sempre avisa com uma vírgula.'},
 {n:'Sujeito composto posposto',nv:5,pega:'Verbo antes de sujeito composto pode concordar no singular (com o mais próximo) ou no plural (com o todo) — as duas formas são aceitas.',ex:['Chegou o comandante e os soldados.','Chegaram o comandante e os soldados.'],truque:'Verbo antes do sujeito composto tem duas respostas certas: só o vizinho mais perto, ou todo mundo junto.'},
 {n:'Concordância com "a maioria de"',nv:5,pega:'Expressões partitivas ("a maioria de", "grande parte de") podem concordar com a ideia (plural) ou com a forma (singular).',ex:['A maioria dos candidatos passou na prova.','A maioria dos candidatos passaram na prova.'],truque:'Quando a expressão é "um monte de gente", o verbo pode concordar com o monte (singular) ou com a gente (plural).'},
 {n:'Os quatro porquês',nv:5,pega:'Porque (junto, resposta/causa), por que (separado, pergunta), por quê (separado e acentuado, sozinho no fim), porquê (substantivo, com "o" antes).',ex:['Ele faltou porque estava doente.','Por que ele faltou?'],truque:'Pergunta = separado. Resposta = junto. Sozinho no fim = com acento. Com "o" na frente = é substantivo.'},
 {n:'"Onde" × "aonde"',nv:5,pega:'"Aonde" (com A) só se usa com verbos de movimento; "onde" indica permanência.',ex:['Onde você está?','Aonde você vai?'],truque:'Tem movimento (ir, chegar)? Junte o "a" antes do "onde". Tem permanência (estar, morar)? Só "onde".'}
];
function sheetPortPega(){
  const groups=[1,2,3,4,5].map(nv=>({nv,items:PORT_PEGA.filter(p=>p.nv===nv)}));
  let h='<h2 id="sheetTitle">Biblioteca de pegadinhas</h2><p class="small muted">'+PORT_PEGA.length+' armadilhas que mais derrubam candidato, com o truque para nunca mais cair. Jogue o Caça-pegadinha, na trilha Regra dura, para treinar.</p>';
  groups.forEach(g=>{ h+='<h3>Nível '+g.nv+'</h3>'+g.items.map(p=>'<div class="jngitem"><b>'+esc(p.n)+'</b><p>'+esc(p.pega)+'</p><p><b>Truque:</b> '+esc(p.truque)+'</p></div>').join(''); });
  openSheet(h,{key:'portPega'});
}
const PORT_PEGA_D=['Crase, verbo impessoal e "a gente": as pegadinhas mais óbvias.','Regência: a preposição certa depois do verbo.','Colocação pronominal: próclise, ênclise e mesóclise.','Pontuação: vírgula em sujeito, vocativo, aposto e oração deslocada.','As pegadinhas mais finas: concordância dupla e os quatro porquês.'];
arGame({id:'ar-port-pega',s:'port',t:'port-pega',nome:'Caça-pegadinha',ic:'⚠',desc:'As armadilhas que mais derrubam candidato, agrupadas pelo tipo de pegadinha, não pelo tópico — com o truque para nunca mais cair nelas.',lv:[1,2,3,4,5].map((nv,i)=>{
  const bank=PORT_PEGA.filter(p=>p.nv===nv).flatMap(p=>p.ex.map(e=>[e,p.n,null,p.pega+' Truque: '+p.truque]));
  return {d:PORT_PEGA_D[i],g:[cq(bank,'Qual é a pegadinha nesta frase?')]};
})});
