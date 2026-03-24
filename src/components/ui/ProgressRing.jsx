export default function ProgressRing({ value, label }) {
  const bounded = Math.max(0, Math.min(100, value));
  const style = {
    background: `conic-gradient(var(--color-accent) ${bounded * 3.6}deg, rgba(17, 38, 54, 0.12) 0deg)`
  };

  return (
    <div className="progress-ring">
      <div className="progress-ring-outer" style={style}>
        <div className="progress-ring-inner">
          <strong>{bounded}%</strong>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}
