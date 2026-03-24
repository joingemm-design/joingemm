"use client";
import { useState } from "react";

const PLANS = [
  {
    name: "Spark",
    desc: "Perfect for getting started",
    color: "#ffffff",
    textColor: "#000000",
    monthly: { price: "Free", link: "/onboarding" },
    yearly:  { price: "Free", link: "/onboarding" },
    features: [
      "Unlimited Event Publishing",
      "1 Link-in-Bio Page",
      "Up to 5 Links",
      "1 Dynamic QR Code",
      "Basic Analytics",
      "GEMM Watermark",
    ],
    locked: [
      "Shop",
      "Portfolio",
      "Services & Quotes",
      "Custom Branding",
      "CRM",
      "Press Section",
      "Custom Domain",
    ],
  },
  {
    name: "Velocity",
    desc: "For creators ready to grow",
    color: "#6366f1",
    textColor: "#ffffff",
    featured: true,
    monthly: { price: "$15/mo", link: "https://buy.stripe.com/9B65kD30l72VenGdh54gg03" },
    yearly:  { price: "$10/mo", link: "https://buy.stripe.com/8x2aEXdEZ1IB7Zi4Kz4gg01" },
    features: [
      "Everything in Spark",
      "No Watermark",
      "Unlimited Links",
      "5 Link-in-Bio Pages",
      "1 E-commerce Shop (10 products)",
      "Portfolio",
      "Services & Quote Requests",
      "CRM — 500 Contacts",
      "Business Analytics",
      "10 Dynamic QR Codes",
    ],
    locked: [
      "Custom Branding",
      "Press Section",
      "Custom Domain",
      "Advanced Analytics",
    ],
  },
  {
    name: "Empire",
    desc: "The operating system for dominance",
    color: "#f59e0b",
    textColor: "#000000",
    monthly: { price: "$35/mo", link: "https://buy.stripe.com/3cIbJ1gRb0Ex6Ve1yn4gg04" },
    yearly:  { price: "$24/mo", link: "https://buy.stripe.com/8x28wP58taf793m90P4gg02" },
    features: [
      "Everything in Velocity",
      "Custom Branding",
      "Custom Domain",
      "Press Section",
      "5 E-commerce Shops",
      "Unlimited Products",
      "Full CRM (Unlimited, Tags, Notes, Export)",
      "Advanced Analytics",
      "Unlimited QR Codes",
      "Advanced Affiliate Network",
      "10 Link-in-Bio Pages",
      "Priority Support",
    ],
    locked: [],
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>

      <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" style={{ fontWeight: 900, fontSize: 20, color: "#fff", textDecoration: "none" }}>GEMM</a>
        <a href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 600 }}>← Go Home</a>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 120px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", opacity: 0.4, marginBottom: 16 }}>✦ PRICING</div>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 16 }}>Simple, transparent pricing.</h1>
          <p style={{ fontSize: 16, opacity: 0.5, marginBottom: 40 }}>Start free. Scale when you're ready.</p>

          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.06)", borderRadius: 100, padding: 4, gap: 4 }}>
            <button onClick={() => setYearly(false)} style={{ padding: "8px 24px", borderRadius: 100, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", background: !yearly ? "#fff" : "transparent", color: !yearly ? "#000" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>MONTHLY</button>
            <button onClick={() => setYearly(true)} style={{ padding: "8px 24px", borderRadius: 100, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", background: yearly ? "#fff" : "transparent", color: yearly ? "#000" : "rgba(255,255,255,0.5)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}>
              YEARLY <span style={{ background: "#22c55e", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 100 }}>SAVE 30%</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, alignItems: "start" }}>
          {PLANS.map((plan) => {
            const current = yearly ? plan.yearly : plan.monthly;
            return (
              <div key={plan.name} style={{ background: plan.featured ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${plan.featured ? "rgba(99,102,241,0.4)" : plan.name === "Empire" ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 24, padding: 32, position: "relative" }}>
                {plan.featured && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#6366f1", color: "#fff", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", padding: "4px 16px", borderRadius: 100, whiteSpace: "nowrap" }}>MOST POPULAR</div>}
                {plan.name === "Empire" && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "#000", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", padding: "4px 16px", borderRadius: 100, whiteSpace: "nowrap" }}>BEST VALUE</div>}

                <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 8 }}>{plan.name} {plan.name === "Empire" && "👑"}</h2>
                <p style={{ fontSize: 14, opacity: 0.5, marginBottom: 24 }}>{plan.desc}</p>

                <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 4 }}>{current.price}</div>
                {yearly && plan.name !== "Spark" && <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 16 }}>billed annually</div>}

                <button
                  onClick={() => { window.location.href = current.link; }}
                  style={{ display: "block", width: "100%", padding: "14px 0", borderRadius: 12, background: plan.color, color: plan.textColor, fontWeight: 800, fontSize: 15, textAlign: "center", border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 28, marginTop: 20, transition: "opacity 0.2s" }}
                  onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseOut={e => (e.currentTarget.style.opacity = "1")}
                >
                  {plan.name === "Spark" ? "Get Started Free →" : "Get Started →"}
                </button>

                {/* Included features */}
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10, marginBottom: plan.locked.length > 0 ? 20 : 0 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ fontSize: 14, opacity: 0.8, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: plan.name === "Spark" ? "#22c55e" : plan.color, fontSize: 16, flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                {/* Locked features */}
                {plan.locked.length > 0 && (
                  <>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "16px 0" }}/>
                    <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                      {plan.locked.map((f) => (
                        <li key={f} style={{ fontSize: 14, opacity: 0.3, display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 16, flexShrink: 0 }}>✗</span> {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison note */}
        <div style={{ marginTop: 80, padding: 32, borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", opacity: 0.4, marginBottom: 12 }}>WHY GEMM?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginTop: 24 }}>
            {[
              { icon: "🎟", title: "Events + Ticketing", desc: "Sell tickets with no monthly fee on Spark" },
              { icon: "🔗", title: "Link-in-Bio", desc: "Your entire brand in one link" },
              { icon: "🛍", title: "Shop", desc: "Sell products directly to your audience" },
              { icon: "📊", title: "CRM", desc: "Own your audience data forever" },
              { icon: "🎨", title: "Custom Branding", desc: "Your colors, your fonts, your domain" },
              { icon: "⚡", title: "All-in-One", desc: "No more juggling 5 different tools" },
            ].map(item => (
              <div key={item.title}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 13, opacity: 0.4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ padding: "24px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", fontSize: 12, opacity: 0.3 }}>
        © 2026 GEMM. All rights reserved.
      </footer>
    </div>
  );
}
