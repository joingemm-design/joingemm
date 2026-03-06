'use client';

// app/dashboard/analytics/page.tsx — Data & Analytics
// Platform traffic intelligence

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile, getUserLinks, UserProfile, LinkItem } from "@/lib/db";
import { getUserEvents, EventData } from "@/lib/events";
import { getUserShops, ShopData } from "@/lib/shop";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile|null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [shops, setShops] = useState<ShopData[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getUserProfile(user.uid),
      getUserLinks(user.uid),
      getUserEvents(user.uid),
      getUserShops(user.uid),
    ]).then(([p, l, e, s]) => {
      setProfile(p); setLinks(l); setEvents(e); setShops(s); setReady(true);
    });
  }, [user]);

  const totalLinks = links.length;
  const activeLinks = links.filter(l => l.active).length;
  const totalEvents = events.length;
  const publishedEvents = events.filter(e => e.published).length;
  const totalShops = shops.length;
  const publicShops = shops.filter(s => s.isPublic).length;
  const totalProducts = shops.reduce((acc, s) => acc + (s.products?.length || 0), 0);

  const stats = [
    { label: "Total Links", value: totalLinks, sub: `${activeLinks} active`, color: "#7c3aed" },
    { label: "Total Events", value: totalEvents, sub: `${publishedEvents} published`, color: "#ec4899" },
    { label: "Total Shops", value: totalShops, sub: `${publicShops} public`, color: "#f59e0b" },
    { label: "Total Products", value: totalProducts, sub: "across all shops", color: "#10b981" },
  ];

  if (loading) return (<div style={{minHeight:"100vh",background:"#f8f8f8",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style><div style={{width:24,height:24,borderRadius:"50%",background:"#000",animation:"pulse 1.5s ease infinite"}}/></div>);

  return (
    <div style={{ minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000" }}>
      <style>{css}</style>
      <div style={{ maxWidth:1000,margin:"0 auto",padding:"32px 24px 64px" }}>
        <button onClick={()=>router.push("/dashboard")} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em" }}><ArrowLeft/> Back to Dashboard</button>
        <h1 style={{ fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Data & Analytics</h1>
        <p style={{ fontSize:15,opacity:.5,fontWeight:500,marginBottom:32 }}>Platform traffic intelligence.</p>

        {!ready ? (
          <div style={{ textAlign:"center",padding:64,opacity:.4 }}>Loading analytics...</div>
        ) : (
          <>
            {/* Stats grid */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:16,marginBottom:32 }}>
              {stats.map(s => (
                <div key={s.label} style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff" }}>
                  <div style={{ fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",opacity:.4,marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontSize:36,fontWeight:900,letterSpacing:"-0.04em",color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:12,opacity:.4,marginTop:4 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Activity overview */}
            <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16 }}>
              <div style={{ fontSize:15,fontWeight:900,marginBottom:16 }}>Content Overview</div>
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {/* Links bar */}
                <div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:6 }}>
                    <span>Links</span><span>{activeLinks}/{totalLinks} active</span>
                  </div>
                  <div style={{ height:8,borderRadius:999,background:"#f0f0f0",overflow:"hidden" }}>
                    <div style={{ height:"100%",borderRadius:999,background:"#7c3aed",width:totalLinks?`${(activeLinks/totalLinks)*100}%`:"0%",transition:"width .5s" }}/>
                  </div>
                </div>
                {/* Events bar */}
                <div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:6 }}>
                    <span>Events</span><span>{publishedEvents}/{totalEvents} published</span>
                  </div>
                  <div style={{ height:8,borderRadius:999,background:"#f0f0f0",overflow:"hidden" }}>
                    <div style={{ height:"100%",borderRadius:999,background:"#ec4899",width:totalEvents?`${(publishedEvents/totalEvents)*100}%`:"0%",transition:"width .5s" }}/>
                  </div>
                </div>
                {/* Shops bar */}
                <div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:700,marginBottom:6 }}>
                    <span>Shops</span><span>{publicShops}/{totalShops} public</span>
                  </div>
                  <div style={{ height:8,borderRadius:999,background:"#f0f0f0",overflow:"hidden" }}>
                    <div style={{ height:"100%",borderRadius:999,background:"#f59e0b",width:totalShops?`${(publicShops/totalShops)*100}%`:"0%",transition:"width .5s" }}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile info */}
            <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff" }}>
              <div style={{ fontSize:15,fontWeight:900,marginBottom:16 }}>Profile</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
                <div style={{ padding:16,borderRadius:12,background:"#fafafa" }}>
                  <div style={{ fontSize:11,fontWeight:700,opacity:.4,textTransform:"uppercase",marginBottom:4 }}>Username</div>
                  <div style={{ fontSize:15,fontWeight:800 }}>@{profile?.username || "not set"}</div>
                </div>
                <div style={{ padding:16,borderRadius:12,background:"#fafafa" }}>
                  <div style={{ fontSize:11,fontWeight:700,opacity:.4,textTransform:"uppercase",marginBottom:4 }}>Theme</div>
                  <div style={{ fontSize:15,fontWeight:800,textTransform:"capitalize" }}>{profile?.design?.preset || profile?.theme || "clean"}</div>
                </div>
                <div style={{ padding:16,borderRadius:12,background:"#fafafa" }}>
                  <div style={{ fontSize:11,fontWeight:700,opacity:.4,textTransform:"uppercase",marginBottom:4 }}>Bio</div>
                  <div style={{ fontSize:13,fontWeight:500,opacity:.7 }}>{profile?.bio || "No bio set"}</div>
                </div>
                <div style={{ padding:16,borderRadius:12,background:"#fafafa" }}>
                  <div style={{ fontSize:11,fontWeight:700,opacity:.4,textTransform:"uppercase",marginBottom:4 }}>Socials Connected</div>
                  <div style={{ fontSize:15,fontWeight:800 }}>{profile?.socials ? Object.values(profile.socials).filter(v=>v).length : 0}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
