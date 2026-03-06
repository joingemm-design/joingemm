'use client';

// app/dashboard/help/page.tsx — Help & Support

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const css = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;background:#f8f8f8}input:focus,textarea:focus{outline:none;border-color:#7c3aed!important}`;
const ArrowLeft=()=>(<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

const faqs = [
  { q: "How do I create a Link-in-Bio page?", a: "Go to your Dashboard → Click 'Link-in-Bio' → Add your links, customize the design, and click Publish." },
  { q: "How do I create an event?", a: "Go to Dashboard → 'Publish Event' → Fill in your event details, add tickets, and click Save Changes." },
  { q: "How do I set up a shop?", a: "Go to Dashboard → 'Publish Shop' → Add your shop title, products, and customize the design." },
  { q: "Is GEMM free?", a: "Yes! The Spark plan is free forever and includes unlimited event publishing, 1 Link-in-Bio page, and 1 dynamic QR code." },
  { q: "How do I upgrade my plan?", a: "Go to Dashboard → 'Billing & Payouts' → Click 'Upgrade Plan' to see available options." },
  { q: "Can I use a custom domain?", a: "Custom domains are coming soon. For now, your page is available at gemm.live/yourusername." },
];

export default function HelpPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  const inp: React.CSSProperties = { width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid #e0e0e0",fontSize:14,fontFamily:"inherit",fontWeight:500,color:"#000",background:"#fff" };

  function handleSend() {
    if (!name.trim() || !message.trim()) return;
    // In production, this would send to a backend/email service
    setSent(true);
  }

  return (
    <div style={{ minHeight:"100vh",background:"#f8f8f8",fontFamily:"'DM Sans',sans-serif",color:"#000" }}>
      <style>{css}</style>
      <div style={{ maxWidth:800,margin:"0 auto",padding:"32px 24px 64px" }}>
        <button onClick={()=>router.push("/dashboard")} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"none",fontSize:12,fontWeight:700,color:"#888",cursor:"pointer",fontFamily:"inherit",marginBottom:24,textTransform:"uppercase",letterSpacing:"0.08em" }}><ArrowLeft/> Back to Dashboard</button>
        <h1 style={{ fontSize:36,fontWeight:900,letterSpacing:"-0.03em",marginBottom:4 }}>Help & Support</h1>
        <p style={{ fontSize:15,opacity:.5,fontWeight:500,marginBottom:32 }}>Get answers and reach out to our team.</p>

        {/* FAQ */}
        <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff",marginBottom:24 }}>
          <div style={{ fontSize:15,fontWeight:900,marginBottom:16 }}>Frequently Asked Questions</div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom:i<faqs.length-1?"1px solid #f0f0f0":"none" }}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{
                width:"100%",padding:"14px 0",display:"flex",justifyContent:"space-between",alignItems:"center",
                background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,color:"#000",textAlign:"left",
              }}>
                {faq.q}
                <span style={{ fontSize:18,opacity:.3,transform:openFaq===i?"rotate(180deg)":"none",transition:"transform .2s" }}>▾</span>
              </button>
              {openFaq === i && (
                <div style={{ padding:"0 0 14px",fontSize:13,opacity:.6,lineHeight:1.6 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div style={{ padding:24,borderRadius:16,border:"1px solid #eee",background:"#fff" }}>
          <div style={{ fontSize:15,fontWeight:900,marginBottom:16 }}>Contact Us</div>
          {sent ? (
            <div style={{ textAlign:"center",padding:32 }}>
              <div style={{ fontSize:32,marginBottom:8 }}>✅</div>
              <h3 style={{ fontSize:18,fontWeight:900,marginBottom:4 }}>Message sent!</h3>
              <p style={{ fontSize:14,opacity:.5 }}>We&apos;ll get back to you as soon as possible.</p>
            </div>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" style={inp}/>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" type="email" style={inp}/>
              </div>
              <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="How can we help?" rows={4} style={{...inp,resize:"vertical"}}/>
              <button onClick={handleSend} disabled={!name.trim()||!message.trim()} style={{
                padding:"14px",borderRadius:12,background:"#000",color:"#fff",border:"none",
                fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",
                opacity:(!name.trim()||!message.trim())?.5:1,
              }}>Send Message</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
