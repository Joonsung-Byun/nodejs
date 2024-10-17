let text = document.getElementById("content").innerHTML;
text = text.replace(/\n(?!\n)/g, "  \n");
text = text.replace(/\n\n/g, "\n\n");
document.getElementById("content").innerHTML = marked.parse(text);

//만약 pre code 태그안에 텍스트가 일반글이 아니라 "![image](url)" 형식이라면 pre code를 제거하고 그 url을 img태그로 변환

const likeBtn = document.querySelector("#likeBtn");
likeBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const postId = likeBtn.dataset.postid.substr(8);
  const response = await fetch(`/like`, {
    method: "POST",
    body: JSON.stringify({ postId }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        if(response.status === 401) {
            alert("Login is needed.");
            location.href = "/login";
            throw new Error("Login is needed.");

        } else if (response.status === 505) {
            alert("Already liked.");
            throw new Error("Already liked.");

        } else if (response.status === 501) {
            alert("Internal Server Error.");
            throw new Error("Internal Server Error.");
        }
      }
      return response.json();
    })
    .then((data) => {
      // 성공적으로 좋아요가 처리된 경우
        console.log('성공')
      likeBtn.textContent = `❤️ ${data.likes}`;
    })
    .catch((error) => {
        console.error("Error:", error);
    });
});
const newStr = document.querySelector('code').innerHTML.trim()
document.querySelector('code').innerHTML = newStr

const code = document.querySelector("code");
if (code) {
  const codeText = code.textContent;
  console.log(codeText);
  if (codeText.startsWith("![image description](https://")) {
    const url = codeText.slice(21, -1);
    const p = document.createElement("p");
    const img = document.createElement("img");
    img.src = url;
    console.log(code.parentElement) //이게 pre태그인데 pre태그 없애고 img태그로 바꾸기
    code.parentElement.replaceWith(p);
    p.appendChild(img);

  }
}
