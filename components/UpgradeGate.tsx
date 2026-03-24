"use client";
import { useRouter } from "next/navigation";

interface UpgradeGateProps {
  feature: string;
  requiredPlan: "velocity" | "empire";
  description?: string;
}

export default function UpgradeGate({ feature, requiredPlan, description }: UpgradeGateProps) {
  const router = useRouter();
  const planColor = requiredPlan === "empire" ? "#f59e0b" : "#6366f1";
  const planName = requiredPlan === "empire" ? "Empire 👑" : "Velocity";

  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center", padding: 40, borderRadius: 24, border: `1px solid ${planColor}30`, background: `${planColor}08` }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>��</div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", color: planColor, marginBottom: 12, textTransform: "uppercase" }}>{planName} Feature</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 12 }}>{feature}</h2>
        <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.6, marginBottom: 28 }}>
          {description || `Upgrade to ${planName} to unlock ${feature} and take your creator business to the next level.`}
        </p>
        <button
          onClick={() => router.push("/pricing")}
          style={{ width: "100%", padding: "14px", borderRadius: 12, background: planColor, color: requiredPlan === "empire" ? "#000" : "#fff", border: "none", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
        >
          Upgrade to {planName} →
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ marginTop: 12, width: "100%", padding: "12px", borderRadius: 12, background: "transparent", color: "rgba(0,0,0,0.3)", border: "1px solid #eee", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
