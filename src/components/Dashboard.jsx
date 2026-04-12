import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// ─── SAMPLE DATA ────────────────────────────────────────────────────────────
const COLORS = ["#38BDF8", "#FB923C", "#A78BFA", "#34D399"];
const TARGET_COLOR = "#F59E0B";

const availData = [
  { unit: "MHP0025", availability: 92, downtime: 1.9 },
  { unit: "MHP0026", availability: 88, downtime: 2.9 },
  { unit: "MHP0027", availability: 96, downtime: 1.0 },
  { unit: "MHP0028", availability: 85, downtime: 3.6 },
];

const utilData = [
  { unit: "MHP0025", utilization: 73, available: 22.1, working: 16.1 },
  { unit: "MHP0026", utilization: 65, available: 21.1, working: 13.7 },
  { unit: "MHP0027", utilization: 78, available: 23.0, working: 17.9 },
  { unit: "MHP0028", utilization: 68, available: 20.4, working: 13.9 },
];

const db003Data = {
  unit: [
    { unit: "MHP0025", rate: 360, target: 355 },
    { unit: "MHP0026", rate: 349, target: 355 },
    { unit: "MHP0027", rate: 442, target: 355 },
    { unit: "MHP0028", rate: 326, target: 355 },
  ],
  operator: [
    { operator: "Budi S.", rate: 382, target: 355 },
    { operator: "Andi R.", rate: 345, target: 355 },
    { operator: "Hendra W.", rate: 410, target: 355 },
    { operator: "Rizki F.", rate: 338, target: 355 },
    { operator: "Syaiful H.", rate: 367, target: 355 },
    { operator: "Taufik M.", rate: 395, target: 355 },
    { operator: "Dedi K.", rate: 372, target: 355 },
    { operator: "Bambang R.", rate: 405, target: 355 },
    { operator: "Yanto P.", rate: 328, target: 355 },
    { operator: "Agus S.", rate: 355, target: 355 },
    { operator: "Wawan B.", rate: 420, target: 355 },
    { operator: "Eko J.", rate: 315, target: 355 },
    { operator: "Ferry A.", rate: 388, target: 355 },
    { operator: "Iwan C.", rate: 342, target: 355 },
  ],
  woodType: [
    { woodType: "ACDB", rate: 385, target: 355 },
    { woodType: "ACBO", rate: 342, target: 355 },
    { woodType: "ACWC", rate: 415, target: 355 },
    { woodType: "AMBO", rate: 310, target: 355 },
    { woodType: "GMDB", rate: 395, target: 355 },
    { woodType: "EUWC", rate: 358, target: 355 },
  ],
  bargeSize: [
    { bargeSize: "300ft", rate: 390, target: 355 },
    { bargeSize: "270ft", rate: 365, target: 355 },
    { bargeSize: "250ft", rate: 340, target: 355 },
    { bargeSize: "230ft", rate: 320, target: 355 },
  ]
};

const db007Data = {
  unit: [
    { unit: "MHP0025", lpt: 0.144, target: 0.143 },
    { unit: "MHP0026", lpt: 0.116, target: 0.143 },
    { unit: "MHP0027", lpt: 0.151, target: 0.143 },
    { unit: "MHP0028", lpt: 0.148, target: 0.143 },
  ],
  operator: [
    { operator: "Budi S.", lpt: 0.138, target: 0.143 },
    { operator: "Andi R.", lpt: 0.142, target: 0.143 },
    { operator: "Hendra W.", lpt: 0.115, target: 0.143 },
    { operator: "Rizki F.", lpt: 0.158, target: 0.143 },
    { operator: "Syaiful H.", lpt: 0.129, target: 0.143 },
    { operator: "Taufik M.", lpt: 0.147, target: 0.143 },
    { operator: "Dedi K.", lpt: 0.132, target: 0.143 },
    { operator: "Bambang R.", lpt: 0.145, target: 0.143 },
    { operator: "Yanto P.", lpt: 0.155, target: 0.143 },
    { operator: "Agus S.", lpt: 0.140, target: 0.143 },
    { operator: "Wawan B.", lpt: 0.125, target: 0.143 },
    { operator: "Eko J.", lpt: 0.162, target: 0.143 },
    { operator: "Ferry A.", lpt: 0.135, target: 0.143 },
    { operator: "Iwan C.", lpt: 0.148, target: 0.143 },
  ],
  woodType: [
    { woodType: "ACDB", lpt: 0.132, target: 0.143 },
    { woodType: "ACBO", lpt: 0.125, target: 0.143 },
    { woodType: "ACWC", lpt: 0.155, target: 0.143 },
    { woodType: "AMBO", lpt: 0.165, target: 0.143 },
    { woodType: "GMDB", lpt: 0.128, target: 0.143 },
    { woodType: "EUWC", lpt: 0.145, target: 0.143 },
  ],
  bargeSize: [
    { bargeSize: "300ft", lpt: 0.128, target: 0.143 },
    { bargeSize: "270ft", lpt: 0.138, target: 0.143 },
    { bargeSize: "250ft", lpt: 0.145, target: 0.143 },
    { bargeSize: "230ft", lpt: 0.152, target: 0.143 },
  ]
};

const bargeData = [
  { barge: "KLM MAJU", lp: "LP-01", attach: "06:12", detach: "09:45", budget: "3h 30m", duration: "3h 33m", status: "done" },
  { barge: "BG HARAPAN", lp: "LP-02", attach: "07:30", detach: "11:10", budget: "3h 45m", duration: "3h 40m", status: "done" },
  { barge: "TK SINAR", lp: "LP-01", attach: "10:00", detach: "—", budget: "4h 00m", duration: "In Progress", status: "live" },
  { barge: "KM BERKAH", lp: "LP-03", attach: "13:15", detach: "—", budget: "3h 15m", duration: "In Progress", status: "live" },
];

