// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAprqswDj0x3es06eMbPbzNjSiitvyO6R4",
  authDomain: "park-js.firebaseapp.com",
  projectId: "park-js",
  storageBucket: "park-js.appspot.com",
  messagingSenderId: "469675983461",
  appId: "1:469675983461:web:29f10f285136f694bdbc8c",
  measurementId: "G-P0JQMJBYH8",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export const fireAuth = getAuth(firebaseApp);
export const fireDb = getFirestore(firebaseApp);

export const parkingLotRef = collection(fireDb, "estacionamentos");
export const ticketsRef = collection(fireDb, "tickets");

