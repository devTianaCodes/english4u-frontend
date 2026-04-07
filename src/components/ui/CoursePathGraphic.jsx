const pathSteps = [
  {
    eyebrow: "Placement",
    title: "Level assessment",
    detail: "15 min diagnostic",
    status: "ready"
  },
  {
    eyebrow: "Unit 01",
    title: "Introductions and basics",
    detail: "3 lessons · speaking focus",
    status: "active"
  },
  {
    eyebrow: "Unit 02",
    title: "Daily routine",
    detail: "next step · vocabulary + grammar",
    status: "upcoming"
  }
];

const pathMetrics = [
  { label: "Current level", value: "A2" },
  { label: "Completion", value: "62%" },
  { label: "Checkpoint", value: "86%" }
];

export default function CoursePathGraphic() {
  return (
    <div aria-hidden="true" className="course-path-graphic">
      <div className="course-path-header">
        <div>
          <p className="metric-label">guided path</p>
          <strong>Structured course journey</strong>
        </div>
        <span className="course-path-badge">self-paced</span>
      </div>

      <div className="course-path-flow">
        {pathSteps.map((step, index) => (
          <div key={step.title} className={`course-path-panel course-path-panel-${step.status}`}>
            <div className="course-path-panel-top">
              <span className="metric-label">{step.eyebrow}</span>
              <span className="course-path-step-index">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <strong>{step.title}</strong>
            <p>{step.detail}</p>
          </div>
        ))}
      </div>

      <div className="course-path-metrics">
        {pathMetrics.map((metric) => (
          <div key={metric.label} className="course-path-metric">
            <span className="metric-label">{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
