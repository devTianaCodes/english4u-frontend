import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";

export default function ProtectedRoute({ children, roles }) {
  const { isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="center-panel">
        <p className="eyebrow">Session</p>
        <h2>Checking your access</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
}
