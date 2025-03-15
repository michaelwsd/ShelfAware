import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPq9HBxLI2kVEl0sdhFkWoGNpbxjGjnAY",
  authDomain: "food-app-fbfd4.firebaseapp.com",
  databaseURL: "https://food-app-fbfd4-default-rtdb.firebaseio.com",
  projectId: "food-app-fbfd4",
  storageBucket: "food-app-fbfd4.firebasestorage.app",
  messagingSenderId: "970922318505",
  appId: "1:970922318505:web:a76f7dc9db65e585f8a7b8",
  measurementId: "G-HN8C77TTN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  

export { app, auth };