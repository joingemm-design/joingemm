export default function Loading() {
  return (
    <div style={{
        minHeight: "100vh", background: "#050505", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", boxShadow: "0 0 20px rgba(255,255,255,0.5)" }}/>
          <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.1em" }}>Loading...</span>
        </div>
      </div>
  );
}
