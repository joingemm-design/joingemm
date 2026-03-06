'use client';

// app/dashboard/media/page.tsx — Quick Media
// Fast media upload tool — upload images and get shareable URLs

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}::selection{background:#a855f7;color:#fff}button:active{transform:scale(.98)!important}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);
const UploadIcon=()=>(<svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>);
const CopyIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>);
const TrashIcon=()=>(<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/></svg>);

interface UploadedFile { name: string; url: string; size: string; type: string; uploaded: string; }

export default function QuickMediaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState<string|null>(null);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem("gemm_uploads")||"[]"); setUploads(saved); } catch {} }, []);

  function saveUploads(files: UploadedFile[]) { setUploads(files); try { localStorage.setItem("gemm_uploads", JSON.stringify(files)); } catch {} }

  async function handleFiles(files: FileList) {
    if (!user || files.length === 0) return;
    setUploading(true);
    const newUploads: UploadedFile[] = [];
    for (const file of Array.from(files)) {
      try {
        const filename = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `media/${user.uid}/${filename}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        newUploads.push({
          name: file.name, url, type: file.type,
          size: file.size > 1048576 ? `${(file.size/1048576).toFixed(1)}MB` : `${(file.size/1024).toFixed(0)}KB`,
          uploaded: new Date().toISOString(),
        });
      } catch (err) { console.error("Upload failed:", err); }
    }
    const updated = [...newUploads, ...uploads].slice(0, 50);
    saveUploads(updated);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); setDragActive(true); }
  function handleDragLeave() { setDragActive(false); }

  function copyUrl(url: string) { navigator.clipboard.writeText(url); setCopied(url); setTimeout(()=>setCopied(null), 2000); }
  function removeFile(url: string) { saveUploads(uploads.filter(u => u.url !== url)); }

  if (loading) return (<div style={{minHeight:"100vh",background:"#f8f8f8",display:"flex",alignItems:"center",justifyContent:"center"}}><style>{css}</style><div style={{width:24,height:24,borderRadius:"50%",background:"#000",animation:"pulse 1.5s ease infinite"}}/></div>);

  return (
    <div style={{ minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000" }}>
      <style>{css}</style>
      <div style={{ maxWidth:900,margin:"0 auto",padding:"32px 24px 64px" }}>
        <button onClick={()=>router.push("/dashboard")} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em" }}><ArrowLeft/> Back to Dashboard</button>
        <h1 style={{ fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Quick Media</h1>
        <p style={{ fontSize:15,opacity:.5,fontWeight:500,marginBottom:32 }}>Fast media upload tool. Drag & drop or click to upload.</p>

        {/* Upload zone */}
        <label
          onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
          style={{
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            padding:48,borderRadius:20,border:`2px dashed ${dragActive?"#7c3aed":"#ddd"}`,
            background:dragActive?"#f5f3ff":"#fff",cursor:"pointer",marginBottom:24,
            transition:"all .2s",
          }}>
          <UploadIcon/>
          <p style={{ fontSize:15,fontWeight:700,marginTop:12 }}>{uploading?"Uploading...":"Drop files here or click to upload"}</p>
          <p style={{ fontSize:12,opacity:.4,marginTop:4 }}>PNG, JPG, GIF, SVG, WEBP up to 10MB</p>
          <input type="file" accept="image/*" multiple onChange={e=>e.target.files&&handleFiles(e.target.files)} style={{ display:"none" }}/>
        </label>

        {/* Uploaded files */}
        {uploads.length > 0 && (
          <div>
            <div style={{ fontSize:13,fontWeight:800,marginBottom:12 }}>Uploaded Files ({uploads.length})</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:12 }}>
              {uploads.map((file, i) => (
                <div key={i} style={{ borderRadius:14,border:"1px solid #eee",background:"#fff",overflow:"hidden" }}>
                  <div style={{ aspectRatio:"4/3",background:"#f5f5f5",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    {file.type.startsWith("image/") ? <img src={file.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{opacity:.3}}>📄</div>}
                  </div>
                  <div style={{ padding:10 }}>
                    <div style={{ fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{file.name}</div>
                    <div style={{ fontSize:10,opacity:.4,marginTop:2 }}>{file.size}</div>
                    <div style={{ display:"flex",gap:6,marginTop:8 }}>
                      <button onClick={()=>copyUrl(file.url)} style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"6px",borderRadius:6,border:"1px solid #e5e5e5",background:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit",color:copied===file.url?"#22c55e":"#000" }}>
                        <CopyIcon/> {copied===file.url?"Copied!":"Copy URL"}
                      </button>
                      <button onClick={()=>removeFile(file.url)} style={{ padding:"6px 8px",borderRadius:6,border:"1px solid #e5e5e5",background:"#fff",cursor:"pointer",color:"#ccc" }}
                        onMouseEnter={e=>e.currentTarget.style.color="#ef4444"} onMouseLeave={e=>e.currentTarget.style.color="#ccc"}>
                        <TrashIcon/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
