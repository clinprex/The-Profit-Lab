/* The Profit Lab — V2 behaviour. Content lives in assets/data.js */
(function(){
"use strict";

const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- Progress (stored only in this browser) ---------- */
const KEY="tpl-progress-v1";
let done={};
try{done=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){done={}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}};
const lid=(ci,li)=>ci+"-"+li;
const courseDone=ci=>COURSES[ci].lessons.filter((_,li)=>done[lid(ci,li)]).length;
const totalLessons=COURSES.reduce((n,c)=>n+c.lessons.length,0);

/* ---------- Nav ---------- */
const nav=$(".nav"),menu=$(".menu"),links=$("#site-nav");
menu.addEventListener("click",()=>{
  const open=links.classList.toggle("mobile-open");
  menu.setAttribute("aria-expanded",open);
});
links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  links.classList.remove("mobile-open");menu.setAttribute("aria-expanded","false");
}));
const onScroll=()=>nav.classList.toggle("scrolled",window.scrollY>10);
window.addEventListener("scroll",onScroll,{passive:true});onScroll();
$("#year").textContent=new Date().getFullYear();

/* ---------- Hero stats ---------- */
const videoCount=COURSES.reduce((n,c)=>n+c.lessons.filter(l=>l.youtube).length,0);
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
  // POI zone (demand where the rally started)
  g+=`<rect class="poi fade" style="animation-delay:1.6s" x="${x(7)-bw}" y="${y(58)}" width="${x(21)-x(7)+bw}" height="${y(52)-y(58)}" rx="3"/>`;
  g+=`<text class="t-poi fade" style="animation-delay:1.7s" x="${x(21)-30}" y="${y(52)+12}">POI</text>`;
  // Sell-side liquidity under equal lows
  g+=`<line class="liq fade" style="animation-delay:1.2s" x1="${x(3)}" x2="${x(9)}" y1="${y(37.5)}" y2="${y(37.5)}"/>`;
  g+=`<text class="t-liq fade" style="animation-delay:1.3s" x="${x(3)}" y="${y(37.5)-6}">SSL</text>`;
  // Break of structure above prior high
  g+=`<line class="bos fade" style="animation-delay:1.4s" x1="${x(0)}" x2="${x(13)}" y1="${y(63)}" y2="${y(63)}"/>`;
  g+=`<text class="t-bos fade" style="animation-delay:1.5s" x="${x(5)}" y="${y(63)-6}">BOS</text>`;
  C.forEach(([o,h,l,c],i)=>{
    const up=c>=o,cls=up?"c-up":"c-dn",top=y(Math.max(o,c)),bh=Math.max(1.5,Math.abs(y(o)-y(c)));
    g+=`<g class="candle ${cls}" style="animation-delay:${i*45}ms"><line class="wick" x1="${x(i)}" x2="${x(i)}" y1="${y(h)}" y2="${y(l)}"/><rect x="${x(i)-bw/2}" y="${top}" width="${bw}" height="${bh}" rx="1"/></g>`;
  });
  svg.innerHTML=g;
})();

/* ---------- Courses ---------- */
const grid=$("#course-grid");
function levelClass(tag){
  const t=String(tag).toLowerCase();
  if(t.includes("found")||t.includes("essential"))return "lv-foundation";
  if(t.includes("adv"))return "lv-advanced";
  return "";
}
function renderCourses(){
  const shown=grid.dataset.ready?" in":"";grid.dataset.ready=1;
  grid.innerHTML=COURSES.map((c,i)=>{
    const n=courseDone(i),t=c.lessons.length,pct=t?Math.round(n/t*100):0;
    return `<li class="course reveal${shown}${n===t&&t?" done":""}" tabindex="0" role="button" data-course="${i}" aria-label="Open course ${esc(c.number)}: ${esc(c.title)}">
      <div class="course-top"><span class="course-num">${esc(c.number)}</span><span class="tag ${levelClass(c.tag)}">${esc(c.tag)}</span></div>
      <h3>${esc(c.title)}</h3><p>${esc(c.description)}</p>
      <div class="course-foot"><span>${n}/${t} lessons</span><span class="mini"><i style="width:${pct}%"></i></span><span class="go">${n?"Continue":"Start"} →</span></div>
    </li>`;
  }).join("");
  const pct=totalLessons?Math.round(Object.keys(done).filter(k=>done[k]).length/totalLessons*100):0;
  $("#overall-pct").textContent=pct+"%";
  $("#overall-bar").style.width=pct+"%";
  observeReveal();
}
grid.addEventListener("click",e=>{const c=e.target.closest("[data-course]");if(c)openCourse(+c.dataset.course)});
grid.addEventListener("keydown",e=>{
  const c=e.target.closest("[data-course]");
  if(c&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openCourse(+c.dataset.course)}
});
grid.addEventListener("pointermove",e=>{
  const c=e.target.closest(".course");if(!c)return;
  const r=c.getBoundingClientRect();
  c.style.setProperty("--mx",(e.clientX-r.left)+"px");c.style.setProperty("--my",(e.clientY-r.top)+"px");
});

