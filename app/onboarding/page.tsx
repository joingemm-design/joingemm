"use client";

// app/onboarding/page.tsx
// ─────────────────────────────────────────────
// Username claim + profile setup (shown after first sign-in)
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isUsernameAvailable, isValidUsername, createUserProfile, getUserProfile } from "@/lib/db";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState<"idle"|"checking"|"available"|"taken"|"invalid"|"saving">("idle");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  // Check if user already has a profile → skip to dashboard
  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(profile => {
        if (profile?.username) router.push("/dashboard");
      });
      // Pre-fill display name
      if (user.displayName) setDisplayName(user.displayName);
    }
  }, [user, router]);

  // Debounced username check
  useEffect(() => {
    if (!username) { setStatus("idle"); return; }
    const v = isValidUsername(username);
    if (!v.valid) { setStatus("invalid"); setError(v.error || ""); return; }

    setStatus("checking");
    const timeout = setTimeout(async () => {
      const available = await isUsernameAvailable(username);
      setStatus(available ? "available" : "taken");
      setError(available ? "" : "This username is taken.");
    }, 500);
    return () => clearTimeout(timeout);
  }, [username]);

  async function handleClaim() {
    if (!user || status !== "available") return;
    setStatus("saving");
    try {
      await createUserProfile(
        user.uid,
        username.toLowerCase(),
        displayName || user.displayName || "Creator",
        user.email || "",
        user.photoURL || ""
      );
      router.push("/dashboard");
    } catch (err: any) {
      setError("Failed to claim username. Try again.");
      setStatus("available");
    }
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight:"100vh",background:"#050505",display:"flex",alignItems:"center",justifyContent:"center" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:#050505;font-family:'DM Sans',sans-serif}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
        <div style={{ width:24,height:24,borderRadius:"50%",background:"#fff",animation:"pulse 1.5s ease infinite" }}/>
      </div>
    );
  }

  const statusColor = status === "available" ? "#22c55e" : status === "taken" || status === "invalid" ? "#ef4444" : status === "checking" ? "#f59e0b" : "transparent";

  return (
    <div style={{ minHeight:"100vh",background:"#050505",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",padding:24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{background:#050505;font-family:'DM Sans',sans-serif;color:#fff}
        ::selection{background:#a855f7;color:#fff}
        input:focus{outline:none;box-shadow:0 0 0 2px rgba(255,255,255,0.2)!important}
        input::placeholder{color:rgba(255,255,255,0.25)}
      `}</style>

      <div style={{
        width:"100%",maxWidth:480,padding:48,borderRadius:28,
        border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)",
        backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",gap:32,
        opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",
        transition:"all .6s ease",
      }}>
        {/* Header */}
        <div style={{ textAlign:"center" }}>
          <div style={{ display:"flex",justifyContent:"center",marginBottom:20 }}>
            <div style={{ width:56,height:56,borderRadius:"50%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ width:18,height:18,borderRadius:"50%",background:"#fff" }}/>
            </div>
          </div>
          <h1 style={{ fontSize:28,fontWeight:900,letterSpacing:"-0.03em",marginBottom:8 }}>Claim your link</h1>
          <p style={{ fontSize:15,color:"rgba(255,255,255,0.45)",fontWeight:500 }}>Choose a unique username for your GEMM page.</p>
        </div>

        {/* Username input */}
        <div>
          <label style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",opacity:.5,marginBottom:8,display:"block" }}>Username</label>
          <div style={{ display:"flex",alignItems:"center",border:"1px solid rgba(255,255,255,0.12)",borderRadius:14,background:"rgba(255,255,255,0.05)",overflow:"hidden",transition:"border-color .3s",borderColor:status==="available"?"rgba(34,197,94,0.4)":status==="taken"||status==="invalid"?"rgba(239,68,68,0.4)":"rgba(255,255,255,0.12)" }}>
            <span style={{ padding:"0 0 0 16px",fontSize:15,fontWeight:700,opacity:.3,whiteSpace:"nowrap",fontFamily:"'DM Mono',monospace" }}>gemm.live/</span>
            <input
              value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="yourname"
              maxLength={20}
              style={{ flex:1,border:"none",background:"transparent",color:"#fff",fontSize:15,fontWeight:700,padding:"16px 16px 16px 4px",fontFamily:"'DM Mono',monospace" }}
            />
            {status !== "idle" && (
              <div style={{ padding:"0 16px",display:"flex",alignItems:"center" }}>
                {status === "checking" && <div style={{ width:16,height:16,borderRadius:"50%",border:"2px solid #f59e0b",borderTopColor:"transparent",animation:"spin .6s linear infinite" }}/>}
                {status === "available" && <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>}
                {(status === "taken" || status === "invalid") && <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>}
              </div>
            )}
          </div>
          {error && <p style={{ fontSize:12,color:"#ef4444",fontWeight:600,marginTop:8 }}>{error}</p>}
          {status === "available" && <p style={{ fontSize:12,color:"#22c55e",fontWeight:600,marginTop:8 }}>Username is available!</p>}
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>

        {/* Display name */}
        <div>
          <label style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",opacity:.5,marginBottom:8,display:"block" }}>Display Name</label>
          <input
            value={displayName} onChange={e => setDisplayName(e.target.value)}
            placeholder="Your Name"
            style={{ width:"100%",border:"1px solid rgba(255,255,255,0.12)",borderRadius:14,background:"rgba(255,255,255,0.05)",color:"#fff",fontSize:15,fontWeight:600,padding:"16px",fontFamily:"inherit" }}
          />
        </div>

        {/* Claim button */}
        <button
          onClick={handleClaim}
          disabled={status !== "available" || !displayName.trim()}
          style={{
            width:"100%",padding:"18px",borderRadius:14,
            background: status === "available" && displayName.trim() ? "#fff" : "rgba(255,255,255,0.1)",
            color: status === "available" && displayName.trim() ? "#000" : "rgba(255,255,255,0.3)",
            border:"none",fontSize:16,fontWeight:800,cursor: status === "available" && displayName.trim() ? "pointer" : "not-allowed",
            fontFamily:"inherit",transition:"all .3s",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          }}
        >
          {status === "saving" ? "Claiming..." : "Claim gemm.live/" + (username || "...")}
          {status !== "saving" && <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>}
        </button>

        <button onClick={() => router.push("/dashboard")} style={{
          background:"none", border:"none", color:"rgba(255,255,255,0.3)",
          fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
          padding:"8px 16px", transition:"color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
          Skip for now →
        </button>
      </div>
    </div>
  );
}
