// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

/*─────────────────────────────────────────────
  🔑  Your real Firebase credentials
     (keep them in .env for production)
─────────────────────────────────────────────*/
const firebaseConfig = {
  apiKey:            "AIzaSyAFbnl9zGGU8n3_t899of2imSpohCLrX9o",
  authDomain:        "sri-rudra-chat.firebaseapp.com",
  projectId:         "sri-rudra-chat",
  storageBucket:     "sri-rudra-chat.appspot.com",   // ✅ corrected
  messagingSenderId: "188670520129",
  appId:             "1:188670520129:web:43b5d91158ae5cb379cfca0"
  // measurementId is optional for analytics – removed
};

/*─────────────────  Init  ─────────────────*/
const app      = initializeApp(firebaseConfig);
export const db       = getFirestore(app);
export const storage  = getStorage(app);
export const auth     = getAuth(app);

/* anonymous sign-in helper (used in NicknameScreen) */
export const signInAnon = () => signInAnonymously(auth);
