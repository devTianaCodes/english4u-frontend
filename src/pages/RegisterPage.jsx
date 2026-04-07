import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthSplitLayout from "../components/layout/AuthSplitLayout.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
      await register(formData);
      navigate("/onboarding");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      eyebrow="Create account"
      formId="register-form"
      highlights={[
        {
          label: "Placement test",
          value: "15 minutes",
          text: "Start with a quick level check and enter the right course without guessing."
        },
        {
          label: "Structured course",
          value: "Short units",
          text: "Build confidence with guided lessons, checkpoint quizzes, and visible next steps."
        }
      ]}
      isSubmitting={isSubmitting}
      submitLabel={isSubmitting ? "Creating account..." : "Create account"}
      text="Set up your profile, unlock your first placement path, and start a cleaner English-learning routine."
      title="Create your English4U account"
    >
      <div className="stack-sm">
        <h2>Start your English path</h2>
        <p className="support-copy">Create a learner account and continue directly to onboarding.</p>
      </div>

      <form className="form-grid form-grid-double" id="register-form" onSubmit={handleSubmit}>
        <label>
          First name
          <input name="firstName" onChange={handleChange} placeholder="Alex" type="text" value={formData.firstName} />
        </label>
        <label>
          Last name
          <input name="lastName" onChange={handleChange} placeholder="Morgan" type="text" value={formData.lastName} />
        </label>
        <label>
          Email
          <input name="email" onChange={handleChange} placeholder="alex@example.com" type="email" value={formData.email} />
        </label>
        <label>
          Password
          <input name="password" onChange={handleChange} placeholder="Create a password" type="password" value={formData.password} />
        </label>
        {error ? <p className="form-error form-error-span">{error}</p> : null}
      </form>

      <p className="support-copy">
        Already registered? <Link className="inline-link" to="/login">Sign in</Link>
      </p>
    </AuthSplitLayout>
  );
}
