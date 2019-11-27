  
const URL = 'http://localhost:5000/cafe/';

$(document).ready(function(){
    if(!sessionStorage.username) window.location.href=`login.html`;
})

$('#Logout').click(()=>{
    sessionStorage.clear();
    window.location.href = `login.html`
})