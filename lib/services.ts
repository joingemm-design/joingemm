import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc, query, where, orderBy, serverTimestamp, addDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export interface Service {
  id: string;
  uid: string;
  title: string;
  description: string;
  category: string;
  priceLabel: string;
  imageURL?: string;
  active: boolean;
  order: number;
  createdAt: any;
}

export interface QuoteRequest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  creatorUid: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "viewed" | "responded";
  createdAt: any;
}

export async function createService(uid: string, data: Omit<Service, "id" | "uid" | "createdAt">): Promise<string> {
  const docRef = doc(collection(firestore, "services"));
  await setDoc(docRef, { ...data, id: docRef.id, uid, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function getUserServices(uid: string): Promise<Service[]> {
  const q = query(collection(firestore, "services"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  await updateDoc(doc(firestore, "services", id), data);
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(firestore, "services", id));
}

export async function submitQuoteRequest(data: Omit<QuoteRequest, "id" | "status" | "createdAt">): Promise<void> {
  await addDoc(collection(firestore, "quote_requests"), { ...data, status: "new", createdAt: serverTimestamp() });
}

export async function getCreatorQuotes(uid: string): Promise<QuoteRequest[]> {
  const q = query(collection(firestore, "quote_requests"), where("creatorUid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as QuoteRequest));
}