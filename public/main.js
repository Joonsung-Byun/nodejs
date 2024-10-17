const list = document.querySelector("#list");
const write = document.querySelector("#write");

if (location.href.includes("list")) {
  const lists = document.querySelectorAll("#topNav li a");

  lists.forEach((singleList) => {
    singleList.classList.remove("text-gray-400");
  });

  list.style.color = "white";
}

if (location.href.includes("write")) {
  const lists = document.querySelectorAll("#topNav li a");

  lists.forEach((singleList) => {
    singleList.classList.remove("text-gray-400");
  });

  write.style.color = "white";
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

  // 드롭다운 토글 기능
  document.getElementById('profileDropdownToggle').addEventListener('click', function() {
    console.log('디버깅')
    const dropdownMenu = document.getElementById('profileDropdownMenu');
    dropdownMenu.classList.toggle('show');
  });

  // 클릭 외 영역 클릭 시 드롭다운 닫기
  window.addEventListener('click', function(e) {
    const dropdownToggle = document.getElementById('profileDropdownToggle');
    const dropdownMenu = document.getElementById('profileDropdownMenu');

    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.remove('show');
    }
  });