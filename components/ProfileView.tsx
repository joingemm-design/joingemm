"use client";

// components/ProfileView.tsx
// Renders public profile page for /username routes

import { useState, useEffect } from "react";
import { getUserByUsername, getUserLinks, UserProfile, LinkItem } from "@/lib/db";
import { getUserShops, ShopData } from "@/lib/shop";
import { getUserPortfolio, PortfolioItem } from "@/lib/portfolio";
import { getUserServices, submitQuoteRequest, Service } from "@/lib/services";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

const IgIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>);
const TtIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2 6.34 6.34 0 0 0 9.49 21.5a6.34 6.34 0 0 0 6.34-6.34V8.71a8.35 8.35 0 0 0 4.76 1.49V6.75a4.84 4.84 0 0 1-1-.06z"/></svg>);
const TwIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);
const YtIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/></svg>);
const LiIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>);
const FbIcon=()=>(<svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);

export default function ProfileView({ username }: { username: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [shops, setShops] = useState<ShopData[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [activeTab, setActiveTab] = useState<"links"|"shop"|"portfolio"|"about"|"press"|"services">("links");
  const [services, setServices] = useState<Service[]>([]);
  const [quoteModal, setQuoteModal] = useState<Service|null>(null);
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);
  const [pages, setPages] = useState<{about?:string, press?:any[]}>({}); 
  const [buyingProduct, setBuyingProduct] = useState<string | null>(null);
  const [emailModal, setEmailModal] = useState<{product: any, shop: any} | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [latestEvent, setLatestEvent] = useState<any>(null);
  const [colorTheme, setColorTheme] = useState("noir");

  async function handleCheckout() {
    if (!emailModal || !emailInput.includes("@")) return;
    setCheckoutLoading(true);
    setBuyingProduct(emailModal.product.id);
    try {
      const res = await fetch("https://createshopcheckout-l4kianan7a-uc.a.run.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: emailModal.product.id,
          productName: emailModal.product.name,
          productPrice: emailModal.product.price,
          shopId: emailModal.shop.id,
          creatorUid: emailModal.shop.uid,
          customerEmail: emailInput,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Error: " + (data.error || "Unknown error"));
    } catch { alert("Something went wrong. Try again."); }
    setCheckoutLoading(false);
    setBuyingProduct(null);
    setEmailModal(null);
  }

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const p = await getUserByUsername(username);
        if (!p) { setNotFound(true); setLoading(false); return; }
        setProfile(p);
        const l = await getUserLinks(p.uid);
        setLinks(l.filter(link => link.active));
        const s = await getUserShops(p.uid);
        setShops(s);
        // Fetch latest event for event banner
        try {
          const evSnap = await getDocs(query(collection(firestore, "events"), where("uid", "==", p.uid), limit(3)));
          const activeEv = evSnap.docs.map(d => ({id: d.id, ...d.data() as any})).find(e => e.active);
          if (activeEv) setLatestEvent(activeEv);
        } catch(e) { /* no event banner */ }
        const port = await getUserPortfolio(p.uid);
        setPortfolio(port);
        const svcs = await getUserServices(p.uid);
        setServices(svcs.filter(s => s.active));
        setPages({ about: p.aboutPage || "", press: p.pressItems || [] });
      } catch { setNotFound(true); }
      setLoading(false);
    })();
  }, [username]);

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#050505",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:24,height:24,borderRadius:"50%",background:"#fff",animation:"pulse 1.5s ease infinite"}}/>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );

  if (notFound || !profile) return (
    <div style={{minHeight:"100vh",background:"#050505",color:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif",gap:16,padding:24}}>
      <div style={{fontSize:48}}>🔍</div>
      <h1 style={{fontSize:24,fontWeight:900}}>Page not found</h1>
      <p style={{fontSize:15,opacity:.5}}>@{username} hasn't claimed this page yet.</p>
      <a href="/" style={{marginTop:16,padding:"12px 28px",borderRadius:999,background:"#fff",color:"#000",textDecoration:"none",fontWeight:700,fontSize:14}}>Claim yours →</a>
    </div>
  );

  const d = profile.design || {};
  const bg = d.bgColor || "#ffffff";
  const text = d.textColor || "#000000";
  const btn = d.buttonBg || "#000000";
  const btnText = d.buttonText || "#ffffff";
  const btnRadius = d.buttonShape === "square" ? 4 : d.buttonShape === "pill" ? 999 : 12;
  const btnShadow = d.buttonShadow === "hard" ? `4px 4px 0 ${text}` : d.buttonShadow === "soft" ? "0 4px 12px rgba(0,0,0,0.15)" : "none";
  const fontFamily = d.typography === "serif" ? "Georgia,serif" : d.typography === "mono" ? "'DM Mono',monospace" : "'DM Sans',sans-serif";
  const spacing = d.spacing === "compact" ? 8 : d.spacing === "airy" ? 20 : 12;
  const socials = profile.socials || {};
  const initials = profile.displayName?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) || "?";


  // LANDING PAGE LAYOUT
  if ((profile as any).profileStyle === "landing") {
    const bg = (profile as any).colorBg || "#ffffff";
    const text = (profile as any).colorText || "#000000";
    const btn = (profile as any).colorBtn || "#000000";
    const btnText = (profile as any).colorBtnText || "#ffffff";
    const fontFamily = (profile as any).fontFamily || "'DM Sans',sans-serif";
    const isBrock = profile.uid === "9ppSAQTMFchFf8JrACZg0S3OFXj1";
    const PRESETS: Record<string,{bg:string,text:string,btn:string,btnText:string}> = {
      clean:{bg:"#ffffff",text:"#000000",btn:"#000000",btnText:"#ffffff"},
      midnight:{bg:"#09090b",text:"#f4f4f5",btn:"#ffffff",btnText:"#000000"},
      slate:{bg:"#1e293b",text:"#e2e8f0",btn:"#e2e8f0",btnText:"#1e293b"},
      charcoal:{bg:"#27272a",text:"#e4e4e7",btn:"#e4e4e7",btnText:"#27272a"},
      cream:{bg:"#fefce8",text:"#422006",btn:"#422006",btnText:"#fefce8"},
      lemon:{bg:"#fef9c3",text:"#713f12",btn:"#713f12",btnText:"#fef9c3"},
      grape:{bg:"#2e1065",text:"#e9d5ff",btn:"#a855f7",btnText:"#ffffff"},
      cherry:{bg:"#ef4444",text:"#ffffff",btn:"#ffffff",btnText:"#ef4444"},
      noir:{bg:"#000000",text:"#ffffff",btn:"#ffffff",btnText:"#000000"},
      ink:{bg:"#0f172a",text:"#cbd5e1",btn:"#38bdf8",btnText:"#0f172a"},
      forest:{bg:"#022c22",text:"#ecfdf5",btn:"#34d399",btnText:"#022c22"},
      emerald:{bg:"#064e3b",text:"#d1fae5",btn:"#10b981",btnText:"#ffffff"},
      ocean:{bg:"#082f49",text:"#e0f2fe",btn:"#38bdf8",btnText:"#082f49"},
      navy:{bg:"#1e1b4b",text:"#e0e7ff",btn:"#818cf8",btnText:"#1e1b4b"},
      teal:{bg:"#134e4a",text:"#ccfbf1",btn:"#2dd4bf",btnText:"#134e4a"},
      mint:{bg:"#f0fdf4",text:"#14532d",btn:"#22c55e",btnText:"#ffffff"},
      sage:{bg:"#dcfce7",text:"#166534",btn:"#166534",btnText:"#dcfce7"},
      lavender:{bg:"#f5f3ff",text:"#4c1d95",btn:"#7c3aed",btnText:"#ffffff"},
      blush:{bg:"#fdf2f8",text:"#831843",btn:"#ec4899",btnText:"#ffffff"},
      rose:{bg:"#fff1f2",text:"#881337",btn:"#fb7185",btnText:"#ffffff"},
      sand:{bg:"#fdfbf7",text:"#451a03",btn:"#d97706",btnText:"#ffffff"},
      sky:{bg:"#e0f2fe",text:"#0c4a6e",btn:"#0284c7",btnText:"#ffffff"},
      dracula:{bg:"#282a36",text:"#f8f8f2",btn:"#bd93f9",btnText:"#282a36"},
      cyber:{bg:"#09090b",text:"#00f0ff",btn:"#ff0099",btnText:"#ffffff"},
      velvet:{bg:"#4a044e",text:"#fae8ff",btn:"#e879f9",btnText:"#4a044e"},
    };
    const activePreset = PRESETS[colorTheme] || PRESETS["noir"];
    const activeBg = activePreset.bg; const activeText = activePreset.text; const activeBtn = activePreset.btn; const activeBtnText = activePreset.btnText;
    return (
      <>
      {latestEvent && (()=>{
        const now = new Date(); now.setHours(0,0,0,0);
        const eventDateStr = latestEvent.startDate || latestEvent.date;
        if (eventDateStr) {
          const [y,m,d] = eventDateStr.split("-").map(Number);
          if (new Date(y,m-1,d) < now) return null;
          const diff = Math.ceil((new Date(y,m-1,d).getTime()-now.getTime())/(864e5));
          const label = diff===0?"Today":diff===1?"Tomorrow":diff<=7?"In "+diff+" days":new Date(y,m-1,d).toLocaleDateString("en-US",{month:"short",day:"numeric"});
          return <a href={"/event/"+latestEvent.id} style={{display:"block",background:"#000",color:"#fff",textAlign:"center",padding:"10px 20px",fontSize:13,fontWeight:700,textDecoration:"none",letterSpacing:".04em",textTransform:"uppercase" as const}}>{"🎟 "+latestEvent.title+" — "+label+" — Get Tickets →"}</a>;
        }
        return null;
      })()}
      <div style={{minHeight:"100vh",background:activeBg,color:activeText,fontFamily}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
          *{box-sizing:border-box;margin:0;padding:0}
          @keyframes pageIn{from{opacity:0}to{opacity:1}}
          @keyframes slideUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
          @keyframes marqueeScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
          .lp-page{animation:pageIn .5s ease forwards}
          .lp-wrap{max-width:1100px;margin:0 auto;padding:0 24px}
          .lp-section{padding:80px 0}
          .lp-section-title{font-size:clamp(11px,1.2vw,13px);font-weight:800;letter-spacing:.15em;text-transform:uppercase;opacity:.4;margin-bottom:40px}
          .lp-nav{position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,.06)}
          .lp-nav a{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;padding:18px 16px;display:inline-block;opacity:.5;transition:opacity .2s}
          .lp-nav a:hover{opacity:1}
          .lp-hero{position:relative;min-height:88vh;display:flex;align-items:flex-end;overflow:hidden}
          .lp-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
          .lp-hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.2) 60%,transparent 100%)}
          .lp-work-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
          @media(max-width:700px){.lp-work-grid{grid-template-columns:1fr}}
          .lp-work-item{position:relative;aspect-ratio:1;overflow:hidden;border-radius:4px;cursor:pointer}
          .lp-work-item img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
          .lp-work-item:hover img{transform:scale(1.05)}
          .lp-work-overlay{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .3s;display:flex;flex-direction:column;justify-content:flex-end;padding:20px}
          .lp-work-item:hover .lp-work-overlay{background:rgba(0,0,0,.6)}
          .lp-work-label{color:#fff;font-size:14px;font-weight:800}
          .lp-work-cta{color:#fff;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:0;transform:translateY(6px);transition:all .3s;margin-top:4px}
          .lp-work-item:hover .lp-work-cta{opacity:.7;transform:translateY(0)}
          .lp-reveal{opacity:1}
          .lp-svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
          @media(max-width:700px){.lp-svc-grid{grid-template-columns:1fr 1fr}}
        `}</style>

        {/* Hero */}
        <div className="lp-hero">
          {(profile as any).heroBanner
            ? <img src={(profile as any).heroBanner} className="lp-hero-bg" alt="" style={{filter:"brightness(.7)"}}/>
            : profile.photoURL
              ? <img src={profile.photoURL} referrerPolicy="no-referrer" className="lp-hero-bg" alt="" style={{filter:"brightness(.4)"}}/>
              : <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,"+btn+","+btn+"44)"}}/>}
          <div className="lp-hero-overlay"/>
          <div style={{position:"relative",zIndex:2,padding:"0 0 60px",width:"100%"}}>
            <div className="lp-wrap">

              <h1 style={{fontSize:"clamp(56px,12vw,160px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.88,color:"#fff",marginBottom:24,textTransform:"uppercase" as const}}>{profile.displayName}</h1>
              {profile.bio&&<p style={{fontSize:16,color:"#fff",opacity:.7,maxWidth:480,lineHeight:1.6,marginBottom:28}}>{profile.bio}</p>}
              <a href="#contact" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 28px",background:btn,color:btnText,borderRadius:4,fontWeight:800,fontSize:13,textDecoration:"none",letterSpacing:".08em",textTransform:"uppercase" as const}}>Work With Me</a>
            </div>
          </div>
        </div>

        {/* Marquee - below hero */}
        {(profile as any).marqueeText&&(
          <div style={{overflow:"hidden",padding:"10px 0",background:btn,color:btnText}}>
            <div style={{display:"flex",animation:"marqueeScroll 20s linear infinite",whiteSpace:"nowrap"}}>
              {[1,2,3,4].map(i=><span key={i} style={{fontSize:11,fontWeight:800,letterSpacing:".15em",textTransform:"uppercase" as const,paddingRight:48}}>{(profile as any).marqueeText}</span>)}
            </div>
          </div>
        )}

        {/* Sticky Nav */}
        <div className="lp-nav" style={{background:activeBg+"ee"}}>
          <div className="lp-wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <a href={"/"+(profile as any).username} style={{fontWeight:900,fontSize:15,letterSpacing:"-.01em",color:activeText,textDecoration:"none",flexShrink:0,marginRight:24}}>
              {(profile as any).logoURL
                ? <img src={(profile as any).logoURL} alt={profile.displayName||""} style={{height:32,width:"auto",objectFit:"contain"}}/>
                : profile.displayName}
            </a>
            <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none" as any}}>
              {[["WHAT WE DO","#services"],["COLLABS","#work"],["ABOUT","#about"],["PRESS","#press"],["CONTACT","#contact"]].map(([l,h])=>(
                <a key={h} href={h} style={{color:activeText}}>{l}</a>
              ))}
            </div>
            {profile.photoURL&&<img src={profile.photoURL} referrerPolicy="no-referrer" alt="" style={{width:32,height:32,borderRadius:"50%",objectFit:"cover"}}/>}
          </div>
        </div>



        {/* Intro */}
        <div style={{borderBottom:"1px solid "+text+"10"}}>
          <div className="lp-wrap lp-section lp-reveal">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
              <div>
                <h2 style={{fontSize:"clamp(36px,6vw,72px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.92,marginBottom:24,textTransform:"uppercase" as const}}>Brush,<br/>Beats,<br/>&amp; Beyond.</h2>
              </div>
              <div>
                <p style={{fontSize:18,lineHeight:1.8,opacity:.7,marginBottom:32}}>{profile.bio}</p>
                <a href="#contact" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 32px",borderRadius:9999,background:activeBtn,color:activeBtnText,fontWeight:800,fontSize:13,textDecoration:"none",letterSpacing:".08em",textTransform:"uppercase" as const}}>Work With Me →</a>
              </div>
            </div>
            <div style={{display:"flex",gap:32,alignItems:"center",flexWrap:"wrap" as const,opacity:.2,marginTop:48}}>
              {["TECOVAS","CARDINALS","AMP","MARC JACOBS","RAC","CONVERSE"].map(b=>(
                <div key={b} style={{fontSize:11,fontWeight:800,letterSpacing:".12em"}}>{b}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Services */}
        {services.length>0&&(
          <div id="services" style={{borderBottom:"1px solid "+text+"10"}}>
            <div className="lp-wrap lp-section lp-reveal">
              <div className="lp-section-title">What We Do</div>
              <div className="lp-svc-grid">
                {services.map(svc=>(
                  <button key={svc.id} onClick={()=>setQuoteModal(svc)}
                    style={{padding:"16px 20px",borderRadius:9999,background:"#111",color:"#fff",border:"none",cursor:"pointer",textAlign:"left" as const,transition:"all .2s",display:"flex",alignItems:"center",gap:10}}
                    onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
                    onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}>
                    <div style={{fontSize:24,marginBottom:10}}>{(svc as any).icon||"🎨"}</div>
                    <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>{svc.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collabs */}
        {portfolio.length>0&&(
          <div id="work" style={{borderBottom:"1px solid "+text+"10"}}>
            <div className="lp-wrap lp-section lp-reveal">
              <div className="lp-section-title">Recent Collabs</div>
              <div className="lp-work-grid">
                {portfolio.map(item=>(
                  <div key={item.id} className="lp-work-item">
                    {item.imageURL&&<img src={item.imageURL} alt={item.title} loading="lazy"/>}
                    <div className="lp-work-overlay">
                      <div style={{fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase" as const,color:"rgba(255,255,255,.6)",marginBottom:4}}>{(item as any).category||"Collab"}</div>
                      <div className="lp-work-label">{item.title}</div>
                      <div className="lp-work-cta">View Project →</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Big name */}
        <div style={{background:"#000",overflow:"hidden",padding:"80px 0"}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:"clamp(80px,18vw,200px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.85,color:"transparent",WebkitTextStroke:"2px "+text+"30",userSelect:"none" as const,textTransform:"uppercase" as const,padding:"0 20px"}}>{profile.displayName?.split(" ")[0]||"BROCK"}</div>
            <div style={{fontSize:"clamp(80px,18vw,200px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.85,color:"transparent",WebkitTextStroke:"2px "+text+"30",userSelect:"none" as const,textTransform:"uppercase" as const,padding:"0 20px",marginTop:-20}}>{profile.displayName?.split(" ")[1]||"SEALS"}</div>
          </div>
        </div>

        {/* About */}
        <div id="about" style={{borderBottom:"1px solid "+text+"10"}}>
          <div className="lp-wrap lp-section lp-reveal">
            <div className="lp-section-title">About</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}}>
              <div>{profile.photoURL&&<img src={profile.photoURL} referrerPolicy="no-referrer" alt="" style={{width:"100%",borderRadius:4,objectFit:"cover",aspectRatio:"3/4"}}/>}</div>
              <div>
                <p style={{fontSize:18,lineHeight:1.8,opacity:.8,marginBottom:32}}>{pages.about||profile.bio}</p>
                <div style={{display:"flex",gap:12,flexWrap:"wrap" as const}}>
                  {links.slice(0,3).map(link=>(
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={{padding:"10px 20px",borderRadius:4,background:btn,color:btnText,fontSize:12,fontWeight:800,textDecoration:"none",letterSpacing:".08em",textTransform:"uppercase" as const}}>{link.title}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Press */}
        {pages.press&&pages.press.length>0&&(
          <div id="press" style={{borderBottom:"1px solid "+text+"10"}}>
            <div className="lp-wrap lp-section lp-reveal">
              <div className="lp-section-title">Press</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:24}}>
                {pages.press.map((p:any,i:number)=>(
                  <a key={i} href={p.url||"#"} target="_blank" rel="noopener noreferrer"
                    style={{padding:32,borderRadius:4,border:"1px solid "+text+"12",textDecoration:"none",color:text,display:"block",transition:"transform .2s"}}
                    onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
                    onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}>
                    <div style={{fontSize:11,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase" as const,opacity:.4,marginBottom:12}}>{p.outlet||p.source}</div>
                    <div style={{fontSize:18,fontWeight:700,lineHeight:1.4,marginBottom:8}}>{p.headline||p.title}</div>
                    {p.date&&<div style={{fontSize:12,opacity:.35,fontWeight:600}}>{p.date}</div>}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        <div id="contact" style={{borderBottom:"1px solid "+text+"10"}}>
          <div className="lp-wrap lp-section lp-reveal">
            <div className="lp-section-title">Get In Touch</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64}}>
              <div>
                <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:900,letterSpacing:"-.02em",lineHeight:1.1,marginBottom:16}}>Let's create something legendary.</h2>
                <p style={{fontSize:15,opacity:.5,lineHeight:1.7}}>Fill out the form and I'll get back to you within 48 hours.</p>
              </div>
              <div>
                {quoteSent?(
                  <div style={{padding:40,textAlign:"center"}}><div style={{fontSize:32,marginBottom:12}}>✅</div><div style={{fontWeight:800,fontSize:18,marginBottom:8}}>Message sent!</div><div style={{opacity:.5,fontSize:14}}>I'll be in touch soon.</div></div>
                ):(
                  <div style={{display:"flex",flexDirection:"column" as const,gap:12}}>
                    <input value={quoteName} onChange={e=>setQuoteName(e.target.value)} placeholder="Your name" style={{padding:"14px 16px",borderRadius:4,border:"1px solid "+text+"20",background:"transparent",color:text,fontSize:14,fontFamily}}/>
                    <input value={quoteEmail} onChange={e=>setQuoteEmail(e.target.value)} placeholder="Your email" style={{padding:"14px 16px",borderRadius:4,border:"1px solid "+text+"20",background:"transparent",color:text,fontSize:14,fontFamily}}/>
                    <textarea value={quoteMessage} onChange={e=>setQuoteMessage(e.target.value)} placeholder="Tell me about your project..." rows={4} style={{padding:"14px 16px",borderRadius:4,border:"1px solid "+text+"20",background:"transparent",color:text,fontSize:14,fontFamily,resize:"vertical" as const}}/>
                    <button onClick={async()=>{
                      if(!quoteName.trim()||!quoteEmail.includes("@")||!quoteMessage.trim())return;
                      setQuoteSubmitting(true);
                      try{
                        const {addDoc,collection:col,serverTimestamp}=await import("firebase/firestore");
                        const {firestore:db}=await import("@/lib/firebase");
                        await addDoc(col(db,"inquiries"),{creatorId:profile.uid,name:quoteName,email:quoteEmail,message:quoteMessage,createdAt:serverTimestamp(),read:false});
                        setQuoteSent(true);
                      }catch(e){console.error(e);}
                      setQuoteSubmitting(false);
                    }} style={{padding:"16px",borderRadius:4,background:btn,color:btnText,fontWeight:800,fontSize:14,border:"none",cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase" as const}}>
                      {quoteSubmitting?"Sending...":"Send Message"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{padding:"40px 0",borderTop:"1px solid "+text+"10"}}>
          <div className="lp-wrap" style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap" as const,gap:16}}>
            <div style={{fontSize:13,fontWeight:800}}>{profile.displayName}</div>
            <div style={{fontSize:11,opacity:.3,fontWeight:600}}>Powered by GEMM</div>
          </div>
        </div>

        {/* Brock color theme tabs */}
        {isBrock&&(
          <div style={{position:"fixed",bottom:24,right:24,zIndex:999,background:"rgba(0,0,0,.85)",borderRadius:16,padding:"12px",backdropFilter:"blur(12px)",display:"flex",flexWrap:"wrap" as const,gap:6,maxWidth:200}}>
            {[
              {key:"clean",bg:"#ffffff"},{key:"midnight",bg:"#09090b"},{key:"slate",bg:"#1e293b"},
              {key:"charcoal",bg:"#27272a"},{key:"cream",bg:"#fefce8"},{key:"lemon",bg:"#fef9c3"},
              {key:"grape",bg:"#2e1065"},{key:"cherry",bg:"#ef4444"},{key:"noir",bg:"#000000"},
              {key:"ink",bg:"#0f172a"},{key:"forest",bg:"#022c22"},{key:"emerald",bg:"#064e3b"},
              {key:"ocean",bg:"#082f49"},{key:"navy",bg:"#1e1b4b"},{key:"teal",bg:"#134e4a"},
              {key:"mint",bg:"#f0fdf4"},{key:"sage",bg:"#dcfce7"},{key:"lavender",bg:"#f5f3ff"},
              {key:"blush",bg:"#fdf2f8"},{key:"rose",bg:"#fff1f2"},{key:"sand",bg:"#fdfbf7"},
              {key:"sky",bg:"#e0f2fe"},{key:"dracula",bg:"#282a36"},{key:"cyber",bg:"#09090b"},
              {key:"velvet",bg:"#4a044e"},
            ].map(p=>(
              <button key={p.key} onClick={()=>setColorTheme(p.key)}
                style={{width:28,height:28,borderRadius:"50%",background:p.bg,border:colorTheme===p.key?"3px solid #7c3aed":"2px solid rgba(255,255,255,.2)",cursor:"pointer",transition:"transform .15s",transform:colorTheme===p.key?"scale(1.2)":"scale(1)"}}
                title={p.key}/>
            ))}
          </div>
        )}

        {/* Scroll observer */}
        <script dangerouslySetInnerHTML={{__html:"(function(){var o=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.style.animation='slideUp .6s ease forwards';o.unobserve(e.target);}})},{threshold:0.1});document.querySelectorAll('.lp-reveal').forEach(function(el){o.observe(el);});})()"}}/>

        {/* Quote Modal */}
        {quoteModal&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setQuoteModal(null)}>
            <div style={{background:bg,color:text,borderRadius:8,padding:32,maxWidth:480,width:"100%"}} onClick={e=>e.stopPropagation()}>
              <div style={{fontWeight:900,fontSize:20,marginBottom:4}}>{quoteModal.title}</div>
              <div style={{opacity:.5,fontSize:13,marginBottom:24}}>Request a quote</div>
              {quoteSent?(
                <div style={{textAlign:"center",padding:20}}><div style={{fontSize:28,marginBottom:8}}>✅</div><div style={{fontWeight:700}}>Request sent!</div></div>
              ):(
                <div style={{display:"flex",flexDirection:"column" as const,gap:12}}>
                  <input value={quoteName} onChange={e=>setQuoteName(e.target.value)} placeholder="Your name" style={{padding:"12px 14px",borderRadius:4,border:"1px solid "+text+"20",background:"transparent",color:text,fontSize:14,fontFamily}}/>
                  <input value={quoteEmail} onChange={e=>setQuoteEmail(e.target.value)} placeholder="Email" style={{padding:"12px 14px",borderRadius:4,border:"1px solid "+text+"20",background:"transparent",color:text,fontSize:14,fontFamily}}/>
                  <textarea value={quoteMessage} onChange={e=>setQuoteMessage(e.target.value)} placeholder="Tell me about your project..." rows={3} style={{padding:"12px 14px",borderRadius:4,border:"1px solid "+text+"20",background:"transparent",color:text,fontSize:14,fontFamily,resize:"vertical" as const}}/>
                  <button onClick={async()=>{
                    if(!quoteName.trim()||!quoteEmail.includes("@")||!quoteMessage.trim())return;
                    setQuoteSubmitting(true);
                    try{
                      const {addDoc,collection:col,serverTimestamp}=await import("firebase/firestore");
                      const {firestore:db}=await import("@/lib/firebase");
                      await addDoc(col(db,"inquiries"),{creatorId:profile.uid,serviceId:quoteModal.id,serviceName:quoteModal.title,name:quoteName,email:quoteEmail,message:quoteMessage,createdAt:serverTimestamp(),read:false});
                      setQuoteSent(true);
                    }catch(e){console.error(e);}
                    setQuoteSubmitting(false);
                  }} style={{padding:"14px",borderRadius:4,background:btn,color:btnText,fontWeight:800,fontSize:13,border:"none",cursor:"pointer",letterSpacing:".04em",textTransform:"uppercase" as const}}>
                    {quoteSubmitting?"Sending...":"Send Request"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </>
    );
  }
  return (
    <>
    {latestEvent && (()=>{
      const now = new Date(); now.setHours(0,0,0,0);
      if (latestEvent.date) {
        const [y,m,d] = latestEvent.date.split("-").map(Number);
        if (new Date(y,m-1,d) < now) return null;
        const diff = Math.ceil((new Date(y,m-1,d).getTime()-now.getTime())/(864e5));
        const label = diff===0?"Today":diff===1?"Tomorrow":diff<=7?"In "+diff+" days":new Date(y,m-1,d).toLocaleDateString("en-US",{month:"short",day:"numeric"});
        return <a href={"/event/"+latestEvent.id} style={{display:"block",background:"#000",color:"#fff",textAlign:"center",padding:"10px 20px",fontSize:13,fontWeight:700,textDecoration:"none",letterSpacing:".04em",textTransform:"uppercase"}}>{"🎟 "+latestEvent.title+" — "+label+" — Get Tickets →"}</a>;
      }
      return null;
    })()}
    <div style={{minHeight:"100vh",background:bg,color:text,display:"flex",flexDirection:"column",alignItems:"center",fontFamily,padding:"60px 24px 40px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes pageIn{from{opacity:0}to{opacity:1}}@keyframes pageIn{from{opacity:0}to{opacity:1}}.link-fade{animation:fadeIn .5s ease forwards;opacity:0}.port-item{position:relative;overflow:hidden;border-radius:12px;cursor:pointer}.port-item img{transition:transform .4s ease}.port-item:hover img{transform:scale(1.05)}.port-overlay{position:absolute;inset:0;background:rgba(0,0,0,0);display:flex;flex-direction:column;justify-content:flex-end;padding:16px;transition:background .3s}.port-item:hover .port-overlay{background:rgba(0,0,0,.6)}.port-cta{color:#fff;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:0;transform:translateY(8px);transition:all .3s}.port-item:hover .port-cta{opacity:1;transform:translateY(0)}.pv-fadein{animation:pageIn .5s ease forwards}`}</style>
      <div style={{width:"100%",maxWidth:420,display:"flex",flexDirection:"column",alignItems:"center",gap:spacing*1.5}}>
        {/* Hero Banner */}
        {(profile as any).heroBanner && (
          <div style={{ width: "100%", height: 180, overflow: "hidden", marginBottom: -48 }}>
            <img src={(profile as any).heroBanner} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ height: 48, background: `linear-gradient(to bottom, transparent, ${bg})`, marginTop: -48 }} />
          </div>
        )}

        {profile.photoURL ? (
          <img src={profile.photoURL} alt="" referrerPolicy="no-referrer" style={{width:96,height:96,borderRadius:"50%",objectFit:"cover",border:`3px solid ${text}20`}}/>
        ) : (
          <div style={{width:96,height:96,borderRadius:"50%",background:`${text}10`,border:`3px solid ${text}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:900,opacity:.5}}>{initials}</div>
        )}
        <div style={{textAlign:"center"}}>
          <h1 style={{fontSize:22,fontWeight:900,letterSpacing:"-0.02em"}}>{profile.displayName}</h1>
          <p style={{fontSize:14,opacity:.5,marginTop:4}}>@{profile.username}</p>
          <a href={"https://joingemm.com/" + profile.username} target="_blank" rel="noopener noreferrer" style={{fontSize:12,fontWeight:700,color:btn,opacity:.7,marginTop:4,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4}}>
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            joingemm.com/{profile.username}
          </a>
          {profile.bio && <p style={{fontSize:15,opacity:.7,marginTop:12,maxWidth:360,lineHeight:1.5}}>{profile.bio}</p>}
          {/* Marquee */}
          {(profile as any).marqueeText && (
            <div style={{ width: "100%", overflow: "hidden", marginTop: 16, padding: "8px 0", borderTop: `1px solid ${text}10`, borderBottom: `1px solid ${text}10` }}>
              <style>{`@keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
              <div style={{ display: "flex", animation: "marqueeScroll 20s linear infinite", whiteSpace: "nowrap" }}>
                {[1,2,3,4].map(i => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: text, opacity: .5, textTransform: "uppercase", paddingRight: 48 }}>{(profile as any).marqueeText}</span>
                ))}
              </div>
            </div>
          )}
          {/* Brand Logos Strip */}
          {(profile as any).brandLogos?.length > 0 && (
            <div style={{ width: "100%", overflow: "hidden", marginTop: 16 }}>
              <div style={{ display: "flex", gap: 24, animation: "marqueeScroll 15s linear infinite", whiteSpace: "nowrap", alignItems: "center" }}>
                {[...(profile as any).brandLogos, ...(profile as any).brandLogos].map((logo: string, i: number) => (
                  <img key={i} src={logo} alt="" style={{ height: 32, width: "auto", objectFit: "contain", opacity: .6, filter: "grayscale(100%)", flexShrink: 0 }} />
                ))}
              </div>
            </div>
          )}
        </div>
        {Object.values(socials).some(v=>v) && (
          <div style={{display:"flex",gap:12}}>
            {socials.instagram && <a href={socials.instagram} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><IgIcon/></a>}
            {socials.tiktok && <a href={socials.tiktok} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><TtIcon/></a>}
            {socials.twitter && <a href={socials.twitter} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><TwIcon/></a>}
            {socials.youtube && <a href={socials.youtube} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><YtIcon/></a>}
            {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><LiIcon/></a>}
            {socials.facebook && <a href={socials.facebook} target="_blank" rel="noopener noreferrer" style={{opacity:.5,color:text}}><FbIcon/></a>}
          </div>
        )}
        {/* Tabs */}
        <div style={{width:"100%",display:"flex",gap:4,background:`${text}08`,borderRadius:12,padding:4,marginTop:8}}>
          <button onClick={()=>setActiveTab("links")} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:activeTab==="links"?btn:"transparent",color:activeTab==="links"?btnText:text,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer",fontFamily,opacity:activeTab==="links"?1:0.5,transition:"all .2s"}}>Links</button>
          {shops.some(s=>s.isPublic&&s.products?.length>0)&&<button onClick={()=>setActiveTab("shop")} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:activeTab==="shop"?btn:"transparent",color:activeTab==="shop"?btnText:text,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer",fontFamily,opacity:activeTab==="shop"?1:0.5,transition:"all .2s"}}>Shop</button>}
          {portfolio.length>0&&<button onClick={()=>setActiveTab("portfolio")} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:activeTab==="portfolio"?btn:"transparent",color:activeTab==="portfolio"?btnText:text,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer",fontFamily,opacity:activeTab==="portfolio"?1:0.5,transition:"all .2s"}}>Work</button>}
          {pages.about&&<button onClick={()=>setActiveTab("about")} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:activeTab==="about"?btn:"transparent",color:activeTab==="about"?btnText:text,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer",fontFamily,opacity:activeTab==="about"?1:0.5,transition:"all .2s"}}>About</button>}
          {services.length>0&&<button onClick={()=>setActiveTab("services")} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:activeTab==="services"?btn:"transparent",color:activeTab==="services"?btnText:text,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer",fontFamily,opacity:activeTab==="services"?1:0.5,transition:"all .2s"}}>Services</button>}
          {(pages.press?.length ?? 0)>0&&<button onClick={()=>setActiveTab("press")} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:activeTab==="press"?btn:"transparent",color:activeTab==="press"?btnText:text,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.08em",cursor:"pointer",fontFamily,opacity:activeTab==="press"?1:0.5,transition:"all .2s"}}>Press</button>}
        </div>

        {activeTab==="links"&&<div style={{width:"100%",display:"flex",flexDirection:"column",gap:spacing}}>
          {links.map((link,i) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="link-fade"
              style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 20px",borderRadius:btnRadius,background:btn,color:btnText,textDecoration:"none",fontWeight:700,fontSize:15,boxShadow:btnShadow,transition:"transform .2s",animationDelay:`${i*0.1}s`}}
              onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.transform="scale(1.02)"}
              onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.transform="scale(1)"}>
              {link.icon && <span>{link.icon}</span>}{link.title}
            </a>
          ))}
          {links.length === 0 && <div style={{textAlign:"center",padding:32,opacity:.3,fontSize:14}}>No links yet</div>}
        </div>}

        {/* Shop Tab */}
        {/* Shop Tab */}
        {activeTab==="shop" && shops.length > 0 && shops.some(s => s.products?.length > 0) && (
          <div style={{width:"100%",marginTop:24}}>
            <div style={{fontSize:11,fontWeight:800,letterSpacing:"0.15em",opacity:.4,marginBottom:16,textTransform:"uppercase"}}>Shop</div>
            {shops.map(shop => (
              shop.products?.filter(p => p.active !== false).map(product => (
                <div key={product.id} style={{display:"flex",alignItems:"center",gap:12,padding:12,borderRadius:12,background:`${text}08`,marginBottom:10,border:`1px solid ${text}12`}}>
                  <div style={{width:56,height:56,borderRadius:8,overflow:"hidden",flexShrink:0,background:`${text}10`}}>
                    {product.imageURL ? <img src={product.imageURL} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛍️</div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:14,color:text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{product.name}</div>
                    {product.description && <div style={{fontSize:12,opacity:.5,color:text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{product.description}</div>}
                    <div style={{fontSize:14,fontWeight:900,color:text,marginTop:2}}>${product.price.toFixed(2)}</div>
                  </div>
                  <button
                    disabled={buyingProduct === product.id}
                    onClick={() => { setEmailModal({ product, shop }); setEmailInput(""); }}
                    style={{flexShrink:0,padding:"8px 16px",borderRadius:8,border:"none",background:btn,color:btnText,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit",opacity:buyingProduct===product.id?0.6:1}}
                  >
                    {buyingProduct === product.id ? "..." : "Buy"}
                  </button>
                </div>
              ))
            ))}
          </div>
        )}

        {/* Email Modal */}
        {emailModal && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24}} onClick={()=>setEmailModal(null)}>
            <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:380,boxShadow:"0 24px 64px rgba(0,0,0,0.3)"}} onClick={e=>e.stopPropagation()}>
              <div style={{fontSize:18,fontWeight:900,color:"#000",marginBottom:4}}>{emailModal.product.name}</div>
              <div style={{fontSize:22,fontWeight:900,color:"#000",marginBottom:20}}>${emailModal.product.price.toFixed(2)}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#666",marginBottom:8}}>Your email</div>
              <input
                type="email"
                value={emailInput}
                onChange={e=>setEmailInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter") handleCheckout(); }}
                placeholder="you@example.com"
                autoFocus
                style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid #ddd",fontSize:15,fontFamily:"inherit",fontWeight:500,color:"#000",outline:"none",marginBottom:16,boxSizing:"border-box"}}
              />
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || !emailInput.includes("@")}
                style={{width:"100%",padding:"14px",borderRadius:12,background:"#000",color:"#fff",border:"none",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:checkoutLoading||!emailInput.includes("@")?0.5:1}}
              >
                {checkoutLoading ? "Redirecting..." : "Continue to Payment →"}
              </button>
              <button onClick={()=>setEmailModal(null)} style={{width:"100%",marginTop:10,padding:"10px",borderRadius:12,background:"transparent",color:"#999",border:"none",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab==="services" && services.length>0 && (
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:12}}>
            {services.map(service=>(
              <div key={service.id} style={{padding:16,borderRadius:12,border:`1px solid ${text}12`,background:`${text}05`}}>
                <div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",opacity:.4,marginBottom:4}}>{service.category}</div>
                <div style={{fontSize:16,fontWeight:800,color:text,marginBottom:4}}>{service.title}</div>
                {service.description && <div style={{fontSize:13,opacity:.6,color:text,lineHeight:1.5,marginBottom:10}}>{service.description}</div>}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:14,fontWeight:900,color:btn}}>{service.priceLabel}</div>
                  <button onClick={()=>{setQuoteModal(service);setQuoteName("");setQuoteEmail("");setQuoteMessage("");setQuoteSent(false);}} style={{padding:"8px 16px",borderRadius:8,background:btn,color:btnText,border:"none",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily}}>Request Quote</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quote Modal */}
        {quoteModal && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:24}} onClick={()=>setQuoteModal(null)}>
            <div style={{background:"#fff",borderRadius:20,padding:28,width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,0.3)"}} onClick={e=>e.stopPropagation()}>
              {quoteSent ? (
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  <div style={{fontSize:48,marginBottom:12}}>✅</div>
                  <div style={{fontSize:20,fontWeight:900,color:"#000",marginBottom:8}}>Request Sent!</div>
                  <div style={{fontSize:14,opacity:.5,marginBottom:20}}>We'll be in touch soon.</div>
                  <button onClick={()=>setQuoteModal(null)} style={{padding:"10px 24px",borderRadius:999,background:"#000",color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Done</button>
                </div>
              ) : (
                <>
                  <div style={{fontSize:18,fontWeight:900,color:"#000",marginBottom:4}}>{quoteModal.title}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#6366f1",marginBottom:20}}>{quoteModal.priceLabel}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:16}}>
                    <input value={quoteName} onChange={e=>setQuoteName(e.target.value)} placeholder="Your name" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:14,fontFamily:"inherit"}}/>
                    <input value={quoteEmail} onChange={e=>setQuoteEmail(e.target.value)} placeholder="Your email" type="email" style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:14,fontFamily:"inherit"}}/>
                    <textarea value={quoteMessage} onChange={e=>setQuoteMessage(e.target.value)} placeholder="Tell us about your project..." rows={4} style={{width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #ddd",fontSize:14,fontFamily:"inherit",resize:"none"}}/>
                  </div>
                  <button onClick={async()=>{
                    if(!quoteName.trim()||!quoteEmail.trim()) return;
                    setQuoteSubmitting(true);
                    await submitQuoteRequest({serviceId:quoteModal.id,serviceTitle:quoteModal.title,creatorUid:quoteModal.uid,name:quoteName,email:quoteEmail,message:quoteMessage});
                    setQuoteSubmitting(false);setQuoteSent(true);
                  }} disabled={quoteSubmitting||!quoteName.trim()||!quoteEmail.trim()} style={{width:"100%",padding:"14px",borderRadius:12,background:"#000",color:"#fff",border:"none",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit",opacity:quoteSubmitting||!quoteName.trim()||!quoteEmail.trim()?0.5:1}}>
                    {quoteSubmitting?"Sending...":"Send Request"}
                  </button>
                  <button onClick={()=>setQuoteModal(null)} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:12,background:"transparent",color:"#999",border:"none",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab==="about" && pages.about && (
          <div style={{width:"100%",padding:"4px 0"}}>
            <p style={{fontSize:15,lineHeight:1.8,color:text,opacity:.8,whiteSpace:"pre-wrap"}}>{pages.about}</p>
          </div>
        )}

        {/* Press Tab */}
        {activeTab==="press" && pages.press && pages.press.length>0 && (
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:12}}>
            {pages.press.map((item:any,i:number)=>(
              <div key={i} style={{padding:16,borderRadius:12,border:`1px solid ${text}12`,background:`${text}05`}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",opacity:.4,marginBottom:6}}>{item.publication} {item.date && `· ${item.date}`}</div>
                <div style={{fontSize:15,fontWeight:800,color:text,marginBottom:8,lineHeight:1.3}}>{item.headline}</div>
                {item.excerpt && <div style={{fontSize:13,opacity:.6,color:text,lineHeight:1.5,marginBottom:10}}>{item.excerpt}</div>}
                {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{fontSize:13,fontWeight:700,color:btn,textDecoration:"none"}}>Read Article →</a>}
              </div>
            ))}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab==="portfolio" && portfolio.length>0 && (
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:4}}>
            {portfolio.map((item,i)=>(
              <div key={item.id} style={{position:"relative",overflow:"hidden",borderRadius:i===0?12:8}}>
                {item.link
                  ? (item as any).videoUrl ? (
                      <div>
                        <div style={{position:"relative",paddingBottom:"56.25%",height:0,overflow:"hidden",borderRadius:8}}>
                          <iframe src={(item as any).videoUrl} title={item.title} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none"}} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
                        </div>
                        <div style={{padding:"8px 4px"}}>
                          <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:`${text}60`,marginBottom:2}}>{item.category}</div>
                          <div style={{fontSize:14,fontWeight:900,color:text}}>{item.title}</div>
                        </div>
                      </div>
                    ) : (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block",position:"relative"}}>
                        <img src={item.imageURL} alt={item.title} style={{width:"100%",aspectRatio:i===0?"16/9":"4/3",objectFit:"cover",display:"block",filter:"brightness(0.85)"}}/>
                        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:16}}>
                          <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:"rgba(255,255,255,0.6)",marginBottom:4}}>{item.category}</div>
                          <div style={{fontSize:i===0?18:14,fontWeight:900,color:"#fff",letterSpacing:"-0.02em"}}>{item.title}</div>
                        </div>
                      </a>
                    )
                  : <div style={{position:"relative"}}>
                      <img src={item.imageURL} alt={item.title} style={{width:"100%",aspectRatio:i===0?"16/9":"4/3",objectFit:"cover",display:"block",filter:"brightness(0.85)"}}/>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:16}}>
                        <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:"rgba(255,255,255,0.6)",marginBottom:4}}>{item.category}</div>
                        <div style={{fontSize:i===0?18:14,fontWeight:900,color:"#fff",letterSpacing:"-0.02em"}}>{item.title}</div>
                      </div>
                    </div>
                }
              </div>
            ))}
          </div>
        )}

        <a href="https://joingemm.com" target="_blank" rel="noopener noreferrer" style={{marginTop:32,display:"flex",alignItems:"center",gap:8,opacity:.2,fontSize:12,fontWeight:700,textDecoration:"none",color:text,cursor:"pointer"}}>
          <div style={{width:16,height:16,borderRadius:"50%",background:text,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:bg}}/></div>Powered by GEMM
        </a>
      </div>
    </div>
    </>
  );
}