import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider.jsx";
import Button from "../ui/Button.jsx";

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
        <div className="topbar-branding">
          <NavLink className="brand" to="/">
            <span className="brand-mark">E4U</span>
            <span className="brand-copy">
              <strong>English4U</strong>
              <small>Professional English paths</small>
            </span>
          </NavLink>
        </div>

        <div className="topbar-center">
          <nav aria-label="Primary navigation" className="nav">
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
        </div>

        <div className="topbar-actions">
          {isLoading ? (
            <span className="session-pill">Checking session...</span>
          ) : user ? (
            <>
              <span className="session-pill">
                {user.firstName} {user.lastName} · {user.role}
              </span>
              <Button onClick={handleLogout} variant="ghost">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="ghost">
                Sign in
              </Button>
              <Button to="/register">
                Get started
              </Button>
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
