
/* ===================== ARENA: HISTÓRIA DO PARANÁ =====================
   Uma tabela de fatos (com data, região e ciclo) gera todas as dinâmicas: lacuna,
   certo ou errado, mapa, linha do tempo, pares, classificação e "assinale a incorreta". */
const AR_ZONES={
  norte:{n:'Norte (Norte Velho e Norte Novo)',p:'40,60 120,30 220,20 300,40 320,65 300,100 265,102 200,105 110,110 35,110',c:[175,70]},
  oeste:{n:'Oeste',p:'35,110 110,110 120,165 25,170 20,150',c:[70,140]},
  sudoeste:{n:'Sudoeste',p:'25,170 120,165 170,175 160,230 70,235 30,210',c:[95,200]},
  centrosul:{n:'Centro-Sul (Guarapuava e Palmas)',p:'110,110 200,105 220,165 270,175 300,200 250,215 160,230 170,175 120,165',c:[190,160]},
  camposgerais:{n:'Campos Gerais (Segundo Planalto)',p:'200,105 265,102 270,175 220,165',c:[238,138]},
  curitiba:{n:'Curitiba e Primeiro Planalto',p:'265,102 300,100 320,65 340,80 345,185 300,200 270,175',c:[305,140]},
  litoral:{n:'Litoral',p:'340,80 370,120 385,160 360,190 345,185',c:[362,145]}};
