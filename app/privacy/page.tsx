"use client";
export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}h2{font-size:1.2rem;font-weight:800;margin:40px 0 12px}p{font-size:15px;line-height:1.8;opacity:.6;margin-bottom:12px}ul{padding-left:20px;margin-bottom:12px}ul li{font-size:15px;line-height:1.8;opacity:.6;margin-bottom:6px}strong{color:#fff}a{color:#6366f1}`}</style>
      <header style={{ padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" style={{ fontWeight: 900, fontSize: 20, color: "#fff", textDecoration: "none" }}>GEMM</a>
        <a href="/" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: 600 }}>← Go Home</a>
      </header>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 120px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", opacity: 0.4, marginBottom: 16 }}>✦ LEGAL</div>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 16 }}>Privacy Policy & Terms</h1>
        <p style={{ opacity: 0.35, fontSize: 13, marginBottom: 48 }}>Last Updated: March 11, 2026</p>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 40 }}>
          <h2>1. Acceptance of Terms</h2>
          <p>This Agreement is a binding legal contract between you ("User") and GEMM ("Company"), operating at <strong>joingemm.com</strong>. By accessing or using GEMM, you agree to be bound by these terms. If you do not agree, do not use the platform.</p>
          <h2>2. License Grant & Scalability</h2>
          <p>GEMM grants you a revocable, non-exclusive, non-transferable, limited license to access and use the platform. We reserve the right to modify, suspend, or terminate the platform or your access at our sole discretion, without notice or liability.</p>
          <h2>3. Data Discretion, Integrity & The "Flywheel"</h2>
          <p>To continuously improve GEMM and maximize our platform's scalability, we employ broad data discretion. By using GEMM, you grant us a perpetual, irrevocable, worldwide, royalty-free license to collect, aggregate, anonymize, and utilize your usage data.</p>
          <p>This data fuels our operational "flywheel" — allowing us to optimize algorithms, enhance platform integrity, and scale globally. Aggregated and anonymized data remains the sole property of GEMM for any commercial or developmental purpose.</p>
          <h2>4. Restrictions on Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>License, sell, rent, lease, assign, distribute, or commercially exploit the platform.</li>
            <li>Modify, disassemble, decrypt, reverse compile, or reverse engineer any part of the platform.</li>
            <li>Remove or obscure any proprietary notice of GEMM.</li>
            <li>Use the platform in any way that compromises our systems or security infrastructure.</li>
          </ul>
          <h2>5. Intellectual Property Rights</h2>
          <p>GEMM retains all right, title, and interest in the platform and its intellectual property. Your use does not grant ownership rights. Any feedback or ideas you provide become the exclusive property of GEMM.</p>
          <h2>6. Disclaimer of Warranties</h2>
          <p>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE," WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND. GEMM EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.</p>
          <h2>7. Limitation of Liability</h2>
          <p>TO THE FULLEST EXTENT PERMITTED BY LAW, GEMM SHALL NOT BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, INCIDENTAL, OR SPECIAL DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.</p>
          <p>Our total aggregate liability shall be limited to the amount you actually paid to GEMM in the past twelve (12) months.</p>
          <h2>8. Indemnification</h2>
          <p>You agree to indemnify and hold harmless GEMM and its officers, directors, employees, and agents from any claims, liabilities, damages, or expenses arising from your violation of this Agreement or use of the platform.</p>
          <h2>9. Modifications to this Agreement</h2>
          <p>We reserve the right to modify this Agreement at any time. If a revision is material, we will provide at least 30 days notice. Continued use after changes constitutes acceptance of the revised terms.</p>
          <h2>10. Contact Information</h2>
          <p>If you have questions about this Agreement, contact us at: <a href="mailto:hello@joingemm.com">hello@joingemm.com</a></p>
        </div>
      </main>
      <footer style={{ padding: "24px 40px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", fontSize: 12, opacity: 0.3 }}>
        © 2026 GEMM. All rights reserved.
      </footer>
    </div>
  );
}