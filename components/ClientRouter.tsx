"use client";

// components/ClientRouter.tsx
// Checks window.location.pathname and renders the right component
// - /event/[id] → EventView
// - /[username] → ProfileView (if not a known route)
// - / → null (let the landing page render)

import { useState, useEffect } from "react";
import ProfileView from "@/components/ProfileView";
import EventView from "@/components/EventView";

const KNOWN_ROUTES = [
  "/", "/dashboard", "/onboarding", "/events", "/pricing",
  "/contact", "/create", "/welcome", "/auth", "/404",
];

export default function ClientRouter({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<{ type: "landing" | "profile" | "event"; param?: string }>({ type: "landing" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;

    // Check for /event/[id]
    if (path.startsWith("/event/")) {
      const id = path.split("/event/")[1]?.split("/")[0];
      if (id) { setRoute({ type: "event", param: id }); setReady(true); return; }
    }

    // Check if it's a known route (starts with any known prefix)
    const isKnown = KNOWN_ROUTES.some(r => path === r || path.startsWith(r + "/"));
    if (isKnown || path === "/") {
      setRoute({ type: "landing" });
      setReady(true);
      return;
    }

    // Check for /dashboard paths
    if (path.startsWith("/dashboard")) {
      setRoute({ type: "landing" });
      setReady(true);
      return;
    }

    // Otherwise, treat as /[username]
    const username = path.slice(1).split("/")[0];
    if (username && username.length >= 1) {
      setRoute({ type: "profile", param: username });
    } else {
      setRoute({ type: "landing" });
    }
    setReady(true);
  }, []);

  if (!ready) return (
    <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", animation: "pulse 1.5s ease infinite" }} />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );

  if (route.type === "profile" && route.param) {
    return <ProfileView username={route.param} />;
  }

  if (route.type === "event" && route.param) {
    return <EventView eventId={route.param} />;
  }

  // Landing page
  return <>{children}</>;
}
