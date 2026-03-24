"use client";
import { usePlan } from "@/hooks/usePlan";
import UpgradeGate from "@/components/UpgradeGate";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getUserShops, ShopData } from "@/lib/shop";

export default function ShopPortalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [shops, setShops] = useState<ShopData[]>([]);
  const [shopsLoading, setShopsLoading] = useState(true);

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);
  useEffect(() => { if (user) getUserShops(user.uid).then(s => { setShops(s); setShopsLoading(false); }); }, [user]);

  if (loading) return (<div style={{ minHeight: "100vh", background: "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 24, height: 24, borderRadius: "50%", background: "#000" }} /></div>);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f8", fontFamily: "'DM Sans',sans-serif", color: "#000" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 64px" }}>
        <button onClick={() => router.push("/dashboard")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", fontSize: 12, fontWeight: 700, color: "#888", cursor: "pointer", fontFamily: "inherit", marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          ← Back to Dashboard
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 4 }}>Shop Portal</h1>
            <p style={{ fontSize: 15, opacity: .5, fontWeight: 500 }}>Create and manage your digital storefronts.</p>
          </div>
          <button onClick={() => router.push("/dashboard/shop/new")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 999, background: "#000", color: "#fff", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            ⚡ Create New Shop
          </button>
        </div>
        {shopsLoading ? (
          <div style={{ textAlign: "center", padding: 64, opacity: .4 }}>Loading shops...</div>
        ) : shops.length === 0 ? (
          <div style={{ textAlign: "center", padding: 64 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
            <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>No shops yet</h3>
            <p style={{ fontSize: 14, opacity: .4, marginBottom: 24 }}>Create your first shop to start selling.</p>
            <button onClick={() => router.push("/dashboard/shop/new")} style={{ padding: "12px 24px", borderRadius: 999, background: "#000", color: "#fff", border: "none", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>Create New Shop</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {shops.map(shop => (
              <button key={shop.id} onClick={() => router.push(`/dashboard/shop/new?edit=${shop.id}`)}
                style={{ padding: 20, borderRadius: 16, border: "1px solid #e5e5e5", background: "#fff", cursor: "pointer", textAlign: "left", fontFamily: "inherit", color: "#000", transition: "all .2s", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛍️</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{shop.title || "Untitled Shop"}</div>
                    <div style={{ fontSize: 11, opacity: .4 }}>{(shop.products || []).length} products</div>
                  </div>
                </div>
                <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: "uppercase", background: shop.isPublic ? "#f0fdf4" : "#f5f5f5", color: shop.isPublic ? "#166534" : "#999", border: shop.isPublic ? "1px solid #bbf7d0" : "1px solid #e5e5e5", alignSelf: "flex-start" }}>
                  {shop.isPublic ? "Public" : "Draft"}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}