import { useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import WeeklyStudyGraphic from "../components/ui/WeeklyStudyGraphic.jsx";
import { useStudyPreferences } from "../features/progress/useStudyPreferences.js";
import { apiRequest, endpoints } from "../services/api.js";

const focusOptions = [
  "Speaking confidence",
  "Grammar accuracy",
  "Vocabulary growth",
  "Reading fluency"
];

function getFocusReviewPath(focus) {
  if (focus === "Grammar accuracy") {
    return "/review/grammar";
  }

  if (focus === "Vocabulary growth") {
    return "/review/vocabulary";
  }

  return "/review/warm-up";
}

export default function StudyPlanPage() {
  const { preferences, setPreferences } = useStudyPreferences();
  const [studyPlan, setStudyPlan] = useState(preferences);
  const [weeklyActivity, setWeeklyActivity] = useState(null);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadStudyPlan() {
      try {
        const response = await apiRequest(endpoints.studyPlan);

        if (!isCancelled) {
          const nextPlan = response?.studyPlan ?? preferences;
          setStudyPlan(nextPlan);
          setPreferences(nextPlan);
          setWeeklyActivity(response?.weeklyActivity ?? null);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadStudyPlan();

    return () => {
      isCancelled = true;
    };
  }, [preferences, setPreferences]);

  function handleChange(event) {
    const { name, value } = event.target;

    setStudyPlan((current) => ({
      ...current,
      [name]: name === "focus" ? value : Number(value)
    }));
    setSaveMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaveMessage("");
    setIsSaving(true);

    try {
      const response = await apiRequest(endpoints.studyPlan, {
        method: "PUT",
        body: JSON.stringify(studyPlan)
      });
      const nextPlan = response?.studyPlan ?? studyPlan;

      setStudyPlan(nextPlan);
      setPreferences(nextPlan);
      setWeeklyActivity(response?.weeklyActivity ?? null);
      setSaveMessage("Study plan updated for your account.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="stack-lg">
      <section className="study-plan-hero">
        <div className="study-plan-hero-copy">
          <p className="eyebrow">Study plan</p>
          <h1>Set a weekly rhythm you can actually keep</h1>
          <p>
            E4U works better when your weekly pace is clear. Keep sessions realistic, match them to one focus area,
            and watch your recent activity against the plan.
          </p>
          <div className="button-row">
            <Button form="study-plan-page-form" type="submit">
              {isSaving ? "Saving..." : "Save study plan"}
            </Button>
            <Button to="/dashboard" variant="secondary">Back to dashboard</Button>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          {saveMessage ? <p className="success-copy">{saveMessage}</p> : null}
        </div>

        <div className="study-plan-hero-panel">
          <WeeklyStudyGraphic
            days={weeklyActivity?.days}
            goalLabel={`${studyPlan.sessionsPerWeek} sessions`}
            paceLabel={weeklyActivity?.paceLabel ?? "steady"}
          />
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="section-card section-card-featured">
          <p className="eyebrow">Weekly snapshot</p>
          <h2>This week against the plan</h2>
          <div className="stat-row">
            <div className="stat-chip">
              <strong>{weeklyActivity?.completedSessions ?? 0}</strong>
              <span>sessions done</span>
            </div>
            <div className="stat-chip">
              <strong>{weeklyActivity?.plannedSessions ?? studyPlan.sessionsPerWeek}</strong>
              <span>planned sessions</span>
            </div>
            <div className="stat-chip">
              <strong>{weeklyActivity?.completedMinutes ?? 0}</strong>
              <span>minutes done</span>
            </div>
            <div className="stat-chip">
              <strong>{weeklyActivity?.remainingSessions ?? studyPlan.sessionsPerWeek}</strong>
              <span>sessions left</span>
            </div>
          </div>
          <div className="dashboard-focus-strip">
            <span>Pace</span>
            <strong>{weeklyActivity?.paceLabel ?? "Needs attention"}</strong>
          </div>
        </article>

        <article className="section-card">
          <p className="eyebrow">Focus area</p>
          <h2>{studyPlan.focus}</h2>
          <p>
            Keep your next lessons and review sessions aligned with one focus area, so the path feels intentional
            instead of random.
          </p>
          <div className="section-card-footer">
            <Button to={getFocusReviewPath(studyPlan.focus)} variant="secondary">Open focus review</Button>
          </div>
        </article>
      </section>

      <section className="section-card">
        <p className="eyebrow">Plan settings</p>
        <h2>Update your weekly target</h2>
        <form className="form-grid form-grid-double" id="study-plan-page-form" onSubmit={handleSubmit}>
          <label>
            Sessions per week
            <input
              max="7"
              min="1"
              name="sessionsPerWeek"
              onChange={handleChange}
              type="number"
              value={studyPlan.sessionsPerWeek}
            />
          </label>
          <label>
            Minutes per session
            <input
              max="90"
              min="10"
              name="minutesPerSession"
              onChange={handleChange}
              type="number"
              value={studyPlan.minutesPerSession}
            />
          </label>
          <label className="profile-field-span">
            Focus area
            <select name="focus" onChange={handleChange} value={studyPlan.focus}>
              {focusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </form>
      </section>
    </div>
  );
}
