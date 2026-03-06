"use client";

// app/page.tsx — GEMM Landing Page
// 100% structural match to wavey.live
// ─────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// ── SVG Icons ───────────────────────────────────────────────────────────────
const ZapIcon = ({ size = 14, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
  </svg>
);
const ArrowRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);
const ArrowUpRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
  </svg>
);
const CheckIcon = ({ size = 14, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);
const StarIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="2">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
  </svg>
);
const CrownIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="2">
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/>
    <path d="M5 21h14"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
  </svg>
);
const UsersIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>
  </svg>
);
const ChartIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
);
const ShoppingBagIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/>
  </svg>
);

// ── Theme config (matches Wavey's theme system) ─────────────────────────────
const THEMES: Record<string, Record<string, string>> = {
  clean:    { "--bg":"#ffffff","--bg2":"#f5f5f5","--text":"#0a0a0a","--muted":"rgba(10,10,10,0.45)","--border":"#e5e5e5","--card":"#ffffff","--nav":"rgba(255,255,255,0.95)","--accent":"#000000","--accent2":"#525252" },
  midnight: { "--bg":"#09090b","--bg2":"#111113","--text":"#f4f4f5","--muted":"rgba(244,244,245,0.4)","--border":"#27272a","--card":"#111113","--nav":"rgba(9,9,11,0.95)","--accent":"#ffffff","--accent2":"#a1a1aa" },
  forest:   { "--bg":"#022c22","--bg2":"#033a2c","--text":"#ecfdf5","--muted":"rgba(236,253,245,0.4)","--border":"#047857","--card":"#033a2c","--nav":"rgba(2,44,34,0.95)","--accent":"#34d399","--accent2":"#6ee7b7" },
  cotton:   { "--bg":"#fdf2f8","--bg2":"#fce7f3","--text":"#4a044e","--muted":"rgba(74,4,78,0.4)","--border":"#fbcfe8","--card":"#ffffff","--nav":"rgba(253,242,248,0.95)","--accent":"#ff9a9e","--accent2":"#fecdd3" },
  cyber:    { "--bg":"#09090b","--bg2":"#0d0d1a","--text":"#00f0ff","--muted":"rgba(0,240,255,0.4)","--border":"#1a1a3e","--card":"#0d0d1a","--nav":"rgba(9,9,11,0.95)","--accent":"#ff0099","--accent2":"#00f0ff" },
  ocean:    { "--bg":"#082f49","--bg2":"#0c4a6e","--text":"#f0f9ff","--muted":"rgba(240,249,255,0.4)","--border":"#0369a1","--card":"#0c4a6e","--nav":"rgba(12,74,110,0.95)","--accent":"#38bdf8","--accent2":"#7dd3fc" },
  sunset:   { "--bg":"#fff1f2","--bg2":"#ffe4e6","--text":"#881337","--muted":"rgba(136,19,55,0.4)","--border":"#fecdd3","--card":"#ffffff","--nav":"rgba(255,241,242,0.95)","--accent":"#fb7185","--accent2":"#fda4af" },
  sand:     { "--bg":"#fdfbf7","--bg2":"#fef3c7","--text":"#451a03","--muted":"rgba(69,26,3,0.4)","--border":"#fde68a","--card":"#ffffff","--nav":"rgba(253,251,247,0.95)","--accent":"#d97706","--accent2":"#f59e0b" },
  royal:    { "--bg":"#1e1b4b","--bg2":"#23205a","--text":"#e0e7ff","--muted":"rgba(224,231,255,0.4)","--border":"#4338ca","--card":"#23205a","--nav":"rgba(30,27,75,0.95)","--accent":"#818cf8","--accent2":"#a5b4fc" },
  dracula:  { "--bg":"#282a36","--bg2":"#2e3044","--text":"#f8f8f2","--muted":"rgba(248,248,242,0.4)","--border":"#44475a","--card":"#2e3044","--nav":"rgba(40,42,54,0.95)","--accent":"#bd93f9","--accent2":"#ff79c6" },
  matcha:   { "--bg":"#f0fdf4","--bg2":"#dcfce7","--text":"#14532d","--muted":"rgba(20,83,45,0.4)","--border":"#bbf7d0","--card":"#ffffff","--nav":"rgba(240,253,244,0.95)","--accent":"#22c55e","--accent2":"#4ade80" },
  velvet:   { "--bg":"#4a044e","--bg2":"#5b0a60","--text":"#fae8ff","--muted":"rgba(250,232,255,0.4)","--border":"#701a75","--card":"#5b0a60","--nav":"rgba(74,4,78,0.95)","--accent":"#e879f9","--accent2":"#d946ef" },
};

const SWATCHES = [
  { key:"clean",    bg:"#000000" },
  { key:"midnight", bg:"linear-gradient(135deg,#050505,#18181b)" },
  { key:"forest",   bg:"linear-gradient(135deg,#022c22,#064e3b)" },
  { key:"cotton",   bg:"linear-gradient(135deg,#fff1eb,#fdf2f8)" },
  { key:"cyber",    bg:"linear-gradient(135deg,#09090b,#2e0249)" },
  { key:"ocean",    bg:"linear-gradient(135deg,#082f49,#0c4a6e)" },
  { key:"sunset",   bg:"linear-gradient(135deg,#fff1f2,#ffe4e6)" },
  { key:"sand",     bg:"linear-gradient(135deg,#fdfbf7,#fef3c7)" },
  { key:"royal",    bg:"linear-gradient(135deg,#1e1b4b,#312e81)" },
  { key:"dracula",  bg:"linear-gradient(135deg,#282a36,#44475a)" },
  { key:"matcha",   bg:"linear-gradient(135deg,#f0fdf4,#dcfce7)" },
  { key:"velvet",   bg:"linear-gradient(135deg,#4a044e,#701a75)" },
];

