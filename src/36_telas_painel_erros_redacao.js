
/* ===================== "ME EXPLIQUE" (botão em toda questão) ===================== */
const EXQ={}; let exSeq=0;
function exBtn(ctx,label){ const key='ex'+(++exSeq); EXQ[key]=ctx; if(exSeq>400){ const ks=Object.keys(EXQ); ks.slice(0,ks.length-300).forEach(k=>delete EXQ[k]); } return '<button class="btn exbtn block" data-a="exOpen" data-k="'+key+'">'+ICO.chat+'<span>'+esc(label||'Me explique essa questão')+'</span></button>'; }
function exContext(c){
  const L='ABCDE'; let t='Matéria: '+(c.subj||'')+'\nQuestão: '+stripQ(c.q)+'\n';
  if(c.opts&&c.opts.length) t+='Alternativas:\n'+c.opts.map((o,i)=>L[i]+') '+o).join('\n')+'\n';
  if(c.opts&&c.pick!=null) t+='O aluno marcou: '+L[c.pick]+') '+c.opts[c.pick]+(c.pick===c.right?' (acertou)':' (errou)')+'\n';
  else if(c.opts) t+='O aluno ainda não respondeu ou vai refazer.\n';
  if(c.opts&&c.right!=null) t+='Resposta correta: '+L[c.right]+') '+c.opts[c.right]+'\n';
  if(c.x) t+='Comentário do banco: '+stripQ(c.x)+'\n';
  if(c.steps&&c.steps.length) t+='Resolução do banco: '+c.steps.join(' | ')+'\n';
  return t;
}
function openExplain(c){
  const card='<div class="small muted">'+esc(c.subj||'')+'</div><div class="exq-q">'+fmtText(stripQ(c.q))+'</div>'+(c.opts&&c.right!=null?'<div class="small" style="margin-top:8px"><b class="m4">Correta:</b> '+esc(c.opts[c.right])+(c.pick!=null&&c.pick!==c.right?'<br><b class="m0">Você marcou:</b> '+esc(c.opts[c.pick]):'')+'</div>':'');
  const ctx=exContext(c);
  openConv('ex:'+hashStr(ctx),{mode:'explica',title:'Me explique essa questão',ctx,card,intro:'Qual parte você não entendeu? Diga onde travou e eu explico só isso. Se não entendeu nada, toque em "Outro jeito" ou escreva "do zero".',ph:'Ex.: por que a resposta é essa? / o que é empuxo? / de onde saiu esse número?'});
}

