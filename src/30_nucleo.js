
/* ===================== UTILIDADES ===================== */
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>Array.from(el.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function keyOf(d){ const z=new Date(d.getTime()-d.getTimezoneOffset()*60000); return z.toISOString().slice(0,10); }
function today(){ return keyOf(new Date()); }
function dateOf(k){ const [y,m,d]=k.split('-').map(Number); return new Date(y,m-1,d,12); }
function addDays(k,n){ const d=dateOf(k); d.setDate(d.getDate()+n); return keyOf(d); }
function diffDays(a,b){ return Math.round((dateOf(b)-dateOf(a))/86400000); }
function uid(){ return Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4); }
function fmtMin(m){ m=Math.round(m); const h=Math.floor(m/60), r=m%60; return h?(h+'h'+(r?String(r).padStart(2,'0'):'')):(r+' min'); }
function fmtSec(s){ s=Math.max(0,Math.round(s||0)); const m=Math.floor(s/60), r=s%60; return m?(m+':'+String(r).padStart(2,'0')):(r+'s'); }
function fmtClock(sec){ sec=Math.max(0,Math.round(sec)); const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), r=sec%60; return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(r).padStart(2,'0'); }
function pct(a,f){ return f?Math.round(100*a/f)+'%':'—'; }
function fmtDay(k){ const t=today(); if(k<=t) return 'hoje'; if(k===addDays(t,1)) return 'amanhã'; return k.split('-').reverse().slice(0,2).join('/'); }
function fmtText(t){
  return esc(t).split('\n').map(l=>{ let m;
    if((m=l.match(/^\s*#{1,4}\s+(.*)$/))) return '<strong>'+m[1]+'</strong>';
    if((m=l.match(/^\s*[-*]\s+(.*)$/))) return '• '+m[1];
    return l; }).join('<br>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
}
function stripQ(t){ return String(t==null?'':t).replace(/\*\*/g,''); }
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; const tmp=a[i]; a[i]=a[j]; a[j]=tmp; } return a; }
function lsGet(k,def){ try{ const v=localStorage.getItem(k); return v==null?def:JSON.parse(v); }catch(e){ return def; } }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
function hashStr(str){ let h=0x811c9dc5; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619); } return (h>>>0).toString(36)+'.'+str.length.toString(36); }
const REDUCED=(()=>{ try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } })();
const SUBJ=Object.fromEntries(SUBJECTS.map(s=>[s.id,s]));

