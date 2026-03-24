"use client";

// components/ClientRouter.tsx
// Checks window.location.pathname and renders the right component
// - /event/[id]      → EventView
// - /event-success   → EventSuccess (order confirmation + ticket display)
// - /[username]      → ProfileView (if not a known route)
// - /                → null (let the landing page render)

import { useState, useEffect } from "react";
import ProfileView from "@/components/ProfileView";
import EventView from "@/components/EventView";
import EventSuccess from "@/components/EventSuccess";
import StaffCheckin from "@/components/StaffCheckin";
import ShopSuccess from "@/components/ShopSuccess";

const KNOWN_ROUTES = [
  "/", "/dashboard", "/onboarding", "/events", "/pricing",
  "/contact", "/create", "/welcome", "/auth", "/404",
  "/event-success",
  "/staff/checkin",
  "/privacy",
  "/eula",
];

export default function ClientRouter({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<{
    type: "landing" | "profile" | "event" | "event-success" | "staff-checkin" | "shop-success";
    param?: string;
  }>({ type: "landing" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;

    // /event-success?orderId=xxx
    if (path === "/staff/checkin") {
      setRoute({ type: "staff-checkin" });
      setReady(true);
      return;
    }
    if (path === "/event-success") {
      setRoute({ type: "event-success" });
      setReady(true);
      return;
    }
    if (path === "/shop-success") {
      setRoute({ type: "shop-success" });
      setReady(true);
      return;
    }

    // /event/[id]
    if (path.startsWith("/event/")) {
      const id = path.split("/event/")[1]?.split("/")[0];
      if (id) { setRoute({ type: "event", param: id }); setReady(true); return; }
    }

    // Known routes → landing
    if (path === "/privacy" || path === "/eula") {
      // Let Next.js handle these pages natively
      setReady(true);
      return;
    }
    if (["/privacy", "/eula", "/pricing", "/contact", "/events", "/gemm-admin-x7k"].includes(path)) {
      setReady(true);
      return;
    }
    if (path === "/" ) {
      setRoute({ type: "landing" });
      setReady(true);
      return;
    }
    const isKnown = KNOWN_ROUTES.some(r => path === r || path.startsWith(r + "/"));
    if (isKnown) {
      setRoute({ type: "landing" });
      setReady(true);
      return;
    }

    // /dashboard paths
    if (path.startsWith("/dashboard")) {
      setRoute({ type: "landing" });
      setReady(true);
      return;
    }

    // /[username]
    const username = path.slice(1).split("/")[0].replace(/^@/, "");
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

  if (route.type === "shop-success") {
    return <ShopSuccess />;
  }
  if (route.type === "staff-checkin") {
    return <StaffCheckin />;
  }
  if (route.type === "event-success") {
    return <EventSuccess />;
  }

  if (route.type === "profile" && route.param) {
    return <ProfileView username={route.param} />;
  }

  if (route.type === "event" && route.param) {
    return <EventView eventId={route.param} />;
  }

  // Landing page
  return <>{children}</>;
}