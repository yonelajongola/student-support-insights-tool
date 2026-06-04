type KpiTone = "neutral" | "critical" | "high" | "medium" | "low" | "primary";

export type KpiCardModel = {
  title: string;
  value: string;
  helper: string;
  tone?: KpiTone;
  icon: string;
};

type Props = {
  cards: KpiCardModel[];
  showHelperText: boolean;
};

function KpiCard({ title, value, helper, tone = "neutral", icon, showHelperText }: KpiCardModel & { showHelperText: boolean }) {
  return (
    <article className={`kpi-card kpi-${tone}`} aria-label={`${title}: ${value}`}>
      <span className="kpi-icon" aria-hidden="true">{icon}</span>
      <p className="kpi-label">{title}</p>
      <p className="kpi-value">{value}</p>
      {showHelperText ? <p className="kpi-helper">{helper}</p> : null}
    </article>
  );
}

export default function KpiGrid({ cards, showHelperText }: Props) {
  return (
    <section className="section-block" id="overview">
      <h2 className="section-heading">↗ Programme Support KPIs</h2>
      <div className="kpi-grid">
        {cards.map((item) => (
          <KpiCard key={item.title} {...item} showHelperText={showHelperText} />
        ))}
      </div>
    </section>
  );
}
