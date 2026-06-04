import { ReactNode, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  API_BASE_URL,
  downloadExportCsv,
  fetchDashboard,
  fetchEthicsNotice,
  fetchInsights,
  fetchLearners,
  fetchRecommendations,
  fetchRiskFlags,
  getApiErrorMessage,
  submitManualLearner,
  uploadCsv
} from "./services/api";
import Header from "./components/Header";
import HelpModal from "./components/HelpModal";
import KpiGrid, { KpiCardModel } from "./components/KpiGrid";
import RecommendationsPanel from "./components/RecommendationsPanel";
import ResponsibleUsePanel from "./components/ResponsibleUsePanel";
import RiskTable, { PriorityFilter } from "./components/RiskTable";
import SettingsModal from "./components/SettingsModal";
import Sidebar from "./components/Sidebar";
import ValidationPanel from "./components/ValidationPanel";
import { DashboardSummary, EthicsNotice, Learner, Recommendation, RiskFlag, ValidationError } from "./types/models";
import { defaultLandingSectionHash, defaultSettings, SETTINGS_STORAGE_KEY, SettingsState, VisibleKpiKey } from "./types/settings";

const DashboardCharts = lazy(() => import("./components/DashboardCharts"));
const LearnerForm = lazy(() => import("./components/LearnerForm"));

const ETHICS_CONFIRMED_KEY = "ethicsDeclarationConfirmed";

type ToastTone = "info" | "success" | "error";
type Toast = { id: number; tone: ToastTone; text: string };
const PRIORITY_OPTIONS: PriorityFilter[] = ["All", "Critical", "High", "Medium", "Low"];

function normalizePriority(priority: string | undefined): PriorityFilter {
  const value = (priority ?? "Medium") as PriorityFilter;
  return PRIORITY_OPTIONS.includes(value) && value !== "All" ? value : "Medium";
}

function formatPercent(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return `${value.toFixed(0)}%`;
}

function formatScore(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toFixed(1);
}

