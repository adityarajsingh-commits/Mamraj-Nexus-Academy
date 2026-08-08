const resumeFile =
    document.getElementById("resumeFile");

const uploadBox =
    document.getElementById("uploadBox");

const browseBtn =
    document.getElementById("browseBtn");

const selectedFile =
    document.getElementById("selectedFile");

const fileName =
    document.getElementById("fileName");


/* FILE UPLOAD */

browseBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    resumeFile.click();

});


uploadBox.addEventListener("click", () => {

    resumeFile.click();

});


resumeFile.addEventListener("change", () => {

    if (!resumeFile.files.length) return;

    showFile(resumeFile.files[0]);

});


function showFile(file) {

    const allowed =
        [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

    if (
        !allowed.includes(file.type) &&
        !/\.(pdf|doc|docx)$/i.test(file.name)
    ) {

        alert(
            "Please upload a PDF or DOC/DOCX resume."
        );

        resumeFile.value = "";

        return;

    }


    if (file.size > 5 * 1024 * 1024) {

        alert(
            "File size must be below 5 MB."
        );

        resumeFile.value = "";

        return;

    }


    fileName.textContent = file.name;

    selectedFile.style.display = "flex";

}


/* DRAG & DROP */

[
    "dragenter",
    "dragover"
].forEach(eventName => {

    uploadBox.addEventListener(
        eventName,
        e => {

            e.preventDefault();

            uploadBox.classList.add("dragging");

        }
    );

});


[
    "dragleave",
    "drop"
].forEach(eventName => {

    uploadBox.addEventListener(
        eventName,
        e => {

            e.preventDefault();

            uploadBox.classList.remove(
                "dragging"
            );

        }
    );

});


uploadBox.addEventListener("drop", e => {

    const files = e.dataTransfer.files;

    if (!files.length) return;

    resumeFile.files = files;

    showFile(files[0]);

});


/* JOB DESCRIPTION */

const jobDescription =
    document.getElementById(
        "jobDescription"
    );

const wordCount =
    document.getElementById(
        "wordCount"
    );


jobDescription.addEventListener(
    "input",
    updateWordCount
);


function updateWordCount() {

    const text =
        jobDescription.value.trim();

    if (!text) {

        wordCount.textContent =
            "0 words";

        return;

    }


    const words =
        text.split(/\s+/).length;

    wordCount.textContent =
        `${words} words`;

}


/* CLEAR */

document
    .getElementById("clearJob")
    .addEventListener("click", () => {

        jobDescription.value = "";

        updateWordCount();

    });


/* ANALYSIS */

const analyzeBtn =
    document.getElementById(
        "analyzeBtn"
    );

const results =
    document.getElementById(
        "results"
    );


analyzeBtn.addEventListener(
    "click",
    analyzeResume
);


function analyzeResume() {

    if (!resumeFile.files.length) {

        alert(
            "Please upload your resume first."
        );

        return;

    }


    if (
        !jobDescription.value.trim()
    ) {

        alert(
            "Please paste the job description."
        );

        return;

    }


    analyzeBtn.innerHTML =
        `<i class="fa-solid fa-spinner fa-spin"></i>
         Analyzing...`;

    analyzeBtn.disabled = true;


    setTimeout(() => {

        generateScore();

        results.classList.add("show");

        results.scrollIntoView({
            behavior: "smooth"
        });

        analyzeBtn.innerHTML =
            `<i class="fa-solid fa-wand-magic-sparkles"></i>
             Analyze Resume`;

        analyzeBtn.disabled = false;

    }, 1400);

}


/* DEMO */

document
    .getElementById("demoBtn")
    .addEventListener("click", () => {

        results.classList.add("show");

        generateScore();

        results.scrollIntoView({
            behavior: "smooth"
        });

    });


/* SCORE GENERATOR */

function generateScore() {

    const score =
        Math.floor(
            Math.random() * 16
        ) + 76;


    const keyword =
        Math.floor(
            Math.random() * 15
        ) + 78;


    const skills =
        Math.floor(
            Math.random() * 18
        ) + 70;


    const formatting =
        Math.floor(
            Math.random() * 7
        ) + 92;


    document.getElementById(
        "score"
    ).textContent = score;


    document.getElementById(
        "keywordScore"
    ).textContent =
        keyword + "%";


    document.getElementById(
        "skillsScore"
    ).textContent =
        skills + "%";


    document.getElementById(
        "formatScore"
    ).textContent =
        formatting + "%";


    setBar(
        "keywordBar",
        keyword
    );

    setBar(
        "skillsBar",
        skills
    );

    setBar(
        "formatBar",
        formatting
    );


    const progress =
        document.getElementById(
            "scoreProgress"
        );


    const circumference =
        314;


    const offset =
        circumference -
        (score / 100) *
        circumference;


    progress.style.strokeDashoffset =
        offset;


    const title =
        document.getElementById(
            "scoreTitle"
        );

    const message =
        document.getElementById(
            "scoreMessage"
        );


    if (score >= 85) {

        title.textContent =
            "Excellent Match";

        message.textContent =
            "Your resume is strongly aligned with the target role.";

    } else if (score >= 75) {

        title.textContent =
            "Good Match";

        message.textContent =
            "Your resume has a strong foundation, but a few improvements can increase your score.";

    } else {

        title.textContent =
            "Needs Improvement";

        message.textContent =
            "Your resume needs more role-specific optimization.";

    }

}


/* PROGRESS BARS */

function setBar(id, value) {

    document.getElementById(id)
        .style.width =
        value + "%";

}


/* THEME */

document
    .getElementById("themeBtn")
    .addEventListener("click", () => {

        document.body.classList.toggle(
            "dark-mode"
        );

    });


/* DOWNLOAD */

document
    .getElementById("downloadReport")
    .addEventListener("click", () => {

        window.print();

    });
