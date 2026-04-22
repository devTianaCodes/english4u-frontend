import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { apiRequest } from "../services/api.js";
import { buildCoursePath, buildLessonPath } from "../services/paths.js";

export default function QuizPage() {
  const { quizId: quizSlug } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadQuiz() {
      try {
        const response = await apiRequest(`/quizzes/${quizSlug}`);

        if (!isCancelled) {
          setQuiz(response);
          setAnswers({});
          setResult(null);
          setError("");
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
  }, [quizSlug]);

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

      const response = await apiRequest(`/quizzes/${quizSlug}/submit`, {
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

  useEffect(() => {
    if (!result) {
      return;
    }

    window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [result]);

  if (!quiz && !error) {
    return (
      <div className="stack-lg">
        <div className="skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line-short" />
        </div>
        <div className="skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
        </div>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <section className="practice-quiz">
        <header className="quiz-header-panel">
          <div className="stack-sm">
            <p className="eyebrow">Practice quiz</p>
            <h1>{quiz?.title ?? quizSlug}</h1>
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
                <Button to={buildLessonPath(quiz.lessonSlug ?? quiz.lessonId)} variant="ghost">
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
        <section ref={resultRef} className="quiz-result-panel">
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

          {(result.questionResults ?? []).length ? (
            <div className="quiz-review-list">
              {(result.questionResults ?? []).map((question, index) => (
                <article key={question.id} className={`quiz-review-card ${question.isCorrect ? "quiz-review-card-correct" : "quiz-review-card-missed"}`}>
                  <div className="stack-sm">
                    <p className="eyebrow">Question {String(index + 1).padStart(2, "0")}</p>
                    <h3>{question.prompt}</h3>
                    <p className="support-copy">
                      Your answer: {question.selectedOptionText ?? "No answer"} · Correct: {question.correctOptionText}
                    </p>
                    <p>{question.explanation}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          <div className="section-card-footer">
            {result.nextLesson ? <Button to={buildLessonPath(result.nextLesson)}>Next lesson</Button> : <Button to="/dashboard">Back to dashboard</Button>}
            <Button
              to={result.courseSlug || result.courseId ? buildCoursePath(result.courseSlug ?? result.courseId) : "/courses"}
              variant="secondary"
            >
              Return to course
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
