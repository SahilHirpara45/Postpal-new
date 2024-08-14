// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQezjFF3TrcP7McZUGnR6FlWtukH3mV1g",
  authDomain: "postpaldev-b0be2.firebaseapp.com",
  projectId: "postpaldev-b0be2",
  storageBucket: "postpaldev-b0be2.appspot.com",
  messagingSenderId: "932688719065",
  appId: "1:932688719065:web:be9c8a4a29da04bdc862c8",
  measurementId: "G-ED14P6Z81R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const dbRealtime = getDatabase();
export const storage = getStorage(app);