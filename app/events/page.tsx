"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  title: string;
  startDate?: string;
  startTime?: string;
  endTime?: string;
  venueName?: string;
  address?: string;
  city?: string;
  state?: string;
  flyerURL?: string;
  shortDescription?: string;
  status?: string;
}

function formatDate(d?: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
}

function formatTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<Event | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(firestore, "events"), where("active", "==", true));
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Event));
        data.sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
        setEvents(data);
      } catch (e) {
        // fallback: load all events
        try {
          const snap = await getDocs(collection(firestore, "events"));
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Event));
          data.sort((a, b) => (a.startDate || "").localeCompare(b.startDate || ""));
          setEvents(data);
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = events.filter(e =>
    !search ||
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.venueName?.toLowerCase().includes(search.toLowerCase()) ||
    e.city?.toLowerCase().includes(search.toLowerCase())
  );

  const previewEvent = hovered || (filtered.length > 0 ? filtered[0] : null);

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <style>{".events-preview-panel { display: block; } @media (max-width: 768px) { .events-preview-panel { display: none; } }"}</style>
      <div style={{ padding: "32px clamp(16px, 5vw, 40px) 0", display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={() => router.push("/")} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", borderRadius: 20, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}>← GO HOME</button>
      </div>
      <div style={{ padding: "40px clamp(16px, 5vw, 40px) 0" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", opacity: 0.4, marginBottom: 8 }}>✦ OFFICIAL SCHEDULE</div>
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, margin: "0 0 32px", background: "linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.3))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>LIVE EVENTS</h1>
        <div style={{ maxWidth: 520, marginBottom: 32 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artists, venues..." style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 40, padding: "12px 20px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 0, padding: "0 clamp(16px, 5vw, 40px) 64px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ opacity: 0.4, fontSize: 14, padding: "40px 0" }}>Loading events...</div>
          ) : filtered.length === 0 ? (
            <div style={{ opacity: 0.4, fontSize: 14, padding: "40px 0" }}>No events found.</div>
          ) : filtered.map(event => (
            <div key={event.id}
              onMouseEnter={() => setHovered(event)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => router.push(`/event/${event.id}`)}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", borderRadius: 8, background: hovered?.id === event.id ? "rgba(255,255,255,0.04)" : "transparent", transition: "background 0.15s" }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {event.flyerURL ? <img src={event.flyerURL} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 20, opacity: 0.3 }}>✦</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event.title}</div>
                <div style={{ fontSize: 11, opacity: 0.45, fontWeight: 600, letterSpacing: "0.05em" }}>{event.startDate && formatDate(event.startDate)}</div>
                <div style={{ fontSize: 11, opacity: 0.35, marginTop: 2 }}>{event.venueName}{event.city ? ` • ${event.city}${event.state ? `, ${event.state}` : ""}` : ""}</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, opacity: hovered?.id === event.id ? 1 : 0.4, transition: "opacity 0.15s" }}>→</div>
            </div>
          ))}
        </div>
        {previewEvent && (
          <div className="events-preview-panel" style={{ width: 320, marginLeft: 40, flexShrink: 0, position: "sticky", top: 32, alignSelf: "flex-start" }}>
            <div style={{ borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ width: "100%", aspectRatio: "1/1", background: "rgba(255,255,255,0.05)" }}>
                {previewEvent.flyerURL ? <img src={previewEvent.flyerURL} alt={previewEvent.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.2, fontSize: 40 }}>✦</div>}
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, lineHeight: 1.2 }}>{previewEvent.title}</div>
                {previewEvent.startDate && <div style={{ fontSize: 12, opacity: 0.5, fontWeight: 600, marginBottom: 4 }}>{formatDate(previewEvent.startDate)}</div>}
                {previewEvent.startTime && <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 8 }}>{formatTime(previewEvent.startTime)}{previewEvent.endTime ? ` – ${formatTime(previewEvent.endTime)}` : ""} CST</div>}
                {previewEvent.venueName && <div style={{ fontSize: 12, opacity: 0.35, marginBottom: 16 }}>{previewEvent.venueName}{previewEvent.address ? ` • ${previewEvent.address}` : ""}</div>}
                <button onClick={() => router.push(`/event/${previewEvent.id}`)} style={{ width: "100%", padding: "14px", background: "#fff", color: "#000", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: "pointer", letterSpacing: "0.05em" }}>GET TICKETS</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
