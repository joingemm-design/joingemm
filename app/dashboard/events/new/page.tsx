"use client";

// app/dashboard/events/new/page.tsx — Create New Event
// Two-panel layout: Left editor + Right phone preview (matches Wavey)

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useIsMobile";
import { createEvent, updateEvent, uploadEventImage, getEvent, deleteEvent, Ticket } from "@/lib/events";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}input:focus,textarea:focus{outline:none;border-color:#7c3aed!important}input::placeholder,textarea::placeholder{color:#aaa}`;

const ArrowLeft=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const Plus=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>);
const Trash=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>);
const ChevDown=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>);
const ChevUp=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>);
const ImgIcon=()=>(<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>);
const CalIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>);
const MapPin=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>);
const TicketIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>);

export default function CreateEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [editId, setEditId] = useState<string|null>(null);
  const [eventId, setEventId] = useState<string|null>(null);

  // Event fields
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [detailedInfo, setDetailedInfo] = useState("");
  const [flyerURL, setFlyerURL] = useState("");
  const [flyerFile, setFlyerFile] = useState<File|null>(null);
  const [flyerPreview, setFlyerPreview] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [extLinks, setExtLinks] = useState<Record<string,string>>({});
  const [theme, setTheme] = useState({ bg:"#000000", text:"#ffffff", accent:"#ffffff" });

  // UI states
  const [showFlyer, setShowFlyer] = useState(true);
  const [showTickets, setShowTickets] = useState(true);
  const [showTheme, setShowTheme] = useState(false);
  const [showExtLinks, setShowExtLinks] = useState(false);
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [tType, setTType] = useState("");
  const [tPrice, setTPrice] = useState("");
  const [tDesc, setTDesc] = useState("");
  const [tLimit, setTLimit] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  useEffect(() => { const params = new URLSearchParams(window.location.search); const id = params.get("edit"); if (id) { setEditId(id); setEventId(id); getEvent(id).then(e => { if (!e) return; setTitle(e.title||""); setStartDate(e.startDate||""); setStartTime(e.startTime||""); setEndDate(e.endDate||""); setEndTime(e.endTime||""); setVenueName(e.venueName||""); setAddress(e.address||""); setShortDesc(e.shortDescription||""); setDetailedInfo(e.detailedInfo||""); setFlyerURL(e.flyerURL||""); setTickets(e.tickets||[]); setExtLinks(e.externalLinks||{}); if(e.theme) setTheme(e.theme); }); } }, []);

  function handleFlyerSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFlyerFile(file);
    const reader = new FileReader();
    reader.onload = () => setFlyerPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function addTicket() {
    if (!tType.trim()) return;
    const ticket: Ticket = {
      id: `t_${Date.now()}`,
      type: tType.trim(),
      price: parseFloat(tPrice) || 0,
      description: tDesc.trim(),
      limit: tLimit ? parseInt(tLimit) : undefined,
      soldout: false,
    };
    setTickets(prev => [...prev, ticket]);
    setTType(""); setTPrice(""); setTDesc(""); setTLimit(""); setShowAddTicket(false);
  }

  function removeTicket(id: string) { setTickets(prev => prev.filter(t => t.id !== id)); }

  async function handleSave(publish: boolean) {
    if (!user || !title.trim()) return;
    setSaving(true);

    try {
        let eid = editId;
        let finalFlyerURL = flyerURL;

        // Common data for both create and update
        const eventData = {
            title: title.trim(),
            startDate, startTime, endDate, endTime,
            venueName: venueName.trim(), address: address.trim(),
            shortDescription: shortDesc.trim(),
            detailedInfo: detailedInfo.trim(),
            tickets,
            externalLinks: extLinks,
            theme,
            published: publish,
        };

        if (eid) { // Logic for updating an existing event
            if (flyerFile) {
                // If a new flyer is provided, upload it first to get the URL
                finalFlyerURL = await uploadEventImage(user.uid, eid, flyerFile, "flyer");
            }
            // Perform a single update with all the latest data
            await updateEvent(eid, { ...eventData, flyerURL: finalFlyerURL });

        } else { // Logic for creating a new event
            // Create the event first to get an eventId for the flyer path.
            // If a flyer is being uploaded, we'll use an empty string for now.
            const newEventData = { ...eventData, flyerURL: flyerFile ? '' : flyerURL };
            eid = await createEvent(user.uid, newEventData);
            setEventId(eid);
            setEditId(eid);

            if (flyerFile) {
                // After creating the event, upload the flyer
                finalFlyerURL = await uploadEventImage(user.uid, eid, flyerFile, "flyer");
                // And then update the event with the flyer's URL
                await updateEvent(eid, { flyerURL: finalFlyerURL });
            }
        }

        setSaved(true);
        setTimeout(() => router.push("/dashboard/events"), 1000);
    } catch (error) {
        console.error("Failed to save event:", error);
        // You could also show an error message to the user here
    } finally {
        setSaving(false);
    }
}

  async function handleDelete() {
    if (!editId) { alert("No event to delete"); return; }
    try {
      await deleteEvent(editId);
      alert("Event deleted!");
      router.push("/dashboard/events");
    } catch(err: any) {
      alert("Delete failed: " + err.message);
    }
  }
  }

  const inp: React.CSSProperties = { width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #e0e0e0", fontSize:14, fontFamily:"inherit", fontWeight:500, color:"#000", background:"#fff" };
  const label: React.CSSProperties = { fontSize:10, fontWeight:800, textTransform:"uppercase" as const, letterSpacing:"0.12em", color:"#888", marginBottom:6, display:"block" };
  const section: React.CSSProperties = { padding:20, borderRadius:16, border:"1px solid #eee", background:"#fff", marginBottom:16 };
  const collapseBtn = (open: boolean, toggle: ()=>void, title: string, icon: string) => (
    <button onClick={toggle} style={{ ...section, width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", marginBottom:16, fontFamily:"inherit", color:"#000", textAlign:"left" } as any}>
      <span style={{ fontSize:15, fontWeight:900, display:"flex", alignItems:"center", gap:8 }}>{icon} {title}</span>
      {open ? <ChevUp/> : <ChevDown/>}
    </button>
  );

  if (loading) return (<div style={{minHeight:"100vh",background:"#f8f8f8",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style><div style={{width:24,height:24,borderRadius:"50%",background:"#000",animation:"pulse 1.5s ease infinite"}}/></div>);

  const displayFlyer = flyerPreview || flyerURL;
  const displayDate = startDate ? new Date(startDate + "T00:00").toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "";

  return (
    <div style={{ minHeight:"100vh", background:"#f4f4f5", fontFamily:"'DM Sans',sans-serif", color:"#000" }}>
      <style>{css}</style>

      {/* TOP BAR */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"#fff", borderBottom:"1px solid #eee", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={()=>router.push("/dashboard/events")} style={{ display:"flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:10, border:"1px solid #eee", background:"#fff", cursor:"pointer", color:"#000" }}><ArrowLeft/></button>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:14, color:"#888", fontWeight:600 }}>← View Portal</span>
            <span style={{ fontSize:14, color:"#000", fontWeight:900 }}>| Create New Event</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {saved && <span style={{ fontSize:12, fontWeight:700, color:"#22c55e" }}>✓ Saved!</span>}
          {editId && <button onClick={handleDelete} style={{ padding:"10px 16px", borderRadius:999, background:"transparent", color:"#ef4444", border:"1px solid #ef4444", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Delete</button>}
          <button onClick={()=>handleSave(false)} disabled={saving||!title.trim()} style={{ padding:"10px 20px", borderRadius:999, background:"#fff", color:"#000", border:"1px solid #ddd", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Save Draft</button>
          <button onClick={()=>handleSave(true)} disabled={saving||!title.trim()} style={{ padding:"10px 20px", borderRadius:999, background:"#000", color:"#fff", border:"none", fontSize:13, fontWeight:800, cursor:"pointer", fontFamily:"inherit", opacity:saving?.6:1 }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 380px", gap:0, maxWidth:1400, margin:"0 auto", minHeight:"calc(100vh - 61px)" }}>

        {/* ════ LEFT: EDITOR ════ */}
        <div style={{ padding:"24px 32px 120px", overflowY:"auto", maxHeight:"calc(100vh - 61px)" }}>

          {/* Basic info */}
          <div style={section}>
            <div style={{ marginBottom:16 }}>
              <span style={label}>Event Title</span>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Summer Rooftop Party" style={{...inp, fontSize:16, fontWeight:700}}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
              <div>
                <span style={label}>Start Date & Time</span>
                <div style={{ display:"flex", gap:8 }}>
                  <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{...inp, flex:1}}/>
                  <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} style={{...inp, width:120}}/>
                </div>
              </div>
              <div>
                <span style={label}>End Date & Time</span>
                <div style={{ display:"flex", gap:8 }}>
                  <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{...inp, flex:1}}/>
                  <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} style={{...inp, width:120}}/>
                </div>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div><span style={label}>Venue Name</span><input value={venueName} onChange={e=>setVenueName(e.target.value)} placeholder="e.g. The Promontory" style={inp}/></div>
              <div><span style={label}>Address</span><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Full street address" style={inp}/></div>
            </div>
          </div>

          {/* Flyer & Description */}
          {collapseBtn(showFlyer, ()=>setShowFlyer(!showFlyer), "Flyer & Description", "🖼️")}
          {showFlyer && (
            <div style={{...section, marginTop:-8}}>
              <div style={{ display:"grid", gridTemplateColumns:"140px 1fr", gap:16, marginBottom:16 }}>
                {/* Flyer upload */}
                <div>
                  <span style={label}>Main Flyer</span>
                  <label style={{ width:140, height:180, borderRadius:12, border:"2px dashed #ddd", background:"#fafafa", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden" }}>
                    {displayFlyer ? (
                      <img src={displayFlyer} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    ) : (
                      <><ImgIcon/><span style={{ fontSize:10, fontWeight:700, color:"#aaa", marginTop:4 }}>Upload Flyer</span></>
                    )}
                    <input type="file" accept="image/*" onChange={handleFlyerSelect} style={{ display:"none" }}/>
                  </label>
                </div>

                {/* Description */}
                <div>
                  <span style={label}>Short Description</span>
                  <textarea value={shortDesc} onChange={e=>setShortDesc(e.target.value)} placeholder="A punchy one-liner for social media previews." rows={3} style={{...inp, resize:"vertical", marginBottom:12}}/>
                  <span style={label}>Detailed Info</span>
                  <textarea value={detailedInfo} onChange={e=>setDetailedInfo(e.target.value)} placeholder="Full event description, schedule, what to expect..." rows={4} style={{...inp, resize:"vertical"}}/>
                </div>
              </div>
            </div>
          )}

          {/* Tickets */}
          {collapseBtn(showTickets, ()=>setShowTickets(!showTickets), "Tickets", "🎟️")}
          {showTickets && (
            <div style={{...section, marginTop:-8}}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:13, fontWeight:700 }}>Ticket Types</span>
                <button onClick={()=>setShowAddTicket(true)} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 14px", borderRadius:999, background:"#000", color:"#fff", border:"none", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}><Plus/> Add</button>
              </div>

              {showAddTicket && (
                <div style={{ padding:14, borderRadius:10, border:"1px solid #e5e5e5", background:"#fafafa", marginBottom:12 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 100px", gap:8, marginBottom:8 }}>
                    <input value={tType} onChange={e=>setTType(e.target.value)} placeholder="Ticket name (e.g. General Admission)" style={inp}/>
                    <input value={tPrice} onChange={e=>setTPrice(e.target.value)} placeholder="Price" type="number" min="0" style={inp}/>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 80px", gap:8, marginBottom:8 }}>
                    <input value={tDesc} onChange={e=>setTDesc(e.target.value)} placeholder="Description (optional)" style={inp}/>
                    <input value={tLimit} onChange={e=>setTLimit(e.target.value)} placeholder="Limit" type="number" min="1" style={inp}/>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={addTicket} disabled={!tType.trim()} style={{ padding:"8px 16px", borderRadius:8, background:"#000", color:"#fff", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Add Ticket</button>
                    <button onClick={()=>setShowAddTicket(false)} style={{ padding:"8px 16px", borderRadius:8, background:"#fff", color:"#666", border:"1px solid #ddd", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
                  </div>
                </div>
              )}

              {tickets.length === 0 ? (
                <div style={{ textAlign:"center", padding:20, opacity:.4, fontSize:13, border:"1px dashed #ddd", borderRadius:10 }}>No tickets yet. Add one to start selling.</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {tickets.map(t => (
                    <div key={t.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:12, borderRadius:10, border:"1px solid #e5e5e5", background:"#fff" }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700 }}>{t.type}</div>
                        <div style={{ fontSize:11, opacity:.5 }}>
                          {t.price === 0 ? "FREE" : `$${t.price.toFixed(2)}`}
                          {t.limit ? ` • Limit: ${t.limit}` : ""}
                          {t.description ? ` • ${t.description}` : ""}
                        </div>
                      </div>
                      <button onClick={()=>removeTicket(t.id)} style={{ padding:6, background:"none", border:"none", cursor:"pointer", color:"#ccc" }}
                        onMouseEnter={e=>e.currentTarget.style.color="#ef4444"} onMouseLeave={e=>e.currentTarget.style.color="#ccc"}><Trash/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Theme & Colors */}
          {collapseBtn(showTheme, ()=>setShowTheme(!showTheme), "Theme & Colors", "✨")}
          {showTheme && (
            <div style={{...section, marginTop:-8}}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                {[{k:"bg",l:"Background"},{k:"text",l:"Text"},{k:"accent",l:"Accent"}].map(c=>(
                  <div key={c.k}>
                    <span style={label}>{c.l}</span>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <input type="color" value={(theme as any)[c.k]} onChange={e=>setTheme(prev=>({...prev,[c.k]:e.target.value}))} style={{ width:36, height:36, borderRadius:8, border:"1px solid #ddd", cursor:"pointer" }}/>
                      <span style={{ fontSize:11, fontFamily:"monospace", opacity:.5 }}>{(theme as any)[c.k]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          {collapseBtn(showExtLinks, ()=>setShowExtLinks(!showExtLinks), "External Links (Optional)", "🔗")}
          {showExtLinks && (
            <div style={{...section, marginTop:-8}}>
              {[{k:"eventbrite",l:"Eventbrite URL"},{k:"posh",l:"Posh URL"},{k:"website",l:"Website URL"}].map(l=>(
                <div key={l.k} style={{ marginBottom:12 }}>
                  <span style={label}>{l.l}</span>
                  <input value={extLinks[l.k]||""} onChange={e=>setExtLinks(prev=>({...prev,[l.k]:e.target.value}))} placeholder={`https://...`} style={inp}/>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ════ RIGHT: LIVE PHONE PREVIEW ════ */}
        {!isMobile && (
          <div style={{ background:"#e8e8ec", display:"flex", flexDirection:"column", alignItems:"center", paddingTop:24, position:"sticky", top:61, height:"calc(100vh - 61px)", overflow:"hidden" }}>
            <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.15em", opacity:.4, marginBottom:12 }}>Live Preview</div>
            <div style={{
              width:280, minHeight:500, borderRadius:36, border:"8px solid #1a1a1a",
              background:theme.bg, overflow:"hidden", boxShadow:"0 25px 60px rgba(0,0,0,0.3)",
              display:"flex", flexDirection:"column", position:"relative", fontFamily:"'DM Sans',sans-serif",
            }}>
              {/* Notch */}
              <div style={{ position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", width:64, height:18, background:"#1a1a1a", borderRadius:99, zIndex:10 }}/>

              {/* Brand bar */}
              <div style={{ padding:"36px 16px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:9, fontWeight:900, letterSpacing:"0.1em", color:theme.text, opacity:.4 }}>GEMM</span>
              </div>

              {/* Flyer */}
              <div style={{ margin:"0 12px", borderRadius:12, overflow:"hidden", aspectRatio:"4/3", background:"#111", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {displayFlyer ? (
                  <img src={displayFlyer} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                ) : (
                  <div style={{ textAlign:"center", opacity:.3, color:theme.text }}><ImgIcon/><div style={{ fontSize:9, marginTop:4 }}>No Flyer</div></div>
                )}
              </div>

              {/* Event info */}
              <div style={{ padding:"16px 16px 8px", color:theme.text }}>
                <div style={{ fontSize:16, fontWeight:900, lineHeight:1.2, marginBottom:6 }}>{title || "Event Title"}</div>
                <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, opacity:.6, marginBottom:2 }}>
                  {displayDate && <><CalIcon/> {displayDate}</>}
                  {venueName && <><span style={{margin:"0 4px"}}>•</span><MapPin/> {venueName}</>}\
                </div>
                {shortDesc && <div style={{ fontSize:11, opacity:.5, marginTop:6, lineHeight:1.4 }}>{shortDesc}</div>}
              </div>

              {/* Tickets preview */}
              {tickets.length > 0 && (
                <div style={{ padding:"8px 16px 16px" }}>
                  <div style={{ fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", opacity:.3, color:theme.text, marginBottom:6 }}>Tickets</div>
                  {tickets.map(t => (
                    <div key={t.id} style={{
                      padding:"8px 12px", borderRadius:8, border:`1px solid ${theme.text}20`,
                      background:`${theme.text}08`, marginBottom:4,
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      fontSize:11, color:theme.text,
                    }}>
                      <span style={{ fontWeight:700 }}>{t.type}</span>
                      <span style={{ fontWeight:800 }}>{t.price===0?"FREE":`$${t.price}`}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA button */}
              <div style={{ padding:"4px 16px 20px" }}>
                <div style={{
                  padding:"10px", borderRadius:10, background:theme.accent,
                  color:theme.bg, fontSize:12, fontWeight:800, textAlign:"center",
                  border:`1px dashed ${theme.text}30`,
                }}>
                  {tickets.length > 0 ? "Get Tickets" : "Add tickets to see preview"}
                </div>
              </div>
            </div>
            <div style={{ fontSize:9, opacity:.3, marginTop:8, textAlign:"center" }}>This is an approximation. Actual appearance may vary slightly by device.</div>
          </div>
        )}
      </div>
    </div>
  );
}
