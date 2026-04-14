import { useState, useCallback } from "react";

// ═══ DESIGN TOKENS ═══
const C = {
  tealDark: "#1B3A3A",
  teal: "#00897B",
  tealLight: "#E0F2F1",
  green: "#4CAF50",
  greenBright: "#43A047",
  calGreen: "#43C759",
  orange: "#F57C00",
  red: "#D32F2F",
  amber: "#FFA000",
  blue: "#1976D2",
  g50: "#FAFAFA",
  g100: "#F5F5F5",
  g200: "#EEEEEE",
  g300: "#E0E0E0",
  g400: "#BDBDBD",
  g500: "#9E9E9E",
  g600: "#757575",
  g700: "#616161",
  g800: "#424242",
  white: "#FFFFFF",
};

// ═══ ANNOTATIONS DATA ═══
const annotations = {
  home: {
    title: "Screen 1: Home",
    description: "The tech's landing screen. Unchanged from today except that recently viewed items may include tickets once the feature ships.",
    components: [
      "SiteTracker header — logo, org URL, notification bell, profile icon",
      "Search bar",
      "Calendar widget — week strip with current day highlighted, calendar events below as green cards. Tapping a calendar event navigates to the Job Event screen.",
      "Recently Viewed (20) — list of recently accessed records with icon, name, and subtitle",
      "My Favorites — favorited records",
      "My Forms — forms assigned to the tech",
    ],
    interactions: [
      "Tap calendar event → Job Event Screen",
      "Bottom tabs: HOME (active) | MAP | MENU",
    ],
    isNew: false,
  },
  map: {
    title: "Screen 2: Map",
    description: "The existing map experience. No changes for V1.",
    components: [
      "SiteTracker header",
      "Site filter bar — \"All Sites\" with dropdown",
      "Search bar overlaid on map with filter icon",
      "Map — showing the tech's region with site pins",
      "Map controls — layers toggle, add button (teal FAB), location button, info button",
    ],
    interactions: [
      "Bottom tabs: HOME | MAP (active) | MENU",
    ],
    isNew: false,
  },
  jobEvent: {
    title: "Screen 3: Job Event",
    description: "The primary screen a tech interacts with for their assigned work. The originating ticket card is the key addition.",
    components: [
      "Job ID — \"J-000382\" as page title",
      "Map card — small map thumbnail, site name + address, \"Start Directions\" button",
      "View Job Details — teal link with chevron",
      "Job Execution — teal link with chevron",
      "Schedule card — date and time range",
      "My Timetracking card — status dropdown, \"View Time Entries\" link",
      "🆕 Originating Ticket card — ticket ID, status badge, priority badge, title, description snippet, photo thumbnails, \"View ticket →\" link",
      "Asset card — asset name, recurring issue badge (e.g. \"4 tickets / 6mo\")",
      "Forms, Photos & Files, Inventory cards",
    ],
    interactions: [
      "Tap \"View Job Details\" → Job Details",
      "Tap \"Job Execution\" → Job Execution",
      "Tap \"View ticket →\" → Ticket Detail",
      "Tap + button → Quick Actions overlay with Create Ticket option (NEW)",
    ],
    isNew: true,
    newFeature: "Originating Ticket card + Create Ticket quick action",
  },
  jobDetails: {
    title: "Screen 4: Job Details",
    description: "Existing screen, no changes. Included for journey completeness.",
    components: [
      "Tabs: Job Information (active) | Related",
      "Job Information tab — accordion sections: Information (expanded), Text, Resources, Scheduling, Related Information, Contract Agreement & SLA, System Information",
      "Information section fields: Job Name, Job Template, Site, Job Status, Field Asset, Priority, Customer Contact, Job Type",
      "Related tab sections: Inventory Transactions, Job Tasks, Job Items, Forms, Calendar Events, Jobs, Production Line Allocations, Production Work Logs",
    ],
    interactions: [
      "Back arrow → Job Event Screen",
      "No bottom tabs (detail screen)",
    ],
    isNew: false,
  },
  jobExecution: {
    title: "Screen 5: Job Execution",
    description: "Existing screen, no changes. Included for journey completeness.",
    components: [
      "Same execution-related cards as Job Event screen:",
      "Schedule, My Timetracking, Forms, Photos & Files, Inventory",
    ],
    interactions: [
      "Back arrow → Job Event Screen",
      "No bottom tabs (detail screen)",
    ],
    isNew: false,
  },
  menu: {
    title: "Screen 6: Menu",
    description: "Existing menu with Tickets added as a new item.",
    components: [
      "SiteTracker header",
      "Menu items: Favorites, Sites, Projects, Jobs, 🆕 Tickets, Forms, Expense Reports, Job Items",
    ],
    interactions: [
      "Tap Jobs → Jobs List",
      "Tap Tickets (NEW) → Tickets List",
      "Bottom tabs: HOME | MAP | MENU (active)",
    ],
    isNew: true,
    newFeature: "Tickets menu item",
  },
  jobsList: {
    title: "Screen 7: Jobs List",
    description: "Existing screen, no changes. Included for journey completeness.",
    components: [
      "Search bar: \"Search jobs\"",
      "Job cards: Job ID, Job Template, Customer, Site, Field Asset",
    ],
    interactions: [
      "Tap job card → Job Event Screen",
      "Bottom tabs: HOME | MAP | MENU (active)",
    ],
    isNew: false,
  },
  ticketsList: {
    title: "Screen 8: Tickets List",
    description: "New screen for browsing tickets. Follows the same list pattern as the Jobs list.",
    components: [
      "Search bar: \"Search tickets\"",
      "Filter chips (horizontal scroll): All, Open, My Created, Urgent",
      "Ticket cards with: Ticket ID + status badge, priority badge, title, asset · site, job count, photo count, time ago",
    ],
    interactions: [
      "Tap ticket card → Ticket Detail",
      "Tap + button → Create Ticket",
      "Filter chips filter the list",
      "Bottom tabs: HOME | MAP | MENU (active)",
    ],
    isNew: true,
    newFeature: "Entire screen is new",
  },
  ticketDetail: {
    title: "Screen 9: Ticket Detail",
    description: "Full ticket view. Follows the same two-tab pattern as Job Details.",
    components: [
      "Tabs: Ticket Information (active) | Related",
      "Summary card — Status, Priority, Source, Category, Assigned To",
      "Description card — title, description text, Customer Comments (italic with amber accent)",
      "Photos & Attachments card",
      "Ticket Details card — Ticket Number, Customer, Contact, Site, Field Asset, Ticket Template",
      "Dates card — Reported Date, Due Date, Preferred Start",
      "Related tab: Jobs, Contact Details, Site Details, Field Asset Details, Contract Agreement & SLA",
    ],
    interactions: [
      "Back arrow → Tickets List",
      "No bottom tabs (detail screen)",
    ],
    isNew: true,
    newFeature: "Entire screen is new",
  },
  createTicket: {
    title: "Screen 10: Create Ticket",
    description: "Optimized for speed — a tech should complete this in under 60 seconds.",
    components: [
      "Quick Capture bar — Photo, Voice, Scan QR shortcut buttons",
      "Form fields: Title*, Description, Link Asset*, Priority*, Category, Photos",
      "Site (auto-populated from job context)",
      "Dual-mode submit: \"Send to Dispatch\" (teal) | \"Create Job Now\" (orange)",
    ],
    interactions: [
      "Toggle between Dispatch and Job mode",
      "Submit Ticket or Submit & Start Job",
      "Back arrow → Job Event Screen",
      "No bottom tabs (creation screen)",
    ],
    isNew: true,
    newFeature: "Entire screen is new",
  },
};

