import { Learner, RiskFlag } from "../types/models";
import { SettingsState } from "../types/settings";

type Props = {
  riskFlags: RiskFlag[];
  allRiskFlagsCount: number;
  learnerById: Map<string, Learner>;
  riskQuery: string;
  onRiskQueryChange: (value: string) => void;
  priorityFilter: PriorityFilter;
  onPriorityFilterChange: (value: PriorityFilter) => void;
  settings: Pick<SettingsState, "showHelperText" | "tableDensity" | "privacyMode" | "showRiskReasons" | "highlightHighRiskLearners">;
};

export type PriorityFilter = "All" | "Critical" | "High" | "Medium" | "Low";
const PRIORITY_OPTIONS: PriorityFilter[] = ["All", "Critical", "High", "Medium", "Low"];

function normalizePriority(priority: string | undefined): Exclude<PriorityFilter, "All"> {
  const value = (priority ?? "Medium") as PriorityFilter;
  return PRIORITY_OPTIONS.includes(value) && value !== "All" ? value : "Medium";
}

function riskChipClass(priority: string | undefined) {
  return `status-chip status-${normalizePriority(priority).toLowerCase()}`;
}

function getRiskFactors(item: RiskFlag): string[] {
  if (item.riskReasonCodes?.length) return item.riskReasonCodes;
  if (item.riskFactors?.length) return item.riskFactors;

  return item.riskReason
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function formatFactorCode(code: string) {
  return code
    .split("_")
    .join(" ")
    .toLowerCase()
    .replace(/(^|\s)\S/g, (value: string) => value.toUpperCase());
}

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-panel" role="status" aria-live="polite">
      <p className="empty-title">{title}</p>
      <p className="empty-description">{description}</p>
    </div>
  );
}

export default function RiskTable({
  riskFlags,
  allRiskFlagsCount,
  learnerById,
  riskQuery,
  onRiskQueryChange,
  priorityFilter,
  onPriorityFilterChange,
  settings
}: Props) {
  return (
    <section className="section-block" id="student-risk">
      <div className="section-toolbar">
        <div>
          <h2 className="section-heading">▣ Learner Risk Review</h2>
          {settings.showHelperText ? <p className="section-note">Risk scores are decision-support indicators and must be reviewed by staff before action is taken.</p> : null}
        </div>
        <div className="risk-controls">
          <input
            type="search"
            value={riskQuery}
            onChange={(event) => onRiskQueryChange(event.target.value)}
            placeholder="Search ID or factor"
            aria-label="Search risk flags"
          />
          <select value={priorityFilter} onChange={(event) => onPriorityFilterChange(event.target.value as PriorityFilter)} aria-label="Filter by risk priority">
            {PRIORITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>

      <div className="risk-table-card">
        <table className={`risk-table ${settings.tableDensity}`}>
          <thead>
            <tr>
              <th>Learner ID</th>
              <th>Risk Level</th>
              <th>Key Indicators</th>
              <th>Support Needed</th>
              {!settings.privacyMode ? <th>Province</th> : null}
              <th>Engagement</th>
            </tr>
          </thead>
          <tbody>
            {riskFlags.map((item) => {
              const learner = learnerById.get(item.learnerId);
              const priority = normalizePriority(item.priority);
              const score = item.riskScore ?? 0;
              const emphasize = settings.highlightHighRiskLearners && (priority === "High" || priority === "Critical");

              return (
                <tr key={item.learnerId} className={emphasize ? "risk-emphasis" : ""}>
                  <td>
                    <div className="learner-cell">
                      <span className="avatar" aria-hidden="true">{item.learnerId.slice(-2)}</span>
                      <div>
                        <p>{item.learnerId}</p>
                        {!settings.privacyMode ? <small>{learner?.ageBand ?? "Age band n/a"}</small> : null}
                      </div>
                    </div>
                  </td>
                  <td><span className={riskChipClass(priority)}>{priority}</span></td>
                  <td>{settings.showRiskReasons ? (getRiskFactors(item).slice(0, 3).map(formatFactorCode).join(", ") || item.riskReason) : "Hidden by settings"}</td>
                  <td>{item.supportNeed}</td>
                  {!settings.privacyMode ? <td>{learner?.province ?? "—"}</td> : null}
                  <td>
                    <div className="engagement-bar" aria-label={`Risk score ${score}`}>
                      <span style={{ width: `${Math.min(score, 100)}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {riskFlags.length === 0 ? <EmptyPanel title="No learner records loaded yet" description="Upload learner data after confirming the ethics declaration." /> : null}
        {riskFlags.length > 0 ? <div className="table-footer">Showing {riskFlags.length} of {allRiskFlagsCount} flagged learners</div> : null}
      </div>
    </section>
  );
}
