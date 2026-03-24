import { Link, useParams } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";

const units = [
  "Introductions and personal details",
  "Daily routines and frequency",
  "Shopping, prices, and preferences"
];

export default function CourseDetailPage() {
  const { courseId } = useParams();

  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Course detail" title={courseId}>
        <p>This screen will eventually render course metadata, prerequisites, and unit-level progress from the backend.</p>
      </SectionCard>

      <div className="grid grid-2">
        {units.map((unit, index) => (
          <SectionCard
            key={unit}
            eyebrow={`Unit 0${index + 1}`}
            title={unit}
            footer={
              <Link className="button button-ghost" to={`/lessons/${courseId}-lesson-${index + 1}`}>
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
