// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-f9631.firebaseapp.com",
  projectId: "blog-app-f9631",
  storageBucket: "blog-app-f9631.firebasestorage.app",
  messagingSenderId: "318425114057",
  appId: "1:318425114057:web:c1ddbfd20603432325f418",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
