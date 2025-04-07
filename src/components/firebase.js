// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, getGoogleAnalyticsClientId } from "firebase/analytics";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSHjU7DgtcqFAN067UM1fj4J8h-2hqaUE",
  authDomain: "quizgame-dd714.firebaseapp.com",
  databaseURL: "https://quizgame-dd714-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quizgame-dd714",
  storageBucket: "quizgame-dd714.firebasestorage.app",
  messagingSenderId: "164919175813",
  appId: "1:164919175813:web:caecd6e8d35d3f848ad7ec",
  measurementId: "G-58CQ6070C8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, get, onValue };