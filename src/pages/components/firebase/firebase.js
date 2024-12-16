// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3JdZc1xDcLltCzf27ANzkq08bTaJ7yBI",
  authDomain: "bookbee-b6db9.firebaseapp.com",
  projectId: "bookbee-b6db9",
  storageBucket: "bookbee-b6db9.firebasestorage.app",
  messagingSenderId: "64541897556",
  appId: "1:64541897556:web:fd0e4c54dcdbb7b6b98ec1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export default app;