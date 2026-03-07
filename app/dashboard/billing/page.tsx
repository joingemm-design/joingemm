'use client';

// app/dashboard/billing/page.tsx — Billing & Payouts

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  return (
    <div style={{ minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000" }}>
      <style>{css}</style>
      <div style={{ maxWidth:800,margin:"0 auto",padding:"32px 24px 64px" }}>
        <button onClick={()=>router.push("/dashboard")} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em" }}><ArrowLeft/> Back to Dashboard</button>
        <h1 style={{ fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Billing & Payouts</h1>
        <p style={{ fontSize:15,opacity:.5,fontWeight:500,marginBottom:32 }}>Manage billing and connect your bank account.</p>

        <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16 }}>
          <div style={{ fontSize:15,fontWeight:900,marginBottom:12 }}>Current Plan</div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:16,borderRadius:12,background:"#f5f5f5" }}>
            <div>
              <div style={{ fontSize:20,fontWeight:900 }}>Spark</div>
              <div style={{ fontSize:13,opacity:.5 }}>Free forever</div>
            </div>
            <div style={{ fontSize:28,fontWeight:900 }}>$0<span style={{ fontSize:14,opacity:.5 }}>/mo</span></div>
          </div>
          <a href="https://buy.stripe.com/test_dRm8wP1U60CHepfbmS1gs02" target="_blank" rel="noopener noreferrer" style={{ marginTop:16,width:"100%",padding:"14px",borderRadius:12,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",textDecoration:"none",textAlign:"center",display:"block" }}>Upgrade to Velocity — $10/mo</a>
        </div>

        <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16 }}>
          <div style={{ fontSize:15,fontWeight:900,marginBottom:12 }}>Payment Method</div>
          <div style={{ padding:20,borderRadius:12,border:"1px dashed #ddd",textAlign:"center" }}>
            <p style={{ fontSize:14,opacity:.4,marginBottom:12 }}>No payment method connected.</p>
            <button style={{ padding:"10px 24px",borderRadius:999,border:"1px solid #ddd",background:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Connect Stripe</button>
          </div>
        </div>

        <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff" }}>
          <div style={{ fontSize:15,fontWeight:900,marginBottom:12 }}>Payout History</div>
          <div style={{ textAlign:"center",padding:24,opacity:.3 }}>
            <p style={{ fontSize:14 }}>No payouts yet. Start selling to see your earnings here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
