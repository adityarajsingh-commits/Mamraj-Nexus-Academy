import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB7FZRTl4Sial-kzZ0nFsFo7FGcz5J8kxw",
    authDomain: "mamraj-nexus-academy.firebaseapp.com",
    projectId: "mamraj-nexus-academy",
    storageBucket: "mamraj-nexus-academy.firebasestorage.app",
    messagingSenderId: "548826957068",
    appId: "1:548826957068:web:29b02f77dc20feaf28f529",
    measurementId: "G-Z64L57P9XV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const COURSE_CATALOG = [
    {
        id: "web-development",
        name: "Full Stack Web Development",
        category: "development",
        description: "HTML, CSS, JavaScript, APIs and modern web development.",
        lessons: 60,
        duration: "6 Months",
        level: "Beginner → Pro",
        icon: "fa-code"
    },
    {
        id: "data-analytics",
        name: "Data Analytics",
        category: "data",
        description: "Data analysis, spreadsheets, SQL, Python, dashboards and practical projects.",
        lessons: 48,
        duration: "6 Months",
        level: "Beginner → Pro",
        icon: "fa-chart-column"
    },
    {
        id: "human-resource-management-ai",
        name: "Human Resource Management Using AI",
        category: "business",
        description: "Modern HR workflows, talent management and practical AI applications.",
        lessons: 48,
        duration: "6 Months",
        level: "Beginner → Pro",
        icon: "fa-users"
    },
    {
        id: "ui-ux-design",
        name: "UI/UX Design",
        category: "design",
        description: "User research, wireframes, prototypes and visual design.",
        lessons: 42,
        duration: "8 Weeks",
        level: "Beginner",
        icon: "fa-pen-ruler"
    },
    {
        id: "react-development",
        name: "React Development",
        category: "development",
        description: "Components, hooks, state management and modern React applications.",
        lessons: 36,
        duration: "6 Weeks",
        level: "Intermediate",
        icon: "fa-brands fa-react"
    },
    {
        id: "professional-communication",
        name: "Professional Communication",
        category: "business",
        description: "Communication, presentations, teamwork and workplace skills.",
        lessons: 36,
        duration: "6 Weeks",
        level: "Beginner",
        icon: "fa-comments"
    }
];

window.__MAMRAJ_COURSE_CATALOG = COURSE_CATALOG;
const COURSE_ALIASES = {
    "web-development": ["web-development", "full-stack-web-development"],
    "data-analytics": ["data-analytics", "data-analytics-course"],
    "human-resource-management-ai": [
        "human-resource-management-ai",
        "hr-management-ai",
        "human-resource-management"
    ],
    "ui-ux-design": ["ui-ux-design"],
    "react-development": ["react-development", "react"],
    "professional-communication": ["professional-communication"]
};

let currentUser = null;
let certificateState = new Map();
window.__MAMRAJ_CERTIFICATE_STATE = certificateState;

const qs = (selector, root = document) => root.querySelector(selector);

function getCourse(id) {
    return COURSE_CATALOG.find(course => course.id === id);
}

function getProgressPercent(data, course) {
    const completed = Array.isArray(data?.completedTopics)
        ? data.completedTopics.length
        : 0;

    if (!course?.lessons) return 0;

    return Math.min(
        100,
        Math.round((completed / course.lessons) * 100)
    );
}

async function readCourseProgress(uid, course) {
    for (const alias of (COURSE_ALIASES[course.id] || [course.id])) {
        try {
            const snap = await getDoc(
                doc(db, "users", uid, "courseProgress", alias)
            );

            if (snap.exists()) {
                return snap.data();
            }
        } catch (error) {
            console.warn("Progress read failed:", course.id, error);
        }
    }

    return {};
}

async function readCertificate(uid, course) {

    if (!currentUser) {
        return {
            exists: false,
            eligible: false,
            paymentVerified: false
        };
    }

    try {

        const token =
            await currentUser.getIdToken();

        const certificateId =
            course.certificateId;

        const response =
            await fetch(
                "/api/certificate?id=" +
                encodeURIComponent(certificateId),
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        if (!response.ok) {
            return {
                exists: false,
                eligible: false,
                paymentVerified: false
            };
        }

        const data =
            await response.json();

        return {
            exists: true,
            ...data,

            eligible:
                data.eligible === true,

            paymentVerified:
                data.paymentVerified === true,

            paid:
                data.paymentVerified === true
        };

    } catch (error) {

        console.warn(
            "Certificate API read failed:",
            course.id,
            error
        );

        return {
            exists: false,
            eligible: false,
            paymentVerified: false
        };
    }
}

function updateProfile(user) {
    const name = user.displayName || "Student";
    const initials = name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0])
        .join("")
        .toUpperCase() || "ST";

    const avatar = qs(".profile-avatar");
    const profileName = qs(".profile-info strong");

    if (avatar) avatar.textContent = initials;
    if (profileName) profileName.textContent = name;
}

