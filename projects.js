document.addEventListener("DOMContentLoaded", () => {

    const cards =
        document.querySelectorAll(".project-card");

    const filters =
        document.querySelectorAll(".filter-btn");

    const search =
        document.getElementById("projectSearch");

    const emptyState =
        document.getElementById("emptyState");


    /* =====================================================
       FILTER PROJECTS
    ===================================================== */

    filters.forEach(button => {

        button.addEventListener("click", () => {

            filters.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const category =
                button.dataset.filter;

            let visible = 0;

            cards.forEach(card => {

                if (
                    category === "all" ||
                    card.dataset.category === category
                ) {

                    card.style.display = "";

                    visible++;

                } else {

                    card.style.display = "none";

                }

            });

            emptyState.classList.toggle(
                "show",
                visible === 0
            );

        });

    });


    /* =====================================================
       SEARCH
    ===================================================== */

    search.addEventListener("input", () => {

        const query =
            search.value.toLowerCase().trim();

        let visible = 0;

        cards.forEach(card => {

            const name =
                card.dataset.name.toLowerCase();

            const text =
                card.innerText.toLowerCase();

            if (
                name.includes(query) ||
                text.includes(query)
            ) {

                card.style.display = "";

                visible++;

            } else {

                card.style.display = "none";

            }

        });

        emptyState.classList.toggle(
            "show",
            visible === 0
        );

    });


    /* =====================================================
       CREATE PROJECT MODAL
    ===================================================== */

    const modal =
        document.getElementById("projectModal");

    const openBtn =
        document.getElementById("createProjectBtn");

    const closeBtn =
        document.getElementById("closeModal");

    openBtn.addEventListener("click", () => {

        modal.classList.add("show");

    });

    closeBtn.addEventListener("click", () => {

        modal.classList.remove("show");

    });

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            modal.classList.remove("show");

        }

    });


    /* =====================================================
       CREATE FORM
    ===================================================== */

    document
        .getElementById("projectForm")
        .addEventListener("submit", event => {

            event.preventDefault();

            alert(
                "Project created successfully!"
            );

            modal.classList.remove("show");

            event.target.reset();

        });


    /* =====================================================
       THEME BUTTON
    ===================================================== */

    const theme =
        document.getElementById("themeToggle");

    theme.addEventListener("click", () => {

        document.body.classList.toggle("dark-preview");

        const icon =
            theme.querySelector("i");

        icon.classList.toggle("fa-moon");
        icon.classList.toggle("fa-sun");

    });

});
