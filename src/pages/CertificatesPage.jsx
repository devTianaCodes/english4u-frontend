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

const pathways = [
  {
    title: "Path completion signal",
    text: "Use completed lessons and active-unit progress to show that your study path is structured, not random."
  },
  {
    title: "Checkpoint confidence",
    text: "Keep quiz results stable before pushing toward stronger certificate goals or level movement."
  },
  {
    title: "Consistency before exam stress",
    text: "A steady weekly rhythm is a better predictor than last-minute intensive practice."
  }
];

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
        <h1>Milestones, readiness, and certificate direction</h1>
        <p>
          English4U uses simple certificate-style milestones to show when a learner has enough path momentum,
          checkpoint accuracy, and consistency to present progress confidently.
        </p>
        {error ? <p className="form-error">{error}</p> : null}
      </section>

      <section className="grid grid-3">
        {pathways.map((pathway) => (
          <article key={pathway.title} className="section-card">
            <p className="eyebrow">Readiness layer</p>
            <h2>{pathway.title}</h2>
            <p>{pathway.text}</p>
          </article>
        ))}
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
        <p className="eyebrow">Certificate story</p>
        <h2>Keep the path moving before you chase formal proof</h2>
        <p>
          Certificates stay lightweight in this product. The stronger signal comes first: steady lesson completion,
          review retention, strong checkpoint results, and a level path that makes sense.
        </p>
        <div className="section-card-footer">
          <Button to="/dashboard">Back to dashboard</Button>
          <Button to="/courses" variant="secondary">Open courses</Button>
        </div>
      </section>
    </div>
  );
}
