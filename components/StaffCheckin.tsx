"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

interface Ticket { id: string; type: string; name: string; email: string; checkedIn?: boolean; checkedInAt?: string; }
interface Order { id: string; eventId: string; eventName: string; startDate?: string; startTime?: string; venueName?: string; customerName: string; customerEmail: string; tickets: Ticket[]; }

function formatDate(d?: string) {
  if (!d) return "";
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}
function formatTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function StaffCheckin() {
  const [order, setOrder] = useState<Order | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<"valid" | "already_used" | null>(null);
  const [error, setError] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [correctPin, setCorrectPin] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");
    const ticketId = params.get("ticketId");
    console.log("orderId:", orderId, "ticketId:", ticketId);
    if (!orderId || !ticketId) { setError("Missing order or ticket ID."); setLoading(false); return; }
    async function load() {
      try {
        const snap = await getDoc(doc(firestore, "orders", orderId!));
        if (!snap.exists()) { setError("Order not found."); setLoading(false); return; }
        const data = snap.data();
        const orderData: Order = { id: snap.id, eventId: data.eventId, eventName: data.eventName || "Event", startDate: data.startDate, startTime: data.startTime, venueName: data.venueName, customerName: data.customerName, customerEmail: data.customerEmail, tickets: data.tickets || [] };
        if (data.eventId) {
          const eventSnap = await getDoc(doc(firestore, "events", data.eventId));
          if (eventSnap.exists()) setCorrectPin(eventSnap.data().staffPin || "");
        }
        const foundTicket = orderData.tickets.find(t => t.id === ticketId);
        if (!foundTicket) { setError("Ticket not found in this order."); setLoading(false); return; }
        setOrder(orderData); setTicket(foundTicket);
        setStatus(foundTicket.checkedIn ? "already_used" : "valid");
      } catch { setError("Failed to load order."); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  function handlePinSubmit() {
    if (!pinInput.trim()) return;
    setVerifying(true);
    setTimeout(() => {
      if (pinInput.trim() === correctPin) { setPinVerified(true); setPinError(""); }
      else { setPinError("Incorrect PIN. Please try again."); setPinInput(""); }
      setVerifying(false);
    }, 400);
  }

  async function handleCheckIn() {
    if (!order || !ticket || status !== "valid") return;
    setChecking(true);
    try {
      const updatedTickets = order.tickets.map(t => t.id === ticket.id ? { ...t, checkedIn: true, checkedInAt: new Date().toISOString() } : t);
      await updateDoc(doc(firestore, "orders", order.id), { tickets: updatedTickets });
      setTicket({ ...ticket, checkedIn: true });
      setStatus("already_used");
    } catch { setError("Failed to check in. Try again."); }
    finally { setChecking(false); }
  }

  const accent = status === "valid" ? "#22c55e" : "#ef4444";
  const bg = status === "valid" && pinVerified ? "#0a1f0a" : status === "already_used" && pinVerified ? "#1a0a0a" : "#0a0a0a";

  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Inter',sans-serif", padding: 24, transition: "background 0.4s" }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32, opacity: 0.4, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", color: "#fff" }}>GEMM STAFF</div>
        {loading ? (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading ticket...</div>
        ) : error ? (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: 32, textAlign: "center", color: "#ef4444" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Invalid Ticket</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{error}</div>
          </div>
        ) : !pinVerified ? (
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 8 }}>Staff Access</div>
              <div style={{ fontSize: 13, opacity: 0.4, color: "#fff" }}>Enter your event staff PIN to continue</div>
            </div>
            <input type="number" value={pinInput} onChange={e => setPinInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handlePinSubmit()} placeholder="000000"
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: `1px solid ${pinError ? "#ef4444" : "rgba(255,255,255,0.12)"}`, borderRadius: 12, padding: "16px", color: "#fff", fontSize: 28, fontWeight: 900, textAlign: "center", outline: "none", letterSpacing: "0.2em", boxSizing: "border-box", marginBottom: 12 }} />
            {pinError && <div style={{ color: "#ef4444", fontSize: 12, textAlign: "center", marginBottom: 12 }}>{pinError}</div>}
            <button onClick={handlePinSubmit} disabled={verifying || !pinInput.trim()}
              style={{ width: "100%", padding: "14px", background: "#fff", color: "#000", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: "pointer", opacity: verifying || !pinInput.trim() ? 0.5 : 1, letterSpacing: "0.05em" }}>
              {verifying ? "VERIFYING..." : "ENTER"}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ borderRadius: 16, padding: 32, textAlign: "center", background: `${accent}18`, border: `1px solid ${accent}44`, marginBottom: 24 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>{status === "valid" ? "✅" : "❌"}</div>
              <div style={{ fontWeight: 900, fontSize: 24, color: accent, marginBottom: 8 }}>{status === "valid" ? "VALID TICKET" : "ALREADY CHECKED IN"}</div>
              <div style={{ fontSize: 13, opacity: 0.6, color: "#fff" }}>{status === "valid" ? "This ticket has not been used yet." : "This ticket was already scanned."}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 16, color: "#fff" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", opacity: 0.4, marginBottom: 12 }}>EVENT</div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{order?.eventName}</div>
              {order?.startDate && <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 4 }}>{formatDate(order.startDate)}</div>}
              {order?.startTime && <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 4 }}>{formatTime(order.startTime)} CST</div>}
              {order?.venueName && <div style={{ fontSize: 12, opacity: 0.35 }}>{order.venueName}</div>}
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 24, color: "#fff" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", opacity: 0.4, marginBottom: 12 }}>ATTENDEE</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{ticket?.name || order?.customerName}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>{ticket?.email || order?.customerEmail}</div>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>{ticket?.type || "GENERAL ADMISSION"}</div>
            </div>
            {status === "valid" && (
              <button onClick={handleCheckIn} disabled={checking}
                style={{ width: "100%", padding: "18px", background: accent, color: "#000", border: "none", borderRadius: 14, fontWeight: 900, fontSize: 16, cursor: checking ? "not-allowed" : "pointer", letterSpacing: "0.05em", opacity: checking ? 0.7 : 1, transition: "opacity 0.2s" }}>
                {checking ? "CHECKING IN..." : "✓ CHECK IN ATTENDEE"}
              </button>
            )}
            {status === "already_used" && ticket?.checkedInAt && (
              <div style={{ textAlign: "center", fontSize: 12, opacity: 0.4, color: "#fff" }}>
                Checked in at {new Date(ticket.checkedInAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
