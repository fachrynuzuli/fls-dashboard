# Digifleet TC Module — Business Requirements Document
## Version 2.0 | Java Native Rebuild Guide

---

## 1. Document Control

**Project:** Fleet Dispatch System (FDS) — Digifleet TC Module
**Scope:** TC Dashboard & Activity Logging Module — Java Native Application
**Parent Document:** FLS Dashboard BRD Addendum v1.2 (supersedes v1.2 for TC Module scope)
**Date:** 2026-03-16
**Status:** FINAL DRAFT — For Developer Handoff
**Classification:** CONFIDENTIAL — Internal Use Only

### 1.1 Sign-Off
*(To be completed by Project Sponsors and Key Stakeholders)*

---

## 2. Purpose of This Addendum

This document defines the complete business requirements for the **Digifleet TC Module** — the tablet application used by Traffic Controllers (TC) at Futong Port to manage all loading point activities. It serves as the primary handoff document for the **Java native rebuild** of the TC Module, superseding the data capture sections of the FLS Dashboard BRD Addendum v1.2.

The [interactive prototype](https://fachrynuzuli.github.io/fls-dashboard/) serves as the visual and functional specification. Where conflict exists between this document and the prototype, this BRD takes precedence.

---

## 3. Background & Context

Futong Port operates up to 5 Mantsinen crane units (Material Handlers, MH) along a ~500m jetty. A single Traffic Controller manages the entire loading area on a tablet device. Because the TC cannot physically be at all 5 loading points simultaneously, **all time entry in Digifleet must support retroactive manual input** — the TC logs events after the fact. 

Version 1.2 of the BRD contained ambiguities regarding terminology (Sequence vs. Loading Activity) and lacked complete operational flows for downtime and truck queue management. This Addendum v2.0 resolves those gaps with a validated interactive prototype.

---

## 4. Scope

**In Scope for Java Native Rebuild (TC Module):**
- Real-time TC Dashboard (Homepage) supporting 5 Loading Points (P1-P5).
- Timesheet Sequence management (Start/End Sequence per Operator & MH).
- Truck Queue management (Assigning incoming trucks to specific LPs).
- Loading Activity logging (Start/Finish timestamps per truck).
- Downtime Event logging (Auto-ending active timesheet sequences).
- Barge Operations logging (Attach/Detach with rejection rules).
- Historical Timesheet viewing.
- Local SQLite/Room database caching for offline capability.

**Out of Scope (Covered by FDS Web / Backend):**
- The 11 performance dashboards (DB-001 to DB-011).
- Delivery target input (FUTONG_ADMIN logic).
- Max-C weighbridge integration.

---

## 5. Stakeholders & Access Control

| ID | Role | Name | Responsibilities | Access |
|---|---|---|---|---|
| ST-01 | Futong Wood Handling Manager | Iswandi | Primary consumer | Web Dashboards |
| ST-02 | FUTONG_ADMIN User | Rindam | Target input | Web Dashboards |
| ST-03 | Traffic Controller | Jekson, Robert, Sahat | Field data entry via tablet | TC Module (Full Write) |
| ST-04 | Operator MH | Willyanto, Anggiat, etc. | Operates units | Target of entry only |
| ST-05 | IT / Dev Team | Muhammad Fajar | Build/Deploy | N/A |

### 5.1 FUTONG_ADMIN Role Definition
*(Covered in v1.2 BRD. Not applicable to TC Module Android App).*

---

## 6. Prerequisite Data Capture Requirements

This section completely replaces DA-001 through DA-007 from v1.2 for the scope of the TC Module Android App. 

**Critical Requirement:** Retroactive Entry is a firm requirement for all Traffic Controller (TC) inputs. Both the actual event timestamp (user-entered) and the system save timestamp must be stored independently.

### 6.1 System Context Diagram
The Java Native Digifleet TC app communicates directly with the central FDS Database API, feeding DB-001 to DB-011.

### 6.2 Sequence Diagram (Normal vs Downtime)
**Normal Flow Overview:**
1. TC assigns Incoming Truck → LP Queue.
2. TC taps LP (Idle) → Starts Sequence (pairs Operator + Initial HM/FM).
3. TC taps Start Loading → logs Truck Start (retroactive).
4. TC taps Finish Loading → logs Truck Finish (retroactive).
5. TC taps LP (Running) → Ends Sequence (Logs Final HM/FM).

**Downtime Flow Summary:**
Logging Downtime on a running LP **automatically closes the active Timesheet Sequence** using the HM/FM entered on the downtime form.

### 6.3 Swimlane Process Flow
*(Refer to prototype screens for exact UI flow).*

### 6.4 Entity Relationship Diagram (New Java Native Schema)
The Java native app must sync with the following FDS tables:
- **`loading_points`**: id (P1-P5), status (idle/running/downtime), current_operator, current_barge.
- **`sequences`**: operator, start_time, end_time, hm_start, hm_end, fm_start, fm_end.
- **`loading_activities`**: sequence_id, truck_id, start_time, end_time.
- **`downtime_events`**: category, start_time, end_time, hm_start/end, fm_start/end.
- **`barge_events`**: barge_name, attach_time, detach_time.
- **`incoming_truck_pool`**: truck_id, status (incoming/assigned), assigned_to_lp.

### 6.5 Data Flow Diagram — NETWEIGHT Journey
*(Handled server-side. See v1.2).*

### 6.6 DA-001 — Downtime Logging
TC logs a downtime event defining Start Time (retroactive), Category (Maintenance/Service/Repair/Breakdown), HM, and FM.
**Rule:** Saving this form strictly forces closing the active Timesheet Sequence at that exact HM/FM reading.

### 6.7 DA-002 / DA-003 / DA-004 — Timesheet Sequence (HM & FM)
TC opens a Timesheet Sequence by supplying Operator Name, Start Time (retroactive), HM Start, and FM Start.
TC closes Sequence supplying End Time, HM Finish, and FM Finish.

### 6.8 DA-005 — Barge Attach & Detach Timestamps
TC attaches a barge from the master list with an Attach Timestamp (retroactive).
TC detaches the barge with a Detach Timestamp.
**Rule:** Ensure System rejects attaching a new barge if one is already attached to the LP (must detach first).

### 6.9 DA-007 — Loading Timestamp Precision (HH:mm:ss)
TC logs Start Loading and Finish Loading timestamps independently in full precision.

### 6.10 DA-NEW-001 — Truck Assignment (New)
TC assigns trucks from global pool to a specific LP queue. System must manage an array/FIFO queue per parameter.

---

## 7. Dashboard Module Specifications
*(The actual Dashboards DB-001 to DB-011 are Out of Scope for the TC App Rebuild. See original v1.2 BRD).*

### 7.0 Dashboard Overview
N/A to Android TC Module.

### 7.1 Group A — Equipment Performance
N/A to Android TC Module. Fed by DA-001, DA-002, DA-003.

### 7.2 Group B — Loading & Fuel Performance
N/A to Android TC Module. Fed by DA-005, DA-007.

### 7.3 Group C — Delivery Achievement
N/A to Android TC Module.

---

## 8. Display & UX Requirements

1. **Orientation:** Landscape strictly enforced for the main TC Dashboard. Form inputs may trigger portrait if system default.
2. **Horizontal Scrolling:** The 5 Loading Point cards must scroll horizontally to mimic the physical ~500m jetty layout.
3. **Visual Cues:** 
   - LP Status Pills: 🟢 RUNNING, 🟡 DOWNTIME, 🔘 IDLE.
   - Active loading trucks highlighted in green.
4. **Retroactive Inputs:** All date/time selectors defaults to 'now' but explicitly allow user editing for retroactive logging.

---

## 9. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-001 | Platform | Native Android (Java or Kotlin). Min API TBD by dev team. |
| NFR-002 | Platform | Offline Capabilities (SQLite / Room cache) required for loss of connectivity. |
| NFR-003 | Audit Trail | Every mutation requires user ID + event_time + save_time. Non-deletable logs. |
| NFR-004 | Data Integrity | HM Finish >= HM Start. FM Finish >= FM Start. Detach >= Attach. |

---

## 10. Open Questions & Risks

### 10.1 Open Questions

| ID | Question | Owner | Status |
|---|---|---|---|
| OQ-001 | What is the exact offline behavior if connectivity drops on the tablet? Should the app queue retroactive mutations locally and block until sync? | Dev Team / Ops | Open |
| OQ-002 | Can the same Operator appear on two different LPs simultaneously? (Shift overlap / training scenario) | Ops Manager | Open |
| OQ-003 | Is there a master list API for trucks, or is truck ID free-text entry in the incoming pool? | Dev Team | Open |
| OQ-004 | What is the minimum Android SDK target device? | IT | Open |

### 10.2 Risks

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| RK-001 | TC enters current time instead of actual event time for retroactive events. | Medium | UI must default cleanly but make retroactive entry obvious (e.g., alert if time > 5 min ago). |
| RK-002 | 5th LP (P5/MHP0029) not physically active yet. | Low | Seed database with P5 status as inactive until commissioning completes. |
| RK-003 | Conflicting edits if two TCs use tablets on same LP. | Medium | Implement optimistic locking or last-write-wins API policy. |

---

## 11. Glossary

| Term | Definition |
|---|---|
| **Timesheet Sequence** | One continuous Operator–MH pairing period. HM/FM measured. |
| **Loading Activity** | One truck's start-to-finish loading event. Timestamped in HH:mm:ss. |
| **Downtime Event** | Closes active sequence automatically. Captures HM/FM. |
| **Loading Point (LP)** | Physical crane position P1–P5. |
| **Max-C** | External weighbridge system. |
