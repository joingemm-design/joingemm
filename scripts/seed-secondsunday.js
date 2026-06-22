
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();
const UID = "secondsundaystl-uid-001";
const USERNAME = "secondsundaystl";
const EVENT_ID = "second-sunday-2016-experience-may2026";

async function seed() {
  const batch = db.batch();

  batch.set(db.doc("usernames/" + USERNAME), { uid: UID });

  batch.set(db.doc("users/" + UID), {
    uid: UID,
    username: USERNAME,
    displayName: "Second Sunday STL",
    bio: "Every Second Sunday of the Month. Saint Louis, USA. Curated by @iamnaybahood.",
    email: "",
    photoURL: "",
    theme: "dark",
    plan: "empire",
    instagram: "https://instagram.com/secondsundaystl",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  batch.set(db.doc("users/" + UID + "/events/" + EVENT_ID), {
    id: EVENT_ID,
    title: "The 2016 Experience",
    subtitle: "Spring Break STL",
    date: "2026-05-10",
    startTime: "5:00 PM",
    endTime: "10:00 PM",
    doorsOpen: "5:00 PM",
    venue: "The Key STL",
    address: "3225 Olive St, St. Louis, MO 63103",
    ageLimit: "21+",
    description: "We're taking it back. Second Sunday returns with The 2016 Experience — a night dedicated to one of the most iconic eras in music. From start to finish, expect nothing but 2016: the hits, the deep cuts, and everything that defined the sound. This is for the ones who remember.",
    lineup: ["NAYBAHOOD", "MTTVVV", "ANANSI SPINS"],
    tickets: [
      { tier: "Early Bird", price: 15, note: "Until sold out", active: true },
      { tier: "Tier 1",     price: 20, note: "Limited",        active: true },
      { tier: "Tier 2",     price: 23, note: "General",        active: true },
    ],
    status: "published",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();
  console.log("✓ Second Sunday STL seeded successfully");
  console.log("  Live at: joingemm.com/secondsundaystl");
}

seed().catch(console.error).finally(() => process.exit());
