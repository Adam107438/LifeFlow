import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// NOTE: In a real environment, use process.env.REACT_APP_FIREBASE_API_KEY etc.
// For this generated code to run without crashing immediately, we provide a placeholder config.
// YOU MUST REPLACE THIS WITH YOUR REAL FIREBASE CONFIGURATION.

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY || "AIzaSyDummyKey-REPLACE-ME",
  authDomain: process.env.REACT_APP_AUTH_DOMAIN || "dummy-project.firebaseapp.com",
  projectId: process.env.REACT_APP_PROJECT_ID || "dummy-project",
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET || "dummy-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_APP_ID || "1:123456789:web:abcdef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper to check if we are using dummy config
export const isConfigured = firebaseConfig.apiKey !== "AIzaSyDummyKey-REPLACE-ME";
