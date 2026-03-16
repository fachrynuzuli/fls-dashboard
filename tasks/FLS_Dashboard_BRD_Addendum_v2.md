BUSINESS REQUIREMENTS DOCUMENT
FLS Dashboard Module — Addendum
Fleet Dispatch System (FDS) Enhancement Project  |  Futong Loading System
Version 2.0 — Final  |  March 2026  |  CONFIDENTIAL

# 1. Document Control

| Field | Detail |
|---|---|
| Document Title | FLS Dashboard Module — BRD Addendum |
| Version | 2.0 — Final |
| Parent Document | FDS Enhancement BRD (existing) |
| Status | Final — Confirmed |
| Project | Futong Loading System (FLS) Enhancement |
| Date | March 2026 |
| Prepared By | Fachry Nuzuli |
| Reviewed By | Lily Purnomo |
| Approved By | Michael |

## 1.1 Sign-Off

| Name | Role | Signature | Date |
|---|---|---|---|
| Fachry Nuzuli | Digital Transformation Ops | | |
| Lily Purnomo | Digital Manager | | |
| Michael | IT BP / Project Manager | | |
| Sondang Hutahaean | IT GA System Apps Lead | | |
| Iswandi | Futong Wood Handling Manager / Key User | | |
| Arlin Simatupang | PTSI Business Unit Head | | |

---

# 2. Purpose of This Addendum

This document is a formal addendum to the Fleet Dispatch System (FDS) Enhancement BRD. It defines all requirements for the Futong Loading System (FLS) Dashboard Module — eleven performance dashboards requested by Futong Port Operations management — and the prerequisite data capture features that must be built before those dashboards can function.

This version (2.0) has been fully updated to reflect the new tablet-based flow processes and data acquisition steps finalized during the prototype phase, specifically overhauling the state management of Operator Sequences, Truck Queuing, and Barge validation.

This addendum stands as a self-contained requirements document. All references to "the parent BRD" refer to the FDS Enhancement BRD. Requirements in this addendum do not replace any section of the parent BRD; they extend it.

The document is structured in two primary layers:
*   **Section 6 — Prerequisite Data Capture Requirements (DA-001 to DA-008):** features that must be built to generate the raw data the dashboards depend on.
*   **Section 7 — Dashboard Module Specifications (DB-001 to DB-011):** the 11 performance dashboards, their formulas, data sources, filters, and acceptance criteria.

---

# 3. Background & Context

The Futong Port operations team currently tracks equipment performance, loading productivity, fuel efficiency, and delivery progress through manually maintained Excel spreadsheets. These reports are produced daily and reviewed monthly by the Operations Manager and General Manager.

Analysis of the existing Excel reports reveals the following monitoring practice in the current state:
*   Four Mantsinen Material Handler units (MHP0025–MHP0028) and one new unit (MHP0029) are tracked individually against targets
*   Productivity (ton/hour) and fuel burn (liter/ton, liter/HM) are compared against fixed targets per unit
*   Month-to-date (MTD) delivery volume is tracked against a monthly target manually entered by the team
*   All data is entered and calculated manually — no automation, no system integration

The FDS/Digifleet system does not currently capture sufficient data to automate these reports. This addendum defines what must be built — both the prerequisite data capture features and the dashboard layer on top of them.

> [!WARNING]
> The existing Excel reports use line charts to compare per-unit categorical performance rather than time-series trends. The proposed dashboards will use appropriate visualization types per context: bar charts for per-unit comparisons, line charts for trends over time, and progress indicators for target achievement.

---

# 4. Scope

| In Scope | Out of Scope |
|---|---|
| • 11 FLS performance dashboards (DB-001 to DB-011) | • Any changes to the Max-C system or data structure |
| • 8 prerequisite data capture features (DA-001 to DA-008) | • Financial reporting, cost analysis, or payroll |
| • New FUTONG_ADMIN role and permissions | • Mobile app dashboard access (web / TV only) |
| • Delivery target input mechanism with full audit trail | • Historical data migration for pre-go-live periods |
| • Per-dashboard export to PDF and Excel | • Max-C day boundary convention changes (06:00–05:59) |
| • TV display optimization (web browser, landscape) | • Offline / low-connectivity dashboard access |
| • Unweighed load caution banner across Max-C dashboards | • Automated rolling target recalculation (Phase 2) |
| • Tablet-optimized Traffic Controller interface | |

---

# 5. Stakeholders & Access Control

