const page_btns = document.querySelectorAll(".page_btn");

for (let i = 0; i < page_btns.length; i++) {
  if (window.location.pathname === `/list/${i + 1}`) {
    page_btns[i].style.color = "blue";
    page_btns[i].style.fontWeight = "bold";
    page_btns[i].classList.remove("bg-white");
    page_btns[i].parentElement.style.backgroundColor = "LightSteelBlue";
  }
}

const previousBtn = document.querySelector("#previousBtn");
if (window.location.pathname === "/list/1") {
  previousBtn.children[0].style.pointerEvents = "none";
}

const nextBtn = document.querySelector("#nextBtn");
if (
  window.location.pathname === `/list/${page_btns.length}` ||
  page_btns.length === 0
) {
  nextBtn.children[0].style.pointerEvents = "none";
}

const previewContent = document.querySelectorAll(".data-content");

const shortenWords = (str, length = 35) => {
  let result = "";
  if (str.length > length) {
    result = str.substr(0, length - 2) + "...";
  } else {
    result = str;
  }
  return result;
};
previewContent.forEach((spanElement) => {
  const textNodes = [];

  spanElement.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "IMG") {
      textNodes.push(node.textContent.trim());
    }
  });

  const truncatedContent = textNodes.join(",").replace(/,/g, "");

  spanElement.innerHTML = shortenWords(truncatedContent, 30);
});


// function paginationPosition() {

//   const lastPost = posts[posts.length - 1];
//   const lastPostBottom = lastPost.getBoundingClientRect().bottom;
//   const windowHeight = window.innerHeight;
//   if (lastPostBottom > windowHeight) { // 마지막 포스트의 아래쪽 위치가 브라우저 높이보다 크면 페이지네이션을 스크롤에 따라 이동
//     console.log(1)
//     pagination.classList.remove("left-[50%]");
//     pagination.classList.remove("transform");
//     pagination.classList.remove("-translate-x-1/2");

//     pagination.classList.remove('fixed');
//     pagination.classList.add("static");

//   } else {
//     // 그렇지 않으면 페이지네이션을 고정
//     console.log(2)
//     pagination.classList.remove('static');
//     pagination.classList.add("fixed");
//     pagination.classList.add("left-[50%]");
//     pagination.classList.add("transform");
//     pagination.classList.add("-translate-x-1/2");


//   }
// }
//     // 페이지 로드 시 호출
//     if(posts.length > 0) {
//       window.onload = paginationPosition;
//     }
    
//     // window.onresize = paginationPosition;

//     // 브라우저 크기가 변경될 때 호출
//     document.addEventListener('DOMContentLoaded', (event) => {
//       window.onresize = () => {
//         paginationPosition();
//       };
//     });