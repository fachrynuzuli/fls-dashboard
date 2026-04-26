import React from "react";
import changelogData from "../data/changelog.json";

export default function Changelog() {
  // Group commits by date
  const groupedChangelog = changelogData.reduce((acc, commit) => {
    if (!acc[commit.date]) {
      acc[commit.date] = [];
    }
    acc[commit.date].push(commit);
    return acc;
  }, {});

  const dates = Object.keys(groupedChangelog).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div style={{ padding: "32px", maxWidth: "900px", margin: "0 auto", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span>📜</span> System Changelog
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.5" }}>
          A complete history of changes, new features, and improvements implemented in the Dashboard & Mockup Repository.
        </p>
      </div>

      <div style={{ background: "#ffffff", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)", border: "1px solid #e2e8f0" }}>
        {dates.map((date, index) => (
          <div key={date} style={{ position: "relative", paddingLeft: "32px", paddingBottom: index === dates.length - 1 ? "0" : "32px" }}>
            {/* Timeline Line */}
            {index !== dates.length - 1 && (
              <div style={{ position: "absolute", left: "9px", top: "28px", bottom: "0", width: "2px", background: "#e2e8f0" }} />
            )}
            
            {/* Timeline Dot */}
            <div style={{ position: "absolute", left: "4px", top: "6px", width: "12px", height: "12px", borderRadius: "50%", background: "#3b82f6", border: "2px solid #ffffff", boxShadow: "0 0 0 3px #dbeafe" }} />

            {/* Date Header */}
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "16px", background: "#f8fafc", display: "inline-block", padding: "6px 12px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
              {new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>

            {/* Commits */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {groupedChangelog[date].map((commit) => {
                const isFeat = commit.msg.toLowerCase().startsWith("feat");
                const isFix = commit.msg.toLowerCase().startsWith("fix");
                
                let badgeColor = "#f1f5f9";
                let badgeText = "#64748b";
                let badgeBorder = "#e2e8f0";
                
                if (isFeat) {
                  badgeColor = "#dcfce7";
                  badgeText = "#166534";
                  badgeBorder = "#bbf7d0";
                } else if (isFix) {
                  badgeColor = "#fee2e2";
                  badgeText = "#991b1b";
                  badgeBorder = "#fecaca";
                }

                const typeMatch = commit.msg.match(/^([^:]+):/);
                const type = typeMatch ? typeMatch[1] : "update";
                const message = typeMatch ? commit.msg.slice(typeMatch[0].length).trim() : commit.msg;

                return (
                  <div key={commit.hash} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "16px", background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: "12px", transition: "all 0.2s", ":hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.03)", borderColor: "#e2e8f0" } }}>
                    <div style={{ background: badgeColor, color: badgeText, border: `1px solid ${badgeBorder}`, padding: "4px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                      {type}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", color: "#334155", lineHeight: "1.6", fontWeight: 500 }}>
                        {message}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#94a3b8", background: "#f8fafc", padding: "4px 8px", borderRadius: "4px", border: "1px solid #f1f5f9" }}>
                      {commit.hash}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