/* ---------- Course player ---------- */
const modal=$("#lesson-modal"),content=$("#modal-content");
let cur={ci:0,li:0},lastFocus=null;

function toEmbed(url){
  try{
    const u=new URL(url);
    if(u.hostname.includes("youtu.be"))return "https://www.youtube-nocookie.com/embed/"+u.pathname.slice(1);
    if(u.hostname.includes("youtube.com")){
      if(u.pathname.startsWith("/embed/"))return url;
      if(u.pathname.startsWith("/shorts/"))return "https://www.youtube-nocookie.com/embed/"+u.pathname.split("/")[2];
      return "https://www.youtube-nocookie.com/embed/"+(u.searchParams.get("v")||"");
    }
  }catch(e){}
  return url;
}
function firstUnfinished(ci){
  const i=COURSES[ci].lessons.findIndex((_,li)=>!done[lid(ci,li)]);
  return i<0?0:i;
}
function openCourse(ci){
  lastFocus=document.activeElement;
  renderPlayer(ci,firstUnfinished(ci));
  modal.classList.add("show");modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  $(".modal-close").focus();
}
function renderPlayer(ci,li){
  cur={ci,li};
  const c=COURSES[ci],l=c.lessons[li],isDone=!!done[lid(ci,li)],last=li>=c.lessons.length-1;
  const video=l.youtube
    ?`<iframe src="${esc(toEmbed(l.youtube))}" title="${esc(l.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    :`<div class="soon-box"><b>VIDEO COMING SOON</b>This lesson is being recorded. Follow the Telegram channel to get notified.</div>`;
  content.innerHTML=`<div class="player">
    <div>
      <div class="eyebrow">Course ${esc(c.number)} · Lesson ${li+1} of ${c.lessons.length}</div>
      <h2 id="modal-title">${esc(l.title)}</h2>
      <p class="desc">${esc(l.notes||c.description)}</p>
      <div class="video">${video}</div>
      <div class="player-actions">
        <button class="mark${isDone?" on":""}" data-act="toggle">${isDone?"✓ Completed":"Mark as complete"}</button>
        <button class="next" data-act="next" ${last?"disabled":""}>Next lesson →</button>
      </div>
    </div>
    <aside class="side">
      <h4>${esc(c.tag)}</h4>
      <div class="side-title">${esc(c.title)}</div>
      <div class="progress"><i style="width:${Math.round(courseDone(ci)/c.lessons.length*100)}%"></i></div>
      <ol class="lesson-list">${c.lessons.map((x,i)=>`<li><button class="lesson${i===li?" active":""}${done[lid(ci,i)]?" done":""}" data-lesson="${i}"><span class="chk">✓</span><span class="ln">${esc(x.title)}</span><span class="vid">${x.youtube?"VIDEO":"SOON"}</span></button></li>`).join("")}</ol>
    </aside>
  </div>`;
}
content.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  const {ci,li}=cur;
  if(b.dataset.lesson!==undefined)return renderPlayer(ci,+b.dataset.lesson);
  if(b.dataset.act==="toggle"){
    const k=lid(ci,li);done[k]=!done[k];if(!done[k])delete done[k];save();renderPlayer(ci,li);renderCourses();
  }
  if(b.dataset.act==="next"&&li<COURSES[ci].lessons.length-1){
    done[lid(ci,li)]=true;save();renderPlayer(ci,li+1);renderCourses();
  }
});
function closeModal(){
  if(!modal.classList.contains("show"))return;
  modal.classList.remove("show");modal.setAttribute("aria-hidden","true");
  content.innerHTML="";document.body.style.overflow="";
  if(lastFocus)lastFocus.focus();
}
$(".modal-close").addEventListener("click",closeModal);
$(".modal-backdrop").addEventListener("click",closeModal);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

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

/* ---------- Reveal on scroll ---------- */
const io="IntersectionObserver" in window?new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}
}),{threshold:.12}):null;
function observeReveal(){
  document.querySelectorAll(".reveal:not(.in)").forEach((el,i)=>{
    if(io){el.style.transitionDelay=(i%3)*70+"ms";io.observe(el)}else el.classList.add("in");
  });
}

renderCourses();renderLibrary();
})();
