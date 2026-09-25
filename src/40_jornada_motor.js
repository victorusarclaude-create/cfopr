/* ===================== JORNADA DO PARANÁ: MOTOR E TELAS =====================
   A história do Paraná contada em capítulos, na ordem em que aconteceu. Cada cena acende no mapa
   as regiões, cidades e caminhos de que o texto fala. Perguntas de 4 opções, toques no mapa e
   ordenação fixam o fato na hora; no fim do capítulo, uma revisão curta mistura o capítulo com
   um erro antigo. Progresso em S.jn.c[id] = {p: cena mais longe, d: concluído, st: estrelas,
   w: perguntas erradas}, sincronizado entre aparelhos. */
const JN_BY=Object.fromEntries(JN_CAP.map((c,i)=>[c.id,i]));
/* enquadramentos: [lon oeste, lon leste, lat sul, lat norte] */
const JN_Z={pr:[-54.75,-47.95,-26.8,-22.4],wide:null,leste:[-50.7,-47.95,-26.3,-24.3],litoral:[-49.45,-48.05,-26.05,-24.95],cg:[-50.9,-49.1,-26.2,-23.9],
  norte:[-53.7,-49.3,-24.5,-22.35],oeste:[-54.9,-51.9,-26.7,-23.4],sul:[-52.9,-49.4,-27.1,-25.1],centro:[-53.2,-50.2,-26.8,-24.5]};
const JN_ZN={pr:'Paraná',leste:'Leste',litoral:'Litoral',cg:'Campos Gerais',norte:'Norte',oeste:'Oeste',sul:'Sul e Contestado',centro:'Centro-Sul',wide:'Com vizinhos'};
const JN_RTN={peabiru:'Caminho do Peabiru (traçado aproximado)',cabeza:'Rota de Cabeza de Vaca, 1541–1542 (aprox.)',bandeiras:'Bandeiras paulistas rumo ao Guairá',
  itupava:'Caminho do Itupava',tropas:'Caminho de Viamão (Estrada das Tropas)',guarapuava:'Real Expedição a Guarapuava (1809–1810)',palmas:'Rumo aos Campos de Palmas (1839)',
  missoes:'Caminho das Missões',graciosa:'Estrada da Graciosa (1873)',ferrovia:'Ferrovia Paranaguá–Curitiba (1885)',ferropg:'Ferrovia até Ponta Grossa (1894)',
  sprg:'Ferrovia São Paulo–Rio Grande (1910)',paulistas_norte:'Paulistas rumo ao Norte',mineiros_norte:'Mineiros rumo ao Norte',cafe:'Frente do café e ferrovia do Norte',
  sulistas_sudoeste:'Gaúchos e catarinenses rumo ao Sudoeste',sulistas_oeste:'Gaúchos e catarinenses rumo ao Oeste'};
const JN_ARROW=new Set(['bandeiras','paulistas_norte','mineiros_norte','sulistas_sudoeste','sulistas_oeste']);
const JN_AREAN={guaira:'Província del Guairá (espanhola)',contestado:'Área do Contestado, disputada com SC (aprox.)',iguacu:'Território Federal do Iguaçu, 1943–1946 (aprox.)'};
const JN_MAIN_RIV=['parana','paranapanema','iguacu'];
const JN_MAJOR=['Curitiba','Paranaguá','Ponta Grossa','Castro','Lapa','Guarapuava','Palmas','Londrina','Maringá','Cascavel','Foz do Iguaçu','Francisco Beltrão','União da Vitória','Jacarezinho','Umuarama','Campo Mourão','Guaíra','Paranavaí','Toledo'];
const JN_INFO={
  litoral:'Faixa baixa entre o mar e a Serra do Mar. Paranaguá (primeira vila, 1648), Antonina, Morretes, Guaratuba, Guaraqueçaba, Ilha do Mel. Sambaquis, ouro de aluvião no século XVII e porto da erva-mate.',
  curitiba:'Primeiro Planalto, logo atrás da Serra do Mar. Curitiba (pelourinho em 1668, vila em 1693, capital desde 1853), colônias de imigrantes ao redor da capital, Rio Negro (colônia alemã de 1829) e o Vale do Ribeira.',
  camposgerais:'Segundo Planalto, campos naturais entre a Escarpa Devoniana e a Serra Geral. Ponta Grossa, Castro, Lapa, Palmeira, Jaguariaíva, Tibagi. Fazendas de gado e pousos do Caminho de Viamão, Cerco da Lapa (1894), holandeses em Carambeí (1911).',
  sudeste:'Vale do Iguaçu, no Segundo Planalto: Irati, Prudentópolis, São Mateus do Sul, Mallet, União da Vitória. Erva-mate, madeira, colônias de poloneses e ucranianos. Faz divisa com a antiga área do Contestado.',
  guarapuava:'Terceiro Planalto. Campos dos Kaingang, conquistados pela Real Expedição de 1810. Guarapuava, Pitanga, Candói.',
  palmas:'Campos do extremo sul, ocupados em 1839–1840. Palmas e Clevelândia, cujo nome homenageia Grover Cleveland, o árbitro da Questão de Palmas (1895).',
  sudoeste:'Colonizado por gaúchos e catarinenses a partir dos anos 1940 (CANGO, 1943). Francisco Beltrão, Pato Branco, Capanema. Revolta dos Posseiros (1957).',
  oeste:'Fronteira com Paraguai e Argentina. Obrages de erva-mate e madeira, Colônia Militar de Foz do Iguaçu (1889), Território do Iguaçu (1943–1946), colonização da MARIPÁ (Toledo, 1946), Cascavel, Itaipu (1984) e as Cataratas.',
  nortepioneiro:'Norte Velho, colado em São Paulo. Ocupado por mineiros e paulistas desde o século XIX; primeiros cafezais. Jacarezinho, Santo Antônio da Platina, Cornélio Procópio, Tomazina.',
  nortenovo:'Colonizado pela Companhia de Terras Norte do Paraná (1925): Londrina (1929), Maringá (1947), Apucarana, Rolândia. Terra roxa e café; Guerra de Porecatu (1948–1951).',
  noroeste:'Norte Novíssimo: Paranavaí, Umuarama, Cianorte. Última frente do café, nos anos 1950. Serra dos Dourados, terra dos Xetá.',
  centro:'Campo Mourão e Vale do Ivaí. Passagem do Caminho do Peabiru (a cidade de Peabiru) e da antiga Villa Rica del Espíritu Santo, às margens do Ivaí.'};

