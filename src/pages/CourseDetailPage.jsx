import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { apiRequest } from "../services/api.js";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadCourseAndProgress() {
      try {
        const [courseResponse, progressResponse] = await Promise.all([
          apiRequest(`/courses/${courseId}`),
          apiRequest("/dashboard/me")
        ]);

        if (!isCancelled) {
          setCourse(courseResponse);
          setProgress(progressResponse);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadCourseAndProgress();

    return () => {
      isCancelled = true;
    };
  }, [courseId]);

  const completedLessonSlugs = new Set(progress?.completedLessonSlugs ?? []);
  const nextLessonId = progress?.nextLesson?.id ?? null;
  const firstLessonId = course?.units[0]?.lessons[0]?.id ?? "";
  const courseProgress = course?.lessonCount ? Math.round((completedLessonSlugs.size / course.lessonCount) * 100) : 0;
  const learningOutcomes = [
    `Progress through ${course?.unitCount ?? 0} structured units with visible lesson milestones.`,
    `Build confidence through ${course?.lessonCount ?? 0} guided lessons and checkpoint practice.`,
    `Stay on a ${course?.estimatedWeeks ?? 4}-week pace with a clear next lesson and review rhythm.`
  ];

  return (
    <div className="stack-lg">
      <section className="course-detail-hero">
        <div className="course-detail-copy">
          <p className="eyebrow">Course detail</p>
          <h1>{course?.title ?? courseId}</h1>
          <p>
            {course
              ? `${course.level} track with ${course.unitCount} units and ${course.lessonCount} lessons. ${course.summary}`
              : "Loading course metadata from the backend."}
          </p>

          {course ? (
            <>
              <div className="course-detail-meta">
                <span>{course.level}</span>
                <span>{course.intensity}</span>
                <span>{course.estimatedWeeks} weeks</span>
              </div>

              <div className="button-row">
                <Button to={`/lessons/${nextLessonId ?? firstLessonId}`}>{nextLessonId ? "Continue course" : "Start first lesson"}</Button>
                <Button to="/dashboard" variant="secondary">Open dashboard</Button>
              </div>
            </>
          ) : null}
          {error ? <p className="form-error">{error}</p> : null}
        </div>

        <aside className="course-detail-sidebar">
          <div className="course-info-card">
            <h2>Course includes</h2>
            <ul className="course-info-list">
              <li>{course?.lessonCount ?? 0} short lessons</li>
              <li>{course?.unitCount ?? 0} guided units</li>
              <li>Checkpoint quizzes and review loops</li>
              <li>Visible next-step dashboard tracking</li>
            </ul>
          </div>

          <div className="course-info-card">
            <h2>Progress snapshot</h2>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${courseProgress}%` }} />
            </div>
            <p className="support-copy">{courseProgress}% complete in this path</p>
            <div className="stat-row stat-row-compact">
              <div className="stat-chip">
                <strong>{completedLessonSlugs.size}</strong>
                <span>completed</span>
              </div>
              <div className="stat-chip">
                <strong>{progress?.quizAverage ?? 0}%</strong>
                <span>quiz avg</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="course-detail-layout">
        <div className="course-detail-main">
          <section className="course-section">
            <h2>What you will build</h2>
            <ul className="learning-outcomes">
              {learningOutcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </section>

          <section className="course-section">
            <h2>Course structure</h2>
            <div className="course-modules">
              {(course?.units ?? []).map((unit, index) => (
                <article key={unit.id} className="module-card">
                  <div className="module-card-top">
                    <div className="stack-sm">
                      <p className="eyebrow">{unit.positionLabel ?? `Unit ${String(index + 1).padStart(2, "0")}`}</p>
                      <h3>{unit.title}</h3>
                    </div>
                    <span className="module-card-count">{unit.lessonCount} lessons</span>
                  </div>
                  <p>{unit.summary}</p>
                  <p className="support-copy">{unit.checkpointLabel}</p>
                  <div className="lesson-list">
                    {unit.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="lesson-row">
                        <div className="stack-sm">
                          <p className="eyebrow">{lesson.positionLabel ?? `Lesson ${String(lessonIndex + 1).padStart(2, "0")}`}</p>
                          <h3>{lesson.title}</h3>
                          <p className="support-copy">
                            {lesson.duration} · {lesson.focus}
                          </p>
                          {completedLessonSlugs.has(lesson.id) ? (
                            <p className="success-copy">Completed</p>
                          ) : lesson.id === nextLessonId ? (
                            <p className="support-copy">Next up</p>
                          ) : null}
                        </div>
                        <Button to={`/lessons/${lesson.id}`} variant="secondary">
                          {completedLessonSlugs.has(lesson.id) ? "Review" : "Open"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="course-detail-side-notes">
          <div className="course-info-card">
            <h2>Suggested rhythm</h2>
            <p className="support-copy">
              Aim for 3 short sessions per week and finish one unit before taking the related checkpoint review.
            </p>
          </div>

          <div className="course-info-card">
            <h2>Designed for</h2>
            <p className="support-copy">
              Learners who want a guided self-paced routine with visible milestones instead of a flat content archive.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
