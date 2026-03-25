import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
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
      <SectionCard
        eyebrow="Onboarding"
        title="Placement flow"
        footer={
          <button className="button" disabled={!isComplete || isSubmitting} onClick={handleSubmit} type="button">
            {isSubmitting ? "Scoring your answers..." : "Get my level"}
          </button>
        }
      >
        <p>
          The first release uses a compact placement test to recommend the right learning path before the learner sees
          the dashboard.
        </p>
        {existingRecommendation?.hasCompletedPlacement ? (
          <p className="support-copy">
            Latest saved recommendation: {existingRecommendation.recommendedLevel}
            {existingRecommendation.score !== null ? ` · score ${existingRecommendation.score}` : ""}
          </p>
        ) : null}
        <p className="support-copy">{answeredCount} of {placementQuestions.length} questions answered.</p>
        {error ? <p className="form-error">{error}</p> : null}
      </SectionCard>

      <div className="grid grid-2">
        {placementQuestions.map((question, index) => (
          <SectionCard key={question.id} eyebrow={`Step 0${index + 1}`} title={question.label}>
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
          </SectionCard>
        ))}
      </div>

      {result ? (
        <SectionCard
          eyebrow="Recommended path"
          title={`Start at ${result.recommendedLevel}`}
          footer={
            <>
              <Link className="button" to="/dashboard">
                Go to dashboard
              </Link>
              <Link className="button button-ghost" to="/courses">
                View courses
              </Link>
            </>
          }
        >
          <p>Your placement score is {result.score}. Use this as a starting point and adjust later if the content feels too easy or too hard.</p>
          <p>{result.recommendation.summary}</p>
        </SectionCard>
      ) : null}
    </div>
  );
}
