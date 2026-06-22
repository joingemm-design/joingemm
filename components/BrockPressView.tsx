"use client";
import BrockFooter from "@/components/BrockFooter";

const PRESS = [
  {
    outlet: "STLPR",
    headline: "Brock Seals On The Intersection Of Art And Activism",
    url: "https://www.stlpr.org/show/st-louis-on-the-air/2020-09-22/brock-seals-on-the-intersection-of-art-and-activism",
    image: "https://palettebyseals.com/wp-content/uploads/2025/02/Screenshot-2025-02-24-at-5.01.13-PM.png",
    date: "Sep 2020",
  },
  {
    outlet: "STLPR",
    headline: "Local talent and good eats at 'Art, Mimosas and Pancakes'",
    url: "https://www.stlpr.org/show/st-louis-on-the-air/2020-09-22/brock-seals-on-the-intersection-of-art-and-activism",
    image: "https://palettebyseals.com/wp-content/uploads/2025/02/Screenshot-2025-02-24-at-5.06.02-PM.png",
    date: "Sep 2020",
  },
  {
    outlet: "St. Louis Cardinals",
    headline: "Brock Seals x Cardinals Black Heritage Feature",
    url: "https://www.mlb.com/cardinals",
    image: "https://palettebyseals.com/wp-content/uploads/2025/02/Palette-by-Seals-Brock-Seals-and-St-Louis-_-Saint-Louis-Cardinals-Black-Heritage-Feature-and-Art-1080x1080.png",
    date: "Feb 2025",
  },
  {
    outlet: "Marc Jacobs",
    headline: "Brock Seals x Marc Jacobs Custom Handbag Art at STL Store",
    url: "https://www.marcjacobs.com",
    image: "https://palettebyseals.com/wp-content/uploads/2025/02/Palette-by-Seals-Brock-Seals-and-Marc-Jacobs-Custom-Hand-Bag-and-Purse-Art-at-Marc-Jacobs-STL-1.jpg",
    date: "2024",
  },
  {
    outlet: "Tecovas",
    headline: "Brock Seals x Tecovas Fine Leather Custom Boot Art",
    url: "https://www.tecovas.com",
    image: "https://palettebyseals.com/wp-content/uploads/2025/02/Palette-by-Seals-Brock-Seals-and-Tecovas-Fine-Leather-Boots-Custom-Boot-Art-Saint-Louis-1080x1080.png",
    date: "2024",
  },
];

export default function BrockPressView({ username }: { username: string }) {
  return (
    <div style={{minHeight:"100vh",background:"#fff",color:"#000",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .press-card{transition:transform .2s,box-shadow .2s}
        .press-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.12)}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:"1px solid #eee",padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"rgba(255,255,255,.95)",backdropFilter:"blur(12px)",zIndex:10}}>
        <a href={"/"+username} style={{textDecoration:"none"}}>
          <img src="https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Palette-By-Seals-Stacked-Horizontal-08.png" alt="Palette by Seals" style={{height:32,objectFit:"contain",filter:"invert(1)"}}/>
        </a>
        <a href={"/"+username} style={{fontSize:11,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"#999",textDecoration:"none"}}>← BACK</a>
      </div>

      {/* Hero */}
      <div style={{background:"#000",color:"#fff",padding:"80px 32px",textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase",opacity:.4,marginBottom:12}}>IN THE NEWS</div>
        <h1 style={{fontSize:"clamp(40px,9vw,80px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.9}}>PRESS</h1>
      </div>

      {/* Press grid */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"64px 24px 80px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:28}}>
          {PRESS.map((p,i)=>(
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="press-card" style={{textDecoration:"none",color:"#000",border:"1px solid #eee",borderRadius:16,overflow:"hidden",display:"block"}}>
              {/* Image */}
              <div style={{width:"100%",aspectRatio:"16/9",background:"linear-gradient(135deg,#1a1a1a,#2a2a2a)",overflow:"hidden",position:"relative"}}>
                <img
                  src={p.image}
                  alt={p.headline}
                  style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}
                  onError={e=>{
                    e.currentTarget.style.display="none";
                    const parent = e.currentTarget.parentElement;
                    if(parent) parent.innerHTML="<div style='position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px'><div style='font-size:40px'>📰</div><div style='font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3)'>"+p.outlet+"</div></div>";
                  }}
                />
              </div>
              {/* Content */}
              <div style={{padding:24}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:11,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",color:"#E8263A"}}>{p.outlet}</div>
                  <div style={{fontSize:12,opacity:.4,fontWeight:600}}>{p.date}</div>
                </div>
                <div style={{fontSize:17,fontWeight:800,lineHeight:1.4,marginBottom:16}}>{p.headline}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#E8263A"}}>Read Article →</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <BrockFooter username={username}/>
    </div>
  );
}
