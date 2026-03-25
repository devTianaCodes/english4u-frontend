import { Link } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";

const adminAreas = [
  {
    title: "Course management",
    text: "Create, edit, publish, and remove learning paths from the current in-app demo CMS.",
    to: "/admin/courses"
  },
  {
    title: "Levels overview",
    text: "Review course levels and how each path is currently structured for learners.",
    to: "/admin/levels"
  },
  {
    title: "Unit map",
    text: "Browse the units that shape each course and see lesson/checkpoint density.",
    to: "/admin/units"
  },
  {
    title: "Lesson studio",
    text: "Create and refine lesson titles, summaries, durations, and focus areas for each unit.",
    to: "/admin/lessons"
  },
  {
    title: "Learner snapshot",
    text: "Check which sample users and learner states are currently exposed in the demo store.",
    to: "/admin/users"
  }
];

export default function AdminHomePage() {
  return (
    <div className="stack-lg">
      <SectionCard eyebrow="Admin" title="Content operations">
        <p>The admin area will become the internal CMS for course structure, lesson content, quizzes, and learner oversight.</p>
      </SectionCard>

      <div className="grid grid-2">
        {adminAreas.map((area) => (
          <SectionCard
            key={area.title}
            eyebrow="Admin focus"
            title={area.title}
            footer={
              <Link className="button button-ghost" to={area.to}>
                Open
              </Link>
            }
          >
            <p>{area.text}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
