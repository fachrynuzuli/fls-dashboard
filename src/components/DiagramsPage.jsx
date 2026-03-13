import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function DiagramsPage() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#EFF6FF',
          primaryTextColor: '#1B2A4A',
          primaryBorderColor: '#2563EB',
          lineColor: '#64748B',
          secondaryColor: '#F0FDF4',
          tertiaryColor: '#F5F3FF',
          background: '#FFFFFF',
          mainBkg: '#EFF6FF',
          nodeBorder: '#2563EB',
          clusterBkg: '#F8FAFC',
          titleColor: '#1B2A4A',
          edgeLabelBackground: '#FFFFFF',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          fontSize: '13px',
        },
        flowchart: { curve: 'basis', padding: 20 },
        er: { diagramPadding: 30, layoutDirection: 'TB', minEntityWidth: 100 },
        sequence: { actorMargin: 60, messageMargin: 30 }
      });
      isInitialized.current = true;
    }
    
    const timer = setTimeout(() => {
      mermaid.contentLoaded();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: "32px", fontFamily: "Inter, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        .diagram-section {
          background: white; border: 1px solid #e2e8f0; border-radius: 12px;
          margin-bottom: 32px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .section-header { padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
        .section-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 8px; }
        .tag-blue { background: #eff6ff; color: #2563eb; }
        .tag-green { background: #f0fdf4; color: #16a34a; }
        .tag-purple { background: #f5f3ff; color: #7c3aed; }
        .tag-amber { background: #fffbeb; color: #d97706; }
        .section-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .section-desc { font-size: 13px; color: #64748b; line-height: 1.6; max-width: 720px; }
        .section-meta { font-size: 11px; color: #94a3b8; text-align: right; white-space: nowrap; line-height: 1.5; }
        .section-body { padding: 32px 24px; overflow-x: auto; }
        .mermaid { display: flex; justify-content: center; min-height: 50px; }
        .legend { display: flex; flex-wrap: wrap; gap: 16px; padding: 16px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
        .legend-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #64748b; }
        .legend-swatch { width: 12px; height: 12px; border-radius: 3px; }
        .disclaimer { margin-bottom: 32px; padding: 16px 24px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; font-size: 13px; color: #92400e; line-height: 1.6; }
      `}</style>

      {/* DISCLAIMER */}
      <div className="disclaimer">
        <strong>⚠️ Diagram Disclaimer — Please Read Before Sharing</strong><br />
        These diagrams represent <em>business intent and process logic</em> — not technical implementation.
        The author does not have access to the real database schema. All table names and fields are educated guesses.
      </div>

      {/* 0. SEQUENCE DIAGRAM */}
      <div className="diagram-section" id="seq">
        <div className="section-header">
          <div>
            <div className="section-tag tag-blue">Diagram 0 · Sequence Diagram</div>
            <div className="section-title">DA Data Capture — Message Sequence Across Systems</div>
            <div className="section-desc">
              Ordered message sequence between Traffic Controller, Digifleet App, FDS Backend, Max-C, and FUTONG_ADMIN.
              Shows actual-event timestamps (user-entered) and system save timestamps stored independently.
            </div>
          </div>
          <div className="section-meta">Audience: Dev team · BA<br />BRD ref: Section 6 (DA-001–007)</div>
        </div>
        <div className="section-body">
          <div className="mermaid">
{`sequenceDiagram
    autonumber
    participant FA as FUTONG_ADMIN
    participant TC as Traffic Controller
    participant DG as Digifleet App
    participant FDS as FDS Backend
    participant MC as Max-C
    participant DB as Dashboard Layer

    rect rgb(240, 253, 244)
    Note over TC,DB: -- DA-001 . Downtime Logging ------------------------------
    TC->>DG: Open downtime record for MH unit
    TC->>DG: Input: Unit · Category · Start Time · Stop Time
    DG->>FDS: POST downtime_event {unit_id, category, actual_start, actual_stop, tc_user_id, save_timestamp}
    FDS-->>DG: 200 OK — record saved
    DB->>FDS: Query downtime by unit + date range
    FDS-->>DB: Downtime records → Availability %
    end

    rect rgb(245, 243, 255)
    Note over TC,DB: -- DA-002 / DA-003 / DA-004 . MH Timesheet Sequence -----
    TC->>DG: Open MH Timesheet for unit
    TC->>DG: Add sequence: Operator · Start · Stop · HM Start/Finish · FM Start/Finish
    DG->>DG: Calculate HM Delta & Fuel Delta
    DG->>FDS: POST sequence {op, actual_start, actual_stop, hm_s, hm_f, fm_s, fm_f, save_ts}
    FDS-->>DG: 200 OK
    DB->>FDS: Query sequences → Utilization · Loading Rate · Fuel Efficiency
    end

    rect rgb(239, 246, 255)
    Note over TC,DB: -- DA-005 . Barge Attach / Detach ------------------------
    TC->>DG: Attach barge to loading point
    TC->>DG: Input: Barge ID · Loading Point · Actual Attach Time
    DG->>FDS: POST barge_attach {barge_id, lp, actual_attach_time, save_ts}
    FDS-->>DG: 200 OK
    TC->>DG: Detach barge (discharge complete)
    DG->>FDS: POST barge_detach {barge_id, actual_detach_time, save_ts}
    DB->>FDS: Query events → Unloading Duration per Barge
    end`}
          </div>
        </div>
        <div className="legend">
          <div className="legend-item"><div className="legend-swatch" style={{background:'#16A34A'}}></div> TC field actions</div>
          <div className="legend-item"><div className="legend-swatch" style={{background:'#7C3AED'}}></div> Digifleet app</div>
          <div className="legend-item"><div className="legend-swatch" style={{background:'#2563EB'}}></div> FDS backend</div>
          <div className="legend-item"><div className="legend-swatch" style={{background:'#D97706'}}></div> Max-C (async)</div>
        </div>
      </div>

      {/* 1. SYSTEM CONTEXT */}
      <div className="diagram-section" id="ctx">
        <div className="section-header">
          <div>
            <div className="section-tag tag-blue">Diagram 1 · System Context</div>
            <div className="section-title">FLS Ecosystem — System Context Overview</div>
            <div className="section-desc">
               Actors, systems, and data flows. Shows how FDS, Digifleet, Max-C, TRMS, and the new Dashboard module connect.
            </div>
          </div>
          <div className="section-meta">Audience: All stakeholders<br />BRD ref: Sections 3, 5, 6.13</div>
        </div>
        <div className="section-body">
          <div className="mermaid">
{`graph TB
    FA["FUTONG_ADMIN"] --> FDS["FDS Backend"]
    TC["Traffic Controller"] --> DG["Digifleet App"]
    DG --> FDS
    MAXC["Max-C Weighbridge"] --> FDS
    FDS --> DASH["Dashboards"]
    FDS --> TRMS["TRMS Transport"]
    DASH --> TV["TV Displays"]`}
          </div>
        </div>
      </div>

      {/* 2. SWIMLANE */}
      <div className="diagram-section" id="swimlane">
        <div className="section-header">
          <div>
            <div className="section-tag tag-purple">Diagram 2 · Swimlane Process Flow</div>
            <div className="section-title">TC Data Capture — Full Operational Workflow</div>
            <div className="section-desc">
              End-to-end process flow across all 7 DA requirements, organised by actor lane.
            </div>
          </div>
          <div className="section-meta">Audience: Dev team · Ops team<br />BRD ref: Section 6 (DA-001–007)</div>
        </div>
        <div className="section-body">
          <div className="mermaid">
{`graph TD
    subgraph TC["Traffic Controller"]
    T1([Start]) --> T2[Open Digifleet]
    T2 --> T3{Downtime?}
    T3 -- Yes --> T4[Log Downtime]
    T3 -- No --> T5[Timesheet]
    end
    subgraph DG["Digifleet App"]
    T4 --> D1[Post Events]
    T5 --> D2[Post Sequence]
    end
    subgraph FDS["FDS Backend"]
    D1 --> F1[Store Downtime]
    D2 --> F2[Store Sequence]
    end
    subgraph DB["Dashboards"]
    F1 --> DB1[Availability]
    F2 --> DB2[Utilization]
    end`}
          </div>
        </div>
      </div>

      {/* 3. ERD */}
      <div className="diagram-section" id="erd">
        <div className="section-header">
          <div>
            <div className="section-tag tag-green">Diagram 3 · Entity Relationship Diagram</div>
            <div className="section-title">FLS Data Model — New & Enhanced Entities</div>
            <div className="section-desc">
              Simplified ERD showing all new tables and fields introduced by DA-001 to DA-007.
            </div>
          </div>
          <div className="section-meta">Audience: Dev team<br />BRD ref: Section 6 (DA-001–007)</div>
        </div>
        <div className="section-body">
          <div className="mermaid">
{`erDiagram
    MH_UNIT ||--o{ DOWNTIME_EVENT : has
    MH_UNIT ||--o{ MH_TIMESHEET_SEQUENCE : has
    MH_UNIT ||--o{ TRIP_RECORD : "loads via"
    OPERATOR ||--o{ MH_TIMESHEET_SEQUENCE : operates
    BARGE ||--o{ BARGE_EVENT : "has events"
    BARGE ||--o{ TRIP_RECORD : "loaded by"
    TRIP_RECORD }o--|| BARGE_EVENT : during`}
          </div>
        </div>
      </div>

      {/* 4. DFD */}
      <div className="diagram-section" id="dfd">
        <div className="section-header">
          <div>
            <div className="section-tag tag-amber">Diagram 4 · Data Flow Diagram</div>
            <div className="section-title">NETWEIGHT Journey — Max-C to Dashboard</div>
            <div className="section-desc">
              Traces NETWEIGHT from weighbridge to Dashboards. Highlights Trip Ticket matching and the 1–2 day lag.
            </div>
          </div>
          <div className="section-meta">Audience: Dev team · BA<br />BRD ref: NFR-007, 008, UX-004</div>
        </div>
        <div className="section-body">
          <div className="mermaid">
{`graph LR
    WB["Max-C Weighbridge"] --> MATCH{"Ticket Match?"}
    MATCH -- Yes --> ATTACH[Attach Netweight]
    MATCH -- No --> REVIEW[Manual Review]
    ATTACH --> READY[Data Ready]
    READY --> DASH[Dashboards]`}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "40px", paddingBottom: "40px" }}>
        FLS Dashboard Module — Supporting Diagrams · BRD Addendum v1.0 · PTSI · March 2026
      </div>
    </div>
  );
}
