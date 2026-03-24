import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/layout/SectionCard.jsx";
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
    <SectionCard
      eyebrow="Create account"
      title="Start your English path"
      footer={
        <button className="button" disabled={isSubmitting} form="register-form" type="submit">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      }
    >
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
    </SectionCard>
  );
}
