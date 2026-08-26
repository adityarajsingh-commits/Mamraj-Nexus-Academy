import {
    collection,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    auth,
    db
} from "./firebase.js";


/* =====================================================
   GLOBAL
===================================================== */

let currentUser = null;

let userUnsubscribe = null;
let courseUnsubscribe = null;
let certificateUnsubscribe = null;
let projectUnsubscribe = null;

let dashboardData = {
    courses: [],
    certificates: [],
    projects: []
};


/* =====================================================
   HELPERS
===================================================== */

function $(id) {
    return document.getElementById(id);
}


/* =====================================================
   AUTHENTICATION
===================================================== */

auth.onAuthStateChanged(user => {

    currentUser = user;

    if (!user) {

        window.location.href = "login.html";

        return;
    }

    window.__MAMRAJ_CURRENT_USER = user;

    updateProfile(user);

    startDashboard(user.uid);

});


/* =====================================================
   PROFILE
===================================================== */

function updateProfile(user) {

    const name =
        user.displayName ||
        "Student";

    const email =
        user.email ||
        "";

    const initials =
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word[0])
            .join("")
            .toUpperCase() || "ST";


    if ($("name")) {
        $("name").textContent = name;
    }


    if ($("studentName")) {
        $("studentName").textContent = name;
    }


    if ($("profileEmail")) {
        $("profileEmail").textContent = email;
    }


    if ($("avatar")) {
        $("avatar").textContent = initials;
    }


    /*
       Google profile photo
    */

    if (user.photoURL) {

        const avatarImage =
            $("avatarImage");

        if (avatarImage) {

            avatarImage.src =
                user.photoURL;

            avatarImage.style.display =
                "block";

            if ($("avatar")) {
                $("avatar").style.display =
                    "none";
            }
        }
    }

}


/* =====================================================
   START FIRESTORE LISTENERS
===================================================== */

function startDashboard(uid) {

    cleanupListeners();


    /* ================================================
       USER PROFILE
    ================================================ */

    userUnsubscribe =
        onSnapshot(

            doc(
                db,
                "users",
                uid
            ),

            snapshot => {

                const data =
                    snapshot.exists()
                        ? snapshot.data()
                        : {};

                updateUserStats(data);

            },

            error => {

                console.error(
                    "User data error:",
                    error
                );

            }
        );


    /* ================================================
       COURSES
    ================================================ */

    courseUnsubscribe =
        onSnapshot(

            collection(
                db,
                "users",
                uid,
                "courses"
            ),

            snapshot => {

                dashboardData.courses =
                    snapshot.docs.map(
                        item => ({
                            id: item.id,
                            ...item.data()
                        })
                    );


                updateCourseStats();

                updateContinueLearning();

                updateSearch();

            },

            error => {

                console.warn(
                    "Courses listener:",
                    error
                );

            }
        );


    /* ================================================
       CERTIFICATES
    ================================================ */

    certificateUnsubscribe =
        onSnapshot(

            collection(
                db,
                "users",
                uid,
                "certificates"
            ),

            snapshot => {

                dashboardData.certificates =
                    snapshot.docs.map(
                        item => ({
                            id: item.id,
                            ...item.data()
                        })
                    );


                updateCertificateStats();

                updateSearch();

            },

            error => {

                console.warn(
                    "Certificate listener:",
                    error
                );

            }
        );


    /* ================================================
       PROJECTS
    ================================================ */

    projectUnsubscribe =
        onSnapshot(

            collection(
                db,
                "users",
                uid,
                "projects"
            ),

            snapshot => {

                dashboardData.projects =
                    snapshot.docs.map(
                        item => ({
                            id: item.id,
                            ...item.data()
                        })
                    );


                updateProjectStats();

                updateSearch();

            },

            error => {

                console.warn(
                    "Project listener:",
                    error
                );

            }
        );

}


/* =====================================================
   CLEANUP
===================================================== */

