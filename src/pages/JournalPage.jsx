import Button from "../components/ui/Button.jsx";

const entries = [
  {
    category: "Study habits",
    title: "How to keep English alive during a busy week",
    text: "Use three short sessions, one review lane, and one checkpoint goal instead of waiting for a perfect long study day."
  },
  {
    category: "Placement",
    title: "What your level test should change next",
    text: "A good placement result should affect your path, your first review lane, and your certificate expectations."
  },
  {
    category: "Grammar support",
    title: "Fix grammar without freezing your progress",
    text: "Use grammar review as support, not as a reason to stop moving through the lesson path."
  },
  {
    category: "Certificates",
    title: "Build a stronger certificate story before the exam",
    text: "Consistency, checkpoint results, and lesson completion create a better readiness signal than random practice alone."
  }
];

export default function JournalPage() {
  return (
    <div className="stack-lg">
      <section className="section-card section-card-featured">
        <p className="eyebrow">Learning journal</p>
        <h1>Tips, updates, and English learning guidance</h1>
        <p>
          This journal gives E4U a small editorial layer inspired by academy-style sites: practical study advice,
          placement guidance, and certificate-focused learning tips.
        </p>
      </section>

      <section className="grid grid-2">
        {entries.map((entry) => (
          <article key={entry.title} className="journal-card journal-card-large">
            <span className="course-card-level">{entry.category}</span>
            <h2>{entry.title}</h2>
            <p>{entry.text}</p>
          </article>
        ))}
      </section>

      <section className="section-card">
        <p className="eyebrow">Next move</p>
        <h2>Turn advice into action</h2>
        <div className="section-card-footer">
          <Button to="/onboarding">Take placement test</Button>
          <Button to="/courses" variant="secondary">Browse courses</Button>
        </div>
      </section>
    </div>
  );
}
