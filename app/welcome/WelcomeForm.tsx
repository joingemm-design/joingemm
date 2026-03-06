'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { firestore } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { debounce } from 'lodash';

// Icons
const CheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
  </svg>
);
const XCircle = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
);
const Loader = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
);

export default function WelcomeForm() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialHandle = searchParams.get('handle') || '';

  const [handle, setHandle] = useState(initialHandle);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not signed in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Debounced handle check
  const debouncedCheck = useMemo(
    () =>
      debounce(async (h: string) => {
        if (h.length > 3) {
          setIsLoading(true);
          const q = query(collection(firestore, 'users'), where('handle', '==', h));
          const querySnapshot = await getDocs(q);
          setIsAvailable(querySnapshot.empty);
          setIsLoading(false);
        } else {
          setIsAvailable(null);
        }
      }, 300),
    []
  );

  useEffect(() => {
    if (handle) {
      debouncedCheck(handle);
    }
    return () => debouncedCheck.cancel();
  }, [handle, debouncedCheck]);

  const handleHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setHandle(value);
  };

  const handleClaim = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !handle || !isAvailable) return;

    setIsSaving(true);
    try {
      await setDoc(doc(firestore, 'users', user.uid), {
        handle: handle,
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
      });
      router.push('/dashboard');
    } catch (error) {
      console.error("Error saving handle:", error);
      setIsSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
        <div style={{
            minHeight: "100vh", background: "#050505", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Sans', -apple-system, sans-serif",
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 0 20px rgba(255,255,255,0.5)" }}/>
              <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Loading...</span>
            </div>
          </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>Claim Your Handle</h1>
        <p style={{ opacity: 0.6, marginBottom: 32 }}>This is your unique username across the GEMM platform.</p>
        
        <form onSubmit={handleClaim}>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0a0a0c", padding: "16px 20px", borderRadius: 12, border: "1px solid #1a1a1e" }}>
                <span style={{ fontWeight: 700, opacity: 0.5 }}>gemm.space/</span>
                <input
                    type="text"
                    value={handle}
                    onChange={handleHandleChange}
                    placeholder="your-name"
                    style={{ background: "transparent", border: "none", outline: "none", fontWeight: 700, fontSize: 18, width: "100%", color: "#fff" }}
                />
                 <div style={{ width: 24 }}>
                    {isLoading ? <Loader /> : isAvailable === true ? <CheckCircle /> : isAvailable === false ? <XCircle /> : null}
                </div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 8, textAlign: 'left', paddingLeft: 8, height: 16 }}>
                {isLoading ? 'Checking...' : isAvailable === false ? <span style={{color: '#ef4444'}}>Handle is already taken.</span> : ''}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!isAvailable || isSaving}
            style={{
              width: "100%", padding: "16px", borderRadius: 12, fontWeight: 700, fontSize: 16,
              background: "#fff", color: "#000", border: "none", cursor: "pointer",
              opacity: (!isAvailable || isSaving) ? 0.5 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {isSaving ? 'Claiming...' : 'Claim Handle'}
          </button>
        </form>
      </div>
    </div>
  );
}
