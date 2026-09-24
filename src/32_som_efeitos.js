
/* ===================== SOM =====================
   Um único AudioContext, com volume mestre e compressor.
   Acerto soa brilhante e curto; erro é um "tum" grave e suave (erro não é castigo).
   Sequências de acerto sobem uma escala pentatônica: cada combo soa mais alto que o anterior. */
const SND=(function(){
  let ctx=null, master=null, comp=null;
  function ac(){
    if(!ctx){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); comp=ctx.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=4; master=ctx.createGain(); master.gain.value=SET.vol; master.connect(comp); comp.connect(ctx.destination); }catch(e){ ctx=null; return null; } }
    if(ctx.state==='suspended') try{ ctx.resume(); }catch(e){}
    return ctx;
  }
  function on(){ return SET.vol>0; }
  function tone(f,t0,dur,o){ o=o||{}; const c=ac(); if(!c) return; try{
    const t=c.currentTime+t0, osc=c.createOscillator(), g=c.createGain();
    osc.type=o.type||'sine'; osc.frequency.setValueAtTime(f,t); if(o.to) osc.frequency.exponentialRampToValueAtTime(o.to,t+dur); if(o.detune) osc.detune.value=o.detune;
    const pk=o.gain||0.08, at=o.attack||0.006;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(pk,t+at); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    osc.connect(g); g.connect(master); osc.start(t); osc.stop(t+dur+0.05); }catch(e){} }
  function noise(t0,dur,o){ o=o||{}; const c=ac(); if(!c) return; try{
    const t=c.currentTime+t0, n=c.createBufferSource(), buf=c.createBuffer(1,Math.max(1,c.sampleRate*dur|0),c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*(1-i/d.length);
    n.buffer=buf; const f=c.createBiquadFilter(); f.type=o.ftype||'lowpass'; f.frequency.setValueAtTime(o.f||1000,t); if(o.fto) f.frequency.exponentialRampToValueAtTime(o.fto,t+dur); f.Q.value=o.q||0.7;
    const g=c.createGain(); g.gain.setValueAtTime(o.gain||0.05,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    n.connect(f); f.connect(g); g.connect(master); n.start(t); }catch(e){} }
  function bell(f,t0,g){ tone(f,t0,1.1,{gain:g||0.06}); tone(f*2.76,t0,0.5,{gain:(g||0.06)*0.35}); tone(f*5.4,t0,0.25,{gain:(g||0.06)*0.15}); }
  const PENTA=[523,587,659,784,880,1047,1175,1319,1568,1760,2093];
  return {
    setVol(v){ SET.vol=v; saveSet(); if(master) master.gain.value=v; },
    unlock(){ if(on()) ac(); },
    tap(){ if(on()) noise(0,0.025,{f:3000,ftype:'highpass',gain:0.025}); },
    ok(){ if(!on()) return; tone(880,0,0.12,{type:'triangle',gain:0.07}); tone(1319,0.055,0.18,{type:'triangle',gain:0.06}); tone(440,0,0.16,{gain:0.03}); },
    combo(n){ if(!on()) return; const f=PENTA[Math.min(n,PENTA.length-1)]; tone(f,0,0.12,{type:'triangle',gain:0.065}); tone(f*1.5,0.05,0.16,{type:'triangle',gain:0.05}); if(n>=5) tone(f*2,0.1,0.22,{gain:0.03}); if(n%5===0) bell(f*2,0.12,0.035); },
    bad(){ if(!on()) return; tone(210,0,0.2,{to:150,gain:0.07}); noise(0,0.06,{f:500,gain:0.02}); },
    flip(){ if(on()) noise(0,0.13,{ftype:'bandpass',f:700,fto:2600,q:1.2,gain:0.03}); },
    xp(){ if(on()) tone(1568,0,0.05,{gain:0.025}); },
    crit(){ if(!on()) return; [1319,1760,2093].forEach((f,i)=>tone(f,i*0.04,0.12,{type:'triangle',gain:0.05})); },
    level(){ if(!on()) return; [523,659,784,1047].forEach((f,i)=>tone(f,i*0.09,0.28,{type:'triangle',gain:0.075})); [523,659,784].forEach(f=>tone(f,0.38,0.9,{gain:0.035})); bell(2093,0.45,0.03); },
    goal(){ if(!on()) return; [784,988,1175,1568].forEach((f,i)=>tone(f,i*0.07,0.22,{type:'triangle',gain:0.06})); noise(0.2,0.5,{ftype:'highpass',f:6000,gain:0.015}); },
    mission(){ if(!on()) return; tone(784,0,0.14,{type:'triangle',gain:0.06}); bell(1047,0.1,0.05); },
    ach(){ if(!on()) return; bell(880,0,0.06); bell(1319,0.16,0.045); },
    rung(){ if(!on()) return; [587,740,880].forEach((f,i)=>tone(f,i*0.08,0.2,{type:'triangle',gain:0.065})); },
    timerEnd(){ if(!on()) return; bell(1047,0,0.07); bell(1047,0.45,0.06); },
    fire(){ if(!on()) return; noise(0,0.5,{f:300,fto:1600,gain:0.05}); for(let i=0;i<5;i++) noise(0.05+Math.random()*0.4,0.03,{ftype:'highpass',f:2500,gain:0.03}); },
    start(){ if(!on()) return; tone(523,0,0.1,{type:'triangle',gain:0.05}); tone(784,0.07,0.14,{type:'triangle',gain:0.05}); },
    lifeLost(){ if(!on()) return; tone(330,0,0.12,{type:'square',gain:0.035}); tone(247,0.09,0.18,{type:'square',gain:0.035}); },
    gameOver(){ if(!on()) return; [392,349,311,262].forEach((f,i)=>tone(f,i*0.12,0.2,{type:'triangle',gain:0.05})); },
    flawless(){ if(!on()) return; [523,659,784,1047,1319].forEach((f,i)=>tone(f,i*0.07,0.2,{type:'triangle',gain:0.07})); },
    hit(){ if(!on()) return; tone(160,0,0.15,{to:60,gain:0.1}); noise(0,0.08,{f:1800,gain:0.05}); },
    boss(){ if(!on()) return; noise(0,0.7,{f:200,fto:2000,gain:0.07}); [392,523,659,784,1047].forEach((f,i)=>tone(f,0.3+i*0.08,0.3,{type:'triangle',gain:0.07})); },
    tick(){ if(on()) tone(1000,0,0.03,{type:'square',gain:0.02}); }
  };
})();
function buzz(p){ if(!SET.haptic) return; try{ if(navigator.vibrate) navigator.vibrate(p); }catch(e){} }

/* ===================== EFEITOS VISUAIS E CELEBRAÇÕES ===================== */
let lastPt=null;
document.addEventListener('pointerdown',e=>{ lastPt={x:e.clientX,y:e.clientY}; },{capture:true,passive:true});
const FX=(function(){
  const queue=[]; let showing=false;
  function confetti(power){
    if(REDUCED) return;
    let cv=$('#fxcanvas'); if(!cv) return;
    const W=cv.width=innerWidth*devicePixelRatio, H=cv.height=innerHeight*devicePixelRatio; const g=cv.getContext('2d');
    const cols=['#C21D16','#FF7A1A','#FFC641','#08703F','#1D5BD1','#ffffff'], P=[], n=Math.round(90*(power||1));
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
    kick(){ next(); }
  };
})();
