"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createShop, updateShop, Product } from "@/lib/shop";

export default function CreateShopPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("New Shop");
  const [desc, setDesc] = useState("");
  const [pub, setPub] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shopId, setShopId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [pN, setPN] = useState("");
  const [pP, setPP] = useState("");

  useEffect(() => { if (!loading && !user) router.push("/dashboard"); }, [user, loading, router]);

  function addP() {
    if (!pN.trim()) return;
    setProducts(p => [...p, { id: "p_" + Date.now(), name: pN.trim(), price: parseFloat(pP) || 0, description: "", imageURL: "", active: true, order: p.length, createdAt: new Date().toISOString() } as Product]);
    setPN(""); setPP(""); setShowAdd(false);
  }

  async function save() {
    if (!user || !title.trim()) return;
    setSaving(true);
    const d: any = { title: title.trim(), description: desc.trim(), isPublic: pub, showTitle: true, topBarMessage: "", design: { preset: "minimal", mainText: "#000", dividerAccent: "#e5e5e5", topBarBg: "#000", topBarText: "#fff", cardBg: "#f9fafb", cardText: "#000", cardBorder: "#fff", buttons: "#000", pageBg: "#fff" }, products };
    if (shopId) { await updateShop(shopId, d); } else { const id = await createShop(user.uid, d); setShopId(id); }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return (<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 24, height: 24, borderRadius: "50%", background: "#000" }} /></div>);

  const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "inherit", fontWeight: 500, color: "#000", background: "#fff" };
  const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#888", marginBottom: 6, display: "block" };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f5", fontFamily: "'DM Sans',sans-serif", color: "#000" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#fff", borderBottom: "1px solid #eee", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push("/dashboard/shop")} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #eee", background: "#fff", cursor: "pointer" }}>←</button>
          <span style={{ fontSize: 16, fontWeight: 900 }}>New Shop</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saved && <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 700 }}>✓</span>}
          <button onClick={save} disabled={saving} style={{ padding: "10px 20px", borderRadius: 999, background: "#000", color: "#fff", border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>{saving ? "Saving..." : "Publish"}</button>
        </div>
      </div>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px 100px" }}>
        <div style={{ padding: 20, borderRadius: 16, border: "1px solid #eee", background: "#fff", marginBottom: 16 }}>
          <div style={{ marginBottom: 12 }}><span style={lbl}>Shop Title</span><input value={title} onChange={e => setTitle(e.target.value)} style={{ ...inp, fontWeight: 700 }} /></div>
          <div style={{ marginBottom: 12 }}><span style={lbl}>Description</span><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Tell your story..." rows={3} style={{ ...inp, resize: "vertical" }} /></div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}><input type="checkbox" checked={pub} onChange={e => setPub(e.target.checked)} /> Make Public</label>
        </div>
        <div style={{ padding: 20, borderRadius: 16, border: "1px solid #eee", background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 900 }}>Inventory ({products.length})</span>
            <button onClick={() => setShowAdd(true)} style={{ padding: "8px 16px", borderRadius: 999, background: "#000", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+ Add</button>
          </div>
          {showAdd && (
            <div style={{ padding: 16, borderRadius: 12, border: "1px solid #e5e5e5", background: "#fafafa", marginBottom: 12 }}>
              <input value={pN} onChange={e => setPN(e.target.value)} placeholder="Product name" style={{ ...inp, marginBottom: 8 }} />
              <input value={pP} onChange={e => setPP(e.target.value)} placeholder="Price" type="number" style={{ ...inp, marginBottom: 8 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addP} style={{ padding: "8px 16px", borderRadius: 8, background: "#000", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
                <button onClick={() => setShowAdd(false)} style={{ padding: "8px 16px", borderRadius: 8, background: "#fff", color: "#666", border: "1px solid #ddd", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              </div>
            </div>
          )}
          {products.length === 0 ? <div style={{ textAlign: "center", padding: 32, border: "1px dashed #ddd", borderRadius: 12, opacity: .4 }}>Empty shelf</div> : products.map(p => (
            <div key={p.id} style={{ padding: 12, borderRadius: 10, border: "1px solid #e5e5e5", background: "#fff", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div><div style={{ fontSize: 11, opacity: .5 }}>${p.price.toFixed(2)}</div></div>
              <button onClick={() => setProducts(x => x.filter(z => z.id !== p.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}