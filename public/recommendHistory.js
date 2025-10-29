// import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const recommendationContent = document.querySelector("#recommendationContent");


recommendationContent.innerHTML = marked.marked(recommendationContent.innerHTML);

const defaultSidebar = document.querySelector("#default-sidebar");
const sideBtn = document.querySelector(".historyBtn");

sideBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  sideBtn.classList.toggle('rotate');
  if(defaultSidebar.classList.contains("-translate-x-full")) {
  defaultSidebar.classList.remove("-translate-x-full");
  } else {
    defaultSidebar.classList.add("-translate-x-full");
  }
});

document.querySelector(".homeWrapper").addEventListener("click", (e) => {
  if(sideBtn.classList.contains('rotate')) {
    sideBtn.classList.remove('rotate');
  }

  if(!defaultSidebar.classList.contains("-translate-x-full")) {
    defaultSidebar.classList.add("-translate-x-full");
  }
});