function updateStats() {
    let earned = 0;
    let progress = 0;

    certificateState.forEach(item => {
        if (item.earned) earned++;
        else if (item.percent > 0) progress++;
    });

    const available = Math.max(
        0,
        COURSE_CATALOG.length - earned - progress
    );

    const statCards = document.querySelectorAll(".stat-card");

    if (statCards[0]) {
        const value = statCards[0].querySelector("strong");
        if (value) value.textContent = String(earned).padStart(2, "0");
    }

    if (statCards[1]) {
        const value = statCards[1].querySelector("strong");
        if (value) value.textContent = String(progress).padStart(2, "0");
    }

    if (statCards[2]) {
        const value = statCards[2].querySelector("strong");
        if (value) value.textContent = String(available).padStart(2, "0");
    }

    const completionValues = [...certificateState.values()]
        .map(item => item.percent);

    const average = completionValues.length
        ? Math.round(
            completionValues.reduce((a, b) => a + b, 0) /
            completionValues.length
        )
        : 0;

    if (statCards[3]) {
        const value = statCards[3].querySelector("strong");
        if (value) value.textContent = `${average}%`;
    }

    const heroCount = qs(".hero-badge strong");
    if (heroCount) heroCount.textContent = earned;
}

function buildCertificateCard(course, state) {
    const card = document.createElement("article");
    card.className = "certificate-card";
    card.dataset.status = state.earned
        ? "earned"
        : state.percent > 0
            ? "progress"
            : "available";
    card.dataset.category = course.category;
    card.dataset.name = course.name;

    const statusHTML = state.earned
        ? `<span class="verified"><i class="fa-solid fa-circle-check"></i> VERIFIED</span>`
        : state.percent > 0
            ? `<span class="progress-label">IN PROGRESS</span>`
            : `<span class="available-label">AVAILABLE</span>`;

    const iconClass = course.icon.startsWith("fa-brands")
        ? course.icon
        : `fa-solid ${course.icon}`;

    const earnedDate = state.certificate?.issuedAt
        ? new Date(state.certificate.issuedAt).toLocaleDateString(
            "en-IN",
            { month: "short", year: "numeric" }
        )
        : "";

    const actionHTML = state.earned
        ? `
            <div class="certificate-id">
                <span>Certificate ID</span>
                <strong>${state.certificate.certificateId || course.certificateId}</strong>
            </div>

            <div class="card-actions">

                <button
                    class="view-btn"
                    onclick="viewCertificate(this)">
                    <i class="fa-regular fa-eye"></i>
                    View
                </button>

                <button
                    class="download-btn"
                    onclick="downloadCertificate(this)">
                    <i class="fa-solid fa-download"></i>
                    Download
                </button>

            </div>
        `
        : state.eligible
            ? `
                <div class="certificate-payment">
                    <span>
                        Certificate Fee
                    </span>

                    <strong>
                        ₹49
                    </strong>
                </div>

                <button
                    class="start-btn certificate-pay-btn"
                    onclick="payCertificate(this)">

                    <i class="fa-solid fa-lock-open"></i>
                    Pay ₹49 & Unlock

                </button>
            `
            : state.percent > 0
                ? `
                    <div class="course-progress">

                        <div>
                            <span>
                                Course Progress
                            </span>

                            <strong>
                                ${state.percent}%
                            </strong>
                        </div>

                        <div class="progress-bar">
                            <span
                                style="width:${state.percent}%">
                            </span>
                        </div>

                    </div>

                    <button
                        class="continue-btn"
                        onclick="openCourse('${course.id}')">

                        Continue Learning

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>
                `
                : `
                    <div class="course-info">

                        <span>
                            <i class="fa-solid fa-book"></i>
                            ${course.lessons} Lessons
                        </span>

                        <span>
                            <i class="fa-solid fa-signal"></i>
                            ${course.level}
                        </span>

                    </div>

                    <button
                        class="start-btn"
                        onclick="openCourse('${course.id}')">

                        Start Certification

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>
                `;

    card.innerHTML = `
        <div class="certificate-cover ${course.category}">
            <div class="cover-top">
                ${statusHTML}
                <i class="${iconClass}"></i>
            </div>
            <div class="certificate-symbol">N</div>
            <span class="cover-title">MamRaj Nexus Academy</span>
            <strong>${course.name}</strong>
        </div>

        <div class="certificate-body">
            <div class="card-meta">
                <span class="category">${course.category}</span>
                <span class="earned-date">
                    <i class="fa-regular fa-calendar"></i>
                    ${state.earned ? earnedDate : course.duration}
                </span>
            </div>

            <h3>${course.name}</h3>
            <p>${course.description}</p>
            ${actionHTML}
        </div>
    `;

    return card;
}

