import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
const h1Btn = document.querySelector("#h1Btn");
const h2Btn = document.querySelector("#h2Btn");
const h3Btn = document.querySelector("#h3Btn");
const boldBtn = document.querySelector("#boldBtn");
const textArea = document.querySelector("#content");
const imageInput = document.querySelector("#file-input");
const preview = document.querySelector("#preview");

imageInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);

    console.log(formData);

    fetch("/imgUpload", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        insertImageMarkdown(data.url);
      });
  }
});

// Markdown 이미지 삽입 함수
function insertImageMarkdown(url) {
  const cursorPosition = textArea.selectionStart;
  const textBeforeCursor = textArea.value.substring(0, cursorPosition);
  const textAfterCursor = textArea.value.substring(cursorPosition);

  // Markdown 형식으로 이미지 URL 삽입
  const markdownImage = `![image description](${url})`;
  textArea.value = textBeforeCursor + markdownImage + textAfterCursor;

  // 커서를 삽입한 텍스트 끝으로 이동
  textArea.selectionStart = textArea.selectionEnd =
    cursorPosition + markdownImage.length;
  textArea.focus();
}

function addHash(e) {
  const num = e.dataset.tag;
  const cursorPosition = textArea.selectionStart;
  const textBeforeCursor = textArea.value.substring(0, cursorPosition);
  const hashTags = "#".repeat(num) + " ";
  if (textBeforeCursor === "") {
    textArea.value = hashTags
  } else {
    textArea.value = textBeforeCursor + "\n" + hashTags;
  }
  textArea.selectionStart = cursorPosition + num + 1  // 커서 시작 위치 설정
  textArea.selectionEnd = cursorPosition + num + 1 // 커서 끝 위치도 동일하게 설정
  textArea.focus();
}

h1Btn.addEventListener("click", (e) => {
  addHash(e.target);
});

h2Btn.addEventListener("click", (e) => {
  addHash(e.target);
});

h3Btn.addEventListener("click", (e) => {
  addHash(e.target);
});

boldBtn.addEventListener("click", () => {
  const cursorPosition = textArea.selectionStart;
  const selectionEnd = textArea.selectionEnd;
  const textBeforeCursor = textArea.value.substring(0, cursorPosition);
  const selectedText = textArea.value.substring(cursorPosition, selectionEnd);
  const textAfterCursor = textArea.value.substring(selectionEnd);

  if (selectedText) {
    // 선택된 텍스트가 있는 경우
    textArea.value =
      textBeforeCursor + "**" + selectedText + "**" + textAfterCursor;
    textArea.selectionStart = cursorPosition;
    textArea.selectionEnd = selectionEnd + 4; // ** 추가로 인해 길이가 4 증가
  } else {
    // 선택된 텍스트가 없는 경우
    textArea.value = textBeforeCursor + "****" + textAfterCursor;
    textArea.selectionStart = textArea.selectionEnd = cursorPosition + 2; // 커서를 가운데로 이동
  }

  textArea.focus();
});

const tagInput = document.querySelector("#tagInput");
const taglist = document.querySelector("#taglist");

const tagArray = [];

tagInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    console.log(tagInput.value);

    if (tagArray.includes(tagInput.value)) {
      alert("이미 추가된 태그입니다.");
      tagInput.value = "";
      return;
    } else {
      const tag = document.createElement("span");
      tag.textContent = tagInput.value;
      tagArray.push(tagInput.value);
      console.log(tagArray);
      tag.classList.add("tag");

      taglist.appendChild(tag);
      tagInput.value = "";
    }
  }
});


textArea.addEventListener("input", (e) => {
  console.log(textArea.value)
  preview.innerHTML = marked(textArea.value);
})