import { useState, useEffect } from "react";

export default function Header({ onToggleSidebar }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div style={{
      height: 64, background: "#ffffff", borderBottom: "1px solid #f1f5f9",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", position: "sticky", top: 0, zIndex: 100
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#64748b", fontSize: 13 }}>
          <button
            onClick={onToggleSidebar}
            style={{
              background: "#f8fafc", padding: "6px 8px", borderRadius: 6, border: "1px solid #f1f5f9",
              cursor: "pointer", fontSize: 18, transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.target.style.background = "#f1f5f9"}
            onMouseOut={(e) => e.target.style.background = "#f8fafc"}
          >
            ☰
          </button>
          <span style={{ fontWeight: 500, minWidth: 280 }}>{formatTime(time)}</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Fachry Nuzuli Kamal</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>sysadmin</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: "#1e293b",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 12, fontWeight: 600
        }}>FN</div>
      </div>
    </div>
  );
}
