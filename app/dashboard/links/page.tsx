"use client";

// app/dashboard/links/page.tsx — V2
// Full Link-in-Bio Editor matching Wavey
// NEW: Header blocks, inline editing, custom color pickers, button shadows, live toggle, delete page

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getUserProfile, getUserLinks, addLink, updateLink, deleteLink, updateUserProfile, UserProfile, LinkItem } from "@/lib/db";

// ── Design Presets ──────────────────────────────────────────────────────
const DESIGN_PRESETS = [
  { key:"clean",     bg:"#ffffff", text:"#000000", btn:"#000000", btnText:"#ffffff" },
  { key:"midnight",  bg:"#09090b", text:"#f4f4f5", btn:"#ffffff", btnText:"#000000" },
  { key:"slate",     bg:"#1e293b", text:"#e2e8f0", btn:"#e2e8f0", btnText:"#1e293b" },
  { key:"charcoal",  bg:"#27272a", text:"#e4e4e7", btn:"#e4e4e7", btnText:"#27272a" },
  { key:"cream",     bg:"#fefce8", text:"#422006", btn:"#422006", btnText:"#fefce8" },
  { key:"lemon",     bg:"#fef9c3", text:"#713f12", btn:"#713f12", btnText:"#fef9c3" },
  { key:"grape",     bg:"#2e1065", text:"#e9d5ff", btn:"#a855f7", btnText:"#ffffff" },
  { key:"cherry",    bg:"#ef4444", text:"#ffffff", btn:"#ffffff", btnText:"#ef4444" },
  { key:"noir",      bg:"#000000", text:"#ffffff", btn:"#ffffff", btnText:"#000000" },
  { key:"ink",       bg:"#0f172a", text:"#cbd5e1", btn:"#38bdf8", btnText:"#0f172a" },
  { key:"forest",    bg:"#022c22", text:"#ecfdf5", btn:"#34d399", btnText:"#022c22" },
  { key:"emerald",   bg:"#064e3b", text:"#d1fae5", btn:"#10b981", btnText:"#ffffff" },
  { key:"ocean",     bg:"#082f49", text:"#e0f2fe", btn:"#38bdf8", btnText:"#082f49" },
  { key:"navy",      bg:"#1e1b4b", text:"#e0e7ff", btn:"#818cf8", btnText:"#1e1b4b" },
  { key:"teal",      bg:"#134e4a", text:"#ccfbf1", btn:"#2dd4bf", btnText:"#134e4a" },
  { key:"mint",      bg:"#f0fdf4", text:"#14532d", btn:"#22c55e", btnText:"#ffffff" },
  { key:"sage",      bg:"#dcfce7", text:"#166534", btn:"#166534", btnText:"#dcfce7" },
  { key:"lavender",  bg:"#f5f3ff", text:"#4c1d95", btn:"#7c3aed", btnText:"#ffffff" },
  { key:"blush",     bg:"#fdf2f8", text:"#831843", btn:"#ec4899", btnText:"#ffffff" },
  { key:"rose",      bg:"#fff1f2", text:"#881337", btn:"#fb7185", btnText:"#ffffff" },
  { key:"sand",      bg:"#fdfbf7", text:"#451a03", btn:"#d97706", btnText:"#ffffff" },
  { key:"sky",       bg:"#e0f2fe", text:"#0c4a6e", btn:"#0284c7", btnText:"#ffffff" },
  { key:"dracula",   bg:"#282a36", text:"#f8f8f2", btn:"#bd93f9", btnText:"#282a36" },
  { key:"cyber",     bg:"#09090b", text:"#00f0ff", btn:"#ff0099", btnText:"#ffffff" },
  { key:"velvet",    bg:"#4a044e", text:"#fae8ff", btn:"#e879f9", btnText:"#4a044e" },
];

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}input:focus,textarea:focus{outline:none;border-color:#7c3aed!important}input::placeholder,textarea::placeholder{color:#aaa}input[type=color]{-webkit-appearance:none;border:none;padding:0;cursor:pointer}input[type=color]::-webkit-color-swatch-wrapper{padding:0}input[type=color]::-webkit-color-swatch{border:none;border-radius:6px}`;

// ── Icons ───────────────────────────────────────────────────────────────
const ArrowLeft=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const Plus=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>);
const Trash=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>);
const ExtLink=()=>(<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>);
const PenIcon=()=>(<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>);
const CheckIcon=()=>(<svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>);
const TypeIcon=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4,7 4,4 20,4 20,7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>);
const IgIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);
const TtIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.5a6.34 6.34 0 0 0 6.34-6.34V8.71a8.35 8.35 0 0 0 4.76 1.49V6.75a4.84 4.84 0 0 1-1-.06z"/></svg>);
const TwIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);
const YtIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>);
const LiIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>);
const FbIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);

