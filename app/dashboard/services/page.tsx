"use client";
import { usePlan } from "@/hooks/usePlan";
import UpgradeGate from "@/components/UpgradeGate";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useIsMobile";
import { createService, getUserServices, deleteService, updateService, getCreatorQuotes, Service, QuoteRequest } from "@/lib/services";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

const CATEGORIES = ["Custom Art","Sneaker Art","Sports Art","Mural","Speaking","Music","Photography","Consulting","Other"];

export default function ServicesPage() {
  const { user, loading } = useAuth();
  const { canUseServices, planLoading } = usePlan();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<"services"|"quotes">("services");
  const [services, setServices] = useState<Service[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [priceLabel, setPriceLabel] = useState("Request Quote");
  const [saving, setSaving] = useState(false);
  const [editingService, setEditingService] = useState<Service|null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  if (!planLoading && !canUseServices) return <UpgradeGate feature="Services & Quote Requests" requiredPlan="velocity" description="List your services, receive quote requests, and manage client inquiries." />;
  useEffect(() => {
    if (!user) return;
    Promise.all([getUserServices(user.uid), getCreatorQuotes(user.uid)]).then(([s, q]) => {
      setServices(s); setQuotes(q); setFetching(false);
    });
  }, [user]);

  async function handleAdd() {
    if (!user || !title.trim()) return;
    setSaving(true);
    const id = await createService(user.uid, { title: title.trim(), description: description.trim(), category, priceLabel: priceLabel.trim() || "Request Quote", active: true, order: services.length });
    setServices(prev => [...prev, { id, uid: user.uid, title: title.trim(), description: description.trim(), category, priceLabel: priceLabel.trim() || "Request Quote", active: true, order: prev.length, createdAt: new Date() }]);
    setTitle(""); setDescription(""); setCategory("Other"); setPriceLabel("Request Quote"); setShowAdd(false);
    setSaving(false);
  }

  function startEdit(service: Service) {
    setEditingService(service);
    setEditTitle(service.title);
    setEditDesc(service.description);
    setEditCategory(service.category);
    setEditPrice(service.priceLabel);
  }

  async function handleEditSave() {
    if (!editingService) return;
    setEditSaving(true);
    await updateService(editingService.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      category: editCategory,
      priceLabel: editPrice.trim() || "Request Quote",
    });
    setServices(prev => prev.map(s => s.id === editingService.id ? { ...s, title: editTitle.trim(), description: editDesc.trim(), category: editCategory, priceLabel: editPrice.trim() || "Request Quote" } : s));
    setEditSaving(false);
    setEditingService(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    await deleteService(id);
    setServices(prev => prev.filter(s => s.id !== id));
  }

  async function toggleActive(service: Service) {
    await updateService(service.id, { active: !service.active });
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, active: !s.active } : s));
  }

  const inp: React.CSSProperties = {width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #e0e0e0",fontSize:14,fontFamily:"inherit",fontWeight:500,color:"#000",background:"#fff"};
  const lbl: React.CSSProperties = {fontSize:10,fontWeight:800,textTransform:"uppercase" as const,letterSpacing:"0.12em",color:"#888",marginBottom:6,display:"block"};

  return (
    <div style={{minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000"}}>
      <style>{css}</style>
      <div style={{maxWidth:800,margin:"0 auto",padding:isMobile?"16px 12px 80px":"32px 24px 64px"}}>
        <button onClick={()=>router.push("/dashboard")} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em"}}><ArrowLeft/> Back</button>
        
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div>
            <h1 style={{fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4}}>Services</h1>
            <p style={{fontSize:15,opacity:.5,fontWeight:500}}>Offer services and receive quote requests.</p>
          </div>
          {tab==="services" && <button onClick={()=>setShowAdd(true)} style={{padding:"12px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>+ Add Service</button>}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,background:"#f0f0f0",borderRadius:12,padding:4,marginBottom:24}}>
          <button onClick={()=>setTab("services")} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:tab==="services"?"#000":"transparent",color:tab==="services"?"#fff":"#666",fontWeight:700,fontSize:13,textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit"}}>Services ({services.length})</button>
          <button onClick={()=>setTab("quotes")} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:tab==="quotes"?"#000":"transparent",color:tab==="quotes"?"#fff":"#666",fontWeight:700,fontSize:13,textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            Quote Requests {quotes.filter(q=>q.status==="new").length>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:999,fontSize:10,fontWeight:800,padding:"2px 6px"}}>{quotes.filter(q=>q.status==="new").length}</span>}
          </button>
        </div>

        {/* Services Tab */}
        {tab==="services" && (
          <div>
            {showAdd && (
              <div style={{padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16}}>
                <div style={{fontSize:15,fontWeight:900,marginBottom:16}}>New Service</div>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div><span style={lbl}>Service Title *</span><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Custom Sneaker Art" style={inp}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div><span style={lbl}>Category</span>
                      <select value={category} onChange={e=>setCategory(e.target.value)} style={{...inp,appearance:"none" as const}}>
                        {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><span style={lbl}>Price Label</span><input value={priceLabel} onChange={e=>setPriceLabel(e.target.value)} placeholder="Starting at $200" style={inp}/></div>
                  </div>
                  <div><span style={lbl}>Description</span><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe what's included..." rows={3} style={{...inp,resize:"vertical"}}/></div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:16}}>
                  <button onClick={handleAdd} disabled={saving||!title.trim()} style={{padding:"10px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:saving||!title.trim()?0.5:1}}>{saving?"Saving...":"Add Service"}</button>
                  <button onClick={()=>setShowAdd(false)} style={{padding:"10px 20px",borderRadius:999,background:"#fff",color:"#666",border:"1px solid #ddd",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                </div>
              </div>
            )}

            {fetching ? <div style={{textAlign:"center",padding:64,opacity:.4}}>Loading...</div>
            : services.length===0 ? (
              <div style={{textAlign:"center",padding:64,border:"1px dashed #ddd",borderRadius:16}}>
                <div style={{fontSize:48,marginBottom:12}}>🎯</div>
                <div style={{fontSize:18,fontWeight:900,marginBottom:8}}>No services yet</div>
                <div style={{fontSize:14,opacity:.4,marginBottom:24}}>Add your first service to start receiving quote requests.</div>
                <button onClick={()=>setShowAdd(true)} style={{padding:"12px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>+ Add Service</button>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {services.map(service=>(
                  <div key={service.id} style={{padding:20,borderRadius:16,border:"1px solid #eee",background:"#fff",display:"flex",alignItems:"center",gap:16,opacity:service.active?1:0.5}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",opacity:.4,marginBottom:4}}>{service.category}</div>
                      <div style={{fontSize:16,fontWeight:800,marginBottom:4}}>{service.title}</div>
                      {service.description && <div style={{fontSize:13,opacity:.5,marginBottom:6,lineHeight:1.4}}>{service.description}</div>}
                      <div style={{fontSize:13,fontWeight:800,color:"#6366f1"}}>{service.priceLabel}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
                      <button onClick={()=>toggleActive(service)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #ddd",background:service.active?"#f0fdf4":"#fff",color:service.active?"#16a34a":"#999",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{service.active?"Live":"Draft"}</button>
                      <button onClick={()=>startEdit(service)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #ddd",background:"#fff",color:"#333",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Edit</button>
                      <button onClick={()=>handleDelete(service.id)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #fee2e2",background:"#fff",color:"#dc2626",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quotes Tab */}
        {tab==="quotes" && (
          <div>
            {fetching ? <div style={{textAlign:"center",padding:64,opacity:.4}}>Loading...</div>
            : quotes.length===0 ? (
              <div style={{textAlign:"center",padding:64,border:"1px dashed #ddd",borderRadius:16}}>
                <div style={{fontSize:48,marginBottom:12}}>📬</div>
                <div style={{fontSize:18,fontWeight:900,marginBottom:8}}>No quote requests yet</div>
                <div style={{fontSize:14,opacity:.4}}>When someone requests a quote, it'll show up here.</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {quotes.map(quote=>(
                  <div key={quote.id} style={{padding:20,borderRadius:16,border:`1px solid ${quote.status==="new"?"#bbf7d0":"#eee"}`,background:quote.status==="new"?"#f0fdf4":"#fff"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",opacity:.4,marginBottom:4}}>{quote.serviceTitle}</div>
                        <div style={{fontSize:16,fontWeight:800}}>{quote.name}</div>
                        <a href={`mailto:${quote.email}`} style={{fontSize:13,color:"#6366f1",textDecoration:"none",fontWeight:600}}>{quote.email}</a>
                      </div>
                      {quote.status==="new" && <span style={{padding:"4px 10px",borderRadius:999,background:"#22c55e",color:"#fff",fontSize:10,fontWeight:800,textTransform:"uppercase"}}>New</span>}
                    </div>
                    {quote.message && <p style={{fontSize:14,opacity:.7,lineHeight:1.5,marginTop:8,padding:"12px",borderRadius:8,background:"rgba(0,0,0,0.03)"}}>{quote.message}</p>}
                    <a href={`mailto:${quote.email}?subject=Re: ${quote.serviceTitle}`} style={{display:"inline-block",marginTop:12,padding:"8px 16px",borderRadius:999,background:"#000",color:"#fff",textDecoration:"none",fontSize:12,fontWeight:700}}>Reply via Email →</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Edit Modal */}
      {editingService && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24}} onClick={()=>setEditingService(null)}>
            <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:480,boxShadow:"0 24px 64px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
              <div style={{fontSize:18,fontWeight:900,marginBottom:20}}>Edit Service</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <div><span style={lbl}>Title</span><input value={editTitle} onChange={e=>setEditTitle(e.target.value)} style={inp}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><span style={lbl}>Category</span>
                    <select value={editCategory} onChange={e=>setEditCategory(e.target.value)} style={{...inp,appearance:"none" as const}}>
                      {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><span style={lbl}>Price Label</span><input value={editPrice} onChange={e=>setEditPrice(e.target.value)} placeholder="Starting at $200" style={inp}/></div>
                </div>
                <div><span style={lbl}>Description</span><textarea value={editDesc} onChange={e=>setEditDesc(e.target.value)} rows={3} style={{...inp,resize:"vertical" as const}}/></div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:20}}>
                <button onClick={handleEditSave} disabled={editSaving||!editTitle.trim()} style={{flex:1,padding:"12px",borderRadius:10,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:editSaving||!editTitle.trim()?0.5:1}}>{editSaving?"Saving...":"Save Changes"}</button>
                <button onClick={()=>setEditingService(null)} style={{flex:1,padding:"12px",borderRadius:10,background:"#f5f5f5",color:"#666",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}