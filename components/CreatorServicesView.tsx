"use client";
import { useState, useEffect } from "react";
import { getUserByUsername } from "@/lib/db";
import BrockFooter from "@/components/BrockFooter";

const BROCK_SERVICES = [
  {
    id: "sneaker-art",
    title: "Sneaker Art",
    category: "Custom Footwear",
    price: "Starting at $100",
    image: "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/PBS-Gallery.gif",
    description: "Your kicks deserve to be as bold as you are! Whether you're stepping out in a statement piece or flexing your creative side, our custom sneaker art will have heads turning.",
    details: [
      { heading: "CLIENT PROVIDES SHOES — STARTS AT $100", points: ["Babies/Toddler start at $100 | Youth start at $200 | Adult start at $300", "Custom design strategy session — let's cook up something fire!", "Hand-painted, one-of-a-kind design with top-tier paint for a finish that lasts"] },
      { heading: "INCLUDES BASE SHOE — STARTS AT $200", points: ["Babies/Toddler start at $200 | Youth start at $300 | Adult start at $400", "Fresh kicks included — we handle the sourcing!", "Custom design strategy session included", "Hand-painted, one-of-a-kind design with top-tier paint"] },
      { heading: "CLIENT REQUIREMENTS", points: ["100% non-refundable — art is forever, no take-backs!", "Shoes must be fresh and clean if you provide them — no crusty kicks!"] },
    ],
  },
  {
    id: "sports-art",
    title: "Sports Art",
    category: "Sports Themed",
    price: "Starting at $300",
    image: "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/PBS-Gallery-1.gif",
    description: "Rep your team, your city, or your all-time favorite athlete with custom sports kicks. From NFL cleats to basketball sneakers — big energy only.",
    details: [
      { heading: "CLIENT PROVIDES SHOES — STARTS AT $300", points: ["Youth start at $300 | Adult start at $400", "Custom design strategy session — to make sure your shoes are legendary", "Hand-painted, one-of-a-kind design with top-tier paint"] },
      { heading: "INCLUDES BASE SHOE — STARTS AT $400", points: ["Youth start at $400 | Adult start at $500", "Fresh kicks included — we handle the sourcing!", "If you're providing shoes, make sure they're clean — we don't do dirty plays!"] },
    ],
  },
  {
    id: "custom-art",
    title: "Custom Art",
    category: "Original Commissions",
    price: "Starting at $111",
    image: "https://palettebyseals.com/wp-content/uploads/2025/03/PBS-Gallery-Custom-Art-1.gif",
    description: "You bring the vision, we bring the artistry — on canvas, leather, and beyond. Whether it's a statement piece for your space, a hand-painted leather creation, or a unique mixed-media artwork, we craft pieces that don't just sit pretty — they speak.",
    details: [
      { heading: "WHAT'S INCLUDED", points: ["Custom design strategy session — to make sure your vision is epic!", "Hand-painted, one-of-a-kind design with top-tier paint for a finish that lasts", "Available on canvas, leather, mixed media, and more"] },
    ],
  },
  {
    id: "mural",
    title: "Mural Commission",
    category: "Large Scale",
    price: "Custom Quote",
    image: "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Copy-of-PBS-Gallery-Custom-Art.gif",
    description: "Walls looking a little… blah? Let's turn them into a masterpiece! Whether it's for your business, your community, or your personal space, we'll craft a mural that speaks volumes. Big Art = Big Energy. Let's make magic!",
    details: [
      { heading: "IDEAL FOR", points: ["Business interiors & exteriors", "Community spaces & public art", "Private residences & personal spaces"] },
      { heading: "PROCESS", points: ["Consultation & concept development", "Custom design strategy session", "Professional installation available"] },
    ],
  },
  {
    id: "speaking",
    title: "Speaking Opportunity",
    category: "Workshops & Speaking",
    price: "Custom Quote",
    image: "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/PBS-Gallery-Speaker.png",
    description: "From Marc Jacobs to Tecovas to Converse All Stars, Brock's work is where culture, creativity, and craftsmanship collide. Whether it's hands-on workshops that inspire the next generation or keynote speaking, every session is bold, expressive, and unapologetic.",
    details: [
      { heading: "AVAILABLE FOR", points: ["School & youth workshops", "Corporate creativity sessions", "Community events & panels", "Keynote speaking engagements"] },
    ],
  },
];