/* ===================== PAINEL ===================== */
function ladder(rung,big){
  const w=big?56:22,h=big?96:34,xl=big?10:4,xr=big?46:18,ys=big?[78,50,22]:[27,17,7],sw=big?6:2.6;
  let s='<svg class="ladder'+(big?' big':'')+'" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" aria-hidden="true"><line class="rail" x1="'+xl+'" y1="2" x2="'+xl+'" y2="'+(h-2)+'"/><line class="rail" x1="'+xr+'" y1="2" x2="'+xr+'" y2="'+(h-2)+'"/>';
  ys.forEach((y,i)=>{ const c=i<rung?'on':(i===rung?'cur':'off'); s+='<line class="rung '+c+'" x1="'+xl+'" y1="'+y+'" x2="'+xr+'" y2="'+y+'" stroke-width="'+sw+'"/>'; });
  return s+'</svg>';
}
function metricsChart(n){
  const k=today();
  if(n<=30){
    const days=[]; for(let i=n-1;i>=0;i--){ const dk=addDays(k,-i), d=S.days[dk]||{}; days.push({dk,v:d.xp||0,meta:d.meta}); }
    const mx=Math.max(goalXP(),...days.map(x=>x.v)), dense=n>15, every=n<=7?1:(n<=15?2:5), gl=Math.round(goalXP()/mx*100);
    return '<div class="wchart'+(dense?' dense':'')+'"><div class="wc-h"><b>XP por dia</b><span class="small muted">linha: meta de '+goalXP()+'</span></div><div class="wc-bars"><em class="wc-goal" style="bottom:'+gl+'%"></em>'+days.map((x,i)=>'<div class="wc-col'+(x.dk===k?' today':'')+(x.v?' has':'')+(x.meta?' meta':'')+'"><span class="wc-v">'+(!dense&&x.v?x.v:'')+'</span><i style="height:'+Math.max(3,Math.round(x.v/mx*100))+'%"></i><span class="wc-d">'+(((n-1-i)%every===0||x.dk===k)?dateOf(x.dk).getDate():'')+'</span></div>').join('')+'</div></div>';
  }
  const months=[], now=new Date();
  for(let i=11;i>=0;i--){ const dt=new Date(now.getFullYear(),now.getMonth()-i,1), y=dt.getFullYear(), m=dt.getMonth(); let v=0; for(const dk in S.days){ const dd=dateOf(dk); if(dd.getFullYear()===y&&dd.getMonth()===m) v+=S.days[dk].xp||0; } months.push({y,m,v}); }
  const mx=Math.max(1,...months.map(x=>x.v));
  return '<div class="wchart"><div class="wc-h"><b>XP por mês</b><span class="small muted">últimos 12 meses</span></div><div class="wc-bars">'+months.map(x=>{ const cur=x.y===now.getFullYear()&&x.m===now.getMonth(); return '<div class="wc-col'+(cur?' today':'')+(x.v?' has':'')+'"><span class="wc-v">'+(x.v||'')+'</span><i style="height:'+Math.max(3,Math.round(x.v/mx*100))+'%"></i><span class="wc-d">'+new Date(x.y,x.m,1).toLocaleDateString('pt-BR',{month:'short'}).replace('.','')+'</span></div>'; }).join('')+'</div></div>';
}
function bigStat(label,val,sub){ return '<div class="bstat"><b>'+val+'</b><span>'+esc(label)+'</span>'+(sub?'<em>'+esc(sub)+'</em>':'')+'</div>'; }
function sheetMetrics(){
  const range=UI.metRange||7, T0=statsRange(1), R=statsRange(range), fd=totalFlashDue();
  let h='<h2 id="sheetTitle">Métricas</h2><h3>Hoje</h3><div class="bigstats">'+bigStat('XP',cuN(T0.xp),'meta: '+goalXP())+bigStat('Tempo estudado',fmtMin(T0.min))+bigStat('Questões',cuN(T0.q),T0.q?pct(T0.a,T0.q)+' de acerto':'')+bigStat('Flashcards',cuN(T0.c),fd?fd+' vencendo agora':'')+'</div>';
  h+='<h3 style="margin-top:22px">Por período</h3><div class="seg wide" role="group">'+[7,15,30,365].map(n=>'<button class="'+(n===range?'on':'')+'" data-a="metRange" data-n="'+n+'">'+(n===365?'1 ano':n+' dias')+'</button>').join('')+'</div>';
  h+='<div class="bigstats" style="margin-top:12px">'+bigStat('XP',cuN(R.xp))+bigStat('Tempo estudado',fmtMin(R.min))+bigStat('Questões',cuN(R.q),R.q?pct(R.a,R.q)+' de acerto':'')+bigStat('Flashcards',cuN(R.c))+bigStat('Erros refeitos',cuN(R.rf),R.rf?pct(R.rfok,R.rf)+' de acerto':'')+bigStat('Itens de jogo',cuN(R.g))+'</div>';
  h+=metricsChart(range);
  openSheet(h,{key:'metrics',keep:true});
}
function sheetRank(){
  const P=patente(), lv=levelFromXP(xpTotal());
  let h='<h2 id="sheetTitle">Patente e nível</h2><div class="rankcard"><span class="insig big">'+insigniaSVG(P.idx)+'</span><div><b>'+esc(PATENTES[P.idx])+'</b><span class="small muted">'+(P.next!=null?'Próxima: '+esc(PATENTES[P.idx+1])+' com '+Math.round(P.next*100)+'% de domínio geral':'Patente máxima')+'</span><div class="bar"><i style="width:'+Math.round(P.within*100)+'%"></i></div></div></div>';
  h+='<p class="small">A <b>patente</b> mede o que você sabe: acompanha o domínio geral do Painel ('+Math.round(P.m*100)+'% agora). O <b>nível</b> mede o esforço: sobe com todo XP que você ganha.</p>';
  h+='<ol class="patlist">'+PATENTES.map((p,i)=>'<li class="'+(i<P.idx?'done':(i===P.idx?'cur':''))+'"><span class="insig sm">'+insigniaSVG(i)+'</span><span>'+esc(p)+'</span><em>'+Math.round(PAT_T[i]*100)+'%</em></li>').join('')+'</ol>';
  h+='<h3>Nível '+lv.L+'</h3><div class="lvlbar"><i style="width:'+Math.round(lv.pct*100)+'%"></i></div><p class="small muted">'+lv.into+' de '+lv.need+' XP para o nível '+(lv.L+1)+'. Total: '+xpTotal()+' XP.</p>';
  h+='<h3>Como ganhar XP</h3><div class="crit small"><span>Acerto em jogo</span><span>10+ (combo soma)</span><span>Flashcard revisado</span><span>2 a 6</span><span>Erro refeito com acerto</span><span>10</span><span>Questão de simulado certa</span><span>8</span><span>Minuto no cronômetro</span><span>1</span><span>Missão cumprida</span><span>'+MIS_XP+'</span><span>Todas as missões</span><span>+'+MIS_BONUS+'</span><span>Conquista</span><span>40</span></div><p class="small muted">Errar também dá um pouco de XP: tentar é o que faz aprender.</p>';
  openSheet(h);
}
function viewMapa(){
  snapWeek();
  const O=overall(), P=patente(), lv=levelFromXP(xpTotal());
  let h=pageHead('Painel');
  h+='<div class="hero"><div><b>'+cuN(Math.round(O.m*100),'%')+'</b><span>domínio geral</span></div><div><b>~'+cuN(Math.round(O.proj))+'</b><span>acertos projetados de 70</span></div></div>';
  h+='<div class="projbar" aria-hidden="true"><i style="width:'+Math.min(100,Math.round(O.proj/70*100))+'%"></i><em style="left:50%"></em></div><p class="small muted">A linha vermelha marca 35, o mínimo para não ser eliminado. <button class="linkbtn small" data-a="howCalc">Como calculamos</button></p>';
  h+='<button class="rankcard btnlike" data-a="rankOpen"><span class="insig">'+insigniaSVG(P.idx)+'</span><div><b>'+esc(PATENTES[P.idx])+' · Nível '+lv.L+'</b><span class="small muted">'+(P.next!=null?'Próxima patente com '+Math.round(P.next*100)+'% de domínio':'Patente máxima')+'</span><div class="bar"><i style="width:'+Math.round(P.within*100)+'%"></i></div></div></button>';
  h+='<div class="row" style="margin-top:12px"><button class="btn" data-a="aiPainel">'+ICO.spark+' Análise do Claude</button><button class="btn ghost" data-a="achOpen">'+ICO.medal+' Conquistas '+Object.keys(S.ach).length+'/'+ACH.length+'</button><button class="btn ghost" data-a="metOpen">Métricas</button></div>';
  h+='<div class="aibox" id="ai-painel"'+(AIR.painel?'':' hidden')+'>'+aiBox('painel')+'</div>';
  h+=metricsChart(14);
  h+='<h2>Matérias</h2>';
  Object.keys(BLOCOS).forEach(bid=>{
    const ss=SUBJECTS.filter(s=>s.bloco===bid); if(!ss.length) return;
    const q=ss.reduce((a,s)=>a+s.q,0), avg=ss.reduce((a,s)=>a+subjMastery(s.id),0)/ss.length, bcl=mCls(avg);
    h+='<details class="subj" open><summary><span class="sn"><i class="mdot" style="background:var(--'+bcl+')"></i>'+esc(BLOCOS[bid])+'</span><span class="sq">'+q+' questões · '+Math.round(avg*100)+'%</span></summary><div class="inner"><ul class="list">';
    ss.forEach(s=>{ const m=subjMastery(s.id), cl=mCls(m); h+='<li><button class="subjrow" data-a="subjOpen" data-s="'+s.id+'"><span class="sr-top"><span class="nm"><i class="mdot" style="background:var(--'+cl+')"></i>'+esc(s.nome)+'</span><span class="lvl '+cl+'">'+nivel(m)+'</span></span><span class="mbar"><i style="width:'+Math.round(m*100)+'%;background:var(--'+cl+')"></i></span><span class="small muted">'+s.q+' questões na prova · '+Math.round(m*100)+'% de domínio · acerto estimado '+Math.round(subjProj(s.id)*100)+'%</span></button></li>'; });
    h+='</ul></div></details>';
  });
  const top=ranked().slice(0,5);
  h+='<h2>Próximos na fila</h2><p class="small muted">Os tópicos com mais peso na prova e menos domínio seu, na ordem em que valem mais a pena agora.</p><ul class="list">'+top.map(r=>{ const st=T(r.t.id); return '<li><button class="trow" data-a="topic" data-t="'+r.t.id+'">'+ladder(st.rung)+'<span><span class="nm">'+esc(r.t.nome)+'</span><br><span class="meta">'+esc(reason(r.s,r.t))+'</span></span><span class="pill">'+RUNGS[st.rung]+'</span></button></li>'; }).join('')+'</ul>';
  if(S.sims.length) h+='<h2>Simulados recentes</h2><div class="crit">'+S.sims.slice(-5).reverse().map(x=>'<span>'+x.d.split('-').reverse().slice(0,2).join('/')+', '+x.n+' questões</span><span>'+Math.round(100*x.ok/x.n)+'%</span>').join('')+'</div>';
  h+='<h2>Biblioteca oficial</h2><button class="btn" data-a="biblio">'+ICO.book+' Leis, normas e manuais</button>';
  h+='<h2>Ajustes e dados</h2><div class="row"><button class="btn" data-a="settings">'+ICO.gear+' Configurações</button><button class="btn ghost" data-a="backup">Backup</button><button class="btn ghost" data-a="restore">Restaurar</button></div>';
  h+='<p class="small muted" style="margin-top:10px">'+(SYNC.mode==='local'?'Seus dados estão salvos neste aparelho. Faça backup de vez em quando.':'Seus dados ficam na sua conta Claude, visíveis só para você, e em todos os seus aparelhos.')+'</p>';
  return h;
}
function sheetHow(){
  openSheet('<h2 id="sheetTitle">Como medimos seu domínio</h2><p>Tudo o que você faz vira <strong>pontos de evidência</strong> no tópico. Cada atividade tem um peso, porque nem toda cobrança mede a mesma coisa:</p><div class="crit"><span>1 questão difícil</span><span>1,4</span><span>1 questão do Teste 80/20</span><span>1,3</span><span>1 questão de simulado</span><span>1,2</span><span>1 questão média</span><span>1,0</span><span>1 questão fácil</span><span>0,6</span><span>1 item de minigame</span><span>0,5</span><span>1 flashcard revisado</span><span>0,35</span></div><p><strong>Domínio do tópico</strong> = acerto ponderado × confiança. A confiança cresce com o volume: com 12 pontos você está em 50%, com 50 pontos em 80%.</p><p><strong>Teto pela escada:</strong> jogo e flashcard mostram que você reconhece; questão difícil mostra que você aplica. O domínio para em 55% no degrau fácil, 75% no médio, 90% no difícil, e só tópico dominado chega a 100%.</p><p><strong>Esquecimento:</strong> a evidência perde metade do peso a cada 45 dias sem prática. Parou de estudar um tópico, ele volta para a fila.</p><p><strong>Chute não conta:</strong> no simulado, acerto marcado como chute não soma domínio.</p><p><strong>Matéria</strong> = média dos tópicos. <strong>Domínio geral</strong> = média das matérias ponderada pelo número de questões na prova. <strong>Projeção</strong> = seu acerto estimado em cada matéria × questões dela; sem dados, conta como chute (20%).</p>'); }
