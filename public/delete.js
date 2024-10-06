const deletebtns = document.querySelectorAll(".delete");

deletebtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log(btn.dataset.delete);
    fetch("/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: btn.dataset.delete,
      }),
    })
      .then((res) => {
        return res.json()
      })
      .then((result) => {
        console.log(result)
        btn.parentElement.parentElement.remove();
      })
      .catch((e) => {
        console.log(e);
      });
  });
});

const page_btns = document.querySelectorAll(".page_btn");

for(let i = 0; i < page_btns.length; i++){
    if(window.location.pathname === `/list/${i+1}`){
        page_btns[i].style.color = "blue";
        page_btns[i].style.fontWeight = "bold";
        page_btns[i].classList.remove("bg-white")
        page_btns[i].parentElement.style.backgroundColor = "LightSteelBlue";

      }
}


const previousBtn = document.querySelector("#previousBtn")
if(window.location.pathname === "/list/1"){
  (previousBtn.children[0]).classList.add("pointer-events-none")
}

const nextBtn = document.querySelector("#nextBtn")
if(window.location.pathname === `/list/${page_btns.length}`){
  (nextBtn.children[0]).classList.add("pointer-events-none")
}