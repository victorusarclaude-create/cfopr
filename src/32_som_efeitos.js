
/* ===================== SOM =====================
   Um único AudioContext, criado e aquecido no primeiro toque (latência "interactive"),
   com volume mestre, compressor e uma sala curta que dá brilho aos sinos.
   Tudo é agendado no relógio do áudio no instante da ação, antes de redesenhar a tela.
   Acerto soa brilhante (duas notas de vidro + brilho); erro é um "tum" grave e suave (erro não é castigo).
   Sequências de acerto sobem uma escala pentatônica: cada combo soa mais alto que o anterior. */
const SND=(function(){
  let ctx=null, master=null, wet=null, nbuf=null, lastPress=0;
  function build(){
    const AC=window.AudioContext||window.webkitAudioContext;
    try{ ctx=new AC({latencyHint:'interactive'}); }catch(e){ ctx=new AC(); }
    const comp=ctx.createDynamicsCompressor(); comp.threshold.value=-16; comp.knee.value=10; comp.ratio.value=4; comp.attack.value=0.002; comp.release.value=0.12;
    master=ctx.createGain(); master.gain.value=SET.vol; master.connect(comp); comp.connect(ctx.destination);
    const len=Math.round(ctx.sampleRate*0.8), ir=ctx.createBuffer(2,len,ctx.sampleRate);
    for(let c=0;c<2;c++){ const d=ir.getChannelData(c); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.4); }
    const conv=ctx.createConvolver(); conv.buffer=ir; wet=ctx.createGain(); wet.gain.value=0.2; wet.connect(conv); conv.connect(master);
    nbuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate); const d=nbuf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    const s=ctx.createBufferSource(); s.buffer=ctx.createBuffer(1,1,ctx.sampleRate); s.connect(ctx.destination); s.start(0);
  }
  function ac(){
    if(!ctx){ try{ build(); }catch(e){ ctx=null; return null; } }
    if(ctx.state!=='running') try{ ctx.resume(); }catch(e){}
    return ctx;
  }
  function on(){ return SET.vol>0; }
  function tone(f,t0,dur,o){ o=o||{}; const c=ac(); if(!c) return; try{
    const t=c.currentTime+t0, osc=c.createOscillator(), g=c.createGain();
    osc.type=o.type||'sine'; osc.frequency.setValueAtTime(f,t); if(o.to) osc.frequency.exponentialRampToValueAtTime(o.to,t+(o.glide||dur)); if(o.detune) osc.detune.value=o.detune;
    const pk=o.gain||0.08, at=o.attack||0.004;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(pk,t+at); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    osc.connect(g); g.connect(master); if(o.wet) { const s=c.createGain(); s.gain.value=o.wet; g.connect(s); s.connect(wet); }
    osc.start(t); osc.stop(t+dur+0.05); }catch(e){} }
  function noise(t0,dur,o){ o=o||{}; const c=ac(); if(!c) return; try{
    const t=c.currentTime+t0, n=c.createBufferSource(); n.buffer=nbuf;
    const f=c.createBiquadFilter(); f.type=o.ftype||'lowpass'; f.frequency.setValueAtTime(o.f||1000,t); if(o.fto) f.frequency.exponentialRampToValueAtTime(o.fto,t+dur); f.Q.value=o.q||0.7;
    const g=c.createGain(), pk=o.gain||0.05; if(o.attack){ g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(pk,t+o.attack); } else g.gain.setValueAtTime(pk,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    n.connect(f); f.connect(g); g.connect(master); n.start(t,Math.random()*Math.max(0,0.95-dur)); n.stop(t+dur+0.02); }catch(e){} }
  /* timbres: vidro (acertos), sino (conquistas), brilho (purpurina aguda) */
  function glass(f,t0,g,dur){ g=g||0.06; dur=dur||0.32; tone(f,t0,dur,{gain:g,wet:0.5}); tone(f*2,t0,dur*0.45,{type:'triangle',gain:g*0.22}); tone(f*3.01,t0,dur*0.2,{gain:g*0.1}); }
  function bell(f,t0,g){ g=g||0.06; tone(f,t0,1.2,{gain:g,wet:0.8}); tone(f*2.76,t0,0.5,{gain:g*0.32,wet:0.6}); tone(f*5.4,t0,0.22,{gain:g*0.14}); }
  function sparkle(t0,g,n){ const F=[2637,3136,3520,4186,4699]; for(let i=0;i<(n||3);i++) tone(F[(Math.random()*F.length)|0],t0+i*0.028,0.09,{gain:g||0.012,wet:0.9}); }
  function whoosh(t0,dur,g,f1,f2){ noise(t0,dur,{ftype:'bandpass',f:f1||500,fto:f2||2600,q:1.1,gain:g||0.03,attack:dur*0.35}); }
  const PENTA=[523,587,659,784,880,1047,1175,1319,1568,1760,2093];
  return {
    setVol(v){ SET.vol=v; saveSet(); if(master) master.gain.value=v; },
    unlock(){ if(on()) ac(); },
    warm(){ if(on()) ac(); },
    resume(){ if(ctx&&ctx.state!=='running') try{ ctx.resume(); }catch(e){} },
    /* toque físico: sai no instante do dedo, antes de qualquer processamento */
    press(kind){ if(!on()) return; lastPress=performance.now();
      if(kind==='pri'){ tone(660,0,0.07,{to:420,glide:0.05,gain:0.05}); noise(0,0.02,{ftype:'highpass',f:3500,gain:0.018}); }
      else if(kind==='nav'){ tone(520,0,0.06,{to:360,glide:0.05,gain:0.035}); }
      else if(kind==='opt'){ noise(0,0.016,{ftype:'highpass',f:4200,gain:0.03}); tone(1900,0,0.025,{gain:0.01}); }
      else noise(0,0.014,{ftype:'highpass',f:3800,gain:0.022}); },
    tap(){ if(!on()||performance.now()-lastPress<320) return; noise(0,0.016,{ftype:'highpass',f:4200,gain:0.028}); tone(1900,0,0.025,{gain:0.009}); },
    ok(){ if(!on()) return; glass(1047,0,0.07); glass(1568,0.065,0.06); sparkle(0.11,0.011,3); },
    combo(n){ if(!on()) return; const f=PENTA[Math.min(n,PENTA.length-1)]; glass(f,0,0.068); glass(f*1.5,0.055,0.055); if(n>=3) glass(f*2,0.11,0.035,0.4); sparkle(0.12,0.012,Math.min(2+n,6)); if(n%5===0) bell(f*2,0.16,0.035); },
    bad(){ if(!on()) return; tone(230,0,0.22,{to:160,gain:0.075}); tone(115,0,0.2,{type:'triangle',gain:0.03}); noise(0,0.07,{f:450,gain:0.02}); },
    flip(){ if(on()) whoosh(0,0.16,0.03,700,2800); },
    sheet(){ if(on()) whoosh(0,0.22,0.016,400,1500); },
    xp(){ if(on()) glass(2093,0,0.018,0.12); },
    crit(){ if(!on()) return; [1319,1760,2093,2637].forEach((f,i)=>glass(f,i*0.045,0.055,0.26)); sparkle(0.2,0.014,5); },
    stars(n,big){ if(!on()) return; const F=[1047,1319,1568];
      for(let i=0;i<n;i++){ const t=0.3+i*0.2; glass(F[i],t,0.07,0.4); glass(F[i]*2,t+0.02,0.025,0.25); sparkle(t+0.04,0.013,3+i); }
      const tf=n?0.3+n*0.2+0.1:0.15;
      if(!n){ [523,440,392].forEach((f,i)=>glass(f,0.1+i*0.12,0.045,0.3)); return; }
      if(big){ [523,659,784,1047].forEach((f,i)=>glass(f,tf+i*0.07,0.06,0.35)); [523,659,784].forEach(f=>tone(f,tf+0.3,1,{gain:0.03,attack:0.05,wet:0.6})); bell(2093,tf+0.34,0.03); } },
    level(){ if(!on()) return; [523,659,784,1047].forEach((f,i)=>glass(f,i*0.085,0.07,0.34)); [523,659,784].forEach(f=>tone(f,0.36,1,{gain:0.03,attack:0.05,wet:0.6})); bell(2093,0.42,0.03); },
    goal(){ if(!on()) return; [784,988,1175,1568].forEach((f,i)=>glass(f,i*0.07,0.06,0.3)); sparkle(0.28,0.014,6); },
    mission(){ if(!on()) return; glass(784,0,0.06); bell(1047,0.1,0.05); },
    ach(){ if(!on()) return; bell(880,0,0.06); bell(1319,0.16,0.045); sparkle(0.3,0.012,4); },
    rung(){ if(!on()) return; [587,740,880].forEach((f,i)=>glass(f,i*0.08,0.065,0.3)); },
    timerEnd(){ if(!on()) return; bell(1047,0,0.07); bell(1047,0.45,0.06); },
    fire(){ if(!on()) return; whoosh(0,0.55,0.05,300,1600); for(let i=0;i<5;i++) noise(0.05+Math.random()*0.4,0.03,{ftype:'highpass',f:2500,gain:0.03}); },
    start(){ if(!on()) return; whoosh(0,0.18,0.02,500,2200); glass(523,0.02,0.05,0.2); glass(784,0.09,0.055,0.26); },
    lifeLost(){ if(!on()) return; tone(330,0,0.12,{type:'square',gain:0.03}); tone(247,0.09,0.18,{type:'square',gain:0.03}); },
    gameOver(){ if(!on()) return; [392,349,311,262].forEach((f,i)=>glass(f,i*0.12,0.05,0.3)); },
    flawless(){ if(!on()) return; [523,659,784,1047,1319].forEach((f,i)=>glass(f,i*0.07,0.07,0.3)); sparkle(0.36,0.014,6); },
    hit(){ if(!on()) return; tone(160,0,0.15,{to:60,gain:0.1}); noise(0,0.08,{f:1800,gain:0.05}); },
    boss(){ if(!on()) return; whoosh(0,0.7,0.07,200,2000); [392,523,659,784,1047].forEach((f,i)=>glass(f,0.3+i*0.08,0.07,0.34)); },
    tick(){ if(on()) tone(1000,0,0.03,{type:'square',gain:0.018}); }
  };
})();
function buzz(p){ if(!SET.haptic) return; try{ if(navigator.vibrate) navigator.vibrate(p); }catch(e){} }

