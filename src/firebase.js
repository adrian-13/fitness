import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdc2vlKeZvESOoXrzXQh-4ydwAFkqiuXQ",
  authDomain: "fitlife-a6702.firebaseapp.com",
  projectId: "fitlife-a6702",
  storageBucket: "fitlife-a6702.firebasestorage.app",
  messagingSenderId: "782288244115",
  appId: "1:782288244115:web:58d325c76771a4b76b6c66",
  measurementId: "G-0DX3G38582"
};

// Inicializácia Firebase aplikácie
const app = initializeApp(firebaseConfig);

// Inicializácia autentifikácie a Google providera
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Inicializácia Firestore databázy
export const db = getFirestore(app);

export default app;