import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
import { apiRequest } from "../services/api.js";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadCourse() {
      try {
        const response = await apiRequest(`/courses/${courseId}`);

        if (!isCancelled) {
          setCourse(response);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadCourse();

    return () => {
      isCancelled = true;
    };
  }, [courseId]);

  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Course detail" title={course?.title ?? courseId}>
        <p>
          {course
            ? `${course.level} track with ${course.units.length} units currently scaffolded on the backend.`
            : "Loading course metadata from the backend."}
        </p>
        {error ? <p className="form-error">{error}</p> : null}
      </SectionCard>

      <div className="grid grid-2">
        {(course?.units ?? []).map((unit, index) => (
          <SectionCard
            key={unit.id}
            eyebrow={`Unit 0${index + 1}`}
            title={unit.title}
            footer={
              <Link className="button button-ghost" to={`/lessons/${unit.id}-lesson-${index + 1}`}>
                Open lesson
              </Link>
            }
          >
            <p>Short lessons, review loops, and a checkpoint quiz at the end of the unit.</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
