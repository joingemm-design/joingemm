"use client";
import { useState } from "react";

export default function NorthwestCoffeePage() {
  const [drink, setDrink] = useState("");
  const [size, setSize] = useState("");
  const [extra, setExtra] = useState("");
  const [ordered, setOrdered] = useState(false);

  const prices: Record<string, number> = {
    "Latte": 5.50, "Cappuccino": 5.00, "Americano": 4.00,
    "Pour-over": 5.50, "Cafe Au Lait": 4.50, "Mocha": 6.00,
    "Mocha Bianca": 6.00, "Frio (blended)": 7.00,
    "Coconut Water Americano": 6.50, "Chai": 5.00, "Hot Cocoa": 4.50,
  };
  const extraPrices: Record<string, number> = {
    "Extra shot": 1.00, "Flavored syrup": 0.75,
    "Whipped cream": 0.50, "Non-dairy milk": 0.75,
  };
  const basePrice = prices[drink] || 0;
  const extraPrice = extraPrices[extra] || 0;
  const total = (basePrice + extraPrice).toFixed(2);

  const gold = "#c8a96e";
  const dark = "#1a1208";
  const cream = "#f5f0e8";
  const green = "#3d6b3a";
  const lightGreen = "#a8c5a0";
  const bg = "#faf7f2";
  const muted = "rgba(26,18,8,0.45)";
  const border = "rgba(26,18,8,0.08)";

  const sel = {
    width: "100%", padding: "11px 14px",
    background: "rgba(245,240,232,0.07)",
    border: "1px solid rgba(245,240,232,0.12)",
    borderRadius: "8px", color: cream,
    fontSize: "13px", fontFamily: "inherit",
    marginBottom: "8px", outline: "none",
  } as React.CSSProperties;

  const drinks = [
    ["Americano","$4.00","Espresso + water"],
    ["Latte","$5.50","Espresso + milk"],
    ["Cappuccino","$5.00","Espresso, milk, foam"],
    ["Pour-over","$5.50","Any varietal"],
    ["Mocha","$6.00","Espresso + Ghirardelli"],
    ["Frio","$7.00","Blended + espresso"],
    ["Coconut Americano","$6.50","Coconut + espresso"],
    ["Chai","$5.00","House spice blend"],
    ["Cafe Au Lait","$4.50","Coffee + milk"],
  ];

  const beans = [
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415208372248-HR7MR53C8HEX7CK54RXP/ethiopia.jpg","Ethiopia","Yirgacheffe","Berry, floral, ceremonial","from $27.00"],
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415206952789-5VW7T54EO8TNQ9NPWYDY/image-asset.png","Guatemala","Huehuetenango","Bright, fruity, floral","from $20.07"],
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415208764685-JUB93DD72LFHM4KKY23X/image-asset.png","Sumatra","Indonesian","Earthy, full body, deep","from $20.07"],
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415208781193-GY19403BC7JPZ9K959XY/image-asset.png","Tanzania","Kilimanjaro Peaberry","Exotic, robust, single bean","from $20.07"],
  ];

  const shopBeans = [
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415209128560-CKTW0JLQR35QI5Z8I8QW/image-asset.png","House Blend","from $22"],
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415209277724-CNQNUXBLVKEL3K7IFN6N/image-asset.png","NW Espresso","from $20"],
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415208986290-WWLDA7FTPKQJYFITKO8P/image-asset.png","Rocky Bay","from $22"],
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415208954041-2DCV7T57NRUYQP724NTJ/image-asset.png","Mocha Java","from $20"],
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415209360678-IMAWTYCLW9NZ48P5WNOH/image-asset.png","SoHo Light","from $20"],
    ["https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1415209370432-0WQBORNADOFUXGLGIXBM/image-asset.png","French Roast","from $20"],
  ];

  const reviews = [
    "Northwest has the best coffee in St Louis. Beans are slow roasted and full of flavor. Staff are cheerful and friendly.",
    "I felt like I stepped out of STL and landed in Austin. The outdoor area is unmatched.",
    "A renovated auto mechanic garage with great outdoor seating, wood tables, and plants everywhere. Incredible vibe.",
  ];

  const ticker = ["Plants inside","Full city roast only","Roasted weekly","Ships nationwide","Worlds Fair Donuts","Companion Bakery","Est. 1992","4251 Laclede Ave"];

  return (
    <div style={{ background: cream, color: dark, fontFamily: "DM Sans, sans-serif", minHeight: "100vh" }}>

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", background: cream, borderBottom: "1px solid " + border, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-13 4 6-1 10 2 10 8-2-4-6-6-11-6 4 2 6 5 6 9C8 12 9 8 17 8Z" fill={green}/></svg>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 900, color: dark }}>Northwest Coffee</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <a href="https://www.instagram.com/northwestcoffeeco" target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: muted, textDecoration: "none" }}>@northwestcoffeeco</a>
          <div style={{ background: green, color: cream, fontSize: "10px", fontWeight: 900, padding: "4px 12px", borderRadius: "50px", letterSpacing: "1px" }}>ON GEMM</div>
        </div>
      </nav>

      <div style={{ position: "relative", minHeight: "520px", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "#2a1f14" }}>
        <iframe src="https://www.youtube.com/embed/EFmSoYnR6uQ?autoplay=1&mute=1&loop=1&playlist=EFmSoYnR6uQ&controls=0&showinfo=0&rel=0&disablekb=1" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) scale(1.5)", width: "100%", height: "100%", border: "none", pointerEvents: "none", minHeight: "520px" }} allow="autoplay;encrypted-media" title="bg" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,18,8,0.95) 0%, rgba(26,18,8,0.5) 55%, transparent 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "48px 28px 44px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", color: lightGreen, marginBottom: "12px", textTransform: "uppercase" as const }}>Est. 1992 · Central West End · St. Louis</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(40px,9vw,80px)", lineHeight: 1.05, color: cream, marginBottom: "16px", fontWeight: 900 }}>
            Coffee, community,<br/>and <span style={{ color: gold, fontStyle: "italic" }}>good plants.</span>
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(245,240,232,0.65)", lineHeight: 1.7, maxWidth: "400px", marginBottom: "28px" }}>
            STL&apos;s only full city roaster. Home to Forks &amp; Farms plant nursery. Order ahead and skip the line.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
            <button style={{ padding: "13px 26px", borderRadius: "50px", background: gold, color: dark, fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Order Ahead</button>
            <a href="https://www.northwestcoffee.com/our-shop" target="_blank" rel="noreferrer" style={{ padding: "13px 26px", borderRadius: "50px", background: "transparent", color: cream, fontSize: "13px", fontWeight: 700, border: "1px solid rgba(245,240,232,0.3)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>Shop Beans</a>
          </div>
        </div>
      </div>

      <div style={{ background: green, padding: "12px 28px", display: "flex", alignItems: "center", gap: "24px", overflowX: "auto" as const }}>
        {ticker.map((t, i) => (
          <span key={i} style={{ fontSize: "11px", fontWeight: 700, color: lightGreen, letterSpacing: "1px", whiteSpace: "nowrap" as const, textTransform: "uppercase" as const }}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ padding: "40px 28px", borderBottom: "1px solid " + border }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: green, textTransform: "uppercase" as const, marginBottom: "8px" }}>Order Ahead</div>
        <div style={{ background: dark, borderRadius: "16px", padding: "28px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "30px", fontWeight: 900, color: gold, marginBottom: "6px" }}>Skip the line</div>
          <div style={{ fontSize: "13px", color: "rgba(245,240,232,0.5)", marginBottom: "18px", lineHeight: 1.6 }}>Order now, pick up at 4251 Laclede Ave CWE.</div>
          <select style={sel} value={drink} onChange={e => { setDrink(e.target.value); setOrdered(false); }}>
            <option value="">Select your drink...</option>
            {Object.entries(prices).map(([d, p]) => (
              <option key={d} value={d}>{d} — ${p.toFixed(2)}</option>
            ))}
          </select>
          <select style={sel} value={size} onChange={e => setSize(e.target.value)}>
            <option value="">Choose size...</option>
            {["12oz","16oz","20oz"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select style={sel} value={extra} onChange={e => setExtra(e.target.value)}>
            <option value="">Add extras (optional)...</option>
            {Object.entries(extraPrices).map(([x, p]) => (
              <option key={x} value={x}>{x} +${p.toFixed(2)}</option>
            ))}
          </select>
          <button onClick={() => { if (drink && size) setOrdered(true); }} style={{ width: "100%", padding: "13px", borderRadius: "8px", background: ordered ? "#2a7a4a" : gold, color: dark, fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: "4px" }}>
            {ordered ? "Order placed — see you soon!" : basePrice > 0 ? "Order Now — Pay $" + total : "Order Now"}
          </button>
        </div>
      </div>

      <div style={{ padding: "40px 28px", background: bg, borderBottom: "1px solid " + border }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: green, textTransform: "uppercase" as const, marginBottom: "8px" }}>Drinks Menu</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: dark, marginBottom: "16px" }}>What we brew</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
          {drinks.map(([name, price, desc]) => (
            <div key={name} style={{ background: "white", border: "1px solid " + border, borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: green, marginBottom: "3px" }}>{price}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: dark, marginBottom: "2px" }}>{name}</div>
              <div style={{ fontSize: "11px", color: muted, lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#2a1f14", padding: "44px 28px", borderBottom: "1px solid rgba(245,240,232,0.06)" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: lightGreen, textTransform: "uppercase" as const, marginBottom: "8px" }}>Forks and Farms x Northwest</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px,5vw,36px)", fontWeight: 900, color: cream, marginBottom: "8px", lineHeight: 1.1 }}>Coffee shop meets plant nursery.</div>
        <div style={{ fontSize: "13px", color: "rgba(245,240,232,0.5)", marginBottom: "20px", lineHeight: 1.6 }}>@forksandfarms is now open inside Northwest Coffee CWE. Pick up a plant with your pour-over.</div>
        {[
          [green, "Live plants available in-store", "Curated selection changes weekly"],
          [gold, "Open Mon-Sun 7am-6pm", "4251 Laclede Ave, CWE"],
          ["#5a3a1a", "Small-batch roasted weekly", "STLs only full city roast profile"],
        ].map(([bg2, title, sub], i) => (
          <div key={i} style={{ background: "rgba(245,240,232,0.04)", border: "1px solid rgba(245,240,232,0.07)", borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: bg2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={cream}><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-13 4 6-1 10 2 10 8-2-4-6-6-11-6 4 2 6 5 6 9C8 12 9 8 17 8Z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: cream, marginBottom: "2px" }}>{title}</div>
              <div style={{ fontSize: "11px", color: "rgba(245,240,232,0.4)" }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: "40px 28px", background: bg, borderBottom: "1px solid " + border }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: green, textTransform: "uppercase" as const, marginBottom: "8px" }}>Single Origins</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: dark, marginBottom: "16px" }}>Our beans</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px" }}>
          {beans.map(([img, origin, name, notes, price]) => (
            <div key={name} style={{ borderRadius: "12px", overflow: "hidden", background: "white", border: "1px solid " + border }}>
              <img src={img} alt={name} style={{ width: "100%", height: "120px", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "12px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: green, textTransform: "uppercase" as const, marginBottom: "3px" }}>{origin}</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: dark, marginBottom: "3px" }}>{name}</div>
                <div style={{ fontSize: "11px", color: muted, marginBottom: "6px" }}>{notes}</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: gold }}>{price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "40px 28px", borderBottom: "1px solid " + border }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: green, textTransform: "uppercase" as const, marginBottom: "8px" }}>Shop Beans</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: dark, marginBottom: "16px" }}>Brew at home</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
          {shopBeans.map(([img, name, price]) => (
            <div key={name} style={{ borderRadius: "10px", overflow: "hidden", background: "white", border: "1px solid " + border }}>
              <img src={img} alt={name} style={{ width: "100%", height: "90px", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "10px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: dark, marginBottom: "2px" }}>{name}</div>
                <div style={{ fontSize: "11px", color: gold, fontWeight: 700 }}>{price}</div>
              </div>
            </div>
          ))}
        </div>
        <a href="https://www.northwestcoffee.com/our-shop" target="_blank" rel="noreferrer" style={{ display: "block", width: "100%", padding: "13px", borderRadius: "8px", background: green, color: cream, fontSize: "14px", fontWeight: 700, textAlign: "center" as const, textDecoration: "none", marginTop: "14px" }}>Shop All Beans — Ships Nationwide</a>
      </div>

      <div style={{ padding: "40px 28px", background: bg, borderBottom: "1px solid " + border }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: green, textTransform: "uppercase" as const, marginBottom: "8px" }}>What people say</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: dark, marginBottom: "16px" }}>Real reviews</div>
        {reviews.map((r, i) => (
          <div key={i} style={{ background: "white", border: "1px solid " + border, borderRadius: "12px", padding: "16px", marginBottom: "8px" }}>
            <div style={{ fontSize: "13px", color: dark, lineHeight: 1.6, marginBottom: "8px", fontStyle: "italic" }}>{r}</div>
            <div style={{ fontSize: "11px", color: green, fontWeight: 700 }}>— Tripadvisor review</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "40px 28px", borderBottom: "1px solid " + border }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "2px", color: green, textTransform: "uppercase" as const, marginBottom: "8px" }}>Find us</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,5vw,40px)", fontWeight: 900, color: dark, marginBottom: "16px" }}>Two locations</div>
        <img src="https://images.squarespace-cdn.com/content/v1/544fabffe4b0df6ecb02a774/1482945013002-LKOMWG6EXE2HVFTVD6CB/image-asset.jpeg" alt="Northwest Coffee" style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "12px", display: "block", marginBottom: "14px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[["Central West End","4251 Laclede Ave","St. Louis, MO 63108","Mon-Sun 7am-6pm"],["Webster Groves","8650 Big Bend","Webster Groves, MO 63119","Mon-Sun 7am-1pm"]].map(([loc,addr,city,hours]) => (
            <div key={loc} style={{ background: "white", border: "1px solid " + border, borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.5px", color: green, textTransform: "uppercase" as const, marginBottom: "6px" }}>{loc}</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: dark, marginBottom: "3px" }}>{addr}</div>
              <div style={{ fontSize: "12px", color: muted, marginBottom: "4px" }}>{city}</div>
              <div style={{ fontSize: "11px", color: muted }}>{hours}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "10px", padding: "14px", background: "white", border: "1px solid " + border, borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", color: muted }}>314.371.4600</span>
          <a href="https://www.northwestcoffee.com" target="_blank" rel="noreferrer" style={{ fontSize: "12px", color: green, fontWeight: 700, textDecoration: "none" }}>northwestcoffee.com</a>
        </div>
      </div>

      <div style={{ background: dark, padding: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "12px" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "rgba(245,240,232,0.25)", fontWeight: 700 }}>Northwest Coffee Roasting Co.</div>
        <div style={{ fontSize: "11px", color: "rgba(245,240,232,0.2)" }}>Powered by <span style={{ color: gold, fontWeight: 700 }}>GEMM</span></div>
      </div>

    </div>
  );
}
