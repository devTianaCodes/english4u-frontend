import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../components/layout/AuthSplitLayout.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";

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
      navigate(location.state?.from ?? "/dashboard");
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
          <input name="password" onChange={handleChange} placeholder="••••••••" type="password" value={formData.password} />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
      </form>

      <p className="support-copy">
        New here? <Link className="inline-link" to="/register">Create an account</Link>
      </p>
    </AuthSplitLayout>
  );
}
