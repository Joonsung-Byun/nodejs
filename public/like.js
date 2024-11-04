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
  if (codeText.startsWith("![image description](https://")) {
    const url = codeText.slice(21, -1);
    const p = document.createElement("p");
    const img = document.createElement("img");
    img.src = url;
    console.log(code.parentElement) //이게 pre태그인데 pre태그 없애고 img태그로 바꾸기
    code.parentElement.replaceWith(p);
    p.appendChild(img);
  }

  let 텍스트 = code.textContent

  if (텍스트.startsWith("# ")) {
    const h1 = document.createElement("h1")
    h1.textContent = 텍스트.slice(2)
    code.parentElement.replaceWith(h1)
  } else if (텍스트.startsWith("## ")) {
    const h2 = document.createElement("h2")
    h2.textContent = 텍스트.slice(3)
    code.parentElement.replaceWith(h2)
  } else if (텍스트.startsWith("### ")) {
    const h3 = document.createElement("h3")
    h3.textContent = 텍스트.slice(4)
    code.parentElement.replaceWith(h3)
  } else if (텍스트.startsWith("**") && 텍스트.endsWith("**")) {
    const strong = document.createElement("strong")
    strong.textContent = 텍스트.slice(2, -2)
    code.parentElement.replaceWith(strong)
  }
}
