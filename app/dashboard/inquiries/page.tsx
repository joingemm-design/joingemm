"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from "firebase/firestore";

export default function InquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => { if (!authLoading && !user) router.push("/auth/login"); }, [user, authLoading]);
  useEffect(() => { if (user) load(); }, [user]);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(firestore,"inquiries"), where("uid","==",user.uid), orderBy("createdAt","desc")));
      setInquiries(snap.docs.map(d=>({id:d.id,...d.data()})));
    } catch {}
    setLoading(false);
  }

  async function markRead(id: string) {
    try { await updateDoc(doc(firestore,"inquiries",id),{status:"read"}); setInquiries(p=>p.map(i=>i.id===id?{...i,status:"read"}:i)); } catch {}
  }

  function open(inq: any) { setSelected(inq); if (!inq.status||inq.status==="new") markRead(inq.id); }

  function fmt(ts: any) {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
  }

  const newCount = inquiries.filter(i=>!i.status||i.status==="new").length;

  return (
    <div style={{minHeight:"100vh",background:"#050505",color:"#fff",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');*{box-sizing:border-box}
      .ir{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px 18px;cursor:pointer;transition:all .15s;display:flex;gap:14px}
      .ir:hover{border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.07)}
      .ov{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:100;display:flex;align-items:flex-end;justify-content:center}
      @media(min-width:600px){.ov{align-items:center}}
      .mo{background:#111;border:1px solid rgba(255,255,255,.12);border-radius:20px 20px 0 0;padding:28px 24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto}
      @media(min-width:600px){.mo{border-radius:20px}}`}</style>
      <div style={{borderBottom:"1px solid rgba(255,255,255,.08)",padding:"20px 24px"}}>
        <button onClick={()=>router.push("/dashboard")} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:15,padding:0,fontFamily:"inherit"}}>← Dashboard</button>
      </div>
      <div style={{maxWidth:640,margin:"0 auto",padding:"32px 20px"}}>
        <div style={{marginBottom:28,display:"flex",alignItems:"center",gap:12}}>
          <h1 style={{fontSize:28,fontWeight:900,margin:0}}>Inquiries</h1>
          {newCount>0&&<span style={{background:"#fff",color:"#000",borderRadius:999,padding:"2px 10px",fontSize:12,fontWeight:800}}>{newCount} new</span>}
        </div>
        {loading ? <div style={{textAlign:"center",padding:60,opacity:.4}}>Loading...</div>
        : inquiries.length===0 ? (
          <div style={{textAlign:"center",padding:"60px 20px",border:"1.5px dashed rgba(255,255,255,.12)",borderRadius:16}}>
            <div style={{fontSize:40,marginBottom:12}}>📬</div>
            <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>No inquiries yet</div>
            <p style={{opacity:.5,fontSize:14}}>When visitors request quotes from your Services tab, they'll appear here.</p>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {inquiries.map(inq=>{
              const isNew = !inq.status||inq.status==="new";
              return (
                <div key={inq.id} className="ir" onClick={()=>open(inq)}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:isNew?"#4ade80":"transparent",border:isNew?"none":"1.5px solid rgba(255,255,255,.2)",flexShrink:0,marginTop:5}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                      <div style={{fontWeight:isNew?800:600,fontSize:15}}>{inq.name}</div>
                      <div style={{fontSize:12,opacity:.4,flexShrink:0}}>{fmt(inq.createdAt)}</div>
                    </div>
                    <div style={{fontSize:12,opacity:.5,marginTop:2}}>{inq.serviceTitle}</div>
                    {inq.message&&<div style={{fontSize:13,opacity:.55,marginTop:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{inq.message}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {selected&&(
        <div className="ov" onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="mo">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div>
                <div style={{fontSize:11,fontWeight:800,opacity:.4,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{selected.serviceTitle}</div>
                <div style={{fontSize:22,fontWeight:900}}>{selected.name}</div>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:"none",border:"none",color:"rgba(255,255,255,.5)",fontSize:22,cursor:"pointer",padding:0}}>✕</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"14px 16px"}}>
                <div style={{fontSize:11,fontWeight:800,opacity:.4,letterSpacing:".08em",textTransform:"uppercase",marginBottom:6}}>Email</div>
                <a href={"mailto:"+selected.email} style={{color:"#60a5fa",textDecoration:"none",fontSize:15}}>{selected.email}</a>
              </div>
              {selected.message&&(
                <div style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"14px 16px"}}>
                  <div style={{fontSize:11,fontWeight:800,opacity:.4,letterSpacing:".08em",textTransform:"uppercase",marginBottom:8}}>Message</div>
                  <div style={{fontSize:15,lineHeight:1.65,opacity:.85}}>{selected.message}</div>
                </div>
              )}
              <div style={{fontSize:12,opacity:.35,textAlign:"right"}}>Received {fmt(selected.createdAt)}</div>
              <a href={"mailto:"+selected.email+"?subject=Re: "+encodeURIComponent(selected.serviceTitle)}
                style={{display:"block",textAlign:"center",background:"#fff",color:"#000",padding:"14px",borderRadius:12,fontSize:15,fontWeight:700,textDecoration:"none"}}>
                Reply via Email →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}