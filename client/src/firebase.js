// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCqf5MuJa8CSb2lV3VMs4XFz1RTyuahUxU",
    authDomain: "orgapp-8538a.firebaseapp.com",
    projectId: "orgapp-8538a",
    storageBucket: "orgapp-8538a.firebasestorage.app",
    messagingSenderId: "206669337448",
    appId: "1:206669337448:web:6da18646cc27c6cc237cdd",
    measurementId: "G-68YNVFXK9M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup, GoogleAuthProvider, signOut, collection, addDoc, onSnapshot, query, orderBy };
