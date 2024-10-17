const signupForm = document.querySelector('#signupForm');
const submitBtn = document.querySelector('#submitBtn');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const username = document.querySelector('#username');
const passwordConfirm = document.querySelector('#passwordConfirm');
console.log(email, password, username, passwordConfirm);

submitBtn.addEventListener('click', (e) => {
    if(password.value !== passwordConfirm.value){
        alert('Password and Confirm Password do not match');
        return;
    } else {
        const data = {
            email: email.value,
            password: password.value,
            username: username.value
        }
        axios({
            url: '/signup',
            method: 'POST',
            data: data
        }).then((res) => {
            console.log(res);
            if(res.status === 200){
                alert('Signup Success');
                location.href = '/login';
            } else {
                alert('Signup Failed');
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    

})   