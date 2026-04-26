import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const C = {
  navy: '#0F1D45',
  navyLt: '#1B2E6B',
  teal: '#0ABFDE',
  tealDk: '#0899B0',
  amber: '#F59E0B',
  amberBg: '#FEF3C7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  success: '#10B981',
  successBg: '#ECFDF5',
  bg: '#F0F2F7',
  border: '#E5E7EB',
  muted: '#6B7280',
  text: '#111827',
  card: '#FFFFFF',
  label: '#94A3B8',
};

const FONT = "'Outfit', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const SK = 'fls_dashboard_state';

const OPERATORS = ['Willyanto', 'Anggiat', 'Suharno', 'Ricardo', 'Faozi', 'Indahlen', 'Sahat', 'Arnol', 'Parningotan', 'Rivqi', 'Ikrar', 'Edon', 'Pusen', 'Juli'];
const BARGES = ['BG. Sentosa Jaya 2308', 'BG. Glory Marine 7', 'BG. Glory Marine 3', 'BG. Capricorn 119', 'BG. Capricorn 122', 'BG. Glory Marine 12'];
const MHPS = ['MHP0025', 'MHP0026', 'MHP0027', 'MHP0028'];
const DT_CATS = ['Daily Maintenance', 'Preventive Service', 'Urgent Repair', 'Breakdown'];
const WOOD_TYPES = ['ACDB', 'ACBO', 'ACWC', 'AMDB', 'AMBO', 'EUDB', 'EUBO', 'EUWC', 'GMDB', 'GMBO'];

const now = (offsetMin = 0) => {
  const d = new Date();
  if (offsetMin) d.setMinutes(d.getMinutes() + offsetMin);
  const z = d.getTimezoneOffset() * 60 * 1000;
  return new Date(d - z).toISOString().slice(0, 16);
};

