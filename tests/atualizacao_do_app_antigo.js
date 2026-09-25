const {launch,OUT}=require('./harness.js');
const {execSync}=require('child_process');
const fs=require('fs');
const S=OUT+'/';
const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1; };
(async()=>{
  // 1) usa o app ANTIGO: registra questões, anota erro, revisa cartões, joga
  // versão antiga do app, direto do histórico do git (commit inicial)
  const oldFull=execSync('git show fc0fa09:"Plano Cadete CBMPR.html"',{cwd:__dirname+'/..',maxBuffer:1e8}).toString();
  const oldBody=OUT+'/app_antigo.html';
  fs.writeFileSync(oldBody,'<style>'+oldFull.match(/<style>([\s\S]*?)<\/style>/)[1]+'</style>'+oldFull.replace(/^[\s\S]*?<body>/,'').replace(/<\/body>[\s\S]*$/,''));
  let oldLS;
  { const {browser,page,errors}=await launch({noClaude:true,file:oldBody,wait:900});
    await page.evaluate(()=>{ const a=window.__app; }); 
    await page.click('[data-a="welcomeOk"]').catch(()=>{});
    // registrar 12 questões com 11 acertos
    await page.click('[data-a="log"]'); await page.fill('#lgF','12'); await page.fill('#lgA','11'); await page.click('[data-a="saveLog"]'); await page.waitForTimeout(150);
    // anotar erro manual
    await page.evaluate(()=>{ document.querySelector('[data-a="tab"][data-v="erros"]').click(); }); await page.waitForTimeout(150);
    await page.click('[data-a="addErro"]'); await page.fill('#erE','Confundi CVCB com CLCB'); await page.fill('#erR','CLCB é o licenciamento simplificado'); await page.click('[data-a="saveErro"]'); await page.waitForTimeout(150);
    // revisar 3 flashcards
    await page.evaluate(()=>{ document.querySelector('[data-a="tab"][data-v="tutor"]').click(); }); await page.waitForTimeout(150);
    await page.click('[data-a="smartOpen"]'); for(let i=0;i<3;i++){ await page.click('[data-a="flashFlip"]'); await page.click('[data-a="flashGrade"][data-g="2"]'); await page.waitForTimeout(60); }
    oldLS=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])));
    const o=JSON.parse(oldLS['cadete-cbmpr-v1']); console.log('old state: q=',Object.values(o.days).reduce((a,d)=>a+(d.q||0),0),'erros=',o.erros.length,'seen cards=',Object.values(o.flashcards).flat().filter(c=>c.seen).length,'errors:',errors.filter(e=>!/ERR_FAILED/.test(e)).length);
    await browser.close(); }
  // 2) abre o app NOVO com esses dados
  const {browser,page,errors}=await launch({ls:oldLS,noClaude:true,wait:1200});
  await page.screenshot({path:S+'40_upgrade_news.png'});
  const news=await page.locator('#sheet:not([hidden]) #sheetTitle').textContent().catch(()=>''); ok(/Novidades/.test(news),'mostra "Novidades" para quem já usava ('+news+')');
  const nm=await page.inputValue('#wName').catch(()=>''); ok(nm==='Victor','nome preenchido para o usuário existente ('+nm+')');
  await page.click('[data-a="welcomeOk"]'); await page.waitForTimeout(300);
  const st=await page.evaluate(()=>{ const a=window.__app, S=a.S; return {q:Object.values(S.days).reduce((x,d)=>x+(d.q||0),0),erros:S.erros.length,seen:Object.values(S.flashcards).flat().filter(c=>c.seen).length,xp:a.xpTotal(),lvl:a.levelFromXP(a.xpTotal()).L,streak:a.streak(),ach:Object.keys(S.ach).length,newDecks:(S.flashcards['dcon-dir']||[]).length,content:(S.flashcards['ps-quei']||[]).length}; });
  console.log(JSON.stringify(st));
  ok(st.q===12&&st.erros===1&&st.seen===3,'dados antigos preservados (questões, erro, cartões revisados)');
  ok(st.xp>0,'histórico virou XP: '+st.xp+' XP, nível '+st.lvl);
  ok(st.streak>=1,'sequência preservada: '+st.streak);
  ok(st.newDecks>0&&st.content>0,'baralhos novos adicionados sem apagar os antigos');
  await page.screenshot({path:S+'41_upgrade_hoje.png',fullPage:true});
  const errs=errors.filter(e=>!/ERR_FAILED/.test(e)); ok(!errs.length,'sem erros'+(errs.length?': '+errs.join(' | '):''));
  await browser.close();
})();
