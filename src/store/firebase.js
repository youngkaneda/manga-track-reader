// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyBIxndiUOQGBBqjHTACFofSISTk_8bG6mA',
    authDomain: 'manx-read-track.firebaseapp.com',
    projectId: 'manx-read-track',
    storageBucket: 'manx-read-track.appspot.com',
    messagingSenderId: '574756155133',
    appId: '1:574756155133:web:6f93e87cccc82562259894'
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Get a reference to the database service
export const db = getFirestore(app);
