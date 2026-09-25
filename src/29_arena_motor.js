
/* ===================== ARENA: MOTOR E TELAS =====================
   Partida: 10 rodadas no nível escolhido (duas de revisão do nível anterior, a última vale
   em dobro). 8 de 10 liberam o próximo nível; 10 de 10 dá 3 estrelas. Também há Contra o
   relógio (60 s), Nivelamento (8 rodadas adaptativas) e Rodada inédita com IA. */
const AR_LOCK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const AR_N=10, AR_SUBJ=['port','mat','fis','qui','hist'];
const AR_KIND={choice:'Múltipla escolha',tf:'Certo ou errado',num:'Digite o resultado',spot:'Toque no erro',pick:'Toque no termo',order:'Ponha em ordem',sort:'Classifique',match:'Ligue os pares',commas:'Pontue a frase',map:'Mapa',ptable:'Tabela periódica',balance:'Balanceie'};
function arRec(gid){ S.arena=S.arena||{}; return S.arena[gid]||(S.arena[gid]={lv:1,st:[0,0,0,0,0],p:0,rel:0,r:[]}); }
function arPeek(gid){ return (S.arena||{})[gid]||{lv:1,st:[0,0,0,0,0],p:0,rel:0,r:[]}; }
function arUnl(gid){ const g=AR_BY[gid]; return clamp(Math.max(arPeek(gid).lv||1,[1,2,3,4][T(g.t).rung||0]||1),1,5); }
const arStarsOf=gid=>(arPeek(gid).st||[]).reduce((a,b)=>a+(b||0),0);
function arDoneLv(gid){ const st=arPeek(gid).st||[]; return st.filter(x=>x>=2).length; }
function arKey(r){ return hashStr((r.q||'')+'|'+(r.opts?r.opts[r.right]:'')+'|'+JSON.stringify(r.parts||r.items||r.pairs||r.ch||r.L||'')+'|'+(r.zone||r.sym||'')).slice(0,8); }
function arValid(r){
  if(!r||!r.k||!r.q||/undefined|NaN|Infinity/.test(r.q)) return false;
  if(r.k==='choice'||r.k==='tf'||r.k==='num'){ if(!Array.isArray(r.opts)||r.opts.length<2||!(r.right>=0&&r.right<r.opts.length)) return false; if(r.opts.some(o=>o==null||o===''||/undefined|NaN|Infinity/.test(String(o)))) return false; if(new Set(r.opts.map(arNorm)).size!==r.opts.length) return false; }
  if(r.k==='num'&&!isFinite(r.ans)) return false;
  if((r.k==='spot'||r.k==='pick')&&(!r.parts||!r.parts.length)) return false;
  if(r.k==='sort'&&(!r.items||r.items.length<2||new Set(r.items.map(it=>it[1])).size<2)) return false;
  if(r.k==='match'&&(!r.pairs||r.pairs.length<3)) return false;
  if(r.k==='order'&&(!r.items||r.items.length<3)) return false;
  return true;
}
function arMake(g,L,seen,quick){
  const lv=g.lv[L-1]; let r=null;
  for(let i=0;i<30;i++){ let c=null; try{ c=rP(lv.g)(L); }catch(e){ c=null; }
    if(quick&&c&&['choice','tf','num'].indexOf(c.k)<0) c=arAsChoice(c);
    if(quick&&c&&c.fig) continue;
    if(!arValid(c)) continue; c.key=arKey(c); r=c; if(!seen.has(c.key)) break; }
  if(!r) return null;
  r.t=r.t||g.t; r.lvl=L; seen.add(r.key);
  if(L<=2&&(r.k==='choice'||r.k==='num')&&r.opts.length>4){ const ws=r.opts.map((o,i)=>i).filter(i=>i!==r.right); const drop=rP(ws); const R=r.opts[r.right]; r.opts=r.opts.filter((o,i)=>i!==drop); r.right=r.opts.indexOf(R); }
  if(r.k==='order') r.shuf=(function(){ let s; do{ s=rS(r.items.map((_,i)=>i)); }while(s.every((v,i)=>v===i)&&r.items.length>1); return s; })();
  if(r.k==='match') r.rs=rS(r.pairs.map((_,i)=>i));
  if(r.k==='sort') r.items=rS(r.items);
  return r;
}
function arStart(gid,L,mode,rounds){
  const g=AR_BY[gid]; if(!g) return; L=clamp(L||arUnl(gid),1,5);
  const seen=new Set(arPeek(gid).r||[]);
  clearModes(); gSeq++;
  const G={gid,L,mode:mode||'run',seq:gSeq,rounds:[],pos:0,ok:0,sc:0,tot:0,xp:0,combo:0,maxCombo:0,start:Date.now(),done:false,wrong:[],m0:topicMastery(g.t),seen};
  if(rounds){ G.rounds=rounds.map(r=>Object.assign({},r)); }
  else if(G.mode==='run'){ for(let i=0;i<AR_N;i++){ const r=arMake(g,(L>1&&(i===1||i===5))?L-1:L,seen); if(r) G.rounds.push(r); } }
  else if(G.mode==='rel'){ G.end=Date.now()+60000; G.score=0; G.rounds.push(arMake(g,L,seen,true)); }
  else if(G.mode==='niv'){ G.nl=3; G.max=8; G.hist=[]; G.rounds.push(arMake(g,3,seen)); }
  if(!G.rounds.length||!G.rounds[0]){ toast('Não deu para montar a partida. Tente de novo.'); return; }
  if(G.mode==='run'||G.mode==='retry'||G.mode==='ia') G.rounds[G.rounds.length-1].fin=true;
  G.rounds.forEach(r=>arPrep(G,r));
  tutor.arena={view:'run',sid:g.s,gid,G}; SND.start(); goTreino();
}
function arPrep(G,r){ if(!r||r.prep) return; r.prep=true; r.inp=r.k==='num'&&(G.mode==='run'||G.mode==='retry')&&(r.lvl>=4||(r.lvl===3&&rC(.5))); }
function arRS(G){ return G.rs||(G.rs={}); }
function arCur(){ const A0=tutor.arena; return A0&&A0.view==='run'?A0.G:null; }

