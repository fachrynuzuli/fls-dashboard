import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie
} from "recharts";

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

const loadingData = [
  { unit: "MHP0025", rate: 360, target: 355, tons: 5801 },
  { unit: "MHP0026", rate: 349, target: 355, tons: 4782 },
  { unit: "MHP0027", rate: 442, target: 355, tons: 7912 },
  { unit: "MHP0028", rate: 326, target: 355, tons: 4536 },
];

const fuelData = [
  { unit: "MHP0025", lpt: 0.144, target: 0.143, operator: "Budi S." },
  { unit: "MHP0026", lpt: 0.116, target: 0.143, operator: "Andi R." },
  { unit: "MHP0027", lpt: 0.151, target: 0.143, operator: "Hendra W." },
  { unit: "MHP0028", lpt: 0.148, target: 0.143, operator: "Rizki F." },
];

const bargeData = [
  { barge: "KLM MAJU", lp: "LP-01", attach: "06:12", detach: "09:45", duration: "3h 33m", status: "done" },
  { barge: "BG HARAPAN", lp: "LP-02", attach: "07:30", detach: "11:10", duration: "3h 40m", status: "done" },
  { barge: "TK SINAR", lp: "LP-01", attach: "10:00", detach: "—", duration: "In Progress", status: "live" },
  { barge: "KM BERKAH", lp: "LP-03", attach: "13:15", detach: "—", duration: "In Progress", status: "live" },
];

const stackData = [
  { stack: 8, avgTime: "00:21", trips: 14 },
  { stack: 9, avgTime: "00:24", trips: 38 },
  { stack: 10, avgTime: "00:30", trips: 29 },
  { stack: 11, avgTime: "00:34", trips: 11 },
];

const deliveryTrend = [
  { day: "1", actual: 18200, target: 19000 },
  { day: "2", actual: 21400, target: 19000 },
  { day: "3", actual: 17800, target: 19000 },
  { day: "4", actual: 20100, target: 19000 },
  { day: "5", actual: 22300, target: 19000 },
  { day: "6", actual: 19600, target: 19000 },
  { day: "7", actual: 23100, target: 19000 },
  { day: "8", actual: 18700, target: 19000 },
  { day: "9", actual: 21000, target: 19000 },
  { day: "10", actual: 14136, target: 19000 },
];

const woodData = [
  { name: "Acacia", value: 74, tons: 10447, color: "#38BDF8" },
  { name: "Eucalyptus", value: 2, tons: 278, color: "#FB923C" },
  { name: "Gamelina", value: 24, tons: 3411, color: "#A78BFA" },
];

const DAILY_ACTUAL = 14136;
const MTD_ACTUAL = 196336;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("id-ID");
const pct = (a, t) => Math.round((a / t) * 100);

function KPITile({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e2e8f0",
      borderRadius: 16, padding: "20px 24px", flex: 1,
      boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)"
    }}>
      <div style={{ fontSize: 11, color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: accent || "#0f172a", lineHeight: 1, fontFamily: "'Bebas Neue', cursive" }}>{value}</div>
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

