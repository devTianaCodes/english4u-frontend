import SectionCard from "../components/layout/SectionCard.jsx";

const adminAreas = [
  "Content planning",
  "Publishing",
  "Learner analytics",
  "Quiz quality review"
];

export default function AdminHomePage() {
  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Admin" title="Content operations">
        <p>The admin area will become the internal CMS for course structure, lesson content, quizzes, and learner oversight.</p>
      </SectionCard>

      <div className="grid grid-2">
        {adminAreas.map((area) => (
          <SectionCard key={area} eyebrow="Admin focus" title={area}>
            <p>Each section will map to authenticated CRUD flows backed by the Express API and MySQL schema.</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