function cleanupListeners() {

    [
        userUnsubscribe,
        courseUnsubscribe,
        certificateUnsubscribe,
        projectUnsubscribe

    ].forEach(unsubscribe => {

        if (
            typeof unsubscribe ===
            "function"
        ) {

            unsubscribe();

        }

    });

}


/* =====================================================
   USER STATS
===================================================== */

function updateUserStats(data) {

    const courseCount =
        data.courseCount ??
        data.enrolledCourses ??
        dashboardData.courses.length ??
        0;


    const learningHours =
        data.learningHours ??
        data.totalLearningHours ??
        0;


    const completedLessons =
        data.completedLessons ??
        data.lessonsCompleted ??
        0;


    const certificates =
        data.certificates ??
        dashboardData.certificates.filter(
            certificate =>
                certificate.paymentVerified === true ||
                certificate.earned === true ||
                certificate.status === "earned"
        ).length;


    const streak =
        data.streak ??
        data.currentStreak ??
        0;


    setValue(
        "courseCount",
        courseCount
    );


    setValue(
        "learningHours",
        learningHours
    );


    setValue(
        "completedLessons",
        completedLessons
    );


    setValue(
        "certificateCount",
        certificates
    );


    setValue(
        "streakCount",
        streak
    );

}


/* =====================================================
   COURSE STATS
===================================================== */

function updateCourseStats() {

    const courses =
        dashboardData.courses;


    if (!courses.length) {

        return;

    }


    const totalCourses =
        courses.length;


    const completedCourses =
        courses.filter(
            course =>
                course.completed === true ||
                course.status === "completed" ||
                Number(
                    course.progress ??
                    course.progressPercent ??
                    0
                ) >= 100
        ).length;


    const completedLessons =
        courses.reduce(
            (total, course) =>
                total +
                Number(
                    course.completedLessons ??
                    course.lessonsCompleted ??
                    0
                ),
            0
        );


    const learningHours =
        courses.reduce(
            (total, course) =>
                total +
                Number(
                    course.learningHours ??
                    course.hours ??
                    0
                ),
            0
        );


    setValue(
        "courseCount",
        totalCourses
    );


    if (completedLessons > 0) {

        setValue(
            "completedLessons",
            completedLessons
        );

    }


    if (learningHours > 0) {

        setValue(
            "learningHours",
            learningHours
        );

    }


    if ($("completedCourses")) {

        setValue(
            "completedCourses",
            completedCourses
        );

    }

}


/* =====================================================
   CERTIFICATE STATS
===================================================== */

function updateCertificateStats() {

    const earned =
        dashboardData.certificates.filter(
            certificate =>
                certificate.paymentVerified === true ||
                certificate.earned === true ||
                certificate.status === "earned"
        ).length;


    setValue(
        "certificateCount",
        earned
    );

}


/* =====================================================
   PROJECT STATS
===================================================== */

function updateProjectStats() {

    const projects =
        dashboardData.projects.length;


    setValue(
        "projectCount",
        projects
    );

}


/* =====================================================
   CONTINUE LEARNING
===================================================== */

function updateContinueLearning() {

    const courses =
        dashboardData.courses;


    if (!courses.length) {

        return;

    }


    /*
       Find incomplete course first
    */

    const course =
        courses.find(
            item =>
                item.completed !== true &&
                item.status !== "completed"
        ) ||
        courses[0];


    if (!course) {

        return;

    }


    const name =
        course.courseName ||
        course.name ||
        course.title ||
        "Continue Learning";


    const description =
        course.currentTopic ||
        course.lastTopic ||
        course.nextTopic ||
        "Continue from your last completed topic.";


    const progress =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    course.progress ??
                    course.progressPercent ??
                    0
                )
            )
        );


    const duration =
        course.duration ||
        course.durationText ||
        "Self paced";


    if ($("continueCourseName")) {

        $("continueCourseName")
            .textContent = name;

    }


    if ($("continueCourseDescription")) {

        $("continueCourseDescription")
            .textContent =
            description;

    }


    if ($("continueProgress")) {

        $("continueProgress")
            .style.width =
            progress + "%";

    }


    if ($("continueProgressText")) {

        $("continueProgressText")
            .textContent =
            progress +
            "% completed";

    }


    if ($("continueDuration")) {

        $("continueDuration")
            .textContent =
            duration;

    }


    const button =
        $("continueCourseButton");


    if (button) {

        const courseId =
            course.courseId ||
            course.id ||
            "";


        button.onclick = () => {

            if (courseId) {

                window.location.href =
                    "course.html?course=" +
                    encodeURIComponent(
                        courseId
                    );

            } else {

                window.location.href =
                    "courses.html";

            }

        };

    }

}


