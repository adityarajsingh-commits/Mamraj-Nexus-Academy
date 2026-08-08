document.addEventListener("DOMContentLoaded", () => {

    const input =
        document.getElementById("messageInput");

    const sendBtn =
        document.getElementById("sendMessage");

    const messages =
        document.getElementById("chatMessages");

    const newChat =
        document.getElementById("newChat");

    const quickPrompts =
        document.querySelectorAll(
            ".quick-prompts button"
        );


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    function sendMessage(text = null) {

        const message =
            text || input.value.trim();

        if (!message) return;


        /* USER MESSAGE */

        const userMessage =
            document.createElement("div");

        userMessage.className =
            "message user-message";

        userMessage.innerHTML = `

            <div class="message-avatar">
                <i class="fa-solid fa-user"></i>
            </div>

            <div class="message-content">

                <div class="message-bubble">
                    ${escapeHTML(message)}
                </div>

            </div>

        `;

        messages.appendChild(userMessage);

        input.value = "";

        input.style.height = "auto";

        scrollBottom();


        /* TYPING */

        const typing =
            document.createElement("div");

        typing.className =
            "message ai-message typing-message";

        typing.innerHTML = `

            <div class="message-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>

            <div class="message-content">

                <div class="message-name">
                    Shivaay AI
                </div>

                <div class="message-bubble">

                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>

                </div>

            </div>

        `;

        messages.appendChild(typing);

        scrollBottom();


        /* DEMO AI RESPONSE */

        setTimeout(() => {

            typing.remove();

            addAIResponse(message);

        }, 1000);

    }


    /* =====================================================
       AI RESPONSE
    ===================================================== */

    function addAIResponse(question) {

        let response =
            "That's a great question. I can help you create a practical step-by-step plan for it. Tell me more about your current skills and goal.";

        const lower =
            question.toLowerCase();


        if (lower.includes("resume")) {

            response =
                "Absolutely. I can help improve your resume by making it ATS-friendly, highlighting measurable achievements, improving your project descriptions and aligning your skills with the role you're targeting.";

        }

        else if (
            lower.includes("project") ||
            lower.includes("projects")
        ) {

            response =
                "Based on your learning journey, I recommend building a real-world project that solves an actual problem. Start with a clear problem statement, build the MVP, deploy it and then add it to your portfolio.";

        }

        else if (
            lower.includes("career") ||
            lower.includes("roadmap")
        ) {

            response =
                "Let's build your roadmap in four stages: strengthen fundamentals, build 2–3 strong projects, gain practical internship experience, and prepare your resume plus interview skills.";

        }

        else if (
            lower.includes("interview")
        ) {

            response =
                "For interview preparation, focus on three areas: technical fundamentals, project-based questions and communication. I can also conduct a mock interview with you question-by-question.";

        }

        else if (
            lower.includes("internship")
        ) {

            response =
                "For internships, focus on roles matching your current skills rather than applying randomly. A strong portfolio, targeted resume and consistent applications will improve your chances.";

        }


        const aiMessage =
            document.createElement("div");

        aiMessage.className =
            "message ai-message";

        aiMessage.innerHTML = `

            <div class="message-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>

            <div class="message-content">

                <div class="message-name">
                    Shivaay AI
                </div>

                <div class="message-bubble">
                    ${response}
                </div>

            </div>

        `;

        messages.appendChild(aiMessage);

        scrollBottom();

    }


    /* =====================================================
       QUICK PROMPTS
    ===================================================== */

    quickPrompts.forEach(button => {

        button.addEventListener("click", () => {

            sendMessage(
                button.dataset.prompt
            );

        });

    });


    /* =====================================================
       SEND BUTTON
    ===================================================== */

    sendBtn.addEventListener(
        "click",
        () => sendMessage()
    );


    /* =====================================================
       ENTER TO SEND
    ===================================================== */

    input.addEventListener("keydown", event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    });


    /* =====================================================
       AUTO RESIZE
    ===================================================== */

    input.addEventListener("input", () => {

        input.style.height = "auto";

        input.style.height =
            Math.min(
                input.scrollHeight,
                100
            ) + "px";

    });


    /* =====================================================
       NEW CHAT
    ===================================================== */

    newChat.addEventListener("click", () => {

        const oldMessages =
            messages.querySelectorAll(
                ".message, .quick-prompts"
            );

        oldMessages.forEach(
            element => element.remove()
        );

        input.value = "";

        const welcome =
            document.createElement("div");

        welcome.className =
            "message ai-message";

        welcome.innerHTML = `

            <div class="message-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>

            <div class="message-content">

                <div class="message-name">
                    Shivaay AI
                </div>

                <div class="message-bubble">
                    New conversation started.
                    How can I help you with your career today?
                </div>

            </div>

        `;

        messages.appendChild(welcome);

    });


    /* =====================================================
       THEME BUTTON
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


    /* =====================================================
       HELPERS
    ===================================================== */

    function scrollBottom() {

        messages.scrollTo({
            top: messages.scrollHeight,
            behavior: "smooth"
        });

    }


    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

});
