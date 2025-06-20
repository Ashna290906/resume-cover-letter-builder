import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDRqD4i2nM8A_JTtZ6psHqg7luqMPG055c",
  authDomain: "resume-cover-letter-buil-40e04.firebaseapp.com",
  projectId: "resume-cover-letter-buil-40e04",
  storageBucket: "resume-cover-letter-buil-40e04.firebasestorage.app",
  messagingSenderId: "847007216711",
  appId: "1:847007216711:web:b498582e51cc005bbded62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;