// ─── GROUPS ──────────────────────────────────────────────────────────────────
function GroupA() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", gap: 16 }}>
        <KPITile label="Fleet Avg Availability" value="90.3%" accent="#34D399" sub="Target: [TBC]" />
        <KPITile label="Fleet Avg Utilization" value="71.0%" accent="#38BDF8" sub="of available hours" />
        <KPITile label="Total Downtime Today" value="9.4 hrs" accent="#FB923C" sub="across 4 units" />
        <KPITile label="Units Reporting" value="4 / 4" accent="#A78BFA" sub="MHP0025–0028" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>DB-001 · Availability per Unit (%)</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={availData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="unit" tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <ReferenceLine y={90} stroke={TARGET_COLOR} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target [TBC]", fill: TARGET_COLOR, fontSize: 10, fontFamily: "DM Mono", position: "top", dy: -4 }} />
              <Bar dataKey="availability" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {availData.map((d, i) => <Cell key={i} fill={d.availability >= 90 ? "#34D399" : "#FB923C"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 12 }}>
            {availData.map((d, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#64748B", fontFamily: "DM Mono" }}>{d.unit}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: d.availability >= 90 ? "#34D399" : "#FB923C", fontFamily: "Bebas Neue" }}>{d.availability}%</div>
                <div style={{ fontSize: 10, color: "#475569", fontFamily: "DM Mono" }}>↓ {d.downtime}h DT</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>DB-002 · Utilization per Unit (%)</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={utilData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="unit" tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="utilization" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {utilData.map((d, i) => <Cell key={i} fill={COLORS[i]} fillOpacity={0.85} />)}
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

function GroupB({ db003Mode, setDb003Mode, db007Mode, setDb007Mode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <WarningBanner text="2 trips in this period have not yet been weighed by Max-C. Displayed tonnage may be incomplete." />

      <div style={{ display: "flex", gap: 16 }}>
        <KPITile label="Fleet Avg Loading Rate" value="369 t/h" accent="#38BDF8" sub="Target 355 t/h" />
        <KPITile label="Best Performer" value="MHP0027" accent="#34D399" sub="442 t/h today" />
        <KPITile label="Fleet Avg Fuel Burn" value="0.140 L/t" accent="#34D399" sub="Target 0.143 L/t" />
        <KPITile label="Avg Barge Turnaround" value="3h 37m" accent="#A78BFA" sub="2 completed today" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ flex: 1 }}><SectionTitle>DB-003 · Loading Rate (t/h)</SectionTitle></div>
            <FilterToggle
              active={db003Mode}
              options={[{ label: "PER UNIT", value: "unit" }, { label: "PER OPERATOR", value: "operator" }]}
              onChange={setDb003Mode}
            />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={loadingData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey={db003Mode} tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis domain={[280, 480]} tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <ReferenceLine y={355} stroke={TARGET_COLOR} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 355", fill: TARGET_COLOR, fontSize: 10, fontFamily: "DM Mono", position: "top", dy: -4 }} />
              <Bar dataKey="rate" name="rate" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {loadingData.map((d, i) => <Cell key={i} fill={d.rate >= d.target ? "#34D399" : "#FB923C"} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ flex: 1 }}><SectionTitle>DB-007 · Fuel Efficiency (L/ton)</SectionTitle></div>
            <FilterToggle
              active={db007Mode}
              options={[{ label: "PER UNIT", value: "unit" }, { label: "PER OPERATOR", value: "operator" }]}
              onChange={setDb007Mode}
            />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fuelData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey={db007Mode} tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0.08, 0.18]} tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <ReferenceLine y={0.143} stroke={TARGET_COLOR} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Target 0.143", fill: TARGET_COLOR, fontSize: 10, fontFamily: "DM Mono", position: "top", dy: -4 }} />
              <Bar dataKey="lpt" name="lpt" radius={[6, 6, 0, 0]} maxBarSize={52}>
                {fuelData.map((d, i) => <Cell key={i} fill={d.lpt <= d.target ? "#34D399" : "#FB923C"} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>DB-008 · Barge Unloading Time</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {bargeData.map((b, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 60px 70px 70px 110px 100px",
                alignItems: "center", gap: 8,
                background: b.status === "live" ? "rgba(56,189,248,0.05)" : "#f8fafc",
                border: `1px solid ${b.status === "live" ? "rgba(56,189,248,0.2)" : "#e2e8f0"}`,
                borderRadius: 8, padding: "8px 12px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b", fontFamily: "DM Mono" }}>{b.barge}</div>
                <div style={{ fontSize: 11, color: "#64748B", fontFamily: "DM Mono" }}>{b.lp}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "DM Mono" }}>▶ {b.attach}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "DM Mono" }}>■ {b.detach}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: b.status === "live" ? "#38BDF8" : "#34D399", fontFamily: "Bebas Neue", letterSpacing: "0.05em" }}>{b.duration}</div>
                <div style={{
                  fontSize: 10, fontFamily: "DM Mono", padding: "2px 8px", borderRadius: 20,
                  background: b.status === "live" ? "rgba(56,189,248,0.1)" : "rgba(52,211,153,0.1)",
                  color: b.status === "live" ? "#0284c7" : "#059669",
                  textAlign: "center", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600
                }}>
                  {b.status === "live" ? "● Live" : "✓ Complete"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>DB-009 · Avg Loading Time by Stack Count</SectionTitle>
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
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

function GroupC({ dailyTarget, setDailyTarget, monthlyTarget, setMonthlyTarget }) {
  const dailyPct = Math.round((DAILY_ACTUAL / dailyTarget) * 100);
  const mtdPct = Math.round((MTD_ACTUAL / monthlyTarget) * 100);
  const remaining = dailyTarget - DAILY_ACTUAL;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", fontFamily: "DM Mono", textTransform: "uppercase", letterSpacing: "0.05em" }}>Target Configuration</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: 11, color: "#64748b", fontFamily: "DM Mono" }}>Daily (t):</label>
          <input
            type="number"
            value={dailyTarget}
            onChange={(e) => setDailyTarget(Number(e.target.value))}
            style={{ width: 100, padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "DM Mono", fontWeight: 600 }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: 11, color: "#64748b", fontFamily: "DM Mono" }}>Monthly (t):</label>
          <input
            type="number"
            value={monthlyTarget}
            onChange={(e) => setMonthlyTarget(Number(e.target.value))}
            style={{ width: 120, padding: "6px 10px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, fontFamily: "DM Mono", fontWeight: 600 }}
          />
        </div>
      </div>

      <WarningBanner text="2 trips in this period have not yet been weighed by Max-C. Tonnage may be updated upon sync. Next sync scheduled: 14:30 WIB" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* DB-010 Daily */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>DB-010 · Delivery Progress — Today</SectionTitle>
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
                <div style={{ fontSize: 36, fontWeight: 700, color: "#38BDF8", fontFamily: "Bebas Neue" }}>{fmt(DAILY_ACTUAL)} t</div>
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
              <div style={{
                height: "100%", width: `${Math.min(100, dailyPct)}%`,
                background: `linear-gradient(90deg, #38BDF8, #34D399)`,
                borderRadius: 6, transition: "width 1s ease"
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono" }}>06:00</div>
              <div style={{ fontSize: 10, color: "#64748B", fontFamily: "DM Mono" }}>10/03/2026  ·  As of 12:31 WIB</div>
              <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono" }}>05:59 +1</div>
            </div>
          </div>
        </div>

        {/* DB-011 MTD */}
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>DB-011 · Delivery Achievement — MTD</SectionTitle>
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
                <div style={{ fontSize: 10, color: "#94A3B8", fontFamily: "DM Mono", letterSpacing: "0.1em", textTransform: "uppercase" }}>Day 10 of 31</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#64748B", fontFamily: "Bebas Neue" }}>{fmt(Math.max(0, monthlyTarget - MTD_ACTUAL))} t left</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>Daily Delivery Trend — March 2026 (ton)</SectionTitle>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={deliveryTrend} margin={{ top: 20, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94A3B8", fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={customTooltip} />
              <ReferenceLine y={dailyTarget} stroke={TARGET_COLOR} strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `Target ${fmt(dailyTarget)}`, fill: TARGET_COLOR, fontSize: 10, fontFamily: "DM Mono", position: "top", dy: -4 }} />
              <Line type="monotone" dataKey="actual" stroke="#A78BFA" strokeWidth={2.5} dot={{ fill: "#A78BFA", r: 3 }} name="actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
          <SectionTitle>Wood Species Mix — Today</SectionTitle>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={woodData} cx="50%" cy="50%" innerRadius={36} outerRadius={58} dataKey="value" paddingAngle={3}>
                {woodData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontFamily: "DM Mono", fontSize: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {woodData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                  <div style={{ fontSize: 11, color: "#64748B", fontFamily: "DM Mono" }}>{d.name}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: d.color, fontFamily: "DM Mono" }}>{fmt(d.tons)} t ({d.value}%)</div>
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

  const tabs = [
    { id: "C", label: "DELIVERY", sub: "DB-010 · DB-011" },
    { id: "A", label: "EQUIPMENT", sub: "DB-001 · DB-002" },
    { id: "B", label: "LOADING & FUEL", sub: "DB-003 to DB-009" },
  ];

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1600, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Futong Port Operations</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Real-time performance metrics for Port Dept.</div>
        </div>
        <div style={{ display: "flex", alignItems: "stretch", height: 40, gap: 4, background: "#f1f5f9", padding: 4, borderRadius: 10 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                background: activeTab === t.id ? "#ffffff" : "transparent",
                border: "none",
                borderRadius: 8,
                padding: "0 20px", cursor: "pointer",
                color: activeTab === t.id ? "#0f172a" : "#94a3b8",
                fontSize: 12, fontWeight: activeTab === t.id ? 700 : 500,
                transition: "all 0.2s", letterSpacing: "0.05em",
                boxShadow: activeTab === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ animation: "fadeIn 0.4s ease-out" }}>
        {activeTab === "A" && <GroupA />}
        {activeTab === "B" && (
          <GroupB
            db003Mode={db003Mode} setDb003Mode={setDb003Mode}
            db007Mode={db007Mode} setDb007Mode={setDb007Mode}
          />
        )}
        {activeTab === "C" && (
          <GroupC
            dailyTarget={dailyTarget} setDailyTarget={setDailyTarget}
            monthlyTarget={monthlyTarget} setMonthlyTarget={setMonthlyTarget}
          />
        )}
      </div>
    </div>
  );
}
