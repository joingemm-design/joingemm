"use client";

import { useState } from "react";

const BRAND = {
  navy:"#0B1D3A",navyMid:"#142650",gold:"#C9A84C",goldBright:"#F5C842",
  white:"#FFFFFF",offWhite:"#F8F5EF",muted:"rgba(248,245,239,0.55)",border:"rgba(201,168,76,0.2)",
};

const EVENTS = [
  {id:"champagne-classic",title:"Bowties & Bunnies: Champagne Classic",city:"St. Louis, MO",date:"Sun, Apr 5 · 3–8 PM",description:"Dress sharp and sip bubbly while enjoying a classy afternoon with some bunny-inspired fun and good vibes.",category:"Champagne Social",ticketUrl:"https://www.eventbrite.com/e/bowties-and-bunnies-champagne-classic-tickets-1984582018240",img:"https://ugc.production.linktr.ee/98c11a50-7d6c-4bcb-a6d9-0e3f018231c2_Bowties---Bunnies-V3.jpeg"},
  {id:"adult-easter-egg-hunt",title:"Adult Easter Egg Hunt",city:"St. Louis, MO",description:"Hunt eggs, sip wine, vibe out. An adults-only Easter experience with food trucks, live music, and good energy.",category:"Social Experience",ticketUrl:"https://posh.vip/e/adult-easter-egg-hunt-2",img:"https://ugc.production.linktr.ee/80cc7c44-8996-4fb8-bf30-d17f830a2031_IMG-2598.jpeg"},
  {id:"rnb-dinner-brent-faiyaz",title:"RNB Dinner Experience: Brent Faiyaz",city:"St. Louis, MO",description:"A curated dinner experience inspired by the sounds of Brent Faiyaz. Culinary meets culture in one elevated night.",category:"Dinner Experience",ticketUrl:"https://posh.vip/e/the-playlist-dinner-exp-bent-fiayaz",img:"https://ugc.production.linktr.ee/0b3df686-241d-441d-81e3-92d813543fb5_ThePlaylist-BrentFiayaz.jpeg"},
  {id:"adult-lock-in",title:"Adult Lock In",city:"St. Louis, MO",description:"Locked in for a night of games, music, and grown folks energy. One ticket. All access. No curfew.",category:"Social Experience",ticketUrl:"https://posh.vip/e/adult-lockin",img:"https://ugc.production.linktr.ee/7a2cc1fd-0eab-4bec-850a-8b00eecd71ad_IMG-8331.jpeg"},
  {id:"rnb-bowling-stl",title:"RNB Bowling After Dark",city:"St. Louis, MO",description:"Strikes, spares, and smooth R&B all night. The perfect combo of competitive fun and good vibes.",category:"R&B Experience",ticketUrl:"https://posh.vip/e/rb-bowling-after-dark-3",img:"https://ugc.production.linktr.ee/d5ed7bb1-1718-4da4-b9b4-3ef738f2974b_Rnb-Bowling-3.png"},
  {id:"gospel-day-party",title:"The Gospel Day Party",city:"St. Louis, MO",description:"Gospel music meets day party energy. Come as you are, praise, dance, and celebrate the culture.",category:"Day Party",ticketUrl:"https://posh.vip/e/the-gospel-day-party-1",img:"https://ugc.production.linktr.ee/9375313c-e5b7-455c-8a3f-57c540821d90_Heading-5.png"},
  {id:"rnb-tea",title:"RNB & TEA: Day Party",city:"St. Louis, MO",description:"Sip tea, catch vibes. A sophisticated day party where R&B sets the tone and the energy does the rest.",category:"Day Party",ticketUrl:"https://posh.vip/e/rnb-tea-day-party-experience",img:"https://ugc.production.linktr.ee/3c5ebc42-5998-475a-8938-1609a75e7f6f_IMG-8583.jpeg"},
  {id:"rnb-block-party",title:"RNB Block Party",city:"St. Louis, MO",description:"Outdoor. Live. Loud. The RNB Block Party brings the whole city out for a celebration of music and community.",category:"Block Party",ticketUrl:"https://posh.vip/e/rnb-block-party-experience",img:"https://ugc.production.linktr.ee/51bc5978-11dd-4ce0-9982-ca040ca008cd_IMG-8548.jpeg"},
  {id:"love-more-rnb-atl",title:"Love More RnB",city:"Atlanta, GA",description:"ATL edition of the signature R&B experience. Good music, good people, great night.",category:"R&B Experience",ticketUrl:"https://posh.vip/e/love-more-rnb-jan-16-atlanta",img:"https://ugc.production.linktr.ee/721e2408-a4ea-41c6-a740-fbad18924cf3_600x750.webp"},
  {id:"rnb-bowling-nola",title:"RNB Bowling After Dark",city:"New Orleans, LA",description:"New Orleans edition. Bowl to the best R&B and soul, NOLA style.",category:"R&B Experience",ticketUrl:"https://posh.vip/e/rb-bowling-after-dark-1",img:"https://ugc.production.linktr.ee/8d520282-ad30-48a1-af16-73d9d1b48b78_Rnb-Bowling-2.png"},
  {id:"rnb-bowling-jackson",title:"RNB Bowling After Dark",city:"Jackson, MS",description:"Jackson edition. Strike after strike, R&B all night long.",category:"R&B Experience",ticketUrl:"https://posh.vip/e/rb-bowling-after-dark-2",img:"https://ugc.production.linktr.ee/664e20d7-8705-4332-a5a9-5d53e6c8bc3a_Rnb-Bowling-4.png"},
];

