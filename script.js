/* ==========================================
   MamRaj Nexus Academy
   Main JavaScript
==========================================*/

"use strict";

/* ==========================================
   DOM ELEMENTS
==========================================*/

const loader = document.getElementById("loader");

const header = document.getElementById("header");

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

const navItems = document.querySelectorAll(".nav-links a");

/* ==========================================
   PRELOADER
==========================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.style.opacity = "0";

        loader.style.visibility = "hidden";

        loader.style.transition = ".5s";

    },800);

});

/* ==========================================
   STICKY HEADER
==========================================*/

window.addEventListener("scroll",()=>{

    if(window.scrollY > 60){

        header.classList.add("scrolled");

    }

    else{

        header.classList.remove("scrolled");

    }

});

/* ==========================================
   MOBILE MENU
==========================================*/

menuToggle.addEventListener("click",()=>{

    navLinks.classList.toggle("active");

});

/* ==========================================
   CLOSE MENU
==========================================*/

navItems.forEach(item=>{

item.addEventListener("click",()=>{

navLinks.classList.remove("active");

});

});

/* ==========================================
   SMOOTH SCROLL
==========================================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth",

block:"start"

});

}

});

});
