import { Recommendation } from "../types/models";

type Props = {
  recommendations: Recommendation[];
  isLoading: boolean;
};

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-panel" role="status" aria-live="polite">
      <p className="empty-title">{title}</p>
      <p className="empty-description">{description}</p>
    </div>
  );
}

export default function RecommendationsPanel({ recommendations, isLoading }: Props) {
  return (
    <section className="section-block" id="recommendations">
      <h2 className="section-heading">☼ Programme Recommendations</h2>
      <div className="recommendation-list">
        {recommendations.slice(0, 4).map((item, index) => (
          <article className="recommendation-card" key={item.title}>
            <div>
              <h3>{item.title}</h3>
              <p>{item.rationale}</p>
              <a href="#student-risk">View Action →</a>
            </div>
            <span className={`priority-tag ${index === 0 ? "p1" : "p2"}`}>Priority: P{Math.min(index + 1, 3)}</span>
          </article>
        ))}
        {!isLoading && recommendations.length === 0 ? <EmptyPanel title="No recommendations yet" description="Recommendations populate after analytics run on available data." /> : null}
      </div>
    </section>
  );
}