/* ---------- respostas ---------- */
function arResolve(G,r,ok,frac){
  if(G.ans) return; G.ans=true; G.res={ok,frac:frac==null?(ok?1:0):frac}; G.tot++;
  const L=r.lvl||G.L;
  if(ok){ G.ok++; G.sc+=1; G.combo++; let xp=G.mode==='rel'?5+L+Math.min(G.combo,6):6+2*L+2*Math.min(G.combo-1,5); if(r.fin) xp*=2; G.xp+=xp; gainXP(xp);
    if(G.mode==='rel') G.score+=1+Math.floor((G.combo-1)/3);
    if(r.fin) SND.crit(); else if(G.combo>=2) SND.combo(G.combo); else SND.ok(); buzz(12);
    G.fbw=rP(['Isso!','Certo!','Boa!','Mandou bem!','Exato!','Na mosca!','Perfeito!']); }
  else { const f=G.res.frac; G.sc+=f; G.combo=0; G.wrong.push(G.pos); const xp=Math.max(1,Math.round((6+2*L)*f)); G.xp+=xp; gainXP(xp); SND.bad(); buzz([25,40,25]);
    const c=arAsChoice(r); try{ errFromQ({t:r.t,q:(c?c.q:r.q),opts:c?c.opts:null,right:c?c.right:null,x:r.x||'',steps:r.steps,src:'game'}); }catch(e){} }
  G.maxCombo=Math.max(G.maxCombo,G.combo);
  addEv(r.t,'game',1,ok?1:(G.res.frac>=0.5?0.5:0),L-1);
  if(G.mode==='niv'){ G.hist.push({L,ok}); }
  commit();
  if(G.mode==='rel'){ render(); const seq=G.seq; setTimeout(()=>{ const g=arCur(); if(g&&g.seq===seq&&!g.done&&g.ans) arNext(); },ok?420:1300); return; }
  render();
}
function arCheckNum(r,s){ s=String(s||'').replace(/\s/g,'').replace(/−/g,'-'); if(!s) return false; let v;
  if(s.indexOf('/')>0){ const [a,b]=s.split('/'); v=parseFloat(a.replace(',','.'))/parseFloat(b.replace(',','.')); } else v=parseFloat(s.replace(/\./g,'').replace(',','.'));
  if(!isFinite(v)) return false; const tol=r.tol!=null?r.tol:0.5*Math.pow(10,-(r.d==null?2:r.d))+1e-9; return Math.abs(v-r.ans)<=Math.max(tol,Math.abs(r.ans)*0.001); }
function arNext(){
  const G=arCur(); if(!G) return;
  G.pos++; G.ans=false; G.res=null; G.pick=null; G.rs=null; G.inpv='';
  const g=AR_BY[G.gid];
  if(G.mode==='rel'){ if(Date.now()>=G.end){ arFinish(G); return; } const r=arMake(g,G.L,G.seen,true); if(r){ arPrep(G,r); G.rounds.push(r); } }
  if(G.mode==='niv'&&G.pos<G.max){ const last=G.hist[G.hist.length-1]; G.nl=clamp(G.nl+(last&&last.ok?1:-1),1,5); const r=arMake(g,G.nl,G.seen); if(r){ arPrep(G,r); G.rounds.push(r); } }
  if(G.pos>=G.rounds.length){ arFinish(G); return; }
  animNext('newq'); render(); window.scrollTo(0,0);
}
function arFinish(G){
  if(G.done) return; G.done=true; G.secs=Math.round((Date.now()-G.start)/1000);
  const g=AR_BY[G.gid], rec=arRec(G.gid), d=Dm(today());
  rec.lv=Math.max(rec.lv||1,arUnl(G.gid)); rec.p=(rec.p||0)+1;
  d.gcount=(d.gcount||0)+1; d.gp=d.gp||{}; d.gp[G.gid]=(d.gp[G.gid]||0)+1;
  rec.r=(rec.r||[]).concat(G.rounds.map(r=>r&&r.key).filter(Boolean)).slice(-40);
  if(G.mode==='run'){
    const acc=G.sc/G.rounds.length; G.stars=acc>=0.95?3:acc>=0.8?2:acc>=0.6?1:0;
    const prev=rec.st[G.L-1]||0; if(G.stars>prev){ rec.st[G.L-1]=G.stars; G.newStars=G.stars-prev; }
    if(G.stars===3&&prev<3){ gainXP(25); G.xp+=25; }
    if(G.stars>=2&&G.L>=rec.lv&&G.L<5){ rec.lv=G.L+1; G.unlocked=G.L+1; gainXP(40); G.xp+=40; }
    if(G.stars>=2&&G.L===5&&prev<2) G.mastered=true;
  } else if(G.mode==='rel'){ G.isBest=G.score>(rec.rel||0); if(G.isBest) rec.rel=G.score; SND.timerEnd(); if(G.isBest&&G.score>0) setTimeout(()=>FX.confetti(0.6),200); }
  else if(G.mode==='niv'){ let P=1; for(let L=5;L>=1;L--){ const c=G.hist.filter(h=>h.L===L&&h.ok).length, w=G.hist.filter(h=>h.L===L&&!h.ok).length; if(c>=1&&c>=w){ P=L; break; } } G.place=P; if(P>rec.lv){ rec.lv=P; G.unlocked=P; } SND.level(); }
  else SND.level();
  G.m1=topicMastery(g.t); snapWeek(); commit(); FX.hold(G.mode==='run'?1700:700); afterAction(); animNext(); render(); window.scrollTo(0,0);
  /* as estrelas entram em .1s, .3s e .5s (CSS): o som de cada uma e o confete saem no mesmo compasso */
  if(G.mode==='run'){ const big=G.stars===3||G.unlocked||G.mastered; SND.stars(G.stars,big); if(big) setTimeout(()=>FX.confetti(G.stars===3?1:0.7),(0.4+0.2*G.stars)*1000); }
}

