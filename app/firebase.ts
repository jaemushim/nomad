// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYzZyL3mRlpo-mOAnczOOLVl3Ki1K8T-E",
  authDomain: "nomad-356c2.firebaseapp.com",
  projectId: "nomad-356c2",
  storageBucket: "nomad-356c2.appspot.com",
  messagingSenderId: "703188366824",
  appId: "1:703188366824:web:abdd2438d3acc7ff55a05d",
  measurementId: "G-KRMVT89WDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics =
  app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage();
