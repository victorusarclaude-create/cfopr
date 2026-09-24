
/* ===================== ESTADO DO TREINO ===================== */
const tutor={quiz:null,quizGen:null,sim:null,simGen:null,t80:null,game:null,spot:null,ptab:null,map:null,tl:null,match:null,rel:null,flash:null,rf:null,aic:null};
const MODES=['quiz','quizGen','sim','simGen','t80','game','spot','ptab','map','tl','match','rel','flash'];
function clearModes(){ MODES.forEach(k=>{ const v=tutor[k]; if(v&&v.ctl) try{ v.ctl.abort(); }catch(e){} tutor[k]=null; }); }
function goTreino(){ closeSheetSilently(); UI.tab='tutor'; saveUI(); render(); window.scrollTo(0,0); }
function activeMode(){ return MODES.find(k=>tutor[k])||null; }
function inRun(){
  const G=tutor.game, F=tutor.flash, M=tutor.sim, Q=tutor.quiz, R=tutor.rf, T8=tutor.t80;
  return !!((G&&!G.done)||(F&&F.pos<F.q.length)||(M&&!M.done)||(Q&&Q.ans.some(a=>a==null))||(R&&!R.done)||(T8&&!T8.done)||tutor.quizGen||tutor.simGen||
    (tutor.spot&&!tutor.spot.done)||(tutor.ptab&&!tutor.ptab.done)||(tutor.tl&&!tutor.tl.done)||(tutor.map&&tutor.map.pos<tutor.map.order.length)||(tutor.match&&!tutor.match.done)||(tutor.rel&&!tutor.rel.over));
}

/* ===================== CATÁLOGO DE JOGOS ===================== */
function histTag(txt){ txt=(txt||'').toLowerCase();
  if(/1853|provínc|zacarias|emancip|comarca|são paulo|dia do paraná|separou|cbmpr/.test(txt)) return 'hist-emanc';
  if(/ouro|tropei|erva|café|geada|campos gerais|ciclo|madeira|charque/.test(txt)) return 'hist-ciclos';
  return 'hist-ocup'; }
const SPOT_BY_ID=Object.fromEntries(SPOT_GAMES.map(g=>[g.id,g]));
GAMES.splice(GAMES.findIndex(g=>g.id==='hs-cloze'),1,{id:'hs-cloze',s:'hist',t:'hist-ocup',type:'choice',title:'Complete a frase',desc:'Fatos da história do Paraná no contexto que explica cada um.',items:CLOZE_HIST.map(it=>[it.t.replace('___','_____'),it.o,it.r,'',histTag(it.t)])});
GAMES.splice(GAMES.findIndex(g=>g.id==='hs-vf'),1,{id:'hs-vf',s:'hist',t:'hist-emanc',type:'tf',title:'Verdadeiro ou falso',desc:'Frases rápidas que confundem na prova.',items:VF_HIST.map(it=>[it.s,it.v,'',histTag(it.s)])});
GAMES.push(
 {id:'pt-spot1',s:'port',t:'port-conc',type:'legacy',launch:'spotOpen',title:SPOT_BY_ID['pt-spot1'].title,desc:SPOT_BY_ID['pt-spot1'].desc},
 {id:'pt-spot2',s:'port',t:'port-reg',type:'legacy',launch:'spotOpen',title:SPOT_BY_ID['pt-spot2'].title,desc:SPOT_BY_ID['pt-spot2'].desc},
 {id:'qm-ptable',s:'qui',t:'qui-atom',type:'legacy',launch:'ptOpen',title:'Tabela periódica: ache o elemento',desc:'Toque na posição certa da tabela a partir da dica.'},
 ...BUILD_GAMES);
const GAME_BY_ID=Object.fromEntries(GAMES.map(g=>[g.id,g]));
const PLAYABLE=g=>['classify','choice','pick','tf','calc'].includes(g.type);
const one2=a=>a[Math.floor(Math.random()*a.length)];

let gSeq=0;
function gItemsIdx(def,n){ const st=S.gm[def.id]||{}; const idx=shuffle(def.items.map((_,i)=>i)); idx.sort((a,b)=>(st[b]||0)-(st[a]||0)); return idx.slice(0,n); }
function gmScore(id,i,ok){ const m=S.gm[id]||(S.gm[id]={}); m[i]=clamp((m[i]||0)+(ok?-1:2),-3,6); }
function buildRound(def,i){
  const it=def.items[i];
  if(def.type==='classify') return {i,q:it[0],opts:def.cats.slice(),right:it[1],x:it[2]||'',t:it[3]||def.t};
  if(def.type==='choice'){ const ord=shuffle(it[1].map((_,k)=>k)); return {i,q:it[0],opts:ord.map(k=>it[1][k]),right:ord.indexOf(it[2]),x:it[3]||'',t:it[4]||def.t}; }
  if(def.type==='tf') return {i,q:it[0],opts:['Verdadeiro','Falso'],right:it[1]?0:1,x:it[2]||'',t:it[3]||def.t,tf:true};
  if(def.type==='pick'){ const pool=[...new Set(def.items.map(x=>x[1]).filter(a=>a!==it[1]))]; const opts=shuffle([it[1]].concat(shuffle(pool).slice(0,3))); return {i,q:it[0],opts,right:opts.indexOf(it[1]),x:it[2]||'',t:it[3]||def.t}; }
  if(def.type==='order') return {i,q:it[0],steps:it[1],shuf:shuffle(it[1].map((_,k)=>k)),x:it[2]||'',t:it[3]||def.t,ord:true};
}
function calcRound(def){ const g=GEN[one2(def.gens)](); return {q:g.q,opts:g.opts,right:g.right,steps:g.steps,t:g.t||def.t,x:''}; }
/* Uma questão rápida de qualquer matéria, a partir dos bancos do app (usada em simulado, Relâmpago e Chefão) */
function offlineQuestion(s){
  const gs=GAMES.filter(g=>g.s===s.id&&PLAYABLE(g)); if(!gs.length) return null;
  const def=one2(gs); const r=def.type==='calc'?calcRound(def):buildRound(def,one2(gItemsIdx(def,5)));
  let opts=r.opts, right=r.right;
  if(opts.length>5){ const sel=shuffle([right].concat(shuffle(opts.map((_,k)=>k).filter(k=>k!==right)).slice(0,3))); opts=sel.map(k=>r.opts[k]); right=sel.indexOf(r.right); }
  const q=def.type==='calc'?r.q:(def.type==='tf'?'**Verdadeiro ou falso?**\n'+r.q:'**'+def.title+'**\n'+r.q);
  return {q,opts,right,x:r.x||'',steps:r.steps,t:r.t,s:s.id,gid:def.id,i:r.i};
}
function recGame(){
  let best=null,bv=-1;
  SUBJECTS.forEach(s=>{ if(!GAMES.some(g=>g.s===s.id&&PLAYABLE(g))) return; const v=s.q*(1.05-subjMastery(s.id)); if(v>bv){ bv=v; best=s; } });
  if(!best) return null;
  const gs=GAMES.filter(g=>g.s===best.id&&PLAYABLE(g));
  gs.sort((a,b)=>(topicMastery(a.t)-topicMastery(b.t))||(((S.gb[a.id]||{}).plays||0)-((S.gb[b.id]||{}).plays||0)));
  return gs[0];
}

/* ===================== MOTOR DE JOGOS =====================
   Modos: normal (10 rodadas), desafio (3 vidas), relâmpago (60 s, avança sozinho)
   e chefão (a barra de vida do chefe cai a cada acerto; combos batem mais forte). */
