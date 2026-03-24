import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

export default function GuestRoute({ children }) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="center-panel">
        <p className="eyebrow">Session</p>
        <h2>Preparing your app</h2>
      </div>
    );
  }

  if (user) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
}
