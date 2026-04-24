import { useEffect, useMemo, useState } from "react";
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

const SAVED_JOURNAL_KEY = "e4u-saved-journal-entries";

function loadSavedJournalTitles() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVED_JOURNAL_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export default function JournalPage() {
  const [savedTitles, setSavedTitles] = useState(loadSavedJournalTitles);
  const savedEntries = useMemo(
    () => entries.filter((entry) => savedTitles.includes(entry.title)),
    [savedTitles]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SAVED_JOURNAL_KEY, JSON.stringify(savedTitles));
  }, [savedTitles]);

  function toggleSavedEntry(title) {
    setSavedTitles((current) =>
      current.includes(title) ? current.filter((entry) => entry !== title) : [...current, title]
    );
  }

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

      {savedEntries.length ? (
        <section className="section-card">
          <div className="dashboard-section-heading">
            <div>
              <p className="eyebrow">Saved journal</p>
              <h2>Return to the advice you want to keep</h2>
            </div>
            <p className="support-copy">Saved articles stay on this device so you can revisit the strongest study reminders quickly.</p>
          </div>
          <div className="grid grid-2">
            {savedEntries.map((entry) => (
              <article key={`saved-${entry.title}`} className="journal-card journal-card-large">
                <div className="journal-card-header">
                  <span className="course-card-level">{entry.category}</span>
                  <span className="journal-card-tag">Saved</span>
                </div>
                <h2>{entry.title}</h2>
                <p>{entry.text}</p>
                <div className="section-card-footer">
                  <Button onClick={() => toggleSavedEntry(entry.title)} variant="secondary">Remove</Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid grid-2">
        {entries.map((entry) => (
          <article key={entry.title} className="journal-card journal-card-large">
            <div className="journal-card-header">
              <span className="course-card-level">{entry.category}</span>
              {savedTitles.includes(entry.title) ? <span className="journal-card-tag">Saved</span> : null}
            </div>
            <h2>{entry.title}</h2>
            <p>{entry.text}</p>
            <div className="section-card-footer">
              <Button onClick={() => toggleSavedEntry(entry.title)} variant="secondary">
                {savedTitles.includes(entry.title) ? "Remove from saved" : "Save article"}
              </Button>
            </div>
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
