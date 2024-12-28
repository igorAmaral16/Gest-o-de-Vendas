// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT-3s1mQiuuAGRSqPxVoweiWAfrEl13DE",
  authDomain: "gestaodevendas-001.firebaseapp.com",
  projectId: "gestaodevendas-001",
  storageBucket: "gestaodevendas-001.firebasestorage.app",
  messagingSenderId: "842074124866",
  appId: "1:842074124866:web:c83faedce93ee70aad73db",
  measurementId: "G-W8Y7SXDV97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
