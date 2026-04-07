import { useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { apiRequest, endpoints } from "../services/api.js";

function buildCertificates(dashboard) {
  if (!dashboard) {
    return [];
  }

  return [
    {
      id: "path-momentum",
      title: "Path Momentum",
      status: dashboard.completedLessons >= 3 ? "earned" : "in-progress",
      note: dashboard.completedLessons >= 3
        ? `Earned after completing ${dashboard.completedLessons} lessons in the active path.`
        : "Complete 3 lessons in your active path."
    },
    {
      id: "checkpoint-focus",
      title: "Checkpoint Focus",
      status: dashboard.quizAverage >= 75 ? "earned" : "in-progress",
      note: dashboard.quizAverage >= 75
        ? `Earned with a ${dashboard.quizAverage}% running quiz average.`
        : "Keep your running quiz average above 75%."
    },
    {
      id: "consistency",
      title: "Consistency Streak",
      status: dashboard.streak >= 5 ? "earned" : "in-progress",
      note: dashboard.streak >= 5
        ? `Earned with a ${dashboard.streak}-day streak.`
        : "Reach a 5-day learning streak."
    }
  ];
}

export default function CertificatesPage() {
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

  const certificates = buildCertificates(dashboard);

  return (
    <div className="stack-lg">
      <section className="section-card section-card-featured">
        <p className="eyebrow">Certificates</p>
        <h1>Milestones and certificate readiness</h1>
        <p>
          English4U uses simple certificate-style milestones to show when a learner has enough path momentum,
          checkpoint accuracy, and consistency to present progress confidently.
        </p>
        {error ? <p className="form-error">{error}</p> : null}
      </section>

      <section className="dashboard-grid">
        {certificates.map((certificate) => (
          <article key={certificate.id} className={`section-card ${certificate.status === "earned" ? "section-card-featured" : ""}`}>
            <p className="eyebrow">{certificate.status === "earned" ? "Earned" : "In progress"}</p>
            <h2>{certificate.title}</h2>
            <p>{certificate.note}</p>
          </article>
        ))}
      </section>

      <section className="section-card">
        <p className="eyebrow">Next milestone</p>
        <h2>Keep the path moving</h2>
        <p>
          Certificates stay lightweight in this product. The real signal is steady lesson completion, review retention,
          and strong checkpoint results.
        </p>
        <div className="section-card-footer">
          <Button to="/dashboard">Back to dashboard</Button>
          <Button to="/courses" variant="secondary">Open courses</Button>
        </div>
      </section>
    </div>
  );
}
