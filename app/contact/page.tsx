"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const res = await fetch("https://us-central1-gemm-8cda2.cloudfunctions.net/sendContactEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) { setStatus("success"); setName(""); setEmail(""); setMessage(""); }
      else setStatus("error");
    } catch { setStatus("error"); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}input,textarea{color:#fff!important}input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.3)!important}input:focus,textarea:focus{outline:none;border-color:rgba(99,102,241,0.6)!important}`}</style>

      {/* Nav */}
      <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" style={{ fontWeight: 900, fontSize: 20, color: "#fff", textDecoration: "none", letterSpacing: "-0.02em" }}>GEMM</a>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 600 }}>Home</a>
          <a href="/pricing" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 600 }}>Pricing</a>
          <a href="/dashboard" style={{ fontSize: 13, color: "#fff", textDecoration: "none", fontWeight: 700, padding: "8px 16px", background: "rgba(255,255,255,0.1)", borderRadius: 999 }}>Dashboard →</a>
        </div>
      </header>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "80px 24px 60px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", opacity: 0.4, marginBottom: 16 }}>✦ CONTACT</div>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 20 }}>Get in touch</h1>
        <p style={{ fontSize: 16, opacity: 0.5, maxWidth: 480, margin: "0 auto" }}>Have a question or want to work together? We'd love to hear from you.</p>
      </div>

      {/* Form */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 24px 80px" }}>
        <div style={{ width: "100%", maxWidth: 520, borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", padding: 40 }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <div style={{ fontWeight: 900, fontSize: 24, letterSpacing: "-0.02em", marginBottom: 8 }}>Message sent!</div>
              <div style={{ opacity: 0.4, fontSize: 14, marginBottom: 32 }}>We'll get back to you within 24 hours.</div>
              <button onClick={() => setStatus("idle")} style={{ padding: "12px 28px", borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Send another →</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.4, marginBottom: 8 }}>YOUR NAME</div>
                <input type="text" placeholder="Crystal B" value={name} onChange={e => setName(e.target.value)}
                  style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 14, fontFamily: "inherit" }}/>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.4, marginBottom: 8 }}>EMAIL</div>
                <input type="email" placeholder="hello@example.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 14, fontFamily: "inherit" }}/>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", opacity: 0.4, marginBottom: 8 }}>MESSAGE</div>
                <textarea placeholder="Tell us what's on your mind..." value={message} onChange={e => setMessage(e.target.value)} rows={5}
                  style={{ width: "100%", padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", fontSize: 14, fontFamily: "inherit", resize: "vertical" }}/>
              </div>
              {status === "error" && <div style={{ fontSize: 13, color: "#ef4444" }}>Please fill out all fields and try again.</div>}
              <button type="submit" disabled={status === "sending"}
                style={{ padding: "16px", borderRadius: 12, background: "#6366f1", color: "#fff", border: "none", fontWeight: 800, fontSize: 15, cursor: "pointer", opacity: status === "sending" ? 0.6 : 1, transition: "opacity .2s", marginTop: 8 }}>
                {status === "sending" ? "Sending..." : "Send Message →"}
              </button>
            </form>
          )}
        </div>
      </div>

      <footer style={{ padding: "24px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", fontSize: 12, opacity: 0.3 }}>
        © 2026 GEMM. All rights reserved.
      </footer>
    </div>
  );
}