function jnPeek(id){ return ((S.jn||{}).c||{})[id]||{p:0,d:0,st:0,w:[]}; }
function jnRec(id){ const J=S.jn||(S.jn={}), c=J.c||(J.c={}); return c[id]||(c[id]={p:0,d:0,st:0,w:[]}); }
function jnOpen(ci){ return ci===0||!!jnPeek(JN_CAP[ci-1].id).d; }
function jnCurIdx(){ const i=JN_CAP.findIndex(c=>!jnPeek(c.id).d); return i<0?JN_CAP.length-1:i; }
function jnDoneN(){ return JN_CAP.filter(c=>jnPeek(c.id).d).length; }
function jnStarted(){ return JN_CAP.some(c=>{ const r=jnPeek(c.id); return r.p>0||r.d; }); }
function jnConquered(){ const s=new Set(); JN_CAP.forEach(c=>{ if(jnPeek(c.id).d) (c.reg||[]).forEach(r=>s.add(r)); }); return [...s]; }
function jnIsQ(s){ return !!(s&&(s.q||s.qm||s.qo)); }

/* ---------- mapa ---------- */
const JN_BASE={z:'pr',l:['rios'],r:[],r2:[],c:[],rt:[],a:[],rv:[],lg:null};
function jnState(cap,si){
  let st=Object.assign({},JN_BASE);
  for(let i=0;i<=si&&i<cap.sc.length;i++){ const m=cap.sc[i].m; if(m) st=Object.assign({},st,m); }
  const s=cap.sc[si];
  if(s&&s.qm) st=Object.assign({},st,{r:[],r2:[],a:[],c:[],rt:[],rv:[],lg:null,z:s.z||'pr'});
  return st;
}
function jnProj(lon,lat){ const p=JN_GEO.pj; return [(lon-p[0])*p[2],(p[1]-lat)*p[3]]; }
function jnZoom(z){
  const G=JN_GEO, b=JN_Z[z]; if(!b) return [0,0,1];
  const a=jnProj(b[0],b[3]), c=jnProj(b[1],b[2]), bw=c[0]-a[0], bh=c[1]-a[1], s=Math.min(G.W/bw,G.H/bh);
  return [+(G.W/2-s*(a[0]+bw/2)).toFixed(1),+(G.H/2-s*(a[1]+bh/2)).toFixed(1),+s.toFixed(3)];
}
const jnHas=(a,v)=>!!a&&a.indexOf(v)>=0;
function jnAria(st){ const G=JN_GEO, p=[]; if(st.r.length) p.push('em destaque: '+st.r.map(r=>G.reg[r].n).join(', ')); if(st.c.length) p.push('cidades: '+st.c.join(', ')); if(st.rt.length) p.push('caminhos: '+st.rt.map(k=>JN_RTN[k]).join(', ')); return 'Mapa do Paraná'+(p.length?'; '+p.join('; '):''); }
/* o: {prev: estado anterior (anima o que é novo), tap: {act, right:[ids], bad:id}, atlas, mini, quiz: sem rótulos, para o mapa não entregar a resposta} */
function jnMap(st,o){
  o=o||{}; const G=JN_GEO, pv=o.prev||st, z=jnZoom(st.z||'pr'), z0=jnZoom(pv.z||'pr'), s=z[2], L=st.l||[], atlas=!!o.atlas, mini=!!o.mini, tap=o.tap;
  const nw=(k,v)=>!mini&&pv!==st&&!jnHas(pv[k],v);
  const u=v=>+(v/s).toFixed(2);
  let h='<svg viewBox="0 0 '+G.W+' '+G.H+'" class="jnsvg'+(mini?' mini':'')+'" style="--zs:'+s+'" role="img" aria-label="'+esc(jnAria(st))+'"><rect class="jn-sea" width="'+G.W+'" height="'+G.H+'"/>';
  h+='<g class="jz" data-z0="'+z0.join(',')+'" data-z1="'+z.join(',')+'" style="transform:translate('+z[0]+'px,'+z[1]+'px) scale('+s+')">';
  G.nb.forEach(n=>{ h+='<path class="jn-nb" d="'+n.d+'"/>'; });
  if(jnHas(st.a,'contestado')) h+='<path class="jn-area a-contestado'+(nw('a','contestado')?' new':'')+'" d="'+G.area.contestado+'"/>';
  Object.keys(G.reg).forEach(id=>{
    let c='jn-rg';
    if(jnHas(st.r,id)) c+=' on'+(nw('r',id)?' new':''); else if(jnHas(st.r2,id)) c+=' on2'+(nw('r2',id)?' new':'');
    if(tap){ if(jnHas(tap.right,id)) c+=' ok'; else if(tap.bad===id) c+=' bad'; if(tap.act) c+=' tap'; }
    h+='<path class="'+c+'" d="'+G.reg[id].d+'"'+(tap&&tap.act?' data-a="'+tap.act+'" data-r="'+id+'" tabindex="0" role="button" aria-label="'+esc(G.reg[id].n)+'"':'')+'/>';
  });
  h+='<path class="jn-out" d="'+G.out+'"/>';
  ['guaira','iguacu'].forEach(a=>{ if(jnHas(st.a,a)) h+='<path class="jn-area a-'+a+(nw('a',a)?' new':'')+'" d="'+G.area[a]+'"/>'; });
  if(!mini) h+='<path class="jn-lake" d="'+G.lake+'"/>';
  Object.keys(G.riv).forEach(k=>{ if(!(JN_MAIN_RIV.indexOf(k)>=0||jnHas(L,'rios')||atlas)) return; if(mini&&JN_MAIN_RIV.indexOf(k)<0) return;
    h+='<path class="jn-riv'+(jnHas(st.rv,k)?' hi'+(nw('rv',k)?' new':''):'')+'" d="'+G.riv[k].d+'"/>'; });
  if(jnHas(L,'relevo')) Object.keys(G.rel).forEach(k=>{ h+='<path class="jn-rel" d="'+G.rel[k].d+'"/>'; });
  if(jnHas(L,'tord')) h+='<path class="jn-tord" d="'+G.tord+'"/>';
  (st.rt||[]).forEach(k=>{ const d=G.rt[k]; if(!d) return; const n=nw('rt',k);
    h+='<path class="jn-rtc" d="'+d+'"/><path class="jn-rt rt-'+k+(n?' new':'')+'" d="'+d+'"'+(n?' pathLength="1"':'')+(JN_ARROW.has(k)?' marker-end="url(#jnArr)"':'')+'/>'; });
  if(!mini&&!o.quiz){
    h+='<g class="jn-lb">';
    if(jnHas(L,'nb')||atlas) G.nb.forEach(n=>{ h+='<text class="jl-nb" x="'+n.c[0]+'" y="'+n.c[1]+'">'+esc(n.n.toUpperCase())+'</text>'; });
    if(jnHas(L,'relevo')){ Object.keys(G.rel).forEach(k=>{ const l=G.rel[k].l; h+='<text class="jl-rel" transform="translate('+l[0]+' '+l[1]+') rotate('+l[2]+')">'+esc(G.rel[k].n)+'</text>'; });
      Object.keys(G.plan).forEach(k=>{ const p=G.plan[k]; h+='<text class="jl-plan" x="'+p[1]+'" y="'+p[2]+'">'+esc(p[0])+'</text>'; }); }
    Object.keys(G.riv).forEach(k=>{ if(!(jnHas(st.rv,k)||(atlas&&jnHas(L,'rios')))) return; const l=G.riv[k].l; h+='<text class="jl-riv" transform="translate('+l[0]+' '+l[1]+') rotate('+l[2]+')">'+esc(G.riv[k].n)+'</text>'; });
    const regL=atlas&&jnHas(L,'regioes')?Object.keys(G.reg):(st.r||[]).concat(st.r2||[]);
    if(tap&&tap.right) tap.right.forEach(r=>{ if(regL.indexOf(r)<0) regL.push(r); });
    regL.forEach(id=>{ const c=G.reg[id].c; h+='<text class="jl-reg'+(jnHas(st.r,id)||jnHas(st.r2,id)?' hi':'')+'" x="'+c[0]+'" y="'+c[1]+'">'+esc(G.reg[id].n.replace(/ \(.*\)$/,''))+'</text>'; });
    let cities=st.c||[];
    if(atlas&&jnHas(L,'cidades')) cities=Object.keys(G.city).filter(n=>s>=1.6||JN_MAJOR.indexOf(n)>=0||jnHas(st.c,n));
    cities.forEach(n=>{ const p=G.city[n]; if(!p) return; const hi=jnHas(st.c,n);
      h+='<g class="jn-city'+(hi?' hi':'')+(hi&&nw('c',n)?' new':'')+'" transform="translate('+p[0]+' '+p[1]+')"><circle r="'+u(hi?3.4:2.4)+'"/><text x="'+u(5)+'" y="'+u(3.6)+'">'+esc(n)+'</text></g>'; });
    h+='</g>';
  }
  return h+'</g></svg>';
}
function jnLegend(st){
  const G=JN_GEO, it=[];
  if(st.r.length) it.push('<span><i class="lg-r"></i>'+esc(st.lg&&st.lg[0]||st.r.map(r=>G.reg[r].n.replace(/ \(.*\)$/,'')).join(', '))+'</span>');
  if(st.r2.length) it.push('<span><i class="lg-r2"></i>'+esc(st.lg&&st.lg[1]||st.r2.map(r=>G.reg[r].n.replace(/ \(.*\)$/,'')).join(', '))+'</span>');
  (st.rt||[]).forEach(k=>it.push('<span><i class="lg-rt rt-'+k+'"></i>'+esc(JN_RTN[k])+'</span>'));
  (st.a||[]).forEach(a=>it.push('<span><i class="lg-a a-'+a+'"></i>'+esc(JN_AREAN[a])+'</span>'));
  (st.rv||[]).forEach(k=>it.push('<span><i class="lg-riv"></i>'+esc(G.riv[k].n)+'</span>'));
  if(jnHas(st.l,'relevo')) it.push('<span><i class="lg-rel"></i>Degraus do relevo</span>');
  if(jnHas(st.l,'tord')) it.push('<span><i class="lg-tord"></i>Linha de Tordesilhas (aprox.)</span>');
  return it.length?'<div class="jnleg">'+it.join('')+'</div>':'';
}
/* narração opcional (voz do aparelho): lê cada cena uma vez, ao entrar nela */
function jnHush(){ try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){} }
function jnSpeak(t){ try{ const sp=window.speechSynthesis; if(!sp||!t) return; sp.cancel();
  const u=new SpeechSynthesisUtterance(stripQ(t).replace(/\n+/g,'. ').replace(/[“”]/g,'')); u.lang='pt-BR'; u.rate=1.02;
  const v=(sp.getVoices()||[]).find(x=>/^pt[-_]BR/i.test(x.lang)); if(v) u.voice=v; sp.speak(u); }catch(e){} }
