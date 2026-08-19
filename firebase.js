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

    apiKey: "AIzaSyA44Ou2bM7l7m-oay-pwv-4tdmn_S0f0BM",

    authDomain: "mamraj-web-studio-1d78b.firebaseapp.com",

    projectId: "mamraj-web-studio-1d78b",

    storageBucket: "mamraj-web-studio-1d78b",

    messagingSenderId: "229677264871",

    appId: "1:229677264871:web:cc3937a5733868e31c5742"

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
