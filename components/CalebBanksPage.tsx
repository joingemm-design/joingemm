"use client";
const IMG="/caleb.jpg";
const IMGM="/IMG_2504.jpg";
const T={bg:"#070707",bg2:"#0d0d0d",white:"#F0EDE5",og:"#E85D2F",muted:"rgba(240,237,229,0.42)"};
const C=[["40-Yard","5.04","Elite for 327lbs"],["Vertical","32in","Top explosion"],["Broad Jump","5ft6","Athletic freak"],["Weight","327 lbs","99th pct"],["Height","6ft6","Rarest DT frame"],["Hands","10 1/8in","94th pct"]];
const CAREER=[["Games Started","34","Career"],["Tackles for Loss","10.5","Career"],["Sacks","6.5","Career"],["QB Pressures","60","Per PFF"],["Forced Fumbles","3","Career"],["Fumble Recoveries","2","Career"],["Pass Break-Ups","1","Career"],["PFF Grade","75.2","Season High"]];
const ST=`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');@keyframes cbTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}@keyframes cbFade{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}.f1{animation:cbFade .65s ease both .1s}.f2{animation:cbFade .75s ease both .28s}.f3{animation:cbFade .7s ease both .48s}.cnl:hover{color:#F0EDE5!important}.cbt:hover{background:#E85D2F!important;color:#070707!important}@media(max-width:640px){.hn{display:none}.twocol{grid-template-columns:1fr!important}.cb-hero-bg{background-image:var(--mobile-img)!important;background-size:120%!important;background-position:center -50px!important}}.cb-media{transition:opacity 1.2s ease}.cb-media-hide{opacity:0!important}`;
const P="clamp(3rem,6vw,5rem) clamp(1rem,4vw,2rem)";
const BD="0.5px solid rgba(240,237,229,0.07)";

export default function CalebBanksPage(){
return(
<div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:300,background:T.bg,color:T.white,overflowX:"hidden",lineHeight:1.6,minHeight:"100vh"}}>
<style>{ST}</style>

<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:300,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.1rem 2rem",background:"rgba(7,7,7,0.94)",backdropFilter:"blur(12px)",borderBottom:BD}}>
  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.05rem",letterSpacing:".18em"}}>CB<span style={{color:T.og}}>88</span></span>
  <div className="hn" style={{display:"flex",alignItems:"center",gap:"1.8rem"}}>
    {[["Numbers","#numbers"],["Bio","#story"],["Contact","#contact"]].map(([l,h])=>(<a key={l} href={h} className="cnl" style={{fontSize:".6rem",letterSpacing:".2em",textTransform:"uppercase",color:T.muted,textDecoration:"none",transition:"color .2s"}}>{l}</a>))}
  </div>
  <a href="https://instagram.com/ca1ebbanks" target="_blank" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:".88rem",letterSpacing:".15em",padding:".42rem 1.25rem",border:"0.5px solid rgba(240,237,229,0.18)",color:T.white,textDecoration:"none"}}>@CA1EBBANKS</a>
</nav>

<section style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"0 clamp(1rem,4vw,2rem) clamp(3rem,6vw,5rem)",position:"relative",overflow:"hidden"}}>
  <div className="cb-hero-bg" style={{position:"absolute",inset:0,backgroundImage:"url("+IMG+")",backgroundSize:"cover",backgroundPosition:"60% top","--mobile-img":"url("+IMGM+")"} as any} />
  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(7,7,7,0.55) 0%,rgba(7,7,7,0.25) 40%,rgba(7,7,7,0.92) 100%)"}} />
  <div style={{position:"relative",zIndex:1}}>
    <div className="f1" style={{fontSize:".58rem",letterSpacing:".3em",textTransform:"uppercase",color:T.og,display:"flex",alignItems:"center",gap:".75rem",marginBottom:"1rem"}}>
      <span style={{display:"block",width:"2rem",height:".5px",background:T.og}} />Florida Gators · #88 · NFL Draft 2026
    </div>
    <h1 className="f2" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(4.5rem,15vw,13rem)",lineHeight:.86,letterSpacing:".015em",margin:0}}>
      <span style={{display:"block",color:T.white}}>CALEB</span>
      <span style={{display:"block",color:T.og}}>BANKS</span>
    </h1>
    <div className="f3" style={{display:"flex",alignItems:"flex-end",justifyContent:"flex-start",marginTop:"2rem",paddingTop:"1.5rem",borderTop:BD,gap:"1.5rem",flexWrap:"wrap"}}>
      <div style={{display:"flex",gap:"2.5rem",flexWrap:"wrap"}}>
        {[["6ft6","Height"],["327","Weight"],["5.04","Forty"],["DT","Position"]].map(([v,l],i)=>(
          <div key={i}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1.4rem,3vw,2rem)",color:i===3?T.og:T.white,lineHeight:1}}>{v}</div>
            <div style={{fontSize:".52rem",letterSpacing:".22em",textTransform:"uppercase",color:T.muted,marginTop:".3rem"}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
        <a href="https://instagram.com/ca1ebbanks" target="_blank" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:".15em",padding:".9rem 2.2rem",background:T.og,color:T.bg,textDecoration:"none"}}>FOLLOW @CA1EBBANKS</a>
        <a href="#numbers" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:".15em",padding:".9rem 0",color:T.white,textDecoration:"none",borderBottom:"0.5px solid rgba(240,237,229,0.3)"}}>SEE THE NUMBERS</a>
      </div>
    </div>
  </div>