const ZN={norte:'Norte',oeste:'Oeste',sudoeste:'Sudoeste',centrosul:'Centro-Sul',camposgerais:'C. Gerais',curitiba:'Curitiba',litoral:'Litoral'};
const HF=[];
function F(tp,y,yl,z,ci,s,c,w,x){ HF.push({tp,y,yl,z,ci,s,c,w:w.split('|'),x:x||''}); }
/* emancipação */
F('hist-emanc',1853.6,'1853','curitiba',null,'A Lei Imperial nº {} criou a Província do Paraná, em 29 de agosto de 1853.','704','407|740|1.822','Lei nº 704, de 29 de agosto de 1853, assinada por D. Pedro II.');
F('hist-emanc',1853.97,'19/12/1853','curitiba',null,'A nova província foi instalada em {} de 1853, data hoje comemorada no Paraná.','19 de dezembro','29 de agosto|15 de novembro|7 de setembro','19 de dezembro é a data da emancipação política comemorada no estado.');
F('hist-emanc',1853.98,'1853','curitiba',null,'O primeiro presidente da Província do Paraná foi {}.','Zacarias de Góis e Vasconcelos','o Barão do Serro Azul|Gabriel de Lara|Romário Martins','Zacarias de Góis e Vasconcelos, baiano, assumiu em dezembro de 1853.');
F('hist-emanc',0,'até 1853',null,null,'Antes de 1853, o território paranaense era a {} da Província de São Paulo.','5ª Comarca','3ª Comarca|Capitania de Paranaguá|Província de Santa Catarina','A 5ª Comarca (Comarca de Curitiba) pertencia a São Paulo.');
F('hist-emanc',1853.99,'1853','curitiba',null,'{} foi escolhida como capital da nova província.','Curitiba','Paranaguá|Ponta Grossa|Castro','Curitiba venceu a disputa com Paranaguá pela sede do governo.');
F('hist-emanc',1842,'1842','curitiba',null,'Na {}, a comarca não aderiu ao movimento, o que fortaleceu o pedido de emancipação.','Revolução Liberal de 1842','Revolução Farroupilha|Guerra do Contestado|Revolução Federalista','A fidelidade ao Império durante a Revolução Liberal paulista de 1842 reforçou o pleito.');
F('hist-emanc',1835,'1835–1845',null,null,'A {}, no Sul, aumentou o interesse do Império em controlar a região e o caminho das tropas.','Revolução Farroupilha','Revolução Federalista|Guerra do Paraguai|Revolta dos Posseiros','A Farroupilha (1835–1845) tornava estratégica a região ao norte do Rio Grande do Sul.');
F('hist-emanc',1821,'1821','litoral',null,'Em 1821, a Conjura Separatista, em {}, pediu a separação da comarca.','Paranaguá','Curitiba|Castro|Guarapuava','Movimento de 1821 liderado a partir de Paranaguá.');
F('hist-emanc',1889,'1889',null,null,'Com a Proclamação da República, em {}, a província passou a ser o Estado do Paraná.','1889','1853|1822|1891','Em 1889, as províncias viraram estados.');
F('hist-emanc',1853.55,'1853',null,null,'A emancipação foi decretada durante o reinado de {}.','D. Pedro II','D. Pedro I|D. João VI|Marechal Deodoro','Lei de 1853, no Segundo Reinado.');
F('hist-emanc',1853.56,'1853',null,null,'A Província do Paraná foi desmembrada da Província de {}.','São Paulo','Santa Catarina|Rio Grande do Sul|Minas Gerais','Até 1853, era a 5ª Comarca de São Paulo.');
F('hist-emanc',1853.57,'1853',null,'Erva-mate','Na época da emancipação, a principal atividade econômica era a {}.','erva-mate','cafeicultura|mineração de ouro|indústria automobilística','O mate sustentava a economia da nova província.');
F('hist-emanc',1853.5,'1853',null,null,'Na emancipação, a província tinha cerca de {} habitantes.','62 mil','620 mil|6 mil|1 milhão','População estimada em cerca de 62 mil habitantes.');
F('hist-emanc',1894,'1894','curitiba','Erva-mate','Na Revolução Federalista, a resistência no {} marcou a defesa republicana em 1894.','Cerco da Lapa','Cerco de Paranaguá|Cerco de Castro|Cerco de Guarapuava','O Cerco da Lapa (1894), com a morte do general Gomes Carneiro.');
/* ocupação */
F('hist-ocup',1494,'1494',null,null,'Pelo Tratado de {}, a maior parte do atual Paraná ficava do lado espanhol.','Tordesilhas','Madri|Santo Ildefonso|Petrópolis','Tordesilhas (1494) dividiu as terras entre Portugal e Espanha.');
F('hist-ocup',1541,'1541–1542','oeste',null,'O espanhol {} cruzou o território pelo Caminho do Peabiru e viu as Cataratas do Iguaçu.','Cabeza de Vaca','Raposo Tavares|Gabriel de Lara|Pedro Álvares Cabral','Álvar Núñez Cabeza de Vaca, em 1541–1542.');
F('hist-ocup',1610,'século XVII','norte',null,'No século XVII, jesuítas espanhóis fundaram reduções na região do {}.','Guairá','Pantanal|Recôncavo|Contestado','Reduções do Guairá, como Loreto e Santo Inácio.');
F('hist-ocup',1629,'1629–1631','norte',null,'Bandeirantes paulistas, como {}, destruíram as reduções do Guairá.','Raposo Tavares','Cabeza de Vaca|Zacarias de Góis|Gabriel de Lara','Antônio Raposo Tavares liderou ataques às reduções.');
F('hist-ocup',1648,'1648','litoral',null,'{} foi elevada a vila em 1648, sob Gabriel de Lara.','Paranaguá','Curitiba|Antonina|Morretes','Paranaguá, primeira vila do território.');
F('hist-ocup',1693,'1693','curitiba',null,'Curitiba foi elevada a vila em {}.','1693','1648|1853|1720','Vila de Nossa Senhora da Luz dos Pinhais, 29 de março de 1693.');
F('hist-ocup',1810,'1810','centrosul',null,'Os Campos de {} foram ocupados a partir da Real Expedição de 1810.','Guarapuava','Palmas|Castro|Londrina','A Real Expedição conquistou os Campos de Guarapuava.');
F('hist-ocup',1839,'1839–1840','centrosul',null,'Os Campos de {} foram ocupados por volta de 1839–1840.','Palmas','Guarapuava|Curitiba|Maringá','Ocupação dos Campos de Palmas.');
F('hist-ocup',1829,'1829','curitiba',null,'Imigrantes {} fundaram colônia em Rio Negro em 1829.','alemães','poloneses|japoneses|ucranianos','Colônia alemã de Rio Negro, 1829.');
F('hist-ocup',1871,'1871','curitiba',null,'Imigrantes {} chegaram a Curitiba a partir de 1871.','poloneses','japoneses|holandeses|ucranianos','Imigração polonesa, a partir de 1871.');
F('hist-ocup',1878,'1878','curitiba',null,'Imigrantes {} fundaram Santa Felicidade, em Curitiba, em 1878.','italianos','alemães|poloneses|japoneses','Colônia italiana de Santa Felicidade.');
F('hist-ocup',1891,'década de 1890','centrosul',null,'Imigrantes {} se fixaram em Prudentópolis e Mallet na década de 1890.','ucranianos','italianos|holandeses|japoneses','Imigração ucraniana, a partir de 1891.');
F('hist-ocup',1911,'1911','camposgerais',null,'Imigrantes {} fundaram Carambeí, nos Campos Gerais, em 1911.','holandeses','alemães|italianos|japoneses','Colônia holandesa de Carambeí.');
F('hist-ocup',1925,'1925–1930','norte','Café','A Companhia de Terras Norte do Paraná, de capital {}, loteou o norte do estado.','inglês','norte-americano|japonês|alemão','Empresa de capital britânico que vendeu pequenos lotes.');
F('hist-ocup',1929,'1929','norte','Café','{} foi fundada em 1929, na expansão do café.','Londrina','Maringá|Cascavel|Guarapuava','Londrina: fundação em 1929, município em 1934.');
F('hist-ocup',1947,'1947','norte','Café','{} foi fundada em 1947, planejada pela companhia colonizadora.','Maringá','Londrina|Curitiba|Foz do Iguaçu','Maringá, fundada em 1947.');
F('hist-ocup',1912,'1912–1916',null,'Madeira','A {} envolveu a disputa de terras entre Paraná e Santa Catarina.','Guerra do Contestado','Revolta dos Posseiros|Revolução Federalista|Guerra dos Farrapos','Contestado, 1912–1916; o acordo de limites veio em 1916.');
F('hist-ocup',1943,'1943','sudoeste',null,'A {}, criada em 1943, atraiu migrantes para o sudoeste.','CANGO (Colônia Agrícola Nacional General Osório)','Companhia de Terras Norte do Paraná|CIC|Itaipu','A CANGO promoveu a colonização do sudoeste.');
F('hist-ocup',1957,'1957','sudoeste',null,'Em 1957, a {} ocorreu em cidades como Francisco Beltrão e Pato Branco.','Revolta dos Posseiros','Guerra do Contestado|Revolução Federalista|Conjura Separatista','Levante dos colonos contra companhias de terras no sudoeste.');
F('hist-ocup',1945,'a partir dos anos 1940','oeste',null,'O oeste e o sudoeste foram ocupados principalmente por migrantes {}.','gaúchos e catarinenses','paulistas e mineiros|nordestinos|japoneses','Frente sulista, de descendentes de italianos e alemães.');
F('hist-ocup',1943.5,'1943–1946','oeste',null,'O Território Federal do {} existiu entre 1943 e 1946.','Iguaçu','Guairá|Paraná|Ivaí','Território criado no Estado Novo e extinto em 1946.');
F('hist-ocup',1984,'1984','oeste',null,'A usina de {}, binacional com o Paraguai, começou a gerar energia em 1984.','Itaipu','Salto Santiago|Foz do Areia|Capivara','Itaipu Binacional, no Rio Paraná.');
F('hist-ocup',0,'',null,null,'Kaingang e {} são povos indígenas presentes no Paraná.','Guarani','Yanomami|Pataxó|Tikuna','Kaingang (Jê) e Guarani (Tupi); os Xetá quase foram extintos.');
/* ciclos econômicos */
F('hist-ciclos',1640,'século XVII','litoral','Ouro','No século XVII, a exploração de {} no litoral atraiu os primeiros povoadores.','ouro de aluvião','café|erva-mate|madeira','Faiscação em rios do litoral e do planalto.');
F('hist-ciclos',1695,'fim do século XVII',null,'Ouro','O ouro paranaense perdeu importância com as descobertas em {}.','Minas Gerais','Goiás|Mato Grosso|Bahia','O ouro de Minas, no fim do século XVII, esvaziou a mineração local.');
F('hist-ciclos',1731,'século XVIII','camposgerais','Tropeirismo','No tropeirismo, tropas de mulas iam de Viamão (RS) até a feira de {}.','Sorocaba','Curitiba|Paranaguá|São Paulo','O Caminho de Viamão levava os muares até Sorocaba.');
F('hist-ciclos',1760,'séculos XVIII–XIX','camposgerais','Tropeirismo','As fazendas de invernada {} deram origem a cidades como Castro, Lapa e Ponta Grossa.','dos Campos Gerais','do Litoral|do Norte Novo|do Sudoeste','Pouso e engorda do gado ao longo do caminho.');
F('hist-ciclos',1850,'século XIX','curitiba','Erva-mate','No século XIX, a {} foi o principal produto da economia paranaense.','erva-mate','cana-de-açúcar|soja|borracha','Engenhos em Curitiba, Morretes e Antonina.');
F('hist-ciclos',1855,'século XIX',null,'Erva-mate','A erva-mate era exportada principalmente para {}.','Argentina, Uruguai e Chile','Estados Unidos e Europa|Portugal e Espanha|Japão e China','Mercado platino e chileno.');
F('hist-ciclos',1873,'1873','litoral','Erva-mate','A Estrada da {}, concluída em 1873, ligou o planalto ao litoral.','Graciosa','Ribeira|Mata|Serra do Mar Federal','Estrada da Graciosa, rota do mate até o porto.');
F('hist-ciclos',1885,'1885','litoral','Erva-mate','A ferrovia {} foi inaugurada em 1885.','Paranaguá–Curitiba','São Paulo–Rio Grande|Curitiba–Ponta Grossa|Londrina–Maringá','Obra de engenharia na Serra do Mar, com projeto ligado aos irmãos Rebouças.');
F('hist-ciclos',1894.5,'1894','curitiba','Erva-mate','O Barão do Serro Azul, grande {}, foi morto em 1894.','ervateiro','cafeicultor|madeireiro|minerador','Ildefonso Pereira Correia, industrial do mate.');
F('hist-ciclos',1910,'início do século XX','centrosul','Madeira','O ciclo da madeira explorou principalmente a {}.','araucária','imbuia|peroba|pau-brasil','Pinheiro-do-paraná, base das serrarias.');
F('hist-ciclos',1908,'1908–1910',null,'Madeira','A construção da ferrovia {} está ligada à Guerra do Contestado.','São Paulo–Rio Grande','Paranaguá–Curitiba|Madeira–Mamoré|Noroeste do Brasil','A ferrovia e a madeireira de Farquhar expulsaram posseiros.');
F('hist-ciclos',1920,'anos 1920–1970','norte','Café','O {} dominou a economia do norte entre as décadas de 1920 e 1970.','café','algodão|mate|trigo','Norte Velho (paulistas e mineiros) e Norte Novo (companhias colonizadoras).');
F('hist-ciclos',1960,'década de 1960','norte','Café','Na década de 1960, o Paraná chegou a ser o maior produtor de {} do Brasil.','café','soja|milho|trigo','Auge da cafeicultura paranaense.');
F('hist-ciclos',1975,'1975','norte','Café','A {} de 1975 destruiu grande parte dos cafezais.','geada negra','seca|enchente|praga','18 de julho de 1975.');
F('hist-ciclos',1976,'após 1975',null,'Soja e agroindústria','Depois da geada, a {} se expandiu, com mecanização e êxodo rural.','soja','cana|borracha|erva-mate','Soja, trigo e mecanização mudaram o campo.');
F('hist-ciclos',1973,'1973','curitiba','Industrialização','A {} foi criada em 1973 para atrair indústrias.','Cidade Industrial de Curitiba (CIC)','Zona Franca|CANGO|Itaipu','A CIC impulsionou a industrialização da capital.');
F('hist-ciclos',1996,'anos 1990','curitiba','Industrialização','Nos anos 1990, {} se instalaram na região metropolitana de Curitiba.','montadoras de automóveis','siderúrgicas estatais|usinas nucleares|refinarias de açúcar','Renault, Volkswagen/Audi e outras, em São José dos Pinhais.');
const CICLOS=['Ouro','Tropeirismo','Erva-mate','Madeira','Café','Soja e agroindústria','Industrialização'];
const hF=tp=>HF.filter(f=>!tp||f.tp===tp);
const hSI=f=>({s:f.s,c:f.c,w:f.w,x:f.x});
const hTxt=f=>siFill(f).replace(/^./,m=>m.toUpperCase());
function hMap(tp){ const f=rP(hF(tp).filter(x=>x.z)); return arMapR('Toque na região do fato:\n“'+hTxt(f)+'”',f.z,{x:AR_ZONES[f.z].n+'. '+f.x}); }
function hLine(tp,n){ const pool=rS(hF(tp).filter(f=>f.y>0)); const pick=[]; pool.forEach(f=>{ if(pick.length<n&&pick.every(p=>Math.abs(p.y-f.y)>=3)) pick.push(f); }); pick.sort((a,b)=>a.y-b.y);
  return arOrd('Ponha em ordem, do mais antigo ao mais recente:',pick.map(hTxt),{lab:pick.map(f=>f.yl),x:pick.map(f=>f.yl+': '+hTxt(f)).join(' → ')}); }
