"use client";

// components/EventView.tsx

function formatTime(t?: string): string {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}
// Renders public event page for /event/id routes

import { useState, useEffect } from "react";
import { getEvent, registerForEvent, createOrder, getEventRSVPCount, EventData } from "@/lib/events";
import { useAuth } from "@/hooks/useAuth";

const CalIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>);
const MapPin=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>);
const ClockIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>);
const TicketIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>);
const CheckIcon=()=>(<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>);

export default function EventView({ eventId }: { eventId: string }) {
  const { user } = useAuth();
  const [event, setEvent] = useState<EventData|null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<string|null>(null);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);

  useEffect(() => {
    if (!eventId) return;
    getEvent(eventId).then(e => {
      if (!e) { setNotFound(true); setLoading(false); return; }
      setEvent(e);
      if (e.tickets && e.tickets.length > 0) setSelectedTicket(e.tickets[0].id);
      getEventRSVPCount(eventId).then(c => setRsvpCount(c));
      setLoading(false);
    }).catch(() => { setNotFound(true); setLoading(false); });
  }, [eventId]);

  async function handleRegister() {
    if (!event || !selectedTicket || !rsvpName.trim() || !rsvpEmail.trim()) return;
    setRegistering(true);
    try {
      const ticket = event.tickets?.find(t => t.id === selectedTicket);

      // 1. Save RSVP (existing behaviour — keeps your rsvps subcollection intact)
      const rsvpId = await registerForEvent(
        event.id,
        user?.uid || "anonymous",
        rsvpName.trim(),
        rsvpEmail.trim(),
        ticket?.type || "",
        ticket?.price || 0
      );

      // 2. Create an order doc so /event-success can fetch it
      const orderId = await createOrder({
        eventId: event.id,
        eventName: event.title,
        customerName: rsvpName.trim(),
        customerEmail: rsvpEmail.trim(),
        ticketType: ticket?.type || "GENERAL ADMISSION",
        ticketPrice: ticket?.price || 0,
        rsvpId,
        startDate: event.startDate || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        venueName: event.venueName || "",
        address: event.address || "",
      });

      // 3. Redirect to the confirmation + ticket page
      window.location.href = `/event-success?orderId=${orderId}`;
    } catch (err) {
      setRegistering(false);
    }
  }

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:24,height:24,borderRadius:"50%",background:"#fff",animation:"pulse 1.5s ease infinite"}}/>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );

  if (notFound || !event) return (
    <div style={{minHeight:"100vh",background:"#000",color:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",gap:16,padding:24}}>
      <div style={{fontSize:48}}>🎪</div>
      <h1 style={{fontSize:24,fontWeight:900}}>Event not found</h1>
      <p style={{opacity:.4,fontSize:15}}>This event may have been removed.</p>
      <a href="/" style={{marginTop:16,padding:"12px 28px",borderRadius:999,background:"#fff",color:"#000",textDecoration:"none",fontWeight:700,fontSize:14}}>Go Home</a>
    </div>
  );

  const bg = event.theme?.bg || "#000";
  const text = event.theme?.text || "#fff";
  const accent = event.theme?.accent || "#fff";
  const displayDate = event.startDate ? new Date(event.startDate+"T00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}) : "";
  const inp: React.CSSProperties = {width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${text}20`,background:`${text}08`,color:text,fontSize:14,fontFamily:"inherit",fontWeight:500,outline:"none"};

  return (
    <div style={{minHeight:"100vh",background:bg,color:text,fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.fade{animation:fadeIn .5s ease forwards}`}</style>
      {event.flyerURL && (
        <div style={{width:"100%",maxHeight:"60vh",overflow:"hidden",position:"relative"}}>
          <img src={event.flyerURL} alt={event.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
          <div style={{position:"absolute",inset:0,background:`linear-gradient(to bottom, transparent 50%, ${bg})`}}/>
        </div>
      )}
      <div className="fade" style={{maxWidth:640,margin:"0 auto",padding:"32px 24px 64px",position:"relative",marginTop:event.flyerURL?-80:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:24,opacity:.3}}>
          <div style={{width:16,height:16,borderRadius:"50%",background:text,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:bg}}/></div>
          <span style={{fontSize:10,fontWeight:800,letterSpacing:"0.1em"}}>GEMM</span>
        </div>
        <h1 style={{fontSize:"clamp(2rem,5vw,3rem)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.1,marginBottom:16}}>{event.title}</h1>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24,opacity:.6}}>
          {displayDate && <div style={{display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:600}}><CalIcon/> {displayDate}</div>}
          {(event.startTime||event.endTime) && <div style={{display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:600}}><ClockIcon/> {formatTime(event.startTime)}{event.endTime?` – ${formatTime(event.endTime)} CST`:` CST`}</div>}
          {(event.venueName||event.address) && <div style={{display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:600}}><MapPin/> {event.venueName}{event.address?` • ${event.address}`:""}</div>}
        </div>
        {event.shortDescription && <p style={{fontSize:16,lineHeight:1.6,marginBottom:16,opacity:.8}}>{event.shortDescription}</p>}
        {event.detailedInfo && <div style={{fontSize:14,lineHeight:1.7,opacity:.6,marginBottom:32,whiteSpace:"pre-wrap"}}>{event.detailedInfo}</div>}

        {(event.tickets ?? []).length > 0 && !registered && (
          <div style={{padding:24,borderRadius:20,border:`1px solid ${text}15`,background:`${text}05`,marginBottom:24}}>
            <div style={{fontSize:13,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",opacity:.4,marginBottom:16,display:"flex",alignItems:"center",gap:6}}><TicketIcon/> Tickets</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
              {event.tickets?.map(t => (
                <button key={t.id} onClick={()=>setSelectedTicket(t.id)} style={{padding:"14px 16px",borderRadius:12,border:selectedTicket===t.id?`2px solid ${accent}`:`1px solid ${text}15`,background:selectedTicket===t.id?`${accent}15`:`transparent`,color:text,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontSize:14,fontWeight:700}}>{t.type}</div>{t.description&&<div style={{fontSize:12,opacity:.4,marginTop:2}}>{t.description}</div>}</div>
                  <div style={{fontSize:16,fontWeight:900}}>{t.price===0?"FREE":`$${t.price}`}</div>
                </button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input value={rsvpName} onChange={e=>setRsvpName(e.target.value)} placeholder="Your name" style={inp}/>
              <input value={rsvpEmail} onChange={e=>setRsvpEmail(e.target.value)} placeholder="Your email" type="email" style={inp}/>
              <button onClick={handleRegister} disabled={registering||!rsvpName.trim()||!rsvpEmail.trim()||!selectedTicket}
                style={{padding:"14px",borderRadius:12,background:accent,color:bg,border:"none",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:registering?.6:1}}>
                {registering ? "Registering..." : "Get Tickets"}
              </button>
            </div>
            {rsvpCount>0&&<div style={{textAlign:"center",fontSize:11,opacity:.3,marginTop:12}}>{rsvpCount} registered</div>}
          </div>
        )}

        {registered && (
          <div style={{padding:32,borderRadius:20,border:`1px solid ${accent}40`,background:`${accent}10`,textAlign:"center"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:12,color:accent}}><CheckIcon/></div>
            <h3 style={{fontSize:20,fontWeight:900,marginBottom:4}}>You're in!</h3>
            <p style={{fontSize:14,opacity:.5}}>Check your email for confirmation details.</p>
          </div>
        )}

        {(!event.tickets||(event.tickets ?? []).length===0)&&(
          <div style={{padding:24,borderRadius:16,border:`1px dashed ${text}20`,textAlign:"center",opacity:.3}}><p style={{fontSize:14,fontWeight:600}}>No tickets available yet.</p></div>
        )}
        <div style={{marginTop:48,display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:.15,fontSize:10,fontWeight:700}}>
          <div style={{width:12,height:12,borderRadius:"50%",background:text,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:4,height:4,borderRadius:"50%",background:bg}}/></div>Powered by GEMM
        </div>
      </div>
    </div>
  );
}