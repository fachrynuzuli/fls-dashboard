import { useState } from "react";
import ptsiLogo from "../assets/ptsi-logo.png";
import { NavLink } from "react-router-dom";

function SidebarItem({ icon, label, active, subItems = [], collapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ marginBottom: 4 }}>
      <div
        onClick={() => !collapsed && setIsOpen(!isOpen)}
        title={collapsed ? label : ""}
        style={{
          display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "10px 0" : "10px 16px", cursor: "pointer", borderRadius: 8,
          background: active ? "#1e293b" : "transparent",
          color: active ? "#ffffff" : "#64748b",
          transition: "all 0.2s",
          width: "100%"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 12 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, whiteSpace: "nowrap" }}>{label}</span>}
        </div>
        {!collapsed && subItems.length > 0 && (
          <span style={{ fontSize: 10, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
        )}
      </div>
      {!collapsed && isOpen && subItems.length > 0 && (
        <div style={{ marginLeft: 36, marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
          {subItems.map((item, idx) => (
            <div key={idx} style={{
              fontSize: 12, padding: "8px 0", cursor: "pointer",
              color: item.active ? "#0f172a" : "#94a3b8",
              fontWeight: item.active ? 600 : 400
            }}>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed }) {
  return (
    <div style={{
      width: collapsed ? 80 : 260, height: "100vh", background: "#ffffff", borderRight: "1px solid #f1f5f9",
      display: "flex", flexDirection: "column", position: "sticky", top: 0, padding: collapsed ? "20px 8px" : "20px 12px",
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }}>
      <div style={{ padding: collapsed ? "0 0 32px" : "0 12px 32px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={ptsiLogo} alt="PTSI Logo" style={{ width: collapsed ? 45 : 120, height: "auto", transition: "width 0.3s" }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <SidebarItem icon="📊" label="Dashboard" active={true} collapsed={collapsed} subItems={[
          { label: "Operations", active: true },
          { label: "Gantt Chart", active: false },
          { label: "Pre-Departure", active: false },
          { label: "PSI Results", active: false }
        ]} />
        <SidebarItem icon="👥" label="Customer" collapsed={collapsed} />
        <SidebarItem icon="📅" label="Planner" collapsed={collapsed} />
        <SidebarItem icon="🚢" label="Digifleet" collapsed={collapsed} />
        <SidebarItem icon="🖥️" label="Monitoring" collapsed={collapsed} />
        <SidebarItem icon="📂" label="Masters" collapsed={collapsed} />
        <SidebarItem icon="👤" label="Human Resources" collapsed={collapsed} />

        {!collapsed && (
          <div style={{ marginTop: 24, padding: "0 12px", display: "flex", flexDirection: "column", gap: 10 }}>
            <NavLink
              to="/fls-diagrams"
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                width: "100%", padding: "14px",
                background: isActive ? "linear-gradient(135deg, #2563EB, #7C3AED)" : "linear-gradient(135deg, #F59E0B, #EF4444)",
                color: "white", border: "none", borderRadius: 12,
                fontWeight: 800, fontSize: 13, cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.05em",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                fontFamily: "'Inter', sans-serif"
              })}
            >
              <span style={{ fontSize: 20 }}>🗺️</span>
              <span>Diagrams</span>
            </NavLink>
            
            <NavLink
              to="/mobile-mockup"
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                width: "100%", padding: "14px",
                background: isActive ? "#1e293b" : "#64748b",
                color: "white", border: "none", borderRadius: 12,
                fontWeight: 800, fontSize: 13, cursor: "pointer",
                textDecoration: "none", padding: "10px",
                transition: "all 0.3s", textTransform: "uppercase", letterSpacing: "0.05em",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                fontFamily: "'Inter', sans-serif"
              })}
            >
              <span style={{ fontSize: 20 }}>📱</span>
              <span>Mobile Mockup</span>
            </NavLink>
          </div>
        )}
      </div>

      {!collapsed && (
        <div style={{
          padding: "16px", borderTop: "1px solid #f1f5f9", fontSize: 10, color: "#94a3b8",
          textAlign: "center"
        }}>
          © 2026 PTSI · Fleet Dispatch System<br />Version 2.0
        </div>
      )}
    </div>
  );
}
