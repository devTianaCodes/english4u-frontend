import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthProvider.jsx";
import { useTheme } from "../../features/theme/useTheme.js";
import Button from "../ui/Button.jsx";
import SiteFooter from "./SiteFooter.jsx";

const guestLinks = [
  { to: "/courses", label: "Courses" },
  { to: "/journal", label: "Journal" }
];

const learnerLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/courses", label: "Courses" },
  { to: "/review", label: "Review" },
  { to: "/grammar", label: "Grammar" }
];

const learnerTools = [
  { to: "/study-plan", label: "Study plan" },
  { to: "/certificates", label: "Certificates" },
  { to: "/onboarding", label: "Placement" },
  { to: "/journal", label: "Journal" }
];

const adminLinks = [
  { to: "/admin", label: "Admin" },
  { to: "/admin/courses", label: "CMS" }
];

function ThemeIcon({ isDark }) {
  return isDark ? (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.657 5.657 1.414 1.414M4.929 4.929l1.414 1.414m11.314-1.414-1.414 1.414M6.343 17.657l-1.414 1.414M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20 15.3A8 8 0 0 1 8.7 4 8.4 8.4 0 1 0 20 15.3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m9.6 3.2.5 2a7.8 7.8 0 0 1 3.8 0l.5-2 2.4 1.4-.9 1.9a8 8 0 0 1 2.7 2.7l1.9-.9 1.4 2.4-2 .5a7.8 7.8 0 0 1 0 3.8l2 .5-1.4 2.4-1.9-.9a8 8 0 0 1-2.7 2.7l.9 1.9-2.4 1.4-.5-2a7.8 7.8 0 0 1-3.8 0l-.5 2-2.4-1.4.9-1.9a8 8 0 0 1-2.7-2.7l-1.9.9-1.4-2.4 2-.5a7.8 7.8 0 0 1 0-3.8l-2-.5 1.4-2.4 1.9.9a8 8 0 0 1 2.7-2.7l-.9-1.9Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MenuIcon({ isOpen }) {
  return isOpen ? (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M10 17 15 12 10 7M15 12H4m6-8h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const primaryLinks = user ? learnerLinks : guestLinks;

  async function handleLogout() {
    setIsAccountMenuOpen(false);
    await logout();
    navigate("/");
  }

  useEffect(() => {
    setIsMobileNavOpen(false);
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountMenuOpen]);

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

        <div className="topbar-center">
          <nav aria-label="Primary navigation" className="nav">
            {primaryLinks.map((link) => (
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
            className="topbar-icon-button theme-toggle"
            onClick={toggleTheme}
            type="button"
          >
            <ThemeIcon isDark={isDark} />
          </button>

          {user ? (
            <>
              <NavLink
                aria-label="Open settings"
                className={({ isActive }) =>
                  `topbar-icon-button topbar-settings-link${isActive ? " topbar-icon-button-active" : ""}`
                }
                to="/settings"
              >
                <SettingsIcon />
              </NavLink>

              <div className="topbar-account" ref={accountMenuRef}>
                <button
                  aria-controls="header-account-menu"
                  aria-expanded={isAccountMenuOpen}
                  aria-label="Open account menu"
                  className="topbar-icon-button topbar-account-trigger"
                  onClick={() => setIsAccountMenuOpen((current) => !current)}
                  type="button"
                >
                  <UserIcon />
                </button>

                {isAccountMenuOpen ? (
                  <div className="account-menu" id="header-account-menu" role="menu">
                    <div className="account-menu-header">
                      <strong>{[user.firstName, user.lastName].filter(Boolean).join(" ") || "User"}</strong>
                      <span>{user.role}</span>
                    </div>

                    <div className="account-menu-group">
                      <NavLink className="account-menu-link" role="menuitem" to="/settings">
                        <SettingsIcon />
                        <span>Account settings</span>
                      </NavLink>
                      {learnerTools.map((link) => (
                        <NavLink key={link.to} className="account-menu-link" role="menuitem" to={link.to}>
                          <span>{link.label}</span>
                        </NavLink>
                      ))}
                    </div>

                    <button className="account-menu-button" onClick={handleLogout} type="button">
                      <LogoutIcon />
                      <span>Log out</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : isLoading ? (
            <span className="topbar-status">Checking session…</span>
          ) : (
            <div className="topbar-auth-actions">
              <Button to="/login" variant="ghost">
                Sign in
              </Button>
              <Button to="/register">Get started</Button>
            </div>
          )}

          <button
            aria-expanded={isMobileNavOpen}
            aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
            className="topbar-icon-button mobile-nav-toggle"
            onClick={() => setIsMobileNavOpen((current) => !current)}
            type="button"
          >
            <MenuIcon isOpen={isMobileNavOpen} />
          </button>
        </div>

        <div className={`topbar-drawer ${isMobileNavOpen ? "topbar-drawer-open" : ""}`}>
          <section className="topbar-drawer-section">
            <p className="topbar-drawer-label">Navigation</p>
            <nav aria-label="Mobile navigation" className="drawer-link-list">
              {primaryLinks.map((link) => (
                <NavLink key={link.to} className="drawer-link" to={link.to}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </section>

          {user ? (
            <section className="topbar-drawer-section">
              <p className="topbar-drawer-label">Learning tools</p>
              <div className="drawer-link-list">
                <NavLink className="drawer-link" to="/settings">
                  Settings
                </NavLink>
                {learnerTools.map((link) => (
                  <NavLink key={link.to} className="drawer-link" to={link.to}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </section>
          ) : null}

          {user?.role === "admin" ? (
            <section className="topbar-drawer-section">
              <p className="topbar-drawer-label">Admin</p>
              <div className="drawer-link-list">
                {adminLinks.map((link) => (
                  <NavLink key={link.to} className="drawer-link" to={link.to}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </section>
          ) : null}

          <section className="topbar-drawer-section topbar-drawer-actions">
            <p className="topbar-drawer-label">{user ? "Session" : "Access"}</p>
            {user ? (
              <>
                <div className="topbar-drawer-user">
                  <strong>{[user.firstName, user.lastName].filter(Boolean).join(" ") || "User"}</strong>
                  <span>{user.role}</span>
                </div>
                <Button onClick={handleLogout} variant="ghost">
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button to="/login" variant="ghost">
                  Sign in
                </Button>
                <Button to="/register">Get started</Button>
              </>
            )}
          </section>
        </div>
      </header>

      <main className="page-frame page-enter" id="main-content" tabIndex="-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  );
}
