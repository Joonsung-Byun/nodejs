const deleteBtn = document.querySelector(".trashcan");
const editBtn = document.querySelector(".edit");

deleteBtn.addEventListener("click", function () {
  console.log(this.dataset.deleteid);
  const postId = this.dataset.deleteid.substr(8);
  fetch(`/delete`, {
    method: "POST",
    body: JSON.stringify({ postId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.ok) {
      window.location.href = "/mypage";
    }
  }).catch((error) => {
    console.error("Error:", error);
  });
});
