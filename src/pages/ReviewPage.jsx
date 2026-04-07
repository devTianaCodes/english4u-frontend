import { useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { apiRequest, endpoints } from "../services/api.js";

export default function ReviewPage() {
  const [review, setReview] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadReview() {
      try {
        const response = await apiRequest(endpoints.review);

        if (!isCancelled) {
          setReview(response);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadReview();

    return () => {
      isCancelled = true;
    };
  }, []);

  function handleAnswer(itemId, optionId) {
    setAnswers((current) => ({
      ...current,
      [itemId]: optionId
    }));
  }

  async function handleSubmit() {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest("/review/session", {
        method: "POST",
        body: JSON.stringify({
          answers: Object.entries(answers).map(([itemId, optionId]) => ({
            itemId,
            optionId
          }))
        })
      });

      setResult(response);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!review && !error) {
    return (
      <div className="stack-lg">
        <div className="skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line-short" />
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const items = review?.items ?? [];
  const readyToSubmit = items.length > 0 && answeredCount === items.length;

  return (
    <div className="stack-lg">
      <section className="review-hero">
        <div className="review-hero-copy">
          <p className="eyebrow">Review hub</p>
          <h1>Reinforce weak spots without leaving your path</h1>
          <p>
            Use short targeted reviews to revisit recent quiz mistakes or warm up before the next lesson checkpoint.
          </p>
        </div>

        <div className="review-hero-stats">
          <div className="catalog-stat-card">
            <strong>{review?.dueCount ?? 0}</strong>
            <span>items due</span>
          </div>
          <div className="catalog-stat-card">
            <strong>{review?.source === "recent-mistakes" ? "Mistakes" : "Warm-up"}</strong>
            <span>session type</span>
          </div>
          <div className="catalog-stat-card">
            <strong>{answeredCount}</strong>
            <span>answered now</span>
          </div>
        </div>
      </section>

      {error ? <p className="form-error">{error}</p> : null}

      <section className="review-category-grid">
        {(review?.categories ?? []).map((category) => (
          <article key={category.id} className="section-card">
            <p className="eyebrow">Review category</p>
            <h2>{category.title}</h2>
            <p>{category.count} targeted prompt{category.count === 1 ? "" : "s"} in this session.</p>
          </article>
        ))}
      </section>

      {(review?.grammarTopics ?? []).length ? (
        <section className="review-grammar-strip">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">Grammar support</p>
              <h2>Relevant guides for this review round</h2>
            </div>
            <p className="support-copy">Open the matching explanation before you retry the prompts.</p>
          </div>
          <div className="review-grammar-grid">
            {review.grammarTopics.map((topic) => (
              <article key={topic.id} className="section-card">
                <p className="eyebrow">{topic.level}</p>
                <h2>{topic.title}</h2>
                <p>{topic.summary}</p>
                <div className="section-card-footer">
                  <Button to={`/grammar/${topic.id}`} variant="secondary">Open guide</Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {items.length === 0 ? (
        <section className="section-card">
          <p className="eyebrow">Nothing due</p>
          <h2>Your review queue is clear</h2>
          <p>Complete another lesson or quiz to generate fresh review prompts.</p>
          <div className="section-card-footer">
            <Button to="/dashboard">Back to dashboard</Button>
            <Button to="/courses" variant="secondary">Browse courses</Button>
          </div>
        </section>
      ) : (
        <section className="review-session">
          <div className="quiz-progress-nav">
            <p className="support-copy">
              {answeredCount} of {items.length} prompts answered
            </p>
            <Button disabled={!readyToSubmit || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? "Scoring..." : "Score review"}
            </Button>
          </div>

          <div className="review-question-list">
            {items.map((item, index) => (
              <article key={item.id} className="quiz-question-card">
                <div className="stack-sm">
                  <p className="eyebrow">Prompt {String(index + 1).padStart(2, "0")}</p>
                  <h2>{item.prompt}</h2>
                  <p className="support-copy">{item.note}</p>
                </div>

                <div className="quiz-options">
                  {item.options.map((option) => (
                    <button
                      key={option.id}
                      className={`quiz-option-card ${answers[item.id] === option.id ? "quiz-option-card-active" : ""}`}
                      onClick={() => handleAnswer(item.id, option.id)}
                      type="button"
                    >
                      <span className="quiz-option-marker" />
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {result ? (
        <section className="quiz-result-panel">
          <div className="quiz-result-score">
            <span className="metric-label">Review result</span>
            <strong>{result.score}%</strong>
            <p>
              You answered {result.correctAnswers} out of {result.totalQuestions} review items correctly.
            </p>
          </div>

          <div className="quiz-result-details">
            <div className="achievement-card">
              <div className="achievement-icon">Rv</div>
              <div className="stack-sm">
                <strong>Review session complete</strong>
                <p>{result.reviewDueCount} item{result.reviewDueCount === 1 ? "" : "s"} were available in this round.</p>
                <span className="metric-label">{new Date(result.submittedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
