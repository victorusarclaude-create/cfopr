/* ===================== DADOS: edital, fontes, resumos, cartões, jogos ===================== */
const SUBJECTS = [
  {id:'port',nome:'Língua Portuguesa',q:7,bloco:'ling',tipo:'leitura',topicos:[
    ['port-int','Interpretação e compreensão de texto'],['port-gen','Tipologia e gêneros textuais'],['port-coe','Coesão, coerência e conectivos'],
    ['port-ort','Ortografia e acentuação'],['port-cla','Classes de palavras'],['port-sint','Sintaxe: termos da oração e período composto'],
    ['port-conc','Concordância verbal e nominal'],['port-reg','Regência e crase'],['port-pont','Pontuação'],['port-col','Colocação pronominal'],
    ['port-sem','Semântica e significação das palavras']]},
  {id:'mat',nome:'Matemática',q:7,bloco:'exatas',tipo:'calculo',topicos:[
    ['mat-ops','Operações básicas: frações, potências e raízes',1],['mat-prop','Razão, proporção e regra de três',1],['mat-porc','Porcentagem e juros',1],
    ['mat-eq','Equações e inequações do 1º e 2º grau',1],['mat-fun','Funções afim e quadrática',1],['mat-exp','Exponencial e logaritmo'],
    ['mat-pa','Progressões (PA e PG)'],['mat-comb','Análise combinatória e probabilidade'],['mat-est','Estatística: medidas de posição e dispersão'],
    ['mat-mtz','Matrizes, determinantes e sistemas lineares'],['mat-trig','Trigonometria'],['mat-gp','Geometria plana'],['mat-ge','Geometria espacial'],
    ['mat-analit','Geometria analítica'],['mat-calc','Noções de limites, derivadas e integrais']]},
  {id:'fis',nome:'Física',q:7,bloco:'exatas',tipo:'calculo',topicos:[
    ['fis-unid','Grandezas, unidades e notação científica',1],['fis-cin','Cinemática (MU, MUV, queda livre)'],['fis-din','Dinâmica e Leis de Newton'],
    ['fis-ene','Trabalho, energia e potência'],['fis-qm','Impulso e quantidade de movimento'],['fis-hid','Hidrostática e hidrodinâmica: pressão, Pascal, Arquimedes, Bernoulli'],
    ['fis-term','Termologia e calorimetria'],['fis-tdin','Termodinâmica'],['fis-ond','Ondas e acústica'],['fis-opt','Óptica'],
    ['fis-elst','Eletrostática'],['fis-eldin','Eletrodinâmica e circuitos'],['fis-msolid','Mecânica dos sólidos e dos fluidos (noções)']]},
  {id:'qui',nome:'Química',q:7,bloco:'exatas',tipo:'calculo',topicos:[
    ['qui-mat','Matéria, misturas e separação'],['qui-atom','Estrutura atômica e tabela periódica'],['qui-radio','Radioatividade'],
    ['qui-lig','Ligações químicas e forças intermoleculares'],['qui-gas','Gases: teoria cinética e leis dos gases'],
    ['qui-inorg','Funções inorgânicas: ácidos, bases, sais e óxidos'],['qui-reac','Reações e balanceamento'],['qui-esteq','Mol e estequiometria'],['qui-sol','Soluções e concentração'],
    ['qui-termo','Termoquímica e combustão'],['qui-cin','Cinética química'],['qui-eq','Equilíbrio químico e pH'],['qui-ele','Eletroquímica'],
    ['qui-org','Química orgânica: funções e reações']]},
  {id:'ing',nome:'Língua Inglesa',q:5,bloco:'ling',tipo:'leitura',topicos:[
    ['ing-int','Interpretação de texto'],['ing-voc','Vocabulário e falsos cognatos'],['ing-verb','Verb forms e tempos verbais'],['ing-gram','Adjectives, nouns, articles, prepositions, pronouns e wh-questions']]},
  {id:'dadm',nome:'Direito Administrativo',q:3,bloco:'juri',tipo:'memoria',topicos:[
    ['dadm-princ','Conceito e princípios da Administração Pública'],
    ['dadm-atos','Atos administrativos: conceito, atributos, requisitos, classificação e extinção'],
    ['dadm-org','Organização administrativa: agentes públicos, entidades e órgãos públicos'],
    ['dadm-pod','Poderes administrativos']]},
  {id:'dcon',nome:'Direito Constitucional',q:3,bloco:'juri',tipo:'memoria',topicos:[
    ['dcon-poder','Poder Constituinte'],['dcon-princ','Princípios fundamentais da Constituição'],
    ['dcon-dir','Direitos e garantias fundamentais'],['dcon-nac','Nacionalidade e direitos políticos'],
    ['dcon-org','Organização do Estado: União, Estados, DF e Territórios'],['dcon-poderes','Organização dos Poderes: Legislativo, Executivo e Judiciário'],
    ['dcon-admp','Administração Pública na CF: disposições gerais, militares estaduais e servidores públicos'],
    ['dcon-defesa','Defesa do Estado: estado de defesa, estado de sítio, Forças Armadas e segurança pública']]},
  {id:'dh',nome:'Direitos Humanos',q:3,bloco:'juri',tipo:'memoria',topicos:[
    ['dh-dudh','Declaração Universal dos Direitos Humanos (1948)'],
    ['dh-cadh','Convenção Americana - Pacto de San José (1969), arts. 1º a 32'],
    ['dh-pequim','Declaração de Pequim sobre a mulher (1995)'],
    ['dh-pidcp','Pacto Internacional dos Direitos Civis e Políticos (1966)'],
    ['dh-pidesc','Pacto Internacional dos Direitos Econômicos, Sociais e Culturais'],
    ['dh-hist','Precedentes históricos: Liga das Nações, OIT e Convenção do Genocídio'],
    ['dh-idoso','Estatuto da Pessoa Idosa']]},
  {id:'leg',nome:'Legislação Aplicada ao CBMPR',q:3,bloco:'juri',tipo:'memoria',topicos:[
    ['leg-pnspds','Lei 13.675/2018: PNSPDS e Susp'],['leg-lonpm','Lei 14.751/2023: Lei Orgânica Nacional das PMs e CBMs'],
    ['leg-pnpdec','Lei 12.608/2012: Política Nacional de Proteção e Defesa Civil'],['leg-mariapenha','Lei 11.340/2006: Lei Maria da Penha']]},
  {id:'apub',nome:'Administração Pública',q:5,bloco:'juri',tipo:'memoria',topicos:[
    ['apub-org','Organização do Estado: princípios e Administração direta e indireta'],
    ['apub-lic','Licitações: princípios, fases, modalidades e critérios de julgamento (Lei 14.133/2021)'],
    ['apub-disp','Contratação direta: dispensa e inexigibilidade; Sistema de Registro de Preços'],
    ['apub-contr','Contratos administrativos: execução, alteração, fiscalização e extinção']]},
  {id:'eca',nome:'Estatuto da Criança e do Adolescente',q:2,bloco:'juri',tipo:'memoria',topicos:[
    ['eca-dir','Disposições gerais e direitos fundamentais'],['eca-prot','Medidas de proteção e Conselho Tutelar'],['eca-ato','Ato infracional e medidas socioeducativas']]},
  {id:'ps',nome:'Primeiros Socorros',q:4,bloco:'bomb',tipo:'memoria',topicos:[
    ['ps-anat','Anatomia: sistemas tegumentar, muscular-esquelético, respiratório, cardiovascular, digestório e nervoso'],
    ['ps-aval','Avaliação da vítima (XABCDE)'],['ps-hem','Hemorragias e choque'],
    ['ps-trau','Traumas: TCE, tórax e fraturas'],['ps-quei','Queimaduras'],['ps-rcp','RCP e desobstrução de vias aéreas'],['ps-afog','Afogamento']]},
  {id:'scip',nome:'Segurança Contra Incêndio e Pânico',q:4,bloco:'bomb',tipo:'memoria',topicos:[
    ['scip-lei','Lei Estadual 19.449/2018'],['scip-dec','Decreto Estadual 11.868/2018'],
    ['scip-adm','CSCIP: procedimentos administrativos (CVCB, CLCB)'],['scip-med','CSCIP: medidas de segurança e classificação das edificações']]},
  {id:'comb',nome:'Combate a Incêndio',q:4,bloco:'bomb',tipo:'memoria',topicos:[
    ['comb-tetra','Tetraedro do fogo'],['comb-fases','Combustão, fases e propagação do incêndio'],['comb-cla','Classes de incêndio e métodos de extinção'],
    ['comb-ext','Tipos de extintores'],['comb-agua','Água como agente extintor e tipos de jato']]},
  {id:'hist',nome:'História',q:3,bloco:'geral',tipo:'geral',topicos:[
    ['hist-ocup','Ocupação do território paranaense'],['hist-ciclos','Ciclos econômicos do Paraná'],['hist-emanc','Emancipação política do Paraná (1853)']]},
  {id:'geo',nome:'Geografia',q:3,bloco:'geral',tipo:'geral',topicos:[
    ['geo-form','Formação socioespacial: América, África, Europa, Ásia e Oceania'],['geo-antart','Importância ambiental e territorial da Antártida'],
    ['geo-ocup','Ocupação territorial do Paraná e do Brasil'],['geo-reg','Regionalização do território brasileiro, paranaense e mundial'],
    ['geo-campo','Campo e cidade no Brasil e no Paraná'],['geo-ciclos','Ciclos econômicos no Brasil e no Paraná'],
    ['geo-povos','Povos indígenas, quilombolas, ribeirinhos, caiçaras e comunidades tradicionais']]}
];
const BLOCOS = {exatas:'Exatas',ling:'Português e Inglês',juri:'Direito e gestão',bomb:'Bombeiro',geral:'História e Geografia'};
const FAC = {calculo:1,leitura:1,memoria:1.3,geral:0.9};
const RUNGS = ['Fácil','Médio','Difícil','Dominado'];
const GAP = [1,0.45,0.2,0.05];
const TIPOS_ERRO = ['Conteúdo','Conta','Interpretação','Desatenção','Chute'];
const INT = [1,3,7,15,30];
const T_FAST=20, T_SLOW=75;
const CRIT = ['Tema e argumentação','Coesão e coerência','Estrutura do texto','Gramática'];
/* Fontes oficiais por matéria (links externos abrem numa aba nova) */
const BIBLIO = {
  edital:[
    {t:'Concursos do CBMPR: editais oficiais, inclusive Cadete 2025',u:'https://www.bombeiros.pr.gov.br/Pagina/Concursos'},
    {t:'Formas de ingresso e previsão de conteúdo programático (CBMPR)',u:'https://www.bombeiros.pr.gov.br/Pagina/Formas-de-Ingresso'},
    {t:'Edital nº 01 Cadete CBMPR-2025 (PDF)',u:'https://jcconcursos.com.br/media/uploads/anexos/concurso-bombeiros-pr-edital-1-2025-cadete.pdf'}],
  dcon:[{t:'Constituição Federal de 1988 (Planalto)',u:'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm'}],
  dadm:[{t:'CF/88, art. 37 e seguintes: princípios da Administração (Planalto)',u:'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm'}],
  dh:[
    {t:'Pacto de San José da Costa Rica: Decreto 678/1992 (Planalto)',u:'https://planalto.gov.br/ccivil_03/decreto/D0678.htm'},
    {t:'Pacto dos Direitos Civis e Políticos: Decreto 592/1992 (Planalto)',u:'https://www.planalto.gov.br/ccivil_03/decreto/1990-1994/d0592.htm'},
    {t:'Pacto dos Direitos Econômicos, Sociais e Culturais: Decreto 591/1992 (Planalto)',u:'https://www.planalto.gov.br/ccivil_03/decreto/1990-1994/d0591.htm'},
    {t:'Estatuto da Pessoa Idosa: Lei 10.741/2003 (Planalto)',u:'https://www.planalto.gov.br/ccivil_03/leis/2003/l10.741.htm'}],
  leg:[
    {t:'Lei 13.675/2018: PNSPDS e Susp (Câmara, texto atualizado)',u:'https://www2.camara.leg.br/legin/fed/lei/2018/lei-13675-11-junho-2018-786843-normaatualizada-pl.pdf'},
    {t:'Lei 14.751/2023: Lei Orgânica Nacional PM/CBM (Câmara, texto atualizado)',u:'https://www2.camara.leg.br/legin/fed/lei/2023/lei-14751-12-dezembro-2023-795052-normaatualizada-pl.pdf'},
    {t:'Lei 12.608/2012: Proteção e Defesa Civil (Planalto)',u:'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12608.htm'},
    {t:'Lei 11.340/2006: Maria da Penha (Planalto)',u:'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm'},
    {t:'Leis estaduais 1.943/1954 e 22.206/2024: portal oficial da legislação do PR (buscar pelo número)',u:'https://www.legislacao.pr.gov.br/legislacao/listarAtosAno.do'}],
  apub:[{t:'Lei 14.133/2021: Licitações e Contratos (Planalto)',u:'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm'}],
  eca:[{t:'ECA: Lei 8.069/1990 (Planalto)',u:'https://www.planalto.gov.br/ccivil_03/leis/l8069.htm'}],
  ps:[
    {t:'Biblioteca de primeiros socorros do CBMPR',u:'https://www.bombeiros.pr.gov.br/Pagina/Biblioteca'},
    {t:'Sinais vitais (CBMPR, PDF)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/SinaisVitais.pdf'},
    {t:'Vias aéreas (CBMPR, PDF)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/Viasaereas.pdf'},
    {t:'RCP (CBMPR, PDF)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/rcp.pdf'},
    {t:'Hemorragia e choque (CBMPR, PDF)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/HemorragiaeChoque.pdf'},
    {t:'Ferimentos, curativos e bandagens (CBMPR, PDF)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/FerimentosCurativoseBandagens.pdf'},
    {t:'Crise convulsiva (CBMPR, PDF)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/Convulsao.pdf'},
    {t:'Lesões por eletricidade (CBMPR, PDF)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/Eletricidade.pdf'},
    {t:'Emergências clínicas (CBMPR, PDF)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/EmergenciasClinicas.pdf'}],
  scip:[
    {t:'Lei estadual 19.449/2018: texto oficial',u:'https://www.legislacao.pr.gov.br/legislacao/listarAtosAno.do?action=exibir&codAto=195736&indice=8&totalRegistros=400&anoSpan=2019&anoSelecionado=2018&mesSelecionado=0&isPaginado=true'},
    {t:'Decreto estadual 11.868/2018: texto oficial',u:'https://www.legislacao.pr.gov.br/legislacao/pesquisarAto.do?action=exibir&codAto=212032&indice=1&totalRegistros=1&dt=12.1.2019.14.7.40.190'},
    {t:'CSCIP: Código de Segurança Contra Incêndio e Pânico (CBMPR, PDF)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2023-03/cscip_-_codigo_de_seguranca_contra_incendio_e_panico_-_versao_final_agosto_de_2023.pdf'},
    {t:'NPA 001: vistoria, licenciamento e fiscalização (CBMPR, 2026)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2026-04/npa001_portaria199.pdf'},
    {t:'Todas as normas de prevenção (NPTs e NPAs) do CBMPR',u:'https://www.bombeiros.pr.gov.br/PrevFogo/Pagina/Legislacao-de-Prevencao-e-Combate-Incendios-e-Desastres'}],
  comb:[
    {t:'NPT 003: Terminologia de segurança contra incêndio (CBMPR)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2026-08/npt-003-terminologia_de_seguranca_contra_incendio-versao_2014.pdf'},
    {t:'NPT 021: Sistema de proteção por extintores (CBMPR)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/NPT_021.pdf'},
    {t:'NPT 022: Hidrantes e mangotinhos (CBMPR)',u:'https://www.bombeiros.pr.gov.br/sites/bombeiros/arquivos_restritos/files/documento/2018-12/NPT_022.pdf'}],
  hist:[
    {t:'Raízes Paranaenses: a emancipação (Arquivo Público do PR, PDF)',u:'https://www.administracao.pr.gov.br/sites/default/arquivos_restritos/files/documento/2025-12/raizes_emancipacao.pdf'},
    {t:'A criação da Província do Paraná (Revista de Informação Legislativa do Senado, PDF)',u:'https://www12.senado.leg.br/ril/edicoes/42/166/ril_v42_n166_p41.pdf'},
    {t:'Emancipação política do Paraná (Agência Estadual de Notícias)',u:'https://www.parana.pr.gov.br/aen/Noticia/Estado-do-Parana-completa-nesta-quinta-feira-171-anos-de-emancipacao-politica'},
    {t:'Histórico do Corpo de Bombeiros do Paraná (CBMPR)',u:'https://www.bombeiros.pr.gov.br/Pagina/Historico-do-Corpo-de-Bombeiros-Militar-do-Parana'}]
};
/* Resumos escritos para os tópicos mais difíceis de achar material bom (Victor pediu isso especificamente) */
const CONTENT = {
  'hist-ocup':'Antes da chegada europeia, o território paranaense era ocupado pelos Guarani (litoral e áreas de araucária) e pelos Kaingang (planalto). A ocupação portuguesa começou pelo litoral no século XVII, atraída pelo ouro de aluvião de Paranaguá (1648) e depois de Curitiba. Esgotado o ouro no século XVIII, os povoadores migraram para o planalto e viveram de gado e agricultura de subsistência. O eixo dos Campos Gerais (região de Ponta Grossa) foi o principal vetor de povoamento no século XIX, reforçado por imigrantes europeus (alemães, italianos, poloneses, ucranianos). No século XX, duas frentes completaram a ocupação: a cafeeira, vinda de São Paulo, no Norte (Londrina, Maringá); e a colonizadora, vinda do Rio Grande do Sul e Santa Catarina, no Oeste e Sudoeste.',
  'hist-ciclos':'Guarde a ordem: ouro → tropeirismo/erva-mate → madeira → café. 1) Ouro (séc. XVII-XVIII): extração em Paranaguá e no planalto de Curitiba, primeiro impulso povoador. 2) Tropeirismo e erva-mate (séc. XVIII-XIX): tropas de gado vindas do Sul cruzavam o estado rumo a Sorocaba (SP) pelo Caminho das Tropas, fixando os pousos que viraram cidades dos Campos Gerais; a erva-mate nativa virou o principal produto de exportação do Paraná no século XIX. 3) Madeira (fim do séc. XIX a meados do XX): exploração da araucária, ligada à expansão ferroviária. 4) Café (séc. XX): avançou do Norte vindo de São Paulo, e fez o Paraná ser o maior produtor nacional nas décadas de 1950-60, até a geada negra de 1975 devastar os cafezais e acelerar a virada para a soja.',
  'hist-emanc':'Até 1853, o território paranaense era a Comarca de Curitiba, parte da Província de São Paulo. Um movimento separatista, liderado por lideranças de Curitiba e dos Campos Gerais que reivindicavam mais autonomia e investimento, ganhou força a partir de 1840. A Lei Imperial nº 704, de 29 de agosto de 1853, desmembrou a Comarca de São Paulo e criou a Província do Paraná. Zacarias de Góis e Vasconcelos foi o primeiro presidente da província, empossado em Curitiba em 19 de dezembro de 1853 — data celebrada até hoje como o Dia do Paraná.',
  'geo-ocup':'A ocupação territorial do Paraná seguiu os mesmos ciclos econômicos que moldaram sua história: começou no litoral e no planalto de Curitiba com o ouro, avançou pelos Campos Gerais com o tropeirismo e a erva-mate, e só no século XX se completou com a ocupação do Norte (frente cafeeira vinda de São Paulo, com cidades planejadas como Londrina e Maringá) e do Oeste/Sudoeste (colonização vinda do Rio Grande do Sul e Santa Catarina). Esse duplo movimento — paulista no Norte, sulista no Oeste — explica diferenças culturais e econômicas que existem até hoje entre as regiões do estado.',
  'geo-ciclos':'Do ponto de vista espacial, os ciclos econômicos (veja em História do Paraná) explicam a regionalização do estado até hoje: o Sul e o Leste concentraram erva-mate e madeira; o Norte, café; o Oeste e o Sudoeste, a agricultura da colonização gaúcha-catarinense. É essa lógica histórica que organiza a divisão regional do Paraná cobrada em questões de geografia.',
  'geo-povos':'O Paraná tem povos indígenas Guarani e Kaingang, com terras demarcadas no litoral, no centro-sul e no oeste do estado. Há comunidades quilombolas reconhecidas principalmente no Vale do Ribeira (divisa com São Paulo) e em municípios do litoral. As comunidades tradicionais incluem os caiçaras do litoral (pesca artesanal) e os ribeirinhos ao longo de rios como o Ivaí e o Paraná.',
  'scip-lei':'A Lei Estadual 19.449/2018 regula o poder de polícia administrativa do Corpo de Bombeiros Militar e fixa normas gerais de prevenção e combate a incêndio e a desastres. Foi ela que deu ao CBMPR papel fiscalizador: analisar projetos, vistoriar, licenciar e punir irregularidades em edificações, estabelecimentos, áreas de risco e eventos temporários. Atenção: a lei foi alterada pela Lei 22.367/2025, em vigor desde abril de 2026, e os procedimentos de vistoria e licenciamento foram atualizados na NPA 001 (2026). Estude pelo texto oficial e confira na NPA 001 as siglas dos certificados (CVCB, CLCB), porque é aí que a banca costuma pegar.',
  'scip-dec':'O Decreto Estadual 11.868/2018 regulamenta a Lei 19.449/2018: detalha como o CBMPR exerce o poder de polícia (fiscalização, sanções) e disciplina o Termo de Compromisso de Ajustamento de Conduta (TCAC), usado para o responsável regularizar o imóvel dentro de um cronograma acordado. Se a questão fala em procedimento, prazo ou TCAC, pense no Decreto; se fala em competência e normas gerais, pense na Lei.',
  'leg-pnspds':'A Lei 13.675/2018 cria o Susp (Sistema Único de Segurança Pública) e a PNSPDS, reunindo União, Estados, DF e Municípios num esforço coordenado. Fixa princípios como uso comedido e proporcional da força e respeito aos direitos humanos, e lista quem compõe o Susp: polícias federais, civis e militares, corpos de bombeiros militares, guardas municipais, entre outros.',
  'leg-lonpm':'A Lei 14.751/2023 é a norma geral federal que todo estado deve seguir ao organizar sua PM e seu Corpo de Bombeiros. Define que são forças auxiliares e reserva do Exército, organizadas por hierarquia e disciplina militares, comandadas por um oficial da ativa do último posto. O detalhamento de carreira e disciplina fica com a lei de cada estado — no Paraná, a Lei 22.206/2024 e o Código da PMPR (Lei 1.943/1954).',
  'leg-pnpdec':'A Lei 12.608/2012 institui a Política Nacional de Proteção e Defesa Civil, com foco em prevenir desastres, não só responder a eles. Criou o cadastro de municípios com áreas suscetíveis a desastres e reforçou o papel de União, Estados e Municípios na gestão de risco — tema direto para quem vai atuar em enchentes e deslizamentos no Paraná.',
  'leg-mariapenha':'A Lei 11.340/2006 cria mecanismos para coibir a violência doméstica e familiar contra a mulher, prevê medidas protetivas de urgência e criou os Juizados de Violência Doméstica. O ponto mais cobrado costuma ser reconhecer os tipos de violência: física, psicológica, sexual, patrimonial e moral.',
  'apub-lic':'A Lei 14.133/2021 é a Lei de Licitações e Contratos vigente. Modalidades: pregão (bens e serviços comuns), concorrência (demais casos, inclusive obras), concurso (trabalhos técnicos/científicos/artísticos), leilão (venda de bens) e diálogo competitivo (soluções inovadoras). Contratação direta se divide em dispensa (a lei permite não licitar, ex.: valor baixo, emergência) e inexigibilidade (é impossível ter competição, ex.: fornecedor exclusivo). O Sistema de Registro de Preços registra preços para contratações futuras sem repetir a licitação inteira.'
};
/* Baralhos de flashcards pré-montados para os pontos que Victor mais falou travar */
const FLASHCARDS = {
  'qui-org':[['Hidrocarboneto só com C e H, ligações simples','Alcano (ex.: metano, CH4)'],['Hidrocarboneto com uma dupla C=C','Alceno (ex.: eteno)'],
    ['Hidrocarboneto com uma tripla C≡C','Alcino (ex.: etino)'],['-OH ligado a carbono saturado','Álcool'],['-OH ligado direto ao anel aromático','Fenol'],
    ['-O- entre dois carbonos','Éter'],['Grupo -COOH','Ácido carboxílico'],['Grupo -COO- entre dois radicais','Éster'],
    ['Carbonila (C=O) no meio da cadeia','Cetona'],['Carbonila (C=O) na ponta da cadeia','Aldeído'],['Grupo -NH2 ligado a carbono','Amina'],['Grupo -CONH2','Amida']],
  'qui-inorg':[['Libera H+ em água','Ácido (ex.: HCl)'],['Libera OH- em água','Base/hidróxido (ex.: NaOH)'],
    ['Produto de ácido + base (+ água)','Sal — reação de neutralização'],['Composto binário com oxigênio','Óxido (ex.: CO2, CaO)'],
    ['Óxido que forma ácido com água','Óxido ácido (CO2 → H2CO3)'],['Óxido que forma base com água','Óxido básico (CaO → Ca(OH)2)'],
    ['Ácido sem oxigênio termina em','"ídrico" (HCl = ác. clorídrico)'],['Ácido com oxigênio (forma comum) termina em','"ico" (H2SO4 = ác. sulfúrico)'],
    ['Ânion do ácido "ico" termina em','"ato" (sulfúrico → sulfato)'],['Ânion do ácido "oso" termina em','"ito" (sulfuroso → sulfito)']],
  'hist-ocup':[['1º produto que atraiu povoadores ao litoral do PR','Ouro de aluvião, em Paranaguá (1648)'],['Povo indígena do litoral e da araucária','Guarani'],
    ['Povo indígena do planalto paranaense','Kaingang'],['Região que virou eixo do tropeirismo no séc. XIX','Campos Gerais (Ponta Grossa)'],
    ['Frente de ocupação vinda de SP no séc. XX','Frente cafeeira, ocupou o Norte'],['Frente de ocupação vinda do RS/SC no séc. XX','Colonização, ocupou o Oeste/Sudoeste']],
  'hist-ciclos':[['1º ciclo econômico do Paraná','Ouro (séc. XVII-XVIII)'],['2º ciclo, ligado ao gado rumo a Sorocaba','Tropeirismo'],
    ['Produto nativo que virou o negócio do séc. XIX','Erva-mate'],['Ciclo da araucária (fim XIX a meados XX)','Madeira (pinho)'],
    ['Ciclo do séc. XX que fez o PR ser líder nacional','Café'],['Evento de 1975 que destruiu os cafezais','Geada negra']],
  'hist-emanc':[['De que província o PR se separou em 1853?','São Paulo (era a Comarca de Curitiba)'],['Lei e ano da criação da Província do Paraná','Lei nº 704, de 29 de agosto de 1853'],
    ['1º presidente da Província do Paraná','Zacarias de Góis e Vasconcelos'],['Data comemorada como Dia do Paraná','19 de dezembro (posse do 1º presidente, 1853)']],
  'fis-cin':[['Velocidade no MU','v = ΔS / Δt'],['Posição no MUV','S = S0 + v0·t + a·t²/2'],['Torricelli (sem usar o tempo)','v² = v0² + 2·a·ΔS'],['Aceleração','a = Δv / Δt']],
  'fis-din':[['2ª Lei de Newton','F = m · a'],['Força de atrito','Fat = μ · N'],['Peso de um corpo','P = m · g'],['3ª Lei de Newton','Ação e reação: forças iguais, sentido oposto, em corpos diferentes']],
  'fis-ene':[['Trabalho de uma força','τ = F · d · cos θ'],['Energia cinética','Ec = m·v² / 2'],['Energia potencial gravitacional','Ep = m·g·h'],['Potência','Pot = τ / t']],
  'fis-hid':[['Pressão','P = F / A'],['Empuxo (Arquimedes)','E = ρ(líquido) · V(deslocado) · g'],['Pressão hidrostática','P = ρ · g · h']],
  'fis-term':[['Calor sensível','Q = m · c · ΔT'],['Dilatação linear','ΔL = L0 · α · ΔT'],['Celsius para Kelvin','K = °C + 273']],
  'fis-eldin':[['1ª Lei de Ohm','V = R · i'],['Potência elétrica','Pot = V · i'],['Resistores em série','Req = R1 + R2 + ...']],
  'comb-tetra':[['Os 4 elementos do tetraedro do fogo','Combustível, comburente (oxigênio), calor e reação em cadeia'],['Condução','Calor passa pelo contato, de molécula a molécula'],
    ['Convecção','Calor levado por massas de ar ou gases aquecidos'],['Irradiação','Calor transmitido por ondas, sem precisar de meio material'],['Comburente mais comum','Oxigênio do ar']],
  'comb-cla':[['Classe A','Sólidos que queimam em superfície e profundidade e deixam resíduo'],['Classe B','Líquidos e gases inflamáveis, queimam só na superfície'],
    ['Classe C','Equipamentos elétricos energizados'],['Classe D','Metais pirofóricos (magnésio, titânio, sódio)'],['Classe K','Óleos e gorduras de cozinha'],
    ['Resfriamento','Retira o calor'],['Abafamento','Retira ou reduz o oxigênio'],['Isolamento','Retira o material combustível'],['Extinção química','Quebra a reação em cadeia']],
  'comb-ext':[['Extintor de água','Classe A'],['Extintor de espuma','Classes A e B'],['Extintor de CO2','Classes B e C (gás, não deixa resíduo)'],
    ['Pó químico BC','Classes B e C (pó, deixa resíduo)'],['Pó químico ABC','Classes A, B e C'],['Nunca use água em','Classe C energizada e classe D']],
  'ps-aval':[['X do XABCDE','Hemorragia exsanguinante: conter primeiro'],['A do XABCDE','Vias aéreas com proteção da coluna cervical'],['B do XABCDE','Respiração e ventilação'],
    ['C do XABCDE','Circulação e controle de hemorragias'],['D do XABCDE','Disfunção neurológica (nível de consciência)'],['E do XABCDE','Exposição da vítima e prevenção de hipotermia']],
  'ps-rcp':[['Frequência das compressões no adulto','100 a 120 por minuto'],['Profundidade das compressões no adulto','5 a 6 cm'],
    ['Compressão/ventilação no adulto, sem via aérea avançada','30:2'],['Onde posicionar as mãos','Centro do tórax, metade inferior do esterno'],
    ['Antes de tocar numa vítima caída','Garantir a segurança da cena']],
  'ing-voc':[['actually','na verdade (não é "atualmente")'],['pretend','fingir (não é "pretender")'],['push','empurrar (não é "puxar")'],['library','biblioteca (não é "livraria")'],
    ['parents','pais (não é "parentes")'],['college','faculdade (não é "colégio")'],['fabric','tecido (não é "fábrica")'],['exit','saída (não é "êxito")']],
  'port-reg':[['Crase antes de palavra masculina','Não ocorre (exceto com "à moda de" subentendido)'],['Crase antes de verbo','Nunca ocorre'],['Crase em "às 8 horas"','Ocorre: hora determinada'],
    ['Crase antes de "ela" ou "você"','Não ocorre (pronome que não aceita artigo)'],['"Assistir" no sentido de ver','Pede "a": assisti ao filme'],['"Obedecer"','Pede "a": obedecer ao regulamento']]
};
/* Patentes do CBMPR usadas como níveis de progresso (gamificação temática) */
const PATENTES = ['Recruta','Cadete de 1º ano','Cadete de 2º ano','Aspirante-a-Oficial','2º Tenente','1º Tenente','Capitão'];
/* Fatos para o jogo Linha do tempo (história do Paraná com marcos do Brasil como referência) */
const TIMELINE = [
  {k:1648,d:'1648',t:'Paranaguá é elevada à condição de vila'},
  {k:1693,d:'1693',t:'Curitiba é elevada à condição de vila'},
  {k:1812,d:'1812',t:'A sede da comarca passa para Curitiba'},
  {k:1822,d:'1822',t:'Independência do Brasil'},
  {k:1842,d:'1842',t:'Curitiba é elevada à categoria de cidade'},
  {k:1853.6,d:'29/08/1853',t:'Lei Imperial nº 704 cria a Província do Paraná'},
  {k:1853.9,d:'19/12/1853',t:'Posse de Zacarias de Góis e Vasconcelos, 1º presidente da província'},
  {k:1885,d:'1885',t:'Inaugurada a ferrovia Paranaguá–Curitiba'},
  {k:1889,d:'1889',t:'Proclamação da República'},
  {k:1912,d:'1912',t:'Começa a Guerra do Contestado'},
  {k:1916,d:'1916',t:'Fim do Contestado e acordo de limites entre Paraná e Santa Catarina'},
  {k:1975,d:'1975',t:'Geada negra destrói os cafezais do Norte do Paraná'}
];
/* Complete a frase: história do Paraná, uma ideia por vez */
const CLOZE_HIST=[
  {t:'Antes da chegada europeia, o litoral e as áreas de araucária do Paraná eram ocupados pelos ___.',o:['Guarani','Tupinambá','Kaingang'],r:0},
  {t:'O povo indígena do planalto paranaense era o ___.',o:['Guarani','Kaingang','Xokleng'],r:1},
  {t:'O primeiro produto que atraiu povoadores ao litoral do Paraná, no século XVII, foi o ___.',o:['café','ouro','gado'],r:1},
  {t:'No século XIX, o eixo dos ___ virou o principal vetor de povoamento do planalto paranaense.',o:['Campos Gerais','Cerrados','Pampas'],r:0},
  {t:'O tropeirismo levava gado do Rio Grande do Sul até as feiras de ___, em São Paulo.',o:['Sorocaba','Campinas','Santos'],r:0},
  {t:'No século XIX, o principal produto de exportação do Paraná era a ___.',o:['soja','erva-mate','madeira'],r:1},
  {t:'O Paraná era, até 1853, a Comarca de Curitiba, parte da província de ___.',o:['Santa Catarina','São Paulo','Rio Grande do Sul'],r:1},
  {t:'A Província do Paraná foi criada pela Lei Imperial nº 704, de 29 de agosto de ___.',o:['1822','1853','1889'],r:1},
  {t:'O primeiro presidente da província do Paraná foi ___.',o:['Zacarias de Góis e Vasconcelos','Dom Pedro II','Rui Barbosa'],r:0},
  {t:'A posse do primeiro presidente, em 19 de dezembro de 1853, é celebrada até hoje como o ___.',o:['Dia do Paraná','Dia da Erva-mate','Dia do Tropeiro'],r:0},
  {t:'No fim do século XIX, imigrantes ___ passaram a colonizar Curitiba e arredores.',o:['árabes e japoneses','alemães, italianos e poloneses','chineses e coreanos'],r:1},
  {t:'A Guerra do Contestado (1912-1916) aconteceu numa região disputada por Paraná e ___.',o:['São Paulo','Santa Catarina','Mato Grosso'],r:1},
  {t:'Mais do que uma briga de fronteira, a Guerra do Contestado foi um conflito social de ___, com forte componente messiânico.',o:['caboclos sertanejos','imigrantes europeus','tropeiros gaúchos'],r:0},
  {t:'O Acordo de Limites de 1916, que encerrou a disputa entre Paraná e Santa Catarina, foi mediado pelo presidente ___.',o:['Venceslau Brás','Getúlio Vargas','Rodrigues Alves'],r:0},
  {t:'No século XX, a frente ___, vinda de São Paulo, ocupou o Norte do Paraná com o café.',o:['cafeeira','madeireira','pecuarista'],r:0},
  {t:'O Oeste e o Sudoeste do Paraná foram colonizados por gente vinda do Rio Grande do Sul e de ___.',o:['Minas Gerais','Santa Catarina','Bahia'],r:1},
  {t:'Em 1975, a ___ destruiu boa parte dos cafezais do Norte do Paraná.',o:['seca','geada negra','praga do café'],r:1},
  {t:'O CBMPR deixou de ser parte da PMPR e virou corporação autônoma em ___.',o:['dezembro de 2022','janeiro de 2018','março de 2025'],r:0}
];
/* Mapa dos Ciclos: jogo espacial (esquemático, sem escala real) */
const CICLOMAPA=[
  {zone:'norte',q:'Onde ficava o ciclo do café, com cidades novas como Londrina e Maringá?'},
  {zone:'litoral',q:'Onde foi extraído o ouro que atraiu os primeiros povoadores, no século XVII?'},
  {zone:'planalto',q:'Onde ficam os Campos Gerais, berço do tropeirismo e da erva-mate?'},
  {zone:'oeste',q:'Para onde foi a colonização vinda do Rio Grande do Sul e de Santa Catarina?'},
  {zone:'sudoeste',q:'Onde aconteceu a Guerra do Contestado (1912-1916)?'}
];
const ZONE_INFO={
  norte:{nome:'Norte',cor:'Café, colonização paulista, Londrina e Maringá (século XX)'},
  litoral:{nome:'Litoral',cor:'Ouro (século XVII) e porto de Paranaguá'},
  planalto:{nome:'Planalto de Curitiba',cor:'Tropeirismo e erva-mate (séculos XVIII-XIX)'},
  oeste:{nome:'Oeste',cor:'Colonização gaúcha e catarinense (século XX)'},
  sudoeste:{nome:'Sudoeste',cor:'Guerra do Contestado (1912-1916)'}
};
/* Verdadeiro ou falso: história do Paraná */
const VF_HIST=[
  {s:'O Paraná se separou de São Paulo em 1853.',v:true},
  {s:'O Paraná se separou do Rio Grande do Sul em 1853.',v:false},
  {s:'Zacarias de Góis e Vasconcelos foi o primeiro presidente da província do Paraná.',v:true},
  {s:'A capital da nova província foi definida em Paranaguá.',v:false},
  {s:'A Guerra do Contestado aconteceu entre 1912 e 1916.',v:true},
  {s:'A Guerra do Contestado foi, sobretudo, um conflito social de caboclos numa área disputada por Paraná e Santa Catarina.',v:true},
  {s:'A disputa de limites do Contestado terminou com um acordo assinado em 1916, mediado pelo presidente Venceslau Brás.',v:true},
  {s:'A Guerra do Contestado terminou com vitória do Paraná sobre o território disputado.',v:false},
  {s:'O ciclo do tropeirismo ligava o Rio Grande do Sul às feiras de Sorocaba, em São Paulo.',v:true},
  {s:'A erva-mate foi o principal produto de exportação do Paraná no século XIX.',v:true},
  {s:'O café chegou ao Paraná vindo do Rio Grande do Sul.',v:false},
  {s:'A geada negra de 1975 destruiu boa parte dos cafezais do Norte do Paraná.',v:true},
  {s:'Curitiba foi fundada no século XIX.',v:false},
  {s:'O CBMPR se desvinculou da PMPR em dezembro de 2022.',v:true},
  {s:'Os Guarani ocupavam principalmente o litoral e as áreas de araucária do Paraná.',v:true},
  {s:'Os Kaingang ocupavam o planalto paranaense.',v:true},
  {s:'A colonização do Oeste e do Sudoeste do Paraná veio principalmente de Minas Gerais.',v:false}
];
const TEMAS = [
  'Prevenção de afogamentos em rios, lagos e no litoral do Paraná',
  'Incêndios florestais em tempos de mudanças climáticas',
  'A cultura de prevenção contra incêndio em edificações',
  'O papel da Defesa Civil diante de eventos climáticos extremos',
  'Trotes e uso indevido do telefone de emergência 193',
  'O ensino de primeiros socorros nas escolas',
  'A saúde mental dos profissionais de emergência',
  'Segurança em eventos com grande concentração de público',
  'Tecnologia a serviço das operações de busca e salvamento',
  'Participação comunitária na resposta a desastres',
  'Evacuação de pessoas com deficiência em situações de emergência',
  'Acidentes domésticos com crianças: como prevenir'
];
const FLASHCARDS2 = {

/* ---------------- PORTUGUÊS: 10 tópicos que ainda não tinham baralho ---------------- */
'port-int':[
 ['Onde costuma estar a ideia principal de um parágrafo','No primeiro período (tópico frasal) ou no último, fechando a ideia'],
 ['O que é uma inferência','Uma conclusão que o texto sugere, sem dizer com todas as letras'],
 ['Como diferenciar fato de opinião','Fato se comprova; opinião expressa julgamento (verbos como "acho", "acredito", adjetivos de valor)'],
 ['O que sinaliza um conectivo como "mas", "porém", "contudo"','Uma oposição; o que vem depois costuma ser o ponto mais importante da frase'],
 ['O que sinaliza um conectivo como "portanto", "logo", "assim"','Uma conclusão do que foi dito antes'],
 ['O que é ironia num texto','Dizer o contrário do que se quer dizer, geralmente para criticar'],
 ['O que é ambiguidade','Uma frase com mais de um sentido possível — clássica pegadinha de prova'],
 ['O que é pleonasmo vicioso','Repetir a mesma ideia com palavras diferentes sem necessidade, como "subir para cima"']],
'port-gen':[
 ['Narração','Conta uma história com personagens, tempo e espaço'],
 ['Descrição','Detalha características de algo ou alguém, sem ação'],
 ['Dissertação argumentativa','Defende um ponto de vista com argumentos'],
 ['Exposição','Explica um assunto sem defender opinião, como um verbete ou artigo científico'],
 ['Injunção','Dá instruções, com verbos no imperativo, como receita ou manual'],
 ['Editorial','Gênero opinativo de jornal que mostra a posição do veículo'],
 ['Crônica','Narra o cotidiano com um olhar pessoal e leve'],
 ['Resenha','Resume e avalia uma obra, como um livro ou filme']],
'port-coe':[
 ['Coesão','A ligação gramatical entre as partes do texto, feita por conectivos e pronomes'],
 ['Coerência','A lógica do sentido do texto como um todo'],
 ['Anáfora','Retomar um termo já citado antes no texto'],
 ['Catáfora','Antecipar um termo que só vai aparecer depois no texto'],
 ['Elipse','Omissão de um termo que o contexto permite recuperar'],
 ['Conectivo de adição','E, além disso, também'],
 ['Conectivo de causa','Porque, já que, visto que'],
 ['Conectivo de finalidade','Para que, a fim de que']],
'port-ort':[
 ['Por que (separado, sem acento)','Em perguntas diretas ou indiretas: "Por que você faltou?"'],
 ['Por quê (separado, com acento)','No final da frase: "Faltou por quê?"'],
 ['Porque (junto)','Em resposta ou explicação: "Faltei porque chovia."'],
 ['Porquê (junto, com acento)','É substantivo, vem com artigo: "Não sei o porquê."'],
 ['Mal x mau','"Mal" é advérbio (oposto de bem) ou substantivo; "mau" é adjetivo (oposto de bom)'],
 ['Onde x aonde','"Onde" indica lugar fixo; "aonde" indica movimento, com verbos de ir'],
 ['Ao encontro de x de encontro a','"Ao encontro de" é a favor; "de encontro a" é contra, colisão'],
 ['Regra do hiato (acentuação)','Acentua-se i/u tônicos sozinhos na sílaba, como em saída e baú']],
'port-cla':[
 ['Substantivo','Nomeia seres, objetos, sentimentos ou ações abstratas'],
 ['Adjetivo','Caracteriza o substantivo'],
 ['Advérbio','Modifica um verbo, um adjetivo ou outro advérbio (tempo, modo, lugar, intensidade)'],
 ['Pronome relativo','Retoma um termo anterior e inicia uma oração adjetiva (que, o qual, cujo)'],
 ['Pronome "cujo"','Indica posse e concorda com a coisa possuída, sem artigo depois'],
 ['Conjunção subordinativa','Liga uma oração que depende da outra (que, se, embora, porque)'],
 ['Preposição','Liga termos indicando uma relação entre eles (de, em, para, com)'],
 ['Interjeição','Expressa emoção, isolada na frase, como "ah!" ou "socorro!"']],
'port-sint':[
 ['Sujeito','Quem pratica ou sofre a ação verbal'],
 ['Predicado','Tudo o que se diz sobre o sujeito'],
 ['Objeto direto','Completa o sentido do verbo sem preposição'],
 ['Objeto indireto','Completa o sentido do verbo com preposição obrigatória'],
 ['Predicativo do sujeito','Qualidade atribuída ao sujeito por um verbo de ligação'],
 ['Adjunto adnominal','Termo que caracteriza um substantivo: artigo, adjetivo, pronome'],
 ['Adjunto adverbial','Indica uma circunstância (tempo, lugar, modo) e não é exigido pelo verbo'],
 ['Aposto','Explica ou especifica um termo, geralmente entre vírgulas'],
 ['Vocativo','Chama ou invoca alguém, isolado por vírgula']],
'port-conc':[
 ['Sujeito composto anteposto ao verbo','O verbo concorda no plural'],
 ['Sujeito composto posposto ao verbo','O verbo pode concordar com o núcleo mais próximo ou com o total'],
 ['Verbo "haver" no sentido de existir','É impessoal: fica sempre no singular'],
 ['Verbo "fazer" indicando tempo decorrido','É impessoal: fica sempre no singular'],
 ['"A gente"','Concorda com o verbo na 3ª pessoa do singular'],
 ['Coletivo no singular + adjunto no plural','O verbo pode ir no singular ou no plural ("a maioria dos alunos foi/foram")'],
 ['"Um dos que" + verbo','A oração adjetiva tende ao plural, concordando com o antecedente']],
'port-col':[
 ['Próclise','O pronome oblíquo vem antes do verbo'],
 ['Ênclise','O pronome oblíquo vem depois do verbo'],
 ['Mesóclise','O pronome vem no meio do verbo, só no futuro do presente ou do pretérito, sem palavra atrativa'],
 ['Palavra negativa antes do verbo','Atrai o pronome para próclise: "não me diga"'],
 ['Início de frase com pronome oblíquo átono','Não é aceito pela norma-padrão: usa-se ênclise'],
 ['Conjunção subordinativa antes do verbo','Atrai o pronome para próclise'],
 ['Pronome relativo antes do verbo','Atrai o pronome para próclise']],
'port-sem':[
 ['Sinônimo','Palavra com sentido igual ou parecido a outra'],
 ['Antônimo','Palavra com sentido oposto a outra'],
 ['Homônimo','Mesma grafia ou som, sentido diferente (são = saudável / são = santo)'],
 ['Parônimo','Grafia e som parecidos, sentido diferente (comprimento x cumprimento)'],
 ['Polissemia','Uma palavra com vários sentidos, conforme o contexto'],
 ['Denotação','Sentido literal, real, da palavra'],
 ['Conotação','Sentido figurado, simbólico, da palavra']],
'port-pont':[
 ['Vírgula entre sujeito e verbo','Nunca ocorre na norma-padrão'],
 ['Vírgula e o aposto explicativo','O aposto explicativo vem isolado por vírgulas'],
 ['Vírgula e o vocativo','O vocativo vem isolado por vírgula'],
 ['Vírgula numa enumeração','Separa os itens da lista'],
 ['Quando usar ponto e vírgula','Para separar orações coordenadas mais longas, ou itens de lista que já têm vírgula interna'],
 ['Quando usar dois-pontos','Para anunciar uma enumeração, uma explicação ou uma citação direta'],
 ['Vírgula e oração adjetiva','A explicativa vem com vírgula; a restritiva não leva vírgula'],
 ['Adjunto adverbial deslocado para o início da frase','Costuma vir seguido de vírgula']],

/* ---------------- MATEMÁTICA: os 15 tópicos, nenhum tinha baralho ---------------- */
'mat-ops':[
 ['Multiplicação de potências de mesma base','Soma os expoentes'],
 ['Divisão de potências de mesma base','Subtrai os expoentes'],
 ['Potência de potência','Multiplica os expoentes'],
 ['Expoente negativo','Inverte a base ou a fração: a⁻ⁿ = 1/aⁿ'],
 ['Expoente zero (base diferente de zero)','O resultado é sempre 1'],
 ['Raiz como potência fracionária','ⁿ√a é o mesmo que a elevado a 1/n'],
 ['Soma de frações com denominadores diferentes','Tira o MMC dos denominadores antes de somar'],
 ['Multiplicação de frações','Multiplica numerador com numerador e denominador com denominador']],
'mat-prop':[
 ['Razão','Comparação entre duas grandezas por divisão, a/b'],
 ['Proporção','Igualdade entre duas razões'],
 ['Propriedade fundamental das proporções','O produto dos meios é igual ao produto dos extremos'],
 ['Regra de três simples direta','As grandezas crescem juntas; multiplica em cruz na mesma direção'],
 ['Regra de três simples inversa','Uma grandeza cresce e a outra diminui; inverte uma razão antes de multiplicar'],
 ['Regra de três composta','Envolve três ou mais grandezas relacionadas ao mesmo tempo'],
 ['Divisão proporcional','Dividir um total respeitando uma razão dada entre as partes']],
'mat-porc':[
 ['Porcentagem','É uma fração de denominador 100'],
 ['Fator de aumento de i%','Multiplica o valor por (1 + i/100)'],
 ['Fator de desconto de i%','Multiplica o valor por (1 − i/100)'],
 ['Aumentos sucessivos','Os fatores se multiplicam entre si, nunca se somam direto'],
 ['Juro simples','J = C × i × t (capital vezes taxa vezes tempo)'],
 ['Juro composto','M = C × (1 + i) elevado a t'],
 ['Achar o total quando se sabe uma parte em %','Total = parte ÷ (porcentagem/100)']],
'mat-eq':[
 ['Equação do 1º grau: ax + b = 0','x = −b/a'],
 ['Soma das raízes de ax²+bx+c=0','S = −b/a'],
 ['Produto das raízes de ax²+bx+c=0','P = c/a'],
 ['Discriminante (Δ) maior que zero','A equação tem duas raízes reais diferentes'],
 ['Discriminante (Δ) igual a zero','A equação tem uma raiz real dupla'],
 ['Discriminante (Δ) menor que zero','A equação não tem raiz real'],
 ['Fórmula de Bhaskara','x = (−b ± raiz de Δ) ÷ 2a'],
 ['Multiplicar uma inequação por número negativo','Inverte o sinal da desigualdade']],
'mat-fun':[
 ['Função afim','f(x) = ax + b; o gráfico é uma reta'],
 ['Coeficiente "a" na função afim','A inclinação da reta: positivo é crescente, negativo é decrescente'],
 ['Coeficiente "b" na função afim','Onde a reta corta o eixo y'],
 ['Função quadrática','f(x) = ax² + bx + c; o gráfico é uma parábola'],
 ['Concavidade da parábola','Para cima se a>0, para baixo se a<0'],
 ['x do vértice da parábola','xv = −b/2a'],
 ['y do vértice da parábola','yv = −Δ/4a'],
 ['Zero (raiz) de uma função','O valor de x onde f(x) = 0, onde o gráfico cruza o eixo x']],
'mat-exp':[
 ['Função exponencial','f(x) = aˣ, com a>0 e a diferente de 1'],
 ['Logaritmo logₐb = x','Significa que aˣ = b'],
 ['Log do produto','log(a·b) = log a + log b'],
 ['Log do quociente','log(a/b) = log a − log b'],
 ['Log de uma potência','log(aⁿ) = n·log a'],
 ['Mudança de base do logaritmo','logₐb = log b ÷ log a'],
 ['log de 1, em qualquer base','É sempre igual a 0']],
'mat-pa':[
 ['Termo geral da PA','aₙ = a₁ + (n−1)×r'],
 ['Soma dos termos de uma PA','Sₙ = n×(a₁+aₙ)/2'],
 ['Termo geral da PG','aₙ = a₁×qⁿ⁻¹'],
 ['Soma de uma PG finita','Sₙ = a₁×(qⁿ−1)/(q−1)'],
 ['Soma de uma PG infinita, com |q|<1','S = a₁/(1−q)'],
 ['Razão da PA','A diferença constante entre termos consecutivos'],
 ['Razão da PG','A razão constante entre termos consecutivos']],
'mat-comb':[
 ['Princípio fundamental da contagem','Multiplica o número de opções de cada etapa'],
 ['Permutação simples de n elementos','n! — todos os elementos, importando a ordem'],
 ['Arranjo','Escolhe e ordena p de n elementos; a ordem importa'],
 ['Combinação','Escolhe p de n elementos; a ordem não importa'],
 ['Probabilidade de um evento','Casos favoráveis dividido por casos possíveis'],
 ['Probabilidade de eventos independentes','Multiplica as probabilidades de cada um'],
 ['Probabilidade da união de dois eventos não excludentes','Soma as probabilidades e subtrai a interseção']],
'mat-est':[
 ['Média aritmética','Soma dos valores dividida pela quantidade de valores'],
 ['Mediana','O valor do meio, com os dados em ordem (ou a média dos dois centrais)'],
 ['Moda','O valor que mais se repete no conjunto'],
 ['Amplitude','O maior valor menos o menor valor do conjunto'],
 ['Desvio padrão','Mede o quanto os dados variam em torno da média']],
'mat-mtz':[
 ['Determinante de uma matriz 2×2','ad − bc'],
 ['Matriz identidade','Tem 1 na diagonal principal e 0 no resto; é o "1" da multiplicação de matrizes'],
 ['Sistema linear','Um conjunto de equações que devem ser satisfeitas ao mesmo tempo'],
 ['Sistema possível e determinado','Tem uma única solução'],
 ['Sistema possível e indeterminado','Tem infinitas soluções'],
 ['Sistema impossível','Não tem nenhuma solução']],
'mat-trig':[
 ['Seno de um ângulo','Cateto oposto dividido pela hipotenusa'],
 ['Cosseno de um ângulo','Cateto adjacente dividido pela hipotenusa'],
 ['Tangente de um ângulo','Cateto oposto dividido pelo cateto adjacente, ou seno sobre cosseno'],
 ['Relação fundamental da trigonometria','sen²x + cos²x = 1'],
 ['Lei dos senos','a/senA = b/senB = c/senC'],
 ['Lei dos cossenos','a² = b² + c² − 2bc×cosA']],
'mat-gp':[
 ['Teorema de Pitágoras','hipotenusa² = cateto² + cateto²'],
 ['Área do triângulo','(base × altura) ÷ 2'],
 ['Área do retângulo','base × altura'],
 ['Área do círculo','π × raio²'],
 ['Comprimento da circunferência','2 × π × raio'],
 ['Soma dos ângulos internos de um triângulo','180°'],
 ['Soma dos ângulos internos de um polígono de n lados','(n−2) × 180°'],
 ['Teorema de Tales','Retas paralelas cortadas por transversais formam segmentos proporcionais']],
'mat-ge':[
 ['Volume do cubo','aresta ao cubo'],
 ['Volume do paralelepípedo','comprimento × largura × altura'],
 ['Volume do cilindro','π × raio² × altura'],
 ['Volume da esfera','(4/3) × π × raio³'],
 ['Volume do cone','(1/3) × π × raio² × altura'],
 ['Área total do cubo','6 × aresta²']],
'mat-analit':[
 ['Distância entre dois pontos','Raiz de [(x2−x1)² + (y2−y1)²]'],
 ['Ponto médio de um segmento','A média das coordenadas dos dois extremos'],
 ['Coeficiente angular da reta','m = (y2−y1) ÷ (x2−x1)'],
 ['Equação reduzida da reta','y = mx + n'],
 ['Retas paralelas','Têm o mesmo coeficiente angular'],
 ['Retas perpendiculares','O produto dos coeficientes angulares é −1']],
'mat-calc':[
 ['Derivada de uma função','Mede a taxa de variação instantânea da função'],
 ['Regra da potência (derivada de xⁿ)','n × x elevado a (n−1)'],
 ['Derivada de uma constante','É sempre igual a zero'],
 ['Limite de uma função num ponto','O valor que a função se aproxima quando x se aproxima desse ponto'],
 ['Integral','A operação inversa da derivada; calcula a área sob a curva']],

/* ---------------- FÍSICA: 7 tópicos novos + reforço nos 6 que já tinham baralho ---------------- */
'fis-unid':[
 ['Unidade de força no SI','Newton (N)'],
 ['Unidade de energia e trabalho no SI','Joule (J)'],
 ['Unidade de potência no SI','Watt (W)'],
 ['Unidade de pressão no SI','Pascal (Pa)'],
 ['Notação científica','Um número entre 1 e 10 multiplicado por uma potência de 10'],
 ['Algarismos significativos','Todos os dígitos conhecidos com certeza mais o primeiro duvidoso']],
'fis-qm':[
 ['Quantidade de movimento (momento linear)','Q = massa × velocidade'],
 ['Impulso de uma força','I = força × intervalo de tempo'],
 ['Teorema do impulso','O impulso é igual à variação da quantidade de movimento'],
 ['Conservação da quantidade de movimento','Em sistema isolado, o total antes do choque é igual ao total depois'],
 ['Colisão perfeitamente elástica','Conserva a energia cinética e a quantidade de movimento'],
 ['Colisão perfeitamente inelástica','Os corpos seguem grudados, juntos, após o choque']],
'fis-tdin':[
 ['1ª Lei da Termodinâmica','A variação da energia interna é igual ao calor recebido menos o trabalho realizado pelo sistema'],
 ['Transformação isotérmica','Ocorre a temperatura constante'],
 ['Transformação isobárica','Ocorre a pressão constante'],
 ['Transformação isocórica (isovolumétrica)','Ocorre a volume constante'],
 ['2ª Lei da Termodinâmica','O calor não passa espontaneamente do corpo mais frio para o mais quente'],
 ['Máquina térmica','Transforma calor em trabalho, mas nunca com 100% de rendimento']],
'fis-ond':[
 ['Equação fundamental da ondulatória','velocidade = comprimento de onda × frequência'],
 ['Período de uma onda','O tempo de uma oscilação completa; T = 1/frequência'],
 ['Onda transversal','A vibração é perpendicular à direção de propagação, como numa corda'],
 ['Onda longitudinal','A vibração é na mesma direção da propagação, como o som'],
 ['Por onde o som não se propaga','Pelo vácuo — precisa de um meio material'],
 ['Eco','A reflexão do som percebida separadamente do som direto']],
'fis-opt':[
 ['Reflexão da luz','A luz volta ao mesmo meio; ângulo de incidência igual ao de reflexão'],
 ['Refração da luz','A luz muda de meio e de velocidade, podendo mudar de direção'],
 ['Imagem em espelho plano','Virtual, direita e do mesmo tamanho do objeto'],
 ['Lente convergente','Une os raios de luz; costuma formar imagem real'],
 ['Lente divergente','Espalha os raios de luz; forma sempre imagem virtual'],
 ['Vergência (grau dos óculos)','O inverso da distância focal, medido em dioptrias']],
'fis-elst':[
 ['Cargas de mesmo sinal','Se repelem'],
 ['Cargas de sinais opostos','Se atraem'],
 ['Lei de Coulomb','A força elétrica é proporcional ao produto das cargas e inversa ao quadrado da distância'],
 ['Condutor elétrico','Material que permite fácil circulação de cargas, como os metais'],
 ['Isolante elétrico','Material que dificulta a circulação de cargas, como a borracha']],
'fis-msolid':[
 ['Densidade','Massa dividida pelo volume'],
 ['Vazão','Volume de fluido que passa por uma seção em cada unidade de tempo'],
 ['Elasticidade','Capacidade de um corpo voltar à forma original depois que a força cessa'],
 ['Tensão mecânica','Força aplicada dividida pela área']],
'fis-cin':[
 ['Movimento Uniforme (MU)','Velocidade constante, sem aceleração'],
 ['Aceleração','A variação da velocidade dividida pelo tempo'],
 ['Gráfico posição × tempo no MU','Uma reta; a inclinação dela é a velocidade'],
 ['Gráfico velocidade × tempo','A área sob a reta é o deslocamento'],
 ['Lançamento horizontal','O movimento horizontal e a queda vertical acontecem de forma independente']],
'fis-din':[
 ['Força de atrito','F = coeficiente de atrito × força normal'],
 ['Plano inclinado','O peso se decompõe em uma parte que empurra o corpo pra baixo do plano e outra que pressiona contra ele'],
 ['Força centrípeta','Aponta sempre para o centro da trajetória, em movimento circular'],
 ['Corpo em equilíbrio','A força resultante sobre ele é nula'],
 ['Massa x peso','Massa é escalar e constante; peso é uma força e varia com a gravidade do local']],
'fis-ene':[
 ['Conservação da energia mecânica','Sem atrito, a soma de energia cinética e potencial se mantém constante'],
 ['Rendimento de uma máquina','Energia útil dividida pela energia total fornecida'],
 ['Potência média','Trabalho realizado dividido pelo tempo gasto'],
 ['Energia potencial elástica','A energia armazenada numa mola comprimida ou esticada']],
'fis-hid':[
 ['Princípio de Pascal','Um acréscimo de pressão num ponto do fluido se transmite integralmente a todo o fluido'],
 ['Empuxo','É igual ao peso do fluido deslocado pelo corpo'],
 ['Quando um corpo flutua','Quando a densidade média dele é menor que a do líquido'],
 ['Vasos comunicantes','Com um único líquido em equilíbrio, o nível é o mesmo em todos os ramos']],
'fis-term':[
 ['Conversão de Celsius para Kelvin','Soma 273 ao valor em Celsius'],
 ['Calor latente','O calor trocado numa mudança de estado, sem variar a temperatura'],
 ['Mudanças de estado da matéria','Fusão, vaporização, condensação, solidificação e sublimação'],
 ['Capacidade térmica','A quantidade de calor necessária para variar em 1°C a temperatura de todo o corpo']],
'fis-eldin':[
 ['Potência dissipada num resistor','P = resistência × corrente ao quadrado, ou P = tensão × corrente'],
 ['Energia elétrica consumida','Potência (em kW) multiplicada pelo tempo (em horas), resultando em kWh'],
 ['Resistores em paralelo','O inverso da resistência equivalente é a soma dos inversos de cada resistor'],
 ['Curto-circuito','Ocorre quando a resistência do circuito cai a praticamente zero, e a corrente dispara']],

/* ---------------- QUÍMICA: 12 tópicos que ainda não tinham baralho ---------------- */
'qui-mat':[
 ['Substância pura','Tem composição química definida e constante'],
 ['Mistura','Duas ou mais substâncias juntas, sem reação química entre elas'],
 ['Mistura homogênea','Tem uma só fase, visualmente uniforme'],
 ['Mistura heterogênea','Tem duas ou mais fases visíveis'],
 ['Filtração','Separa um sólido de um líquido usando um filtro'],
 ['Destilação','Separa líquidos com pontos de ebulição diferentes']],
'qui-atom':[
 ['Número atômico (Z)','O número de prótons do átomo'],
 ['Número de massa (A)','A soma de prótons e nêutrons'],
 ['Átomo neutro','Tem o número de prótons igual ao número de elétrons'],
 ['Isótopos','Átomos do mesmo elemento, com número de massa diferente'],
 ['Camada de valência','A última camada eletrônica, onde ocorrem as ligações químicas'],
 ['Família (grupo) da tabela periódica','Coluna vertical; elementos com propriedades químicas parecidas'],
 ['Período da tabela periódica','Linha horizontal; indica o número de camadas eletrônicas do átomo'],
 ['Como varia o raio atômico na tabela','Cresce de cima para baixo e da direita para a esquerda']],
'qui-radio':[
 ['Emissão alfa (α)','O núcleo perde 2 prótons e 2 nêutrons'],
 ['Emissão beta (β)','Um nêutron se transforma em próton; o número atômico aumenta em 1'],
 ['Emissão gama (γ)','Libera energia pura, sem mudar a massa nem o número atômico'],
 ['Meia-vida','O tempo necessário para metade dos átomos radioativos se desintegrarem'],
 ['Fissão nuclear','Um núcleo pesado se divide em núcleos menores, liberando energia'],
 ['Fusão nuclear','Núcleos leves se juntam formando um núcleo mais pesado, como no Sol']],
'qui-lig':[
 ['Ligação iônica','Transferência de elétrons, entre um metal e um ametal'],
 ['Ligação covalente','Compartilhamento de elétrons, entre ametais'],
 ['Ligação metálica','O "mar de elétrons" entre os átomos de um metal'],
 ['Regra do octeto','Os átomos tendem a ficar com 8 elétrons na camada de valência'],
 ['Ligação de hidrogênio','Uma interação forte entre H e átomos muito eletronegativos, como F, O e N'],
 ['O que define a polaridade de uma molécula','A diferença de eletronegatividade entre os átomos e a geometria da molécula']],
'qui-gas':[
 ['Lei de Boyle','A temperatura constante, o produto pressão vezes volume é constante'],
 ['Lei de Charles','A pressão constante, o volume dividido pela temperatura é constante'],
 ['Lei de Gay-Lussac','A volume constante, a pressão dividida pela temperatura é constante'],
 ['Equação de Clapeyron','PV = nRT'],
 ['Zero absoluto','0 kelvin, equivalente a −273°C, a temperatura teórica mínima']],
'qui-reac':[
 ['Lei de Lavoisier','A massa total dos reagentes é igual à massa total dos produtos'],
 ['Balancear uma equação química','Ajustar os coeficientes até igualar o número de átomos dos dois lados'],
 ['Reação de síntese','Dois ou mais reagentes formam um único produto'],
 ['Reação de decomposição','Um único reagente se quebra em dois ou mais produtos'],
 ['Reação de simples troca','Um elemento troca de lugar com outro dentro de um composto'],
 ['Reação de dupla troca','Dois compostos trocam íons entre si']],
'qui-sol':[
 ['Soluto','O que é dissolvido numa solução, geralmente em menor quantidade'],
 ['Solvente','O que dissolve o soluto, geralmente em maior quantidade'],
 ['Concentração comum','Massa do soluto dividida pelo volume da solução, em g/L'],
 ['Molaridade','Número de mols do soluto dividido pelo volume da solução em litros'],
 ['Solução saturada','Atingiu o limite de soluto que se dissolve naquela temperatura']],
'qui-termo':[
 ['Reação exotérmica','Libera calor para o ambiente'],
 ['Reação endotérmica','Absorve calor do ambiente'],
 ['Entalpia (H)','A energia armazenada numa substância'],
 ['Variação de entalpia numa reação exotérmica','É negativa'],
 ['Lei de Hess','A variação de entalpia só depende dos estados inicial e final, não do caminho percorrido']],
'qui-cin':[
 ['O que aumenta a velocidade de uma reação','Temperatura, concentração e superfície de contato maiores'],
 ['Catalisador','Acelera a reação sem ser consumido, diminuindo a energia de ativação'],
 ['Energia de ativação','A energia mínima necessária para a reação começar'],
 ['Inibidor','Uma substância que retarda a velocidade da reação']],
'qui-eq':[
 ['Equilíbrio químico','A velocidade da reação direta se iguala à da reação inversa'],
 ['Princípio de Le Chatelier','O sistema reage contra qualquer perturbação, buscando um novo equilíbrio'],
 ['Constante de equilíbrio (Kc)','A relação entre as concentrações de produtos e reagentes no equilíbrio'],
 ['pH','Mede a acidez: abaixo de 7 é ácido, 7 é neutro, acima de 7 é básico'],
 ['Relação entre pH e pOH a 25°C','pH mais pOH é sempre igual a 14']],
'qui-ele':[
 ['Pilha','Transforma energia química em energia elétrica'],
 ['Eletrólise','Transforma energia elétrica em energia química; é o processo inverso da pilha'],
 ['Oxidação','Perda de elétrons'],
 ['Redução','Ganho de elétrons'],
 ['Agente oxidante','Provoca a oxidação de outra espécie, sendo ele mesmo reduzido'],
 ['Agente redutor','Provoca a redução de outra espécie, sendo ele mesmo oxidado']],

/* ---------------- HISTÓRIA: reforço nos 3 tópicos já existentes ---------------- */
'hist-emanc':[
 ['Nome oficial da data de emancipação do Paraná','19 de dezembro, Dia do Paraná'],
 ['O que motivou o movimento separatista de Curitiba e dos Campos Gerais','O desejo de mais autonomia política e investimento próprio, sem depender de São Paulo'],
 ['Como o Paraná era administrado antes de 1853','Como a Comarca de Curitiba, parte da Província de São Paulo']],
'hist-ocup':[
 ['Litoral e áreas de araucária','Ocupados originalmente pelos indígenas Guarani'],
 ['Planalto paranaense','Ocupado originalmente pelos indígenas Kaingang']],
'hist-ciclos':[
 ['Ordem dos ciclos econômicos do Paraná','Ouro (litoral, século XVII), tropeirismo e erva-mate (planalto, XVIII-XIX), café (Norte, século XX)'],
 ['Cidades marcadas pelo ciclo do café no Norte do Paraná','Londrina e Maringá']]
};
Object.keys(FLASHCARDS2).forEach(function(k){ FLASHCARDS[k]=(FLASHCARDS[k]||[]).concat(FLASHCARDS2[k]); });

