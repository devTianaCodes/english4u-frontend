const defaultBars = [
  { day: "M", value: 76, tone: "accent" },
  { day: "T", value: 42, tone: "neutral" },
  { day: "W", value: 88, tone: "secondary" },
  { day: "T", value: 58, tone: "accent" },
  { day: "F", value: 34, tone: "neutral" },
  { day: "S", value: 64, tone: "secondary" },
  { day: "S", value: 52, tone: "accent" }
];

function mapBars(days) {
  if (!Array.isArray(days) || days.length === 0) {
    return defaultBars;
  }

  return days.map((day, index) => ({
    day: day.label,
    value: day.intensity ?? 0,
    tone: day.activityCount > 1 ? "secondary" : day.activityCount > 0 ? "accent" : index % 2 === 0 ? "neutral" : "accent"
  }));
}

export default function WeeklyStudyGraphic({ days, goalLabel = "4 sessions", paceLabel = "steady" }) {
  const bars = mapBars(days);

  return (
    <div className="weekly-study-graphic" aria-hidden="true">
      <div className="weekly-study-card">
        <div className="weekly-study-bars">
          {bars.map((bar, index) => (
            <div key={`${bar.day}-${index}`} className="weekly-study-column">
              <div className={`weekly-study-bar weekly-study-bar-${bar.tone}`} style={{ height: `${bar.value}%` }} />
              <span>{bar.day}</span>
            </div>
          ))}
        </div>
        <div className="weekly-study-overlay">
          <div>
            <p className="metric-label">goal</p>
            <strong>{goalLabel}</strong>
          </div>
          <div>
            <p className="metric-label">pace</p>
            <strong>{paceLabel}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
