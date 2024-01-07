// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyB77kT_rcMHrTXux4FZvBZDdalfMd-mO9Y",
  authDomain: "image-gallery-bb519.firebaseapp.com",
  projectId: "image-gallery-bb519",
  storageBucket: "image-gallery-bb519.appspot.com",
  messagingSenderId: "109363762059",
  appId: "1:109363762059:web:ebf325a988d3a61c38958e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
export {auth,storage,db};