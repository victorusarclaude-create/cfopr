
/* ===================== CLAUDE DENTRO DO APP =====================
   Tudo que usa IA passa por aqui. Quando o Claude não está disponível na página,
   cada recurso cai para o banco local ou oferece "Copiar pedido" para colar no chat. */
let sampleFn=null, sampleOff=false, samplePromise=null, sampleImages=false;
function getSample(){
  if(sampleOff) return Promise.resolve(null);
  if(!samplePromise){
    const c=window.claude;
    samplePromise=(c&&typeof c.use==='function')?Promise.resolve().then(()=>c.use('sample')).catch(()=>null):Promise.resolve(null);
    samplePromise.then(s=>{ if(!s){ sampleOff=true; return; } sampleFn=s; try{ Promise.resolve(s.limits()).then(l=>{ sampleImages=!!(l&&l.images); }).catch(()=>{}); }catch(e){} });
  }
  return samplePromise;
}
const AI_OFF_CODES=['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed'];
function sampleMsg(e){
  const c=e&&e.code;
  if(AI_OFF_CODES.includes(c)){ sampleOff=true; return 'O Claude não está liberado nesta página. Use "Copiar pedido" e cole no chat do Claude.'; }
  if(c==='cancelled') return '';
  if(c==='rate_limited') return 'Muitos pedidos agora. Espere alguns minutos e tente de novo.';
  if(c==='session_expired') return 'Sua sessão expirou. Entre de novo no Claude e recarregue a página.';
  if(c==='refused') return 'O Claude não respondeu esse pedido. Reformule e tente de novo.';
  if(c==='invalid_json') return 'A resposta veio fora do formato. Toque em "Tentar de novo".';
  if(c==='prompt_too_large') return 'Texto grande demais. Envie um trecho menor.';
  if(c==='empty_completion') return 'A resposta veio vazia. Tente pedir de outro jeito.';
  if(c==='image_rejected') return 'Não consegui ler essa imagem. Tente outra foto (JPG ou PNG).';
  return 'A conexão com o Claude falhou. Tente de novo.';
}
function who(){ return (S.cfg.name||'').trim()||'o aluno'; }
function ctxProva(){
  const dte=daysToExam();
  return 'Contexto: '+who()+' estuda para a prova objetiva de Cadete do Corpo de Bombeiros Militar do Paraná (CBMPR), banca Instituto AOCP: 70 questões de 5 alternativas, mínimo de 35 acertos, mais duas redações.'+(dte!=null&&dte>=0?' Faltam '+dte+' dias para a prova.':'');
}
const STYLE='Português do Brasil, frases curtas, sem enrolação. Sem LaTeX: escreva x^2, raiz de 2, 3/4. Use **negrito** só para o essencial. Em legislação, cobre o conteúdo e o panorama da norma; se não tiver certeza do texto exato de um artigo, não cite número de artigo.';