const PLANS = [
  {
    key: "spark", name: "Spark", tagline: "Free forever.",
    monthly: 0, yearly: 0,
    badge: null, featured: false, btnStyle: "outline",
    features: ["Unlimited Event Publishing","1 Link-in-Bio Page","1 Dynamic QR Code","Basic Analytics","Watermark"],
    checkColor: "currentColor",
  },
  {
    key: "velocity", name: "Velocity", tagline: "For creators hitting their stride.",
    monthly: 15, yearly: 10,
    badge: { label: "Most Popular", bg: "var(--text)", fg: "var(--bg)" },
    featured: true, btnStyle: "solid",
    features: ["Everything in Spark","Business Analytics","5 Link-in-Bio Pages","1 E-commerce Shop","10 Dynamic QR Codes","No Watermark"],
    checkColor: "currentColor",
  },
  {
    key: "empire", name: "Empire", tagline: "The operating system for dominance.",
    monthly: 35, yearly: 24,
    badge: { label: "Best Value", bg: "#fbbf24", fg: "#000" },
    featured: true, btnStyle: "gold",
    features: ["Everything in Velocity","Advanced Affiliate Network","10 Link-in-Bio Pages","5 E-commerce Shops","Unlimited QR Codes","Priority Support"],
    checkColor: "#fbbf24",
  },
];

// ── Loading Screen (matches Wavey) ──────────────────────────────────────────
function LoadingScreen({ progress, visible }: { progress: number; visible: boolean }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "#000", cursor: "wait",
      opacity: visible ? 1 : 0, pointerEvents: visible ? "all" : "none",
      transition: "opacity 0.6s ease",
    }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 192, height: 192, borderRadius: "50%", opacity: 0.3,
          background: "radial-gradient(circle, rgba(147,51,234,1) 0%, rgba(0,0,0,0) 70%)",
        }}/>
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 0 20px rgba(255,255,255,0.8)" }}/>
            <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.05em", color: "#fff" }}>GEMM</span>
          </div>
          <div style={{ height: 4, width: 192, background: "#111", borderRadius: 9999, overflow: "hidden", marginTop: 16 }}>
            <div style={{
              height: "100%", background: "#fff",
              boxShadow: "0 0 10px rgba(255,255,255,0.8)",
              width: `${Math.min(progress, 100)}%`, transition: "width 0.3s ease",
            }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sales Simulator Card (matches Wavey with +$XX popup) ────────────────────
function SalesSimulator() {
  const [amount, setAmount] = useState(1240);
  const [gain, setGain] = useState<number | null>(null);
  const [showGain, setShowGain] = useState(false);

  const handleClick = () => {
    const add = Math.floor(Math.random() * 80) + 10;
    setAmount(prev => prev + add);
    setGain(add);
    setShowGain(true);
    setTimeout(() => setShowGain(false), 1200);
  };

  return (
    <div style={{
      width: "100%", maxWidth: 280, padding: 24, borderRadius: 32,
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      display: "flex", flexDirection: "column", gap: 16,
      background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)",
      transition: "transform 0.3s", cursor: "default", position: "relative",
    }}>
      {/* Floating gain badge */}
      {gain !== null && (
        <div style={{
          position: "absolute", top: 12, right: 16,
          background: "var(--text)", color: "var(--bg)",
          padding: "4px 10px", borderRadius: 99,
          fontSize: 12, fontWeight: 900, display: "flex", alignItems: "center", gap: 4,
          opacity: showGain ? 1 : 0, transform: showGain ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.4s ease", pointerEvents: "none",
        }}>
          ↗ +${gain}
        </div>
      )}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6, marginBottom: 4 }}>Sales Simulator</div>
        <div style={{ fontSize: 36, fontFamily: "'DM Mono', monospace", fontWeight: 900, letterSpacing: "-0.05em", transition: "all 0.3s" }}>${amount.toLocaleString()}</div>
      </div>
      <button onClick={handleClick}
        style={{
          width: "100%", padding: 12, borderRadius: 12, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)",
          cursor: "pointer", fontSize: 14, fontFamily: "inherit",
          transition: "transform 0.1s", position: "relative", overflow: "hidden",
        }}
        onMouseDown={e => (e.currentTarget.style.transform = "scale(0.95)")}
        onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
        <ZapIcon size={16}/> Try Me
      </button>
    </div>
  );
}

// ── Phone Notch ─────────────────────────────────────────────────────────────
function PhoneNotch() {
  return (
    <div style={{
      position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
      width: 80, height: 24, background: "#000", borderRadius: 99, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    }}>
      <span className="pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }}/>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f97316", opacity: 0.5 }}/>
    </div>
  );
}

// ── Feature Card (for Team section) ─────────────────────────────────────────
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div style={{
      padding: 24, borderRadius: 24,
      border: "1px solid var(--border)", background: "rgba(128,128,128,0.03)",
    }}>
      <div style={{ marginBottom: 12, color: "var(--text)" }}>{icon}</div>
      <p style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}>{title}</p>
      <p style={{ fontSize: 12, opacity: 0.6, fontWeight: 500, marginTop: 4 }}>{desc}</p>
    </div>
  );
}

