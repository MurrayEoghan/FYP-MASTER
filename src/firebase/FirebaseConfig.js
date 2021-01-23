import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBZpi33ofl-ZNrvH2XYG30Qx3q9pZYTh_8",
  authDomain: "fyp-storage-7536c.firebaseapp.com",
  projectId: "fyp-storage-7536c",
  storageBucket: "fyp-storage-7536c.appspot.com",
  messagingSenderId: "956805821823",
  appId: "1:956805821823:web:bfe8d7b02104b24218d64a",
  measurementId: "G-RHDWBTDGPR",
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
