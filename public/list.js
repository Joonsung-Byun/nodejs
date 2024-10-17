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