/* ---------- Rodada com IA ---------- */
async function arIA(gid){
  const g=AR_BY[gid], L=arUnl(gid), info=topicInfo(g.t); if(!info) return;
  const s=await getSample();
  const prompt=['Crie 6 questões inéditas de múltipla escolha para o concurso de Cadete do Corpo de Bombeiros Militar do Paraná (banca estilo Instituto AOCP).','Disciplina: '+info.s.nome,'Tópico: '+info.t.nome,
    'Nível '+L+' de 5 ('+AR_LV[L-1].n+': '+g.lv[L-1].d+'). Nível 1 = fundamentos; nível 4 = padrão de prova; nível 5 = questões difíceis de concurso, sem exagerar.',
    'Regras: 5 alternativas, uma correta; enunciado direto; explicação curta que ensine a regra. Em cálculo, números que dão conta limpa. Sem LaTeX (escreva x^2, raiz de 2, 3/4). Não coloque letras nas alternativas.',
    'Responda somente com JSON: {"questoes":[{"enunciado":"...","alternativas":["...","...","...","...","..."],"correta":0,"explicacao":"..."}]}'].join('\n');
  if(!s){ sheetCopy('Copiar pedido de questões',prompt); return; }
  clearModes(); const job={ctl:new AbortController(),gid,err:''}; tutor.arena={view:'gen',sid:g.s,gid,job}; goTreino();
  try{ const d=await s.json(prompt,{cache:false,signal:job.ctl.signal});
    const qs=(d&&Array.isArray(d.questoes)?d.questoes:[]).filter(validQ).slice(0,6);
    if(tutor.arena!==null&&tutor.arena&&tutor.arena.job!==job) return;
    if(qs.length<3) throw {code:'invalid_json'};
    const rounds=qs.map(q=>({k:'choice',q:q.enunciado,opts:q.alternativas.map(String),right:q.correta,x:String(q.explicacao||''),t:g.t,lvl:L,key:hashStr(q.enunciado).slice(0,8)}));
    arStart(gid,L,'ia',rounds);
  }catch(e){ if(tutor.arena&&tutor.arena.job===job){ job.err=sampleMsg(e)||'Não deu para gerar agora. Tente de novo.'; render(); } }
}

/* ---------- navegação ---------- */
function arOpenHome(sid){ clearModes(); tutor.arena={view:'home',sid:sid||UI.arS||'port'}; UI.arS=tutor.arena.sid; saveUI(); goTreino(); }
function arOpenGame(gid){ const g=AR_BY[gid]; if(!g) return; clearModes(); tutor.arena={view:'game',sid:g.s,gid}; goTreino(); }
function arRecommend(sid){
  const gs=ARENA.filter(g=>!sid||g.s===sid); if(!gs.length) return null;
  const sc=g=>{ const s=SUBJ[g.s]; return (s?s.q:3)*(1.05-topicMastery(g.t))*(1+0.15*(5-arDoneLv(g.id)))+Math.random()*0.3; };
  return gs.slice().sort((a,b)=>sc(b)-sc(a))[0];
}
function arOffline(sid){
  const gs=ARENA.filter(g=>g.s===sid); if(!gs.length) return null;
  for(let i=0;i<14;i++){ const g=rP(gs); const L=clamp(arUnl(g.id)+rI(-1,1),2,5); const r=arMake(g,L,new Set(),true); if(!r||r.fig||r.tx) continue; const q=r.q; if(q.length>700) continue;
    return {q,opts:r.opts,right:r.right,x:r.x||'',steps:r.steps,t:g.t,s:sid,gid:g.id}; }
  return null;
}
function arKinds(g){ if(g._k) return g._k; const ks=new Set(); g.lv.forEach((l,i)=>{ for(let j=0;j<4;j++){ try{ const r=rP(l.g)(i+1); if(r&&r.k) ks.add(r.k==='num'&&i>=2?'num':r.k==='num'?'choice':r.k); }catch(e){} } }); g._k=[...ks]; return g._k; }

/* ---------- telas ---------- */
function arLvDots(gid){ const st=arPeek(gid).st||[], u=arUnl(gid); return '<span class="lvdots">'+[1,2,3,4,5].map(L=>'<i class="'+((st[L-1]||0)>=2?'on':L<=u?'open':'')+'"></i>').join('')+'</span>'; }
function arStarsHTML(n,max){ let h='<span class="stars">'; for(let i=0;i<(max||3);i++) h+='<svg viewBox="0 0 24 24" class="'+(i<n?'on':'')+'"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>'; return h+'</span>'; }
function arCard(g){ const info=topicInfo(g.t), u=arUnl(g.id), stars=arStarsOf(g.id);
  return '<button class="agc s-'+g.s+'" data-a="arGame" data-g="'+g.id+'"><span class="agc-ic">'+esc(g.ic)+'</span><span class="agc-t"><b>'+esc(g.nome)+'</b><span>'+esc(info?info.t.nome:'')+'</span>'+arLvDots(g.id)+'</span><span class="agc-r"><span class="agc-n">N'+u+'</span><span class="agc-s">★ '+stars+'</span></span></button>'; }
