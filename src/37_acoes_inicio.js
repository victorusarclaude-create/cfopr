
/* ===================== FOLHAS (sheets) E RENDERIZAÇÃO =====================
   Texto digitado nunca some: antes de redesenhar, o app guarda o que está nos campos
   e devolve depois. Rascunhos longos (redação) também ficam salvos no aparelho. */
const SHEET={key:null,opener:null};
const DROP=new Set();
function captureInputs(root){ const o={}; if(!root) return o; root.querySelectorAll('input[id],textarea[id],select[id]').forEach(el=>{ if(el.type==='file'||el.type==='checkbox') return; o[el.id]={v:el.value,f:document.activeElement===el,s:el.selectionStart,e:el.selectionEnd}; }); return o; }
function restoreInputs(root,o){ if(!root||!o) return; Object.keys(o).forEach(id=>{ if(DROP.has(id)) return; const el=root.querySelector('#'+CSS.escape(id)); if(!el) return; const x=o[id]; if(el.value!==x.v&&el.tagName!=='SELECT') el.value=x.v; else if(el.tagName==='SELECT'&&[...el.options].some(op=>op.value===x.v)) el.value=x.v; if(x.f){ try{ el.focus({preventScroll:true}); if(x.s!=null&&el.setSelectionRange) el.setSelectionRange(x.s,x.e); }catch(e){} } }); }
function openSheet(html,opts){
  opts=opts||{};
  const sh=$('#sheet'), pn=$('#sheet .panel'), body=$('#sheetBody'), same=!!opts.key&&SHEET.key===opts.key&&!sh.hidden;
  const keep=same?captureInputs(body):null, top=same?pn.scrollTop:0;
  if(sh.hidden) SHEET.opener=document.activeElement;
  SHEET.key=opts.key||null;
  body.innerHTML='<div class="sheet-bar"><button class="sheet-close" data-a="closeSheet" aria-label="Fechar">'+ICO.x+'</button></div>'+html;
  sh.hidden=false; document.body.classList.add('sheet-open'); $('#fab').hidden=true;
  if(keep) restoreInputs(body,keep); DROP.clear();
  pn.scrollTop=top;
  mountCountUps(body);
  if(!same) setTimeout(()=>{ try{ const f=body.querySelector('.sheet-close'); if(f) f.focus({preventScroll:true}); }catch(e){} },40);
}
function closeSheetSilently(){
  const sh=$('#sheet'); if(sh.hidden) return;
  sh.hidden=true; $('#sheetBody').innerHTML=''; SHEET.key=null; UI.conv=null; UI.topicOpen=null; document.body.classList.remove('sheet-open');
}
function closeSheet(){
  const op=SHEET.opener; closeSheetSilently(); render();
  if(op&&document.body.contains(op)) try{ op.focus({preventScroll:true}); }catch(e){}
}
let toastT=null;
function toast(m){ const el=$('#toast'); el.textContent=m; el.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),3200); }
const TABS=[['hoje','Hoje',svgI('<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',1.9)],['tutor','Treino',svgI('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',1.9)],['erros','Erros',svgI('<path d="M5 4h11l3 3v13H5z"/><path d="M9 11l6 6M15 11l-6 6"/>',1.9)],['redacao','Redação',svgI('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',1.9)],['mapa','Painel',svgI('<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',1.9)]];
let lastTab=null;
function renderTabs(){
  const due=rfDue().length, fd=totalFlashDue();
  $('#tabsIn').innerHTML=TABS.map(([id,nm,ic])=>'<button data-a="tab" data-v="'+id+'"'+(UI.tab===id?' aria-current="page"':'')+'>'+ic+'<span>'+nm+'</span>'+(id==='erros'&&due?'<span class="dot">'+due+'</span>':'')+(id==='tutor'&&fd?'<span class="dot">'+(fd>99?'99+':fd)+'</span>':'')+'</button>').join('');
  if(UI.tab!==lastTab){ lastTab=UI.tab; const svg=$('#tabsIn button[aria-current="page"] svg'); if(svg) svg.classList.add('navdraw'); }
}
function focusSig(){ const a=document.activeElement; if(!a||!$('#app').contains(a)||!a.dataset||!a.dataset.a) return null; return Object.keys(a.dataset).sort().map(k=>k+'='+a.dataset[k]).join('&'); }
function restoreFocus(sig,had){
  if(!had) return;
  const app=$('#app'); let el=null;
  if(sig) el=[...app.querySelectorAll('[data-a]')].find(x=>!x.disabled&&Object.keys(x.dataset).sort().map(k=>k+'='+x.dataset[k]).join('&')===sig);
  if(!el) el=app.querySelector('.nextbtn')||app.querySelector('.fc-front')||app.querySelector('.alt:not([disabled])')||app.querySelector('h1');
  if(el){ if(el.tagName==='H1') el.setAttribute('tabindex','-1'); try{ el.focus({preventScroll:true}); }catch(e){} }
}
let pendingRender=false;
function render(){
  const app=$('#app'), keep=captureInputs(app), had=app.contains(document.activeElement), sig=focusSig();
  const v={hoje:viewHoje,mapa:viewMapa,erros:viewErros,redacao:viewRedacao,tutor:viewTutor}[UI.tab]||viewHoje;
  let html;
  try{ html=v(); }catch(e){ console.error(e); html=pageHead('Ops')+'<p class="badbox">Algo deu errado nesta tela. Seus dados estão salvos.</p><button class="btn primary" data-a="panic">Voltar ao início</button>'; }
  app.innerHTML=html; restoreInputs(app,keep); DROP.clear();
  renderTabs(); mountCountUps(app); drawGTBar(); restoreFocus(sig,had);
  const G=tutor.game; $('#fab').hidden=!$('#sheet').hidden||(G&&G.mode==='relampago'&&!G.done);
  pendingRender=false;
}
function afterRemote(){ if(!$('#sheet').hidden||FX.busy()){ pendingRender=true; return; } render(); }
function afterAction(){
  let ch=false;
  try{ if(checkMissions()) ch=true; }catch(e){ console.error(e); }
  try{ if(checkAch(false)) ch=true; }catch(e){}
  try{ const P=patente(); if(S.patIdx==null||P.idx<S.patIdx){ S.patIdx=P.idx; ch=true; } else if(P.idx>S.patIdx){ S.patIdx=P.idx; ch=true; FX.celebrate('patente',{idx:P.idx,m:P.m}); } }catch(e){}
  try{ const k=today(); if(S.stkDay!==k&&dayActive(k)){ S.stkDay=k; ch=true; const n=streak(); if(n>=2) FX.celebrate('streak',{n}); } }catch(e){}
  if(ch) commit();
}