function jnNarrate(){
  const J=tutor.jn; if(!J||UI.tab!=='tutor'||J.view!=='cap'){ if(jnNarrate.k){ jnNarrate.k=null; jnHush(); } return; }
  if(!UI.jnVoz) return; const k=J.ci+':'+J.si; if(jnNarrate.k===k) return; jnNarrate.k=k;
  const s=JN_CAP[J.ci].sc[J.si]; jnSpeak([s.t,s.q||s.qm||s.qo].filter(Boolean).join('\n'));
}
/* movimento de câmera entre cenas: a transformação sai do enquadramento anterior */
function jnAfter(root){
  if(root&&root.id==='app') jnNarrate();
  if(REDUCED||!root) return;
  root.querySelectorAll('.jz').forEach(g=>{ const a=g.dataset.z0, b=g.dataset.z1; if(!a||a===b) return;
    const f=a.split(',').map(Number), t=b.split(',').map(Number);
    g.style.transition='none'; g.style.transform='translate('+f[0]+'px,'+f[1]+'px) scale('+f[2]+')';
    void g.getBoundingClientRect();
    g.style.transition=''; g.style.transform='translate('+t[0]+'px,'+t[1]+'px) scale('+t[2]+')'; g.dataset.z0=b; });
}

/* ---------- navegação e progresso ---------- */
function jnOpenHome(){ clearModes(); tutor.jn={view:'home'}; goTreino(); }
function jnStartCap(ci,from){
  const cap=JN_CAP[ci]; if(!cap||!jnOpen(ci)) return;
  const rec=jnPeek(cap.id); let si=from!=null?from:(rec.d?0:Math.min(rec.p||0,cap.sc.length-1));
  clearModes(); tutor.jn={view:'cap',ci,si,ans:null,perm:null,combo:0,ok:0,n:0,pm:Object.assign({},JN_BASE),pmSi:-1};
  jnPrep(); SND.start(); goTreino();
}
function jnPrep(){ const J=tutor.jn, s=JN_CAP[J.ci].sc[J.si]; J.ans=null; J.perm=s&&(s.q||s.qo)?shuffle(s.o.map((_,i)=>i)):null; }
function jnSave(){ const J=tutor.jn, cap=JN_CAP[J.ci], r=jnRec(cap.id); if(J.si>(r.p||0)) r.p=J.si; commit(); }
function jnGo(d){
  const J=tutor.jn; if(!J||J.view!=='cap') return; const cap=JN_CAP[J.ci];
  if(d>0&&jnIsQ(cap.sc[J.si])&&!(J.ans&&J.ans.done)) return;
  const ni=J.si+d; if(ni<0) return;
  if(ni>=cap.sc.length){ jnReview(); return; }
  J.si=ni; jnPrep(); jnSave(); if(d>0) SND.flip(); animNext('newq'); render(); jnScrollTop();
}
function jnScrollTop(){ const t=$('.jnhead'); window.scrollTo(0,t?Math.max(0,t.getBoundingClientRect().top+window.scrollY-8):0); }
/* resposta: pontua, registra domínio e manda o erro para o caderno */
function jnScore(s,ok,cap,review){
  const J=tutor.jn, tp=s.tp||cap.tp, rec=jnRec(cap.id), key=cap.sc.indexOf(s);
  if(!review){ J.n++; if(ok) J.ok++; } if(ok) J.combo++; else J.combo=0;
  if(ok){ if(J.combo>=2) SND.combo(J.combo); else SND.ok(); buzz(12); } else { SND.bad(); buzz([25,40,25]); }
  gainXP(ok?(review?6:(rec.d?3:10)):2);
  addEv(tp,'game',1,ok?1:0,review?3:2);
  if(!ok){ if(rec.w.indexOf(key)<0) rec.w.push(key); if(rec.w.length>30) rec.w.shift();
    if(s.q) try{ errFromQ({t:tp,q:s.q,opts:s.o.slice(),right:0,x:s.x||'',src:'game'}); }catch(e){} }
  else { const i=rec.w.indexOf(key); if(i>=0&&review) rec.w.splice(i,1); }
  commit();
}

