"use client";

// app/dashboard/qr/page.tsx — QR Code Generator
// Generate dynamic QR codes for links, events, shops, or any URL

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile, UserProfile } from "@/lib/db";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}input:focus{outline:none;border-color:#7c3aed!important}`;

const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const DownloadIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>);
const CopyIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>);
const LinkIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
const CalIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>);
const ShopIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/></svg>);

// Simple QR code generator using canvas — no external library needed
function generateQRDataURL(text: string, size: number = 256): string {
  // Use Google Charts API for QR generation (works without any library)
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=10`;
}

export default function QRCodePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile|null>(null);
  const [url, setUrl] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [label, setLabel] = useState("");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [savedCodes, setSavedCodes] = useState<{url:string;label:string;created:string}[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(p => {
        if (p) {
          setProfile(p);
          // Default URL to their profile
          const profileUrl = `${window.location.origin}/${p.username}`;
          setUrl(profileUrl);
          setQrUrl(generateQRURL(profileUrl));
        }
      });
      // Load saved QR codes from localStorage
      try {
        const saved = JSON.parse(localStorage.getItem("gemm_qr_codes") || "[]");
        setSavedCodes(saved);
      } catch {}
    }
  }, [user]);

  function generateQRURL(targetUrl: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(targetUrl)}&color=${fgColor.replace("#","")}&bgcolor=${bgColor.replace("#","")}&format=png&margin=10`;
  }

  function handleGenerate() {
    if (!url.trim()) return;
    let target = url.trim();
    if (!target.startsWith("http")) target = "https://" + target;
    setQrUrl(generateQRURL(target));
  }

  function handleSave() {
    if (!qrUrl || !url.trim()) return;
    const newCode = { url: url.trim(), label: label.trim() || url.trim(), created: new Date().toISOString() };
    const updated = [newCode, ...savedCodes].slice(0, 20);
    setSavedCodes(updated);
    try { localStorage.setItem("gemm_qr_codes", JSON.stringify(updated)); } catch {}
  }

  function handleDownload() {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `qr-${label || "code"}-${Date.now()}.png`;
    a.target = "_blank";
    a.click();
  }

  function copyUrl() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function quickSet(type: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    if (type === "profile" && profile) { setUrl(`${origin}/${profile.username}`); setLabel("My Profile"); }
    else if (type === "event") { setUrl(`${origin}/dashboard/events`); setLabel("Events"); }
    else if (type === "shop") { setUrl(`${origin}/dashboard/shop`); setLabel("Shop"); }
  }

  const inp: React.CSSProperties = { width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid #e0e0e0",fontSize:14,fontFamily:"inherit",fontWeight:500,color:"#000",background:"#fff" };
  const section: React.CSSProperties = { padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16 };

  if (loading) return (<div style={{minHeight:"100vh",background:"#f8f8f8",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style><div style={{width:24,height:24,borderRadius:"50%",background:"#000",animation:"pulse 1.5s ease infinite"}}/></div>);

  return (
    <div style={{ minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000" }}>
      <style>{css}</style>
      <div style={{ maxWidth:900,margin:"0 auto",padding:"32px 24px 64px" }}>
        <button onClick={()=>router.push("/dashboard")} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em" }}>
          <ArrowLeft/> Back to Dashboard
        </button>

        <h1 style={{ fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>QR Codes</h1>
        <p style={{ fontSize:15,opacity:.5,fontWeight:500,marginBottom:32 }}>Generate dynamic tracking codes for anything.</p>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:24 }}>
          {/* Left: Generator */}
          <div>
            <div style={section}>
              <div style={{ fontSize:13,fontWeight:800,marginBottom:16 }}>Generate QR Code</div>

              {/* Quick presets */}
              <div style={{ display:"flex",gap:8,marginBottom:16 }}>
                <button onClick={()=>quickSet("profile")} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:999,border:"1px solid #e5e5e5",background:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}><LinkIcon/> My Profile</button>
                <button onClick={()=>quickSet("event")} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:999,border:"1px solid #e5e5e5",background:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}><CalIcon/> Events</button>
                <button onClick={()=>quickSet("shop")} style={{ display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:999,border:"1px solid #e5e5e5",background:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}><ShopIcon/> Shop</button>
              </div>

              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",color:"#888",marginBottom:6,display:"block" }}>URL</label>
                <div style={{ display:"flex",gap:8 }}>
                  <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." onKeyDown={e=>e.key==="Enter"&&handleGenerate()} style={{...inp,flex:1}}/>
                  <button onClick={copyUrl} style={{ padding:"12px",borderRadius:10,border:"1px solid #e0e0e0",background:"#fff",cursor:"pointer" }}>{copied?<span style={{fontSize:11,fontWeight:700,color:"#22c55e"}}>✓</span>:<CopyIcon/>}</button>
                </div>
              </div>

              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",color:"#888",marginBottom:6,display:"block" }}>Label (Optional)</label>
                <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="My Profile QR" style={inp}/>
              </div>

              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16 }}>
                <div>
                  <label style={{ fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",color:"#888",marginBottom:6,display:"block" }}>Size</label>
                  <select value={size} onChange={e=>setSize(Number(e.target.value))} style={{...inp,cursor:"pointer"}}>
                    <option value={128}>128px</option>
                    <option value={256}>256px</option>
                    <option value={512}>512px</option>
                    <option value={1024}>1024px</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",color:"#888",marginBottom:6,display:"block" }}>Foreground</label>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)} style={{width:36,height:36,borderRadius:8,border:"1px solid #ddd",cursor:"pointer"}}/>
                    <span style={{fontSize:10,fontFamily:"monospace",opacity:.5}}>{fgColor}</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",color:"#888",marginBottom:6,display:"block" }}>Background</label>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} style={{width:36,height:36,borderRadius:8,border:"1px solid #ddd",cursor:"pointer"}}/>
                    <span style={{fontSize:10,fontFamily:"monospace",opacity:.5}}>{bgColor}</span>
                  </div>
                </div>
              </div>

              <div style={{ display:"flex",gap:8 }}>
                <button onClick={handleGenerate} style={{ flex:1,padding:"12px",borderRadius:10,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit" }}>Generate</button>
                <button onClick={handleDownload} disabled={!qrUrl} style={{ display:"flex",alignItems:"center",gap:6,padding:"12px 20px",borderRadius:10,border:"1px solid #ddd",background:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:qrUrl?1:.4 }}><DownloadIcon/> Download</button>
                <button onClick={handleSave} disabled={!qrUrl} style={{ padding:"12px 20px",borderRadius:10,border:"1px solid #ddd",background:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:qrUrl?1:.4 }}>Save</button>
              </div>
            </div>

            {/* Saved codes */}
            {savedCodes.length > 0 && (
              <div style={section}>
                <div style={{ fontSize:13,fontWeight:800,marginBottom:12 }}>Saved QR Codes</div>
                <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                  {savedCodes.map((code, i) => (
                    <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:12,borderRadius:10,border:"1px solid #e5e5e5",background:"#fafafa" }}>
                      <div>
                        <div style={{ fontSize:13,fontWeight:700 }}>{code.label}</div>
                        <div style={{ fontSize:11,opacity:.4,marginTop:2 }}>{code.url}</div>
                      </div>
                      <button onClick={()=>{setUrl(code.url);setLabel(code.label);handleGenerate()}} style={{ padding:"6px 12px",borderRadius:8,border:"1px solid #ddd",background:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Load</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div>
            <div style={{ ...section,position:"sticky",top:24,textAlign:"center" }}>
              <div style={{ fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",opacity:.4,marginBottom:16 }}>Preview</div>
              {qrUrl ? (
                <div>
                  <div style={{ padding:16,background:bgColor,borderRadius:16,display:"inline-block",border:"1px solid #eee" }}>
                    <img src={qrUrl} alt="QR Code" style={{ width:size > 300 ? 256 : size,height:size > 300 ? 256 : size,imageRendering:"pixelated" }}/>
                  </div>
                  {label && <div style={{ fontSize:13,fontWeight:700,marginTop:12 }}>{label}</div>}
                  <div style={{ fontSize:11,opacity:.3,marginTop:4,wordBreak:"break-all" }}>{url}</div>
                </div>
              ) : (
                <div style={{ padding:48,opacity:.2 }}>
                  <div style={{ fontSize:48,marginBottom:8 }}>📱</div>
                  <p style={{ fontSize:13 }}>Enter a URL and click Generate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
