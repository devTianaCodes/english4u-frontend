import { useEffect, useState } from "react";

const STORAGE_KEY = "english4u-study-preferences";

const defaultPreferences = {
  sessionsPerWeek: 4,
  minutesPerSession: 20,
  focus: "Speaking confidence"
};

function readStoredPreferences() {
  if (typeof window === "undefined") {
    return defaultPreferences;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return defaultPreferences;
  }

  try {
    const parsed = JSON.parse(stored);

    return {
      sessionsPerWeek: Number(parsed.sessionsPerWeek) || defaultPreferences.sessionsPerWeek,
      minutesPerSession: Number(parsed.minutesPerSession) || defaultPreferences.minutesPerSession,
      focus: parsed.focus || defaultPreferences.focus
    };
  } catch {
    return defaultPreferences;
  }
}

export function useStudyPreferences() {
  const [preferences, setPreferences] = useState(readStoredPreferences);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  return {
    preferences,
    setPreferences
  };
}
