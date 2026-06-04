import { RefObject } from "react";

type Props = {
  onNewReport: () => void;
  onHelp: () => void;
  onSettings: () => void;
  settingsButtonRef: RefObject<HTMLButtonElement>;
  activeSection?: string;
};

export default function Sidebar({ onNewReport, onHelp, onSettings, settingsButtonRef, activeSection = "overview" }: Props) {
  const items = [
    ["▦", "Overview", "#overview"],
    ["△", "Student Risk", "#student-risk"],
    ["◇", "Interventions", "#recommendations"],
    ["▣", "Resources", "#data-quality"],
    ["◔", "Admin", "#ethics"]
  ] as const;

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-block">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <p className="brand-title">EduAnalytics</p>
          <p className="brand-subtitle">Staff Portal</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Dashboard sections">
        {items.map(([icon, label, href], index) => (
          <a key={label} className={`nav-item${href.slice(1) === activeSection ? " active" : ""}`} href={href}>
            <span aria-hidden="true">{icon}</span>
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="new-report" type="button" aria-label="Create new report" onClick={onNewReport}>
          <span aria-hidden="true">＋</span> New Report
        </button>
        <button className="nav-item small nav-button" type="button" aria-label="Open help" onClick={onHelp}>
          <span aria-hidden="true">?</span><span>Help</span>
        </button>
        <button
          ref={settingsButtonRef}
          className="nav-item small nav-button"
          type="button"
          aria-label="Open settings"
          onClick={onSettings}
        >
          <span aria-hidden="true">⚙</span><span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
