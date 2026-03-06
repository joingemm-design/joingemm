"use client";

// components/ProfileView.tsx
// Renders public profile page for /username routes

import { useState, useEffect } from "react";
import { getUserByUsername, getUserLinks, UserProfile, LinkItem } from "@/lib/db";

const IgIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>);
const TtIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.5a6.34 6.34 0 0 0 6.34-6.34V8.71a8.35 8.35 0 0 0 4.76 1.49V6.75a4.84 4.84 0 0 1-1-.06z"/></svg>);
const TwIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);
const YtIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/></svg>);
const LiIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>);
const FbIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);

export default function ProfileView({ username }: { username: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const p = await getUserByUsername(username);
        if (!p) { setNotFound(true); setLoading(false); return; }
        setProfile(p);
        const l = await getUserLinks(p.uid);
        setLinks(l.filter(link => link.active));
      } catch { setNotFound(true); }
      setLoading(false);
    })();
  }, [username]);

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#050505",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:24,height:24,borderRadius:"50%",background:"#fff",animation:"pulse 1.5s ease infinite"}}/>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );

  if (notFound || !profile) return (
    <div style={{minHeight:"100vh",background:"#050505",color:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",gap:16,padding:24}}>
      <div style={{fontSize:48}}>🔍</div>
      <h1 style={{fontSize:24,fontWeight:900}}>Page not found</h1>
      <p style={{fontSize:15,opacity:.5}}>@{username} hasn't claimed this page yet.</p>
      <a href="/" style={{marginTop:16,padding:"12px 28px",borderRadius:999,background:"#fff",color:"#000",textDecoration:"none",fontWeight:700,fontSize:14}}>Claim yours →</a>
    </div>
  );

  const d = profile.design || {};
  const bg = d.bgColor || "#ffffff";
  const text = d.textColor || "#000000";
  const btn = d.buttonBg || "#000000";
  const btnText = d.buttonText || "#ffffff";
  const btnRadius = d.buttonShape === "square" ? 4 : d.buttonShape === "pill" ? 999 : 12;
  const btnShadow = d.buttonShadow === "hard" ? `4px 4px 0 ${text}` : d.buttonShadow === "soft" ? "0 4px 12px rgba(0,0,0,0.15)" : "none";
  const fontFamily = d.typography === "serif" ? "Georgia,serif" : d.typography === "mono" ? "'DM Mono',monospace" : "'DM Sans',sans-serif";
  const spacing = d.spacing === "compact" ? 8 : d.spacing === "airy" ? 20 : 12;
  const socials = profile.socials || {};
  const initials = profile.displayName?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "?";

  return (
    <div style={{minHeight:"100vh",background:bg,color:text,display:"flex",flexDirection:"column",alignItems:"center",fontFamily,padding:"60px 24px 40px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.link-fade{animation:fadeIn .5s ease forwards;opacity:0}`}</style>
      <div style={{width:"100%",maxWidth:420,display:"flex",flexDirection:"column",alignItems:"center",gap:spacing*1.5}}>
        {profile.photoURL ? (
          <img src={profile.photoURL} alt="" referrerPolicy="no-referrer" style={{width:96,height:96,borderRadius:"50%",objectFit:"cover",border:`3px solid ${text}20`}}/>
        ) : (
          <div style={{width:96,height:96,borderRadius:"50%",background:`${text}10`,border:`3px solid ${text}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:900,opacity:.5}}>{initials}</div>
        )}
        <div style={{textAlign:"center"}}>
          <h1 style={{fontSize:22,fontWeight:900,letterSpacing:"-0.02em"}}>{profile.displayName}</h1>
          <p style={{fontSize:14,opacity:.5,marginTop:4}}>@{profile.username}</p>
          {profile.bio && <p style={{fontSize:15,opacity:.7,marginTop:12,maxWidth:360,lineHeight:1.5}}>{profile.bio}</p>}
        </div>
        {Object.values(socials).some(v=>v) && (
          <div style={{display:"flex",gap:12}}>
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><IgIcon/></a>}
            {socials.tiktok && <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><TtIcon/></a>}
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><TwIcon/></a>}
            {socials.youtube && <a href={socials.youtube} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><YtIcon/></a>}
            {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><LiIcon/></a>}
            {socials.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><FbIcon/></a>}
          </div>
        )}
        <div style={{width:"100%",display:"flex",flexDirection:"column",gap:spacing,marginTop:8}}>
          {links.map((link,i) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="link-fade"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 20px",borderRadius:btnRadius,background:btn,color:btnText,textDecoration:"none",fontWeight:700,fontSize:15,boxShadow:btnShadow,transition:"transform .2s",animationDelay:`${i*0.1}s`}}
              onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.transform="scale(1.02)"}
              onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.transform="scale(1)"}>
              {link.icon && <span>{link.icon}</span>}{link.title}
            </a>
          ))}
          {links.length === 0 && <div style={{textAlign:"center",padding:32,opacity:.3,fontSize:14}}>No links yet</div>}
        </div>
        <div style={{marginTop:32,display:"flex",alignItems:"center",gap:8,opacity:.2,fontSize:12,fontWeight:700}}>
          <div style={{width:16,height:16,borderRadius:"50%",background:text,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:bg}}/></div>GEMM
        </div>
      </div>
    </div>
  );
}
