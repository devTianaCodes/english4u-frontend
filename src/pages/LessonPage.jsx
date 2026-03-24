import { Link, useParams } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";

const blocks = [
  "Warm-up prompt",
  "Grammar concept",
  "Vocabulary list",
  "Reading example",
  "Quick practice"
];

export default function LessonPage() {
  const { lessonId } = useParams();

  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Lesson" title={lessonId} footer={<Link className="button" to={`/quizzes/${lessonId}-quiz`}>Finish with quiz</Link>}>
        <p>The final lesson page will compose content blocks pulled from the admin-authored lesson model.</p>
      </SectionCard>

      <div className="grid grid-2">
        {blocks.map((block) => (
          <SectionCard key={block} eyebrow="Lesson block" title={block}>
            <p>Each block is intentionally short to make the learning flow feel achievable and focused.</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
