/* ==========================================
   MamRaj Nexus Academy
   Authentication JavaScript
==========================================*/

"use strict";

/* ==========================================
   DOM ELEMENTS
==========================================*/

const loginForm = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

/* ==========================================
   SHOW / HIDE PASSWORD
==========================================*/

if(togglePassword){

togglePassword.addEventListener("click",()=>{

const icon = togglePassword.querySelector("i");

if(password.type==="password"){

password.type="text";

icon.classList.remove("fa-eye");

icon.classList.add("fa-eye-slash");

}else{

password.type="password";

icon.classList.remove("fa-eye-slash");

icon.classList.add("fa-eye");

}

});

}

/* ==========================================
   EMAIL VALIDATION
==========================================*/

function validateEmail(emailAddress){

const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

return regex.test(emailAddress);

}

/* ==========================================
   PASSWORD STRENGTH
==========================================*/

function passwordStrength(pass){

let score=0;

if(pass.length>=8) score++;

if(/[A-Z]/.test(pass)) score++;

if(/[a-z]/.test(pass)) score++;

if(/[0-9]/.test(pass)) score++;

if(/[^A-Za-z0-9]/.test(pass)) score++;

return score;

}

if(password){

password.addEventListener("keyup",()=>{

const score=passwordStrength(password.value);

password.style.borderColor="#ddd";

if(score<=2){

password.style.borderColor="#ff4d4d";

}

else if(score===3){

password.style.borderColor="#ff9800";

}

else{

password.style.borderColor="#4CAF50";

}

});

}

/* ==========================================
   LOGIN VALIDATION
==========================================*/

if(loginForm){

loginForm.addEventListener("submit",(e)=>{

e.preventDefault();

const emailValue=email.value.trim();

const passwordValue=password.value.trim();

if(emailValue===""){

alert("Email is required.");

email.focus();

return;

}

if(!validateEmail(emailValue)){

alert("Please enter a valid email.");

email.focus();

return;

}

if(passwordValue.length<8){

alert("Password must be at least 8 characters.");

password.focus();

return;

}

/* Demo Success */

const button=document.querySelector(".login-btn");

button.disabled=true;

button.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';

setTimeout(()=>{

button.innerHTML='<i class="fa-solid fa-circle-check"></i> Login Successful';

button.style.background="#28a745";

setTimeout(()=>{

window.location.href="../dashboard/index.html";

},1000);

},1500);

});

}

/* ==========================================
   SOCIAL LOGIN BUTTONS
==========================================*/

const googleBtn=document.querySelector(".google");

const githubBtn=document.querySelector(".github");

const linkedinBtn=document.querySelector(".linkedin");

if(googleBtn){

googleBtn.addEventListener("click",()=>{

alert("Google Authentication will be connected with Firebase/Auth.js.");

});

}

if(githubBtn){

githubBtn.addEventListener("click",()=>{

alert("GitHub Authentication coming soon.");

});

}

if(linkedinBtn){

linkedinBtn.addEventListener("click",()=>{

alert("LinkedIn Authentication coming soon.");

});

}

/* ==========================================
   ENTER KEY SUPPORT
==========================================*/

document.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

if(loginForm){

loginForm.requestSubmit();

}

}

});

/* ==========================================
   INPUT ANIMATION
==========================================*/

document.querySelectorAll("input").forEach(input=>{

input.addEventListener("focus",()=>{

input.parentElement.classList.add("active");

});

input.addEventListener("blur",()=>{

if(input.value===""){

input.parentElement.classList.remove("active");

}

});

});

/* ==========================================
   LOADING ANIMATION
==========================================*/

window.addEventListener("load",()=>{

document.body.style.opacity="0";

setTimeout(()=>{

document.body.style.transition="opacity .5s";

document.body.style.opacity="1";

},100);

});

/* ==========================================
   CONSOLE MESSAGE
==========================================*/

console.log("%cMamRaj Nexus Academy","font-size:22px;font-weight:bold;color:#1E2A5A;");

console.log("%cAuthentication Module Loaded","font-size:14px;color:#C58B73;");
