// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDmonpMhuHBfLBdlJOjMNi8kbRILeB6M00",
  authDomain: "manganshare.firebaseapp.com",
  projectId: "manganshare",
  storageBucket: "manganshare.appspot.com",
  messagingSenderId: "761450519609",
  appId: "1:761450519609:web:5954a7f8604fcd53f3c1e8",
  measurementId: "G-W49EF7GYVL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
