"use client";

// app/dashboard/page.tsx — Command Center (matches Wavey's dashboard)
// No sidebar. Centered layout with quick actions + workspace modules grid.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile, getUserLinks, updateUserProfile, addLink, updateLink, deleteLink, UserProfile, LinkItem } from "@/lib/db";

// ── Icons ───────────────────────────────────────────────────────────────
const SparkleIcon = () => (<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>);
const GoogleIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>);
const StripeIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.918 3.757 7.076c0 4.72 2.891 6.394 6.012 7.596 2.136.826 2.862 1.405 2.862 2.282 0 .965-.74 1.484-2.126 1.484-1.924 0-4.674-.929-6.591-2.108l-.907 5.513C4.887 22.838 7.879 24 11.388 24c2.595 0 4.735-.635 6.234-1.836 1.637-1.313 2.461-3.196 2.461-5.503 0-4.832-2.965-6.477-6.107-7.51z" fill="#635BFF"/></svg>);
const ArrowRightIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const EyeIcon = () => (<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>);
const EyeOffIcon = () => (<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>);
const SearchIcon = () => (<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const TicketIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>);
const WalletIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>);
const ChartIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>);
const HomeIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>);
const HelpIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>);
const ZapIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>);
const CalendarPlusIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18"/><path d="M16 19h6"/><path d="M19 16v6"/></svg>);
const CalendarCheckIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>);
const GlobeIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>);
const ShopIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>);
const ShoppingBagIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/></svg>);
const QrIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/></svg>);
const UploadIcon = () => (<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>);
const ArrowSmall = () => (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:.3}}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>);
const CmdIcon = () => (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:.4}}><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>);

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#030303;color:#e4e4e7}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(255,255,255,.05)}50%{box-shadow:0 0 40px rgba(255,255,255,.1)}}.fade{animation:fadeIn .6s ease forwards;opacity:0}input:focus{outline:none;box-shadow:0 0 0 2px rgba(255,255,255,0.1)!important}input::placeholder{color:rgba(255,255,255,0.2)}`;

