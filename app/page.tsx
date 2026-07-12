"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ClientRouter from "@/components/ClientRouter";

type Pt = { x: number; y: number; z: number };

export default function Page() {
  const rootRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLCanvasElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // nav border on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // reveal on scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    rootRef.current?.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // dotted globe
  useEffect(() => {
    const cv = globeRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    let W = 0, H = 0, R = 0, cx = 0, cy = 0, pts: Pt[] = [], raf = 0;

    function build() {
      W = Math.min(window.innerWidth - 48, 760); H = 200;
      cv!.style.width = W + "px"; cv!.style.height = H + "px";
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv!.width = W * dpr; cv!.height = H * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.max(W * 0.5, 260); cx = W / 2; cy = H + R * 0.22; // center below view -> shallow dome
      pts = [];
      const rings = 54;
      for (let i = 0; i <= rings; i++) {
        const lat = -Math.PI / 2 + (Math.PI * i) / rings;
        const r = Math.cos(lat), y = Math.sin(lat);
        const n = Math.max(3, Math.round(Math.cos(lat) * rings * 2));
        for (let j = 0; j < n; j++) {
          const lon = (2 * Math.PI * j) / n;
          pts.push({ x: r * Math.cos(lon), y, z: r * Math.sin(lon) });
        }
      }
    }

    function frame(t: number) {
      ctx!.clearRect(0, 0, W, H);
      const a = reduce ? 0.6 : t * 0.00007;
      const ca = Math.cos(a), sa = Math.sin(a);
      for (const p of pts) {
        const x = p.x * ca - p.z * sa;
        const z = p.x * sa + p.z * ca;
        const px = cx + x * R;
        const py = cy - p.y * R;
        if (py > H + 4 || py < -4) continue;
        const front = z > -0.05;
        const depth = (z + 1) / 2;
        const top = (p.y + 1) / 2;
        const alpha = (front ? 0.85 : 0.12) * (0.25 + top * 0.9) * (0.4 + depth * 0.7);
        if (alpha <= 0.02) continue;
        const size = front ? 0.7 + depth * 1.0 : 0.6;
        const cyan = Math.min(1, top * 1.2);
        const rC = Math.round(47 + (38 - 47) * cyan);
        const gC = Math.round(107 + (211 - 107) * cyan);
        const bC = Math.round(255 + (238 - 255) * cyan);
        ctx!.beginPath();
        ctx!.fillStyle = "rgba(" + rC + "," + gC + "," + bC + "," + Math.min(1, alpha) + ")";
        ctx!.arc(px, py, size, 0, 6.283);
        ctx!.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    build();
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // navigation + email capture
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const submit = () => {
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      router.push(`/dashboard/events/new`);
    } else {
      emailRef.current?.focus();
    }
  };

  return (
    <ClientRouter>
    <div className="gemm-root" ref={rootRef}>
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="wrap nav-inner">
          <div className="brand"><span className="logo">g</span>gemm</div>
          <div className="nav-links">
            <a href="/auth/login">Login</a>
            <a href="/contact">Book Demo</a>
          </div>
          <div className="nav-right">
            <button className="btn btn-primary" onClick={() => router.push("/dashboard/events/new")}>Create Event</button>
          </div>
        </div>
      </nav>

      <header className="hero wrap">
        <h1 className="display">Your Free All-in-One<br />Ticketing platform</h1>
        <p>gemm is an all-in-one modern event dashboard built for the modern generation.</p>
        <div className="hero-cta">
          <button className="btn btn-primary" onClick={() => router.push("/dashboard/events/new")}>Create Event</button>
          <button className="btn btn-ghost" onClick={() => router.push("/contact")}>▦ Book Demo</button>
        </div>

        {/* DASHBOARD MOCKUP */}
        <div className="mock-shell reveal">
          <div className="mock">
            {/* sidebar */}
            <aside className="side">
              <div className="org">
                <div className="org-ic" />
                <div className="org-t">TurnUp LLC<span>Organization</span></div>
                <div className="chev">⌄</div>
              </div>
              <div className="nav-label">General</div>
              <div className="side-item active"><i />Overview</div>
              <div className="side-item"><i />Attendees</div>
              <div className="side-item"><i />Gallery</div>
              <div className="side-item"><i />Team</div>
              <div className="nav-label">Advanced</div>
              <div className="side-item"><i />My Events</div>
              <div className="side-item"><i />Marketing</div>
              <div className="side-item arr"><i />Finance</div>
              <div className="side-item arr"><i />Settings</div>
              <div className="side-user">
                <div className="av" />
                <div className="t">Solomon G<span>eventiscaron@gmail.com</span></div>
              </div>
            </aside>

            {/* main */}
            <div className="main">
              <div className="topbar">
                <div className="crumb"><span className="sq" /> Overview / <b>Y2K Party</b> ⌄</div>
                <div className="stripe">View Stripe Dashboard →</div>
              </div>

              {/* KPIs */}
              <div className="kpis">
                <div className="kpi">
                  <div className="lb"><span className="d" />Total Revenue</div>
                  <div className="v">$13,375</div>
                  <div className="s">↑ 100.2% from last month</div>
                </div>
                <div className="kpi">
                  <div className="dot-red" />
                  <div className="lb"><span className="d" />Total Tickets Sold</div>
                  <div className="v">450</div>
                  <div className="s">↑ 63% from last month</div>
                </div>
                <div className="kpi">
                  <div className="lb"><span className="d" />Checked In / Tickets</div>
                  <div className="v">450/447</div>
                  <div className="s">↑ 97% from last month</div>
                </div>
                <div className="kpi">
                  <div className="lb"><span className="d" />Peak Sales Period</div>
                  <div className="v">Apr 7th – 9th</div>
                  <div className="s mut">Peak value: 651 tickets</div>
                </div>
              </div>

              {/* Revenue + Tickets */}
              <div className="row2">
                <div className="panel">
                  <div className="panel-h">
                    <div><div className="tt">All Revenue ⌄</div><div className="st">Revenue across all your events</div></div>
                    <div className="tabs"><span>All Time</span><span>Last Month</span><span>Last Week</span><span className="on">Today</span><span>Range</span></div>
                  </div>
                  <div className="chart">
                    <svg viewBox="0 0 500 150" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="#2f6bff" stopOpacity=".55" />
                          <stop offset="1" stopColor="#2f6bff" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,146 C140,144 250,138 320,120 C378,105 420,72 500,10 L500,150 L0,150 Z" fill="url(#rev)" />
                      <path d="M0,146 C140,144 250,138 320,120 C378,105 420,72 500,10" fill="none" stroke="#4d8bff" strokeWidth="2" />
                    </svg>
                    <div className="xaxis"><span>31 Mar</span><span>1 Apr</span><span>4 Apr</span><span>7 Apr</span><span>8 Apr</span></div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-h"><div><div className="tt">All Tickets ⌄</div><div className="st">Count / Share</div></div></div>
                  <div className="donut-wrap">
                    <div className="donut">
                      <svg viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#161a22" strokeWidth="14" />
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#26d3ee" strokeWidth="14"
                          strokeDasharray="153 302" strokeDashoffset="0" transform="rotate(-90 60 60)" strokeLinecap="round" />
                        <circle cx="60" cy="60" r="48" fill="none" stroke="#2f6bff" strokeWidth="14"
                          strokeDasharray="124 302" strokeDashoffset="-160" transform="rotate(-90 60 60)" strokeLinecap="round" />
                      </svg>
                      <div className="ctr">450</div>
                    </div>
                    <div className="legend">
                      <div className="leg"><span className="dt" style={{ background: "#26d3ee" }} /><span className="nm">General Ticket <b>· Y2K Party</b></span><span className="rt">229</span><span className="pc">50.9%</span></div>
                      <div className="leg"><span className="dt" style={{ background: "#2f6bff" }} /><span className="nm">Wave 1 Tickets <b>· Y2K Party</b></span><span className="rt">186</span><span className="pc">41.1%</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div className="rowbtm">
                <div className="panel">
                  <div className="panel-h">
                    <div><div className="tt">Revenue from Top-Grossing Event ⌄</div><div className="st">Top grossing event</div></div>
                    <div className="tabs"><span>All Time</span><span>Last Month</span><span>Last Week</span><span className="on">Today</span><span>Range</span></div>
                  </div>
                  <div className="bars">
                    <div className="bargrp"><div className="bar" style={{ height: "82%" }} /></div>
                    <div className="bargrp"><div className="bar" style={{ height: "58%" }} /></div>
                    <div className="bargrp"><div className="bar" style={{ height: "70%" }} /></div>
                    <div className="bargrp"><div className="bar" style={{ height: "40%" }} /></div>
                    <div className="bargrp"><div className="bar" style={{ height: "64%" }} /></div>
                    <div className="bargrp"><div className="bar" style={{ height: "50%" }} /></div>
                  </div>
                  <div className="btm-legend">
                    <span><span className="dt" style={{ background: "#4d8bff" }} />VIP Tickets · $7K</span>
                    <span><span className="dt" style={{ background: "#26d3ee" }} />Wave 2 Tickets · $6K</span>
                    <span><span className="dt" style={{ background: "#2f6bff" }} />General Ticket · $2K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HOSTS CARD */}
      <section className="hosts-sec wrap">
        <div className="hosts-card reveal">
          <span className="pill">Made for the hosts</span>
          <h2 className="display">World&apos;s Best<span className="fade">Event Tickets</span></h2>
          <div className="globe-box">
            <div className="globe-glow" />
            <canvas ref={globeRef} className="globe-canvas" />
          </div>
          <div className="cols3">
            <div>
              <h3>Reach the Right Crowd</h3>
              <p>Promote your events to an audience that&apos;s ready to attend—no noise, just real turnout.</p>
            </div>
            <div>
              <h3>Simple, Powerful Ticketing</h3>
              <p>Trigger functions automatically for dynamic app behavior.</p>
            </div>
            <div>
              <h3>Real-Time Insights</h3>
              <p>Track sales, optimize performance, and make data-driven decisions—all in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="feat4 wrap reveal">
        <div className="f">
          <div className="fi">📣</div>
          <h4>Built-In Marketing Tools</h4>
          <p>Send targeted SMS and email blasts to boost attendance and keep your audience engaged.</p>
        </div>
        <div className="f">
          <div className="fi">📊</div>
          <h4>Know Your Audience</h4>
          <p>Access real-time insights to understand who&apos;s attending and how your events are performing.</p>
        </div>
        <div className="f">
          <div className="fi">⚙️</div>
          <h4>Customizable Event Pages</h4>
          <p>Easily tailor your event listings with descriptions, ticket tiers, and branding to match your vibe.</p>
        </div>
        <div className="f">
          <div className="fi">🖼️</div>
          <h4>Post-Event Galleries</h4>
          <p>Upload and showcase event photos to drive FOMO, increase engagement, and build your brand.</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta">
        <div className="wrap reveal">
          <h2 className="display">Ready to host with gemm?</h2>
          <p>Create your first event, connect with your audience, and start selling tickets in minutes—no tech skills required.</p>
          <div className="cta-form">
            <input
              ref={emailRef}
              type="email"
              placeholder="Your Work Email"
              aria-label="Your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
            <button className="btn btn-primary" onClick={submit}>Get started</button>
          </div>
          <div className="cta-sales">Not sure where to start? <a href="/contact">Talk to sales</a></div>
        </div>
      </section>

      <footer>© 2026 gemm — Built for the modern generation.</footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

        html{scroll-behavior:smooth}

        .gemm-root{
          --bg:#050508; --bg-2:#080a10; --card:#0c0e14; --card-2:#101319;
          --line:rgba(255,255,255,.07); --line-2:rgba(255,255,255,.11);
          --text:#f4f6fa; --muted:#8a909c; --muted-2:#5f6470;
          --blue:#2f6bff; --blue-2:#4d8bff; --cyan:#26d3ee; --green:#22c55e; --red:#f0546a;
          background:var(--bg); color:var(--text);
          font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased;
          overflow-x:hidden; min-height:100vh;
        }
        .gemm-root *{box-sizing:border-box;margin:0;padding:0}
        .gemm-root .display{font-family:'Plus Jakarta Sans','Inter',sans-serif}
        .gemm-root a{color:inherit;text-decoration:none}
        .gemm-root .wrap{max-width:1080px;margin:0 auto;padding:0 24px}

        /* NAV */
        .gemm-root nav{position:sticky;top:0;z-index:50;background:rgba(5,5,8,.72);
          backdrop-filter:blur(14px);border-bottom:1px solid transparent;transition:border-color .3s}
        .gemm-root nav.scrolled{border-bottom-color:var(--line)}
        .gemm-root .nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px}
        .gemm-root .brand{display:flex;align-items:center;gap:9px;font-weight:700;font-size:18px;letter-spacing:-.02em}
        .gemm-root .logo{width:26px;height:26px;border-radius:8px;background:linear-gradient(150deg,#4d8bff,#26d3ee);
          display:grid;place-items:center;color:#04121f;font-weight:800;font-size:15px;
          font-family:'Plus Jakarta Sans',sans-serif;box-shadow:0 0 18px rgba(45,110,255,.45)}
        .gemm-root .nav-links{display:flex;align-items:center;gap:30px;font-size:14px;color:var(--muted)}
        .gemm-root .nav-links a:hover{color:var(--text)}
        .gemm-root .nav-right{display:flex;align-items:center;gap:16px}
        .gemm-root .btn{font-family:'Inter',sans-serif;font-weight:600;font-size:14px;border:none;cursor:pointer;
          border-radius:9px;padding:9px 16px;display:inline-flex;align-items:center;gap:8px;transition:.18s}
        .gemm-root .btn-primary{background:var(--blue);color:#fff;box-shadow:0 6px 20px rgba(47,107,255,.35)}
        .gemm-root .btn-primary:hover{background:var(--blue-2);transform:translateY(-1px)}
        .gemm-root .btn-ghost{background:transparent;color:var(--text)}
        .gemm-root .btn-ghost:hover{color:var(--muted)}
        @media(max-width:760px){.gemm-root .nav-links{display:none}}

        /* HERO */
        .gemm-root .hero{text-align:center;padding:78px 0 40px;position:relative}
        .gemm-root .hero::before{content:"";position:absolute;top:-40px;left:50%;transform:translateX(-50%);
          width:620px;height:420px;max-width:90vw;
          background:radial-gradient(ellipse at center,rgba(47,107,255,.20),transparent 62%);filter:blur(20px);z-index:-1}
        .gemm-root .hero h1{font-size:clamp(40px,7vw,66px);line-height:1.02;font-weight:800;letter-spacing:-.03em;margin-bottom:22px}
        .gemm-root .hero p{color:var(--muted);font-size:17px;line-height:1.55;max-width:430px;margin:0 auto 30px}
        .gemm-root .hero-cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
        .gemm-root .hero-cta .btn{padding:11px 22px;font-size:15px}

        /* DASHBOARD MOCKUP */
        .gemm-root .mock-shell{margin-top:56px;position:relative}
        .gemm-root .mock-shell::before{content:"";position:absolute;inset:-1px;border-radius:22px;
          background:linear-gradient(180deg,rgba(77,139,255,.28),rgba(255,255,255,0) 45%);z-index:0}
        .gemm-root .mock{position:relative;z-index:1;background:linear-gradient(180deg,#0b0d13,#070810);
          border:1px solid var(--line);border-radius:22px;overflow:hidden;
          box-shadow:0 40px 120px -30px rgba(0,0,0,.9);display:flex;min-height:520px}
        .gemm-root .side{width:190px;border-right:1px solid var(--line);padding:14px 12px;flex-shrink:0;display:flex;flex-direction:column}
        .gemm-root .org{display:flex;align-items:center;gap:9px;padding:8px;border:1px solid var(--line);border-radius:11px;margin-bottom:18px}
        .gemm-root .org-ic{width:30px;height:30px;border-radius:8px;background:linear-gradient(150deg,#4d8bff,#2f6bff);flex-shrink:0}
        .gemm-root .org-t{font-size:12.5px;font-weight:600;line-height:1.25}
        .gemm-root .org-t span{display:block;font-size:10.5px;color:var(--muted-2);font-weight:400}
        .gemm-root .chev{margin-left:auto;color:var(--muted-2);font-size:11px}
        .gemm-root .nav-label{font-size:10px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted-2);padding:0 8px;margin:14px 0 7px}
        .gemm-root .nav-label:first-child{margin-top:0}
        .gemm-root .side-item{display:flex;align-items:center;gap:10px;padding:7px 9px;border-radius:8px;font-size:12.5px;color:var(--muted);cursor:pointer}
        .gemm-root .side-item i{width:14px;height:14px;border-radius:4px;background:currentColor;opacity:.6;flex-shrink:0;display:inline-block}
        .gemm-root .side-item:hover{background:rgba(255,255,255,.03);color:var(--text)}
        .gemm-root .side-item.active{background:rgba(255,255,255,.06);color:var(--text)}
        .gemm-root .side-item.arr::after{content:"›";margin-left:auto;color:var(--muted-2)}
        .gemm-root .side-user{margin-top:auto;display:flex;align-items:center;gap:9px;padding:8px;border:1px solid var(--line);border-radius:11px}
        .gemm-root .side-user .av{width:28px;height:28px;border-radius:8px;background:linear-gradient(150deg,#22c55e,#16a34a);flex-shrink:0}
        .gemm-root .side-user .t{font-size:11.5px;font-weight:600;line-height:1.2;overflow:hidden}
        .gemm-root .side-user .t span{display:block;font-size:10px;color:var(--muted-2);font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

        .gemm-root .main{flex:1;padding:16px 18px;min-width:0}
        .gemm-root .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .gemm-root .crumb{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--muted)}
        .gemm-root .crumb b{color:var(--text);font-weight:600}
        .gemm-root .crumb .sq{width:15px;height:15px;border:1px solid var(--line-2);border-radius:4px;display:inline-block}
        .gemm-root .stripe{font-size:12px;color:var(--blue-2)}

        .gemm-root .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
        .gemm-root .kpi{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px;position:relative}
        .gemm-root .kpi .lb{font-size:10.5px;color:var(--muted);display:flex;align-items:center;gap:5px;margin-bottom:9px}
        .gemm-root .kpi .lb .d{width:10px;height:10px;border-radius:3px;background:rgba(255,255,255,.14)}
        .gemm-root .kpi .v{font-size:20px;font-weight:700;letter-spacing:-.02em;font-family:'Plus Jakarta Sans',sans-serif}
        .gemm-root .kpi .s{font-size:10px;color:var(--green);margin-top:4px}
        .gemm-root .kpi .s.red{color:var(--red)}
        .gemm-root .kpi .s.mut{color:var(--muted-2)}
        .gemm-root .kpi .dot-red{position:absolute;top:12px;right:12px;width:6px;height:6px;border-radius:50%;background:var(--red)}

        .gemm-root .row2{display:grid;grid-template-columns:1.55fr 1fr;gap:10px;margin-bottom:14px}
        .gemm-root .panel{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:13px 14px}
        .gemm-root .panel-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:2px}
        .gemm-root .panel-h .tt{font-size:13px;font-weight:600}
        .gemm-root .panel-h .st{font-size:10.5px;color:var(--muted-2)}
        .gemm-root .tabs{display:flex;gap:4px}
        .gemm-root .tabs span{font-size:9.5px;color:var(--muted-2);padding:3px 7px;border-radius:6px;cursor:pointer}
        .gemm-root .tabs span.on{background:rgba(255,255,255,.08);color:var(--text)}
        .gemm-root .chart{margin-top:10px}
        .gemm-root .chart svg{width:100%;height:auto;display:block}
        .gemm-root .xaxis{display:flex;justify-content:space-between;font-size:8.5px;color:var(--muted-2);margin-top:6px;padding:0 2px}

        .gemm-root .donut-wrap{display:flex;flex-direction:column;align-items:center;margin-top:6px}
        .gemm-root .donut{position:relative;width:120px;height:120px}
        .gemm-root .donut .ctr{position:absolute;inset:0;display:grid;place-items:center;font-size:22px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif}
        .gemm-root .legend{width:100%;margin-top:12px;display:flex;flex-direction:column;gap:8px}
        .gemm-root .leg{display:flex;align-items:center;gap:8px;font-size:11px}
        .gemm-root .leg .dt{width:8px;height:8px;border-radius:2px}
        .gemm-root .leg .nm{color:var(--muted)}
        .gemm-root .leg .nm b{color:var(--text);font-weight:400}
        .gemm-root .leg .rt{margin-left:auto;color:var(--text);font-weight:600}
        .gemm-root .leg .pc{color:var(--muted-2);width:38px;text-align:right}

        .gemm-root .rowbtm{display:grid;grid-template-columns:1fr;gap:10px}
        .gemm-root .bars{display:flex;align-items:flex-end;gap:14px;height:70px;margin-top:14px;padding:0 4px}
        .gemm-root .bargrp{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1}
        .gemm-root .bar{width:100%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,#4d8bff,#2f6bff)}
        .gemm-root .btm-legend{display:flex;gap:16px;font-size:10px;color:var(--muted);margin-top:10px}
        .gemm-root .btm-legend .dt{display:inline-block;width:7px;height:7px;border-radius:2px;margin-right:5px}
        .gemm-root .buys{display:flex;flex-direction:column;gap:9px;margin-top:12px}
        .gemm-root .buy{display:flex;align-items:center;gap:9px;font-size:11px}
        .gemm-root .buy .av{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;font-size:9px;font-weight:700;color:#fff;flex-shrink:0}
        .gemm-root .buy .em{color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .gemm-root .buy .amt{margin-left:auto;font-weight:600}

        @media(max-width:900px){
          .gemm-root .side{display:none}
          .gemm-root .kpis{grid-template-columns:repeat(2,1fr)}
          .gemm-root .row2,.gemm-root .rowbtm{grid-template-columns:1fr}
        }

        /* HOSTS CARD */
        .gemm-root .hosts-sec{margin-top:110px}
        .gemm-root .hosts-card{position:relative;border:1px solid var(--line);border-radius:24px;overflow:hidden;
          background:radial-gradient(120% 90% at 50% 0%,#0a0d16,#050609 62%);padding:44px 24px 0;text-align:center}
        .gemm-root .pill{display:inline-block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;
          color:var(--blue-2);border:1px solid rgba(77,139,255,.35);padding:7px 15px;border-radius:100px;
          background:rgba(47,107,255,.08);margin-bottom:22px}
        .gemm-root .hosts-card h2{font-size:clamp(42px,8vw,84px);line-height:.94;font-weight:800;letter-spacing:-.04em}
        .gemm-root .hosts-card h2 .fade{display:block;
          background:linear-gradient(180deg,#e9edf5 6%,#3a4256 60%,#0a0d14 100%);
          -webkit-background-clip:text;background-clip:text;color:transparent}
        .gemm-root .globe-box{position:relative;height:190px;margin-top:-40px;pointer-events:none}
        .gemm-root .globe-canvas{position:absolute;left:50%;bottom:0;transform:translateX(-50%)}
        .gemm-root .globe-glow{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);
          width:560px;height:150px;max-width:100%;
          background:radial-gradient(ellipse at center,rgba(47,107,255,.30),transparent 70%);filter:blur(8px)}
        .gemm-root .cols3{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;text-align:left;
          max-width:760px;margin:0 auto;padding:26px 6px 44px;position:relative;z-index:2}
        .gemm-root .cols3 h3{font-size:15px;font-weight:700;margin-bottom:9px}
        .gemm-root .cols3 p{font-size:12.5px;color:var(--muted);line-height:1.55}

        /* FEATURES 4 */
        .gemm-root .feat4{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;margin-top:66px}
        .gemm-root .feat4 .fi{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;font-size:15px;
          background:rgba(47,107,255,.12);border:1px solid rgba(77,139,255,.28);color:var(--blue-2);margin-bottom:16px}
        .gemm-root .feat4 h4{font-size:14px;font-weight:700;margin-bottom:9px}
        .gemm-root .feat4 p{font-size:12.5px;color:var(--muted);line-height:1.6}

        /* FINAL CTA */
        .gemm-root .cta{position:relative;margin-top:120px;padding:96px 0 110px;text-align:center;overflow:hidden}
        .gemm-root .cta::before{content:"";position:absolute;inset:0;
          background:
            radial-gradient(circle at 50% 62%,rgba(47,107,255,.10),transparent 60%),
            radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,.25),transparent),
            radial-gradient(1px 1px at 70% 22%,rgba(255,255,255,.18),transparent),
            radial-gradient(1px 1px at 40% 72%,rgba(255,255,255,.15),transparent),
            radial-gradient(1px 1px at 85% 55%,rgba(255,255,255,.20),transparent),
            radial-gradient(1px 1px at 12% 66%,rgba(255,255,255,.15),transparent)}
        .gemm-root .cta>.wrap{position:relative;z-index:1}
        .gemm-root .cta h2{font-size:clamp(30px,5.5vw,46px);font-weight:800;letter-spacing:-.03em;margin-bottom:16px}
        .gemm-root .cta p{color:var(--muted);font-size:15px;line-height:1.6;max-width:440px;margin:0 auto 30px}
        .gemm-root .cta-form{display:flex;gap:8px;max-width:420px;margin:0 auto;
          border:1px solid var(--line-2);border-radius:12px;padding:6px;background:rgba(255,255,255,.02)}
        .gemm-root .cta-form input{flex:1;background:transparent;border:none;outline:none;color:var(--text);
          font-family:inherit;font-size:14px;padding:8px 12px}
        .gemm-root .cta-form input::placeholder{color:var(--muted-2)}
        .gemm-root .cta-sales{margin-top:18px;font-size:12.5px;color:var(--muted)}
        .gemm-root .cta-sales a{color:var(--blue-2)}
        .gemm-root .cta-done{max-width:420px;margin:0 auto;padding:16px;border-radius:12px;
          border:1px solid rgba(77,139,255,.35);background:rgba(47,107,255,.08);color:var(--text);font-size:14px}
        .gemm-root .kpi{transition:border-color .2s,transform .2s}
        .gemm-root .kpi:hover{border-color:var(--line-2);transform:translateY(-2px)}
        .gemm-root .feat4 .f{transition:transform .2s}
        .gemm-root .feat4 .f:hover{transform:translateY(-3px)}

        @media(max-width:900px){
          .gemm-root .cols3{grid-template-columns:1fr;gap:22px;max-width:340px}
          .gemm-root .feat4{grid-template-columns:repeat(2,1fr);gap:28px}
        }
        @media(max-width:520px){.gemm-root .feat4{grid-template-columns:1fr}}

        .gemm-root footer{border-top:1px solid var(--line);padding:26px 0;text-align:center;color:var(--muted-2);font-size:12.5px;background:#04060b}

        .gemm-root .reveal{opacity:1;transform:none;transition:opacity .7s ease,transform .7s ease}
        .gemm-root .reveal.in{opacity:1;transform:none}
        @media(prefers-reduced-motion:reduce){
          .gemm-root .reveal{opacity:1;transform:none;transition:none}
          html{scroll-behavior:auto}
        }
      `}</style>
    </div>
    </ClientRouter>
  );
}
