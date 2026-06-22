// =============================================================================
// scripts/seed-amp-event.mjs
// =============================================================================
// Seeds the Firestore event document that AMPProfileView.tsx reads from.
//
// Run:
//   node scripts/seed-amp-event.mjs
//
// Requires a Firebase Admin service account JSON at:
//   ./.firebase-admin-key.json   (gitignored)
//
// Edit EVENT_DATA below before running for production values.
// =============================================================================

import admin from "firebase-admin";
import { readFileSync } from "node:fs";

const serviceAccount = JSON.parse(
  readFileSync("./.firebase-admin-key.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "gemm-8cda2",
});

const db = admin.firestore();

// -----------------------------------------------------------------------------
// Edit these values before running for production.
// -----------------------------------------------------------------------------
const EVENT_DATA = {
  id: "amp-2026",
  title: "Art, Mimosas & Pancakes",
  tagline:
    "A one-night group exhibit celebrating 60+ St. Louis visual artists, live music, vendors, and gourmet pancakes.",
  date: "2026-07-18T14:00:00-05:00", // <-- CONFIRM DATE with Brock
  doorsOpen: "2:00 PM",
  venue: "The Hawthorn",
  venueAddress: "2231 Washington Ave, St. Louis, MO",
  heroVideoUrl:
    "https://firebasestorage.googleapis.com/v0/b/gemm-8cda2.appspot.com/o/amp%2Famp-hero.mp4?alt=media",
  heroPosterUrl:
    "https://firebasestorage.googleapis.com/v0/b/gemm-8cda2.appspot.com/o/amp%2Famp-poster.jpg?alt=media",
  year: 2026,
  editionLabel: "11TH ANNUAL",
  artistCount: 60,
  curator: "Brock Seals",
  curatorHandle: "palettebyseals",
  curatorUid: "9ppSAQTMFchFf8JrACZg0S3OFXj1",
  tickets: [
    {
      id: "s1-ga",
      name: "Session 1 — General Admission",
      session: "session-1",
      priceCents: 3500,
      description:
        "Family-friendly matinee (2 PM–7 PM). Full gallery access, Little Palettes corner, vendor marketplace, Dan Cakes pancakes.",
      limitPerOrder: 8,
    },
    {
      id: "s1-vip",
      name: "Session 1 — VIP",
      session: "session-1",
      priceCents: 7500,
      description:
        "Early entry at 1 PM, one signed print from Brock Seals, two mimosa vouchers, reserved seating.",
      limitPerOrder: 4,
    },
    {
      id: "s2-ga",
      name: "Session 2 — General Admission",
      session: "session-2",
      priceCents: 4500,
      description:
        "Evening session (8 PM–1 AM). Full gallery access, live musical performances, mimosa bar, late-night vibes.",
      limitPerOrder: 8,
    },
    {
      id: "s2-vip",
      name: "Session 2 — VIP",
      session: "session-2",
      priceCents: 9500,
      description:
        "Early entry at 7 PM, artist meet-and-greet, signed exhibit catalog, premium mimosa service.",
      limitPerOrder: 4,
    },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
};

// -----------------------------------------------------------------------------
async function run() {
  const ref = db.collection("events").doc(EVENT_DATA.id);
  await ref.set(EVENT_DATA, { merge: true });
  console.log(`✓ Seeded events/${EVENT_DATA.id}`);
  console.log(`  Title: ${EVENT_DATA.title}`);
  console.log(`  Date:  ${EVENT_DATA.date}`);
  console.log(`  Tickets: ${EVENT_DATA.tickets.length} tiers`);
  process.exit(0);
}

run().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