| ID | Role | Name | Responsibility |
|---|---|---|---|
| ST-01 | Futong Wood Handling Manager | Iswandi | Primary dashboard consumer; daily performance review; key user and BRD approver |
| ST-02 | FUTONG_ADMIN User | Rindam | Inputs and revises delivery targets; full read access to all 11 dashboards |
| ST-03 | Traffic Controller | Jekson, Robert, Sahat | Field data entry via Digifleet tablet: downtime events, MH timesheet sequences, barge timestamps, truck queueing, loading start/stop |
| ST-04 | Operator MH | Willie, Anggiat, Suharno, Ricardo, Faozi, Indahlen, Sahat, Arnol, Parningotan, Rivqi, Ikrar, Edon, Pusen, Juli | Operates Mantsinen units; activity captured via Traffic Controller input |
| ST-05 | IT / Development Team | Muhammad Fajar | Build and deploy all features defined in this addendum |

## 5.1 FUTONG_ADMIN Role Definition

The `FUTONG_ADMIN` role is a new role required for this module. It is the only role with write access to the Delivery Target input screen. All other authenticated FDS roles will have read-only access to the dashboard module — they can view dashboards and targets, but cannot edit them.

| Role | Permissions | Notes |
|---|---|---|
| `FUTONG_ADMIN` | READ: All 11 dashboards<br>WRITE: Delivery Target (daily / monthly / yearly)<br>READ: Target change audit log | Assigned to Futong Ops Manager and designated admin accounts. Target input UI is visible only to this role. |
| All other FDS roles | READ: All 11 dashboards<br>NO access to target input fields | Target values are displayed read-only. Target input field is hidden (not disabled) for non-admin roles. |

---

# 6. Prerequisite Data Capture Requirements

The following requirements represent data capture gaps identified to feed the 11 dashboards. No dashboard in Section 7 can render without the corresponding data capture features being live and populated in production.

> [!CAUTION]
> **Retroactive Entry is a firm requirement for all Traffic Controller (TC) inputs.** TC staff cover approximately 500m of loading area with a maximum of two controllers on shift using tablets. All timestamp-based fields must support manual entry of an earlier time (retroactive adjustment) to account for real-world logging delays. Both the actual event timestamp (user-entered) and the system save timestamp must be stored independently.

## DA-001 — Downtime Logging — Mantsinen Units (Updated Flow)

| Module / Location | Digifleet — Traffic Controller Tablet Interface |
|---|---|
| **Priority** | 1 — Critical |
| **Description** | Traffic Controller must log downtime events for any Mantsinen unit. **Crucially, logging downtime automatically ends any active Operator Sequence.** If an Operator Sequence is active when Downtime starts, the system **MUST** force the TC to input the current Hour Meter (HM) and Fuel Meter (FM) to close the sequence before the status officially flips to 'Downtime'. |
| **New Fields Required** | - Unit (MH ID) — linked to Equipment Master<br>- Downtime Category — enum: Daily Maintenance \| Preventive Service \| Urgent Repair<br>- Start Timestamp (date + HH:mm)<br>- Start HM (if closing active sequence)<br>- Start FM (if closing active sequence)<br>- Stop Timestamp (date + HH:mm)<br>- Stop HM (required when ending downtime to establish new baseline)<br>- Stop FM (required when ending downtime)<br>- Logged By (TC user ID)<br>- Entry Timestamp (system save time) |
| **Retroactive Entry** | Yes — TC must be able to create a downtime record after the fact with manual start and stop times. |
| **Impacts Dashboards**| DB-001 (Availability), DB-002 (Utilization) |
| **Acceptance Criteria** | 1. TC can log downtime from the unit's action menu.<br>2. **If the unit is 'Running', the 'Start Downtime' form requires HM and FM readings, which automatically terminate the active Operator Sequence.**<br>3. Ending downtime flips the unit status back to 'Idle' and requires updated HM/FM baselines.<br>4. Start/Stop timestamps accept manual retroactive input.<br>5. Multiple downtime records per unit per day are fully supported and summed correctly. |

## DA-002 / 003 / 004 — Operator Sequence State (Updated Flow)

