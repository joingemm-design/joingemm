"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useIsMobile";
import { createShop, updateShop, getShop, ShopData, Product } from "@/lib/shop";

const PRESETS: Record<string, Record<string, string>> = {
  minimal:{pageBg:"#ffffff",mainText:"#000000",dividerAccent:"#e5e5e5",topBarBg:"#000000",topBarText:"#ffffff",cardBg:"#f9fafb",cardText:"#000000",cardBorder:"#ffffff",buttons:"#000000"},
  dark:{pageBg:"#09090b",mainText:"#f4f4f5",dividerAccent:"#27272a",topBarBg:"#18181b",topBarText:"#ffffff",cardBg:"#18181b",cardText:"#f4f4f5",cardBorder:"#27272a",buttons:"#ffffff"},
  cotton:{pageBg:"#fdf2f8",mainText:"#831843",dividerAccent:"#fbcfe8",topBarBg:"#ec4899",topBarText:"#ffffff",cardBg:"#fff1f2",cardText:"#831843",cardBorder:"#fecdd3",buttons:"#ec4899"},
  luxury:{pageBg:"#fefce8",mainText:"#713f12",dividerAccent:"#fde68a",topBarBg:"#d97706",topBarText:"#ffffff",cardBg:"#fffbeb",cardText:"#713f12",cardBorder:"#fde68a",buttons:"#d97706"},
  summer:{pageBg:"#ecfdf5",mainText:"#064e3b",dividerAccent:"#a7f3d0",topBarBg:"#10b981",topBarText:"#ffffff",cardBg:"#f0fdf4",cardText:"#064e3b",cardBorder:"#bbf7d0",buttons:"#10b981"},
  warmth:{pageBg:"#fff7ed",mainText:"#7c2d12",dividerAccent:"#fed7aa",topBarBg:"#f97316",topBarText:"#ffffff",cardBg:"#fffbeb",cardText:"#7c2d12",cardBorder:"#fed7aa",buttons:"#f97316"},
  midnight:{pageBg:"#0f172a",mainText:"#e2e8f0",dividerAccent:"#334155",topBarBg:"#1e293b",topBarText:"#e2e8f0",cardBg:"#1e293b",cardText:"#e2e8f0",cardBorder:"#334155",buttons:"#38bdf8"},
  ocean:{pageBg:"#082f49",mainText:"#e0f2fe",dividerAccent:"#0369a1",topBarBg:"#0c4a6e",topBarText:"#e0f2fe",cardBg:"#0c4a6e",cardText:"#e0f2fe",cardBorder:"#0369a1",buttons:"#38bdf8"},
  forest:{pageBg:"#022c22",mainText:"#ecfdf5",dividerAccent:"#047857",topBarBg:"#064e3b",topBarText:"#ecfdf5",cardBg:"#064e3b",cardText:"#ecfdf5",cardBorder:"#047857",buttons:"#34d399"},
  royal:{pageBg:"#1e1b4b",mainText:"#e0e7ff",dividerAccent:"#4338ca",topBarBg:"#312e81",topBarText:"#e0e7ff",cardBg:"#312e81",cardText:"#e0e7ff",cardBorder:"#4338ca",buttons:"#818cf8"},
  dracula:{pageBg:"#282a36",mainText:"#f8f8f2",dividerAccent:"#44475a",topBarBg:"#44475a",topBarText:"#f8f8f2",cardBg:"#44475a",cardText:"#f8f8f2",cardBorder:"#6272a4",buttons:"#bd93f9"},
  velvet:{pageBg:"#4a044e",mainText:"#fae8ff",dividerAccent:"#701a75",topBarBg:"#701a75",topBarText:"#fae8ff",cardBg:"#5b0a60",cardText:"#fae8ff",cardBorder:"#701a75",buttons:"#e879f9"},
};

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}input:focus,textarea:focus{outline:none;border-color:#7c3aed!important}input[type=color]{-webkit-appearance:none;border:none;cursor:pointer}input[type=color]::-webkit-color-swatch-wrapper{padding:0}input[type=color]::-webkit-color-swatch{border:none;border-radius:6px}`;

export default function CreateShopPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [editId, setEditId] = useState<string|null>(null);
useEffect(() => { const params = new URLSearchParams(window.location.search); setEditId(params.get("edit")); }, []);
  const isMobile = useIsMobile();

  const [title, setTitle] = useState("New Shop");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [customHeader, setCustomHeader] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [topBarMessage, setTopBarMessage] = useState("");
  const [design, setDesign] = useState<Record<string,string>>({...PRESETS.minimal, preset:"minimal"});
  const [presetKey, setPresetKey] = useState("minimal");
  const [products, setProducts] = useState<Product[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pImagePreview, setPImagePreview] = useState("");
  const [showDesign, setShowDesign] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shopId, setShopId] = useState<string|null>(null);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);

  useEffect(() => {
    if (editId && user) {
      getShop(editId).then(s => {
        if (!s) return;
        setShopId(s.id); setTitle(s.title||""); setSlug(s.slug||""); setDescription(s.description||"");
        setCustomHeader(s.customHeader||""); setIsPublic(s.isPublic); setShowTitle(s.showTitle);
        setTopBarMessage(s.topBarMessage||""); setProducts(s.products||[]);
        if (s.design) { setDesign(s.design as any); setPresetKey((s.design as any).preset||"minimal"); }
      });
    }
  }, [editId, user]);

  function selectPreset(key: string) { setPresetKey(key); setDesign({...PRESETS[key], preset:key}); }

  function handleProductImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function addProduct() {
    if (!pName.trim()) return;
    setProducts(p => [...p, { id:"p_"+Date.now(), name:pName.trim(), price:parseFloat(pPrice)||0, description:pDesc.trim(), imageURL:pImagePreview, active:true, order:p.length, createdAt:new Date().toISOString() } as Product]);
    setPName(""); setPPrice(""); setPDesc(""); setPImagePreview(""); setShowAdd(false);
  }

  async function handleSave(publish: boolean) {
    if (!user || !title.trim()) return;
    setSaving(true);
    const data: any = {
      title:title.trim(), slug:slug.trim().toLowerCase().replace(/[^a-z0-9-]/g,"-")||title.trim().toLowerCase().replace(/[^a-z0-9]/g,"-"),
      description:description.trim(), customHeader:customHeader.trim(), isPublic:publish||isPublic,
      showTitle, topBarMessage:topBarMessage.trim(), design:{...design, preset:presetKey}, products,
    };
    if (shopId) await updateShop(shopId, data);
    else { const id = await createShop(user.uid, data); setShopId(id); }
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false), 2000);
  }

  if (loading) return (<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style><div style={{width:24,height:24,borderRadius:"50%",background:"#000",animation:"pulse 1.5s ease infinite"}}/></div>);

  const inp: React.CSSProperties = {width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #e0e0e0",fontSize:14,fontFamily:"inherit",fontWeight:500,color:"#000",background:"#fff"};
  const lbl: React.CSSProperties = {fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.12em",color:"#888",marginBottom:6,display:"block"};
  const sec: React.CSSProperties = {padding:isMobile?16:20,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16};

  return (
    <div style={{minHeight:"100vh",background:"#f4f4f5",fontFamily:"'DM Sans',sans-serif",color:"#000"}}>
      <style>{css}</style>

      {/* TOP BAR */}
      <div style={{position:"sticky",top:0,zIndex:50,background:"#fff",borderBottom:"1px solid #eee",padding:isMobile?"10px 12px":"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:isMobile?8:16}}>
          <button onClick={()=>router.push("/dashboard/shop")} style={{display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,borderRadius:10,border:"1px solid #eee",background:"#fff",cursor:"pointer"}}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </button>
          <span style={{fontSize:isMobile?14:16,fontWeight:900}}>{editId?"Edit Shop":"New Shop"}</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {saved&&<span style={{fontSize:12,fontWeight:700,color:"#22c55e"}}>✓</span>}
          {!isMobile&&<button onClick={()=>handleSave(false)} disabled={saving} style={{padding:"10px 20px",borderRadius:999,background:"#fff",color:"#000",border:"1px solid #ddd",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Draft</button>}
          <button onClick={()=>handleSave(true)} disabled={saving} style={{padding:"10px 20px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:saving?.6:1}}>{saving?"Saving...":"Publish"}</button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 380px",gap:0,maxWidth:1400,margin:"0 auto",minHeight:"calc(100vh - 61px)"}}>

        {/* LEFT: EDITOR */}
        <div style={{padding:isMobile?"16px 12px 100px":"24px 32px 120px",overflowY:"auto",maxHeight:isMobile?undefined:"calc(100vh - 61px)"}}>

          {/* Basic Info */}
          <div style={sec}>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12,marginBottom:12}}>
              <div><span style={lbl}>Shop Title</span><input value={title} onChange={e=>setTitle(e.target.value)} style={{...inp,fontWeight:700}}/></div>
              <div><span style={lbl}>URL Slug</span><input value={slug} onChange={e=>setSlug(e.target.value)} placeholder="my-shop" style={inp}/></div>
            </div>
            <div style={{marginBottom:12}}><span style={lbl}>Description</span><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Tell your story..." rows={3} style={{...inp,resize:"vertical"}}/></div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr auto",gap:12,alignItems:"end"}}>
              <div><span style={lbl}>Custom Header</span><input value={customHeader} onChange={e=>setCustomHeader(e.target.value)} placeholder="Overrides Title" style={inp}/></div>
              <label style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:8,border:"1px solid #e0e0e0",cursor:"pointer",fontSize:13,fontWeight:600}}>
                <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} style={{width:16,height:16}}/> Make Public
              </label>
            </div>
          </div>

          {/* Inventory */}
          <div style={sec}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontSize:15,fontWeight:900}}>🛒 Inventory ({products.length})</div>
              <button onClick={()=>setShowAdd(true)} style={{display:"flex",alignItems:"center",gap:4,padding:"8px 16px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Add Item</button>
            </div>
            {showAdd&&(
              <div style={{padding:16,borderRadius:12,border:"1px solid #e5e5e5",background:"#fafafa",marginBottom:12}}>
                <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"80px 1fr",gap:12,marginBottom:8}}>
                  <label style={{width:isMobile?"100%":80,height:80,borderRadius:10,border:"2px dashed #ddd",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden"}}>
                    {pImagePreview?<img src={pImagePreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>}
                    <input type="file" accept="image/*" onChange={handleProductImage} style={{display:"none"}}/>
                  </label>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <input value={pName} onChange={e=>setPName(e.target.value)} placeholder="Product name" style={inp}/>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <input value={pPrice} onChange={e=>setPPrice(e.target.value)} placeholder="Price" type="number" min="0" style={inp}/>
                      <input value={pDesc} onChange={e=>setPDesc(e.target.value)} placeholder="Description" style={inp}/>
                    </div>
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={addProduct} disabled={!pName.trim()} style={{padding:"8px 16px",borderRadius:8,background:"#000",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Add</button>
                  <button onClick={()=>{setShowAdd(false);setPName("");setPPrice("");setPDesc("");setPImagePreview("")}} style={{padding:"8px 16px",borderRadius:8,background:"#fff",color:"#666",border:"1px solid #ddd",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                </div>
              </div>
            )}
            {products.length===0?(
              <div style={{textAlign:"center",padding:32,border:"1px dashed #ddd",borderRadius:12}}><p style={{fontSize:13,opacity:.4}}>Your shelf is empty. Add your first product.</p></div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(auto-fill, minmax(140px, 1fr))",gap:10}}>
                {products.map(p=>(
                  <div key={p.id} style={{borderRadius:12,border:"1px solid #e5e5e5",background:"#fff",overflow:"hidden",position:"relative"}}>
                    <div style={{aspectRatio:"3/4",background:"#f5f5f5",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
                      {p.imageURL?<img src={p.imageURL} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>}
                    </div>
                    <div style={{padding:8}}><div style={{fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div><div style={{fontSize:11,fontWeight:800,opacity:.5}}>${p.price.toFixed(2)}</div></div>
                    <button onClick={()=>setProducts(prev=>prev.filter(x=>x.id!==p.id))} style={{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:6,background:"rgba(0,0,0,0.6)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12}}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Design System */}
          <button onClick={()=>setShowDesign(!showDesign)} style={{...sec,width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",fontFamily:"inherit",color:"#000",textAlign:"left"} as any}>
            <span style={{fontSize:15,fontWeight:900}}>🎨 Design System</span>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={showDesign?"m18 15-6-6-6 6":"m6 9 6 6 6-6"}/></svg>
          </button>
          {showDesign&&(
            <div style={{...sec,marginTop:-8}}>
              {/* Show title toggle */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,padding:12,borderRadius:10,background:"#fafafa"}}>
                <span style={{fontSize:13,fontWeight:700}}>Show Shop Title</span>
                <button onClick={()=>setShowTitle(!showTitle)} style={{width:44,height:24,borderRadius:999,border:"none",cursor:"pointer",background:showTitle?"#22c55e":"#ddd",position:"relative"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:showTitle?22:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                </button>
              </div>

              {/* Color pickers */}
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:8,marginBottom:16}}>
                {[{k:"mainText",l:"Main Text"},{k:"dividerAccent",l:"Divider"},{k:"topBarBg",l:"Top Bar BG"},{k:"topBarText",l:"Top Bar Text"},{k:"cardBg",l:"Card BG"},{k:"cardText",l:"Card Text"},{k:"cardBorder",l:"Card Border"},{k:"buttons",l:"Buttons"}].map(c=>(
                  <div key={c.k}><span style={{...lbl,fontSize:9}}>{c.l}</span><div style={{display:"flex",alignItems:"center",gap:4}}><input type="color" value={design[c.k]||"#000"} onChange={e=>setDesign(d=>({...d,[c.k]:e.target.value}))} style={{width:28,height:28,borderRadius:6,border:"1px solid #ddd"}}/><span style={{fontSize:9,fontFamily:"monospace",opacity:.4}}>{design[c.k]}</span></div></div>
                ))}
              </div>

              {/* Top bar message */}
              <div style={{marginBottom:16}}><span style={lbl}>Top Bar Message</span><input value={topBarMessage} onChange={e=>setTopBarMessage(e.target.value)} placeholder="FREE SHIPPING ON ORDERS OVER $100" style={inp}/></div>

              {/* Presets */}
              <span style={lbl}>Page Background Presets</span>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3, 1fr)",gap:8}}>
                {Object.entries(PRESETS).map(([key, p])=>(<button key={key} onClick={()=>selectPreset(key)} style={{padding:"10px 12px",borderRadius:10,fontSize:12,fontWeight:700,textTransform:"capitalize",background:p.pageBg,color:p.mainText,border:presetKey===key?"3px solid #7c3aed":"2px solid #e5e5e5",cursor:"pointer",fontFamily:"inherit"}}>{key}</button>))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: PHONE PREVIEW */}
        {!isMobile&&(
          <div style={{background:"#e8e8ec",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:24,position:"sticky",top:61,height:"calc(100vh - 61px)",overflow:"hidden"}}>
            <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",opacity:.4,marginBottom:12}}>Preview</div>
            <div style={{width:280,minHeight:500,borderRadius:36,border:"8px solid #1a1a1a",background:design.pageBg||"#fff",overflow:"hidden",boxShadow:"0 25px 60px rgba(0,0,0,0.3)",display:"flex",flexDirection:"column",position:"relative",fontFamily:"'DM Sans',sans-serif"}}>
              <div style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",width:64,height:18,background:"#1a1a1a",borderRadius:99,zIndex:10}}/>
              {topBarMessage&&<div style={{padding:"28px 12px 6px",background:design.topBarBg,color:design.topBarText,fontSize:8,fontWeight:700,textAlign:"center",textTransform:"uppercase",letterSpacing:"0.1em"}}>{topBarMessage}</div>}
              <div style={{padding:topBarMessage?"10px 16px":"36px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",background:design.topBarBg,color:design.topBarText}}>
                <span style={{fontSize:9,fontWeight:900,letterSpacing:"0.1em",opacity:.5}}>GEMM</span>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{opacity:.5}}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </div>
              <div style={{padding:"16px 16px 12px",color:design.mainText}}>
                {showTitle&&<h2 style={{fontSize:18,fontWeight:900,marginBottom:4}}>{customHeader||title||"New Shop"}</h2>}
                {description&&<p style={{fontSize:10,opacity:.5,lineHeight:1.4}}>{description}</p>}
              </div>
              <div style={{padding:"0 12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {products.length===0?[1,2,3,4].map(i=>(<div key={i} style={{aspectRatio:"3/4",borderRadius:8,border:`1px dashed ${design.cardBorder||"#ddd"}`,background:design.cardBg,display:"flex",alignItems:"center",justifyContent:"center",opacity:.3}}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1"><rect width="18" height="18" x="3" y="3" rx="2"/></svg></div>)):products.map(p=>(<div key={p.id} style={{borderRadius:8,overflow:"hidden",border:`1px solid ${design.cardBorder}`,background:design.cardBg}}><div style={{aspectRatio:"3/4",background:"#f0f0f0",overflow:"hidden"}}>{p.imageURL?<img src={p.imageURL} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",opacity:.3}}>📷</div>}</div><div style={{padding:6,color:design.cardText}}><div style={{fontSize:9,fontWeight:700}}>{p.name}</div><div style={{fontSize:9,fontWeight:800,opacity:.6}}>${p.price.toFixed(2)}</div></div></div>))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:isMobile?"0":"380px",zIndex:50,background:"#fff",borderTop:"1px solid #eee",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={()=>router.push("/dashboard/shop")} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:999,border:"1px solid #ddd",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#666"}}>← Back</button>
        <button onClick={()=>handleSave(true)} disabled={saving} style={{padding:"10px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:saving?.6:1}}>{saving?"Saving...":"Publish"}</button>
      </div>
    </div>
  );
}
