"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

// -----------------------------------------------------------------------------
// AMPProfileView.tsx — route /amp
// Mirrors SecondSundayProfileView's exact theme system.
// Event doc: events/amp-2026  (read on mount; falls back to FALLBACK_EVENT)
// Ticketing: links to GEMM event page /event/amp-2026
// -----------------------------------------------------------------------------

const T = {
  bg:    "#070707",
  bg2:   "#0d0d0d",
  white: "#F2EDE4",
  gold:  "#C9A84C",
  muted: "rgba(242,237,228,0.42)",
  faint: "rgba(242,237,228,0.07)",
  goldD: "rgba(201,168,76,0.3)",
};

const GEMM_EVENT_URL = "https://joingemm.com/event/amp-2026";

const FALLBACK_EVENT = {
  creatorUid: "Kv8RvlTzCdcmrzM9kpMQ1CWbPct2",
  id:          "amp-2026",
  title:       "Art, Mimosas & Pancakes",
  editionLabel:"11TH ANNUAL",
  date:        "2026-07-25",
  startTime:   "8:00 PM",
  endTime:     "Midnight",
  venue:       "The Hawthorn",
  address:     "2231 Washington Ave, St. Louis, MO",
  ageLimit:    "All Ages",
  description: "A one-night group exhibit curated by Brock Seals — celebrating a decade of the St. Louis creative community. 60+ visual artists, 20+ vendors, 9 live performances, and gourmet pancakes from Dan Cakes. One unforgettable night.",
  lineup:      ["60+ ARTISTS", "20+ VENDORS", "9 PERFORMANCES"],
  curator:     "BROCK SEALS",
  curatorHandle: "palettebyseals",
  sessions: [
    { name: "AMP 11",  time: "8PM – 12AM",  note: "Live music · All Ages · 60+ artists · 20+ vendors · 9 performances" },
  ],
  tickets: [
    { tier: "General Admission", price: 25, note: "Single session · 8PM – Midnight · All Ages", active: true },
  ],
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes ampTickerAnim { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  @keyframes ampBlink { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes ampFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  .amp-f1 { animation: ampFadeUp .65s ease both .1s; }
  .amp-f2 { animation: ampFadeUp .75s ease both .28s; }
  .amp-f3 { animation: ampFadeUp .7s ease both .48s; }
  .amp-tcard:hover { border-color: rgba(201,168,76,.45) !important; background: rgba(201,168,76,.04) !important; }
  .amp-navlink:hover { color: #F2EDE4 !important; }
  .amp-primarybtn:hover { background: #C9A84C !important; }
`;

function useCountdown(dateStr: string) {
  const calc = () => {
    const diff = new Date(dateStr + "T20:00:00").getTime() - Date.now();
    if (diff <= 0) return { d:0, h:0, m:0, s:0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

const pad = (n: number) => String(n).padStart(2, "0");

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:".7rem", fontSize:".58rem", letterSpacing:".3em", textTransform:"uppercase", color:T.gold, marginBottom:"1.8rem" }}>
      <span style={{ width:"1.4rem", height:".5px", background:T.gold, display:"block" }} />
      {children}
    </div>
  );
}

function PrimaryBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="amp-primarybtn"
      style={{ display:"inline-block", fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.05rem", letterSpacing:".2em", padding:"1rem 2.8rem", background:T.white, color:T.bg, textDecoration:"none", transition:"background .2s" }}>
      {children}
    </a>
  );
}

function CountdownUnit({ val, label }: { val: number; label: string }) {
  return (
    <div style={{ textAlign:"center", minWidth:"3.5rem" }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,6vw,4.5rem)", lineHeight:1, color:T.white, letterSpacing:".04em" }}>{pad(val)}</div>
      <div style={{ fontSize:".52rem", letterSpacing:".25em", textTransform:"uppercase", color:T.muted, marginTop:".3rem" }}>{label}</div>
    </div>
  );
}

export default function AMPProfileView() {
  const [event, setEvent] = useState<any>(FALLBACK_EVENT);
  const [buyingTier, setBuyingTier] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const handleSubscribe = async () => {
    if (!email.includes("@")) return;
    setSubscribing(true);
    try {
      await addDoc(collection(firestore, "subscribers"), {
        email: email.trim().toLowerCase(),
        eventId: "amp-2026",
        source: "amp",
        createdAt: serverTimestamp(),
      });
      setEmailDone(true);
    } catch (err) {
      console.error("Subscribe error:", err);
      // Still show success to user — error isn't actionable for them
      setEmailDone(true);
    }
    setSubscribing(false);
  };
  const handleBuyTicket = async (tier: any) => {
    setBuyingTier(tier.tier || "all");
    try {
      const res = await fetch("https://us-central1-gemm-8cda2.cloudfunctions.net/createCheckoutSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: "amp-2026",
          ticketType: tier.tier || "General Admission",
          ticketPrice: tier.price || 35,
          eventName: "Art, Mimosas & Pancakes",
          creatorUid: event.creatorUid || "Kv8RvlTzCdcmrzM9kpMQ1CWbPct2",
          customerEmail: "",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Tickets aren't available yet — try again soon.");
        setBuyingTier(null);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      setBuyingTier(null);
    }
  };

  const [redeemCode, setRedeemCode] = useState("");
  const [redeemName, setRedeemName] = useState("");
  const [redeemEmail, setRedeemEmail] = useState("");
  const [redeemState, setRedeemState] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [redeemMsg, setRedeemMsg] = useState("");
  const handleRedeem = async () => {
    if (!redeemCode.trim() || !redeemName.trim() || !redeemEmail.includes("@")) {
      setRedeemState("error"); setRedeemMsg("Please enter your code, name, and a valid email."); return;
    }
    setRedeemState("loading"); setRedeemMsg("");
    try {
      const res = await fetch("https://us-central1-gemm-8cda2.cloudfunctions.net/redeemPromoCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: redeemCode.trim().toUpperCase(), name: redeemName.trim(), email: redeemEmail.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setRedeemState("success");
        setRedeemMsg("You're in! Check your email for your ticket confirmation.");
      } else {
        setRedeemState("error");
        setRedeemMsg(data.error || "That code could not be redeemed.");
      }
    } catch (err) {
      setRedeemState("error");
      setRedeemMsg("Something went wrong. Please try again.");
    }
  };

  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);
  const cd = useCountdown(event.date);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(firestore, "events", "amp-2026"));
        if (snap.exists()) {
          setEvent({ ...FALLBACK_EVENT, ...(snap.data() as any) });
        }
      } catch (e) {}
    }
    load();
  }, []);


  const eventDateLabel = new Date(event.date + "T20:00:00").toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  }).toUpperCase();
  const eventYear = new Date(event.date + "T20:00:00").getFullYear();

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, background:T.bg, color:T.white, overflowX:"hidden", lineHeight:1.6, minHeight:"100vh" }}>

        {/* ================= NAV ================= */}
        <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:300, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.1rem 2rem", background:"rgba(7,7,7,.94)", backdropFilter:"blur(12px)", borderBottom:"0.5px solid " + T.faint }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.05rem", letterSpacing:".18em" }}>ART, MIMOSAS &amp; PANCAKES</span>
          <div style={{ display:"flex", alignItems:"center", gap:"1.8rem" }}>
            {[["Event","#event"],["Tickets","#tickets"]].map(([l,h]) => (
              <a key={l} href={h} className="amp-navlink" style={{ fontSize:".6rem", letterSpacing:".2em", textTransform:"uppercase", color:T.muted, textDecoration:"none", transition:"color .2s" }}>{l}</a>
            ))}
            <button onClick={() => { const el = document.getElementById("tickets"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
              style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:".88rem", letterSpacing:".15em", padding:".42rem 1.25rem", border:"0.5px solid rgba(242,237,228,.18)", color:T.white, textDecoration:"none"}}>
              TICKETS
            </button>
          </div>
        </nav>

        {/* ================= HERO ================= */}
        <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 2rem 5rem", position:"relative", overflow:"hidden", paddingTop:"5rem" }}>
          <video
            data-amp-hero-video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/og-image.png"
            controls={false}
            disablePictureInPicture
            // @ts-ignore
            {...{ "webkit-playsinline": "true", "x-webkit-airplay": "deny" }}
            style={{ position:"absolute", inset:0, zIndex:0, width:"100%", height:"100%", objectFit:"cover", opacity:.45, backgroundColor:"#0a0a0a" }}>
            <source src="/videos/amp-hero.mp4" type="video/mp4" />
          </video>
          <div style={{ position:"absolute", inset:0, zIndex:0, background:"linear-gradient(to bottom, rgba(7,7,7,.6) 0%, rgba(7,7,7,.3) 50%, rgba(7,7,7,.85) 100%), radial-gradient(ellipse at top left, rgba(201,168,76,.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(201,168,76,.05) 0%, transparent 50%)" }} />
          <div style={{ position:"absolute", inset:0, zIndex:0, opacity:.022, backgroundImage:"repeating-linear-gradient(0deg,#fff 0,#fff .5px,transparent .5px,transparent 70px),repeating-linear-gradient(90deg,#fff 0,#fff .5px,transparent .5px,transparent 70px)" }} />
          <div style={{ position:"absolute", top:"6.5rem", right:"2rem", zIndex:2, fontFamily:"'Bebas Neue',sans-serif", fontSize:".8rem", letterSpacing:".12em", border:"0.5px solid rgba(242,237,228,.18)", padding:".38rem .85rem", color:"rgba(242,237,228,.42)" }}>{event.editionLabel}</div>
          <div style={{ position:"relative", zIndex:1 }}>
            <div className="amp-f1" style={{ fontSize:".58rem", letterSpacing:".3em", textTransform:"uppercase", color:T.gold, display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1rem" }}>
              <span style={{ display:"block", width:"2rem", height:".5px", background:T.gold }} />
              Curated by {event.curator} · St. Louis
            </div>
            <h1 className="amp-f2" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(4.5rem,15vw,13rem)", lineHeight:.86, letterSpacing:".015em" }}>
              <span style={{ display:"block", color:T.white }}>ART,</span>
              <span style={{ display:"block", color:T.gold }}>MIMOSAS</span>
              <span style={{ display:"block", color:T.white }}>&amp; PANCAKES</span>
            </h1>
            <div className="amp-f3" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:"2rem", paddingTop:"1.5rem", borderTop:"0.5px solid " + T.faint, gap:"1.5rem", flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:".6rem", letterSpacing:".22em", textTransform:"uppercase", color:T.muted, marginBottom:".4rem" }}>Featuring</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1rem,2.5vw,1.5rem)", letterSpacing:".12em" }}>{event.lineup.join("  ·  ")}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:".56rem", letterSpacing:".22em", textTransform:"uppercase", color:T.goldD, marginBottom:".3rem" }}>Date &amp; Venue</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.1rem,2vw,1.4rem)", letterSpacing:".1em" }}>{eventDateLabel} · {event.startTime} – {event.endTime}</div>
                <div style={{ fontSize:".7rem", color:T.muted, marginTop:".2rem" }}>{event.venue} · St. Louis, MO</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TICKER ================= */}
        <div style={{ borderTop:"0.5px solid " + T.faint, borderBottom:"0.5px solid " + T.faint, overflow:"hidden", padding:".8rem 0" }}>
          <div style={{ display:"flex", width:"max-content", animation:"ampTickerAnim 26s linear infinite" }}>
            {[...Array(4)].map((_,i) => (
              <div key={i} style={{ display:"flex", gap:"3rem", paddingRight:"3rem" }}>
                {["ART MIMOSAS PANCAKES", eventDateLabel, "11TH ANNUAL", "THE HAWTHORN STL", "60+ ARTISTS", "CURATED BY BROCK SEALS"].map((txt,j) => (
                  <span key={j} style={{ display:"flex", alignItems:"center", gap:"3rem", fontFamily:"'Bebas Neue',sans-serif", fontSize:".9rem", letterSpacing:".2em", color:"rgba(242,237,228,.11)", whiteSpace:"nowrap" }}>
                    {txt}<span style={{ width:3, height:3, borderRadius:"50%", background:T.gold, opacity:.28, flexShrink:0 }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ================= COUNTDOWN / EVENT INFO ================= */}
        <section id="event" style={{ padding:"5rem 2rem", borderBottom:"0.5px solid " + T.faint, background:T.bg2 }}>
          <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }}>
            <Label>Countdown to the Exhibit</Label>
            <div style={{ display:"flex", alignItems:"center", gap:"clamp(1rem,3vw,3rem)", flexWrap:"wrap", marginBottom:"3.5rem" }}>
              {[{val:cd.d,label:"Days"},{val:cd.h,label:"Hours"},{val:cd.m,label:"Mins"},{val:cd.s,label:"Secs"}].map(({val,label},i) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:"clamp(1rem,3vw,3rem)" }}>
                  <CountdownUnit val={val} label={label} />
                  {i < 3 && <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3rem", color:"rgba(201,168,76,.18)", lineHeight:1, animation:"ampBlink 1s ease infinite" }}>:</span>}
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1px", background:T.faint }}>
              {[
                { label:"Date",  val: eventDateLabel.split(",")[1]?.trim() || eventDateLabel, sub: String(eventYear) },
                { label:"Time",  val: event.startTime + " – " + event.endTime, sub: "" },
                { label:"Venue", val: event.venue, sub: "2231 Washington Ave" },
                { label:"Age",   val: "All Ages",       sub: "" },
              ].map(d => (
                <div key={d.label} style={{ background:T.bg2, padding:"1.4rem 1.2rem" }}>
                  <div style={{ fontSize:".54rem", letterSpacing:".25em", textTransform:"uppercase", color:T.muted, marginBottom:".5rem" }}>{d.label}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem", letterSpacing:".06em" }}>{d.val}</div>
                  <div style={{ fontSize:".68rem", color:T.muted, marginTop:".2rem" }}>{d.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section style={{ padding:"5rem 2rem", borderBottom:"0.5px solid " + T.faint }}>
          <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem", alignItems:"start" }}>
            <div>
              <Label>About the Exhibit</Label>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.2rem,4.5vw,3.8rem)", lineHeight:.92, letterSpacing:".02em" }}>
                A DECADE<br /><span style={{ color:"rgba(242,237,228,.18)" }}>OF</span><br />CREATIVITY.
              </h2>
            </div>
            <div style={{ paddingTop:".5rem" }}>
              <p style={{ fontSize:".88rem", color:T.muted, lineHeight:1.9 }}>{event.description}</p>
              <p style={{ fontSize:".8rem", color:"rgba(242,237,228,.28)", marginTop:"1.2rem", lineHeight:1.8 }}>Featuring {event.lineup.join(", ")}.</p>
            </div>
          </div>
        </section>

        {/* ================= SESSIONS ================= */}
        {/* ================= TICKETS ================= */}
        <section id="tickets" style={{ padding:"5rem 2rem", borderBottom:"0.5px solid " + T.faint }}>
          <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%" }}>
            <Label>Tickets</Label>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"2.5rem", gap:"1rem", flexWrap:"wrap" }}>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.2rem,5vw,4rem)", letterSpacing:".02em", lineHeight:.9 }}>
                LOCK IN<br /><span style={{ color:"rgba(242,237,228,.18)" }}>BEFORE IT</span><br />SELLS OUT.
              </h2>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1px", background:T.faint, marginBottom:"2rem" }}>
              {event.tickets.filter((t: any) => t.active).map((t: any, i: number) => (
                <button key={t.tier} onClick={() => handleBuyTicket(t)} disabled={buyingTier !== null} className="amp-tcard"
                  style={{ background:T.bg, padding:"2rem 1.5rem", textDecoration:"none", color:"inherit", display:"block", border: i===0 ? "0.5px solid rgba(201,168,76,.28)" : "0.5px solid transparent", transition:"border-color .2s, background .2s", position:"relative", cursor: buyingTier !== null ? "wait" : "pointer", textAlign: "left", width: "100%", fontFamily: "inherit" }}>
                  {i===0 && <div style={{ position:"absolute", top:"1rem", right:"1rem", fontSize:".5rem", letterSpacing:".2em", textTransform:"uppercase", color:T.gold, border:"0.5px solid rgba(201,168,76,.35)", padding:".25rem .6rem" }}>Best Price</div>}
                  <div style={{ fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", color:T.muted, marginBottom:".6rem" }}>{t.tier}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3rem", lineHeight:1, letterSpacing:".02em" }}>${t.price}</div>
                  <div style={{ fontSize:".66rem", color:"rgba(242,237,228,.28)", marginTop:".5rem", letterSpacing:".08em" }}>{t.note}</div>
                  <div style={{ marginTop:"1.5rem", fontSize:".6rem", letterSpacing:".2em", textTransform:"uppercase", color:"rgba(242,237,228,.25)" }}>{buyingTier === t.tier ? "Loading..." : "Select →"}</div>
                </button>
              ))}
            </div>
            <button onClick={() => handleBuyTicket(event.tickets.find((t:any) => t.active) || { tier: "General Admission", price: 35 })} disabled={buyingTier !== null} style={{ display:"inline-block", padding:"1.2rem 2.5rem", background:T.gold, color:T.bg, fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.1rem", letterSpacing:".15em", textDecoration:"none", border:"none", cursor: buyingTier !== null ? "wait" : "pointer", transition:"transform .2s" }}>{buyingTier ? "LOADING..." : `GET TICKETS — ${eventDateLabel.split(",")[1]?.trim() || eventDateLabel}`}</button>
            <p style={{ fontSize:".66rem", color:"rgba(242,237,228,.2)", marginTop:"1rem", letterSpacing:".05em" }}>Tickets sold &amp; processed securely through GEMM · Valid ID required at door for 21+ session</p>

            {/* ===== Comp code redemption ===== */}
            <div style={{ marginTop:"3rem", paddingTop:"2.5rem", borderTop:"0.5px solid " + T.faint }}>
              <div style={{ fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", color:T.gold, marginBottom:".8rem" }}>Have a comp code?</div>
              {redeemState === "success" ? (
                <div style={{ padding:"1.5rem", border:"0.5px solid rgba(201,168,76,.4)", background:"rgba(201,168,76,.06)", fontFamily:"'DM Sans',sans-serif", fontSize:".9rem", color:T.white, letterSpacing:".03em" }}>{redeemMsg}</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:".8rem", maxWidth:"440px" }}>
                  <input value={redeemCode} onChange={e=>setRedeemCode(e.target.value)} placeholder="Code" style={{ background:T.bg, border:"0.5px solid rgba(242,237,228,.2)", color:T.white, padding:".9rem 1rem", fontFamily:"'DM Sans',sans-serif", fontSize:".85rem", letterSpacing:".1em", textTransform:"uppercase", outline:"none" }} />
                  <input value={redeemName} onChange={e=>setRedeemName(e.target.value)} placeholder="Full name" style={{ background:T.bg, border:"0.5px solid rgba(242,237,228,.2)", color:T.white, padding:".9rem 1rem", fontFamily:"'DM Sans',sans-serif", fontSize:".85rem", outline:"none" }} />
                  <input value={redeemEmail} onChange={e=>setRedeemEmail(e.target.value)} placeholder="Email" type="email" style={{ background:T.bg, border:"0.5px solid rgba(242,237,228,.2)", color:T.white, padding:".9rem 1rem", fontFamily:"'DM Sans',sans-serif", fontSize:".85rem", outline:"none" }} />
                  <button onClick={handleRedeem} disabled={redeemState==="loading"} style={{ padding:"1rem 2rem", background:T.white, color:T.bg, fontFamily:"'Bebas Neue',sans-serif", fontSize:"1rem", letterSpacing:".15em", border:"none", cursor:redeemState==="loading"?"wait":"pointer", marginTop:".4rem" }}>{redeemState==="loading"?"REDEEMING...":"REDEEM CODE"}</button>
                  {redeemState==="error" && <div style={{ fontSize:".75rem", color:"#e57373", letterSpacing:".03em", marginTop:".2rem" }}>{redeemMsg}</div>}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ================= EMAIL CAPTURE ================= */}
        <section style={{ padding:"5rem 2rem", borderBottom:"0.5px solid " + T.faint, background:T.bg2 }}>
          <div style={{ maxWidth:"960px", margin:"0 auto", width:"100%", textAlign:"center" }}>
            <Label>Stay in the Loop</Label>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,6vw,5rem)", lineHeight:.9, letterSpacing:".02em", marginBottom:"1rem" }}>
              DON'T MISS<br /><span style={{ color:"rgba(242,237,228,.18)" }}>THIS</span> YEAR.
            </h2>
            <p style={{ fontSize:".85rem", color:T.muted, marginBottom:"2rem", lineHeight:1.8 }}>Ticket drops, artist announcements, and exhibit updates — straight to your inbox.</p>
            {emailDone ? (
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem", letterSpacing:".12em", color:T.gold }}>SEE YOU AT AMP ✓</div>
            ) : (
              <div style={{ display:"flex", border:"0.5px solid rgba(242,237,228,.14)", maxWidth:"400px", margin:"0 auto" }}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", padding:".9rem 1.1rem", fontFamily:"'DM Sans',sans-serif", fontSize:".85rem", color:T.white, fontWeight:300 }} />
                <button onClick={handleSubscribe} disabled={subscribing}
                  style={{ background:T.white, border:"none", padding:".9rem 1.3rem", fontFamily:"'DM Sans',sans-serif", fontSize:".6rem", letterSpacing:".18em", textTransform:"uppercase", fontWeight:500, cursor:"pointer", color:T.bg, whiteSpace:"nowrap" }}>
                  Notify Me
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer style={{ padding:"1.8rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap" }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:".9rem", letterSpacing:".18em", color:"rgba(242,237,228,.15)" }}>ART, MIMOSAS &amp; PANCAKES</div>
            <div style={{ fontSize:".58rem", color:"rgba(242,237,228,.12)", letterSpacing:".08em", marginTop:".2rem" }}>Curated by {event.curator} · Saint Louis, USA</div>
          </div>
          <div style={{ display:"flex", gap:"1.5rem" }}>
            <a href="https://instagram.com/artmimosaspancakes" target="_blank" rel="noopener noreferrer" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:"rgba(242,237,228,.2)", textDecoration:"none" }}>Instagram</a>
            <a href={"/" + event.curatorHandle} style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:"rgba(242,237,228,.2)", textDecoration:"none" }}>Brock's Page</a>
            <a href={GEMM_EVENT_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:"rgba(242,237,228,.2)", textDecoration:"none" }}>Tickets</a>
          </div>
          <div style={{ fontSize:".58rem", color:"rgba(242,237,228,.1)", letterSpacing:".06em" }}>
            Powered by <a href="https://joingemm.com" style={{ color:"rgba(242,237,228,.2)", textDecoration:"none" }}>GEMM</a>
          </div>
        </footer>

      </div>
    </>
  );
}
