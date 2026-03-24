import { useEffect, useState } from "react";
import SectionCard from "../components/layout/SectionCard.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";
import { useStudyPreferences } from "../features/progress/useStudyPreferences.js";
import { apiRequest, endpoints } from "../services/api.js";

export default function ProfilePage() {
  const { user } = useAuth();
  const { preferences, setPreferences } = useStudyPreferences();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [formState, setFormState] = useState(preferences);

  useEffect(() => {
    let isCancelled = false;

    async function loadProfile() {
      try {
        const response = await apiRequest(endpoints.profile);

        if (!isCancelled) {
          setProfile(response?.profile ?? null);
        }
      } catch (loadError) {
        if (!isCancelled) {
          setError(loadError.message);
        }
      }
    }

    loadProfile();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    setFormState(preferences);
  }, [preferences]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormState((current) => ({
      ...current,
      [name]: name === "focus" ? value : Number(value)
    }));
    setSaveMessage("");
  }

  function handleSave(event) {
    event.preventDefault();
    setPreferences(formState);
    setSaveMessage("Study preferences saved on this device.");
  }

  return (
    <div className="grid grid-2">
      <SectionCard eyebrow="Profile" title="Learner settings">
        <p>
          {profile
            ? `${profile.firstName} ${profile.lastName} is currently enrolled as a ${profile.role} account.`
            : `Signed in as ${user?.email ?? "an active learner"}.`}
        </p>
        {error ? <p className="form-error">{error}</p> : null}
      </SectionCard>
      <SectionCard eyebrow="Account" title="Progress summary">
        <p>Target level: {profile?.targetLevel ?? "B1"}. Future work will add editable goals and daily study preferences.</p>
      </SectionCard>
      <SectionCard
        eyebrow="Study plan"
        title="Weekly learning preferences"
        footer={
          <button className="button" form="study-plan-form" type="submit">
            Save preferences
          </button>
        }
      >
        <form className="form-grid form-grid-double" id="study-plan-form" onSubmit={handleSave}>
          <label>
            Sessions per week
            <input
              max="7"
              min="1"
              name="sessionsPerWeek"
              onChange={handleChange}
              type="number"
              value={formState.sessionsPerWeek}
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
              value={formState.minutesPerSession}
            />
          </label>
          <label className="profile-field-span">
            Focus area
            <select name="focus" onChange={handleChange} value={formState.focus}>
              <option>Speaking confidence</option>
              <option>Grammar accuracy</option>
              <option>Vocabulary growth</option>
              <option>Reading fluency</option>
            </select>
          </label>
        </form>
        {saveMessage ? <p className="success-copy">{saveMessage}</p> : null}
      </SectionCard>
    </div>
  );
}
