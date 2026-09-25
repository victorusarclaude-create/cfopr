// Painel: cards de matéria (não mais a lista plana) e o novo mapa de atividade (heatmap).
const {launch}=require('./harness.js');
const W=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0; const ok=(c,m)=>{ console.log((c?'PASS ':'FAIL ')+m); if(!c) fails++; };
(async()=>{
  const {browser,page,errors}=await launch();
  await page.click('[data-a="welcomeOk"]'); await W(300);
  await page.evaluate(()=>{
    const addDays=(k,n)=>{ const d=new Date(k+'T00:00:00'); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
    const k0=window.__app.today();
    for(let i=1;i<40;i+=2) window.__app.S.days[addDays(k0,-i)]={xp:30+i,min:10,q:2,a:1,done:{}};
  });
  await page.evaluate(()=>window.__app.A.tab({dataset:{v:'mapa'}})); await W(500);
  ok(await page.locator('.subjrow').count()===0,'a lista plana antiga (.subjrow) não existe mais');
  const cards=await page.locator('.subjcard').count();
  ok(cards>=15,'as matérias viram cards (.subjcard): '+cards);
  ok(await page.locator('.subjcard-ic').first().textContent().then(t=>t.trim().length>=1&&t.trim().length<=3),'cada card tem um monograma como ícone');
  const metaTexts=await page.locator('.subjcard-b .meta').allTextContents();
  ok(metaTexts.every(t=>/\d+%$/.test(t.trim())),'o texto do card não corta no meio (termina em "...%"): '+JSON.stringify(metaTexts.slice(0,2)));
  ok(await page.locator('.heatwrap').count()===1,'o mapa de atividade aparece no Painel');
  const cells=await page.locator('.heat .hd').count();
  ok(cells>=90,'o mapa de atividade tem uma célula por dia (14 semanas): '+cells);
  ok(await page.locator('.heat .hd.today').count()===1,'o dia de hoje é marcado no mapa');
  const colored=await page.locator('.heat .hd.l1,.heat .hd.l2,.heat .hd.l3,.heat .hd.l4').count();
  ok(colored>=15,'células com estudo aparecem mais escuras: '+colored+' células coloridas');
  ok(await page.locator('.heatwrap .wc-h b').textContent().then(t=>/últimos \d+ dias/.test(t)),'título do mapa de atividade');

  await page.evaluate(()=>window.__app.A.subjOpen({dataset:{s:'mat'}})); await W(400);
  ok(await page.locator('#sheet .trow').count()>=10,'a folha da matéria continua listando os tópicos (não mudou)');
  await page.evaluate(()=>window.__app.A.closeSheet()); await W(200);

  ok(errors.filter(e=>!/ERR_FAILED/.test(e)).length===0,'sem erros de console '+JSON.stringify(errors.filter(e=>!/ERR_FAILED/.test(e)).slice(0,3)));
  await browser.close();

  const d=await launch({dark:true}); await d.page.click('[data-a="welcomeOk"]'); await W(200);
  await d.page.evaluate(()=>window.__app.A.tab({dataset:{v:'mapa'}})); await W(500);
  ok(await d.page.locator('.subjcard').count()>=15&&await d.page.locator('.heatwrap').count()===1,'Painel renderiza igual no tema escuro');
  ok(d.errors.filter(e=>!/ERR_FAILED/.test(e)).length===0,'tema escuro sem erros de console');
  await d.browser.close();

  console.log(fails?fails+' FALHAS':'TUDO OK'); process.exit(fails?1:0);
})();
