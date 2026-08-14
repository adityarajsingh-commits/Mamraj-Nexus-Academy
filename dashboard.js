import {
    doc,
    onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const auth = window.firebaseAuth;
const db = window.firebaseDB;


/* =========================================
   AUTHENTICATION
========================================= */

auth.onAuthStateChanged(user => {

    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    console.log(
        "Dashboard user:",
        user.uid
    );


    loadStudentDashboard(user.uid);

});


/* =========================================
   LOAD DASHBOARD
========================================= */

function loadStudentDashboard(uid) {

    const userRef =
        doc(
            db,
            "users",
            uid
        );


    onSnapshot(
        userRef,

        snapshot => {

            if (!snapshot.exists()) {

                console.log(
                    "Student profile not found"
                );

                return;

            }


            const data =
                snapshot.data();


            updateDashboard(data);

        },

        error => {

            console.error(
                "Dashboard error:",
                error
            );

        }

    );

}


/* =========================================
   UPDATE DASHBOARD
========================================= */

function updateDashboard(data) {


    /* NAME */

    const name =
        data.name ||
        "Student";


    const nameElement =
        document.getElementById(
            "studentName"
        );


    if (nameElement) {

        nameElement.textContent =
            name;

    }


    /* ROLE */

    const roleElement =
        document.getElementById(
            "studentRole"
        );


    if (roleElement) {

        roleElement.textContent =
            data.role ||
            "Student";

    }


    /* COURSES */

    setValue(
        "courseCount",
        data.courseCount || 0
    );


    /* LEARNING HOURS */

    setValue(
        "learningHours",
        data.learningHours || 0
    );


    /* COMPLETED LESSONS */

    setValue(
        "completedLessons",
        data.completedLessons || 0
    );


    /* CERTIFICATES */

    setValue(
        "certificateCount",
        data.certificates || 0
    );


    /* STREAK */

    setValue(
        "streakCount",
        data.streak || 0
    );

}


/* =========================================
   SAFE VALUE UPDATE
========================================= */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element)
        return;


    animateNumber(
        element,
        Number(value)
    );

}


/* =========================================
   NUMBER ANIMATION
========================================= */

function animateNumber(
    element,
    target
) {

    const duration =
        900;

    const start =
        Number(
            element.dataset.value || 0
        );


    const startTime =
        performance.now();


    function update(time) {

        const progress =
            Math.min(
                (time - startTime) /
                duration,
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
            (target - start) *
            eased;


        element.textContent =
            Number.isInteger(target)
                ? Math.floor(value)
                : value.toFixed(1);


        if (progress < 1) {

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