const bargePool = [
  { barge: "KLM MAJU", lp: "LP-01", budget: "3h 30m" },
  { barge: "BG HARAPAN", lp: "LP-02", budget: "3h 45m" },
  { barge: "TK SINAR", lp: "LP-01", budget: "4h 00m" },
  { barge: "KM BERKAH", lp: "LP-03", budget: "3h 15m" },
  { barge: "BG SEJAHTERA", lp: "LP-02", budget: "3h 45m" },
  { barge: "KM LESTARI", lp: "LP-01", budget: "4h 15m" },
  { barge: "TK INDAH", lp: "LP-03", budget: "3h 30m" },
  { barge: "BG MAKMUR", lp: "LP-02", budget: "3h 50m" },
];

const generateBargeData = (period, startDate, endDate, multiplier) => {
  if (period === 'daily') return bargeData;

  const seedStr = startDate + endDate + period;
  const seed = seedStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const r = (i) => seedRandom(seed + i * 17);

  const count = Math.min(bargePool.length, Math.max(4, Math.round(2 * multiplier)));
  const hours = ["h 10m", "h 20m", "h 30m", "h 40m", "h 50m", "h 05m", "h 15m", "h 25m"];

  return bargePool.slice(0, count).map((b, i) => {
    const budgetH = parseInt(b.budget);
    const durationH = budgetH + (r(i) > 0.55 ? 1 : 0);
    const durationMin = hours[Math.floor(r(i + 5) * hours.length)];
    const budgetMin = hours[Math.floor(r(i + 10) * hours.length)];
    const duration = `${durationH}${durationMin}`;
    const budget = `${budgetH}${budgetMin}`;
    const startH = Math.floor(6 + r(i + 1) * 14);
    const startM = Math.floor(r(i + 2) * 60);
    const endH = startH + durationH;
    const endM = Math.floor(r(i + 3) * 60);
    const attach = `${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')}`;
    const detach = endH < 24 ? `${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}` : null;
    return { ...b, budget, duration, attach, detach: detach || "—", status: detach ? 'done' : 'live' };
  });
};

const stackData = [
  { stack: 8, avgTime: "00:21", trips: 14 },
  { stack: 9, avgTime: "00:24", trips: 38 },
  { stack: 10, avgTime: "00:30", trips: 29 },
  { stack: 11, avgTime: "00:34", trips: 11 },
];

const deliveryTrend = [
  { day: "1", actual: 18200, target: 19000 },
  { day: "2", actual: 21400, target: 19500 },
  { day: "3", actual: 17800, target: 18800 },
  { day: "4", actual: 20100, target: 20200 },
  { day: "5", actual: 22300, target: 19200 },
  { day: "6", actual: 19600, target: 19800 },
  { day: "7", actual: 23100, target: 20500 },
  { day: "8", actual: 18700, target: 19300 },
  { day: "9", actual: 21000, target: 19700 },
  { day: "10", actual: 14136, target: 20100 },
];

const woodTypeData = [
  { name: "ACDB", value: 74, tons: 10447, color: "#38BDF8" },
  { name: "AMDB", value: 2, tons: 278, color: "#FB923C" },
  { name: "GMDB", value: 24, tons: 3411, color: "#A78BFA" },
];

const generateWoodData = (period, startDate, endDate, multiplier) => {
  const seedStr = startDate + endDate + period;
  const seed = seedStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const r = (i) => seedRandom(seed + i * 13);

  // Vary % split slightly around base values, total always ~100
  const acdb = Math.max(60, Math.min(85, Math.round(74 + (r(1) - 0.5) * 20)));
  const amdb = Math.max(1, Math.min(8, Math.round(2 + (r(2) - 0.5) * 6)));
  const gmdb = 100 - acdb - amdb;

  const totalTons = Math.round(DAILY_ACTUAL * multiplier);

  return [
    { name: "ACDB", value: acdb, tons: Math.round(totalTons * acdb / 100), color: "#38BDF8" },
    { name: "AMDB", value: amdb, tons: Math.round(totalTons * amdb / 100), color: "#FB923C" },
    { name: "GMDB", value: gmdb, tons: Math.round(totalTons * gmdb / 100), color: "#A78BFA" },
  ];
};

const DAILY_ACTUAL = 14136;
const MTD_ACTUAL_BASE = 196336;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("id-ID");
const pct = (a, t) => Math.round((a / t) * 100);
const fmtDT2 = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
};

// Parse "3h 33m" into minutes for comparison
const parseDuration = (s) => {
  if (!s || s === "—" || s === "In Progress") return 0;
  const hMatch = s.match(/(\d+)h/);
  const mMatch = s.match(/(\d+)m/);
  return (hMatch ? parseInt(hMatch[1]) * 60 : 0) + (mMatch ? parseInt(mMatch[1]) : 0);
};

const getStatusColor = (actual, budget) => {
  const a = parseDuration(actual);
  const b = parseDuration(budget);
  if (a > b) return "#ef4444"; // Late
  if (a > b * 0.95) return "#f59e0b"; // Warning
  return "#22c55e"; // On time
};

