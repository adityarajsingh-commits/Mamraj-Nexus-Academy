/* ==========================================
   MamRaj Nexus Academy
   Internship Details JS
========================================== */

"use strict";

/* ==========================================
   INTERNSHIP CONFIG
========================================== */

const internship = {

    id: "mamraj-full-stack-developer-001",

    title: "Full Stack Developer Intern",

    company: "MamRaj Web Studio",

    location: "Remote",

    duration: "4 Months",

    stipend: 15000

};


/* ==========================================
   DOM
========================================== */

const saveButton =
    document.getElementById(
        "detailsSaveBtn"
    );

const applyButton =
    document.getElementById(
        "applyNowDetails"
    );

const modal =
    document.getElementById(
        "applyModal"
    );

const closeModal =
    document.getElementById(
        "closeApplyModal"
    );

const applicationForm =
    document.getElementById(
        "internshipApplicationForm"
    );

const resumeInput =
    document.getElementById(
        "applicantResume"
    );


/* ==========================================
   STORAGE
========================================== */

const SAVED_KEY =
    "mamraj_saved_internships";

const APPLICATION_KEY =
    "mamraj_applications";


function getSaved(){

    try {

        return JSON.parse(
            localStorage.getItem(
                SAVED_KEY
            )
        ) || [];

    } catch {

        return [];

    }

}


function setSaved(data){

    localStorage.setItem(
        SAVED_KEY,
        JSON.stringify(data)
    );

}


function getApplications(){

    try {

        return JSON.parse(
            localStorage.getItem(
                APPLICATION_KEY
            )
        ) || [];

    } catch {

        return [];

    }

}


function setApplications(data){

    localStorage.setItem(
        APPLICATION_KEY,
        JSON.stringify(data)
    );

}


/* ==========================================
   SAVE INTERNSHIP
========================================== */

function updateSaveButton(){

    if(!saveButton) return;

    const saved =
        getSaved();

    const isSaved =
        saved.includes(
            internship.id
        );

    if(isSaved){

        saveButton.classList.add(
            "saved"
        );

        saveButton.innerHTML = `
            <i class="fa-solid fa-bookmark"></i>
            Saved
        `;

    } else {

        saveButton.classList.remove(
            "saved"
        );

        saveButton.innerHTML = `
            <i class="fa-regular fa-bookmark"></i>
            Save
        `;

    }

}


if(saveButton){

    saveButton.addEventListener(
        "click",
        () => {

            let saved =
                getSaved();

            const index =
                saved.indexOf(
                    internship.id
                );

            if(index === -1){

                saved.push(
                    internship.id
                );

                setSaved(saved);

                showNotification(
                    "Internship saved successfully."
                );

            } else {

                saved.splice(
                    index,
                    1
                );

                setSaved(saved);

                showNotification(
                    "Internship removed from saved."
                );

            }

            updateSaveButton();

        }
    );

}


/* ==========================================
   CHECK APPLICATION
========================================== */

function alreadyApplied(){

    const applications =
        getApplications();

    return applications.some(
        application =>
            application.internshipId ===
            internship.id
    );

}


/* ==========================================
   OPEN APPLY MODAL
========================================== */

function openApplyModal(){

    if(!modal) return;

    if(alreadyApplied()){

        showNotification(
            "You have already applied for this internship."
        );

        return;

    }

    modal.classList.add(
        "show"
    );

    document.body.style.overflow =
        "hidden";

}


/* ==========================================
   CLOSE MODAL
========================================== */

function closeApplyModal(){

    if(!modal) return;

    modal.classList.remove(
        "show"
    );

    document.body.style.overflow =
        "";

}


if(applyButton){

    applyButton.addEventListener(
        "click",
        openApplyModal
    );

}


if(closeModal){

    closeModal.addEventListener(
        "click",
        closeApplyModal
    );

}


/* ==========================================
   CLOSE BY BACKDROP
========================================== */

if(modal){

    modal.addEventListener(
        "click",
        event => {

            if(
                event.target === modal
            ){

                closeApplyModal();

            }

        }
    );

}


/* ==========================================
   ESCAPE KEY
========================================== */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape"
        ){

            closeApplyModal();

        }

    }
);


/* ==========================================
   RESUME VALIDATION
========================================== */

