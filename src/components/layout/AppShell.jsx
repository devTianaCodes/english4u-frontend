import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider.jsx";
import { useTheme } from "../../features/theme/useTheme.js";
import Button from "../ui/Button.jsx";

const learnerLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/courses", label: "Courses" },
  { to: "/journal", label: "Journal" },
  { to: "/grammar", label: "Grammar" },
  { to: "/review", label: "Review" },
  { to: "/study-plan", label: "Study plan" },
  { to: "/certificates", label: "Certificates" },
  { to: "/settings", label: "Settings" },
  { to: "/onboarding", label: "Placement" },
  { to: "/profile", label: "Profile" }
];

const adminLinks = [
  { to: "/admin", label: "Admin" },
  { to: "/admin/courses", label: "CMS" }
];

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

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

        <button
          aria-expanded={isMobileNavOpen}
          aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
          className="mobile-nav-toggle"
          onClick={() => setIsMobileNavOpen((current) => !current)}
          type="button"
        >
          {isMobileNavOpen ? "Close" : "Menu"}
        </button>

        <div className={`topbar-drawer ${isMobileNavOpen ? "topbar-drawer-open" : ""}`}>
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
            <button
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="theme-toggle"
              onClick={toggleTheme}
              type="button"
            >
              {isDark ? "Light mode" : "Dark mode"}
            </button>
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
        </div>
      </header>

      <main className="page-frame page-enter" id="main-content" tabIndex="-1">
        <Outlet />
      </main>
    </div>
  );
}