/* ===================== ESTADO ===================== */
const LS='cadete-cbmpr-v1', LS_UI='cadete-cbmpr-ui', LS_SYNC='cadete-cbmpr-sync', LS_DEV='cadete-cbmpr-dev';
const SEED_V=2, NEWS_V=2;
function newCard(f,b,extra){ return Object.assign({id:uid(),f,b,due:today(),reps:0,iv:0,ef:2.5},extra||{}); }
function seedDeck(tid){ return (FLASHCARDS[tid]||[]).map(([f,b])=>newCard(f,b)); }
function defaultState(){
  const topicList={}, flashcards={};
  SUBJECTS.forEach(s=>{ topicList[s.id]=s.topicos.map(([id,nome,base])=>({id,nome,base:!!base})); });
  Object.keys(FLASHCARDS).forEach(t=>{ flashcards[t]=seedDeck(t); });
  return {v:2,updatedAt:0,welcomed:false,newsV:NEWS_V,topicList,topics:{},days:{},erros:[],redacoes:[],flashcards,games:{},gb:{},gm:{},mst:{},ach:{},t80:{},sims:[],hist:{},visits:{},
    cfg:{goal:200,exam:'',name:'',at:0},qbank:{},notes:{},modes:{},arena:{},jn:{},cardDel:{},seedV:SEED_V,streakMig:today(),xpMig:true,evMig:true,achInit:true};
}
const OBJ_KEYS=['topics','days','games','gb','gm','mst','ach','t80','hist','visits','qbank','notes','modes','arena','jn','cardDel'];
function migrate(o){
  const d=defaultState();
  if(!o||typeof o!=='object'||Array.isArray(o)) return d;
  o.topicList=(o.topicList&&typeof o.topicList==='object')?o.topicList:{};
  SUBJECTS.forEach(s=>{ if(!Array.isArray(o.topicList[s.id])) o.topicList[s.id]=d.topicList[s.id]; o.topicList[s.id]=o.topicList[s.id].filter(t=>t&&t.id&&t.nome); });
  OBJ_KEYS.forEach(k=>{ if(!o[k]||typeof o[k]!=='object'||Array.isArray(o[k])) o[k]={}; });
  ['erros','redacoes','sims'].forEach(k=>{ if(!Array.isArray(o[k])) o[k]=[]; });
  o.cfg=Object.assign({goal:200,exam:'',name:'',at:0},(o.cfg&&typeof o.cfg==='object')?o.cfg:{});
  o.flashcards=(o.flashcards&&typeof o.flashcards==='object')?o.flashcards:{};
  Object.keys(o.flashcards).forEach(t=>{
    if(!Array.isArray(o.flashcards[t])){ delete o.flashcards[t]; return; }
    o.flashcards[t]=o.flashcards[t].filter(c=>c&&c.f!=null);
    o.flashcards[t].forEach(c=>{
      if(c.reps==null){ const b=c.box||0; c.reps=b; c.iv=b?([1,3,7,15,30][b-1]||30):0; c.ef=2.5; delete c.box; }
      if(!c.id) c.id=uid(); if(!c.due) c.due=today();
    });
  });
  if((o.seedV||0)<SEED_V){
    Object.keys(FLASHCARDS).forEach(t=>{ const deck=o.flashcards[t]||(o.flashcards[t]=[]); const have=new Set(deck.map(c=>c.f)); const del=new Set(o.cardDel[t]||[]);
      FLASHCARDS[t].forEach(([f,b])=>{ if(!have.has(f)&&!del.has(f)) deck.push(newCard(f,b)); }); });
    o.seedV=SEED_V;
  }
  Object.keys(o.days).forEach(k=>{ const x=o.days[k]; if(!x||typeof x!=='object'){ delete o.days[k]; return; } x.done=x.done||{}; });
  if(!o.evMig){
    Object.keys(o.topics).forEach(t=>{ const st=o.topics[t]; if(st&&st.tf>0){ const T0=o.mst[t]||(o.mst[t]={}); if(!T0.q) T0.q={n:+st.tf,ok:+st.ta,d:dayNum(st.last||today())}; } });
    o.evMig=true;
  }
  if(!o.xpMig){ /* histórico antigo vira XP, para ninguém começar do zero */
    Object.keys(o.days).forEach(k=>{ const x=o.days[k]; if(x.xp==null) x.xp=Math.round((x.q||0)*4+(x.g||0)*4+(x.c||0)*3+(x.rf||0)*6+(x.min||0)+(x.sims||0)*20+(x.ex||0)*3); });
    o.xpMig=true;
  }
  if(!o.streakMig) o.streakMig=today();
  o.erros=o.erros.filter(e=>e&&typeof e==='object');
  o.erros.forEach(e=>{ if(!e.id) e.id=uid(); if(e.etapa==null) e.etapa=0; if(!e.prox) e.prox=today(); if(!e.n) e.n=1; });
  if(o.newsV==null) o.newsV=o.welcomed?1:NEWS_V;
  delete o.goal;
  o.v=2; o.updatedAt=o.updatedAt||0; o.welcomed=!!o.welcomed;
  prune(o);
  return o;
}
function prune(o){
  const cut=addDays(today(),-90);
  const cons=o.erros.filter(e=>e.done);
  if(cons.length>300){ const drop=new Set(cons.slice(0,cons.length-300).map(e=>e.id)); o.erros=o.erros.filter(e=>!drop.has(e.id)); }
  o.erros.forEach(e=>{ if(e.done&&(e.last||e.criado||'')<cut){ delete e.steps; if(e.x&&e.x.length>400) e.x=e.x.slice(0,400); } });
  Object.keys(o.qbank).forEach(t=>{ if(!Array.isArray(o.qbank[t])) delete o.qbank[t]; else if(o.qbank[t].length>15) o.qbank[t]=o.qbank[t].slice(-15); });
  const nk=Object.keys(o.notes).sort((a,b)=>(o.notes[a].at||0)-(o.notes[b].at||0)); while(nk.length>80) delete o.notes[nk.shift()];
  const dk=Object.keys(o.days).sort(); while(dk.length>1200) delete o.days[dk.shift()];
  if(o.sims.length>60) o.sims=o.sims.slice(-60);
  if(o.redacoes.length>120) o.redacoes=o.redacoes.slice(-120);
}
let S;
try{ S=migrate(JSON.parse(localStorage.getItem(LS)||'null')); }catch(e){ S=defaultState(); }
let UI=Object.assign({tab:'hoje'},lsGet(LS_UI,{}));
function saveUI(){ lsSet(LS_UI,UI); }
const SET=Object.assign({vol:0.8,haptic:true},lsGet('cadete-cbmpr-set',{}));
function saveSet(){ lsSet('cadete-cbmpr-set',SET); }