// Screen order for navigation
const screenOrder = [
  "home", "map", "jobEvent", "jobDetails", "jobExecution",
  "menu", "jobsList", "ticketsList", "ticketDetail", "createTicket",
];

// ═══ SHARED PHONE COMPONENTS ═══
function StatusBar() {
  return (
    <div style={{ height: 44, background: C.tealDark, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
      <span style={{ color: C.white, fontSize: 14, fontWeight: 600 }}>2:45</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="14" height="10" viewBox="0 0 16 12"><rect x="0" y="6" width="3" height="6" fill="#fff"/><rect x="4" y="4" width="3" height="8" fill="#fff"/><rect x="8" y="2" width="3" height="10" fill="#fff"/><rect x="12" y="0" width="3" height="12" fill="#fff" opacity=".3"/></svg>
        <div style={{ width: 22, height: 10, border: "1.5px solid rgba(255,255,255,0.5)", borderRadius: 3, position: "relative", marginLeft: 2 }}>
          <div style={{ position: "absolute", left: 1.5, top: 1.5, bottom: 1.5, width: "35%", background: C.red, borderRadius: 1 }}/>
        </div>
      </div>
    </div>
  );
}

function NavBar({ title, showPlus, showStar, showBack, onBack, onPlus, leftContent }) {
  return (
    <div style={{ height: 44, background: C.tealDark, display: "flex", alignItems: "center", padding: "0 12px", flexShrink: 0 }}>
      {showBack && <button onClick={onBack} style={{ background: "none", border: "none", color: C.white, fontSize: 24, cursor: "pointer", padding: "0 4px", lineHeight: 1 }}>‹</button>}
      {leftContent || <div style={{ flex: 1, color: C.white, fontSize: 14, fontWeight: 500, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 8px" }}>{title}</div>}
      {showStar && <span style={{ color: C.white, fontSize: 18, padding: "0 6px", cursor: "pointer" }}>☆</span>}
      {showPlus && <button onClick={onPlus} style={{ background: "none", border: "none", color: C.white, fontSize: 24, cursor: "pointer", padding: "0 4px", lineHeight: 1 }}>+</button>}
    </div>
  );
}

function SiteTrackerHeader() {
  return (
    <div style={{ background: C.tealDark, padding: "6px 14px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
      <div>
        <div style={{ color: C.white, fontSize: 17, fontWeight: 800, letterSpacing: 1.5 }}>SITETR▲CKER</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 1 }}>chandraorg.my.salesforce.com</div>
      </div>
      <div style={{ display: "flex", gap: 16 }}>
        <span style={{ color: C.white, fontSize: 18, cursor: "pointer" }}>🔔</span>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <span style={{ color: C.white, fontSize: 14 }}>👤</span>
        </div>
      </div>
    </div>
  );
}

function BottomTabs({ active, onTab }) {
  const tabs = [
    { id: "home", label: "HOME" },
    { id: "map", label: "MAP" },
    { id: "menu", label: "MENU" },
  ];
  return (
    <div style={{ height: 54, display: "flex", borderTop: `1px solid ${C.g300}`, background: C.white, flexShrink: 0 }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 2, border: "none", cursor: "pointer", background: isActive ? C.tealLight : C.white,
            borderRadius: isActive ? 8 : 0, margin: isActive ? 3 : 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive ? C.teal : C.g500} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {t.id === "menu" ? <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></> :
               t.id === "home" ? <path d="M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10" fill={isActive ? C.teal : "none"}/> :
               <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></>}
            </svg>
            <span style={{ fontSize: 9, fontWeight: 700, color: isActive ? C.teal : C.g500, letterSpacing: 0.5 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function StatusBadge({ status, size = "sm" }) {
  const m = { New: C.blue, Logged: C.blue, Open: C.orange, "In Progress": C.teal, Closed: C.green, Urgent: C.red, "Checked-In": C.green };
  const c = m[status] || C.g500;
  return <span style={{ background: c + "18", color: c, fontSize: size === "sm" ? 9 : 11, fontWeight: 600, padding: size === "sm" ? "2px 6px" : "2px 8px", borderRadius: 10, whiteSpace: "nowrap" }}>{status}</span>;
}

function PriorityBadge({ priority }) {
  const m = { Urgent: C.red, High: C.orange, Medium: C.amber, Low: C.green };
  const c = m[priority] || C.g400;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, color: c, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: c }}/>{priority}</span>;
}

function SectionCard({ icon, title, count, children, style }) {
  return (
    <div style={{ margin: "6px 14px", background: C.white, borderRadius: 8, border: `1px solid ${C.g300}`, padding: 12, ...style }}>
      {(icon || title) && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: children ? 8 : 0 }}>
        {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: C.g800, textTransform: "uppercase" }}>{title}{count !== undefined ? ` (${count})` : ""}</span>
      </div>}
      {children}
    </div>
  );
}

function AccordionRow({ label, isOpen, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 14px", background: C.white, border: "none", borderBottom: `1px solid ${C.g200}`,
      cursor: "pointer", textAlign: "left",
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.g800 }}>{isOpen ? "▾" : "▸"} {label}</span>
    </button>
  );
}

function RecentItem({ icon, bgColor, name, subtitle, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
      background: C.white, border: "none", borderBottom: `1px solid ${C.g100}`,
      cursor: "pointer", width: "100%", textAlign: "left",
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 6, background: bgColor || C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: C.white, flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.g800 }}>{name}</div>
        <div style={{ fontSize: 11, color: C.g600 }}>{subtitle}</div>
      </div>
    </button>
  );
}

