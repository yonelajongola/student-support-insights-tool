import { ValidationError } from "../types/models";

type Props = {
  dataQualityPercent: string;
  learnerCount: number;
  validationErrors: ValidationError[];
  validationStrictness: "standard" | "strict";
};

const VALIDATION_FIELD_LABELS: Record<string, string> = {
  LearnerID: "Learner ID",
  AgeBand: "Age band",
  Province: "Province",
  DeviceAccess: "Device access",
  InternetAccess: "Internet access",
  DigitalConfidence: "Digital confidence",
  ProgrammingConfidence: "Programming confidence",
  AIFamiliarity: "AI familiarity",
  EmploymentStatus: "Employment status",
  SupportNeed: "Support need",
  AttendanceRisk: "Attendance risk",
  Notes: "Notes"
};

function validationFieldLabel(field: string) {
  return VALIDATION_FIELD_LABELS[field] ?? field.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function UploadValidationPanel({ validationErrors }: { validationErrors: ValidationError[] }) {
  if (validationErrors.length === 0) {
    return (
      <div className="validation-empty">
        <span aria-hidden="true">✓</span>
        <p>No validation issues found.</p>
      </div>
    );
  }

  return (
    <div className="validation-table-wrap" role="alert" aria-live="assertive">
      <table className="validation-table">
        <thead>
          <tr>
            <th>Row</th>
            <th>Field</th>
            <th>Issue</th>
            <th>Suggested Fix</th>
          </tr>
        </thead>
        <tbody>
          {validationErrors.slice(0, 8).map((item, index) => (
            <tr key={`${item.lineNumber ?? "manual"}-${item.field}-${index}`}>
              <td>{item.lineNumber ?? "Entry"}</td>
              <td>{validationFieldLabel(item.field)}</td>
              <td>{item.message}</td>
              <td>Correct the value and upload again.</td>
            </tr>
          ))}
        </tbody>
      </table>
      {validationErrors.length > 8 ? <p className="field-hint">Showing first 8 of {validationErrors.length} validation issues.</p> : null}
    </div>
  );
}

export default function ValidationPanel({
  dataQualityPercent,
  learnerCount,
  validationErrors,
  validationStrictness
}: Props) {
  return (
    <section className="section-block validation-card" id="data-quality">
      <h2 className="section-heading">🛡 Data Quality &amp; Validation</h2>
      <div className="quality-summary">
        <div className="quality-ring" aria-label={`Data quality ${dataQualityPercent}`}>
          <span>{dataQualityPercent}</span>
        </div>
        <div>
          <p className="quality-label">Overall Health</p>
          <p>{learnerCount} records loaded. {validationErrors.length} validation issue(s) currently visible.</p>
          {validationStrictness === "strict" ? <p className="setting-note">Strict validation is prepared for future backend rules.</p> : null}
        </div>
      </div>
      <UploadValidationPanel validationErrors={validationErrors} />
    </section>
  );
}
