from pathlib import Path
import re

src = Path("/certifications.html")
out = Path("/certifications.js")

if not src.exists():
    raise FileNotFoundError("certifications_connected.html not found")

html = src.read_text(encoding="utf-8")

# Extract the Firebase-connected module that was previously added.
m = re.search(
    r'<script type="module">\s*(.*?)\s*</script>\s*<script src="certifications\.js"',
    html,
    flags=re.S
)

if not m:
    raise RuntimeError("Connected Firebase script was not found.")

firebase_js = m.group(1).strip()

# Keep the module imports/config/progress logic, then expose the UI functions
# as window functions so the normal page HTML onclick handlers continue to work.
# Remove the old global function declarations from the module and replace them
# with robust versions that work with dynamically rendered certificate cards.

firebase_js = firebase_js.replace(
    'window.openCourse = function(courseId) {',
    'window.openCourse = function(courseId) {',
    1
)

# The extracted script already has viewCertificate/downloadCertificate logic.
# Append a complete, null-safe filtering/theme/modal layer that works AFTER
# Firebase dynamically renders the cards.
ui_js = r'''

/* =========================================================
   CERTIFICATIONS UI
   Firebase renders the cards dynamically, so filtering is
   event-based and always queries the current DOM.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const emptyState = document.getElementById("emptyState");
    const themeToggle = document.getElementById("themeToggle");

    let currentTab = "all";

    function getCards() {
        return Array.from(
            document.querySelectorAll(".certificate-card")
        );
    }

    function filterCertificates() {

        const search = (searchInput?.value || "")
            .toLowerCase()
            .trim();

        const category = categoryFilter?.value || "all";

        let visible = 0;

        getCards().forEach(card => {

            const status = card.dataset.status || "available";
            const cardCategory = card.dataset.category || "all";
            const name = (card.dataset.name || "").toLowerCase();

            const matchesTab =
                currentTab === "all" ||
                status === currentTab;

            const matchesCategory =
                category === "all" ||
                cardCategory === category;

            const matchesSearch =
                !search ||
                name.includes(search);

            const show =
                matchesTab &&
                matchesCategory &&
                matchesSearch;

            card.style.display = show ? "" : "none";

            if (show) visible++;
        });

        if (emptyState) {
            emptyState.style.display =
                visible === 0 ? "block" : "none";
        }
    }

    document.querySelectorAll(".tab").forEach(tab => {

        tab.addEventListener("click", () => {

            document.querySelectorAll(".tab")
                .forEach(item =>
                    item.classList.remove("active")
                );

            tab.classList.add("active");

            currentTab =
                tab.dataset.tab || "all";

            filterCertificates();
        });

    });

    searchInput?.addEventListener(
        "input",
        filterCertificates
    );

    categoryFilter?.addEventListener(
        "change",
        filterCertificates
    );

    themeToggle?.addEventListener(
        "click",
        () => {
            document.body.classList.toggle(
                "dark-preview"
            );
        }
    );

    /*
     * Firebase cards are inserted asynchronously.
     * Observe the grid so the filters are applied once
     * the real student certificates arrive.
     */
    const grid =
        document.getElementById("certificateGrid");

    if (grid) {

        const observer =
            new MutationObserver(() => {
                filterCertificates();
            });

        observer.observe(grid, {
            childList: true,
            subtree: true
        });
    }

    filterCertificates();
});


/* =========================================================
   CERTIFICATE MODAL
========================================================= */

window.viewCertificate = function(button) {

    const card =
        button?.closest(".certificate-card");

    if (!card) return;

    const name =
        card.dataset.name ||
        "Certificate";

    const id =
        card.querySelector(
            ".certificate-id strong"
        )?.textContent.trim() ||
        "MNA-CERT";

    const nameElement =
        document.getElementById(
            "modalCertificateName"
        );

    const idElement =
        document.getElementById(
            "modalCertificateId"
        );

    const modal =
        document.getElementById(
            "certificateModal"
        );

    if (nameElement)
        nameElement.textContent = name;

    if (idElement)
        idElement.textContent = id;

    if (modal)
        modal.classList.add("show");
};


window.closeCertificate = function() {

    const modal =
        document.getElementById(
            "certificateModal"
        );

    if (modal)
        modal.classList.remove("show");
};


/*
 * Download the actual certificate page.
 * Firebase-connected card data supplies the certificate ID.
 */
window.downloadCertificate = function(button) {

    const card =
        button?.closest(".certificate-card");

    if (!card) return;

    const name =
        card.dataset.name || "";

    const course =
        Array.from(
            window.__MAMRAJ_COURSE_CATALOG || []
        ).find(item => item.name === name);

    const state =
        course &&
        window.__MAMRAJ_CERTIFICATE_STATE
            ? window.__MAMRAJ_CERTIFICATE_STATE.get(course.id)
            : null;

    if (!state?.earned) {
        return;
    }

    const certificateId =
        state.certificate?.certificateId || "";

    const courseId =
        course.id;

    window.open(
        `certificate.html?course=${encodeURIComponent(courseId)}&certificateId=${encodeURIComponent(certificateId)}`,
        "_blank"
    );
};


/* =========================================================
   HERO SCROLL
========================================================= */

window.scrollToAvailable = function() {

    const section =
        document.getElementById(
            "availableSection"
        );

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
};


/* =========================================================
   CLOSE MODAL OUTSIDE
========================================================= */

document.addEventListener("click", event => {

    if (
        event.target.classList.contains(
            "modal-overlay"
        )
    ) {
        window.closeCertificate();
    }

});


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        window.closeCertificate();
    }

});
'''

# Make the Firebase module publish its catalog/state for the UI download handler.
firebase_js = firebase_js.replace(
    'const COURSE_CATALOG = [',
    'const COURSE_CATALOG = [',
    1
)

# Insert public references immediately after COURSE_CATALOG closes by using a
# stable marker that exists in the connected script.
marker = 'const COURSE_ALIASES = {'
firebase_js = firebase_js.replace(
    marker,
    'window.__MAMRAJ_COURSE_CATALOG = COURSE_CATALOG;\n' + marker,
    1
)

firebase_js = firebase_js.replace(
    'let certificateState = new Map();',
    'let certificateState = new Map();\nwindow.__MAMRAJ_CERTIFICATE_STATE = certificateState;',
    1
)

# The module currently defines window.downloadCertificate already. Keep the UI
# version authoritative by placing ui_js after the Firebase module.
final_js = firebase_js + "\n\n" + ui_js

out.write_text(final_js, encoding="utf-8")
print(out)