/* =====================================================
   NUMBER
===================================================== */

function setValue(
    id,
    value
) {

    const element =
        $(id);


    if (!element) {

        return;

    }


    animateNumber(
        element,
        Number(value) || 0
    );

}


function animateNumber(
    element,
    target
) {

    const start =
        Number(
            element.dataset.value ||
            0
        );


    if (start === target) {

        element.textContent =
            Number.isInteger(target)
                ? target
                : target.toFixed(1);

        return;

    }


    const duration =
        650;


    const startTime =
        performance.now();


    function update(
        currentTime
    ) {

        const progress =
            Math.min(
                (
                    currentTime -
                    startTime
                ) / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const value =
            start +
            (
                target -
                start
            ) * eased;


        element.textContent =
            Number.isInteger(target)
                ? Math.floor(value)
                : value.toFixed(1);


        if (
            progress <
            1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }


    element.dataset.value =
        target;


    requestAnimationFrame(
        update
    );

}


/* =====================================================
   DASHBOARD SEARCH
===================================================== */

const searchInput =
    $("dashboardSearch");


if (searchInput) {

    searchInput.addEventListener(
        "input",
        updateSearch
    );

}


function updateSearch() {

    const results =
        $("dashboardSearchResults");


    if (!results) {

        return;

    }


    const query =
        (
            searchInput?.value ||
            ""
        )
            .toLowerCase()
            .trim();


    if (!query) {

        results.innerHTML = "";

        results.style.display =
            "none";

        return;

    }


    const items = [

        ...dashboardData.courses.map(
            course => ({
                type: "Course",
                name:
                    course.courseName ||
                    course.name ||
                    course.title ||
                    "Course",
                url: "courses.html"
            })
        ),

        ...dashboardData.projects.map(
            project => ({
                type: "Project",
                name:
                    project.name ||
                    project.title ||
                    "Project",
                url: "projects.html"
            })
        ),

        ...dashboardData.certificates.map(
            certificate => ({
                type: "Certificate",
                name:
                    certificate.courseName ||
                    certificate.name ||
                    "Certificate",
                url: "certifications.html"
            })
        ),

        {
            type: "Internships",
            name: "Explore Internships",
            url: "internship.html"
        },

        {
            type: "Skills",
            name: "Learning Path",
            url: "learning-path.html"
        }

    ];


    const filtered =
        items.filter(
            item =>
                item.name
                    .toLowerCase()
                    .includes(query)
        );


    if (!filtered.length) {

        results.innerHTML =
            `<div class="search-empty">
                No matching results
             </div>`;

    } else {

        results.innerHTML =
            filtered
                .slice(0, 6)
                .map(
                    item => `
                    <a
                        href="${item.url}"
                        class="search-result"
                    >
                        <small>
                            ${item.type}
                        </small>

                        <strong>
                            ${escapeHTML(
                                item.name
                            )}
                        </strong>
                    </a>
                    `
                )
                .join("");

    }


    results.style.display =
        "block";

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   THEME
===================================================== */

window.toggleDashboardTheme =
    function() {

        document.body.classList.toggle(
            "dark-preview"
        );

    };


/* =====================================================
   LOGOUT
===================================================== */

window.logoutStudent =
    async function() {

        try {

            const {
                signOut
            } =
                await import(
                    "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
                );


            await signOut(
                auth
            );


            window.location.href =
                "login.html";


        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };
