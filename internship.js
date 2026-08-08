/* ==========================================
   MamRaj Nexus Academy
   Internship Portal
==========================================*/

"use strict";

/* ===============================
   DOM ELEMENTS
=============================== */

const searchInput = document.querySelector(".hero-search input");

const locationFilter = document.querySelectorAll(".hero-search select")[0];

const durationFilter = document.querySelectorAll(".hero-search select")[1];

const internshipCards = document.querySelectorAll(".internship-card");

const saveButtons = document.querySelectorAll(".save-btn");

const searchButton = document.querySelector(".hero-search button");

/* ===============================
   SEARCH
=============================== */

function searchInternships(){

const keyword = searchInput.value.toLowerCase();

internshipCards.forEach(card=>{

const text = card.innerText.toLowerCase();

if(text.includes(keyword)){

card.style.display="block";

}else{

card.style.display="none";

}

});

}

if(searchButton){

searchButton.addEventListener("click",searchInternships);

}

if(searchInput){

searchInput.addEventListener("keyup",searchInternships);

}

/* ===============================
   LOCATION FILTER
=============================== */

function filterLocation(){

const location = locationFilter.value.toLowerCase();

internshipCards.forEach(card=>{

if(location==="remote"){

card.style.display = card.innerText.toLowerCase().includes("remote")

? "block"

: "none";

}

else if(location==="hybrid"){

card.style.display = card.innerText.toLowerCase().includes("hybrid")

? "block"

: "none";

}

else if(location==="on-site"){

card.style.display =

!card.innerText.toLowerCase().includes("remote") &&

!card.innerText.toLowerCase().includes("hybrid")

? "block"

: "none";

}

else{

card.style.display="block";

}

});

}

locationFilter.addEventListener("change",filterLocation);

/* ===============================
   DURATION FILTER
=============================== */

function filterDuration(){

const value = durationFilter.value.toLowerCase();

internshipCards.forEach(card=>{

if(value==="duration"){

card.style.display="block";

return;

}

if(card.innerText.toLowerCase().includes(value)){

card.style.display="block";

}else{

card.style.display="none";

}

});

}

durationFilter.addEventListener("change",filterDuration);

/* ===============================
   SAVE INTERNSHIP
=============================== */

saveButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

btn.classList.toggle("active");

const icon = btn.querySelector("i");

if(btn.classList.contains("active")){

icon.classList.remove("fa-regular");

icon.classList.add("fa-solid");

showToast("Internship saved successfully ❤️");

}else{

icon.classList.remove("fa-solid");

icon.classList.add("fa-regular");

showToast("Removed from saved internships");

}

});

});

/* ===============================
   TOAST
=============================== */

function showToast(message){

const toast=document.createElement("div");

toast.className="toast";

toast.innerHTML=message;

document.body.appendChild(toast);

Object.assign(toast.style,{

position:"fixed",

bottom:"30px",

right:"30px",

padding:"16px 24px",

background:"#1E2A5A",

color:"#fff",

borderRadius:"14px",

boxShadow:"0 15px 40px rgba(0,0,0,.15)",

zIndex:"9999",

opacity:"0",

transition:".3s"

});

setTimeout(()=>{

toast.style.opacity="1";

},100);

setTimeout(()=>{

toast.style.opacity="0";

setTimeout(()=>toast.remove(),300);

},2500);

}

/* ===============================
   PAGE LOAD
=============================== */

window.addEventListener("load",()=>{

showToast("🚀 Internship Portal Ready");

});

console.log("Internship Module Loaded");
/* ==========================================
   PART 2
   Pagination • Saved Data • Apply Workflow
========================================== */

/* ===============================
   LOCAL STORAGE
================================ */

const STORAGE_KEY = "mamraj_saved_internships";

function getSavedInternships(){

    try{

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    }catch(error){

        console.error("Unable to read saved internships",error);

        return [];

    }

}

function saveInternships(data){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}

/* ===============================
   UNIQUE INTERNSHIP ID
================================ */

