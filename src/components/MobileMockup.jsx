import { useState } from 'react'

export default function MobileMockup() {

  // ── paste all your const declarations here ──────────────────────────
  const NAVY="#1B2E6B",NAVY2="#243A80",TEAL="#0ABFDE",AMBER="#F59E0B",AMBERBG="#FEF3C7",DANGER="#EF4444",SUCCESS="#10B981",GRAY="#F0F2F7",BORDER="#E5E7EB",MUTED="#6B7280",TEXT="#111827";

  const SCREENS=[
    {id:"tc",label:"TC Dashboard",badge:"DA-001",bc:"#F59E0B"},
    {id:"downtime",label:"Log Downtime",badge:"DA-001",bc:"#F59E0B"},
    {id:"start",label:"Start Sequence",badge:"DA-002/003/004",bc:"#8B5CF6"},
    {id:"stop",label:"Stop Sequence",badge:"DA-002/003/004",bc:"#8B5CF6"},
    {id:"ts",label:"Timesheet View",badge:"DA-002/003/004",bc:"#8B5CF6"},
    {id:"barge",label:"Barge Attach/Detach",badge:"DA-005",bc:"#3B82F6"},
  ];

  function nb(text,bg,color,border){return`<span style="background:${bg};color:${color};border:1px solid ${border};font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px;white-space:nowrap">${text}</span>`}
  const NEW=()=>nb("NEW",AMBERBG,"#92400E",AMBER);
  const CHG=()=>nb("CHANGED","#EDE9FE","#5B21B6","#8B5CF6");
  const CALC=()=>nb("auto-calc","#E1F5EE","#065F46","#10B981");

  function hdr(user,id){return`<div style="background:${NAVY};padding:8px 14px;display:flex;align-items:center;justify-content:space-between">
    <div style="display:flex;align-items:center;gap:8px">
      <div style="width:32px;height:32px;background:white;border-radius:5px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1">
        <span style="font-size:5.5px;font-weight:800;color:${NAVY}">DIGI</span><span style="font-size:5.5px;font-weight:800;color:${NAVY}">fleet</span>
      </div>
    </div>
    <div style="text-align:right;color:white"><div style="font-size:12px;font-weight:600">${user}</div><div style="font-size:10px;opacity:0.65">${id}</div></div>
  </div>`}

  function androidNav(){return`<div style="background:#1a1a1a;padding:5px 0;display:flex;justify-content:center;gap:52px">
    <span style="color:#888;font-size:14px">|||</span><span style="color:#888;font-size:16px">&#9675;</span><span style="color:#888;font-size:14px">&#8249;</span>
  </div>`}

  function infoBar(color,borderColor,msg){return`<div style="background:${color};border:1px solid ${borderColor};border-radius:6px;padding:8px 11px;margin:10px 10px 0;font-size:11px;color:${borderColor}">${msg}</div>`}

  function mhCard(id,jetty,barge,op,trucks,extras){
    const chips=trucks.map(t=>`<span style="background:${TEAL};color:white;font-size:9px;padding:2px 6px;border-radius:3px;font-weight:700">${t}</span>`).join(" ");
    return`<div style="border-radius:7px;overflow:hidden;border:1px solid ${BORDER};flex:1 1 190px;min-width:0">
      <div style="background:#f5f5f5;padding:7px 10px;text-align:center;border-bottom:1px solid ${BORDER}">
        <div style="font-size:17px">&#128674;</div>
        <div style="font-size:9px;color:${MUTED};margin-top:1px">${barge}</div>
      </div>
      <div style="background:${NAVY};padding:6px 10px">
        <div style="color:white;font-weight:700;font-size:13px">${id}</div>
        <div style="color:#aac4ff;font-size:9px;margin-top:1px">&#8599; ${jetty}</div>
        <div style="color:#aac4ff;font-size:9px">&#128100; ${op}</div>
      </div>
      <div style="background:white;padding:8px 10px">
        <div style="font-size:9px;color:${MUTED};margin-bottom:4px">List Truck</div>
        <div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:6px">${chips||`<span style="font-size:9px;color:${MUTED}">&#8212;</span>`}</div>
        ${extras}
        <div style="display:flex;gap:5px">
          <button style="flex:1;background:${NAVY2};color:white;border:none;font-size:10px;font-weight:600;padding:5px 0;border-radius:4px">OPTION</button>
          <button style="flex:1;background:#e5e7eb;color:${MUTED};border:none;font-size:10px;font-weight:600;padding:5px 0;border-radius:4px">STOP</button>
          <button style="flex:1;background:${NAVY};color:white;border:none;font-size:10px;font-weight:700;padding:5px 0;border-radius:4px">START</button>
        </div>
      </div>
    </div>`;
  }

  function screenTC(){
    const downtimeBtn=`<div style="margin-bottom:5px;display:flex;align-items:center;gap:4px">
      <button style="flex:1;background:${AMBERBG};border:1px solid ${AMBER};color:#92400E;font-size:10px;font-weight:700;padding:4px 0;border-radius:4px">LOG DOWNTIME</button>
      ${NEW()}
    </div>`;
    const seqBtn=`<div style="margin-bottom:5px;display:flex;align-items:center;gap:4px">
      <button style="flex:1;background:#EDE9FE;border:1px solid #8B5CF6;color:#5B21B6;font-size:10px;font-weight:700;padding:4px 0;border-radius:4px">+ NEW SEQUENCE</button>
      ${NEW()}
    </div>`;
    const extras=downtimeBtn+seqBtn;
    return`<div style="flex:1;overflow:auto;background:${GRAY};padding:10px">
      ${infoBar(AMBERBG,AMBER,"<strong>DA-001 context:</strong> LOG DOWNTIME added to each MH card. + NEW SEQUENCE replaces current event-based operator logging (DA-002/003/004).")}
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
        ${mhCard("MHP0025","Jetty Futong - P1","BG. Sentosa Jaya 2308","Amrojali",["RTP0285"],extras)}
        ${mhCard("MHP0026","Jetty Futong - P2","BG. Glory Marine 7","Ricardo H.",["RTP0200"],extras)}
        ${mhCard("MHP0027","Jetty Futong - P3","BG. Glory Marine 3","&#8212;",[],extras)}
        ${mhCard("MHP0028","Jetty Futong - P5","BG. Capricorn 119 / TB. Cap 118","&#8212;",["BDP0057"],extras)}
      </div>
      <div style="text-align:right;margin-top:8px">
        <button style="background:${NAVY};color:white;border:none;border-radius:6px;padding:8px 16px;font-size:12px;font-weight:600">List Truck</button>
      </div>
    </div>`;
  }

  function screenDowntime(){
    return`<div style="flex:1;overflow:auto;background:${GRAY};padding:10px">
      ${infoBar("#E1EFFE","#1E40AF","<strong>DA-001 &#8212; New feature:</strong> Downtime logging for Mantsinen units. Accessible via LOG DOWNTIME on each MH card. Both actual_timestamp (user-entered) and save_timestamp (system) stored independently.")}
      <div style="background:white;border-radius:8px;border:1px solid ${BORDER};overflow:hidden;max-width:520px;margin:10px auto">
        <div style="background:${NAVY};padding:10px 14px;display:flex;justify-content:space-between;align-items:center">
          <div><div style="color:white;font-weight:700;font-size:14px">Log Downtime</div><div style="color:#aac4ff;font-size:10px">MHP0026 &#8212; Jetty Futong P2</div></div>
          <span style="color:white;font-size:18px;cursor:pointer">&#10005;</span>
        </div>
        <div style="padding:14px">
          <div style="margin-bottom:13px">
            <div style="font-size:10px;color:${MUTED};margin-bottom:4px">Unit (auto-filled)</div>
            <div style="background:${GRAY};border:1px solid ${BORDER};border-radius:6px;padding:8px 11px;font-size:13px">MHP0026 &#8212; Material Handler</div>
          </div>
          <div style="margin-bottom:13px">
            <div style="font-size:10px;color:${MUTED};margin-bottom:6px">Category <span style="color:${DANGER}">*</span> ${NEW()}</div>
            ${["Daily Maintenance","Preventive Service","Urgent Repair"].map((c,i)=>`
            <label style="display:flex;align-items:center;gap:10px;padding:7px 11px;border-radius:6px;border:1px solid ${i===0?NAVY:BORDER};background:${i===0?"#EFF3FF":"white"};margin-bottom:5px;cursor:pointer">
              <div style="width:15px;height:15px;border-radius:50%;border:2px solid ${i===0?NAVY:"#d1d5db"};background:${i===0?NAVY:"white"};display:flex;align-items:center;justify-content:center;flex-shrink:0">
                ${i===0?`<div style="width:5px;height:5px;border-radius:50%;background:white"></div>`:""}
              </div>
              <span style="font-size:12px;color:${i===0?NAVY:TEXT};font-weight:${i===0?600:400}">${c}</span>
            </label>`).join("")}
          </div>
          <div style="margin-bottom:13px">
            <div style="font-size:10px;color:${MUTED};margin-bottom:4px">Start Time <span style="color:${DANGER}">*</span> ${NEW()}</div>
            <div style="display:flex;gap:8px">
              <div style="flex:2;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">13/03/2026</div>
              <div style="flex:1;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">08:30</div>
            </div>
            <div style="font-size:9.5px;color:#0891B2;margin-top:3px">&#8505; Retroactive &#8212; enter actual event time, not current time</div>
          </div>
          <div style="margin-bottom:16px">
            <div style="font-size:10px;color:${MUTED};margin-bottom:4px">Stop Time <span style="font-size:9px;color:${MUTED}">(leave blank if ongoing)</span> ${NEW()}</div>
            <div style="display:flex;gap:8px">
              <div style="flex:2;background:white;border:1.5px dashed ${BORDER};border-radius:6px;padding:8px 11px;font-size:13px;color:${MUTED}">DD/MM/YYYY</div>
              <div style="flex:1;background:white;border:1.5px dashed ${BORDER};border-radius:6px;padding:8px 11px;font-size:13px;color:${MUTED}">HH:mm</div>
            </div>
          </div>
          <button style="width:100%;background:${NAVY};color:white;border:none;border-radius:6px;padding:12px 0;font-size:14px;font-weight:700">SAVE DOWNTIME</button>
        </div>
      </div>
    </div>`;
  }

  function screenStart(){
    return`<div style="flex:1;overflow:auto;background:${GRAY};padding:10px">
      ${infoBar("#EDE9FE","#5B21B6","<strong>DA-002/003/004 &#8212; Logic change:</strong> Current system logs events (ASSIGNED_OPERATOR, ACTIVITY_FINISH) &#8212; HM always 0. New: one sequence row per continuous working period with real meter readings. This is the core data model change.")}
      <div style="background:white;border-radius:8px;border:1px solid ${BORDER};overflow:hidden;max-width:520px;margin:10px auto">
        <div style="background:${NAVY};padding:10px 14px;display:flex;align-items:center;gap:8px">
          <span style="color:white;font-size:16px">&#8592;</span>
          <div><div style="color:white;font-weight:700;font-size:14px">Start New Sequence</div><div style="color:#aac4ff;font-size:10px">MHP0026 &#8212; Jetty Futong P2</div></div>
        </div>
        <div style="padding:14px">
          <div style="margin-bottom:13px">
            <div style="font-size:10px;color:${MUTED};margin-bottom:4px">Operator <span style="color:${DANGER}">*</span> ${CHG()}</div>
            <div style="background:white;border:1px solid ${BORDER};border-radius:6px;padding:9px 11px;display:flex;justify-content:space-between;align-items:center">
              <div style="display:flex;align-items:center;gap:9px">
                <div style="width:28px;height:28px;border-radius:50%;background:#E5E7EB;display:flex;align-items:center;justify-content:center;font-size:12px">&#128100;</div>
                <div><div style="font-size:13px;font-weight:600">Amrojali</div><div style="font-size:9px;color:${MUTED}">OPERATOR_MH</div></div>
              </div>
              <span style="color:${MUTED}">&#9654;</span>
            </div>
            <div style="font-size:9.5px;color:#0891B2;margin-top:3px">&#8505; Operator assigned per sequence row &#8212; not once per day</div>
          </div>
          <div style="margin-bottom:13px">
            <div style="font-size:10px;color:${MUTED};margin-bottom:4px">Start Time <span style="color:${DANGER}">*</span></div>
            <div style="display:flex;gap:8px">
              <div style="flex:2;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">13/03/2026</div>
              <div style="flex:1;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">08:30</div>
            </div>
            <div style="font-size:9.5px;color:#0891B2;margin-top:3px">&#8505; Retroactive &#8212; enter actual time operator started</div>
          </div>
          <div style="margin-bottom:13px">
            <div style="font-size:10px;color:${MUTED};margin-bottom:4px">HM Start &#8212; Hour Meter reading <span style="color:${DANGER}">*</span> ${NEW()}</div>
            <div style="display:flex;gap:8px;align-items:center">
              <div style="flex:1;background:white;border:1.5px solid ${NAVY};border-radius:6px;padding:9px 11px;font-size:16px;font-weight:700;color:${NAVY}">1,205</div>
              <span style="font-size:12px;color:${MUTED}">hours</span>
            </div>
            <div style="font-size:9.5px;color:${MUTED};margin-top:3px">Read the physical HM gauge on MHP0026 right now</div>
          </div>
          <div style="margin-bottom:16px">
            <div style="font-size:10px;color:${MUTED};margin-bottom:4px">FM Start &#8212; Fuel Meter reading <span style="color:${DANGER}">*</span> ${NEW()}</div>
            <div style="display:flex;gap:8px;align-items:center">
              <div style="flex:1;background:white;border:1.5px solid ${NAVY};border-radius:6px;padding:9px 11px;font-size:16px;font-weight:700;color:${NAVY}">4,820</div>
              <span style="font-size:12px;color:${MUTED}">litres</span>
            </div>
            <div style="font-size:9.5px;color:${MUTED};margin-top:3px">Read the physical FM gauge on MHP0026 right now</div>
          </div>
          <button style="width:100%;background:${NAVY};color:white;border:none;border-radius:6px;padding:12px 0;font-size:14px;font-weight:700">START SEQUENCE</button>
        </div>
      </div>
    </div>`;
  }

  function screenStop(){
    return`<div style="flex:1;overflow:auto;background:${GRAY};padding:10px">
      ${infoBar("#EDE9FE","#5B21B6","<strong>DA-002/003/004:</strong> TC enters finish meter readings. System calculates deltas. Multiple sequences per operator per unit per day fully supported &#8212; all stored and summed for dashboard calculations.")}
      <div style="background:white;border-radius:8px;border:1px solid ${BORDER};overflow:hidden;max-width:520px;margin:10px auto">
        <div style="background:${NAVY};padding:10px 14px;display:flex;align-items:center;gap:8px">
          <span style="color:white;font-size:16px">&#8592;</span>
          <div><div style="color:white;font-weight:700;font-size:14px">Stop Sequence</div><div style="color:#aac4ff;font-size:10px">MHP0026 &#8212; Sequence in progress</div></div>
        </div>
        <div style="padding:14px">
          <div style="background:#ECFDF5;border:1px solid ${SUCCESS};border-radius:6px;padding:9px 11px;margin-bottom:13px;display:flex;justify-content:space-between;align-items:center">
            <div><div style="font-size:12px;color:#065F46;font-weight:700">&#9679; Active &#8212; Amrojali</div><div style="font-size:10px;color:#047857;margin-top:1px">Started: 08:30 &nbsp;&#183;&nbsp; Running: 2h 15m</div></div>
          </div>
          <div style="border:1px solid ${BORDER};border-radius:6px;overflow:hidden;margin-bottom:13px">
            <div style="display:grid;grid-template-columns:110px 1fr 1fr;background:${GRAY}">
              <div style="padding:7px 9px;font-size:10px;color:${MUTED};font-weight:600"></div>
              <div style="padding:7px 9px;font-size:10px;color:${MUTED};font-weight:600;border-left:1px solid ${BORDER};text-align:center">START (locked)</div>
              <div style="padding:7px 9px;font-size:10px;color:${MUTED};font-weight:600;border-left:1px solid ${BORDER};text-align:center">FINISH</div>
            </div>
            ${[["HM (hours)","1,205","1,217",false],["FM (litres)","4,820","4,965",true]].map(([lbl,s,f,isNew])=>`
            <div style="display:grid;grid-template-columns:110px 1fr 1fr;border-top:1px solid ${BORDER}">
              <div style="padding:9px;font-size:11px;color:${TEXT};font-weight:500;display:flex;align-items:center;gap:4px">${lbl}${isNew?` ${NEW()}`:""}</div>
              <div style="padding:9px;border-left:1px solid ${BORDER};background:#F9FAFB;display:flex;align-items:center;justify-content:center"><span style="font-size:14px;font-weight:600;color:${MUTED}">${s}</span></div>
              <div style="padding:6px;border-left:1px solid ${BORDER};display:flex;align-items:center;justify-content:center">
                <div style="background:white;border:1.5px solid ${NAVY};border-radius:5px;padding:6px 10px;font-size:14px;font-weight:700;color:${NAVY};min-width:65px;text-align:center">${f}</div>
              </div>
            </div>`).join("")}
            <div style="display:grid;grid-template-columns:110px 1fr 1fr;border-top:1px solid ${BORDER};background:#F0F9FF">
              <div style="padding:8px 9px;font-size:10px;color:#0369A1;font-weight:600">Delta ${CALC()}</div>
              <div style="padding:8px 9px;border-left:1px solid ${BORDER};text-align:center;font-size:13px;font-weight:700;color:#0369A1">&#916; HM = 12h</div>
              <div style="padding:8px 9px;border-left:1px solid ${BORDER};text-align:center;font-size:13px;font-weight:700;color:#0369A1">&#916; FM = 145 L</div>
            </div>
          </div>
          <div style="margin-bottom:16px">
            <div style="font-size:10px;color:${MUTED};margin-bottom:4px">Stop Time <span style="color:${DANGER}">*</span></div>
            <div style="display:flex;gap:8px">
              <div style="flex:2;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">13/03/2026</div>
              <div style="flex:1;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">10:45</div>
            </div>
            <div style="font-size:9.5px;color:#0891B2;margin-top:3px">&#8505; Retroactive &#8212; enter actual time operator stopped</div>
          </div>
          <button style="width:100%;background:${DANGER};color:white;border:none;border-radius:6px;padding:12px 0;font-size:14px;font-weight:700">STOP SEQUENCE</button>
        </div>
      </div>
    </div>`;
  }

  function screenTS(){
    const rows=[
      {op:"Amrojali",s:"08:30",e:"10:45",hms:1205,hmf:1217,fms:4820,fmf:4965},
      {op:"Budi",s:"11:00",e:"13:30",hms:1217,hmf:1229,fms:4965,fmf:5112},
      {op:"Amrojali",s:"14:00",e:"16:30",hms:1229,hmf:1241,fms:5112,fmf:5258},
    ];
    const rowsHTML=rows.map((r,i)=>`<tr style="background:${i%2===0?"white":"#FAFAFA"}">
      <td style="font-weight:600;color:${NAVY}">${r.op}</td>
      <td>${r.s}</td><td>${r.e}</td>
      <td>${r.hms.toLocaleString()}</td><td>${r.hmf.toLocaleString()}</td>
      <td style="font-weight:700;color:#0891B2">${r.hmf-r.hms}h</td>
      <td>${r.fms.toLocaleString()}</td><td>${r.fmf.toLocaleString()}</td>
      <td style="font-weight:700;color:#0891B2">${r.fmf-r.fms} L</td>
    </tr>`).join("");
    const hdrCols=[
      {l:"Operator",nc:"CHG"},{l:"Start",nc:""},{l:"Stop",nc:""},
      {l:"HM Start",nc:"NEW"},{l:"HM Finish",nc:"NEW"},{l:"&Delta; HM",nc:"CALC"},
      {l:"FM Start",nc:"NEW"},{l:"FM Finish",nc:"NEW"},{l:"&Delta; FM",nc:"CALC"},
    ];
    const thCells=hdrCols.map(c=>`<th>${c.l}${c.nc==="NEW"?` ${NEW()}`:c.nc==="CHG"?` ${CHG()}`:c.nc==="CALC"?` ${CALC()}`:""}</th>`).join("");
    return`<div style="flex:1;overflow:auto;background:${GRAY};padding:10px">
      ${infoBar("#EDE9FE","#5B21B6","<strong>Logic change &#8212; this is the critical one:</strong> Current system logs events with HM = 0 on every row. New system logs sequences with real meter readings per row. Without this change, DB-002 through DB-007 cannot compute.")}
      <div style="background:white;border-radius:8px;border:1px solid ${BORDER};overflow:hidden;margin-top:10px">
        <div style="background:${NAVY};padding:9px 14px;display:flex;justify-content:space-between;align-items:center">
          <div><div style="color:white;font-weight:700;font-size:13px">MH Timesheet &#8212; MHP0026</div><div style="color:#aac4ff;font-size:10px">13 March 2026 &nbsp;&#183;&nbsp; 3 sequences</div></div>
          ${CHG()}
        </div>
        <div style="overflow-x:auto">
          <table><thead><tr>${thCells}</tr></thead><tbody>${rowsHTML}</tbody>
            <tfoot><tr style="background:#F0F9FF;border-top:2px solid #BAE6FD">
              <td colspan="5" style="font-weight:700;color:#0369A1;font-size:12px">TOTALS</td>
              <td style="font-weight:700;color:#0369A1">36h</td>
              <td colspan="2"></td>
              <td style="font-weight:700;color:#0369A1">438 L</td>
            </tr></tfoot>
          </table>
        </div>
        <div style="background:${AMBERBG};border-top:1px solid ${BORDER};padding:9px 14px;font-size:10.5px;color:#92400E">
          <strong>Current system produces instead:</strong> Rows = events (ASSIGNED_OPERATOR, ACTIVITY_FINISH, CHANGE_LOCATION) with S.HM = 0, E.HM = 0, T.HM = 0 on every single row. No meaningful KPI can be derived from this.
        </div>
      </div>
    </div>`;
  }

  function screenBarge(){
    return`<div style="flex:1;overflow:auto;background:${GRAY};padding:10px">
      ${infoBar("#E1EFFE","#1E40AF","<strong>DA-005 &#8212; New feature:</strong> Barge attach and detach timestamps. TC records both events with actual times (retroactive supported). Duration = Detach &#8722; Attach feeds DB-008 Barge Unloading Time.")}
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px">
        <div style="flex:1 1 240px;background:white;border-radius:8px;border:1px solid ${BORDER};overflow:hidden">
          <div style="background:${NAVY};padding:10px 14px"><div style="color:white;font-weight:700;font-size:14px">Attach Barge</div><div style="color:#aac4ff;font-size:10px">MHP0026 &#8212; Jetty Futong P2</div></div>
          <div style="padding:14px">
            <div style="background:#f5f5f5;border-radius:6px;padding:9px 11px;margin-bottom:12px;display:flex;align-items:center;gap:10px">
              <span style="font-size:20px">&#128674;</span>
              <div><div style="font-size:12px;font-weight:600">BG. Glory Marine 12 / TB. HB 9</div><div style="font-size:10px;color:${MUTED}">Jumbo</div></div>
            </div>
            <div style="margin-bottom:12px">
              <div style="font-size:10px;color:${MUTED};margin-bottom:4px">Attach Time <span style="color:${DANGER}">*</span> ${NEW()}</div>
              <div style="display:flex;gap:8px">
                <div style="flex:2;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">13/03/2026</div>
                <div style="flex:1;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">08:00</div>
              </div>
              <div style="font-size:9.5px;color:#0891B2;margin-top:3px">&#8505; Retroactive entry supported</div>
            </div>
            <button style="width:100%;background:${NAVY};color:white;border:none;border-radius:6px;padding:11px 0;font-size:13px;font-weight:700">ATTACH BARGE</button>
          </div>
        </div>
        <div style="flex:1 1 240px;background:white;border-radius:8px;border:1px solid ${SUCCESS};overflow:hidden">
          <div style="background:${NAVY};padding:10px 14px"><div style="color:white;font-weight:700;font-size:14px">Barge Status / Detach</div><div style="color:#aac4ff;font-size:10px">MHP0026 &#8212; barge already attached</div></div>
          <div style="padding:14px">
            <div style="background:#ECFDF5;border:1px solid ${SUCCESS};border-radius:6px;padding:9px 11px;margin-bottom:12px">
              <div style="font-size:12px;color:#065F46;font-weight:700">&#9679; ATTACHED since 08:00</div>
              <div style="font-size:11px;color:#047857;margin-top:2px">BG. Capricorn 119 / TB. Capricorn 118</div>
              <div style="font-size:11px;color:#047857">Running duration: 2h 30m</div>
            </div>
            <div style="margin-bottom:12px">
              <div style="font-size:10px;color:${MUTED};margin-bottom:4px">Detach Time <span style="color:${DANGER}">*</span> ${NEW()}</div>
              <div style="display:flex;gap:8px">
                <div style="flex:2;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">13/03/2026</div>
                <div style="flex:1;background:white;border:1px solid ${NAVY};border-radius:6px;padding:8px 11px;font-size:13px">10:30</div>
              </div>
              <div style="font-size:9.5px;color:#0891B2;margin-top:3px">Duration: 10:30 &#8722; 08:00 = <strong>2h 30m</strong> &rarr; DB-008</div>
            </div>
            <button style="width:100%;background:${DANGER};color:white;border:none;border-radius:6px;padding:11px 0;font-size:13px;font-weight:700">DETACH BARGE</button>
          </div>
        </div>
      </div>
    </div>`;
  }
  // ────────────────────────────────────────────────────────────────────

  const [active, setActive] = useState('tc')

  const screens = {
    tc: screenTC,
    downtime: screenDowntime,
    start: screenStart,
    stop: screenStop,
    ts: screenTS,
    barge: screenBarge,
  }

  const tabs = SCREENS.map(s => (
    <button
      key={s.id}
      onClick={() => setActive(s.id)}
      style={{
        padding: '5px 10px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        border: active === s.id ? `2px solid ${s.bc}` : '1px solid #E5E7EB',
        background: active === s.id ? 'white' : '#F0F2F7',
        fontWeight: active === s.id ? 700 : 400,
      }}
    >
      <span style={{ background: s.bc, color: 'white', fontSize: '8px', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>
        {s.badge}
      </span>
      {s.label}
    </button>
  ))

  const screenFn = screens[active] || screenTC
  const screenHTML = screenFn()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#F0F2F7', padding: '12px', borderRadius: '12px' }}>

      {/* Page header */}
      <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1B2E6B' }}>Digifleet Mobile — DA Enhancement Mockups</div>
          <div style={{ fontSize: '11px', color: '#6B7280' }}>FLS BRD Addendum · Traffic Controller module · New and changed screens</div>
        </div>
        <div style={{ fontSize: '10px', color: '#6B7280' }}>March 2026</div>
      </div>

      {/* Tab row */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
        {tabs}
      </div>

      {/* Device frame - LANDSCAPE */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '20px 0',
        background: '#f1f5f9',
        borderRadius: '12px'
      }}>
        <div style={{ 
          background: '#2a2a2a', 
          borderRadius: '32px', 
          padding: '12px', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          width: '840px',
          height: '440px',
          position: 'relative'
        }}>
          {/* Hardware bezel details */}
          <div style={{ position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)', width: '4px', height: '40px', background: '#444', borderRadius: '2px' }} />
          
          <div style={{ 
            background: 'white', 
            borderRadius: '24px', 
            overflow: 'hidden', 
            display: 'flex', 
            flexDirection: 'column', 
            width: '100%',
            height: '100%',
            border: '2px solid #000'
          }}>
            <div dangerouslySetInnerHTML={{ __html: hdr('Rindam Manihuruk', '20031492') }} />
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div dangerouslySetInnerHTML={{ __html: screenHTML }} style={{ flex: 1, overflowY: 'auto' }} />
            </div>
            <div dangerouslySetInnerHTML={{ __html: androidNav() }} />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '9px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          ['NEW field', '#FEF3C7', '#92400E', '#F59E0B'],
          ['CHANGED logic', '#EDE9FE', '#5B21B6', '#8B5CF6'],
          ['Auto-calculated', '#E1F5EE', '#065F46', '#10B981'],
        ].map(([label, bg, color, border]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10.5px', color: '#6B7280' }}>
            <div style={{ width: '11px', height: '11px', borderRadius: '2px', background: bg, border: `1px solid ${border}` }} />
            {label}
          </div>
        ))}
      </div>

    </div>
  )
}
