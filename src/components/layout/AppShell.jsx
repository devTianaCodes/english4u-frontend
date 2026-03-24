import { NavLink, Outlet } from "react-router-dom";

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
          {adminLinks.map((link) => (
            <NavLink key={link.to} className="nav-link nav-link-muted" to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-actions">
          <NavLink className="button button-ghost" to="/login">
            Log in
          </NavLink>
          <NavLink className="button" to="/register">
            Get started
          </NavLink>
        </div>
      </header>

      <main className="page-frame">
        <Outlet />
      </main>
    </div>
  );
}