function renderCertificates() {
    const grid = qs("#certificateGrid");
    if (!grid) return;

    grid.innerHTML = "";

    COURSE_CATALOG.forEach(course => {
        const state = certificateState.get(course.id) || {
            percent: 0,
            earned: false,
            certificate: null
        };

        grid.appendChild(
            buildCertificateCard(course, state)
        );
    });

    updateStats();

    // Re-run the existing filters from certifications.js.
    const input = qs("#searchInput");
    if (input) input.dispatchEvent(new Event("input"));
}

async function loadStudentCertificates() {
    if (!currentUser) return;

    certificateState.clear();

    // Firebase reads are parallel so the certifications page loads faster.
    await Promise.all(
        COURSE_CATALOG.map(async course => {
            const [progress, certificate] = await Promise.all([
                readCourseProgress(currentUser.uid, course),
                readCertificate(currentUser.uid, course)
            ]);

            const percent = getProgressPercent(progress, course);
            const eligible =
                percent >= 100 ||
                certificate.eligible === true;

            const earned =
                certificate.paymentVerified === true;

            certificateState.set(course.id, {
                percent,
                eligible,
                earned,
                certificate
            });
        })
    );

    renderCertificates();
}

window.openCourse = function(courseId) {
    window.location.href =
        `course.html?course=${encodeURIComponent(courseId)}`;
};

window.viewCertificate = function(button) {

    const card =
        button?.closest(".certificate-card");

    const courseName =
        card?.dataset.name ||
        window.__activeCertificate?.course?.name;

    const course =
        COURSE_CATALOG.find(
            item =>
                item.name.toLowerCase() ===
                String(courseName || "").toLowerCase()
        );

    if (!course) {
        alert("Certificate information not found.");
        return;
    }

    const state =
        certificateState.get(course.id);

    if (!state?.earned) {
        alert(
            state?.eligible
                ? "Please pay ₹49 to unlock this certificate."
                : "Complete the course first."
        );
        return;
    }

    const cert =
        state.certificate || {};

    const nameElement =
        qs("#modalCertificateName");

    const idElement =
        qs("#modalCertificateId");

    if (nameElement) {
        nameElement.textContent =
            course.name;
    }

    if (idElement) {
        idElement.textContent =
            cert.certificateId ||
            course.certificateId ||
            "Verified";
    }

    const modal =
        qs("#certificateModal");

    if (modal) {
        modal.classList.add("show");
    }

    window.__activeCertificate = {
        course,
        certificate: cert
    };
};


/* =========================================================
   RAZORPAY ₹49 PAYMENT
========================================================= */

