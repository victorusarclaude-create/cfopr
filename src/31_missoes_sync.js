
/* ===================== MISSÕES DO DIA =====================
   Quatro tarefas curtas, escolhidas a cada dia pelo que mais rende agora.
   O progresso conta a partir do momento em que a missão é criada. */
const MIS_XP=25, MIS_BONUS=60;
function misMetric(d,m){
  switch(m.type){
    case 'cards': return d.c||0;
    case 'erros': return d.rf||0;
    case 'quiz': return d.q||0;
    case 'game': return m.gid?((d.gp||{})[m.gid]||0):(d.gcount||0);
    case 'focus': return d.min||0;
    case 'redacao': return d.red||0;
    case 'sim': return d.sims||0;
  }
  return 0;
}
function buildMissions(){
  const d=Dm(today()), list=[], wd=dateOf(today()).getDay();
  const fd=totalFlashDue(), ed=rfDue().length, rec=recGame();
  const add=(type,target,label,extra)=>{ const m=Object.assign({id:type,type,target,label,done:false},extra||{}); m.base=misMetric(d,m); list.push(m); };
  if(fd>0) add('cards',Math.min(fd,20),'Revisar '+Math.min(fd,20)+' flashcards vencidos');
  else add('cards',10,'Estudar 10 flashcards');
  if(ed>0) add('erros',Math.min(ed,8),'Refazer '+Math.min(ed,8)+(Math.min(ed,8)===1?' erro do caderno':' erros do caderno'));
  else add('quiz',10,'Resolver 10 questões');
  if(rec) add('game',1,'Jogar: '+rec.title,{gid:rec.id,sid:rec.s});
  if(wd===6) add('redacao',1,'Escrever e corrigir uma redação');
  else if(wd===0) add('sim',1,'Fazer um simulado');
  else add('focus',25,'Estudar 25 minutos com o cronômetro');
  d.mis={v:1,list,bonus:false};
  return d.mis;
}
function missions(){ const d=Dm(today()); return (d.mis&&d.mis.v===1)?d.mis:buildMissions(); }
function misProg(m){ const d=D(today()); return clamp(misMetric(d,m)-m.base,0,m.target); }
function checkMissions(){
  const M=missions(); let changed=false;
  M.list.forEach(m=>{ if(!m.done&&misProg(m)>=m.target){ m.done=true; changed=true; gainXP(MIS_XP); FX.celebrate('mission',{label:m.label}); } });
  if(!M.bonus&&M.list.length&&M.list.every(m=>m.done)){ M.bonus=true; changed=true; gainXP(MIS_BONUS); FX.celebrate('allMissions',{}); }
  return changed;
}

