import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { storageBucket, projectId, clientEmail, privateKey } from "./config";

const app = initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
  storageBucket,
  projectId,
});

const auth = getAuth();

export { app, auth };
