import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

// Export autentifikácie, aby ju bolo možné použiť v iných súboroch
export {app, auth, googleProvider};
