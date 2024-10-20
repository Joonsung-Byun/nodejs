// // h1Btn h2Btn h3Btn boldBtn 
// import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
// const textArea = document.querySelector("#content");
// const imageInput = document.querySelector("#file-input");
// console.log(h1Btn, h2Btn, h3Btn, boldBtn, imageInput)

// function addHash(e) {
//     const num = e.dataset.tag;
//     const cursorPosition = textArea.selectionStart;
//     const textBeforeCursor = textArea.value.substring(0, cursorPosition);
//     const hashTags = "#".repeat(num) + " ";
//     if (textBeforeCursor === "") {
//       textArea.value = hashTags
//     } else {
//       textArea.value = textBeforeCursor + "\n" + hashTags;
//     }
//     textArea.selectionStart = cursorPosition + num + 1  // 커서 시작 위치 설정
//     textArea.selectionEnd = cursorPosition + num + 1 // 커서 끝 위치도 동일하게 설정
//     textArea.focus();
//   }

//   h1Btn.addEventListener("click", (e) => {
//     addHash(e.target);
//   });
  
//   h2Btn.addEventListener("click", (e) => {
//     addHash(e.target);
//   });
  
//   h3Btn.addEventListener("click", (e) => {
//     addHash(e.target);
//   });
  
//   boldBtn.addEventListener("click", () => {
//     const cursorPosition = textArea.selectionStart;
//     const selectionEnd = textArea.selectionEnd;
//     const textBeforeCursor = textArea.value.substring(0, cursorPosition);
//     const selectedText = textArea.value.substring(cursorPosition, selectionEnd);
//     const textAfterCursor = textArea.value.substring(selectionEnd);
  
//     if (selectedText) {
//       // 선택된 텍스트가 있는 경우
//       textArea.value =
//         textBeforeCursor + "**" + selectedText + "**" + textAfterCursor;
//       textArea.selectionStart = cursorPosition;
//       textArea.selectionEnd = selectionEnd + 4; // ** 추가로 인해 길이가 4 증가
//     } else {
//       // 선택된 텍스트가 없는 경우
//       textArea.value = textBeforeCursor + "****" + textAfterCursor;
//       textArea.selectionStart = textArea.selectionEnd = cursorPosition + 2; // 커서를 가운데로 이동
//     }
  
//     textArea.focus();
//   });
  
// //처음 유저가 사이트에 들어왔을때도 프리뷰에는 내용이 들어가 있게하는 함수
// function initialPreview(){
//     let markdownText = textArea.value;
//     markdownText = markdownText.replace(/\n(?!\n)/g, '  \n');
//     markdownText = markdownText.replace(/\n\n/g, '\n\n');
//     const htmlContent = marked(markdownText);
//     preview.innerHTML = htmlContent;
// }
// initialPreview();

// textArea.addEventListener('input', function() {
//     let markdownText = textArea.value;
  
//     // Enter 한 번만 눌러도 줄바꿈이 되도록 처리
//     markdownText = markdownText.replace(/\n(?!\n)/g, '  \n'); // 마크다운에서 줄바꿈은 두 개의 공백과 \n이 필요
  
//     // Enter 두 번 누르면 문단을 변경
//     markdownText = markdownText.replace(/\n\n/g, '\n\n'); // 두 번의 줄바꿈은 그대로 유지
  
//     // Marked.js를 사용하여 마크다운을 HTML로 변환
//     const htmlContent = marked(markdownText);
  
//     // 변환된 HTML을 preview에 반영
//     preview.innerHTML = htmlContent;
//   });
