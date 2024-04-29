import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore module
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB35sBy-RBiT43mwZZSj2yXL4Dp9lOVBpk",
    authDomain: "testi-72d43.firebaseapp.com",
    projectId: "testi-72d43",
    storageBucket: "testi-72d43.appspot.com",
    messagingSenderId: "1007251518748",
    appId: "1:1007251518748:web:4e4cc227e201bdc30ef6d9"
};

const firebaseApp = initializeApp(firebaseConfig);
console.log("Firebase initialized successfully!");
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp); // Initialize Firestore
const storage = getStorage(firebaseApp); // Initialize Storage

export { auth, db, storage };
