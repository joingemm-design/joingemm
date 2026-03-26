"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePlan } from "@/hooks/usePlan";
import { firestore } from "@/lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from "firebase/firestore";

const LIMITS: Record<string, number> = { spark: 0, velocity: 100, empire: 500 };

type Contact = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tag?: string;
  notes?: string;
  createdAt?: any;
};

const inp = {padding:"10px 14px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:14,width:"100%",fontFamily:"inherit",background:"#fff"} as any;
const TAGS = ["Lead","Client","VIP","Collaborator","Press","Other"];
const TAG_COLORS: Record<string,string> = {Lead:"#7c3aed",Client:"#059669",VIP:"#d97706",Collaborator:"#2563eb",Press:"#db2777",Other:"#6b7280"};

export default function CRMPage() {
  const { user } = useAuth();
  const { plan, planLoading } = usePlan();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add"|"edit"|null>(null);
  const [selected, setSelected] = useState<Contact|null>(null);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [form, setForm] = useState({name:"",email:"",phone:"",tag:"Lead",notes:""});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string|null>(null);

  const limit = LIMITS[plan] ?? 0;
  const canAdd = plan !== "spark" && contacts.length < limit;

  useEffect(() => { if (user) loadContacts(); }, [user]);

  async function loadContacts() {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(collection(firestore,"contacts"), where("creatorId","==",user.uid), orderBy("createdAt","desc"));
      const snap = await getDocs(q);
      setContacts(snap.docs.map(d=>({id:d.id,...d.data()} as Contact)));
    } catch(e) { console.error(e); }
    setLoading(false);
  }

  async function saveContact() {
    if (!user || !form.name.trim() || !form.email.trim()) return;
    setSaving(true);
    try {
      if (modal === "add") {
        await addDoc(collection(firestore,"contacts"), {
          creatorId: user.uid, name: form.name.trim(), email: form.email.trim(),
          phone: form.phone.trim(), tag: form.tag, notes: form.notes.trim(), createdAt: serverTimestamp(),
        });
      } else if (modal === "edit" && selected) {
        await updateDoc(doc(firestore,"contacts",selected.id), {
          name: form.name.trim(), email: form.email.trim(),
          phone: form.phone.trim(), tag: form.tag, notes: form.notes.trim(),
        });
      }
      await loadContacts();
      setModal(null);
      setForm({name:"",email:"",phone:"",tag:"Lead",notes:""});
    } catch(e) { console.error(e); }
    setSaving(false);
  }

  async function deleteContact(id: string) {
    if (!confirm("Delete this contact?")) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(firestore,"contacts",id));
      setContacts(prev=>prev.filter(c=>c.id!==id));
    } catch(e) { console.error(e); }
    setDeleting(null);
  }

  function openEdit(c: Contact) {
    setSelected(c);
    setForm({name:c.name,email:c.email,phone:c.phone||"",tag:c.tag||"Lead",notes:c.notes||""});
    setModal("edit");
  }

  const filtered = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === "All" || c.tag === filterTag;
    return matchSearch && matchTag;
  });

  if (planLoading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:24,height:24,borderRadius:"50%",background:"#7c3aed"}}/></div>;

  return (
    <div style={{minHeight:"100vh",background:"#f9fafb",fontFamily:"'DM Sans',sans-serif",padding:"32px 20px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32,flexWrap:"wrap",gap:16}}>
          <div>
            <h1 style={{fontSize:28,fontWeight:900,letterSpacing:"-.02em",marginBottom:4}}>CRM</h1>
            <p style={{fontSize:14,color:"#6b7280"}}>
              {plan==="spark"?"Upgrade to manage contacts":contacts.length+" / "+limit+" contacts"}
            </p>
          </div>
          {plan==="spark" ? (
            <a href="/dashboard/billing" style={{padding:"10px 20px",borderRadius:9999,background:"#7c3aed",color:"#fff",fontWeight:700,fontSize:13,textDecoration:"none"}}>Upgrade to Unlock</a>
          ) : canAdd ? (
            <button onClick={()=>{setForm({name:"",email:"",phone:"",tag:"Lead",notes:""});setModal("add");}}
              style={{padding:"10px 20px",borderRadius:9999,background:"#7c3aed",color:"#fff",fontWeight:700,fontSize:13,border:"none",cursor:"pointer"}}>
              + Add Contact
            </button>
          ) : (
            <div style={{padding:"10px 20px",borderRadius:9999,background:"#f3f4f6",color:"#9ca3af",fontWeight:700,fontSize:13}}>
              Limit reached ({limit}/{limit})
            </div>
          )}
        </div>

        {/* Spark gate */}
        {plan==="spark" && (
          <div style={{background:"#fff",borderRadius:16,padding:48,textAlign:"center",border:"2px dashed #e5e7eb"}}>
            <div style={{fontSize:40,marginBottom:16}}>📇</div>
            <div style={{fontWeight:900,fontSize:20,marginBottom:8}}>CRM is a paid feature</div>
            <p style={{color:"#6b7280",fontSize:14,marginBottom:24}}>Manage up to 100 contacts on Velocity or 500 on Empire.</p>
            <a href="/dashboard/billing" style={{padding:"14px 32px",borderRadius:9999,background:"#7c3aed",color:"#fff",fontWeight:800,fontSize:14,textDecoration:"none"}}>Upgrade Now</a>
          </div>
        )}

        {plan!=="spark" && (
          <>
            <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email..."
                style={{...inp,flex:1,minWidth:200}}/>
              <select value={filterTag} onChange={e=>setFilterTag(e.target.value)} style={{...inp,width:"auto",cursor:"pointer"}}>
                <option>All</option>
                {TAGS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>

            {loading ? (
              <div style={{textAlign:"center",padding:40,color:"#9ca3af"}}>Loading...</div>
            ) : filtered.length===0 ? (
              <div style={{textAlign:"center",padding:48,background:"#fff",borderRadius:16,border:"1px solid #e5e7eb"}}>
                <div style={{fontSize:32,marginBottom:12}}>👥</div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{contacts.length===0?"No contacts yet":"No results"}</div>
                <div style={{color:"#9ca3af",fontSize:13}}>{contacts.length===0?"Add your first contact to get started":"Try a different search or filter"}</div>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {filtered.map(c=>(
                  <div key={c.id} style={{background:"#fff",borderRadius:12,padding:"16px 20px",border:"1px solid #e5e7eb",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                    <div style={{width:40,height:40,borderRadius:"50%",background:"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:16,flexShrink:0,color:"#7c3aed"}}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:800,fontSize:15,marginBottom:2}}>{c.name}</div>
                      <div style={{fontSize:13,color:"#6b7280"}}>{c.email}{c.phone?" · "+c.phone:""}</div>
                      {c.notes&&<div style={{fontSize:12,color:"#9ca3af",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.notes}</div>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{padding:"4px 12px",borderRadius:9999,background:(TAG_COLORS[c.tag||"Other"]||"#6b7280")+"15",color:TAG_COLORS[c.tag||"Other"]||"#6b7280",fontSize:11,fontWeight:700}}>{c.tag||"Other"}</span>
                      <button onClick={()=>openEdit(c)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Edit</button>
                      <button onClick={()=>deleteContact(c.id)} disabled={deleting===c.id}
                        style={{padding:"6px 12px",borderRadius:8,border:"none",background:"#fef2f2",color:"#ef4444",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                        {deleting===c.id?"...":"Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setModal(null)}>
          <div style={{background:"#fff",borderRadius:16,padding:32,maxWidth:480,width:"100%",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <h2 style={{fontWeight:900,fontSize:20,marginBottom:24}}>{modal==="add"?"Add Contact":"Edit Contact"}</h2>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><label style={{fontSize:12,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>Name *</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Full name" style={inp}/></div>
              <div><label style={{fontSize:12,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>Email *</label>
                <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="email@example.com" style={inp}/></div>
              <div><label style={{fontSize:12,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>Phone</label>
                <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+1 (555) 000-0000" style={inp}/></div>
              <div><label style={{fontSize:12,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>Tag</label>
                <select value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))} style={{...inp,cursor:"pointer"}}>
                  {TAGS.map(t=><option key={t}>{t}</option>)}
                </select></div>
              <div><label style={{fontSize:12,fontWeight:700,color:"#6b7280",display:"block",marginBottom:4}}>Notes</label>
                <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Any notes about this contact..." rows={3} style={{...inp,resize:"vertical" as const}}/></div>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button onClick={()=>setModal(null)} style={{flex:1,padding:"12px",borderRadius:9999,border:"1.5px solid #e5e7eb",background:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Cancel</button>
                <button onClick={saveContact} disabled={saving||!form.name.trim()||!form.email.trim()}
                  style={{flex:2,padding:"12px",borderRadius:9999,background:"#7c3aed",color:"#fff",fontWeight:700,fontSize:14,border:"none",cursor:"pointer"}}>
                  {saving?"Saving...":modal==="add"?"Add Contact":"Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}