function sheetAch(){ const t=totals();
  openSheet('<h2 id="sheetTitle">Conquistas</h2><p class="small muted">'+Object.keys(S.ach).length+' de '+ACH.length+'. Cada nova conquista vale 40 XP.</p><ul class="list achlist">'+ACH.map(([id,nome,desc])=>{ const on=S.ach[id]; return '<li class="'+(on?'on':'')+'"><span class="ai insignia">'+(on?CHECK_SVG:'')+'</span><span><strong>'+esc(nome)+'</strong><br><span class="small muted">'+esc(desc)+(on?' Em '+on.split('-').reverse().join('/')+'.':'')+'</span></span></li>'; }).join('')+'</ul><p class="small muted">Totais: '+t.q+' questões, '+t.g+' itens de jogo, '+t.c+' flashcards, '+t.rf+' erros refeitos.</p>'); }
function sheetSubj(sid){
  const s=SUBJ[sid], L=S.topicList[sid]||[], m=subjMastery(sid), ev={};
  L.forEach(t=>{ const e=topicEvidence(t.id).by; for(const k in e) ev[k]=(ev[k]||0)+e[k]; });
  let h='<h2 id="sheetTitle">'+esc(s.nome)+'</h2><p class="muted">'+s.q+' questões na prova. Nível <strong class="'+mCls(m)+'">'+nivel(m)+'</strong>, '+Math.round(m*100)+'% de domínio.</p>';
  h+='<div class="evsrc">'+[['q','Questões'],['sim','Simulados'],['game','Jogos'],['card','Flashcards'],['teste80','80/20']].map(([k,l])=>'<div><b>'+nf(ev[k]||0)+'</b><span>'+l+'</span></div>').join('')+'</div><p class="small muted">Pontos de evidência por fonte, já com peso e esquecimento aplicados.</p>';
  const ks=Object.keys(S.hist).sort().slice(-8);
  if(ks.length>=2) h+='<h3 style="margin-top:14px">Evolução semanal</h3><div class="wbars">'+ks.map(k=>{ const v=((S.hist[k]||{}).s||{})[sid]||0; return '<div><span>'+v+'</span><i style="height:'+Math.max(2,v)+'%;background:var(--'+mCls(v/100)+')"></i></div>'; }).join('')+'</div>';
  h+='<div class="row" style="margin-top:14px"><button class="btn sm" data-a="relOpenS" data-s="'+sid+'">'+ICO.bolt+' Relâmpago</button><button class="btn sm" data-a="bossOpen" data-s="'+sid+'">'+ICO.crown+' Chefão</button><button class="btn sm" data-a="simSubj" data-s="'+sid+'">'+ICO.flag+' Simulado</button></div>';
  h+='<h3 style="margin-top:16px">Tópicos</h3><ul class="list">'+L.map(t=>{ const tm=topicMastery(t.id), st=T(t.id), tcl=mCls(tm); return '<li><button class="trow" data-a="topic" data-t="'+t.id+'">'+ladder(st.rung)+'<span><span class="nm">'+esc(t.nome)+'</span><span class="mbar sm"><i style="width:'+Math.round(tm*100)+'%;background:var(--'+tcl+')"></i></span></span><span class="pill '+tcl+'">'+Math.round(tm*100)+'%</span></button></li>'; }).join('')+'</ul><button class="linkbtn small" data-a="addTopic" data-s="'+sid+'">+ Adicionar tópico</button>';
  const gs=GAMES.filter(g=>g.s===sid);
  if(gs.length) h+='<h3 style="margin-top:16px">Jogos desta matéria</h3><div class="stack">'+gs.map(g=>'<button class="btn block" data-a="gOpen" data-id="'+g.id+'">'+esc(g.title)+'</button>').join('')+'</div>';
  openSheet(h+biblioHTML(sid));
}
function linksHTML(b){ return '<ul class="list links">'+b.map(x=>'<li><a href="'+esc(x.u)+'" target="_blank" rel="noopener">'+esc(x.t)+'<span aria-hidden="true"> ↗</span></a></li>').join('')+'</ul>'; }
function biblioHTML(sid){ const b=BIBLIO[sid]; if(!b||!b.length) return ''; return '<h3 style="margin-top:16px">Fontes oficiais</h3>'+linksHTML(b); }
function sheetBiblio(){
  let h='<h2 id="sheetTitle">Biblioteca oficial</h2><p class="small muted">Leis, normas e manuais oficiais das matérias do edital. Os links abrem numa aba nova.</p><h3 style="margin-top:16px">Edital e concurso</h3>'+linksHTML(BIBLIO.edital);
  SUBJECTS.forEach(s=>{ if(BIBLIO[s.id]&&BIBLIO[s.id].length) h+='<h3 style="margin-top:18px">'+esc(s.nome)+'</h3>'+linksHTML(BIBLIO[s.id]); });
  openSheet(h+'<p class="note small">A bibliografia exata de cada matéria sai no anexo do edital. Quando o próximo for publicado, confira se estes materiais batem com o que ele pede.</p>');
}
function topicSelect(id,sel){ return '<select id="'+id+'">'+SUBJECTS.map(s=>'<optgroup label="'+esc(s.nome)+'">'+(S.topicList[s.id]||[]).map(t=>'<option value="'+esc(t.id)+'"'+(t.id===sel?' selected':'')+'>'+esc(t.nome)+'</option>').join('')+'</optgroup>').join('')+'</select>'; }