function promptGerar(s,t,nivel,opts){
  opts=opts||{};
  const guia=['nível fácil: cobra o conceito básico, uma ideia por questão, conta curta, sem pegadinha','nível médio: combina duas ideias ou exige um passo a mais, como a banca costuma cobrar','nível difícil: o nível mais alto que costuma aparecer em prova de Cadete, com distratores plausíveis'][clamp(nivel,0,2)];
  const avoid=(S.qbank[t.id]||[]).slice(-6).map(q=>'- '+String(q.q).slice(0,120)).join('\n');
  return [ctxProva(),
  'Crie 5 questões inéditas de múltipla escolha no estilo da banca Instituto AOCP (enunciado direto, 5 alternativas, só uma correta).',
  'Disciplina: '+s.nome,'Tópico: '+t.nome,'Dificuldade: '+guia+'.',
  opts.foco?'Foco pedido pelo aluno: '+opts.foco+'.':'',
  opts.erros?'Ele errou recentemente estas questões deste tópico; crie questões que treinem os mesmos conceitos, sem copiá-las:\n'+opts.erros:'',
  avoid?'Não repita estas questões já feitas:\n'+avoid:'',
  'Regras: varie o que cada questão cobra dentro do tópico. Distratores plausíveis, baseados em erros comuns. Em cálculo, use números que dão conta limpa. '+STYLE,
  'Explicação: até 3 frases, dizendo por que a correta está certa e qual o erro mais comum.',
  'Responda somente com JSON neste formato:',
  '{"questoes":[{"enunciado":"...","alternativas":["...","...","...","...","..."],"correta":0,"explicacao":"..."}]}',
  '"correta" é o índice (0 a 4) da alternativa certa. Não coloque letras como A) ou B) dentro das alternativas.'].filter(Boolean).join('\n');
}
function promptSim(list){
  return [ctxProva(),'Crie '+list.length+' questões inéditas de múltipla escolha para um simulado, no estilo da banca Instituto AOCP (enunciado direto, 5 alternativas, só uma correta). Uma questão para cada tópico abaixo, na mesma ordem:',
  list.map((p,i)=>{ const info=topicInfo(p.t); return (i+1)+'. ['+p.t+'] '+info.s.nome+': '+info.t.nome+', nível '+['fácil','médio','difícil','difícil'][T(p.t).rung||0]; }).join('\n'),
  'Regras: distratores plausíveis. Em cálculo, números que dão conta limpa. '+STYLE+' Não coloque letras A), B) dentro das alternativas.',
  'Explicação: até 3 frases.',
  'Responda somente com JSON: {"questoes":[{"topico":"id do tópico","enunciado":"...","alternativas":["...","...","...","...","..."],"correta":0,"explicacao":"..."}]}'].join('\n');
}
function promptRedacao(tema,texto){
  return ['Você corrige redações de concurso com o rigor da banca Instituto AOCP. Corrija a redação abaixo pelos 4 critérios do edital de Cadete do CBMPR, cada um valendo de 0 a 5 (use meio ponto se precisar):',
  '1. Atendimento e desenvolvimento do tema, informatividade e argumentação.',
  '2. Coesão dentro e entre parágrafos, e coerência (progressão, articulação, não contradição).',
  '3. Atendimento à estrutura dissertativo-argumentativa (organização do texto e dos parágrafos).',
  '4. Modalidade gramatical: pontuação, grafia, concordância, regência e colocação pronominal.',
  'A prova pede de 15 a 30 linhas e fuga ao tema zera a nota. Não infle a nota.',
  'Tema: '+tema,'Texto:','"""'+texto+'"""',
  'Responda somente com JSON:',
  '{"notas":[0,0,0,0],"comentarios":["...","...","...","..."],"correcoes":["trecho original → forma correta"],"prioridade":"a única mudança que mais aumentaria a nota na próxima redação","reescrita":"o parágrafo mais fraco reescrito do jeito certo"}',
  '"comentarios" tem um comentário curto por critério, na mesma ordem. "correcoes" tem no máximo 6 itens.'].join('\n');
}
function promptPlanoRedacao(tema){
  return [ctxProva(),'Monte o plano de uma redação dissertativo-argumentativa de 20 a 30 linhas sobre o tema abaixo, pensando nos 4 critérios da banca (tema e argumentação, coesão e coerência, estrutura, gramática).','Tema: '+tema,
  'Entregue: 1) uma tese em uma frase; 2) dois argumentos, cada um com um repertório concreto (dado, lei, fato, exemplo da atuação dos bombeiros ou da Defesa Civil); 3) a proposta de conclusão; 4) três conectivos para abrir os parágrafos de desenvolvimento; 5) dois erros que costumam derrubar a nota nesse tema.',
  'Não escreva a redação pronta: é um esqueleto para ele escrever. '+STYLE+' No máximo 230 palavras.'].join('\n');
}
function promptCards(info,foco,n){
  return [ctxProva(),'Crie '+n+' flashcards de revisão.','Disciplina: '+info.s.nome,'Tópico: '+info.t.nome+(foco?'\nFoco: '+foco:''),
  'Regras: frente com uma pergunta curta ou um termo; verso com a resposta curta (até 25 palavras) e exata. Um fato por cartão. Priorize o que mais cai em prova objetiva. '+STYLE,
  'Responda somente com JSON: {"cards":[{"frente":"...","verso":"..."}]}'].join('\n');
}
function promptAula(info){
  const base=CONTENT[info.t.id]?'\nResumo que ele já tem (não repita, aprofunde):\n'+stripQ(CONTENT[info.t.id]).slice(0,1200):'';
  return [ctxProva(),'Dê uma aula do zero sobre o tópico abaixo, para quem nunca estudou o assunto.','Disciplina: '+info.s.nome,'Tópico: '+info.t.nome+base,
  'Estrutura: **O que é** (2 frases, com uma analogia do dia a dia, de preferência da rotina de bombeiro); **O mínimo que cai** (4 a 6 tópicos curtos); **Exemplo resolvido** (uma questão curta no estilo da banca, resolvida passo a passo); **Pegadinhas** (2 ou 3); **Teste rápido** (3 perguntas curtas, com as respostas no final, depois de uma linha "Respostas:").',
  STYLE+' No máximo 380 palavras.'].join('\n');
}
function promptMacete(c,info){
  return [ctxProva(),'Crie um macete de memória (mnemônico, associação ou imagem mental) para fixar este flashcard. Uma ou duas frases, fácil de lembrar na hora da prova.',
  'Matéria: '+(info?info.s.nome+' / '+info.t.nome:''),'Frente: '+c.f,'Verso: '+c.b,STYLE,'Responda só com o macete.'].join('\n');
}
function promptPainel(){
  const O=overall(), w=statsRange(7);
  const rows=SUBJECTS.map(s=>s.nome+' ('+s.q+' questões): domínio '+Math.round(subjMastery(s.id)*100)+'%, acerto estimado '+Math.round(subjProj(s.id)*100)+'%').join('\n');
  const weak=[]; allTopics().forEach(({s,t})=>{ const e=topicEvidence(t.id); if(e.N>=2) weak.push({n:s.nome+': '+t.nome,a:(e.OK+1)/(e.N+2)}); }); weak.sort((a,b)=>a.a-b.a);
  return ctxProva()+'\nVocê é o orientador de estudos dele. Dados do app:\n'+rows+'\nDomínio geral: '+Math.round(O.m*100)+'%. Projeção: cerca de '+Math.round(O.proj)+' de 70.\nTópicos com pior acerto: '+(weak.slice(0,6).map(x=>x.n+' ('+Math.round(x.a*100)+'%)').join('; ')||'ainda sem dados suficientes')+'.\nÚltimos 7 dias: '+fmtMin(w.min)+', '+w.q+' questões, '+w.c+' flashcards, '+w.xp+' XP. Sequência atual: '+streak()+' dias. Flashcards vencidos: '+totalFlashDue()+'. Erros para refazer: '+rfDue().length+'.\nFaça um diagnóstico direto, em até 200 palavras: 1) o que mais está custando pontos agora, considerando o peso de cada matéria; 2) um plano para os próximos 7 dias com 3 prioridades, dizendo qual recurso do app usar em cada (missões do dia, jogos por matéria, Chefão, revisão inteligente, simulado, Teste 80/20, tutor); 3) um alerta se algo estiver sendo negligenciado. Se houver poucos dados, diga isso e sugira como começar. '+STYLE;
}

