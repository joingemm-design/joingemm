"use client";

// components/ClientRouter.tsx
// Checks window.location.pathname and renders the right component
// - /event/[id]      → EventView
// - /event-success   → EventSuccess (order confirmation + ticket display)
// - /[username]      → ProfileView (if not a known route)
// - /                → null (let the landing page render)

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Loader = () => (
  <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", animation: "pulse 1.5s ease infinite" }} />
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
  </div>
);

const ProfileView = dynamic(() => import("@/components/ProfileView"), { ssr: false, loading: Loader });
const SecondSundayProfileView = dynamic(() => import("@/components/SecondSundayProfileView"), { ssr: false, loading: Loader });
const AMPProfileView = dynamic(() => import("@/components/AMPProfileView"), { ssr: false, loading: Loader });
const DatersAndDoersPage = dynamic(() => import("@/components/DatersAndDoersPage"), { ssr: false, loading: Loader });
const CreatorShopView = dynamic(() => import("@/components/CreatorShopView"), { ssr: false, loading: Loader });
const CreatorServicesView = dynamic(() => import("@/components/CreatorServicesView"), { ssr: false, loading: Loader });
const BrockAboutView = dynamic(() => import("@/components/BrockAboutView"), { ssr: false, loading: Loader });
const BrockMusicView = dynamic(() => import("@/components/BrockMusicView"), { ssr: false, loading: Loader });
const BrockPressView = dynamic(() => import("@/components/BrockPressView"), { ssr: false, loading: Loader });
const BrockCollabsView = dynamic(() => import("@/components/BrockCollabsView"), { ssr: false, loading: Loader });
const EventView = dynamic(() => import("@/components/EventView"), { ssr: false, loading: Loader });
const EventSuccess = dynamic(() => import("@/components/EventSuccess"), { ssr: false, loading: Loader });
const StaffCheckin = dynamic(() => import("@/components/StaffCheckin"), { ssr: false, loading: Loader });
const ShopSuccess = dynamic(() => import("@/components/ShopSuccess"), { ssr: false, loading: Loader });

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
    type: "landing" | "profile" | "event" | "second-sunday" | "amp" | "daters-and-doers" | "event-success" | "staff-checkin" | "shop-success" | "creator-shop" | "creator-services" | "creator-about" | "creator-collabs" | "creator-music" | "creator-press";
    param?: string;
  }>({ type: "landing" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;


    if (window.location.hostname === "ampexhibit.com" || window.location.hostname === "www.ampexhibit.com") {
      setRoute({ type: "amp" });
      setReady(true);
      return;
    }
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

    // /[username]/shop or /[username]/services
    const parts = path.slice(1).split("/");
    if (parts.length === 2 && parts[1] === "shop") {
      setRoute({ type: "creator-shop", param: parts[0].replace(/^@/, "") });
      setReady(true);
      return;
    }
    if (parts.length === 2 && parts[1] === "services") {
      setRoute({ type: "creator-services", param: parts[0].replace(/^@/, "") });
      setReady(true);
      return;
    }
    if (parts.length === 2 && parts[1] === "about") {
      setRoute({ type: "creator-about", param: parts[0].replace(/^@/, "") });
      setReady(true);
      return;
    }
    if (parts.length === 2 && parts[1] === "collabs") {
      setRoute({ type: "creator-collabs", param: parts[0].replace(/^@/, "") });
      setReady(true);
      return;
    }
    if (parts.length === 2 && parts[1] === "music") {
      setRoute({ type: "creator-music", param: parts[0].replace(/^@/, "") });
      setReady(true);
      return;
    }
    if (parts.length === 2 && parts[1] === "press") {
      setRoute({ type: "creator-press", param: parts[0].replace(/^@/, "") });
      setReady(true);
      return;
    }

    if (path === "/datersanddoers" || path.startsWith("/datersanddoers/")) {
      window.location.replace("/");
      return;
    }
    if (path === "/secondsundaystl" || path.startsWith("/secondsundaystl/")) {
      setRoute({ type: "second-sunday" });
      setReady(true);
      return;
    }
    if (path === "/amp" || path.startsWith("/amp/")) {
      setRoute({ type: "amp" });
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

  if (route.type === "creator-shop" && route.param) {
    return <CreatorShopView username={route.param} />;
  }
  if (route.type === "creator-services" && route.param) {
    return <CreatorServicesView username={route.param} />;
  }
  if (route.type === "creator-about" && route.param) {
    return <BrockAboutView username={route.param} />;
  }
  if (route.type === "creator-collabs" && route.param) {
    return <BrockCollabsView username={route.param} />;
  }
  if (route.type === "creator-music" && route.param) {
    return <BrockMusicView username={route.param} />;
  }
  if (route.type === "creator-press" && route.param) {
    return <BrockPressView username={route.param} />;
  }
  if (route.type === "daters-and-doers") {
    return <DatersAndDoersPage />;
  }
  if (route.type === "second-sunday") {
    return <SecondSundayProfileView />;
  }
  if (route.type === "amp") {
    return <AMPProfileView />;
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