const PARTNERS = ["People","Travel + Noire","Facebook","Wall Street Journal","BET","Cardinals","Bulls","Tesla","Meta","Live Nation","Red Bull","Greenlight"];
const CITIES = ["St. Louis, MO","Atlanta, GA","New Orleans, LA","Jackson, MS","Memphis, TN","Chicago, IL","Houston, TX"];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#0B1D3A;scroll-behavior:smooth}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.f1{animation:fadeUp .7s ease both .1s}
.f2{animation:fadeUp .7s ease both .25s}
.f3{animation:fadeUp .7s ease both .4s}
.ecard:hover{transform:translateY(-6px)!important;box-shadow:0 24px 60px rgba(0,0,0,.5)!important}
.ecard:hover .ecard-img{transform:scale(1.07)!important}
.navlink:hover{color:#F5C842!important}
.gbtn:hover{background:#F5C842!important;color:#0B1D3A!important}
.cbtn:hover{border-color:#C9A84C!important;color:#C9A84C!important}
.cbtn.act{background:#C9A84C!important;color:#0B1D3A!important;border-color:#C9A84C!important}
@media(max-width:640px){.dd-nav-links{display:none!important}.ecard{border-radius:12px!important}}
`;

export default function DatersAndDoersPage() {
  const [city, setCity] = useState("All");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const filtered = city === "All" ? EVENTS : EVENTS.filter(e => e.city === city);
  const W: React.CSSProperties = {maxWidth:"960px",margin:"0 auto",width:"100%"};

  return (
    <>
      <style>{S}</style>
      <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,background:"#0B1D3A",color:"#fff",overflowX:"hidden",lineHeight:1.6}}>

        {/* NAV */}
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.1rem 2rem",background:"rgba(11,29,58,.95)",backdropFilter:"blur(12px)",borderBottom:"0.5px solid rgba(201,168,76,.2)"}}>
          <div style={{display:"flex",alignItems:"center",gap:".75rem"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#C9A84C",animation:"pulse 2s ease infinite"}}/>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.1rem",letterSpacing:".2em"}}>DATERS & DOERS</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
            <div className="dd-nav-links" style={{display:"flex",gap:"1.5rem"}}>{[["Events","#events"],["About","#about"],["Cities","#cities"]].map(([l,h])=>(<a key={l} href={h} className="navlink" style={{fontSize:".6rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(248,245,239,.55)",textDecoration:"none",transition:"color .2s"}}>{l}</a>))}</div>
            <a href="#events" className="gbtn" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:".9rem",letterSpacing:".15em",padding:".45rem 1.4rem",background:"#C9A84C",color:"#0B1D3A",textDecoration:"none",transition:"all .2s"}}>TICKETS</a>
          </div>
        </nav>

        {/* HERO */}
        <section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"6rem 1.25rem 3rem",position:"relative",overflow:"hidden"}}>
          <img src="https://static.wixstatic.com/media/5f022f_10ad049d46714770abd7ec26aeab4459~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5f022f_10ad049d46714770abd7ec26aeab4459~mv2.jpg" alt="" style={{position:"absolute",inset:0,zIndex:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",filter:"grayscale(30%) brightness(.45)"}}/>
          <div style={{position:"absolute",inset:0,zIndex:0,background:"linear-gradient(to bottom, rgba(11,29,58,.5) 0%, rgba(11,29,58,.2) 40%, rgba(11,29,58,.9) 100%)"}}/>
          <div style={{position:"absolute",inset:0,zIndex:0,background:"radial-gradient(ellipse 60% 55% at 50% 20%, rgba(201,168,76,.1) 0%, transparent 65%)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div className="f1" style={{fontSize:".6rem",letterSpacing:".3em",textTransform:"uppercase",color:"#C9A84C",display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1rem"}}>
              <span style={{width:"2rem",height:"1px",background:"#C9A84C",display:"block"}}/>
              St. Louis · Atlanta · New Orleans · Jackson
            </div>
            <h1 className="f2" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(4rem,14vw,12rem)",lineHeight:.86,letterSpacing:".02em"}}>
              <span style={{display:"block"}}>DATERS</span>
              <span style={{display:"block",color:"#C9A84C"}}>&</span>
              <span style={{display:"block",WebkitTextStroke:"1px rgba(255,255,255,.28)",color:"transparent"}}>DOERS</span>
            </h1>
            <div className="f3" style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginTop:"2rem",paddingTop:"1.5rem",borderTop:"0.5px solid rgba(201,168,76,.2)",gap:"1.5rem",flexWrap:"wrap"}}>
              <div>
                <div style={{fontSize:".62rem",letterSpacing:".22em",textTransform:"uppercase",color:"rgba(248,245,239,.45)",marginBottom:".4rem"}}>Curated Experiences & Events</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1rem,2.5vw,1.4rem)",letterSpacing:".1em",color:"#fff"}}>R&B · Day Parties · Dinner Experiences · Block Parties</div>
              </div>
              <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
                <a href="#events" className="gbtn" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:".15em",padding:".85rem 2rem",background:"#C9A84C",color:"#0B1D3A",textDecoration:"none",transition:"all .2s"}}>VIEW EVENTS</a>
                <a href="https://instagram.com/datersanddoers" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:".15em",padding:".85rem 2rem",background:"transparent",color:"#fff",textDecoration:"none",border:"1px solid rgba(255,255,255,.2)"}}>FOLLOW</a>
              </div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div style={{borderTop:"0.5px solid rgba(201,168,76,.2)",borderBottom:"0.5px solid rgba(201,168,76,.2)",overflow:"hidden",padding:".85rem 0",background:"#142650"}}>
          <div style={{display:"flex",width:"max-content",animation:"ticker 22s linear infinite"}}>
            {[...Array(3)].map((_,i)=>(
              <div key={i} style={{display:"flex",gap:"3rem",paddingRight:"3rem"}}>
                {PARTNERS.map((p,j)=>(
                  <span key={j} style={{display:"flex",alignItems:"center",gap:"3rem",fontFamily:"'Bebas Neue',sans-serif",fontSize:".9rem",letterSpacing:".2em",color:"rgba(255,255,255,.18)",whiteSpace:"nowrap"}}>
                    {p}<span style={{width:4,height:4,borderRadius:"50%",background:"#C9A84C",opacity:.4,flexShrink:0}}/>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" style={{padding:"clamp(3rem,8vw,5rem) clamp(1.25rem,4vw,2rem)",borderBottom:"0.5px solid rgba(201,168,76,.2)"}}>
          <div style={{...W,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"3rem",alignItems:"start"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:".75rem",fontSize:".6rem",letterSpacing:".3em",textTransform:"uppercase",color:"#C9A84C",marginBottom:"1.5rem"}}>
                <span style={{width:"1.5rem",height:"1px",background:"#C9A84C",display:"block"}}/>About
              </div>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,5vw,4.5rem)",lineHeight:.9,letterSpacing:".02em"}}>
                WE TURN<br/><span style={{color:"#C9A84C"}}>DATE NIGHT</span><br/><span style={{WebkitTextStroke:"1px rgba(255,255,255,.28)",color:"transparent"}}>DYNAMITE.</span>
              </h2>
            </div>
            <div style={{paddingTop:".5rem"}}>
              <p style={{fontSize:".9rem",color:"rgba(248,245,239,.55)",lineHeight:1.9,marginBottom:"1.2rem"}}>Founded by <strong style={{color:"#fff",fontWeight:500}}>Morgan Casey and Donnah Thomas</strong>, Daters & Doers is on a mission to restore excitement into dating experiences, friend outings, and family activities across the country.</p>
              <p style={{fontSize:".9rem",color:"rgba(248,245,239,.55)",lineHeight:1.9,marginBottom:"1.2rem"}}>From R&B bowling nights to champagne socials to gospel day parties — every event is curated with intention, community, and culture at the center.</p>
              <p style={{fontSize:".9rem",color:"rgba(248,245,239,.55)",lineHeight:1.9}}>As seen on <strong style={{color:"#fff",fontWeight:500}}>FOX 2, People, BET, Travel + Noire</strong>, and the Wall Street Journal.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:"1px",background:"rgba(201,168,76,.2)",marginTop:"2rem"}}>
                {[{num:"650K",label:"Followers"},{num:"6M",label:"Monthly Profile Views"},{num:"200K",label:"Avg Sponsored Reach"}].map(s=>(
                  <div key={s.label} style={{background:"#0B1D3A",padding:"1.2rem 1.4rem"}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:"#C9A84C",lineHeight:1}}>{s.num}</div>
                    <div style={{fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(248,245,239,.45)",marginTop:".3rem"}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EVENTS */}
        <section id="events" style={{padding:"clamp(3rem,8vw,5rem) clamp(1.25rem,4vw,2rem)",background:"#142650",borderBottom:"0.5px solid rgba(201,168,76,.2)"}}>
          <div style={W}>
            <div style={{display:"flex",alignItems:"center",gap:".75rem",fontSize:".6rem",letterSpacing:".3em",textTransform:"uppercase",color:"#C9A84C",marginBottom:"1.5rem"}}>
              <span style={{width:"1.5rem",height:"1px",background:"#C9A84C",display:"block"}}/>Upcoming Events
            </div>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,6vw,5rem)",lineHeight:.9,letterSpacing:".02em",marginBottom:"2rem"}}>
              FIND YOUR<br/><span style={{color:"#C9A84C"}}>EXPERIENCE</span>
            </h2>
            {/* City filter */}
            <div id="cities" style={{display:"flex",gap:".75rem",flexWrap:"wrap",marginBottom:"2.5rem"}}>
              {["All",...CITIES].map(c=>(
                <button key={c} onClick={()=>setCity(c)} className={"cbtn"+(city===c?" act":"")}
                  style={{padding:".5rem 1.2rem",borderRadius:999,border:"1px solid rgba(255,255,255,.15)",background:"transparent",color:"rgba(248,245,239,.55)",fontSize:".62rem",letterSpacing:".15em",textTransform:"uppercase",cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                  {c}
                </button>
              ))}
            </div>
            {/* Grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1.5rem"}}>
              {filtered.map(ev=>(
                <a key={ev.id} href={ev.ticketUrl} target="_blank" rel="noopener noreferrer" className="ecard"
                  style={{display:"block",textDecoration:"none",color:"inherit",borderRadius:16,overflow:"hidden",background:"#0B1D3A",border:"1px solid rgba(201,168,76,.2)",transition:"transform .25s,box-shadow .25s",position:"relative"}}>
                  <div style={{aspectRatio:"16/9",overflow:"hidden",position:"relative"}}>
                    <img className="ecard-img" src={ev.img} alt={ev.title} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .4s ease"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, transparent 50%, rgba(11,29,58,.95) 100%)"}}/>
                    <div style={{position:"absolute",bottom:"1rem",left:"1rem",fontSize:".55rem",letterSpacing:".2em",textTransform:"uppercase",color:"#C9A84C",fontWeight:700,border:"1px solid rgba(201,168,76,.3)",padding:".3rem .7rem",borderRadius:999,background:"rgba(11,29,58,.7)"}}>{ev.category}</div>
                  </div>
                  <div style={{padding:"1.2rem"}}>
                    <div style={{fontSize:".6rem",letterSpacing:".15em",textTransform:"uppercase",color:"rgba(248,245,239,.45)",marginBottom:".4rem",display:"flex",alignItems:"center",gap:".5rem"}}>
                      <span style={{width:6,height:6,borderRadius:"50%",background:"#C9A84C",display:"inline-block"}}/>{ev.city}
                    </div>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.3rem",letterSpacing:".05em",color:"#fff",marginBottom:".6rem",lineHeight:1.1}}>{ev.title}</div>
                    <p style={{fontSize:".78rem",color:"rgba(248,245,239,.55)",lineHeight:1.7,marginBottom:"1rem"}}>{ev.description}</p>
                    <div style={{fontSize:".65rem",letterSpacing:".15em",textTransform:"uppercase",color:"#C9A84C",fontWeight:700}}>Get Tickets →</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* EMAIL */}
        <section style={{padding:"clamp(3rem,8vw,5rem) clamp(1.25rem,4vw,2rem)",borderBottom:"0.5px solid rgba(201,168,76,.2)"}}>
          <div style={{...W,textAlign:"center"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".75rem",fontSize:".6rem",letterSpacing:".3em",textTransform:"uppercase",color:"#C9A84C",marginBottom:"1.5rem"}}>
              <span style={{width:"1.5rem",height:"1px",background:"#C9A84C",display:"block"}}/>Stay Connected
            </div>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,6vw,5rem)",lineHeight:.9,letterSpacing:".02em",marginBottom:"1rem"}}>
              DON'T MISS<br/><span style={{color:"#C9A84C"}}>THE NEXT</span> ONE.
            </h2>
            <p style={{fontSize:".85rem",color:"rgba(248,245,239,.55)",marginBottom:"2rem",lineHeight:1.8}}>Be first to know about new events, ticket drops, and exclusive experiences.</p>
            {done ? (
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.4rem",letterSpacing:".12em",color:"#C9A84C"}}>YOU'RE ON THE LIST ✓</div>
            ) : (
              <div style={{display:"flex",flexWrap:"wrap",border:"1px solid rgba(201,168,76,.2)",maxWidth:"420px",margin:"0 auto"}}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}
                  style={{flex:"1 1 200px",background:"transparent",border:"none",outline:"none",padding:".9rem 1.1rem",fontFamily:"'DM Sans',sans-serif",fontSize:".85rem",color:"#fff",fontWeight:300}}/>
                <button onClick={()=>email.includes("@")&&setDone(true)}
                  style={{background:"#C9A84C",border:"none",padding:".9rem 1.4rem",fontFamily:"'DM Sans',sans-serif",fontSize:".6rem",letterSpacing:".18em",textTransform:"uppercase",fontWeight:700,cursor:"pointer",color:"#0B1D3A",whiteSpace:"nowrap"}}>
                  Notify Me
                </button>
              </div>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{padding:"1.8rem 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:".95rem",letterSpacing:".2em",color:"rgba(255,255,255,.2)"}}>DATERS & DOERS</div>
            <div style={{fontSize:".58rem",color:"rgba(255,255,255,.15)",letterSpacing:".08em",marginTop:".2rem"}}>Experiences & Events · St. Louis & Beyond</div>
          </div>
          <div style={{display:"flex",gap:"1.5rem"}}>
            {[["Instagram","https://instagram.com/datersanddoers"],["Website","https://datersanddoers.com"],["Tickets","https://joingemm.com/datersanddoers"]].map(([l,h])=>(
              <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.22)",textDecoration:"none"}}>{l}</a>
            ))}
          </div>
          <div style={{fontSize:".58rem",color:"rgba(255,255,255,.12)",letterSpacing:".06em"}}>
            Powered by <a href="https://joingemm.com" style={{color:"rgba(255,255,255,.22)",textDecoration:"none"}}>GEMM</a>
          </div>
        </footer>

      </div>
    </>
  );
}
