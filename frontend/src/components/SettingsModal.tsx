import { useEffect, useMemo, useState } from "react";
import Button from "./ui/Button";
import SelectField from "./ui/SelectField";
import Toggle from "./ui/Toggle";
import {
  chartLabels,
  defaultSettings,
  kpiLabels,
  SettingsState,
  VisibleChartKey,
  VisibleKpiKey
} from "../types/settings";

type Props = {
  isOpen: boolean;
  settings: SettingsState;
  ethicsConfirmed: boolean;
  apiAvailable: boolean;
  apiBaseUrl: string;
  learnerCount: number;
  dataQualityScore?: number;
  onClose: () => void;
  onSave: (next: SettingsState) => void;
  onResetDefaults: () => void;
  onResetEthicsDeclaration: () => void;
  onCheckApiStatus: () => Promise<boolean>;
};

export default function SettingsModal({
  isOpen,
  settings,
  ethicsConfirmed,
  apiAvailable,
  apiBaseUrl,
  learnerCount,
  dataQualityScore,
  onClose,
  onSave,
  onResetDefaults,
  onResetEthicsDeclaration,
  onCheckApiStatus
}: Props) {
  const [draft, setDraft] = useState<SettingsState>(settings);

  useEffect(() => {
    if (isOpen) {
      setDraft(settings);
    }
  }, [isOpen, settings]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const maskedApiBase = useMemo(() => {
    try {
      const url = new URL(apiBaseUrl);
      return `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ""}${url.pathname}`;
    } catch {
      return apiBaseUrl;
    }
  }, [apiBaseUrl]);

  if (!isOpen) return null;

  const updateKpiVisibility = (key: VisibleKpiKey, value: boolean) => {
    setDraft((current) => ({
      ...current,
      visibleKpis: {
        ...current.visibleKpis,
        [key]: value
      }
    }));
  };

  const updateChartVisibility = (key: VisibleChartKey, value: boolean) => {
    setDraft((current) => ({
      ...current,
      visibleCharts: {
        ...current.visibleCharts,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(draft);
  };

  const handleResetDefaults = () => {
    setDraft(defaultSettings);
    onResetDefaults();
  };

  const handleApiCheck = async () => {
    await onCheckApiStatus();
  };

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-modal-header">
          <div className="settings-modal-title-wrap">
            <div className="modal-icon" aria-hidden="true">⚙</div>
            <div>
              <h2 id="settings-title">Settings</h2>
              <p>Configure dashboard preferences and responsible-use options.</p>
            </div>
          </div>
          <Button type="button" onClick={onClose}>Close</Button>
        </header>

        <div className="settings-modal-body">
          <section className="settings-section-card">
            <h3>Display Preferences</h3>
            <SelectField
              id="themeMode"
              label="Theme Mode"
              description="Light mode is recommended for this interface."
              value={draft.themeMode}
              onChange={(value) => setDraft((current) => ({ ...current, themeMode: value as SettingsState["themeMode"] }))}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System (follow OS)</option>
            </SelectField>
            <SelectField
              id="tableDensity"
              label="Table Density"
              description="Control learner table spacing."
              value={draft.tableDensity}
              onChange={(value) => setDraft((current) => ({ ...current, tableDensity: value as SettingsState["tableDensity"] }))}
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </SelectField>
            <Toggle
              id="showHelperText"
              label="Show Helper Text"
              description="Show KPI and section helper descriptions."
              checked={draft.showHelperText}
              onChange={(checked) => setDraft((current) => ({ ...current, showHelperText: checked }))}
            />
          </section>

          <section className="settings-section-card">
            <h3>Dashboard Preferences</h3>
            <SelectField
              id="defaultLandingSection"
              label="Default Landing Section"
              description="Used for New Report and dashboard return flow."
              value={draft.defaultLandingSection}
              onChange={(value) => setDraft((current) => ({ ...current, defaultLandingSection: value as SettingsState["defaultLandingSection"] }))}
            >
              <option value="overview">Overview</option>
              <option value="risk">Learner Risk</option>
              <option value="recommendations">Recommendations</option>
              <option value="data-quality">Data Quality</option>
              <option value="ethics">Ethics</option>
              <option value="export">Export</option>
            </SelectField>
            <div className="settings-subsection">
              <h4>KPI Visibility</h4>
              {Object.entries(kpiLabels).map(([key, label]) => (
                <Toggle
                  key={key}
                  id={`kpi-${key}`}
                  label={label}
                  checked={draft.visibleKpis[key as VisibleKpiKey]}
                  onChange={(checked) => updateKpiVisibility(key as VisibleKpiKey, checked)}
                />
              ))}
            </div>
            <div className="settings-subsection">
              <h4>Chart Visibility</h4>
              {Object.entries(chartLabels).map(([key, label]) => (
                <Toggle
                  key={key}
                  id={`chart-${key}`}
                  label={label}
                  checked={draft.visibleCharts[key as VisibleChartKey]}
                  onChange={(checked) => updateChartVisibility(key as VisibleChartKey, checked)}
                />
              ))}
            </div>
          </section>

          <section className="settings-section-card">
            <h3>Data &amp; Validation Preferences</h3>
            <SelectField
              id="validationStrictness"
              label="Validation Strictness"
              description="Strict mode is prepared for future backend rules."
              value={draft.validationStrictness}
              onChange={(value) => setDraft((current) => ({ ...current, validationStrictness: value as SettingsState["validationStrictness"] }))}
            >
              <option value="standard">Standard</option>
              <option value="strict">Strict</option>
            </SelectField>
            {draft.validationStrictness === "strict" ? <p className="setting-note">Strict validation is prepared for future backend rules.</p> : null}
            <Toggle
              id="highlightHighRiskLearners"
              label="Highlight High-Risk Learners"
              description="Emphasize Critical and High risk rows."
              checked={draft.highlightHighRiskLearners}
              onChange={(checked) => setDraft((current) => ({ ...current, highlightHighRiskLearners: checked }))}
            />
            <Toggle
              id="showRiskReasons"
              label="Show Risk Reasons"
              description="Control display of reason codes in the risk table."
              checked={draft.showRiskReasons}
              onChange={(checked) => setDraft((current) => ({ ...current, showRiskReasons: checked }))}
            />
          </section>

          <section className="settings-section-card">
            <h3>Ethics &amp; Privacy Preferences</h3>
            <p className="setting-note">Ethics Declaration Status: {ethicsConfirmed ? "Confirmed" : "Not Confirmed"}</p>
            <div className="settings-inline-actions">
              <Button type="button" onClick={onResetEthicsDeclaration}>Reset Ethics Declaration</Button>
            </div>
            <Toggle
              id="showResponsibleUseReminder"
              label="Show Responsible Use Reminder"
              description="Show or hide the reminder panel while preserving ethics controls."
              checked={draft.showResponsibleUseReminder}
              onChange={(checked) => setDraft((current) => ({ ...current, showResponsibleUseReminder: checked }))}
            />
            <Toggle
              id="privacyMode"
              label="Privacy Mode"
              description="Keep learner table privacy-safe and avoid unnecessary detail."
              checked={draft.privacyMode}
              onChange={(checked) => setDraft((current) => ({ ...current, privacyMode: checked }))}
            />
          </section>

          <section className="settings-section-card">
            <h3>Export Preferences</h3>
            <SelectField
              id="exportFormat"
              label="Export Format"
              description="CSV uses the backend export endpoint; Summary Report is generated in the UI."
              value={draft.exportFormat}
              onChange={(value) => setDraft((current) => ({ ...current, exportFormat: value as SettingsState["exportFormat"] }))}
            >
              <option value="csv">CSV</option>
              <option value="summary">Summary Report</option>
            </SelectField>
            <Toggle
              id="includeRecommendationsInExport"
              label="Include Recommendations in Export"
              checked={draft.includeRecommendationsInExport}
              onChange={(checked) => setDraft((current) => ({ ...current, includeRecommendationsInExport: checked }))}
            />
            <Toggle
              id="includeValidationSummaryInExport"
              label="Include Validation Summary in Export"
              checked={draft.includeValidationSummaryInExport}
              onChange={(checked) => setDraft((current) => ({ ...current, includeValidationSummaryInExport: checked }))}
            />
            <Toggle
              id="includeEthicsStatusInExport"
              label="Include Ethics Declaration Status in Export"
              checked={draft.includeEthicsStatusInExport}
              onChange={(checked) => setDraft((current) => ({ ...current, includeEthicsStatusInExport: checked }))}
            />
          </section>

          <section className="settings-section-card">
            <h3>System Information</h3>
            <div className="system-grid">
              <div><strong>Frontend status:</strong> Active</div>
              <div><strong>API connection status:</strong> {apiAvailable ? "Connected" : "Not Connected"}</div>
              <div><strong>Current API base URL:</strong> {maskedApiBase}</div>
              <div><strong>Ethics Declaration:</strong> {ethicsConfirmed ? "Confirmed" : "Not Confirmed"}</div>
              <div><strong>Loaded learner records count:</strong> {learnerCount}</div>
              <div><strong>Data Quality Score:</strong> {typeof dataQualityScore === "number" ? `${dataQualityScore.toFixed(0)}%` : "—"}</div>
              <div><strong>App version:</strong> Prototype v1.0</div>
            </div>
            <div className="settings-inline-actions">
              <Button type="button" onClick={handleApiCheck}>Check API Status</Button>
            </div>
          </section>
        </div>

        <footer className="settings-modal-footer">
          <Button type="button" onClick={handleResetDefaults}>Reset Defaults</Button>
          <Button type="button" variant="primary" onClick={handleSave}>Save Changes</Button>
        </footer>
      </section>
    </div>
  );
}
