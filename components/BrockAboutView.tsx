"use client";
import BrockFooter from "@/components/BrockFooter";

const TRUSTED = [
  { name: "Tecovas", logo: "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Tecovas-Fine-Bootwear.png" },
  { name: "St. Louis Cardinals", logo: "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/St.-Louis-Cardinals.png" },
  { name: "Art Mimosas & Pancakes", logo: "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Art-Mimosas-and-Pancakes.png" },
  { name: "Marc Jacobs", logo: "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Marc-Jacobs.png" },
  { name: "Regional Arts Commission", logo: "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Regional-Arts-Commission-of-St.-Louis-RAC.png" },
];

const PRESS = [
  { outlet: "STLPR", headline: "Brock Seals On The Intersection Of Art And Activism", url: "https://www.stlpr.org/show/st-louis-on-the-air/2020-09-22/brock-seals-on-the-intersection-of-art-and-activism", image: "https://palettebyseals.com/wp-content/uploads/2025/02/Screenshot-2025-02-24-at-5.01.13-PM.png" },
  { outlet: "STLPR", headline: "Local talent and good eats at 'Art, Mimosas and Pancakes'", url: "https://www.stlpr.org/show/st-louis-on-the-air/2020-09-22/brock-seals-on-the-intersection-of-art-and-activism", image: "https://palettebyseals.com/wp-content/uploads/2025/02/Screenshot-2025-02-24-at-5.06.02-PM.png" },
];

export default function BrockAboutView({ username }: { username: string }) {
  return (
    <div style={{minHeight:"100vh",background:"#fff",color:"#000",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:"1px solid #eee",padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"rgba(255,255,255,.95)",backdropFilter:"blur(12px)",zIndex:10}}>
        <a href={"/"+username} style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",color:"#000"}}>
          <img src="https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Palette-By-Seals-Stacked-Horizontal-08.png" alt="Palette by Seals" style={{height:32,objectFit:"contain"}}/>
        </a>
        <a href={"/"+username} style={{fontSize:11,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"#999",textDecoration:"none"}}>← BACK</a>
      </div>

      {/* Hero */}
      <div style={{background:"#000",color:"#fff",padding:"80px 32px",textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase",opacity:.4,marginBottom:12}}>ABOUT</div>
        <h1 style={{fontSize:"clamp(40px,9vw,80px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.9,marginBottom:0}}>BROCK SEALS</h1>
      </div>

      {/* Bio */}
      <div style={{maxWidth:800,margin:"0 auto",padding:"64px 24px"}}>
        <div style={{fontSize:"clamp(16px,2vw,20px)",lineHeight:1.9,color:"#222",display:"flex",flexDirection:"column",gap:24}}>
          <p>I'm Brock Seals — a multi-faceted artist who brings stories to life through <strong>paint, design, music, and community experiences</strong>. Creativity isn't just what I do — it's how I connect. Whether I'm painting murals across <strong>St. Louis</strong>, designing custom pieces, or making music, my goal is always the same: to <strong>create art that moves people and brings them together</strong>.</p>
          <p>Over the years, my work has caught the attention of legends like <strong>Erykah Badu, Dapper Dan, and Nipsey Hussle</strong>, and I've had the honor of collaborating with the <strong>St. Louis Cardinals</strong> to celebrate <strong>Black Heritage</strong> through custom sportswear. But no matter how far my art takes me, <strong>St. Louis is home</strong> — you can find my murals from <strong>The Delmar Loop to Downtown</strong>, adding color and culture to the city that raised me.</p>
          <p>Beyond the canvas, I wanted to create a space where art, community, and good energy collide — so I started <strong>Art, Mimosas & Pancakes.</strong> It's more than an event; it's a <strong>creative experience</strong> that brings people together to celebrate local talent, enjoy great vibes, and, of course, sip mimosas and eat pancakes.</p>
          <p>I pull inspiration from the world around me, turning everyday moments into <strong>timeless pieces</strong>. To me, the only thing more uninspiring than a blank canvas is a <strong>blank mind</strong> — so I stay creating, always looking for ways to <strong>spark conversation, bring people together, and push the culture forward</strong>.</p>
          <p>I appreciate you stopping by — <strong>take a look around, tap into my work, and let's make something dope together.</strong></p>
        </div>

        {/* CTA */}
        <div style={{display:"flex",gap:12,marginTop:40,flexWrap:"wrap" as const}}>
          <a href={"/"+username+"/services"} style={{padding:"14px 28px",borderRadius:9999,background:"#000",color:"#fff",textDecoration:"none",fontWeight:900,fontSize:13,letterSpacing:".08em",textTransform:"uppercase"}}>Work With Me →</a>
          <a href={"/"+username+"/collabs"} style={{padding:"14px 28px",borderRadius:9999,background:"transparent",color:"#000",textDecoration:"none",fontWeight:900,fontSize:13,letterSpacing:".08em",textTransform:"uppercase",border:"2px solid #000"}}>See Collabs →</a>
        </div>
      </div>

      {/* Trusted By */}
      <div style={{background:"#000",padding:"56px 24px",overflow:"hidden"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",textAlign:"center",marginBottom:32}}>TRUSTED BY</div>
        <div style={{display:"flex",animation:"marquee 18s linear infinite",whiteSpace:"nowrap" as const,alignItems:"center",gap:48}}>
          {[...TRUSTED,...TRUSTED].map((b,i)=>(
            <img key={i} src={b.logo} alt={b.name} style={{height:40,objectFit:"contain",opacity:.7,filter:"brightness(0) invert(1)",flexShrink:0}}/>
          ))}
        </div>
      </div>

      {/* Press */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"64px 24px"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase",opacity:.4,marginBottom:32}}>PRESS FEATURES</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(380px,1fr))",gap:24}}>
          {PRESS.map((p,i)=>(
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"#000",border:"1px solid #eee",borderRadius:16,overflow:"hidden",display:"block",transition:"transform .2s"}} onMouseOver={e=>(e.currentTarget.style.transform="translateY(-4px)")} onMouseOut={e=>(e.currentTarget.style.transform="translateY(0)")}>
              <div style={{width:"100%",aspectRatio:"16/9",background:"#f5f5f5",overflow:"hidden",position:"relative"}}>
                <img
                  src={p.image}
                  alt={p.headline}
                  style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}
                  onError={e=>{
                    e.currentTarget.style.display="none";
                    const parent = e.currentTarget.parentElement;
                    if(parent){
                      parent.style.background="linear-gradient(135deg,#1a1a1a 0%,#2a2a2a 100%)";
                      parent.innerHTML="<div style='position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px'><div style='font-size:32px'>📰</div><div style='font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4)'>STLPR</div></div>";
                    }
                  }}
                />
              </div>
              <div style={{padding:20}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",opacity:.4,marginBottom:8}}>{p.outlet} FEATURE</div>
                <div style={{fontSize:16,fontWeight:800,lineHeight:1.4}}>{p.headline}</div>
                <div style={{fontSize:13,color:"#E8263A",fontWeight:700,marginTop:12}}>Read Article →</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <BrockFooter username={username}/>
    </div>
  );
}
