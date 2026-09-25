// Arena: joga partidas completas clicando na interface, cobrindo todos os tipos de rodada.
const {launch,OUT}=require('./harness.js');
const S=OUT+'/arena_';
(async()=>{
  const {browser,page,errors}=await launch();
  const ev=(f,a)=>page.evaluate(f,a), log=(...a)=>console.log(...a);
  const cel=async()=>{ for(let i=0;i<6;i++){ if(!await page.locator('#celebrate:not([hidden]) #celOk').count()) break; await page.locator('#celOk').click(); await page.waitForTimeout(200); } };
  const click=async sel=>{ await cel(); await page.locator(sel).first().click({timeout:4000}); await page.waitForTimeout(60); };
  await click('[data-a="welcomeOk"]');
  await ev(()=>{ window.__app.A.tab({dataset:{v:'tutor'}}); });
  await page.waitForTimeout(200); await page.screenshot({path:S+'00_hub.png',fullPage:true});
  await click('[data-a="hubGames"]'); await page.waitForTimeout(200);
  await page.screenshot({path:S+'01_home.png',fullPage:true});
  const shot=new Set();
  async function solve(){
    const r=await ev(()=>{ const G=window.__app.arCur(); const r=G.rounds[G.pos]; return {k:r.k,inp:!!r.inp,right:r.right,wrong:r.wrong,n:(r.items||r.pairs||[]).length,sl:r.sl,zone:r.zone,sym:r.sym,co:r.co,ans:r.ans,d:r.d,items:r.items&&r.k==='sort'?r.items.map(x=>x[1]):null}; });
    if(!shot.has(r.k+(r.inp?'i':''))){ shot.add(r.k+(r.inp?'i':'')); await page.screenshot({path:S+'k_'+r.k+(r.inp?'_digitar':'')+'.png',fullPage:true}); }
    if(r.k==='num'&&r.inp){ const s=String(Math.round(r.ans*Math.pow(10,r.d))/Math.pow(10,r.d)).replace('.',','); for(const ch of s){ const k=ch==='-'?'−':ch; await click('[data-a="arKey"][data-k="'+k+'"]'); } await click('[data-a="arKey"][data-k="OK"]'); }
    else if(['choice','tf','num'].includes(r.k)) await click('[data-a="arAns"][data-j="'+r.right+'"]');
    else if(r.k==='spot') await click('[data-a="arTok"][data-j="'+r.wrong+'"]');
    else if(r.k==='pick') await click('[data-a="arTok"][data-j="'+(Array.isArray(r.right)?r.right[0]:r.right)+'"]');
    else if(r.k==='order'){ for(let i=0;i<r.n;i++) await click('[data-a="arOrd"][data-k="'+i+'"]'); }
    else if(r.k==='sort'){ for(let i=0;i<r.items.length;i++){ await click('[data-a="arSortSel"][data-i="'+i+'"]'); await click('[data-a="arSortBin"][data-j="'+r.items[i]+'"]'); } await click('[data-a="arSortOk"]'); }
    else if(r.k==='match'){ for(let i=0;i<r.n;i++){ await click('[data-a="arML"][data-i="'+i+'"]'); await click('[data-a="arMR"][data-i="'+i+'"]'); } }
    else if(r.k==='commas'){ for(let i=0;i<r.sl.length;i++) if(r.sl[i]==='must') await click('[data-a="arComma"][data-i="'+i+'"]'); await click('[data-a="arCommaOk"]'); }
    else if(r.k==='map') await click('[data-a="arMap"][data-z="'+r.zone+'"]');
    else if(r.k==='ptable') await click('[data-a="arPT"][data-s="'+r.sym+'"]');
    else if(r.k==='balance'){ for(let i=0;i<r.co.length;i++) for(let j=1;j<r.co[i];j++) await click('[data-a="arBal"][data-i="'+i+'"][data-d="1"]'); await click('[data-a="arBalOk"]'); }
    if(!shot.has('fb_'+r.k)){ shot.add('fb_'+r.k); await page.screenshot({path:S+'fb_'+r.k+'.png',fullPage:true}); }
    const st=await ev(()=>{ const G=window.__app.arCur(); return {ans:G.ans,ok:G.res&&G.res.ok}; });
    if(!st.ans||!st.ok) log('NOT OK', JSON.stringify(r).slice(0,200), JSON.stringify(st));
  }
  async function playRun(gid,L){
    await ev(([g,l])=>window.__app.arStart(g,l,'run'),[gid,L]); await page.waitForTimeout(150);
    for(let i=0;i<12;i++){ const done=await ev(()=>{ const G=window.__app.arCur(); return !G||G.done; }); if(done) break; await solve(); await page.waitForTimeout(80); await cel(); await click('[data-a="arNext"]'); }
    const G=await ev(()=>{ const G=window.__app.arCur(); return {done:G.done,stars:G.stars,unl:G.unlocked,ok:G.ok,n:G.rounds.length}; }); return G;
  }
  // um jogo de cada matéria, níveis variados, cobrindo todas as dinâmicas
  const plan=[['ar-port-pont',3],['ar-port-pont',5],['ar-port-conc',3],['ar-port-int',5],['ar-port-sint',3],['ar-port-cla',1],['ar-mat-eq',4],['ar-mat-gp',1],['ar-mat-fun',3],['ar-fis-eldin',3],['ar-fis-cin',5],['ar-qui-reac',3],['ar-qui-atom',3],['ar-hist-ocup',3],['ar-hist-emanc',4],['ar-hist-ciclos',5],['ar-port-coe',2]];
  for(const [g,L] of plan){ const r=await playRun(g,L); log(g,'L'+L,JSON.stringify(r)); }
  await page.screenshot({path:S+'02_end.png',fullPage:true});
  log('arena state', JSON.stringify(await ev(()=>window.__app.S.arena['ar-port-pont'])));
  log('kinds seen', [...shot].filter(x=>!x.startsWith('fb_')).join(' '));
  // tela do jogo e trilha de níveis
  await ev(()=>window.__app.A.arGame({dataset:{g:'ar-port-pont'}})); await page.waitForTimeout(150); await page.screenshot({path:S+'03_game.png',fullPage:true});
  // errar de propósito e refazer erros
  await ev(()=>window.__app.arStart('ar-mat-porc',2,'run')); await page.waitForTimeout(120);
  for(let i=0;i<10;i++){ const r=await ev(()=>{ const G=window.__app.arCur(); const r=G.rounds[G.pos]; return {k:r.k,right:r.right,inp:r.inp,n:r.opts?r.opts.length:0}; }); if(r.k==='num'&&r.inp){ await click('[data-a="arKey"][data-k="9"]'); await click('[data-a="arKey"][data-k="OK"]'); } else await click('[data-a="arAns"][data-j="'+((r.right+1)%r.n)+'"]'); await cel(); await click('[data-a="arNext"]'); }
  log('wrong run', JSON.stringify(await ev(()=>{ const G=window.__app.arCur(); return {stars:G.stars,ok:G.ok,erros:window.__app.S.erros.length}; })));
  await page.screenshot({path:S+'04_end_bad.png',fullPage:true});
  await click('[data-a="arRetry"]'); await page.waitForTimeout(120); log('retry mode',await ev(()=>window.__app.arCur().mode+' '+window.__app.arCur().rounds.length));
  // contra o relógio
  await ev(()=>window.__app.arStart('ar-fis-din',2,'rel')); await page.waitForTimeout(150);
  for(let i=0;i<5;i++){ const r=await ev(()=>{ const G=window.__app.arCur(); return G.rounds[G.pos].right; }); await click('[data-a="arAns"][data-j="'+r+'"]'); await page.waitForTimeout(550); }
  await page.screenshot({path:S+'05_relogio.png'});
  await ev(()=>{ window.__app.arCur().end=Date.now()-1; }); await page.waitForTimeout(700); await cel();
  log('rel', JSON.stringify(await ev(()=>{ const G=window.__app.arCur(); return {done:G.done,score:G.score,rec:window.__app.S.arena['ar-fis-din'].rel}; })));
  // nivelamento
  await ev(()=>window.__app.arStart('ar-qui-sol',3,'niv')); await page.waitForTimeout(120);
  for(let i=0;i<8;i++){ const d=await ev(()=>{ const G=window.__app.arCur(); return G.done; }); if(d) break; await solve(); await cel(); await click('[data-a="arNext"]'); }
  log('niv', JSON.stringify(await ev(()=>{ const G=window.__app.arCur(); return {done:G.done,place:G.place,lv:window.__app.S.arena['ar-qui-sol'].lv}; })));
  // rodada com IA (Claude simulado)
  await ev(()=>window.__app.A.arGame({dataset:{g:'ar-mat-pa'}})); await page.waitForTimeout(100); await click('[data-a="arIA"]'); await page.waitForTimeout(700);
  log('ia', JSON.stringify(await ev(()=>{ const G=window.__app.arCur(); return G?{mode:G.mode,n:G.rounds.length}:window.__app.tutor.arena&&window.__app.tutor.arena.view; })));
  // Relâmpago e Chefão das matérias da Arena usam as questões novas
  await ev(()=>window.__app.A.bossOpen({dataset:{s:'fis'}})); await page.waitForTimeout(200); await page.screenshot({path:S+'06_chefao.png'});
  log('boss q', await ev(()=>window.__app.tutor.game.rounds[0].q.slice(0,80)));
  // tema escuro
  await ev(()=>{ document.documentElement.setAttribute('data-theme','dark'); window.__app.A.arGame({dataset:{g:'ar-qui-org'}}); }); await page.waitForTimeout(150); await page.screenshot({path:S+'07_dark_game.png',fullPage:true});
  await ev(()=>window.__app.arStart('ar-mat-trig',1,'run')); await page.waitForTimeout(150); await page.screenshot({path:S+'08_dark_run.png',fullPage:true});
  await ev(()=>window.__app.A.arHome({dataset:{s:'hist'}})); await page.waitForTimeout(150); await page.screenshot({path:S+'09_dark_home.png',fullPage:true});
  // teclado
  await ev(()=>{ document.documentElement.removeAttribute('data-theme'); window.__app.arStart('ar-fis-unid',1,'run'); }); await page.waitForTimeout(120);
  const r0=await ev(()=>window.__app.arCur().rounds[0].right); await page.keyboard.press(String(r0+1)); await page.waitForTimeout(100); await page.keyboard.press('Enter'); await page.waitForTimeout(100);
  log('keyboard pos', await ev(()=>window.__app.arCur().pos+' ok='+window.__app.arCur().ok));
  log('errors:', JSON.stringify(errors.filter(e=>!/ERR_FAILED|fonts/.test(e))));
  await browser.close();
})();
