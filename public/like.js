let text = document.getElementById('content').innerHTML;
text = text.replace(/\n(?!\n)/g, '  \n');
text = text.replace(/\n\n/g, '\n\n');
document.getElementById('content').innerHTML = marked.parse(text);

const likeBtn = document.querySelector("#likeBtn");
likeBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const postId = likeBtn.dataset.postid.substr(8)

    const response = await fetch(`/like`, {
        method: "POST",
        body: JSON.stringify({ postId }),
        headers: {
            "Content-Type": "application/json"
        }
    });
    if(response.ok){
        const result = await response.json();
        likeBtn.innerHTML = `Likes: ${result.likes}`;
    }
});