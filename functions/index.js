const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const Stripe = require("stripe");
const getStripe = () => Stripe(process.env.STRIPE_SECRET_KEY);
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const PLATFORM_FEE = 0.05; // 5%
const BASE_URL = "https://joingemm.com";

// ── 1. Send Order Confirmation Email ────────────────────────────────────
exports.sendOrderConfirmation = onDocumentCreated("orders/{orderId}", async (event) => {
  const order = event.data.data();
  const orderId = event.params.orderId;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "GEMM <hello@joingemm.com>",
      to: order.customerEmail,
      subject: `Order Confirmation: ${order.eventName}`,
      html: `
        <div style="background:#111;color:#fff;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;border-radius:16px">
          <h1 style="font-size:24px;font-weight:900;margin:0 0 8px">Order Confirmed: ${order.eventName}</h1>
          <p style="color:rgba(255,255,255,0.5)">Thank you for your order.</p>
          <p><b>Ticket:</b> ${order.tickets?.[0]?.type || "General Admission"}</p>
          <p><b>Order ID:</b> ${orderId}</p>
          <a href="${BASE_URL}/event-success?orderId=${orderId}" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">View Ticket</a>
        </div>
      `,
    }),
  });
});

// ── 2. Contact Form ──────────────────────────────────────────────────────
exports.sendContactEmail = onRequest({ cors: true }, async (req, res) => {
  const { name, email, message } = req.body;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "GEMM Contact <hello@joingemm.com>",
      to: "hello@joingemm.com",
      reply_to: email,
      subject: `New message from ${name}`,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b> ${message}</p>`,
    }),
  });
  res.json({ ok: true });
});

// ── 3. Stripe Connect — Create Onboarding Link ──────────────────────────
exports.createConnectAccount = onRequest({ cors: true }, async (req, res) => {
  const { uid, email } = req.body;
  if (!uid || !email) return res.status(400).json({ error: "Missing uid or email" });

  try {
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data() || {};

    let accountId = userData.stripeAccountId;

    // Create Stripe Connect account if doesn't exist
    if (!accountId) {
      const account = await getStripe().accounts.create({
        type: "express",
        email,
        capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
        business_type: "individual",
      });
      accountId = account.id;
      await userRef.update({ stripeAccountId: accountId });
    }

    // Create onboarding link
    const accountLink = await getStripe().accountLinks.create({
      account: accountId,
      refresh_url: `${BASE_URL}/dashboard/billing?connect=refresh`,
      return_url: `${BASE_URL}/dashboard/billing?connect=success`,
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── 4. Stripe Connect — Check Account Status ────────────────────────────
exports.getConnectStatus = onRequest({ cors: true }, async (req, res) => {
  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "Missing uid" });

  try {
    const userSnap = await db.collection("users").doc(uid).get();
    const accountId = userSnap.data()?.stripeAccountId;
    if (!accountId) return res.json({ connected: false });

    const account = await getStripe().accounts.retrieve(accountId);
    res.json({
      connected: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      accountId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 5. Stripe Checkout — Create Session for Paid Tickets ────────────────
exports.createCheckoutSession = onRequest({ cors: true }, async (req, res) => {
  const { eventId, ticketType, ticketPrice, eventName, creatorUid, customerEmail } = req.body;

  try {
    // Get creator's Stripe account
    const userSnap = await db.collection("users").doc(creatorUid).get();
    const stripeAccountId = userSnap.data()?.stripeAccountId;

    if (!stripeAccountId) {
      return res.status(400).json({ error: "Creator has not connected Stripe yet" });
    }

    const priceInCents = Math.round(ticketPrice * 100);
    const platformFee = Math.round(priceInCents * PLATFORM_FEE);

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `${eventName} — ${ticketType}` },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }],
      mode: "payment",
      customer_email: customerEmail || undefined,
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: { destination: stripeAccountId },
      },
      success_url: `${BASE_URL}/event-success?session_id={CHECKOUT_SESSION_ID}&eventId=${eventId}`,
      cancel_url: `${BASE_URL}/event/${eventId}`,
      metadata: { eventId, ticketType, creatorUid },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── 6. Stripe Webhook — Handle Successful Payments ──────────────────────
exports.stripeWebhook = onRequest({ cors: false }, async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = getStripe().webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata || {};

    if (meta.orderType === "shop") {
      await db.collection("shop_orders").add({
        productId: meta.productId,
        shopId: meta.shopId,
        creatorUid: meta.creatorUid,
        customerEmail: session.customer_email,
        amount: session.amount_total,
        stripeSessionId: session.id,
        fulfilled: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await db.collection("orders").add({
        eventId: meta.eventId,
        ticketType: meta.ticketType,
        creatorUid: meta.creatorUid,
        customerEmail: session.customer_email,
        amount: session.amount_total,
        stripeSessionId: session.id,
        checkedIn: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  res.json({ received: true });
});

// ── 7. Shop Checkout ─────────────────────────────────────────────────────
exports.createShopCheckout = onRequest({ cors: true }, async (req, res) => {
  const { productId, productName, productPrice, shopId, creatorUid, customerEmail } = req.body;
  try {
    const userSnap = await db.collection("users").doc(creatorUid).get();
    const stripeAccountId = userSnap.data()?.stripeAccountId;
    if (!stripeAccountId) {
      return res.status(400).json({ error: "Creator has not connected Stripe yet" });
    }
    const priceInCents = Math.round(productPrice * 100);
    const platformFee = Math.round(priceInCents * PLATFORM_FEE);
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "usd", product_data: { name: productName }, unit_amount: priceInCents }, quantity: 1 }],
      mode: "payment",
      customer_email: customerEmail || undefined,
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: { destination: stripeAccountId },
      },
      success_url: `${BASE_URL}/shop-success?session_id={CHECKOUT_SESSION_ID}&shopId=${shopId}`,
      cancel_url: `${BASE_URL}`,
      metadata: { productId, shopId, creatorUid, orderType: "shop" },
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
