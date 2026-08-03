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
/* ==========================================
   SCROLL REVEAL
==========================================*/

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll(){

    const windowHeight = window.innerHeight;

    revealElements.forEach(element=>{

        const elementTop = element.getBoundingClientRect().top;

        if(elementTop < windowHeight - 120){

            element.classList.add("active");

        }

    });

}

window.addEventListener("scroll",revealOnScroll);

revealOnScroll();

/* ==========================================
   ACTIVE NAVIGATION
==========================================*/

const sections = document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if(window.scrollY >= sectionTop &&
           window.scrollY < sectionTop + sectionHeight){

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#" + current){

            link.classList.add("active");

        }

    });

});

/* ==========================================
   COUNTER ANIMATION
==========================================*/

const counters = document.querySelectorAll(".stat h2");

let counterStarted = false;

function runCounters(){

    if(counterStarted) return;

    const heroStats = document.querySelector(".hero-stats");

    if(!heroStats) return;

    const trigger = heroStats.getBoundingClientRect().top;

    if(trigger < window.innerHeight - 100){

        counterStarted = true;

        counters.forEach(counter=>{

            const text = counter.innerText.replace("+","");

            const target = parseInt(text);

            if(isNaN(target)) return;

            let count = 0;

            const increment = Math.max(1,Math.ceil(target / 80));

            const timer = setInterval(()=>{

                count += increment;

                if(count >= target){

                    count = target;

                    clearInterval(timer);

                }

                counter.innerText = count + "+";

            },20);

        });

    }

}

window.addEventListener("scroll",runCounters);

runCounters();

/* ==========================================
   FLOATING EFFECT
==========================================*/

const floatElements = document.querySelectorAll(".float");

floatElements.forEach((item,index)=>{

    item.style.animationDelay = `${index * 0.3}s`;

});

/* ==========================================
   IMAGE PARALLAX
==========================================*/

const heroImage = document.querySelector(".hero-right");

window.addEventListener("scroll",()=>{

    if(heroImage){

        const offset = window.scrollY * 0.08;

        heroImage.style.transform = `translateY(${offset}px)`;

    }

});
/* ==========================================
   SCROLL REVEAL
==========================================*/

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll(){

    const windowHeight = window.innerHeight;

    revealElements.forEach(element=>{

        const elementTop = element.getBoundingClientRect().top;

        if(elementTop < windowHeight - 120){

            element.classList.add("active");

        }

    });

}

window.addEventListener("scroll",revealOnScroll);

revealOnScroll();

/* ==========================================
   ACTIVE NAVIGATION
==========================================*/

const sections = document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if(window.scrollY >= sectionTop &&
           window.scrollY < sectionTop + sectionHeight){

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#" + current){

            link.classList.add("active");

        }

    });

});

/* ==========================================
   COUNTER ANIMATION
==========================================*/

const counters = document.querySelectorAll(".stat h2");

let counterStarted = false;

function runCounters(){

    if(counterStarted) return;

    const heroStats = document.querySelector(".hero-stats");

    if(!heroStats) return;

    const trigger = heroStats.getBoundingClientRect().top;

    if(trigger < window.innerHeight - 100){

        counterStarted = true;

        counters.forEach(counter=>{

            const text = counter.innerText.replace("+","");

            const target = parseInt(text);

            if(isNaN(target)) return;

            let count = 0;

            const increment = Math.max(1,Math.ceil(target / 80));

            const timer = setInterval(()=>{

                count += increment;

                if(count >= target){

                    count = target;

                    clearInterval(timer);

                }

                counter.innerText = count + "+";

            },20);

        });

    }

}

window.addEventListener("scroll",runCounters);

runCounters();

/* ==========================================
   FLOATING EFFECT
==========================================*/

const floatElements = document.querySelectorAll(".float");

floatElements.forEach((item,index)=>{

    item.style.animationDelay = `${index * 0.3}s`;

});

/* ==========================================
   IMAGE PARALLAX
==========================================*/

const heroImage = document.querySelector(".hero-right");

window.addEventListener("scroll",()=>{

    if(heroImage){

        const offset = window.scrollY * 0.08;

        heroImage.style.transform = `translateY(${offset}px)`;

    }

});


/* ==========================================
   SCROLL REVEAL
==========================================*/

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll(){

    const windowHeight = window.innerHeight;

    revealElements.forEach(element=>{

        const elementTop = element.getBoundingClientRect().top;

        if(elementTop < windowHeight - 120){

            element.classList.add("active");

        }

    });

}

window.addEventListener("scroll",revealOnScroll);

revealOnScroll();

/* ==========================================
   ACTIVE NAVIGATION
==========================================*/

const sections = document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if(window.scrollY >= sectionTop &&
           window.scrollY < sectionTop + sectionHeight){

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#" + current){

            link.classList.add("active");

        }

    });

});

/* ==========================================
   COUNTER ANIMATION
==========================================*/

const counters = document.querySelectorAll(".stat h2");

let counterStarted = false;

