# TC Dashboard — Implementation Plan (PRD v2)

Full rewrite of `MobileMockup.jsx` to implement all 9 user stories from the approved PRD, with localStorage persistence and real mock data.

## Proposed Changes

### State Architecture

#### [MODIFY] [MobileMockup.jsx](file:///Users/fnk/Repository/fls-dashboard/src/components/MobileMockup.jsx)

**State shape** — replace current flat state with a rich model:

```js
// Persisted in localStorage as JSON
{
  units: [
    {
      id: "MHP0025", jetty: "P1", barge: null | "BG. Sentosa Jaya 2308",
      bargeAttachedAt: null | "2026-03-16T08:00",
      op: "—" | "Willyanto",
      status: "idle" | "running" | "downtime",
      hm: 1205, fm: 4820,  // current meter readings
      activeSequence: null | { op, startTime, hmStart, fmStart },
      activeLoading: null | { truckId, startTime },
      activeDowntime: null | { category, startTime, hmStart, fmStart },
      queue: ["RTP0285", ...],
    }, ...
  ],
  incomingTrucks: ["BDP0012", ...],
  timesheets: {
    "MHP0025": [{ op, startTime, endTime, hmStart, hmEnd, fmStart, fmEnd, loads: [{truckId, start, end}] }],
  }
}
```

**Screens to implement** (mapping PRD user stories):

| Screen ID | PRD User Story | Trigger |
|---|---|---|
| `tc` | US-01 Homepage | Default |
| `startSeq` | US-02 Start Sequence | Click LP card when Idle |
| `endSeq` | US-09 End Sequence | Click LP card when Running |
| `trucks` | US-03 Assign Trucks | "Incoming Trucks" or "+ Assign" |
| `startLoad` | US-04 Start Loading | "Start Loading" button |
| `finishLoad` | US-05 Finish Loading | "Finish Loading" button |
| `startDowntime` | US-06a Start Downtime | "Log Downtime" button |
| `endDowntime` | US-06b End Downtime | Click LP card when Downtime |
| `ts` | US-07 Timesheet | "Timesheet" button |
| `barge` | US-08 Barge Ops | Click barge area on card |

**localStorage logic:**
- On mount: read from `fls_dashboard_state`, seed defaults if empty.
- On every mutation: write full state to `fls_dashboard_state`.
- "Reset Demo" button: `localStorage.removeItem()` + reload.

---

### Homepage (US-01)

- 5 LP cards, horizontal scroll.
- Each card: Barge (top, clickable) → MH+Operator+Status (middle) → Truck Queue (bottom) → Action Buttons.
- Action buttons: **Start Loading / Finish Loading** (truck-level), **Log Downtime**, **Timesheet**.
- LP card click → `startSeq` (idle), `endSeq` (running), `endDowntime` (downtime).
- Top bar: metrics + "Incoming Trucks" button.

---

### Truck Assignment (US-03)

- After clicking a truck from the incoming pool, show a **LP Picker** (P1–P5) so TC chooses the destination.
- Truck removed from pool, appended to chosen LP queue.

---

### Loading Activity (US-04 & US-05)

- **Start Loading**: key-in timestamp (default now) → first truck highlights green.
- **Finish Loading**: key-in timestamp → truck removed, loading record saved within active sequence.
- These are **separate from Timesheet Sequence** start/stop.

---

### Downtime (US-06)

- **Start Downtime**: Category + timestamp + HM + FM → auto-ends active sequence → status yellow.
- **End Downtime**: timestamp + HM + FM → status idle → can start new sequence.

---

### Barge (US-08)

- If LP has barge → show current status + Detach (key-in timestamp).
- If LP has no barge → show Attach form (select barge + key-in timestamp).
- Reject attach if barge already present (toast/alert).

---

#### [MODIFY] [digifleet_da_mockups.html](file:///Users/fnk/Repository/fls-dashboard/public/digifleet_da_mockups.html)

Mirror all React logic in vanilla JS with identical localStorage keys.

---

## Verification Plan

### Browser Testing
- Full Flow A: Attach → Sequence → Load×2 → End Sequence → Detach. Refresh page, verify state persists.
- Full Flow B: Sequence → Load → Start Downtime (verify auto-end) → End Downtime → New Sequence.
- Barge rejection: Try attaching when barge already present.
- Reset Demo: Click reset, verify initial state restored.
