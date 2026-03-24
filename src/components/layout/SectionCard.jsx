export default function SectionCard({ eyebrow, title, children, footer, tone = "default" }) {
  return (
    <section className={`section-card section-card-${tone}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      <div className="section-card-body">{children}</div>
      {footer ? <div className="section-card-footer">{footer}</div> : null}
    </section>
  );
}
