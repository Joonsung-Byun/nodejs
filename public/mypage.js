const deleteBtns = document.querySelectorAll(".trashcan");
const editBtns = document.querySelectorAll(".edit");

deleteBtns.forEach(deleteBtn => {
  deleteBtn.addEventListener("click", function () {
    console.log('연속으로 안되는 이유');
    console.log(this.dataset.deleteid);
    const postId = this.dataset.deleteid.substr(8);
    fetch(`/delete`, {
      method: "delete",
      body: JSON.stringify({ postId }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      console.log(response.status);
      console.log(this);
      if (response.status === 200) {
        const post = document.querySelector('[data-post="' + postId + '"]');
        post.style.opacity = 0;
        post.style.transition = "opacity 1s";
        setTimeout(() => {
          post.style.display = "none";
        }, 1000);
      }
    }).catch((error) => {
      console.error("Error:", error);
    });
  });
});