function hPairs(tp){ const pool=rS(hF(tp).filter(f=>f.y>0&&!/\d/.test(f.c))); const pick=[]; pool.forEach(f=>{ if(pick.length<4&&pick.every(p=>p.yl!==f.yl&&p.c!==f.c)) pick.push(f); }); if(pick.length<3) return siCloze(hSI(rP(hF(tp)))); return arMatch('Ligue cada fato à sua data:',pick.map(f=>[f.c,f.yl]),{x:pick.map(f=>f.c+': '+f.yl).join('; ')}); }
function hOdd(tp){ const fs=rN(hF(tp),5); return siOdd(fs.map(hSI),true,'')||siCloze(hSI(fs[0])); }
function hCiclo(){ const fs=rN(HF.filter(f=>f.ci),5); return arSort('Classifique cada fato no ciclo econômico:',CICLOS,fs.map(f=>[hTxt(f),CICLOS.indexOf(f.ci)]),{x:'Ouro (séc. XVII) → Tropeirismo (XVIII) → Erva-mate (XIX) → Madeira (início do XX) → Café (1920–1970) → Soja e agroindústria → Industrialização.'}); }
const hLv=tp=>[
  {d:'Certo ou errado: os fatos essenciais.',g:[()=>siTF(hSI(rP(hF(tp))),'Verdadeiro ou falso?')]},
  {d:'Complete o fato (nomes, datas e lugares).',g:[()=>siCloze(hSI(rP(hF(tp))))]},
  {d:'Onde aconteceu: mapa do Paraná; fato e data.',g:[()=>hMap(tp),()=>hPairs(tp)]},
  {d:'Linha do tempo: ponha os fatos em ordem.',g:[()=>hLine(tp,rP([4,5])),()=>siSpot(hSI(rP(hF(tp))),0.2)]},
  {d:'Alternativa incorreta e questões mistas de prova.',g:tp==='hist-ciclos'?[()=>hOdd(tp),()=>hCiclo(),()=>hLine(null,5)]:[()=>hOdd(tp),()=>hLine(null,5),()=>hMap(null)]}];
arGame({id:'ar-hist-ocup',s:'hist',t:'hist-ocup',nome:'Rotas da ocupação',ic:'⌖',desc:'Do Guairá às frentes do norte e do sudoeste: quem chegou, quando e onde.',lv:hLv('hist-ocup')});
arGame({id:'ar-hist-ciclos',s:'hist',t:'hist-ciclos',nome:'Ciclos econômicos',ic:'⛏',desc:'Ouro, tropeirismo, mate, madeira, café e indústria, com mapa e linha do tempo.',lv:hLv('hist-ciclos')});
arGame({id:'ar-hist-emanc',s:'hist',t:'hist-emanc',nome:'Emancipação de 1853',ic:'1853',desc:'A 5ª Comarca, a Lei nº 704, Zacarias, a capital e o contexto do Império.',lv:hLv('hist-emanc')});