/* ================= Banco de minigames por matéria =================
   classify: [texto, índice da categoria, explicação, tópico?]
   choice:   [enunciado, [opções], índice certo, explicação, tópico?]
   pick:     [enunciado, resposta, explicação, tópico?]  (distratores vêm das outras respostas do banco)
   tf:       [afirmação, verdadeiro?, explicação, tópico?]
   order:    [título, [passos na ordem certa], explicação, tópico?]
   calc:     geradores de problemas (infinitos)
   legacy:   jogos antigos (abrem pelo launcher)                                  */
const GAMES = [
/* ---------- LÍNGUA PORTUGUESA ---------- */
{id:'pt-crase',s:'port',t:'port-reg',type:'classify',title:'Crase: ocorre ou não?',desc:'Decida se o "a" leva acento grave. Cada acerto vem com a regra.',cats:['Ocorre','Não ocorre','Facultativa'],items:[
 ['Fui ___ farmácia.',0,'Quem vai, vai "a"; farmácia pede artigo "a". Teste: "voltei da farmácia" → crase.'],
 ['Fui ___ Curitiba.',1,'Teste do "voltar": volto DE Curitiba (sem artigo) → sem crase. "Vou a, volto da, crase há; vou a, volto de, crase pra quê?"'],
 ['Viajei ___ Bahia.',0,'Volto DA Bahia → o nome pede artigo → crase.'],
 ['Refiro-me ___ ela.',1,'Pronome pessoal não aceita artigo → sem crase.'],
 ['Começou ___ chover.',1,'Antes de verbo nunca há crase.'],
 ['O plantão começa ___ uma hora.',0,'Hora determinada leva crase: à uma hora, às 8 horas.'],
 ['Andou ___ cavalo.',1,'Palavra masculina não aceita artigo feminino → sem crase.'],
 ['Sapato ___ Luís XV.',0,'Subentende-se "à moda de" → crase mesmo antes de masculino.'],
 ['Encaminho o ofício ___ Vossa Senhoria.',1,'Pronomes de tratamento não aceitam artigo (exceção: senhora, senhorita, dona).'],
 ['Entreguei o relatório ___ senhora do balcão.',0,'"Senhora" aceita artigo → crase.'],
 ['Ficaram frente ___ frente.',1,'Entre palavras repetidas não há crase.'],
 ['Dirigiu-se ___ sua sala.',2,'Antes de pronome possessivo feminino singular a crase é facultativa.'],
 ['Entreguei o documento ___ Maria.',2,'Antes de nome próprio feminino de pessoa, o artigo é opcional → crase facultativa.'],
 ['A ocorrência foi ___ noite.',0,'Locução adverbial feminina de tempo: à noite, à tarde.'],
 ['A vítima ficou ___ espera do resgate.',0,'Locução "à espera de" leva crase.'],
 ['Compras ___ prazo.',1,'"Prazo" é masculino → a prazo, sem crase.'],
 ['Pagou ___ vista.',0,'Locução feminina "à vista" leva crase.'],
 ['Referiu-se ___ quem o socorreu.',1,'Antes do pronome relativo "quem" não há crase.'],
 ['Obedeça ___ normas de segurança.',0,'Obedecer a + as normas = às normas.'],
 ['Assisti ___ palestras sobre prevenção.',1,'"A" no singular antes de palavra no plural é só preposição → sem crase.']]},
{id:'pt-oracoes',s:'port',t:'port-sint',type:'classify',title:'Orações subordinadas',desc:'Classifique a oração destacada pelo papel que ela cumpre.',cats:['Substantiva','Adjetiva','Adverbial'],items:[
 ['É importante **que você estude**.',0,'Funciona como sujeito de "é importante" → substantiva subjetiva.'],
 ['Espero **que você passe**.',0,'É o objeto direto de "espero" → substantiva objetiva direta.'],
 ['O aluno **que estudou** passou.',1,'Caracteriza "aluno", como um adjetivo → adjetiva restritiva.'],
 ['Curitiba, **que é a capital**, fica no planalto.',1,'Entre vírgulas, explica o substantivo → adjetiva explicativa.'],
 ['**Quando o alarme tocou**, todos saíram.',2,'Indica tempo → adverbial temporal.'],
 ['**Embora estivesse cansado**, estudou.',2,'Ideia contrária que não impede o fato → adverbial concessiva.'],
 ['**Se estudar**, passará.',2,'Indica condição → adverbial condicional.'],
 ['Estudou tanto **que passou**.',2,'"Tanto... que" indica consequência → adverbial consecutiva.'],
 ['Saiu cedo **porque estava atrasado**.',2,'Indica causa → adverbial causal.'],
 ['Tenho certeza **de que ele virá**.',0,'Completa o nome "certeza" → substantiva completiva nominal.'],
 ['A verdade é **que ninguém sabia**.',0,'Vem depois do verbo de ligação → substantiva predicativa.'],
 ['Estudou **para que fosse aprovado**.',2,'Indica finalidade → adverbial final.'],
 ['O prédio **onde houve o incêndio** foi interditado.',1,'"Onde" retoma "prédio" → adjetiva.'],
 ['**Conforme o edital determina**, a prova terá 70 questões.',2,'Indica conformidade → adverbial conformativa.']]},
{id:'pt-conc',s:'port',t:'port-conc',type:'choice',title:'Concordância: qual está certa?',desc:'Escolha a forma que segue a norma-padrão.',items:[
 ['Tempo decorrido',['Faz dois anos que estudo.','Fazem dois anos que estudo.'],0,'"Fazer" indicando tempo é impessoal → fica no singular.'],
 ['Existência',['Houve muitos incêndios.','Houveram muitos incêndios.'],0,'"Haver" no sentido de existir é impessoal → singular.'],
 ['Verbo existir',['Existem muitas dúvidas.','Existe muitas dúvidas.'],0,'"Existir" é pessoal: concorda com o sujeito "dúvidas".'],
 ['Voz passiva sintética',['Alugam-se casas.','Aluga-se casas.'],0,'"Casas são alugadas": o sujeito é "casas" → verbo no plural.'],
 ['Índice de indeterminação',['Precisa-se de bombeiros.','Precisam-se de bombeiros.'],0,'Verbo com preposição + se → sujeito indeterminado → singular.'],
 ['Expressão "mais de um"',['Mais de um candidato faltou.','Mais de um candidato faltaram.'],0,'"Mais de um" pede verbo no singular (sem ideia de reciprocidade).'],
 ['Palavra "mesmo"',['Ela mesma resolveu.','Ela mesmo resolveu.'],0,'"Mesmo" com valor de próprio concorda: ela mesma.'],
 ['Palavra "anexo"',['Seguem anexas as fotos.','Segue anexo as fotos.'],0,'"Anexo" é adjetivo e concorda; o verbo concorda com "fotos".'],
 ['Horário',['É meio-dia e meia.','É meio-dia e meio.'],0,'"Meia" hora → meio-dia e meia.'],
 ['Palavra "bastante"',['Havia bastantes candidatos.','Havia bastante candidatos.'],0,'Antes de substantivo, "bastante" é adjetivo e vai ao plural.'],
 ['Locução com haver',['Deve haver soluções.','Devem haver soluções.'],0,'O auxiliar acompanha o "haver" impessoal → singular.']]},
{id:'pt-reg',s:'port',t:'port-reg',type:'choice',title:'Regência: qual preposição?',desc:'Escolha a construção correta segundo a norma-padrão.',items:[
 ['Assistir (= ver)',['Assisti ao treinamento.','Assisti o treinamento.'],0,'No sentido de ver, "assistir" pede a preposição "a".'],
 ['Aspirar (= desejar)',['Aspiro ao oficialato.','Aspiro o oficialato.'],0,'No sentido de desejar, pede "a".'],
 ['Preferir',['Prefiro estudar a descansar.','Prefiro mais estudar do que descansar.'],0,'Prefere-se algo A outra coisa, sem "mais" e sem "do que".'],
 ['Implicar (= acarretar)',['O cargo implica responsabilidade.','O cargo implica em responsabilidade.'],0,'No sentido de acarretar, é transitivo direto.'],
 ['Obedecer',['Obedeça ao regulamento.','Obedeça o regulamento.'],0,'Obedecer e desobedecer pedem "a".'],
 ['Chegar',['Chegamos a Curitiba.','Chegamos em Curitiba.'],0,'Na norma-padrão, quem chega, chega A algum lugar.'],
 ['Namorar',['Ele namora Ana.','Ele namora com Ana.'],0,'Namorar é transitivo direto.'],
 ['Esquecer',['Esqueci-me do horário.','Esqueci do horário.'],0,'Com pronome, pede "de"; sem pronome, é direto: esqueci o horário.'],
 ['Visar (= objetivar)',['A norma visa à segurança.','A norma visa a segurança.'],0,'No sentido de ter por objetivo, a norma tradicional pede "a" (com crase aqui).']]},
{id:'pt-col',s:'port',t:'port-col',type:'choice',title:'Colocação pronominal',desc:'Onde vai o pronome? Próclise, ênclise ou mesóclise.',items:[
 ['Início de frase',['Empresta-me o caderno.','Me empresta o caderno.'],0,'A norma-padrão não inicia frase com pronome oblíquo → ênclise.'],
 ['Palavra negativa',['Não me disseram nada.','Não disseram-me nada.'],0,'Palavra negativa atrai o pronome → próclise.'],
 ['Futuro do presente',['Far-se-á a vistoria amanhã.','Fará-se a vistoria amanhã.'],0,'Futuro sem palavra atrativa → mesóclise.'],
 ['Pronome interrogativo',['Quem te contou?','Quem contou-te?'],0,'Pronome interrogativo atrai → próclise.'],
 ['Conjunção subordinativa',['Espero que me ligue.','Espero que ligue-me.'],0,'Conjunção subordinativa atrai → próclise.'],
 ['Pronome indefinido',['Tudo se resolveu.','Tudo resolveu-se.'],0,'Pronome indefinido atrai → próclise.'],
 ['Advérbio sem vírgula',['Aqui se estuda muito.','Aqui estuda-se muito.'],0,'Advérbio sem pausa atrai → próclise.'],
 ['Verbo iniciando oração',['Levantei-me cedo.','Me levantei cedo.'],0,'Verbo no início → ênclise.']]},
{id:'pt-ort',s:'port',t:'port-ort',type:'choice',title:'Ortografia e acentuação',desc:'Qual a grafia correta?',items:[
 ['Grafia',['exceção','excessão'],0,'Exceção, com ç.'],['Grafia',['paralisar','paralizar'],0,'Vem de "paralisia" → com s.'],
 ['Grafia',['análise','análize'],0,'Com s.'],['Grafia',['pesquisar','pesquizar'],0,'Vem de "pesquisa" → com s.'],
 ['Grafia',['empecilho','impecilho'],0,'Empecilho, com e.'],['Grafia',['privilégio','previlégio'],0,'Privilégio, com i.'],
 ['Grafia',['beneficente','beneficiente'],0,'Beneficente, sem i depois do c.'],['Grafia',['ascensão','acensão'],0,'Ascensão, com sc.'],
 ['Grafia',['enxergar','enchergar'],0,'Enxergar, com x.'],['Acentuação',['herói','heroi'],0,'Oxítona com ditongo aberto "ói" mantém o acento.'],
 ['Acentuação (Acordo)',['ideia','idéia'],0,'Paroxítonas com ditongo aberto "ei" perderam o acento.'],
 ['Acentuação (Acordo)',['voo','vôo'],0,'O hiato "oo" perdeu o acento.'],
 ['Verbo parar',['Ele para no semáforo.','Ele pára no semáforo.'],0,'O acento diferencial de "pára" caiu com o Acordo.']]},
{id:'pt-sem',s:'port',t:'port-sem',type:'choice',title:'Parônimos: não confunda',desc:'Palavras parecidas, sentidos diferentes.',items:[
 ['Prestes a acontecer: o desabamento era ___.',['iminente','eminente'],0,'Iminente = prestes a ocorrer; eminente = ilustre.'],
 ['Corrigir: precisou ___ o erro do documento.',['retificar','ratificar'],0,'Retificar = corrigir; ratificar = confirmar.'],
 ['Violar: o motorista ___ a lei.',['infringiu','infligiu'],0,'Infringir = violar; infligir = aplicar pena.'],
 ['Reserva: agiu com ___.',['discrição','descrição'],0,'Discrição = reserva; descrição = ato de descrever.'],
 ['Ato de ceder: a ___ do terreno ao município.',['cessão','sessão'],0,'Cessão = ceder; sessão = reunião; seção = divisão.'],
 ['Trânsito: o ___ na BR estava lento.',['tráfego','tráfico'],0,'Tráfego = trânsito; tráfico = comércio ilegal.'],
 ['Saudação: fez um ___ ao comandante.',['cumprimento','comprimento'],0,'Cumprimento = saudação; comprimento = extensão.'],
 ['Evidente: foi preso em ___.',['flagrante','fragrante'],0,'Flagrante = evidente; fragrante = perfumado.'],
 ['Vir à tona: o mergulhador vai ___.',['emergir','imergir'],0,'Emergir = subir à superfície; imergir = afundar.'],
 ['Descrever com minúcia: ___ o local.',['descrever','discriminar'],0,'Discriminar = separar, distinguir (ou tratar com preconceito).']]},
{id:'pt-pont',s:'port',t:'port-pont',type:'tf',title:'Pontuação: vírgula certa?',desc:'Verdadeiro ou falso sobre as regras de vírgula.',items:[
 ['Não se separa o sujeito do verbo por vírgula.',true,'Regra de ouro: sujeito e verbo não se separam.'],
 ['O vocativo deve ser isolado por vírgula.',true,'Ex.: "Soldado, venha cá."'],
 ['O aposto explicativo vem entre vírgulas.',true,'Ex.: "Curitiba, capital do Paraná, ..."'],
 ['Nunca se usa vírgula antes de "e".',false,'Usa-se com sujeitos diferentes, com valor adversativo ou em polissíndeto.'],
 ['A oração adjetiva restritiva vem entre vírgulas.',false,'A restritiva não leva vírgula; a explicativa leva.'],
 ['Antes de "mas" adversativo usa-se vírgula.',true,'Ex.: "Estudou, mas não passou."'],
 ['A vírgula separa itens de uma enumeração.',true,'Ex.: "Levou mangueira, capacete e luvas."'],
 ['Em "Os bombeiros, chegaram rápido." a vírgula está correta.',false,'A vírgula separa sujeito e verbo → erro.'],
 ['Adjunto adverbial deslocado para o início costuma ser separado por vírgula.',true,'Ex.: "Durante o plantão, houve três ocorrências."']]},
{id:'pt-conect',s:'port',t:'port-coe',type:'classify',title:'Conectivos: qual a relação?',desc:'Classifique a ideia que o conectivo expressa.',cats:['Adversidade','Conclusão','Concessão','Causa','Condição','Finalidade','Adição'],items:[
 ['porém',0,'Oposição: porém, contudo, todavia, entretanto.'],['contudo',0,'Oposição.'],['portanto',1,'Conclusão: portanto, logo, por isso.'],
 ['logo (= portanto)',1,'Conclusão.'],['embora',2,'Concessão: embora, ainda que, mesmo que.'],['ainda que',2,'Concessão.'],
 ['visto que',3,'Causa: porque, visto que, já que.'],['já que',3,'Causa.'],['caso',4,'Condição: se, caso, desde que + subjuntivo.'],
 ['desde que (+ subjuntivo)',4,'Com subjuntivo indica condição; com indicativo, tempo.'],['a fim de que',5,'Finalidade: para que, a fim de que.'],['ademais',6,'Adição: além disso, ademais.']]},
{id:'pt-generos',s:'port',t:'port-gen',type:'classify',title:'Tipologia e gêneros',desc:'Qual o tipo textual predominante?',cats:['Narrativo','Descritivo','Dissertativo-argumentativo','Expositivo','Injuntivo'],items:[
 ['Relata fatos com personagens, tempo e espaço.',0,'Narração: sequência de ações.'],['Defende um ponto de vista com argumentos.',2,'Argumentação.'],
 ['Ensina a fazer algo, com verbos no imperativo.',4,'Injunção: instrução.'],['Retrata características de um ser ou lugar.',1,'Descrição.'],
 ['Expõe informações sem defender opinião.',3,'Exposição.'],['Editorial de jornal',2,'Gênero opinativo.'],['Receita culinária',4,'Instrução.'],
 ['Conto',0,'Narração.'],['Verbete de enciclopédia',3,'Exposição de conceitos.'],['Manual de uso do extintor',4,'Instrução.'],
 ['Artigo de opinião',2,'Opinativo.'],['Anúncio classificado de imóvel',1,'Descreve o imóvel.']]},
{id:'pt-classes',s:'port',t:'port-cla',type:'classify',title:'Classes de palavras',desc:'Qual a classe da palavra em destaque?',cats:['Substantivo','Adjetivo','Advérbio','Pronome','Verbo','Conjunção','Preposição'],items:[
 ['Ele chegou **cedo**.',2,'Modifica o verbo indicando tempo.'],['O **correr** faz bem.',0,'Verbo substantivado pelo artigo "o".'],
 ['**Ela** chegou.',3,'Pronome pessoal.'],['Viatura **nova**.',1,'Qualifica o substantivo.'],['Estudou, **mas** não passou.',5,'Conjunção adversativa.'],
 ['Saiu **de** casa.',6,'Liga termos: preposição.'],['Os bombeiros **resgataram** a vítima.',4,'Indica ação.'],['**Nosso** quartel é novo.',3,'Pronome possessivo.'],
 ['Ele é **muito** dedicado.',2,'Intensifica o adjetivo.'],['A **coragem** salva vidas.',0,'Nomeia um sentimento.'],['Chegou **porque** chamaram.',5,'Conjunção causal.']]},

/* ---------- MATEMÁTICA ---------- */
{id:'mt-base',s:'mat',t:'mat-ops',type:'calc',title:'Cálculo rápido: a base',desc:'Frações, potências, regra de três, porcentagem e equação do 1º grau. Problemas infinitos, com resolução passo a passo.',gens:['frac','pot','r3','porc','eq1']},
{id:'mt-func',s:'mat',t:'mat-fun',type:'calc',title:'Funções, sequências e logaritmos',desc:'Equação do 2º grau, funções, PA, PG e log.',gens:['eq2','fun','pa','pg','log']},
{id:'mt-geo',s:'mat',t:'mat-gp',type:'calc',title:'Geometria, estatística e contagem',desc:'Áreas, volumes, média, combinatória, determinante, distância e derivada.',gens:['area','vol','media','comb','det','dist','deriv']},
{id:'mt-trig',s:'mat',t:'mat-trig',type:'pick',title:'Trigonometria: ângulos notáveis',desc:'Os valores que caem sempre. Decore com a tabela 30°, 45°, 60°.',items:[
 ['sen 30°','1/2','Tabela: sen 30° = 1/2, sen 45° = √2/2, sen 60° = √3/2.'],['sen 45°','√2/2','sen e cos de 45° são iguais: √2/2.'],['sen 60°','√3/2','sen 60° = cos 30° = √3/2.'],
 ['cos 60°','1/2','cos 60° = sen 30° = 1/2.'],['tg 45°','1','tg 45° = sen/cos = 1.'],['tg 60°','√3','tg 60° = (√3/2)/(1/2) = √3.'],['tg 30°','√3/3','tg 30° = (1/2)/(√3/2) = √3/3.'],
 ['sen 90°','1','No círculo trigonométrico, 90° está no topo: sen = 1.'],['cos 90°','0','cos 90° = 0.'],['sen 0°','0','sen 0° = 0.']]},

/* ---------- FÍSICA ---------- */
{id:'fs-mec',s:'fis',t:'fis-cin',type:'calc',title:'Mecânica: movimento e força',desc:'Conversão km/h ↔ m/s, velocidade média, MUV, queda livre, Newton e quantidade de movimento.',gens:['kmh','vm','muv','queda','newton','qm','notc']},
{id:'fs-ene',s:'fis',t:'fis-ene',type:'calc',title:'Energia, trabalho e fluidos',desc:'Energia cinética e potencial, trabalho, potência e pressão.',gens:['ec','ep','trab','press','hidro']},
{id:'fs-calel',s:'fis',t:'fis-eldin',type:'calc',title:'Calor, ondas e eletricidade',desc:'Calorimetria, escalas de temperatura, ondas e lei de Ohm.',gens:['calor','temp','onda','ohm']},
{id:'fs-form',s:'fis',t:'fis-din',type:'pick',title:'Qual fórmula usar?',desc:'Leia a situação e escolha a fórmula certa. É o primeiro passo de toda questão de física.',items:[
 ['Carro parte do repouso com aceleração constante. Qual a velocidade depois de t segundos?','v = v₀ + a·t','Função horária da velocidade no MUV.','fis-cin'],
 ['Força resultante sobre um corpo de massa m com aceleração a.','F = m·a','2ª Lei de Newton.','fis-din'],
 ['Energia de um corpo em movimento.','Ec = m·v²/2','Energia cinética.','fis-ene'],
 ['Energia de um corpo a uma altura h.','Ep = m·g·h','Energia potencial gravitacional.','fis-ene'],
 ['Calor para aquecer água sem mudar de estado.','Q = m·c·ΔT','Calor sensível.','fis-term'],
 ['Calor para derreter gelo a 0 °C.','Q = m·L','Calor latente: muda o estado sem mudar a temperatura.','fis-term'],
 ['Corrente em um resistor com tensão conhecida.','U = R·i','1ª Lei de Ohm.','fis-eldin'],
 ['Pressão de uma força sobre uma área.','p = F/A','Pressão.','fis-hid'],
 ['Pressão no fundo de uma piscina (além da atmosférica).','p = d·g·h','Pressão hidrostática (Stevin).','fis-hid'],
 ['Velocidade de uma onda com frequência e comprimento conhecidos.','v = λ·f','Equação fundamental da ondulatória.','fis-ond'],
 ['Trabalho de uma força constante ao longo de um deslocamento.','τ = F·d','Trabalho.','fis-ene'],
 ['Potência consumida por um aparelho elétrico.','P = U·i','Potência elétrica.','fis-eldin'],
 ['Força de empuxo num corpo submerso.','E = d·V·g','Princípio de Arquimedes.','fis-hid']]},
{id:'fs-unid',s:'fis',t:'fis-unid',type:'pick',title:'Unidades do SI',desc:'Grandeza e unidade: associação que resolve alternativa de cara.',items:[
 ['Força','newton (N)','1 N = 1 kg·m/s².'],['Energia e trabalho','joule (J)','1 J = 1 N·m.'],['Potência','watt (W)','1 W = 1 J/s.'],['Pressão','pascal (Pa)','1 Pa = 1 N/m².'],
 ['Carga elétrica','coulomb (C)',''],['Corrente elétrica','ampère (A)',''],['Resistência elétrica','ohm (Ω)',''],['Tensão elétrica','volt (V)',''],
 ['Frequência','hertz (Hz)','1 Hz = 1 ciclo por segundo.'],['Temperatura (SI)','kelvin (K)','K = °C + 273.'],['Massa','quilograma (kg)',''],['Quantidade de matéria','mol (mol)','']]},

/* ---------- QUÍMICA ---------- */
{id:'qm-calc',s:'qui',t:'qui-esteq',type:'calc',title:'Cálculos químicos',desc:'Mol, concentração, diluição, pH, átomo, gases e meia-vida.',gens:['mol','conc','dil','ph','atom','boyle','meia']},
{id:'qm-inorg',s:'qui',t:'qui-inorg',type:'classify',title:'Funções inorgânicas',desc:'Ácido, base, sal ou óxido? Olhe o começo e o fim da fórmula.',cats:['Ácido','Base','Sal','Óxido'],items:[
 ['HCl',0,'Começa com H e libera H⁺ em água → ácido.'],['NaOH',1,'Termina com OH → base (hidróxido).'],['NaCl',2,'Cátion metálico + ânion (não H⁺ nem OH⁻) → sal.'],
 ['CO₂',3,'Composto binário com oxigênio → óxido.'],['H₂SO₄',0,'Ácido sulfúrico.'],['Ca(OH)₂',1,'Hidróxido de cálcio.'],['CaCO₃',2,'Carbonato de cálcio: sal.'],
 ['Fe₂O₃',3,'Óxido de ferro (ferrugem).'],['HNO₃',0,'Ácido nítrico.'],['KOH',1,'Hidróxido de potássio.'],['KNO₃',2,'Nitrato de potássio: sal.'],
 ['SO₃',3,'Óxido de enxofre.'],['NH₄Cl',2,'Cátion amônio + cloreto → sal.'],['H₃PO₄',0,'Ácido fosfórico.'],['Mg(OH)₂',1,'Leite de magnésia: base.'],['CaO',3,'Cal virgem: óxido.']]},
{id:'qm-org',s:'qui',t:'qui-org',type:'classify',title:'Funções orgânicas',desc:'Reconheça o grupo funcional.',cats:['Hidrocarboneto','Álcool','Fenol','Aldeído','Cetona','Ácido carboxílico','Éster','Éter','Amina','Amida'],items:[
 ['CH₄',0,'Só C e H → hidrocarboneto.'],['CH₃–CH₂–OH',1,'OH em carbono saturado → álcool (etanol).'],['C₆H₅–OH',2,'OH ligado direto ao anel aromático → fenol.'],
 ['CH₃–CHO',3,'Carbonila na ponta da cadeia → aldeído.'],['CH₃–CO–CH₃',4,'Carbonila no meio da cadeia → cetona (acetona).'],['CH₃–COOH',5,'Grupo carboxila → ácido carboxílico (vinagre).'],
 ['CH₃–COO–CH₃',6,'O do ácido trocado por cadeia carbônica → éster.'],['CH₃–O–CH₃',7,'Oxigênio entre dois carbonos → éter.'],['CH₃–NH₂',8,'Derivado da amônia → amina.'],
 ['CH₃–CONH₂',9,'Carbonila ligada a N → amida.'],['CH₂=CH₂',0,'Eteno: hidrocarboneto com dupla.'],['CH₃–CH₂–CH₂–OH',1,'Propanol: álcool.']]},
{id:'qm-fenom',s:'qui',t:'qui-mat',type:'classify',title:'Fenômeno físico ou químico?',desc:'Formou substância nova? Então é químico.',cats:['Físico','Químico'],items:[
 ['Queima do papel',1,'Forma novas substâncias (CO₂, cinzas).'],['Derretimento do gelo',0,'Só muda o estado físico.'],['Formação de ferrugem',1,'Ferro vira óxido de ferro.'],
 ['Evaporação da água',0,'Mudança de estado.'],['Digestão dos alimentos',1,'Moléculas são transformadas.'],['Dissolução do açúcar na água',0,'O açúcar continua sendo açúcar.'],
 ['Cozimento do ovo',1,'As proteínas mudam irreversivelmente.'],['Quebra de um vidro',0,'Só muda a forma.'],['Combustão da gasolina',1,'Reação com oxigênio.'],['Sublimação da naftalina',0,'Passa de sólido a gás.']]},
{id:'qm-sep',s:'qui',t:'qui-mat',type:'classify',title:'Separação de misturas',desc:'Qual método resolve cada caso?',cats:['Filtração','Decantação','Evaporação','Destilação','Separação magnética'],items:[
 ['Coar o café (separar o pó da bebida)',0,'Sólido retido pelo filtro.'],['Água e óleo',1,'Líquidos imiscíveis: funil de decantação.'],['Obter sal nas salinas',2,'A água evapora e o sal fica.'],
 ['Obter água pura a partir de água salgada',3,'Evapora e condensa a água.'],['Separar as frações do petróleo',3,'Destilação fracionada.'],['Limalha de ferro misturada à areia',4,'Ímã atrai o ferro.'],
 ['Aspirador de pó (ar e poeira)',0,'O filtro retém a poeira.'],['Água e álcool',3,'Líquidos miscíveis com pontos de ebulição diferentes.']]},
{id:'qm-lig',s:'qui',t:'qui-lig',type:'classify',title:'Tipos de ligação',desc:'Metal + ametal, ametal + ametal ou metal + metal?',cats:['Iônica','Covalente','Metálica'],items:[
 ['NaCl',0,'Metal + ametal → iônica.'],['H₂O',1,'Ametal + ametal → covalente.'],['Fe (barra de ferro)',2,'Metal puro → metálica.'],['CO₂',1,'Ametais → covalente.'],
 ['MgO',0,'Metal + ametal.'],['Cu (fio de cobre)',2,'Metal puro.'],['CH₄',1,'Ametais.'],['KCl',0,'Metal + ametal.'],['O₂',1,'Ametal + ametal.']]},
{id:'qm-termo',s:'qui',t:'qui-termo',type:'classify',title:'Exotérmica ou endotérmica?',desc:'Libera ou absorve calor?',cats:['Exotérmica (libera)','Endotérmica (absorve)'],items:[
 ['Combustão da madeira',0,'Toda combustão libera calor.'],['Fotossíntese',1,'Absorve energia luminosa.'],['Evaporação da água',1,'Precisa receber calor.'],
 ['Condensação do vapor',0,'Libera o calor que a evaporação absorveu.'],['Fusão do gelo',1,'Absorve calor.'],['Solidificação da água',0,'Libera calor.'],
 ['Respiração celular',0,'Libera energia.'],['Neutralização ácido-base',0,'Libera calor.'],['Decomposição térmica do calcário',1,'Precisa de aquecimento contínuo.']]},
{id:'qm-equil',s:'qui',t:'qui-eq',type:'classify',title:'Le Chatelier: para onde desloca?',desc:'O sistema reage contra a perturbação.',cats:['Para os produtos','Para os reagentes','Não desloca'],items:[
 ['Aumentar a concentração de um reagente',0,'O sistema consome o excesso → produtos.'],['Remover um produto',0,'Repõe o que saiu → produtos.'],['Adicionar mais produto',1,'Consome o excesso → reagentes.'],
 ['Adicionar catalisador',2,'Catalisador acelera os dois sentidos igualmente.'],['Aquecer uma reação exotérmica',1,'Favorece o sentido que absorve calor (inverso).'],
 ['Aquecer uma reação endotérmica',0,'Favorece o sentido endotérmico (direto).'],['Aumentar a pressão quando os produtos têm menos mols de gás',0,'Pressão maior favorece menos volume.']]},
{id:'qm-cin',s:'qui',t:'qui-cin',type:'classify',title:'Cinética: mais rápida ou mais lenta?',desc:'Fatores que mudam a velocidade da reação.',cats:['Aumenta a velocidade','Diminui a velocidade'],items:[
 ['Aumentar a temperatura',0,'Mais choques efetivos.'],['Usar catalisador',0,'Diminui a energia de ativação.'],['Triturar o sólido',0,'Mais superfície de contato.'],
 ['Diluir os reagentes',1,'Menos choques.'],['Resfriar o sistema',1,'Menos energia nos choques.'],['Aumentar a concentração dos reagentes',0,'Mais choques.'],['Usar inibidor',1,'Atrapalha a reação.']]},
{id:'qm-pilha',s:'qui',t:'qui-ele',type:'classify',title:'Pilha: ânodo ou cátodo?',desc:'Onde acontece cada coisa na pilha.',cats:['Ânodo','Cátodo'],items:[
 ['Ocorre oxidação',0,'Mnemônico: ânodo-oxidação (vogais), cátodo-redução (consoantes).'],['Ocorre redução',1,'Cátodo recebe elétrons.'],['Polo negativo da pilha',0,'Na pilha, o ânodo é o polo negativo.'],
 ['Polo positivo da pilha',1,'Cátodo é o polo positivo.'],['Eletrodo que se desgasta',0,'O metal se oxida e vai para a solução.'],['Eletrodo onde metal se deposita',1,'Íons se reduzem e viram metal.']]},

/* ---------- LÍNGUA INGLESA ---------- */
{id:'en-cog',s:'ing',t:'ing-voc',type:'classify',title:'Cognato verdadeiro ou falso?',desc:'Parece português. Mas significa o que parece?',cats:['Verdadeiro (significa o que parece)','Falso cognato'],items:[
 ['hospital',0,'Hospital.'],['pretend',1,'Fingir, não pretender (= intend).'],['emergency',0,'Emergência.'],['actually',1,'Na verdade, não atualmente (= currently).'],
 ['accident',0,'Acidente.'],['push',1,'Empurrar.'],['information',0,'Informação.'],['library',1,'Biblioteca; livraria é bookstore.'],['important',0,'Importante.'],
 ['parents',1,'Pais; parentes é relatives.'],['victim',0,'Vítima.'],['college',1,'Faculdade.'],['ambulance',0,'Ambulância.'],['exit',1,'Saída; êxito é success.'],
 ['sensible',1,'Sensato; sensível é sensitive.'],['realize',1,'Perceber; realizar é to accomplish.']]},
{id:'en-tempos',s:'ing',t:'ing-verb',type:'classify',title:'Tempos verbais',desc:'Identifique o tempo verbal da frase.',cats:['Simple Present','Simple Past','Present Continuous','Future (will)','Present Perfect'],items:[
 ['She works at the fire station.',0,'Rotina, verbo com -s na 3ª pessoa.'],['They rescued the child.',1,'Ação terminada, verbo com -ed.'],['The firefighters are fighting the fire.',2,'am/is/are + -ing.'],
 ['He will call for help.',3,'will + verbo.'],['I have finished the report.',4,'have/has + particípio.'],['We went to Curitiba last year.',1,'Went = passado de go.'],
 ['The alarm is ringing now.',2,'Acontecendo agora.'],['She has worked here since 2020.',4,'Começou no passado e continua: since.'],['It will rain tomorrow.',3,'Previsão futura.'],['He always checks the equipment.',0,'Hábito: always.']]},
{id:'en-conect',s:'ing',t:'ing-int',type:'pick',title:'Conectivos em inglês',desc:'Eles mudam o sentido do texto inteiro.',items:[
 ['however','no entanto','Contraste.'],['although','embora','Concessão.'],['therefore','portanto','Conclusão.'],['because','porque','Causa.'],['moreover','além disso','Adição.'],
 ['unless','a menos que','Condição negativa.'],['while','enquanto','Tempo ou contraste.'],['despite','apesar de','Concessão, seguido de substantivo.'],['whereas','ao passo que','Contraste entre duas ideias.'],['thus','desse modo','Consequência.']]},
{id:'en-gram',s:'ing',t:'ing-gram',type:'choice',title:'Artigos e preposições',desc:'a/an e in/on/at.',items:[
 ['___ hour ago',['an','a'],0,'"Hour" começa com som de vogal (h mudo).'],['___ university',['a','an'],0,'"University" começa com som de "iu" (consoante).'],['___ honest man',['an','a'],0,'H mudo.'],
 ['The meeting is ___ Monday.',['on','in','at'],0,'Dias da semana: on.'],['The fire started ___ 3 a.m.',['at','in','on'],0,'Horas: at.'],['She was born ___ 2001.',['in','on','at'],0,'Anos e meses: in.'],
 ['We study ___ night.',['at','in','on'],0,'Expressão fixa: at night.'],['It happens ___ July.',['in','on','at'],0,'Meses: in.']]},

/* ---------- DIREITO ADMINISTRATIVO ---------- */
{id:'da-limpe',s:'dadm',t:'dadm-princ',type:'classify',title:'LIMPE na prática',desc:'Qual princípio do art. 37 da CF aparece na situação?',cats:['Legalidade','Impessoalidade','Moralidade','Publicidade','Eficiência'],items:[
 ['O agente público só pode fazer o que a lei autoriza.',0,'Legalidade estrita para a Administração.'],['Ingresso no cargo por concurso público.',1,'Tratamento igual aos candidatos.'],
 ['Proibição do nepotismo.',2,'Súmula Vinculante 13: viola a moralidade.'],['Publicação dos atos no Diário Oficial.',3,'Transparência e eficácia dos atos.'],
 ['Buscar os melhores resultados com menos recursos.',4,'Introduzido pela EC 19/1998.'],['Placa de obra sem nome ou foto de governante.',1,'É vedada a promoção pessoal (art. 37, §1º).'],
 ['Avaliação periódica de desempenho do servidor.',4,'Ligada à eficiência.'],['Salários de servidores divulgados em portal da transparência.',3,'Publicidade.'],['Agir com ética e boa-fé, não só dentro da lei.',2,'Moralidade.']]},
{id:'da-poderes',s:'dadm',t:'dadm-pod',type:'classify',title:'Poderes administrativos',desc:'Que poder a Administração está usando?',cats:['Poder de polícia','Hierárquico','Disciplinar','Regulamentar'],items:[
 ['O CBMPR interdita uma boate irregular.',0,'Limita a liberdade do particular em nome do interesse público.'],['O superior dá ordem a um subordinado.',1,'Relação de hierarquia interna.'],
 ['Punição a servidor que faltou ao dever.',2,'Apura e pune infrações funcionais.'],['Governador edita decreto para a fiel execução da lei.',3,'Poder regulamentar do chefe do Executivo.'],
 ['Vigilância sanitária apreende alimento vencido.',0,'Fiscalização de particulares.'],['Chefe avoca uma competência do subordinado.',1,'Avocar e delegar são típicos da hierarquia.'],
 ['Multa de trânsito.',0,'Polícia administrativa.'],['Suspensão de servidor após processo administrativo.',2,'Disciplinar.']]},
{id:'da-pati',s:'dadm',t:'dadm-atos',type:'classify',title:'Atributos do ato (PATI)',desc:'Presunção, Autoexecutoriedade, Tipicidade, Imperatividade.',cats:['Presunção de legitimidade','Autoexecutoriedade','Tipicidade','Imperatividade'],items:[
 ['O ato é considerado legal até prova em contrário.',0,'Presunção relativa (admite prova contrária).'],['A Administração executa o ato sem precisar do Judiciário.',1,'Ex.: demolição de construção prestes a ruir.'],
 ['O ato se impõe ao particular, mesmo sem sua concordância.',3,'Poder extroverso.'],['O ato corresponde a figuras previamente definidas em lei.',2,'Não existe ato administrativo inventado.'],
 ['A multa aplicada vale até ser anulada.',0,'Presunção de legitimidade.'],['Remoção imediata de mercadoria estragada à venda.',1,'Autoexecutoriedade.'],['A ordem de interdição obriga o dono do imóvel.',3,'Imperatividade.']]},
{id:'da-anul',s:'dadm',t:'dadm-atos',type:'classify',title:'Anulação ou revogação?',desc:'Ilegalidade ou conveniência?',cats:['Anulação','Revogação'],items:[
 ['O ato é ilegal.',0,'Ilegalidade → anulação.'],['O ato é legal, mas deixou de ser conveniente.',1,'Mérito → revogação.'],['Pode ser feita pelo Judiciário.',0,'O Judiciário anula, não revoga atos de outro Poder.'],
 ['Efeitos retroativos (ex tunc).',0,'Anulação apaga desde a origem.'],['Efeitos daqui para frente (ex nunc).',1,'Revogação respeita o passado.'],['Só a própria Administração pode fazer.',1,'Juízo de conveniência e oportunidade.']]},
{id:'da-org',s:'dadm',t:'dadm-org',type:'classify',title:'Administração direta ou indireta?',desc:'Órgão sem personalidade própria ou entidade?',cats:['Direta','Indireta'],items:[
 ['Ministério da Saúde',0,'Órgão da União.'],['INSS (autarquia)',1,'Autarquia: entidade da indireta.'],['Correios (empresa pública)',1,'Empresa pública.'],['Petrobras (sociedade de economia mista)',1,''],
 ['Secretaria de Estado da Segurança Pública',0,'Órgão do Estado.'],['Corpo de Bombeiros Militar do Paraná',0,'Órgão da administração direta estadual.'],['Universidade federal (autarquia)',1,''],['Anatel (agência reguladora)',1,'Autarquia em regime especial.']]},
{id:'da-elem',s:'dadm',t:'dadm-atos',type:'classify',title:'Elementos do ato: vinculado ou mérito?',desc:'COFIFOMOB: competência, finalidade, forma, motivo, objeto.',cats:['Sempre vinculado','Pode ser discricionário'],items:[
 ['Competência',0,'Definida em lei.'],['Finalidade',0,'Sempre o interesse público definido em lei.'],['Forma',0,'Definida em lei.'],['Motivo',1,'Motivo e objeto formam o mérito administrativo.'],['Objeto',1,'Mérito administrativo.']]},

/* ---------- DIREITO CONSTITUCIONAL ---------- */
{id:'dc-remedios',s:'dcon',t:'dcon-dir',type:'classify',title:'Remédios constitucionais',desc:'Qual ação resolve cada situação?',cats:['Habeas corpus','Mandado de segurança','Habeas data','Mandado de injunção','Ação popular'],items:[
 ['Prisão ilegal.',0,'Protege a liberdade de locomoção.'],['Ameaça ao direito de ir e vir.',0,'Cabe HC preventivo.'],['Acessar informações pessoais em banco de dados público.',2,'Informação relativa ao próprio impetrante.'],
 ['Corrigir dados pessoais em registro público.',2,'Retificação de dados.'],['Direito líquido e certo violado por autoridade, sem HC ou HD cabível.',1,'Caráter residual.'],
 ['Falta de norma regulamentadora impede exercer um direito.',3,'Omissão legislativa.'],['Cidadão quer anular ato lesivo ao patrimônio público.',4,'Legitimado: qualquer cidadão (eleitor).']]},
{id:'dc-comp',s:'dcon',t:'dcon-org',type:'classify',title:'Competências: quem faz?',desc:'União, estados ou municípios.',cats:['União','Estados','Municípios'],items:[
 ['Emitir moeda',0,'Art. 21.'],['Legislar sobre direito penal',0,'Competência privativa da União (art. 22).'],['Legislar sobre trânsito',0,'Art. 22.'],
 ['Transporte coletivo local',2,'Serviço de interesse local (art. 30).'],['Assuntos de interesse local',2,'Art. 30, I.'],['Explorar o gás canalizado',1,'Art. 25, §2º.'],['Criar regiões metropolitanas',1,'Art. 25, §3º.']]},
{id:'dc-nato',s:'dcon',t:'dcon-nac',type:'classify',title:'Cargo privativo de brasileiro nato?',desc:'A lista do art. 12, §3º é curta. Decore.',cats:['Só nato','Nato ou naturalizado'],items:[
 ['Presidente da República',0,''],['Presidente da Câmara dos Deputados',0,'Está na linha sucessória.'],['Deputado federal',1,'Só o presidente da Câmara precisa ser nato.'],
 ['Ministro do STF',0,''],['Ministro do STJ',1,''],['Oficial das Forças Armadas',0,''],['Ministro de Estado da Defesa',0,''],['Ministro da Saúde',1,''],
 ['Carreira diplomática',0,''],['Senador',1,'Só o presidente do Senado precisa ser nato.'],['Governador',1,'']]},
{id:'dc-144',s:'dcon',t:'dcon-defesa',type:'classify',title:'Segurança pública (art. 144)',desc:'Em que esfera está cada órgão?',cats:['Federal','Estadual','Municipal'],items:[
 ['Polícia Federal',0,''],['Polícia Rodoviária Federal',0,''],['Polícia Ferroviária Federal',0,''],['Polícia Civil',1,''],['Polícia Militar',1,''],
 ['Corpo de Bombeiros Militar',1,'Aos bombeiros cabem também as atividades de defesa civil.'],['Polícia Penal Federal',0,''],['Guarda municipal',2,'Art. 144, §8º.']]},
{id:'dc-pconst',s:'dcon',t:'dcon-poder',type:'classify',title:'Poder constituinte',desc:'Originário, reformador ou decorrente?',cats:['Originário','Derivado reformador','Derivado decorrente'],items:[
 ['Inicial, ilimitado e incondicionado.',0,''],['Cria uma nova Constituição.',0,''],['Aprova emendas à Constituição.',1,'Limitado pelas cláusulas pétreas.'],
 ['Elabora as constituições estaduais.',2,'Decorre da autonomia dos estados.'],['Deve respeitar as cláusulas pétreas.',1,'']]},
{id:'dc-art134',s:'dcon',t:'dcon-princ',type:'classify',title:'Fundamentos, objetivos ou relações internacionais?',desc:'Arts. 1º, 3º e 4º da CF.',cats:['Fundamento (art. 1º)','Objetivo (art. 3º)','Relações internacionais (art. 4º)'],items:[
 ['Soberania',0,'SO-CI-DI-VA-PLU: soberania, cidadania, dignidade, valores sociais, pluralismo.'],['Dignidade da pessoa humana',0,''],['Pluralismo político',0,''],
 ['Erradicar a pobreza e a marginalização',1,'Objetivos começam com verbo: construir, garantir, erradicar, promover.'],['Garantir o desenvolvimento nacional',1,''],
 ['Construir uma sociedade livre, justa e solidária',1,''],['Prevalência dos direitos humanos',2,''],['Não intervenção',2,''],['Concessão de asilo político',2,''],['Repúdio ao terrorismo e ao racismo',2,'']]},
{id:'dc-sitio',s:'dcon',t:'dcon-defesa',type:'classify',title:'Estado de defesa ou de sítio?',desc:'Os dois instrumentos de defesa do Estado.',cats:['Estado de defesa','Estado de sítio'],items:[
 ['Decretado antes, submetido ao Congresso em 24 horas.',0,'Controle posterior.'],['Exige autorização prévia do Congresso.',1,''],['Calamidade de grandes proporções na natureza.',0,''],
 ['Guerra declarada ou agressão armada estrangeira.',1,''],['Até 30 dias, prorrogável uma vez.',0,''],['Comoção grave de repercussão nacional.',1,''],['Locais restritos e determinados.',0,'']]},
{id:'dc-onde',s:'dcon',t:'dcon-princ',type:'pick',title:'Onde está na Constituição?',desc:'Os artigos que sustentam a prova de oficial.',items:[
 ['Órgãos da segurança pública','art. 144','Inclui PMs e CBMs.','dcon-defesa'],['Direitos e deveres individuais e coletivos','art. 5º','','dcon-dir'],
 ['Princípios da Administração (LIMPE)','art. 37','','dcon-admp'],['Fundamentos da República','art. 1º',''],['Objetivos fundamentais','art. 3º',''],
 ['Nacionalidade','art. 12','','dcon-nac'],['Militares dos estados','art. 42','PMs e CBMs são militares dos estados.','dcon-admp']]},

/* ---------- DIREITOS HUMANOS ---------- */
{id:'dh-ger',s:'dh',t:'dh-hist',type:'classify',title:'Gerações de direitos',desc:'Liberdade, igualdade, fraternidade.',cats:['1ª: liberdade','2ª: igualdade','3ª: fraternidade'],items:[
 ['Direito ao voto',0,'Direitos civis e políticos.','dh-pidcp'],['Liberdade de expressão',0,'','dh-pidcp'],['Direito de ir e vir',0,'','dh-pidcp'],['Direito de propriedade',0,'','dh-pidcp'],
 ['Direito à saúde',1,'Direitos sociais, econômicos e culturais.','dh-pidesc'],['Direito à educação',1,'','dh-pidesc'],['Direitos trabalhistas',1,'','dh-pidesc'],['Previdência social',1,'','dh-pidesc'],
 ['Meio ambiente ecologicamente equilibrado',2,'Direitos difusos, da coletividade.'],['Direito ao desenvolvimento',2,''],['Autodeterminação dos povos',2,'']]},
{id:'dh-vf',s:'dh',t:'dh-dudh',type:'tf',title:'Direitos humanos: panorama',desc:'Tratados, datas e status no Brasil.',items:[
 ['A Declaração Universal dos Direitos Humanos foi adotada pela Assembleia Geral da ONU em 1948.',true,'','dh-dudh'],
 ['A DUDH foi adotada em 1966.',false,'1966 é o ano dos dois Pactos Internacionais.','dh-dudh'],
 ['O Pacto de San José da Costa Rica foi elaborado no âmbito da ONU.',false,'Foi no âmbito da OEA (sistema interamericano).','dh-cadh'],
 ['O Pacto de San José foi promulgado no Brasil pelo Decreto 678/1992.',true,'','dh-cadh'],
 ['Pelo Pacto de San José, a única prisão civil por dívida admitida é a do devedor de alimentos.',true,'Por isso o STF vedou a prisão do depositário infiel (SV 25).','dh-cadh'],
 ['Os Pactos Internacionais sobre Direitos Civis e Políticos e sobre Direitos Econômicos, Sociais e Culturais são de 1966.',true,'Promulgados no Brasil em 1992.','dh-pidcp'],
 ['A Declaração de Pequim foi adotada na IV Conferência Mundial sobre a Mulher, em 1995.',true,'','dh-pequim'],
 ['A Liga das Nações e a OIT surgiram após a Primeira Guerra Mundial.',true,'Precedentes históricos da proteção internacional.','dh-hist'],
 ['Para o Estatuto da Pessoa Idosa, idosa é a pessoa com 65 anos ou mais.',false,'É com 60 anos ou mais (Lei 10.741/2003).','dh-idoso'],
 ['Tratado de direitos humanos aprovado em dois turnos, por três quintos, em cada Casa do Congresso equivale a emenda constitucional.',true,'CF, art. 5º, §3º.','dh-hist'],
 ['Tratados de direitos humanos aprovados sem esse rito têm status supralegal, segundo o STF.',true,'Acima das leis, abaixo da Constituição.','dh-hist']]},

/* ---------- LEGISLAÇÃO (panorama) ---------- */
{id:'lg-qual',s:'leg',t:'leg-pnspds',type:'pick',title:'Qual lei trata disso?',desc:'Panorama: cada lei e o seu tema. É o que resolve a maioria das questões de legislação.',items:[
 ['Institui o Sistema Único de Segurança Pública (Susp)','Lei 13.675/2018','Também cria a Política Nacional de Segurança Pública e Defesa Social (PNSPDS).','leg-pnspds'],
 ['Lei Orgânica Nacional das PMs e dos CBMs','Lei 14.751/2023','Normas gerais de organização das corporações militares estaduais.','leg-lonpm'],
 ['Política Nacional de Proteção e Defesa Civil','Lei 12.608/2012','Também trata do SINPDEC e do CONPDEC.','leg-pnpdec'],
 ['Violência doméstica e familiar contra a mulher','Lei 11.340/2006','Lei Maria da Penha.','leg-mariapenha'],
 ['Poder de polícia do CBMPR em segurança contra incêndio','Lei Estadual 19.449/2018','Lei do Paraná, alterada em 2025.','scip-lei'],
 ['Regulamenta a lei estadual de segurança contra incêndio','Decreto Estadual 11.868/2018','Decreto regulamenta lei.','scip-dec'],
 ['Estatuto da Criança e do Adolescente','Lei 8.069/1990','','eca-dir'],
 ['Estatuto da Pessoa Idosa','Lei 10.741/2003','','dh-idoso'],
 ['Licitações e contratos administrativos','Lei 14.133/2021','Nova Lei de Licitações.','apub-lic'],
 ['Promulga a Convenção Americana de Direitos Humanos','Decreto 678/1992','Pacto de San José.','dh-cadh']]},
{id:'lg-vf',s:'leg',t:'leg-lonpm',type:'tf',title:'Legislação: panorama',desc:'Do que cada lei trata e a quem se aplica. Sem decoreba de artigo.',items:[
 ['A Lei 13.675/2018 institui o Susp e cria a PNSPDS.',true,'','leg-pnspds'],
 ['O Susp reúne órgãos da União, dos estados, do DF e dos municípios.',true,'Integração federativa.','leg-pnspds'],
 ['Os corpos de bombeiros militares fazem parte do Susp.',true,'São integrantes operacionais.','leg-pnspds'],
 ['A Lei 14.751/2023 é a lei orgânica nacional das polícias militares e dos corpos de bombeiros militares.',true,'','leg-lonpm'],
 ['PMs e CBMs são forças auxiliares e reserva do Exército.',true,'CF, art. 144, §6º.','leg-lonpm'],
 ['Aos corpos de bombeiros militares cabem, além de outras atribuições, as atividades de defesa civil.',true,'CF, art. 144, §5º.','leg-lonpm'],
 ['A Lei 12.608/2012 prevê ações de prevenção, mitigação, preparação, resposta e recuperação.',true,'As cinco ações de proteção e defesa civil.','leg-pnpdec'],
 ['Pela Lei 12.608, a incerteza sobre o risco de desastre impede a adoção de medidas preventivas.',false,'É o contrário: a incerteza não impede a prevenção.','leg-pnpdec'],
 ['A Lei Maria da Penha só protege mulheres casadas.',false,'Protege em qualquer relação íntima de afeto, na unidade doméstica ou na família.','leg-mariapenha'],
 ['A Lei Maria da Penha se aplica independentemente da orientação sexual.',true,'','leg-mariapenha'],
 ['A Lei 19.449/2018 é uma lei federal.',false,'É lei estadual do Paraná.','scip-lei']]},
{id:'lg-penha',s:'leg',t:'leg-mariapenha',type:'classify',title:'Maria da Penha: formas de violência',desc:'As cinco formas previstas na lei.',cats:['Física','Psicológica','Sexual','Patrimonial','Moral'],items:[
 ['Empurrar ou agredir.',0,'Ofende a integridade ou a saúde corporal.'],['Ameaçar, vigiar e controlar comportamentos.',1,'Causa dano emocional.'],['Isolar a vítima de amigos e da família.',1,''],
 ['Impedir o uso de método contraceptivo.',2,'Também é violência sexual pela lei.'],['Quebrar o celular da vítima.',3,'Destruição de bens.'],['Reter documentos pessoais.',3,''],
 ['Espalhar que a vítima cometeu um crime que não cometeu.',4,'Calúnia, difamação ou injúria.'],['Humilhar publicamente para atacar a honra.',4,'']]},
{id:'lg-cobrade',s:'leg',t:'leg-pnpdec',type:'classify',title:'Desastres: qual grupo?',desc:'Classificação brasileira de desastres naturais (Cobrade).',cats:['Geológico','Hidrológico','Meteorológico','Climatológico'],items:[
 ['Deslizamento de terra',0,'Movimento de massa.'],['Erosão costeira',0,''],['Terremoto',0,''],['Inundação',1,'Rio transborda gradualmente.'],['Enxurrada',1,'Escoamento rápido e violento.'],
 ['Alagamento',1,'Água acumulada por drenagem insuficiente.'],['Vendaval',2,'Tempestade.'],['Granizo',2,''],['Tornado',2,''],['Estiagem',3,'Seca.'],['Incêndio florestal',3,'Fica no grupo das secas.']]},
{id:'lg-ciclo',s:'leg',t:'leg-pnpdec',type:'order',title:'Ações de proteção e defesa civil',desc:'A ordem lógica do ciclo de gestão de desastres.',items:[
 ['Ordene as ações da Lei 12.608',['Prevenção','Mitigação','Preparação','Resposta','Recuperação'],'Antes do desastre: prevenir, mitigar, preparar. Durante: responder. Depois: recuperar.']]},

/* ---------- ADMINISTRAÇÃO PÚBLICA (Lei 14.133) ---------- */
{id:'ap-modal',s:'apub',t:'apub-lic',type:'classify',title:'Modalidades de licitação',desc:'Lei 14.133: qual modalidade para cada objeto?',cats:['Pregão','Concorrência','Concurso','Leilão','Diálogo competitivo'],items:[
 ['Compra de material de escritório (bem comum).',0,'Pregão: bens e serviços comuns.'],['Obra de engenharia.',1,'Concorrência: bens e serviços especiais, obras e serviços de engenharia.'],
 ['Escolha de trabalho artístico, com prêmio ao vencedor.',2,'Concurso: trabalho técnico, científico ou artístico.'],['Venda de veículos inservíveis pelo maior lance.',3,'Leilão: alienação de bens.'],
 ['Solução inovadora que a Administração não sabe especificar sozinha.',4,'Diálogo competitivo: novidade da Lei 14.133.'],['Venda de imóvel da Administração.',3,'Leilão.'],['Escolha de projeto arquitetônico premiado.',2,'Concurso.']]},
{id:'ap-disp',s:'apub',t:'apub-disp',type:'classify',title:'Dispensa ou inexigibilidade?',desc:'Inexigível: competição impossível. Dispensável: possível, mas a lei permite não licitar.',cats:['Inexigibilidade','Dispensa'],items:[
 ['Fornecedor exclusivo do produto.',0,'Não há como competir.'],['Contratação de artista consagrado.',0,''],['Emergência ou calamidade pública.',1,'Poderia competir, mas a urgência justifica.'],
 ['Compra de pequeno valor.',1,'Limite de valor definido em lei.'],['Serviço técnico especializado de natureza intelectual, com notória especialização.',0,''],
 ['Licitação anterior deserta (nenhum interessado).',1,'Mantidas as condições, pode contratar diretamente.'],['Credenciamento.',0,'Previsto como hipótese de inexigibilidade.']]},
{id:'ap-fases',s:'apub',t:'apub-lic',type:'order',title:'Fases da licitação',desc:'Lei 14.133, art. 17.',items:[
 ['Ordene as fases',['Preparatória','Divulgação do edital','Propostas e lances','Julgamento','Habilitação','Recursal','Homologação'],'Na regra da Lei 14.133, o julgamento vem antes da habilitação.']]},
{id:'ap-vf',s:'apub',t:'apub-contr',type:'tf',title:'Licitações e contratos: panorama',desc:'O que muda com a Lei 14.133.',items:[
 ['A Lei 14.133 extinguiu as modalidades tomada de preços e convite.',true,'','apub-lic'],
 ['Na Lei 14.133, em regra o julgamento vem antes da habilitação.',true,'','apub-lic'],
 ['O diálogo competitivo é uma modalidade criada pela Lei 14.133.',true,'','apub-lic'],
 ['O pregão pode ser usado para obras de engenharia.',false,'O pregão é para bens e serviços comuns (inclui serviços comuns de engenharia, não obras).','apub-lic'],
 ['No leilão, o critério de julgamento é o maior lance.',true,'','apub-lic'],
 ['A Administração pode alterar unilateralmente o contrato.',true,'Cláusulas exorbitantes.','apub-contr'],
 ['O contratado deve aceitar acréscimos ou supressões de até 25% do valor inicial.',true,'Em reforma de edifício ou equipamento, até 50% para acréscimos.','apub-contr'],
 ['Contratos de serviços contínuos podem ter vigência de até 5 anos, prorrogável até 10.',true,'','apub-contr'],
 ['Licitação dispensável e inexigível são a mesma coisa.',false,'Inexigível: competição inviável. Dispensável: viável, mas a lei permite não licitar.','apub-disp']]},

/* ---------- ECA ---------- */
{id:'eca-med',s:'eca',t:'eca-ato',type:'classify',title:'Proteção ou socioeducativa?',desc:'Arts. 101 e 112 do ECA.',cats:['Medida de proteção','Medida socioeducativa'],items:[
 ['Advertência',1,'Socioeducativas: advertência, reparar o dano, serviços à comunidade, liberdade assistida, semiliberdade, internação.'],['Obrigação de reparar o dano',1,''],
 ['Prestação de serviços à comunidade',1,''],['Liberdade assistida',1,''],['Semiliberdade',1,''],['Internação',1,'Máximo de 3 anos.'],
 ['Encaminhamento aos pais mediante termo de responsabilidade',0,'','eca-prot'],['Matrícula e frequência obrigatórias em escola',0,'','eca-prot'],
 ['Acolhimento institucional',0,'','eca-prot'],['Requisição de tratamento médico ou psicológico',0,'','eca-prot']]},
{id:'eca-vf',s:'eca',t:'eca-dir',type:'tf',title:'ECA: panorama',desc:'Conceitos que mais caem.',items:[
 ['Criança é a pessoa até 12 anos incompletos; adolescente, de 12 a 18 anos.',true,'',''],
 ['Medidas socioeducativas podem ser aplicadas a crianças.',false,'Criança que pratica ato infracional recebe medida de proteção.','eca-ato'],
 ['Ato infracional é a conduta descrita como crime ou contravenção penal.',true,'','eca-ato'],
 ['A internação não pode passar de 3 anos.',true,'E a liberação é compulsória aos 21 anos.','eca-ato'],
 ['O Conselho Tutelar é órgão jurisdicional.',false,'É permanente, autônomo e não jurisdicional.','eca-prot'],
 ['A proteção integral é dever da família, da sociedade e do Estado.',true,'',''],
 ['O ECA pode ser aplicado, excepcionalmente, a pessoas entre 18 e 21 anos.',true,'Nos casos expressos em lei.','']]},

/* ---------- PRIMEIROS SOCORROS ---------- */
{id:'ps-seq',s:'ps',t:'ps-aval',type:'order',title:'Sequências do atendimento',desc:'A ordem salva vidas e cai na prova.',items:[
 ['XABCDE',['X: hemorragia exsanguinante','A: vias aéreas e coluna cervical','B: respiração','C: circulação','D: estado neurológico','E: exposição e hipotermia'],'Trate primeiro o que mata mais rápido.','ps-aval'],
 ['RCP no adulto',['Garantir a segurança da cena','Checar se a vítima responde','Chamar ajuda e pedir o DEA','Checar respiração e pulso (até 10 s)','Iniciar 30 compressões','Fazer 2 ventilações'],'Compressões de 100 a 120 por minuto, 5 a 6 cm.','ps-rcp'],
 ['Engasgo em adulto consciente',['Perguntar se está engasgado','Posicionar-se atrás da vítima','Fazer compressões abdominais','Se ficar inconsciente, iniciar RCP'],'Manobra de Heimlich.','ps-rcp']]},
{id:'ps-quei',s:'ps',t:'ps-quei',type:'classify',title:'Grau da queimadura',desc:'Pelas camadas atingidas e pelos sinais.',cats:['1º grau','2º grau','3º grau'],items:[
 ['Vermelhidão e dor, sem bolhas.',0,'Só a epiderme.'],['Bolhas (flictenas) e dor intensa.',1,'Epiderme e parte da derme.'],['Pele esbranquiçada ou carbonizada, com pouca dor.',2,'Terminações nervosas destruídas.'],
 ['Atinge apenas a epiderme.',0,''],['Atinge epiderme e parte da derme.',1,''],['Atinge todas as camadas, podendo chegar a músculos e ossos.',2,'']]},
{id:'ps-hem',s:'ps',t:'ps-hem',type:'classify',title:'Tipo de hemorragia',desc:'Cor e fluxo dizem de onde vem o sangue.',cats:['Arterial','Venosa','Capilar'],items:[
 ['Sangue vermelho vivo, saindo em jatos.',0,'Acompanha o pulso.'],['Sangue vermelho escuro, fluxo contínuo.',1,''],['Sangramento lento e pequeno, "babando".',2,'Ex.: arranhão.'],
 ['A mais grave e urgente.',0,'Perda rápida de volume.'],['Típica de ralado superficial.',2,'']]},
{id:'ps-vitais',s:'ps',t:'ps-anat',type:'pick',title:'Números do socorrista',desc:'Sinais vitais, Glasgow e regra dos 9.',items:[
 ['Frequência cardíaca normal (adulto)','60 a 100 bpm','','ps-aval'],['Frequência respiratória normal (adulto)','12 a 20 irpm','','ps-aval'],
 ['Pressão arterial de referência (adulto)','cerca de 120 × 80 mmHg','','ps-aval'],['Enchimento capilar normal','até 2 segundos','','ps-hem'],
 ['Pontuação mínima na Escala de Glasgow','3','','ps-trau'],['Pontuação máxima na Escala de Glasgow','15','','ps-trau'],['Glasgow que indica TCE grave','8 ou menos','','ps-trau'],
 ['Regra dos 9: cabeça do adulto','9%','','ps-quei'],['Regra dos 9: cada membro inferior do adulto','18%','','ps-quei'],['Regra dos 9: períneo','1%','','ps-quei'],
 ['Compressões por minuto na RCP','100 a 120','','ps-rcp'],['Relação compressão/ventilação no adulto','30:2','','ps-rcp']]},

/* ---------- SEGURANÇA CONTRA INCÊNDIO E PÂNICO (panorama) ---------- */
{id:'sc-medidas',s:'scip',t:'scip-med',type:'classify',title:'Proteção ativa ou passiva?',desc:'Ativa precisa ser acionada; passiva já está na edificação.',cats:['Ativa','Passiva'],items:[
 ['Extintores',0,'Precisam ser operados.'],['Hidrantes e mangotinhos',0,''],['Chuveiros automáticos (sprinklers)',0,'São acionados pelo calor.'],['Alarme e detecção de incêndio',0,''],
 ['Saídas de emergência',1,'Fazem parte da construção.'],['Compartimentação',1,'Barreiras que contêm o fogo.'],['Segurança estrutural contra incêndio',1,''],['Controle de materiais de acabamento',1,'']]},
{id:'sc-vf',s:'scip',t:'scip-lei',type:'tf',title:'Segurança contra incêndio: panorama',desc:'O quadro geral, sem decoreba de artigo.',items:[
 ['A Lei 19.449/2018 é uma lei estadual do Paraná.',true,'','scip-lei'],
 ['Ela trata do poder de polícia do CBMPR em prevenção e combate a incêndio e desastres.',true,'','scip-lei'],
 ['A Lei 19.449 foi alterada pela Lei 22.367/2025.',true,'Estude pelo texto atualizado.','scip-lei'],
 ['O Decreto 11.868/2018 regulamenta a Lei 19.449/2018.',true,'','scip-dec'],
 ['O TCAC serve para o responsável regularizar o imóvel dentro de um prazo acordado.',true,'Termo de Compromisso de Ajustamento de Conduta.','scip-dec'],
 ['CSCIP é o Código de Segurança Contra Incêndio e Pânico do CBMPR.',true,'','scip-med'],
 ['As NPTs são Normas de Procedimento Técnico do CBMPR.',true,'','scip-med'],
 ['A NPA 001 trata de vistoria, licenciamento e fiscalização.',true,'Versão de 2026.','scip-adm'],
 ['No Paraná, quem fiscaliza a segurança contra incêndio é a Polícia Civil.',false,'É o Corpo de Bombeiros Militar.','scip-lei']]},

/* ---------- COMBATE A INCÊNDIO ---------- */
{id:'cb-classes',s:'comb',t:'comb-cla',type:'classify',title:'Classes de incêndio',desc:'O material define a classe e o agente extintor.',cats:['A','B','C','D','K'],items:[
 ['Madeira',0,'Sólido que queima em superfície e profundidade e deixa resíduo.'],['Papel',0,''],['Tecido',0,''],['Borracha',0,''],['Gasolina',1,'Líquido inflamável.'],['GLP (gás de cozinha)',1,'Gás inflamável.'],
 ['Álcool',1,''],['Painel elétrico energizado',2,'Desligada a energia, vira a classe do material.'],['Computador ligado na tomada',2,''],['Magnésio',3,'Metal pirofórico.'],['Sódio metálico',3,''],['Óleo em fritadeira de cozinha',4,'Classe K.']]},
{id:'cb-metodos',s:'comb',t:'comb-cla',type:'classify',title:'Método de extinção',desc:'Qual lado do tetraedro você está atacando?',cats:['Resfriamento','Abafamento','Isolamento','Extinção química'],items:[
 ['Jogar água na madeira em chamas.',0,'Retira calor.'],['Tampar a panela em chamas.',1,'Retira o oxigênio.'],['Fechar a válvula do botijão.',2,'Retira o combustível.'],
 ['Pó químico interrompendo a reação.',3,'Quebra a reação em cadeia.'],['Retirar móveis do caminho do fogo.',2,''],['Abafar com cobertor.',1,'']]},
{id:'cb-prop',s:'comb',t:'comb-fases',type:'classify',title:'Propagação do calor',desc:'Condução, convecção ou irradiação?',cats:['Condução','Convecção','Irradiação'],items:[
 ['Viga de aço aquecida leva calor ao cômodo vizinho.',0,'Contato direto.'],['Fumaça quente sobe pela escada e incendeia os andares de cima.',1,'Massas de gases quentes.'],
 ['Prédio em chamas incendeia o vizinho sem contato.',2,'Ondas de calor.'],['O cabo da panela esquenta.',0,''],['Sentir o calor da fogueira à distância.',2,''],['Ar quente circulando no forno.',1,'']]},
{id:'cb-fases',s:'comb',t:'comb-fases',type:'order',title:'Fases do incêndio',desc:'Como um incêndio evolui num ambiente.',items:[
 ['Ordene as fases',['Ignição','Crescimento','Desenvolvimento completo','Decaimento'],'A transição entre crescimento e desenvolvimento completo pode ocorrer por flashover.']]},
{id:'cb-fenom',s:'comb',t:'comb-fases',type:'pick',title:'Fenômenos do incêndio',desc:'Os nomes que o oficial precisa conhecer.',items:[
 ['Ignição súbita e generalizada de todos os materiais do ambiente.','Flashover',''],['Explosão quando entra oxigênio num ambiente com fogo abafado.','Backdraft',''],
 ['Chamas percorrendo a camada de fumaça junto ao teto.','Rollover',''],['Soma de combustível, comburente, calor e reação em cadeia.','Tetraedro do fogo','','comb-tetra']]},
{id:'cb-jato',s:'comb',t:'comb-agua',type:'classify',title:'Jato compacto ou neblinado?',desc:'A água como agente extintor.',cats:['Jato compacto','Jato neblinado'],items:[
 ['Maior alcance e penetração.',0,''],['Maior absorção de calor.',1,'Gotas finas: mais superfície de contato.'],['Protege a guarnição com uma cortina de água.',1,''],['Atingir o foco à distância.',0,'']]},

/* ---------- HISTÓRIA DO PARANÁ ---------- */
{id:'hs-tl',s:'hist',t:'hist-emanc',type:'legacy',launch:'tlOpen',title:'Linha do tempo do Paraná',desc:'Coloque os fatos em ordem, do mais antigo ao mais recente.'},
{id:'hs-cloze',s:'hist',t:'hist-ocup',type:'legacy',launch:'clozeOpen',title:'Complete a frase',desc:'Fatos no contexto que explica cada um.'},
{id:'hs-mapa',s:'hist',t:'hist-ciclos',type:'legacy',launch:'mapOpen',title:'Mapa dos Ciclos',desc:'Toque na região onde cada ciclo aconteceu.'},
{id:'hs-vf',s:'hist',t:'hist-emanc',type:'legacy',launch:'vfOpen',title:'Verdadeiro ou falso',desc:'Frases rápidas que confundem na prova.'},

/* ---------- GEOGRAFIA (socioespacial) ---------- */
{id:'gg-reg',s:'geo',t:'geo-reg',type:'classify',title:'Regiões do IBGE',desc:'Em qual região fica cada estado?',cats:['Norte','Nordeste','Centro-Oeste','Sudeste','Sul'],items:[
 ['Paraná',4,''],['Mato Grosso do Sul',2,''],['Tocantins',0,'Faz parte do Norte desde 1988.'],['Maranhão',1,''],['Espírito Santo',3,''],['Rondônia',0,''],
 ['Piauí',1,''],['Goiás',2,''],['Santa Catarina',4,''],['Sergipe',1,''],['Amapá',0,''],['Distrito Federal',2,''],['Minas Gerais',3,'']]},
{id:'gg-geoec',s:'geo',t:'geo-reg',type:'classify',title:'Regiões geoeconômicas',desc:'A divisão de Pedro Geiger: Amazônia, Nordeste e Centro-Sul.',cats:['Amazônia','Nordeste','Centro-Sul'],items:[
 ['Paraná',2,''],['Mato Grosso do Sul',2,''],['São Paulo',2,''],['Amazonas',0,''],['Pará',0,''],['Acre',0,''],['Bahia',1,''],['Ceará',1,''],['Pernambuco',1,''],['Rio Grande do Sul',2,'']]},
{id:'gg-campo',s:'geo',t:'geo-campo',type:'classify',title:'Campo e cidade: conceitos',desc:'Os termos que aparecem nos enunciados.',cats:['Êxodo rural','Conurbação','Migração pendular','Concentração fundiária','Metropolização'],items:[
 ['Saída em massa da população do campo para a cidade.',0,''],['Cidades crescem até se unirem fisicamente.',1,''],['Ir e voltar todo dia entre a cidade onde mora e a cidade onde trabalha.',2,''],
 ['Muita terra nas mãos de poucos proprietários.',3,''],['Formação de regiões metropolitanas em torno de uma grande cidade.',4,'Ex.: Região Metropolitana de Curitiba.'],['Mecanização do campo expulsa trabalhadores rurais para as cidades.',0,'']]},
{id:'gg-ocup',s:'geo',t:'geo-ocup',type:'order',title:'Frentes de ocupação',desc:'A ordem em que o território foi ocupado.',items:[
 ['Ocupação do Paraná',['Litoral (ouro, século XVII)','Planalto de Curitiba e Campos Gerais (tropeirismo)','Imigração europeia no entorno de Curitiba (fim do século XIX)','Norte (café, a partir dos anos 1920-30)','Oeste e Sudoeste (gaúchos e catarinenses, a partir dos anos 1940)'],'Três frentes: tradicional (litoral e planalto), norte (paulista, café) e sul (gaúcha).'],
 ['Ciclos econômicos do Brasil',['Pau-brasil','Cana-de-açúcar','Mineração','Café','Industrialização'],'Séculos XVI a XX.','geo-ciclos']]},
{id:'gg-vf',s:'geo',t:'geo-povos',type:'tf',title:'Povos, território e Antártida',desc:'Panorama socioespacial.',items:[
 ['Kaingang e Guarani são povos indígenas presentes no Paraná.',true,'','geo-povos'],
 ['Comunidades quilombolas têm ancestralidade negra ligada à resistência à escravidão.',true,'','geo-povos'],
 ['A Constituição reconhece aos remanescentes de quilombos a propriedade definitiva das terras que ocupam.',true,'ADCT, art. 68.','geo-povos'],
 ['Terras indígenas são propriedade privada dos indígenas.',false,'São bens da União, com posse permanente dos indígenas.','geo-povos'],
 ['Os faxinais são comunidades tradicionais do centro-sul do Paraná, com uso comum da terra.',true,'','geo-povos'],
 ['Caiçaras são comunidades tradicionais do litoral.',true,'','geo-povos'],
 ['O Tratado da Antártida reserva o continente para fins pacíficos e científicos.',true,'Assinado em 1959.','geo-antart'],
 ['O Brasil mantém a Estação Antártica Comandante Ferraz.',true,'','geo-antart'],
 ['A mineração é liberada na Antártida.',false,'O Protocolo de Madri proíbe a exploração mineral.','geo-antart'],
 ['A Antártida concentra a maior reserva de água doce do planeta, em forma de gelo.',true,'','geo-antart'],
 ['A Conferência de Berlim (1884-1885) dividiu a África entre potências europeias.',true,'Fronteiras traçadas sem respeitar etnias.','geo-form'],
 ['O Tratado de Tordesilhas (1494) dividiu terras entre Portugal e Espanha.',true,'','geo-form']]},

/* ---------------- Novos: pontos de Física e Química que ainda não tinham jogo ---------------- */
{id:'fs-ond',s:'fis',t:'fis-ond',type:'classify',title:'Ondas: transversal ou longitudinal?',desc:'A direção da vibração em relação à propagação.',cats:['Transversal','Longitudinal'],items:[
 ['Onda numa corda esticada, balançada de lado a lado',0,'A vibração é perpendicular à propagação.'],
 ['Onda sonora no ar',1,'O ar vibra na mesma direção em que o som se propaga.'],
 ['Onda numa mola comprimida e esticada (tipo "slinky")',1,'Compressões e distensões na mesma direção da propagação.'],
 ['Onda eletromagnética (luz, rádio)',0,'Os campos elétrico e magnético oscilam perpendicularmente à propagação.'],
 ['Onda na superfície da água',0,'A água sobe e desce enquanto a onda avança para os lados.']]},
{id:'fs-opt',s:'fis',t:'fis-opt',type:'pick',title:'Óptica: o que faz cada elemento?',desc:'Espelhos e lentes, direto ao ponto.',items:[
 ['Espelho plano: tipo de imagem formada','Virtual, direita e do mesmo tamanho do objeto',''],
 ['Lente que une os raios de luz','Lente convergente',''],
 ['Lente que espalha os raios de luz','Lente divergente',''],
 ['Fenômeno em que a luz volta ao mesmo meio','Reflexão',''],
 ['Fenômeno em que a luz muda de meio e de velocidade','Refração',''],
 ['Unidade de vergência (grau dos óculos)','Dioptria',''],
 ['Tipo de imagem que a lente divergente sempre forma','Virtual','']]},
{id:'fs-elst',s:'fis',t:'fis-elst',type:'tf',title:'Eletrostática: verdadeiro ou falso',desc:'As regras básicas de cargas elétricas.',items:[
 ['Cargas de mesmo sinal se atraem.',false,'Cargas de mesmo sinal se repelem; sinais opostos se atraem.'],
 ['A Lei de Coulomb diz que a força elétrica é inversamente proporcional ao quadrado da distância.',true,''],
 ['Metais são bons condutores de eletricidade.',true,'Têm elétrons livres que circulam com facilidade.'],
 ['Borracha é um bom condutor elétrico.',false,'Borracha é isolante: dificulta a circulação de cargas.'],
 ['A carga elétrica de um próton é oposta à do elétron, mas de mesmo valor.',true,''],
 ['Um corpo eletrizado positivamente perdeu elétrons.',true,'']]},
{id:'qm-atom',s:'qui',t:'qui-atom',type:'classify',title:'Estrutura atômica: o que é o quê?',desc:'Prótons, nêutrons, elétrons e a tabela periódica.',cats:['Número atômico (Z)','Número de massa (A)','Camada de valência','Período','Família (grupo)'],items:[
 ['Número de prótons do átomo',0,''],
 ['Soma de prótons e nêutrons',1,''],
 ['Última camada eletrônica, onde ocorrem as ligações',2,''],
 ['Linha horizontal da tabela periódica',3,'Indica o número de camadas eletrônicas.'],
 ['Coluna vertical da tabela periódica',4,'Elementos com propriedades químicas parecidas.'],
 ['O que dois isótopos do mesmo elemento têm igual',0,'Isótopos têm o mesmo número atômico (Z), mas número de massa (A) diferente.']]},
{id:'qm-gas',s:'qui',t:'qui-gas',type:'pick',title:'Leis dos gases: qual é qual?',desc:'Pressão, volume e temperatura, dois de cada vez.',items:[
 ['A temperatura constante, P×V é constante','Lei de Boyle',''],
 ['A pressão constante, V/T é constante','Lei de Charles',''],
 ['A volume constante, P/T é constante','Lei de Gay-Lussac',''],
 ['Equação que reúne pressão, volume, mols e temperatura','Equação de Clapeyron (PV = nRT)',''],
 ['Temperatura teórica mínima, 0 kelvin','Zero absoluto (−273°C)','']]},
{id:'qm-reac',s:'qui',t:'qui-reac',type:'classify',title:'Tipo de reação química',desc:'Síntese, decomposição, simples ou dupla troca.',cats:['Síntese','Decomposição','Simples troca','Dupla troca'],items:[
 ['Dois reagentes se juntam formando um único produto',0,'A + B → AB'],
 ['Um único reagente se quebra em dois ou mais produtos',1,'AB → A + B'],
 ['Um elemento troca de lugar com outro dentro de um composto',2,'A + BC → AC + B'],
 ['Dois compostos trocam íons entre si',3,'AB + CD → AD + CB'],
 ['Eletrólise da água formando gás hidrogênio e gás oxigênio',1,'Decomposição pela corrente elétrica.'],
 ['Ferro reagindo com ácido, liberando gás hidrogênio',2,'O ferro toma o lugar do hidrogênio no ácido.']]}
];

