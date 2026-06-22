"use client";

import "./Paywall.css";

export default function Paywall({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="paywall-overlay" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <div className="paywall-card">
        <div className="paywall-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 id="paywall-title">Make payment to view features</h2>
        <p>Unlock your full event dashboard, attendee list, payouts, and CSV exports.</p>
        <button className="paywall-cta" onClick={onUnlock}>
          Unlock Access
        </button>
      </div>
    </div>
  );
}
