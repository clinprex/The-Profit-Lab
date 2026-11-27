/* The Profit Lab — homepage. Content lives in assets/data.js, shared helpers in assets/common.js */
(function(){
"use strict";
const {$,esc,courseDone,totalLessons,overallPct,levelClass,observeReveal}=TPL;

/* ---------- Hero stats ---------- */
$("#hero-meta").innerHTML=
  `<div><b>${COURSES.length}</b><span>Courses</span></div>`+
  `<div><b>${totalLessons}</b><span>Lessons</span></div>`+
  `<div><b>${RESOURCES.length}</b><span>Resources</span></div>`+
  `<div><b>$0</b><span>Forever</span></div>`;

/* ---------- Hero chart: sweep liquidity → BOS → return to POI → expansion ---------- */
(function chart(){
  const svg=$("#hero-chart");if(!svg)return;
  const C=[ // open, high, low, close
    [60,63,55,57],[57,59,50,52],[52,56,48,54],[54,55,46,47],[47,50,42,44],
    [44,47,40,45],[45,46,37,39],[39,41,30,40],[40,52,39,50],[50,58,49,56],
    [56,57,51,53],[53,62,52,61],[61,70,60,68],[68,69,62,63],[63,64,57,59],
    [59,60,55,58],[58,66,57,65],[65,74,64,72],[72,80,71,78],[78,79,74,76],
    [76,86,75,84],[84,90,82,88]
  ];
  const W=420,H=260,pad=14,min=26,max=94;
  const y=v=>pad+(max-v)/(max-min)*(H-pad*2);
  const step=(W-40)/C.length,bw=step*.56;
  const x=i=>20+i*step+step/2;
  let g='<g class="grid">';
  for(let i=1;i<5;i++)g+=`<line x1="0" x2="${W}" y1="${i*H/5}" y2="${i*H/5}"/>`;
  g+="</g>";
  g+=`<rect class="poi fade" style="animation-delay:1.6s" x="${x(7)-bw}" y="${y(58)}" width="${x(21)-x(7)+bw}" height="${y(52)-y(58)}" rx="3"/>`;
  g+=`<text class="t-poi fade" style="animation-delay:1.7s" x="${x(21)-30}" y="${y(52)+12}">POI</text>`;
  g+=`<line class="liq fade" style="animation-delay:1.2s" x1="${x(3)}" x2="${x(9)}" y1="${y(37.5)}" y2="${y(37.5)}"/>`;
  g+=`<text class="t-liq fade" style="animation-delay:1.3s" x="${x(3)}" y="${y(37.5)-6}">SSL</text>`;
  g+=`<line class="bos fade" style="animation-delay:1.4s" x1="${x(0)}" x2="${x(13)}" y1="${y(63)}" y2="${y(63)}"/>`;
  g+=`<text class="t-bos fade" style="animation-delay:1.5s" x="${x(5)}" y="${y(63)-6}">BOS</text>`;
  C.forEach(([o,h,l,c],i)=>{
    const up=c>=o,cls=up?"c-up":"c-dn",top=y(Math.max(o,c)),bh=Math.max(1.5,Math.abs(y(o)-y(c)));
    g+=`<g class="candle ${cls}" style="animation-delay:${i*45}ms"><line class="wick" x1="${x(i)}" x2="${x(i)}" y1="${y(h)}" y2="${y(l)}"/><rect x="${x(i)-bw/2}" y="${top}" width="${bw}" height="${bh}" rx="1"/></g>`;
  });
  svg.innerHTML=g;
})();

/* ---------- Course cards → link to the Courses page ---------- */
const grid=$("#course-grid");
grid.innerHTML=COURSES.map((c,i)=>{
  const n=courseDone(i),t=c.lessons.length,pct=t?Math.round(n/t*100):0;
  return `<li class="reveal"><a class="course${n===t&&t?" done":""}" href="courses.html#course-${i+1}">
    <div class="course-top"><span class="course-num">${esc(c.number)}</span><span class="tag ${levelClass(c.tag)}">${esc(c.tag)}</span></div>
    <h3>${esc(c.title)}</h3><p>${esc(c.description)}</p>
    <div class="course-foot"><span>${n}/${t} lessons</span><span class="mini"><i style="width:${pct}%"></i></span><span class="go">${n?"Continue":"Start"} →</span></div>
  </a></li>`;
}).join("");
const pct=overallPct();
$("#overall-pct").textContent=pct+"%";
$("#overall-bar").style.width=pct+"%";
grid.addEventListener("pointermove",e=>{
  const c=e.target.closest(".course");if(!c)return;
  const r=c.getBoundingClientRect();
  c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px");
});

/* ---------- Library ---------- */
const lib=$("#library-grid"),filter=$("#lib-filter");
const types=["ALL",...new Set(RESOURCES.map(r=>String(r.type).toUpperCase()))];
let activeType="ALL";
filter.innerHTML=types.map(t=>`<button class="chip" role="tab" data-type="${esc(t)}" aria-selected="${t==="ALL"}">${t==="ALL"?"All":esc(t)}</button>`).join("");
filter.addEventListener("click",e=>{
  const b=e.target.closest("[data-type]");if(!b)return;
  activeType=b.dataset.type;
  filter.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-selected",c===b));
  renderLibrary();
});
function renderLibrary(){
  lib.innerHTML=RESOURCES.filter(r=>activeType==="ALL"||String(r.type).toUpperCase()===activeType).map(r=>{
    const t=String(r.type).toUpperCase(),cls=t.toLowerCase();
    const inner=`<div class="file-ico ${esc(cls)}">${esc(t)}</div><div><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p><span class="link">${r.soon?"Coming soon":"Open resource →"}</span></div>`;
    return r.soon
      ?`<div class="resource soon reveal">${inner}</div>`
      :`<a class="resource reveal" href="${esc(r.href)}" target="_blank" rel="noopener">${inner}</a>`;
  }).join("");
  observeReveal();
}

/* ---------- Position size calculator ---------- */
const f=id=>parseFloat($(id).value);
const money=v=>"$"+v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
function calc(){
  const gold=$("#c-inst").value==="gold";
  $("#c-sl-label").textContent=gold?"Stop loss ($ price move, e.g. 3.00)":"Stop loss (pips)";
  const bal=f("#c-bal"),risk=f("#c-risk"),sl=f("#c-sl"),rr=f("#c-rr");
  $("#c-rr-val").textContent="1 : "+rr;
  const note=$("#c-note");
  if(!(bal>0&&risk>0&&sl>0)){
    ["#o-lot","#o-risk","#o-tp"].forEach(s=>$(s).textContent="—");
    note.className="calc-note";note.textContent="Enter values above 0.";return;
  }
  const atRisk=bal*risk/100;
  // Gold: 1 standard lot = 100 oz → $100 per $1 move. Forex USD-quoted: $10 per pip per lot.
  const perLot=gold?sl*100:sl*10;
  const lots=atRisk/perLot;
  $("#o-lot").textContent=lots<0.01?"<0.01":lots.toFixed(2);
  $("#o-risk").textContent="-"+money(atRisk);
  $("#o-tp").textContent="+"+money(atRisk*rr);
  if(risk>2){note.className="calc-note warn";note.textContent="⚠ Risking more than 2% per trade can wipe an account quickly during a losing streak.";}
  else{note.className="calc-note";note.textContent=gold?"Gold: 1.00 lot = 100 oz, so a $1 move = $100 per lot. Check your broker's contract size.":"Standard lot = 100,000 units ≈ $10 per pip for USD-quoted pairs.";}
}
$("#c-inst").addEventListener("change",e=>{$("#c-sl").value=e.target.value==="gold"?"3":"20"});
$("#calc").addEventListener("input",calc);calc();

observeReveal();renderLibrary();
})();