function getInternshipId(card,index){

    const title =
        card.querySelector(".company h3")?.innerText ||
        `internship-${index}`;

    const company =
        card.querySelector(".company p")?.innerText ||
        "";

    return `${title}-${company}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-|-$/g,"");

}

/* ===============================
   RESTORE SAVED INTERNSHIPS
================================ */

function restoreSavedInternships(){

    const saved = getSavedInternships();

    internshipCards.forEach((card,index)=>{

        const id = getInternshipId(card,index);

        const button =
            card.querySelector(".save-btn");

        const icon =
            button?.querySelector("i");

        if(!button || !icon) return;

        if(saved.includes(id)){

            button.classList.add("active");

            icon.classList.remove("fa-regular");

            icon.classList.add("fa-solid");

        }

    });

}

/* ===============================
   IMPROVED SAVE HANDLER
================================ */

saveButtons.forEach((button,index)=>{

    button.addEventListener("click",()=>{

        const card =
            button.closest(".internship-card");

        if(!card) return;

        const id =
            getInternshipId(card,index);

        let saved =
            getSavedInternships();

        if(button.classList.contains("active")){

            if(!saved.includes(id)){

                saved.push(id);

            }

            saveInternships(saved);

        }else{

            saved =
                saved.filter(item=>item !== id);

            saveInternships(saved);

        }

        updateSavedCounter();

    });

});

/* ===============================
   SAVED COUNTER
================================ */

function updateSavedCounter(){

    const count =
        getSavedInternships().length;

    const counter =
        document.querySelector(".saved-count");

    if(counter){

        counter.textContent = count;

    }

}

/* ===============================
   PAGINATION
================================ */

const pageButtons =
    document.querySelectorAll(".page-btn");

let currentPage = 1;

const cardsPerPage = 6;

function showPage(page){

    currentPage = page;

    const cards =
        Array.from(
            document.querySelectorAll(
                ".internship-card"
            )
        );

    const totalPages =
        Math.ceil(
            cards.length / cardsPerPage
        );

    cards.forEach((card,index)=>{

        const start =
            (page - 1) * cardsPerPage;

        const end =
            start + cardsPerPage;

        card.style.display =
            index >= start && index < end
                ? ""
                : "none";

    });

    pageButtons.forEach((button,index)=>{

        if(
            index > 0 &&
            index < pageButtons.length - 1
        ){

            button.classList.toggle(
                "active",
                Number(button.innerText) === page
            );

        }

    });

}

pageButtons.forEach((button,index)=>{

    button.addEventListener("click",()=>{

        const text =
            button.innerText.trim();

        if(text === "‹" || index === 0){

            if(currentPage > 1){

                showPage(currentPage - 1);

            }

            return;

        }

        if(
            text === "›" ||
            index === pageButtons.length - 1
        ){

            const totalPages =
                Math.ceil(
                    internshipCards.length /
                    cardsPerPage
                );

            if(currentPage < totalPages){

                showPage(currentPage + 1);

            }

            return;

        }

        const page =
            Number(text);

        if(!isNaN(page)){

            showPage(page);

        }

    });

});

/* ===============================
   APPLY BUTTON
================================ */

const applyButtons =
    document.querySelectorAll(".apply-btn");

applyButtons.forEach(button=>{

    button.addEventListener("click",(event)=>{

        const card =
            button.closest(".internship-card");

        if(!card) return;

        const title =
            card.querySelector(".company h3")
            ?.innerText ||
            "this internship";

        const company =
            card.querySelector(".company p")
            ?.innerText ||
            "";

        const confirmed =
            confirm(
                `Apply for ${title} at ${company}?`
            );

        if(!confirmed){

            event.preventDefault();

            return;

        }

        localStorage.setItem(
            "lastSelectedInternship",
            JSON.stringify({

                title:title,

                company:company,

                appliedAt:new Date().toISOString()

            })
        );

    });

});

/* ===============================
   RECOMMENDATION SORTING
================================ */

function getMatchPercentage(card){

    const text =
        card.innerText;

    const match =
        text.match(/(\d+)%\s*Match/i);

    return match
        ? Number(match[1])
        : 0;

}

function sortByMatch(){

    const grid =
        document.querySelector(
            ".internship-grid"
        );

    if(!grid) return;

    const cards =
        Array.from(
            grid.querySelectorAll(
                ".internship-card"
            )
        );

    cards.sort(
        (a,b)=>
            getMatchPercentage(b) -
            getMatchPercentage(a)
    );

    cards.forEach(card=>{

        grid.appendChild(card);

    });

}

/* ===============================
   LOAD MORE
================================ */

const loadMoreButton =
    document.querySelector(
        ".load-more-btn"
    );

if(loadMoreButton){

    loadMoreButton.addEventListener(
        "click",
        ()=>{

            internshipCards.forEach(
                card=>{

                    card.style.display="";

                }
            );

            loadMoreButton.style.display=
                "none";

            showToast(
                "More internships loaded 🚀"
            );

        }
    );

}

/* ===============================
   INITIALIZE
================================ */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        restoreSavedInternships();

        updateSavedCounter();

    }
);
/* ==========================================
   MamRaj Nexus Academy
   internships.js
   PART 3

   Advanced Search
   Combined Filters
   Sorting
   Application Tracking
========================================== */

"use strict";

/* ===============================
   ADVANCED FILTER ELEMENTS
================================ */

const internshipGrid =
    document.querySelector(".internship-grid");

const allInternshipCards =
    internshipGrid
        ? Array.from(
            internshipGrid.querySelectorAll(
                ".internship-card"
            )
        )
        : [];


/* ===============================
   READ CARD DATA
================================ */

function getCardData(card, index){

    const title =
        card.querySelector(".company h3")
            ?.textContent
            .trim() || "";

    const company =
        card.querySelector(".company p")
            ?.textContent
            .trim() || "";

    const details =
        Array.from(
            card.querySelectorAll(".details span")
        ).map(item =>
            item.textContent
                .trim()
                .toLowerCase()
        );

    const skills =
        Array.from(
            card.querySelectorAll(".skills span")
        ).map(item =>
            item.textContent
                .trim()
                .toLowerCase()
        );

    const matchText =
        card.querySelector(".match p")
            ?.textContent || "";

    const match =
        Number(
            matchText.match(/\d+/)?.[0] || 0
        );

    return {

        id: getInternshipId(card,index),

        title,

        company,

        details,

        skills,

        match,

        element: card

    };

}


/* ===============================
   CREATE INTERNSHIP DATA
================================ */

const internshipData =
    allInternshipCards.map(
        (card,index)=>
            getCardData(card,index)
    );


/* ===============================
   ADVANCED SEARCH
================================ */

function advancedSearch(){

    const keyword =
        searchInput?.value
            .trim()
            .toLowerCase() || "";

    const selectedLocation =
        locationFilter?.value
            .trim()
            .toLowerCase() || "";

    const selectedDuration =
        durationFilter?.value
            .trim()
            .toLowerCase() || "";

    internshipData.forEach(data => {

        const searchableText = [

            data.title,

            data.company,

            ...data.details,

            ...data.skills

        ].join(" ");

        const keywordMatch =
            !keyword ||
            searchableText.includes(keyword);

        let locationMatch = true;

        if(
            selectedLocation &&
            selectedLocation !== "remote"
        ){

            locationMatch =
                searchableText.includes(
                    selectedLocation
                );

        }

        if(
            selectedLocation === "remote"
        ){

            locationMatch =
                searchableText.includes("remote");

        }

        let durationMatch = true;

        if(
            selectedDuration &&
            selectedDuration !== "duration"
        ){

            durationMatch =
                searchableText.includes(
                    selectedDuration
                );

        }

        const visible =
            keywordMatch &&
            locationMatch &&
            durationMatch;

        data.element.style.display =
            visible ? "" : "none";

    });

}


/* ===============================
   REPLACE BASIC SEARCH
================================ */

if(searchInput){

    searchInput.addEventListener(
        "input",
        advancedSearch
    );

}

if(locationFilter){

    locationFilter.addEventListener(
        "change",
        advancedSearch
    );

}

if(durationFilter){

    durationFilter.addEventListener(
        "change",
        advancedSearch
    );

}


/* ===============================
   RESULT COUNTER
================================ */

function updateResultCounter(){

    const visible =
        allInternshipCards.filter(
            card =>
                card.style.display !== "none"
        ).length;

    const counter =
        document.querySelector(
            ".result-count"
        );

    if(counter){

        counter.textContent =
            `${visible} internships found`;

    }

}


/* ===============================
   SORTING
================================ */

function sortInternships(type){

    if(!internshipGrid) return;

    const cards =
        Array.from(
            internshipGrid.querySelectorAll(
                ".internship-card"
            )
        );

    if(type === "match"){

        cards.sort(
            (a,b)=>
                getMatchPercentage(b) -
                getMatchPercentage(a)
        );

    }

    if(type === "stipend"){

        cards.sort(
            (a,b)=>
                extractStipend(b) -
                extractStipend(a)
        );

    }

    if(type === "title"){

        cards.sort((a,b)=>{

            const titleA =
                a.querySelector(
                    ".company h3"
                )?.textContent || "";

            const titleB =
                b.querySelector(
                    ".company h3"
                )?.textContent || "";

            return titleA.localeCompare(
                titleB
            );

        });

    }

    cards.forEach(card => {

        internshipGrid.appendChild(card);

    });

}


/* ===============================
   STIPEND EXTRACTION
================================ */

function extractStipend(card){

    const details =
        Array.from(
            card.querySelectorAll(
                ".details span"
            )
        );

    const stipendElement =
        details.find(item =>
            item.textContent
                .toLowerCase()
                .includes("₹")
        );

    if(!stipendElement){

        return 0;

    }

    const numbers =
        stipendElement.textContent
            .replace(/,/g,"")
            .match(/\d+/);

    return numbers
        ? Number(numbers[0])
        : 0;

}


/* ===============================
   SORT DROPDOWN
================================ */

const sortSelect =
    document.querySelector(
        ".sort-internships"
    );

if(sortSelect){

    sortSelect.addEventListener(
        "change",
        event => {

            sortInternships(
                event.target.value
            );

        }
    );

}


/* ===============================
   APPLICATION TRACKING
================================ */

const APPLICATION_KEY =
    "mamraj_applications";


function getApplications(){

    try{

        return JSON.parse(
            localStorage.getItem(
                APPLICATION_KEY
            )
        ) || [];

    }catch(error){

        console.error(
            "Unable to load applications",
            error
        );

        return [];

    }

}


function saveApplications(applications){

    localStorage.setItem(

        APPLICATION_KEY,

        JSON.stringify(applications)

    );

}


/* ===============================
   APPLY TO INTERNSHIP
================================ */

function registerApplication(card){

    const title =
        card.querySelector(
            ".company h3"
        )?.textContent.trim() || "";

    const company =
        card.querySelector(
            ".company p"
        )?.textContent.trim() || "";

    const applications =
        getApplications();

    const alreadyApplied =
        applications.some(
            application =>
                application.title === title &&
                application.company === company
        );

    if(alreadyApplied){

        showToast(
            "You have already applied for this internship."
        );

        return false;

    }

    applications.push({

        id:
            `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2,8)}`,

        title,

        company,

        status:"Applied",

        appliedAt:
            new Date().toISOString(),

        progress:25

    });

    saveApplications(applications);

    showToast(
        "Application submitted successfully 🚀"
    );

    return true;

}


/* ===============================
   APPLY BUTTON ENHANCEMENT
================================ */

document
    .querySelectorAll(".apply-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const card =
                    button.closest(
                        ".internship-card"
                    );

                if(!card) return;

                const title =
                    card.querySelector(
                        ".company h3"
                    )?.textContent.trim() || "";

                const company =
                    card.querySelector(
                        ".company p"
                    )?.textContent.trim() || "";

                const applications =
                    getApplications();

                const alreadyApplied =
                    applications.some(
                        application =>
                            application.title === title &&
                            application.company === company
                    );

                if(alreadyApplied){

                    event.preventDefault();

                    showToast(
                        "Already applied to this internship."
                    );

                    return;

                }

                const confirmed =
                    confirm(
                        `Apply for ${title} at ${company}?`
                    );

                if(!confirmed){

                    event.preventDefault();

                    return;

                }

                registerApplication(card);

            }
        );

    });


/* ===============================
   APPLICATION STATISTICS
================================ */

function updateApplicationStats(){

    const applications =
        getApplications();

    const total =
        applications.length;

    const pending =
        applications.filter(
            application =>
                application.status ===
                "Applied"
        ).length;

    const shortlisted =
        applications.filter(
            application =>
                application.status ===
                "Shortlisted"
        ).length;

    const rejected =
        applications.filter(
            application =>
                application.status ===
                "Rejected"
        ).length;


    const totalElement =
        document.querySelector(
            "[data-stat='applications']"
        );

    const pendingElement =
        document.querySelector(
            "[data-stat='pending']"
        );

    const shortlistedElement =
        document.querySelector(
            "[data-stat='shortlisted']"
        );

    const rejectedElement =
        document.querySelector(
            "[data-stat='rejected']"
        );


    if(totalElement){

        totalElement.textContent =
            total;

    }

    if(pendingElement){

        pendingElement.textContent =
            pending;

    }

    if(shortlistedElement){

        shortlistedElement.textContent =
            shortlisted;

    }

    if(rejectedElement){

        rejectedElement.textContent =
            rejected;

    }

}


/* ===============================
   SHIVAAI AI MATCH
================================ */

function getRecommendedInternships(){

    return internshipData

        .sort(
            (a,b)=>
                b.match - a.match
        )

        .slice(0,3);

}


function showAIRecommendations(){

    const recommendations =
        getRecommendedInternships();

    console.log(
        "Shivaay AI Recommendations:",
        recommendations
    );

}


/* ===============================
   INITIALIZE PART 3
================================ */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        updateResultCounter();

        updateApplicationStats();

        showAIRecommendations();

    }
);