function MenuItem({ icon, label, isNew, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", margin: "0 10px 5px",
      borderRadius: 8, border: isNew ? `2px solid ${C.orange}` : `1px solid ${C.g200}`,
      background: isNew ? "#FFF8F0" : C.white, cursor: "pointer", width: "calc(100% - 20px)", textAlign: "left",
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: isNew ? "#FFF3E0" : C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: isNew ? C.orange : C.white, flexShrink: 0 }}>{icon}</div>
      <span style={{ fontSize: 14, fontWeight: 500, color: C.g800, flex: 1 }}>{label}</span>
      {isNew && <span style={{ fontSize: 9, fontWeight: 700, color: C.orange, background: "#FFF3E0", padding: "2px 8px", borderRadius: 10 }}>NEW</span>}
    </button>
  );
}

// ═══ SCREENS ═══
function HomeScreen({ nav }) {
  return (
    <>
      <SiteTrackerHeader />
      <div style={{ flex: 1, overflow: "auto", background: C.g100 }}>
        <div style={{ padding: "8px 14px", background: C.white }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: `1px solid ${C.g300}`, borderRadius: 6 }}>
            <span style={{ color: C.g400, fontSize: 14 }}>🔍</span>
            <span style={{ color: C.g400, fontSize: 13 }}>Search...</span>
          </div>
        </div>
        <div style={{ margin: "6px 14px", background: C.white, borderRadius: 8, border: `1px solid ${C.g300}`, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px 6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13 }}>📅</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: C.g800 }}>CALENDAR</span>
            </div>
          </div>
          <div style={{ display: "flex", padding: "4px 12px 6px" }}>
            {[{d:"S",n:"12"},{d:"M",n:"13",active:true},{d:"T",n:"14",today:true},{d:"W",n:"15"},{d:"T",n:"16"},{d:"F",n:"17"},{d:"S",n:"18"}].map((day,i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: day.today ? C.teal : C.g500, fontWeight: 600, marginBottom: 3 }}>{day.d}</div>
                {day.active ? (
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.teal, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, margin: "0 auto" }}>{day.n}</div>
                ) : (
                  <div style={{ fontSize: 12, fontWeight: day.today ? 700 : 500, color: day.today ? C.teal : C.g800, lineHeight: "26px" }}>{day.n}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ padding: "0 12px 12px" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ textAlign: "center", paddingTop: 3 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.g800, lineHeight: 1 }}>13</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: C.g600 }}>MON</div>
              </div>
              <button onClick={() => nav("jobEvent")} style={{
                flex: 1, background: C.calGreen, borderRadius: 8, padding: "10px 12px",
                border: "none", cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white, lineHeight: 1.3 }}>Event: J-000382: Automated Jobs</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 3 }}>Checked-In</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>4:19 PM - 5:19 PM</div>
              </button>
            </div>
          </div>
          <button style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", borderTop: `1px solid ${C.g200}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>View Full Calendar</span>
            <span style={{ color: C.teal, fontSize: 12 }}>›</span>
          </button>
        </div>
        <div style={{ margin: "6px 14px", background: C.white, borderRadius: 8, border: `1px solid ${C.g300}`, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px" }}>
            <span style={{ fontSize: 13 }}>🕐</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: C.g800 }}>RECENTLY VIEWED (20)</span>
          </div>
          <RecentItem icon="🔒" bgColor={C.teal} name="J-000382" subtitle="Job Template:" onClick={() => nav("jobEvent")} />
          <RecentItem icon="📡" bgColor={C.teal} name="Morinville" subtitle="Site Type: Macro" />
          <RecentItem icon="📁" bgColor={C.teal} name="P-002866" subtitle="Site Name: Fruitvale" />
          <button style={{ width: "100%", padding: "10px 12px", background: "none", border: "none", borderTop: `1px solid ${C.g200}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>View Full List</span>
            <span style={{ color: C.teal, fontSize: 12 }}>›</span>
          </button>
        </div>
        <div style={{ margin: "6px 14px", background: C.white, borderRadius: 8, border: `1px solid ${C.g300}`, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 12px" }}>
            <span style={{ fontSize: 13 }}>⭐</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: C.g800 }}>MY FAVORITES (3)</span>
          </div>
          <RecentItem icon="📡" bgColor={C.teal} name="GA – Calhoun – Buc-ee's" subtitle="Site Type: Convenience Shop" />
          <RecentItem icon="🔒" bgColor={C.teal} name="J-003520" subtitle="Job Template: PM Quarterly" />
        </div>
        <div style={{ height: 16 }}/>
      </div>
    </>
  );
}

function MapScreen() {
  return (
    <>
      <SiteTrackerHeader />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.g100 }}>
        <div style={{ padding: "6px 14px", background: C.white, borderBottom: `1px solid ${C.g300}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", border: `1px solid ${C.g300}`, borderRadius: 6 }}>
            <span style={{ fontSize: 13, color: C.g800 }}>All Sites</span>
            <span style={{ marginLeft: "auto", color: C.g500 }}>›</span>
          </div>
        </div>
        <div style={{ flex: 1, position: "relative", background: "#E8E4D8" }}>
          <div style={{ position: "absolute", top: 8, left: 8, right: 8, display: "flex", gap: 6, zIndex: 2 }}>
            <div style={{ flex: 1, padding: "6px 10px", background: C.white, borderRadius: 6, border: `1px solid ${C.g300}`, fontSize: 12, color: C.g400 }}>Search</div>
            <div style={{ width: 32, height: 32, background: C.white, borderRadius: 6, border: `1px solid ${C.g300}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔍</div>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, #C8E6C9 0%, #A5D6A7 30%, #81C784 60%, #E8E4D8 100%)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: C.g800 }}>Bengaluru</div>
                  <div style={{ fontSize: 10, color: C.g600, marginTop: 3 }}>12 sites in view</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", right: 10, top: 50, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.white, boxShadow: "0 2px 6px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📑</div>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.teal, boxShadow: "0 2px 6px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: C.white, fontSize: 22, fontWeight: 300 }}>+</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function JobEventScreen({ nav }) {
  const [showQA, setShowQA] = useState(false);
  return (
    <>
      <NavBar title="Event: J-000382" showBack showStar showPlus onBack={() => nav("home")} onPlus={() => setShowQA(true)} />
      <div style={{ flex: 1, overflow: "auto", background: C.g100 }}>
        <div style={{ padding: "10px 14px 0", background: C.white }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.g800 }}>J-000382</div>
        </div>
        <div style={{ display: "flex", background: C.white, padding: "6px 0 12px" }}>
          <div style={{ width: 110, height: 80, background: "linear-gradient(135deg, #C8E6C9 0%, #81C784 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 14, borderRadius: 6 }}>
            <div style={{ width: 16, height: 22, background: C.g800, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", position: "relative" }}>
              <div style={{ width: 5, height: 5, background: C.white, borderRadius: "50%", position: "absolute", top: 5, left: 5.5 }}/>
            </div>
          </div>
          <div style={{ flex: 1, padding: "4px 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.g800 }}>Morinville</div>
            <div style={{ fontSize: 11, color: C.g600, marginBottom: 8 }}>Morinville, AB</div>
            <button style={{ padding: "6px 14px", border: `1px solid ${C.g400}`, borderRadius: 5, background: C.white, fontSize: 11, color: C.g800, cursor: "pointer" }}>
              ↗ Start Directions
            </button>
          </div>
        </div>
        <button onClick={() => nav("jobDetails")} style={{ width: "100%", padding: "12px 14px", border: "none", background: C.white, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderTop: `1px solid ${C.g200}` }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>View Job Details</span>
          <span style={{ color: C.teal, fontSize: 16 }}>›</span>
        </button>
        <button onClick={() => nav("jobExecution")} style={{ width: "100%", padding: "12px 14px", border: "none", background: C.white, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderTop: `1px solid ${C.g200}` }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>Job Execution</span>
          <span style={{ color: C.teal, fontSize: 16 }}>›</span>
        </button>
        <SectionCard icon="📅" title="Schedule">
          <div style={{ fontSize: 12, color: C.g800 }}>Monday, 13 April 2026</div>
          <div style={{ fontSize: 12, color: C.g800 }}>4:19 PM - 5:19 PM</div>
        </SectionCard>
        <SectionCard icon="📊" title="My Timetracking">
          <div style={{ display: "flex", alignItems: "center", padding: "6px 10px", border: `1px solid ${C.g200}`, borderRadius: 5, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%" }}/>
              <span style={{ fontSize: 12, color: C.g800 }}>Checked-In</span>
            </div>
            <span style={{ color: C.g400, fontSize: 10 }}>▾</span>
          </div>
        </SectionCard>

        {/* ORIGINATING TICKET CARD */}
        <div style={{ margin: "6px 14px", borderRadius: 8, border: `1px solid ${C.g300}`, background: C.white, overflow: "hidden" }}>
          <div style={{ padding: "10px 12px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 13 }}>🎫</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: C.g800, textTransform: "uppercase" }}>Originating Ticket</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.g800 }}>T-0000002</span>
                <StatusBadge status="In Progress" />
              </div>
              <PriorityBadge priority="High" />
            </div>
          </div>
          <div style={{ padding: "0 12px" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.g800, marginBottom: 2 }}>Payment terminal has a security violation</div>
            <div style={{ fontSize: 11, color: C.g600, lineHeight: 1.4, marginBottom: 6 }}>Customers reporting that several chargers are not functioning correctly...</div>
          </div>
          <div style={{ padding: "0 12px", display: "flex", gap: 5, marginBottom: 8 }}>
            {[1,2].map(i => <div key={i} style={{ width: 40, height: 40, borderRadius: 5, background: C.g200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.g400 }}>📷</div>)}
            <div style={{ width: 40, height: 40, borderRadius: 5, background: C.g100, border: `1px dashed ${C.g400}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.g600 }}>+1</div>
          </div>
          <button onClick={() => nav("ticketDetail")} style={{ width: "100%", padding: "8px 12px", background: "none", border: "none", borderTop: `1px solid ${C.g200}`, display: "flex", justifyContent: "flex-end", alignItems: "center", cursor: "pointer" }}>
            <span style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>View ticket →</span>
          </button>
        </div>

        <div style={{ margin: "0 14px 6px", background: C.white, borderRadius: 8, border: `1px solid ${C.g300}`, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, color: C.g600, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 1 }}>Field Asset</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Double Port ALPI Charger</div>
            <div style={{ fontSize: 10, color: C.g600 }}>104000007 · GA – Calhoun</div>
          </div>
          <div style={{ background: "#FFEBEE", borderRadius: 6, padding: "5px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.red }}>4</div>
            <div style={{ fontSize: 8, color: C.red, fontWeight: 600, lineHeight: 1.2 }}>tickets<br/>/ 6mo</div>
          </div>
        </div>

        <SectionCard icon="📋" title="Forms" count={0}>
          <button style={{ width: "100%", padding: "8px", borderRadius: 6, background: C.teal, color: C.white, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>Add new form</button>
        </SectionCard>
        <SectionCard icon="🖼" title="Photos & Files" count={0}>
          <button style={{ width: "100%", padding: "8px", borderRadius: 6, background: C.teal, color: C.white, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>📄 Add Photos & Files</button>
        </SectionCard>
        <div style={{ height: 16 }}/>
      </div>

      {showQA && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", flexDirection: "column", justifyContent: "flex-end", zIndex: 20 }} onClick={() => setShowQA(false)}>
          <div style={{ background: C.white, borderRadius: "14px 14px 0 0", padding: "16px 14px 28px" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.5, color: C.g800 }}>QUICK ACTIONS</span>
              <button onClick={() => setShowQA(false)} style={{ background: "none", border: "none", fontSize: 20, color: C.g600, cursor: "pointer" }}>×</button>
            </div>
            {[
              { icon: "🔧", label: "Log Work" },
              { icon: "⏱", label: "Log Time" },
              { icon: "📸", label: "Take a Photo" },
              { icon: "📋", label: "Complete a Form" },
              { icon: "🎫", label: "Create Ticket", isNew: true },
            ].map((a, i) => (
              <button key={i} onClick={() => { setShowQA(false); if (a.isNew) nav("createTicket"); }} style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", margin: "0 0 6px",
                borderRadius: 8, border: a.isNew ? `2px solid ${C.orange}` : `1px solid ${C.g200}`,
                background: a.isNew ? "#FFF8F0" : C.white, cursor: "pointer", width: "100%", textAlign: "left",
              }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: a.isNew ? "#FFF3E0" : C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{a.icon}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: a.isNew ? C.orange : C.teal, flex: 1 }}>{a.label}</span>
                {a.isNew && <span style={{ fontSize: 8, fontWeight: 700, color: C.orange, background: "#FFF3E0", padding: "2px 8px", borderRadius: 10 }}>NEW</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function JobDetailsScreen({ nav }) {
  const [tab, setTab] = useState("info");
  const [openSections, setOpenSections] = useState({ info: true });
  const toggle = s => setOpenSections(p => ({ ...p, [s]: !p[s] }));
  return (
    <>
      <NavBar title="J-000382 Details" showBack onBack={() => nav("jobEvent")} />
      <div style={{ flex: 1, overflow: "auto", background: C.white }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.g200}` }}>
          {["info","related"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "12px 0", border: "none", cursor: "pointer", background: C.white, fontSize: 12, fontWeight: 600, color: tab === t ? C.g800 : C.g400, borderBottom: tab === t ? `3px solid ${C.teal}` : "3px solid transparent" }}>
              {t === "info" ? "Job Information" : "Related"}
            </button>
          ))}
        </div>
        {tab === "info" ? (
          <>
            <AccordionRow label="Information" isOpen={openSections.info} onClick={() => toggle("info")} />
            {openSections.info && (
              <div style={{ padding: "0 14px 14px" }}>
                {[
                  { label: "Job Name", value: "J-000382", required: true },
                  { label: "Job Template", value: "", search: true },
                  { label: "Site", value: "Morinville", link: true },
                  { label: "Job Status", value: "In Progress", dropdown: true },
                  { label: "Field Asset", value: "", search: true },
                  { label: "Priority", value: "Medium", dropdown: true },
                ].map((f, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: `1px solid ${C.g100}` }}>
                    <div style={{ fontSize: 10, color: C.g600, marginBottom: 3 }}>
                      {f.required && <span style={{ color: C.red }}>* </span>}{f.label}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: f.link ? C.teal : f.value ? C.g800 : C.g400, fontWeight: f.value ? 500 : 400 }}>{f.value || " "}</span>
                      {f.search && <span style={{ color: C.g400, fontSize: 14 }}>🔍</span>}
                      {f.dropdown && <span style={{ color: C.g400, fontSize: 10 }}>▾</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {["Text", "Resources", "Scheduling", "Related Information"].map(s => (
              <AccordionRow key={s} label={s} isOpen={false} onClick={() => {}} />
            ))}
          </>
        ) : (
          <>
            {["Inventory Transactions", "Job Tasks", "Job Items", "Forms", "Calendar Events (2)", "Jobs"].map(s => (
              <AccordionRow key={s} label={s} isOpen={false} onClick={() => {}} />
            ))}
          </>
        )}
      </div>
    </>
  );
}

function JobExecutionScreen({ nav }) {
  return (
    <>
      <NavBar title="J-000382 Execution" showBack onBack={() => nav("jobEvent")} />
      <div style={{ flex: 1, overflow: "auto", background: C.g100 }}>
        <SectionCard icon="📅" title="Schedule">
          <div style={{ fontSize: 12, color: C.g800 }}>Monday, 13 April 2026</div>
          <div style={{ fontSize: 12, color: C.g800 }}>4:19 PM - 5:19 PM</div>
        </SectionCard>
        <SectionCard icon="📊" title="My Timetracking">
          <div style={{ display: "flex", alignItems: "center", padding: "6px 10px", border: `1px solid ${C.g200}`, borderRadius: 5, justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, background: C.green, borderRadius: "50%" }}/>
              <span style={{ fontSize: 12, color: C.g800 }}>Checked-In</span>
            </div>
            <span style={{ color: C.g400, fontSize: 10 }}>▾</span>
          </div>
        </SectionCard>
        <SectionCard icon="📋" title="Forms" count={0}>
          <button style={{ width: "100%", padding: "8px", borderRadius: 6, background: C.teal, color: C.white, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>Add new form</button>
        </SectionCard>
        <SectionCard icon="🖼" title="Photos & Files" count={0}>
          <button style={{ width: "100%", padding: "8px", borderRadius: 6, background: C.teal, color: C.white, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer" }}>📄 Add Photos & Files</button>
        </SectionCard>
        <SectionCard icon="🔧" title="Inventory">
          <button style={{ width: "100%", padding: "8px", borderRadius: 6, border: `1px solid ${C.g300}`, background: C.white, color: C.teal, fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 6 }}>🔍 Locate Inventory</button>
          <button style={{ width: "100%", padding: "8px", borderRadius: 6, border: `1px solid ${C.g300}`, background: C.white, color: C.teal, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>📊 Uninstall</button>
        </SectionCard>
      </div>
    </>
  );
}

function MenuScreen({ nav }) {
  return (
    <>
      <SiteTrackerHeader />
      <div style={{ flex: 1, overflow: "auto", background: C.white, paddingTop: 6 }}>
        <MenuItem icon="⭐" label="Favorites" />
        <MenuItem icon="📡" label="Sites" />
        <MenuItem icon="📁" label="Projects" />
        <MenuItem icon="🔒" label="Jobs" onClick={() => nav("jobsList")} />
        <MenuItem icon="🎫" label="Tickets" isNew onClick={() => nav("ticketsList")} />
        <MenuItem icon="☑" label="Forms" />
        <MenuItem icon="💲" label="Expense Reports" />
        <MenuItem icon="◼" label="Job Items" />
      </div>
    </>
  );
}

function JobsListScreen({ nav }) {
  const jobs = [
    { id: "J-000382", template: "--", customer: "--", site: "Morinville", asset: "--" },
    { id: "J-003520", template: "--", customer: "--", site: "2011-WTW-13932-OE", asset: "--" },
    { id: "J-006374", template: "--", customer: "--", site: "100 CONGRESS", asset: "FA-00000023" },
  ];
  return (
    <>
      <NavBar showBack onBack={() => nav("menu")} showPlus
        leftContent={<div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, color: C.white, paddingLeft: 4 }}><span style={{ fontSize: 14, fontWeight: 600 }}>All</span><span style={{ fontSize: 10 }}>▾</span></div>} />
      <div style={{ flex: 1, overflow: "auto", background: C.g100 }}>
        <div style={{ padding: "8px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: C.white, borderRadius: 6, border: `1px solid ${C.g200}` }}>
            <span style={{ color: C.g400, fontSize: 14 }}>🔍</span>
            <span style={{ color: C.g400, fontSize: 12 }}>Search jobs</span>
          </div>
        </div>
        {jobs.map((j, i) => (
          <button key={i} onClick={() => nav("jobEvent")} style={{ margin: "0 14px 8px", padding: "12px", background: C.white, borderRadius: 8, border: `1px solid ${C.g200}`, cursor: "pointer", width: "calc(100% - 28px)", textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.g800, marginBottom: 3 }}>{j.id}</div>
            <div style={{ fontSize: 11, color: C.g600 }}>Template: {j.template}</div>
            <div style={{ fontSize: 11, color: C.g600 }}>Site: {j.site}</div>
            <div style={{ fontSize: 11, color: C.g600 }}>Asset: {j.asset}</div>
          </button>
        ))}
      </div>
    </>
  );
}

function TicketsListScreen({ nav }) {
  const [filter, setFilter] = useState("All");
  const tickets = [
    { id: "T-0000002", title: "Payment terminal security violation", asset: "Double Port ALPI Charger", site: "GA – Calhoun – Buc-ee's", status: "In Progress", priority: "High", time: "2d ago", jobs: 1, photos: 3 },
    { id: "T-0000005", title: "EV charger connector damaged", asset: "Single Port ALPI Charger", site: "GA – Calhoun – Buc-ee's", status: "New", priority: "Urgent", time: "4h ago", jobs: 0, photos: 2 },
    { id: "T-0000003", title: "Intermittent fault alarm on Panel B", asset: "MV Switch #SW-2847", site: "Morinville", status: "Open", priority: "Medium", time: "1w ago", jobs: 2, photos: 0 },
    { id: "T-0000001", title: "Oil level low — routine top-up", asset: "Transformer T-440", site: "Morinville", status: "Closed", priority: "Low", time: "2w ago", jobs: 1, photos: 1 },
  ];
  return (
    <>
      <NavBar showBack onBack={() => nav("menu")} showPlus onPlus={() => nav("createTicket")}
        leftContent={<div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4, color: C.white, paddingLeft: 4 }}><span style={{ fontSize: 14, fontWeight: 600 }}>Tickets</span><span style={{ fontSize: 10 }}>▾</span></div>} />
      <div style={{ flex: 1, overflow: "auto", background: C.g100 }}>
        <div style={{ padding: "8px 14px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: C.white, borderRadius: 6, border: `1px solid ${C.g200}` }}>
            <span style={{ color: C.g400, fontSize: 14 }}>🔍</span>
            <span style={{ color: C.g400, fontSize: 12 }}>Search tickets</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, padding: "8px 14px", overflowX: "auto" }}>
          {["All","Open","My Created","Urgent"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", borderRadius: 14, fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", whiteSpace: "nowrap", background: filter === f ? C.teal : C.white, color: filter === f ? C.white : C.g600, boxShadow: filter !== f ? `0 0 0 1px ${C.g200}` : "none" }}>{f}</button>
          ))}
        </div>
        {tickets.map((t, i) => (
          <button key={i} onClick={() => nav("ticketDetail")} style={{ margin: "0 14px 8px", padding: "12px", background: C.white, borderRadius: 8, border: `1px solid ${C.g200}`, cursor: "pointer", width: "calc(100% - 28px)", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 12, fontWeight: 700, color: C.g800 }}>{t.id}</span><StatusBadge status={t.status} /></div>
              <PriorityBadge priority={t.priority} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.g800, marginBottom: 3, lineHeight: 1.3 }}>{t.title}</div>
            <div style={{ fontSize: 10, color: C.g600, marginBottom: 2 }}><span style={{ fontWeight: 500 }}>{t.asset}</span> · {t.site}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <div style={{ display: "flex", gap: 10, fontSize: 10, color: C.g600 }}>
                <span>🔧 {t.jobs} job{t.jobs !== 1 ? "s" : ""}</span>
                {t.photos > 0 && <span>📷 {t.photos}</span>}
              </div>
              <span style={{ fontSize: 10, color: C.g400 }}>{t.time}</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function TicketDetailScreen({ nav }) {
  const [tab, setTab] = useState("info");
  return (
    <>
      <NavBar title="T-0000002" showBack onBack={() => nav("ticketsList")} />
      <div style={{ flex: 1, overflow: "auto", background: C.g100 }}>
        <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.g200}` }}>
          {["info","related"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", border: "none", cursor: "pointer", background: C.white, fontSize: 12, fontWeight: 600, color: tab === t ? C.g800 : C.g400, borderBottom: tab === t ? `3px solid ${C.teal}` : "3px solid transparent" }}>
              {t === "info" ? "Ticket Information" : "Related"}
            </button>
          ))}
        </div>
        {tab === "info" ? (
          <>
            <div style={{ background: C.white, margin: "6px 14px", borderRadius: 8, border: `1px solid ${C.g200}`, padding: 12 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                <div><div style={{ fontSize: 9, color: C.g600, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Status</div><StatusBadge status="In Progress" size="md" /></div>
                <div><div style={{ fontSize: 9, color: C.g600, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Priority</div><PriorityBadge priority="High" /></div>
                <div><div style={{ fontSize: 9, color: C.g600, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Source</div><span style={{ fontSize: 11, fontWeight: 600, color: C.g800 }}>Call</span></div>
                <div><div style={{ fontSize: 9, color: C.g600, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Category</div><span style={{ fontSize: 11, fontWeight: 600, color: C.g800 }}>Corrective</span></div>
              </div>
              <div><div style={{ fontSize: 9, color: C.g600, fontWeight: 600, textTransform: "uppercase", marginBottom: 2 }}>Assigned To</div><span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Silviu Silaghi</span></div>
            </div>
            <div style={{ background: C.white, margin: "0 14px 6px", borderRadius: 8, border: `1px solid ${C.g200}`, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.g800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Description</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.g800, marginBottom: 3 }}>Payment terminal has a security violation</div>
              <div style={{ fontSize: 11, color: C.g800, lineHeight: 1.5, marginBottom: 10 }}>Customers reporting that several chargers are not functioning correctly. Main issue is that they will not accept payment.</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.g800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Customer Comments</div>
              <div style={{ fontSize: 11, color: C.g600, lineHeight: 1.5, borderLeft: `3px solid ${C.amber}`, paddingLeft: 8, fontStyle: "italic" }}>
                "Customers reporting chargers not functioning. Payment pad also not working. Thanks"
              </div>
            </div>
            <div style={{ background: C.white, margin: "0 14px 6px", borderRadius: 8, border: `1px solid ${C.g200}`, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.g800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Photos & Attachments (3)</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3].map(i => <div key={i} style={{ width: 56, height: 56, borderRadius: 6, background: C.g200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: C.g400 }}>📷</div>)}
              </div>
            </div>
            <div style={{ background: C.white, margin: "0 14px 6px", borderRadius: 8, border: `1px solid ${C.g200}`, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.g800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Ticket Details</div>
              {[{ l: "Ticket Number", v: "T-0000002" }, { l: "Customer", v: "Buc-ee's" }, { l: "Site", v: "GA – Calhoun – Buc-ee's", link: true }, { l: "Field Asset", v: "104000007", link: true }].map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 3 ? `1px solid ${C.g100}` : "none" }}>
                  <span style={{ fontSize: 10, color: C.g600 }}>{f.l}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: f.link ? C.teal : C.g800 }}>{f.v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.white, margin: "0 14px 6px", borderRadius: 8, border: `1px solid ${C.g200}`, padding: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.g800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Dates</div>
              {[{ l: "Reported Date", v: "12/3/2025" }, { l: "Due Date", v: "12/4/2025" }].map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 1 ? `1px solid ${C.g100}` : "none" }}>
                  <span style={{ fontSize: 10, color: C.g600 }}>{f.l}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.g800 }}>{f.v}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 16 }}/>
          </>
        ) : (
          <>
            {["Jobs (1)", "Contact Details", "Site Details", "Field Asset Details", "Contract Agreement & SLA"].map((s, i) => (
              <div key={i} style={{ margin: "6px 14px 0", background: C.white, borderRadius: 8, border: `1px solid ${C.g200}`, padding: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.g800 }}>{s}</span>
                <span style={{ color: C.g400, fontSize: 12 }}>▸</span>
              </div>
            ))}
            <div style={{ height: 16 }}/>
          </>
        )}
      </div>
    </>
  );
}

function CreateTicketScreen({ nav }) {
  const [mode, setMode] = useState("dispatch");
  return (
    <>
      <NavBar title="Create Ticket" showBack onBack={() => nav("jobEvent")} />
      <div style={{ flex: 1, overflow: "auto", background: C.g100 }}>
        <div style={{ background: C.white, padding: "12px 14px", borderBottom: `1px solid ${C.g200}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.g600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Quick Capture</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ i: "📸", l: "Photo" }, { i: "🎤", l: "Voice" }, { i: "📱", l: "Scan QR" }].map((a, idx) => (
              <button key={idx} style={{ flex: 1, padding: "10px 6px", borderRadius: 8, border: `1.5px solid ${C.teal}`, background: C.tealLight, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer" }}>
                <span style={{ fontSize: 18 }}>{a.i}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: C.teal }}>{a.l}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: "10px 14px" }}>
          {[
            { label: "Title", required: true, placeholder: "What's the issue?", mic: true },
            { label: "Description", placeholder: "Describe the issue...", mic: true, tall: true },
          ].map((f, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.g800 }}>{f.label}</span>
                {f.required && <span style={{ color: C.red }}>*</span>}
              </div>
              <div style={{ padding: "10px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.white, display: "flex", justifyContent: "space-between", alignItems: f.tall ? "flex-start" : "center", height: f.tall ? 60 : "auto" }}>
                <span style={{ fontSize: 12, color: C.g400 }}>{f.placeholder}</span>
                {f.mic && <span style={{ fontSize: 12, color: C.g400 }}>🎤</span>}
              </div>
            </div>
          ))}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.g800 }}>Link Asset</span><span style={{ color: C.red }}>*</span>
            </div>
            <div style={{ padding: "10px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.white, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.g400 }}>Search or scan asset</span>
              <span style={{ fontSize: 12, color: C.teal }}>📱</span>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.g800 }}>Priority</span><span style={{ color: C.red }}>*</span>
            </div>
            <div style={{ padding: "10px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.white, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: C.amber }}/><span style={{ fontSize: 12, color: C.g800 }}>Medium</span></div>
              <span style={{ color: C.g400, fontSize: 10 }}>▾</span>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.g800, marginBottom: 3 }}>Category</div>
            <div style={{ padding: "10px", borderRadius: 6, border: `1px solid ${C.g200}`, background: C.white, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.g800 }}>Corrective</span><span style={{ color: C.g400, fontSize: 10 }}>▾</span>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.g800, marginBottom: 3 }}>Photos</div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 52, height: 52, borderRadius: 6, border: `2px dashed ${C.teal}`, background: C.tealLight, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <span style={{ fontSize: 18, color: C.teal }}>+</span><span style={{ fontSize: 8, color: C.teal, fontWeight: 600 }}>Add</span>
              </div>
            </div>
          </div>
          <div style={{ marginBottom: 12, padding: "8px 10px", background: C.tealLight, borderRadius: 6 }}>
            <div style={{ fontSize: 9, color: C.g600, fontWeight: 600, textTransform: "uppercase", marginBottom: 1 }}>Site (auto-populated)</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.teal }}>GA – Calhoun – Buc-ee's</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "10px 14px 22px", background: C.white, borderTop: `1px solid ${C.g200}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <button onClick={() => setMode("dispatch")} style={{ flex: 1, padding: "7px", borderRadius: 6, fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", background: mode === "dispatch" ? C.teal : C.g100, color: mode === "dispatch" ? C.white : C.g600 }}>Send to Dispatch</button>
          <button onClick={() => setMode("job")} style={{ flex: 1, padding: "7px", borderRadius: 6, fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer", background: mode === "job" ? C.orange : C.g100, color: mode === "job" ? C.white : C.g600 }}>Create Job Now</button>
        </div>
        <div style={{ fontSize: 10, color: C.g600, marginBottom: 8, lineHeight: 1.3 }}>
          {mode === "dispatch" ? "Ticket will be sent to dispatch for triage." : "A job will be created and assigned to you immediately."}
        </div>
        <button style={{ width: "100%", padding: "12px", borderRadius: 6, border: "none", background: mode === "dispatch" ? C.teal : C.orange, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {mode === "dispatch" ? "Submit Ticket" : "Submit & Start Job"}
        </button>
      </div>
    </>
  );
}

// ═══ ANNOTATION PANEL ═══
function AnnotationPanel({ screenId, onScreenChange }) {
  const data = annotations[screenId];
  if (!data) return null;

  return (
    <div style={{ padding: "24px 28px", overflow: "auto", height: "100%" }}>
      {/* Screen selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: C.g600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Navigate to Screen</label>
        <select
          value={screenId}
          onChange={e => onScreenChange(e.target.value)}
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.g300}`, fontSize: 13, fontWeight: 500, background: C.white, cursor: "pointer", color: C.g800 }}
        >
          {screenOrder.map(s => (
            <option key={s} value={s}>
              {annotations[s].title}{annotations[s].isNew ? " ★ NEW" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.g800, margin: 0 }}>{data.title}</h2>
        {data.isNew && (
          <span style={{ fontSize: 10, fontWeight: 700, color: C.orange, background: "#FFF3E0", padding: "3px 10px", borderRadius: 10 }}>NEW</span>
        )}
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: C.g700, lineHeight: 1.6, marginBottom: 16 }}>{data.description}</p>

      {/* New feature callout */}
      {data.newFeature && (
        <div style={{ background: "#FFF8F0", border: `1px solid ${C.orange}40`, borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, marginBottom: 3 }}>What's New</div>
          <div style={{ fontSize: 13, color: C.g800 }}>{data.newFeature}</div>
        </div>
      )}

      {/* Components */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.g800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Components</h3>
        <ul style={{ margin: 0, paddingLeft: 18, listStyleType: "disc" }}>
          {data.components.map((c, i) => (
            <li key={i} style={{ fontSize: 13, color: C.g700, lineHeight: 1.5, marginBottom: 4 }}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Interactions */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: C.g800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Interactions</h3>
        <ul style={{ margin: 0, paddingLeft: 18, listStyleType: "none" }}>
          {data.interactions.map((c, i) => (
            <li key={i} style={{ fontSize: 13, color: C.teal, lineHeight: 1.5, marginBottom: 4 }}>→ {c}</li>
          ))}
        </ul>
      </div>

      {/* Nav flow mini-map */}
      <div style={{ background: C.g50, borderRadius: 8, border: `1px solid ${C.g200}`, padding: "12px 14px", marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.g600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Screen Map</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {screenOrder.map(s => (
            <button
              key={s}
              onClick={() => onScreenChange(s)}
              style={{
                padding: "4px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, border: "none", cursor: "pointer",
                background: s === screenId ? C.teal : (annotations[s].isNew ? "#FFF3E0" : C.g200),
                color: s === screenId ? C.white : (annotations[s].isNew ? C.orange : C.g700),
              }}
            >
              {s === screenId ? "●" : ""} {annotations[s].title.replace("Screen ", "").replace(/^\d+: /, "")}
            </button>
          ))}
        </div>
      </div>

      {/* Design system ref */}
      <div style={{ marginTop: 20, padding: "12px 14px", background: C.tealLight, borderRadius: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, marginBottom: 6 }}>Design System</div>
        <div style={{ fontSize: 11, color: C.g700, lineHeight: 1.5 }}>
          <strong>Colors:</strong> Teal Dark #1B3A3A · Teal #00897B · Orange #F57C00 · Red #D32F2F<br/>
          <strong>Cards:</strong> White bg, 1px #E0E0E0 border, 10px radius<br/>
          <strong>Font:</strong> SF Pro / system, 11px labels, 13-14px body
        </div>
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: C.g500 }}>
        Field Central O&M — Mobile App · PI 11 · April 2026
      </div>
    </div>
  );
}

// ═══ MAIN APP ═══
export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("home");

  const nav = useCallback((target) => {
    setScreen(target);
    if (target === "home") setActiveTab("home");
    else if (target === "map") setActiveTab("map");
    else if (target === "menu" || target === "jobsList" || target === "ticketsList") setActiveTab("menu");
  }, []);

  const handleTab = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === "home") setScreen("home");
    else if (tab === "map") setScreen("map");
    else if (tab === "menu") setScreen("menu");
  }, []);

  const handleScreenChange = useCallback((s) => {
    setScreen(s);
    if (s === "home") setActiveTab("home");
    else if (s === "map") setActiveTab("map");
    else if (["menu", "jobsList", "ticketsList"].includes(s)) setActiveTab("menu");
    else setActiveTab("home");
  }, []);

  const showTabs = !["jobDetails", "jobExecution", "ticketDetail", "createTicket"].includes(screen);

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif",
      background: "#F8F9FA",
    }}>
      {/* LEFT: Annotation Panel */}
      <div style={{
        width: 420, minWidth: 420, borderRight: `1px solid ${C.g200}`,
        background: C.white, height: "100vh", overflow: "auto", position: "sticky", top: 0,
      }}>
        <div style={{ padding: "20px 28px 12px", borderBottom: `1px solid ${C.g200}`, background: C.tealDark }}>
          <div style={{ color: C.white, fontSize: 20, fontWeight: 800, letterSpacing: 1.5, marginBottom: 2 }}>SITETR▲CKER</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Mobile Ticketing Prototype — PI 11</div>
        </div>
        <AnnotationPanel screenId={screen} onScreenChange={handleScreenChange} />
      </div>

      {/* RIGHT: Phone mockup */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px", minHeight: "100vh",
      }}>
        <div>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, justifyContent: "center" }}>
            {(({
              home: ["Home"],
              map: ["Map"],
              menu: ["Menu"],
              jobEvent: ["Home", "Calendar", "Job Event"],
              jobDetails: ["Job Event", "Job Details"],
              jobExecution: ["Job Event", "Job Execution"],
              jobsList: ["Menu", "Jobs"],
              ticketsList: ["Menu", "Tickets"],
              ticketDetail: ["Tickets", "Ticket Detail"],
              createTicket: ["Job Event", "Quick Actions", "Create Ticket"],
            })[screen] || []).map((b, i, arr) => (
              <span key={i} style={{ fontSize: 12, color: i === arr.length - 1 ? C.teal : C.g500, fontWeight: i === arr.length - 1 ? 700 : 400 }}>
                {i > 0 && <span style={{ margin: "0 4px", color: C.g400 }}>→</span>}{b}
              </span>
            ))}
          </div>

          {/* Phone */}
          <div style={{
            width: 375, height: 812, borderRadius: 44, overflow: "hidden",
            border: "10px solid #1a1a1a", background: C.white,
            display: "flex", flexDirection: "column", position: "relative",
            boxShadow: "0 25px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset",
          }}>
            <StatusBar />
            {screen === "home" && <HomeScreen nav={nav} />}
            {screen === "map" && <MapScreen />}
            {screen === "menu" && <MenuScreen nav={nav} />}
            {screen === "jobEvent" && <JobEventScreen nav={nav} />}
            {screen === "jobDetails" && <JobDetailsScreen nav={nav} />}
            {screen === "jobExecution" && <JobExecutionScreen nav={nav} />}
            {screen === "jobsList" && <JobsListScreen nav={nav} />}
            {screen === "ticketsList" && <TicketsListScreen nav={nav} />}
            {screen === "ticketDetail" && <TicketDetailScreen nav={nav} />}
            {screen === "createTicket" && <CreateTicketScreen nav={nav} />}
            {showTabs && <BottomTabs active={activeTab} onTab={handleTab} />}
          </div>

          {/* Hint */}
          <div style={{ marginTop: 16, maxWidth: 375, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: C.g500, lineHeight: 1.5 }}>
              <strong style={{ color: C.g700 }}>Interactive:</strong> Tap elements in the phone to navigate. Use the dropdown or screen map on the left to jump to any screen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
