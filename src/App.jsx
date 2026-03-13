import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import DiagramsPage from "./components/DiagramsPage";
import MobileMockup from "./components/MobileMockup";

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <Router basename="/fls-dashboard">
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fc" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');
          * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
          ::-webkit-scrollbar { width: 6px; } 
          ::-webkit-scrollbar-track { background: #f8fafc; }
          ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <Sidebar collapsed={isSidebarCollapsed} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

          <div style={{ flex: 1, overflowY: "auto" }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/fls-diagrams" element={<DiagramsPage />} />
              <Route path="/mobile-mockup" element={<MobileMockup />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
