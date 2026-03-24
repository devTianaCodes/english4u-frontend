import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
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
    <SectionCard
      eyebrow="Access"
      title="Welcome back"
      footer={
        <button className="button" disabled={isSubmitting} form="login-form" type="submit">
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      }
    >
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
    </SectionCard>
  );
}
