"use client";
import { usePlan } from "@/hooks/usePlan";
import UpgradeGate from "@/components/UpgradeGate";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile, updateUserProfile } from "@/lib/db";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

interface PressItem { publication: string; headline: string; excerpt?: string; url?: string; date?: string; }

export default function PagesEditor() {
  const { user, loading } = useAuth();
  const { canUsePress, planLoading } = usePlan();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"about"|"press">("about");
  const [aboutText, setAboutText] = useState("");
  const [pressItems, setPressItems] = useState<PressItem[]>([]);
  const [showAddPress, setShowAddPress] = useState(false);
  const [pub, setPub] = useState(""); const [headline, setHeadline] = useState(""); const [excerpt, setExcerpt] = useState(""); const [url, setUrl] = useState(""); const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  useEffect(() => {
    if (user) getUserProfile(user.uid).then(p => {
      if (p) { setAboutText(p.aboutPage || ""); setPressItems(p.pressItems || []); }
    });
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    await updateUserProfile(user.uid, { aboutPage: aboutText, pressItems });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function addPress() {
    if (!pub.trim() || !headline.trim()) return;
    setPressItems(prev => [...prev, { publication: pub.trim(), headline: headline.trim(), excerpt: excerpt.trim(), url: url.trim(), date: date.trim() }]);
    setPub(""); setHeadline(""); setExcerpt(""); setUrl(""); setDate(""); setShowAddPress(false);
  }

  const inp: React.CSSProperties = {width:"100%",padding:"10px 12px",borderRadius:8,border:"1px solid #e0e0e0",fontSize:14,fontFamily:"inherit",fontWeight:500,color:"#000",background:"#fff"};
  const lbl: React.CSSProperties = {fontSize:10,fontWeight:800,textTransform:"uppercase" as const,letterSpacing:"0.12em",color:"#888",marginBottom:6,display:"block"};

  return (
    <div style={{minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000"}}>
      <style>{css}</style>
      <div style={{maxWidth:720,margin:"0 auto",padding:"32px 24px 80px"}}>
        <button onClick={()=>router.push("/dashboard")} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em"}}><ArrowLeft/> Back</button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div>
            <h1 style={{fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4}}>Pages</h1>
            <p style={{fontSize:15,opacity:.5,fontWeight:500}}>Add an About page and Press coverage to your profile.</p>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {saved && <span style={{fontSize:12,fontWeight:700,color:"#22c55e"}}>✓ Saved</span>}
            <button onClick={handleSave} disabled={saving} style={{padding:"12px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:saving?0.6:1}}>{saving?"Saving...":"Save"}</button>
          </div>
        </div>

        {/* Section tabs */}
        <div style={{display:"flex",gap:4,background:"#f0f0f0",borderRadius:12,padding:4,marginBottom:24}}>
          {(["about","press"] as const).map(s=>(
            <button key={s} onClick={()=>setActiveSection(s)} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:activeSection===s?"#000":"transparent",color:activeSection===s?"#fff":"#666",fontWeight:700,fontSize:13,textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>{s}</button>
          ))}
        </div>

        {/* About Section */}
        {activeSection==="about" && (
          <div style={{padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff"}}>
            <div style={{fontSize:15,fontWeight:900,marginBottom:4}}>About Page</div>
            <p style={{fontSize:13,opacity:.5,marginBottom:16}}>Tell your full story. This appears as an "About" tab on your public profile.</p>
            <textarea
              value={aboutText}
              onChange={e=>setAboutText(e.target.value)}
              placeholder={"From Marc Jacobs to Tecovas to Converse All Stars, my work is where culture, creativity, and craftsmanship collide..."}
              rows={12}
              style={{...inp,resize:"vertical",lineHeight:1.6}}
            />
            <div style={{fontSize:12,opacity:.4,marginTop:8,textAlign:"right"}}>{aboutText.length} characters</div>
          </div>
        )}

        {/* Press Section */}
        {activeSection==="press" && (
          <div>
            <div style={{padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div>
                  <div style={{fontSize:15,fontWeight:900,marginBottom:4}}>Press Coverage</div>
                  <p style={{fontSize:13,opacity:.5}}>Add articles, features, and media mentions.</p>
                </div>
                <button onClick={()=>setShowAddPress(true)} style={{padding:"8px 16px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Add</button>
              </div>

              {showAddPress && (
                <div style={{padding:16,borderRadius:12,border:"1px solid #e5e5e5",background:"#fafafa",marginBottom:16}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                    <div><span style={lbl}>Publication *</span><input value={pub} onChange={e=>setPub(e.target.value)} placeholder="e.g. Rolling Stone" style={inp}/></div>
                    <div><span style={lbl}>Date</span><input value={date} onChange={e=>setDate(e.target.value)} placeholder="e.g. March 2026" style={inp}/></div>
                  </div>
                  <div style={{marginBottom:10}}><span style={lbl}>Headline *</span><input value={headline} onChange={e=>setHeadline(e.target.value)} placeholder="Article headline..." style={inp}/></div>
                  <div style={{marginBottom:10}}><span style={lbl}>Excerpt</span><input value={excerpt} onChange={e=>setExcerpt(e.target.value)} placeholder="Brief quote or summary..." style={inp}/></div>
                  <div style={{marginBottom:12}}><span style={lbl}>Article URL</span><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." style={inp}/></div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={addPress} disabled={!pub.trim()||!headline.trim()} style={{padding:"8px 16px",borderRadius:8,background:"#000",color:"#fff",border:"none",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:!pub.trim()||!headline.trim()?0.5:1}}>Add</button>
                    <button onClick={()=>setShowAddPress(false)} style={{padding:"8px 16px",borderRadius:8,background:"#fff",color:"#666",border:"1px solid #ddd",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                  </div>
                </div>
              )}

              {pressItems.length===0 ? (
                <div style={{textAlign:"center",padding:32,border:"1px dashed #ddd",borderRadius:12}}>
                  <div style={{fontSize:32,marginBottom:8}}>📰</div>
                  <div style={{fontSize:14,opacity:.4}}>No press coverage yet. Add your first feature.</div>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {pressItems.map((item,i)=>(
                    <div key={i} style={{padding:16,borderRadius:12,border:"1px solid #e5e5e5",background:"#fff",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",opacity:.4,marginBottom:4}}>{item.publication} {item.date && `· ${item.date}`}</div>
                        <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>{item.headline}</div>
                        {item.excerpt && <div style={{fontSize:12,opacity:.5}}>{item.excerpt}</div>}
                        {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#6366f1",fontWeight:600,textDecoration:"none"}}>Read →</a>}
                      </div>
                      <button onClick={()=>setPressItems(prev=>prev.filter((_,j)=>j!==i))} style={{width:28,height:28,borderRadius:8,background:"#fee2e2",border:"none",cursor:"pointer",color:"#dc2626",fontSize:14,flexShrink:0}}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}