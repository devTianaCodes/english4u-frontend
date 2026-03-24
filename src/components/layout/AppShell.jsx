import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider.jsx";

const learnerLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/courses", label: "Courses" },
  { to: "/onboarding", label: "Placement" },
  { to: "/profile", label: "Profile" }
];

const adminLinks = [
  { to: "/admin", label: "Admin" },
  { to: "/admin/courses", label: "CMS" }
];

export default function AppShell() {
  const navigate = useNavigate();
  const { isLoading, logout, user } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand-mark">E4U</span>
          <span>English4U</span>
        </NavLink>

        <nav className="nav">
          {learnerLinks.map((link) => (
            <NavLink key={link.to} className="nav-link" to={link.to}>
              {link.label}
            </NavLink>
          ))}
          {user?.role === "admin"
            ? adminLinks.map((link) => (
                <NavLink key={link.to} className="nav-link nav-link-muted" to={link.to}>
                  {link.label}
                </NavLink>
              ))
            : null}
        </nav>

        <div className="topbar-actions">
          {isLoading ? (
            <span className="session-pill">Checking session...</span>
          ) : user ? (
            <>
              <span className="session-pill">
                {user.firstName} {user.lastName} · {user.role}
              </span>
              <button className="button button-ghost" onClick={handleLogout} type="button">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink className="button button-ghost" to="/login">
                Log in
              </NavLink>
              <NavLink className="button" to="/register">
                Get started
              </NavLink>
            </>
          )}
        </div>
      </header>

      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}
