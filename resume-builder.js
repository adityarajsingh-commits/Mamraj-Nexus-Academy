const fields = {

    fullName: "previewName",
    jobTitle: "previewTitle",
    email: "previewEmail",
    phone: "previewPhone",
    location: "previewLocation",
    summary: "previewSummary",

    expRole: "previewRole",
    expCompany: "previewCompany",
    expDescription: "previewExperience",

    eduDegree: "previewDegree",
    eduInstitute: "previewInstitute",
    eduYear: "previewYear",

    projectName: "previewProject",
    projectDescription: "previewProjectDescription"

};


Object.entries(fields).forEach(([inputId, previewId]) => {

    const input =
        document.getElementById(inputId);

    const preview =
        document.getElementById(previewId);

    if (!input || !preview) return;


    input.addEventListener("input", () => {

        preview.textContent =
            input.value ||
            preview.dataset.default ||
            preview.textContent;

        updateProgress();

    });

});


/* SKILLS */

const skillInput =
    document.getElementById("skillInput");

const addSkill =
    document.getElementById("addSkill");

const skillList =
    document.getElementById("skillList");

const previewSkills =
    document.getElementById("previewSkills");


function createSkill(name) {

    const skill =
        document.createElement("span");

    skill.textContent = name;

    skill.title = "Click to remove";

    skill.addEventListener("click", () => {

        skill.remove();

        updatePreviewSkills();

        updateProgress();

    });

    skillList.appendChild(skill);

    updatePreviewSkills();

}


function updatePreviewSkills() {

    previewSkills.innerHTML = "";

    document
        .querySelectorAll("#skillList span")
        .forEach(skill => {

            const item =
                document.createElement("span");

            item.textContent =
                skill.textContent;

            previewSkills.appendChild(item);

        });

}


addSkill.addEventListener("click", () => {

    const value =
        skillInput.value.trim();

    if (!value) return;

    createSkill(value);

    skillInput.value = "";

    updateProgress();

});


skillInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        event.preventDefault();

        addSkill.click();

    }

});


/* INITIAL SKILLS */

document
    .querySelectorAll("#skillList span")
    .forEach(skill => {

        skill.addEventListener("click", () => {

            skill.remove();

            updatePreviewSkills();

        });

    });


updatePreviewSkills();


/* PROGRESS */

function updateProgress() {

    const inputs =
        document.querySelectorAll(
            ".builder-form input, .builder-form textarea"
        );

    let filled = 0;

    inputs.forEach(input => {

        if (input.value.trim()) {

            filled++;

        }

    });

    const percentage =
        Math.min(
            100,
            Math.max(
                20,
                Math.round(
                    (filled / inputs.length) * 100
                )
            )
        );


    document.getElementById(
        "progressFill"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "progressText"
    ).textContent =
        percentage + "%";

}


updateProgress();


/* SAVE */

document
    .getElementById("saveResume")
    .addEventListener("click", () => {

        const data = {};

        Object.keys(fields).forEach(id => {

            const element =
                document.getElementById(id);

            if (element) {

                data[id] = element.value;

            }

        });


        data.skills =
            [...document.querySelectorAll(
                "#skillList span"
            )].map(
                skill => skill.textContent
            );


        localStorage.setItem(
            "mamrajResume",
            JSON.stringify(data)
        );


        alert(
            "Resume saved successfully!"
        );

});


/* LOAD */

const saved =
    localStorage.getItem("mamrajResume");


if (saved) {

    try {

        const data =
            JSON.parse(saved);


        Object.keys(fields).forEach(id => {

            const input =
                document.getElementById(id);

            if (
                input &&
                data[id]
            ) {

                input.value =
                    data[id];

                input.dispatchEvent(
                    new Event("input")
                );

            }

        });


        if (Array.isArray(data.skills)) {

            data.skills.forEach(skill => {

                createSkill(skill);

            });

        }

    } catch (error) {

        console.log(
            "Resume data could not be loaded."
        );

    }

}


/* DOWNLOAD */

document
    .getElementById("downloadResume")
    .addEventListener("click", () => {

        window.print();

    });


/* THEME */

document
    .getElementById("themeBtn")
    .addEventListener("click", () => {

        document.body.classList.toggle(
            "dark-preview"
        );

    });
