import { useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { apiRequest } from "../services/api.js";

const placementQuestions = [
  {
    id: "grammar",
    label: "How comfortable are you with present simple grammar?",
    options: [
      { value: "high", label: "I use it confidently" },
      { value: "medium", label: "I understand it but make mistakes" },
      { value: "low", label: "I need a full review" }
    ]
  },
  {
    id: "vocabulary",
    label: "How many everyday English words do you already use comfortably?",
    options: [
      { value: "high", label: "Enough for short conversations" },
      { value: "medium", label: "Basic topics only" },
      { value: "low", label: "Very few right now" }
    ]
  },
  {
    id: "reading",
    label: "How easy is it for you to read a short daily routine paragraph?",
    options: [
      { value: "high", label: "Easy to understand" },
      { value: "medium", label: "I understand the main idea" },
      { value: "low", label: "I need strong support" }
    ]
  },
  {
    id: "goal",
    label: "How often do you want to study each week?",
    options: [
      { value: "4_plus", label: "4 or more sessions" },
      { value: "2_3", label: "2-3 sessions" },
      { value: "1", label: "1 short session" }
    ]
  }
];

export default function OnboardingPage() {
  const [answers, setAnswers] = useState({});
  const [existingRecommendation, setExistingRecommendation] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === placementQuestions.length;
  const completionPercent = Math.round((answeredCount / placementQuestions.length) * 100);

  useEffect(() => {
    let isCancelled = false;

    async function loadExistingRecommendation() {
      try {
        const response = await apiRequest("/onboarding/recommendation");

        if (!isCancelled) {
          setExistingRecommendation(response);
        }
      } catch {
        if (!isCancelled) {
          setExistingRecommendation(null);
        }
      }
    }

    loadExistingRecommendation();

    return () => {
      isCancelled = true;
    };
  }, []);

  function handleAnswerChange(questionId, value) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value
    }));
  }

  async function handleSubmit() {
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        answers: placementQuestions.map((question) => answers[question.id])
      };

      const placementResult = await apiRequest("/onboarding/placement-test", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const recommendation = await apiRequest("/onboarding/recommendation");

      setResult({
        ...placementResult,
        recommendation
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="stack-lg">
      <section className="onboarding-hero">
        <div className="onboarding-hero-copy">
          <p className="eyebrow">Placement flow</p>
          <h1>Find the right English path before you start</h1>
          <p>
            Answer four quick questions so English4U can recommend the right level, course track, and first study focus.
          </p>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${completionPercent}%` }} />
          </div>
          <p className="support-copy">
            {answeredCount} of {placementQuestions.length} answered · {completionPercent}% complete
          </p>
          <div className="button-row">
            <Button disabled={!isComplete || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Scoring your answers..." : "Get my level"}
            </Button>
            <Button to="/dashboard" variant="secondary">Skip to dashboard</Button>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
        </div>

        <div className="onboarding-hero-side">
          <div className="catalog-stat-card">
            <strong>{existingRecommendation?.recommendedLevel ?? "A2"}</strong>
            <span>latest recommendation</span>
          </div>
          <div className="catalog-stat-card">
            <strong>{existingRecommendation?.score ?? "--"}</strong>
            <span>latest score</span>
          </div>
          <div className="catalog-stat-card">
            <strong>{existingRecommendation?.recommendedCourse?.title ?? "Guided path"}</strong>
            <span>course track</span>
          </div>
        </div>
      </section>

      <section className="onboarding-grid">
        {placementQuestions.map((question, index) => (
          <article key={question.id} className="section-card">
            <p className="eyebrow">{`Step ${String(index + 1).padStart(2, "0")}`}</p>
            <h2>{question.label}</h2>
            <div className="choice-list">
              {question.options.map((option) => (
                <label key={option.value} className={`choice-card ${answers[question.id] === option.value ? "choice-card-active" : ""}`}>
                  <input
                    checked={answers[question.id] === option.value}
                    name={question.id}
                    onChange={() => handleAnswerChange(question.id, option.value)}
                    type="radio"
                    value={option.value}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </article>
        ))}
      </section>

      {result ? (
        <section className="onboarding-result">
          <div className="onboarding-result-main">
            <p className="eyebrow">Recommended path</p>
            <h2>Start at {result.recommendedLevel}</h2>
            <p>
              Placement score: {result.score} · {result.confidenceLabel}
            </p>
            <p>{result.recommendation.summary}</p>
            {result.recommendedCourse ? (
              <div className="dashboard-focus-strip">
                <span>Recommended course</span>
                <strong>{result.recommendedCourse.title}</strong>
                <p>{result.recommendedCourse.summary}</p>
              </div>
            ) : null}
            <div className="section-card-footer">
              <Button to="/dashboard">Go to dashboard</Button>
              {result.recommendedCourse?.id ? (
                <Button to={`/courses/${result.recommendedCourse.id}`} variant="secondary">
                  Open recommended course
                </Button>
              ) : (
                <Button to="/courses" variant="secondary">
                  View courses
                </Button>
              )}
            </div>
          </div>

          <div className="onboarding-result-side">
            <p className="eyebrow">Focus next</p>
            <div className="stack-sm">
              {result.focusAreas.map((focus) => (
                <div key={focus} className="achievement-card">
                  <div className="achievement-icon">Fx</div>
                  <div className="stack-sm">
                    <strong>Priority</strong>
                    <p>{focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