/* ---------- revisão do capítulo ---------- */
function jnReview(){
  const J=tutor.jn, cap=JN_CAP[J.ci];
  const own=cap.sc.filter(s=>s.q||s.qm).map(s=>({cap:J.ci,s}));
  const items=shuffle(own).slice(0,5);
  const old=[]; JN_CAP.slice(0,J.ci).forEach((c,ci)=>{ const r=jnPeek(c.id); (r.w||[]).forEach(k=>{ const s=c.sc[k]; if(s&&(s.q||s.qm)) old.push({cap:ci,s,old:1}); }); });
  if(!old.length&&J.ci>0){ const ci=Math.floor(Math.random()*J.ci), qs=JN_CAP[ci].sc.filter(s=>s.q); if(qs.length) old.push({cap:ci,s:qs[Math.floor(Math.random()*qs.length)],old:1}); }
  if(old.length) items.splice(Math.min(2,items.length),0,old[Math.floor(Math.random()*old.length)]);
  J.view='rev'; J.items=items; J.pos=0; J.rok=0; J.res=[]; J.combo=0; J.ans=null; J.perm=items.length&&items[0].s.q?shuffle([0,1,2,3]):null;
  animNext(); render(); jnScrollTop();
}
function jnRevNext(){
  const J=tutor.jn; J.pos++; J.ans=null;
  if(J.pos>=J.items.length){ jnFinish(); return; }
  const s=J.items[J.pos].s; J.perm=s.q?shuffle(s.o.map((_,i)=>i)):null; animNext('newq'); render(); jnScrollTop();
}
function jnFinish(){
  const J=tutor.jn, cap=JN_CAP[J.ci], rec=jnRec(cap.id), n=J.items.length, acc=n?J.rok/n:1;
  const stars=acc>=0.9?3:acc>=0.7?2:acc>=0.5?1:0, first=!rec.d;
  const before=jnConquered();
  rec.d=1; rec.p=cap.sc.length-1; if(stars>(rec.st||0)) rec.st=stars;
  let xp=first?40:10; if(stars===3&&first) xp+=20; gainXP(xp);
  const d=Dm(today()); d.gcount=(d.gcount||0)+1;
  J.view='end'; J.stars=stars; J.xpEnd=xp; J.first=first; J.prevReg=before; J.unl=first&&J.ci+1<JN_CAP.length?J.ci+1:null;
  FX.hold(1700); snapWeek(); commit(); afterAction(); animNext(); render(); window.scrollTo(0,0);
  SND.stars(stars,first&&(stars===3||J.unl!=null)); if(first) setTimeout(()=>FX.confetti(stars===3?1:0.6),(0.4+0.2*stars)*1000);
}