function viewArenaHome(){
  const A0=tutor.arena, sid=A0.sid;
  let h='<div class="ghead"><button class="backbtn" data-a="arBack" aria-label="Voltar ao Treino">'+ICO.x+'</button><div><span class="small muted">Treino</span><h2>Arena de jogos</h2></div></div>';
  h+='<div class="artabs" role="tablist">'+AR_SUBJ.map(s=>'<button class="chip s-'+s+(s===sid?' on':'')+'" role="tab" aria-selected="'+(s===sid)+'" data-a="arTab" data-s="'+s+'">'+esc(SUBJ[s].nome)+'</button>').join('')+'<button class="chip'+(sid==='outras'?' on':'')+'" data-a="arTab" data-s="outras">Outras matérias</button></div>';
  if(sid==='outras') return h+'<p class="small muted" style="margin-top:12px">Jogos das demais matérias do edital, Relâmpago e Chefão.</p>'+gamesCatalogHTML();
  const gs=ARENA.filter(g=>g.s===sid), tl=S.topicList[sid]||[], idx=t=>{ const i=tl.findIndex(x=>x.id===t); return i<0?99:i; };
  gs.sort((a,b)=>idx(a.t)-idx(b.t));
  const lvDone=gs.reduce((a,g)=>a+arDoneLv(g.id),0), st=gs.reduce((a,g)=>a+arStarsOf(g.id),0), rec=arRecommend(sid);
  if(sid==='hist') h+=jnFeatureCard();
  h+='<div class="arsum s-'+sid+'"><div><b>'+lvDone+'<small>/'+(gs.length*5)+'</small></b><span>níveis concluídos</span></div><div><b>'+st+'<small>/'+(gs.length*15)+'</small></b><span>estrelas</span></div><div><b>'+gs.length+'</b><span>jogos, um por tópico</span></div></div>';
  if(rec) h+='<button class="arrec" data-a="arPlay" data-g="'+rec.id+'" data-l="'+arUnl(rec.id)+'"><span class="small">Recomendado agora</span><b>'+esc(rec.nome)+' · nível '+arUnl(rec.id)+'</b><span class="small">Mais peso na prova e menos domínio seu.</span><span class="btn primary sm">Jogar</span></button>';
  if(sid==='port'){
    h+='<button class="btn ghost block" data-a="portPegaSheet" style="margin:12px 0">'+ICO.q+' Biblioteca de pegadinhas · '+PORT_PEGA.length+' armadilhas com truque</button>';
    ['dura','lex','lei'].forEach(k=>{
      const meta=PORT_TRILHAS[k], items=gs.filter(g=>PORT_TRILHA[g.t]).filter(g=>PORT_TRILHA[g.t].tr===k).sort((a,b)=>PORT_TRILHA[a.t].o-PORT_TRILHA[b.t].o);
      if(!items.length) return;
      h+='<h2>'+esc(meta.n)+'</h2><p class="small muted" style="margin-top:-8px">'+esc(meta.d)+'</p><div class="aglist">'+items.map(arCard).join('')+'</div>';
    });
  } else h+='<div class="aglist">'+gs.map(arCard).join('')+'</div>';
  h+='<div class="row modes" style="margin-top:14px"><button class="btn sm" data-a="relOpenS" data-s="'+sid+'">'+ICO.bolt+' Relâmpago da matéria</button><button class="btn sm" data-a="bossOpen" data-s="'+sid+'">'+ICO.crown+' Chefão da matéria</button></div>';
  return h;
}
function viewArenaGame(){
  const g=AR_BY[tutor.arena.gid], info=topicInfo(g.t), rec=arPeek(g.id), u=arUnl(g.id);
  let h='<div class="ghead"><button class="backbtn" data-a="arHome" data-s="'+g.s+'" aria-label="Voltar à Arena">'+ICO.x+'</button><div><span class="small muted">'+esc(SUBJ[g.s].nome)+' · '+esc(info?info.t.nome:'')+'</span><h2>'+esc(g.nome)+'</h2></div></div>';
  h+='<div class="aghero s-'+g.s+'"><span class="agh-ic">'+esc(g.ic)+'</span><div><p>'+esc(g.desc)+'</p><div class="agkinds">'+arKinds(g).map(k=>'<span>'+esc(AR_KIND[k]||k)+'</span>').join('')+'</div></div></div>';
  h+='<ol class="lvpath s-'+g.s+'">'+g.lv.map((l,i)=>{ const L=i+1, st=rec.st[i]||0, open=L<=u, cur=L===u;
    return '<li class="'+(st>=2?'done':'')+(cur?' cur':'')+(open?'':' locked')+'"><button data-a="arPlay" data-g="'+g.id+'" data-l="'+L+'"'+(open?'':' disabled aria-disabled="true"')+'><span class="lvn">'+(open?L:AR_LOCK)+'</span><span class="lvt"><b>Nível '+L+' · '+esc(AR_LV[i].n)+'</b><span>'+esc(l.d)+'</span></span>'+arStarsHTML(st)+'</button></li>'; }).join('')+'</ol>';
  h+='<p class="small muted">Acerte 8 de 10 para liberar o próximo nível. 10 de 10 vale 3 estrelas. Em cada partida, duas rodadas revisam o nível anterior, e a última vale XP em dobro.</p>';
  h+='<div class="stack"><button class="btn primary block" data-a="arPlay" data-g="'+g.id+'" data-l="'+u+'">'+ICO.play+' Jogar nível '+u+'</button>';
  h+='<div class="grid2"><button class="btn" data-a="arRel" data-g="'+g.id+'">'+ICO.bolt+' Contra o relógio</button>'+(u<5?'<button class="btn" data-a="arNiv" data-g="'+g.id+'">'+ICO.target+' Nivelamento</button>':'<button class="btn" data-a="arPlay" data-g="'+g.id+'" data-l="5">'+ICO.crown+' Nível máximo</button>')+'</div>';
  if(!sampleOff) h+='<button class="btn ghost block" data-a="arIA" data-g="'+g.id+'">'+ICO.spark+' Rodada inédita com IA (nível '+u+')</button>';
  h+='</div><p class="small muted" style="margin-top:10px">'+(rec.p?rec.p+(rec.p===1?' partida':' partidas')+' jogadas':'Ainda não jogado')+(rec.rel?' · recorde no relógio: '+rec.rel+' pts':'')+'.'+(u>(rec.lv||1)?' Seu degrau no tópico já liberou até o nível '+u+'.':'')+'</p>';
  return h;
}
function viewArenaGen(){ const j=tutor.arena.job, g=AR_BY[tutor.arena.gid];
  let h='<div class="ghead"><button class="backbtn" data-a="arGame" data-g="'+g.id+'" aria-label="Cancelar">'+ICO.x+'</button><div><span class="small muted">'+esc(g.nome)+'</span><h2>Rodada inédita com IA</h2></div></div>';
  if(j.err) return h+'<p class="badbox">'+esc(j.err)+'</p><div class="stack"><button class="btn primary block" data-a="arIA" data-g="'+g.id+'">Tentar de novo</button><button class="btn block" data-a="arPlay" data-g="'+g.id+'" data-l="'+arUnl(g.id)+'">Jogar com o banco do app</button></div>';
  return h+'<div class="genbox"><div class="gen-anim" aria-hidden="true">'+ICO.spark+'</div><p><b>O Claude está escrevendo 6 questões no seu nível.</b></p><p class="small muted">Leva de 20 a 60 segundos.</p><button class="btn ghost block" data-a="arGame" data-g="'+g.id+'">Cancelar</button></div>'; }
