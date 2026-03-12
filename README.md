# FLS Operations Dashboard

A real-time performance monitoring dashboard for the **Futong Loading System (FLS)**. This application provides critical performance metrics for the Port Department, enabling data-driven operational decisions.

## 🚀 Features

- **11 Performance Dashboards**: Covering Availability, Utilization, Loading Rates, Fuel Efficiency, and Barge Turnaround.
- **Dynamic Target Configuration**: Admin-controlled daily and monthly delivery targets.
- **Real-time Metrics**: Fleet-wide averages and unit-specific performance tracking.
- **Max-C Integration**: Automated tonnage tracking with unweighed load alerts.
- **Visual Analytics**: Interactive charts using Recharts and smooth CSS animations.

## 🗺️ Supporting Diagrams

The dashboard includes a dedicated **Diagrams Section** (accessible via the glowing button in the sidebar) which hosts comprehensive documentation:

- **⓪ Sequence Diagram**: End-to-end data capture flow across all system actors.
- **① System Context**: Overview of the FLS ecosystem and external integrations (Max-C, TRMS, SAP).
- **② Swimlane Process**: Detailed operational workflow and decision points.
- **③ ERD**: Data model showing entity relationships and new DA requirements.
- **④ Data Flow (DFD)**: The journey of NETWEIGHT data from weighbridge to dashboard.

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS + custom design system
- **Charts**: Recharts
- **Documentation**: Mermaid.js for diagrams

## 📦 Deployment

The project is configured for deployment to GitHub Pages.

```bash
npm run deploy
```

---
© 2026 PTSI · Fleet Dispatch System v2.0
