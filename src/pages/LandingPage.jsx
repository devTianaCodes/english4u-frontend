import SectionCard from "../components/layout/SectionCard.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";
import Button from "../components/ui/Button.jsx";
import CoursePathGraphic from "../components/ui/CoursePathGraphic.jsx";

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

const actionZones = [
  {
    eyebrow: "Placement test",
    title: "Take a fast level check",
    text: "Start with a guided diagnostic instead of browsing blindly through the catalog.",
    to: "/onboarding"
  },
  {
    eyebrow: "Dashboard",
    title: "Track visible progress",
    text: "Keep weekly focus, streak, and next lesson in one professional learner space.",
    to: "/dashboard"
  },
  {
    eyebrow: "Admin CMS",
    title: "Manage course content",
    text: "Author structured learning paths, lessons, and quizzes from the integrated CMS.",
    to: "/admin"
  }
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="stack-xl">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Professional English learning platform</p>
          <h1>Master English. Transform your future.</h1>
          <p className="hero-text">
            English4U combines guided placement, structured lessons, and visible progress so learners always know their
            next step.
          </p>
          <div className="hero-meta">
            <span>Guided courses</span>
            <span>Real progress</span>
            <span>Admin-managed curriculum</span>
          </div>
          <div className="button-row">
            <Button size="lg" to={user ? "/dashboard" : "/register"}>
              {user ? "Open dashboard" : "Start your journey"}
            </Button>
            <Button size="lg" to={user ? "/onboarding" : "/register"} variant="secondary">
              Take free level test
            </Button>
          </div>
        </div>

        <div className="hero-panel">
          <CoursePathGraphic />
        </div>
      </section>

      <section className="grid grid-3">
        {pillars.map((pillar) => (
          <SectionCard key={pillar.title} eyebrow="Core principle" title={pillar.title}>
            <p>{pillar.text}</p>
          </SectionCard>
        ))}
      </section>

      <section className="grid grid-3">
        {actionZones.map((zone) => (
          <SectionCard
            key={zone.title}
            eyebrow={zone.eyebrow}
            footer={
              <Button to={zone.to} variant="secondary">
                Open
              </Button>
            }
            title={zone.title}
            tone="featured"
          >
            <p>{zone.text}</p>
          </SectionCard>
        ))}
      </section>
    </div>
  );
}
