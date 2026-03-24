import SectionCard from "../components/layout/SectionCard.jsx";

export default function ProfilePage() {
  return (
    <div className="grid grid-2">
      <SectionCard eyebrow="Profile" title="Learner settings">
        <p>Future work will add profile editing, daily goals, and course preferences.</p>
      </SectionCard>
      <SectionCard eyebrow="Account" title="Progress summary">
        <p>Keep recent streaks, completed units, and recommendation history visible in one place.</p>
      </SectionCard>
    </div>
  );
}
