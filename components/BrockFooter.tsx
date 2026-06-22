"use client";
import { useState } from "react";

const IgIcon=()=>(<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>);
const YtIcon=()=>(<svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><polygon points="9.75,15.02 15.5,12 9.75,8.98" fill="#000"/></svg>);

export default function BrockFooter({ username = "palettebyseals" }: { username?: string }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async () => {
    if (!email.includes("@")) return;
    setSubmitting(true);
    try {
      const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
      const { firestore } = await import("@/lib/firebase");
      await addDoc(collection(firestore, "subscribers"), {
        firstName, lastName, email,
        creatorUsername: username,
        createdAt: serverTimestamp(),
      });
      setSubscribed(true);
    } catch(e) { console.error(e); }
    setSubmitting(false);
  };

  return (
    <div style={{background:"#000",color:"#fff",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');`}</style>

      {/* Newsletter */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,.1)",padding:"56px 24px",textAlign:"center"}}>
        <h2 style={{fontSize:"clamp(18px,4vw,28px)",fontWeight:900,letterSpacing:".1em",textTransform:"uppercase",marginBottom:16}}>LET'S CREATE SOMETHING LEGENDARY!</h2>
        <p style={{fontSize:14,opacity:.5,marginBottom:28}}>Sign up with your email address to receive news and updates.</p>
        {subscribed ? (
          <div style={{fontSize:14,fontWeight:700,opacity:.6}}>✓ You're subscribed!</div>
        ) : (
          <div style={{display:"flex",gap:0,maxWidth:640,margin:"0 auto",flexWrap:"wrap" as const,justifyContent:"center"}}>
            <input
              value={firstName}
              onChange={e=>setFirstName(e.target.value)}
              placeholder="First name"
              style={{flex:"1 1 140px",padding:"14px 18px",border:"1.5px solid rgba(255,255,255,.3)",borderRight:"none",background:"transparent",color:"#fff",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",minWidth:120}}
            />
            <input
              value={lastName}
              onChange={e=>setLastName(e.target.value)}
              placeholder="Last name"
              style={{flex:"1 1 140px",padding:"14px 18px",border:"1.5px solid rgba(255,255,255,.3)",borderRight:"none",background:"transparent",color:"#fff",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",minWidth:120}}
            />
            <input
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              onKeyDown={e=>e.key==="Enter"&&handleSubscribe()}
              style={{flex:"1 1 180px",padding:"14px 18px",border:"1.5px solid rgba(255,255,255,.3)",borderRight:"none",background:"transparent",color:"#fff",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",minWidth:160}}
            />
            <button
              onClick={handleSubscribe}
              disabled={submitting||!email.includes("@")}
              style={{padding:"14px 24px",border:"1.5px solid rgba(255,255,255,.3)",background:"transparent",color:"#fff",fontSize:12,fontWeight:900,letterSpacing:".15em",textTransform:"uppercase",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",opacity:submitting||!email.includes("@")?0.5:1}}
            >
              {submitting?"...":"SUBSCRIBE"}
            </button>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div style={{padding:"32px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap" as const,gap:20,maxWidth:1100,margin:"0 auto"}}>
        {/* Logo */}
        <img
          src="https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Palette-By-Seals-Stacked-Horizontal-08.png"
          alt="Palette by Seals"
          style={{height:36,objectFit:"contain",filter:"invert(0)"}}
        />
        {/* Nav links */}
        <div style={{display:"flex",gap:40,alignItems:"center"}}>
          <a href={"/"+username+"/services"} style={{color:"#fff",textDecoration:"none",fontSize:13,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",opacity:.8}}>SERVICES</a>
          <a href={"/"+username+"/music"} style={{color:"#fff",textDecoration:"none",fontSize:13,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",opacity:.8}}>MUSIC</a>
          <a href={"/"+username} style={{color:"#fff",textDecoration:"none",fontSize:13,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",opacity:.8}}>WORK</a>
        </div>
        {/* Socials */}
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <a href="https://www.instagram.com/palettebyseals" target="_blank" rel="noopener noreferrer" style={{color:"#fff",opacity:.7}}><IgIcon/></a>
          <a href="https://www.youtube.com/@palettebyseals" target="_blank" rel="noopener noreferrer" style={{color:"#fff",opacity:.7}}><YtIcon/></a>
        </div>
      </div>

      {/* Copyright */}
      <div style={{borderTop:"1px solid rgba(255,255,255,.08)",padding:"20px 24px",textAlign:"center",fontSize:11,opacity:.35,letterSpacing:".08em",fontWeight:700}}>
        © 2019-2025 ALL RIGHTS RESERVED PALETTE BY SEALS, LLC. | <a href={"/"+username+"/privacy"} style={{color:"#fff",textDecoration:"none"}}>PRIVACY POLICY</a> | <a href={"/"+username+"/terms"} style={{color:"#fff",textDecoration:"none"}}>TERMS + CONDITIONS</a>
      </div>
    </div>
  );
}
