
/* ===================== ÍCONES ===================== */
const svgI=(d,sw)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(sw||2)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
const ICO={
  chat:svgI('<path d="M4 5h16v11H9l-5 4z"/><path d="M9 9h6M9 12h4"/>'),
  clock:svgI('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'),
  target:svgI('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>'),
  cards:svgI('<rect x="3" y="7" width="13" height="13" rx="2"/><path d="M8 4h11a2 2 0 0 1 2 2v11"/>'),
  redo:svgI('<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/>'),
  game:svgI('<rect x="3" y="7" width="18" height="11" rx="4"/><path d="M8 11v3M6.5 12.5h3M15.5 12h.01M18 13.5h.01"/>'),
  flag:svgI('<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>'),
  arrow:svgI('<path d="M5 12h14M13 6l6 6-6 6"/>',2.4),
  check:svgI('<path d="M4 12l6 6L20 6"/>',2.6),
  medal:svgI('<circle cx="12" cy="15" r="5"/><path d="M8.5 11L6 3h4l2 5 2-5h4l-2.5 8"/>'),
  up:svgI('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  bolt:svgI('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
  crown:svgI('<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>'),
  book:svgI('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),
  spark:svgI('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
  camera:svgI('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  cal:svgI('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
  gear:svgI('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
  play:svgI('<path d="M7 5l12 7-12 7z"/>'),
  pause:svgI('<path d="M8 5v14M16 5v14"/>',2.6),
  stop:svgI('<rect x="6" y="6" width="12" height="12" rx="1.5"/>'),
  brain:svgI('<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3V4z"/>'),
  pen:svgI('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>'),
  q:svgI('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17v.01"/>'),
  plus:svgI('<path d="M12 5v14M5 12h14"/>'),
  x:svgI('<path d="M6 6l12 12M18 6L6 18"/>'),
  sound:svgI('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 8a5 5 0 0 1 0 8"/>'),
  soundLow:svgI('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 10a3 3 0 0 1 0 4"/>'),
  mute:svgI('<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 15l4-4M21 15l-4-4"/>'),
  heart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.2C1 8.4 3.1 5 6.6 5c2 0 3.4 1.1 4.2 2.4h2.4C14 6.1 15.4 5 17.4 5 20.9 5 23 8.4 21.6 11.8 19.5 16.4 12 21 12 21z"/></svg>'
};
function flameSVG(){
  return '<svg class="flame" viewBox="0 0 64 80" aria-hidden="true"><defs><linearGradient id="flOut" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#D7261E"/><stop offset=".6" stop-color="#FF7A1A"/><stop offset="1" stop-color="#FFB02E"/></linearGradient><linearGradient id="flIn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFA11F"/><stop offset="1" stop-color="#FFF3C4"/></linearGradient></defs><g class="fl-o"><path d="M32 3C36 17 53 25 53 47c0 17-9 29-21 29S11 64 11 48c0-12 6-18 10-26 1 10 5 14 8 14-2-12-1-23 3-33z" fill="url(#flOut)"/></g><g class="fl-i"><path d="M32 33c3 8 11 13 11 24 0 9-5 15-11 15s-11-6-11-14c0-6 4-10 6-14 1 5 3 7 5 7-1-6-1-12 0-18z" fill="url(#flIn)"/></g></svg>';
}
function flameMini(){ return '<svg viewBox="0 0 24 30" aria-hidden="true"><path fill="#FF7A1A" d="M12 1c1.5 5 7 8 7 16 0 6-3 11-7 11s-7-5-7-10c0-4 2-6 3.5-9 .3 3 1.6 4.5 2.8 4.5C11 9 11 5 12 1z"/></svg>'; }
/* Insígnias das patentes: divisas para cadetes, estrelas para oficiais (esquemático) */
function insigniaSVG(idx){
  const star=(cx,cy,r)=>{ let p=''; for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?r*0.45:r; p+=(i?'L':'M')+(cx+rr*Math.cos(a)).toFixed(1)+' '+(cy+rr*Math.sin(a)).toFixed(1); } return '<path d="'+p+'Z" class="ins-g"/>'; };
  const chev=y=>'<path d="M17 '+y+'l11 7 11-7" class="ins-l"/>';
  let inner='';
  if(idx===0) inner=chev(24);
  else if(idx===1) inner=chev(20)+'<path d="M18 33h20" class="ins-l"/>';
  else if(idx===2) inner=chev(17)+chev(25);
  else if(idx===3) inner=star(28,28,8);
  else if(idx===4) inner=star(28,28,9);
  else if(idx===5) inner=star(20,28,7)+star(36,28,7);
  else inner=star(16,30,6)+star(28,22,6)+star(40,30,6);
  return '<svg viewBox="0 0 56 56" class="insig-svg" aria-hidden="true"><path d="M28 3l21 9v14c0 13-9 22-21 27C16 48 7 39 7 26V12z" class="ins-bg"/>'+inner+'</svg>';
}
function ringSVG(p,cls){ const r=26, C=2*Math.PI*r, off=C*(1-clamp(p,0,1)); return '<svg viewBox="0 0 64 64" class="ring-svg '+(cls||'')+'" aria-hidden="true"><circle cx="32" cy="32" r="'+r+'" class="rg-bg"/><circle cx="32" cy="32" r="'+r+'" class="rg-fg" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg>'; }
function paintGoal(){ const el=$('#goalRing'); if(!el) return; const x=D(today()).xp||0, g=goalXP(); el.innerHTML=goalRingInner(x,g); }
function goalRingInner(x,g){ return ringSVG(x/g,x>=g?'full':'')+'<span class="rg-c"><b>'+x+'</b><em>/'+g+' XP</em></span>'; }
function cuN(n,suf){ return '<span class="cu" data-n="'+n+'"'+(suf?' data-suf="'+suf+'"':'')+'>'+(REDUCED?n+(suf||''):'0')+'</span>'; }
function mountCountUps(root){
  (root||document).querySelectorAll('.cu[data-n]').forEach(el=>{
    if(el.dataset.done) return; el.dataset.done='1';
    const target=parseFloat(el.dataset.n), suf=el.dataset.suf||'', dur=450;
    if(REDUCED||!target){ el.textContent=target+suf; return; }
    const t0=performance.now();
    (function step(t){ const p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3); el.textContent=Math.round(target*e)+suf; if(p<1) requestAnimationFrame(step); })(t0);
  });
}
const CHECK_SVG='<svg class="checkdraw" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l6 6L20 6"/></svg>';

/* ===================== CABEÇALHO ===================== */
function header(){
  const d=new Date().toLocaleDateString('pt-BR',{weekday:'short',day:'numeric',month:'short'}).replace(/\./g,'');
  const vi=SET.vol<=0?ICO.mute:(SET.vol<0.6?ICO.soundLow:ICO.sound);
  return '<div class="top"><span class="date">'+esc(d)+'</span><span class="topr">'+(undoStack.length?'<button class="undobtn" data-a="undo">Desfazer</button>':'')+'<button class="iconbtn" data-a="sndToggle" aria-label="Som: '+(SET.vol<=0?'desligado':(SET.vol<0.6?'baixo':'normal'))+'">'+vi+'</button><span id="syncEl" class="sync '+SYNC.mode+'">'+syncLabel()+'</span></span></div>';
}
function pageHead(title,sub){ return header()+'<h1>'+esc(title)+'</h1><div class="hazard"></div>'+(sub?'<p class="lede">'+sub+'</p>':''); }

/* ===================== CRONÔMETRO DE FOCO =====================
   Livre (conta para cima), Pomodoro 25/5 e Foco 50/10. Os blocos de foco
   entram sozinhos no dia quando terminam: ninguém esquece de registrar. */
const GTM={livre:{nome:'Livre'},pomo:{nome:'Pomodoro 25/5',f:25,b:5},foco:{nome:'Foco 50/10',f:50,b:10}};
let GT=Object.assign({mode:'livre',start:null,acc:0,phase:'focus',cycles:0},lsGet(LS+'-gt2',{}));
function gtSave(){ lsSet(LS+'-gt2',GT); }
function gtElapsed(){ return GT.acc+(GT.start!=null?(Date.now()-GT.start)/1000:0); }
function gtState(){ return GT.start!=null?'running':(GT.acc>0?'paused':'idle'); }
function gtRemaining(){ const m=GTM[GT.mode]; if(!m.f) return null; const tot=(GT.phase==='focus'?m.f:m.b)*60; return tot-gtElapsed(); }
function gtRegister(mins){ if(mins<1) return 0; mins=Math.round(mins); Dm(today()).min+=mins; gainXP(mins); commit(); return mins; }
function gtTick(){
  if(GT.start==null) return;
  const rem=gtRemaining();
  if(rem!=null&&rem<=0){
    const m=GTM[GT.mode];
    if(GT.phase==='focus'){ const got=gtRegister(m.f); GT.cycles++; GT.phase='break'; GT.acc=0; GT.start=Date.now(); gtSave(); SND.timerEnd(); buzz([200,100,200]);
      FX.banner(ICO.clock,'Bloco de foco concluído: +'+got+' min','Pausa de '+m.b+' min: levante, beba água, olhe para longe.','green'); afterAction(); }
    else { GT.phase='focus'; GT.acc=0; GT.start=null; gtSave(); SND.timerEnd(); buzz([100,60,100]); FX.banner(ICO.play,'Pausa encerrada','Toque em Iniciar para o próximo bloco.',''); }
    drawGTBar(); if(UI.tab==='hoje'&&$('#sheet').hidden) render();
    return;
  }
  const disp=gtDisplay(); $$('.gtclock').forEach(el=>{ el.textContent=disp; });
}
function gtDisplay(){ const rem=gtRemaining(); return fmtClock(rem!=null?Math.max(0,rem):gtElapsed()); }
function stopwatchHTML(){
  const st=gtState(), m=GTM[GT.mode], brk=GT.phase==='break';
  let h='<section class="stopwatch '+st+(brk?' brk':'')+'" aria-label="Cronômetro de estudo"><div class="sw-top"><span class="sw-lbl">'+(brk?'Pausa':(st==='running'?'Estudando':'Cronômetro'))+'</span><div class="seg" role="group" aria-label="Modo do cronômetro">'+Object.keys(GTM).map(k=>'<button class="'+(GT.mode===k?'on':'')+'" data-a="gtMode" data-v="'+k+'"'+(st!=='idle'?' disabled':'')+'>'+(k==='livre'?'Livre':(k==='pomo'?'25/5':'50/10'))+'</button>').join('')+'</div></div>';
  h+='<div class="sw-clock gtclock">'+gtDisplay()+'</div>';
  if(m.f) h+='<p class="small muted sw-sub">'+(brk?'Descanso não conta tempo. ':'Bloco de '+m.f+' min entra sozinho no seu dia. ')+(GT.cycles?GT.cycles+(GT.cycles===1?' bloco feito hoje.':' blocos feitos hoje.'):'')+'</p>';
  if(st==='idle') h+='<button class="btn primary block" data-a="gtToggle">'+ICO.play+' '+(brk?'Iniciar pausa':'Iniciar')+'</button>';
  else h+='<div class="grid2"><button class="btn '+(st==='running'?'':'go')+'" data-a="gtToggle">'+(st==='running'?ICO.pause+' Pausar':ICO.play+' Retomar')+'</button><button class="btn" data-a="gtStop">'+ICO.stop+' Parar</button></div>';
  return h+'</section>';
}
function drawGTBar(){
  const el=$('#timerbar'); if(!el) return;
  const st=gtState();
  if(st==='idle'||UI.tab==='hoje'){ el.hidden=true; el.innerHTML=''; return; }
  el.hidden=false; el.className=st;
  el.innerHTML='<button class="tb-in" data-a="tab" data-v="hoje" aria-label="Abrir cronômetro"><span class="dot"></span><span class="gtclock">'+gtDisplay()+'</span><span class="tb-l">'+(GT.phase==='break'?'pausa':(st==='running'?'estudando':'pausado'))+'</span></button>';
}

/* ===================== HOJE ===================== */
function nextStep(){
  const ed=rfDue().length, fd=totalFlashDue(), M=missions();
  if(ed) return {a:'rfStart',t:'Refazer '+ed+(ed===1?' erro':' erros')+' do caderno',s:'É nos erros que a nota sobe mais rápido.',ic:ICO.redo};
  if(fd) return {a:'smartOpen',t:'Revisar '+Math.min(fd,30)+' flashcards',s:'Revisar no dia certo é o que fixa na memória de longo prazo.',ic:ICO.cards};
  const pend=M.list.find(m=>!m.done&&m.type!=='focus');
  if(pend) return misAction(pend);
  if(jnStarted()&&jnDoneN()<JN_CAP.length){ const ci=jnCurIdx(); return {a:'jnCap',d:{i:ci},t:'Jornada do Paraná: capítulo '+ci,s:JN_CAP[ci].n+'. '+JN_CAP[ci].t+'.',ic:ICO.book}; }
  const tid=pick(); if(tid){ const i=topicInfo(tid); return {a:'topic',d:{t:tid},t:'Avançar em '+i.t.nome,s:'É o tópico que mais vale a pena agora: '+reason(i.s,i.t)+'.',ic:ICO.target}; }
  return {a:'hubGames',t:'Treino livre',s:'Escolha um jogo por matéria.',ic:ICO.game};
}
function misAction(m){
  switch(m.type){
    case 'cards': return {a:'smartOpen',t:m.label,s:'Revisão inteligente, das matérias mais fracas primeiro.',ic:ICO.cards};
    case 'erros': return {a:'rfStart',t:m.label,s:'Cada erro volta como questão até virar acerto fácil.',ic:ICO.redo};
    case 'quiz': return {a:'misQuiz',t:m.label,s:'Treino rápido no tópico que mais vale agora.',ic:ICO.target};
    case 'game': return {a:'gOpen',d:{id:m.gid},t:m.label,s:(SUBJ[m.sid]||{}).nome?SUBJ[m.sid].nome+': a matéria com mais peso e menos domínio.':'',ic:ICO.game};
    case 'focus': return {a:'gtStartFocus',t:m.label,s:'Um bloco de 25 minutos sem distração.',ic:ICO.clock};
    case 'redacao': return {a:'tab',d:{v:'redacao'},t:m.label,s:'Sábado é dia de redação.',ic:ICO.pen};
    case 'sim': return {a:'simOpen',t:m.label,s:'Domingo é dia de medir o progresso.',ic:ICO.flag};
  }
  return {a:'tab',d:{v:'tutor'},t:m.label,s:'',ic:ICO.target};
}
function dataAttrs(o){ return Object.keys(o||{}).map(k=>' data-'+k+'="'+esc(o[k])+'"').join(''); }
function missionsHTML(){
  const M=missions(), n=M.list.filter(m=>m.done).length;
  let h='<section class="missions" aria-label="Missões de hoje"><div class="sec-h"><h2>Missões de hoje</h2><span class="pill'+(M.bonus?' ok':'')+'">'+n+'/'+M.list.length+'</span></div><ul>';
  M.list.forEach(m=>{ const p=misProg(m), ac=misAction(m);
    h+='<li class="mis'+(m.done?' done':'')+'"><span class="mis-ck" aria-hidden="true">'+(m.done?CHECK_SVG:'')+'</span><span class="mis-b"><b>'+esc(m.label)+'</b><span class="mis-bar"><i style="width:'+Math.round(100*p/m.target)+'%"></i></span><span class="small muted">'+(m.done?'Cumprida':(p+' de '+m.target+(m.type==='focus'?' min':'')))+' · +'+MIS_XP+' XP</span></span>'+(m.done?'':'<button class="btn sm" data-a="'+ac.a+'"'+dataAttrs(ac.d)+'>Ir</button>')+'</li>'; });
  h+='</ul><p class="small muted mis-foot">'+(M.bonus?'Tudo cumprido hoje. Descanse sem culpa: consolidar também é estudar.':'Cumpra as '+M.list.length+' e ganhe +'+MIS_BONUS+' XP de bônus.')+'</p></section>';
  return h;
}
function tipHTML(){
  const h=new Date().getHours(), dte=daysToExam();
  let t;
  if(dte!=null&&dte>=0&&dte<=7) t=['Reta final','Priorize revisar erros e flashcards. Conteúdo novo agora rende pouco; dormir bem rende muito.'];
  else if(h<11) t=['Manhã','A atenção costuma estar no pico: comece pelo tópico mais difícil do dia.'];
  else if(h>=21) t=['Antes de dormir','Uma revisão leve de flashcards agora aproveita o sono, que é quando a memória se consolida.'];
  else if(h>=13&&h<16) t=['Depois do almoço','Energia mais baixa: bom horário para jogos rápidos e revisão, não para teoria pesada.'];
  else t=['Método','Tentar lembrar antes de ver a resposta fixa muito mais do que reler. Por isso o app pergunta antes de explicar.'];
  return '<aside class="tip"><span class="tip-ic">'+ICO.brain+'</span><span><b>'+t[0]+'.</b> '+t[1]+'</span></aside>';
}
function viewHoje(){
  const k=today(), d=D(k), x=d.xp||0, g=goalXP(), lv=levelFromXP(xpTotal()), P=patente(), vs=streak(), dte=daysToExam(), ns=nextStep();
  const hr=new Date().getHours(), nm=(S.cfg.name||'').trim().split(/\s+/)[0];
  const sau=(hr<5?'Boa noite':hr<12?'Bom dia':hr<18?'Boa tarde':'Boa noite')+(nm?', '+esc(nm):'')+'.';
  let h=pageHead('Hoje',sau+' '+(vs>=2?'São '+vs+' dias seguidos: mantenha a chama acesa.':'Um passo de cada vez rumo à farda.'));
  h+='<section class="hero-hoje">';
  h+='<div class="hh-top"><button class="hh-rank" data-a="rankOpen" aria-label="Patente e nível"><span class="insig">'+insigniaSVG(P.idx)+'</span><span class="hh-rt"><b>'+esc(PATENTES[P.idx])+'</b><span>Nível '+lv.L+' · '+cuN(xpTotal())+' XP</span></span></button>';
  h+='<button class="ring goal" id="goalRing" data-a="metOpen" aria-label="Meta do dia: '+x+' de '+g+' XP">'+goalRingInner(x,g)+'</button></div>';
  h+='<div class="lvlbar" title="Progresso até o próximo nível"><i style="width:'+Math.round(lv.pct*100)+'%"></i></div><div class="lvl-cap small muted"><span>Nível '+lv.L+'</span><span>'+lv.into+'/'+lv.need+' XP para o nível '+(lv.L+1)+'</span></div>';
  h+='<div class="hh-stats"><button class="hs'+(vs?' on':'')+'" data-a="calOpen"><span class="hs-ic fl">'+flameMini()+'</span><b>'+cuN(vs)+'</b><span>'+(vs===1?'dia seguido':'dias seguidos')+'</span></button>';
  h+=dte!=null&&dte>=0?'<button class="hs" data-a="settings"><span class="hs-ic">'+ICO.flag+'</span><b>'+cuN(dte)+'</b><span>'+(dte===1?'dia para a prova':'dias para a prova')+'</span></button>':'<button class="hs" data-a="settings"><span class="hs-ic">'+ICO.flag+'</span><b>—</b><span>definir data da prova</span></button>';
  h+='<button class="hs" data-a="metOpen"><span class="hs-ic">'+ICO.clock+'</span><b>'+fmtMin(d.min||0)+'</b><span>estudados hoje</span></button></div>';
  h+='</section>';
  h+='<button class="nextstep" data-a="'+ns.a+'"'+dataAttrs(ns.d)+'><span class="ns-ic">'+ns.ic+'</span><span class="ns-t"><em>Próximo passo</em><b>'+esc(ns.t)+'</b><span>'+esc(ns.s)+'</span></span><span class="ns-go">'+ICO.arrow+'</span></button>';
  h+=missionsHTML();
  h+=stopwatchHTML();
  h+=tipHTML();
  h+='<div class="quickrow"><button class="qk" data-a="log">'+ICO.plus+'<span><b>Registrar questões</b><em>feitas na sua plataforma</em></span></button><button class="qk" data-a="calOpen">'+ICO.cal+'<span><b>Calendário</b><em>'+(folgaUsed()?'folga da semana usada':'1 folga por semana')+'</em></span></button></div>';
  if(d.folga) h+='<p class="okbox small">Folga marcada hoje. Descanse de verdade: a sequência está protegida.</p>';
  return h;
}
function sheetCalendar(y,m){
  const startWd=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate(), cells=[]; for(let i=0;i<startWd;i++) cells.push(null); for(let d=1;d<=days;d++) cells.push(d); while(cells.length%7) cells.push(null);
  const nome=new Date(y,m,1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}), tk=today();
  let h='<h2 id="sheetTitle">Calendário</h2><div class="row cal-nav"><button class="btn ghost sm" data-a="calNav" data-y="'+y+'" data-m="'+(m-1)+'" aria-label="Mês anterior">‹</button><strong>'+esc(nome)+'</strong><button class="btn ghost sm" data-a="calNav" data-y="'+y+'" data-m="'+(m+1)+'" aria-label="Próximo mês">›</button></div>';
  h+='<div class="calgrid">'+['D','S','T','Q','Q','S','S'].map(l=>'<span class="cl">'+l+'</span>').join('');
  cells.forEach(d=>{ if(!d){ h+='<span class="cd empty"></span>'; return; }
    const k=keyOf(new Date(y,m,d)), day=S.days[k]; let cls='cd';
    if(day&&day.folga) cls+=' folga'; else if(dayActive(k)) cls+=' done'; else if(k<tk) cls+=' miss';
    if(day&&day.meta) cls+=' meta'; if(k===tk) cls+=' today';
    h+='<span class="'+cls+'" title="'+(day&&day.xp?day.xp+' XP':'')+'">'+d+'</span>'; });
  h+='</div><div class="callegend"><span><i class="done"></i>Estudou</span><span><i class="meta"></i>Meta batida</span><span><i class="folga"></i>Folga</span><span><i class="miss"></i>Em branco</span></div>';
  h+='<p class="small muted" style="margin-top:14px">Sequência atual: <strong>'+streak()+'</strong> · Recorde: <strong>'+bestStreak()+'</strong>. Conta como dia de estudo quem faz pelo menos '+MIN_ACTIVE_XP+' XP.</p>';
  if(!D(tk).folga) h+=folgaUsed()?'<p class="small muted">A folga desta semana já foi usada.</p>':'<div class="row"><button class="btn" data-a="folga">Marcar folga hoje</button></div><p class="small muted">Uma folga por semana não quebra a sequência. Descanso também é parte do treino.</p>';
  openSheet(h);
}
