import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
import ProgressRing from "../components/ui/ProgressRing.jsx";
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
      to: dashboard?.nextLesson ? `/lessons/${dashboard.nextLesson.id}` : "/courses"
    },
    {
      title: "Review vocabulary",
      text: "Use short review loops to reinforce the words you met in recent lessons.",
      to: "/courses"
    },
    {
      title: "Take quiz",
      text: dashboard?.nextLesson
        ? `Checkpoint for ${dashboard.nextLesson.title} is ready when you finish the lesson.`
        : "Finish the current lesson to unlock the next checkpoint.",
      to: dashboard?.nextLesson ? `/quizzes/${dashboard.nextLesson.quizId}` : "/courses"
    }
  ];

  return (
    <div className="stack-lg">
      <section className="dashboard-grid">
        <SectionCard eyebrow="Welcome back" title="Your learning dashboard">
          <p>
            {dashboard
              ? `Welcome ${dashboard.learner.name}. Keep the next action obvious and continue your ${dashboard.currentLevel} path.`
              : `Welcome ${user?.firstName ?? "back"}. Keep the next action obvious and continue your current learning path.`}
          </p>
          {dashboard ? (
            <p className="support-copy">
              Current streak: {dashboard.streak} days · Completed lessons: {dashboard.completedLessons} · Current course:{" "}
              {dashboard.currentCourse}
            </p>
          ) : null}
          {error ? <p className="form-error">{error}</p> : null}
        </SectionCard>
        <SectionCard eyebrow="Progress" title="This week">
          <div className="ring-row">
            <ProgressRing value={dashboard ? Math.min(dashboard.completedLessons * 5, 100) : 0} label="Course progress" />
            <ProgressRing value={dashboard?.quizAverage ?? 0} label="Quiz average" />
          </div>
          <WeeklyStudyGraphic />
        </SectionCard>
      </section>

      <section className="grid grid-2">
        <SectionCard
          eyebrow="Study rhythm"
          title="Your weekly plan"
          footer={
            <Link className="button button-ghost" to="/profile">
              Edit plan
            </Link>
          }
        >
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
        </SectionCard>

        <SectionCard eyebrow="Focus area" title={preferences.focus}>
          <p>
            Keep your weekly target realistic and tie it to one clear learning focus. Small consistency beats long,
            irregular sessions.
          </p>
        </SectionCard>
      </section>

      <div className="grid grid-3">
        {continueCards.map((card) => (
          <SectionCard
            key={card.title}
            eyebrow="Continue learning"
            title={card.title}
            footer={
              <Link className="button button-ghost" to={card.to}>
                Open
              </Link>
            }
          >
            <p>{card.text}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
