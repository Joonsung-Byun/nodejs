import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const form = document.querySelector("#recommendForm");

const btn = document.querySelector("#submitBtn");
const spinner = document.querySelector("#spinner");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const days = document.querySelector("#days").value;
  const location = document.querySelector("#location").value;
  const type = document.querySelector("#type").value;
  const budget = document.querySelector("#budget").value;
try {
  if (days === "" || location === "" || type === "" || budget === "") {
    alert("Please fill in all fields");
  } else {
    // spinner delete:hidden add:flex justify-center pb-2
    //answer add:p-4
    answer.classList.remove("p-4");
    spinner.classList.remove("hidden");
    spinner.classList.add("flex");
    spinner.classList.add("justify-center");
    spinner.classList.add("pb-2");
    document.querySelector("#answer").innerHTML = ""; // clear the answer

    axios({
      method: "post",
      url: "/recommend",
      data: {
        days: days,
        location: location,
        type: type,
        budget: budget,
      },
    }).then((res) => {
        if(res.status !== 200) {
          throw new Error("Failed to get recommendations  from the server");
        }
        console.log(res.data);
        spinner.classList.add("hidden");
        spinner.classList.remove("flex");
        spinner.classList.remove("justify-center");
        spinner.classList.remove("pb-2");

        answer.classList.add("p-4");
        document.querySelector("#answer").innerHTML = marked(res.data.message);
    }).catch((err) => {
      console.error(err);
    });
  }
} catch {
  alert("Failed to get recommendations from the server. Please try again later.");
}

});
