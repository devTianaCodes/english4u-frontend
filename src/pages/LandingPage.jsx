import { Link } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";

const pillars = [
  {
    title: "Placement-led onboarding",
    text: "Start learners at the right level with a quick diagnostic path instead of a generic catalog dump."
  },
  {
    title: "Short lesson loops",
    text: "Break learning into grammar, vocabulary, and reading blocks that are easy to complete consistently."
  },
  {
    title: "Progress visibility",
    text: "Surface streaks, unit completion, and quiz feedback so learners always know what to do next."
  }
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="stack-xl">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Portfolio-ready English LMS</p>
          <h1>Learn English with a path that feels structured, focused, and achievable.</h1>
          <p className="hero-text">
            English4U is designed as a modern self-paced platform with placement, guided lessons, and an admin-managed
            curriculum.
          </p>
          <div className="button-row">
            <Link className="button" to={user ? "/dashboard" : "/register"}>
              {user ? "Open dashboard" : "Start learning"}
            </Link>
            <Link className="button button-ghost" to="/admin">
              View admin area
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-grid">
            <div>
              <span className="metric-label">Current track</span>
              <strong>A2 Everyday English</strong>
            </div>
            <div>
              <span className="metric-label">Next lesson</span>
              <strong>Talking about routines</strong>
            </div>
            <div>
              <span className="metric-label">Streak</span>
              <strong>12 days</strong>
            </div>
            <div>
              <span className="metric-label">Quiz average</span>
              <strong>86%</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-3">
        {pillars.map((pillar) => (
          <SectionCard key={pillar.title} eyebrow="Core principle" title={pillar.title}>
            <p>{pillar.text}</p>
          </SectionCard>
        ))}
      </section>
    </div>
  );
}