const fmtT = (i) => {
  if (!i) return '—';
  const d = new Date(i);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const fmtD = (i) => {
  if (!i) return '—';
  const d = new Date(i);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const fmtDT = (i) => `${fmtD(i)} ${fmtT(i)}`;

const timeDelta = (a, b) => {
  if (!a || !b) return '—';
  const ms = new Date(b) - new Date(a);
  const m = Math.max(0, Math.floor(ms / 60000));
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};

const padHmMinutes = (minutes) => String(minutes).padStart(2, '0');

const formatHmValue = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '';
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(Number(value));
  const hours = Math.floor(abs);
  const minutes = Math.round((abs - hours) * 60);
  if (minutes === 60) return `${sign}${hours + 1}:00`;
  return `${sign}${hours}:${padHmMinutes(minutes)}`;
};

const parseHmValue = (raw) => {
  const value = String(raw || '').trim();
  if (!value) return { ok: false, error: 'HM is required.' };
  const match = value.match(/^(\d+):([0-5]\d)$/);
  if (!match) return { ok: false, error: 'HM must use h:mm, hh:mm, hhh:mm, and so on. Example: 1:05 or 12345:30.' };
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return { ok: true, value: hours + minutes / 60 };
};

const getInit = () => ({
  units: [
    { id: 'P1', mhp: 'MHP0025', jetty: 'Jetty Futong - P1', barge: 'BG. Sentosa Jaya 2308', bargeAt: now(-60), mhpAt: now(-180), op: '—', status: 'idle', hm: 1205.5, fm: 4820, seq: null, load: null, queue: [] },
    { id: 'P2', mhp: 'MHP0026', jetty: 'Jetty Futong - P2', barge: 'BG. Glory Marine 7', bargeAt: now(-10), mhpAt: now(-120), op: '—', status: 'idle', hm: 983.25, fm: 3210, seq: null, load: null, queue: [] },
    { id: 'P3', mhp: 'MHP0027', jetty: 'Jetty Futong - P3', barge: 'BG. Glory Marine 3', bargeAt: now(-115), mhpAt: now(-140), op: '—', status: 'idle', hm: 1450.75, fm: 5680, seq: null, load: null, queue: [] },
    { id: 'P4', mhp: 'MHP0028', jetty: 'Jetty Futong - P4', barge: 'BG. Capricorn 119', bargeAt: now(-45), mhpAt: now(-90), op: '—', status: 'idle', hm: 760.1, fm: 2890, seq: null, load: null, queue: [] },
    { id: 'P5', mhp: null, jetty: 'Jetty Futong - P5', barge: null, bargeAt: null, mhpAt: null, op: '—', status: 'idle', hm: 540, fm: 1920, seq: null, load: null, queue: [] },
  ],
  trucks: ['BDP0012', 'RTP0344', 'BDP0088', 'RTP0199', 'BDP0155', 'RTP0401', 'BDP0222', 'RTP0285', 'BDP0310', 'RTP0422'],
  ts: {},
  partials: {},
  breakdowns: [],
});

function ldState() {
  try {
    const raw = localStorage.getItem(SK);
    if (!raw) return getInit();
    const parsed = JSON.parse(raw);
    const hasLegacyDualMode = parsed.units?.some((u) => 'mhp2' in u || 'mhp2At' in u || 'op2' in u);
    if (hasLegacyDualMode) {
      localStorage.removeItem(SK);
      return getInit();
    }
    return {
      ...getInit(),
      ...parsed,
      breakdowns: parsed.breakdowns || [],
    };
  } catch {
    return getInit();
  }
}

function svState(state) {
  localStorage.setItem(SK, JSON.stringify(state));
}

const sBtn = (bg, color, extra = {}) => ({
  background: bg,
  color,
  border: 'none',
  borderRadius: '5px',
  padding: '8px 0',
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
  width: '100%',
  fontFamily: FONT,
  letterSpacing: '0.02em',
  ...extra,
});

const sInput = (extra = {}) => ({
  width: '100%',
  border: `1.5px solid ${C.navyLt}`,
  borderRadius: '6px',
  padding: '9px 11px',
  fontSize: '13px',
  fontWeight: 600,
  color: C.navy,
  fontFamily: MONO,
  background: 'white',
  boxSizing: 'border-box',
  ...extra,
});

const sLabel = { fontSize: '10px', color: C.muted, fontWeight: 600, marginBottom: '4px', fontFamily: FONT };
const sField = { marginBottom: '12px' };

const SCREENS = {
  tc: { l: 'TC Dashboard', i: 'All 5 loading points. Each loading point can hold only 1 Mantsinen. Assign trucks directly from the card and monitor breakdowns separately.' },
  startSeq: { l: 'Start Sequence', i: 'Pair one operator with one Mantsinen. HM Start accepts hhhhhh:mm and is stored as a float for later calculations.' },
  endSeq: { l: 'End Sequence', i: 'Close the active sequence and record finish meter readings before the unit returns to idle.' },
  startLoad: { l: 'Start Loading', i: 'Begin loading the next truck in queue. Start timestamp can be entered retroactively.' },
  finishLoad: { l: 'Finish Loading', i: 'Complete loading for the active truck and save stack plus wood type.' },
  pauseLoad: { l: 'Pause Loading', i: 'Suspend loading and return the truck to the global pool with partial-progress info.' },
  trucks: { l: 'Assign Truck', i: 'Assign a truck directly to a loading point. When opened from a loading-point card, there is no second destination step.' },
  startDt: { l: 'Start Downtime', i: 'Downtime can be created even without an active sequence. Creating downtime detaches the Mantsinen from its loading point and moves it into Breakdown monitoring.' },
  endDt: { l: 'End Downtime', i: 'Finish maintenance for a Mantsinen from the Breakdown page and return it to the available equipment pool.' },
  ts: { l: 'Timesheet', i: 'Review completed sequences, HM deltas, FM deltas, and loaded trucks for a loading point.' },
  barge: { l: 'Barge Operations', i: 'A loading point can hold only one barge at a time, but the same barge may be attached to up to two loading points.' },
  mhp: { l: 'MHP Operations', i: 'Attach or detach one Mantsinen. Each loading point can only hold one unit at a time.' },
  seqDetails: { l: 'Loaded Trucks Menu', i: 'Tabulated view of trucks loaded inside the current active sequence.' },
  breakdown: { l: 'Breakdown', i: 'Equipment undergoing downtime is monitored here after it is detached from the loading point.' },
};

export default function MobileMockup() {
  const [state, setState] = useState(ldState);
  const [scr, setScr] = useState('tc');
  const [resetToast, setResetToast] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [aid, setAid] = useState(null);
  const [pickTruck, setPickTruck] = useState(null);

  useEffect(() => {
    svState(state);
  }, [state]);

  const { units, trucks, ts, breakdowns } = state;
  const gu = (id = aid) => units.find((u) => u.id === id) || units[0];
  const gb = (id = aid) => breakdowns.find((b) => b.id === id) || breakdowns[0];
  const si = SCREENS[scr] || SCREENS.tc;

  const nav = (screen, id = null) => {
    setAid(id);
    setPickTruck(null);
    setScr(screen);
  };

  const doReset = () => setShowResetModal(true);

  const confirmDoReset = () => {
    const fresh = getInit();
    setState(fresh);
    localStorage.removeItem(SK);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
    setScr('tc');
    setShowResetModal(false);
  };

  const mut = (id, patch) => {
    setState((prev) => ({
      ...prev,
      units: prev.units.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    }));
  };

  const normalizeHmOrAlert = (raw) => {
    const parsed = parseHmValue(raw);
    if (!parsed.ok) {
      alert(`⚠️ ${parsed.error}`);
      return null;
    }
    return parsed.value;
  };

  const lpClick = (u) => {
    if (u.status === 'idle' && (!u.mhp || !u.barge)) {
      alert('⚠️ Cannot start sequence. Please attach one barge and one Mantsinen first.');
      return;
    }
    nav(u.status === 'running' ? 'endSeq' : 'startSeq', u.id);
  };

  const doStartSeq = (id, op, t, hmText, fm) => {
    const hm = normalizeHmOrAlert(hmText);
    if (hm === null) return;
    if (!op) {
      alert('⚠️ Please select an operator.');
      return;
    }
    mut(id, {
      status: 'running',
      op,
      hm,
      fm: +fm,
      seq: { op, startTime: t, hmStart: hm, fmStart: +fm, loads: [] },
      load: null,
    });
    nav('tc');
  };

  const doEndSeq = (id, t, hmText, fm) => {
    const u = gu(id);
    if (!u.seq) return;
    const hm = normalizeHmOrAlert(hmText);
    if (hm === null) return;
    const entry = { ...u.seq, endTime: t, hmEnd: hm, fmEnd: +fm };
    setState((prev) => ({
      ...prev,
      units: prev.units.map((unit) => (
        unit.id === id
          ? { ...unit, status: 'idle', op: '—', seq: null, load: null, hm, fm: +fm }
          : unit
      )),
      ts: { ...prev.ts, [id]: [...(prev.ts[id] || []), entry] },
    }));
    nav('tc');
  };

  const doStartLoad = (id, t) => {
    const u = gu(id);
    if (!u.queue[0]) return;
    mut(id, { load: { truckId: u.queue[0], startTime: t } });
    nav('tc');
  };

  const doPauseLoad = (id, t, stack, woodType) => {
    const u = gu(id);
    if (!u.load) return;
    const truckId = u.load.truckId;
    setState((prev) => ({
      ...prev,
      trucks: [...prev.trucks, truckId],
      partials: { ...prev.partials, [truckId]: { stack: +stack, woodType, pausedAt: t } },
      units: prev.units.map((unit) => (unit.id === id ? { ...unit, load: null, queue: unit.queue.slice(1) } : unit)),
    }));
    nav('tc');
  };

  const doFinishLoad = (id, t, stack, woodType) => {
    const u = gu(id);
    if (!u.load) return;
    const truckId = u.load.truckId;
    const partial = state.partials[truckId] || { stack: 0 };
    const loadEntry = { ...u.load, endTime: t, stack: +stack, woodType, resumed: !!state.partials[truckId], prevStack: partial.stack };
    setState((prev) => {
      const restPartials = Object.fromEntries(Object.entries(prev.partials).filter(([key]) => key !== truckId));
      return {
        ...prev,
        partials: restPartials,
        units: prev.units.map((unit) => {
          if (unit.id !== id) return unit;
          const seq = unit.seq ? { ...unit.seq, loads: [...unit.seq.loads, loadEntry] } : unit.seq;
          return { ...unit, load: null, queue: unit.queue.slice(1), seq };
        }),
      };
    });
    nav('tc');
  };

  const doUnassign = (id, truck) => {
    setState((prev) => ({
      ...prev,
      trucks: [...prev.trucks, truck],
      units: prev.units.map((u) => (u.id === id ? { ...u, queue: u.queue.filter((item) => item !== truck) } : u)),
    }));
  };

  const doAssign = (truck, targetId) => {
    const isAssigned = state.units.some((u) => u.queue.includes(truck) || u.load?.truckId === truck);
    if (isAssigned) {
      alert('⚠️ Truck is already assigned to a loading point.');
      return;
    }
    const target = state.units.find((u) => u.id === targetId);
    if (!target?.mhp || !target?.barge) {
      alert('⚠️ Cannot assign truck. Please attach one barge and one Mantsinen to this loading point first.');
      return;
    }
    setState((prev) => ({
      ...prev,
      trucks: prev.trucks.filter((item) => item !== truck),
      units: prev.units.map((u) => (u.id === targetId ? { ...u, queue: [...u.queue, truck] } : u)),
    }));
    nav('tc');
  };

  const doStartDt = (id, cat, t) => {
    const u = gu(id);
    if (!u.mhp) {
      alert('⚠️ No Mantsinen is attached to this loading point.');
      return;
    }

    const breakdown = {
      id: `${u.mhp}-${Date.now()}`,
      equipment: u.mhp,
      fromLoadingPoint: u.id,
      category: cat,
      startTime: t,
      hmStart: u.hm,
      fmStart: u.fm,
      previousSequence: u.seq ? { ...u.seq } : null,
    };

    const trucksToReturn = u.load ? [u.load.truckId] : [];
    const timesheetEntry = u.seq ? { ...u.seq, endTime: t, hmEnd: u.hm, fmEnd: u.fm } : null;

    setState((prev) => ({
      ...prev,
      trucks: [...prev.trucks, ...trucksToReturn],
      breakdowns: [...prev.breakdowns, breakdown],
      units: prev.units.map((unit) => (
        unit.id === id
          ? {
              ...unit,
              status: 'idle',
              mhp: null,
              mhpAt: null,
              op: '—',
              seq: null,
              load: null,
            }
          : unit
      )),
      ts: timesheetEntry ? { ...prev.ts, [id]: [...(prev.ts[id] || []), timesheetEntry] } : prev.ts,
    }));
    nav('breakdown');
  };

  const doEndDt = (breakdownId, t, hmText, fm) => {
    const breakdown = breakdowns.find((item) => item.id === breakdownId);
    if (!breakdown) return;
    const hm = normalizeHmOrAlert(hmText);
    if (hm === null) return;
    setState((prev) => ({
      ...prev,
      breakdowns: prev.breakdowns.filter((item) => item.id !== breakdownId),
      units: prev.units.map((u) => (
        u.id === breakdown.fromLoadingPoint
          ? { ...u, hm, fm: +fm }
          : u
      )),
    }));
    nav('breakdown');
  };

  const doAttach = (id, barge, t) => {
    const u = gu(id);
    if (u.barge) {
      alert('⚠️ Detach current barge first before attaching a new one.');
      return;
    }
    const count = state.units.filter((unit) => unit.barge === barge).length;
    if (count >= 2) {
      alert('⚠️ This barge is already allocated to two loading points.');
      return;
    }
    mut(id, { barge, bargeAt: t });
    nav('tc');
  };

  const doDetach = (id) => {
    mut(id, { barge: null, bargeAt: null });
    nav('tc');
  };

  const doAttachMhp = (id, mhp, t) => {
    const u = gu(id);
    if (u.mhp) {
      alert('⚠️ This loading point already has a Mantsinen attached.');
      return;
    }
    const inBreakdown = state.breakdowns.some((item) => item.equipment === mhp);
    if (inBreakdown) {
      alert(`⚠️ ${mhp} is still in Breakdown.`);
      return;
    }
    const owner = state.units.find((unit) => unit.mhp === mhp);
    if (owner && owner.id !== id) {
      if (owner.status === 'running') {
        alert(`⚠️ ${mhp} is in an active sequence on ${owner.id}. End that sequence first.`);
        return;
      }
      setState((prev) => ({
        ...prev,
        units: prev.units.map((unit) => {
          if (unit.id === owner.id) return { ...unit, mhp: null, mhpAt: null };
          if (unit.id === id) return { ...unit, mhp, mhpAt: t };
          return unit;
        }),
      }));
      nav('tc');
      return;
    }
    mut(id, { mhp, mhpAt: t });
    nav('tc');
  };

  const doDetachMhp = (id) => {
    const u = gu(id);
    if (u.status === 'running') {
      alert('⚠️ End the active sequence before detaching this Mantsinen.');
      return;
    }
    mut(id, { mhp: null, mhpAt: null });
    nav('tc');
  };

  const Pill = ({ s }) => {
    const m = {
      running: { bg: C.successBg, c: '#065F46', bc: C.success, t: '● RUNNING' },
      idle: { bg: '#F3F4F6', c: C.muted, bc: C.border, t: '○ IDLE' },
    };
    const v = m[s] || m.idle;
    return <span style={{ background: v.bg, color: v.c, border: `1px solid ${v.bc}`, padding: '2px 6px', borderRadius: '12px', fontSize: '8px', fontWeight: 700, fontFamily: FONT, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>{v.t}</span>;
  };

  const Hdr = () => (
    <div style={{ background: C.navy, padding: '7px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{ width: '28px', height: '28px', background: 'white', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
          <span style={{ fontSize: '5px', fontWeight: 900, color: C.navy, fontFamily: FONT }}>DIGI</span>
          <span style={{ fontSize: '5px', fontWeight: 900, color: C.navy, fontFamily: FONT }}>fleet</span>
        </div>
        <div style={{ color: 'white', fontSize: '10px', fontWeight: 600, fontFamily: FONT }}>TC Dashboard</div>
      </div>
      <div style={{ textAlign: 'right', color: 'white' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, fontFamily: FONT }}>Jekson</div>
        <div style={{ fontSize: '8px', opacity: 0.6, fontFamily: MONO }}>TC-20031492</div>
      </div>
    </div>
  );

  const Nav = () => (
    <div style={{ background: '#111', padding: '4px 0', display: 'flex', justifyContent: 'center', gap: '52px' }}>
      <span style={{ color: '#555', fontSize: '12px', cursor: 'pointer' }} onClick={() => nav('tc')}>|||</span>
      <span style={{ color: '#555', fontSize: '14px', cursor: 'pointer' }} onClick={() => nav('tc')}>○</span>
      <span style={{ color: '#555', fontSize: '12px', cursor: 'pointer' }} onClick={() => nav('tc')}>‹</span>
    </div>
  );

  const Back = () => <span onClick={() => nav('tc')} style={{ color: 'white', fontSize: '14px', cursor: 'pointer', marginRight: '6px' }}>←</span>;

  const FormHdr = ({ title, sub }) => (
    <div style={{ background: C.navy, padding: '9px 12px', display: 'flex', alignItems: 'center' }}>
      <Back />
      <div>
        <div style={{ color: 'white', fontWeight: 700, fontSize: '13px', fontFamily: FONT }}>{title}</div>
        {sub && <div style={{ color: '#7B93DB', fontSize: '9px', fontFamily: FONT }}>{sub}</div>}
      </div>
    </div>
  );

  const MhCard = ({ u }) => {
    const hasLoad = !!u.load;
    const sharedCount = u.barge ? units.filter((item) => item.barge === u.barge).length : 0;
    return (
      <div style={{ borderRadius: '8px', overflow: 'hidden', border: `1px solid ${C.border}`, flex: '0 0 190px', minWidth: '190px', display: 'flex', flexDirection: 'column', background: C.card, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', fontFamily: FONT }}>
        <div onClick={() => nav('barge', u.id)} style={{ background: '#F8FAFC', padding: '6px 8px', textAlign: 'center', borderBottom: `1px solid ${C.border}`, cursor: 'pointer' }}>
          <div style={{ fontSize: '14px' }}>🚢</div>
          <div style={{ fontSize: '9px', color: C.navyLt, fontWeight: 700, marginTop: '1px' }}>{u.barge || 'No barge attached'}</div>
          <div style={{ fontSize: '7px', color: C.label }}>{u.barge ? `shared with ${sharedCount} LP${sharedCount > 1 ? 's' : ''}` : 'tap to manage barge'}</div>
        </div>

        <div onClick={() => lpClick(u)} style={{ padding: '8px 9px', cursor: 'pointer', flex: 1, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div onClick={(e) => { e.stopPropagation(); nav('mhp', u.id); }} style={{ display: 'flex', alignItems: 'baseline', gap: '4px', cursor: 'pointer', background: '#F8FAFC', padding: '2px 4px', margin: '-2px -4px', borderRadius: '4px', border: `1px dashed ${C.border}` }}>
              <span style={{ fontWeight: 900, fontSize: '16px', color: C.navyLt, fontFamily: MONO }}>{u.id}</span>
              <span style={{ fontWeight: 600, fontSize: '10px', color: C.muted }}>{u.mhp || 'No MHP'}</span>
              <span style={{ fontSize: '8px', color: C.teal, marginLeft: '2px' }}>✎</span>
            </div>
            <Pill s={u.status} />
          </div>
          <div style={{ fontSize: '9px', color: C.muted, marginBottom: '1px' }}>↗ {u.jetty}</div>
          <div style={{ fontSize: '9px', color: C.muted }}>👤 <strong style={{ color: C.text }}>{u.op}</strong></div>
          <div style={{ fontSize: '9px', color: C.muted, marginTop: '2px' }}>HM baseline: <strong style={{ color: C.navyLt, fontFamily: MONO }}>{formatHmValue(u.hm)}</strong></div>
          {hasLoad && <div style={{ marginTop: '4px', fontSize: '8px', padding: '3px 6px', background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '4px', color: '#065F46', fontWeight: 700 }}>⏳ Loading: {u.load.truckId} ({fmtT(u.load.startTime)})</div>}
          <div style={{ fontSize: '7px', color: C.label, marginTop: '4px', fontStyle: 'italic' }}>tap to {u.status === 'idle' ? 'start sequence' : 'end sequence'}</div>
        </div>

        <div style={{ background: '#F8FAFC', padding: '6px 8px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: '8px', fontWeight: 700, color: C.muted, marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>TRUCK QUEUE ({u.queue.length})</span>
            <span onClick={(e) => { e.stopPropagation(); nav('trucks', u.id); }} style={{ color: C.teal, cursor: 'pointer', fontWeight: 700 }}>+ Assign</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', minHeight: '18px' }}>
            {u.queue.length === 0 ? <span style={{ fontSize: '8px', color: '#9CA3AF', fontStyle: 'italic' }}>Empty</span> : u.queue.map((truck, index) => {
              const active = index === 0 && hasLoad;
              const isPartial = !!state.partials[truck];
              return (
                <div key={truck} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <div style={{ background: active ? C.success : 'white', color: active ? 'white' : C.text, border: `1px solid ${active ? C.success : C.border}`, borderRadius: '3px', padding: '1px 4px', fontSize: '8px', fontWeight: 600, fontFamily: MONO }}>
                    🚛{truck}{isPartial ? ' [P]' : ''}
                  </div>
                  {!active && <span onClick={(e) => { e.stopPropagation(); doUnassign(u.id, truck); }} style={{ fontSize: '10px', color: C.danger, cursor: 'pointer', padding: '0 2px' }}>✖</span>}
                </div>
              );
            })}
          </div>

          {u.seq?.loads?.length > 0 && (
            <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: `1px dashed ${C.border}` }}>
              <div style={{ fontSize: '8px', fontWeight: 700, color: C.muted, marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>LOADED TRUCKS ({u.seq.loads.length})</span>
                <span onClick={(e) => { e.stopPropagation(); nav('seqDetails', u.id); }} style={{ background: '#EEF2FF', color: C.navyLt, padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>Table View →</span>
              </div>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                {u.seq.loads.map((load, index) => (
                  <div key={`${load.truckId}-${index}`} style={{ background: C.successBg, color: C.success, border: `1px solid ${C.success}`, borderRadius: '3px', padding: '1px 4px', fontSize: '8px', fontWeight: 600, fontFamily: MONO }}>
                    ✓ {load.truckId}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {u.status === 'running' && !hasLoad && (
            <button onClick={(e) => { e.stopPropagation(); nav('startLoad', u.id); }} disabled={u.queue.length === 0} style={sBtn(C.navyLt, 'white', { opacity: u.queue.length === 0 ? 0.4 : 1 })}>
              {u.queue.length === 0 ? 'NO TRUCKS' : '▶ START LOADING'}
            </button>
          )}
          {u.status === 'running' && hasLoad && (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={(e) => { e.stopPropagation(); nav('finishLoad', u.id); }} style={sBtn(C.danger, 'white', { flex: 2 })}>■ FINISH</button>
              <button onClick={(e) => { e.stopPropagation(); nav('pauseLoad', u.id); }} style={sBtn(C.amber, 'white', { flex: 1 })}>⏸ PAUSE</button>
            </div>
          )}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={(e) => { e.stopPropagation(); nav('startDt', u.id); }} style={sBtn('white', C.muted, { border: `1px solid ${C.border}`, flex: 1, padding: '5px 0', fontSize: '8px' })}>DOWNTIME</button>
            <button onClick={(e) => { e.stopPropagation(); nav('ts', u.id); }} style={sBtn('white', C.muted, { border: `1px solid ${C.border}`, flex: 1, padding: '5px 0', fontSize: '8px' })}>TIMESHEET</button>
          </div>
        </div>
      </div>
    );
  };

  const ScreenTC = () => {
    const running = units.filter((u) => u.status === 'running').length;
    const attachedBargeCount = new Set(units.map((u) => u.barge).filter(Boolean)).size;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'hidden', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: FONT }}>
        <div style={{ background: 'white', borderBottom: `1px solid ${C.border}`, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            {[['Active', `${running}/${units.length}`], ['Barges', attachedBargeCount], ['Breakdown', breakdowns.length]].map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: '8px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: C.navyLt, fontFamily: MONO }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => nav('breakdown')} style={{ background: breakdowns.length ? C.amber : '#E2E8F0', color: breakdowns.length ? 'white' : C.navyLt, border: 'none', padding: '6px 10px', borderRadius: '5px', fontSize: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
              BREAKDOWN ({breakdowns.length})
            </button>
            <button onClick={() => nav('trucks')} style={{ background: C.teal, color: 'white', border: 'none', padding: '6px 10px', borderRadius: '5px', fontSize: '9px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT, boxShadow: '0 2px 6px rgba(10,191,222,0.25)' }}>
              INCOMING TRUCKS ({trucks.length})
            </button>
          </div>
        </div>
        <div style={{ padding: '10px', display: 'flex', gap: '10px', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', flex: 1, alignItems: 'flex-start', position: 'relative' }}>
          {units.map((u) => <MhCard key={u.id} u={u} />)}
          <div style={{ position: 'sticky', right: -10, top: 0, bottom: 0, width: '40px', background: 'linear-gradient(to left, rgba(240,242,247,0.9), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }}>
            <div style={{ background: C.navy, color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 900, boxShadow: '0 4px 10px rgba(0,0,0,0.2)', opacity: 0.8, transform: 'translateX(10px)' }}>
              &gt; P5
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenStartSeq = () => {
    const u = gu();
    const activeOps = units.map((unit) => unit.op).filter((op) => op && op !== '—');
    const availOps = OPERATORS.filter((op) => !activeOps.includes(op));
    const [op, setOp] = useState(availOps[0] || '');
    const [t, setT] = useState(now());
    const [hm, setHm] = useState(formatHmValue(u.hm));
    const [fm, setFm] = useState(u.fm);

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Start Sequence" sub={`${u.mhp || 'No MHP'} · ${u.id} — Pair Operator & Mantsinen`} />
          <div style={{ padding: '12px' }}>
            <div style={sField}><div style={sLabel}>Start Timestamp *</div><input type="datetime-local" value={t} onChange={(e) => setT(e.target.value)} style={sInput()} /></div>
            <div style={sField}><div style={sLabel}>Operator *</div><select value={op} onChange={(e) => setOp(e.target.value)} style={sInput()}>{availOps.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <div style={{ display: 'flex', gap: '8px', ...sField }}>
              <div style={{ flex: 1 }}>
                <div style={sLabel}>HM Start *</div>
                <input value={hm} onChange={(e) => setHm(e.target.value)} placeholder="12345:30" style={sInput()} />
                <div style={{ fontSize: '8px', color: C.label, marginTop: '4px' }}>Format: h:mm, hh:mm, hhh:mm, ...</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={sLabel}>FM Start (litres) *</div>
                <input type="number" value={fm} onChange={(e) => setFm(e.target.value)} style={sInput()} />
              </div>
            </div>
            <button disabled={!op} onClick={() => doStartSeq(u.id, op, t, hm, fm)} style={{ ...sBtn(C.success, 'white', { fontSize: '13px', padding: '11px 0', marginTop: '12px', opacity: !op ? 0.5 : 1 }) }}>
              START SEQUENCE
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenEndSeq = () => {
    const u = gu();
    const [t, setT] = useState(now());
    const [hm, setHm] = useState(formatHmValue(u.hm));
    const [fm, setFm] = useState(u.fm);

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="End Sequence" sub={`${u.mhp || 'No MHP'} · ${u.id} — Unpair Operator`} />
          <div style={{ padding: '12px' }}>
            {u.seq && (
              <div style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '6px', padding: '8px 10px', marginBottom: '12px', fontSize: '10px', color: '#065F46' }}>
                <strong>Active since {fmtDT(u.seq.startTime)}</strong><br />
                Operator: {u.seq.op} · Loads: {u.seq.loads.length}
              </div>
            )}
            <div style={sField}><div style={sLabel}>End Timestamp *</div><input type="datetime-local" value={t} onChange={(e) => setT(e.target.value)} style={sInput()} /></div>
            <div style={{ display: 'flex', gap: '8px', ...sField }}>
              <div style={{ flex: 1 }}>
                <div style={sLabel}>HM Finish *</div>
                <input value={hm} onChange={(e) => setHm(e.target.value)} placeholder="12347:10" style={sInput()} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={sLabel}>FM Finish *</div>
                <input type="number" value={fm} onChange={(e) => setFm(e.target.value)} style={sInput()} />
              </div>
            </div>
            <button onClick={() => doEndSeq(u.id, t, hm, fm)} style={{ ...sBtn(C.danger, 'white', { fontSize: '13px', padding: '11px 0', marginTop: '12px' }) }}>
              END SEQUENCE & UNPAIR
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenStartLoad = () => {
    const u = gu();
    const truck = u.queue[0] || '—';
    const [t, setT] = useState(now());
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Start Loading" sub={`${u.mhp || 'No MHP'} · ${u.id} — Truck ${truck}`} />
          <div style={{ padding: '12px' }}>
            <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🚛</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: C.navyLt, fontFamily: MONO }}>{truck}</div>
                <div style={{ fontSize: '9px', color: C.muted }}>Next in queue · Position 1 of {u.queue.length}</div>
              </div>
            </div>
            <div style={sField}><div style={sLabel}>Start Timestamp *</div><input type="datetime-local" value={t} onChange={(e) => setT(e.target.value)} style={sInput()} /></div>
            <button onClick={() => doStartLoad(u.id, t)} style={sBtn(C.success, 'white', { fontSize: '13px', padding: '11px 0' })}>▶ START LOADING: {truck}</button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenFinishLoad = () => {
    const u = gu();
    const ld = u.load;
    const partial = state.partials[ld?.truckId] || {};
    const [t, setT] = useState(now());
    const [stack, setStack] = useState(partial.stack || '');
    const [woodType, setWoodType] = useState(partial.woodType || '');
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
              <div style={{ flex: 1 }}><div style={sLabel}>Stack *</div><input type="number" min="0" value={stack} onChange={(e) => setStack(e.target.value)} placeholder="ex: 8" style={sInput()} /></div>
              <div style={{ flex: 1 }}>
                <div style={sLabel}>Wood Type *</div>
                <input list="wood-types" value={woodType} onChange={(e) => setWoodType(e.target.value)} placeholder="Search..." style={sInput()} />
                <datalist id="wood-types">{WOOD_TYPES.map((w) => <option key={w} value={w} />)}</datalist>
              </div>
            </div>
            <div style={sField}><div style={sLabel}>Finish Timestamp *</div><input type="datetime-local" value={t} onChange={(e) => setT(e.target.value)} style={sInput()} /></div>
            <button disabled={!stack || !woodType} onClick={() => doFinishLoad(u.id, t, stack, woodType)} style={{ ...sBtn(C.danger, 'white', { fontSize: '13px', padding: '11px 0', opacity: (!stack || !woodType) ? 0.5 : 1 }) }}>
              ■ FINISH LOADING: {ld.truckId}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenPauseLoad = () => {
    const u = gu();
    const ld = u.load;
    const partial = state.partials[ld?.truckId] || {};
    const [t, setT] = useState(now());
    const [stack, setStack] = useState(partial.stack || '');
    const [woodType, setWoodType] = useState(partial.woodType || '');
    if (!ld) return <motion.div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: C.muted }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No active loading.</motion.div>;
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Pause Loading" sub={`${u.mhp || 'No MHP'} · ${u.id} — Truck ${ld.truckId}`} />
          <div style={{ padding: '12px' }}>
            <div style={{ background: C.amberBg, border: `1px solid ${C.amber}`, borderRadius: '6px', padding: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 700 }}>⏸ Suspending load</div>
              <div style={{ fontSize: '10px', color: '#92400E', marginTop: '2px' }}>This truck will return to the global pool. Current progress will be saved.</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', ...sField }}>
              <div style={{ flex: 1 }}><div style={sLabel}>Current Stack Count *</div><input type="number" min="0" value={stack} onChange={(e) => setStack(e.target.value)} placeholder="Loaded so far" style={sInput()} /></div>
              <div style={{ flex: 1 }}>
                <div style={sLabel}>Wood Type *</div>
                <input list="wood-types-pause" value={woodType} onChange={(e) => setWoodType(e.target.value)} placeholder="Search..." style={sInput()} />
                <datalist id="wood-types-pause">{WOOD_TYPES.map((w) => <option key={w} value={w} />)}</datalist>
              </div>
            </div>
            <div style={sField}><div style={sLabel}>Suspension Timestamp *</div><input type="datetime-local" value={t} onChange={(e) => setT(e.target.value)} style={sInput()} /></div>
            <button disabled={!stack || !woodType} onClick={() => doPauseLoad(u.id, t, stack, woodType)} style={{ ...sBtn(C.amber, 'white', { fontSize: '13px', padding: '11px 0', opacity: (!stack || !woodType) ? 0.5 : 1 }) }}>
              ⏸ PAUSE & RETURN TO POOL
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenTrucks = () => {
    const directTarget = units.find((u) => u.id === aid);
    if (!directTarget && pickTruck) {
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
          <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
            <FormHdr title="Select Loading Point" sub={`Assigning truck ${pickTruck}`} />
            <div style={{ padding: '12px' }}>
              <p style={{ fontSize: '10px', color: C.muted, marginBottom: '10px' }}>Choose which loading point should receive <strong>{pickTruck}</strong>.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {units.map((u) => {
                  const canAssign = u.mhp && u.barge;
                  return (
                    <button key={u.id} onClick={() => (canAssign ? doAssign(pickTruck, u.id) : alert('⚠️ This loading point is missing a barge or Mantsinen.'))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: '6px', background: canAssign ? 'white' : '#F3F4F6', opacity: canAssign ? 1 : 0.6, cursor: canAssign ? 'pointer' : 'not-allowed', fontFamily: FONT, fontSize: '12px', textAlign: 'left' }}>
                      <div><strong style={{ color: C.navyLt, fontFamily: MONO }}>{u.id}</strong> <span style={{ color: C.muted }}>· {u.mhp || 'No MHP'}</span></div>
                      <div style={{ fontSize: '9px', color: C.muted }}>Queue: {u.queue.length} · <Pill s={u.status} /></div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setPickTruck(null)} style={{ ...sBtn('#F3F4F6', C.muted, { border: `1px solid ${C.border}`, marginTop: '10px' }) }}>← Back to truck list</button>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Incoming Trucks" sub={directTarget ? `${trucks.length} trucks available for ${directTarget.id}` : `${trucks.length} trucks en route to port`} />
          <div style={{ padding: '12px' }}>
            {directTarget && (
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', fontSize: '10px', color: '#1D4ED8' }}>
                Direct assignment mode is active for <strong>{directTarget.id}</strong>. Picking a truck below will assign it immediately with no extra destination step.
              </div>
            )}
            {trucks.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: C.muted, background: '#F8FAFC', borderRadius: '6px' }}>No incoming trucks.</div> :
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {trucks.map((truck) => {
                  const isPartial = !!state.partials[truck];
                  return (
                    <div key={truck} onClick={() => (directTarget ? doAssign(truck, directTarget.id) : setPickTruck(truck))} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', border: `1px solid ${isPartial ? C.amber : C.border}`, borderRadius: '6px', cursor: 'pointer', background: isPartial ? C.amberBg : 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>🚛</span>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: C.navyLt, fontFamily: MONO }}>{truck}</span>
                          {isPartial && <div style={{ fontSize: '7px', color: '#92400E', fontWeight: 700, textTransform: 'uppercase' }}>⚠ Partial load: {state.partials[truck].stack}t {state.partials[truck].woodType}</div>}
                        </div>
                      </div>
                      <span style={{ fontSize: '9px', color: isPartial ? '#92400E' : C.teal, fontWeight: 700 }}>{directTarget ? `ASSIGN TO ${directTarget.id} →` : 'ASSIGN →'}</span>
                    </div>
                  );
                })}
              </div>}
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenStartDt = () => {
    const u = gu();
    const [cat, setCat] = useState(DT_CATS[0]);
    const [t, setT] = useState(now());
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="Start Downtime" sub={`${u.mhp || 'No MHP'} · ${u.id} — Detach equipment to Breakdown`} />
          <div style={{ padding: '12px' }}>
            <div style={{ background: C.amberBg, border: `1px solid ${C.amber}`, borderRadius: '6px', padding: '8px', marginBottom: '10px', fontSize: '9px', color: '#92400E' }}>
              <strong>Heads up:</strong> saving downtime will remove this Mantsinen from {u.id}. If a sequence is active, it will be closed immediately using the current stored HM/FM values.
            </div>
            <div style={sField}>
              <div style={sLabel}>Category *</div>
              {DT_CATS.map((item) => (
                <label key={item} onClick={() => setCat(item)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '5px', border: `1px solid ${cat === item ? C.navyLt : C.border}`, background: cat === item ? '#EFF3FF' : 'white', marginBottom: '4px', cursor: 'pointer', fontSize: '11px', color: cat === item ? C.navyLt : C.text, fontWeight: cat === item ? 600 : 400 }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${cat === item ? C.navyLt : '#d1d5db'}`, background: cat === item ? C.navyLt : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{cat === item && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white' }} />}</div>
                  {item}
                </label>
              ))}
            </div>
            <div style={sField}><div style={sLabel}>Start Timestamp *</div><input type="datetime-local" value={t} onChange={(e) => setT(e.target.value)} style={sInput()} /></div>
            <button onClick={() => doStartDt(u.id, cat, t)} style={{ ...sBtn(C.amber, 'white', { fontSize: '13px', padding: '11px 0', marginTop: '12px' }) }}>
              MOVE TO BREAKDOWN
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenBreakdown = () => {
    const longestOpen = breakdowns.reduce((best, item) => {
      const minutes = item.startTime ? Math.max(0, Math.floor((Date.now() - new Date(item.startTime).getTime()) / 60000)) : 0;
      return minutes > best ? minutes : best;
    }, 0);
    const longestOpenLabel = longestOpen === 0 ? '0m' : longestOpen < 60 ? `${longestOpen}m` : `${Math.floor(longestOpen / 60)}h ${longestOpen % 60}m`;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'grid', gap: '10px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', borderRadius: '12px', overflow: 'hidden', color: 'white', boxShadow: '0 18px 40px rgba(15,23,42,0.25)' }}>
            <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 700 }}>Maintenance Control</div>
                <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>Breakdown Monitoring Board</div>
                <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '6px', lineHeight: 1.5 }}>All downtime events live here after the Mantsinen is detached from its loading point. Use this page to monitor duration, meter baselines, and recovery actions.</div>
              </div>
              <button onClick={() => nav('tc')} style={{ ...sBtn('rgba(255,255,255,0.12)', 'white', { width: 'auto', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.14)' }) }}>← BACK TO TC</button>
            </div>
            <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' }}>
              {[['Active Units', breakdowns.length], ['Longest Open', longestOpenLabel], ['Ready to Recover', breakdowns.length ? `${breakdowns.length} unit${breakdowns.length > 1 ? 's' : ''}` : 'Standby']].map(([label, value]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px', fontFamily: MONO }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {breakdowns.length === 0 && (
            <div style={{ background: 'white', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '22px', color: C.muted, boxShadow: '0 10px 25px rgba(15,23,42,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: C.navyLt }}>No equipment is currently in Breakdown.</div>
                  <div style={{ fontSize: '11px', lineHeight: 1.6, marginTop: '6px' }}>When Traffic Controller logs downtime from any loading point, the Mantsinen will be detached automatically and appear here with its category, start time, HM baseline, and FM baseline.</div>
                </div>
                <div style={{ minWidth: '160px', background: '#FFF7ED', border: '1px solid #FDE68A', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '9px', color: '#B45309', fontWeight: 700, textTransform: 'uppercase' }}>Next Action</div>
                  <div style={{ fontSize: '11px', color: '#92400E', marginTop: '6px', lineHeight: 1.5 }}>Open an LP card and tap `DOWNTIME` to create a maintenance record.</div>
                </div>
              </div>
            </div>
          )}

          {breakdowns.map((item) => (
            <div key={item.id} style={{ background: 'white', border: `1px solid ${C.amber}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(245,158,11,0.08)' }}>
              <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)', padding: '10px 12px', borderBottom: `1px solid ${C.amberBg}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#92400E', fontFamily: MONO }}>{item.equipment}</div>
                  <div style={{ fontSize: '10px', color: '#B45309' }}>From {item.fromLoadingPoint} · {item.category}</div>
                </div>
                <button onClick={() => nav('endDt', item.id)} style={sBtn(C.amber, 'white', { width: 'auto', padding: '8px 12px' })}>END DOWNTIME</button>
              </div>
              <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '8px' }}>
                {[['Started', fmtDT(item.startTime)], ['HM Start', formatHmValue(item.hmStart)], ['FM Start', `${item.fmStart} L`], ['Duration', timeDelta(item.startTime, now())]].map(([label, value]) => (
                  <div key={label} style={{ background: '#FFFDF7', border: `1px solid #FDE68A`, borderRadius: '8px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '8px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>{label}</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: C.navyLt, marginTop: '4px' }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '0 12px 12px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
                <div style={{ background: '#F8FAFC', border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: C.label, textTransform: 'uppercase' }}>Function</div>
                  <div style={{ fontSize: '11px', color: C.text, lineHeight: 1.6, marginTop: '5px' }}>This card is the live maintenance tracker for <strong>{item.equipment}</strong>. The unit is detached from {item.fromLoadingPoint} until downtime is finished from this page.</div>
                </div>
                <div style={{ background: '#FFF7ED', border: '1px solid #FCD34D', borderRadius: '8px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Recovery Path</div>
                  <div style={{ fontSize: '11px', color: '#92400E', lineHeight: 1.6, marginTop: '5px' }}>Tap <strong>END DOWNTIME</strong>, enter HM/FM finish, then re-attach the Mantsinen to a loading point when ready.</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const ScreenEndDt = () => {
    const breakdown = gb();
    const [t, setT] = useState(now());
    const [hm, setHm] = useState(formatHmValue(breakdown?.hmStart ?? 0));
    const [fm, setFm] = useState(breakdown?.fmStart ?? 0);
    if (!breakdown) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: C.muted }}>No active downtime selected.</motion.div>;
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
          <FormHdr title="End Downtime" sub={`${breakdown.equipment} · from ${breakdown.fromLoadingPoint}`} />
          <div style={{ padding: '12px' }}>
            <div style={{ background: C.amberBg, border: `1px solid ${C.amber}`, borderRadius: '6px', padding: '8px', marginBottom: '10px', fontSize: '10px', color: '#92400E' }}>
              <strong>● BREAKDOWN</strong> — {breakdown.category}<br />
              Started: {fmtDT(breakdown.startTime)}
            </div>
            <div style={sField}><div style={sLabel}>End Timestamp *</div><input type="datetime-local" value={t} onChange={(e) => setT(e.target.value)} style={sInput()} /></div>
            <div style={{ display: 'flex', gap: '8px', ...sField }}>
              <div style={{ flex: 1 }}>
                <div style={sLabel}>HM Finish *</div>
                <input value={hm} onChange={(e) => setHm(e.target.value)} placeholder="12346:45" style={sInput()} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={sLabel}>FM Finish *</div>
                <input type="number" value={fm} onChange={(e) => setFm(e.target.value)} style={sInput()} />
              </div>
            </div>
            <button onClick={() => doEndDt(breakdown.id, t, hm, fm)} style={{ ...sBtn(C.success, 'white', { fontSize: '13px', padding: '11px 0', marginTop: '12px' }) }}>
              END DOWNTIME
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenTS = () => {
    const u = gu();
    const entries = ts[u.id] || [];
    const [dateFilter, setDateFilter] = useState('');
    const [exp, setExp] = useState({});
    const filtered = dateFilter ? entries.filter((e) => e.startTime && e.startTime.startsWith(dateFilter)) : entries;
    const totalHm = filtered.reduce((sum, entry) => sum + ((entry.hmEnd || 0) - (entry.hmStart || 0)), 0);
    const totalFm = filtered.reduce((sum, entry) => sum + ((entry.fmEnd || 0) - (entry.fmStart || 0)), 0);
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <FormHdr title={`Timesheet — ${u.mhp || 'Detached MHP'}`} sub={`${u.id} · ${filtered.length} sequences`} />
          <div style={{ padding: '8px 12px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={sLabel}>Date Filter:</div>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ ...sInput({ width: 'auto', padding: '4px 8px', fontSize: '11px' }) }} />
            {dateFilter && <button onClick={() => setDateFilter('')} style={{ background: 'none', border: 'none', color: C.teal, fontSize: '10px', cursor: 'pointer', fontWeight: 600 }}>Clear</button>}
          </div>
          <div style={{ overflowX: 'auto' }}>
            {filtered.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', fontSize: '11px', color: C.muted }}>No sequences recorded{dateFilter ? ' for this date' : ''}.</div> :
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', textAlign: 'left', fontFamily: FONT }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ padding: '6px 8px' }}>Operator</th>
                    <th style={{ padding: '6px 8px' }}>Start</th>
                    <th style={{ padding: '6px 8px' }}>End</th>
                    <th style={{ padding: '6px 8px' }}>HM▵</th>
                    <th style={{ padding: '6px 8px' }}>FM▵</th>
                    <th style={{ padding: '6px 8px' }}>Loads</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry, index) => (
                    <React.Fragment key={`${entry.startTime}-${index}`}>
                      <tr onClick={() => setExp((prev) => ({ ...prev, [index]: !prev[index] }))} style={{ cursor: 'pointer', borderBottom: `1px solid ${C.border}`, background: index % 2 === 0 ? 'white' : '#FAFAFA' }}>
                        <td style={{ padding: '6px 8px', fontWeight: 600, color: C.navyLt }}>{entry.op} <span style={{ fontSize: '8px', marginLeft: '4px' }}>{entry.loads.length > 0 && (exp[index] ? '▼' : '▶')}</span></td>
                        <td style={{ padding: '6px 8px', fontFamily: MONO, fontSize: '9px' }}>{fmtT(entry.startTime)}</td>
                        <td style={{ padding: '6px 8px', fontFamily: MONO, fontSize: '9px' }}>{fmtT(entry.endTime)}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700, color: C.tealDk, fontFamily: MONO }}>{formatHmValue((entry.hmEnd || 0) - (entry.hmStart || 0))}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700, color: C.tealDk, fontFamily: MONO }}>{(entry.fmEnd || 0) - (entry.fmStart || 0)}L</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700, color: C.teal }}>{entry.loads.length} trucks</td>
                      </tr>
                      {exp[index] && entry.loads.length > 0 && (
                        <tr style={{ background: '#EEF2FF', borderBottom: `1px solid ${C.border}` }}>
                          <td colSpan="6" style={{ padding: '8px 12px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', textAlign: 'left', fontFamily: FONT, background: 'white', border: `1px solid ${C.border}`, borderRadius: '4px' }}>
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
                                {entry.loads.map((load, loadIndex) => (
                                  <tr key={`${load.truckId}-${loadIndex}`} style={{ borderBottom: loadIndex === entry.loads.length - 1 ? 'none' : `1px solid ${C.border}` }}>
                                    <td style={{ padding: '6px 8px', color: C.muted }}>{loadIndex + 1}</td>
                                    <td style={{ padding: '6px 8px', fontWeight: 700, fontFamily: MONO }}>{load.truckId}</td>
                                    <td style={{ padding: '6px 8px', fontFamily: MONO, color: C.muted }}>{fmtT(load.startTime)}</td>
                                    <td style={{ padding: '6px 8px', fontFamily: MONO, color: C.muted }}>{fmtT(load.endTime)}</td>
                                    <td style={{ padding: '6px 8px', fontFamily: MONO, color: C.tealDk, fontWeight: 700 }}>{timeDelta(load.startTime, load.endTime)}</td>
                                    <td style={{ padding: '6px 8px', fontWeight: 700 }}>{load.stack}</td>
                                    <td style={{ padding: '6px 8px' }}>{load.woodType}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#F0F9FF', borderTop: `2px solid #BAE6FD` }}>
                    <td colSpan="3" style={{ padding: '6px 8px', fontWeight: 700, color: '#0369A1', fontSize: '11px' }}>TOTALS</td>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0369A1', fontFamily: MONO }}>{formatHmValue(totalHm)}</td>
                    <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0369A1', fontFamily: MONO }}>{totalFm}L</td>
                    <td />
                  </tr>
                </tfoot>
              </table>}
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenBarge = () => {
    const u = gu();
    const availableBarges = BARGES.filter((barge) => state.units.filter((unit) => unit.barge === barge).length < 2 || barge === u.barge);
    const [selBarge, setSelBarge] = useState(availableBarges[0] || '');
    const [t, setT] = useState(now());
    const [dt, setDt] = useState(now());
    const sharedCount = u.barge ? units.filter((item) => item.barge === u.barge).length : 0;
    const bargeOverview = BARGES.map((barge) => {
      const allocatedUnits = units.filter((unit) => unit.barge === barge);
      return { barge, allocatedUnits };
    });
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }}>
          {u.barge ? (
            <div style={{ flex: '1 1 260px', background: 'white', borderRadius: '8px', border: `1px solid ${C.success}`, overflow: 'hidden' }}>
              <FormHdr title="Current Barge" sub={`${u.id} — shared allocation allowed`} />
              <div style={{ padding: '12px' }}>
                <div style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '6px', padding: '8px 10px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#065F46', fontWeight: 700 }}>● ATTACHED</div>
                  <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600, marginTop: '2px' }}>{u.barge}</div>
                  <div style={{ fontSize: '9px', color: '#047857' }}>Since: {fmtDT(u.bargeAt)} · Active on {sharedCount} LP{sharedCount > 1 ? 's' : ''}</div>
                </div>
                <div style={sField}><div style={sLabel}>Detach Timestamp *</div><input type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)} style={sInput()} /></div>
                <button onClick={() => doDetach(u.id, dt)} style={sBtn(C.danger, 'white', { fontSize: '12px', padding: '10px 0' })}>DETACH BARGE</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: '1 1 260px', background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <FormHdr title="Attach Barge" sub={`${u.id} — No barge attached`} />
              <div style={{ padding: '12px' }}>
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', fontSize: '9px', color: '#1D4ED8' }}>
                  The same barge can be used on up to two loading points at the same time. The allocation board below shows exactly which LPs already hold each barge.
                </div>
                <div style={sField}><div style={sLabel}>Select Barge *</div><select value={selBarge} onChange={(e) => setSelBarge(e.target.value)} style={sInput()}>{availableBarges.map((barge) => <option key={barge} value={barge}>{barge}</option>)}</select></div>
                <div style={sField}><div style={sLabel}>Attach Timestamp *</div><input type="datetime-local" value={t} onChange={(e) => setT(e.target.value)} style={sInput()} /></div>
                <button disabled={!selBarge} onClick={() => doAttach(u.id, selBarge, t)} style={{ ...sBtn(C.navyLt, 'white', { fontSize: '12px', padding: '10px 0', opacity: !selBarge ? 0.5 : 1 }) }}>ATTACH BARGE</button>
              </div>
            </div>
          )}

          <div style={{ flex: '1 1 300px', background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <FormHdr title="Barge Allocation Board" sub="See which barges are already in service" />
            <div style={{ padding: '12px', display: 'grid', gap: '8px' }}>
              {bargeOverview.map(({ barge, allocatedUnits }) => {
                const full = allocatedUnits.length >= 2;
                const activeHere = u.barge === barge;
                return (
                  <div key={barge} style={{ border: `1px solid ${full ? '#FCA5A5' : activeHere ? '#86EFAC' : C.border}`, borderRadius: '8px', padding: '10px 12px', background: full ? '#FEF2F2' : activeHere ? '#F0FDF4' : '#F8FAFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: C.navyLt }}>{barge}</div>
                        <div style={{ fontSize: '9px', color: C.muted, marginTop: '3px' }}>
                          {allocatedUnits.length === 0 ? 'Not attached yet' : `Attached to ${allocatedUnits.map((unit) => unit.id).join(' & ')}`}
                        </div>
                      </div>
                      <div style={{ minWidth: '72px', textAlign: 'center', background: full ? '#FEE2E2' : '#E0F2FE', border: `1px solid ${full ? '#FCA5A5' : '#7DD3FC'}`, borderRadius: '999px', padding: '4px 8px', fontSize: '9px', fontWeight: 800, color: full ? '#B91C1C' : '#0369A1' }}>
                        {allocatedUnits.length}/2 LP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ScreenMhp = () => {
    const u = gu();
    const [selMhp, setSelMhp] = useState(MHPS[0] || '');
    const [t, setT] = useState(now());
    const [dt, setDt] = useState(now());
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '600px', margin: '0 auto' }}>
          {u.mhp ? (
            <div style={{ flex: '1 1 260px', background: 'white', borderRadius: '8px', border: `1px solid ${C.success}`, overflow: 'hidden' }}>
              <FormHdr title="Current Mantsinen" sub={`${u.id} — Single-slot mode`} />
              <div style={{ padding: '12px' }}>
                <div style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '6px', padding: '8px 10px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#065F46', fontWeight: 700 }}>● ATTACHED</div>
                  <div style={{ fontSize: '12px', color: '#047857', fontWeight: 600, marginTop: '2px' }}>{u.mhp}</div>
                  <div style={{ fontSize: '9px', color: '#047857' }}>Since: {fmtDT(u.mhpAt)}</div>
                </div>
                <div style={sField}><div style={sLabel}>Detach Timestamp *</div><input type="datetime-local" value={dt} onChange={(e) => setDt(e.target.value)} style={sInput()} /></div>
                <button onClick={() => doDetachMhp(u.id, dt)} style={sBtn(C.danger, 'white', { fontSize: '12px', padding: '10px 0' })}>DETACH MHP</button>
              </div>
            </div>
          ) : (
            <div style={{ flex: '1 1 260px', background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
              <FormHdr title="Attach Mantsinen" sub={`${u.id} — One Mantsinen only`} />
              <div style={{ padding: '12px' }}>
                <div style={sField}>
                  <div style={sLabel}>Select MHP *</div>
                  <select value={selMhp} onChange={(e) => setSelMhp(e.target.value)} style={sInput()}>
                    {MHPS.map((mhp) => {
                      const owner = units.find((unit) => unit.mhp === mhp);
                      const disabled = owner?.id === u.id || breakdowns.some((item) => item.equipment === mhp);
                      const inBreakdown = breakdowns.find((item) => item.equipment === mhp);
                      const suffix = inBreakdown ? '(Breakdown)' : owner ? `(Occupied on ${owner.id})` : '';
                      return <option key={mhp} value={mhp} disabled={disabled}>{mhp} {suffix}</option>;
                    })}
                  </select>
                </div>
                <div style={sField}><div style={sLabel}>Attach Timestamp *</div><input type="datetime-local" value={t} onChange={(e) => setT(e.target.value)} style={sInput()} /></div>
                <button disabled={!selMhp} onClick={() => doAttachMhp(u.id, selMhp, t)} style={{ ...sBtn(C.navyLt, 'white', { fontSize: '12px', padding: '10px 0', opacity: !selMhp ? 0.5 : 1 }) }}>ATTACH MHP</button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const ScreenSeqDetails = () => {
    const u = gu();
    const seq = u.seq;
    if (!seq) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: C.muted }}>No active sequence.</motion.div>;
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, overflow: 'auto', background: C.bg, padding: '8px', fontFamily: FONT }}>
        <div style={{ background: 'white', borderRadius: '8px', border: `1px solid ${C.border}`, overflow: 'hidden', maxWidth: '600px', margin: '0 auto' }}>
          <FormHdr title="Loaded Trucks" sub={`${u.mhp || 'No MHP'} · ${u.id}`} />
          <div style={{ padding: '12px' }}>
            <div style={{ background: C.successBg, border: `1px solid ${C.success}`, borderRadius: '6px', padding: '10px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#065F46', fontWeight: 700 }}>Active Sequence: {u.op}</div>
              <div style={{ fontSize: '10px', color: '#047857', marginTop: '4px' }}>Started: {fmtT(seq.startTime)} · HM Start: {formatHmValue(seq.hmStart)} · Total Trucks: {seq.loads.length}</div>
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
                    {seq.loads.map((load, index) => (
                      <tr key={`${load.truckId}-${index}`} style={{ borderBottom: `1px solid ${C.border}`, background: index % 2 === 0 ? 'white' : '#FAFAFA' }}>
                        <td style={{ padding: '6px 8px', color: C.muted }}>{index + 1}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700, color: C.navyLt, fontFamily: MONO }}>{load.truckId}</td>
                        <td style={{ padding: '6px 8px', fontFamily: MONO, fontSize: '9px' }}>{fmtT(load.startTime)}</td>
                        <td style={{ padding: '6px 8px', fontFamily: MONO, fontSize: '9px' }}>{fmtT(load.endTime)}</td>
                        <td style={{ padding: '6px 8px', fontFamily: MONO, fontWeight: 700, color: C.tealDk }}>{timeDelta(load.startTime, load.endTime)}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700 }}>{load.stack}</td>
                        <td style={{ padding: '6px 8px' }}>{load.woodType}</td>
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

  const screenMap = {
    tc: ScreenTC,
    startSeq: ScreenStartSeq,
    endSeq: ScreenEndSeq,
    startLoad: ScreenStartLoad,
    finishLoad: ScreenFinishLoad,
    pauseLoad: ScreenPauseLoad,
    trucks: ScreenTrucks,
    startDt: ScreenStartDt,
    endDt: ScreenEndDt,
    ts: ScreenTS,
    barge: ScreenBarge,
    mhp: ScreenMhp,
    seqDetails: ScreenSeqDetails,
    breakdown: ScreenBreakdown,
  };

  const ActiveScreen = screenMap[scr] || ScreenTC;

  return (
    <div style={{ fontFamily: FONT, background: C.bg, padding: '12px', minHeight: '100%', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: C.navyLt, fontFamily: FONT }}>Digifleet Mobile — TC Dashboard Prototype</div>
          <div style={{ fontSize: '10px', color: C.muted }}>Single Mantsinen per LP · Shared barge max 2 LPs · Breakdown monitoring</div>
        </div>
        <button onClick={doReset} style={{ background: '#FEE2E2', color: C.danger, border: `1px solid #FCA5A5`, padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>♻ RESET DEMO</button>
      </div>

      <div style={{ background: 'white', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: C.navyLt, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: FONT }}>{si.l}</div>
        <div style={{ fontSize: '12px', color: C.text, lineHeight: 1.5 }}>{si.i}</div>
        {scr !== 'tc' && <button onClick={() => nav('tc')} style={{ marginTop: '8px', background: '#F3F4F6', border: `1px solid ${C.border}`, padding: '3px 10px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 600, color: C.navyLt, fontFamily: FONT }}>← Back to TC Dashboard</button>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px 0', background: '#e8ecf4', borderRadius: '12px', flex: 1 }}>
        <div style={{ background: '#1a1a1a', borderRadius: '28px', padding: '10px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', width: '840px', height: '520px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '6px', transform: 'translateY(-50%)', width: '3px', height: '36px', background: '#333', borderRadius: '2px' }} />
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', border: '2px solid #000' }}>
            <Hdr />
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <ActiveScreen key={`${scr}-${aid || 'root'}`} />
              </AnimatePresence>
            </div>
            <Nav />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {resetToast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} style={{ position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)', background: C.navy, color: 'white', padding: '8px 16px', borderRadius: '30px', fontSize: '11px', fontWeight: 700, zIndex: 2000, boxShadow: '0 8px 30px rgba(15,29,69,0.3)', border: `1px solid ${C.navyLt}`, fontFamily: FONT, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>♻️</span> Demo data reset successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResetModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }} onClick={() => setShowResetModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '24px', maxWidth: '360px', width: '100%', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', textAlign: 'center', border: `1px solid ${C.border}` }}>
              <div style={{ width: '56px', height: '56px', background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: C.danger, fontSize: '24px' }}>♻️</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: C.navyLt, marginBottom: '8px', fontFamily: FONT }}>Reset Demo Data?</div>
              <div style={{ fontSize: '13px', color: C.muted, lineHeight: 1.6, marginBottom: '24px', fontFamily: FONT }}>
                This will clear all active sequences, timesheets, assignments, and breakdown records. This action cannot be undone.
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowResetModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: `1px solid ${C.border}`, background: 'white', color: C.navyLt, fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
                  Cancel
                </button>
                <button onClick={confirmDoReset} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: C.danger, color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
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
