"use client";
import BrockFooter from "@/components/BrockFooter";

const COLLABS = [
  { title: "BROCK SEALS x ST. LOUIS CARDINALS", image: "https://palettebyseals.com/wp-content/uploads/2025/02/Palette-by-Seals-Brock-Seals-and-St-Louis-_-Saint-Louis-Cardinals-Black-Heritage-Feature-and-Art-1080x1080.png", url: "https://palettebyseals.com/project/st-louis-cardinals-x-brock-seals-collab/" },
  { title: "BROCK SEALS x CONVERSE ALL-STAR x LEAD STL", image: "https://palettebyseals.com/wp-content/uploads/2025/02/Brock-Selas-x-LEAD-STL-x-Converse-Shoe-Painting-DEMO-STL-1080x1080.png", url: "https://palettebyseals.com/project/brock-seals-x-lead-stl-collab/" },
  { title: "BROCK SEALS x MARC JACOBS", image: "https://palettebyseals.com/wp-content/uploads/2025/02/Palette-by-Seals-Brock-Seals-and-Marc-Jacobs-Custom-Hand-Bag-and-Purse-Art-at-Marc-Jacobs-STL-1.jpg", url: "https://palettebyseals.com/project/marc-jacobs-x-brock-seals-collab/" },
  { title: "BROCK SEALS x TECOVAS", image: "https://palettebyseals.com/wp-content/uploads/2025/02/Palette-by-Seals-Brock-Seals-and-Tecovas-Fine-Leather-Boots-Custom-Boot-Art-Saint-Louis-1080x1080.png", url: "https://palettebyseals.com/project/tecovas/" },
];

const BRANDS = [
  "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Tecovas-Fine-Bootwear.png",
  "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/St.-Louis-Cardinals.png",
  "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Marc-Jacobs.png",
  "https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Regional-Arts-Commission-of-St.-Louis-RAC.png",
];

export default function BrockCollabsView({ username }: { username: string }) {
  return (
    <div style={{minHeight:"100vh",background:"#fff",color:"#000",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .collab-card{transition:transform .25s}
        .collab-card:hover{transform:scale(1.02)}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:"1px solid #eee",padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"rgba(255,255,255,.95)",backdropFilter:"blur(12px)",zIndex:10}}>
        <a href={"/"+username} style={{textDecoration:"none",color:"#000"}}>
          <img src="https://palettesbyseal.wpenginepowered.com/wp-content/uploads/2025/02/Palette-By-Seals-Stacked-Horizontal-08.png" alt="Palette by Seals" style={{height:32,objectFit:"contain"}}/>
        </a>
        <a href={"/"+username} style={{fontSize:11,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"#999",textDecoration:"none"}}>← BACK</a>
      </div>

      {/* Hero */}
      <div style={{background:"#000",color:"#fff",padding:"80px 32px",textAlign:"center"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase",opacity:.4,marginBottom:12}}>THE ART OF SEALS</div>
        <h1 style={{fontSize:"clamp(40px,9vw,80px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.9,marginBottom:20}}>COLLABS</h1>
        <p style={{fontSize:15,opacity:.5,maxWidth:560,margin:"0 auto"}}>From fashion and sports to music and community, collaborations that push culture forward through bold, meaningful art.</p>
      </div>

      {/* Brand logos */}
      <div style={{borderBottom:"1px solid #eee",padding:"32px 24px",display:"flex",gap:40,justifyContent:"center",alignItems:"center",flexWrap:"wrap" as const}}>
        {BRANDS.map((logo,i)=>(
          <img key={i} src={logo} alt="" style={{height:36,objectFit:"contain",opacity:.6,filter:"grayscale(100%)"}}/>
        ))}
      </div>

      {/* Collabs grid */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"64px 24px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(480px,1fr))",gap:24}}>
          {COLLABS.map((c,i)=>(
            <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="collab-card" style={{textDecoration:"none",color:"#000",display:"block",borderRadius:16,overflow:"hidden",border:"1px solid #eee"}}>
              <div style={{position:"relative",aspectRatio:"1",overflow:"hidden"}}>
                <img src={c.image} alt={c.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 50%)",display:"flex",alignItems:"flex-end",padding:24}}>
                  <h2 style={{fontSize:"clamp(14px,2vw,20px)",fontWeight:900,color:"#fff",letterSpacing:"-.01em",lineHeight:1.2}}>{c.title}</h2>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{textAlign:"center",marginTop:64,padding:"64px 24px",borderTop:"1px solid #eee"}}>
          <h2 style={{fontSize:"clamp(28px,5vw,48px)",fontWeight:900,letterSpacing:"-.03em",marginBottom:16}}>Want to create something legendary together?</h2>
          <a href={"/"+username+"/services"} style={{display:"inline-block",padding:"16px 36px",borderRadius:9999,background:"#000",color:"#fff",textDecoration:"none",fontWeight:900,fontSize:14,letterSpacing:".08em",textTransform:"uppercase"}}>Let's Make It Happen →</a>
        </div>
      </div>

      <BrockFooter username={username}/>
    </div>
  );
}