/* ===================== CONQUISTAS ===================== */
function totals(){ let q=0,g=0,c=0,rf=0,meta=0,mis=0; for(const k in S.days){ const d=S.days[k]; q+=d.q||0; g+=d.g||0; c+=d.c||0; rf+=d.rf||0; if(d.meta) meta++; if(d.mis&&d.mis.bonus) mis++; } return {q,g,c,rf,meta,mis}; }
const ACH=[
 ['q1','Primeira questão','Registrou a primeira questão.',t=>t.q>=1],['q100','Centena','100 questões feitas.',t=>t.q>=100],['q500','Quinhentas','500 questões feitas.',t=>t.q>=500],['q1000','Mil questões','1.000 questões feitas.',t=>t.q>=1000],
 ['g100','Jogador','100 itens de minigame.',t=>t.g>=100],['g500','Treino pesado','500 itens de minigame.',t=>t.g>=500],['c100','Memória de elefante','100 flashcards revisados.',t=>t.c>=100],['c1000','Mil cartões','1.000 flashcards revisados.',t=>t.c>=1000],
 ['s3','Engrenou','3 dias seguidos de estudo.',()=>bestStreak()>=3],['s7','Uma semana de prontidão','7 dias seguidos de estudo.',()=>bestStreak()>=7],['s30','Disciplina de oficial','30 dias seguidos de estudo.',()=>bestStreak()>=30],
 ['p1','Primeiro piso','Venceu o degrau fácil de um tópico.',()=>Object.values(S.topics).some(x=>x.rung>=1)],['p10','Dez pisos','Venceu o fácil em 10 tópicos.',()=>Object.values(S.topics).filter(x=>x.rung>=1).length>=10],['dom1','Dominado','Primeiro tópico dominado.',()=>Object.values(S.topics).some(x=>x.rung>=3)],
 ['sim1','Primeiro simulado','Terminou um simulado.',()=>S.sims.length>=1],['sim70','Aprovado no treino','Simulado de 10+ questões com 70% ou mais.',()=>S.sims.some(x=>x.n>=10&&x.ok/x.n>=0.7)],
 ['lv40','Intermediário','Uma matéria no nível intermediário.',()=>SUBJECTS.some(s=>subjMastery(s.id)>=0.4)],['lv60','Avançado','Uma matéria no nível avançado.',()=>SUBJECTS.some(s=>subjMastery(s.id)>=0.6)],['proj35','Acima do corte','Projeção de 35 acertos ou mais.',()=>overall().proj>=35],
 ['t801','Primeiro selo 80/20','Passou no primeiro Teste 80/20.',()=>Object.values(S.t80).some(x=>x.passed)],['t805','Cinco selos 80/20','Cinco tópicos com selo 80/20.',()=>Object.values(S.t80).filter(x=>x.passed).length>=5],
 ['rf10','Trabalhando os erros','Refez 10 erros do caderno.',t=>t.rf>=10],['cons10','Dez erros vencidos','Consolidou 10 erros.',()=>S.erros.filter(e=>e.done).length>=10],
 ['meta1','Meta batida','Bateu a meta diária de XP.',t=>t.meta>=1],['meta7','Semana cheia','Bateu a meta em 7 dias.',t=>t.meta>=7],['mis1','Missão cumprida','Completou todas as missões de um dia.',t=>t.mis>=1],['mis10','Oficial de dia','Completou todas as missões em 10 dias.',t=>t.mis>=10],
 ['lvl5','Nível 5','Chegou ao nível 5.',()=>levelFromXP(xpTotal()).L>=5],['lvl10','Nível 10','Chegou ao nível 10.',()=>levelFromXP(xpTotal()).L>=10],['lvl20','Nível 20','Chegou ao nível 20.',()=>levelFromXP(xpTotal()).L>=20],
 ['boss1','Chefão derrotado','Venceu o Chefão de uma matéria.',()=>Object.values(S.modes).some(x=>x&&x.wins>0)],['boss5','Caçador de chefões','Venceu o Chefão em 5 matérias.',()=>Object.values(S.modes).filter(x=>x&&x.wins>0).length>=5],
 ['rel20','Relâmpago','Fez 20 pontos no modo Relâmpago.',()=>Object.values(S.modes).some(x=>x&&x.rel>=20)],['red1','Primeira redação','Registrou a primeira redação.',()=>S.redacoes.length>=1]
];
function checkAch(silent){
  const t=totals(), k=today(), nw=[];
  ACH.forEach(([id,nome,,fn])=>{ if(!S.ach[id]){ let ok=false; try{ ok=fn(t); }catch(e){} if(ok){ S.ach[id]=k; nw.push(nome); } } });
  if(nw.length&&!silent){ gainXP(40*nw.length); FX.celebrate('ach',{names:nw}); }
  return nw.length>0;
}

/* ===================== GRAVAÇÃO LOCAL + DESFAZER ===================== */
let undoStack=[];
function saveLocal(){ try{ localStorage.setItem(LS,JSON.stringify(S)); }catch(e){} }
function commit(){ S.updatedAt=Date.now(); invalidateTI(); saveLocal(); SYNC.markDirty(); }
function replaceState(o){ S=o; invalidateTI(); saveLocal(); }

/* ===================== SINCRONIZAÇÃO NA CONTA =====================
   Cada aparelho guarda tudo localmente. Na nuvem, o estado é dividido em seções
   (cada documento tem limite de 256 KiB) e um manifesto aponta a versão atual.
   Ninguém sobrescreve às cegas: antes de gravar, o app confere se a nuvem mudou
   e, se mudou, mescla as duas versões. Assim um aparelho novo nunca apaga o antigo. */