| Module / Location | Digifleet — Traffic Controller Tablet Interface |
|---|---|
| **Priority** | 1 — Critical |
| **Description** | Previously treated as retrospective timesheet rows, **Operator Sequences now dictate the active state of the Loading Point.** A unit must have an active sequence (Status: "Running") to load trucks. The sequence captures Operator, HM, and FM over an unbroken period of time. |
| **New Fields Required** | - Operator Name — active Operator MH role<br>- Sequence Start Timestamp (date + HH:mm)<br>- HM Start (numeric)<br>- FM Start (numeric, liters)<br>- Sequence Stop Timestamp (date + HH:mm)<br>- HM Finish (numeric)<br>- FM Finish (numeric, liters)<br>- Total HM and Total FM Consumed (system calculated logic) |
| **Retroactive Entry** | Yes — Both Start Sequence and End Sequence forms must support retroactive entry for all fields (timestamps, HM, FM). |
| **Impacts Dashboards**| DB-002, DB-003, DB-004, DB-005, DB-006, DB-007 |
| **Acceptance Criteria** | 1. "Start Sequence" action is only available when the unit is 'Idle'. Submitting it changes status to 'Running'.<br>2. HM Finish and FM Finish must strictly be >= Start values.<br>3. "End Sequence" must be manually triggered via action button, OR automatically triggered if Downtime is logged (DA-001).<br>4. Operator assignment is logged per-sequence, not per-day. One operator can have multiple sequences per day. |

## DA-005 — Barge Attach & Detach Timestamps (Strict Validation)

| Module / Location | Digifleet — Traffic Controller Tablet Interface |
|---|---|
| **Priority** | 1 — Critical |
| **Description** | TC records when a barge attaches to an LP (barge start) and detaches (discharge complete). Duration = Detach − Attach. **Strict 1:1 Validation:** An LP can only have ONE barge attached at a time. |
| **New Fields Required** | - Barge ID — linked to Barge Master<br>- Loading Point — linked to LP Master<br>- Attach Timestamp & Detach Timestamp (date + HH:mm)<br>- Status (Attached / Detached) |
| **Retroactive Entry** | Yes |
| **Impacts Dashboards**| DB-008 (Barge Unloading Time) |
| **Acceptance Criteria** | 1. System actively prevents attaching a new barge if the LP already has a barge attached (throws error toast).<br>2. A barge cannot be attached to two separate Loading Points simultaneously.<br>3. Duration calculates correctly. Barges with no detach time show as "In Progress". |

## DA-006 — Delivery Target Input — FDS Web

| Module / Location | FDS Web — Target Management Screen (`FUTONG_ADMIN` only) |
|---|---|
| **Priority** | 1 — Critical |
| **Description** | Screen to input daily, monthly, and yearly delivery targets in tonnes. Allows blank states if no target is defined. |
| **New Fields Required** | - Period Type (Daily / Monthly / Yearly)<br>- Period Reference (Date/Month)<br>- Target Value (tonnes)<br>- Audit Log Fields (Created By, Created At, Last Modified By/At, Before/After values) |
| **Acceptance Criteria** | 1. Only `FUTONG_ADMIN` can input or revise targets.<br>2. Full audit trail of all target revisions.<br>3. DB-010 and DB-011 show actionable blank states (not errors/zeros) if no target exists. |

## DA-007 — Loading Timestamp Precision & Duration

| Module / Location | Digifleet — Traffic Controller Tablet Interface |
|---|---|
| **Priority** | 2 — High |
| **Description** | Start Loading and Finish Loading events must capture full precision timestamps (date + HH:mm:ss). |
| **Acceptance Criteria** | 1. Timestamps stored accurately to the second.<br>2. Retroactive entry supported.<br>3. Used to calculate DB-009 Loading Time by Truck stack. |

## DA-008 — Two-Step Truck Assignment & Queueing (NEW)

| Module / Location | Digifleet — Traffic Controller Tablet Interface |
|---|---|
| **Priority** | 1 — Critical |
| **Description** | To support the active state model of the tablet interface, trucks arriving at the port enter a global "Incoming Trucks" pool. TCs must explicitly assign trucks to specific Loading Point queues (P1-P5). Loading actions (Start/Finish) then operate contextually on the first truck in that LP's queue. |
| **New Fields Required** | - Truck ID<br>- Assigned LP (P1-P5)<br>- Queue Position (order index in the queue) |
| **Acceptance Criteria** | 1. "Incoming Trucks" pool is visible and updated in real-time.<br>2. TC can select a truck from the pool and assign it to a specific LP queue.<br>3. Trucks in the queue are processed First-In-First-Out (FIFO) when TC hits "Start Loading".<br>4. "Finish Loading" removes the truck from the active queue and logs the data under the currently active Operator Sequence. |

---

# 7. Dashboard Module Specifications

*(Remainder of Section 7 remains identical to the established DB-001 through DB-011 formulas from the parent BRD, specifically ensuring that Utilized Hours are pulled directly from the new Operator Sequence state structure defined in DA-002).*

> Note: All 11 dashboards must account for the new Sequence-as-State paradigm. Specifically, any reference to "HM Working Hours" or "Utilized Hours" must sum the deltas of every completed Operator Sequence across the selected time period.
