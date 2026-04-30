import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

export default function GuestRoute({ children }) {
  const { isLoading, user } = useAuth();
  const location = useLocation();
  const browserHash = typeof window === "undefined" ? "" : window.location.hash;
  const isDemoLogin = location.hash.startsWith("#demo=") || browserHash.startsWith("#demo=");

  if (isLoading) {
    return (
      <div className="center-panel">
        <p className="eyebrow">Session</p>
        <h2>Preparing your app</h2>
      </div>
    );
  }

  if (user && !isDemoLogin) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
}