window.payCertificate = async function(button) {

    const card =
        button?.closest(".certificate-card");

    if (!card) return;

    const courseName =
        card.dataset.name || "";

    const course =
        COURSE_CATALOG.find(
            item =>
                item.name.toLowerCase() ===
                courseName.toLowerCase()
        );

    if (!course) {
        alert(
            "Certificate information not found."
        );
        return;
    }

    const state =
        certificateState.get(course.id);

    if (!state?.eligible) {
        alert(
            "Complete the course 100% before purchasing the certificate."
        );
        return;
    }

    if (state?.earned) {
        await downloadCertificate(button);
        return;
    }

    if (!currentUser) {
        alert(
            "Please sign in with Google first."
        );
        return;
    }

    if (
        typeof Razorpay === "undefined"
    ) {
        alert(
            "Razorpay Checkout could not load. Please refresh the page."
        );
        return;
    }

    const certificateId =
        state.certificate?.certificateId ||
        course.certificateId;

    if (!certificateId) {
        alert(
            "Certificate ID is not available."
        );
        return;
    }

    try {

        button.disabled = true;

        const originalText =
            button.innerHTML;

        button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Preparing...';

        const token =
            await currentUser.getIdToken(true);

        /*
         * Backend creates the ₹49 order.
         * Browser cannot control the price.
         */
        const orderResponse =
            await fetch(
                "/api/certificate/order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body: JSON.stringify({
                        certificateId
                    })
                }
            );

        const order =
            await orderResponse.json();

        if (!orderResponse.ok) {
            throw new Error(
                order.error ||
                "Unable to create Razorpay order."
            );
        }

        const options = {

            key:
                "rzp_live_TU2OjmbLj29LxV",

            amount:
                order.amount,

            currency:
                order.currency || "INR",

            name:
                "MamRaj Nexus Academy",

            description:
                "Certificate Unlock — " +
                course.name,

            order_id:
                order.id,

            prefill: {
                name:
                    currentUser.displayName ||
                    "",

                email:
                    currentUser.email ||
                    ""
            },

            theme: {
                color:
                    "#263a7a"
            },

            handler:
                async function(
                    paymentResponse
                ) {

                    button.innerHTML =
                        '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';

                    try {

                        const freshToken =
                            await currentUser
                                .getIdToken(true);

                        const verifyResponse =
                            await fetch(
                                "/api/certificate/verify",
                                {
                                    method:
                                        "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json",

                                        "Authorization":
                                            "Bearer " +
                                            freshToken
                                    },

                                    body:
                                        JSON.stringify({

                                            certificateId,

                                            razorpay_order_id:
                                                paymentResponse
                                                    .razorpay_order_id,

                                            razorpay_payment_id:
                                                paymentResponse
                                                    .razorpay_payment_id,

                                            razorpay_signature:
                                                paymentResponse
                                                    .razorpay_signature
                                        })
                                }
                            );

                        const result =
                            await verifyResponse
                                .json();

                        if (
                            !verifyResponse.ok ||
                            result.verified !== true
                        ) {
                            throw new Error(
                                result.error ||
                                "Payment verification failed."
                            );
                        }

                        const updatedState =
                            certificateState.get(
                                course.id
                            ) || {};

                        updatedState.earned =
                            true;

                        updatedState.eligible =
                            true;

                        updatedState.certificate =
                            {
                                ...(updatedState.certificate || {}),

                                certificateId,

                                paymentVerified:
                                    true
                            };

                        certificateState.set(
                            course.id,
                            updatedState
                        );

                        renderCertificates();
                        applyFilters();

                        alert(
                            "✓ Payment verified. Certificate unlocked."
                        );

                        const freshCard =
                            [...document.querySelectorAll(
                                ".certificate-card"
                            )]
                            .find(
                                item =>
                                    item.dataset.name ===
                                    course.name
                            );

                        if (freshCard) {
                            const downloadBtn =
                                freshCard.querySelector(
                                    ".download-btn"
                                );

                            if (downloadBtn) {
                                await downloadCertificate(
                                    downloadBtn
                                );
                            }
                        }

                    } catch (error) {

                        console.error(
                            "Certificate payment verification error:",
                            error
                        );

                        alert(
                            error.message
                        );

                        button.disabled =
                            false;

                        button.innerHTML =
                            originalText;
                    }
                },

            modal: {

                ondismiss:
                    function() {

                        button.disabled =
                            false;

                        button.innerHTML =
                            originalText;
                    }
            }
        };

        const razorpay =
            new Razorpay(options);

        razorpay.on(
            "payment.failed",
            function() {

                button.disabled =
                    false;

                button.innerHTML =
                    originalText;

                alert(
                    "Payment failed. Please try again."
                );
            }
        );

        razorpay.open();

    } catch (error) {

        console.error(
            "Razorpay certificate error:",
            error
        );

        alert(
            error.message
        );

        button.disabled =
            false;

        button.innerHTML =
            originalText ||
            "Pay ₹49 & Unlock";
    }
};


/* =========================================================
   REAL SECURE PDF DOWNLOAD
========================================================= */