const generateMockData = (period, startDate, endDate, baseDb003, baseDb007) => {
  const seedStr = startDate + endDate + period;
  const seed = seedStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const random = (i) => seedRandom(seed + i);

  let opCount = 6;
  let multiplier = 1;

  if (period === "custom") {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    multiplier = Math.max(1, diff || 1);
    opCount = multiplier > 7 ? 14 : multiplier > 2 ? 10 : 8;
  }
  else if (period === "weekly") { opCount = 10; multiplier = 7; }
  else if (period === "monthly") { opCount = 14; multiplier = 30; }
  else if (period === "7d") { opCount = 12; multiplier = 7; }
  else if (period === "30d") { opCount = 14; multiplier = 30; }
  else { opCount = Math.floor(random(0) * 4) + 5; } // 5-8 for daily

  const varyList = (list, rateKey, iOffset, isFuel = false) => list.map((item, i) => {
    const val = item[rateKey];
    const r = random(i + iOffset);
    let mutated = val * (0.9 + r * 0.2);
    if (isFuel) mutated = parseFloat(mutated.toFixed(3));
    else mutated = Math.round(mutated);
    return { ...item, [rateKey]: mutated };
  });

  const db003 = {
    unit: varyList(baseDb003.unit, 'rate', 10),
    woodType: varyList(baseDb003.woodType, 'rate', 20),
    bargeSize: varyList(baseDb003.bargeSize, 'rate', 30),
    operator: varyList(baseDb003.operator.slice(0, opCount), 'rate', 40)
  };

  const db007 = {
    unit: varyList(baseDb007.unit, 'lpt', 50, true),
    woodType: varyList(baseDb007.woodType, 'lpt', 60, true),
    bargeSize: varyList(baseDb007.bargeSize, 'lpt', 70, true),
    operator: varyList(baseDb007.operator.slice(0, opCount), 'lpt', 80, true)
  };

  const avgRate = Math.round(db003.unit.reduce((acc, u) => acc + u.rate, 0) / db003.unit.length);
  const bestUnit = db003.unit.reduce((best, u) => u.rate > best.rate ? u : best, db003.unit[0]);
  const avgFuel = parseFloat((db007.unit.reduce((acc, u) => acc + u.lpt, 0) / db007.unit.length).toFixed(3));
  const completions = period === 'daily' ? Math.floor(2 + random(90) * 2) : Math.floor(2 * multiplier + random(90) * 5);

  return { db003, db007, multiplier, kpis: { avgRate, bestUnitName: bestUnit.unit, bestUnitRate: bestUnit.rate, avgFuel, completions } };
};

const generateEqData = (period, startDate, endDate, multiplier) => {
  const seedStr = startDate + endDate + period;
  const seed = seedStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const random = (i) => seedRandom(seed + i * 3);

  const newAvail = availData.map((d, i) => {
    const r = random(i + (multiplier * 2));
    const availability = Math.max(75, Math.min(100, Math.round(d.availability + (r - 0.5) * 15)));
    const downtime = parseFloat((d.downtime * multiplier * (0.8 + r * 0.4)).toFixed(1));
    return { ...d, availability, downtime };
  });

  const newUtil = utilData.map((d, i) => {
    const r = random(i + 5 + multiplier);
    const utilization = Math.max(50, Math.min(90, Math.round(d.utilization + (r - 0.5) * 20)));
    const available = parseFloat((d.available * multiplier).toFixed(1));
    const working = parseFloat((available * (utilization / 100)).toFixed(1));
    return { ...d, utilization, available, working };
  });

  const avgAvail = (newAvail.reduce((acc, d) => acc + d.availability, 0) / newAvail.length).toFixed(1);
  const avgUtil = (newUtil.reduce((acc, d) => acc + d.utilization, 0) / newUtil.length).toFixed(1);
  const totalDowntime = newAvail.reduce((acc, d) => acc + d.downtime, 0).toFixed(1);

  return { newAvail, newUtil, avgAvail, avgUtil, totalDowntime };
};

const generateTrendData = (period, startDate, endDate, singleDayTarget) => {
  const seedStr = startDate + endDate + period;
  const seed = seedStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const random = (i) => seedRandom(seed + i * 7);

  let data = [];
  if (period === "daily") {
    const periodTarget = Math.round(singleDayTarget / 12);
    for (let i = 1; i <= 12; i++) {
      data.push({
        label: `${String(i * 2).padStart(2, '0')}:00`,
        target: periodTarget,
        actual: Math.round(periodTarget * (0.8 + random(i) * 0.4))
      });
    }
  } else if (period === "custom") {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    
    for (let i = 1; i <= Math.min(30, diff); i++) {
      data.push({
        label: `Day ${i}`,
        target: singleDayTarget,
        actual: Math.round(singleDayTarget * (0.8 + random(i) * 0.4))
      });
    }
  } else if (period === "weekly" || period === "7d") {
    for (let i = 1; i <= 7; i++) {
      data.push({
        label: `Day ${i}`,
        target: singleDayTarget,
        actual: Math.round(singleDayTarget * (0.8 + random(i) * 0.4))
      });
    }
  } else {
    for (let i = 1; i <= 30; i++) {
      data.push({
        label: `${i}`,
        target: singleDayTarget,
        actual: Math.round(singleDayTarget * (0.8 + random(i) * 0.4))
      });
    }
  }
  return data;
};

const seedRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

function ScrambleText({ value }) {
  const [display, setDisplay] = useState(value);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%./";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        value
          .split("")
          .map((char, index) => {
            if (index < iteration) return value[index];
            if (char === " " || char === ":" || char === "—") return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= value.length) clearInterval(interval);
      iteration += 1;
    }, 20);
    return () => clearInterval(interval);
  }, [value]);

  return <>{display}</>;
}