/* ===================== AÇÕES ===================== */
const UNDO=new Set(['saveLog','setRung','rename','delTopic','saveTopic','saveErro','delErro','delCard','saveCard','saveNota','saveCorr','resetAll','doRestore','folga','aiCardsAdd','gCards','simCards','saveSettings','cfGoal']);
const val=id=>{ const el=$('#'+id); return el?el.value:''; };
const A={
  /* navegação */
  tab:b=>{ pauseQuizTimer(); UI.tab=b.dataset.v; saveUI(); closeSheetSilently(); render(); window.scrollTo(0,0); const a=$('#app'); a.classList.remove('enter'); void a.offsetWidth; a.classList.add('enter'); },
  closeSheet:()=>closeSheet(),
  celClose:()=>{ FX.close(); if(pendingRender&&$('#sheet').hidden) render(); },
  panic:()=>{ clearModes(); tutor.rf=null; UI.tab='hoje'; saveUI(); render(); },
  undo:()=>{ if(!undoStack.length) return; SND.tap(); const last=undoStack.pop(); try{ replaceState(migrate(JSON.parse(last))); commit(); }catch(e){} closeSheetSilently(); render(); toast('Ação desfeita.'); },
  sndToggle:()=>{ const v=SET.vol<=0?0.8:(SET.vol>=0.6?0.4:0); SND.setVol(v); if(v>0){ SND.unlock(); SND.ok(); } render(); toast(v<=0?'Som desligado.':(v<0.6?'Som baixo.':'Som normal.')); },
  /* hoje */
  gtToggle:()=>{ if(GT.start!=null){ GT.acc+=(Date.now()-GT.start)/1000; GT.start=null; SND.tap(); } else { GT.start=Date.now(); SND.start(); } gtSave(); render(); },
  gtMode:b=>{ if(gtState()!=='idle') return; GT.mode=b.dataset.v; GT.phase='focus'; gtSave(); render(); },
  gtStartFocus:()=>{ if(gtState()==='idle'){ if(GT.mode==='livre') GT.mode='pomo'; GT.phase='focus'; GT.start=Date.now(); GT.acc=0; gtSave(); SND.start(); } UI.tab='hoje'; saveUI(); closeSheetSilently(); render(); window.scrollTo(0,0); },
  gtStop:()=>{ const secs=gtElapsed(), mins=Math.round(secs/60), brk=GT.phase==='break';
    GT.start=null; GT.acc=0; GT.phase='focus'; gtSave();
    if(brk){ render(); return; }
    if(mins>=180){ openSheet('<h2 id="sheetTitle">Sessão longa</h2><p>O cronômetro marcou <b>'+fmtMin(mins)+'</b>. Se ele ficou ligado sem você estudar, ajuste o tempo real:</p><label class="f" for="gtMin">Minutos estudados</label><input id="gtMin" type="number" inputmode="numeric" min="0" max="900" value="'+mins+'"><div class="row" style="margin-top:12px"><button class="btn primary block" data-a="gtConfirm">Registrar</button></div>'); return; }
    if(mins>=1){ gtRegister(mins); toast(fmtMin(mins)+' registrados. +'+mins+' XP'); SND.ok(); } else toast('Parado antes de 1 minuto. Nada registrado.');
    afterAction(); render(); },
  gtConfirm:()=>{ const m=clamp(parseInt(val('gtMin'),10)||0,0,900); if(m>0){ gtRegister(m); toast(fmtMin(m)+' registrados.'); } closeSheet(); afterAction(); },
  misQuiz:()=>{ const tid=pick(); if(tid&&!sampleOff) gerarQuiz(tid,Math.min(T(tid).rung,2)); else { const qs=buildOffline('fraq',null,10); if(qs.length>=3) startSim(qs,'Simulado rápido','off'); } },
  calOpen:()=>{ const t=dateOf(today()); sheetCalendar(t.getFullYear(),t.getMonth()); },
  calNav:b=>{ let y=+b.dataset.y,m=+b.dataset.m; if(m<0){m=11;y--;} if(m>11){m=0;y++;} sheetCalendar(y,m); },
  folga:()=>{ if(folgaUsed()) return; Dm(today()).folga=true; commit(); SND.ok(); toast('Folga marcada. A sequência está protegida.'); const t=dateOf(today()); sheetCalendar(t.getFullYear(),t.getMonth()); },
  rankOpen:()=>sheetRank(),
  metOpen:()=>sheetMetrics(),
  metRange:b=>{ UI.metRange=+b.dataset.n; saveUI(); sheetMetrics(); },
  /* tópicos e registro */
  topic:b=>sheetTopic(b.dataset.t),
  log:b=>sheetLog(b.dataset.t),
  saveLog:()=>{ const tid=val('lgT'), f=parseInt(val('lgF'),10), a=parseInt(val('lgA')||'0',10);
    if(!(f>=1)){ toast('Informe quantas questões fez.'); return; }
    if(!(a>=0&&a<=f)){ toast('Acertos precisa ficar entre 0 e '+f+'.'); return; }
    const m=applyLog(tid,f,a); gainXP(f*3+a); commit(); closeSheet(); toast(m); SND.ok(); },
  setRung:b=>{ const st=Tm(b.dataset.t); st.rung=+b.dataset.v; st.f=0; st.a=0; st.flag=null; commit(); sheetTopic(b.dataset.t); },
  rename:b=>{ const info=topicInfo(b.dataset.t), v=val('rnT').trim(); if(info&&v){ info.t.nome=v; commit(); toast('Nome salvo.'); sheetTopic(b.dataset.t); } },
  delTopic:b=>{ const info=topicInfo(b.dataset.t); if(!info) return; if(!b.dataset.sure){ b.dataset.sure='1'; b.textContent='Toque de novo para remover'; return; }
    S.topicList[info.s.id]=S.topicList[info.s.id].filter(t=>t.id!==b.dataset.t); delete S.topics[b.dataset.t]; commit(); closeSheet(); toast('Tópico removido.'); },
  addTopic:b=>{ const s=SUBJ[b.dataset.s]; openSheet('<h2 id="sheetTitle">Novo tópico</h2><p class="muted">'+esc(s.nome)+'</p><label class="f" for="ntN">Nome</label><input id="ntN" placeholder="Como aparece no edital"><div class="row" style="margin-top:14px"><button class="btn primary block" data-a="saveTopic" data-s="'+s.id+'">Adicionar</button></div>'); },
  saveTopic:b=>{ const v=val('ntN').trim(); if(!v){ toast('Dê um nome ao tópico.'); return; } S.topicList[b.dataset.s].push({id:b.dataset.s+'-'+uid(),nome:v,base:false}); commit(); closeSheet(); toast('Tópico adicionado.'); },
  subjOpen:b=>sheetSubj(b.dataset.s),
  howCalc:()=>sheetHow(),
  achOpen:()=>sheetAch(),
  biblio:()=>sheetBiblio(),
  aula:b=>{ const tid=b.dataset.t, info=topicInfo(tid); if(!info) return; const d=$('#ai-aula-'+tid); if(d) d.closest('details').open=true;
    aiRun('aula-'+tid,promptAula(info),{done:t=>{ S.notes[tid]={t,at:Date.now()}; gainXP(5); commit(); }}); },
  aprender:()=>sheetTopic(val('azT'),'aula'),
  /* treino: hub */
  hubGames:()=>arOpenHome(),
  hubFlash:()=>sheetFlashList(),
  hubNivel:()=>sheetNivel(),
  hubAprender:()=>sheetAprenderZero(),
  hubDestravar:()=>{ UI.qImg=null; sheetDestravar(); },
  relSheet:()=>sheetModes('relampago'),
  bossSheet:()=>sheetModes('boss'),
  relOpenS:b=>openSpecial('relampago',b.dataset.s),
  bossOpen:b=>openSpecial('boss',b.dataset.s),
  specialAgain:()=>{ const G=tutor.game; if(G) openSpecial(G.mode,G.sid); },
  /* jogos */
  gOpen:b=>openGame(b.dataset.id),
  gPick:b=>gAnswer(+b.dataset.j),
  gOrd:b=>gOrder(+b.dataset.k),
  gNext:()=>gNext(),
  gClose:()=>{ const G=tutor.game; if(G&&!G.done&&G.tot>0&&G.mode!=='relampago') gFinish(G); tutor.game=null; render(); window.scrollTo(0,0); },
  gAgain:()=>{ const G=tutor.game; if(G) openGame(G.defId); },
  gHard:()=>{ const G=tutor.game; if(G) openGame(G.defId,{lives:3}); },
  gRetry:()=>{ const G=tutor.game; if(!G) return; const def=GAME_BY_ID[G.defId]; const rs=G.wrong.map(i=>{ const r=G.rounds[i]; return r.i!=null&&def.items?buildRound(def,r.i):Object.assign({},r); }); openGame(G.defId,{rounds:rs,retry:true}); },
  gCards:()=>{ const G=tutor.game; if(!G||G.cards) return; const def=GAME_BY_ID[G.defId]||{};
    const n=errsToCards(G.wrong.map(i=>{ const r=G.rounds[i]; const f=(def.type==='classify'||def.type==='pick'?def.title+': ':'')+stripQ(r.q); return {t:r.t,f,b:r.ord?r.steps.join(' → '):r.opts[r.right]+(r.x?' ('+stripQ(r.x)+')':'')}; }));
    G.cards=true; toast(n+(n===1?' flashcard criado.':' flashcards criados.')); render(); },
  spotOpen:b=>openSpot(b.dataset.id),
  spotTap:b=>{ const G=tutor.spot; if(!G||G.pick!=null) return; const def=SPOT_BY_ID[G.id], it=def.items[G.items[G.pos]], j=+b.dataset.j, ok=j===it.wrong; G.pick=j; G.tot++;
    if(ok){ G.ok++; G.combo++; const xp=10+2*Math.min(G.combo-1,5); G.xp+=xp; gainXP(xp); G.combo>=2?SND.combo(G.combo):SND.ok(); } else { G.combo=0; G.wrong.push(G.pos); SND.bad(); gainXP(2); errFromQ({t:def.t,q:'Caça ao erro: '+it.parts.join(' '),x:(it.wrong===-1?'A frase está correta. ':'O erro está em "'+it.parts[it.wrong]+'"; o correto é "'+it.fix+'". ')+(it.x||''),src:'game'}); }
    G.maxCombo=Math.max(G.maxCombo,G.combo); addEv(def.t,'game',1,ok?1:0); commit(); render(); },
  spotNext:()=>{ const G=tutor.spot; if(!G) return; G.pos++; G.pick=null; if(G.pos>=G.items.length){ G.done=true; SND.level(); const d=Dm(today()); d.gcount=(d.gcount||0)+1; commit(); afterAction(); } render(); window.scrollTo(0,0); },
  spotAgain:()=>{ const G=tutor.spot; if(G) openSpot(G.id); },
  spotClose:()=>{ tutor.spot=null; render(); },
  ptOpen:()=>openPTable(),
  ptPick:b=>{ const G=tutor.ptab; if(!G||G.good) return; const sym=b.dataset.sym, clue=PT_CLUES[G.order[G.pos]]; G.tries++;
    if(sym===clue.sym){ const first=G.bad==null||G.firstTry!==false; SND.ok(); if(G.firstTry!==false){ G.ok++; gainXP(8); } G.good=sym; G.bad=null; addEv('qui-atom','game',1,G.firstTry!==false?1:0); commit(); render();
      const seq=G.seq; setTimeout(()=>{ const g=tutor.ptab; if(g&&g.seq===seq){ g.pos++; g.good=null; g.firstTry=true; if(g.pos>=g.order.length){ g.done=true; SND.level(); afterAction(); } render(); } },450); }
    else { SND.bad(); G.errs++; G.bad=sym; G.firstTry=false; render(); const seq=G.seq; setTimeout(()=>{ const g=tutor.ptab; if(g&&g.seq===seq){ g.bad=null; render(); } },500); } },
  ptClose:()=>{ tutor.ptab=null; render(); },
  tlOpen:()=>openTimeline(),
  tlTap:b=>{ const L=tutor.tl; if(!L||L.done) return; const e=L.evs[+b.dataset.i]; if(!e) return;
    if(e===L.order[L.n]){ L.n++; L.bad=null; SND.ok(); gainXP(6); addEv('hist-emanc','game',1,1);
      if(L.n===L.order.length){ L.done=true; L.secs=Math.max(1,Math.round((Date.now()-L.start)/1000)); const g=S.games.timeline; L.isBest=!g||L.errs<g.errs||(L.errs===g.errs&&L.secs<g.secs); if(L.isBest) S.games.timeline={errs:L.errs,secs:L.secs}; SND.level(); }
      commit(); render(); }
    else { L.errs++; L.bad=e; SND.bad(); addEv('hist-emanc','game',1,0); commit(); render(); const seq=L.seq; setTimeout(()=>{ const l=tutor.tl; if(l&&l.seq===seq&&l.bad===e){ l.bad=null; render(); } },700); } },
  closeTl:()=>{ tutor.tl=null; render(); },
  mapOpen:()=>openMapGame(),
  mapTap:b=>{ const M=tutor.map; if(!M||M.good) return; const zone=b.dataset.zone, cur=CICLOMAPA[M.order[M.pos]]; M.tries++;
    if(zone===cur.zone){ M.wrong=null; M.good=zone; SND.ok(); gainXP(6); addEv('hist-ciclos','game',1,1); commit(); render(); const seq=M.seq; setTimeout(()=>{ const m=tutor.map; if(m&&m.seq===seq){ m.pos++; m.good=null; if(m.pos>=m.order.length) SND.level(); render(); } },500); }
    else { M.errs++; M.wrong=zone; SND.bad(); addEv('hist-ciclos','game',1,0); commit(); render(); const seq=M.seq; setTimeout(()=>{ const m=tutor.map; if(m&&m.seq===seq){ m.wrong=null; render(); } },500); } },
  closeMapGame:()=>{ tutor.map=null; render(); },
  matchOpen:b=>openMatch(b.dataset.t),
  matchTap:b=>{ const M=tutor.match; if(!M||M.done) return; const i=+b.dataset.i;
    if(M.sel.length>=2||M.sel.includes(i)||M.solved.includes(M.tiles[i].pair)) return;
    M.sel.push(i); if(M.sel.length<2){ SND.tap(); render(); return; }
    M.tries++; const x=M.tiles[M.sel[0]], y=M.tiles[M.sel[1]], ok=x.pair===y.pair;
    addEv(M.t,'card',1,ok?1:0);
    if(ok){ SND.ok(); gainXP(4); M.solved.push(x.pair); M.sel=[];
      if(M.solved.length*2===M.tiles.length){ SND.level(); M.done=true; M.secs=Math.max(1,Math.round((Date.now()-M.start)/1000)); const g=S.games[M.t]||(S.games[M.t]={}); M.isBest=!g.best||M.secs<g.best.secs||(M.secs===g.best.secs&&M.tries<g.best.tries); if(M.isBest) g.best={secs:M.secs,tries:M.tries}; afterAction(); }
      commit(); render(); }
    else { SND.bad(); commit(); render(); const seq=M.seq; setTimeout(()=>{ const m=tutor.match; if(m&&m.seq===seq){ m.sel=[]; render(); } },700); } },
  closeMatch:()=>{ tutor.match=null; render(); },
  relOpen:b=>openRel(b.dataset.t),
  relAns:b=>{ const R=tutor.rel; if(!R||R.over||R.fb!=null) return; const j=+b.dataset.j, ok=j===R.q.right; R.total++; R.fb=j;
    if(ok){ R.combo++; R.hits++; R.score+=1+Math.min(R.combo-1,4); SND.combo(R.combo); gainXP(3); } else { R.combo=0; SND.bad(); }
    addEv(R.t,'card',1,ok?1:0); commit(); render(); const seq=R.seq; setTimeout(()=>{ const r=tutor.rel; if(r&&r.seq===seq&&!r.over){ r.fb=null; r.q=relQuestion(r.t,r.q); render(); } },ok?350:1000); },
  closeRel:()=>{ tutor.rel=null; render(); },
  /* flashcards */
  smartOpen:()=>openSmart(),
  flashOpen:b=>openFlash(b.dataset.t),
  flashFlip:()=>{ const F=tutor.flash; if(F&&!F.revealed){ F.revealed=true; SND.flip(); render(); } },
  flashGrade:b=>flashGrade(+b.dataset.g),
  flashAgain:()=>{ const F=tutor.flash; if(F&&F.smart) openSmart(); else if(F) openFlash(F.t); },
  closeFlash:()=>{ tutor.flash=null; render(); },
  deckOpen:b=>sheetDeck(b.dataset.t),
  delCard:b=>{ if(!b.dataset.sure){ b.dataset.sure='1'; b.textContent='Toque de novo'; return; } const t=b.dataset.t, deck=S.flashcards[t]||[], c=deck.find(x=>x.id===b.dataset.id); if(!c) return;
    S.flashcards[t]=deck.filter(x=>x!==c); if(!c.custom){ const del=S.cardDel[t]||(S.cardDel[t]=[]); if(!del.includes(c.f)) del.push(c.f); } commit(); sheetDeck(t); },
  newCard:b=>sheetCardForm(b.dataset.t),
  cardEdit:b=>sheetCardForm(b.dataset.t,b.dataset.id),
  saveCard:b=>{ const f=val('ncF').trim(), bk=val('ncB').trim(); if(!f||!bk){ toast('Preencha frente e verso.'); return; }
    if(b.dataset.id){ const c=cardById(b.dataset.t,b.dataset.id); if(c){ c.f=f; c.b=bk; c.m=val('ncM').trim()||undefined; c.custom=true; } commit(); closeSheet(); toast('Cartão salvo.'); return; }
    const t=val('ncT'); (S.flashcards[t]||(S.flashcards[t]=[])).push(newCard(f,bk,{custom:true})); commit(); DROP.add('ncF'); DROP.add('ncB'); $('#ncF').value=''; $('#ncB').value=''; try{ $('#ncF').focus(); }catch(e){} toast('Cartão salvo.'); SND.ok(); },
  cardMacete:async b=>{ const t=b.dataset.t, c=cardById(t,b.dataset.id); if(!c) return; const s=await getSample(); const pr=promptMacete(c,topicInfo(t)); if(!s){ sheetCopy('Copiar pedido de macete',pr); return; }
    b.disabled=true; b.textContent='Criando macete…';
    try{ const r=await s(pr,{modelTier:'quick',cache:false}); c.m=r.text.trim().slice(0,300); commit(); gainXP(2); SND.ok(); }catch(e){ toast(sampleMsg(e)||'Não deu certo.'); }
    render(); },
  exCard:b=>{ const c=cardById(b.dataset.t,b.dataset.id), inf=topicInfo(b.dataset.t); if(!c) return; openExplain({subj:inf?inf.s.nome:'',q:'Flashcard: '+c.f,x:'Resposta do cartão: '+c.b}); },
  aiCards:b=>{ tutor.aic=null; sheetAICards(b.dataset.t); },
  aiCardsGen:async()=>{ const t=val('acT'), foco=val('acF').trim(), n=+val('acN'), info=topicInfo(t); if(!info) return;
    const prompt=promptCards(info,foco,n), s=await getSample();
    if(!s){ sheetCopy('Copiar pedido de flashcards',prompt); return; }
    const R={t,foco,n,busy:true}; tutor.aic=R; sheetAICards(t);
    try{ const d=await s.json(prompt,{cache:false}); const cards=(d&&Array.isArray(d.cards)?d.cards:[]).filter(c=>c&&c.frente&&c.verso).slice(0,n).map(c=>({f:String(c.frente),b:String(c.verso),on:true})); if(!cards.length) throw {code:'invalid_json'}; tutor.aic={t,foco,n,cards}; }
    catch(e){ tutor.aic={t,foco,n,err:sampleMsg(e)||'Não deu certo. Tente de novo.'}; }
    if(SHEET.key==='aicards') sheetAICards(t); },
  aiCardsAdd:()=>{ const R=tutor.aic; if(!R||!R.cards) return; const sel=R.cards.filter(c=>c.on!==false); const deck=S.flashcards[R.t]||(S.flashcards[R.t]=[]);
    sel.forEach(c=>{ if(!deck.some(x=>x.f===c.f)) deck.push(newCard(c.f,c.b,{custom:true,ai:true})); }); commit(); const t=R.t; tutor.aic=null; toast(sel.length+' cartões adicionados.'); SND.ok(); sheetDeck(t); },
  /* treino com IA */
  gerar:()=>{ const tid=val('gqT'), n=+val('gqN')||0, foco=val('gqF').trim(); gerarQuiz(tid,n,{foco}); },
  gerarDe:b=>{ const tid=b.dataset.t; gerarQuiz(tid,Math.min(T(tid).rung,2)); },
  quizGenCancel:()=>{ const G=tutor.quizGen; if(G&&G.ctl) try{ G.ctl.abort(); }catch(e){} tutor.quizGen=null; render(); },
  quizRetry:()=>{ const G=tutor.quizGen; if(!G) return; tutor.quizGen=null; gerarQuiz(G.tid,G.n,G.opts); },
  quizLocal:()=>{ const G=tutor.quizGen; if(!G) return; const qs=localQuiz(G.tid,G.n); tutor.quizGen=null; if(qs) startQuiz(G.tid,G.n,qs,'banco'); else render(); },
  quizBank:b=>{ const tid=b.dataset.t, qs=localQuiz(tid,T(tid).rung); if(qs) startQuiz(tid,Math.min(T(tid).rung,2),qs,'banco'); },
  ans:b=>{ const Q=tutor.quiz; if(!Q) return; const i=+b.dataset.q; if(Q.ans[i]!=null) return;
    if(Q.running&&Q.running.idx===i){ Q.time[i]=Math.round((Q.time[i]||0)+(Date.now()-Q.running.start)/1000); Q.running=null; }
    const j=+b.dataset.j, q=Q.qs[i], ok=j===q.correta; Q.ans[i]=j;
    const d=Dm(today()); d.q=(d.q||0)+1; if(ok) d.a=(d.a||0)+1;
    addEv(Q.t,'q',1,ok?1:0,Q.n);
    if(ok){ SND.ok(); gainXP(12); } else { SND.bad(); gainXP(3); errFromQ({t:Q.t,q:q.enunciado,opts:q.alternativas,right:q.correta,x:q.explicacao,src:'q',tempo:Q.time[i]||null}); }
    commit(); const y=window.scrollY; render(); window.scrollTo(0,y); },
  qTimerToggle:b=>{ const Q=tutor.quiz; if(!Q) return; const i=+b.dataset.i; if(Q.running&&Q.running.idx===i){ pauseQuizTimer(); } else { pauseQuizTimer(); Q.running={idx:i,start:Date.now()}; } render(); },
  quizLog:()=>{ const Q=tutor.quiz; if(!Q||Q.logged) return; const ok=Q.qs.filter((q,i)=>Q.ans[i]===q.correta).length; Q.logged=true; toast(applyLog(Q.t,Q.qs.length,ok,Q.n,true)); commit(); render(); },
  gerarMais:()=>{ const Q=tutor.quiz; if(Q) gerarQuiz(Q.t,Q.n); },
  gerarErros:()=>{ const Q=tutor.quiz; if(!Q) return; const er=Q.qs.filter((q,i)=>Q.ans[i]!==q.correta).map(q=>'- '+q.enunciado.slice(0,200)).join('\n'); gerarQuiz(Q.t,Q.n,{erros:er}); },
  closeQuiz:()=>{ tutor.quiz=null; render(); },
  /* simulado */
  simOpen:()=>{ tutor.simGen=null; sheetSim(); },
  simStart:()=>{ const k=val('smK'), mv=val('smM'), n=+val('smN'); const sid=mv.startsWith('s:')?mv.slice(2):null, mode=sid?'geral':mv;
    if(k==='ia'){ runAISim(mode,sid,n); return; }
    const qs=buildOffline(mode,sid,n); if(qs.length<3){ toast('Poucas questões no banco para esse filtro.'); return; }
    startSim(qs,sid?'Simulado: '+SUBJ[sid].nome:'Simulado rápido','off'); },
  simSubj:b=>{ const qs=buildOffline('geral',b.dataset.s,10); if(qs.length<3){ toast('Poucas questões no banco desta matéria.'); return; } startSim(qs,'Simulado: '+SUBJ[b.dataset.s].nome,'off'); },
  simGenCancel:()=>{ const G=tutor.simGen; if(G&&G.ctl) try{ G.ctl.abort(); }catch(e){} tutor.simGen=null; render(); },
  simAns:b=>{ const M=tutor.sim; if(!M||M.done) return; M.ans[M.pos]=+b.dataset.j; SND.tap(); render(); },
  simGo:b=>{ const M=tutor.sim; if(!M) return; simLeave(); M.pos=+b.dataset.i; M.qStart=Date.now(); render(); },
  simPrev:()=>{ const M=tutor.sim; if(!M||M.pos===0) return; simLeave(); M.pos--; M.qStart=Date.now(); render(); window.scrollTo(0,0); },
  simNext:()=>{ const M=tutor.sim; if(!M||M.pos+1>=M.qs.length) return; simLeave(); M.pos++; M.qStart=Date.now(); render(); window.scrollTo(0,0); },
  simMark:()=>{ const M=tutor.sim; if(!M) return; M.mark[M.pos]=!M.mark[M.pos]; render(); },
  simGuess:()=>{ const M=tutor.sim; if(!M) return; M.guess[M.pos]=!M.guess[M.pos]; render(); },
  simEnd:b=>{ const M=tutor.sim; if(!M||M.done) return; const blank=M.ans.filter(x=>x==null).length;
    if(blank&&!b.dataset.sure){ b.dataset.sure='1'; b.textContent=blank+' em branco. Toque de novo para entregar'; return; }
    simFinish(); render(); window.scrollTo(0,0); },
  simQuit:b=>{ const M=tutor.sim; if(M&&!M.done&&b&&!b.dataset.sure&&M.ans.some(x=>x!=null)){ b.dataset.sure='1'; toast('Toque de novo para abandonar o simulado.'); return; } tutor.sim=null; render(); window.scrollTo(0,0); },
  simNew:()=>{ tutor.sim=null; render(); sheetSim(); },
  simCards:()=>{ const M=tutor.sim; if(!M||M.cards) return; const n=errsToCards(M.qs.map((r,i)=>M.ans[i]!==r.right?{t:r.t,f:stripQ(r.q),b:r.opts[r.right]+(r.x?' ('+stripQ(r.x)+')':'')}:null).filter(Boolean)); M.cards=true; toast(n+' flashcards criados.'); render(); },
  /* teste 80/20 */
  t80List:()=>sheetTeste80(),
  t80Open:b=>openTeste80(b.dataset.t),
  t80Ans:b=>{ const M=tutor.t80; if(!M||M.done) return; M.ans[+b.dataset.i]=+b.dataset.j; SND.tap(); render(); },
  t80Finish:()=>{ finishTeste80(); render(); window.scrollTo(0,0); },
  closeT80:()=>{ tutor.t80=null; render(); },
  /* caderno de erros */
  addErro:b=>sheetErroForm(b.dataset.t),
  tipo:b=>{ $$('#erTipo .chip').forEach(c=>c.setAttribute('aria-pressed',String(c===b))); },
  saveErro:()=>{ const e=val('erE').trim(); if(!e){ toast('Descreva o erro.'); return; }
    const tp=$('#erTipo .chip[aria-pressed="true"]'); S.erros.push({id:uid(),t:val('erT'),errei:e,regra:val('erR').trim(),tipo:tp?tp.dataset.v:'Conteúdo',criado:today(),prox:addDays(today(),1),etapa:0,done:false,n:1});
    gainXP(5); commit(); closeSheet(); toast('Erro anotado. Ele volta amanhã.'); },
  delErro:b=>{ if(!b.dataset.sure){ b.dataset.sure='1'; b.textContent='Toque de novo para apagar'; return; } S.erros=S.erros.filter(x=>x.id!==b.dataset.id); commit(); render(); },
  errAll:()=>{ UI.errAll=true; render(); },
  rfStart:()=>rfStart(rfDue(),'Erros de hoje'),
  rfAll:()=>rfStart(S.erros.filter(e=>!e.done).sort((a,b)=>(b.n||1)-(a.n||1)),'Todos os erros ativos'),
  rfSubj:b=>rfStart(S.erros.filter(e=>!e.done&&topicInfo(e.t)&&topicInfo(e.t).s.id===b.dataset.s),'Erros de '+SUBJ[b.dataset.s].nome),
  rfOne:b=>{ const e=S.erros.find(x=>x.id===b.dataset.id); if(e) rfStart([e],'Refazendo um erro'); },
  rfPick:b=>{ const R=tutor.rf; if(!R||R.pick!=null) return; const e=S.erros.find(x=>x.id===R.list[R.pos]); R.pick=+b.dataset.j; const ord=e&&R.ord[e.id]; const ok=ord&&R.pick===ord.indexOf(e.right); (ok?SND.ok:SND.bad)(); render(); },
  rfShow:()=>{ const R=tutor.rf; if(R){ R.shown=true; SND.flip(); render(); } },
  rfGrade:b=>{ const R=tutor.rf; if(!R) return; const e=S.erros.find(x=>x.id===R.list[R.pos]); if(!e) return;
    const g=+b.dataset.g, k=today(), d=Dm(k); d.rf=(d.rf||0)+1; d.er=(d.er||0)+1; if(g>0) d.rfok=(d.rfok||0)+1;
    if(g===2){ e.etapa=(e.etapa||0)+1; if(e.etapa>=INT.length){ e.done=true; R.res.cons++; SND.level(); gainXP(20); toast('Erro consolidado. Virou acerto fácil.'); } else { e.prox=addDays(k,INT[e.etapa]); SND.ok(); } R.res.easy++; gainXP(10); }
    else if(g===1){ const ix=Math.min(e.etapa||0,INT.length-1); e.prox=addDays(k,Math.max(1,Math.round(INT[ix]/2))); R.res.hard++; SND.tap(); gainXP(6); }
    else { e.etapa=0; e.prox=addDays(k,1); e.n=(e.n||1)+1; if(b.dataset.f) e.tipo='Conteúdo'; R.res.miss++; SND.bad(); gainXP(3); }
    e.last=k;
    const src={game:'game',sim:'sim',t80:'teste80',q:'q'}[e.src]||'card'; addEv(e.t,src,1,g>0?1:0,src==='q'?T(e.t).rung:undefined);
    R.pos++; R.pick=null; R.shown=false; if(R.pos>=R.list.length){ R.done=true; SND.level(); }
    commit(); render(); window.scrollTo(0,0); },
  rfClose:()=>{ tutor.rf=null; render(); window.scrollTo(0,0); },
  exErr:b=>{ const e=S.erros.find(x=>x.id===b.dataset.id); if(!e) return; const inf=topicInfo(e.t); openExplain({subj:inf?inf.s.nome:'',q:e.q||e.errei,opts:e.opts,right:e.right,pick:null,x:e.x||e.regra,steps:e.steps}); },
  /* redação */
  sortear:()=>{ let t; do{ t=TEMAS[Math.floor(Math.random()*TEMAS.length)]; }while(t===UI.tema&&TEMAS.length>1); UI.tema=t; delete AIR.plano; saveUI(); SND.tap(); render(); },
  planoRed:()=>{ if(!UI.tema) return; const el=$('#ai-plano'); if(el) el.hidden=false; aiRun('plano',promptPlanoRedacao(UI.tema)); },
  corrigir:()=>{ tutor.rdResult=null; tutor.rdErr=''; drawCorrigir(); },
  runCorrigir:async()=>{ const tema=val('rcT').trim(), txt=val('rcX').trim();
    if(txt.split(/\s+/).length<60){ toast('Texto curto demais para corrigir (mínimo de 60 palavras).'); return; }
    const s=await getSample(); const prompt=promptRedacao(tema||'(tema não informado)',txt);
    if(!s){ sheetCopy('Copiar pedido de correção',prompt.replace('Responda somente com JSON:','Formato de referência da resposta:')); return; }
    tutor.rdBusy=true; tutor.rdErr=''; drawCorrigir();
    try{ const d=await s.json(prompt,{cache:false}); if(!d||!Array.isArray(d.notas)||d.notas.length!==4) throw {code:'invalid_json'};
      tutor.rdResult={tema,n:d.notas.map(x=>clamp(Math.round((Number(x)||0)*2)/2,0,5)),c:(d.comentarios||[]).map(String),cor:(d.correcoes||[]).map(String).slice(0,6),p:String(d.prioridade||''),rw:String(d.reescrita||'')}; SND.ok(); }
    catch(e){ tutor.rdErr=sampleMsg(e); }
    finally{ tutor.rdBusy=false; if(SHEET.key==='corrigir') drawCorrigir(); } },
  saveCorr:()=>{ const r=tutor.rdResult; if(!r) return; S.redacoes.push({id:uid(),data:today(),tema:r.tema,n:r.n}); const d=Dm(today()); d.red=(d.red||0)+1; gainXP(60); UI.rcDraft=null; saveUI(); commit(); tutor.rdResult=null; closeSheet(); toast('Nota salva. +60 XP'); afterAction(); },
  notaManual:()=>{ openSheet('<h2 id="sheetTitle">Registrar nota</h2><p class="small muted">Corrigiu com professor ou em outra plataforma? Registre aqui.</p><label class="f" for="rmT">Tema</label><input id="rmT" value="'+esc(UI.tema||'')+'">'+CRIT.map((c,i)=>'<label class="f" for="rm'+i+'">'+c+' (0 a 5)</label><input id="rm'+i+'" type="number" inputmode="decimal" min="0" max="5" step="0.5" value="3">').join('')+'<div class="row" style="margin-top:14px"><button class="btn primary block" data-a="saveNota">Salvar nota</button></div>'); },
  saveNota:()=>{ const n=[0,1,2,3].map(i=>clamp(parseFloat(val('rm'+i))||0,0,5)); S.redacoes.push({id:uid(),data:today(),tema:val('rmT').trim(),n}); const d=Dm(today()); d.red=(d.red||0)+1; gainXP(30); commit(); closeSheet(); toast('Nota salva: '+n.reduce((a,b)=>a+b,0)+' de 20.'); afterAction(); },
  /* IA: instrutor e conversas */
  aiOpen:()=>openConv('instrutor',{mode:'instrutor',title:'Instrutor',intro:'Oi'+(S.cfg.name?', '+S.cfg.name:'')+'! Pergunte qualquer coisa das matérias. Eu vejo a tela em que você está e os seus dados de progresso.',ph:'Ex.: qual a diferença entre dispensa e inexigibilidade?'}),
  aiOpenTopic:b=>{ const info=topicInfo(b.dataset.t); if(!info) return; openConv('topic:'+info.t.id,{mode:'duvida',title:'Dúvidas: '+info.t.nome,ctx:'Tópico em estudo: '+info.s.nome+': '+info.t.nome+(CONTENT[info.t.id]?'\nResumo que ele tem:\n'+stripQ(CONTENT[info.t.id]).slice(0,1200):''),ph:'O que você quer entender deste tópico?'}); },
  exOpen:b=>{ const c=EXQ[b.dataset.k]; if(c) openExplain(c); },
  convSend:()=>{ const v=val('convIn'); DROP.add('convIn'); convSend(v); },
  convQuick:b=>convSend(b.dataset.v),
  convStop:()=>{ const C=CONVS[UI.conv]; if(C&&C.ctl) try{ C.ctl.abort(); }catch(e){} },
  convNew:()=>{ const C=CONVS[UI.conv]; if(C){ C.turns=[]; C.err=''; DROP.add('convIn'); drawConv(); } },
  startChat:()=>{ const q=val('qTxt').trim(), img=UI.qImg; if(q.length<15&&!img){ toast('Cole a questão inteira ou mande uma foto.'); return; } const o=val('qOnde').trim();
    const key='destravar:'+uid(); openConv(key,{mode:'socratic',title:'Destravar questão',reset:true});
    CONVS[key].img=img||null; UI.qImg=null;
    convSend((q?'Questão em que travei:\n'+q:'A questão está na foto.')+'\n\nOnde travei: '+(o||'não sei nem por onde começar')+'\n\nMe leve pelo primeiro degrau.',q?'Questão enviada. Onde travei: '+(o||'não sei por onde começar'):'Foto da questão enviada.'); },
  aiPainel:()=>{ const el=$('#ai-painel'); if(el) el.hidden=false; aiRun('painel',promptPainel()); },
  /* configurações e dados */
  settings:()=>sheetSettings(),
  cfGoal:b=>{ S.cfg.goal=+b.dataset.v; S.cfg.at=Date.now(); commit(); sheetSettings(); },
  cfVol:b=>{ SND.setVol(+b.dataset.v); SND.unlock(); SND.ok(); sheetSettings(); },
  cfHaptic:b=>{ SET.haptic=b.dataset.v==='1'; saveSet(); buzz(30); sheetSettings(); },
  saveSettings:()=>{ S.cfg.name=val('cfName').trim().slice(0,40); const ex=val('cfExam'); S.cfg.exam=/^\d{4}-\d{2}-\d{2}$/.test(ex)?ex:''; S.cfg.at=Date.now(); commit(); closeSheet(); toast('Configurações salvas.'); },
  resetAll:b=>{ if(!b.dataset.sure){ b.dataset.sure='1'; b.textContent='Toque de novo para apagar tudo'; return; } const keepCfg=S.cfg; replaceState(defaultState()); S.cfg=keepCfg; S.welcomed=true; commit(); clearModes(); tutor.rf=null; UI={tab:'hoje'}; saveUI(); closeSheetSilently(); toast('Tudo zerado. Bom estudo!'); render(); window.scrollTo(0,0); },
  backup:()=>sheetBackup(),
  backupCopy:()=>sheetCopy('Backup dos seus dados',JSON.stringify(S)),
  backupFile:async()=>{ let dl=null; try{ dl=window.claude&&typeof window.claude.use==='function'?await window.claude.use('downloads'):null; }catch(e){}
    if(!dl){ sheetCopy('Backup dos seus dados',JSON.stringify(S)); toast('Salvar arquivo não está disponível aqui: copie o texto.'); return; }
    try{ await dl.save({filename:'cadete-cbmpr-backup-'+today()+'.json',data:JSON.stringify(S)}); closeSheet(); toast('Backup salvo.'); }catch(e){ if(e&&e.code!=='declined') sheetCopy('Backup dos seus dados',JSON.stringify(S)); } },
  restore:()=>sheetRestore(),
  doRestore:()=>{ try{ const o=JSON.parse(val('rsX')); if(!o||typeof o!=='object'||!o.topicList) throw 0; replaceState(migrate(o)); commit(); closeSheet(); toast('Backup restaurado.'); }catch(e){ toast('Backup inválido: confira se colou o texto inteiro.'); } },
  copy:()=>copyText(val('cpTxt')),
  welcomeOk:()=>{ const nm=val('wName').trim(), ex=val('wExam'); if(nm) S.cfg.name=nm.slice(0,40); if(/^\d{4}-\d{2}-\d{2}$/.test(ex)) S.cfg.exam=ex; S.cfg.at=Date.now(); S.welcomed=true; S.newsV=NEWS_V; SND.unlock(); SND.start(); commit(); closeSheet(); }
};
Object.assign(A,ARENA_A);

