import { Link } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";

const courses = [
  { id: "a1-foundations", title: "A1 Foundations", summary: "Introduce everyday vocabulary and simple sentence patterns." },
  { id: "a2-confidence", title: "A2 Confidence", summary: "Build practical fluency for routines, travel, and conversations." },
  { id: "b1-progress", title: "B1 Progress", summary: "Strengthen grammar control and reading comprehension." }
];

export default function CoursesPage() {
  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Catalog" title="Courses by level">
        <p>Levels are organized so learners can move from foundations into more confident conversation and comprehension.</p>
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
            <p>{course.summary}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
