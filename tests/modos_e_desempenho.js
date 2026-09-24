const {launch,OUT}=require('./harness.js');
const S=OUT+'/';
const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1; };
(async()=>{
  // 1) Claude indisponível: questões vêm do banco local
  { const {browser,page,errors}=await launch({sampleMode:'off',wait:1200}); await page.click('[data-a="welcomeOk"]');
    await page.evaluate(()=>window.__app.A.gerarDe({dataset:{t:'port-conc'}})); await page.waitForTimeout(600);
    const n=await page.locator('#app [data-a="ans"]').count(); ok(n>=15,'sem Claude: treino montado com o banco do app ('+n/5+' questões)');
    await page.evaluate(()=>window.__app.A.aiOpen()); await page.waitForTimeout(200); await page.fill('#convIn','teste'); await page.click('[data-a="convSend"]'); await page.waitForTimeout(300);
    ok(await page.locator('#cpTxt').count()===1,'sem Claude: Instrutor oferece "Copiar pedido"');
    const errs=errors.filter(e=>!/ERR_FAILED/.test(e)); ok(!errs.length,'sem erros de console'+(errs.length?': '+errs.join(' | '):'')); await browser.close(); }
  // 2) arquivo avulso, sem window.claude
  { const {browser,page,errors}=await launch({noClaude:true,wait:1200}); const sync=await page.textContent('#syncEl'); ok(/aparelho/.test(sync),'arquivo avulso: modo local ("'+sync+'")'); await page.click('[data-a="welcomeOk"]');
    await page.evaluate(()=>window.__app.A.gOpen({dataset:{id:'pt-crase'}})); await page.waitForTimeout(200); await page.locator('#app [data-a="gPick"]').first().click(); await page.waitForTimeout(200);
    const errs=errors.filter(e=>!/ERR_FAILED/.test(e)); ok(!errs.length,'arquivo avulso sem erros'+(errs.length?': '+errs.join(' | '):'')); await browser.close(); }
  // 3) tema escuro + largura de computador
  { const {browser,page}=await launch({dark:true,w:1280,h:900}); await page.click('[data-a="welcomeOk"]'); await page.waitForTimeout(300); await page.screenshot({path:S+'30_dark_desktop.png'});
    await page.evaluate(()=>window.__app.A.smartOpen()); await page.waitForTimeout(200); await page.keyboard.press('Space'); await page.waitForTimeout(600); await page.screenshot({path:S+'31_dark_flash.png'}); await browser.close(); }
  { const {browser,page}=await launch({dark:true}); await page.click('[data-a="welcomeOk"]'); await page.evaluate(()=>window.__app.A.bossOpen({dataset:{s:'ps'}})); await page.waitForTimeout(300); await page.screenshot({path:S+'32_dark_boss.png'}); await browser.close(); }
  // 4) desempenho com histórico grande
  { const {browser,page}=await launch({wait:1200}); await page.click('[data-a="welcomeOk"]');
    const ms=await page.evaluate(()=>{ const S=window.__app.S, k=window.__app.today(); for(let i=0;i<1500;i++) S.erros.push({id:'b'+i,t:'port-int',q:'Questão '+i,opts:['a','b','c','d','e'],right:1,criado:k,prox:k,etapa:0,done:false,n:1}); for(let i=0;i<700;i++){ const d=new Date(Date.now()-i*864e5).toISOString().slice(0,10); S.days[d]=S.days[d]||{min:30,q:20,a:15,xp:150,done:{}}; } window.__app.commit(); const out={}; for(const t of ['hoje','tutor','erros','mapa','redacao']){ window.__app.A.tab({dataset:{v:t}}); const t0=performance.now(); for(let j=0;j<5;j++) window.__app.render(); out[t]=Math.round((performance.now()-t0)/5); } return out; });
    console.log('render ms por aba (1500 erros, 700 dias):',JSON.stringify(ms)); ok(Math.max(...Object.values(ms))<120,'render rápido mesmo com histórico grande'); await browser.close(); }
})();
