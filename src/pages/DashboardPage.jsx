import { useEffect, useState } from "react";
import SectionCard from "../components/layout/SectionCard.jsx";
import ProgressRing from "../components/ui/ProgressRing.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";
import { apiRequest, endpoints } from "../services/api.js";

export default function DashboardPage() {
  const { user } = useAuth();
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
    { title: "Continue unit", text: `${dashboard?.currentCourse ?? "Your current course"} is ready for the next lesson.` },
    { title: "Review vocabulary", text: "Use short review loops to reinforce the words you met in recent lessons." },
    { title: "Take quiz", text: "Finish the current lesson to unlock the next checkpoint." }
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
          {error ? <p className="form-error">{error}</p> : null}
        </SectionCard>
        <SectionCard eyebrow="Progress" title="This week">
          <div className="ring-row">
            <ProgressRing value={dashboard ? Math.min(dashboard.completedLessons * 5, 100) : 0} label="Course progress" />
            <ProgressRing value={dashboard?.quizAverage ?? 0} label="Quiz average" />
          </div>
        </SectionCard>
      </section>

      <div className="grid grid-3">
        {continueCards.map((card) => (
          <SectionCard key={card.title} eyebrow="Continue learning" title={card.title} footer={<button className="button button-ghost">Open</button>}>
            <p>{card.text}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
