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
  uid?: string;
  title: string;
  startDate?: string;
  date?: string;
  startTime: string;
  endDate?: string;
  endTime: string;
  venueName?: string;
  location?: string;
  address: string;
  shortDescription?: string;
  description?: string;
  detailedInfo?: string;
  flyerURL?: string;
  imageUrl?: string;
  galleryURLs?: string[];
  tickets?: Ticket[];
  externalLinks?: { eventbrite?: string; posh?: string; website?: string };
  sourceUrl?: string;
  venueWebsite?: string;
  category?: string;
  tags?: string[];
  theme?: { bg: string; text: string; accent: string };
  published?: boolean;
  active?: boolean;
  soldout?: boolean;
  staffPin?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const STATIC_EVENTS: EventData[] = [
  {
    id: "brock-seals-whole-order-314",
    title: 'Brock Seals Presents "Whole Order," A 314 Day Pop-Up Exhibition',
    date: "2026-03-14",
    startTime: "5:00 PM",
    endTime: "9:00 PM",
    location: "Legends' Gallery",
    address: "3318 Washington Ave., St. Louis, MO 63103",
    description:
      'Renowned St. Louis artist Brock Seals celebrates 314 Day with a one-night-only pop-up exhibition titled "Whole Order," featuring works by Brock Seals, A-Ron Johnson, Erica Green, Malik Fabian-Mahmud, Jaidah Michelle Kirksey, Kenneth Randle, and Jeru Battle. The multi-medium show includes photography, paintings, sculptural installations, and video — all tied to St. Louis culture. The evening also includes music, light refreshments, and a special STL capsule merchandise drop.',
    category: "Art / Exhibition",
    tags: ["314Day", "art", "St. Louis", "pop-up"],
    sourceUrl:
      "https://thestl.com/314dayevent/brock-seals-presents-whole-order-a-314-day-pop-up-exhibition/",
    imageUrl: "https://thestl.com/wp-content/uploads/2026/03/Brock-Seals-scaled.jpg",
    venueWebsite: "https://www.xhbt.org/gallery/legends-gallery-st-louis",
  },
];

export async function uploadEventImage(uid: string, eventId: string, file: File, path: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${path}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, `events/${uid}/${eventId}/${filename}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function createEvent(uid: string, data: Partial<EventData>): Promise<string> {
  const docRef = doc(collection(firestore, "events"));
  const staffPin = Math.floor(100000 + Math.random() * 900000).toString();
  await setDoc(docRef, {
    id: docRef.id, uid, published: false, ...data, active: true, soldout: false, staffPin,
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
  const q = query(collection(firestore, "events"));
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
export interface OrderTicket {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
}

export async function createOrder(params: {
  eventId: string;
  eventName: string;
  customerName: string;
  customerEmail: string;
  ticketType: string;
  ticketPrice: number;
  rsvpId: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  venueName?: string;
  address?: string;
}): Promise<string> {
  const orderRef = doc(collection(firestore, "orders"));
  await setDoc(orderRef, {
    id: orderRef.id,
    eventId: params.eventId,
    eventName: params.eventName,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    total: params.ticketPrice,
    tickets: [
      {
        id: `${orderRef.id}-1`,
        type: params.ticketType,
        name: params.customerName,
        email: params.customerEmail,
        phone: "",
      },
    ],
    rsvpId: params.rsvpId,
    startDate: params.startDate || "",
    startTime: params.startTime || "",
    endTime: params.endTime || "",
    venueName: params.venueName || "",
    address: params.address || "",
    createdAt: serverTimestamp(),
  });
  await sendOrderConfirmationEmail({ customerEmail: params.customerEmail, customerName: params.customerName, eventName: params.eventName, ticketType: params.ticketType, orderId: orderRef.id });
  return orderRef.id;
}

// ── Send confirmation email via Resend (handled by Cloud Function) ───────────
export async function sendOrderConfirmationEmail(params: {
  customerEmail: string;
  customerName: string;
  eventName: string;
  ticketType: string;
  orderId: string;
}): Promise<void> {
  // Email is sent server-side via Firebase Cloud Function
  return;
}

// ── Debug wrapper to test Resend ─────────────────────────────────────────────
export async function testResend(email: string): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "GEMM <hello@joingemm.com>",
      to: email,
      subject: "GEMM Test Email",
      html: "<p>Test email from GEMM</p>",
    }),
  });
  const data = await res.json();
  console.log("Resend response:", JSON.stringify(data));
}
