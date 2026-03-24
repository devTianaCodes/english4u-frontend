import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
import { apiRequest } from "../services/api.js";

export default function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadQuiz() {
      try {
        const response = await apiRequest(`/quizzes/${quizId}`);

        if (!isCancelled) {
          setQuiz(response);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadQuiz();

    return () => {
      isCancelled = true;
    };
  }, [quizId]);

  const answeredCount = Object.keys(answers).length;
  const isReadyToSubmit = quiz && answeredCount === quiz.questions.length;

  function handleAnswerChange(questionId, optionId) {
    setAnswers((current) => ({
      ...current,
      [questionId]: optionId
    }));
  }

  async function handleSubmit() {
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          questionId,
          optionId
        }))
      };

      const response = await apiRequest(`/quizzes/${quizId}/submit`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      setResult(response);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="stack-lg">
      <SectionCard
        eyebrow="Quiz"
        title={quiz?.title ?? quizId}
        footer={
          <button className="button" disabled={!isReadyToSubmit || isSubmitting} onClick={handleSubmit} type="button">
            {isSubmitting ? "Submitting..." : "Submit answers"}
          </button>
        }
      >
        <p>{quiz?.description ?? "Loading quiz content from the backend."}</p>
        <p className="support-copy">
          {answeredCount} of {quiz?.questions.length ?? 0} questions answered.
        </p>
        {error ? <p className="form-error">{error}</p> : null}
      </SectionCard>

      {(quiz?.questions ?? []).map((question, index) => (
        <SectionCard key={question.id} eyebrow={`Question 0${index + 1}`} title={question.prompt}>
          <div className="quiz-options">
            {question.options.map((option) => (
              <label key={option.id} className={`choice-card ${answers[question.id] === option.id ? "choice-card-active" : ""}`}>
                <input
                  checked={answers[question.id] === option.id}
                  name={question.id}
                  onChange={() => handleAnswerChange(question.id, option.id)}
                  type="radio"
                  value={option.id}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        </SectionCard>
      ))}

      {result ? (
        <SectionCard
          eyebrow="Result"
          title={`Score: ${result.score}%`}
          footer={
            <>
              <Link className="button" to="/dashboard">
                Back to dashboard
              </Link>
              <Link className="button button-ghost" to="/courses">
                Keep learning
              </Link>
            </>
          }
        >
          <p>
            You answered {result.correctAnswers} out of {result.totalQuestions} questions correctly.
          </p>
          <p className="support-copy">Submitted at {new Date(result.submittedAt).toLocaleString()}.</p>
        </SectionCard>
      ) : null}
    </div>
  );
}
