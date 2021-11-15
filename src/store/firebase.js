// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FB_API_ID,
    authDomain: 'manx-read-track.firebaseapp.com',
    projectId: 'manx-read-track',
    storageBucket: 'manx-read-track.appspot.com',
    messagingSenderId: process.env.SENDER_ID,
    appId: process.env.FB_APP_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get a reference to the database service
export const db = getFirestore(app);