// ── Auth Screens (same as before) ───────────────────────────────────────
function WorkspaceGateway({ onContinue }: { onContinue: () => void }) {
  const [v,setV]=useState(false);useEffect(()=>{setTimeout(()=>setV(true),100)},[]);
  return(<div style={{minHeight:"100vh",background:"#030303",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:24}}><style>{css}</style>
    <div style={{width:"100%",maxWidth:480,padding:48,borderRadius:24,border:"1px solid rgba(255,255,255,0.06)",background:"rgba(255,255,255,0.02)",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",alignItems:"center",gap:24,textAlign:"center",opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:"all .6s ease",animation:v?"glow 3s ease infinite":"none"}}>
      <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center"}}><SparkleIcon/></div>
      <div><h1 style={{fontSize:28,fontWeight:900,letterSpacing:"-0.03em",marginBottom:8}}>Workspace</h1><p style={{fontSize:15,color:"rgba(255,255,255,0.4)",fontWeight:500}}>Sign in to access your command center.</p></div>
      <button onClick={onContinue} style={{width:"100%",padding:"18px 32px",borderRadius:14,background:"#fff",color:"#000",border:"none",fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"transform .2s",boxShadow:"0 4px 12px rgba(255,255,255,0.08)"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>Continue <ArrowRightIcon/></button>
      <p style={{fontSize:11,color:"rgba(255,255,255,0.15)",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",marginTop:8}}>Powered by GEMM</p>
    </div></div>);
}

function AuthScreen({ onGoogle,onEmailSignIn,onEmailSignUp }:{onGoogle:()=>void;onEmailSignIn:(e:string,p:string)=>Promise<{error?:string}>;onEmailSignUp:(e:string,p:string,n?:string)=>Promise<{error?:string}>}) {
  const [mode,setMode]=useState<"signin"|"signup">("signin");const[email,setEmail]=useState("");const[password,setPassword]=useState("");const[name,setName]=useState("");const[error,setError]=useState("");const[showPw,setShowPw]=useState(false);const[busy,setBusy]=useState(false);const[v,setV]=useState(false);
  useEffect(()=>{setTimeout(()=>setV(true),100)},[]);
  async function submit(){setError("");if(!email.trim()){setError("Please enter your email.");return}if(!password.trim()){setError("Please enter your password.");return}if(mode==="signup"&&password.length<6){setError("Password must be at least 6 characters.");return}setBusy(true);const r=mode==="signin"?await onEmailSignIn(email,password):await onEmailSignUp(email,password,name||undefined);if(r.error){setError(r.error);setBusy(false)}}
  const inp:React.CSSProperties={width:"100%",padding:"14px 16px",borderRadius:10,border:"1px solid #ddd",fontSize:15,fontFamily:"inherit",fontWeight:500,color:"#000",background:"#fff",outline:"none"};
  return(<div style={{minHeight:"100vh",background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:24}}><style>{css}{`body{background:#f5f5f5!important;color:#000!important}input:focus{box-shadow:0 0 0 2px #3b82f6!important}input::placeholder{color:rgba(0,0,0,0.35)}`}</style>
    <div style={{width:"100%",maxWidth:420,padding:"48px 40px",borderRadius:20,background:"#fff",boxShadow:"0 8px 30px rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.06)",display:"flex",flexDirection:"column",alignItems:"center",gap:20,opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:"all .5s ease"}}>
      <div style={{width:56,height:56,borderRadius:16,background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff"}}/></div>
      <div style={{textAlign:"center"}}><h1 style={{fontSize:24,fontWeight:900,color:"#000",letterSpacing:"-0.03em"}}>Welcome</h1><p style={{fontSize:14,color:"#666",marginTop:4}}>{mode==="signin"?"Log in to GEMM to continue.":"Create your GEMM account."}</p></div>
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:12}}>
        {mode==="signup"&&<input type="text" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} style={inp}/>}
        <input type="email" placeholder="Email address*" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={inp}/>
        <div style={{position:"relative"}}><input type={showPw?"text":"password"} placeholder="Password*" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{...inp,paddingRight:48}}/><button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#999",padding:4}}>{showPw?<EyeOffIcon/>:<EyeIcon/>}</button></div>
        {error&&<p style={{fontSize:13,color:"#dc2626",fontWeight:600}}>{error}</p>}
        <button onClick={submit} disabled={busy} style={{width:"100%",padding:14,borderRadius:10,background:"#2563eb",color:"#fff",border:"none",fontSize:16,fontWeight:800,cursor:busy?"wait":"pointer",fontFamily:"inherit",opacity:busy?.7:1}}>{busy?"Loading...":mode==="signin"?"Continue":"Sign Up"}</button>
      </div>
      <p style={{fontSize:14,color:"#666"}}>{mode==="signin"?"Don't have an account? ":"Already have an account? "}<button onClick={()=>{setMode(mode==="signin"?"signup":"signin");setError("")}} style={{background:"none",border:"none",color:"#2563eb",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14}}>{mode==="signin"?"Sign up":"Sign in"}</button></p>
      <div style={{width:"100%",display:"flex",alignItems:"center",gap:16}}><div style={{flex:1,height:1,background:"#e5e5e5"}}/><span style={{fontSize:12,color:"#999",fontWeight:600,textTransform:"uppercase"}}>OR</span><div style={{flex:1,height:1,background:"#e5e5e5"}}/></div>
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={onGoogle} style={{width:"100%",padding:"14px 16px",borderRadius:10,border:"1px solid #ddd",background:"#fff",color:"#000",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12}} onMouseEnter={e=>e.currentTarget.style.background="#f9f9f9"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}><GoogleIcon/> Continue with Google</button>
        <button style={{width:"100%",padding:"14px 16px",borderRadius:10,border:"1px solid #ddd",background:"#fff",color:"#000",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12}} onMouseEnter={e=>e.currentTarget.style.background="#f9f9f9"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}><StripeIcon/> Continue with Stripe Connect</button>
      </div>
    </div></div>);
}

// ══════════════════════════════════════════════════════════════════════════
// COMMAND CENTER DASHBOARD — matches Wavey's layout
// ══════════════════════════════════════════════════════════════════════════
function CommandCenter({ user, profile, signOut }: { user: any; profile: UserProfile | null; signOut: () => void }) {
  const router = useRouter();
  const dn = profile?.displayName || user.displayName || "Creator";
  const em = user.email || "";
  const pic = profile?.photoURL || user.photoURL;
  const ini = dn.split(" ").map((n:string) => n[0]).join("").toUpperCase().slice(0, 2);
  const tier = "FREE TIER"; // placeholder

  const quickActions = [
    { icon: <TicketIcon/>, label: "Find My Tickets", desc: "Locate your passes & QR", cols: 1 },
    { icon: <WalletIcon/>, label: "Billing & Payouts", desc: "Manage billing and connect your bank account", cols: 1 },
    { icon: <ChartIcon/>, label: "Data & Analytics", desc: "Platform traffic intelligence", cols: 1 },
    { icon: <HomeIcon/>, label: "Go Home", desc: "Back to main site", cols: 1, action: () => router.push("/") },
    { icon: <HelpIcon/>, label: "Help & Support", desc: "Activate Neural Base", cols: 1 },
  ];

  const modules = [
    { icon: <ZapIcon/>, label: "Link-in-Bio", desc: "Create public profile", action: () => router.push("/dashboard/links") },
    { icon: <CalendarPlusIcon/>, label: "Publish Event", desc: "Deploy events, affiliates and onboarding forms", action: () => router.push("/dashboard/events/new") },
    { icon: <CalendarCheckIcon/>, label: "Manage Events", desc: "Tickets, guestlists & scanners", action: () => router.push("/dashboard/events") },
    { icon: <GlobeIcon/>, label: "Discover Events", desc: "Register to promote events" },
    { icon: <ShopIcon/>, label: "Publish Shop", desc: "Deploy shops, products & affiliates" },
    { icon: <ShoppingBagIcon/>, label: "Commerce", desc: "Manage Shops" },
    { icon: <QrIcon/>, label: "QR Codes", desc: "Dynamic tracking codes" },
    { icon: <UploadIcon/>, label: "Quick Media", desc: "Fast media upload tool" },
  ];

  const cardStyle: React.CSSProperties = {
    padding: 20, borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
    cursor: "pointer", fontFamily: "inherit",
    color: "#e4e4e7", transition: "all 0.25s",
    display: "flex", flexDirection: "column", gap: 12,
    position: "relative",
  };

  return (
    <div className="fade" style={{ minHeight: "100vh", background: "#030303", color: "#e4e4e7", fontFamily: "'DM Sans',sans-serif", padding: "0 24px 64px" }}>
      <style>{css}</style>

      {/* Top bar */}
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>
        {/* Left — user */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={signOut}>
          {pic ? (
            <Image src={pic} alt="" width={32} height={32} referrerPolicy="no-referrer" style={{ borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }}/>
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>{ini}</div>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{dn}</div>
            <div style={{ fontSize: 10, opacity: 0.3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{em}</div>
          </div>
        </div>

        {/* Right — tier badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }}/>
          {tier}
        </div>
      </div>

      {/* Command Center heading */}
      <div style={{ maxWidth: 1000, margin: "40px auto 32px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", fontStyle: "italic", marginBottom: 8 }}>
          Command Center
        </h1>
        <p style={{ fontSize: 15, opacity: 0.35, fontWeight: 500 }}>
          Welcome back. What&apos;s the focus today?
        </p>
      </div>

      {/* Search bar */}
      <div style={{ maxWidth: 560, margin: "0 auto 48px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "14px 18px", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
        }}>
          <CmdIcon/>
          <input
            placeholder="Search commands or ask AI..."
            style={{
              flex: 1, background: "transparent", border: "none", color: "#e4e4e7",
              fontSize: 14, fontWeight: 500, fontFamily: "inherit",
            }}
          />
          <SearchIcon/>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ maxWidth: 1000, margin: "0 auto 48px" }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.3, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16, height: 1, background: "rgba(255,255,255,0.2)", display: "inline-block" }}/>
          Quick Actions
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {quickActions.slice(0, 2).map(a => (
            <button key={a.label} onClick={a.action} style={{ ...cardStyle, textAlign: "left" } as any}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ opacity: 0.5 }}>{a.icon}</div>
                <ArrowSmall/>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{a.label}</div>
                <div style={{ fontSize: 11, opacity: 0.3, marginTop: 2 }}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
          {quickActions.slice(2).map(a => (
            <button key={a.label} onClick={a.action} style={{ ...cardStyle, textAlign: "left" } as any}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ opacity: 0.5 }}>{a.icon}</div>
                <ArrowSmall/>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{a.label}</div>
                <div style={{ fontSize: 11, opacity: 0.3, marginTop: 2 }}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Modules */}
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.3, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16, height: 1, background: "rgba(255,255,255,0.2)", display: "inline-block" }}/>
          Workspace Modules
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {modules.map(m => (
            <button key={m.label} onClick={m.action} style={{ ...cardStyle, textAlign: "left", minHeight: 130 } as any}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
              <div style={{ opacity: 0.4 }}>{m.icon}</div>
              <div style={{ marginTop: "auto" }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{m.label}</div>
                <div style={{ fontSize: 11, opacity: 0.3, marginTop: 2 }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN — orchestrates Gateway → Auth → Command Center
// ══════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { user, loading, signIn, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const router = useRouter();
  const [screen, setScreen] = useState<"gateway"|"auth"|"dashboard">("gateway");
  const [profile, setProfile] = useState<UserProfile|null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => { if (!loading && user) setScreen("dashboard"); }, [user, loading]);

  useEffect(() => {
    if (user && screen === "dashboard") {
      getUserProfile(user.uid).then(p => {
        if (!p || !p.username) router.push("/onboarding");
        else setProfile(p);
        setProfileLoading(false);
      });
    }
  }, [user, screen, router]);

  if (loading || (screen === "dashboard" && profileLoading)) return (
    <div style={{ minHeight:"100vh",background:"#030303",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <style>{css}</style>
      <div style={{ width:24,height:24,borderRadius:"50%",background:"#fff",boxShadow:"0 0 20px rgba(255,255,255,0.3)",animation:"pulse 1.5s ease infinite" }}/>
    </div>
  );

  if (screen === "gateway" && !user) return <WorkspaceGateway onContinue={() => setScreen("auth")}/>;
  if (screen === "auth" && !user) return <AuthScreen onGoogle={signIn} onEmailSignIn={signInWithEmail} onEmailSignUp={signUpWithEmail}/>;
  if (!user) return <WorkspaceGateway onContinue={() => setScreen("auth")}/>;

  return <CommandCenter user={user} profile={profile} signOut={signOut}/>;
}
