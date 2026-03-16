import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileMockup() {
  const NAVY="#1B2E6B",NAVY2="#243A80",TEAL="#0ABFDE",AMBER="#F59E0B",AMBERBG="#FEF3C7",DANGER="#EF4444",SUCCESS="#10B981",GRAY="#F0F2F7",BORDER="#E5E7EB",MUTED="#6B7280",TEXT="#111827";

  const [activeScreen, setActiveScreen] = useState('tc');
  const [activeUnitId, setActiveUnitId] = useState(null);

  // Global State for Prototype
  const [units, setUnits] = useState([
    { id: "MHP0025", jetty: "Jetty Futong - P1", barge: "BG. Sentosa Jaya 2308", op: "Amrojali", status: "running", queue: ["RTP0285"] },
    { id: "MHP0026", jetty: "Jetty Futong - P2", barge: "BG. Glory Marine 7", op: "Ricardo H.", status: "idle", queue: [] },
    { id: "MHP0027", jetty: "Jetty Futong - P3", barge: "BG. Glory Marine 3", op: "—", status: "idle", queue: [] },
    { id: "MHP0028", jetty: "Jetty Futong - P5", barge: "BG. Capricorn 119", op: "—", status: "downtime", queue: ["BDP0057", "RTP0102"] },
  ]);

  const [incomingTrucks, setIncomingTrucks] = useState([
    "BDP0012", "RTP0344", "BDP0088", "RTP0199"
  ]);

  const nav = (screen, unitId = null) => {
    if (unitId) setActiveUnitId(unitId);
    setActiveScreen(screen);
  };

  const getUnit = () => units.find(u => u.id === activeUnitId) || units[0];

  const updateUnitStatus = (id, newStatus, newOp = null) => {
    setUnits(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: newStatus, op: newOp !== null ? newOp : u.op };
      }
      return u;
    }));
  };

  const assignTruck = (truckStr, unitId) => {
    setIncomingTrucks(prev => prev.filter(t => t !== truckStr));
    setUnits(prev => prev.map(u => u.id === unitId ? { ...u, queue: [...u.queue, truckStr] } : u));
    nav('tc');
  };

  const SCREENS = [
    {id:"tc", label:"TC Dashboard", info: "Redesigned TC dashboard featuring Top Summary Bar, live MH status indicators, and Truck Queuing UI mirroring the real-world flow (Barge -> MH -> Truck)."},
    {id:"downtime", label:"Log Downtime", info: "Marks the unit as Downtime. Status pill on TC Dashboard will turn yellow."},
    {id:"start", label:"Start Sequence", info: "Starts a loading sequence. Pops the first truck from the queue into 'Loading' state. Status turns green."},
    {id:"stop", label:"Stop Sequence", info: "Finishes the sequence for the current truck. Truck is removed from queue. Status returns to Idle."},
    {id:"ts", label:"Timesheet", info: "Shows historical sequences for the unit."},
    {id:"barge", label:"Barge Operations", info: "Manage barge attachments and detachments for this unit."},
    {id:"trucks", label:"Assign Truck", info: "Select an incoming truck to join the queue at a specific Material Handler."}
  ];

  const activeScreenConfig = SCREENS.find(s => s.id === activeScreen) || SCREENS[0];

  const StatusPill = ({ status }) => {
    if (status === 'running') return <span style={{ background: '#ECFDF5', color: '#065F46', border: `1px solid ${SUCCESS}`, padding: '2px 6px', borderRadius: '12px', fontSize: '9px', fontWeight: 700 }}>&#9679; RUNNING</span>;
    if (status === 'downtime') return <span style={{ background: AMBERBG, color: '#92400E', border: `1px solid ${AMBER}`, padding: '2px 6px', borderRadius: '12px', fontSize: '9px', fontWeight: 700 }}>&#9679; DOWNTIME</span>;
    return <span style={{ background: '#F3F4F6', color: MUTED, border: `1px solid ${BORDER}`, padding: '2px 6px', borderRadius: '12px', fontSize: '9px', fontWeight: 700 }}>&#9675; IDLE</span>;
  };

  const AndroidNav = () => (
    <div style={{ background: '#1a1a1a', padding: '5px 0', display: 'flex', justifyContent: 'center', gap: '52px' }}>
      <span style={{ color: '#888', fontSize: '14px', cursor: 'pointer' }} onClick={() => nav('tc')}>|||</span>
      <span style={{ color: '#888', fontSize: '16px', cursor: 'pointer' }} onClick={() => nav('tc')}>&#9675;</span>
      <span style={{ color: '#888', fontSize: '14px', cursor: 'pointer' }} onClick={() => nav('tc')}>&#8249;</span>
    </div>
  );

  const Header = ({ user, id }) => (
    <div style={{ background: NAVY, padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1.1 }}>
          <span style={{ fontSize: '5.5px', fontWeight: 800, color: NAVY }}>DIGI</span><span style={{ fontSize: '5.5px', fontWeight: 800, color: NAVY }}>fleet</span>
        </div>
      </div>
      <div style={{ textAlign: 'right', color: 'white' }}>
        <div style={{ fontSize: '12px', fontWeight: 600 }}>{user}</div>
        <div style={{ fontSize: '10px', opacity: 0.65 }}>{id}</div>
      </div>
    </div>
  );

  const MhCard = ({ unit }) => {
    return (
      <div style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${BORDER}`, flex: '0 0 260px', minWidth: '260px', display: 'flex', flexDirection: 'column', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* Barge Section (Clickable) */}
        <div onClick={() => nav('barge', unit.id)} style={{ background: '#F8FAFC', padding: '8px 10px', textAlign: 'center', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='#F1F5F9'} onMouseLeave={e=>e.currentTarget.style.background='#F8FAFC'}>
          <div style={{ fontSize: '16px' }}>&#128674;</div>
          <div style={{ fontSize: '10px', color: NAVY, fontWeight: 600, marginTop: '2px' }}>{unit.barge}</div>
          <div style={{ fontSize: '8px', color: MUTED }}>Click to manage barge</div>
        </div>
        
        {/* MH Section */}
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ fontWeight: 800, fontSize: '14px', color: NAVY }}>{unit.id}</div>
            <StatusPill status={unit.status} />
          </div>
          <div style={{ fontSize: '10px', color: MUTED, marginBottom: '2px' }}>&#8599; {unit.jetty}</div>
          <div style={{ fontSize: '10px', color: MUTED, marginBottom: '8px' }}>&#128100; Operator: <strong>{unit.op}</strong></div>
          
          <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            <button onClick={() => nav('downtime', unit.id)} style={{ flex: 1, background: 'white', border: `1px solid ${BORDER}`, color: MUTED, fontSize: '9px', fontWeight: 600, padding: '4px 0', borderRadius: '4px', cursor: 'pointer' }}>DOWNTIME</button>
            <button onClick={() => nav('ts', unit.id)} style={{ flex: 1, background: 'white', border: `1px solid ${BORDER}`, color: MUTED, fontSize: '9px', fontWeight: 600, padding: '4px 0', borderRadius: '4px', cursor: 'pointer' }}>TIMESHEET</button>
          </div>

          {/* Combined Start/Stop Sequence Button */}
          {unit.status === 'running' ? (
            <button onClick={() => nav('stop', unit.id)} style={{ width: '100%', background: '#FEE2E2', color: DANGER, border: `1px solid #FCA5A5`, fontSize: '10px', fontWeight: 700, padding: '6px 0', borderRadius: '4px', cursor: 'pointer' }}>STOP SEQ (Loading)</button>
          ) : (
             <button onClick={() => nav('start', unit.id)} style={{ width: '100%', background: NAVY, color: 'white', border: 'none', fontSize: '10px', fontWeight: 700, padding: '6px 0', borderRadius: '4px', cursor: 'pointer', opacity: unit.queue.length === 0 ? 0.5 : 1 }} disabled={unit.queue.length === 0}>
               {unit.queue.length === 0 ? 'NO TRUCKS IN QUEUE' : 'START SEQ'}
             </button>
          )}

        </div>

        {/* Truck Queue Section */}
        <div style={{ background: '#F8FAFC', borderTop: `1px solid ${BORDER}`, padding: '8px 10px' }}>
          <div style={{ fontSize: '9px', fontWeight: 700, color: MUTED, marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>TRUCK QUEUE ({unit.queue.length})</span>
            <span onClick={() => nav('trucks', unit.id)} style={{ color: TEAL, cursor: 'pointer' }}>+ Assign</span>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', minHeight: '22px' }}>
            {unit.queue.length === 0 ? (
              <span style={{ fontSize: '9px', color: '#9CA3AF', fontStyle: 'italic' }}>Empty queue</span>
            ) : (
              unit.queue.map((t, idx) => (
                <div key={idx} style={{ background: idx === 0 && unit.status === 'running' ? SUCCESS : 'white', color: idx === 0 && unit.status === 'running' ? 'white' : TEXT, border: `1px solid ${idx === 0 && unit.status === 'running' ? SUCCESS : BORDER}`, borderRadius: '3px', padding: '2px 4px', fontSize: '9px', fontWeight: 600 }}>
                  &#128666; {t}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    );
  };

  const ScreenTC = () => {
    const activeRunning = units.filter(u => u.status === 'running').length;
    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Summary Bar */}
        <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '9px', color: MUTED, fontWeight: 600, textTransform: 'uppercase' }}>Active Units</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: NAVY }}>{activeRunning} <span style={{ fontSize: '10px', color: MUTED, fontWeight: 500 }}>/ {units.length}</span></div>
            </div>
            <div>
              <div style={{ fontSize: '9px', color: MUTED, fontWeight: 600, textTransform: 'uppercase' }}>Barges</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: NAVY }}>4</div>
            </div>
            <div>
              <div style={{ fontSize: '9px', color: MUTED, fontWeight: 600, textTransform: 'uppercase' }}>Est. Rate</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: NAVY }}>1,250 <span style={{ fontSize: '10px', color: MUTED, fontWeight: 500 }}>T/hr</span></div>
            </div>
          </div>
          <button onClick={() => nav('trucks')} style={{ background: TEAL, color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 4px rgba(10, 191, 222, 0.2)' }}>
            INCOMING TRUCKS ({incomingTrucks.length})
          </button>
        </div>

        <div style={{ padding: '12px', display: 'flex', gap: '12px', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', minHeight: 0 }}>
          {units.map(u => <MhCard key={u.id} unit={u} />)}
        </div>
      </motion.div>
    );
  };

  const ScreenDowntime = () => {
    const unit = getUnit();
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ background: NAVY, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span onClick={() => nav('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
             <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Log Downtime</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>{unit.id} — {unit.jetty}</div></div>
          </div>
          <div style={{ padding: '14px' }}>
            <div style={{ marginBottom: '13px' }}>
              <div style={{ fontSize: '10px', color: MUTED, marginBottom: '6px' }}>Category <span style={{ color: DANGER }}>*</span></div>
              {["Daily Maintenance", "Preventive Service", "Urgent Repair"].map((c, i) => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 11px', borderRadius: '6px', border: `1px solid ${i === 0 ? NAVY : BORDER}`, background: i === 0 ? "#EFF3FF" : "white", marginBottom: '5px', cursor: 'pointer' }}>
                  <div style={{ width: '15px', height: '15px', borderRadius: '50%', border: `2px solid ${i === 0 ? NAVY : "#d1d5db"}`, background: i === 0 ? NAVY : "white", display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i === 0 && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'white' }}></div>}
                  </div>
                  <span style={{ fontSize: '12px', color: i === 0 ? NAVY : TEXT, fontWeight: i === 0 ? 600 : 400 }}>{c}</span>
                </label>
              ))}
            </div>
            <button onClick={() => { updateUnitStatus(unit.id, 'downtime'); nav('tc'); }} style={{ width: '100%', background: NAVY, color: 'white', border: 'none', borderRadius: '6px', padding: '12px 0', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>SAVE & SET TO DOWNTIME</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenStart = () => {
    const unit = getUnit();
    const firstTruck = unit.queue[0] || "Unknown";
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ background: NAVY, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span onClick={() => nav('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
            <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Start Sequence</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>{unit.id} — Loading Truck {firstTruck}</div></div>
          </div>
          <div style={{ padding: '14px' }}>
             <div style={{ marginBottom: '13px' }}>
              <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>Operator <span style={{ color: DANGER }}>*</span></div>
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '9px 11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>&#128100;</div>
                  <div><div style={{ fontSize: '13px', fontWeight: 600 }}>Amrojali</div><div style={{ fontSize: '9px', color: MUTED }}>OPERATOR_MH</div></div>
                </div>
                <span style={{ color: MUTED }}>&#9660;</span>
              </div>
            </div>
            <div style={{ marginBottom: '13px' }}>
              <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>HM Start — Hour Meter reading <span style={{ color: DANGER }}>*</span></div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1, background: 'white', border: `1.5px solid ${NAVY}`, borderRadius: '6px', padding: '9px 11px', fontSize: '16px', fontWeight: 700, color: NAVY }}>1,205</div>
                <span style={{ fontSize: '12px', color: MUTED }}>hours</span>
              </div>
            </div>
            <button onClick={() => { updateUnitStatus(unit.id, 'running', 'Amrojali'); nav('tc'); }} style={{ width: '100%', background: SUCCESS, color: 'white', border: 'none', borderRadius: '6px', padding: '12px 0', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>START LOADING: {firstTruck}</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenStop = () => {
    const unit = getUnit();
    const activeTruck = unit.queue[0] || "Unknown";
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ background: NAVY, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span onClick={() => nav('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
            <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Stop Sequence</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>{unit.id} — Loading {activeTruck}</div></div>
          </div>
          <div style={{ padding: '14px' }}>
            <div style={{ background: '#ECFDF5', border: `1px solid ${SUCCESS}`, borderRadius: '6px', padding: '9px 11px', marginBottom: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ fontSize: '12px', color: '#065F46', fontWeight: 700 }}>&#9679; Active — {unit.op}</div><div style={{ fontSize: '10px', color: '#047857', marginTop: '1px' }}>Started: 08:30 &nbsp;&#183;&nbsp; Running: 45m</div></div>
            </div>
             <div style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', overflow: 'hidden', marginBottom: '13px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', background: GRAY }}>
                <div style={{ padding: '7px 9px', fontSize: '10px', color: MUTED, fontWeight: 600 }}></div>
                <div style={{ padding: '7px 9px', fontSize: '10px', color: MUTED, fontWeight: 600, borderLeft: `1px solid ${BORDER}`, textAlign: 'center' }}>START (locked)</div>
                <div style={{ padding: '7px 9px', fontSize: '10px', color: MUTED, fontWeight: 600, borderLeft: `1px solid ${BORDER}`, textAlign: 'center' }}>FINISH</div>
              </div>
              {[["HM (hours)", "1,205", "1,206"], ["FM (litres)", "4,820", "4,835"]].map(([lbl, s, f], idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', borderTop: `1px solid ${BORDER}` }}>
                  <div style={{ padding: '9px', fontSize: '11px', color: TEXT, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>{lbl}</div>
                  <div style={{ padding: '9px', borderLeft: `1px solid ${BORDER}`, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '14px', fontWeight: 600, color: MUTED }}>{s}</span></div>
                  <div style={{ padding: '6px', borderLeft: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', border: `1.5px solid ${NAVY}`, borderRadius: '5px', padding: '6px 10px', fontSize: '14px', fontWeight: 700, color: NAVY, minWidth: '65px', textAlign: 'center' }}>{f}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { 
              // Stop sequence logic: set to idle, pop the truck from queue
              setUnits(prev => prev.map(u => {
                if(u.id === unit.id) return { ...u, status: 'idle', queue: u.queue.slice(1) };
                return u;
              }));
              nav('tc'); 
            }} style={{ width: '100%', background: DANGER, color: 'white', border: 'none', borderRadius: '6px', padding: '12px 0', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>STOP & DISMISS TRUCK</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenTS = () => {
    let prevHm = 1205;
    let prevFm = 4820;
    
    // generate fake logs based on unit id to look dynamic
    const rows = [
      { op: "Amrojali", s: "08:30", e: "10:45", hms: prevHm, hmf: prevHm+12, fms: prevFm, fmf: prevFm+145 },
      { op: "Budi S.", s: "11:00", e: "13:30", hms: prevHm+12, hmf: prevHm+24, fms: prevFm+145, fmf: prevFm+292 },
      { op: "Ricardo H.", s: "14:00", e: "16:30", hms: prevHm+24, hmf: prevHm+36, fms: prevFm+292, fmf: prevFm+438 },
    ];
    
    const totalHm = rows.reduce((acc, r) => acc + (r.hmf - r.hms), 0);
    const totalFm = rows.reduce((acc, r) => acc + (r.fmf - r.fms), 0);

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ background: NAVY, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span onClick={() => nav('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
            <div><div style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>Timesheet — {getUnit().id}</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>13 March 2026 &nbsp;&#183;&nbsp; {rows.length} sequences</div></div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${BORDER}` }}>
                  <th style={{ padding: '8px' }}>Operator</th><th style={{ padding: '8px' }}>Start</th><th style={{ padding: '8px' }}>Stop</th>
                  <th style={{ padding: '8px' }}>HM Start</th><th style={{ padding: '8px' }}>HM Finish</th><th style={{ padding: '8px' }}>&Delta; HM</th>
                  <th style={{ padding: '8px' }}>FM Start</th><th style={{ padding: '8px' }}>FM Finish</th><th style={{ padding: '8px' }}>&Delta; FM</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#FAFAFA', borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '8px', fontWeight: 600, color: NAVY }}>{r.op}</td>
                    <td style={{ padding: '8px' }}>{r.s}</td><td style={{ padding: '8px' }}>{r.e}</td>
                    <td style={{ padding: '8px' }}>{r.hms.toLocaleString()}</td><td style={{ padding: '8px' }}>{r.hmf.toLocaleString()}</td>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#0891B2' }}>{r.hmf - r.hms}h</td>
                    <td style={{ padding: '8px' }}>{r.fms.toLocaleString()}</td><td style={{ padding: '8px' }}>{r.fmf.toLocaleString()}</td>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#0891B2' }}>{r.fmf - r.fms} L</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#F0F9FF', borderTop: '2px solid #BAE6FD' }}>
                  <td colSpan="5" style={{ padding: '8px', fontWeight: 700, color: '#0369A1', fontSize: '12px' }}>TOTALS</td>
                  <td style={{ padding: '8px', fontWeight: 700, color: '#0369A1' }}>{totalHm}h</td>
                  <td colSpan="2"></td>
                  <td style={{ padding: '8px', fontWeight: 700, color: '#0369A1' }}>{totalFm} L</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenBarge = () => {
    const unit = getUnit();
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px', background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <div style={{ background: NAVY, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span onClick={() => nav('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
              <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Attach Barge</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>{unit.id} — {unit.jetty}</div></div>
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ background: '#f5f5f5', borderRadius: '6px', padding: '9px 11px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>&#128674;</span>
                <div><div style={{ fontSize: '12px', fontWeight: 600 }}>BG. Glory Marine 12 / TB. HB 9</div><div style={{ fontSize: '10px', color: MUTED }}>Jumbo</div></div>
              </div>
              <button onClick={() => nav('tc')} style={{ width: '100%', background: NAVY, color: 'white', border: 'none', borderRadius: '6px', padding: '11px 0', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>ATTACH BARGE</button>
            </div>
          </div>
          
          <div style={{ flex: '1 1 240px', background: 'white', borderRadius: '8px', border: `1px solid ${SUCCESS}`, overflow: 'hidden' }}>
            <div style={{ background: NAVY, padding: '10px 14px' }}>
              <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Current Barge Status</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>{unit.id}</div></div>
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ background: '#ECFDF5', border: `1px solid ${SUCCESS}`, borderRadius: '6px', padding: '9px 11px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#065F46', fontWeight: 700 }}>&#9679; ATTACHED since 08:00</div>
                <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px' }}>{unit.barge}</div>
                <div style={{ fontSize: '11px', color: '#047857' }}>Running duration: 2h 30m</div>
              </div>
              <button onClick={() => nav('tc')} style={{ width: '100%', background: DANGER, color: 'white', border: 'none', borderRadius: '6px', padding: '11px 0', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>DETACH BARGE</button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenTrucks = () => {
    const unit = getUnit();
    // Re-usable screen. If activeUnitId is set, we are assigning to that unit.
    // If activeUnitId is null, we are just looking at the global pool.
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden', maxWidth: '520px', margin: '0 auto' }}>
           <div style={{ background: NAVY, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span onClick={() => nav('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Incoming Trucks</div>
              <div style={{ color: '#aac4ff', fontSize: '10px' }}>{activeUnitId ? `Assign to ${unit.id}` : 'Global Port Queue'}</div>
            </div>
          </div>
          <div style={{ padding: '14px' }}>
            <p style={{ fontSize: '11px', color: MUTED, marginBottom: '12px' }}>
              {activeUnitId ? `Click a truck to assign it to the queue for ${unit.id}.` : `These trucks are currently en route to the port.`}
            </p>
            {incomingTrucks.length === 0 ? (
               <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: MUTED, background: '#F8FAFC', borderRadius: '6px' }}>
                 No incoming trucks at the moment.
               </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {incomingTrucks.map(t => (
                  <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${BORDER}`, borderRadius: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{ fontSize: '16px' }}>&#128666;</span>
                       <span style={{ fontSize: '13px', fontWeight: 600, color: NAVY }}>{t}</span>
                    </div>
                    {activeUnitId && (
                      <button onClick={() => assignTruck(t, unit.id)} style={{ background: TEAL, color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>ASSIGN &#8594;</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#F0F2F7', padding: '12px', minHeight: '100%', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>

      {/* Page header */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1B2E6B' }}>Digifleet Mobile — DA Enhancement Mockups</div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>TC Dashboard UI Overhaul (Barge &#8594; MH &#8594; Truck Flow)</div>
        </div>
        <div style={{ fontSize: '10px', color: '#6B7280' }}>March 2026</div>
      </div>
      
      {/* External Info Bar */}
      <div style={{ background: 'white', padding: '14px', borderRadius: '8px', border: `1px solid ${BORDER}`, marginBottom: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: NAVY, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {activeScreenConfig.label} Info
        </div>
        <div style={{ fontSize: '13px', color: TEXT, lineHeight: 1.5 }}>
          {activeScreenConfig.info}
        </div>
        
         {activeScreen !== 'tc' && (
           <button onClick={() => nav('tc')} style={{ marginTop: '10px', background: '#F3F4F6', border: `1px solid ${BORDER}`, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 600, color: NAVY }}>
             &#8592; Back to TC Dashboard
           </button>
         )}
      </div>

      {/* Device frame - LANDSCAPE */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px 0',
        background: '#f1f5f9',
        borderRadius: '12px',
        flex: 1
      }}>
        <div style={{ 
          background: '#2a2a2a', 
          borderRadius: '32px', 
          padding: '12px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          width: '840px',
          height: '440px',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', width: '4px', height: '40px', background: '#444', borderRadius: '2px' }} />
          
          <div style={{ 
            background: 'white', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column', 
            width: '100%',
            height: '100%',
            border: '2px solid #000'
          }}>
            <Header user="Rindam Manihuruk" id="20031492" />
            
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <AnimatePresence mode="wait">
                {activeScreen === 'tc' && <ScreenTC key="tc" />}
                {activeScreen === 'downtime' && <ScreenDowntime key="downtime" />}
                {activeScreen === 'start' && <ScreenStart key="start" />}
                {activeScreen === 'stop' && <ScreenStop key="stop" />}
                {activeScreen === 'ts' && <ScreenTS key="ts" />}
                {activeScreen === 'barge' && <ScreenBarge key="barge" />}
                {activeScreen === 'trucks' && <ScreenTrucks key="trucks" />}
              </AnimatePresence>
            </div>

            <AndroidNav />
          </div>
        </div>
      </div>

    </div>
  )
}