function arHeadRun(G){
  const g=AR_BY[G.gid]; const L=G.mode==='niv'?G.nl:G.L;
  let h='<div class="ghead"><button class="backbtn" data-a="arQuit" aria-label="Sair da partida">'+ICO.x+'</button><div><span class="small muted">'+esc(SUBJ[g.s].nome)+' · '+({run:'Nível '+L+' · '+AR_LV[L-1].n,retry:'Refazendo erros',rel:'Contra o relógio · nível '+L,niv:'Nivelamento',ia:'Rodada inédita com IA'}[G.mode])+'</span><h2>'+esc(g.nome)+'</h2></div></div>';
  if(G.mode==='rel'){ const left=Math.max(0,Math.ceil((G.end-Date.now())/1000)); return h+'<div class="relbar"><span class="relclock" id="relClock">'+left+'</span><span class="rel-sc">'+G.score+' pts</span><span class="combo'+(G.combo>=3?' hot':'')+'">'+(G.combo>=2?flameMini()+' x'+G.combo:'')+'</span></div><div class="bar time"><i id="relBar" style="width:'+Math.round(100*left/60)+'%"></i></div>'; }
  const n=G.mode==='niv'?G.max:G.rounds.length;
  h+='<div class="gbar"><span>'+Math.min(G.pos+1,n)+' / '+n+'</span><span class="xp">'+G.xp+' XP</span><span class="combo'+(G.combo>=3?' hot':'')+'">'+(G.combo>=2?flameMini()+' x'+G.combo:'')+'</span></div>';
  h+='<div class="segs">'+Array.from({length:n},(_,i)=>{ let c=''; if(i<G.pos||(i===G.pos&&G.ans)){ c=G.wrong.indexOf(i)>=0?'bad':'ok'; } else if(i===G.pos) c='cur'; return '<i class="'+c+'"></i>'; }).join('')+'</div>';
  return h;
}
function viewArenaRun(){
  const G=tutor.arena.G; if(G.done) return arHeadRun(G)+viewArenaEnd(G);
  const r=G.rounds[G.pos]; if(!r){ arFinish(G); return ''; }
  let h=arHeadRun(G);
  if(r.fin&&!G.ans) h+='<div class="finflag">Rodada final · XP em dobro</div>';
  h+='<div class="qcard ar'+(G.ans?(G.res.ok?' ok':' bad'):'')+'">'+(r.lvl!==G.L&&G.mode==='run'?'<span class="revtag">Revisão do nível '+r.lvl+'</span>':'')+'<div class="qtext">'+fmtText(r.q)+'</div>'+(r.fig?'<div class="figbox">'+r.fig+'</div>':'')+'</div>';
  h+=arBody(G,r);
  if(G.ans&&G.mode!=='rel') h+=arFeedback(G,r);
  return h;
}
function arOptsHTML(G,r){ const pick=G.pick, ans=G.ans; const many=r.opts.length>4&&r.opts.every(o=>String(o).length<26);
  return '<div class="'+(r.k==='tf'?'tfgrid':many?'optgrid':'optlist')+'">'+r.opts.map((o,j)=>{ let c='alt'; if(ans){ if(j===r.right) c+=' right'; else if(j===pick) c+=' wrong'; } return '<button class="'+c+'" data-a="arAns" data-j="'+j+'"'+(ans?' disabled':'')+'>'+(r.k==='tf'?'':'<span class="k">'+'ABCDE'[j]+'</span>')+'<span class="ot">'+esc(o)+'</span></button>'; }).join('')+'</div>'; }
