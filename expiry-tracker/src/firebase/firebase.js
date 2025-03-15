import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAo60vmdijIx9Q2Gdsj_XDAJ5QtNWkG7ZM",
  authDomain: "foodwaste-5b731.firebaseapp.com",
  projectId: "foodwaste-5b731",
  storageBucket: "foodwaste-5b731.firebasestorage.app",
  messagingSenderId: "593971518918",
  appId: "1:593971518918:web:545af5817cfa23b1aca6c7",
  measurementId: "G-GDDMMR4MS6"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  

export { app, auth };