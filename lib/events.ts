// lib/events.ts
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, orderBy,
  serverTimestamp, writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

export interface Ticket {
  id: string;
  type: string;
  price: number;
  description: string;
  limit?: number;
  soldout: boolean;
}

export interface EventData {
  id: string;
  uid: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venueName: string;
  address: string;
  shortDescription: string;
  detailedInfo: string;
  flyerURL: string;
  galleryURLs: string[];
  tickets: Ticket[];
  externalLinks: { eventbrite?: string; posh?: string; website?: string };
  theme: { bg: string; text: string; accent: string };
  published: boolean;
  active: boolean;
  soldout: boolean;
  createdAt: any;
  updatedAt: any;
}

export async function uploadEventImage(uid: string, eventId: string, file: File, path: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${path}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, `events/${uid}/${eventId}/${filename}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function createEvent(uid: string, data: Partial<EventData>): Promise<string> {
  const docRef = doc(collection(firestore, "events"));
  await setDoc(docRef, {
    ...data, id: docRef.id, uid, published: false, active: true, soldout: false,
    galleryURLs: data.galleryURLs || [], tickets: data.tickets || [],
    externalLinks: data.externalLinks || {},
    theme: data.theme || { bg: "#000000", text: "#ffffff", accent: "#ffffff" },
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateEvent(eventId: string, data: Partial<EventData>): Promise<void> {
  const docRef = doc(firestore, "events", eventId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(firestore, "events", eventId));
}

export async function getEvent(eventId: string): Promise<EventData | null> {
  const snap = await getDoc(doc(firestore, "events", eventId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as EventData;
}

export async function getUserEvents(uid: string): Promise<EventData[]> {
  const q = query(collection(firestore, "events"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventData));
}

export async function getPublishedEvents(): Promise<EventData[]> {
  const q = query(collection(firestore, "events"), where("published", "==", true), where("active", "==", true), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventData));
}

export interface RSVP {
  id: string;
  eventId: string;
  uid: string;
  name: string;
  email: string;
  ticketType: string;
  ticketPrice: number;
  createdAt: any;
}

export async function registerForEvent(eventId: string, uid: string, name: string, email: string, ticketType: string, ticketPrice: number): Promise<string> {
  const docRef = doc(collection(firestore, "events", eventId, "rsvps"));
  await setDoc(docRef, { id: docRef.id, eventId, uid, name, email, ticketType, ticketPrice, createdAt: serverTimestamp() });
  return docRef.id;
}

export async function getEventRSVPs(eventId: string): Promise<RSVP[]> {
  const q = query(collection(firestore, "events", eventId, "rsvps"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as RSVP));
}

export async function getEventRSVPCount(eventId: string): Promise<number> {
  const snap = await getDocs(collection(firestore, "events", eventId, "rsvps"));
  return snap.size;
}