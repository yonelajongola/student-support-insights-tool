import { ReactNode } from "react";

type Props = {
  id: string;
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
};

export default function SelectField({ id, label, description, value, onChange, children }: Props) {
  return (
    <label className="setting-control" htmlFor={id}>
      <div className="setting-copy">
        <span className="setting-label">{label}</span>
        {description ? <span className="setting-description">{description}</span> : null}
      </div>
      <select id={id} className="setting-select" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
    </label>
  );
}
