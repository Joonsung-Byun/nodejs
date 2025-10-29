const recommendation = document.querySelector("#recommendation");
recommendation.classList.add("nav-active")

const form = document.querySelector("#recommendForm");
const btn = document.querySelector("#submitBtn");
const answer = document.querySelector("#answer");
const defaultSidebar = document.querySelector("#default-sidebar");
const sideBtn = document.querySelector(".historyBtn");

const deleteBtn = document.querySelector("#deleteBtn");

if(deleteBtn) {
  deleteBtn.addEventListener("click", (e) => {
    modal.classList.add("hidden");
  }
  );
}

if(sideBtn) {
  sideBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sideBtn.classList.toggle('rotate');
    if(defaultSidebar.classList.contains("-translate-x-full")) {
    defaultSidebar.classList.remove("-translate-x-full");
    } else {
      defaultSidebar.classList.add("-translate-x-full");
    }
  });
}


document.querySelector(".homeWrapper").addEventListener("click", (e) => {
  if(sideBtn && defaultSidebar) {
    if(sideBtn.classList.contains('rotate')) {
      sideBtn.classList.remove('rotate');
    }
  
    if(!defaultSidebar.classList.contains("-translate-x-full")) {
      defaultSidebar.classList.add("-translate-x-full");
    }
  }

});

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
    // Show loading spinner
    answer.innerHTML = `
      <div class="flex items-center justify-center h-24">
 <svg class="animate-spin rounded-full h-12 w-12 border-4" fill="000000" width="800px" height="800px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M41.9 23.9c-.3-6.1-4-11.8-9.5-14.4-6-2.7-13.3-1.6-18.3 2.6-4.8 4-7 10.5-5.6 16.6 1.3 6 6 10.9 11.9 12.5 7.1 2 13.6-1.4 17.6-7.2-3.6 4.8-9.1 8-15.2 6.9-6.1-1.1-11.1-5.7-12.5-11.7-1.5-6.4 1.5-13.1 7.2-16.4 5.9-3.4 14.2-2.1 18.1 3.7 1 1.4 1.7 3.1 2 4.8.3 1.4.2 2.9.4 4.3.2 1.3 1.3 3 2.8 2.1 1.3-.8 1.2-2.5 1.1-3.8 0-.4.1.7 0 0z"/></svg> </div>
      </div>
    `;

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
        // Show result
        answer.innerHTML = `<div class="p-4">${res.data.message}</div>`;
    }).catch((err) => {
      console.error(err);
    });
  }
} catch {
  alert("Failed to get recommendations from the server. Please try again later.");
}

});
