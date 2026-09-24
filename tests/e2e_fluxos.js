const {launch,OUT}=require('./harness.js');
const S=OUT+'/';
(async()=>{
  const {browser,page,errors}=await launch();
  const log=(...a)=>console.log(...a); let cel; const safe=async(loc)=>{ try{ await loc.click({timeout:1500}); }catch(e){ await page.waitForTimeout(400); await cel(); await loc.click({timeout:4000}); } };
  const A=async(name,sel)=>{ await cel(); const loc=page.locator(sel||('[data-a="'+name+'"]')).first(); try{ try{ await loc.click({timeout:1500}); }catch(e0){ await page.waitForTimeout(400); await cel(); await loc.click({timeout:4000}); } }catch(e){ await page.screenshot({path:S+'FAIL_'+name+'.png'}); console.log('FAIL at',name, await page.evaluate(()=>({sheet:!document.querySelector('#sheet').hidden,cel:!document.querySelector('#celebrate').hidden,html:document.querySelector('#celebrate').innerText.slice(0,200)}))); throw e; } await page.waitForTimeout(150); };
  const ev=f=>page.evaluate(f);
  cel=async()=>{ for(let i=0;i<6;i++){ const v=await page.locator('#celebrate:not([hidden]) #celOk').count(); if(!v) break; await safe(page.locator('#celOk').first()); await page.waitForTimeout(250);} };
  await A('welcomeOk');
  // cronômetro
  await A('gtToggle'); await page.waitForTimeout(300); await A('gtToggle'); await A('gtStop');
  // jogo da missão: agora abre o jogo na Arena; joga errando de propósito algumas rodadas
  await safe(page.locator('.mis [data-a="gOpen"]').first()); await page.waitForTimeout(300);
  await A('arPlay','#app [data-a="arPlay"].primary'); await page.waitForTimeout(200);
  let g=0; while(g++<14){ await cel(); const st=await ev(()=>{ const G=window.__app.arCur(); if(!G||G.done) return null; const r=G.rounds[G.pos]; return {k:r.k,right:r.right,n:r.opts?r.opts.length:0,inp:!!r.inp,pos:G.pos}; }); if(!st) break;
    if(['choice','tf'].includes(st.k)||(st.k==='num'&&!st.inp)) await safe(page.locator('#app [data-a="arAns"][data-j="'+(st.pos%3===0?(st.right+1)%st.n:st.right)+'"]').first());
    else await ev(()=>{ const A=window.__app.A, G=window.__app.arCur(); G.pick=-9; window.__app.arCur(); });
    const ans=await ev(()=>window.__app.arCur().ans); if(!ans){ await ev(()=>{ const G=window.__app.arCur(); G.ans=true; G.res={ok:false,frac:0}; G.tot++; G.wrong.push(G.pos); }); }
    await page.waitForTimeout(120); await cel(); if(await page.locator('#app [data-a="arNext"]').count()) await A('arNext'); }
  await page.screenshot({path:S+'10_game_end.png',fullPage:true});
  log('after game: xp',await ev(()=>window.__app.xpTotal()),'erros',await ev(()=>window.__app.S.erros.length));
  await cel(); await A('arGame','#app [data-a="arGame"]'); await A('arHome','#app [data-a="arHome"]'); await A('arBack');
  // flashcards via teclado
  await A('smartOpen'); await page.waitForTimeout(200);
  for(let i=0;i<5;i++){ await page.keyboard.press('Space'); await page.waitForTimeout(80); if(i===0) await page.screenshot({path:S+'11_flash.png'}); await page.keyboard.press(String(1+(i%4))); await page.waitForTimeout(80); await cel(); }
  log('cards today',await ev(()=>window.__app.S.days[window.__app.today()].c));
  await A('closeFlash');
  // relâmpago
  await page.evaluate(()=>{ window.__app.A.relOpenS({dataset:{s:'port'}}); }); await page.waitForTimeout(200);
  for(let i=0;i<4;i++){ await safe(page.locator('#app [data-a="gPick"]').first()); await page.waitForTimeout(1200); }
  await page.screenshot({path:S+'12_relampago.png'});
  await ev(()=>{ window.__app.tutor.game.end=Date.now()-1; }); await page.waitForTimeout(600); await cel();
  log('rel done',await ev(()=>window.__app.tutor.game&&window.__app.tutor.game.done), 'modes',JSON.stringify(await ev(()=>window.__app.S.modes)));
  // chefão
  await ev(()=>window.__app.A.bossOpen({dataset:{s:'comb'}})); await page.waitForTimeout(200);
  for(let i=0;i<20;i++){ await cel(); const st=await ev(()=>{const G=window.__app.tutor.game; return G?{done:G.done,pick:G.pick,right:G.rounds[G.pos]&&G.rounds[G.pos].right}:null;}); if(!st||st.done) break;
    if(st.pick==null){ await safe(page.locator('#app [data-a="gPick"]').nth(st.right)); await page.waitForTimeout(200); if(i===1) await page.screenshot({path:S+'13_boss.png'}); }
    else { if(await page.locator('#app [data-a="gNext"]').count()) await A('gNext'); else await page.waitForTimeout(900); } }
  await page.waitForTimeout(900); await page.screenshot({path:S+'14_boss_win.png'}); await cel();
  log('boss',JSON.stringify(await ev(()=>window.__app.S.modes.comb)));
  await A('gClose');
  // questões IA
  await A('hubNivel'); await A('gerar'); await page.waitForTimeout(100); await page.screenshot({path:S+'15_quizgen.png'}); await page.waitForTimeout(600);
  const nq=await page.locator('#app [data-a="ans"]').count(); log('quiz options',nq);
  for(let i=0;i<5;i++){ await safe(page.locator('#app [data-a="ans"][data-q="'+i+'"]').first()); await page.waitForTimeout(80); await cel(); }
  await page.screenshot({path:S+'16_quiz.png',fullPage:true});
  await A('quizLog'); await A('gerarErros'); await page.waitForTimeout(700); log('regen ok',await page.locator('#app [data-a="ans"]').count());
  await A('closeQuiz');
  // simulado
  await A('simOpen'); await A('simStart'); await page.waitForTimeout(200);
  for(let i=0;i<20;i++){ await page.keyboard.press('b'); if(i%3===0) await A('simGuess'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(40); }
  await page.screenshot({path:S+'17_sim.png'});
  await A('simEnd'); if(await page.locator('#app [data-a="simEnd"]').count()) await A('simEnd'); await page.waitForTimeout(200); await cel();
  await page.screenshot({path:S+'18_sim_res.png'});
  await A('simQuit');
  // teste 80/20
  await A('t80List'); await safe(page.locator('#sheet [data-a="t80Open"]').first()); await page.waitForTimeout(200);
  for(let i=0;i<5;i++) await safe(page.locator('#app [data-a="t80Ans"][data-i="'+i+'"]').nth(0));
  await A('t80Finish'); await cel(); await A('closeT80');
  // caderno de erros
  await safe(page.locator('#tabsIn [data-v="erros"]').first()); await page.waitForTimeout(200);
  await page.screenshot({path:S+'19_erros.png',fullPage:true});
  // força erros vencidos
  await ev(()=>{ window.__app.S.erros.forEach(e=>e.prox=window.__app.today()); window.__app.render(); });
  await A('rfStart'); for(let i=0;i<3;i++){ const p=await page.locator('#app [data-a="rfPick"]').count(); if(p) await safe(page.locator('#app [data-a="rfPick"]').first()); else if(await page.locator('#app [data-a="rfShow"]').count()) await A('rfShow'); await page.waitForTimeout(80); await safe(page.locator('#app [data-a="rfGrade"]').first()); await page.waitForTimeout(80); await cel(); }
  await page.screenshot({path:S+'20_refazer.png'});
  await A('rfClose');
  // redação
  await safe(page.locator('#tabsIn [data-v="redacao"]').first()); await A('sortear'); await A('planoRed'); await page.waitForTimeout(300);
  await A('corrigir'); await page.fill('#rcX',Array.from({length:80},(_,i)=>'palavra'+i).join(' ')); await page.waitForTimeout(600);
  await safe(page.locator('#sheet .sheet-close').first()); await page.waitForTimeout(100); await A('corrigir'); log('draft kept',(await page.inputValue('#rcX')).length>100);
  await A('runCorrigir'); await page.waitForTimeout(400); await page.screenshot({path:S+'21_redacao.png'}); await A('saveCorr'); await cel();
  // instrutor
  await safe(page.locator('#fab').first()); await page.fill('#convIn','O que é poder de polícia?'); await A('convSend'); await page.waitForTimeout(400);
  await page.screenshot({path:S+'22_instrutor.png'});
  await safe(page.locator('#sheet .sheet-close').first());
  // configurações
  await safe(page.locator('#tabsIn [data-v="mapa"]').first()); await A('settings'); await page.fill('#cfName','Victor'); await page.fill('#cfExam','2026-12-06'); await page.locator('[data-a="cfGoal"][data-v="300"]').click(); await A('saveSettings');
  log('cfg',JSON.stringify(await ev(()=>window.__app.S.cfg)));
  // registrar + desfazer
  await page.evaluate(()=>window.__app.A.log({dataset:{}})); await page.waitForTimeout(150); await page.fill('#lgA','9'); await A('saveLog'); await cel(); const q1=await ev(()=>window.__app.S.days[window.__app.today()].q); await A('undo'); const q2=await ev(()=>window.__app.S.days[window.__app.today()].q); log('undo q',q1,'->',q2);
  // backup
  await A('backup'); await A('backupFile'); await page.waitForTimeout(200); log('after backupFile sheet open?',await ev(()=>!document.querySelector('#sheet').hidden), await ev(()=>document.querySelector('#sheetBody').innerText.slice(0,60)));
  // jogos especiais
  for(const id of ['pt-spot1','qm-ptable','hs-tl','hs-mapa','hs-cloze','hs-vf','mt-base','mt-build']){ await page.evaluate(id=>window.__app.A.gOpen({dataset:{id}}),id); await page.waitForTimeout(150);
    const btn=await page.locator('#app [data-a="spotTap"],#app [data-a="ptPick"],#app [data-a="tlTap"],#app [data-a="mapTap"],#app [data-a="gPick"],#app [data-a="gOrd"]').first(); if(await btn.count()) await safe(btn); log(id,'sheet',await ev(()=>!document.querySelector('#sheet').hidden)); await page.waitForTimeout(150); await cel(); }
  await safe(page.locator('#tabsIn [data-v="hoje"]').first()); await page.waitForTimeout(300); await cel();
  await page.screenshot({path:S+'23_hoje_after.png',fullPage:true});
  log('xp',await ev(()=>window.__app.xpTotal()),'missions',JSON.stringify(await ev(()=>window.__app.missions().list.map(m=>[m.type,m.done]))));
  log('writes',await ev(()=>window.__writes),'db keys',await ev(()=>Object.keys(window.__DB).length));
  console.log(errors.filter(e=>!/ERR_FAILED/.test(e)).join('\n')||'NO ERRORS');
  await browser.close();
})().catch(e=>{ console.error('TEST FAIL',e.message); process.exit(1); });