function arBody(G,r){
  const rs=arRS(G), ans=G.ans;
  if(r.k==='choice'||r.k==='tf'||(r.k==='num'&&!r.inp)) return arOptsHTML(G,r);
  if(r.k==='num'){ const v=G.inpv||'';
    if(ans) return '<div class="numres '+(G.res.ok?'ok':'bad')+'"><span>Você digitou</span><b>'+esc(v||'—')+(r.u?' '+esc(r.u):'')+'</b></div>';
    return '<div class="numin"><div class="numdisp" aria-live="polite">'+(v?esc(v):'<span class="muted">digite o resultado</span>')+(r.u?'<em>'+esc(r.u)+'</em>':'')+'</div><div class="keypad">'+['7','8','9','⌫','4','5','6','−','1','2','3','/','0',',','OK'].map(k=>'<button class="kp'+(k==='OK'?' kp-ok':'')+'" data-a="arKey" data-k="'+k+'">'+k+'</button>').join('')+'</div><p class="small muted">Use vírgula para decimais. Arredonde para '+(r.d===0?'inteiro':r.d+' casa'+(r.d>1?'s':''))+' se precisar.</p></div>'; }
  if(r.k==='spot'||r.k==='pick'){ const right=Array.isArray(r.right)?r.right:[r.k==='spot'?r.wrong:r.right];
    let h='<div class="spotq">'+r.parts.map((w,j)=>{ let c='spotw'; if(ans){ if(right.indexOf(j)>=0) c+=r.k==='spot'?' wrong':' good'; else if(G.pick===j) c+=' badpick'; } return '<button class="'+c+'" data-a="arTok" data-j="'+j+'"'+(ans?' disabled':'')+'>'+esc(w)+'</button>'; }).join('')+'</div>';
    if(r.k==='spot'&&!ans) h+='<button class="btn ghost block" style="margin-top:12px" data-a="arTok" data-j="-1">'+ICO.check+' A frase está correta</button>';
    return h; }
  if(r.k==='order'){ const os=rs.os||0; let h='';
    if(os) h+='<ol class="tl-done">'+r.items.slice(0,os).map((s,i)=>'<li>'+(r.lab?'<b>'+esc(r.lab[i])+'</b>':'')+esc(s)+'</li>').join('')+'</ol>';
    if(!ans) h+='<p class="small muted">Toque no próximo da sequência.</p><div class="optlist">'+r.shuf.filter(k=>k>=os).map(k=>'<button class="alt'+(rs.ob===k?' wrong':'')+'" data-a="arOrd" data-k="'+k+'"><span class="ot">'+esc(r.items[k])+'</span></button>').join('')+'</div><p class="small muted">Erros: '+(rs.oe||0)+'</p>';
    return h; }
  if(r.k==='sort'){ const asg=rs.asg||(rs.asg=r.items.map(()=>null)); if(rs.sel===undefined&&!ans) rs.sel=0; let h='<div class="sortitems">'+r.items.map((it,i)=>{ let c='sitem'; if(rs.sel===i) c+=' sel'; if(ans) c+=asg[i]===it[1]?' ok':' bad'; return '<button class="'+c+'" data-a="arSortSel" data-i="'+i+'"'+(ans?' disabled':'')+'><span>'+esc(it[0])+'</span>'+(asg[i]!=null?'<em>'+esc(r.cats[asg[i]])+(ans&&asg[i]!==it[1]?' → '+esc(r.cats[it[1]]):'')+'</em>':'<em class="muted">toque e escolha a categoria</em>')+'</button>'; }).join('')+'</div>';
    if(!ans){ h+='<div class="bins">'+r.cats.map((c,j)=>'<button class="bin" data-a="arSortBin" data-j="'+j+'"'+(rs.sel==null?' disabled':'')+'>'+esc(c)+'</button>').join('')+'</div>';
      h+='<button class="btn primary block" style="margin-top:12px" data-a="arSortOk"'+(asg.some(x=>x==null)?' disabled':'')+'>Conferir</button>'; }
    return h; }
  if(r.k==='match'){ const done=rs.md||(rs.md=[]); let h='<div class="matchcols"><div>'+r.pairs.map((p,i)=>'<button class="mtile front'+(done.indexOf(i)>=0?' solved':'')+(rs.ml===i?' sel':'')+'" data-a="arML" data-i="'+i+'"'+(done.indexOf(i)>=0||ans?' disabled':'')+'>'+esc(p[0])+'</button>').join('')+'</div><div>'+r.rs.map(i=>'<button class="mtile'+(done.indexOf(i)>=0?' solved':'')+(rs.mb===i?' bad':'')+'" data-a="arMR" data-i="'+i+'"'+(done.indexOf(i)>=0||ans?' disabled':'')+'>'+esc(r.pairs[i][1])+'</button>').join('')+'</div></div>';
    if(!ans) h+='<p class="small muted">Toque num item da esquerda e depois no par dele. Erros: '+(rs.me||0)+'</p>'; return h; }
  if(r.k==='commas'){ const cm=rs.cm||(rs.cm=r.sl.map(()=>false)); let h='<div class="commas">';
    r.ch.forEach((c,i)=>{ h+='<span class="cchunk">'+esc(c)+'</span>'; if(i<r.sl.length){ let cl='cgap'+(cm[i]?' on':''); if(ans){ if(r.sl[i]==='must') cl+=cm[i]?' ok':' miss'; else if(r.sl[i]==='no'&&cm[i]) cl+=' bad'; } h+='<button class="'+cl+'" data-a="arComma" data-i="'+i+'"'+(ans?' disabled':'')+' aria-label="Espaço '+(i+1)+(cm[i]?', com vírgula':'')+'">'+(cm[i]||(ans&&r.sl[i]==='must')?',':'')+'</button>'; } });
    h+='</div>'; if(!ans) h+='<button class="btn primary block" style="margin-top:12px" data-a="arCommaOk">Conferir</button>'; return h; }
  if(r.k==='map') return arMapSVG(G,r);
  if(r.k==='ptable') return arPTable(G,r);
  if(r.k==='balance'){ const co=rs.co||(rs.co=r.co.map(()=>1)); const all=r.L.concat(r.R); let h='<div class="baleq">';
    all.forEach((sp,i)=>{ if(i===r.L.length) h+='<span class="barrow">→</span>'; else if(i>0) h+='<span class="bplus">+</span>'; h+='<span class="bsp"><span class="bstep">'+(ans?'':'<button data-a="arBal" data-i="'+i+'" data-d="1" aria-label="Aumentar">+</button>')+'<b class="'+(ans?(co[i]===r.co[i]?'ok':'bad'):'')+'">'+co[i]+'</b>'+(ans?'':'<button data-a="arBal" data-i="'+i+'" data-d="-1" aria-label="Diminuir">−</button>')+'</span><span class="bf">'+esc(sp)+'</span></span>'; });
    h+='</div>'; if(!ans) h+='<button class="btn primary block" style="margin-top:12px" data-a="arBalOk">Conferir</button>'; return h; }
  return '';
}
function arMapSVG(G,r){ const ans=G.ans;
  let s='<svg viewBox="0 0 400 250" class="prmap2" role="group" aria-label="Mapa esquemático do Paraná">';
  Object.keys(AR_ZONES).forEach(z=>{ const Z=AR_ZONES[z]; let c='zone'; if(ans){ if(z===r.zone) c+=' good'; else if(z===G.pick) c+=' bad'; }
    s+='<polygon class="'+c+'" points="'+Z.p+'" data-a="arMap" data-z="'+z+'" tabindex="0" role="button" aria-label="'+esc(Z.n)+'"/>'; });
  Object.keys(AR_ZONES).forEach(z=>{ const Z=AR_ZONES[z]; s+='<text x="'+Z.c[0]+'" y="'+Z.c[1]+'" text-anchor="middle">'+esc(ZN[z])+'</text>'; });
  s+='<text x="380" y="240" class="mk" text-anchor="end">Oceano Atlântico →</text></svg>';
  return '<div class="mapbox">'+s+'</div><p class="small muted">Mapa esquemático, sem escala.</p>'; }
function arPTable(G,r){ const ans=G.ans, cells={}; AR_EL.forEach(e=>{ cells[e.p+'-'+e.g]=e; });
  let h='<div class="ptwrap"><div class="ptgrid">';
  for(let p=1;p<=4;p++) for(let g=1;g<=18;g++){ const e=cells[p+'-'+g]; if(!e){ h+='<span class="ptcell empty"></span>'; continue; } let c='ptcell'; if(ans){ if(e.s===r.sym) c+=' good'; else if(e.s===G.pick) c+=' bad'; } h+='<button class="'+c+'" data-a="arPT" data-s="'+e.s+'" aria-label="'+esc(e.n)+'"'+(ans?' disabled':'')+'>'+e.s+'</button>'; }
  return h+'</div></div><p class="small muted">Períodos 1 a 4 da tabela periódica.</p>'; }
