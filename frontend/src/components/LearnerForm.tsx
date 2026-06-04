import { FormEvent, useState } from "react";
import { Learner } from "../types/models";

type Props = {
  onSubmit: (learner: Learner) => Promise<boolean>;
  isSubmitting: boolean;
};

const defaultLearner: Learner = {
  learnerId: "",
  ageBand: "18-24",
  province: "Western Cape",
  deviceAccess: "Laptop",
  internetAccess: "Reliable",
  digitalConfidence: 3,
  programmingConfidence: 3,
  aiFamiliarity: 3,
  employmentStatus: "Unemployed",
  supportNeed: "Academic support",
  attendanceRisk: "Low",
  notes: ""
};

type FieldKey =
  | "learnerId"
  | "province"
  | "digitalConfidence"
  | "programmingConfidence"
  | "aiFamiliarity"
  | "employmentStatus"
  | "supportNeed";

type FieldErrors = Partial<Record<FieldKey, string>>;
const FIELD_KEYS: FieldKey[] = [
  "learnerId",
  "province",
  "digitalConfidence",
  "programmingConfidence",
  "aiFamiliarity",
  "employmentStatus",
  "supportNeed"
];

const CONFIDENCE_FIELDS: Array<"digitalConfidence" | "programmingConfidence" | "aiFamiliarity"> = [
  "digitalConfidence",
  "programmingConfidence",
  "aiFamiliarity"
];

function buildTouchedState(): Partial<Record<FieldKey, boolean>> {
  return FIELD_KEYS.reduce<Partial<Record<FieldKey, boolean>>>((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});
}

function isFieldKey(key: keyof Learner): key is FieldKey {
  return FIELD_KEYS.includes(key as FieldKey);
}

function validateForm(data: Learner): FieldErrors {
  const errors: FieldErrors = {};

  if (data.learnerId.trim().length < 3) {
    errors.learnerId = "Learner ID must be at least 3 characters.";
  }

  if (data.province.trim().length < 2) {
    errors.province = "Province is required.";
  }

  for (const field of CONFIDENCE_FIELDS) {
    const value = Number(data[field]);
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      errors[field] = "Use a whole number from 1 to 5.";
    }
  }

  if (data.employmentStatus.trim().length < 2) {
    errors.employmentStatus = "Employment status is required.";
  }

  if (data.supportNeed.trim().length < 2) {
    errors.supportNeed = "Support need is required.";
  }

  return errors;
}

