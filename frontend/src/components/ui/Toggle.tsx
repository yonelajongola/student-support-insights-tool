type Props = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Toggle({ id, label, description, checked, onChange }: Props) {
  return (
    <label className="setting-control" htmlFor={id}>
      <div className="setting-copy">
        <span className="setting-label">{label}</span>
        {description ? <span className="setting-description">{description}</span> : null}
      </div>
      <span className="toggle-wrap">
        <input
          id={id}
          type="checkbox"
          className="toggle-input"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="toggle-track" aria-hidden="true" />
      </span>
    </label>
  );
}
