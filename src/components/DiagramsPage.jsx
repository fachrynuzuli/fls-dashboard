import { useEffect } from "react";
import mermaid from "mermaid";

export default function DiagramsPage() {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.contentLoaded();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Inter, sans-serif", background: "#f8fafc" }}>
      <style>{`
        .diagram-section {
          background: white; border: 1px solid #e2e8f0; border-radius: 12px;
          margin-bottom: 28px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .section-header { padding: 18px 24px 16px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; }
        .section-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; }
        .tag-blue { background: #eff6ff; color: #2563eb; }
        .section-title { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .section-desc { font-size: 12px; color: #64748b; line-height: 1.6; max-width: 640px; }
        .section-body { padding: 28px 24px; overflow-x: auto; }
        .mermaid { display: flex; justify-content: center; }
      `}</style>

      <div className="diagram-section" id="seq">
        <div className="section-header">
          <div>
            <div className="section-tag tag-blue">Diagram 0 · Sequence Diagram</div>
            <div className="section-title">DA Data Capture — Message Sequence Across Systems</div>
            <div className="section-desc">
              Ordered message sequence between Traffic Controller, Digifleet App, FDS Backend, Max-C,
              and FUTONG_ADMIN.
            </div>
          </div>
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
        end`}
          </div>
        </div>
      </div>

      <div className="diagram-section" id="erd">
        <div className="section-header">
          <div>
            <div className="section-tag tag-blue">Diagram 3 · Entity Relationship Diagram</div>
            <div className="section-title">FLS Data Model — New & Enhanced Entities</div>
          </div>
        </div>
        <div className="section-body">
          <div className="mermaid">
            {`erDiagram
        MH_UNIT ||--o{ DOWNTIME_EVENT : "has downtime"
        MH_UNIT ||--o{ MH_TIMESHEET_SEQUENCE : "has sequences"
        MH_UNIT ||--o{ TRIP_RECORD : "loads via"
        OPERATOR ||--o{ MH_TIMESHEET_SEQUENCE : "operates in"
        BARGE ||--o{ BARGE_EVENT : "has attach/detach"
        BARGE ||--o{ TRIP_RECORD : "loaded by"
        DELIVERY_TARGET ||--o{ TARGET_AUDIT_LOG : "change logged in"
        TRIP_RECORD }o--|| BARGE_EVENT : "occurs during"`}
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "40px" }}>
        More diagrams available in the full document.
      </div>
    </div>
  );
}
