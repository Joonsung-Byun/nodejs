const btn = document.getElementById('loginBtn');

btn.addEventListener('click', (e) => {
    e.preventDefault()
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(res => {
        if (!res.ok) {
            // 응답 본문을 JSON으로 파싱하여 에러 메시지를 받음
            return res.json().then(data => {
                throw new Error(data.message); // 서버에서 보낸 message를 에러로 던짐
            });
        }
        return res.json();  // 정상 응답일 경우 데이터 처리
    })
    .then(data => {
        if (data.code === 200) {
            window.location.href = '/';
        }
    })
    .catch((e) => {
        alert(e.message);  // 서버에서 보낸 에러 메시지를 사용자에게 알림
    });
});