/* ---------- Folha do tópico: tudo sobre ele num lugar só ---------- */
function sheetTopic(tid,focus){
  const info=topicInfo(tid); if(!info) return;
  UI.topicOpen=tid;
  const st=T(tid), tm=topicMastery(tid), note=S.notes[tid], cards=(S.flashcards[tid]||[]).length, games=GAMES.filter(g=>g.t===tid), bank=(S.qbank[tid]||[]).length;
  const lv=['Fácil','Médio','Difícil'].map((n,i)=>'<li class="'+(i<st.rung?'on':(i===st.rung?'cur':''))+'">'+n+(i<st.rung?' (vencido)':(i===st.rung?' (atual)':''))+'</li>').join('');
  let h='<h2 id="sheetTitle">'+esc(info.t.nome)+'</h2><p class="muted">'+esc(info.s.nome)+' · '+info.s.q+' questões na prova</p>';
  h+='<div class="topichead"><div class="bigladder">'+ladder(st.rung,true)+'<ol>'+lv+'</ol></div><div class="tm-ring">'+ringSVG(tm,mCls(tm))+'<span class="rg-c"><b>'+Math.round(tm*100)+'%</b><em>domínio</em></span></div></div>';
  h+='<p class="small">'+(st.rung>=3?'Dominado. Treine de vez em quando para não enferrujar.':(st.tf?'Neste degrau: '+st.a+' de '+st.f+' ('+pct(st.a,st.f)+'). Total: '+st.tf+' questões, '+pct(st.ta,st.tf)+' de acerto. Sobe com 80% em pelo menos 10.':'Ainda sem questões aqui. Comece por 10 do nível fácil.'))+'</p>';
  if(st.flag==='teoria') h+='<p class="badbox small">Acerto abaixo de 50%. Antes de mais questões, leia o resumo abaixo ou peça a aula do zero.</p>';
  h+='<div class="actgrid">';
  h+='<button class="act" data-a="gerarDe" data-t="'+tid+'">'+ICO.spark+'<b>5 questões IA</b><span>nível '+RUNGS[Math.min(st.rung,2)]+'</span></button>';
  if(cards) h+='<button class="act" data-a="flashOpen" data-t="'+tid+'">'+ICO.cards+'<b>Flashcards</b><span>'+cards+' cartões</span></button>';
  if(TESTE80[tid]){ const r=S.t80[tid]; h+='<button class="act" data-a="t80Open" data-t="'+tid+'">'+ICO.medal+'<b>Teste 80/20</b><span>'+(r&&r.passed?'selo conquistado':'5 clássicas')+'</span></button>'; }
  games.slice(0,2).forEach(g=>{ h+='<button class="act" data-a="gOpen" data-id="'+g.id+'">'+ICO.game+'<b>'+esc(g.title)+'</b><span>jogo</span></button>'; });
  h+='<button class="act" data-a="log" data-t="'+tid+'">'+ICO.plus+'<b>Registrar</b><span>questões feitas fora</span></button>';
  if(bank>=3) h+='<button class="act" data-a="quizBank" data-t="'+tid+'">'+ICO.redo+'<b>Refazer salvas</b><span>'+bank+' questões</span></button>';
  h+='<button class="act" data-a="aiOpenTopic" data-t="'+tid+'">'+ICO.chat+'<b>Perguntar</b><span>ao Instrutor</span></button>';
  h+='</div>';
  if(CONTENT[tid]) h+='<details class="content-d" open><summary>Resumo essencial</summary><div class="content-body">'+fmtText(CONTENT[tid])+'</div></details>';
  h+='<details class="content-d"'+(note||focus==='aula'?' open':'')+'><summary>'+ICO.spark+' Aula do zero com IA'+(note?' · salva':'')+'</summary><div class="aibox" id="ai-aula-'+tid+'">'+(AIR['aula-'+tid]?aiBox('aula-'+tid):(note?fmtText(note.t):'<span class="muted small">Uma aula guiada: o que é, o mínimo que cai, exemplo resolvido, pegadinhas e teste rápido.</span>'))+'</div><div class="row" style="margin-top:8px"><button class="btn sm" data-a="aula" data-t="'+tid+'">'+(note?'Gerar de novo':'Gerar aula')+'</button></div></details>';
  h+=biblioHTML(info.s.id);
  h+='<details class="content-d"><summary>Ajustes do tópico</summary><p class="small muted">Já domina o fácil? Ajuste o degrau direto.</p><div class="chips">'+RUNGS.map((r,i)=>'<button class="chip" data-a="setRung" data-t="'+tid+'" data-v="'+i+'" aria-pressed="'+(st.rung===i)+'">'+r+'</button>').join('')+'</div><label class="f" for="rnT">Nome do tópico</label><input id="rnT" value="'+esc(info.t.nome)+'"><div class="row" style="margin-top:10px"><button class="btn sm" data-a="rename" data-t="'+tid+'">Salvar nome</button><button class="btn ghost sm" data-a="addErro" data-t="'+tid+'">Anotar erro</button><button class="btn ghost sm" data-a="delTopic" data-t="'+tid+'">Remover tópico</button></div></details>';
  openSheet(h,{key:'topic:'+tid,keep:true});
  if(focus==='aula'&&!note) A.aula({dataset:{t:tid}});
}
function sheetLog(tid){
  tid=tid||pick()||'port-int';
  const logInfo=t=>{ const st=T(t); return st.rung>=3?'Tópico dominado. O registro conta no total.':'Degrau atual: <strong>'+RUNGS[st.rung]+'</strong>. Neste degrau: '+st.a+' de '+st.f+'. Sobe com 80% em pelo menos 10 questões.'; };
  openSheet('<h2 id="sheetTitle">Registrar questões</h2><p class="small muted">Fez questões no livro ou em outra plataforma? Registre aqui para a escada e o Painel acompanharem. Fácil primeiro, sempre.</p><label class="f" for="lgT">Tópico</label>'+topicSelect('lgT',tid)+'<p class="small" id="lgInfo" style="margin-top:8px">'+logInfo(tid)+'</p><div class="grid2"><div><label class="f" for="lgF">Feitas</label><input id="lgF" type="number" inputmode="numeric" min="1" max="300" value="10"></div><div><label class="f" for="lgA">Acertos</label><input id="lgA" type="number" inputmode="numeric" min="0" max="300" placeholder="0"></div></div><div class="row" style="margin-top:16px"><button class="btn primary block" data-a="saveLog">Salvar</button></div>');
  sheetLog.info=logInfo;
}
function sheetErroForm(tid){
  tid=tid||pick()||'port-int';
  openSheet('<h2 id="sheetTitle">Anotar erro</h2><label class="f" for="erT">Tópico</label>'+topicSelect('erT',tid)+'<label class="f" for="erE">O que eu fiz errado</label><textarea id="erE" rows="3" placeholder="Ex.: confundi CVCB com CLCB"></textarea><label class="f" for="erR">A regra certa, em uma frase</label><textarea id="erR" rows="3" placeholder="Escreva com as suas palavras"></textarea><p class="flabel">Tipo de erro</p><div class="chips" id="erTipo">'+TIPOS_ERRO.map((t,i)=>'<button class="chip" data-a="tipo" data-v="'+t+'" aria-pressed="'+(i===0)+'">'+t+'</button>').join('')+'</div><div class="row" style="margin-top:16px"><button class="btn primary block" data-a="saveErro">Salvar erro</button></div>');
}
function sheetCopy(title,text){ openSheet('<h2 id="sheetTitle">'+esc(title)+'</h2><p class="small muted">Copie e cole no chat do Claude.</p><textarea id="cpTxt" rows="10" readonly>'+esc(text)+'</textarea><div class="row" style="margin-top:12px"><button class="btn primary block" data-a="copy">Copiar</button></div>'); }
async function copyText(t){
  try{ await navigator.clipboard.writeText(t); toast('Copiado.'); return; }catch(e){}
  const ta=$('#cpTxt'); if(ta){ ta.focus(); ta.select(); try{ document.execCommand('copy'); toast('Copiado.'); }catch(e){ toast('Selecione o texto e copie manualmente.'); } }
}
function sheetSettings(){
  const c=S.cfg;
  let h='<h2 id="sheetTitle">Configurações</h2>';
  h+='<label class="f" for="cfName">Seu nome (o Instrutor usa para falar com você)</label><input id="cfName" value="'+esc(c.name||'')+'" placeholder="Como quer ser chamado">';
  h+='<label class="f" for="cfExam">Data da prova</label><input id="cfExam" type="date" value="'+esc(c.exam||'')+'"><p class="small muted">Com a data, o Hoje mostra a contagem regressiva e a IA ajusta o plano à reta final.</p>';
  h+='<p class="flabel">Meta diária de XP</p><div class="seg wide" role="group">'+GOALS.map(([v,l])=>'<button class="'+((c.goal||200)===v?'on':'')+'" data-a="cfGoal" data-v="'+v+'">'+l+'<small>'+v+'</small></button>').join('')+'</div><p class="small muted">Uma meta que você bate quase todo dia vale mais do que uma meta heroica que você abandona.</p>';
  h+='<p class="flabel">Som</p><div class="seg wide" role="group">'+[[0,'Desligado'],[0.4,'Baixo'],[0.8,'Normal'],[1,'Alto']].map(([v,l])=>'<button class="'+(Math.abs(SET.vol-v)<0.05?'on':'')+'" data-a="cfVol" data-v="'+v+'">'+l+'</button>').join('')+'</div>';
  h+='<p class="flabel">Vibração no celular</p><div class="seg wide" role="group"><button class="'+(SET.haptic?'on':'')+'" data-a="cfHaptic" data-v="1">Ligada</button><button class="'+(!SET.haptic?'on':'')+'" data-a="cfHaptic" data-v="0">Desligada</button></div>';
  h+='<div class="row" style="margin-top:18px"><button class="btn primary block" data-a="saveSettings">Salvar</button></div>';
  h+='<h3 style="margin-top:26px">Recomeçar</h3><p class="small muted">Apaga escadas, domínio, erros, redações, flashcards, XP e sequência. O Desfazer, no topo, ainda consegue voltar logo depois.</p><button class="btn ghost danger" data-a="resetAll">Apagar tudo e recomeçar</button>';
  openSheet(h,{key:'settings',keep:true});
}
function sheetBackup(){
  openSheet('<h2 id="sheetTitle">Backup dos seus dados</h2><p class="small muted">'+(SYNC.mode==='local'?'Seus dados estão só neste aparelho. Guarde um backup de vez em quando.':'Seus dados já ficam na sua conta. O backup é uma cópia extra, para guardar onde quiser.')+'</p><div class="stack"><button class="btn primary block" data-a="backupFile">Baixar arquivo de backup (.json)</button><button class="btn block" data-a="backupCopy">Copiar como texto</button></div>');
}
function sheetRestore(){ openSheet('<h2 id="sheetTitle">Restaurar backup</h2><p class="small muted">Escolha o arquivo .json do backup ou cole o texto. Isso substitui os dados atuais (o Desfazer volta logo depois, se precisar).</p><label class="btn ghost filebtn">'+ICO.plus+'<span>Escolher arquivo</span><input type="file" id="rsFile" accept=".json,application/json,text/plain" hidden></label><label class="f" for="rsX">Ou cole o texto</label><textarea id="rsX" rows="7"></textarea><div class="row" style="margin-top:12px"><button class="btn primary block" data-a="doRestore">Restaurar</button></div>'); }
function sheetWelcome(){
  const isNew=!S.welcomed;
  let h='<h2 id="sheetTitle">'+(isNew?'Seu plano de Cadete':'Novidades no seu plano')+'</h2>';
  if(!isNew) h+='<p>O app ganhou uma reforma grande. O que muda para você:</p><ul class="wlist"><li><b>Missões do dia e meta de XP:</b> quatro tarefas curtas, escolhidas pelo que mais rende agora. '+(levelFromXP(xpTotal()).L>1?'Seu histórico virou XP: você já começa no nível '+levelFromXP(xpTotal()).L+'.':'Seu histórico virou XP, e tudo o que você fizer daqui para frente soma.')+'</li><li><b>Instrutor com IA em toda tela:</b> o botão flutuante pergunta ao Claude sobre a questão que está na sua frente. Dá até para mandar foto.</li><li><b>Relâmpago e Chefão:</b> modos novos de jogo em todas as matérias.</li><li><b>Resumos e flashcards novos</b> em todos os tópicos de Direito, Bombeiro, Inglês e Geografia.</li><li><b>Geração de questões consertada</b>, com progresso na tela e banco salvo para simulados.</li><li><b>Sincronização segura:</b> abrir o app em outro aparelho não apaga mais nada.</li></ul>';
  else h+='<p>Quatro lugares, tudo ligado:</p><ul class="wlist"><li><b>Hoje:</b> suas missões do dia, a meta de XP e o próximo passo. É só seguir.</li><li><b>Treino:</b> jogos por matéria, Relâmpago, Chefão, flashcards com repetição espaçada, simulados e o Claude como tutor.</li><li><b>Erros:</b> o que você errar volta no dia certo, como questão, até virar acerto fácil.</li><li><b>Painel:</b> seu domínio em cada matéria, a patente e a projeção de acertos.</li></ul>';
  h+='<label class="f" for="wName">Como quer ser chamado?</label><input id="wName" value="'+esc(S.cfg.name||'')+'" placeholder="Seu nome"><label class="f" for="wExam">Data da prova (se já souber)</label><input id="wExam" type="date" value="'+esc(S.cfg.exam||'')+'">';
  h+='<div class="row" style="margin-top:16px"><button class="btn primary block" data-a="welcomeOk">'+(isNew?'Começar':'Bora')+'</button></div>';
  openSheet(h);
}