</section>

<div style={{borderTop:BD,borderBottom:BD,overflow:"hidden",padding:".8rem 0"}}>
  <div style={{display:"inline-flex",animation:"cbTick 30s linear infinite"}}>
    {"CALEB BANKS  ·  6FT6 · 327LBS  ·  NFL DRAFT 2026  ·  FLORIDA GATORS  ·  SENIOR BOWL  ·  5.04 FORTY  ·  #88 DT  ·  CALEB BANKS  ·  6FT6 · 327LBS  ·  NFL DRAFT 2026  ·  FLORIDA GATORS  ·  SENIOR BOWL  ·  5.04 FORTY  ·  #88 DT  ·  ".split("  ·  ").map((t,i)=>(
      <span key={i} style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:".15em",color:"rgba(240,237,229,0.7)",paddingRight:"3rem",whiteSpace:"nowrap",flexShrink:0}}>{t} ·</span>
    ))}
  </div>
</div>

<section id="numbers" style={{padding:P,borderBottom:BD,background:T.bg2}}>
  <div style={{maxWidth:"960px",margin:"0 auto",width:"100%"}}>
    <div style={{display:"flex",alignItems:"center",gap:".7rem",fontSize:".58rem",letterSpacing:".3em",textTransform:"uppercase",color:T.og,marginBottom:"1.8rem"}}><span style={{width:"1.4rem",height:".5px",background:T.og,display:"block"}} />NFL Combine 2026</div>
    <div className="twocol" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5rem",alignItems:"start"}}>
      <div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.2rem,4.5vw,3.8rem)",lineHeight:.92,letterSpacing:".02em"}}>The<br/><span style={{color:T.og}}>Measurables.</span></h2>
        <p style={{fontSize:".88rem",color:T.muted,lineHeight:1.9,marginTop:"1.2rem"}}>At 6ft6 and 327 pounds, Caleb Banks ran a 5.04 forty. Numbers scouts say do not exist. The most physically rare interior DT in this draft class.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"1px",background:"rgba(240,237,229,0.07)"}}>
        {C.map(([m,v,p],i)=>(
          <div key={i} style={{background:T.bg2,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.1rem 1.2rem"}}>
            <span style={{fontSize:".6rem",letterSpacing:".2em",textTransform:"uppercase",color:T.muted}}>{m}</span>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.5rem",color:T.white}}>{v}</div>
              <div style={{fontSize:".52rem",letterSpacing:".12em",color:T.og,textTransform:"uppercase"}}>{p}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

<section id="story" style={{padding:P,borderBottom:BD}}>
  <div style={{maxWidth:"960px",margin:"0 auto",width:"100%"}}>
    <div>
      <div style={{display:"flex",alignItems:"center",gap:".7rem",fontSize:".58rem",letterSpacing:".3em",textTransform:"uppercase",color:T.og,marginBottom:"1.8rem"}}><span style={{width:"1.4rem",height:".5px",background:T.og,display:"block"}} />The Story</div>
      <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.2rem,4.5vw,3.8rem)",lineHeight:.92,letterSpacing:".02em"}}>Detroit.<br/><span style={{color:"rgba(240,237,229,0.18)"}}>Built</span><br/>Different.</h2>
      <p style={{fontSize:".88rem",color:T.muted,lineHeight:1.9,marginTop:"1.2rem"}}>Caleb Banks grew up in Southfield, Michigan — a two-time team captain at Southfield A&T who earned All-American recognition before signing with Louisville. After two seasons in the ACC, he transferred to Florida where he became one of the most physically dominant interior linemen in the country.</p>
      <p style={{fontSize:".88rem",color:T.muted,lineHeight:1.9,marginTop:"1rem"}}>In 2024 he was at his best — seven QB pressures against LSU, 3.5 TFL and 2.5 sacks against Ole Miss in back-to-back weeks, and a Senior Bowl invitation that put him on every scout's radar.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1px",background:"rgba(240,237,229,0.07)",marginTop:"2rem"}}>
        {[["Southfield, MI","Hometown"],["Louisville → Florida","College Path"],["2026 Senior Bowl","Participant"],["5 Seasons","College Career"]].map(([v,l],i)=>(
          <div key={i} style={{background:T.bg,padding:"1.1rem 1.2rem"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.1rem",letterSpacing:".06em"}}>{v}</div>
            <div style={{fontSize:".54rem",letterSpacing:".2em",textTransform:"uppercase",color:T.muted,marginTop:".3rem"}}>{l}</div>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>

<section style={{padding:P,borderBottom:BD,background:T.bg2}}>
  <div style={{maxWidth:"960px",margin:"0 auto",width:"100%"}}>
    <div style={{display:"flex",alignItems:"center",gap:".7rem",fontSize:".58rem",letterSpacing:".3em",textTransform:"uppercase",color:T.og,marginBottom:"1.8rem"}}><span style={{width:"1.4rem",height:".5px",background:T.og,display:"block"}} />2024 Season Highlights</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"1px",background:"rgba(240,237,229,0.07)"}}>
      {[["7","QB Pressures vs LSU","Most among all DTs Wk 12"],["7","QB Pressures vs Ole Miss","Most among all DTs Wk 13"],["3.5","TFL vs Ole Miss","Career high single game"],["2.5","Sacks vs Ole Miss","Career high single game"],["75.2","PFF Grade vs LSU","Season best"]].map(([v,l,sub],i)=>(
        <div key={i} style={{background:T.bg2,padding:"2rem 1.5rem",textAlign:"center"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,5vw,3.5rem)",color:T.og,lineHeight:1}}>{v}</div>
          <div style={{fontSize:".62rem",fontWeight:500,letterSpacing:".12em",textTransform:"uppercase",color:T.white,marginTop:".6rem"}}>{l}</div>
          <div style={{fontSize:".56rem",letterSpacing:".08em",textTransform:"uppercase",color:T.muted,marginTop:".25rem"}}>{sub}</div>
        </div>
      ))}
    </div>
  </div>
</section>

<section id="contact" style={{padding:P,borderBottom:BD,background:T.bg2}}>
  <div style={{maxWidth:"960px",margin:"0 auto",width:"100%",textAlign:"center"}}>
    <div style={{display:"flex",alignItems:"center",gap:".7rem",fontSize:".58rem",letterSpacing:".3em",textTransform:"uppercase",color:T.og,marginBottom:"1.8rem"}}><span style={{width:"1.4rem",height:".5px",background:T.og,display:"block"}} />Stay Connected</div>
    <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,6vw,5rem)",lineHeight:.9,letterSpacing:".02em",marginBottom:"1rem"}}>
      DON'T MISS<br/><span style={{color:"rgba(240,237,229,0.18)"}}>WHAT COMES</span> NEXT.
    </h2>
    
    <div style={{display:"flex",border:"0.5px solid rgba(240,237,229,0.14)",maxWidth:"400px",margin:"0 auto"}}>
      <input type="email" placeholder="your@email.com" style={{flex:1,background:"transparent",border:"none",outline:"none",padding:".9rem 1.1rem",fontFamily:"'DM Sans',sans-serif",fontSize:".85rem",color:T.white,fontWeight:300}} />
      <button style={{background:T.white,border:"none",padding:".9rem 1.3rem",fontFamily:"'DM Sans',sans-serif",fontSize:".6rem",letterSpacing:".18em",textTransform:"uppercase",fontWeight:500,cursor:"pointer",color:T.bg,whiteSpace:"nowrap"}}>Notify Me</button>
    </div>
    <p style={{fontSize:".6rem",color:"rgba(240,237,229,0.2)",marginTop:"1rem",letterSpacing:".08em"}}>For media & partnership inquiries · <a href="https://instagram.com/ca1ebbanks" target="_blank" style={{color:T.og,textDecoration:"none"}}>DM @ca1ebbanks</a></p>
  </div>
</section>

<section style={{padding:P,borderBottom:BD,background:T.bg2,textAlign:"center"}}>
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:".7rem",fontSize:".58rem",letterSpacing:".3em",textTransform:"uppercase",color:T.muted,marginBottom:"1rem"}}>
    <span style={{width:"1.4rem",height:".5px",background:"rgba(240,237,229,0.18)",display:"block"}} />Follow the rise<span style={{width:"1.4rem",height:".5px",background:"rgba(240,237,229,0.18)",display:"block"}} />
  </div>
  <a href="https://instagram.com/ca1ebbanks" target="_blank" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3rem,11vw,9rem)",color:T.white,letterSpacing:".02em",lineHeight:1,textDecoration:"none",display:"block"}}>@CA1EBBANKS</a>
</section>

<footer style={{padding:"1.8rem 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap"}}>
  <div>
    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:".9rem",letterSpacing:".18em",color:"rgba(240,237,229,0.15)"}}>CALEB BANKS · CB88</div>
    <div style={{fontSize:".58rem",color:"rgba(240,237,229,0.12)",letterSpacing:".08em",marginTop:".2rem"}}>Florida Gators · DT · NFL Draft 2026</div>
  </div>
  <a href="https://instagram.com/ca1ebbanks" target="_blank" style={{fontSize:".58rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(240,237,229,0.2)",textDecoration:"none"}}>Instagram</a>
  <div style={{fontSize:".58rem",color:"rgba(240,237,229,0.1)",letterSpacing:".06em"}}>Powered by <a href="https://joingemm.com" style={{color:"rgba(240,237,229,0.2)",textDecoration:"none"}}>GEMM</a></div>
</footer>

</div>
);
}