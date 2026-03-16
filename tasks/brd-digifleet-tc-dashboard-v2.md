# Digifleet TC Module — Business Requirements Document
## Version 2.0 | Java Native Rebuild Guide

**Document Type:** Business Requirements Document (BRD)  
**Project:** Fleet Dispatch System (FDS) — Digifleet TC Module  
**Scope:** TC Dashboard & Activity Logging Module — Java Native Application  
**Parent Document:** FLS Dashboard BRD Addendum v1.2 (supersedes v1.2 for TC Module scope)  
**Date:** 2026-03-16  
**Status:** FINAL DRAFT — For Developer Handoff  
**Classification:** CONFIDENTIAL — Internal Use Only  
**Location:** Futong Port Loading System (FLS)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Context](#2-background--context)
3. [System Architecture Overview](#3-system-architecture-overview)
4. [Actors & Roles](#4-actors--roles)
5. [Core Terminology](#5-core-terminology)
6. [Reference Operational Flows](#6-reference-operational-flows)
7. [Data Model](#7-data-model)
8. [Screen-by-Screen Requirements](#8-screen-by-screen-requirements)
9. [Business Rules](#9-business-rules)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Data Acquisition Requirements](#11-data-acquisition-requirements)
12. [Transition from v1.2](#12-transition-from-v12)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Glossary](#14-glossary)
15. [Open Questions](#15-open-questions)

---

## 1. Executive Summary

This document defines the complete business requirements for the **Digifleet TC Module** — the tablet application used by Traffic Controllers (TC) at Futong Port to manage all loading point activities.

The module provides a real-time operational view of the five Material Handler (Mantsinen) loading points (P1–P5), enabling TCs to:
- Track the Barge → MH → Operator → Truck operational chain per loading point.
- Start and end Timesheet Sequences (pairing an Operator with an MH unit per shift).
- Log truck loading activities (start and finish timestamps per truck per loading event).
- Log and close downtime events with category and meter readings.
- Manage barge attach/detach per loading point.
- View historical timesheets filtered by date.

This BRD supersedes the TC module section of the FLS Dashboard BRD Addendum v1.2 and is the **primary handoff document** for the Java native rebuild.

The [interactive prototype](https://fachrynuzuli.github.io/fls-dashboard/) at `fachrynuzuli.github.io/fls-dashboard` serves as the **visual and functional specification**. Where conflict exists between this document and the prototype, this BRD takes precedence.

---

## 2. Background & Context

### 2.1 Operational Context

Futong Port operates up to 5 Mantsinen crane units (Material Handlers, MH) along a ~500m jetty. Each MH serves a dedicated **Loading Point (P1–P5)** and loads timber from trucks onto a barge.

A single Traffic Controller manages the entire loading area. Because the TC cannot physically be at all 5 loading points simultaneously, **all time entry in Digifleet must support retroactive manual input** — the TC logs events after the fact.

### 2.2 Core Problems Solved by This Module

| Problem | How This Module Solves It |
|---|---|
| No single view of all 5 MH units | Homepage with horizontal-scrolling LP cards |
| No structured Operator-MH pairing per shift | Timesheet Sequence (Start/End Sequence) |
| No precise truck loading timestamps | Start/Finish Loading with timestamp key-in |
| Downtime not consistently logged | Downtime flow with category + meter readings |
| Retroactive entry is awkward | All timestamps are manual, retroactive-ready inputs |

### 2.3 Relationship to v1.2 BRD

The v1.2 BRD Addendum defined **DA-001 to DA-007** (data acquisition requirements) and **DB-001 to DB-011** (dashboard requirements). This document expands and corrects the DA requirements for the TC module and provides implementation-level detail not present in v1.2.

**Key corrections from v1.2:**
- v1.2 referenced 4 MH units (MHP0025–0028). **v2.0 adds a 5th: MHP0029 (P5).**
- v1.2 combined Loading Activity and Timesheet Sequence concepts. **v2.0 separates them clearly.**
- v1.2 had no Downtime workflow. **v2.0 defines the complete downtime lifecycle.**

---

## 3. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    ACTOR: Traffic Controller             │
│                    Tablet (Android, landscape)           │
└──────────────────────────┬──────────────────────────────┘
                           │ uses
                           ▼
┌─────────────────────────────────────────────────────────┐
│              DIGIFLEET TC MODULE (Java Native)           │
│                                                         │
│  Screen: TC Dashboard (Homepage)                        │
│  Screen: Start Sequence / End Sequence                  │
│  Screen: Start Loading / Finish Loading                 │
│  Screen: Start Downtime / End Downtime                  │
│  Screen: Assign Truck (2-step: Truck → LP)              │
│  Screen: Timesheet (Historical)                         │
│  Screen: Barge Attach / Detach                          │
└──────────────────────────┬──────────────────────────────┘
                           │ writes to
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    FDS DATABASE                         │
│                                                         │
│  Tables: units, sequences, loading_activities,          │
│          downtime_events, barge_events, trucks,         │
│          incoming_truck_pool                            │
└──────────────────────────┬──────────────────────────────┘
                           │ feeds
                    ┌──────┴───────┐
                    ▼              ▼
             FDS Dashboard    FDS Web (Reports)
             DB-001–DB-011    FUTONG_ADMIN
```

### 3.1 Client Platform

- **Device:** Android tablet, landscape orientation.
- **Target screen:** 10" tablet, ~1200×800 px or smaller (horizontal scroll for LP cards).
- **Framework:** Java native Android (no web view, no React/HTML).
- **Connectivity:** Online-first. Local caching/queue for intermittent connectivity TBD (see OQ-001).

---

## 4. Actors & Roles

| Actor | Role | Access |
|---|---|---|
| **Traffic Controller (TC)** | Primary user. Operates the Digifleet TC module on a tablet at the port. | Full write access to all TC module screens. |
| **Operator** | Selected from a master list by the TC when starting a Timesheet Sequence. Does NOT directly interact with the app. | No login required in TC module. |
| **FUTONG_ADMIN** | FDS Web only. Manages delivery targets. | No TC module access. |
| **Site Manager** | FDS Web dashboards only. Read-only. | No TC module access. |

### 4.1 Active TCs (for mock data seeding)

Jekson, Robert, Sahat

### 4.2 Active Operators (Master List — for dropdown)

Willyanto, Anggiat, Suharno, Ricardo, Faozi, Indahlen, Sahat, Arnol, Parningotan, Rivqi, Ikrar, Edon, Pusen, Juli

---

## 5. Core Terminology

> ⚠️ **Critical distinction** that was ambiguous in v1.2:

| Term | Definition | Measured By | Scope |
|---|---|---|---|
| **Timesheet Sequence** | One continuous working period of a single Operator on a single MH unit. | HM (Hour Meter) delta, FM (Fuel Meter) delta. | One Operator ↔ One MH. Can contain many Loading Activities. |
| **Loading Activity** | One truck's loading event at an MH. Starts when TC clicks "Start Loading," ends when TC clicks "Finish Loading." | Timestamp delta (hh:mm:ss). | One Truck. Many Loading Activities can occur within a single Timesheet Sequence. |
| **Downtime Event** | A period when an MH is unavailable due to maintenance, repair, or breakdown. Automatically ends the current Timesheet Sequence. | Timestamp delta + HM/FM. | One MH. |
| **Loading Point (LP)** | Physical crane position at the jetty. One MH is permanently assigned per LP. | — | P1–P5. |
| **Material Handler (MH)** | Mantsinen crane unit. One per LP. | — | MHP0025–MHP0029. |
| **HM (Hour Meter)** | Physical hour meter reading on the MH unit, recorded in hours. | Numeric (e.g., 1205.5). | Per Sequence Start/End, Per Downtime Start/End. |
| **FM (Fuel Meter)** | Fuel meter reading on the MH unit, recorded in litres. | Numeric (e.g., 4820). | Per Sequence Start/End, Per Downtime Start/End. |

---

## 6. Reference Operational Flows

### 6.1 Flow A — Normal Operation

```
1. Attach Barge
   Key-in: Barge Name (dropdown), Attach Timestamp (retroactive OK)
   
2. Start Sequence (click LP card when Idle)
   Key-in: Operator Name (dropdown), Start Timestamp, HM Start, FM Start
   → LP status: RUNNING. Truck assignment and Start/Finish Loading now active.
   
3. Assign Truck to Loading Point
   Action: Select truck from Incoming Pool → Select target LP (P1–P5)
   → Truck appended to end of LP's queue. Removed from Incoming Pool.
   
4. Start Loading (1st Truck)
   Key-in: Start Timestamp (retroactive OK)
   → First truck in queue highlighted (active state). Loading timer begins.
   
5. Finish Loading (1st Truck)
   Key-in: Finish Timestamp (retroactive OK)
   → Truck removed from queue. Loading record saved within current Sequence.
   → LP still RUNNING. Next truck can begin.
   
6. [Repeat steps 3–5 for additional trucks]

7. End Sequence (click LP card when Running)
   Key-in: End Timestamp, HM Finish, FM Finish
   → Sequence record finalized & saved to Timesheet.
   → LP status: IDLE. Operator released ("—").
   
8. Detach Barge
   Key-in: Detach Timestamp (retroactive OK)
   → Barge removed from Loading Point. LP barge area shows "No barge."
```

### 6.2 Flow B — Downtime / Breakdown

```
[Continue from step 5 of Flow A — truck loading in progress]

6. Log Start Downtime (click "DOWNTIME" button)
   Key-in: Category (dropdown), Start Timestamp, HM, FM
   → AUTOMATIC: Current Timesheet Sequence is closed using these HM/FM values.
   → LP status: DOWNTIME. Operator released.
   
7. [Resolve breakdown / maintenance]

8. End Downtime (click LP card when Downtime)
   Key-in: End Timestamp, HM Finish, FM Finish
   → LP status: IDLE. Downtime record closed.
   
9. Start NEW Sequence (click LP card — now Idle)
   Key-in: Operator Name, Start Timestamp, HM, FM
   → New sequence begins (may be same or different Operator)

[Continue with Flow A from step 3]
```

### 6.3 Constraint Summary

| Constraint | Rule |
|---|---|
| Cannot log downtime | Without an active Timesheet Sequence |
| Cannot start a new sequence | While a downtime event is active |
| Cannot start loading | If LP is not RUNNING or queue is empty or another truck is actively loading |
| Cannot attach a barge | If LP already has a barge attached (must detach first) |
| All timestamps | Retroactive input allowed; system must store both event_time (user-entered) and save_time (system-captured) |

---

## 7. Data Model

### 7.1 Tables

#### `loading_points`
| Column | Type | Notes |
|---|---|---|
| id | VARCHAR PK | MHP0025–MHP0029 |
| lp_code | VARCHAR | P1–P5 |
| jetty_name | VARCHAR | e.g. "Jetty Futong - P1" |
| status | ENUM | idle / running / downtime |
| current_operator | VARCHAR FK | → operators.name, nullable |
| current_sequence_id | BIGINT FK | → sequences.id, nullable |
| current_downtime_id | BIGINT FK | → downtime_events.id, nullable |
| current_barge_event_id | BIGINT FK | → barge_events.id, nullable |
| current_hm | DECIMAL | Last known HM reading |
| current_fm | DECIMAL | Last known FM reading |

#### `sequences`
| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | Auto-increment |
| loading_point_id | VARCHAR FK | |
| operator | VARCHAR | From operator master |
| start_time | DATETIME | User-entered (retroactive) |
| end_time | DATETIME | Nullable until closed |
| hm_start | DECIMAL | |
| hm_end | DECIMAL | Nullable until closed |
| fm_start | DECIMAL | |
| fm_end | DECIMAL | Nullable until closed |
| ended_by | ENUM | manual / downtime_auto |
| save_time_start | DATETIME | System timestamp at creation |
| save_time_end | DATETIME | System timestamp at closure |
| logged_by_tc | VARCHAR | TC user ID |

#### `loading_activities`
| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| sequence_id | BIGINT FK | → sequences.id |
| loading_point_id | VARCHAR FK | |
| truck_id | VARCHAR | Truck registration |
| start_time | DATETIME | User-entered (retroactive) |
| end_time | DATETIME | Nullable until finished |
| save_time_start | DATETIME | System |
| save_time_end | DATETIME | System |
| logged_by_tc | VARCHAR | |

#### `downtime_events`
| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| loading_point_id | VARCHAR FK | |
| auto_closed_sequence_id | BIGINT FK | Sequence auto-ended by this DT |
| category | ENUM | Daily Maintenance / Preventive Service / Urgent Repair / Breakdown |
| start_time | DATETIME | User-entered |
| end_time | DATETIME | Nullable until closed |
| hm_start | DECIMAL | Used to close Sequence |
| hm_end | DECIMAL | Nullable until DT closed |
| fm_start | DECIMAL | Used to close Sequence |
| fm_end | DECIMAL | Nullable until DT closed |
| save_time_start | DATETIME | System |
| save_time_end | DATETIME | System |
| logged_by_tc | VARCHAR | |

#### `barge_events`
| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| loading_point_id | VARCHAR FK | |
| barge_name | VARCHAR | From barge master |
| attach_time | DATETIME | User-entered (retroactive) |
| detach_time | DATETIME | Nullable until detached |
| save_time_attach | DATETIME | System |
| save_time_detach | DATETIME | System |
| logged_by_tc | VARCHAR | |

#### `incoming_truck_pool`
| Column | Type | Notes |
|---|---|---|
| id | BIGINT PK | |
| truck_id | VARCHAR | |
| status | ENUM | incoming / assigned |
| assigned_to_lp | VARCHAR FK | Nullable, set on assign |
| assigned_at | DATETIME | System |
| created_at | DATETIME | System |

#### `operators` (master)
| Column | Type | Notes |
|---|---|---|
| id | INT PK | |
| name | VARCHAR | Full name |
| active | BOOLEAN | Filter for dropdown |

#### `barges` (master)
| Column | Type | Notes |
|---|---|---|
| id | INT PK | |
| name | VARCHAR | e.g. "BG. Sentosa Jaya 2308" |
| active | BOOLEAN | |

---

## 8. Screen-by-Screen Requirements

### 8.1 TC Dashboard — Homepage

**Purpose:** Single view of all 5 Loading Points.  
**Navigation:** Default screen on app launch. All other screens return here.  
**Orientation:** Landscape. LP cards scroll horizontally (left-to-right) to mirror the physical jetty.

#### 8.1.1 Top Summary Bar

| Element | Requirement |
|---|---|
| Active Units | Count of LPs with status = RUNNING |
| Barges | Count of LPs with an attached barge |
| Est. Rate | Configurable metric (future). Show placeholder "—" until backend feeds data. |
| "INCOMING TRUCKS (N)" button | Opens Assign Truck screen. N = count of trucks in `incoming_truck_pool` where `status = incoming`. |

#### 8.1.2 Loading Point Card

Each card has three visual zones, top to bottom:

**Zone 1 — Barge Header (clickable)**
- Shows: Barge name if attached, or "No barge attached."
- Tap: Navigates to Barge Operations screen for this LP.
- Visual: Distinct background from card body.

**Zone 2 — MH Status Body (clickable)**
- Shows: LP code (P1–P5), MH ID (MHP0025–MHP0029), Operator name (or "—"), Status Pill.
- Status Pill states:
  - 🟢 RUNNING (green)
  - 🟡 DOWNTIME (amber/yellow)
  - 🔘 IDLE (gray)
- Tap behavior:
  - If IDLE → navigate to **Start Sequence** screen.
  - If RUNNING → navigate to **End Sequence** screen.
  - If DOWNTIME → navigate to **End Downtime** screen.
- Visual tap hint: Small italic label beneath operator ("tap to start/end sequence/downtime").

**Zone 3 — Truck Queue**
- Shows: Trucks in queue as horizontal tags, left = next to load.
- The first truck in the queue is highlighted GREEN when a loading activity is active on this LP (`loading_activities.end_time IS NULL`).
- "+ Assign" shortcut: Tap to open Assign Truck screen pre-filtered to this LP.
- Empty state: "Empty" (no trucks assigned).

**Zone 4 — Action Buttons**
Context-sensitive buttons below the queue:

| LP Status | Active Loading? | Buttons Shown |
|---|---|---|
| IDLE | N/A | — (no loading buttons; only Timesheet) |
| RUNNING | No | "▶ START LOADING" (disabled if queue empty), "DOWNTIME", "TIMESHEET" |
| RUNNING | Yes | "■ FINISH LOADING", "TIMESHEET" |
| DOWNTIME | N/A | "END DOWNTIME", "TIMESHEET" |

All buttons: "DOWNTIME" and "TIMESHEET" always visible when status is RUNNING.

---

### 8.2 Start Sequence Screen

**Trigger:** Tap LP card body when LP status = IDLE.  
**Purpose:** Pair an Operator with an MH unit. Open a Timesheet Sequence.

| Field | Type | Required | Notes |
|---|---|---|---|
| LP / MH (display only) | Label | — | "P1 — MHP0025" shown at top |
| Operator Name | Dropdown | Yes | Populated from `operators` master (active only) |
| Start Timestamp | DateTime picker | Yes | Defaults to current time. Retroactive allowed. |
| HM Start | Numeric input | Yes | Hour meter reading at sequence start |
| FM Start | Numeric input | Yes | Fuel meter reading at sequence start |
| [START SEQUENCE] button | Action | — | Saves and returns to homepage |

**On Save:**
- Creates `sequences` record with `end_time = NULL`.
- Updates `loading_points.status = 'running'`, `current_operator`, `current_sequence_id`.
- Updates `loading_points.current_hm`, `current_fm`.

---

### 8.3 End Sequence Screen

**Trigger:** Tap LP card body when LP status = RUNNING.  
**Purpose:** Close the active Timesheet Sequence. Unpair the Operator.

**Info Banner (display only):**
- Shows: Active sequence operator name, start time, number of loads completed, current HM/FM.

| Field | Type | Required | Notes |
|---|---|---|---|
| End Timestamp | DateTime picker | Yes | Defaults to now. Retroactive allowed. |
| HM Finish | Numeric input | Yes | |
| FM Finish | Numeric input | Yes | |
| [END SEQUENCE & UNPAIR] button | Action | — | |

**On Save:**
- Updates `sequences`: sets `end_time`, `hm_end`, `fm_end`, `ended_by = 'manual'`.
- Updates `loading_points`: `status = 'idle'`, `current_operator = NULL`, `current_sequence_id = NULL`.
- Clears any active loading activity for this LP (`loading_activities.end_time` is set to now if null — TC alert recommended).

---

### 8.4 Start Loading Screen

**Trigger:** Tap "▶ START LOADING" button on LP card (only visible when status = RUNNING, queue non-empty, no active loading).  
**Purpose:** Begin logging a truck loading activity.

**Info section (display only):**
- Truck ID (first in queue), queue position ("Position 1 of N").

| Field | Type | Required | Notes |
|---|---|---|---|
| Start Timestamp | DateTime picker | Yes | Defaults to now. Retroactive allowed. |
| [▶ START LOADING: TruckID] button | Action | — | |

**On Save:**
- Creates `loading_activities` record with `end_time = NULL`, linked to `current_sequence_id`.
- First truck in queue is now highlighted (active loading state on homepage).

---

### 8.5 Finish Loading Screen

**Trigger:** Tap "■ FINISH LOADING" button on LP card (visible when an active `loading_activities` record exists for this LP).  
**Purpose:** Close the current truck loading activity. Truck departs queue.

**Info section (display only):**
- Truck ID, loading start time, elapsed duration (calculated: now − start_time, live-updating).

| Field | Type | Required | Notes |
|---|---|---|---|
| Finish Timestamp | DateTime picker | Yes | Defaults to now. Retroactive allowed. |
| [■ FINISH LOADING: TruckID] button | Action | — | |

**On Save:**
- Updates `loading_activities`: sets `end_time`, `save_time_end`.
- Removes truck from LP queue (dequeue from `incoming_truck_pool` or LP queue table).
- If more trucks in queue: LP card shows next truck and activates "▶ START LOADING."

---

### 8.6 Assign Truck Screen (2-Step)

**Trigger:** "INCOMING TRUCKS (N)" button in top bar, or "+ Assign" link on an LP's truck queue.  
**Purpose:** Assign an incoming truck from the global pool to a specific LP queue.

**Step 1 — Select Truck:**
- List of all trucks in `incoming_truck_pool` where `status = incoming`.
- Each row: Truck ID, "ASSIGN →" button.
- Empty state: "No incoming trucks in pool."
- Tap "ASSIGN →" on a truck → advances to Step 2.

**Step 2 — Select Loading Point:**
- List of all 5 LPs.
- Each row: LP code, MH ID, queue count, status pill.
- Tap an LP → assigns the truck, returns to homepage.

**On Assign:**
- Updates `incoming_truck_pool.status = 'assigned'`, `assigned_to_lp`, `assigned_at`.
- Appends truck to LP's queue (FIFO order).

---

### 8.7 Start Downtime Screen

**Trigger:** Tap "DOWNTIME" button on LP card (visible when status = RUNNING).  
**Purpose:** Log the start of a downtime event. Automatically closes the active Timesheet Sequence.  

> ⚠️ **Critical behavior:** Saving this form automatically ends the current active Timesheet Sequence using the HM/FM values entered on this form.

**Warning Banner:**
- "⚠️ This will automatically end the current Timesheet Sequence for [Operator]. HM/FM entered here will be used to close it."

| Field | Type | Required | Notes |
|---|---|---|---|
| Category | Radio buttons | Yes | Daily Maintenance / Preventive Service / Urgent Repair / Breakdown |
| Start Timestamp | DateTime picker | Yes | Defaults to now. Retroactive allowed. |
| HM | Numeric | Yes | Used to close active sequence AND as DT start HM |
| FM | Numeric | Yes | Used to close active sequence AND as DT start FM |
| [LOG DOWNTIME] button | Action | — | |

**On Save:**
1. Closes active Sequence: `sequences.end_time = start_timestamp`, `hm_end = HM`, `fm_end = FM`, `ended_by = 'downtime_auto'`.
2. Creates `downtime_events` record: `auto_closed_sequence_id = sequence.id`, `start_time`, `hm_start`, `fm_start`, `end_time = NULL`.
3. Updates `loading_points`: `status = 'downtime'`, `current_operator = NULL`, `current_sequence_id = NULL`, `current_downtime_id`.

---

### 8.8 End Downtime Screen

**Trigger:** Tap LP card body when LP status = DOWNTIME.  
**Purpose:** Close the active downtime event. Return LP to IDLE.

**Info Banner (display only):**
- Downtime category, start time, elapsed duration.

| Field | Type | Required | Notes |
|---|---|---|---|
| End Timestamp | DateTime picker | Yes | Defaults to now. Retroactive allowed. |
| HM Finish | Numeric | Yes | |
| FM Finish | Numeric | Yes | |
| [END DOWNTIME] button | Action | — | |

**On Save:**
- Updates `downtime_events`: `end_time`, `hm_end`, `fm_end`, `save_time_end`.
- Updates `loading_points`: `status = 'idle'`, `current_downtime_id = NULL`.
- LP can now accept a new Timesheet Sequence.

---

### 8.9 Timesheet Screen

**Trigger:** Tap "TIMESHEET" button on any LP card.  
**Purpose:** Display historical Timesheet Sequences for a specific LP.

#### 8.9.1 Filters
- **Date filter:** Date picker at top. Filters `sequences.start_time` to the selected date. Default: today.
- **Clear filter:** Shows all sequences for this LP.

#### 8.9.2 Sequence Table
Each row = one Timesheet Sequence.

| Column | Source | Notes |
|---|---|---|
| Operator | sequences.operator | |
| Start | sequences.start_time | display as HH:mm |
| End | sequences.end_time | display as HH:mm |
| HM Δ | end − start | in hours |
| FM Δ | end − start | in litres |
| Loads | COUNT(loading_activities) | for this sequence |
| Ended By | sequences.ended_by | manual / downtime_auto |

**Totals row:** Sum of all HM Δ and FM Δ for the filtered date.

#### 8.9.3 Expandable Loading Activities
Tapping a sequence row expands it to show individual Loading Activities within that sequence:

| Sub-row column | Notes |
|---|---|
| Truck ID | |
| Start Time | HH:mm:ss |
| Finish Time | HH:mm:ss |
| Duration | Calculated |

---

### 8.10 Barge Operations Screen

**Trigger:** Tap the Barge header zone at the top of an LP card.  
**Purpose:** Manage barge attach/detach for a specific LP.

#### 8.10.1 State: Barge Attached

**Info Banner (display only):**
- Barge name, attach timestamp, duration since attach.

| Field | Type | Required | Notes |
|---|---|---|---|
| Detach Timestamp | DateTime picker | Yes | Retroactive allowed. Must be >= attach_time. |
| [DETACH BARGE] button | Action | — | |

**On Save:**
- Updates `barge_events.detach_time`, `save_time_detach`.
- Updates `loading_points.current_barge_event_id = NULL`.

#### 8.10.2 State: No Barge Attached

| Field | Type | Required | Notes |
|---|---|---|---|
| Barge Name | Dropdown | Yes | From `barges` master (active only) |
| Attach Timestamp | DateTime picker | Yes | Retroactive allowed. |
| [ATTACH BARGE] button | Action | — | |

**Rejection Rule:** If LP already has a barge: display error message "Detach current barge first before attaching a new one." Block attach.

**On Save:**
- Creates `barge_events` record.
- Updates `loading_points.current_barge_event_id`.

---

## 9. Business Rules

| ID | Rule |
|---|---|
| BR-01 | A Loading Point can only have ONE active Timesheet Sequence at a time. |
| BR-02 | A Loading Point can only have ONE active Loading Activity at a time. |
| BR-03 | A Loading Point can only have ONE barge attached at a time. System rejects attach if barge already present. |
| BR-04 | A barge cannot be simultaneously attached to two different Loading Points. |
| BR-05 | Logging Downtime automatically closes the current Timesheet Sequence using the downtime's HM/FM values. |
| BR-06 | Cannot log downtime without an active Timesheet Sequence. |
| BR-07 | Cannot start a new Timesheet Sequence while a downtime event is open. |
| BR-08 | START LOADING is disabled if: LP is not RUNNING, queue is empty, OR another truck is actively loading on this LP. |
| BR-09 | FINISH LOADING is only available when an active loading activity exists for the LP. |
| BR-10 | All user-entered timestamps must be stored alongside system save timestamps. Both fields are non-null. |
| BR-11 | Detach timestamp must be >= Attach timestamp on the same barge event. System validates on save. |
| BR-12 | HM Finish must be >= HM Start. FM Finish must be >= FM Start. System validates on save. |
| BR-13 | Truck queue is FIFO. No drag reordering or queue manipulation UI. |
| BR-14 | Truck queue per LP is unlimited in length. |

---

## 10. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Platform | Java native Android. Minimum Android API level: TBD by dev team. |
| NFR-02 | Orientation | Landscape only for TC Dashboard. Portrait acceptable for form screens. |
| NFR-03 | Timestamps | All UI timestamps retroactive-ready. Store both `event_time` (user) and `save_time` (system). |
| NFR-04 | Responsiveness | All screens render correctly on 10" Android tablet (1200×800 or similar). |
| NFR-05 | Data Integrity | HM End >= HM Start. FM End >= FM Start. Detach >= Attach. Validated server-side, displayed on client. |
| NFR-06 | Availability | Module available during operational hours 06:00–22:00 site time, 7 days/week. |
| NFR-07 | Audit Trail | Every mutation stores user ID + event_time + save_time. Non-deletable. |
| NFR-08 | Offline | [See OQ-001] — Specify offline behaviour with dev team. |
| NFR-09 | Performance | Homepage must load within 2 seconds on WiFi. Form saves < 500ms. |
| NFR-10 | Security | TC sessions must time out after inactivity period (TBD). Role: TC only. |

---

## 11. Data Acquisition Requirements

This section replaces the corresponding DA entries from BRD Addendum v1.2 for the TC Module.

### DA-001 (Updated) — Downtime Logging

**Requirement:** TC can log a downtime start event with: Category, Timestamp (retroactive), HM, FM. Logging downtime automatically closes the current active Timesheet Sequence.

**New in v2.0:** Introduced category selection. Downtime now carries its own HM/FM which serve dual purpose (close the sequence AND open the downtime record).

**End Downtime:** TC logs end with: Timestamp (retroactive), HM Finish, FM Finish.

---

### DA-002 / DA-003 / DA-004 (Updated) — Timesheet Sequence

**Requirement:** TC can open and close a Timesheet Sequence with: Operator Name, Start Timestamp (retroactive), HM Start, HM Finish, FM Start, FM Finish.

**New in v2.0:** Added 5th LP (MHP0029/P5). Corrected the LP card click interaction (tapping the card = Start/End Sequence; loading buttons are separate controls).

---

### DA-005 (Updated) — Barge Attach & Detach

**Requirement:** TC can attach a barge by selecting from a barge master list and entering an attach timestamp (retroactive). TC can detach by entering a detach timestamp (retroactive).

**New in v2.0:** System blocks attaching a barge to an LP that already has one. Must detach first.

---

### DA-006 — Delivery Target Input (Unchanged from v1.2)

FDS Web → FUTONG_ADMIN only. No changes from v1.2.

---

### DA-007 (Updated) — Loading Activity Timestamps

**Requirement:** TC logs Start Loading and Finish Loading timestamps per truck. Both timestamps are HH:mm:ss precision. Both support retroactive entry.

**New in v2.0:** Start/Finish Loading are now clearly separate from Start/End Sequence. The prototype makes this explicit with split buttons. Both store `event_time` and `save_time`.

---

### DA-NEW-001 — Truck Queue Management

**New in v2.0.** No equivalent in v1.2.

**Requirement:** TC can add trucks from a global Incoming Truck Pool to a specific LP's queue. Trucks are assigned in two steps: (1) select truck, (2) select LP. Trucks are served FIFO. Queue length is unlimited.

**Fields stored:** truck_id, assigned_to_lp, assigned_at (system), added_by_tc.

---

## 12. Transition from v1.2

| v1.2 Concept | v2.0 Correction |
|---|---|
| 4 MH units (MHP0025–0028) | 5 units — MHP0029 / P5 added |
| Sequence and Loading conflated | Fully separated. Sequence = HM/FM. Load = truck timestamps. |
| No downtime requirement | Full downtime flow defined: Start DT → auto-end Sequence → End DT. |
| Barge attach only | Attach AND Detach with rejection rule (no duplicate attach). |
| No truck pool | Incoming Truck Pool → 2-step assignment to LP |
| Barge button on homepage | Removed. Barge managed via clickable barge header on each LP card. |
| Stop Sequence button | Removed. Replaced by tap-on-LP-card when Running. |

---

## 13. Risks & Mitigations

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| RK-001 | TC does not consistently log downtime | High | Mandatory SOPs. Dashboard must distinguish "no downtime logged" from "no data at all". |
| RK-002 | TC enters current time instead of actual event time | Medium | Retroactive entry must be the primary mode, not a special mode. Make past-entry UX obvious (e.g., show "Are you entering retroactively?" on save if time > 5min ago). |
| RK-003 | 5th LP (P5/MHP0029) not physically active yet | Low | Seed as inactive in production. Activate when commissioning completes. |
| RK-004 | HM/FM readings not available when logging retroactively | Medium | Allow leaving HM/FM null on first save with a warning. Must fill before closing Sequence (not ideal — discuss with Ops). |
| RK-005 | Two TCs on shift trying to edit the same LP simultaneously | Medium | Optimistic locking or last-write-wins. Define with dev team. |

---

## 14. Glossary

| Term | Definition |
|---|---|
| Availability | (24h − Downtime hours) / 24h × 100%. Per MH unit per day. |
| Barge Event | One attach-to-detach lifecycle of a barge at a Loading Point. |
| DA | Data Acquisition requirement. Prefix for data capture prerequisites that feed dashboards. |
| DB | Dashboard requirement. |
| Digifleet | Mobile application used by TCs for activity logging. This document defines its TC module. |
| FDS | Fleet Dispatch System. Core logistics platform hosting Digifleet and dashboards. |
| FM | Fuel Meter. Fuel reading on MH unit in litres. |
| FLS | Futong Loading System. Operational context. |
| HM | Hour Meter. Hour reading on MH unit. |
| Loading Activity | One truck's start-to-finish loading event. Timestamped in HH:mm:ss. |
| Loading Point (LP) | Physical crane position P1–P5 on the jetty. |
| Mantsinen | Brand of MH crane. Units: MHP0025–MHP0029. |
| MH | Material Handler — the Mantsinen crane unit. |
| NETWEIGHT | Net weight from weighbridge system (Max-C). Not relevant to TC module directly. |
| Operator Sequence | See Timesheet Sequence. |
| TC | Traffic Controller. Primary user of the Digifleet TC module. |
| Timesheet Sequence | One continuous Operator–MH pairing period. HM/FM measured. Contains N Loading Activities. |
| Truck Queue | FIFO queue of trucks assigned to a Loading Point awaiting loading. |
| Utilization | HM working hours / Available hours × 100%. |

---

## 15. Open Questions

| ID | Question | Owner | Status |
|---|---|---|---|
| OQ-001 | What is the offline behaviour if connectivity is lost mid-shift? Should the app queue mutations and sync on reconnect? | Dev Team / Ops | Open |
| OQ-002 | Can the same Operator appear on two different LPs simultaneously? (Shift overlap / training scenario) | Ops Manager | Open |
| OQ-003 | Is there a master list of available trucks in the system, or is truck ID free-text entry? | Dev Team | Open |
| OQ-004 | What is the session management policy? How long before TC is auto-logged-out? | IT / Security | Open |
| OQ-005 | Should End Sequence auto-close any active Loading Activity, or block End Sequence until loading is manually finished? | Ops Manager | Open |
| OQ-006 | What is the minimum Android version to support? Is there a device procurement standard? | IT | Open |

---

*— END OF DOCUMENT —*

*Digifleet TC Module BRD v2.0 | 2026-03-16 | CONFIDENTIAL*  
*Fleet Dispatch System Enhancement Project | Futong Loading System | Internal Use Only*
