// hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") console.error("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return {};
    } catch (error: any) {
      const code = error.code;
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") return { error: "Invalid email or password." };
      if (code === "auth/too-many-requests") return { error: "Too many attempts. Try again later." };
      return { error: "Something went wrong. Please try again." };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, name?: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name && cred.user) await updateProfile(cred.user, { displayName: name });
      return {};
    } catch (error: any) {
      const code = error.code;
      if (code === "auth/email-already-in-use") return { error: "An account with this email already exists." };
      if (code === "auth/weak-password") return { error: "Password must be at least 6 characters." };
      if (code === "auth/invalid-email") return { error: "Please enter a valid email address." };
      return { error: "Something went wrong. Please try again." };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try { await firebaseSignOut(auth); setUser(null); } catch (error) { console.error("Sign-out error:", error); }
  }, []);

  return { user, loading, signIn, signInWithEmail, signUpWithEmail, signOut };
}
