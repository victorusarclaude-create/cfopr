
/* ===================== ARENA DE JOGOS: base comum =====================
   Português, Matemática, Física, Química e História têm um jogo por tópico, cada um com
   5 níveis, do fundamento ao padrão de prova. As rodadas são geradas na hora, a partir de
   bancos combinatórios e de geradores numéricos: o gabarito muda a cada partida.
   Tipos de rodada (k): choice, tf, num (digitar), spot (toque no erro), pick (toque no termo),
   order, sort (classificar vários), match (pares), commas (pôr vírgulas), map, ptable, balance. */

const AR_LV=[
  {n:'Fundamentos',d:'O conceito básico, cobrado de forma direta.'},
  {n:'Aplicação',d:'A regra aplicada em casos simples.'},
  {n:'Intermediário',d:'Casos com mais de um passo ou com exceções.'},
  {n:'Padrão de prova',d:'O nível das questões típicas de concurso.'},
  {n:'Prova difícil',d:'As pegadinhas e os casos que mais derrubam candidatos.'}];
const ARENA=[], AR_BY={};
function arGame(g){ ARENA.push(g); AR_BY[g.id]=g; return g; }

/* ---------- sorteio ---------- */
const rI=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const rP=a=>a[Math.floor(Math.random()*a.length)];
function rS(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
const rN=(a,n)=>rS(a).slice(0,n);
const rC=p=>Math.random()<p;
function rNZ(a,b){ let v=0, g=0; while(v===0&&g<50){ v=rI(a,b); g++; } return v||1; }

/* ---------- números ---------- */
function fN(v,d){ if(d==null) d=2; if(!isFinite(v)) return '?'; const p=Math.pow(10,d); let r=Math.round(v*p)/p; if(Object.is(r,-0)||Math.abs(r)<1e-12) r=0;
  return r.toLocaleString('pt-BR',{maximumFractionDigits:d}).replace('-','−'); }
const fI=v=>String(Math.round(v)).replace('-','−');
function gcd(a,b){ a=Math.abs(Math.round(a)); b=Math.abs(Math.round(b)); while(b){ const t=a%b; a=b; b=t; } return a||1; }
const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
function fFr(n,d){ if(d<0){ n=-n; d=-d; } const g=gcd(n,d); n/=g; d/=g; return d===1?fI(n):(n<0?'−':'')+Math.abs(n)+'/'+d; }
const sq=v=>String(v).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'['0123456789'.indexOf(c)]||({'-':'⁻'}[c])||c).join('');
const sb=v=>String(v).split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'['0123456789'.indexOf(c)]||c).join('');
/* termo de polinômio com sinal: fT(-3,'x',false) → "− 3x" */
function fT(c,v,first){ if(c===0) return ''; const a=Math.abs(c), s=c<0?'−':'+'; const body=(a===1&&v?'':fN(a,3))+(v||'');
  return first?(c<0?'−':'')+body:' '+s+' '+body; }
function fPoly(cs,v){ // cs do maior grau para o menor
  const n=cs.length-1; let out='', first=true;
  cs.forEach((c,i)=>{ const e=n-i; if(!c) return; const vv=e===0?'':(e===1?v:v+sq(e)); out+=fT(c,vv,first); first=false; });
  return out||'0'; }
function simpRad(n){ let a=1,b=n; for(let k=Math.floor(Math.sqrt(n));k>1;k--){ if(n%(k*k)===0){ a=k; b=n/(k*k); break; } } return {a,b}; }
function fRad(n){ const {a,b}=simpRad(n); if(b===1) return String(a); return (a>1?a:'')+'√'+b; }

/* ---------- construtores de rodada ---------- */
const arNorm=s=>String(s).trim().toLowerCase().replace(/\s+/g,' ');
function arCh(q,right,wrongs,o){
  o=o||{}; const n=o.n||5, R=String(right), seen=new Set([arNorm(R)]), ws=[];
  (o.keep?wrongs:rS(wrongs)).forEach(w=>{ const s=String(w); const k=arNorm(s); if(!s||seen.has(k)||ws.length>=n-1) return; seen.add(k); ws.push(s); });
  const opts=o.fixed?[R].concat(ws):rS([R].concat(ws));
  return Object.assign({k:'choice',q,opts,right:opts.indexOf(R)},strip(o));
}
function strip(o){ const r={}; ['x','steps','fig','t','tx','key','hint','lbl'].forEach(k=>{ if(o[k]!=null) r[k]=o[k]; }); return r; }
/* alternativas numéricas: primeiro os erros plausíveis (c), depois variações genéricas */
function arNumAlts(ans,c,d,neg){
  const f=v=>fN(v,d), A=f(ans), pri=[], gen=[], seen=new Set([A]);
  const add=(v,arr)=>{ if(!isFinite(v)) return; if(!neg&&ans>=0&&v<0) return; if(ans>0&&v===0) return; const s=f(v); if(seen.has(s)) return; seen.add(s); arr.push(s); };
  (c||[]).forEach(v=>add(v,pri));
  const m=Math.abs(ans)||1, st=d===0?Math.max(1,Math.round(m/8)):m/8;
  rS([ans*2,ans/2,ans*10,ans/10,ans+st,ans-st,ans*1.5,ans+2*st,ans-2*st,ans*3,-ans]).forEach(v=>add(v,gen));
  let g=0; while(gen.length<6&&g<60){ g++; add(ans+rI(1,12)*(rC(.5)?1:-1)*Math.max(d===0?1:0.1,st/2),gen); }
  return rS(pri).slice(0,3).concat(gen);
}
function arNum(q,ans,o){
  o=o||{}; const d=o.d==null?2:o.d, u=o.u?' '+o.u:'';
  const W=arNumAlts(ans,o.c,d,o.neg).slice(0,4), R=fN(ans,d)+u, opts=rS([R].concat(W.map(s=>s+u)));
  return Object.assign({k:'num',q,ans,d,u:o.u||'',opts,right:opts.indexOf(R),tol:o.tol},strip(o));
}
function arTF(q,truth,o){ return Object.assign({k:'tf',q,opts:['Verdadeiro','Falso'],right:truth?0:1},strip(o||{})); }
function arSpot(q,parts,wrong,fix,o){ return Object.assign({k:'spot',q,parts,wrong,fix},strip(o||{})); }
function arPick(q,parts,right,o){ return Object.assign({k:'pick',q,parts,right},strip(o||{})); }
function arOrd(q,items,o){ return Object.assign({k:'order',q,items,lab:(o&&o.lab)||null},strip(o||{})); }
function arSort(q,cats,items,o){ return Object.assign({k:'sort',q,cats,items},strip(o||{})); }
function arMatch(q,pairs,o){ return Object.assign({k:'match',q,pairs},strip(o||{})); }
function arCommas(q,ch,sl,o){ return Object.assign({k:'commas',q,ch,sl},strip(o||{})); }
function arMapR(q,zone,o){ return Object.assign({k:'map',q,zone},strip(o||{})); }
function arPT(q,sym,o){ return Object.assign({k:'ptable',q,sym},strip(o||{})); }
function arBal(q,L,R,co,o){ return Object.assign({k:'balance',q,L,R,co},strip(o||{})); }
/* alternativa ímpar a partir de afirmações: askFalse → "assinale a INCORRETA" */
function arOdd(q,trues,falses,askFalse,o){
  const right=askFalse?rP(falses):rP(trues), others=askFalse?rN(trues,4):rN(falses,4);
  return arCh(q,right,others,Object.assign({n:5},o||{}));
}

/* ---------- itens de lacuna (Português e História) ----------
   {s:'Fui {} farmácia.', c:'à', w:['a'], x:'regra'} */
const siFill=si=>si.s.replace('{}',si.c);
const siBad=si=>si.s.replace('{}',rP(si.w));
function siCloze(si,q){ return arCh((q?q+'\n':'')+si.s.replace('{}','_____'),si.c,si.w,{x:si.x}); }
function siTF(si,q){ const ok=rC(.5); return arTF((q||'De acordo com a norma-padrão, a frase está correta?')+'\n“'+(ok?siFill(si):siBad(si))+'”',ok,{x:(ok?'Está correta. ':'Não está: o certo é “'+siFill(si)+'”. ')+(si.x||'')}); }
function siSpot(si,pOk){
  const ok=rC(pOk==null?0.2:pOk), toks=si.s.split(' '), idx=toks.findIndex(t=>t.indexOf('{}')>=0), v=ok?si.c:rP(si.w);
  return arSpot('Toque na palavra ou expressão errada. Se estiver tudo certo, toque em “A frase está correta”.',toks.map((t,i)=>i===idx?t.replace('{}',v):t),ok?-1:idx,si.c,{x:(ok?'A frase está correta: “'+siFill(si)+'”. ':'Correção: “'+siFill(si)+'”. ')+(si.x||'')});
}
function siOdd(sis,askWrong,tema){
  const k=rI(0,sis.length-1), alts=sis.map((si,i)=>askWrong?(i===k?siBad(si):siFill(si)):(i===k?siFill(si):siBad(si)));
  if(new Set(alts.map(arNorm)).size<alts.length) return null;
  return {k:'choice',q:(askWrong?'Assinale a alternativa em que há **erro**'+(tema?' de '+tema:'')+'.':'Assinale a alternativa **correta**'+(tema?' quanto a '+tema:'')+'.'),opts:alts,right:k,
    x:(askWrong?'O erro está em “'+alts[k]+'”: o certo é “'+siFill(sis[k])+'”. ':'Correta: “'+alts[k]+'”. ')+(sis[k].x||'')};
}
/* escolhe um formato diferente a cada rodada para o mesmo banco */
function siAny(si,forms){ const f=rP(forms||['cloze','spot','tf']); return f==='spot'?siSpot(si):f==='tf'?siTF(si):siCloze(si); }

/* ---------- conversão para múltipla escolha (Relâmpago, simulado, caderno de erros) ---------- */
function arAsChoice(r){
  if(!r) return null;
  if(r.k==='choice') return r;
  const base=Object.assign({},r,{k:'choice'});
  if(r.k==='tf'||r.k==='num') return base;
  if(r.k==='spot'){ const words=r.parts.map((p,i)=>({p:p.replace(/[.,;:!?”“"]+$/,''),i})).filter(o=>o.p.length>1);
    const pool=rN(words.filter(o=>o.i!==r.wrong),r.wrong>=0?3:4).map(o=>'“'+o.p+'”');
    const right=r.wrong>=0?'“'+r.parts[r.wrong].replace(/[.,;:!?”“"]+$/,'')+'”':'A frase está correta';
    return arCh('Qual trecho está errado na frase?\n“'+r.parts.join(' ')+'”',right,pool.concat(r.wrong>=0?['A frase está correta']:[]),{x:r.x}); }
  if(r.k==='pick'){ const ri=Array.isArray(r.right)?r.right[0]:r.right; return arCh(r.q+'\n“'+r.parts.join(' ')+'”','“'+r.parts[ri]+'”',r.parts.filter((p,i)=>i!==ri&&p.length>1).map(p=>'“'+p+'”'),{x:r.x}); }
  if(r.k==='sort'){ const it=rP(r.items); return arCh(r.q+'\n**'+it[0]+'**',r.cats[it[1]],r.cats.filter((c,i)=>i!==it[1]),{x:r.x,keep:true}); }
  if(r.k==='match'){ const p=rP(r.pairs); return arCh(r.q+'\n**'+p[0]+'** corresponde a:',p[1],r.pairs.filter(x=>x!==p).map(x=>x[1]),{x:r.x}); }
  if(r.k==='order'){ if(r.items.length>5) return null; const ok=r.items.join(' → '), ws=[]; let g=0;
    while(ws.length<4&&g<40){ g++; const s=rS(r.items).join(' → '); if(s!==ok&&ws.indexOf(s)<0) ws.push(s); }
    return arCh(r.q+'\nQual é a ordem correta?',ok,ws,{x:r.x}); }
  if(r.k==='commas'){ const ok=arCommaText(r.ch,r.sl.map(s=>s==='must')), ws=[]; let g=0;
    while(ws.length<4&&g<60){ g++; const pat=r.sl.map(s=>s==='must'?rC(.75):s==='no'?rC(.3):rC(.5)); const bad=r.sl.some((s,i)=>(s==='must'&&!pat[i])||(s==='no'&&pat[i])); if(!bad) continue; const t=arCommaText(r.ch,pat); if(t!==ok&&ws.indexOf(t)<0) ws.push(t); }
    if(ws.length<2) return null; return arCh('Assinale a frase com a pontuação correta.',ok,ws,{x:r.x}); }
  if(r.k==='map'&&typeof AR_ZONES!=='undefined'){ return arCh(r.q,AR_ZONES[r.zone].n,Object.keys(AR_ZONES).filter(z=>z!==r.zone).map(z=>AR_ZONES[z].n),{x:r.x}); }
  if(r.k==='ptable'&&typeof AR_EL!=='undefined'){ const e=AR_EL.find(x=>x.s===r.sym); return arCh(r.q,e.s+' ('+e.n+')',rN(AR_EL.filter(x=>x.s!==r.sym&&x.z<=36),6).map(x=>x.s+' ('+x.n+')'),{x:r.x}); }
  if(r.k==='balance'){ const ok=r.co.join(', '), ws=[]; let g=0; while(ws.length<4&&g<60){ g++; const c=r.co.map(v=>Math.max(1,v+rI(-1,2))); const s=c.join(', '); if(s!==ok&&ws.indexOf(s)<0&&!arCoefEq(c,r.co)) ws.push(s); }
    return arCh(r.q+'\n'+arEqText(r.L,r.R,null)+'\nCoeficientes (na ordem, menores inteiros):',ok,ws,{x:r.x}); }
  return null;
}
function arCommaText(ch,pat){ let s=ch[0]; for(let i=1;i<ch.length;i++) s+=(pat[i-1]?', ':' ')+ch[i]; return s; }
function arEqText(L,R,co){ const f=(arr,off)=>arr.map((sp,i)=>{ const c=co?co[off+i]:null; return (c&&c>1?c+' ':'')+sp; }).join(' + '); return f(L,0)+' → '+f(R,L.length); }
function arCoefEq(a,b){ if(a.length!==b.length) return false; const k=a[0]/b[0]; return a.every((v,i)=>Math.abs(v/b[i]-k)<1e-9); }

/* ---------- figuras (SVG com as cores do tema) ---------- */
function fgSvg(w,h,inner,label){ return '<svg class="fg" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="'+String(label||'Figura').replace(/"/g,'')+'">'+inner+'</svg>'; }
const fgT=(x,y,t,cls,anc)=>'<text x="'+fN2(x)+'" y="'+fN2(y)+'" class="'+(cls||'')+'" text-anchor="'+(anc||'middle')+'">'+String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</text>';
const fN2=v=>Math.round(v*10)/10;
/* gráfico cartesiano: {xr:[a,b], yr:[c,d], fns:[{f,cls}], segs:[[x1,y1,x2,y2,cls]], pts:[[x,y,rótulo]], xl, yl, step} */
function fgPlot(o){
  const W=300,H=220,P=26, [x0,x1]=o.xr, [y0,y1]=o.yr;
  const X=x=>P+(x-x0)/(x1-x0)*(W-2*P), Y=y=>H-P-(y-y0)/(y1-y0)*(H-2*P);
  let s='';
  const sx=o.sx||niceStep(x1-x0), sy=o.sy||niceStep(y1-y0);
  for(let x=Math.ceil(x0/sx)*sx;x<=x1+1e-9;x+=sx) s+='<line class="gr" x1="'+fN2(X(x))+'" y1="'+P+'" x2="'+fN2(X(x))+'" y2="'+(H-P)+'"/>';
  for(let y=Math.ceil(y0/sy)*sy;y<=y1+1e-9;y+=sy) s+='<line class="gr" x1="'+P+'" y1="'+fN2(Y(y))+'" x2="'+(W-P)+'" y2="'+fN2(Y(y))+'"/>';
  const ax=y0<=0&&y1>=0?Y(0):H-P, ay=x0<=0&&x1>=0?X(0):P;
  s+='<line class="ax" x1="'+P+'" y1="'+fN2(ax)+'" x2="'+(W-P+6)+'" y2="'+fN2(ax)+'"/><line class="ax" x1="'+fN2(ay)+'" y1="'+(H-P)+'" x2="'+fN2(ay)+'" y2="'+(P-6)+'"/>';
  for(let x=Math.ceil(x0/sx)*sx;x<=x1+1e-9;x+=sx){ if(Math.abs(x)<1e-9&&y0<=0&&y1>=0&&x0<0) continue; s+=fgT(X(x),ax+13,fN(x,2),'tk'); }
  for(let y=Math.ceil(y0/sy)*sy;y<=y1+1e-9;y+=sy){ if(Math.abs(y)<1e-9) continue; s+=fgT(ay-4,Y(y)+4,fN(y,2),'tk','end'); }
  s+=fgT(W-P+4,ax-6,o.xl||'x','al','end')+fgT(ay+6,P-8,o.yl||'y','al','start');
  (o.fns||[]).forEach(fn=>{ let d='', pen=false; for(let i=0;i<=120;i++){ const x=x0+(x1-x0)*i/120, y=fn.f(x); if(!isFinite(y)||y<y0-0.01*(y1-y0)||y>y1+0.01*(y1-y0)){ pen=false; continue; } d+=(pen?'L':'M')+fN2(X(x))+' '+fN2(Y(y)); pen=true; } s+='<path class="'+(fn.cls||'ln')+'" d="'+d+'"/>'; });
  (o.segs||[]).forEach(g=>{ s+='<line class="'+(g[4]||'ln')+'" x1="'+fN2(X(g[0]))+'" y1="'+fN2(Y(g[1]))+'" x2="'+fN2(X(g[2]))+'" y2="'+fN2(Y(g[3]))+'"/>'; });
  (o.area||[]).forEach(a=>{ s+='<polygon class="ar" points="'+a.map(p=>fN2(X(p[0]))+','+fN2(Y(p[1]))).join(' ')+'"/>'; });
  (o.pts||[]).forEach(p=>{ s+='<circle class="pt" cx="'+fN2(X(p[0]))+'" cy="'+fN2(Y(p[1]))+'" r="4"/>'+(p[2]?fgT(X(p[0])+7,Y(p[1])-7,p[2],'pl','start'):''); });
  return fgSvg(W,H,s,o.label||'Gráfico');
}
function niceStep(r){ const raw=r/8, p=Math.pow(10,Math.floor(Math.log10(raw))); const m=raw/p; return (m<=1?1:m<=2?2:m<=5?5:10)*p; }
/* triângulo retângulo com o ângulo reto em B */
function fgTri(o){
  const A=[34,178],B=[262,178],C=[262,40]; let s='<polygon class="sh" points="'+A.join(',')+' '+B.join(',')+' '+C.join(',')+'"/>';
  s+='<polyline class="ax" points="248,178 248,164 262,164" fill="none"/>';
  if(o.b) s+=fgT(148,198,o.b,'lb'); if(o.h) s+=fgT(276,114,o.h,'lb','start'); if(o.c) s+=fgT(136,100,o.c,'lb','end');
  if(o.ang) s+='<path class="ax" d="M74,178 A40,40 0 0 0 70,160" fill="none"/>'+fgT(88,170,o.ang,'lb','start');
  return fgSvg(380,210,s,'Triângulo retângulo');
}
function fgBars(labels,vals,o){
  o=o||{}; const W=300,H=200,P=28, mx=Math.max.apply(null,vals.concat([1])), bw=(W-2*P)/vals.length;
  let s='<line class="ax" x1="'+P+'" y1="'+(H-P)+'" x2="'+(W-P)+'" y2="'+(H-P)+'"/>';
  vals.forEach((v,i)=>{ const h=(H-2*P-10)*v/mx, x=P+i*bw+bw*0.18; s+='<rect class="br" x="'+fN2(x)+'" y="'+fN2(H-P-h)+'" width="'+fN2(bw*0.64)+'" height="'+fN2(h)+'" rx="3"/>'+fgT(x+bw*0.32,H-P-h-5,fN(v,1),'tk')+fgT(x+bw*0.32,H-P+14,labels[i],'tk'); });
  if(o.yl) s+=fgT(P,14,o.yl,'al','start');
  return fgSvg(W,H,s,o.label||'Gráfico de barras');
}
/* diagrama de energia: {hr,hp,ea,eac} em unidades arbitrárias (0 a 100) */
function fgEnergy(o){
  const W=300,H=200,P=28, Y=v=>H-P-v/100*(H-2*P-8);
  const path=pk=>'M'+P+' '+fN2(Y(o.hr))+' L'+(P+50)+' '+fN2(Y(o.hr))+' C'+(P+90)+' '+fN2(Y(o.hr))+' '+(P+100)+' '+fN2(Y(pk))+' '+(P+122)+' '+fN2(Y(pk))+' C'+(P+144)+' '+fN2(Y(pk))+' '+(P+154)+' '+fN2(Y(o.hp))+' '+(P+194)+' '+fN2(Y(o.hp))+' L'+(W-P)+' '+fN2(Y(o.hp));
  let s='<line class="ax" x1="'+P+'" y1="'+(H-P)+'" x2="'+(W-P)+'" y2="'+(H-P)+'"/><line class="ax" x1="'+P+'" y1="'+(H-P)+'" x2="'+P+'" y2="'+(P-8)+'"/>'+fgT(P+4,P-12,'Entalpia (H)','al','start')+fgT(W-P,H-P+16,'Caminho da reação','al','end');
  s+='<path class="ln" d="'+path(o.ea)+'"/>'; if(o.eac!=null) s+='<path class="ln2 dash" d="'+path(o.eac)+'"/>';
  s+=fgT(P+26,Y(o.hr)-6,o.lr||'Reagentes','pl')+fgT(W-P-26,Y(o.hp)-6,o.lp||'Produtos','pl');
  return fgSvg(W,H,s,'Diagrama de energia');
}
/* circuitos simples: kind 'serie' | 'paralelo' */
function fgCirc(kind,rs,U){
  const W=300,H=170; let s='';
  const res=(x,y,vert,lab)=>vert?'<rect class="rs" x="'+(x-7)+'" y="'+(y-20)+'" width="14" height="40" rx="3"/>'+fgT(x+12,y+4,lab,'lb','start'):'<rect class="rs" x="'+(x-20)+'" y="'+(y-7)+'" width="40" height="14" rx="3"/>'+fgT(x,y-12,lab,'lb');
  s+='<line class="wr" x1="30" y1="40" x2="30" y2="70"/><line class="wr" x1="30" y1="100" x2="30" y2="140"/><line class="bt" x1="18" y1="78" x2="42" y2="78"/><line class="bt2" x1="24" y1="90" x2="36" y2="90"/>'+(U!=null?fgT(48,90,U+' V','lb','start'):'');
  if(kind==='serie'){ const n=rs.length, step=(W-80)/n; s+='<line class="wr" x1="30" y1="40" x2="'+(W-30)+'" y2="40"/><line class="wr" x1="'+(W-30)+'" y1="40" x2="'+(W-30)+'" y2="140"/><line class="wr" x1="30" y1="140" x2="'+(W-30)+'" y2="140"/>';
    rs.forEach((r,i)=>{ s+=res(70+step*(i+0.5),40,false,r); }); }
  else { const n=rs.length, step=(W-110)/Math.max(1,n-1);
    s+='<line class="wr" x1="30" y1="40" x2="'+(90+step*(n-1))+'" y2="40"/><line class="wr" x1="30" y1="140" x2="'+(90+step*(n-1))+'" y2="140"/>';
    rs.forEach((r,i)=>{ const x=90+step*i; s+='<line class="wr" x1="'+x+'" y1="40" x2="'+x+'" y2="140"/>'+res(x,90,true,r); }); }
  return fgSvg(W,H,s,'Circuito');
}
/* sólidos e figuras planas com medidas */
function fgShape(kind,o){
  let s='', W=300, H=190;
  if(kind==='rect'){ s='<rect class="sh" x="60" y="40" width="180" height="100"/>'+fgT(150,158,o.b||'','lb')+fgT(252,95,o.h||'','lb','start'); }
  else if(kind==='circ'){ s='<circle class="sh" cx="150" cy="92" r="70"/><line class="ax" x1="150" y1="92" x2="220" y2="92"/><circle class="pt" cx="150" cy="92" r="3"/>'+fgT(185,86,o.r||'','lb'); }
  else if(kind==='trap'){ s='<polygon class="sh" points="100,40 200,40 250,140 50,140"/><line class="ax dash" x1="100" y1="40" x2="100" y2="140"/>'+fgT(150,32,o.b||'','lb')+fgT(150,158,o.B||'','lb')+fgT(94,95,o.h||'','lb','end'); }
  else if(kind==='tri'){ s='<polygon class="sh" points="60,150 250,150 150,40"/><line class="ax dash" x1="150" y1="40" x2="150" y2="150"/>'+fgT(200,168,o.b||'','lb')+fgT(156,100,o.h||'','lb','start'); }
  else if(kind==='cil'){ s='<ellipse class="sh" cx="150" cy="150" rx="70" ry="16"/><rect class="sh nb" x="80" y="40" width="140" height="110"/><line class="ln0" x1="80" y1="40" x2="80" y2="150"/><line class="ln0" x1="220" y1="40" x2="220" y2="150"/><ellipse class="sh" cx="150" cy="40" rx="70" ry="16"/><line class="ax" x1="150" y1="40" x2="220" y2="40"/>'+fgT(185,34,o.r||'','lb')+fgT(232,100,o.h||'','lb','start'); }
  else if(kind==='caixa'||kind==='cubo'){ s='<polygon class="sh" points="70,70 190,70 190,160 70,160"/><polygon class="sh2" points="70,70 110,40 230,40 190,70"/><polygon class="sh2" points="190,70 230,40 230,130 190,160"/>'+fgT(130,178,o.a||'','lb')+fgT(238,90,o.c||'','lb','start')+fgT(214,62,o.b||'','lb','start'); }
  else if(kind==='cone'){ s='<ellipse class="sh" cx="150" cy="150" rx="70" ry="16"/><polygon class="sh nb" points="80,150 220,150 150,30"/><line class="ln0" x1="80" y1="150" x2="150" y2="30"/><line class="ln0" x1="220" y1="150" x2="150" y2="30"/><line class="ax dash" x1="150" y1="30" x2="150" y2="150"/><line class="ax" x1="150" y1="150" x2="220" y2="150"/>'+fgT(185,144,o.r||'','lb')+fgT(156,95,o.h||'','lb','start'); }
  else if(kind==='esfera'){ s='<circle class="sh" cx="150" cy="95" r="72"/><ellipse class="ax dash" cx="150" cy="95" rx="72" ry="18" fill="none"/><line class="ax" x1="150" y1="95" x2="222" y2="95"/>'+fgT(186,89,o.r||'','lb'); }
  return fgSvg(W,H,s,'Figura geométrica');
}
