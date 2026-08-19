await setDoc(
    doc(db, "users", user.uid),
    {
        uid: user.uid,
        name: user.displayName || "Student",
        email: user.email || "",
        photoURL: user.photoURL || "",
        role: "student",
        provider: "google",
        lastLoginAt: serverTimestamp()
    },
    {
        merge: true
    }
);
