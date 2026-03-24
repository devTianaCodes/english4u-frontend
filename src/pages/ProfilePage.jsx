import { useEffect, useState } from "react";
import SectionCard from "../components/layout/SectionCard.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";
import { apiRequest, endpoints } from "../services/api.js";

export default function ProfilePage() {
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
    </div>
  );
}
