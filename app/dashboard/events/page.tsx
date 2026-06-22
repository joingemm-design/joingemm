"use client";

// app/dashboard/events/page.tsx — Event Portal
// Manage, search, and track events. Matches Wavey's Event Portal layout.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserEvents, EventData } from "@/lib/events";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}input:focus{outline:none;border-color:#7c3aed!important}input::placeholder{color:#aaa}`;

const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const SearchIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const CalIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>);
const MapIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>);
const SparkIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>);
const ImgPlaceholder=()=>(<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>);

const ADMIN_UIDS = ["3eWTfkVvdRcUTAiHPawy0WSHm1O2"];

export default function EventPortalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all"|"active"|"passed">("all");

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);

  const isAdmin = !!user && ADMIN_UIDS.includes(user.uid);

  useEffect(() => {
    if (!user) return;
    if (isAdmin) {
      // Admin sees all events
      import("@/lib/firebase").then(({ firestore }) => {
        import("firebase/firestore").then(({ collection, getDocs, query, orderBy }) => {
          const q = query(collection(firestore, "events"), orderBy("createdAt", "desc"));
          getDocs(q).then(snap => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as EventData));
            setEvents(list);
            setEventsLoading(false);
          });
        });
      });
    } else {
      getUserEvents(user.uid).then(e => { setEvents(e); setEventsLoading(false); });
    }
  }, [user, isAdmin]);

  function getEventStatus(event: EventData): "upcoming"|"active"|"passed" {
    if (!event.published) return "upcoming";
    if (!event.endDate) return "active";
    const end = new Date(`${event.endDate}T${event.endTime || "23:59"}`);
    return end < new Date() ? "passed" : "active";
  }

  const filtered = events.filter(e => {
    const matchesSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.venueName?.toLowerCase().includes(search.toLowerCase());
    const status = getEventStatus(e);
    const matchesFilter = filter === "all" || (filter === "active" && status !== "passed") || (filter === "passed" && status === "passed");
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#f8f8f8",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{css}</style><div style={{width:24,height:24,borderRadius:"50%",background:"#000",animation:"pulse 1.5s ease infinite"}}/></div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f8f8f8", fontFamily:"'DM Sans',sans-serif", color:"#000" }}>
      <style>{css}</style>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px 64px" }}>
        {/* Back link */}
        <button onClick={() => router.push("/dashboard")} style={{
          display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
          fontSize:12, fontWeight:700, color:"#888", cursor:"pointer", fontFamily:"inherit",
          marginBottom:24, textTransform:"uppercase", letterSpacing:"0.08em",
        }}>
          <ArrowLeft/> Back to Dashboard
        </button>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:36, fontWeight:900, letterSpacing:"-0.03em", marginBottom:4 }}>Event Portal</h1>
            <p style={{ fontSize:15, opacity:.5, fontWeight:500 }}>Manage, promote, and track your experiences beautifully.</p>
          </div>
          <button onClick={() => router.push("/dashboard/events/new")} style={{
            display:"flex", alignItems:"center", gap:8, padding:"14px 24px", borderRadius:999,
            background:"#000", color:"#fff", border:"none", fontSize:14, fontWeight:800,
            cursor:"pointer", fontFamily:"inherit", transition:"transform .2s",
          }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <SparkIcon/> Create New Event
          </button>
        </div>

        {/* Search + Filters */}
        <div style={{ display:"flex", gap:12, marginBottom:24, alignItems:"center" }}>
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, border:"1px solid #e5e5e5", background:"#fff" }}>
            <SearchIcon/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events..."
              style={{ flex:1, border:"none", background:"transparent", fontSize:14, fontFamily:"inherit", fontWeight:500, color:"#000", outline:"none" }}/>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {(["all","active","passed"] as const).map(f => (
              <button key={f} onClick={()=>setFilter(f)} style={{
                padding:"10px 16px", borderRadius:999, fontSize:12, fontWeight:700,
                textTransform:"uppercase", letterSpacing:"0.05em",
                border: filter===f ? "2px solid #000" : "1px solid #ddd",
                background: filter===f ? "#000" : "#fff",
                color: filter===f ? "#fff" : "#888",
                cursor:"pointer", fontFamily:"inherit",
              }}>
                {f === "all" ? "All Status" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {eventsLoading ? (
          <div style={{ textAlign:"center", padding:64, opacity:.4 }}>Loading events...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:64 }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🎪</div>
            <h3 style={{ fontSize:20, fontWeight:900, marginBottom:8 }}>
              {events.length === 0 ? "No events yet" : "No events match your search"}
            </h3>
            <p style={{ fontSize:14, opacity:.4, marginBottom:24 }}>
              {events.length === 0 ? "Create your first event to get started." : "Try a different search or filter."}
            </p>
            {events.length === 0 && (
              <button onClick={() => router.push("/dashboard/events/new")} style={{
                padding:"12px 24px", borderRadius:999, background:"#000", color:"#fff",
                border:"none", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit",
              }}>Create New Event</button>
            )}
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(250px, 1fr))", gap:16 }}>
            {filtered.map(event => {
              const status = getEventStatus(event);
              return (
                <button key={event.id} onClick={() => router.push(`/dashboard/event-detail?id=${event.id}`)}
                  style={{
                    padding:16, borderRadius:16, border:"1px solid #e5e5e5", background:"#fff",
                    cursor:"pointer", textAlign:"left", fontFamily:"inherit", color:"#000",
                    transition:"all .2s", display:"flex", flexDirection:"column", gap:12,
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.08)"}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
                  {/* Flyer thumbnail */}
                  <div style={{ width:"100%", aspectRatio:"1", borderRadius:12, background:"#f5f5f5", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {event.flyerURL ? (
                      <img src={event.flyerURL} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    ) : (
                      <ImgPlaceholder/>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, marginBottom:4, lineHeight:1.3 }}>{event.title || "Untitled Event"}</div>
                    {event.startDate && (
                      <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, opacity:.5, marginBottom:2 }}>
                        <CalIcon/> {event.startDate}{event.startTime ? `, ${event.startTime}` : ""}
                      </div>
                    )}
                    {event.venueName && (
                      <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, opacity:.5 }}>
                        <MapIcon/> {event.venueName}
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  <div style={{
                    padding:"6px 14px", borderRadius:999, fontSize:10, fontWeight:800,
                    textTransform:"uppercase", letterSpacing:"0.08em", textAlign:"center",
                    background: status === "passed" ? "#f5f5f5" : status === "active" ? "#000" : "#f0fdf4",
                    color: status === "passed" ? "#999" : status === "active" ? "#fff" : "#166534",
                    border: status === "active" ? "none" : "1px solid #e5e5e5",
                  }}>
                    {status === "passed" ? "Event Passed" : status === "active" ? "Live" : event.published ? "Published" : "Draft"}
                  </div>
                  {event.staffPin && (
                    <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 10, marginTop: 4 }} onClick={e => e.stopPropagation()}>
                      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", opacity: 0.4, marginBottom: 4 }}>STAFF CHECK-IN PIN</div>
                      <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "0.15em", fontVariantNumeric: "tabular-nums" }}>{event.staffPin}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