function getRiskFactors(item: RiskFlag): string[] {
  if (item.riskReasonCodes?.length) return item.riskReasonCodes;
  if (item.riskFactors?.length) return item.riskFactors;

  return item.riskReason
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function ToastStack({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`} role="status">
          <span>{toast.text}</span>
          <button className="toast-close" type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">×</button>
        </div>
      ))}
    </div>
  );
}

function mergeSettings(value: unknown): SettingsState {
  if (!value || typeof value !== "object") return defaultSettings;

  const parsed = value as Partial<SettingsState>;
  return {
    ...defaultSettings,
    ...parsed,
    visibleKpis: {
      ...defaultSettings.visibleKpis,
      ...(parsed.visibleKpis ?? {})
    },
    visibleCharts: {
      ...defaultSettings.visibleCharts,
      ...(parsed.visibleCharts ?? {})
    }
  };
}

function loadSettings(): SettingsState {
  if (typeof window === "undefined") return defaultSettings;

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaultSettings;
    return mergeSettings(JSON.parse(raw));
  } catch {
    return defaultSettings;
  }
}

function EthicsDeclarationModal({
  isOpen,
  onClose,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setChecked(false);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="presentation">
      <section className="ethics-modal" role="dialog" aria-modal="true" aria-labelledby="ethics-title" aria-describedby="ethics-description">
        <header className="modal-head">
          <div className="modal-icon" aria-hidden="true">⚖</div>
          <div>
            <h2 id="ethics-title">Ethics and Privacy Declaration</h2>
            <p>Compliance &amp; Operational Standards</p>
          </div>
        </header>

        <div className="modal-body">
          <article className="protocol-card" id="ethics-description">
            <p className="protocol-label"><span aria-hidden="true">ⓘ</span> Usage Protocol</p>
            <p>
              This tool uses learner support data to help programme staff identify support needs and improve learner success.
              The tool should use synthetic or anonymised data where possible. Risk scores are decision-support indicators only and must not replace human judgement.
              Learners must not be punished, excluded, or unfairly labelled based on dashboard scores. Staff must consider bias, privacy, consent,
              fairness, and context before acting on any recommendation. Sensitive personal information should not be entered unless necessary and authorised.
            </p>
          </article>

          <label className="declaration-check">
            <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
            <span>I confirm that I understand and agree to use this tool responsibly, with human review and learner privacy protection.</span>
          </label>
        </div>

        <footer className="modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" type="button" disabled={!checked} onClick={onConfirm}>Confirm Declaration ◎</button>
        </footer>
      </section>
    </div>
  );
}

function DisabledActionHint({ children, disabled }: { children: ReactNode; disabled: boolean }) {
  return (
    <div className="action-wrapper">
      {children}
      {disabled ? <span className="disabled-tooltip">Please complete the Ethics Declaration before using learner data.</span> : null}
    </div>
  );
}

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-panel" role="status" aria-live="polite">
      <p className="empty-title">{title}</p>
      <p className="empty-description">{description}</p>
    </div>
  );
}

function ConfirmModal({
  isOpen,
  icon = "＋",
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  icon?: string;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="presentation">
      <section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
        <div className="confirm-modal-icon" aria-hidden="true">{icon}</div>
        <h2 id="confirm-title" className="confirm-modal-title">{title}</h2>
        <p id="confirm-desc" className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button className="btn btn-secondary" type="button" onClick={onCancel}>{cancelLabel}</button>
          <button className="btn btn-primary" type="button" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [ethics, setEthics] = useState<EthicsNotice | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [uploadValidationErrors, setUploadValidationErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiAvailable, setApiAvailable] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmittingLearner, setIsSubmittingLearner] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showManualForm, setShowManualForm] = useState<boolean>(false);
  const [showEthicsModal, setShowEthicsModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showNewReportConfirm, setShowNewReportConfirm] = useState<boolean>(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState<boolean>(false);
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [riskQuery, setRiskQuery] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  const [settings, setSettings] = useState<SettingsState>(() => loadSettings());
  const [ethicsConfirmed, setEthicsConfirmed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(ETHICS_CONFIRMED_KEY) === "true";
  });
  const [activeSection, setActiveSection] = useState<string>("overview");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextToastId = useRef<number>(1);

  const learnerById = useMemo(() => {
    const map = new Map<string, Learner>();
    learners.forEach((learner) => map.set(learner.learnerId, learner));
    return map;
  }, [learners]);

  const filteredRiskFlags = useMemo(() => {
    const query = riskQuery.trim().toLowerCase();

    return riskFlags.filter((item) => {
      const priority = normalizePriority(item.priority);
      if (priorityFilter !== "All" && priority !== priorityFilter) return false;

      if (!query) return true;

      const learner = learnerById.get(item.learnerId);
      const factors = getRiskFactors(item).join(" ").toLowerCase();
      const searchable = `${item.learnerId} ${item.supportNeed} ${item.attendanceRisk} ${factors} ${learner?.province ?? ""}`.toLowerCase();
      return searchable.includes(query);
    });
  }, [learnerById, priorityFilter, riskFlags, riskQuery]);

  const kpiCards = useMemo<{ key: VisibleKpiKey; card: KpiCardModel }[]>(() => {
    const total = dashboard?.totalLearners ?? learners.length;
    const critical = dashboard?.criticalRiskCount ?? riskFlags.filter((item) => normalizePriority(item.priority) === "Critical").length;
    const high = dashboard?.highRiskCount ?? riskFlags.filter((item) => normalizePriority(item.priority) === "High").length;
    const medium = dashboard?.mediumRiskCount ?? riskFlags.filter((item) => normalizePriority(item.priority) === "Medium").length;
    const low = dashboard?.lowRiskCount ?? Math.max(total - critical - high - medium, 0);

    return [
      { key: "totalLearners" as VisibleKpiKey, card: { title: "Total Learners", value: total ? String(total) : "—", helper: "Records in current dataset", icon: "👥", tone: "primary" } },
      { key: "criticalRisk" as VisibleKpiKey, card: { title: "Critical Risk", value: critical ? String(critical) : "—", helper: "Immediate intervention", icon: "✱", tone: "critical" } },
      { key: "highRisk" as VisibleKpiKey, card: { title: "High Risk", value: high ? String(high) : "—", helper: "Review required", icon: "⚠", tone: "high" } },
      { key: "mediumRisk" as VisibleKpiKey, card: { title: "Medium Risk", value: medium ? String(medium) : "—", helper: "Monitor support cases", icon: "♙", tone: "medium" } },
      { key: "lowRisk" as VisibleKpiKey, card: { title: "Low Risk", value: low ? String(low) : "—", helper: "Normal monitoring", icon: "○", tone: "low" } },
      { key: "internetRisk" as VisibleKpiKey, card: { title: "Internet Risk", value: formatPercent(dashboard?.internetRiskPercent), helper: "Limited or unstable internet", icon: "🌐" } },
      { key: "deviceAccessGap" as VisibleKpiKey, card: { title: "Device Gap", value: formatPercent(dashboard?.deviceGapPercent), helper: "Phone-only/shared access", icon: "▣" } },
      { key: "averageDigitalConfidence" as VisibleKpiKey, card: { title: "Digital Confidence", value: formatScore(dashboard?.averageDigitalConfidence), helper: "Average score out of 5", icon: "▥" } },
      { key: "averageProgrammingConfidence" as VisibleKpiKey, card: { title: "Programming", value: formatScore(dashboard?.averageProgrammingConfidence), helper: "Average score out of 5", icon: "⌘" } },
      { key: "aiReadinessScore" as VisibleKpiKey, card: { title: "AI Readiness", value: formatScore(dashboard?.averageAiFamiliarity), helper: "AI familiarity score", icon: "◇" } },
      { key: "dataQualityScore" as VisibleKpiKey, card: { title: "Data Quality", value: formatPercent(dashboard?.dataQualityScore), helper: "Valid records after checks", icon: "▤" } },
      { key: "topSupportNeed" as VisibleKpiKey, card: { title: "Top Support", value: dashboard?.topSupportNeed ?? "—", helper: "Most frequent support category", icon: "✦" } }
    ];
  }, [dashboard, learners.length, riskFlags]);

  const visibleKpiCards: KpiCardModel[] = useMemo(
    () => kpiCards.filter((item) => settings.visibleKpis[item.key]).map((item) => item.card),
    [kpiCards, settings.visibleKpis]
  );

  const dismissToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const pushToast = (tone: ToastTone, text: string) => {
    const id = nextToastId.current;
    nextToastId.current += 1;
    setToasts((current) => [...current, { id, tone, text }]);
    window.setTimeout(() => dismissToast(id), 4200);
  };

  const confirmEthics = () => {
    setEthicsConfirmed(true);
    setShowEthicsModal(false);
    window.localStorage.setItem(ETHICS_CONFIRMED_KEY, "true");
    pushToast("success", "Ethics Declaration confirmed. Learner data actions are now enabled.");
  };

  async function refresh() {
    setIsLoading(true);

    const [learnersRes, dashboardRes, riskRes, recRes, insightsRes, ethicsRes] = await Promise.allSettled([
      fetchLearners(),
      fetchDashboard(),
      fetchRiskFlags(),
      fetchRecommendations(),
      fetchInsights(),
      fetchEthicsNotice()
    ]);

    if (dashboardRes.status === "fulfilled") {
      setDashboard(dashboardRes.value);
      if (!apiAvailable) pushToast("success", "API connection restored.");
      setApiAvailable(true);
    } else {
      setDashboard(null);
      if (apiAvailable) pushToast("error", "API is offline. Start backend on http://localhost:5000 to load live dashboard data.");
      setApiAvailable(false);
    }

    setLearners(learnersRes.status === "fulfilled" ? learnersRes.value : []);
    setRiskFlags(riskRes.status === "fulfilled" ? riskRes.value : []);
    setRecommendations(recRes.status === "fulfilled" ? recRes.value : []);
    setInsights(insightsRes.status === "fulfilled" ? insightsRes.value.insights ?? [] : []);
    setEthics(ethicsRes.status === "fulfilled" ? ethicsRes.value : null);
    setIsLoading(false);
  }

  useEffect(() => {
    refresh().catch((error) => {
      setApiAvailable(false);
      setIsLoading(false);
      pushToast("error", getApiErrorMessage(error, "Failed to load data from API."));
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const apply = (mode: string) => {
      document.documentElement.dataset.themeMode = mode;
    };

    if (settings.themeMode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      apply(settings.themeMode);
    }
  }, [settings.themeMode]);

  // Track which section is in the viewport and sync the active nav item
  useEffect(() => {
    // Re-observe after each data load so we catch the correct DOM nodes
    const sectionNavMap: Record<string, string> = {
      overview: "overview",
      analytics: "overview",
      "student-risk": "student-risk",
      recommendations: "recommendations",
      "data-quality": "data-quality",
      ethics: "ethics"
    };

    const observers: IntersectionObserver[] = [];
    Object.keys(sectionNavMap).forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(sectionNavMap[id]);
        },
        { rootMargin: "-10% 0px -50% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [isLoading]); // Re-observe when data finishes loading (DOM nodes are remounted)

  // Keyboard shortcuts: Alt+N → New Report, Alt+H → Help, Alt+S → Settings
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!event.altKey) return;
      if (event.key === "h" || event.key === "H") { event.preventDefault(); setShowHelpModal(true); }
      if (event.key === "s" || event.key === "S") { event.preventDefault(); setShowSettingsModal(true); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const guardEthics = () => {
    if (ethicsConfirmed) return true;
    setShowEthicsModal(true);
    pushToast("info", "Please complete the Ethics Declaration before using learner data.");
    return false;
  };

  const navigateToSection = (hash: string) => {
    window.location.hash = hash;
    window.requestAnimationFrame(() => {
      const target = document.querySelector(hash);
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const resetForNewReport = () => {
    setRiskQuery("");
    setPriorityFilter("All");
    setUploadValidationErrors([]);
    setShowManualForm(false);
    setShowHelpModal(false);
    setShowSettingsModal(false);
  };

  const handleNewReport = () => {
    setShowNewReportConfirm(true);
  };

  const confirmNewReport = () => {
    setShowNewReportConfirm(false);
    resetForNewReport();
    navigateToSection(defaultLandingSectionHash[settings.defaultLandingSection]);
    pushToast("success", "New report workspace prepared.");
  };

  const checkApiStatus = async () => {
    const apiRoot = API_BASE_URL.replace(/\/api$/, "");

    try {
      let response = await fetch(`${apiRoot}/api/health/ready`, { cache: "no-store" });
      if (!response.ok) {
        response = await fetch(`${apiRoot}/api/health`, { cache: "no-store" });
      }

      if (!response.ok) {
        throw new Error(`Health endpoint returned ${response.status}`);
      }

      setApiAvailable(true);
      pushToast("success", "API status check passed.");
      return true;
    } catch {
      setApiAvailable(false);
      pushToast("error", "API status check failed. Ensure the backend is running on http://localhost:5000.");
      return false;
    }
  };

  const saveTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const buildSummaryReport = () => {
    const lines: string[] = [
      "Student Support Insights Tool - Summary Report",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "Overview",
      `Learners loaded: ${learners.length}`,
      `API available: ${apiAvailable ? "Yes" : "No"}`,
      `Data quality: ${formatPercent(dashboard?.dataQualityScore)}`,
      `Priority filter: ${priorityFilter}`,
      ""
    ];

    if (settings.includeRecommendationsInExport) {
      lines.push("Recommendations");
      if (recommendations.length === 0) {
        lines.push("No recommendations available.");
      } else {
        recommendations.slice(0, 5).forEach((item, index) => {
          lines.push(`${index + 1}. ${item.title}: ${item.rationale}`);
        });
      }
      lines.push("");
    }

    if (settings.includeValidationSummaryInExport) {
      lines.push("Validation Summary");
      if (uploadValidationErrors.length === 0) {
        lines.push("No validation issues currently visible.");
      } else {
        uploadValidationErrors.slice(0, 10).forEach((item, index) => {
          lines.push(`${index + 1}. ${item.field}: ${item.message}`);
        });
      }
      lines.push("");
    }

    if (settings.includeEthicsStatusInExport) {
      lines.push("Ethics Declaration");
      lines.push(`Status: ${ethicsConfirmed ? "Confirmed" : "Not Confirmed"}`);
      lines.push("");
    }

    lines.push("Top Risk Learners");
    if (filteredRiskFlags.length === 0) {
      lines.push("No learners currently match the selected filters.");
    } else {
      filteredRiskFlags.slice(0, 10).forEach((item, index) => {
        lines.push(`${index + 1}. ${item.learnerId} - ${normalizePriority(item.priority)} - ${item.supportNeed}`);
      });
    }

    return lines.join("\n");
  };

  const requestUpload = (file: File) => {
    if (!guardEthics()) return;
    setPendingUploadFile(file);
    setShowUploadConfirm(true);
  };

  const confirmUpload = async () => {
    const file = pendingUploadFile;
    setPendingUploadFile(null);
    setShowUploadConfirm(false);
    if (!file) return;

    setIsUploading(true);
    setUploadValidationErrors([]);
    pushToast("info", "Uploading CSV and refreshing dashboard...");

    try {
      const result = await uploadCsv(file);
      setUploadValidationErrors(result.validationErrors ?? []);
      pushToast("success", `Imported ${result.importedCount} records, rejected ${result.rejectedCount}.`);
      await refresh();
    } catch (error) {
      pushToast("error", getApiErrorMessage(error, "Upload failed. Check file format and API availability, then retry."));
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setPendingUploadFile(null);
    setShowUploadConfirm(false);
  };

  const handleManualAdd = async (learner: Learner) => {
    if (!guardEthics()) return false;

    setIsSubmittingLearner(true);
    setUploadValidationErrors([]);
    pushToast("info", "Saving learner and updating analytics...");

    try {
      const result = await submitManualLearner(learner);
      if (result.errors?.length) {
        pushToast("error", result.errors.join(" | "));
        return false;
      }

      pushToast("success", "Learner added successfully.");
      setShowManualForm(false);
      await refresh();
      return true;
    } catch (error) {
      pushToast("error", getApiErrorMessage(error, "Unable to add learner. Please retry."));
      return false;
    } finally {
      setIsSubmittingLearner(false);
    }
  };

  const handleExport = async () => {
    if (!guardEthics()) return;

    setIsExporting(true);
    pushToast("info", "Preparing export...");

    try {
      if (settings.exportFormat === "summary") {
        saveTextFile("student-support-summary-report.txt", buildSummaryReport());
      } else {
        await downloadExportCsv();
      }
      pushToast("success", "Report exported successfully.");
    } catch (error) {
      pushToast("error", getApiErrorMessage(error, "Export failed. Ensure API is available and try again."));
    } finally {
      setIsExporting(false);
    }
  };

  const handleHelp = useCallback(() => {
    setShowHelpModal(true);
  }, []);

  const handleSettings = useCallback(() => {
    setShowSettingsModal(true);
  }, []);

  const uploadDisabled = !ethicsConfirmed || isUploading;
  const addDisabled = !ethicsConfirmed || isSubmittingLearner;
  const exportDisabled = !ethicsConfirmed || isExporting || learners.length === 0;

  return (
    <div className="app-shell">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Sidebar onNewReport={handleNewReport} onHelp={handleHelp} onSettings={handleSettings} settingsButtonRef={settingsButtonRef} activeSection={activeSection} />
      <main className="main-content" id="main-content">
        <Header ethicsConfirmed={ethicsConfirmed} onOpenEthics={() => setShowEthicsModal(true)} />

        <section className="action-cluster" aria-label="Dataset actions">
          <input
            ref={fileInputRef}
            className="visually-hidden"
            id="csvFile"
            type="file"
            accept=".csv"
            disabled={uploadDisabled}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) requestUpload(file);
              event.currentTarget.value = "";
            }}
          />
          <DisabledActionHint disabled={!ethicsConfirmed}>
            <button className="btn btn-action" type="button" disabled={uploadDisabled} onClick={() => fileInputRef.current?.click()}>
              ☁ {isUploading ? "Uploading..." : "Upload CSV"}
            </button>
          </DisabledActionHint>
          <DisabledActionHint disabled={!ethicsConfirmed}>
            <button className="btn btn-action" type="button" disabled={addDisabled} onClick={() => setShowManualForm((value) => !value)}>
              ♧ Add Learner
            </button>
          </DisabledActionHint>
          <DisabledActionHint disabled={!ethicsConfirmed}>
            <button className="btn btn-action" type="button" disabled={exportDisabled} onClick={handleExport}>
              ⇩ {isExporting ? "Exporting..." : settings.exportFormat === "summary" ? "Export Summary" : "Export Report"}
            </button>
          </DisabledActionHint>
        </section>

        {!ethicsConfirmed ? <p className="ethics-warning">Please complete the Ethics Declaration before using learner data.</p> : null}
        {!apiAvailable ? <p className="api-warning">API is currently offline. Start the backend to load live learner data.</p> : null}

        {showManualForm ? (
          <section className="surface-panel compact-panel">
            <div className="section-title-row">
              <div>
                <h2>Add Learner Record</h2>
                <p>Manual entry is enabled after ethics confirmation.</p>
              </div>
              <button className="btn btn-secondary" type="button" onClick={() => setShowManualForm(false)}>Close</button>
            </div>
            <Suspense fallback={<p className="field-hint">Loading form...</p>}>
              <LearnerForm onSubmit={handleManualAdd} isSubmitting={isSubmittingLearner} />
            </Suspense>
          </section>
        ) : null}

        {isLoading ? (
          <section className="section-block" id="overview" aria-busy="true">
            <h2 className="section-heading">↗ Programme Support KPIs</h2>
            <div className="kpi-grid" aria-label="Loading KPI metrics">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="kpi-skeleton" role="presentation" />
              ))}
            </div>
          </section>
        ) : (
          <KpiGrid cards={visibleKpiCards} showHelperText={settings.showHelperText} />
        )}

        <section className="section-block" id="analytics">
          <h2 className="section-heading">⌁ Analytics and Visual Insights</h2>
          {isLoading ? <div className="skeleton-grid" aria-label="Loading charts" aria-busy="true"><div /><div /><div /></div> : null}
          {!isLoading && dashboard ? (
            <Suspense fallback={<p className="field-hint">Loading charts...</p>}>
              <DashboardCharts dashboard={dashboard} visibleCharts={settings.visibleCharts} />
            </Suspense>
          ) : null}
          {!isLoading && !dashboard ? <EmptyPanel title="Dashboard data unavailable" description="Graphics cannot be rendered while the API is offline." /> : null}
        </section>

        <RiskTable
          riskFlags={filteredRiskFlags}
          allRiskFlagsCount={riskFlags.length}
          learnerById={learnerById}
          riskQuery={riskQuery}
          onRiskQueryChange={setRiskQuery}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          settings={{
            showHelperText: settings.showHelperText,
            tableDensity: settings.tableDensity,
            privacyMode: settings.privacyMode,
            showRiskReasons: settings.showRiskReasons,
            highlightHighRiskLearners: settings.highlightHighRiskLearners
          }}
        />

        <section className="bottom-grid">
          <RecommendationsPanel recommendations={recommendations} isLoading={isLoading} />

          <ValidationPanel
            dataQualityPercent={formatPercent(dashboard?.dataQualityScore)}
            learnerCount={learners.length}
            validationErrors={uploadValidationErrors}
            validationStrictness={settings.validationStrictness}
          />
        </section>

        {settings.showResponsibleUseReminder ? (
          <ResponsibleUsePanel text={ethics?.responsibleUse ?? "This tool supports learner success. It must not be used to punish, exclude, or unfairly label learners. All high-risk cases require human review before action."} />
        ) : null}

        <footer className="app-footer">Student Support Insights Tool | Responsible data-informed learner support</footer>
      </main>

      <EthicsDeclarationModal isOpen={showEthicsModal} onClose={() => setShowEthicsModal(false)} onConfirm={confirmEthics} />
      <ConfirmModal
        isOpen={showNewReportConfirm}
        title="Start New Report"
        message="This will clear current filters, open forms, and the validation summary for the current session."
        confirmLabel="Start New Report"
        cancelLabel="Cancel"
        onConfirm={confirmNewReport}
        onCancel={() => setShowNewReportConfirm(false)}
      />
      <ConfirmModal
        isOpen={showUploadConfirm}
        icon="☁"
        title="Upload CSV"
        message={pendingUploadFile ? `Upload "${pendingUploadFile.name}"? This will replace the current dataset and refresh all analytics.` : ""}
        confirmLabel="Upload & Refresh"
        cancelLabel="Cancel"
        onConfirm={confirmUpload}
        onCancel={cancelUpload}
      />
      <HelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
      <SettingsModal
        isOpen={showSettingsModal}
        settings={settings}
        ethicsConfirmed={ethicsConfirmed}
        apiAvailable={apiAvailable}
        apiBaseUrl={API_BASE_URL}
        learnerCount={learners.length}
        dataQualityScore={dashboard?.dataQualityScore}
        onClose={() => setShowSettingsModal(false)}
        onSave={(next) => {
          setSettings(next);
          setShowSettingsModal(false);
          pushToast("success", "Settings saved.");
        }}
        onResetDefaults={() => {
          setSettings(defaultSettings);
          pushToast("info", "Settings reset to defaults.");
        }}
        onResetEthicsDeclaration={() => {
          setEthicsConfirmed(false);
          window.localStorage.removeItem(ETHICS_CONFIRMED_KEY);
          pushToast("info", "Ethics Declaration was reset. Learner data actions are locked again.");
        }}
        onCheckApiStatus={checkApiStatus}
      />
    </div>
  );
}

export default App;