function T(id){ return S.topics[id]||{rung:0,f:0,a:0,tf:0,ta:0,last:null,flag:null}; }
function Tm(id){ return S.topics[id]||(S.topics[id]={rung:0,f:0,a:0,tf:0,ta:0,last:null,flag:null}); }
function D(k){ return S.days[k]||{min:0,q:0,a:0,xp:0,done:{},folga:false}; }
function Dm(k){ const d=S.days[k]||(S.days[k]={min:0,q:0,a:0,xp:0,done:{},folga:false}); d.done=d.done||{}; if(d.xp==null) d.xp=0; return d; }
let TI=null;
function topicInfo(id){
  if(!TI){ TI={}; SUBJECTS.forEach(s=>(S.topicList[s.id]||[]).forEach(t=>{ TI[t.id]={s,t}; })); }
  return TI[id]||null;
}
function invalidateTI(){ TI=null; }
function allTopics(){ const out=[]; SUBJECTS.forEach(s=>(S.topicList[s.id]||[]).forEach(t=>out.push({s,t}))); return out; }

/* ===================== DOMÍNIO (evidência com esquecimento) ===================== */
const HALF=45;
const SRCW={q:[0.6,1,1.4,1.4],sim:1.2,game:0.5,gl:[0.35,0.45,0.6,0.8,1],card:0.35,teste80:1.3};
const CEIL=[0.55,0.75,0.9,1];
function dayNum(k){ return Math.round(dateOf(k).getTime()/86400000); }
function addEv(t,src,n,ok,lv){
  if(!t||!n||!topicInfo(t)) return;
  const now=dayNum(today()), T0=S.mst[t]||(S.mst[t]={}), e=T0[src]||(T0[src]={n:0,ok:0,d:now});
  const f=Math.pow(0.5,(now-e.d)/HALF), w=src==='q'?SRCW.q[clamp(lv||0,0,3)]:(src==='game'&&lv!=null?SRCW.gl[clamp(lv,0,4)]:(SRCW[src]||0.5));
  e.n=+(e.n*f+n*w).toFixed(3); e.ok=+(e.ok*f+ok*w).toFixed(3); e.d=now;
  const d=Dm(today());
  if(src==='game') d.g=(d.g||0)+n; else if(src==='card') d.c=(d.c||0)+n;
  else { const inf=topicInfo(t); d.bs=d.bs||{}; const b=d.bs[inf.s.id]||(d.bs[inf.s.id]={q:0,a:0}); b.q+=n; b.a+=ok; }
}
function topicEvidence(t){
  const T0=S.mst[t]||{}, now=dayNum(today()); let N=0,OK=0; const by={};
  for(const k in T0){ const e=T0[k], f=Math.pow(0.5,(now-e.d)/HALF); N+=e.n*f; OK+=e.ok*f; by[k]=e.n*f; }
  return {N,OK,by};
}
function topicMastery(t){ const {N,OK}=topicEvidence(t); if(N<=0) return 0; const acc=(OK+1)/(N+2), conf=N/(N+12); return Math.min(acc*conf,CEIL[T(t).rung||0]); }
function topicAcc(t){ const {N,OK}=topicEvidence(t); return N>0?{acc:(OK+1)/(N+2),conf:N/(N+12)}:{acc:0.2,conf:0}; }
function subjMastery(sid){ const L=S.topicList[sid]||[]; if(!L.length) return 0; return L.reduce((a,t)=>a+topicMastery(t.id),0)/L.length; }
function subjProj(sid){ const L=S.topicList[sid]||[]; if(!L.length) return 0.2; let s=0; L.forEach(t=>{ const {acc,conf}=topicAcc(t.id); s+=conf*acc+(1-conf)*0.2; }); return s/L.length; }
function overall(){ let m=0,p=0,q=0; SUBJECTS.forEach(s=>{ m+=s.q*subjMastery(s.id); p+=s.q*subjProj(s.id); q+=s.q; }); return {m:q?m/q:0,proj:p}; }
const NIVEIS=[[0,'Iniciante'],[0.2,'Básico'],[0.4,'Intermediário'],[0.6,'Avançado'],[0.8,'Especialista']];
function nivel(m){ let n=NIVEIS[0][1]; NIVEIS.forEach(([v,l])=>{ if(m>=v) n=l; }); return n; }
function mCls(m){ let i=0; NIVEIS.forEach(([v],ix)=>{ if(m>=v) i=ix; }); return 'm'+i; }
function accCls(a){ return a>=0.7?'acc-good':(a>=0.5?'acc-mid':'acc-bad'); }
function weekStart(k){ const wd=dateOf(k).getDay(); return addDays(k,-((wd+6)%7)); }
function snapWeek(){
  const wk=weekStart(today());
  const snap={o:Math.round(overall().m*100),s:{}}; SUBJECTS.forEach(s=>{ snap.s[s.id]=Math.round(subjMastery(s.id)*100); });
  const prev=S.hist[wk]; if(prev&&JSON.stringify(prev)===JSON.stringify(snap)) return;
  S.hist[wk]=snap; const ks=Object.keys(S.hist).sort(); while(ks.length>26) delete S.hist[ks.shift()];
}
/* Patente: acompanha o domínio geral (o mesmo número do Painel) */
const PAT_T=[0,0.08,0.18,0.30,0.45,0.60,0.78];
function patente(){
  const m=overall().m; let idx=0; PAT_T.forEach((v,i)=>{ if(m>=v) idx=i; });
  const lo=PAT_T[idx], hi=PAT_T[idx+1]; const within=hi==null?1:clamp((m-lo)/(hi-lo),0,1);
  return {idx,within,m,next:hi};
}

