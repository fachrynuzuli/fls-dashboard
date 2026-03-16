import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileMockup() {
  const NAVY="#1B2E6B",NAVY2="#243A80",TEAL="#0ABFDE",AMBER="#F59E0B",AMBERBG="#FEF3C7",DANGER="#EF4444",SUCCESS="#10B981",GRAY="#F0F2F7",BORDER="#E5E7EB",MUTED="#6B7280",TEXT="#111827";

  const [active, setActive] = useState('tc');

  const SCREENS = [
    {id:"tc", label:"TC Dashboard", badge:"Home", bc:NAVY, info: "DA-001 context: LOG DOWNTIME added to each MH card. + NEW SEQUENCE replaces current event-based operator logging (DA-002/003/004)."},
    {id:"downtime", label:"Log Downtime", badge:"DA-001", bc:"#F59E0B", info: "DA-001 — New feature: Downtime logging for Mantsinen units. Accessible via LOG DOWNTIME on each MH card. Both actual_timestamp (user-entered) and save_timestamp (system) stored independently."},
    {id:"start", label:"Start Sequence", badge:"DA-002/003", bc:"#8B5CF6", info: "DA-002/003/004 — Logic change: Current system logs events (ASSIGNED_OPERATOR, ACTIVITY_FINISH) — HM always 0. New: one sequence row per continuous working period with real meter readings."},
    {id:"stop", label:"Stop Sequence", badge:"DA-004", bc:"#8B5CF6", info: "DA-002/003/004: TC enters finish meter readings. System calculates deltas. Multiple sequences per operator per unit per day fully supported."},
    {id:"ts", label:"Timesheet", badge:"DA-002/003/004", bc:"#8B5CF6", info: "Logic change: Current system logs events with HM = 0 on every row. New system logs sequences with real meter readings per row."},
    {id:"barge", label:"Barge", badge:"DA-005", bc:"#3B82F6", info: "DA-005 — New feature: Barge attach and detach timestamps. TC records both events with actual times (retroactive supported). Duration = Detach − Attach feeds DB-008."},
  ];

  const activeScreenConfig = SCREENS.find(s => s.id === active) || SCREENS[0];

  const AndroidNav = () => (
    <div style={{ background: '#1a1a1a', padding: '5px 0', display: 'flex', justifyContent: 'center', gap: '52px' }}>
      <span style={{ color: '#888', fontSize: '14px', cursor: 'pointer' }} onClick={() => setActive('tc')}>|||</span>
      <span style={{ color: '#888', fontSize: '16px', cursor: 'pointer' }} onClick={() => setActive('tc')}>&#9675;</span>
      <span style={{ color: '#888', fontSize: '14px', cursor: 'pointer' }} onClick={() => setActive('tc')}>&#8249;</span>
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

  const MhCard = ({ id, jetty, barge, op, trucks }) => {
    return (
      <div style={{ borderRadius: '7px', overflow: 'hidden', border: `1px solid ${BORDER}`, flex: '1 1 190px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#f5f5f5', padding: '7px 10px', textAlign: 'center', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: '17px' }}>&#128674;</div>
          <div style={{ fontSize: '9px', color: MUTED, marginTop: '1px' }}>{barge}</div>
        </div>
        <div style={{ background: NAVY, padding: '6px 10px' }}>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>{id}</div>
          <div style={{ color: '#aac4ff', fontSize: '9px', marginTop: '1px' }}>&#8599; {jetty}</div>
          <div style={{ color: '#aac4ff', fontSize: '9px' }}>&#128100; {op}</div>
        </div>
        <div style={{ background: 'white', padding: '8px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ marginBottom: '8px' }}>
            <button onClick={() => setActive('downtime')} style={{ width: '100%', background: AMBERBG, border: `1px solid ${AMBER}`, color: '#92400E', fontSize: '10px', fontWeight: 700, padding: '4px 0', borderRadius: '4px', cursor: 'pointer' }}>LOG DOWNTIME</button>
          </div>

          <div style={{ marginBottom: '8px', display: 'flex', gap: '5px' }}>
            <button onClick={() => setActive('barge')} style={{ flex: 1, background: '#E0E7FF', border: `1px solid #818CF8`, color: '#3730A3', fontSize: '10px', fontWeight: 700, padding: '4px 0', borderRadius: '4px', cursor: 'pointer' }}>BARGE</button>
            <button onClick={() => setActive('ts')} style={{ flex: 1, background: '#F3F4F6', border: `1px solid ${BORDER}`, color: MUTED, fontSize: '10px', fontWeight: 700, padding: '4px 0', borderRadius: '4px', cursor: 'pointer' }}>TIMESHEET</button>
          </div>
          
          <div style={{ display: 'flex', gap: '5px', marginTop: 'auto' }}>
            <button onClick={() => setActive('stop')} style={{ flex: 1, background: '#FEE2E2', color: DANGER, border: `1px solid #FCA5A5`, fontSize: '10px', fontWeight: 600, padding: '5px 0', borderRadius: '4px', cursor: 'pointer' }}>STOP SEQ</button>
            <button onClick={() => setActive('start')} style={{ flex: 1, background: NAVY, color: 'white', border: 'none', fontSize: '10px', fontWeight: 700, padding: '5px 0', borderRadius: '4px', cursor: 'pointer' }}>START SEQ</button>
          </div>
        </div>
      </div>
    );
  };

  const ScreenTC = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <MhCard id="MHP0025" jetty="Jetty Futong - P1" barge="BG. Sentosa Jaya 2308" op="Amrojali" trucks={["RTP0285"]} />
        <MhCard id="MHP0026" jetty="Jetty Futong - P2" barge="BG. Glory Marine 7" op="Ricardo H." trucks={["RTP0200"]} />
        <MhCard id="MHP0027" jetty="Jetty Futong - P3" barge="BG. Glory Marine 3" op="—" trucks={[]} />
        <MhCard id="MHP0028" jetty="Jetty Futong - P5" barge="BG. Capricorn 119 / TB. Cap 118" op="—" trucks={["BDP0057"]} />
      </div>
    </motion.div>
  );

  const ScreenDowntime = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
      <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ background: NAVY, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <span onClick={() => setActive('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
             <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Log Downtime</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>MHP0026 — Jetty Futong P2</div></div>
          </div>
        </div>
        <div style={{ padding: '14px' }}>
          <div style={{ marginBottom: '13px' }}>
            <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>Unit (auto-filled)</div>
            <div style={{ background: GRAY, border: `1px solid ${BORDER}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>MHP0026 — Material Handler</div>
          </div>
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
          <div style={{ marginBottom: '13px' }}>
            <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>Start Time <span style={{ color: DANGER }}>*</span></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 2, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>13/03/2026</div>
              <div style={{ flex: 1, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>08:30</div>
            </div>
          </div>
          <button onClick={() => setActive('tc')} style={{ width: '100%', background: NAVY, color: 'white', border: 'none', borderRadius: '6px', padding: '12px 0', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>SAVE DOWNTIME</button>
        </div>
      </div>
    </motion.div>
  );

  const ScreenStart = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
      <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ background: NAVY, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span onClick={() => setActive('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
          <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Start New Sequence</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>MHP0026 — Jetty Futong P2</div></div>
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
            <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>Start Time <span style={{ color: DANGER }}>*</span></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 2, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>13/03/2026</div>
              <div style={{ flex: 1, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>08:30</div>
            </div>
          </div>
          <div style={{ marginBottom: '13px' }}>
            <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>HM Start — Hour Meter reading <span style={{ color: DANGER }}>*</span></div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1, background: 'white', border: `1.5px solid ${NAVY}`, borderRadius: '6px', padding: '9px 11px', fontSize: '16px', fontWeight: 700, color: NAVY }}>1,205</div>
              <span style={{ fontSize: '12px', color: MUTED }}>hours</span>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>FM Start — Fuel Meter reading <span style={{ color: DANGER }}>*</span></div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ flex: 1, background: 'white', border: `1.5px solid ${NAVY}`, borderRadius: '6px', padding: '9px 11px', fontSize: '16px', fontWeight: 700, color: NAVY }}>4,820</div>
              <span style={{ fontSize: '12px', color: MUTED }}>litres</span>
            </div>
          </div>
          <button onClick={() => setActive('tc')} style={{ width: '100%', background: NAVY, color: 'white', border: 'none', borderRadius: '6px', padding: '12px 0', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>START SEQUENCE</button>
        </div>
      </div>
    </motion.div>
  );

  const ScreenStop = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
      <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ background: NAVY, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span onClick={() => setActive('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
          <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Stop Sequence</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>MHP0026 — Sequence in progress</div></div>
        </div>
        <div style={{ padding: '14px' }}>
          <div style={{ background: '#ECFDF5', border: `1px solid ${SUCCESS}`, borderRadius: '6px', padding: '9px 11px', marginBottom: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontSize: '12px', color: '#065F46', fontWeight: 700 }}>&#9679; Active — Amrojali</div><div style={{ fontSize: '10px', color: '#047857', marginTop: '1px' }}>Started: 08:30 &nbsp;&#183;&nbsp; Running: 2h 15m</div></div>
          </div>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: '6px', overflow: 'hidden', marginBottom: '13px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', background: GRAY }}>
              <div style={{ padding: '7px 9px', fontSize: '10px', color: MUTED, fontWeight: 600 }}></div>
              <div style={{ padding: '7px 9px', fontSize: '10px', color: MUTED, fontWeight: 600, borderLeft: `1px solid ${BORDER}`, textAlign: 'center' }}>START (locked)</div>
              <div style={{ padding: '7px 9px', fontSize: '10px', color: MUTED, fontWeight: 600, borderLeft: `1px solid ${BORDER}`, textAlign: 'center' }}>FINISH</div>
            </div>
            {[["HM (hours)", "1,205", "1,217"], ["FM (litres)", "4,820", "4,965"]].map(([lbl, s, f], idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', borderTop: `1px solid ${BORDER}` }}>
                <div style={{ padding: '9px', fontSize: '11px', color: TEXT, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>{lbl}</div>
                <div style={{ padding: '9px', borderLeft: `1px solid ${BORDER}`, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: '14px', fontWeight: 600, color: MUTED }}>{s}</span></div>
                <div style={{ padding: '6px', borderLeft: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: 'white', border: `1.5px solid ${NAVY}`, borderRadius: '5px', padding: '6px 10px', fontSize: '14px', fontWeight: 700, color: NAVY, minWidth: '65px', textAlign: 'center' }}>{f}</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', borderTop: `1px solid ${BORDER}`, background: '#F0F9FF' }}>
              <div style={{ padding: '8px 9px', fontSize: '10px', color: '#0369A1', fontWeight: 600 }}>Delta</div>
              <div style={{ padding: '8px 9px', borderLeft: `1px solid ${BORDER}`, textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#0369A1' }}>&#916; HM = 12h</div>
              <div style={{ padding: '8px 9px', borderLeft: `1px solid ${BORDER}`, textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#0369A1' }}>&#916; FM = 145 L</div>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>Stop Time <span style={{ color: DANGER }}>*</span></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 2, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>13/03/2026</div>
              <div style={{ flex: 1, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>10:45</div>
            </div>
          </div>
          <button onClick={() => setActive('tc')} style={{ width: '100%', background: DANGER, color: 'white', border: 'none', borderRadius: '6px', padding: '12px 0', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>STOP SEQUENCE</button>
        </div>
      </div>
    </motion.div>
  );

  const ScreenTS = () => {
    const rows = [
      { op: "Amrojali", s: "08:30", e: "10:45", hms: 1205, hmf: 1217, fms: 4820, fmf: 4965 },
      { op: "Budi S.", s: "11:00", e: "13:30", hms: 1217, hmf: 1229, fms: 4965, fmf: 5112 },
      { op: "Amrojali", s: "14:00", e: "16:30", hms: 1229, hmf: 1241, fms: 5112, fmf: 5258 },
      { op: "Hendra W.", s: "17:00", e: "19:15", hms: 1241, hmf: 1253, fms: 5258, fmf: 5400 },
      { op: "Yusuf K.", s: "20:00", e: "22:45", hms: 1253, hmf: 1266, fms: 5400, fmf: 5560 },
      { op: "Ricardo H.", s: "23:00", e: "01:30", hms: 1266, hmf: 1278, fms: 5560, fmf: 5715 },
    ];
    
    // Calculate totals automatically based on rows
    const totalHm = rows.reduce((acc, r) => acc + (r.hmf - r.hms), 0);
    const totalFm = rows.reduce((acc, r) => acc + (r.fmf - r.fms), 0);

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ background: NAVY, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span onClick={() => setActive('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
            <div><div style={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>MH Timesheet — MHP0026</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>13 March 2026 &nbsp;&#183;&nbsp; 3 sequences</div></div>
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

  const ScreenBarge = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: GRAY, padding: '10px' }}>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', background: 'white', borderRadius: '8px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ background: NAVY, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span onClick={() => setActive('tc')} style={{ color: 'white', fontSize: '16px', cursor: 'pointer' }}>&#8592;</span>
            <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Attach Barge</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>MHP0026 — Jetty Futong P2</div></div>
          </div>
          <div style={{ padding: '14px' }}>
            <div style={{ background: '#f5f5f5', borderRadius: '6px', padding: '9px 11px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>&#128674;</span>
              <div><div style={{ fontSize: '12px', fontWeight: 600 }}>BG. Glory Marine 12 / TB. HB 9</div><div style={{ fontSize: '10px', color: MUTED }}>Jumbo</div></div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>Attach Time <span style={{ color: DANGER }}>*</span></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 2, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>13/03/2026</div>
                <div style={{ flex: 1, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>08:00</div>
              </div>
            </div>
            <button onClick={() => setActive('tc')} style={{ width: '100%', background: NAVY, color: 'white', border: 'none', borderRadius: '6px', padding: '11px 0', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>ATTACH BARGE</button>
          </div>
        </div>
        
        <div style={{ flex: '1 1 240px', background: 'white', borderRadius: '8px', border: `1px solid ${SUCCESS}`, overflow: 'hidden' }}>
          <div style={{ background: NAVY, padding: '10px 14px' }}>
            <div><div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Barge Status / Detach</div><div style={{ color: '#aac4ff', fontSize: '10px' }}>MHP0026 — barge already attached</div></div>
          </div>
          <div style={{ padding: '14px' }}>
            <div style={{ background: '#ECFDF5', border: `1px solid ${SUCCESS}`, borderRadius: '6px', padding: '9px 11px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#065F46', fontWeight: 700 }}>&#9679; ATTACHED since 08:00</div>
              <div style={{ fontSize: '11px', color: '#047857', marginTop: '2px' }}>BG. Capricorn 119 / TB. Capricorn 118</div>
              <div style={{ fontSize: '11px', color: '#047857' }}>Running duration: 2h 30m</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: MUTED, marginBottom: '4px' }}>Detach Time <span style={{ color: DANGER }}>*</span></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 2, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>13/03/2026</div>
                <div style={{ flex: 1, background: 'white', border: `1px solid ${NAVY}`, borderRadius: '6px', padding: '8px 11px', fontSize: '13px' }}>10:30</div>
              </div>
            </div>
            <button onClick={() => setActive('tc')} style={{ width: '100%', background: DANGER, color: 'white', border: 'none', borderRadius: '6px', padding: '11px 0', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>DETACH BARGE</button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#F0F2F7', padding: '12px', minHeight: '100%', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>

      {/* Page header */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1B2E6B' }}>Digifleet Mobile — DA Enhancement Mockups</div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>FLS BRD Addendum · Traffic Controller module</div>
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
        
         {/* Breadcrumb / Navigation helper */}
         {active !== 'tc' && (
           <button onClick={() => setActive('tc')} style={{ marginTop: '10px', background: '#F3F4F6', border: `1px solid ${BORDER}`, padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', fontWeight: 600, color: NAVY }}>
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
          {/* Hardware bezel details */}
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
                {active === 'tc' && <ScreenTC key="tc" />}
                {active === 'downtime' && <ScreenDowntime key="downtime" />}
                {active === 'start' && <ScreenStart key="start" />}
                {active === 'stop' && <ScreenStop key="stop" />}
                {active === 'ts' && <ScreenTS key="ts" />}
                {active === 'barge' && <ScreenBarge key="barge" />}
              </AnimatePresence>
            </div>

            <AndroidNav />
          </div>
        </div>
      </div>

    </div>
  )
}
