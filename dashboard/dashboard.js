/* ==========================================
   MamRaj Nexus Academy
   Dashboard JavaScript
==========================================*/

"use strict";

/* ===============================
   DOM ELEMENTS
=============================== */

const sidebar = document.querySelector(".sidebar");

const menuBtn = document.querySelector(".menu-btn");

const profile = document.querySelector(".profile");

const navItems = document.querySelectorAll(".sidebar nav ul li");

const cards = document.querySelectorAll(".card");

const progressBars = document.querySelectorAll(".progress-bar span");

const taskCheckboxes = document.querySelectorAll(".task-list input");

/* ===============================
   MOBILE SIDEBAR
=============================== */

if(menuBtn){

menuBtn.addEventListener("click",()=>{

sidebar.classList.toggle("active");

});

}

/* ===============================
   ACTIVE SIDEBAR MENU
=============================== */

navItems.forEach(item=>{

item.addEventListener("click",()=>{

navItems.forEach(nav=>nav.classList.remove("active"));

item.classList.add("active");

});

});

/* ===============================
   PROFILE DROPDOWN
=============================== */

const profileMenu=document.createElement("div");

profileMenu.className="profile-menu";

profileMenu.innerHTML=`

<a href="#"><i class="fa-solid fa-user"></i> My Profile</a>

<a href="#"><i class="fa-solid fa-gear"></i> Settings</a>

<a href="#"><i class="fa-solid fa-right-from-bracket"></i> Logout</a>

`;

profile.appendChild(profileMenu);

profile.addEventListener("click",()=>{

profileMenu.classList.toggle("active");

});

document.addEventListener("click",(e)=>{

if(!profile.contains(e.target)){

profileMenu.classList.remove("active");

}

});

/* ===============================
   PROGRESS BAR ANIMATION
=============================== */

window.addEventListener("load",()=>{

progressBars.forEach(bar=>{

const width=bar.style.width;

bar.style.width="0";

setTimeout(()=>{

bar.style.width=width;

},300);

});

});

/* ===============================
   TASK COMPLETION
=============================== */

taskCheckboxes.forEach(task=>{

task.addEventListener("change",()=>{

const item=task.parentElement;

if(task.checked){

item.style.textDecoration="line-through";

item.style.opacity=".6";

}else{

item.style.textDecoration="none";

item.style.opacity="1";

}

});

});

/* ===============================
   CARD HOVER
=============================== */

cards.forEach(card=>{

card.addEventListener("mouseenter",()=>{

card.style.transform="translateY(-10px)";

});

card.addEventListener("mouseleave",()=>{

card.style.transform="translateY(0)";

});

});

/* ===============================
   SEARCH
=============================== */

const searchInput=document.querySelector(".search-box input");

if(searchInput){

searchInput.addEventListener("keyup",(e)=>{

console.log("Searching:",e.target.value);

});

}

/* ===============================
   DARK MODE
=============================== */

const darkBtn=document.querySelector(".fa-moon");

let dark=false;

if(darkBtn){

darkBtn.parentElement.addEventListener("click",()=>{

dark=!dark;

if(dark){

document.body.classList.add("dark");

darkBtn.classList.remove("fa-moon");

darkBtn.classList.add("fa-sun");

}else{

document.body.classList.remove("dark");

darkBtn.classList.remove("fa-sun");

darkBtn.classList.add("fa-moon");

}

});

}

/* ===============================
   ANALYTICS COUNTER
=============================== */

const numbers=document.querySelectorAll(".card h2");

numbers.forEach(number=>{

const value=number.innerText.replace("%","");

if(isNaN(value)) return;

let start=0;

const end=parseInt(value);

const timer=setInterval(()=>{

start++;

number.innerText=start+(number.innerText.includes("%")?"%":"");

if(start>=end){

clearInterval(timer);

}

},25);

});

/* ===============================
   NOTIFICATION
=============================== */

function notify(message){

const toast=document.createElement("div");

toast.className="toast";

toast.innerHTML=message;

document.body.appendChild(toast);

Object.assign(toast.style,{

position:"fixed",

top:"30px",

right:"30px",

padding:"16px 22px",

background:"#1E2A5A",

color:"#fff",

borderRadius:"14px",

zIndex:"9999",

boxShadow:"0 15px 40px rgba(0,0,0,.15)"

});

setTimeout(()=>{

toast.remove();

},3000);

}

setTimeout(()=>{

notify("🎉 Welcome to MamRaj Nexus Academy!");

},1200);

/* ===============================
   LOGOUT
=============================== */

const logout=document.querySelector(".logout button");

if(logout){

logout.addEventListener("click",()=>{

if(confirm("Logout from dashboard?")){

window.location.href="../pages/login.html";

}

});

}

/* ===============================
   CONSOLE
=============================== */

console.log("%cMamRaj Nexus Academy Dashboard",
"font-size:22px;font-weight:bold;color:#1E2A5A");

console.log("%cDashboard Loaded Successfully",
"color:#C58B73;font-size:14px;");
