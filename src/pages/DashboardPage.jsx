import SectionCard from "../components/layout/SectionCard.jsx";
import ProgressRing from "../components/ui/ProgressRing.jsx";

const continueCards = [
  { title: "Continue unit", text: "Unit 3: Everyday habits and time expressions." },
  { title: "Review vocabulary", text: "18 saved words are ready for reinforcement." },
  { title: "Take quiz", text: "The unit checkpoint unlocks after your next lesson." }
];

export default function DashboardPage() {
  return (
    <div className="stack-lg">
      <section className="dashboard-grid">
        <SectionCard eyebrow="Welcome back" title="Your learning dashboard">
          <p>Keep the next action obvious: continue the current unit, finish the lesson, and watch progress move.</p>
        </SectionCard>
        <SectionCard eyebrow="Progress" title="This week">
          <div className="ring-row">
            <ProgressRing value={72} label="Unit progress" />
            <ProgressRing value={86} label="Quiz average" />
          </div>
        </SectionCard>
      </section>

      <div className="grid grid-3">
        {continueCards.map((card) => (
          <SectionCard key={card.title} eyebrow="Continue learning" title={card.title} footer={<button className="button button-ghost">Open</button>}>
            <p>{card.text}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