/* ===================== CADERNO DE ERROS ===================== */
function rfStart(list,title){
  if(!list.length){ toast('Nada para refazer agora.'); return; }
  tutor.rf={list:list.map(e=>e.id),pos:0,pick:null,shown:false,res:{easy:0,hard:0,miss:0,cons:0},title:title||'Refazendo erros',ord:{},done:false};
  UI.tab='erros'; saveUI(); closeSheetSilently(); SND.start(); render(); window.scrollTo(0,0);
}
function viewRefazer(){
  const R=tutor.rf;
  if(R.done){ const r=R.res, n=R.list.length, got=r.easy+r.hard;
    return '<div class="ghead"><div><span class="small muted">Caderno de erros</span><h2>Revisão concluída</h2></div></div><div class="gend"><div class="gscore pop '+accCls(n?got/n:0)+'">'+got+'/'+n+'</div><p>'+[r.easy?r.easy+' de primeira':'',r.hard?r.hard+' com dúvida':'',r.miss?r.miss+(r.miss>1?' erradas':' errada')+' de novo':'nenhuma errada de novo'].filter(Boolean).join(', ')+'.</p>'+(r.cons?'<p><strong class="m4">'+r.cons+(r.cons>1?' erros consolidados':' erro consolidado')+'.</strong> Virou aprendizado de verdade.</p>':'')+'<p class="small muted">'+(r.miss?'Os que você errou voltam amanhã. Use o "Me explique" neles: é ali que o conceito fecha.':'Cada acerto aqui é um ponto que a banca não tira mais de você.')+'</p></div><button class="btn primary block" data-a="rfClose">Voltar ao caderno</button>'; }
  const e=S.erros.find(x=>x.id===R.list[R.pos]);
  if(!e){ R.pos++; if(R.pos>=R.list.length) R.done=true; return viewRefazer(); }
  const inf=topicInfo(e.t), sn=inf?inf.s.nome:'', txt=e.q||e.errei||'';
  let h='<div class="ghead"><button class="backbtn" data-a="rfClose" aria-label="Parar">'+ICO.x+'</button><div><span class="small muted">'+esc(sn)+(inf?': '+esc(inf.t.nome):'')+'</span><h2>'+esc(R.title)+'</h2></div></div>';
  h+='<div class="gbar"><span>'+(R.pos+1)+' / '+R.list.length+'</span><span class="small muted">'+((e.n||1)>1?'você já errou '+e.n+' vezes':'errou 1 vez')+(e.chute?' · foi chute':'')+'</span></div><div class="bar"><i style="width:'+Math.round(100*R.pos/R.list.length)+'%"></i></div>';
  if(e.opts&&e.right!=null){
    const ord=R.ord[e.id]||(R.ord[e.id]=shuffle(e.opts.map((_,i)=>i))), opts=ord.map(i=>e.opts[i]), right=ord.indexOf(e.right);
    h+='<div class="qcard"><div class="qtext">'+fmtText(txt)+'</div></div>'+optionsHTML({opts,right},R.pick,'rfPick');
    if(R.pick!=null){ const ok=R.pick===right;
      h+='<div class="gfb '+(ok?'ok':'bad')+'"><b>'+(ok?CHECK_SVG+'Agora foi.':'Ainda não. Correta: '+esc(opts[right]))+'</b>'+(e.x?'<p>'+fmtText(e.x)+'</p>':'')+(e.steps&&e.steps.length?'<ol class="steps">'+e.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>':'')+'</div>';
      h+=exBtn({subj:sn,q:txt,opts,right,pick:R.pick,x:e.x,steps:e.steps});
      h+='<p class="small muted" style="margin:16px 0 0">Como foi?</p><div class="rfgrades">'+(ok?'<button class="btn go" data-a="rfGrade" data-g="2">Acertei fácil</button><button class="btn" data-a="rfGrade" data-g="1">Acertei com dúvida</button>':'<button class="btn primary" data-a="rfGrade" data-g="0">Errei de novo</button><button class="btn" data-a="rfGrade" data-g="0" data-f="1">Esqueci o conceito</button>')+'</div>';
    }
  } else {
    h+='<div class="qcard"><span class="small muted">O que você errou:</span><div class="qtext">'+fmtText(txt)+'</div></div>';
    if(!R.shown) h+='<p class="small muted" style="margin-top:10px">Tente lembrar a regra certa antes de ver. Esse esforço é o que fixa.</p><button class="btn primary block" data-a="rfShow">Mostrar a resposta</button>';
    else h+='<div class="gfb ok"><b>Regra certa</b><p>'+fmtText(e.regra||'(sem regra anotada)')+'</p></div>'+exBtn({subj:sn,q:txt,x:e.regra})+'<div class="rfgrades" style="margin-top:14px"><button class="btn go" data-a="rfGrade" data-g="2">Lembrei fácil</button><button class="btn" data-a="rfGrade" data-g="1">Lembrei com dúvida</button><button class="btn primary span2" data-a="rfGrade" data-g="0">Esqueci</button></div>';
  }
  return h;
}
function errItemHTML(e){
  const inf=topicInfo(e.t), txt=e.q||e.errei||'', ans=(e.opts&&e.right!=null)?e.opts[e.right]:(e.regra||'');
  return '<div class="erritem"><div class="small muted">'+esc(inf?inf.s.nome+': '+inf.t.nome:'')+' · '+(e.done?'consolidado':'volta '+fmtDay(e.prox))+((e.n||1)>1?' · errou '+e.n+' vezes':'')+(e.chute?' · chute':'')+'</div><div class="ei-q">'+fmtText(txt.length>600?txt.slice(0,600)+'…':txt)+'</div>'+(ans?'<div class="small" style="margin-top:4px"><b class="m4">'+(e.opts?'Correta:':'Regra:')+'</b> '+esc(ans)+'</div>':'')+'<div class="ei-acts">'+(e.done?'':'<button class="linkbtn small" data-a="rfOne" data-id="'+e.id+'">Refazer agora</button>')+'<button class="linkbtn small" data-a="exErr" data-id="'+e.id+'">Me explique</button><button class="linkbtn small" data-a="delErro" data-id="'+e.id+'">Apagar</button></div></div>';
}
function tileHTML(ic,label,val,sub,act){ const tag=act?'button':'div'; return '<'+tag+' class="tile"'+(act?' data-a="'+act+'"':'')+'><span class="ti-ic">'+ic+'</span><span class="ti-l">'+esc(label)+'</span><b class="ti-v">'+val+'</b><span class="ti-w">'+esc(sub)+'</span></'+tag+'>'; }
function viewErros(){
  let h=pageHead('Caderno de erros');
  if(tutor.rf) return h+viewRefazer();
  const act=S.erros.filter(e=>!e.done), due=rfDue(), cons=S.erros.length-act.length, T7=statsRange(7);
  h+='<p class="lede">Toda questão que você erra entra aqui sozinha e volta no dia certo, como questão de novo, até virar acerto fácil. É nos erros que a nota sobe.</p>';
  if(due.length) h+='<button class="errcta" data-a="rfStart"><span class="ec-n">'+due.length+'</span><span class="ec-t"><b>'+(due.length===1?'erro para refazer hoje':'erros para refazer hoje')+'</b><span>Refazer agora, como questão · +10 XP cada acerto</span></span><span class="ec-go">'+ICO.arrow+'</span></button>';
  else h+='<div class="errok">'+CHECK_SVG+'<span>'+(act.length?'Nada vencendo hoje. Os próximos voltam nos dias marcados.':'Nenhum erro ativo. Quando você errar uma questão, ela aparece aqui.')+'</span></div>';
  h+='<div class="metrics">'+tileHTML(ICO.redo,'Para refazer hoje',cuN(due.length),'ativos: '+act.length,due.length?'rfStart':'')+tileHTML(ICO.check,'Consolidados',cuN(cons),'viraram acerto fácil','')+tileHTML(ICO.target,'Refeitos em 7 dias',cuN(T7.rf),T7.rf?pct(T7.rfok,T7.rf)+' de acerto':'ainda nenhum','')+tileHTML(ICO.flag,'Reincidentes',cuN(act.filter(e=>(e.n||1)>=2).length),'errados 2 vezes ou mais','')+'</div>';
  h+='<div class="row" style="margin-top:12px">'+(act.length?'<button class="btn" data-a="rfAll">Refazer todos os ativos ('+act.length+')</button>':'')+'<button class="btn ghost" data-a="addErro">Anotar erro</button></div>';
  const bys={}; act.forEach(e=>{ const inf=topicInfo(e.t); if(inf) (bys[inf.s.id]=bys[inf.s.id]||[]).push(e); });
  const sids=Object.keys(bys).sort((a,b)=>bys[b].length-bys[a].length);
  if(sids.length) h+='<h2>Onde você mais erra</h2><ul class="list">'+sids.map(sid=>'<li class="subjerr"><span class="nm"><i class="mdot" style="background:var(--'+mCls(subjMastery(sid))+')"></i>'+esc(SUBJ[sid].nome)+'</span><span class="small muted">'+bys[sid].length+(bys[sid].length===1?' erro':' erros')+'</span><button class="btn sm" data-a="rfSubj" data-s="'+sid+'">Refazer</button></li>').join('')+'</ul>';
  const rep=act.filter(e=>(e.n||1)>=2).sort((a,b)=>b.n-a.n).slice(0,5);
  if(rep.length) h+='<h2>Reincidentes</h2><p class="small muted">Questões que você já errou mais de uma vez. São as que mais pedem um "Me explique".</p>'+rep.map(errItemHTML).join('');
  const timed=S.erros.filter(e=>e.tempo>0);
  if(timed.length>=3){ const fast=timed.filter(e=>e.tempo<T_FAST).length, slow=timed.filter(e=>e.tempo>=T_SLOW).length;
    if(fast>slow&&fast>=2) h+='<p class="note small">A maioria dos seus erros cronometrados foi rápida: costuma ser desatenção ou chute. Releia o enunciado antes de marcar.</p>';
    else if(slow>fast&&slow>=2) h+='<p class="note small">A maioria dos seus erros cronometrados foi lenta: você pensou e errou. Sinal de lacuna de conteúdo nesses tópicos.</p>'; }
  const shown=UI.errAll?S.erros.slice().reverse():S.erros.slice().reverse().slice(0,30);
  h+='<details class="subj" style="margin-top:22px"'+(UI.errAll?' open':'')+'><summary><span class="sn">Todos os erros</span><span class="sq">'+act.length+' ativos · '+cons+' consolidados</span></summary><div class="inner">'+(S.erros.length?shown.map(errItemHTML).join('')+(S.erros.length>shown.length?'<button class="btn ghost block" data-a="errAll">Mostrar todos ('+S.erros.length+')</button>':''):'<p class="muted">Nenhum ainda.</p>')+'</div></details>';
  return h;
}

/* ===================== REDAÇÃO ===================== */
function countTxt(t){ const w=t.trim()?t.trim().split(/\s+/).length:0; const l=Math.round(w/10); return w+' palavras, cerca de '+l+' linhas manuscritas (estimativa). A prova aceita de 15 a 30.'; }
function viewRedacao(){
  const R=S.redacoes;
  let h=pageHead('Redação','Duas redações de 20 pontos cada. Abaixo de 10 em qualquer uma, você está fora. Somadas, valem 40 dos 110 pontos que classificam para as próximas etapas.');
  h+='<section class="temacard"><span class="small muted">Tema da vez</span><b>'+esc(UI.tema||'Sorteie um tema para começar.')+'</b><div class="row"><button class="btn sm" data-a="sortear">Sortear outro</button>'+(UI.tema?'<button class="btn sm" data-a="planoRed">'+ICO.spark+' Plano com IA</button>':'')+'</div><div class="aibox" id="ai-plano"'+(AIR.plano?'':' hidden')+'>'+aiBox('plano')+'</div></section>';
  h+='<div class="row" style="margin:16px 0"><button class="btn primary" data-a="corrigir">'+ICO.pen+' Escrever e corrigir</button><button class="btn" data-a="notaManual">Registrar nota</button></div>';
  if(UI.rcDraft&&UI.rcDraft.x) h+='<p class="note small">Você tem um rascunho salvo ('+countTxt(UI.rcDraft.x).split(',')[0]+'). Toque em "Escrever e corrigir" para continuar.</p>';
  if(R.length){
    const last=R.slice(-8);
    h+='<h2>Suas notas</h2><div class="bars"><div class="min"><span>mínimo 10</span></div>'+last.map(r=>{ const t=r.n.reduce((a,b)=>a+b,0); return '<div class="col'+(t<10?' low':'')+'"><b>'+t+'</b><i style="height:'+Math.max(2,t/20*100)+'%"></i></div>'; }).join('')+'</div>';
    const k=Math.min(5,R.length), av=[0,1,2,3].map(i=>R.slice(-5).reduce((a,r)=>a+r.n[i],0)/k), wi=(Math.max(...av)-Math.min(...av)>=0.5)?av.indexOf(Math.min(...av)):-1;
    h+='<p class="small muted">Média por critério nas últimas '+k+':</p><div class="crit">'+CRIT.map((c,i)=>'<span'+(i===wi?' class="w"':'')+'>'+c+(i===wi?' (ponto fraco)':'')+'</span><span>'+av[i].toFixed(1)+' / 5</span>').join('')+'</div>';
  } else h+='<p class="muted" style="margin-top:18px">Nenhuma redação registrada ainda. A meta é uma por semana: sábado é dia de redação nas missões.</p>';
  h+='<h2>Regras que zeram a nota</h2><p class="small">Fugir do tema, letra ilegível, texto a lápis, qualquer identificação no texto (nome, sinais, desenhos) e desestruturação acentuada. Fora das 15 a 30 linhas, o texto perde pontos.</p>';
  return h;
}
function drawCorrigir(){
  const r=tutor.rdResult, dr=UI.rcDraft||{};
  let h='<h2 id="sheetTitle">Escrever e corrigir</h2><p class="small muted">Digite ou cole a redação. O rascunho fica salvo sozinho. A correção segue os 4 critérios do edital, de 0 a 5 cada.</p><label class="f" for="rcT">Tema</label><input id="rcT" value="'+esc(dr.t!=null?dr.t:(UI.tema||''))+'"><label class="f" for="rcX">Texto</label><textarea id="rcX" rows="12" placeholder="Sua redação">'+esc(dr.x||'')+'</textarea><p class="small muted" id="rcCount">'+countTxt(dr.x||'')+'</p>';
  if(tutor.rdErr) h+='<p class="badbox">'+esc(tutor.rdErr)+'</p>';
  if(r){
    const tot=r.n.reduce((a,b)=>a+b,0);
    h+='<div class="'+(tot>=10?'okbox':'badbox')+'"><strong>'+tot+' de 20.</strong> '+(tot>=10?'Acima do mínimo.':'Abaixo do mínimo de 10. Na prova, eliminaria.')+'</div><div class="crit">'+CRIT.map((c,i)=>'<span><strong>'+c+'</strong><br><span class="small">'+esc(r.c[i]||'')+'</span></span><span>'+r.n[i]+'</span>').join('')+'</div>';
    if(r.cor.length) h+='<p class="flabel">Correções</p><ul class="small">'+r.cor.map(c=>'<li>'+esc(c)+'</li>').join('')+'</ul>';
    if(r.p) h+='<p class="note"><strong>Foco da próxima:</strong> '+esc(r.p)+'</p>';
    if(r.rw) h+='<details class="content-d"><summary>Parágrafo mais fraco, reescrito</summary><div class="content-body">'+fmtText(r.rw)+'</div></details>';
    h+='<button class="btn go block" data-a="saveCorr">Salvar esta nota</button>';
  } else h+='<button class="btn primary block" data-a="runCorrigir"'+(tutor.rdBusy?' disabled':'')+'>'+(tutor.rdBusy?'<span class="dots"><i></i><i></i><i></i></span> Corrigindo, pode levar um minuto':'Corrigir com o Claude')+'</button>';
  openSheet(h,{key:'corrigir',keep:true});
}