/* ---------- telas ---------- */
function viewJornada(){ const J=tutor.jn; return J.view==='cap'?viewJnCap():J.view==='rev'?viewJnRev():J.view==='end'?viewJnEnd():viewJnHome(); }
function jnHead(back,kick,title,extra){ return '<div class="ghead jnhead"><button class="backbtn" data-a="'+back+'" aria-label="Voltar">'+ICO.x+'</button><div class="jnh-t"><span class="small muted">'+kick+'</span><h2>'+title+'</h2></div>'+(extra||'')+'</div>'; }
const JN_ATLAS_BTN='<button class="iconbtn jn-atlasbtn" data-a="jnAtlas" aria-label="Abrir o atlas do Paraná"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg></button>';
function viewJnHome(){
  const done=jnDoneN(), cur=jnCurIdx(), all=done===JN_CAP.length, capC=JN_CAP[cur], rc=jnPeek(capC.id);
  let h=jnHead('jnExit','Treino · História do Paraná','Jornada do Paraná',JN_ATLAS_BTN);
  h+='<section class="jnhero"><div class="jnmap jnmap-home">'+jnMap({z:'pr',l:['rios'],r:jnConquered(),r2:[],c:[],rt:[],a:[],rv:[]},{})+'</div>';
  h+='<div class="jnhero-t"><span class="jnkick">'+done+' de '+JN_CAP.length+' capítulos</span><div class="lvlbar"><i style="width:'+Math.round(100*done/JN_CAP.length)+'%"></i></div>';
  h+='<p class="small">'+(all?'Jornada completa. Refaça capítulos para caçar 3 estrelas e revise pelo atlas e pela linha do tempo.':done?'O mapa vai se pintando a cada capítulo concluído.':'A história do Paraná do zero, contada como uma história, com o mapa acendendo a cada fato.')+'</p>';
  h+='<button class="btn primary block" data-a="jnCap" data-i="'+cur+'">'+ICO.play+' '+(all?'Rever o último capítulo':(rc.p>0?'Continuar':'Começar')+': capítulo '+cur)+'</button></div></section>';
  h+='<div class="jntools"><button class="qk" data-a="jnAtlas">'+ICO.target+'<span><b>Atlas</b><em>Mapa com camadas</em></span></button><button class="qk" data-a="jnTime">'+ICO.clock+'<span><b>Linha do tempo</b><em>Todas as datas</em></span></button><button class="qk" data-a="jnPeople">'+ICO.book+'<span><b>Personagens</b><em>Quem é quem</em></span></button></div>';
  h+='<h2>Capítulos</h2><ol class="jnlist">';
  JN_CAP.forEach((c,i)=>{ const r=jnPeek(c.id), open=jnOpen(i), isCur=i===cur&&!all;
    h+='<li class="'+(r.d?'done':'')+(isCur?' cur':'')+(open?'':' locked')+'"><button data-a="jnCap" data-i="'+i+'"'+(open?'':' disabled aria-disabled="true"')+'><span class="jnn">'+(open?i:AR_LOCK)+'</span><span class="jnt"><b>'+esc(c.n)+'</b><span>'+esc(c.era)+' · '+esc(c.t)+'</span>'+(isCur&&r.p>0?'<span class="jnprog"><i style="width:'+Math.round(100*r.p/c.sc.length)+'%"></i></span>':'')+'</span>'+(r.d?arStarsHTML(r.st||0):(isCur?'<span class="pill sm">agora</span>':''))+'</button>'+(r.d?'<button class="linkbtn small jnres" data-a="jnResumo" data-i="'+i+'">Resumo para a prova</button>':'')+'</li>'; });
  return h+'</ol><p class="small muted">Cada capítulo leva de 8 a 15 minutos. O app guarda a cena em que você parou, inclusive entre aparelhos.</p>';
}
function jnOptsHTML(s,perm,ans,act){
  return '<div class="optlist">'+perm.map((oi,j)=>{ let c='alt'; if(ans){ if(oi===0) c+=' right'; else if(ans.j===j) c+=' wrong'; }
    return '<button class="'+c+'" data-a="'+act+'" data-j="'+j+'"'+(ans?' disabled':'')+'><span class="k">'+'ABCD'[j]+'</span><span class="ot">'+esc(s.o[oi])+'</span></button>'; }).join('')+'</div>';
}
function jnFeedback(s,ans){
  if(!ans||!ans.done) return '';
  const ok=ans.ok;
  return '<div class="gfb '+(ok?'ok':'bad')+'"><b>'+(ok?CHECK_SVG+esc(rP(['Isso!','Exato!','Boa!','Mandou bem!','Na mosca!'])):(s.qo?'Quase. A ordem certa é:':'Resposta certa'))+'</b>'+
    (!ok&&s.q?'<p class="ansline">'+esc(s.o[0])+'</p>':'')+(!ok&&s.qm?'<p class="ansline">'+esc([].concat(s.r).map(r=>JN_GEO.reg[r].n).join(' ou '))+'</p>':'')+
    (s.qo&&!ok?'<ol class="steps">'+s.o.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':'')+(s.x?'<p>'+fmtText(s.x)+'</p>':'')+'</div>';
}
function jnQuestionHTML(s,J,act){
  const ans=J.ans; let h='';
  if(s.lb) h+='<span class="revtag">Lembra?</span>';
  if(s.q){ h+='<div class="jnq"><b>'+fmtText(s.q)+'</b></div>'+jnOptsHTML(s,J.perm,ans,act); }
  else if(s.qm){ h+='<div class="jnq"><b>'+fmtText(s.qm)+'</b><span class="small muted jnhint">'+ICO.target+' Toque no mapa</span></div>'; }
  else if(s.qo){ const O=ans||{os:0,oe:0}; h+='<div class="jnq"><b>'+fmtText(s.qo)+'</b><span class="small muted jnhint">Toque na ordem, do primeiro ao último</span></div>';
    h+='<ol class="jnord">'+s.o.slice(0,O.os).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>';
    if(!O.done) h+='<div class="optlist">'+J.perm.filter(i=>i>=O.os).map(i=>'<button class="alt'+(O.bad===i?' wrong':'')+'" data-a="jnOrd" data-i="'+i+'"><span class="ot">'+esc(s.o[i])+'</span></button>').join('')+'</div>'; }
  return h+jnFeedback(s,ans);
}
function viewJnCap(){
  const J=tutor.jn, cap=JN_CAP[J.ci], s=cap.sc[J.si], st=jnState(cap,J.si), prev=J.pmSi===J.si?st:(J.pm||st), n=cap.sc.length;
  J.pm=st; J.pmSi=J.si;
  let tap=null; if(s.qm){ const R=[].concat(s.r); tap=J.ans&&J.ans.done?{right:R,bad:J.ans.ok?null:J.ans.r}:{act:'jnTap'}; }
  let h=jnHead('jnHome','Capítulo '+J.ci+' · '+esc(cap.era),esc(cap.n),JN_ATLAS_BTN);
  h+='<div class="jnbar"><i style="width:'+Math.round(100*(J.si+1)/n)+'%"></i></div>';
  const quiz=jnIsQ(s)&&!(J.ans&&J.ans.done);
  h+='<div class="jnstage"><div class="jnmap">'+jnMap(st,{prev:prev===st?null:prev,tap,quiz})+(s.y?'<span class="jnyear">'+esc(s.y)+'</span>':'')+'</div>'+(quiz?'':jnLegend(st))+'</div>';
  if(s.t) h+='<div class="jncard"><button class="jnvoz'+(UI.jnVoz?' on':'')+'" data-a="jnVoz" aria-pressed="'+(UI.jnVoz?'true':'false')+'" aria-label="'+(UI.jnVoz?'Desligar a narração':'Ouvir o texto em voz alta')+'">'+ICO.sound+'</button>'+fmtText(s.t)+'</div>';
  if(jnIsQ(s)) h+=jnQuestionHTML(s,J,'jnAns');
  const canGo=!jnIsQ(s)||(J.ans&&J.ans.done), last=J.si===n-1;
  if(canGo) h+='<button class="btn primary block nextbtn" data-a="jnNext">'+(last?'Revisão do capítulo':'Continuar')+' <kbd>Enter</kbd></button>';
  if(J.si>0) h+='<div class="row center"><button class="linkbtn small" data-a="jnPrev">Voltar uma cena</button></div>';
  return h;
}
function viewJnRev(){
  const J=tutor.jn, cap=JN_CAP[J.ci], it=J.items[J.pos];
  if(!it) return '';
  const s=it.s, st=s.qm?jnState(JN_CAP[it.cap],JN_CAP[it.cap].sc.indexOf(s)):null;
  let h=jnHead('jnHome','Capítulo '+J.ci+' · revisão','Revisão: '+esc(cap.n));
  h+='<div class="segs">'+J.items.map((_,i)=>'<i class="'+(i<J.pos||(i===J.pos&&J.ans&&J.ans.done)?(J.res&&J.res[i]===false?'bad':'ok'):(i===J.pos?'cur':''))+'"></i>').join('')+'</div>';
  if(it.old) h+='<span class="revtag">Do capítulo '+it.cap+': '+esc(JN_CAP[it.cap].n)+'</span>';
  if(s.qm){ let tap=J.ans&&J.ans.done?{right:[].concat(s.r),bad:J.ans.ok?null:J.ans.r}:{act:'jnTap'}; h+='<div class="jnstage"><div class="jnmap">'+jnMap(st,{tap})+'</div></div>'; }
  h+=jnQuestionHTML(s,J,'jnAns');
  if(J.ans&&J.ans.done) h+='<button class="btn primary block nextbtn" data-a="jnRevNext">'+(J.pos+1<J.items.length?'Próxima':'Ver resultado')+' <kbd>Enter</kbd></button>';
  return h;
}
function viewJnEnd(){
  const J=tutor.jn, cap=JN_CAP[J.ci], n=J.items.length, nx=J.ci+1<JN_CAP.length?J.ci+1:null;
  let h=jnHead('jnHome','Capítulo '+J.ci+' concluído',esc(cap.n));
  h+='<div class="gend arend">'+arStarsHTML(J.stars)+'<div class="gscore">'+J.rok+'<small>/'+n+'</small></div><p><b>'+(J.stars===3?'Revisão perfeita!':J.stars>=2?'Muito bem!':J.stars===1?'Capítulo concluído.':'Capítulo concluído. Vale refazer a revisão.')+'</b></p><p class="small muted">+'+J.xpEnd+' XP no capítulo'+(J.n?' · '+J.ok+' de '+J.n+' certas na história':'')+'</p></div>';
  if(J.first){ const now=jnConquered(); h+='<div class="jnmap jnmap-end">'+jnMap({z:'pr',l:['rios'],r:now,r2:[],c:[],rt:[],a:[],rv:[]},{prev:{z:'pr',r:J.prevReg}})+'</div>'; }
  if(J.unl!=null) h+='<div class="unlockbox">'+ICO.up+'<div><b>Capítulo '+J.unl+' liberado</b><span>'+esc(JN_CAP[J.unl].n)+': '+esc(JN_CAP[J.unl].t)+'</span></div></div>';
  h+='<h3>Para levar para a prova</h3><ul class="jnres">'+cap.res.map(x=>'<li>'+fmtText(x)+'</li>').join('')+'</ul>';
  h+='<div class="stack">'+(nx!=null?'<button class="btn primary block" data-a="jnCap" data-i="'+nx+'">'+ICO.play+' Capítulo '+nx+': '+esc(JN_CAP[nx].n)+'</button>':'')+'<button class="btn block" data-a="jnHome">Voltar à Jornada</button>'+(J.stars<3?'<button class="btn ghost block" data-a="jnRedoRev">Refazer a revisão</button>':'')+'</div>';
  return h;
}

/* ---------- atlas, linha do tempo, personagens, resumo ---------- */
function jnAtlasUI(){ const a=UI.jna||(UI.jna={}); a.z=a.z||'pr'; a.l=a.l||['regioes','rios','cidades']; a.rt=a.rt||[]; a.a=a.a||[]; return a; }
function sheetJnAtlas(){
  const a=jnAtlasUI(), G=JN_GEO, L=a.l;
  const st={z:a.z,l:L.concat(L.indexOf('vizinhos')>=0?['nb']:[]),r:a.sel?[a.sel]:[],r2:[],c:[],rt:a.rt,a:a.a,rv:[]};
  const chip=(act,v,on,lab)=>'<button class="chip'+(on?' on':'')+'" data-a="'+act+'" data-v="'+v+'" aria-pressed="'+(on?'true':'false')+'">'+esc(lab)+'</button>';
  let h='<h2 id="sheetTitle">Atlas do Paraná</h2><p class="small muted">Toque numa região para ler sobre ela. Ligue camadas e caminhos para ver as rotas de cada época.</p>';
  h+='<div class="jnmap jnmap-atlas">'+jnMap(st,{atlas:true,tap:{act:'jnAtlasSel'},prev:a.pz&&a.pz!==a.z?Object.assign({},st,{z:a.pz}):null})+'</div>'; a.pz=null;
  if(a.sel){ const caps=JN_CAP.map((c,i)=>i<JN_CAP.length-1&&((c.reg||[]).indexOf(a.sel)>=0||c.sc.some(s=>s.m&&s.m.r&&s.m.r.length<=5&&jnHas(s.m.r,a.sel)))?i:-1).filter(i=>i>=0);
    h+='<div class="jninfo"><b>'+esc(G.reg[a.sel].n)+'</b><p>'+esc(JN_INFO[a.sel]||'')+'</p>'+(caps.length?'<p class="small muted">Aparece nos capítulos: '+caps.map(i=>'<button class="linkbtn small" data-a="jnResumo" data-i="'+i+'">'+i+'. '+esc(JN_CAP[i].n)+'</button>').join(' · ')+'</p>':'')+'</div>'; }
  h+='<div class="flabel">Enquadramento</div><div class="chips">'+['pr','leste','litoral','cg','norte','centro','oeste','sul','wide'].map(z=>chip('jnAtlasZ',z,a.z===z,JN_ZN[z])).join('')+'</div>';
  h+='<div class="flabel">Camadas</div><div class="chips">'+[['regioes','Nomes das regiões'],['rios','Rios'],['relevo','Relevo'],['cidades','Cidades'],['vizinhos','Vizinhos'],['tord','Tordesilhas']].map(([k,n])=>chip('jnAtlasL',k,L.indexOf(k)>=0,n)).join('')+'</div>';
  h+='<div class="flabel">Caminhos e frentes</div><div class="chips">'+Object.keys(JN_RTN).map(k=>chip('jnAtlasRt',k,a.rt.indexOf(k)>=0,JN_RTN[k])).join('')+'</div>';
  h+='<div class="flabel">Áreas históricas</div><div class="chips">'+Object.keys(JN_AREAN).map(k=>chip('jnAtlasA',k,a.a.indexOf(k)>=0,JN_AREAN[k])).join('')+'</div>';
  h+=jnLegend(Object.assign({},st,{r:[],l:L}));
  openSheet(h,{key:'jnAtlas'});
  jnAfter($('#sheetBody'));
}
function sheetJnTime(){
  let h='<h2 id="sheetTitle">Linha do tempo do Paraná</h2><p class="small muted">Todas as datas da Jornada, em ordem. As de capítulos que você ainda não fez aparecem mais claras.</p>';
  JN_CAP.forEach((c,i)=>{ if(!c.tl||!c.tl.length) return; const on=jnOpen(i);
    h+='<h3>'+i+'. '+esc(c.n)+'</h3><ul class="jntl'+(on?'':' off')+'">'+c.tl.map(([y,t])=>'<li><b>'+esc(y)+'</b><span>'+esc(t)+'</span></li>').join('')+'</ul>'; });
  openSheet(h);
}
function sheetJnPeople(){
  let h='<h2 id="sheetTitle">Personagens</h2><p class="small muted">Quem é quem na história do Paraná, na ordem em que aparecem.</p>';
  JN_CAP.forEach((c,i)=>{ if(!c.pers||!c.pers.length) return; h+='<h3>'+i+'. '+esc(c.n)+'</h3><ul class="jnpeople">'+c.pers.map(([n,d])=>'<li><b>'+esc(n)+'</b><span>'+esc(d)+'</span></li>').join('')+'</ul>'; });
  openSheet(h);
}
function sheetJnResumo(i){
  const c=JN_CAP[i]; if(!c) return;
  let h='<h2 id="sheetTitle">'+i+'. '+esc(c.n)+'</h2><p class="small muted">'+esc(c.era)+' · '+esc(c.t)+'</p><ul class="jnres">'+c.res.map(x=>'<li>'+fmtText(x)+'</li>').join('')+'</ul>';
  if(c.tl&&c.tl.length) h+='<h3>Datas</h3><ul class="jntl">'+c.tl.map(([y,t])=>'<li><b>'+esc(y)+'</b><span>'+esc(t)+'</span></li>').join('')+'</ul>';
  if(jnOpen(i)) h+='<div class="row" style="margin-top:12px"><button class="btn primary block" data-a="jnCap" data-i="'+i+'">'+(jnPeek(c.id).d?'Refazer o capítulo':'Abrir o capítulo')+'</button></div>';
  openSheet(h);
}

/* ---------- ações ---------- */
function jnAnswer(ok,upd){
  const J=tutor.jn, rev=J.view==='rev', it=rev?J.items[J.pos]:null, cap=rev?JN_CAP[it.cap]:JN_CAP[J.ci], s=rev?it.s:cap.sc[J.si];
  J.ans=Object.assign({done:true,ok},upd||{});
  if(rev){ J.res=J.res||[]; J.res[J.pos]=ok; if(ok) J.rok++; }
  jnScore(s,ok,cap,rev);
  render();
}
const JN_A={
  jnOpen:()=>jnOpenHome(),
  jnExit:()=>{ tutor.jn=null; animNext(); render(); window.scrollTo(0,0); },
  jnHome:()=>{ clearModes(); tutor.jn={view:'home'}; animNext(); render(); window.scrollTo(0,0); },
  jnCap:b=>jnStartCap(+b.dataset.i),
  jnNext:()=>jnGo(1),
  jnPrev:()=>jnGo(-1),
  jnRevNext:()=>jnRevNext(),
  jnRedoRev:()=>{ const J=tutor.jn; J.ok=0; J.n=0; jnReview(); },
  jnAns:b=>{ const J=tutor.jn; if(!J||J.ans) return; const j=+b.dataset.j; jnAnswer(J.perm[j]===0,{j}); },
  jnTap:b=>{ const J=tutor.jn; if(!J||(J.ans&&J.ans.done)) return; const rev=J.view==='rev', s=rev?J.items[J.pos].s:JN_CAP[J.ci].sc[J.si]; if(!s||!s.qm) return;
    const r=b.dataset.r; jnAnswer([].concat(s.r).indexOf(r)>=0,{r}); },
  jnOrd:b=>{ const J=tutor.jn, s=JN_CAP[J.ci].sc[J.si]; if(!s||!s.qo) return; const O=J.ans||(J.ans={os:0,oe:0}); if(O.done) return; const i=+b.dataset.i;
    if(i===O.os){ O.os++; O.bad=null; SND.tap(); if(O.os>=s.o.length){ jnAnswer(O.oe===0,{os:O.os,oe:O.oe}); return; } }
    else { O.oe++; O.bad=i; SND.bad(); buzz(20); }
    render(); },
  jnAtlas:()=>sheetJnAtlas(),
  jnAtlasZ:b=>{ const a=jnAtlasUI(); a.pz=a.z; a.z=b.dataset.v; saveUI(); sheetJnAtlas(); },
  jnAtlasL:b=>{ const a=jnAtlasUI(), v=b.dataset.v, i=a.l.indexOf(v); if(i>=0) a.l.splice(i,1); else a.l.push(v); saveUI(); sheetJnAtlas(); },
  jnAtlasRt:b=>{ const a=jnAtlasUI(), v=b.dataset.v, i=a.rt.indexOf(v); if(i>=0) a.rt.splice(i,1); else a.rt.push(v); saveUI(); sheetJnAtlas(); },
  jnAtlasA:b=>{ const a=jnAtlasUI(), v=b.dataset.v, i=a.a.indexOf(v); if(i>=0) a.a.splice(i,1); else a.a.push(v); saveUI(); sheetJnAtlas(); },
  jnAtlasSel:b=>{ const a=jnAtlasUI(); a.sel=a.sel===b.dataset.r?null:b.dataset.r; saveUI(); sheetJnAtlas(); },
  jnVoz:()=>{ UI.jnVoz=!UI.jnVoz; saveUI(); jnNarrate.k=null; if(!UI.jnVoz) jnHush(); render(); toast(UI.jnVoz?'Narração ligada: cada cena é lida em voz alta.':'Narração desligada.'); },
  jnTime:()=>sheetJnTime(),
  jnPeople:()=>sheetJnPeople(),
  jnResumo:b=>sheetJnResumo(+b.dataset.i)
};
Object.assign(A,JN_A);
function jnKeydown(e,k,num){
  const J=tutor.jn; if(!J||UI.tab!=='tutor') return false;
  if(J.view==='cap'){ const s=JN_CAP[J.ci].sc[J.si];
    if(s.q&&!J.ans&&num>=0&&num<4){ JN_A.jnAns({dataset:{j:num}}); return true; }
    if((k==='enter'||k===' ')&&(!jnIsQ(s)||(J.ans&&J.ans.done))){ jnGo(1); return true; }
    if(k==='arrowleft'&&J.si>0){ jnGo(-1); return true; } }
  if(J.view==='rev'){ const s=J.items[J.pos].s;
    if(s.q&&!J.ans&&num>=0&&num<4){ JN_A.jnAns({dataset:{j:num}}); return true; }
    if(k==='enter'&&J.ans&&J.ans.done){ jnRevNext(); return true; } }
  return false;
}
/* cartão de destaque no Treino e na aba de História da Arena */
function jnFeatureCard(){
  const done=jnDoneN(), cur=jnCurIdx(), r=jnPeek(JN_CAP[cur].id), all=done===JN_CAP.length;
  return '<button class="jnfeat" data-a="jnOpen"><span class="jnf-t"><em>Novo · História do Paraná</em><b>Jornada do Paraná</b><span>'+(all?'Completa. Revise pelo atlas e pela linha do tempo.':done||r.p?'Capítulo '+cur+' de '+(JN_CAP.length-1)+': '+esc(JN_CAP[cur].n):'Do zero, contada como história, com o mapa acendendo a cada fato.')+'</span><span class="jnf-go">'+(done||r.p?'Continuar':'Começar')+' '+ICO.arrow+'</span></span><span class="jnf-map">'+jnMap({z:'pr',l:[],r:jnConquered(),r2:[],c:[],rt:[],a:[],rv:[]},{mini:true})+'</span></button>';
}
