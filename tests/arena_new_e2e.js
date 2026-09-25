// Os 5 jogos novos da Arena (Caça-pegadinha, Raio-X do problema x2, Pegadinha gêmea x2) e o
// reagrupamento do Português em trilhas: joga uma partida de cada, confere pontuação e telas.
const {launch}=require('./harness.js');
const W=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0; const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) fails++; };
async function playOne(page,id){
  await page.evaluate(id=>window.__app.arStart(id,1,'run'),id);
  await W(400);
  for(let i=0;i<12;i++){
    const done=await page.evaluate(()=>{ const G=window.__app.arCur(); return !G||G.done; });
    if(done) break;
    const info=await page.evaluate(()=>{ const G=window.__app.arCur(); const r=G.rounds[G.pos]; return {ans:G.ans,right:r.right,k:r.k}; });
    if(!info.ans) await page.evaluate(j=>{ const G=window.__app.arCur(); window.__app.A.arAns({dataset:{j:String(j)}}); },info.right);
    await W(120);
    await page.evaluate(()=>{ const G=window.__app.arCur(); if(G&&G.ans&&!G.done) window.__app.A.arNext(); });
    await W(120);
  }
  return page.evaluate(()=>{ const G=window.__app.arCur(); return G&&{done:G.done,ok:G.ok,tot:G.tot,xp:G.xp}; });
}
(async()=>{
  const {browser,page,errors}=await launch();
  await page.click('[data-a="welcomeOk"]'); await W(300);
  for(const id of ['ar-port-pega','ar-fis-radar','ar-fis-gemeo','ar-mat-radar','ar-mat-gemeo']){
    const r=await playOne(page,id);
    ok(r&&r.done&&r.ok===r.tot&&r.tot>0,'joga '+id+' de ponta a ponta, acertando tudo: '+JSON.stringify(r));
  }
  // domínio de tópico não-edital não deve quebrar nada (addEv no-opa em silêncio)
  ok(await page.evaluate(()=>typeof window.__app.S.mst==='object'),'estado segue consistente depois de jogar tópicos fora do edital');

  // Português: trilhas agrupadas em vez de lista única
  await page.evaluate(()=>{ window.__app.A.tab({dataset:{v:'tutor'}}); }); await W(200);
  await page.evaluate(()=>window.__app.A.hubGames()); await W(300);
  await page.evaluate(()=>window.__app.A.arTab({dataset:{s:'port'}})); await W(400);
  const h2s=await page.locator('#app h2').allTextContents();
  ok(h2s.includes('Regra dura')&&h2s.includes('Léxico e forma')&&h2s.includes('Leitura e texto'),'Português mostra as 3 trilhas: '+JSON.stringify(h2s));
  ok(await page.locator('.aglist').count()===3,'cada trilha tem sua própria lista de jogos');
  const pegaCard=await page.locator('.agc[data-g="ar-port-pega"]').count();
  ok(pegaCard===1,'Caça-pegadinha aparece na trilha Regra dura');

  // biblioteca de pegadinhas
  await page.click('[data-a="portPegaSheet"]'); await W(400);
  ok(await page.locator('#sheet .jngitem').count()===20,'biblioteca de pegadinhas lista as 20 armadilhas');
  ok((await page.locator('#sheet h2').first().textContent()).includes('Biblioteca de pegadinhas'),'título correto da biblioteca');
  await page.evaluate(()=>window.__app.A.closeSheet()); await W(200);

  // Física e Matemática continuam com a lista simples (sem trilha)
  await page.evaluate(()=>window.__app.A.arTab({dataset:{s:'fis'}})); await W(400);
  ok(await page.locator('#app h2').allTextContents().then(a=>!a.includes('Regra dura')),'Física não usa trilhas (só o Português)');
  ok(await page.locator('.agc[data-g="ar-fis-radar"]').count()===1&&await page.locator('.agc[data-g="ar-fis-gemeo"]').count()===1,'os 2 jogos novos de Física aparecem na lista');
  await page.evaluate(()=>window.__app.A.arTab({dataset:{s:'mat'}})); await W(400);
  ok(await page.locator('.agc[data-g="ar-mat-radar"]').count()===1&&await page.locator('.agc[data-g="ar-mat-gemeo"]').count()===1,'os 2 jogos novos de Matemática aparecem na lista');

  ok(errors.filter(e=>!/ERR_FAILED/.test(e)).length===0,'sem erros de console '+JSON.stringify(errors.filter(e=>!/ERR_FAILED/.test(e)).slice(0,3)));
  await browser.close();

  const d=await launch({dark:true}); await d.page.click('[data-a="welcomeOk"]'); await W(200);
  const rd=await playOne(d.page,'ar-port-pega');
  ok(rd&&rd.done,'joga no tema escuro sem erro: '+JSON.stringify(rd));
  ok(d.errors.filter(e=>!/ERR_FAILED/.test(e)).length===0,'tema escuro sem erros de console');
  await d.browser.close();

  console.log(fails?fails+' FALHAS':'TUDO OK'); process.exit(fails?1:0);
})();
