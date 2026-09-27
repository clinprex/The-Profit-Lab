const courseGrid=document.getElementById("course-grid");
const libraryGrid=document.getElementById("library-grid");
const modal=document.getElementById("lesson-modal");
const modalContent=document.getElementById("modal-content");

COURSES.forEach((c,i)=>{
  const el=document.createElement("article");
  el.className="course";
  el.innerHTML=`<div><div class="course-num">${c.number}</div><h3>${c.title}</h3><p>${c.description}</p></div>
  <div class="course-bottom"><span class="course-tag">${c.tag}</span><button class="open" data-course="${i}">Open →</button></div>`;
  courseGrid.appendChild(el);
});
document.querySelectorAll("[data-course]").forEach(b=>b.addEventListener("click",()=>openCourse(+b.dataset.course)));

RESOURCES.forEach(r=>{
  const el=document.createElement("article");el.className="resource";
  el.innerHTML=`<div class="type">${r.type}</div><h3>${r.title}</h3><p>${r.description}</p><a href="${r.href}" target="_blank" rel="noopener">Open resource →</a>`;
  libraryGrid.appendChild(el);
});

function openCourse(index){
  const c=COURSES[index];
  modalContent.innerHTML=`<div class="eyebrow">${c.tag}</div><h2>${c.title}</h2><p>${c.description}</p><div class="lesson-list">${c.lessons.map((l,i)=>`<div class="lesson"><span>${l.title}</span><button onclick="openLesson(${index},${i})">WATCH →</button></div>`).join("")}</div>`;
  modal.classList.add("show");modal.setAttribute("aria-hidden","false");
}
function openLesson(ci,li){
  const l=COURSES[ci].lessons[li];
  const video=l.youtube?`<div class="video"><iframe src="${toEmbed(l.youtube)}" title="${l.title}" allowfullscreen></iframe></div>`:`<div class="video" style="display:grid;place-items:center"><span style="color:#666;font-size:12px">VIDEO COMING SOON — add a YouTube URL in assets/data.js</span></div>`;
  modalContent.innerHTML=`<div class="eyebrow">${COURSES[ci].title}</div><h2>${l.title}</h2>${video}<p>Lesson notes and downloadable resources can be added here.</p><a class="download" href="#library" onclick="closeModal()">Browse resources →</a>`;
}
function toEmbed(url){
  try{
    const u=new URL(url);
    if(u.hostname.includes("youtu.be")) return "https://www.youtube.com/embed/"+u.pathname.slice(1);
    if(u.hostname.includes("youtube.com")) return "https://www.youtube.com/embed/"+(u.searchParams.get("v")||"");
  }catch(e){}
  return url;
}
function closeModal(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}
document.querySelector(".modal-close").addEventListener("click",closeModal);
document.querySelector(".modal-backdrop").addEventListener("click",closeModal);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
