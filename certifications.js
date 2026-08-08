document.addEventListener("DOMContentLoaded", () => {

    const cards =
        document.querySelectorAll(".certificate-card");

    const tabs =
        document.querySelectorAll(".tab");

    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const emptyState =
        document.getElementById("emptyState");


    let currentTab = "all";


    /* =====================================================
       FILTER CERTIFICATES
    ===================================================== */

    function filterCertificates() {

        const search =
            searchInput.value
                .toLowerCase()
                .trim();

        const category =
            categoryFilter.value;

        let visible = 0;


        cards.forEach(card => {

            const status =
                card.dataset.status;

            const cardCategory =
                card.dataset.category;

            const name =
                card.dataset.name.toLowerCase();


            const matchesTab =
                currentTab === "all" ||
                status === currentTab;


            const matchesCategory =
                category === "all" ||
                cardCategory === category;


            const matchesSearch =
                !search ||
                name.includes(search);


            if (
                matchesTab &&
                matchesCategory &&
                matchesSearch
            ) {

                card.style.display = "";

                visible++;

            } else {

                card.style.display = "none";

            }

        });


        emptyState.style.display =
            visible === 0
                ? "block"
                : "none";

    }


    /* =====================================================
       TABS
    ===================================================== */

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(item =>
                item.classList.remove("active")
            );

            tab.classList.add("active");

            currentTab =
                tab.dataset.tab;

            filterCertificates();

        });

    });


    /* =====================================================
       SEARCH
    ===================================================== */

    searchInput.addEventListener(
        "input",
        filterCertificates
    );


    /* =====================================================
       CATEGORY
    ===================================================== */

    categoryFilter.addEventListener(
        "change",
        filterCertificates
    );


    /* =====================================================
       THEME
    ===================================================== */

    const themeToggle =
        document.getElementById("themeToggle");

    themeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-preview"
            );

        }
    );


    filterCertificates();

});


/* =====================================================
   CERTIFICATE MODAL
===================================================== */

function viewCertificate(button) {

    const card =
        button.closest(".certificate-card");

    const name =
        card.dataset.name;

    const id =
        card.querySelector(
            ".certificate-id strong"
        )?.textContent.trim()
        || "MNA-CERT-2026-00001";


    document.getElementById(
        "modalCertificateName"
    ).textContent = name;


    document.getElementById(
        "modalCertificateId"
    ).textContent = id;


    document.getElementById(
        "certificateModal"
    ).classList.add("show");

}


function closeCertificate() {

    document.getElementById(
        "certificateModal"
    ).classList.remove("show");

}


function downloadCertificate() {

    alert(
        "Certificate download will be connected to the certificate system in the next phase."
    );

}


/* =====================================================
   HERO SCROLL
===================================================== */

function scrollToAvailable() {

    document.getElementById(
        "availableSection"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* =====================================================
   CLOSE MODAL OUTSIDE
===================================================== */

document.addEventListener("click", event => {

    const modal =
        document.getElementById(
            "certificateModal"
        );

    if (
        event.target.classList.contains(
            "modal-overlay"
        )
    ) {

        closeCertificate();

    }

});
