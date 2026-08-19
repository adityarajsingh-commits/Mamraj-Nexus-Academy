// =====================================================
// MamRaj Nexus Academy
// Firebase Configuration
// =====================================================

import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey: "PASTE_YOUR_API_KEY",

    authDomain:
        "mamraj-web-studio-1d78b.firebaseapp.com",

    projectId:
        "mamraj-web-studio-1d78b",

    storageBucket:
        "mamraj-web-studio-1d78b.firebasestorage.app",

    messagingSenderId:
        "PASTE_YOUR_MESSAGING_SENDER_ID",

    appId:
        "PASTE_YOUR_APP_ID"
};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);


// =====================================================
// AUTHENTICATION
// =====================================================

const auth = getAuth(app);


// =====================================================
// GOOGLE AUTH PROVIDER
// =====================================================

const googleProvider =
    new GoogleAuthProvider();


// =====================================================
// FIRESTORE
// =====================================================

const db = getFirestore(app);


// =====================================================
// EXPORT
// =====================================================

export {
    app,
    auth,
    db,
    googleProvider
};
