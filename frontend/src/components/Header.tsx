import Button from "./ui/Button";

type Props = {
  ethicsConfirmed: boolean;
  onOpenEthics: () => void;
};

export default function Header({ ethicsConfirmed, onOpenEthics }: Props) {
  return (
    <header className="dashboard-header">
      <div>
        <h1>Student Support Insights Tool</h1>
        <p>Responsible learner support analytics for programme teams</p>
      </div>
      <div className="header-actions">
        {ethicsConfirmed ? <span className="confirmed-badge">✓ Ethics Declaration Confirmed</span> : null}
        {!ethicsConfirmed ? (
          <Button variant="primary" type="button" onClick={onOpenEthics}>⚖ Ethics Declaration</Button>
        ) : null}
      </div>
    </header>
  );
}
