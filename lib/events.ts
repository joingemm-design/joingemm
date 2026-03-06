// lib/events.ts
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, orderBy,
  serverTimestamp, Timestamp, addDoc, getCountFromServer
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

// Interfaces
export interface Ticket {
  id: string;
  type: string;
  price: number;
  description?: string;
  limit?: number;
  soldout: boolean;
}

export interface RSVP {
    id: string;
    name: string;
    email: string;
    ticketType: string;
    purchaseDate: Timestamp;
    userId: string;
}

export interface EventData {
  id: string;
  title: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  venueName?: string;
  address?: string;
  shortDescription?: string;
  detailedInfo?: string;
  flyerURL?: string;
  tickets: Ticket[];
  externalLinks?: Record<string, string>;
  theme?: { bg: string; text: string; accent: string };
  published: boolean;
  active?: boolean;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
}


// Functions

export async function uploadEventImage(uid: string, eventId: string, file: File, type: 'flyer' | 'other'): Promise<string> {
  const filePath = `events/${eventId}/${type}_${Date.now()}_${file.name}`;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export async function createEvent(uid: string, data: Omit<EventData, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = doc(collection(firestore, "events"));
  const newEvent = {
    ...data,
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, newEvent);
  return ref.id;
}

export async function getEvent(id: string): Promise<EventData | null> {
  const ref = doc(firestore, "events", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as EventData;
}

export async function getUserEvents(uid:string): Promise<EventData[]> {
    const q = query(
        collection(firestore, "events"),
        where("createdBy", "==", uid),
        orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventData));
}

export async function updateEvent(id: string, data: Partial<Omit<EventData, 'id'>>): Promise<void> {
  const ref = doc(firestore, "events", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteEvent(id: string): Promise<void> {
  const ref = doc(firestore, "events", id);
  // Note: This doesn't delete subcollections (like rsvps) or storage files.
  // For a full cleanup, those would need to be handled separately.
  await deleteDoc(ref);
}

export async function registerForEvent(eventId: string, userId: string, name: string, email: string, ticketType: string, price: number): Promise<string> {
    const ref = collection(firestore, `events/${eventId}/rsvps`);
    const newRsvp = {
        userId,
        name,
        email,
        ticketType,
        price,
        purchaseDate: serverTimestamp(),
    };
    const docRef = await addDoc(ref, newRsvp);
    return docRef.id;
}

export async function getEventRSVPs(eventId: string): Promise<RSVP[]> {
    const q = query(
        collection(firestore, `events/${eventId}/rsvps`),
        orderBy("purchaseDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RSVP));
}

export async function getEventRSVPCount(eventId: string): Promise<number> {
    const coll = collection(firestore, `events/${eventId}/rsvps`);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
}
