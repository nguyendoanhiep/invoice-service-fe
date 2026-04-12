import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

 const firebaseConfig = {
    apiKey: "AIzaSyDM58IcmskDOqE5y3p3ftDUwXin6bJblgI",
    authDomain: "project-d53f4.firebaseapp.com",
    databaseURL: "https://project-d53f4-default-rtdb.firebaseio.com",
    projectId: "project-d53f4",
    storageBucket: "project-d53f4.appspot.com",
    messagingSenderId: "446040512010",
    appId: "1:446040512010:web:ffb9fe4eeb3e0fe1f031f3",
    measurementId: "G-XWSDDW6XG6"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
