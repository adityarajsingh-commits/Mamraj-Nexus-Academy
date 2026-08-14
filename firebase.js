<script type="module">

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    onSnapshot
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_PROJECT.firebasestorage.app",

    messagingSenderId: "YOUR_SENDER_ID",

    appId: "YOUR_APP_ID"

};


const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


/* Make available to dashboard.js */

window.firebaseAuth = auth;
window.firebaseDB = db;

window.firebaseModules = {

    doc,
    onSnapshot

};


onAuthStateChanged(auth, user => {

    if (!user) {

        window.location.href =
            "login.html";

        return;

    }

    window.currentUser = user;

    console.log(
        "Logged in:",
        user.email
    );

});

</script>
