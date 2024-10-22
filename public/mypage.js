const deleteBtns = document.querySelectorAll(".trashcan");
const editBtns = document.querySelectorAll(".edit");
const userImage = document.querySelector("#userImage");
const imageDeleteBtn = document.querySelector("#imageDeleteBtn");
let content = document.querySelectorAll('.data-content')

const spinner = document.querySelector("#spinner");
const navProfileImg = document.querySelector("#navProfileImg");

deleteBtns.forEach(deleteBtn => {
  deleteBtn.addEventListener("click", function () {
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

const imageUploadBtn = document.querySelector("#imageUploadBtn");
const fileInput = document.querySelector("#file-input");

imageUploadBtn.addEventListener("click", function (e){
  e.preventDefault();
  fileInput.click();
})

fileInput.addEventListener("change", function (e){
  console.log(e.target.files[0]);

  const formData = new FormData();
  formData.append("file", e.target.files[0]);
  spinner.classList.remove("hidden");
  axios({
    method: "post",
    url: "/profileImgUpload",
    data: formData,
  })
  .then((res) => {
    console.log(res.data.url);
    navProfileImg.style.filter = "brightness(1)";
    navProfileImg.src = res.data.url;
    userImage.src = res.data.url;
    spinner.classList.add("hidden");
  }).catch((err) => {
    console.error(err);
  })
})


imageDeleteBtn.addEventListener("click", function (e){
  e.preventDefault();
  userImage.src = "/images/profile.svg";
  deleteImage();

})

function deleteImage(){
  axios({
    method: "delete",
    url: "/profileImgDelete",
  })
  .then((res) => {
    navProfileImg.src = "/images/profile.svg";
  }).catch((err) => {
    console.error(err);
  })
}

content.forEach((singleCon) => {
  if(singleCon.textContent.length > 41) {
    singleCon.textContent = singleCon.textContent.substring(0, 40) + '...'
  } else {
    singleCon.textContent = singleCon.textContent.substring(0, 40)
  }

})