const SECTIONS={days:['days','visits'],erros:['erros'],cards:['flashcards','cardDel'],mst:['mst','gm'],bank:['qbank','notes']};
const CHUNK=40000;
function sectionsOf(st){
  const out={}, used=new Set();
  Object.keys(SECTIONS).forEach(k=>{ const o={}; SECTIONS[k].forEach(f=>{ o[f]=st[f]; used.add(f); }); out[k]=JSON.stringify(o); });
  const core={}; Object.keys(st).forEach(f=>{ if(!used.has(f)&&f!=='updatedAt') core[f]=st[f]; }); out.core=JSON.stringify(core);
  return out;
}
const DEV=(()=>{ let d=lsGet(LS_DEV,null); if(!d){ d=uid(); lsSet(LS_DEV,d); } return d; })();
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const SYNC={
  ref:null, parts:null, oldRef:null, mode:'local', t:null, ver:0, tries:0, q:Promise.resolve(), pushQueued:false, unsub:null,
  meta:Object.assign({uid:null,base:null,hashes:{},ns:{},dirty:false},lsGet(LS_SYNC,{})),
  saveMeta(){ lsSet(LS_SYNC,this.meta); },
  markDirty(){ this.ver++; this.meta.dirty=true; this.saveMeta(); this.schedule(2200); },
  schedule(ms){ if(!this.ref) return; clearTimeout(this.t); this.t=setTimeout(()=>this.enqueuePush(),ms); },
  enqueue(fn){ const p=this.q.then(fn).catch(()=>{}); this.q=p; return p; },
  enqueuePush(){ if(this.pushQueued) return; this.pushQueued=true; this.enqueue(async()=>{ this.pushQueued=false; await this.push(); }); },
  setMode(m){ this.mode=m; const el=$('#syncEl'); if(el){ el.className='sync '+m; el.textContent=syncLabel(); } },
  chunkId(k,h,i){ return k+'.'+h+'.'+i; },
  async init(){
    const c=window.claude;
    if(!c||typeof c.use!=='function'){ this.setMode('local'); return; }
    let db=null,user=null;
    try{ [db,user]=await Promise.all([c.use('db'),c.use('user')]); }catch(e){}
    if(!db||!user){ this.setMode('local'); return; }
    let id=null; try{ id=await user.id(); }catch(e){}
    if(!id){ this.setMode('local'); return; }
    if(this.meta.uid&&this.meta.uid!==id){ replaceState(defaultState()); this.meta={uid:id,base:null,hashes:{},ns:{},dirty:false}; onRemoteApplied(); }
    this.meta.uid=id; this.meta.ns=this.meta.ns||{}; this.saveMeta();
    try{
      this.ref=db.doc('data/users/'+id+'/cadete2'); this.parts=this.ref.collection('parts'); this.oldRef=db.doc('data/users/'+id+'/cadete');
    }catch(e){ this.setMode('local'); return; }
    this.setMode('busy');
    await this.enqueue(async()=>{
      try{
        const snap=await this.ref.get(), m=snap.exists?snap.data():null;
        if(m&&m.secs){ if(m.rev!==this.meta.base) await this.pull(m); }
        else{
          let R=null;
          try{ const old=await this.oldRef.get(); if(old.exists){ const od=old.data(); if(od&&typeof od.data==='string') R=migrate(JSON.parse(od.data)); } }catch(e){}
          if(R){ replaceState(hasData(S)?migrate(mergeState(S,R)):R); onRemoteApplied(); }
          this.ver++; this.meta.dirty=true; this.saveMeta();
        }
        this.setMode('ok');
      }catch(e){ this.setMode('offline'); }
    });
    try{
      this.unsub=this.ref.onSnapshot(sn=>{
        if(!sn.exists||sn.metadata.hasPendingWrites) return;
        const m=sn.data(); if(m&&m.rev&&m.secs&&m.rev!==this.meta.base) this.enqueue(()=>this.pullLatest());
      },()=>{ this.setMode('offline'); });
    }catch(e){}
    if(this.meta.dirty) this.schedule(500);
  },
  async pullLatest(){ const sn=await this.ref.get(); const m=sn.exists?sn.data():null; if(m&&m.secs&&m.rev!==this.meta.base) await this.pull(m); },
  async readSection(m,k){
    const {h,n}=m.secs[k]; let str='';
    for(let i=0;i<n;i++){ const sn=await this.parts.doc(this.chunkId(k,h,i)).get(); const d=sn.exists?sn.data():null; if(!d||d.h!==h||typeof d.s!=='string') throw {code:'torn'}; str+=d.s; }
    if(hashStr(str)!==h) throw {code:'torn'};
    return JSON.parse(str);
  },
  async pull(m,depth){
    depth=depth||0;
    if(!m||!m.secs) return;
    const got={};
    try{ for(const k in m.secs){ if(this.meta.hashes[k]===m.secs[k].h) continue; got[k]=await this.readSection(m,k); } }
    catch(e){ if(depth<2){ await sleep(1200); const sn=await this.ref.get(); const mm=sn.exists?sn.data():null; if(mm&&mm.secs) return this.pull(mm,depth+1); } return; }
    /* daqui em diante é síncrono: nenhuma ação do usuário se perde no meio */
    const local=sectionsOf(S), fresh=!hasData(S);
    let N=JSON.parse(JSON.stringify(S));
    Object.keys(got).forEach(k=>{
      const remote=got[k], localChanged=hashStr(local[k]||'')!==this.meta.hashes[k];
      if(!localChanged||fresh) Object.assign(N,remote);
      else N=mergeState(N,Object.assign({},N,remote),Object.keys(remote));
    });
    N=migrate(N);
    const now=sectionsOf(N);
    Object.keys(m.secs).forEach(k=>{ this.meta.hashes[k]=m.secs[k].h; this.meta.ns[k]=m.secs[k].n; });
    this.meta.base=m.rev;
    const differs=Object.keys(now).some(k=>!m.secs[k]||hashStr(now[k])!==m.secs[k].h);
    if(differs){ this.ver++; this.meta.dirty=true; } else this.meta.dirty=false;
    this.saveMeta();
    replaceState(N); onRemoteApplied();
    if(differs) this.schedule(800);
  },
  async push(){
    if(!this.ref) return;
    const v0=this.ver;
    try{
      let leased=true;
      try{ const L=await this.ref.acquire({holder:DEV,ttlMs:15000}); leased=!(L&&L.acquired===false); }catch(e){}
      if(!leased){ this.schedule(2500); return; }
      const cur=await this.ref.get(), cm=cur.exists?cur.data():null;
      if(cm&&cm.secs&&cm.rev&&cm.rev!==this.meta.base){ await this.pull(cm); if(this.meta.base!==cm.rev){ this.schedule(3000); return; } }
      const secs=sectionsOf(S), man={v:2,rev:uid(),at:Date.now(),dev:DEV,secs:{}}, old={};
      for(const k in secs){
        const str=secs[k], h=hashStr(str), n=Math.max(1,Math.ceil(str.length/CHUNK)); man.secs[k]={h,n};
        if(this.meta.hashes[k]!==h){
          for(let i=0;i<n;i++) await this.parts.doc(this.chunkId(k,h,i)).set({h,i,s:str.slice(i*CHUNK,(i+1)*CHUNK)});
          if(this.meta.hashes[k]) old[k]={h:this.meta.hashes[k],n:this.meta.ns[k]||1};
        }
      }
      this.meta.base=man.rev;
      await this.ref.set(man);
      Object.keys(man.secs).forEach(k=>{ this.meta.hashes[k]=man.secs[k].h; this.meta.ns[k]=man.secs[k].n; });
      if(this.ver===v0) this.meta.dirty=false;
      this.saveMeta(); this.tries=0; this.setMode('ok');
      Object.keys(old).forEach(k=>{ for(let i=0;i<old[k].n;i++) this.parts.doc(this.chunkId(k,old[k].h,i)).delete().catch(()=>{}); });
      if(this.meta.dirty) this.schedule(1500);
    }catch(e){
      this.tries++; this.setMode(e&&(e.code==='invalid_argument'||e.code==='quota_exceeded')?'err':'offline');
      if(this.tries<7) this.schedule([2000,5000,15000,30000,60000,120000,300000][this.tries-1]);
    }
  }
};
function syncLabel(){ return {ok:'Salvo na sua conta',busy:'Sincronizando…',offline:'Sem conexão: salvo aqui',err:'Erro ao salvar na conta',local:'Salvo neste aparelho'}[SYNC.mode]||'Salvo neste aparelho'; }
function hasData(st){ return Object.values(st.days||{}).some(d=>d&&((d.xp||0)>0||(d.q||0)>0||(d.min||0)>0||(d.c||0)>0))||(st.erros||[]).length>0||Object.keys(st.topics||{}).length>0||(st.redacoes||[]).length>0; }
function onRemoteApplied(){ if(typeof afterRemote==='function') afterRemote(); }

