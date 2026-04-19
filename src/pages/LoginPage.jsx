import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../components/layout/AuthSplitLayout.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";

function PasswordToggleButton({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      aria-pressed={visible}
      style={{
        position: "absolute",
        top: "50%",
        right: "0.9rem",
        transform: "translateY(-50%)",
        border: 0,
        background: "transparent",
        color: "var(--muted-foreground, #5f6572)",
        cursor: "pointer",
        padding: 0
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: "1.2rem", height: "1.2rem" }}>
        <path d="M2 12c2.6-4.1 6-6.1 10-6.1s7.4 2 10 6.1c-2.6 4.1-6 6.1-10 6.1S4.6 16.1 2 12Z" />
        <circle cx="12" cy="12" r="3.2" />
        {visible ? null : <path d="M4 4l16 16" />}
      </svg>
    </button>
  );
}

function readDemoPayload() {
  if (typeof window === "undefined" || !window.location.hash.startsWith("#demo=")) {
    return null;
  }

  const params = new URLSearchParams(window.location.hash.slice("#demo=".length));
  return {
    email: params.get("email") ?? "",
    password: params.get("password") ?? "",
    redirect: params.get("redirect"),
    autologin: params.get("autologin") === "1"
  };
}

function clearDemoHash() {
  if (typeof window === "undefined" || !window.location.hash.startsWith("#demo=")) {
    return;
  }

  window.history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [demoLogin, setDemoLogin] = useState(null);
  const [demoRedirect, setDemoRedirect] = useState(null);
  const autoLoginStarted = useRef(false);

  useEffect(() => {
    function applyDemoPayload() {
      const payload = readDemoPayload();
      if (!payload) {
        return;
      }

      setFormData({
        email: payload.email,
        password: payload.password
      });
      setDemoRedirect(payload.redirect);

      if (!payload.autologin || !payload.email || !payload.password || autoLoginStarted.current) {
        return;
      }

      autoLoginStarted.current = true;
      clearDemoHash();
      setDemoLogin({
        email: payload.email,
        password: payload.password
      });
    }

    applyDemoPayload();
    window.addEventListener("hashchange", applyDemoPayload);
    return () => window.removeEventListener("hashchange", applyDemoPayload);
  }, []);

  useEffect(() => {
    if (!demoLogin || isSubmitting) {
      return;
    }

    async function runDemoLogin() {
      setError("");
      setIsSubmitting(true);
      try {
        await login(demoLogin);
        navigate(demoRedirect || location.state?.from || "/dashboard");
      } catch (submitError) {
        setError(submitError.message);
        autoLoginStarted.current = false;
      } finally {
        setIsSubmitting(false);
        setDemoLogin(null);
      }
    }

    void runDemoLogin();
  }, [demoLogin, demoRedirect, isSubmitting, location.state, login, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate(demoRedirect || location.state?.from || "/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      eyebrow="Access"
      formId="login-form"
      highlights={[
        {
          label: "Guided path",
          value: "Placement first",
          text: "Resume from the right lesson instead of searching the catalog manually."
        },
        {
          label: "Visible progress",
          value: "Dashboard ready",
          text: "Track streak, study plan, checkpoint results, and next lesson in one place."
        }
      ]}
      highlightsVariant="plain"
      isSubmitting={isSubmitting}
      submitLabel={isSubmitting ? "Logging in..." : "Log in"}
      text="Return to a clear learning dashboard with structured units, focused lessons, and visible weekly momentum."
      title="Welcome back to English4U"
    >
      <div className="stack-sm">
        <h2>Sign in</h2>
        <p className="support-copy">Use your learner or admin account to access your current path.</p>
      </div>

      <form className="form-grid" id="login-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" onChange={handleChange} placeholder="learner@example.com" type="email" value={formData.email} />
        </label>
        <label>
          Password
          <span style={{ position: "relative", display: "block" }}>
            <input
              name="password"
              onChange={handleChange}
              placeholder="••••••••"
              type={isPasswordVisible ? "text" : "password"}
              value={formData.password}
              style={{ paddingRight: "3rem" }}
            />
            <PasswordToggleButton
              visible={isPasswordVisible}
              onToggle={() => setIsPasswordVisible((current) => !current)}
            />
          </span>
        </label>
        {error ? <p className="form-error">{error}</p> : null}
      </form>

      <p className="support-copy">
        New here? <Link className="inline-link" to="/register">Create an account</Link>
      </p>
    </AuthSplitLayout>
  );
}
