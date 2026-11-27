/* The Profit Lab — shared helpers used by every page. */
window.TPL=(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- Progress (stored only in this browser) ---------- */
const KEY="tpl-progress-v2"; // bumped when the course list was replaced
let done={};
try{done=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){done={}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}};
const lid=(ci,li)=>ci+"-"+li;
const isDone=(ci,li)=>!!done[lid(ci,li)];
const setDone=(ci,li,v)=>{if(v)done[lid(ci,li)]=true;else delete done[lid(ci,li)];save()};
const courseDone=ci=>COURSES[ci].lessons.filter((_,li)=>isDone(ci,li)).length;
const totalLessons=COURSES.reduce((n,c)=>n+c.lessons.length,0);
const overallPct=()=>{
  let n=0;COURSES.forEach((c,ci)=>c.lessons.forEach((_,li)=>{if(isDone(ci,li))n++}));
  return totalLessons?Math.round(n/totalLessons*100):0;
};
const firstUnfinished=ci=>{const i=COURSES[ci].lessons.findIndex((_,li)=>!isDone(ci,li));return i<0?0:i};
const levelClass=tag=>{
  const t=String(tag).toLowerCase();
  if(t.includes("begin")||t.includes("found")||t.includes("essential"))return "lv-foundation";
  if(t.includes("expert")||t.includes("pro"))return "lv-expert";
  if(t.includes("adv"))return "lv-advanced";
  return "";
};

/* ---------- Video links → embeddable player ---------- */
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

/* ---------- Nav ---------- */
const nav=$(".nav"),menu=$(".menu"),links=$("#site-nav");
if(menu&&links){
  menu.addEventListener("click",()=>{
    const open=links.classList.toggle("mobile-open");
    menu.setAttribute("aria-expanded",open);
  });
  links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    links.classList.remove("mobile-open");menu.setAttribute("aria-expanded","false");
  }));
}
if(nav){
  const onScroll=()=>nav.classList.toggle("scrolled",window.scrollY>10);
  window.addEventListener("scroll",onScroll,{passive:true});onScroll();
}
const yr=$("#year");if(yr)yr.textContent=new Date().getFullYear();

/* ---------- Reveal on scroll ---------- */
const io="IntersectionObserver" in window?new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}
}),{threshold:.12}):null;
function observeReveal(){
  document.querySelectorAll(".reveal:not(.in)").forEach((el,i)=>{
    if(io){el.style.transitionDelay=(i%3)*70+"ms";io.observe(el)}else el.classList.add("in");
  });
}

return {$,esc,isDone,setDone,courseDone,totalLessons,overallPct,firstUnfinished,levelClass,toEmbed,observeReveal};
})();
