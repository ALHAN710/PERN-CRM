// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as config from '../../utils/config';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: config.firebaseApiKey,
  authDomain: config.firebaseAuthDomain,
  projectId: config.firebaseProjectId,
  appId: config.firebaseAppId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if (import.meta.env.DEV) {
  // connectAuthEmulator(auth, "http://localhost:9099");
}

export const auth = getAuth(app);