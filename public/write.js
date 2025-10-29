// import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
const h1Btn = document.querySelector("#h1Btn");
const h2Btn = document.querySelector("#h2Btn");
const h3Btn = document.querySelector("#h3Btn");
const boldBtn = document.querySelector("#boldBtn");
const textArea = document.querySelector("#content");
const imageInput = document.querySelector("#file-input");
const preview = document.querySelector("#preview");
const publishBtn = document.querySelector("#publishBtn");
const title = document.querySelector('input[name="title"]');

let thumbnailUrl = "";
let count = 0


imageInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) {
    console.error("No file selected");
    return;
  }

  if (file) {
    const formData = new FormData();
    formData.append("file", file);

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
      }).catch((err) => {
        console.error(err);
      })
  }
});


// Markdown 이미지 삽입 함수
function insertImageMarkdown(url) {
  const cursorPosition = textArea.selectionStart;
  const textBeforeCursor = textArea.value.substring(0, cursorPosition);
  const textAfterCursor = textArea.value.substring(cursorPosition);

  // Markdown 형식으로 이미지 URL 삽입
  const markdownImage = `![image description](${url})`;
  if(textBeforeCursor === "") {
    textArea.value = textBeforeCursor + markdownImage + textAfterCursor + "\n"
  } else {
    textArea.value = textBeforeCursor + "\n" + markdownImage + textAfterCursor + "\n"
  }
  // 커서를 삽입한 텍스트 끝으로 이동
  textArea.selectionStart = textArea.selectionEnd =
  cursorPosition + markdownImage.length + 1
  textArea.focus();


  if(count === 0) {
    thumbnailUrl = url;
    count++;
  } else {
    return;
  }
  textArea.dispatchEvent(new Event('input'));
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


textArea.addEventListener('input', function() {
  let markdownText = textArea.value;

  // Enter 한 번만 눌러도 줄바꿈이 되도록 처리
  markdownText = markdownText.replace(/\n(?!\n)/g, '  \n'); // 마크다운에서 줄바꿈은 두 개의 공백과 \n이 필요

  // Enter 두 번 누르면 문단을 변경
  markdownText = markdownText.replace(/\n\n/g, '\n\n'); // 두 번의 줄바꿈은 그대로 유지

  // Marked.js를 사용하여 마크다운을 HTML로 변환
  const htmlContent = marked.marked(markdownText);

  // 변환된 HTML을 preview에 반영
  preview.innerHTML = htmlContent;
});


if(location.href.includes("write")) {
  publishBtn.addEventListener("click", async () => {
    if (!title.value || !textArea.value) {
      alert("Title and content are required 😳");
      return;
    } else {
      let tagString = tagArray.join(',');  
      fetch("/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.value,
          content: textArea.value,
          markdownContent: marked.marked(textArea.value),
          tags: tagString,
          thumbnailUrl: thumbnailUrl,
        }),
      })
        .then((res) => {
          alert("Published successfully 🎉");
          window.location.href = "/";
        })
    }
  
  }
  );
}


if(location.href.includes("edit")) {
  function initialPreview(){
    let markdownText = textArea.value;
    markdownText = markdownText.replace(/\n(?!\n)/g, '  \n');
    markdownText = markdownText.replace(/\n\n/g, '\n\n');
    const htmlContent = marked.marked(markdownText);
    preview.innerHTML = htmlContent;
}
initialPreview();

  function getThumbnailUrl() {
    let editThumbnailUrl = document.querySelectorAll("#preview img");
    if(editThumbnailUrl.length > 0) {
      editThumbnailUrl = editThumbnailUrl[0].src;
    } else {
      editThumbnailUrl = null;
    }
    return editThumbnailUrl;
  }

  const editBtn = document.querySelector("#editBtn");


  editBtn.addEventListener("click", async () => {

    if (!title.value || !textArea.value) {
      alert("Title and content are required 😳");
      return;
    } else {
      let tagString = tagArray.join(','); 
      fetch("/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editBtn.dataset.id,
          title: title.value,
          content: textArea.value,
          markdownContent: marked.marked(textArea.value),
          tags: tagString,
          thumbnailUrl: getThumbnailUrl(),
        }),
      })
        .then(async (res) => {
          let result = await res.json();
          return result;
        }).then((data) => {
          alert(data.message);
          window.location.href = "/mypage"
        })
    }
  
  }
  );
}


// console.log(document.querySelector("#editBtn"));