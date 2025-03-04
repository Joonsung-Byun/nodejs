const commentBtn = document.getElementById('commentBtn');
const articleClass = "p-6 mb-3 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900";
const footerClass = "flex justify-between items-center mb-2";
const divClass = "flex items-center";
const p1Class = "inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold";
const imgClass = "mr-2 w-6 h-6 rounded-full";
const p2Class = "text-sm text-gray-600 dark:text-gray-400";
const p3Class = "text-gray-500 dark:text-gray-400";
const noComments = document.getElementById('noComment');
commentBtn.addEventListener('click', async (e) => {
    // console.log('asd')
    axios({
        method: 'post',
        url: '/comment',
        data: {
            postId: commentBtn.dataset.postid,
            content: document.querySelector('#comment').value
        }
      }).then((res) => {
                if(res.status === 200) {
                    console.log(res.data)
                    const article = document.createElement('article');
                    const footer = document.createElement('footer');
                    const div = document.createElement('div');
                    const p1 = document.createElement('p');
                    const img = document.createElement('img');
                    const p2 = document.createElement('p');
                    const p3 = document.createElement('p');
                    const span = document.createElement('span');
                
                    // 태그들에 디자인 적용
                    article.className = articleClass;
                    footer.className = footerClass;
                    div.className = divClass;
                    p1.className = p1Class;
                    img.className = imgClass;
                    p2.className = p2Class;
                    p3.className = p3Class;

                    if(res.data.profileImage === null) {
                        img.src = '/images/profile.svg';
                    } else {
                    img.src = res.data.profileImage;
                    }
                    span.innerText = 'Just now';
                    p3.innerText = document.querySelector('#comment').value;
                
                    // 태그들을 조립 (이미지를 먼저 추가한 뒤 텍스트 추가)
                    p1.appendChild(img); // 이미지가 먼저 나오도록 설정
                    p1.append( res.data.writer ); // 그 다음에 텍스트가 나오도록 설정
                    
                    p2.appendChild(span);
                    div.appendChild(p1);
                    div.appendChild(p2);
                    footer.appendChild(div);
                    article.appendChild(footer);
                    article.appendChild(p3);
                
                    document.querySelector('#commentSection').appendChild(article);
                    document.querySelector('#comment').value = '';
                    

                    if(noComments) {
                        noComments.remove();
                    }
                } 
            }
        ).catch((err) => {
            if(err.status === 401) {
                alert('Login is needed to comment.');
            }
        }
      )
})