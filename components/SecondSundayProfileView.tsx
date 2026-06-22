"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getUserByUsername } from "@/lib/db";

const T = {
  bg:    "#070707",
  bg2:   "#0d0d0d",
  white: "#F2EDE4",
  gold:  "#C9A84C",
  muted: "rgba(242,237,228,0.42)",
  faint: "rgba(242,237,228,0.07)",
  goldD: "rgba(201,168,76,0.3)",
};

const FALLBACK_EVENT = {
  id:          "second-sunday-2016-experience-may2026",
  title:       "The 2016 Experience",
  subtitle:    "Spring Break STL",
  date:        "2026-05-10",
  startTime:   "5:00 PM",
  endTime:     "10:00 PM",
  doorsOpen:   "5:00 PM",
  venue:       "The Key STL",
  address:     "3225 Olive St, St. Louis, MO 63103",
  ageLimit:    "21+",
  description: "We're taking it back. Second Sunday returns with The 2016 Experience — a night dedicated to one of the most iconic eras in music. From start to finish, expect nothing but 2016: the hits, the deep cuts, and everything that defined the sound. This is for the ones who remember.",
  lineup:      ["NAYBAHOOD", "MTTVVV", "ANANSI SPINS"],
  tickets: [
    { tier: "Early Bird", price: 15, note: "Until sold out", active: true },
    { tier: "Tier 1",     price: 20, note: "Limited",        active: true },
    { tier: "Tier 2",     price: 23, note: "General",        active: true },
  ],
  status: "published",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes ssTickerAnim { from { transform:translateX(0); } to { transform:translateX(-50%); } }
  @keyframes ssBlink { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes ssFadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  .ss-f1 { animation: ssFadeUp .65s ease both .1s; }
  .ss-f2 { animation: ssFadeUp .75s ease both .28s; }
  .ss-f3 { animation: ssFadeUp .7s ease both .48s; }
  .ss-tcard:hover { border-color: rgba(201,168,76,.45) !important; background: rgba(201,168,76,.04) !important; }
  .ss-navlink:hover { color: #F2EDE4 !important; }
  .ss-primarybtn:hover { background: #C9A84C !important; }
`;

function useCountdown(dateStr: string) {
  const calc = () => {
    const diff = new Date(dateStr + "T17:00:00").getTime() - Date.now();
    if (diff <= 0) return { d:0, h:0, m:0, s:0 };
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, []);
  return t;
}

const pad = (n: number) => String(n).padStart(2, "0");

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:".7rem", fontSize:".58rem", letterSpacing:".3em", textTransform:"uppercase", color:T.gold, marginBottom:"1.8rem" }}>
      <span style={{ width:"1.4rem", height:".5px", background:T.gold, display:"block" }} />
      {children}
    </div>
  );
}

function PrimaryBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ss-primarybtn"
      style={{ display:"inline-block", fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.05rem", letterSpacing:".2em", padding:"1rem 2.8rem", background:T.white, color:T.bg, textDecoration:"none", transition:"background .2s" }}>
      {children}
    </a>
  );
}

function CountdownUnit({ val, label }: { val: number; label: string }) {
  return (
    <div style={{ textAlign:"center", minWidth:"3.5rem" }}>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,6vw,4.5rem)", lineHeight:1, color:T.white, letterSpacing:".04em" }}>{pad(val)}</div>
      <div style={{ fontSize:".52rem", letterSpacing:".25em", textTransform:"uppercase", color:T.muted, marginTop:".3rem" }}>{label}</div>
    </div>
  );
}

export default function SecondSundayProfileView() {
  const [event, setEvent] = useState<any>(FALLBACK_EVENT);
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);
  const GEMM_EVENT_URL = "https://joingemm.com/event/second-sunday-2016-experience-may2026";
  const cd = useCountdown(event.date);

  useEffect(() => {
    async function load() {
      try {
        const prof = await getUserByUsername("secondsundaystl");
        if (prof) {
          const eventsSnap = await getDocs(query(collection(firestore, "users/" + prof.uid + "/events"), orderBy("date", "desc")));
          const events = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
          const upcoming = events.find(e => new Date(e.date) >= new Date());
          if (upcoming) setEvent(upcoming);
        }
      } catch (e) {}
    }
    load();
  }, []);

  const W = { maxWidth:"960px", margin:"0 auto", width:"100%" };
  const BD = { borderBottom:"0.5px solid " + T.faint };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, background:T.bg, color:T.white, overflowX:"hidden", lineHeight:1.6, minHeight:"100vh" }}>

        <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:300, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.1rem 2rem", background:"rgba(7,7,7,.94)", backdropFilter:"blur(12px)", borderBottom:"0.5px solid " + T.faint }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.05rem", letterSpacing:".18em" }}>SECOND SUNDAY STL</span>
          <div style={{ display:"flex", alignItems:"center", gap:"1.8rem" }}>
            {[["Event","#event"],["Lineup","#lineup"],["Tickets","#tickets"]].map(([l,h]) => (
              <a key={l} href={h} className="ss-navlink" style={{ fontSize:".6rem", letterSpacing:".2em", textTransform:"uppercase", color:T.muted, textDecoration:"none", transition:"color .2s" }}>{l}</a>
            ))}
            <a href={GEMM_EVENT_URL} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:".88rem", letterSpacing:".15em", padding:".42rem 1.25rem", border:"0.5px solid rgba(242,237,228,.18)", color:T.white, textDecoration:"none" }}>
              TICKETS
            </a>
          </div>
        </nav>

        <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 2rem 5rem", position:"relative", overflow:"hidden", paddingTop:"5rem" }}>
          <video autoPlay muted loop playsInline style={{ position:"absolute", inset:0, zIndex:0, width:"100%", height:"100%", objectFit:"cover", opacity:.45 }}>
            <source src="https://firebasestorage.googleapis.com/v0/b/gemm-8cda2.firebasestorage.app/o/creators-secondsundaystl%2FScreenRecording_04-05-2026%2019-09-30_1%20(3).mov?alt=media" type="video/mp4" />
          </video>
          <div style={{ position:"absolute", inset:0, zIndex:0, background:"linear-gradient(to bottom, rgba(7,7,7,.6) 0%, rgba(7,7,7,.3) 50%, rgba(7,7,7,.85) 100%)" }} />
          <div style={{ position:"absolute", inset:0, zIndex:0, opacity:.022, backgroundImage:"repeating-linear-gradient(0deg,#fff 0,#fff .5px,transparent .5px,transparent 70px),repeating-linear-gradient(90deg,#fff 0,#fff .5px,transparent .5px,transparent 70px)" }} />
          <div style={{ position:"absolute", top:"6.5rem", right:"2rem", zIndex:2, fontFamily:"'Bebas Neue',sans-serif", fontSize:".8rem", letterSpacing:".12em", border:"0.5px solid rgba(242,237,228,.18)", padding:".38rem .85rem", color:"rgba(242,237,228,.42)" }}>21+ ONLY</div>
          <div style={{ position:"relative", zIndex:1 }}>
            <div className="ss-f1" style={{ fontSize:".58rem", letterSpacing:".3em", textTransform:"uppercase", color:T.gold, display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1rem" }}>
              <span style={{ display:"block", width:"2rem", height:".5px", background:T.gold }} />
              Second Sunday STL · Spring Break
            </div>
            <h1 className="ss-f2" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(4.5rem,15vw,13rem)", lineHeight:.86, letterSpacing:".015em" }}>
              <span style={{ display:"block", color:T.white }}>THE</span>
              <span style={{ display:"block", color:T.gold }}>2016</span>
              <span style={{ display:"block", WebkitTextStroke:"1px rgba(242,237,228,.28)", color:"transparent" }}>EXPERIENCE</span>
            </h1>
            <div className="ss-f3" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:"2rem", paddingTop:"1.5rem", borderTop:"0.5px solid " + T.faint, gap:"1.5rem", flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:".6rem", letterSpacing:".22em", textTransform:"uppercase", color:T.muted, marginBottom:".4rem" }}>w/ sounds from</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1rem,2.5vw,1.5rem)", letterSpacing:".12em" }}>{event.lineup.join("  ·  ")}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:".56rem", letterSpacing:".22em", textTransform:"uppercase", color:T.goldD, marginBottom:".3rem" }}>Date & Venue</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.1rem,2vw,1.4rem)", letterSpacing:".1em" }}>MAY 10 · 5PM – 10PM</div>
                <div style={{ fontSize:".7rem", color:T.muted, marginTop:".2rem" }}>{event.venue} · St. Louis, MO</div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ borderTop:"0.5px solid " + T.faint, ...BD, overflow:"hidden", padding:".8rem 0" }}>
          <div style={{ display:"flex", width:"max-content", animation:"ssTickerAnim 26s linear infinite" }}>
            {[...Array(4)].map((_,i) => (
              <div key={i} style={{ display:"flex", gap:"3rem", paddingRight:"3rem" }}>
                {["SECOND SUNDAY STL","MAY 10 · 2026","THE 2016 EXPERIENCE","THE KEY STL","21+ ONLY","SPRING BREAK"].map((txt,j) => (
                  <span key={j} style={{ display:"flex", alignItems:"center", gap:"3rem", fontFamily:"'Bebas Neue',sans-serif", fontSize:".9rem", letterSpacing:".2em", color:"rgba(242,237,228,.11)", whiteSpace:"nowrap" }}>
                    {txt}<span style={{ width:3, height:3, borderRadius:"50%", background:T.gold, opacity:.28, flexShrink:0 }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section id="event" style={{ padding:"5rem 2rem", ...BD, background:T.bg2 }}>
          <div style={W}>
            <Label>Countdown to the Night</Label>
            <div style={{ display:"flex", alignItems:"center", gap:"clamp(1rem,3vw,3rem)", flexWrap:"wrap", marginBottom:"3.5rem" }}>
              {[{val:cd.d,label:"Days"},{val:cd.h,label:"Hours"},{val:cd.m,label:"Mins"},{val:cd.s,label:"Secs"}].map(({val,label},i) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:"clamp(1rem,3vw,3rem)" }}>
                  <CountdownUnit val={val} label={label} />
                  {i < 3 && <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3rem", color:"rgba(201,168,76,.18)", lineHeight:1, animation:"ssBlink 1s ease infinite" }}>:</span>}
                </div>
              ))}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"1px", background:T.faint }}>
              {[{label:"Date",val:"Sunday, May 10",sub:"2026"},{label:"Time",val:"5:00 – 10:00 PM",sub:"Doors 5PM"},{label:"Venue",val:event.venue,sub:"3225 Olive St, STL"},{label:"Age",val:"21+",sub:"Valid ID required"}].map(d => (
                <div key={d.label} style={{ background:T.bg2, padding:"1.4rem 1.2rem" }}>
                  <div style={{ fontSize:".54rem", letterSpacing:".25em", textTransform:"uppercase", color:T.muted, marginBottom:".5rem" }}>{d.label}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem", letterSpacing:".06em" }}>{d.val}</div>
                  <div style={{ fontSize:".68rem", color:T.muted, marginTop:".2rem" }}>{d.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding:"5rem 2rem", ...BD }}>
          <div style={{ ...W, display:"grid", gridTemplateColumns:"1fr 1fr", gap:"5rem", alignItems:"start" }}>
            <div>
              <Label>About the Night</Label>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.2rem,4.5vw,3.8rem)", lineHeight:.92, letterSpacing:".02em" }}>
                WE'RE<br /><span style={{ color:"rgba(242,237,228,.18)" }}>TAKING</span><br />IT BACK.
              </h2>
            </div>
            <div style={{ paddingTop:".5rem" }}>
              <p style={{ fontSize:".88rem", color:T.muted, lineHeight:1.9 }}>{event.description}</p>
              <p style={{ fontSize:".8rem", color:"rgba(242,237,228,.28)", marginTop:"1.2rem", lineHeight:1.8 }}>Sounds by {event.lineup.join(", ")}.</p>
            </div>
          </div>
        </section>

        <section id="lineup" style={{ padding:"5rem 2rem", ...BD, background:T.bg2 }}>
          <div style={W}>
            <Label>Line Up</Label>
            <div style={{ display:"flex", gap:"1px", background:T.faint, flexWrap:"wrap" }}>
              {event.lineup.map((artist: string, i: number) => (
                <div key={artist} style={{ flex:"1 1 200px", background:T.bg2, padding:"2.5rem 2rem", position:"relative" }}>
                  <div style={{ position:"absolute", top:0, left:0, width:"1.5rem", height:"1px", background:T.gold }} />
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.5rem", color:"rgba(242,237,228,.04)", lineHeight:1, marginBottom:".8rem" }}>{String(i+1).padStart(2,"0")}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem", letterSpacing:".08em" }}>{artist}</div>
                  <div style={{ fontSize:".6rem", letterSpacing:".15em", textTransform:"uppercase", color:"rgba(242,237,228,.28)", marginTop:".4rem" }}>Sounds</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tickets" style={{ padding:"5rem 2rem", ...BD }}>
          <div style={W}>
            <Label>Tickets</Label>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"2.5rem", gap:"1rem", flexWrap:"wrap" }}>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.2rem,5vw,4rem)", letterSpacing:".02em", lineHeight:.9 }}>
                GET IN<br /><span style={{ color:"rgba(242,237,228,.18)" }}>BEFORE IT</span><br />SELLS OUT.
              </h2>
              <p style={{ fontSize:".8rem", color:T.muted, maxWidth:"260px", lineHeight:1.8 }}>Tiered pricing — grab an Early Bird before they're gone.</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1px", background:T.faint, marginBottom:"2rem" }}>
              {event.tickets.filter((t: any) => t.active).map((t: any, i: number) => (
                <a key={t.tier} href={GEMM_EVENT_URL} target="_blank" rel="noopener noreferrer" className="ss-tcard"
                  style={{ background:T.bg, padding:"2rem 1.5rem", textDecoration:"none", color:"inherit", display:"block", border: i===0 ? "0.5px solid rgba(201,168,76,.28)" : "0.5px solid transparent", transition:"border-color .2s, background .2s", position:"relative" }}>
                  {i===0 && <div style={{ position:"absolute", top:"1rem", right:"1rem", fontSize:".5rem", letterSpacing:".2em", textTransform:"uppercase", color:T.gold, border:"0.5px solid rgba(201,168,76,.35)", padding:".25rem .6rem" }}>Best Price</div>}
                  <div style={{ fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", color:T.muted, marginBottom:".6rem" }}>{t.tier}</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3rem", lineHeight:1, letterSpacing:".02em" }}>${t.price}</div>
                  <div style={{ fontSize:".66rem", color:"rgba(242,237,228,.28)", marginTop:".5rem", letterSpacing:".08em" }}>{t.note}</div>
                  <div style={{ marginTop:"1.5rem", fontSize:".6rem", letterSpacing:".2em", textTransform:"uppercase", color:"rgba(242,237,228,.25)" }}>Select →</div>
                </a>
              ))}
            </div>
            <PrimaryBtn href={GEMM_EVENT_URL}>GET TICKETS — MAY 10</PrimaryBtn>
            <p style={{ fontSize:".66rem", color:"rgba(242,237,228,.2)", marginTop:"1rem", letterSpacing:".05em" }}>Tickets sold & processed securely through GEMM · 21+ · Valid ID required at door</p>
          </div>
        </section>

        <section style={{ padding:"5rem 2rem", ...BD, background:T.bg2 }}>
          <div style={{ ...W, textAlign:"center" }}>
            <Label>Stay in the Loop</Label>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,6vw,5rem)", lineHeight:.9, letterSpacing:".02em", marginBottom:"1rem" }}>
              DON'T MISS<br /><span style={{ color:"rgba(242,237,228,.18)" }}>THE NEXT</span> ONE.
            </h2>
            <p style={{ fontSize:".85rem", color:T.muted, marginBottom:"2rem", lineHeight:1.8 }}>Be first to know about upcoming events, ticket drops, and lineups.</p>
            {emailDone ? (
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem", letterSpacing:".12em", color:T.gold }}>SEE YOU ON THE SECOND SUNDAY ✓</div>
            ) : (
              <div style={{ display:"flex", border:"0.5px solid rgba(242,237,228,.14)", maxWidth:"400px", margin:"0 auto" }}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flex:1, background:"transparent", border:"none", outline:"none", padding:".9rem 1.1rem", fontFamily:"'DM Sans',sans-serif", fontSize:".85rem", color:T.white, fontWeight:300 }} />
                <button onClick={() => email.includes("@") && setEmailDone(true)}
                  style={{ background:T.white, border:"none", padding:".9rem 1.3rem", fontFamily:"'DM Sans',sans-serif", fontSize:".6rem", letterSpacing:".18em", textTransform:"uppercase", fontWeight:500, cursor:"pointer", color:T.bg, whiteSpace:"nowrap" }}>
                  Notify Me
                </button>
              </div>
            )}
          </div>
        </section>

        <footer style={{ padding:"1.8rem 2rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap" }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:".9rem", letterSpacing:".18em", color:"rgba(242,237,228,.15)" }}>SECOND SUNDAY STL</div>
            <div style={{ fontSize:".58rem", color:"rgba(242,237,228,.12)", letterSpacing:".08em", marginTop:".2rem" }}>Every Second Sunday · Saint Louis, USA</div>
          </div>
          <div style={{ display:"flex", gap:"1.5rem" }}>
            <a href="https://instagram.com/secondsundaystl" target="_blank" rel="noopener noreferrer" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:"rgba(242,237,228,.2)", textDecoration:"none" }}>Instagram</a>
            <a href={GEMM_EVENT_URL} target="_blank" rel="noopener noreferrer" style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:"rgba(242,237,228,.2)", textDecoration:"none" }}>Tickets</a>
          </div>
          <div style={{ fontSize:".58rem", color:"rgba(242,237,228,.1)", letterSpacing:".06em" }}>
            Powered by <a href="https://joingemm.com" style={{ color:"rgba(242,237,228,.2)", textDecoration:"none" }}>GEMM</a>
          </div>
        </footer>

      </div>
    </>
  );
}