// ── Revenue Chart — Interactive Simulator (matches Wavey) ────────────────────
function RevenueChart() {
  const [products, setProducts] = useState(3);
  const [avgPrice, setAvgPrice] = useState(45);
  const [followers, setFollowers] = useState(5000);
  const [animated, setAnimated] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Calculate revenue projections
  const conversionRate = 0.02 + (products * 0.003);
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = i + 1;
    const growth = Math.pow(1.35 + (products * 0.05), month);
    const sales = Math.floor(followers * conversionRate * growth * (avgPrice / 40));
    return { month, revenue: Math.min(sales, 50000) };
  });
  const maxRev = Math.max(...monthlyData.map(d => d.revenue), 100);
  const totalProjected = monthlyData.reduce((s, d) => s + d.revenue, 0);

  // Animate on scroll into view
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setAnimated(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Build SVG path from data
  const chartW = 500, chartH = 220, padTop = 10, padBot = 30;
  const usableH = chartH - padTop - padBot;
  const points = monthlyData.map((d, i) => ({
    x: (i / (monthlyData.length - 1)) * chartW,
    y: padTop + usableH - (d.revenue / maxRev) * usableH,
  }));

  // Smooth curve through points
  function buildCurve(pts: {x:number;y:number}[]) {
    if (pts.length < 2) return "";
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  const curvePath = buildCurve(points);
  const fillPath = curvePath + ` L${chartW} ${chartH - padBot} L0 ${chartH - padBot} Z`;
  const costY = padTop + usableH - (24 * 6 / maxRev) * usableH; // $24/mo * 6 = $144 total cost line

  const sliderTrack: React.CSSProperties = {
    width: "100%", height: 4, borderRadius: 99, appearance: "none",
    background: "var(--border)", outline: "none", cursor: "pointer",
    accentColor: "var(--text)",
  };

  return (
    <div ref={chartRef} style={{
      borderRadius: 32, border: "1px solid var(--border)",
      background: "var(--card)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      position: "relative", overflow: "hidden",
      transition: "transform 0.3s", padding: "24px 28px 20px",
      display: "flex", flexDirection: "column",
    }}
    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.01)")}
    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(128,128,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text)" }}/>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6 }}>Revenue Engine</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
          Est. <span style={{ color: "#22c55e", fontWeight: 900, fontSize: 14 }}>${totalProjected.toLocaleString()}</span>
          <span style={{ fontSize: 10, opacity: 0.5 }}>/6mo</span>
        </div>
      </div>

      {/* Interactive sliders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.4, marginBottom: 6 }}>
            Products: <span style={{ opacity: 1, color: "var(--text)" }}>{products}</span>
          </div>
          <input type="range" min={1} max={10} value={products} onChange={e => setProducts(+e.target.value)} style={sliderTrack}/>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.4, marginBottom: 6 }}>
            Avg Price: <span style={{ opacity: 1, color: "var(--text)" }}>${avgPrice}</span>
          </div>
          <input type="range" min={10} max={200} step={5} value={avgPrice} onChange={e => setAvgPrice(+e.target.value)} style={sliderTrack}/>
        </div>
        <div>
          <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.4, marginBottom: 6 }}>
            Followers: <span style={{ opacity: 1, color: "var(--text)" }}>{(followers / 1000).toFixed(1)}k</span>
          </div>
          <input type="range" min={500} max={100000} step={500} value={followers} onChange={e => setFollowers(+e.target.value)} style={sliderTrack}/>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, position: "relative", minHeight: 200 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.25"/>
              <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
            </linearGradient>
            <clipPath id="revealClip">
              <rect x="0" y="0" width={animated ? chartW : 0} height={chartH} style={{ transition: "width 1.5s cubic-bezier(0.4,0,0.2,1)" }}/>
            </clipPath>
          </defs>

          {/* Dotted grid lines */}
          {[0.25, 0.5, 0.75].map(pct => {
            const y = padTop + usableH * (1 - pct);
            return <line key={pct} x1="0" y1={y} x2={chartW} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.12"/>;
          })}

          {/* Red cost baseline */}
          <line x1="0" y1={Math.min(costY, chartH - padBot)} x2={chartW} y2={Math.min(costY, chartH - padBot)} stroke="#ef4444" strokeWidth="2" opacity="0.5" strokeDasharray="6 4"/>

          {/* Revenue curve + fill (animated reveal) */}
          <g clipPath="url(#revealClip)">
            <path d={fillPath} fill="url(#revGrad2)"/>
            <path d={curvePath} fill="none" stroke="currentColor" strokeWidth="2.5"/>
            {/* Data points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={4} fill="var(--card)" stroke="currentColor" strokeWidth="2"/>
                {/* Tooltip */}
                <text x={p.x} y={p.y - 12} textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="700" opacity="0.5">
                  ${monthlyData[i].revenue.toLocaleString()}
                </text>
              </g>
            ))}
          </g>

          {/* Bottom axis */}
          <line x1="0" y1={chartH - padBot} x2={chartW} y2={chartH - padBot} stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
        </svg>

        {/* Month labels */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          display: "flex", justifyContent: "space-between",
          fontSize: 9, fontWeight: 600, opacity: 0.3,
          textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          {monthlyData.map(d => <span key={d.month}>Month {d.month}</span>)}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 16, fontSize: 9, fontWeight: 700, opacity: 0.5 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 12, height: 2, background: "#ef4444", borderRadius: 99, display: "inline-block" }}/> Cost ($24/mo)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 12, height: 2, background: "var(--text)", borderRadius: 99, display: "inline-block" }}/> Projected Revenue
          </span>
        </div>
        <div style={{ fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.3 }}>
          Interactive Simulator
        </div>
      </div>
    </div>
  );
}

