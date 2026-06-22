"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { user, loading, signIn, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [v, setV] = useState(false);

  useEffect(() => { setTimeout(() => setV(true), 100); }, []);

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading]);

  async function submit() {
    setError("");
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }
    if (mode === "signup" && password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setBusy(true);
    try {
      const r = mode === "signin"
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password, name || undefined);
      if (r.error) { setError(r.error); setBusy(false); }
      else if (mode === "signup") { router.push("/onboarding"); }
      else { router.push("/dashboard"); }
    } catch(e: any) {
      setError(e.message || "Something went wrong.");
      setBusy(false);
    }
  }

  async function submitReset() {
    setError("");
    if (!email.trim()) { setError("Please enter your email."); return; }
    setBusy(true);
    const r = await resetPassword(email);
    setBusy(false);
    if (r.error) { setError(r.error); } else { setResetSent(true); }
  }

  const inp = { width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", fontFamily: "inherit", fontWeight: 500, color: "#000", background: "#fff", outline: "none", boxSizing: "border-box" as const };

  if (loading) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px", padding: "48px 40px", borderRadius: "20px", background: "#fff", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(20px)", transition: "all .5s ease" }}>

        <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff" }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#000", letterSpacing: "-0.03em", margin: 0 }}>Welcome to GEMM</h1>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>{mode === "signin" ? "Log in to your account." : mode === "signup" ? "Create your GEMM account." : "Reset your password."}</p>
        </div>

        {mode === "reset" ? (
          resetSent ? (
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📬</div>
              <p style={{ fontSize: "14px", color: "#22c55e", fontWeight: 700, marginBottom: "4px" }}>Reset email sent!</p>
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>Check your inbox for a reset link.</p>
              <button onClick={() => { setMode("signin"); setResetSent(false); setError(""); }} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>Back to sign in</button>
            </div>
          ) : (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
              {error && <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: 600 }}>{error}</p>}
              <button onClick={submitReset} disabled={busy} style={{ width: "100%", padding: "14px", borderRadius: "10px", background: "#2563eb", color: "#fff", border: "none", fontSize: "15px", fontWeight: 800, cursor: busy ? "wait" : "pointer", fontFamily: "inherit" }}>{busy ? "Sending..." : "Send Reset Email"}</button>
              <button onClick={() => { setMode("signin"); setError(""); }} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>Back to sign in</button>
            </div>
          )
        ) : (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
            {mode === "signup" && <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={inp} />}
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} style={inp} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} style={inp} />
            {error && <p style={{ fontSize: "13px", color: "#dc2626", fontWeight: 600 }}>{error}</p>}
            <button onClick={submit} disabled={busy} style={{ width: "100%", padding: "14px", borderRadius: "10px", background: "#2563eb", color: "#fff", border: "none", fontSize: "16px", fontWeight: 800, cursor: busy ? "wait" : "pointer", fontFamily: "inherit", opacity: busy ? 0.7 : 1 }}>{busy ? "Loading..." : mode === "signin" ? "Continue" : "Sign Up"}</button>
          </div>
        )}

        {mode !== "reset" && (
          <>
            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }} style={{ background: "none", border: "none", color: "#2563eb", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: "14px" }}>{mode === "signin" ? "Sign up" : "Sign in"}</button>
            </p>
            {mode === "signin" && <button onClick={() => { setMode("reset"); setError(""); }} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontFamily: "inherit", fontSize: "13px" }}>Forgot password?</button>}
            <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
              <span style={{ fontSize: "12px", color: "#999", fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
            </div>
            <button onClick={signIn} style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: "1px solid #ddd", background: "#fff", color: "#000", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </button>
          </>
        )}

        <p style={{ fontSize: "12px", color: "#999", textAlign: "center", margin: 0 }}>
          By continuing you agree to GEMM&apos;s <a href="/privacy" style={{ color: "#2563eb" }}>Terms & Privacy</a>
        </p>
      </div>
    </div>
  );
}