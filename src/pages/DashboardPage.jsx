import { useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import WeeklyStudyGraphic from "../components/ui/WeeklyStudyGraphic.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";
import { useStudyPreferences } from "../features/progress/useStudyPreferences.js";
import { apiRequest, endpoints } from "../services/api.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const { preferences } = useStudyPreferences();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadDashboard() {
      try {
        const response = await apiRequest(endpoints.dashboard);

        if (!isCancelled) {
          setDashboard(response);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  const continueCards = [
    {
      title: "Continue unit",
      text: dashboard?.nextLesson
        ? `${dashboard.nextLesson.unitTitle} · ${dashboard.nextLesson.title}`
        : `${dashboard?.currentCourse ?? "Your current course"} is ready for the next lesson.`,
      to: dashboard?.nextLesson ? `/lessons/${dashboard.nextLesson.id}` : "/courses",
      progress: Math.min(dashboard?.completedLessons ? dashboard.completedLessons * 5 : 18, 100)
    },
    {
      title: "Review vocabulary",
      text: "Use short review loops to reinforce the words you met in recent lessons.",
      to: "/courses",
      progress: 54
    },
    {
      title: "Take quiz",
      text: dashboard?.nextLesson
        ? `Checkpoint for ${dashboard.nextLesson.title} is ready when you finish the lesson.`
        : "Finish the current lesson to unlock the next checkpoint.",
      to: dashboard?.nextLesson ? `/quizzes/${dashboard.nextLesson.quizId}` : "/courses",
      progress: dashboard?.quizAverage ?? 0
    }
  ];

  const statCards = [
    { label: "Current level", value: dashboard?.currentLevel ?? "A1", note: "active path" },
    { label: "Lessons done", value: dashboard?.completedLessons ?? 0, note: "completed" },
    { label: "Streak", value: `${dashboard?.streak ?? 0} days`, note: "consistency" },
    { label: "Quiz average", value: `${dashboard?.quizAverage ?? 0}%`, note: "latest score" }
  ];

  const achievements = [
    {
      title: "Consistency streak",
      icon: "St",
      note: `Active for ${dashboard?.streak ?? 0} consecutive learning days`,
      meta: "earned this week"
    },
    {
      title: "Checkpoint focus",
      icon: "Qz",
      note: `${dashboard?.quizAverage ?? 0}% average across recent quizzes`,
      meta: "performance badge"
    },
    {
      title: "Course momentum",
      icon: dashboard?.currentLevel ?? "A1",
      note: `${dashboard?.completedLessons ?? 0} completed lessons in the current path`,
      meta: "path progress"
    }
  ];

  if (!dashboard && !error) {
    return (
      <div className="stack-lg">
        <div className="skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line-short" />
        </div>
        <div className="grid grid-2">
          <div className="skeleton-card">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
          </div>
          <div className="skeleton-card">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line-short" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">Welcome back</p>
          <h1>Your learning dashboard</h1>
          <p>
            {dashboard
              ? `Welcome ${dashboard.learner.name}. Keep the next action obvious and continue your ${dashboard.currentLevel} path.`
              : `Welcome ${user?.firstName ?? "back"}. Keep the next action obvious and continue your current learning path.`}
          </p>
          <div className="button-row">
            <Button to={dashboard?.nextLesson ? `/lessons/${dashboard.nextLesson.id}` : "/courses"}>Continue learning</Button>
            <Button to="/courses" variant="secondary">Browse courses</Button>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
        </div>

        <div className="dashboard-hero-panel">
          <p className="metric-label">This week</p>
          <div className="dashboard-stats-grid">
            {statCards.map((card) => (
              <div key={card.label} className="dashboard-stat-card">
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.note}</p>
              </div>
            ))}
          </div>
          <WeeklyStudyGraphic />
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="section-card section-card-featured">
          <p className="eyebrow">Study rhythm</p>
          <h2>Your weekly plan</h2>
          <div className="stat-row">
            <div className="stat-chip">
              <strong>{preferences.sessionsPerWeek}</strong>
              <span>sessions / week</span>
            </div>
            <div className="stat-chip">
              <strong>{preferences.minutesPerSession}</strong>
              <span>minutes / session</span>
            </div>
            <div className="stat-chip">
              <strong>{preferences.sessionsPerWeek * preferences.minutesPerSession}</strong>
              <span>minutes / week</span>
            </div>
          </div>
          <div className="section-card-footer">
            <Button to="/profile" variant="secondary">Edit plan</Button>
          </div>
        </article>

        <article className="section-card">
          <p className="eyebrow">Focus area</p>
          <h2>{preferences.focus}</h2>
          <p>
            Keep your weekly target realistic and tie it to one clear learning focus. Small consistency beats long,
            irregular sessions.
          </p>
          <div className="dashboard-focus-strip">
            <span>Current course</span>
            <strong>{dashboard?.currentCourse ?? "Guided learner path"}</strong>
          </div>
        </article>
      </section>

      <section className="stack-sm">
        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">Continue learning</p>
            <h2>Next actions</h2>
          </div>
          <p className="support-copy">Short, focused actions keep the path feeling clear and professional.</p>
        </div>

        <div className="dashboard-progress-list">
        {continueCards.map((card) => (
          <article key={card.title} className="course-progress-card">
            <div className="course-progress-copy">
              <p className="eyebrow">Continue learning</p>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${card.progress}%` }} />
              </div>
              <p className="support-copy">{card.progress}% ready</p>
            </div>
            <Button to={card.to} variant="secondary">Open</Button>
          </article>
        ))}
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="section-card">
          <p className="eyebrow">Achievements</p>
          <h2>Your milestones</h2>
          <div className="achievement-grid">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="achievement-card">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="stack-sm">
                  <strong>{achievement.title}</strong>
                  <p>{achievement.note}</p>
                  <span className="metric-label">{achievement.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="section-card section-card-featured">
          <p className="eyebrow">Level progress</p>
          <h2>Your English level</h2>
          <div className="level-progress-card">
            <div className="level-progress-top">
              <span>Current</span>
              <strong>{dashboard?.currentLevel ?? "A1"}</strong>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${Math.min((dashboard?.quizAverage ?? 0), 100)}%` }} />
            </div>
            <p className="support-copy">
              Next target: {dashboard?.currentLevel === "A2" ? "B1" : "A2"} · keep quiz results above 75% and finish the
              current unit checkpoint.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
