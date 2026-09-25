// Jogo novo "Mapa dos elementos" (tabela periódica), Atlas da tabela periódica,
// alternância de tema claro/escuro/automático e botão do Instrutor menor.
const {launch}=require('./harness.js');
const W=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0; const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) fails++; };

async function answerPT(page){
  const info=await page.evaluate(()=>{ const G=window.__app.arCur(); const r=G.rounds[G.pos]; return {k:r.k,sym:r.sym,right:r.right}; });
  if(info.k==='ptable'){
    const target=Array.isArray(info.sym)?info.sym[0]:info.sym;
    await page.evaluate(sym=>{ const btns=[...document.querySelectorAll('.ptcell')]; const b=btns.find(x=>x.textContent.trim()===sym); b&&b.click(); },target);
  } else {
    await page.evaluate(j=>{ window.__app.A.arAns({dataset:{j:String(j)}}); },info.right);
  }
}
async function playQuiTabela(page,L){
  await page.evaluate(L=>window.__app.arStart('ar-qui-tabela',L,'run'),L);
  await W(300);
  for(let i=0;i<12;i++){
    const done=await page.evaluate(()=>{ const G=window.__app.arCur(); return !G||G.done; });
    if(done) break;
    const ans=await page.evaluate(()=>{ const G=window.__app.arCur(); return G.ans; });
    if(!ans) await answerPT(page);
    await W(120);
    await page.evaluate(()=>{ const G=window.__app.arCur(); if(G&&G.ans&&!G.done) window.__app.A.arNext(); });
    await W(120);
  }
  return page.evaluate(()=>{ const G=window.__app.arCur(); return G&&{done:G.done,ok:G.ok,tot:G.tot,xp:G.xp}; });
}

(async()=>{
  const {browser,page,errors}=await launch({ls:{'cadete-cbmpr-v1':JSON.stringify({welcomed:true,newsV:999})}});

  for(let L=1;L<=5;L++){
    const r=await playQuiTabela(page,L);
    ok(r&&r.done&&r.tot>0,'joga Mapa dos elementos nível '+L+' de ponta a ponta: '+JSON.stringify(r));
  }

  // multi-resposta de família: qualquer elemento da família conta como certo
  await page.evaluate(()=>window.__app.arStart('ar-qui-tabela',3,'run')); await W(300);
  let famRound=null;
  for(let i=0;i<15&&!famRound;i++){
    const info=await page.evaluate(()=>{ const G=window.__app.arCur(); const r=G.rounds[G.pos]; return {k:r.k,sym:r.sym,ans:G.ans}; });
    if(info.k==='ptable'&&Array.isArray(info.sym)&&info.sym.length>1){ famRound=info; break; }
    await answerPT(page); await W(100);
    await page.evaluate(()=>{ const G=window.__app.arCur(); if(G&&G.ans&&!G.done) window.__app.A.arNext(); }); await W(100);
  }
  ok(!!famRound,'aparece uma rodada de família com mais de um elemento válido');
  if(famRound){
    await page.evaluate(sym=>{ const btns=[...document.querySelectorAll('.ptcell')]; const b=btns.find(x=>x.textContent.trim()===sym); b&&b.click(); },famRound.sym[famRound.sym.length-1]);
    await W(200);
    const res=await page.evaluate(()=>window.__app.arCur().res.ok);
    ok(res===true,'tocar em QUALQUER elemento da família conta como certo (tocou o último da lista)');
  }

  // atlas da tabela periódica
  await page.evaluate(()=>window.__app.A.arHome({dataset:{s:'qui'}})); await W(300);
  ok(await page.locator('[data-a="quiTabelaSheet"]').count()===1,'botão do Atlas da tabela periódica aparece na Arena de Química');
  await page.evaluate(()=>document.querySelector('[data-a="quiTabelaSheet"]').click()); await W(300);
  ok((await page.locator('#sheet h2').first().textContent()).includes('Atlas da tabela periódica'),'título correto do atlas');
  ok(await page.locator('#sheet .ptatlas .ptcell:not(.empty)').count()===36,'atlas lista os 36 elementos');
  ok(await page.locator('#sheet .ptleg span').count()===10,'legenda com as 10 famílias/categorias');
  await page.evaluate(()=>window.__app.A.closeSheet()); await W(200);

  // tema claro/escuro/automático
  await page.evaluate(()=>{ window.__app.A.tab({dataset:{v:'hoje'}}); }); await W(200);
  const t0=await page.evaluate(()=>document.documentElement.dataset.theme||null);
  ok(t0===undefined||t0===null,'tema começa automático (sem data-theme)');
  await page.evaluate(()=>document.querySelector('[data-a="themeToggle"]').click()); await W(150);
  ok((await page.evaluate(()=>document.documentElement.dataset.theme))==='light','1º toque muda para tema claro');
  await page.evaluate(()=>document.querySelector('[data-a="themeToggle"]').click()); await W(150);
  ok((await page.evaluate(()=>document.documentElement.dataset.theme))==='dark','2º toque muda para tema escuro');
  await page.evaluate(()=>document.querySelector('[data-a="themeToggle"]').click()); await W(150);
  const t3=await page.evaluate(()=>document.documentElement.dataset.theme||null);
  ok(t3===undefined||t3===null,'3º toque volta ao automático');
  const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('cadete-cbmpr-ui')||'{}').theme);
  ok(persisted==='sys','preferência de tema é salva');

  // botão do Instrutor menor
  const fabH=await page.evaluate(()=>document.getElementById('fab').getBoundingClientRect().height);
  ok(fabH>0&&fabH<42,'botão do Instrutor ficou menor (altura '+fabH.toFixed(1)+'px)');

  ok(errors.filter(e=>!/ERR_FAILED/.test(e)).length===0,'sem erros de console '+JSON.stringify(errors.filter(e=>!/ERR_FAILED/.test(e)).slice(0,3)));
  await browser.close();

  const d=await launch({dark:true,ls:{'cadete-cbmpr-v1':JSON.stringify({welcomed:true,newsV:999})}});
  const rd=await playQuiTabela(d.page,1);
  ok(rd&&rd.done,'Mapa dos elementos funciona no tema escuro: '+JSON.stringify(rd));
  ok(d.errors.filter(e=>!/ERR_FAILED/.test(e)).length===0,'tema escuro sem erros de console');
  await d.browser.close();

  console.log(fails?fails+' FALHAS':'TUDO OK'); process.exit(fails?1:0);
})();
