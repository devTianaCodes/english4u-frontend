import SectionCard from "../components/layout/SectionCard.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";
import Button from "../components/ui/Button.jsx";
import CoursePathGraphic from "../components/ui/CoursePathGraphic.jsx";

const experienceTracks = [
  {
    eyebrow: "Everyday English",
    title: "Build routine confidence",
    text: "Short guided lessons for introductions, daily life, travel, and simple conversations.",
    cta: "/courses"
  },
  {
    eyebrow: "Work and study",
    title: "Learn with practical outcomes",
    text: "Weekly plans, review loops, and checkpoint quizzes that keep English useful for real schedules.",
    cta: "/study-plan"
  },
  {
    eyebrow: "Certificate readiness",
    title: "Track milestone progress",
    text: "Use placement, streaks, and quiz performance to see when your path is ready for a stronger certificate story.",
    cta: "/certificates"
  }
];

const formats = [
  {
    title: "Adaptive level test",
    text: "Start with a guided online check so the platform recommends the right level instead of a random first course."
  },
  {
    title: "Structured self-paced paths",
    text: "Move through units, checkpoints, grammar support, and review lanes with a clear next action."
  },
  {
    title: "Progress with purpose",
    text: "Study plans, coach recommendations, and certificate signals turn practice into something more professional."
  }
];

const journalEntries = [
  {
    title: "How to study English in 20 minutes a day",
    text: "A simple weekly rhythm for learners who want consistency without long study blocks.",
    tag: "Study habits"
  },
  {
    title: "A1 to A2: what should feel easier next",
    text: "Use placement and checkpoints to see which skills are actually improving.",
    tag: "Level guide"
  },
  {
    title: "When to review grammar and when to keep moving",
    text: "Use review lanes without getting stuck in correction-only mode.",
    tag: "Grammar support"
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
            <span>Placement-first</span>
            <span>Certificate-ready rhythm</span>
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

      <section className="test-drive-banner">
        <div className="test-drive-copy">
          <p className="eyebrow">Online placement test</p>
          <h2>Start with the right level, not the wrong course.</h2>
          <p>
            Inspired by stronger online-school onboarding flows, E4U now pushes the level check to the front so the
            learner sees a guided path immediately.
          </p>
        </div>
        <div className="test-drive-actions">
          <Button to={user ? "/onboarding" : "/register"}>Open test</Button>
        </div>
      </section>

      <section className="grid grid-3">
        {experienceTracks.map((track) => (
          <SectionCard
            key={track.title}
            eyebrow={track.eyebrow}
            footer={<Button to={track.cta} variant="secondary">Explore</Button>}
            title={track.title}
            tone="featured"
          >
            <p>{track.text}</p>
          </SectionCard>
        ))}
      </section>

      <section className="journey-split">
        <article className="journey-panel journey-panel-here">
          <p className="eyebrow">Here</p>
          <h2>Keep learning inside your weekly routine</h2>
          <p>
            Use short sessions, review lanes, and coach guidance to keep English moving even on busy weeks.
          </p>
          <ul className="journey-list">
            <li>Study plan with realistic weekly targets</li>
            <li>Warm-up, grammar, and vocabulary review modes</li>
            <li>Dashboard recommendations tied to your pace</li>
          </ul>
        </article>

        <article className="journey-panel journey-panel-there">
          <p className="eyebrow">There</p>
          <h2>Turn progress into stronger outcomes</h2>
          <p>
            Build toward clearer checkpoint performance, certificate readiness, and a more professional English story.
          </p>
          <ul className="journey-list">
            <li>Placement trend and checkpoint visibility</li>
            <li>Certificate milestone tracking</li>
            <li>Course paths that feel like a real academy structure</li>
          </ul>
        </article>
      </section>

      <section className="grid grid-3">
        {formats.map((format) => (
          <SectionCard key={format.title} eyebrow="Learning format" title={format.title}>
            <p>{format.text}</p>
          </SectionCard>
        ))}
      </section>

      <section className="journal-teaser">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">Learning journal</p>
            <h2>News, tips, and study guidance</h2>
          </div>
          <Button to="/journal" variant="secondary">Open journal</Button>
        </div>
        <div className="grid grid-3">
          {journalEntries.map((entry) => (
            <article key={entry.title} className="journal-card">
              <span className="course-card-level">{entry.tag}</span>
              <h3>{entry.title}</h3>
              <p>{entry.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
