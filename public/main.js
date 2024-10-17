const list = document.querySelector("#list");
const write = document.querySelector("#write");

if (location.href.includes("list")) {
  const lists = document.querySelectorAll("#topNav li a");

  lists.forEach((singleList) => {
    singleList.classList.remove("text-blue-700");
  });

  list.style.color = "blue";
}

if (location.href.includes("write")) {
  const lists = document.querySelectorAll("#topNav li a");

  lists.forEach((singleList) => {
    singleList.classList.remove("text-blue-700");
  });

  write.style.color = "blue";
}


const signOutBtn = document.querySelector("#signOutBtn");

signOutBtn.addEventListener("click", () => {
  // 쿠키에 저장된 토큰 삭제. 쿠키의 Name은 jwt라고 저장되어있음
  fetch("/signout", {
    method: "DELETE",
  })
    .then((res) => {
      if (res.status === 200) {
        location.href = "/";
        console.log("Sign out success");
      }
    })
    .catch((err) => {
      console.log(err);
    });
})

