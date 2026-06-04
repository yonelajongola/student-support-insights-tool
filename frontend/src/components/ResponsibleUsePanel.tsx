type Props = {
  text: string;
};

export default function ResponsibleUsePanel({ text }: Props) {
  return (
    <section className="responsible-card" id="ethics">
      <h2>Responsible Use Reminder</h2>
      <p>{text}</p>
      <div className="check-grid">
        <span>✓ Consent considered</span>
        <span>✓ Data anonymised where possible</span>
        <span>✓ Human review required</span>
        <span>✓ Bias checked before decisions</span>
        <span>✓ Sensitive data protected</span>
      </div>
    </section>
  );
}