function arAnswerText(r){
  if(r.k==='choice'||r.k==='tf'||r.k==='num') return r.k==='num'&&r.inp?fN(r.ans,r.d)+(r.u?' '+r.u:''):r.opts[r.right];
  if(r.k==='spot') return r.wrong<0?'A frase estava correta.':'Errado: “'+r.parts[r.wrong]+'”. Certo: “'+r.fix+'”.';
  if(r.k==='pick') return '“'+r.parts[Array.isArray(r.right)?r.right[0]:r.right]+'”';
  if(r.k==='order') return r.items.join(' → ');
  if(r.k==='sort') return r.items.map(it=>it[0]+': '+r.cats[it[1]]).join(' · ');
  if(r.k==='match') return r.pairs.map(p=>p[0]+' → '+p[1]).join(' · ');
  if(r.k==='commas') return arCommaText(r.ch,r.sl.map(s=>s==='must'));
  if(r.k==='map') return AR_ZONES[r.zone].n;
  if(r.k==='ptable'){ const e=AR_EL.find(x=>x.s===r.sym); return e.s+' ('+e.n+')'; }
  if(r.k==='balance') return arEqText(r.L,r.R,r.co);
  return '';
}
function arFeedback(G,r){
  const ok=G.res.ok, fr=G.res.frac;
  let h='<div class="gfb '+(ok?'ok':'bad')+'"><b>'+(ok?CHECK_SVG+esc(r.fin?'Rodada final certeira! XP em dobro':G.fbw||'Certo!'):(fr>0?'Quase: '+Math.round(fr*100)+'% certo':'Resposta certa')+'')+'</b>';
  if(!ok) h+='<p class="ansline">'+esc(arAnswerText(r))+'</p>';
  if(r.x) h+='<p>'+fmtText(r.x)+'</p>'; if(r.steps&&r.steps.length) h+='<ol class="steps">'+r.steps.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>';
  h+='</div>';
  const c=arAsChoice(r); h+=exBtn({subj:(SUBJ[AR_BY[G.gid].s]||{}).nome,q:c?c.q:r.q,opts:c?c.opts:null,right:c?c.right:null,pick:null,x:(r.x||'')+(ok?'':' Resposta: '+arAnswerText(r)),steps:r.steps});
  const n=G.mode==='niv'?G.max:G.rounds.length;
  h+='<button class="btn primary block nextbtn" data-a="arNext">'+(G.pos+1<n?'Próxima':'Ver resultado')+' <kbd>Enter</kbd></button>';
  return h;
}
function viewArenaEnd(G){
  const g=AR_BY[G.gid]; let h='';
  if(G.mode==='run'){ h+='<div class="gend arend">'+arStarsHTML(G.stars)+'<div class="gscore pop '+accCls(G.sc/G.rounds.length)+'">'+G.ok+'<small>/'+G.rounds.length+'</small></div><p>'+(G.stars>=2?'<b>Nível '+G.L+' concluído.</b>':G.stars===1?'Quase lá: 8 de 10 liberam o próximo nível.':'Revise as explicações e tente de novo. 8 de 10 liberam o próximo nível.')+'</p><p class="small muted">'+G.xp+' XP · maior combo: '+G.maxCombo+' · '+fmtSec(G.secs)+'</p></div>';
    if(G.unlocked) h+='<div class="unlockbox">'+ICO.up+'<div><b>Nível '+G.unlocked+' liberado</b><span>'+esc(AR_LV[G.unlocked-1].n)+': '+esc(g.lv[G.unlocked-1].d)+'</span></div></div>';
    if(G.mastered) h+='<div class="unlockbox gold">'+ICO.crown+'<div><b>Jogo dominado</b><span>Você venceu o nível de prova difícil deste tópico.</span></div></div>'; }
  else if(G.mode==='rel') h+='<div class="gend"><div class="gscore pop">'+G.score+'<small> pts</small></div><p>'+G.ok+' acertos em '+G.tot+' respostas.'+(G.isBest?' <b class="m4">Novo recorde!</b>':' Recorde: '+(arPeek(G.gid).rel||0)+' pts.')+'</p><p class="small muted">Acertos seguidos valem mais pontos.</p></div>';
  else if(G.mode==='niv') h+='<div class="gend"><div class="gscore pop">N'+G.place+'</div><p>Seu nível atual neste jogo é o <b>'+G.place+' ('+esc(AR_LV[G.place-1].n)+')</b>.'+(G.unlocked?' Os níveis até o '+G.place+' foram liberados.':'')+'</p></div>';
  else h+='<div class="gend"><div class="gscore pop '+accCls(G.sc/G.rounds.length)+'">'+G.ok+'<small>/'+G.rounds.length+'</small></div><p>'+G.xp+' XP.</p></div>';
  h+='<div class="mdelta"><span>Domínio em '+esc(topicInfo(g.t)?topicInfo(g.t).t.nome:'')+'</span><b>'+Math.round(G.m0*100)+'% → '+Math.round(G.m1*100)+'%</b></div>';
  if(G.wrong.length) h+='<h3 style="margin-top:18px">Para revisar</h3><p class="small muted">Os erros já foram para o caderno e voltam amanhã como questão.</p><ul class="list">'+G.wrong.map(i=>{ const r=G.rounds[i]; return r?'<li class="rev-li"><div>'+fmtText(r.q.length>240?r.q.slice(0,240)+'…':r.q)+'</div><div class="small m4">'+esc(arAnswerText(r))+'</div></li>':''; }).join('')+'</ul>';
  h+='<div class="stack" style="margin-top:14px">';
  if(G.mode==='run'&&G.unlocked) h+='<button class="btn primary block" data-a="arPlay" data-g="'+g.id+'" data-l="'+G.unlocked+'">Jogar o nível '+G.unlocked+'</button>';
  if(G.wrong.length&&G.mode!=='retry'&&G.mode!=='rel') h+='<button class="btn'+(G.unlocked?'':' primary')+' block" data-a="arRetry">Refazer só os erros</button>';
  h+='<button class="btn block" data-a="arAgain">Jogar de novo</button><button class="btn ghost block" data-a="arGame" data-g="'+g.id+'">Voltar ao jogo</button></div>';
  return h;
}
function viewArena(){ const v=tutor.arena.view; return v==='home'?viewArenaHome():v==='game'?viewArenaGame():v==='gen'?viewArenaGen():viewArenaRun(); }