/* ================= Geradores de problemas (Exatas) ================= */
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const one=a=>a[Math.floor(Math.random()*a.length)];
function nf(n){ return (Math.round(n*100)/100).toLocaleString('pt-BR',{maximumFractionDigits:2}); }
function sup(n){ const m={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}; return String(n).split('').map(c=>m[c]||c).join(''); }
function sgn(b){ return b<0?'− '+Math.abs(b):'+ '+b; }
function numOpts(ans,unit,cands){
  const out=[ans], seen=new Set([Math.round(ans*100)/100]);
  const base=(cands||[]).concat([ans*2,ans/2,ans+(Math.abs(ans)>=10?Math.round(Math.abs(ans)*0.1):1),ans-(Math.abs(ans)>=10?Math.round(Math.abs(ans)*0.1):1),ans*10,ans/10,ans+2,ans-2,ans*3]);
  for(const c of base){ if(out.length>=4) break; if(!isFinite(c)) continue; const v=Math.round(c*100)/100; if(seen.has(v)) continue; if(ans>0&&v<=0) continue; seen.add(v); out.push(v); }
  let g=0; while(out.length<4&&g<50){ g++; const v=Math.round((ans+ri(1,9)*(Math.random()<.5?-1:1))*100)/100; if(!seen.has(v)&&!(ans>0&&v<=0)){ seen.add(v); out.push(v); } }
  const sh=shuffle(out); return {opts:sh.map(v=>nf(v)+(unit?' '+unit:'')),right:sh.indexOf(ans)};
}
function strOpts(ans,ds){ const u=[...new Set(ds.filter(d=>d!==ans))].slice(0,3); const sh=shuffle([ans].concat(u)); return {opts:sh,right:sh.indexOf(ans)}; }
const GEN={
  frac(){ const d=one([2,3,4,5,8,10]), n=ri(1,d-1), tot=d*ri(2,12)*one([1,2,5]), a=tot*n/d;
    return {t:'mat-ops',q:'Quanto é '+n+'/'+d+' de '+tot+'?',...numOpts(a,'',[tot/d,tot*n,a+tot/d]),steps:['Divida pelo denominador: '+tot+' ÷ '+d+' = '+nf(tot/d),'Multiplique pelo numerador: '+nf(tot/d)+' × '+n+' = '+nf(a)]}; },
  pot(){ const b=one([2,3,5,10]), x=ri(1,3), y=ri(1,3), a=Math.pow(b,x+y);
    return {t:'mat-ops',q:'Calcule '+b+sup(x)+' × '+b+sup(y)+'.',...numOpts(a,'',[Math.pow(b,x*y),b*(x+y),Math.pow(b,x)+Math.pow(b,y)]),steps:['Mesma base, multiplicação: some os expoentes → '+b+sup(x+y),b+sup(x+y)+' = '+nf(a)]}; },
  notc(){ const m=ri(11,99)/10, e=one([-5,-4,-3,-2,3,4,5,6]); const val=Number((m*Math.pow(10,e)).toPrecision(2)); const dec=val.toLocaleString('pt-BR',{maximumFractionDigits:10});
    const f=(mm,ee)=>nf(mm)+' × 10'+sup(ee); const ans=f(m,e);
    return {t:'fis-unid',q:'Escreva '+dec+' em notação científica.',...strOpts(ans,[f(m,e+1),f(m,e-1),f(m*10,e-1),f(m,-e)]),steps:['Notação científica: um número entre 1 e 10 vezes uma potência de 10.','Ande com a vírgula até ficar '+nf(m)+': foram '+Math.abs(e)+' casas '+(e<0?'para a direita (expoente negativo)':'para a esquerda (expoente positivo)')+'.','Resposta: '+ans]}; },
  r3(){ if(Math.random()<.5){ const k=ri(2,9), a=ri(2,8), b=a+ri(1,6), pa=k*a, ans=k*b;
      return {t:'mat-prop',q:a+' kg de um produto custam R$ '+pa+'. Quanto custam '+b+' kg?',...numOpts(ans,'',[pa*a/b,pa+b,ans+k]),steps:['Grandezas diretamente proporcionais: mais quilos, mais caro.','Preço de 1 kg: '+pa+' ÷ '+a+' = '+k,b+' kg: '+b+' × '+k+' = R$ '+ans]}; }
    const [n1,h1,n2,h2]=one([[2,6,3,4],[3,8,4,6],[4,6,6,4],[6,4,8,3],[5,12,6,10],[4,9,6,6],[3,10,5,6],[2,9,6,3]]);
    return {t:'mat-prop',q:n1+' bombeiros fazem um rescaldo em '+h1+' h. Em quanto tempo '+n2+' bombeiros fariam o mesmo serviço, no mesmo ritmo?',...numOpts(h2,'h',[h1*n2/n1,h1+n2-n1,h1-1]),steps:['Grandezas inversamente proporcionais: mais gente, menos tempo.','Trabalho total: '+n1+' × '+h1+' = '+(n1*h1)+' bombeiro-horas',(n1*h1)+' ÷ '+n2+' = '+h2+' h']}; },
  porc(){ const k=ri(0,3);
    if(k===0){ const p=one([5,10,12,15,20,25,30,40,75]), v=one([80,120,160,200,240,300,400,500,600,800]), a=v*p/100;
      return {t:'mat-porc',q:'Quanto é '+p+'% de '+v+'?',...numOpts(a,'',[v/p,a*10,a*2]),steps:[p+'% = '+p+'/100',v+' × '+p+' ÷ 100 = '+nf(a)]}; }
    if(k===1||k===2){ const p=one([10,15,20,25,30]), v=one([100,200,250,400,500,800,1000]), up=k===1, a=v*(1+(up?1:-1)*p/100);
      return {t:'mat-porc',q:'Um equipamento custava R$ '+nf(v)+' e teve '+(up?'aumento':'desconto')+' de '+p+'%. Qual o novo preço?',...numOpts(a,'',[v*p/100,v*(1+(up?-1:1)*p/100),v+(up?p:-p)]),steps:[(up?'Aumento':'Desconto')+' de '+p+'% → multiplique por '+nf(1+(up?1:-1)*p/100),nf(v)+' × '+nf(1+(up?1:-1)*p/100)+' = R$ '+nf(a)]}; }
    const C=one([500,1000,2000,5000]), i=one([1,2,3,5]), t=ri(2,12), J=C*i*t/100;
    return {t:'mat-porc',q:'Qual o juro simples de R$ '+nf(C)+' a '+i+'% ao mês durante '+t+' meses?',...numOpts(J,'',[C*i/100,J+C,C*i*t/10]),steps:['Juros simples: J = C · i · t','J = '+nf(C)+' × '+i+'/100 × '+t+' = R$ '+nf(J)]}; },
  eq1(){ const x=ri(-6,12), a=one([2,3,4,5,6,7]), b=ri(-15,20)||3, c=a*x+b;
    return {t:'mat-eq',q:'Resolva: '+a+'x '+sgn(b)+' = '+c,...numOpts(x,'',[(c+b)/a,c-b,-x]),steps:['Passe o '+b+' para o outro lado trocando o sinal: '+a+'x = '+c+' '+sgn(-b)+' = '+(c-b),'Divida por '+a+': x = '+(c-b)+' ÷ '+a+' = '+x]}; },
  eq2(){ let r1=ri(-5,6), r2=ri(-5,6); if(r1===r2) r2=r1+2; const S=r1+r2, P=r1*r2; const eq='x² '+(S===0?'':(S>0?'− '+S+'x ':'+ '+(-S)+'x '))+(P===0?'':sgn(P)+' ')+'= 0'; const k=ri(0,2);
    if(k===0) return {t:'mat-eq',q:'Qual a soma das raízes de '+eq+'?',...numOpts(S,'',[-S,P,S+1]),steps:['Soma das raízes = −b/a','−('+(-S)+')/1 = '+S]};
    if(k===1) return {t:'mat-eq',q:'Qual o produto das raízes de '+eq+'?',...numOpts(P,'',[-P,S,P+1]),steps:['Produto das raízes = c/a',P+'/1 = '+P]};
    const M=Math.max(r1,r2); return {t:'mat-eq',q:'Qual a maior raiz de '+eq+'?',...numOpts(M,'',[Math.min(r1,r2),-M,S]),steps:['Procure dois números com soma '+S+' e produto '+P+': '+r1+' e '+r2,'Maior raiz: '+M]}; },
  fun(){ if(Math.random()<.6){ const a=one([-3,-2,2,3,4,5]), b=ri(-8,8), k=ri(-4,6), v=a*k+b;
      return {t:'mat-fun',q:'Se f(x) = '+a+'x '+sgn(b)+', quanto vale f('+k+')?',...numOpts(v,'',[a*k-b,a+k+b,-v]),steps:['Troque x por '+k+': f('+k+') = '+a+' · ('+k+') '+sgn(b),'= '+(a*k)+' '+sgn(b)+' = '+v]}; }
    const h=ri(-4,5), c=ri(-6,8), b=-2*h; return {t:'mat-fun',q:'Qual o x do vértice de f(x) = x² '+(b===0?'':sgn(b)+'x ')+sgn(c)+'?',...numOpts(h,'',[-h,b,h+1]),steps:['x do vértice = −b/(2a)','−('+b+')/(2 · 1) = '+h]}; },
  pa(){ const a1=ri(1,20), r=ri(2,9), n=ri(5,15), an=a1+(n-1)*r;
    if(Math.random()<.5) return {t:'mat-pa',q:'Numa PA, a₁ = '+a1+' e a razão é '+r+'. Qual o '+n+'º termo?',...numOpts(an,'',[a1+n*r,a1*n,an+r]),steps:['aₙ = a₁ + (n − 1) · r',a1+' + '+(n-1)+' · '+r+' = '+an]};
    const Sn=n*(a1+an)/2; return {t:'mat-pa',q:'Qual a soma dos '+n+' primeiros termos da PA com a₁ = '+a1+' e aₙ = '+an+'?',...numOpts(Sn,'',[(a1+an)*n,Sn+an,a1*n]),steps:['Sₙ = n · (a₁ + aₙ) / 2',n+' · ('+a1+' + '+an+') / 2 = '+nf(Sn)]}; },
  pg(){ const a1=one([1,2,3,5]), q=one([2,3]), n=ri(3,6), an=a1*Math.pow(q,n-1);
    return {t:'mat-pa',q:'Numa PG, a₁ = '+a1+' e a razão é '+q+'. Qual o '+n+'º termo?',...numOpts(an,'',[a1*Math.pow(q,n),a1+(n-1)*q,an/q]),steps:['aₙ = a₁ · q'+sup('n−1').replace('n','ⁿ'),a1+' · '+q+sup(n-1)+' = '+an]}; },
  log(){ const k=ri(0,2);
    if(k===0){ const e=ri(-2,5); return {t:'mat-exp',q:'Quanto vale log '+(Math.pow(10,e)).toLocaleString('pt-BR',{maximumFractionDigits:5})+'? (base 10)',...numOpts(e,'',[e+1,-e,e*10]),steps:['log de 10 elevado a n é n (base 10).','O número é 10'+sup(e)+' → log = '+e]}; }
    const b=one([2,3]), x=ri(2,6), v=Math.pow(b,x);
    return {t:'mat-exp',q:'Resolva: '+b+'ˣ = '+v,...numOpts(x,'',[v/b,x+1,x-1]),steps:['Escreva '+v+' como potência de '+b+': '+b+sup(x),'Bases iguais → expoentes iguais: x = '+x]}; },
  area(){ const k=ri(0,3);
    if(k===0){ const b=ri(3,20), h=ri(2,15); return {t:'mat-gp',q:'Área de um retângulo de '+b+' m por '+h+' m?',...numOpts(b*h,'m²',[2*(b+h),b+h,b*h/2]),steps:['A = base × altura',b+' × '+h+' = '+(b*h)+' m²']}; }
    if(k===1){ const b=ri(2,10)*2, h=ri(3,14); return {t:'mat-gp',q:'Área de um triângulo de base '+b+' m e altura '+h+' m?',...numOpts(b*h/2,'m²',[b*h,b+h,b*h/4]),steps:['A = (base × altura) / 2','('+b+' × '+h+') / 2 = '+(b*h/2)+' m²']}; }
    if(k===2){ const r=ri(1,10); return {t:'mat-gp',q:'Área de um círculo de raio '+r+' m? (use π = 3)',...numOpts(3*r*r,'m²',[2*3*r,3*r,9*r*r]),steps:['A = π · r²','3 × '+r+'² = 3 × '+(r*r)+' = '+(3*r*r)+' m²']}; }
    const [a,b,c]=one([[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[12,16,20]]); return {t:'mat-gp',q:'Triângulo retângulo com catetos '+a+' e '+b+'. Quanto mede a hipotenusa?',...numOpts(c,'',[a+b,c+1,Math.round((a*a+b*b)/2)]),steps:['Pitágoras: a² = b² + c²',a+'² + '+b+'² = '+(a*a)+' + '+(b*b)+' = '+(c*c),'√'+(c*c)+' = '+c]}; },
  vol(){ const k=ri(0,2);
    if(k===0){ const a=ri(2,9); return {t:'mat-ge',q:'Volume de um cubo de aresta '+a+' m?',...numOpts(a*a*a,'m³',[a*a*6,a*3,a*a]),steps:['V = a³',a+'³ = '+(a*a*a)+' m³']}; }
    if(k===1){ const a=ri(2,8), b=ri(2,8), c=ri(2,6); return {t:'mat-ge',q:'Volume de uma caixa d\u2019água de '+a+' m × '+b+' m × '+c+' m?',...numOpts(a*b*c,'m³',[a+b+c,2*(a*b+a*c+b*c),a*b]),steps:['V = comprimento × largura × altura',a+' × '+b+' × '+c+' = '+(a*b*c)+' m³','Lembre: 1 m³ = 1.000 litros.']}; }
    const r=ri(1,5), h=ri(2,10); return {t:'mat-ge',q:'Volume de um cilindro de raio '+r+' m e altura '+h+' m? (π = 3)',...numOpts(3*r*r*h,'m³',[3*r*h,2*3*r*h,3*r*r]),steps:['V = π · r² · h','3 × '+(r*r)+' × '+h+' = '+(3*r*r*h)+' m³']}; },
  media(){ if(Math.random()<.5){ const m=ri(5,15), d=shuffle([-3,-1,0,1,3]), xs=d.map(x=>m+x*ri(1,2)); const s=xs.reduce((a,b)=>a+b,0), mean=s/5;
      return {t:'mat-est',q:'Média aritmética de '+xs.join(', ')+'?',...numOpts(mean,'',[s,mean+1,xs.slice().sort((a,b)=>a-b)[2]+2]),steps:['Some: '+xs.join(' + ')+' = '+s,'Divida por 5: '+s+' ÷ 5 = '+nf(mean)]}; }
    const xs=Array.from({length:5},()=>ri(1,30)); const so=xs.slice().sort((a,b)=>a-b);
    return {t:'mat-est',q:'Mediana de '+xs.join(', ')+'?',...numOpts(so[2],'',[xs[2],so[1],so[3]]),steps:['Ordene: '+so.join(', '),'Termo do meio: '+so[2]]}; },
  comb(){ const k=ri(0,2);
    if(k===0){ const n=ri(3,6); let f=1; for(let i=2;i<=n;i++) f*=i; return {t:'mat-comb',q:'De quantas formas '+n+' bombeiros podem ser organizados em fila?',...numOpts(f,'',[n*n,f/n,n*2]),steps:['Permutação: '+n+'!',Array.from({length:n},(_,i)=>n-i).join(' × ')+' = '+f]}; }
    if(k===1){ const n=ri(4,10), c=n*(n-1)/2; return {t:'mat-comb',q:n+' oficiais se cumprimentam uma vez cada par. Quantos apertos de mão?',...numOpts(c,'',[n*(n-1),n*n,c+n]),steps:['Combinação de '+n+' tomados 2 a 2 (ordem não importa)','C = '+n+' × '+(n-1)+' / 2 = '+c]}; }
    const ev=one([['sair número par','1/2','3 de 6'],['sair número maior que 4','1/3','2 de 6'],['sair múltiplo de 3','1/3','2 de 6'],['sair o número 6','1/6','1 de 6'],['sair número menor que 6','5/6','5 de 6']]);
    return {t:'mat-comb',q:'Num dado comum, qual a probabilidade de '+ev[0]+'?',...strOpts(ev[1],['1/2','1/3','1/6','2/3','5/6','1/4']),steps:['Casos favoráveis ÷ casos possíveis',ev[2]+' = '+ev[1]]}; },
  det(){ const a=ri(-4,9), b=ri(-4,9), c=ri(-4,9), d=ri(-4,9), D=a*d-b*c;
    return {t:'mat-mtz',q:'Determinante de [['+a+', '+b+'], ['+c+', '+d+']]?',...numOpts(D,'',[a*d+b*c,a+d,b*c-a*d]),steps:['det = a·d − b·c','('+a+')·('+d+') − ('+b+')·('+c+') = '+(a*d)+' − '+(b*c)+' = '+D]}; },
  dist(){ const [p,q,r]=one([[3,4,5],[6,8,10],[5,12,13],[8,6,10]]); const x1=ri(-3,5), y1=ri(-3,5);
    return {t:'mat-analit',q:'Distância entre A('+x1+', '+y1+') e B('+(x1+p)+', '+(y1+q)+')?',...numOpts(r,'',[p+q,r*r,r+1]),steps:['d = √(Δx² + Δy²)','Δx = '+p+', Δy = '+q,'√('+(p*p)+' + '+(q*q)+') = √'+(r*r)+' = '+r]}; },
  deriv(){ const a=ri(2,6), n=ri(2,4), k=ri(1,3), v=n*a*Math.pow(k,n-1);
    return {t:'mat-calc',q:'Se f(x) = '+a+'x'+sup(n)+', quanto vale f\u2032('+k+')?',...numOpts(v,'',[a*Math.pow(k,n),n*a,v*k]),steps:['Regra da potência: f\u2032(x) = n · a · xⁿ⁻¹ = '+(n*a)+'x'+sup(n-1),'f\u2032('+k+') = '+(n*a)+' · '+k+sup(n-1)+' = '+v]}; },
  kmh(){ const ms=one([5,10,15,20,25,30]), kh=ms*3.6;
    if(Math.random()<.5) return {t:'fis-unid',q:'Uma viatura anda a '+nf(kh)+' km/h. Quanto é em m/s?',...numOpts(ms,'m/s',[kh*3.6,kh/10,ms*2]),steps:['De km/h para m/s: divida por 3,6',nf(kh)+' ÷ 3,6 = '+ms+' m/s']};
    return {t:'fis-unid',q:'Quanto é '+ms+' m/s em km/h?',...numOpts(kh,'km/h',[ms/3.6,ms*10,kh/2]),steps:['De m/s para km/h: multiplique por 3,6',ms+' × 3,6 = '+nf(kh)+' km/h']}; },
  vm(){ const t=ri(2,6), v=one([40,50,60,70,80,90,100]), s=v*t;
    return {t:'fis-cin',q:'Uma viatura percorre '+s+' km em '+t+' h. Qual a velocidade média?',...numOpts(v,'km/h',[s*t,v+10,s/2]),steps:['vm = Δs / Δt',s+' ÷ '+t+' = '+v+' km/h']}; },
  muv(){ const v0=ri(0,10), a=ri(1,5), t=ri(2,10), v=v0+a*t;
    return {t:'fis-cin',q:'Um corpo tem v₀ = '+v0+' m/s e aceleração '+a+' m/s². Qual a velocidade após '+t+' s?',...numOpts(v,'m/s',[a*t,v0*a*t,v+a]),steps:['v = v₀ + a · t',v0+' + '+a+' × '+t+' = '+v+' m/s']}; },
  queda(){ const t=ri(1,5);
    if(Math.random()<.5) return {t:'fis-cin',q:'Um objeto cai do repouso. Qual sua velocidade após '+t+' s? (g = 10 m/s²)',...numOpts(10*t,'m/s',[5*t*t,10*t*t,t]),steps:['Queda livre: v = g · t','10 × '+t+' = '+(10*t)+' m/s']};
    return {t:'fis-cin',q:'Quantos metros um objeto cai, a partir do repouso, em '+t+' s? (g = 10 m/s²)',...numOpts(5*t*t,'m',[10*t,10*t*t,5*t]),steps:['h = g · t² / 2','10 × '+(t*t)+' / 2 = '+(5*t*t)+' m']}; },
  newton(){ if(Math.random()<.6){ const m=ri(2,50), a=ri(1,6); return {t:'fis-din',q:'Força resultante para acelerar '+m+' kg a '+a+' m/s²?',...numOpts(m*a,'N',[m+a,m/a,m*a*10]),steps:['F = m · a',m+' × '+a+' = '+(m*a)+' N']}; }
    const m=ri(2,120); return {t:'fis-din',q:'Qual o peso de um corpo de '+m+' kg? (g = 10 m/s²)',...numOpts(m*10,'N',[m,m/10,m*100]),steps:['P = m · g',m+' × 10 = '+(m*10)+' N']}; },
  qm(){ const m=ri(2,80), v=ri(2,20); return {t:'fis-qm',q:'Quantidade de movimento de '+m+' kg a '+v+' m/s?',...numOpts(m*v,'kg·m/s',[m*v*v/2,m+v,m*v*2]),steps:['Q = m · v',m+' × '+v+' = '+(m*v)+' kg·m/s']}; },
  ec(){ const m=one([2,4,6,10,20,50,80,100]), v=one([2,4,5,10,20]), e=m*v*v/2; return {t:'fis-ene',q:'Energia cinética de '+m+' kg a '+v+' m/s?',...numOpts(e,'J',[m*v,m*v*v,m*v/2]),steps:['Ec = m · v² / 2',m+' × '+(v*v)+' / 2 = '+nf(e)+' J']}; },
  ep(){ const m=ri(2,80), h=ri(1,20), e=m*10*h; return {t:'fis-ene',q:'Energia potencial de '+m+' kg a '+h+' m de altura? (g = 10 m/s²)',...numOpts(e,'J',[m*h,e/2,e*10]),steps:['Ep = m · g · h',m+' × 10 × '+h+' = '+e+' J']}; },
  trab(){ if(Math.random()<.5){ const F=ri(1,20)*10, d=ri(2,20); return {t:'fis-ene',q:'Trabalho de uma força de '+F+' N ao longo de '+d+' m (mesma direção)?',...numOpts(F*d,'J',[F+d,F/d,F*d*2]),steps:['τ = F · d',F+' × '+d+' = '+(F*d)+' J']}; }
    const t=ri(2,10), P=ri(1,20)*10, W=P*t; return {t:'fis-ene',q:'Um motor realiza '+W+' J em '+t+' s. Qual a potência?',...numOpts(P,'W',[W*t,W,P*2]),steps:['P = τ / t',W+' ÷ '+t+' = '+P+' W']}; },
  press(){ const F=one([100,200,500,1000,2000]), A=one([0.5,1,2,4,5]), p=F/A; return {t:'fis-hid',q:'Pressão de uma força de '+F+' N sobre '+nf(A)+' m²?',...numOpts(p,'Pa',[F*A,p*2,p/10]),steps:['p = F / A',F+' ÷ '+nf(A)+' = '+nf(p)+' Pa']}; },
  hidro(){ const h=ri(1,30), p=1000*10*h; return {t:'fis-hid',q:'Pressão da água (sem a atmosférica) a '+h+' m de profundidade? (d = 1.000 kg/m³, g = 10 m/s²)',...numOpts(p,'Pa',[1000*h,p*10,p/10]),steps:['p = d · g · h','1.000 × 10 × '+h+' = '+nf(p)+' Pa','Dica: cada 10 m de água ≈ 1 atm a mais.']}; },
  calor(){ const m=ri(1,10)*50, dT=ri(1,12)*5, Q=m*dT; return {t:'fis-term',q:'Calor para aquecer '+m+' g de água em '+dT+' °C? (c = 1 cal/g·°C)',...numOpts(Q,'cal',[m+dT,Q/10,Q*2]),steps:['Q = m · c · ΔT',m+' × 1 × '+dT+' = '+nf(Q)+' cal']}; },
  temp(){ const C=ri(-4,20)*5; if(Math.random()<.5) return {t:'fis-term',q:C+' °C em kelvin?',...numOpts(C+273,'K',[C-273,C+32,C*1.8+32]),steps:['K = °C + 273',C+' + 273 = '+(C+273)+' K']};
    const F=1.8*C+32; return {t:'fis-term',q:C+' °C em graus Fahrenheit?',...numOpts(F,'°F',[C+32,C*1.8,C+273]),steps:['°F = 1,8 · °C + 32','1,8 × '+C+' + 32 = '+nf(F)+' °F']}; },
  onda(){ const l=one([0.5,1,2,3,4,5]), f=one([10,20,50,100,170]), v=l*f; return {t:'fis-ond',q:'Onda com comprimento '+nf(l)+' m e frequência '+f+' Hz. Qual a velocidade?',...numOpts(v,'m/s',[f/l,l+f,v*2]),steps:['v = λ · f',nf(l)+' × '+f+' = '+nf(v)+' m/s']}; },
  ohm(){ const k=ri(0,4), R=one([2,4,5,10,20,50]), i=one([1,2,3,4,5]), U=R*i;
    if(k===0) return {t:'fis-eldin',q:'Tensão num resistor de '+R+' Ω com corrente de '+i+' A?',...numOpts(U,'V',[R/i,R+i,U*2]),steps:['U = R · i',R+' × '+i+' = '+U+' V']};
    if(k===1) return {t:'fis-eldin',q:'Corrente num resistor de '+R+' Ω ligado a '+U+' V?',...numOpts(i,'A',[U*R,R/U,i+1]),steps:['i = U / R',U+' ÷ '+R+' = '+i+' A']};
    if(k===2) return {t:'fis-eldin',q:'Potência de um aparelho em '+U+' V com corrente de '+i+' A?',...numOpts(U*i,'W',[U/i,U+i,U*i*2]),steps:['P = U · i',U+' × '+i+' = '+(U*i)+' W']};
    if(k===3){ const R2=one([2,4,5,10,20]); return {t:'fis-eldin',q:'Resistência equivalente de '+R+' Ω e '+R2+' Ω em série?',...numOpts(R+R2,'Ω',[R*R2/(R+R2),R*R2,Math.abs(R-R2)||1]),steps:['Em série: some → '+R+' + '+R2+' = '+(R+R2)+' Ω']}; }
    return {t:'fis-eldin',q:'Dois resistores iguais de '+R+' Ω em paralelo. Resistência equivalente?',...numOpts(R/2,'Ω',[R*2,R,R/4]),steps:['Dois iguais em paralelo: R/2',R+' ÷ 2 = '+nf(R/2)+' Ω']}; },
  mol(){ const [f,M]=one([['H₂O',18],['CO₂',44],['O₂',32],['CH₄',16],['NaOH',40],['CaCO₃',100]]), n=one([0.5,1,2,3,4,5]), m=n*M;
    if(Math.random()<.5) return {t:'qui-esteq',q:'Quantos mols há em '+nf(m)+' g de '+f+'? (M = '+M+' g/mol)',...numOpts(n,'mol',[m*M,M/m,n*2]),steps:['n = m / M',nf(m)+' ÷ '+M+' = '+nf(n)+' mol']};
    return {t:'qui-esteq',q:'Qual a massa de '+nf(n)+' mol de '+f+'? (M = '+M+' g/mol)',...numOpts(m,'g',[M/n,n+M,m*2]),steps:['m = n · M',nf(n)+' × '+M+' = '+nf(m)+' g']}; },
  conc(){ const V=one([250,500,1000,2000]), C=one([2,4,5,8,10,20,40]), m=C*V/1000; return {t:'qui-sol',q:'Dissolvem-se '+nf(m)+' g de soluto em '+V+' mL de solução. Concentração em g/L?',...numOpts(C,'g/L',[m*V,m/V,C*10]),steps:['Passe o volume para litros: '+V+' mL = '+nf(V/1000)+' L','C = m / V = '+nf(m)+' ÷ '+nf(V/1000)+' = '+C+' g/L']}; },
  dil(){ const C1=one([10,20,30,40,60]), V1=one([100,200,300]), k=one([2,3,4,5]), V2=V1*k, C2=C1/k; return {t:'qui-sol',q:V1+' mL de solução a '+C1+' g/L são diluídos até '+V2+' mL. Nova concentração?',...numOpts(C2,'g/L',[C1*k,C1-k,C2*2]),steps:['C₁ · V₁ = C₂ · V₂',C1+' × '+V1+' = C₂ × '+V2,'C₂ = '+nf(C2)+' g/L']}; },
  ph(){ const n=ri(1,13); if(Math.random()<.5) return {t:'qui-eq',q:'[H⁺] = 10'+sup(-n)+' mol/L. Qual o pH?',...numOpts(n,'',[14-n,-n,n+1]),steps:['pH = −log [H⁺]','−log 10'+sup(-n)+' = '+n,n<7?'pH < 7: ácido':(n>7?'pH > 7: básico':'pH 7: neutro')]};
    return {t:'qui-eq',q:'Uma solução tem pH '+n+'. Qual o pOH? (25 °C)',...numOpts(14-n,'',[n,7-n,14+n]),steps:['pH + pOH = 14','pOH = 14 − '+n+' = '+(14-n)]}; },
  atom(){ const [el,Z,A]=one([['Na',11,23],['Cl',17,35],['C',6,12],['O',8,16],['Fe',26,56],['Ca',20,40],['K',19,39],['Al',13,27]]);
    if(Math.random()<.6) return {t:'qui-atom',q:'Quantos nêutrons tem o '+el+' (Z = '+Z+', A = '+A+')?',...numOpts(A-Z,'',[A,Z,A+Z]),steps:['n = A − Z',A+' − '+Z+' = '+(A-Z)]};
    const [ion,z,c]=one([['Ca²⁺',20,2],['Na⁺',11,1],['Cl⁻',17,-1],['Al³⁺',13,3],['O²⁻',8,-2],['K⁺',19,1]]); const e=z-c;
    return {t:'qui-atom',q:'Quantos elétrons tem o íon '+ion+' (Z = '+z+')?',...numOpts(e,'',[z,z+c,e+1]),steps:['Cátion perde elétrons; ânion ganha.','e = Z − carga = '+z+' − ('+c+') = '+e]}; },
  boyle(){ const P1=one([1,2,3,4]), V1=one([6,8,12,24]), P2=one([2,3,4,6]); const V2=P1*V1/P2; if(V2%1) return GEN.boyle();
    return {t:'qui-gas',q:'Um gás ocupa '+V1+' L a '+P1+' atm. A temperatura constante, qual o volume a '+P2+' atm?',...numOpts(V2,'L',[V1*P2/P1,V1+P2-P1,V2*2]),steps:['Lei de Boyle: P₁ · V₁ = P₂ · V₂',P1+' × '+V1+' = '+P2+' × V₂','V₂ = '+nf(V2)+' L']}; },
  meia(){ const m0=one([80,160,200,400,640]), T=one([2,5,8,10]), k=ri(1,4), m=m0/Math.pow(2,k);
    return {t:'qui-radio',q:'Um radioisótopo tem meia-vida de '+T+' anos. De '+m0+' g, quanto resta após '+(k*T)+' anos?',...numOpts(m,'g',[m0/(2*k),m0-k*T,m*2]),steps:[(k*T)+' ÷ '+T+' = '+k+' meias-vidas','A cada meia-vida, a massa cai à metade: '+m0+' ÷ 2'+sup(k)+' = '+nf(m)+' g']}; }
};

/* ================= Teste 80/20: as questões mais recorrentes de cada tópico =================
   Regra: 5 questões por tópico, no estilo clássico de banca (5 alternativas). Curadas, não geradas
   ao acaso — são os padrões que mais se repetem em concursos para aquele tópico específico.
   Acertar 4 de 5 (80%) conquista o selo do tópico.
   Formato: {q:enunciado, o:[5 alternativas], r:índice da correta, x:explicação} */
const TESTE80 = {

/* ---------------- PORTUGUÊS ---------------- */
'port-conc':{qs:[
 {q:'Assinale a alternativa em que a concordância verbal segue a norma-padrão.',
  o:['Fazem dois anos que o edital foi publicado.','Deve haver, na sala, muitos candidatos nervosos.','Existe, entre os servidores, sérias divergências.','Vão fazer três meses que ele passou na prova.','Deviam haver mais vagas neste edital.'],
  r:1,x:'"Haver" no sentido de existir é impessoal e fica sempre no singular; o verbo auxiliar que o acompanha concorda com ele, também no singular ("deve haver"). Nas demais, "fazer" indicando tempo deveria ficar no singular (A e D), "existir" é pessoal e deveria concordar com o sujeito plural (C: "existem"), e o auxiliar de "haver" impessoal também deveria ficar singular (E: "devia haver").'},
 {q:'Assinale a alternativa correta quanto à concordância.',
  o:['O que mais preocupa o comandante são os prazos apertados.','Aluga-se casas na região central.','Segue anexo as cópias dos documentos.','A gente vamos resolver isso ainda hoje.','Fazem já dois meses desde a última reforma.'],
  r:0,x:'Quando o sujeito é o pronome "o que", o verbo de ligação concorda com o predicativo: "são os prazos". Nas demais: em voz passiva sintética, o verbo concorda com o sujeito paciente ("Alugam-se casas"); "anexo" é adjetivo e deveria concordar ("anexas"); "a gente" pede verbo na 3ª pessoa do singular ("a gente vai"); "fazer" indicando tempo decorrido é impessoal e fica sempre no singular ("Faz já dois meses").'},

 
 {q:'Em qual alternativa a concordância nominal está correta?',
  o:['Ela ficou meia preocupada com o resultado.','Seguem anexas as certidões solicitadas.','As provas estavam meias difíceis este ano.','É proibido a entrada de pessoas não autorizadas.','Bastante candidatos desistiram da prova.'],
  r:1,x:'"Anexo" funciona como adjetivo e concorda com o substantivo a que se refere: "seguem anexas as certidões". Nas demais: "meio" diante de adjetivo é advérbio e fica invariável ("meio preocupada", "meio difíceis"); "proibido" deveria concordar com "entrada" ("é proibida"); "bastante" antes de substantivo varia como adjetivo ("bastantes candidatos").'},

 
 {q:'Assinale a alternativa em que a concordância verbal está INCORRETA.',
  o:['Fazia dez anos que ele trabalhava no quartel.','Havia muitas ocorrências registradas naquele mês.','Faziam já duas semanas desde o último plantão.','Deve ter havido um engano na escala.','Já houve casos parecidos antes.'],
  r:2,x:'"Fazer" indicando tempo decorrido é impessoal e fica sempre na 3ª pessoa do singular: o correto seria "Fazia já duas semanas". As demais estão corretas: "havia" (impessoal, singular), "deve ter havido" (locução impessoal no singular) e "houve" (impessoal, singular).'},
 {q:'Assinale a frase que respeita a concordância verbal exigida pela norma-padrão.',
  o:['Mais de um candidato brigaram pela última vaga.','Nós mesmo resolvemos o problema.','Aqui se aluga apartamentos mobiliados.','Existe muitas dúvidas sobre o edital.','Cerca de 60% dos servidores aprovou a proposta.'],
  r:4,x:'Com expressões percentuais, o verbo pode concordar com o numeral; no singular ("aprovou"), concordando com "60%", a construção é aceita pela norma-padrão. Nas demais: "mais de um" pede singular ("brigou"); "nós mesmo" deveria flexionar ("nós mesmos"); em voz passiva sintética o verbo concorda com o sujeito paciente plural ("alugam-se apartamentos"); "existir" é pessoal e concorda com o sujeito ("existem muitas dúvidas").'}
]},

'port-reg':{qs:[
 {q:'Assinale a alternativa em que o uso do acento grave (crase) está correto.',
  o:['Entreguei o relatório à ele.','Fui à pé até o quartel.','Ela se referiu à Vossa Senhoria.','Voltarei à essa cidade em breve.','Estava à espera do resgate.'],
  r:4,x:'"À espera de" é locução prepositiva feminina que exige crase. Nas demais não cabe crase: antes de pronome pessoal ("ele") nunca há crase; "a pé" é locução masculina, sem crase; pronomes de tratamento (exceto senhora, senhorita e dona) não admitem artigo, logo não há crase; pronomes demonstrativos como "essa" também não aceitam artigo antes, então não há crase.'},

 
 {q:'Assinale a alternativa em que a crase é obrigatória.',
  o:['Ele chegou a Curitiba ontem.','A prova será aplicada a partir das 8h.','Voltou a si depois do susto.','A reunião começa às 14h.','Estava disposto a ajudar.'],
  r:3,x:'Diante de hora determinada, a crase é obrigatória: "às 14h". Nas demais não há artigo feminino determinando o termo seguinte, então não cabe crase.'},
 {q:'Assinale a alternativa em que a regência verbal está de acordo com a norma-padrão.',
  o:['Assisti o jogo pela televisão.','Namoro com a recruta há dois anos.','Obedeço às normas do regulamento.','Prefiro estudar do que descansar.','Chegamos no quartel antes do horário.'],
  r:2,x:'"Obedecer" é verbo transitivo indireto e exige a preposição "a": "obedeço às normas". Nas demais: "assistir" no sentido de ver exige "a" ("assisti ao jogo"); "namorar" é transitivo direto, sem preposição ("namoro a recruta"); "preferir" não admite "do que" ("prefiro estudar a descansar"); "chegar" pede a preposição "a" ("chegamos ao quartel").'},

 
 {q:'Assinale a alternativa correta quanto à regência e à crase, simultaneamente.',
  o:['Fomos à uma palestra sobre segurança.','O documento faz referência à Lei 19.449.','Ele aspira à diretor do departamento.','Estamos à disposição à qualquer momento.','Chegamos a base às pressas.'],
  r:1,x:'"Fazer referência a" pede a preposição "a", e como "Lei" é palavra feminina determinada, ocorre a crase: "à Lei 19.449". Nas demais: "à uma palestra" está incorreto porque "uma" não admite artigo definido antes; "aspirar a" no sentido de pretender um cargo não leva artigo antes de substantivo sem determinação ("aspira a diretor"); "à qualquer momento" está errado pois "qualquer" não aceita artigo; "chegamos a base" carece de crase, pois "à base" (feminina) e "às pressas" (correto, mas a base sem crase está errada).'},
 {q:'Assinale a alternativa em que NÃO ocorre crase, corretamente, por se tratar de palavras repetidas.',
  o:['Ficamos cara a cara com o suspeito.','Fomos à repartição pela manhã.','Entregamos o ofício à autoridade competente.','Recorremos à Justiça.','Chegamos à noite no quartel.'],
  r:0,x:'Em expressões com palavras repetidas, como "cara a cara", não ocorre crase. Nas demais, o "a" antecede palavra feminina determinada, cabendo a crase: "à repartição", "à autoridade", "à Justiça", "à noite" (locução adverbial feminina).'}
]},

'port-sint':{qs:[
 {q:'Em "É importante que os candidatos cheguem no horário.", a oração destacada classifica-se como',
  o:['subordinada substantiva subjetiva','subordinada substantiva objetiva direta','subordinada adjetiva restritiva','subordinada adverbial condicional','coordenada aditiva'],
  r:0,x:'A oração "que os candidatos cheguem no horário" funciona como sujeito de "é importante", caracterizando uma subordinada substantiva subjetiva.'},
 {q:'Em "O edital, que ainda não foi publicado, deve sair em breve.", a oração destacada é',
  o:['subordinada adjetiva restritiva','subordinada adjetiva explicativa','subordinada substantiva apositiva','subordinada adverbial temporal','subordinada substantiva completiva nominal'],
  r:1,x:'Isolada por vírgulas e acrescentando uma informação extra sobre "o edital" (não restringindo o universo do termo), trata-se de uma oração subordinada adjetiva explicativa.'},
 {q:'Assinale a alternativa em que o termo destacado exerce a função de objeto indireto.',
  o:['O comandante elogiou o novo recruta.','Precisamos de mais equipamentos.','A vítima foi socorrida rapidamente.','Ele é o responsável pelo setor.','Chegamos ao local do incêndio.'],
  r:1,x:'"Precisar" é verbo transitivo indireto (pede a preposição "de"); "de mais equipamentos" é o objeto indireto. As demais funções são: objeto direto (A), sujeito paciente/agente da passiva (C), predicativo (D) e adjunto adverbial de lugar (E).'},
 {q:'Em "Estudou bastante, mas não foi aprovado.", o período é classificado como',
  o:['composto por subordinação','composto por coordenação','simples com predicado verbal','composto por coordenação e subordinação','simples com predicado nominal'],
  r:1,x:'As duas orações são independentes entre si e estão ligadas pela conjunção coordenativa adversativa "mas", caracterizando período composto por coordenação.'},
 {q:'Em "Estudem bastante para a prova.", o sujeito da oração é classificado como',
  o:['sujeito simples','sujeito composto','sujeito oculto (elíptico)','sujeito indeterminado','oração sem sujeito'],
  r:2,x:'O verbo "estudem" está na 2ª pessoa do plural sem um pronome explícito, mas o sujeito ("vocês") pode ser identificado pela desinência verbal: trata-se de sujeito oculto (também chamado elíptico ou desinencial).'}
]},

'port-pont':{qs:[
 {q:'Assinale a alternativa em que a pontuação está de acordo com a norma-padrão.',
  o:['Os bombeiros, chegaram rapidamente ao local.','Durante o plantão, três ocorrências foram registradas.','O comandante, informou a todos sobre a mudança.','Concluída a vistoria os agentes seguiram viagem.','O relatório é longo, mas, completo.'],
  r:1,x:'O adjunto adverbial deslocado para o início da frase ("Durante o plantão") pode e costuma ser seguido de vírgula. Nas demais, a vírgula separa indevidamente sujeito e verbo (A e C) ou falta pontuação após oração reduzida deslocada (D) ou há uma vírgula indevida antes de "completo" (E).'},
 {q:'Assinale a alternativa em que a vírgula foi empregada corretamente para isolar o aposto.',
  o:['Curitiba, capital do Paraná, fica no planalto.','O relatório, foi entregue no prazo.','Todos os candidatos, chegaram cedo.','A prova terá, setenta questões objetivas.','O comandante avisou, que haveria mudanças.'],
  r:0,x:'"Capital do Paraná" é aposto explicativo de "Curitiba" e deve vir isolado por vírgulas. As demais alternativas separam indevidamente sujeito e verbo, ou verbo e complemento.'},
 {q:'Assinale a alternativa correta quanto ao uso do ponto e vírgula.',
  o:['Levou o capacete; e as luvas para o treino.','Na guarnição havia: um motorista, um socorrista; e um comandante.','No treino, os recrutas correram; nadaram; e praticaram primeiros socorros.','Na sala havia recrutas atentos; na sala ao lado, instrutores concentrados.','Ele chegou; cedo ao quartel.'],
  r:3,x:'O ponto e vírgula é adequado para separar orações coordenadas mais longas ou com sentido próprio, especialmente quando já há vírgulas internas, como em "Na sala havia recrutas atentos; na sala ao lado, instrutores concentrados." As demais empregam o ponto e vírgula de forma indevida, no lugar de vírgula simples ou sem função sintática clara.'},
 {q:'Assinale a alternativa em que os dois-pontos foram empregados corretamente.',
  o:['Ele chegou: atrasado ao plantão.','Ele disse: que chegaria atrasado.','O motivo foi: o trânsito intenso.','Faltou apenas uma coisa: coragem.','Chegamos: cedo ao local.'],
  r:3,x:'Os dois-pontos anunciam corretamente um esclarecimento final em "Faltou apenas uma coisa: coragem." Nas demais, os dois-pontos rompem indevidamente a ligação entre verbo e complemento ou antecedem uma oração subordinada sem valor de citação direta.'},

 
 {q:'Assinale a alternativa em que a ausência de vírgula compromete a norma-padrão.',
  o:['Se chover, a operação será adiada.','Quando o alarme tocou todos saíram.','Concluído o curso, os alunos seguiram para o batalhão.','Estudou muito e, por isso, foi bem na prova.','Embora estivesse cansado, continuou o plantão.'],
  r:1,x:'Orações subordinadas deslocadas para o início do período devem vir separadas por vírgula da oração principal. Em "Quando o alarme tocou todos saíram", falta a vírgula depois de "tocou": o correto é "Quando o alarme tocou, todos saíram." As demais alternativas já estão pontuadas corretamente.'}
]},

'port-int':{qs:[
 {q:'Texto: "O treinamento de resgate em altura exige, além de equipamento adequado, disciplina rigorosa: um único descuido pode custar caro à guarnição inteira." Assinale a ideia central do trecho.',
  o:['O equipamento é mais importante que a disciplina no resgate em altura.','A disciplina, tanto quanto o equipamento, é essencial para a segurança no resgate em altura.','O resgate em altura não pode ser realizado com segurança.','Apenas descuidos individuais causam acidentes em resgates.','O treinamento de resgate em altura é dispensável quando há bom equipamento.'],
  r:1,x:'O texto afirma que o treinamento exige equipamento adequado "além de" disciplina rigorosa, colocando as duas condições como necessárias, sem hierarquizar uma acima da outra.'},
 {q:'Texto: "Nem sempre a ocorrência mais grave é a que chega primeiro ao rádio. Por isso, a triagem de chamados é tão decisiva quanto o combate ao incêndio em si." A relação estabelecida pela expressão "Por isso" é de',
  o:['comparação','conclusão/consequência','concessão','condição','finalidade'],
  r:1,x:'"Por isso" introduz uma consequência lógica da ideia anterior, estabelecendo uma relação de conclusão/consequência entre as duas orações.'},
 {q:'Texto: "Embora o número de chamadas tenha caído em relação ao ano anterior, a gravidade média das ocorrências aumentou." Depreende-se do texto que',
  o:['houve mais chamadas e mais ocorrências graves.','houve menos chamadas, mas as ocorrências ficaram mais graves em média.','o número de chamadas e a gravidade caíram juntos.','a gravidade das ocorrências não pode ser medida.','o texto não permite nenhuma conclusão sobre gravidade.'],
  r:1,x:'A conjunção concessiva "embora" contrapõe a queda no número de chamadas ao aumento da gravidade média, exatamente o que a alternativa B expressa.'},
 {q:'Texto: "Mais importante do que memorizar o manual é entender por que cada procedimento existe." A palavra "por que" está empregada, nesse contexto, com o sentido de',
  o:['tempo','pelo qual (motivo)','lugar','condição','quantidade'],
  r:1,x:'"Por que" antes de substantivo abstrato como "existe" tem valor de "por qual motivo/razão", introduzindo uma causa.'},
 {q:'Texto: "O comandante insistiu: revisar o equipamento antes de cada plantão não é burocracia, é sobrevivência." O efeito de sentido da frase final é de',
  o:['dúvida sobre a necessidade da revisão','ênfase na importância vital da revisão do equipamento','crítica à existência de regras burocráticas','indiferença quanto ao procedimento','ironia sobre o comandante'],
  r:1,x:'Ao contrapor "burocracia" a "sobrevivência", o texto reforça, de forma enfática, que a revisão do equipamento é uma questão de vida ou morte, e não uma formalidade.'}
]},

/* ---------------- MATEMÁTICA ---------------- */
'mat-porc':{qs:[
 {q:'Um equipamento custava R$ 800,00 e teve um aumento de 15%. Qual o novo preço?',
  o:['R$ 815,00','R$ 900,00','R$ 920,00','R$ 850,00','R$ 940,00'],
  r:2,x:'Aumento de 15% multiplica o valor por 1,15: 800 × 1,15 = R$ 920,00.'},
 {q:'Uma viatura que custava R$ 1.200,00 foi vendida com desconto de 20%. Qual foi o valor pago?',
  o:['R$ 1.000,00','R$ 960,00','R$ 980,00','R$ 1.100,00','R$ 900,00'],
  r:1,x:'Desconto de 20% multiplica o valor por 0,80: 1.200 × 0,80 = R$ 960,00.'},
 {q:'Em uma turma de 40 candidatos, 25% foram aprovados na primeira etapa. Quantos candidatos foram aprovados?',
  o:['8','10','12','15','20'],
  r:1,x:'25% de 40: 40 × 0,25 = 10 candidatos.'},
 {q:'Um valor sofreu dois aumentos sucessivos de 10% cada. O aumento total, em relação ao valor original, foi de',
  o:['20%','21%','19%','22%','18%'],
  r:1,x:'Aumentos sucessivos se multiplicam: 1,10 × 1,10 = 1,21, ou seja, aumento total de 21% (e não a soma simples de 20%).'},
 {q:'Sabendo que 60% dos servidores de um setor são do sexo masculino e que há 24 homens, qual é o total de servidores do setor?',
  o:['30','36','40','44','48'],
  r:2,x:'Se 60% correspondem a 24, então o total é 24 ÷ 0,60 = 40 servidores.'}
]},

'mat-prop':{qs:[
 {q:'Se 5 kg de um produto custam R$ 60,00, quanto custarão 8 kg do mesmo produto, mantida a proporção?',
  o:['R$ 84,00','R$ 90,00','R$ 96,00','R$ 100,00','R$ 108,00'],
  r:2,x:'Regra de três simples direta: 5 kg → 60; 8 kg → x. x = (8 × 60) ÷ 5 = 96, ou seja, R$ 96,00.'},
 {q:'Uma equipe de 4 bombeiros conclui um rescaldo em 6 horas. Trabalhando no mesmo ritmo, em quanto tempo 6 bombeiros concluiriam o mesmo serviço?',
  o:['3 h','4 h','5 h','8 h','9 h'],
  r:1,x:'Grandezas inversamente proporcionais (mais gente, menos tempo): 4 × 6 = 6 × x → x = 24 ÷ 6 = 4 horas.'},
 {q:'Uma torneira enche um reservatório em 5 horas. Duas torneiras iguais, funcionando juntas, encherão o mesmo reservatório em quanto tempo?',
  o:['1,5 h','2 h','2,5 h','3 h','4 h'],
  r:2,x:'O tempo é inversamente proporcional ao número de torneiras: 5 ÷ 2 = 2,5 horas.'},
 {q:'12 operários constroem um muro em 10 dias. Quantos operários seriam necessários para construir o mesmo muro em 6 dias, mantido o ritmo de trabalho?',
  o:['15','18','20','22','24'],
  r:2,x:'Grandezas inversamente proporcionais: 12 × 10 = x × 6 → x = 120 ÷ 6 = 20 operários.'},
 {q:'Um carro percorre 240 km com 20 litros de combustível. Quantos litros serão necessários para percorrer 360 km, mantido o consumo?',
  o:['24','27','30','32','36'],
  r:2,x:'Regra de três direta: 240 km → 20 L; 360 km → x. x = (360 × 20) ÷ 240 = 30 litros.'}
]},

'mat-eq':{qs:[
 {q:'Resolvendo a equação 3x − 7 = 14, o valor de x é',
  o:['5','6','7','8','9'],
  r:2,x:'3x = 14 + 7 = 21; x = 21 ÷ 3 = 7.'},
 {q:'A soma de dois números é 50 e a diferença entre eles é 10. Qual é o maior desses números?',
  o:['25','28','30','32','35'],
  r:2,x:'Somando as duas equações (x+y=50 e x−y=10): 2x=60, x=30 (o maior número), e y=20.'},
 {q:'As raízes da equação x² − 7x + 12 = 0 são',
  o:['2 e 5','3 e 4','1 e 6','2 e 6','3 e 5'],
  r:1,x:'Pela soma e produto: soma = 7, produto = 12. Os números 3 e 4 satisfazem: 3+4=7 e 3×4=12.'},
 {q:'Daqui a 5 anos, a idade de Marcos será o dobro da idade que ele tinha há 5 anos. Qual é a idade atual de Marcos?',
  o:['10 anos','12 anos','15 anos','18 anos','20 anos'],
  r:2,x:'Seja x a idade atual: x+5 = 2(x−5) → x+5 = 2x−10 → 15 = x. Marcos tem 15 anos.'},
 {q:'Qual é o conjunto-solução da inequação 2x − 3 > 7, no universo dos números reais?',
  o:['x > 2','x > 5','x < 5','x > 3,5','x < 2'],
  r:1,x:'2x > 7+3 = 10 → x > 5.'}
]},

'mat-gp':{qs:[
 {q:'Um triângulo retângulo tem catetos de 6 cm e 8 cm. A medida da hipotenusa é',
  o:['9 cm','10 cm','12 cm','14 cm','16 cm'],
  r:1,x:'Pelo Teorema de Pitágoras: h² = 6² + 8² = 36 + 64 = 100, logo h = 10 cm.'},
 {q:'A área de um triângulo com base de 12 m e altura de 5 m é',
  o:['30 m²','35 m²','40 m²','60 m²','17 m²'],
  r:0,x:'Área = (base × altura) ÷ 2 = (12 × 5) ÷ 2 = 30 m².'},
 {q:'Um terreno retangular tem 15 m de frente por 20 m de fundo. Qual é o seu perímetro?',
  o:['35 m','55 m','60 m','70 m','300 m'],
  r:3,x:'Perímetro do retângulo = 2 × (15+20) = 2 × 35 = 70 m.'},
 {q:'Considerando π = 3, a área aproximada de um círculo de raio 4 m é',
  o:['12 m²','24 m²','36 m²','48 m²','16 m²'],
  r:3,x:'Área = π × r² = 3 × 4² = 3 × 16 = 48 m².'},
 {q:'A soma dos ângulos internos de um hexágono (polígono de 6 lados) é',
  o:['360°','540°','720°','900°','1080°'],
  r:2,x:'Soma dos ângulos internos = (n−2) × 180°. Para n=6: (6−2) × 180° = 4 × 180° = 720°.'}
]},

'mat-pa':{qs:[
 {q:'Em uma PA de primeiro termo 5 e razão 3, qual é o 10º termo?',
  o:['27','29','30','32','35'],
  r:3,x:'aₙ = a₁ + (n−1)×r → a₁₀ = 5 + 9×3 = 5+27 = 32.'},
 {q:'Em uma PA de primeiro termo 2 e razão 4, qual é a soma dos 8 primeiros termos?',
  o:['96','112','120','128','136'],
  r:3,x:'a₈ = 2 + 7×4 = 30. Sₙ = n×(a₁+aₙ)/2 = 8×(2+30)/2 = 8×16 = 128.'},
 {q:'Em uma PG de primeiro termo 3 e razão 2, qual é o 5º termo?',
  o:['24','32','40','48','96'],
  r:3,x:'aₙ = a₁×qⁿ⁻¹ → a₅ = 3×2⁴ = 3×16 = 48.'},
 {q:'Qual é a soma dos quatro primeiros termos da PG (1, 3, 9, 27, ...)?',
  o:['27','30','36','40','81'],
  r:3,x:'Somando diretamente: 1+3+9+27 = 40 (ou pela fórmula Sₙ = a₁(qⁿ−1)/(q−1) = (81−1)/2 = 40).'},
 {q:'Em uma PA de primeiro termo 50 e razão −5, qual é o 6º termo?',
  o:['15','20','25','30','35'],
  r:2,x:'aₙ = a₁ + (n−1)×r → a₆ = 50 + 5×(−5) = 50−25 = 25.'}
]},

/* ---------------- FÍSICA ---------------- */
'fis-cin':{qs:[
 {q:'Uma viatura parte do repouso e atinge 72 km/h em 10 segundos, com aceleração constante. Essa aceleração, em m/s², é de',
  o:['2','4','7,2','10','20'],
  r:0,x:'72 km/h = 20 m/s. a = Δv/Δt = 20 ÷ 10 = 2 m/s².'},
 {q:'Um objeto é abandonado (velocidade inicial nula) de uma altura e leva 4 s para atingir o solo, considerando g = 10 m/s². A velocidade com que ele chega ao solo é de',
  o:['10 m/s','20 m/s','30 m/s','40 m/s','50 m/s'],
  r:3,x:'Queda livre: v = g × t = 10 × 4 = 40 m/s.'},
 {q:'Dois pontos, A e B, distam 300 m entre si. Um móvel parte de A rumo a B a 20 m/s, e outro parte de B rumo a A, ao mesmo tempo, a 10 m/s. Em quanto tempo eles se encontram?',
  o:['5 s','8 s','10 s','12 s','15 s'],
  r:2,x:'Movimento de aproximação: a distância diminui à soma das velocidades (30 m/s). t = 300 ÷ 30 = 10 s.'},
 {q:'Um carro percorre 150 km em 3 horas. Sua velocidade média nesse percurso é de',
  o:['30 km/h','40 km/h','45 km/h','50 km/h','60 km/h'],
  r:3,x:'Velocidade média = distância ÷ tempo = 150 ÷ 3 = 50 km/h.'},
 {q:'Um corpo parte com velocidade de 4 m/s e acelera uniformemente a 3 m/s² durante 5 s. A velocidade final desse corpo é de',
  o:['12 m/s','15 m/s','17 m/s','19 m/s','22 m/s'],
  r:3,x:'v = v0 + a×t = 4 + 3×5 = 4 + 15 = 19 m/s.'}
]},

'fis-din':{qs:[
 {q:'Uma força resultante de 40 N é aplicada a um corpo de massa 8 kg, inicialmente em repouso, sobre uma superfície sem atrito. A aceleração adquirida por esse corpo é de',
  o:['2 m/s²','4 m/s²','5 m/s²','8 m/s²','10 m/s²'],
  r:2,x:'2ª Lei de Newton: a = F/m = 40 ÷ 8 = 5 m/s².'},
 {q:'Um corpo de massa 10 kg está em repouso sobre uma mesa horizontal. Considerando g = 10 m/s², a força normal exercida pela mesa sobre o corpo é de',
  o:['0 N','10 N','50 N','100 N','1000 N'],
  r:3,x:'Como o corpo está em equilíbrio na vertical, a normal equilibra o peso: N = P = m×g = 10×10 = 100 N.'},
 {q:'De acordo com a 3ª Lei de Newton (ação e reação), quando um bombeiro empurra uma parede com uma força de 50 N,',
  o:['a parede não exerce força alguma sobre ele.','a parede exerce sobre ele uma força de 50 N em sentido contrário.','a parede exerce sobre ele uma força maior que 50 N.','a parede exerce sobre ele uma força menor que 50 N.','apenas o bombeiro exerce força; a parede apenas resiste.'],
  r:1,x:'Toda ação gera uma reação de mesma intensidade e direção, mas em sentido contrário: a parede empurra o bombeiro de volta com 50 N.'},
 {q:'Uma pessoa de 70 kg está em um elevador que acelera para cima a 2 m/s². Considerando g = 10 m/s², o peso aparente dessa pessoa (força normal do piso sobre ela) é de',
  o:['560 N','630 N','700 N','770 N','840 N'],
  r:4,x:'N − P = m×a → N = m×(g+a) = 70×(10+2) = 70×12 = 840 N.'},
 {q:'Um bloco de 5 kg está sobre um plano horizontal e uma força de atrito de 10 N atua sobre ele quando está prestes a se mover. O coeficiente de atrito estático entre o bloco e a superfície, considerando g = 10 m/s², é de',
  o:['0,1','0,2','0,3','0,5','1,0'],
  r:1,x:'A força de atrito máxima é µ×N, com N=m×g=50 N. µ = 10 ÷ 50 = 0,2.'}
]},

'fis-ene':{qs:[
 {q:'Um corpo de massa 4 kg se desloca a 5 m/s. Sua energia cinética é de',
  o:['10 J','20 J','25 J','50 J','100 J'],
  r:3,x:'Ec = m×v²/2 = 4×25/2 = 100/2 = 50 J.'},
 {q:'Um corpo de 2 kg está a 10 m de altura. Considerando g = 10 m/s², sua energia potencial gravitacional é de',
  o:['20 J','100 J','200 J','500 J','2000 J'],
  r:2,x:'Ep = m×g×h = 2×10×10 = 200 J.'},
 {q:'Uma força constante de 20 N desloca um corpo por 8 m na mesma direção da força. O trabalho realizado por essa força é de',
  o:['2,5 J','28 J','60 J','120 J','160 J'],
  r:4,x:'Trabalho = F×d = 20×8 = 160 J.'},
 {q:'Um motor realiza um trabalho de 600 J em 5 segundos. A potência desse motor é de',
  o:['60 W','100 W','120 W','150 W','300 W'],
  r:2,x:'Potência = trabalho ÷ tempo = 600 ÷ 5 = 120 W.'},
 {q:'Um corpo de 3 kg cai em queda livre, a partir do repouso, de uma altura de 20 m. Desprezando o atrito com o ar e considerando g = 10 m/s², a velocidade com que esse corpo chega ao solo é de',
  o:['10 m/s','15 m/s','20 m/s','25 m/s','30 m/s'],
  r:2,x:'Pela conservação de energia: m×g×h = m×v²/2 → v² = 2×g×h = 2×10×20 = 400 → v = 20 m/s.'}
]},

'fis-hid':{qs:[
 {q:'Considerando a densidade da água 1.000 kg/m³ e g = 10 m/s², a pressão exercida pela água (desprezando a pressão atmosférica) a 5 m de profundidade é de',
  o:['500 Pa','5.000 Pa','10.000 Pa','50.000 Pa','500.000 Pa'],
  r:3,x:'Pressão hidrostática: p = d×g×h = 1.000×10×5 = 50.000 Pa.'},
 {q:'Em uma prensa hidráulica, o êmbolo menor tem área de 2 cm² e o êmbolo maior, área de 20 cm². Aplicando uma força de 50 N no êmbolo menor, a força obtida no êmbolo maior é de',
  o:['5 N','50 N','100 N','500 N','1000 N'],
  r:3,x:'Princípio de Pascal: F1/A1 = F2/A2 → 50/2 = F2/20 → F2 = 25×20 = 500 N.'},
 {q:'Um bloco de volume 2×10⁻³ m³ é totalmente submerso em água (densidade 1.000 kg/m³), com g = 10 m/s². O empuxo sobre esse bloco é de',
  o:['2 N','10 N','20 N','200 N','2000 N'],
  r:2,x:'Empuxo = d(líquido)×V×g = 1.000×2×10⁻³×10 = 20 N.'},
 {q:'Um corpo flutua parcialmente submerso em um líquido. Isso ocorre porque',
  o:['o corpo não tem peso.','a densidade do corpo é maior que a do líquido.','o empuxo é sempre nulo em líquidos.','a densidade do corpo é menor que a do líquido.','a pressão atmosférica anula o peso do corpo.'],
  r:3,x:'Um corpo flutua quando sua densidade média é menor que a do líquido em que está, fazendo o empuxo equilibrar o peso antes da submersão total.'},
 {q:'Em um sistema de vasos comunicantes contendo um único líquido em equilíbrio, o nível do líquido em cada ramo é',
  o:['sempre maior no ramo mais largo.','sempre maior no ramo mais estreito.','proporcional à área da seção de cada ramo.','o mesmo em todos os ramos, independentemente do formato.','imprevisível, pois depende da pressão atmosférica.'],
  r:3,x:'Em vasos comunicantes com um único líquido em equilíbrio, o nível é o mesmo em todos os ramos, qualquer que seja o formato ou a largura de cada um.'}
]},

'fis-eldin':{qs:[
 {q:'Um resistor de 10 Ω é percorrido por uma corrente de 2 A. A tensão sobre esse resistor é de',
  o:['5 V','8 V','12 V','20 V','40 V'],
  r:3,x:'Lei de Ohm: U = R×i = 10×2 = 20 V.'},
 {q:'Um chuveiro elétrico ligado a 220 V é percorrido por uma corrente de 25 A. A potência desse chuveiro é de',
  o:['880 W','2.750 W','4.400 W','5.500 W','8.800 W'],
  r:3,x:'Potência = U×i = 220×25 = 5.500 W.'},
 {q:'Dois resistores de 4 Ω e 6 Ω estão associados em série em um circuito. A resistência equivalente dessa associação é de',
  o:['2 Ω','2,4 Ω','5 Ω','10 Ω','24 Ω'],
  r:3,x:'Em série, as resistências se somam: Req = 4+6 = 10 Ω.'},
 {q:'Dois resistores iguais de 20 Ω cada estão associados em paralelo. A resistência equivalente dessa associação é de',
  o:['5 Ω','10 Ω','20 Ω','40 Ω','400 Ω'],
  r:1,x:'Para dois resistores iguais em paralelo, a resistência equivalente é a metade de um deles: 20 ÷ 2 = 10 Ω.'},
 {q:'Um aparelho de 1.000 W (1 kW) fica ligado durante 3 horas. O consumo de energia elétrica desse aparelho, em kWh, é de',
  o:['0,3 kWh','1 kWh','3 kWh','30 kWh','300 kWh'],
  r:2,x:'Energia (kWh) = potência (kW) × tempo (h) = 1 × 3 = 3 kWh.'}
]},

/* ---------------- QUÍMICA ---------------- */
'qui-esteq':{qs:[
 {q:'Quantos mols existem em 36 g de água (H₂O), sabendo que sua massa molar é 18 g/mol?',
  o:['0,5 mol','1 mol','2 mol','3 mol','4 mol'],
  r:2,x:'n = massa ÷ massa molar = 36 ÷ 18 = 2 mol.'},
 {q:'Na reação balanceada N₂ + 3H₂ → 2NH₃, quantos mols de H₂ são necessários para reagir completamente com 2 mols de N₂?',
  o:['2','3','4','6','9'],
  r:3,x:'Pela proporção da equação, cada 1 mol de N₂ reage com 3 mols de H₂. Para 2 mols de N₂: 2×3 = 6 mols de H₂.'},
 {q:'Reagindo 4 mols de gás hidrogênio com quantidade suficiente de oxigênio na reação 2H₂ + O₂ → 2H₂O, quantos mols de água são formados?',
  o:['1','2','4','6','8'],
  r:2,x:'A proporção é de 2 mols de H₂ para 2 mols de H₂O (1:1). Para 4 mols de H₂, formam-se 4 mols de H₂O.'},
 {q:'Uma amostra de 100 g de calcário tem 80% de pureza em carbonato de cálcio (CaCO₃). A massa pura de CaCO₃ nessa amostra é de',
  o:['20 g','40 g','60 g','80 g','100 g'],
  r:3,x:'Massa pura = massa total × grau de pureza = 100 × 0,80 = 80 g.'},
 {q:'Em uma reação, a quantidade máxima teórica de produto seria 50 g, mas apenas 40 g foram efetivamente obtidos. O rendimento dessa reação foi de',
  o:['60%','70%','75%','80%','90%'],
  r:3,x:'Rendimento = (massa obtida ÷ massa teórica) × 100 = (40 ÷ 50) × 100 = 80%.'}
]},

'qui-inorg':{qs:[
 {q:'O ácido HNO₃ é corretamente denominado',
  o:['ácido nítrico','ácido nitroso','ácido sulfúrico','ácido carbônico','ácido clorídrico'],
  r:0,x:'HNO₃ é o ácido nítrico (com o maior número de oxigênios entre os oxiácidos do nitrogênio, recebe o sufixo "-ico").'},
 {q:'O composto Ca(OH)₂ é classificado, quimicamente, como',
  o:['ácido','base','sal','óxido','hidreto'],
  r:1,x:'Ca(OH)₂ (hidróxido de cálcio) libera o ânion hidroxila (OH⁻) em solução aquosa, característica das bases.'},
 {q:'O composto NaCl é classificado, quimicamente, como',
  o:['ácido','base','sal','óxido ácido','óxido básico'],
  r:2,x:'NaCl (cloreto de sódio) resulta da combinação de um cátion metálico com um ânion de ácido, sendo classificado como sal.'},
 {q:'O CO₂ (dióxido de carbono) é classificado como um óxido do tipo',
  o:['básico','ácido','anfótero','neutro','misto'],
  r:1,x:'O CO₂ é um óxido de não metal que reage com água formando um ácido (ácido carbônico), sendo por isso classificado como óxido ácido.'},
 {q:'Na reação de neutralização entre um ácido e uma base, os produtos formados são, tipicamente,',
  o:['apenas água','apenas um sal','um sal e água','um óxido e um sal','um ácido e uma base mais fracos'],
  r:2,x:'A reação de neutralização entre ácido e base forma sal e água como produtos característicos.'}
]},

'qui-org':{qs:[
 {q:'O composto CH₃–CH₂–OH (etanol) pertence à função orgânica',
  o:['ácido carboxílico','éster','álcool','cetona','aldeído'],
  r:2,x:'A hidroxila (–OH) ligada a um carbono saturado caracteriza a função álcool.'},
 {q:'O composto CH₃–COOH (ácido acético) pertence à função orgânica',
  o:['álcool','ácido carboxílico','amina','éter','fenol'],
  r:1,x:'O grupo carboxila (–COOH) é característico da função ácido carboxílico.'},
 {q:'Uma cadeia carbônica que contém apenas ligações simples entre os átomos de carbono é classificada como',
  o:['saturada','insaturada','aromática','cíclica','mista'],
  r:0,x:'Cadeias com apenas ligações simples entre carbonos são chamadas de saturadas.'},
 {q:'A reação entre um ácido carboxílico e um álcool, formando um éster e água, é conhecida como reação de',
  o:['saponificação','esterificação','hidrólise','combustão','halogenação'],
  r:1,x:'A reação de um ácido carboxílico com um álcool para formar éster e água é chamada de esterificação.'},
 {q:'Em um polímero, a unidade que se repete e que, isolada, deu origem à cadeia, é chamada de',
  o:['monômero','isômero','catalisador','solvente','ligante'],
  r:0,x:'O monômero é a unidade estrutural que se repete e, ao se ligar repetidamente, forma o polímero.'}
]},

'qui-sol':{qs:[
 {q:'Dissolvem-se 20 g de um soluto em água suficiente para formar 2 L de solução. A concentração comum dessa solução é de',
  o:['5 g/L','10 g/L','20 g/L','40 g/L','100 g/L'],
  r:1,x:'Concentração comum = massa do soluto ÷ volume da solução = 20 ÷ 2 = 10 g/L.'},
 {q:'Uma solução de 500 mL a 40 g/L é diluída até completar 1.000 mL. A nova concentração dessa solução é de',
  o:['10 g/L','20 g/L','40 g/L','60 g/L','80 g/L'],
  r:1,x:'Pela relação de diluição C1×V1 = C2×V2: 40×500 = C2×1000 → C2 = 20.000÷1000 = 20 g/L.'},
 {q:'Uma solução aquosa contém 2 mols de soluto dissolvidos em 4 litros de solução. A concentração em mol/L (molaridade) dessa solução é de',
  o:['0,5 mol/L','1 mol/L','2 mol/L','4 mol/L','8 mol/L'],
  r:0,x:'Molaridade = número de mols ÷ volume em litros = 2 ÷ 4 = 0,5 mol/L.'},
 {q:'Ao misturar 200 mL de uma solução a 10 g/L com 200 mL de água pura (sem soluto), a nova concentração da mistura será de',
  o:['2,5 g/L','5 g/L','10 g/L','15 g/L','20 g/L'],
  r:1,x:'A massa do soluto (200×10=2000mg=2g) se mantém, mas o volume dobra para 400 mL: nova concentração = 2000mg÷400mL = 5 g/L.'},
 {q:'Uma solução tem título (fração em massa) de 25% de soluto. Em 200 g dessa solução, a massa de soluto presente é de',
  o:['25 g','40 g','50 g','75 g','100 g'],
  r:2,x:'Massa de soluto = massa da solução × título = 200 × 0,25 = 50 g.'}
]},

'qui-eq':{qs:[
 {q:'Uma solução aquosa apresenta concentração hidrogeniônica [H⁺] = 10⁻³ mol/L. O pH dessa solução é',
  o:['2','3','4','11','14'],
  r:1,x:'pH = −log[H⁺] = −log(10⁻³) = 3.'},
 {q:'Uma solução tem pH igual a 5. O pOH dessa mesma solução, a 25 °C, é',
  o:['5','7','9','10','14'],
  r:2,x:'Como pH + pOH = 14 a 25 °C, pOH = 14 − 5 = 9.'},
 {q:'Considere o equilíbrio N₂ + 3H₂ ⇌ 2NH₃ (reação direta exotérmica). Aumentar a concentração de N₂ desloca o equilíbrio no sentido de',
  o:['formação de mais N₂','formação de mais NH₃ (produtos)','nenhum deslocamento','formação de mais H₂','decomposição total do NH₃'],
  r:1,x:'Pelo Princípio de Le Chatelier, aumentar a concentração de um reagente desloca o equilíbrio no sentido de consumi-lo, favorecendo a formação de produtos (mais NH₃).'},
 {q:'No mesmo equilíbrio do item anterior (reação direta exotérmica), aumentar a temperatura do sistema desloca o equilíbrio no sentido',
  o:['direto, formando mais NH₃','inverso, favorecendo a decomposição do NH₃','de não haver alteração alguma','de dobrar a constante de equilíbrio sem deslocamento','impossível de determinar sem mais dados'],
  r:1,x:'Aumentar a temperatura favorece o sentido endotérmico da reação; como a direta é exotérmica, o aumento de temperatura desloca o equilíbrio no sentido inverso (decomposição do NH₃).'},
 {q:'Um indicador ácido-base, como a fenolftaleína, serve para',
  o:['acelerar a velocidade de uma reação','indicar, por mudança de cor, o caráter ácido ou básico de uma solução','aumentar a concentração de H⁺ da solução','catalisar reações de combustão','neutralizar completamente qualquer ácido'],
  r:1,x:'Indicadores ácido-base mudam de cor conforme o pH do meio, permitindo identificar se uma solução é ácida, neutra ou básica.'}
]}
};

/* ================= Banco: Caça ao erro (Português) ================= */
const SPOT_GAMES=[
{id:'pt-spot1',s:'port',t:'port-conc',title:'Caça ao erro: concordância',desc:'Toque na palavra errada. Se a frase estiver correta, toque em "Está certa".',items:[
 {parts:['Fazem','dois','anos','que','ele','se','formou','.'],wrong:0,fix:'Faz',x:'"Fazer" indicando tempo decorrido é impessoal: fica sempre no singular.'},
 {parts:['Ele','obedeceu','o','regulamento','.'],wrong:2,fix:'ao',x:'"Obedecer" é transitivo indireto: obedecer AO regulamento.'},
 {parts:['A','maioria','dos','servidores','concordou','com','a','mudança','.'],wrong:-1,x:'Concordância no singular com "a maioria" é aceita pela norma-padrão.'},
 {parts:['Segue','anexo','as','cópias','dos','documentos','.'],wrong:1,fix:'anexas',x:'"Anexo" é adjetivo e concorda com "cópias": anexas.'},
 {parts:['Deve','haver','muitos','candidatos','na','sala','.'],wrong:-1,x:'"Haver" impessoal no singular, com o auxiliar também no singular: está correta.'},
 {parts:['Existe','muitas','dúvidas','sobre','o','edital','.'],wrong:1,fix:'Existem',x:'"Existir" é pessoal e concorda com o sujeito plural "dúvidas".'},
 {parts:['Aluga-se','casas','na','região','central','.'],wrong:0,fix:'Alugam-se',x:'Voz passiva sintética: o verbo concorda com o sujeito paciente "casas".'},
 {parts:['Vão','fazer','três','meses','que','ele','passou','.'],wrong:0,fix:'Vai',x:'"Fazer" tempo é impessoal, sempre no singular: Vai fazer.'}
]},
{id:'pt-spot2',s:'port',t:'port-reg',title:'Caça ao erro: regência e crase',desc:'Toque na palavra errada. Se a frase estiver correta, toque em "Está certa".',items:[
 {parts:['Assisti','o','jogo','pela','televisão','.'],wrong:1,fix:'ao',x:'"Assistir" no sentido de ver exige a preposição "a": assisti ao jogo.'},
 {parts:['Cheguei','à','Curitiba','ontem','.'],wrong:1,fix:'a',x:'"Curitiba" sem determinante não leva crase: cheguei a Curitiba.'},
 {parts:['Obedeço','às','normas','do','regulamento','.'],wrong:-1,x:'"Obedecer" pede "a"; com "as normas" (feminino) ocorre a crase: está correta.'},
 {parts:['Prefiro','estudar','do','que','descansar','.'],wrong:2,fix:'a',x:'"Preferir" não admite "do que": prefiro estudar a descansar.'},
 {parts:['Ele','se','referiu','à','Vossa','Senhoria','.'],wrong:3,fix:'a',x:'Pronomes de tratamento (exceto senhora, senhorita, dona) não admitem artigo: sem crase.'},
 {parts:['Fomos','à','uma','palestra','sobre','segurança','.'],wrong:1,fix:'a',x:'Antes de "uma" (numeral/artigo indefinido) não ocorre crase.'},
 {parts:['A','prova','será','aplicada','às','8h','.'],wrong:-1,x:'Hora determinada exige crase: às 8h. Está correta.'},
 {parts:['Chegamos','no','quartel','antes','do','horário','.'],wrong:1,fix:'ao',x:'"Chegar" pede a preposição "a": chegamos ao quartel.'}
]}
];

/* ================= Banco: Tabela Periódica (Química) ================= */
const PTABLE=[
 {sym:'H',z:1,per:1,grp:1,name:'Hidrogênio'},{sym:'He',z:2,per:1,grp:18,name:'Hélio'},
 {sym:'Li',z:3,per:2,grp:1,name:'Lítio'},{sym:'Be',z:4,per:2,grp:2,name:'Berílio'},
 {sym:'B',z:5,per:2,grp:13,name:'Boro'},{sym:'C',z:6,per:2,grp:14,name:'Carbono'},
 {sym:'N',z:7,per:2,grp:15,name:'Nitrogênio'},{sym:'O',z:8,per:2,grp:16,name:'Oxigênio'},
 {sym:'F',z:9,per:2,grp:17,name:'Flúor'},{sym:'Ne',z:10,per:2,grp:18,name:'Neônio'},
 {sym:'Na',z:11,per:3,grp:1,name:'Sódio'},{sym:'Mg',z:12,per:3,grp:2,name:'Magnésio'},
 {sym:'Al',z:13,per:3,grp:13,name:'Alumínio'},{sym:'Si',z:14,per:3,grp:14,name:'Silício'},
 {sym:'P',z:15,per:3,grp:15,name:'Fósforo'},{sym:'S',z:16,per:3,grp:16,name:'Enxofre'},
 {sym:'Cl',z:17,per:3,grp:17,name:'Cloro'},{sym:'Ar',z:18,per:3,grp:18,name:'Argônio'}
];
const PT_CLUES=[
 {sym:'H',q:'O elemento mais leve, número atômico 1'},
 {sym:'He',q:'Gás nobre do período 1, usado em balões'},
 {sym:'Li',q:'Metal alcalino usado em baterias, período 2'},
 {sym:'O',q:'Elemento que respiramos, essencial à combustão'},
 {sym:'N',q:'Gás que forma cerca de 78% do ar atmosférico'},
 {sym:'F',z:9,q:'Halogênio mais reativo, período 2'},
 {sym:'Ne',q:'Gás nobre usado em letreiros luminosos'},
 {sym:'Na',q:'Metal alcalino que reage com a água, símbolo do sódio'},
 {sym:'Mg',q:'Metal alcalino-terroso, símbolo do magnésio'},
 {sym:'Al',q:'Metal leve usado em latas e esquadrias, símbolo Al'},
 {sym:'Si',q:'Elemento base dos semicondutores, símbolo Si'},
 {sym:'S',q:'Elemento amarelo, símbolo do enxofre'},
 {sym:'Cl',q:'Halogênio usado para desinfetar água, símbolo Cl'},
 {sym:'Ar',q:'Gás nobre do período 3, usado em lâmpadas'},
 {sym:'C',q:'Base de toda a química orgânica, símbolo C'},
 {sym:'P',q:'Elemento essencial ao DNA e aos ossos, símbolo do fósforo'}
];

/* ================= Banco: montar (fórmulas e frases), tipo 'order' já existente ================= */
const BUILD_GAMES=[
{id:'mt-build',s:'mat',t:'mat-gp',type:'order',title:'Monte a fórmula: Matemática',desc:'Toque os símbolos na ordem certa para montar cada fórmula.',items:[
 ['Área do triângulo',['base','×','altura','÷','2'],'Metade do produto da base pela altura.'],
 ['Teorema de Pitágoras',['hipotenusa','²','=','cateto','²','+','cateto','²'],'A soma dos quadrados dos catetos.'],
 ['Soma dos termos de uma PA',['n','×','(','a1','+','an',')','÷','2'],'Número de termos vezes a média entre o primeiro e o último.'],
 ['Fórmula de Bhaskara',['x','=','(','−b','±','raiz de Δ',')','÷','2a'],'As duas raízes da equação do 2º grau.']]},
{id:'fs-build',s:'fis',t:'fis-din',type:'order',title:'Monte a fórmula: Física',desc:'Toque os símbolos na ordem certa para montar cada fórmula.',items:[
 ['2ª Lei de Newton',['F','=','m','×','a'],'Força é massa vezes aceleração.'],
 ['Energia cinética',['Ec','=','m','×','v','²','÷','2'],'Metade da massa vezes a velocidade ao quadrado.'],
 ['Energia potencial gravitacional',['Ep','=','m','×','g','×','h'],'Massa vezes gravidade vezes altura.'],
 ['Pressão hidrostática (Stevin)',['p','=','d','×','g','×','h'],'Densidade vezes gravidade vezes profundidade.'],
 ['Lei de Ohm',['U','=','R','×','i'],'Tensão é resistência vezes corrente.']]},
{id:'qm-build',s:'qui',t:'qui-sol',type:'order',title:'Monte a fórmula: Química',desc:'Toque os símbolos na ordem certa para montar cada fórmula.',items:[
 ['Concentração comum',['C','=','massa','do','soluto','÷','volume','da','solução'],'Massa do soluto sobre o volume total da solução.'],
 ['Molaridade',['M','=','número','de','mols','÷','volume','em','litros'],'Mols do soluto sobre o volume em litros.'],
 ['Diluição',['C1','×','V1','=','C2','×','V2'],'A quantidade de soluto não muda, só a concentração e o volume.']]},
{id:'pt-build',s:'port',t:'port-sint',type:'order',title:'Monte a frase: ordem direta',desc:'Reorganize as partes na ordem direta: sujeito, verbo, complementos.',items:[
 ['Ordene a frase',['O comandante','avisou','a guarnição','sobre a mudança','de horário'],'Ordem direta: sujeito, verbo, objeto direto, complemento.'],
 ['Ordene a frase',['A vítima','foi socorrida','rapidamente','pelos bombeiros'],'Sujeito paciente, verbo na voz passiva, advérbio, agente da passiva.'],
 ['Ordene a frase',['Todos os candidatos','devem chegar','ao local da prova','com uma hora de antecedência'],'Sujeito, verbo, adjunto de lugar, adjunto de tempo.']]}
];
