import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { apiRequest } from "../services/api.js";

export default function QuizPage() {
  const { quizId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
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
          setActiveIndex(0);
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
  const currentQuestion = quiz?.questions[activeIndex] ?? null;
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
      <section className="practice-quiz">
        <header className="quiz-header-panel">
          <div className="stack-sm">
            <p className="eyebrow">Practice quiz</p>
            <h1>{quiz?.title ?? quizId}</h1>
            <p>{quiz?.description ?? "Loading quiz content from the backend."}</p>
          </div>

          <div className="quiz-meta">
            <div className="stack-sm">
              <span className="metric-label">Progress</span>
              <strong>
                {answeredCount} / {quiz?.questions.length ?? 0}
              </strong>
            </div>
            {quiz?.courseTitle ? (
              <p className="support-copy">
                {quiz.courseTitle} · {quiz.unitTitle}
              </p>
            ) : null}
          </div>
        </header>

        <div className="quiz-body-panel">
          <div className="quiz-progress-nav">
            <div className="progress-dots">
              {(quiz?.questions ?? []).map((question, index) => (
                <button
                  key={question.id}
                  className={`progress-dot ${index === activeIndex ? "progress-dot-active" : ""} ${
                    answers[question.id] ? "progress-dot-complete" : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                />
              ))}
            </div>
            <p className="support-copy">
              Question {activeIndex + 1} of {quiz?.questions.length ?? 0}
            </p>
          </div>

          {currentQuestion ? (
            <div className="quiz-question-card">
              <div className="stack-sm">
                <p className="eyebrow">Question {String(activeIndex + 1).padStart(2, "0")}</p>
                <h2>{currentQuestion.prompt}</h2>
              </div>

              <div className="quiz-options">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    className={`quiz-option-card ${answers[currentQuestion.id] === option.id ? "quiz-option-card-active" : ""}`}
                    onClick={() => handleAnswerChange(currentQuestion.id, option.id)}
                    type="button"
                  >
                    <span className="quiz-option-marker" />
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="quiz-footer-panel">
            <div className="button-row">
              {quiz?.lessonId ? (
                <Button to={`/lessons/${quiz.lessonId}`} variant="ghost">
                  Back to lesson
                </Button>
              ) : null}
              <Button
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((current) => Math.max(current - 1, 0))}
                variant="secondary"
              >
                Previous
              </Button>
              <Button
                disabled={!quiz || activeIndex === quiz.questions.length - 1}
                onClick={() => setActiveIndex((current) => Math.min(current + 1, quiz.questions.length - 1))}
                variant="secondary"
              >
                Next
              </Button>
            </div>

            <Button disabled={!isReadyToSubmit || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Submitting..." : "Submit answers"}
            </Button>
          </div>
        </div>

        {error ? <p className="form-error">{error}</p> : null}
      </section>

      {result ? (
        <section className="quiz-result-panel">
          <div className="quiz-result-score">
            <span className="metric-label">Result</span>
            <strong>{result.score}%</strong>
            <p>
              You answered {result.correctAnswers} out of {result.totalQuestions} questions correctly.
            </p>
          </div>

          <div className="quiz-result-details">
            <div className="achievement-card">
              <div className="achievement-icon">Qz</div>
              <div className="stack-sm">
                <strong>Checkpoint updated</strong>
                <p>Running quiz average: {result.quizAverage}%</p>
                <span className="metric-label">{result.streak} day streak</span>
              </div>
            </div>

            {result.nextLesson ? (
              <div className="achievement-card">
                <div className="achievement-icon">Nx</div>
                <div className="stack-sm">
                  <strong>Next lesson unlocked</strong>
                  <p>{result.nextLesson.title}</p>
                  <span className="metric-label">continue path</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="section-card-footer">
            {result.nextLesson ? <Button to={`/lessons/${result.nextLesson.id}`}>Next lesson</Button> : <Button to="/dashboard">Back to dashboard</Button>}
            <Button to={result.courseId ? `/courses/${result.courseId}` : "/courses"} variant="secondary">
              Return to course
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
