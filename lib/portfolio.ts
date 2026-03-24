import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

export interface PortfolioItem {
  id: string;
  uid: string;
  title: string;
  description: string;
  category: string;
  imageURL: string;
  link?: string;
  videoUrl?: string;
  order: number;
  createdAt: any;
}

export async function uploadPortfolioImage(uid: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `portfolio_${Date.now()}.${ext}`;
  const storageRef = ref(storage, `portfolio/${uid}/${filename}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function addPortfolioItem(uid: string, data: Omit<PortfolioItem, "id" | "uid" | "createdAt">): Promise<string> {
  const docRef = doc(collection(firestore, "portfolio"));
  await setDoc(docRef, { ...data, id: docRef.id, uid, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function getUserPortfolio(uid: string): Promise<PortfolioItem[]> {
  const q = query(collection(firestore, "portfolio"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem));
}

export async function deletePortfolioItem(id: string): Promise<void> {
  await deleteDoc(doc(firestore, "portfolio", id));
}

export async function updatePortfolioItem(id: string, data: Partial<PortfolioItem>): Promise<void> {
  await updateDoc(doc(firestore, "portfolio", id), data);
}