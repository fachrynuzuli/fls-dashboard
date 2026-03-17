import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   CONSTANTS & MOCK DATA
   ═══════════════════════════════════════════════════════════ */
const C = {
  navy: '#0F1D45', navyLt: '#1B2E6B', teal: '#0ABFDE', tealDk: '#0899B0',
  amber: '#F59E0B', amberBg: '#FEF3C7', danger: '#EF4444', dangerBg: '#FEE2E2',
  success: '#10B981', successBg: '#ECFDF5',
  bg: '#F0F2F7', border: '#E5E7EB', muted: '#6B7280', text: '#111827',
  card: '#FFFFFF', label: '#94A3B8',
};
const FONT = "'Outfit', sans-serif";
const MONO = "'JetBrains Mono', monospace";

const OPERATORS = ['Willyanto', 'Anggiat', 'Suharno', 'Ricardo', 'Faozi', 'Indahlen', 'Sahat', 'Arnol', 'Parningotan', 'Rivqi', 'Ikrar', 'Edon', 'Pusen', 'Juli'];
const BARGES = ['BG. Sentosa Jaya 2308', 'BG. Glory Marine 7', 'BG. Glory Marine 3', 'BG. Capricorn 119', 'BG. Capricorn 122', 'BG. Glory Marine 12'];
const MHPS = ['MHP0025', 'MHP0026', 'MHP0027', 'MHP0028', 'MHP0029', 'MHP0030', 'MHP0031', 'MHP0032'];
const DT_CATS = ['Daily Maintenance', 'Preventive Service', 'Urgent Repair', 'Breakdown'];
const WOOD_TYPES = ['ACDB', 'ACBO', 'ACWC', 'AMBO', 'AMDB', 'EUBO', 'EUDB', 'EUWC', 'GMDB', 'GMBO'];

