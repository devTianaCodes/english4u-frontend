import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
import { apiRequest } from "../services/api.js";

export default function LessonPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadLesson() {
      try {
        const response = await apiRequest(`/lessons/${lessonId}`);

        if (!isCancelled) {
          setLesson(response);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadLesson();

    return () => {
      isCancelled = true;
    };
  }, [lessonId]);

  async function handleCompleteLesson() {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest(`/progress/lessons/${lessonId}/complete`, {
        method: "POST"
      });

      setCompletion(response);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="stack-lg">
      <SectionCard
        eyebrow="Lesson"
        title={lesson?.title ?? lessonId}
        footer={
          <>
            <button className="button button-ghost" disabled={isSubmitting} onClick={handleCompleteLesson} type="button">
              {isSubmitting ? "Saving..." : completion ? "Completed" : "Mark lesson complete"}
            </button>
            <Link className="button" to={`/quizzes/${lesson?.quizId ?? `${lessonId}-quiz`}`}>
              Finish with quiz
            </Link>
          </>
        }
      >
        <p>{lesson?.summary ?? "Loading lesson content from the backend."}</p>
        {completion ? <p className="success-copy">Lesson saved with status: {completion.status}.</p> : null}
        {error ? <p className="form-error">{error}</p> : null}
      </SectionCard>

      <div className="grid grid-2">
        {(lesson?.blocks ?? []).map((block) => (
          <SectionCard key={block.id} eyebrow={block.type} title={block.title}>
            <p>{block.content}</p>
            <p className="support-copy">{block.accent}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