// ── Phone Carousel (interactive — matches Wavey) ────────────────────────────
function PhoneCarousel() {
  const [activeTab, setActiveTab] = useState<"shop"|"bio"|"event">("bio");
  const tabs: ("shop"|"bio"|"event")[] = ["shop","bio","event"];

  // Position configs for each phone based on which tab is active
  function getPhoneStyle(phone: "shop"|"bio"|"event") {
    const isCenter = phone === activeTab;
    const centerIdx = tabs.indexOf(activeTab);
    const phoneIdx = tabs.indexOf(phone);
    const diff = phoneIdx - centerIdx;

    if (isCenter) {
      return {
        transform: "translateX(0) scale(1) rotateY(0deg)",
        opacity: 1,
        zIndex: 20,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
      };
    } else if (diff < 0 || (diff > 1)) {
      // Left position
      return {
        transform: "translateX(-110%) scale(0.85) rotateY(-20deg)",
        opacity: 0.5,
        zIndex: 10,
        boxShadow: "none",
      };
    } else {
      // Right position
      return {
        transform: "translateX(110%) scale(0.85) rotateY(20deg)",
        opacity: 0.5,
        zIndex: 10,
        boxShadow: "none",
      };
    }
  }

  // For 3 items, figure out left/center/right
  function getPosition(phone: "shop"|"bio"|"event"): "left"|"center"|"right" {
    if (phone === activeTab) return "center";
    const centerIdx = tabs.indexOf(activeTab);
    const phoneIdx = tabs.indexOf(phone);
    // Wrap around
    const diff = ((phoneIdx - centerIdx) + 3) % 3;
    return diff === 1 ? "right" : "left";
  }

  const phoneBase: React.CSSProperties = {
    position: "absolute", top: 0, width: 280, height: 560, borderRadius: 48,
    border: "8px solid #121212", overflow: "hidden",
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer", willChange: "transform",
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      height: 650, position: "relative",
    }}>
      <div style={{ position: "relative", width: 280, height: 580 }}>

        {/* ── SHOP PHONE ── */}
        <div onClick={() => setActiveTab("shop")} style={{
          ...phoneBase, background: "var(--bg)",
          ...(() => {
            const pos = getPosition("shop");
            return pos === "center" 
              ? { transform: "translateX(0) scale(1)", opacity: 1, zIndex: 20, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }
              : pos === "left"
              ? { transform: "translateX(-110%) scale(0.85) rotateY(-20deg)", opacity: 0.5, zIndex: 10, boxShadow: "none" }
              : { transform: "translateX(110%) scale(0.85) rotateY(20deg)", opacity: 0.5, zIndex: 10, boxShadow: "none" };
          })(),
        }}>
          {activeTab !== "shop" && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 40, transition: "opacity 0.5s" }}/>}
          <PhoneNotch/>
          <div style={{ padding: "56px 12px 12px", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: 12, borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "-0.02em" }}>Merch</div>
                <div style={{ fontSize: 9, opacity: 0.4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>GEMM Collection</div>
              </div>
              <ShoppingBagIcon/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["PACK","$150"],["TEE","$45"],["HOODIE","$65"],["TEE 2","$50"]].map(([n,p]) => (
                <div key={n} style={{
                  background: "var(--bg2)", borderRadius: 12, aspectRatio: "3/4",
                  border: "1px solid var(--border)", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 6, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                    <div style={{ color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
                      <span>{n}</span><span>{p}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BIO PHONE ── */}
        <div onClick={() => setActiveTab("bio")} style={{
          ...phoneBase, background: "var(--bg)",
          ...(() => {
            const pos = getPosition("bio");
            return pos === "center"
              ? { transform: "translateX(0) scale(1)", opacity: 1, zIndex: 20, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }
              : pos === "left"
              ? { transform: "translateX(-110%) scale(0.85) rotateY(-20deg)", opacity: 0.5, zIndex: 10, boxShadow: "none" }
              : { transform: "translateX(110%) scale(0.85) rotateY(20deg)", opacity: 0.5, zIndex: 10, boxShadow: "none" };
          })(),
        }}>
          {activeTab !== "bio" && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 40, transition: "opacity 0.5s" }}/>}
          <PhoneNotch/>
          <div style={{ padding: "64px 24px 80px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, height: "100%" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "2px solid var(--text)", padding: 4, background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, opacity: 0.3 }}>G</div>
              </div>
              <div style={{ position: "absolute", bottom: -4, right: -4, background: "#3b82f6", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 9999, boxShadow: "0 2px 4px rgba(0,0,0,0.2)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", gap: 2 }}>
                <CheckIcon size={8} color="#fff"/> PRO
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>@yourname</h2>
              <p style={{ fontSize: 10, opacity: 0.6, marginTop: 2, fontWeight: 500 }}>Digital Creator & Model</p>
            </div>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
              {["Latest Drop","My Portfolio","Join Discord","Book Me"].map(label => (
                <div key={label} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, fontWeight: 700, fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)", border: "1px solid var(--border)" }}>
                  {label} <ArrowRight size={12}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── EVENT PHONE ── */}
        <div onClick={() => setActiveTab("event")} style={{
          ...phoneBase, background: "#000",
          ...(() => {
            const pos = getPosition("event");
            return pos === "center"
              ? { transform: "translateX(0) scale(1)", opacity: 1, zIndex: 20, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }
              : pos === "left"
              ? { transform: "translateX(-110%) scale(0.85) rotateY(-20deg)", opacity: 0.5, zIndex: 10, boxShadow: "none" }
              : { transform: "translateX(110%) scale(0.85) rotateY(20deg)", opacity: 0.5, zIndex: 10, boxShadow: "none" };
          })(),
        }}>
          {activeTab !== "event" && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 40, transition: "opacity 0.5s" }}/>}
          <PhoneNotch/>
          <div style={{ height: "60%", position: "relative" }}>
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)" }}/>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #000 0%, rgba(0,0,0,0.5) 50%, transparent 100%)" }}/>
            <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, color: "#fff", zIndex: 3 }}>
              <span style={{ background: "#dc2626", padding: "2px 8px", fontSize: 9, fontWeight: 700, textTransform: "uppercase", borderRadius: 99, display: "inline-block", marginBottom: 4 }}>Upcoming</span>
              <h3 style={{ fontWeight: 900, fontSize: 16, lineHeight: 1.1, marginBottom: 4 }}>Equinox Energy: Pilates & Matcha</h3>
              <p style={{ fontSize: 10, opacity: 0.8 }}>SOUL Studio</p>
            </div>
          </div>
          <div style={{ flex: 1, padding: 12, background: "#000", color: "#fff" }}>
            <div style={{ width: 32, height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 99, margin: "0 auto 10px" }}/>
            <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 8, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ width: 40, height: 40, borderRadius: 4, background: "rgba(255,255,255,0.1)", flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>ABR Community Summit Spring &apos;26</h4>
                <p style={{ fontSize: 9, opacity: 0.5, marginTop: 2 }}>March 28th, 2026</p>
              </div>
              <ArrowRight size={12}/>
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB SELECTOR ── */}
      <div style={{
        marginTop: 32, display: "flex", gap: 2, padding: 6,
        background: "var(--nav)", border: "1.5px solid var(--border)",
        borderRadius: 9999, backdropFilter: "blur(8px)", zIndex: 50,
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
      }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: "8px 16px", borderRadius: 9999,
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
            border: "none", cursor: "pointer", transition: "all 0.3s", fontFamily: "inherit",
            background: t === activeTab ? "var(--text)" : "transparent",
            color: t === activeTab ? "var(--bg)" : "var(--text)",
          }}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
