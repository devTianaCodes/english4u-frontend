import { useEffect, useState } from "react";
import Button from "../components/ui/Button.jsx";
import SectionCard from "../components/layout/SectionCard.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";
import { apiRequest, endpoints } from "../services/api.js";

const settingsAreas = [
  {
    title: "Profile details",
    text: "Review account identity, role, and placement summary.",
    to: "/profile",
    cta: "Open"
  },
  {
    title: "Study plan",
    text: "Tune weekly sessions, minutes, and learning focus.",
    to: "/study-plan",
    cta: "Open"
  },
  {
    title: "Placement",
    text: "Retake the level check and compare your recent placement trend.",
    to: "/onboarding",
    cta: "Open"
  }
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

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

  const name = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ")
    : user?.email ?? "Current learner";

  return (
    <div className="stack-lg">
      <section className="section-card section-card-featured">
        <p className="eyebrow">Settings</p>
        <h1>Learning preferences and account controls</h1>
        <p>
          Keep learner settings grouped in one place: account details, study rhythm, and placement calibration.
        </p>
      </section>

      <section className="dashboard-grid">
        {settingsAreas.map((area) => (
          <article key={area.title} className="section-card">
            <p className="eyebrow">Settings area</p>
            <h2>{area.title}</h2>
            <p>{area.text}</p>
            <div className="section-card-footer">
              <Button to={area.to} variant="secondary">{area.cta}</Button>
            </div>
          </article>
        ))}
      </section>

      <section className="grid grid-2" id="account-details">
        <SectionCard eyebrow="Account" title="Profile details">
          <p>{name}</p>
          <p className="support-copy">
            {profile ? `${profile.email} · ${profile.role}` : `${user?.email ?? "Current learner"} · ${user?.role ?? "student"}`}
          </p>
          {error ? <p className="form-error">{error}</p> : null}
        </SectionCard>

        <SectionCard eyebrow="Placement" title="Level summary">
          <p>Target level: {profile?.targetLevel ?? "Not set yet"}.</p>
          {profile?.placementScore !== null && profile?.placementScore !== undefined ? (
            <p className="support-copy">
              Latest placement score: {profile.placementScore}
              {profile?.placementTakenAt ? ` · ${new Date(profile.placementTakenAt).toLocaleDateString()}` : ""}
            </p>
          ) : (
            <p className="support-copy">No placement result saved yet. Complete onboarding to personalize the path.</p>
          )}
          <div className="section-card-footer">
            <Button to="/onboarding" variant="secondary">Open placement</Button>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}
