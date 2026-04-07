import Button from "../components/ui/Button.jsx";

const settingsAreas = [
  {
    title: "Profile details",
    text: "Review account identity, role, and placement summary.",
    to: "/profile"
  },
  {
    title: "Study plan",
    text: "Tune weekly sessions, minutes, and learning focus.",
    to: "/study-plan"
  },
  {
    title: "Placement",
    text: "Retake the level check and compare your recent placement trend.",
    to: "/onboarding"
  }
];

export default function SettingsPage() {
  return (
    <div className="stack-lg">
      <section className="section-card section-card-featured">
        <p className="eyebrow">Settings</p>
        <h1>Learning preferences and account controls</h1>
        <p>
          Keep learner settings grouped in one place: account details, study rhythm, and placement calibration.
        </p>
      </section>

      <section className="dashboard-grid">
        {settingsAreas.map((area) => (
          <article key={area.title} className="section-card">
            <p className="eyebrow">Settings area</p>
            <h2>{area.title}</h2>
            <p>{area.text}</p>
            <div className="section-card-footer">
              <Button to={area.to} variant="secondary">Open</Button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