export default function LandingPage() {
  const { user, loading: authLoading, signIn } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState("clean");
  const [yearly, setYearly] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Redirect logged in users
  useEffect(() => {
    if (!authLoading && user) router.push("/dashboard");
  }, [user, authLoading, router]);

  // Loading screen
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setShowLoading(false);
            setTimeout(() => setLoaded(true), 200);
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(timer);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
        }
      }),
      { threshold: 0.12 }
    );
    revealRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, [loaded]);

  function addRevealRef(el: HTMLDivElement | null) {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  }

  const vars = THEMES[theme];

  async function handleDashboard() {
    if (user) router.push("/dashboard");
    else {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function scrollToPricing() {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  }

  const revealStyle: React.CSSProperties = {
    opacity: 0, transform: "translateY(24px)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,700;0,9..40,900;1,9..40,700;1,9..40,900&family=DM+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
        ::selection{background:#a855f7;color:white;}
        @keyframes ping{0%{transform:scale(1);opacity:.3}70%,100%{transform:scale(1.6);opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes shimmer{100%{transform:translateX(100%)}}
        @keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .marquee-track{display:flex;gap:40px;white-space:nowrap;animation:marquee 35s linear infinite;will-change:transform;}
        .ping{animation:ping 2s ease infinite;}
        .pulse{animation:pulse 1.5s ease infinite;}
        .no-scrollbar::-webkit-scrollbar{display:none;}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}
        button:active{transform:scale(.97)!important;}
      `}</style>

      <LoadingScreen progress={loadProgress} visible={showLoading} />

      <div style={{ ...vars, background: "var(--bg)", color: "var(--text)", minHeight: "100vh", overflowX: "hidden", fontFamily: "'DM Sans',sans-serif", transition: "background .5s, color .5s" }}>

        {/* ════════════════════════════════════════════════════════════════════
            NAV — matches Wavey's glassmorphism pill nav
        ════════════════════════════════════════════════════════════════════ */}
        <nav style={{
          position: "fixed", top: 0, width: "100%", zIndex: 100, padding: "16px 8px",
          pointerEvents: "none",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(-50px)",
          transition: "opacity .6s ease .3s, transform .6s ease .3s",
        }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto", width: "100%",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "var(--nav)", border: "1px solid var(--border)", borderRadius: 9999,
            padding: "6px 8px 6px 12px", backdropFilter: "blur(12px)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", pointerEvents: "auto",
          }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flexShrink: 0 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(128,128,128,0.05)", border: "1px solid rgba(128,128,128,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
              }}>
                <div className="ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--text)" }}/>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--text)" }}/>
              </div>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: "-0.05em", color: "var(--text)", display: "none" }} className="nav-logo-text">GEMM</span>
              <span style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: "-0.05em", color: "var(--text)" }}>GEMM</span>
            </div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <a href="#events" style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 9999, textDecoration: "none", color: "var(--text)",
              }}>
                <span style={{ position: "relative", display: "flex", width: 8, height: 8 }}>
                  <span className="ping" style={{ position: "absolute", display: "inline-flex", width: "100%", height: "100%", borderRadius: "50%", background: "#f87171", opacity: 0.75 }}/>
                  <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", width: 8, height: 8, background: "#ef4444" }}/>
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <span>Upcoming </span>Events
                </span>
              </a>
              <button onClick={handleDashboard} style={{
                padding: "8px 20px", borderRadius: 9999,
                fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em",
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--text)", color: "var(--bg)",
                border: "2px solid var(--text)", cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                transition: "transform .2s", overflow: "hidden", position: "relative",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                {user ? "Dashboard" : "Dashboard"}
                <ZapIcon size={12}/>
              </button>
            </div>
          </div>
        </nav>

        {/* ════════════════════════════════════════════════════════════════════
            HERO — matches Wavey exactly
        ════════════════════════════════════════════════════════════════════ */}
        <section style={{
          position: "relative", paddingTop: 128, paddingBottom: 80, paddingLeft: 16, paddingRight: 16,
          minHeight: "90vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          maxWidth: 1280, margin: "0 auto",
        }}>
          {/* Background glow */}
          <div style={{
            position: "absolute", top: "25%", left: "25%", width: 800, height: 800, borderRadius: "50%",
            opacity: 0.04, zIndex: -1, pointerEvents: "none",
            background: "radial-gradient(circle, var(--text) 0%, transparent 70%)",
          }}/>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 96, alignItems: "center", width: "100%",
            opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease 0.2s",
          }}>
            {/* ── LEFT SIDE ── */}
            <div style={{ textAlign: "left", zIndex: 10 }}>
              {/* Badge — matches Wavey's green pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#dcfce7", color: "#166534",
                padding: "6px 16px", borderRadius: 9999,
                fontSize: 14, fontWeight: 700, marginBottom: 32,
              }}>
                <ZapIcon size={16}/> Start selling in 2 minutes
              </div>

              {/* Headline — matches Wavey */}
              <h1 style={{
                fontSize: "clamp(3.5rem, 8vw, 6rem)", fontWeight: 900,
                letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: 32,
              }}>
                One Link. <br/>
                <span style={{
                  display: "inline-block", paddingRight: 16,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(to right, var(--text), var(--accent2, rgba(128,128,128,0.5)))",
                }}>
                  Infinite Potential.
                </span>
              </h1>

              {/* Subtitle — matches Wavey */}
              <p style={{
                fontSize: 20, opacity: 0.7, marginBottom: 40,
                maxWidth: 480, lineHeight: 1.6, fontWeight: 500,
              }}>
                The operating system for creators. Sell products, host events, and customize your brand with a technology that feels alive.
              </p>

              {/* CTA + Stars + Sales Sim — matches Wavey layout */}
              <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
                  <a href="#pricing" style={{
                    padding: "16px 32px", borderRadius: 9999, fontWeight: 700, fontSize: 18,
                    display: "flex", alignItems: "center", gap: 8,
                    background: "var(--text)", color: "var(--bg)", textDecoration: "none",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    border: "2px solid var(--text)", transition: "transform 0.2s", cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                    Get Started <ArrowRight size={20}/>
                  </a>
                  {/* Star ratings — matches Wavey */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, opacity: 0.6 }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1,2,3,4,5].map(i => <StarIcon key={i}/>)}
                    </div>
                    <span>Loved by top creators</span>
                  </div>
                </div>

                {/* Sales Simulator — matches Wavey */}
                <div style={{ display: "none" }} className="desktop-only">
                  {/* Show on lg screens */}
                </div>
                <SalesSimulator />
              </div>
            </div>

            {/* ── RIGHT SIDE — Interactive Phone Carousel ── */}
            <PhoneCarousel />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            MARQUEE BANNER — matches Wavey
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{
          position: "relative", padding: "16px 0", overflow: "hidden",
          transform: "rotate(-1deg)", cursor: "pointer",
          borderTop: "2px solid rgba(0,0,0,0.1)", borderBottom: "2px solid rgba(0,0,0,0.1)",
          margin: "32px 0",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, var(--text), var(--accent2, #666), var(--text))",
            backgroundSize: "200% 200%",
          }}/>
          <div style={{ display: "flex", position: "relative", overflow: "hidden" }}>
            <div className="marquee-track">
              {[...Array(3)].flatMap((_, setIdx) =>
                ["SELL MERCH INSTANTLY","NO CODE REQUIRED","OWN YOUR AUDIENCE","UNLOCK YOUR CITY","EXCLUSIVE EVENTS","LIVE EXPERIENCES","CLICK TO FIND YOUR CITY","DISCOVER NOW","NO FOMO","START FOR FREE","MAXIMIZE ROI"].map((txt, j) => (
                  <span key={`${setIdx}-${j}`} style={{
                    display: "inline-flex", alignItems: "center", gap: 16,
                    fontSize: "clamp(18px, 3vw, 28px)", fontWeight: 900, fontStyle: "italic",
                    letterSpacing: "-0.03em", textTransform: "uppercase", color: "var(--bg)",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}>
                    {txt}
                    {j % 2 === 0
                      ? <ZapIcon size={20} className="pulse"/>
                      : <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", display: "inline-block" }}/>}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            EVENTS SECTION — matches Wavey
        ════════════════════════════════════════════════════════════════════ */}
        <section id="events" style={{
          padding: "96px 16px", background: "var(--bg2)",
          borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
          transition: "background 0.5s",
        }}>
          <div ref={addRevealRef} style={{ maxWidth: 1200, margin: "0 auto", ...revealStyle }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 300 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginBottom: 16 }}>
                  <CalendarIcon/> Live Experiences
                </div>
                <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, marginBottom: 24 }}>
                  Don&apos;t just watch. <br/>
                  <span style={{ textDecoration: "underline", textDecorationColor: "var(--text)", textUnderlineOffset: 8, textDecorationThickness: 4 }}>Be there.</span>
                </h2>
                <p style={{ fontSize: 18, opacity: 0.7, marginBottom: 32, maxWidth: 480, lineHeight: 1.6, fontWeight: 500 }}>
                  Browse concerts, workshops, and exclusive events. From Equinox Energy: Pilates & Matcha to ABR Community Summit Spring &apos;26.
                </p>
                <a href="#events" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 18, color: "var(--text)", textDecoration: "none", transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  Discover Upcoming Events <ArrowRight size={20}/>
                </a>
              </div>
              {/* Featured event image — matches Wavey */}
              <div style={{
                position: "relative", flex: 1, minWidth: 300, maxWidth: 480,
                aspectRatio: "16/9", borderRadius: 24, overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", cursor: "pointer",
              }}>
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)", minHeight: 240 }}/>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent)" }}/>
                <div style={{ position: "absolute", bottom: 24, left: 24, zIndex: 20, color: "#fff" }}>
                  <div style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 8, border: "1px solid rgba(255,255,255,0.3)" }}>Featured</div>
                  <div style={{ fontSize: 24, fontWeight: 900 }}>Equinox Energy: Pilates & Matcha</div>
                  <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.9, marginTop: 4 }}> • SOUL Studio</div>
                </div>
              </div>
            </div>
            {/* Event cards — matches Wavey */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginTop: 48 }}>
              {[
                ["Equinox Energy: Pilates & Matcha","SOUL Studio"],
                ["ABR Community Summit Spring &apos;26","Altgeld Community Center"],
              ].map(([name, loc]) => (
                <a key={name} href="#" style={{
                  padding: 16, borderRadius: 12, border: "1px solid var(--border)",
                  background: "var(--card)", cursor: "pointer", textDecoration: "none", color: "var(--text)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{loc}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            COST / REVENUE SECTION — matches Wavey
        ════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "128px 16px", background: "var(--bg)", transition: "background 0.5s" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div ref={addRevealRef} style={revealStyle}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px",
                borderRadius: 6, marginBottom: 24,
                border: "1px solid rgba(128,128,128,0.3)", background: "rgba(128,128,128,0.08)",
                fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
              }}>
                ⚠️ The Cost of Doing Nothing
              </div>
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 900, marginBottom: 24, lineHeight: 1, letterSpacing: "-0.03em" }}>
                Turn <span style={{ textDecoration: "underline", textDecorationColor: "#ef4444", textDecorationThickness: 4, textUnderlineOffset: 8 }}>$24</span> into<br/> an empire.
              </h2>
              <p style={{ fontSize: 20, marginBottom: 40, lineHeight: 1.6, fontWeight: 500, opacity: 0.7 }}>
                You have the fans. Now, get paid. For less than $1 a day, get a shop, sell tickets, and share one link for everything. Watch your sales grow while your cost stays the same.
              </p>
              {/* Cost comparison cards — matches Wavey */}
              <a href="#pricing" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, cursor: "pointer", textDecoration: "none", color: "var(--text)" }}>
                <div style={{ padding: 24, borderRadius: 24, border: "1px solid var(--border)", background: "var(--bg2)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 64, height: 64, background: "rgba(239,68,68,0.1)", borderRadius: "0 0 0 100%" }}/>
                  <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.6, marginBottom: 8 }}>Your Monthly Cost</p>
                  <p style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.05em" }}>$24</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#ef4444", marginTop: 8 }}>Static Friction</p>
                </div>
                <div style={{ padding: 24, borderRadius: 24, border: "2px solid var(--text)", background: "var(--card)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", position: "relative", overflow: "hidden" }}>
                  <p style={{ fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    Est. Total Sales
                    <span className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 10px rgba(34,197,94,0.6)" }}/>
                  </p>
                  <p style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.05em" }}>$5.4k<span style={{ fontSize: 24, opacity: 0.5 }}>+</span></p>
                  <p style={{ fontSize: 12, fontWeight: 700, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>Kinetic Breakout <ArrowUpRight size={12}/></p>
                </div>
              </a>
            </div>
            {/* Revenue simulator box — matches Wavey */}
            <div ref={addRevealRef} style={revealStyle}>
              <RevenueChart />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            TEAM SECTION — matches Wavey (THIS WAS MISSING)
        ════════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "96px 16px", background: "var(--bg2)", color: "var(--text)", transition: "background 0.5s" }}>
          <div ref={addRevealRef} style={{ maxWidth: 1200, margin: "0 auto", ...revealStyle }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
              {/* Left — Feature grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <FeatureCard icon={<UsersIcon/>} title="Custom Pages" desc="Give every fan their own page that matches their style and brand."/>
                <FeatureCard icon={<StarIcon size={24}/>} title="Connect Your Apps" desc="It works perfectly with tools you love like Eventbrite and Posh."/>
                <FeatureCard icon={<ChartIcon/>} title="Live Tracking" desc="See every sale happen across all your social apps in real time."/>
                <FeatureCard icon={<ZapIcon size={24}/>} title="Easy Growth" desc="Fans can join your team in minutes and start selling for you."/>
              </div>

              {/* Right — Copy */}
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 12px", borderRadius: 9999, marginBottom: 24,
                  border: "1px solid rgba(128,128,128,0.3)", background: "rgba(128,128,128,0.08)",
                  fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
                }}>
                  <UsersIcon size={14}/> Team Up for Success
                </div>
                <h2 style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 900, marginBottom: 24, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                  Get a team that <br/><span style={{ color: "var(--accent, var(--text))" }}>sells for you.</span>
                </h2>
                <p style={{ fontSize: 20, lineHeight: 1.6, fontWeight: 500, opacity: 0.8, marginBottom: 32 }}>
                  You don&apos;t have to grow alone. Let your biggest fans help sell your work. Build a team of helpers who share your link with the world. You make more money, and you can see exactly who is helping you grow on one simple page.
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--text)", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <UsersIcon size={20}/>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, opacity: 0.7 }}>Join 5,000+ creators building networks</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            PRICING — matches Wavey
        ════════════════════════════════════════════════════════════════════ */}
        <section id="pricing" style={{ padding: "96px 16px", background: "var(--bg2)", transition: "background 0.5s" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div ref={addRevealRef} style={{ textAlign: "center", marginBottom: 40, ...revealStyle }}>
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 32 }}>
                Focus on your creative universe.
              </h2>
              {/* Toggle — matches Wavey */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 24,
                padding: "8px 24px 8px 8px", borderRadius: 9999,
                border: "1px solid var(--border)", background: "var(--card)",
                backdropFilter: "blur(8px)", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}>
                <div style={{ display: "flex", background: "rgba(128,128,128,0.08)", borderRadius: 9999, padding: 4 }}>
                  {["Monthly","Yearly"].map(label => (
                    <button key={label} onClick={() => setYearly(label === "Yearly")}
                      style={{
                        position: "relative", zIndex: 10,
                        padding: "10px 24px", fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                        border: "none", borderRadius: 9999, cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.3s",
                        background: (label === "Yearly") === yearly ? "var(--text)" : "transparent",
                        color: (label === "Yearly") === yearly ? "var(--bg)" : "var(--text)",
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#22c55e" }}>Save 30%</span>
              </div>
            </div>

            <div ref={addRevealRef} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, paddingTop: 16, alignItems: "stretch", ...revealStyle }}>
              {PLANS.map(plan => (
                <div key={plan.key} style={{
                  position: "relative", padding: 32, borderRadius: 32,
                  border: plan.featured ? "1px solid var(--text)" : "1px solid var(--border)",
                  display: "flex", flexDirection: "column",
                  background: "var(--card)", color: "var(--text)",
                  transition: "transform 0.3s", cursor: "pointer",
                  boxShadow: plan.featured ? "0 25px 50px -12px rgba(0,0,0,0.25)" : "0 10px 15px -3px rgba(0,0,0,0.1)",
                  transform: plan.featured ? "scale(1.05)" : "scale(1)",
                  zIndex: plan.featured ? 10 : 1,
                  ...(plan.featured ? { outline: `2px solid var(--text)` } : {}),
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = plan.featured ? "scale(1.05) translateY(-4px)" : "translateY(-4px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = plan.featured ? "scale(1.05)" : "scale(1)")}>

                  {plan.badge && (
                    <div style={{
                      position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)",
                      padding: "6px 16px", borderRadius: 9999,
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                      background: plan.badge.bg, color: plan.badge.fg,
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)", border: `2px solid ${plan.badge.bg}`,
                    }}>
                      {plan.badge.label}
                    </div>
                  )}

                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      {plan.name} {plan.key === "empire" && <CrownIcon/>}
                    </h3>
                    <p style={{ fontSize: 12, opacity: 0.6, minHeight: 32, fontWeight: 500 }}>{plan.tagline}</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.05em" }}>${yearly ? plan.yearly : plan.monthly}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, opacity: 0.6, marginBottom: 8 }}>/mo</span>
                  </div>

                  {plan.monthly > 0 && yearly && (
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", marginBottom: 24, display: "flex", alignItems: "center", gap: 4 }}>
                      ↗ Save ${(plan.monthly - plan.yearly) * 12}/year
                    </p>
                  )}

                  <button onClick={() => router.push("/dashboard")} style={{
                    width: "100%", padding: 16, borderRadius: 12,
                    fontWeight: 700, fontSize: 14, marginBottom: 32,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontFamily: "inherit", cursor: "pointer", transition: "transform 0.15s",
                    border: plan.btnStyle === "outline" ? "1.5px solid var(--border)" : "none",
                    background: plan.btnStyle === "solid" ? "var(--text)" : plan.btnStyle === "gold" ? "#fbbf24" : "transparent",
                    color: plan.btnStyle === "solid" ? "var(--bg)" : plan.btnStyle === "gold" ? "#000" : "var(--text)",
                  }}>
                    Get Started <ArrowRight size={16}/>
                  </button>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14 }}>
                        <CheckIcon size={16} color={plan.checkColor}/>
                        <span style={{ opacity: 0.8, fontWeight: 500 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 48, textAlign: "center" }}>
              <button onClick={() => router.push("/dashboard")} style={{
                fontSize: 14, fontWeight: 500, opacity: 0.6,
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 9999,
                border: "none", background: "transparent", color: "var(--text)",
                cursor: "pointer", fontFamily: "inherit",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}>
                Start with <strong style={{ textDecoration: "underline", textUnderlineOffset: 4 }}>Spark</strong> (Free Forever) <ArrowRight size={16}/>
              </button>
              <p style={{ fontSize: 10, opacity: 0.6, marginTop: 4 }}>Limited features. Upgrade anytime.</p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            FOOTER — matches Wavey
        ════════════════════════════════════════════════════════════════════ */}
        <footer style={{ padding: "96px 24px", borderTop: "1px solid var(--border)", background: "var(--bg)", transition: "background 0.5s" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div ref={addRevealRef} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, ...revealStyle }}>
              <div>
                <div style={{ fontWeight: 900, letterSpacing: "-0.05em", fontSize: 24, marginBottom: 16 }}>GEMM</div>
                <p style={{ opacity: 0.6, fontSize: 14, maxWidth: 320, marginBottom: 32, lineHeight: 1.5 }}>
                  The complete operating system for the next generation of digital empires.
                </p>
                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(128,128,128,0.1)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>🌐</div>
                </div>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Platform</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14, opacity: 0.6 }}>
                  <a href="#pricing" style={{ textDecoration: "none", color: "inherit", transition: "opacity 0.2s" }}>Login</a>
                  <a href="#pricing" style={{ textDecoration: "none", color: "inherit", transition: "opacity 0.2s" }}>Pricing</a>
                  <a href="#events" style={{ textDecoration: "none", color: "inherit", transition: "opacity 0.2s" }}>Explore Events</a>
                </div>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 16 }}>Support</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14, opacity: 0.6 }}>
                  <a href="#" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>✉️ Contact Us</a>
                  <a href="#" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>💬 Community</a>
                  <a href="#" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>🛡️ Privacy Policy</a>
                </div>
              </div>
            </div>
            <div style={{
              marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              fontSize: 12, opacity: 0.4, fontWeight: 700, textTransform: "uppercase",
            }}>
              <div>© 2026 Gemm Inc.</div>
              <div>All Systems Operational</div>
            </div>
          </div>
        </footer>

        {/* ════════════════════════════════════════════════════════════════════
            THEME SWITCHER DOCK — matches Wavey
        ════════════════════════════════════════════════════════════════════ */}
        <div style={{
          position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)",
          zIndex: 100, display: "flex", alignItems: "center", gap: 6,
          padding: "6px 8px", borderRadius: 40,
          background: "var(--nav)", backdropFilter: "blur(16px)",
          border: "1px solid var(--border)",
          boxShadow: "0 30px 60px -15px rgba(0,0,0,0.25)",
          opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 1s",
        }}>
          {SWATCHES.map(s => (
            <button key={s.key} onClick={() => setTheme(s.key)}
              title={s.key.charAt(0).toUpperCase() + s.key.slice(1)}
              style={{
                width: theme === s.key ? "auto" : 40, height: 40, borderRadius: 9999,
                border: theme === s.key ? "1px solid var(--border)" : "1px solid transparent",
                background: s.bg.includes("gradient") ? s.bg : s.bg,
                cursor: "pointer", transition: "all 0.3s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: theme === s.key ? "0 16px 0 4px" : 0,
                boxShadow: theme === s.key ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none",
              }}>
              <div style={{
                width: theme === s.key ? 28 : 24, height: theme === s.key ? 28 : 24,
                borderRadius: "50%", background: s.bg.includes("gradient") ? "rgba(255,255,255,0.3)" : s.bg === "#000000" ? "#000" : s.bg,
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
              }}/>
              {theme === s.key && (
                <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.05em", color: "var(--text)", whiteSpace: "nowrap" }}>
                  {s.key.charAt(0).toUpperCase() + s.key.slice(1)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
