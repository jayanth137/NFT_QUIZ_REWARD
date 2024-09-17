// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBh3f7maJk4EmDL7FvToiwuX43tuez0m6E',
  authDomain: 'nftreward-b35d2.firebaseapp.com',
  projectId: 'nftreward-b35d2',
  storageBucket: 'nftreward-b35d2.appspot.com',
  messagingSenderId: '942688253202',
  appId: '1:942688253202:web:3ebea088d83377c862afcb',
};

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_apiKey,
//   authDomain: import.meta.env.VITE_authDomain,
//   projectId: import.meta.env.VITE_projectId,
//   storageBucket: import.meta.env.VITE_storageBucket,
//   messagingSenderId: import.meta.env.VITE_messagingSenderId,
//   appId: import.meta.env.VITE_appId,
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
