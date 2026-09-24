// Harness de teste: abre o app num Chromium sem interface, com um window.claude simulado
// (db em memória, user, sample e downloads). Requer: npm i -g playwright (ou playwright local).
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const fs=require('fs'), path=require('path');
const APP=path.resolve(__dirname,'..','Plano Cadete CBMPR.html');
const OUT=path.resolve(__dirname,'out'); fs.mkdirSync(OUT,{recursive:true});
async function launch(opts={}){
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:opts.w||412,height:opts.h||900},colorScheme:opts.dark?'dark':'light'});
  const page = await ctx.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push('pageerror: '+e.message+'\n'+(e.stack||'').split('\n').slice(0,3).join('\n')));
  page.on('console',m=>{ if(m.type()==='error') errors.push('console: '+m.text()); });
  await page.route(/^https?:\/\/(?!localhost)/, r => r.abort());
  const html=fs.readFileSync(opts.file||APP,'utf8');
  await page.route('http://localhost/app.html', r => r.fulfill({contentType:'text/html; charset=utf-8', body:'<!doctype html><html><head></head><body>'+html+'</body></html>'}));
  await page.addInitScript(({store,ls,noClaude,sampleMode})=>{
    window.__TEST__=true;
    if(ls) for(const k in ls) localStorage.setItem(k,ls[k]);
    if(noClaude) return;
    // armazenamento compartilhado via localStorage de teste (simula a nuvem)
    const DB=window.__DB=(()=>{ try{ return JSON.parse(sessionStorage.getItem('__db')||'null')||store||{}; }catch(e){ return store||{}; } })();
    const save=()=>sessionStorage.setItem('__db',JSON.stringify(DB));
    const subs={};
    function docRef(path){ return {path, get:async()=>({exists:path in DB,data:()=>DB[path]?JSON.parse(JSON.stringify(DB[path])):undefined,metadata:{hasPendingWrites:false,fromCache:false}}),
      set:async(d)=>{ DB[path]=JSON.parse(JSON.stringify(d)); window.__writes=(window.__writes||0)+1; save(); (subs[path]||[]).forEach(f=>setTimeout(()=>f({exists:true,data:()=>JSON.parse(JSON.stringify(DB[path])),metadata:{hasPendingWrites:false}}),5)); },
      delete:async()=>{ delete DB[path]; save(); },
      acquire:async()=>({acquired:true}),
      onSnapshot:(f)=>{ (subs[path]=subs[path]||[]).push(f); setTimeout(()=>f({exists:path in DB,data:()=>DB[path]&&JSON.parse(JSON.stringify(DB[path])),metadata:{hasPendingWrites:false}}),10); return ()=>{}; },
      collection:(c)=>({doc:(id)=>docRef(path+'/'+c+'/'+id)}) }; }
    const db={doc:docRef};
    const user={id:async()=>'u1'};
    const Q=(n)=>({questoes:Array.from({length:n},(_,i)=>({enunciado:'Questão simulada '+(i+1)+' sobre o tópico?',alternativas:['Alfa','Beta','Gama','Delta','Épsilon'],correta:i%5,explicacao:'Porque sim, explicação '+(i+1)+'.'}))});
    async function sample(input,opts){ const t=typeof input==='string'?input:input.map(m=>m.content).join('\n'); const txt=/aula do zero/i.test(t)?'**O que é** Uma aula simulada.\n- ponto 1\n- ponto 2':'Resposta simulada do Instrutor. **Negrito** e exemplo.'; if(opts&&opts.onText) setTimeout(()=>opts.onText({text:txt,delta:txt}),30); await new Promise(r=>setTimeout(r,80)); return {text:txt,truncated:false}; }
    sample.json=async(input,opts)=>{ const t=String(input); await new Promise(r=>setTimeout(r,120)); if(opts&&opts.onText) opts.onText({text:'"enunciado" "enunciado"',delta:''}); if(/redação|redações/i.test(t)&&/notas/.test(t)) return {notas:[4,3.5,4,3],comentarios:['a','b','c','d'],correcoes:['x → y'],prioridade:'Mais repertório',reescrita:'Parágrafo melhor.'}; if(/flashcards/.test(t)) return {cards:[{frente:'F1',verso:'V1'},{frente:'F2',verso:'V2'}]}; const m=t.match(/Crie (\d+) questões/); return Q(m?Math.min(+m[1],5):5); };
    sample.limits=async()=>({maxPromptBytes:65536,images:{maxCount:1,maxInputBytes:1e7,mediaTypes:['image/png']}});
    const downloads={save:async()=>({status:'saved'})};
    window.claude={use:async(n)=>{ await new Promise(r=>setTimeout(r,20)); if(sampleMode==='off'&&n==='sample') return null; return {db,user,sample,downloads}[n]||null; }};
  },{store:opts.store||null,ls:opts.ls||null,noClaude:!!opts.noClaude,sampleMode:opts.sampleMode||'on'});
  await page.goto('http://localhost/app.html');
  await page.waitForTimeout(opts.wait||900);
  return {browser,page,errors};
}
module.exports={launch,OUT};
