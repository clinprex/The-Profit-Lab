/* The Profit Lab — Courses page.
   Links:  courses.html                   → all courses
           courses.html#course-2          → course 2 (opens the first unfinished lesson)
           courses.html#course-2/lesson-3 → a specific lesson (shareable)            */
(function(){
"use strict";
const {$,esc,isDone,setDone,courseDone,totalLessons,overallPct,firstUnfinished,levelClass,toEmbed,observeReveal}=TPL;

const LAST="tpl-last-lesson";
const getLast=()=>{try{return JSON.parse(localStorage.getItem(LAST))}catch(e){return null}};
const setLast=(ci,li)=>{try{localStorage.setItem(LAST,JSON.stringify([ci,li]))}catch(e){}};
const href=(ci,li)=>`#course-${ci+1}`+(li==null?"":`/lesson-${li+1}`);
const pct=ci=>{const t=COURSES[ci].lessons.length;return t?Math.round(courseDone(ci)/t*100):0};

/* ===================== CATALOG ===================== */
const list=$("#course-list"),chips=$("#tag-filter"),q=$("#q");
let tag="ALL";

const videos=COURSES.reduce((n,c)=>n+c.lessons.filter(l=>l.youtube).length,0);
$("#cat-meta").innerHTML=
  `<div><b>${COURSES.length}</b><span>Courses</span></div>`+
  `<div><b>${totalLessons}</b><span>Lessons</span></div>`+
  `<div><b>${videos}</b><span>Videos live</span></div>`+
  `<div><b>$0</b><span>Forever</span></div>`;

const tags=["ALL",...new Set(COURSES.map(c=>String(c.tag).toUpperCase()))];
chips.innerHTML=tags.map(t=>`<button class="chip" role="tab" data-tag="${esc(t)}" aria-selected="${t==="ALL"}">${t==="ALL"?"All courses":esc(t.charAt(0)+t.slice(1).toLowerCase())}</button>`).join("");
chips.addEventListener("click",e=>{
  const b=e.target.closest("[data-tag]");if(!b)return;
  tag=b.dataset.tag;
  chips.querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-selected",c===b));
  renderCatalog();
});
q.addEventListener("input",renderCatalog);

function mark(text,term){
  const s=esc(text);if(!term)return s;
  const i=s.toLowerCase().indexOf(esc(term).toLowerCase());
  return i<0?s:s.slice(0,i)+"<mark>"+s.slice(i,i+esc(term).length)+"</mark>"+s.slice(i+esc(term).length);
}

function renderCatalog(){
  const term=q.value.trim().toLowerCase();
  let shown=0;
  list.innerHTML=COURSES.map((c,ci)=>{
    if(tag!=="ALL"&&String(c.tag).toUpperCase()!==tag)return "";
    const courseHit=!term||(c.title+" "+c.description+" "+c.tag).toLowerCase().includes(term);
    const lessons=c.lessons.map((l,li)=>({l,li})).filter(({l})=>courseHit||(l.title+" "+(l.notes||"")).toLowerCase().includes(term));
    if(!lessons.length)return "";
    shown++;
    const n=courseDone(ci),t=c.lessons.length,started=n>0,finished=n===t&&t>0;
    return `<li class="crow reveal${finished?" done":""}" id="c-${ci+1}">
      <div class="crow-info">
        <div class="course-top"><span class="course-num">${esc(c.number)}</span><span class="tag ${levelClass(c.tag)}">${esc(c.tag)}</span></div>
        <h2>${mark(c.title,term)}</h2>
        <p>${esc(c.description)}</p>
        <div class="crow-progress"><div class="progress"><i style="width:${pct(ci)}%"></i></div><span>${n}/${t}</span></div>
        <a class="btn ${finished?"ghost":"primary"} sm" href="${href(ci,firstUnfinished(ci))}">${finished?"Review course":started?"Continue →":"Start course →"}</a>
      </div>
      <ol class="crow-lessons">${lessons.map(({l,li})=>`<li><a class="lrow${isDone(ci,li)?" done":""}" href="${href(ci,li)}">
        <span class="chk" aria-label="${isDone(ci,li)?"Completed":"Not completed"}">✓</span>
        <span class="ln">${mark(l.title,term)}</span>
        <span class="vid${l.youtube?" on":""}">${l.youtube?"▶ VIDEO":"SOON"}</span></a></li>`).join("")}
      </ol>
    </li>`;
  }).join("");
  $("#empty").hidden=shown>0;
  const p=overallPct();
  $("#overall-pct").textContent=p+"%";
  $("#overall-bar").style.width=p+"%";

  const last=getLast(),r=$("#resume");
  if(last&&COURSES[last[0]]&&COURSES[last[0]].lessons[last[1]]){
    const [ci,li]=last;
    r.href=href(ci,li);r.hidden=false;
    r.innerHTML=`<small>Continue where you left off</small><b>${esc(COURSES[ci].lessons[li].title)}</b><span>${esc(COURSES[ci].title)} · Lesson ${li+1} of ${COURSES[ci].lessons.length} →</span>`;
  }else r.hidden=true;
  observeReveal();
}

/* ===================== LESSON ===================== */
const player=$("#player"),crumbs=$("#crumbs");
let cur=null;

function renderLesson(ci,li){
  cur={ci,li};setLast(ci,li);
  const c=COURSES[ci],l=c.lessons[li],done=isDone(ci,li);
  const prev=li>0?href(ci,li-1):ci>0?href(ci-1,COURSES[ci-1].lessons.length-1):null;
  const lastInCourse=li>=c.lessons.length-1,nextCourse=COURSES[ci+1];
  const next=!lastInCourse?{h:href(ci,li+1),t:"Next lesson →"}:nextCourse?{h:href(ci+1,0),t:`Next course: ${nextCourse.title} →`}:{h:"courses.html",t:"Back to all courses"};
  document.title=`${l.title} — ${c.title} — The Profit Lab`;

  crumbs.innerHTML=`<a href="courses.html">All courses</a><span>/</span><a href="#c-${ci+1}">${esc(c.title)}</a><span>/</span><b>Lesson ${li+1}</b>`;
  const video=l.youtube
    ?`<iframe src="${esc(toEmbed(l.youtube))}" title="${esc(l.title)}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    :`<div class="soon-box"><b>VIDEO COMING SOON</b>This lesson is being recorded. <a href="https://t.me/lawprofitlab" target="_blank" rel="noopener">Follow on Telegram</a> to get notified.</div>`;

  player.innerHTML=`
    <div>
      <div class="video">${video}</div>
      <div class="eyebrow" style="margin-top:24px">Course ${esc(c.number)} · Lesson ${li+1} of ${c.lessons.length}</div>
      <h1 class="lesson-title">${esc(l.title)}</h1>
      ${l.notes?`<div class="notes">${esc(l.notes)}</div>`:`<p class="desc">${esc(c.description)}</p>`}
      <div class="player-actions">
        <button class="mark${done?" on":""}" data-act="toggle">${done?"✓ Completed":"Mark as complete"}</button>
        <div class="pn">
          ${prev?`<a class="mark" href="${prev}">← Previous</a>`:""}
          <a class="next" href="${next.h}" data-act="next">${esc(next.t)}</a>
        </div>
      </div>
    </div>
    <aside class="side">
      <h4>${esc(c.tag)} · Course ${esc(c.number)}</h4>
      <div class="side-title">${esc(c.title)}</div>
      <div class="crow-progress"><div class="progress"><i style="width:${pct(ci)}%"></i></div><span>${courseDone(ci)}/${c.lessons.length}</span></div>
      <ol class="lesson-list">${c.lessons.map((x,i)=>`<li><a class="lesson${i===li?" active":""}${isDone(ci,i)?" done":""}" href="${href(ci,i)}"${i===li?' aria-current="true"':""}><span class="chk">✓</span><span class="ln">${esc(x.title)}</span><span class="vid">${x.youtube?"VIDEO":"SOON"}</span></a></li>`).join("")}</ol>
      ${nextCourse?`<a class="up-next" href="${href(ci+1,firstUnfinished(ci+1))}"><small>Up next</small><b>${esc(nextCourse.number)} · ${esc(nextCourse.title)}</b></a>`:""}
    </aside>`;
}

player.addEventListener("click",e=>{
  if(!cur)return;
  const a=e.target.closest("[data-act]");if(!a)return;
  if(a.dataset.act==="toggle"){setDone(cur.ci,cur.li,!isDone(cur.ci,cur.li));renderLesson(cur.ci,cur.li)}
  if(a.dataset.act==="next")setDone(cur.ci,cur.li,true); // finishing a lesson by moving on counts as complete
});

/* ===================== ROUTER ===================== */
function route(){
  const m=location.hash.match(/^#course-(\d+)(?:\/lesson-(\d+))?$/);
  const ci=m?+m[1]-1:-1;
  if(m&&COURSES[ci]){
    let li=m[2]?+m[2]-1:firstUnfinished(ci);
    if(!COURSES[ci].lessons[li])li=0;
    $("#catalog").hidden=true;$("#lesson-view").hidden=false;
    renderLesson(ci,li);
    window.scrollTo(0,0);
  }else{
    cur=null;document.title="Courses — The Profit Lab";
    $("#lesson-view").hidden=true;$("#catalog").hidden=false;
    renderCatalog();
    const target=/^#c-\d+$/.test(location.hash)?$(location.hash):null;
    if(target){target.classList.add("in");target.scrollIntoView({block:"start"})}else window.scrollTo(0,0);
  }
}
window.addEventListener("hashchange",()=>route());
route();
})();