/* ---------- ações ---------- */
const ARENA_A={
  arHome:b=>arOpenHome(b.dataset.s),
  arTab:b=>{ tutor.arena={view:'home',sid:b.dataset.s}; UI.arS=b.dataset.s; saveUI(); animNext(); render(); },
  arBack:()=>{ tutor.arena=null; animNext(); render(); window.scrollTo(0,0); },
  arGame:b=>arOpenGame(b.dataset.g),
  arPlay:b=>{ const u=arUnl(b.dataset.g), L=+b.dataset.l||u; if(L>u) return; arStart(b.dataset.g,L,'run'); },
  arRel:b=>arStart(b.dataset.g,arUnl(b.dataset.g),'rel'),
  arNiv:b=>arStart(b.dataset.g,3,'niv'),
  arIA:b=>arIA(b.dataset.g),
  arQuit:()=>{ const G=arCur(); if(G) arOpenGame(G.gid); },
  arAgain:()=>{ const G=arCur(); if(!G) return; arStart(G.gid,G.mode==='niv'?arUnl(G.gid):G.L,G.mode==='retry'||G.mode==='ia'?'run':G.mode); },
  arRetry:()=>{ const G=arCur(); if(!G) return; const rs=G.wrong.map(i=>Object.assign({},G.rounds[i],{fin:false,prep:false})); if(!rs.length) return; arStart(G.gid,G.L,'retry',rs); },
  arNext:()=>arNext(),
  arAns:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], j=+b.dataset.j; G.pick=j; arResolve(G,r,j===r.right); },
  arKey:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], k=b.dataset.k; let v=G.inpv||'';
    if(k==='OK'){ if(!v){ toast('Digite o resultado.'); return; } arResolve(G,r,arCheckNum(r,v)); return; }
    if(k==='⌫') v=v.slice(0,-1); else if(k==='−'){ v=v.startsWith('−')?v.slice(1):'−'+v; } else if(v.length<12){ if((k===','&&v.indexOf(',')>=0)||(k==='/'&&v.indexOf('/')>=0)) return; v+=k; }
    G.inpv=v; SND.tap(); const el=$('.numdisp'); if(el) el.innerHTML=v?esc(v)+(r.u?'<em>'+esc(r.u)+'</em>':''):'<span class="muted">digite o resultado</span>'+(r.u?'<em>'+esc(r.u)+'</em>':''); },
  arTok:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], j=+b.dataset.j; G.pick=j; const right=Array.isArray(r.right)?r.right:[r.k==='spot'?r.wrong:r.right]; arResolve(G,r,right.indexOf(j)>=0); },
  arOrd:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], rs=arRS(G), k=+b.dataset.k; rs.os=rs.os||0; rs.oe=rs.oe||0;
    if(k===rs.os){ rs.os++; rs.ob=null; SND.tap(); if(rs.os>=r.items.length){ const n=r.items.length, fr=Math.max(0,(n-rs.oe)/n); arResolve(G,r,rs.oe===0,fr); return; } render(); }
    else { rs.oe++; rs.ob=k; SND.bad(); buzz(30); render(); const seq=G.seq, pos=G.pos; setTimeout(()=>{ const g=arCur(); if(g&&g.seq===seq&&g.pos===pos&&g.rs&&g.rs.ob===k){ g.rs.ob=null; render(); } },600); } },
  arSortSel:b=>{ const G=arCur(); if(!G||G.ans) return; const rs=arRS(G); rs.sel=+b.dataset.i; SND.tap(); render(); },
  arSortBin:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], rs=arRS(G); if(rs.sel==null) return; rs.asg=rs.asg||r.items.map(()=>null); rs.asg[rs.sel]=+b.dataset.j; const nx=rs.asg.findIndex(x=>x==null); rs.sel=nx>=0?nx:null; SND.tap(); render(); },
  arSortOk:()=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], rs=arRS(G); if(!rs.asg||rs.asg.some(x=>x==null)) return; const good=r.items.filter((it,i)=>rs.asg[i]===it[1]).length; arResolve(G,r,good===r.items.length,good/r.items.length); },
  arML:b=>{ const G=arCur(); if(!G||G.ans) return; const rs=arRS(G); rs.ml=+b.dataset.i; rs.mb=null; SND.tap(); render(); },
  arMR:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], rs=arRS(G), i=+b.dataset.i; if(rs.ml==null){ toast('Toque primeiro num item da esquerda.'); return; } rs.md=rs.md||[]; rs.me=rs.me||0;
    if(i===rs.ml){ rs.md.push(i); rs.ml=null; SND.ok(); if(rs.md.length===r.pairs.length){ const fr=Math.max(0,(r.pairs.length-rs.me)/r.pairs.length); arResolve(G,r,rs.me===0,fr); return; } render(); }
    else { rs.me++; rs.mb=i; SND.bad(); render(); const seq=G.seq, pos=G.pos; setTimeout(()=>{ const g=arCur(); if(g&&g.seq===seq&&g.pos===pos&&g.rs&&g.rs.mb===i){ g.rs.mb=null; render(); } },600); } },
  arComma:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], rs=arRS(G); rs.cm=rs.cm||r.sl.map(()=>false); const i=+b.dataset.i; rs.cm[i]=!rs.cm[i]; SND.tap(); render(); },
  arCommaOk:()=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], rs=arRS(G), cm=rs.cm||r.sl.map(()=>false); let err=0, tot=0; r.sl.forEach((s,i)=>{ if(s==='opt') return; tot++; if((s==='must')!==cm[i]) err++; }); arResolve(G,r,err===0,tot?Math.max(0,(tot-err)/tot):0); },
  arMap:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], z=b.dataset.z; G.pick=z; arResolve(G,r,z===r.zone); },
  arPT:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], s=b.dataset.s; G.pick=s; arResolve(G,r,s===r.sym); },
  arBal:b=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], rs=arRS(G); rs.co=rs.co||r.co.map(()=>1); const i=+b.dataset.i; rs.co[i]=clamp(rs.co[i]+(+b.dataset.d),1,15); SND.tap(); render(); },
  arBalOk:()=>{ const G=arCur(); if(!G||G.ans) return; const r=G.rounds[G.pos], rs=arRS(G), co=rs.co||r.co.map(()=>1); const ok=co.every((v,i)=>v===r.co[i]); arResolve(G,r,ok,ok?1:co.filter((v,i)=>v===r.co[i]).length/co.length*0.5); },
  portPegaSheet:()=>sheetPortPega()
};
const ARENA_NOUNDO=Object.keys(ARENA_A);
/* teclado nas partidas da Arena */
function arKeydown(e,k,num){
  const G=arCur(); if(!G||G.done||UI.tab!=='tutor') return false; const r=G.rounds[G.pos]; if(!r) return false;
  if(G.ans){ if(k==='enter'&&G.mode!=='rel'){ arNext(); return true; } return false; }
  if((r.k==='choice'||r.k==='tf'||(r.k==='num'&&!r.inp))&&num>=0&&num<r.opts.length){ ARENA_A.arAns({dataset:{j:num}}); return true; }
  if(r.k==='num'&&r.inp){ const map={',':',','.':',','-':'−','/':'/','backspace':'⌫','enter':'OK'}; const key=/^[0-9]$/.test(k)?k:map[k]; if(key){ ARENA_A.arKey({dataset:{k:key}}); return true; } }
  return false;
}