window.downloadCertificate = async function(button) {

    let course = null;

    const card =
        button?.closest(
            ".certificate-card"
        );

    if (card) {

        const courseName =
            card.dataset.name || "";

        course =
            COURSE_CATALOG.find(
                item =>
                    item.name.toLowerCase() ===
                    courseName.toLowerCase()
            );
    }

    if (
        !course &&
        window.__activeCertificate?.course
    ) {
        course =
            window.__activeCertificate.course;
    }

    if (!course) {
        alert(
            "Certificate information not found."
        );
        return;
    }

    const state =
        certificateState.get(
            course.id
        );

    if (!state?.earned) {

        alert(
            state?.eligible
                ? "Please pay ₹49 to unlock the certificate."
                : "Complete the course first."
        );

        return;
    }

    const certificateId =
        state.certificate?.certificateId ||
        course.certificateId;

    if (!certificateId) {
        alert(
            "Certificate ID not found."
        );
        return;
    }

    if (!currentUser) {
        alert(
            "Please sign in with Google first."
        );
        return;
    }

    try {

        if (button) {
            button.disabled = true;
            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        }

        const token =
            await currentUser
                .getIdToken(true);

        const response =
            await fetch(
                "/api/certificate/pdf?id=" +
                encodeURIComponent(
                    certificateId
                ),
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        if (!response.ok) {

            const error =
                await response
                    .json()
                    .catch(
                        () => ({})
                    );

            throw new Error(
                error.error ||
                "Certificate PDF generation failed."
            );
        }

        const blob =
            await response.blob();

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            url;

        link.download =
            certificateId +
            ".pdf";

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );

    } catch (error) {

        console.error(
            "Certificate PDF error:",
            error
        );

        alert(
            error.message
        );

    } finally {

        if (button) {

            button.disabled =
                false;

            button.innerHTML =
                '<i class="fa-solid fa-download"></i> Download';
        }
    }
};


const originalCloseCertificate =
    window.closeCertificate;

window.closeCertificate =
    function() {

        if (
            typeof originalCloseCertificate ===
            "function"
        ) {
            originalCloseCertificate();
            return;
        }

        const modal =
            qs("#certificateModal");

        if (modal) {
            modal.classList.remove(
                "show"
            );
        }
    };


onAuthStateChanged(
    auth,
    async user => {

        currentUser = user;

        if (!user) {

            const profileName =
                qs(".profile-info strong");

            const profileRole =
                qs(".profile-info span");

            const avatar =
                qs(".profile-avatar");

            if (profileName)
                profileName.textContent =
                    "Please sign in";

            if (profileRole)
                profileRole.textContent =
                    "Student";

            if (avatar)
                avatar.textContent =
                    "ST";

            certificateState.clear();

            renderCertificates();

            return;
        }

        updateProfile(user);

        try {

            await loadStudentCertificates();

        } catch (error) {

            console.error(
                "Certification system error:",
                error
            );
        }
    }
);

/* =========================================================
   FINAL UI LAYER
========================================================= */

let currentTab = "all";

function applyFilters() {

    const searchInput =
        qs("#searchInput");

    const categoryFilter =
        qs("#categoryFilter");

    const emptyState =
        qs("#emptyState");

    const search =
        (searchInput?.value || "")
            .toLowerCase()
            .trim();

    const category =
        categoryFilter?.value ||
        "all";

    let visible = 0;

    document
        .querySelectorAll(
            ".certificate-card"
        )
        .forEach(card => {

            const status =
                card.dataset.status ||
                "available";

            const cardCategory =
                card.dataset.category ||
                "all";

            const name =
                (card.dataset.name || "")
                    .toLowerCase();

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

            card.style.display =
                show ? "" : "none";

            if (show) visible++;
        });

    if (emptyState) {
        emptyState.style.display =
            visible === 0
                ? "block"
                : "none";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .querySelectorAll(".tab")
            .forEach(tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".tab"
                            )
                            .forEach(
                                item =>
                                    item.classList
                                        .remove(
                                            "active"
                                        )
                            );

                        tab.classList.add(
                            "active"
                        );

                        currentTab =
                            tab.dataset.tab ||
                            tab.dataset.filter ||
                            "all";

                        applyFilters();
                    }
                );
            });

        qs("#searchInput")?.addEventListener(
            "input",
            applyFilters
        );

        qs("#categoryFilter")?.addEventListener(
            "change",
            applyFilters
        );

        qs("#themeToggle")?.addEventListener(
            "click",
            () => {
                document.body.classList.toggle(
                    "dark-preview"
                );
            }
        );

        const grid =
            qs("#certificateGrid");

        if (grid) {

            const observer =
                new MutationObserver(
                    () => {
                        applyFilters();
                    }
                );

            observer.observe(
                grid,
                {
                    childList: true,
                    subtree: true
                }
            );
        }

        applyFilters();
    }
);

window.scrollToAvailable =
    function() {

        const section =
            qs("#availableSection");

        section?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal-overlay"
            )
        ) {
            window.closeCertificate();
        }
    }
);

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            window.closeCertificate();
        }
    }
);