function KPITile({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e2e8f0",
      borderRadius: 16, padding: "20px 24px", flex: 1,
      boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)"
    }}>
      <div style={{ fontSize: 11, color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: accent || "#0f172a", lineHeight: 1, fontFamily: "'Bebas Neue', cursive" }}>
        <ScrambleText value={String(value)} />
      </div>
      {sub && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{sub}</div>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: 11, color: "#94A3B8", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
      {children}
      <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
    </div>
  );
}

function WarningBanner({ text }) {
  return (
    <div style={{
      background: "#fff7ed", border: "1px solid #fdba74",
      borderRadius: 10, padding: "10px 16px", fontSize: 12, color: "#ea580c",
      display: "flex", alignItems: "center", gap: 10, marginBottom: 20,
      fontFamily: "'DM Mono', monospace", fontWeight: 500
    }}>
      <span style={{ fontSize: 16 }}>⚠</span> {text}
    </div>
  );
}

const customTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
      <div style={{ color: "#64748B", fontSize: 11, marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>
          {p.name}: {typeof p.value === "number" && p.value < 1 ? p.value.toFixed(3) : p.value}{p.name === "rate" ? " t/h" : p.name === "availability" || p.name === "utilization" ? "%" : p.name === "lpt" ? " L/t" : ""}
        </div>
      ))}
    </div>
  );
};

