
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa3i-XiqYRcCMN5Hfn-XW-75YsEkdJ_xw",
  authDomain: "student-ad4c5.firebaseapp.com",
  databaseURL: "https://student-ad4c5-default-rtdb.firebaseio.com",
  projectId: "student-ad4c5",
  storageBucket: "student-ad4c5.firebasestorage.app",
  messagingSenderId: "882579023460",
  appId: "1:882579023460:web:84e439cdd34e7159f7a171",
  measurementId: "G-XEYZK3XMHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };