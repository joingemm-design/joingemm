// lib/shop.ts
// ─────────────────────────────────────────────
// Firestore + Storage helpers for Shop module
// ─────────────────────────────────────────────

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, orderBy,
  serverTimestamp, writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

// ── Types ───────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageURL: string;
  active: boolean;
  order: number;
  createdAt: any;
}

export interface ShopData {
  id: string;
  uid: string;
  title: string;
  slug: string;
  description: string;
  customHeader: string;
  logoURL: string;
  showTitle: boolean;
  isPublic: boolean;
  topBarMessage: string;
  design: {
    preset: string;
    mainText: string;
    dividerAccent: string;
    topBarBg: string;
    topBarText: string;
    cardBg: string;
    cardText: string;
    cardBorder: string;
    buttons: string;
    pageBg: string;
  };
  products: Product[];
  createdAt: any;
  updatedAt: any;
}

// ── Upload shop image ───────────────────────────────────────────────────
export async function uploadShopImage(uid: string, shopId: string, file: File, path: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${path}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, `shops/${uid}/${shopId}/${filename}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ── Create shop ─────────────────────────────────────────────────────────
export async function createShop(uid: string, data: Partial<ShopData>): Promise<string> {
  const docRef = doc(collection(firestore, "shops"));
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    uid,
    isPublic: false,
    showTitle: true,
    products: [],
    design: data.design || {
      preset: "minimal", mainText: "#000000", dividerAccent: "#e5e5e5",
      topBarBg: "#000000", topBarText: "#ffffff", cardBg: "#f9fafb",
      cardText: "#000000", cardBorder: "#ffffff", buttons: "#000000", pageBg: "#ffffff",
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ── Update shop ─────────────────────────────────────────────────────────
export async function updateShop(shopId: string, data: Partial<ShopData>): Promise<void> {
  const docRef = doc(firestore, "shops", shopId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

// ── Delete shop ─────────────────────────────────────────────────────────
export async function deleteShop(shopId: string): Promise<void> {
  await deleteDoc(doc(firestore, "shops", shopId));
}

// ── Get shop ────────────────────────────────────────────────────────────
export async function getShop(shopId: string): Promise<ShopData | null> {
  const snap = await getDoc(doc(firestore, "shops", shopId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ShopData;
}

// ── Get user's shops ────────────────────────────────────────────────────
export async function getUserShops(uid: string): Promise<ShopData[]> {
  const q = query(collection(firestore, "shops"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ShopData));
}

// ── Get public shop by slug ─────────────────────────────────────────────
export async function getShopBySlug(slug: string): Promise<ShopData | null> {
  const q = query(collection(firestore, "shops"), where("slug", "==", slug.toLowerCase()), where("isPublic", "==", true));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as ShopData;
}

// ── Add product to shop ─────────────────────────────────────────────────
export async function addProduct(shopId: string, product: Omit<Product, "id" | "createdAt">): Promise<void> {
  const shop = await getShop(shopId);
  if (!shop) return;
  const products = shop.products || [];
  products.push({ ...product, id: `p_${Date.now()}`, createdAt: new Date().toISOString() } as Product);
  await updateShop(shopId, { products });
}

// ── Remove product ──────────────────────────────────────────────────────
export async function removeProduct(shopId: string, productId: string): Promise<void> {
  const shop = await getShop(shopId);
  if (!shop) return;
  const products = (shop.products || []).filter(p => p.id !== productId);
  await updateShop(shopId, { products });
}

// ── Update product ──────────────────────────────────────────────────────
export async function updateProduct(shopId: string, productId: string, data: Partial<Product>): Promise<void> {
  const shop = await getShop(shopId);
  if (!shop) return;
  const products = (shop.products || []).map(p => p.id === productId ? { ...p, ...data } : p);
  await updateShop(shopId, { products });
}