function openGame(id,opts){
  opts=opts||{};
  const def=GAME_BY_ID[id]; if(!def) return;
  if(def.type==='legacy'){ clearModes(); A[def.launch]({dataset:{id:def.id}}); return; }
  let rounds=opts.rounds;
  if(!rounds){ if(def.type==='calc') rounds=Array.from({length:10},()=>calcRound(def)); else { const n=def.type==='order'?def.items.length:Math.min(10,def.items.length); rounds=gItemsIdx(def,n).map(i=>buildRound(def,i)); } }
  clearModes(); gSeq++;
  tutor.game={id,defId:id,sid:def.s,title:def.title,mode:opts.lives?'desafio':'normal',seq:gSeq,rounds,pos:0,pick:null,ok:0,tot:0,xp:0,combo:0,maxCombo:0,start:Date.now(),done:false,wrong:[],lives:opts.lives||null,m0:subjMastery(def.s),os:0,oe:0,ob:null,retry:!!opts.retry};
  SND.start(); goTreino();
}
function openSpecial(mode,sid){
  const s=sid==='all'?null:SUBJ[sid];
  const title=mode==='boss'?'Chefão: '+(s?s.nome:'Geral'):'Relâmpago: '+(s?s.nome:'todas as matérias');
  clearModes(); gSeq++;
  const G={id:mode+':'+sid,sid,title,mode,seq:gSeq,rounds:[],pos:0,pick:null,ok:0,tot:0,xp:0,combo:0,maxCombo:0,start:Date.now(),done:false,wrong:[],m0:s?subjMastery(sid):overall().m,os:0,oe:0};
  if(mode==='boss'){ G.lives=3; G.hp=100; G.hpMax=100; G.max=15; }
  if(mode==='relampago'){ G.end=Date.now()+60000; G.score=0; }
  tutor.game=G; pushSpecialRound(G);
  SND.start(); goTreino();
}
function pushSpecialRound(G){
  let q=null, guard=0;
  while(!q&&guard<20){ guard++; const s=G.sid==='all'?wpick(SUBJECTS.map(x=>({s:x,w:x.q}))).s:SUBJ[G.sid]; q=offlineQuestion(s); if(q&&G.rounds.slice(-6).some(r=>r.q===q.q)) q=null; }
  if(q) G.rounds.push(q);
}
function gAnswer(j){
  const G=tutor.game; if(!G||G.done||G.pick!=null) return;
  const r=G.rounds[G.pos]; if(!r||r.ord) return;
  const ok=j===r.right; G.pick=j; G.tot++; G.crit=false;
  const d=Dm(today());
  if(ok){
    G.ok++; G.combo++;
    let xp=G.mode==='relampago'?6+Math.min(G.combo,6):10+2*Math.min(G.combo-1,5);
    if(G.mode!=='relampago'&&Math.random()<0.08){ xp*=2; G.crit=true; SND.crit(); } else if(G.combo>=2) SND.combo(G.combo); else SND.ok();
    G.xp+=xp; gainXP(xp); buzz(12);
    G.fbw=one2(['Isso!','Certo!','Boa!','Mandou bem!','Exato!','Na mosca!']);
    if(G.mode==='boss'){ const dmg=12+3*Math.min(G.combo-1,4); G.hp=Math.max(0,G.hp-dmg); G.lastDmg=dmg; SND.hit(); }
    if(G.mode==='relampago'){ G.score+=1+Math.floor((G.combo-1)/3); }
  } else {
    G.combo=0; G.wrong.push(G.pos); SND.bad(); buzz([25,40,25]); gainXP(2); G.xp+=2;
    const def=GAME_BY_ID[G.defId]||GAME_BY_ID[r.gid];
    errFromQ({t:r.t,q:(def&&def.type!=='calc'&&!/^\*\*/.test(r.q)?def.title+'\n':'')+r.q,opts:r.opts,right:r.right,x:r.x,steps:r.steps,src:'game'});
    if(G.lives!=null){ G.lives--; if(G.lives<=0){ SND.gameOver(); G.over=true; } else SND.lifeLost(); }
  }
  G.maxCombo=Math.max(G.maxCombo,G.combo);
  addEv(r.t,'game',1,ok?1:0);
  const gid=G.defId||r.gid; if(r.i!=null&&gid&&GAME_BY_ID[gid]&&GAME_BY_ID[gid].items) gmScore(gid,r.i,ok);
  if(G.mode==='boss'&&G.hp<=0){ G.won=true; }
  commit();
  if(G.mode==='relampago'){ render(); const seq=G.seq; setTimeout(()=>{ const g=tutor.game; if(g&&g.seq===seq&&!g.done&&g.pick!=null) gNext(); },ok?380:1100); return; }
  if(G.over||G.won){ render(); setTimeout(()=>{ const g=tutor.game; if(g&&g.seq===G.seq&&!g.done) gFinish(g); },G.won?700:900); return; }
  render();
}
function gNext(){
  const G=tutor.game; if(!G) return;
  G.pos++; G.pick=null; G.os=0; G.oe=0; G.ob=null;
  if(G.mode==='relampago'||G.mode==='boss'){ if(G.mode==='boss'&&G.pos>=G.max){ gFinish(G); return; } if(G.pos>=G.rounds.length) pushSpecialRound(G); }
  if(G.pos>=G.rounds.length){ gFinish(G); return; }
  render(); window.scrollTo(0,0);
}
function gFinish(G){
  if(G.done) return;
  G.done=true; G.secs=Math.round((Date.now()-G.start)/1000);
  const d=Dm(today()); d.gcount=(d.gcount||0)+1;
  if(G.defId){ const gb=S.gb[G.defId]||(S.gb[G.defId]={best:0,plays:0}); gb.plays++; d.gp=d.gp||{}; d.gp[G.defId]=(d.gp[G.defId]||0)+1; G.first=gb.plays===1; G.isBest=!G.first&&G.xp>gb.best; if(G.xp>gb.best) gb.best=G.xp; }
  const sk=G.sid, rec=S.modes[sk]||(S.modes[sk]={wins:0,best:0,rel:0});
  if(G.mode==='relampago'){ G.isBest=G.score>(rec.rel||0); if(G.isBest) rec.rel=G.score; SND.timerEnd(); }
  else if(G.mode==='boss'){ if(G.won){ rec.wins=(rec.wins||0)+1; const bonus=80; gainXP(bonus); G.xp+=bonus; FX.celebrate('bossWin',{nome:G.title.replace('Chefão: ',''),hits:G.ok,lives:G.lives,xp:G.xp}); } }
  else if(G.wrong.length===0&&G.tot>0){ SND.flawless(); if(G.lives!=null){ gainXP(30); G.xp+=30; } }
  else SND.level();
  G.m1=G.sid&&SUBJ[G.sid]?subjMastery(G.sid):overall().m; snapWeek(); commit(); afterAction(); render(); window.scrollTo(0,0);
}
function optionsHTML(r,pick,act,extra){
  const many=r.opts.length>4&&r.opts.every(o=>String(o).length<22);
  return '<div class="'+(many?'optgrid':'optlist')+'">'+r.opts.map((o,j)=>{ let c='alt'; if(pick!=null){ if(j===r.right) c+=' right'; else if(j===pick) c+=' wrong'; } return '<button class="'+c+'" data-a="'+act+'" data-j="'+j+'"'+(extra||'')+(pick!=null?' disabled':'')+'><span class="k">'+(r.opts.length<=5&&!r.tf?'ABCDE'[j]:(j+1))+'</span><span class="ot">'+esc(o)+'</span></button>'; }).join('')+'</div>';
}
function viewGame(){
  const G=tutor.game;
  const sn=G.sid==='all'?'Todas as matérias':(SUBJ[G.sid]||{}).nome||'';
  let h='<div class="ghead"><button class="backbtn" data-a="gClose" aria-label="Sair do jogo">'+ICO.x+'</button><div><span class="small muted">'+esc(sn)+(G.mode==='desafio'?' · modo desafio':'')+'</span><h2>'+esc(G.title)+'</h2></div></div>';
  if(G.done) return h+viewGameEnd(G);
  const r=G.rounds[G.pos]; if(!r){ gFinish(G); return h; }
  if(G.mode==='relampago'){ const left=Math.max(0,Math.ceil((G.end-Date.now())/1000)); h+='<div class="relbar"><span class="relclock" id="relClock">'+left+'</span><span class="rel-sc">'+G.score+' pts</span><span class="combo'+(G.combo>=3?' hot':'')+'">'+(G.combo>=2?'x'+G.combo:'')+'</span></div><div class="bar time"><i id="relBar" style="width:'+Math.round(100*left/60)+'%"></i></div>'; }
  else if(G.mode==='boss'){ h+='<div class="boss'+(G.pick!=null&&G.pick===r.right?' hit':'')+(G.pick!=null&&G.pick!==r.right?' atk':'')+'"><span class="boss-ic">'+ICO.crown+'</span><div class="boss-b"><div class="boss-hp"><i style="width:'+Math.round(100*G.hp/G.hpMax)+'%"></i></div><span class="small">'+G.hp+'/'+G.hpMax+' de vida · rodada '+(G.pos+1)+' de '+G.max+'</span></div></div><div class="lives">'+[0,1,2].map(i=>'<span class="life'+(i<G.lives?' on':'')+'">'+ICO.heart+'</span>').join('')+'<span class="xp">'+G.xp+' XP</span></div>'; }
  else { h+='<div class="gbar"><span>'+(G.pos+1)+' / '+G.rounds.length+'</span><span class="xp">'+G.xp+' XP</span><span class="combo'+(G.combo>=3?' hot':'')+'">'+(G.combo>=2?flameMini()+' x'+G.combo:'')+'</span></div><div class="bar"><i style="width:'+Math.round(100*G.pos/G.rounds.length)+'%"></i></div>';
    if(G.lives!=null) h+='<div class="lives">'+[0,1,2].map(i=>'<span class="life'+(i<G.lives?' on':'')+'">'+ICO.heart+'</span>').join('')+'</div>'; }
  if(r.ord) return h+viewOrderRound(G,r);
  h+='<div class="qcard'+(G.pick!=null?(G.pick===r.right?' ok':' bad'):'')+'"><div class="qtext">'+fmtText(r.q)+'</div></div>';
  h+=optionsHTML(r,G.pick,'gPick');
  if(G.pick!=null&&G.mode!=='relampago'){
    const ok=G.pick===r.right;
    h+='<div class="gfb '+(ok?'ok':'bad')+'"><b>'+(ok?CHECK_SVG+esc(G.crit?'Acerto crítico! XP em dobro':G.fbw||'Certo!'):'Resposta: '+esc(r.opts[r.right]))+'</b>'+(r.x?'<p>'+fmtText(r.x)+'</p>':'')+(r.steps?'<ol class="steps">'+r.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>':'')+'</div>';
    if(!G.over&&!G.won){ h+=exBtn({subj:sn,q:r.q,opts:r.opts,right:r.right,pick:G.pick,x:r.x,steps:r.steps});
      h+='<button class="btn primary block nextbtn" data-a="gNext">'+((G.mode==='boss'?G.pos+1<G.max:G.pos+1<G.rounds.length)?'Próxima':'Ver resultado')+' <kbd>Enter</kbd></button>'; }
  }
  return h;
}
function viewOrderRound(G,r){
  let h='<p class="q-prompt">'+esc(r.q)+'</p><p class="small muted">Toque nos itens na ordem certa.</p>';
  if(G.os) h+='<ol class="tl-done">'+r.steps.slice(0,G.os).map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>';
  if(G.os<r.steps.length) h+='<div class="optlist">'+r.shuf.filter(k=>k>=G.os).map(k=>'<button class="alt'+(G.ob===k?' wrong':'')+'" data-a="gOrd" data-k="'+k+'"><span class="ot">'+esc(r.steps[k])+'</span></button>').join('')+'</div><p class="small muted" style="margin-top:8px">Erros nesta sequência: '+G.oe+'</p>';
  else h+='<div class="gfb '+(G.oe?'bad':'ok')+'"><b>'+(G.oe?'Completa, com '+G.oe+' erro(s).':CHECK_SVG+'Sequência perfeita!')+'</b>'+(r.x?'<p>'+esc(r.x)+'</p>':'')+'</div>'+exBtn({subj:(SUBJ[G.sid]||{}).nome,q:r.q+' (ordem correta: '+r.steps.join(' → ')+')',x:r.x})+'<button class="btn primary block nextbtn" data-a="gNext">'+(G.pos+1<G.rounds.length?'Próxima':'Ver resultado')+'</button>';
  return h;
}
function gOrder(k){
  const G=tutor.game; if(!G||G.done) return; const r=G.rounds[G.pos]; if(!r||!r.ord||G.os>=r.steps.length) return;
  if(k===G.os){ G.os++; G.ob=null; SND.ok();
    if(G.os===r.steps.length){ const n=r.steps.length, ok=Math.max(0,n-G.oe); G.tot+=n; G.ok+=ok;
      if(!G.oe){ G.combo++; const xp=8*n; G.xp+=xp; gainXP(xp); SND.flawless(); } else { G.combo=0; const xp=4*ok; G.xp+=xp; gainXP(xp); G.wrong.push(G.pos); }
      G.maxCombo=Math.max(G.maxCombo,G.combo); addEv(r.t,'game',n,ok); gmScore(G.defId,r.i,!G.oe); commit(); }
    render(); }
  else { G.oe++; G.ob=k; SND.bad(); buzz(30);
    if(G.lives!=null){ G.lives--; if(G.lives<=0){ SND.gameOver(); G.over=true; render(); setTimeout(()=>gFinish(G),800); return; } SND.lifeLost(); }
    render(); const seq=G.seq; setTimeout(()=>{ const g=tutor.game; if(g&&g.seq===seq&&g.ob===k){ g.ob=null; render(); } },600); }
}
function viewGameEnd(G){
  const p=G.tot?Math.round(100*G.ok/G.tot):0;
  let h='';
  if(G.mode==='relampago'){
    h+='<div class="gend"><div class="gscore pop">'+G.score+'<small> pts</small></div><p>'+G.ok+' acertos em '+G.tot+' respostas, '+G.xp+' XP.'+(G.isBest?' <b class="m4">Novo recorde!</b>':' Recorde: '+((S.modes[G.sid]||{}).rel||0)+' pts.')+'</p><p class="small muted">Maior combo: '+G.maxCombo+'. Acertos seguidos valem mais.</p></div>';
  } else if(G.mode==='boss'){
    h+='<div class="gend"><div class="gscore pop '+(G.won?'m4':'m0')+'">'+(G.won?'Vitória':'Derrota')+'</div><p>'+(G.won?'Você derrubou o chefão com '+G.ok+' acertos e '+G.lives+' vida(s) sobrando.':'O chefão ficou com '+G.hp+' de vida. Revise os erros abaixo e volte mais forte.')+'</p><p class="small muted">'+G.xp+' XP · maior combo: '+G.maxCombo+'</p></div>';
  } else if(G.over){
    h+='<div class="gend"><div class="gscore pop m0">Fim de jogo</div><p>Você chegou até a questão '+(G.pos+1)+' de '+G.rounds.length+', com '+G.xp+' XP.</p><p class="small muted">No modo desafio, 3 erros encerram a partida.</p></div>';
  } else {
    const gb=S.gb[G.defId]||{};
    h+='<div class="gend">'+(G.lives!=null?'<p class="challengeflag">Modo desafio superado</p>':'')+'<div class="gscore pop '+accCls(G.tot?G.ok/G.tot:0)+'">'+p+'%</div><p>'+G.ok+' de '+G.tot+' certos, '+G.xp+' XP'+(G.first?'. Primeira partida: esse é o recorde a bater.':(G.isBest?'. <b class="m4">Novo recorde!</b>':' (recorde: '+gb.best+' XP)'))+'</p><p class="small muted">Maior combo: '+G.maxCombo+'. Tempo: '+fmtSec(G.secs)+'.</p></div>';
  }
  h+='<div class="mdelta"><span>Domínio em '+esc(G.sid==='all'?'todas as matérias':(SUBJ[G.sid]||{}).nome)+'</span><b>'+Math.round(G.m0*100)+'% → '+Math.round(G.m1*100)+'%</b></div>';
  if(G.wrong.length) h+='<h3 style="margin-top:18px">Para revisar</h3><p class="small muted">Já foram para o caderno de erros e voltam amanhã.</p><ul class="list">'+G.wrong.map(i=>{ const r=G.rounds[i]; return '<li class="rev-li"><div>'+fmtText(r.q)+'</div><div class="small m4">'+esc(r.ord?r.steps.join(' → '):r.opts[r.right])+'</div></li>'; }).join('')+'</ul>';
  h+='<div class="stack" style="margin-top:14px">';
  if(G.mode==='relampago'||G.mode==='boss') h+='<button class="btn primary block" data-a="specialAgain">Jogar de novo</button>';
  else {
    if(G.wrong.length&&!G.retry) h+='<button class="btn primary block" data-a="gRetry">Refazer só os erros</button>';
    if(!G.wrong.length&&G.lives==null&&G.tot>0) h+='<button class="btn primary block" data-a="gHard">Modo desafio (3 vidas)</button>';
    if(G.wrong.length&&!G.cards) h+='<button class="btn block" data-a="gCards">Transformar erros em flashcards</button>';
    h+='<button class="btn block" data-a="gAgain">Jogar de novo</button>';
    if(G.sid&&SUBJ[G.sid]) h+='<button class="btn block" data-a="bossOpen" data-s="'+G.sid+'">'+ICO.crown+' Enfrentar o Chefão de '+esc(SUBJ[G.sid].nome)+'</button>';
  }
  return h+'<button class="btn ghost block" data-a="gClose">Voltar ao Treino</button></div>';
}
function errsToCards(list){ let n=0; list.forEach(x=>{ const D0=S.flashcards[x.t]||(S.flashcards[x.t]=[]); if(D0.some(c=>c.f===x.f)) return; D0.push(newCard(x.f,x.b,{custom:true})); n++; }); commit(); return n; }
function gamesCatalogHTML(){
  const rec=recGame(); let h='';
  if(rec) h+='<div class="recgame"><span class="small muted">Recomendado agora</span><strong>'+esc(rec.title)+'</strong><span class="small muted">'+esc(SUBJ[rec.s].nome)+': a matéria com mais peso na prova e menos domínio seu.</span><button class="btn primary" data-a="gOpen" data-id="'+rec.id+'">Jogar</button></div>';
  const tIdx=(sid,tid)=>{ const l=S.topicList[sid]||[]; const i=l.findIndex(t=>t.id===tid); return i<0?999:i; };
  SUBJECTS.forEach(s=>{ const gs=GAMES.filter(g=>g.s===s.id).sort((a,b)=>tIdx(s.id,a.t)-tIdx(s.id,b.t)); if(!gs.length) return; const m=subjMastery(s.id), cl=mCls(m), rec2=S.modes[s.id]||{};
    h+='<details class="subj"><summary><span class="sn"><i class="mdot" style="background:var(--'+cl+')"></i>'+esc(s.nome)+'</span><span class="sq '+cl+'">'+gs.length+(gs.length===1?' jogo':' jogos')+' · '+Math.round(m*100)+'%</span></summary><div class="inner">';
    h+='<div class="row modes"><button class="btn sm" data-a="relOpenS" data-s="'+s.id+'">'+ICO.bolt+' Relâmpago'+(rec2.rel?' · '+rec2.rel+' pts':'')+'</button><button class="btn sm" data-a="bossOpen" data-s="'+s.id+'">'+ICO.crown+' Chefão'+(rec2.wins?' · '+rec2.wins+'×':'')+'</button></div>';
    h+='<ul class="list">'+gs.map(g=>{ const gb=S.gb[g.id]; return '<li class="gamerow"><span><span class="nm">'+esc(g.title)+'</span><br><span class="small muted">'+esc(g.desc||'')+(gb&&gb.plays?' Recorde: '+gb.best+' XP.':'')+'</span></span><button class="btn sm" data-a="gOpen" data-id="'+g.id+'">Jogar</button></li>'; }).join('')+'</ul></div></details>'; });
  return h;
}
function sheetGames(){ openSheet('<h2 id="sheetTitle">Jogos por matéria</h2><p class="small muted">Dentro de cada matéria, os jogos seguem a ordem em que o conteúdo evolui. Relâmpago e Chefão misturam tudo da matéria.</p>'+gamesCatalogHTML()); }
function sheetModes(kind){
  const boss=kind==='boss';
  let h='<h2 id="sheetTitle">'+(boss?'Chefão da matéria':'Relâmpago')+'</h2><p class="small muted">'+(boss?'15 questões para derrubar a barra de vida do chefão. Acertos seguidos batem mais forte; 3 erros e você cai. Vencer dá +80 XP.':'60 segundos, uma questão atrás da outra. Acertos seguidos valem mais. Ótimo para aquecer.')+'</p><div class="modegrid">';
  if(!boss) h+='<button class="modecard" data-a="relOpenS" data-s="all"><b>Todas as matérias</b><span>no peso do edital</span></button>';
  SUBJECTS.forEach(s=>{ if(!GAMES.some(g=>g.s===s.id&&PLAYABLE(g))) return; const r=S.modes[s.id]||{}, m=subjMastery(s.id);
    h+='<button class="modecard" data-a="'+(boss?'bossOpen':'relOpenS')+'" data-s="'+s.id+'"><b>'+esc(s.nome)+'</b><span>'+(boss?(r.wins?r.wins+(r.wins===1?' vitória':' vitórias'):'não derrotado'):(r.rel?'recorde '+r.rel+' pts':'sem recorde'))+' · '+Math.round(m*100)+'%</span></button>'; });
  openSheet(h+'</div>');
}

/* ===================== CAÇA AO ERRO E TABELA PERIÓDICA ===================== */
function openSpot(id){ const def=SPOT_BY_ID[id]; if(!def) return; clearModes(); gSeq++;
  tutor.spot={id,seq:gSeq,items:shuffle(def.items.map((_,i)=>i)),pos:0,pick:null,ok:0,tot:0,xp:0,combo:0,maxCombo:0,start:Date.now(),done:false,wrong:[]}; SND.start(); goTreino(); }
function viewSpot(){
  const G=tutor.spot, def=SPOT_BY_ID[G.id], sn=SUBJ[def.s].nome;
  let h='<div class="ghead"><button class="backbtn" data-a="spotClose" aria-label="Sair">'+ICO.x+'</button><div><span class="small muted">'+esc(sn)+'</span><h2>'+esc(def.title)+'</h2></div></div>';
  if(G.done){ const p=G.tot?Math.round(100*G.ok/G.tot):0; return h+'<div class="gend"><div class="gscore pop '+accCls(G.tot?G.ok/G.tot:0)+'">'+p+'%</div><p>'+G.ok+' de '+G.tot+' certos, '+G.xp+' XP. Maior combo: '+G.maxCombo+'.</p></div><div class="stack"><button class="btn primary block" data-a="spotAgain">Jogar de novo</button><button class="btn ghost block" data-a="spotClose">Voltar</button></div>'; }
  const it=def.items[G.items[G.pos]];
  h+='<div class="gbar"><span>'+(G.pos+1)+' / '+G.items.length+'</span><span class="xp">'+G.xp+' XP</span><span class="combo'+(G.combo>=3?' hot':'')+'">'+(G.combo>=2?'x'+G.combo:'')+'</span></div><div class="bar"><i style="width:'+Math.round(100*G.pos/G.items.length)+'%"></i></div>';
  h+='<p class="small muted" style="margin-top:10px">Toque na palavra errada. Se estiver tudo certo, toque em "A frase está certa".</p>';
  h+='<div class="spotq">'+it.parts.map((w,j)=>{ let c='spotw'; if(G.pick!=null){ if(j===it.wrong) c+=' wrong'; else if(G.pick===j) c+=' badpick'; } return '<button class="'+c+'" data-a="spotTap" data-j="'+j+'"'+(G.pick!=null?' disabled':'')+'>'+esc(w)+'</button>'; }).join(' ')+'</div>';
  if(G.pick==null) h+='<button class="btn ghost block" style="margin-top:14px" data-a="spotTap" data-j="-1">A frase está certa</button>';
  else { const ok=G.pick===it.wrong;
    h+='<div class="gfb '+(ok?'ok':'bad')+'"><b>'+(ok?CHECK_SVG+'Isso mesmo!':(it.wrong===-1?'Na verdade, a frase estava certa.':'O certo era: "'+esc(it.fix)+'"'))+'</b>'+(it.x?'<p>'+esc(it.x)+'</p>':'')+'</div>';
    h+=exBtn({subj:sn,q:it.parts.join(' '),x:(it.wrong===-1?'A frase está correta. ':'Erro em "'+it.parts[it.wrong]+'", o correto é "'+it.fix+'". ')+(it.x||'')});
    h+='<button class="btn primary block nextbtn" data-a="spotNext">'+(G.pos+1<G.items.length?'Próxima':'Ver resultado')+'</button>'; }
  return h;
}
function openPTable(){ clearModes(); gSeq++; tutor.ptab={seq:gSeq,order:shuffle(PT_CLUES.map((_,i)=>i)).slice(0,10),pos:0,tries:0,errs:0,ok:0,start:Date.now(),done:false,good:null,bad:null}; SND.start(); goTreino(); }
function viewPTable(){
  const G=tutor.ptab;
  let h='<div class="ghead"><button class="backbtn" data-a="ptClose" aria-label="Sair">'+ICO.x+'</button><div><span class="small muted">Química</span><h2>Tabela periódica: ache o elemento</h2></div></div>';
  if(G.done){ const p=Math.round(100*G.ok/G.order.length); return h+'<div class="gend"><div class="gscore pop '+accCls(G.ok/G.order.length)+'">'+p+'%</div><p>'+G.ok+' de '+G.order.length+' de primeira, '+G.tries+' toques.</p></div><div class="stack"><button class="btn primary block" data-a="ptOpen">Jogar de novo</button><button class="btn ghost block" data-a="ptClose">Voltar</button></div>'; }
  const clue=PT_CLUES[G.order[G.pos]];
  h+='<div class="gbar"><span>'+(G.pos+1)+' / '+G.order.length+'</span><span class="small muted">Erros: '+G.errs+'</span></div><div class="bar"><i style="width:'+Math.round(100*G.pos/G.order.length)+'%"></i></div>';
  h+='<p class="q-prompt">'+esc(clue.q)+'</p><p class="small muted">Períodos 1 a 3 da tabela.</p>';
  const cells={}; PTABLE.forEach(e=>{ cells[e.per+'-'+e.grp]=e; });
  h+='<div class="ptwrap"><div class="ptgrid">';
  for(let per=1;per<=3;per++) for(let grp=1;grp<=18;grp++){ const e=cells[per+'-'+grp]; if(!e){ h+='<span class="ptcell empty"></span>'; continue; } let c='ptcell'; if(G.bad===e.sym) c+=' bad'; else if(G.good===e.sym) c+=' good'; h+='<button class="'+c+'" data-a="ptPick" data-sym="'+e.sym+'" aria-label="'+esc(e.name)+'">'+e.sym+'</button>'; }
  return h+'</div></div>';
}

/* ===================== LINHA DO TEMPO E MAPA (história do Paraná) ===================== */
function openTimeline(){ const evs=shuffle(TIMELINE).slice(0,6); clearModes(); gSeq++; tutor.tl={seq:gSeq,evs:shuffle(evs),order:evs.slice().sort((a,b)=>a.k-b.k),n:0,errs:0,bad:null,start:Date.now(),done:false}; SND.start(); goTreino(); }
function viewTimeline(){
  const L=tutor.tl;
  let h='<div class="ghead"><button class="backbtn" data-a="closeTl" aria-label="Sair">'+ICO.x+'</button><div><span class="small muted">História</span><h2>Linha do tempo do Paraná</h2></div></div><p class="small muted">Toque nos fatos do mais antigo para o mais recente.</p>';
  if(L.n) h+='<ol class="tl-done">'+L.order.slice(0,L.n).map(e=>'<li><b>'+esc(e.d)+'</b>'+esc(e.t)+'</li>').join('')+'</ol>';
  if(L.done){ const g=S.games.timeline; return h+'<div class="okbox">Completa com <strong>'+L.errs+' erro(s)</strong> em '+L.secs+' s.'+(L.isBest?' Novo recorde!':'')+'</div>'+(g&&!L.isBest?'<p class="small muted">Recorde: '+g.errs+' erro(s) em '+g.secs+' s.</p>':'')+'<div class="stack"><button class="btn primary block" data-a="tlOpen">Outra rodada</button><button class="btn ghost block" data-a="closeTl">Voltar</button></div>'; }
  return h+'<div class="optlist">'+L.evs.filter(e=>L.order.indexOf(e)>=L.n).map(e=>'<button class="alt'+(L.bad===e?' wrong':'')+'" data-a="tlTap" data-i="'+L.evs.indexOf(e)+'"><span class="ot">'+esc(e.t)+'</span></button>').join('')+'</div><p class="small muted" style="margin-top:10px">Erros: '+L.errs+'</p>';
}
function openMapGame(){ clearModes(); gSeq++; tutor.map={seq:gSeq,order:shuffle(CICLOMAPA.map((_,i)=>i)),pos:0,wrong:null,good:null,errs:0,tries:0}; SND.start(); goTreino(); }
function mapSVG(good,bad){
  const rects=[['norte',8,8,294,72],['oeste',8,88,92,150],['planalto',106,88,130,150],['litoral',242,88,60,150],['sudoeste',8,246,294,90]];
  return '<svg viewBox="0 0 310 344" class="prmap" role="group" aria-label="Mapa esquemático do Paraná">'+rects.map(([id,x,y,w,hh])=>{ let cls='zone'; if(bad===id) cls+=' bad'; else if(good===id) cls+=' good';
    return '<g><rect class="'+cls+'" data-a="mapTap" data-zone="'+id+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+hh+'" rx="10" tabindex="0" role="button" aria-label="'+esc(ZONE_INFO[id].nome)+'"/><text x="'+(x+w/2)+'" y="'+(y+hh/2)+'" text-anchor="middle" dominant-baseline="middle">'+esc(ZONE_INFO[id].nome.split(' ')[0])+'</text></g>'; }).join('')+'</svg>';
}
function viewMapGame(){
  const M=tutor.map;
  let h='<div class="ghead"><button class="backbtn" data-a="closeMapGame" aria-label="Sair">'+ICO.x+'</button><div><span class="small muted">História e Geografia</span><h2>Mapa dos ciclos</h2></div></div><p class="small muted">Mapa esquemático, sem escala. Toque na região certa.</p>';
  if(M.pos>=M.order.length) return h+'<div class="okbox">Completo com '+M.errs+' erro(s), '+M.tries+' toques.</div><ul class="legend-list">'+Object.keys(ZONE_INFO).map(z=>'<li><b>'+esc(ZONE_INFO[z].nome)+':</b> '+esc(ZONE_INFO[z].cor)+'</li>').join('')+'</ul><div class="stack"><button class="btn primary block" data-a="mapOpen">Jogar de novo</button><button class="btn ghost block" data-a="closeMapGame">Voltar</button></div>';
  return h+'<p class="q-prompt">'+esc(CICLOMAPA[M.order[M.pos]].q)+'</p>'+mapSVG(M.good,M.wrong)+'<p class="small muted">Erros: '+M.errs+'</p>';
}

/* ===================== COMBINAR E 60 SEGUNDOS (a partir dos flashcards) ===================== */
function openMatch(tid){
  const cards=S.flashcards[tid]||[]; const sf=new Set(), sb=new Set(), chosen=[];
  shuffle(cards).forEach(c=>{ if(chosen.length<6&&!sf.has(c.f)&&!sb.has(c.b)&&c.f.length<90&&c.b.length<90){ chosen.push(c); sf.add(c.f); sb.add(c.b); } });
  if(chosen.length<3){ toast('Poucos cartões para o jogo.'); return; }
  const tiles=[]; chosen.forEach((c,i)=>{ tiles.push({pair:i,text:c.f,side:'f'}); tiles.push({pair:i,text:c.b,side:'b'}); });
  clearModes(); gSeq++; tutor.match={seq:gSeq,t:tid,tiles:shuffle(tiles),sel:[],solved:[],tries:0,start:Date.now(),done:false}; SND.start(); goTreino();
}
function viewMatch(){
  const M=tutor.match, info=topicInfo(M.t), bad=M.sel.length===2&&M.tiles[M.sel[0]].pair!==M.tiles[M.sel[1]].pair;
  let h='<div class="ghead"><button class="backbtn" data-a="closeMatch" aria-label="Sair">'+ICO.x+'</button><div><span class="small muted">'+esc(info?info.s.nome:'')+'</span><h2>Combinar: '+esc(info?info.t.nome:'')+'</h2></div></div><p class="small muted">Toque num cartão e depois no par dele.</p>';
  h+='<div class="matchgrid">'+M.tiles.map((t,i)=>{ const solved=M.solved.includes(t.pair), sel=M.sel.includes(i); return '<button class="mtile'+(t.side==='f'?' front':'')+(solved?' solved':'')+(sel?(bad?' bad':' sel'):'')+'" data-a="matchTap" data-i="'+i+'"'+(solved?' disabled':'')+'>'+esc(t.text)+'</button>'; }).join('')+'</div>';
  if(M.done){ const g=(S.games[M.t]||{}).best; return h+'<div class="okbox">Concluído em <strong>'+M.secs+' s</strong>, '+M.tries+' tentativas.'+(M.isBest?' Novo recorde!':'')+'</div>'+(g&&!M.isBest?'<p class="small muted">Recorde: '+g.secs+' s, '+g.tries+' tentativas.</p>':'')+'<div class="stack"><button class="btn primary block" data-a="matchOpen" data-t="'+M.t+'">Jogar de novo</button><button class="btn ghost block" data-a="closeMatch">Voltar</button></div>'; }
  return h+'<p class="small muted" style="margin-top:10px">Tentativas: '+M.tries+'</p>';
}
function relQuestion(tid,prev){
  const cards=S.flashcards[tid]; let c,n=0; do{ c=one2(cards); n++; }while(prev&&c.f===prev.front&&n<12);
  const opts=shuffle([c.b].concat(shuffle([...new Set(cards.map(x=>x.b))].filter(b=>b!==c.b)).slice(0,3)));
  return {front:c.f,opts,right:opts.indexOf(c.b)};
}
function openRel(tid){ const cards=S.flashcards[tid]||[]; if(new Set(cards.map(c=>c.b)).size<3){ toast('Poucos cartões para o jogo.'); return; } clearModes(); gSeq++; tutor.rel={seq:gSeq,t:tid,end:Date.now()+60000,score:0,combo:0,hits:0,total:0,fb:null,q:relQuestion(tid),over:false}; SND.start(); goTreino(); }
function viewRel(){
  const R=tutor.rel, info=topicInfo(R.t);
  let h='<div class="ghead"><button class="backbtn" data-a="closeRel" aria-label="Sair">'+ICO.x+'</button><div><span class="small muted">Flashcards</span><h2>60 segundos: '+esc(info?info.t.nome:'')+'</h2></div></div>';
  if(R.over){ const g=(S.games[R.t]||{}).rel; return h+'<div class="okbox"><strong>'+R.score+' pontos.</strong> '+R.hits+' acertos em '+R.total+' respostas.'+(R.isBest?' Novo recorde!':'')+'</div>'+(g&&!R.isBest?'<p class="small muted">Recorde: '+g+' pontos.</p>':'')+'<div class="stack"><button class="btn primary block" data-a="relOpen" data-t="'+R.t+'">Jogar de novo</button><button class="btn ghost block" data-a="closeRel">Voltar</button></div>'; }
  const left=Math.max(0,Math.ceil((R.end-Date.now())/1000));
  h+='<div class="relbar"><span class="relclock" id="relClock">'+left+'</span><span class="rel-sc">'+R.score+' pts</span><span class="combo">'+(R.combo>=2?'x'+R.combo:'')+'</span></div><div class="bar time"><i id="relBar" style="width:'+Math.round(100*left/60)+'%"></i></div>';
  h+='<div class="qcard"><div class="qtext big">'+fmtText(R.q.front)+'</div></div>'+optionsHTML({opts:R.q.opts,right:R.q.right,tf:true},R.fb,'relAns');
  return h;
}

/* ===================== FLASHCARDS ===================== */
function cardById(t,id){ return (S.flashcards[t]||[]).find(c=>c.id===id)||null; }
function deckOrder(){ const out=[]; allTopics().forEach(({t})=>{ if((S.flashcards[t.id]||[]).length) out.push(t.id); }); return out; }
function flashQueueDeck(tid){
  const cards=S.flashcards[tid]||[], k=today();
  let q=cards.filter(c=>c.seen&&c.due<=k), mode='due';
  if(!q.length){ q=cards.filter(c=>!c.seen).slice(0,10); mode='new'; }
  if(!q.length){ q=cards.slice(); mode='free'; }
  return {q:shuffle(q).map(c=>({t:tid,id:c.id})),mode};
}
function openFlash(tid){ const Q=flashQueueDeck(tid); if(!Q.q.length){ toast('Baralho vazio. Crie cartões para ele.'); return; } const info=topicInfo(tid); clearModes(); tutor.flash={t:tid,q:Q.q,mode:Q.mode,pos:0,revealed:false,ok:0,title:info?info.t.nome:''}; goTreino(); }
function smartQueue(){
  const k=today(), due=[], fresh=[];
  Object.keys(S.flashcards).forEach(t=>{ if(!topicInfo(t)) return; const m=topicMastery(t);
    S.flashcards[t].forEach(c=>{ if(c.seen&&c.due<=k) due.push({t,id:c.id,m,od:diffDays(c.due,k)}); else if(!c.seen) fresh.push({t,id:c.id,m}); }); });
  due.sort((a,b)=>a.m-b.m||b.od-a.od);
  const room=Math.max(0,Math.min(10,NEW_PER_DAY-newToday())), byT={}, fr=[];
  shuffle(fresh).sort((a,b)=>a.m-b.m).forEach(x=>{ byT[x.t]=(byT[x.t]||0)+1; if(byT[x.t]<=3) fr.push(x); });
  const d=due.slice(0,30); return d.concat(fr.slice(0,Math.max(0,Math.min(room,35-d.length))));
}
function openSmart(){ const q=smartQueue(); if(!q.length){ toast('Nada para revisar agora. Jogue um minigame ou volte amanhã.'); return; } clearModes(); tutor.flash={smart:true,q:shuffle(q.slice(0,Math.min(q.length,40))),mode:'smart',pos:0,revealed:false,ok:0,title:'Revisão inteligente'}; goTreino(); }
function viewFlashcards(){
  const F=tutor.flash;
  let h='<div class="ghead"><button class="backbtn" data-a="closeFlash" aria-label="Sair">'+ICO.x+'</button><div><span class="small muted">Flashcards</span><h2>'+esc(F.smart?'Revisão inteligente':F.title)+'</h2></div></div>';
  if(F.pos>=F.q.length){ if(!F.done){ F.done=true; SND.level(); } return h+'<div class="gend"><div class="gscore pop '+accCls(F.q.length?F.ok/F.q.length:0)+'">'+F.ok+'/'+F.q.length+'</div><p>lembrados. Cada cartão volta no intervalo que o algoritmo calculou para ele.</p></div><div class="stack">'+(F.smart?'':'<button class="btn primary block" data-a="matchOpen" data-t="'+F.t+'">Fixar com o jogo de combinar</button>')+'<button class="btn block" data-a="flashAgain">Revisar de novo</button><button class="btn ghost block" data-a="closeFlash">Voltar</button></div>'; }
  const it=F.q[F.pos], c=cardById(it.t,it.id);
  if(!c){ F.pos++; return viewFlashcards(); }
  const info=topicInfo(it.t);
  h+='<div class="gbar"><span>'+(F.pos+1)+' / '+F.q.length+'</span><span class="small muted">'+esc(info?info.s.nome:'')+(c.seen?'':' · novo')+'</span></div><div class="bar"><i style="width:'+Math.round(100*F.pos/F.q.length)+'%"></i></div>';
  h+='<div class="fc3d'+(F.revealed?' flipped':'')+'"><div class="fc-in"><button class="fc-face fc-front" data-a="flashFlip"'+(F.revealed?' tabindex="-1" aria-hidden="true"':'')+'><span class="fc-f">'+fmtText(c.f)+'</span><span class="fc-hint">Pense na resposta. Toque para virar <kbd>Espaço</kbd></span></button>';
  h+='<div class="fc-face fc-back"'+(F.revealed?'':' aria-hidden="true"')+'><span class="fc-q">'+fmtText(c.f)+'</span><span class="fc-b">'+fmtText(c.b)+'</span>'+(c.m?'<span class="fc-m">'+ICO.spark+' '+fmtText(c.m)+'</span>':'')+'</div></div></div>';
  if(F.revealed){
    h+='<div class="grades">'+['Errei','Difícil','Bom','Fácil'].map((l,g)=>'<button class="btn grade g'+g+'" data-a="flashGrade" data-g="'+g+'"><b>'+l+'</b><span>'+ivLabel(sm2(c,g).iv)+'</span><kbd>'+(g+1)+'</kbd></button>').join('')+'</div>';
    h+='<p class="small muted center">O número embaixo é quando o cartão volta.</p><div class="row center card-tools">'+(c.m?'':'<button class="linkbtn small" data-a="cardMacete" data-t="'+it.t+'" data-id="'+c.id+'">'+ICO.spark+' Criar macete com IA</button>')+'<button class="linkbtn small" data-a="cardEdit" data-t="'+it.t+'" data-id="'+c.id+'">Editar cartão</button><button class="linkbtn small" data-a="exCard" data-t="'+it.t+'" data-id="'+c.id+'">Me explique</button></div>';
  }
  return h;
}
function flashGrade(g){
  const F=tutor.flash; if(!F||!F.revealed) return; const it=F.q[F.pos], c=cardById(it.t,it.id); if(!c) return;
  const r=sm2(c,g), wasNew=!c.seen;
  c.ef=r.ef; c.reps=r.reps; c.iv=r.iv; c.due=addDays(today(),r.iv); c.seen=true; c.lr=Date.now();
  if(wasNew){ const d=Dm(today()); d.nc=(d.nc||0)+1; }
  if(g>0){ F.ok++; g>=2?SND.ok():SND.tap(); } else { c.lapses=(c.lapses||0)+1; SND.bad(); }
  gainXP([2,4,5,6][g]);
  addEv(it.t,'card',1,g>0?1:0); commit(); F.pos++; F.revealed=false; render();
}
function deckLi(tid){ const info=topicInfo(tid), st=deckStats(tid);
  return '<li class="deck"><div class="deck-hd"><span class="fc-count'+(st.due?' due':'')+'">'+(st.due||st.total)+'</span><span><span class="nm">'+esc(info.t.nome)+'</span><br><span class="small muted">'+(st.due?st.due+' para revisar hoje':(st.nw?st.nw+' cartões novos':'em dia'))+'</span></span></div><div class="deck-acts"><button class="btn sm" data-a="flashOpen" data-t="'+tid+'">Revisar</button><button class="btn ghost sm" data-a="matchOpen" data-t="'+tid+'">Combinar</button><button class="btn ghost sm" data-a="relOpen" data-t="'+tid+'">60 s</button><button class="btn ghost sm" data-a="deckOpen" data-t="'+tid+'">Cartões</button></div></li>'; }
function decksHTML(){
  const tids=deckOrder(); if(!tids.length) return '<p class="muted">Nenhum baralho ainda.</p>';
  const groups={}; tids.forEach(t=>{ const sid=topicInfo(t).s.id; (groups[sid]=groups[sid]||[]).push(t); });
  let h='';
  Object.keys(groups).forEach(sid=>{ let due=0,nw=0; groups[sid].forEach(t=>{ const st=deckStats(t); due+=st.due; nw+=st.nw; });
    const cl=mCls(subjMastery(sid)); h+='<details class="subj"'+(due?' open':'')+'><summary><span class="sn"><i class="mdot" style="background:var(--'+cl+')"></i>'+esc(SUBJ[sid].nome)+'</span><span class="sq'+(due?' m0':'')+'">'+(due?due+' para revisar':(nw?nw+' novos':'em dia'))+'</span></summary><div class="inner"><ul class="list">'+groups[sid].map(deckLi).join('')+'</ul></div></details>'; });
  return h;
}
function sheetFlashList(){ openSheet('<h2 id="sheetTitle">Flashcards</h2><p class="small muted">Repetição espaçada: cada cartão volta no dia em que você está prestes a esquecer. '+Object.values(S.flashcards).reduce((a,d)=>a+d.length,0)+' cartões em '+deckOrder().length+' baralhos.</p><div class="row" style="margin:10px 0"><button class="btn primary" data-a="smartOpen">Revisão inteligente</button><button class="btn" data-a="newCard">Criar cartão</button><button class="btn" data-a="aiCards">Gerar com IA</button></div>'+decksHTML()); }
function sheetDeck(tid){
  const info=topicInfo(tid), cards=S.flashcards[tid]||[];
  let h='<h2 id="sheetTitle">'+esc(info?info.t.nome:'Baralho')+'</h2><p class="muted small">'+esc(info?info.s.nome:'')+', '+cards.length+' cartões</p><div class="row" style="margin:12px 0"><button class="btn primary" data-a="flashOpen" data-t="'+tid+'">Revisar</button><button class="btn" data-a="newCard" data-t="'+tid+'">Criar cartão</button><button class="btn" data-a="aiCards" data-t="'+tid+'">Gerar com IA</button></div><ul class="list">';
  cards.forEach(c=>{ h+='<li class="cardrow"><div><strong>'+esc(c.f)+'</strong><br><span class="small">'+esc(c.b)+'</span><br><span class="small muted">'+(c.seen?'volta '+fmtDay(c.due):'novo')+(c.custom?', criado por você':'')+'</span></div><div class="cr-acts"><button class="linkbtn small" data-a="cardEdit" data-t="'+tid+'" data-id="'+c.id+'">Editar</button><button class="linkbtn small" data-a="delCard" data-t="'+tid+'" data-id="'+c.id+'">Apagar</button></div></li>'; });
  openSheet(h+'</ul>');
}
function sheetCardForm(tid,id){
  const c=id?cardById(tid,id):null; tid=tid||pick()||'port-reg';
  openSheet('<h2 id="sheetTitle">'+(c?'Editar cartão':'Criar flashcard')+'</h2>'+(c?'':'<label class="f" for="ncT">Tópico</label>'+topicSelect('ncT',tid))+'<label class="f" for="ncF">Frente (pergunta ou termo)</label><textarea id="ncF" rows="2">'+esc(c?c.f:'')+'</textarea><label class="f" for="ncB">Verso (resposta curta)</label><textarea id="ncB" rows="3">'+esc(c?c.b:'')+'</textarea>'+(c?'<label class="f" for="ncM">Macete (opcional)</label><textarea id="ncM" rows="2">'+esc(c.m||'')+'</textarea>':'')+'<div class="row" style="margin-top:14px"><button class="btn primary block" data-a="saveCard"'+(c?' data-t="'+tid+'" data-id="'+c.id+'"':'')+'>'+(c?'Salvar':'Salvar e criar outro')+'</button></div><p class="small muted" style="margin-top:10px">Um fato por cartão. Frente curta, verso curto: é assim que a repetição espaçada funciona melhor.</p>');
}
function sheetAICards(tid){
  const R=tutor.aic; tid=(R&&R.t)||tid||pick()||'qui-org';
  let h='<h2 id="sheetTitle">Gerar flashcards com IA</h2><p class="small muted">Escolha o tópico e, se quiser, um foco. O Claude cria os cartões e você escolhe quais entram.</p><label class="f" for="acT">Tópico</label>'+topicSelect('acT',tid)+'<label class="f" for="acF">Foco (opcional)</label><input id="acF" placeholder="Ex.: nomenclatura de ácidos" value="'+esc(R?R.foco:'')+'"><label class="f" for="acN">Quantidade</label><select id="acN">'+[5,10,15].map(n=>'<option value="'+n+'"'+(((R&&R.n)||10)===n?' selected':'')+'>'+n+'</option>').join('')+'</select>';
  if(R&&R.busy) h+='<p class="note"><span class="dots"><i></i><i></i><i></i></span> Gerando cartões…</p>';
  if(R&&R.err) h+='<p class="badbox">'+esc(R.err)+'</p>';
  if(R&&R.cards&&R.cards.length) h+='<h3 style="margin-top:16px">Prévia</h3><ul class="list">'+R.cards.map((c,i)=>'<li class="cardrow"><label class="chkrow"><input type="checkbox" data-ci="'+i+'"'+(c.on!==false?' checked':'')+'><span><strong>'+esc(c.f)+'</strong><br><span class="small">'+esc(c.b)+'</span></span></label></li>').join('')+'</ul><div class="stack" style="margin-top:12px"><button class="btn go block" data-a="aiCardsAdd">Adicionar selecionados</button><button class="btn ghost block" data-a="aiCardsGen">Gerar outros</button></div>';
  else h+='<div class="row" style="margin-top:14px"><button class="btn primary block" data-a="aiCardsGen"'+(R&&R.busy?' disabled':'')+'>Gerar cartões</button></div>';
  openSheet(h,{key:'aicards',keep:true});
}

/* ===================== TREINO COM IA (questões no seu nível) ===================== */
function viewQuizGen(){
  const G=tutor.quizGen, info=topicInfo(G.tid);
  let h='<div class="ghead"><button class="backbtn" data-a="quizGenCancel" aria-label="Cancelar">'+ICO.x+'</button><div><span class="small muted">'+esc(info?info.s.nome:'')+' · nível '+RUNGS[G.n]+'</span><h2>'+esc(info?info.t.nome:'')+'</h2></div></div>';
  if(G.err) return h+'<p class="badbox">'+esc(G.err)+'</p><div class="stack"><button class="btn primary block" data-a="quizRetry">Tentar de novo</button>'+(localQuiz(G.tid,G.n)?'<button class="btn block" data-a="quizLocal">Treinar com o banco do app</button>':'')+'<button class="btn ghost block" data-a="quizGenCancel">Voltar</button></div>';
  return h+'<div class="genbox"><div class="gen-anim" aria-hidden="true">'+ICO.spark+'</div><p><b>O Claude está escrevendo 5 questões inéditas no estilo AOCP.</b></p><p class="small muted" id="genLbl">'+(G.got?Math.min(G.got,5)+' de 5 questões escritas':'Pensando no que a banca cobra neste tópico…')+'</p><div class="bar"><i id="genProg" style="width:'+Math.min(100,G.got*20)+'%"></i></div><p class="small muted">Costuma levar de 20 a 60 segundos. Enquanto isso, tente lembrar o que você sabe do tópico: isso prepara o cérebro para aprender.</p><button class="btn ghost block" data-a="quizGenCancel">Cancelar</button></div>';
}
function viewQuiz(){
  const Q=tutor.quiz, info=topicInfo(Q.t);
  let h='<div class="ghead"><button class="backbtn" data-a="closeQuiz" aria-label="Fechar treino">'+ICO.x+'</button><div><span class="small muted">'+esc(info?info.s.nome:'')+' · nível '+RUNGS[Q.n]+(Q.src==='banco'?' · banco do app':'')+'</span><h2>'+esc(info?info.t.nome:'')+'</h2></div></div>';
  Q.qs.forEach((q,i)=>{
    const ans=Q.ans[i], t=Q.time[i]||0;
    h+='<div class="q"><p class="qn"><span class="qnum">'+(i+1)+'</span>'+fmtText(q.enunciado)+'</p>';
    if(ans==null) h+=qtimerHTML(i);
    h+=q.alternativas.map((a,j)=>{ let c='alt'; if(ans!=null){ if(j===q.correta) c+=' right'; else if(j===ans) c+=' wrong'; } return '<button class="'+c+'" data-a="ans" data-q="'+i+'" data-j="'+j+'"'+(ans!=null?' disabled':'')+'><span class="k">'+'ABCDE'[j]+'</span><span class="ot">'+esc(a)+'</span></button>'; }).join('');
    if(ans!=null){
      h+='<p class="exp '+(ans===q.correta?'ok':'bad')+'"><b>'+(ans===q.correta?'Certa.':'Errada. Correta: '+'ABCDE'[q.correta]+'.')+'</b> '+fmtText(q.explicacao||'')+'</p>';
      if(t) h+='<p class="small muted">Tempo nesta questão: '+fmtSec(t)+'</p>';
      if(ans!==q.correta&&t){ if(t<T_FAST) h+='<p class="note small">Respondeu em menos de '+T_FAST+' s: pode ter sido chute ou desatenção. Releia o enunciado com calma.</p>'; else if(t>=T_SLOW) h+='<p class="note small">Levou mais de '+fmtSec(T_SLOW)+' e errou: sinal de lacuna de conteúdo. Vale voltar na teoria.</p>'; }
      h+=exBtn({subj:info?info.s.nome:'',q:q.enunciado,opts:q.alternativas,right:q.correta,pick:ans,x:q.explicacao});
    }
    h+='</div>';
  });
  if(Q.ans.every(x=>x!=null)){
    const ok=Q.qs.filter((q,i)=>Q.ans[i]===q.correta).length;
    h+='<div class="'+(ok>=4?'okbox':'note')+'"><strong>'+ok+' de '+Q.qs.length+'.</strong> '+(ok>=4?'Bom sinal para subir de degrau.':'Revise a explicação das erradas antes de gerar mais.')+'</div>';
    h+='<div class="stack">'+(Q.logged?'<p class="small muted">Resultado registrado na escada.</p>':'<button class="btn go block" data-a="quizLog">Registrar '+ok+' de '+Q.qs.length+' na escada</button>')+'<button class="btn primary block" data-a="gerarMais">Gerar outras 5</button>'+(ok<Q.qs.length?'<button class="btn block" data-a="gerarErros">5 novas focadas no que eu errei</button>':'')+'<button class="btn ghost block" data-a="closeQuiz">Fechar treino</button></div>';
  }
  return h;
}
function qtimerHTML(i){ const Q=tutor.quiz, running=Q.running&&Q.running.idx===i, acc=Q.time[i]||0;
  if(running) return '<button class="qtimer running" data-a="qTimerToggle" data-i="'+i+'">'+ICO.pause+' <span id="qt-'+i+'">'+fmtSec(acc)+'</span></button>';
  return '<button class="qtimer" data-a="qTimerToggle" data-i="'+i+'">'+ICO.clock+' '+(acc>0?'Retomar · '+fmtSec(acc):'Cronometrar')+'</button>'; }
function pauseQuizTimer(){ const Q=tutor.quiz; if(Q&&Q.running){ Q.time[Q.running.idx]=Math.round((Q.time[Q.running.idx]||0)+(Date.now()-Q.running.start)/1000); Q.running=null; } }

/* ===================== SIMULADO ===================== */
function wpick(pool){ const tot=pool.reduce((a,p)=>a+p.w,0); let r=Math.random()*tot; for(const p of pool){ r-=p.w; if(r<=0) return p; } return pool[pool.length-1]; }
function buildOffline(mode,sid,n){
  const subs=SUBJECTS.filter(s=>(!sid||s.id===sid)&&GAMES.some(g=>g.s===s.id&&PLAYABLE(g)));
  if(!subs.length) return [];
  const studied=t=>topicEvidence(t).N>=1;
  const pool=subs.map(s=>({s,w:s.q*(mode==='fraq'?Math.pow(1.1-subjMastery(s.id),2):1)}));
  const qs=[]; let g=0;
  while(qs.length<n&&g<n*14){ g++; const q=offlineQuestion(wpick(pool).s); if(!q||qs.some(x=>x.q===q.q)) continue; if(mode==='estudados'&&!studied(q.t)&&g<n*10) continue; qs.push(q); }
  return qs;
}
function simTopicPool(mode,sid){
  const pool=[];
  SUBJECTS.forEach(s=>{ if(sid&&s.id!==sid) return; const L=S.topicList[s.id]||[];
    L.forEach(t=>{ const m=topicMastery(t.id), ev=topicEvidence(t.id).N; let w=s.q/L.length; if(mode==='fraq') w*=Math.pow(1.1-m,2); if(mode==='estudados'&&ev<1) return; pool.push({t:t.id,s:s.id,w}); }); });
  return pool;
}
function simTopics(mode,sid,n){ let pool=simTopicPool(mode,sid); if(!pool.length) pool=simTopicPool('geral',sid); const out=[], used=new Set();
  for(let i=0;i<n;i++){ let p,g=0; do{ p=wpick(pool); g++; }while(used.has(p.t)&&g<8); used.add(p.t); out.push(p); } return out; }
function startSim(qs,title,mode){ clearModes(); gSeq++; tutor.sim={seq:gSeq,qs,ans:qs.map(()=>null),guess:qs.map(()=>false),mark:qs.map(()=>false),time:qs.map(()=>0),pos:0,qStart:Date.now(),start:Date.now(),done:false,title,mode}; SND.start(); goTreino(); }
function simLeave(){ const M=tutor.sim; if(!M||M.done) return; M.time[M.pos]+=(Date.now()-M.qStart)/1000; M.qStart=Date.now(); }
function viewSimGen(){ const g=tutor.simGen;
  let h='<div class="ghead"><button class="backbtn" data-a="simGenCancel" aria-label="Cancelar">'+ICO.x+'</button><div><span class="small muted">Simulado</span><h2>Montando o simulado</h2></div></div>';
  if(g.fail) return h+'<p class="badbox">'+esc(g.err)+'</p><div class="stack"><button class="btn primary block" data-a="simOpen">Fazer o simulado rápido</button><button class="btn ghost block" data-a="simGenCancel">Voltar</button></div>';
  return h+'<div class="genbox"><div class="gen-anim" aria-hidden="true">'+ICO.spark+'</div><p><b>'+g.done+' de '+g.total+' questões prontas.</b></p><div class="bar"><i style="width:'+Math.round(100*g.done/g.total)+'%"></i></div>'+(g.err?'<p class="small m0">'+esc(g.err)+'</p>':'')+'<button class="btn ghost block" data-a="simGenCancel">Cancelar</button></div>'; }
function viewSim(){
  const M=tutor.sim; if(M.done) return viewSimResult(M);
  const r=M.qs[M.pos];
  let h='<div class="ghead"><button class="backbtn" data-a="simQuit" aria-label="Abandonar simulado">'+ICO.x+'</button><div><span class="small muted">'+esc(SUBJ[r.s].nome)+'</span><h2>'+esc(M.title)+'</h2></div></div>';
  h+='<div class="gbar"><span>Questão '+(M.pos+1)+' de '+M.qs.length+'</span><span id="simClock" class="xp">'+fmtSec((Date.now()-M.start)/1000)+'</span></div>';
  h+='<div class="simnav">'+M.qs.map((_,i)=>'<button class="simchip'+(i===M.pos?' cur':'')+(M.ans[i]!=null?' done':'')+(M.mark[i]?' mark':'')+'" data-a="simGo" data-i="'+i+'" aria-label="Questão '+(i+1)+'">'+(i+1)+'</button>').join('')+'</div>';
  h+='<div class="qcard"><div class="qtext">'+fmtText(r.q)+'</div></div>';
  h+='<div class="optlist">'+r.opts.map((o,j)=>'<button class="alt'+(M.ans[M.pos]===j?' chosen':'')+'" data-a="simAns" data-j="'+j+'"><span class="k">'+'ABCDE'[j]+'</span><span class="ot">'+esc(o)+'</span></button>').join('')+'</div>';
  h+='<div class="row sim-meta"><button class="chip'+(M.guess[M.pos]?' on':'')+'" data-a="simGuess" aria-pressed="'+M.guess[M.pos]+'">Marquei no chute</button><button class="chip'+(M.mark[M.pos]?' on':'')+'" data-a="simMark" aria-pressed="'+M.mark[M.pos]+'">Revisar depois</button></div>';
  h+='<div class="simbtns"><button class="btn ghost" data-a="simPrev"'+(M.pos===0?' disabled':'')+'>Anterior</button>'+(M.pos+1<M.qs.length?'<button class="btn primary" data-a="simNext">Próxima</button>':'<button class="btn go" data-a="simEnd">Entregar</button>')+'</div>';
  return h+'<p style="margin-top:16px"><button class="linkbtn" data-a="simEnd">Entregar agora</button></p>';
}
function simFinish(){
  const M=tutor.sim; simLeave(); M.done=true; M.secs=Math.round((Date.now()-M.start)/1000);
  let ok=0; const bys={}; M.luck=0; M.sure=0;
  M.qs.forEach((r,i)=>{ const hit=M.ans[i]===r.right; if(hit) ok++; const b=bys[r.s]||(bys[r.s]={ok:0,n:0}); b.n++; if(hit) b.ok++;
    if(M.ans[i]!=null) addEv(r.t,'sim',1,hit&&!M.guess[i]?1:0);
    if(hit&&M.guess[i]) M.luck++; if(!hit&&M.ans[i]!=null&&!M.guess[i]) M.sure++;
    if(!hit||M.guess[i]) errFromQ({t:r.t,q:r.q,opts:r.opts,right:r.right,x:r.x,steps:r.steps,src:'sim',tempo:Math.round(M.time[i])||null,chute:M.guess[i]}); });
  M.ok=ok; M.bys=bys;
  const d=Dm(today()), answered=M.ans.filter(x=>x!=null).length; d.q+=answered; d.a+=ok; d.sims=(d.sims||0)+1;
  if(gtState()==='idle') d.min+=Math.round(M.secs/60);
  S.sims.push({d:today(),n:M.qs.length,ok,secs:M.secs,mode:M.mode});
  gainXP(ok*8+(answered-ok)*2+20);
  snapWeek(); commit(); afterAction();
  (ok/M.qs.length>=0.5?SND.level:SND.bad)();
}
function viewSimResult(M){
  const p=Math.round(100*M.ok/M.qs.length), proj=Math.round(70*M.ok/M.qs.length);
  let h='<div class="ghead"><div><span class="small muted">Simulado</span><h2>Resultado</h2></div></div><div class="gend"><div class="gscore pop '+accCls(M.ok/M.qs.length)+'">'+p+'%</div><p>'+M.ok+' de '+M.qs.length+' certas em '+fmtSec(M.secs)+' ('+fmtSec(M.secs/M.qs.length)+' por questão).</p><p class="small muted">Nesse aproveitamento, a prova daria cerca de '+proj+' de 70. O mínimo para não ser eliminado é 35.</p></div>';
  if(M.luck||M.sure) h+='<div class="note small"><b>Leitura da sua confiança:</b> '+(M.luck?M.luck+(M.luck===1?' acerto veio':' acertos vieram')+' no chute (não conte com eles na prova; já estão no caderno). ':'')+(M.sure?M.sure+(M.sure===1?' erro foi':' erros foram')+' com certeza: é aí que mora o conceito errado, e corrigir erro confiante fixa mais do que qualquer revisão.':'')+'</div>';
  h+='<h3>Por matéria</h3><div class="crit">'+Object.keys(M.bys).map(sid=>'<span>'+esc(SUBJ[sid].nome)+'</span><span>'+M.bys[sid].ok+'/'+M.bys[sid].n+'</span>').join('')+'</div>';
  h+='<h3 style="margin-top:18px">Correção</h3>';
  M.qs.forEach((r,i)=>{ const a=M.ans[i], ok=a===r.right;
    h+='<div class="q"><div class="qn"><span class="qnum">'+(i+1)+'</span>'+fmtText(r.q)+'</div><p class="small" style="margin-top:6px"><b class="'+(ok?'m4':'m0')+'">'+(ok?'Certa':(a==null?'Em branco':'Errada'))+'</b>'+(M.guess[i]?' <span class="pill sm">chute</span>':'')+(ok?'':'. Correta: '+esc(r.opts[r.right])+(a!=null?'. Você marcou: '+esc(r.opts[a]):''))+'. Tempo: '+fmtSec(M.time[i])+'.</p>'+(r.x?'<p class="small muted">'+fmtText(r.x)+'</p>':'')+(r.steps?'<ol class="steps">'+r.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>':'');
    h+=exBtn({subj:SUBJ[r.s].nome,q:r.q,opts:r.opts,right:r.right,pick:a,x:r.x,steps:r.steps})+'</div>'; });
  const wrong=M.qs.some((r,i)=>M.ans[i]!==r.right);
  return h+'<div class="stack" style="margin-top:14px">'+(wrong&&!M.cards?'<button class="btn primary block" data-a="simCards">Transformar erros em flashcards</button>':'')+(wrong?'<button class="btn block" data-a="tab" data-v="erros">Os erros já estão no caderno: refazer</button>':'')+'<button class="btn block" data-a="simNew">Fazer outro simulado</button><button class="btn ghost block" data-a="simQuit">Voltar ao Treino</button></div>';
}
function sheetSim(sid){
  openSheet('<h2 id="sheetTitle">Simulado</h2><p class="small muted">Questões misturadas como na prova, com cronômetro, navegação livre e correção só no fim. Marque "chute" quando não tiver certeza: o resultado separa sorte de conhecimento.</p><label class="f" for="smK">Tipo</label><select id="smK"><option value="off">Rápido: banco do app, sai na hora</option><option value="ia">Inédito: escrito pelo Claude</option></select><label class="f" for="smM">Foco</label><select id="smM"><option value="geral">Proporção do edital</option><option value="fraq">Minhas fraquezas</option><option value="estudados">Só o que já estudei</option>'+SUBJECTS.map(s=>'<option value="s:'+s.id+'"'+(sid===s.id?' selected':'')+'>Só '+esc(s.nome)+'</option>').join('')+'</select><label class="f" for="smN">Tamanho</label><select id="smN"><option value="10">10 questões</option><option value="20" selected>20 questões</option><option value="35">35 questões (meia prova)</option><option value="70">70 questões (prova inteira)</option></select><p class="small muted" style="margin-top:8px">O simulado inédito demora mais, porque o Claude escreve as questões na hora.</p><div class="row" style="margin-top:14px"><button class="btn primary block" data-a="simStart">Começar</button></div>');
}

/* ===================== TESTE 80/20 ===================== */
function openTeste80(tid){ const set=TESTE80[tid]; if(!set) return;
  const qs=set.qs.map(q=>{ const ord=shuffle([0,1,2,3,4]); return {q:q.q,opts:ord.map(i=>q.o[i]),right:ord.indexOf(q.r),x:q.x}; });
  clearModes(); tutor.t80={t:tid,qs,ans:qs.map(()=>null),start:Date.now(),done:false}; SND.start(); goTreino(); }
function viewT80(){
  const M=tutor.t80, info=topicInfo(M.t);
  let h='<div class="ghead"><button class="backbtn" data-a="closeT80" aria-label="Sair">'+ICO.x+'</button><div><span class="small muted">Teste 80/20</span><h2>'+esc(info?info.t.nome:'')+'</h2></div></div>';
  if(!M.done){
    h+='<p class="small muted">5 questões clássicas deste tópico, sem gabarito até o fim, como na prova. Acerte 4 de 5 para conquistar o selo.</p>';
    M.qs.forEach((q,i)=>{ h+='<div class="q"><p class="qn"><span class="qnum">'+(i+1)+'</span>'+fmtText(q.q)+'</p>'+q.opts.map((o,j)=>'<button class="alt'+(M.ans[i]===j?' chosen':'')+'" data-a="t80Ans" data-i="'+i+'" data-j="'+j+'"><span class="k">'+'ABCDE'[j]+'</span><span class="ot">'+esc(o)+'</span></button>').join('')+'</div>'; });
    const blank=M.ans.filter(x=>x==null).length;
    return h+'<button class="btn primary block" style="margin-top:14px" data-a="t80Finish">'+(blank?'Corrigir mesmo com '+blank+' em branco':'Corrigir teste')+'</button>';
  }
  const pc=M.ok/M.qs.length, passed=pc>=0.8;
  h+='<div class="gend"><div class="gscore pop '+accCls(pc)+'">'+M.ok+'/'+M.qs.length+'</div><p>'+(passed?'<strong class="m4">Selo 80/20 conquistado.</strong> Você domina os padrões mais recorrentes deste tópico.':'Ainda não chegou a 80%. Reveja as explicações e tente de novo mais tarde.')+'</p></div>';
  M.qs.forEach((q,i)=>{ const a=M.ans[i], ok=a===q.right;
    h+='<div class="q"><div class="qn"><span class="qnum">'+(i+1)+'</span>'+fmtText(q.q)+'</div><p class="small" style="margin-top:6px"><b class="'+(ok?'m4':'m0')+'">'+(ok?'Certa':(a==null?'Em branco':'Errada'))+'</b>'+(ok?'':'. Correta: '+esc(q.opts[q.right])+(a!=null?'. Você marcou: '+esc(q.opts[a]):''))+'</p><p class="small muted">'+fmtText(q.x)+'</p>'+exBtn({subj:info?info.s.nome:'',q:q.q,opts:q.opts,right:q.right,pick:a,x:q.x})+'</div>'; });
  return h+'<div class="stack" style="margin-top:14px"><button class="btn primary block" data-a="t80Open" data-t="'+M.t+'">Fazer de novo</button><button class="btn ghost block" data-a="closeT80">Voltar</button></div>';
}
function finishTeste80(){
  const M=tutor.t80; if(!M||M.done) return; M.done=true;
  let ok=0; M.qs.forEach((q,i)=>{ if(M.ans[i]===q.right) ok++; }); M.ok=ok;
  const pc=ok/M.qs.length, rec=S.t80[M.t]||(S.t80[M.t]={tries:0,best:0,passed:false});
  rec.tries++; rec.best=Math.max(rec.best,pc); const just=pc>=0.8&&!rec.passed; if(pc>=0.8) rec.passed=true;
  addEv(M.t,'teste80',M.qs.length,ok);
  const d=Dm(today()); d.q+=M.ans.filter(x=>x!=null).length; d.a+=ok;
  M.qs.forEach((q,i)=>{ if(M.ans[i]!==q.right) errFromQ({t:M.t,q:q.q,opts:q.opts,right:q.right,x:q.x,src:'t80'}); });
  gainXP(ok*10+(just?50:0));
  if(just){ SND.flawless(); confettiSoon(); } else if(pc<0.8) SND.bad(); else SND.level();
  commit(); afterAction();
}
function confettiSoon(){ setTimeout(()=>FX.confetti(0.8),200); }
function sheetTeste80(){
  const by={}; Object.keys(TESTE80).forEach(tid=>{ const info=topicInfo(tid); if(!info) return; (by[info.s.id]=by[info.s.id]||[]).push(tid); });
  let passed=0,total=0,body='';
  Object.keys(by).forEach(sid=>{ body+='<h3 style="margin-top:16px">'+esc(SUBJ[sid].nome)+'</h3><ul class="list">';
    by[sid].forEach(tid=>{ total++; const info=topicInfo(tid), rec=S.t80[tid]; if(rec&&rec.passed) passed++;
      body+='<li class="gamerow"><span><span class="nm">'+(rec&&rec.passed?'<span class="seal">'+ICO.check+'</span>':'')+esc(info.t.nome)+'</span><br><span class="small muted">'+(rec?(rec.passed?'Selo conquistado':'Melhor: '+Math.round(rec.best*100)+'%'):'Ainda não tentado')+'</span></span><button class="btn sm'+(rec&&rec.passed?' ghost':'')+'" data-a="t80Open" data-t="'+tid+'">'+(rec?'Refazer':'Fazer')+'</button></li>'; });
    body+='</ul>'; });
  openSheet('<h2 id="sheetTitle">Teste 80/20</h2><p class="small muted">Para cada tópico, 5 questões nos padrões que mais se repetem em concursos. Acertar 4 de 5 conquista o selo.</p><p class="okbox">Selos conquistados: '+passed+' de '+total+'.</p>'+body);
}

/* ===================== HUB DO TREINO ===================== */
function hubCard(icon,title,desc,act,extra,badge){ return '<button class="hubcard" data-a="'+act+'"'+(extra||'')+'><span class="hc-ic">'+icon+'</span><span class="hc-txt"><b>'+esc(title)+'</b><span>'+esc(desc)+'</span></span>'+(badge?'<span class="hc-badge">'+esc(badge)+'</span>':'<span class="hc-go">'+ICO.arrow+'</span>')+'</button>'; }
function viewTreinoHub(){
  const fd=totalFlashDue(), ed=rfDue().length, t80p=Object.values(S.t80).filter(x=>x.passed).length;
  let h='<p class="lede">Tudo aqui alimenta o seu domínio no Painel: jogo, flashcard, simulado e questão viram uma medida só.</p>';
  if(sampleOff) h+='<p class="note small">O Claude não está disponível dentro da página agora. Os recursos de IA usam o banco do app ou copiam o pedido para você colar no chat.</p>';
  h+='<h2>Revisar</h2><div class="hubgrid">';
  h+=hubCard(ICO.redo,'Revisão inteligente',fd?'Cartões vencendo, das matérias mais fracas primeiro':'Nada vencendo: estude cartões novos','smartOpen','',fd?String(fd):'');
  h+=hubCard(ICO.flag,'Caderno de erros',ed?'Erros que voltam hoje como questão':'Tudo em dia','tab',' data-v="erros"',ed?String(ed):'');
  h+='</div><h2>Praticar</h2><div class="hubgrid">';
  h+=hubCard(ICO.game,'Jogos por matéria',GAMES.length+' jogos em ordem de evolução','hubGames');
  h+=hubCard(ICO.bolt,'Relâmpago','60 segundos, questão atrás de questão','relSheet');
  h+=hubCard(ICO.crown,'Chefão da matéria','Derrube a barra de vida com combos','bossSheet');
  h+=hubCard(ICO.medal,'Teste 80/20','Os padrões que mais caem. '+t80p+' selos','t80List');
  h+=hubCard(ICO.target,'Simulado','No peso do edital, com cronômetro','simOpen');
  h+=hubCard(ICO.cards,'Flashcards',deckOrder().length+' baralhos. Crie ou gere com IA','hubFlash');
  h+='</div><h2>Instrutor com IA</h2><div class="hubgrid">';
  h+=hubCard(ICO.spark,'Pergunte ao Instrutor','Qualquer dúvida, com exemplo e macete','aiOpen');
  h+=hubCard(ICO.q,'Destravar uma questão','Cole ou fotografe. Um degrau por vez','hubDestravar');
  h+=hubCard(ICO.target,'Questões no seu nível','5 inéditas no estilo AOCP, no seu degrau','hubNivel');
  h+=hubCard(ICO.book,'Aprender do zero','Aula guiada do tópico, salva para rever','hubAprender');
  return h+'</div>';
}
function viewTutor(){
  let h=pageHead('Treino');
  if(tutor.simGen) return h+viewSimGen();
  if(tutor.sim) return h+viewSim();
  if(tutor.quizGen) return h+viewQuizGen();
  if(tutor.quiz) return h+viewQuiz();
  if(tutor.t80) return h+viewT80();
  if(tutor.game) return h+viewGame();
  if(tutor.spot) return h+viewSpot();
  if(tutor.ptab) return h+viewPTable();
  if(tutor.map) return h+viewMapGame();
  if(tutor.tl) return h+viewTimeline();
  if(tutor.rel) return h+viewRel();
  if(tutor.match) return h+viewMatch();
  if(tutor.flash) return h+viewFlashcards();
  return h+viewTreinoHub();
}
function sheetNivel(tid){ const def=tid||pick()||'port-int'; openSheet('<h2 id="sheetTitle">Questões no seu nível</h2><p class="small muted">5 questões inéditas no estilo da banca, no degrau em que você está. Ficam salvas no seu banco para simulados.</p><label class="f" for="gqT">Tópico</label>'+topicSelect('gqT',def)+'<label class="f" for="gqN">Nível</label><select id="gqN">'+[0,1,2].map(i=>'<option value="'+i+'"'+(Math.min(T(def).rung,2)===i?' selected':'')+'>'+RUNGS[i]+'</option>').join('')+'</select><label class="f" for="gqF">Foco (opcional)</label><input id="gqF" placeholder="Ex.: crase antes de horas"><div class="row" style="margin-top:12px"><button class="btn primary block" data-a="gerar">Gerar 5 questões</button></div>'); }
function sheetDestravar(){ openSheet('<h2 id="sheetTitle">Destravar uma questão</h2><p class="small muted">Cole a questão inteira, com as alternativas'+(sampleImages?', ou mande uma foto':'')+'. O tutor não entrega a resposta: leva você um degrau por vez.</p><label class="f" for="qTxt">Questão</label><textarea id="qTxt" rows="5" placeholder="Cole aqui o enunciado e as alternativas"></textarea>'+(sampleImages?'<label class="btn ghost filebtn" style="margin-top:10px">'+ICO.camera+'<span id="qImgLbl">Foto da questão</span><input type="file" id="qImg" accept="image/*" hidden></label>':'')+'<label class="f" for="qOnde">Onde travou? (opcional)</label><input id="qOnde" placeholder="Ex.: não sei por onde começar"><div class="row" style="margin-top:12px"><button class="btn primary block" data-a="startChat">Começar</button></div>'); }
function sheetAprenderZero(tid){ const def=tid||pick()||'port-int'; openSheet('<h2 id="sheetTitle">Aprender do zero</h2><p class="small muted">Resumo essencial do tópico e, com IA, uma aula guiada com exemplo resolvido e teste rápido. A aula fica salva no tópico.</p><label class="f" for="azT">Tópico</label>'+topicSelect('azT',def)+'<div class="row" style="margin-top:12px"><button class="btn primary block" data-a="aprender">Abrir o tópico</button></div>'); }