/* ===================== TOQUE: SOM E ONDULAÇÃO =====================
   Mouse e caneta respondem no pointerdown. No toque, a resposta sai no pointerup (se o dedo não
   arrastou), para rolar a tela não fazer barulho. A ondulação fica numa camada fixa por cima do botão:
   sobrevive ao redesenho da tela que o próprio toque dispara. */
let lastPt=null, pdn=null;
function pressTarget(el){ const b=el&&el.closest?el.closest('button,[data-a],summary,label.filebtn'):null; return !b||b.disabled||b.getAttribute('aria-disabled')==='true'?null:b; }
function pressKind(b){ if(b.closest('#tabs')) return 'nav'; if(b.matches('.btn.primary,.btn.go,.nextstep,.errcta,.arrec,.jnfeat,#fab,.kp-ok')) return 'pri'; if(b.matches('.alt,.mtile,.sitem,.spotw,.kp,.cgap,.ptcell,.bin,.bstep button,.zone,.jn-rg,.simchip,.chip,.seg button,.grade,.lvpath button,.jnlist button')) return 'opt'; return ''; }
function ripple(b,x,y){
  if(REDUCED||!(b instanceof HTMLElement)||b.closest('#tabs')||b.matches('.linkbtn,summary')) return;
  const r=b.getBoundingClientRect(); if(!r.width||r.width>760||r.height>420) return;
  const cs=getComputedStyle(b), w=document.createElement('span'), c=document.createElement('i'), d=2*Math.hypot(Math.max(x-r.left,r.right-x),Math.max(y-r.top,r.bottom-y));
  w.className='rip-w'; w.style.cssText='left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px;border-radius:'+cs.borderRadius+';color:'+cs.color;
  c.style.cssText='left:'+(x-r.left-d/2)+'px;top:'+(y-r.top-d/2)+'px;width:'+d+'px;height:'+d+'px';
  w.appendChild(c); document.body.appendChild(w); setTimeout(()=>w.remove(),650);
}
function pressFx(b,x,y){ SND.press(pressKind(b)); ripple(b,x,y); }
document.addEventListener('pointerdown',e=>{ lastPt={x:e.clientX,y:e.clientY}; if(e.pointerType!=='touch') SND.warm(); if(e.button>0) return;
  const b=pressTarget(e.target); if(!b) return;
  if(e.pointerType==='touch'){ pdn={id:e.pointerId,b,x:e.clientX,y:e.clientY,t:performance.now()}; return; }
  pressFx(b,e.clientX,e.clientY); },{capture:true,passive:true});