export default function CreatorServicesView({ username }: { username: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [extra, setExtra] = useState("");
  const [referral, setReferral] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(["sneaker-art","sports-art","custom-art","mural","speaking"]);
  const toggleExpand = (id: string) => setExpanded(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);

  useEffect(() => {
    async function load() {
      const p = await getUserByUsername(username);
      setProfile(p);
      setLoading(false);
    }
    load();
  }, [username]);

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:24,height:24,borderRadius:"50%",border:"2px solid #000",borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!profile) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>Not found</div>;

  return (
    <div style={{minHeight:"100vh",background:"#fff",color:"#000",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input,textarea,select{outline:none;font-family:'DM Sans',sans-serif}
        input::placeholder,textarea::placeholder{color:#aaa}
        @media(max-width:640px){.svc-grid{grid-template-columns:1fr!important}.svc-img{padding-right:0!important;padding-bottom:32px}}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:"1px solid #eee",padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"rgba(255,255,255,.95)",backdropFilter:"blur(12px)",zIndex:10}}>
        <a href={"/"+username} style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",color:"#000"}}>
          {profile.photoURL&&<img src={profile.photoURL} referrerPolicy="no-referrer" alt="" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover"}}/>}
          <div>
            <div style={{fontWeight:900,fontSize:15}}>{profile.displayName}</div>
            <div style={{fontSize:11,color:"#999",fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>Services</div>
          </div>
        </a>
        <a href={"/"+username} style={{fontSize:11,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"#999",textDecoration:"none"}}>← BACK</a>
      </div>

      {/* Hero */}
      <div style={{background:"#000",color:"#fff",padding:"64px 32px",textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase",opacity:.4,marginBottom:12}}>PALETTE BY SEALS</div>
        <h1 style={{fontSize:"clamp(40px,9vw,80px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.9,marginBottom:20}}>LET'S CREATE<br/>SOMETHING.</h1>
        <p style={{fontSize:15,opacity:.5,maxWidth:480,margin:"0 auto 32px",lineHeight:1.6}}>Custom sneakers, murals, original art, workshops & more — rooted in St. Louis, built for the world.</p>
        <button onClick={()=>document.getElementById("contact-form")?.scrollIntoView({behavior:"smooth"})} style={{padding:"14px 32px",borderRadius:9999,background:"#fff",color:"#000",border:"none",fontWeight:900,fontSize:13,cursor:"pointer",letterSpacing:".08em",textTransform:"uppercase"}}>Work With Me →</button>
      </div>

      {/* Services */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 24px 64px"}}>
        {BROCK_SERVICES.map((svc, i) => (
          <div key={svc.id} style={{borderTop:"1px solid #eee",padding:"64px 0"}}>
            <div className="svc-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,alignItems:"start"}}>
              {/* Image */}
              <div className="svc-img" style={{paddingRight:56}}>
                <img
                  src={svc.image}
                  alt={svc.title}
                  style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:16}}
                  onError={e=>(e.currentTarget.style.display="none")}
                />
              </div>
              {/* Details */}
              <div>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:".15em",textTransform:"uppercase",color:"#999",marginBottom:10}}>{svc.category}</div>
                <h2 style={{fontSize:"clamp(28px,4vw,48px)",fontWeight:900,letterSpacing:"-.03em",lineHeight:.95,marginBottom:16,textTransform:"uppercase"}}>{svc.title}</h2>
                <div style={{display:"inline-block",padding:"6px 16px",borderRadius:9999,background:"#000",color:"#fff",fontSize:12,fontWeight:800,letterSpacing:".08em",marginBottom:20}}>{svc.price}</div>
                {/* Collapsible toggle */}
                <button
                  onClick={()=>toggleExpand(svc.id)}
                  style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:"8px 0",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}
                >
                  <p style={{fontSize:15,lineHeight:1.6,color:"#444",textAlign:"left",margin:0}}>{svc.description}</p>
                  <span style={{fontSize:20,color:"#999",flexShrink:0,transition:"transform .25s",transform:expanded.includes(svc.id)?"rotate(180deg)":"rotate(0deg)"}}>⌄</span>
                </button>

                {/* Collapsible details */}
                {expanded.includes(svc.id) && (
                  <div style={{overflow:"hidden",marginBottom:16}}>
                    {svc.details.map((section, j) => (
                      <div key={j} style={{marginBottom:16}}>
                        <div style={{fontSize:11,fontWeight:900,letterSpacing:".1em",textTransform:"uppercase",marginBottom:8,color:"#000"}}>{section.heading}</div>
                        <ul style={{paddingLeft:20,display:"flex",flexDirection:"column",gap:6}}>
                          {section.points.map((pt, k) => (
                            <li key={k} style={{fontSize:14,lineHeight:1.6,color:"#555"}}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={()=>{setSelected(svc.title);document.getElementById("contact-form")?.scrollIntoView({behavior:"smooth"});}}
                  style={{marginTop:8,padding:"14px 28px",borderRadius:9999,background:"#000",color:"#fff",border:"none",fontSize:13,fontWeight:800,cursor:"pointer",letterSpacing:".08em",textTransform:"uppercase"}}
                >
                  GET YOURS →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div id="contact-form" style={{background:"#000",padding:"80px 24px"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>
          <div style={{fontSize:11,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",marginBottom:12}}>WORK WITH ME</div>
          <h2 style={{fontSize:"clamp(32px,6vw,56px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.95,color:"#fff",marginBottom:40}}>LET'S TALK.</h2>
          {sent ? (
            <div style={{textAlign:"center",padding:"48px 24px",background:"rgba(255,255,255,.05)",borderRadius:20,border:"1px solid rgba(255,255,255,.1)"}}>
              <div style={{fontSize:48,marginBottom:12}}>✅</div>
              <div style={{fontWeight:900,fontSize:22,color:"#fff",marginBottom:8}}>Message Sent!</div>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:14}}>I'll be in touch soon.</div>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>First Name <span style={{color:"#E8263A"}}>*</span></label>
                  <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Please provide your first name" style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14}}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>Last Name <span style={{color:"#E8263A"}}>*</span></label>
                  <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Please provide your last name" style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14}}/>
                </div>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>Email <span style={{color:"#E8263A"}}>*</span></label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Please provide your email address" type="email" style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>Phone <span style={{color:"#E8263A"}}>*</span></label>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="" type="tel" style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14}}/>
              </div>

              <div style={{borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:24,marginTop:8}}>
                <div style={{fontSize:20,fontWeight:900,color:"#fff",marginBottom:20}}>Tell us about your vision!</div>
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>What can we help you create? <span style={{color:"#E8263A"}}>*</span></label>
                  <select value={selected} onChange={e=>setSelected(e.target.value)} style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:selected?"#fff":"rgba(255,255,255,.4)",fontSize:14,cursor:"pointer",appearance:"none",WebkitAppearance:"none"}}>
                    <option value="" disabled style={{background:"#111"}}>Select</option>
                    {BROCK_SERVICES.map(s=>(<option key={s.id} value={s.title} style={{background:"#111"}}>{s.title}</option>))}
                    <option value="Other" style={{background:"#111"}}>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>Ideal Deadline <span style={{color:"#E8263A"}}>*</span></label>
                <input value={deadline} onChange={e=>setDeadline(e.target.value)} type="date" style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14,colorScheme:"dark"}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>Budget <span style={{color:"#E8263A"}}>*</span></label>
                <input value={budget} onChange={e=>setBudget(e.target.value)} placeholder="" style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>Scope of Work | Please be detailed describing your creative Brock Seals request. <span style={{color:"#E8263A"}}>*</span></label>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={4} style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14,resize:"none"}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>Anything else we should know?</label>
                <textarea value={extra} onChange={e=>setExtra(e.target.value)} rows={3} style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14,resize:"none"}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.6)",marginBottom:6}}>How did you learn about Brock Seals? <span style={{color:"#E8263A"}}>*</span></label>
                <input value={referral} onChange={e=>setReferral(e.target.value)} style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.07)",color:"#fff",fontSize:14}}/>
              </div>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"16px",borderRadius:8,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)"}}>
                <input type="checkbox" id="reviewed" checked={reviewed} onChange={e=>setReviewed(e.target.checked)} style={{marginTop:2,width:16,height:16,flexShrink:0,cursor:"pointer"}}/>
                <label htmlFor="reviewed" style={{fontSize:13,color:"rgba(255,255,255,.7)",lineHeight:1.6,cursor:"pointer"}}>
                  I have reviewed the services and needs required to move forward. <span style={{color:"#E8263A"}}>*</span><br/>
                  <span style={{opacity:.7}}>Yes, I have reviewed Brock's work, services, and requirements necessary to move forward with potentially securing custom artwork services.</span>
                </label>
              </div>
              <button
                onClick={async()=>{
                  if(!firstName.trim()||!lastName.trim()||!email.includes("@")||!phone.trim()||!message.trim()||!reviewed) return;
                  setSubmitting(true);
                  try {
                    const {addDoc,collection:col,serverTimestamp}=await import("firebase/firestore");
                    const {firestore:db}=await import("@/lib/firebase");
                    await addDoc(col(db,"inquiries"),{creatorId:profile.uid,serviceType:selected||"General",name:firstName+" "+lastName,firstName,lastName,email,phone,deadline,budget,message,extra,referral,reviewed,createdAt:serverTimestamp(),read:false});
                    setSent(true);
                  } catch(e){console.error(e);}
                  setSubmitting(false);
                }}
                disabled={submitting||!firstName.trim()||!lastName.trim()||!email.includes("@")||!phone.trim()||!message.trim()||!reviewed}
                style={{padding:"18px",borderRadius:8,background:"#fff",color:"#000",border:"none",fontSize:14,fontWeight:900,cursor:"pointer",letterSpacing:".08em",textTransform:"uppercase",opacity:submitting||!firstName.trim()||!lastName.trim()||!email.includes("@")||!phone.trim()||!message.trim()||!reviewed?0.5:1}}
              >
                {submitting?"Sending...":"Submit →"}
              </button>
            </div>
          )}
        </div>
      </div>

      <BrockFooter username={username} />
    </div>
  );
}
