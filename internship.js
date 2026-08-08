/* =====================================================
   MamRaj Nexus Academy
   Internships Page
   Search + Filters + Save + Sorting
===================================================== */

"use strict";


/* =====================================================
   INTERNSHIP DATA
===================================================== */

const internships = [

    {
        id: "full-stack-001",
        title: "Full Stack Developer Intern",
        company: "TechNova Solutions",
        location: "Remote",
        duration: "3–6 months",
        stipend: 15000,
        match: 92
    },

    {
        id: "data-analyst-001",
        title: "Data Analyst Intern",
        company: "Analytics Vidhya",
        location: "Bangalore",
        duration: "2–6 months",
        stipend: 12000,
        match: 87
    },

    {
        id: "uiux-001",
        title: "UI/UX Design Intern",
        company: "PixelCrayons",
        location: "Remote",
        duration: "3 months",
        stipend: 10000,
        match: 84
    },

    {
        id: "python-001",
        title: "Python Developer Intern",
        company: "CodeVerse Technologies",
        location: "Delhi",
        duration: "4 months",
        stipend: 18000,
        match: 89
    },

    {
        id: "frontend-001",
        title: "Frontend Developer Intern",
        company: "WebCraft Labs",
        location: "Mumbai",
        duration: "3–6 months",
        stipend: 14000,
        match: 86
    },

    {
        id: "marketing-001",
        title: "Digital Marketing Intern",
        company: "GrowthX",
        location: "Remote",
        duration: "3 months",
        stipend: 9000,
        match: 81
    }

];


/* =====================================================
   DOM ELEMENTS
===================================================== */

const searchInput =
    document.querySelector(".hero-search-input");

const locationFilter =
    document.querySelector(".location-filter");

const durationFilter =
    document.querySelector(".duration-filter");

const stipendFilter =
    document.querySelector(".stipend-filter");

const searchButton =
    document.querySelector(".search-button");

const internshipGrid =
    document.querySelector(".internship-grid");


/* =====================================================
   LOCAL STORAGE
===================================================== */

const SAVED_KEY =
    "mamraj_saved_internships";


function getSavedInternships() {

    try {

        return JSON.parse(
            localStorage.getItem(SAVED_KEY)
        ) || [];

    } catch (error) {

        return [];

    }

}


function saveInternships(data) {

    localStorage.setItem(
        SAVED_KEY,
        JSON.stringify(data)
    );

}


/* =====================================================
   CHECK SAVED
===================================================== */

function isSaved(id) {

    const saved =
        getSavedInternships();

    return saved.includes(id);

}


/* =====================================================
   TOGGLE SAVE
===================================================== */

function toggleSave(id) {

    let saved =
        getSavedInternships();

    if (saved.includes(id)) {

        saved =
            saved.filter(
                item => item !== id
            );

        showToast(
            "Internship removed from saved."
        );

    } else {

        saved.push(id);

        showToast(
            "Internship saved successfully."
        );

    }

    saveInternships(saved);

    renderInternships(
        getFilteredInternships()
    );

}


/* =====================================================
   CREATE CARD
===================================================== */

function createInternshipCard(internship) {

    const saved =
        isSaved(internship.id);


    return `

        <article
            class="internship-card"
            data-id="${internship.id}"
        >

            <div class="card-top">

                <div>

                    <h3>
                        ${internship.title}
                    </h3>

                    <p>
                        ${internship.company}
                    </p>

                </div>


                <span class="match">
                    ${internship.match}% Match
                </span>

            </div>


            <div class="card-details">

                <span>

                    <i class="fa-solid fa-location-dot"></i>

                    ${internship.location}

                </span>


                <span>

                    <i class="fa-regular fa-calendar"></i>

                    ${internship.duration}

                </span>


                <span>

                    <i class="fa-solid fa-indian-rupee-sign"></i>

                    ₹${internship.stipend.toLocaleString("en-IN")}
                    / month

                </span>

            </div>


            <div class="card-bottom">

                <a
                    href="internship-details.html?id=${internship.id}"
                    class="apply-btn"
                >
                    View Internship
                </a>


                <button
                    class="save-btn ${saved ? "saved" : ""}"
                    data-save="${internship.id}"
                    aria-label="Save internship"
                >

                    <i class="${
                        saved
                            ? "fa-solid"
                            : "fa-regular"
                    } fa-bookmark"></i>

                </button>

            </div>

        </article>

    `;

}