function AnnualTargetModal({ isOpen, onClose, annualTargets, setAnnualTargets }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [selectedMonth, setSelectedMonth] = useState(null); // null = month view, 0-11 = day view

  const handleSave = () => {
    onClose();
    setSelectedMonth(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(8px)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 40
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            style={{
              background: "#ffffff", borderRadius: 24, width: "100%", maxWidth: 1000,
              maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
            }}
          >
            <div style={{ padding: "32px 40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", fontFamily: "Inter" }}>
                  {selectedMonth !== null ? `${months[selectedMonth]} 2026 Daily Targets` : "Annual Delivery Targets"}
                </div>
                <div style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>
                  {selectedMonth !== null ? "Set specific targets for each day this month." : "Select a month to configure day-to-day granular targets."}
                </div>
              </div>
              <button
                onClick={selectedMonth !== null ? () => setSelectedMonth(null) : onClose}
                style={{ background: "#f1f5f9", border: "none", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 20, color: "#64748b" }}
              >
                {selectedMonth !== null ? "←" : "×"}
              </button>
            </div>

            <div style={{ padding: 40, overflowY: "auto", flex: 1 }}>
              {selectedMonth === null ? (
                /* Month View */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                  {months.map((m, i) => {
                    const monthKeyPrefix = `2026-${String(i + 1).padStart(2, "0")}`;
                    const monthAvg = Object.keys(annualTargets)
                      .filter(k => k.startsWith(monthKeyPrefix))
                      .reduce((acc, k, _, arr) => acc + annualTargets[k].daily / arr.length, 0);

                    return (
                      <motion.div
                        key={m}
                        whileHover={{ y: -4, borderColor: "#38BDF8" }}
                        onClick={() => setSelectedMonth(i)}
                        style={{ background: "#f8fafc", padding: 24, borderRadius: 20, border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s" }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 8, fontFamily: "DM Mono" }}>{m} 2026</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{fmt(Math.round(monthAvg))} <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>t/day avg</span></div>
                        <div style={{ marginTop: 12, fontSize: 12, color: "#38BDF8", fontWeight: 600 }}>Configure Days →</div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                /* Day View */
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
                  {(() => {
                    const daysInMonth = new Date(2026, selectedMonth + 1, 0).getDate();
                    const dayElements = [];
                    for (let d = 1; d <= daysInMonth; d++) {
                      const dateStr = `2026-${String(selectedMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                      dayElements.push(
                        <div key={d} style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", marginBottom: 6 }}>Day {d}</div>
                          <input
                            type="number"
                            value={annualTargets[dateStr]?.daily || 19000}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setAnnualTargets(prev => ({ ...prev, [dateStr]: { ...prev[dateStr], daily: val } }));
                            }}
                            style={{ width: "100%", background: "transparent", border: "none", fontSize: 14, fontWeight: 600, fontFamily: "DM Mono", outline: "none", color: "#0f172a" }}
                          />
                        </div>
                      );
                    }
                    return dayElements;
                  })()}
                </div>
              )}
            </div>

            <div style={{ padding: "24px 40px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", gap: 16 }}>
              {selectedMonth !== null && (
                <button
                  onClick={() => setSelectedMonth(null)}
                  style={{ padding: "12px 24px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#ffffff", fontSize: 14, fontWeight: 600, color: "#64748b", cursor: "pointer" }}
                >
                  Back to Months
                </button>
              )}
              <button
                onClick={handleSave}
                style={{ padding: "12px 32px", borderRadius: 10, border: "none", background: "#38BDF8", fontSize: 14, fontWeight: 700, color: "#ffffff", cursor: "pointer", boxShadow: "0 4px 12px rgba(56,189,248,0.3)" }}
              >
                Save {selectedMonth !== null ? "Monthly" : "All"} Configuration
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── GROUPS ──────────────────────────────────────────────────────────────────
function GroupA({ eqData, periodLabel }) {
  const { newAvail, newUtil, avgAvail, avgUtil, totalDowntime } = eqData;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 16 }}>
        <KPITile label="Fleet Avg Availability" value={`${avgAvail}%`} accent="#34D399" sub="Target: 90.0%" />
        <KPITile label="Fleet Avg Utilization" value={`${avgUtil}%`} accent="#38BDF8" sub="Target: 54.0%" />
        <KPITile label={`Total Downtime ${periodLabel}`} value={`${totalDowntime}h`} accent="#FB923C" sub="across 4 units" />
        <KPITile label="Units Reporting" value="4 / 4" accent="#A78BFA" sub="MHP0025–0028" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>Availability per Unit (%)</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={newAvail} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="unit" tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <ReferenceLine y={90} stroke={TARGET_COLOR} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 90%", fill: TARGET_COLOR, fontSize: 10, fontFamily: "DM Mono", position: "top", dy: -4 }} />
              <Bar dataKey="availability" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {newAvail.map((d, i) => <Cell key={i} fill={d.availability >= 90 ? "#34D399" : "#FB923C"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 12 }}>
            {newAvail.map((d, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#64748B", fontFamily: "DM Mono" }}>{d.unit}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: d.availability >= 90 ? "#34D399" : "#FB923C", fontFamily: "Bebas Neue" }}>{d.availability}%</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "DM Mono" }}>↓ {d.downtime}h DT</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>Utilization per Unit (%)</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={newUtil} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="unit" tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <ReferenceLine y={54} stroke={TARGET_COLOR} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 54%", fill: TARGET_COLOR, fontSize: 10, fontFamily: "DM Mono", position: "top", dy: -4 }} />
              <Bar dataKey="utilization" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {newUtil.map((d, i) => <Cell key={i} fill={COLORS[i]} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 12 }}>
            {utilData.map((d, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#64748B", fontFamily: "DM Mono" }}>{d.unit}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: COLORS[i], fontFamily: "Bebas Neue" }}>{d.utilization}%</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "DM Mono" }}>{d.working}h / {d.available}h</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterToggle({ active, options, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, background: "#f1f5f9", padding: 4, borderRadius: 8, alignSelf: "flex-end" }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            border: "none", borderRadius: 6, padding: "4px 12px", fontSize: 10, fontWeight: 600,
            cursor: "pointer", transition: "all 0.2s",
            background: active === opt.value ? "#ffffff" : "transparent",
            color: active === opt.value ? "#0f172a" : "#64748b",
            boxShadow: active === opt.value ? "0 1px 2px rgba(0,0,0,0.1)" : "none"
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function GroupB({ db003Data, db007Data, db003Mode, setDb003Mode, db007Mode, setDb007Mode, periodLabel, kpis, barges }) {
  const { avgRate, bestUnitName, bestUnitRate, avgFuel, completions } = kpis;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <WarningBanner text="2 trips in this period have not yet been weighed by Max-C. Displayed tonnage may be incomplete." />

      <div style={{ display: "flex", gap: 16 }}>
        <KPITile label="Fleet Avg Loading Rate" value={`${avgRate} t/h`} accent="#38BDF8" sub="Target 355 t/h" />
        <KPITile label="Best Performer" value={bestUnitName} accent="#34D399" sub={`${bestUnitRate} t/h ${periodLabel.toLowerCase()}`} />
        <KPITile label="Fleet Avg Fuel Burn" value={`${avgFuel.toFixed(3)} L/t`} accent="#34D399" sub="Target 0.143 L/t" />
        <KPITile label="Avg Barge Turnaround" value="3h 37m" accent="#A78BFA" sub={`${completions} completed ${periodLabel.toLowerCase()}`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
          <SectionTitle>Loading Rate — {periodLabel}</SectionTitle>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <FilterToggle
              active={db003Mode}
              options={[
                { label: "PER UNIT", value: "unit" },
                { label: "PER OPERATOR", value: "operator" },
                { label: "PER WOOD TYPE", value: "woodType" }
              ]}
              onChange={setDb003Mode}
            />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={db003Data[db003Mode]} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey={db003Mode} tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis domain={[280, 480]} tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <ReferenceLine y={355} stroke={TARGET_COLOR} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 355", fill: TARGET_COLOR, fontSize: 10, fontFamily: "DM Mono", position: "top", dy: -4 }} />
              <Bar dataKey="rate" name="rate" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {db003Data[db003Mode].map((d, i) => <Cell key={i} fill={d.rate >= d.target ? "#34D399" : "#FB923C"} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
          <SectionTitle>Fuel Efficiency — {periodLabel}</SectionTitle>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <FilterToggle
              active={db007Mode}
              options={[
                { label: "PER UNIT", value: "unit" },
                { label: "PER OPERATOR", value: "operator" },
                { label: "PER WOOD TYPE", value: "woodType" }
              ]}
              onChange={setDb007Mode}
            />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={db007Data[db007Mode]} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey={db007Mode} tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0.08, 0.18]} tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <ReferenceLine y={0.143} stroke={TARGET_COLOR} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 0.143", fill: TARGET_COLOR, fontSize: 10, fontFamily: "DM Mono", position: "top", dy: -4 }} />
              <Bar dataKey="lpt" name="lpt" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {db007Data[db007Mode].map((d, i) => <Cell key={i} fill={d.lpt <= d.target ? "#34D399" : "#FB923C"} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>Barge Unloading — {periodLabel}</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 50px 70px 70px 80px 100px 90px",
              alignItems: "center", gap: 8, padding: "0 12px",
              fontSize: 10, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "DM Mono"
            }}>
              <div>Barge</div>
              <div>LP</div>
              <div>Start</div>
              <div>End</div>
              <div>Budget</div>
              <div>Duration</div>
              <div style={{ textAlign: "center" }}>Status</div>
            </div>

            {barges.map((b, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 50px 70px 70px 80px 100px 90px",
                alignItems: "center", gap: 8,
                background: b.status === "live" ? "rgba(56,189,248,0.05)" : "#f8fafc",
                border: `1px solid ${b.status === "live" ? "rgba(56,189,248,0.2)" : "#e2e8f0"}`,
                borderRadius: 8, padding: "8px 12px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", fontFamily: "DM Mono" }}>{b.barge}</div>
                <div style={{ fontSize: 11, color: "#64748B", fontFamily: "DM Mono" }}>{b.lp}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "DM Mono" }}>{b.attach}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "DM Mono" }}>{b.detach === "—" ? "..." : b.detach}</div>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, fontFamily: "DM Mono" }}>{b.budget}</div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: b.status === "live" ? "#38BDF8" : getStatusColor(b.duration, b.budget),
                  fontFamily: "Bebas Neue",
                  letterSpacing: "0.05em"
                }}>{b.duration}</div>
                <div style={{
                  fontSize: 10, fontFamily: "DM Mono", padding: "2px 8px", borderRadius: 20,
                  background: b.status === "live" ? "rgba(56,189,248,0.1)" : (parseDuration(b.duration) > parseDuration(b.budget) ? "rgba(239,68,68,0.1)" : "rgba(52,211,153,0.1)"),
                  color: b.status === "live" ? "#0284c7" : (parseDuration(b.duration) > parseDuration(b.budget) ? "#ef4444" : "#059669"),
                  textAlign: "center", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600
                }}>
                  {b.status === "live" ? "● Live" : (parseDuration(b.duration) > parseDuration(b.budget) ? "Delayed" : "Complete")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>Avg Loading Time by Stack Count</SectionTitle>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 10 }}>
            {stackData.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 11, color: "#64748B", width: 60, fontFamily: "DM Mono" }}>{s.stack} stacks</div>
                <div style={{ flex: 1, height: 22, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%", width: `${(s.stack - 7) * 25}%`,
                    background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[i]}88)`,
                    borderRadius: 4
                  }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS[i], width: 64, textAlign: "right", fontFamily: "Bebas Neue" }}>{s.avgTime}</div>
                <div style={{ fontSize: 10, color: "#94A3B8", width: 54, fontFamily: "DM Mono" }}>{s.trips} trips</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ pct, size = 160, stroke = 14, color = "#38BDF8" }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        strokeLinecap="round" />
    </svg>
  );
}

function GroupC({ dailyTarget, monthlyTarget, MTD_ACTUAL, multiplier, startDate, endDate, period }) {
  const dailyPct = pct(DAILY_ACTUAL * multiplier, dailyTarget);
  const mtdPct = pct(MTD_ACTUAL, monthlyTarget);
  const remaining = dailyTarget - (DAILY_ACTUAL * multiplier);

  // Dynamic day count from endDate
  const endDateObj = endDate ? new Date(endDate) : new Date();
  const dayOfMonth = endDateObj.getDate();
  const daysInMonth = new Date(endDateObj.getFullYear(), endDateObj.getMonth() + 1, 0).getDate();

  const singleDayTarget = dailyTarget / multiplier;
  const trendData = generateTrendData(period, startDate, endDate, singleDayTarget);
  const woodData = generateWoodData(period, startDate, endDate, multiplier);

  const trendTitle = period === 'daily'
    ? `Hourly Delivery Trend — ${fmtDT2(endDate)}`
    : period === 'weekly' || period === '7d'
      ? `Daily Delivery Trend — Last 7 Days`
      : period === 'custom' 
        ? `Delivery Trend — Custom Range`
        : `Daily Delivery Trend — This Month`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <WarningBanner text="2 trips in this period have not yet been weighed by Max-C. Tonnage may be updated upon sync. Next sync scheduled: 14:30 WIB" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>Delivery Progress — {period === 'daily' ? 'Yesterday' : `${period.toUpperCase()} View`}</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginTop: 8 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ProgressRing pct={dailyPct} size={180} stroke={16} color={dailyPct >= 80 ? "#34D399" : dailyPct >= 50 ? "#F59E0B" : "#FB923C"} />
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: "#0f172a", lineHeight: 1, fontFamily: "Bebas Neue" }}>{dailyPct}%</div>
                <div style={{ fontSize: 11, color: "#64748B", fontFamily: "DM Mono" }}>achieved</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono", letterSpacing: "0.1em", textTransform: "uppercase" }}>Actual</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#38BDF8", fontFamily: "Bebas Neue" }}>{fmt(DAILY_ACTUAL * multiplier)} t</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono", letterSpacing: "0.1em", textTransform: "uppercase" }}>Target</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#334155", fontFamily: "Bebas Neue" }}>{fmt(dailyTarget)} t</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono", letterSpacing: "0.1em", textTransform: "uppercase" }}>Remaining</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#FB923C", fontFamily: "Bebas Neue" }}>{fmt(Math.max(0, remaining))} t</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ height: 10, background: "#f1f5f9", borderRadius: 6, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, dailyPct)}%` }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, #38BDF8, #34D399)`,
                  borderRadius: 6
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono" }}>06:00</div>
              <div style={{ fontSize: 10, color: "#64748B", fontFamily: "DM Mono" }}>{fmtDT2(endDate)}  ·  As of 12:31 WIB</div>
              <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono" }}>05:59 +1</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>Delivery Achievement — MTD</SectionTitle>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginTop: 8 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ProgressRing pct={mtdPct} size={180} stroke={16} color="#A78BFA" />
              <div style={{ position: "absolute", textAlign: "center" }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: "#0f172a", lineHeight: 1, fontFamily: "Bebas Neue" }}>{mtdPct}%</div>
                <div style={{ fontSize: 11, color: "#64748B", fontFamily: "DM Mono" }}>of month</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono", letterSpacing: "0.1em", textTransform: "uppercase" }}>MTD Actual</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: "#A78BFA", fontFamily: "Bebas Neue" }}>{fmt(MTD_ACTUAL)} t</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono", letterSpacing: "0.1em", textTransform: "uppercase" }}>Monthly Target</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#334155", fontFamily: "Bebas Neue" }}>{fmt(monthlyTarget)} t</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono", letterSpacing: "0.1em", textTransform: "uppercase" }}>Day {dayOfMonth} of {daysInMonth}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#64748B", fontFamily: "Bebas Neue" }}>{fmt(Math.max(0, monthlyTarget - MTD_ACTUAL))} t left</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>{trendTitle}</SectionTitle>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={trendData} margin={{ top: 20, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <Line type="monotone" dataKey="target" stroke={TARGET_COLOR} strokeWidth={2} strokeDasharray="5 5" dot={{ fill: TARGET_COLOR, r: 2 }} name="target" />
              <Line type="monotone" dataKey="actual" stroke="#A78BFA" strokeWidth={2.5} dot={{ fill: "#A78BFA", r: 3 }} name="actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>Wood Species Mix — {periodLabel}</SectionTitle>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={woodData} cx="50%" cy="50%" innerRadius={36} outerRadius={58} dataKey="value" paddingAngle={3}>
                {woodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 16 }}>
            {woodData.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: w.color }} />
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "DM Mono" }}>{w.name}: {fmt(w.tons)}t ({w.value}%)</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("B");
  const [dailyTarget, setDailyTarget] = useState(19000);
  const [monthlyTarget, setMonthlyTarget] = useState(570000);
  const [db003Mode, setDb003Mode] = useState("unit");
  const [db007Mode, setDb007Mode] = useState("unit");
  const [startDate, setStartDate] = useState("2026-03-09");
  const [endDate, setEndDate] = useState("2026-03-09");
  const [period, setPeriod] = useState("daily");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnnualModalOpen, setIsAnnualModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);

  // Fix #3: close date picker on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setIsDatePickerOpen(false);
      }
    };
    if (isDatePickerOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDatePickerOpen]);

  // Fix #7: Keyboard shortcuts for period switching
  useEffect(() => {
    const handleKey = (e) => {
      // Don't fire when user is typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const map = { d: 'daily', w: 'weekly', m: 'monthly', '7': '7d', '3': '30d' };
      const mapped = map[e.key.toLowerCase()];
      if (mapped) handlePeriodChange(mapped);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Granular targets: Map of YYYY-MM-DD -> { daily, monthly }
  const [annualTargets, setAnnualTargets] = useState(() => {
    const targets = {};
    const year = 2026;
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        targets[dateStr] = { daily: 19000, monthly: 570000 };
      }
    }
    return targets;
  });

  // Sync current targets with granular data
  useEffect(() => {
    const todayTarget = annualTargets[endDate];
    if (todayTarget) {
      setDailyTarget(todayTarget.daily);
      setMonthlyTarget(todayTarget.monthly);
    }
  }, [endDate, annualTargets]);

  const handleStartDateChange = (e) => {
    setIsLoading(true);
    setStartDate(e.target.value);
    setPeriod("custom");
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleEndDateChange = (e) => {
    setIsLoading(true);
    setEndDate(e.target.value);
    setPeriod("custom");
    setTimeout(() => setIsLoading(false), 800);
  };

  // Fix #2: Preset buttons sync the date range
  const handlePeriodChange = (p) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const fmt = (d) => d.toISOString().split('T')[0];
    const yStr = fmt(yesterday);

    let newStart = yStr;
    let newEnd = yStr;

    if (p === 'weekly') {
      const s = new Date(yesterday); s.setDate(s.getDate() - 6);
      newStart = fmt(s); newEnd = yStr;
    } else if (p === '7d') {
      const s = new Date(yesterday); s.setDate(s.getDate() - 6);
      newStart = fmt(s); newEnd = yStr;
    } else if (p === 'monthly') {
      const s = new Date(yesterday); s.setDate(1);
      newStart = fmt(s); newEnd = yStr;
    } else if (p === '30d') {
      const s = new Date(yesterday); s.setDate(s.getDate() - 29);
      newStart = fmt(s); newEnd = yStr;
    }

    setStartDate(newStart);
    setEndDate(newEnd);
    setPeriod(p);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  const tabs = [
    { id: "C", label: "DELIVERY", sub: "DB-010 · DB-011" },
    { id: "A", label: "EQUIPMENT", sub: "DB-001 · DB-002" },
    { id: "B", label: "LOADING & FUEL", sub: "DB-003 to DB-009" },
  ];

  const { db003, db007, multiplier, kpis } = generateMockData(period, startDate, endDate, db003Data, db007Data);
  const barges = generateBargeData(period, startDate, endDate, multiplier);

  const currentDailyActual = DAILY_ACTUAL * multiplier;
  const currentDailyTarget = dailyTarget * multiplier;
  const currentDailyPct = Math.min(100, pct(currentDailyActual, currentDailyTarget));

  const currentMtdActual = MTD_ACTUAL_BASE + (period !== 'daily' ? (DAILY_ACTUAL * (multiplier - 1)) : 0);
  const mtdPct = pct(currentMtdActual, monthlyTarget);

  const eqData = generateEqData(period, startDate, endDate, multiplier);
  const periodLabel = period === 'daily' ? 'Yesterday' : period === 'weekly' ? 'This Week' : period === 'monthly' ? 'This Month' : period === '30d' ? 'Last 30 Days' : period === '7d' ? 'Last 7 Days' : 'Custom Range';
  const displayRange = startDate === endDate ? fmtDT2(startDate) : `${fmtDT2(startDate)} — ${fmtDT2(endDate)}`;

  return (
    <div style={{ background: "#f8f9fc", minHeight: "100vh" }}>
      {/* Top Navigation */}
      <div style={{ background: "#ffffff", padding: "12px 32px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "#0f172a", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 800 }}>F</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", fontFamily: "Inter", letterSpacing: "-0.02em" }}>Futong Dashboard</div>
            <div style={{ fontSize: 9, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Operational Port Performance</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", gap: 24 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: "transparent", border: "none", cursor: "pointer", padding: "8px 0",
                  position: "relative", display: "flex", flexDirection: "column", alignItems: "left"
                }}
              >
                <span style={{ fontSize: 12, fontWeight: activeTab === tab.id ? 800 : 600, color: activeTab === tab.id ? "#0f172a" : "#94a3b8", transition: "all 0.2s" }}>
                  {tab.label}
                </span>
                {activeTab === tab.id && <motion.div layoutId="tabUnderline" style={{ height: 3, background: "#38BDF8", width: "100%", borderRadius: 2, position: "absolute", bottom: 0 }} />}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAnnualModalOpen(true)}
            style={{ background: "#0f172a", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
            onMouseLeave={e => e.currentTarget.style.background = "#0f172a"}
          >
            Manage Annual Targets
          </button>
        </div>
      </div>

      {/* Control Bar (Sub-header) */}
      <div style={{ background: "#ffffff", padding: "10px 32px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 61, zIndex: 99, boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", background: "#f1f5f9", padding: 3, borderRadius: 10, gap: 2 }}>
            {["daily", "weekly", "monthly", "7d", "30d"].map(p => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                style={{
                  background: period === p ? "#ffffff" : "transparent",
                  border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 10, fontWeight: period === p ? 800 : 600,
                  color: period === p ? "#0f172a" : "#64748b", cursor: "pointer", transition: "all 0.2s",
                  boxShadow: period === p ? "0 1px 3px rgba(0,0,0,0.1)" : "none", textTransform: "capitalize"
                }}
              >
                {p === "7d" ? "Last 7d" : p === "30d" ? "Last 30d" : p}
              </button>
            ))}
          </div>
          <div style={{ height: 20, width: 1, background: "#e2e8f0", margin: "0 4px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: 10, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Focus:</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", fontFamily: "DM Mono", textTransform: "capitalize" }}>
              {periodLabel}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative" }} ref={datePickerRef}>
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 10, padding: "0 12px", height: 36, cursor: "pointer", outline: "none" }}
            >
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 700 }}>RANGE:</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", fontFamily: "DM Mono" }}>
                {displayRange}
              </span>
            </button>

            {isDatePickerOpen && (
              <div style={{ position: "absolute", top: 44, right: 0, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", zIndex: 100, display: "flex", flexDirection: "column", gap: 12, width: 220 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    max={endDate}
                    onChange={handleStartDateChange}
                    style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 12px", fontSize: 13, fontFamily: "DM Mono", outline: "none", color: "#0f172a" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={handleEndDateChange}
                    style={{ border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 12px", fontSize: 13, fontFamily: "DM Mono", outline: "none", color: "#0f172a" }}
                  />
                </div>
                <button 
                  onClick={() => setIsDatePickerOpen(false)}
                  style={{ background: "#0f172a", color: "white", border: "none", borderRadius: 6, padding: "8px", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 4 }}
                >
                  Done
                </button>
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b" }}>
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "DM Mono" }}>00:40:40</span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          </div>
        </div>
      </div>

      <div style={{ padding: "0 32px 32px", maxWidth: 1600, margin: "0 auto", width: "100%" }}>
        <div style={{ animation: "fadeIn 0.4s ease-out", position: "relative", marginTop: 24 }}>
          {isLoading && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(2px)", zIndex: 50, borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{
                width: 40, height: 40, border: "3px solid #f1f5f9", borderTopColor: "#38BDF8",
                borderRadius: "50%", animation: "spin 0.8s linear infinite"
              }}>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            </div>
          )}

          {activeTab === "A" && <GroupA eqData={eqData} periodLabel={periodLabel} />}
          {activeTab === "B" && (
            <GroupB
              db003Data={db003}
              db007Data={db007}
              db003Mode={db003Mode}
              setDb003Mode={setDb003Mode}
              db007Mode={db007Mode}
              setDb007Mode={setDb007Mode}
              periodLabel={periodLabel}
              kpis={kpis}
              barges={barges}
            />
          )}
          {activeTab === "C" && (
            <GroupC
              dailyTarget={currentDailyTarget}
              monthlyTarget={monthlyTarget}
              MTD_ACTUAL={currentMtdActual}
              multiplier={multiplier}
              startDate={startDate}
              endDate={endDate}
              period={period}
            />
          )}
        </div>
      </div>

      <AnnualTargetModal
        isOpen={isAnnualModalOpen}
        onClose={() => setIsAnnualModalOpen(false)}
        annualTargets={annualTargets}
        setAnnualTargets={setAnnualTargets}
      />
    </div>
  );
}
