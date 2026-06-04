export type ThemeMode = "light" | "dark" | "system";
export type TableDensity = "comfortable" | "compact";
export type DefaultLandingSection = "overview" | "risk" | "recommendations" | "data-quality" | "ethics" | "export";
export type ValidationStrictness = "standard" | "strict";
export type ExportFormat = "csv" | "summary";

export type VisibleKpiKey =
  | "totalLearners"
  | "criticalRisk"
  | "highRisk"
  | "mediumRisk"
  | "lowRisk"
  | "internetRisk"
  | "deviceAccessGap"
  | "averageDigitalConfidence"
  | "averageProgrammingConfidence"
  | "aiReadinessScore"
  | "dataQualityScore"
  | "topSupportNeed";

export type VisibleChartKey =
  | "riskDistribution"
  | "supportNeedsBreakdown"
  | "deviceAccessDistribution"
  | "internetAccessByProvince"
  | "confidenceComparison";

export interface SettingsState {
  themeMode: ThemeMode;
  tableDensity: TableDensity;
  showHelperText: boolean;
  defaultLandingSection: DefaultLandingSection;
  visibleKpis: Record<VisibleKpiKey, boolean>;
  visibleCharts: Record<VisibleChartKey, boolean>;
  validationStrictness: ValidationStrictness;
  highlightHighRiskLearners: boolean;
  showRiskReasons: boolean;
  showResponsibleUseReminder: boolean;
  privacyMode: boolean;
  exportFormat: ExportFormat;
  includeRecommendationsInExport: boolean;
  includeValidationSummaryInExport: boolean;
  includeEthicsStatusInExport: boolean;
}

export const SETTINGS_STORAGE_KEY = "ssi_settings_v1";

export const defaultSettings: SettingsState = {
  themeMode: "light",
  tableDensity: "comfortable",
  showHelperText: true,
  defaultLandingSection: "overview",
  visibleKpis: {
    totalLearners: true,
    criticalRisk: true,
    highRisk: true,
    mediumRisk: true,
    lowRisk: true,
    internetRisk: true,
    deviceAccessGap: true,
    averageDigitalConfidence: true,
    averageProgrammingConfidence: true,
    aiReadinessScore: true,
    dataQualityScore: true,
    topSupportNeed: true
  },
  visibleCharts: {
    riskDistribution: true,
    supportNeedsBreakdown: true,
    deviceAccessDistribution: true,
    internetAccessByProvince: true,
    confidenceComparison: true
  },
  validationStrictness: "standard",
  highlightHighRiskLearners: true,
  showRiskReasons: true,
  showResponsibleUseReminder: true,
  privacyMode: true,
  exportFormat: "csv",
  includeRecommendationsInExport: true,
  includeValidationSummaryInExport: true,
  includeEthicsStatusInExport: true
};

export const defaultLandingSectionHash: Record<DefaultLandingSection, string> = {
  overview: "#overview",
  risk: "#student-risk",
  recommendations: "#recommendations",
  "data-quality": "#data-quality",
  ethics: "#ethics",
  export: "#export-actions"
};

export const kpiLabels: Record<VisibleKpiKey, string> = {
  totalLearners: "Total Learners",
  criticalRisk: "Critical Risk",
  highRisk: "High Risk",
  mediumRisk: "Medium Risk",
  lowRisk: "Low Risk",
  internetRisk: "Internet Risk",
  deviceAccessGap: "Device Access Gap",
  averageDigitalConfidence: "Average Digital Confidence",
  averageProgrammingConfidence: "Average Programming Confidence",
  aiReadinessScore: "AI Readiness Score",
  dataQualityScore: "Data Quality Score",
  topSupportNeed: "Top Support Need"
};

export const chartLabels: Record<VisibleChartKey, string> = {
  riskDistribution: "Risk Distribution",
  supportNeedsBreakdown: "Support Needs Breakdown",
  deviceAccessDistribution: "Device Access Distribution",
  internetAccessByProvince: "Internet Access by Province",
  confidenceComparison: "Confidence Comparison"
};