/* ===================== FILA DE PRIORIDADE E ESCADA ===================== */
function score(s,t){
  const st=T(t.id), n=(S.topicList[s.id]||[]).length||1;
  let v=(s.q/n)*FAC[s.tipo]*GAP[st.rung];
  if(t.base&&st.rung===0) v*=1.6;
  if(st.rung>0&&st.rung<3&&st.last&&diffDays(st.last,today())>21) v*=1.3;
  if(st.flag==='teoria') v*=1.15;
  v*=(1.25-topicMastery(t.id));
  return v;
}
function reason(s,t){
  const st=T(t.id), p=[s.q+' questões de '+s.nome+' na prova'];
  if(s.tipo==='memoria') p.push('conteúdo de memória, rende rápido');
  if(t.base&&st.rung===0) p.push('base que destrava Física e Química');
  if(st.rung>0&&st.last&&diffDays(st.last,today())>21) p.push('sem treino há mais de 3 semanas');
  return p.join('; ');
}
function ranked(filter){
  const out=[];
  SUBJECTS.forEach(s=>{
    if(filter&&filter.subj&&!filter.subj.includes(s.id)) return;
    (S.topicList[s.id]||[]).forEach(t=>{ const st=T(t.id); if(st.rung>=3) return; out.push({s,t,v:score(s,t)}); });
  });
  return out.sort((a,b)=>b.v-a.v);
}
function pick(filter){ const r=ranked(filter); return r.length?r[0].t.id:null; }
function applyLog(topicId,f,a,atRung,noEv){
  const st=Tm(topicId), k=today(), d=Dm(k);
  if(!noEv){ d.q+=f; d.a+=a; addEv(topicId,'q',f,a,atRung!=null?atRung:st.rung); }
  st.tf+=f; st.ta+=a; st.last=k;
  let msg='Registrado: '+a+' de '+f+'.';
  if(atRung!=null&&atRung!==st.rung) return msg+' Contou no total, fora do degrau atual.';
  if(st.rung<3){
    st.f+=f; st.a+=a;
    if(st.f>=10){
      const r=st.a/st.f;
      if(r>=0.8){ st.rung++; st.f=0; st.a=0; st.flag=null; msg=st.rung===3?'Tópico dominado. Ele sai da fila e volta só para manutenção.':'Subiu para o degrau '+RUNGS[st.rung]+'.'; FX.celebrate('rung',{t:topicId,r:st.rung}); }
      else if(r<0.5){ st.flag='teoria'; msg='Abaixo de 50% no degrau '+RUNGS[st.rung]+'. Volte na teoria ou use "Aprender do zero".'; }
      if(st.f>=20){ st.f=f; st.a=a; }
    }
  }
  return msg;
}

