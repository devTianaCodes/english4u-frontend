const dayBars = [
  { day: "M", value: 76, tone: "accent" },
  { day: "T", value: 42, tone: "neutral" },
  { day: "W", value: 88, tone: "secondary" },
  { day: "T", value: 58, tone: "accent" },
  { day: "F", value: 34, tone: "neutral" },
  { day: "S", value: 64, tone: "secondary" },
  { day: "S", value: 52, tone: "accent" }
];

export default function WeeklyStudyGraphic() {
  return (
    <div className="weekly-study-graphic" aria-hidden="true">
      <div className="weekly-study-card">
        <div className="weekly-study-bars">
          {dayBars.map((bar, index) => (
            <div key={`${bar.day}-${index}`} className="weekly-study-column">
              <div className={`weekly-study-bar weekly-study-bar-${bar.tone}`} style={{ height: `${bar.value}%` }} />
              <span>{bar.day}</span>
            </div>
          ))}
        </div>
        <div className="weekly-study-overlay">
          <div>
            <p className="metric-label">goal</p>
            <strong>4 sessions</strong>
          </div>
          <div>
            <p className="metric-label">pace</p>
            <strong>steady</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
