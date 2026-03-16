# PRD: TC Dashboard — Interactive Prototype (v2)

## 1. Introduction / Overview

The Traffic Controller (TC) Dashboard is the **homepage** of the Digifleet mobile tablet application used at coal port jetties. It gives a single TC a real-time, at-a-glance view of all **Loading Points (P1–P5)** on the jetty.

Each Loading Point has:
- A **Material Handler** (MH/Mantsinen crane) identified by an MHP code.
- An **Operator** paired during an active Timesheet Sequence.
- An **attached Barge** being served.
- A **queue of Trucks** waiting to be loaded.

This PRD defines user stories and functional requirements for a **high-fidelity interactive prototype** in React. There is no backend — all state is simulated with mock data and persisted in **localStorage**.

> [!IMPORTANT]
> **Key Terminology Distinction**
>
> | Term | Scope | Measured By | Contains |
> |---|---|---|---|
> | **Timesheet Sequence** | MH + Operator level | HM (Hour Meter) & FM (Fuel Meter) delta | Multiple Loading Activities, 1 Operator |
> | **Loading Activity** | Per Truck | Timestamp delta (mm:ss or hh:mm) | 1 Truck start-to-finish |
>
> One Timesheet Sequence can contain **many** Loading Activities, but only **one** Operator–MH pair.

---

## 2. Goals

