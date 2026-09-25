// Jornada do Paraná: joga o capítulo 0 com cliques, erra de propósito, faz a revisão, confere o desbloqueio,
// retoma depois de recarregar, abre atlas, linha do tempo e personagens, e renderiza todas as cenas.
const {launch}=require('./harness.js');
const W=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0; const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) fails++; };
(async()=>{
  const {browser,page,errors}=await launch();
  await page.click('[data-a="welcomeOk"]'); await W(300);
  await page.click('#tabsIn [data-v="tutor"]'); await W(500);
  ok(await page.locator('.jnfeat').count()===1,'cartão da Jornada no Treino');
  await page.click('.jnfeat'); await W(700);
  ok(await page.locator('.jnlist > li').count()===13,'13 capítulos na lista');
  ok(await page.locator('.jnlist li.cur').count()===1&&await page.locator('.jnlist li.locked').count()===12,'só o capítulo 0 aberto');
  await page.click('.jnhero [data-a="jnCap"]'); await W(700);
  const st=()=>page.evaluate(()=>{ const J=window.__app.tutor.jn; const s=J&&J.view==='cap'?window.__app.JN_CAP[J.ci].sc[J.si]:null; return {view:J&&J.view,ci:J&&J.ci,si:J&&J.si,kind:s?(s.q?'q':s.qm?'qm':s.qo?'qo':'t'):null,perm:J&&J.perm,r:s&&s.qm?[].concat(s.r):null,n:s&&s.o?s.o.length:0,inRun:null}; });
  ok((await st()).view==='cap','capítulo aberto');
  ok(await page.locator('.jnmap svg .jn-rg').count()===12,'mapa com as 12 regiões');
  const err0=await page.evaluate(()=>window.__app.S.erros.length);
  let wrongDone=false, mapClick=false, steps=0;
  while(steps++<60){
    const s=await st(); if(s.view!=='cap') break;
    if(s.kind==='q'){ const right=s.perm.indexOf(0), j=wrongDone?right:(right+1)%4; await page.click('[data-a="jnAns"][data-j="'+j+'"]'); if(!wrongDone){ wrongDone=true; await W(150); ok(await page.locator('.alt.wrong').count()===1&&await page.locator('.alt.right').count()===1,'erro marcado e resposta certa mostrada'); } }
    else if(s.kind==='qm'){ const r=s.r[0]; if(!mapClick&&r==='oeste'){ await page.click('.jn-rg[data-r="oeste"]'); mapClick=true; } else await page.locator('.jn-rg[data-r="'+r+'"]').dispatchEvent('click'); await W(120); ok(await page.locator('.jn-rg.ok').count()>=1,'mapa marca a região certa ('+r+')'); }
    else if(s.kind==='qo'){ for(let i=0;i<s.n;i++) await page.click('[data-a="jnOrd"][data-i="'+i+'"]'); await W(100); ok(await page.locator('.jnord li').count()===s.n,'ordenação completa'); }
    await W(60); await page.click('[data-a="jnNext"]'); await W(80);
  }
  ok(mapClick,'toque real na região Oeste funcionou');
  ok(await page.evaluate(e0=>window.__app.S.erros.length>e0,err0),'erro da Jornada foi para o caderno de erros');
  let s=await st(); ok(s.view==='rev','revisão do capítulo começou');
  ok(await page.evaluate(()=>window.__app.tutor.jn&&(window.__app.tutor.jn.view==='rev')),'revisão em andamento');
  for(let k=0;k<10;k++){ const v=await page.evaluate(()=>{ const J=window.__app.tutor.jn; if(J.view!=='rev') return null; const it=J.items[J.pos]; return {q:!!it.s.q,perm:J.perm,r:it.s.qm?[].concat(it.s.r):null,ans:!!J.ans}; });
    if(!v) break;
    if(v.q) await page.click('[data-a="jnAns"][data-j="'+v.perm.indexOf(0)+'"]'); else await page.locator('.jn-rg[data-r="'+v.r[0]+'"]').dispatchEvent('click');
    await W(80); await page.click('[data-a="jnRevNext"]'); await W(120); }
  await W(400);
  const rec=await page.evaluate(()=>window.__app.S.jn.c.c0);
  ok(rec&&rec.d===1&&rec.st===3,'capítulo 0 concluído com 3 estrelas: '+JSON.stringify(rec));
  ok(await page.locator('.unlockbox').count()===1,'aviso de capítulo 1 liberado');
  ok(await page.locator('.jnres li').count()>=4,'resumo para a prova no fim');
  for(let k=0;k<4;k++){ await page.evaluate(()=>{ if(!document.querySelector('#celebrate').hidden) window.__app.A.celClose(); }); await W(150); }
  await page.click('.stack [data-a="jnCap"][data-i="1"]'); await W(500);
  s=await st(); ok(s.ci===1&&s.si===0,'capítulo 1 abre do começo');
  ok(await page.evaluate(()=>window.__app.tutor.jn&&true),'modo Jornada ativo');
  for(let k=0;k<3;k++){ const x=await st(); if(x.kind==='q') await page.click('[data-a="jnAns"][data-j="'+x.perm.indexOf(0)+'"]'); await page.click('[data-a="jnNext"]'); await W(80); }
  const p1=await page.evaluate(()=>window.__app.S.jn.c.c1.p);
  ok(p1===3,'progresso salvo na cena 3 (p='+p1+')');
  // teclado: Enter avança, números respondem
  const kb=await st(); if(kb.kind==='q'){ await page.keyboard.press(String(kb.perm.indexOf(0)+1)); await W(80); }
  await page.keyboard.press('Enter'); await W(150);
  ok((await st()).si===4,'teclado avança a cena');
  await page.reload(); await W(1200);
  await page.evaluate(()=>window.__app.A.jnOpen()); await W(400);
  ok(await page.locator('.jnlist li.done').count()===1,'depois de recarregar: capítulo 0 continua concluído');
  await page.click('.jnhero [data-a="jnCap"]'); await W(500);
  s=await st(); ok(s.ci===1&&s.si===4,'retoma o capítulo 1 na cena em que parou (si='+s.si+')');
  // narração: liga e desliga sem erro
  for(let k=0;k<4&&!(await page.locator('.jnvoz').count());k++){ const x=await st(); if(x.kind==='q') await page.click('[data-a="jnAns"][data-j="'+x.perm.indexOf(0)+'"]'); await page.click('[data-a="jnNext"]'); await W(100); }
  await page.click('.jnvoz'); await W(100); ok(await page.evaluate(()=>!!JSON.parse(localStorage.getItem('cadete-cbmpr-ui')).jnVoz),'narração ligada'); await page.click('.jnvoz'); await W(100);
  // atlas, linha do tempo, personagens
  await page.click('.jn-atlasbtn'); await W(500);
  ok(await page.locator('#sheet .jnmap-atlas svg').count()===1,'atlas abre');
  await page.click('#sheet [data-a="jnAtlasZ"][data-v="cg"]'); await W(400);
  await page.click('#sheet [data-a="jnAtlasRt"][data-v="tropas"]'); await W(300);
  ok(await page.locator('#sheet .jn-rt.rt-tropas').count()===1,'caminho das tropas desenhado no atlas');
  await page.locator('#sheet .jn-rg[data-r="camposgerais"]').dispatchEvent('click'); await W(300);
  ok(await page.locator('#sheet .jninfo').count()===1,'ficha da região no atlas');
  await page.evaluate(()=>window.__app.A.closeSheet()); await W(200);
  await page.evaluate(()=>window.__app.A.jnTime()); await W(300); ok(await page.locator('#sheet .jntl li').count()>40,'linha do tempo com as datas');
  await page.evaluate(()=>window.__app.A.jnPeople()); await W(300); ok(await page.locator('#sheet .jnpeople li').count()>20,'personagens');
  await page.evaluate(()=>window.__app.A.closeSheet()); await W(200);

  // ---------- glossário: termo tocável no texto, com pontilhado ----------
  await page.evaluate(()=>window.__app.jnStartCap(0,5)); await W(500);
  ok(await page.locator('.jncard .jnterm').count()>=1,'a cena tem termo tocável, com pontilhado, no texto');
  await page.click('.jncard .jnterm'); await W(250);
  ok(await page.evaluate(()=>{ const el=document.getElementById('jntip'); return el&&!el.hidden&&el.classList.contains('show')&&el.textContent.length>20; }),'tocar no termo abre a explicação na hora');
  await page.keyboard.press('Escape'); await W(150);
  ok(await page.evaluate(()=>!document.getElementById('jntip').classList.contains('show')),'Escape fecha a explicação');
  await page.mouse.move(5,5); await W(50);
  await page.locator('.jncard .jnterm').first().hover(); await W(350);
  ok(await page.evaluate(()=>document.getElementById('jntip').classList.contains('show')),'passar o mouse no termo também mostra a explicação, sem precisar clicar');
  await page.mouse.move(5,5); await W(400);
  ok(await page.evaluate(()=>document.getElementById('jntip').hidden),'a explicação por hover fecha sozinha ao tirar o mouse');
  await page.click('.jncard .jnterm'); await W(250);
  const tipTerm=await page.evaluate(()=>document.getElementById('jntip').querySelector('[data-a="jnGlossOpen"]').dataset.k);
  await page.click('#jntip [data-a="jnGlossOpen"]'); await W(400);
  ok(await page.locator('#sheet #gl-'+tipTerm+'.hl').count()===1,'"Ver no Glossário completo" abre o glossário já na entrada certa, destacada');
  await page.evaluate(()=>window.__app.A.closeSheet()); await W(200);

  // ---------- glossário completo: lista e busca ----------
  await page.evaluate(()=>window.__app.A.jnGlossOpen({dataset:{}})); await W(400);
  const glTotal=await page.evaluate(()=>Object.keys(window.__app.JN_GLOSS).length);
  ok(await page.locator('#sheet .jngitem').count()===glTotal,'glossário completo lista os '+glTotal+' termos');
  await page.fill('#glSearch','tropeiro'); await W(150);
  const glVisible=await page.locator('#sheet .jngitem:not([hidden])').count();
  ok(glVisible>=1&&glVisible<glTotal,'a busca do glossário filtra os itens ('+glVisible+' de '+glTotal+')');
  await page.evaluate(()=>window.__app.A.closeSheet()); await W(200);

  // ---------- domínio por estrelas no mapa e Revisão geral ----------
  await page.evaluate(()=>{ const S=window.__app.S; S.jn.c.c1=Object.assign({},S.jn.c.c1,{d:1,st:1}); });
  await page.evaluate(()=>window.__app.A.jnHome()); await W(500);
  ok(await page.locator('.jnmap-home .jn-rg.on').count()>=1,'o mapa da Jornada destaca as regiões com domínio de 3 estrelas');
  ok(await page.locator('.jnmap-home .jn-rg.on2').count()>=1,'o mapa da Jornada marca em outra cor as regiões com menos de 3 estrelas');
  ok(await page.locator('.jnleg-home').count()===1,'uma legenda explica as duas cores do mapa de domínio');
  ok(await page.locator('.jnrevcard').count()===1,'o card de Revisão geral aparece depois do primeiro capítulo concluído');
  await page.click('.jnrevcard'); await W(600);
  ok(await page.evaluate(()=>{ const J=window.__app.tutor.jn; return J&&J.view==='rev'&&J.gen===true; }),'a Revisão geral começa misturando fatos de capítulos concluídos');
  for(let k=0;k<20;k++){ const v=await page.evaluate(()=>{ const J=window.__app.tutor.jn; if(!J||J.view!=='rev') return null; const it=J.items[J.pos]; return {q:!!it.s.q,qo:!!it.s.qo,n:it.s.o?it.s.o.length:0,perm:J.perm,r:it.s.qm?[].concat(it.s.r):null}; });
    if(!v) break;
    if(v.q) await page.click('[data-a="jnAns"][data-j="'+v.perm.indexOf(0)+'"]');
    else if(v.qo){ for(let i=0;i<v.n;i++) await page.click('[data-a="jnOrd"][data-i="'+i+'"]'); }
    else await page.locator('.jn-rg[data-r="'+v.r[0]+'"]').dispatchEvent('click');
    await W(70); await page.click('[data-a="jnRevNext"]'); await W(90); }
  await W(1000);
  ok(await page.evaluate(()=>window.__app.tutor.jn&&window.__app.tutor.jn.view==='genend'),'a Revisão geral termina numa tela própria');
  ok(await page.evaluate(()=>window.__app.S.jn.c.c0.d===1),'o capítulo já concluído continua concluído depois da Revisão geral');
  await page.evaluate(()=>window.__app.A.jnHome()); await W(300);

  // todas as cenas renderizam
  const bad=await page.evaluate(()=>{ const out=[]; const C=window.__app.JN_CAP; C.forEach((c,ci)=>{ c.sc.forEach((s,si)=>{ try{ window.__app.tutor.jn={view:'cap',ci,si,ans:null,perm:s.o?s.o.map((_,i)=>i):null,combo:0,ok:0,n:0,pm:null,pmSi:-1}; window.__app.render(); if(!document.querySelector('#app .jnmap svg')) out.push(ci+':'+si+' sem mapa'); }catch(e){ out.push(ci+':'+si+' '+e.message); } }); }); return out; });
  ok(bad.length===0,'as '+(await page.evaluate(()=>window.__app.JN_CAP.reduce((a,c)=>a+c.sc.length,0)))+' cenas renderizam '+JSON.stringify(bad.slice(0,5)));
  // mesclagem entre aparelhos
  const m=await page.evaluate(()=>{ const a=window.__app.migrate({jn:{c:{c0:{p:5,d:0,st:0,w:[1]}}}}), b=window.__app.migrate({jn:{c:{c0:{p:2,d:1,st:2,w:[3]}},}}); return window.__app.mergeState(a,b).jn.c.c0; });
  ok(m.p===5&&m.d===1&&m.st===2&&m.w.length===2,'mesclagem da Jornada entre aparelhos: '+JSON.stringify(m));
  ok(errors.filter(e=>!/ERR_FAILED/.test(e)).length===0,'sem erros de console '+JSON.stringify(errors.filter(e=>!/ERR_FAILED/.test(e)).slice(0,3)));
  await browser.close();
  const d=await launch({dark:true}); await d.page.click('[data-a="welcomeOk"]'); await W(200);
  await d.page.evaluate(()=>window.__app.jnStartCap(0,3)); await W(600);
  ok(await d.page.locator('.jnmap svg').count()===1&&d.errors.filter(e=>!/ERR_FAILED/.test(e)).length===0,'tema escuro sem erros');
  await d.browser.close();
  console.log(fails?fails+' FALHAS':'TUDO OK'); process.exit(fails?1:0);
})();