/* ---------- Conversas (Instrutor, Tira-dúvidas, Destravar, Me explique) ---------- */
const CONV_RULES={
  instrutor:'Você é o Instrutor do app de estudos: professor particular, paciente e firme, especialista em todas as matérias do edital de Cadete do CBMPR. Responda o que ele perguntar com a máxima didática: primeiro a resposta curta, depois a explicação com exemplo, e uma dica de como isso cai na prova. Se ele estiver numa questão (veja "Tela atual"), use-a como contexto. Se ele pedir um plano, use os dados de progresso. No máximo 200 palavras, salvo se ele pedir resolução completa.',
  duvida:'Você é professor de cursinho. Responda a dúvida de forma simples: primeiro a resposta em uma ou duas frases; depois a explicação com um exemplo prático (de preferência ligado ao dia a dia de bombeiro ou a uma questão de prova); por fim, uma dica de como isso costuma cair. No máximo 180 palavras.',
  socratic:'Você é o tutor particular dele. Ele trava em questão difícil e desanima quando recebe tudo de uma vez. Nunca entregue a resposta final logo de cara. Quebre a resolução em degraus pequenos: UM degrau por mensagem, terminando com uma pergunta curta que ele consiga responder. Se ele errar ou disser que não sabe, dê uma dica menor, sem sermão. Se o travamento for de base (frações, potências, regra de três, leitura do enunciado), diga isso e ensine esse pedaço antes. Quando ele chegar à resposta, peça que resuma a regra em uma frase. Se ele pedir a resolução completa, entregue em passos numerados. No máximo 120 palavras por mensagem.',
  explica:'Você é o professor particular dele e ele pode ser 100% leigo no assunto. Máxima didática. Regras: linguagem simples, todo termo técnico explicado na hora; se ele disser qual parte não entendeu, explique SÓ essa parte; se a dúvida estiver vaga, faça UMA pergunta curta para descobrir onde travou; se ele não entendeu nada, siga esta ordem: (a) o que a questão pede, (b) o conceito do básico com uma analogia do dia a dia, (c) a resolução passo a passo, (d) por que cada alternativa errada está errada, (e) UMA pergunta curta para testar; se ele errou, mostre com respeito onde o raciocínio escorregou. Tom de instrutor paciente e firme.'
};
const CONV_CHIPS={
  instrutor:[['Me explica isso de um jeito simples.','Explica simples'],['Me dá um macete para não esquecer.','Macete'],['Faz uma questão parecida para eu testar, sem dar a resposta.','Questão parecida'],['O que eu devo estudar agora, pelos meus dados?','O que estudar agora']],
  duvida:[['Explica de outro jeito, mais simples.','Outro jeito'],['Me dá outro exemplo prático.','Outro exemplo'],['Faz uma questão de prova sobre isso, sem dar a resposta.','Questão sobre isso']],
  socratic:[['Próximo degrau, por favor.','Próximo degrau'],['Não entendi. Me dá uma dica menor.','Dica menor'],['Me mostra a resolução completa, passo a passo.','Resolução completa']],
  explica:[['Explica de outro jeito, mais simples ainda.','Outro jeito'],['Me dá um exemplo do dia a dia.','Exemplo do dia a dia'],['Faz uma questão parecida pra eu testar, sem me dar a resposta.','Questão parecida'],['Qual o macete pra eu não errar isso de novo?','Macete']]
};
const CONVS={};
function progressBrief(){
  const O=overall(), weak=ranked().slice(0,4).map(r=>r.s.nome+': '+r.t.nome).join('; ');
  return 'Progresso: domínio geral '+Math.round(O.m*100)+'%, projeção de '+Math.round(O.proj)+' acertos de 70; prioridades da fila: '+weak+'; flashcards vencidos: '+totalFlashDue()+'; erros para refazer: '+rfDue().length+'.';
}
function screenContext(){
  const G=tutor.game, Q=tutor.quiz, M=tutor.sim, R=tutor.rf, F=tutor.flash;
  try{
    if(G&&!G.done){ const r=G.rounds[G.pos]; if(r) return 'Tela atual: jogo "'+(G.title||'')+'". Questão: '+stripQ(r.q)+(r.opts?' | Alternativas: '+r.opts.join(' / '):'')+(G.pick!=null?' | Resposta certa: '+(r.opts?r.opts[r.right]:''):''); }
    if(Q&&Q.qs){ const i=Q.ans.findIndex(a=>a==null); const q=Q.qs[i<0?Q.qs.length-1:i]; return 'Tela atual: treino de questões. Questão: '+q.enunciado+' | Alternativas: '+q.alternativas.join(' / '); }
    if(M&&!M.done){ const r=M.qs[M.pos]; return 'Tela atual: simulado em andamento (não dê a resposta da questão, só explique conceitos). Questão: '+stripQ(r.q); }
    if(R&&!R.done){ const e=S.erros.find(x=>x.id===R.list[R.pos]); if(e) return 'Tela atual: refazendo um erro do caderno. Questão: '+stripQ(e.q||e.errei); }
    if(F&&!F.done){ const it=F.q[F.pos]; const c=it&&cardById(it.t,it.id); if(c) return 'Tela atual: flashcard. Frente: '+c.f+(F.revealed?' | Verso: '+c.b:''); }
    if(UI.topicOpen){ const i=topicInfo(UI.topicOpen); if(i) return 'Tela atual: tópico '+i.s.nome+': '+i.t.nome+'.'; }
  }catch(e){}
  return 'Tela atual: '+({hoje:'Hoje',mapa:'Painel',erros:'Caderno de erros',redacao:'Redação',tutor:'Treino'}[UI.tab]||'')+'.';
}
function openConv(key,o){
  let C=CONVS[key];
  if(!C||o&&o.reset) C=CONVS[key]=Object.assign({key,mode:'instrutor',title:'Instrutor',ctx:'',turns:[],busy:false,ctl:null,err:'',img:null},o||{});
  else if(o&&o.ctx&&o.ctx!==C.ctx){ C.ctx=o.ctx; }
  UI.conv=key; drawConv();
}
function drawConv(opts){
  const C=CONVS[UI.conv]; if(!C) return;
  let h='<div class="convhead"><span class="conv-ic">'+ICO.spark+'</span><div><h2 id="sheetTitle">'+esc(C.title)+'</h2><p class="small muted">'+esc({instrutor:'Pergunte qualquer coisa. Ele vê a tela em que você está.',duvida:'Resposta simples, com exemplo prático.',socratic:'Um degrau por vez, sem entregar a resposta.',explica:'Diga onde travou e ele explica só isso.'}[C.mode]||'')+'</p></div></div>';
  if(C.card) h+='<div class="exq">'+C.card+'</div>';
  if(sampleOff) h+='<p class="note small">O Claude não está liberado nesta página. Ao enviar, o app monta o pedido para você copiar e colar no chat do Claude.</p>';
  h+='<div class="chat" id="convChat">';
  if(!C.turns.length&&C.intro) h+='<div class="msg a">'+fmtText(C.intro)+'</div>';
  C.turns.forEach(m=>{ h+='<div class="msg '+(m.role==='user'?'u':'a')+'">'+(m.role==='user'?esc(m.show||m.content):fmtText(m.content))+(m.img?'<span class="small muted"> · foto enviada</span>':'')+'</div>'; });
  if(C.busy) h+='<div class="msg a pending" id="convStream"><span class="dots"><i></i><i></i><i></i></span> Pensando</div>';
  h+='</div>';
  if(C.err) h+='<p class="badbox small">'+esc(C.err)+'</p>';
  if(C.busy) h+='<button class="btn block" data-a="convStop">Parar resposta</button>';
  else {
    h+='<div class="chips">'+(CONV_CHIPS[C.mode]||[]).map(([v,l])=>'<button class="chip" data-a="convQuick" data-v="'+esc(v)+'">'+esc(l)+'</button>').join('')+'</div>';
    h+='<label class="f" for="convIn">'+(C.turns.length?'Continue a conversa':'Sua pergunta')+'</label><textarea id="convIn" rows="3" placeholder="'+esc(C.ph||'Escreva aqui')+'"></textarea>';
    h+='<div class="row convbar">'+(sampleImages?'<label class="btn ghost filebtn">'+ICO.camera+'<span>'+(C.img?'Foto pronta':'Foto')+'</span><input type="file" id="convImg" accept="image/*" hidden></label>':'')+'<button class="btn primary grow" data-a="convSend">Enviar</button>'+(C.turns.length?'<button class="btn ghost" data-a="convNew">Nova</button>':'')+'</div>';
  }
  openSheet(h,{key:'conv:'+C.key,keep:true});
  const ch=$('#convChat'); if(ch){ const pn=$('#sheet .panel'); setTimeout(()=>{ pn.scrollTop=pn.scrollHeight; },30); }
}
function convRules(C){ return CONV_RULES[C.mode]+'\n'+ctxProva()+'\n'+STYLE+'\n'+(C.mode==='instrutor'?progressBrief()+'\n'+screenContext():'')+(C.ctx?'\n\nContexto da questão:\n'+C.ctx:''); }
async function convSend(text,show){
  const C=CONVS[UI.conv]; if(!C||C.busy) return;
  text=(text||'').trim(); if(!text&&!C.img){ toast('Escreva sua pergunta.'); return; }
  if(!text) text='Veja a foto da questão e me ajude.';
  const s=await getSample();
  if(!s){ sheetCopy('Copiar pedido para o chat do Claude',convRules(C)+'\n\n'+C.turns.map(m=>(m.role==='user'?'Aluno: ':'Professor: ')+m.content).join('\n\n')+'\n\nAluno: '+text); return; }
  const img=C.img; C.img=null;
  C.turns.push({role:'user',content:text,show:show||text,img:!!img}); C.err=''; C.busy=true; C.ctl=new AbortController();
  const dd=Dm(today()); dd.ex=(dd.ex||0)+1;
  drawConv();
  const T0=C.turns, kept=T0.length>12?T0.slice(-12):T0;
  const input=[{role:'user',content:convRules(C)}].concat(kept.map(m=>({role:m.role,content:m.content})));
  try{
    const opt={cache:false,signal:C.ctl.signal,onText:({text})=>{ const el=document.getElementById('convStream'); if(el){ el.classList.remove('pending'); el.innerHTML=fmtText(text); const pn=$('#sheet .panel'); if(pn&&pn.scrollHeight-pn.scrollTop-pn.clientHeight<160) pn.scrollTop=pn.scrollHeight; } }};
    if(img) opt.images=img;
    const r=await s(input,opt);
    C.turns.push({role:'assistant',content:r.text+(r.truncated?'\n\n(resposta cortada; peça para continuar)':'')});
    if(C.turns.filter(m=>m.role==='user').length===1) gainXP(3);
  }catch(e){
    if(e&&e.text) C.turns.push({role:'assistant',content:e.text+'\n\n(interrompido)'});
    const m=sampleMsg(e); if(m) C.err=m;
    if(!(e&&e.text)&&e&&e.code!=='cancelled'){ C.turns.pop(); }
  }finally{ C.busy=false; C.ctl=null; commit(); if(UI.conv===C.key&&!$('#sheet').hidden&&SHEET.key==='conv:'+C.key) drawConv(); }
}

