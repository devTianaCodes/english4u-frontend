import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { apiRequest } from "../services/api.js";
import { buildCoursePath, buildLessonPath, buildQuizPath } from "../services/paths.js";

const lessonTabs = [
  { id: "overview", label: "Overview" },
  { id: "transcript", label: "Transcript" },
  { id: "resources", label: "Resources" },
  { id: "exercises", label: "Exercises" }
];

function groupBlocks(blocks) {
  return blocks.reduce(
    (groups, block) => {
      groups[block.type] = [...(groups[block.type] ?? []), block];
      return groups;
    },
    {}
  );
}

export default function LessonPage() {
  const { lessonId: lessonSlug } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [lesson, setLesson] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadLesson() {
      try {
        const response = await apiRequest(`/lessons/${lessonSlug}`);

        if (!isCancelled) {
          setLesson(response);
          setActiveTab("overview");
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
  }, [lessonSlug]);

  const groupedBlocks = useMemo(() => groupBlocks(lesson?.blocks ?? []), [lesson?.blocks]);

  async function handleCompleteLesson() {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest(`/progress/lessons/${lessonSlug}/complete`, {
        method: "POST"
      });

      setCompletion(response);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const transcript = (lesson?.blocks ?? []).map((block) => `${block.title}. ${block.content}`).join(" ");
  const tabContent = {
    overview: (
      <div className="lesson-tab-panel">
        <section className="lesson-info-block">
          <h2>What you will learn</h2>
          <ul className="learning-outcomes">
            {(lesson?.objectives ?? []).map((objective, index) => (
              <li key={`${lesson?.id ?? "lesson"}-objective-${index}`}>{objective}</li>
            ))}
          </ul>
        </section>

        <section className="lesson-info-block">
          <h2>Key vocabulary</h2>
          <div className="vocabulary-grid">
            {(groupedBlocks.vocabulary ?? lesson?.blocks ?? []).map((block) => (
              <article key={block.id} className="vocab-item">
                <strong>{block.title}</strong>
                <p>{block.content}</p>
                <span>{block.accent}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    ),
    transcript: (
      <div className="lesson-tab-panel">
        <section className="lesson-info-block">
          <h2>Lesson transcript</h2>
          <p>{transcript || "Transcript will appear when lesson blocks load."}</p>
        </section>
      </div>
    ),
    resources: (
      <div className="lesson-tab-panel">
        <section className="lesson-info-block">
          <h2>Lesson resources</h2>
          <div className="resource-grid">
            {lesson?.grammarTopic ? (
              <Link className="resource-card resource-card-highlight" to={`/grammar/${lesson.grammarTopic.id}`}>
                <p className="eyebrow">Grammar guide</p>
                <strong>{lesson.grammarTopic.title}</strong>
                <p>{lesson.grammarTopic.summary}</p>
              </Link>
            ) : null}
            {(lesson?.blocks ?? []).map((block) => (
              <article key={block.id} className="resource-card">
                <p className="eyebrow">{block.type}</p>
                <strong>{block.title}</strong>
                <p>{block.accent}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    ),
    exercises: (
      <div className="lesson-tab-panel">
        <section className="lesson-info-block">
          <h2>Practice tasks</h2>
          <div className="exercise-list">
            {(lesson?.blocks ?? []).map((block) => (
              <article key={block.id} className="exercise-card">
                <div className="stack-sm">
                  <p className="eyebrow">{block.type}</p>
                  <strong>{block.title}</strong>
                  <p>{block.content}</p>
                </div>
                <span>{block.accent}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    )
  };

  if (!lesson && !error) {
    return (
      <div className="stack-lg">
        <div className="skeleton-card">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line-short" />
        </div>
        <div className="grid grid-2">
          <div className="skeleton-card">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" />
          </div>
          <div className="skeleton-card">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-line-short" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <section className="lesson-player">
        <div className="lesson-main">
          <header className="lesson-header">
            <div className="lesson-header-top">
              {lesson?.courseId ? (
                <Link className="button button-ghost" to={buildCoursePath(lesson.courseSlug ?? lesson.courseId)}>
                  Back to course
                </Link>
              ) : null}
              <div className="lesson-progress-inline">
                <span>{lesson?.positionLabel ?? "Lesson"}</span>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${lesson?.totalLessons ? Math.max((1 / lesson.totalLessons) * 100, 12) : 18}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="stack-sm">
              <p className="eyebrow">Lesson player</p>
              <h1>{lesson?.title ?? lessonSlug}</h1>
              <p>{lesson?.summary ?? "Loading lesson content from the backend."}</p>
            </div>

            {(lesson?.objectives ?? []).length ? (
              <div className="lesson-objective-strip">
                {lesson.objectives.map((objective, index) => (
                  <span key={`${lesson.id}-objective-pill-${index}`} className="stat-chip">
                    {objective}
                  </span>
                ))}
              </div>
            ) : null}

            {lesson ? (
              <div className="lesson-meta-row">
                <span>{lesson.unitTitle}</span>
                <span>{lesson.courseTitle}</span>
                <span>{lesson.totalLessons ?? 0} lessons in path</span>
              </div>
            ) : null}
          </header>

          <div className="lesson-stage">
            <div className="lesson-stage-card">
              <div className="lesson-stage-screen">
                <p className="metric-label">Lesson preview</p>
                <strong>{lesson?.title ?? "Guided lesson"}</strong>
                <p>
                  {lesson?.summary ??
                    "Structured reading, vocabulary, and grammar blocks stay in one focused learning player."}
                </p>
              </div>

              <div className="lesson-stage-controls">
                <button className="button button-ghost" type="button">1.5x speed</button>
                <button className="button button-ghost" type="button">Subtitles</button>
                <button className="button button-ghost" type="button">Focus mode</button>
              </div>
            </div>

            <div className="lesson-tabs">
              {lessonTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`lesson-tab ${activeTab === tab.id ? "lesson-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {tabContent[activeTab]}
          </div>
        </div>

        <aside className="lesson-sidebar">
          {lesson?.grammarTopic ? (
            <div className="lesson-sidebar-card">
              <p className="eyebrow">Grammar focus</p>
              <strong>{lesson.grammarTopic.title}</strong>
              <p className="support-copy">{lesson.grammarTopic.summary}</p>
              <Button to={`/grammar/${lesson.grammarTopic.id}`} variant="secondary">
                Open grammar guide
              </Button>
            </div>
          ) : null}

          <div className="lesson-sidebar-card">
            <h2>Lesson complete?</h2>
            <p>Save this lesson, update streak and completed totals, then move to the checkpoint.</p>
            <Button disabled={isSubmitting} onClick={handleCompleteLesson}>
              {isSubmitting ? "Saving..." : completion ? "Completed" : "Mark lesson complete"}
            </Button>
            {completion ? (
              <div className="stack-sm">
                <p className="success-copy">Saved with status: {completion.status}.</p>
                <p className="support-copy">
                  Current streak: {completion.streak} · Completed lessons: {completion.completedLessons}
                </p>
                {completion.message ? <p className="support-copy">{completion.message}</p> : null}
              </div>
            ) : null}
          </div>

          <div className="lesson-sidebar-card">
            <h2>Navigation</h2>
            <div className="stack-sm">
              {lesson?.previousLesson ? (
                <Button to={buildLessonPath(lesson.previousLesson)} variant="secondary">
                  Previous lesson
                </Button>
              ) : null}
              <Button to={buildQuizPath(lesson?.quizSlug ?? lesson?.quizId ?? `${lessonSlug}-quiz`)}>Finish with quiz</Button>
              {lesson?.nextLesson ? (
                <Button to={buildLessonPath(lesson.nextLesson)} variant="secondary">
                  Next lesson
                </Button>
              ) : null}
            </div>
          </div>

          {lesson?.nextLesson ? (
            <div className="lesson-sidebar-card">
              <p className="eyebrow">Next in path</p>
              <strong>{lesson.nextLesson.title}</strong>
              <p className="support-copy">Keep moving through {lesson.courseTitle} with the next lesson in sequence.</p>
            </div>
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}
        </aside>
      </section>
    </div>
  );
}