/* ===================== EVENTOS ===================== */
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]'); if(!b) return; const name=b.dataset.a, f=A[name]; if(!f) return;
  if(b.tagName==='A') return;
  e.preventDefault();
  SND.unlock();
  const before=UNDO.has(name)?JSON.stringify(S):null;
  try{ const r=f(b,e); if(r&&typeof r.then==='function') r.catch(err=>console.error(err)); }catch(err){ console.error(err); toast('Algo deu errado. Tente de novo.'); }
  try{ afterAction(); }catch(err){}
  if(before!=null&&JSON.stringify(S)!==before){ undoStack.push(before); if(undoStack.length>6) undoStack.shift(); if($('#sheet').hidden) render(); }
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.id==='lgT'){ const el=$('#lgInfo'); if(el&&sheetLog.info) el.innerHTML=sheetLog.info(t.value); }
  if(t.id==='gqT'){ const n=$('#gqN'); if(n) n.value=String(Math.min(T(t.value).rung,2)); }
  if(t.matches&&t.matches('[data-ci]')&&tutor.aic&&tutor.aic.cards){ const x=tutor.aic.cards[+t.dataset.ci]; if(x) x.on=t.checked; }
  if(t.id==='convImg'){ const C=CONVS[UI.conv]; if(C&&t.files&&t.files[0]){ C.img=t.files[0]; toast('Foto pronta. Escreva a pergunta e envie.'); const lb=t.closest('label'); if(lb) lb.querySelector('span').textContent='Foto pronta'; } }
  if(t.id==='qImg'){ if(t.files&&t.files[0]){ UI.qImg=t.files[0]; const l=$('#qImgLbl'); if(l) l.textContent='Foto pronta'; } }
  if(t.id==='rsFile'&&t.files&&t.files[0]){ const r=new FileReader(); r.onload=()=>{ const x=$('#rsX'); if(x) x.value=String(r.result||''); }; r.readAsText(t.files[0]); }
});
let draftT=null;
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='rcX'||t.id==='rcT'){ const c=$('#rcCount'); if(c&&t.id==='rcX') c.textContent=countTxt(t.value); clearTimeout(draftT); draftT=setTimeout(()=>{ UI.rcDraft={t:val('rcT'),x:val('rcX')}; saveUI(); },500); }
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){ if(!$('#celebrate').hidden){ A.celClose(); return; } if(!$('#sheet').hidden){ closeSheet(); return; } }
  const tg=e.target, typing=tg&&(tg.tagName==='TEXTAREA'||tg.tagName==='INPUT'||tg.tagName==='SELECT');
  if(typing){ if(tg.id==='convIn'&&e.key==='Enter'&&(e.ctrlKey||e.metaKey)){ e.preventDefault(); A.convSend(); } return; }
  if(!$('#sheet').hidden){ if(e.key==='Tab') trapTab(e); return; }
  if(!$('#celebrate').hidden||e.ctrlKey||e.metaKey||e.altKey) return;
  const k=e.key.toLowerCase(), num=/^[1-9]$/.test(k)?+k-1:('abcde'.indexOf(k)>=0&&k.length===1?'abcde'.indexOf(k):-1);
  if(arKeydown(e,k,num)){ e.preventDefault(); return; }
  const F=tutor.flash, G=tutor.game, M=tutor.sim, R=tutor.rf;
  if(UI.tab==='tutor'&&F&&!F.done&&F.pos<F.q.length){
    if(!F.revealed&&(k===' '||k==='enter')){ e.preventDefault(); A.flashFlip(); return; }
    if(F.revealed&&/^[1-4]$/.test(k)){ e.preventDefault(); flashGrade(+k-1); return; }
  }
  if(UI.tab==='tutor'&&G&&!G.done){
    const r=G.rounds[G.pos];
    if(r&&!r.ord&&G.pick==null&&num>=0&&num<r.opts.length){ e.preventDefault(); gAnswer(num); return; }
    if(G.pick!=null&&k==='enter'&&G.mode!=='relampago'&&!G.over&&!G.won){ e.preventDefault(); gNext(); return; }
  }
  if(UI.tab==='tutor'&&M&&!M.done){
    const r=M.qs[M.pos];
    if(num>=0&&num<r.opts.length&&/^[a-e1-5]$/.test(k)){ e.preventDefault(); M.ans[M.pos]=num; SND.tap(); render(); return; }
    if(k==='arrowright'){ e.preventDefault(); A.simNext(); return; } if(k==='arrowleft'){ e.preventDefault(); A.simPrev(); return; }
  }
  if(UI.tab==='erros'&&R&&!R.done&&R.pick==null&&num>=0){ const b=$$('#app [data-a="rfPick"]')[num]; if(b){ e.preventDefault(); b.click(); } }
});
function trapTab(e){ const pn=$('#sheet .panel'); const f=[...pn.querySelectorAll('button:not([disabled]),[href],input:not([type="file"]),select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null); if(!f.length) return; const first=f[0], last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); } else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); } }
let lastDay=today();
function tick(){
  gtTick();
  const G=tutor.game;
  if(G&&G.mode==='relampago'&&!G.done){ const left=G.end-Date.now(); const c=$('#relClock'), bar=$('#relBar'); const s=Math.max(0,Math.ceil(left/1000));
    if(c&&c.textContent!==String(s)){ c.textContent=s; if(s<=5&&s>0) SND.tick(); } if(bar) bar.style.width=Math.max(0,100*left/60000)+'%';
    if(left<=0) gFinish(G); }
  const AG=arCur();
  if(AG&&AG.mode==='rel'&&!AG.done){ const left=AG.end-Date.now(); const c=$('#relClock'), bar=$('#relBar'); const s=Math.max(0,Math.ceil(left/1000));
    if(c&&c.textContent!==String(s)){ c.textContent=s; if(s<=5&&s>0) SND.tick(); } if(bar) bar.style.width=Math.max(0,100*left/60000)+'%';
    if(left<=0&&!AG.ans) arFinish(AG); }
  const R=tutor.rel;
  if(R&&!R.over){ const left=R.end-Date.now(); const c=$('#relClock'), bar=$('#relBar'); if(c) c.textContent=Math.max(0,Math.ceil(left/1000)); if(bar) bar.style.width=Math.max(0,100*left/60000)+'%';
    if(left<=0){ R.over=true; SND.timerEnd(); const g=S.games[R.t]||(S.games[R.t]={}); R.isBest=R.score>0&&(!g.rel||R.score>g.rel); if(R.isBest) g.rel=R.score; commit(); afterAction(); if(UI.tab==='tutor'&&$('#sheet').hidden) render(); } }
  const Q=tutor.quiz; if(Q&&Q.running){ const el=$('#qt-'+Q.running.idx); if(el) el.textContent=fmtSec((Q.time[Q.running.idx]||0)+(Date.now()-Q.running.start)/1000); }
  const M=tutor.sim; if(M&&!M.done){ const el=$('#simClock'); if(el) el.textContent=fmtSec((Date.now()-M.start)/1000); }
  if(today()!==lastDay){ lastDay=today(); if($('#sheet').hidden) render(); }
}
setInterval(tick,250);
document.addEventListener('visibilitychange',()=>{ if(document.hidden){ pauseQuizTimer(); } else { gtTick(); if($('#sheet').hidden&&!FX.busy()) render(); } });

/* ===================== INÍCIO ===================== */
function boot(){
  if(!S.achInit){ checkAch(true); S.achInit=true; }
  if(S.patIdx==null) S.patIdx=patente().idx;
  if(S.stkDay==null&&dayActive(today())) S.stkDay=today();
  if(!S.cfg.name&&S.welcomed&&(S.newsV||0)<NEWS_V) S.cfg.name='Victor';
  missions(); saveLocal();
  render();
  getSample();
  SYNC.init();
  setTimeout(()=>{ if($('#sheet').hidden&&(!S.welcomed||(S.newsV||0)<NEWS_V)) sheetWelcome(); },450);
}
if(window.__TEST__) window.__app={tutor,ARENA,AR_BY,arMake,arAsChoice,arValid,arOffline,arStart,arCur,localQuiz,offlineQuestion,SUBJ,get S(){ return S; },today,commit,SYNC,mergeState,migrate,sectionsOf,A,render,xpTotal,levelFromXP,missions,streak};
boot();