/* ---------- Caixas de IA embutidas (análise do painel, aula, macete, plano de redação) ---------- */
const AIR={};
function aiBox(key){ const a=AIR[key]; if(!a) return ''; let h=''; if(a.text) h+=fmtText(a.text); else if(a.busy) h+='<span class="muted"><span class="dots"><i></i><i></i><i></i></span> Pensando</span>'; if(a.err) h+='<p class="small m0" style="margin:6px 0 0">'+esc(a.err)+'</p>'; return h; }
function paintAI(key){ const el=document.getElementById('ai-'+key); if(el){ el.innerHTML=aiBox(key); el.hidden=false; } }
async function aiRun(key,prompt,opts){
  opts=opts||{};
  if(AIR[key]&&AIR[key].busy) return null;
  const s=await getSample(); if(!s){ sheetCopy('Copiar pedido para o chat do Claude',prompt); return null; }
  AIR[key]={busy:true,text:''}; paintAI(key);
  try{ const r=await s(prompt,{cache:false,modelTier:opts.tier,onText:({text})=>{ if(AIR[key]){ AIR[key].text=text; paintAI(key); } }}); AIR[key]={text:r.text}; paintAI(key); if(opts.done) opts.done(r.text); return r.text; }
  catch(e){ AIR[key]={text:(e&&e.text)||'',err:sampleMsg(e)||'Não deu certo. Tente de novo.'}; paintAI(key); return null; }
}

