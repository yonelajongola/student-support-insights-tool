import axios from "axios";
import { DashboardSummary, EthicsNotice, InsightsResponse, Learner, Recommendation, RiskFlag, UploadResult } from "../types/models";

const DEFAULT_API_BASE_URL = "https://student-support-api-yj-37613.azurewebsites.net/api";
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL).replace(/\/$/, "");

export class ApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

function flattenMessages(value: unknown): string[] {
  if (!value) return [];

  if (typeof value === "string") {
    return value.trim() ? [value.trim()] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenMessages(item));
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap((item) => flattenMessages(item));
  }

  return [];
}

function parseProblemDetailsMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;

  const problem = data as {
    message?: string;
    title?: string;
    detail?: string;
    error?: string;
    errors?: unknown;
    validationErrors?: Array<{ field?: string; message?: string }>;
  };

  const directMessage = [problem.message, problem.title, problem.detail, problem.error]
    .find((value) => typeof value === "string" && value.trim().length > 0);

  if (directMessage) {
    return directMessage;
  }

  const validationMessages = (problem.validationErrors ?? [])
    .map((item) => {
      const message = item.message?.trim();
      if (!message) return undefined;
      return item.field?.trim() ? `${item.field}: ${message}` : message;
    })
    .filter((value): value is string => Boolean(value));

  if (validationMessages.length > 0) {
    return validationMessages.join(" | ");
  }

  const errorMessages = flattenMessages(problem.errors);
  if (errorMessages.length > 0) {
    return errorMessages.join(" | ");
  }

  return undefined;
}

function toApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return new ApiError("Unexpected application error.");
  }

  const statusCode = error.response?.status;
  const serverMessage = parseProblemDetailsMessage(error.response?.data);

  if (serverMessage) {
    return new ApiError(serverMessage, statusCode);
  }

  if (statusCode === 401) {
    return new ApiError("Request was rejected by the API. Check authentication or API key configuration.", statusCode);
  }

  if (statusCode === 403) {
    return new ApiError("Request was blocked by the API. Confirm your permissions and backend policy settings.", statusCode);
  }

  if (error.code === "ECONNABORTED") {
    return new ApiError("Request timed out. Please try again.", statusCode);
  }

  if (!error.response) {
    return new ApiError("Cannot reach API. Check your network or backend service.");
  }

  return new ApiError(`Request failed with status ${statusCode ?? "unknown"}.`, statusCode);
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error))
);

export async function fetchLearners() {
  const response = await api.get<Learner[]>("/learners");
  return response.data;
}

export async function uploadCsv(file: File) {
  const form = new FormData();
  form.append("file", file);

  const response = await api.post<UploadResult>("/learners/upload", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data;
}

export async function submitManualLearner(learner: Learner) {
  const response = await api.post<UploadResult>("/learners", learner);
  return response.data;
}

export async function fetchDashboard() {
  const response = await api.get<DashboardSummary>("/insights/dashboard");
  return response.data;
}

export async function fetchRiskFlags() {
  const response = await api.get<RiskFlag[]>("/insights/risk-flags");
  return response.data;
}

export async function fetchRecommendations() {
  const response = await api.get<Recommendation[]>("/insights/recommendations");
  return response.data;
}

export async function fetchInsights() {
  const response = await api.get<InsightsResponse>("/insights/insights");
  return response.data;
}

export async function fetchEthicsNotice() {
  const response = await api.get<EthicsNotice>("/ethics/notice");
  return response.data;
}

export async function downloadExportCsv() {
  const response = await api.get("/learners/export", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "learner-export.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