// ── Helper types ────────────────────────────────────────────────────────
interface ContentBlock {
  type: "link" | "header";
  id: string;
  // link fields
  title?: string;
  url?: string;
  icon?: string;
  active?: boolean;
  // header fields
  text?: string;
}

// ══════════════════════════════════════════════════════════════════════════
export default function LinksEditorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile|null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [headers, setHeaders] = useState<{id:string;text:string;order:number}[]>([]);
  const [ready, setReady] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [socials, setSocials] = useState<Record<string,string>>({});
  const [design, setDesign] = useState<Record<string,string>>({ preset:"clean", buttonShape:"rounded", buttonShadow:"none", typography:"sans", spacing:"normal", bgColor:"#ffffff", textColor:"#000000", buttonBg:"#000000", buttonText:"#ffffff" });
  const [isLive, setIsLive] = useState(true);
  const [showAddLink, setShowAddLink] = useState(false);
  const [showAddHeader, setShowAddHeader] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newHeaderText, setNewHeaderText] = useState("");
  const [editingLink, setEditingLink] = useState<string|null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const p = await getUserProfile(user.uid);
      setProfile(p);

      if (p) {
        setDisplayName(p.displayName || "");
        setBio(p.bio || "");
        setSocials(p.socials || {});
        const d = p.design || {};
        const preset = DESIGN_PRESETS.find(pr => pr.key === (d.preset || p.theme || "clean")) || DESIGN_PRESETS[0];
        setDesign({ preset: preset.key, buttonShape: d.buttonShape||"rounded", buttonShadow: d.buttonShadow||"none", typography: d.typography||"sans", spacing: d.spacing||"normal", bgColor: d.bgColor||preset.bg, textColor: d.textColor||preset.text, buttonBg: d.buttonBg||preset.btn, buttonText: d.buttonText||preset.btnText });
      } else {
        setDisplayName(user.displayName || "");
        setBio("");
        setSocials({});
        const preset = DESIGN_PRESETS[0];
        setDesign({ preset: preset.key, buttonShape: "rounded", buttonShadow: "none", typography: "sans", spacing: "normal", bgColor: preset.bg, textColor: preset.text, buttonBg: preset.btn, buttonText: preset.btnText });
      }

      const l = await getUserLinks(user.uid);
      setLinks(l);
      setReady(true);
    })();
  }, [user, router]);

  async function loadLinks() { if (!user) return; const l = await getUserLinks(user.uid); setLinks(l); }

  async function handleAddLink() {
    if (!user || !newTitle.trim() || !newUrl.trim()) return;
    setSaving(true);
    let url = newUrl.trim();
    if (!url.startsWith("http")) url = "https://" + url;
    await addLink(user.uid, newTitle.trim(), url, newIcon.trim());
    setNewTitle(""); setNewUrl(""); setNewIcon(""); setShowAddLink(false);
    await loadLinks(); setSaving(false);
  }

  function handleAddHeader() {
    if (!newHeaderText.trim()) return;
    setHeaders(prev => [...prev, { id: `h_${Date.now()}`, text: newHeaderText.trim(), order: links.length + prev.length }]);
    setNewHeaderText(""); setShowAddHeader(false);
  }

  async function handleDeleteLink(id: string) { if (!user) return; await deleteLink(user.uid, id); await loadLinks(); }
  async function handleToggleLink(link: LinkItem) { if (!user) return; await updateLink(user.uid, link.id, { active: !link.active }); await loadLinks(); }

  async function handleSaveEdit(linkId: string) {
    if (!user) return;
    let url = editUrl.trim();
    if (url && !url.startsWith("http")) url = "https://" + url;
    await updateLink(user.uid, linkId, { title: editTitle.trim(), url });
    setEditingLink(null);
    await loadLinks();
  }

  function startEdit(link: LinkItem) {
    setEditingLink(link.id);
    setEditTitle(link.title);
    setEditUrl(link.url);
  }

  async function handlePublish() {
    if (!user) return;
    setPublishing(true);
    await updateUserProfile(user.uid, { displayName, bio, socials, design, theme: design.preset || "clean" });
    setPublishing(false);
    setPublished(true);
    setTimeout(() => setPublished(false), 2000);
  }

  // Design values
  const dBg = design.bgColor || "#ffffff";
  const dText = design.textColor || "#000000";
  const dBtn = design.buttonBg || "#000000";
  const dBtnText = design.buttonText || "#ffffff";
  const btnRadius = design.buttonShape === "square" ? 4 : design.buttonShape === "pill" ? 999 : 12;
  const btnShadow = design.buttonShadow === "hard" ? `4px 4px 0 ${dText}` : design.buttonShadow === "soft" ? "0 4px 12px rgba(0,0,0,0.15)" : "none";
  const fontFamily = design.typography === "serif" ? "'Playfair Display',Georgia,serif" : design.typography === "mono" ? "'DM Mono',monospace" : "'DM Sans',sans-serif";

  const inp: React.CSSProperties = { width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #e0e0e0", fontSize:14, fontFamily:"inherit", fontWeight:500, color:"#000", background:"#fff" };
  const label: React.CSSProperties = { fontSize:10, fontWeight:800, textTransform:"uppercase" as const, letterSpacing:"0.12em", color:"#888", marginBottom:6, display:"block" };
  const section: React.CSSProperties = { padding:20, borderRadius:16, border:"1px solid #eee", background:"#fff", marginBottom:16 };

  if (loading || !ready) return (
    <div style={{minHeight:"100vh",background:"#f8f8f8",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{css}</style><div style={{width:24,height:24,borderRadius:"50%",background:"#000",animation:"pulse 1.5s ease infinite"}}/></div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f4f4f5", fontFamily:"'DM Sans',sans-serif", color:"#000" }}>
      <style>{css}</style>

      {/* TOP BAR */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"#fff", borderBottom:"1px solid #eee", padding:"12px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={()=>router.push("/dashboard")} style={{ display:"flex", alignItems:"center", justifyContent:"center", width:36, height:36, borderRadius:10, border:"1px solid #eee", background:"#fff", cursor:"pointer", color:"#000" }}><ArrowLeft/></button>
          <div>
            <div style={{ fontSize:16, fontWeight:900 }}>Editing /{profile?.username}</div>
            <a href={`/${profile?.username}`} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"#7c3aed", fontWeight:600, textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}>gemm.live/{profile?.username} <ExtLink/></a>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {published && <span style={{ fontSize:12, fontWeight:700, color:"#22c55e" }}>✓ Published!</span>}
          <button onClick={handlePublish} disabled={publishing} style={{ padding:"10px 28px", borderRadius:999, background:"#000", color:"#fff", border:"none", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit", opacity:publishing?.6:1 }}>
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 380px", gap:0, maxWidth:1400, margin:"0 auto", minHeight:"calc(100vh - 61px)" }}>

        {/* ════ LEFT: EDITOR ════ */}
        <div style={{ padding:"24px 32px 120px", overflowY:"auto", maxHeight:"calc(100vh - 61px)" }}>

          {/* Profile */}
          <div style={section}>
            <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:"#f0f0f0", border:"2px solid #eee", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#ccc", overflow:"hidden" }}>
                {profile?.photoURL ? <Image src={profile.photoURL} alt="" width="64" height="64" referrerPolicy="no-referrer" style={{objectFit:"cover"}}/> : displayName?.[0]?.toUpperCase()||"?"}
              </div>
              <div style={{ flex:1 }}>
                <input value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="Your Name" style={{...inp, fontWeight:700, fontSize:16, marginBottom:8}}/>
                <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Tell your story..." rows={2} style={{...inp, resize:"vertical", minHeight:48}}/>
              </div>
            </div>
          </div>

          {/* Content Blocks */}
          <div style={section}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontSize:15, fontWeight:900 }}>🔗 Content Blocks</div>
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>setShowAddLink(true)} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:999, border:"1px solid #ddd", background:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}><Plus/> Link</button>
                <button onClick={()=>setShowAddHeader(true)} style={{ display:"flex", alignItems:"center", gap:4, padding:"6px 12px", borderRadius:999, border:"1px solid #ddd", background:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}><TypeIcon/> Header</button>
              </div>
            </div>

            {/* Add link form */}
            {showAddLink && (
              <div style={{ padding:16, borderRadius:12, border:"1px solid #e5e5e5", background:"#fafafa", marginBottom:12 }}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>New Link</div>
                <div style={{ display:"grid", gridTemplateColumns:"48px 1fr", gap:8, marginBottom:8 }}>
                  <input value={newIcon} onChange={e=>setNewIcon(e.target.value)} placeholder="🔗" maxLength={2} style={{...inp, textAlign:"center", fontSize:18, padding:"8px"}}/>
                  <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Link title" style={inp}/>
                </div>
                <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="https://..." onKeyDown={e=>e.key==="Enter"&&handleAddLink()} style={{...inp, marginBottom:8}}/>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={handleAddLink} disabled={saving||!newTitle.trim()||!newUrl.trim()} style={{ padding:"8px 16px", borderRadius:8, background:"#000", color:"#fff", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>{saving?"Adding...":"Add"}</button>
                  <button onClick={()=>{setShowAddLink(false);setNewTitle("");setNewUrl("");setNewIcon("")}} style={{ padding:"8px 16px", borderRadius:8, background:"#fff", color:"#666", border:"1px solid #ddd", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Add header form */}
            {showAddHeader && (
              <div style={{ padding:16, borderRadius:12, border:"1px solid #e5e5e5", background:"#fafafa", marginBottom:12 }}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>New Header</div>
                <input value={newHeaderText} onChange={e=>setNewHeaderText(e.target.value)} placeholder="Section title..." onKeyDown={e=>e.key==="Enter"&&handleAddHeader()} style={{...inp, marginBottom:8, fontWeight:700}}/>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={handleAddHeader} disabled={!newHeaderText.trim()} style={{ padding:"8px 16px", borderRadius:8, background:"#000", color:"#fff", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Add</button>
                  <button onClick={()=>{setShowAddHeader(false);setNewHeaderText("")}} style={{ padding:"8px 16px", borderRadius:8, background:"#fff", color:"#666", border:"1px solid #ddd", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Headers */}
            {headers.map(h => (
              <div key={h.id} style={{ padding:12, borderRadius:10, border:"1px dashed #ddd", background:"#fafafa", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:13, fontWeight:800, display:"flex", alignItems:"center", gap:6 }}><TypeIcon/> {h.text}</div>
                <button onClick={()=>setHeaders(prev=>prev.filter(x=>x.id!==h.id))} style={{ padding:4, background:"none", border:"none", cursor:"pointer", color:"#ccc" }}><Trash/></button>
              </div>
            ))}

            {/* Links list */}
            {links.length===0 && headers.length===0 ? (
              <div style={{ textAlign:"center", padding:24, opacity:.4, fontSize:13 }}>No content yet. Add a link or header above.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {links.map(link => (
                  <div key={link.id} style={{ padding:12, borderRadius:12, border:"1px solid #e5e5e5", background:link.active?"#fff":"#fafafa", opacity:link.active?1:.5 }}>
                    {editingLink === link.id ? (
                      /* Inline edit mode */
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} style={{...inp, fontWeight:700}} placeholder="Title"/>
                        <input value={editUrl} onChange={e=>setEditUrl(e.target.value)} style={inp} placeholder="URL"/>
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={()=>handleSaveEdit(link.id)} style={{ padding:"6px 14px", borderRadius:6, background:"#000", color:"#fff", border:"none", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:4 }}><CheckIcon/> Save</button>
                          <button onClick={()=>setEditingLink(null)} style={{ padding:"6px 14px", borderRadius:6, background:"#fff", color:"#666", border:"1px solid #ddd", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      /* Display mode */
                      <>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                          <div style={{ fontWeight:700, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{fontSize:18}}>{link.icon||"🔗"}</span> {link.title}
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <button onClick={()=>startEdit(link)} style={{ padding:4, background:"none", border:"none", cursor:"pointer", color:"#aaa" }}><PenIcon/></button>
                            <button onClick={()=>handleToggleLink(link)} style={{ width:40, height:22, borderRadius:999, border:"none", cursor:"pointer", background:link.active?"#22c55e":"#ddd", position:"relative", transition:"background .2s" }}>
                              <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:link.active?20:2, transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
                            </button>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"#999" }}>
                          <span style={{ padding:"2px 8px", borderRadius:4, background:"#f5f5f5", fontSize:10, fontWeight:700, textTransform:"uppercase" }}>Website</span>
                          <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{link.url}</span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Design */}
          <div style={section}>
            <div style={{ fontSize:15, fontWeight:900, marginBottom:16 }}>🎨 Design</div>

            {/* Preset grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:8, marginBottom:20 }}>
              {DESIGN_PRESETS.map(p => (
                <button key={p.key} onClick={()=>setDesign(d=>({...d, preset:p.key, bgColor:p.bg, textColor:p.text, buttonBg:p.btn, buttonText:p.btnText}))}
                  style={{ aspectRatio:"1", borderRadius:10, border:design.preset===p.key?"3px solid #7c3aed":"2px solid #e5e5e5", background:p.bg, cursor:"pointer", position:"relative", overflow:"hidden", transition:"border .2s" }}>
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"30%", background:p.btn, opacity:.6 }}/>
                </button>
              ))}
            </div>

            {/* Spacing */}
            <div style={{ marginBottom:16 }}><span style={label}>Item Spacing</span>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:4 }}>
                {["compact","normal","airy"].map(s=>(<button key={s} onClick={()=>setDesign(d=>({...d,spacing:s}))} style={{ padding:"8px", borderRadius:8, fontSize:12, fontWeight:700, textTransform:"capitalize" as const, border:design.spacing===s?"2px solid #000":"1px solid #ddd", background:design.spacing===s?"#000":"#fff", color:design.spacing===s?"#fff":"#666", cursor:"pointer", fontFamily:"inherit" }}>{s}</button>))
                }
              </div>
            </div>

            {/* Custom colors */}
            <div style={{ marginBottom:16 }}>
              <span style={label}>Custom Colors</span>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[{k:"bgColor",l:"Background"},{k:"textColor",l:"Text"},{k:"buttonBg",l:"Button"},{k:"buttonText",l:"Button Text"}].map(c=>(
                  <div key={c.k} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <input type="color" value={design[c.k]||"#000000"} onChange={e=>setDesign(d=>({...d,[c.k]:e.target.value, preset:"custom"}))} style={{ width:32, height:32, borderRadius:8, border:"1px solid #ddd", cursor:"pointer" }}/>
                    <div style={{ fontSize:11 }}><div style={{ fontWeight:700 }}>{c.l}</div><div style={{ opacity:.4, fontFamily:"'DM Mono',monospace", fontSize:10 }}>{design[c.k]}</div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Button shape */}
            <div style={{ marginBottom:16 }}><span style={label}>Button Shape</span>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:4 }}>
                {[{k:"rounded",l:"Rounded"},{k:"square",l:"Square"},{k:"pill",l:"Pill"}].map(s=>(<button key={s.k} onClick={()=>setDesign(d=>({...d,buttonShape:s.k}))} style={{ padding:"8px", borderRadius:s.k==="pill"?999:s.k==="square"?4:8, fontSize:12, fontWeight:700, border:design.buttonShape===s.k?"2px solid #000":"1px solid #ddd", background:design.buttonShape===s.k?"#000":"#fff", color:design.buttonShape===s.k?"#fff":"#666", cursor:"pointer", fontFamily:"inherit" }}>{s.l}</button>))
                }
              </div>
            </div>

            {/* Button shadow */}
            <div style={{ marginBottom:16 }}><span style={label}>Button Shadow</span>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:4 }}>
                {[{k:"none",l:"None"},{k:"soft",l:"Soft Shadow"},{k:"hard",l:"Hard Shadow"}].map(s=>(<button key={s.k} onClick={()=>setDesign(d=>({...d,buttonShadow:s.k}))} style={{ padding:"8px", borderRadius:8, fontSize:11, fontWeight:700, border:design.buttonShadow===s.k?"2px solid #000":"1px solid #ddd", background:design.buttonShadow===s.k?"#000":"#fff", color:design.buttonShadow===s.k?"#fff":"#666", cursor:"pointer", fontFamily:"inherit" }}>{s.l}</button>))
                }
              </div>
            </div>

            {/* Typography */}
            <div><span style={label}>Typography</span>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:4 }}>
                {[{k:"sans",l:"Sans"},{k:"serif",l:"Serif"},{k:"mono",l:"Mono"}].map(s=>(<button key={s.k} onClick={()=>setDesign(d=>({...d,typography:s.k}))} style={{ padding:"8px", borderRadius:8, fontSize:12, fontWeight:700, fontFamily:s.k==="serif"?"Georgia,serif":s.k==="mono"?"'DM Mono',monospace":"inherit", border:design.typography===s.k?"2px solid #000":"1px solid #ddd", background:design.typography===s.k?"#000":"#fff", color:design.typography===s.k?"#fff":"#666", cursor:"pointer" }}>{s.l}</button>))
                }
              </div>
            </div>
          </div>

          {/* Socials */}
          <div style={section}>
            <div style={{ fontSize:15, fontWeight:900, marginBottom:16 }}>Socials</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[{k:"instagram",icon:<IgIcon/>,ph:"Instagram URL"},{k:"tiktok",icon:<TtIcon/>,ph:"TikTok URL"},{k:"twitter",icon:<TwIcon/>,ph:"Twitter URL"},{k:"youtube",icon:<YtIcon/>,ph:"YouTube URL"},{k:"linkedin",icon:<LiIcon/>,ph:"LinkedIn URL"},{k:"facebook",icon:<FbIcon/>,ph:"Facebook URL"}].map(s=>(
                <div key={s.k} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8, border:"1px solid #e5e5e5", background:"#fafafa" }}>
                  <div style={{opacity:.5,flexShrink:0}}>{s.icon}</div>
                  <input value={socials[s.k]||""} onChange={e=>setSocials(prev=>({...prev,[s.k]:e.target.value}))} placeholder={s.ph} style={{ flex:1, border:"none", background:"transparent", fontSize:12, fontFamily:"inherit", fontWeight:500, color:"#000", outline:"none" }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Publish Zone */}
          <div style={{ ...section, background:"#f0fdf4", borderColor:"#bbf7d0" }}>
            <div style={{ fontSize:13, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#166534", marginBottom:12 }}>Publish Zone</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <button onClick={()=>setIsLive(!isLive)} style={{ width:44, height:24, borderRadius:999, border:"none", cursor:"pointer", background:isLive?"#22c55e":"#ddd", position:"relative", transition:"background .2s" }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:isLive?22:2, transition:"left .2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
                </button>
                <span style={{ fontSize:14, fontWeight:700, color:isLive?"#166534":"#999" }}>Live</span>
              </div>
            </div>
          </div>

          {/* Delete Page */}
          <div style={{ ...section, background:"#fef2f2", borderColor:"#fecaca" }}>
            {!showDeleteConfirm ? (
              <button onClick={()=>setShowDeleteConfirm(true)} style={{ width:"100%", padding:12, borderRadius:10, background:"transparent", border:"none", color:"#dc2626", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Delete Page</button>
            ) : (
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:13, fontWeight:600, color:"#dc2626", marginBottom:12 }}>Are you sure? This cannot be undone.</p>
                <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                  <button onClick={()=>setShowDeleteConfirm(false)} style={{ padding:"8px 20px", borderRadius:8, background:"#fff", color:"#666", border:"1px solid #ddd", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
                  <button style={{ padding:"8px 20px", borderRadius:8, background:"#dc2626", color:"#fff", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Confirm Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════ RIGHT: LIVE PHONE PREVIEW ════ */}
        {!isMobile && (
          <div style={{ background:"#e8e8ec", display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:32, position:"sticky", top:61, height:"calc(100vh - 61px)", overflow:"hidden" }}>
            <div style={{
              width:300, minHeight:560, borderRadius:40, border:"8px solid #1a1a1a",
              background:dBg, overflow:"hidden", boxShadow:"0 25px 60px rgba(0,0,0,0.3)",
              display:"flex", flexDirection:"column", position:"relative", fontFamily,
            }}>
              {/* Notch */}
              <div style={{ position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", width:72, height:20, background:"#1a1a1a", borderRadius:99, zIndex:10 }}/>

              <div style={{ padding:"48px 20px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:design.spacing==="compact"?10:design.spacing==="airy"?22:16, color:dText }}>
                {/* Avatar */}
                <div style={{ width:72, height:72, borderRadius:"50%", border:`2px solid ${dText}33`, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, background:`${dText}10` }}>
                  {profile?.photoURL ? <Image src={profile.photoURL} alt="" width="72" height="72" referrerPolicy="no-referrer" style={{objectFit:"cover"}}/> : (displayName?.[0]?.toUpperCase()||"?")}
                </div>

                {/* Name + bio */}
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:800, letterSpacing:"-0.02em" }}>{displayName||"Your Name"}</div>
                  {bio && <div style={{ fontSize:11, opacity:.6, marginTop:4, lineHeight:1.4, maxWidth:240 }}>{bio}</div>}
                </div>

                {/* Social icons */}
                {Object.values(socials).some(v=>v) && (
                  <div style={{ display:"flex", gap:10 }}>
                    {socials.instagram&&<div style={{opacity:.5}}><IgIcon/></div>}
                    {socials.tiktok&&<div style={{opacity:.5}}><TtIcon/></div>}
                    {socials.twitter&&<div style={{opacity:.5}}><TwIcon/></div>}
                    {socials.youtube&&<div style={{opacity:.5}}><YtIcon/></div>}
                    {socials.linkedin&&<div style={{opacity:.5}}><LiIcon/></div>}
                    {socials.facebook&&<div style={{opacity:.5}}><FbIcon/></div>}
                  </div>
                )}

                {/* Headers + Links preview */}
                <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:design.spacing==="compact"?6:design.spacing==="airy"?14:10 }}>
                  {headers.map(h => (
                    <div key={h.id} style={{ fontSize:12, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.08em", opacity:.5, padding:"8px 0 2px" }}>{h.text}</div>
                  ))}
                  {links.filter(l=>l.active).map(link => (
                    <div key={link.id} style={{
                      padding:"12px 16px", borderRadius:btnRadius,
                      background:dBtn, color:dBtnText,
                      fontSize:13, fontWeight:700, textAlign:"center",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                      boxShadow:btnShadow,
                    }}>
                      {link.icon&&<span>{link.icon}</span>}
                      {link.title}
                    </div>
                  ))}
                  {links.filter(l=>l.active).length===0 && headers.length===0 && (
                    <div style={{ textAlign:"center", fontSize:12, opacity:.3, padding:16 }}>No active links</div>
                  )}
                </div>

                {/* Branding */}
                <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:6, opacity:.2, fontSize:10, fontWeight:700 }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", background:dText, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:dBg }}/>
                  </div>
                  GEMM
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ position:"fixed", bottom:0, left:0, right:isMobile?"0":"380px", zIndex:50, background:"#fff", borderTop:"1px solid #eee", padding:"12px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <button onClick={()=>router.push("/dashboard")} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:999, border:"1px solid #ddd", background:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", color:"#666" }}>← View Portal</button>
        <button onClick={handlePublish} disabled={publishing} style={{ padding:"10px 28px", borderRadius:999, background:"#000", color:"#fff", border:"none", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"inherit", opacity:publishing?.6:1 }}>
          {publishing?"Publishing...":"Publish"}
        </button>
      </div>
    </div>
  );
}
