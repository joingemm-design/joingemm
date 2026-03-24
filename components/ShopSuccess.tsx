"use client";
import { useEffect, useState } from "react";

export default function ShopSuccess() {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setSessionId(p.get("session_id") || "");
  }, []);

  return (
    <div style={{minHeight:"100vh",background:"#050505",color:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:24,gap:20}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes pop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
      <div style={{fontSize:64,animation:"pop 0.5s ease forwards"}}>🎉</div>
      <h1 style={{fontSize:28,fontWeight:900,letterSpacing:"-0.03em",textAlign:"center"}}>You're all set!</h1>
      <p style={{fontSize:16,opacity:.5,textAlign:"center",maxWidth:320,lineHeight:1.6}}>Your order is confirmed. Check your email for your receipt.</p>
      <a href="/" style={{marginTop:16,padding:"14px 32px",borderRadius:999,background:"#fff",color:"#000",textDecoration:"none",fontWeight:800,fontSize:15}}>Back to GEMM →</a>
    </div>
  );
}
