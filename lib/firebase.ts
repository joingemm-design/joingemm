
// lib/firebase.ts
// ─────────────────────────────────────────────
// Firebase configuration for GEMM
// 
// SETUP STEPS:
// 1. Go to https://console.firebase.google.com
// 2. Select your project (joingemm-65378132)
// 3. Go to Project Settings → General → Your apps → Web app
// 4. Copy your config values below
// 5. Go to Authentication → Sign-in method → Enable Google
// ─────────────────────────────────────────────

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  // ⚠️ REPLACE THESE with your actual Firebase config from console
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Add scopes for Google sign-in
googleProvider.addScope("email");
googleProvider.addScope("profile");

/** Sign in with Google popup → redirects to /dashboard on success */
export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(auth, googleProvider);
}

/** Sign out and stay on landing page */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/** Subscribe to auth state changes */
export function onAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export default app;