export default function LearnerForm({ onSubmit, isSubmitting }: Props) {
  const [learner, setLearner] = useState<Learner>(defaultLearner);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

  const handleFieldChange = <K extends keyof Learner>(key: K, value: Learner[K]) => {
    const nextLearner = { ...learner, [key]: value };
    setLearner(nextLearner);

    if (isFieldKey(key)) {
      const nextErrors = validateForm(nextLearner);
      setErrors(nextErrors);
    }
  };

  const handleBlur = (field: FieldKey) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validateForm(learner));
  };

  const errorFor = (field: FieldKey) => (touched[field] ? errors[field] : undefined);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = validateForm(learner);
    setErrors(nextErrors);
    setTouched(buildTouchedState());

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const success = await onSubmit(learner);
    if (success) {
      setLearner(defaultLearner);
      setErrors({});
      setTouched({});
    }
  };

  return (
    <form onSubmit={submit} className="form-shell" aria-busy={isSubmitting}>
      <h3>Manual Learner Entry</h3>
      <div className="form-grid">
        <div className="form-field">
          <input
            aria-label="Learner ID"
            placeholder="Learner ID"
            value={learner.learnerId}
            onChange={(e) => handleFieldChange("learnerId", e.target.value)}
            onBlur={() => handleBlur("learnerId")}
            aria-invalid={Boolean(errorFor("learnerId"))}
            className={errorFor("learnerId") ? "input-error" : ""}
            required
            disabled={isSubmitting}
          />
          {errorFor("learnerId") ? <p className="field-error">{errorFor("learnerId")}</p> : null}
        </div>

        <select value={learner.ageBand} onChange={(e) => handleFieldChange("ageBand", e.target.value)} disabled={isSubmitting}>
          <option>18-24</option>
          <option>25-29</option>
          <option>30-35</option>
        </select>

        <div className="form-field">
          <input
            aria-label="Province"
            placeholder="Province"
            value={learner.province}
            onChange={(e) => handleFieldChange("province", e.target.value)}
            onBlur={() => handleBlur("province")}
            aria-invalid={Boolean(errorFor("province"))}
            className={errorFor("province") ? "input-error" : ""}
            required
            disabled={isSubmitting}
          />
          {errorFor("province") ? <p className="field-error">{errorFor("province")}</p> : null}
        </div>

        <select value={learner.deviceAccess} onChange={(e) => handleFieldChange("deviceAccess", e.target.value)} disabled={isSubmitting}>
          <option>Laptop</option>
          <option>Shared laptop</option>
          <option>Phone only</option>
        </select>

        <select value={learner.internetAccess} onChange={(e) => handleFieldChange("internetAccess", e.target.value)} disabled={isSubmitting}>
          <option>Reliable</option>
          <option>Unstable</option>
          <option>Limited</option>
        </select>

        <div className="form-field">
          <input
            type="number"
            min={1}
            max={5}
            value={learner.digitalConfidence}
            onChange={(e) => handleFieldChange("digitalConfidence", Number(e.target.value))}
            onBlur={() => handleBlur("digitalConfidence")}
            aria-invalid={Boolean(errorFor("digitalConfidence"))}
            className={errorFor("digitalConfidence") ? "input-error" : ""}
            disabled={isSubmitting}
          />
          {errorFor("digitalConfidence") ? <p className="field-error">{errorFor("digitalConfidence")}</p> : null}
        </div>

        <div className="form-field">
          <input
            type="number"
            min={1}
            max={5}
            value={learner.programmingConfidence}
            onChange={(e) => handleFieldChange("programmingConfidence", Number(e.target.value))}
            onBlur={() => handleBlur("programmingConfidence")}
            aria-invalid={Boolean(errorFor("programmingConfidence"))}
            className={errorFor("programmingConfidence") ? "input-error" : ""}
            disabled={isSubmitting}
          />
          {errorFor("programmingConfidence") ? <p className="field-error">{errorFor("programmingConfidence")}</p> : null}
        </div>

        <div className="form-field">
          <input
            type="number"
            min={1}
            max={5}
            value={learner.aiFamiliarity}
            onChange={(e) => handleFieldChange("aiFamiliarity", Number(e.target.value))}
            onBlur={() => handleBlur("aiFamiliarity")}
            aria-invalid={Boolean(errorFor("aiFamiliarity"))}
            className={errorFor("aiFamiliarity") ? "input-error" : ""}
            disabled={isSubmitting}
          />
          {errorFor("aiFamiliarity") ? <p className="field-error">{errorFor("aiFamiliarity")}</p> : null}
        </div>

        <div className="form-field">
          <input
            aria-label="Employment status"
            placeholder="Employment status"
            value={learner.employmentStatus}
            onChange={(e) => handleFieldChange("employmentStatus", e.target.value)}
            onBlur={() => handleBlur("employmentStatus")}
            aria-invalid={Boolean(errorFor("employmentStatus"))}
            className={errorFor("employmentStatus") ? "input-error" : ""}
            required
            disabled={isSubmitting}
          />
          {errorFor("employmentStatus") ? <p className="field-error">{errorFor("employmentStatus")}</p> : null}
        </div>

        <div className="form-field">
          <input
            aria-label="Support need"
            placeholder="Support need"
            value={learner.supportNeed}
            onChange={(e) => handleFieldChange("supportNeed", e.target.value)}
            onBlur={() => handleBlur("supportNeed")}
            aria-invalid={Boolean(errorFor("supportNeed"))}
            className={errorFor("supportNeed") ? "input-error" : ""}
            required
            disabled={isSubmitting}
          />
          {errorFor("supportNeed") ? <p className="field-error">{errorFor("supportNeed")}</p> : null}
        </div>

        <select value={learner.attendanceRisk} onChange={(e) => handleFieldChange("attendanceRisk", e.target.value)} disabled={isSubmitting}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <textarea aria-label="Notes" placeholder="Notes" value={learner.notes} onChange={(e) => handleFieldChange("notes", e.target.value)} disabled={isSubmitting} />
      </div>
      <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding Learner..." : "Add Learner"}</button>
    </form>
  );
}
