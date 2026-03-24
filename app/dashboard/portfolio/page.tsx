"use client";
import { usePlan } from "@/hooks/usePlan";
import UpgradeGate from "@/components/UpgradeGate";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useIsMobile";
import { addPortfolioItem, getUserPortfolio, deletePortfolioItem, uploadPortfolioImage, PortfolioItem } from "@/lib/portfolio";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const CATEGORIES = ["Sneaker Art","Sports Art","Mural","Custom Art","Music","Speaking","Collab","Other"];

function getYouTubeId(url: string): string {
  const regExp = new RegExp("(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([^&\n?#]+)");
  const match = url.match(regExp);
  return match ? match[1] : "";
}

function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? "https://img.youtube.com/vi/" + id + "/hqdefault.jpg" : "";
}

export default function PortfolioPage() {
  const { user, loading } = useAuth();
  const { canUsePortfolio, planLoading } = usePlan();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<"image"|"video">("image");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [link, setLink] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string|null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  if (!planLoading && !canUsePortfolio) return <UpgradeGate feature="Portfolio" requiredPlan="velocity" description="Showcase your work with a stunning portfolio that impresses clients and fans." />;
  useEffect(() => { if (user) getUserPortfolio(user.uid).then(p => { setItems(p); setFetching(false); }); }, [user]);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleAdd() {
    if (!user || !title.trim()) return;
    if (addType === "image" && !imageFile) return;
    if (addType === "video" && !videoUrl.trim()) return;
    setSaving(true);
    try {
      let imageURL = "";
      let videoEmbedUrl = "";
      if (addType === "image") {
        imageURL = await uploadPortfolioImage(user.uid, imageFile!);
      } else {
        const ytId = getYouTubeId(videoUrl);
        if (!ytId) { alert("Invalid YouTube URL"); setSaving(false); return; }
        videoEmbedUrl = "https://www.youtube.com/embed/" + ytId;
        imageURL = getYouTubeThumbnail(videoUrl);
      }
      const id = await addPortfolioItem(user.uid, {
        title: title.trim(), description: description.trim(), category,
        imageURL, link: addType === "video" ? videoEmbedUrl : link.trim(),
        order: items.length, videoUrl: addType === "video" ? videoEmbedUrl : ""
      } as any);
      setItems(prev => [{
        id, uid: user.uid, title: title.trim(), description: description.trim(),
        category, imageURL, link: addType === "video" ? videoEmbedUrl : link.trim(),
        order: items.length, createdAt: new Date(), videoUrl: addType === "video" ? videoEmbedUrl : ""
      } as any, ...prev]);
      setTitle(""); setDescription(""); setCategory("Other"); setLink("");
      setImageFile(null); setImagePreview(""); setVideoUrl("");
      setShowAdd(false); setAddType("image");
    } catch(e) { alert("Upload failed. Try again."); }
    setSaving(false);
  }

  function startEdit(item: any) {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDesc(item.description || "");
    setEditCategory(item.category);
    setEditLink(item.link || "");
  }

  async function handleEditSave() {
    if (!editingItem) return;
    setEditSaving(true);
    const { doc, updateDoc } = await import("firebase/firestore");
    const { firestore } = await import("@/lib/firebase");
    await updateDoc(doc(firestore, "portfolio", editingItem.id), {
      title: editTitle.trim(),
      description: editDesc.trim(),
      category: editCategory,
      link: editLink.trim(),
    });
    setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, title: editTitle.trim(), description: editDesc.trim(), category: editCategory, link: editLink.trim() } : i));
    setEditSaving(false);
    setEditingItem(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    setDeleting(id);
    await deletePortfolioItem(id);
    setItems(prev => prev.filter(i => i.id !== id));
    setDeleting(null);
  }

  const inp: React.CSSProperties = {width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #e0e0e0",fontSize:14,fontFamily:"inherit",fontWeight:500,color:"#000",background:"#fff"};
  const lbl: React.CSSProperties = {fontSize:10,fontWeight:800,textTransform:"uppercase" as const,letterSpacing:"0.12em",color:"#888",marginBottom:6,display:"block"};

  return (
    <div style={{minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000"}}>
      <style>{css}</style>
      <div style={{maxWidth:900,margin:"0 auto",padding:isMobile?"16px 12px 80px":"32px 24px 64px"}}>
        <button onClick={()=>router.push("/dashboard")} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em"}}><ArrowLeft/> Back</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div>
            <h1 style={{fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4}}>Portfolio</h1>
            <p style={{fontSize:15,opacity:.5,fontWeight:500}}>Showcase your work to the world.</p>
          </div>
          <button onClick={()=>setShowAdd(true)} style={{padding:"12px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>+ Add Work</button>
        </div>

        {showAdd && (
          <div style={{padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:24}}>
            <div style={{fontSize:15,fontWeight:900,marginBottom:16}}>New Portfolio Item</div>

            {/* Type toggle */}
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <button onClick={()=>setAddType("image")} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:addType==="image"?"#000":"#f0f0f0",color:addType==="image"?"#fff":"#666",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>📷 Photo</button>
              <button onClick={()=>setAddType("video")} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:addType==="video"?"#000":"#f0f0f0",color:addType==="video"?"#fff":"#666",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>▶ YouTube</button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"120px 1fr",gap:16,marginBottom:16}}>
              {addType==="image" ? (
                <label style={{width:isMobile?"100%":120,height:120,borderRadius:12,border:"2px dashed #ddd",background:"#fafafa",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0}}>
                  {imagePreview ? <img src={imagePreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{textAlign:"center",opacity:.4}}><div style={{fontSize:24,marginBottom:4}}>📷</div><div style={{fontSize:11,fontWeight:600}}>Add Photo</div></div>}
                  <input type="file" accept="image/*" onChange={handleImage} style={{display:"none"}}/>
                </label>
              ) : (
                <div style={{width:isMobile?"100%":120,height:120,borderRadius:12,border:"2px dashed #ddd",background:"#fafafa",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                  {getYouTubeThumbnail(videoUrl) ? <img src={getYouTubeThumbnail(videoUrl)} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{textAlign:"center",opacity:.4}}><div style={{fontSize:24,marginBottom:4}}>▶</div><div style={{fontSize:11,fontWeight:600}}>YouTube</div></div>}
                </div>
              )}

              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div><span style={lbl}>Title *</span><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Cardinals x Brock Seals Collab" style={inp}/></div>
                {addType==="video" && (
                  <div><span style={lbl}>YouTube URL *</span><input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." style={inp}/></div>
                )}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><span style={lbl}>Category</span>
                    <select value={category} onChange={e=>setCategory(e.target.value)} style={{...inp,appearance:"none" as const}}>
                      {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  {addType==="image" && <div><span style={lbl}>Link (optional)</span><input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://..." style={inp}/></div>}
                </div>
                <div><span style={lbl}>Description</span><input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Brief description..." style={inp}/></div>
              </div>
            </div>

            <div style={{display:"flex",gap:8}}>
              <button onClick={handleAdd} disabled={saving||!title.trim()||(addType==="image"&&!imageFile)||(addType==="video"&&!videoUrl.trim())} style={{padding:"10px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:saving||!title.trim()||(addType==="image"&&!imageFile)||(addType==="video"&&!videoUrl.trim())?0.5:1}}>{saving?"Uploading...":"Add to Portfolio"}</button>
              <button onClick={()=>{setShowAdd(false);setTitle("");setDescription("");setImagePreview("");setImageFile(null);setVideoUrl("");setAddType("image");}} style={{padding:"10px 20px",borderRadius:999,background:"#fff",color:"#666",border:"1px solid #ddd",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            </div>
          </div>
        )}

        {fetching ? (
          <div style={{textAlign:"center",padding:64,opacity:.4}}>Loading...</div>
        ) : items.length === 0 ? (
          <div style={{textAlign:"center",padding:64,border:"1px dashed #ddd",borderRadius:16}}>
            <div style={{fontSize:48,marginBottom:12}}>🎨</div>
            <div style={{fontSize:18,fontWeight:900,marginBottom:8}}>No portfolio items yet</div>
            <div style={{fontSize:14,opacity:.4,marginBottom:24}}>Add your first piece to showcase your work.</div>
            <button onClick={()=>setShowAdd(true)} style={{padding:"12px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>+ Add Work</button>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)",gap:16}}>
            {items.map(item=>(
              <div key={item.id} style={{borderRadius:16,overflow:"hidden",border:"1px solid #eee",background:"#fff",position:"relative"}}>
                <div style={{aspectRatio:"4/3",background:"#f5f5f5",overflow:"hidden"}}>
                  <img src={item.imageURL} alt={item.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
                <div style={{padding:12}}>
                  <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",opacity:.4,marginBottom:4}}>{item.category}</div>
                  <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>{item.title}</div>
                  {item.description && <div style={{fontSize:12,opacity:.5,lineHeight:1.4}}>{item.description}</div>}
                </div>
                <div style={{position:"absolute",top:8,right:8,display:"flex",gap:4}}>
                  <button onClick={()=>startEdit(item)} style={{width:28,height:28,borderRadius:8,background:"rgba(99,102,241,0.85)",border:"none",cursor:"pointer",color:"#fff",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>✏</button>
                  <button onClick={()=>handleDelete(item.id)} disabled={deleting===item.id} style={{width:28,height:28,borderRadius:8,background:"rgba(0,0,0,0.6)",border:"none",cursor:"pointer",color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {editingItem && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24}} onClick={()=>setEditingItem(null)}>
          <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:480,boxShadow:"0 24px 64px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:18,fontWeight:900,marginBottom:20}}>Edit Portfolio Item</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><span style={lbl}>Title</span><input value={editTitle} onChange={e=>setEditTitle(e.target.value)} style={inp}/></div>
              <div><span style={lbl}>Category</span>
                <select value={editCategory} onChange={e=>setEditCategory(e.target.value)} style={{...inp,appearance:"none" as const}}>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><span style={lbl}>Link (optional)</span><input value={editLink} onChange={e=>setEditLink(e.target.value)} placeholder="https://..." style={inp}/></div>
              <div><span style={lbl}>Description</span><textarea value={editDesc} onChange={e=>setEditDesc(e.target.value)} rows={3} style={{...inp,resize:"vertical" as const}}/></div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:20}}>
              <button onClick={handleEditSave} disabled={editSaving||!editTitle.trim()} style={{flex:1,padding:"12px",borderRadius:10,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:editSaving||!editTitle.trim()?0.5:1}}>{editSaving?"Saving...":"Save Changes"}</button>
              <button onClick={()=>setEditingItem(null)} style={{flex:1,padding:"12px",borderRadius:10,background:"#f5f5f5",color:"#666",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}