1. **Developer Handoff** — The logic must be so clear that the frontend team can replicate it 1:1 in production without verbal explanation.
2. **Tablet Usability** — Must be perfectly usable on a landscape tablet in the field (10" touch targets, readable at arm's length).
3. **Realistic Simulation** — localStorage + enough mock data to run end-to-end demos of the TC's daily workflow, surviving page refreshes.

---

## 3. Reference Flows

### Flow A — Normal Operation

```
Attach Barge [key-in: timestamp]
  → Start Sequence / Pair MH & Operator [key-in: Operator, timestamp, HM, FM]
    → Assign Truck to Loading Point
    → Start Load 1st truck [key-in: timestamp]
    → Finish Load 1st truck [key-in: timestamp]
    → Assign another Truck
    → Start Load 2nd truck [key-in: timestamp]
    → Finish Load 2nd truck [key-in: timestamp]
    → … repeat …
  → End Sequence / Unpair MH & Operator [key-in: timestamp, HM, FM]
→ Detach Barge [key-in: timestamp]
```

### Flow B — Downtime / Breakdown

```
Attach Barge [key-in: timestamp]
  → Start Sequence / Pair MH & Operator [key-in: Operator, timestamp, HM, FM]
    → Assign Truck → Start Load → Finish Load
    → ⚠️ Breakdown happens!
    → Log Start Downtime [key-in: Category, timestamp, HM, FM]
      ↳ Active Sequence ENDS AUTOMATICALLY [HM, FM fetched from downtime entry]
    → Log Finish Downtime [key-in: timestamp, HM, FM]
  → Start NEW Sequence / Pair MH & new Operator [key-in: Operator, timestamp, HM, FM]
    → … resume normal loading …
```

> [!NOTE]
> **Retroactive Timestamps** — Almost all timestamps in this app allow retroactive input because the TC manages a 500m port area alone and cannot always key in data in real-time.

---

## 4. User Stories

### US-01 · View Jetty Status (Homepage)

> **As a** TC, **I want to** see all Loading Points (P1–P5) on a single horizontal-scrolling screen, **so that** I can quickly assess the overall jetty status.

**Acceptance Criteria:**
- 5 cards scroll **left-to-right** resembling the physical jetty.
- Each card shows:
  - **Top**: Attached Barge Name (clickable → Barge management).
  - **Middle**: MHP code, Operator Name, Status Pill (🟢 Running · 🟡 Downtime · 🔘 Idle).
  - **Bottom**: Truck Queue tags (left = next to load).
- Below the truck queue, **action buttons**:
  - **Start Loading / Finish Loading** (truck-level, timestamp only).
  - **Log Downtime**.
  - **Timesheet** (view historical records).
- **Clicking the Loading Point card itself** navigates to Start Sequence (if idle) or End Sequence (if already running).
- Top Summary Bar: Active units, Barges, Est. Rate, and global "Incoming Trucks" button.

---

### US-02 · Start a Timesheet Sequence

> **As a** TC, **I want to** start a new Timesheet Sequence on a Loading Point, **so that** the MH begins its operational shift.

**Trigger:** TC clicks a Loading Point card that is currently 🔘 **Idle**.

**Key-in Fields:**
1. Operator Name (dropdown: Willyanto, Anggiat, Suharno, Ricardo, Faozi, Indahlen, Sahat, Arnol, Parningotan, Rivqi, Ikrar, Edon, Pusen, Juli).
2. Start Timestamp (date + time, defaults to now, retroactive allowed).
3. HM Start (Hour Meter reading).
4. FM Start (Fuel Meter reading).

**Result:** LP status → 🟢 Running. Operator shown on card. Truck assignment and Start/Finish Loading become active.

---

### US-03 · Assign Trucks to a Loading Point

> **As a** TC, **I want to** assign incoming trucks from the global pool to a specific Loading Point, **so that** trucks are queued in order for loading.

**Trigger:** TC clicks "Incoming Trucks" (global) or "+ Assign" on a specific LP.

**Flow:**
1. A screen shows all trucks in the **Incoming Pool**.
2. TC clicks a truck → **must then select which Loading Point (P1–P5)** to assign it to.
3. Truck is removed from pool and appended to the **end** of the selected LP's queue.

---

### US-04 · Start Loading a Truck

> **As a** TC, **I want to** start loading the next truck in the queue, **so that** the loading timer begins.

**Prerequisites:**
- LP status must be 🟢 Running (active Timesheet Sequence).
- At least one truck in the queue.
- No other truck currently being loaded on this LP.

**Key-in Fields:**
1. Start Timestamp (defaults to now, retroactive allowed).

**Result:** First truck in queue highlights green (actively loading). Loading timer starts.

---

### US-05 · Finish Loading a Truck

> **As a** TC, **I want to** finish loading the current truck, **so that** it departs and the next truck can begin.

**Trigger:** TC clicks "Finish Loading" on an LP with an active loading truck.

**Key-in Fields:**
1. Finish Timestamp (defaults to now, retroactive allowed).

**Result:** The active truck is removed from the queue. Loading record is saved. LP remains 🟢 Running (the Timesheet Sequence continues). Next truck can be started.

---

### US-06 · Log Downtime

> **As a** TC, **I want to** log a downtime/breakdown event, **so that** the reason and meter readings are recorded.

**Prerequisites:**
- Cannot log downtime without ending the active Timesheet Sequence first.
- Logging downtime **automatically ends** the current active sequence (HM/FM values fetched from the downtime entry).

**Flow — Start Downtime:**
1. TC clicks "Log Downtime" on an LP.
2. Key-in: **Category** (Daily Maintenance / Preventive Service / Urgent Repair / Breakdown), **Start Timestamp** (retroactive), **HM**, **FM**.
3. The active sequence is automatically closed using the HM/FM from this downtime entry.
4. LP status → 🟡 Downtime.

**Flow — End Downtime:**
1. TC clicks the LP card (or a "Finish Downtime" button) while status is 🟡 Downtime.
2. Key-in: **End Timestamp** (retroactive), **HM**, **FM**.
3. LP status → 🔘 Idle. TC can now start a new Timesheet Sequence.

**Constraint:** Cannot start a new sequence without ending the current downtime first.

---

### US-07 · View Timesheet

> **As a** TC, **I want to** view the historical timesheet for a Loading Point, **so that** I can review all completed sequences and loading activities.

**Trigger:** TC clicks "Timesheet" button on an LP card.

**Display:**
- **Date Filter** at the top to navigate between days.
- Table columns: Operator, Start Time, Stop Time, HM Start, HM Finish, Δ HM, FM Start, FM Finish, Δ FM.
- Totals row summing Δ HM and Δ FM.
- Each sequence row can expand to show individual loading activities within it.

---

### US-08 · Manage Barge (Attach / Detach)

> **As a** TC, **I want to** attach or detach a barge at a Loading Point, **so that** the system knows which barge is being served.

**Trigger:** TC clicks the Barge Name area at the top of an LP card.

**Rules:**
- **Attaching** to an LP that already has a barge → **rejected** (system message: "Detach current barge first").
- **Detach Flow:** Key-in detach timestamp (retroactive allowed) → Barge is removed. LP barge area shows "No barge".
- **Attach Flow:** Select barge from list → Key-in attach timestamp (retroactive allowed) → Barge name shown on LP card.
- Barge must always be detached before a new one can be attached.

---

### US-09 · End a Timesheet Sequence

> **As a** TC, **I want to** end the current Timesheet Sequence, **so that** the operator is released and the shift is closed.

**Trigger:** TC clicks a Loading Point card that is currently 🟢 **Running**.

**Key-in Fields:**
1. End Timestamp (defaults to now, retroactive allowed).
2. HM Finish (Hour Meter reading).
3. FM Finish (Fuel Meter reading).

**Result:** Sequence record is finalized and added to Timesheet history. Operator name resets to "—". LP status → 🔘 Idle.

---

## 5. Functional Requirements

| # | Requirement |
|---|---|
| FR-01 | Homepage displays 5 LP cards in a **horizontally scrolling** container. |
| FR-02 | Each card models: **Barge (top) → MH + Operator + Status (middle) → Truck Queue (bottom) → Action Buttons**. |
| FR-03 | Status pills update **instantly**: Running / Downtime / Idle. |
| FR-04 | **All state** persisted in localStorage and restored on page load. |
| FR-05 | **Every mutation** (assign truck, start/stop, attach/detach, downtime) writes to localStorage immediately. |
| FR-06 | Clicking LP card navigates to **Start Sequence** (if Idle) or **End Sequence** (if Running). |
| FR-07 | Start/Finish Loading is **disabled** unless LP is Running AND queue is non-empty. |
| FR-08 | Logging downtime **auto-ends** the active sequence. |
| FR-09 | Cannot start sequence during active downtime; cannot log downtime without active sequence. |
| FR-10 | Barge attach **blocked** if LP already has a barge. Must detach first. |
| FR-11 | All timestamps allow **retroactive** input. |
| FR-12 | Mock data: 5 Loading Points, 4+ barges, **14 operators** (real names), 8+ truck IDs. |
| FR-13 | A **"Reset Demo"** button (outside device frame) clears localStorage and restores initial state. |

---

## 6. Non-Goals (Out of Scope)

- No backend / API integration.
- No authentication or user roles.
- No real GPS / truck tracking.
- No reporting export.
- No drag-and-drop truck reordering (trucks are FIFO).

---

## 7. Design Considerations

- Tablet landscape (840×440 viewport in device frame).
- Horizontal scroll for LP cards to mimic jetty.
- Barge → MH → Truck vertical flow within each card.
- Status pills: Green (Running), Amber (Downtime), Gray (Idle).
- Active loading truck = green highlight tag.
- Info Bar outside device frame with contextual documentation.
- **Aesthetic**: Industrial/utilitarian tone — clean, high-density information display. Think control-room UI. Dark navy headers, clean whites, teal accent for actions.

---

## 8. Technical Considerations

- **localStorage keys**: `fls_units`, `fls_incoming_trucks`, `fls_timesheet_<unitId>`, `fls_downtime_<unitId>`.
- Seed from defaults when localStorage is empty.
- Both `MobileMockup.jsx` and `digifleet_da_mockups.html` must contain identical logic.

---

## 9. Mock Data

### Operators
Willyanto, Anggiat, Suharno, Ricardo, Faozi, Indahlen, Sahat, Arnol, Parningotan, Rivqi, Ikrar, Edon, Pusen, Juli

### Traffic Controllers
Jekson, Robert, Sahat

### Loading Points
| LP | MHP Code | Jetty |
|---|---|---|
| P1 | MHP0025 | Jetty Futong - P1 |
| P2 | MHP0026 | Jetty Futong - P2 |
| P3 | MHP0027 | Jetty Futong - P3 |
| P4 | MHP0028 | Jetty Futong - P4 |
| P5 | MHP0029 | Jetty Futong - P5 |

### Barges (examples)
BG. Sentosa Jaya 2308, BG. Glory Marine 7, BG. Glory Marine 3, BG. Capricorn 119, BG. Capricorn 122

### Trucks (examples)
RTP0285, BDP0057, RTP0102, BDP0012, RTP0344, BDP0088, RTP0199, BDP0155, RTP0401, BDP0222

---

## 10. Success Metrics

| Metric | Target |
|---|---|
| A developer can reproduce the exact flow from this PRD alone. | ✅ |
| Full cycle demo works: Attach Barge → Sequence → Load × N → End Sequence → Detach Barge. | ✅ |
| Downtime flow works: Log Start DT → auto-end sequence → Log End DT → new sequence. | ✅ |
| State survives page refresh via localStorage. | ✅ |
| All 5 LPs visible and reachable via horizontal scroll on tablet. | ✅ |

---

## 11. Open Questions

1. ~~Should the TC be able to re-order trucks within a queue?~~ **Resolved: No.** FIFO only.
2. ~~Should ending downtime require a separate action?~~ **Resolved: Yes.** Separate "Start Downtime" and "End Downtime" actions.
3. ~~Should there be a maximum queue length per Loading Point?~~ **Resolved: Unlimited.**