/* =====================================================
   RENDER INTERNSHIPS
===================================================== */

function renderInternships(data) {

    if (!internshipGrid) return;


    if (!data.length) {

        internshipGrid.innerHTML = `

            <div class="no-results">

                <div class="no-results-icon">

                    <i class="fa-solid fa-magnifying-glass"></i>

                </div>

                <h3>
                    No internships found
                </h3>

                <p>
                    Try changing your search or filters.
                </p>

                <button
                    id="clearFilters"
                    class="clear-filter-btn"
                >
                    Clear Filters
                </button>

            </div>

        `;

        return;

    }


    internshipGrid.innerHTML =
        data
            .map(createInternshipCard)
            .join("");


    attachCardEvents();

}


/* =====================================================
   CARD EVENTS
===================================================== */

function attachCardEvents() {

    const saveButtons =
        document.querySelectorAll(
            "[data-save]"
        );


    saveButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const id =
                    this.dataset.save;

                toggleSave(id);

            }
        );

    });


    const clearButton =
        document.getElementById(
            "clearFilters"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearFilters
        );

    }

}


/* =====================================================
   SEARCH
===================================================== */

function getSearchValue() {

    if (!searchInput) return "";

    return searchInput
        .value
        .trim()
        .toLowerCase();

}


/* =====================================================
   FILTER DATA
===================================================== */

function getFilteredInternships() {

    const search =
        getSearchValue();


    const location =
        locationFilter
            ? locationFilter.value.toLowerCase()
            : "";


    const duration =
        durationFilter
            ? durationFilter.value.toLowerCase()
            : "";


    const stipend =
        stipendFilter
            ? stipendFilter.value
            : "";


    return internships.filter(
        internship => {


            /* SEARCH */

            const searchableText = `

                ${internship.title}
                ${internship.company}
                ${internship.location}
                ${internship.duration}

            `.toLowerCase();


            const matchesSearch =
                !search ||
                searchableText.includes(
                    search
                );


            /* LOCATION */

            const matchesLocation =
                !location ||
                internship.location
                    .toLowerCase()
                    .includes(location);


            /* DURATION */

            const matchesDuration =
                !duration ||
                internship.duration
                    .toLowerCase()
                    .includes(duration);


            /* STIPEND */

            let matchesStipend =
                true;


            if (stipend) {

                matchesStipend =
                    internship.stipend >=
                    Number(stipend);

            }


            return (

                matchesSearch &&
                matchesLocation &&
                matchesDuration &&
                matchesStipend

            );

        }
    );

}


/* =====================================================
   APPLY FILTERS
===================================================== */

function applyFilters() {

    const filtered =
        getFilteredInternships();


    renderInternships(
        filtered
    );

}


/* =====================================================
   SEARCH BUTTON
===================================================== */

if (searchButton) {

    searchButton.addEventListener(
        "click",
        applyFilters
    );

}


/* =====================================================
   LIVE SEARCH
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


/* =====================================================
   FILTER EVENTS
===================================================== */

[
    locationFilter,
    durationFilter,
    stipendFilter

].forEach(filter => {

    if (filter) {

        filter.addEventListener(
            "change",
            applyFilters
        );

    }

});


/* =====================================================
   ENTER KEY SEARCH
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                applyFilters();

            }

        }
    );

}


/* =====================================================
   CLEAR FILTERS
===================================================== */

function clearFilters() {

    if (searchInput) {

        searchInput.value = "";

    }


    if (locationFilter) {

        locationFilter.value = "";

    }


    if (durationFilter) {

        durationFilter.value = "";

    }


    if (stipendFilter) {

        stipendFilter.value = "";

    }


    renderInternships(
        internships
    );

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".internship-toast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "internship-toast";


    toast.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        <span>
            ${message}
        </span>

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "show"
            );

        },
        20
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

            setTimeout(
                () => toast.remove(),
                300
            );

        },
        2500
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderInternships(
            internships
        );

    }
);
