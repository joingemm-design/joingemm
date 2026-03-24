"use client";
import { usePlan } from "@/hooks/usePlan";
import UpgradeGate from "@/components/UpgradeGate";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile, updateUserProfile } from "@/lib/db";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

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

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@400;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const label: React.CSSProperties = {fontSize:10,fontWeight:800,textTransform:"uppercase" as const,letterSpacing:"0.12em",color:"#888",marginBottom:8,display:"block"};
const section: React.CSSProperties = {padding:20,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16};

export default function BrandingPage() {
  const { user, loading } = useAuth();
  const { canUseBranding, planLoading } = usePlan();
  const router = useRouter();
  const [design, setDesign] = useState<Record<string,string>>({ preset:"clean", buttonShape:"rounded", buttonShadow:"none", typography:"sans", spacing:"normal", bgColor:"#ffffff", textColor:"#000000", buttonBg:"#000000", buttonText:"#ffffff" });
  const [saving, setSaving] = useState(false);
  const [heroBanner, setHeroBanner] = useState("");
  const [marqueeText, setMarqueeText] = useState("");
  const [brandLogos, setBrandLogos] = useState<string[]>([]);
  const [eventBannerEnabled, setEventBannerEnabled] = useState(false);
  const [profileStyle, setProfileStyle] = useState<"linktree"|"landing">("linktree");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(p => {
      if (!p) return;
      setDisplayName(p.displayName || "");
      setBio(p.bio || "");
      const d = p.design || {};
      const preset = DESIGN_PRESETS.find(pr => pr.key === (d.preset || p.theme || "clean")) || DESIGN_PRESETS[0];
      setDesign({ preset: preset.key, buttonShape: d.buttonShape||"rounded", buttonShadow: d.buttonShadow||"none", typography: d.typography||"sans", spacing: d.spacing||"normal", bgColor: d.bgColor||preset.bg, textColor: d.textColor||preset.text, buttonBg: d.buttonBg||preset.btn, buttonText: d.buttonText||preset.btnText });
      setHeroBanner((p as any).heroBanner || "");
      setMarqueeText((p as any).marqueeText || "");
      setBrandLogos((p as any).brandLogos || []);
      setEventBannerEnabled((p as any).eventBannerEnabled || false);
      setProfileStyle((p as any).profileStyle || "linktree");
    });
  }, [user]);

  async function uploadImage(file: File): Promise<string> {
    const storageRef = ref(storage, "profile-extras/" + user!.uid + "/" + Date.now() + "_" + file.name);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  async function handleHeroBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setHeroBanner(url);
    setUploading(false);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (brandLogos.length >= 8) { alert("Max 8 logos"); return; }
    setUploading(true);
    const url = await uploadImage(file);
    setBrandLogos(prev => [...prev, url]);
    setUploading(false);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    await updateUserProfile(user.uid, { design, theme: design.preset, heroBanner, marqueeText, brandLogos, eventBannerEnabled, profileStyle } as any);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  const dBg = design.bgColor || "#ffffff";
  const dText = design.textColor || "#000000";
  const dBtn = design.buttonBg || "#000000";
  const dBtnText = design.buttonText || "#ffffff";
  const btnRadius = design.buttonShape === "square" ? 4 : design.buttonShape === "pill" ? 999 : 12;
  const btnShadow = design.buttonShadow === "hard" ? `4px 4px 0 ${dText}` : design.buttonShadow === "soft" ? "0 4px 12px rgba(0,0,0,0.15)" : "none";
  const fontFamily = design.typography === "serif" ? "'Playfair Display',Georgia,serif" : design.typography === "mono" ? "'DM Mono',monospace" : "'DM Sans',sans-serif";

  return (
    <div style={{minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000"}}>
      <style>{css}</style>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",minHeight:"100vh"}}>
        <div style={{overflowY:"auto",height:"100vh"}}>
          <div style={{padding:"32px 24px 80px"}}>
            <button onClick={()=>router.push("/dashboard")} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em"}}><ArrowLeft/> Back</button>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
              <div>
                <h1 style={{fontSize:32,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4}}>Branding</h1>
                <p style={{fontSize:14,opacity:.5}}>Customize how your profile looks to the world.</p>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {saved && <span style={{fontSize:12,fontWeight:700,color:"#22c55e"}}>Saved</span>}
                <button onClick={handleSave} disabled={saving} style={{padding:"10px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:saving?0.6:1}}>{saving?"Saving...":"Save"}</button>
              </div>
            </div>

            <div style={section}>
              <span style={label}>Color Presets</span>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
                {DESIGN_PRESETS.map(p=>(
                  <button key={p.key} onClick={()=>setDesign(d=>({...d,preset:p.key,bgColor:p.bg,textColor:p.text,buttonBg:p.btn,buttonText:p.btnText}))}
                    style={{aspectRatio:"1",borderRadius:10,border:design.preset===p.key?"3px solid #7c3aed":"2px solid #e5e5e5",background:p.bg,cursor:"pointer",position:"relative",overflow:"hidden",padding:0}}>
                    <div style={{position:"absolute",bottom:0,left:0,right:0,height:"30%",background:p.btn,opacity:.7}}/>
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:p.text,opacity:.6}}>{p.key}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={section}>
              <span style={label}>Custom Colors</span>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[{k:"bgColor",l:"Background"},{k:"textColor",l:"Text"},{k:"buttonBg",l:"Button Fill"},{k:"buttonText",l:"Button Text"}].map(c=>(
                  <div key={c.k} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"1px solid #eee",background:"#fafafa"}}>
                    <input type="color" value={design[c.k]||"#000000"} onChange={e=>setDesign(d=>({...d,[c.k]:e.target.value,preset:"custom"}))} style={{width:36,height:36,borderRadius:8,border:"1px solid #ddd",cursor:"pointer",padding:2}}/>
                    <div><div style={{fontSize:12,fontWeight:700}}>{c.l}</div><div style={{fontSize:10,opacity:.4,fontFamily:"'DM Mono',monospace"}}>{design[c.k]}</div></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={section}>
              <span style={label}>Button Shape</span>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
                {[{k:"rounded",l:"Rounded"},{k:"square",l:"Square"},{k:"pill",l:"Pill"}].map(s=>(
                  <button key={s.k} onClick={()=>setDesign(d=>({...d,buttonShape:s.k}))} style={{padding:"10px",borderRadius:s.k==="pill"?999:s.k==="square"?4:8,fontSize:12,fontWeight:700,border:design.buttonShape===s.k?"2px solid #000":"1px solid #ddd",background:design.buttonShape===s.k?"#000":"#fff",color:design.buttonShape===s.k?"#fff":"#666",cursor:"pointer",fontFamily:"inherit"}}>{s.l}</button>
                ))}
              </div>
              <span style={label}>Button Shadow</span>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[{k:"none",l:"None"},{k:"soft",l:"Soft"},{k:"hard",l:"Hard"}].map(s=>(
                  <button key={s.k} onClick={()=>setDesign(d=>({...d,buttonShadow:s.k}))} style={{padding:"10px",borderRadius:8,fontSize:12,fontWeight:700,border:design.buttonShadow===s.k?"2px solid #000":"1px solid #ddd",background:design.buttonShadow===s.k?"#000":"#fff",color:design.buttonShadow===s.k?"#fff":"#666",cursor:"pointer",fontFamily:"inherit"}}>{s.l}</button>
                ))}
              </div>
            </div>

            <div style={section}>
              <span style={label}>Typography</span>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
                {[{k:"sans",l:"Sans",f:"'DM Sans',sans-serif"},{k:"serif",l:"Serif",f:"'Playfair Display',serif"},{k:"mono",l:"Mono",f:"'DM Mono',monospace"}].map(s=>(
                  <button key={s.k} onClick={()=>setDesign(d=>({...d,typography:s.k}))} style={{padding:"10px",borderRadius:8,fontSize:13,fontWeight:700,fontFamily:s.f,border:design.typography===s.k?"2px solid #000":"1px solid #ddd",background:design.typography===s.k?"#000":"#fff",color:design.typography===s.k?"#fff":"#666",cursor:"pointer"}}>{s.l}</button>
                ))}
              </div>
              <span style={label}>Spacing</span>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {["compact","normal","airy"].map(s=>(
                  <button key={s} onClick={()=>setDesign(d=>({...d,spacing:s}))} style={{padding:"10px",borderRadius:8,fontSize:12,fontWeight:700,textTransform:"capitalize",border:design.spacing===s?"2px solid #000":"1px solid #ddd",background:design.spacing===s?"#000":"#fff",color:design.spacing===s?"#fff":"#666",cursor:"pointer",fontFamily:"inherit"}}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{fontSize:11,fontWeight:800,letterSpacing:"0.15em",opacity:.4,marginBottom:16,textTransform:"uppercase" as const}}>Profile Extras</div>

            <div style={section}>
              <span style={label}>Profile Style</span>
              <div style={{display:"flex",gap:8}}>
                {(["linktree","landing"] as const).map(s=>(
                  <button key={s} onClick={()=>setProfileStyle(s)} style={{flex:1,padding:"12px 10px",borderRadius:10,border:profileStyle===s?"2px solid #7c3aed":"1.5px solid #e0e0e0",background:profileStyle===s?"#f3f0ff":"#fafafa",cursor:"pointer",fontFamily:"inherit",color:profileStyle===s?"#7c3aed":"#444",fontWeight:700,fontSize:13,textAlign:"left" as const,transition:"all .15s"}}>
                    <div>{s==="linktree" ? "Link-in-Bio" : "Landing Page"}</div>
                    <div style={{fontSize:11,color:"#999",marginTop:3,fontWeight:400}}>{s==="linktree" ? "Tabs + links" : "Full scrolling page"}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={section}>
              <span style={label}>Hero Banner</span>
              <p style={{fontSize:12,opacity:.4,marginBottom:12}}>Full-width image shown at the top of your profile.</p>
              {heroBanner && <img src={heroBanner} alt="" style={{width:"100%",height:120,objectFit:"cover",borderRadius:8,marginBottom:12}}/>}
              <div style={{display:"flex",gap:8}}>
                <label style={{padding:"8px 16px",borderRadius:999,background:"#e5e5e5",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  {uploading ? "Uploading..." : heroBanner ? "Change" : "Upload"}
                  <input type="file" accept="image/*" onChange={handleHeroBanner} style={{display:"none"}}/>
                </label>
                {heroBanner && <button onClick={()=>setHeroBanner("")} style={{padding:"8px 16px",borderRadius:999,background:"rgba(239,68,68,0.15)",color:"#f87171",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",fontFamily:"inherit"}}>Remove</button>}
              </div>
            </div>

            <div style={section}>
              <span style={label}>Marquee Text</span>
              <p style={{fontSize:12,opacity:.4,marginBottom:12}}>Scrolling text under your bio. Use bullet to separate items.</p>
              <input value={marqueeText} onChange={e=>setMarqueeText(e.target.value)} placeholder="ART • MUSIC • COMMUNITY • YOUR BRAND •" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #ddd",fontSize:13,fontFamily:"inherit",color:"#000",background:"#fff"}}/>
            </div>

            <div style={section}>
              <span style={label}>Brand and Partner Logos</span>
              <p style={{fontSize:12,opacity:.4,marginBottom:12}}>Scrolling logo strip on your profile. Max 8.</p>
              <div style={{display:"flex",flexWrap:"wrap" as const,gap:8,marginBottom:12}}>
                {brandLogos.map((logo,i)=>(
                  <div key={i} style={{position:"relative",width:56,height:56,borderRadius:8,border:"1px solid #eee",overflow:"hidden",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <img src={logo} alt="" style={{width:"100%",height:"100%",objectFit:"contain",padding:6}}/>
                    <button onClick={()=>setBrandLogos(prev=>prev.filter((_,j)=>j!==i))} style={{position:"absolute",top:1,right:1,width:16,height:16,borderRadius:3,background:"rgba(0,0,0,0.7)",border:"none",cursor:"pointer",color:"#fff",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
                  </div>
                ))}
                {brandLogos.length < 8 && (
                  <label style={{width:56,height:56,borderRadius:8,border:"2px dashed #ccc",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:20,color:"#999",background:"#fff"}}>
                    +<input type="file" accept="image/*" onChange={handleLogoUpload} style={{display:"none"}}/>
                  </label>
                )}
              </div>
            </div>

            <div style={{...section,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>Event CTA Banner</div>
                <p style={{fontSize:12,opacity:.4}}>Sticky banner linking to your latest active event.</p>
              </div>
              <button onClick={()=>setEventBannerEnabled(!eventBannerEnabled)} style={{width:44,height:24,borderRadius:999,background:eventBannerEnabled?"#000":"#ddd",border:"none",cursor:"pointer",position:"relative",flexShrink:0,transition:"background .2s"}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:eventBannerEnabled?23:3,transition:"left .2s"}}/>
              </button>
            </div>

          </div>
        </div>

        <div style={{background:"#e8e8ec",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:32,position:"sticky",top:0,height:"100vh",overflow:"hidden"}}>
          <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",opacity:.4,marginBottom:12}}>Preview</div>
          <div style={{width:260,borderRadius:40,border:"8px solid #1a1a1a",background:dBg,overflow:"hidden",boxShadow:"0 25px 60px rgba(0,0,0,0.3)",display:"flex",flexDirection:"column",fontFamily,maxHeight:"80vh"}}>
            <div style={{height:16,background:"#1a1a1a"}}/>
            <div style={{padding:"20px 16px 24px",display:"flex",flexDirection:"column",alignItems:"center",gap:12,color:dText}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:dText+"15",border:"2px solid "+dText+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900}}>{displayName?.[0]||"?"}</div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:15,fontWeight:900}}>{displayName||"Your Name"}</div>
                {bio && <div style={{fontSize:10,opacity:.5,marginTop:4,lineHeight:1.4,maxWidth:200}}>{bio.slice(0,80)}{bio.length>80?"...":""}</div>}
              </div>
              <div style={{width:"100%",display:"flex",flexDirection:"column",gap:design.spacing==="compact"?6:design.spacing==="airy"?14:10}}>
                {["My Website","Instagram","Shop"].map((l,i)=>(
                  <div key={i} style={{padding:"10px 14px",borderRadius:btnRadius,background:dBtn,color:dBtnText,fontSize:11,fontWeight:700,textAlign:"center",boxShadow:btnShadow}}>{l}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}