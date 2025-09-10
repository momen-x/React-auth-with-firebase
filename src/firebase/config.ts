import { getAuth, signInAnonymously } from "firebase/auth";
import {
  initializeApp
}from "firebase/app"


const firebaseConfig = {
  apiKey: "AIzaSyC9MBp2nwbqorX-G_7UURMqYUb6KbAn5hI",
  authDomain: "react-auth-57912.firebaseapp.com",
  projectId: "react-auth-57912",
  storageBucket: "react-auth-57912.firebasestorage.app",
  messagingSenderId: "534449805808",
  appId: "1:534449805808:web:49ac61e2417f342435e535"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// signInAnonymously(auth)
//   .then(() => {
//     // Signed in..
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ...
//   });