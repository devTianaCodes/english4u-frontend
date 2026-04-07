import { useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import WeeklyStudyGraphic from "../components/ui/WeeklyStudyGraphic.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";
import { useStudyPreferences } from "../features/progress/useStudyPreferences.js";
import { apiRequest, endpoints } from "../services/api.js";

function buildContinueCards(dashboard) {
  return [
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
      text:
        dashboard?.reviewDueCount > 0
          ? `${dashboard.reviewDueCount} review prompt${dashboard.reviewDueCount === 1 ? "" : "s"} are ready from recent work.`
          : "Use short review loops to reinforce the words you met in recent lessons.",
      to: "/review/vocabulary",
      progress: dashboard?.reviewDueCount ? Math.min(dashboard.reviewDueCount * 20, 100) : 32
    },
    {
      title: "Take quiz",
      text: dashboard?.nextLesson
        ? `Checkpoint for ${dashboard.nextLesson.title} is ready when you finish the lesson.`
        : "Finish the current lesson to unlock the next checkpoint.",
      to: dashboard?.nextLesson?.quizId ? `/quizzes/${dashboard.nextLesson.quizId}` : "/courses",
      progress: dashboard?.quizAverage ?? 0
    }
  ];
}

function buildSidebarLinks(reviewPath) {
  return [
    { title: "Active path", note: "Return to your next lesson or course", to: "/courses" },
    { title: "Review lane", note: "Use the review mode tied to your current focus", to: reviewPath },
    { title: "Certificates", note: "See milestone readiness and progress signals", to: "/certificates" },
    { title: "Settings", note: "Account, preferences, and placement controls", to: "/settings" }
  ];
}

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
          setError("Dashboard data is temporarily unavailable. Refresh after the backend finishes loading.");
        }
      }
    }

    loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  const activePreferences = dashboard?.studyPlan ?? preferences;
  const reviewPath =
    activePreferences.focus === "Grammar accuracy"
      ? "/review/grammar"
      : activePreferences.focus === "Vocabulary growth"
        ? "/review/vocabulary"
        : "/review/warm-up";
  const continueCards = buildContinueCards(dashboard);
  const sidebarLinks = buildSidebarLinks(reviewPath);
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
  const coachRecommendation = dashboard?.coachRecommendation;
  const paceLabel =
    dashboard?.weeklyActivity?.completedSessions >= activePreferences.sessionsPerWeek ? "on pace" : "building";

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
    <div className="dashboard-layout-shell">
      <aside className="dashboard-sidebar-rail">
        <section className="section-card dashboard-sidebar-card">
          <p className="eyebrow">Dashboard menu</p>
          <h2>Quick access</h2>
          <div className="dashboard-sidebar-links">
            {sidebarLinks.map((link) => (
              <Button key={link.title} className="dashboard-sidebar-link" to={link.to} variant="ghost">
                <span>{link.title}</span>
                <small>{link.note}</small>
              </Button>
            ))}
          </div>
        </section>

        <section className="section-card dashboard-sidebar-card section-card-featured">
          <p className="eyebrow">Certificates</p>
          <h2>Readiness</h2>
          <div className="dashboard-sidebar-metric">
            <strong>{achievements.filter((achievement) => achievement.note).length}</strong>
            <span>live milestones</span>
          </div>
          <p>
            Keep lesson completion, quiz accuracy, and consistency moving together so certificate readiness feels earned.
          </p>
          <div className="section-card-footer">
            <Button to="/certificates" variant="secondary">Open certificates</Button>
          </div>
        </section>

        <section className="section-card dashboard-sidebar-card">
          <p className="eyebrow">Account controls</p>
          <h2>Settings hub</h2>
          <p>Manage profile details, study rhythm, and placement tracking from one cleaner settings area.</p>
          <div className="section-card-footer">
            <Button to="/settings" variant="secondary">Open settings</Button>
          </div>
        </section>
      </aside>

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
              <Button to={dashboard?.nextLesson ? `/lessons/${dashboard.nextLesson.id}` : "/courses"}>
                Continue learning
              </Button>
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
            <WeeklyStudyGraphic
              days={dashboard?.weeklyActivity?.days}
              goalLabel={`${activePreferences.sessionsPerWeek} sessions`}
              paceLabel={paceLabel}
            />
          </div>
        </section>

        <section className="dashboard-grid">
          <article className="section-card section-card-featured">
            <p className="eyebrow">Study rhythm</p>
            <h2>Your weekly plan</h2>
            <div className="stat-row">
              <div className="stat-chip">
                <strong>{activePreferences.sessionsPerWeek}</strong>
                <span>sessions / week</span>
              </div>
              <div className="stat-chip">
                <strong>{activePreferences.minutesPerSession}</strong>
                <span>minutes / session</span>
              </div>
              <div className="stat-chip">
                <strong>{activePreferences.sessionsPerWeek * activePreferences.minutesPerSession}</strong>
                <span>minutes / week</span>
              </div>
              <div className="stat-chip">
                <strong>{dashboard?.reviewDueCount ?? 0}</strong>
                <span>review due</span>
              </div>
            </div>
            <div className="section-card-footer">
              <Button to="/study-plan" variant="secondary">Open study plan</Button>
            </div>
          </article>

          <article className="section-card">
            <p className="eyebrow">Focus area</p>
            <h2>{activePreferences.focus}</h2>
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

        {coachRecommendation ? (
          <section className="dashboard-grid">
            <article className="section-card section-card-featured">
              <p className="eyebrow">Coach recommendation</p>
              <h2>{coachRecommendation.title}</h2>
              <p>{coachRecommendation.message}</p>
              <div className="section-card-footer">
                <Button to={coachRecommendation.ctaPath}>{coachRecommendation.ctaLabel}</Button>
              </div>
            </article>

            <article className="section-card">
              <p className="eyebrow">Pace signal</p>
              <h2>{paceLabel === "on pace" ? "Weekly target protected" : "One more session will help"}</h2>
              <p>
                {dashboard?.weeklyActivity?.completedSessions ?? 0} of {activePreferences.sessionsPerWeek} planned sessions
                are complete this week. Keep the next action short and specific.
              </p>
              <div className="dashboard-focus-strip">
                <span>Best review lane</span>
                <strong>
                  {activePreferences.focus === "Grammar accuracy"
                    ? "Grammar"
                    : activePreferences.focus === "Vocabulary growth"
                      ? "Words"
                      : activePreferences.focus === "Reading fluency"
                        ? "Warm-up"
                        : "Mixed review"}
                </strong>
              </div>
            </article>
          </section>
        ) : null}

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
                <div className="progress-bar-fill" style={{ width: `${Math.min(dashboard?.quizAverage ?? 0, 100)}%` }} />
              </div>
              <p className="support-copy">
                Next target: {dashboard?.currentLevel === "A2" ? "B1" : "A2"} · keep quiz results above 75% and finish the
                current unit checkpoint.
              </p>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
