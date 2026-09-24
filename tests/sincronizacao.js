const {launch,OUT}=require('./harness.js');
const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1; };
async function dev(opts,fn){ const {browser,page,errors}=await launch(Object.assign({wait:1800},opts)); let r; try{ r=await fn(page); }finally{ const errs=errors.filter(e=>!/ERR_FAILED/.test(e)); if(errs.length) console.log('ERRORS',errs.join('\n')); await browser.close(); } return r; }
const dump=page=>page.evaluate(()=>({db:JSON.parse(JSON.stringify(window.__DB)),ls:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)]))}));
(async()=>{
  const t=Date.now()-60000, d0=new Date(Date.now()-86400000).toISOString().slice(0,10);
  const old={v:1,updatedAt:t,welcomed:true,topics:{'port-int':{rung:2,f:0,a:0,tf:40,ta:34,last:d0,flag:null}},days:{[d0]:{min:90,q:40,a:34,done:{}}},
    erros:[1,2,3].map(i=>({id:'e'+i,t:'port-int',errei:'erro '+i,regra:'r',tipo:'Conteúdo',criado:d0,prox:d0,etapa:0,done:false})),redacoes:[{id:'r1',data:d0,tema:'x',n:[4,4,4,4]}]};
  const store={'data/users/u1/cadete':{updatedAt:t,data:JSON.stringify(old)}};
  // S1: aparelho novo + nuvem no formato antigo
  const s1=await dev({store},async page=>{ await page.waitForTimeout(3500); const S=await page.evaluate(()=>{ const S=window.__app.S; return {erros:S.erros.length,red:S.redacoes.length,rung:(S.topics['port-int']||{}).rung,q:(S.days[Object.keys(S.days).sort()[0]]||{}).q}; }); return Object.assign(S,await dump(page)); });
  ok(s1.erros===3&&s1.red===1&&s1.rung===2&&s1.q===40,'S1 migra do formato antigo sem perder nada: '+JSON.stringify({e:s1.erros,r:s1.red,rung:s1.rung,q:s1.q}));
  ok(!!s1.db['data/users/u1/cadete2']&&s1.db['data/users/u1/cadete'].data===store['data/users/u1/cadete'].data,'S1 cria o formato novo e mantém o antigo intacto como cópia');
  // S2: outro aparelho novo lê a nuvem nova
  const s2=await dev({store:s1.db},async page=>{ await page.waitForTimeout(3000); return page.evaluate(()=>({erros:window.__app.S.erros.length,red:window.__app.S.redacoes.length,rung:(window.__app.S.topics['port-int']||{}).rung})); });
  ok(s2.erros===3&&s2.red===1&&s2.rung===2,'S2 aparelho novo recebe tudo: '+JSON.stringify(s2));
  // S3: aparelho A muda online; aparelho B mudou offline; ninguém perde nada
  const A=await dev({store:s1.db,ls:s1.ls},async page=>{ await page.evaluate(()=>{ window.__app.S.erros.push({id:'eA',t:'mat-ops',errei:'erro do A',regra:'',criado:'2026-01-01',prox:'2026-01-02',etapa:0,done:false,n:1}); window.__app.commit(); }); await page.waitForTimeout(4000); return dump(page); });
  const lsB=Object.assign({},s1.ls); const SB=JSON.parse(lsB['cadete-cbmpr-v1']); SB.redacoes.push({id:'rB',data:'2026-01-03',tema:'do B',n:[5,5,5,5]}); lsB['cadete-cbmpr-v1']=JSON.stringify(SB); const mB=JSON.parse(lsB['cadete-cbmpr-sync']); mB.dirty=true; lsB['cadete-cbmpr-sync']=JSON.stringify(mB);
  const B=await dev({store:A.db,ls:lsB},async page=>{ await page.waitForTimeout(4500); const r=await page.evaluate(()=>({eA:window.__app.S.erros.some(e=>e.id==='eA'),rB:window.__app.S.redacoes.some(r=>r.id==='rB')})); return Object.assign(r,await dump(page)); });
  ok(B.eA&&B.rB,'S3 mescla: B tem o erro criado em A e mantém a redação feita offline: '+JSON.stringify({eA:B.eA,rB:B.rB}));
  const A2=await dev({store:B.db,ls:A.ls},async page=>{ await page.waitForTimeout(3500); return page.evaluate(()=>({eA:window.__app.S.erros.some(e=>e.id==='eA'),rB:window.__app.S.redacoes.some(r=>r.id==='rB')})); });
  ok(A2.eA&&A2.rB,'S3 volta para A: A recebe a redação de B e mantém o próprio erro: '+JSON.stringify(A2));
  // S4: estado grande (> 256 KiB) é dividido em pedaços
  const big=await dev({store:{}},async page=>{ await page.evaluate(()=>{ const S=window.__app.S; for(let i=0;i<1500;i++) S.erros.push({id:'b'+i,t:'port-int',q:'Questão longa número '+i+' '+'x'.repeat(380),opts:['a','b','c','d','e'],right:1,x:'explicação '.repeat(8),criado:'2026-09-01',prox:'2026-09-30',etapa:1,done:false,n:1}); window.__app.commit(); }); await page.waitForTimeout(5000); return dump(page); });
  const parts=Object.keys(big.db).filter(k=>k.includes('/parts/')); const sizes=parts.map(k=>JSON.stringify(big.db[k]).length); const man=big.db['data/users/u1/cadete2'];
  ok(man&&parts.length>3&&Math.max(...sizes)<200000,'S4 estado de '+Math.round(JSON.stringify(big.db).length/1024)+' KiB dividido em '+parts.length+' pedaços, maior '+Math.round(Math.max(...sizes)/1024)+' KiB');
  const big2=await dev({store:big.db},async page=>{ await page.waitForTimeout(4000); return page.evaluate(()=>window.__app.S.erros.length); });
  ok(big2===1500,'S4 aparelho novo reconstrói o estado grande: '+big2+' erros');
})();
