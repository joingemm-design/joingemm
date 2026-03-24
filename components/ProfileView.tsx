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