function runCounters(){

    if(counterStarted) return;

    const heroStats = document.querySelector(".hero-stats");

    if(!heroStats) return;

    const trigger = heroStats.getBoundingClientRect().top;

    if(trigger < window.innerHeight - 100){

        counterStarted = true;

        counters.forEach(counter=>{

            const text = counter.innerText.replace("+","");

            const target = parseInt(text);

            if(isNaN(target)) return;

            let count = 0;

            const increment = Math.max(1,Math.ceil(target / 80));

            const timer = setInterval(()=>{

                count += increment;

                if(count >= target){

                    count = target;

                    clearInterval(timer);

                }

                counter.innerText = count + "+";

            },20);

        });

    }

}

window.addEventListener("scroll",runCounters);

runCounters();

/* ==========================================
   FLOATING EFFECT
==========================================*/

const floatElements = document.querySelectorAll(".float");

floatElements.forEach((item,index)=>{

    item.style.animationDelay = `${index * 0.3}s`;

});

/* ==========================================
   IMAGE PARALLAX
==========================================*/

const heroImage = document.querySelector(".hero-right");

window.addEventListener("scroll",()=>{

    if(heroImage){

        const offset = window.scrollY * 0.08;

        heroImage.style.transform = `translateY(${offset}px)`;

    }

});/* ==========================================
   SCROLL REVEAL
==========================================*/

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll(){

    const windowHeight = window.innerHeight;

    revealElements.forEach(element=>{

        const elementTop = element.getBoundingClientRect().top;

        if(elementTop < windowHeight - 120){

            element.classList.add("active");

        }

    });

}

window.addEventListener("scroll",revealOnScroll);

revealOnScroll();

/* ==========================================
   ACTIVE NAVIGATION
==========================================*/

const sections = document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if(window.scrollY >= sectionTop &&
           window.scrollY < sectionTop + sectionHeight){

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#" + current){

            link.classList.add("active");

        }

    });

});

/* ==========================================
   COUNTER ANIMATION
==========================================*/

const counters = document.querySelectorAll(".stat h2");

let counterStarted = false;

function runCounters(){

    if(counterStarted) return;

    const heroStats = document.querySelector(".hero-stats");

    if(!heroStats) return;

    const trigger = heroStats.getBoundingClientRect().top;

    if(trigger < window.innerHeight - 100){

        counterStarted = true;

        counters.forEach(counter=>{

            const text = counter.innerText.replace("+","");

            const target = parseInt(text);

            if(isNaN(target)) return;

            let count = 0;

            const increment = Math.max(1,Math.ceil(target / 80));

            const timer = setInterval(()=>{

                count += increment;

                if(count >= target){

                    count = target;

                    clearInterval(timer);

                }

                counter.innerText = count + "+";

            },20);

        });

    }

}

window.addEventListener("scroll",runCounters);

runCounters();

/* ==========================================
   FLOATING EFFECT
==========================================*/

const floatElements = document.querySelectorAll(".float");

floatElements.forEach((item,index)=>{

    item.style.animationDelay = `${index * 0.3}s`;

});

/* ==========================================
   IMAGE PARALLAX
==========================================*/

const heroImage = document.querySelector(".hero-right");

window.addEventListener("scroll",()=>{

    if(heroImage){

        const offset = window.scrollY * 0.08;

        heroImage.style.transform = `translateY(${offset}px)`;

    }

});

/* ==========================================
   SCROLL REVEAL
==========================================*/

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll(){

    const windowHeight = window.innerHeight;

    revealElements.forEach(element=>{

        const elementTop = element.getBoundingClientRect().top;

        if(elementTop < windowHeight - 120){

            element.classList.add("active");

        }

    });

}

window.addEventListener("scroll",revealOnScroll);

revealOnScroll();

/* ==========================================
   ACTIVE NAVIGATION
==========================================*/

const sections = document.querySelectorAll("section");

window.addEventListener("scroll",()=>{

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if(window.scrollY >= sectionTop &&
           window.scrollY < sectionTop + sectionHeight){

            current = section.getAttribute("id");

        }

    });

    navItems.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#" + current){

            link.classList.add("active");

        }

    });

});

/* ==========================================
   COUNTER ANIMATION
==========================================*/

const counters = document.querySelectorAll(".stat h2");

let counterStarted = false;

function runCounters(){

    if(counterStarted) return;

    const heroStats = document.querySelector(".hero-stats");

    if(!heroStats) return;

    const trigger = heroStats.getBoundingClientRect().top;

    if(trigger < window.innerHeight - 100){

        counterStarted = true;

        counters.forEach(counter=>{

            const text = counter.innerText.replace("+","");

            const target = parseInt(text);

            if(isNaN(target)) return;

            let count = 0;

            const increment = Math.max(1,Math.ceil(target / 80));

            const timer = setInterval(()=>{

                count += increment;

                if(count >= target){

                    count = target;

                    clearInterval(timer);

                }

                counter.innerText = count + "+";

            },20);

        });

    }

}

window.addEventListener("scroll",runCounters);

runCounters();

/* ==========================================
   FLOATING EFFECT
==========================================*/

const floatElements = document.querySelectorAll(".float");

floatElements.forEach((item,index)=>{

    item.style.animationDelay = `${index * 0.3}s`;

});

/* ==========================================
   IMAGE PARALLAX
==========================================*/

const heroImage = document.querySelector(".hero-right");

window.addEventListener("scroll",()=>{

    if(heroImage){

        const offset = window.scrollY * 0.08;

        heroImage.style.transform = `translateY(${offset}px)`;

    }

});
