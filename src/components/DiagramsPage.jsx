import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid once outside the component
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

const MermaidDiagram = ({ definition }) => {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        // Clean definition: remove leading/trailing whitespace and ensure it's not empty
        const cleanDef = definition.trim();
        if (!cleanDef) return;

        const { svg: generatedSvg } = await mermaid.render(id, cleanDef);
        if (isMounted) {
          setSvg(generatedSvg);
          setError(null);
        }
      } catch (err) {
        console.error("Mermaid Render Error:", err);
        if (isMounted) {
          setError(err.message || "Failed to render diagram");
        }
      }
    };

    renderDiagram();
    return () => { isMounted = false; };
  }, [definition]);

  if (error) {
    return (
      <div style={{ padding: '15px', color: '#B91C1C', background: '#FEF2F2', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        <strong>Render Error:</strong><br />{error}<br /><br />
        <details>
          <summary>Source Code</summary>
          <pre style={{ marginTop: '10px' }}>{definition}</pre>
        </details>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-render-container"
      style={{ display: 'flex', justifyContent: 'center', minHeight: '100px', width: '100%' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default function DiagramsPage() {
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
        .legend { display: flex; flex-wrap: wrap; gap: 16px; padding: 16px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
        .legend-item { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #64748b; }
        .legend-swatch { width: 12px; height: 12px; border-radius: 3px; }
        .disclaimer { margin-bottom: 32px; padding: 16px 24px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; font-size: 13px; color: #92400e; line-height: 1.6; }
        .mermaid-render-container svg { max-width: 100%; height: auto; }
      `}</style>

      <div className="disclaimer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
        <div>
          <strong>⚠️ Diagram Disclaimer — Please Read Before Sharing</strong><br />
          These diagrams represent <em>business intent and process logic</em> — not technical implementation.
          The author does not have access to the real database schema. All table names and fields are educated guesses.
        </div>
        <a 
          href="./fls-diagrams.html" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            whiteSpace: "nowrap",
            padding: "10px 18px",
            background: "#92400e",
            color: "white",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 4px rgba(146, 64, 14, 0.2)",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#78350f"}
          onMouseOut={(e) => e.currentTarget.style.background = "#92400e"}
        >
          <span>📜 Full Documentation</span>
          <span style={{ fontSize: "16px" }}>→</span>
        </a>
      </div>

      {/* 0. SEQUENCE DIAGRAM */}
      <div className="diagram-section" id="seq">
        <div className="section-header">
          <div>
            <div className="section-tag tag-blue">Diagram 0 · Sequence Diagram</div>
            <div className="section-title">DA Data Capture — Message Sequence Across Systems</div>
            <div className="section-desc">
              Ordered message sequence between Traffic Controller, Digifleet App, FDS Backend, Max-C, and FUTONG_ADMIN.
            </div>
          </div>
          <div className="section-meta">Audience: Dev team · BA<br />BRD ref: Section 6</div>
        </div>
        <div className="section-body">
          <MermaidDiagram definition={`sequenceDiagram
    autonumber
    participant FA as FUTONG_ADMIN
    participant TC as Traffic Controller
    participant DG as Digifleet App
    participant FDS as FDS Backend
    participant MC as Max-C
    participant DB as Dashboard Layer

    rect rgb(240, 253, 244)
    Note over TC,DB: -- DA-001 . Downtime Logging --
    TC->>DG: Open downtime record for MH unit
    TC->>DG: Input: Unit, Start, Stop
    DG->>FDS: POST downtime_event {unit_id, actual_start, actual_stop, save_ts}
    FDS-->>DG: 200 OK
    end

    rect rgb(245, 243, 255)
    Note over TC,DB: -- DA-002 / 003 / 004 . MH Timesheet --
    TC->>DG: Open MH Timesheet
    TC->>DG: Add sequence: Operator, HM Start/Finish
    DG->>FDS: POST sequence {op, hm_s, hm_f, save_ts}
    FDS-->>DG: 200 OK
    end

    rect rgb(239, 246, 255)
    Note over TC,DB: -- DA-005 . Barge Attach / Detach --
    TC->>DG: Input Barge ID, Attach Time
    DG->>FDS: POST barge_attach {barge_id, actual_attach_time}
    FDS-->>DG: 200 OK
    TC->>DG: Detach barge (complete)
    DG->>FDS: POST barge_detach {barge_id, actual_detach_time}
    end`} />
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
          <div className="section-meta">Audience: All stakeholders</div>
        </div>
        <div className="section-body">
          <MermaidDiagram definition={`flowchart TD
    FA["FUTONG_ADMIN"] --> FDS["FDS Backend"]
    TC["TRAFFIC_CONTROLLER"] --> DG["Digifleet App"]
    DG --> FDS
    MAXC["Max-C Weighbridge"] --> FDS
    FDS --> DASH["Dashboards"]
    FDS --> TRMS["TrMS"]
    DASH --> TV["TV Displays"]`} />
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
          <div className="section-meta">Audience: Dev team · Ops team</div>
        </div>
        <div className="section-body">
          <MermaidDiagram definition={`flowchart TD
    subgraph TC ["Traffic Controller"]
      T1([Start]) --> T2[Open Digifleet]
      T2 --> T3{Downtime?}
      T3 -- Yes --> T4[Log Downtime]
      T3 -- No --> T5[Timesheet]
    end
    subgraph DG ["Digifleet App"]
      T4 --> D1[Post Events]
      T5 --> D2[Post Sequence]
    end
    subgraph FDS ["FDS Backend"]
      D1 --> F1[Store Downtime]
      D2 --> F2[Store Sequence]
    end
    subgraph DB ["Dashboards"]
      F1 --> DB1[Availability]
      F2 --> DB2[Utilization]
    end`} />
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
          <div className="section-meta">Audience: Dev team</div>
        </div>
        <div className="section-body">
          <MermaidDiagram definition={`erDiagram
    MH_UNIT ||--o{ DOWNTIME_EVENT : has
    MH_UNIT ||--o{ MH_TIMESHEET_SEQUENCE : has
    MH_UNIT ||--o{ TRIP_RECORD : "loads via"
    OPERATOR ||--o{ MH_TIMESHEET_SEQUENCE : operates
    BARGE ||--o{ BARGE_EVENT : "has events"
    BARGE ||--o{ TRIP_RECORD : "loaded by"
    TRIP_RECORD }o--|| BARGE_EVENT : during`} />
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
          <div className="section-meta">Audience: Dev team · BA</div>
        </div>
        <div className="section-body">
          <MermaidDiagram definition={`flowchart LR
    WB["Max-C Weighbridge"] --> MATCH{"Ticket Match?"}
    MATCH -- Yes --> ATTACH[Attach Netweight]
    MATCH -- No --> REVIEW[Manual Review]
    ATTACH --> READY[Data Ready]
    READY --> DASH[Dashboards]`} />
        </div>
      </div>

      <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "40px", paddingBottom: "40px" }}>
        FLS Dashboard Module — Supporting Diagrams · BRD Addendum v1.0 · PTSI · March 2026
      </div>
    </div>
  );
}
