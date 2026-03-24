import SectionCard from "../components/layout/SectionCard.jsx";

export default function LoginPage() {
  return (
    <SectionCard eyebrow="Access" title="Welcome back" footer={<button className="button">Log in</button>}>
      <form className="form-grid">
        <label>
          Email
          <input placeholder="learner@example.com" type="email" />
        </label>
        <label>
          Password
          <input placeholder="••••••••" type="password" />
        </label>
      </form>
    </SectionCard>
  );
}
