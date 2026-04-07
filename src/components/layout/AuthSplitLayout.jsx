import Button from "../ui/Button.jsx";

export default function AuthSplitLayout({
  eyebrow,
  title,
  text,
  highlights,
  formId,
  submitLabel,
  isSubmitting,
  children
}) {
  return (
    <section className="auth-layout">
      <div className="auth-aside">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="auth-text">{text}</p>
        <div className="auth-highlights">
          {highlights.map((highlight) => (
            <div key={highlight.label} className="auth-highlight-card">
              <span className="metric-label">{highlight.label}</span>
              <strong>{highlight.value}</strong>
              <p>{highlight.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-card">
          {children}
          <Button className="auth-submit" disabled={isSubmitting} form={formId} size="lg" type="submit">
            {submitLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
