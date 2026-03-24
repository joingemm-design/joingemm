// lib/db.ts
// ─────────────────────────────────────────────
// Firestore helpers for GEMM
// Collections: users, usernames, links
// ─────────────────────────────────────────────

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, orderBy,
  serverTimestamp, writeBatch,
} from "firebase/firestore";
import { firestore, storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// ── Types ───────────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  bio: string;
  email: string;
  photoURL: string;
  theme: string;
  socials?: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    facebook?: string;
  };
  design?: {
    preset?: string;
    bgColor?: string;
    textColor?: string;
    buttonBg?: string;
    buttonText?: string;
    buttonShape?: string;
    buttonShadow?: string;
    typography?: string;
    spacing?: string;
  };
  aboutPage?: string;
  heroBanner?: string;
  marqueeText?: string;
  brandLogos?: string[];
  eventBannerEnabled?: boolean;
  pressItems?: {
    publication: string;
    headline: string;
    excerpt?: string;
    url?: string;
    date?: string;
  }[];
  plan?: string;
  suspended?: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  order: number;
  active: boolean;
  plan?: string;
  suspended?: boolean;
  createdAt: any;
}

// ── Username helpers ────────────────────────────────────────────────────

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const reserved = ["dashboard", "onboarding", "admin", "api", "events", "pricing", "contact", "create", "welcome", "settings", "auth", "login", "signup"];
  if (reserved.includes(username.toLowerCase())) return false;
  const ref = doc(firestore, "usernames", username.toLowerCase());
  const snap = await getDoc(ref);
  if (!snap.exists()) return true;
  const data = snap.data();
  // Allow if it's a 30-day hold that has expired
  if (data.reserved && data.expiresAt) {
    const expires = data.expiresAt.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);
    if (new Date() > expires) {
      await deleteDoc(ref); // clean up expired hold
      return true;
    }
  }
  return false;
}

export function isValidUsername(username: string): { valid: boolean; error?: string } {
  if (!username) return { valid: false, error: "Username is required." };
  if (username.length < 3) return { valid: false, error: "Must be at least 3 characters." };
  if (username.length > 20) return { valid: false, error: "Must be 20 characters or less." };
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return { valid: false, error: "Only letters, numbers, and underscores." };
  if (/^[_]/.test(username)) return { valid: false, error: "Cannot start with underscore." };
  return { valid: true };
}

// ── Profile helpers ─────────────────────────────────────────────────────

export async function createUserProfile(
  uid: string, username: string, displayName: string, email: string, photoURL: string = ""
): Promise<void> {
  const batch = writeBatch(firestore);
  const userRef = doc(firestore, "users", uid);
  batch.set(userRef, {
    uid, username: username.toLowerCase(), displayName, bio: "", email, photoURL,
    theme: "clean", socials: {}, design: { preset: "clean", buttonShape: "rounded", typography: "sans", spacing: "normal" },
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  const usernameRef = doc(firestore, "usernames", username.toLowerCase());
  batch.set(usernameRef, { uid });
  await batch.commit();
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(firestore, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  if (!username) {
    return null;
  }
  const usernameRef = doc(firestore, "usernames", username.toLowerCase());
  const usernameSnap = await getDoc(usernameRef);
  if (!usernameSnap.exists()) return null;
  const { uid } = usernameSnap.data();
  return getUserProfile(uid);
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "displayName" | "bio" | "photoURL" | "theme" | "socials" | "design" | "aboutPage" | "pressItems">> & Record<string, any>
): Promise<void> {
  const ref = doc(firestore, "users", uid);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

// ── Link helpers ────────────────────────────────────────────────────────

export async function getUserLinks(uid: string): Promise<LinkItem[]> {
  const ref = collection(firestore, "users", uid, "links");
  const q = query(ref, orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as LinkItem));
}

export async function addLink(uid: string, title: string, url: string, icon: string = ""): Promise<string> {
  const links = await getUserLinks(uid);
  const order = links.length;
  const ref = doc(collection(firestore, "users", uid, "links"));
  await setDoc(ref, { title, url, icon, order, active: true, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateLink(uid: string, linkId: string, data: Partial<Pick<LinkItem, "title" | "url" | "icon" | "order" | "active">>): Promise<void> {
  const ref = doc(firestore, "users", uid, "links", linkId);
  await updateDoc(ref, data);
}

export async function deleteLink(uid: string, linkId: string): Promise<void> {
  const ref = doc(firestore, "users", uid, "links", linkId);
  await deleteDoc(ref);
}

export async function reorderLinks(uid: string, linkIds: string[]): Promise<void> {
  const batch = writeBatch(firestore);
  linkIds.forEach((id, index) => {
    const ref = doc(firestore, "users", uid, "links", id);
    batch.update(ref, { order: index });
  });
  await batch.commit();
}

// ── Storage helpers ───────────────────────────────────────────────────

export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
  const extension = file.type.split('/')[1];
  const filePath = `p/${uid}.${extension}`; // path: p for profile
  const fileRef = storageRef(storage, filePath);
  
  // Upload the file
  await uploadBytes(fileRef, file);
  
  // Get the download URL
  const photoURL = await getDownloadURL(fileRef);

  // Update the user's profile
  await updateUserProfile(uid, { photoURL });
  
  return photoURL;
}

// ── Change username ─────────────────────────────────────────────────────
export async function changeUsername(uid: string, oldUsername: string, newUsername: string): Promise<{ error?: string }> {
  const lower = newUsername.toLowerCase();
  const valid = isValidUsername(lower);
  if (!valid.valid) return { error: valid.error };

  // Check availability (respects 30-day holds)
  const available = await isUsernameAvailable(lower);
  if (!available) return { error: "Username is already taken." };

  const batch = writeBatch(firestore);

  // Release old username
  if (oldUsername) {
    batch.delete(doc(firestore, "usernames", oldUsername.toLowerCase()));
  }

  // Claim new username
  batch.set(doc(firestore, "usernames", lower), { uid, claimedAt: serverTimestamp() });

  // Update user profile
  batch.update(doc(firestore, "users", uid), { username: lower, updatedAt: serverTimestamp() });

  await batch.commit();
  return {};
}

// ── Delete account (keeps username reserved for 30 days) ────────────────
export async function deleteUserAccount(uid: string, username: string): Promise<void> {
  const batch = writeBatch(firestore);

  // Mark username as reserved (30-day hold) instead of deleting
  if (username) {
    // Update username doc to mark as reserved for 30 days
    batch.update(doc(firestore, "usernames", username.toLowerCase()), {
      reserved: true,
      deletedAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  // Delete user profile
  batch.delete(doc(firestore, "users", uid));

  // Delete links
  const linksSnap = await getDocs(collection(firestore, "users", uid, "links"));
  linksSnap.docs.forEach(d => batch.delete(d.ref));

  await batch.commit();

  // Unpublish events and shops (don't delete, just unpublish)
  const eventsSnap = await getDocs(query(collection(firestore, "events"), where("uid", "==", uid)));
  for (const d of eventsSnap.docs) {
    await updateDoc(d.ref, { active: false, published: false });
  }
  const shopsSnap = await getDocs(query(collection(firestore, "shops"), where("uid", "==", uid)));
  for (const d of shopsSnap.docs) {
    await updateDoc(d.ref, { isPublic: false });
  }
}