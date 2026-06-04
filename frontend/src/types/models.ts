export type Learner = {
  learnerId: string;
  ageBand: string;
  province: string;
  deviceAccess: string;
  internetAccess: string;
  digitalConfidence: number;
  programmingConfidence: number;
  aiFamiliarity: number;
  employmentStatus: string;
  supportNeed: string;
  attendanceRisk: string;
  notes: string;
};

export type Recommendation = {
  title: string;
  rationale: string;
  action: string;
};

export type DashboardSummary = {
  totalLearners: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  criticalRiskCount: number;
  deviceGapPercent: number;
  internetRiskPercent: number;
  averageDigitalConfidence: number;
  averageProgrammingConfidence: number;
  averageAiFamiliarity: number;
  topSupportNeed: string;
  dataQualityScore: number;
  riskCategoryDistribution: Record<string, number>;
  attendanceRiskDistribution: Record<string, number>;
  supportNeedDistribution: Record<string, number>;
  deviceAccessDistribution: Record<string, number>;
  internetAccessByProvince: Record<string, Record<string, number>>;
};

export type RiskFlag = {
  learnerId: string;
  attendanceRisk: string;
  supportNeed: string;
  internetAccess: string;
  deviceAccess: string;
  riskReason: string;
  riskFactors?: string[];
  riskReasonCodes?: string[];
  riskScore?: number;
  priority?: "Critical" | "High" | "Medium" | "Low";
};

export type InsightsResponse = {
  insights: string[];
};

export type ValidationError = {
  lineNumber?: number;
  field: string;
  message: string;
};

export type UploadResult = {
  importedCount: number;
  rejectedCount: number;
  errors: string[];
  validationErrors: ValidationError[];
};

export type EthicsNotice = {
  privacyNotice: string;
  consent: string;
  responsibleUse: string;
  corePrinciples: string[];
  fairnessChecks?: string[];
  humanReviewChecklist: string[];
  nonAutomatedDecisions: string[];
  dataProtectionControls?: string[];
  accountabilityActions?: string[];
  retentionGuidance?: string;
  lastUpdated: string;
};
