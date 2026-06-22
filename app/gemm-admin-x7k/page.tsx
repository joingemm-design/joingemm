"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { firestore as db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc, query, orderBy } from "firebase/firestore";

const ADMIN_UID = "3eWTfkVvdRcUTAiHPawy0WSHm1O2";

type Tab = "overview" | "users" | "events" | "orders" | "shops" | "quotes" | "inquiries";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [shops, setShops] = useState<any[]>([]);
  const [shopOrders, setShopOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [banned, setBanned] = useState<string[]>([]);
  const [suspended, setSuspended] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.uid !== ADMIN_UID) {
      router.replace("/");
      return;
    }
    setReady(true);
    fetchAll();
  }, [user, loading]);

  async function fetchAll() {
    try {
      const [uSnap, eSnap, oSnap, sSnap, soSnap, qSnap, iSnap] = await Promise.all([
        getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "events"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "shops"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "shop_orders"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "quote_requests"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "inquiries"), orderBy("createdAt", "desc"))),
        getDocs(collection(db, "banned")),
        getDocs(collection(db, "suspended")),
      ]);
      setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setEvents(eSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setOrders(oSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setShops(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setShopOrders(soSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setQuotes(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setInquiries(iSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user?")) return;
    await deleteDoc(doc(db, "users", id));
    setUsers(u => u.filter(x => x.id !== id));
  }

  async function banUser(uid: string, email: string) {
    if (!confirm("Ban this user? They cannot re-register with this email.")) return;
    await setDoc(doc(db, "banned", uid), { email, bannedAt: new Date().toISOString() });
    setBanned(prev => [...prev, uid]);
  }

  async function suspendUser(uid: string) {
    await setDoc(doc(db, "suspended", uid), { suspendedAt: new Date().toISOString() });
    setSuspended(prev => [...prev, uid]);
    await updateDoc(doc(db, "users", uid), { suspended: true });
    setUsers(u => u.map(x => x.id === uid ? { ...x, suspended: true } : x));
  }

  async function unsuspendUser(uid: string) {
    await deleteDoc(doc(db, "suspended", uid));
    setSuspended(prev => prev.filter(id => id !== uid));
    await updateDoc(doc(db, "users", uid), { suspended: false });
    setUsers(u => u.map(x => x.id === uid ? { ...x, suspended: false } : x));
  }

  async function deleteEvent(id: string) {
    if (!confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", id));
    setEvents(e => e.filter(x => x.id !== id));
  }

  async function updateUserPlan(id: string, plan: string) {
    await updateDoc(doc(db, "users", id), { plan });
    setUsers(u => u.map(x => x.id === id ? { ...x, plan } : x));
  }

  if (loading || !ready) return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ opacity: 0.4 }}>Loading...</div>
    </div>
  );

  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const shopRevenue = shopOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalGMV = totalRevenue + shopRevenue;
  const platformRevenue = Math.round(totalGMV * 0.05);
  const activeCreators = users.filter(u => u.username).length;
  const paidCreators = users.filter(u => u.plan && u.plan !== "spark").length;
  const newUsersThisWeek = users.filter(u => { const d = u.createdAt?.toDate?.(); return d && (Date.now() - d.getTime()) < 7*24*60*60*1000; }).length;
  const filteredUsers = users.filter(u => (u.displayName || u.email || "").toLowerCase().includes(search.toLowerCase()));
  const filteredEvents = events.filter(e => (e.title || "").toLowerCase().includes(search.toLowerCase()));

  const tabStyle = (t: Tab) => ({
    padding: "8px 20px", borderRadius: 100, border: "none", cursor: "pointer",
    fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans',sans-serif",
    background: tab === t ? "#fff" : "transparent",
    color: tab === t ? "#000" : "rgba(255,255,255,0.4)",
    transition: "all 0.2s",
  });

  const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 };
  const badge = (color: string) => ({ background: color, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 100 });

  return (
    <div style={{ minHeight: "100vh", background: "#030303", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}table{border-collapse:collapse;width:100%}th{text-align:left;font-size:11px;font-weight:700;letter-spacing:0.1em;opacity:0.3;padding:8px 12px;text-transform:uppercase}td{padding:12px;border-top:1px solid rgba(255,255,255,0.05);font-size:14px}tr:hover td{background:rgba(255,255,255,0.02)}`}</style>

      {/* Header */}
      <header style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "-0.02em" }}>GEMM Admin</div>
            <div style={{ fontSize: 11, opacity: 0.3 }}>Super Admin Panel</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={fetchAll} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>↻ Refresh</button>
          <a href="/dashboard" style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>← Dashboard</a>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Users", value: users.length, icon: "👥", color: "#6366f1" },
            { label: "Total Events", value: events.length, icon: "🎟️", color: "#8b5cf6" },
            { label: "Total Orders", value: orders.length, icon: "📦", color: "#06b6d4" },
            { label: "Revenue", value: "$" + (totalRevenue / 100).toFixed(2), icon: "💰", color: "#22c55e" },
          ].map(s => (
            <div key={s.label} style={{ ...card, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em" }}>{s.value}</div>
                <div style={{ fontSize: 12, opacity: 0.4, fontWeight: 600 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.04)", borderRadius: 100, padding: 4, marginBottom: 24, width: "fit-content" }}>
          {(["overview","users","events","orders","inquiries","shops","quotes"] as Tab[]).map(t => (
            <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {/* Search */}
        {tab !== "overview" && (
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ width: "100%", maxWidth: 400, padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: 14, fontFamily: "inherit", marginBottom: 20 }} />
        )}

        {/* Overview */}
        {tab === "overview" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:24}}>
              {[
                {label:"Total GMV", value:"$"+((totalGMV||0)/100).toFixed(0)},
                {label:"Platform Rev", value:"$"+((platformRevenue||0)/100).toFixed(0)},
                {label:"Creators", value:activeCreators+" ("+paidCreators+" paid)"},
                {label:"New This Week", value:newUsersThisWeek},
                {label:"Events", value:events.length+" ("+events.filter(e=>e.active).length+" live)"},
                {label:"Ticket Orders", value:orders.length},
                {label:"Shop Orders", value:shopOrders.length},
                {label:"Quote Requests", value:quotes.length+" ("+quotes.filter(q=>q.status==="new").length+" new)"},
              ].map(m=>(
                <div key={m.label} style={{padding:16,borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
                  <div style={{fontSize:10,opacity:.4,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{m.label}</div>
                  <div style={{fontSize:22,fontWeight:900}}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{padding:20,borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:900,marginBottom:12}}>Recent Orders</div>
              {[...orders.map(o=>({...o,_type:"ticket"})),...shopOrders.map(o=>({...o,_type:"shop"}))]
                .sort((a,b)=>(b.createdAt?.toDate?.()?.getTime()||0)-(a.createdAt?.toDate?.()?.getTime()||0))
                .slice(0,8).map(o=>(
                <div key={o.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <span style={{opacity:.6,fontSize:13}}>{o.customerEmail||"—"}</span>
                  <span style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:o._type==="ticket"?"rgba(99,102,241,0.2)":"rgba(34,197,94,0.15)",color:o._type==="ticket"?"#818cf8":"#22c55e",fontWeight:700}}>{o._type==="ticket"?"Ticket":"Shop"}</span>
                  <span style={{fontWeight:700,color:"#22c55e"}}>{o.amount?"$"+((o.amount||0)/100).toFixed(2):"Free"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Users */}
        {tab === "users" && (
          <div style={card}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Username</th>
                  <th>Plan</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(99,102,241,0.2)", overflow: "hidden", flexShrink: 0 }}>
                          {u.photoURL ? <img src={u.photoURL} style={{ width: "100%", height: "100%" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>👤</div>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{u.displayName || "No name"}</div>
                          <div style={{ fontSize: 12, opacity: 0.4 }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ opacity: 0.6 }}>{u.username ? "@" + u.username : "—"} {u.suspended && <span style={{padding:"1px 6px",borderRadius:4,background:"rgba(234,179,8,0.2)",color:"#fbbf24",fontSize:10,fontWeight:700,marginLeft:4}}>SUSPENDED</span>}</td>
                    <td>
                      <select value={u.plan || "spark"} onChange={e => updateUserPlan(u.id, e.target.value)}
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "4px 8px", borderRadius: 6, fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}>
                        <option value="spark">Spark</option>
                        <option value="velocity">Velocity</option>
                        <option value="empire">Empire</option>
                      </select>
                    </td>
                    <td style={{ opacity: 0.4, fontSize: 13 }}>{u.createdAt?.toDate?.()?.toLocaleDateString() || "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a href={"/"+u.username} target="_blank" style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(99,102,241,0.2)", color: "#818cf8", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>View</a>
                        <button onClick={() => u.suspended ? unsuspendUser(u.id) : suspendUser(u.id)} style={{ padding: "4px 12px", borderRadius: 6, background: u.suspended ? "rgba(234,179,8,0.15)" : "rgba(234,179,8,0.15)", color: "#fbbf24", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>{u.suspended ? "Unsuspend" : "Suspend"}</button>
                        <button onClick={() => banUser(u.id, u.email)} style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Ban</button>
                        <button onClick={() => deleteUser(u.id)} style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <div style={{ textAlign: "center", padding: 40, opacity: 0.3 }}>No users found</div>}
          </div>
        )}

        {/* Events */}
        {tab === "events" && (
          <div style={card}>
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(e => (
                  <tr key={e.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(139,92,246,0.2)", overflow: "hidden", flexShrink: 0 }}>
                          {e.flyerUrl ? <img src={e.flyerUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 16 }}>🎟️</div>}
                        </div>
                        <div style={{ fontWeight: 700 }}>{e.title || "Untitled"}</div>
                      </div>
                    </td>
                    <td style={{ opacity: 0.6 }}>{e.venue || "—"}</td>
                    <td style={{ opacity: 0.4, fontSize: 13 }}>{e.date || "—"}</td>
                    <td><span style={badge(e.active ? "#22c55e" : "#444")}>{e.active ? "live" : "draft"}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a href={"/event/"+e.id} target="_blank" style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(99,102,241,0.2)", color: "#818cf8", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>View</a>
                        <button onClick={() => deleteEvent(e.id)} style={{ padding: "4px 12px", borderRadius: 6, background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEvents.length === 0 && <div style={{ textAlign: "center", padding: 40, opacity: 0.3 }}>No events found</div>}
          </div>
        )}

        {/* Shops */}
        {tab === "shops" && (
          <div>
            <div style={{padding:20,borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:900,marginBottom:12}}>Shops ({shops.length})</div>
              {shops.map(s=>(
                <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div>
                    <div style={{fontWeight:700}}>{s.title||"Untitled"}</div>
                    <div style={{fontSize:11,opacity:.4}}>{users.find(u=>u.id===s.uid)?.displayName||s.uid?.slice(0,8)} · {(s.products||[]).length} products</div>
                  </div>
                  <span style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700,background:s.isPublic?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.06)",color:s.isPublic?"#22c55e":"#888"}}>{s.isPublic?"Live":"Draft"}</span>
                </div>
              ))}
              {shops.length===0&&<div style={{opacity:.3,textAlign:"center",padding:24}}>No shops yet</div>}
            </div>
            <div style={{padding:20,borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{fontSize:13,fontWeight:900,marginBottom:12}}>Shop Orders ({shopOrders.length})</div>
              {shopOrders.map(o=>(
                <div key={o.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <span style={{opacity:.6,fontSize:13}}>{o.customerEmail||"—"}</span>
                  <span style={{fontWeight:700,color:"#22c55e"}}>{o.amount?"$"+((o.amount||0)/100).toFixed(2):"—"}</span>
                  <span style={{opacity:.4,fontSize:12}}>{o.createdAt?.toDate?.()?.toLocaleDateString()||"—"}</span>
                </div>
              ))}
              {shopOrders.length===0&&<div style={{opacity:.3,textAlign:"center",padding:24}}>No shop orders yet</div>}
            </div>
          </div>
        )}

        {/* Quotes */}
        {tab === "quotes" && (
          <div style={{padding:20,borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{fontSize:13,fontWeight:900,marginBottom:12}}>Quote Requests ({quotes.length})</div>
            {quotes.map(q=>(
              <div key={q.id} style={{padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontWeight:700}}>{q.name||"—"} <span style={{opacity:.4,fontWeight:400,fontSize:12}}>{q.email}</span></span>
                  <span style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700,background:q.status==="new"?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.06)",color:q.status==="new"?"#22c55e":"#888"}}>{q.status||"new"}</span>
                </div>
                <div style={{fontSize:12,opacity:.5}}>{q.serviceTitle||"—"} · {users.find(u=>u.id===q.creatorUid)?.displayName||"Unknown creator"}</div>
                {q.message&&<div style={{fontSize:12,opacity:.4,marginTop:4,fontStyle:"italic"}}>{q.message.slice(0,120)}</div>}
              </div>
            ))}
            {quotes.length===0&&<div style={{opacity:.3,textAlign:"center",padding:24}}>No quote requests yet</div>}
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div style={card}>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Event</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontSize: 12, opacity: 0.4, fontFamily: "monospace" }}>{o.id.slice(0, 8)}...</td>
                    <td style={{ fontWeight: 600 }}>{o.eventTitle || "—"}</td>
                    <td style={{ opacity: 0.6 }}>{o.customerEmail || o.customerName || "—"}</td>
                    <td style={{ fontWeight: 700, color: "#22c55e" }}>{o.amount ? "$" + (o.amount / 100).toFixed(2) : "Free"}</td>
                    <td><span style={badge(o.checkedIn ? "#22c55e" : "#6366f1")}>{o.checkedIn ? "checked in" : "confirmed"}</span></td>
                    <td style={{ opacity: 0.4, fontSize: 13 }}>{o.createdAt?.toDate?.()?.toLocaleDateString() || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div style={{ textAlign: "center", padding: 40, opacity: 0.3 }}>No orders yet</div>}
          </div>
        )}

        {/* Inquiries */}
        {tab === "inquiries" && (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontWeight:900,fontSize:18}}>Inquiries ({inquiries.length})</div>
              <div style={{fontSize:13,opacity:.4}}>{inquiries.filter(i=>!i.read).length} unread</div>
            </div>
            {inquiries.length===0&&<div style={{textAlign:"center",padding:60,opacity:.3}}>No inquiries yet</div>}
            {inquiries.map(inq=>(
              <div key={inq.id} style={{padding:20,borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid "+(inq.read?"rgba(255,255,255,0.06)":"rgba(99,102,241,0.4)"),position:"relative"}}>
                {!inq.read&&<div style={{position:"absolute",top:16,right:16,width:8,height:8,borderRadius:"50%",background:"#6366f1"}}/>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontWeight:900,fontSize:16}}>{inq.firstName&&inq.lastName?inq.firstName+" "+inq.lastName:inq.name||"—"}</div>
                    <a href={"mailto:"+inq.email} style={{fontSize:13,color:"#818cf8",textDecoration:"none"}}>{inq.email}</a>
                    {inq.phone&&<span style={{fontSize:13,opacity:.5,marginLeft:12}}>📞 {inq.phone}</span>}
                  </div>
                  <div style={{fontSize:12,opacity:.4}}>{inq.createdAt?.toDate?.()?.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric",hour:"2-digit",minute:"2-digit"})||"—"}</div>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
                  {inq.serviceType&&<span style={{padding:"4px 12px",borderRadius:9999,background:"rgba(99,102,241,0.2)",color:"#818cf8",fontSize:12,fontWeight:700}}>{inq.serviceType}</span>}
                  {inq.deadline&&<span style={{padding:"4px 12px",borderRadius:9999,background:"rgba(255,255,255,0.06)",fontSize:12,fontWeight:600,opacity:.7}}>📅 {inq.deadline}</span>}
                  {inq.budget&&<span style={{padding:"4px 12px",borderRadius:9999,background:"rgba(34,197,94,0.15)",color:"#22c55e",fontSize:12,fontWeight:700}}>💰 {inq.budget}</span>}
                  {inq.referral&&<span style={{padding:"4px 12px",borderRadius:9999,background:"rgba(255,255,255,0.04)",fontSize:12,opacity:.5}}>via {inq.referral}</span>}
                </div>
                {inq.message&&<div style={{fontSize:14,lineHeight:1.7,opacity:.7,marginBottom:inq.extra?12:0,padding:16,background:"rgba(255,255,255,0.03)",borderRadius:8}}>{inq.message}</div>}
                {inq.extra&&<div style={{fontSize:13,lineHeight:1.6,opacity:.5,marginTop:8,padding:"12px 16px",background:"rgba(255,255,255,0.02)",borderRadius:8,fontStyle:"italic"}}>{inq.extra}</div>}
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <a href={"mailto:"+inq.email+"?subject=Re: Your inquiry&body=Hi "+(inq.firstName||inq.name)+","} style={{padding:"8px 16px",borderRadius:8,background:"rgba(99,102,241,0.2)",color:"#818cf8",fontSize:12,fontWeight:700,textDecoration:"none"}}>Reply →</a>
                  <span style={{padding:"8px 16px",borderRadius:8,background:"rgba(255,255,255,0.04)",fontSize:12,opacity:.4}}>Creator: {users.find(u=>u.id===inq.creatorId)?.displayName||inq.creatorId?.slice(0,8)||"—"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}