/* Mescla duas versões do estado sem perder estudo de nenhum aparelho. */
function mergeState(A,B,only){
  A=A||{}; B=B||{}; const O=Object.assign({},A), has=k=>!only||only.includes(k);
  const maxN=(x,y)=>Math.max(+x||0,+y||0);
  if(has('days')){ const out={}; new Set(Object.keys(A.days||{}).concat(Object.keys(B.days||{}))).forEach(k=>{
      const a=(A.days||{})[k], b=(B.days||{})[k]; if(!a||!b){ out[k]=JSON.parse(JSON.stringify(a||b)); return; }
      const o={}; new Set(Object.keys(a).concat(Object.keys(b))).forEach(f=>{
        const x=a[f], y=b[f];
        if(typeof x==='number'||typeof y==='number') o[f]=maxN(x,y);
        else if(typeof x==='boolean'||typeof y==='boolean') o[f]=!!(x||y);
        else if(f==='mis') o[f]=((a.xp||0)>=(b.xp||0)?x:y)||x||y;
        else if(f==='gp'||f==='done'){ o[f]={}; new Set(Object.keys(x||{}).concat(Object.keys(y||{}))).forEach(g=>{ const u=(x||{})[g], w=(y||{})[g]; o[f][g]=(typeof u==='number'||typeof w==='number')?maxN(u,w):(u||w); }); }
        else if(f==='bs'){ o[f]={}; new Set(Object.keys(x||{}).concat(Object.keys(y||{}))).forEach(s=>{ const u=(x||{})[s]||{}, w=(y||{})[s]||{}; o[f][s]={q:maxN(u.q,w.q),a:maxN(u.a,w.a)}; }); }
        else o[f]=x!=null?x:y;
      }); out[k]=o; });
    O.days=out; }
  if(has('visits')) O.visits=Object.assign({},B.visits||{},A.visits||{});
  if(has('erros')){ const map=new Map(); const key=e=>e.q?('q:'+e.t+':'+e.q):('id:'+e.id);
    (B.erros||[]).concat(A.erros||[]).forEach(e=>{ if(!e) return; const k=key(e), p=map.get(k); if(!p){ map.set(k,e); return; }
      const score=x=>(x.last||x.criado||'')+'|'+String(x.n||1).padStart(4,'0')+'|'+String(x.etapa||0);
      map.set(k,score(e)>=score(p)?Object.assign({},e,{n:Math.max(e.n||1,p.n||1)}):Object.assign({},p,{n:Math.max(e.n||1,p.n||1)})); });
    O.erros=[...map.values()]; }
  if(has('flashcards')){ const out={}; new Set(Object.keys(A.flashcards||{}).concat(Object.keys(B.flashcards||{}))).forEach(t=>{
      const map=new Map(); (B.flashcards&&B.flashcards[t]||[]).concat(A.flashcards&&A.flashcards[t]||[]).forEach(c=>{ if(!c) return; const p=map.get(c.f); if(!p){ map.set(c.f,c); return; }
        const sc=x=>(x.lr||0)*1e3+(x.reps||0)+(x.seen?0.5:0); map.set(c.f,sc(c)>=sc(p)?c:p); });
      const del=new Set([].concat((A.cardDel||{})[t]||[],(B.cardDel||{})[t]||[]));
      out[t]=[...map.values()].filter(c=>!(del.has(c.f)&&!c.custom)); });
    O.flashcards=out; }
  if(has('cardDel')){ O.cardDel={}; new Set(Object.keys(A.cardDel||{}).concat(Object.keys(B.cardDel||{}))).forEach(t=>{ O.cardDel[t]=[...new Set([].concat((A.cardDel||{})[t]||[],(B.cardDel||{})[t]||[]))]; }); }
  if(has('mst')){ O.mst={}; new Set(Object.keys(A.mst||{}).concat(Object.keys(B.mst||{}))).forEach(t=>{ const a=(A.mst||{})[t]||{}, b=(B.mst||{})[t]||{}; O.mst[t]={};
      new Set(Object.keys(a).concat(Object.keys(b))).forEach(s=>{ const x=a[s], y=b[s]; O.mst[t][s]=!x?y:!y?x:((x.d>y.d||(x.d===y.d&&x.n>=y.n))?x:y); }); }); }
  if(has('gm')) O.gm=Object.assign({},B.gm||{},A.gm||{});
  if(has('qbank')){ O.qbank={}; new Set(Object.keys(A.qbank||{}).concat(Object.keys(B.qbank||{}))).forEach(t=>{ const seen=new Set(), arr=[]; [].concat((B.qbank||{})[t]||[],(A.qbank||{})[t]||[]).forEach(q=>{ if(q&&!seen.has(q.q)){ seen.add(q.q); arr.push(q); } }); O.qbank[t]=arr.slice(-15); }); }
  if(has('notes')){ O.notes=Object.assign({},A.notes||{}); Object.keys(B.notes||{}).forEach(t=>{ const x=O.notes[t], y=B.notes[t]; if(!x||(y&&(y.at||0)>(x.at||0))) O.notes[t]=y; }); }
  if(has('topics')){ O.topics={}; new Set(Object.keys(A.topics||{}).concat(Object.keys(B.topics||{}))).forEach(t=>{ const x=(A.topics||{})[t], y=(B.topics||{})[t]; O.topics[t]=!x?y:!y?x:(((x.tf||0)>(y.tf||0)||((x.tf||0)===(y.tf||0)&&(x.last||'')>=(y.last||'')))?x:y); }); }
  if(has('topicList')){ O.topicList={}; new Set(Object.keys(A.topicList||{}).concat(Object.keys(B.topicList||{}))).forEach(s=>{ const ids=new Set(), arr=[]; [].concat((A.topicList||{})[s]||[],(B.topicList||{})[s]||[]).forEach(t=>{ if(t&&!ids.has(t.id)){ ids.add(t.id); arr.push(t); } }); O.topicList[s]=arr; }); }
  if(has('redacoes')){ const ids=new Set(); O.redacoes=[].concat(A.redacoes||[],B.redacoes||[]).filter(r=>r&&!ids.has(r.id)&&ids.add(r.id)).sort((a,b)=>(a.data||'')<(b.data||'')?-1:1); }
  if(has('sims')){ const ids=new Set(); O.sims=[].concat(A.sims||[],B.sims||[]).filter(x=>{ const k=[x.d,x.n,x.ok,x.secs].join('|'); if(ids.has(k)) return false; ids.add(k); return true; }).sort((a,b)=>(a.d||'')<(b.d||'')?-1:1).slice(-60); }
  if(has('ach')){ O.ach=Object.assign({},A.ach||{}); Object.keys(B.ach||{}).forEach(k=>{ if(!O.ach[k]||B.ach[k]<O.ach[k]) O.ach[k]=B.ach[k]; }); }
  if(has('t80')){ O.t80={}; new Set(Object.keys(A.t80||{}).concat(Object.keys(B.t80||{}))).forEach(t=>{ const x=(A.t80||{})[t]||{}, y=(B.t80||{})[t]||{}; O.t80[t]={tries:maxN(x.tries,y.tries),best:maxN(x.best,y.best),passed:!!(x.passed||y.passed)}; }); }
  if(has('gb')){ O.gb={}; new Set(Object.keys(A.gb||{}).concat(Object.keys(B.gb||{}))).forEach(g=>{ const x=(A.gb||{})[g]||{}, y=(B.gb||{})[g]||{}; O.gb[g]={best:maxN(x.best,y.best),plays:maxN(x.plays,y.plays)}; }); }
  if(has('modes')){ O.modes={}; new Set(Object.keys(A.modes||{}).concat(Object.keys(B.modes||{}))).forEach(s=>{ const x=(A.modes||{})[s]||{}, y=(B.modes||{})[s]||{}; O.modes[s]={wins:maxN(x.wins,y.wins),best:maxN(x.best,y.best),rel:maxN(x.rel,y.rel)}; }); }
  if(has('games')) O.games=Object.assign({},B.games||{},A.games||{});
  if(has('hist')) O.hist=Object.assign({},A.hist||{},B.hist||{});
  if(has('cfg')) O.cfg=((B.cfg||{}).at||0)>((A.cfg||{}).at||0)?B.cfg:A.cfg;
  if(has('welcomed')) O.welcomed=!!(A.welcomed||B.welcomed);
  if(has('streakMig')) O.streakMig=[A.streakMig,B.streakMig].filter(Boolean).sort()[0]||today();
  if(has('newsV')) O.newsV=Math.max(A.newsV||0,B.newsV||0);
  return O;
}