document.addEventListener('pointerup',e=>{ SND.warm(); const p=pdn; pdn=null; if(!p||p.id!==e.pointerId) return;
  if(Math.hypot(e.clientX-p.x,e.clientY-p.y)>12||performance.now()-p.t>700||!document.contains(p.b)) return;
  lastPt={x:e.clientX,y:e.clientY}; pressFx(p.b,e.clientX,e.clientY); },{capture:true,passive:true});
document.addEventListener('pointercancel',()=>{ pdn=null; },{capture:true,passive:true});
document.addEventListener('keydown',()=>SND.warm(),{capture:true,passive:true});
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) SND.resume(); });

/* ===================== EFEITOS VISUAIS E CELEBRAÇÕES ===================== */
const FX=(function(){
  const queue=[]; let showing=false, holdUntil=0;
  function confetti(power){
    if(REDUCED) return;
    let cv=$('#fxcanvas'); if(!cv) return;
    const W=cv.width=innerWidth*devicePixelRatio, H=cv.height=innerHeight*devicePixelRatio; const g=cv.getContext('2d');
    const cols=['#7C3AED','#A78BFA','#F0612A','#FBBF24','#10B981','#EBE8D8','#ffffff'], P=[], n=Math.round(90*(power||1));
    for(let i=0;i<n;i++) P.push({x:W*(0.2+Math.random()*0.6),y:H*0.35,vx:(Math.random()-0.5)*16*devicePixelRatio,vy:(-8-Math.random()*12)*devicePixelRatio,s:(5+Math.random()*6)*devicePixelRatio,r:Math.random()*6,vr:(Math.random()-0.5)*0.3,c:cols[i%cols.length],sh:Math.random()<0.5});
    const t0=performance.now(); cv.hidden=false;
    (function step(t){ const el=t-t0; g.clearRect(0,0,W,H);
      P.forEach(p=>{ p.vy+=0.45*devicePixelRatio; p.vx*=0.99; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; g.save(); g.translate(p.x,p.y); g.rotate(p.r); g.globalAlpha=Math.max(0,1-el/2200); g.fillStyle=p.c; if(p.sh) g.fillRect(-p.s/2,-p.s/4,p.s,p.s/2); else { g.beginPath(); g.arc(0,0,p.s/3,0,7); g.fill(); } g.restore(); });
      if(el<2200) requestAnimationFrame(step); else { g.clearRect(0,0,W,H); cv.hidden=true; } })(t0);
  }
  function xp(n,at){
    const p=at||lastPt; if(!p) return;
    const el=document.createElement('div'); el.className='xpfloat'+(n>=40?' big':''); el.textContent='+'+n+' XP';
    el.style.left=clamp(p.x,40,innerWidth-40)+'px'; el.style.top=clamp(p.y-18,60,innerHeight-80)+'px';
    document.body.appendChild(el); setTimeout(()=>el.remove(),1100);
    const g=$('#goalRing'); if(g) paintGoal();
  }
  function banner(icon,title,sub,cls){
    const b=document.createElement('div'); b.className='banner '+(cls||''); b.setAttribute('role','status');
    b.innerHTML='<span class="bn-ic">'+icon+'</span><span class="bn-t"><b>'+esc(title)+'</b>'+(sub?'<span>'+esc(sub)+'</span>':'')+'</span>';
    $('#banners').appendChild(b); requestAnimationFrame(()=>b.classList.add('in'));
    setTimeout(()=>{ b.classList.remove('in'); setTimeout(()=>b.remove(),400); },3200);
  }
  function modal(html,after){
    const m=$('#celebrate'); m.innerHTML='<div class="cel-card" role="dialog" aria-modal="true" aria-labelledby="celTitle">'+html+'<button class="btn primary block" data-a="celClose" id="celOk">Continuar</button></div>';
    m.hidden=false; showing=true; setTimeout(()=>{ try{ $('#celOk').focus(); }catch(e){} },60);
    FX._after=after;
  }
  function close(){ const m=$('#celebrate'); m.hidden=true; m.innerHTML=''; showing=false; if(FX._after){ const f=FX._after; FX._after=null; f(); } next(); }
  const MODAL=['level','patente','allMissions','bossWin'];
  function next(){
    if(showing||!queue.length) return;
    const w=holdUntil-Date.now(); if(w>0){ clearTimeout(FX._w); FX._w=setTimeout(next,w); return; }
    const i=queue.findIndex(([t])=>!(MODAL.includes(t)&&inRun()&&t!=='level'));
    if(i<0){ clearTimeout(FX._w); FX._w=setTimeout(next,1500); return; }
    const [type,o]=queue.splice(i,1)[0];
    if(type==='level'&&inRun()){ SND.level(); buzz([30,40,60]); confetti(0.5); banner(ICO.up,'Nível '+o.L+'!','Seu esforço virou nível. Continue.','gold'); setTimeout(next,700); return; }
    show(type,o);
  }
  function show(type,o){
    switch(type){
      case 'level': SND.level(); buzz([30,40,60]); confetti(1.2);
        modal('<div class="cel-kicker">Subiu de nível</div><div class="cel-big" id="celTitle">'+o.L+'</div><p class="cel-sub">Cada questão, cartão e erro refeito virou XP. Continue no ritmo.</p>'); return;
      case 'patente': SND.boss(); buzz([40,60,80]); confetti(1.6);
        modal('<div class="cel-kicker">Promoção</div><div class="insig big">'+insigniaSVG(o.idx)+'</div><div class="cel-name" id="celTitle">'+esc(PATENTES[o.idx])+'</div><p class="cel-sub">Seu domínio geral chegou a '+Math.round(o.m*100)+'%. A patente acompanha o que você realmente sabe.</p>'); return;
      case 'allMissions': SND.goal(); buzz([30,50,30]); confetti(1);
        modal('<div class="cel-kicker">Missões do dia</div><div class="cel-name" id="celTitle">Todas cumpridas</div><p class="cel-sub">+'+MIS_BONUS+' XP de bônus. Amanhã tem missão nova.</p>'); return;
      case 'bossWin': SND.boss(); buzz([40,60,80]); confetti(1.5);
        modal('<div class="cel-kicker">Chefão derrotado</div><div class="cel-name" id="celTitle">'+esc(o.nome)+'</div><p class="cel-sub">'+o.hits+' acertos, '+o.lives+' vida(s) sobrando. +'+o.xp+' XP.</p>'); return;
      case 'goal': SND.goal(); buzz([20,40,20]); confetti(0.6); banner(ICO.target,'Meta do dia batida','Descansar agora também conta. A sequência está garantida.','gold'); break;
      case 'mission': SND.mission(); buzz(25); banner(ICO.check,'Missão cumprida','+'+MIS_XP+' XP · '+o.label,'green'); break;
      case 'ach': SND.ach(); buzz([20,30]); banner(ICO.medal,o.names.length>1?'Novas conquistas':'Nova conquista',o.names.join(', '),'gold'); break;
      case 'rung': SND.rung(); { const i=topicInfo(o.t); banner(ICO.up,o.r>=3?'Tópico dominado':'Subiu para o degrau '+RUNGS[o.r],i?i.t.nome:'','green'); } break;
      case 'streak': SND.fire(); banner(flameMini(),o.n+' dias de sequência','Constância é o que aprova.','fire'); break;
    }
    setTimeout(next,700);
  }
  return {
    confetti, xp, banner, close,
    celebrate(type,o){ queue.push([type,o||{}]); if(!showing) setTimeout(next,type==='goal'||type==='mission'||type==='ach'?250:500); },
    busy(){ return showing; },
    /* segura modais e faixas por um instante (ex.: enquanto as estrelas do fim de partida entram) */
    hold(ms){ holdUntil=Math.max(holdUntil,Date.now()+ms); },
    kick(){ next(); }
  };
})();
