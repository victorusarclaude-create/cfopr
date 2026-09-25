// Roda todos os geradores da Arena muitas vezes e valida a estrutura de cada rodada.
const {launch}=require('./harness.js');
(async()=>{
  const {browser,page,errors}=await launch();
  await page.waitForTimeout(600);
  const res=await page.evaluate(()=>{
    const A=window.__app, out={games:A.ARENA.length,rounds:0,bad:[],kinds:{},uniq:{},convFail:0};
    const chk=(g,L,r)=>{ const p=[]; if(!r){ p.push('null'); return p; }
      if(!A.arValid(r)) p.push('invalid');
      const s=JSON.stringify(r); if(/undefined|\bNaN\b|Infinity|\[object/.test(s)) p.push('bad text');
      if(r.k==='num'){ if(r.opts[r.right].indexOf(String(r.ans).replace('.',',').replace('-','−'))<0&&Math.abs(r.ans)<1000&&Number.isInteger(r.ans)) p.push('num answer mismatch '+r.opts[r.right]+' vs '+r.ans); }
      if(r.k==='spot'&&!(r.wrong===-1||(r.wrong>=0&&r.wrong<r.parts.length))) p.push('spot idx');
      if(r.k==='pick'){ const ri=Array.isArray(r.right)?r.right[0]:r.right; if(!(ri>=0&&ri<r.parts.length)) p.push('pick idx'); }
      if(r.k==='sort'&&r.items.some(it=>!(it[1]>=0&&it[1]<r.cats.length))) p.push('sort cat');
      if(r.k==='commas'&&r.sl.length!==r.ch.length-1) p.push('commas len');
      if(r.k==='commas'&&!r.sl.some(x=>x!=='opt')) p.push('commas trivial');
      if(r.k==='balance'&&r.co.length!==r.L.length+r.R.length) p.push('bal len');
      if(r.k==='order'&&new Set(r.items).size!==r.items.length) p.push('order dup');
      if(r.k==='match'&&new Set(r.pairs.map(x=>x[1])).size!==r.pairs.length) p.push('match dup right');
      if(r.k==='match'&&new Set(r.pairs.map(x=>x[0])).size!==r.pairs.length) p.push('match dup left');
      return p; };
    A.ARENA.forEach(g=>{ for(let L=1;L<=5;L++){ const seen=new Set(), keys=new Set(); for(let i=0;i<120;i++){ const r=A.arMake(g,L,seen); out.rounds++; const p=chk(g,L,r); if(r){ out.kinds[r.k]=(out.kinds[r.k]||0)+1; keys.add(r.key); const c=A.arAsChoice(r); if(!c) out.convFail++; }
          if(p.length&&out.bad.length<60) out.bad.push(g.id+' L'+L+': '+p.join(',')+' :: '+(r?(r.q||'').slice(0,90)+' | '+JSON.stringify(r.opts||r.parts||r.items||'').slice(0,120):'')); }
        out.uniq[g.id+' L'+L]=keys.size; } });
    const low=Object.entries(out.uniq).filter(([k,v])=>v<12).map(([k,v])=>k+'='+v);
    out.low=low; delete out.uniq;
    ['port','mat','fis','qui','hist'].forEach(s=>{ for(let i=0;i<30;i++){ const q=A.offlineQuestion(A.SUBJ[s]); if(!q||!q.opts||q.right<0) out.bad.push('offline '+s); } });
    return out; });
  console.log(JSON.stringify(res,null,1));
  console.log('errors:',errors.filter(e=>!/fonts/.test(e)));
  await browser.close();
})();
