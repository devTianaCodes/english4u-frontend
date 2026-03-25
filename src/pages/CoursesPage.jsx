import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
import { apiRequest, endpoints } from "../services/api.js";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadCourses() {
      try {
        const response = await apiRequest(endpoints.courses);

        if (!isCancelled) {
          setCourses(response?.items ?? []);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadCourses();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Catalog" title="Courses by level">
        <p>Levels are organized so learners can move from foundations into more confident conversation and comprehension.</p>
        {error ? <p className="form-error">{error}</p> : null}
      </SectionCard>

      <div className="grid grid-3">
        {courses.map((course) => (
          <SectionCard
            key={course.id}
            eyebrow="Course"
            title={course.title}
            footer={
              <Link className="button button-ghost" to={`/courses/${course.id}`}>
                View course
              </Link>
            }
          >
            <p>{course.summary ?? `Structured ${course.level} learning path with guided units and quizzes.`}</p>
            <div className="stat-row stat-row-compact">
              <div className="stat-chip">
                <strong>{course.unitCount ?? 0}</strong>
                <span>units</span>
              </div>
              <div className="stat-chip">
                <strong>{course.lessonCount ?? 0}</strong>
                <span>lessons</span>
              </div>
            </div>
            <p className="support-copy">
              {course.intensity ?? "Guided path"} · {course.estimatedWeeks ?? 4} week track
            </p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
