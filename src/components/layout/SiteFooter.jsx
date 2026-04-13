import { Link } from "react-router-dom";

const exploreLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/courses", label: "Courses" },
  { to: "/review", label: "Review" },
  { to: "/grammar", label: "Grammar" },
  { to: "/journal", label: "Journal" }
];

const schoolLinks = [
  { to: "/study-plan", label: "Study plan" },
  { to: "/certificates", label: "Certificates" },
  { to: "/onboarding", label: "Placement test" },
  { to: "/settings", label: "Settings" }
];

const socialLinks = [
  { href: "https://www.instagram.com/", label: "Instagram", icon: InstagramIcon },
  { href: "https://www.facebook.com/", label: "Facebook", icon: FacebookIcon },
  { href: "https://www.linkedin.com/", label: "LinkedIn", icon: LinkedInIcon },
  { href: "https://www.youtube.com/", label: "YouTube", icon: YouTubeIcon }
];

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.7" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.2" cy="6.9" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M13.5 20v-6h2.6l.4-3h-3v-1.9c0-.9.3-1.5 1.6-1.5h1.5V5a18 18 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4.1V11H8v3h2.9v6Z" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6.7 8.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Zm-1.5 11V9.8h3v9.4Zm4.9 0V9.8H13v1.4h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5v4.7h-3v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3Z" fill="currentColor" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M21 12.1c0-2.2-.2-3.7-.6-4.5-.3-.6-.8-1-1.4-1.2C18.1 6 12 6 12 6s-6.1 0-7 .4c-.6.2-1.1.6-1.4 1.2C3.2 8.4 3 9.9 3 12.1s.2 3.7.6 4.5c.3.6.8 1 1.4 1.2.9.4 7 .4 7 .4s6.1 0 7-.4c.6-.2 1.1-.6 1.4-1.2.4-.8.6-2.3.6-4.5ZM10.3 15.4V8.8l5.1 3.3Z" fill="currentColor" />
    </svg>
  );
}

function FooterLinkGroup({ title, links }) {
  return (
    <div className="footer-link-group">
      <p className="footer-label">{title}</p>
      <div className="footer-link-list">
        {links.map((link) => (
          <Link key={link.to} className="footer-link" to={link.to}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer-shell">
        <div className="site-footer-main">
          <section className="footer-brand-block">
            <Link className="footer-brand" to="/">
              <span className="brand-mark footer-brand-mark">E4U</span>
              <span className="brand-copy footer-brand-copy">
                <strong>English4U</strong>
                <small>Professional English paths for focused learners.</small>
              </span>
            </Link>

            <div className="footer-contact-block">
              <p className="footer-label">English4U School</p>
              <a
                className="footer-contact-link"
                href="https://www.google.com/maps/search/?api=1&query=Via+Monte+Napoleone+18,+20121+Milan,+Italy"
                rel="noreferrer"
                target="_blank"
              >
                Via Monte Napoleone 18
                <br />
                20121 Milan, Italy
              </a>
              <a className="footer-contact-link" href="tel:+390294753180">
                +39 02 9475 3180
              </a>
              <a className="footer-contact-link" href="mailto:hello@english4u.school">
                hello@english4u.school
              </a>
            </div>
          </section>

          <FooterLinkGroup links={exploreLinks} title="Explore" />

          <section className="footer-link-group">
            <FooterLinkGroup links={schoolLinks} title="School" />
            <div className="footer-social-block">
              <p className="footer-label">Follow</p>
              <div className="footer-social-row">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    aria-label={`Open ${label}`}
                    className="footer-social-link"
                    href={href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="site-footer-meta">
          <p>© 2025 English4U School. All rights reserved.</p>
          <p>Made for practical English learning.</p>
        </div>
      </div>
    </footer>
  );
}
