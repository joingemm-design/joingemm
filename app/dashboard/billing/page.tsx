'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Suspense } from "react";

const CONNECT_FN = "https://createconnectaccount-l4kianan7a-uc.a.run.app";
const STATUS_FN = "https://getconnectstatus-l4kianan7a-uc.a.run.app";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

function BillingContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connectStatus, setConnectStatus] = useState<any>(null);
  const [connecting, setConnecting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    checkStatus();
    const connectResult = searchParams.get("connect");
    if (connectResult === "success") checkStatus();
  }, [user]);

  async function checkStatus() {
    if (!user) return;
    setStatusLoading(true);
    try {
      const res = await fetch(STATUS_FN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });
      const data = await res.json();
      setConnectStatus(data);
    } catch (e) { console.error(e); }
    setStatusLoading(false);
  }

  async function handleConnect() {
    if (!user) return;
    setConnecting(true);
    try {
      const res = await fetch(CONNECT_FN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, email: user.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Error: " + data.error);
    } catch (e) { alert("Connection failed. Try again."); }
    setConnecting(false);
  }

  if (loading) return <div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center" }}>Loading...</div>;

  return (
    <div style={{ minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000" }}>
      <style>{css}</style>
      <div style={{ maxWidth:800,margin:"0 auto",padding:"32px 24px 64px" }}>
        <button onClick={()=>router.push("/dashboard")} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em" }}><ArrowLeft/> Back to Dashboard</button>
        <h1 style={{ fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Billing & Payouts</h1>
        <p style={{ fontSize:15,opacity:.5,fontWeight:500,marginBottom:32 }}>Manage your subscription and connect your bank account to receive payouts.</p>

        {/* Current Plan */}
        <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16 }}>
          <div style={{ fontSize:15,fontWeight:900,marginBottom:12 }}>Current Plan</div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:16,borderRadius:12,background:"#f5f5f5" }}>
            <div>
              <div style={{ fontSize:20,fontWeight:900 }}>Spark</div>
              <div style={{ fontSize:13,opacity:.5 }}>Free forever</div>
            </div>
            <div style={{ fontSize:28,fontWeight:900 }}>$0<span style={{ fontSize:14,opacity:.5 }}>/mo</span></div>
          </div>
          <a href="/pricing" style={{ marginTop:16,width:"100%",padding:"14px",borderRadius:12,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",textDecoration:"none",textAlign:"center",display:"block" }}>Upgrade Plan →</a>
        </div>

        {/* Stripe Connect */}
        <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:16 }}>
          <div style={{ fontSize:15,fontWeight:900,marginBottom:4 }}>Stripe Payouts</div>
          <p style={{ fontSize:13,opacity:.5,marginBottom:16 }}>Connect your Stripe account to receive payouts from ticket sales. GEMM takes a 5% platform fee.</p>

          {statusLoading ? (
            <div style={{ padding:20,textAlign:"center",opacity:.4,fontSize:14 }}>Checking status...</div>
          ) : connectStatus?.connected ? (
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:12,padding:16,borderRadius:12,background:"#f0fdf4",border:"1px solid #bbf7d0",marginBottom:12 }}>
                <span style={{ fontSize:20 }}>✅</span>
                <div>
                  <div style={{ fontWeight:800,fontSize:14,color:"#15803d" }}>Stripe Connected</div>
                  <div style={{ fontSize:12,opacity:.6 }}>Payouts enabled — you'll receive funds within 2-7 business days after each sale</div>
                </div>
              </div>
              <button onClick={handleConnect} style={{ padding:"10px 20px",borderRadius:8,border:"1px solid #ddd",background:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",color:"#666" }}>
                Update Stripe Account
              </button>
            </div>
          ) : (
            <div>
              <div style={{ padding:20,borderRadius:12,border:"1px dashed #ddd",textAlign:"center",marginBottom:16 }}>
                <div style={{ fontSize:32,marginBottom:8 }}>🏦</div>
                <p style={{ fontSize:14,fontWeight:600,marginBottom:4 }}>No payout account connected</p>
                <p style={{ fontSize:13,opacity:.4,marginBottom:16 }}>Connect Stripe to start receiving payments from your ticket sales</p>
                <button onClick={handleConnect} disabled={connecting} style={{ padding:"12px 28px",borderRadius:10,border:"none",background:"#635BFF",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:connecting ? .7 : 1 }}>
                  {connecting ? "Redirecting to Stripe..." : "⚡ Connect Stripe Account"}
                </button>
              </div>
              <p style={{ fontSize:12,opacity:.4,textAlign:"center" }}>You'll be redirected to Stripe to set up your account. This usually takes 2-3 minutes.</p>
            </div>
          )}
        </div>

        {/* Payout History */}
        <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff" }}>
          <div style={{ fontSize:15,fontWeight:900,marginBottom:12 }}>Payout History</div>
          <div style={{ textAlign:"center",padding:24,opacity:.3 }}>
            <p style={{ fontSize:14 }}>No payouts yet. Start selling tickets to see your earnings here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center" }}>Loading...</div>}>
      <BillingContent />
    </Suspense>
  );
}