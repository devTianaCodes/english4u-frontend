import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
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

  return (
    <div className="stack-lg">
      <SectionCard
        eyebrow="Course detail"
        title={course?.title ?? courseId}
        footer={
          course ? (
            <Link className="button" to={`/lessons/${course.units[0]?.lessons[0]?.id ?? ""}`}>
              Start first lesson
            </Link>
          ) : null
        }
      >
        <div className="course-hero">
          <div className="stack-lg">
            <p>
              {course
                ? `${course.level} track with ${course.unitCount} units and ${course.lessonCount} lessons. ${course.summary}`
                : "Loading course metadata from the backend."}
            </p>
            {course ? (
              <div className="stat-row stat-row-compact">
                <div className="stat-chip">
                  <strong>{course.unitCount}</strong>
                  <span>units</span>
                </div>
                <div className="stat-chip">
                  <strong>{course.lessonCount}</strong>
                  <span>lessons</span>
                </div>
                <div className="stat-chip">
                  <strong>{course.estimatedWeeks}</strong>
                  <span>weeks</span>
                </div>
              </div>
            ) : null}
            {course ? <p className="support-copy">{course.intensity}</p> : null}
          </div>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
      </SectionCard>

      <div className="stack-lg">
        {(course?.units ?? []).map((unit, index) => (
          <SectionCard
            key={unit.id}
            eyebrow={unit.positionLabel ?? `Unit 0${index + 1}`}
            title={unit.title}
          >
            <p>{unit.summary}</p>
            <p className="support-copy">
              {unit.lessonCount} lessons · {unit.checkpointLabel}
            </p>
            <div className="lesson-list">
              {unit.lessons.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="lesson-row">
                  <div>
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
                  <Link className="button button-ghost" to={`/lessons/${lesson.id}`}>
                    {completedLessonSlugs.has(lesson.id) ? "Review lesson" : "Open lesson"}
                  </Link>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
