import { useEffect } from "react";
import { CircleHelp, X } from "lucide-react";
import Button from "./ui/Button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HelpModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section className="settings-modal help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={(event) => event.stopPropagation()}>
        <header className="settings-modal-header">
          <div className="settings-headline">
            <div className="modal-icon" aria-hidden="true"><CircleHelp size={24} /></div>
            <div>
              <h2 id="help-title">Help Centre</h2>
              <p>Guide to using the Student Support Insights dashboard responsibly.</p>
            </div>
          </div>
          <button className="settings-close" type="button" onClick={onClose} aria-label="Close Help"><X size={18} /></button>
        </header>

        <div className="settings-modal-body">
          <section className="settings-card">
            <h3>How to use the dashboard</h3>
            <ul className="help-list-bullets">
              <li>Complete Ethics Declaration first to unlock upload, add learner, and export actions.</li>
              <li>Upload CSV data or add learner records manually, then review KPI and risk trends.</li>
              <li>Use filters in Learner Risk to prioritise human-reviewed interventions.</li>
              <li>Review recommendations and validation summary before export.</li>
            </ul>
          </section>

          <section className="settings-card">
            <h3>Ethics Declaration and privacy</h3>
            <ul className="help-list-bullets">
              <li>Ethics Declaration is mandatory and cannot be bypassed.</li>
              <li>Privacy Mode keeps output learner-safe and avoids unnecessary details.</li>
              <li>Risk outputs are decision support only and require staff judgement.</li>
            </ul>
          </section>

          <section className="settings-card">
            <h3>CSV upload requirements</h3>
            <p>Required fields include Learner ID, age band, province, device/internet access, confidence scores, employment status, support need, attendance risk, and notes.</p>
            <p>Upload accepts CSV only. Validation checks missing values, controlled value mismatches, and score ranges.</p>
          </section>

          <section className="settings-card">
            <h3>Risk score interpretation</h3>
            <p>Critical and High categories should be reviewed first. Reason codes show the contributing factors when enabled in Settings.</p>
          </section>

          <section className="settings-card">
            <h3>Export behaviour</h3>
            <p>Export stays disabled until Ethics Declaration is confirmed and learner data is loaded.</p>
            <p>Settings control whether recommendations, validation summary, and ethics status are included.</p>
          </section>

          <section className="settings-card">
            <h3>Troubleshooting API connection</h3>
            <ul className="help-list-bullets">
              <li>Check backend is running on http://localhost:5000.</li>
              <li>Use Settings - Check API Status to confirm readiness.</li>
              <li>If API is offline, dashboard cards and charts show empty-state placeholders.</li>
            </ul>
          </section>

          <section className="settings-card">
            <h3>Contact / support</h3>
            <p>Support channel placeholder: programme-support@example.edu</p>
          </section>
        </div>

        <footer className="settings-modal-footer">
          <div className="settings-footer-actions">
            <Button variant="primary" type="button" onClick={onClose}>Close</Button>
          </div>
        </footer>
      </section>
    </div>
  );
}