if(resumeInput){

    resumeInput.addEventListener(
        "change",
        () => {

            const file =
                resumeInput.files[0];

            if(!file) return;

            const allowedTypes = [

                "application/pdf",

                "application/msword",

                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

            ];

            const maxSize =
                5 * 1024 * 1024;

            if(
                !allowedTypes.includes(
                    file.type
                )
            ){

                showNotification(
                    "Please upload a PDF or Word resume."
                );

                resumeInput.value =
                    "";

                return;

            }

            if(
                file.size > maxSize
            ){

                showNotification(
                    "Resume must be smaller than 5 MB."
                );

                resumeInput.value =
                    "";

                return;

            }

        }
    );

}


/* ==========================================
   FORM SUBMISSION
========================================== */

if(applicationForm){

    applicationForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const name =
                document.getElementById(
                    "applicantName"
                )?.value.trim();

            const email =
                document.getElementById(
                    "applicantEmail"
                )?.value.trim();

            const message =
                document.getElementById(
                    "applicantMessage"
                )?.value.trim();

            const resume =
                resumeInput?.files[0];


            if(!name){

                showNotification(
                    "Please enter your name."
                );

                return;

            }


            if(!email){

                showNotification(
                    "Please enter your email."
                );

                return;

            }


            if(!resume){

                showNotification(
                    "Please upload your resume."
                );

                return;

            }


            if(!message){

                showNotification(
                    "Please write a short message."
                );

                return;

            }


            if(alreadyApplied()){

                showNotification(
                    "Application already submitted."
                );

                closeApplyModal();

                return;

            }


            /* ==========================
               CREATE APPLICATION
            ========================== */

            const application = {

                id:
                    `APP-${Date.now()}`,

                internshipId:
                    internship.id,

                title:
                    internship.title,

                company:
                    internship.company,

                location:
                    internship.location,

                duration:
                    internship.duration,

                stipend:
                    internship.stipend,

                applicantName:
                    name,

                applicantEmail:
                    email,

                message:
                    message,

                resumeName:
                    resume.name,

                status:
                    "Applied",

                appliedAt:
                    new Date().toISOString(),

                progress:
                    25

            };


            const applications =
                getApplications();

            applications.push(
                application
            );

            setApplications(
                applications
            );


            /* ==========================
               SUCCESS
            ========================== */

            applicationForm.reset();

            closeApplyModal();

            showSuccessModal();

        }
    );

}


/* ==========================================
   SUCCESS MODAL
========================================== */

function showSuccessModal(){

    const success =
        document.createElement(
            "div"
        );

    success.className =
        "application-success";

    success.innerHTML = `

        <div class="success-card">

            <button
                class="success-close"
                aria-label="Close"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="success-icon">

                <i class="fa-solid fa-check"></i>

            </div>

            <h2>
                Application Submitted!
            </h2>

            <p>
                Your application for
                <strong>
                    ${internship.title}
                </strong>
                has been submitted successfully.
            </p>

            <div class="success-details">

                <span>
                    <i class="fa-solid fa-building"></i>
                    ${internship.company}
                </span>

                <span>
                    <i class="fa-solid fa-clock"></i>
                    ${internship.duration}
                </span>

            </div>

            <button
                class="view-applications"
                id="viewApplications"
            >
                View My Applications
            </button>

        </div>

    `;

    document.body.appendChild(
        success
    );


    success
        .querySelector(
            ".success-close"
        )
        .addEventListener(
            "click",
            () => success.remove()
        );


    success
        .querySelector(
            "#viewApplications"
        )
        .addEventListener(
            "click",
            () => {

                window.location.href =
                    "applications.html";

            }
        );

}


/* ==========================================
   NOTIFICATION
========================================== */

function showNotification(message){

    const existing =
        document.querySelector(
            ".details-notification"
        );

    if(existing){

        existing.remove();

    }


    const notification =
        document.createElement(
            "div"
        );

    notification.className =
        "details-notification";

    notification.innerHTML = `

        <i class="fa-solid fa-circle-info"></i>

        <span>
            ${message}
        </span>

    `;

    document.body.appendChild(
        notification
    );


    requestAnimationFrame(
        () => {

            notification.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        () => {

            notification.classList.remove(
                "show"
            );

            setTimeout(
                () => notification.remove(),
                300
            );

        },
        3000
    );

}


/* ==========================================
   PAGE INITIALIZATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateSaveButton();

        console.log(
            "Internship Details Module Loaded"
        );

        console.log(
            "Application status:",
            alreadyApplied()
                ? "Applied"
                : "Not Applied"
        );

    }
);
