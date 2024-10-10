// document.addEventListener('DOMContentLoaded', () => {
//   const signOutBtn = document.querySelector('#signOutBtn');
//   console.log(signOutBtn);
//   signOutBtn.addEventListener('click', ()=> {
//     fetch('/signOut', {
//       method: 'POST'
//     }).then(res => {
//       return res.json()
//     }).then(data => {
//       console.log(data)
//       if (data.message === 'success') {
//         console.log('yay')
//         location.href = location.href;
//       }
//     })
//   })
// });