/* ===================== XP, NÍVEL, META E SEQUÊNCIA ===================== */
const MIN_ACTIVE_XP=20;
const GOALS=[[120,'Leve'],[200,'Firme'],[300,'Forte'],[450,'Intenso']];
function levelFromXP(x){ let L=1, need=120, acc=0; while(x>=acc+need){ acc+=need; L++; need=80+40*L; } return {L,into:x-acc,need,pct:(x-acc)/need}; }
function xpTotal(){ let t=0; for(const k in S.days) t+=S.days[k].xp||0; return t; }
function goalXP(){ return S.cfg.goal||200; }
function gainXP(n,at){
  n=Math.round(n); if(!(n>0)) return 0;
  const d=Dm(today()), before=xpTotal(), L0=levelFromXP(before).L, g0=d.xp||0;
  d.xp=g0+n;
  FX.xp(n,at);
  const L1=levelFromXP(before+n).L;
  if(L1>L0) FX.celebrate('level',{L:L1});
  if(g0<goalXP()&&d.xp>=goalXP()){ d.meta=true; FX.celebrate('goal',{}); }
  return n;
}
function dayActive(k){
  const d=S.days[k];
  if(d&&(d.folga||(d.xp||0)>=MIN_ACTIVE_XP)) return true;
  if(S.streakMig&&k<S.streakMig) return !!((S.visits&&S.visits[k])||(d&&(d.min>0||d.q>0||d.c>0||d.g>0||d.xp>0)));
  return false;
}
function streak(){ let k=today(), n=0; if(!dayActive(k)) k=addDays(k,-1); while(dayActive(k)&&n<4000){ n++; k=addDays(k,-1); } return n; }
function bestStreak(){
  const ks=[...new Set(Object.keys(S.days).concat(Object.keys(S.visits||{})))].filter(dayActive).sort();
  let best=0,cur=0,prev=null; ks.forEach(k=>{ cur=(prev&&diffDays(prev,k)===1)?cur+1:1; best=Math.max(best,cur); prev=k; }); return best;
}
function folgaUsed(){ const ws=weekStart(today()); for(let i=0;i<7;i++){ const d=S.days[addDays(ws,i)]; if(d&&d.folga) return true; } return false; }
function statsRange(n){
  const k=today(), o={min:0,q:0,a:0,c:0,g:0,rf:0,rfok:0,sims:0,xp:0};
  for(let i=0;i<n;i++){ const d=S.days[addDays(k,-i)]; if(!d) continue; for(const f in o) o[f]+=d[f]||0; }
  return o;
}
function daysToExam(){ const e=S.cfg.exam; if(!e||!/^\d{4}-\d{2}-\d{2}$/.test(e)) return null; return diffDays(today(),e); }

/* ===================== FLASHCARDS (SM-2) ===================== */
function sm2(c,g){
  const q=[1,3,4,5][g]; let ef=c.ef||2.5, reps=c.reps||0, iv=c.iv||0;
  if(q<3){ reps=0; iv=1; }
  else { if(reps===0) iv=g===3?3:1; else if(reps===1) iv=g===1?2:(g===3?6:3); else iv=Math.round(iv*ef*(g===1?0.8:(g===3?1.3:1))); reps++; }
  ef=Math.max(1.3,ef+(0.1-(5-q)*(0.08+(5-q)*0.02)));
  return {ef:+ef.toFixed(2),reps,iv:clamp(iv,1,365)};
}
function ivLabel(d){ return d<30?d+' d':(d<365?Math.round(d/30)+' m':'1 ano'); }
function deckStats(tid){ const cards=S.flashcards[tid]||[], k=today(); let due=0,nw=0; cards.forEach(c=>{ if(!c.seen) nw++; else if(c.due<=k) due++; }); return {due,nw,total:cards.length}; }
function totalFlashDue(){ let n=0; Object.keys(S.flashcards).forEach(t=>{ if(topicInfo(t)) n+=deckStats(t).due; }); return n; }
function newToday(){ return (D(today()).nc||0); }
const NEW_PER_DAY=15;

/* ===================== CADERNO DE ERROS ===================== */
function rfDue(){ const k=today(); return S.erros.filter(e=>!e.done&&e.prox<=k).sort((a,b)=>(b.n||1)-(a.n||1)); }
function errFromQ(o){
  if(!o||!o.t||!topicInfo(o.t)) return null;
  const q=stripQ(o.q).trim(); if(!q) return null;
  const k=today(), ex=S.erros.find(e=>e.q===q&&e.t===o.t);
  if(ex){ ex.n=(ex.n||1)+1; ex.etapa=0; ex.prox=addDays(k,1); ex.done=false; ex.last=k; if(o.opts){ ex.opts=o.opts.slice(); ex.right=o.right; } if(o.chute) ex.chute=true; return ex; }
  const e={id:uid(),t:o.t,q,opts:o.opts?o.opts.slice():null,right:o.opts?o.right:null,x:o.x||'',steps:o.steps||null,src:o.src||'q',
    errei:q,regra:(o.opts&&o.right!=null?'Correta: '+o.opts[o.right]:'')+(o.x?(o.opts?'. ':'')+o.x:''),tipo:o.chute?'Chute':'Conteúdo',criado:k,prox:addDays(k,1),etapa:0,done:false,n:1,tempo:o.tempo||null,auto:true,chute:!!o.chute};
  S.erros.push(e); return e;
}
