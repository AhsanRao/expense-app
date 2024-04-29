// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDTAZbwK6cL7fKjw03rbE26wiUn_q3I1F4',
  authDomain: 'dbas-de7fb.firebaseapp.com',
  projectId: 'dbas-de7fb',
  storageBucket: 'dbas-de7fb.appspot.com',
  messagingSenderId: '576456233118',
  appId: '1:576456233118:web:7c4a544b8a81d983ec2b8f',
  measurementId: 'G-L0H0KKFVEL',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
