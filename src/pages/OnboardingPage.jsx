import SectionCard from "../components/layout/SectionCard.jsx";

const placementAreas = ["Grammar range", "Vocabulary confidence", "Reading comfort", "Daily study goal"];

export default function OnboardingPage() {
  return (
    <div className="stack-lg">
      <SectionCard
        eyebrow="Onboarding"
        title="Placement flow"
        footer={<button className="button">Begin placement test</button>}
      >
        <p>
          The first release uses a compact placement test to recommend the right learning path before the learner sees
          the dashboard.
        </p>
      </SectionCard>

      <div className="grid grid-2">
        {placementAreas.map((area, index) => (
          <SectionCard key={area} eyebrow={`Step 0${index + 1}`} title={area}>
            <p>Collect enough signal to recommend A1, A2, B1, or B2 entry points without overwhelming new users.</p>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
