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



