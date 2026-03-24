// lib/events.ts
// ─────────────────────────────────────────────
// Firestore + Storage helpers for Events
// ─────────────────────────────────────────────

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, orderBy,
  serverTimestamp, writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

// ── Types ───────────────────────────────────────────────────────────────
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

// ── Upload image ────────────────────────────────────────────────────────
export async function uploadEventImage(uid: string, eventId: string, file: File, path: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${path}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, `events/${uid}/${eventId}/${filename}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ── Create event ────────────────────────────────────────────────────────
export async function createEvent(uid: string, data: Partial<EventData>): Promise<string> {
  const docRef = doc(collection(firestore, "events"));
  await setDoc(docRef, {
    ...data,
    id: docRef.id,
    uid,
    published: false,
    active: true,
    soldout: false,
    galleryURLs: data.galleryURLs || [],
    tickets: data.tickets || [],
    externalLinks: data.externalLinks || {},
    theme: data.theme || { bg: "#000000", text: "#ffffff", accent: "#ffffff" },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ── Update event ────────────────────────────────────────────────────────
export async function updateEvent(eventId: string, data: Partial<EventData>): Promise<void> {
  const docRef = doc(firestore, "events", eventId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

// ── Delete event ────────────────────────────────────────────────────────
export async function deleteEvent(eventId: string): Promise<void> {
  const docRef = doc(firestore, "events", eventId);
  await deleteDoc(docRef);
}

// ── Get single event ────────────────────────────────────────────────────
export async function getEvent(eventId: string): Promise<EventData | null> {
  const docRef = doc(firestore, "events", eventId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as EventData;
}

// ── Get user's events ───────────────────────────────────────────────────
export async function getUserEvents(uid: string): Promise<EventData[]> {
  const q = query(
    collection(firestore, "events"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventData));
}

// ── Get all published events ────────────────────────────────────────────
export async function getPublishedEvents(): Promise<EventData[]> {
  const q = query(
    collection(firestore, "events"),
    where("published", "==", true),
    where("active", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventData));
}

// ── RSVP / Ticket registration ──────────────────────────────────────────
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
  await setDoc(docRef, {
    id: docRef.id,
    eventId,
    uid,
    name,
    email,
    ticketType,
    ticketPrice,
    createdAt: serverTimestamp(),
  });
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

// ── Email sending ──────────────────────────────────────────────────────────
interface OrderConfirmationEmail {
  customerEmail: string;
  customerName: string;
  eventName: string;
  ticketType: string;
  orderId: string;
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationEmail): Promise<void> {
  const mailRef = doc(collection(firestore, "mail"));
  await setDoc(mailRef, {
    to: params.customerEmail,
    message: {
      subject: `Your ticket for ${params.eventName}`,
      html: `
        <h1>You're in!</h1>
        <p>Hi ${params.customerName},</p>
        <p>This email confirms your order for ${params.eventName}.</p>
        <p><b>Ticket:</b> ${params.ticketType}</p>
        <p>You can view your ticket and order details here:</p>
        <a href="https://joingemm.com/event-success?orderId=${params.orderId}">View your ticket</a>
        <br/><br/>
        <p>See you there!</p>
      `,
    },
  });
}

// ── Order creation ──────────────────────────────────────────────────────────
export interface CreateOrderData {
  eventId: string;
  eventName: string;
  customerName: string;
  customerEmail: string;
  ticketType: string;
  ticketPrice: number;
  rsvpId: string;
}

export async function createOrder(data: CreateOrderData): Promise<string> {
  const docRef = doc(collection(firestore, "orders"));

  const ticket = {
    id: `${docRef.id}-1`,
    type: data.ticketType,
    name: data.customerName,
    email: data.customerEmail,
    phone: "",
  };

  await setDoc(docRef, {
    id: docRef.id,
    eventId: data.eventId,
    eventName: data.eventName,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    total: data.ticketPrice,
    tickets: [ticket],
    rsvpId: data.rsvpId,
    createdAt: serverTimestamp(),
  });

  await sendOrderConfirmationEmail({ 
    customerEmail: data.customerEmail, 
    customerName: data.customerName, 
    eventName: data.eventName, 
    ticketType: data.ticketType, 
    orderId: docRef.id 
  });

  return docRef.id;
}
