'use client';

// app/dashboard/discover/page.tsx — Discover Events
// Browse all published events from all creators

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getPublishedEvents, EventData } from "@/lib/events";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}input:focus{outline:none;border-color:#7c3aed!important}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const CalIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>);
const MapIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>);
const SearchIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const ImgPlaceholder=()=>(<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>);

export default function DiscoverEventsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  useEffect(() => { getPublishedEvents().then(e => { setEvents(e); setEventsLoading(false); }).catch(() => setEventsLoading(false)); }, []);

  const filtered = events.filter(e => !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.venueName?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (<div style={{minHeight:"100vh",background:"#f8f8f8",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style><div style={{width:24,height:24,borderRadius:"50%",background:"#000",animation:"pulse 1.5s ease infinite"}}/></div>);

  return (
    <div style={{ minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000" }}>
      <style>{css}</style>
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"32px 24px 64px" }}>
        <button onClick={()=>router.push("/dashboard")} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em" }}><ArrowLeft/> Back to Dashboard</button>
        <h1 style={{ fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Discover Events</h1>
        <p style={{ fontSize:15,opacity:.5,fontWeight:500,marginBottom:24 }}>Register to promote events and earn commissions.</p>

        <div style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:12,border:"1px solid #e5e5e5",background:"#fff",marginBottom:24 }}>
          <SearchIcon/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events..." style={{ flex:1,border:"none",background:"transparent",fontSize:14,fontFamily:"inherit",fontWeight:500,color:"#000",outline:"none" }}/>
        </div>

        {eventsLoading ? (
          <div style={{ textAlign:"center",padding:64,opacity:.4 }}>Loading events...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center",padding:64 }}>
            <div style={{ fontSize:48,marginBottom:16 }}>🎪</div>
            <h3 style={{ fontSize:20,fontWeight:900,marginBottom:8 }}>{events.length===0?"No events published yet":"No events match your search"}</h3>
            <p style={{ fontSize:14,opacity:.4 }}>Check back soon for upcoming experiences.</p>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))",gap:16 }}>
            {filtered.map(event => (
              <div key={event.id} onClick={()=>router.push(`/dashboard/events/new?edit=${event.id}`)}
                style={{ padding:0,borderRadius:16,border:"1px solid #e5e5e5",background:"#fff",cursor:"pointer",overflow:"hidden",transition:"all .2s" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 24px rgba(0,0,0,0.08)"}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="none"}}>
                <div style={{ aspectRatio:"16/9",background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                  {event.flyerURL ? <img src={event.flyerURL} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <ImgPlaceholder/>}
                </div>
                <div style={{ padding:16 }}>
                  <div style={{ fontSize:15,fontWeight:800,marginBottom:6,lineHeight:1.3 }}>{event.title}</div>
                  {event.startDate && <div style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,opacity:.5,marginBottom:2 }}><CalIcon/> {event.startDate}</div>}
                  {event.venueName && <div style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,opacity:.5 }}><MapIcon/> {event.venueName}</div>}
                  {event.tickets && event.tickets.length > 0 && (
                    <div style={{ marginTop:10,padding:"6px 12px",borderRadius:999,background:"#000",color:"#fff",fontSize:10,fontWeight:800,textTransform:"uppercase",textAlign:"center" }}>
                      {event.tickets[0].price === 0 ? "Free RSVP" : `From $${Math.min(...event.tickets.map(t=>t.price))}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