/* ---------- Geração de questões (Treino no seu nível) ---------- */
async function gerarQuiz(tid,nivel,opts){
  const info=topicInfo(tid); if(!info) return;
  if(tutor.quizGen&&tutor.quizGen.busy) return;
  opts=opts||{};
  const prompt=promptGerar(info.s,info.t,nivel,opts);
  clearModes(); UI.tab='tutor'; saveUI(); closeSheetSilently();
  const G={tid,n:nivel,busy:true,got:0,err:'',ctl:new AbortController(),opts};
  tutor.quizGen=G; render(); window.scrollTo(0,0);
  const s=await getSample();
  if(tutor.quizGen!==G) return;
  if(!s){ tutor.quizGen=null; const local=localQuiz(tid,nivel); if(local){ startQuiz(tid,nivel,local,'banco'); toast('Claude indisponível: montei o treino com o banco do app.'); } else { render(); sheetCopy('Copiar pedido de questões',prompt.replace('Responda somente com JSON neste formato:','Mostre as questões numeradas e deixe o gabarito comentado no final. Formato de referência:')); } return; }
  try{
    const data=await s.json(prompt,{cache:false,signal:G.ctl.signal,onText:({text})=>{ const n=(text.match(/"enunciado"/g)||[]).length; if(n!==G.got&&tutor.quizGen===G){ G.got=n; const el=$('#genProg'); if(el){ el.style.width=Math.min(100,n*20)+'%'; } const lb=$('#genLbl'); if(lb) lb.textContent=Math.min(n,5)+' de 5 questões escritas'; } }});
    const qs=(data&&Array.isArray(data.questoes)?data.questoes:[]).filter(validQ).slice(0,5);
    if(!qs.length) throw {code:'invalid_json'};
    if(tutor.quizGen!==G) return;
    tutor.quizGen=null;
    const clean=qs.map(q=>({enunciado:String(q.enunciado),alternativas:q.alternativas.map(String),correta:q.correta,explicacao:String(q.explicacao||'')}));
    const bank=S.qbank[tid]||(S.qbank[tid]=[]); clean.forEach(q=>bank.push({q:q.enunciado,o:q.alternativas,r:q.correta,x:q.explicacao,lv:nivel,at:Date.now()})); if(bank.length>15) S.qbank[tid]=bank.slice(-15);
    commit(); SND.start();
    startQuiz(tid,nivel,clean,'ia');
  }catch(e){
    if(tutor.quizGen!==G) return;
    G.busy=false; G.err=sampleMsg(e); if(!G.err){ tutor.quizGen=null; }
    render();
  }
}
function validQ(q){ return q&&typeof q.enunciado==='string'&&q.enunciado.trim()&&Array.isArray(q.alternativas)&&q.alternativas.length===5&&q.alternativas.every(a=>String(a).trim())&&Number.isInteger(q.correta)&&q.correta>=0&&q.correta<5; }
function localQuiz(tid,nivel){
  const out=[], seen=new Set(), add=q=>{ if(out.length<5&&q&&!seen.has(q.enunciado)){ seen.add(q.enunciado); out.push(q); } };
  (S.qbank[tid]||[]).slice().reverse().forEach(q=>add({enunciado:q.q,alternativas:q.o,correta:q.r,explicacao:q.x||''}));
  if(TESTE80[tid]) shuffle(TESTE80[tid].qs).forEach(q=>add({enunciado:q.q,alternativas:q.o,correta:q.r,explicacao:q.x||''}));
  ARENA.filter(g=>g.t===tid).forEach(g=>{ const seen2=new Set(); for(let i=0;i<12&&out.length<5;i++){ const r=arMake(g,clamp((nivel||0)+2+rI(0,1),1,5),seen2,true); if(r&&!r.fig&&r.opts.length>=4) add({enunciado:stripQ(r.q),alternativas:r.opts.slice(0,5),correta:r.right,explicacao:r.x||(r.steps?r.steps.join(' '):'')}); } });
  const defs=GAMES.filter(g=>g.t===tid&&['classify','choice','pick','tf','calc'].includes(g.type));
  let guard=0; while(out.length<5&&defs.length&&guard<40){ guard++; const def=one(defs); const r=def.type==='calc'?calcRound(def):buildRound(def,one(def.items.map((_,i)=>i))); if(r&&r.opts&&r.opts.length<=5) add({enunciado:(def.type==='calc'?'':def.title+': ')+stripQ(r.q),alternativas:r.opts,correta:r.right,explicacao:r.x||(r.steps?r.steps.join(' '):'')}); }
  return out.length>=3?out:null;
}
function startQuiz(tid,nivel,qs,src){
  clearModes();
  tutor.quiz={t:tid,n:nivel,src,qs,ans:qs.map(()=>null),time:qs.map(()=>0),running:null,logged:false,start:Date.now()};
  UI.tab='tutor'; saveUI(); render(); window.scrollTo(0,0);
}
async function runAISim(mode,sid,n){
  const list=simTopics(mode,sid,n); const s=await getSample();
  if(!s){ sheetCopy('Copiar pedido de simulado',promptSim(list)); return; }
  closeSheetSilently(); clearModes(); const G={done:0,total:n,err:'',ctl:new AbortController()}; tutor.simGen=G; UI.tab='tutor'; saveUI(); render();
  const qs=[];
  for(let i=0;i<list.length;i+=5){
    const part=list.slice(i,i+5);
    try{ const d=await s.json(promptSim(part),{cache:false,signal:G.ctl.signal});
      (d&&Array.isArray(d.questoes)?d.questoes:[]).forEach((q,k)=>{ if(!validQ(q)) return; const p=part.find(x=>x.t===q.topico)||part[k]||part[0]; qs.push({q:String(q.enunciado),opts:q.alternativas.map(String),right:q.correta,x:String(q.explicacao||''),t:p.t,s:p.s}); }); }
    catch(e){ if(e&&e.code==='cancelled') return; G.err=sampleMsg(e); if(e&&AI_OFF_CODES.concat(['session_expired','rate_limited']).includes(e.code)) break; }
    if(tutor.simGen!==G) return;
    G.done=Math.min(n,qs.length); if(UI.tab==='tutor'&&$('#sheet').hidden) render();
  }
  if(tutor.simGen!==G) return;
  if(qs.length<3){ G.fail=true; G.err=G.err||'Não deu para gerar o simulado agora.'; render(); return; }
  startSim(qs,'Simulado inédito','ia');
}
