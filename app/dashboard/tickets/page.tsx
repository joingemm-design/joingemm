'use client';

// app/dashboard/tickets/page.tsx — Find My Tickets
// Shows all events the user has registered for

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const TicketSvg=()=>(<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>);
const QrSvg=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/></svg>);

interface TicketEntry {
  id: string;
  eventId: string;
  eventTitle: string;
  ticketType: string;
  ticketPrice: number;
  createdAt: any;
}

export default function FindMyTicketsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketEntry[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Search across all events for this user's RSVPs
        const eventsSnap = await getDocs(collection(firestore, "events"));
        const allTickets: TicketEntry[] = [];
        for (const eventDoc of eventsSnap.docs) {
          const eventData = eventDoc.data();
          const rsvpQuery = query(collection(firestore, "events", eventDoc.id, "rsvps"), where("uid", "==", user.uid));
          const rsvpSnap = await getDocs(rsvpQuery);
          for (const rsvpDoc of rsvpSnap.docs) {
            const rsvp = rsvpDoc.data();
            allTickets.push({
              id: rsvpDoc.id,
              eventId: eventDoc.id,
              eventTitle: eventData.title || "Untitled Event",
              ticketType: rsvp.ticketType || "General",
              ticketPrice: rsvp.ticketPrice || 0,
              createdAt: rsvp.createdAt,
            });
          }
        }
        setTickets(allTickets);
      } catch (err) { console.error(err); }
      setTicketsLoading(false);
    })();
  }, [user]);

  if (loading) return (<div style={{minHeight:"100vh",background:"#f8f8f8",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style><div style={{width:24,height:24,borderRadius:"50%",background:"#000",animation:"pulse 1.5s ease infinite"}}/></div>);

  return (
    <div style={{ minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000" }}>
      <style>{css}</style>
      <div style={{ maxWidth:800,margin:"0 auto",padding:"32px 24px 64px" }}>
        <button onClick={()=>router.push("/dashboard")} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em" }}><ArrowLeft/> Back to Dashboard</button>
        <h1 style={{ fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Find My Tickets</h1>
        <p style={{ fontSize:15,opacity:.5,fontWeight:500,marginBottom:32 }}>Locate your passes & QR codes.</p>

        {ticketsLoading ? (
          <div style={{ textAlign:"center",padding:64,opacity:.4 }}>Searching for your tickets...</div>
        ) : tickets.length === 0 ? (
          <div style={{ textAlign:"center",padding:64,borderRadius:20,border:"1px dashed #ddd",background:"#fff" }}>
            <div style={{ fontSize:48,marginBottom:16 }}>🎟️</div>
            <h3 style={{ fontSize:20,fontWeight:900,marginBottom:8 }}>No tickets yet</h3>
            <p style={{ fontSize:14,opacity:.4,marginBottom:24 }}>Register for events to see your tickets here.</p>
            <button onClick={()=>router.push("/dashboard/discover")} style={{ padding:"12px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit" }}>Discover Events</button>
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {tickets.map(ticket => (
              <div key={ticket.id} style={{
                padding:20,borderRadius:16,border:"1px solid #e5e5e5",background:"#fff",
                display:"flex",alignItems:"center",justifyContent:"space-between",
                cursor:"pointer",transition:"all .2s",
              }}
              onClick={()=>window.open(`/event/${ticket.eventId}`,"_blank")}
              onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-1px)";(e.currentTarget as HTMLDivElement).style.boxShadow="0 4px 12px rgba(0,0,0,0.06)"}}
              onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="none"}}>
                <div style={{ display:"flex",alignItems:"center",gap:16 }}>
                  <div style={{ width:48,height:48,borderRadius:12,background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center" }}><TicketSvg/></div>
                  <div>
                    <div style={{ fontSize:15,fontWeight:800 }}>{ticket.eventTitle}</div>
                    <div style={{ fontSize:12,opacity:.5,marginTop:2 }}>{ticket.ticketType} • {ticket.ticketPrice===0?"FREE":`$${ticket.ticketPrice}`}</div>
                  </div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <div style={{ padding:"6px 12px",borderRadius:8,background:"#f0fdf4",color:"#166534",fontSize:10,fontWeight:800,textTransform:"uppercase" }}>Confirmed</div>
                  <div style={{ opacity:.3 }}><QrSvg/></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
