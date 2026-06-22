"use client";
import React, { useState } from "react";

const swatches = [
  { id: "black", color: "#111111" },
  { id: "charcoal", color: "#4a4a4a" },
  { id: "teal", color: "#1a6b5a" },
  { id: "blush", color: "#f0d0d0" },
  { id: "plum", color: "#3d1f5a" },
  { id: "ocean", color: "#2a6080" },
  { id: "rose", color: "#e8c0cc" },
  { id: "cream", color: "#f5f0d0" },
  { id: "navy", color: "#2a2a70" },
  { id: "gray", color: "#888888" },
  { id: "mint", color: "#b0e0c8" },
  { id: "berry", color: "#9a2070" },
];

export default function HeroSection() {
  const [activeColor, setActiveColor] = useState("black");
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f5f5f3", borderRadius: "16px", overflow: "hidden" }}>
      <nav style={{ background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: "0.5px solid #e0e0d8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "15px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#111" }} />
          </div>
          GEMM
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#111", cursor: "pointer" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#e74c3c" }} />
            UPCOMING EVENTS
          </div>
          <button style={{ padding: "7px 16px", borderRadius: "50px", border: "1.5px solid #111", fontSize: "12px", fontWeight: 600, cursor: "pointer", background: "white", color: "#111" }}>START FOR FREE</button>
          <button style={{ padding: "7px 16px", borderRadius: "50px", background: "#111", color: "white", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "none" }}>DASHBOARD</button>
        </div>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "560px" }}>
        <div style={{ padding: "56px 40px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#e6f9ef", color: "#0d7a44", borderRadius: "50px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, marginBottom: "28px", width: "fit-content" }}>
            Free to start - no credit card required
          </div>
          <h1 style={{ fontSize: "clamp(36px, 4.5vw, 58px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-2px", color: "#111", margin: "0 0 20px" }}>
            One link.<br />Infinite<br />potential.
          </h1>
          <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.6, margin: "0 0 36px", maxWidth: "380px" }}>
            Your shop, events, services, and brand - all in one place. Built for independent creators who move fast.
          </p>
          <button style={{ padding: "14px 28px", background: "#111", color: "white", borderRadius: "50px", fontSize: "15px", fontWeight: 700, cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: "8px", width: "fit-content" }}>
            Start for free
          </button>
        </div>

        <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "14px", overflow: "hidden" }}>
          <div style={{ width: "200px", height: "400px", borderRadius: "28px", border: "2.5px solid #111", background: "#f0f0ee", overflow: "hidden", flexShrink: 0, opacity: 0.55 }}>
            <div style={{ width: "70px", height: "22px", background: "#111", borderRadius: "0 0 14px 14px", margin: "0 auto" }} />
            <div style={{ padding: "10px 14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: "#888", marginBottom: "2px" }}>MERCH</div>
              <div style={{ fontSize: "9px", letterSpacing: "1px", color: "#aaa", marginBottom: "12px" }}>GEMM COLLECTION</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                <div style={{ gridColumn: "span 2", borderRadius: "8px", background: "#d4d0c8", position: "relative", height: "110px", overflow: "hidden" }}>
                  <svg viewBox="0 0 180 110" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "110px", display: "block" }}>
                    <rect width="180" height="110" fill="#d4d0c8" />
                    <rect x="55" y="20" width="70" height="70" rx="6" fill="#bbb8b0" />
                    <rect x="70" y="35" width="40" height="40" rx="3" fill="#a8a49c" />
                    <circle cx="90" cy="55" r="10" fill="#ccc9c0" />
                  </svg>
                  <div style={{ position: "absolute", bottom: "6px", right: "6px", background: "white", borderRadius: "6px", padding: "2px 6px", fontSize: "9px", fontWeight: 700, color: "#111" }}>$150</div>
                  <div style={{ position: "absolute", bottom: "6px", left: "6px", background: "white", borderRadius: "6px", padding: "2px 6px", fontSize: "9px", fontWeight: 700, color: "#111" }}>PACK</div>
                </div>
                <div style={{ borderRadius: "8px", background: "#ccc9c0", position: "relative", height: "80px", overflow: "hidden" }}>
                  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "80px", display: "block" }}>
                    <rect width="80" height="80" fill="#ccc9c0" />
                    <path d="M15 20 L30 14 Q40 10 50 14 L65 20 L58 36 L50 30 L50 68 L30 68 L30 30 L22 36 Z" fill="#b0ada4" />
                  </svg>
                  <div style={{ position: "absolute", bottom: "6px", right: "6px", background: "white", borderRadius: "6px", padding: "2px 6px", fontSize: "9px", fontWeight: 700, color: "#111" }}>$49</div>
                  <div style={{ position: "absolute", bottom: "6px", left: "6px", background: "white", borderRadius: "6px", padding: "2px 6px", fontSize: "9px", fontWeight: 700, color: "#111" }}>TEE</div>
                </div>
                <div style={{ borderRadius: "8px", background: "#d8d5cc", position: "relative", height: "80px", overflow: "hidden" }}>
                  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "80px", display: "block" }}>
                    <rect width="80" height="80" fill="#d8d5cc" />
                    <ellipse cx="40" cy="52" rx="30" ry="6" fill="#b8b5ac" />
                    <path d="M18 52 Q18 28 40 26 Q62 28 62 52 Z" fill="#bcb9b0" />
                    <rect x="32" y="24" width="16" height="6" rx="3" fill="#a8a49c" />
                  </svg>
                  <div style={{ position: "absolute", bottom: "6px", right: "6px", background: "white", borderRadius: "6px", padding: "2px 6px", fontSize: "9px", fontWeight: 700, color: "#111" }}>$85</div>
                  <div style={{ position: "absolute", bottom: "6px", left: "6px", background: "white", borderRadius: "6px", padding: "2px 6px", fontSize: "9px", fontWeight: 700, color: "#111" }}>HAT</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ width: "220px", height: "460px", borderRadius: "28px", border: "2.5px solid #111", background: "white", overflow: "hidden", flexShrink: 0 }}>
            <div style={{ width: "70px", height: "22px", background: "#111", borderRadius: "0 0 14px 14px", margin: "0 auto" }} />
            <div style={{ padding: "12px 14px 0", textAlign: "center" }}>
              <div style={{ position: "relative", width: "52px", height: "52px", margin: "0 auto 4px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#e8e8e4", border: "2px solid #ddd", overflow: "hidden" }}>
                  <svg viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" style={{ width: "52px", height: "52px" }}>
                    <rect width="52" height="52" fill="#e0dfd8" />
                    <circle cx="26" cy="20" r="10" fill="#c0bdb5" />
                    <ellipse cx="26" cy="44" rx="16" ry="10" fill="#c8c5bd" />
                  </svg>
                </div>
                <div style={{ position: "absolute", bottom: "-2px", right: "-2px", background: "#4f94ef", color: "white", borderRadius: "4px", fontSize: "7px", fontWeight: 700, padding: "1px 4px" }}>PRO</div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#111", margin: "6px 0 1px" }}>@yourname</div>
              <div style={{ fontSize: "10px", color: "#888", marginBottom: "12px" }}>Digital Creator and Model</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {["Latest Drop", "My Portfolio", "Join Discord"].map((label) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f5f5f3", borderRadius: "8px", padding: "9px 10px", fontSize: "11px", fontWeight: 600, color: "#111" }}>
                    {label}<span style={{ fontSize: "10px", color: "#aaa" }}>-&gt;</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 40px 20px", overflowX: "auto" }}>
        {swatches.map((s) => (
          <div key={s.id} onClick={() => setActiveColor(s.id)} style={{ width: activeColor === s.id ? "70px" : "36px", height: "36px", borderRadius: activeColor === s.id ? "50px" : "50%", background: s.color, flexShrink: 0, cursor: "pointer", transition: "width 0.2s ease, border-radius 0.2s ease" }} />
        ))}
      </div>
    </div>
  );
}