const SK = 'fls_dashboard_state';
const now = (offsetMin = 0) => {
  const d = new Date();
  if (offsetMin) d.setMinutes(d.getMinutes() + offsetMin);
  const z = d.getTimezoneOffset() * 60 * 1000;
  return new Date(d - z).toISOString().slice(0, 16);
};
const fmtT = i => { if (!i) return '—'; const d = new Date(i); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const fmtD = i => { if (!i) return '—'; const d = new Date(i); return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`; };
const fmtDT = i => `${fmtD(i)} ${fmtT(i)}`;
const timeDelta = (a, b) => { if (!a || !b) return '—'; const ms = new Date(b) - new Date(a); const m = Math.floor(ms / 60000); if (m < 60) return `${m}m`; return `${Math.floor(m / 60)}h ${m % 60}m`; };

const getInit = () => ({
  units: [
    { id: 'P1', mhp: 'MHP0025', jetty: 'Jetty Futong - P1', barge: 'BG. Sentosa Jaya 2308', bargeAt: now(-60), mhpAt: now(-180), op: '—', status: 'idle', hm: 1205, fm: 4820, seq: null, load: null, dt: null, queue: [] },
    { id: 'P2', mhp: 'MHP0026', jetty: 'Jetty Futong - P2', barge: 'BG. Glory Marine 7', bargeAt: now(-10), mhpAt: now(-120), op: '—', status: 'idle', hm: 983, fm: 3210, seq: null, load: null, dt: null, queue: [] },
    { id: 'P3', mhp: 'MHP0027', jetty: 'Jetty Futong - P3', barge: 'BG. Glory Marine 3', bargeAt: now(-115), mhpAt: now(-140), op: '—', status: 'idle', hm: 1450, fm: 5680, seq: null, load: null, dt: null, queue: [] },
    { id: 'P4', mhp: 'MHP0028', jetty: 'Jetty Futong - P4', barge: 'BG. Capricorn 119', bargeAt: now(-45), mhpAt: now(-90), op: '—', status: 'idle', hm: 760, fm: 2890, seq: null, load: null, dt: null, queue: [] },
    { id: 'P5', mhp: null, jetty: 'Jetty Futong - P5', barge: null, bargeAt: null, mhpAt: null, op: '—', status: 'idle', hm: 540, fm: 1920, seq: null, load: null, dt: null, queue: [] },
  ],
  trucks: ['BDP0012', 'RTP0344', 'BDP0088', 'RTP0199', 'BDP0155', 'RTP0401', 'BDP0222', 'RTP0285', 'BDP0310', 'RTP0422'],
  ts: {},
});

function ldState() {
  try {
    const s = localStorage.getItem(SK);
    if (!s) return getInit();
    const j = JSON.parse(s);
    if (j.units && j.units[0] && j.units[0].lp) { localStorage.removeItem(SK); return getInit(); }
    return j;
  } catch { return getInit(); }
}
function svState(s) { localStorage.setItem(SK, JSON.stringify(s)); }

/* ═══════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════ */
const sBtn = (bg, color, extra = {}) => ({ background: bg, color, border: 'none', borderRadius: '5px', padding: '8px 0', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: FONT, letterSpacing: '0.02em', ...extra });
const sInput = (extra = {}) => ({ width: '100%', border: `1.5px solid ${C.navyLt}`, borderRadius: '6px', padding: '9px 11px', fontSize: '13px', fontWeight: 600, color: C.navy, fontFamily: MONO, background: 'white', boxSizing: 'border-box', ...extra });
const sLabel = { fontSize: '10px', color: C.muted, fontWeight: 600, marginBottom: '4px', fontFamily: FONT };
const sField = { marginBottom: '12px' };

/* ═══════════════════════════════════════════════════════════
   SCREEN METADATA
   ═══════════════════════════════════════════════════════════ */
const SCREENS = {
  tc: { l: 'TC Dashboard', i: 'Homepage showing all 5 Loading Points (P1–P5). Click a Loading Point card to Start/End Sequence. Use action buttons below each card for truck loading, downtime, and timesheet.' },
  startSeq: { l: 'Start Sequence', i: 'Pair an Operator with this Material Handler. Key-in Operator Name, Start Timestamp (retroactive OK), Hour Meter, and Fuel Meter to begin a Timesheet Sequence.' },
  endSeq: { l: 'End Sequence', i: 'Unpair the Operator from this MH. Key-in End Timestamp, Hour Meter Finish, and Fuel Meter Finish to close the Timesheet Sequence.' },
  startLoad: { l: 'Start Loading', i: 'Begin loading the next truck in queue. Key-in start timestamp (retroactive OK).' },
  finishLoad: { l: 'Finish Loading', i: 'Finish loading the active truck. Key-in stack, wood type, and finish timestamp. Truck departs queue.' },
  trucks: { l: 'Assign Truck', i: 'Pick an incoming truck from the global pool, then select which Loading Point (P1–P5) to assign it to.' },
  startDt: { l: 'Start Downtime', i: 'Log a downtime event. This automatically closes the current Timesheet Sequence (HM/FM from this form are used to close it). Status → Downtime.' },
  endDt: { l: 'End Downtime', i: 'Close the downtime event. Key-in end timestamp and meter readings. Status → Idle. You can then start a new Timesheet Sequence.' },
  ts: { l: 'Timesheet', i: 'Historical record of all completed Timesheet Sequences and their loading activities for this Loading Point.' },
  barge: { l: 'Barge Operations', i: 'Attach or detach a barge at this Loading Point. Must detach current barge before attaching a new one. Timestamps are retroactive.' },
  mhp: { l: 'MHP Operations', i: 'Attach or detach a Material Handler (MHP) at this Loading Point. Must detach current MHP before attaching a new one.' },
  seqDetails: { l: 'Loaded Trucks Menu', i: 'Tabulated view of all trucks loaded in the active sequence for this Loading Point.' },
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function MobileMockup() {
  const [state, setState] = useState(ldState);
  const [scr, setScr] = useState('tc');
  const [resetToast, setResetToast] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [aid, setAid] = useState(null); // active unit id
  const [pickTruck, setPickTruck] = useState(null); // truck awaiting LP assignment

  const doReset = () => {
    setShowResetModal(true);
  };

  const confirmDoReset = () => {
    const fresh = getInit();
    setState(fresh);
    localStorage.removeItem(SK);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
    setScr('tc');
    setShowResetModal(false);
  };

  useEffect(() => { svState(state); }, [state]);

  const { units, trucks, ts } = state;
  const gu = (id = aid) => units.find(u => u.id === id) || units[0];
  const si = SCREENS[scr] || SCREENS.tc;

  const nav = (s, id = null) => { if (id) setAid(id); setPickTruck(null); setScr(s); };
  const lpClick = u => { setAid(u.id); setScr(u.status === 'idle' ? 'startSeq' : u.status === 'running' ? 'endSeq' : 'endDt'); };

  /* ─── ACTIONS ─────────────────────────────── */
  const mut = (id, p) => setState(v => ({ ...v, units: v.units.map(u => u.id === id ? { ...u, ...p } : u) }));

  const doStartSeq = (id, op, t, hm, fm) => {
    mut(id, { status: 'running', op, seq: { op, startTime: t, hmStart: +hm, fmStart: +fm, loads: [] }, hm: +hm, fm: +fm, load: null });
    nav('tc');
  };
  const doEndSeq = (id, t, hm, fm) => {
    const u = gu(id); if (!u.seq) return;
    const entry = { ...u.seq, endTime: t, hmEnd: +hm, fmEnd: +fm };
    setState(v => ({
      ...v,
      units: v.units.map(uu => uu.id === id ? { ...uu, status: 'idle', op: '—', seq: null, load: null, hm: +hm, fm: +fm } : uu),
      ts: { ...v.ts, [id]: [...(v.ts[id] || []), entry] }
    }));
    nav('tc');
  };
  const doStartLoad = (id, t) => {
    const u = gu(id); if (!u.queue[0]) return;
    mut(id, { load: { truckId: u.queue[0], startTime: t } });
    nav('tc');
  };
  const doFinishLoad = (id, t, stack, woodType) => {
    const u = gu(id); if (!u.load) return;
    const le = { ...u.load, endTime: t, stack, woodType };
    setState(v => ({
      ...v,
      units: v.units.map(uu => {
        if (uu.id !== id) return uu;
        const ns = uu.seq ? { ...uu.seq, loads: [...uu.seq.loads, le] } : uu.seq;
        return { ...uu, load: null, queue: uu.queue.slice(1), seq: ns };
      })
    }));
    nav('tc');
  };
  const doAssign = (truck, targetId) => {
    setState(v => ({
      ...v,
      trucks: v.trucks.filter(t => t !== truck),
      units: v.units.map(u => u.id === targetId ? { ...u, queue: [...u.queue, truck] } : u)
    }));
    setPickTruck(null); nav('tc');
  };
  const doStartDt = (id, cat, t, hm, fm) => {
    const u = gu(id);
    // auto-end active sequence
    if (u.seq) {
      const entry = { ...u.seq, endTime: t, hmEnd: +hm, fmEnd: +fm };
      setState(v => ({
        ...v,
        units: v.units.map(uu => uu.id === id ? { ...uu, status: 'downtime', op: '—', seq: null, load: null, dt: { category: cat, startTime: t, hmStart: +hm, fmStart: +fm }, hm: +hm, fm: +fm } : uu),
        ts: { ...v.ts, [id]: [...(v.ts[id] || []), entry] }
      }));
    } else {
      mut(id, { status: 'downtime', dt: { category: cat, startTime: t, hmStart: +hm, fmStart: +fm }, hm: +hm, fm: +fm });
    }
    nav('tc');
  };
  const doEndDt = (id, t, hm, fm) => { mut(id, { status: 'idle', dt: null, hm: +hm, fm: +fm }); nav('tc'); };
  const doAttach = (id, b, t) => { const u = gu(id); if (u.barge) { alert('⚠️ Detach current barge first before attaching a new one.'); return; } mut(id, { barge: b, bargeAt: t }); nav('tc'); };
  const doDetach = (id, t) => { mut(id, { barge: null, bargeAt: null }); nav('tc'); };
  const doAttachMhp = (id, m, t, hm, fm) => { const u = gu(id); if (u.mhp) { alert('⚠️ Detach current MHP first before attaching a new one.'); return; } mut(id, { mhp: m, mhpAt: t, hm: +hm, fm: +fm }); nav('tc'); };
  const doDetachMhp = (id, t) => { mut(id, { mhp: null, mhpAt: null }); nav('tc'); };

  /* ─── SHARED UI ───────────────────────────── */
  const Pill = ({ s }) => {
    const m = { running: { bg: C.successBg, c: '#065F46', bc: C.success, t: '● RUNNING' }, downtime: { bg: C.amberBg, c: '#92400E', bc: C.amber, t: '● DOWNTIME' }, idle: { bg: '#F3F4F6', c: C.muted, bc: C.border, t: '○ IDLE' } };
    const v = m[s] || m.idle;
    return <span style={{ background: v.bg, color: v.c, border: `1px solid ${v.bc}`, padding: '2px 6px', borderRadius: '12px', fontSize: '8px', fontWeight: 700, fontFamily: FONT, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>{v.t}</span>;
  };

  const Hdr = () => (
    <div style={{ background: C.navy, padding: '7px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{ width: '28px', height: '28px', background: 'white', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
          <span style={{ fontSize: '5px', fontWeight: 900, color: C.navy, fontFamily: FONT }}>DIGI</span><span style={{ fontSize: '5px', fontWeight: 900, color: C.navy, fontFamily: FONT }}>fleet</span>
        </div>
        <div style={{ color: 'white', fontSize: '10px', fontWeight: 600, fontFamily: FONT }}>TC Dashboard</div>
      </div>
      <div style={{ textAlign: 'right', color: 'white' }}><div style={{ fontSize: '10px', fontWeight: 600, fontFamily: FONT }}>Jekson</div><div style={{ fontSize: '8px', opacity: 0.6, fontFamily: MONO }}>TC-20031492</div></div>
    </div>
  );

  const Nav = () => (
    <div style={{ background: '#111', padding: '4px 0', display: 'flex', justifyContent: 'center', gap: '52px' }}>
      <span style={{ color: '#555', fontSize: '12px', cursor: 'pointer' }} onClick={() => nav('tc')}>|||</span>
      <span style={{ color: '#555', fontSize: '14px', cursor: 'pointer' }} onClick={() => nav('tc')}>○</span>
      <span style={{ color: '#555', fontSize: '12px', cursor: 'pointer' }} onClick={() => nav('tc')}>‹</span>
    </div>
  );

  const Back = ({ label }) => <span onClick={() => nav('tc')} style={{ color: 'white', fontSize: '14px', cursor: 'pointer', marginRight: '6px' }}>←</span>;
  const FormHdr = ({ title, sub }) => (
    <div style={{ background: C.navy, padding: '9px 12px', display: 'flex', alignItems: 'center' }}>
      <Back /><div><div style={{ color: 'white', fontWeight: 700, fontSize: '13px', fontFamily: FONT }}>{title}</div>{sub && <div style={{ color: '#7B93DB', fontSize: '9px', fontFamily: FONT }}>{sub}</div>}</div>
    </div>
  );

  /* ─── MH CARD ─────────────────────────────── */
  const MhCard = ({ u }) => {
    const hasLoad = !!u.load;
    const canLoad = u.status === 'running' && u.queue.length > 0 && !hasLoad;
    return (
      <div style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${C.border}`, flex: '0 0 190px', minWidth: '190px', display: 'flex', flexDirection: 'column', background: C.card, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontFamily: FONT }}>
        {/* Barge header */}
        <div onClick={() => nav('barge', u.id)} style={{ background: '#F8FAFC', padding: '6px 8px', textAlign: 'center', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'} onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}>
          <div style={{ fontSize: '14px' }}>🚢</div>
          <div style={{ fontSize: '9px', color: C.navyLt, fontWeight: 700, marginTop: '1px' }}>{u.barge || 'No barge attached'}</div>
          <div style={{ fontSize: '7px', color: C.label }}>tap to manage barge</div>
        </div>
        {/* LP body — clickable */}
        <div onClick={() => lpClick(u)} style={{ padding: '8px 9px', cursor: 'pointer', flex: 1, borderBottom: `1px solid ${C.border}`, transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#FAFBFF'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div onClick={(e) => { e.stopPropagation(); nav('mhp', u.id) }} style={{ display: 'flex', alignItems: 'baseline', gap: '4px', cursor: 'pointer', background: '#F8FAFC', padding: '2px 4px', margin: '-2px -4px', borderRadius: '4px', border: `1px dashed ${C.border}` }} onMouseEnter={e => e.currentTarget.style.background = '#EEF2FF'} onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'} title="Tap to manage MHP">
              <span style={{ fontWeight: 900, fontSize: '16px', color: C.navyLt, fontFamily: MONO }}>{u.id}</span>
              <span style={{ fontWeight: 600, fontSize: '10px', color: C.muted }}>{u.mhp || 'No MHP'}</span>
              <span style={{ fontSize: '8px', color: C.teal, marginLeft: '2px' }}>✎</span>
            </div>
            <Pill s={u.status} />
          </div>
          <div style={{ fontSize: '9px', color: C.muted, marginBottom: '1px' }}>↗ {u.jetty}</div>
          <div style={{ fontSize: '9px', color: C.muted }}>👤 <strong style={{ color: C.text }}>{u.op}</strong></div>
          {hasLoad && <div style={{ marginTop: '4px', fontSize: '8px', padding: '3px 6px', background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '4px', color: '#065F46', fontWeight: 700 }}>⏳ Loading: {u.load.truckId} ({fmtT(u.load.startTime)})</div>}
          <div style={{ fontSize: '7px', color: C.label, marginTop: '4px', fontStyle: 'italic' }}>tap to {u.status === 'idle' ? 'start sequence' : u.status === 'running' ? 'end sequence' : 'end downtime'}</div>
        </div>
        {/* Truck queue */}
        <div style={{ background: '#F8FAFC', padding: '6px 8px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: '8px', fontWeight: 700, color: C.muted, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>TRUCK QUEUE ({u.queue.length})</span>
            <span onClick={e => { e.stopPropagation(); nav('trucks', u.id) }} style={{ color: C.teal, cursor: 'pointer', fontWeight: 700 }}>+ Assign</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', minHeight: '18px' }}>
            {u.queue.length === 0 ? <span style={{ fontSize: '8px', color: '#9CA3AF', fontStyle: 'italic' }}>Empty</span> :
              u.queue.map((t, i) => {
                const active = i === 0 && hasLoad;
                return <div key={i} style={{ background: active ? C.success : 'white', color: active ? 'white' : C.text, border: `1px solid ${active ? C.success : C.border}`, borderRadius: '3px', padding: '1px 4px', fontSize: '8px', fontWeight: 600, fontFamily: MONO }}>🚛{t}</div>;
              })}
          </div>
          {/* Loaded trucks in current sequence */}
          {u.seq && u.seq.loads && u.seq.loads.length > 0 && (
            <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: `1px dashed ${C.border}` }}>
              <div style={{ fontSize: '8px', fontWeight: 700, color: C.muted, marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>LOADED TRUCKS ({u.seq.loads.length})</span>
                <span onClick={e => { e.stopPropagation(); nav('seqDetails', u.id) }} style={{ background: '#EEF2FF', color: C.navyLt, padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>Table View →</span>
              </div>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', maxHeight: '40px', overflowY: 'auto' }}>
                {u.seq.loads.map((l, i) => (
                  <div key={i} style={{ background: C.successBg, color: C.success, border: `1px solid ${C.success}`, borderRadius: '3px', padding: '1px 4px', fontSize: '8px', fontWeight: 600, fontFamily: MONO }} title={`Stack: ${l.stack}, Wood: ${l.woodType}`}>✓ {l.truckId}</div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Action buttons */}
        <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {u.status === 'running' && !hasLoad && (
            <button onClick={e => { e.stopPropagation(); nav('startLoad', u.id) }} disabled={u.queue.length === 0} style={sBtn(C.navyLt, 'white', { opacity: u.queue.length === 0 ? 0.4 : 1 })}>{u.queue.length === 0 ? 'NO TRUCKS' : '▶ START LOADING'}</button>
          )}
          {u.status === 'running' && hasLoad && (
            <button onClick={e => { e.stopPropagation(); nav('finishLoad', u.id) }} style={sBtn(C.danger, 'white')}>■ FINISH LOADING</button>
          )}
          {u.status === 'downtime' && (
            <button onClick={e => { e.stopPropagation(); lpClick(u) }} style={sBtn(C.amber, 'white')}>END DOWNTIME</button>
          )}
          <div style={{ display: 'flex', gap: '4px' }}>
            {u.status === 'running' && <button onClick={e => { e.stopPropagation(); nav('startDt', u.id) }} style={sBtn('white', C.muted, { border: `1px solid ${C.border}`, flex: 1, padding: '5px 0', fontSize: '8px' })}>DOWNTIME</button>}
            <button onClick={e => { e.stopPropagation(); nav('ts', u.id) }} style={sBtn('white', C.muted, { border: `1px solid ${C.border}`, flex: 1, padding: '5px 0', fontSize: '8px' })}>TIMESHEET</button>
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════  SCREENS  ═══════════════════════════ */

  const ScreenTC = () => {
    const running = units.filter(u => u.status === 'running').length;
    const barges = units.filter(u => u.barge).length;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'hidden', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
        {/* Summary bar */}
        <div style={{ background: 'white', borderBottom: `1px solid ${C.border}`, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            {[['Active', `${running}/${units.length}`], ['Barges', barges], ['Est. Rate', '1,250 T/hr']].map(([k, v]) => (
              <div key={k}><div style={{ fontSize: '8px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div><div style={{ fontSize: '13px', fontWeight: 800, color: C.navyLt, fontFamily: MONO }}>{v}</div></div>
            ))}
          </div>
          <button onClick={() => nav('trucks')} style={{ background: C.teal, color: 'white', border: 'none', padding: '6px 10px', borderRadius: '5px', fontSize: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT, boxShadow: '0 2px 6px rgba(10,191,222,0.25)' }}>
            INCOMING TRUCKS ({trucks.length})
          </button>
        </div>
        {/* Cards row */}
        <div style={{ padding: '10px', display: 'flex', gap: '10px', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', flex: 1, alignItems: 'flex-start' }}>
          {units.map(u => <MhCard key={u.id} u={u} />)}
        </div>
      </motion.div>
    );
  };

  const ScreenStartSeq = () => {
    const u = gu(); const [op, setOp] = useState(OPERATORS[0]); const [t, setT] = useState(now()); const [hm, setHm] = useState(u.hm); const [fm, setFm] = useState(u.fm);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Start Sequence" sub={`${u.mhp || 'No MHP'} · ${u.id} — Pair Operator & MH`} />
          <div style={{ padding: '12px' }}>
            <div style={sField}><div style={sLabel}>Operator *</div><select value={op} onChange={e => setOp(e.target.value)} style={sInput()}>{OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
            <div style={sField}><div style={sLabel}>Start Timestamp *</div><input type="datetime-local" value={t} onChange={e => setT(e.target.value)} style={sInput()} /></div>
            <div style={{ display: 'flex', gap: '8px', ...sField }}>
              <div style={{ flex: 1 }}><div style={sLabel}>HM Start (hours) *</div><input type="number" value={hm} onChange={e => setHm(e.target.value)} style={sInput()} /></div>
              <div style={{ flex: 1 }}><div style={sLabel}>FM Start (litres) *</div><input type="number" value={fm} onChange={e => setFm(e.target.value)} style={sInput()} /></div>
            </div>
            <button onClick={() => doStartSeq(u.id, op, t, hm, fm)} style={sBtn(C.success, 'white', { fontSize: '13px', padding: '11px 0' })}>START SEQUENCE</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenEndSeq = () => {
    const u = gu(); const [t, setT] = useState(now()); const [hm, setHm] = useState(u.hm); const [fm, setFm] = useState(u.fm);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="End Sequence" sub={`${u.mhp || 'No MHP'} · ${u.id} — Unpair ${u.op}`} />
          <div style={{ padding: '12px' }}>
            {u.seq && <div style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '6px', padding: '8px 10px', marginBottom: '12px', fontSize: '10px', color: '#065F46' }}>
              <strong>Active since {fmtDT(u.seq.startTime)}</strong><br />Operator: {u.seq.op} · HM: {u.seq.hmStart} · FM: {u.seq.fmStart}<br />Loads completed: {u.seq.loads.length}
            </div>}
            <div style={sField}><div style={sLabel}>End Timestamp *</div><input type="datetime-local" value={t} onChange={e => setT(e.target.value)} style={sInput()} /></div>
            <div style={{ display: 'flex', gap: '8px', ...sField }}>
              <div style={{ flex: 1 }}><div style={sLabel}>HM Finish *</div><input type="number" value={hm} onChange={e => setHm(e.target.value)} style={sInput()} /></div>
              <div style={{ flex: 1 }}><div style={sLabel}>FM Finish *</div><input type="number" value={fm} onChange={e => setFm(e.target.value)} style={sInput()} /></div>
            </div>
            <button onClick={() => doEndSeq(u.id, t, hm, fm)} style={sBtn(C.danger, 'white', { fontSize: '13px', padding: '11px 0' })}>END SEQUENCE & UNPAIR</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenStartLoad = () => {
    const u = gu(); const truck = u.queue[0] || '—'; const [t, setT] = useState(now());
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Start Loading" sub={`${u.mhp || 'No MHP'} · ${u.id} — Truck ${truck}`} />
          <div style={{ padding: '12px' }}>
            <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🚛</span>
              <div><div style={{ fontSize: '14px', fontWeight: 700, color: C.navyLt, fontFamily: MONO }}>{truck}</div><div style={{ fontSize: '9px', color: C.muted }}>Next in queue · Position 1 of {u.queue.length}</div></div>
            </div>
            <div style={sField}><div style={sLabel}>Start Timestamp *</div><input type="datetime-local" value={t} onChange={e => setT(e.target.value)} style={sInput()} /></div>
            <button onClick={() => doStartLoad(u.id, t)} style={sBtn(C.success, 'white', { fontSize: '13px', padding: '11px 0' })}>▶ START LOADING: {truck}</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenFinishLoad = () => {
    const u = gu(); const ld = u.load; const [t, setT] = useState(now()); const [stack, setStack] = useState(''); const [woodType, setWoodType] = useState('');
    if (!ld) return <motion.div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: C.muted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No active loading.</motion.div>;
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Finish Loading" sub={`${u.mhp || 'No MHP'} · ${u.id} — Truck ${ld.truckId}`} />
          <div style={{ padding: '12px' }}>
            <div style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '6px', padding: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#065F46', fontWeight: 700 }}>⏳ Loading in progress</div>
              <div style={{ fontSize: '10px', color: '#047857', marginTop: '2px' }}>Truck: <strong>{ld.truckId}</strong> · Started: {fmtT(ld.startTime)} · Duration: {timeDelta(ld.startTime, now())}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', ...sField }}>
              <div style={{ flex: 1 }}><div style={sLabel}>Stack *</div><input type="number" min="0" value={stack} onChange={e => setStack(e.target.value)} placeholder="ex: 8" style={sInput()} /></div>
              <div style={{ flex: 1 }}>
                <div style={sLabel}>Wood Type *</div>
                <input list="wood-types" value={woodType} onChange={e => setWoodType(e.target.value)} placeholder="Search..." style={sInput()} />
                <datalist id="wood-types">
                  {WOOD_TYPES.map(w => <option key={w} value={w} />)}
                </datalist>
              </div>
            </div>
            <div style={sField}><div style={sLabel}>Finish Timestamp *</div><input type="datetime-local" value={t} onChange={e => setT(e.target.value)} style={sInput()} /></div>
            <button disabled={!stack || !woodType} onClick={() => doFinishLoad(u.id, t, stack, woodType)} style={sBtn(C.danger, 'white', { fontSize: '13px', padding: '11px 0', opacity: (!stack || !woodType) ? 0.5 : 1 })}>■ FINISH LOADING: {ld.truckId}</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenTrucks = () => {
    if (pickTruck) {
      // Step 2: Pick LP
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
          <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
            <FormHdr title="Select Loading Point" sub={`Assigning truck ${pickTruck}`} />
            <div style={{ padding: '12px' }}>
              <p style={{ fontSize: '10px', color: C.muted, marginBottom: '10px' }}>Choose which Loading Point to assign <strong>{pickTruck}</strong> to:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {units.map(u => (
                  <button key={u.id} onClick={() => doAssign(pickTruck, u.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: '6px', background: 'white', cursor: 'pointer', fontFamily: FONT, fontSize: '12px', textAlign: 'left' }}>
                    <div><strong style={{ color: C.navyLt, fontFamily: MONO }}>{u.id}</strong> <span style={{ color: C.muted }}>· {u.mhp || 'No MHP'}</span></div>
                    <div style={{ fontSize: '9px', color: C.muted }}>Queue: {u.queue.length} · <Pill s={u.status} /></div>
                  </button>
                ))}
              </div>
              <button onClick={() => setPickTruck(null)} style={{ ...sBtn('#F3F4F6', C.muted, { border: `1px solid ${C.border}`, marginTop: '10px' }) }}>← Back to truck list</button>
            </div>
          </div>
        </motion.div>
      );
    }
    // Step 1: Pick truck
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Incoming Trucks" sub={`${trucks.length} trucks en route to port`} />
          <div style={{ padding: '12px' }}>
            {trucks.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: C.muted, background: '#F8FAFC', borderRadius: '6px' }}>No incoming trucks.</div> :
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {trucks.map(t => (
                  <div key={t} onClick={() => setPickTruck(t)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: '6px', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#F0FDFA'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ fontSize: '16px' }}>🚛</span><span style={{ fontSize: '13px', fontWeight: 700, color: C.navyLt, fontFamily: MONO }}>{t}</span></div>
                    <span style={{ fontSize: '9px', color: C.teal, fontWeight: 700 }}>ASSIGN →</span>
                  </div>
                ))}
              </div>}
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenStartDt = () => {
    const u = gu(); const [cat, setCat] = useState(DT_CATS[0]); const [t, setT] = useState(now()); const [hm, setHm] = useState(u.hm); const [fm, setFm] = useState(u.fm);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Start Downtime" sub={`${u.mhp || 'No MHP'} · ${u.id} — Will auto-end current sequence`} />
          <div style={{ padding: '12px' }}>
            {u.seq && <div style={{ background: C.amberBg, border: `1px solid ${C.amber}`, borderRadius: '6px', padding: '8px', marginBottom: '10px', fontSize: '9px', color: '#92400E' }}>
              <strong>⚠️ Warning:</strong> This will automatically end the current Timesheet Sequence for <strong>{u.seq.op}</strong> using the HM/FM values below.
            </div>}
            <div style={sField}><div style={sLabel}>Category *</div>
              {DT_CATS.map((c, i) => (
                <label key={c} onClick={() => setCat(c)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '5px', border: `1px solid ${cat === c ? C.navyLt : C.border}`, background: cat === c ? '#EFF3FF' : 'white', marginBottom: '4px', cursor: 'pointer', fontSize: '11px', color: cat === c ? C.navyLt : C.text, fontWeight: cat === c ? 600 : 400 }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${cat === c ? C.navyLt : '#d1d5db'}`, background: cat === c ? C.navyLt : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{cat === c && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />}</div>
                  {c}
                </label>
              ))}
            </div>
            <div style={sField}><div style={sLabel}>Start Timestamp *</div><input type="datetime-local" value={t} onChange={e => setT(e.target.value)} style={sInput()} /></div>
            <div style={{ display: 'flex', gap: '8px', ...sField }}>
              <div style={{ flex: 1 }}><div style={sLabel}>HM *</div><input type="number" value={hm} onChange={e => setHm(e.target.value)} style={sInput()} /></div>
              <div style={{ flex: 1 }}><div style={sLabel}>FM *</div><input type="number" value={fm} onChange={e => setFm(e.target.value)} style={sInput()} /></div>
            </div>
            <button onClick={() => doStartDt(u.id, cat, t, hm, fm)} style={sBtn(C.amber, 'white', { fontSize: '13px', padding: '11px 0' })}>LOG DOWNTIME</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenEndDt = () => {
    const u = gu(); const [t, setT] = useState(now()); const [hm, setHm] = useState(u.hm); const [fm, setFm] = useState(u.fm);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="End Downtime" sub={`${u.mhp || 'No MHP'} · ${u.id}`} />
          <div style={{ padding: '12px' }}>
            {u.dt && <div style={{ background: C.amberBg, border: `1px solid ${C.amber}`, borderRadius: '6px', padding: '8px', marginBottom: '10px', fontSize: '10px', color: '#92400E' }}>
              <strong>● DOWNTIME</strong> — {u.dt.category}<br />Started: {fmtDT(u.dt.startTime)} · HM: {u.dt.hmStart} · FM: {u.dt.fmStart}
            </div>}
            <div style={sField}><div style={sLabel}>End Timestamp *</div><input type="datetime-local" value={t} onChange={e => setT(e.target.value)} style={sInput()} /></div>
            <div style={{ display: 'flex', gap: '8px', ...sField }}>
              <div style={{ flex: 1 }}><div style={sLabel}>HM Finish *</div><input type="number" value={hm} onChange={e => setHm(e.target.value)} style={sInput()} /></div>
              <div style={{ flex: 1 }}><div style={sLabel}>FM Finish *</div><input type="number" value={fm} onChange={e => setFm(e.target.value)} style={sInput()} /></div>
            </div>
            <button onClick={() => doEndDt(u.id, t, hm, fm)} style={sBtn(C.success, 'white', { fontSize: '13px', padding: '11px 0' })}>END DOWNTIME</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenTS = () => {
    const u = gu(); const entries = ts[u.id] || [];
    const [dateFilter, setDateFilter] = useState('');
    const [exp, setExp] = useState({});
    const filtered = dateFilter ? entries.filter(e => e.startTime && e.startTime.startsWith(dateFilter)) : entries;
    const totalHm = filtered.reduce((a, e) => a + (e.hmEnd - e.hmStart), 0);
    const totalFm = filtered.reduce((a, e) => a + (e.fmEnd - e.fmStart), 0);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <FormHdr title={`Timesheet — ${u.mhp || 'No MHP'}`} sub={`${u.id} · ${filtered.length} sequences`} />
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={sLabel}>Date Filter:</div>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ ...sInput({ width: 'auto', padding: '4px 8px', fontSize: '11px' }) }} />
            {dateFilter && <button onClick={() => setDateFilter('')} style={{ background: 'none', border: 'none', color: C.teal, fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}>Clear</button>}
          </div>
          <div style={{ overflowX: 'auto' }}>
            {filtered.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: C.muted }}>No sequences recorded{dateFilter ? ' for this date' : ''}.</div> :
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'left', fontFamily: FONT }}>
                <thead><tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                  <th style={{ padding: '6px 8px' }}>Operator</th><th style={{ padding: '6px 8px' }}>Start</th><th style={{ padding: '6px 8px' }}>End</th>
                  <th style={{ padding: '6px 8px' }}>HM▵</th><th style={{ padding: '6px 8px' }}>FM▵</th><th style={{ padding: '6px 8px' }}>Loads</th>
                </tr></thead>
                <tbody>{filtered.map((e, i) => (
                  <React.Fragment key={i}>
                    <tr onClick={() => setExp(x => ({ ...x, [i]: !x[i] }))} style={{ cursor: 'pointer', borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                      <td style={{ padding: '6px 8px', fontWeight: 600, color: C.navyLt }}>{e.op} <span style={{ fontSize: '8px', marginLeft: '4px' }}>{e.loads.length > 0 && (exp[i] ? '▼' : '▶')}</span></td>
                      <td style={{ padding: '6px 8px', fontFamily: MONO, fontSize: '9px' }}>{fmtT(e.startTime)}</td>
                      <td style={{ padding: '6px 8px', fontFamily: MONO, fontSize: '9px' }}>{fmtT(e.endTime)}</td>
                      <td style={{ padding: '6px 8px', fontWeight: 700, color: C.tealDk, fontFamily: MONO }}>{e.hmEnd - e.hmStart}h</td>
                      <td style={{ padding: '6px 8px', fontWeight: 700, color: C.tealDk, fontFamily: MONO }}>{e.fmEnd - e.fmStart}L</td>
                      <td style={{ padding: '6px 8px', fontWeight: 700, color: C.teal }}>{e.loads.length} trucks</td>
                    </tr>
                    {exp[i] && e.loads.length > 0 && (
                      <tr style={{ background: '#EEF2FF', borderBottom: `1px solid ${C.border}` }}>
                        <td colSpan="6" style={{ padding: '8px 12px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', textAlign: 'left', fontFamily: FONT, background: 'white', border: `1px solid ${C.border}`, borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <thead>
                              <tr style={{ background: '#FAFAFA', borderBottom: `1px solid ${C.border}` }}>
                                <th style={{ padding: '6px 8px', color: C.muted }}>#</th>
                                <th style={{ padding: '6px 8px', color: C.muted }}>Truck</th>
                                <th style={{ padding: '6px 8px', color: C.muted }}>Start</th>
                                <th style={{ padding: '6px 8px', color: C.muted }}>End</th>
                                <th style={{ padding: '6px 8px', color: C.muted }}>Dur</th>
                                <th style={{ padding: '6px 8px', color: C.muted }}>Stack</th>
                                <th style={{ padding: '6px 8px', color: C.muted }}>Wood</th>
                              </tr>
                            </thead>
                            <tbody>
                              {e.loads.map((l, li) => (
                                <tr key={li} style={{ borderBottom: li === e.loads.length - 1 ? 'none' : `1px solid ${C.border}` }}>
                                  <td style={{ padding: '6px 8px', color: C.muted }}>{li + 1}</td>
                                  <td style={{ padding: '6px 8px', fontWeight: 700, fontFamily: MONO }}>{l.truckId}</td>
                                  <td style={{ padding: '6px 8px', fontFamily: MONO, color: C.muted }}>{fmtT(l.startTime)}</td>
                                  <td style={{ padding: '6px 8px', fontFamily: MONO, color: C.muted }}>{fmtT(l.endTime)}</td>
                                  <td style={{ padding: '6px 8px', fontFamily: MONO, color: C.tealDk, fontWeight: 700 }}>{timeDelta(l.startTime, l.endTime)}</td>
                                  <td style={{ padding: '6px 8px', fontWeight: 700 }}>{l.stack}</td>
                                  <td style={{ padding: '6px 8px' }}>{l.woodType}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}</tbody>
                <tfoot><tr style={{ background: '#F0F9FF', borderTop: `2px solid #BAE6FD` }}>
                  <td colSpan="3" style={{ padding: '6px 8px', fontWeight: 700, color: '#0369A1', fontSize: '11px' }}>TOTALS</td>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0369A1', fontFamily: MONO }}>{totalHm}h</td>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0369A1', fontFamily: MONO }}>{totalFm}L</td>
                  <td></td>
                </tr></tfoot>
              </table>}
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenBarge = () => {
    const u = gu(); const [selBarge, setSelBarge] = useState(BARGES[0]); const [t, setT] = useState(now()); const [dt, setDt] = useState(now());
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }}>
          {/* Current Status */}
          {u.barge ? (
            <div style={{ flex: '1 1 260px', background: 'white', borderRadius: '8px', border: `1px solid ${C.success}`, overflow: 'hidden' }}>
              <FormHdr title="Current Barge" sub={`${u.mhp || 'No MHP'} · ${u.id}`} />
              <div style={{ padding: '12px' }}>
                <div style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '6px', padding: '8px 10px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#065F46', fontWeight: 700 }}>● ATTACHED</div>
                  <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600, marginTop: '2px' }}>{u.barge}</div>
                  <div style={{ fontSize: '9px', color: '#047857' }}>Since: {fmtDT(u.bargeAt)}</div>
                </div>
                <div style={sField}><div style={sLabel}>Detach Timestamp *</div><input type="datetime-local" value={dt} onChange={e => setDt(e.target.value)} style={sInput()} /></div>
                <button onClick={() => doDetach(u.id, dt)} style={sBtn(C.danger, 'white', { fontSize: '12px', padding: '10px 0' })}>DETACH BARGE</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: '1 1 260px', background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <FormHdr title="Attach Barge" sub={`${u.id} — No barge attached`} />
              <div style={{ padding: '12px' }}>
                <div style={sField}><div style={sLabel}>Select Barge *</div><select value={selBarge} onChange={e => setSelBarge(e.target.value)} style={sInput()}>{BARGES.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
                <div style={sField}><div style={sLabel}>Attach Timestamp *</div><input type="datetime-local" value={t} onChange={e => setT(e.target.value)} style={sInput()} /></div>
                <button onClick={() => doAttach(u.id, selBarge, t)} style={sBtn(C.navyLt, 'white', { fontSize: '12px', padding: '10px 0' })}>ATTACH BARGE</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const ScreenMhp = () => {
    const u = gu(); const [selMhp, setSelMhp] = useState(MHPS[0]); const [t, setT] = useState(now()); const [dt, setDt] = useState(now());
    const [hm, setHm] = useState(u.hm || 0); const [fm, setFm] = useState(u.fm || 0);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }}>
          {/* Current Status */}
          {u.mhp ? (
            <div style={{ flex: '1 1 260px', background: 'white', borderRadius: '8px', border: `1px solid ${C.success}`, overflow: 'hidden' }}>
              <FormHdr title="Current MHP" sub={`${u.id} — Material Handler`} />
              <div style={{ padding: '12px' }}>
                <div style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '6px', padding: '8px 10px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#065F46', fontWeight: 700 }}>● ATTACHED</div>
                  <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600, marginTop: '2px' }}>{u.mhp}</div>
                  <div style={{ fontSize: '9px', color: '#047857' }}>Since: {fmtDT(u.mhpAt)}</div>
                </div>
                <div style={sField}><div style={sLabel}>Detach Timestamp *</div><input type="datetime-local" value={dt} onChange={e => setDt(e.target.value)} style={sInput()} /></div>
                <button onClick={() => doDetachMhp(u.id, dt)} style={sBtn(C.danger, 'white', { fontSize: '12px', padding: '10px 0' })}>DETACH MHP</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: '1 1 260px', background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <FormHdr title="Attach MHP" sub={`${u.id} — No MHP attached`} />
              <div style={{ padding: '12px' }}>
                <div style={sField}><div style={sLabel}>Select MHP *</div><select value={selMhp} onChange={e => setSelMhp(e.target.value)} style={sInput()}>{MHPS.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div style={sField}><div style={sLabel}>Attach Timestamp *</div><input type="datetime-local" value={t} onChange={e => setT(e.target.value)} style={sInput()} /></div>
                <div style={{ display: 'flex', gap: '8px', ...sField }}>
                  <div style={{ flex: 1 }}><div style={sLabel}>HM Start *</div><input type="number" value={hm} onChange={e => setHm(e.target.value)} style={sInput()} /></div>
                  <div style={{ flex: 1 }}><div style={sLabel}>FM Start *</div><input type="number" value={fm} onChange={e => setFm(e.target.value)} style={sInput()} /></div>
                </div>
                <button onClick={() => doAttachMhp(u.id, selMhp, t, hm, fm)} style={sBtn(C.navyLt, 'white', { fontSize: '12px', padding: '10px 0' })}>ATTACH MHP</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const ScreenSeqDetails = () => {
    const u = gu(); const seq = u.seq;
    if (!seq) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: C.muted }}>No active sequence.</motion.div>;
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '600px', margin: '0 auto' }}>
          <FormHdr title="Loaded Trucks" sub={`${u.mhp || 'No MHP'} · ${u.id}`} />
          <div style={{ padding: '12px' }}>
            <div style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '6px', padding: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#065F46', fontWeight: 700 }}>Active Sequence: {u.op}</div>
              <div style={{ fontSize: '10px', color: '#047857', marginTop: '4px' }}>Started: {fmtT(seq.startTime)} · Total Trucks: {seq.loads.length}</div>
            </div>
            {seq.loads.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: C.muted }}>No trucks loaded yet.</div> : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'left', fontFamily: FONT }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                      <th style={{ padding: '6px 8px', color: C.muted }}>#</th>
                      <th style={{ padding: '6px 8px', color: C.muted }}>Truck</th>
                      <th style={{ padding: '6px 8px', color: C.muted }}>Start</th>
                      <th style={{ padding: '6px 8px', color: C.muted }}>End</th>
                      <th style={{ padding: '6px 8px', color: C.muted }}>Dur</th>
                      <th style={{ padding: '6px 8px', color: C.muted }}>Stack</th>
                      <th style={{ padding: '6px 8px', color: C.muted }}>Wood</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seq.loads.map((l, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                        <td style={{ padding: '6px 8px', color: C.muted }}>{i + 1}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700, color: C.navyLt, fontFamily: MONO }}>{l.truckId}</td>
                        <td style={{ padding: '6px 8px', fontFamily: MONO, fontSize: '9px' }}>{fmtT(l.startTime)}</td>
                        <td style={{ padding: '6px 8px', fontFamily: MONO, fontSize: '9px' }}>{fmtT(l.endTime)}</td>
                        <td style={{ padding: '6px 8px', fontFamily: MONO, fontWeight: 700, color: C.tealDk }}>{timeDelta(l.startTime, l.endTime)}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700 }}>{l.stack}</td>
                        <td style={{ padding: '6px 8px' }}>{l.woodType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  /* ═══════════════════════════  MAIN RENDER  ═══════════════════════════ */
  const screenMap = { tc: ScreenTC, startSeq: ScreenStartSeq, endSeq: ScreenEndSeq, startLoad: ScreenStartLoad, finishLoad: ScreenFinishLoad, trucks: ScreenTrucks, startDt: ScreenStartDt, endDt: ScreenEndDt, ts: ScreenTS, barge: ScreenBarge, mhp: ScreenMhp, seqDetails: ScreenSeqDetails };
  const ActiveScreen = screenMap[scr] || ScreenTC;

  return (
    <div style={{ fontFamily: FONT, background: C.bg, padding: '12px', minHeight: '100%', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
      {/* Page header */}
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: C.navyLt, fontFamily: FONT }}>Digifleet Mobile — TC Dashboard Prototype</div>
          <div style={{ fontSize: '10px', color: C.muted }}>PRD v2 · Barge → MH → Truck Flow · localStorage Simulation</div>
        </div>
        <button onClick={doReset} style={{ background: '#FEE2E2', color: C.danger, border: `1px solid #FCA5A5`, padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>♻ RESET DEMO</button>
      </div>

      {/* External Info Bar */}
      <div style={{ background: 'white', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: C.navyLt, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: FONT }}>{si.l}</div>
        <div style={{ fontSize: '12px', color: C.text, lineHeight: 1.5 }}>{si.i}</div>
        {scr !== 'tc' && <button onClick={() => nav('tc')} style={{ marginTop: '8px', background: '#F3F4F6', border: `1px solid ${C.border}`, padding: '3px 10px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600, color: C.navyLt, fontFamily: FONT }}>← Back to TC Dashboard</button>}
      </div>

      {/* Device frame */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 0', background: '#e8ecf4', borderRadius: '12px', flex: 1 }}>
        <div style={{ background: '#1a1a1a', borderRadius: '28px', padding: '10px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', width: '840px', height: '520px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '6px', transform: 'translateY(-50%)', width: '3px', height: '36px', background: '#333', borderRadius: '2px' }} />
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', border: '2px solid #000' }}>
            <Hdr />
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <ActiveScreen key={scr} />
              </AnimatePresence>
            </div>
            <Nav />
          </div>
        </div>
      </div>
      {/* Toast notification */}
      <AnimatePresence>
        {resetToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', background: C.navy, color: 'white', padding: '8px 16px', borderRadius: '30px', fontSize: '11px', fontWeight: 700, zIndex: 2000, boxShadow: '0 8px 30px rgba(15,29,69,0.3)', border: `1px solid ${C.navyLt}`, fontFamily: FONT, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>♻️</span> Demo data reset successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}
            onClick={() => setShowResetModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: 'white', borderRadius: '16px', padding: '24px', maxWidth: '360px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', textAlign: 'center', border: `1px solid ${C.border}` }}
            >
              <div style={{ width: '56px', height: '56px', background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: C.danger, fontSize: '24px' }}>♻️</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: C.navyLt, marginBottom: '8px', fontFamily: FONT }}>Reset Demo Data?</div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: 1.6, marginBottom: '24px', fontFamily: FONT }}>
                This will clear all active sequences, timesheets, and assignments. This action cannot be undone.
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setShowResetModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${C.border}`, background: 'white', color: C.navyLt, fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDoReset}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: C.danger, color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
